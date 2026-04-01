FROM oven/bun AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --no-save --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

FROM oven/bun AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN set -eux; \
    if command -v addgroup >/dev/null 2>&1 && command -v adduser >/dev/null 2>&1; then \
      addgroup --system --gid 1001 nodejs && \
      adduser --system --uid 1001 --ingroup nodejs --home /nonexistent --disabled-password --gecos "" nextjs; \
    else \
      echo "addgroup/adduser unavailable; skipped"; \
    fi

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY healthcheck.ts ./

USER nextjs

EXPOSE 3000
CMD ["bun", "./server.js"]
