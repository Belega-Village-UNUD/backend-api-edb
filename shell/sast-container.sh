#!/bin/bash

./shell/check-trivy.sh

# Check if image name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <image_name>"
    exit 1
fi

# Check if a image name is provided
if [ -z "$1" ]; then
    echo "Error: Please insert an argument for your image name."
    echo "Usage: $0 <image_name>"
    exit 1
fi

image_name="$1"

# Run trivy to scan the image image
echo "Running trivy scan on $image_name..."
trivy image -f json -o ./reports/sast-container-backend-report.json $image_name 

# Check if trivy scan was successful
if [ $? -eq 0 ]; then
    echo "trivy scan completed successfully."
		# check git user already configured or not
		./shell/check-git-user.sh $git_username $git_email
		echo "Committing the sast container image '$image_name' report to the repository..."

		# commit here
		# git add ./reports/sast-container-report.json
		# git commit -m ""
		if [ $? -ne 0 ]; then
			echo "Error: Failed to commit the sast container image report: "
			exit 1
		fi
		# echo "SAST container image report committed successfully."
    exit 0
else
    echo "Error: Failed to run trivy scan on $image_name."
    exit 1
fi

