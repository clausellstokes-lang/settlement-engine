/**
 * scripts/audit/institution-budget-force-d.mjs — a MEASUREMENT device for X-46 car 3's
 * calibration (the chair's ruling, 2026-11-04: realised(d) measured at fixed d). Loaded with
 * `node --import ./scripts/audit/institution-budget-force-d.mjs <script>`, it registers a load
 * hook that rewrites ONE function in the loaded copy of src/data/institutionBudget.js:
 * `densityFactor` returns Number(process.env.X46_FORCE_D) whenever that variable is set, so a
 * script can measure the pipeline at any d without the engine carrying an override. The source
 * on disk is never touched; without the flag the hook changes nothing.
 */
import { register } from 'node:module';

register('./institution-budget-force-d-hooks.mjs', import.meta.url);
