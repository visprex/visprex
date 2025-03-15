VERSION=0.7.3
.PHONY: build

build:
	gcloud config set project visprex && gcloud builds submit --tag eu.gcr.io/visprex/visprex:$(VERSION)