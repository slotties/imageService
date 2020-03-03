[![Version](https://img.shields.io/github/package-json/v/slotties/imageService.svg)](https://github.com/slotties/imageService)
[![Build Status](https://travis-ci.org/slotties/imageService.png?branch=master)](https://travis-ci.org/slotties/imageService)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# What is this about?

This service allows on-the-fly resizing of images.

## Concepts

The service uses a local storage to search files. This might be a *nix mount as well.

The service stores resized images to an output folder. The service is expected to be used in behind an nginx or apache/HTTPD that handles delivery using the output folder.

# How to start the service?

    node ./src/main.js --port=[target port] --imageSourceDirectory=/usr/share/images --cacheDirectory=/var/cache/images --tmpDirectory=/tmp/images

# Endpoints

## Health check

    /health

The endpoint will always return an HTTP 200 with the body `UP`.
Unavailability of this endpoint means the server is not available and should be taken out of the load balancer.

## Resizing

     /resized/mediaId_WxH.jpg

The path is made of these variable parts:
- `mediaId`: the base64 encoded path to the file.
- `WxH` is the `W`idth and the `H`eight of the output file. The image will be WxH _as good as possible_ meaning it will either fit the height or width of the input file but always keep the aspect ratio.
- `.jpg` is the target output encoding, e.g. JPG or PNG. Leaving this empty will result in the same format as the input file was. (*NOT IMPLEMENTED YET*)

The endpoint supports the following optional request parameters:
- `fill` - the output image will always have a dimension of the requested `WxH` (regardless the original size). Empty space resulting in keeping the aspect ratio of the original image will be filled with the color provided by the `bg` parameter.
- `bg` - defines a background color to fill up empty space when using the `fill` parameter.
- `progressive` - returns a progressive JPG. This parameter is ignored when the output format is not JPG. (*NOT IMPLEMENTED YET*)
- `sign` - a signature of the whole operation. The signature is calculated like this: `hmac-sha256(urlPath + '?' + queryWithoutSign)`.

TODO: switch to process.env.* for config parameters
TODO: switch to typescript
