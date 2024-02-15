#!/bin/bash

export $(cat .env) > /dev/null 2>&1; 
docker stack deploy -c docker/service/docker-compose.yml ${1:-STACK_NAME}
docker stack deploy -c docker/ssl/docker-compose.yml ${1:-STACK_NAME}
