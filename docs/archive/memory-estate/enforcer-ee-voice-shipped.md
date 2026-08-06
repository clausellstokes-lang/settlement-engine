---
name: ""
metadata: 
  node_type: memory
  title: Enforcer E-E shipped — VOICE_AND_TONE ban extended to JSX components
  date: 2026-07-21
  tags: 
    - enforcer
    - voice
    - jsx
    - copy
    - ratchet
    - vision-e
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T08:03:16.670Z
---

# Enforcer E-E shipped — VOICE_AND_TONE ban extended to JSX components

## What
claude/e-e-voice @ aa5350f0 (base b339e178, worktree
.claude/worktrees/vision-e). Built docs/THE_APLUS_EXECUTION_ARCHITECTURE.md
§E-E exactly as written: extended E2 (tests/copy/voiceMechanics.test.js) and
E1 (tests/copy/proseLeak.test.js) — which previously scanned only src/data +
src/domain (E2, char tokenizer) and composer OUTPUT prose (E1) — to also scan
every `src/**/*.jsx` component via a real JSX-aware AST walk (new shared
helper `tests/helpers/jsxLiteralWalk.js`, using espree with
`ecmaFeatures.jsx:true`). New shrink-only baselines:
`tests/copy/.voice-mechanics-jsx-baseline.json` (em-dash/`!`) and
`tests/copy/.prose-leak-jsx-baseline.json` (flagKey/tick/week/schema/rawId).
Test-only, zero src touched, eager Δ 0 by construction.

## ⚠️ BRIEF-VS-SPEC DISCREPANCY (read this before re-dispatching an "E-E" task)
The dispatch brief's "In essence" paraphrase described E-E as a CONTENT-
FIDELITY walker — proving kernel-produced NPC/faction VOICE reaches rendered
JSX unstripped (citing narrativeParity/mechanismLitCoverage as idiom). That is
**not** what docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §E-E or
docs/THE_APLUS_CONVERGENCE_BLUEPRINT.md bar 8 actually say. Both, read
directly, specify: "extend E2 voiceMechanics + E1 proseLeak to scan JSX
component string literals (the recorded gap — E2 scans registries + data, not
components)." — a banned-PATTERN walker extension (em-dash/`!`/engine-token),
not a content-survival check. Verified this by reading both doc files fresh
(git log confirms the E-E section text is unchanged since the doc's original
authoring commit 5998f202 on branch review-fixes-2026-07-08). Built to the
verified doc text, which the brief itself named as authoritative. If a future
task wants the "kernel voice reaches JSX unstripped" content-fidelity
enforcer, that is a DIFFERENT, not-yet-built enforcer — it isn't E-E, and
would need its own spec entry.

## FINDING (the enforcer's real output)
JSX components had **zero** VOICE_AND_TONE enforcement before this walker.
Measured floor, now the frozen shrink-only baseline:
- **396 em dashes + 10 exclamation points** across 133 component files
  (mostly HowToUse/CompendiumPanel/PrivacySettings prose paragraphs; toast
  copy like "Credits added!"/"Welcome aboard, Founder!"; a few CSS-in-JS `/*
  comment — text */` blocks inside template-literal `<style>` blocks — a
  known blind spot Tier 2 already accepts since it only strips JS `//`/`/*
  */` comments, not comments-in-a-different-embedded-language).
- **29 flagKey hits, 0 tick/week/schema/rawId** — all 29 confirmed by reading
  the source across exactly 3 files: `src/components/map/
  SimulationRulesAxes.jsx`, `SimulationRulesDialog.jsx`,
  `src/components/settlements/LivingWorldGates.jsx`. All are legitimate
  SETTINGS/GATING UI (a flag-key → human-label toggle table, or a gates array
  keyed by the real flag name) — not narrative-prose leaks. Kept as real debt,
  not special-cased by directory (that would be a taste call outside this
  enforcer's mandate).

## How to apply
- To burn down the JSX debt: fix the string in the component, then
  `UPDATE_VOICE_BASELINE=1 npx vitest run tests/copy/voiceMechanics.test.js`
  (regenerates BOTH the Tier-2 .js baseline and the Tier-3 JSX baseline) and/or
  `... tests/copy/proseLeak.test.js` (regenerates the JSX engine-token
  baseline) — never hand-edit the JSON, and never raise a number.
- New `.jsx` file with a genuine em-dash/`!`/engine-token → the ratchet reds
  immediately (proven live: planted `src/components/__ee_probe_temp.jsx` with
  a seeded violation, all 4 growth assertions correctly failed, reverted).
- `emDash` is asserted ONLY in voiceMechanics Tier 3 for JSX — proseLeak's JSX
  extension deliberately excludes it so the same violation is never budgeted
  twice under two unrelated ratchets.
- The JSX walk covers ALL of `src/**/*.jsx` (components/, App.jsx,
  AppViews.jsx, main.jsx, pdf/) — not `src/components/` only.

## Gate (verbatim, all green)
- `node scripts/check-domain-strict.mjs` → 0 errors, ceiling 0.
- `npm run typecheck` → exit 0.
- `npx eslint tests/copy/voiceMechanics.test.js tests/copy/proseLeak.test.js tests/helpers/jsxLiteralWalk.js` → exit 0.
- python3 NUL scan on all 5 touched/new files → 0 NULs.
- `npx vitest run tests/copy/voiceMechanics.test.js tests/copy/proseLeak.test.js` → 2 files, 28/28 passing.
- `npx vitest run tests/copy/` (full family) → 8 files, 98/98 passing.
- `npx vitest run tests/lint/ tests/design/` (sanity) → 50 files, 333/333 passing.
- Re-verified green AFTER the pre-commit hook's `eslint --fix` pass (hook ran, diff stat matched pre-hook staging exactly — no silent rewrite).
