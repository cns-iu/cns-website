COPY (
  SELECT DISTINCT
    slugify(html_decode(name)) as slug,
    html_decode(name) as name,
    html_decode(lname) as lastName,
    display_order as displayOrder,
    'https://cns-iu.github.io/cns-website/content-migrator/data/images/people/' || fileName as image,
    office,
    phone,
    fax,
    email,

    jobDescription,
    education,
    background,
    interests,

    startDate,
    endDate
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
      JOIN tblCenterMembers USING (peopleId)
  ORDER BY endDate DESC NULLS FIRST, display_order
) TO 'data/indexes/people.json' (FORMAT json, ARRAY true);
