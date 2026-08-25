/**
 * harness/laneREG5/bridgeAngles.mjs — ⭐⭐ L-REG-31's ANGLE CENSUS + the PLANTED SKEWED-DECK
 * CONTROL the charter names (ODQ §635.5, program doc A8).
 *
 * THE LAW: a bridge deck aligns to the normal of the river's LOCAL TANGENT within ±15°; the
 * approach road kinks at the bridgehead — the deck is never skewed to save the road a bend;
 * fords are exempt.
 *
 * ⭐⭐ THE TANGENT IS DERIVED WITHOUT A WINDOW, and that is the instrument's whole correctness
 * (J-REG5-BR-2). The river polyline is DENSE — 290 vertices over 1,508 units, mean spacing 5.22 =
 * 0.31× the river's own width — so one segment is a sub-width detail, and a windowed chord
 * over-smooths at a bend. MEASURED: on `town/street.high` a ±1-width chord reports **25.7°** while
 * the deck is in fact taking a **1.018× shortest crossing**, i.e. square. The window family swings
 * the census from 15/19 to 8/19 **with no change in the drawing** — a band pinned to a windowed
 * tangent pins the window, not the law.
 *
 * So: the TRUE NORMAL is the direction of the SHORTEST WET CROSSING through the bridge point,
 * scanned over 180° at 0.25° against the drawn wet set. Its perpendicular IS the local tangent,
 * defined by the geometry rather than by a window anybody chose.
 *
 * ⭐ `excess = deckSpan / shortestCrossing` is reported beside the angle (J-REG5-BR-3): scale-free,
 * needs no band negotiation, and it separates cleanly where the angle alone does not — conforming
 * decks run 1.004–1.086, every defect ≥ 1.302.
 *
 * Usage: node harness/laneREG5/bridgeAngles.mjs [--controls]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { TRIG_N } = await import(join(ROOT, 'src/domain/townMap/fabric/trigTable.js'));

export const BAND_DEG = 15;
const DEG = (idx) => (idx * 360) / TRIG_N;
const norm180 = (d) => { let x = ((d % 180) + 180) % 180; return x; };
/** the acute separation of two undirected axes, 0..90 */
const axisSep = (a, b) => { const d = Math.abs(norm180(a) - norm180(b)); return Math.min(d, 180 - d); };

/**
 * The drawn wet set: within half the drawn width of the centreline — exactly what
 * `renderFolio.mjs` strokes. ⚠ BUCKETED, and the bucketing is not an optimization detail: the
 * river polyline is 290 segments and the crossing scan asks this question ~300,000 times per
 * bridge. The naive form made a 19-bridge census take longer than the whole test suite.
 */
function wetProbe(rel) {
  /**
   * ⭐⭐ REG-BRIDGE · THE PROBE READS THE **PROFILE** WHERE THERE IS ONE. This function's own
   * header declares the wet set to be *"exactly what `renderFolio.mjs` strokes"* — so the moment
   * the drawing tapers and this does not, every `shortestCrossing`, every deviation and every
   * `excess` in the census is measured against a channel that is not on the page. ⛔ The bucket
   * grid must be sized and grown from the **MAX** local half or its exactness fails silently at
   * the wide reaches; the per-segment half is the mean of the segment's two ends, which is the
   * same spelling `claimSegments` uses so the instrument and the ground law agree.
   */
  const prof = rel.widthProfile && rel.widthProfile.w.length === rel.line.length ? rel.widthProfile : null;
  const maxW = prof ? prof.max : rel.width;
  const halfOf = (i) => (prof ? (prof.w[i] + prof.w[i + 1]) / 4 : rel.width / 2);
  const CELL = Math.max(8, maxW * 2);
  /** @type {Map<string, number[]>} */ const grid = new Map();
  const put = (gx, gy, i) => { const k = `${gx}|${gy}`; const b = grid.get(k); if (b) b.push(i); else grid.set(k, [i]); };
  for (let i = 0; i + 1 < rel.line.length; i++) {
    const [ax, ay] = rel.line[i], [bx, by] = rel.line[i + 1];
    const x0 = Math.min(ax, bx) - maxW, x1 = Math.max(ax, bx) + maxW;
    const y0 = Math.min(ay, by) - maxW, y1 = Math.max(ay, by) + maxW;
    for (let gx = Math.floor(x0 / CELL); gx <= Math.floor(x1 / CELL); gx++) {
      for (let gy = Math.floor(y0 / CELL); gy <= Math.floor(y1 / CELL); gy++) put(gx, gy, i);
    }
  }
  return (x, y) => {
    const b = grid.get(`${Math.floor(x / CELL)}|${Math.floor(y / CELL)}`);
    if (!b) return false;
    for (const i of b) {
      const [ax, ay] = rel.line[i], [bx, by] = rel.line[i + 1];
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
      const t = L2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L2)) : 0;
      const ex = x - (ax + dx * t), ey = y - (ay + dy * t);
      const h = halfOf(i);
      if (ex * ex + ey * ey <= h * h) return true;
    }
    return false;
  };
}

