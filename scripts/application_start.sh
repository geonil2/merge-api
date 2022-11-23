#!/bin/bash

REPOSITORY=/home/ubuntu/merge-api

sudo chmod -R 777 REPOSITORY

cd $REPOSITORY

sudo cp ../env/merge-api/.env .env
npm run start

