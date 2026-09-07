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
