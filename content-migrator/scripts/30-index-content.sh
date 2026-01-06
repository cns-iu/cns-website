#!/bin/bash

for f in src/index/*.js; do
  echo $(basename $f)
  node $f
done
