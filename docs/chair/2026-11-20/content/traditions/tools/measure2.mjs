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
//
// TRAD-4 unit 10 (2026-11-20): each rite is described over its audience's SET (shownTraditions.js :: descriptionSetOf;
// the leaf's `set`), as every surface now describes it, so a frame slot's wording may be TURNED by the rotation: a
// 'drawn' note whose line is not the re-derived pick, on a rite whose text differs from the rite described alone, is
// counted as turned (not a disagreement). New counts: the descriptions the rotation moved, the payer sentences it left
// out, and THE BAR: the towns printing an IDENTICAL sentence (the town's name in) in two or more of their own rites, by
// slot (townRepeats), with the slot that ran out where one did.
// - CTR11's OTHER DIRECTION (the owner's list): the printed rites whose OWNER economy sentence differs from the one the
//   record less its criminal income rows (`isCriminal: true`, the class the reader's view drops) would print.
//
// TRAD-5 unit 12 (2026-11-20): the leaf's one pick is kernel/proseHash.js :: pickVariantMixed since unit 11 (the leaf's
// draw and drawTurn); the re-derivation of the drawn line (drawnBefore) now reads it too, else every draw would count as a
// disagreement or a turn. The figures are otherwise read as before.
//
// TRAD-5 unit 13 build (2026-11-20, the chair's 21:03 approval): a held element's later rite draws its "also" gloss
// (traditionDescriptionTable.js :: ELEMENT_GLOSS_ALSO, poolId `also.<element>`, key `#gloss`), read here as the gloss slot.
// The table is read through its namespace (absent before the build: {}), so this file also runs against the base tree.
// `dump` writes each place's texts per audience (the owner's set described whole; the reader's drawn rows); `moved` compares
// two dumps (before, after) and names every description that moved, and how.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { descriptionSetOf, sharedTraditionRowsOf, shownTraditionsOf } from '../../../../../../src/domain/traditions/shownTraditions.js';
import { deriveFoundingTraditions } from '../../../../../../src/domain/traditions/genesis.js';
import { describeTradition, describeTraditions } from '../../../../../../src/domain/traditions/traditionDescription.js';
import { withPresumptionLedger } from '../../../../../../src/domain/facts/presumptionLedger.js';
import { lineText } from '../../../../../../src/domain/facts/drawDeclared.js';
import { pickVariantMixed } from '../../../../../../src/kernel/proseHash.js';
import { TRADITION_ELEMENTS } from '../../../../../../src/data/traditionCorpus.js';
import {
  ACT_LEADS, ELEMENT_GLOSS, OWNER_FRAMES, HOUSE_FRAMES, POWER_FRAMES, CAUSE_FRAMES, ECONOMY_FRAMES, KEEPER_FRAMES_TOO,
} from '../../../../../../src/data/traditionDescriptionTable.js';
import * as TABLE from '../../../../../../src/data/traditionDescriptionTable.js';

/** TRAD-5 unit 13: a held element's "also" gloss pools ({} before the build). */
const ALSO = TABLE.ELEMENT_GLOSS_ALSO || {};

