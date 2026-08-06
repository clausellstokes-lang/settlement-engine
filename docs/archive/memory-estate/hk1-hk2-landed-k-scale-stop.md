---
name: hk1-hk2-landed-k-scale-stop
description: "HK-1 @ 074e919f + HK-2 @ 16b4a416 (minifold) — theme vocabulary + retention layer LANDED, seam DARK; STOP: the §5 K defaults drop 15-40% of every settlement's hooks"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T09:19:12.701Z
---

2026-08-03, lane B of DESIGN_HOOK_NONREDUNDANCY.md. Both waves committed on
`claude/composite-r4` @ minifold: **HK-1 = 074e919f**, **HK-2 = 16b4a416**.
HK-3 (theme-aware draws) is NOT built.

## ⚠️⚠️ THE STOP — K is sized to the VOCABULARY, not to the settlement

The §5 tuning table (hamlet/village/town K=1, city+ K=2) caps a snapshot's
TYPED survivors at `K × |HOOK_THEMES|` = 20 or 40, regardless of how many hooks
the settlement generates. Measured on 30 seeds per tier through the real
pipeline and the real collector:

| tier | hooks | drop at K=1 | drop at K=2 |
|---|---|---|---|
| hamlet | 615 | 15.1% | 3.4% |
| village | 846 | 25.8% | 9.9% |
| town | 1143 | 37.1% | 19.9% |
| city | 1669 | 49.0% | 30.2% |
| metropolis | 2108 | 57.3% | 40.0% |

A metropolis with ~60 typed hooks cannot keep more than 40 at K=2 **by
arithmetic**. That is a content amputation, not "limit repeated hooks", and it
sits against the owner's "coherency and cohesion at all cost". **The chair/owner
must sign K before the seam is lit.** Fixes available: raise K, make K a
FUNCTION of hook count rather than a constant, or widen HOOK_THEMES.

## What shipped, and how it is dark

`retention` is an OPT-IN option on both collectors — `collectPlotHooks(s, {retention:true})`
and `deriveAllStructuredHooks(s, {retention:true})`. No caller sets it. A
simulationRules flag was the WRONG shape (these are pure projections that never
read rules). Dark proven at the byte: 36 settlements × both collectors, this
tree vs a detached worktree at pre-HK base 06afec27 → identical SHA-256
`d9a342ac2279bb3839b886db518afa82b4e7eb017bad6a2372bad903fac16991`.

## Tree facts the design doc got wrong (verified, reported, not ruled on)

- **HK-LAW-4 has NO production population point.** `deriveEscalationClocks`
  derives every clock from supply-chain state + faction profiles and NEVER
  references a hook. There is no hook↔clock join to read. `clockAnchoredKeys`
  is a caller-supplied set that is EMPTY in production; the pin seeds it
  explicitly so it is not a vacuous guard.
- **Relationship tension prose is CLOSURE-generated** (`pairProse` in
  npcData.js interpolates both NPC names), so an exact-text theme key can never
  match it. Tagged at `archetypeKey` instead (18 archetypes → `THEME_OF_REL_ARCHETYPE`).
- **HK-LAW-2's protection is empty on the DISPLAY collector** — userEdits seats
  editable 'hook'/'plotHook' entities at `settlement.hooks[]`/`settlement.plotHooks[]`,
  which `collectPlotHooks` does not walk. It IS live on `hookEscalation`'s
  `collectAllHooks`, which does.

## Hazards learned

- ⚠️ **voiceMechanics' em/bang counter reads a regex character class as a string
  literal.** `/^["'\s]+|["'\s.!?]+$/` opens a fake literal at the `"` that runs
  to the next quote, swallowing `!` and `—` from surrounding code. plotHooks.js's
  baseline row (em:4 bang:5) was 100% this artifact; deleting the duplicated
  regex took it to 0/0 and the row was struck. If a file's em/bang count moves
  when you only added comments, suspect this before hunting prose.
- **ONE FOLD now, three askers.** `hookThemes.hookThemeKey` is the single
  normalisation; `hookRetention.retentionKey` and `plotHooks.normHookText` both
  delegate. Do not re-spell it — a fourth copy silently unlinks DM-edit
  protection from the keys it must match.
- `src/generators/hookThemes.js` is a **zero-import leaf carrying the 80 loyalty
  templates verbatim**, deliberately NOT importing npcData (a dossier-side reader
  reaching into the NPC data table crosses a chunk boundary). Drift is guarded by
  exact set equality in BOTH directions in `tests/lint/hookThemeTotality.walker.test.js`.
- `forbidden_love` and `scarcity_pressure` are vocabulary members tagged onto
  NOTHING yet — reserved for lover/family relationship prose and scarcity hooks,
  left for the owner's HK-1 membership signing (J-HK-3).

## Receipts

HK-1 walker 7/7; three rot modes planted red, restore green. HK-2 pins 19/19;
three mutations planted (10, 3, 2 reds), restore green. 16-file hook fence
246/246. Zero tsc / domain-strict / any-cast / eslint findings in any file this
lane touched. Standing tree reds (mutation-manifest totality, anchored-negative
walker, sizeBaseline, voice-mechanics eventProse+peaceTerms, JSX budget,
334 tsc errors) reproduce IDENTICALLY at base 06afec27 — they belong to the
war/envoy lanes in flight.
