// TRAD-1 hand-back measure (CTR8 after, CTR10 pools): over the 432-town pool, the descriptions of the printed rites.
// Per slot pool: draws, distinct lines, the most printed line's share (dominance), lines refused and what replaced them.
// Sameness: the most repeated shape with the town masked.
// Usage: node measure2.mjs <pool.ndjson> <out.txt> [audience]
//
// TRAD-4 unit 6 (2026-11-20) re-pointed it:
// - WHY THE PER-SLOT SECTION PRINTED EMPTY: the ledger's entry names its pool `pool` and its line `lineId`
//   (facts/presumptionLedger.js :: LedgerEntry; drawDeclared.js :: note); this tool read `e.poolId` (always undefined, so
//   no entry passed the `traditionDescription:` prefix) and `e.line` (never written). And the ledger cannot see two things:
//   (a) the REFUSED line itself (only its replacement is noted, with `resolvedBy`), and (b) a refusal that resolves to
//   NOTHING (drawDeclared notes no null line). So each slot is now read from the ledger's `pool` and `lineId` (the line's
//   index in the table's FULL pool: the table's lines carry no `id`), and the drawn line BEFORE resolution is re-read by
//   the leaf's own key (traditionDescription.js :: draw: `pickVariant(pool less twins, seed::id#slot)`); a refusal to
//   nothing is found where the slot always draws (the gloss) and the ledger holds no note of it. Every 'drawn' note must
//   re-read as the drawn line, and every 'twin' as the drawn line's twin: the count of disagreements is printed.
// - THE READER'S SET is the shared page's own (shownTraditions.js :: sharedTraditionRowsOf, admitted at the floor), each
//   description checked against the row's own text; the owner's is the tab's (shownTraditionsOf).
// - CTR11's OTHER DIRECTION (the owner's list): the printed rites whose OWNER economy sentence differs from the one the
//   record less its criminal income rows (`isCriminal: true`, the class the reader's view drops) would print.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { shownTraditionsOf, sharedTraditionRowsOf } from '../../../../../../src/domain/traditions/shownTraditions.js';
import { describeTradition } from '../../../../../../src/domain/traditions/traditionDescription.js';
import { withPresumptionLedger } from '../../../../../../src/domain/facts/presumptionLedger.js';
import { lineText } from '../../../../../../src/domain/facts/drawDeclared.js';
import { pickVariant } from '../../../../../../src/kernel/proseHash.js';
import { TRADITION_ELEMENTS } from '../../../../../../src/data/traditionCorpus.js';
import {
  ACT_LEADS, ELEMENT_GLOSS, OWNER_FRAMES, HOUSE_FRAMES, POWER_FRAMES, CAUSE_FRAMES, ECONOMY_FRAMES,
} from '../../../../../../src/data/traditionDescriptionTable.js';

const PREFIX = 'traditionDescription:';
/** a slot's pool, by the leaf's poolId (`lead.feast`, `house.placePower`, …), and the key suffix its draw uses */
const SLOT = {
  lead: [(k) => ACT_LEADS[k], '#done'], gloss: [(k) => ELEMENT_GLOSS[k], '#gloss'], owner: [() => OWNER_FRAMES, '#owner'],
  house: [(k) => HOUSE_FRAMES[k], '#house'], power: [(k) => POWER_FRAMES[k], '#power'], cause: [(k) => CAUSE_FRAMES[k], '#origin'],
  economy: [(k) => ECONOMY_FRAMES[k], '#economy'],
};
const isTwin = (l) => !!l && typeof l === 'object' && typeof l.twinOf === 'string';
const slotOf = (poolKey) => { const [kind, ...rest] = poolKey.split('.'); const [pool, suffix] = SLOT[kind] || []; return { kind, pool: pool ? pool(rest.join('.')) : null, suffix }; };
/** the line the leaf's draw picks BEFORE resolution: pickVariant over the pool less its twins, on the leaf's key */
const drawnBefore = (pool, seed, id, suffix) => {
  const domain = pool.some(isTwin) ? pool.filter((l) => !isTwin(l)) : pool;
  return String(lineText(pickVariant(domain, `${seed}::${id}${suffix}`)) ?? '');
};

