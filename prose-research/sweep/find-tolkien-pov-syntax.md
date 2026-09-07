# Tolkien prose research sweep — angle: POINT OF VIEW, FOCALISATION, MEASURED SYNTAX

Written 2026-09-06 by the finder lane. Raw working files under sweep/pov/ (Google Books snippet dumps gb_*.json, gb3/, gb4/; Wayback PDFs wb-*.pdf/.txt; bham239.pdf; poveda.pdf).

## Access notes
- dc.swosu.edu and scholar.valpo.edu (bepress) return a 403 challenge to WebFetch and curl; Wayback `id_` captures gave Bolding's review, Holmes's review, Livesey's article, Barkley's article, Beasley's thesis. Extracted with the macOS PDFKit JXA helper (sweep/pdftext.js).
- link.springer.com redirects through idp.springer.com; the chapter abstracts were read by following the `?error=cookies_not_supported&code=...` redirect URL.
- Google Books search-inside: `https://www.google.com/books?id=9uAsEAAAQBAJ&jscmd=SearchWithin&q=...` fetched with curl -L (browser UA) returns HTML that embeds the JSON `{number_of_results, search_results:[{page_number, snippet_text}]}`; parser in sweep/pov/parse_gb2.py. The Books API volumes endpoint returns no snippets.
- The Claude browser pane is shared with another session (it navigated away mid-batch) and the Chrome extension was not connected; neither was used.
- NOT read: the DiVA narratology thesis (connection refused), Bowman 2006 (MUSE wall, freelibrary 403), Thomson 1967 (JSTOR), the Medium 'Sentence Structure' post (403), rec.arts.books.tolkien thread (429), academia.edu vocabulary paper (403). Springer chapters 2 and 9 abstracts not read (cookie loop).

## Search stop
Last rounds (free indirect; hypotaxis/parataxis; Hobbit focalisation; Digital Tolkien results) yielded only minor new items (McIntosh, Qiu) then nothing new on the angle: stopped.

## The 85-per-cent figure, traced
- Wikipedia 'Storytelling in LOTR' §Points of view: 'most often – 85% of the time – one of the four Hobbit protagonists' [5] = Kullmann & Siepmann 2021 pp. 90–122.
- Google Books p. 111: '... 85 per cent, of the non-direct-speech sections of the narrative) follow the conventions of the nineteenth-century novel, as found in Ann Radcliffe and the Gothic novelists, in the novels of Walter Scott, Charles Dickens, George Eliot, Thomas Hardy and ... John Buchan. The sections told by an omniscient narrator are comparatively few in number ...'
- Holmes (JTR 14.1) restates: '85% of all "non-direct" speech, according to Kullmann, represents hobbits'.
- So the figure is Kullmann's own estimate in ch. 4 (p. 111), of the non-direct-speech text; the basis of the measurement is not shown in the snippet.

## Dialogue share
- K&S p. 90: ~50 per cent of the text is dialogue/exclamation/embedded story/poem; a novel's direct speech 'would usually take up ca. 20 to 30 per cent'. Repeated p. 159. Bolding: 'direct speech to comprise 50 percent of the text (90)'.

## Free indirect discourse — the finding runs AGAINST the brief's assumption
- Siepmann ch. 3 pp. 75–76: modern-fiction short copular sentences and modal 'would' that indicate free indirect speech are 'conspicuous by their absence from The Lord of the Rings'. Thought is reported by that-clauses ('He thought that he had heard...', 'It seemed that...') p. 84, and psychonarration (Kullmann's term via Lanser) is reserved to Frodo (p. 105).

## Syntax figures and features (Siepmann ch. 3, pp. 71–87)
- Method: dialogue/narrative-separated corpus; PHRASEOROM (post-war fiction) + BNC references; key 3–6-grams of syntactic tags; dispreferred vs preferred constructions; two sample paragraphs (Shire vs heroic).
- Word level: underuse of modal verbs (p. 72). Phrase level: coordination by and (Table 3.1), overuse of intensifiers very/so/too (p. 59), even ~7x modern fiction (p. 49).
- Clause level: underuse of sentence-initial personal pronouns (p. 74); name over pronoun reference (p. 75); fronting of adverbials 'to a (N) they came' (p. 78); clause-initial then/presently/suddenly (p. 78); passive + prepositional complement, stative passive >> eventive (pp. 79, 83); clause-initial participles, bare absolute participles, participles generally underused (p. 80); inversions: fronted subject complement + be + subject (p. 81); existential there with event verbs / passives / fronted PPs (pp. 76, 82–83); that-clause thought report (p. 84); 'said Frodo' framing (pp. 84–85).
- No sentence-length, clause-depth or punctuation counts appear in any snippet (queries 'sentence length', 'semicolon', 'subordinate', 'words per sentence' returned no hits).

## Other numbers found
- Tauber: Hobbit 95,137 tokens / 11,532 types (19 chapters, 70th Anniv. ed.); 1,566 paragraphs. Livesey: Hobbit 95,559 tokens; TT books 66,374 / 64,738. Beasley: Hobbit+LOTR 578,432 tokens. Rateliff: LOTR 478,492 (no appendices) / 526,172 (with), Hobbit 95,356, Silmarillion 130,115. Shugar: Hobbit opening avg 19 words/sentence, longest 59. Forum: 144-word sentence (Fall of Gondolin), alleged 111-word LOTR longest. Holmes: Aragorn's 'shall' 1.5x Gandalf, 7x Sam/Pippin; 45–50 embedded tales by 23 tellers.
- Digital Tolkien Project has NO published sentence-length statistics; its posts are tokenisation, paragraph prefixes, punctuation mark-up; Oxonmoot 2023 talk applied Multidimensional Register Analysis (abstract only, no numbers online).

## Narrators across the works
- Thomas via Nepveu; Poveda; Litschko; Barkley; aefenglommung — see JSON claims.

## Claims and sources
See found-tolkien-pov-syntax.json (same content as the structured return): 80 claims, 37 sources.
