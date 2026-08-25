#!/usr/bin/env node
/**
 * mk-controls-dress.mjs — ⭐⭐⭐ **PA.5's PER-ROLE PLANTED CONTROLS, FOR THE PARTITION DRESS.**
 *
 * PA.5: *"Every re-record on partition SVG is GATED on per-role planted controls (each moving
 * exactly one role) before any baseline is believed — the vacuous-mask class pre-killed."*
 *
 * ⛔⛔ **WHY `mk-controls.mjs` COULD NOT SERVE, MEASURED RATHER THAN ASSUMED.** Its four plans
 * patch STROKES only:
 *   `flat-street`  → `{ stroke: fabricHex }`
 *   `flat-wall`    → `{ stroke: ROLE.ink, 'stroke-width': '0.72', … }`
 * The legacy folio drew its street web as strokes, so that broke the street. **The dress draws its
 * street as a FILLED SURFACE** — `<path d="…" fill="${T.street}" stroke="none"/>`
 * (`partitionDress.js:241`) — so setting a stroke on it ADDS a hairline to a surface that is still
 * exactly as visible as before. The control would have run, exited 0, printed a plate, and broken
 * nothing; the instrument would then have reported "no change" and that reading would have been
 * worthless. A control that cannot fail proves nothing, and a control aimed at the wrong ATTRIBUTE
 * is a control that cannot fail.
 *
 * ⭐⭐ **AND THE CURE IS ONE THE CLASSIFIER CURE MAKES SAFE.** Since `GROUP_ROLE` now names every
 * `dress-*` id, an element's role is decided by its GROUP, **before** the attribute ladder is
 * reached. So repainting an element CANNOT move it into a different role — the one-role-only
 * property is guaranteed by construction rather than hoped for. This file still ASSERTS it after
 * every rewrite (`--assert`), because "guaranteed by construction" is an argument and a re-count
 * is a measurement.
 *
 * THE SEVEN BREAKS — one per role the dress draws AND an instrument reads:
 *   street    → the street surface takes the BUILDING's median fill. The gap stops being a gap.
 *   wall      → the circuit takes the building's median fill at hair weight. It stops being the
 *               loudest thing on the page (i5's `wall:all`, i1's wall arm).
 *   water     → the water takes the GREENS role colour. VALUE roughly preserved, HUE destroyed —
 *               the precise failure i7 exists to catch, and the same break the legacy plan chose.
 *   building  → the fabric takes the STREET tone. Fabric and gap become one wash: review I4's own
 *               defect, planted deliberately.
 *   field     → the countryside takes the PAPER colour. i7's field band loses its subject.
 *   yard      → the toft takes the street tone (I4's separation, half-collapsed).
 *   square    → the void takes the street tone.
 *
 * Usage: node mk-controls-dress.mjs <base.svg> <outDir> [--lens=parchment] [--roles=a,b] [--assert]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { classify, LENSES } from './lib/classify.mjs';
import { tokenize } from './lib/svg.mjs';

const IN = process.argv[2];
const OUT = process.argv[3];
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const lensId = arg('lens', 'parchment');
const ASSERT = process.argv.includes('--assert');

const isHexStr = (v) => /^#[0-9a-fA-F]{6}$/.test(v || '');

/** re-emit the document, applying `fn(role, attrs, tag)` to every classified element */
function rewrite(svgPath, fn) {
  const { els, src } = classify(svgPath, lensId);
  const toks = tokenize(src);
  const byTok = new Map(els.map((r) => [r.i, r]));
  const out = [];
  let touched = 0;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind === 'text') { out.push(t.raw); continue; }
    if (t.kind === 'close') { out.push(`</${t.tag}>`); continue; }
    const rec = byTok.get(i);
    let raw = t.raw;
    if (rec) {
      const patch = fn(rec.role, t.attrs, t.tag);
      if (patch && Object.keys(patch).length) {
        touched++;
        for (const [k, v] of Object.entries(patch)) {
          if (new RegExp(`\\s${k}="[^"]*"`).test(raw)) raw = raw.replace(new RegExp(`\\s${k}="[^"]*"`), ` ${k}="${v}"`);
          else raw = raw.replace(/(\/?>)$/, ` ${k}="${v}"$1`);
        }
      }
    }
    out.push(raw);
  }
  return { svg: out.join(''), touched };
}

const ROLE = LENSES[lensId] || LENSES.parchment;

/**
 * The tone a mark must VANISH INTO, taken from the plate itself rather than from the palette.
 * ⚠ `mk-controls.mjs` records why this matters: its first `flat-street` used the pale ground WASH
 * and the street arm only fell 23 %, because the ground POPULATION an instrument measures is the
 * block interiors — the FABRIC. The target is the median BUILDING fill, measured here per plate.
 */
function medianFillOf(role) {
  const { els } = classify(IN, lensId);
  const hexes = [];
  for (const r of els) {
    if (r.role !== role) continue;
    const f = r.t.attrs.fill;
    if (isHexStr(f)) hexes.push(f);
  }
  if (!hexes.length) return null;
  const L = (h) => 0.2126 * parseInt(h.slice(1, 3), 16) + 0.7152 * parseInt(h.slice(3, 5), 16) + 0.0722 * parseInt(h.slice(5, 7), 16);
  hexes.sort((a, b) => L(a) - L(b));
  return hexes[Math.floor(hexes.length / 2)];
}

const fabricHex = medianFillOf('building') || ROLE.roofs;
const streetHex = medianFillOf('street') || ROLE.roads;

