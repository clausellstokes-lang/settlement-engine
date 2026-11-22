# BRIEF JOIN-LAWS: ONE SAVED-PLACE TEST OVER `GENERATION_LAWS` (CLOSE-1 unit 3; DRAFT, written 2026-11-22 08:09 UTC, read from `date -u`)

STATUS: PLAN APPROVED BY THE CHAIR (E61, 2026-11-22 08:56 UTC; this paragraph written 2026-11-22 09:07 UTC). NOT DISPATCHED until the chair names the working line's
tip with BOTH laws on it (points 97 and 98). One builder (a subagent of CLOSE-1), its own worktree, its own -wip
branch `lane/close-1-2026-11-22-join-wip`. It lands as "JOIN <commit>" by COMMON-RULES 8, like every lane.

## The measure it stands on
`docs/chair/2026-11-21/eighth/close/measures/JOIN-LAWS-MEASURE.md` (items 1 to 5). In short: `birthConfig` and
`GENERATION_LAWS` are already the union on the joined tree (the landing makes it); what the join still owes is the
TEST side: two saved-place files with two harness shapes and no arm that lights both laws, and three pins of
`birthConfig(null)` where COMMON-RULES 14 (c) wants one.

## What the builder builds (THE FILES IT OWNS: nothing else)
1. NEW `tests/domain/generationLawsSavedPlace.test.js`. ITS HARNESS reads `GENERATION_LAWS` (every row with a
   `dial`, a `module`, a `mint` and a `configKey`) and lights a law by `vi.doMock` of the row's `module`
   with the real reader kept and only the dial and the mint set (the SAVED-TOWN form,
   `fortuneLawSavedTown.test.js :: buildUnder`, generalised to a SET of lit laws; the seat law's second dial
   `seatCircumstances.js :: SEAT_CONTEST_LIT` is lit WITH the seat row, as SAVED-SEAT's `dial.lit` does). A row
   whose dial is ALREADY lit on the tree (density, living content) is walked as such and never mocked.
   ITS ARMS, each for EVERY law row at once (a future law is covered by adding its row, never by a new file):
   (a) NO MIGRATION: a place born with every law dark keeps every law at 1 through save, load, section regen, the
   edit re-derive (`regenerateWithLayer`), the clone seam, the tick re-derive (`applyRosterDecreesAtTick`) and the
   import scrub, ON A BUILD WITH EVERY DIAL LIT; (b) THE CONVERSE: a place born lit keeps every marker through the
   same steps; (c) INDEPENDENCE: each law lit ALONE marks only its own key (no law's marker rides another's mint);
   (d) "Apply Saved Configuration & Regenerate" and the full reroll are BIRTHS (every marker minted lit); (e) THE
   LEGACY EDGE, both shapes (no `config`; `_config` but no `config`); (f) NEGATIVE CONTROLS: each arm's
   discriminator shown live (the same step on a place stamped lit differs).
2. THE ONE BIRTH PIN (RULED, E61 (5)): the new file's arm (g) pins `birthConfig(null)` ONCE, from the rows' own mints;
   the three wiring files' arm-1 pins (`livingContentLawWiring` CREATE (LIT), `seatLawWiring` 1, `fortuneLawWiring` 1)
   are cut to the law's OWN key (present or absent) and point to arm (g) in a comment.
3. `seatLawSavedTown.test.js` and `fortuneLawSavedTown.test.js`: the arms the new file now holds are REMOVED;
   the law-specific arms stay (seat: the two transfers; fortune: the surveyor's unminted preview); each file's
   header says where the shared arms went, and each kept arm is RE-TITLED to say it is that law's own (E61 (4)).
4. THE ATOM `seat contested` IS NOT JOIN's (E61 (6)): it is the state-sentence lane's unit SEAT-TOWN (PROSE-5: the
   atom, its one reader `seatContestedOf`, and its own test pinning it to the page's risk word under both laws), which
   lands after who rules' U6 cures law 1's `contestedBy`. JOIN pins nothing about it.

## THE ARM TABLE (E61 (4)): every old arm and its new home (none lost unseen; the builder re-reads each file WHOLE
and corrects this table where a title differs, in its report)

| file :: arm (as titled at the join scratch 4bba8781d) | new home |
|---|---|
| seatLawSavedTown 1. NO MIGRATION (save, load, regen, clone, both transfers) | the new file (a) for save/load/regen/clone; THE TWO TRANSFERS STAY in seatLawSavedTown, re-titled as the seat law's own |
| seatLawSavedTown 2. THE CONVERSE | the new file (b) |
| seatLawSavedTown 3. "Apply Saved Configuration & Regenerate" is a BIRTH | the new file (d) |
| seatLawSavedTown 4. THE LEGACY EDGE | the new file (e) |
| seatLawSavedTown 5. THE IMPORT (gallery file, reconciled export) | the new file (a)/(b) import step |
| seatLawSavedTown 6. THE RE-DERIVE ROAD at the tick | the new file (a)/(b) tick step |
| fortuneLawSavedTown 0. the fixture: born dark is markerless, law 2 WOULD move it | the new file (f), per law |
| fortuneLawSavedTown 1. NO MIGRATION (save, load, regenSection, edit re-derive, clone) | the new file (a) |
| fortuneLawSavedTown 1. NEGATIVE CONTROL | the new file (f) |
| fortuneLawSavedTown 2. THE CONVERSE | the new file (b) |
| fortuneLawSavedTown 3. THE SURVEYOR'S PREVIEW is UNMINTED | STAYS in fortuneLawSavedTown, re-titled as the fortune law's own |
| fortuneLawSavedTown 4a. "Apply Saved Configuration & Regenerate" is a BIRTH | the new file (d) |
| fortuneLawSavedTown 4b. the full reroll is a BIRTH | the new file (d) |
| fortuneLawSavedTown 5. THE LEGACY EDGE | the new file (e) |
| fortuneLawSavedTown 6. THE IMPORT | the new file (a)/(b) import step |
| livingContentLawWiring "CREATE (LIT, the product path)": the `birthConfig(null)` value | the new file (g), THE ONE PIN (E61 (5)); the arm keeps its own key only |
| seatLawWiring 1. CREATE (dark): `birthConfig(null)` byte-equal | the new file (g); the arm keeps `_seatLawVersion` present/absent only |
| fortuneLawWiring 1. CREATE (dark): `birthConfig(null)` byte-equal | the new file (g); the arm keeps `_fortuneLawVersion` present/absent only |
| livingContentLawWiring "⛔ a PERSISTED law-1 world survives load, section regen and the clone seam unstamped" | STAYS (the living-content law's own wiring file); the new file's (a) covers the same steps for EVERY row, living content included: the builder says in its report whether the arm is then a duplicate, and the chair rules its removal |
| fortuneLawWiring 7. "the leaf's header says the fortune law is never lit before the seat's law" | STAYS (a text pin of the lighting ORDER, not of darkness); it holds at the flip because both dials flip in one unit |

CHECKED AGAINST `lane/stack-98-wip-2026-11-22` at 7c03296d8 (2026-11-22 13:13 UTC, read-only): every title above is the same there;
`densityCreateBoundary.js` differs from the trial join 4bba8781d by one comment line (` *`), so the union is as measured.

## Files the builder owns
NEW `tests/domain/generationLawsSavedPlace.test.js`; `tests/domain/seat/seatLawSavedTown.test.js`;
`tests/domain/fortuneLawSavedTown.test.js`; `tests/domain/livingContentLawWiring.test.js`, `tests/domain/seatLawWiring.test.js`,
`tests/domain/fortuneLawWiring.test.js` (arm 1 only); the registers their doors re-take. Nothing under `src/`.

## The proofs (red first, then green; ALL through `scripts/gate-mutex.sh`, each to a log, never through a pipe)
- RED FIRST, by plant-and-restore on a scratch copy: `birthConfig` with one clamp removed reds arm (a); one mint
  dropped reds (d) and (g); a mint that writes another law's key reds (c).
- GREEN DARK on the line's tip and GREEN on CLOSE-1's lit scratch (the three dials flipped): the new file, the two
  trimmed files, the three wiring files.
- `tests/lint` WHOLE after the change (COMMON-EIGHTH 11), the lighting census and the mutation manifest re-taken by
  their doors if they red (the new file's basename avoids the manifest's name pattern); typecheck:ratchet,
  typecheck:domain:strict, lint.

## Kept laws
No `src/` file is touched. No golden, no stored digest of whole births (COMMON-RULES 14 (c)). Plain tests, not
`it.each` (the lighting census's park count). The builder commits by explicit paths; it never pushes.
