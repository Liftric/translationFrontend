FROM node:alpine

COPY build/ /app
WORKDIR /app
RUN yarn add serve

EXPOSE 5000
CMD ./node_modules/.bin/serve