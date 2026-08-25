---
name: ""
metadata: 
  node_type: memory
  date: 2026-07-19
  type: milestone
  branch: claude/deep-craft-c13
  commits: 
    - 7a2e0c14
    - c2289e10
    - 4ccb2766
  base: "67586c86 (claude/deep-craft lineage, C4 panel D)"
  status: "BUILT, NOT folded (manager folds)"
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T06:15:07.033Z
---

# C13 THE ONE DOOR shipped — Surveyor AI consolidation + THE SLATE CONVERSION

## What
- **C13-a @ 7a2e0c14**: SurveyorDoor.jsx = the single left-edge slate tab (renders ONLY
  for `auth.tier === 'premium'` via exported `isSurveyorTier` chokepoint — ⚠ FINDING: no
  Surveyor tier constant exists anywhere; "surveyor premium" mapped to the only paid tier,
  one line to flip). domain/intent/doorRouter.js = pure cue-table fore-stage of the S3
  compiler (context-first: default analyst/current-surface; vetoable vocabulary pinned in
  tests/domain/doorRouter.test.js). Both old launchers retired; panels are controlled
  destinations (open/onClose/initialQuestion/initialStage/initialPrompt/initialScope).
- **C13-b @ c2289e10**: violet→slate at the tokens.js CHOKEPOINT — values repoint
  (slate-500 #5A6E82 / 700 #435463 / 100 #E4E9EE + semantic slateLight/slateDim), the
  VIOLET*/swatch-key IDENTIFIER rename is DEFERRED (kill-list pins the exact VIOLET_BG
  line count; rename rides the kill-list burn-down). StaleNarrativeModal excluded
  (manager 2026-07-19: deterministic action; rides swatch.ai #6a2a9a, adjacent family).
- **C13-c @ 4ccb2766**: ProposalSlipLine ("PROPOSED — the engine writes canon" verbatim,
  copy key surveyorDoor.proposed) on all 5 proposal surfaces; accept buttons → gold
  primary (STAMP; handlers untouched); analyst correspondence register (ink vs slate).

## Hazards learned
- ⚠ **deepCraftKillList counts RAW LINE MATCHES INCLUDING COMMENTS** in src/components —
  a JSDoc comment containing the literal strings "borderRadius"/"boxShadow"/"rgba(" trips
  the exact-count ratchet. New floating-surface chrome goes in index.css (.sf-door-*).
- ⚠ Closure headroom memory was stale: budget 1,040,000; base (post C4 panels A-D) was
  1,038,775; C13 lands at 1,038,824 (+49 B total; +3 a, +46 b, +0 c). Headroom now 1,176 B.
- Full-suite reds = EXACTLY the 5 expected (4 parked goldens + aiGrounding freshness);
  advancePauseResume red under load = flake, green in isolation (protocol held).

## Veto points (for the fold)
- "Ask the Surveyor" copy (owner said "AI / ask me anything") — one string in en.js.
- Router cue vocabulary; workshop docks LEFT; slate hexes; approved-slip gold flip.
