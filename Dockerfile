# stage 1: build
FROM node:lts-alpine as builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

# stage 2: serve
FROM fholzer/nginx-brotli:v1.12.1

WORKDIR /etc/nginx

ADD nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
