/**
 * harness/laneBRIDGE/deckCensus.mjs — ⭐⭐ THE THREE DECK CENSUSES AND THEIR PLANTED CONTROLS.
 *
 * REG-BRIDGE's exits, measured on one pass over the corpus:
 *   ENDPOINT CLEARANCE  every deck's two ends stand on DRY LAND. REG-5 found two decks that
 *                       touched neither bank (clearance −6.94/−4.07 and −4.09/−8.10) — planks
 *                       floating in mid-channel because the deck was drawn a fixed ~1.7× the
 *                       NOMINAL width whatever crossing it faced.
 *   ANGLE (L-REG-31)    every deck within ±15° of the normal of the river's local tangent.
 *                       ⚠ DECLARED: the cure now aims on the same geometric object this census
 *                       reads (see waterWorks' `shortestCrossingAt`), so a green here is no
 *                       longer independent evidence. The CONTROLS below are what carry it, and
 *                       the endpoint and narrows arms measure different things entirely.
 *   NARROWS (L-REG-32)  `excess` — the water actually crossed ÷ the shortest crossing available
 *                       at the deck's own station (REG-5's discriminating predicate: conforming
 *                       ≤ 1.086, every defect ≥ 1.302) — and `pinch`, the siting ratio the angle
 *                       cannot see: the deck's own crossing ÷ the narrowest crossing anywhere in
 *                       its road corridor. `pinch = 1.000` is a deck standing AT the narrows.
 *
 * ⛔ IT REUSES `harness/laneREG5/bridgeAngles.mjs`'s instrument (`shortestCrossing`) rather than
 * re-deriving one. That instrument was built independently of the sub-lane's, chased to a
 * digit-for-digit agreement, and carries the banked radial-step law in its own source. A second
 * spelling here would be a third instrument nobody has reconciled.
 *
 * Usage: node harness/laneBRIDGE/deckCensus.mjs [--controls] [--arm=river,deck]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { shortestCrossing, crossingOnBearing, BAND_DEG } = await import(join(ROOT, 'harness/laneREG5/bridgeAngles.mjs'));
const { isInWater, widthAt } = await import(join(ROOT, 'src/domain/townMap/fabric/waterMode.js'));
const { TRIG_N, cosI, sinI } = await import(join(ROOT, 'src/domain/townMap/fabric/trigTable.js'));

const DEG = (idx) => (idx * 360) / TRIG_N;
const norm180 = (d) => ((d % 180) + 180) % 180;
const axisSep = (a, b) => { const d = Math.abs(norm180(a) - norm180(b)); return Math.min(d, 180 - d); };

/** REG-5's conforming band on `excess`, measured on the shipped corpus and handed over. */
export const EXCESS_BAND = 1.086;
/** a deck standing at its corridor's narrows; the slack is one coarse sweep step's worth. */
export const PINCH_BAND = 1.05;

/** the deck's two ends, exactly as `renderFolio.mjs` draws them */
function deckEnds(br) {
  const dx = cosI(br.along), dy = sinI(br.along);
  const half = br.reach != null ? br.reach : Math.max(br.span * 0.85, br.width * 0.9);
  return [[br.x - dx * half, br.y - dy * half], [br.x + dx * half, br.y + dy * half], half];
}

/**
 * Signed clearance at one deck end: how far the end stands from the water's edge, POSITIVE on
 * dry land. Walks in from the end toward the deck's middle until it goes wet (or does not).
 */
function clearance(rel, end, towardX, towardY, cap) {
  const wet0 = isInWater(rel, end[0], end[1]);
  const step = Math.max(0.05, (widthAt(rel, end[0], end[1]) || rel.width) / 60);
  let d = 0;
  while (d < cap) {
    d += step;
    const x = end[0] + towardX * d, y = end[1] + towardY * d;
    if (isInWater(rel, x, y) !== wet0) break;
  }
  return wet0 ? -d : d;
}

