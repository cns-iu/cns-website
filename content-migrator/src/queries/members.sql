COPY (
  SELECT DISTINCT
    slugify(html_decode(name)) as slug,

    display_order as displayOrder,
    office,
    phone,
    fax,
    email,
    jobDescription,
    education,
    background,
    interests,

    startDate as dateStart,
    endDate as dateEnd
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
      JOIN tblCenterMembers USING (peopleId)
  ORDER BY dateEnd DESC NULLS FIRST, display_order
) TO 'data/indexes/members.json' (FORMAT json, ARRAY true);
