COPY (
  SELECT
    slugify(html_decode('pub-' || publicationId)) as slug,
    -- nanoid(tblPublications.publicationId) as slug,
    COALESCE([ slugify(html_decode(name)) FOR name IN authors ], []) as authors,
    COALESCE([ slugify(html_decode(name)) FOR name IN editors ], []) as editors,
    CASE
      WHEN "type" = 'ej' THEN 'periodical'
      WHEN "type" = 'ja' THEN 'article-journal'
      WHEN "type" = 'bo' THEN 'book'
      WHEN "type" = 'bc' THEN 'chapter'
      WHEN "type" = 'eb' THEN 'book'
      WHEN "type" = 'cp' THEN 'paper-conference'
      WHEN "type" = 'pa' THEN 'patent'
      WHEN "type" = 'av' THEN 'broadcast'
      WHEN "type" = 'tr' THEN 'report'
      WHEN "type" = 'ur' THEN 'manuscript'
      WHEN publicationVenue ILIKE 'thesis%' THEN 'thesis'
      ELSE ''
    END as "type",
    COALESCE(publicationTitle, '') as title,
    COALESCE(publicationDate, '') as "date",
    COALESCE(publisher, '') as publisher,
    CASE
      WHEN publicationVenue ILIKE 'doi%' THEN ''
      ELSE COALESCE(publicationVenue, '')
    END as venue,
    COALESCE(venueVolume, '') as volume,
    COALESCE(replace(venueNumber, 'doi:10.105', ''), '') as issue,
    CASE
      WHEN venuePages ILIKE '%doi%' THEN
        trim(substr(
          replace(replace(venuePages, 'DOI:', 'doi:'), 'doi.org:', 'doi:'),
          instr(replace(replace(venuePages, 'DOI:', 'doi:'), 'doi.org:', 'doi:'), 'doi:') + 4
        ))
      WHEN publicationVenue ILIKE '%doi%' THEN
        trim(substr(
          replace(replace(publicationVenue, 'DOI:', 'doi:'), 'doi.org:', 'doi:'),
          instr(replace(replace(publicationVenue, 'DOI:', 'doi:'), 'doi.org:', 'doi:'), 'doi:') + 4
        ))
      ELSE ''
    END AS doi,
    CASE
      WHEN venuePages ILIKE 'doi%' THEN ''
      WHEN venuePages ILIKE '%doi%' THEN trim(substr(venuePages, 1, instr(venuePages, ' doi') - 1))
      ELSE trim(COALESCE(venuePages, ''))
    END as pages,
    COALESCE(replace(venueChapter, 'doi:10.105', ''), '') as chapter,
    COALESCE(links, []) as links,
    COALESCE([ slugify(name) FOR name IN tags ], []) as tags,
  FROM tblPublications
    LEFT JOIN (
      SELECT publicationId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY "rank") as authors
      FROM brdgAuthorsEditors JOIN tblPeople USING (peopleId)
      WHERE "type" = 'a'
      GROUP BY publicationId
    ) USING (publicationId)
    LEFT JOIN (
      SELECT publicationId, list(list_aggregate([trim(n) FOR n IN [fname, mname, lname] IF len(n) > 0 ], 'string_agg', ' ') ORDER BY "rank") as editors
      FROM brdgAuthorsEditors JOIN tblPeople USING (peopleId)
      WHERE "type" = 'e'
      GROUP BY publicationId
    ) USING (publicationId)
    LEFT JOIN (
      SELECT publicationId, list(shortTag) as tags
      FROM brdgTagsPublications JOIN tblSemanticTags USING (semanticTagId)
      GROUP BY publicationId
    ) USING (publicationId)
    LEFT JOIN (
      SELECT publicationId, list(fileNameURL ORDER BY "rank") as links
      FROM brdgMediaPublications JOIN tblMedia USING (mediumId)
      GROUP BY publicationId
    ) USING (publicationId)
  ORDER BY publicationDate DESC
) TO 'old-website/staging/publications.json' (FORMAT json, ARRAY true);
