--
-- PostgreSQL database dump
--

-- Dumped from database version 9.2.24
-- Dumped by pg_dump version 14.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: vwLocationsEntitiess; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwLocationsEntitiess" AS
SELECT p."peopleId" AS id, r."locationId", 'people'::text AS type, l.city, l."StateProvince", l."Country" FROM ((public."tblPeople" p JOIN public."brdgResidence" r USING ("peopleId")) JOIN public."tblLocations" l USING ("locationId")) UNION SELECT p."eventId" AS id, r."locationId", 'events'::text AS type, l.city, l."StateProvince", l."Country" FROM ((public."tblCallsEvents" p JOIN public."brdgVenue" r USING ("eventId")) JOIN public."tblLocations" l USING ("locationId"));


ALTER TABLE public."vwLocationsEntitiess" OWNER TO km_user;

--
-- Name: vwLocationsEntities; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwLocationsEntities" AS
SELECT p."peopleId" AS id, r."locationId", 'people'::text AS type, l.city, l."StateProvince" FROM ((public."tblPeople" p JOIN public."brdgResidence" r USING ("peopleId")) JOIN public."tblLocations" l USING ("locationId")) UNION SELECT p."eventId" AS id, r."locationId", 'events'::text AS type, l.city, l."StateProvince" FROM ((public."tblCallsEvents" p JOIN public."brdgVenue" r USING ("eventId")) JOIN public."tblLocations" l USING ("locationId"));


ALTER TABLE public."vwLocationsEntities" OWNER TO km_user;

--
-- Name: VIEW "vwLocationsEntities"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwLocationsEntities" IS 'locations (city + state) and corresponding entities (NEEDS REVISING!!!!)';


--
-- Name: vwMediaEntities; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwMediaEntities" AS
(((SELECT m."mediumId", p."presentationId" AS id, 'presentations'::text AS type, m.rank FROM (public."brdgMediaPresentations" m JOIN public."tblPresentations" p USING ("presentationId")) UNION SELECT m."mediumId", p."publicationId" AS id, 'publications'::text AS type, m.rank FROM (public."brdgMediaPublications" m JOIN public."tblPublications" p USING ("publicationId"))) UNION SELECT m."mediumId", p."courseId" AS id, 'courses'::text AS type, m.rank FROM (public."brdgMediaCourses" m JOIN public."tblCourses" p USING ("courseId"))) UNION SELECT m."mediumId", p."educMaterialId" AS id, 'educmaterials'::text AS type, m.rank FROM (public."brdgMediaEducMaterials" m JOIN public."tblEducMaterials" p USING ("educMaterialId"))) UNION SELECT m."mediumId", p."tutorialId" AS id, 'tutorials'::text AS type, m.rank FROM (public."brdgMediaTutorials" m JOIN public."tblTutorials" p USING ("tutorialId"));


ALTER TABLE public."vwMediaEntities" OWNER TO km_user;

--
-- Name: VIEW "vwMediaEntities"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwMediaEntities" IS 'mediumIds and correspondong items (NEEDS REVISING!!!)';


--
-- Name: vwIVLDatasetsAll; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLDatasetsAll" AS
SELECT d."datasetId", d.name, d."numberOfEntries", d.size, d."sizeUnits", date_part('year'::text, d."startDate") AS startdate, date_part('year'::text, d."endDate") AS enddate, d.description, t."fileName", m."fileNameURL", d.type FROM ((public."tblDatasets" d LEFT JOIN (SELECT "brdgThumbsDatasets"."thumbId", "brdgThumbsDatasets"."thumbDatasetId", "brdgThumbsDatasets"."datasetId", "brdgThumbsDatasets".rank, "tblThumbs"."fileName" FROM (public."brdgThumbsDatasets" JOIN public."tblThumbs" USING ("thumbId")) WHERE ("brdgThumbsDatasets".rank = 1)) t USING ("datasetId")) LEFT JOIN (SELECT "brdgMediaDataset"."mediumId", "brdgMediaDataset"."mediumDatasetId", "brdgMediaDataset"."datasetId", "brdgMediaDataset".rank, "tblMedia"."fileNameURL", "tblMedia".type FROM (public."brdgMediaDataset" JOIN public."tblMedia" USING ("mediumId")) WHERE ("brdgMediaDataset".rank = 1)) m USING ("datasetId"));


ALTER TABLE ivl."vwIVLDatasetsAll" OWNER TO km_user;

--
-- Name: vwEventsURL; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwEventsURL" AS
SELECT e."eventId", e.title, m."fileNameURL", m.type FROM ((public."brdgMediaCallsEvents" b JOIN public."tblMedia" m USING ("mediumId")) JOIN public."tblCallsEvents" e USING ("eventId")) WHERE (b.rank = 1);


ALTER TABLE public."vwEventsURL" OWNER TO km_user;

--
-- Name: vwPrimaryURLs; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPrimaryURLs" AS
SELECT b."peopleId", t."contactItem", b.type FROM (public."brdgPeopleContactInformation" b JOIN public."tblContactInformation" t USING ("contactInformationId")) WHERE (((t."contactType")::text = '0001'::text) AND (b.rank = 1));


ALTER TABLE public."vwPrimaryURLs" OWNER TO km_user;

--
-- Name: VIEW "vwPrimaryURLs"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPrimaryURLs" IS 'stores primary URLS';


--
-- Name: vwPeopleBase; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPeopleBase" AS
SELECT p."peopleId", public."fncFmtName"((p."fName")::text, (p."mName")::text, (p."lName")::text) AS name, hp."contactItem" AS homepage FROM ((public."tblPeople" p LEFT JOIN (SELECT v."peopleId", v."contactItem", v.type FROM public."vwPrimaryURLs" v WHERE ((v.type)::text ~~ '%010%'::text)) hp USING ("peopleId")) LEFT JOIN (SELECT v."peopleId", v."contactItem", v.type FROM public."vwPrimaryURLs" v WHERE ((v.type)::text ~~ '%100%'::text)) wl USING ("peopleId")) ORDER BY p."lName", p."fName", p."mName";


ALTER TABLE public."vwPeopleBase" OWNER TO km_user;

--
-- Name: VIEW "vwPeopleBase"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPeopleBase" IS 'base table with people with formatted name and homepage';


--
-- Name: vwPresentationEventPresenters; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPresentationEventPresenters" AS
SELECT p."presentationEventId", array_to_string(public.array_accum(((COALESCE(b.name, ''::text) || '###'::text) || (COALESCE(b.homepage, ''::character varying))::text)), '@@@'::text) AS presenters FROM (public."brdgPresenters" p LEFT JOIN public."vwPeopleBase" b USING ("peopleId")) GROUP BY p."presentationEventId";


ALTER TABLE public."vwPresentationEventPresenters" OWNER TO km_user;

--
-- Name: VIEW "vwPresentationEventPresenters"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPresentationEventPresenters" IS 'presentationEventId and corresponding presenters';


--
-- Name: vwIVLPresentationsAll; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPresentationsAll" AS
SELECT DISTINCT p."presentationId", p.title AS presentationtitle, p."additionalInfo", p.type AS presentationtype, date_part('year'::text, pe.date) AS date, pe.date AS exactdate, ev.title AS eventstitle, ev."fileNameURL" AS eventurl, pep.presenters, l.city, l."StateProvince", lo."Country", t."fileNameURL", t.type AS mediatype FROM (((((((public."tblPresentations" p LEFT JOIN public."brdgPresentationsEvents" pe USING ("presentationId")) LEFT JOIN public."vwEventsURL" ev USING ("eventId")) LEFT JOIN public."vwPresentationEventPresenters" pep USING ("presentationEventId")) LEFT JOIN public."fncGetLocations"('events'::text) l(id, "locationId", type, city, "StateProvince") ON ((l.id = pe."eventId"))) LEFT JOIN (SELECT "brdgVenue"."locationId", "brdgVenue"."eventLocationId", "brdgVenue"."eventId", "tblLocations".city, "tblLocations"."zipCode", "tblLocations"."latDD", "tblLocations"."longDD", "tblLocations"."addrLine1", "tblLocations"."addrLine2", "tblLocations"."Country", "tblLocations"."StateProvince", "tblLocations"."descriptionString" FROM (public."brdgVenue" JOIN public."tblLocations" USING ("locationId"))) lo USING ("eventId")) LEFT JOIN (SELECT "fncGetMedia"."mediumId", "fncGetMedia".id, "fncGetMedia".type, "fncGetMedia".rank FROM public."fncGetMedia"('presentations'::text) "fncGetMedia"("mediumId", id, type, rank) WHERE ("fncGetMedia".rank = 1)) m ON ((p."presentationId" = m.id))) LEFT JOIN public."tblMedia" t USING ("mediumId")) WHERE (((p.type)::text ~~ '10'::text) OR ((p.type)::text ~~ '100'::text)) ORDER BY pe.date DESC, p."presentationId", p.title, p."additionalInfo", p.type, date_part('year'::text, pe.date), ev.title, ev."fileNameURL", pep.presenters, l.city, l."StateProvince", lo."Country", t."fileNameURL", t.type;


