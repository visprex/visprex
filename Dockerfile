# Stage 1: Build App
FROM node:18-alpine AS vite-builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Build Nginx
FROM alpine:latest AS nginx-builder

RUN apk add --no-cache \
    build-base \
    curl \
    gcc \
    libc-dev \
    make \
    pcre-dev \
    zlib-dev \
    linux-headers \
    openssl-dev \
    perl \
    gnupg \
    brotli-dev \
    git \
    nodejs

ENV NGINX_VERSION=1.25.4
ENV NGINX_BUILD_DIR=/usr/local/src/nginx

RUN mkdir -p $NGINX_BUILD_DIR \
    && cd $NGINX_BUILD_DIR \
    && curl -fsSL http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz | tar xz --strip 1

RUN cd $NGINX_BUILD_DIR \
    && git clone --depth=1 https://github.com/google/ngx_brotli.git ngx_brotli \
    && cd ngx_brotli \
    && git submodule update --init

RUN mkdir -p /var/cache/nginx /usr/share/nginx/html

RUN cd $NGINX_BUILD_DIR \
    && ./configure \
        --prefix=/etc/nginx \
        --sbin-path=/usr/sbin/nginx \
        --modules-path=/usr/lib/nginx/modules \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --pid-path=/var/run/nginx.pid \
        --lock-path=/var/run/nginx.lock \
        --http-client-body-temp-path=/var/cache/nginx/client_temp \
        --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
        --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
        --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
        --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
        --with-http_ssl_module \
        --with-http_v2_module \
        --with-http_gzip_static_module \
        --with-http_stub_status_module \
        --with-http_realip_module \
        --add-module=./ngx_brotli \
    && make -j$(nproc) \
    && make install


# Stage 3: Serve
FROM alpine:latest

RUN apk add --no-cache \
    pcre \
    zlib \
    openssl \
    brotli

COPY --from=nginx-builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=nginx-builder /etc/nginx /etc/nginx

RUN mkdir -p /usr/share/nginx/html \
    && mkdir -p /var/log/nginx \
    && mkdir -p /var/run \
    && mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=vite-builder /app/dist /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html \
    && chown -R root:root /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
