#!/bin/bash

default=backend
image=${1:-backend}

if [ $image = 'backend' ]; then
  imageHash=$(docker build -t offtopic-slack-bot-backend -f ./docker/backend.Dockerfile -q ./)
  docker tag offtopic-slack-bot-backend offtopic-slack-bot-backend:latest
  echo $imageHash
fi
