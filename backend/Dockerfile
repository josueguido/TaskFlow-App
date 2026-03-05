FROM node:24-alpine3.21 AS builder
WORKDIR /app

ARG APP_VERSION
ARG GIT_SHA

ENV NODE_ENV=development
ENV APP_VERSION=$APP_VERSION
ENV GIT_SHA=$GIT_SHA

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:24-alpine3.21 AS runner
WORKDIR /app

ARG APP_VERSION
ARG GIT_SHA

ENV NODE_ENV=production
ENV APP_VERSION=$APP_VERSION
ENV GIT_SHA=$GIT_SHA

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3003
CMD ["node", "dist/server.js"]
