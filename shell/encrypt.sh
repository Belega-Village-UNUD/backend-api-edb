#!/bin/bash

if ! command -v senv &> /dev/null
then
    echo "senv could not be found, please install senv https://github.com/jaydenwindle/sen://github.com/jaydenwindle/senv"
    exit
else 
    senv encrypt .env.dev -o .env.dev.enc
fi

