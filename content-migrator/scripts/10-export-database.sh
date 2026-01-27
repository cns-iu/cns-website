#!/bin/bash

if [ -e env.sh ]; then
  source env.sh
fi

rm -rf old-website/cns-website* old-website/tables old-website/resources/*.sql
mkdir -p old-website/tables old-website/resources

bash -c "node src/export-pg-to-duckdb.js old-website/cns-website.duckdb 2>&1" | tee old-website/cns-website-export.log.txt

# Extract schema info
echo ".schema" | duckdb old-website/cns-website.duckdb > old-website/resources/cns-website.schema.sql
pg_dump --schema-only -x -t '*.vw*' > old-website/resources/cns-website.pg.views.sql

grep -i peopleid old-website/resources/cns-website.schema.sql | sort > old-website/resources/people-tables.schema.sql
grep -i publicationid old-website/resources/cns-website.schema.sql > old-website/resources/publication-tables.schema.sql

grep -i event old-website/resources/cns-website.schema.sql > old-website/resources/event-tables.schema.sql.1
grep -i workshop old-website/resources/cns-website.schema.sql >> old-website/resources/event-tables.schema.sql.1
grep -i presentation old-website/resources/cns-website.schema.sql >> old-website/resources/event-tables.schema.sql.1
sort old-website/resources/event-tables.schema.sql.1 | uniq > old-website/resources/event-tables.schema.sql
rm old-website/resources/event-tables.schema.sql.1
