#!/bin/bash

git clone https://github.com/Belega-Village-UNUD/backend-api-edb.git
cd backend-api-edb
git checkout EDP-67-sast-on-container
docker pull 
make up
docker ps 