/**
 * ⭐ ONE BREAK PRIMITIVE, FILL-AWARE AND STROKE-AWARE. A dress group may be a filled surface
 * (`fill=hex stroke=none`), a stroked family (`fill=none stroke=hex`), or BOTH (the band is
 * `fill=bandGround stroke=wall`). Repainting only one of the two would leave half the mark
 * standing, which is the same class of half-dead control this file exists to kill.
 */
const paint = (to) => (role, a) => {
  const p = {};
  if (isHexStr(a.fill)) p.fill = to;
  if (isHexStr(a.stroke)) p.stroke = to;
  if (!Object.keys(p).length) return null;
  return p;
};

export const DRESS_PLANS = {
  'dress-flat-street': { role: 'street', patch: paint(fabricHex), breaks: 'the street gap takes the median FABRIC fill — the negative space stops being negative' },
  'dress-flat-wall': { role: 'wall', patch: (role, a) => ({ ...paint(fabricHex)(role, a), 'stroke-width': '0.4', 'stroke-opacity': '0.3' }), breaks: 'the circuit takes the fabric tone at hair weight — it stops being the loudest ink' },
  'dress-grey-water': { role: 'water', patch: paint(ROLE.greens), breaks: 'the water takes the GREENS hue — value roughly held, hue destroyed' },
  /**
   * ⛔⛔ **THESE TWO BREAKS WERE DEAD ON FIRST EXECUTION AND PA.5's GATE CAUGHT THEM.** The first
   * spelling painted the fabric to the STREET tone (`#F3EBD6`, hue **43.4°**) and the field to
   * PAPER (`#E9DEC3`, hue **42.6°**) — value breaks, and correct as such. But the arms they are
   * meant to gate are **HUE** arms: i7's `town` band is **[0, 60]°** and its `field` band is
   * **[35, 70]°**, so BOTH break tones land INSIDE the band under test. MEASURED: `flat-field`
   * moved i7's field conformance 0.996 → 0.996 and `flat-building` moved i7's town 0.999 → 0.998.
   * **A control that repaints a role into the very band the instrument is testing cannot fail.**
   * ⭐ The break is therefore the WATER role's blue-grey (`#7E8E97`, hue **201.6°**) — far outside
   * both bands, and close in VALUE to what it replaces, so it isolates hue exactly the way the
   * legacy `grey-water` plan isolates it in the other direction.
   */
  'dress-flat-building': { role: 'building', patch: paint(ROLE.water), breaks: 'the fabric takes an OUT-OF-BAND hue (201.6°) against i7\'s town band [0,60]' },
  'dress-flat-field': { role: 'field', patch: paint(ROLE.water), breaks: 'the countryside takes an OUT-OF-BAND hue (201.6°) against i7\'s field band [35,70]' },
  'dress-flat-yard': { role: 'yard', patch: paint(streetHex), breaks: 'the toft takes the street tone' },
  'dress-flat-square': { role: 'square', patch: paint(streetHex), breaks: 'the void takes the street tone' },
};

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!IN || !OUT) { console.error('usage: mk-controls-dress.mjs <base.svg> <outDir> [--lens=] [--roles=] [--assert]'); process.exit(2); }
  mkdirSync(OUT, { recursive: true });
  const want = arg('roles', '') ? arg('roles', '').split(',') : null;
  const baseCensus = classify(IN, lensId).census;
  const report = [];
  let dead = 0;
  for (const [name, plan] of Object.entries(DRESS_PLANS)) {
    if (want && !want.includes(plan.role)) continue;
    const { svg, touched } = rewrite(IN, (role, a, tag) => (role === plan.role ? plan.patch(role, a, tag) : null));
    const file = join(OUT, `${name}.svg`);
    writeFileSync(file, svg);
    /**
     * ⛔ A PLAN THAT TOUCHED NOTHING IS A DEAD CONTROL AND IS NAMED AS ONE. This is the exact
     * failure `mk-controls.mjs`'s stroke-only plans would have produced silently on this dress.
     */
    const live = touched > 0;
    if (!live) dead++;
    let oneRole = 'not-asserted';
    if (ASSERT) {
      const after = classify(file, lensId).census;
      const keys = [...new Set([...Object.keys(baseCensus), ...Object.keys(after)])];
      const moved = keys.filter((k) => (baseCensus[k] || 0) !== (after[k] || 0));
      oneRole = moved.length === 0 ? 'ONE-ROLE-ONLY ✔ (role census unmoved)' : `⛔ ROLE CENSUS MOVED: ${moved.join(',')}`;
      if (moved.length) dead++;
    }
    report.push({ name, role: plan.role, file, touched, bytes: Buffer.byteLength(svg), live, oneRole });
    console.log(`${name.padEnd(22)} role=${plan.role.padEnd(9)} touched=${String(touched).padStart(3)}`
      + ` bytes=${String(Buffer.byteLength(svg)).padStart(7)}  ${live ? 'LIVE' : '⛔ DEAD — TOUCHED NOTHING'}  ${oneRole}`);
  }
  console.log(`\nfabricHex=${fabricHex} streetHex=${streetHex}`);
  console.log(dead ? `⛔ DRESS_CONTROLS ${dead} DEFECT(S)` : 'DRESS_CONTROLS_WRITTEN — every plan touched ink and moved no role');
  const j = arg('json', '');
  if (j) writeFileSync(j, JSON.stringify(report, null, 1));
}
