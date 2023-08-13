# build_and_push:
# 	docker build --platform linux/amd64 -t eu.gcr.io/visprex/visprex:0.1 . && docker push eu.gcr.io/visprex/visprex:0.1
build:
	gcloud config set project visprex && gcloud builds submit --tag eu.gcr.io/visprex/visprex:0.1