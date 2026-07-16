import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Brain, ArrowLeft, Clock, ArrowRight, Sparkles, Download } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function History() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const { data: sessions, isLoading } = trpc.analysis.listSessions.useQuery(
    undefined,
    { enabled: !!isAuthenticated }
  );

  const handleDownload = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Use fetch to call the tRPC endpoint for export
      const response = await fetch(`/api/trpc/analysis.exportReport?input=${encodeURIComponent(JSON.stringify({ id: sessionId }))}`, {
        credentials: "include",
      });
      const json = await response.json();
      const data = json?.result?.data;
      if (data?.markdown) {
        const blob = new Blob([data.markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const ideaSlug = (data.idea || "analysis").slice(0, 30).replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "_");
        a.download = `智囊團分析報告_${ideaSlug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin text-primary text-2xl">⚡</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <Brain className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">請先登入</h2>
        <p className="text-muted-foreground mb-4">登入後即可查看歷史分析記錄</p>
        <Button onClick={() => { window.location.href = getLoginUrl(); }} className="bg-primary text-primary-foreground">
          登入
        </Button>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    pending: "等待中",
    stage1: "階段一進行中",
    stage2: "階段二進行中",
    stage3: "階段三進行中",
    stage4: "階段四進行中",
    stage5: "階段五進行中",
    completed: "已完成",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回首頁
            </Button>
            <div className="h-4 w-px bg-border" />
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-gold-gradient">歷史記錄</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">分析歷史記錄</h1>
            <p className="text-muted-foreground">查看你過去的創業點子分析報告，已完成的報告可直接下載</p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin text-primary text-2xl">⚡</div>
            </div>
          )}

          {sessions && sessions.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">尚無分析記錄</p>
              <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">
                開始第一次分析
              </Button>
            </div>
          )}

          {sessions && sessions.length > 0 && (
            <div className="space-y-3">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="p-4 bg-card border-border hover:border-primary/40 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/analysis/${session.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{session.idea}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(session.createdAt).toLocaleString("zh-TW")}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          session.status === "completed"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {statusLabels[session.status] || session.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {session.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleDownload(session.id, e)}
                          className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          下載
                        </Button>
                      )}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
