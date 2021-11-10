#!/bin/bash

docker run -d \
  --name kibana \
  -e elasticsearch.hosts=http://localhost:9200 \
  -p 5601:5601 \
  docker.elastic.co/kibana/kibana:7.15.1
