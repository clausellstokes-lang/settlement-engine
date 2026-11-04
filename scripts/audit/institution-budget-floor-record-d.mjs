/**
 * scripts/audit/institution-budget-floor-record-d.mjs — a MEASUREMENT device for RUNG1B-F6 unit 4.
 * `node --import ./scripts/audit/institution-budget-floor-record-d.mjs <script>` records every
 * densityFactor call (see the hooks file). It works on the tip and on the base (either signature).
 */
import { register } from 'node:module';

register('./institution-budget-floor-record-d-hooks.mjs', import.meta.url);
