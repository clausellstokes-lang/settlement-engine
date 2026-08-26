#!/usr/bin/env node
/**
 * harness/laneDRESS2/scenarioCensus.mjs — ⭐⭐⭐ **THE SCENARIO ELEMENT-DIFF CENSUS (review I2).**
 *
 * ═══ WHAT IT CONVICTS, AND THE OUTSIDE EVIDENCE THAT IT IS REAL ═══
 * ODQ §696.4: a fresh reader with no knowledge of this programme looked at eighteen plates and
 * flagged four of them, unprompted, as *"the same underlying map… rendered four separate times"*.
 * Decoded, those four are `town`, `siege`, `plague`, `famine`. MEASURED at `6bc1a5051`, the four
 * plates share **ONE sha256** and `city`/`migration` share another: **the eighteen-leaf corpus was
 * FOURTEEN distinct drawings.** So the defect is a legibility failure with a reader behind it, and
 * every gestalt score this programme has taken was over a thinner corpus than its leaf count said.
 *
 * ═══ ⛔⛔ THE UNIT, AND WHY THE OBVIOUS FLOOR IS THE WRONG INSTRUMENT ═══
 * A "mark" is one (group id, subpath) pair — one figure the renderer laid down. Two plates of the
 * same site are directly comparable because the dress draws in WORLD units and the fit lives in
 * the viewBox: the frame moves the camera, never the marks.
 *
 * The charter offered *"the year-100 control ≈ 237"* as the calibration for a raw-count floor.
 * **MEASURED, that control is 16,779 — two orders of magnitude away — and no definition of an
 * element I can construct reproduces 237.** The figure appears in `DESIGN_SPINE_COMPLETION.md` and
 * NOWHERE else in the ledger, the instrument estate or the tree. More important than its
 * provenance is what the measurement shows about the instrument:
 *
 * ```
 *   year-100 vs year-018   (same site, 82 years apart)   diff 16,779   96.3 % of marks new
 *   town-2   vs town       (different seed, same tier)   diff 15,644   99.99 % of marks new
 *   siege    vs town       (the defect under repair)     diff     12
 * ```
 *
 * ⭐⭐ **A RAW-COUNT FLOOR MEASURES REDRAW, NOT LEGIBILITY.** Both 16,779-mark pairs above read as
 * the same kind of place to any reader; the twelve marks in the third row are the ONLY thing on
 * either sheet that says *this town is under siege*. A floor set anywhere near the control would
 * be satisfied by re-seeding — which changes nothing a scenario reader can use — and could not be
 * satisfied by the truth at all, since the whole §10 supply for a leaf is four to twelve marks.
 *
 * ═══ THE FLOOR THIS CENSUS SETS, AND ITS JUSTIFICATION (chair's, vetoable) ═══
 *   **CLAUSE A — CITED DIFFERENCE ≥ 4.** The difference is counted ONLY over the §10 groups, so
 *   a mark contributes only if it exists because the settlement is in a stated condition. That is
 *   what makes the floor ungameable: year-100's 16,779 marks contribute **zero**, because not one
 *   of them is a state expression. The number 4 is `migration`'s own delta — **the thinnest TRUE
 *   expression the corpus contains**. Setting the floor at the thinnest thing the world actually
 *   says convicts a leaf that expresses NOTHING while never convicting a leaf for having little
 *   to say. A floor above the world's own supply would only be reachable by inventing facts.
 *
 *   **CLAUSE B — NO SCENARIO LEAF MAY BE BYTE-IDENTICAL TO ITS BASE.** The base state, and the
 *   negative control that proves this census is not vacuous.
 *
 *   **CLAUSE C — EVERY EXPRESSED STRESSOR REACHES THE PAGE.** `stateMarks.expressed[]` names what
 *   the world said; the plate must carry ink for it. This is the clause that catches the silent
 *   half of the defect: a stressor derived, published, and then dropped by the renderer.
 *
 * ⚠ THE DENOMINATOR IS NAMED ON EVERY ROW: each plate's own total mark count.
 * ⚠ EVERY FIGURE BELONGS TO A NAMED PLATE. There is no corpus scalar in this file.
 *
 * Usage: node harness/laneDRESS2/scenarioCensus.mjs [--dir=<renderDir>] [--json=<p>]
 *        (with no --dir it renders the pairs it needs itself)
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { STATE_GROUPS } from '../../src/domain/townMap/fabric/partitionDress.js';

/** The scenario pairs this corpus contains: each leaf and the leaf it is a variant OF. */
export const SCENARIO_PAIRS = Object.freeze([
  Object.freeze({ leaf: 'siege', base: 'town', stressor: 'under_siege' }),
  Object.freeze({ leaf: 'plague', base: 'town', stressor: 'plague_onset' }),
  Object.freeze({ leaf: 'famine', base: 'town', stressor: 'famine' }),
  Object.freeze({ leaf: 'migration', base: 'city', stressor: 'monster_pressure' }),
]);

/** the floor, and the corpus fact that sets it — see the header */
export const CITED_FLOOR = 4;

/* ─────────────────────────── the mark multiset ─────────────────────────── */

/** one (group, subpath) pair per figure the renderer laid down */
export function marksOf(svg) {
  const m = new Map();
  let total = 0;
  const re = /<g id="([^"]+)">([\s\S]*?)<\/g>/g;
  let g;
  while ((g = re.exec(svg))) {
    const gid = g[1];
    const body = g[2];
    const pre = /\sd="([^"]*)"/g;
    let p;
    while ((p = pre.exec(body))) {
      for (const sp of p[1].split('M').filter(Boolean)) {
        const k = `${gid}|M${sp}`;
        m.set(k, (m.get(k) || 0) + 1);
        total++;
      }
    }
    if (/<rect /.test(body)) { const k = `${gid}|RECT`; m.set(k, (m.get(k) || 0) + 1); total++; }
  }
  return { marks: m, total };
}

