build:
	docker build . --file docker/service/Dockerfile -t ghcr.io/belega-village-unud/backend-api-edb:v1 -t ghcr.io/belega-village-unud/backend-api-edb:latest

build-staging:
	docker build . --file docker/service/Dockerfile -t ghcr.io/belega-village-unud/backend-api-edb:staging-test

sast-container:
	bash ./shell/sast-container.sh ghcr.io/belega-village-unud/backend-api-edb:staging-test ${GITHUB_USERNAME} ${GITHUB_EMAIL}

sast-code:
	bash ./shell/sast-code.sh

deploy:
	bash ./shell/deploy.sh EDP-181-java-script-sast-with-eslint

up:
	docker stack deploy -c ./docker/service/docker-compose.yml backend
	docker stack deploy -c ./docker/ssl/docker-compose.yml backend

prometheus:
	docker compose -p belega --file docker/prometheus/docker-compose.yml --env-file .env up -d

restart:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env restart $(SERVICE)

restart_nginx:
	docker compose -p belega --file docker/ssl/docker-compose.yml --env-file .env restart nginx

down:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env down 

rm:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env rm 

