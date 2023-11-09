build:
	docker build . --env-file .env -t Belega-Village-UNUD/backend-api-edb:latest

up:
	docker compose --env-file .env up -d

down:
	docker compose down 

ps:
	docker compose ps 

ipapp:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' app-ecommerce-desa-belega

ipdb:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' database-ecommerce-desa-belega

ipsqlpad:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sqlpad-ecommerce-desa-belega
