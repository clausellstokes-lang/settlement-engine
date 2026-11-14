// INCOME-MEASURE-1: the false resource rows a record holds, by one rule for every candidate.
// A row is FALSE where its title names a trade no house of the town works and the good it names is not on the
// final export list from ground the town holds (not depleted):
//   Iron & Metalwork / Stone Quarrying with no house of the trade: false (the titles name the trade itself);
//   Timber Trade / Fish & … Produce with no house: false unless the good is exported from the ground;
//   "<Good> Sales" (B, D): false unless that good is exported from the ground.
// Usage: node falseLeft.mjs <recordsDir> [label]
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir, label = ''] = process.argv.slice(2);
const HOUSE = { iron: /\bmines?\b|mining|smith|smelt|forge|foundr|metal|armou?r|weapon/, stone: /quarr|mason|stonecut/, timber: /woodcut|lumber|sawmill|logging|forester/, fish: /fish/ };
const RULE = {
  'Iron & Metalwork': { house: HOUSE.iron, trade: true },
  'Stone Quarrying': { house: HOUSE.stone, trade: true },
  'Timber Trade': { house: HOUSE.timber, keys: ['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber'], sold: /timber|lumber|plank/i },
  'Fish & Preserved Produce': { house: HOUSE.fish, keys: ['river_fish', 'fishing_grounds'], sold: /fish|herring|seafood/i },
  'Fish & Maritime Produce': { house: HOUSE.fish, keys: ['river_fish', 'fishing_grounds'], sold: /fish|herring|seafood/i },
  'Iron Ore Sales': { house: HOUSE.iron, keys: ['iron_deposit'], sold: /\biron\b|\bore\b/i },
  'Coal Sales': { house: HOUSE.iron, keys: ['coal_deposit'], sold: /^coal\b/i },
  'Precious Metal Sales': { house: HOUSE.iron, keys: ['precious_metal'], sold: /silver|gold|precious/i },
  'Building Stone Sales': { house: HOUSE.stone, keys: ['stone_quarry'], sold: /stone|marble|granite/i },
  'Clay Sales': { house: /clay|potter|brick/, keys: ['river_clay', 'clay'], sold: /\bclay\b|potter/i },
  'Salt Sales': { house: /salt/, keys: ['salt_flat', 'desert_salt'], sold: /salt/i },
};
const by = {}; let towns = new Set(); let rowsAll = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json.gz'))) {
  const s = JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${f}`)));
  const roster = s.institutions.map((i) => String(i.name).toLowerCase());
  const depl = s.config?.nearbyResourcesDepleted || []; const ground = (s.config?.nearbyResources || []).filter((r) => !depl.includes(r));
  const exp = (s.economicState.primaryExports || []).map(String);
  for (const e of s.economicState.incomeSources) {
    const r = RULE[e.source]; if (!r) continue; rowsAll++;
    if (roster.some((n) => r.house.test(n))) continue;
    const sold = !r.trade && ground.some((g) => r.keys.some((k) => g.startsWith(k))) && exp.some((x) => r.sold.test(x));
    if (sold) continue;
    by[e.source] = (by[e.source] || 0) + 1; towns.add(f);
  }
}
const total = Object.values(by).reduce((a, b) => a + b, 0);
console.log(`${label} false rows ${total} in ${towns.size} towns (of ${rowsAll} resource rows): ${JSON.stringify(by)}`);
