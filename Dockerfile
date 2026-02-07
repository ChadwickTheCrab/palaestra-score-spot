# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arg for commit hash
ARG GIT_COMMIT=dev
ENV GIT_COMMIT=${GIT_COMMIT}

# Copy package files
COPY package.json ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]