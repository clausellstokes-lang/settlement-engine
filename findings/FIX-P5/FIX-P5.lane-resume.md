# FIX-P5 — PAUSED AT THE GATE (batch 1 of 6)

Lane: Opus FIX-P5 (parallel). Worktree `$SP/lane-fix-p5`, branch
`fix-floors-labels-2026-09-20`, cut at 63e40fe57. Scratch `$SP/lane-fix-p5-scratch/`.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
`M="GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20"` — SPELL IT
INLINE on every command (zsh does not word-split an unquoted expansion; EXIT=2, no count line).

**ALL EDITS ARE DONE.** Every finding is cured or stopped-with-a-measurement; nothing is
half-written and no file is staged. What remains is proof, then four commits. Goldens
verified identical before the first edit and after the last. The route census moves exactly
one row (`/pricing`); every other row is byte-identical to the untouched base tree.

⛔ NOTHING IS COMMITTED YET. Commit only after the batch that proves it.

---

## THE FILES, BY COMMIT GROUP

**Group A — F9 + F16 + noticed 4** (`FIX-P5: the floors, the lock mark and the check reach /pricing`)
```
src/components/PricingPage.jsx
src/components/pricing/PricingBands.jsx
src/components/pricing/PricingTierCards.jsx
tests/components/phoneFloorCensus.shared.mjs
tests/components/phoneChromeFloor.census.test.js
tests/components/publicChromeFloor.census.test.js
tests/components/lockedPriceSlots.census.test.js
tests/components/launchLock.pricing.test.jsx
```

**Group B — F8 + noticed 7 (F7 is a measurement, no code)** (`FIX-P5: the phone bar's seats hold their words, and the painted control's overhang is measured`)
```
src/App.jsx
tests/lint/phoneBarOrder.walker.test.js
tests/components/arrowGeometry.test.js
```

**Group C — F14** (`FIX-P5: one tier word on every reader-facing surface`)
```
src/components/new/design.js
src/pdf/lib/viewModel.js
src/domain/display/humanizeEngineTokens.js
tests/copy/tierWord.census.test.js        <-- NEW FILE (untracked; `git add` it explicitly)
scripts/mutation-coverage-manifest.json   <-- its rationale row
```

**Group D — noticed 6** (`FIX-P5: a dossier badge's capitals belong to its style`)
```
src/components/new/SummaryTabV2.jsx        <-- also carries F14's tier read; commit with D
src/components/new/SummaryTab.jsx
src/components/new/SupplyChainsPanel.jsx
src/components/new/npcComponents.jsx
src/components/new/tabs/HistoryTab.jsx
src/components/new/tabs/NPCsTab.jsx
src/components/new/tabs/RelationshipsTab.jsx
src/components/new/tabs/ResourcesTab.jsx
tests/components/dossierLabelCase.test.jsx
```

---

## BATCH 1 (RESUME HERE) — GROUP A's RED-FIRST PROOF, THEN ITS GREEN

⛔ Red-first is its own batch. Plant, run, quote the red, RESTORE, then run green.

