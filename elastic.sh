#!/bin/bash

docker run -d \
  --name elastic \
  -e discovery.type=single-node \
  -v "$(pwd)"/_data/elasticsearch:/usr/share/elasticsearch/data \
  -p 9200:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:7.15.1
