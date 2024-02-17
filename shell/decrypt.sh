#!/bin/bash

if ! npx senv --version &> /dev/null
then
    echo "senv could not be found. Please install senv using npm or yarn."
    echo "You can find more information at https://github.com/jaydenwindle/senv"
    exit  1
else  
    if npx senv decrypt .env.dev.enc -o .env.dev
    then
        echo "Decryption successful. The decrypted file is .env.dev."
    else
        echo "Decryption failed. Please check the input file and ensure senv is working correctly."
        exit  1
    fi
fi
