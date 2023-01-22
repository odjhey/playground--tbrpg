#!/bin/sh

docker run --rm -i --network host grafana/k6 run --vus 1000 --duration 12s - <script.js

