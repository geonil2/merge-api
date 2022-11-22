#!/bin/bash

REPOSITORY=/home/ubuntu/merge-frontend
PROJECT_NAME=merge-frontend

cd $REPOSITORY

sudo cp ../env/merge-frontend/.env.production .env.production
sudo /usr/bin/pm2 startOrReload ecosystem.config.js --env production
