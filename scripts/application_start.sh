#!/bin/bash

REPOSITORY=/home/ubuntu/merge-api

sudo chmod -R 777 REPOSITORY

cd $REPOSITORY

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cp ../env/merge-api/.env .env
pm2 startOrReload ecosystem.config.js --env production
