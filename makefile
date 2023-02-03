# Makefile
SHELL:=/bin/bash

dev:
	source ./env.sh && yarn start

test:
	yarn run test

test-live:
	yarn run  test:live

lint:
	yarn run  lint

run:
	@echo "Running the app"
	@echo "----------------"
	@echo "Stopping any running containers" # don't fail if there are none
	@docker stop  sdk || true && docker rm sdk || true
	@echo "Building the container"
	@docker run -d --name sdk -p "8088:5000" \
	-e PORT=5000 \
	-e DEPLOYMENT_MODE=test \
	-e ACCESS_TOKEN=$(ACCESS_TOKEN) \
	-e NODE_TLS_REJECT_UNAUTHORIZED=0 \
	-e NODE_EXTRA_CA_CERTS=/ssl-selfsigned.crt \
	-v /home/ochom/chiriku/sdk/ssl-selfsigned.crt:/ssl-selfsigned.crt \
	ochom/sdp-sdk:latest