// GOALS-3 builder 9 (scratch, docs only): the lane's own gate measure, `../measures/goals-final.mjs` (identical sentences,
// mirrors, templates, tie repeats, the refused want), run UNCHANGED over a tree whose GOAL_FAMILY_LINES carries the appended
// lines IN MEMORY (wants-hooks.mjs; nothing on disk changes). Usage: node wants-goals-final.mjs <tree> <append.json> [n=50]
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
const [, , L, APP, nA = '50'] = process.argv;
const here = path.dirname(new URL(import.meta.url).pathname);
register(pathToFileURL(path.join(here, 'wants-hooks.mjs')).href, { data: { append: JSON.parse(fs.readFileSync(APP, 'utf8')) } });
process.argv = [process.argv[0], path.join(here, '../measures/goals-final.mjs'), L, nA];
await import(pathToFileURL(path.join(here, '../measures/goals-final.mjs')).href);