/**
 * ⭐ THE SHORTEST WET CROSSING through (x,y): scan every bearing, walk out both ways until dry,
 * and keep the narrowest. Returns {len, deg} or null where the point is not in the water.
 */
export function shortestCrossing(rel, x, y, stepDeg = 0.25) {
  const wet = rel.__wet || (rel.__wet = wetProbe(rel));
  if (!wet(x, y)) return null;
  // ⛔ THE RADIAL STEP TAKES THE **MIN** OF THE PROFILE. The docstring below records that this
  //    step sets the instrument's ANGULAR resolution; a step scaled by a nominal width is too
  //    coarse at the narrows, which is precisely where the siting law now puts the bridges.
  const minW = rel.widthProfile ? rel.widthProfile.min : rel.width;
  const reach = (rel.widthProfile ? rel.widthProfile.max : rel.width) * 12;
  const step = Math.max(0.05, minW / 60);
  /**
   * ⛔⛔ THE RADIAL STEP, NOT THE ANGULAR STEP, SETS THIS INSTRUMENT'S ANGULAR RESOLUTION — and
   * getting that wrong INVERTED the census. Crossing length across a channel goes as
   * `w / cos(θ)`, so a length quantized to ±`step` cannot distinguish any bearing inside
   * `arccos(w / (w + step))`. At `step = w/60` that blur is **10.4°**, comparable to the ±15°
   * band itself: the reported minimum then lands anywhere in a ten-degree basin and the verdict
   * is the quantizer's, not the drawing's. MEASURED: the coarse form reported 15 of 19 OUTSIDE
   * the band where a finer instrument reported 15 of 19 INSIDE — a full inversion, from a
   * parameter that looks like a performance knob.
   * ⭐ THE CURE IS BISECTION, not a smaller step: walk out at `step`, then bisect the last
   * wet→dry interval to 1e-4 units. The blur falls below 0.2° and costs ~14 extra probes a ray.
   * ⭐ THE CLASS: **when an estimator reads an angle off a LENGTH minimum, its angular precision
   * is set by the length precision, and the two are related by the curvature of the basin.**
   */
  const edge = (ux, uy) => {
    let lo = 0, hi = step;
    while (hi < reach && wet(x + ux * hi, y + uy * hi)) { lo = hi; hi += step; }
    if (hi >= reach) return null;
    for (let i = 0; i < 40 && hi - lo > 1e-4; i++) {
      const mid = (lo + hi) / 2;
      if (wet(x + ux * mid, y + uy * mid)) lo = mid; else hi = mid;
    }
    return lo;
  };
  const scan = (a) => {
    const r = (a * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r);
    const f = edge(ux, uy); if (f == null) return null;
    const b = edge(-ux, -uy); if (b == null) return null;
    return f + b;                                     // running down the channel returns null above
  };
  // ⭐ COARSE THEN FINE, and the fine pass is the one the band is read from. A flat 0.25° sweep
  //   is 720 full walks per bridge and made the census slower than the whole test suite; a 2°
  //   sweep followed by a ±2° refinement at `stepDeg` visits 90 + 33 and lands on the same
  //   minimum, because the crossing length is unimodal in bearing across a channel.
  let best = null;
  for (let a = 0; a < 180; a += 2) { const len = scan(a); if (len != null && (!best || len < best.len)) best = { len, deg: a }; }
  if (!best) return null;
  for (let a = best.deg - 2; a <= best.deg + 2; a += stepDeg) {
    const aa = ((a % 180) + 180) % 180;
    const len = scan(aa);
    if (len != null && len < best.len) best = { len, deg: aa };
  }
  return best;
}

