# ============================================
# 一人公司頂級 AI 專家智囊團 - Docker Image
# ============================================

# --- Stage 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend (Vite) and backend (esbuild)
RUN pnpm run build

# --- Stage 2: Production ---
FROM node:22-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy package files and install production deps only
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Copy drizzle schema (needed at runtime for ORM)
COPY drizzle/ ./drizzle/
COPY shared/ ./shared/

# Expose port (default 3000, configurable via PORT env)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/ || exit 1

# Start the server
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
