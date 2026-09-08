# LANE: L-PROBE-KIT — build the DARK-ARM battery as scripts the chair runs (lighting POSITION 1's instrument; zero product bytes)
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · tooling lane: it WRITES the battery under `$SC/lprobe/` and DRY-RUNS it; the chair EXECUTES it after the PROSE consist lands (the control must be measured on the tree the wave lights from)⟧

## WHY
`LGT-C0-PROBE` is a chair act: zero bytes, zero commits, the only control the eleven lighting declarations may quote. Its
recorded blocker ("HORIZON-DARK landed") is DECAYED. Its outputs, per `refs/preserve/light-plan-2026-09-05:PLAN.md` §6
POSITION 1 and §5.4: (a) `generatorGoldenMaster` 3/3 + 0/525 control; (b) a certification receipt per preset; (c) the OSR
PER-PARENT PRESENCE DUMP (`schemaKeys`/`keys` + `corpus.shapes.*.rows`) BEFORE any regeneration — the `MIN_ROWS = 40`
cause read; (d) the lighting-census tuple; (e) the stability rosters; (f) a REAL-birth new-campaign fixture per preset
(through `createCampaign` → `buildNewCampaign` / `createImportedCampaign`, NEVER through `SIMULATION_RULE_PRESETS[id].rules`);
(g) the 52-tick pulse hashes per preset; (h) ⭐ the class-C hashed-chunk LISTING diff (needs a build).
STOP for the wave: the preset catalog measures EAGER, or any listing diff exceeds `(margin − 100 B)`.

## READ FIRST
`$SC/briefs/_PREAMBLE.md` → PLAN.md §5.4, §6 POSITION 1, §8 (sealed) → the instruments at the tip (all under your dock):
`scripts/dormancy-bit-compare.mjs` (`--tree <T> --arm generation > x.tsv` — the bit-level dark arm) ·
`tests/property/generatorGoldenMaster.test.js` (both arms; 525 rows) · `tests/domain/simulationRulesPreset.stability.test.js`
(rosters at ~:163/:306/:366) · `scripts/check-observed-shape-readers.mjs` (~:434–463 `presenceOf`, `SCHEMA_PRESENCE`,
`schemaKeys`) + `scripts/lib/observed-shape-corpus.mjs` (the sets; the EP-1 hold at ~:752) · `scripts/audit/certify-subsystems.mjs`
(`npm run certify:subsystems -- <receipt> --json`; receipts come from `scripts/audit/whole-world-soak.mjs` /
`realm-scale-certification.mjs` — find which produces a per-preset receipt and how the lighting overlay is applied:
`scripts/audit/soakRules.mjs` `composeSoakRules({ preset, seasons, overlay })`) · `scripts/audit/behavioral-observation.mjs`
and `realm-scale-certification.mjs` (the 52-tick idiom) · `src/store/campaignRuntime.js` / `campaignImportedCreation.js` /
`campaignSlice.js` (the REAL birth path) · `vite.config.js` (`EAGER_FIRST_PAINT_MODULES`, `manualChunks`) and the size
baseline (`scripts/.size-baseline.json`, `tests/lint/sizeBaseline.test.js`) for the listing's margin.

## YOUR DOCK
Given at dispatch (read-only for product files; you write ONLY under `$SC/lprobe/`). Porcelain 0 at the end.

## DELIVERABLE — `$SC/lprobe/`
`run.sh <tree> <outdir>` (POSIX sh; quiet-window law + the gate mutex around every vitest/soak; every exit captured to
`TRUE_EXIT_<step>=` lines; last line `exit $TRUE_EXIT`), with one helper per output: `presence-dump.mjs` (reads the corpus
sets the checker reads and writes per-parent presence + rows per shape as JSON, BEFORE regeneration; must not call the
regenerator), `birth-fixtures.mjs` (one fixture per preset id through the REAL birth path, written as JSON with the
preset id, the resolved rules, and a hash), `pulse-hashes.mjs` (52 ticks per fixture through the real pulse, one hash per
preset; deterministic; no `Date`/`Math.random`), `listing.sh` (a build in a SCRATCH copy of the tree — never the dock —
then `dist/assets` names+sizes+hashes as a sorted listing; the diff against a BASE listing with the margin arithmetic),
and `certify.sh` (the per-preset receipt through the existing audit scripts, or a STOP saying which script cannot take a
preset and why). `README.md` names every output file, the command that produced it, its expected shape, and the STOP
conditions. DRY-RUN everything: `sh -n`, `node --check`, a `--dry` flag that prints the commands and touches nothing, and
ONE smoke run of the cheap helpers (presence dump, birth fixtures for one preset, one 52-tick hash) whose outputs you
quote. ⛔ Do NOT run the soaks, the golden master, or the build — those are the chair's, on the post-PROSE tree.

## ⛔ FENCES
Zero product bytes; nothing committed in the dock; no vitest beyond the one smoke helper; no `npm run build` (the
listing script builds in a scratch COPY when the chair runs it). Receipt `$SC/receipt-l-probe-kit.md` with a
RETROVALIDATION ROW. The shell is zsh: `${sha}:path`.
