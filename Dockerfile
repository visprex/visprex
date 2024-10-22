# stage 1: build
FROM node:lts-alpine as builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

# stage 2: serve
FROM fholzer/nginx-brotli:v1.26.2

WORKDIR /etc/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
