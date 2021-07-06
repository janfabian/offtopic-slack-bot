#!/bin/bash

default=backend
image=${1:-backend}

if [ $image = 'backend' ]; then
  imageHash=$(docker build -t offtopic-slack-bot-backend -f ./docker/backend.Dockerfile -q ./)
  docker tag offtopic-slack-bot-backend offtopic-slack-bot-backend:latest
  echo $imageHash
  exit 0
fi

if [ $image = 'lambda' ]; then
  imageHash=$(docker build -t offtopic-slack-bot-lambda -f ./docker/lambda.Dockerfile -q ./)
  docker tag offtopic-slack-bot-lambda offtopic-slack-bot-lambda:latest
  echo $imageHash
  exit 0
fi