const PREFIX = 'traditionDescription:';
/** a slot's pool, by the leaf's poolId (`lead.feast`, `house.placePower`, …), and the key suffix its draw uses */
const SLOT = {
  lead: [(k) => ACT_LEADS[k], '#done'], gloss: [(k) => ELEMENT_GLOSS[k], '#gloss'], owner: [() => OWNER_FRAMES, '#owner'],
  house: [(k) => HOUSE_FRAMES[k], '#house'], power: [(k) => POWER_FRAMES[k], '#power'], cause: [(k) => CAUSE_FRAMES[k], '#origin'],
  economy: [(k) => ECONOMY_FRAMES[k], '#economy'], also: [(k) => ALSO[k], '#gloss'],
};
const isTwin = (l) => !!l && typeof l === 'object' && typeof l.twinOf === 'string';
const slotOf = (poolKey) => { const [kind, ...rest] = poolKey.split('.'); const [pool, suffix] = SLOT[kind] || []; return { kind, pool: pool ? pool(rest.join('.')) : null, suffix }; };
/** unit 10 (the chair, 17:55): a keeper's "too" wordings follow its pool in the ledger's line ids (never in the pick's domain) */
const tooOf = (kind, poolKey) => (kind === 'owner' ? KEEPER_FRAMES_TOO.owner : ['house', 'power'].includes(kind) ? KEEPER_FRAMES_TOO[poolKey.split('.')[1]] || [] : []);
const TOO_RES = Object.values(KEEPER_FRAMES_TOO).flat().map((l) => new RegExp(`^${l.text.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+?')}$`));
/** does a text print a keeper's "too" wording? */
const printsToo = (text) => String(text || '').split(/(?<=\.) (?=\p{Lu})/u).some((x) => TOO_RES.some((re) => re.test(x)));
/** every sentence printed in two or more of the texts */
const twiceIn = (texts) => { const m = new Map(); for (const t of texts) for (const x of String(t || '').split(/(?<=\.) (?=\p{Lu})/u).filter(Boolean)) m.set(x, (m.get(x) || 0) + 1); return [...m].filter(([, n]) => n >= 2); };
/** the line the leaf's draw picks BEFORE resolution: pickVariantMixed (TRAD-5 unit 12: the leaf's pick since unit 11) over the pool less its twins, on the leaf's key */
const drawnBefore = (pool, seed, id, suffix) => {
  const domain = pool.some(isTwin) ? pool.filter((l) => !isTwin(l)) : pool;
  return String(lineText(pickVariantMixed(domain, `${seed}::${id}${suffix}`)) ?? '');
};

/**
 * One rite described for one audience, with each slot it drew: { d, slots: [{ pool, kind, resolvedBy, drawn, printed }],
 * mismatch, turned, alone } or null. `drawn` is the line the draw picked; `printed` the line that stands (null: nothing);
 * `alone` the rite described with no set (unit 10: the rotation's control).
 */
export function describeWithSlots(rec, town, audience) {
  const set = descriptionSetOf(town, audience, []);
  const { result: d, ledger: all } = withPresumptionLedger(() => describeTradition(rec, town, { audience, set }));
  if (!d) return null;
  // the leaf composes the set's earlier rites first (the rotation): this rite's notes are the ones after theirs
  const at = set.findIndex((r) => String(r.id || r.name || '') === String(rec.id || rec.name || ''));
  const before = at > 0 ? withPresumptionLedger(() => describeTraditions(set.slice(0, at), town, { audience })).ledger.length : 0;
  const ledger = all.slice(before);
  const alone = describeTradition(rec, town, { audience }); const moved = !alone || alone.text !== d.text; let turned = 0;
  const seed = String(town._seed ?? town.id ?? ''); const id = String(rec.id || rec.name || '');
  const slots = []; let mismatch = 0;
  for (const e of ledger) {
    const pid = String(e.pool || ''); if (!pid.startsWith(PREFIX)) continue;
    const poolKey = pid.slice(PREFIX.length); const { kind, pool, suffix } = slotOf(poolKey);
    if (!pool) { slots.push({ pool: poolKey, kind, resolvedBy: e.resolvedBy, drawn: '(unknown pool)', printed: `#${e.lineId}` }); mismatch++; continue; }
    const line = [...pool, ...tooOf(kind, poolKey)][Number(e.lineId)]; const printed = String(lineText(line) ?? '');
    const drawn = drawnBefore(pool, seed, id, suffix);
    if (e.resolvedBy === 'drawn' && drawn !== printed) { if (moved) turned++; else mismatch++; }
    if (e.resolvedBy === 'twin' && !(isTwin(line) && line.twinOf === drawn)) mismatch++;
    slots.push({ pool: poolKey, kind, resolvedBy: e.resolvedBy, drawn, printed });
  }
  // the gloss is always drawn: no note of it is a refusal that resolved to nothing (the ledger notes no null line)
  const element = String(rec?.coreMotif?.element ?? ''); const glossKey = `gloss.${element}`;
  if (ELEMENT_GLOSS[element] && !slots.some((s) => s.pool === glossKey || s.pool === `also.${element}`)) {
    slots.push({ pool: glossKey, kind: 'gloss', resolvedBy: 'none', drawn: drawnBefore(ELEMENT_GLOSS[element], seed, id, '#gloss'), printed: null });
  }
  // a keeper or an origin the parts say stands, with no note: a frame refused to nothing (no frame declares: never seen)
  if (d.parts.keeper && !slots.some((s) => ['owner', 'house', 'power'].includes(s.kind))) slots.push({ pool: `(${d.parts.keeper}: unseen)`, kind: 'keeper', resolvedBy: 'none', drawn: '?', printed: null });
  if (d.parts.origin && !slots.some((s) => ['cause', 'economy'].includes(s.kind))) slots.push({ pool: `(${d.parts.origin}: unseen)`, kind: 'origin', resolvedBy: 'none', drawn: '?', printed: null });
  return { d, slots, mismatch, turned, alone };
}

