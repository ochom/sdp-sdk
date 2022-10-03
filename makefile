# Makefile

SHELL := /bin/bash

dev:
	source env.sh && npm start

test:
	source env.sh && yarn test

test-live:
	source env.sh && yarn test:live
