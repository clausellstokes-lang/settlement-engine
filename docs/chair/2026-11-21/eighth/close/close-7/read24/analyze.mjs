// READ-24 (CLOSE-7 unit (1)): THE JOIN of the two sides, no birth. Reads the record side (measure.census.jsx's
// records.jsonl) and the page side (the sameness door's --text renders, <text>/<seed>.txt, web:* surfaces = the owner's
// page) and writes the table and one seed list a row beside this file.
// node analyze.mjs <records.jsonl> <textDir> <outDir>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [REC, TEXT, OUT] = process.argv.slice(2);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const recs = readFileSync(REC, 'utf8').trim().split('\n').map((l) => JSON.parse(l));

/** the owner's page: every web:* surface's lines, joined; and the first screen (web:Summary/Overview). */
function pageOf(seed) {
  const t = readFileSync(join(TEXT, `${seed}.txt`), 'utf8');
  const secs = {}; let cur = null;
  for (const l of t.split('\n')) { const m = /^== (.*) ==$/.exec(l); if (m) { cur = m[1]; secs[cur] = []; continue; } if (cur) secs[cur].push(l); }
  const web = Object.entries(secs).filter(([k]) => k.startsWith('web:')).map(([, v]) => v.join('\n')).join('\n');
  const pdf = Object.entries(secs).filter(([k]) => !k.startsWith('web:')).map(([, v]) => v.join('\n')).join('\n');
  return { web, pdf, overview: (secs['web:Summary/Overview'] || []).join('\n'), daily: (secs['web:World/Daily Life'] || []).join('\n') };
}

const H7 = 'Anyone who falls ill here is nursed by family, for there is no healer to send for.';
const NO_HEALER = ['There is no healer here, and the sick are nursed at home.', 'Nobody here heals by trade, and a visitor who falls ill must make do.', H7,
  'A visitor who falls sick here will find no healer to call on.', 'Sickness is something people here deal with at home, as best they can.'];
// THE SICK-CARE SERVICES: of the `healing` bucket's names (serviceCategoryTables.js :: SERVICE_CATEGORY_MAP), those whose
// catalogue desc treats the sick or injured (the burial, rite, alms, bathing and counsel rows are `healing` by domain, not care)
const SICK_CARE = new Set(['Healing', 'Healing (nature)', 'Higher healing', 'Basic wound care', 'Medical care (basic)', 'Medical treatment',
  'Medical consultation', 'Surgery', 'Surgical procedures', 'Herbal remedies', 'Healing herbs', 'Herbal medicines', 'Herbalism and healing',
  'Fever and illness', 'Remove minor disease', 'Emergency treatment', 'Wound closing', 'Wound treatment', 'Specialist care',
  'Specialist physicians', 'Recovery wards', 'Long-term recovery', 'Quarantine', 'Antitoxins', 'Poison antidotes', 'Compound medicines',
  'Medicines and compounds', 'Specialist compounds', 'Birth assistance', 'Midwifery']);
const RICH = /is rich and behaves like it\. What would be a crisis elsewhere is an expense here\./;
const SHORT = /Portions are small, |less food to go round/;
const GUILD = /Guild and non-guild traders are fighting over who may sell what|Rival guilds fought over who may sell what/;