/** The rites an audience is shown, its SET (descriptionSetOf): the owner's tab; the reader's drawn rows, each with its text. */
export function shownFor(town, audience) {
  const recs = descriptionSetOf(town, audience, []);
  if (audience === 'owner') return recs.map((rec) => ({ rec, rowText: null }));
  const rows = sharedTraditionRowsOf(town) || [];
  return rows.map((row, i) => ({ rec: recs[i] && String(recs[i].name ?? '') === row.name ? recs[i] : null, rowText: row.text }));
}

/**
 * TRAD-4 unit 10: one rite's sentences, each with its SLOT: S1 'lead+gloss'; S2 'owner', 'keeper house' (house.body*),
 * 'keeper place' (house.place*), 'keeper power' (power.*); S3 'cause', 'payer' (economy.*). Every frame of the table is
 * one sentence, so the text splits at a full stop before a capital (any script: "Ögedeiserai") into 1 + (keeper) + (origin) sentences; a split that
 * does not count so is returned as `split: false` (and counted by the caller).
 */
const S2_SLOT = (pool) => (pool === 'owner' ? 'owner' : pool.startsWith('house.body') ? 'keeper house' : pool.startsWith('house.place') ? 'keeper place' : pool.startsWith('power.') ? 'keeper power' : null);
const S3_SLOT = (pool) => (pool.startsWith('cause.') ? 'cause' : pool.startsWith('economy.') ? 'payer' : null);
export function slotSentences(d, slots) {
  const parts = d.text.split(/(?<=\.) (?=\p{Lu})/u);
  const s2 = slots.map((s) => S2_SLOT(s.pool)).find(Boolean) || null;
  const s3 = slots.map((s) => S3_SLOT(s.pool)).find(Boolean) || null;
  const want = 1 + (d.parts.keeper ? 1 : 0) + (d.parts.origin ? 1 : 0);
  if (parts.length !== want) return { split: false, sentences: [] };
  const names = ['lead+gloss', ...(d.parts.keeper ? [s2 || '(keeper?)'] : []), ...(d.parts.origin ? [s3 || '(origin?)'] : [])];
  return { split: true, sentences: parts.map((text, i) => ({ slot: names[i], text })) };
}
/**
 * TRAD-4 unit 10: the town's rites (the audience's own set) that print an IDENTICAL sentence (the town's name in) in two or
 * more of them: [{ slot, text, rites: [name…] }], one entry a repeated sentence; plus the rites whose split failed.
 */
