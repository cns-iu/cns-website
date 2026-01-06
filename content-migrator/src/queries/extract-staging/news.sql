COPY (
  SELECT
    slugify(html_decode('pub-' || "id")) as slug,
    replace(replace(trim(link), 'https://cns.iu.edu/docs/news/', ''), 
      'http://ivl.cns.iu.edu/km/news-external/', '') as link,
    trim(html_decode(trim(title))) as title,
    trim(html_decode(trim(description))) as description,
    date,
    CASE
      WHEN media_type = 'IMAGE' THEN 'image'
      WHEN media_type = 'DOC' THEN 'document'
      WHEN media_type = 'VIDEO' THEN 'video'
      ELSE ''
    END  as "mediaType",
    replace(replace(trim(media_url), 'https://cns.iu.edu/docs/news/', ''), 
      'http://ivl.cns.iu.edu/km/news-external/', '') as "mediaUrl",
    trim(html_decode(trim(caption))) as caption,
    trim(html_decode(trim(publisher))) as publisher,
    trim(html_decode(trim(reporter))) as reporter,
    [] as tags,
  FROM tblNews
  ORDER BY date DESC NULLS FIRST
) TO 'old-website/staging/news.json' (FORMAT json, ARRAY true);
