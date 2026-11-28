# THE SURVEY: THE DOCUMENT AS ONE OBSERVER's ACCOUNT, RULED BY DISQUALIFIERS (the owner's approval of 2026-11-27; the eleventh chair's charter)

## HIS WORDS, VERBATIM, IN ORDER (this session, 2026-11-27)
1. (about 21:35 UTC) "Treat the surveyor or factual voice as the upfront for all intents and purposes the factual voice but also as
   simply one observer that could be wrong or is based off of observation to complete the illusion. The document itself and the
   whole thing ironically could be skewed but as an immersion process and as an illusion where all the facts can /should be
   reconciled by the reader but also provides different vantages to integrate or compare things for a story. Very dnd dm like.
   Not asking you to do so but to ask you what your thoughts are. And yes this could mean changing the promise appropriately."
2. (about 21:45 UTC, over the chair's floor quoted back) "To this, I would like to make it easier by saying trying to force meant
   reconciliations, we simply draw relationships where if one thing is true another can't be so that we loom for disqualifiers
   rather than qualifiers: […] What are your thoughts?"
3. (about 21:55 UTC) "Then I approve of all of this as planned and to be implemented prerelease"

4. (about 00:50 UTC on 2026-11-28, after the chair told him the voices measure's cold read: "quoting everything does not
   work") "Rather than quoting everything which includes the surveyor, think that the surveyor is inherently understood as
   the author of everything except the quoted voices. The pages are his recordings, remarks, and anecdotes rather than
   explicitly attributing everything to the surveyor as to quote him."

## THE FRAME AS HIS FOURTH MESSAGE SETS IT (the chair's reading, said back to him the same minute; vetoable)
- THE SURVEYOR IS NEVER QUOTED AND NEVER NAMED LINE BY LINE: every unmarked sentence is his by default; nothing says "the
  surveyor notes". ONLY TOWNSPEOPLE ARE QUOTED, sparingly.
- HIS PAGES HOLD THREE KINDS OF THING: what he RECORDED (counts, who holds what), what he REMARKS (his judgment of how things
  stand), and ANECDOTES (something he saw or was told).
- WHAT IT SOLVES: of the four kinds of line the voices measure found to break in a townsperson's mouth, three are simply HIS
  (the visitor's-eye line, the thing nobody says aloud, the chronicle): they need no spoken variant. The fourth (a grievance in
  the wrong mouth) is a rule of who may be quoted.
- WHAT IT GIVES THE ENGINE (the chair's proposal for the design): the three kinds are the order of hardness between the
  survey's own claims: a RECORDING matches the record exactly and stands; a REMARK is a judgment, stands unless ruled out,
  yields to a recording; an ANECDOTE is colour, claims least, yields first.
- TWO THINGS THE CHAIR WOULD ADD, HIS TO VETO: the frame is set ONCE, in one line at the head of the dossier or the PDF (in
  the manner of "A survey of <town>, as recorded"); no "I": he is present in what he notices, not as a character.

## WHAT THE CHAIR TOLD HIM IT TAKES HIM TO HAVE APPROVED (said to him the same minute; vetoable in every part)
1. THE FRAME: the document is a survey by ONE OBSERVER; quoted townspeople may see things differently.
2. THE RULE: SAY IT UNLESS SOMETHING RULES IT OUT. Relationships are drawn between CLAIMS ("if this is true, that cannot be"),
   never between sentences. The survey may not be ruled out by the RECORD or by ITSELF on one page.
3. TWO GUARDS: (a) A QUALIFIER STAYS FOR NOUNS: a line that names a thing (a house, a wall, a person, a number) still needs the
   thing to exist (unknown: silent); (b) SCOPED BY VOICE: a quoted person may differ from the survey and from the record; of two
   survey lines that exclude each other, the harder claim stands and the softer yields to a fallback line (no page goes blank).
4. THE PROMISE, reworded to match: "Nothing the survey says is ruled out by the record or by itself. People in the town may see it
   differently." Every changed line of copy is listed for his veto.
5. VOICES AS THE THIRD LAYER, on the design he and the tenth chair settled (`docs/chair/2026-11-24/tenth/PRERELEASE-LIST.md`, the
   three "VOICES" bullets): a SAID line's speaker chosen by the institution its subject belongs to, least-used first; four spoken
   versions of each quote line by the speaker's way of dealing; a manner tag per speaker held on every tab; a deliberately false
   quote only from a legitimate person with a criminal tie, at most one a place, marked for the DM; a criminal house's direct
   quotes DM-only.
6. ALL OF IT BEFORE THE RELEASE.
WHAT IT IS NOT: a loosening for accidents. A clash on a DRAWN relationship is a fault, counted over the corpora with a target of 0.
The record stays exact: it is the DM's ground truth and the answer to "which is right". The hiding of veiled things stays on the
server: the fiction is never the security.

## WHAT IT CHANGES IN THE ENGINE, AS THE CHAIR UNDERSTANDS IT BEFORE THE MEASURE (to be corrected by the measure)
- Today a pool line prints where the record ADMITS it: its declared `needs` hold and its `excludes` do not (`facts/factVocabulary.js ::
  declarationAdmits`, through `facts/drawDeclared.js`), FAIL-CLOSED: an atom the record cannot answer refuses the line.
- THE RULE moves JUDGMENT claims to FAIL-OPEN (an unanswered judgment atom no longer refuses) and keeps NOUN claims fail-closed.
  So every atom of the vocabulary is classed NOUN (a thing that must exist to be named) or JUDGMENT (how things are or seem).
- A SECOND RELATION is added beside "the record admits": "THE PAGE ADMITS": a line's claims against the claims of the lines
  already printed on the same page in the same voice (Daily Life's `stated` set is the precedent). A table of exclusions between
  claims; a precedence (the harder claim stands); a fallback for the one that yields.
- Each line carries its VOICE: the survey's, or a named person's (SAID).

## THE ORDER (the standard's rule 9: the measure that could refute the charter comes first)
- S0, NOW, read-only, two child seats on their own machines: SURVEY-MEASURE (the claims and the clashes) and VOICES-MEASURE (the
  tenth chair's defined measure). Briefs: `prompts/START-SURVEY-MEASURE.txt`, `prompts/START-VOICES-MEASURE.txt`.
- S1: the chair rules the design on the two measures (`SURVEY-DESIGN.md`): the claim vocabulary and its noun/judgment classes; the
  exclusion table's first rows; precedence and fallbacks; the voice mark; what the DM's view shows; the promise's copy; the units
  and their order; ONE NUMBER for the owner (seat-hours and days).
- S2: built in units on child machines, each unit its own commit, red first; every unit that moves a page read by an independent
  reader on the top tier; landings as today (the joined tip's whole suite in shards). BIRTHS: a SAID line chosen at view time moves
  no birth; anything stored at birth (a speaker held on a record) is named for the owner's golden signing, once, at the end.
- S3: COLD-READ-20 is the acceptance test of the new promise; the bar is the owner's number.
- IT DOES NOT DISTURB what is in flight: points 121, 122 and 123 cure accidents and are right under either rule. The share veil
  resumes on child machines beside it.
