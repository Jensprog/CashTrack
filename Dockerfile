FROM node:18-alpine AS base
# Installera beroenden som behövs för Prisma
RUN apk add --no-cache libc6-compat openssl
# Sätt arbetskatalogen i containern
WORKDIR /app

ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET:-secure_default_secret}

# Kopiera package.json för dependency caching
COPY package.json package-lock.json* ./
RUN npm ci
# Kopierar resten av koden
COPY . .
# VIKTIGT: Generera Prisma-klient INNAN build
RUN npx prisma generate
# Bygg applikationen
RUN npm run build

# Produktionskörning
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV JWT_SECRET=${JWT_SECRET:-secure_default_secret}

# Installera system dependencies
RUN apk add --no-cache libc6-compat openssl

# Skapa en icke-root-användare för att köra applikationen
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiera ALLA nödvändiga filer från byggsteget
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=base --chown=nextjs:nodejs /app/public ./public
COPY --from=base --chown=nextjs:nodejs /app/prisma ./prisma

# Kopiera startup script
COPY --from=base --chown=nextjs:nodejs /app/scripts/start.sh ./start.sh

# Gör scriptet körbart
USER root
RUN chmod +x ./start.sh
USER nextjs

# Säkerställ att Prisma client fungerar i runtime
RUN npx prisma generate

# Exponera porten som applikationen lyssnar på
EXPOSE 3000

# Starta applikationen med startup script
CMD ["./start.sh"]