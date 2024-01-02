#!/bin/bash

git pull https://github.com/Belega-Village-UNUD/backend-api-edb.git
cd backend-api-edb
make build up
docker ps 
