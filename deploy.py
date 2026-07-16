#!/usr/bin/env python3
"""
============================================
一人公司頂級 AI 專家智囊團 - 一鍵部署腳本
============================================

使用方式：
    pip install docker python-dotenv
    python deploy.py

此腳本會自動：
1. 檢查 Docker 是否已安裝
2. 建立 .env 設定檔（若不存在）
3. 建置 Docker Image
4. 啟動 MySQL + 應用程式容器
5. 等待服務就緒並顯示存取網址
"""

import os
import sys
import time
import subprocess
import shutil
from pathlib import Path

# ============ 設定區 ============
PROJECT_NAME = "solopreneur-think-tank"
DEFAULT_PORT = 3000
IMAGE_NAME = "solopreneur-think-tank"
CONTAINER_NAME_APP = "thinktank-app"
CONTAINER_NAME_DB = "thinktank-db"
NETWORK_NAME = "thinktank-network"

# 預設環境變數
DEFAULT_ENV = {
    "MYSQL_ROOT_PASSWORD": "thinktank_root_pw_2024",
    "MYSQL_DATABASE": "thinktank",
    "MYSQL_USER": "thinktank",
    "MYSQL_PASSWORD": "thinktank_pw_2024",
    "PORT": str(DEFAULT_PORT),
    "JWT_SECRET": "change-me-to-a-random-secret-string",
    "BUILT_IN_FORGE_API_URL": "",
    "BUILT_IN_FORGE_API_KEY": "",
    "VITE_APP_ID": "local",
    "OAUTH_SERVER_URL": "",
    "OWNER_OPEN_ID": "local-owner",
    "VITE_OAUTH_PORTAL_URL": "",
    "VITE_FRONTEND_FORGE_API_URL": "",
    "VITE_FRONTEND_FORGE_API_KEY": "",
}


def print_banner():
    """顯示啟動橫幅"""
    print("""
╔══════════════════════════════════════════════════════╗
║   🧠 一人公司頂級 AI 專家智囊團 - 部署工具          ║
║   Solopreneur AI Think Tank - Deployment Tool       ║
╚══════════════════════════════════════════════════════╝
    """)


def check_docker():
    """檢查 Docker 是否可用"""
    print("🔍 檢查 Docker 環境...")
    if not shutil.which("docker"):
        print("❌ 錯誤：未找到 Docker。請先安裝 Docker Desktop。")
        print("   下載地址：https://www.docker.com/products/docker-desktop/")
        sys.exit(1)

    try:
        result = subprocess.run(
            ["docker", "info"], capture_output=True, text=True, timeout=10
        )
        if result.returncode != 0:
            print("❌ 錯誤：Docker 未啟動。請啟動 Docker Desktop 後重試。")
            sys.exit(1)
    except subprocess.TimeoutExpired:
        print("❌ 錯誤：Docker 回應超時。請確認 Docker Desktop 已啟動。")
        sys.exit(1)

    print("✅ Docker 環境正常")


def check_docker_compose():
    """檢查 docker compose 是否可用"""
    # Try 'docker compose' (v2)
    try:
        result = subprocess.run(
            ["docker", "compose", "version"], capture_output=True, text=True, timeout=5
        )
        if result.returncode == 0:
            return ["docker", "compose"]
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass

    # Try 'docker-compose' (v1)
    if shutil.which("docker-compose"):
        return ["docker-compose"]

    print("❌ 錯誤：未找到 docker compose。")
    print("   Docker Desktop 通常自帶 docker compose。")
    print("   若使用 Linux，請安裝：https://docs.docker.com/compose/install/")
    sys.exit(1)