export function census(opts, mutate = null) {
  const rows = [];
  for (const spec of CORPUS) {
    const built = buildOne(spec, opts);
    const f = built.fabric;
    const rel = f.water;
    if (!rel || !rel.line || !f.bridges || !f.bridges.length) continue;
    // the corridor this leaf's decks may be sited in — the same spelling buildFabric uses
    const dims = [];
    for (const q of (f.blocks || [])) {
      const p = q.polygon; if (!p || p.length < 3) continue;
      let a = 0;
      for (let i = 0; i < p.length; i++) { const u = p[i], v = p[(i + 1) % p.length]; a += u[0] * v[1] - v[0] * u[1]; }
      dims.push(Math.sqrt(Math.abs(a) / 2));
    }
    dims.sort((x, y) => x - y);
    const C = dims.length ? dims[Math.floor(dims.length / 2)] * 3 : 0;
    // the narrowest crossing anywhere in the corridor — the thing L-REG-32 says a deck sits at
    const sArr = rel.widthProfile ? rel.widthProfile.s : null;

    for (const raw of f.bridges) {
      const br = mutate ? mutate({ ...raw }) : raw;
      const [endA, endB, half] = deckEnds(br);
      const dx = cosI(br.along), dy = sinI(br.along);
      const cap = half * 1.2;
      const cA = clearance(rel, endA, dx, dy, cap);
      const cB = clearance(rel, endB, -dx, -dy, cap);
      const short = shortestCrossing(rel, br.x, br.y);
      // ⛔ THE SAME WET SET AS `shortestCrossing`, or the ratio between them is the two
      //    predicates' own quotient rather than anything about the drawing (see its header).
      const alongDeck = crossingOnBearing(rel, br.x, br.y, DEG(br.along));
      // the corridor's own narrows
      let narrows = Infinity, atStation = 0;
      if (short) {
        let at = 0, ad = Infinity;
        for (let i = 0; i < rel.line.length; i++) {
          const d = (rel.line[i][0] - br.x) ** 2 + (rel.line[i][1] - br.y) ** 2;
          if (d < ad) { ad = d; at = i; }
        }
        atStation = at;
        for (let j = 0; j < rel.line.length; j += 2) {
          const within = sArr ? Math.abs(sArr[j] - sArr[at]) <= C
            : Math.hypot(rel.line[j][0] - rel.line[at][0], rel.line[j][1] - rel.line[at][1]) <= C;
          if (!within) continue;
          const s = shortestCrossing(rel, rel.line[j][0], rel.line[j][1], 2);
          if (s && s.len < narrows) narrows = s.len;
        }
      }
      rows.push({
        leaf: spec.key, key: br.key, rank: br.rank, sited: !!br.sited,
        deckDeg: +DEG(br.along).toFixed(1),
        normalDeg: short ? +short.deg.toFixed(1) : null,
        dev: short ? +axisSep(DEG(br.along), short.deg).toFixed(1) : null,
        inBand: short ? axisSep(DEG(br.along), short.deg) <= BAND_DEG : false,
        clearA: +cA.toFixed(2), clearB: +cB.toFixed(2), dry: cA > 0 && cB > 0,
        shortest: short ? +short.len.toFixed(2) : null,
        crossed: alongDeck != null ? +alongDeck.toFixed(2) : null,
        excess: short && alongDeck != null ? +(alongDeck / short.len).toFixed(3) : null,
        narrows: Number.isFinite(narrows) ? +narrows.toFixed(2) : null,
        // pinch against the corridor's ABSOLUTE narrows — reported, and lawfully > 1 wherever the
        // narrower reach is one the road cannot reach (§637.1's second clause).
        pinch: short && Number.isFinite(narrows) ? +(short.len / narrows).toFixed(3) : null,
        // ⭐ THE EXIT PREDICATE: the deck stands at the narrowest crossing its ROAD CAN REACH.
        //   Taken from the deriver's own published pair, which is what makes it a check of the
        //   cure's optimality rather than a re-derivation of the cure.
        pinchAdm: br.narrowsAdmissible ? +(br.crossed / br.narrowsAdmissible).toFixed(3) : null,
        deckLen: +(half * 2).toFixed(2), station: atStation,
      });
    }
  }
  return rows;
}

