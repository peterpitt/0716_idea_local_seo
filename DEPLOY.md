# 🧠 一人公司頂級 AI 專家智囊團 — 本地部署指南

## 前置需求

- **Docker Desktop** (含 Docker Compose)
- **Python 3.8+** (用於執行部署腳本)

## 快速啟動（一鍵部署）

```bash
# 1. 進入專案目錄
cd solopreneur-think-tank

# 2. 安裝 Python 依賴（僅需 docker 套件）
pip install docker python-dotenv

# 3. 執行部署腳本
python deploy.py
```

腳本會引導你設定 LLM API Key，然後自動建置 Docker Image 並啟動服務。

## 手動部署（使用 Docker Compose）

```bash
# 1. 複製環境變數範本
cp env-template.txt .env

# 2. 編輯 .env，填入你的 LLM API Key
#    必填：BUILT_IN_FORGE_API_URL 和 BUILT_IN_FORGE_API_KEY

# 3. 建置並啟動
docker compose up --build -d

# 4. 查看日誌
docker compose logs -f

# 5. 存取應用
open http://localhost:3000
```

## 環境變數說明

| 變數名稱 | 必填 | 說明 |
|---------|------|------|
| `BUILT_IN_FORGE_API_URL` | ✅ | LLM API 的 Base URL（如 `https://api.openai.com`） |
| `BUILT_IN_FORGE_API_KEY` | ✅ | LLM API Key（如 `sk-...`） |
| `JWT_SECRET` | ✅ | Session 加密金鑰（部署腳本會自動生成） |
| `PORT` | ❌ | 應用程式埠號（預設 3000） |
| `MYSQL_DATABASE` | ❌ | 資料庫名稱（預設 thinktank） |
| `MYSQL_USER` | ❌ | 資料庫使用者（預設 thinktank） |
| `MYSQL_PASSWORD` | ❌ | 資料庫密碼（預設 thinktank_pw） |

### LLM API 支援

本系統使用 OpenAI 相容格式的 API，以下服務皆可使用：

- **OpenAI** — `https://api.openai.com`
- **Azure OpenAI** — 你的 Azure endpoint
- **Anthropic (via proxy)** — 需要 OpenAI 相容的 proxy
- **本地模型 (Ollama, vLLM)** — `http://host.docker.internal:11434/v1`（Ollama）

## 管理指令

```bash
# 查看即時日誌
python deploy.py logs
# 或
docker compose logs -f

# 停止服務
python deploy.py stop
# 或
docker compose down

# 重新啟動
python deploy.py restart
# 或
docker compose restart

# 重新建置（程式碼更新後）
docker compose up --build -d
```

## 資料持久化

- 資料庫資料儲存在 Docker Volume `mysql_data` 中
- 停止容器不會遺失資料
- 若要完全清除資料：`docker compose down -v`

## 故障排除

### 1. Docker 建置失敗
```bash
# 清除快取重新建置
docker compose build --no-cache
docker compose up -d
```

### 2. 資料庫連線失敗
```bash
# 確認 MySQL 容器已就緒
docker compose logs db
# 等待出現 "ready for connections" 後重啟 app
docker compose restart app
```

### 3. LLM API 無回應
- 確認 `.env` 中的 `BUILT_IN_FORGE_API_KEY` 正確
- 確認 API URL 可從 Docker 容器內存取
- 若使用本地模型，URL 應為 `http://host.docker.internal:PORT/v1`

### 4. 埠號衝突
```bash
# 修改 .env 中的 PORT 為其他值
PORT=8080
# 重新啟動
docker compose up -d
```

## 架構說明

```
┌─────────────────────────────────────────┐
│           Docker Compose                 │
│                                         │
│  ┌──────────┐      ┌──────────────┐    │
│  │  MySQL   │◄────►│  Node.js App │    │
│  │  :3306   │      │    :3000     │    │
│  └──────────┘      └──────────────┘    │
│       │                    │            │
│       ▼                    ▼            │
│  mysql_data         LLM API (外部)      │
│  (Volume)                               │
└─────────────────────────────────────────┘
```

- **Node.js App**：前端 (React + Vite) + 後端 (Express + tRPC)，打包為單一服務
- **MySQL**：儲存使用者資料與分析歷史
- **LLM API**：外部 AI 服務，用於真實智囊團分析