/**
 * ⭐⭐ THE CROSSING ALONG ONE GIVEN BEARING, off the SAME wet set `shortestCrossing` scans.
 *
 * ⛔⛔ IT IS EXPORTED BECAUSE A SECOND SPELLING OF "THE WATER" PRODUCED A PHANTOM DEFECT, and the
 * number was plausible enough to have been believed. REG-BRIDGE's deck census first measured
 * "the water actually crossed" with `isInWater` — the LAW's predicate, `d < 0.62 w` — against a
 * shortest crossing measured on the DRAWN set, `d <= 0.5 w`, and every deck in the corpus scored
 * `excess = 1.22`, uniformly, including decks whose deviation from the normal was 0.0°. The
 * ratio was not a defect: it is 0.62 / 0.5 = 1.24, the two predicates' own quotient.
 * ⭐ THE CLASS: **a ratio between two measurements taken against two different definitions of
 * the same object is a constant wearing a finding's clothes** — and it convicts uniformly, which
 * is exactly what a real corpus-wide defect looks like.
 */
export function crossingOnBearing(rel, x, y, deg) {
  const wet = rel.__wet || (rel.__wet = wetProbe(rel));
  if (!wet(x, y)) return null;
  const minW = rel.widthProfile ? rel.widthProfile.min : rel.width;
  const reach = (rel.widthProfile ? rel.widthProfile.max : rel.width) * 12;
  const step = Math.max(0.05, minW / 60);
  const r = (deg * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r);
  const edge = (sx, sy) => {
    let lo = 0, hi = step;
    while (hi < reach && wet(x + sx * hi, y + sy * hi)) { lo = hi; hi += step; }
    if (hi >= reach) return null;
    for (let i = 0; i < 40 && hi - lo > 1e-4; i++) {
      const m = (lo + hi) / 2;
      if (wet(x + sx * m, y + sy * m)) lo = m; else hi = m;
    }
    return lo;
  };
  const f = edge(ux, uy); if (f == null) return null;
  const b = edge(-ux, -uy); if (b == null) return null;
  return f + b;
}

export function census(fabricOptions = {}, mutate = null) {
  const rows = [];
  for (const spec of CORPUS) {
    const built = buildOne(spec, fabricOptions);
    const f = built.fabric;
    const rel = f.water;
    if (!rel || !rel.line || !f.bridges || !f.bridges.length) continue;
    for (const br of f.bridges) {
      const b = mutate ? mutate({ ...br }) : br;
      const deckDeg = DEG(b.along);
      const cross = shortestCrossing(rel, b.x, b.y);
      if (!cross) { rows.push({ leaf: spec.key, key: b.key, deckDeg, dev: null, note: 'bridge point not in the drawn water' }); continue; }
      const dev = axisSep(deckDeg, cross.deg);
      const half = Math.max((b.span || rel.width) * 0.85, (b.width || rel.width) * 0.9);
      rows.push({
        leaf: spec.key, key: b.key, rank: b.rank, deckDeg: +deckDeg.toFixed(1),
        trueNormalDeg: +cross.deg.toFixed(1), dev: +dev.toFixed(1),
        shortest: +cross.len.toFixed(2), deckSpan: +(half * 2).toFixed(2),
        excess: +((half * 2) / cross.len).toFixed(3),
        inBand: dev <= BAND_DEG,
      });
    }
  }
  return rows;
}

function report(rows, label) {
  const usable = rows.filter((r) => r.dev != null);
  const inB = usable.filter((r) => r.inBand).length;
  process.stdout.write(`\n── ${label}: ${usable.length} bridges · IN BAND ±${BAND_DEG}° ${inB} · OUTSIDE ${usable.length - inB}\n`);
  process.stdout.write(`   leaf         key                                    deck   normal    dev   shortest  deckSpan  excess\n`);
  for (const r of usable.slice().sort((a, b) => b.dev - a.dev)) {
    process.stdout.write(`   ${r.leaf.padEnd(12)} ${String(r.key).slice(0, 38).padEnd(38)} ${String(r.deckDeg).padStart(6)} ${String(r.trueNormalDeg).padStart(8)} ${String(r.dev).padStart(6)}${r.inBand ? ' ' : '⛔'} ${String(r.shortest).padStart(8)} ${String(r.deckSpan).padStart(9)} ${String(r.excess).padStart(7)}\n`);
  }
  return { usable: usable.length, inBand: inB, out: usable.length - inB };
}

