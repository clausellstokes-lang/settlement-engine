// TRAD-1 hand-back measure (CTR8 after, CTR10 pools): over the 432-town pool, the owner's descriptions of the printed
// rites. Per slot pool: draws, distinct lines, the most printed line's share (dominance), lines refused and what
// replaced them (the presumption ledger's own notes). Sameness: the most repeated shape with the town masked.
// Usage: node measure2.mjs <pool.ndjson> <out.txt> [audience]
import { readFileSync, writeFileSync } from 'node:fs';
import { shownTraditionsOf } from '../../../../../../src/domain/traditions/shownTraditions.js';
import { describeTradition } from '../../../../../../src/domain/traditions/traditionDescription.js';
import { withPresumptionLedger } from '../../../../../../src/domain/facts/presumptionLedger.js';
import { TRADITION_ELEMENTS } from '../../../../../../src/data/traditionCorpus.js';

const [, , poolFile, outFile, audience = 'owner'] = process.argv;
const towns = readFileSync(poolFile, 'utf8').trim().split('\n').map(JSON.parse);
const tot = { n: 0, house: 0, owner: 0, power: 0, cause: 0, economy: 0, short: 0 };
const byEl = new Map(); const byTier = new Map(); const shape = new Map(); const whole = new Map();
const pools = new Map(); // poolId -> { draws, lines: Map, refused: Map<text, Map<replacement,count>> }
let deadWithCause = 0; let dead = 0;
const bump = (o, d) => {
  o.n++; if (d.parts.keeper === 'house') o.house++; if (d.parts.keeper === 'owner') o.owner++; if (d.parts.keeper === 'power') o.power++;
  if (d.parts.origin === 'cause') o.cause++; if (d.parts.origin === 'economy') o.economy++; if (!d.parts.keeper && !d.parts.origin) o.short++;
};
const blank = () => ({ n: 0, house: 0, owner: 0, power: 0, cause: 0, economy: 0, short: 0 });
for (const t of towns) {
  for (const rec of shownTraditionsOf(t, []).recs) {
    const { result: d, ledger } = withPresumptionLedger(() => describeTradition(rec, t, { audience }));
    if (!d) continue;
    bump(tot, d);
    const el = rec.coreMotif.element;
    if (!byEl.has(el)) byEl.set(el, blank()); bump(byEl.get(el), d);
    if (!byTier.has(t.tier)) byTier.set(t.tier, blank()); bump(byTier.get(t.tier), d);
    if (el === 'the-dead') { dead++; if (d.parts.origin === 'cause') deadWithCause++; }
    const sh = d.text.split(t.name).join('{town}'); shape.set(sh, (shape.get(sh) || 0) + 1);
    whole.set(d.text, (whole.get(d.text) || 0) + 1);
    for (const e of ledger) {
      const id = String(e.poolId || ''); if (!id.startsWith('traditionDescription:')) continue;
      if (!pools.has(id)) pools.set(id, { draws: 0, lines: new Map(), refused: new Map() });
      const p = pools.get(id); p.draws++;
      const line = typeof e.line === 'string' ? e.line : (e.line && e.line.text) || e.text || '(none)';
      p.lines.set(line, (p.lines.get(line) || 0) + 1);
      if (e.resolvedBy && e.resolvedBy !== 'drawn') {
        const k = `${e.resolvedBy}`; const r = p.refused.get(k) || new Map(); r.set(line, (r.get(line) || 0) + 1); p.refused.set(k, r);
      }
    }
  }
}
const pct = (a, n) => `${a} (${n ? (100 * a / n).toFixed(1) : '0.0'}%)`;
const row = (k, o) => `${k.padEnd(14)} n=${String(o.n).padStart(4)}  house/owner=${pct(o.house + o.owner, o.n)}  power=${pct(o.power, o.n)}  cause=${pct(o.cause, o.n)}  economy=${pct(o.economy, o.n)}  SHORT=${pct(o.short, o.n)}`;
const out = [`# TRAD-1 hand-back measure — audience=${audience}; towns=${towns.length}; printed rites=${tot.n}`, row('ALL', tot), '', '## by tier'];
for (const [k, o] of byTier) out.push(row(k, o));
out.push('', '## by element'); for (const e of TRADITION_ELEMENTS) if (byEl.has(e.id)) out.push(row(e.id, byEl.get(e.id)));
out.push('', `rites of the dead: ${dead}; keeping a cause (a major or catastrophic siege, fire, flood or plague): ${deadWithCause}`);
out.push('', '## per slot pool: draws · distinct lines printed · the most printed line and its share · resolutions other than "drawn"');
for (const [id, p] of [...pools].sort()) {
  const top = [...p.lines].sort((a, b) => b[1] - a[1])[0];
  const res = [...p.refused].map(([k, m]) => `${k}: ${[...m].map(([l, c]) => `${c}× "${l}"`).join('; ')}`).join(' | ');
  out.push(`${id.replace('traditionDescription:', '').padEnd(26)} draws=${String(p.draws).padStart(4)} lines=${p.lines.size}  top=${(100 * top[1] / p.draws).toFixed(1)}% "${top[0]}"${res ? `  [${res}]` : ''}`);
}
out.push('', '## ten most repeated shapes (town masked)'); [...shape].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => out.push(`${v}x  ${k}`));
out.push('', '## ten most repeated whole descriptions'); [...whole].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => out.push(`${v}x  ${k}`));
out.push('', `distinct whole: ${whole.size} of ${tot.n}; distinct shapes: ${shape.size}`);
writeFileSync(outFile, `${out.join('\n')}\n`);
console.log(out.slice(0, 3).join('\n'));
