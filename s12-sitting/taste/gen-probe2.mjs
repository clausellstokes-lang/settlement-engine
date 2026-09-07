// gen-probe2.mjs — READ-ONLY, the CORRECTED probe: composes through the SHIPPED callers' readings
// (generalDeskLines builds the general desk's readings from the settlement itself; the power desk's
// readings are built as PowerTab.jsx:200 builds them — structuralLensOf(s) + coupContenders(s); the
// politics projection needs a worldState and is left undefined, so DS-POW-7 goes silent; riskLabel IS supplied, so DS-POW-4 is not).
import { pathToFileURL } from 'node:url'; import { writeFileSync } from 'node:fs';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const imp = (p) => import(pathToFileURL(D + '/' + p).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generalDeskLines } = await imp('src/components/new/generalDeskRead.js');
const { foundedPoolKey } = await imp('src/domain/display/stateProse/generalStateProse.js');
const power = await imp('src/domain/display/stateProse/powerStateProse.js');
const { structuralLensOf } = await imp('src/domain/spatial/cohesionWeave.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
const SEED = process.argv[2] || 'chair-taste-2026-09-07';
const config = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };
const s = generateSettlementPipeline(config, null, { seed: SEED, customContent: {} });
const seed = String(s._seed ?? s.id ?? '');
console.log(`SETTLEMENT ${s.name} pop=${s.population} seed=${seed} history.founding=${JSON.stringify(s.history?.founding ?? null).slice(0,80)} age=${s.history?.age ?? s.history?.founding?.age ?? '?'} foundedPoolKey=${foundedPoolKey(s.history)}`);
const found = [];
const walk = (o, depth = 0) => { if (!o || typeof o !== 'object' || depth > 10) return; if (typeof o.blockId === 'string' && typeof o.poolKey === 'string' && typeof o.text === 'string') { found.push({ blockId: o.blockId, poolKey: o.poolKey, angle: o.angle || '', text: o.text }); return; } if (typeof o.sentence === 'string' && o.provenance && typeof o.provenance.blockId === 'string') { found.push({ blockId: o.provenance.blockId, poolKey: o.provenance.poolKey, angle: o.provenance.angle || '', text: o.sentence }); return; } for (const v of Object.values(o)) walk(v, depth + 1); };
const opt = { seed, audience: 'dm' };
try { walk(generalDeskLines(s, { seed, audience: 'dm' })); } catch (e) { console.log('generalDeskLines threw', e.message.slice(0, 160)); }
let contenders = null; try { contenders = coupContenders(s); } catch (e) { console.log('coupContenders threw', e.message.slice(0, 120)); }
const deskReadings = { ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}), structuralLens: structuralLensOf(s) }; // as PowerTab.jsx:200 builds them; `politics` (a worldState projection) omitted — DS-POW-7 silent
try { walk(power.powerStateProse(s, deskReadings, opt)); } catch (e) { console.log('powerStateProse threw', e.message.slice(0, 160)); }
const want = (b, p) => found.filter((l) => l.blockId === b && (!p || l.poolKey === p));
for (const l of [...want('DS-POW-5'), ...want('DS-GEN-14'), ...want('DS-GEN-9')]) console.log(`  ${l.blockId}\t${l.poolKey}\t[${l.angle}]\t${l.text.slice(0, 90)}`);
console.log(`lines seen: general+power ${found.length}`);
writeFileSync(`probe2-${SEED}.json`, JSON.stringify({ seed: SEED, name: s.name, foundedPoolKey: foundedPoolKey(s.history), lines: found }, null, 1));
