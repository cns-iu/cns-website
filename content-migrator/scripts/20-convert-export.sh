#!/bin/bash

mkdir -p old-website/staging

for f in src/queries/extract-staging/*.sql; do
  echo $(basename $f)
  ./src/duckdb.js -d old-website/cns-website.duckdb -f $f
done

rm -rf ../content/person/*
node ./src/convert-data.js
