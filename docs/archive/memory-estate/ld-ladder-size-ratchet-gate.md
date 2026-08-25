---
name: ld-ladder-size-ratchet-gate
description: "⚠️⚠️ THE LD LADDER'S REAL GATE IS THE SIZE RATCHET, and no LD spec names it: OutputContainer.jsx sits at EXACTLY 600 (its layer ceiling, UNBASELINED) so one added line makes it a NEW offender and BLOCKS LD-1's demoMode contract; App.jsx is TOLERANCE-0 at its frozen number. Cure = budget a leaf EXTRACTION into every UI item, which ratchets the number DOWN and pays for the feature."
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T15:37:19.133Z
---

Found by **Lane F (LD ladder), 2026-08-03**, while implementing LD-2/LD-3 at minifold
`claude/composite-r4`. Recorded in the repo at
`docs/FIRST_CONTACT_BACKLOG.md` (the ⭐ LD LADDER — BUILD STATE block + the LD-1 STOP note).

## The two ceilings, and why the second one is the nastier

Measured with **eslint's own Linter under the enforcer's rule** (the only measurement
that agrees with `tests/lint/sizeBaseline.test.js` and `eslint.config.js`):

- **`src/App.jsx`** — carries a `scripts/.size-baseline.json` entry and must equal it
  EXACTLY. Above fails; **below ALSO fails** ("ratchet down to lock the win"). So every
  App.jsx edit is net-zero or must lower the number in the same commit.
- **`src/components/OutputContainer.jsx`** — measured **exactly 600**, which IS the
  `src/components/**.jsx` layer ceiling. It has **no baseline entry precisely because it
  has never exceeded the ceiling.** One added effective line makes it a NEW offender:
  `sizeBaseline`'s exact-set arm reds AND the `max-lines` layer rule errors.

The second is the trap. A file at a frozen baseline at least *announces* itself in the
baseline JSON; a file sitting exactly on its layer ceiling is invisible until you edit it.

## What it blocks

**LD-1 (THE LIVING MINIATURE) cannot land as specced.**
`docs/DESIGN_LIVING_MINIATURE.md` §3's DEMO MOUNT CONTRACT (work item LM-2b) requires
threading a `demoMode` prop through OutputContainer to gate the mount-time
`supabase.rpc('get_ai_pricing')`. That is at minimum one added line into a file with zero
headroom, and **OutputContainer is not on THE DECOMPOSITION WAVE's list**, so no lane is
rowing toward it. Either budget the net-zero surgery / decomposition INTO LD-1, or rule
the decomposition first. LD-4 inherits the blocker (it shares LD-1's frame contract).

## The cure that worked — extraction pays for the feature

Both landed LD items funded themselves by lifting a leaf OUT of App.jsx:

- **LD-2** (`cf7243ab`) — the nav ribbon → `components/nav/NavRibbon.jsx`; **720 → 693**.
- **LD-3** (`5a6d7aef`) — the footer row → `components/footer/LegalRibbonRow.jsx`;
  **693 → 659** (the now-dead `t` from copy/footer.js went with it).

Do this deliberately: measure first, extract, then lower the baseline in the same commit.
Do NOT discover it at the pre-commit gate.

## Two collateral rules this exposed

1. **`.raw-button-baseline.json` is FILE-SET exact but OCCURRENCE-COUNT budgeted (45),
   and the count is SPLIT-INVARIANT BY DESIGN** — its own header says so. Extracting a
   component that contains a `<button>` therefore REQUIRES adding the new file to that
   baseline (eslint errors otherwise); it is compliance, not debt growth, because the
   occurrence count is unchanged. NavRibbon.jsx took such a row.
2. **Shared baseline JSONs are multi-lane files.** Lane D was rewriting
   `.size-baseline.json` concurrently. `git add <file>` stages the WHOLE file and would
   have stolen their in-flight rows. The cure used here: build a blob of
   `git show HEAD:<file>` + only your line, then
   `git hash-object -w` + `git update-index --cacheinfo 100644,<blob>,<path>`. The working
   tree keeps their edits; the commit carries only yours. Verify with
   `git diff --cached <file> | grep -E '^[+-][^+-]'` before committing.
