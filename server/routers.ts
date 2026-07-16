import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserSessions, getAnalysisSession, createAnalysisSession, updateUserSubscription } from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    upgradeToPremium: protectedProcedure.mutation(async ({ ctx }) => {
      await updateUserSubscription(ctx.user.id, "premium");
      return { success: true };
    }),
    downgradeToFree: protectedProcedure.mutation(async ({ ctx }) => {
      await updateUserSubscription(ctx.user.id, "free");
      return { success: true };
    }),
  }),

  analysis: router({
    startSession: protectedProcedure
      .input(z.object({ idea: z.string().min(1).max(50000) }))
      .mutation(async ({ ctx, input }) => {
        const isPremium = ctx.user.subscriptionStatus === "premium";
        if (!isPremium && input.idea.length > 2000) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "免費版點子長度限制為 2000 字，請升級 Premium 解鎖 50000 字上限。",
          });
        }
        const sessionId = await createAnalysisSession({
          userId: ctx.user.id,
          idea: input.idea,
          status: "pending",
        });
        return { sessionId };
      }),

    getSession: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const session = await getAnalysisSession(input.id);
        if (!session || session.userId !== ctx.user.id) {
          return null;
        }
        return session;
      }),

    listSessions: protectedProcedure.query(async ({ ctx }) => {
      return getUserSessions(ctx.user.id);
    }),

    exportReport: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const session = await getAnalysisSession(input.id);
        if (!session || session.userId !== ctx.user.id) {
          return null;
        }
        if (session.status !== "completed") {
          return null;
        }

        const stageNames = ["群雄激辯", "戰略收斂", "落地藍圖", "AI 執行指令", "AI 行銷與全自動變現引擎"];
        const stageIcons = ["⚔️", "🎯", "📋", "🤖", "💰"];
        const stages = [session.stage1, session.stage2, session.stage3, session.stage4, session.stage5];

        let markdown = `# 🧠 一人公司頂級 AI 專家智囊團 — 創業分析報告\n\n`;
        markdown += `> **創業點子：** ${session.idea}\n\n`;
        markdown += `> **分析日期：** ${new Date(session.createdAt).toLocaleString("zh-TW")}\n\n`;
        markdown += `---\n\n`;

        for (let i = 0; i < 5; i++) {
          markdown += `## ${stageIcons[i]} 階段 ${i + 1}：${stageNames[i]}\n\n`;
          markdown += `${stages[i] || "（尚未完成）"}\n\n`;
          if (i < 4) markdown += `---\n\n`;
        }

        markdown += `\n---\n\n`;
        markdown += `*本報告由「一人公司頂級 AI 專家智囊團」系統自動生成，由 12 位 AI 專家角色進行多階段深度分析。*\n`;

        return { markdown, idea: session.idea, createdAt: session.createdAt };
      }),
  }),
});

export type AppRouter = typeof appRouter;
