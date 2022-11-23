#!/bin/bash

REPOSITORY=/home/ubuntu/merge-api

if [ -d $REPOSITORY ]; then
  sudo rm -rf $REPOSITORY
fi
