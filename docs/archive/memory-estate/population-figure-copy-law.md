---
name: population-figure-copy-law
description: Population band figures must derive from POPULATION_RANGES; which surfaces comply vs still hand-type (deferred siblings + a two-copy formatter drift risk).
metadata: 
  node_type: memory
  type: project
  originSessionId: 19fb8886-985d-4fba-af22-5e12ec1dbf48
---

The enforced source of truth for settlement population bands is `POPULATION_RANGES`
in src/data/constants.js: thorp 8–60, hamlet 61–400, village 401–900, town 901–5,000,
city 5,001–25,000, metropolis 25,001–100,000. `popToTier` pins the 60/61 thorp/hamlet
boundary (was once 80, leaking pop 61–80 into thorp). Copy-law: **no hand-typed
population numbers in user-facing copy** — derive so display and enforced ranges cannot
drift.

**Canonical formatter:** `popFigure` in src/components/HomeHero.jsx (THE GAUGE, Deep
Craft 1a @ dd54130b) — `toLocaleString('en-US')`, en-dash separator, top tier renders
`min+`.

**Fixed:** ConfigurationPanel's Population dropdown had stale hand-typed bands (thorp
"20-80" for real 8–60; hamlet "81-400" for real 61–400). Now derives via a local
`popRange` copy that mirrors popFigure — **Deep Craft cluster 1d @ fb5e8031 on
claude/deep-craft, NOT folded (manager folds); uncommitted-then-committed to the lane).**
CatalogTabs Tiers tab already derives from `CD.tiers` (guarded by
tests/ui/compendiumHubs.test.jsx `not.toContain('20-80')`).

**Two formatter copies now exist** (HomeHero.popFigure + ConfigurationPanel.popRange).
Numbers can't drift (both read POPULATION_RANGES); only formatting could. Extraction of a
single formatter into constants.js is a future de-dup candidate if a third copy appears
(structural-prevention). Chose the local-copy over shared-extraction to keep the 1d fix
one-file and not rewrite freshly-committed GAUGE code — vetoable.

**Deferred siblings (task_d6f0bc2a) — RESOLVED 2026-07-18 on claude/honest-bands-followup
@ 1f0635c0 (base fb5e8031 = deep-craft tip; a NEW lane, NOT folded/pushed — manager folds).**
⚠️ The follow-up brief's files exist ONLY on deep-craft, not master; the worktree landed on
master (== master tip d024286e), so the fix was built on a lane off deep-craft's tip — a
wrong-lineage instance ([[wrong-lineage-worktree-trap-2026-07-14]]), caught by rev-parse.
- src/copy/landing.js `sizes[]`: the whole abutting marketing ladder was stale, not just the
  Hamlet "20–80" mislabel (Town ceiling 3,000 vs real 5,000; City 12k vs 25k — "fix only the
  mislabel" is impossible, the ladder interlocks). Owner delegated the rounded-vs-precise taste
  call ("use your best judgement"); chose PRECISE (mirror POPULATION_RANGES exactly: Hamlet
  61–400 … Metropolis 25,001+) for one-story-across-every-surface — vetoable.
- src/domain/compendium/searchIndex.js TIER_ENTRIES: fixed all six rows to POPULATION_RANGES
  (not only the flagged Thorp 20-80→8-60 — Town max 4000 was genuinely wrong vs 5000). Invisible
  zero-taste keywords; no test pins them (compendiumSearch matches on term/word, not a pop
  number). Verified: eslint clean, compendiumSearch 16/16, compendiumHubs guard 5/5, homeLanding
  render pass, tsc exit 0.
