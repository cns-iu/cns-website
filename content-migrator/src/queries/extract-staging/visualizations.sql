-- CREATE TABLE tblVisualizations(id INTEGER, title VARCHAR, description VARCHAR, 
--   media_type ENUM('IMAGE', 'VIDEO', 'DOC'), media_url VARCHAR, link VARCHAR, pub_date DATE);

COPY (
  SELECT DISTINCT
    slugify(html_decode('vis-' || id)) as slug,
    'visualization' as "type",
    link,
    title,
    description,
    CASE
      WHEN media_type = 'IMAGE' THEN 'image'
      WHEN media_type = 'DOC' THEN 'document'
      WHEN media_type = 'VIDEO' THEN 'video'
      ELSE ''
    END  as "mediaType",
    media_url as "mediaUrl",
    pub_date as "date",
    [] as tags,
  FROM 
    tblVisualizations
  ORDER BY date DESC
) TO 'old-website/staging/visualizations.json' (FORMAT json, ARRAY true);
