FROM node:24-alpine3.21 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY config ./config
RUN npm run build

FROM node:24-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY config ./config

EXPOSE 3000

CMD ["node", "dist/server.js"]
