#!/bin/bash

function install_nodejs() { 
		# Install Node Version Manager package
		echo "Installing Node JS with Node Version Manager..."
		wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
		export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
		source ${XDG_CONFIG_HOME}/.bashrc

		# Check if installation was successful
		if [ $? -ne 0 ]; then
				echo "Node Version Manager installed successfully."
		else
				echo "Error: Failed to install Node Version Manager."
				exit 1 
		fi

		# Install Node.js 20.9.0
		nvm install 20.9.0

		if [ $? -ne 0 ]; then
				echo "Node Version Manager installed successfully."
		else
				echo "Error: Failed to install Node Version Manager."
				exit 1 
		fi
}


# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed."
	
	# Check if the system is based on Debian
	if [ -f /etc/debian_version ]; then
			echo "Detected Debian-based OS."
			install_nodejs
			sudo apt-get update
			sudo apt-get install jq -y
	fi

	# Check if the system is Arch
	if [ -f /etc/os-release ]; then
			source /etc/os-release
			if [[ "$ID" == "arch" ]]; then
				echo "Detected Arch."
				install_nodejs
				sudo pacman -Sy jq
			fi
	fi

	# Check if the system is Ubuntu
	if [ -f /etc/os-release ]; then
			source /etc/os-release
			if [[ "$ID" == "ubuntu" ]]; then
				echo "Detected Ubuntu."
				install_nodejs
				sudo apt-get update
				sudo apt-get install jq -y
			fi
	fi

	exit 1
fi

# Check Node.js version
node_version=$(node -v)
echo "Node.js version: $node_version"

# Check if Node.js version is at least v20.9.0
if [[ "$node_version" < "v20.9.0" ]]; then
		echo "Node.js version is lower than v20.9.0."
		exit 1
else
		echo "Node.js version is v20.9.0 or higher."
fi

# install eslint
if ! command -v eslint &> /dev/null; then
	echo "eslint is not installed. Installing eslint..."
	npm install -g eslint
	if [ $? -eq 0 ]; then
			echo "eslint installed successfully."
	else
			echo "Error: Failed to install eslint."
			exit 1
	fi
fi
