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

RUN npm install --omit=dev

# create ssl folder
RUN mkdir /app/ssl

# install openssl
RUN apk add --no-cache openssl

# generate ssl certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /app/ssl/key.pem -out /app/ssl/cert.pem -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com"

EXPOSE 8080

CMD ["node", "/app/index.js"]
