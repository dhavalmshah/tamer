#!/bin/bash

# Update package lists
sudo apt-get update

# Install git
sudo apt-get install git -y

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
sudo apt-get install nginx -y

# Install certbot
sudo apt-get install certbot python3-certbot-nginx

npm install -g localtunnel

git clone https://github.com/dhavalmshah/tamer

cd tamer

npm install

lt --port 3000 && npm start
