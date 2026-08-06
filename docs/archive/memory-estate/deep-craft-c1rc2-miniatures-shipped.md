---
name: deep-craft-c1rc2-miniatures-shipped
description: The deferred MINIATURES half of C1r-c2 (half-scale demo panels) BUILT + owner-signed-off; the 44px-floor-vs-scale-wrapper a11y law and the kill-list-neutral parametrize technique.
metadata: 
  node_type: memory
  type: project
  originSessionId: ff4ac441-a177-46e0-8bd6-7e3797b17b06
---

C1r-c2's deferred MINIATURES half shipped 2026-07-18 on **claude/deep-craft-miniatures @ 332fdf56** (base = deep-craft tip 4075b499 / THE TINT TRIO). NOT folded — folds onto claude/deep-craft (which was checked out + dirty in worktree agent-a39bc277, foreign WIP `M HomeHero.jsx` + `?? public/evolution/`, so a fresh lane branch took the commit instead). Owner explicitly signed off on building it (the parked item's gate was "needs owner sign-off").

WHAT: `HomeSampleDossier` + `RegionWakeReplay` gained an opt-in `compact` prop; `WizardEmptyState` (src/components/generate/, the ONLY consumer) passes `compact` to both in the `.sf-proof-pair` below-the-fold slot. Compact = flat (borderRadius 0, no shadow), narrowed (maxWidth 480→300), stepped-down header type/paddings — the FORGE doc's "true miniatures (half-scale dossier plate + almanac strip)". Full C1r-c gate green (killList + touched + homeHeroAnonGauge + eslint + tsc + domain:strict + build + verify:dist).

**Why (the a11y law — reusable):** a pure CSS `transform: scale(0.5)`/`zoom` wrapper is a PROVEN a11y regression on RegionWakeReplay — its Back/Next/Restart/CTA scrubber carries a deliberate `minHeight/minWidth: 44` floor (lines ~190-232; the "Back" label was widened because it filled only ~43px, 1px under the floor). Halving the panel drops controls to ~22px. That is why the miniature had to be an internal-restyle `compact` prop, not a wrapper. Verified live in the running app: all three controls render at 44px in compact mode.

**How to apply:** any future "make it smaller / miniature / scale down" request touching a panel with interactive controls must shrink CHROME (type, padding, maxWidth), NEVER the hit targets — keep ≥44px. And for any edit to a file under `src/components` that touches a `borderRadius:`/`boxShadow:`/`rgba(` line while the [[c1fin-base-recut-shipped]] deepCraftKillList ratchet is live (tolerance-0, `.toBe(ceiling)`): use VALUE-ONLY ternaries on the existing line (`borderRadius: compact ? 0 : 8`) so the scanned line-count is preserved byte-identically and no ceiling moves. Adding a new counted line → regression; removing one → must lower the ceiling in the same commit. `JUDGMENT (vetoable): parametrized the single markup tree by compact over a separate compact JSX branch` — keeps a11y controls + self-gate in one place. See [[c1fin-base-recut-shipped]] for the C1r-a/b/c arc and [[population-figure-copy-law]] for the deep-craft base.
