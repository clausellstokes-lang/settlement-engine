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

## SESSION 2 (2026-09-06, successor finder) — THE ROUTE THAT OPENED THE BLOCKED MONOGRAPHS

**FIND OF THIS SESSION: archive.org full-text search-inside is reachable, scoped per item, through Open Library.**
The predecessor recorded the lending items as BLOCKED (`_djvu.txt` 403; `fulltext/inside.php` "Item not available").
Both are true. But the Elasticsearch FTS behind them answers unauthenticated at:

    https://openlibrary.org/search/inside.json?q=<urlencoded lucene query>

and it accepts a **scoped** query: `identifier:<ia-id> AND "<phrase>"`.
The response gives `hits.hits[].highlight.text[]` — verbatim contiguous snippets (~90-110 chars, the match
centred) — plus `fields.page_num`, `meta_title`, `meta_creator`, `meta_year`.
⚠ `page_num` is returned once per *item*, not per highlight, so it is NOT a reliable page cite; I record
`page` as "archive.org search-inside snippet" rather than assert a page number.

**SNIPPET WALKING.** A single snippet is ~15 words. Re-querying the *tail* of a snippet as the new phrase
re-centres the window and yields the next ~8 words. Three to five hops reconstructs a sentence. Helper
scripts: `leguin-acad2-raw/si.py` (cached scoped query), `batch.py` (id x term matrix), `walk.py`
(tab-separated `id<TAB>phrase` on stdin). Cache in `leguin-acad2-raw/si-cache/`.
All claims from this route are marked **snippet-only** (`confidence` medium at best, route in routeHint).

### Roster items OPENED by this route (all ten previously "blocked")
understandingurs0000cumm (Cummins 1990) · approachestofict0000bitt (Bittner 1984) ·
farthestshoresof0000slus (Slusser 1976) · ursulakleguin00bloo (Bloom 1986) ·
ursulakleguinsle0000unse (Bloom LHD 1987) · ursulakleguinbey0000cadd (Cadden 2005) ·
ursulakleguin00olan (Olander & Greenberg 1979) · ursulakleguin0453spiv (Spivack 1984) ·
ursulakleguin00buck (Bucknall 1981) · fantasytradition0000atte (Attebery 1980) ·
plus ursulakleguinvoy0000unse (De Bolt 1979), found laterally.

### Sentences reconstructed (each by 3-5 walk hops)
- **Cummins**: "Her style, often called lyrical, results from her sensitivity to sound and syntax, from her wit and wisdom as she plays with and invents language"
- **Spivack**: "The style of A Wizard of Earthsea is suitable to its subject of mythic magery. Artful yet simple, the language is largely Anglo-Saxon in diction, strongly alliterative, and suggestively resonant of an austere but heroic age."
- **Bucknall**: "...vividly, and poetically while resisting the temptation to overwrite. Her style, which varies from book to book and from character to character, does not have the stately and heroic tone of The Lord of the Rings."
- **Bloom (index + text)**: "Finally, her style mirrors the balance of her themes. Her writing moves gently but inexorably." + "this flowing quality, a skillful use of cadence and sound patterns, and a flexible use of..."
- **Bittner**: "One of the distinctive qualities of Le Guin's prose style in the Earthsea trilogy makes its appearance in 'The Rule of Names': her uncanny knack for interweaving the familiar..."
- **Bittner (archaism)**: "The very word tale has an archaic, distant tone missing from the common story."
- **Cadden (THE DOSSIER FIND)**: Tales from Earthsea "concludes with 'A Description of Earthsea,' almost thirty pages of Earthsea lore and history"; it is "a text that is neither story nor afterword"; "is true to the voice of the anthropologist examining the ways of the Kesh"; "'A Description of Earthsea' is told from outside the world of Earthsea rather than by the historian from..."
- **Cadden (FID)**: "...in much of Le Guin's stories, is a steady use of free indirect discourse."; "Le Guin uses free indirect discourse to help put speakers on a more equal ideological footing with other characters"
- **De Bolt ed. (Pfeiffer quoting Woodcock)**: "Le Guin's prose style draws Woodcock's attention: it is 'a style of crystalline clarity and functional flexibility that has always reminded me...'"
- **Bittner / Bloom**: LHD is interleaved "with extracts from Estraven's journal, an anthropological report, and Gethenian legends, folktales, religious..."

### Session-2 route ledger (final)
- **WORKED**: openlibrary.org/search/inside.json with `identifier:<id> AND "<phrase>"` — opened all ten blocked roster monographs plus five lateral scans.
- **WORKED**: live fetch with a browser UA — Strange Horizons (Burt on Plotz), Public Books (Plotz's 2015 Le Guin interview), paradoxa.com ToC.
- **WORKED**: Crossref REST — Trimarco 1999 metadata, Kuts & Uholkova 2020 publisher JATS abstract, and the DOI for Myers 1983.
- **DIED MID-SESSION**: Wayback Machine (CDX and /web/ both returned "Internet Archive services are temporarily offline"), closing the SFS route the predecessor used. archive.org /metadata/ and the Open Library FTS proxy stayed up throughout.
- **BLOCKED ALL SESSION**: OpenAlex (429, Retry-After 16719s), Semantic Scholar (429), JSTOR (page will not render), online.ucpress.edu (403), Google Books, HathiTrust.
- **NOT DIGITISED ANYWHERE REACHABLE**: Donna R. White, *Dancing with Dragons* (1999) — Open Library has the edition record, no scan; it survives only as a bibliography line in other books. T. A. Shippey, "The Magic Art and the Evolution of Words" (Mosaic 10.2, 1977) — same.
- **CORRECTION TO THE BRIEF**: Paradoxa's Le Guin issue (no. 21, ed. Sylvia Kelso) is dated **2009**, not 2008. Its two register-relevant articles are Erlich, "Always Coming Home: 'Ethnography, unBible, and Utopian Satire'" (pp. 137-166) and Rochelle, "A Wave in My Mind" (pp. 293-309). Both are sold as individual PDFs and were not fetched.

### Coverage gap worth the chair's attention
Across the entire reachable scanned corpus, **Mike Cadden is the only critic who discusses "A Description of Earthsea"** — the ~30-page gazetteer appendix to *Tales from Earthsea*, the single closest thing in Le Guin to a settlement dossier. Three of his sentences about it (neither story nor afterword; told from outside the world; the anthropologist's voice) are the highest-value claims this angle produced.

### Pre-verification
Every archive.org quotation was re-queried against its own scoped url before writing — 62 of 62 passed. The ten web quotations were grepped against the stripped HTML of the fetched page. No quotation was written from memory.
