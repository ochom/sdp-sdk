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
