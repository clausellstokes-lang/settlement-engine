---
name: stale-dist-gate-gotcha
description: "HAZARD — `npm run check` runs test BEFORE build, so dist-contract tests measure a STALE dist (spurious budget/sentinel failures after a lineage switch)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4db76617-dfda-4849-8575-e1fd2794926c
---

⚠️ HAZARD (bit 2026-07-15). `npm run check` = `... && lint && test && build` — **test runs
BEFORE build**. The build-contract tests (`tests/build/vendorPdfLazy.test.js`: the first-paint
byte-budget + the GUIDANCE_REGISTRY tree-shake sentinel) read whatever `dist/` already exists.
`dist/` is gitignored, so `git checkout`/`checkout -b` between lineages does NOT refresh it — a
worktree that started on one lineage carries that lineage's stale `dist/` into the next.

**Symptom:** `npm run check` reports the first-paint budget blown (e.g. 1,213,999 vs 1,122,663 —
~91KB over) and the sentinel "tree-shaken out", even when your source diff is a few dozen bytes.
The failure is the stale dist, NOT your change.

**Proof / remediation:** run `npm run build` FIRST, then the contract:
`npm run build && npx vitest run tests/build/vendorPdfLazy.test.js` → passes. A clean checkout with
NO dist SKIPS these tests entirely (they guard on dist existence — the "build-less batteries skip
dist contracts" note in [[golden-branch-firstpaint-budget-overage]]). So `npm run check` only ever
validates dist contracts against a *pre-existing* dist, never the one it builds at the end.

**When verifying a change against the build contracts: build fresh, then run the contract tests** —
do not trust a `npm run check` dist-contract result unless a fresh build preceded the test phase in
the same run. Related but distinct from [[golden-branch-firstpaint-budget-overage]] (that lineage is
*genuinely* over budget; this is a *spurious* red from stale bytes).
