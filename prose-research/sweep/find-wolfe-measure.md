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
