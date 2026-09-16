---
name: tcd4-townmap-exports-landed
description: "TCD-4 (2c1ec70f) — townLayoutV2's dead exports read fixed; the v2 golden AND the shape-walker ceiling were both structurally blind to it, 54/60 maps moved, and a site-coherence question is now live and deferred"
metadata: 
  node_type: memory
  type: project
  originSessionId: a4664738-3944-484e-ac39-e1b215fcb7a9
  modified: 2026-08-07T20:23:22.443Z
---

Landed **2c1ec70f** on `claude/composite-r4` (parent 94962c17), worktree `minifold`,
2026-08-07. `townLayoutV2.js` read `economicState.exports` — never written by the economy —
and now reads `canonExports(s)`. Also corrected: `asymmetrySources.js`'s header prose and
townLayoutV2's own `TownV2Settlement` typedef, both of which NAMED the dead field.

⚠ **NUMBERING: this is TCD-4, not TCD-3.** `3800bcb6` already owns "TCD-3" for an
unrelated member of the same class (`foundingTier` on `SatelliteRecord` in
`lineageMemberBirth.js`). Check `git log --grep="TCD-"` before minting the next number —
the brief that handed me this work called it the TCD-2 sibling, which is true of its
lineage but not of its label.

**⚠⚠ TWO GUARDS WERE BLIND AT ONCE — neither would catch a revert.**

1. **The v2 golden cannot see the live field.** `tests/fixtures/townMapFixtures.js:245`
   (the marsh landform config) is the corpus's ONLY export-bearing settlement and it
   writes the LEGACY `exports` spelling. `canonExports` resolves it through the fallback,
   so `town-map-v2-golden.json` is byte-identical before and after — MEASURED: the
   manifest never changed and all 112 town-map tests stayed green across the fix. A golden
   whose fixtures spell a field the generator never writes pins the ALIAS, not the behaviour.
2. **The observed-shape walker's ceiling leaves the door open.** `scripts/.observed-shape-readers-baseline.json`
   freezes this file at `"exports on economicState": 2`. The ratchet is SHRINK-ONLY, so the
   fix is a legal shrink (walker green, 23 passed) — but the ceiling REMAINS 2, so restoring
   the dead read returns to exactly the ceiling and the walker stays GREEN. Banking that row
   to 0 closes it; NOT done because a concurrent lane was editing the walker test itself.

**How to apply:** the cure was a BEHAVIOURAL pin, not either ratchet — 4 tests in
`tests/domain/townLayoutV2.test.js` driving `primaryExports` with NO legacy key, plus an
ANCHORED NEGATIVE (the export-less control asserted to be a real drawable map, so the
contrast cannot pass against an empty harness). MUTANT-VERIFIED: restoring the dead read
reds exactly 3 of the 4 (`expected 'plain' to be 'marsh'`). Before trusting any golden on a
field that has a legacy alias, grep the FIXTURES for which spelling they carry.

**The shift is large and measured, not estimated.** A/B over 60 pipeline settlements
(10 configs × 6 seeds), read isolated (verified: nothing else in the town-map build chain
reads the export list — `districtProfile`/`causalState` read only prosperity/food/safety):
**54/60 models change**; 17 change site kind; **14 gain water that did not exist**; 6 gain a
landform texture; max centroid shift 277px in a 1000-unit view. A LIVE shift with ZERO
committed-golden movement — never report those as one claim.

**✅ OWNER SIGNED OFF 2026-08-07 — site derivation vs realm coherence is now AUTHORIZED
WORK, no longer a parked gate.** ("also on [the site-coherence question] … I give
permission.") Now that the field is live, `siteGenesis.generateSite` can derive a site
contradicting the settlement's own terrain: 17/60 flagged (14 water-on-dry, 3
mountain-flank-on-flat). Triggers are SUBSTRING matches: `/mill/` matches "Milled flour"
(a hills town gets a river for exporting flour), `/coal/` puts a mountain flank on a plains
thorp, `/reed|peat/` a marsh on plains. The `DRY_BIOME_RE` guard covers WATER only; the
mountain-flank and dunes branches have no biome check at all. Tuning is normally
owner-signed per [[the-promise-ratified]] — this one now IS. Programmed, not yet built:
see [[site-coherence-walker-banking-program]], which also gates on the other lanes
clearing.

Typecheck: `canonExports` is `Array<unknown>`, both consumers declare `string[]`, so the fix
costs one `/** @type {string[]} */` cast — `.map(String)` REJECTED, it would bake
"[object Object]" into the stored list and into provenance prose. Both ceilings held (full
175/175, domain-strict 1140/1140) — see [[two-typechecker-receipt-law]].

**The plumbing commit worked exactly as [[two-lane-commit-shared-index-race]] and
[[ratchet-repair-2026-08-07-four-hazards]] describe**, and both hazards fired for real:
HEAD moved 1e4c493b → 94962c17 mid-session (two foreign commits), and after `commit-tree`
the shared index showed `MM` on all three files — staging a REVERSAL — cured by
`git reset -q HEAD -- <my 3 paths>`. Six foreign-WIP files across three other lanes
survived untouched. Gate was run on the MATERIALISED candidate tree (`git archive`), which
is what made the green trustworthy: the working tree's greens were measured with three
lanes' WIP present.
