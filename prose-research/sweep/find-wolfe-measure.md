# find-wolfe-measure — raw notes (Opus finder, MEASURE angle)
Started 2026-09-06 ~14:55. Angle: put numbers on Wolfe's prose (the sweep has none) + find any existing stylometric / corpus work on Wolfe.

## Method for the four samples (must be reproducible by the verifier)
Raw HTML fetched with curl + a desktop Chrome UA; paragraph text extracted with a local HTMLParser-free regex strip (`extract.py`: `<p>…</p>` bodies, tags removed, entities unescaped, paragraphs of <5 words dropped). Site chrome removed by taking only the excerpt body line range (recorded per sample below). The first WHOLE sentences up to >= 2,000 words are the sample. **No excerpt text is kept**: the raw HTML and extracted text are deleted after the numbers are derived; only `metrics-out.json` / `metrics-narration.json` survive.

Operational definitions (state these with every figure — they are not standard):
- **sentence**: split on `[.!?…]` + optional closing quote/bracket + whitespace, after neutralising a fixed abbreviation list (Mr/Mrs/Dr/St/…). Chapter headings count as a sentence.
- **word**: `[A-Za-z][A-Za-z'’-]*`.
- **subordinate-clause depth proxy**: count per sentence of finite-clause subordinators and relativizers — that, which, who, whom, whose, because, although, though, while, whilst, when, whenever, where, wherever, whereas, if, unless, until, till, since, before, after, than, whether, lest. This is a MARKER COUNT, not a parse depth; report it as such.
- **parenthetical**: sentence containing `(`, an em dash `—` or an en dash `–`. Reported split (parentheses / dash) and combined.
- **dialogue tag**: a sentence containing a double quotation mark AND one of a fixed speech-verb list (said, asked, replied, told, cried, whispered, murmured, shouted, muttered, added, began, continued, demanded, inquired, repeated, explained, remarked, observed, returned).
- **rare-word rate**: share of lowercased alphabetic tokens absent from the `first20hours/google-10000-english` USA list, reported at the top-5,000 and top-10,000 cut. `out_of_dictionary_rate` = absent from BOTH that list and `/usr/share/dict/web2` (Webster's 2nd, 235k headwords) — this is the coinage + proper-noun rate.
- A second pass drops every sentence containing a quotation mark (**narration-only**) because dialogue share differs wildly across the four books and would otherwise drive the whole sentence-length trend.

## Roster (named by the angle) — status
1. Reactor/Tor.com excerpt, *The Shadow of the Torturer* ch. 1 — **NOT the route that worked**. Reactor has analysis pieces, not a ch.1 excerpt. The legally hosted ch.1 excerpt is Tor/Forge Blog, "Excerpt: Shadow & Claw", 2021-06-07. Live URL 403s from here; **Wayback raw capture 20240715194845 worked** (49,774 bytes, opening line present).
2. Reactor/Tor.com excerpt, *The Land Across* — **FETCHED live** at https://reactormag.com/the-land-across-excerpt-gene-wolfe/ (200, 375,361 bytes). The tor.com/2013/10/22/… URL 302s to reactormag and then 403s; the slug-only reactormag URL is the working route.
3. Reactor/Tor.com excerpt, *A Borrowed Man* — **FETCHED live** at https://reactormag.com/excerpts-a-borrowed-man-gene-wolfe/ (200, 357,694 bytes).
4. Google Books web preview, *The Fifth Head of Cerberus* (vol id `zn40b5Sg7lUC`) — **BLOCKED for measurement**. The preview page returns 200 but carries no body text (page images only; no occurrence of "brother David"); the Books API v1 volume endpoint returned 429. **Substitute found and used**: Tor/Forge Blog, "Excerpt Reveal: The Fifth Head of Cerberus", 2022-09-07 — live 403, **Wayback raw capture 20260315150230 worked** (44,085 bytes). This is the 1972 text reprinted for the 2022 Tor Essentials edition.
5. *Peace* p. 15 as quoted by Tree Slices — **FETCHED live** (200, 121,921 bytes). Two long sentences quoted; measured as two data points, not a sample.

⚠ The angle names periods "1972 / 1980 / 2004 / 2015" but the four named samples are 1972, 1980, **2013** (The Land Across) and 2015. There is no 2004 sample in the named roster; I report the actual years. (No legally hosted excerpt of The Knight / The Wizard, 2004, was found; Macmillan and Tor Publishing Group product pages 403 from here.)

## Body line ranges used (in the extracted text, for re-derivation)
- fifthhead.txt lines 9–57 (line 8 is "Please enjoy this free excerpt…", line 58 is the copyright line)
- shadowclaw-wb.txt lines 9–114 (line 115 is "Copyright © Gene Wolfe 2021")
- landacross.txt lines 15–228 (lines 13–14 are the publisher blurb; line 229 is the copyright line)
- borrowedman.txt lines 16–199 (line 16 is the chapter head "1 From the Spice Grove Public Library"; line 200 is the copyright line)

## THE NUMBERS (all-sentence pass, first ~2,000 words)

| | 1972 5HC | 1980 Shadow ch.1 | 2013 Land Across | 2015 Borrowed Man |
|---|---|---|---|---|
| sentences / words | 62 / 2005 | 146 / 2007 | 139 / 2002 | 184 / 2013 |
| mean sentence (words) | 32.34 | 13.75 | 14.40 | 10.94 |
| SD | 18.18 | 10.66 | 8.20 | 7.20 |
| CV (SD/mean) | 0.562 | 0.776 | 0.570 | 0.658 |
| median | 28.0 | 10.5 | 13 | 9.0 |
| longest | 82 | 67 | 43 | 36 |
| % sentences > 40 w | 29.0 | 2.7 | 1.4 | 0.0 |
| % sentences < 8 w | 8.1 | 37.0 | 20.1 | 37.0 |
| subord. markers / sentence | 1.55 | 0.40 | 0.58 | 0.50 |
| subord. markers / 100 w | 4.79 | 2.94 | 4.00 | 4.57 |
| % sentences w/ parentheses | 11.3 | 2.7 | 3.6 | 0.0 |
| % sentences w/ dash | 11.3 | 2.7 | 0.0 | 2.2 |
| % sentences w/ any parenthetical | 21.0 | 4.1 | 3.6 | 2.2 |
| % sentences carrying quoted speech | 1.6 | 34.2 | 5.0 | 26.6 |
| % of quoted sentences w/ speech verb | 0.0 | 34.0 | 57.1 | 20.4 |
| tagged-speech sentences / 1000 w | 0.00 | 8.47 | 2.00 | 4.97 |
| rare rate (outside top 5,000) | 16.61% | 17.64% | 11.99% | 9.69% |
| rare rate (outside top 10,000) | 10.67% | 13.00% | 8.34% | 6.11% |
| out-of-dictionary (coinage+proper) | 4.19% | 5.83% | 3.75% | 3.28% |
| tokens ≥ 9 chars | 5.94% | 4.78% | 2.80% | 4.02% |
| hapax share of tokens | 27.58% | 25.01% | 19.13% | 19.27% |

## NARRATION ONLY (every sentence containing a quotation mark dropped, first ~2,000 words)

| | 1972 5HC | 1980 Shadow ch.1 | 2013 Land Across | 2015 Borrowed Man |
|---|---|---|---|---|
| sentences / words | 62 / 2045 | 118 / 2039 | 137 / 2002 | 183 / 2011 |
| available narration words in excerpt | 3525 | 5710 | 5879 | 3237 |
| mean sentence (words) | 32.98 | 17.28 | 14.61 | 10.99 |
| SD | 19.32 | 13.30 | 8.15 | 7.21 |
| CV | 0.586 | 0.769 | 0.558 | 0.656 |
| median | 28.0 | 13.5 | 13 | 9 |
| % > 40 w | 29.0 | 5.1 | 1.5 | 0.0 |
| subord. markers / sentence | 1.61 | 0.57 | 0.59 | 0.46 |
| % w/ any parenthetical | 22.6 | 7.6 | 3.6 | 2.2 |
| rare rate (outside top 5,000) | 17.41% | 18.05% | 11.89% | 11.04% |
| rare rate (outside top 10,000) | 11.44% | 12.95% | 8.24% | 6.76% |
| out-of-dictionary | 4.65% | 5.69% | 3.60% | 3.88% |

**Headline**: narration-only mean sentence length falls monotonically 32.98 → 17.28 → 14.61 → 10.99 words across 1972 → 1980 → 2013 → 2015; the parenthetical share falls with it (22.6% → 7.6% → 3.6% → 2.2%); the rare-word rate holds at 1972 levels in 1980 (17.41% → 18.05% outside the top 5,000) and only then falls (11.89%, 11.04%). So the late plain style is a SYNTACTIC simplification that arrives with, but is not the same event as, the lexical one — Severian's book is Wolfe's most word-rare sample and one of his shortest-sentenced narrations at the same time.

**Burstiness**: the 1980 Severian narration has the HIGHEST coefficient of variation of the four (0.769 narration-only, 0.776 all-sentence) — short sentences beside a 67-word one. The 1972 novella is long AND even (CV 0.586); the 2013 travel-writer voice is the flattest (CV 0.558).

## Peace (1975) — two sentences from p. 15 as quoted by a reader (Tree Slices, 2016-08-20)
- Sentence A: 56 words, 5 commas, 1 parenthesis, 1 dash.
- Sentence B: 181 words, 16 commas, 2 parentheses, 3 dashes.
The blogger's own frame: she had to read sentence A "nearly ten times" before grasping it. Treat as a READER's selection of extremes, not a sample — she chose them precisely because they are long.

## Existing stylometry on Wolfe — search log
(see below, appended as searched)

## FIFTH SAMPLE (added to test the trend): Interlibrary Loan, 2020
Tor/Forge Blog, "Excerpt: Interlibrary Loan", 2020-05-08; live 403, Wayback raw capture 20260114144551 (28,337 bytes). Body = ill.txt lines 8-38 (line 39 is "Copyright (c) 2020 by Gene Wolfe"). Only 1,663 words of body exist, so the sample is the whole excerpt, not a 2,000-word slice.

All sentences: 113 sentences / 1,663 words; mean 14.72, SD 12.35, CV 0.839, median 11, longest 67; 2.7% over 40 w; 37.2% under 8 w; 0.67 subordinate markers per sentence; 6.2% with a parenthetical; 16.8% carry quoted speech; rare rate 12.63% / 8.72%; out-of-dictionary 4.21%.
Narration only: 94 sentences / 1,500 words; **mean 15.96**, SD 12.58, CV 0.788, median 12.0; 7.4% with a parenthetical; rare rate 12.20% / 8.13%.

## The trend, tested (narration-only sentence lengths, Welch two-sample t)
| pair | difference in mean words | SE | Welch t |
|---|---|---|---|
| 1972 5HC vs 1980 Shadow | 15.70 | 2.76 | **5.68** |
| 1980 Shadow vs 2013 Land Across | 2.67 | 1.41 | 1.89 (not significant) |
| 2013 Land Across vs 2015 Borrowed Man | 3.62 | 0.88 | **4.12** |
| 2015 Borrowed Man vs 2020 Interlibrary Loan | **-4.97** | 1.41 | **-3.52** |

⛔ **The monotone story is wrong once a fifth sample is added.** The one large, decisive shift is 1972 -> 1980 (a fall of 15.7 words per sentence). After 1980 the level sits in a 11-17 word band and moves both ways: the SAME narrator (E. A. Smithe) is 10.99 words per sentence in 2015 and 15.96 in 2020, a significant RISE. Report the 1972->1980 shift as the finding; report the post-1980 numbers as a band with book-to-book noise of about +/- 5 words, not a career decline.

## Existing stylometry on Wolfe — SEARCH LOG (the answer is: there is none)
- **OpenAlex** (api.openalex.org, 2026-09-06): `gene wolfe stylometry` -> 3 works, none about Gene Wolfe (Shakespeare authorship clustering, a Spanish NLP corpus, a DH social-network poster). `gene wolfe stylistics corpus` -> 14, none about him. `"Gene Wolfe" sentence length` -> 14; the only on-topic item is a 2019 Lund student thesis. `gene wolfe authorship attribution`, `gene wolfe readability prose`, `gene wolfe computational literary` -> nothing about him. **No stylometric or corpus study of Gene Wolfe exists in OpenAlex.**
- **Google Scholar** (live HTML, desktop UA, 2026-09-06): `"Gene Wolfe" stylometry` -> the page literally reads *Your search - "Gene Wolfe" stylometry - did not match any articles*. `"Gene Wolfe" "sentence length"` -> 3 hits, all writing-craft handbooks (Kress, *Magic Words Magic Worlds*, a Teach Yourself guide), none a study of Wolfe. `"Gene Wolfe" corpus stylistics`, `"Gene Wolfe" computational stylistics`, `"Gene Wolfe" quantitative prose style` -> the only quantitative item is Nichols, Lynn & Purzycki 2014, whose corpus **does not contain Gene Wolfe** (0 occurrences of "wolfe" in the full draft text).
- **Crossref** (api.crossref.org): `Gene Wolfe stylometry` returns only interviews and introductions; no quantitative item.
- **Semantic Scholar** graph API: 429 on every attempt (rate-limited, no key). Route recorded as blocked.
- **MLA International Bibliography**: subscription-gated; the public mla.org page carries no search. Not searchable from here — logged as blocked.
- **Lateral**: `"Gene Wolfe" "words per sentence" / "average sentence"` returns only calculator sites and unrelated arXiv papers. Two consecutive searches surfaced nothing new -> stop condition met.
- Wright himself frames the field this way in the Attending Daedalus preface (Cambridge Core, fetched live): "the paucity of detailed analyses available".

## Other sources read (bibliography chasing / lateral)
- **Lund University student thesis**, "Making Myth: Narrative Discourse in The Shadow of the Torturer" (2019), lup.lub.lu.se record 9040746, PDF 58 pp, 24,048 words extracted with pypdf. Genette-based narrative-discourse analysis; NOT stylometry, but it makes one sentence-level generalisation.
- **Xeno Swarm**, "GENE WOLFE AND NOETIC ESTRANGEMENT: the incipit to The Shadow of the Torturer", 2020-02-29 — a numbered close reading of the first paragraph.
- **Ultan's Library**, "Tell me about the Lexicon Urthus: an interview with Michael Andre-Driussi" (n.d., after the 2nd edition, so 2008) — the diction question answered at the source.
- **David Langford**, "Odyssey" column reprinted at ansible.co.uk/writing/odyss03.html (1998) on the first-edition Lexicon Urthus.
- **Larry McCaffery interview with Gene Wolfe**, Science Fiction Studies 46 (Nov 1988) — already on disk from the academic angle (depauw-mccaffery-wb.txt); Wolfe's OWN WORDS on why the vocabulary is real rather than coined. Canonical URL depauw.edu/sfs/interviews/wolfe46interview.htm is dead live; Wayback id_ capture 20260117042947 is the route.
- **Murray Ewing**, "The Secret to Reading Gene Wolfe", 2010-09-11 — DISPUTES the "dense allusive prose" reputation in so many words.
- **Peter Wright**, Attending Daedalus preface, Cambridge Core (book 2003) — fetched live, 200.

## Housekeeping
Raw HTML/PDF and every extracted text file under `sweep/wolfe-measure-raw/` are deleted at the end of the run; `metrics-out.json`, `metrics-narration.json` and this file carry the derived numbers. No excerpt text is retained.

## Reproduction kit (what survives this run)
- `sweep/metrics-wolfe-measure.json` — every figure, all-sentence and narration-only, five samples, plus the four Welch tests and the two Peace sentence counts.
- `sweep/metrics-wolfe-measure.py` — the measuring script exactly as run. It expects `freq10k.txt` in the working directory: fetch it from https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa.txt (9,999 lines as fetched 2026-09-06) and `/usr/share/dict/web2`.
- `sweep/wolfe-measure-raw/extract.py` — the paragraph extractor.
- Every quotation in `found-wolfe-measure.json` was searched in the fetched bytes before the text was deleted: 38 claims, every non-empty quotation matched verbatim, zero misses.
