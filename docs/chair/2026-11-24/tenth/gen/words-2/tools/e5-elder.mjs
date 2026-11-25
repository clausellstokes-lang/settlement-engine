#!/usr/bin/env node
/**
 * WORDS-2 · E5 (intake 3): "THE ELDER" BESIDE A HEADMAN. Over a records dump, on a tree (`--tree`, default /home/user/wt/base):
 * each place's governing form (`rulingPower.js :: nameOf(governingFactionOf(record))`), its `ruler` kind and `office:`
 * atoms (`factsOf`), and which of Daily Life's W11, B19 and P13 the page prints (`dailyLife.js :: deriveDailyLife`, the
 * same derivation the page and the PDF print). Counts by size: places by form; the three lines printed by form; the
 * fault (a line printed where the office is the headman's). Changes nothing.
 * Usage: node e5-elder.mjs [--tree=<dir>] <records dir> [...]
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
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { deriveDailyLife } = await imp('src/domain/dailyLife.js');
const { DAWN_WORK } = await imp('src/data/dailyLife/dawnWork.js');
const { GATHERING_NAMED, GATHERING_PLAIN } = await imp('src/data/dailyLife/gatheringPlaces.js');
const all = [];
const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if (typeof v.id === 'string' && typeof v.text === 'string') all.push(v); else Object.values(v).forEach(walk); } };
walk(DAWN_WORK); walk(GATHERING_NAMED); walk(GATHERING_PLAIN);
const LINES = Object.fromEntries(['W11', 'B19', 'P13'].map((id) => [id, all.find((l) => l.id === id)?.text]));
for (const [id, t] of Object.entries(LINES)) if (!t) throw new Error(`no line ${id}`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
for (const dir of dirs) {
  const forms = {}; const printed = {}; const fault = []; let n = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json.gz')).sort()) {
    const { seed, size, record } = JSON.parse(gunzipSync(readFileSync(join(dir, f))).toString());
    n += 1;
    const fx = factsOf(record);
    const g = governingFactionOf(record); const form = g ? nameOf(g) : '(none)';
    const office = Object.entries(fx.office || {}).filter(([, v]) => v).map(([k]) => k).join(',') || '-';
    const key = `${form} [ruler ${fx.rulerKind}; office ${office}]`;
    (forms[key] ||= {})[size] = (forms[key][size] || 0) + 1;
    const dl = deriveDailyLife(record);
    const text = Object.values(dl.slots).map((s) => s.text).join(' ');
    for (const [id, t] of Object.entries(LINES)) if (text.includes(t.replace(/\.$/, ''))) {
      const k = `${id} on ${key}`; (printed[k] ||= {})[size] = (printed[k][size] || 0) + 1;
      if (fx.office?.headman) fault.push(`${seed} ${id} (${form})`);
    }
  }
  console.log(`== ${dir}: ${n} places`);
  console.log('-- places by governing form where the ruler kind is elder or the office is elders/headman (by size):');
  for (const [k, c] of Object.entries(forms).filter(([k]) => /ruler elder|office (?:elders|headman)/.test(k)).sort()) console.log(`  ${SIZES.map((z) => c[z] || 0).join('/')}  ${k}`);
  console.log('-- W11 / B19 / P13 printed, by form (by size):');
  for (const [k, c] of Object.entries(printed).sort()) console.log(`  ${SIZES.map((z) => c[z] || 0).join('/')}  ${k}`);
  console.log(`-- THE FAULT (one of the three printed where the office is the headman's): ${fault.length}${fault.length ? `: ${fault.slice(0, 6).join('; ')}` : ''}`);
}
