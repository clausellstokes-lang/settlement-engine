---
name: cycle3-w5-a11y-shipped
description: "CYCLE-3 FIX WAVE 5 (ui-a11y) on claude/cycle3-w5-a11y off composite-r4 e7020d3f, 2026-07-22: six a11y findings (H12 EntityPicker, H13 PurchaseModal, M9 GalleryDescriptionEditor, M10 z-collision, M12 TableView, M13 Glossary) fixed by routing through THREE existing primitives (useDialogFocusTrap, Dialog Shell bounding, CommandPalette combobox grammar) — no new runtime module, closure Δ=0 (all 8 target components proven lazy). Guard = uiA11yContract.walker + a Z_LAYERS manifest (scripts/.ui-a11y-contract.json), three born-empty registries."
metadata:
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T14:35:45.084Z
---

# CYCLE-3 FIX WAVE 5 — ui-a11y (branch claude/cycle3-w5-a11y off composite-r4 e7020d3f, 2026-07-22)

Dispatched by Fable under the owner-ordered cycle-3 fix program (docs/CYCLE3_FIX_PROGRAM.md
§Wave 5; findings in docs/CYCLE3_AUDIT.md). Six findings, all fixed by routing the surface
through an EXISTING primitive — no new runtime module, zero eager bytes.

## The six fixes (each finding -> primitive -> file)
- **H12 EntityPicker mouse-only** — routed the suggestion list through the CommandPalette
  combobox grammar: input `role="combobox"` + roving `aria-activedescendant`; arrows/Enter on the
  INPUT commit through the same `addRef` gate; options are `role="option"` `tabIndex={-1}` (not tab
  stops — the input owns the keys). `src/components/EntityPicker.jsx`.
- **H13 PurchaseModal clips on short viewports** — applied the Dialog Shell bounding contract
  (`maxHeight: 'min(90vh, 680px)'` + `overflowY: 'auto'`, replacing `overflow: 'hidden'`).
  `src/components/PurchaseModal.jsx`.
- **M9 GalleryDescriptionEditor toolbar keyboard-inert** — each toolbar button now carries BOTH
  `onMouseDown` (mouse; preventDefault keeps the editable selection) AND `onClick` (keyboard;
  gated on `e.detail === 0` to avoid double-exec on a real mouse click) that restores the saved
  selection before `execCommand`. Added `role="toolbar"` and `tabIndex={0}` on the contenteditable.
  `src/components/GalleryDescriptionEditor.jsx`.
- **M10 PostGenCoach × FeedbackWidget z-collision** — both were `zIndex: 900`. Split into named
  layers: coach=900, feedback=910 (an opened feedback panel deterministically wins the corner).
  `src/components/FeedbackWidget.jsx` (910), `src/components/PostGenCoach.jsx` (annotated).
- **M12 TableView no focus trap** — routed through `useDialogFocusTrap`; backdrop became
  `role="presentation"` (currentTarget dismiss), the panel became the focus-trapped
  `role="dialog"`. Removed the hand-rolled Escape listener. `src/components/TableView.jsx`.
- **M13 Glossary/InstitutionCard trap keyed on onClose identity** — routed GlossaryCard AND its
  identically-structured sibling InstitutionCard through `useDialogFocusTrap` (keyed on `open`
  alone, onClose via a ref). `src/components/guidance/SurveyorGlossary.jsx`,
  `src/components/primitives/InstitutionCard.jsx`.

## The guard (structural prevention) — three born-empty registries
`scripts/.ui-a11y-contract.json` (written with `ensure_ascii=False`) + `tests/lint/uiA11yContract.walker.test.js` (a
self-proving-meta walker over src/components; registered in scripts/mutation-coverage-manifest.json):
1. **Z_LAYERS stacking manifest** — 23 named layers (bijective value↔name); every `zIndex:<n>`
   literal in src/components must resolve to a named layer OR the local band (`<= localCeil` 20).
   `zLayersUnregisteredAllow` born empty. M10 is LOCKED (coach !== feedback asserted).
2. **mousedown-activation ban** — no tabbable `<button>/<Button>/<IconButton>` may have onMouseDown
   without onClick. `mousedownActivationAllow` born empty.
3. **single-writer focus trap** — the FOCUSABLE trap selector may live ONLY in useDialogFocusTrap.js.
   `handRolledTrapAllow` born empty.
Per-finding render pins: `tests/ui/uiA11yWave5.test.jsx` (11 tests, testing-library; M13 is a proven
reproduce-then-clear — buggy `[open,onClose]` keying yanks focus, fixed `[open]` keying stays).

## Hazards / lessons (⚠ future sessions)
- ⚠ **rawButtonBaseline scans SOURCE COMMENTS**: its detector is `/<button[\s/>]/` over src/*.jsx —
  a comment containing the literal `<button>` trips it as a raw-button false positive (bit me once;
  reworded the comment to "native button"). Never write `<button>` in a src comment.
- ⚠ **Any new tests/lint/*.test.js (an ENFORCER_DIR) is auto-enumerated as an E-A invariant** and
  MUST get a scripts/mutation-coverage-manifest.json entry or mutationCoverageManifest.test.js reds.
  A source-sweep walker with embedded guard-the-guard fixtures qualifies for
  `{"kind":"rationale","ref":"self-proving-meta"}` — but ONLY if the negative control is embedded in
  the test body (it means "injects its own broken fixtures and asserts red on every run"), not run
  manually. Insert the manifest key MINIMALLY (preserve original order — the file is NOT sorted; a
  full re-sort churns ~100 lines).
- ⚠ **Closure Δ=0 was STRUCTURAL, not lucky**: all 8 edited components (EntityPicker, PurchaseModal,
  GalleryDescriptionEditor, PostGenCoach, FeedbackWidget, TableView, SurveyorGlossary,
  InstitutionCard) are LAZY — none in the 7-chunk entry static closure. Verified with runtime-string
  probes (minification strips comment markers, so probe on RENDERED strings). Baseline AND post-edit
  closure both = **1,039,868 bytes** (budget 1,040,000 in tests/build/vendorPdfLazy.test.js:421).
- IconButton forwards `onClick` explicitly and everything else (incl. onMouseDown) via `...rest` to
  its native `<button>` — so passing both onMouseDown+onClick to IconButton wires both.
- SurveyorGlossary/glossary.js is guarded ABSENT from the entry closure (vendorPdfLazy) — routing
  GlossaryCard through useDialogFocusTrap keeps it lazy (the hook is already eager via Dialog; the
  import direction that matters is who imports SurveyorGlossary, unchanged).

## Verification (CONFIRMED)
eslint 0 errors (27 pre-existing warnings, none mine) · tsc 0 · domain-strict 0 · NUL 0 (python
byte check) · lint family 231/231 · build family 227/227 under VERIFY_DIST · closure Δ=0 · walker
negative-control probe reds all 3 checks then green on removal · M13 reproduce-then-clear proven.
Full suite: parked goldens (generatorGoldenMaster, worldpulseDeityGolden, beliefMapGolden,
goldenViewModel) are pre-existing and untouchable by UI-only changes.

## Deliverables
Two commits on claude/cycle3-w5-a11y (off e7020d3f): **46d3cfb7** (the six fixes + per-finding
render pins + the tableView backdrop-test update) and **b6b2d333** (the Z_LAYERS manifest + walker +
mutation-manifest registration). Full suite 16,512 pass / 24 skip / 4 parked-golden fail (the only
non-golden failure this wave introduced — tableView's backdrop test — is fixed in 46d3cfb7).
Awaiting Fable's fold onto composite-r4.
