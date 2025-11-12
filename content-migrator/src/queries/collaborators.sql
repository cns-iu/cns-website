COPY (
  SELECT DISTINCT
    'collaborator' as type,
    slugify(html_decode(name)) as slug,

    trim(shortTitle) as project,

    -- COALESCE, because A. Barabasi didn't have a start date, 
    COALESCE(brdgTeamCollabs.startDate, '2006-01-01') as dateStart,
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
