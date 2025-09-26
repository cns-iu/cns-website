#!/bin/bash

mkdir -p data/static-pages-md
rm -f data/static-pages-md/*

for html in data/static-pages/*; do
  md=data/static-pages-md/$(basename $html)
  node src/html-to-md.js $html $md
done
