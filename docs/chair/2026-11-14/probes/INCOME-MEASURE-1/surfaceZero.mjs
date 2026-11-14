// INCOME-MEASURE-1: the claim of zero, counted on every surface. For each rendered town (render5.mjs), every section
// that prints a resource-row title whose trade has no house on the roster and whose good is not exported from the ground
// (falseLeft.mjs's rule, applied to the title wherever it prints). Usage: node surfaceZero.mjs <renderDir> [label]
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir, label = ''] = process.argv.slice(2);
const HOUSE = { iron: /\bmines?\b|mining|smith|smelt|forge|foundr|metal|armou?r|weapon/, stone: /quarr|mason|stonecut/, timber: /woodcut|lumber|sawmill|logging|forester/, fish: /fish/ };
const RULE = {
  'Iron & Metalwork': { house: HOUSE.iron, trade: true }, 'Stone Quarrying': { house: HOUSE.stone, trade: true },
  'Timber Trade': { house: HOUSE.timber, keys: ['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber'], sold: /timber|lumber|plank/i },
  'Fish & Preserved Produce': { house: HOUSE.fish, keys: ['river_fish', 'fishing_grounds'], sold: /fish|herring|seafood/i },
  'Fish & Maritime Produce': { house: HOUSE.fish, keys: ['river_fish', 'fishing_grounds'], sold: /fish|herring|seafood/i },
  'Coal Sales': { house: HOUSE.iron, keys: ['coal_deposit'], sold: /^coal\b/i }, 'Salt Sales': { house: /salt/, keys: ['salt_flat', 'desert_salt'], sold: /salt/i },
  'Clay Sales': { house: /clay|potter|brick/, keys: ['river_clay', 'clay'], sold: /\bclay\b|potter/i }, 'Building Stone Sales': { house: HOUSE.stone, keys: ['stone_quarry'], sold: /stone|marble|granite/i },
};
const by = {}; const towns = new Set(); let n = 0; const sample = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.txt.gz'))) {
  const seed = f.slice(0, -7); const s = JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${seed}.json.gz`))); n++;
  const roster = s.institutions.map((i) => String(i.name).toLowerCase());
  const depl = s.config?.nearbyResourcesDepleted || []; const ground = (s.config?.nearbyResources || []).filter((r) => !depl.includes(r));
  const exp = (s.economicState.primaryExports || []).map(String);
  const falseTitles = Object.entries(RULE).filter(([, r]) => !roster.some((x) => r.house.test(x)) && (r.trade || !(ground.some((g) => r.keys.some((k) => g.startsWith(k))) && exp.some((x) => r.sold.test(x))))).map(([t]) => t);
  if (!falseTitles.length) continue;
  let cur = null;
  for (const line of zlib.gunzipSync(fs.readFileSync(`${dir}/${f}`)).toString().split('\n')) {
    const m = line.match(/^== (.+) ==$/); if (m) { cur = m[1]; continue; }
    for (const t of falseTitles) if (line.includes(t)) { const k = `${cur}|${t}`; by[k] = (by[k] || 0) + 1; towns.add(seed); if (sample.length < 3) sample.push(`${seed} ${cur}: ${line.trim().slice(0, 140)}`); }
  }
}
console.log(`${label} towns rendered ${n}; towns printing a false row title on any surface ${towns.size}; by surface|title ${JSON.stringify(by)}`);
for (const x of sample) console.log('  "' + x + '"');
