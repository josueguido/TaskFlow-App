
FROM node:24-alpine3.21 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

FROM node:24-alpine3.21 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# RUN npm test
RUN npm run build


FROM nginx:1.23.3 as prod
EXPOSE 80
COPY --from=builder /app/dist /usr/share/nginx/html
COPY  assets/ /usr/share/nginx/html/assets
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

CMD [ "nginx","-g", "daemon off;"]









