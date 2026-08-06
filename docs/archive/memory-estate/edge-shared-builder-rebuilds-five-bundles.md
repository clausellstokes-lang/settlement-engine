---
name: edge-shared-builder-rebuilds-five-bundles
description: "npm run build:edge-shared regenerates FIVE edge bundles, not one — three were stale as of 2026-08-03, and rebuilding grows aiCharter/aiOutputSchema by 113 transitive modules and ~59% each; never treat an edge-bundle refresh as a one-artifact repair"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T02:11:52.117Z
---

# `build:edge-shared` is a FIVE-artifact command, and three of the five were stale

Found 2026-08-03 in lane EB, which was chartered to rebuild exactly one artifact
(`supabase/functions/_shared/aiGroundingBundle.js`) as a repair. It STOPPED
instead, because both of its stop conditions were live.

`scripts/build-edge-shared.mjs` carries an `ENTRIES` array of **five** entries —
aiGrounding, analyticsEvents, aiCharter, intentAtlas, aiOutputSchema — and one
invocation rewrites all ten files (5 bundles + 5 `.meta.json` sidecars). There is
no per-entry flag. So "rebuild the grounding bundle" is not an available
operation via the repo's own script.

**Measured on 2026-08-03 at `claude/composite-r4` HEAD f444cf8b** (build run in
the working tree, then every file restored from `cp` backups to a verified-clean
`git status`):

| bundle | .js bytes | inputs | freshness test |
|---|---|---|---|
| aiGroundingBundle | 356,587 → 395,781 | 52 → 65 (+13) | was 2-red, goes green |
| aiCharterBundle | 463,468 → 738,382 | 100 → **213 (+113)** | was red |
| aiOutputSchemaBundle | 459,030 → 733,944 | 101 → **214 (+113)** | was red |
| analyticsEventsBundle | identical | 2 → 2 | green |
| intentAtlasBundle | identical | 2 → 2 | green |

The two clean bundles rebuild **byte-identically** (esbuild is deterministic
here) — only their `generatedAt` timestamp moves, so their `.js` files do not
even show as modified. That is the useful control: any `.js` diff you see is a
real source fold, never build noise.

**Why this matters more than staleness bookkeeping.** These are DEPLOY artifacts
for Supabase Edge Functions. Refreshing them folds in whatever landed in their
transitive dep graph since the last build. For aiGrounding that was 10 changed
modules across **16 commits** (not the 3 lanes assumed), and the 13 newly-pulled
modules include machinery built *dark* on purpose: `worldPulse/warCoalitionGraph.js`,
`warCoalitionLedger.js`, `warReasonTaxonomy.js` (WR-5/WR-6), `dossier/hookRetention.js`
(HK-2), `arcaneIdentity.js` + `magicAssertionText.js` (MG-3h). A routine "the
freshness test is red, just rebuild it" fold ships all of that into the edge
runtime in one commit, and grows two *other* deploy artifacts by 59% as a side
effect nobody asked for.

**A second, sharper finding:** `aiCharterBundle.meta.json` and
`aiOutputSchemaBundle.meta.json` record `sourceHash` values that match **no
committed tree**. All five metas share `generatedAt` 2026-08-02T22:10:48Z; the
aiGrounding hash resolves cleanly to commit `99974c4a`, but the other two resolve
to nothing within 45 input-touching commits, and not to `16231a72` (the HEAD at
build time) either. The build was run against a **dirty working tree**, so those
two bundles were born unreproducible. Their fold cannot be hand-derived by
archaeology — only a fresh rebuild can restore a defensible hash.

**How to apply:**

1. Never call `npm run build:edge-shared` as part of a single-artifact repair
   brief without first backing up all ten files (`cp -a`, never `git checkout` —
   see [[git-checkout-discards-uncommitted-work]]) and diffing afterward.
2. To find what fold a rebuild will perform, resolve the recorded `sourceHash`
   to a commit first: hash `p.encode() + b':' + content` joined by `\n` over
   `meta.inputs` in sorted order, sha256, first 16 hex chars — then
   `git diff <that commit>..HEAD -- <inputs>`. This is exact, and cheaper than
   rebuilding to find out.
3. An input-set that GROWS is the signal to escalate. +13 is a spine change;
   +113 is a dependency-graph event that deserves its own ruling.
4. The deploy of edge functions is the owner's migration-train step regardless —
   committing a rebuilt bundle is not deploying it, but it does stage what the
   next deploy will carry.

Related: [[capability-remediation-program-state]], [[stale-dist-gate-gotcha]].
