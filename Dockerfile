FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=Europe/Moscow

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["node", "dist/main"]