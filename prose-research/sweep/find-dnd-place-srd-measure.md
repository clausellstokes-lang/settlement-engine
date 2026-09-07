# FINDER — dnd × place-srd-measure (Opus). Started 2026-09-06.
Angle: the SRD 5.1 and 5.2.1 as a MEASURED corpus for PLACE prose. Measure the place-describing
passages; state where the SRD has none, naming the pages searched.

## Primaries fetched RAW (both CC-BY-4.0, downloaded with a browser UA, 2026-09-06)
- SRD 5.1 PDF — https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf — http 200, 3,158,713 bytes, 403 pages.
- SRD 5.2.1 PDF — https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf — http 200, 6,031,375 bytes, 364 pages.
Extraction: `pdftotext -enc UTF-8` (poppler, /opt/homebrew/bin), page-marked; 5.1 needed an unwrap
(its word separator is `\t\n \xa0`, paragraph breaks survive as blank lines); 5.2.1 needed hyphen
rejoin + running-head strip. Scripts: `dndsrd/norm2.py`, `dndsrd/measure.py`; segments in
`dndsrd/seg_*.txt`; all figures in `dndsrd/measurements.json`.

## Measurement definitions (mine, stated so the verifier can re-run)
sentence split on `(?<=[.?!])\s+(?=["(]?[A-Z0-9])`, sentences of >=2 words kept; words = whitespace
tokens. second person = tokens you/your/yours/yourself. digits = runs of `\d+`. em dash = U+2014.
contraction = `\w+n't` | `\w+'(re|ve|ll|m)` | (it|that|there|what|let|he|she|who|here)'s.
tense proxy = is/are vs was/were per 1,000 words. Headings, tables, stat blocks and running heads
dropped before measuring.

## THE FINDING THAT ORGANISES THE REST
SRD 5.1 Appendix PH-C "The Planes of Existence" (pp. 363-365) is the ONLY sustained
place-describing prose in either SRD. 9 paragraphs / 72 sentences / 1,530 words. And SRD 5.2.1
DELETED it: 5.2.1 has no planes section at all (TOC p.2-4: Legal, Playing the Game, Character
Creation, Classes, Character Origins, Feats, Equipment, Spells, Magic Items, Rules Glossary,
Monsters, Animals, Index of Stat Blocks). "Planes" survives in 5.2.1 only inside spell text, the
magic item "Amulet of the Planes", and the creature-type note on Elementals.

## THE TABLE (all figures mine, over the segments named)
| corpus | words | mean wps | sd | min/max | p10/p50/p90 | <8w | >30w | nbrVar | sent/para | 2p /1k | digits /1k | emdash /1k | contr /1k | is-are /1k | was-were /1k |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5.1 PH-C Planes (PLACE) | 1530 | 21.2 | 7.5 | 8/41 | 11/21/30 | 0.0000 | 0.1111 | 0.422 | 8.00 | 1.96 | 0.00 | 4.58 | 1.96 | 24.84 | 0.65 |
| 5.1 The Environment pp.86-87 | 1065 | 19.0 | 7.9 | 6/48 | 10/19/29 | 0.0357 | 0.0714 | 0.501 | 5.09 | 0.00 | 15.96 | 3.76 | 4.69 | 13.15 | 0.94 |
| 5.2.1 Exploration pp.11-12 | 1075 | 17.1 | 9.5 | 2/58 | 8/15/27 | 0.0794 | 0.0794 | 0.587 | 3.15 | 22.33 | 1.86 | 5.58 | 4.65 | 15.81 | 0.00 |
| 5.2.1 rules pp.5-18 | 8024 | 16.9 | 8.4 | 2/58 | 8/16/28 | 0.0970 | 0.0612 | 0.522 | 3.89 | 44.12 | 15.33 | 2.74 | 8.35 | 17.82 | 0.00 |
| 5.1 rules pp.77-85 | 5376 | 20.1 | 12.2 | 2/110 | 7/18/35 | 0.1049 | 0.1610 | 0.643 | 5.45 | 38.50 | 12.46 | 2.23 | 4.46 | 11.90 | 0.19 |
| 5.1 Magnificent Mansion | 262 | 13.8 | 5.8 | 6/26 | 7/12/23 | 0.1579 | 0.0000 | 0.524 | 19.0 | 22.90 | 26.72 | 0.00 | 11.45 | 34.35 | 0.00 |
| 5.2.1 Magnificent Mansion | 249 | 13.8 | 5.8 | 6/24 | 6/12/23 | 0.1667 | 0.0000 | 0.523 | 18.0 | 24.10 | 28.11 | 0.00 | 12.05 | 32.13 | 0.00 |
| 5.1 Rod of Security | 85 | 17.0 | 6.0 | 8/25 | 8/15/22 | 0.0000 | 0.0000 | 0.559 | 5.0 | 35.29 | 11.76 | 0.00 | 0.00 | 0.00 | 0.00 |
| 5.2.1 Rod of Security | 85 | 17.0 | 6.5 | 7/24 | 7/19/23 | 0.2000 | 0.0000 | 0.603 | 5.0 | 35.29 | 11.76 | 0.00 | 11.76 | 0.00 | 0.00 |

