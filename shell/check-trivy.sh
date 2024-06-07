#!/bin/bash

# Check if trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "trivy is not installed. Installing trivy..."

		# Check if the system is based on Debian
		if [ -f /etc/debian_version ]; then
			echo "Detected Debian-based OS."
			
			# Install trivy package
			echo "Installing trivy..."
			sudo apt-get install wget apt-transport-https gnupg
			wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
			echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
			sudo apt-get update
			sudo apt-get install trivy

			# Check if installation was successful
			if [ $? -eq 0 ]; then
					echo "trivy installed successfully."
			else
					echo "Error: Failed to install trivy."
			fi
		else
			echo "This script is intended for Debian-based operating systems."
		fi

		# Check if the system is Arch
		if [ -f /etc/os-release ]; then
				source /etc/os-release
				if [[ "$ID" == "arch" ]]; then
						echo "Detected Arch."
						
						# Install trivy package
						echo "Installing trivy..."
						yay -Sy trivy-bin
						
						# Check if installation was successful
						if [ $? -eq 0 ]; then
								echo "trivy installed successfully."
						else
								echo "Error: Failed to install trivy."
						fi
						exit 0
				fi
		fi

		# Check if the system is Ubuntu
		if [ -f /etc/os-release ]; then
				source /etc/os-release
				if [[ "$ID" == "ubuntu" ]]; then
						echo "Detected Ubuntu."
						
						# Install trivy package
						echo "Installing trivy..."
						sudo apt-get install wget apt-transport-https gnupg
						wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
						echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
						sudo apt-get update
						sudo apt-get install trivy
						
						# Check if installation was successful
						if [ $? -eq 0 ]; then
								echo "trivy installed successfully."
						else
								echo "Error: Failed to install trivy."
						fi
						exit 0
				fi
		fi

		exit 1
fi


