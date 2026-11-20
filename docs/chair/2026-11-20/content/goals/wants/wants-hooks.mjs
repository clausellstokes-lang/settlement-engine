// GOALS-3 builder 9 (scratch measure, docs only): module hooks for wants-born.mjs. Nothing on disk changes; two modules of
// the tree are rewritten IN MEMORY as they load:
//  - src/generators/people/goals.js: each `RECEIPTS.set(out, receipts);` also files the receipts on
//    globalThis.__WANTS_RECEIPTS ({ tag: 'deal' | 'post', ids, receipts }), so the deal's receipts (goalReceiptsOf) are
//    captured exactly as the pipeline calls the deal and its post-pass;
//  - src/data/people/goalFamilies.js (only when `append` is given): GOAL_FAMILY_LINES gains, at the END of each named cell,
//    k PLACEHOLDER lines (distinct texts, the cell's own slots), so a run measures what k new DRAWN lines would do.
let append = null;
export async function initialize(data) { append = data?.append || null; }
export async function load(url, context, nextLoad) {
  const r = await nextLoad(url, context);
  if (url.endsWith('/src/generators/people/goals.js')) {
    let src = String(r.source); let n = 0;
    src = src.replace(/RECEIPTS\.set\(out, receipts\);/g, () => { const tag = n++ === 0 ? 'deal' : 'post';
      return `RECEIPTS.set(out, receipts); (globalThis.__WANTS_RECEIPTS ||= []).push({ tag: '${tag}', ids: out.map((c) => c && c.id), receipts: receipts.map((x) => ({ ...x })) });`; });
    if (n !== 2) throw new Error(`wants-hooks: expected 2 RECEIPTS.set in goals.js, found ${n}`);
    return { ...r, source: src };
  }
  if (append && url.endsWith('/src/data/people/goalFamilies.js')) {
    let src = String(r.source);
    const head = 'export const GOAL_FAMILY_LINES = Object.freeze({';
    if (!src.includes(head)) throw new Error('wants-hooks: GOAL_FAMILY_LINES head not found');
    src = src.replace(head, 'const __GFL0 = Object.freeze({');
    src += `
const __APPEND = ${JSON.stringify(append)};
export const GOAL_FAMILY_LINES = (() => {
  const text = (l) => (typeof l === 'string' ? l : l.line);
  const o = {};
  for (const [f, ks] of Object.entries(__GFL0)) { o[f] = {};
    for (const [k, vs] of Object.entries(ks)) { o[f][k] = {};
      for (const [v, lines] of Object.entries(vs)) {
        const add = __APPEND[f + '/' + k + '/' + v] || 0;
        // the cell's commonest slot set, so a placeholder is gated as the cell's lines are
        const sets = new Map(); for (const l of lines) { const s = [...new Set([...text(l).matchAll(/\\{(\\w+)\\}/g)].map((m) => m[1]))].sort().join(' '); sets.set(s, (sets.get(s) || 0) + 1); }
        const slots = ([...sets].sort((a, b) => b[1] - a[1])[0]?.[0] || '').split(' ').filter(Boolean);
        // the placeholder's own mark is two LETTERS (the measure's masker turns every digit into '#', so a number would make
        // every placeholder of a cell one masked text)
        const mark = (j) => String.fromCharCode(97 + (j % 26)) + String.fromCharCode(97 + Math.floor(j / 26));
        o[f][k][v] = Object.freeze([...lines, ...Array.from({ length: add }, (_, j) => 'Placeholder want ' + mark(j) + ' of ' + f + ' ' + k + ' ' + v + (slots.length ? ' for ' + slots.map((s) => '{' + s + '}').join(' and ') : '') + '.')]);
      } Object.freeze(o[f][k]); } Object.freeze(o[f]); }
  return Object.freeze(o);
})();
`;
    return { ...r, source: src };
  }
  return r;
}
