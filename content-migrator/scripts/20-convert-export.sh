#!/bin/bash

mkdir -p old-website/staging

for f in src/queries/extract-staging/*.sql; do
  echo $(basename $f)
  ./src/duckdb.js -d old-website/cns-website.duckdb -f $f
done

rm -rf ../content/person/*

for f in src/convert/*.js; do
  echo $(basename $f)
  collection=$(basename -s .js $f)
  rm -rf ../content/$collection
  mkdir -p ../content/$collection
  node $f
done
