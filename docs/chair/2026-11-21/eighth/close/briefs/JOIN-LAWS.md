# BRIEF JOIN-LAWS: ONE SAVED-PLACE TEST OVER `GENERATION_LAWS` (CLOSE-1 unit 3; DRAFT, written 2026-11-22 08:09 UTC, read from `date -u`)

STATUS: DRAFT, NOT DISPATCHED. It is built only after the chair (1) has read its plan and (2) names the working line's
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
2. THE ONE BIRTH PIN: the new file's arm (g) pins `birthConfig(null)` ONCE, from the rows' own mints; the three
   wiring files' arm-1 pins (`livingContentLawWiring` CREATE (LIT), `seatLawWiring` 1, `fortuneLawWiring` 1) are
   cut to the law's OWN key (present or absent) and point to arm (g) in a comment. FOR THE CHAIR'S RULING.
3. `seatLawSavedTown.test.js` and `fortuneLawSavedTown.test.js`: the arms the new file now holds are REMOVED;
   the law-specific arms stay (seat: the two transfers; fortune: the surveyor's unminted preview); each file's
   header says where the shared arms went. FOR THE CHAIR'S RULING (the worklist says "replaces").
4. THE ATOM TEST (item (1)'s last clause): held for the chair's ruling (measure item 5: no atom `seat contested`
   exists on the tree).

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