```sh
# (1a) PLANT: one 12px paragraph loses its prose helper (the F9 half no instrument saw).
cd "$SP/lane-fix-p5" && perl -0pi -e "s/fontSize: proseFontSize\(FS\.sm, mobile\), color: BODY, fontFamily: sans, fontWeight: 600, lineHeight: 1\.55/fontSize: FS.sm, color: BODY, fontFamily: sans, fontWeight: 600, lineHeight: 1.55/" src/components/pricing/PricingBands.jsx
# (1b) PLANT: the ladder's priced cell loses its lock mark.
cd "$SP/lane-fix-p5" && perl -0pi -e "s/const lockedCell = \(text\) => !purchasesAreOpen && CELL_QUOTES_MONEY\.test\(text\);/const lockedCell = () => false;/" src/components/pricing/PricingBands.jsx
# (1c) RUN — EXPECT RED in publicChromeFloor (prose-floor arm + roster baseline) and in
#      launchLock.pricing (the ladder arm). Quote both count lines.
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components/publicChromeFloor.census.test.js tests/components/launchLock.pricing.test.jsx
# (1d) RESTORE — `git checkout --` is legal here: this is withdrawing MY OWN plant.
cd "$SP/lane-fix-p5" && git diff --stat src/components/pricing/PricingBands.jsx   # sanity: one file
```
⚠ Do NOT `git checkout --` the whole file (it would discard the lane's real edits). Undo the
plant with the inverse perl substitutions, then confirm with:
```sh
cd "$SP/lane-fix-p5" && node "$SP/lane-fix-p5-scratch/measure-pricing.mjs" "$SP/lane-fix-p5" /pricing | tail -1
# must print: SUMMARY /pricing  roots=1 files=14 floored=17 ruled=3 bare=0
cd "$SP/lane-fix-p5" && grep -c "lockedCell = (text)" src/components/pricing/PricingBands.jsx   # must be 1
```

## BATCH 2 — GROUP A GREEN, then COMMIT A
```sh
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components/publicChromeFloor.census.test.js tests/components/phoneChromeFloor.census.test.js tests/components/lockedPriceSlots.census.test.js tests/components/launchLock.pricing.test.jsx tests/components/invitationOnlyTiers.census.test.jsx tests/components/copyRawKeyRender.test.jsx tests/components/founderPurchasePathAbsent.test.jsx tests/components/referralFunnelTelemetry.test.jsx
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/ui/pricingPageBands.test.jsx tests/ui/pricingPageVariant.test.jsx tests/ui/pricingPageHydrationGate.test.jsx
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/design/contrast.test.js tests/design/deepCraftKillList.test.js
cd "$SP/lane-fix-p5" && npx eslint src/components/PricingPage.jsx src/components/pricing/PricingBands.jsx src/components/pricing/PricingTierCards.jsx tests/components/phoneFloorCensus.shared.mjs tests/components/phoneChromeFloor.census.test.js tests/components/publicChromeFloor.census.test.js tests/components/lockedPriceSlots.census.test.js tests/components/launchLock.pricing.test.jsx
```
Then `git commit -- <Group A's eight paths>` and `git show --stat HEAD` naming only those.

## BATCH 3 — GROUP B (F8 + noticed 7): red-first, green, COMMIT B
```sh
# PLANT: the seats go back to equal share.
cd "$SP/lane-fix-p5" && perl -0pi -e "s/flex: '1 1 auto', minWidth: 0, position: 'relative',/flex: 1, minWidth: 0, position: 'relative',/" src/App.jsx
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/phoneBarOrder.walker.test.js   # EXPECT RED, quote it
# RESTORE the inverse substitution, then:
```
⛔ The change lives under `tests/lint/`, so the WHOLE directory runs (lane law, verb 5):
```sh
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components/arrowGeometry.test.js tests/components/arrowHeader.test.jsx tests/components/arrowPaint.test.jsx tests/components/navFlowArrows.test.jsx
cd "$SP/lane-fix-p5" && npx eslint src/App.jsx tests/lint/phoneBarOrder.walker.test.js tests/components/arrowGeometry.test.js
```
Then `git commit -- src/App.jsx tests/lint/phoneBarOrder.walker.test.js tests/components/arrowGeometry.test.js`.

## BATCH 4 — GROUP C (F14): red-first, green, COMMIT C
```sh
# PLANT: one label table goes back to "Thorp".
cd "$SP/lane-fix-p5" && perl -0pi -e "s/  thorp: 'Thorpe', hamlet: 'Hamlet', village: 'Village',/  thorp: 'Thorp', hamlet: 'Hamlet', village: 'Village',/" src/pdf/lib/viewModel.js
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/tierWord.census.test.js   # EXPECT RED naming viewModel.js, quote it
# RESTORE, then the green + the consumers of the three changed tables:
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/pdf
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/config/tierFacts.contract.test.js tests/config/entitlementLadder.enforcement.test.js
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/mutationCoverageManifest.test.js
cd "$SP/lane-fix-p5" && npx eslint src/components/new/design.js src/pdf/lib/viewModel.js src/domain/display/humanizeEngineTokens.js tests/copy/tierWord.census.test.js
```
⚠ The new test file is UNTRACKED: `git add tests/copy/tierWord.census.test.js` by explicit
path (never `-A`/`-u`/`.`), then
`git commit -- src/components/new/design.js src/pdf/lib/viewModel.js src/domain/display/humanizeEngineTokens.js tests/copy/tierWord.census.test.js scripts/mutation-coverage-manifest.json`.

## BATCH 5 — GROUP D (noticed 6): red-first, green, COMMIT D
```sh
# PLANT: one badge shouts again.
cd "$SP/lane-fix-p5" && perl -0pi -e "s/letterSpacing:'0\.05em',textTransform:'uppercase'\}\}>Unexploited/letterSpacing:'0.05em'}}>UNEXPLOITED/" src/components/new/tabs/ResourcesTab.jsx
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components/dossierLabelCase.test.jsx   # EXPECT RED naming ResourcesTab, quote it
# RESTORE, then green + the dossier's rendered consumers:
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components/dossierLabelCase.test.jsx tests/components/dossierDepthTabs.test.jsx tests/components/dossierPhoneFloorAllViews.test.jsx
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/ui
cd "$SP/lane-fix-p5" && npx eslint src/components/new/SummaryTab.jsx src/components/new/SummaryTabV2.jsx src/components/new/SupplyChainsPanel.jsx src/components/new/npcComponents.jsx src/components/new/tabs/HistoryTab.jsx src/components/new/tabs/NPCsTab.jsx src/components/new/tabs/RelationshipsTab.jsx src/components/new/tabs/ResourcesTab.jsx tests/components/dossierLabelCase.test.jsx
```
Then `git commit -- <Group D's nine paths>`.

## BATCH 6 — THE STANDING INSTRUMENTS, then the lighting measurement
```sh
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js
# SEPARATELY, ONCE — EXPECTED RED (this lane adds ONE test file and new test titles).
# ⛔ NEVER refreeze it. Record the measured tuple and the delta against 2651·383·2268·25035·6678.
cd "$SP/lane-fix-p5" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
```
Finally: `git status --short` empty except nothing; `shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json` equal to the header of
`$SP/lane-fix-p5-scratch/FIX-P5.evidence.md`; write `FIX-P5.receipt.md`.

---

## WHAT THE CHAIR NEEDS TO KNOW BEFORE IT READS THE COMMITS

- **F7 built nothing, deliberately.** 12 px does not fit the painted slip at 375 (content
  box 9.89 px tall against a 12 px line on `lineHeight: 1`); the plate is 83.92 x 22.47 and
  the paid target 83.92 x 44. The estate ALREADY carries this as an executed exception row
  (§934.26) in `publicChromeFloor.census.test.js`, which reds if a re-cut ever makes 12 px
  fit. **The OWNER's call: re-cut the plate, or accept 10 px on a 44 x 44 target.**
- **noticed 5 is refuted, not deferred.** The exclamation is in the copy registry,
  `voiceMechanics` does scan it, and ODQ §934.26 addendum rules that the owner's verbatim
  order stands. Re-wording it needs the owner's word.
- **Two F14 surfaces are registered, not cured** (the compendium's byte-pinned generated
  label, the gallery's capitalize-the-token chips). Both are in the new census's register
  with their reasons; the compendium row is executed against the shipped artifact so it
  reds the day it is cured.
- **The taste sample still draws `†`** (`organic/samples/PricingSample.jsx`) while the
  shipped feature row now draws `✓`. Declared at the shipped site; the chair closes or vetoes.
- **Pre-existing at the base, not this lane's:** `phoneChromeFloor.census`'s `/create` row
  says bare 98 and the tree measures 97; `/settlements` says files 206 and the tree measures
  208. Both are green in the permitted direction (an owned row may only fall; files is a
  floor), so nothing is red — but the rows are stale against 63e40fe57.
