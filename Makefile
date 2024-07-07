VERSION=0.4.1
.PHONY: build

build:
	gcloud config set project visprex && gcloud builds submit --tag eu.gcr.io/visprex/visprex:$(VERSION)