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

## PROOF (per item)
The file's own run (skipped, reason printed) · `npx vitest run tests/security/` · `npx vitest run tests/lint/` WHOLE ·
`node scripts/check-test-ratchet.mjs` in read-only form if it has one (no `--update`) · eslint. Quiet-window law + mutex.
Receipt `$SC/receipt-docket.md`, one section per item, a RETROVALIDATION ROW.

## ⛔ FENCES
No `package.json` byte. No shared `node_modules` edit. No register act. No `--amend`; one car per item; trailers
`Seat: Opus 5 — Fable-unvalidated` + `Lane: DOCKET`.
