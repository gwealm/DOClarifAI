FROM caddy:2.7-alpine as runner
WORKDIR /app
COPY config/Caddyfile ./

CMD ["caddy", "run"]