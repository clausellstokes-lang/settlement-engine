---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-17
  type: milestone
  status: shipped-unfolded
  branch: claude/ai-panels
  tip: a221c40c
  base: eb958f4b
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# THE AI SURFACE PANELS shipped (S3–S6 write-stage interfaces)

Four lazy write-stage surfaces on `claude/ai-panels` (4 commits, tip a221c40c, off w7-prep
@ eb958f4b): SurveyorWorkshop host (rides FloatingAffordances' existing lazy chunk; each
stage body React.lazy) + CustomContentPanel (S4, §9 labels → addCustomItem) +
StyleOverhaulPanel (validateBespokeStyle → live preview via read-only buildTownMapSvg) +
ConstructionPanel (S5/S6 config wall → deterministic generate → comparator → delta-only
revise → saves.save / instantWorld) + InterpretApplyPanel (accept→mint w/ consent barrier,
unroutable surfaced, reproducibility receipt). Thin transports in src/lib/surveyorWrite.js
(aiAnalyst idiom). NOT folded — the manager folds.

## Why
The 100% audit's one unslotted launch-required item; Ruling #4 launch-whole requires them.

## Hazards a successor needs
- **domain:strict fails AT BASE eb958f4b** — 112 pre-existing errors in 6
  src/domain/townMap/* files (townLayoutV2 +86) from the TOWN LAYOUT v2 fold; the
  baseline was never updated (THE STOP deferred the composite gate). Any lane branching
  off eb958f4b+ will see this red; it is NOT theirs. Verified empirically at base.
- **townMapStyleWall.js had 5 latent non-strict tsc errors** exposed by its FIRST
  tsc-program consumer (my panel import); fixed annotation-only in a350204a.
- **New-code source ratchets that bit this lane**: inline slugify (must import
  kernel/slugify.js) and native title= attributes (shrink-only census 485).
- **advancePauseResume.test.js times out (20s) under full-suite load**, green isolated —
  the recorded load-flake class.
- Bespoke-style durable persistence has NO store verb (owner-gated schema); the style
  panel holds an in-session additive collection and says so honestly.

## How to apply
Fold = merge claude/ai-panels; the lane report (in the dispatching session) carries the
JUDGMENT list (single launcher right-dock, config-driven commit copy, session-held style
collection, src/design fence interpretation) — all vetoable. Eager delta measured +184 B
(rechunk drift in shared index/engine-core chunks; zero panel code in entry closure).
