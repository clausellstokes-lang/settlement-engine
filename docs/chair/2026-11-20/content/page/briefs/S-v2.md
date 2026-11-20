# S, SECOND CUT (written 2026-11-20 11:48 UTC): supersedes S.md where they differ. The chair's routing of 11:24/11:26: S1 is L4, S2 is S9.

**WHY.** S.md's S1 (title rows read by `titleLinesFor`) swapped generateFactionLeaderSecret's TWO draws for ONE, and the
builder measured the cascade (300 towns): 339 of 341 titled cards moved power, presentation, goal and temperament, and 145 other
cards moved through the shared held-secret set and through ties (relationships in 117 towns). It also adds keys to
`TITLE_SECRETS`, which two tests pin at 147, one of them a test of another seat's module. Both are refused.

## L4 (commit 1): office secrets, settled draw-free AFTER the draw
- A NEW file `src/data/people/officeSecrets.js`: `OFFICE_SECRETS`, title → three `{ secret, stakes }` rows (the row shape),
  with a header in the voice and law of `titleSecretsPresentations.js`'s header. `TITLE_SECRETS` and its tests are NOT touched.
- THE TITLES, keyed by the title the draw reads (`options.title`; the gendered form is applied after every draw, so an abbess
  draws as the abbot): the dean, the bishop, the priest, the abbot, the senior abbot, the chief magistrate, the watch captain,
  the garrison commander. Enumerate from `people/poolMap.js :: POOL_BY_TITLE` the other titles of the same pool roles
  (e.g. the magistrate, the captain of the watch, the watch commander) and say which share a row set (rows shared by two
  titles must read true of both; otherwise their own).
- THE DRAW IS UNCHANGED: `generateFactionLeaderSecret` draws exactly as today, and the held set receives the DRAWN text as
  today, so every later card's refusals are what they were. THEN, draw-free, a card whose title has office rows takes one:
  `pickVariant(rows, `${seed}::officeSecret::${cardKey}`)` (find a stable key the card carries at that point, its id or
  its title plus its house), walking in row order past a row the held set holds, and that text is added to the held set too.
  Where it lands (`npcGenerator.js :: generateSingleNPC`, at most a few lines) is yours to say.
- MEASURE BEFORE COMMIT on the 300 (your dump/diff scripts): the fields that move. EXPECTED: only `secret` on the office
  cards, plus what READS a secret's text after birth (name each: a temperament that yields to the new secret
  (`npcData.js :: temperamentYieldsToSecret`), a goal or tie that reads it, the presentation modes chosen from the secret's
  text, pressureSentence). Any field that moves for another reason, or any card that is not an office card, is a finding: stop.
- THE LINES: as S.md's S1 voice and law (small, human, true to the calling, the holder's own office and house: a magistrate's
  docket and fees, a watch captain's roster and night keys, a garrison commander's stores and drills; no murder, no named
  person, no power or house the place may lack). All of them in `docs/chair/2026-11-20/content/page/S1-LINES.md`, each title's
  three beside the line its cards drew most at the base. The chair reads them before the merge.

## S9 (commit 2): the role-free pool tagged, and the temperament read, by one draw-free walk
S.md's S2, plus: the card-level `admits(row, card)` also refuses a VENAL row (its money words: the `incorruptible` pattern of
`npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT`) to a card whose temperament is `principled` (pass the card's drawn dominant
temperament into the secret draw: it is drawn BEFORE the secret in `generateSingleNPC`). The temperament is read; the guard
table is NOT edited (adding the word there moves draws). Walk exactly as S.md says; measure the principled-and-venal count
(PAGE-1: 1,014 of 5,452) before and after, and what else moves. The office rows of L4 are also checked by `admits`.

## S3 (commit 3): as S.md, with (a) reading "own rows" as `TITLE_SECRETS` OR `OFFICE_SECRETS`.

FILES YOU OWN: `src/data/people/officeSecrets.js` (new), `src/generators/npcGenerator.js` (the call site only; another unit
of PAGE-2 edits `powerBandOfRole` later, not you), `src/data/npcData.js` (the tag table only), `src/generators/npc/factionLeaderSecret.js`,
new tests, the docs named. One commit per unit; tell PAGE-2 at once if you reword or re-key any EXISTING secret row
(another seat reads rows by text).
