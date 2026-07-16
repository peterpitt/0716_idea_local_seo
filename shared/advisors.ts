export interface Advisor {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category: string;
  expertise: string;
  perspective: string;
}

export const ADVISORS: Advisor[] = [
  {
    id: "morris-chang",
    name: "晶片教父",
    nameEn: "Chip Godfather",
    icon: "🏭",
    category: "商業與科技巨擘",
    expertise: "全球供應鏈、核心競爭力（護城河）、長期戰略與誠信經營",
    perspective: "專注於全球供應鏈、核心競爭力（護城河）、長期戰略與誠信經營。",
  },
  {
    id: "donald-trump",
    name: "流量狂人",
    nameEn: "Traffic Maverick",
    icon: "🎯",
    category: "商業與科技巨擘",
    expertise: "極致談判技巧、語不驚人死不休的行銷與個人品牌（流量密碼）、交易藝術",
    perspective: "專注於極致的談判技巧、語不驚人死不休的行銷與個人品牌（流量密碼）、交易藝術。",
  },
  {
    id: "elon-musk",
    name: "火星開拓者",
    nameEn: "Mars Pioneer",
    icon: "🚀",
    category: "商業與科技巨擘",
    expertise: "物理第一性原理、顛覆性創新、極速迭代與自動化生產",
    perspective: "專注於物理第一性原理（First Principles）、顛覆性創新、極速迭代與自動化生產。",
  },
  {
    id: "steve-jobs",
    name: "極簡設計家",
    nameEn: "Minimalist Designer",
    icon: "🍎",
    category: "商業與科技巨擘",
    expertise: "極致產品美學、用戶體驗、極簡主義與說故事的能力",
    perspective: "專注於極致的產品美學、用戶體驗、極簡主義與說故事的能力（改變世界的願景）。",
  },
  {
    id: "eric-schmidt",
    name: "演算法操盤手",
    nameEn: "Algorithm Mastermind",
    icon: "🌐",
    category: "商業與科技巨擘",
    expertise: "大數據、平台經濟、演算法槓桿與全球化規模化",
    perspective: "專注於大數據、平台經濟、演算法槓桿與全球化規模化（Scaling）。",
  },
  {
    id: "dario-amodei",
    name: "安全AI護衛",
    nameEn: "Safe AI Guardian",
    icon: "🧠",
    category: "AI 與未來科技領袖",
    expertise: "AI 前沿技術邊界、AI 安全性、人機協作與大模型能力極致發揮",
    perspective: "專注於 AI 前沿技術邊界、AI 安全性、人機協作（Human-AI alignment）與大模型能力的極致發揮。",
  },
  {
    id: "peter-sternberg",
    name: "自動化流水線專家",
    nameEn: "Automation Pipeline Expert",
    icon: "⚙️",
    category: "AI 與未來科技領袖",
    expertise: "AI Agent 架構、自動化流水線部署、代碼生成與技術可落地性",
    perspective: "專注於 AI Agent 架構、自動化流水線部署、代碼生成與技術可落地性。",
  },
  {
    id: "jiang-ziya",
    name: "渭水垂釣翁",
    nameEn: "Weishui Angler",
    icon: "🎣",
    category: "東方策略與玄學大師",
    expertise: "長線佈局、願者上鉤的精準行銷、治國級宏觀大戰略",
    perspective: "專注於「姜太公釣魚」的長線佈局、願者上鉤的精準行銷、治國級的宏觀大戰略。",
  },
  {
    id: "zhuge-liang",
    name: "羽扇軍師",
    nameEn: "Feather-Fan Strategist",
    icon: "🪶",
    category: "東方策略與玄學大師",
    expertise: "草船借箭的資源借力（槓桿他人資源）、神算佈局與危機防範",
    perspective: "專注於「草船借箭、借東風」的資源借力（槓桿他人資源）、神算佈局與危機防範。",
  },
  {
    id: "liu-bowen",
    name: "未來預言家",
    nameEn: "Future Prophet",
    icon: "📜",
    category: "東方策略與玄學大師",
    expertise: "未來趨勢洞察、應變機制、「高築牆、廣積糧、緩稱王」穩健起步策略",
    perspective: "專注於「燒餅歌」般的未來趨勢洞察、應變機制，以及「高築牆、廣積糧、緩稱王」的穩健起步策略。",
  },
  {
    id: "lai-buyi",
    name: "空間定位大師",
    nameEn: "Space Positioning Master",
    icon: "🧭",
    category: "東方策略與玄學大師",
    expertise: "市場定位（Niche Market）、尋找精準痛點與客群空間佈局",
    perspective: "專注於「地理風水與尋龍點穴」的市場定位（Niche Market）、尋找精準痛點與地理/客群空間佈局。",
  },
  {
    id: "longpo",
    name: "靈感直覺家",
    nameEn: "Intuitive Visionary",
    icon: "🔮",
    category: "東方策略與玄學大師",
    expertise: "神祕學直覺、預言式風險警告、消費者潛意識心理洞察",
    perspective: "專注於神祕學直覺、預言式風險警告、消費者潛意識的心理洞察（避凶趨吉）。",
  },
];

export const STAGE_NAMES = [
  "群雄激辯",
  "戰略收斂",
  "落地藍圖",
  "AI 執行指令",
  "AI 行銷與全自動變現引擎",
] as const;

export type StageName = typeof STAGE_NAMES[number];
