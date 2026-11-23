// VEIL-44 (f): THE DOOR CENSUS by the LATEST definition of every public function in supabase/migrations (the form of
// out/v27/imp/fn-census.txt, decc8c9e7): name, latest migration, VEIL (its body calls _gallery_veil), definer, the tables
// it reads of settlements/saved_maps, returns, grants (latest grant/revoke lines in any migration at or after the definition).
// Rows: SECURITY DEFINER functions that read public.settlements or public.saved_maps. Usage: node census.mjs <tree>
import { readFileSync, readdirSync } from 'node:fs';
const dir = `${process.argv[2]}/supabase/migrations`;
const files = readdirSync(dir).filter((f) => /^\d{3}_.*\.sql$/.test(f)).sort();
const defs = new Map(); const grants = new Map();
for (const f of files) {
  const n = f.slice(0, 3); const t = readFileSync(`${dir}/${f}`, 'utf8');
  const re = /create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?"?([a-z_0-9]+)"?\s*\(([\s\S]*?)\$(\w*)\$([\s\S]*?)\$\3\$/gi;
  let m; while ((m = re.exec(t))) {
    const name = m[1].toLowerCase(); const head = m[2]; const body = m[4];
    defs.set(name, { mig: n, head, body, at: m.index, file: f });
    grants.set(name, { mig: n, set: new Set(/security\s+definer/i.test(head) ? ['(default PUBLIC)'] : ['(default PUBLIC)']) });
  }
  const g = /(grant|revoke)\s+(?:execute|all)\s+on\s+function\s+(?:public\.)?([a-z_0-9]+)\s*\([^)]*\)\s+(to|from)\s+([a-z_, ]+);/gi;
  while ((m = g.exec(t))) {
    const name = m[2].toLowerCase(); const roles = m[4].split(',').map((s) => s.trim());
    const cur = grants.get(name); if (!cur) continue;
    if (m[1].toLowerCase() === 'grant') { cur.set.delete('(default PUBLIC)'); roles.forEach((r) => cur.set.add(r)); }
    else roles.forEach((r) => { cur.set.delete(r); if (r === 'public') cur.set.delete('(default PUBLIC)'); });
  }
}
const rows = [];
for (const [name, d] of defs) {
  if (!/security\s+definer/i.test(d.head)) continue;
  const tabs = ['saved_maps', 'settlements'].filter((x) => new RegExp(`public\\.${x}\\b|\\bfrom\\s+${x}\\b|\\bjoin\\s+${x}\\b`, 'i').test(d.body));
  if (!tabs.length) continue;
  const veil = /_gallery_veil\s*\(/.test(d.body) ? 'VEIL' : '-';
  const vol = /\bimmutable\b/i.test(d.head) ? 'immutable' : /\bstable\b/i.test(d.head) ? 'stable' : 'volatile';
  const ret = (d.head.match(/returns\s+([\s\S]{0,40})/i)?.[1] || '').replace(/\s+/g, ' ').trim();
  rows.push([name, d.mig, veil, 'definer', tabs.join(','), ret.split(' language')[0].slice(0, 40), [...grants.get(name).set].sort().join(', '), vol].join('\t'));
}
rows.sort(); console.log(rows.join('\n'));
