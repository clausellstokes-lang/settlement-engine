# LANE: L-OVERLAY — is a `--preset P` soak a REAL birth of P? Measure the seam, then make the certification honest
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · Fable retrovalidation of this act is the chair's own⟧

## THE FINDING (L-PROBE full battery at the §899 tip, `lprobe-out-899-full/overlays/overlay-leak-report.json`)
`lprobe/preset-overlay.mjs` was written when `whole-world-soak.mjs` had NO `--preset` (hard-wired to `full_simulation`, the only seam being `--rules-json`, spread LAST). It builds the overlay from the REAL-birth resolved rules per preset and REFUSES an overlay that is not total: `keys(full_simulation.rules) \ keys(overlay)`. Measured: full_simulation 70 keys; every other preset's real birth carries 36–56, so 6 of 7 presets "leak" 14–34 keys (e.g. `allyIntelSharingEnabled`, `coalitionLedgerEnabled`, `demographicsEnabled`, `disastersEnabled` …). Since then DOCKET item 7 (§899, car `2200db6f3`) gave the soak a real `--preset <id>`.

## YOUR DOCK
Given at dispatch (a fresh dock at the §899 tip 38474a59e or the §900 CAS). ⛔ Never rebase; never materialise `node_modules`, never `npm install`, never `git stash`, never `git checkout --` on foreign content. Vitest through the mutex; never during a chair gate. A soak is CPU-heavy: run ONE preset at a time and never while a chair gate runs.

## MEASURE FIRST (a table, before any edit)
1. For each of the 7 presets: (i) the rules a `--preset P` soak actually composes (`composeSoakRules` → `fullRules`/`darkRules`; instrument the composition or read its output), (ii) the REAL-birth resolved rules for P (`$SC/lh1/birth-fixtures-p1.json` — CAR 1's, born through `buildNewCampaign`; cross-check `lprobe-out-899/f-birth-fixtures.json`), (iii) `SIMULATION_RULE_PRESETS[P].rules` (the sparse table). Diff (i) vs (ii) key-for-key. Report: keys present in (i) and absent in (ii) (the soak exercising a rule no birth carries), keys differing in value, and the 14–34 "leaked" keys — are they ENGINE-GATED VIRTUAL keys a birth never carries (then the leak is the instrument's definition, not a defect), or full_simulation settings riding into P's soak (then the soak's composition base is wrong and certification for P is dishonest)?
2. State which seam `certify.sh` uses today (`--rules-json` overlay vs `--preset`) and whether the two produce the same `fullRules` for P.

## THEN, by what the table shows
- If `--preset P` composes exactly the real birth of P: re-point `certify.sh` and `preset-overlay.mjs` to the `--preset` seam, redefine the leak refusal as `keys(realBirth(P)) vs keys(soak(P))` (both directions), and re-run the certification for all 7 presets ONE AT A TIME (record wall-clock each). Kit-only edits (the `$SC/lprobe/` battery), no product change.
- If it does NOT (the soak carries full_simulation's value for keys P's birth never sets, or normalizes differently): STOP after the table and hand it up — the cure is DOCKET item 7's composition (a product change) or L-DEFAULT's table, both the chair's; write the exact diff.
- Either way: the golden control (step a) must re-run on a QUIET machine (load < 4.0, zero workers) — run it if the window opens during your dispatch; otherwise record it as OWED with the command.

## FENCES
No register act; no product change without the chair's ruling (kit edits are yours); no change to any preset table. Commit kit edits in the kit's own way (report the files; the chair seals them into `refs/preserve/chair-tools-2026-09-05`) and product cars, if any, with `Seat: Opus 5 — Fable-unvalidated`, `Lane: L-OVERLAY`, `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Receipt `$SC/receipt-l-overlay.md`, PARTIAL header first, THE TABLE, RETROVALIDATION ROW last, tip sha last.
