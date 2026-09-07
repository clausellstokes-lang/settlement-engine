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