ALTER TABLE ivl."vwIVLPresentationsAll" OWNER TO km_user;

--
-- Name: vwEventAttendees; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwEventAttendees" AS
SELECT e."eventId", array_to_string(public.array_accum(((COALESCE(p.name) || '###'::text) || (COALESCE(p.homepage, ''::character varying))::text)), '@@@'::text) AS attendees FROM ((public."tblCallsEvents" e LEFT JOIN public."brdgOrganizersAttendees" o USING ("eventId")) LEFT JOIN public."vwPeopleBase" p USING ("peopleId")) WHERE ((o.type)::text ~~ 'a'::text) GROUP BY e."eventId";


ALTER TABLE public."vwEventAttendees" OWNER TO km_user;

--
-- Name: VIEW "vwEventAttendees"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwEventAttendees" IS 'peopleIds of attendees of event';


--
-- Name: vwEventOrganizers; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwEventOrganizers" AS
SELECT e."eventId", array_to_string(public.array_accum(((COALESCE(p.name) || '###'::text) || (COALESCE(p.homepage, ''::character varying))::text)), '@@@'::text) AS organizers FROM ((public."tblCallsEvents" e LEFT JOIN public."brdgOrganizersAttendees" o USING ("eventId")) LEFT JOIN public."vwPeopleBase" p USING ("peopleId")) WHERE ((o.type)::text ~~ 'o'::text) GROUP BY e."eventId";


ALTER TABLE public."vwEventOrganizers" OWNER TO km_user;

--
-- Name: VIEW "vwEventOrganizers"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwEventOrganizers" IS 'peopleIds of organizers of event';


--
-- Name: vwEventsPresentations; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwEventsPresentations" AS
SELECT p."eventId", p."presentationId", p.date, u.title, u."fileNameURL", u.type FROM (public."brdgPresentationsEvents" p JOIN public."vwEventsURL" u USING ("eventId"));


ALTER TABLE public."vwEventsPresentations" OWNER TO km_user;

--
-- Name: vwIVLEventsAll; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLEventsAll" AS
SELECT DISTINCT e."eventId", e.title, e."startDate", e."endDate", e.description, public."fncFmtEventType"((e.type)::text) AS eventtype, o.organizers, a.attendees, s."fileNameURL", s.type AS filetype, l.city, l."StateProvince", date_part('year'::text, e."startDate") AS year, l."Country", pr."presentationId", r.presentationtitle AS pretitle, r."fileNameURL" AS prefilenameurl, r.presenters, public."fncGetEventOrder"((e.type)::text) AS typeorder FROM ((((((public."tblCallsEvents" e LEFT JOIN public."vwEventOrganizers" o USING ("eventId")) LEFT JOIN public."vwEventAttendees" a USING ("eventId")) LEFT JOIN (SELECT b."mediumId", b."mediumEventId", b."eventId", b.rank, me."fileNameURL", me.type FROM (public."brdgMediaCallsEvents" b JOIN public."tblMedia" me USING ("mediumId")) WHERE (b.rank = 1)) s USING ("eventId")) LEFT JOIN (SELECT "brdgVenue"."locationId", "brdgVenue"."eventLocationId", "brdgVenue"."eventId", "tblLocations".city, "tblLocations"."zipCode", "tblLocations"."latDD", "tblLocations"."longDD", "tblLocations"."addrLine1", "tblLocations"."addrLine2", "tblLocations"."Country", "tblLocations"."StateProvince", "tblLocations"."descriptionString" FROM (public."brdgVenue" JOIN public."tblLocations" USING ("locationId"))) l USING ("eventId")) LEFT JOIN public."vwEventsPresentations" pr USING ("eventId")) LEFT JOIN ivl."vwIVLPresentationsAll" r USING ("presentationId")) ORDER BY e."endDate" DESC, e."eventId", e.title, e."startDate", e.description, public."fncFmtEventType"((e.type)::text), o.organizers, a.attendees, s."fileNameURL", s.type, l.city, l."StateProvince", date_part('year'::text, e."startDate"), l."Country", pr."presentationId", r.presentationtitle, r."fileNameURL", r.presenters;


ALTER TABLE ivl."vwIVLEventsAll" OWNER TO km_user;

--
-- Name: vwGrantsCopis; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwGrantsCopis" AS
SELECT c."grantId", array_to_string(public.array_accum(((COALESCE(b.name, ''::text) || '###'::text) || (COALESCE(b.homepage, ''::character varying))::text)), '@@@'::text) AS "copisGrants" FROM ((public."brdgCoPIs" c JOIN public."vwPeopleBase" b USING ("peopleId")) JOIN public."tblGrants" t USING ("grantId")) GROUP BY c."grantId";


ALTER TABLE public."vwGrantsCopis" OWNER TO km_user;

--
-- Name: VIEW "vwGrantsCopis"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwGrantsCopis" IS 'grantIds and corresponding principal investigators';


--
-- Name: vwGrantsResearch; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwGrantsResearch" AS
SELECT c."grantId", array_to_string(public.array_accum((((COALESCE(b."shortTitle", ''::character varying))::text || '###'::text) || (b."researchId")::text)), '@@@'::text) AS "researchGrants" FROM ((public."brdgFunding" c JOIN public."tblResearch" b USING ("researchId")) JOIN public."tblGrants" t USING ("grantId")) GROUP BY c."grantId";


ALTER TABLE public."vwGrantsResearch" OWNER TO km_user;

--
-- Name: VIEW "vwGrantsResearch"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwGrantsResearch" IS 'grantIds and corresponding research projects';


--
-- Name: vwIVLFundingGrantsCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLFundingGrantsCurrent" AS
SELECT g."grantId", g."grantName", to_char(g.amount, '999999999'::text) AS amount, g."grantTitle", g."startDate", g."endDate", c."copisGrants", d."researchGrants", o."organizationName" FROM (((public."tblGrants" g LEFT JOIN public."vwGrantsCopis" c USING ("grantId")) LEFT JOIN public."vwGrantsResearch" d USING ("grantId")) LEFT JOIN public."tblOrganizations" o USING ("organizationId")) WHERE ((g."startDate" < now()) AND (g."endDate" > now())) ORDER BY g."endDate" DESC;


ALTER TABLE ivl."vwIVLFundingGrantsCurrent" OWNER TO km_user;

--
-- Name: vwIVLFundingGrantsPast; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLFundingGrantsPast" AS
SELECT g."grantId", g."grantName", to_char(g.amount, '999,999,999'::text) AS amount, g."grantTitle", g."startDate", g."endDate", c."copisGrants", d."researchGrants", o."organizationName" FROM (((public."tblGrants" g LEFT JOIN public."vwGrantsCopis" c USING ("grantId")) LEFT JOIN public."vwGrantsResearch" d USING ("grantId")) LEFT JOIN public."tblOrganizations" o USING ("organizationId")) WHERE (g."endDate" < now()) ORDER BY g."endDate" DESC;


ALTER TABLE ivl."vwIVLFundingGrantsPast" OWNER TO km_user;

--
-- Name: vwIVLFundingGrantsPending; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLFundingGrantsPending" AS
SELECT g."grantId", to_char(g.amount, '999,999,999'::text) AS amount, g."grantTitle", g."startDate", g."endDate", c."copisGrants", d."researchGrants", o."organizationName" FROM (((public."tblGrants" g LEFT JOIN public."vwGrantsCopis" c USING ("grantId")) LEFT JOIN public."vwGrantsResearch" d USING ("grantId")) LEFT JOIN public."tblOrganizations" o USING ("organizationId")) WHERE ((g."startDate" IS NULL) OR (g."startDate" > now())) ORDER BY g."endDate" DESC;


