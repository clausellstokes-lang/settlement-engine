#!/usr/bin/env node
/**
 * harness/laneSEAT1/seatingCensus.mjs — ⭐⭐⭐ CAR-SEATING · **THE SEATING EXIT SHEET OVER THE
 * CORPUS**, and the DISTRIBUTION censuses that a synthetic fixture cannot give.
 *
 * `tests/domain/townMapPartitionSeating.test.js` proves each guard CONVICTS on a planted
 * violation. This proves the other half — that they are green on every real leaf — and it is the
 * half that needs a wall-clock budget, which is why it lives here and not in the suite
 * (`townMapPartition.test.js` states that standing order: the invariants are structural, the
 * corpus figures belong to the lane's own instruments).
 *
 * ⭐⭐ WHY A SPREAD IS THE PASS CONDITION, AND UNIFORMITY IS THE FAILURE.
 * This car exists to stop a map that looks the same everywhere. A seating pass that put every
 * institution in the same relative place in every settlement would satisfy every "is it green"
 * check perfectly and still be the defect. So the headline census here is not a zero — it is
 * **VARIETY**: how many DISTINCT standing signatures and DISTINCT family mixes the corpus's
 * distinct sites actually produce. One signature across every site means our facts do not
 * differentiate our settlements, and no amount of seeded jitter would fix that — it would only
 * hide it, which is precisely why this pass has no dice in it.
 *
 * ⚠⚠ EVERY CORPUS TOTAL TRAVELS WITH ITS DISTINCT-SITE TOTAL (`exemplars.mjs` §0.3b). The corpus
 * is 18 leaves but far fewer worlds — `mf-town-01|riverside` alone is SIX of them — so a bare
 * 18-leaf sum is *"a multiplied sample wearing a population's clothes."* `bothTotals` is used for
 * every count below, and the variety census is computed over DISTINCT SITES only, because
 * replicated leaves would otherwise inflate agreement into apparent uniformity.
 *
 * Usage: node harness/laneSEAT1/seatingCensus.mjs [--leaves=a,b,c] [--json=<path>]
 */
import { writeFileSync } from 'node:fs';
import { CORPUS, buildOne, bothTotals, siteRepresentatives } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { seatPartition, partitionSeatingReader, PHYSICAL_FAMILIES } from '../../src/domain/townMap/fabric/partitionSeating.js';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};

const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : CORPUS.map((s) => s.key);
const reps = new Set(siteRepresentatives().values());
const rows = [];
const violByLeaf = {};
const seatsByLeaf = {};
const droppedByLeaf = {};
const unatlasedByLeaf = {};
let red = 0;

for (const key of leaves) {
  const spec = CORPUS.find((s) => s.key === key);
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const page = projectPage(P, { roadWidth: input.roadWidth });
  const t0 = Date.now();
  const R = seatPartition(P, page, settlement, {
    prosperity: (settlement.economicState || {}).prosperity || null,
    tier: fabric.meta.tier,
  });
  const ms = Date.now() - t0;

  const rung = R.standing.reduce((o, r) => { o[r.standing] = (o[r.standing] || 0) + 1; return o; }, {});
  const built = R.standing.length || 1;
  const share = (g) => Math.round((1000 * (rung[g] || 0)) / built) / 10;

  // ⭐ THE HONEST BAR. A violation is a DEFECT only when the leaf actually carries the ground the
  //   body requires; where the ground is absent the counter is reporting a truth about the world
  //   (and an upstream roster question), not a misplacement. Both are printed, never merged.
  // ⚠ THE TEST IS "COULD ANY CANDIDATE HAVE SATISFIED THE PREDICATE", asked with the SHIPPED
  //   predicate object — not "does the arrangement contain a WATER face". Those are different
  //   questions: a leaf can carry water that no plot fronts, and counting WATER faces would then
  //   bill an honestly-groundless seat as a misplacement. The instrument must ask the same
  //   question the pass asks, or it is only accidentally right.
  const cands = partitionSeatingReader(P, page).candidates();
  const groundless = R.violations.filter((v) => {
    const pred = PHYSICAL_FAMILIES[v.family];
    return pred ? !cands.some((c) => pred(c)) : false;
  });
  const misplaced = R.physicalViolations - groundless.length;
  if (misplaced > 0) red++;

  violByLeaf[key] = R.physicalViolations;
  seatsByLeaf[key] = R.seats.length;
  droppedByLeaf[key] = R.deck.dropped.length;
  unatlasedByLeaf[key] = R.deck.unatlased.length;

  rows.push({
    key,
    tier: fabric.meta.tier,
    site: reps.has(key),
    prosperity: (settlement.economicState || {}).prosperity || '—',
    cards: R.deck.cards,
    seats: R.seats.length,
    dropped: R.deck.dropped.length,
    unatlased: R.deck.unatlased.length,
    families: Object.keys(R.byFamily).length,
    physicalViolations: R.physicalViolations,
    misplaced,
    groundless: groundless.length,
    built,
    wealthy: share('wealthy'),
    comfortable: share('comfortable'),
    modest: share('modest'),
    poor: share('poor'),
    // the signature the variety census counts: the standing shape plus the family mix
    standingSig: `${share('wealthy')}/${share('comfortable')}/${share('modest')}/${share('poor')}`,
    familySig: Object.keys(R.byFamily).sort().map((f) => `${f}:${R.byFamily[f]}`).join(','),
    ms,
  });
}

