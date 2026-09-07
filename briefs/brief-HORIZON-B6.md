# LANE: HORIZON-B6 — the three CAPACITY evidence measurements (zero product bytes; the long pole is a ~2.3 h plateau soak)
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · measurement lane · unblocks `demographicsEnabled` inside L-DEFAULT (the one class-E key that STOPs) · ⛔ CPU-heavy: runs ONLY when no chair gate runs, under the quiet-window law⟧

## WHAT IS OWED
`DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({ signed: false, lit: null })` at `src/domain/worldPulse/demographicsRates.js:375`
(re-derive the line): C1's signature SURFACE landed; the C2/C3 EVIDENCE items did not. The design (DESIGN_HORIZON.md,
CAPACITY rows — `git show review-fixes-2026-07-08:docs/DESIGN_HORIZON.md | grep -n CAPACITY` then read the table at
~line 23, the lighting overlay at ~42, the read sites at ~63, the `lit ⇒ declared` arm at ~81, the tripwire registry
~87, the soak register ~89, and **the 300-year evidence cell** ~90) names three measurements:
1. the ~2.3 h plateau receipt — the 300-year run under the LIT overlay (`composeSoakRules({ preset, seasons, overlay })`,
   `scripts/audit/soakRules.mjs`; `parseLightingOverlay`) that shows the two-sided rate model plateaus at capacity
   rather than running away (the standing `population-runaway-300y` hazard is a TUNING-PASS INPUT, not this lane's cure);
2. + 3. the two unsized evidence items the design's C2/C3 rows name — re-derive them from the rows; do not invent them.
Record each as a cell in `tests/soak-harness/.soak-register.json` (`cells['<profile>/<caseId>']`: `frozenAtSha`,
`measuredBy`, the figure direction) ONLY if the register's own writer/door admits it — otherwise write the receipt and
hand the cell to the chair as a register act. The `research-lit/…` cell's `frozenAtSha` + `identity.lighting` is the
citation the future tuning signature carries.

## LAWS
- **STATE, NEVER FATE** and **values are signed LAST**: this lane produces EVIDENCE; it signs nothing; it flips nothing.
- The tripwire roster (`scripts/soak/tripwires.mjs`: `throw_or_assert · non_finite_ledger_figure · population_collapse ·
  negative_stock · unbounded_grow…`) is the pass/fail vocabulary — a tripped wire is a FINDING with the tick and the figure.
- Quiet-window law before the soak (load-1 < 4.0, zero vitest workers, three consecutive minutes) and run it through
  `sh scripts/gate-mutex.sh --run -- …` so the chair's gates serialize against it; capture `TRUE_EXIT` in-shell; a
  `143`/`137` exit is a harness kill, not a verdict — report it as such.
- Output to `$SC/capacity/` (receipts, the raw ledger figures per tick, the plateau chart as numbers), receipt
  `$SC/receipt-horizon-b6.md` with CONFIRMED/PLAUSIBLE per figure and a RETROVALIDATION ROW.

## ⛔ FENCES
Zero product bytes. No register `--write` unless the register's door admits a measurement cell by design. No tuning
value moved. Trailers on any commit `Seat: Opus 5 — Fable-unvalidated` + `Lane: HORIZON-B6`.
