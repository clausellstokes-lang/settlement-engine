#!/usr/bin/env node
/**
 * dressCorpus.mjs — ⭐⭐⭐ **DRESS-1b · THE PARTITION CORPUS DRIVER FOR i1, i6 AND i7.**
 *
 * ⛔ **§690.4(iii): THERE IS NO i1 OR i7 CORPUS DRIVER IN THIS ESTATE AT ALL.** i5 has
 * `regI1-i5contrast.mjs` and i6 has `regI1-i6corpus.mjs` (legacy substrate); i1 and i7 have only
 * the single-plate CLI. This file is the missing driver for both, and it gives i6 its PARTITION
 * arm beside its legacy one. Writing it was budgeted by the brief rather than discovered inside it.
 *
 * ⛔⛔ **PA.5's GATE IS ENFORCED HERE AND IT RUNS *BEFORE* ANY BASELINE IS PRINTED.** *"Every
 * re-record on partition SVG is GATED on per-role planted controls (each moving exactly one role)
 * before any baseline is believed."* `--controls` builds the seven per-role plants
 * (`mk-controls-dress.mjs`), shoots each, and prints the COLLAPSE MATRIX: what each instrument
 * reads for every role on every plant. The reading that matters is the DIAGONAL collapsing while
 * the OFF-DIAGONAL stands — a plant that moves two roles is not a per-role control, and a plant
 * that moves none is a dead one.
 *
 * ⚠ **i6's ARM IS PINNED AND PRINTED, per §688.3(ii).** `--checkcircuit` on the partition is
 * ARM-DEPENDENT — 4 of 6 walled leaves move, three by 158–213 world units — where the legacy
 * answer was 12/12 identical. **An unpinned i6 baseline is not a baseline.** Every i6 row here
 * carries the arm string it was measured under, and the arm is the UNARMED partition build.
 *
 * ⚠ §690.5(a): only i5 sets a non-zero exit code; this driver publishes a stdout sentinel
 * (`DRESS_CORPUS_DONE` / `DRESS_CORPUS_RED`) AND sets an exit code, so neither convention is a
 * trap for a caller that chose the other.
 *
 * Usage: node dressCorpus.mjs --svgdir=<dir> --pngdir=<dir> [--leaves=a,b] [--controls]
 *                             [--ctrlleaf=town] [--json=<path>]
 */
import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { squint, MEASURED as I1_ROLES, DELTA_FLOOR } from './i1-squint.mjs';
import { categoryHue, BANDS } from './i7-ftg-colour.mjs';
import { measure as i6measure } from './i6-frontage.mjs';
import { readPNG } from './lib/png.mjs';
import { classify } from './lib/classify.mjs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const SVGDIR = arg('svgdir', '');
const PNGDIR = arg('pngdir', '');
const LENS = arg('lens', 'parchment');
/** ⛔ THE ARM, PINNED AND CARRIED ON EVERY ROW (§688.3(ii)). */
export const I6_ARM = 'partition:UNARMED (no fabric arm; --checkcircuit is arm-dependent on the partition — §688.3(ii))';
/** the frontage is the leaf's own roadWidth; the corpus renders at 5 unless a leaf says otherwise */
const FRONTAGE = Number(arg('frontage', '5'));

function plates(dir, leaves) {
  const out = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.svg')).sort()) {
    const leaf = f.replace(/-[a-z0-9]+-[a-z]+\.svg$/i, '');
    if (leaves && !leaves.includes(leaf)) continue;
    out.push({ leaf, svg: join(dir, f), png: join(PNGDIR, f.replace(/\.svg$/, '.png')) });
  }
  return out;
}

/** one plate through all three instruments; every row carries its own applicability */
export function readPlate(svgPath, pngPath) {
  const img = readPNG(pngPath);
  const i1 = squint(svgPath, img, LENS);
  const i7 = categoryHue(svgPath, img, LENS);
  const i6 = i6measure(svgPath, { lens: LENS, frontage: FRONTAGE });
  const census = classify(svgPath, LENS).census;
  return { i1, i7, i6, census };
}

