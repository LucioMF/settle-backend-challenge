FROM alpine:3.4
RUN apk update && apk upgrade
RUN apk add nodejs
RUN rm -rf /var/cache/apk/*

COPY . /src
RUN cd /src; npm install
EXPOSE 8080
CMD ["node", "/src/app.js"]