ALTER TABLE ivl."vwIVLFundingGrantsPending" OWNER TO km_user;

--
-- Name: vwIVLHardwareAll; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLHardwareAll" AS
SELECT d."hardwareId", d."publicDescription", d.ownership, d.name, s."fileName" FROM (public."tblHardware" d LEFT JOIN (SELECT "brdgThumbsHardware"."thumbId", "brdgThumbsHardware"."thumbHardwareId", "brdgThumbsHardware"."hardwareId", "brdgThumbsHardware".rank, "tblThumbs"."fileName" FROM (public."brdgThumbsHardware" JOIN public."tblThumbs" USING ("thumbId")) WHERE ("brdgThumbsHardware".rank = 1)) s USING ("hardwareId"));


ALTER TABLE ivl."vwIVLHardwareAll" OWNER TO km_user;

--
-- Name: vwIVLHomepage; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLHomepage" AS
SELECT "tblHomepage".id, "tblHomepage".content_type, "tblHomepage".caption, "tblHomepage".link, "tblHomepage".image, "tblHomepage".image_alt, "tblHomepage".date_added, "tblHomepage".panel, "tblHomepage".display_order FROM public."tblHomepage";


ALTER TABLE ivl."vwIVLHomepage" OWNER TO km_user;

--
-- Name: vwIVLNetscitalks; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLNetscitalks" AS
SELECT "tblNetscitalks".id, "tblNetscitalks".guest, "tblNetscitalks".homepage, "tblNetscitalks".title, "tblNetscitalks".date, "tblNetscitalks".institution, "tblNetscitalks".image_url, "tblNetscitalks".slide_url, "tblNetscitalks".video_url, "tblNetscitalks".abstract, "tblNetscitalks".bio, "tblNetscitalks"."time", "tblNetscitalks".location FROM public."tblNetscitalks";


ALTER TABLE ivl."vwIVLNetscitalks" OWNER TO km_user;

--
-- Name: vwIVLNews; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLNews" AS
SELECT "tblNews".id, "tblNews".title, "tblNews".media_url, "tblNews".media_type, "tblNews".caption, "tblNews".link, "tblNews".publisher, "tblNews".reporter, "tblNews".date, "tblNews".description FROM public."tblNews";


ALTER TABLE ivl."vwIVLNews" OWNER TO km_user;

--
-- Name: vwCollabsCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCollabsCurrent" AS
SELECT DISTINCT b."peopleId" FROM public."brdgTeamCollabs" b WHERE (((b."endDate" IS NULL) OR (b."endDate" > now())) AND ((b.type)::text ~~ '001'::text)) ORDER BY b."peopleId";


ALTER TABLE public."vwCollabsCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwCollabsCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwCollabsCurrent" IS 'peopleIds of current collaborators';


--
-- Name: vwCollabsResearch; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCollabsResearch" AS
SELECT b."peopleId", array_to_string(public.array_accum((((t."shortTitle")::text || '###'::text) || (t."researchId")::text)), '@@@'::text) AS "researchCollabs", public.array_accum(t."startDate") AS "startDate", public.array_accum(t."endDate") AS "endDate" FROM (public."brdgTeamCollabs" b JOIN public."tblResearch" t USING ("researchId")) WHERE ((b.type)::text ~~ '%001%'::text) GROUP BY b."peopleId";


ALTER TABLE public."vwCollabsResearch" OWNER TO km_user;

--
-- Name: vwPrimaryEmails; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPrimaryEmails" AS
SELECT b."peopleId", t."contactItem", b.type FROM (public."brdgPeopleContactInformation" b JOIN public."tblContactInformation" t USING ("contactInformationId")) WHERE (((t."contactType")::text = '0010'::text) AND (b.rank = 1));


ALTER TABLE public."vwPrimaryEmails" OWNER TO km_user;

--
-- Name: VIEW "vwPrimaryEmails"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPrimaryEmails" IS 'stores primary email addresses';


--
-- Name: vwPrimaryThumbs; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPrimaryThumbs" AS
SELECT t."thumbId", b."peopleId" AS id, t."fileName", 'people'::text AS type FROM (public."tblThumbs" t JOIN public."brdgThumbsPeople" b USING ("thumbId")) WHERE ((b.rank)::text ~~ '%1%'::text) UNION SELECT t."thumbId", b."datasetId" AS id, t."fileName", 'datasets'::text AS type FROM (public."tblThumbs" t JOIN public."brdgThumbsDatasets" b USING ("thumbId")) WHERE ((b.rank)::text ~~ '%1%'::text);


ALTER TABLE public."vwPrimaryThumbs" OWNER TO km_user;

--
-- Name: VIEW "vwPrimaryThumbs"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPrimaryThumbs" IS 'stores thumbs';


--
-- Name: vwWebPeopleBase; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwWebPeopleBase" AS
SELECT b."peopleId", b.name, b.homepage, pt."fileName", em."contactItem" AS email FROM ((public."vwPeopleBase" b LEFT JOIN (SELECT t."thumbId", t.id, t."fileName", t.type FROM public."vwPrimaryThumbs" t WHERE (t.type ~~ '%people%'::text)) pt ON ((b."peopleId" = pt.id))) LEFT JOIN public."vwPrimaryEmails" em USING ("peopleId"));


ALTER TABLE public."vwWebPeopleBase" OWNER TO km_user;

--
-- Name: VIEW "vwWebPeopleBase"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwWebPeopleBase" IS 'base table for people with formatted name, thumbnail, email, homepage';


