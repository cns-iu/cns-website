CREATE OR REPLACE MACRO slugify(input_string) AS (
    trim(both '-' from regexp_replace(regexp_replace(lower(replace(input_string, '&#246;', 'o')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g'))
);

COPY (
  SELECT
    slugify(name) as slug,
    replace(name, '&#246;', 'ö') as name,
    replace(lname, '&#246;', 'ö') as lastName,
    display_order as displayOrder,
    'https://cns-iu.github.io/cns-website/content-migrator/data/images/people/' || fileName as image,
    office,
    phone,
    fax,
    email,

    jobDescription,
    education,
    background,
    interests,

    startDate,
    endDate
  FROM 
    tblPeople
      JOIN vwWebPeopleBase USING (peopleId)
      LEFT JOIN tblCenterMembers USING (peopleId)
  ORDER BY endDate DESC NULLS FIRST, display_order
) TO 'data/indexes/people.json' (FORMAT json, ARRAY true);
