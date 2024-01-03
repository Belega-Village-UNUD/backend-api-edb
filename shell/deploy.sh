#!/bin/bash

git fetch;
git pull origin staging;
docker pull ghcr.io/belega-village-unud/backend-api-edb:staging;
make up dns;
docker image prune;
docker ps;