/**
 * @param {string} aSvg the BASE plate's markup
 * @param {string} bSvg the SCENARIO plate's markup
 * @param {Set<string>|null} only restrict the difference to these group ids
 */
export function diffMarks(aSvg, bSvg, only = null) {
  const A = marksOf(aSvg);
  const B = marksOf(bSvg);
  const keep = (k) => !only || only.has(k.slice(0, k.indexOf('|')));
  let added = 0; let removed = 0;
  const per = {};
  const bump = (k, f, n) => {
    const gp = k.slice(0, k.indexOf('|'));
    per[gp] = per[gp] || { added: 0, removed: 0 };
    per[gp][f] += n;
  };
  for (const [k, n] of A.marks) {
    if (!keep(k)) continue;
    const bn = B.marks.get(k) || 0;
    if (n > bn) { removed += n - bn; bump(k, 'removed', n - bn); }
  }
  for (const [k, n] of B.marks) {
    if (!keep(k)) continue;
    const an = A.marks.get(k) || 0;
    if (n > an) { added += n - an; bump(k, 'added', n - an); }
  }
  return { added, removed, diff: added + removed, aMarks: A.total, bMarks: B.total, perGroup: per };
}

/**
 * ⭐ THE CENSUS. `plates` maps leaf key → `{svg, expressed}`; the caller owns the render so this
 * file can be driven from a test fixture, from a corpus directory, or from a live build without
 * three spellings of the same arithmetic.
 */
export function scenarioCensus(plates) {
  const only = new Set(STATE_GROUPS);
  const rows = [];
  for (const pair of SCENARIO_PAIRS) {
    const b = plates[pair.leaf];
    const a = plates[pair.base];
    if (!a || !b) continue;
    const all = diffMarks(a.svg, b.svg, null);
    const cited = diffMarks(a.svg, b.svg, only);
    /** CLAUSE C — every stressor the world expressed has ink on the plate */
    const expressed = (b.expressed || []);
    const baseExpressed = new Set(a.expressed || []);
    const owed = expressed.filter((k) => !baseExpressed.has(k));
    rows.push({
      leaf: pair.leaf,
      base: pair.base,
      marks: b.bMarks !== undefined ? b.bMarks : all.bMarks,
      /** A */ citedDiff: cited.diff,
      citedFloor: CITED_FLOOR,
      /** B */ identical: all.diff === 0,
      /** C */ expressedOwed: owed,
      inkForOwed: owed.length > 0 ? cited.added > 0 : true,
      rawDiff: all.diff,
      perGroup: cited.perGroup,
      pass: cited.diff >= CITED_FLOOR && all.diff !== 0 && (owed.length === 0 || cited.added > 0),
    });
  }
  const fails = rows.filter((r) => !r.pass);
  return {
    rows,
    ok: rows.length === SCENARIO_PAIRS.length && fails.length === 0,
    reason: `${rows.length - fails.length}/${rows.length} scenario leaf/leaves differ from their`
      + ` base by ≥ ${CITED_FLOOR} CITED mark(s)`
      + `${fails.length ? `; FAILING: ${fails.map((r) => `${r.leaf}:${r.citedDiff}`).join(', ')}` : ''}`
      + `; ${rows.map((r) => `${r.leaf} ${r.citedDiff}/${r.rawDiff}`).join(' · ')}`,
  };
}

/* ═══════════════════════════════════════ the runner ═══════════════════════════════════════ */

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

if (process.argv[1] && process.argv[1].endsWith('scenarioCensus.mjs')) {
  const dir = arg('dir', null);
  const plates = {};
  const need = [...new Set(SCENARIO_PAIRS.flatMap((p) => [p.leaf, p.base]))];
  if (dir) {
    const { readdirSync } = await import('node:fs');
    const files = readdirSync(dir).filter((f) => f.endsWith('.svg'));
    for (const key of need) {
      const hit = files.find((f) => f.split('-parchment')[0].replace(/-(thorp|hamlet|village|town|city|metropolis)$/, '') === key);
      if (!hit) throw new Error(`NO_PLATE ${key} in ${dir}`);
      plates[key] = { svg: readFileSync(join(dir, hit), 'utf8'), expressed: null };
    }
  } else {
    const { dressLeaf } = await import('../laneDRESS1/renderPage.mjs');
    for (const key of need) {
      const L = dressLeaf(key, 'parchment');
      plates[key] = { svg: L.svg, expressed: (L.fabric.stateMarks || {}).expressed || [] };
    }
  }
  const c = scenarioCensus(plates);
  for (const r of c.rows) {
    const gs = Object.entries(r.perGroup)
      .map(([g, v]) => `${g.replace('dress-', '')} +${v.added}/-${v.removed}`).join(' · ');
    console.log(`${r.leaf.padEnd(11)} vs ${r.base.padEnd(11)}`
      + ` CITED ${String(r.citedDiff).padStart(4)} (floor ${r.citedFloor})`
      + ` · raw ${String(r.rawDiff).padStart(6)} of ${r.marks} marks`
      + ` · owed ${JSON.stringify(r.expressedOwed)} · ${r.pass ? 'PASS' : 'FAIL'}`);
    if (gs) console.log(`            ${gs}`);
  }
  console.log(`SCENARIO_CENSUS ${c.ok ? 'GREEN' : 'RED'} — ${c.reason}`);
  const j = arg('json', '');
  if (j) writeFileSync(j, `${JSON.stringify(c, null, 2)}\n`);
  void mkdtempSync; void tmpdir;
  process.exit(c.ok ? 0 : 1);
}
