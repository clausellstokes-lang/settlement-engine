---
name: ""
metadata: 
  node_type: memory
  title: domain:strict RED at w7-prep (stale baseline from v2 fold)
  date: 2026-07-17
  severity: hazard
  scope: any branch off w7-prep 66eda8e8+
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# ⚠️ domain:strict is PRE-EXISTING RED off w7-prep — the baseline predates the v2 fold

**RESOLVED 2026-07-17:** burned down annotation-only and FOLDED → w7-prep @ 9150b464 —
see [[domain-strict-burndown-shipped]]. Kept for discovery context. Correction: the
in-scope (src/domain) count was 112; the ~550 below was the whole tsc project surface.

`npm run typecheck:domain:strict` (wired into `npm run check`) FAILS (exit 1) at
`66eda8e8` and every branch off it — NOT caused by the lanes building on it.

## Why
`scripts/.domain-strict-baseline.json` has `total: 0` (the whole domain is expected
strict-clean, an only-shrinks ratchet). But `npx tsc --noEmit -p tsconfig.domain-strict.json`
reports ~550 `noImplicitAny`/strict errors across SIX v2-engine files the TOWN LAYOUT v2
fold added: `src/domain/townMap/{townLayoutV2,siteGenesis,townPanorama,townMapModel,
asymmetrySources,lynchRubric}.js` (e.g. `townLayoutV2.js polar(cx,cy,dir,pct)` has JSDoc
but no `@param` ⇒ implicit-any). These files are byte-identical across branches ⇒ the
errors are inherent; the baseline was NOT regenerated when the fold landed.

The fold's own gate likely passed SPURIOUSLY via the tail-pipe exit masking:
`npm run typecheck:domain:strict 2>&1 | tail` returns tail's exit 0, hiding tsc's exit 1.
**Always verify domain:strict with `node scripts/check-domain-strict.mjs` and read ITS exit
code, never a piped tail.**

## How to apply
- If your lane's domain:strict shows regressions, FIRST check whether the erroring files
  are ones you TOUCHED (`git diff 66eda8e8 HEAD -- <file>`). If byte-identical to base,
  it's this pre-existing red — not yours. SM-5's four new/changed domain files
  (changeView, mapEdits, townMapDraw, index) are strict-clean.
- Do NOT regenerate the baseline to make it green (that accepts ~550 errors as the new
  ceiling — a governance change on engine files). Do NOT edit the v2 engine files if
  they're outside your fence.
- FIX (owner/fold-level): burn down — add the missing `@param` annotations to the six v2
  files to keep the ceiling at 0 (preferred, matches the ratchet intent). Spawned as a
  task chip 2026-07-17.
