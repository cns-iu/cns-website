COPY (
  SELECT DISTINCT
    'author' as type,
    slugify(html_decode(name)) as slug,
    min(publicationDate) as dateStart,
    max(publicationDate) as dateEnd
  FROM (
    SELECT peopleId, list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') as name
      FROM tblPeople
    )
    JOIN brdgAuthorsEditors USING (peopleId)
    JOIN tblPublications USING (publicationId)
  WHERE brdgAuthorsEditors."type" = 'e'
  GROUP BY name
  ORDER BY dateEnd DESC NULLS FIRST
) TO 'old-website/staging/editors.json' (FORMAT json, ARRAY true);
