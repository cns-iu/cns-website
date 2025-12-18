COPY (
  SELECT
    slugify(html_decode(shortTag)) as slug,
    trim(shortTag) as name,
    trim(description) as description
  FROM tblSemanticTags
  ORDER BY shortTag
) TO 'old-website/staging/tags.json' (FORMAT json, ARRAY true);
