/**
 * silhouette.mjs — ⭐⭐⭐ THE BLIND-SILHOUETTE FIXTURE SHEET (REG-I0 instrument 9's protocol,
 * §9.1 "fixture preparation"). This lane PREPARES the sheet; **the CHAIR runs the read** with a
 * fresh-context reader, per ODQ §622.2 and A2.2's executor clause.
 *
 * THE CHAIR-SET PARAMETERS (ODQ §622.2), pinned here BEFORE anything was rendered:
 *   N = 24 silhouettes · 6 classes × 4 each · target ≥ 75 % correct · labels withheld.
 *
 * §9.1's five requirements, each discharged and each stated:
 *   1. THE MASSES ARE CHOSEN BY A STATED RULE, recorded before looking at any of them:
 *      **for each class, the four largest bodies of that family by drawn area, taken across the
 *      declared seed ladder, at most one per seed** — the last clause so a sheet cannot be four
 *      views of one town's own church.
 *   2. FIXED FRAME: every crop is `FRAME_SIZES` view units square, centred on the body, so the
 *      frame is identical between classes and nothing is upscaled from a raster (`reg0/crop.mjs`
 *      does a TRUE VECTOR crop by rewriting the viewBox).
 *   3. EVERY NON-GEOMETRIC CUE STRIPPED: all `<text>`, all `data-anchor`/`data-cite`, the legend,
 *      the cartouche, the lettering splice, the marginalia. **A silhouette read that can see a
 *      label is a label read.**
 *   4. ORDER RANDOMISED BY A RECORDED SEED (`ORDER_SEED`), and the ANSWER KEY is written to a
 *      SEPARATE FILE the reader is never given a path to.
 *   5. DECOYS INCLUDED: 4 ordinary fabric blocks at the same crop and the same count as one real
 *      class. Without them a high pass fraction means nothing (instrument 4's own logic).
 *
 * Usage: node silhouette.mjs --out=<dir> [--n=12]
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const HERE = dirname(fileURLToPath(import.meta.url));
const SP = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad';
const { buildOne } = await import(join(HERE, 'leaf.mjs'));
const { renderFolio } = await import(join(HERE, '../renderFolio.mjs'));
const { hashUnit } = await import(join(HERE, '../../src/domain/townMap/fabric/fabricRng.js'));
const absArea = (p) => { let s = 0; for (let i = 0, j = p.length - 1; i < p.length; j = i++) s += p[j][0] * p[i][1] - p[i][0] * p[j][1]; return Math.abs(s) / 2; };
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

export const CLASSES = ['church', 'hall', 'inn', 'warehouse', 'farmstead', 'craft'];
export const PER_CLASS = 4;
export const DECOYS = 4;
export const TARGET = 0.75;
export const ORDER_SEED = 'reg3-silhouette-order-1';
/** ⚠ ONE FRAME PER CLASS-SCALE BAND, not one per fixture: a farmstead is a countryside body and a
 *  church an urban one, and forcing both into one frame would make SIZE the read instead of FORM.
 *  The frame is a multiple of the body's OWN size, so the reader sees the same amount of context. */
const FRAME_MULT = 7;

const outDir = arg('out', join(SP, 'reg3work/silhouettes'));
mkdirSync(outDir, { recursive: true });
const N = Number(arg('n', 12));
const TIERS = ['village', 'town', 'city', 'metropolis'];
const TERRAINS = ['plains', 'riverside', 'coastal'];
const SEEDS = [];
for (let i = 0; i < N; i++) {
  SEEDS.push({
    key: `sil-${i}`, seed: `reg3-gallery-${i}`,
    settType: TIERS[i % TIERS.length], terrain: TERRAINS[Math.floor(i / TIERS.length) % TERRAINS.length],
  });
}

