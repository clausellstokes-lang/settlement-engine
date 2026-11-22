/**
 * map-birth.shared.mjs — MAP-1's birth (PROSE-1 brief MAP-1, 2026-11-20). SAME-1's birth, copied: DEFAULT_CONFIG at the
 * size, no dials, `generateSettlementPipeline(birthConfig(...), null, { seed, customContent: {} })`, then
 * `composePublicProse(town)`. No render. Run ONLY through vitest.map.config.mjs (MAP_FILE names the test file).
 */
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from '../../../../../../src/generators/generateSettlementPipeline.js';
import { composePublicProse } from '../../../../../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../../../../src/store/configSlice.js';

export const PLAN = JSON.parse(readFileSync(String(process.env.MAP_PLAN), 'utf8'));
export const OUT = String(process.env.MAP_OUT);

let ready = false;
/** Birth one place and compose its public prose; `around` brackets ONLY the compose call. */
export async function birthAndCompose(row, around = { before() {}, after() {} }) {
  if (!ready) { await loadGenerationLawPayloads(); ready = true; }
  const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: row.size }), null, { seed: row.seed, customContent: {} });
  around.before(row);
  let prose;
  try { prose = composePublicProse(town); } finally { around.after(row); }
  return prose;
}

export { writeFileSync, appendFileSync };
