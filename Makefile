build:
	docker build . --file docker/Dockerfile -t ghcr.io/belega-village-unud/backend-api-edb:v1 -t ghcr.io/belega-village-unud/backend-api-edb:latest

up:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env up -d
	docker compose -p belega --file docker/prometheus/docker-compose.yml --env-file .env up -d
	docker compose -p belega --file docker/ssl/docker-compose.yml --env-file .env up nginx -d

restart:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env restart $(SERVICE)

restart_nginx:
	docker compose -p belega --file docker/ssl/docker-compose.yml --env-file .env restart nginx

down:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env down 
	docker compose -p belega --file docker/prometheus/docker-compose.yml --env-file .env down 
	docker compose -p belega --file docker/ssl/docker-compose.yml --env-file .env down nginx 


rm:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env rm 

ps:
	docker compose -p belega --file docker/service/docker-compose.yml --env-file .env ps 

ipapp:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' app-ecommerce-desa-belega

ipdb:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' database-ecommerce-desa-belega

ipsqlpad:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sqlpad-ecommerce-desa-belega

cert:
	docker compose -p belega --file docker/ssl/docker-compose.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d testing.instance.asia-southeast2-a.c.belega-village.unud.com
