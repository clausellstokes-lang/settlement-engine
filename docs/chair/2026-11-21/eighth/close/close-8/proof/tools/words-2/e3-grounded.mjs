#!/usr/bin/env node
/**
 * WORDS-2 · E3 under RULING G9 (2) and its STOP (2026-11-25): THE ORACLE, written apart from the cure. For every birth of a
 * records dump, the stored pressure line (`powerStructure.recentConflict`) is classed by the quarrel it names, if it is one
 * of the cascade's fall-through quarrels: GRAZING (the stock line, "grazing rights and water access"), MARSH, SHORE ("rights
 * on the marsh / the shore and access to water") or WATER ("a dispute over water access"). The record is read for what it
 * HOLDS, by this file's own words: grazing (a grazing house on the live roster, the running pastoral chain, a grass,
 * pasture, meadow, steppe, grazing or herds ground), a marsh ground, a shore ground (harbour, coast, shore, beach), water
 * (any of those, fishing, a river's fish, mills or clay, an oasis, springs, a floodplain or lake, a riverside or coastal
 * terrain, a river or port road). A VIOLATION is a fall-through quarrel whose subject the record does not hold. Also counts,
 * per size, the births that hold none of them (where the grounded rule stores no fall-through quarrel). A MEASURE.
 * Usage: node e3-grounded.mjs [--tree=<dir>] [--seeds] <records dir> [...]
 */
import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const treeArg = process.argv.find((a) => a.startsWith('--tree='));
const TREE = treeArg ? treeArg.slice(7) : '/home/user/wt/base';
const SEEDS = process.argv.includes('--seeds');
const { liveInstitutionNames } = await import(pathToFileURL(join(TREE, 'src/domain/facts/liveInstitutionNames.js')).href);
const HOUSE = /grazing|pasture|herd|shepherd|livestock|cattle|sheep|goat|ranch|dairy|stockyard|horse|stable|drover/i;
const GRASS = /grass|pasture|meadow|steppe|grazing|herds?\b/i;
const MARSH = /marsh/i;
const SHORE = /harbour|coast|shore|beach/i;
const WET = /marsh|harbour|coast|shore|beach|fish|river|oasis|spring|floodplain|lake/i;
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @param {string} line */
const kindOf = (line) => (/grazing rights and water access/.test(line) ? 'grazing'
  : /^A dispute over rights on the marsh/.test(line) ? 'marsh'
    : /^A dispute over rights on the shore/.test(line) ? 'shore'
      : /^A dispute over water access/.test(line) ? 'water' : '');
for (const dir of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
  const out = { births: 0, fall: {}, violations: {}, holdsNone: {}, examples: {} };
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz')).sort()) {
    const { seed, size, record: s } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    out.births++;
    const grounds = (Array.isArray(s?.config?.nearbyResources) ? s.config.nearbyResources : []).map(String);
    const grazing = s?.economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true
      || liveInstitutionNames(s).some((n) => HOUSE.test(n)) || grounds.some((g) => GRASS.test(g));
    const marsh = grounds.some((g) => MARSH.test(g));
    const shore = grounds.some((g) => SHORE.test(g));
    const water = grounds.some((g) => WET.test(g)) || ['riverside', 'coastal'].includes(s?.config?.terrainType)
      || ['river', 'port'].includes(s?.config?.tradeRouteAccess);
    if (!grazing && !marsh && !shore && !water) out.holdsNone[size] = (out.holdsNone[size] || 0) + 1;
    const k = kindOf(String(s?.powerStructure?.recentConflict ?? ''));
    if (!k) continue;
    out.fall[k] = (out.fall[k] || 0) + 1;
    const held = { grazing, marsh, shore, water }[k];
    if (!held) {
      const key = `${k} without it`;
      out.violations[key] = (out.violations[key] || 0) + 1;
      (out.examples[key] ||= []).push(seed);
    }
  }
  if (!SEEDS) for (const k of Object.keys(out.examples)) out.examples[k] = out.examples[k].slice(0, 5);
  out.holdsNone = Object.fromEntries(SIZES.map((z) => [z, out.holdsNone[z] || 0]));
  console.log(dir.split('/').pop(), JSON.stringify(out));
}
