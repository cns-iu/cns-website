#!/bin/bash

if [ -e env.sh ]; then
  source env.sh
fi

rm -rf data/cns-website* data/tables
mkdir -p data/tables

bash -c "node src/export-pg-to-duckdb.js data/cns-website.duckdb 2>&1" | tee data/cns-website-export.log.txt
echo ".schema" | duckdb data/cns-website.duckdb > data/cns-website.schema.sql
