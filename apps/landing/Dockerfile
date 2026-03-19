FROM nginx:1.27-alpine3.21

COPY index.html styles.css main.js favicon.svg /usr/share/nginx/html/
COPY apps/landing/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
