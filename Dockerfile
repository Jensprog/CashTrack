# Multi-stage build to cache node_modules
FROM node:18-alpine AS dependencies

# Install system dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# If package.json has no changes, node_modules is reused.
COPY package.json package-lock.json* ./

# Only installing production dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Seperate stage for devDependencies
FROM node:18-alpine AS dev-dependencies
WORKDIR /app

# Copying package files
COPY package.json package-lock.json* ./

# Installing all dependencies for build
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

# Build stage
FROM dev-dependencies AS builder
WORKDIR /app

# Copying source code
COPY . .

# Build environment
ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET:-secure_default_secret}
ENV NODE_ENV=production

# Generate prisma client and build the app
RUN npx prisma generate && \
    npm run build

# Final production stage
FROM node:18-alpine AS runner
WORKDIR /app

# System packages
RUN apk add --no-cache libc6-compat openssl dumb-init

# Create user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Environment
ENV NODE_ENV=production
ENV JWT_SECRET=${JWT_SECRET:-secure_default_secret}

# Only copying production node_modules
COPY --from=dependencies --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copying builder files from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Change to non root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/auth/status || exit 1

# Dumb-init as entrypoint to handles signals correct
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]