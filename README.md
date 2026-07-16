# 🧠 AI 在地商家地圖優化與評論自動變現系統 (0716_idea_local_seo)

基於 React + Vite 前端與 Express + tRPC 後端的「一人公司 AI 專家智囊團」系統。此分支已為今日 7/16 的點子：**AI 在地地圖優化與自動變現系統** 進行專屬設計與 PRD 配置。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpeterpitt%2F0716_idea_local_seo)

---

## 🚀 成果檢視與部署指南

為了讓您能立即看到本專案的成果，我們提供了 **GitHub 直接檢視** 與 **一鍵部署至 Vercel** 的預覽功能。

### 1. 於 GitHub 檢視
*   **倉庫連結**: [https://github.com/peterpitt/0716_idea_local_seo](https://github.com/peterpitt/0716_idea_local_seo)
*   **產品需求文件 (PRD)**: 根目錄下的 [PRD.md](https://github.com/peterpitt/0716_idea_local_seo/blob/main/PRD.md) 已寫入本日 AI 創業點子的完整業務與技術細節。
*   **專家大師名單**: 在 [shared/advisors.ts](https://github.com/peterpitt/0716_idea_local_seo/blob/main/shared/advisors.ts) 中查看已去名化（Anonymized）的導師陣容。

### 2. ⚡ 一鍵部署至 Vercel (前端預覽)
您不需要在本地安裝 Node.js，即可將本專案的前端介面一鍵託管到 Vercel：

1.  點擊上方的 **[Deploy with Vercel]** 按鈕。
2.  登入您的 GitHub 帳號並授權。
3.  Vercel 會自動為您在 GitHub 上建立一個該專案的副本，並進行構建。
4.  **Vercel 專案設定** (自動偵測):
    *   **Build Command**: `vite build`
    *   **Output Directory**: `dist/public`
5.  建置完成後，Vercel 會提供一個預覽網址（例如：`https://0716-idea-local-seo.vercel.app`），點擊即可直接開啟運行的 Web UI 介面，體驗極緻的賽博朋克黑曜石智囊團主頁！

---

## 🛠️ 本地開發指南

如果您想在 VS Code 中運行並測試包含 AI 串流的後端完整功能，請參考：

```bash
# 1. 複製環境變數範本並命名為 .env
cp env-template.txt .env

# 2. 編輯 .env 填入您的 OpenAI Key
# BUILT_IN_FORGE_API_KEY=sk-...

# 3. 安裝套件
pnpm install

# 4. 同步資料庫 (TiDB)
pnpm db:push

# 5. 啟動開發伺服器
pnpm dev
```
👉 啟動後在瀏覽器打開 `http://localhost:3000` 即可使用。
