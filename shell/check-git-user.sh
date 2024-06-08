#!/bin/bash

if [[ -z "$(git config --get user.name)" ]]; then
    echo "Git user name is not configured."

		git_user_name = $1
		git_email = $2
    
    # Set git user name
    git config user.name "$git_user_name"
    git config user.email "$git_email"
    
    # Check if setting git user name was successful
    if [ $? -eq 0 ]; then
        echo "Git user name set to '$git_user_name'."
        echo "Git email set to '$git_email'."
    else
        echo "Error: Failed to set git user name."
        exit 1
    fi
else
    echo "Git user name is already configured."
fi
