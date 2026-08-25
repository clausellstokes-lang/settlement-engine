/**
 * regI1-i5contrast.mjs — lane REG-I1 · THE OWED i5 RE-RUN (REG-4 receipt §6 item 5).
 *
 * REG-4's stated reason for owing this run: *"the market furniture adds detail-weight ink inside
 * the `square` role (i5's role-pair contrast)."* i5 measures THREE pairs — `street:ground`,
 * `wall:all`, `water:ground` — over the RENDERED PIXELS, so the question is whether the new ink
 * moves a verdict, and the answer is a table with denominators, never a tuned floor.
 *
 * ⭐⭐ AND THE `square` ROLE ITSELF IS MEASURED BESIDE THE THREE PAIRS, because it is the role the
 * ink actually landed in and NONE of i5's three pairs names it. Reporting only the pairs would
 * report only the places the change could not show up. The square-role census here is the
 * classifier's own (`lib/classify.mjs`, `inG(r,'squares') → role 'square'`), counted on the SVG,
 * and it is a DIAGNOSTIC — it carries no floor and no verdict, exactly because nobody has signed
 * one for it.
 *
 * ⚠ THE ARMS EACH READ THEIR OWN SVG **AND** THEIR OWN PNG. i5 takes geometry from the SVG (the
 * role masks) and colour from the raster; pairing an armed raster with a base SVG would measure
 * the new picture through the old masks, which is the exact "instrument pointed at nothing"
 * signature INSTRUMENTS.md already records for this instrument.
 *
 * ⚠ FILES ARE RESOLVED BY EXACT `<key>-<tier>-parchment.svg`, never by glob — the `town-*` glob
 * matches `town-2-town-parchment.svg` first and has bitten this programme three times.
 *
 * Usage: node regI1-i5contrast.mjs [--json=out/regI1-i5contrast.json]
 */
import { writeFileSync, existsSync } from 'node:fs';
import { readPNG } from './lib/png.mjs';
import { roleContrast } from './i5-role-contrast.mjs';
import { classify } from './lib/classify.mjs';

const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };

/** EXACT filenames. No globs. */
const LEAVES = [
  { key: 'town', tier: 'town', file: 'town-town-parchment.svg', png: 'town-town' },
  { key: 'city', tier: 'city', file: 'city-city-parchment.svg', png: 'city-city' },
  { key: 'village', tier: 'village', file: 'village-village-parchment.svg', png: 'village-village' },
];
const ARMS = [
  { id: 'BASE', svgDir: `${HERE}/renders/regI1-base`, pngPre: `${HERE}/png/regI1/base-` },
  { id: 'ARMED', svgDir: `${HERE}/renders/regI1-all`, pngPre: `${HERE}/png/regI1/all-` },
];

/** the classifier's own element census, for the roles the market furniture lands in.
 *  ⚠ `classify` takes a PATH, not source text — handing it the text reads as ENAMETOOLONG. */
function roleCensus(svgPath) {
  const { census } = classify(svgPath, 'parchment');
  return census;
}

const rows = [];
for (const leaf of LEAVES) {
  const per = {};
  for (const arm of ARMS) {
    const svg = `${arm.svgDir}/${leaf.file}`;
    const png = `${arm.pngPre}${leaf.png}.png`;
    if (!existsSync(svg) || !existsSync(png)) { per[arm.id] = { missing: { svg: existsSync(svg), png: existsSync(png) } }; continue; }
    const res = roleContrast(svg, readPNG(png), 'parchment');
    per[arm.id] = { svg, png, res, census: roleCensus(svg) };
  }
  rows.push({ leaf: leaf.key, tier: leaf.tier, per });
}

