#!/bin/bash

BRANCH=$1

echo $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

git pull origin $BRANCH;
docker image prune -f;
make build-staging up;

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH and Deploy Backend Belega Service"
fi

docker ps;
