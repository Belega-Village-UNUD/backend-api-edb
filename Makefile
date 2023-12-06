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

gen_key:
	# generate ssl key 
	openssl dhparam -out ./nginx/dhparam/dhparam-2048.pem 2048

ssl:
	docker compose -p belega --file docker/ssl/docker-compose.yml --env-file .env up nginx certbot -d

add-docker:
	sudo apt-get update
	sudo apt-get -y  install ca-certificates curl gnupg
	sudo install -m 0755 -d /etc/apt/keyrings
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
	sudo chmod a+r /etc/apt/keyrings/docker.gpg
	echo \
		"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
		$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
		sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
	sudo apt-get update
	sudo apt-get -y  install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
	sudo groupadd docker
	sudo usermod -aG docker $USER
	newgrp docker
	sudo apt install make


