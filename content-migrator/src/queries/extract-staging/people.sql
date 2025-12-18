COPY (
  SELECT DISTINCT
    slugify(html_decode(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' '))) as slug,
    COALESCE(html_decode(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ')), '') as name,
    -- COALESCE(html_decode(list_aggregate([trim(n) FOR n IN [fname, mname] IF len(n) > 0 ], 'string_agg', ' ')), '') as given,
    COALESCE(html_decode(trim(lname)), '') as lastName, -- as family
    COALESCE(fileName, '') as image
  FROM tblPeople LEFT OUTER JOIN vwWebPeopleBase USING (peopleId)
  WHERE slugify(html_decode(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' '))) != 'null'
  ORDER BY slug, image
) TO 'old-website/staging/people.json' (FORMAT json, ARRAY true);
