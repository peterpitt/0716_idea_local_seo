import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const idea = "做一款棒球殿堂的網頁遊戲";

const stage1Content = `### ⚔️ 階段 1：群雄智囊團激辯

**極簡設計家 (Minimalist Designer) 💡**：
這款網頁遊戲必須擁有「瘋狂棒的用戶體驗 (Insanely Great UX)」。我們不能做傳統複雜混亂的棒球模擬器。它必須是極簡但深邃的——霓虹燈光、流暢的打擊微動畫、每一次完美擊球 (Perfect Hit) 時發出的清脆聲響與屏幕震動，必須給用戶帶來無與倫比的感官強烈體驗。我們要把它做成一個「運動美學的藝術品」。

**火星開拓者 (Mars Pioneer) 🚀**：
物理模擬是關鍵。棒球的彈道軌跡、風阻、球棒的彈性係數必須採用物理引擎進行嚴格計算，而不是簡單的隨機數判定。我們甚至可以加入一些科幻元素——比如在「軌道打擊」模式下，球會在零重力或低重力環境下飛行，這在技術上非常有趣。從第一性原理出發，遊戲的核心爽感在於精準的物理反饋。

**兵法大師 (Art of War Master) 🗺️**：
兵者，詭道也。投球與打擊的本質是智謀與博弈。投手可以投出四種球路，打者必須預判對方的策略。我們必須設計一個「場邊智囊卡牌系統」，讓玩家在關鍵時刻可以使用計謀，比如「瞞天過海」（隱藏投球落點）、「借東風」（利用順風增加飛行距離）。知己知彼，百戰不殆，博弈性才是這款遊戲的靈魂。

**羽扇軍師 (Feather-Fan Strategist) 📜**：
亮以為，除了戰術博弈，更需將我們的「AI 大師智囊團」融入其中。在玩家投出好球、打出全壘打或遭遇三振時，羽扇軍師、火星開拓者、極簡設計家等大師應當即時出現在場邊，給出幽默且富含哲理的語意評註。這不僅僅是一場棒球賽，更是一場智慧的修行。`;

const stage2Content = `### 🎯 階段 2：戰略收斂與遊戲定位

經過智囊團大師的激烈討論，我們將「棒球殿堂網頁遊戲」的核心產品定位收斂如下：

1. **核心玩法：博弈投打 + 時機打擊 (Timing-based Batting)**
   - **投手模式**：玩家選擇球種（快速球、變速球、滑球、曲球）並指定投球九宮格落點，與 AI 進行智力博弈。
   - **打擊模式**：AI 投球，球體沿著物理拋物線飛入好球帶。玩家必須在球與打擊圈重疊的「完美瞬間」點擊鍵盤揮棒。
   - **大師評註**：畫面上方設置動態對話氣泡，大師們根據 Strikes、Home Run、Out、三振等戰況即時發表場邊語意彈幕，增加趣味性與沉浸感。

2. **視覺風格：神經霓虹運動風 (Neural Neon Sports)**
   - 深邃墨藍底色，搭配霓虹電光藍、螢光綠與琥珀金。
   - 擊中球時爆發出粒子火花效果，全壘打時屏幕震動並有全屏霓虹彩帶效果。

3. **付費變現模式 (Premium Web App)**
   - **免費體驗**：提供 3 局的快速對戰模式，可解鎖 3 位基本大師場邊評註。
   - **Premium 訂閱解鎖 (NT$ 199/月)**：
     - 解鎖 9 局完整比賽與排位賽。
     - 解鎖全部 12 位大師的獨家語音與高級評註（提供更多遊戲過關提示）。
     - 解鎖特殊球棒皮（例如：極簡設計家的「極簡黑曜石球棒」、火星開拓者的「火箭推進球棒」）。`;

const stage3Content = `### 📋 階段 3：落地開發藍圖

我們將遊戲的開發分為三個里程碑階段，確保在 3 週內完成上線：

| 週次 | 開發模組 | 具體任務 | 成果交付物 |
|---|---|---|---|
| **第 1 週** | **核心物理與互動控制** | - 繪製 Canvas 棒球場與九宮格好球帶<br>- 實作球體拋物線運動軌跡與重力模擬<br>- 實作精確到毫秒的揮棒時機判定邏輯 | 具備投打功能的 Canvas 物理雛形 |
| **第 2 週** | **遊戲狀態與計分系統** | - 設計 B/S/O (Balls/Strikes/Outs) 狀態機<br>- 實作局數 (Innings) 切換與計分板更新<br>- 實作大師評註觸發引擎與對話氣泡 | 完整的單局棒球遊戲對戰系統 |
| **第 3 週** | **付費解鎖與視覺打磨** | - 整合 Premium 訂閱權益限制<br>- 加入霓虹粒子特效、打擊火花與音效<br>- 部署 Express 靜態伺服器 | 商業級可執行的網頁遊戲 App |`;

