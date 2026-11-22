#!/usr/bin/env node
// FORTUNE-7 (E57's condition): every line the LASTING sentence can follow, beside each of the three ruled lines.
// The standing pool's lines are taken from `display/governanceAccount.js :: standingSentence` by CALLING it through
// `governanceAccountOf` is not possible (it is private), so they are rebuilt here from its source text, filled for one
// place: the bands a merited place can print (Tolerated, Approved, Endorsed; bare, one cause, the other form).
// The first merit's lines are read from `src/data/fortuneMeritLines.js`. usage: node pairs.mjs <tree> <lines.json>
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
const [treeArg, linesPath] = process.argv.slice(2);
const T = resolve(treeArg);
const { FORTUNE_MERIT_LINES, FORTUNE_MERIT_TIME_WORDS } = await import(join(T, 'src/data/fortuneMeritLines.js'));
const LASTING = JSON.parse(readFileSync(linesPath, 'utf8'));
const place = 'Stormset'; const ruler = 'the Elder Council'; const Ruler = 'The Elder Council'; const by = 'Prosperity';
const STANDING = [
  ['Tolerated bare', `${place} tolerates ${ruler}, and no more.`],
  ['Tolerated a0', `${by} keeps ${place} from more than tolerating ${ruler}.`],
  ['Tolerated a1', `${place} tolerates ${ruler} and no more. ${by} is the reason.`],
  ['Approved bare', `${place} approves of ${ruler}.`],
  ['Approved a0', `${by} has earned ${ruler} the approval of ${place}.`],
  ['Approved a1', `${Ruler} has the approval of ${place}. ${by} earned it.`],
  ['Endorsed bare', `${place} stands behind ${ruler}.`],
  ['Endorsed a0', `${by} has won ${ruler} the backing of ${place}.`],
  ['Endorsed a1', `${place} stands behind ${ruler}. ${by} won it over.`],
];
const fill = (t, slots) => t.replace(/\{(\w+)\}/g, (_m, k) => slots[k] ?? `{${k}}`);
const WEATHERED = FORTUNE_MERIT_LINES.map((l) => [`weathered ${l.id}`, fill(l.text, { event: 'The Long Flood', place, seat: ruler, ...FORTUNE_MERIT_TIME_WORDS.generation })]);
for (const [name, before] of [...STANDING, ...WEATHERED]) {
  for (const l of LASTING) console.log(`${name} + ${l.id}: ${before} ${fill(l.text, { place, seat: ruler, span: 'for centuries' })}`);
}
