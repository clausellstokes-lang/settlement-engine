# CORRECTIONS to PLAN.md (sealed `light-plan-2026-09-05`), measured by later lanes — read WITH the plan
1. **§8 "Closure / first-paint" row is wrong on the mechanism** (L-PROBE-KIT, R2): `scripts/.size-baseline.json` is an ESLINT
   MAX-LINES ratchet, not the listing margin. The real margin is `CLOSURE_BUDGET_BYTES = 1_048_000` at
   `tests/build/vendorPdfLazy.test.js:565`; `lprobe/closure-measure.mjs` reads it from there.
2. **§6 POSITION 1's "certification receipt per preset" is a STOP for six of seven presets** — `scripts/audit/whole-world-soak.mjs:299`
   is hardwired to `full_simulation`; `--rules-json` leaks 14–34 opt-in keys the target preset does not name (measured per
   preset). Cure: a `--preset` car on the soak (DOCKET item 7) BEFORE L-PROBE can certify per preset. Do not pad the overlay.
3. **Half of the POSITION 1 STOP needs no build:** `campaignRuntimeLazy.test.js:145` pins the catalog's laziness at source
   level — measured LAZY (237-module closure). Only the listing diff needs the build.
4. Paths: the plan is at `…:lightingwave/PLAN.md` in the seal; OSR presence lives in `scripts/lib/observed-shape-corpus.mjs`.
5. **The MIN_ROWS watch list exists now** (`lprobe/presence-dump.mjs`): 337 shapes at/above 40, 962 below; seven within five
   rows of the floor, two within two (`factionPatch` 38, `resolutionContext` 38) — PLAN §9 item 1 is no longer undeterminable.
6. The store layer cannot be imported by plain node (`import.meta.env` undefined at `src/lib/supabase.js:17`); the battery's
   (b)/(f)/(g) ride `lprobe/env-shim.mjs`, which injects an empty env and drives the product's documented unconfigured arm.
