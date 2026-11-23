// The census: master's veil tables (db832c892) against the lane's, kind by kind.
const [mPath, nPath] = process.argv.slice(2);
const M = await import(mPath); const N = await import(nPath);
const out = {};
const kinds = new Set([...Object.keys(M.CARD_KINDS), ...Object.keys(N.CARD_KINDS)]);
for (const k of kinds) {
  const m = M.CARD_KINDS[k], n = N.CARD_KINDS[k];
  if (!m || !n) { out[k] = { onlyIn: m ? 'master' : 'lane' }; continue; }
  const row = {};
  const lj = (x) => JSON.stringify(x);
  if (lj(m.lists) !== lj(n.lists)) row.lists = { master: m.lists, lane: n.lists };
  const mf = new Set(m.floor), nf = new Set(n.floor);
  const fd = { masterOnly: [...mf].filter((x) => !nf.has(x)), laneOnly: [...nf].filter((x) => !mf.has(x)) };
  if (fd.masterOnly.length || fd.laneOnly.length) row.floor = fd;
  const eyes = new Set([...Object.keys(m.fields || {}), ...Object.keys(n.fields || {})]);
  for (const e of eyes) {
    const a = new Set((m.fields || {})[e] || []), b = new Set((n.fields || {})[e] || []);
    const d = { masterOnly: [...a].filter((x) => !b.has(x)), laneOnly: [...b].filter((x) => !a.has(x)) };
    if (!(m.fields || {})[e] || !(n.fields || {})[e]) d.eyeOnlyIn = (m.fields || {})[e] ? 'master' : 'lane';
    if (d.masterOnly.length || d.laneOnly.length || d.eyeOnlyIn) (row.fields ||= {})[e] = d;
  }
  if (String(m.idOf) !== String(n.idOf)) row.idOf = { master: String(m.idOf), lane: String(n.idOf) };
  if (Object.keys(row).length) out[k] = row;
}
const gm = M.GROUPING_REMOVERS || {}, gn = N.GROUPING_REMOVERS || {};
const g = {};
for (const k of new Set([...Object.keys(gm), ...Object.keys(gn)])) if (JSON.stringify(gm[k]) !== JSON.stringify(gn[k])) g[k] = { master: gm[k], lane: gn[k] };
console.log(JSON.stringify({ kinds: out, groupings: g, exportsOnlyMaster: Object.keys(M).filter((x) => !(x in N)), exportsOnlyLane: Object.keys(N).filter((x) => !(x in M)) }, null, 1));
