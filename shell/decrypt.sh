#!/bin/bash

if ! command -v senv &> /dev/null
then
    echo "senv could not be found, please install senv https://github.com/jaydenwindle/sen://github.com/jaydenwindle/senv"
    exit
else 
    senv decrypt .env.dev.enc -o .env.dev
fi

