#!/bin/bash

docker service ls | grep "ssl_nginx"

if [ $? -ne 0 ]; then
  docker stack deploy -c ./docker/ssl/docker-compose.yml ssl

  if [ $? -ne 0 ]; then
    echo "Failed to deploy nginx ssl service"
    exit 1
  fi
fi

docker config ls | grep "be.conf"

if [ $? -ne 0 ]; then
  export $(cat .env) > /dev/null 2>&1; envsubst < nginx/templates/be.conf.template > nginx/templates/be.conf
  if [ $? -ne 0 ]; then
    echo "Failed to deploy nginx ssl service"
    exit 1
  fi

  docker config create be.conf ./nginx/templates/be.conf

  if [ $? -ne 0 ]; then
    echo "Failed to create config for backend route"
    exit 1
  fi

  echo "Successfully created config for backend route"

else

  echo "Config file for backend route is available, updating now...."
  echo "Updating config backend route in ssl service"
  docker service update --config-rm be.conf ssl_nginx

  if [ $? -ne 0 ]; then
    echo "Failed to update config for backend in ssl service"
    exit 1
  fi

  echo "Updating configuration for backend route"
  docker config rm be.conf

  if [ $? -ne 0 ]; then
    echo "Failed to create update for backend route"
    exit 1
  fi

  export $(cat .env) > /dev/null 2>&1; envsubst < nginx/templates/be.conf.template > nginx/templates/be.conf

  if [ $? -ne 0 ]; then
    echo "Failed to update for backend route"
    exit 1
  fi

  docker config create be.conf ./nginx/templates/be.conf

  if [ $? -ne 0 ]; then
    echo "Failed updating config for backend route"
    exit 1
  fi
fi

docker service update --config-add source=be.conf,target=/etc/nginx/conf.d/be.conf,mode=0440 ssl_nginx

if [ $? -ne 0 ]; then
  echo "Failed updating config for backend route on ssl service"
  exit 1
fi

if [ $(docker service ps ssl_nginx | grep -i running | wc -l) == 0 ]; then
  docker service update --config-rm --force be.conf
  docker config rm be.cponf 
  echo "Failed updating config for backend route on ssl service, something is wrong with the nginx configuration, please check the template and make sure the variable is available"
  exit 1
fi


echo "Successfully updating backend config on service ssl_nginx"

echo "Successfully deploy the image for registry.belegacommerce.shop/belega-village-unud/backend-api-edb:$COMMIT_SHA on service backend_app"

docker service ls | grep ssl_nginx | awk '{print $2, $3, $4, $5}'
