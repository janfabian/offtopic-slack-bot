#!/bin/bash

# Prepare Backend API package
docker run --rm $(docker/build.sh backend) /bin/sh -c 'tar -czf - .' > package/cloud/package.backend.tar.gz
rm -rf package/cloud/package.backend
tar -xzf package/cloud/package.backend.tar.gz -C package/cloud/ --overwrite --one-top-level

# Prepare single Lambdas
docker run --rm $(docker/build.sh lambda) /bin/sh -c 'tar -czf - .' > package/cloud/package.lambda.tar.gz
rm -rf package/cloud/package.lambda
tar -xzf package/cloud/package.lambda.tar.gz -C package/cloud/ --overwrite --one-top-level

# Update stack
pulumi -C package/cloud/ up -f --yes

# Clean
rm -rf package/cloud/package.backend package/cloud/package.backend.tar.gz
rm -rf package/cloud/package.lambda package/cloud/package.lambda.tar.gz