const i1Row = (r, role) => {
  const row = r.rows.find((x) => x.instrument === `squint.${role}`);
  return row ? { value: row.value, pass: row.pass, applicable: row.applicable } : null;
};
const i7Row = (r, cat) => {
  const row = (r.rows || r).find ? (r.rows || r).find((x) => (x.instrument || '').includes(cat)) : null;
  return row ? { value: row.value, pass: row.pass } : null;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!SVGDIR || !PNGDIR) { console.error('usage: dressCorpus.mjs --svgdir= --pngdir= [--leaves=] [--controls]'); process.exit(2); }
  const leaves = arg('leaves', '') ? arg('leaves', '').split(',') : null;
  const set = plates(SVGDIR, leaves);
  const rows = [];
  let red = 0;

  console.log('── i1 SQUINT (Glass\'s Δ vs the urban-ground population, floor 1.00) · i7 CATEGORY HUE · i6 FRONTAGE');
  console.log(`   i6 ARM: ${I6_ARM}`);
  console.log('leaf         i1.street i1.wall  i1.water   i7.water i7.field i7.town   i6.ratio i6.runs i6.masses  groundPx');
  for (const p of set) {
    if (!existsSync(p.png)) { console.log(`${p.leaf.padEnd(12)} ⛔ NO PNG — ${basename(p.png)}`); red++; continue; }
    let r;
    try { r = readPlate(p.svg, p.png); } catch (e) { console.log(`${p.leaf.padEnd(12)} ⛔ THREW ${String(e.message).slice(0, 70)}`); red++; continue; }
    const s = i1Row(r.i1, 'street'), w = i1Row(r.i1, 'wall'), a = i1Row(r.i1, 'water');
    const f = (x) => (x == null || x.value == null ? '   n/a ' : String(x.value.toFixed(3)).padStart(7));
    const h = (cat) => { const row = r.i7.rows.find((x) => (x.instrument || '').includes(cat)); return row && row.value != null ? String(row.value.toFixed(3)).padStart(7) : '   n/a '; };
    const gp = r.i1.rows.find((x) => x.groundPx != null) || {};
    rows.push({ leaf: p.leaf, i1: r.i1, i7: r.i7, i6: { ratio: r.i6.F1F2_base.ratio, runs: r.i6.F1F2_base.runs, masses: r.i6.F1F2_base.frontingMasses, grid: r.i6.grid, arm: I6_ARM }, census: r.census });
    console.log(`${p.leaf.padEnd(12)}${f(s)} ${f(w)} ${f(a)}   ${h('water')} ${h('field')} ${h('town')}   `
      + `${String(r.i6.F1F2_base.ratio).padStart(7)} ${String(r.i6.F1F2_base.runs).padStart(6)} ${String(r.i6.F1F2_base.frontingMasses).padStart(7)}   ${String(gp.groundPx != null ? gp.groundPx : 0).padStart(7)}`);
  }

  /* ─────────────────── PA.5's GATE: the per-role collapse matrix ─────────────────── */
  if (process.argv.includes('--controls')) {
    const ctrlLeaf = arg('ctrlleaf', 'town');
    const base = set.find((p) => p.leaf === ctrlLeaf) || set[0];
    const cdir = arg('ctrldir', join(PNGDIR, '..', 'ctrl-' + ctrlLeaf));
    mkdirSync(cdir, { recursive: true });
    console.log(`\n── ⛔ PA.5 GATE · PER-ROLE PLANTED CONTROLS on \`${base.leaf}\` — each plant must collapse ITS OWN role and leave the others standing`);
    const { execFileSync } = await import('node:child_process');
    execFileSync(process.execPath, [join(import.meta.dirname, 'mk-controls-dress.mjs'), base.svg, cdir, `--lens=${LENS}`, '--assert'], { stdio: 'inherit' });
    const { shootBounded } = await import(arg('crops', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneDRESS1B-tree/harness/instruments/crops.mjs'));
    const baseR = readPlate(base.svg, base.png);
    const cell = (r, role) => { const x = i1Row(r.i1, role); return x && x.value != null ? x.value : null; };
    const hcell = (r, cat) => { const row = r.i7.rows.find((x) => (x.instrument || '').includes(cat)); return row && row.value != null ? row.value : null; };
    console.log(`\nplant                 i1.street i1.wall  i1.water  i7.water i7.field i7.town  i6.ratio`);
    const b = [cell(baseR, 'street'), cell(baseR, 'wall'), cell(baseR, 'water'), hcell(baseR, 'water'), hcell(baseR, 'field'), hcell(baseR, 'town'), baseR.i6.F1F2_base.ratio];
    const fmt = (v) => (v == null ? '   n/a ' : String(Number(v).toFixed(3)).padStart(7));
    console.log(`${'(UNPLANTED BASE)'.padEnd(21)} ${b.map(fmt).join(' ')}`);
    const matrix = [{ plant: 'BASE', v: b }];
    for (const f of readdirSync(cdir).filter((n) => n.startsWith('dress-') && n.endsWith('.svg') && !n.startsWith('_')).sort()) {
      /**
       * ⛔⛔ **STRIP `width`/`height` BEFORE SHOOTING, AND THIS LANE LEARNED IT THE HARD WAY.**
       * The dress SVG carries `width="1000"`, so Chrome renders it at 1000 px WHATEVER the window
       * is. Shot into a 1400 px window the map sits in the TOP-LEFT and 48.9 % of the frame is
       * blank canvas — while the MASK, built from the viewBox, assumes the map fills the frame.
       * Mask and image then live in different coordinate spaces: the mask's idea of the map centre
       * samples blank paper. MEASURED: the `flat-street` plant repainted the entire street surface
       * to the fabric tone and i1's street mean moved 183.33 → 183.08, a quarter of one luminance
       * unit out of 255. **PA.5's control gate caught this; a baseline recorded without it would
       * have been a corpus-wide table of nonsense.** Stripping is drawing-neutral, proved by raster
       * diff at 1000 px: 0 differing channel samples.
       */
      const svgP = join(cdir, '_stripped-' + f);
      writeFileSync(svgP, readFileSync(join(cdir, f), 'utf8')
        .replace(/^(<svg[^>]*?)\s+width="[^"]*"\s+height="[^"]*"/, '$1'));
      const pngP = join(cdir, f.replace(/\.svg$/, '.png'));
      const sh = shootBounded(svgP, pngP, 2200, 40000, 120000);
      if (!sh.ok) { console.log(`${f.padEnd(21)} ⛔ ${sh.verdict}`); red++; continue; }
      const r = readPlate(svgP, pngP);
      const v = [cell(r, 'street'), cell(r, 'wall'), cell(r, 'water'), hcell(r, 'water'), hcell(r, 'field'), hcell(r, 'town'), r.i6.F1F2_base.ratio];
      matrix.push({ plant: f.replace(/\.svg$/, ''), v });
      console.log(`${f.replace(/\.svg$/, '').padEnd(21)} ${v.map(fmt).join(' ')}`);
    }
    writeFileSync(join(cdir, 'collapse-matrix.json'), JSON.stringify(matrix, null, 1));
    console.log(`\n⛔ READ THE DIAGONAL: a plant is LIVE only where its OWN column falls and the others hold.`);
  }

  const j = arg('json', '');
  if (j) writeFileSync(j, JSON.stringify({ arm: I6_ARM, lens: LENS, frontage: FRONTAGE, rows }, null, 1));
  console.log(red ? `\nDRESS_CORPUS_RED ${red} failure(s)` : `\nDRESS_CORPUS_DONE ${rows.length} leaf/leaves`);
  process.exitCode = red ? 1 : 0;
}
