COPY (
  SELECT DISTINCT
    slugify(html_decode('ev-' || eventId)) as slug,
    CASE
      WHEN t."type" = '10000' THEN 'conference'
      WHEN t."type" = '01000' THEN 'workshop'
      WHEN t."type" = '00100' THEN 'meeting'
      WHEN t."type" = '00010' THEN 'visit'
      WHEN t."type" = '00001' THEN 'other'
      ELSE 'other'
    END as "type",
    COALESCE(links, []) as links,
    trim(html_decode(trim(title))) as title,
    trim(html_decode(trim(description))) as description,
    COALESCE(replace(replace(list_aggregate([trim(n) FOR n IN [addrLine1, addrLine2, city, StateProvince, Country, zipCode] IF len(trim(n)) > 0 ], 'string_agg', ', '), 'United States', 'USA'), ', IN', ', Indiana'), '') as location,

    COALESCE([ slugify(html_decode(name)) FOR name IN organizers ], []) as organizers,
    COALESCE([ slugify(html_decode(name)) FOR name IN attendees ], []) as attendees,
    COALESCE(publications, []) as publications,
    COALESCE(presentations, []) as presentations,
    COALESCE(tutorials, []) as tutorials,
    COALESCE(startDate, try(date(left(title, 4) || '-01-01'))) as dateStart,
    COALESCE(endDate, try(date(left(title, 4) || '-01-01'))) as dateEnd,
    [] as tags,
  FROM tblCallsEvents AS t
    -- Location
    LEFT JOIN brdgVenue USING (eventId)
    LEFT JOIN tblLocations USING (locationId)
    -- Links
    LEFT JOIN (
      SELECT eventId, list(fileNameURL ORDER BY "rank") as links
      FROM tblMedia JOIN brdgMediaCallsEvents USING (mediumId)
      GROUP BY eventId
    ) USING (eventId)
    -- Organizers
    LEFT JOIN (
      SELECT eventId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY peopleId) as organizers
      FROM brdgOrganizersAttendees JOIN tblPeople USING (peopleId)
      WHERE "type" = 'o'
      GROUP BY eventId
    ) USING (eventId)
    -- Attendees
    LEFT JOIN (
      SELECT eventId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY peopleId) as attendees
      FROM brdgOrganizersAttendees JOIN tblPeople USING (peopleId)
      WHERE "type" = 'a' OR "type" != 'o'
      GROUP BY eventId
    ) USING (eventId)

    -- Publications brdgPublicationsEvents
    LEFT JOIN (
      SELECT eventId, list('pub-' || publicationId ORDER BY publicationId) as publications
      FROM brdgPublicationsEvents
      GROUP BY eventId
    ) USING (eventId)
    -- Tutorials brdgTutorialsEvents
    LEFT JOIN (
      SELECT eventId, list('tut-' || tutorialId ORDER BY tutorialId) as tutorials
      FROM brdgTutorialsEvents
      GROUP BY eventId
    ) USING (eventId)
    -- Presentations brdgPresentationsEvents
    LEFT JOIN (
      SELECT eventId, list('pres-' || presentationId ORDER BY presentationId) as presentations
      FROM brdgPresentationsEvents
      GROUP BY eventId
    ) USING (eventId)

  ORDER BY dateEnd DESC
) TO 'old-website/staging/events.json' (FORMAT json, ARRAY true);
