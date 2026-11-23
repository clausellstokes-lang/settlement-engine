#!/usr/bin/env node
/**
 * RUN (from /home/user/settlement-engine, through the mutex, to the out file, never through a pipe):
 *   sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/daily/measures/OFFICE/measure.office.mjs > docs/chair/2026-11-20/content/daily/measures/OFFICE/office.out.txt 2>&1
 *
 * DAILY-3 · OFFICE-M — measure first: five `office:` atoms on point 97's table of forms (brief: ../../briefs/U-OFFICE-MEASURE.md).
 * MEASURE ONLY: nothing is written to a record, to src/ or to tests/.
 * Births: M1's recipe (measures/M1/measure.m1.mjs, copied, not imported): 150 a size, six sizes, seeds hxd-<size>-0..149,
 *   loadGenerationLawPayloads(); generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} }).
 * Run twice, each in a child node with cwd = its worktree and no GIT_* variable in its environment:
 *   DARK = /home/user/wt-daily3-office (1ec3e81d1, point 97: the seat law dial at its default, law 1)
 *   LIT  = /home/user/wt-daily3-lit    (5c4419815: seatLaw.js :: NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION, so
 *          birthConfig mints `_seatLawVersion: 2`; read back off each record through seatLaw.js :: resolveSeatLawVersion).
 * THE CANDIDATE ATOM (what is measured; not built): the governing FORM is the governing row's name
 * (`rulingPower.js :: nameOf(governingFactionOf(record))`, the read `holderOfSeat.js :: holderOf` makes), its row read through
 * `seatTable.js :: formKindOf` (which strips the transfer's " Ascendant"), and the office key holds where the bare form is one
 * of the key's forms, each form a KEY of `SEAT_TABLE` in that row (asserted below). No name test on a label string.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOTS = { dark: '/home/user/wt-daily3-office', lit: '/home/user/wt-daily3-lit' };
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
/** key -> [row kind in SEAT_TABLE, forms] */
const OFFICE = {
  elders: ['government', ['Elder Council', 'Free Elder Council', 'Elder Consensus', 'Household Council']],
  headman: ['government', ["Headman's Authority"]],
  mayor: ['government', ['Town Mayor']],
  reeve: ['government', ['Elected Reeve']],
  "lord's steward": ['noble', ['Feudal Stewardship']],
};
const KEYS = Object.keys(OFFICE);
const bare = (f) => String(f ?? '').trim().replace(/ Ascendant$/, '');

