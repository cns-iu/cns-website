COPY (
  SELECT DISTINCT
    slugify(html_decode(name)) as slug,
    regexp_replace(trim(html_decode(name)), '\ +', ' ') as name,
    html_decode(trim(lname)) as lastName,
    COALESCE(fileName, 'noimage.png') as image
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
) TO 'old-website/staging/people.json' (FORMAT json, ARRAY true);
