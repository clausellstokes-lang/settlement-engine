// Lane probe (never committed): the INTERESTED-FACT figures per tier on the RATE corpus.
import { readFileSync, writeFileSync } from 'node:fs';
import { rateGrid } from '../laneSEAM/scripts/prose-rate-corpus.mjs';
import { generateSettlementPipeline } from '../laneSEAM/src/generators/generateSettlementPipeline.js';
import { compromisedSecurityInstitutions } from '../laneSEAM/src/domain/corruption.js';
import { HOLDER_KINDS, holdersOf, standingOf } from '../laneSEAM/src/domain/prose/holderTable.js';

const census = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const licensed = census.rows.filter((r) => r.source && r.source.standing === 'LICENSED');
const t0 = Date.now();
/** @type {Map<string, {towns:number, pairs:number, held:number, interested:number, kindsHeld:Map<string,number>, kindsInterested:Map<string,number>}>} */
const byTier = new Map();
const kindTownsHeld = new Map();
const kindTownsInterested = new Map();
const captureStates = new Map();
let genThrows = 0;
let townsWithAnyInterest = 0;
const absentSeen = new Set();
for (const spec of rateGrid()) {
  let settlement;
  try { settlement = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} }); } catch { genThrows += 1; continue; }
  const s = settlement;
  const tier = String(spec.config.settType);
  if (!byTier.has(tier)) byTier.set(tier, { towns: 0, pairs: 0, held: 0, interested: 0, kindsHeld: new Map(), kindsInterested: new Map() });
  const cell = byTier.get(tier);
  cell.towns += 1;
  const capture = String(s?.powerStructure?.criminalCaptureState ?? '(absent)');
  captureStates.set(capture, (captureStates.get(capture) || 0) + 1);
  const compromised = compromisedSecurityInstitutions(s);
  /** @type {Map<string, {holders: string[], interested: boolean}>} */
  const perKind = new Map();
  for (const kind of HOLDER_KINDS) {
    const holders = holdersOf(kind, s);
    let interested = false;
    for (const holder of holders) {
      const standing = standingOf(holder, s, { compromised }, kind);
      for (const gap of standing.absent) absentSeen.add(gap);
      if (standing.interested) interested = true;
    }
    perKind.set(kind, { holders, interested });
    if (holders.length) {
      kindTownsHeld.set(kind, (kindTownsHeld.get(kind) || 0) + 1);
      cell.kindsHeld.set(kind, (cell.kindsHeld.get(kind) || 0) + 1);
    }
    if (interested) {
      kindTownsInterested.set(kind, (kindTownsInterested.get(kind) || 0) + 1);
      cell.kindsInterested.set(kind, (cell.kindsInterested.get(kind) || 0) + 1);
    }
  }
  let any = false;
  for (const row of licensed) {
    cell.pairs += 1;
    const kinds = row.source.kinds;
    const held = kinds.some((k) => perKind.get(k).holders.length > 0);
    const interested = kinds.some((k) => perKind.get(k).interested);
    if (held) cell.held += 1;
    if (interested) { cell.interested += 1; any = true; }
  }
  if (any) townsWithAnyInterest += 1;
}
const lines = [];
lines.push(`RATE corpus · ${[...byTier.values()].reduce((a, c) => a + c.towns, 0)} towns · genThrows ${genThrows} · ${Math.round((Date.now() - t0) / 1000)} s`);
lines.push(`LICENSED census rows walked per town: ${licensed.length}`);
lines.push(`towns with at least one interested fact: ${townsWithAnyInterest}`);
lines.push(`settlement-wide criminalCaptureState: ${[...captureStates].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ')}`);
lines.push(`standing facts ABSENT on every RATE town: ${[...absentSeen].join(' | ')}`);
lines.push('tier        towns   (row,town) pairs   holder named   INTERESTED   interested bp');
for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const c = byTier.get(tier);
  if (!c) continue;
  const bp = c.pairs ? Math.round((c.interested / c.pairs) * 10000) : 0;
  lines.push(`${tier.padEnd(11)} ${String(c.towns).padStart(5)}   ${String(c.pairs).padStart(15)}   ${String(c.held).padStart(12)}   ${String(c.interested).padStart(10)}   ${String(bp).padStart(13)}`);
}
lines.push('per KIND, towns whose roster names a holder / towns where that holder is INTERESTED:');
for (const kind of HOLDER_KINDS) {
  lines.push(`  ${kind.padEnd(10)} held ${String(kindTownsHeld.get(kind) || 0).padStart(4)}  interested ${String(kindTownsInterested.get(kind) || 0).padStart(4)}`);
}
for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const c = byTier.get(tier);
  if (!c) continue;
  lines.push(`  ${tier.padEnd(11)} kinds held: ${[...c.kindsHeld].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ') || '(none)'}`);
}
const out = lines.join('\n');
console.log(out);
writeFileSync(process.argv[3], `${out}\n`);
