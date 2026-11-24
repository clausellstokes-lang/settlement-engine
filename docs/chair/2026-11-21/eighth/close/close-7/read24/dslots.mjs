// READ-24 item D (NO NEW TOOL: this only looks up). Finds, in the sameness door's own rendered rows of the 900 lit
// births (<rows>/<seed>.json, masked lines [text, heading, testids, position]), the web positions that print each of
// FINDINGS.md's D1-D4 lines, and reads each slot `<surface> | <position>` out of the door's stored register
// (scripts/census/sameness-census.register.json of the lit tree) at hamlet, village and town.
// Beside each stored reading, the SAME slot's reading on the 900 lit births by the door's own measure
// (`scripts/sameness-census.mjs :: measureSlots`, `readSize`, imported read-only from the lit tree; nothing new is counted).
// node dslots.mjs <runDir> <register.json> <out.tsv>   (runDir holds rows/)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const { measureSlots, readSize } = await import(process.env.READ24_DOOR || '/home/user/wt/lit/scripts/sameness-census.mjs');

const [RUN, REG, OUT] = process.argv.slice(2);
const ROWS = join(RUN, 'rows');
const D = [
  ['D1', "is somebody's house, and so is the second"],
  ['D1', "becomes part of the settlement at a point you can't precisely identify"],
  ['D1', 'A buyer short of coin leaves with his goods anyway'],
  ['D2', 'Guild and non-guild traders are fighting over who may sell what'],
  ['D2', 'Rival guilds fought over who may sell what'],
  ['D2', 'The old defend tradition while the young press for change'],
  ['D2', "Fire is the settlement's standing fear"],
  ['D3', 'Sited on a route already worn deep before anyone built here'],
  ['D3', 'It stands roadside, where the day is measured in traffic'],
  ['D4', 'reads to outsiders as ordinary'],
  ['D4', 'Everyone keeps within call of the houses in the first hours'],
  ['D4', 'The everyday fare is a simple stew'],
  ['D4', 'People meet out on the common by day'],
  ['D4', 'is rich and behaves like it'],
  ['D4', 'Money keeps going into what # has built'],
  ['D4', 'The place eats well and can afford to'],
  ['D4', 'People resent how little is done about wrongdoing'],
  ['D4', 'Those who work magic here have more asked of them'],
  ['D4', 'Children are warned about taking sides'],
];
const reg = JSON.parse(readFileSync(REG, 'utf8')).rows;
/** slot -> { lines:Set, places:Set } */
const found = new Map();
for (const f of readdirSync(ROWS)) {
  const row = JSON.parse(readFileSync(join(ROWS, f), 'utf8'));
  for (const [surface, lines] of Object.entries(row.surfaces)) {
    if (!surface.startsWith('web:')) continue;
    for (const [text, , , pos] of lines) for (const [id, frag] of D) if (text.includes(frag)) {
      const key = `${surface} | ${pos}`; const g = found.get(key) || { ids: new Set(), frags: new Set(), places: 0 };
      g.ids.add(id); g.frags.add(frag); g.places += 1; found.set(key, g);
    }
  }
}
const SZ = ['hamlet', 'village', 'town'];
/** the lit reading: the door's measure over the 150 lit places of each size */
const lit = Object.fromEntries(SZ.map((s) => [s, measureSlots(readSize(RUN, s, 150))]));
const out = ['finding\tslot\tregistered\t' + SZ.map((s) => `${s} STORED: places/of distinct shareAll seen by meet ceiling`).join('\t') + '\t' + SZ.map((s) => `${s} LIT: places/of distinct perPlace topPlaces shareAll seen | top`).join('\t') + '\tregister top sentence\tthe 900 lit: lines found'];
for (const [key, g] of [...found.entries()].sort()) {
  const r = reg[key];
  out.push([[...g.ids].join(','), key, r ? 'yes' : 'NO ROW',
    ...SZ.map((s) => { const e = r?.sizes?.[s]; return e ? `${e.places}/${e.of} ${e.distinct} ${e.shareAll} ${e.seen} ${e.by} ${e.meet} ${e.ceiling}` : '-'; }),
    ...SZ.map((s) => { const m = lit[s].get(key); return m ? `${m.places}/${m.of} ${m.distinct} ${m.perPlace} ${m.topPlaces} ${m.shareAll} ${m.seen} | ${m.sentence.slice(0, 90)}` : '-'; }),
    r ? r.sentence : '-', `${g.places} line(s): ${[...g.frags].join(' | ')}`].join('\t'));
}
writeFileSync(OUT, out.join('\n') + '\n');
console.log(out.join('\n'));
