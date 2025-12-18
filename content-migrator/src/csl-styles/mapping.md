
| Your field       | CSL field       | Explanation                                      |
| ---------------- | --------------- | ------------------------------------------------ |
| title            | title           | Direct match.                                    |
| authors          | author          | CSL expects an array of person objects.          |
| editors          | editor          | Standard CSL contributor role.                   |
| doi              | DOI             | CSL variable is uppercase `"DOI"`.               |
| pmid             | PMID            | CSL supports `"PMID"` as an identifier variable. |
| date             | issued          | Main publication date.                           |
| publisher        | publisher       | Direct match.                                    |
| publicationVenue | container-title | Used for journals, books, proceedings, etc.      |
| venueVolume      | volume          | Direct match.                                    |
| venueNumber      | issue           | The CSL field for issue/number.                  |
| venuePages       | page            | Page or page range.                              |
| venueChapter     | chapter-number  | Closest CSL variable for chapter enumeration.    |
