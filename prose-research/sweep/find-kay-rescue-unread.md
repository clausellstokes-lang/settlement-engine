# find-kay-rescue-unread — raw notes (Opus finder, 2026-09-06)
Angle: claim the roster already named but never read; the well-known critics with zero rows in state-kay.json (153 distinct urls confirmed, none of them these).

## Roster status log
- Cheryl Morgan, "Pieces of History" (Emerald City), reprinted BrightWeavings — FETCHED https://brightweavings.com/pieces-of-history-2/ (posted 7 May 2016 by Sue Reynolds; review of the Sarantine Mosaic). route: direct curl + UA.
- Mohanraj & Cobb, Strange Horizons — FETCHED two pieces: "From Tapestry to Mosaic" (13 Nov 2000, Articles) and "'We must learn to bend, or we break'" (Reviews). Both dialogues.
- Mohanraj/Cobb companion "The History behind the Books" (kayhistory.html) — NOT FOUND live (both /2000/20001113/kayhistory.html and .shtml 302 to the modern SH front matter, no body); Wayback CDX lists 20+ captures 2001-2008 but archive.org services returned "Temporarily Offline" during this run. BLOCKED (retry).
- John Clute, SFE entry sf-encyclopedia.com/entry/kay_guy_gavriel — NOT FOUND: 404 on /entry/kay_guy_gavriel, /entry/Kay_Guy_Gavriel, /entry/kay_guy, /fe/kay_guy_gavriel. SFE's own Canada entry names Kay in running text but carries NO internal link to a Kay entry, i.e. SFE appears to have no Kay entry at present.
- Encyclopedia of Fantasy 1997 entry — the /fe/ namespace is 404 on sf-encyclopedia.com; not online. BLOCKED.
- Mendlesohn Rhetorics of Fantasy / Attebery Strategies of Fantasy, IA full-text search for "Gavriel" — BLOCKED, archive.org offline this window.
- Nick Gevers, Infinity Plus — the Infinity Plus Kay pages are NOT by Gevers: interview by Sandy Auden (3 July 2005), Lord of Emperors and Lions of Al-Rassan reviews by Simeon Shoul, Last Light of the Sun review by Sandy Auden. Fetched all four; recorded under their true bylines (attribution law).
- Kirkus at the primary — FETCHED 6: Tigana (issue 15 Aug 1990), A Song for Arbonne, The Lion of Al-Rassan [sic, Kirkus's slug], Lord of Emperors, River of Stars, Children of Earth and Sky, A Brightness Long Ago (issue 15 Mar 2019).

## Live claim seeds
- Morgan: Crispin "a lowly but conveniently placed observer"; prologue "a patchwork of people and places"; Procopius/Pertennius "his testimony must be suspect".
- Cobb: Devin "an excellent entry-character for the reader"; "narratorial sleight-of-hand" (dissent); "unwearying spirit of love for the spectacle of the world that he records".
- Shoul (Al-Rassan): "prose that has always been quite mannered, quite deliberately styled" (dissent); "as narrator, will directly inform us that they are brilliant"; Reconquista 400 years compressed to "no more than thirty-five".
- Shoul (Lord of Emperors): "Crispin sees much, though not all, of the varied plots".
- Auden (Last Light): "no dry technical facts"; "prose spiral"; present tense with unusual cadences for the faeries; names conjure ancient images.
- Kirkus Lions: the final pages "abruptly receded into some long-forgotten history".
- Kirkus River of Stars: "drawing straight from the annals"; "Lucid and lyrical".
- Kirkus CoES: "drawing back from the crux of climactic moments" (dissent).
- Kirkus Brightness: "prose that sometimes gets carried away with itself" (dissent).

## Still to do
PW, Booklist, Library Journal, NYT at the primary; Faren Miller's Locus reviews; Locus at locusmag primary; retry archive.org for kayhistory + IA full-text (Mendlesohn/Attebery); Encyclopedia.com "Kay, Guy Gavriel" (Contemporary Authors relay).

## FINAL (run closed)
found-kay-rescue-unread.json written with complete:true — 40 sources (30 substantive), 100 claims, every quotation re-searched verbatim against the fetched text by build-rescue.py before writing (zero misses).

Roster outcomes: FETCHED — Morgan x2, Cobb/Mohanraj x3 (one via Wayback), Kirkus x7, PW x6, Infinity Plus x4 (Auden/Shoul, NOT Gevers), Attebery full OCR text.
NOT FOUND — SFE Clute entry (404 on four URL forms; SFE has no Kay entry), Encyclopedia of Fantasy 1997 (only a seven-word relay quotation survives on BrightWeavings), Faren Miller's Locus reviews (Sept 1992 TOC confirms the Arbonne review at p.17; the text is not online), any NYT review.
BLOCKED — Mendlesohn Rhetorics of Fantasy (lending-restricted everywhere tried), Booklist Online, Library Journal.
BONUS (sitemap diff against state-kay.json's 153 urls): Jo Walton's "veiled omniscient", Rob Kilheffer (F&SF) on withheld information and off-stage action, Dave Langford (SFX), Michelle Sagara (Quill & Quire), John H. Riskind (Washington Post Book World), plus four SF Site reviews via Wayback (Hromic on history as residue).

Session limits hit: WebSearch budget exhausted (200/200) mid-run; DuckDuckGo captcha, Mojeek empty, HathiTrust 403, sfsite.com and washingtonpost.com unreachable directly. Discovery continued via site sitemaps, Wikipedia wikitext reference-harvesting, and the Wayback availability API.
