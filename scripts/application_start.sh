#!/bin/bash

REPOSITORY=/home/ubuntu/merge-api

cd $REPOSITORY

sudo cp ../env/merge-api/.env .env
npm run start