// ── CHILD: born in one worktree ────────────────────────────────────────────────────────────
if (process.argv[2] === 'child') {
  const L = process.argv[3];
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { toPublicSafe, publicVeiledRecordOf } = await import(`${L}/src/domain/display/publicSafe.js`);
  const { governingFactionOf, nameOf } = await import(`${L}/src/domain/rulingPower.js`);
  const T = await import(`${L}/src/domain/seat/seatTable.js`);
  const { holderOf } = await import(`${L}/src/domain/seat/holderOfSeat.js`);
  const { resolveSeatLawVersion } = await import(`${L}/src/domain/seat/seatLaw.js`);
  const { isVeiledPower } = await import(`${L}/src/domain/people/cardVeil.js`);
  const { rulerKindOf } = await import(`${L}/src/domain/facts/rulerKind.js`);
  await loadGenerationLawPayloads();
  // the five keys' forms are keys of the table, in the named row
  const tableCheck = KEYS.map((k) => {
    const [kind, forms] = OFFICE[k];
    const row = T.SEAT_TABLE[kind];
    return { key: k, kind, forms: forms.map((f) => ({ f, inRow: T.SEAT_BANDS.filter((b) => Object.hasOwn(row.bands[b], f)), formKindOf: T.formKindOf(f) })) };
  });
  const allForms = [...new Set(Object.values(T.SEAT_TABLE).flatMap((r) => [...(r.alt ? [r.alt] : []), ...T.SEAT_BANDS.flatMap((b) => Object.keys(r.bands[b]))]))];
  const formOf = (doc) => { const g = doc ? governingFactionOf(doc) : null; return g ? nameOf(g) : null; };
  const officeOf = (form) => {
    if (form === null) return KEYS.map(() => false);
    const kind = T.formKindOf(form);
    return KEYS.map((k) => kind === OFFICE[k][0] && OFFICE[k][1].includes(bare(form)));
  };
  const rows = [];
  const t0 = Date.now();
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    const rec = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const gov = governingFactionOf(rec);
    const form = formOf(rec);
    const pub = toPublicSafe(rec);
    const pubFull = toPublicSafe(rec, { full: true });
    const veiled = publicVeiledRecordOf(rec);
    const pForm = formOf(pub);
    let holder = null;
    try { holder = holderOf(rec, { audience: 'owner' }).holderName; } catch (e) { holder = `ERR ${e.message}`; }
    rows.push({
      seed, size, tier: rec.tier, law: resolveSeatLawVersion(rec),
      form, government: rec.powerStructure?.government ?? null, governingName: rec.powerStructure?.governingName ?? null,
      formKind: form === null ? null : T.formKindOf(form), band: T.seatBandOf(rec.tier),
      inBand: form === null ? null : (T.formKindOf(form) ? Object.hasOwn(T.seatRowOf(T.formKindOf(form)).bands[T.seatBandOf(rec.tier)], bare(form)) : null),
      govHidden: gov?.hidden === true, govVeiled: gov ? isVeiledPower(gov) : null, govCategory: gov?.category ?? null,
      rulerKind: rulerKindOf(rec), holder,
      own: officeOf(form), pub: officeOf(pForm), pubFull: officeOf(formOf(pubFull)), veiledRec: officeOf(formOf(veiled)),
      pForm, pGovernment: pub.powerStructure?.government ?? null, pGovRow: !!(pub && governingFactionOf(pub)),
    });
    if (i === N - 1) process.stderr.write(`  [${L}] ${size} done, ${rows.length} births, ${Math.round((Date.now() - t0) / 1000)}s\n`);
  }
  // the payload goes to a file the parent names (a piped stdout truncated it once at 146 kB)
  writeFileSync(process.argv[4], JSON.stringify({ tableCheck, allForms, secs: Math.round((Date.now() - t0) / 1000), rows }));
  process.exit(0);
}

// ── PARENT: run both, compare ──────────────────────────────────────────────────────────────
const SELF = fileURLToPath(import.meta.url);
const REL = 'docs/chair/2026-11-20/content/daily/measures/OFFICE';
console.log(`RE-RUN (from /home/user/settlement-engine): sh scripts/gate-mutex.sh --run -- node ${REL}/measure.office.mjs > ${REL}/office.out.txt 2>&1`);
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^GIT_/.test(k)));
const run = {};
for (const [side, root] of Object.entries(ROOTS)) {
  const head = execFileSync('git', ['-C', root, 'rev-parse', '--short=9', 'HEAD'], { env, encoding: 'utf8' }).trim();
  const file = resolve(mkdtempSync(resolve(tmpdir(), 'office-m-')), `${side}.json`);
  execFileSync(process.execPath, [SELF, 'child', root, file], { cwd: root, env, stdio: ['ignore', 'ignore', 'inherit'] });
  run[side] = { head, ...JSON.parse(readFileSync(file, 'utf8')) };
  console.log(`${side.toUpperCase()}: ${root} at ${head}: ${run[side].rows.length} births in ${run[side].secs}s; seat law on the records: ${[...new Set(run[side].rows.map((r) => r.law))].join(',')}`);
}
const D = run.dark.rows; const Lr = run.lit.rows;
const pct = (n, d) => `${((100 * n) / d).toFixed(1)}%`;
const bySize = (rows, s) => rows.filter((r) => r.size === s);

