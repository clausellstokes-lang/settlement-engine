---
name: worktree-npmci-eusage-node-modules-walkup
description: "⚠️ npm ci fails EUSAGE on the w7-prep lineage (lock out of sync w/ package.json); session worktrees silently run tests via the MAIN tree's node_modules (Node upward resolution) — a /tmp basecheck needs a symlink."
metadata: 
  node_type: memory
  type: project
  originSessionId: c94efddd-335c-401f-95bf-0e0053390784
---

Observed 2026-07-17 (gallery opt-in fix session), lineage w7-prep @ 62bc04da:

1. **`npm ci` fails EUSAGE on this lineage** — package.json and package-lock.json (blob
   16c18a49) are out of sync: `eslint-plugin-react@7.37.5` (+ its deps) missing from the lock.
   Nothing installs. The owner's main tree evidently got node_modules via `npm install`.
2. **Session worktrees under `.claude/worktrees/*` still run tests fine with an EMPTY local
   node_modules** — Node/npx walk UP to `/Users/cstokes/Desktop/settlement-engine/node_modules`
   (the main tree's). So "tests pass in the worktree" means "against the main tree's installed
   dependency versions". Usually fine, but ALSO means a pipe-masked `npm ci` failure is invisible.
3. **A basecheck worktree in the scratchpad (/private/tmp/...) has NO parent node_modules** and
   fails ERR_MODULE_NOT_FOUND. Remedy: `ln -s /Users/cstokes/Desktop/settlement-engine/node_modules
   <basecheck>/node_modules` and run serially (shared .vite cache).

**Why:** the adversarial-verify base-state comparison silently breaks without this, and EUSAGE
looks like a you-problem when it's repo state.

**How to apply:** don't fight `npm ci` in worktrees on this lineage; rely on the main-tree
walk-up (or symlink for /tmp checkouts). Never pipe `npm ci` through `tail` — check its exit
code directly. The lock desync itself is a repo finding: fixable by `npm install` regenerating
the lock (owner-visible change — flag, don't slip into an unrelated diff).
Related: [[wrong-lineage-worktree-trap-2026-07-14]] (worktree mechanics),
[[stale-dist-gate-gotcha]] (fresh-worktree gate ordering).

**Suite-red context the same session:** the full suite on this machine has chronic
timeout-flake in heavy files (advancePauseResume, fullPdf.render, paired-seed generator tests,
homeLanding, several pglite files) — run-to-run variance hits BOTH a fixed tree and untouched
base; 4 tests fail persistently at base 62bc04da itself (named in commit e0d0c29c's body).
Triage failures by NAME-identity against a base run, never by count.

**STALE HALF-CLAIM corrected 2026-07-26:** "deno check:edge env-broken in
worktrees" no longer holds — deno 2.8.3 runs fine in the minifold worktree and
typechecked all 32 edge functions. The 2026-07-26 edge-gate failures were a
REAL TS2345 in committed customContentCore.ts and a deno.lock drift from
integration commit a88be4f1 (pg/three added without lock regen) — genuine
defects, not environment breakage. Do not skip the edge gate in worktrees on
the strength of the old claim.

**⚠️ NEW BITE (2026-07-26): `deno install` is NOT lockfile-only.**
`deno install --frozen=false` in minifold rewrote the npm-managed node_modules
— 29 top-level packages replaced with symlinks into a `.deno/` sidecar and
upgraded OFF the package-lock pins (vitest 4.1.8→4.1.10, react 19.2.5→19.2.8,
eslint, zustand). On a live tree that silently shifts test output. Repair =
`npm ci` (EUSAGE did not bite), then verify pins + no `.deno/` + no stray
symlinks. To refresh deno.lock alone, use `deno check --frozen=false <entry
files>` — it adds only the missing workspace entries (+2 lines vs +3,973).
