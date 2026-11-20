# U2-CURE2 — the one-home export the line's titles test reads (CS6). Builder B2d. Read `briefs/COMMON.md` (all of it) and `briefs/U2-TABLE.md` first.

**The red (found by SEAT-2 at the merge, executed).** After U2's merge onto the lane, which already holds the line's point 78, `tests/data/cultureOfficeTitles.test.js` fails to load. At its line 16 it imports `GOVERNMENT_PREFERENCES` from `src/domain/rulingPower.js` and spreads `Object.values(GOVERNMENT_PREFERENCES).flatMap((row) => Object.values(row))`. U2 removed that export, so it reads `undefined`: "TypeError: Cannot convert undefined or null to object". That test is the TITLES lane's, NOT YOURS: do not edit it.

**The cure.** `rulingPower.js` exports `GOVERNMENT_PREFERENCES` again, as a frozen VIEW DERIVED from the one table (`seat/seatTable.js`). It is never a second spelling of a form. It has the old shape and the old values byte for byte: every key the old object held (the 13 archetypes, civic and other included), each `{ small, town, large }` = the transfer's own form of that kind and band (`preferredFormOf`). Put the derivation in `seatTable.js` (for example `transferFormsView()`, or a frozen export) and let `rulingPower.js` re-export it, so the forms still live in one home. U2's pin "the old table lives in the one home: rulingPower.js spells none of its forms" keeps its first half, which forbids every form literal in `rulingPower.js`. Its second half, `not.toMatch(/\bGOVERNMENT_PREFERENCES\b/)`, is narrowed to forbid a second DECLARATION of the forms only (it must still red if `rulingPower.js` declares an object literal of forms). Say exactly how you narrowed it.

**Files you own:** `src/domain/seat/seatTable.js`, `src/domain/rulingPower.js`, `tests/domain/seat/seatTable.test.js`.

**Red first:** (a) `GOVERNMENT_PREFERENCES` imported from `rulingPower.js` deep-equals the literal `TODAY` object already in `seatTable.test.js` (which carries every key and value), and is frozen to its leaves; (b) `tests/data/cultureOfficeTitles.test.js` loads and passes unchanged. Record red, then green.

**Greens:** your arms; `tests/data/cultureOfficeTitles.test.js`; every test file naming `rulingPower`, `factionCompetition` or `seatTable`; `tests/architecture/layerBoundaries.test.js`, `engineCoreLazyEdge.test.js`; `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`. NOT `tests/lint` whole: SEAT-2 runs it at the merge. Never touch a census, register or baseline file.

**Hand back** in at most 200 words: commit, red → green, how the pin was narrowed, CONFIRMED vs PLAUSIBLE. Do NOT push.
