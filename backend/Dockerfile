FROM node:24-alpine3.21 AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:24-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
