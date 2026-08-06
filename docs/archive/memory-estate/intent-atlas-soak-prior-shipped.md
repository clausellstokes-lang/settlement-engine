---
name: intent-atlas-soak-prior-shipped
description: Wave L-8a BUILT+GATED 2026-07-27 (UNCOMMITTED, minifold) — the AI intent atlas ships 92 soak-prior cells from 400 generated worlds; SOAK_WEIGHT_CAP 0.5 + supersession law + render cap 12; only red = intentAtlasBundle staleness (clears on build:edge-shared, proven).
metadata:
  node_type: memory
  type: milestone
  date: 2026-07-27
  originSessionId: 88199162-811c-4be3-8912-b0f33c64d43d
  modified: 2026-07-27T18:35:10.315Z
---

Owner ruling 2026-07-27: until user telemetry clears the statistical threshold,
the intent atlas ships a **premade prior derived from soak / generated-world
data, only for the purposes of the AI**. Built in
`.claude/worktrees/minifold` (branch `claude/composite-r4`). **Every file is
UNTRACKED** — the whole atlas lane is uncommitted in that tree; zero tracked
files were modified.

## What exists

- `scripts/distill-intent-atlas.mjs` — the distiller. 400 seeds, real
  `generateSettlementPipeline`, ~13 s. Deterministic (byte-identical across
  runs, no clock in the artifact). `--corpus` is **implemented**, not stubbed.
- `src/domain/data/intentAtlas.distillate.json` — 92 cells, `atlasVersion`
  0.2.0: **57 `construct`, 35 `customContent`, 0 `interpret`, 0 `autonomy`**.
- `src/domain/intentAtlas.js` — `INTENT_ATLAS_FORMAT_VERSION` 1.2.0; new
  `source` cell key, `ATLAS_CELL_SOURCES` (`soak`|`users`), `SOAK_WEIGHT_CAP`
  0.5, `ATLAS_RENDER_CAP` 12.
- `tests/security/intentAtlasIdFree.test.js` — 56 → **83 tests**.
- `tests/domain/intentAtlasSoakDistiller.test.js` — 7 tests, ~15 s: the
  committed artifact is **byte-reproducible by the documented command**.
- `docs/DESIGN_AI_INTENT_ATLAS.md` §8.

## The mechanisms worth remembering

- **Dimensions pair a REGISTERED CONFIG KEY against a PIPELINE OUTPUT.**
  Config×config would encode the sampler's own grid; output×output is not
  actionable. Construct coBuckets are computed with
  `coarseBand(deriveSystemState(s)[axis].value)` — the *identical* call
  `intentComparator.js` judges a construct result by.
- **SUPERSESSION LAW** — a users-cell retires the soak-cell on the same
  `(surface, dimension, bucket, coBucket)` key **outright, never averaged**, and
  supersedes **even when the users-cell is itself below the floor**. Echo-risk
  mitigation: without it the AI suggests what the engine produces, users
  confirm, telemetry echoes the engine's own prior back as human preference.
- **SOAK_WEIGHT_CAP is about STANDING, not support.** Gate REDS on an over-cap
  committed cell; the renderer's belt **clamps** rather than drops (the
  regularity is real, it just does not get to be loud).
- ⚠️ **The distiller cannot statically import `src/domain/intentAtlas.js`** —
  the repo's bare `from './...json'` convention is Vite-only and plain Node
  demands an import attribute. Cure used: `registerHooks()` JSON shim at the top
  of the script + **all `src` imports dynamic** (static imports are evaluated
  before the hook registers). Do NOT add `with { type: 'json' }` to the module:
  no file in the repo uses import attributes and it is build-time risk.
- ⚠️ `tradeRouteAccess` has **no exported vocabulary anywhere in src** — only
  `<option>` elements in `ConfigurationPanel.jsx` and bounded-string in the
  construct wall. The distiller spells the six routes literally and asserts each
  survives `resolveConfig` unchanged.

## Gate state at hand-off

Green: idFree 83/83 · distiller 7/7 · **whole `tests/security/` 135 files /
1591 tests** · `tests/docs/` 113 · `tests/copy/` 110 · `tests/lint/` 320 ·
`aiCharter` 34 · eslint clean.

⚠️ **8 reds in `tests/edgeFunctions/intentAtlasBundle.freshness.test.js`, all
bundle staleness. FOUR WERE PRE-EXISTING** — the committed bundle predates the
evidential-weighting amendment entirely (`grep -c EVIDENCE_FLOOR` on it = 0).
All eight clear on `npm run build:edge-shared`; proven by bundling to a temp
file with esbuild (0 missing exports, 0 byte drift, 0 inert-contract reds).

⚠️ **One out-of-brief edit, vetoable:** that freshness file's
"the INERT CONTRACT holds on the edge copy too: EVERY surface yields the empty
string" test would have red **permanently after regeneration**, and no bundle
rebuild could fix it. Rewritten to derive inertness from the bundle's own cells,
so it passes both before and after regen.

## Open owner picks (all vetoable, none blocking)

`SOAK_WEIGHT_CAP` 0.5 · `ATLAS_RENDER_CAP` 12 · **the render cap crowds out all
25 surviving `settType.<axis>` cells** on `construct` (a per-dimension cap would
guarantee family coverage at slightly higher token cost) · the per-line
`, generated` marker · leaving `interpret`/`autonomy` silent.

Related: [[ai-intent-atlas-and-tier-ladder-open]] (queue M42/M43),
[[authored-nul-byte-in-agent-edits]] (bit during this wave).
