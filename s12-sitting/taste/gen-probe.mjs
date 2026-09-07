// gen-probe.mjs — READ-ONLY: generate ONE settlement with the product code (laneB6 @ 3b1c0eaa5), compose its dossier-state prose
// through the same composers the tabs call, and dump every sentence with block / pool / angle / audience. Writes only under this dir.
import { pathToFileURL } from 'node:url'; import { writeFileSync } from 'node:fs';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const imp = (p) => import(pathToFileURL(D + '/' + p).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const defense = await imp('src/domain/display/stateProse/defenseStateProse.js');
const general = await imp('src/domain/display/stateProse/generalStateProse.js');
const power = await imp('src/domain/display/stateProse/powerStateProse.js');
const economy = await imp('src/domain/display/stateProse/economyStateProse.js');
const warFaith = await imp('src/domain/display/stateProse/warFaithStateProse.js');
const stressors = await imp('src/domain/display/stateProse/stressorsStateProse.js');
const SEED = process.argv[2] || 'chair-taste-2026-09-07';
const config = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };
const s = generateSettlementPipeline(config, null, { seed: SEED, customContent: {} });
const seed = String(s._seed ?? s.id ?? '');
console.log(`SETTLEMENT ${s.name}  tier=${s.settType ?? s.tier ?? ''}  pop=${s.population}  seed=${seed}  culture=${s.culture ?? config.culture}  terrain=${s.terrain ?? config.terrain}`);
const found = new Map();
const walk = (o, depth = 0) => { if (!o || typeof o !== 'object' || depth > 10) return; if (typeof o.sentence === 'string' && o.sentence && o.provenance && typeof o.provenance.blockId === 'string') { const k = `${o.provenance.blockId}::${o.provenance.poolKey}::${o.sentence}`; if (!found.has(k)) found.set(k, { blockId: o.provenance.blockId, poolKey: o.provenance.poolKey, angle: o.provenance.angle || '', text: o.sentence }); return; } if (typeof o.blockId === 'string' && typeof o.poolKey === 'string' && typeof o.text === 'string') { const k = `${o.blockId}::${o.poolKey}::${o.text}`; if (!found.has(k)) found.set(k, { blockId: o.blockId, poolKey: o.poolKey, angle: o.angle || '', text: o.text }); return; } for (const v of Object.values(o)) walk(v, depth + 1); };
const run = (label, fn) => { try { const r = fn(); walk(r); } catch (e) { console.log(`  [${label} threw: ${String(e.message).slice(0, 120)}]`); } };
for (const audience of ['dm', 'player']) {
  const before = found.size; const opt = { seed, audience };
  run('defensePosture', () => defense.defensePostureProse(s, opt)); run('defenseThreat', () => defense.defenseThreatProse(s, opt));
  run('defenseForces', () => defense.defenseForcesProse(s, opt)); run('defenseState', () => defense.defenseStateProse(s, opt));
  run('defenseSupporting', () => defense.defenseSupportingProse(s, opt)); run('defenseWall', () => defense.defenseWallRationaleProse(s, opt));
  run('defenseMilitary', () => defense.defenseMilitaryStatusProse(s, opt)); run('defenseMagic', () => defense.defenseMagicDependencyProse(s, opt));
  run('general', () => general.generalStateProse(s, {}, opt)); run('power', () => power.powerStateProse(s, {}, opt));
  run('economy', () => economy.economyStateProse(s, {}, opt)); run('warFaith', () => warFaith.warFaithStateProse(s, {}, opt));
  run('stressors', () => stressors.stressorsStateProse(s, {}, opt));
  for (const [k, v] of found) if (!v._aud) v._aud = audience; // first seen under dm; a line only under dm is dm-visible
  console.log(`audience=${audience}: ${found.size - before} new lines`);
}
const lines = [...found.values()];
console.log(`TOTAL composed lines: ${lines.length}`);
for (const l of lines) console.log(`${l.blockId}\t${l.poolKey}\t[${l.angle}]\t${l._aud}\t${l.text}`);
writeFileSync('generated-lines.json', JSON.stringify({ seed: SEED, settlement: { name: s.name, population: s.population, config }, lines: lines.map(({ blockId, poolKey, angle, text, _aud }) => ({ blockId, poolKey, angle, text, audience: _aud })) }, null, 1));