/**
 * One rite described for one audience, with each slot it drew: { d, slots: [{ pool, kind, resolvedBy, drawn, printed }],
 * mismatch } or null. `drawn` is the line the draw picked; `printed` the line that stands (null: nothing).
 */
export function describeWithSlots(rec, town, audience) {
  const { result: d, ledger } = withPresumptionLedger(() => describeTradition(rec, town, { audience }));
  if (!d) return null;
  const seed = String(town._seed ?? town.id ?? ''); const id = String(rec.id || rec.name || '');
  const slots = []; let mismatch = 0;
  for (const e of ledger) {
    const pid = String(e.pool || ''); if (!pid.startsWith(PREFIX)) continue;
    const poolKey = pid.slice(PREFIX.length); const { kind, pool, suffix } = slotOf(poolKey);
    if (!pool) { slots.push({ pool: poolKey, kind, resolvedBy: e.resolvedBy, drawn: '(unknown pool)', printed: `#${e.lineId}` }); mismatch++; continue; }
    const line = pool[Number(e.lineId)]; const printed = String(lineText(line) ?? '');
    const drawn = drawnBefore(pool, seed, id, suffix);
    if (e.resolvedBy === 'drawn' && drawn !== printed) mismatch++;
    if (e.resolvedBy === 'twin' && !(isTwin(line) && line.twinOf === drawn)) mismatch++;
    slots.push({ pool: poolKey, kind, resolvedBy: e.resolvedBy, drawn, printed });
  }
  // the gloss is always drawn: no note of it is a refusal that resolved to nothing (the ledger notes no null line)
  const element = String(rec?.coreMotif?.element ?? ''); const glossKey = `gloss.${element}`;
  if (ELEMENT_GLOSS[element] && !slots.some((s) => s.pool === glossKey)) {
    slots.push({ pool: glossKey, kind: 'gloss', resolvedBy: 'none', drawn: drawnBefore(ELEMENT_GLOSS[element], seed, id, '#gloss'), printed: null });
  }
  // a keeper or an origin the parts say stands, with no note: a frame refused to nothing (no frame declares: never seen)
  if (d.parts.keeper && !slots.some((s) => ['owner', 'house', 'power'].includes(s.kind))) slots.push({ pool: `(${d.parts.keeper}: unseen)`, kind: 'keeper', resolvedBy: 'none', drawn: '?', printed: null });
  if (d.parts.origin && !slots.some((s) => ['cause', 'economy'].includes(s.kind))) slots.push({ pool: `(${d.parts.origin}: unseen)`, kind: 'origin', resolvedBy: 'none', drawn: '?', printed: null });
  return { d, slots, mismatch };
}

/** The rites an audience is shown: the owner's tab (shownTraditionsOf); the reader's shared rows (sharedTraditionRowsOf). */
export function shownFor(town, audience) {
  const recs = shownTraditionsOf(town, []).recs;
  if (audience === 'owner') return recs.map((rec) => ({ rec, rowText: null }));
  const rows = sharedTraditionRowsOf(town) || []; const out = []; let i = 0;
  for (const row of rows) { while (i < recs.length && String(recs[i].name ?? '') !== row.name) i++; if (i < recs.length) out.push({ rec: recs[i++], rowText: row.text }); else out.push({ rec: null, rowText: row.text }); }
  return out;
}

const withoutCriminalIncome = (t) => ({ ...t, economicState: { ...(t.economicState || {}), incomeSources: (t.economicState?.incomeSources || []).filter((r) => r?.isCriminal !== true) } });
/** the sentence where two texts part (the economy sentence is the last; S1 and S2 do not read the incomes) */
const tailFrom = (a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; const cut = a.lastIndexOf('. ', i); return cut < 0 ? a : a.slice(cut + 2); };

