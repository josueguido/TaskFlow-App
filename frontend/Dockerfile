FROM node:24-alpine3.21 AS dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM dev-deps AS builder
COPY . .
RUN npm run build
FROM dev-deps AS test
COPY . .
RUN npm test 


FROM nginx:alpine3.22 AS prod
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

