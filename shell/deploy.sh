#!/bin/bash

cd backend-api-edb
git pull
make build up
docker ps 
