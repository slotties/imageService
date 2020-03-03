FROM node:10.16.2-jessie

ARG VIPS_VERSION=8.8.1

WORKDIR /opt/imageService

COPY package*.json ./
# We have to install all dependencies inside the container because
# sharp will just install vendor-specific binaries/libraries.
# On my local machine this means I'll just have the darwin libraries for sharp but not the ones for linux.
RUN npm install

COPY src src

EXPOSE 80
CMD [ "node", "src/main.js", "--port=80", "--imageSourceDirectory=/usr/share/images", "--cacheDirectory=/var/cache/images", "--tmpDirectory=/tmp/images" ]