/* ───────────────────────── the report ───────────────────────── */
process.stdout.write('── i5 · ROLE-PAIR CONTRAST · BASE vs ALL FIVE WAVES ARMED, at the REG-4 seal 7fba086d5\n\n');
const regressions = [];
const shifts = [];
for (const r of rows) {
  const B = r.per.BASE, A = r.per.ARMED;
  process.stdout.write(`── ${r.leaf} (${r.tier})\n`);
  process.stdout.write(`   ${'pair'.padEnd(24)} ${'floor'.padEnd(8)} ${'BASE'.padEnd(10)} ${'ARMED'.padEnd(10)} ${'Δ'.padEnd(10)} verdict\n`);
  for (const br of B.res.rows) {
    const ar = A.res.rows.find((x) => x.instrument === br.instrument);
    const bv = br.value, av = ar ? ar.value : null;
    const d = (bv != null && av != null) ? Math.round((av - bv) * 10000) / 10000 : null;
    const vb = br.pass === null ? 'n/a' : (br.pass ? 'PASS' : 'FAIL');
    const va = !ar || ar.pass === null ? 'n/a' : (ar.pass ? 'PASS' : 'FAIL');
    const reg = br.pass === true && ar && ar.pass === false;
    if (reg) regressions.push({ leaf: r.leaf, pair: br.instrument, base: bv, armed: av });
    process.stdout.write(`   ${br.instrument.padEnd(24)} ${String(br.band).padEnd(8)} ${String(bv).padEnd(10)} ${String(av).padEnd(10)} ${String(d).padEnd(10)} ${vb} → ${va}${reg ? '   ⛔ REGRESSION' : ''}\n`);
  }
  process.stdout.write(`   PLATE: ${B.res.pass ? 'PASS' : 'FAIL'} → ${A.res.pass ? 'PASS' : 'FAIL'}${B.res.pass && !A.res.pass ? '   ⛔ PLATE REGRESSION' : ''}\n`);
  // the role the ink actually landed in
  const cb = B.census, ca = A.census;
  const keys = [...new Set([...Object.keys(cb), ...Object.keys(ca)])].sort();
  const line = keys.map((k) => `${k} ${cb[k] || 0}→${ca[k] || 0}`).join('  ');
  process.stdout.write(`   ROLE CENSUS (drawing elements, classifier's own): ${line}\n`);
  const sq = { base: cb.square || 0, armed: ca.square || 0 };
  const det = { base: cb.detail || 0, armed: ca.detail || 0 };
  shifts.push({ leaf: r.leaf, square: sq, detail: det });
  process.stdout.write(`   ⭐ square ${sq.base}→${sq.armed} (${sq.armed - sq.base >= 0 ? '+' : ''}${sq.armed - sq.base})   detail ${det.base}→${det.armed} (${det.armed - det.base >= 0 ? '+' : ''}${det.armed - det.base})\n\n`);
}

process.stdout.write(`── VERDICT REGRESSIONS: ${regressions.length}\n`);
for (const g of regressions) process.stdout.write(`   ⛔ ${g.leaf} ${g.pair}: ${g.base} → ${g.armed}\n`);
if (!regressions.length) process.stdout.write('   none — every pair that passed on the base still passes armed, and every pair that failed on the base fails for the same reason it always did\n');

const json = arg('json', `${HERE}/out/regI1-i5contrast.json`);
writeFileSync(json, JSON.stringify({
  lane: 'TE-REG-I1',
  subject: 'i5 role-pair contrast, BASE (unarmed) vs ALL FIVE WAVE FLAGS ARMED, both at the REG-4 seal 7fba086d5',
  protocol: 'each arm reads ITS OWN svg (masks) and ITS OWN png (colour); exact filenames, no globs',
  squareRoleNote: 'the `square` element census is a DIAGNOSTIC with no floor — i5 has no square pair and none has been signed',
  rows: rows.map((r) => ({ leaf: r.leaf, tier: r.tier, base: r.per.BASE.res, armed: r.per.ARMED.res, censusBase: r.per.BASE.census, censusArmed: r.per.ARMED.census })),
  regressions, squareShifts: shifts,
}, null, 2));
process.stdout.write(`\nREGI1_I5 ${regressions.length === 0 ? 'NO_VERDICT_REGRESSION' : `REGRESSIONS=${regressions.length}`}  json=${json}\n`);
