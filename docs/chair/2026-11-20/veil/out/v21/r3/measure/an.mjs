import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const T = readdirSync(dir).filter((f) => /^shard\d\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`)));
const hid = T.filter((t) => t.hidden?.length && t.B); const free = T.filter((t) => t.hidden && !t.hidden.length);
console.log('towns', T.length, 'with hideable', hid.length, 'hidden-free', free.length, 'threw', T.filter((t) => t.threw || t.Bthrew).length);
const freeTypes = new Set(free.flatMap((t) => ['off', 'dm'].flatMap((v) => Array.isArray(t[v].crimeTypes) ? t[v].crimeTypes : [])));
const J = JSON.stringify;
const cnt = {}; const ex = {};
const bump = (k, seed, e) => { (cnt[k] = cnt[k] || new Set()).add(seed); if (!ex[k]) ex[k] = `${seed}: ${e}`; };
for (const t of hid) for (const v of ['off', 'dm']) {
  const a = t[v]; const b = t.B; const s = `${t.seed}`;
  const bNames = new Set(b.factions.map((f) => f.n));
  for (const f of a.factions) if (!bNames.has(f.n)) bump(`power.entry ${v}${f.g ? ' (governing)' : ''} c=${f.c}`, s, f.n);
  const sum = a.factions.reduce((x, f) => x + Number(f.p || 0), 0); if (sum !== 100) bump(`power.share sum!=100 ${v}`, s, sum);
  if (a.factions.length !== t.stored.factions.length) bump(`power withheld already ${v}`, s, `${t.stored.factions.length}->${a.factions.length}`);
  for (const r of a.rels) if ((r.pair || []).some((n) => !bNames.has(n))) bump(`power.relation.entry ${v}`, s, J(r));
  if (a.complexity !== b.complexity) bump(`economy.complexity ${v}`, s, `${a.complexity} | B ${b.complexity}`);
  if (a.drag !== b.drag) bump(`safety.economicDragDesc ${v}`, s, `${a.drag} | B ${b.drag}`);
  if (a.guard !== b.guard) bump(`safety.guardEffectivenessDesc ${v}`, s, `${a.guard?.slice(-120)} | B ${b.guard?.slice(-120)}`);
  if (a.safetyDesc !== b.safetyDesc) bump(`safety.safetyDesc ${v}`, s, `${a.safetyDesc} | B ${b.safetyDesc}`);
  const at = Array.isArray(a.crimeTypes) ? a.crimeTypes : []; const bt = new Set(Array.isArray(b.crimeTypes) ? b.crimeTypes : []);
  for (const x of at) if (!bt.has(x)) bump(`safety.crimeTypes only-in-A ${v} ${x}`, s, x);
  for (const x of at) if (!freeTypes.has(x)) bump(`VR39 type not in free pool ${v} ${x}`, s, x);
  const ah = Array.isArray(a.hooks) ? a.hooks : []; const bh = new Set((Array.isArray(b.hooks) ? b.hooks : []).map(J));
  for (const h of ah) if (!bh.has(J(h))) bump(`safety.plotHooks only-in-A ${v}`, s, J(h).slice(0, 140));
  const bTen = new Set(b.tensions.map((x) => x.type)); for (const x of a.tensions) if (x.type === 'crime_wave' && !bTen.has('crime_wave')) bump(`history.tension.crimeWave ${v}`, s, J(x));
  if (a.events.includes('crime_wave') && !b.events.includes('crime_wave')) bump(`history.event.crimeWave ${v}`, s, '');
  for (const [n, d] of Object.entries(a.instDesc)) if (n in b.instDesc && b.instDesc[n] !== d) bump(`institutions.desc ${v}`, s, `${n}: ${String(d).slice(0, 80)} | B ${String(b.instDesc[n]).slice(0, 80)}`);
  if (J(a.prose) !== J(b.prose)) bump(`prose.criminal ${v}`, s, `${J(a.prose)?.slice(0, 160)} | B ${J(b.prose)?.slice(0, 160)}`);
  bump(`KEY ${v} ${a.key}`, s, ''); 
  if (a.incomeSum !== 100 && a.incomeN) bump(`income sum!=100 ${v}`, s, a.incomeSum);
}
for (const t of free) for (const v of ['off']) bump(`CONTROL KEY ${v} ${t[v].key}`, t.seed, '');
for (const t of T.filter((x) => x.off)) for (const v of ['off']) { const sum = t[v].factions.reduce((x, f) => x + Number(f.p || 0), 0); if (sum !== 100) bump(`ALL towns power sum!=100 ${v}`, t.seed, sum); }
for (const k of Object.keys(cnt).sort()) console.log(String(cnt[k].size).padStart(4), k, '  e.g.', ex[k].slice(0, 260));
console.log('free pool types:', [...freeTypes].join(' | '));
