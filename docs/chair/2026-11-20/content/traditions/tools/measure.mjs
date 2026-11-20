import { readFileSync, writeFileSync } from 'node:fs';
import { deriveFoundingTraditions } from '../../../../../../src/domain/traditions/genesis.js';
import { TRADITION_ELEMENTS } from '../../../../../../src/data/traditionCorpus.js';
import { filterDeclared } from '../../../../../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../../../../../src/domain/facts/factsOf.js';
import { describeTradition } from './describe.mjs';
const [, , poolFile, outFile, audience = 'owner'] = process.argv;
const towns = readFileSync(poolFile, 'utf8').trim().split('\n').map(JSON.parse);
// the tab's admissibility rule, spelled as TraditionsTab.jsx :: motifNeeds has it
const ELEMENT_NEEDS = new Map(TRADITION_ELEMENTS.filter((e) => Array.isArray(e.needs) && e.needs.length).map((e) => [e.id, e.needs]));
const ACT_NEEDS = new Map([['fair', ['market']]]);
const motifNeeds = (rec) => [...new Set([...(ELEMENT_NEEDS.get(rec?.coreMotif?.element) || []), ...(ACT_NEEDS.get(rec?.coreMotif?.act) || [])])];
const printed = (t) => filterDeclared(deriveFoundingTraditions(t).map((rec) => ({ text: rec.name, needs: motifNeeds(rec), rec })), { facts: () => factsOf(t), poolId: 'traditions:tab', surface: 'traditions', drawKind: 'A' }).map((r) => r.rec);
const tot = { n: 0, keeper: 0, power: 0, origin: 0, econ: 0, none: 0 };
const byEl = new Map(); const byTier = new Map(); const whole = new Map(); const shape = new Map();
const rows = [];
for (const t of towns) {
  for (const rec of printed(t)) {
    const d = describeTradition(rec, t, { audience });
    if (!d) continue;
    const k = { keeper: d.parts.keeperKind === 'house' || d.parts.keeperKind === 'owner', power: d.parts.keeperKind === 'power', origin: d.parts.originKind === 'cause', econ: d.parts.originKind === 'economy' };
    const none = !d.parts.keeper && !d.parts.origin;
    const bump = (o) => { o.n++; for (const x of ['keeper', 'power', 'origin', 'econ']) if (k[x]) o[x]++; if (none) o.none++; };
    bump(tot);
    const el = rec.coreMotif.element; if (!byEl.has(el)) byEl.set(el, { n: 0, keeper: 0, power: 0, origin: 0, econ: 0, none: 0 }); bump(byEl.get(el));
    if (!byTier.has(t.tier)) byTier.set(t.tier, { n: 0, keeper: 0, power: 0, origin: 0, econ: 0, none: 0 }); bump(byTier.get(t.tier));
    whole.set(d.text, (whole.get(d.text) || 0) + 1);
    const sh = d.text.split(t.name).join('{town}'); shape.set(sh, (shape.get(sh) || 0) + 1);
    rows.push({ town: t.name, tier: t.tier, culture: t.config?.culture, terrain: t.config?.terrainType, seed: t._seed, rec: { id: rec.id, name: rec.name, motif: rec.coreMotif, foundedYear: rec.foundedYear }, text: d.text, facts: d.facts, short: none });
  }
}
const pct = (a, n) => `${a} (${(100 * a / n).toFixed(1)}%)`;
const line = (k, o) => `${k.padEnd(14)} n=${String(o.n).padStart(4)}  keeper(house)=${pct(o.keeper, o.n)}  keeper(power)=${pct(o.power, o.n)}  origin(cause)=${pct(o.origin, o.n)}  payer(economy)=${pct(o.econ, o.n)}  SHORT=${pct(o.none, o.n)}`;
const out = [];
out.push(`# TRAD-1 measure — audience=${audience}; towns=${towns.length}; printed traditions=${tot.n}`);
out.push(line('ALL', tot)); out.push('\n## by tier'); for (const [k, o] of byTier) out.push(line(k, o));
out.push('\n## by element'); for (const e of TRADITION_ELEMENTS) if (byEl.has(e.id)) out.push(line(e.id, byEl.get(e.id)));
out.push('\n## ten most repeated whole descriptions'); [...whole].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => out.push(`${v}x  ${k}`));
out.push('\n## ten most repeated shapes (town name masked)'); [...shape].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => out.push(`${v}x  ${k}`));
out.push(`\ndistinct whole descriptions: ${whole.size} of ${tot.n}; distinct shapes: ${shape.size}`);
writeFileSync(outFile, `${out.join('\n')}\n`);
writeFileSync(outFile.replace(/\.txt$/, '.rows.json'), JSON.stringify(rows));
console.log(out.slice(0, 30).join('\n'));
