FROM node:18.16.0-alpine as base

RUN mkdir /app
WORKDIR /app

RUN npm install -g peer

EXPOSE 9000

ENTRYPOINT ["peerjs"]
CMD ["--port", "9000", "--key", "peerjs", "--path", "/rvc", "--proxied", "true", "--sslkey", "./ssl/privkey.pem", "--sslcert", "./ssl/fullchain.pem"]