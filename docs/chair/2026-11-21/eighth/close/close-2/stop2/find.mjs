// CLOSE-2: calm places whose seat reads Contested/Critical, lit (DEFAULT_CONFIG at the size, seeds visitor-<size>-i;
// an APPROXIMATION of the visitor plan, whose file stayed in CLOSE-1's container). Writes plan3.json: the first of each of three sizes.
import { writeFileSync } from 'node:fs';
const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { coupContenders, coupRiskLabel } = await import(`${T}/src/domain/rulingPowerCoup.js`);
const { DEFAULT_CONFIG } = await import(`${T}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
const plan = []; const found = {};
for (const size of ['village', 'town', 'city', 'metropolis']) {
  for (let i = 0; i < 150; i++) {
    const seed = `visitor-${size}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const calm = !s.stress || (Array.isArray(s.stress) && s.stress.length === 0);
    if (!calm) continue;
    const c = coupContenders(s); const risk = String(coupRiskLabel(c));
    if (!(risk === 'Contested' || risk.startsWith('Critical'))) continue;
    const first = (c.challengers || [])[0];
    found[size] = (found[size] || 0) + 1;
    console.log(`${seed}\t${risk}\tholder=${c.holder?.name || c.holder?.faction || JSON.stringify(c.holder)?.slice(0, 40)}\tfirst=${first?.name || first?.faction}\tchallengers=${(c.challengers || []).map((x) => x.name || x.faction).join('|')}`);
    if (!plan.some((r) => r.size === size) && plan.length < 3) plan.push({ seed, size });
  }
}
console.log(JSON.stringify(found));
writeFileSync(new URL('./plan3.json', import.meta.url), JSON.stringify(plan));
