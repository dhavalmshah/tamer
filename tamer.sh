#!/bin/bash

# Update package lists
apt-get update

# Install git
apt-get install git -y

# Install docker using convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install nvm using install script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Source nvm.sh file
source ~/.nvm/nvm.sh

# Install nodejs using nvm
nvm install node 18

# Install nginx
apt-get install nginx -y

# Install certbot
sudo apt-get install certbot python3-certbot-nginx
