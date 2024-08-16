#!/bin/bash

bash ./shell/check-eslint.sh

date=$(date +"%Y-%m-%d")
temporary_output_file="results_code_${date}.json.temp"
formatted_output_file=${temporary_output_file%.*}

check_directory() {
  if [ reports -d ]; then
     echo "No Directory for Reports output"
     exit 1
  fi
  if [ reports/$temporary_output_file -f ]; then
     echo "No file $temporary_output_file"
     exit 1
  fi
}

parse_json() {
  output_dir="./reports"
  input_file=$1
  output_file=$2

  if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install jq to continue."
    exit 1
  fi

  cat $output_dir/$input_file | jq '[.[] | select(.messages | length > 0)]' > $output_dir/$output_file

  # cat $input_file | jq > ./reports/$output_file
  if [ $? -ne 0 ]; then
    echo "Error: Failed to parse the sast code report."
    exit 1
  fi

  rm $output_dir/$input_file

  if [ $? -ne 0 ]; then
    echo "Error: Failed to remove the temporary sast code report."
    exit 1
  fi
}

echo "Running sast scan on code repository..."
set -x
npx eslint -f json ./src -o ./reports/$temporary_output_file
set +x

if [ $? -ne 0 ]; then
  echo "Error: Failed to run eslint scan on repository. $?"
  exit 1
fi

check_directory

if [ $? -ne 0 ]; then
  echo "There are no reports directory"
  exit 1
fi

parse_json $temporary_output_file $formatted_output_file

if [ $? -eq 0 ]; then
  echo "Eslint seucrity scan completed successfully."
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
    # echo "SAST code repository report committed successfully."
    exit 0
else
    echo "Error: Failed to run eslint scan on repository."
    exit 1
fi