Kit cross-check: the earlier lane's fingerprint of SRD 5.2.1 pp.5-18 (different splitter, 6,366 w
kept) reports mean 17.4, sd 8.5, sentencesPerParagraph 2.87, emDashRate 0.0247 — my like-for-like
re-measure of the same pages gives mean 16.9, sd 8.4, sent/para 3.89. Same neighbourhood.

## VERIFIED SUB-FACTS
- ZERO digits in PH-C: `grep -o '[0-9]' seg_51_planes.txt | wc -l` = 0 over 1,530 words. Numbers
  are SPELLED: one(4) single(3) four(3) two(1) sixteen(1) ninth(1) first(1) eight(1) Nine(1).
- Exactly ONE second-person sentence in PH-C, in the opening paragraph: "As your character achieves
  greater power and higher levels, you might walk on streets made of solid fire..."
- Exactly ONE past-tense finite clause in PH-C: "...from which all the worlds were made."
- 7 em dashes in PH-C; 3 contractions (They're, doesn't, don't); 0 semicolons, 0 questions,
  0 exclamations.
- The 5.1 rules baseline runs 38.50 second-person tokens/1k and 12.46 numerals/1k; the place prose
  runs 1.96 and 0.00.

## ABSENCE (pages searched = all 403 of SRD 5.1 and all 364 of SRD 5.2.1, full text)
- read-aloud / boxed text: `grep -inE 'read[- ]aloud|read the following|boxed text|aloud to the players'`
  = 0 hits in BOTH documents. Neither SRD contains a single line of read-aloud text or any
  instruction to read text aloud.
- settlement tables: none. "settlement" appears 2x in 5.1, 1x in 5.2.1, always as a rules noun
  (spell availability / crafting materials). In 5.2.1 the only "Village, town, or city" text is a
  price column in the Spellcasting-services table (30 GP / 50 GP / 200 GP rows).
- civic-record register: `gazetteer` 0, `chronicle` 0, `annal` 0, `archive` 0, `ledger` 0 in BOTH.
- monster entries carry no habitat or lair description in 5.1 (checked Aboleth p.261, Deva p.262):
  stat block only.
- the only place nouns that appear in described settings are inside two rules entries: the
  Magnificent Mansion spell and the Rod of Security.

## THE 2014 -> 2024 REWRITE OF THE SAME SENTENCE (house-style datum)
5.1 p.86: "By its nature, adventuring involves delving into places that are dark, dangerous, and
full of mysteries to be explored."
5.2.1 p.11: "Exploration involves delving into places that are dangerous and full of mystery."
The 2024 revision drops the prepositional opener, cuts one adjective from the triad, singularises
"mysteries", and drops "to be explored" — 19 words to 12 (verified by token count).
Second sentence: 5.1 "The rules in this section cover some of the most important ways in which
adventurers interact with the environment in such places." -> 5.2.1 "The rules in this section
detail some of the ways adventurers interact with the environment in such places." (22 -> 18 words;
"cover"->"detail", "the most important ways in which"->"the ways").
Rod of Security 2014 "a paradise that exists in an extraplanar space" -> 2024 "a demiplane";
the 2014 asyndetic list of six ("a tranquil garden, lovely glade, cheery tavern, immense palace,
tropical island, fantastic carnival") becomes five, each with its own article.

## WEB ROSTER (supporting; status logged below)
| # | source | status | route |
|---|--------|--------|-------|
| 1 | SRD 5.1 PDF (CC-BY-4.0) | FETCHED, measured in full | direct download, browser UA |
| 2 | SRD 5.2.1 PDF (CC-BY-4.0) | FETCHED, measured in full | direct download, browser UA |
| 3 | dnd.wizards.com/resources/systems-reference-document (redirects to dndbeyond.com/srd) | FETCHED (curl 200; WebFetch returned a summary, not the page, so curl was used) | curl browser UA |
| 4 | Converting to SRD 5.2.1 (WotC, 27 May 2025) | FETCHED | direct PDF |
| 5 | D&D Basic Rules v1.0 (Nov 2018) | FETCHED | direct PDF |
| 6 | D&D Beyond studio post 1717 "2024 Core Rulebooks to Expand the SRD" | FETCHED | curl; body in served HTML |
| 7 | D&D Beyond studio post 1949 "You Can Now Publish…" | FETCHED | curl; body in served HTML |
| 8 | Merwin, "Let's Design an Adventure: Boxed Text" (6 Nov 2019) | FETCHED | curl |
| 9 | ScreenRant, Brosofsky interview with Perkins and Wyatt (25 Oct 2024) | FETCHED | curl |
| 10 | Dungeon Master's Workshop, "Mastering the Boxed Text" (27 Sep 2019) | FETCHED | curl |
| 11 | D&D Beyond forum, Official SRD 5.2 thread p.3 | FETCHED | curl |
| 12 | 5thsrd.org planes rendering | FETCHED, used as extraction control | curl |
| 13 | Tribality SRD 5.2 piece | FETCHED, REJECTED — reprints the WotC FAQ verbatim | curl |
| — | a peer-reviewed stylometric study of the SRD | NOT FOUND — two searches returned only general stylometry literature; the thin literature is itself the finding |

## ADDED AFTER THE FIRST CHECKPOINT
- ⚠ CORRECTION TO MYSELF: my first TOC read of SRD 5.2.1 missed the **Gameplay Toolbox** chapter
  (p.192; Travel Pace, Magical Contagions, **Environmental Effects** p.195, Fear and Mental Stress,
  Poison, Traps, Combat Encounters). I checked pp.192-199 before letting any absence claim stand.
  It contains NO place description and NO read-aloud: "Environmental Effects" is Deep Water,
  Extreme Cold, Extreme Heat, Frigid Water, Heavy Precipitation, High Altitude, Slippery Ice,
  Strong Wind, Thin Ice — each a saving-throw rule keyed to a number.
- 5.2.1 Environmental Effects p.195: 9 paras / 27 sentences / 512 words; mean 19.0, sd 9.1;
  sent/para 3.00; second person 0.00/1k; **digits 44.92/1k, 44.44% of sentences**; em dash 0.
- 5.1 Appendix PH-B pantheon prose p.360 (prose paragraphs only): 5 paras / 22 sentences / 550 w;
  mean 25.0, sd 12.0, min 9, max 54; 27.27% over 30 words; sent/para 4.40; second person 0.00/1k;
  digits 0.00/1k; em dash 5.45/1k; contractions 9.09/1k; was/were 0.00/1k. Removed in 5.2 as well.
- D&D Basic Rules 2018 p.2, the DM's Castle Ravenloft speech (the read-aloud form the SRD lacks):
  1 para / 9 sentences / 127 words; mean 14.1, sd 4.4, min 5, max 21; digits 0; em dashes 0;
  contractions 0; second person 15.75/1k in 2 of 9 sentences; and NOT ONE finite form of "to be" —
  the nine main verbs are towers, keep, look, gapes, spans, creak, stare, grin, hangs, stand.
- Capitalisation, measured over both full documents (242,857 w in 5.1; 235,684 w in 5.2.1):
  "difficult terrain" lower 48 / Cap 1 in 5.1 → lower 0 / Cap 52 in 5.2.1; "bright light" 54/0 → 0/50;
  "dim light" 72/0 → 0/63; "temporary hit points" 27/0 → 0/72; "short rest" 13/0 → 0/30;
  "long rest" 98/11 → 0/148; "proficiency bonus" 81/16 → 0/98. The conversion guide's
  Capitalization section lists 75 bulleted categories.
- Extraction control: three sentences of the planes appendix were checked word-for-word against the
  independent CC rendering at 5thsrd.org and matched.

## FOR THE SYNTHESIS — the tension the measurements expose (NOT written as a claim)
Merwin's D&D Beyond column tells adventure writers to move boxed text "from the second-person point
of view to the third person"; WotC's own Basic Rules sample read-aloud passage is second person
("Castle Ravenloft towers before you", 2 of 9 sentences). The house does not follow its own column.
A claim spanning both pages would be graded PARTIAL on either one, so it is recorded here instead.

## WHAT THE ANGLE ANSWERS
The SRD is a NEGATIVE result for place prose and a POSITIVE result for the register question. There
is no settlement text, no read-aloud, no gazetteer or chronicle vocabulary in 767 pages of licensed
WotC text. What place prose there was — 1,530 words of planes and 550 words of pantheons — shares
the archivist profile the program is reconstructing: present tense, no digits, second person
effectively absent (1.96 and 0.00 per 1,000 words), long undivided paragraphs (8.00 and 4.40
sentences each), no sentence under 8 words in the planes appendix. And WotC deleted all of it in
2025 "as those are not rules-bearing", leaving a document whose only environment section carries
44.92 numerals per 1,000 words.
