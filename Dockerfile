FROM node:18-alpine AS base

# Installera beroenden som behövs för Prisma
RUN apk add --no-cache libc6-compat openssl

# Sätt arbetskatalogen i containern
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Kopierar resten av koden
COPY . .

# Generera Prisma-klient
RUN npx prisma generate

# Bygg applikationen
RUN npm run build

# Produktionskörning
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Skapa en icke-root-användare för att köra applikationen
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Kopiera ENDAST de nödvändiga filerna från byggsteget
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=base --chown=nextjs:nodejs /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/prisma ./prisma

# Exponera porten som applikationen lyssnar på
EXPOSE 3000

# Starta applikationen
CMD ["npm", "start"]