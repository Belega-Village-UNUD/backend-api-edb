#!/bin/bash

if [ -z $1  ]; then
    echo "Please provide the external branch name the first argument"
    exit 1
fi

if [ -z $2  ]; then
    echo "Please provide the commit sha the second argument"
    exit 1
fi

BRANCH=$1
COMMIT_SHA=$2
REGISTRY=$3
IMAGE_NAME=$4

echo "Performing build for staging" $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

git pull --force origin $BRANCH;

if [ $? -ne 0 ]; then
    echo "Error in pull and fetch $BRANCH of Backend Belega Service $?"
    exit 1
fi

set -x
docker image prune -f;

docker build . --file docker/service/Dockerfile \
  -t $REGISTRY/$IMAGE_NAME:$COMMIT_SHA \
  -t $REGISTRY/$IMAGE_NAME:$BRANCH

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH for Backend Belega Service $?"
    exit 1
fi

set +x

echo "Successfully build the image for registry.belegacommerce.shop/belega-village-unud/backend-api-edb:$COMMIT_SHA"
