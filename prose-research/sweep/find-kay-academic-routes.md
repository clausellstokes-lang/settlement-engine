# FIND — Kay, angle: THE ACADEMIC BLOCKS (routes named by the critic)
Finder: Opus 5, 2026-09-06. Method: OPUS-FINDER-METHOD.md. Working dir: sweep/kayacad/

## Roster status (running)
1. JFA 20.2 (2009) Kay special issue
   - Crossref journals/0897-0521 = 404 (JFA not in Crossref). OpenAlex source S2764679916 (issn 0897-0521, 258 works) DOES enumerate the issue.
   - JFA 20.2 contents recovered from OpenAlex: Attebery "Introduction: Conferring, Convening, Conversing, Communing" p169; Levy "Maria Nikolajeva: An Introduction" p182; Nikolajeva "Time and Totalitarianism" p184; Klapcsik "The Double-Edged Nature of Neil Gaiman's Ironical Perspectives" p193; Murphy "Higher Verisimilitude ... Interview with Robert Charles Wilson" p210; Lindow "Lavinia" p221; **Wolfe "Guy Gavriel Kay: An Introduction" p238**; **Kay "The Fiction of Privacy: Fantasy and the Past" p240**; Fawver "'Present'-ly Safe" p248.
   - No DOIs exist for these (OpenAlex ids only: W297413158 Wolfe, W309665691 Kay). Only landing page = questia.com (defunct).
   - WOLFE p238: Wayback has NO capture of the Questia page. JSTOR bot wall (3038-byte challenge shell).
   - KAY p240: Wayback capture FOUND and fetched raw — web.archive.org/web/20181019170915id_/questia.../the-fiction-of-privacy... => 10,765 chars, article EXCERPT (Questia preview, ~first third, ends mid-McNealy quote). EXCERPT-ONLY.
   - BrightWeavings hosts the SOURCE speech in FULL: /privacy/ = "Reflections on an Ethical Society", delivered 4 Nov 2000, U of Toronto Convocation Hall; the page's own end-note says the JFA 20.2 piece is "An updated version of this essay". So: 2000 full text + 2009 revision excerpt. TWO DISTINCT SOURCES, attribute separately.
2. Toswell 2025 — CORRECTION TO THE ANGLE: it is NOT a book-length study of Kay. The book is M. J. Toswell, *Medievalism in English Canadian Identity and Literature* (Arc Humanities Press / Amsterdam UP, 2025); Kay is **Chapter 3, "Guy Gavriel Kay: Historical Fantasy", pp. 89-124** (DOI 10.1515/9781802703696-006; JSTOR chapter 10.2307/jj.32561711.8, book jj.32561711). Not in OAPEN, not in DOAB.
3. Siourbas — in *Worlds of Wonder: Readings in Canadian Science Fiction and Fantasy Literature* (U Ottawa Press 2004), book DOI 10.1353/book6623, ISBN 9780776617459, on Project MUSE (book/6623). Not in OpenAlex (0 hits "Siourbas Tigana"), not in Crossref by chapter title.
4. Borowska-Szerszun — "Remembering the Romance" = ch.10 of Toswell (ed.), *Medievalism in English Canadian Literature: From Richardson to Atwood* (Boydell 2020); DOIs 10.1017/9781787448858.011, 10.1515/9781787448858-011, 10.2307/j.ctvnwbzb5.13. NEW FIND: ch.11 of the same volume is "Medievalisms and Romance Traditions in Guy Gavriel Kay's Ysabel". NEW FIND: Borowska-Szerszun 2025 "King Arthur and Imagined Indians ... " 10.1017/9781805435631.010.
5. The five keyword-only sources — ALL READ IN FULL this round.
   - Taylor "The Double-Edged Gift" /denafionavar/ (33,869 chars) — Fionavar's structuring oppositions; one usable claim (cost of gifts). Nothing on register.
   - Doherty /doherty/ (29,686) — three usable claims: Kay "better, and more frugal" than Lawhead with religious symbolism; Lancelot "more of a stereotype than a character"; Tigana "an evocative, rich story".
   - Clements /clementsfionavarlotr/ (31,505) — one usable claim (human choice can act against the Weaver's will). Nothing on register.
   - Labrousse-Marchau /nath_arbonne/ (10,641) — English translation by Francois Vincent; three claims (disenchantment; gods as focal points; shadow/light bound together).
   - Medievalists.net — THREE pages. 2016 Alvarez interview is the substantive one (Kay: "a novel about not-powerful people"); 2010 and 2019 pages are blurbs around dead/audio-only content.

## Cracks that mattered (record these)
- **The Wayback availability API is host-exact.** `questia.com/library/journal/1G1-223225904/...` returns NO snapshot; `www.questia.com/library/journal/1G1-223225904/...` returns one. The previous round's BLOCKED verdict on the Wolfe introduction was an artefact of the missing `www.`. Always try both host forms before declaring a Wayback miss.
- **Cambridge Core: the /core/books/abs/ slug 404s; the Crossref record's `resource.primary.URL` renders.** Pattern: `https://www.cambridge.org/core/product/identifier/<ISBN>%23c<N>/type/book_part`. Cambridge prints the chapter's OPENING PAGES in the div it labels "abstract", so this route yields a real extract, not a summary — but it is an EXTRACT, mark it so.
- **An image-only PDF is not a dead end.** `pypdf` exposes `page.images`; the 18 embedded JPEGs OCR cleanly under tesseract 5.5.3 (`brew install tesseract`, `--psm 1`). 4.7 MB scan -> 36,724 characters.
- **Budgets that ran out mid-sweep:** WebSearch (200/200 before this finder started), Google Books API (daily quota), OpenAlex (daily budget, hit while walking the JFA volumes), Semantic Scholar (429). DuckDuckGo returns HTTP 202 challenges and Mojeek 403 to curl, so there was no search-engine fallback at all. The IA CDX endpoint answered "Internet Archive services are temporarily offline" on every attempt, though the availability API and the id_ raw captures worked.

## Corrections owed to the angle brief
- Toswell 2025 is NOT a book-length study of Kay. Kay is one 36-page chapter (pp. 89-124) of a monograph on Canadian medievalism.
- The Siourbas chapter title is longer than the brief gives it: it treats Kay's Tigana AND Randy Bradshaw's The Song Spinner, pp. 73-80.
- JFA 20.2 contains Kay's OWN essay (pp. 240-47) as well as Wolfe's introduction — the brief named only Wolfe.
