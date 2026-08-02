import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sparkles,
  Copy,
  Youtube,
  Mic,
  Video,
  Palette,
  Bot,
  BookOpen,
  Search,
  CheckCircle2,
  Workflow,
} from "lucide-react";

export default function ShortsStudio() {
  const [idea, setIdea] = useState("2026年一人公司用AI自動化變現的3個方法");
  const [channel, setChannel] = useState("@asusu-w3l");
  const [generatedData, setGeneratedData] = useState<any>(null);

  const handleGenerate = () => {
    if (!idea.trim()) {
      toast.error("請輸入您的短影音 Idea！");
      return;
    }

    const hook = `「99% 的人都不知道，用 ${idea} 變現居然只要 3 個步驟！別再傻傻做低效工作了！」`;
    const body = `第一步：利用 Manus 抓取高轉化題材，把知識庫丟進 NotebookLM (billpitt613@gmail.com) 提煉精華。
第二步：用 Gemini 產生黃金分鏡，配上 ElevenLabs 擬真配音，1 分鐘搞定畫面與聲線。
第三步：透過 Coze 自動化引流，讓觀眾留言即可自動獲得操作手冊！`;
    const cta = `「想拿到這套全自動影音變現工具包嗎？立刻訂閱 ${channel} 並在下方留言『+1』，我自動私訊傳給你！」`;

    setGeneratedData({
      manus: `你是一個專業的影音趨勢偵查員。請幫我分析主題：「${idea}」在 YouTube Shorts 與 TikTok 上的近 30 天爆款影片。
請輸出：
1. 觀看數前 3 名的標題與前 3 秒 Hook 模式
2. 目標觀眾（針對頻道 ${channel}）最感興趣的痛點與問答
3. 適合剪輯成 60 秒極速短影音的 3 個核心切入角`,
      notebooklm: `[NotebookLM 知識庫解讀指令 (帳號: billpitt613@gmail.com)]
請讀取上傳的參考文件，針對主題：「${idea}」，提煉出一份雙人對談重點筆記：
- 觀點一：顛覆常理的亮點數據或事實
- 觀點二：落地執行的 3 個步驟
- 觀點三：避坑指南（最常見的錯誤作法）
請將語言風格轉化為適合繁體中文說故事的口語化摘要。`,
      geminiChatgpt: `【黃金 3 秒 Hook (0-5s)】\n${hook}\n\n【核心價值 delivery (5-45s)】\n${body}\n\n【變現 Call To Action (45-60s)】\n${cta}`,
      elevenlabs: `<break time="0.3s"/>\n${hook}\n<break time="0.5s"/>\n${body}\n<break time="0.5s"/>\n${cta}`,
      heygen: `Digital Avatar Host: Professional, energetic solopreneur holding a smartphone, standing in a modern futuristic workspace with warm glowing lights. 
Speech Script: ${hook} ... ${cta}`,
      hailuo: [
        `Vertical 9:16 shot: Futuristic AI technology interface, glowing holographic charts and workflow nodes, 4K smooth camera movement.`,
        `Vertical 9:16 video: Close-up of a creator using multiple AI tool windows seamlessly, dynamic lighting, aesthetic workspace.`,
        `Vertical 9:16 video: E-commerce growth metrics skyrocketing on a smartphone screen, cinematic lens flare.`,
      ],
      canva: {
        title: idea,
        subtitle: "AI 全自動爆款變現指南 🚀",
        palette: "黑曜石暗黑背景 (#0f172a) + 螢光黃大字 (#facc15) + 紫光邊框 (#a855f7)",
      },
      coze: {
        keyword: "+1",
        reply: `哈囉！感謝關注頻道 ${channel}！這是為您準備的「${idea} 自動化變現工具包」連結：https://asusu-w3l.com/lead-magnet`,
      },
    });

    toast.success("✨ 9 大 AI 工具鏈 Prompt 已全數生成完畢！");
  };

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`已複製 ${title} 指令至剪貼簿！`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                9 大 AI 工具矩陣
              </Badge>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                頻道: {channel}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              🎬 AI 影音全自動爆款工場 (YouTube Shorts Studio)
            </h1>
            <p className="text-muted-foreground mt-1">
              輸入您的 Idea，一鍵為 Manus, NotebookLM, Gemini, HeyGen, ChatGPT, Coze, 海螺, ElevenLabs, Canva 產出變現指令鏈。
            </p>
          </div>
        </div>

        {/* Input Card */}
        <Card className="border-purple-500/20 bg-purple-950/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-amber-400" />
              第一步：輸入您的短影音主題 Idea
            </CardTitle>
            <CardDescription>
              將自動為 YouTube 頻道 <span className="text-purple-400 font-semibold">{channel}</span> 生成可變現的 Shorts 分鏡與 AI 工具指令。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">短影音主題 (Idea)</label>
                <Input
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="例如：2026年一人公司用AI自動化變現的3個方法"
                  className="bg-background/50 border-purple-500/30 focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">目標 YouTube 頻道</label>
                <Input
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="@asusu-w3l"
                  className="bg-background/50 border-purple-500/30"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-6 text-base shadow-lg shadow-purple-900/30"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              一鍵串接 9 大 AI 工具並生成全套變現指令
            </Button>
          </CardContent>
        </Card>

        {/* Results Sections */}
        {generatedData && (
          <Tabs defaultValue="script" className="w-full">
            <TabsList className="grid grid-cols-4 md:grid-cols-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="script" className="gap-1 text-xs">
                <Bot className="w-3.5 h-3.5" /> 腳本 (Gemini)
              </TabsTrigger>
              <TabsTrigger value="notebooklm" className="gap-1 text-xs">
                <BookOpen className="w-3.5 h-3.5" /> NotebookLM
              </TabsTrigger>
              <TabsTrigger value="manus" className="gap-1 text-xs">
                <Search className="w-3.5 h-3.5" /> Manus
              </TabsTrigger>
              <TabsTrigger value="elevenlabs" className="gap-1 text-xs">
                <Mic className="w-3.5 h-3.5" /> ElevenLabs
              </TabsTrigger>
              <TabsTrigger value="heygen" className="gap-1 text-xs">
                <Video className="w-3.5 h-3.5" /> HeyGen
              </TabsTrigger>
              <TabsTrigger value="hailuo" className="gap-1 text-xs">
                <Sparkles className="w-3.5 h-3.5" /> 海螺 AI
              </TabsTrigger>
              <TabsTrigger value="canva" className="gap-1 text-xs">
                <Palette className="w-3.5 h-3.5" /> Canva
              </TabsTrigger>
              <TabsTrigger value="coze" className="gap-1 text-xs">
                <Workflow className="w-3.5 h-3.5" /> Coze 引流
              </TabsTrigger>
            </TabsList>

            {/* 1. Gemini / ChatGPT Script */}
            <TabsContent value="script" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-400" />
                      Gemini / ChatGPT 爆款短影音分鏡腳本
                    </CardTitle>
                    <CardDescription>符合黃金 3 秒 Hook ➔ 痛點 ➔ 價值交付 ➔ 變現引流結構。</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedData.geminiChatgpt, "Gemini/ChatGPT 腳本")}
                  >
                    <Copy className="w-4 h-4 mr-1" /> 複製腳本
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={generatedData.geminiChatgpt}
                    rows={8}
                    className="font-mono text-sm bg-muted/30"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 2. NotebookLM */}
            <TabsContent value="notebooklm" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      NotebookLM 知識庫解讀指令
                    </CardTitle>
                    <CardDescription>
                      對接帳號：<span className="text-blue-400 font-mono">billpitt613@gmail.com</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedData.notebooklm, "NotebookLM 指令")}
                  >
                    <Copy className="w-4 h-4 mr-1" /> 複製指令
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={generatedData.notebooklm}
                    rows={8}
                    className="font-mono text-sm bg-muted/30"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. Manus */}
            <TabsContent value="manus" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-green-400" />
                      Manus 趨勢與競品熱點偵查
                    </CardTitle>
                    <CardDescription>自動掃描全網最高轉化率的短影音選題與切入角度。</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedData.manus, "Manus 指令")}
                  >
                    <Copy className="w-4 h-4 mr-1" /> 複製指令
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={generatedData.manus}
                    rows={8}
                    className="font-mono text-sm bg-muted/30"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. ElevenLabs */}
            <TabsContent value="elevenlabs" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-amber-400" />
                      ElevenLabs 帶情緒停頓標註配音稿
                    </CardTitle>
                    <CardDescription>複製直接貼入 ElevenLabs 產出最高渲染力的配音檔。</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedData.elevenlabs, "ElevenLabs 配音稿")}
                  >
                    <Copy className="w-4 h-4 mr-1" /> 複製配音稿
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={generatedData.elevenlabs}
                    rows={8}
                    className="font-mono text-sm bg-muted/30"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. HeyGen */}
            <TabsContent value="heygen" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-pink-400" />
                      HeyGen 數位人主播 Generate Prompt
                    </CardTitle>
                    <CardDescription>用於產生真實流暢的 AI 數位人開場/結尾口播短片。</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedData.heygen, "HeyGen 指令")}
                  >
                    <Copy className="w-4 h-4 mr-1" /> 複製指令
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={generatedData.heygen}
                    rows={6}
                    className="font-mono text-sm bg-muted/30"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. 海螺 AI (Hailuo) */}
            <TabsContent value="hailuo" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400" />
                    海螺 AI (Hailuo AI) B-roll 畫面提示詞
                  </CardTitle>
                  <CardDescription>3 組高清 9:16 動態視覺提示詞，可直接貼入海螺 AI 生成切片。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedData.hailuo.map((prompt: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                      <span className="font-mono text-xs text-foreground/90">{prompt}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(prompt, `海螺 AI 提示詞 #${idx + 1}`)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 7. Canva */}
            <TabsContent value="canva" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-emerald-400" />
                    Canva 1080x1920 爆款封面與字卡規範
                  </CardTitle>
                  <CardDescription>高 CTR 豎版封面標題與配色指南。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border bg-muted/20 space-y-1">
                      <div className="text-xs text-muted-foreground">封面主標題 (Main Title)</div>
                      <div className="font-bold text-amber-400">{generatedData.canva.title}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/20 space-y-1">
                      <div className="text-xs text-muted-foreground">副標題 (Subtitle)</div>
                      <div className="font-bold text-purple-400">{generatedData.canva.subtitle}</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/20 space-y-1">
                      <div className="text-xs text-muted-foreground">建議配色方案</div>
                      <div className="font-mono text-xs">{generatedData.canva.palette}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 8. Coze 引流 */}
            <TabsContent value="coze" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-indigo-400" />
                      Coze & Webhook 自動化跟單與留言回覆
                    </CardTitle>
                    <CardDescription>
                      當觀眾在 {channel} 影片下方留言「{generatedData.coze.keyword}」時，自動私訊發送變現連結。
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedData.coze.reply, "Coze 自動回覆訊息")}
                  >
                    <Copy className="w-4 h-4 mr-1" /> 複製自動回覆文案
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between">
                    <span className="text-sm font-semibold">觸發關鍵字：</span>
                    <Badge variant="secondary" className="font-mono text-base bg-indigo-500/20 text-indigo-300">
                      {generatedData.coze.keyword}
                    </Badge>
                  </div>
                  <Textarea
                    readOnly
                    value={generatedData.coze.reply}
                    rows={4}
                    className="font-mono text-sm bg-muted/30"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
