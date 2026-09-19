---
name: store-action-registry-lifecycle
description: "⚠ Adding ANY store action requires operationRegistry registration + `npm run gen:compendium-data` regen (+ possible EXEMPT_CEILING bump) — the public Compendium artifact is a DERIVED lifecycle path that reddens compendiumDataFreshness if skipped"
metadata: 
  node_type: memory
  type: project
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T10:14:50.444Z
---

Discovered 2026-07-19 by RESTORATION SWEEP 2 (#16): lifting `setAuthModalOpen`
from App-local state into uiSlice required (1) registering the new action in the
operationRegistry (K-D EXEMPT class), (2) bumping `EXEMPT_CEILING` 69→70
(documented in-place), and (3) `npm run gen:compendium-data` — because the PUBLIC
COMPENDIUM artifact derives from the registry and its freshness test
(compendiumDataFreshness) reds on any registry change until regenerated (the
sweep's R2-h commit is the precedent: diff = exactly `exemptCount 69→70`).

**Why:** this is a classic hidden lifecycle path — the registry write survives
the store change but ghosts the derived artifact; lanes that add store actions
without the regen ship a red that looks unrelated.

**How to apply:** any brief for work that adds/renames store actions must
include: register in operationRegistry → adjust EXEMPT_CEILING if exempt →
`npm run gen:compendium-data` → verify compendiumDataFreshness green. Related:
[[comprehensive-review-fix-program]].
