FROM node:10

WORKDIR /opt/imageService

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "src/main.js", "--port=8080", "--imageSourceDirectory=/usr/share/images", "--cacheDirectory=/var/cache/images", "--tmpDirectory=/tmp/images" ]