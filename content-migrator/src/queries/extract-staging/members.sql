COPY (
  SELECT DISTINCT
    'member' as type,
    slugify(html_decode(name)) as slug,

    COALESCE(jobDescription, '') as title,
    display_order as displayOrder,

    COALESCE(office, '') as office,
    COALESCE(phone, '') as phone,
    COALESCE(fax, '') as fax,
    COALESCE(email, '') as email,
    
    COALESCE(education, '') as education,
    COALESCE(background, '') as background,
    COALESCE(interests, '') as interests,

    startDate as dateStart,
    endDate as dateEnd
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
      JOIN tblCenterMembers USING (peopleId)
  ORDER BY dateEnd DESC NULLS FIRST, display_order
) TO 'old-website/staging/members.json' (FORMAT json, ARRAY true);
