/**
 * mk-controls.mjs — REG-I0 · THE DELIBERATELY-FAILING PLATES.
 *
 * ⛔⛔ WHY THIS FILE EXISTS. A control that cannot fail proves nothing, and the harder half is
 * the converse: **proving a ZERO delta is harder than proving a positive one, because identical
 * readings are exactly what a DEAD instrument returns.** Where an instrument reports "no change
 * between BEFORE and AFTER", that reading is worthless until the same instrument has been shown
 * to MOVE on a plate deliberately broken in the way it claims to measure.
 *
 * So each control here breaks ONE role and leaves the rest of the drawing untouched:
 *   flat-street  every street stroke takes the FABRIC's own median fill — the street web is
 *                still there, still the same geometry, and now invisible. The squint street arm
 *                and the street↔ground contrast floor MUST collapse; every other arm must not move.
 *   flat-wall    every wall stroke takes the fabric ink's weight and tone — the circuit stops
 *                being the loudest thing on the page.
 *   grey-water   the water body takes the GREENS role colour. Value is roughly preserved and HUE
 *                is destroyed, which is the precise failure the FTG colour arm exists to catch
 *                (and which the recovered MF-A1 paint's own W1 warm remap actually committed).
 *
 * The rewrite is textual and role-driven: elements are classified by the sealed lens table, then
 * only the classified role's own colour attributes are restated. Geometry is never touched, so a
 * control plate differs from its parent in EXACTLY the channel under test.
 *
 * Usage: node mk-controls.mjs <base.svg> <outDir> [--lens=parchment]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { classify, LENSES } from './lib/classify.mjs';
import { tokenize } from './lib/svg.mjs';

const IN = process.argv[2];
const OUT = process.argv[3];
const lensId = (process.argv.find((a) => a.startsWith('--lens=')) || '--lens=parchment').slice(7);

/** re-emit the document, applying `fn(role, attrs)` to every classified element's attributes */
function rewrite(svgPath, fn) {
  const { els, src } = classify(svgPath, lensId);
  const toks = tokenize(src);
  const byTok = new Map(els.map((r) => [r.i, r]));
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind === 'text') { out.push(t.raw); continue; }
    if (t.kind === 'close') { out.push(`</${t.tag}>`); continue; }
    const rec = byTok.get(i);
    let raw = t.raw;
    if (rec) {
      const patch = fn(rec.role, t.attrs, t.tag);
      if (patch) {
        for (const [k, v] of Object.entries(patch)) {
          if (new RegExp(`\\s${k}="[^"]*"`).test(raw)) raw = raw.replace(new RegExp(`\\s${k}="[^"]*"`), ` ${k}="${v}"`);
          else raw = raw.replace(/(\/?>)$/, ` ${k}="${v}"$1`);
        }
      }
    }
    out.push(raw);
  }
  return out.join('');
}

mkdirSync(OUT, { recursive: true });
const ROLE = LENSES[lensId] || LENSES.parchment;

/**
 * The tone the street must vanish INTO.
 *
 * ⚠⚠ BITTEN, AND THE FIRST TRY WAS TOO WEAK A BREAK. The first `flat-street` recoloured the
 * street to the URBAN GROUND WASH (#e0d7bc) and the street arm only fell 23%: the wash is a
 * pale aged-paper tone, and a pale street on a pale wash is still far from the ground
 * POPULATION the instrument actually measures — which is the block interiors, i.e. the FABRIC.
 * A control must break the thing under test, not something adjacent to it. The target is
 * therefore the MEDIAN BUILDING FILL: the exact tone the ground population is made of.
 */
const fabricHex = (() => {
  const { els } = classify(IN, lensId);
  const lums = [];
  for (const r of els) {
    if (r.role !== 'building') continue;
    const f = r.t.attrs.fill;
    if (/^#[0-9a-fA-F]{6}$/.test(f || '')) lums.push(f);
  }
  if (!lums.length) return ROLE.roofs;
  lums.sort((a, b) => {
    const L = (h) => 0.2126 * parseInt(h.slice(1, 3), 16) + 0.7152 * parseInt(h.slice(3, 5), 16) + 0.0722 * parseInt(h.slice(5, 7), 16);
    return L(a) - L(b);
  });
  return lums[Math.floor(lums.length / 2)];
})();

const PLANS = {
  'flat-street': (role, a) => (role === 'street' ? { stroke: fabricHex } : null),
  'flat-wall': (role, a) => (role === 'wall'
    ? { stroke: ROLE.ink, 'stroke-width': '0.72', 'stroke-opacity': '0.35' } : null),
  'grey-water': (role, a) => (role === 'water'
    ? (/^#[0-9a-fA-F]{6}$/.test(a.fill || '') ? { fill: ROLE.greens } : { stroke: ROLE.greens }) : null),
  /**
   * ⭐ THE ONE **POSITIVE** CONTROL IN THE SET, AND IT EXISTS BECAUSE THE MEASUREMENT CAME BACK
   * NEGATIVE. Instrument 4 finds the sealed plates' landmarks NO more salient than matched decoy
   * patches — a real finding, and one nobody should believe from an instrument that has never
   * been shown to report salience when salience is present. This plate paints every landmark
   * mass the wall ink: the anchors become unmistakable, and instrument 4 must say so loudly.
   * A negative result is only evidence once the instrument has proved it can return a positive.
   */
  'loud-landmark': (role, a) => (role === 'landmark'
    ? { fill: ROLE.walls, stroke: ROLE.walls } : null),
};

const report = [];
for (const [name, fn] of Object.entries(PLANS)) {
  const svg = rewrite(IN, fn);
  const file = join(OUT, `CTRL-${name}.svg`);
  writeFileSync(file, svg);
  report.push({ name, file, bytes: Buffer.byteLength(svg) });
  process.stdout.write(`CTRL ${name}  ${Buffer.byteLength(svg)} bytes  ${file}\n`);
}
process.stdout.write(`fabricHex=${fabricHex}\nCONTROLS_WRITTEN\n`);
