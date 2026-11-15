# TAIL-CLOSE-SECRET-1 — hand-back

**For the owner, in plain words:** in about one town in a thousand, two people shared one secret; now the later one takes a different secret. Nothing else changes.

- Branch `lane/tail-close-secret-2026-11-15`, cut from `lane/join-2026-11-14` at `f8042b61a` (the tip matched).
- Cure: `b778c3f9a`, one file of source, `src/generators/people/castPowers.js`. Nothing merged.

## The fault, the cause, the cure

- **Fault.** `tests/generators/rosterDuplicateDraws.test.js`, the arm "no roster repeats a secret", was red in 1 of 1000 rosters. In soak1k-653, Hinrik Wenzel (`npc_power_newcomers_settlement`, the late mint) and Sophia Frank both held "On the payroll of the local underworld as a silent informant".
- **Cause.** `1022e9887` rewrites a late mint's secret after its draw (`withTownsOwnUnderworld`). The draw's refusal (`npcGenerator.js`: `hookRegistry.secrets.has(text)`) compared the raw line ("… thieves' guild …") against roster secrets that `mergeNPCLists` had already rewritten.
- **Cure.** Inside `landMemberships`:
  - The registry's `secrets` is now a small local `Set` subclass, `CarriedSecrets`. Its `has` holds a line when the roster holds the line itself OR its carried form, `withTownsOwnUnderworld(text, crime.signal, crime.faction)`.
  - `crime` is now computed before the registry is built.
  - After the rewrite, the carried text is `add`ed, so a second late mint cannot take it either.
  - I checked the readers on the mint's path: `has` and `add` in `npcGenerator.js`, `has` in `factionLeaderSecret.js`, and `size`/`has` in `hookVariety.js :: drawRefusingHeldThrough`. `representatives.js`'s `held:` belongs to `generateRepresentatives`' own registry and is not on the mint's path.
- **Draw-free.** The refusal falls through its pool in seed order with no further roll.

## Measures (base `f8042b61a`, tip `b778c3f9a`)

| # | Measure | Base | Tip |
|---|---|---|---|
| 1 | `rosterDuplicateDraws` — "no roster repeats a secret" | **red**, 1 of 1000 (soak1k-653) | **green** |
| 1b | same file — stored "rosters of two or more" (853) | red, reads 889 | red, reads 889 (not this lane's; left as found) |
| 2 | 1,000 soak births, sha256 of each settlement | — | **1 moves: soak1k-653**. Field diff, 2 leaves: `npcs[4].secret.what` ("On the payroll of the local underworld as a silent informant" → "Has been falsifying inspection records for a fee") and `npcs[4].secret.stakes` (which comes from that secret). Nothing else moves |
| 3 | 525 reference configurations (`goldenCorpus`, born as `generatorGoldenMaster.test.js` bears them), sha256 | 525 hashed | **0 of 525 differ** (no keys to re-take) |
| 4 | `tests/generators/people/mintedFaceUnderworld.test.js` | green | green |
| 5 | `presumed-things-door.mjs --check` | fresh 0 · stale 0 · banked 4690 · strips banked 107 | byte-identical output |
| 5 | `check-writer-reach.mjs` | judged 12661 · LIT 691 · LIT-NAME 10563 · DARK 1407 (reviewable 389) | byte-identical output |
| 5 | `check-observed-shape-readers.mjs` | exit 0 | byte-identical output |
| 6 | Governing suites (19 test files naming `castPowers`/`crimeSignal`, plus `rosterDuplicateDraws`; 355 tests) | 4 red: `worldFactRederive` A7, `rosterDuplicateDraws` 853, `rosterDuplicateDraws` secret arm, `x46NpcBand` (iii) | 3 red: the same set minus the secret arm. **No new red** |
| 7 | `npx eslint src/generators/people/castPowers.js` | — | exit 0 |
| 7 | `npm run typecheck:domain:strict` | — | exit 0 |
| 7 | `npm run typecheck:ratchet` | — | exit 0 (167, ceiling 167) |

All gate runs went through `sh scripts/gate-tail.sh`. Every run was written to a file in a scratch clone outside the main checkout, with its own `npm ci`. The scripts were `measure.mjs` (soak and golden hashes), `fielddiff.mjs` and `reds.mjs`.

## Reference configurations that move, by key

None. 0 of 525.
