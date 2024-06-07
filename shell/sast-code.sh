#!/bin/bash

./shell/check-eslint.sh

parse_json() { 
	# check jq 
	if ! command -v jq &> /dev/null; then
		echo "jq is not installed. Please install jq to continue."
		exit 1
	fi

	cat $1 | jq > ./reports/sast-code-report.json
	if [ $? -ne 0 ]; then
		echo "Error: Failed to parse the sast code report."
		exit 1
	fi

	rm ./reports/sast-code-report.json.temp

	if [ $? -ne 0 ]; then
		echo "Error: Failed to remove the temporary sast code report."
		exit 1
	fi
}

# Run eslint on repository
echo "Running eslint seurity scan on repository..."
eslint src/
if [ $? -ne 0 ]; then
	echo "Error: Failed to run eslint scan on repository."
	exit 1
fi

parse_json ./reports/sast-code-report.json.temp


# Check if trivy scan was successful
if [ $? -eq 0 ]; then
    echo "Eslint scan completed successfully."
		# check git user already configured or not
		./shell/check-git-user.sh $git_username $git_email
		echo "Committing the sast code report to the repository..."

		# commit here
		# git add ./reports/sast-container-report.json
		# git commit -m ""
		if [ $? -ne 0 ]; then
			echo "Error: Failed to commit the sast code report: "
			exit 1
		fi
		# echo "SAST container image report committed successfully."
    exit 0
else
    echo "Error: Failed to run trivy scan on $image_name."
    exit 1
fi

