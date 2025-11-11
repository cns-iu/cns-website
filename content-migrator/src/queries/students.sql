COPY (
  SELECT DISTINCT
    slugify(html_decode(name)) as slug,

    trim(topic) as topic,
    CASE
      WHEN degreeType = 'p' THEN 'Ph.D.'
      WHEN degreeType = 'm' THEN 'Masters'
      ELSE NULL
    END AS degree,
    COALESCE(dept, '') as department,

    startDate as dateStart,
    endDate as dateEnd
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
      JOIN tblMAPhDs USING (peopleId)
  ORDER BY dateEnd DESC NULLS FIRST
) TO 'data/indexes/students.json' (FORMAT json, ARRAY true);
