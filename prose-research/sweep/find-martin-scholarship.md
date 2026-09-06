# FIND — Martin, angle: book-length & quantitative scholarship
Finder: Opus 5. Started 2026-09-06.

## Roster status
1. Fafnir review of Young (Palmer-Patel, Fafnir 9:1, 117-121) — FETCHED raw (curl+UA), full text. journal.finfar.org
2. JTR review of Young + Honegger (Higgins, JTR 18:1 art.7, 2023) — FETCHED via Wayback id_ PDF capture 20250602181043, 7pp, pypdf extract. (live 403)
3. Young's book itself — TODO (Google Books search-inside / Perlego / Routledge blurb)
4. Larrington 2016 (Winter is Coming) — TODO
5. Shiloh Carroll, Medievalism in ASOIAF & GoT (Boydell 2018) — TODO
6. Mendlesohn, Rhetorics of Fantasy (2008) — TODO
7. Beveridge & Shan, Network of Thrones, Math Horizons 2016 — tandf 403, no wayback ts on abs URL; TODO other routes
8. PNAS Gessey-Jones et al 2020 — TODO
9. 'Food Fantasies' JFA 24.3 (2013) — TODO

## Notes
### Fafnir (Palmer-Patel) — key raw lines
- Young argues Martin "abandoning or subverting the conventions of his genre, is actually using them particularly well" (5)
- "Martin deliberately and repeatedly makes authorial choices that direct the reader to take note of 'filth' and other low mimetic markers"
- Ch3: ASOIAF classified "for the most part, as an immersive fantasy (74), a rhetorical structure through which readers understand the fantastical world as focalised by characters already familiar with it."
- ironic mode (Frye), Pratchett/Monty Python comparison

### JTR (Higgins) — key raw lines
- Ch1: "Young explores how Martin tends to use a 'low mimetic' register in both his characters and descriptions to bring his fantasy closer to reality."
- Boromir boat-funeral (high mimetic, Tolkien) vs Hoster Tully boat-funeral (hungover son missing with fire arrow) = low mimetic
- "True, Tolkien never gives us great details about what the refuse situation must have been like in a besieged Gondor."
- Clute thinned world: Young quoted "Martin's entire written world appears to be a shadow of its former self, subject to precipitous decline from past glories" (69)
- Young quoted: "is shot through with references to and insinuations of a cleaner, nobler past of morality and good sense" (67)
- Honegger (via Higgins): Hemingway "literary iceberg" — "stories are strengthened by leaving things or events out"
- Honegger: Martin invented world "from the top down", iceberg "invented coterminous with the stories, with the backstories being invented after the main narratives"
- Honegger: depth achieved "through his use of poems in the narrative which tell of an older time"; three poems Rains of Castamere, Bear and Maiden Fair, Doom of Valyria "each in themselves create the sense of an older transmitted oral tradition"
- Martin quoted (interview, via Honegger, p159): "Tolkien was a philologist, and an Oxford don, and could spend decades laboriously inventing Elvish in all its detail. I, alas, am only a hardworking SF and Fantasy novel[ist] and I don't have a gift for languages"
- Honegger: Martin "concentrated right from the beginning on the narrative construction of his world" (165)

## FINAL STATUS (complete)
25 sources logged, 23 substantive. 83 claims. found-martin-scholarship.json written with complete:true.
Every quotation extracted BYTE-EXACT from the fetched text via exact.py (normalises curly quotes/whitespace
for the search, returns the raw substring), so the verifier matches on the first pass. All quotes <= 12 words.

BLOCKED (full ladder walked, all failed): 'Food Fantasies in George R. R. Martin', Anca Rosu, JFA 24.3 (2013) 446-466.
  live Free Library -> Cloudflare 403 (twice, incl. cookie jar)
  Wayback availability API -> no snapshot; Wayback CDX -> empty
  archive.ph -> 429 on three attempts
  go.gale.com -> HTTP 202, zero-byte body (institutional auth)
  proquest.com -> 302 to login
  academia.edu 'Rosu Proofs' -> 403
  OpenAlex + Crossref -> article not indexed
NOT FETCHED IN FULL (reached through full-text reviews instead): Young's monograph, Larrington 2016, Carroll 2018.
  Google Books API -> HTTP 429 quota exceeded for the day; Perlego paywalled.
NOTE: WebSearch budget hit its 200-call session cap partway through the lateral phase; later discovery ran on
  OpenAlex (cites: filter), Crossref, and direct curl fetches.

Local evidence files (all under this sweep dir): fafnir.txt jtr.txt mh_de.txt pnas.txt carroll_fafnir.txt
grimdark.txt mend.txt larrington_rev.txt routledge.txt corpus.txt bookpage.txt slate.txt interk.txt
as_*.txt (12 At Sea Journal essays). Builders: exact.py, build3.py. Extractors: h2t.py, pdf2t.py.
