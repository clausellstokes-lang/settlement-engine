---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  tags: 
    - cycle3
    - wave6
    - determinism
    - pdf
    - M21
    - structural-prevention
    - temporal-audit
  branch: claude/cycle3-w6-pdf-determinism
  lineage: claude/composite-r4 @ d00418c0 (Wave-5 fold)
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T15:09:41.947Z
---

# Cycle-3 Wave 6 shipped — PDF determinism-leak (M21) + entropy guard class

## Why
M21: `src/pdf/primitives/Editable.jsx` `safeName()` fell back to `f_${Math.random()...}`
for a falsy field `name`, so a PDF form-field id churned on every render — breaking the
same-seed PDF replay contract. The fallback was DORMANT (both shipping showField sites —
`cover.campaign` in Cover.jsx, `tonight.scratch` via NotesField in TonightAtTheTable.jsx —
pass explicit names), i.e. a latent landmine, not an active bug.

## What shipped (the fix + the 3-layer guard, mirrors localeCompareGuard's two-layer model)
1. CURE — `Editable.safeName(raw, seed)`: falsy name ⇒ deterministic `fld_${fnv1a32(seed)}`.
   `fnv1a32` is a LOCAL 8-line copy (house display-sidecar idiom, identical constants to
   kernel/proseHash.js) — no new import edge ⇒ closure-safe. Call sites pass content as the
   seed: EditableText `t:${value}`, EditableProse `p:${value}` (kind tag decorrelates a text
   vs prose field of identical content).
2. eslint layer — EXTENDED the existing `[determinism-pdf-locale-collation]` block in
   eslint.config.js (SAME block — flat config is LAST-WINS per rule; a sibling src/pdf
   no-restricted-syntax block would SHADOW the localeCompare ban). Added Math.random +
   crypto.randomUUID + crypto.getRandomValues selectors.
3. `tests/lint/pdfEntropyGuard.test.js` — source-scan of src/pdf/** (incl. lib/) for the
   randomness class + eslint-wiring pin + guard-the-guard. Allowlist born empty.
4. `tests/pdf/pdfFieldManifest.walker.test.js` + `scripts/.pdf-field-manifest.json` — renders
   the REAL SettlementPDF viewmodel tree (react-pdf primitives are STRING type tags;
   `TextInput === 'TEXT_INPUT'`; execute function components, walk children — NO PDF bytes,
   the recorded "walk the tree, never bytes" law), collects every TextInput name, asserts
   EXACT-SET == manifest {cover.campaign, tonight.scratch} AND no `/^f_/` ships. Includes the
   M21 pin (same viewmodel x2 ⇒ same field names; falsy-name fallback deterministic +
   content-derived) and a guard-the-guard block.

## ⭐ KEY DECISION (owner-vetoable) — banned RANDOMNESS only, NOT wall-clock
The spec listed "Math.random, Date.now, crypto.randomUUID, new Date without args". But
`tests/lint/determinismBanCoverage.test.js` pdf layer FORBIDS the `new Date` ban, and
TEMPORAL_AUDIT.md §1 ledgers src/pdf wall-clock as a LEGITIMATE boundary read (Cover
generation-DATE stamp `new Date().toLocaleDateString`, Timeline user event timestamps). So
Wave 6 bans the RANDOMNESS/entropy class only (Math.random + crypto.random*) and leaves
Date.now/new Date UNbanned. Banning wall-clock would contradict a frozen invariant + an
owner-ledgered temporal contract (out of a fix-wave's scope). Updated the coverage pin's pdf
layer: `required: [LOCALE_COMPARE, MATH_RANDOM]`, `forbidden: [NEW_DATE, DATE_NOW]` (renamed
the layer → had to also update the `counts.get(...)` non-vacuity reference, a 2nd spot).

## Mutation-coverage registration (E-A, required — new invariant files are enumerated)
- pdfEntropyGuard → `mutation`, sweep plant #35 (`check_caught_planted` a src/pdf probe with
  Math.random ⇒ scan reds). Matches the determinism family (localeCompare/determinismBanCoverage).
- pdfFieldManifest.walker → `rationale: self-proving-meta` (has guard-the-guard, mirrors
  uiA11yContract.walker).

## Hazards / gotchas (each bit during this build)
- ⚠️ A COMMENT in a scanned src/pdf file must NOT contain the call form `Math.random(` — the
  source-scan regex matches it (reworded Editable.jsx's doc comment). Same lesson as
  localeCompareGuard ("bare-word mentions have no '(' after them").
- ⚠️ `vite build` alone does NOT run the `postbuild` prerender (`scripts/prerender-routes.mjs`)
  — 4 prerender/sitemap/meta-shell dist tests red until you run it. Use `npm run build`, or run
  the postbuild manually after a direct `vite build`.
- ⚠️ New `tests/lint/*.test.js` and any `*walker*.test.*` under tests/ are auto-enumerated by
  mutationCoverage.shared.mjs ⇒ MUST get a manifest entry (mutation/rationale, never uncovered).

## Receipts (CONFIRMED)
- New guards 12/12 + M21 pin green; negative controls PLANTED-RED→GREEN for all 3 layers
  (eslint 2 errors, source-scan 2 offenders, walker exact-set+symptom on a planted `f_` field).
- lint 0 errors (27 pre-existing warnings); tsc 0; domain-strict 0; NUL 0.
- build clean (pdf → lazy vendor-pdf chunk); VERIFY_DIST 227/227; first-paint closure =
  **1,039,868 B, Δ=0** vs baseline (pdf rides the lazy chunk, not the eager closure).
- aiGroundingBundle.freshness 20/20 green.
- goldenViewModel is one of the 4 parked golden reds (its snapshot = deriveDossierViewModel
  canon values, a path this diff never touches) — unaffected.

## Open report-only note (NOT fixed here — voice, not determinism)
src/pdf/lib is scanned by NEITHER voice tier (recorded gap). This wave's ENTROPY sweep DOES
cover src/pdf/lib. Whether the VOICE gate should also extend to src/pdf/lib is a separate
owner call — flagged, not fixed.