function report(rows, label) {
  const n = rows.length;
  const dry = rows.filter((r) => r.dry).length;
  const band = rows.filter((r) => r.inBand).length;
  const exc = rows.filter((r) => r.excess != null && r.excess <= EXCESS_BAND).length;
  const pin = rows.filter((r) => r.pinch != null && r.pinch <= PINCH_BAND).length;
  const adm = rows.filter((r) => r.pinchAdm != null && r.pinchAdm <= 1.001).length;
  const sited = rows.filter((r) => r.sited).length;
  process.stdout.write(`\n── ${label}: ${n} decks\n`);
  process.stdout.write(`   leaf         key                                   sited  deck  normal   dev  clearA clearB shortest crossed excess narrows pinch\n`);
  for (const r of rows.slice().sort((a, b) => (b.dev ?? 0) - (a.dev ?? 0))) {
    process.stdout.write(`   ${r.leaf.padEnd(12)} ${String(r.key).slice(0, 36).padEnd(36)} `
      + `${(r.sited ? ' yes ' : ' NO  ')} ${String(r.deckDeg).padStart(5)} ${String(r.normalDeg ?? '—').padStart(7)} `
      + `${String(r.dev ?? '—').padStart(5)}${r.inBand ? ' ' : '⛔'} ${String(r.clearA).padStart(6)}${r.clearA > 0 ? '' : '⛔'}`
      + `${String(r.clearB).padStart(6)}${r.clearB > 0 ? '' : '⛔'} ${String(r.shortest ?? '—').padStart(8)} ${String(r.crossed ?? '—').padStart(7)} `
      + `${String(r.excess ?? '—').padStart(6)} ${String(r.narrows ?? '—').padStart(7)} ${String(r.pinch ?? '—').padStart(5)}\n`);
  }
  process.stdout.write(`   ENDPOINT CLEARANCE  ${dry} of ${n} decks DRY BOTH ENDS${dry === n ? '  ✔ EXIT MET' : '  ⛔'}\n`);
  process.stdout.write(`   L-REG-31 ANGLE      ${band} of ${n} inside ±${BAND_DEG}°${band === n ? '  ✔ EXIT MET' : '  ⛔'}\n`);
  process.stdout.write(`   L-REG-32 EXCESS     ${exc} of ${n} at or under ${EXCESS_BAND}${exc === n ? '  ✔ EXIT MET' : '  ⛔'}\n`);
  process.stdout.write(`   L-REG-32 SITING     ${adm} of ${sited} sited decks stand at their ADMISSIBLE narrows (pinchAdm ≤ 1.001)`
    + `${adm === sited && sited === n ? '  ✔ EXIT MET' : '  ⛔'}\n`);
  process.stdout.write(`   ⚠ context: ${pin} of ${n} also stand at the corridor's ABSOLUTE narrows. The gap is §637.1's`
    + ` second clause working — a narrower reach the approach road cannot reach is not a site.\n`);
  return { n, dry, band, exc, pin, adm, sited };
}

const ARM = { riverProfile: true, deckLaw: true };
const armed = census(ARM);
const A = report(armed, 'REG-BRIDGE · DECK CENSUS · ARMED (--river --deck)');

if (process.argv.includes('--base')) report(census({}), 'THE SEAL, FOR CONTRAST (unarmed)');

