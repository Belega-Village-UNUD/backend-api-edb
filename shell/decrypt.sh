#!/bin/bash

set -e 

senv_path="./node_modules/.bin/senv"

if [ -f "$senv_path" ] && [ -x "$senv_path" ]
then
    if npx senv decrypt .env.dev.enc -o .env.dev
    then
        echo "Decryption successful. The decrypted file is .env.dev."
    else
        echo "Decryption failed. Please check the input file and ensure senv is working correctly."
        exit  1
    fi
else
    echo "senv could not be found locally. Please install senv using npm or yarn."
    echo "You can find more information at https://github.com/jaydenwindle/senv"
    exit  1
fi
