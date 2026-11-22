// PEOPLE-2 builder B2b, resumed by PEOPLE-3 builder B2 (2026-11-22): THE REPEAT INSIDE ONE PLACE (the chair's order of 20:44
// UTC: "a sentence still repeated inside one place", one of the owner's three stop conditions). Counts only.
//
// The births go through the REAL pipeline of the tree named (no projection): 150 places a size, seeds hxd-<size>-0..149,
// born as the chair's instrument births them (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }),
// null, { seed, customContent: {} }) after loadGenerationLawPayloads()), the place's own names masked to '#', digits to '0'.
//
// THE UNIT: every sentence of every power's printed description (opening, standing codas, stress tails: the whole
// description, split at sentence ends) is owned by its power; every relation narrative, counted whole, is owned by its
// row's pair. A place REPEATS where one masked sentence has two or more owners there. It prints, by size, the places that
// repeat; and over the 900 places the ten commonest repeated sentences (by the places they repeat in), each with its source
// (`path :: symbol`, found by the sentence's own words in the tree's src/).
//
// Usage: node b2b-repeats.mjs <checkout> [n per size = 150]   (prints count lines only)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { maskerOf, pct, SIZES, sentencesOf } from './m6-common.mjs';

const [, , L, nArg = '150'] = process.argv;
if (!L) throw new Error('usage: node b2b-repeats.mjs <checkout> [n]');
const N = +nArg;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
await loadGenerationLawPayloads();

/** every source file of the tree, read once */
const SOURCES = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(js|jsx|mjs)$/.test(name)) SOURCES.push({ path: p.slice(L.length + 1), text: readFileSync(p, 'utf8') });
  }
};
walk(join(L, 'src'));
const DECL = /^\s*(?:export\s+)?(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/;
/** @param {string} sentence a masked sentence @returns {string} its source, by its longest unmasked run of words */
function sourceOf(sentence) {
  const runs = sentence.split('#').map((x) => x.trim()).filter((x) => x.length >= 16).sort((a, b) => b.length - a.length);
  for (const run of runs) {
    for (const probe of [run, run.slice(0, 40), run.slice(-40)]) {
      for (const src of SOURCES) {
        const at = src.text.indexOf(probe);
        if (at < 0) continue;
        const lines = src.text.slice(0, at).split('\n');
        const own = (lines[lines.length - 1] + src.text.slice(at).split('\n')[0]).match(/\bid: '([^']+)'/);
        let symbol = '';
        for (let k = lines.length - 1; k >= 0 && !symbol; k--) symbol = lines[k].match(DECL)?.[1] || '';
        return `${src.path} :: ${symbol || '(top level)'}${own ? ` (${own[1]})` : ''}`;
      }
    }
  }
  return '(source not found by its words)';
}

const repeatPlaces = new Map(); // masked sentence -> Set of place ids
console.log(`tree ${L.split('/').pop()} · ${N} places a size`);
for (const size of SIZES) {
  let places = 0;
  let pairs = 0;
  for (let i = 0; i < N; i++) {
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
    const names = new Set();
    const nm = (x) => {
      if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim());
    };
    nm(t.name);
    for (const p of t.npcs || []) {
      nm(p.name);
      for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) nm(w);
    }
    for (const f of t.powerStructure?.factions || []) {
      nm(f.name);
      nm(f.faction);
    }
    const mask = maskerOf(names);
    const owners = new Map(); // masked sentence -> Set of owners
    const own = (s, who) => {
      let st = owners.get(s);
      if (!st) {
        st = new Set();
        owners.set(s, st);
      }
      st.add(who);
    };
    for (const f of t.powerStructure?.factions || []) for (const s of sentencesOf(String(f.desc || ''))) own(mask(s), `power:${f.faction}`);
    for (const r of t.powerStructure?.factionRelationships || []) {
      if (typeof r.narrative === 'string' && r.narrative.trim()) own(mask(r.narrative.trim()), `pair:${[...(r.pair || [])].map(String).sort().join('||')}`);
    }
    let repeats = false;
    for (const [s, st] of owners) {
      if (st.size < 2) continue;
      repeats = true;
      pairs++;
      let pl = repeatPlaces.get(s);
      if (!pl) {
        pl = new Set();
        repeatPlaces.set(s, pl);
      }
      pl.add(`${size}-${i}`);
    }
    if (repeats) places++;
  }
  console.log(`REPEATS ${size}: places where two or more powers print one sentence ${places}/${N} ${pct(places, N)} · repeated sentences counted by place ${pairs}`);
}
const ten = [...repeatPlaces].sort((a, b) => b[1].size - a[1].size).slice(0, 10);
ten.forEach(([s, pl], k) => console.log(`TOP${k + 1} ${pl.size} places | ${s} | ${sourceOf(s)}`));