--
-- Name: vwIVLPeopleCollabsCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleCollabsCurrent" AS
SELECT "vwWebPeopleBase"."peopleId", "vwWebPeopleBase".name, "vwWebPeopleBase".homepage, "vwWebPeopleBase"."fileName", "vwWebPeopleBase".email, "vwCollabsResearch"."researchCollabs", "vwCollabsResearch"."startDate", "vwCollabsResearch"."endDate" FROM ((public."vwWebPeopleBase" JOIN public."vwCollabsCurrent" USING ("peopleId")) LEFT JOIN public."vwCollabsResearch" USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleCollabsCurrent" OWNER TO km_user;

--
-- Name: vwCollabsPrevious; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCollabsPrevious" AS
(SELECT DISTINCT b."peopleId" FROM public."brdgTeamCollabs" b WHERE ((b."endDate" < now()) AND ((b.type)::text ~~ '001'::text)) ORDER BY b."peopleId") EXCEPT SELECT c."peopleId" FROM public."vwCollabsCurrent" c;


ALTER TABLE public."vwCollabsPrevious" OWNER TO km_user;

--
-- Name: VIEW "vwCollabsPrevious"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwCollabsPrevious" IS 'peopleIds of past collaborators';


--
-- Name: vwIVLPeopleCollabsPrevious; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleCollabsPrevious" AS
SELECT "vwWebPeopleBase"."peopleId", "vwWebPeopleBase".name, "vwWebPeopleBase".homepage, "vwWebPeopleBase"."fileName", "vwWebPeopleBase".email, "vwCollabsResearch"."researchCollabs", "vwCollabsResearch"."startDate", "vwCollabsResearch"."endDate" FROM ((public."vwWebPeopleBase" JOIN public."vwCollabsPrevious" USING ("peopleId")) LEFT JOIN public."vwCollabsResearch" USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleCollabsPrevious" OWNER TO km_user;

--
-- Name: vwIndepStudiesCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwIndepStudiesCurrent" AS
SELECT i."indepStudyId", i.topic, i.description, a."indepStudentSupervisorId", a."peopleId", a.type, a.semester, a.year, a."courseNumber" FROM (public."tblIndepStudies" i JOIN (SELECT "brdgIndepStudentsSupervisors"."indepStudentSupervisorId", "brdgIndepStudentsSupervisors"."peopleId", "brdgIndepStudentsSupervisors"."indepStudyId", "brdgIndepStudentsSupervisors".type, "brdgIndepStudentsSupervisors".semester, "brdgIndepStudentsSupervisors".year, "brdgIndepStudentsSupervisors"."courseNumber" FROM public."brdgIndepStudentsSupervisors" WHERE ("brdgIndepStudentsSupervisors".type = 10)) a USING ("indepStudyId")) WHERE ((a.year > now()) OR (a.year IS NULL));


ALTER TABLE public."vwIndepStudiesCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwIndepStudiesCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwIndepStudiesCurrent" IS 'current independent studies';


--
-- Name: vwIVLPeopleIndepStudentsCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleIndepStudentsCurrent" AS
SELECT p."peopleId", p.name, p.homepage, p."fileName", p.email, i.topic, i.description, i.semester, i.year, i."courseNumber" FROM (public."vwWebPeopleBase" p JOIN public."vwIndepStudiesCurrent" i USING ("peopleId")) ORDER BY i.year DESC, i.semester DESC;


ALTER TABLE ivl."vwIVLPeopleIndepStudentsCurrent" OWNER TO km_user;

--
-- Name: vwIndepStudiesPrevious; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwIndepStudiesPrevious" AS
SELECT i."indepStudyId", i.topic, i.description, a."indepStudentSupervisorId", a."peopleId", a.type, a.semester, a.year, a."courseNumber" FROM (public."tblIndepStudies" i JOIN (SELECT "brdgIndepStudentsSupervisors"."indepStudentSupervisorId", "brdgIndepStudentsSupervisors"."peopleId", "brdgIndepStudentsSupervisors"."indepStudyId", "brdgIndepStudentsSupervisors".type, "brdgIndepStudentsSupervisors".semester, "brdgIndepStudentsSupervisors".year, "brdgIndepStudentsSupervisors"."courseNumber" FROM public."brdgIndepStudentsSupervisors" WHERE ("brdgIndepStudentsSupervisors".type = 10)) a USING ("indepStudyId")) WHERE (a.year < now());


ALTER TABLE public."vwIndepStudiesPrevious" OWNER TO km_user;

--
-- Name: VIEW "vwIndepStudiesPrevious"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwIndepStudiesPrevious" IS 'previous independent studies';


--
-- Name: vwIVLPeopleIndepStudentsPrevious; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleIndepStudentsPrevious" AS
SELECT p."peopleId", p.name, p.homepage, p."fileName", p.email, i.topic, i.description, i.semester, i.year, i."courseNumber" FROM (public."vwWebPeopleBase" p JOIN public."vwIndepStudiesPrevious" i USING ("peopleId")) ORDER BY i.year DESC, i.semester DESC;


ALTER TABLE ivl."vwIVLPeopleIndepStudentsPrevious" OWNER TO km_user;

--
-- Name: vwStudentsCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwStudentsCurrent" AS
SELECT t."maPhDId", t."peopleId", t.topic, t."startDate", t."endDate", t."degreeType" FROM public."tblMAPhDs" t WHERE ((t."endDate" > now()) OR (t."endDate" IS NULL));


ALTER TABLE public."vwStudentsCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwStudentsCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwStudentsCurrent" IS 'current MA and PhD students';


--
-- Name: vwIVLPeopleMAsCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleMAsCurrent" AS
SELECT b."peopleId", b.name, b.homepage, b."fileName", b.email, s.topic, s."startDate", s."endDate" FROM (public."vwWebPeopleBase" b JOIN (SELECT sc."maPhDId", sc."peopleId", sc.topic, sc."startDate", sc."endDate", sc."degreeType" FROM public."vwStudentsCurrent" sc WHERE (sc."degreeType" = 'm'::bpchar)) s USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleMAsCurrent" OWNER TO km_user;

--
-- Name: vwStudentsPrevious; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwStudentsPrevious" AS
SELECT t."maPhDId", t."peopleId", t.topic, t."startDate", t."endDate", t."degreeType" FROM public."tblMAPhDs" t WHERE (t."endDate" < now());


ALTER TABLE public."vwStudentsPrevious" OWNER TO km_user;

--
-- Name: VIEW "vwStudentsPrevious"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwStudentsPrevious" IS 'previous MA and PhD students';


--
-- Name: vwIVLPeopleMAsPrevious; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleMAsPrevious" AS
SELECT b."peopleId", b.name, b.homepage, b."fileName", b.email, s.topic, s."startDate", s."endDate" FROM (public."vwWebPeopleBase" b JOIN (SELECT sc."maPhDId", sc."peopleId", sc.topic, sc."startDate", sc."endDate", sc."degreeType" FROM public."vwStudentsPrevious" sc WHERE (sc."degreeType" = 'm'::bpchar)) s USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleMAsPrevious" OWNER TO km_user;

--
-- Name: vwAffiliations; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwAffiliations" AS
SELECT a."peopleId", o."organizationName" FROM (public."brdgAffiliations" a JOIN public."tblOrganizations" o USING ("organizationId"));


ALTER TABLE public."vwAffiliations" OWNER TO km_user;

--
-- Name: vwMembersCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwMembersCurrent" AS
SELECT DISTINCT t."centerMemberId", t."peopleId", t."startDate", t."endDate", t.ivl, t.cns, t."jobDescription", t.display_order, t.phone, t.fax, t.office, t.education, t.background, t.interests FROM public."tblCenterMembers" t WHERE ((t."endDate" > now()) OR (t."endDate" IS NULL)) ORDER BY t."peopleId";


ALTER TABLE public."vwMembersCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwMembersCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwMembersCurrent" IS 'Current lab members';


--
-- Name: vwTeamCurrentResearch; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwTeamCurrentResearch" AS
SELECT b."peopleId", array_to_string(public.array_accum((((t."shortTitle")::text || '###'::text) || (t."researchId")::text)), '@@@'::text) AS "researchTeam" FROM (public."brdgTeamCollabs" b JOIN public."tblResearch" t USING ("researchId")) WHERE (((b.type)::text ~~ '%100%'::text) AND ((t."endDate" IS NULL) OR (t."endDate" > now()))) GROUP BY b."peopleId";


ALTER TABLE public."vwTeamCurrentResearch" OWNER TO km_user;

--
-- Name: VIEW "vwTeamCurrentResearch"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwTeamCurrentResearch" IS 'peopleIds and corresponding current research projects';


--
-- Name: vwIVLPeopleMembersCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleMembersCurrent" AS
SELECT wb."peopleId", wb.name, wb.homepage, wb."fileName", wb.email, r."researchTeam", c."jobDescription", c."startDate", c."endDate", date_part('year'::text, c."startDate") AS startyear, date_part('month'::text, c."startDate") AS startmonth, date_part('day'::text, c."startDate") AS startday, date_part('year'::text, c."endDate") AS endyear, date_part('month'::text, c."endDate") AS endmonth, date_part('day'::text, c."endDate") AS endday, a."organizationName" AS affiliations, c.display_order, c.phone, c.fax, c.office, c.education, c.background, c.interests FROM (((public."vwWebPeopleBase" wb JOIN public."vwMembersCurrent" c USING ("peopleId")) LEFT JOIN public."vwTeamCurrentResearch" r USING ("peopleId")) LEFT JOIN public."vwAffiliations" a USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleMembersCurrent" OWNER TO km_user;

--
-- Name: vwMembersPrevious; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwMembersPrevious" AS
SELECT s."peopleId", "tblCenterMembers"."centerMemberId", "tblCenterMembers"."startDate", "tblCenterMembers"."endDate", "tblCenterMembers".ivl, "tblCenterMembers".cns, "tblCenterMembers"."jobDescription" FROM (((SELECT DISTINCT t."peopleId" FROM public."tblCenterMembers" t WHERE (t."endDate" < now()) ORDER BY t."peopleId") EXCEPT SELECT c."peopleId" FROM public."vwMembersCurrent" c) s LEFT JOIN public."tblCenterMembers" USING ("peopleId"));


ALTER TABLE public."vwMembersPrevious" OWNER TO km_user;

--
-- Name: VIEW "vwMembersPrevious"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwMembersPrevious" IS 'previous lab members';


--
-- Name: vwTeamResearch; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwTeamResearch" AS
SELECT b."peopleId", array_to_string(public.array_accum((((t."shortTitle")::text || '###'::text) || (t."researchId")::text)), '@@@'::text) AS "researchTeam" FROM (public."brdgTeamCollabs" b JOIN public."tblResearch" t USING ("researchId")) WHERE ((b.type)::text ~~ '%100%'::text) GROUP BY b."peopleId";


ALTER TABLE public."vwTeamResearch" OWNER TO km_user;

--
-- Name: VIEW "vwTeamResearch"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwTeamResearch" IS 'peopleIds and corresponding research projects';


--
-- Name: vwIVLPeopleMembersPrevious; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleMembersPrevious" AS
SELECT wb."peopleId", wb.name, wb.homepage, wb."fileName", wb.email, r."researchTeam", c."jobDescription", date_part('year'::text, c."startDate") AS startyear, date_part('month'::text, c."startDate") AS startmonth, date_part('day'::text, c."startDate") AS startday, date_part('year'::text, c."endDate") AS endyear, date_part('month'::text, c."endDate") AS endmonth, date_part('day'::text, c."endDate") AS endday, c."startDate", c."endDate" FROM ((public."vwWebPeopleBase" wb JOIN public."vwMembersPrevious" c USING ("peopleId")) LEFT JOIN public."vwTeamResearch" r USING ("peopleId")) ORDER BY wb.name, c."startDate" DESC;


ALTER TABLE ivl."vwIVLPeopleMembersPrevious" OWNER TO km_user;

--
-- Name: vwIVLPeoplePhDsCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeoplePhDsCurrent" AS
SELECT b."peopleId", b.name, b.homepage, b."fileName", b.email, s.topic, s."startDate", s."endDate" FROM (public."vwWebPeopleBase" b JOIN (SELECT sc."maPhDId", sc."peopleId", sc.topic, sc."startDate", sc."endDate", sc."degreeType" FROM public."vwStudentsCurrent" sc WHERE (sc."degreeType" = 'p'::bpchar)) s USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeoplePhDsCurrent" OWNER TO km_user;

--
-- Name: vwIVLPeoplePhDsPrevious; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeoplePhDsPrevious" AS
SELECT b."peopleId", b.name, b.homepage, b."fileName", b.email, s.topic, s."startDate", s."endDate" FROM (public."vwWebPeopleBase" b JOIN (SELECT sc."maPhDId", sc."peopleId", sc.topic, sc."startDate", sc."endDate", sc."degreeType" FROM public."vwStudentsPrevious" sc WHERE (sc."degreeType" = 'p'::bpchar)) s USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeoplePhDsPrevious" OWNER TO km_user;

--
-- Name: vwIVLPeopleStudentsCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleStudentsCurrent" AS
SELECT b."peopleId", b.name, b.homepage, b."fileName", b.email, s.topic, s."startDate", s."endDate" FROM (public."vwWebPeopleBase" b JOIN (SELECT sc."maPhDId", sc."peopleId", sc.topic, sc."startDate", sc."endDate", sc."degreeType" FROM public."vwStudentsCurrent" sc WHERE ((sc."degreeType" = 'p'::bpchar) OR (sc."degreeType" = 'm'::bpchar))) s USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleStudentsCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwIVLPeopleStudentsCurrent"; Type: COMMENT; Schema: ivl; Owner: km_user
--

COMMENT ON VIEW ivl."vwIVLPeopleStudentsCurrent" IS 'Masters and PhD students';


--
-- Name: vwIVLPeopleStudentsPrevious; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPeopleStudentsPrevious" AS
SELECT b."peopleId", b.name, b.homepage, b."fileName", b.email, s.topic, s."startDate", s."endDate" FROM (public."vwWebPeopleBase" b JOIN (SELECT sc."maPhDId", sc."peopleId", sc.topic, sc."startDate", sc."endDate", sc."degreeType" FROM public."vwStudentsPrevious" sc WHERE ((sc."degreeType" = 'p'::bpchar) OR (sc."degreeType" = 'm'::bpchar))) s USING ("peopleId"));


ALTER TABLE ivl."vwIVLPeopleStudentsPrevious" OWNER TO km_user;

--
-- Name: VIEW "vwIVLPeopleStudentsPrevious"; Type: COMMENT; Schema: ivl; Owner: km_user
--

COMMENT ON VIEW ivl."vwIVLPeopleStudentsPrevious" IS 'Previous Masters and PhD students';


--
-- Name: vwAuthorsRanked; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwAuthorsRanked" AS
SELECT b."authorEditorId", b."peopleId", b."publicationId", b.rank, b.type FROM public."brdgAuthorsEditors" b WHERE (b.type ~~ 'a'::text) ORDER BY b."publicationId", b.rank;


ALTER TABLE public."vwAuthorsRanked" OWNER TO km_user;

--
-- Name: VIEW "vwAuthorsRanked"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwAuthorsRanked" IS 'authors as peopleId ranked in order';


--
-- Name: vwPublicationAuthors; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPublicationAuthors" AS
SELECT p."publicationId", array_to_string(public.array_accum(((COALESCE(b.name, ''::text) || '###'::text) || (COALESCE(b.homepage, ''::character varying))::text)), '@@@'::text) AS authors FROM ((SELECT a."publicationId", b.name, b.homepage FROM (public."vwPeopleBase" b JOIN public."vwAuthorsRanked" a USING ("peopleId")) ORDER BY a.rank) b JOIN public."tblPublications" p USING ("publicationId")) GROUP BY p."publicationId" ORDER BY p."publicationId" DESC;


ALTER TABLE public."vwPublicationAuthors" OWNER TO km_user;

--
-- Name: VIEW "vwPublicationAuthors"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPublicationAuthors" IS 'publicationIds and corresponding authors';


--
-- Name: vwPublicationEditors; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPublicationEditors" AS
SELECT z."publicationId", array_to_string(public.array_accum(((COALESCE(z.name, ''::text) || '###'::text) || (COALESCE(z.homepage, ''::character varying))::text)), '@@@'::text) AS editors FROM (SELECT a."publicationId", b."peopleId", b.name, b.homepage, a."authorEditorId", a.rank, a.type, p."publicationTitle", p."publicationDate", p."publicationVenue", p."venueVolume", p."venueNumber", p."venuePages", p.type, p.publisher, p."venueChapter" FROM ((public."vwPeopleBase" b JOIN (SELECT "brdgAuthorsEditors"."authorEditorId", "brdgAuthorsEditors"."peopleId", "brdgAuthorsEditors"."publicationId", "brdgAuthorsEditors".rank, "brdgAuthorsEditors".type FROM public."brdgAuthorsEditors" WHERE ("brdgAuthorsEditors".type ~~ 'e'::text) ORDER BY "brdgAuthorsEditors".rank) a USING ("peopleId")) JOIN public."tblPublications" p USING ("publicationId")) ORDER BY a."publicationId", a.rank) z GROUP BY z."publicationId";


ALTER TABLE public."vwPublicationEditors" OWNER TO km_user;

--
-- Name: VIEW "vwPublicationEditors"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPublicationEditors" IS 'publicationIds and corresponding editors';


--
-- Name: vwIVLPublicationsAll; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLPublicationsAll" AS
SELECT p."publicationId", p."publicationTitle", date_part('YEAR'::text, p."publicationDate") AS date, p."publicationVenue", p."venueVolume", p."venueNumber", p."venuePages", public."fncFmtPubType"((p.type)::text) AS type, p.publisher, p."venueChapter", a.authors, e.editors, t."fileNameURL", t.type AS linktype, public."fncGetPubOrder"((p.type)::text) AS typeorder, to_char((p."publicationDate")::timestamp with time zone, 'YYYY'::text) AS year FROM ((((public."tblPublications" p LEFT JOIN public."vwPublicationAuthors" a USING ("publicationId")) LEFT JOIN public."vwPublicationEditors" e USING ("publicationId")) LEFT JOIN (SELECT "fncGetMedia"."mediumId", "fncGetMedia".id, "fncGetMedia".type, "fncGetMedia".rank FROM public."fncGetMedia"('publications'::text) "fncGetMedia"("mediumId", id, type, rank) WHERE ("fncGetMedia".rank = 1)) m ON ((p."publicationId" = m.id))) LEFT JOIN public."tblMedia" t USING ("mediumId")) ORDER BY p."publicationDate" DESC, p."publicationId";


ALTER TABLE ivl."vwIVLPublicationsAll" OWNER TO km_user;

--
-- Name: vwResearchGrants; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchGrants" AS
SELECT b."researchId", array_to_string(public.array_accum(p."grantName"), '@@@'::text) AS grants FROM (public."brdgFunding" b JOIN public."tblGrants" p USING ("grantId")) GROUP BY b."researchId";


ALTER TABLE public."vwResearchGrants" OWNER TO km_user;

--
-- Name: VIEW "vwResearchGrants"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchGrants" IS 'researchIds and corresponding grants';


--
-- Name: vwResearchPublications; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchPublications" AS
SELECT b."researchId", array_to_string(public.array_accum(((((((((((((((((((((((((COALESCE(p."publicationTitle", ''::character varying))::text || '%%%'::text) || COALESCE((date_part('year'::text, p."publicationDate"))::text, ''::text)) || '%%%'::text) || (COALESCE(p."publicationVenue", ''::character varying))::text) || '%%%'::text) || (COALESCE(p."publicationVenue", ''::character varying))::text) || '%%%'::text) || (COALESCE(p."venueVolume", ''::character varying))::text) || '%%%'::text) || (COALESCE(p."venueNumber", ''::character varying))::text) || '%%%'::text) || (COALESCE(p."venuePages", ''::character varying))::text) || '%%%'::text) || (COALESCE(p.type, ''::character varying))::text) || '%%%'::text) || (COALESCE(p.publisher, ''::character varying))::text) || '%%%'::text) || (COALESCE(p."venueChapter", ''::character varying))::text) || '%%%'::text) || COALESCE(a.authors, ''::text)) || '%%%'::text) || COALESCE(e.editors, ''::text)) || '%%%'::text)), '***'::text) AS publications FROM (((public."brdgResearchPublications" b JOIN public."tblPublications" p USING ("publicationId")) LEFT JOIN public."vwPublicationAuthors" a USING ("publicationId")) LEFT JOIN public."vwPublicationEditors" e USING ("publicationId")) GROUP BY b."researchId";


ALTER TABLE public."vwResearchPublications" OWNER TO km_user;

--
-- Name: VIEW "vwResearchPublications"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchPublications" IS 'publicationIds and corresponding publicaitons';


--
-- Name: vwResearchTeamCollabsCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchTeamCollabsCurrent" AS
SELECT b."researchId", array_to_string(public.array_accum(((COALESCE(p.name, ''::text) || '###'::text) || COALESCE((p.homepage)::text, ''::text))), '@@@'::text) AS collabscurrent FROM (public."brdgTeamCollabs" b JOIN public."vwWebPeopleBase" p USING ("peopleId")) WHERE (((b.type)::text = '001'::text) AND ((b."endDate" > now()) OR (b."endDate" IS NULL))) GROUP BY b."researchId";


ALTER TABLE public."vwResearchTeamCollabsCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwResearchTeamCollabsCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchTeamCollabsCurrent" IS 'researchIds and corresponding current collaborators';


--
-- Name: vwResearchTeamCollabsPast; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchTeamCollabsPast" AS
SELECT b."researchId", array_to_string(public.array_accum(((COALESCE(p.name, ''::text) || '###'::text) || COALESCE((p.homepage)::text, ''::text))), '@@@'::text) AS collabspast FROM (public."brdgTeamCollabs" b JOIN public."vwWebPeopleBase" p USING ("peopleId")) WHERE (((b.type)::text = '001'::text) AND (b."endDate" < now())) GROUP BY b."researchId";


ALTER TABLE public."vwResearchTeamCollabsPast" OWNER TO km_user;

--
-- Name: VIEW "vwResearchTeamCollabsPast"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchTeamCollabsPast" IS 'researchIds and corresponding past collaborators';


--
-- Name: vwResearchTeamLeadsCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchTeamLeadsCurrent" AS
SELECT b."researchId", array_to_string(public.array_accum(((COALESCE(p.name, ''::text) || '###'::text) || COALESCE((p.homepage)::text, ''::text))), '@@@'::text) AS leadscurrent FROM (public."brdgTeamCollabs" b JOIN public."vwWebPeopleBase" p USING ("peopleId")) WHERE (((b.type)::text = '010'::text) AND ((b."endDate" IS NULL) OR (b."endDate" > now()))) GROUP BY b."researchId";


ALTER TABLE public."vwResearchTeamLeadsCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwResearchTeamLeadsCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchTeamLeadsCurrent" IS 'researchIds and corresponding current team leads';


--
-- Name: vwResearchTeamMembersCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchTeamMembersCurrent" AS
SELECT b."researchId", array_to_string(public.array_accum(((COALESCE(p.name, ''::text) || '###'::text) || COALESCE((p.homepage)::text, ''::text))), '@@@'::text) AS memberscurrent FROM (public."brdgTeamCollabs" b JOIN public."vwWebPeopleBase" p USING ("peopleId")) WHERE (((b.type)::text = '010'::text) AND ((b."endDate" IS NULL) OR (b."endDate" > now()))) GROUP BY b."researchId";


ALTER TABLE public."vwResearchTeamMembersCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwResearchTeamMembersCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchTeamMembersCurrent" IS 'researchIds and corresponding current team members';


--
-- Name: vwResearchTeamMembersPast; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwResearchTeamMembersPast" AS
SELECT b."researchId", array_to_string(public.array_accum(((COALESCE(p.name, ''::text) || '###'::text) || COALESCE((p.homepage)::text, ''::text))), '@@@'::text) AS memberspast FROM (public."brdgTeamCollabs" b JOIN public."vwWebPeopleBase" p USING ("peopleId")) WHERE (((b.type)::text = '100'::text) AND (b."endDate" < now())) GROUP BY b."researchId";


ALTER TABLE public."vwResearchTeamMembersPast" OWNER TO km_user;

--
-- Name: VIEW "vwResearchTeamMembersPast"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwResearchTeamMembersPast" IS 'researchIds and corresponding past team members';


--
-- Name: vwIVLResearchCurrent; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLResearchCurrent" AS
SELECT r."researchId", r."fullTitle", r."shortTitle", r."startDate", r."endDate", r.description, r.ivlweb, r.cnsweb, g.grants, l.leadscurrent, mc.memberscurrent, mp.memberspast, cc.collabscurrent, cp.collabspast, p.publications, t."fileName" FROM ((((((((public."tblResearch" r LEFT JOIN public."vwResearchGrants" g USING ("researchId")) LEFT JOIN public."vwResearchTeamLeadsCurrent" l USING ("researchId")) LEFT JOIN public."vwResearchTeamMembersCurrent" mc USING ("researchId")) LEFT JOIN public."vwResearchTeamMembersPast" mp USING ("researchId")) LEFT JOIN public."vwResearchTeamCollabsCurrent" cc USING ("researchId")) LEFT JOIN public."vwResearchTeamCollabsPast" cp USING ("researchId")) LEFT JOIN public."vwResearchPublications" p USING ("researchId")) LEFT JOIN (SELECT "tblThumbs"."fileName", "brdgThumbsResearch"."researchId" FROM (public."tblThumbs" JOIN public."brdgThumbsResearch" USING ("thumbId")) WHERE ("brdgThumbsResearch".rank = 1)) t USING ("researchId")) WHERE ((r."endDate" IS NULL) OR (r."endDate" > now()));


ALTER TABLE ivl."vwIVLResearchCurrent" OWNER TO km_user;

--
-- Name: vwIVLResearchPast; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLResearchPast" AS
SELECT r."researchId", r."fullTitle", r."shortTitle", r."startDate", r."endDate", r.description, r.ivlweb, r.cnsweb, g.grants, l.leadscurrent, mc.memberscurrent, mp.memberspast, cc.collabscurrent, cp.collabspast, p.publications, t."fileName" FROM ((((((((public."tblResearch" r LEFT JOIN public."vwResearchGrants" g USING ("researchId")) LEFT JOIN public."vwResearchTeamLeadsCurrent" l USING ("researchId")) LEFT JOIN public."vwResearchTeamMembersCurrent" mc USING ("researchId")) LEFT JOIN public."vwResearchTeamMembersPast" mp USING ("researchId")) LEFT JOIN public."vwResearchTeamCollabsCurrent" cc USING ("researchId")) LEFT JOIN public."vwResearchTeamCollabsPast" cp USING ("researchId")) LEFT JOIN public."vwResearchPublications" p USING ("researchId")) LEFT JOIN (SELECT "tblThumbs"."fileName", "brdgThumbsResearch"."researchId" FROM (public."tblThumbs" JOIN public."brdgThumbsResearch" USING ("thumbId")) WHERE ("brdgThumbsResearch".rank = 1)) t USING ("researchId")) WHERE (r."endDate" < now());


ALTER TABLE ivl."vwIVLResearchPast" OWNER TO km_user;

--
-- Name: vwIVLSoftwareAll; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLSoftwareAll" AS
SELECT s."softwareId", s."softwareTitle", s."softwareDescription", t."fileName", m."fileNameURL", st.label AS "softwareType" FROM (((public."tblSoftware" s LEFT JOIN (SELECT "brdgThumbsSoftware"."thumbId", "brdgThumbsSoftware"."thumbSoftwareId", "brdgThumbsSoftware"."softwareId", "brdgThumbsSoftware".rank, "tblThumbs"."fileName" FROM (public."brdgThumbsSoftware" JOIN public."tblThumbs" USING ("thumbId")) WHERE ("brdgThumbsSoftware".rank = 1)) t USING ("softwareId")) LEFT JOIN (SELECT "brdgMediaSoftware"."mediumId", "brdgMediaSoftware"."mediumSoftwareId", "brdgMediaSoftware"."softwareId", "brdgMediaSoftware".rank, "tblMedia"."fileNameURL", "tblMedia".type FROM (public."brdgMediaSoftware" JOIN public."tblMedia" USING ("mediumId")) WHERE ("brdgMediaSoftware".rank = 1)) m USING ("softwareId")) LEFT JOIN public."tblSoftwareType" st USING ("softwareTypeID")) ORDER BY st."sortOrder";


ALTER TABLE ivl."vwIVLSoftwareAll" OWNER TO km_user;

--
-- Name: vwIVLSoftwareType; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLSoftwareType" AS
SELECT "tblSoftwareType"."softwareTypeID", "tblSoftwareType".label, "tblSoftwareType"."sortOrder" FROM public."tblSoftwareType" ORDER BY "tblSoftwareType"."sortOrder";


ALTER TABLE ivl."vwIVLSoftwareType" OWNER TO km_user;

--
-- Name: VIEW "vwIVLSoftwareType"; Type: COMMENT; Schema: ivl; Owner: km_user
--

COMMENT ON VIEW ivl."vwIVLSoftwareType" IS 'Software Types based on sort order';


--
-- Name: vwIVLStaticPages; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLStaticPages" AS
SELECT "tblStaticPages".id, "tblStaticPages".content, "tblStaticPages".name, "tblStaticPages".subpage, "tblStaticPages".updated FROM public."tblStaticPages";


ALTER TABLE ivl."vwIVLStaticPages" OWNER TO km_user;

--
-- Name: vwCourseAssistants; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCourseAssistants" AS
SELECT sa."courseId", array_to_string(public.array_accum(((COALESCE("vwPeopleBase".name) || '###'::text) || (COALESCE("vwPeopleBase".homepage, ''::character varying))::text)), '@@@'::text) AS assistants FROM (public."vwPeopleBase" JOIN (SELECT "brdgTeachers"."teacherId", "brdgTeachers"."peopleId", "brdgTeachers"."courseId", "brdgTeachers".type FROM public."brdgTeachers" WHERE (("brdgTeachers".type)::text = 'a'::text)) sa USING ("peopleId")) GROUP BY sa."courseId";


ALTER TABLE public."vwCourseAssistants" OWNER TO km_user;

--
-- Name: VIEW "vwCourseAssistants"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwCourseAssistants" IS 'courseIds and corresponding teacher assistants';


--
-- Name: vwCourseTeachers; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCourseTeachers" AS
SELECT sa."courseId", array_to_string(public.array_accum(((COALESCE("vwPeopleBase".name) || '###'::text) || (COALESCE("vwPeopleBase".homepage, ''::character varying))::text)), '@@@'::text) AS teachers FROM (public."vwPeopleBase" JOIN (SELECT "brdgTeachers"."teacherId", "brdgTeachers"."peopleId", "brdgTeachers"."courseId", "brdgTeachers".type FROM public."brdgTeachers" WHERE (("brdgTeachers".type)::text = 't'::text)) sa USING ("peopleId")) GROUP BY sa."courseId";


ALTER TABLE public."vwCourseTeachers" OWNER TO km_user;

--
-- Name: VIEW "vwCourseTeachers"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwCourseTeachers" IS 'courseIds and corresponding teachers';


--
-- Name: vwIVLTeachingCourses; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLTeachingCourses" AS
SELECT c."courseId", date_part('year'::text, c.year) AS year, c."courseTitle", c."courseNumber", c."schoolDepartment", c.institution, c.semester, t.teachers, a.assistants, m."fileNameURL", m.type FROM ((((public."tblCourses" c LEFT JOIN public."vwCourseTeachers" t USING ("courseId")) LEFT JOIN public."vwCourseAssistants" a USING ("courseId")) LEFT JOIN (SELECT "fncGetMedia"."mediumId", "fncGetMedia".id, "fncGetMedia".type, "fncGetMedia".rank FROM public."fncGetMedia"('courses'::text) "fncGetMedia"("mediumId", id, type, rank) WHERE ("fncGetMedia".rank = 1)) s ON ((s.id = c."courseId"))) LEFT JOIN public."tblMedia" m USING ("mediumId")) ORDER BY c."courseNumber", c.institution, c.year DESC, c.semester DESC;


ALTER TABLE ivl."vwIVLTeachingCourses" OWNER TO km_user;

--
-- Name: vwIVLTeachingEducMaterials; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLTeachingEducMaterials" AS
SELECT "tblEducMaterials"."educMaterialId", "tblEducMaterials".title, "tblEducMaterials".description, "tblEducMaterials"."lastUpdated", s."mediumId", s."mediumEducMaterialId", s.rank, s."fileNameURL", s.type FROM (public."tblEducMaterials" LEFT JOIN (SELECT "brdgMediaEducMaterials"."mediumId", "brdgMediaEducMaterials"."mediumEducMaterialId", "brdgMediaEducMaterials"."educMaterialId", "brdgMediaEducMaterials".rank, "tblMedia"."fileNameURL", "tblMedia".type FROM (public."brdgMediaEducMaterials" JOIN public."tblMedia" USING ("mediumId"))) s USING ("educMaterialId")) ORDER BY "tblEducMaterials"."lastUpdated" DESC;


ALTER TABLE ivl."vwIVLTeachingEducMaterials" OWNER TO km_user;

--
-- Name: vwIVLTeachingEducPresentations; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLTeachingEducPresentations" AS
SELECT p."presentationId", p.title AS presentationtitle, p."additionalInfo", p.type AS presentationtype, date_part('year'::text, pe.date) AS date, pe.date AS exactdate, ce.title AS eventstitle, ce."fileNameURL" AS eventurl, pep.presenters, l.city, l."StateProvince", t."fileNameURL", t.type AS mediatype FROM ((((((public."tblPresentations" p LEFT JOIN public."brdgPresentationsEvents" pe USING ("presentationId")) LEFT JOIN public."vwEventsURL" ce USING ("eventId")) LEFT JOIN public."vwPresentationEventPresenters" pep USING ("presentationEventId")) LEFT JOIN public."fncGetLocations"('events'::text) l(id, "locationId", type, city, "StateProvince") ON ((l.id = pe."eventId"))) LEFT JOIN (SELECT "fncGetMedia"."mediumId", "fncGetMedia".id, "fncGetMedia".type, "fncGetMedia".rank FROM public."fncGetMedia"('presentations'::text) "fncGetMedia"("mediumId", id, type, rank) WHERE ("fncGetMedia".rank = 1)) m ON ((p."presentationId" = m.id))) LEFT JOIN public."tblMedia" t USING ("mediumId")) WHERE ((p.type)::text ~~ '01'::text) ORDER BY pe.date DESC;


ALTER TABLE ivl."vwIVLTeachingEducPresentations" OWNER TO km_user;

--
-- Name: vwTutorialEventPresenters; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwTutorialEventPresenters" AS
SELECT p."tutorialEventId", array_to_string(public.array_accum(((COALESCE(b.name, ''::text) || '###'::text) || (COALESCE(b.homepage, ''::character varying))::text)), '@@@'::text) AS presenters FROM (public."brdgInstructors" p LEFT JOIN public."vwPeopleBase" b USING ("peopleId")) GROUP BY p."tutorialEventId";


ALTER TABLE public."vwTutorialEventPresenters" OWNER TO km_user;

--
-- Name: VIEW "vwTutorialEventPresenters"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwTutorialEventPresenters" IS 'tutorialEventId and corresponding presenters';


--
-- Name: vwIVLTeachingTutorials; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLTeachingTutorials" AS
SELECT p."tutorialTitle", t."fileNameURL", ce."startDate", l.city, l."StateProvince", l."Country" FROM ((((((public."tblTutorials" p LEFT JOIN public."brdgTutorialsEvents" pe USING ("tutorialId")) LEFT JOIN public."tblCallsEvents" ce USING ("eventId")) LEFT JOIN public."vwTutorialEventPresenters" pep USING ("tutorialEventId")) LEFT JOIN public."fncGetFullLocations"('events'::text) l(id, "locationId", type, city, "StateProvince", "Country") ON ((l.id = pe."eventId"))) LEFT JOIN (SELECT "fncGetMedia"."mediumId", "fncGetMedia".id, "fncGetMedia".type, "fncGetMedia".rank FROM public."fncGetMedia"('tutorials'::text) "fncGetMedia"("mediumId", id, type, rank) WHERE ("fncGetMedia".rank = 1)) m ON ((p."tutorialId" = m.id))) LEFT JOIN public."tblMedia" t USING ("mediumId"));


ALTER TABLE ivl."vwIVLTeachingTutorials" OWNER TO km_user;

--
-- Name: vwIVLVideos; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLVideos" AS
SELECT "tblVideos".id, "tblVideos".title, "tblVideos".description, "tblVideos".video_type, "tblVideos".link, "tblVideos".pub_date, "tblVideos".embedded_video_code FROM public."tblVideos";


ALTER TABLE ivl."vwIVLVideos" OWNER TO km_user;

--
-- Name: vwIVLVisualizations; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLVisualizations" AS
SELECT "tblVisualizations".id, "tblVisualizations".title, "tblVisualizations".description, "tblVisualizations".media_type, "tblVisualizations".media_url, "tblVisualizations".link, "tblVisualizations".pub_date FROM public."tblVisualizations";


ALTER TABLE ivl."vwIVLVisualizations" OWNER TO km_user;

--
-- Name: vwIVLWorkshops; Type: VIEW; Schema: ivl; Owner: km_user
--

CREATE VIEW ivl."vwIVLWorkshops" AS
SELECT "tblWorkshops".id, "tblWorkshops".title, "tblWorkshops".link, "tblWorkshops".start_date, "tblWorkshops".end_date, "tblWorkshops".city, "tblWorkshops".state, "tblWorkshops".country FROM public."tblWorkshops";


ALTER TABLE ivl."vwIVLWorkshops" OWNER TO km_user;

--
-- Name: vwAuthorRankedWithContact; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwAuthorRankedWithContact" AS
SELECT b."authorEditorId", b."peopleId", p."fName", p."mName", p."lName", pb.homepage, b."publicationId", b.rank, b.type FROM public."brdgAuthorsEditors" b, public."tblPeople" p, public."vwPeopleBase" pb WHERE (((b.type ~~ 'a'::text) AND (b."peopleId" = p."peopleId")) AND (b."peopleId" = pb."peopleId")) ORDER BY b."publicationId" DESC, b.rank;


ALTER TABLE public."vwAuthorRankedWithContact" OWNER TO km_user;

--
-- Name: vwCoPIsCurrent; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCoPIsCurrent" AS
SELECT DISTINCT b."peopleId" FROM (public."brdgCoPIs" b JOIN public."tblGrants" g USING ("grantId")) WHERE (g."endDate" > now()) ORDER BY b."peopleId";


ALTER TABLE public."vwCoPIsCurrent" OWNER TO km_user;

--
-- Name: VIEW "vwCoPIsCurrent"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwCoPIsCurrent" IS 'peopleIds of current principal investigators';


--
-- Name: vwCoPIsPrevious; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwCoPIsPrevious" AS
(SELECT DISTINCT b."peopleId" FROM (public."brdgCoPIs" b JOIN public."tblGrants" g USING ("grantId")) WHERE (g."endDate" < now()) ORDER BY b."peopleId") EXCEPT SELECT c."peopleId" FROM public."vwCoPIsCurrent" c;


ALTER TABLE public."vwCoPIsPrevious" OWNER TO km_user;

--
-- Name: VIEW "vwCoPIsPrevious"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwCoPIsPrevious" IS 'peopleIds of previous principal investigators';


--
-- Name: vwEditorRankedWithContact; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwEditorRankedWithContact" AS
SELECT b."authorEditorId", b."peopleId", p."fName", p."mName", p."lName", pb.homepage, b."publicationId", b.rank, b.type FROM public."brdgAuthorsEditors" b, public."tblPeople" p, public."vwPeopleBase" pb WHERE (((b.type ~~ 'e'::text) AND (b."peopleId" = p."peopleId")) AND (b."peopleId" = pb."peopleId")) ORDER BY b."publicationId" DESC, b.rank;


ALTER TABLE public."vwEditorRankedWithContact" OWNER TO km_user;

--
-- Name: vwPeopleContactInformation; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwPeopleContactInformation" AS
SELECT "brdgPeopleContactInformation"."contactInformationId", "tblPeople"."peopleId", "tblPeople"."fName", "tblPeople"."mName", "tblPeople"."lName", "tblPeople".ivlweb, "tblPeople".cnsweb, "brdgPeopleContactInformation"."peopleContactInformationId", "brdgPeopleContactInformation".rank, "brdgPeopleContactInformation".type, "tblContactInformation"."contactItem", "tblContactInformation"."contactType" FROM ((public."tblPeople" JOIN public."brdgPeopleContactInformation" USING ("peopleId")) JOIN public."tblContactInformation" USING ("contactInformationId"));


ALTER TABLE public."vwPeopleContactInformation" OWNER TO km_user;

--
-- Name: VIEW "vwPeopleContactInformation"; Type: COMMENT; Schema: public; Owner: km_user
--

COMMENT ON VIEW public."vwPeopleContactInformation" IS 'people with corresponding contact information';


--
-- Name: vwPeopleResidence; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."vwPeopleResidence" AS
SELECT "vwPeopleBase"."peopleId", "vwPeopleBase".name, "tblLocations"."addrLine1", "tblLocations"."addrLine2", "tblLocations".city, "tblLocations"."StateProvince", "tblLocations"."Country", "tblLocations"."zipCode" FROM (public."vwPeopleBase" LEFT JOIN (public."brdgResidence" LEFT JOIN public."tblLocations" USING ("locationId")) USING ("peopleId"));


ALTER TABLE public."vwPeopleResidence" OWNER TO postgres;

--
-- Name: vwTeamLeads; Type: VIEW; Schema: public; Owner: km_user
--

CREATE VIEW public."vwTeamLeads" AS
SELECT b."researchId", array_to_string(public.array_accum(((COALESCE(p.name, ''::text) || '###'::text) || COALESCE((p.homepage)::text, ''::text))), '@@@'::text) AS leadscurrent, p."peopleId", r."shortTitle" FROM ((public."brdgTeamCollabs" b JOIN public."vwWebPeopleBase" p USING ("peopleId")) JOIN public."tblResearch" r USING ("researchId")) WHERE (((b.type)::text = '010'::text) AND ((b."endDate" IS NULL) OR (b."endDate" > now()))) GROUP BY b."researchId", p."peopleId", r."shortTitle";


ALTER TABLE public."vwTeamLeads" OWNER TO km_user;

--
-- Name: vwEventsURLs; Type: VIEW; Schema: temp; Owner: km_user
--

CREATE VIEW temp."vwEventsURLs" AS
SELECT e."eventId", e.title, m."fileNameURL", m.type FROM ((public."brdgMediaCallsEvents" b JOIN public."tblMedia" m USING ("mediumId")) JOIN public."tblCallsEvents" e USING ("eventId")) WHERE (b.rank = 1);


ALTER TABLE temp."vwEventsURLs" OWNER TO km_user;

--
-- Name: vwDebugBryanPresentations; Type: VIEW; Schema: temp; Owner: km_user
--

CREATE VIEW temp."vwDebugBryanPresentations" AS
SELECT b."mediumId", b."mediumPresentationId", b.rank, m."fileNameURL", m.type AS mediumtype, p.title, p.type AS presentationtype FROM ((public."brdgMediaPresentations" b JOIN public."tblMedia" m USING ("mediumId")) JOIN public."tblPresentations" p USING ("presentationId"));


ALTER TABLE temp."vwDebugBryanPresentations" OWNER TO km_user;

--
-- Name: vwEventsURL; Type: VIEW; Schema: temp; Owner: km_user
--

CREATE VIEW temp."vwEventsURL" AS
SELECT e."eventId", e.title, m."fileNameURL", m.type FROM ((public."brdgMediaCallsEvents" b JOIN public."tblMedia" m USING ("mediumId")) JOIN public."tblCallsEvents" e USING ("eventId")) WHERE (b.rank = 1);


ALTER TABLE temp."vwEventsURL" OWNER TO km_user;

--
-- PostgreSQL database dump complete
--

