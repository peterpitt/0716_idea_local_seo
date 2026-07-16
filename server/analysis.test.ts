import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createAnalysisSession: vi.fn().mockResolvedValue(42),
  getAnalysisSession: vi.fn().mockImplementation(async (id: number) => {
    if (id === 42) {
      return {
        id: 42,
        userId: 1,
        idea: "AI 健身教練",
        stage1: "Stage 1 content about debate",
        stage2: "Stage 2 content about strategy",
        stage3: "Stage 3 content about blueprint",
        stage4: "Stage 4 content about AI commands",
        stage5: "Stage 5 content about marketing",
        status: "completed",
        createdAt: new Date("2024-01-15T10:00:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      };
    }
    if (id === 43) {
      return {
        id: 43,
        userId: 2, // different user
        idea: "Other user idea",
        stage1: "content",
        stage2: null,
        stage3: null,
        stage4: null,
        stage5: null,
        status: "stage1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }),
  getUserSessions: vi.fn().mockResolvedValue([
    {
      id: 42,
      userId: 1,
      idea: "AI 健身教練",
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 41,
      userId: 1,
      idea: "自動化電商",
      status: "stage2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  updateSessionStage: vi.fn(),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("analysis.startSession", () => {
  it("creates a new analysis session and returns sessionId", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.startSession({ idea: "AI 健身教練 App" });

    expect(result).toEqual({ sessionId: 42 });
  });

  it("rejects empty idea", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.analysis.startSession({ idea: "" })).rejects.toThrow();
  });
});

describe("analysis.getSession", () => {
  it("returns session data for valid session owned by user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.getSession({ id: 42 });

    expect(result).not.toBeNull();
    expect(result?.id).toBe(42);
    expect(result?.idea).toBe("AI 健身教練");
  });

  it("returns null for session owned by another user", async () => {
    const ctx = createAuthContext(1); // user id 1
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.getSession({ id: 43 }); // owned by user 2

    expect(result).toBeNull();
  });
});

describe("analysis.listSessions", () => {
  it("returns list of user sessions", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.listSessions();

    expect(result).toHaveLength(2);
    expect(result[0].idea).toBe("AI 健身教練");
    expect(result[1].idea).toBe("自動化電商");
  });
});

describe("analysis.exportReport", () => {
  it("returns formatted markdown report for completed session", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.exportReport({ id: 42 });

    expect(result).not.toBeNull();
    expect(result?.markdown).toContain("一人公司頂級 AI 專家智囊團");
    expect(result?.markdown).toContain("AI 健身教練");
    expect(result?.markdown).toContain("群雄激辯");
    expect(result?.markdown).toContain("戰略收斂");
    expect(result?.markdown).toContain("落地藍圖");
    expect(result?.markdown).toContain("AI 執行指令");
    expect(result?.markdown).toContain("AI 行銷與全自動變現引擎");
    expect(result?.markdown).toContain("Stage 1 content about debate");
    expect(result?.markdown).toContain("Stage 5 content about marketing");
    expect(result?.idea).toBe("AI 健身教練");
  });

  it("returns null for session owned by another user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.exportReport({ id: 43 });

    expect(result).toBeNull();
  });

  it("returns null for non-existent session", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.exportReport({ id: 999 });

    expect(result).toBeNull();
  });
});
