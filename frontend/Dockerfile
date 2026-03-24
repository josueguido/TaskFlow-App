FROM node:25-alpine3.21 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app

ARG APP_VERSION
ARG GIT_SHA

ENV VITE_APP_VERSION=$APP_VERSION
ENV VITE_GIT_SHA=$GIT_SHA

COPY . .
RUN npm run build

FROM nginx:alpine3.22 AS prod
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
