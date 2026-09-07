# find-wolfe-monographs (second pass, 2026-09-06 evening)

Predecessor read 8 substantive sources / 54 claims (Gordon 1986, Attebery 1992, two Ultan pages,
SFE, three SFS reviews via Wayback). This pass started from the roster items NOT in that list.

## The routes that worked
- **Cambridge Core hosts the Liverpool University Press backlist.** `www.cambridge.org/core/books/attending-daedalus/<slug>/<id>`
  serves a "Summary" block that is in fact the **opening pages of the chapter, verbatim**, with the
  printed page range beneath it. Same for `shadows-of-the-new-sun`. This is the single biggest find:
  Attending Daedalus and Shadows of the New Sun both read at the primary, no borrow needed.
  Chapter rosters come from the book landing page (`/core/books/attending-daedalus/8FDC17...`).
- **gwern.net/doc/fiction/gene-wolfe/index** is a mirror of ~45 Wolfe primaries, including two
  defunct John Clute columns, the 1992 Jordan interview PDF, and Aramini's 2019 UNLV dissertation.
- **Wayback `id_` capture of the old SpringerLink chapter page** carries Manlove's chapter opening
  paragraph and note 8 (the live page returns a Client Challenge).
- **Ultan's Library** carries a Between Light and Shadow entry, Aramini's 2020 interview, Wowra's
  toponymy essay, Gevers on Long Sun, and Peter Wright's own 2002 review that quotes Bishop, Budrys
  and Greenland with footnote numbers.
- **scifiwright.com** reprints John C. Wright's whole introduction to Between Light and Shadow.

## The routes that failed (recorded so the next finder does not repeat them)
- `ia-fts.archive.org`, `ia-pub-fts-api.archive.org`, `api.archivelab.org` -- all HTTP 000 from here.
  `<server>/fulltext/inside.php` returns "Item not available". IA search-inside is simply unavailable.
- Both IA items that matter (`sciencefictionte00manl`, `attendingdaedalu0000wrig`) are
  `access-restricted-item: true`, so `_djvu.txt` 403s.
- Google Books: the JSON API is over its daily quota (HTTP 429) and the HTML preview serves no
  snippet text (JS-gated). Only the "about" pages (description, page count, ToC) are readable.
- Cloudflare walls: link.springer.com, onlinelibrary.wiley.com, academia.edu, thefreelibrary.com,
  vc.bridgew.edu (403), muse.jhu.edu, liverpooluniversitypress.co.uk.
- Logos 18.4 and Critical Quarterly 62 are genuinely paywalled with no abstract anywhere
  (Crossref, OpenAlex, Unpaywall and Semantic Scholar all return an empty abstract).

## Gordon 1986 -- a deliberate non-read
`sweep/wolfe-mono/gordon.txt`, `gordon-layout.txt` and `wolfe/gw/1986-gordon-genewolfe.txt` are three
extractions of the same scan. All three are column-interleaved and character-corrupted
("wr iter ra re ff 0 ently aQeClated by Wlte5I CltlCSI"). No verbatim quotation is safe from them,
so I took no new Gordon claims; the predecessor's stand. The problem is the OCR itself, not the
extraction, so a better PDF tool will not help -- a different scan would be needed.

## What the claims cluster around
- **Wolfe's own mechanism, stated**: "I try not to leave a clue more than once" (Jordan 1992);
  archaisms chosen "to convey the flavour of an odd place at an odd time"; "No, but some of them are
  typos" when asked whether he coined words; "to write about that pagan world as the pagans
  themselves wrote about it"; the sinister element "kept so far back that few readers notice it".
- **Place and institution**: Manlove on Urth's "rituals, guilds, myths and religions, and few
  machines"; Wright's own inventory of Urth ("ruins, bones, obscure relics with forgotten purposes");
  Wolfe's library catalogue in 'Books in The Book of the New Sun'; Wowra's toponymy of Soldier of
  the Mist; Clute on the Wolfe house as prison, pleasure garden and tomb.
- **Metaphor discipline**: Clute 2009 -- Wolfe "did not write allegory, he wrote the thing itself",
  and "the closest Wolfe normally gets to metaphor is when he" lets a protagonist lie.
- **Counter-evidence**: Auerbach (Waggish) disputes that inference is possible without a determinate
  context; Adam Roberts on the archaic idiom as a deterrent and late expository dialogue; the reader
  'Frug' on The Wizard Knight's high register lapsing into slang; Bishop calling Shadow of the
  Torturer immediately accessible.
- **Register-shift measurement**: Aramini -- after New Sun, Wolfe "abandons the baroque and long
  sentences" and "strives for a more minimalistic surface text".
