COPY (
  SELECT DISTINCT
    slugify(html_decode('pres-' || presentationId)) as slug,
    'presentation' as "type",
    [fileNameURL] as links, -- https://cns.iu.edu/docs/presentations/
    title,
    COALESCE(additionalInfo, '') as description,
    COALESCE(replace(replace(list_aggregate([trim(n) FOR n IN [addrLine1, addrLine2, city, StateProvince, Country, zipCode] IF len(trim(n)) > 0 ], 'string_agg', ', '), 'United States', 'USA'), ', IN', ', Indiana'), '') as location,
    COALESCE([ slugify(html_decode(name)) FOR name IN presenters ], []) as presenters,
    COALESCE("date", try(date(left(fileNameURL, 4) || '-01-01'))) as dateStart,
    COALESCE("date", try(date(left(fileNameURL, 4) || '-01-01'))) as dateEnd,
    'ev-' || eventId as "event"
  FROM
    tblPresentations
    LEFT JOIN brdgPresentationsEvents USING (presentationId)
    LEFT JOIN brdgVenue USING (eventId)
    LEFT JOIN tblLocations USING (locationId)
    LEFT JOIN (
      SELECT presentationEventId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY peopleId) as presenters
      FROM brdgPresenters JOIN tblPeople USING (peopleId)
      GROUP BY presentationEventId
    ) USING (presentationEventId)
    LEFT JOIN brdgMediaPresentations USING (presentationId)
    LEFT JOIN tblMedia USING (mediumId)
  WHERE fileNameURL IS NOT NULL
  ORDER BY dateEnd DESC
) TO 'old-website/staging/presentations.json' (FORMAT json, ARRAY true);