/** THE CANDIDATE SWEEP — every body of every class, with its drawn area and its seed. */
const cands = new Map(CLASSES.map((c) => [c, []]));
const decoyCands = [];
const svgBySeed = new Map();
for (const spec of SEEDS) {
  const { fabric } = buildOne(spec, { shapeCode: true });
  const { svg } = renderFolio(fabric, { lens: 'parchment' });
  svgBySeed.set(spec.key, svg);
  const take = (family, body, x, y, size) => {
    const list = cands.get(family === 'quay' ? 'warehouse' : family);
    if (!list) return;
    const area = (body || []).reduce((a, p) => a + absArea(p), 0);
    list.push({ seed: spec.key, x, y, size, area, family });
  };
  for (const lm of fabric.landmarks) if (lm.shapeFamily) take(lm.shapeFamily, lm.solids, lm.x, lm.y, lm.size);
  for (const d of (fabric.habitation || [])) if (d.shapeFamily) take(d.shapeFamily, d.solids, d.x, d.y, d.size);
  // DECOYS: ordinary fabric bodies, taken from the middle of the parcel list by area so they are
  // neither the biggest nor the smallest thing on the leaf.
  const ps = fabric.parcels.filter((p) => !p.derelict && p.polygon && p.polygon.length >= 3)
    .map((p) => ({ p, a: absArea(p.polygon) })).sort((a, b) => b.a - a.a);
  const mid = ps[Math.floor(ps.length * 0.12)];
  if (mid) decoyCands.push({ seed: spec.key, x: mid.p.center[0], y: mid.p.center[1], size: Math.sqrt(mid.a), area: mid.a, family: 'DECOY' });
}

/** THE STATED RULE, applied: four largest per class, at most one per seed. */
const chosen = [];
for (const c of CLASSES) {
  const list = cands.get(c).slice().sort((a, b) => b.area - a.area || (a.seed < b.seed ? -1 : 1));
  const seen = new Set();
  for (const cand of list) {
    if (seen.has(cand.seed)) continue;
    seen.add(cand.seed);
    chosen.push({ ...cand, klass: c });
    if (seen.size >= PER_CLASS) break;
  }
}
const dsorted = decoyCands.slice().sort((a, b) => b.area - a.area || (a.seed < b.seed ? -1 : 1));
for (let i = 0; i < DECOYS && i < dsorted.length; i++) chosen.push({ ...dsorted[i], klass: 'DECOY' });

/** §9.1(3) — strip every non-geometric cue. */
function strip(svg) {
  // ⛔⛔ THE GROUP REMOVAL IS GONE AND ITS REMOVAL IS THE POINT. A non-greedy
  // `<g id="legend">[\s\S]*?</g>` stops at the FIRST `</g>` inside a NESTED group, leaving an
  // unbalanced tag — Chrome then answers with its XML-error page and screenshots the banner
  // above the drawing. MEASURED: fixture S04 came back with "Opening and ending tag mismatch:
  // svg line 1 and g" printed across the top of a church silhouette, and `shoot.sh`'s byte floor
  // did NOT catch it because the page still rendered real content beneath the banner.
  // ⭐ THE CLASS, and it is this programme's own: **a size floor catches an EMPTY failure, not a
  // CORRUPT one** — the error page that still draws the map is the one that gets through.
  // ⚠ AND THE GROUPS DID NOT NEED REMOVING: every one of them is lettering or plate chrome, all
  // of it either `<text>` (removed below, and `<text>` never nests) or sited outside a
  // body-centred crop's viewBox. The cue that mattered — `data-anchor` — is an ATTRIBUTE.
  const out = svg
    .replace(/<text\b[^>]*>[^<]*(?:<(?!\/text)[^<]*)*<\/text>/g, '')
    .replace(/<tspan\b[^>]*>[\s\S]*?<\/tspan>/g, '')
    .replace(/\sdata-anchor="[^"]*"/g, '')
    .replace(/\sdata-cite="[^"]*"/g, '');
  // ⭐ AND THE STRIP VERIFIES ITSELF, because a cue-stripper that silently fails produces a
  // LABEL READ wearing a silhouette read's name. Both counts must be zero and the tag balance
  // must be unchanged.
  const opens = (out.match(/<g\b/g) || []).length, closes = (out.match(/<\/g>/g) || []).length;
  if (/<text\b/.test(out) || /data-anchor=/.test(out)) throw new Error('strip failed: a cue survived');
  if (opens !== closes) throw new Error(`strip failed: ${opens} <g> against ${closes} </g> — the document is not well formed`);
  return out;
}

