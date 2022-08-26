FROM node:18-alpine

WORKDIR /app

COPY . .

# prodution only packages - app errors
RUN npm install --production

RUN npm build

CMD ["npm", "run", "start:prod"]