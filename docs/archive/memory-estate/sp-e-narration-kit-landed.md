---
name: sp-e-narration-kit-landed
description: "SP-E landed @ 7a77c84b — kind-pool floors are DERIVED from SIGNIFICANCE_CLASSES rank in tests/helpers/kindPoolWalker.js, never transcribed; the walker family is NINE not four; 28 under-floor kinds and 274 unvoiced tokens frozen shrink-only"
metadata:
  node_type: memory
  type: project
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-06T19:03:05.196Z
---

SP-E (the FP SP program's last wave) landed 2026-08-06 on branch
`claude/composite-r4` in `.claude/worktrees/minifold`: build commit
**`7a77c84b`**, ledger row **`a916c0f2`**, parent `1b111399`. COMMITTED, NOT
PUSHED. No flag, zero engine behavior changes; the only `src/` file is a pure
certification leaf consumed by nothing at land time.

**THE ONE RULE A FUTURE VOLUME MUST OBEY:** a new kind-pool walker IMPORTS
`tests/helpers/kindPoolWalker.js` and never re-types a floor table.
`FREQUENCY_FLOORS` is DERIVED as `CHRONIC_FLOOR - significanceRankOf(cls) *
CADENCE_STEP` (= routine 8 / notable 6 / major 4) from `SIGNIFICANCE_CLASSES` in
`src/domain/worldPulse/bandFamilies.js`. The ladder INVERTS against significance
because the floor scales with how OFTEN a kind fires, not how much it matters.
GR-0's `n/a` is a caller-passed `declaredExceptions` entry, never a family
member — `floorFor` THROWS on an undeclared class.

**MEASURED AT THIS COMMIT (re-measure; §2c forbids quoting a volume's figure).**
Nine files match `tests/lint/*KindPools.walker.test.js` — the docs' "four" is
stale. Four transcribe the floor table; five pin a hard-coded
`toHaveLength(5)` (CR-FP-7's fixed-five class). Nine registries hold 106 kinds;
`EXACT_SECTION` routes 374 tokens; 274 routed tokens have NO pool at all; 28
registered kinds sit under their own floor, every one at depth EXACTLY 5. Both
backlogs are frozen shrink-only in `tests/lint/kindPoolFloors.walker.test.js`
per J-SP-8 — the walker is GREEN AT BIRTH and must stay so.
`warConvergenceContract.js` measures **515 effective / 953 raw**, not the
volume's "820"; it was NOT edited (the envelope is its own leaf).

**Why the backlog is not an amnesty:** every member must still name a live
registered kind, and every member's depth of 5 is asserted PER ROW, so a
backlogged pool cut to 3 reds instead of hiding inside its own entry.

**How to apply:**
- Building a herald wave? `import { registrationReasons, floorViolations } from
  '../helpers/kindPoolWalker.js'` and pin the returned SORTED TYPED REASON SET
  with `toEqual` — never a boolean (the credit-side-fails-open class).
- Deepening a pool past its floor? DELETE its entry from `LEGACY_UNDER_FLOOR`
  and lower the count; the walker reds if a backlogged kind now passes.
- Adding ANY test file to this repo? `tests/lint/sovereigntyLightingContract
  .walker.test.js`'s CENSUS block reds. Re-measure files/parked/credited/titles/
  suiteTitles from a `git archive` of your ACTUAL PARENT carrying only your own
  files — never off the shared working tree — and state the split if you absorb
  an inherited delta. SP-E absorbed +5 titles left by the ES-1 repairs.
- Committing while another lane holds uncommitted hunks in a file you must also
  edit (`scripts/mutation-coverage-manifest.json`, `docs/FABLE_VALIDATION_QUEUE
  .md`)? Build the staged blob as HEAD+yours, `git hash-object -w`, then `git
  update-index --cacheinfo 100644,<sha>,<path>`. Their hunk stays on disk and out
  of HEAD; verified both ways after the commit. This is the serialized-landing
  idiom applied to a shared file rather than a whole wave.

**Two latent vacuities this wave found and repaired (both were GREEN before):**
the envelope's power filter was unreachable at its default ceiling (see
[[unreachable-predicate-conjunction-class]]), and
`tests/lint/spBandFamilies.walker.test.js`'s re-spelling mutant re-spelled only
`band edges` / `half-life`, so for a wave whose rows contain neither the map was
an IDENTITY and the arm failed having planted NOTHING. SP-D will hit the same
arm when it lands its Bands line — it is now wave-agnostic and asserts the plant
changed the value first.

**Still owed after SP-E:** SP-D is the last SP wave owing a `**Bands:**` line
(`SP_WAVES_OWING_A_BANDS_LINE`). The 28 pool deepenings and the 274 unvoiced
tokens are the content annexes' wiring waves'. The SP-6a display migration is
each surface's own small wave — `tests/lint/significanceMigration.census.test.js`
names 20 debtor modules, and records that
`src/domain/realm/realmItemReadModel.js`'s `significanceOf` grades against a
FOURTH vocabulary `{major, critical, moderate, minor}` in which neither
`notable` nor `routine` appears, so 65 of the 106 registered kinds fall through
to the same 0.35 an item with no significance receives.

Related: [[fp-sp-a-band-families-landed]], [[sp-b-believed-world-axes-landed]],
[[credit-side-enumeration-fails-open]],
[[fp-cycle1-serialized-landing-and-cq5-row-guard]],
[[derive-dont-restate-and-mutant-must-change]].
