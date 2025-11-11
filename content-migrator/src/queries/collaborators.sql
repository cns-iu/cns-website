COPY (
  SELECT DISTINCT
    slugify(html_decode(name)) as slug,

    trim(shortTitle) as project,

    brdgTeamCollabs.startDate as dateStart,
    brdgTeamCollabs.endDate as dateEnd
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
      JOIN brdgTeamCollabs USING (peopleId)
      JOIN tblResearch USING ("researchId")
  WHERE peopleId NOT IN (
    SELECT peopleId FROM tblCenterMembers
    UNION ALL
    SELECT peopleId FROM tblMAPhDs
  )
  ORDER BY dateEnd DESC NULLS FIRST
) TO 'data/indexes/collaborators.json' (FORMAT json, ARRAY true);
