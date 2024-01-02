#!/usr/bin/bash

git pull origin EDP-67-sast-on-container;
make build up;
docker ps;

