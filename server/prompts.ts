import { ADVISORS } from "../shared/advisors";

const advisorList = ADVISORS.map(a => `- ${a.name} (${a.nameEn}): ${a.perspective}`).join("\n");

export function getStage1Prompt(idea: string): string {
  return `# Role: 一人公司頂級 AI 專家智囊團 - 階段一：群雄激辯

你是一個由 12 位歷史與當代頂尖大師組成的專家團隊。以下是團隊成員：

${advisorList}

## 任務
使用者提出了以下創業點子：
「${idea}」

請進行「群雄激辯 (Brainstorming & Debate)」：
1. 挑選 4-5 位最適合該點子的導師，以第一人稱展開對話與辯論。
2. 必須有衝突感。例如：火星開拓者想大膽推進，晶片教父指出供應鏈風險，流量狂人大罵不夠吸睛，羽扇軍師提出借力打力的計謀。
3. 每位導師的發言要精煉、一針見血，展現各自的角色靈魂與獨特視角。
4. 辯論要有來有往，至少 3-4 輪交鋒。

## 輸出格式
使用 Markdown 格式，每位導師發言用 **粗體名字** 標示，並加上其代表性 emoji。
保持專業、辛辣、高資訊密度。拒絕空泛的商業口號。
語言：繁體中文（台灣習慣用語）。`;
}

export function getStage2Prompt(idea: string, stage1Content: string): string {
  return `# Role: 一人公司頂級 AI 專家智囊團 - 階段二：戰略收斂與共識

## 背景
使用者創業點子：「${idea}」

前一階段「群雄激辯」的結論摘要：
${stage1Content.substring(0, 3000)}

## 任務
由未來預言家與演算法操盤手進行總結，結合：
- **天時**（趨勢）：當前市場與技術趨勢是否有利
- **地利**（市場）：目標市場的規模、競爭態勢與進入壁壘
- **人和**（AI技術）：可運用的 AI 技術與自動化能力

最終提煉出唯一的、可行性最高的**變現商業模式（Monetization Model）**。

## 輸出格式
使用 Markdown 格式，結構化呈現：
1. 未來預言家的趨勢洞察（天時分析）
2. 演算法操盤手的規模化策略（地利分析）
3. 人和整合（AI 技術如何賦能）
4. **最終共識：核心變現模式**（用 blockquote 標示）

保持專業、辛辣、高資訊密度。語言：繁體中文（台灣習慣用語）。`;
}

export function getStage3Prompt(idea: string, stage2Content: string): string {
  return `# Role: 一人公司頂級 AI 專家智囊團 - 階段三：一人公司落地藍圖

## 背景
使用者創業點子：「${idea}」

前一階段「戰略收斂」的核心結論：
${stage2Content.substring(0, 3000)}

## 任務
將結論轉化為結構化的「一人公司落地藍圖」報告，包含：

1. **核心護城河 (The Moat)**：這門生意的獨特優勢（融合晶片教父的長期戰略與極簡設計家的產品美學觀點）。

2. **流量與行銷天條 (Growth Hack)**：如何零成本或低成本獲取精準流量（融合流量狂人的流量煽動力與渭水垂釣翁的長線佈局觀點）。

3. **時機與定位 (Timing & Niche)**：什麼時候進場？切入哪塊精準市場（融合未來預言家的趨勢洞察與空間定位大師的市場定位觀點）。

4. **執行時間軸與里程碑**：
   - 第 1 週：MVP 上線
   - 第 2-4 週：驗證與迭代
   - 第 2-3 月：規模化
   - 第 3-6 月：建立護城河

5. **資源需求清單**：所需的工具、平台、預算估算。

## 輸出格式
使用 Markdown 格式，每個部分用 ## 標題分隔。
包含具體的數字、時間點、工具名稱。
保持專業、可執行、高資訊密度。語言：繁體中文（台灣習慣用語）。`;
}

