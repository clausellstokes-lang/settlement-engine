#!/usr/bin/env node
// CLOSE-MEASURE, THE OWNER'S PLAIN FILE: writes OWNER-SIX.md beside this file. The V pool's place 0 of each size
// (`visitor-<size>-0`, born by close.mjs :: loadTree, the verbatim visitorJob), BEFORE (43ab0f5eb) then AFTER (0359e7086):
// the place's name and size, and per trouble its sentence, its named sides and its hooks, as the page prints them
// (close.mjs's readers). Plain words for the owner: no field names, no hashes, no code words.
// One child per tree (as close.mjs). If close.mjs's work dir is given, every place is checked against its records.
//   node docs/chair/2026-11-20/content/page/measures/page-12/close/owner-six.mjs <BEFORE tree> <AFTER tree> [close work dir]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTree } from './close.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const [, , a1, a2, a3] = process.argv;

if (a1 === '--read') {
  const api = await loadTree(a2, a3);
  const out = api.SIZES.map((size) => { const { seed, t } = api.born('V', size, 0); return { seed, size, name: t.name, troubles: api.read(t) }; });
  process.stdout.write(JSON.stringify(out));
} else {
  if (!a1 || !a2) { console.error('usage: node owner-six.mjs <BEFORE tree> <AFTER tree> [close work dir]'); process.exit(2); }
  const self = fileURLToPath(import.meta.url);
  const got = {};
  for (const [tree, label] of [[a1, 'BEFORE'], [a2, 'AFTER']]) got[label] = JSON.parse(execFileSync(process.execPath, [self, '--read', tree, label], { maxBuffer: 1 << 26 }).toString());
  if (a3) {
    for (const label of ['BEFORE', 'AFTER']) {
      const rows = readFileSync(join(a3, `${label}.jsonl`), 'utf8').trim().split('\n').map((l) => JSON.parse(l)).filter((r) => r.pool === 'V' && r.i === 0);
      for (const p of got[label]) {
        const r = rows.find((x) => x.seed === p.seed);
        if (!r || r.name !== p.name || JSON.stringify(r.troubles) !== JSON.stringify(p.troubles)) throw new Error(`${label} ${p.seed}: differs from close.mjs's record`);
      }
    }
    console.log('checked: all twelve places equal close.mjs\'s records');
  }
  const kindWords = (k) => String(k || 'trouble').replace(/_/g, ' ');
  const L = ['# Six places, before and after', '',
    'One place of each size, as a visitor who changes no setting would make it. For each place: what the page said about its troubles before the work, and what it says now.',
    'For each trouble: the sentence that explains it, who stands on each side, and the openings for the players (the hooks).', ''];
  got.BEFORE.forEach((b, n) => {
    const a = got.AFTER[n];
    L.push(`## ${n + 1}. ${a.name}, a ${a.size}`, '');
    if (b.name !== a.name) L.push(`(Before the work this place was called ${b.name}.)`, '');
    for (const [when, p] of [['Before the work', b], ['After the work', a]]) {
      L.push(`### ${when}`, '');
      if (!p.troubles.length) { L.push('No troubles.', ''); continue; }
      p.troubles.forEach((x, j) => {
        L.push(`**Trouble ${j + 1}, ${kindWords(x.kind)}.** ${x.sentence}`, '');
        if (x.sides.length) L.push(`The sides: ${x.sides.join('; ')}.`, '');
        if (x.hooks.length) L.push('Openings for the players:', '', ...x.hooks.map((h) => `- ${h}`), '');
      });
    }
  });
  writeFileSync(join(HERE, 'OWNER-SIX.md'), `${L.join('\n')}\n`);
  console.log(`wrote ${join(HERE, 'OWNER-SIX.md')}`);
}
