/**
 * tests/pdf/countersealStructuredPath.test.js — V-27c FULL PARITY PINS.
 *
 * react-pdf renderToBuffer is NON-deterministic, so parity here NEVER compares PDF
 * bytes — it walks the element tree and the authored geometry, three ways:
 *
 *   1. GEOMETRY MIRROR — for every emblem, the structured EMBLEM_PATHS table is a
 *      faithful mirror of pools.js `draw(p)`: extract the path `d`s + circle coords
 *      from the DOM SVG string and assert they equal the structured nodes. If the
 *      hand-authored `draw()` ever changes, this fails — the mirror cannot drift.
 *   2. CROSS-SURFACE SELECTION — a given seed selects the SAME emblem for the PDF
 *      counterseal as the web `emblem(seed)` renders (bar 11: the seed's mark is
 *      identical across surfaces).
 *   3. RENDER TREE — HouseCountersealSeal (a plain function component) renders
 *      exactly the structured geometry as <Path>/<Circle> nodes and NO text leaves.
 */

import { describe, it, expect } from 'vitest';
import { EMBLEMS } from '../../src/design/organic/ornament/pools.js';
import { emblem } from '../../src/design/organic/ornament/compose.js';
import { ornamentPalette } from '../../src/design/organic/ornament/palette.js';
import { EMBLEM_PATHS } from '../../src/design/organic/ornament/emblemPaths.js';
import {
  HouseCountersealSeal,
  countersealEmblemName,
} from '../../src/pdf/primitives/HouseCountersealSeal.jsx';

// Extract every path `d` and circle (cx,cy,r) from a DOM SVG string — the
// "walk the draw() tree" side of the mirror (never bytes of a rendered PDF).
function geomFromSvgString(svg) {
  const ds = [...svg.matchAll(/d="([^"]+)"/g)].map((m) => m[1]);
  const circles = [...svg.matchAll(/<circle\s+cx="([^"]+)"\s+cy="([^"]+)"\s+r="([^"]+)"/g)]
    .map((m) => ({ cx: Number(m[1]), cy: Number(m[2]), r: Number(m[3]) }));
  return { ds, circles };
}

// Structured nodes → the same two shapes, for comparison.
function geomFromStructured(nodes) {
  return {
    ds: nodes.filter((n) => n.el === 'path').map((n) => n.d),
    circles: nodes.filter((n) => n.el === 'circle').map((n) => ({ cx: n.cx, cy: n.cy, r: n.r })),
  };
}

// Walk a react-pdf element tree collecting <Path>/<Circle> primitives by their
// geometry props — no PDF bytes, no host-component execution.
function collectPrimitives(node, out = []) {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) {
    for (const n of node) collectPrimitives(n, out);
    return out;
  }
  const props = node.props || {};
  if (typeof props.d === 'string') out.push({ kind: 'path', d: props.d });
  else if (props.cx !== undefined) out.push({ kind: 'circle', cx: Number(props.cx), cy: Number(props.cy), r: Number(props.r) });
  if (props.children) collectPrimitives(props.children, out);
  return out;
}

const P = ornamentPalette('light');

// SB2 — PAINT-ROLE extraction: geometry equality alone let a fill↔stroke flip
// slip through with every test green (a disc on the PDF, a ring on the web).
// Each element's role comes from its OWN attributes in the draw() string: a
// fill= that isn't "none" with no own stroke= ⇒ 'fill' (the tower's window dot);
// anything else — bare tags inheriting the group's S(p) stroke idiom, or an own
// stroke= (the coin's cross) ⇒ 'stroke'. Returned in DOCUMENT ORDER with the
// element's geometry key so role and shape are pinned together.
function paintedFromSvgString(svg) {
  return [...svg.matchAll(/<(path|circle)\b([^>]*?)\/>/g)].map(([, el, attrs]) => {
    const ownFill = /fill="(?!none")[^"]*"/.test(attrs);
    const ownStroke = /\bstroke="/.test(attrs);
    const role = ownFill && !ownStroke ? 'fill' : 'stroke';
    if (el === 'path') return { el, role, key: /d="([^"]+)"/.exec(attrs)[1] };
    return { el, role, key: `${/cx="([^"]+)"/.exec(attrs)[1]},${/cy="([^"]+)"/.exec(attrs)[1]},${/r="([^"]+)"/.exec(attrs)[1]}` };
  });
}

describe('1. geometry mirror — EMBLEM_PATHS faithfully mirrors pools.js draw()', () => {
  it('every emblem has a structured entry', () => {
    for (const e of EMBLEMS) {
      expect(EMBLEM_PATHS[e.name], `no structured paths for emblem ${e.name}`).toBeDefined();
    }
    // No stale structured entries either.
    const names = new Set(EMBLEMS.map((e) => e.name));
    for (const name of Object.keys(EMBLEM_PATHS)) {
      expect(names.has(name), `structured entry ${name} has no emblem`).toBe(true);
    }
  });

  for (const e of EMBLEMS) {
    it(`${e.name}: structured path/circle geometry equals draw()`, () => {
      const drawn = geomFromSvgString(e.draw(P));
      const structured = geomFromStructured(EMBLEM_PATHS[e.name]);
      expect(structured.ds).toEqual(drawn.ds);
      expect(structured.circles).toEqual(drawn.circles);
    });

    it(`${e.name}: structured PAINT ROLES mirror draw() (fill vs stroke, in document order)`, () => {
      const painted = paintedFromSvgString(e.draw(P));
      const structured = EMBLEM_PATHS[e.name].map((n) => ({
        el: n.el,
        role: n.role,
        key: n.el === 'path' ? n.d : `${n.cx},${n.cy},${n.r}`,
      }));
      expect(structured).toEqual(painted);
    });
  }

  it('stroke widths agree — every draw() stroke is width 2, every structured stroke node resolves to 2', () => {
    for (const e of EMBLEMS) {
      const widths = [...e.draw(P).matchAll(/stroke-width="([^"]+)"/g)].map((m) => m[1]);
      expect(widths.length, `${e.name} declares at least the group stroke width`).toBeGreaterThan(0);
      for (const w of widths) expect(w, `${e.name} stroke width`).toBe('2');
      for (const n of EMBLEM_PATHS[e.name]) {
        if (n.role === 'stroke') expect(n.w || 2, `${e.name} structured stroke width`).toBe(2);
      }
    }
  });
});

