---
name: religion-ruler-lens-faction-key-fix
description: rulerLens faction-key fix shipped at 24f46337 with a declared one-time behavior shift that no current golden observes
metadata: 
  node_type: memory
  type: project
  originSessionId: 77f0a972-0810-45b7-812e-3dadfadb7f79
  modified: 2026-07-20T01:26:56.318Z
---

⭐ **SHIPPED 2026-07-19 @ 24f46337** on `claude/the-composite` (atop 4c1143b9). Instance #4 of [[faction-key-defect-class-census]]. Three files: `src/domain/worldPulse/religionLegitimacy.js`, a new pin `tests/domain/religionLegitimacyFactionKey.test.js` (10 cases), and a monotone-DOWN `.domain-any-baseline.json` ratchet (22→20 holes).

**What changed in `rulerLens`:** seat → `governingFactionOf` (highest-power fallback KEPT + pinned for seatless fixtures); archetype → `factionArchetype()` (authored `.archetype` keeps precedence); NPC join → `npcInFaction`/`ladderFactionKey` (whole-roster fallback kept for a memberless seat). Same derived archetype now also feeds `factionDark`.

⚠️ **DECLARED ONE-TIME BEHAVIOR SHIFT — cite this commit if a future golden reddens.** Measured old-vs-new over 180 real pipeline settlements: `lens.align` moved 175/180 (max |Δ| 0.30), `lens.power` 140/180 (max |Δ| 0.52), `lens.compromise` 82/180, `deityGrowthFavor` 358/360 pairs (max |Δ| 0.15); `lens.temper` 0/180. It propagates deityRulerFit → rulerEndorsement → deityLegitimacyTarget.

**NO golden was re-recorded, and none needed to be.** The three reds in tests/property (`worldpulseDeityGolden`, `beliefMapGolden`, `generatorGoldenMaster`) are PRE-EXISTING — proven by running them on a clean detached worktree at the pre-fix base, where they fail with **byte-identical drift key sets**. The lens *does* move for worldpulseDeityGolden's own fixture (temper 0.5→0.4, align 0.5→0.6, executed both sides), but that golden projects only patron identity + a `publicLegitimacy.score` the contest never writes — coarse enough to absorb a bounded nudge. **So the shift is real and currently unobservable in the pinned surface.** If a golden ever gains legitimacy resolution, expect it to move once, legitimately.

**Recorded deferral, not a bug to re-find:** `transferRulingPower` does not update the seat record's `.category`, so after a takeover `factionArchetype` reads the seat's ORIGINAL class — a military junta still reads `government` through this lens. Defensible (the council body persists, the winner keeps its own record); recorded as an open question.

**How to apply:** the pin's 4 non-revert-proof cases are labelled CONTRACT PIN in-file — they pin contracts the fix relies on, not the fix. Don't "clean up" the two kept fallbacks; both are pinned deliberately. Prevalence numbers in that file come from the pipeline, not the bare generator ([[generator-probe-corpus-hazard]]).
