FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY --from=0 /app/dist /app

COPY package.json /app

RUN npm install --production

EXPOSE 8080

CMD ["node", "/app/index.js"]