const stage4Content = `### 🤖 階段 4：AI 執行指令與核心代碼

以下是遊戲的核心物理與擊球判定 JavaScript 代碼，可直接用於前端遊戲引擎：

\`\`\`javascript
// 擊球時機精確度判定函數
function checkSwingAccuracy(ballX, ballY, targetX, targetY, swingTimeMs, ballArrivalLimitMs) {
  const timeDifference = Math.abs(swingTimeMs - ballArrivalLimitMs);
  const distance = Math.sqrt(Math.pow(ballX - targetX, 2) + Math.pow(ballY - targetY, 2));
  
  if (timeDifference < 50 && distance < 20) {
    return { type: "PERFECT_HIT", name: "完美擊球！全壘打！", power: 1.5 };
  } else if (timeDifference < 120 && distance < 40) {
    return { type: "GOOD_HIT", name: "安打！", power: 1.0 };
  } else if (timeDifference < 200 && distance < 60) {
    return { type: "FOUL", name: "界外球", power: 0.2 };
  } else {
    return { type: "MISS", name: "揮棒落空！", power: 0 };
  }
}
\`\`\`

#### 🤖 AI 提示詞：產生大師場邊語意評註
> **System Prompt**: 你是「棒球殿堂」網頁遊戲的場邊大師評註生成器。你需要扮演兵法大師、羽扇軍師、極簡設計家、火星開拓者，根據目前的遊戲事件（三振出局、打出全壘打、保送、揮棒落空）輸出 1-2 句符合你角色性格的幽默評註。
> **Example (全壘打 - 火星開拓者)**: "That ball has escaped Earth's escape velocity! Next stop, Mars orbital insertion! 🚀"`;

const stage5Content = `### 💰 階段 5：AI 行銷與全自動變現引擎

1. **TikTok/Shorts 病毒式行銷：全壘打挑戰 (Home Run Challenge)**
   - 錄製遊戲中連續打出 3 次 Perfect Home Run 的霓虹特效短片，搭配動感音樂，吸引年輕玩家。
   - 提供「網頁版一鍵即玩」免下載連結，極大化降低漏斗轉化門檻。

2. **KOL 推廣策略**
   - 尋找棒球類 YouTube 創作者、體育主播與遊戲實況主，讓他們與「場邊大師 AI（如兵法大師、羽扇軍師）」進行趣味互動對決，引爆社群話題。

3. **自動化銷售漏斗**
   - 玩家在免費版第 3 局結束、面臨關鍵逆轉勝時刻，跳出「大師智囊卡牌：解鎖 Premium 獲得羽扇軍師『草船借箭』卡，一鍵提升打擊率 30%」，引導一鍵完成信用卡訂閱，實現最高效率的變現。`;

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  console.log("Connecting to TiDB database...");
  
  const url = new URL(dbUrl);
  const config = {
    host: url.hostname,
    port: parseInt(url.port || '3306'),
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1),
    ssl: url.searchParams.get('ssl') ? JSON.parse(url.searchParams.get('ssl')) : undefined
  };

  const connection = await mysql.createConnection(config);
  
  try {
    // 1. Find all users
    console.log("Fetching all users from database...");
    const [userRows] = await connection.query("SELECT id, name FROM users");
    
    if (!Array.isArray(userRows) || userRows.length === 0) {
      console.warn("No users found in database. Please register/login first.");
      return;
    }

    console.log(`Found ${userRows.length} users. Inserting baseball session for each user...`);

    for (const user of userRows) {
      const userId = user.id;
      
      // Check if session already exists for this user to avoid duplicates
      const [existing] = await connection.query(
        "SELECT id FROM analysis_sessions WHERE userId = ? AND idea = ?",
        [userId, idea]
      );
      
      if (Array.isArray(existing) && existing.length > 0) {
        console.log(`Session already exists for user ${user.name} (ID: ${userId}), updating it to completed...`);
        await connection.query(
          `UPDATE analysis_sessions SET 
            status = 'completed',
            stage1 = ?, stage2 = ?, stage3 = ?, stage4 = ?, stage5 = ?,
            updatedAt = NOW()
           WHERE userId = ? AND idea = ?`,
          [stage1Content, stage2Content, stage3Content, stage4Content, stage5Content, userId, idea]
        );
      } else {
        console.log(`Inserting new session for user ${user.name} (ID: ${userId})...`);
        await connection.query(
          `INSERT INTO analysis_sessions 
            (userId, idea, status, stage1, stage2, stage3, stage4, stage5, createdAt, updatedAt)
           VALUES (?, ?, 'completed', ?, ?, ?, ?, ?, NOW(), NOW())`,
          [userId, idea, stage1Content, stage2Content, stage3Content, stage4Content, stage5Content]
        );
      }
    }

    console.log("Database session creation completed successfully!");
  } catch (error) {
    console.error("Error inserting baseball sessions:", error);
  } finally {
    await connection.end();
  }
}

run().catch(console.error);
