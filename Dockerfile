FROM node:12-alpine
WORKDIR /comment-service
COPY package.json /comment-service
RUN  npm install
COPY . /commentservice
EXPOSE 3000
CMD ["node", "app.js"]
