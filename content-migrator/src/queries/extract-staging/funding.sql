COPY (
  SELECT DISTINCT
    slugify(html_decode('fun-' || grantId)) as slug,
    'research' as "type",
    grantName as "name",
    grantTitle as title,
    organizationName as "funder",
    COALESCE([ slugify(html_decode(name)) FOR name IN investigators ], []) as investigators,
    amount,
    try(CAST(REPLACE(receivedAmount, ',', '') as INTEGER)) as receivedAmount,
    startDate as "dateStart",
    endDate as "dateEnd",
    [] as tags,
  FROM 
    tblGrants
      LEFT JOIN tblOrganizations USING (organizationId)
      LEFT JOIN (
        SELECT grantId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY "RANK") as investigators
        FROM brdgCoPIs JOIN tblPeople USING (peopleId)
        GROUP BY grantId
      ) USING (grantId)
  ORDER BY startDate DESC
) TO 'old-website/staging/funding.json' (FORMAT json, ARRAY true);