def setup_env():
    """設定環境變數"""
    env_path = Path(".env")

    if env_path.exists():
        print("📋 發現已有 .env 設定檔，使用現有設定")
        # Load existing env
        env = {}
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, value = line.partition("=")
                    env[key.strip()] = value.strip()
        return env

    print("\n📝 首次部署，需要設定環境變數...")
    print("=" * 50)

    env = DEFAULT_ENV.copy()

    # Ask for LLM API key
    print("\n🤖 LLM API 設定（用於真實 AI 分析，必填）")
    print("   支援 OpenAI 相容格式的 API（OpenAI / Anthropic / 本地模型等）")
    print()

    api_url = input(f"   API Base URL [預設: https://api.openai.com]: ").strip()
    if api_url:
        env["BUILT_IN_FORGE_API_URL"] = api_url
    else:
        env["BUILT_IN_FORGE_API_URL"] = "https://api.openai.com"

    api_key = input("   API Key (sk-...): ").strip()
    if api_key:
        env["BUILT_IN_FORGE_API_KEY"] = api_key
    else:
        print("   ⚠️  未設定 API Key，AI 分析功能將無法使用。")
        print("   您可以稍後編輯 .env 檔案補上。")

    # Ask for port
    port = input(f"\n🌐 應用程式埠號 [預設: {DEFAULT_PORT}]: ").strip()
    if port:
        env["PORT"] = port

    # Generate random JWT secret
    import secrets
    env["JWT_SECRET"] = secrets.token_hex(32)

    # Write .env file
    with open(env_path, "w") as f:
        f.write("# 一人公司頂級 AI 專家智囊團 - 環境變數\n")
        f.write(f"# 產生時間：{time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        for key, value in env.items():
            f.write(f"{key}={value}\n")

    print(f"\n✅ 設定已儲存至 .env")
    return env


def build_and_start(compose_cmd):
    """建置並啟動容器"""
    print("\n🔨 建置 Docker Image（首次可能需要幾分鐘）...")
    print("=" * 50)

    # Build and start
    cmd = compose_cmd + ["up", "--build", "-d"]
    result = subprocess.run(cmd, timeout=600)

    if result.returncode != 0:
        print("\n❌ 建置失敗。請檢查上方錯誤訊息。")
        sys.exit(1)

    print("\n✅ 容器已啟動")


def wait_for_ready(env):
    """等待服務就緒"""
    port = env.get("PORT", str(DEFAULT_PORT))
    print(f"\n⏳ 等待服務就緒...")

    max_retries = 30
    for i in range(max_retries):
        try:
            import urllib.request
            url = f"http://localhost:{port}/"
            req = urllib.request.Request(url, method="HEAD")
            urllib.request.urlopen(req, timeout=3)
            return True
        except Exception:
            time.sleep(2)
            print(f"   等待中... ({i + 1}/{max_retries})")

    print("⚠️  服務啟動超時，但容器可能仍在初始化中。")
    return False


def print_success(env):
    """顯示成功訊息"""
    port = env.get("PORT", str(DEFAULT_PORT))
    print(f"""
╔══════════════════════════════════════════════════════╗
║   ✅ 部署成功！                                      ║
╚══════════════════════════════════════════════════════╝

🌐 存取網址：http://localhost:{port}

📋 管理指令：
   查看日誌：  docker compose logs -f
   停止服務：  docker compose down
   重新啟動：  docker compose restart
   重新建置：  docker compose up --build -d

📝 設定檔：
   環境變數：  .env
   資料庫：    MySQL (port 3306)

💡 提示：
   - 修改 .env 後需重啟：docker compose restart app
   - 資料庫資料保存在 Docker Volume 中，不會因停止容器而遺失
   - 若要更換 LLM API Key，編輯 .env 中的 BUILT_IN_FORGE_API_KEY
    """)


def stop():
    """停止所有容器"""
    compose_cmd = check_docker_compose()
    print("🛑 停止所有容器...")
    subprocess.run(compose_cmd + ["down"])
    print("✅ 已停止")


def main():
    print_banner()

    # Handle commands
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd == "stop":
            stop()
            return
        elif cmd == "logs":
            compose_cmd = check_docker_compose()
            subprocess.run(compose_cmd + ["logs", "-f"])
            return
        elif cmd == "restart":
            compose_cmd = check_docker_compose()
            subprocess.run(compose_cmd + ["restart"])
            return
        elif cmd in ("help", "--help", "-h"):
            print("""
用法：python deploy.py [指令]

指令：
  (無)      首次部署或重新建置啟動
  stop      停止所有容器
  logs      查看即時日誌
  restart   重新啟動服務
  help      顯示此說明
            """)
            return

    # Main deployment flow
    check_docker()
    compose_cmd = check_docker_compose()
    env = setup_env()
    build_and_start(compose_cmd)
    ready = wait_for_ready(env)
    print_success(env)

    if not ready:
        print("⚠️  服務可能仍在啟動中，請稍後再試存取網址。")


if __name__ == "__main__":
    main()
