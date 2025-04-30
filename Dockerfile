FROM node:18-alpine AS base

# Installera beroenden som behövs för Prisma
RUN apk add --no-cache libc6-compat openssl

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiering av pakethanteraren för installation av beroenden
COPY package.json package-lock.json* ./

# Produktionsbyggen
FROM base AS builder
WORKDIR /app
COPY --from=base /app/package.json /app/package-lock.json* ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Produktionskörning
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Skapa en icke-root-användare för att köra applikationen
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Kopiera byggda filer från byggsteget
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Exponera porten som applikationen lyssnar på
EXPOSE 3000

# Starta applikationen
CMD ["npm", "start"]
