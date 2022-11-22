#!/bin/bash

REPOSITORY=/home/ubuntu/merge-api
PROJECT_NAME=merge-api

cd $REPOSITORY

sudo cp ../env/merge-api/.env .env
sudo /usr/bin/pm2 startOrReload ecosystem.config.js --env production
