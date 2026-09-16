---
name: ""
metadata:
  node_type: memory
  created: 2026-07-19
  type: coordination-hazard
  status: STOP-AND-REPORTED — no code written; brief contradicted the repo
  branch: claude/deep-craft-c1fin
  tip_at_finding: b6c91dbe
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T06:58:55.081Z
---

# C1-FIN REMAINDER brief was STALE — items 1/2/4 already shipped; item 3 blocked

## Why this matters
A managing session issued an implementer brief "C1-FIN REMAINDER — finish the
commissioning desk" (worktree .claude/worktrees/c1fin, VERIFY tip b6c91dbe/C4c-h)
assigning 4 scope items. Investigation found **3 of the 4 were already committed
on this very lineage** (ancestors of the verify tip) and the 4th is blocked by a
single-writer barrier the brief itself imposes. Correct action per the brief's own
rule ("if anything contradicts the repo, TRUST THE REPO, stop, and report") was to
STOP — no code written, tree left clean at b6c91dbe. A future lane handed a similar
brief should re-derive done-state from `git log` + working tree, NOT the brief.

## The mapping (brief item → already-shipped commit, verified in working tree)
- **Item 1 CREATE CONSOLIDATION / the `.oc-m-unfold` leaf** → C1r-c1 @ 5e7cbdf4
  (+ C1r-d @ 88348274 walk fixes: Instant World card unmounted, exhibit pair
  top-aligned). Leaf lives in `src/components/GenerateWizard.jsx:411`
  (`<div className="oc-m-unfold">`), SP.xl flex column, zero handler changes.
- **Item 2 WIZARD TINT TRIO** → fully resolved: WizardCommitBand DELETED in C1r-a;
  WizardLoadedBanners → ClerkNote and WizardChipRow DELETED in C1r-c2 @ 4075b499.
  `WizardLoadedBanners.jsx` imports ClerkNote/ClerkNoteStrong; WizardChipRow file
  gone. (The brief listed all three as TODO — none remain.)
- **Item 4 EVOLUTION BACKDROPS** → C1r-c3 @ 01ad3a8f, SHIPPED after measurement.
  `public/evolution/{thorp,hamlet,village,town,city,metropolis}.jpg` exist (133–150
  KB each, sips 800px JPEG q70); interaction-gated via stageLive; eager closure
  1,038,614 B byte-identical. NOT the "abandon" branch — it shipped.
  (This is the same C1r-c already recorded in [[c1fin-base-recut-shipped]].)

## Item 3 (THE THREE CONFIG PANELS) — the only genuine remainder, and it is BLOCKED
- **TradeDynamicsPanel.jsx** — 5 `borderRadius:3` count-badge pills remain
  (lines 64/85/87/89/90); +1 structural `borderRadius:0`. Ledger-register pass = −5.
- **ServicesTogglePanel.jsx** — 4 `borderRadius:3` pills remain (217/219/221/222);
  +1 structural `:0`. Posted-bill de-round = −4. (Brief said "5 pills"; actual 4.)
- **LayeredConfigurationPanel.jsx** — ALREADY 0 kill-list patterns; an "instrument
  plate" chrome pass would be additive/rule-framing → **net-neutral on the kill-list**,
  the one item-3 sub-part safely doable without the ceiling seat.
- **THE BLOCKER:** `tests/design/deepCraftKillList.test.js` is tolerance-0
  (`expect(count).toBe(ceiling)`). De-rounding the pills lowers `borderRadius`
  ~1054→~1045, but the brief BARS this lane from that file (C3 lane holds the
  single-writer seat). A lowered count with an unlowered ceiling = kill-list RED,
  which is NOT among the slice-end "exactly 5 expected reds" → item 3 cannot be
  cleanly landed here without C3 coordination (fold the ceiling drop) or the seat.
  Kill-list is currently GREEN baseline (4/4, exit 0; ceilings 1054/113/265/235).

## Resolution options for the manager (recorded, not decided)
1. Confirm items 1/2/4 done → close them; hand item 3 to C3 (owns the kill-list) or
   grant this lane the kill-list seat for the item-3 commit.
2. If item 3 stays here: sequence it AFTER C3 folds the −9 borderRadius ceiling drop,
   or accept a transient kill-list red recorded as a would-be-win for C3.
3. The LayeredConfigurationPanel "instrument plate" sub-part is net-neutral and could
   land independently if desired.
