# find-wolfe-close-continued — raw notes (Opus finder, close-reading CONTINUED angle)
Started 2026-09-06. Prior close finder (found-wolfe-close.json, 111 claims, 30 sources) read Urth chapters I and II partially: 058531, 002915, 002922, 002935, 002941, 002948, 058619, 003004, 003007.

## ROSTER FINDING #1 (measured, not assumed)
The angle asks for "the Urth-list close reading from chapter III onward". **There is no chapter III.**
Measured against the on-disk thread indexes: t-2006-October.html carries 244 messages in 46 distinct
subjects, t-2006-November.html 76 messages in 23 subjects; NONE is a "Close Reading" thread. The
project's last thread is "Close Reading: Torturer Chapter II: Severian" (September 2006). The
continuation is therefore (a) the ~30 September messages of the chapter I / chapter II threads the
prior finder did not read, and (b) the October threads that continue close reading under topic names
("Thecla's Green Book", "The Master of the Curators", "Ouen's Catherine", "Catherine, Cyriaca and baby
Severian", "The Katharine maid", "Parallels", "Thecla's genealogy folio").

## Route notes
- lists.urth.net still DEAD from here (curl 28, connection timed out after 20s). Working route:
  https://web.archive.org/web/2021id_/http://lists.urth.net/pipermail/urth-urth.net/2006-September/<N>.html
  Wayback refuses connections after ~11 rapid requests; a 2.5s inter-request sleep with retry/backoff
  (wcc/fetch.py) gets 100%.
- Mailing-list bodies are hard-wrapped at ~70 cols; every quote confined to ONE source line.

## Sources read — Urth list, September 2006 (unread remainder)
002913 Jon Capps 09-04; 002914 nastler 09-05 (asks for an edited list of observations per chapter)
002916 powens; 002917 HHR; 002932 Jon Capps — the Wiki sub-thread
002918/002921 Rex Lycanthrosaurus; 002919 b sharp; 002926/002927/002937 Roy C. Lackey;
002920/002925 Tony Ellis; 002923/002924/002929/002945/002954/002972/003009 Dan'l Danehy-Oakes;
002936/002938 nastler; 002950 Tony Ellis; 002977 Sarah Dorrance-Minch; 002983 Roy C. Lackey;
002985 stilskin (Paul); 002986 Mo Holkar; 002988 Daniel D Jones; 002989 David Duffy; 002993 Chris
Mulder; 002995 Robin Hankin; 003008 b sharp; 058579 Wesley Parsons; 058600 Jack Redelfs.

### The load-bearing ones for the DEVICE
- 002926 Lackey reconstructs the elapsed interval from incidental detail alone: hog-slaughtering
  season "as evidenced by pork soon appearing on the menu" -> a little more than a year and a half.
  The interval is never stated in the text; a MENU is the evidence.
- 002919 b sharp: "I don't see any evidence for time passage except for a change of season."
- 002921 Rex L. reconstructs the same interval from one quoted clause about the Feast of Holy Katharine.
- 002920 Tony Ellis: infers the guard was bribed, then: "I have it in my head that we're told this
  somewhere, but that could be my imagination" — a reader unable to tell his own inference from text.
- 002925 Danehy-Oakes: the gap is filled in a DIFFERENT BOOK (Short Sun); 002927 Lackey REFUTES the
  reconciliation on seasonal evidence (frozen drain pipe, snow) — counter-evidence.
- 002983 Lackey reconstructs an institutional conspiracy (who ordered Thecla tortured) purely from
  flatly-stated facts the narrative never connects: the Tower is the autarch's private dungeon, most
  of Nessus does not know it exists, the Old Autarch "professed ignorance", the timing coincides with
  Severian's elevation. THE gap between public belief, institutional record and physical evidence.
- 002995 Robin Hankin: the narrator ADMIRES a quick-thinking lie — the first signal of his own unreliability.
- 003008 b sharp: the necropolis LAYOUT by social stratum as evidence (potter's field for the
  indigent; the victim on higher ground marks her an armiger) — place-and-institution description.
- 003009 Danehy-Oakes: "a certain bar of iron thrusts from a bulkhead at the height of a man's groin"
  — an institutional object whose function is never stated; and "Severian is often defensive about
  his narrative choices."
- 002938 nastler: chapter one's "green moonlight" — a world-changing fact planted as scenery, missed.
- 002936 nastler: the recurring "tableau" of a beast man, an armed man and a woman.

## RUN 2 (successor finder, 2026-09-06 19:0x) — what was added
Routes and outcomes:
- Urth October 2006: 40 messages fetched via `https://web.archive.org/web/2021id_/http://lists.urth.net/pipermail/urth-urth.net/2006-October/<N>.html`
  (2.5s inter-request sleep, wcc3/f.py). 31 claims. Load-bearing:
  * 058684+003067 THE GREEN BOOK: an apparent continuity error found by comparing two incidental
    physical measurements (a book "hardly larger than my hand" vs a cell-door slot too narrow) is
    resolved by Lackey as a deliberate concealment — there are TWO green books, and the one that
    shares the tetralogy's title is mentioned once, obliquely. The device in miniature.
  * 058679 Lackey: "Nothing at all was mentioned about Catherine's height, which is unusual for
    Severian to omit" — the ABSENCE of a habitually-supplied detail read as evidence.
  * 003175 Lackey: one ordinary noun ("maid") counted ten times in about three pages, read as planted.
  * 058830 Lackey: a RUINED CHAPEL still in ceremonial use is physical evidence that a cult once held
    official sanction; and "the guild masters knew damn well" the fact the narrative withholds.
  * 003166 Lackey: the manuscript is one late retrospective composition, not a journal — every
    sentence carries knowledge acquired years after the event.
  * 003230: a fact of parentage turns on "borne" vs "born"; 003266: on the direction of one "for".
- Dirda (WaPo) — live + WebFetch both 403; Wayback raw worked. 1989 review is the single best
  statement of the device: "he gives you the names of things, but not what they are".
- Wolfe PRIMARY: technologyreview.com 2014 Q&A read raw (live, browser UA). "the style changes from
  one letter writer to another"; "They're all unreliable"; and his praise of Wells for mentioning
  "just in passing" that the narrator never learned the sailor's name.
- Gary K. Wolfe / Locus x2 (live): "the vernacular rhythms of good old boys to the measured cadences
  of Victorian gentlemen"; a narrator's voice "almost pointedly flat and restricted".
- Reactor: the "Rereading Gene Wolfe" column is FABIO FERNANDES, not Jo Walton. Six instalments read
  via Wayback. Plus Polansky 2015 and Knode 2012 on Peace — Knode WORKS the device on the page
  (first line + a later line under a married name ⇒ the narrator is dead).
- r/genewolfe via `.rss?limit=100` (5 threads; 3 more 429'd). The pastiche thread (rpsv1l) is a
  demonstration passage plus critique: the imitation reads "very mannered and arch"; its author
  diagnoses his own failure as "bland modern writing with a superficial 'old fashioned' sound".
- BLOCKED: podcast auto-subs (yt-dlp HTTP 429 / PO-token bot check; web client reports no captions).
- NOT FOUND: scatterings1976, lofkin (WordPress.com placeholders; Wayback CDX offline all run).
- NOT FOUND: any Jo Walton piece on Wolfe (author archive + two searches).
