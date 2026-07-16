import { Request, Response } from "express";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { getStage1Prompt, getStage2Prompt, getStage3Prompt, getStage4Prompt, getStage5Prompt } from "./prompts";
import { createAnalysisSession, getAnalysisSession, updateSessionStage } from "./db";

const resolveApiUrl = () =>
  ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";

async function authenticateUser(req: Request) {
  try {
    return await sdk.authenticateRequest(req);
  } catch {
    return null;
  }
}

async function streamLLMResponse(
  systemPrompt: string,
  res: Response,
  onComplete: (fullContent: string) => Promise<void>
): Promise<string> {
  const apiUrl = resolveApiUrl();

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "請開始分析。" },
      ],
      stream: true,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let fullContent = "";
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch {
          // skip malformed JSON
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  await onComplete(fullContent);
  return fullContent;
}

export function registerStreamingRoutes(app: import("express").Express) {
  // Stream a specific stage (authenticated, ownership-verified)
  app.get("/api/analysis/:sessionId/stream/:stage", async (req: Request, res: Response) => {
    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { sessionId, stage } = req.params;
    const stageNum = parseInt(stage);

    if (!sessionId || isNaN(stageNum) || stageNum < 1 || stageNum > 5) {
      res.status(400).json({ error: "Invalid sessionId or stage" });
      return;
    }

    try {
      const session = await getAnalysisSession(parseInt(sessionId));
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      // Verify ownership
      if (session.userId !== user.id) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      // Verify subscription for stages 2-5
      const isPremium = user.subscriptionStatus === "premium";
      if (stageNum > 1 && !isPremium) {
        res.status(403).json({ error: "Premium subscription required to unlock stages 2-5." });
        return;
      }

      // Check if this stage already has content
      const stageKey = `stage${stageNum}` as keyof typeof session;
      if (session[stageKey]) {
        // Return cached content
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.write(`data: ${JSON.stringify({ content: session[stageKey] as string, cached: true })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      // Build prompt based on stage
      let prompt: string;
      switch (stageNum) {
        case 1:
          prompt = getStage1Prompt(session.idea);
          break;
        case 2:
          if (!session.stage1) {
            res.status(400).json({ error: "Stage 1 must be completed first" });
            return;
          }
          prompt = getStage2Prompt(session.idea, session.stage1);
          break;
        case 3:
          if (!session.stage2) {
            res.status(400).json({ error: "Stage 2 must be completed first" });
            return;
          }
          prompt = getStage3Prompt(session.idea, session.stage2);
          break;
        case 4:
          if (!session.stage3) {
            res.status(400).json({ error: "Stage 3 must be completed first" });
            return;
          }
          prompt = getStage4Prompt(session.idea, session.stage3);
          break;
        case 5:
          if (!session.stage4) {
            res.status(400).json({ error: "Stage 4 must be completed first" });
            return;
          }
          prompt = getStage5Prompt(session.idea, session.stage4);
          break;
        default:
          res.status(400).json({ error: "Invalid stage" });
          return;
      }

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      let finished = false;
      res.on("close", () => { finished = true; });

      await streamLLMResponse(prompt, res, async (fullContent) => {
        if (!finished) {
          const status = stageNum === 5 ? "completed" : `stage${stageNum}`;
          await updateSessionStage(
            parseInt(sessionId),
            `stage${stageNum}`,
            fullContent,
            status
          );
        }
      });

      if (!finished) {
        res.write("data: [DONE]\n\n");
        res.end();
      }
    } catch (error: any) {
      console.error(`Stage ${stageNum} streaming error:`, error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  });
}
