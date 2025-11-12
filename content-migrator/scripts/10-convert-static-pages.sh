#!/bin/bash

mkdir -p old-website/static-pages-md
rm -f old-website/static-pages-md/*

for html in old-website/static-pages/*; do
  md=old-website/static-pages-md/$(basename $html)
  node src/html-to-md.js $html $md
done
