#!/bin/bash
# reference: https://metamug.com/article/api-integration/postman-to-swagger.html
# Install in the https://joolfe.github.io/postman-to-openapi/
# npm i postman-to-openapi -g

# take argument input the first argument is the old file and the second argument is the new file
# example: ./convert.sh v1
p2o $1.postman.json -f $1.swagger.yaml

#sed -i "$1.yaml~.api-docs/$2.yaml~g" ./src/routes/api-docs/index.js
