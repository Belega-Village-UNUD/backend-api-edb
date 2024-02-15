#!/bin/bash

set -e

if [[ ! -e .env ]]; then 
   npx senv decrypt .env.dev.enc -o .env.dev;
fi


export $(grep -v '^#' .env.dev | xargs)

cp docker/service/docker-compose.yml docker/service/temp-docker-compose.yml

while IFS= read -r line; do
    var_name=$(echo "$line" | cut -d'=' -f1)
    var_value=$(printenv "$var_name")
    escaped_var_value="${var_value//\//\\/}"
    sed -i "s/\${${var_name}}/${escaped_var_value}/g" docker/service/temp-docker-compose.yml
done < .env.dev

sudo docker stack deploy -c docker/service/temp-docker-compose.yml backend_belega

# remove all the environment variables from the systems
while IFS= read -r line; do
    # Skip lines starting with '#' (comments)
    if [[ ! $line =~ ^# ]]; then
        # Extract the variable name
        var_name=$(echo "$line" | cut -d'=' -f1)
        # Unset the environment variable
        unset "$var_name"
    fi
done < .env.dev

rm docker/service/temp-docker-compose.yml .env.dev

