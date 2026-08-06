---
name: shared-tree-fpg3-and-grep-nul-gotcha
description: FP-G3 verbs wave landed uncommitted under a parallel session on review-fixes; + generosityKernel.js grep-returns-nothing gotcha (embedded NUL ⇒ grep treats it binary; use grep -a / diff -a)
metadata: 
  node_type: memory
  type: reference
  date: 2026-07-15
  originSessionId: 38042309-f421-4c03-bceb-84196b74a9cd
---

Two observations from the 2026-07-15 E1a zero-grain-give verification session, on branch
review-fixes-2026-07-08 (main tree /Users/cstokes/Desktop/settlement-engine).

## ⚠️ grep/diff silently return NOTHING on src/domain/worldPulse/generosityKernel.js
The kernel carries a **literal NUL byte** at the generosity fork key (`${giverId}\x00${receiverId}`,
~line 478 — an F24-class raw NUL, PRE-EXISTING in HEAD, intentional key-separator, NOT a corruption to
fix). Because of the embedded NUL, `grep`/`ugrep` treat the file as **binary** and print `exit 0` with
**no matches and no error** — a silent false-negative that will make you think a symbol is absent when it
is right there. Same for `diff` ("Binary files differ", no hunks). **FIX: always use `grep -a` and
`diff -a`** (treat-as-text) on this file (and any file the F24 class touched). This wasted real time —
`bufferSteps` / `reliefThisTick` reads as "not found" under a bare grep. Related: [[f24-corruption-class-closed]].

## FP-G3 verbs wave — ✅ COMMITTED @ 41c4447d (was uncommitted foreign WIP earlier same day)
A parallel session shipped the **FORCE_RELIEF / OFFER_CREDIT DM-verbs** (the deferred E1d "item 4",
previously blocked on the 232 B first-paint headroom) and COMMITTED it as `41c4447d` ("FP-G3 + THE
GENEROSITY VERBS: −51,957 B reclaimed… RATCHET #5 to 1,161,810"), an ancestor of HEAD (9e63d801).
⚠️ LESSON (shared-tree): I observed this wave as UNCOMMITTED dirty files, then it committed under me
between turns — and it SWEPT MY untracked-file edits (the zeroGrainGift pin strengthening) into ITS
commit. When you edit a parallel session's untracked WIP file, expect THEM to commit it, assertions
and all. Always re-run `git status` + `git log` before assuming your work still needs committing.
Surface (all now in 41c4447d):
- **npcData reclaim** (the budget payment, −51,957 B): `corruption.js` was the SOLE eager importer of the
  64 kB `npcData.js` (for one small trait map) → extracted `TRAIT_AGGRESSION`/`TRAIT_ALIGNMENT` to a new
  `src/data/npcTraitWeights.js` leaf. Files: npcData.js, corruption.js, disposition.js, npcTraitWeights.js.
- **verbs threading** (13 touchpoints): events/{types,registry,registryFull,registryProse,mutate,
  mutateWorld,undoEvent,affordanceManifest,batch}, EventComposer*, buildEvent; new
  `src/domain/spatial/generosityGate.js` (qualifiesForGenerosity extracted to a zero-import leaf,
  re-exported by generosityEV.js) + `tests/domain/events/generosityVerbs.test.js`; walker counts
  38/29/9 → 40/31/9; undoRoundTrip fixtures.
- **kernel touch**: generosityKernel.js changed sha under me but the ONLY diff hunk is the HEADER
  docstring (marking the verbs SHIPPED) — the give-path code is byte-identical. The wave's header also
  says it closed the E1a zero-grain give bug on the mover path ([[e1d-generosity-complete-2026-07-15]]).

**How to apply:** if you land in this tree and see these files dirty, that's the FP-G3 wave — foreign,
preserve it, don't gate/commit it as yours. It claims full-gate green via the npcData reclaim (no budget
raise). The whole tree is a MIX (FP-G3 wave + the E1a pin strengthening) → commit/merge is owner-gated and
must be carved by explicit file list. Reinforces the shared-tree rule: re-run `git status` before any
mutation; sha can change under you between turns.
