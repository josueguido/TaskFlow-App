FROM node:24-alpine3.21 as dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install


FROM node:24-alpine3.21 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM node:24-alpine3.21 as runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/main.js"]




