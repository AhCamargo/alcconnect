FROM nginx:alpine

COPY apps/landing/index.html apps/landing/styles.css apps/landing/main.js apps/landing/favicon.svg /usr/share/nginx/html/
COPY apps/landing/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
