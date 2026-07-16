import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Zap, Sparkles, Brain, ArrowLeft, CreditCard, Loader2 } from "lucide-react";

export default function Pricing() {
  const { user, isAuthenticated, refresh: refetchAuth } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const upgradeMutation = trpc.auth.upgradeToPremium.useMutation();
  const downgradeMutation = trpc.auth.downgradeToFree.useMutation();

  const handleSubscribeClick = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    if (!isAuthenticated) {
      toast.error("請先登入後再進行訂閱");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiry || !cvc) {
      toast.error("請填寫所有信用卡欄位");
      return;
    }

    setIsProcessing(true);
    // Simulate premium payment processing gateway
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await upgradeMutation.mutateAsync();
      await refetchAuth();
      setIsProcessing(false);
      setPaymentSuccess(true);
      toast.success("訂閱成功！您已升級至 Premium");
      
      // Auto close and redirect after 2 seconds
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        navigate("/");
      }, 2000);
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || "升級失敗，請重試");
    }
  };

  const handleResetFree = async () => {
    try {
      await downgradeMutation.mutateAsync();
      await refetchAuth();
      toast.success("已成功重設為免費會員");
    } catch (error: any) {
      toast.error(error.message || "重設失敗");
    }
  };

  const plans = [
    {
      id: "free",
      name: "免費體驗版",
      price: "NT$ 0",
      period: "永久",
      desc: "初步體驗 AI 專家智囊團的思維碰撞",
      features: [
        "單次分析字數上限 2,000 字",
        "完整解鎖「階段 1：群雄激辯」大師辯論",
        "體驗 12 位 AI 專家多元視角思維",
        "鎖定階段 2-5 深度變現方案",
      ],
      cta: "當前方案",
      disabled: true,
      popular: false,
    },
    {
      id: "premium",
      name: "Premium 專業版",
      price: selectedPlan === "monthly" ? "NT$ 399" : "NT$ 3,990",
      period: selectedPlan === "monthly" ? "月" : "年",
      desc: "專為一人公司與創業者設計的完整變現引擎",
      features: [
        "單次分析字數解鎖至 50,000 字",
        "完整解鎖階段 1-5 所有內容",
        "取得商業收斂模型、具體落地時間軸",
        "輸出可直接複製的 AI 執行 Prompt 與自動化代碼",
        "生成 AI 行銷漏斗與全自動變現技術架構",
        "支援導出 Markdown 完整創業報告",
      ],
      cta: "立即升級解鎖",
      disabled: false,
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden pt-24 pb-16">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回首頁
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm text-gold-gradient">AI 智囊團 Premium</span>
          </div>
        </div>
      </nav>

      <div className="container max-w-5xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
              選擇適合您的 <span className="text-gold-gradient">變現計畫</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              解鎖超長字數限制，讓 12 位頂尖 AI 大師為您量身打造完整的落地變現藍圖與自動化指令。
            </p>

            {/* Toggle Billing */}
            <div className="inline-flex p-1 rounded-full bg-muted border border-border/60">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedPlan === "monthly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                按月訂閱
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedPlan === "yearly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                按年訂閱
                <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full border border-amber-500/20">
                  省 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              whileHover={{ y: -4 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md border border-amber-400/20 flex items-center gap-1 z-10 animate-pulse">
                  <Sparkles className="w-3 h-3" /> 最受歡迎
                </div>
              )}

              <Card className={`h-full flex flex-col bg-card border-border hover:border-primary/50 transition-colors duration-300 ${
                plan.popular ? "border-primary/40 shadow-[0_0_50px_-12px_rgba(234,179,8,0.15)] bg-gradient-to-b from-card to-primary/5" : ""
              }`}>
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {plan.name}
                    {plan.id === "premium" && <Zap className="w-4 h-4 text-primary" />}
                  </CardTitle>
                  <CardDescription className="min-h-10 mt-1">{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {/* Price */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground font-mono">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3.5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.id === "premium" ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  {plan.id === "free" ? (
                    <Button
                      variant="outline"
                      className="w-full border-border/80 text-muted-foreground cursor-default hover:bg-transparent"
                      disabled
                    >
                      {user?.subscriptionStatus === "free" ? "目前方案" : "免費版"}
                    </Button>
                  ) : user?.subscriptionStatus === "premium" ? (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      disabled
                    >
                      <ShieldCheck className="w-4 h-4 mr-1" /> 已擁有 Premium 會員
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribeClick(plan.id as any)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold glow-gold shadow-lg"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Test Tool Panel */}
        {isAuthenticated && (
          <div className="mt-16 text-center border-t border-border/40 pt-8 max-w-md mx-auto">
            <p className="text-xs text-muted-foreground mb-3">🛠️ 測試專用工具（模擬控制環境）</p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFree}
                className="text-xs text-muted-foreground border-border/60 hover:border-destructive/50 hover:text-destructive transition-colors"
              >
                重設為免費會員 (Free)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await upgradeMutation.mutateAsync();
                  await refetchAuth();
                  toast.success("已直接升級為 Premium (免付款)");
                }}
                className="text-xs text-muted-foreground border-border/60 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
              >
                直接快速升級 (Premium)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Credit Card Modal Popup */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="bg-card border border-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
              {paymentSuccess ? (
                /* Success Screen */
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center justify-center mb-6"
                  >
                    <ShieldCheck className="w-10 h-10 animate-pulse" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">🎉 付款成功！</h3>
                  <p className="text-sm text-muted-foreground">
                    感謝您的訂閱！系統正在為您解鎖 Premium 尊榮權益...
                  </p>
                </div>
              ) : (
                /* Payment Input Form */
                <form onSubmit={handlePaymentSubmit}>
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-muted/40">
                    <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-primary" /> 安全信用卡支付
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      disabled={isProcessing}
                    >
                      關閉
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-4">
                    {/* Simulated Credit Card Visual */}
                    <div className="w-full h-44 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-background border border-amber-500/30 p-5 flex flex-col justify-between shadow-inner relative overflow-hidden">
                      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-primary/5 rounded-full blur-2xl" />
                      <div className="flex justify-between items-start">
                        <Brain className="w-8 h-8 text-primary" />
                        <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">Premium Pass</span>
                      </div>
                      <div className="space-y-3">
                        <div className="text-base font-mono text-foreground font-semibold tracking-[0.2em] min-h-6">
                          {cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() || "•••• •••• •••• ••••"}
                        </div>
                        <div className="flex justify-between items-end text-[10px] font-mono">
                          <div>
                            <div className="text-slate-500 uppercase text-[8px]">持卡人</div>
                            <div className="text-slate-300 font-bold truncate max-w-[150px] min-h-4">{cardName || "YOUR NAME"}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-slate-500 uppercase text-[8px]">有效期限</div>
                            <div className="text-slate-300 font-bold min-h-4">{expiry || "MM/YY"}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">卡號</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 16))}
                          placeholder="4211 0000 0000 0000"
                          className="w-full bg-input/40 border border-border/80 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/70 transition-all font-mono"
                          disabled={isProcessing}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-muted-foreground mb-1">持卡人姓名</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase().slice(0, 30))}
                          placeholder="WANG XIAO MING"
                          className="w-full bg-input/40 border border-border/80 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/70 transition-all uppercase"
                          disabled={isProcessing}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-medium text-muted-foreground mb-1">有效期限 (MM/YY)</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/[^\d]/g, '');
                              if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                              setExpiry(val.slice(0, 5));
                            }}
                            placeholder="12/29"
                            className="w-full bg-input/40 border border-border/80 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/70 transition-all font-mono text-center"
                            disabled={isProcessing}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-muted-foreground mb-1">安全碼 (CVC)</label>
                          <input
                            type="password"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
                            placeholder="•••"
                            className="w-full bg-input/40 border border-border/80 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/70 transition-all font-mono text-center"
                            disabled={isProcessing}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t border-border/50 bg-muted/20 flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPaymentModal(false)}
                      disabled={isProcessing}
                      className="text-xs"
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isProcessing}
                      className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-xs px-5 min-w-28"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-1.5 justify-center">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> 處理中...
                        </span>
                      ) : (
                        `確認付款 (${selectedPlan === "monthly" ? "NT$ 399" : "NT$ 3,990"})`
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
