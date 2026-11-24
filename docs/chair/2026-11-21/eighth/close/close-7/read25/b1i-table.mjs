#!/usr/bin/env node
/**
 * READ-25 / B1(i)'S TABLE (CLOSE-7, chain two; RULING-R24 R24-B1(i)): THE JOIN. Reads the record lines `records.census.jsx`
 * wrote and, for every catalogue row of a house that lives on a thing the land gives (ROWS below, named by me from
 * `src/data/institutionalCatalog.js`), counts by terrain the places where it stands on the live roster though neither the
 * terrain, the route nor the place's native nearby resources give that thing (GIVES below: my reading of `TERRAIN_DATA`,
 * `getTerrainType`'s route map and `RESOURCE_DATA`). Prints a markdown table, and the hits as TSV to --hits=<file>.
 *   node b1i-table.mjs --records=<V.jsonl> [--tree=/home/user/wt/lit] [--hits=<out.tsv>] [--label=V]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const arg = (/** @type {string} */ n, /** @type {string} */ d = '') => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `=${d}`).split('=').slice(1).join('=');
const TREE = arg('tree', '/home/user/wt/lit');
const label = arg('label', 'V');
const { TERRAIN_DATA } = await import(pathToFileURL(join(TREE, 'src/data/geographyData.js')).href);
const { institutionalCatalog } = await import(pathToFileURL(join(TREE, 'src/data/institutionalCatalog.js')).href);

/** THE ROWS: catalogue name → the thing the land gives that the house lives on. */
export const ROWS = {
  'Fishing community': 'fish', "Fisher's landing": 'fish', Fishmonger: 'fish', 'Fish market': 'fish',
  "Woodcutter's camp": 'timber', 'Charcoal burner': 'timber', Sawmill: 'timber', 'Sawmill (commercial)': 'timber',
  "Hunter's lodge": 'game', "Furrier's district": 'game', Wildfowler: 'wildfowl',
  Mine: 'ore', 'Mine (open cast)': 'ore', Smelter: 'ore',
  'Stone quarry': 'stone', 'Salt works': 'salt', 'Peat cutter': 'peat', Potter: 'clay', Brickmaker: 'clay',
  'Docks/port facilities': 'harbour', "Harbour master's office": 'harbour', Shipyard: 'harbour', 'River boatyard': 'harbour',
  'River ferry': 'harbour', 'Barge and river transport company': 'harbour',
  Shepherd: 'pasture', 'Shepherd collective': 'pasture', 'Dairy farmer': 'pasture',
};
/** THE GIVES: thing → { terrains, routes, resources } that give it. */
export const GIVES = {
  fish: { terrains: ['coastal', 'riverside'], routes: ['port', 'river'], resources: ['fishing_grounds', 'river_fish'] },
  wildfowl: { terrains: ['riverside'], routes: ['river'], resources: ['marshlands'] },
  timber: { terrains: ['coastal', 'riverside', 'mountain', 'forest', 'hills'], routes: [], resources: ['managed_forest', 'shipbuilding_timber', 'mountain_timber'] },
  game: { terrains: ['coastal', 'forest', 'hills'], routes: [], resources: ['hunting_grounds'] },
  ore: { terrains: ['mountain', 'hills'], routes: [], resources: ['iron_deposits', 'precious_metals', 'gemstone_deposits'] },
  stone: { terrains: ['coastal', 'mountain', 'hills', 'desert'], routes: [], resources: ['stone_quarry'] },
  salt: { terrains: ['coastal', 'desert'], routes: ['port'], resources: ['salt_flats', 'desert_salt'] },
  peat: { terrains: ['riverside'], routes: [], resources: ['coal_deposits', 'marshlands'] },
  clay: { terrains: ['plains', 'riverside'], routes: ['river'], resources: ['river_clay'] },
  harbour: { terrains: ['coastal', 'riverside'], routes: ['port', 'river'], resources: ['deep_harbour'] },
  pasture: { terrains: ['plains', 'riverside', 'hills'], routes: [], resources: ['grazing_land', 'alpine_pasture', 'camel_herds'] },
};
const TERRAINS = Object.keys(TERRAIN_DATA);
/** the row's tags, from the catalogue (the first tier that holds it) */
const tagsOf = {};
for (const cats of Object.values(institutionalCatalog)) for (const rows of Object.values(cats)) for (const [n, r] of Object.entries(rows)) tagsOf[n] ||= r.tags || [];
/** the terrain half of getResourceMultiplier, replicated: the product of the terrain's modifiers that match the row by tag or name */
const terrainFactor = (/** @type {string} */ terrain, /** @type {string} */ name) => {
  let m = 1; const lower = name.toLowerCase();
  for (const mod of TERRAIN_DATA[terrain]?.institutionModifiers || []) {
    if ((mod.tags && mod.tags.some((t) => (tagsOf[name] || []).includes(t))) || (mod.name && lower.includes(mod.name.toLowerCase()))) m *= mod.modifier;
  }
  return m;
};

