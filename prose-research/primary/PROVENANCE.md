# PROVENANCE — lane PRIMARY-SAMPLES (2026-09-05)

Raw text lives ONLY in `primary/raw/` and must never enter a git ref. Everything below the raw
directory is derived numbers. `robots.txt` checked for every host fetched; none of the fetched
paths is disallowed (georgerrmartin.com disallows only `/wp-admin/`; tolkienestate.com has
`Disallow:` empty with `Crawl-delay: 10`; the two media hosts serve no robots.txt).

## Fetched sources

| # | source | URL | terms as stated on the page/file | fetched | raw file | prose words kept |
|---|--------|-----|----------------------------------|---------|----------|------------------|
| 1 | Martin — *The Winds of Winter*, "Arianne" sample chapter, posted by the author on his own official site | https://georgerrmartin.com/excerpt-from-the-winds-of-winter/ | no licence line; publicly posted sample on the author's own domain | 2026-09-05 | `grrm_wow_excerpt.html` → `martin_narrative.txt` | 5,664 |
| 2 | Martin — unabridged westerlands history (source text behind *The World of Ice & Fire*), posted by the author on his own official site | https://georgerrmartin.com/world-of-ice-and-fire-sample/ | page carries "Copyright c 2015 by George R.R. Martin." and notes an abridged version appeared in the 2014 book | 2026-09-05 | `grrmpost_world-of-ice-and-fire-sample.html` → `martin_chronicle.txt` | 12,422 |
| 3 | Tolkien — six letters published in full by the Tolkien Estate (Waldman 1951; Auden 7 Jun 1955; Rhona Beare Oct 1958; Eileen Elgar Sep 1963; Christopher Bretherton 16 Jul 1964; Carole Batten-Phelps autumn 1971) | https://www.tolkienestate.com/letters/… (six pages) | "© THE TOLKIEN ESTATE LIMITED 2025"; official estate site | 2026-09-05 | `te_letters_*.html` → `tolkien_elevated.txt` | 15,093 |
| 4 | Tolkien — six letters, domestic/business register (Michael 6–8 Mar 1941; Christopher 30 Apr 1944; Christopher 30 Jan 1945; Priscilla 26 Nov 1963; Michael 1967–68; Stanley Unwin 16 Dec 1937) | https://www.tolkienestate.com/letters/… (six pages) | as above | 2026-09-05 | `te_letters_*.html` → `tolkien_plain.txt` | 4,503 |
| 5 | D&D — System Reference Document 5.2.1, pp. 5–18 ("Playing the Game" through "Temporary Hit Points") | https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf | file p. 1: provided free by Wizards of the Coast under **CC-BY-4.0** | 2026-09-05 | `SRD_CC_v5.2.1.pdf` → `dnd_rules_srd.txt` | 6,366 |
| 6 | D&D — Basic Rules v1.0 (2018 printing), pp. 60–81 (Using Ability Scores / Adventuring / Combat) | https://media.wizards.com/2018/dnd/downloads/DnD_BasicRules_2018.pdf | every page: "D&D Basic Rules (Version 1.0). Not for resale. Permission granted to print and photocopy this document for personal use only." Free official download. | 2026-09-05 | `DnD_BasicRules_2018.pdf` → `dnd_rules_basic.txt` | 14,692 |
| 7 | D&D — Basic Rules v1.0, pp. 3–7 (Introduction, incl. the read-aloud sample), 13–21 (Races), 172–176 (Gods of the Multiverse, Factions) | as #6 | as #6 | 2026-09-05 | `DnD_BasicRules_2018.pdf` → `dnd_flavor_basic.txt` | 11,483 |
| C | CONTROL — the estate's own state corpus, fingerprinted by an earlier lane | `$SC/prose-research/estate-state.txt` | internal | — | — | 48,798 |

Total exemplar prose measured: **70,223 words** (Martin 18,086 · Tolkien 19,596 · D&D 32,541).

## Fetched and rejected

