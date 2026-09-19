---
name: mapchains-gate-unenforced
description: "RESOLVED 2026-07-17 — the mapChains tier gate is ENFORCED (owner signed 'enforce mapChains' under the RULING #5 blanket): all three affordances gated via the misc-signed wave, FOLDED into claude/w7-prep @ 07d3a1d2. Historical finding + the superseded as-shipped ruling below."
metadata: 
  node_type: memory
  type: project
  originSessionId: 025c2556-cdab-451d-8731-2d5ac85c7bb8
---

**RESOLVED (2026-07-17):** the enforcement shipped in the misc-signed wave (commit
dfd0d4ec on claude/misc-signed, folded into claude/w7-prep @ 07d3a1d2): gate wired at ALL
THREE affordances (MapOverlay `<ChainEdges/>` render, LayersPanel Supply-chains row,
RoutesToolbar Chains toggle — the third was a point the old NOTE missed); locked
affordances stay visible (Lock glyph + aria) and fire the existing `map_realm_teaser`
moment; derivation stays tier-blind (ChainEdges/supplyChains ZERO diff, source-scan
pinned); stored `layers.chains` never rewritten so upgrade restores the layer. The
ccd0d670 cherry-pick was adjudicated STALE at build time (it documents, doesn't enforce)
— implemented fresh. 10 pins in tests/components/mapChainsTierGate.test.jsx. Everything
below is history.

--- superseded ruling (2026-07-14) ---

RULING (2026-07-14): owner said "use your best judgement" → applied reconciliation ruling #4
(PRICING = ADOPT AS-SHIPPED, see [[reconciliation-decisions]]). Supply-chain edges STAY free +
on-by-default; the premium gate is NOT enforced (enforcing would yank a live free feature).
`canUseMapChains()` retained as the wiring hook and FLAGGED in-code (copyGuard "keep the machinery,
one flag to flip" pattern). VETOABLE — say "enforce mapChains" to gate it. The flag comment landed
on the MASTER lineage @ ccd0d670 (branch claude/confident-leavitt-5b2441); review-fixes-2026-07-08
needs the same via cherry-pick (its checkout had foreign WIP — left untouched).

--- original finding (2026-07-14 read-only recon) — gap present on BOTH
review-fixes-2026-07-08 (1ccf84a9) and master (d024286e) ---

`TIER_GATE.mapChains` (src/store/authSlice.js) marks supply-chain map edges premium-only
(anon/free `false`, premium `true`), and `canUseMapChains()` exists as a selector — but **nothing
consults it.** `canUseMapChains` has ZERO consumers repo-wide. By contrast every sibling premium
flag IS enforced: `canUseNeighbour()` (neighbourSlice), `canExport()` (BuyThisDossier/
SettlementDetail/ExportDraftButton), `canUseCustomContent()` (5+ sites). mapChains is the lone
orphan.

Rendering leaks it to all tiers: `MapOverlay.jsx` (src/components/MapOverlay.jsx) renders
`{layers.chains && <ChainEdges />}` with no tier check; `ChainEdges.jsx` has no gate; the
"Supply chains" toggle in LayersPanel.jsx (and a second entry in RoutesToolbar.jsx) calls
`toggleLayer('chains')` ungated; and `layers.chains` **defaults to `true`** (mapSlice.js). So
supply-chain edges are ON by default for anon/free users.

**Why:** The asymmetry (orphan selector + on-by-default + ungated toggle, while all siblings are
enforced) reads as *forgotten enforcement* — i.e. a premium feature leaking free — rather than
deliberate dormancy. But whether the feature is *supposed* to be premium is a product decision
only the owner knows.

**How to apply:** OWNER-GATED — do not change paid-surface behavior unilaterally. Two clean paths:
(a) enforce — gate the toggle + `<ChainEdges/>` on `canUseMapChains()` and default `chains` off
for non-premium; or (b) it's meant to be free — delete the `mapChains` column + `canUseMapChains()`
as dead scaffolding so the table stops implying a gate that doesn't exist. Any fix must target the
review-fixes-2026-07-08 lineage (see [[wrong-lineage-worktree-trap-2026-07-14]]), not a
master-family worktree. On master only, NextActionRail.jsx:95 has a comment referencing the gate
(no such ref on review-fixes) — a half-started wiring, not enforcement.