const w = (s, n) => String(s).padEnd(n);
const r = (s, n) => String(s).padStart(n);
console.log('leaf         tier        site pros          cards seats drop unatl fam  VIOL mis grnd   wealthy/comf/modest/poor    ms');
for (const x of rows) {
  console.log(`${w(x.key, 12)} ${w(x.tier, 11)} ${x.site ? ' * ' : '   '} ${w(x.prosperity, 13)} `
    + `${r(x.cards, 5)} ${r(x.seats, 5)} ${r(x.dropped, 4)} ${r(x.unatlased, 5)} ${r(x.families, 3)} `
    + `${r(x.physicalViolations, 5)} ${r(x.misplaced, 3)} ${r(x.groundless, 4)}   `
    + `${r(x.wealthy, 5)}/${r(x.comfortable, 5)}/${r(x.modest, 6)}/${r(x.poor, 5)} ${r(x.ms, 5)}`);
}

// ── THE TOTALS, EACH WITH ITS DISTINCT-SITE DENOMINATOR ──────────────────────
console.log('\n── TOTALS (§0.3b: a corpus total never travels alone) ──');
for (const [name, by] of [['physicalViolations', violByLeaf], ['seats', seatsByLeaf],
  ['dropped (nonBuilding/off-map)', droppedByLeaf], ['unatlased', unatlasedByLeaf]]) {
  console.log(`  ${w(name, 32)} ${bothTotals(by).text}`);
}

// ── THE VARIETY CENSUS — THE ONE THAT MATTERS ───────────────────────────────
const siteRows = rows.filter((x) => x.site);
const standingSigs = new Set(siteRows.map((x) => x.standingSig));
const familySigs = new Set(siteRows.map((x) => x.familySig));
console.log('\n── VARIETY over DISTINCT SITES (uniformity is the failure this car exists to prevent) ──');
console.log(`  distinct sites measured        ${siteRows.length}`);
console.log(`  distinct STANDING signatures   ${standingSigs.size}`);
console.log(`  distinct FAMILY mixes          ${familySigs.size}`);
const poorSpread = siteRows.map((x) => x.poor);
console.log(`  poor-share range               ${Math.min(...poorSpread)}% … ${Math.max(...poorSpread)}%`);
const famSpread = siteRows.map((x) => x.families);
console.log(`  families-seated range          ${Math.min(...famSpread)} … ${Math.max(...famSpread)}`);

const uniform = standingSigs.size <= 1 || familySigs.size <= 1;
console.log('\n── VERDICT ──');
console.log(`  misplaced physical seats (ground PRESENT, body elsewhere) : ${red === 0 ? '0 — GREEN' : `${red} LEAVES — RED`}`);
const totalGroundless = rows.reduce((a, x) => a + x.groundless, 0);
console.log(`  groundless physical seats (ground ABSENT, honestly flagged): ${totalGroundless}`
  + (totalGroundless ? ` — ${rows.filter((x) => x.groundless).map((x) => x.key).join(',')} (upstream roster question, not a placement defect)` : ''));
console.log(`  uniformity                                                : ${uniform ? 'RED — the corpus is FLAT' : 'GREEN — the facts differentiate the settlements'}`);

const json = arg('json', '');
if (json) {
  writeFileSync(json, JSON.stringify({
    rows,
    totals: {
      physicalViolations: bothTotals(violByLeaf),
      seats: bothTotals(seatsByLeaf),
      dropped: bothTotals(droppedByLeaf),
      unatlased: bothTotals(unatlasedByLeaf),
    },
    variety: { sites: siteRows.length, standingSigs: standingSigs.size, familySigs: familySigs.size },
    verdict: { misplaced: red, groundless: totalGroundless, uniform },
  }, null, 2));
  console.log(`\njson -> ${json}`);
}

process.exit(red === 0 && !uniform ? 0 : 1);
