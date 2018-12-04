FROM nginx:stable-alpine

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir /app
COPY build/ /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
