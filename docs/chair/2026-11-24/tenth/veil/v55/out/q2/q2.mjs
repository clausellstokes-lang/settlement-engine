// VEIL-55 Q2 (the chair 07:52): an UNMARKED map member under 211 (veil(pub,{},false) or pub) vs unit 3 (veil(apply(pub,splice),{},true)),
// on the today-born stored 140, at the tip's 212 (v55u1); compared modulo each read's person-id bijection.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const { canonPeople } = await import('/home/user/wt/u3/tests/security/personIdBijection.shared.mjs');
const D = '/var/tmp/v55/out/stored-today';
const files = readdirSync(D).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const rows = (v, p = '', acc = new Map()) => { if (Array.isArray(v)) v.forEach((x) => rows(x, `${p}[]`, acc)); else if (isRec(v)) for (const [k, x] of Object.entries(v)) rows(x, p ? `${p}.${k}` : k, acc); else { const key = `${p}=${JSON.stringify(v)}`; acc.set(key, (acc.get(key) || 0) + 1); } return acc; };
let lose = 0, gain = 0, same = 0; const byTop = {}; const out = [];
for (const f of files) {
  const doc = readFileSync(`${D}/${f}`, 'utf8');
  writeFileSync('/tmp/claude-0/q2doc.json', doc);
  const sql = `\\set doc \`cat /tmp/claude-0/q2doc.json\`
select json_build_object('a', coalesce(public._gallery_veil(p.j, '{}'::jsonb, false)->'body', p.j),
  'b', public._gallery_veil(public._gallery_apply_member_overrides(p.j, p.j || (select coalesce(jsonb_object_agg(k, d.j->k),'{}'::jsonb) from unnest(array['relationships','prominentRelationship','pressureSentence']) k where d.j ? k), '{}'::jsonb, false, false, false), '{}'::jsonb, true)->'body')
from (select :'doc'::jsonb as j) d cross join lateral (select public._gallery_sanitize_public_json(d.j) as j) p;`;
  const r = JSON.parse(execFileSync('psql', ['-X', '-q', '-At', '-d', 'v55u1'], { input: sql, env: { ...process.env, PGHOST: '/var/tmp/rv7', PGUSER: 'postgres' }, maxBuffer: 1 << 28 }).toString());
  const A = rows(canonPeople(r.a).doc), B = rows(canonPeople(r.b).doc);
  let l = 0, g = 0; const tops = new Set();
  for (const [k, c] of A) { const d = c - (B.get(k) || 0); if (d > 0) { l += d; tops.add(k.split(/[.=[]/)[0]); } }
  for (const [k, c] of B) { const d = c - (A.get(k) || 0); if (d > 0) { g += d; if (process.env.SHOW && g < 25) console.log("GAIN", f, k.slice(0, 160)); } }
  if (l) lose += 1; if (g) gain += 1; if (!l && !g) same += 1;
  for (const t of tops) byTop[t] = (byTop[t] || 0) + 1;
  out.push(`${f} lost ${l} gained ${g} [${[...tops].join(',')}]`);
}
writeFileSync('q2-towns.txt', out.join('\n') + '\n');
const line = `Q2: ${files.length} towns; unmarked member loses rows on ${lose}, gains rows on ${gain}, unchanged on ${same}; towns losing per top-level key ${JSON.stringify(byTop)}`;
writeFileSync('q2-result.txt', line + '\n'); console.log(line);
