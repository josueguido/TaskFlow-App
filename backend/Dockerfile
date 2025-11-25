FROM node:24-alpine3.21 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM node:24-alpine3.21 AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:24-alpine3.21 AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./tsconfig.json

ENV NODE_OPTIONS="--experimental-specifier-resolution=node --require tsconfig-paths/register"
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
