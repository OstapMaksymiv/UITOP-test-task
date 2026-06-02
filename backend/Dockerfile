# syntax=docker/dockerfile:1

# ---- Build stage: install all deps and compile TS -> dist ----
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies based on the lockfile for reproducible builds.
COPY package*.json ./
RUN npm ci

# Compile the NestJS app to ./dist
COPY . .
RUN npm run build

# ---- Runtime stage: production deps + compiled output only ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only production dependencies (sql.js is a runtime dep, so it's included).
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Compiled JavaScript.
COPY --from=builder /app/dist ./dist

# Folder for the persisted sql.js database file (mounted as a volume in compose).
RUN mkdir -p /data
ENV DATABASE_PATH=/data/data.sqlite
ENV PORT=3001

EXPOSE 3001
CMD ["node", "dist/main.js"]