const base = census({});
const B = report(base, 'L-REG-31 · ANGLE CENSUS (unarmed; armed is byte-identical on bridge records)');
process.stdout.write(`   VERDICT: ${B.out === 0 ? 'EVERY DECK IN BAND' : `${B.out} of ${B.usable} OUTSIDE ±${BAND_DEG}°`}\n`);

/* ── ⛔⛔ THE PLANTED SKEWED-DECK CONTROL — the charter names it, and without it the census
 *    above is a number nobody has ever seen move. The plant is applied to the BRIDGE RECORD in
 *    memory (an input control: nothing on disk is mutated, no sibling lane can read a broken
 *    file), and it must RED every deck it touches.
 */
if (process.argv.includes('--controls')) {
  process.stdout.write('\n── CONTROLS\n');
  const quarter = Math.round(TRIG_N / 4);        // 90°
  const skew30 = Math.round(TRIG_N / 12);        // 30°, twice the band
  const skewAll = census({}, (b) => ({ ...b, along: (b.along + quarter) % TRIG_N }));
  const s1 = skewAll.filter((r) => r.dev != null);
  /**
   * ⚠ THE PREDICATE IS "EVERY CONFORMING DECK REDS", NOT "EVERY DECK REDS", and the first
   * spelling was wrong in a way worth recording. Deviation is measured between UNDIRECTED AXES,
   * so a 90° turn is an INVOLUTION on the band: it reds everything that was square AND squares
   * anything that was ~90° out. `highwater/wallLane` sits 79.7° off, so turning it 90° leaves it
   * 10.3° off — inside the band, and correctly so. A control that demanded 19 of 19 was asserting
   * something arithmetically false and would have been "fixed" by weakening the instrument.
   */
  const wasIn = base.filter((r) => r.dev != null && r.inBand);
  const nowRed = wasIn.filter((r) => { const m = s1.find((x) => x.leaf === r.leaf && x.key === r.key); return m && !m.inBand; }).length;
  const survivor = s1.filter((r) => r.inBand).map((r) => `${r.leaf}/${String(r.key).split('|').pop()} (was ${base.find((b) => b.leaf === r.leaf && b.key === r.key).dev}° out)`);
  process.stdout.write(`   C1 · EVERY DECK TURNED 90° (a deck laid ALONG the river): ${nowRed} of ${wasIn.length} CONFORMING decks now RED\n`);
  process.stdout.write(`        still in band after the turn: ${survivor.length ? survivor.join(', ') : 'none'}\n`);
  process.stdout.write(`        → ${nowRed === wasIn.length ? 'LIVE — a deck laid along the river reds every bridge that was square' : '⛔ DEAD — a square deck survived a 90° turn'}\n`);

  const skew = census({}, (b) => ({ ...b, along: (b.along + skew30) % TRIG_N }));
  const s2 = skew.filter((r) => r.dev != null);
  const wereIn = base.filter((r) => r.dev != null && r.inBand);
  const nowOut = wereIn.filter((r) => {
    const m = s2.find((x) => x.leaf === r.leaf && x.key === r.key);
    return m && !m.inBand;
  }).length;
  process.stdout.write(`   C2 · A 30° SKEW (twice the band) planted on every deck: ${nowOut} of ${wereIn.length} conforming decks now RED\n`);
  process.stdout.write(`        → ${nowOut === wereIn.length ? 'LIVE — the band catches a skew twice its own width, on every conforming deck'
    : nowOut > 0 ? `PARTIAL — ${wereIn.length - nowOut} conforming decks absorb a 30° skew (their deviation had the opposite sign)`
      : '⛔ DEAD — the band cannot see a 30° skew'}\n`);

  // C3 · the NEGATIVE control: the census must NOT red a deck that is left alone.
  const again = census({});
  const drift = again.filter((r, i) => JSON.stringify(r) !== JSON.stringify(base[i])).length;
  process.stdout.write(`   C3 · NEGATIVE (unmutated re-run): ${drift} rows differ\n`);
  process.stdout.write(`        → ${drift === 0 ? 'LIVE — the instrument is deterministic and does not red a clean deck' : '⛔ the instrument is not deterministic'}\n`);
}