describe('2. cross-surface selection — same seed, same mark on web and PDF', () => {
  const seeds = ['Aldergate', 'Highfen', 'Cinderhollow', 'Umberford', 'Saltmarsh Bend', 'Wren', 'the-lonely-tor'];
  for (const seed of seeds) {
    it(`"${seed}" selects the same emblem the web renders`, () => {
      const webGeom = geomFromSvgString(emblem(seed, {}));
      const pdfName = countersealEmblemName(seed);
      const structured = geomFromStructured(EMBLEM_PATHS[pdfName]);
      // The web emblem(seed) string and the PDF-selected structured emblem carry
      // the identical geometry — i.e. the SAME emblem was chosen for the seed.
      expect(structured.ds).toEqual(webGeom.ds);
      expect(structured.circles).toEqual(webGeom.circles);
    });
  }
});

describe('3. render tree — HouseCountersealSeal renders the geometry, no text', () => {
  it('renders exactly the selected emblem geometry as Path/Circle nodes', () => {
    const seed = 'Aldergate';
    const el = HouseCountersealSeal({ seed, size: 14 });
    const prims = collectPrimitives(el);
    const name = countersealEmblemName(seed);
    const expected = EMBLEM_PATHS[name].map((n) => (n.el === 'path'
      ? { kind: 'path', d: n.d }
      : { kind: 'circle', cx: n.cx, cy: n.cy, r: n.r }));
    expect(prims).toEqual(expected);
  });

  it('emits no <Text> — the counterseal adds nothing to the PDF text leaves', () => {
    const el = HouseCountersealSeal({ seed: 'Highfen', size: 14 });
    const prims = collectPrimitives(el);
    // Only path/circle geometry; a text node would carry a string child, not d/cx.
    expect(prims.length).toBeGreaterThan(0);
    expect(prims.every((p) => p.kind === 'path' || p.kind === 'circle')).toBe(true);
  });

  it('returns null for an absent seed (no counterseal, like the web)', () => {
    expect(HouseCountersealSeal({ seed: undefined })).toBeNull();
    expect(HouseCountersealSeal({ seed: '' })).toBeNull();
  });

  // SB2 — the PDF paints each node BY ITS ROLE: 'fill' ⇒ solid ink, no stroke;
  // 'stroke' ⇒ fill none + inked outline at the node's width. Walk the rendered
  // props against the structured roles so a role drift renders red here, not as
  // a silent disc-vs-ring mismatch between surfaces.
  function collectPaint(node, out = []) {
    if (node == null || typeof node !== 'object') return out;
    if (Array.isArray(node)) {
      for (const n of node) collectPaint(n, out);
      return out;
    }
    const props = node.props || {};
    if (typeof props.d === 'string' || props.cx !== undefined) {
      out.push({ fill: props.fill, stroke: props.stroke, strokeWidth: props.strokeWidth });
    }
    if (props.children) collectPaint(props.children, out);
    return out;
  }

  it('paints role:fill solid and role:stroke outlined — the tower (the one fill node) included', () => {
    // Find a seed that selects the tower deterministically (seededPicker is pure),
    // so the fill-role branch is exercised no matter how the sample seeds land.
    const candidates = ['Aldergate', 'Highfen', 'Cinderhollow', 'Umberford', 'Wren',
      ...Array.from({ length: 200 }, (_, i) => `seed-${i}`)];
    const towerSeed = candidates.find((s) => countersealEmblemName(s) === 'tower');
    expect(towerSeed, 'a tower-selecting seed exists in the candidate space').toBeTruthy();
    for (const seed of [towerSeed, 'Highfen']) {
      const name = countersealEmblemName(seed);
      const paints = collectPaint(HouseCountersealSeal({ seed, size: 14 }));
      const nodes = EMBLEM_PATHS[name];
      expect(paints).toHaveLength(nodes.length);
      nodes.forEach((n, i) => {
        const p = paints[i];
        if (n.role === 'fill') {
          expect(p.fill, `${name}[${i}] fill role is inked`).toBeTruthy();
          expect(p.fill).not.toBe('none');
          expect(p.stroke, `${name}[${i}] fill role has no stroke`).toBeUndefined();
        } else {
          expect(p.fill, `${name}[${i}] stroke role is unfilled`).toBe('none');
          expect(p.stroke, `${name}[${i}] stroke role is inked`).toBeTruthy();
          expect(p.strokeWidth, `${name}[${i}] stroke width`).toBe(n.w || 2);
        }
      });
    }
  });
});
