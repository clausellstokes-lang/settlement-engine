// U5b-SENTENCES instrument: the merit's sentence, three DRAFT wordings, shown on six whole power pages (read-only).
//   node u5b-pages.mjs --tree <checkout> --out <PAGES.md>
// Births under law 2 by the fixture arm ({ ...birthConfig(cfg), _fortuneLawVersion: 2 } after loadGenerationLawPayloads()).
// Six places `meritsOf` credits: hxd-metropolis-73 on the chair's pool, and one each of thorp..city from the VISITOR pool
// (seeds visitor-<size>-<i>, i < 150, the first merited; an Endorsed merited one is preferred for at least one size).
// For each: every mount buildPrintProse gives the power tab (in its order, which is the PDF's: StateProse first,
// PowerStructure.jsx), then the governance paragraph (governanceAccountOf, primary stress as the screen and the PDF
// pass it), the draft inserted at the DS-POW-1 banner's reading position. The captured hall also on its shared page
// (the same render over toPublicSafe(record)). Each draft is computed on the owner's record, on toPublicSafe(record)
// and on applyVeil(toPublicSafe(record), WIDEST) and must be the same string on all three, else the run fails.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const L = resolve(arg('--tree') || '.');
const OUT = arg('--out');
if (!OUT) throw new Error('usage: node u5b-pages.mjs --tree <checkout> --out <PAGES.md>');

const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { buildPrintProse } = await import(`${L}/src/domain/display/stateProse/printProse.js`);
const { governanceAccountOf, governanceStressTypesOf } = await import(`${L}/src/domain/display/governanceAccount.js`);
const { resolvePrimaryStress } = await import(`${L}/src/generators/stressPriority.js`);
const { meritsOf, weatheredCatastrophe } = await import(`${L}/src/domain/fortune/fortuneMerits.js`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
const { CARD_KINDS, GROUPING_REMOVERS, applyVeil, isHideable } = await import(`${L}/src/domain/display/galleryVeil.js`);

/** The widest veil the registry admits (as tests/generators/fortuneLawMerits.test.js builds it). */
const WIDEST = [
  ...Object.keys(GROUPING_REMOVERS),
  ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((field) => `class:${kind}:${field}`)),
].filter((address) => isHideable(address));

// ── THE THREE DRAFT WORDINGS. Each reads: the place's `name`, the merit's event `name` (weatheredCatastrophe, the
// entry meritsOf counts), and that meritsOf counts it (its gates: law 2, base score >= Tolerated, no ruler-trouble
// tension, the event's severity / yearsAgo / templateType, the tensions' type, the legacy notes). No figure, no ruler.
const WORDINGS = {
  w1: (place, ev) => `${ev} hit ${place} within a generation; the place came through it, and its people accept the hall.`,
  w2: (place, ev) => `${place} came through ${ev} in living memory, and its people accept the seat today.`,
  w3: (place, ev) => `${place} came through ${ev} within a generation, and the hall's standing there is the better for it.`,
};
/** @returns {string|null} the wording on this record, or null where meritsOf counts no merit */
const draftOf = (w, record) => {
  if (!meritsOf(record).includes('weathered')) return null;
  const ev = weatheredCatastrophe(record);
  return ev && record?.name ? WORDINGS[w](String(record.name), String(ev.name)) : null;
};

await loadGenerationLawPayloads();
const born = (cfg, seed) => generateSettlementPipeline({ ...birthConfig(cfg), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });

const picks = [];
// (i) the captured hall on the chair's pool
const hall = born({ ...DEFAULT_CONFIG, settType: 'metropolis' }, 'hxd-metropolis-73');
const rung = hall.powerStructure?.criminalCaptureState;
if (!['corrupted', 'capture'].includes(String(rung)) || !meritsOf(hall).length) {
  console.log(`STOP: hxd-metropolis-73 born rung=${rung} merits=${JSON.stringify(meritsOf(hall))}`);
  process.exit(2);
}
picks.push({ pool: 'chair', size: 'metropolis', seed: 'hxd-metropolis-73', t: hall });
// (ii) the visitor pool, one each of thorp..city
let births = 1;
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city'];
const firstOf = {}; const firstEndorsedOf = {};
for (const size of SIZES) {
  for (let i = 0; i < 150; i++) {
    const seed = `visitor-${size}-${i}`;
    const t = born({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true }, seed); births += 1;
    if (!meritsOf(t).length) continue;
    if (!firstOf[size]) firstOf[size] = { pool: 'visitor', size, seed, t };
    if (t.powerStructure.publicLegitimacy.label === 'Endorsed') { firstEndorsedOf[size] = { pool: 'visitor', size, seed, t }; break; }
    // stop the size once its first merited is held and an Endorsed one is already held elsewhere
    if (Object.keys(firstEndorsedOf).length) break;
  }
}
const endorsedSize = SIZES.find((s) => firstEndorsedOf[s]);
for (const size of SIZES) {
  const pick = size === endorsedSize ? firstEndorsedOf[size] : firstOf[size];
  if (pick) picks.push(pick);
  else console.log(`no merited ${size} in i < 150`);
}

