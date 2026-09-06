# find-leguin-academic-2 — Le Guin, angle: monographs & papers the first sweep never opened
Opus finder, 2026-09-06.

## Route findings (record for the chair)
- **archive.org lending items are BLOCKED for this finder.** All ten named identifiers exist and are `access-restricted-item: true` (collections `inlibrary`/`printdisabled`). `/{dir}/{id}_djvu.txt` returns **HTTP 403**; the search-inside endpoint
  `https://{server}/fulltext/inside.php?item_id=..&doc=..&path=..&q=..` returns an HTML page titled **"Item not available"**. Confirmed on ursulakleguinbey0000cadd; metadata confirmed for all ten.
- **Google Books is BLOCKED both ways.** `books.googleapis.com` returns HTTP 429 "Quota exceeded ... Queries per day"; `google.com/search?tbm=bks` with a browser UA returns the consent/redirect shell (no results); `books.google.com/books?id=..&q=..` 404s.
- **HathiTrust** `babel.hathitrust.org/cgi/ls` returns HTTP 403.
- **WORKING ROUTE (the find of this sweep): the DePauw SFS archive via the Wayback Machine.** The live DePauw SFS pages 404 (the site now redirects to online.ucpress.edu), but Wayback holds raw captures. Recipe:
  1. `https://web.archive.org/cdx/search/cdx?url=depauw.edu/sfs/backissues/7/*&fl=original,timestamp&collapse=urlkey` to enumerate an issue;
  2. `https://archive.org/wayback/available?url=<page>` for a timestamp;
  3. `https://web.archive.org/web/<ts>id_/https://www.depauw.edu/sfs/backissues/7/<name>7art.htm` for raw HTML.
  This opened the **whole SFS #7 (Vol 2 Part 3, Nov 1975) Le Guin special issue** — Jameson, Suvin, Theall, Bierman, Huntington, Barbour, Watson, Nudelman, Porter, and Le Guin's own "American SF and the Other" — plus Slusser's 1991 review essay.
- SFS did **not** put issue #31 (1983) online, so Victoria Myers, "Conversational Technique in Ursula Le Guin: A Speech-Act Analysis" (SFS 10.3, 1983) has no DePauw full text.

## Sources read raw (batch 1)
1. Slusser, SFS #53 (1991) review essay — read in full. "Le Guin gives us precise prose rhythms."
2. Jameson, "World Reduction in Le Guin", SFS #7 — read in full. world-reduction; LHD as "a virtual anthology of narrative strands"; "omission functions as utopian exclusion".
3. Suvin, "Parables of De-Alienation", SFS #7 — read (opening, NA section, closing, abstract). "taut and spare architectural system of narrative cells"; three-sentence closing weight; "stylistic clarity".
4. Theall, "The Art of Social-Science Fiction", SFS #7 — **the richest for the dossier register**: LHD has "the characteristic features of an anthropological report"; outsider distance "allows for the particularly descriptive approach"; "carefully chosen and believable details".
5. Bierman, "Ambiguity in Utopia", SFS #7 — "the sententiae that are her style"; but "Le Guin is rarely a simple, straightforward storyteller" (counter-evidence on plainness).
6. Huntington, SFS #7 — Karhide "realized with a detail and with a care for the way politics works in this archaic system".
7. Barbour, "Wholeness and Balance: An Addendum", SFS #7 — the wall image on the first page.
8. Le Guin, "American SF and the Other", SFS #7 — own words: "Where are the poor, the people who work hard"; "They are masses, existing for one purpose: to be led".
9. Watson, SFS #7 — "a neural simile".
10. Nudelman, SFS #7 — "thorough iconicity".
11. Porter, SFS #7 — read; political, nothing on prose. Non-substantive for this angle.
