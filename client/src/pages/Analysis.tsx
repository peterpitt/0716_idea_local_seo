import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { STAGE_NAMES } from "../../../shared/advisors";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Brain, ArrowLeft, CheckCircle2, Loader2, Play, Download, Lock, Zap } from "lucide-react";
import { Streamdown } from "streamdown";

type StageStatus = "idle" | "streaming" | "done" | "error";

export default function Analysis() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: session, refetch } = trpc.analysis.getSession.useQuery(
    { id: parseInt(id || "0") },
    { enabled: !!id && !!isAuthenticated }
  );

  const [stageContents, setStageContents] = useState<string[]>(["", "", "", "", ""]);
  const [stageStatuses, setStageStatuses] = useState<StageStatus[]>(["idle", "idle", "idle", "idle", "idle"]);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [autoStarted, setAutoStarted] = useState(false);
  const streamingRef = useRef(false);

  const allDone = stageStatuses.every(s => s === "done");

  // Load cached content from session
  useEffect(() => {
    if (session) {
      const contents = [
        session.stage1 || "",
        session.stage2 || "",
        session.stage3 || "",
        session.stage4 || "",
        session.stage5 || "",
      ];
      const statuses: StageStatus[] = contents.map(c => c ? "done" : "idle");
      setStageContents(contents);
      setStageStatuses(statuses);

      // Find first incomplete stage
      const firstIncomplete = contents.findIndex(c => !c);
      if (firstIncomplete === -1) {
        setCurrentStage(4); // all done
      } else {
        setCurrentStage(firstIncomplete);
      }
    }
  }, [session]);

  // Auto-start first stage if nothing is done
  useEffect(() => {
    if (session && !autoStarted && stageStatuses[0] === "idle" && !streamingRef.current) {
      setAutoStarted(true);
      startStage(0);
    }
  }, [session, autoStarted, stageStatuses]);


  const startStage = useCallback(async (stageIndex: number) => {
    if (streamingRef.current) return;
    streamingRef.current = true;

    setStageStatuses(prev => {
      const next = [...prev];
      next[stageIndex] = "streaming";
      return next;
    });
    setCurrentStage(stageIndex);

    try {
      const response = await fetch(`/api/analysis/${id}/stream/${stageIndex + 1}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

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
            if (parsed.cached) {
              fullContent = parsed.content;
              setStageContents(prev => {
                const next = [...prev];
                next[stageIndex] = fullContent;
                return next;
              });
            } else if (parsed.content) {
              fullContent += parsed.content;
              setStageContents(prev => {
                const next = [...prev];
                next[stageIndex] = fullContent;
                return next;
              });
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e: any) {
            if (e.message && !e.message.includes("JSON")) throw e;
          }
        }
      }

      setStageStatuses(prev => {
        const next = [...prev];
        next[stageIndex] = "done";
        return next;
      });

      streamingRef.current = false;

      // Auto-start next stage
      if (stageIndex < 4) {
        const isPremium = user?.subscriptionStatus === "premium";
        if (stageIndex === 0 && !isPremium) {
          console.log("Stopping auto-start: stages 2-5 require premium subscription.");
        } else {
          setTimeout(() => startStage(stageIndex + 1), 500);
        }
      } else {
        refetch();
      }
    } catch (error: any) {
      console.error(`Stage ${stageIndex + 1} error:`, error);
      setStageStatuses(prev => {
        const next = [...prev];
        next[stageIndex] = "error";
        return next;
      });
      streamingRef.current = false;
    }
  }, [id, refetch, user, stageContents, stageStatuses]);

  // Auto-resume stages for Premium users if there are incomplete stages
  const isPremium = user?.subscriptionStatus === "premium";
  useEffect(() => {
    if (session && isPremium && !streamingRef.current) {
      const firstIncomplete = stageContents.findIndex(c => !c);
      if (firstIncomplete > 0 && firstIncomplete < 5) {
        const prevDone = stageStatuses.slice(0, firstIncomplete).every(s => s === "done");
        if (prevDone && stageStatuses[firstIncomplete] === "idle") {
          startStage(firstIncomplete);
        }
      }
    }
  }, [session, isPremium, stageContents, stageStatuses, startStage]);

  const retryStage = (stageIndex: number) => {
    setStageContents(prev => {
      const next = [...prev];
      next[stageIndex] = "";
      return next;
    });
    startStage(stageIndex);
  };

  const handleDownloadReport = () => {
    // Build the markdown report locally from stage contents
    const stageNamesList = ["群雄激辯", "戰略收斂", "落地藍圖", "AI 執行指令", "AI 行銷與全自動變現引擎"];
    const stageIconsList = ["⚔️", "🎯", "📋", "🤖", "💰"];

    let markdown = `# 🧠 一人公司頂級 AI 專家智囊團 — 創業分析報告\n\n`;
    markdown += `> **創業點子：** ${session?.idea || ""}\n\n`;
    markdown += `> **分析日期：** ${session?.createdAt ? new Date(session.createdAt).toLocaleString("zh-TW") : new Date().toLocaleString("zh-TW")}\n\n`;
    markdown += `---\n\n`;

    for (let i = 0; i < 5; i++) {
      markdown += `## ${stageIconsList[i]} 階段 ${i + 1}：${stageNamesList[i]}\n\n`;
      markdown += `${stageContents[i] || "（尚未完成）"}\n\n`;
      if (i < 4) markdown += `---\n\n`;
    }

    markdown += `\n---\n\n`;
    markdown += `*本報告由「一人公司頂級 AI 專家智囊團」系統自動生成，由 12 位 AI 專家角色進行多階段深度分析。*\n`;

    // Create and download the file
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ideaSlug = (session?.idea || "analysis").slice(0, 30).replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "_");
    a.download = `智囊團分析報告_${ideaSlug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stageIcons = ["⚔️", "🎯", "📋", "🤖", "💰"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            <div className="h-4 w-px bg-border" />
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-gold-gradient">
              {allDone ? "分析完成" : "智囊團分析中"}
            </span>
          </div>
          {allDone && (
            <Button
              size="sm"
              onClick={handleDownloadReport}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-1" />
              下載完整報告
            </Button>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl">
          {/* Idea Display */}
          {session && (
            <div className="mb-8 p-4 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">你的創業點子</p>
              <p className="text-foreground font-medium">{session.idea}</p>
            </div>
          )}

          {/* Completion Banner */}
          {allDone && (
            <div className="mb-8 p-5 rounded-lg border border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">五階段分析已全部完成！</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      你的創業點子已經過 12 位 AI 專家深度分析，點擊下方按鈕下載完整報告。
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDownloadReport}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex"
                >
                  <Download className="w-4 h-4 mr-1" />
                  打包下載報告
                </Button>
              </div>
              <Button
                onClick={handleDownloadReport}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-3 sm:hidden"
              >
                <Download className="w-4 h-4 mr-1" />
                打包下載報告
              </Button>
            </div>
          )}

          {/* Stage Progress */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {STAGE_NAMES.map((name, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  stageStatuses[i] === "done"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : stageStatuses[i] === "streaming"
                    ? "bg-primary/10 text-primary border border-primary/50 animate-pulse"
                    : stageStatuses[i] === "error"
                    ? "bg-destructive/10 text-destructive border border-destructive/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {stageStatuses[i] === "done" && <CheckCircle2 className="w-3 h-3" />}
                {stageStatuses[i] === "streaming" && <Loader2 className="w-3 h-3 animate-spin" />}
                {name}
              </div>
            ))}
          </div>

          {/* Stage Contents */}
          <div className="space-y-6">
            {STAGE_NAMES.map((name, i) => {
              const isLocked = i > 0 && !isPremium;
              return (
                <Card
                  key={i}
                  className={`overflow-hidden border transition-all duration-300 ${
                    isLocked
                      ? "border-border/30 opacity-70"
                      : stageStatuses[i] === "streaming"
                      ? "border-primary/50 glow-gold"
                      : stageStatuses[i] === "done"
                      ? "border-primary/20"
                      : "border-border/50 opacity-60"
                  }`}
                >
                  <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stageIcons[i]}</span>
                      <h3 className="font-semibold text-foreground">
                        階段 {i + 1}：{name}
                      </h3>
                    </div>
                    {stageStatuses[i] === "error" && !isLocked && (
                      <Button size="sm" variant="outline" onClick={() => retryStage(i)} className="text-xs">
                        <Play className="w-3 h-3 mr-1" /> 重試
                      </Button>
                    )}
                  </div>
                  <div className="p-6">
                    {isLocked ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                          <Lock className="w-4 h-4 text-primary" />
                        </div>
                        <h4 className="font-semibold text-foreground text-sm">解鎖完整五階段專業分析</h4>
                        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                          升級至 Premium 獲取此階段大師戰略收斂、具體落地時間軸、AI 指令與行銷變現架構。
                        </p>
                        <Button
                          size="sm"
                          onClick={() => navigate("/pricing")}
                          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-4 py-1.5 h-8 flex items-center gap-1 shadow-md"
                        >
                          <Zap className="w-3.5 h-3.5" /> 立即升級解鎖
                        </Button>
                      </div>
                    ) : (
                      <>
                        {stageStatuses[i] === "idle" && (
                          <p className="text-muted-foreground text-sm">等待前一階段完成...</p>
                        )}
                        {stageStatuses[i] === "streaming" && stageContents[i] === "" && (
                          <div className="flex items-center gap-2 text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">智囊團正在分析中...</span>
                          </div>
                        )}
                        {stageContents[i] && (
                          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-primary prose-code:text-primary/80 prose-pre:bg-secondary prose-pre:border prose-pre:border-border">
                            <Streamdown>{stageContents[i]}</Streamdown>
                          </div>
                        )}
                        {stageStatuses[i] === "error" && !stageContents[i] && (
                          <p className="text-destructive text-sm">分析過程發生錯誤，請點擊重試。</p>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