/** §9.1(4) — randomise by a RECORDED seed. */
const order = chosen.map((c, i) => ({ c, u: hashUnit(`${ORDER_SEED}|${i}|${c.klass}|${c.seed}`) }))
  .sort((a, b) => a.u - b.u).map((o) => o.c);

const key = [];
order.forEach((c, i) => {
  const id = `S${String(i + 1).padStart(2, '0')}`;
  const w = Math.max(30, c.size * FRAME_MULT);
  const src = strip(svgBySeed.get(c.seed));
  const tmp = join(outDir, `.src-${id}.svg`);
  writeFileSync(tmp, src);
  const outSvg = join(outDir, `${id}.svg`);
  execFileSync(process.execPath, [join(SP, 'reg0/crop.mjs'), tmp, outSvg,
    String(Math.round(c.x - w / 2)), String(Math.round(c.y - w / 2)), String(Math.round(w)), String(Math.round(w))],
  { stdio: ['ignore', 'ignore', 'ignore'] });
  try {
    execFileSync('/bin/zsh', [join(SP, 'reg0/shoot.sh'), outSvg, join(outDir, `${id}.png`), '700', '8000'],
      { stdio: ['ignore', 'ignore', 'ignore'] });
  } catch { /* the byte floor may reject a near-empty crop; the key records it */ }
  key.push({ id, klass: c.klass, seed: c.seed, family: c.family, area: Math.round(c.area * 10) / 10, frame: Math.round(w) });
});

// THE SHEET the reader is given: ids and the CLOSED CLASS LIST, and nothing else.
writeFileSync(join(outDir, 'SHEET.md'), [
  '# BLIND SILHOUETTE SHEET — REG-3',
  '',
  `Answer each fixture with ONE of the closed class list, or \`CANNOT TELL\`.`,
  '',
  `**CLOSED CLASS LIST:** ${CLASSES.join(' · ')}`,
  '',
  `\`CANNOT TELL\` is a first-class answer and is recorded separately — it is never folded into "wrong".`,
  '',
  `**FIXTURES (${key.length}):** ${key.map((k) => k.id).join(' · ')}`,
  '',
  'One PNG per id in this directory. No feedback until the sheet is finished.',
  '',
  `Scoring (instrument 9 §9.3): passFraction = correct / (real-class fixtures − CANNOT TELL);`,
  `cannotTellRate reported beside it; decoyFalsePositiveRate is the VALIDITY GATE — if it is high`,
  `the round is VOID.`,
  `Target: ≥ ${TARGET * 100} % over ${CLASSES.length} classes × ${PER_CLASS} = ${CLASSES.length * PER_CLASS} real fixtures (chair-set, ODQ §622.2).`,
].join('\n'));

// THE ANSWER KEY — a SEPARATE file, in a SEPARATE directory the sheet does not name.
const keyDir = join(outDir, '..', 'silhouette-key');
mkdirSync(keyDir, { recursive: true });
writeFileSync(join(keyDir, 'ANSWER-KEY.json'), JSON.stringify({
  orderSeed: ORDER_SEED, classes: CLASSES, perClass: PER_CLASS, decoys: DECOYS, target: TARGET,
  rule: 'for each class, the four largest bodies of that family by drawn area across the declared seed ladder, at most one per seed',
  key,
}, null, 2));

console.log(`PREPARED ${key.length} fixtures in ${outDir}`);
console.log(`  real ${key.filter((k) => k.klass !== 'DECOY').length} over ${CLASSES.length} classes · decoys ${key.filter((k) => k.klass === 'DECOY').length}`);
console.log(`  ANSWER KEY (separate dir, NOT named in SHEET.md): ${join(keyDir, 'ANSWER-KEY.json')}`);
for (const c of CLASSES) console.log(`  ${c.padEnd(11)} ${key.filter((k) => k.klass === c).length} fixtures`);