| source | why rejected |
|--------|--------------|
| `reactormag.com/read-a-chapter-from-the-winds-of-winter/` | the page carries no chapter body — it is a pointer post; 0 words of Martin prose |
| `penguinrandomhouse.com/books/108336/…` (and the `/excerpt` path) | the "Read an Excerpt" module is JS-loaded; no excerpt text in the served HTML, no reachable JSON route |
| `georgerrmartin.com/grrm_book/*` | jacket/marketing copy, not authorial prose |
| `georgerrmartin.com/wild-cards-excerpt/` (7,158 w) | prose is by John Jos. Miller, not Martin |
| `georgerrmartin.com/excerpt-the-armageddon-rag/` | body is a dead `InsightBookReader` widget pointing at a retired randomhouse.com CGI; 8 words served |
| `tolkienestate.com/writing/*`, `tolkienestate.com/` | commentary by others; the Tolkien narration quoted across all such pages totals **523 words** — far too little to fingerprint |
| `tolkien.co.uk` (HarperCollins) | product previews are behind a JS preview-config client; no extract in served HTML |

## Tooling deviation

`pdftotext` is **not installed** on this machine (`pdftotext: command not found`; no `mutool`, `qpdf`,
`gs`, or `pdftk` either). The brief's fallback is "a node PDF-to-text route or skip". I used the
equivalent Python route instead — `pypdf 6.14.2`, already present in system `python3` — via
`primary/pdf2txt.py`. Extraction is `PdfReader.pages[i].extract_text()` with a `<<<PAGE n>>>`
marker per page so the page-range cuts below are exactly re-derivable.

## Cut scripts (all under `primary/`, re-runnable)

- `pdf2txt.py <pdf> <out>` — page-marked text dump.
- `cut_pdf.py <pagetxt> <out> <pageRanges> <minWords>` — drops running heads, bare page numbers,
  headings (≤48 chars, no terminal sentence punctuation, ≥50% of words capitalised), bullets,
  TOC dot-leaders, stat-block lines, blocks with >3% digit density or >1 dice expression, and
  blocks not ending in a full stop. De-hyphenates the two-column `word -\nrest` artefact.
  Prints every drop count.
- `cut_html.py <out> <minWords> <html…>` — `<p>` extraction; drops the estate's leading pull-quote
  (a verbatim duplicate of body text), site boilerplate, and paragraphs under `minWords`
  (headings, salutations, sign-offs). Prints every drop count.
- `table.mjs <fingerprint…>` — renders the comparison table.

Drop counts, as printed at cut time:

```
dnd_rules_srd.txt    14 pages  127 paras  6366 w  dropped {nofullstop:9, short:61, numeric:7, bullet:1, statblock:17, nonprose:6, dice:1}
dnd_rules_basic.txt  22 pages  289 paras 14692 w  dropped {numeric:10, short:86, nonprose:9, nofullstop:10, bullet:10, statblock:4, dice:1}
dnd_flavor_basic.txt 19 pages  182 paras 11483 w  dropped {short:77, nofullstop:17, numeric:3, statblock:1, nonprose:2, bullet:1}
martin_narrative.txt  1 src     90 paras  5664 w  dropped {short:42, boilerplate:2}
martin_chronicle.txt  1 src    141 paras 12422 w  dropped {boilerplate:3, short:6}
tolkien_elevated.txt  6 srcs   103 paras 15093 w  dropped {pullquote:6, short:8, boilerplate:12}
tolkien_plain.txt     6 srcs    23 paras  4503 w  dropped {pullquote:6, short:10, boilerplate:12}
```

---

# APPENDED 2026-09-06 — lane S6B-LEGUIN-FINGERPRINT (Le Guin column)

`primary/raw/` was empty on arrival: the 09-05 raw texts died with the reboot, and the cut scripts
this file documents (`cut_html.py`, `cut_pdf.py`, `pdf2txt.py`, `table.mjs`) died with them. Nothing
above was edited. The Le Guin raw files below are new; equivalents of the lost scripts were
re-written under `$SC/s6b-scratch/` (`cut_html.py`, `pdf2txt.py`, `build_corpora.py`, `table.py`).

