---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-18
  type: program-state
  status: "BUILT, NOT MERGED (manager folds)"
  branch: "claude/doc-wave (base a4343044, tip 5751e110)"
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# THE DOCUMENTATION WAVE — Welcome (#22) + Pricing (#21) SHIPPED; About (#19) + Compendium (#20) NOT BUILT

Two of the four pages landed in 6 commits on `claude/doc-wave`; the lane's full
final report (with per-page receipts + the dispatch-ready decompositions for
About/Compendium) went to the manager 2026-07-18.

## What shipped
- **Welcome**: config-sourced tier strip (tierFacts interpolation) + Surveyor
  violet band + corrected anon line (0512c8b2) · landing funnel joined the SM-5
  one-event pattern — `landing_funnel_used`, EVENTS rev 11, lazy helper
  `src/lib/landingFunnelAnalytics.js` (ce94399d) · THE MAP WAYPOINT §05 —
  frozen v2 lens plates of the fixture town via
  `scripts/generate-landing-map-plates.mjs` (e84b4788).
- **Pricing**: five bands, all numbers from config; THE ENTITLEMENT LADDER
  (owner ruling 2026-07-17) transcribed once in `src/config/entitlementLadder.js`
  with per-row `enforcement` markers; drift contract
  `tests/ui/pricingPageBands.test.jsx` (8 pins incl. the task-menu walker +
  the RETENTION_MONTHS⇔migration-023 SQL pin) (4320a1c5, 5751e110).

## Hazards learned (⚠️ = will bite again)
- ⚠️ **Em dash inside a `@param` JSDoc tag line = tsc TS1127** (tsconfig.full
  parses JSDoc). Plain text after the bracketed param name.
- ⚠️ **config/pricing.js is EAGER** (tierFacts → AuthModal/HomeHero). Display
  derivations live in `src/config/pricingDisplay.js` — LAZY-ONLY by law; never
  import it from an eager surface.
- ⚠️ **The Browser-pane preview system reads the MAIN tree's launch.json and
  runs vite there** — the wrong-lineage trap on a preview. Cure: run vite via
  background Bash from the lane worktree (`npx vite --port 5176 --strictPort`)
  and `preview_start {url}`; a `dev-doc-wave` entry exists in the lane
  worktree's `.claude/launch.json` (positional root arg) but the harness won't
  read it from there.
- **The plate-generator idiom** (reusable): replay the committed fixture's
  seed+config, DRIFT-GATE the replay against the fixture (name+population,
  fail loud), render, and apply the cartographer's crop (model content bounds;
  renderer furniture off via `style.furniture: []`; neatline+rose re-composed
  for the crop). `--check` re-verifies byte-for-byte.
- **Refund-on-failure CONFIRMED at both edges**: ai-analyst
  `creditFlow.ts runCreditedCall` + generate-narrative `refundPolicy.ts` —
  full refund when nothing lands; partial success (thesis ok, polish failed)
  keeps output, not refunded. Page copy phrased to exactly that; nuance in FAQ.
- **The op registry (src/store/operationRegistry.js) has NO per-op JSON schema
  and NO read/propose/write enum** — classification is `klass`
  (canon/macro/mechanical) + targetScope + receiptRef/undoToken. The brief's
  "schema wall renders public" and About's boundary taxonomy must ground in
  `klass` or the About/Compendium lane must stop-and-report the gap.
- **Downgrade retention = 3 months** (migration 023
  `handle_premium_downgrade`); `RETENTION_MONTHS` in entitlementLadder.js is
  pinned to the SQL by the bands test — keep that idiom for any new SQL-truth
  number.

## Why
The successor lane for About/Compendium starts from the final report's
decompositions + these hazards instead of re-paying the exploration.

## How to apply
Resume pointer: the lane report (manager holds it) + `git log a4343044..5751e110`.
Do NOT re-apply anything from this lane — it is all committed on the branch.
