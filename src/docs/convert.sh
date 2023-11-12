#!/bin/bash
# reference: https://metamug.com/article/api-integration/postman-to-swagger.html
# take argument input the first argument is the old file and the second argument is the new file
# example: ./convert.sh renata-api-docs.v1 .api-docs/renata-api-docs.v1.1

p2o $1.postman.json -f $1.swagger.yml
#sed -i "$1.yaml~.api-docs/$2.yaml~g" ./src/routes/api-docs/index.js
