.PHONY: build

build:
	gcloud config set project visprex && gcloud builds submit --tag eu.gcr.io/visprex/visprex:0.3.2