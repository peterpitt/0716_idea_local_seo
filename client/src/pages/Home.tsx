import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ADVISORS } from "../../../shared/advisors";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Sparkles, Brain, Zap, Target, Users, ArrowRight, History } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [idea, setIdea] = useState("");
  const [, navigate] = useLocation();
  const startSession = trpc.analysis.startSession.useMutation();

  const handleSubmit = async () => {
    if (!idea.trim()) return;
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    const isPremium = user?.subscriptionStatus === "premium";
    const currentMaxLimit = isPremium ? 50000 : 2000;
    if (idea.trim().length > currentMaxLimit) {
      toast.error(`內容長度已達 ${idea.trim().length} 字，已超過${isPremium ? "專業" : "免費"}版 ${currentMaxLimit} 字限制。${!isPremium ? "請升級 Premium 解鎖 50,000 字上限！" : ""}`);
      if (!isPremium) {
        setTimeout(() => navigate("/pricing"), 2000);
      }
      return;
    }
    const result = await startSession.mutateAsync({ idea: idea.trim() });
    navigate(`/analysis/${result.sessionId}`);
  };

  const categories = [
    { name: "商業與科技巨擘", advisors: ADVISORS.filter(a => a.category === "商業與科技巨擘") },
    { name: "AI 與未來科技領袖", advisors: ADVISORS.filter(a => a.category === "AI 與未來科技領袖") },
    { name: "東方策略與玄學大師", advisors: ADVISORS.filter(a => a.category === "東方策略與玄學大師") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-gold-gradient">AI 智囊團</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.subscriptionStatus === "premium" ? (
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/20 font-bold flex items-center gap-1 shadow-sm">
                    👑 Premium
                  </span>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate("/pricing")} className="border-primary/50 text-primary hover:bg-primary/10 text-xs px-3 py-1.5 h-8">
                    ✨ 升級 Premium
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-muted-foreground hover:text-foreground">
                  <History className="w-4 h-4 mr-1" />
                  歷史記錄
                </Button>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => { window.location.href = getLoginUrl(); }} className="border-primary/50 text-primary hover:bg-primary/10">
                登入
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">由 12 位頂尖大師組成的 AI 智囊團</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-gold-gradient">一人公司</span>
              <br />
              <span className="text-foreground">頂級 AI 專家智囊團</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              輸入你的創業點子，由歷史與當代頂尖大師進行深度腦力激盪、激烈辯論，
              最終輸出可由 AI 自動化執行的具體落地變現方案。
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative rounded-xl border border-border bg-card p-1 glow-gold">
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="輸入你的創業點子或商業構想... 例如：用 AI 打造個人化健身教練 App"
                className="min-h-[120px] bg-transparent border-0 resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 text-base p-4"
              />
              <div className="flex items-center justify-between p-3 pt-0">
                {(() => {
                  const isPremium = user?.subscriptionStatus === "premium";
                  const maxLimit = isPremium ? 50000 : 2000;
                  return (
                    <>
                      <span className={`text-xs ${idea.length > maxLimit ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                        {idea.length}/{maxLimit}
                      </span>
                      <Button
                        onClick={handleSubmit}
                        disabled={!idea.trim() || startSession.isPending}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
                      >
                        {startSession.isPending ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⚡</span> 啟動中...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            啟動智囊團 <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, title: "12 位頂尖大師", desc: "橫跨商業、科技、AI、東方策略的多元視角" },
              { icon: Zap, title: "五階段深度分析", desc: "從激辯到落地，完整的創業分析流程" },
              { icon: Target, title: "可執行方案", desc: "直接輸出 AI 自動化執行的具體指令與程式碼" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/40 transition-colors duration-200">
                  <feature.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisor Cards */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gold-gradient mb-3">智囊團成員</h2>
            <p className="text-muted-foreground">12 位歷史與當代頂尖大師，為你的創業點子提供多元視角</p>
          </div>

          {categories.map((cat, catIdx) => (
            <div key={cat.name} className="mb-12">
              <h3 className="text-lg font-semibold text-primary/80 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {cat.advisors.map((advisor, i) => (
                  <motion.div
                    key={advisor.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * i + catIdx * 0.2, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Card className="p-4 bg-card border-border hover:border-primary/50 hover:glow-gold transition-all duration-200 group cursor-default">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{advisor.icon}</div>
                      <h4 className="font-semibold text-foreground text-sm">{advisor.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{advisor.expertise}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stages Overview */}
      <section className="py-16 px-4 border-t border-border/50">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gold-gradient mb-3">五階段分析流程</h2>
            <p className="text-muted-foreground">從激辯到變現，完整的創業分析旅程</p>
          </div>
          <div className="space-y-4">
            {[
              { num: "01", title: "群雄激辯", desc: "多位大師針對點子展開激烈辯論，碰撞出最佳方向" },
              { num: "02", title: "戰略收斂", desc: "整合天時地利人和，收斂為唯一可行的變現模式" },
              { num: "03", title: "落地藍圖", desc: "具體的時間軸、里程碑、資源需求與執行計劃" },
              { num: "04", title: "AI 執行指令", desc: "可直接複製的 Prompt 與自動化工作流架構" },
              { num: "05", title: "AI 行銷與全自動變現引擎", desc: "完整的集客系統、銷售漏斗與變現技術架構" },
            ].map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl font-bold text-primary/60 font-mono">{stage.num}</span>
                <div>
                  <h4 className="font-semibold text-foreground">{stage.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>一人公司頂級 AI 專家智囊團 — 讓 AI 為你的創業夢想保駕護航</p>
        </div>
      </footer>
    </div>
  );
}
