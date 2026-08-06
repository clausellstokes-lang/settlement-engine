---
name: op-retirement-cascade-checklist
description: "Retiring a store op cascades into five OTHER frozen artifacts (mutation-sweep perl anchors, MECHANISM_VOCABULARY, sizeBaseline, exemption enumerations, coupled positive controls) — deleting the registry row alone leaves reds and, worse, a silently vacuous mutation probe"
metadata:
  node_type: memory
  type: project
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-28T11:09:49.542Z
---

Observed 2026-07-27 retiring twelve dead store ops ([[dead-op-retirement-half-shipped]]). Deleting the action + its `operationRegistry.js` row is maybe 20% of the work; five other frozen artifacts are coupled to op names and each fails differently.

1. **`scripts/mutation-sweep.sh` perl anchors — the DANGEROUS one.** Probe 52 anchored its injected `probeOrphanOp` row on `\n  replaceAllPlacements: \{`. A `perl -0pi -e "s/.../"` whose pattern no longer matches **inserts nothing and exits 0**, so `check_caught` then grades an UNMUTATED tree and reports the probe as CAUGHT. A retirement can therefore silently hollow out the mutation spine with no red anywhere. Re-anchored to `clearAllPlacementsLocal`. Probe 54 anchors on `    set(state => { state.importedNeighbour = null; }),` in `neighbourSlice.js` — verify it too.
2. **`MECHANISM_VOCABULARY` in `tests/store/advertisedUndoArming.walker.test.js`** is an EXACT SET of hyphenated `undoState:'external:<ref>'` tokens. `addCredits`/`spendCredits` were the only speakers of `server-rebalance`, so retiring them made the spelling dead and the "no dead spellings" test red.
3. **`scripts/.size-baseline.json`** is tolerance-0 in BOTH directions: a shrink demands the number be LOWERED. `src/store/settlementSlice.js` went 1256 → 1235. Replacing code with a comment does not hold it — `max-lines` uses `skipComments`, so retirement notes are free and the code lines are a real shrink.
4. **Exemption/inventory enumerations that happen to name the op** — here `EXPECTED_TOGGLE_OPS` (15 → 12) and `EXPECTED_WRITERS` in `configDirectWriterExemptions.scan.test.js` (its "not vacuous" FLOOR must drop with it).
5a. **(added 2026-07-28) Edge-bundle input sets — the SLOWEST-detonating one.** `supabase/functions/_shared/*.meta.json` record per-bundle input lists; a retired op whose MODULE is an input (region/graph.js sat in BOTH aiCharter and aiOutputSchema) stales the sealed bundle, and the freshness suites live in tests/edgeFunctions — a dir most sweeps never run, so the red first appears at the FULL gate or a push hook. Cure = `npm run build:edge-shared` — but ⚠️⚠️ ONLY in a checkout with REAL node_modules: a regen in a worktree whose node_modules is a SYMLINK bakes symlink-resolved `../..`-escaping machine paths into the recorded inputs (esbuild records resolved paths) — artifacts that hash clean only from that scratch dir. Also commit ONLY the genuinely re-sealed pairs; the regen rewrites sibling metas by timestamp and re-seals sibling bundles over the LIVE tree (uncommitted work embedded in a sealed artifact) — restore those, and verify the committed bundles' input lists intersect the current tree dirt NOWHERE.

5. **Positive controls anchored on the retired op.** The dead-op ratchet's inert-binding control was pinned to WorldMap.jsx's `_replaceAllPlacements` — the very binding being deleted. Cure: parameterize the scanner (`consumerFilesIn(sources, name)`) and pin the control to a SYNTHETIC two-arm fixture (inert excluded, live kept), which is strictly better anchoring since the discount is a property of the scanner, not of any file.

**Why:** these artifacts freeze *names*, not behavior, so they are invisible to "did I break the feature?" reasoning and invisible to grep-for-callers. Only #1 fails silently; the rest red, but they red in suites far from the change (`tests/lint`, `tests/docs`) and get mistaken for foreign-lane noise in a shared tree.

**How to apply:** after removing the rows, run `grep -rn "<op>" src tests scripts --include='*.js' --include='*.jsx' --include='*.json' --include='*.sh'` (JSON and SH extensions matter — that is what surfaces the manifest text and the perl anchors), then dry-run each touched perl anchor against a COPY of its target and assert the substitution actually landed:
`cp src/store/operationRegistry.js /tmp/reg.js && perl -0pi -e "<the sweep's exact expression>" /tmp/reg.js && grep -c probeOrphanOp /tmp/reg.js`.
Also re-run `tests/lint/sizeBaseline.test.js`, `tests/store/advertisedUndoArming.walker.test.js`, `tests/docs/compendiumDataFreshness.test.js` and `npm run typecheck` — dropping a now-unused `get` parameter from a slice factory reds `tsc` (TS2554) at the uniform `createXSlice(set, get)` composition in `src/store/index.js`; keep the parameter as `_get` (eslint `argsIgnorePattern: '^_'`) rather than changing the call site.

Related: [[dead-op-retirement-half-shipped]], [[sizebaseline-exact-ceiling-hazard]], [[store-action-registry-lifecycle]], [[enforcer-ea-mutation-shipped]].
