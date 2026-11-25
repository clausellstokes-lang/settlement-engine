# THE RULINGS FOR THE FOUR SEATS OF 2026-11-25 (BIRTH-1, BIRTH-2, WORDS-1, WORDS-2): the tenth chair

**G1 (09:11 UTC on 2026-11-25): A5, THE STANDING SENTENCE AS ITS OWN FIELD: "BESIDE", ON SEVEN TERMS.** BIRTH-2's measure
(09:10; nothing built): the sentence is written once (`factionStanding.js :: annotateFactionStanding`) and re-written
by four settlers at birth (`applyDensityLaw.js :: resizeSeats`, `rosterText.js :: settleStandingToRoster` and
`settleStandingToLegitimacy`, `factionStanding.js :: settleSeatHolderToRecord`); three editors change a description
after birth (the user's edit, the rename, the AI refine); seven readers print a description and two decide on its
words. ITS PROPOSAL, TAKEN: a new field on each power holding the tail; the description stays exactly as today; the
hiding cuts the description's end where it equals the field; an old record has no field and is cut by the frozen
table. (The other shape, the description losing its tail, would re-write seven readers, four settlers, three editors
and a play path, and a missed reader would silently drop a sentence.) Bytes: about 440 a birth, 0.2 to 0.3 per cent.
THE TERMS:
1. THE FIELD IS PRIVATE BY ITS NAME: a new key on a power is served until a veil lists it, and that must not depend on
   a paused lane. Its name matches `publicSafe.js :: PRIVATE_KEY_RE` and the SQL sanitiser's same token as they stand;
   proven on C and V (no such key in `toPublicSafe` of any birth, at any depth), the SQL token cited.
2. '' where a new place's power has no tail; ABSENT on an old record; a load never adds it (an old record round-trips
   byte-equal). The veil can then tell "new, no tail" from "old, unknown".
3. Every statement that writes a tail sets the field in the same statement: the writer, the four settlers, and the
   play path of a transfer if it writes one (that one statement only: it is advance time; more than that is named,
   not built).
4. The rename applies to the field as to the description; the user's edit and the AI refine leave it (a description
   that no longer ends with its field is the veil's fail-closed case, by design).
5. No reader changes: byte-equal on C and V for every page, the PDF and Foundry view model, the AI grounding payload
   (the field reaches no prompt) and the search index; an export that would carry the raw key is named.
6. The record equal but for the new key; the field equals the writer's own output for every power of every birth; the
   description ends with the field wherever it is not ''.
7. FOR THE VEIL's LANE AT ITS RESUMPTION (written in BIRTH-2's hand-in; it touches none of it): the field joins what no
   non-owner read sends (a Reveal-DM read keeps private keys); the cut is "the description's end where it equals the
   field"; the old-record path stays the frozen table (V14, V15, V25, V27 stand for it).
