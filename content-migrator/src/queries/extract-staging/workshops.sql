COPY (
  SELECT DISTINCT
    slugify(html_decode('ws-' || id)) as slug,
    'workshop' as "type",
    [trim(html_decode(trim(link)))] as links,
    trim(html_decode(trim(title))) as title,
    '' as description,
    replace(replace(list_aggregate([trim(n) FOR n IN [city, state, country] IF len(trim(n)) > 0 ], 'string_agg', ', '), 'United States', 'USA'), ', IN', ', Indiana') as location,
    COALESCE(start_date, try(date(left(title, 4) || '-01-01'))) as dateStart,
    COALESCE(end_date, try(date(left(title, 4) || '-01-01'))) as dateEnd,
    [] as tags,
  FROM tblWorkshops
  ORDER BY dateEnd DESC
) TO 'old-website/staging/workshops.json' (FORMAT json, ARRAY true);
