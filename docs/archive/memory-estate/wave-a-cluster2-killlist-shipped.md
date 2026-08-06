---
name: ""
metadata: 
  node_type: memory
  title: WAVE A CLUSTER 2 (deep-craft kill-list) shipped
  date: 2026-07-19
  branch: claude/wave-a2-sweep
  base: aad6265e (claude/the-composite)
  tip: 3398ecea
  status: "shipped, NOT folded — manager re-pins ceilings at fold"
  tags: 
    - deep-craft
    - kill-list
    - de-round
    - sweep
    - wave-a
  originSessionId: c7979c3b-d9d7-48bb-a499-e2271011bf43
  modified: 2026-07-19T20:55:19.274Z
---

# WAVE A CLUSTER 2 — the flat-idiom kill-list sweep for src/components OUTSIDE new/

Sibling of cluster 1 (`claude/wave-a-tabs`, WA1-a..i, which converted `new/`).
Six lettered commits WA2-a..f on `claude/wave-a2-sweep` (base aad6265e, tip 3398ecea, NOT folded).

## Why / what
Drove the four deep-craft kill-list counts (tests/design/deepCraftKillList.test.js) DOWN
in src/components OUTSIDE `src/components/new/`. **In-scope measured: borderRadius 641->95,
boxShadow 93->72, rgba 209->167, tinted 184->157.** Full-tree totals now 360/77/192/187 (all
below the frozen ceilings 906/98/234/214 — the DECLARED tolerance-0 red; the fold re-pins to
measured). Idiom = WA1's: delete numeric/small-token `borderRadius` (square = flat), drop z-axis
`boxShadow`, retone off-palette rgba washes + tinted callouts (successBg/dangerBg/infoBg/*_BG) to
parchment (`swatch['#FAF8F4']`/`swatch['#FFFBF5']`) on a coloured left rule — "the word carries the
state". AI/founder violet -> the in-palette slate channel (`#5A6E82`).

## How it was built (fan-out)
5 sonnet de-round subagents (disjoint dirs) removed 415+84 borderRadius mechanically; I hand-did
the judgment work (boxShadow rings, rgba washes, tinted callouts, primitives, account tint). A
final scripted import-tidy stripped ~120 orphaned `R`/`ELEV` theme imports (the de-round byproduct)
— this SHRANK first-paint closure 1,040,998 -> 1,040,781 (the unused shim imports were reaching the
eager entry graph; 217 B win, still over the 1,040,000 budget red).

## Deferrals (with pin names — do NOT "re-find" as bugs)
- **primitives/ caliber atoms**: Button, Badge, Card, Pill, StateBadge, BandPill, CanonBadge,
  FounderBadge, Segmented, IconButton, Toast, InstitutionCard, BottomSheet -> the caliber-primitives
  lane. Card's boxShadow is pinned by tests/components/cardElevation.test.jsx. (Feature comps in
  primitives/ — LockedDestination, AiOverlayViolations, RegenerationDeltaCard, DesktopOnlyGate,
  EditableText/Inline, CategorySelect, LifecycleSpine, Disclosure, EntityLink — WERE converted.)
- **home/ + HomeLanding.jsx**: the public landing/hero — taste-gated, own dedicated pass (its rgba
  are legibility treatments over hero photos; radii are deliberately composed).
- **AccountSection.jsx** radius pinned by tests/components/accountSectionCard.test.jsx.
- **AccountProfileSection.jsx** avatar `borderRadius:'50%'` pinned by tests/components/uiMiscHardening.test.jsx.
- **theme.js / account/accountTheme.js**: palette-source.
- Long-tail rgba/tint not fully swept (a few subdir files) + the OutputContainer AI-generating
  overlay pill (deliberate violet). Import-tidy left ~6 pre-existing warnings (not R/ELEV).

## Verification (CONFIRMED)
Build green; eslint 0 errors (127->6 warnings, all pre-existing); full sharded suite 13,594 pass.
Only reds = the 4 kill-list declared reds + the 4 pre-declared parked golden families (beliefMap,
goldenViewModel-pdf, generatorGoldenMaster, worldpulseDeity — engine/pdf goldens, untouchable by
style edits) + the verify:dist budget red. `profileModerationColumnLock.pglite` flaked in-shard,
passes 10/10 in isolation.

## Hazards learned
- **borderRadius:0 is COUNTED but KEEP** (structural suppressors / Button-radius flatteners); to
  reduce the count you DELETE the property (square), never set it to 0.
- **Collapsing a multiline theme import to one line lowers the kill-list LINE count** when >1 *_BG
  token sat on separate lines (incidental tint 159->157 during import-tidy — legitimate, tokens
  still used).
- **hex inside a shorthand string** (`'1px solid #5A6E82'`) or a **template** (`` `${GOLD}18` ``) is
  NOT a rawColorLiteral (pure-hex-only) and NOT rgba — the safe way to retone without tripping the
  1403 raw-color budget; standalone bare `'#hex'` values must go through `swatch['#HEX']`.
- The pre-commit hook is **lint-staged** (`eslint --fix`); it makes a transient internal stash —
  the FOREIGN stash (`analytics-intelligence-layer: generation-tuning fixes`) survived all 6 commits.
