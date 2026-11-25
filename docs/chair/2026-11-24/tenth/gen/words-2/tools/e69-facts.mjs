#!/usr/bin/env node
/**
 * WORDS-2 · E6 and E9: TWO COUNTS OVER A RECORDS DUMP, on a tree (`--tree`, default /home/user/wt/base). Changes nothing.
 *  E6 (L12, "The lord's steward is obeyed, but not much liked."; its ruled shape, the chair's E107: `office: lord's steward`
 *     beside `sovereign` and the steward's own house): places where the office holds; with `sovereign`; with a live house
 *     whose native name is "Lord's steward"; and where the legitimacy grievance branch is open (the pool L12 sits in).
 *  E9 (DS-GEN-17): places whose key is GARRISONED (`generalStateProse.js :: institutionsPoolKey`) and `crisis: occupied`
 *     holds: both GARRISONED variants refuse it, so the line is empty; also every key's occupied count.
 * Usage: node e69-facts.mjs [--tree=<dir>] <records dir> [...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const treeArg = process.argv.find((a) => a.startsWith('--tree='));
const TREE = treeArg ? treeArg.slice(7) : '/home/user/wt/base';
const dirs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const imp = (p) => import(pathToFileURL(join(TREE, p)).href);
const { factsOf } = await imp('src/domain/facts/factsOf.js');
const { atomHolds } = await imp('src/domain/facts/factVocabulary.js');
const { liveInstitutionNames } = await imp('src/domain/facts/liveInstitutionNames.js');
const { institutionsPoolKey } = await imp('src/domain/display/stateProse/generalStateProse.js');
const { deriveCausalState } = await imp('src/domain/causalState.js');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const GRIEVANCE = ['critical', 'collapsed', 'strained', 'fragile', 'weak'];
const inc = (o, k, z) => { (o[k] ||= {})[z] = (o[k][z] || 0) + 1; };
for (const dir of dirs) {
  const e6 = {}; const e9 = {}; const seeds = {}; let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz')).sort()) {
    const { seed, size, record } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    n += 1;
    const fx = factsOf(record);
    if (atomHolds("office: lord's steward", fx)) {
      const sov = atomHolds('sovereign', fx) === true;
      const house = liveInstitutionNames(record).some((nm) => /\blord's steward\b/i.test(nm));
      const band = deriveCausalState(record)?.bands?.public_legitimacy;
      inc(e6, 'office holds', size);
      if (sov) inc(e6, '+ sovereign', size);
      if (sov && house) { inc(e6, "+ sovereign + a live Lord's steward house (E107's shape)", size); (seeds.e6 ||= []).length < 6 && seeds.e6.push(`${seed}:${band}`); }
      if (sov && !house) { inc(e6, "+ sovereign, NO steward's house (L12 would name a second officer)", size); (seeds.e6no ||= []).length < 6 && seeds.e6no.push(seed); }
      inc(e6, `legitimacy band ${band}${sov && house ? ' (E107 shape)' : ''}`, size);
    }
    const key = institutionsPoolKey(record?.economicState?.compound?.inst, record);
    const occ = atomHolds('crisis: occupied', fx) === true;
    if (occ) { inc(e9, `occupied, GEN-17 key ${key}`, size); if (key === 'GARRISONED') (seeds.e9 ||= []).length < 6 && seeds.e9.push(seed); }
    if (key === 'GARRISONED') inc(e9, 'GARRISONED (all)', size);
  }
  console.log(`== ${dir}: ${n} places (${SIZES.join('/')})`);
  console.log('-- E6:'); for (const [k, c] of Object.entries(e6).sort()) console.log(`  ${SIZES.map((z) => c[z] || 0).join('/')}  ${k}`);
  console.log(`   seeds (E107 shape, with the band): ${(seeds.e6 || []).join(' ')}; without the house: ${(seeds.e6no || []).join(' ')}`);
  console.log('-- E9:'); for (const [k, c] of Object.entries(e9).sort()) console.log(`  ${SIZES.map((z) => c[z] || 0).join('/')}  ${k}`);
  console.log(`   seeds (occupied, GARRISONED): ${(seeds.e9 || []).join(' ')}`);
}