console.log('\n== 1. the five keys\' forms in the table (row, bands holding the form, formKindOf) ==');
for (const t of run.dark.tableCheck) console.log(`  ${t.key}: row ${t.kind}: ${t.forms.map((x) => `${x.f} [${x.inRow.join('/') || 'NOT IN ROW'}; formKindOf=${x.formKindOf}]`).join('; ')}`);
console.log(`  table forms (${run.dark.allForms.length}): ${run.dark.allForms.join(' | ')}`);
console.log(`  table identical dark/lit: ${JSON.stringify(run.dark.tableCheck) === JSON.stringify(run.lit.tableCheck) && JSON.stringify(run.dark.allForms) === JSON.stringify(run.lit.allForms)}`);

for (const [side, rows] of [['DARK', D], ['LIT', Lr]]) {
  console.log(`\n== 2. born governing forms by size, ${side} (form: count per ${SIZES.join('/')}) ==`);
  const forms = [...new Set(rows.map((r) => String(r.form)))].sort();
  for (const f of forms) console.log(`  ${f}: ${SIZES.map((s) => bySize(rows, s).filter((r) => String(r.form) === f).length).join('/')}`);
  const noForm = rows.filter((r) => r.form === null).length;
  const notInTable = rows.filter((r) => r.form !== null && r.formKind === null);
  const offBand = rows.filter((r) => r.inBand === false);
  const govDiff = rows.filter((r) => r.form !== r.government);
  console.log(`  no governing row: ${noForm}; form not a table key (formKindOf null): ${notInTable.length} ${[...new Set(notInTable.map((r) => r.form))].join(', ')}`);
  console.log(`  form in its row but not in its tier's band: ${offBand.length} ${[...new Set(offBand.map((r) => `${r.form}@${r.tier}`))].slice(0, 12).join(', ')}`);
  console.log(`  governing row name != powerStructure.government: ${govDiff.length} ${govDiff.slice(0, 3).map((r) => `${r.seed}: ${r.form} / ${r.government}`).join('; ')}`);
  console.log(`  governing row hidden: ${rows.filter((r) => r.govHidden).length}; veiled (hidden or criminal): ${rows.filter((r) => r.govVeiled).length}`);
}

console.log('\n== 3. share by size (DARK | LIT), the dark/lit disagreement per seed, the shared-read disagreements ==');
const litBySeed = new Map(Lr.map((r) => [r.seed, r]));
for (const [i, k] of KEYS.entries()) {
  const sh = (rows) => SIZES.map((s) => { const b = bySize(rows, s); return pct(b.filter((r) => r.own[i]).length, b.length); }).join(' ');
  const dis = D.filter((r) => r.own[i] !== litBySeed.get(r.seed).own[i]);
  const disSameForm = dis.filter((r) => r.form === litBySeed.get(r.seed).form).length;
  const ownNotPub = [...D, ...Lr].filter((r) => r.own[i] && !r.pub[i]).length;
  const pubNotOwn = [...D, ...Lr].filter((r) => !r.own[i] && r.pub[i]).length;
  const fullDis = [...D, ...Lr].filter((r) => r.own[i] !== r.pubFull[i]).length;
  const veilDis = [...D, ...Lr].filter((r) => r.own[i] !== r.veiledRec[i]).length;
  console.log(`  office: ${k}`);
  console.log(`    DARK ${sh(D)}`);
  console.log(`    LIT  ${sh(Lr)}`);
  console.log(`    dark/lit disagree: ${dis.length}/${D.length} (of them, with the same born form: ${disSameForm}) e.g. ${dis.slice(0, 3).map((r) => `${r.seed}: ${r.form} -> ${litBySeed.get(r.seed).form}`).join('; ') || '—'}`);
  console.log(`    shared read (toPublicSafe, both sides, 1800): owner true & shared false ${ownNotPub}; owner false & shared true ${pubNotOwn}; full-share disagree ${fullDis}; publicVeiledRecordOf disagree ${veilDis}`);
}
const formDiff = D.filter((r) => r.form !== litBySeed.get(r.seed).form);
const holderDiffSameForm = D.filter((r) => r.form === litBySeed.get(r.seed).form && r.holder !== litBySeed.get(r.seed).holder);
console.log(`\n  seeds whose born FORM differs dark vs lit: ${formDiff.length}/${D.length}; by size ${SIZES.map((s) => formDiff.filter((r) => r.size === s).length).join('/')}`);
for (const r of formDiff.slice(0, 8)) console.log(`    ${r.seed}: ${r.form} -> ${litBySeed.get(r.seed).form}`);
console.log(`  seeds with the SAME form whose HOLDER (holderOf, owner) differs dark vs lit: ${holderDiffSameForm.length} e.g. ${holderDiffSameForm.slice(0, 3).map((r) => `${r.seed}: ${r.form}: ${r.holder} -> ${litBySeed.get(r.seed).holder}`).join('; ') || '—'}`);

