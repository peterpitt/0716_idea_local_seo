// server/shortsPrompts.ts
// 9大 AI 工具矩陣短影音管道 Prompt 生成器

export interface ToolchainOutput {
  manusResearchPrompt: string;
  notebookLmPrompt: string;
  script: {
    hook: string;
    body: string;
    cta: string;
    fullScript: string;
  };
  elevenLabsText: string;
  heyGenAvatarPrompt: string;
  hailuoVideoPrompts: string[];
  canvaDesignSpec: {
    title: string;
    subtitle: string;
    colorPalette: string;
  };
  cozeLeadMagnetSpec: {
    keyword: string;
    autoReplyMessage: string;
  };
}

export function generateShortsToolchain(idea: string, channelName: string = "@asusu-w3l"): ToolchainOutput {
  const manusResearchPrompt = `你是一個專業的影音趨勢偵查員。請幫我分析主題：「${idea}」在 YouTube Shorts 與 TikTok 上的近 30 天爆款影片。
請輸出：
1. 觀看數前 3 名的標題與前 3 秒 Hook 模式
2. 目標觀眾（針對頻道 ${channelName}）最感興趣的痛點與問答
3. 適合剪輯成 60 秒極速短影音的 3 個核心切入角`;

  const notebookLmPrompt = `[NotebookLM 知識庫解讀指令 (帳號: billpitt613@gmail.com)]
請讀取上傳的參考文件，針對主題「${idea}」，提煉出一份雙人對談重點筆記：
- 觀點一：顛覆常理的亮點數據或事實
- 觀點二：實體/一人公司落地執行的 3 個步驟
- 觀點三：避坑指南（最常見的錯誤作法）
請將語言風格轉化為適合繁體中文說故事的口語化摘要。`;

  const hook = `「99% 的人都不知道，用 ${idea} 變現居然只要 3 個步驟！別再傻傻做低效工作了！」`;
  const body = `第一步：利用 AI 自動抓取高轉化選題，把知識庫丟進 NotebookLM 瞬間提煉精華。
第二步：用 Gemini 產生黃金分鏡，配上 ElevenLabs 的擬真配音，1 分鐘搞定畫面與聲線。
第三步：透過自動化引流跟單，讓觀眾留言即可自動獲得操作手冊！`;
  const cta = `「想拿到這套全自動影音變現工具包嗎？立刻訂閱 ${channelName} 並在下方留言『+1』，我自動私訊傳給你！」`;

  const fullScript = `【開場 Hook (0-5s)】\n${hook}\n\n【核心內容 (5-45s)】\n${body}\n\n【變現引流 (45-60s)】\n${cta}`;

  const elevenLabsText = `[ElevenLabs 配音文字 - 請選用溫暖熱情的繁體中文聲線]
<break time="0.3s"/>
${hook}
<break time="0.5s"/>
${body}
<break time="0.5s"/>
${cta}`;

  const heyGenAvatarPrompt = `Digital Avatar Host: Professional, energetic solopreneur holding a smartphone, standing in a futuristic modern workspace with warm neon glowing accent lights. 
Speech Script: ${hook} ... ${cta}`;

  const hailuoVideoPrompts = [
    `Hyper-realistic 4K vertical 9:16 shot: Futuristic AI technology interface, glowing holographic charts and workflow nodes, cinematic lighting, smooth motion.`,
    `Vertical 9:16 video: Close-up of a modern creator working seamlessly with multiple AI screens, high productivity, aesthetic workspace lighting.`,
    `Vertical 9:16 video: E-commerce growth metrics skyrocketing on a sleek smartphone screen, dynamic lens flare, professional quality.`
  ];

  const canvaDesignSpec = {
    title: idea,
    subtitle: "AI 自動化爆款變現全公開 🚀",
    colorPalette: "黑曜石暗黑背景 (#0f172a) + 螢光黃醒目標題 (#facc15) + 炫彩紫霓虹邊框 (#a855f7)",
  };

  const cozeLeadMagnetSpec = {
    keyword: "+1",
    autoReplyMessage: `哈囉！感謝關注頻道 ${channelName}！這是為您準備的「${idea} 全自動影音變現工具包」連結：https://asusu-w3l.com/lead-magnet`,
  };

  return {
    manusResearchPrompt,
    notebookLmPrompt,
    script: {
      hook,
      body,
      cta,
      fullScript,
    },
    elevenLabsText,
    heyGenAvatarPrompt,
    hailuoVideoPrompts,
    canvaDesignSpec,
    cozeLeadMagnetSpec,
  };
}
