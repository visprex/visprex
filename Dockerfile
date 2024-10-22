# stage 1: build
FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

# stage 2: serve 
FROM nginx:stable-alpine as production
RUN apk add --no-cache nginx-mod-brotli

WORKDIR /etc/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
