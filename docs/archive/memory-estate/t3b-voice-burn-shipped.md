---
name: ""
metadata:
  node_type: memory
  title: "T3b-B JSX voice burn shipped — em 392->6, bang 10->0 (bar 8 VOICE A- -> A)"
  date: 2026-07-21
  tags:
    - tranche-3b
    - voice
    - jsx
    - ratchet
    - burn-down
    - vision-j
    - not-folded
  branch: claude/t3b-voice-burn
  tip: 5b246bd7
  base: bff01718
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T16:10:13.737Z
---

# T3b-B JSX voice burn shipped @ claude/t3b-voice-burn 5b246bd7 (base bff01718, NOT folded)

## ⚠️ Sharpest hazards first
- **The 6-em remainder is FUNCTIONAL, not prose — do not "finish" it in a voice pass.**
  SummaryTab.jsx (2) / EconomicsTab.jsx (3) / OverviewTab.jsx (1) hold `.split('—')` /
  `.split(' — ')` parser literals matched to em-dash separators COMPOSED IN src/domain
  (dossierViewModel.js ~line 339 granary display; safetyLabel; powStab/economicComplexity
  values — Tier-2 baseline debt, dossierViewModel em:6). The parser literal and the domain
  composer must change TOGETHER, in a Tier-2 lane. Encoding the char (fromCharCode) to dodge
  the walker = ratchet-gaming, rejected. EM_BUDGET_JSX is now 6, BANG_BUDGET_JSX 0.
- **src/pdf/lib/*.js is scanned by NEITHER voice tier** (Tier-2 = src/data+src/domain only;
  Tier-3 = *.jsx only). format.js's '—' placeholders were invisible to both ratchets and were
  changed here for glyph consistency — future user-facing strings in src/pdf/lib will be
  UNENFORCED; check by hand.
- **espree DECODES `&mdash;` in JSXText** — HTML-entity em dashes count exactly like literal
  ones (AuspicePanel/DmScreen/TableLedgerPanel all hid them as entities).
- **tests/pdf/missingValuePlaceholders.test.js pins the placeholder GLYPH** — it now pins
  '–' (en dash). If anyone reverts a placeholder to '—', this test AND voiceMechanics both red.
- **The ledger's "396 em / 10 bang / 133 files" was the pre-fold figure** — measured at
  bff01718 the baseline held 392/10/132 entries (131 with debt). The enforcer fold banked 4 em
  (t3-errorcopy struck SettlementsPanel, lowered ShareToGallery/NotesTab). Tip numbers govern.

## What
Burned tests/copy/.voice-mechanics-jsx-baseline.json 392 em + 10 bang -> 6 em + 0 bang
(131 debt files -> 3), per docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §3b-B. ONE commit
5b246bd7; 146 files (+444/−959). All edits net-zero effective lines (ceiling files safe by
construction; App.jsx held 732 exact, sizeBaseline 149/149 green).

## Conventions established (reuse these)
- Prose em dashes: VOICE_AND_TONE §6 decision order (period > comma > colon > parens).
- Empty-value placeholder glyph: **'–' (en dash)** — AdminUsersPanel precedent; inline
  separators: **' · '** (genesis.js "display-only" blessing + DossierHeaderRow).
- Select placeholders: "— Pick one —" -> plain imperative "Pick one" (en.js `pickOne` idiom).
- Alarm glyphs per §3 ("never an alarm glyph"): Dependencies missing-pill prefix DROPPED
  (red pill + '(missing)' name + title carry it), PowerTab corrupted icon '!'->'◆', PDF
  warning bullets '!'->'•' (Dense.jsx default), '(!)' prefixes dropped (color carries tone).
- Surveyor signature '— S.' -> '– S.' (SurveyorNote + DossierSample).
- Terminology rider: ExportSheet "AI-narrated dossier" -> "narrated dossier" (§3 registry).

## Declared output shifts (legitimate, copy-caused — cite if bisected)
- docs/samples/organic-craft/*.html regenerated via UPDATE_ORGANIC_SAMPLES=1 (SSR byte-pins
  of sample copy; registry titles feed every page incl. index.html).
- 6 test pins updated: mapChainsTierGate, surveyorNote, traditionsTab, travelersLayer,
  worldPulsePanel, missingValuePlaceholders.

## Gate (verbatim, on 5b246bd7)
voiceMechanics 16/16 (banked baseline; budgets 6/0) · proseLeak green · tests/copy 98/98 ·
tests/design 190/190 (after fixture regen) · tests/lint 149/149 · letter golden byte-identical
(chroniclersLetterGolden + domain 23/23) · tests/ui 658/658 (E-I pins green) · tests/components
837/837 · tests/pdf 292/293 — the 1 red = goldenViewModel, a PARKED golden family (numeric
canon drift: scoreAvg 63->65, institutions 54->55; no copy input) · eslint 0 errors, 6 warnings
all proven pre-existing at base via `git show bff01718:<f> | eslint --stdin` · tsc 0 ·
domain-strict bare 0 · build exit 0 · VERIFY_DIST=1 tests/build 220/220 · **closure 1,039,974 B
vs base 1,039,977 (Δ = −3 B, margin 23 -> 26 B)** · NUL scan 146 files -> 0. Tier-2 baseline
(.voice-mechanics-baseline.json) byte-unchanged by the UPDATE_VOICE_BASELINE=1 regen.

## How to apply
Fold claude/t3b-voice-burn per §3b (with 3b-A and 3b-C); re-grade bar 8 to A (A+ stays gated
on the ONE REGEN letter debt). At fold, re-measure closure (the margin is now 26 B — quote
1,039,974). npm ci still EUSAGE-fails on this lineage; the worktree ran via main-tree
node_modules walk-up (vitest 4.1.8), package.json unchanged base->tip.