console.log('\n== 4. the shared document: the form, the row ==');
for (const [side, rows] of [['DARK', D], ['LIT', Lr]]) {
  const rowGone = rows.filter((r) => r.form !== null && !r.pGovRow).length;
  const formChanged = rows.filter((r) => r.form !== null && r.pGovRow && r.pForm !== r.form).length;
  const govStrGone = rows.filter((r) => r.government !== null && r.pGovernment === null).length;
  const govStrChanged = rows.filter((r) => r.government !== null && r.pGovernment !== null && r.pGovernment !== r.government).length;
  console.log(`  ${side}: governing row absent on the shared doc ${rowGone}; its name changed (mask/veil) ${formChanged}; powerStructure.government dropped ${govStrGone}, changed ${govStrChanged}`);
}

console.log('\n== 5. the adjacent forms (NOT in the five keys): their share, both sides, for the chair\'s wording ==');
for (const f of ['Foreign Stewardship', 'Feudal Appointee', 'Town Council', 'Priestly Guidance']) {
  console.log(`  ${f}: DARK ${SIZES.map((s) => bySize(D, s).filter((r) => bare(r.form) === f).length).join('/')} | LIT ${SIZES.map((s) => bySize(Lr, s).filter((r) => bare(r.form) === f).length).join('/')}`);
}
console.log('\n== 6. ruler kind (rulerKindOf, the label regex) against the candidate office, DARK+LIT ==');
for (const [i, k] of KEYS.entries()) {
  const m = new Map(); for (const r of [...D, ...Lr].filter((x) => x.own[i])) m.set(r.rulerKind, (m.get(r.rulerKind) || 0) + 1);
  console.log(`  ${k}: ${[...m].map(([a, b]) => `${a}=${b}`).join(', ') || '—'}`);
}

// ── first paint, by reading vite.config.js's own derivation (both worktrees) ─────────────
console.log('\n== 7. first paint (vite.config.js :: EAGER_FIRST_PAINT_MODULES, FIRSTPAINT2_LAZY_DOMAIN) ==');
for (const [side, root] of Object.entries(ROOTS)) {
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `
    const v = await import(${JSON.stringify(`${root}/vite.config.js`)});
    const has = (p) => [...v.EAGER_FIRST_PAINT_MODULES].some((m) => m.endsWith(p));
    const pin = (p) => v.FIRSTPAINT2_LAZY_DOMAIN.includes(p);
    const res = {};
    for (const p of ['/src/domain/seat/seatTable.js', '/src/domain/rulingPower.js', '/src/domain/facts/factVocabulary.js', '/src/domain/facts/factsOf.js', '/src/domain/seat/holderOfSeat.js', '/src/data/cultureOfficeTitles.js', '/src/domain/display/stateProse/stateProseKernel.js']) res[p] = { eager: has(p), pinnedLazy: pin(p) };
    process.stdout.write(JSON.stringify(res));
  `], { cwd: root, env, encoding: 'utf8', maxBuffer: 1 << 24 });
  const res = JSON.parse(out.slice(out.lastIndexOf('{"/src')));
  console.log(`  ${side}:`); for (const [p, x] of Object.entries(res)) console.log(`    ${p}: eager=${x.eager} pinned-lazy=${x.pinnedLazy}`);
}
console.log('\nDONE');
