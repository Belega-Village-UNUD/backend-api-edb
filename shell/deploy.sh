#!/bin/bash

BRANCH=$1
COMMIT_SHA=$2

echo $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

docker service ls | grep "backend_app"

if [ $? -ne 0 ]; then
  export $(cat .env) > /dev/null 2>&1; docker stack deploy -c ./docker/service/docker-compose.yml backend
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Backend Belega Service"
      exit 1
  fi
else
  docker service update --force --image ghcr.io/belega-village-unud/backend-api-edb:$COMMIT_SHA backend_app
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of Backend Belega Service"
      exit 1
  fi
fi

docker service ls | grep "ssl_nginx"

if [ $? -ne 0 ]; then
  export $(cat .env) > /dev/null 2>&1; docker stack deploy -c ./docker/ssl/docker-compose.yml ssl
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of SSL Belega Service"
      exit 1
  fi
else
  docker stack deploy -c ./docker/ssl/docker-compose.yml ssl
  if [ $? -ne 0 ]; then
      echo "Error in deploying $BRANCH of SSL Belega Service"
      exit 1
  fi
fi


if [ $? -ne 0 ]; then
    echo "Error in deploying $BRANCH of Backend Belega Service"
    exit 1
fi  

echo "Successfully deploy the image for ghcr.io/belega-village-unud/backend-api-edb:$COMMIT_SHA on service backend_app"

docker service ls | grep backend | awk '{print $2, $3, $4, $5}'