⛔ **Two sources named in the lane brief are refused by robots.txt, by name.**
`www.ursulakleguin.com/robots.txt` puts `anthropic-ai` and `ClaudeBot` in a 27-agent group
terminated by `Disallow: /` — the whole official site, essays and blog alike. `www.arts.gov`
(the NEA Big Read's host; `www.neabigread.org` no longer resolves) carries `# AI Bots` /
`User-agent: ClaudeBot` / `Disallow: /`. `www.theguardian.com` bars `anthropic-ai`, `ClaudeBot`,
`Claude-SearchBot` and `Claude-User` the same way. **No byte of page content was fetched from any
of the three.** Substitutes below are hosts whose robots.txt names no Anthropic agent and which
published Le Guin's prose themselves, with permission.

## Fetched sources (Le Guin)

| # | source | URL | terms as stated on the page/file | fetched | raw file | prose words kept |
|---|--------|-----|----------------------------------|---------|----------|------------------|
| 8 | Le Guin — *Steering the Craft* (21st-century edition), chapter one, posted as a publisher excerpt | https://lithub.com/a-writing-lesson-from-ursula-k-leguin/ | page states the piece is the book's "first chapter", the updated edition "available now from Houghton Mifflin Harcourt" | 2026-09-06 | `leguin-lithub-a-writing-lesson.html` → `leguin_nonfiction_written.txt` | 1,301 |
| 9 | Le Guin — "How to Become a Writer" (essay) | https://lithub.com/ursula-k-le-guin-on-how-to-become-a-writer/ | page states it first appeared in Lit Hub's Craft of Writing newsletter; no other licence line | 2026-09-06 | `leguin-lithub-how-to-become-a-writer.html` → `leguin_nonfiction_written.txt` | 1,383 |
| 10 | Le Guin — "Who Cares About the Great American Novel", essay from *No Time to Spare* | https://lithub.com/ursula-k-le-guin-who-cares-about-the-great-american-novel/ | credit line on the page: "Used with permission of Houghton Mifflin Harcourt. Copyright © 2017 by Ursula K. Le Guin." | 2026-09-06 | `leguin-lithub-great-american-novel.html` → `leguin_nonfiction_written.txt` | 1,020 |
| 11 | Le Guin — essay on utopia and dystopia (yin/yang) | https://electricliterature.com/ursula-k-le-guin-explains-how-to-build-a-new-kind-of-utopia/ | no licence line; piece published under her byline by Electric Literature | 2026-09-06 | `leguin-el-utopia.html` → `leguin_nonfiction_written.txt` | 791 |
| 12 | Le Guin — open letter, "I Keep Asking You Not to Buy Books from Amazon" | https://electricliterature.com/ursula-k-le-guin-i-keep-asking-you-not-to-buy-books-from-amazon/ | no licence line; her letter quoted at length by Electric Literature, editor's commentary excluded from the cut | 2026-09-06 | `leguin-el-amazon.html` → `leguin_nonfiction_written.txt` | 281 |
| 13 | Le Guin — interview by Euan Monaghan, **her answers only** | https://lithub.com/ursula-k-le-guin-on-racism-anarchy-and-hearing-her-characters-speak/ | page states "This interview originally appeared in Issue 14 of Structo Magazine." | 2026-09-06 | `leguin-lithub-racism-anarchy.html` → `leguin_nonfiction_spoken.txt` | 3,063 |
| 14 | Le Guin — interview by David Naimon, **her answers only** | https://lithub.com/ursula-k-le-guin-dictators-are-always-afraid-of-poets/ | credit line: "From *Ursula K. Le Guin: Conversations on Writing*. Used with permission of Tin House Books." | 2026-09-06 | `leguin-lithub-dictators-poets.html` → `leguin_nonfiction_spoken.txt` | 1,874 |
| 15 | Le Guin — "The Ones Who Walk Away from Omelas" (full story), course reading of **UC Davis ECS 088, "Ethics of Technology", Prof. Patrice Koehl** | https://www.cs.ucdavis.edu/~koehl/Teaching/ECS088/PDF_files/Omelas.pdf | PDF header credits *The Wind's Twelve Quarters: Short Stories* by Ursula Le Guin; no other licence line; the syllabus at `.../ECS088/index.html` carries the course's Home/Lectures/Term-paper/Reader navigation | 2026-09-06 | `leguin-omelas-ucdavis.pdf` → `leguin-omelas-ucdavis.pagetxt` → `leguin_fiction.txt` | 2,822 |

`robots.txt` read before every fetch: `lithub.com` (only wp paths, `*?s=*`, `/search/*`; `crawl-delay: 10`,
honoured with a 10 s inter-request delay), `electricliterature.com` (wc-logs/woocommerce/add-to-cart/wp-admin,
then a Yoast block with an empty `Disallow:`), `www.cs.ucdavis.edu` (`/wp-admin/` only). None names an AI agent.

A further 20 editorial bracket spans (`[Laughs]`, `[Pause]`, glosses) were stripped from the two
interviews — the transcriber's words, not hers — which is why the built corpora total 9,670
nonfiction words rather than 9,713.

**Le Guin prose measured: 12,492 words** (nonfiction 9,670 — written 4,776 + spoken 4,894 — plus
fiction 2,822).

## Fetched and rejected (Le Guin)

| source | why rejected |
|--------|--------------|
| `www.ursulakleguin.com` (the official site: essays + blog archive) | **robots.txt disallows `anthropic-ai` and `ClaudeBot` for `/`**; not fetched |
| `www.arts.gov` (NEA Big Read Earthsea guides) | **robots.txt `# AI Bots` block disallows `ClaudeBot` for `/`**; not fetched. `www.neabigread.org` does not resolve (curl exit 6) |
| `www.theguardian.com` | **robots.txt disallows `anthropic-ai`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User` for `/`**; not fetched |
| `www.theparisreview.org/interviews/6253/…` (The Art of Fiction No. 221) | robots permits, but the host returns **http 403** behind Cloudflare ("Attention Required!"); the kit's `sweep/parisreview-leguin.txt` is that same interstitial, not the interview |
| `w3.ric.edu/faculty/rpotter/temp/waaaod.pdf` ("Why Are Americans Afraid of Dragons?") | host refuses the connection on http and https (`curl: (52) Empty reply from server`), so even `robots.txt` could not be read |
| `bookviewcafe.com/blog/ursula-k-le-guins-blog/` | **http 404** — BVC permits crawling and was her blog's original home, but the posts are gone; its sitemap's 14 "guin" entries are BVC news items about her, not her prose |
| `sweep/leguin1973.txt` ("From Elfland to Poughkeepsie", 5,106 w, already in the kit) | no traceable provenance row anywhere in the kit, and the only reachable full texts are on the robots-refused official site or on document lockers; **and it is specimen-contaminated** — the essay quotes Dunsany, Eddison, Tolkien and Kurtz at length, so a naive fingerprint of it measures four other authors |
| `scribd.com`, `pdfcoffee.com`, `are.na`, `monoskop.org`, `coursehero.com`, `academia.edu`, `researchgate.net`, `docs.google.com`, `shsdavisapes.pbworks.com` | document lockers / scan mirrors / non-`.edu` wikis; not fetched |
| `lithub.com/ursula-k-le-guins-best-life-advice/`, `…/ursula-k-le-guin-editing-to-the-end/`, `…/this-1998-advice-…-gender-neutral-language…/` | fetched (http 200) but the body is a LitHub or David Naimon **third-party** essay around short quotations — not her connected prose |
| LitHub/EL poem posts (`two-poems-by-…`, `equinox-75-…`, `a-poem-…-about-cats`, `three-new-poems-…`), and the `watch-…`/`listen-…` video posts | verse or media, not prose |
| `storyoftheweek.loa.org` | sitemap carries no Le Guin entry |

## Tooling note (Le Guin rows)

Fingerprints produced from `primary/` exactly as the earlier labels were:
`node ../fingerprint.mjs <label> <absolute raw path…>`, five labels —
`leguin-nonfiction`, `leguin-nonfiction-written`, `leguin-nonfiction-spoken`, `leguin-fiction`,
`leguin-all` (nonfiction + fiction). The two `-written` / `-spoken` labels are diagnostics: 4,894 of
the 9,670 nonfiction words are transcribed speech, and a written/spoken mixture is a register
mixture. Cut counts, as printed at cut time:

```
leguin_nonfiction_written.txt  5 srcs   81 paras  4776 w  (specimens by Kipling/Twain/Hurston/Gloss 1095 w, quotations of Hamid and Tolstoy, LitHub/EL frames, bios, affiliate lines all dropped)
leguin_nonfiction_spoken.txt   2 srcs   74 paras  4894 w  (every interviewer turn, both intros, an Earthsea epigraph, 3 duplicated pull-quotes and 20 bracket spans dropped)
leguin_nonfiction.txt          7 srcs  155 paras  9670 w
leguin_fiction.txt             1 src    16 paras  2822 w  (4 page markers, 3 title/credit lines dropped)
```