const rows = {}; const seeds = {}; const notes = [];
const hit = (row, r) => { (rows[row] ||= Object.fromEntries(SIZES.map((s) => [s, 0])))[r.size] += 1; (seeds[row] ||= []).push(r.seed); };
const zero = (row) => { rows[row] ||= Object.fromEntries(SIZES.map((s) => [s, 0])); seeds[row] ||= []; };
let controlBad = []; const healNames = {}; const a2 = []; const b1i = []; const b1ii = []; const c1 = [];
for (const r of recs) {
  const p = pageOf(r.seed);
  // CONTROL: the first screen's head line "<name><size>· <pop> pop." against the direct record
  const m = /^(.*?)(thorp|hamlet|village|town|city|metropolis)· ([\d,]+) pop\./m.exec(p.overview);
  if (!m || m[1] !== r.name || Number(m[3].replace(/,/g, '')) !== r.population) controlBad.push(`${r.seed}: page ${m ? `${m[1]} ${m[3]}` : '(no head)'} vs record ${r.name} ${r.population}`);
  for (const k of ['A1 line (H7)', 'A1 any no-healer line', 'A1 resident healing-bucket entry', 'A1 resident sick-care service', 'A1 line + resident sick-care', 'A1 line + resident healing-bucket',
    'A2 rich + short food', 'B1(i) desert', 'B1(i) desert + Fish market', 'B1(i) desert + Sawmill', "B1(i) desert + Hunter's lodge", 'B1(i) desert + any of the three',
    'B1(ii) furrows + grain bought in', 'B1(ii) furrows', 'B1(ii) grain bought in', 'C1 owner page', 'C1 owner first screen', 'C1 owner sentence subject', 'C1 governing form Corrupt Council (record)',
    'C1 player projection: governing name', 'C1 player projection: publicProse text', 'C1 player projection: anywhere', 'D2 guild quarrel']) zero(k);
  // A1
  const line = p.web.includes(H7);
  const resBucket = r.healing.filter((e) => e.resident);
  const resCare = resBucket.filter((e) => SICK_CARE.has(e.name));
  if (line) hit('A1 line (H7)', r);
  if (NO_HEALER.some((x) => p.web.includes(x))) hit('A1 any no-healer line', r);
  if (resBucket.length) hit('A1 resident healing-bucket entry', r);
  if (resCare.length) hit('A1 resident sick-care service', r);
  if (line && resBucket.length) hit('A1 line + resident healing-bucket', r);
  if (line && resCare.length) { hit('A1 line + resident sick-care', r); for (const e of resCare) healNames[`${e.name} @ ${e.institution}`] = (healNames[`${e.name} @ ${e.institution}`] || 0) + 1;
    notes.push(`A1 ${r.seed}: sickHouse=${r.sickHouse} healerCount=${r.healerCount} careCount=${r.careCount} healingBand=${r.healingBand} ratio=${r.healingRatio} resident care=${resCare.map((e) => `${e.name}@${e.institution}`).join('; ')}`); }
  // A2
  if (RICH.test(p.web) && SHORT.test(p.web)) { hit('A2 rich + short food', r);
    a2.push(`${r.seed}\tprosperity=${r.prosperity}\tfoodBand=${r.foodBand}\tfoodRatio=${r.foodRatio}\tfoodSecurity=${r.foodSecurity.label}\tdeficitPct=${r.foodSecurity.deficitPct}\tsurplusPct=${r.foodSecurity.surplusPct}`); }
  // B1(i)
  if (r.terrainType === 'desert') {
    hit('B1(i) desert', r);
    const k = { fish: r.fish.some((h) => h.live), sawmill: r.sawmill.some((h) => h.live), hunter: r.hunter.some((h) => h.live) };
    if (k.fish) hit('B1(i) desert + Fish market', r);
    if (k.sawmill) hit('B1(i) desert + Sawmill', r);
    if (k.hunter) hit("B1(i) desert + Hunter's lodge", r);
    if (k.fish || k.sawmill || k.hunter) { hit('B1(i) desert + any of the three', r); b1i.push(`${r.seed}\t${[...r.fish, ...r.sawmill, ...r.hunter].filter((h) => h.live).map((h) => `${h.name} [source ${h.source}]`).join('; ')}\tpage terrain line ${/^Desert\/Arid$/m.test(p.overview) ? 'Desert/Arid' : '?'}`); }
  }
  // B1(ii)
  const furrows = p.web.includes('blesses the furrows'); const bought = p.web.includes('The grain is bought in, not grown here');
  if (furrows) hit('B1(ii) furrows', r);
  if (bought) hit('B1(ii) grain bought in', r);
  if (furrows && bought) { hit('B1(ii) furrows + grain bought in', r); b1ii.push(`${r.seed}\tterrain=${r.terrainType}\tgrainImported=${r.grainImported}\tgrainChain=${r.grainChain}\tfarmland=${r.farmland}`); }
  // C1
  const first = /Governed by Corrupt Council\b/.test(p.overview);
  const subj = /(^|[.!?]\s+|\n)The Corrupt Council\b|Corrupt Council vs\b/.test(p.web);
  if (r.govs.includes('Corrupt Council')) hit('C1 governing form Corrupt Council (record)', r);
  if (first) hit('C1 owner first screen', r);
  if (subj) hit('C1 owner sentence subject', r);
  if (first && subj) { hit('C1 owner page', r);
    c1.push(`${r.seed}\tgov=${r.govs.join('|')}\tplayer gov=${(r.pub.gov || []).join('|')}\tplayer prose has it=${r.pub.proseCorrupt}\tplayer anywhere=${r.pub.anyCorrupt}\tpub error=${r.pub.error}`);
    if ((r.pub.gov || []).includes('Corrupt Council')) hit('C1 player projection: governing name', r);
    if (r.pub.proseCorrupt) hit('C1 player projection: publicProse text', r);
    if (r.pub.anyCorrupt) hit('C1 player projection: anywhere', r); }
  // D2
  if (GUILD.test(p.web)) hit('D2 guild quarrel', r);
}
const tot = (row) => SIZES.reduce((a, s) => a + rows[row][s], 0);
const table = ['row\t' + SIZES.join('\t') + '\tall 900', ...Object.keys(rows).map((k) => `${k}\t${SIZES.map((s) => rows[k][s]).join('\t')}\t${tot(k)}`)].join('\n');
writeFileSync(join(OUT, 'table.tsv'), table + '\n');
for (const [k, v] of Object.entries(seeds)) writeFileSync(join(OUT, `seeds-${k.replace(/[^A-Za-z0-9]+/g, '_').replace(/_+$/, '')}.txt`), v.join('\n') + (v.length ? '\n' : ''));
writeFileSync(join(OUT, 'a1-hits.txt'), notes.join('\n') + '\n');
writeFileSync(join(OUT, 'a1-resident-sick-care-on-hits.txt'), Object.entries(healNames).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}\t${k}`).join('\n') + '\n');
writeFileSync(join(OUT, 'a2-hits.tsv'), a2.join('\n') + '\n');
writeFileSync(join(OUT, 'b1i-hits.tsv'), b1i.join('\n') + '\n');
writeFileSync(join(OUT, 'b1ii-hits.tsv'), b1ii.join('\n') + '\n');
writeFileSync(join(OUT, 'c1-hits.tsv'), c1.join('\n') + '\n');
writeFileSync(join(OUT, 'control.txt'), `control: ${recs.length} births; page head (name, population) differs from the direct record in ${controlBad.length}\n${controlBad.join('\n')}\n`);
console.log(table); console.log(`control mismatches: ${controlBad.length} of ${recs.length}`);
const towns = rows['D2 guild quarrel'];
console.log(`D2 share: town ${towns.town}/150 = ${(towns.town / 150).toFixed(3)}; city ${towns.city}/150 = ${(towns.city / 150).toFixed(3)}`);
