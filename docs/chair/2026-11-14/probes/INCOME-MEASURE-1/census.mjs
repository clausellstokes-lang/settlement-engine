// INCOME-MEASURE-1 census: for each resource income ROW, what in the record bears it out, and where its title prints.
// Usage: node census.mjs <recordsDir> <out.ndjson> [--text]   (prints the table; writes one line per (town,row))
// --text reads <seed>.txt.gz (render5.mjs) and counts the surfaces that print the row's title.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [dir, out, flag] = process.argv.slice(2);
// The houses of each trade (roster name, case-insensitive): THE SAME WORDS candidate A gates on (patch A).
const FISH = { house: /fish/i, raw: ['fishing_grounds', 'river_fish'], chain: ['fish'], exp: /fish|herring/i };
export const TRADES = {
  'Iron & Metalwork': { house: /\bmine\b|mining|smith|smelt|forge|foundr|metal|armou?r|weapon/i,
    raw: ['iron_deposits', 'coal_deposits', 'precious_metals'], chain: ['ironOre', 'preciousMetals'], exp: /iron|\bore\b|metal|coal|steel|silver|gold/i },
  'Stone Quarrying': { house: /quarr|mason|stonecut/i, raw: ['stone_quarry'], chain: ['stone'], exp: /stone|quarr|marble|granite/i },
  'Timber Trade': { house: /woodcut|lumber|sawmill|logging|forester/i, near: /carpent|woodcarv|cooper/i,
    raw: ['managed_forest', 'mountain_timber', 'shipbuilding_timber', 'timber'], chain: ['timber', 'mountainTimber'], exp: /timber|lumber|\bwood|plank/i },
  'Fish & Preserved Produce': FISH, 'Fish & Maritime Produce': FISH,
};
const SURF = ['tab:economics', 'pdf', 'foundry', 'ai-layer-prompt', 'ai-grounding', 'world-export-player', 'world-export-dm'];
const rows = []; const tally = {};
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json.gz')).sort();
const has = (list, keys) => list.filter((r) => keys.some((k) => r === k || r.startsWith(k.replace(/s$/, ''))));
for (const f of files) {
  const s = JSON.parse(zlib.gunzipSync(fs.readFileSync(dir + '/' + f)));
  const seed = f.replace(/\.json\.gz$/, '');
  let sections = null;
  if (flag === '--text' && fs.existsSync(`${dir}/${seed}.txt.gz`)) {
    sections = {}; let cur = null;
    for (const line of zlib.gunzipSync(fs.readFileSync(`${dir}/${seed}.txt.gz`)).toString().split('\n')) {
      const m = line.match(/^== (.+) ==$/); if (m) { cur = m[1]; sections[cur] = []; continue; } if (cur) sections[cur].push(line);
    }
  }
  const roster = (s.institutions || []).map((i) => i.name);
  const near = s.config?.nearbyResources || []; const depl = s.config?.nearbyResourcesDepleted || [];
  const avail = s.resourceAnalysis?.availableResources || [];
  const eco = s.economicState || {};
  const ex = s.resourceAnalysis?.exploitation || {};
  const stage = {}; for (const [k, v] of [['unexploited', ex.unexploited], ['partial', ex.partiallyExploited], ['full', ex.fullyExploited]]) for (const c of v || []) stage[c.chainKey] = k;
  for (const inc of eco.incomeSources || []) {
    const T = TRADES[inc.source]; if (!T) continue;
    const houses = roster.filter((n) => T.house.test(n) && !/foundling/i.test(n));
    const nearHouses = T.near ? roster.filter((n) => T.near.test(n)) : [];
    const rawDepleted = has(depl, T.raw); const rawHere = has(near, T.raw).filter((x) => !depl.includes(x));
    const exports = (eco.primaryExports || []).map(String).filter((e) => T.exp.test(e));
    const stages = Object.entries(stage).filter(([k]) => T.chain.includes(k)).map(([k, v]) => `${k}:${v}`);
    const worked = stages.some((x) => /:(partial|full)$/.test(x));
    // the gate that made it (economicState.js): which record fact fired
    let trigger;
    if (inc.source === 'Stone Quarrying') trigger = rawHere.length ? 'stone_quarry' : rawDepleted.length ? 'stone_quarry depleted' : avail.includes('pottery') ? 'clay (pottery -> "stone")' : 'other';
    else if (/^Fish/.test(inc.source)) trigger = rawHere.length ? 'fish ground' : near.some((r) => /salt/.test(r)) ? 'salt ground' : roster.some((n) => /dock|port|fishmonger/i.test(n)) ? 'salt from a dock/port/fishmonger' : 'other';
    else if (inc.source === 'Iron & Metalwork') trigger = rawHere.length ? rawHere.join('+') : 'iron goods + smith';
    else trigger = rawHere.join('+') || 'other';
    if (/^Fish/.test(inc.source) && rawDepleted.length && !rawHere.length) trigger += ' (fish ground depleted)';
    const cls = houses.length ? 'house' : rawHere.length && exports.length ? 'raw+export' : rawHere.length ? 'raw only' : exports.length ? 'export only' : 'none';
    const prints = sections ? SURF.filter((k) => (sections[k] || []).some((l) => l.includes(inc.source))) : null;
    const r = { seed, tier: s.tier, stress: (s.config?.stressTypes || []).join('+'), source: inc.source, pct: inc.percentage, desc: inc.desc, cls, trigger, houses, nearHouses, rawHere, rawDepleted, exports, stages, worked, prints, nRows: eco.incomeSources.length, prosperity: eco.prosperity };
    rows.push(r);
    const t = (tally[inc.source] ||= { rows: 0, house: 0, 'raw+export': 0, 'raw only': 0, 'export only': 0, none: 0, worked: 0, near: 0, blank: 0, trig: {} });
    t.rows++; t[cls]++;
    if (cls !== 'house') { if (worked) t.worked++; if (nearHouses.length) t.near++; if (!inc.desc) t.blank++; t.trig[trigger] = (t.trig[trigger] || 0) + 1; }
  }
}
fs.writeFileSync(out, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
const towns = (pred) => new Set(rows.filter(pred).map((r) => r.seed)).size;
console.log(`births ${files.length}; towns with a row of the four trades and no house of it: ${towns((r) => r.cls !== 'house')}`);
console.log('title | rows | house | raw+export | raw only | export only | none | no-house: chain partial/full on Resources | no-house: a carpenter/cooper/woodcarver | no-house: line blank | no-house trigger');
for (const [k, t] of Object.entries(tally)) console.log(`${k} | ${t.rows} | ${t.house} | ${t['raw+export']} | ${t['raw only']} | ${t['export only']} | ${t.none} | ${t.worked} | ${t.near} | ${t.blank} | ${JSON.stringify(t.trig)}`);
if (flag === '--text') { const by = {}; for (const r of rows) if (r.cls !== 'house') for (const p of r.prints || []) by[p] = (by[p] || 0) + 1; console.log('no-house rows printing, by surface:', JSON.stringify(by)); }
