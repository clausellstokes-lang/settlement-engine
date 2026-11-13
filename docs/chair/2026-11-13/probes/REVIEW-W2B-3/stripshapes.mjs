// REVIEW-W2B-3 item 3: unwrap shapes of my own (none in either review's list) through the tip's `stripSites`.
// TREE=<tree> node stripshapes.mjs   — prints one row per shape: CAUGHT (a strip site found) or MISSED.
const { stripSites } = await import(process.env.TREE + '/tests/lint/presumedThings.shared.mjs');
const SHAPES = {
  'destructure in a block body': `export const a = POOL.map((l) => { const { text } = l; return text; });`,
  'destructure, renamed, in a block body': `export const a = POOL.map(function (l) { const { text: said } = l; return said; });`,
  'Reflect.get': `export const a = POOL.map((l) => Reflect.get(l, 'text'));`,
  'the third callback argument': `export const a = POOL.map((l, i, arr) => arr[i].text);`,
  'for-in over the pool': `const out = []; for (const i in POOL) out.push(POOL[i].text); export default out;`,
  'while loop, index': `const out = []; let i = 0; while (i < POOL.length) { out.push(POOL[i].text); i += 1; } export default out;`,
  'concat in a for-of': `let out = []; for (const l of POOL) out = out.concat(l.text); export default out;`,
  'index assignment in a for-of': `const out = []; for (const l of POOL) out[out.length] = l.text; export default out;`,
  'destructure off a pick': `const { text } = pick(POOL); export default text;`,
  'array destructure, then .text': `const [first] = POOL; export default first.text;`,
  'a property helper (pluck)': `const prop = (k) => (o) => o[k]; export const a = POOL.map(prop('text'));`,
  'Object.assign target': `const out = []; POOL.forEach((l) => Object.assign(out, { [out.length]: l.text })); export default out;`,
  'spread into a Set': `export const a = new Set(POOL.map((l) => l)).forEach ? [...POOL].map((l) => \`\${l.text}\`) : [];`,
  'reduce into a string': `export const a = POOL.reduce((acc, l) => acc + ' ' + l.text, '');`,
  'join after map of a getter': `const get = function (l) { return l.text; }; export const a = POOL.map(get).join(' ');`,
};
for (const [name, src] of Object.entries(SHAPES)) {
  let sites; try { sites = stripSites('src/domain/plant.js', src); } catch (e) { sites = null; console.log('ERROR', name, e.message); continue; }
  console.log(sites.length ? 'CAUGHT' : 'MISSED', '\t', name, '\t', sites.map((s) => s.receiver).join(' | '));
}
