build:
	docker build . --file docker/Dockerfile -t belega-village-unud/backend-api-edb:v1 -t belega-village-unud/backend-api-edb:latest

up:
	docker compose -p backend-ecommerce-desa-belega --file docker/docker-compose.yml --env-file .env up -d

down:
	docker compose -p backend-ecommerce-desa-belega --file docker/docker-compose.yml --env-file .env down 

rm:
	docker compose -p backend-ecommerce-desa-belega --file docker/docker-compose.yml --env-file .env rm 

ps:
	docker compose -p backend-ecommerce-desa-belega --file docker/docker-compose.yml --env-file .env ps 

ipapp:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' app-ecommerce-desa-belega

ipdb:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' database-ecommerce-desa-belega

ipsqlpad:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sqlpad-ecommerce-desa-belega
