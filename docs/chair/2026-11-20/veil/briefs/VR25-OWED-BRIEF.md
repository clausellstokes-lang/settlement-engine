# VR25-OWED BRIEF — the two rows owed with VR25 (a test-only builder, beside a stage)

Written by VEIL-21 (seat of the seventh chair; assignment `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-21.txt`). You are a TEST-ONLY BUILDER working for VEIL-21 beside the stage
builder: you change NO file under `src/`, `supabase/` or `scripts/` except as said below, and NEVER 212, its rollback,
the twin's rule files (`src/domain/display/gallerySecondHomes.js`, `galleryVeil.js`) or the registry module. MEASURE
FIRST, RED FIRST.

## Where you are
Your worktree and branch are named in the message that sends you this file. You COMMIT ON YOUR BRANCH by explicit paths
(one commit per unit below, the receipts in each message) and NEVER push. Read whole before any edit: `CLAUDE.md`; PART 21
sections 5 and 5e (`docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART21.md`); `src/domain/veil/importRederive.js`;
`src/store/galleryImportSettlement.js`; `tests/store/galleryImportRederive.test.js`; and, for unit 2,
`tests/lint/observedShapeReaders.walker.test.js` and `scripts/lib/observed-shape-corpus.mjs`.

## THE LAWS (binding)
211's two files byte-frozen (`eface6d0…be0b01`, rollback `ce8474ff…49712f`). ALL DATABASES LOCAL (pglite or the
seat's scratch PostgreSQL 16, unix socket `/var/tmp/rv7`); no hosted database, no production credential, no
`supabase` command, no deploy, no push, no pull request, never `--no-verify`, never the whole suite, no test run with any
of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY, GIT_PREFIX, GIT_NAMESPACE in the
environment; `package.json` / `package-lock.json` untouched. Every gated line through `scripts/gate-mutex.sh --run`
(`GATE_MUTEX_TIER=shared`, `--maxWorkers=2`); read a gate with `sh scripts/gate-tail.sh`, never through a pipe. A frozen
figure (an inventory count, a baseline) is NEVER raised by you.

## UNIT 1 — the ruined-house import measure (the chair's grant of VR2's form, 2026-11-20 02:14 UTC, OWED with it)
The ruin-filter walker's exemption for `importRederive.js` is GRANTED (pin 116 -> 117, applied at 408f8e508). OWED: take
born towns, give one a RUINED house (a house the engine marks ruined, as the ruin filter reads it), store it with the
default veil, read it as anon through the server, import it through the tree's own import (as
`galleryImportRederive.test.js` does). For EACH of the ten fields `rederiveServed` re-derives: does the re-derived value
mis-draw against that same town's own recomputed value (the engine's birth deriver over the town with its ruined house as
born)? Report the count per field and the examples. A field that mis-draws is LEFT OUT by the import, not drawn wrong:
that change is in `src/domain/veil/importRederive.js`, which IS yours for this unit only if a field mis-draws — then
red first (the mis-draw shown on the born ruined town), green (left out), and send the seat the count before you commit.
Output files under `docs/chair/2026-11-20/veil/out/v21/vr25-owed/`.

## UNIT 2 — `observedShapeReaders` cured BY OBSERVATION (the chair, 02:14 UTC: no raise, no exemption for a false positive)
At the base after VR25, `tests/lint/observedShapeReaders.walker.test.js` reports 4 violations (1 at the cut: the
switch's, not yours; 3 new: "magicExists on config" in `src/generators/economy/prosperity.js`,
`src/generators/foodGenerator.js`, `src/generators/priorityHelpers.js`), because the scanner grounds their `config`
parameter from the import's call through the served document's config, which its corpus never saw carry `magicExists`.
MEASURED by VEIL-20: born and served configs carry `magicExists` (true, and false with magic off); fidelity holds with
magic off (36 of 36). THE CURE: show the scanner's corpus a SERVED config carrying `magicExists`, true and false, by the
corpus's own door (a producer the corpus runs), so the three findings leave by observation and the count returns to 1.
Measure first: reproduce 4, find the corpus's door. ONLY IF the walker has no door for a served config: an
explained-writer row naming the writer and the measure (36 of 36) — and tell the seat before writing it. Red: the count 4
at the base; green: 1, the remaining one the switch's. The corpus's other figures (the walker's own pins) unchanged, or
each change named.

## UNIT 3 — the import KEEPS THE SERVED prosperity band (PART 21 5e point 1; placed here by the chair, 02:42 UTC)
Under VR28 the prosperity band (`economy.prosperity`) is SERVED as stored (tier 2; it stays diffuse as R1 registered it).
`src/domain/veil/importRederive.js` (step 4) re-derives prosperity today and drops it where a Subsistence base leaves it
unknown. THE CURE (this file is yours for this unit): keep the served band where present; fall to the re-derivation only
where it is absent; the dependent steps (conditions, legitimacy breakdown, readiness) read the served band
(`underEachOutcome` keeps working with one outcome). RED FIRST in `tests/store/galleryImportRederive.test.js` (or a sibling):
a born Subsistence town whose served band the import drops or changes today; GREEN: the importer's record carries the
served band, and the dependent fields agree with it. The file's five existing tests stay green; `typecheck:domain:strict`
and `typecheck:ratchet` through gate-tail; the ruin-filter walker 12 of 12.

## WHAT GREEN MEANS
Each unit's red and green kept as files; `npx eslint <touched files>`; the touched test files and
`tests/store/galleryImportRederive.test.js`, `tests/lint/ruinFilterRoster.walker.test.js` green. Your final message: at
most 300 words per unit: the commit, the counts, red and green, CONFIRMED told from PLAUSIBLE. Stop at about 300,000
tokens of your own context.