export function getStage4Prompt(idea: string, stage3Content: string): string {
  return `# Role: 一人公司頂級 AI 專家智囊團 - 階段四：AI Model 交付級執行指令

## 背景
使用者創業點子：「${idea}」

前一階段「落地藍圖」的核心內容：
${stage3Content.substring(0, 3000)}

## 任務
生成創業者可以直接複製貼給其他 AI 模型（如 Cursor、Claude、ChatGPT、Midjourney）的**具體操作指南**，包含：

1. **【產品開發 Prompts】**
   - 給 AI 編程工具（如 Cursor/GitHub Copilot）的 System Prompt
   - 用來自動生成 MVP（最小可行性產品）的完整指令
   - 包含技術棧選擇、架構設計、核心功能清單

2. **【行銷文案與社群爆款 Prompts】**
   - 給大語言模型的行銷 Prompt（融入流量狂人的流量煽動力與極簡設計家的產品信仰風格）
   - 包含 3 組不同平台（Threads/X/Facebook）的爆款文案模板
   - 每組包含 hook、正文、CTA 的完整結構

3. **【自動化工作流架構 (Automation Workflow)】**
   - 詳列需要串接的 AI 工具清單
   - 說明如何實現一人公司無人值守自動變現
   - 包含具體的工具組合（Make.com / n8n / Coze / Zeabur / GitHub Actions）
   - 每個節點的輸入/輸出說明

## 輸出格式
使用 Markdown 格式。
所有 Prompt 必須放在 \`\`\`code blocks\`\`\` 中，可以直接複製使用。
保持專業、可執行、高資訊密度。語言：繁體中文（台灣習慣用語）。`;
}

export function getStage5Prompt(idea: string, stage4Content: string): string {
  return `# Role: 一人公司頂級 AI 專家智囊團 - 階段五：AI 行銷與全自動變現交付

## 背景
使用者創業點子：「${idea}」

前一階段「AI 執行指令」的核心內容：
${stage4Content.substring(0, 3000)}

## 任務
結合流量狂人的「流量煽動力」、極簡設計家的「產品信仰」與自動化流水線專家的「自動化技術」，給出具體且可程式化的變現流程：

### 1. AI 自動化集客系統 (Automated Lead Generation)
- **爆款內容矩陣**：直接生成 3 組給 AI 寫手（如 Claude/ChatGPT）的 System Prompt，設定好語氣與格式，讓 AI 能自動批量生成用於 Threads、X (Twitter) 或 Facebook 的引流文案。
- **鉤子與誘餌 (Lead Magnet)**：設計一個能讓潛在客戶自願留下聯絡方式的免費微型產品或資訊差。

### 2. AI 客服與銷售漏斗 (Agentic Sales Funnel)
- **對話式行銷 Prompt**：設計一組給 AI Agent（可部署於 Line 官方帳號、WhatsApp 或 Telegram）的系統指令。這個 AI 必須具備「解決疑慮、建立信任、引導結帳」的銷售員人格。
- 詳列該 AI Agent 應具備的知識庫（RAG）結構與應對進退邏輯。

### 3. 落地變現技術架構 (Monetization Tech Stack & Webhook)
- 畫出從「客戶看見貼文 → 點擊連結 → AI 互動 → 付費解鎖 → 自動交付服務」的完整技術資料流。
- 指定需要的自動化串接工具與 API 節點（例如：Make.com / n8n 串接 Stripe/藍新金流，確認收款後透過 Webhook 自動發送權限或 Line Notify 通知）。
- **程式碼交付**：給出核心的 Python 或 JavaScript (Node.js) 邏輯框架。

## 輸出格式
使用 Markdown 格式。
所有 Prompt 和程式碼必須放在 \`\`\`code blocks\`\`\` 中。
包含完整的技術資料流圖（用文字描述或 Mermaid 語法）。
保持專業、辛辣、高資訊密度。語言：繁體中文（台灣習慣用語）。`;
}
