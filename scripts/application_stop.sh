#!/bin/bash

REPOSITORY=/home/ubuntu/merge-api

cd $REPOSITORY

sudo pm2 stop ecosystem.config.js
