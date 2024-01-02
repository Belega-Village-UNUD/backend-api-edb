#!/usr/bin/bash
git fetch;
git pull origin EDP-67-sast-on-container;
docker pull ghcr.io/belega-village-unud/backend-api-edb:edp-67-sast-on-container;
make up;
docker ps;