const recs = readFileSync(arg('records'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
/** @type {Record<string, Record<string, {stand:number, bare:number}>>} */ const t = {};
const places = Object.fromEntries(TERRAINS.map((x) => [x, 0]));
const hits = [];
let mismatch = 0;
for (const r of recs) {
  const terrain = r.terrainType; places[terrain] = (places[terrain] || 0) + 1;
  if (r.terrainType !== r.terrainByRoute) mismatch++;
  const live = new Map(); for (const i of r.roster) if (i.live && ROWS[i.name] && !live.has(i.name)) live.set(i.name, i.source);
  for (const [name, source] of live) {
    const thing = ROWS[name]; const g = GIVES[thing];
    const cell = ((t[name] ||= {})[terrain] ||= { stand: 0, bare: 0 }); cell.stand++;
    const byTerrain = g.terrains.includes(terrain); const byRoute = g.routes.includes(r.route); const byRes = r.nearby.filter((k) => g.resources.includes(k));
    if (!byTerrain && !byRoute && !byRes.length) {
      cell.bare++;
      hits.push([r.seed, r.size, terrain, r.route, name, thing, source, terrainFactor(terrain, name).toFixed(2), r.nearby.join(',')].join('\t'));
    }
  }
}
const lines = [`**${label}: ${recs.length} places** (by terrain: ${TERRAINS.map((x) => `${x} ${places[x] || 0}`).join(', ')}; config terrain differs from the route's terrain in ${mismatch}).`, '',
  `Each cell: places where the house stands and NOTHING gives its thing / places where it stands. Terrain factor = the terrain half of \`getResourceMultiplier\` for that row on that terrain (replicated).`, '',
  `| row | lives on | ${TERRAINS.join(' | ')} | bare, all |`, `|---|---|${TERRAINS.map(() => '---').join('|')}|---|`];
for (const name of Object.keys(ROWS)) {
  const c = t[name] || {}; const bare = Object.values(c).reduce((n, x) => n + x.bare, 0); const stand = Object.values(c).reduce((n, x) => n + x.stand, 0);
  lines.push(`| ${name} | ${ROWS[name]} | ${TERRAINS.map((x) => (c[x] ? `${c[x].bare ? `**${c[x].bare}**` : 0}/${c[x].stand}${c[x].bare ? ` ×${terrainFactor(x, name).toFixed(2)}` : ''}` : '·')).join(' | ')} | **${bare}**/${stand} |`);
}
const perTerrain = TERRAINS.map((x) => { const s = new Set(hits.filter((h) => h.split('\t')[2] === x).map((h) => h.split('\t')[0])); return `${x} ${s.size}`; });
lines.push('', `Places holding at least one bare house, by terrain: ${perTerrain.join(', ')}; all ${new Set(hits.map((h) => h.split('\t')[0])).size}.`);
console.log(lines.join('\n'));
if (arg('hits')) writeFileSync(arg('hits'), `seed\tsize\tterrain\troute\thouse\tlives on\tsource\tterrain factor\tnative nearby resources\n${hits.join('\n')}\n`);