const lines = [];
const failures = [];
const pageOf = (record, w, label) => {
  const print = buildPrintProse(record);
  const power = print.power || {};
  const out = [];
  const draft = draftOf(w, record);
  out.push('`power.legitimacyBanner` (DS-POW-1; glance rung: the band word only, no sentence)'
    + (power['power.legitimacyBanner'] ? `: ${power['power.legitimacyBanner']}` : ': [prints no sentence]'));
  out.push(`**[DRAFT ${w}]** ${draft ?? '[NO DRAFT: meritsOf counts none on this record]'}`);
  for (const [mount, text] of Object.entries(power)) {
    if (mount === 'power.legitimacyBanner') continue;
    out.push(`\`${mount}\`: ${text}`);
  }
  const acct = governanceAccountOf(record, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(record)) });
  out.push(`\`power.governance\` (governanceAccountOf; screen and PDF): ${acct?.text ?? '[none]'}`);
  return { draft, out, label };
};

lines.push('# U5b PAGES: the merit\'s sentence on six whole power pages (DRAFT; FORTUNE U5b-SENTENCES; written by `instruments/u5b-pages.mjs`)');
lines.push('');
lines.push('Law 2 by the fixture arm (`{ ...birthConfig(cfg), _fortuneLawVersion: 2 }`, `customContent: {}`). Order of each page = the PDF\'s:');
lines.push('`StateProse tab="power"` (every mount `buildPrintProse` gives the power tab, in its order), then `power.governance`');
lines.push('(`src/pdf/sections/PowerStructure.jsx`). The DS-POW-1 banner mount is a GLANCE rung (`dossierMounts.js`), so it prints no');
lines.push('sentence on screen or in print today; the draft sits at its reading position, the head of the page. Every draft below was');
lines.push('computed three times (the owner\'s record, `toPublicSafe(record)`, and that under the widest veil) and was the same string.');
lines.push('');
const W = ['w1', 'w2', 'w3'];
picks.forEach((p, k) => {
  const w = W[k % 3];
  const t = p.t;
  const ev = weatheredCatastrophe(t);
  const leg = t.powerStructure.publicLegitimacy;
  const shared = toPublicSafe(t);
  const veiled = applyVeil(toPublicSafe(t), WIDEST);
  const own = draftOf(w, t);
  for (const [where, rec] of [['shared', shared], ['widest', veiled]]) {
    const d = draftOf(w, rec);
    if (d !== own) failures.push(`${p.seed} ${w} ${where}: ${JSON.stringify(d)} != ${JSON.stringify(own)}`);
  }
  for (const v of W) if (draftOf(v, shared) !== draftOf(v, t) || draftOf(v, veiled) !== draftOf(v, t)) failures.push(`${p.seed} ${v} differs on a shared read`);
  lines.push(`## ${k + 1}. ${t.name}`);
  lines.push('');
  lines.push(`seed \`${p.seed}\` (${p.pool} pool) · size ${p.size} · band ${leg.label} · score ${leg.score} (merits +${leg.breakdown?.merits ?? 0}) · merit event "${ev?.name}", ${ev?.yearsAgo} years ago (${ev?.templateType}, ${ev?.severity}) · capture rung ${JSON.stringify(t.powerStructure.criminalCaptureState ?? null)}`);
  lines.push('');
  for (const l of pageOf(t, w).out) lines.push(`- ${l}`);
  lines.push('');
  if (p.seed === 'hxd-metropolis-73') {
    lines.push(`### ${k + 1}s. ${t.name}: its SHARED page (the same render over \`toPublicSafe(record)\`; no \`_seed\` rides, so the desks draw on another seed)`);
    lines.push('');
    lines.push(`shared read: band ${shared.powerStructure?.publicLegitimacy?.label} · score ${shared.powerStructure?.publicLegitimacy?.score} · capture rung on the shared record ${JSON.stringify(shared.powerStructure?.criminalCaptureState ?? null)} · widest veil hides the power tab: ${Array.isArray(veiled.galleryVeil?.hidden) && veiled.galleryVeil.hidden.some((a) => String(a).startsWith('tab:power'))}`);
    lines.push('');
    for (const l of pageOf(shared, w).out) lines.push(`- ${l}`);
    lines.push('');
  }
});
lines.push(`Births: ${births}. Failures (a draft that differs on a shared read): ${failures.length}.`);
writeFileSync(OUT, `${lines.join('\n')}\n`);
console.log(`births ${births}; pages ${picks.length}; endorsed-size ${endorsedSize ?? 'none'}; failures ${failures.length}`);
for (const f of failures) console.log(`FAIL ${f}`);
process.exit(failures.length ? 1 : 0);
