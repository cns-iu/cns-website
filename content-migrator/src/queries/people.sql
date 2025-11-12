COPY (
  SELECT DISTINCT
    slugify(html_decode(name)) as slug,
    html_decode(name) as name,
    html_decode(lname) as lastName,
    lower(html_decode(lname)[1]) as lastInitial,
    'https://cns-iu.github.io/cns-website/content-migrator/data/images/people/' || COALESCE(fileName, 'noimage.png') as image
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
  WHERE peopleId IN (
    SELECT peopleId FROM tblCenterMembers
    UNION ALL
    SELECT peopleId FROM tblMAPhDs
    UNION ALL
    SELECT peopleId FROM brdgTeamCollabs
  )
  ORDER BY slug
) TO 'data/indexes/people.json' (FORMAT json, ARRAY true);
