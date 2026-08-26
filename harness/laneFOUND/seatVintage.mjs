#!/usr/bin/env node
/**
 * CAR-FOUND census — ⭐⭐ **HOW OLD IS THE GROUND EACH INSTITUTION IS SEATED ON?**
 *
 * Today's seating runs ONCE, post-fold, on finished ground. This census measures the consequence:
 * for every seat, the epoch its FACE appeared in (from the fold's own annotation stamp), against
 * the fold's epoch count. It answers, with numbers rather than assertion:
 *   · do FOUNDERS (the atlas's `founds` column — the bodies the deck seats first) land on OLD
 *     ground or on LATE ground?
 *   · what share of the whole roster lands on ground minted in the final third of the fold?
 * ⛔ It checks a DISTRIBUTION, never uniformity. Variety is the point; what is measured is whether
 *    the deck's own precedence order has ANY relationship to the ground's vintage.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { seatPartition, buildQuotaDeck, deckOrder } from '../../src/domain/townMap/fabric/partitionSeating.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

/** face id → the epoch the fold stamped its appearance in, or null when nothing stamped it. */
export function faceEpochs(P) {
  const arr = P.arrangement;
  const out = new Map();
  for (const [key, a] of Object.entries(P.annotations)) {
    const dot = key.indexOf('.');
    const kind = key.slice(0, dot);
    const n = Number(key.slice(dot + 1));
    if (!Number.isFinite(n)) continue;
    if (kind === 'plot') {
      const pc = arr.pieces[n];
      if (pc && pc.face >= 0) out.set(pc.face, a.appearanceEpoch);
    } else if (kind === 'void' || kind === 'way' || kind === 'water' || kind === 'gate'
      || kind === 'wallband' || kind === 'loss') {
      out.set(n, a.appearanceEpoch);
    }
  }
  return out;
}

const spearman = (xs, ys) => {
  const n = xs.length;
  if (n < 3) return null;
  const rank = (a) => {
    const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
    const r = new Array(n);
    for (let i = 0; i < n;) {
      let j = i; while (j + 1 < n && idx[j + 1][0] === idx[i][0]) j++;
      const avg = (i + j) / 2 + 1;
      for (let k = i; k <= j; k++) r[idx[k][1]] = avg;
      i = j + 1;
    }
    return r;
  };
  const rx = rank(xs); const ry = rank(ys);
  const mx = rx.reduce((s, v) => s + v, 0) / n; const my = ry.reduce((s, v) => s + v, 0) / n;
  let num = 0; let dx = 0; let dy = 0;
  for (let i = 0; i < n; i++) { const a = rx[i] - mx; const b = ry[i] - my; num += a * b; dx += a * a; dy += b * b; }
  return dx > 0 && dy > 0 ? num / Math.sqrt(dx * dy) : null;
};

const rows = [];
for (const spec of CORPUS) {
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const page = projectPage(P, { roadWidth: input.roadWidth });
  const seated = seatPartition(P, page, settlement, {
    prosperity: (settlement.economicState && settlement.economicState.prosperity) || null,
    tier: fabric.meta.tier,
  });
  const fe = faceEpochs(P);
  const nEp = P.foldedEpochs;
  const deck = buildQuotaDeck(liveInstitutions(settlement));
  const order = deckOrder(deck.cards);
  const rank = new Map(order.map((c, i) => [c.name, i]));
  const founders = new Set(order.filter((c) => c.founds).map((c) => c.name));

  const deckIdx = []; const epochIdx = [];
  let unstamped = 0; let lateThird = 0; let founderLate = 0; let founderN = 0;
  const epHisto = new Map();
  for (const s of seated.seats) {
    const e = fe.get(s.face);
    if (e == null) { unstamped++; continue; }
    epHisto.set(e, (epHisto.get(e) || 0) + 1);
    deckIdx.push(rank.get(s.name) ?? 0);
    epochIdx.push(e);
    if (e >= Math.floor(nEp * 2 / 3)) lateThird++;
    if (founders.has(s.name)) { founderN++; if (e >= Math.floor(nEp * 2 / 3)) founderLate++; }
  }
  const rho = spearman(deckIdx, epochIdx);
  const eps = [...epHisto.keys()].sort((a, b) => a - b);
  rows.push({
    key: spec.key, seats: seated.seats.length, unstamped, nEp,
    distinctEpochs: eps.length, minEp: eps[0], maxEp: eps[eps.length - 1],
    lateThird, founderN, founderLate, rho,
    physicalViolations: seated.physicalViolations,
  });
}

console.log('leaf         seats unstamped folds  epochsUsed  minEp maxEp  seatsInLateThird  founders(inLateThird)  rho(deckOrder,groundEpoch)  physViol');
for (const r of rows) {
  console.log(`${r.key.padEnd(12)} ${String(r.seats).padStart(5)} ${String(r.unstamped).padStart(9)} `
    + `${String(r.nEp).padStart(5)} ${String(r.distinctEpochs).padStart(11)} ${String(r.minEp).padStart(6)} ${String(r.maxEp).padStart(5)}`
    + ` ${String(r.lateThird).padStart(17)}  ${String(r.founderN).padStart(8)}(${String(r.founderLate).padStart(2)})`
    + `  ${r.rho == null ? '    n/a' : r.rho.toFixed(4).padStart(26)}  ${String(r.physicalViolations).padStart(8)}`);
}
const tot = rows.reduce((a, r) => a + r.seats, 0);
const late = rows.reduce((a, r) => a + r.lateThird, 0);
const fN = rows.reduce((a, r) => a + r.founderN, 0);
const fL = rows.reduce((a, r) => a + r.founderLate, 0);
const uns = rows.reduce((a, r) => a + r.unstamped, 0);
console.log(`\nCORPUS: ${tot} seats · ${uns} on faces the fold never stamped · ${late} (${(late / tot * 100).toFixed(1)}%) on ground minted in the fold's LAST THIRD`);
console.log(`FOUNDERS: ${fN} seats · ${fL} (${fN ? (fL / fN * 100).toFixed(1) : '0.0'}%) on ground minted in the fold's LAST THIRD`);
const rhos = rows.map((r) => r.rho).filter((v) => v != null);
if (rhos.length) {
  console.log(`rho(deck order, ground epoch): min ${Math.min(...rhos).toFixed(4)} · max ${Math.max(...rhos).toFixed(4)}`
    + ` · mean ${(rhos.reduce((a, b) => a + b, 0) / rhos.length).toFixed(4)}`);
  console.log('  (0 = the deck\'s precedence order carries NO information about the age of the ground it lands on)');
}
