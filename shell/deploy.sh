#!/bin/bash

BRANCH=$1

echo $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    git checkout $BRANCH;
fi

git fetch;

git pull origin $BRANCH;
docker image prune -f;
make build-staging up;

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH and Deploy Backend Belega Service"
fi


docker ps;
