COPY (
  SELECT DISTINCT
    slugify(html_decode('tut-' || tutorialId)) as slug,
    'tutorial' as "type",
    [fileNameURL] as links, -- https://cns.iu.edu/docs/presentations/
    tutorialTitle as title,
    COALESCE(additionalInfo, '') as description,
    COALESCE(replace(replace(list_aggregate([trim(n) FOR n IN [addrLine1, addrLine2, city, StateProvince, Country, zipCode] IF len(trim(n)) > 0 ], 'string_agg', ', '), 'United States', 'USA'), ', IN', ', Indiana'), '') as location,
    COALESCE([ slugify(html_decode(name)) FOR name IN instructors ], []) as instructors,
    COALESCE(fromDate, try(date(left(fileNameURL, 4) || '-01-01'))) as dateStart,
    COALESCE(toDate, try(date(left(fileNameURL, 4) || '-01-01'))) as dateEnd,
    'ev-' || eventId as "event"
  FROM 
    tblTutorials
    LEFT JOIN brdgTutorialsEvents USING (tutorialId)
    LEFT JOIN brdgVenue USING (eventId)
    LEFT JOIN tblLocations USING (locationId)
    LEFT JOIN (
      SELECT tutorialEventId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY peopleId) as instructors
      FROM brdgInstructors JOIN tblPeople USING (peopleId)
      GROUP BY tutorialEventId
    ) USING (tutorialEventId)
    LEFT JOIN brdgMediaTutorials USING (tutorialId)
    LEFT JOIN tblMedia USING (mediumId)
  WHERE fileNameURL IS NOT NULL
  ORDER BY dateEnd DESC
) TO 'old-website/staging/tutorials.json' (FORMAT json, ARRAY true);