export function townRepeats(town, audience) {
  const by = new Map(); let unsplit = 0;
  for (const { rec } of shownFor(town, audience)) {
    if (!rec) continue;
    const r = describeWithSlots(rec, town, audience); if (!r) continue;
    const { split, sentences } = slotSentences(r.d, r.slots); if (!split) { unsplit++; continue; }
    for (const { slot, text } of sentences) {
      const e = by.get(text) || { slots: new Set(), text, rites: [] }; e.slots.add(slot); e.rites.push(String(rec.name ?? '')); by.set(text, e);
    }
  }
  const repeats = [...by.values()].filter((e) => e.rites.length >= 2).map((e) => ({ slot: [...e.slots].join('/'), text: e.text, rites: e.rites }));
  return { repeats, unsplit };
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
  let deadWithCause = 0; let dead = 0; let nulls = 0; let mismatch = 0; let turned = 0; let moved = 0; let leftOut = 0; let rowDiffer = 0; let unmatched = 0; let shownRecs = 0;
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
      const { d, slots } = r; mismatch += r.mismatch; turned += r.turned;
      if (!r.alone || r.alone.text !== d.text) moved++;
      if (r.alone && r.alone.parts.origin === 'economy' && d.parts.origin === null) leftOut++;
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
  out.push(`# re-derivation disagreements with the ledger: ${mismatch} (and ${turned} draws the unit 10 rotation turned)`);
  out.push(`# towns of this pool holding a stress (a crisis the record holds: crisis-scoped lines answer to it): ${stressed} of ${towns.length}`);
  out.push('# drawn-top: the most DRAWN line (before any refusal) and its share; the pick is kernel/proseHash.js :: pickVariantMixed, mix32(fnv1a32(key)) % pool size');
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
  // TRAD-4 unit 10: a sentence printed twice inside ONE town (its own rites, this audience's set), by slot
  const rep = new Map(); const towns2 = new Set(); let pairs = 0; let unsplit = 0; const samples = [];
  for (const t of towns) {
    const { repeats, unsplit: u } = townRepeats(t, audience); unsplit += u;
    if (repeats.length) towns2.add(t.name);
    for (const r of repeats) {
      const p = (r.rites.length * (r.rites.length - 1)) / 2; pairs += p;
      const o = rep.get(r.slot) || { towns: new Set(), pairs: 0, sentences: 0 }; o.towns.add(t.name); o.pairs += p; o.sentences++; rep.set(r.slot, o);
      if (samples.length < 12 || /Ringthwaite|Bergbrekka/.test(t.name)) samples.push(`  ${t.name} [${r.slot}] ${r.rites.length}x "${r.text}" (${r.rites.join(' | ')})`);
    }
  }
  out.push('', '## TRAD-4 unit 10: an IDENTICAL sentence (town name in) in two or more rites of ONE town, by slot');
  out.push(`descriptions the rotation moved (described over the set vs alone): ${moved} of ${tot.n}; payer sentences left out: ${leftOut}`);
  out.push(`towns with any: ${towns2.size} of ${towns.length}; sentence pairs: ${pairs}; rites whose text did not split by its parts: ${unsplit}`);
  for (const s of ['lead+gloss', 'keeper house', 'keeper place', 'keeper power', 'owner', 'cause', 'payer']) {
    const o = rep.get(s); out.push(`${s.padEnd(13)} towns=${o ? o.towns.size : 0} sentences=${o ? o.sentences : 0} pairs=${o ? o.pairs : 0}`);
  }
  for (const [s, o] of rep) if (!['lead+gloss', 'keeper house', 'keeper place', 'keeper power', 'owner', 'cause', 'payer'].includes(s)) out.push(`${s.padEnd(13)} towns=${o.towns.size} sentences=${o.sentences} pairs=${o.pairs}  (a sentence across slots)`);
  out.push(...samples);
  // unit 10, the chair's 17:55 ruling and TRAD-4's law: the "too" wordings are never a pick; a keeper left out beyond its fifth
  let tooPrinted = 0; let tooAlone = 0; let tooFirst = 0; let keeperOut = 0; const sixth = new Set(); let surfaceTwice = 0; const surfaceSamples = [];
  for (const t of towns) {
    const seen = new Set();
    for (const { rec } of shownFor(t, audience)) {
      if (!rec) continue;
      const set = descriptionSetOf(t, audience, []);
      const d = describeTradition(rec, t, { audience, set }); const alone = describeTradition(rec, t, { audience });
      if (!d || !alone) continue;
      const key = JSON.stringify([alone.parts.keeper, alone.named.houses, alone.named.powers]);
      if (printsToo(alone.text)) tooAlone++;
      if (printsToo(d.text)) { tooPrinted++; if (!seen.has(key)) tooFirst++; }
      if (alone.parts.keeper && !d.parts.keeper) { keeperOut++; sixth.add(t._seed); }
      seen.add(key);
    }
    // for the hand-back: the surfaces that print rites OUTSIDE the set they rotate over
    const texts = audience === 'owner'
      ? deriveFoundingTraditions(t).map((rec, _i, mirror) => describeTradition(rec, { ...t, traditions: mirror }, { audience: 'owner', set: descriptionSetOf({ ...t, traditions: mirror }, 'owner', []) })?.text ?? '')
      : shownTraditionsOf(t, []).recs.map((rec) => describeTradition(rec, t, { audience: 'reader', set: descriptionSetOf(t, 'reader') })?.text ?? '');
    const tw = twiceIn(texts); if (tw.length) { surfaceTwice++; if (surfaceSamples.length < 6) surfaceSamples.push(`  ${t.name}: ${tw.map(([x, n]) => `${n}x "${x}"`).join('; ')}`); }
  }
  out.push('', '## TRAD-4 unit 10, the keeper\'s "too" wordings (the chair, 17:55 UTC)');
  out.push(`"too" wordings printed: ${tooPrinted}; in a rite described alone: ${tooAlone}; in a rite first in its set to name its keeper: ${tooFirst}`);
  out.push(`keeper sentences left out (beyond the fifth): ${keeperOut}; towns reaching a sixth rite of one keeper: ${sixth.size} of ${towns.length}`);
  out.push(audience === 'owner'
    ? `THE PDF over a lit mirror (the founding set as the mirror, every row printed, a row the set drops described alone): towns printing a sentence twice: ${surfaceTwice}`
    : `THE PLAYER TAB (the owner's set shown, the reader's description over the drawn set, a rite outside it described alone): towns printing a sentence twice: ${surfaceTwice}`);
  out.push(...surfaceSamples);
  writeFileSync(outFile, `${out.join('\n')}\n`);
  console.log(out.slice(0, 4).join('\n'));
}

