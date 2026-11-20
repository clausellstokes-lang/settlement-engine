// a source house's "No <good> reaches the <house>." beside an import that brings the good by name
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.argv[2];
const { resourceGapLines } = await import(T + '/src/domain/display/validationOnPage.js');
const load = (f) => zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => JSON.parse(l));
const by = {};
for (const { seed, s } of load(process.argv[3])) {
  const imps = (s.economicState?.primaryImports || []).map((x) => String(x).replace(/\([^)]*\)/g, ' ').toLowerCase());
  for (const l of resourceGapLines(s)) { const m = /^No (.+?) reach(?:es)? the (charcoal burner|dairy farmer|salt works|stone quarry|woodcutter|shepherd|mine|peat cutter)/.exec(l.impact); if (!m) continue;
    const goods = m[1].split(/,| or /).map((x) => x.trim()).filter(Boolean);
    const beside = goods.some((g) => imps.some((i) => ` ${i} `.includes(` ${g} `) || ` ${i} `.includes(` ${g.replace(/s$/, '')} `)));
    (by[`${l.impact}${beside ? ' [beside an import of it]' : ''}`] ||= []).push(seed); } }
for (const [k, v] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) console.log(v.length, '|', k, '|', v.slice(0, 3).join(', '));
