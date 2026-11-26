// PROOF-4: WORDS-1's twin-strings.mjs per-birth dump (every string of the born record, then of composePublicProse(record), by
// path; its own `flat`, copied), run as a births.mjs measure so the tree's .jsx imports resolve under vitest (plain node refused
// the .jsx import on both trees: runs-C/strings-before.log). A MEASURE.
const flat = (v, path, acc) => {
  if (typeof v === 'string') acc[path] = v;
  else if (Array.isArray(v)) v.forEach((x, i) => flat(x, `${path}[${i}]`, acc));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) flat(x, `${path}.${k}`, acc);
  return acc;
};
let M = null;
export async function measure(town, { tree }) {
  M ||= await import(`${tree}/src/components/new/publicProseCompose.js`);
  const acc = flat(town, 'record', {});
  flat(M.composePublicProse(town), 'public', acc);
  return { s: acc };
}
