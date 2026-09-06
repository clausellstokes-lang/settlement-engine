# FINDER: Martin x reception-at-first-publication (Opus finder, 2026-09-06) — FINAL NOTES

Companion file: found-martin-reception.json (73 claims, 20 sources, complete:true).

## Roster status (the angle's named sources)
| source | status | route |
|---|---|---|
| Kirkus 1996 (A Game of Thrones) | FETCHED | live kirkusreviews.com |
| Publishers Weekly (A Game of Thrones) | FETCHED | live publishersweekly.com/9780553103540 |
| Locus reviews | PARTLY REACHED | Locus Online Jul/Aug 2011 review indexes carry NO Martin notice (checked via Wayback). The Locus notices of AGoT (1996) and ADwD (2011) ran in the PRINT magazine and are not online. Substitute read in full: Jeff VanderMeer, "A Dozen of the Best from 2011", Locus, 5 Feb 2012. |
| Dana Jennings, NYT, 14 Jul 2011 | FETCHED | Wayback raw 20251024170837id_ of the **/2011/07/15/** slug. The /07/14/ slug has NO capture. WebFetch refuses nytimes.com entirely. Byline dateline reads "July 14, 2011"; print C3. |
| David Orr, NYT, 12 Aug 2011 | FETCHED | Wayback raw 20251027173637id_ ("Dragons Ascendant") |
| Bill Sheehan, WaPo, 12 Jul 2011 | FETCHED | Wayback raw 20230306235122id_ |
| Megan Wasson, CSM, 12 Jul 2011 | FETCHED | Wayback raw 20251117164216id_ (URL recovered from the Wikipedia ADwD raw wikitext) |
| Jeff VanderMeer, LAT, 2011 | **NOT FOUND** | latimes.com is closed to this user agent; every articles.latimes.com / latimes.com / latimesblogs slug probed returns NO Wayback capture; WebSearch budget (200) exhausted and DuckDuckGo/Bing/Mojeek/Brave all blocked or captcha'd from this sandbox. |
| Lisa Padol, NYRSF | **NOT REACHABLE** | identified as New York Review of Science Fiction #101, January 1997 (Miller/Contento index, philsp.com). No online text of the issue exists. |
| Steve Jeffery, Vector | FETCHED | Vector 192 (BSFA), Mar/Apr 1997, p.19. fanac.org PDF binary -> pypdf text layer. OCR is garbled in places; only clean strings quoted; all Vector claims marked confidence medium. |
| Rachael Brown, The Atlantic, 11 Jul 2011 | FETCHED | Wayback raw 20130901210622id_. NB it is a review PREFACE attached to a Martin interview — two different speakers on one page, so the interview claims are kind=own-words and the preface claims kind=reception. |

## Lateral expansion (the register question)
The angle is reception, but the program's question is the RECORD register, so the sweep was widened to the titles where reviewers actually argue about it:
- **PW on Fire & Blood (19 Nov 2018)** — the sharpest hostile witness on the chronicle voice: storytelling "mostly absent from this dry history"; brief drama then "a return to brisk summary"; equal weight to every Targaryen so "hard to keep track"; the Archmaester-Gyldayn conceit evokes "unhappy Westerosi schoolchildren being forced to study this weighty textbook."
- **Kirkus on Fire & Blood (20 Jan 2019)** — the opposite verdict: "A splendid exercise in worldbuilding", and it likes the "eldritch epochal terms".
- **SLJ, Mark Flowers, on The World of Ice and Fire (8 Jan 2015)** — expected dry, "pleasantly surprised by the ease" of the prose; praises "their facility in conjuring epic conflicts and romances in the few sentences allotted to them in various entries" (i.e. the ENTRY as a form); the gazetteer half "has less narrative drive"; faults the deep-time: "millennia can go by without changes in language, customs, or political power."
- **Wertzone, Adam Whitehead, on The World of Ice and Fire (18 Nov 2014)** — the in-universe origin "makes for a less dry reading experience than it might have been"; but Yandel "cover[s] almost every claim in the book with lengthy caveats"; uneven allocation ("The North gets short shrift"); and the inference device: "by sometimes describing an event as mythological or untrue" the reader is steered. Reviewer DISCLOSES he is a Westeros.org moderator since 2005 — all his claims marked confidence medium.
- **Paul Levinson, Tangent #16, Fall 1996** — reposted by the reviewer himself; the strongest 1996 witness on sensory concreteness ("tart juices oozing from an apple", "you can smell the spice") and on suggestion beating appearance ("has far less impact than their suggestion").

## The four claims that matter most to the dossier register
1. Orr (NYT 2011): "Every town has an elaborately recalled series of triumphs and troubles." — a place's history is a per-settlement record, and a critic reads that as a virtue.
2. Orr (NYT 2011): "when kingdoms ignore debts, the bankers show up" — the praised realism is INSTITUTIONAL CONSEQUENCE, not description.
3. Jennings (NYT 2011): "a summary up front would be useful" — a reviewer of the novels asking, in print, for the dossier.
4. PW (2018) vs Kirkus (2019) on Fire & Blood — the same chronicle register read as "dry history ... brisk summary ... weighty textbook" and as "a splendid exercise in worldbuilding". The register is not self-justifying; what separates the verdicts is whether the entries carry scenes.

## Counter-evidence the synthesis must carry
- Brown (Atlantic 2011): "characters who use the same idioms ... no matter their ethnicity, social class, or continent" — Martin is charged with FAILING per-speaker register. Do not cite him as an exemplar of it.
- Brown/Martin own-words (Atlantic 2011): setting is "just set dressing" beside "the human heart in conflict with itself". The exemplar himself subordinates place-writing.
- Orr (NYT 2011): "Tyrion 'waddles' at least 12 times" — a critic counting a repeated epithet as a fault, against the program's instinct to reuse fixed epithets.
- Kirkus (2011): "the usual swords-and-sorcery dialogue" and "so obsessed with bodily functions of various sorts" — concrete sensory nouns taken too far read as a tic, not texture.
- SLJ (2015): millennia without change in language or customs — a deep-time chronicle that never moves is read as a defect.

## Not cited (aggregators, discovery only)
bookmarks.reviews "The Original Reviews of ..."; HuffPost and TheWrap round-ups; bookbrowse; Wikipedia (used ONLY as a relay to recover primary URLs, via action=raw wikitext).
John H. Riskind, Washington Post, 28 June 1996 — identified through the aggregator, but no live or archived copy reachable; NOT cited.

## Tooling notes for the next finder
- WebFetch refuses www.nytimes.com and web.archive.org outright; `curl` to web.archive.org works. Wayback CDX queries (domain AND prefix matchType) return 403 "requires authorization"; only the per-URL availability API works, so URL slugs must be guessed one at a time.
- The WebSearch budget is 200 per session and was exhausted here; html.duckduckgo.com, lite.duckduckgo.com, bing, brave and mojeek are all blocked or captcha-gated from this sandbox. Recover URLs from Wikipedia raw wikitext instead.
- fanac.org serves Vector PDFs to curl with a browser UA but 403s WebFetch on the directory index; guess Vector<N>.pdf directly.
