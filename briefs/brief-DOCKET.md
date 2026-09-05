# LANE: DOCKET — the chair's small repairs, one car each (item 1 now; items 2+ appended by the chair as they are recovered)
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · repair class · zero product-behaviour change⟧

READ FIRST: `$SC/briefs/_PREAMBLE.md` → `$SC/DOCKET.md` (the chair's measured findings, verbatim).

## YOUR DOCK
`$SC/laneDOCKET` at the tip given at dispatch. Porcelain 0.

## ITEM 1 — `pg` is an UNDECLARED package the whole suite depends on (a CI-only test collected everywhere)
`tests/security/customContentLockOrder.postgres.test.js` does an unguarded top-level `import { Client } from 'pg'`; `pg`
is NOT in `package.json`. Any dock or checkout without an ad-hoc install fails to COLLECT the file, trips the scope
sentinel and blocks the census totals with `TRUE_EXIT=1` and ZERO refusals — a confusing signature. The test's own
header says "CI supplies a disposable PostgreSQL service for this test".
**RULED (Fable 5.1): the honest shape is the second cure** — make the driver import DYNAMIC and SKIP the suite with a
typed, printed reason when the driver OR the service is absent (the suite is designed for an environment the local docks
do not have). ⛔ NOT the first cure: declaring `pg` is a `package.json` byte, a MINT TRIGGER, a landing act with a
schema rung — out of scope here. ⛔ NEVER a per-dock `npm install --no-save` (that is what hid it).
Prove: (a) in a dock whose `node_modules` lacks `pg` (unlink the symlink in a SCRATCH copy of node_modules, never the
shared one), the file COLLECTS and reports `skipped` with the reason; (b) with `pg` present and no service, it skips
with the service reason; (c) the full-suite collection count is unchanged and the scope sentinel is quiet (`npx vitest
list` reports zero missing packages) — quote each. Keep the skip a plain `describe.skipIf`/early-return the ratchet's
parked-shape census does not count as PARKED (check `check-test-ratchet.mjs`'s parked detector and say which shape you
chose and why); if every honest shape counts as parked, STOP and report — the known-failure census has seven free slots
but a parked file is a census row, and that is the chair's call.


## ITEM 2 — `generatedAt` churn: an edge-shared rebuild on an UNCHANGED tree is not byte-identical
The ledger records (§88x, the edge-bundle window `3aa9f1a66`) that the four sibling metas of `build:edge-shared` move
ONLY `generatedAt` on every re-mint, so a rebuild on an unchanged tree dirties the tree and `edgeSharedBundleReproducibility`
reds if the mint is taken on a dirty tree (CHARSET R6). Re-derive: run the edge-shared build twice on a clean dock (the
ritual: materialise ONLY `immer` + `seedrandom`, build, then RESTORE the symlinks — never leave node_modules materialised)
and diff the outputs. RULED (Fable 5.1): the honest shape is a DETERMINISTIC meta — derive the stamp from the content
hash of the inputs (or omit the wall-clock field where nothing reads it; grep every reader of `generatedAt` first and
name them), so that identical inputs produce identical bytes and the reproducibility test becomes a real pin.
⛔ If any reader depends on `generatedAt` being a wall-clock time (a freshness check), that is a FINDING — report the
reader and STOP; do not silently change what it reads. Prove: two consecutive builds byte-identical; the
reproducibility test green; `validate:edge` verbatim; the byte budget (`sizeBaseline`) unmoved.


## ITEM 3 — five display consumers PARSE band labels by splitting on an em dash (structural prevention)
Found by PROSE-REBASE (receipt sealed `refs/preserve/prose-rebase-receipt-2026-09-05`, §"THE FINDING"): `SummaryTab.jsx:212`
and `:213`, `OverviewTab.jsx:301`, `safetyProfile.js:218` (the producer parsing its own labels) and `dailyLifeLogic.js:74`
all derive a BAND from a `"<Band> — <Condition>"` display string with `split('—')`. A wording change anywhere upstream
silently breaks them (measured: 186/360). RULED (Fable 5.1): give band and condition a TYPED shape at the producer
(`{ band, condition, label }` or the estate's existing band vocabulary — read `src/domain/state/bands.js` first) and make
every consumer read the field, never the string; the label stays exactly as it is for readers. Zero visible change;
prove with the 360-settlement drive (`$SC/prose-rebase-scratch/parse-coupled.mjs` is the instrument — re-derive it) at
0/360 before and after, plus each consumer's own tests. ⛔ Do not touch the fingerprint (item 4) in this car.

## ITEM 4 — `economyInputFingerprint` hashes two DISPLAY LABELS into persisted state (a persisted-shape change; measure first)
`economyReconciliation.js:88–110` builds `[version, tier, prosperity, safetyLabel, foodLabel]` → `powerStructure.economyInputFingerprint`,
persisted; `assertPowerEconomyFreshness` throws on a mismatch. A wording change is therefore a migration. This is a
persisted-shape act — chair-class under the 09-04 line but HEAVY: it needs the typed inputs from item 3, a `version`
bump, a tolerant recompute for stored fingerprints of the old shape (never a throw on a saved world — THE PROMISE), and
the OSR consequences measured. **First car = MEASURE ONLY**: enumerate every reader of the fingerprint, the saved-world
paths that carry it (create/read/persist/regen/undo/clone/import), and what a version bump costs; report to the chair;
build nothing until the chair rules on the shape.


## ITEM 5 — the AUDIT-2.2 paid-rights floor is a docblock, not machinery (PDFDRIFT's finding)
`SettlementCard.jsx:97-101` forbids the frozen (plan-inactive) card's PDF export from receiving the live store, `worldState`,
sibling settlements, or the faith chapter — and nothing enforces it: exactly one test observes `generateSettlementPDF`'s
options and it mounts only `SettlementDetail`. A chair ruled the forbidden change and the suite would have stayed green.
Build the arm: a test that renders the frozen card's export path with an active-looking store and asserts the payload
carries no live world, no campaign resolution, `faithUnlocked: false`; and the anonymous purchase page likewise. A new
test file is allowed — name it. Do not change product behaviour.


## ITEM 6 — the clamp detector's blind spot, and a floor with no ceiling (CLAMP-W2's two traps)
`cartographyMorphology.js:62` defines a passthrough `clamp01` under the name `unit` — invisible to `clampPrimitiveBaseline`'s `DEF_RE`
(`(function|const|let|var)\s+clamp(01)?\b`) and load-bearing for the cartographyBuildings migration proof. RULED: it is NOT a copy to
migrate; it IS a detector reach to state — extend `DEF_RE`'s docblock (not the regex) with the named exception and add an arm that
pins `unit` at that address as a KNOWN passthrough, so a future rename cannot mint an invisible copy. Separately `planUnitCm` has a
validated FLOOR and NO CEILING (the `storageCapacityMonths` sibling from wave 1) — add the ceiling pin the producer's own range implies,
or STOP with the range if no producer states one. Zero behaviour change.


## ITEM 7 — the whole-world soak is hardwired to `full_simulation`; L-PROBE cannot certify per preset (L-PROBE-KIT's STOP)
`scripts/audit/whole-world-soak.mjs:299` runs `full_simulation`; `realm-scale-certification.mjs` spawns it; the only seam, `--rules-json`,
LEAKS every `full_simulation` opt-in key the target preset does not name (measured: quiet_local 33, realistic_regional 33,
narrative_campaign 33, static_campaign 34, living_realm 15, dramatic_campaign 14). RULED: add `--preset <id>` that composes the
rules from `SIMULATION_RULE_PRESETS[id]` through `composeSoakRules({ preset, seasons, overlay })` (the existing seam), so a receipt
names the preset it certified; refuse `--rules-json` + `--preset` together. Prove: for each of the seven presets the composed rules
equal the preset table (zero leaked keys, measured the way the kit measured them); the default (no flag) stays `full_simulation`
byte-identical (no receipt moves). Scripts only; no product bytes; one car.

## PROOF (per item)
The file's own run (skipped, reason printed) · `npx vitest run tests/security/` · `npx vitest run tests/lint/` WHOLE ·
`node scripts/check-test-ratchet.mjs` in read-only form if it has one (no `--update`) · eslint. Quiet-window law + mutex.
Receipt `$SC/receipt-docket.md`, one section per item, a RETROVALIDATION ROW.

## ⛔ FENCES
No `package.json` byte. No shared `node_modules` edit. No register act. No `--amend`; one car per item; trailers
`Seat: Opus 5 — Fable-unvalidated` + `Lane: DOCKET`.
