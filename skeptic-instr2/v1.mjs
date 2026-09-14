import { classifyMoves, orderIdOf } from '../skepINSTR2/src/domain/prose/moveGrammar.js';
import { loadStateLeaves } from '../skepINSTR2/tests/helpers/dossierCorpus.js';
const leaves = await loadStateLeaves();
const texts = leaves.map(l=>l.text).filter(t=>t&&t.length>3);
const withBrace = texts.filter(t=>/\{[a-zA-Z_]/.test(t)).length;
const ord = texts.map(t=>orderIdOf(classifyMoves(t))||classifyMoves(t).join('→'));
const v1 = ord.filter(o=>String(o).split('|').includes('V1')).length;
console.log('AUTHORED R1 variants:', texts.length, '| carrying a {slot}:', withBrace, `(${(withBrace/texts.length*100).toFixed(1)}%)`);
console.log('V1 share on the AUTHORED corpus:', (v1/texts.length).toFixed(4), `(${v1} of ${texts.length}) · distinct orders n =`, new Set(ord).size);
// what the same texts read like with the braces STRIPPED (the rendering the composers do)
const stripped = texts.map(t=>t.replace(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g,'the thing'));
const ord2 = stripped.map(t=>orderIdOf(classifyMoves(t))||classifyMoves(t).join('→'));
const v1b = ord2.filter(o=>String(o).split('|').includes('V1')).length;
console.log('V1 share on the SAME texts with slots RENDERED:', (v1b/texts.length).toFixed(4), `(${v1b} of ${texts.length}) · n =`, new Set(ord2).size);
