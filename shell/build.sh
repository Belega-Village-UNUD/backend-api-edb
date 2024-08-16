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

echo "Performing build for staging" $BRANCH;

if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
    echo "this branch is not up to date"
    git checkout $BRANCH;
    git fetch --dry-run;
fi

git pull origin $BRANCH;
docker image prune -f;
make build-staging;

if [ $? -ne 0 ]; then
    echo "Error in build $BRANCH and Deploy Backend Belega Service"
fi

docker ps;