/**
 * TRAD-5 unit 13 (2026-11-20): TWO RITES OF ONE PLACE THAT HONOUR THE SAME THING. Over the set each audience is shown
 * (shownFor), the places where two or more rites share a coreMotif ELEMENT, and of those the places where two of them print
 * the SAME gloss (the S1 sentence-part, read from the leaf's own gloss slot: describeWithSlots); the same where two share
 * element AND act. `moved`: the rites a per-place gloss rotation would re-word (a later rite of a held element whose
 * printed gloss an earlier rite of that element in the set already printed); `exhausted`: of those, the ones whose
 * element's gloss pool holds no wording the earlier rites have not printed; `later`: every rite of the set after the first of
 * its element (what a "too" gloss for a held element would re-word, whatever its gloss).
 */
export function sameSubject(towns, audience) {
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const blank = () => ({ n: 0, two: 0, el: 0, elGloss: 0, ea: 0, eaGloss: 0, moved: 0, exhausted: 0, later: 0, rites: 0, plainTwice: 0, alsoTwice: 0, unack: 0, also: 0 });
  const by = new Map(TIERS.map((k) => [k, blank()]));
  const els = new Map(); const samples = [];
  for (const t of towns) {
    const o = by.get(t.tier) || by.set(t.tier, blank()).get(t.tier);
    o.n++;
    const rites = [];
    for (const { rec } of shownFor(t, audience)) {
      if (!rec) continue;
      const r = describeWithSlots(rec, t, audience);
      const g = r ? r.slots.find((s) => s.kind === 'gloss' || s.kind === 'also') : null;
      rites.push({ name: String(rec.name ?? ''), el: String(rec.coreMotif?.element ?? ''), act: String(rec.coreMotif?.act ?? ''), gloss: g ? g.printed : null });
    }
    o.rites += rites.length; if (rites.length >= 2) o.two++;
    const group = (key) => { const m = new Map(); for (const x of rites) { const k = key(x); m.set(k, [...(m.get(k) || []), x]); } return [...m.values()].filter((v) => v.length >= 2); };
    const sameGloss = (gs) => gs.some((v) => { const p = v.map((x) => x.gloss).filter(Boolean); return new Set(p).size < p.length; });
    const eg = group((x) => x.el); const ag = group((x) => `${x.el}|${x.act}`);
    if (eg.length) { o.el++; for (const v of eg) els.set(v[0].el, (els.get(v[0].el) || 0) + 1); }
    if (eg.length && sameGloss(eg)) { o.elGloss++; if (samples.length < 8) { const v = eg.find((w) => sameGloss([w])); samples.push(`  ${t.name} (${t.tier}) [${v[0].el}]: ${v.map((x) => `${x.name} "${x.gloss}"`).join(' | ')}`); } }
    if (ag.length) o.ea++;
    if (ag.length && sameGloss(ag)) o.eaGloss++;
    // unit 13 build: the same PRESENT gloss twice (a repeat unacknowledged), the same "also" line twice (a third rite), a
    // later rite of a held element whose gloss does not say "also" (unacknowledged), and the "also" lines printed
    const isAlso = (g) => typeof g === 'string' && g.startsWith('also ');
    const twiceBy = (pred) => eg.some((v) => { const p = v.map((x) => x.gloss).filter(pred); return new Set(p).size < p.length; });
    if (twiceBy((g) => !!g && !isAlso(g))) o.plainTwice++;
    if (twiceBy(isAlso)) o.alsoTwice++;
    { const first = new Set(); for (const x of rites) { if (first.has(x.el) && x.gloss && !isAlso(x.gloss)) o.unack++; if (isAlso(x.gloss)) o.also++; first.add(x.el); } }
    // the cure's reach: in set order, a later rite of a held element whose gloss is already printed there
    const seen = new Map();
    for (const x of rites) {
      const s = seen.get(x.el) || new Set(); if (seen.has(x.el)) o.later++;
      if (x.gloss && s.has(x.gloss)) { o.moved++; const pool = (ELEMENT_GLOSS[x.el] || []).filter((l) => !isTwin(l)).map((l) => String(lineText(l) ?? '')); if (pool.every((l) => s.has(l))) o.exhausted++; }
      if (x.gloss) s.add(x.gloss); seen.set(x.el, s);
    }
  }
  const pc = (a, n) => `${String(a).padStart(3)}/${n} (${n ? (100 * a / n).toFixed(1) : '0.0'}%)`;
  const out = [`## audience=${audience} — places=${towns.length}; set: shownFor (descriptionSetOf ${audience === 'owner' ? "owner: shownTraditionsOf" : 'reader: the drawn set, rows matched to rites'})`,
    'size        rites  2+rites  SAME ELEMENT       +same gloss        SAME ELEMENT+ACT   +same gloss        cure moves (exhausted)  later rites of a held element'];
  const all = blank();
  for (const [k, o] of by) {
    if (!o.n) continue; for (const f of Object.keys(all)) all[f] += o[f];
    out.push(`${k.padEnd(11)} ${String(o.rites).padStart(5)}  ${String(o.two).padStart(7)}  ${pc(o.el, o.n)}  ${pc(o.elGloss, o.n)}  ${pc(o.ea, o.n)}  ${pc(o.eaGloss, o.n)}  ${o.moved} (${o.exhausted})  ${o.later}`);
  }
  const o = all; out.push(`${'ALL'.padEnd(11)} ${String(o.rites).padStart(5)}  ${String(o.two).padStart(7)}  ${pc(o.el, o.n)}  ${pc(o.elGloss, o.n)}  ${pc(o.ea, o.n)}  ${pc(o.eaGloss, o.n)}  ${o.moved} (${o.exhausted})  ${o.later}  of ${o.rites} rites`);
  out.push(`unit 13 build — places printing one PRESENT gloss twice: ${all.plainTwice}; places printing one "also" line twice (a third rite of an element): ${all.alsoTwice}; later rites of a held element NOT saying "also" (unacknowledged): ${all.unack} of ${all.later}; "also" glosses printed: ${all.also}`);
  out.push(`elements repeated (place-element pairs): ${[...els].sort((a, b) => b[1] - a[1]).map(([e, n]) => `${e} ${n}`).join(', ') || 'none'}`);
  out.push('same gloss, first samples:', ...samples);
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // TRAD-5 unit 13: `node measure2.mjs <pool.ndjson> <out.txt> same` writes the same-subject count, owner and reader
  if (process.argv[4] === 'dump') {
    // unit 13: each place's texts, per audience, in set order (the owner's set described whole; the reader's drawn rows)
    const towns = readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
    const lines = towns.map((t) => {
      const ownerSet = descriptionSetOf(t, 'owner', []);
      const owner = describeTraditions(ownerSet, t, { audience: 'owner' }).map((d, i) => ({ name: String(ownerSet[i].name ?? ''), text: d ? d.text : '' }));
      const reader = (sharedTraditionRowsOf(t) || []).map((r) => ({ name: r.name, text: r.text }));
      return JSON.stringify({ seed: String(t._seed ?? t.id ?? ''), tier: t.tier, owner, reader });
    });
    writeFileSync(process.argv[3], `${lines.join('\n')}\n`);
    console.log(`dump: towns=${towns.length} -> ${process.argv[3]}`);
  } else if (process.argv[4] === 'moved') {
    // unit 13: `node measure2.mjs <before.ndjson> <out.txt> moved <after.ndjson>`: the descriptions that moved, by audience
    // and size; each must differ ONLY in S1's gloss, a present line become its element's "also" line
    const read = (f) => new Map(readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse).map((x) => [x.seed, x]));
    const before = read(process.argv[2]); const after = read(process.argv[5]);
    const alsoTexts = new Set(Object.values(ALSO).flat().map((l) => String(lineText(l) ?? '')));
    const s1 = (text) => { const i = text.indexOf('.'); const head = text.slice(0, i); const j = head.indexOf(' that '); return { lead: j < 0 ? head : head.slice(0, j), gloss: j < 0 ? null : head.slice(j + 6), rest: text.slice(i + 1) }; };
    const out = [`# unit 13 moved: before ${process.argv[2]} -> after ${process.argv[5]} (places ${after.size})`];
    for (const audience of ['owner', 'reader']) {
      const m = new Map(); let rites = 0; let moved = 0; let anomalies = 0; const twice = { before: 0, after: 0 }; const odd = [];
      for (const [seed, a] of after) {
        const b = before.get(seed); const tier = a.tier; const o = m.get(tier) || { moved: 0, rites: 0 }; m.set(tier, o);
        for (const [k, x] of [['before', b], ['after', a]]) if (x && twiceIn(x[audience].map((r) => r.text)).length) twice[k]++;
        if (!b || b[audience].length !== a[audience].length) { anomalies++; odd.push(`${seed} ${audience}: set differs`); continue; }
        a[audience].forEach((r, i) => {
          rites++; o.rites++; const was = b[audience][i];
          if (was.name !== r.name) { anomalies++; odd.push(`${seed} ${audience} #${i}: name`); return; }
          if (was.text === r.text) return;
          moved++; o.moved++;
          const p = s1(was.text); const q = s1(r.text);
          if (p.lead !== q.lead || p.rest !== q.rest || !alsoTexts.has(String(q.gloss))) { anomalies++; if (odd.length < 8) odd.push(`${seed} ${audience} ${r.name}: "${was.text}" -> "${r.text}"`); }
        });
      }
      out.push(`## ${audience}: descriptions moved ${moved} of ${rites}; moved otherwise than S1's gloss to an "also" line (or a set that differs): ${anomalies}; places printing a sentence twice: before ${twice.before}, after ${twice.after}`);
      for (const [tier, o] of m) out.push(`  ${tier.padEnd(11)} moved ${o.moved} of ${o.rites}`);
      out.push(...odd.map((x) => `  ! ${x}`));
    }
    writeFileSync(process.argv[3], `${out.join('\n')}\n`);
    console.log(out.filter((x) => x.startsWith('##')).join('\n'));
  } else if (process.argv[4] === 'same') {
    const towns = readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse);
    writeFileSync(process.argv[3], `${[...sameSubject(towns, 'owner'), '', ...sameSubject(towns, 'reader')].join('\n')}\n`);
    console.log(`same-subject: towns=${towns.length} -> ${process.argv[3]}`);
  } else main();
}
