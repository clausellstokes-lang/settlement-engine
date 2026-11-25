#!/usr/bin/env node
/**
 * WORDS-2 · E3 under RULING G9 (2): of the births whose stored pressure line is the cascade's grazing fall-through (or its
 * no-grazing twin), how many hold grazing in their own record: a grazing house on the live roster (`powerSiblings.js ::
 * GRAZING_HOUSE`'s words), the running pastoral chain (`economicState.foodSecurity.chains['Pastoral & livestock']`), or a
 * pasture, grazing or herds ground near the place (`config.nearbyResources`). Also V's twin "the most devout households…":
 * whether the record holds a religious house and the religion influence its branch reads. A MEASURE; changes nothing.
 * Usage: node e3-grazes.mjs [--tree=<dir>] <records dir> [...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const treeArg = process.argv.find((a) => a.startsWith('--tree='));
const TREE = treeArg ? treeArg.slice(7) : '/home/user/wt/base';
const { liveInstitutionNames } = await import(pathToFileURL(join(TREE, 'src/domain/facts/liveInstitutionNames.js')).href);
const GRAZING_HOUSE = /grazing|pasture|herd|shepherd|livestock|cattle|sheep|goat|ranch|dairy|stockyard|horse|stable|drover/i;
const GRAZING_GROUND = /grass|pasture|meadow|steppe|grazing|herds?\b/i;
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
for (const dir of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const c = {}; const none = []; const devout = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz')).sort()) {
    const { seed, size, record: s } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    const line = String(s?.powerStructure?.recentConflict ?? '');
    const fall = /grazing rights and water access|^A dispute over (?:rights on|water access)/.test(line);
    const names = liveInstitutionNames(s);
    const house = names.some((n) => GRAZING_HOUSE.test(n));
    const chain = s?.economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true;
    const ground = (Array.isArray(s?.config?.nearbyResources) ? s.config.nearbyResources : []).some((g) => GRAZING_GROUND.test(String(g)));
    if (fall) {
      const k = house || chain || ground ? `keeps (${[house && 'house', chain && 'pastoral chain', ground && 'ground'].filter(Boolean).join('+')})` : 'stores none';
      (c[k] ||= {})[size] = (c[k][size] || 0) + 1; if (k === 'stores none' && none.length < 6) none.push(seed);
    }
    if (/most devout households want a say/.test(line)) {
      const rel = names.some((n) => /temple|church|shrine|chapel|monaster|priest|abbey|cathedral/i.test(n));
      const k = rel ? 'a religious house stands' : 'NO religious house';
      (devout[k] ||= {})[size] = (devout[k][size] || 0) + 1;
    }
  }
  console.log(`== ${dir}: the grazing fall-through births (${SIZES.join('/')})`);
  for (const [k, v] of Object.entries(c).sort()) console.log(`  ${SIZES.map((z) => v[z] || 0).join('/')}  ${k}`);
  console.log(`  seeds that store none: ${none.join(' ')}`);
  console.log('-- the devout twin:'); for (const [k, v] of Object.entries(devout)) console.log(`  ${SIZES.map((z) => v[z] || 0).join('/')}  ${k}`);
}
