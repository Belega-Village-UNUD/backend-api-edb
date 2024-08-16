#!/bin/bash

BRANCH=$1
COMMIT_SHA=$2

echo $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

docker service update --force --image ghcr.io/belega-village-unud/backend-api-edb:$COMMIT_SHA backend_app

if [ $? -ne 0 ]; then
    echo "Error in deploying $BRANCH of Backend Belega Service"
    exit 1
fi

echo "Successfully deploy the image for ghcr.io/belega-village-unud/backend-api-edb:$COMMIT_SHA on service backend_app"

docker service ls | grep backend | awk '{print $2, $3, $4, $5}'