function main() {
  const [, , poolFile, outFile, audience = 'owner'] = process.argv;
  const towns = readFileSync(poolFile, 'utf8').trim().split('\n').map(JSON.parse);
  const blank = () => ({ n: 0, house: 0, owner: 0, power: 0, cause: 0, economy: 0, short: 0 });
  const tot = blank(); const byEl = new Map(); const byTier = new Map(); const shape = new Map(); const whole = new Map();
  const pools = new Map(); // poolKey -> { draws, lines: Map<printed,count>, drawn: Map<drawn,count>, res: Map<resolvedBy, Map<'drawn → printed', count>> }
  let deadWithCause = 0; let dead = 0; let nulls = 0; let mismatch = 0; let rowDiffer = 0; let unmatched = 0; let shownRecs = 0;
  let crimTowns = 0; let crimRites = 0; const crimPairs = []; let crimEconomy = 0;
  const bump = (o, d) => {
    o.n++; if (d.parts.keeper === 'house') o.house++; if (d.parts.keeper === 'owner') o.owner++; if (d.parts.keeper === 'power') o.power++;
    if (d.parts.origin === 'cause') o.cause++; if (d.parts.origin === 'economy') o.economy++; if (!d.parts.keeper && !d.parts.origin) o.short++;
  };
  const stressed = towns.filter((t) => (Array.isArray(t.stress) ? t.stress.length : t.stress)).length;
  for (const t of towns) {
    const hasCrim = (t.economicState?.incomeSources || []).some((r) => r?.isCriminal === true); if (hasCrim) crimTowns++;
    const tLess = hasCrim ? withoutCriminalIncome(t) : null;
    for (const { rec, rowText } of shownFor(t, audience)) {
      if (!rec) { unmatched++; continue; }
      shownRecs++;
      const r = describeWithSlots(rec, t, audience);
      if (!r) { nulls++; continue; }
      const { d, slots } = r; mismatch += r.mismatch;
      if (rowText !== null && rowText !== d.text) rowDiffer++;
      bump(tot, d);
      const el = rec.coreMotif.element;
      if (!byEl.has(el)) byEl.set(el, blank()); bump(byEl.get(el), d);
      if (!byTier.has(t.tier)) byTier.set(t.tier, blank()); bump(byTier.get(t.tier), d);
      if (el === 'the-dead') { dead++; if (d.parts.origin === 'cause') deadWithCause++; }
      const sh = t.name ? d.text.split(t.name).join('{town}') : d.text; shape.set(sh, (shape.get(sh) || 0) + 1);
      whole.set(d.text, (whole.get(d.text) || 0) + 1);
      for (const s of slots) {
        if (!pools.has(s.pool)) pools.set(s.pool, { draws: 0, lines: new Map(), drawn: new Map(), res: new Map() });
        const p = pools.get(s.pool); p.draws++; p.drawn.set(s.drawn, (p.drawn.get(s.drawn) || 0) + 1);
        const printed = s.printed ?? '(nothing)'; p.lines.set(printed, (p.lines.get(printed) || 0) + 1);
        if (s.resolvedBy !== 'drawn') { const m = p.res.get(s.resolvedBy) || new Map(); const k = `"${s.drawn}" → ${s.printed === null ? 'nothing' : `"${s.printed}"`}`; m.set(k, (m.get(k) || 0) + 1); p.res.set(s.resolvedBy, m); }
      }
      // CTR11's other direction (owner audience): the economy sentence, with and without the criminal income rows
      if (audience === 'owner' && hasCrim) {
        crimRites++;
        const less = describeTradition(rec, tLess, { audience: 'owner' });
        const reader = describeTradition(rec, t, { audience: 'reader' });
        if (less && less.text !== d.text && (d.parts.origin === 'economy' || less.parts.origin === 'economy')) {
          crimEconomy++;
          if (crimPairs.length < 3) {
            const mask = (s) => (t.name ? s.split(t.name).join('{town}') : s);
            const own = d.parts.origin === 'economy' ? tailFrom(d.text, less.text) : '(no economy sentence)';
            const rd = reader && reader.parts.origin === 'economy' ? tailFrom(reader.text, d.text) : '(no economy sentence)';
            crimPairs.push(`  ${rec.name} (${t.tier}): OWNER "${mask(own)}"  /  READER "${mask(rd)}"  [criminal row at rank ${(t.economicState.incomeSources || []).findIndex((x) => x?.isCriminal === true) + 1} of ${(t.economicState.incomeSources || []).length}]`);
          }
        }
      }
    }
  }
  const pct = (a, n) => `${a} (${n ? (100 * a / n).toFixed(1) : '0.0'}%)`;
  const row = (k, o) => `${k.padEnd(14)} n=${String(o.n).padStart(4)}  house/owner=${pct(o.house + o.owner, o.n)}  power=${pct(o.power, o.n)}  cause=${pct(o.cause, o.n)}  economy=${pct(o.economy, o.n)}  SHORT=${pct(o.short, o.n)}`;
  const out = [`# TRAD-4 unit 6 measure (the final leaf) — audience=${audience}; towns=${towns.length}; printed rites=${tot.n}`, row('ALL', tot),
    `  (of house/owner: house=${tot.house}, the rite's owner in play=${tot.owner})`,
    `  set: ${audience === 'owner' ? "the owner's tab (shownTraditionsOf)" : "the shared page's rows (sharedTraditionRowsOf), each description checked against the row's own text"}; rites shown=${shownRecs}${audience === 'owner' ? '' : `; rows not matched to a rite=${unmatched}; rows whose text differs from the description here=${rowDiffer}`}; no description composed=${nulls}`,
    '', '## by tier (size)'];
  for (const k of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) if (byTier.has(k)) out.push(row(k, byTier.get(k)));
  out.push('', '## by element'); for (const e of TRADITION_ELEMENTS) if (byEl.has(e.id)) out.push(row(e.id, byEl.get(e.id)));
  out.push('', `rites of the dead: ${dead}; keeping a cause (a major or catastrophic siege, fire, flood or plague): ${deadWithCause}`);
  out.push('', '## per slot pool: draws · distinct lines printed · THE POOL-DOMINANCE FIGURE (the most printed line and its share) · lines refused and what replaced them');
  out.push('# read from the presumption ledger (`pool`, `lineId`), the drawn line re-read by the leaf\'s own key; a refusal to nothing is seen where the slot always draws (gloss)');
  out.push(`# re-derivation disagreements with the ledger: ${mismatch}`);
  out.push(`# towns of this pool holding a stress (a crisis the record holds: crisis-scoped lines answer to it): ${stressed} of ${towns.length}`);
  out.push('# drawn-top: the most DRAWN line (before any refusal) and its share; the pick is kernel/proseHash.js :: pickVariant, fnv1a32(key) % pool size');
  let dom = null;
  for (const [id, p] of [...pools].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const top = [...p.lines].sort((a, b) => b[1] - a[1])[0]; const share = top[1] / p.draws;
    if (p.draws >= 20 && (!dom || share > dom.share)) dom = { id, share, line: top[0], draws: p.draws, n: top[1] };
    const res = [...p.res].map(([k, m]) => `${k} ${[...m.values()].reduce((a, b) => a + b, 0)}: ${[...m].sort((a, b) => b[1] - a[1]).map(([l, c]) => `${c}× ${l}`).join('; ')}`).join(' | ');
    const dtop = [...p.drawn].sort((a, b) => b[1] - a[1])[0];
    out.push(`${id.padEnd(22)} draws=${String(p.draws).padStart(4)} lines=${p.lines.size}  top=${(100 * share).toFixed(1)}% "${top[0]}"  drawn-top=${(100 * dtop[1] / p.draws).toFixed(1)}% "${dtop[0]}"${res ? `\n${''.padEnd(24)}refused: ${res}` : ''}`);
  }
  if (dom) out.push('', `most dominated pool (of pools with 20 draws or more): ${dom.id} — "${dom.line}" ${dom.n} of ${dom.draws} (${(100 * dom.share).toFixed(1)}%)`);
  if (audience === 'owner') {
    out.push('', "## CTR11's other direction (for the owner's list): the owner's economy sentence ranks with the criminal income row; the reader's without it");
    out.push(`towns holding a criminal income row: ${crimTowns} of ${towns.length}; their printed rites: ${crimRites}; rites whose owner economy sentence differs from the record-less-the-row's: ${crimEconomy} (of ${tot.n} printed rites)`);
    out.push(...crimPairs);
  }
  out.push('', '## ten most repeated shapes (town masked)'); [...shape].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => out.push(`${v}x  ${k}`));
  out.push('', '## ten most repeated whole descriptions'); [...whole].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, v]) => out.push(`${v}x  ${k}`));
  out.push('', `distinct whole: ${whole.size} of ${tot.n}; distinct shapes: ${shape.size}`);
  writeFileSync(outFile, `${out.join('\n')}\n`);
  console.log(out.slice(0, 4).join('\n'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