if (process.argv.includes('--controls')) {
  process.stdout.write('\n── CONTROLS — a census nobody has seen move is not a census\n');

  // C1a · ⭐⭐ THE HISTORICAL CONTROL, AND IT IS THE STRONGEST ONE AVAILABLE: run this census on
  //   the UNARMED corpus — the shipped drawing — and it must convict exactly the decks REG-5
  //   convicted by hand (`highwater/wallLane…|3` at −6.94/−4.07 and `crossing/street.high|55` at
  //   −4.09/−8.10). An instrument that agrees with an independent hand measurement of a REAL
  //   defect is worth more than any plant.
  // ⛔ THE FIRST PLANT HERE WAS DEAD AND THE DEAD READING WAS INSTRUCTIVE: re-imposing the
  //   pre-cure deck LENGTH on the cured SITING reds nothing, because a deck sited at a narrows
  //   is short enough that even the old fixed 1.7×-nominal formula spans it. The floating decks
  //   were never a length defect alone — they were a length defect ON AN OBLIQUE, MIS-SITED
  //   CROSSING, and only the pre-cure geometry reproduces them.
  const c1 = census({});
  const c1red = c1.filter((r) => !r.dry);
  process.stdout.write(`   C1a · THE UNARMED (SHIPPED) CORPUS: ${c1red.length} of ${c1.length} decks stand in the water\n`);
  for (const r of c1red) {
    process.stdout.write(`         ${r.leaf}/${String(r.key).split('|').slice(1).join('|')}  endA ${r.clearA}  endB ${r.clearB}\n`);
  }
  process.stdout.write(`        → ${c1red.length > 0 ? 'LIVE — the endpoint census convicts the defect REG-5 measured by hand'
    : '⛔ DEAD — the census cannot see the floating decks that are known to be there'}\n`);

  // C1b · and a SYNTHETIC plant, so the arm is proved on the armed corpus too: cut every deck to
  //   40 % of the water it has to cross, which cannot possibly reach either bank.
  const c1s = census(ARM, (b) => ({ ...b, reach: (b.crossed || b.span) * 0.4 }));
  const c1sred = c1s.filter((r) => !r.dry).length;
  process.stdout.write(`   C1b · EVERY DECK CUT TO 40 % OF ITS OWN CROSSING: ${c1sred} of ${c1s.length} now stand in the water\n`);
  process.stdout.write(`        → ${c1sred === c1s.length ? 'LIVE — the arm reds every deck too short to span'
    : '⛔ DEAD — a deck cut to 40 % of its crossing still reads as dry'}\n`);

  // C2 · a PLANTED SKEW: 30°, twice the band. Every conforming deck must red.
  //      ⚠ THE PREDICATE IS "EVERY CONFORMING DECK REDS", never "every deck reds" — deviation is
  //      measured between UNDIRECTED axes, so a 90° turn SQUARES anything already ~90° out.
  const skew = Math.round(TRIG_N / 12);
  const c2 = census(ARM, (b) => ({ ...b, along: (b.along + skew) % TRIG_N }));
  const wasIn = armed.filter((r) => r.inBand);
  const c2red = wasIn.filter((r) => {
    const m = c2.find((x) => x.leaf === r.leaf && x.key === r.key);
    return m && !m.inBand;
  }).length;
  process.stdout.write(`   C2 · A 30° SKEW planted on every deck: ${c2red} of ${wasIn.length} conforming decks now RED\n`);
  process.stdout.write(`        → ${c2red === wasIn.length ? 'LIVE — the band catches a skew twice its own width'
    : `⛔ ${wasIn.length - c2red} conforming decks absorbed a 30° skew`}\n`);

  // C3 · a PLANTED MIS-SITING: move every deck a third of a corridor along the river. The pinch
  //      arm must red — this is the arm the angle census structurally cannot see.
  const c3 = census(ARM, (b) => {
    const off = 40;
    const tx = cosI((b.tangent ?? b.across) || 0), ty = sinI((b.tangent ?? b.across) || 0);
    return { ...b, x: b.x + tx * off, y: b.y + ty * off };
  });
  const wasPin = armed.filter((r) => r.pinch != null);
  const c3red = wasPin.filter((r) => {
    const m = c3.find((x) => x.leaf === r.leaf && x.key === r.key);
    return m && (m.pinch == null || m.pinch > r.pinch + 0.02);
  }).length;
  process.stdout.write(`   C3 · EVERY DECK SLID 40 UNITS ALONG THE CHANNEL: ${c3red} of ${wasPin.length} sited decks now RED on pinch\n`);
  process.stdout.write(`        → ${c3red > 0 ? 'LIVE — the narrows census can see a deck that is not at its narrows'
    : '⛔ DEAD — the pinch ratio cannot see a mis-sited deck'}\n`);

  // C4 · the NEGATIVE control: an unmutated re-run must reproduce itself exactly.
  const c4 = census(ARM);
  const drift = c4.filter((r, i) => JSON.stringify(r) !== JSON.stringify(armed[i])).length;
  process.stdout.write(`   C4 · NEGATIVE (unmutated re-run): ${drift} of ${armed.length} rows differ\n`);
  process.stdout.write(`        → ${drift === 0 ? 'LIVE — deterministic, and it does not red a clean deck' : '⛔ not deterministic'}\n`);
}

process.stdout.write(`\n   VERDICT: sited ${A.sited}/${A.n} · dry ${A.dry}/${A.n} · band ${A.band}/${A.n}`
  + ` · excess ${A.exc}/${A.n} · at-admissible-narrows ${A.adm}/${A.sited}\n`);
