// node pagegap.mjs <tree> <corpus> <load.cjs>: the Resources gap lines (validationOnPage.js :: resourceGapLines) for the
// vintner, glassblower and smelter lines, by line, towns
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [TREE, CORPUS, LOAD] = process.argv.slice(2);
const { resourceGapLines } = await import(TREE + '/src/domain/display/validationOnPage.js');
const C = require(LOAD)(CORPUS); const t = {};
for (const { seed, s } of C) for (const l of resourceGapLines(s)) if (/vintner|glassblower|smelter/i.test(l.impact)) (t[l.impact] ??= []).push(seed);
for (const [k, v] of Object.entries(t)) console.log(v.length + '\t' + k + '\t' + v.slice(0, 3).join(','));
