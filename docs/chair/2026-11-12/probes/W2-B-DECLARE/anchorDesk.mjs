// TREE=<tree> node identDesk.mjs <corpus.gz> <seeds> <out.json> — DS-GEN-9's rungs beneath the mount (the desk's own output)
import fs from 'node:fs'; import zlib from 'node:zlib';
const { generalStateProse, significantEvent } = await import(process.env.TREE + '/src/domain/display/stateProse/generalStateProse.js');
const want = new Set(fs.readFileSync(process.argv[3], 'utf8').trim().split('\n'));
const rows = zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n').map((l) => JSON.parse(l)).filter((r) => want.has(r.seed));
const out = {}; let n = 0;
for (const { seed, s } of rows) {
  const p = generalStateProse(s, { history: s.history, tier: s.tier, institutions: s.institutions }, { seed: String(s._seed ?? s.id ?? ''), audience: 'dm' });
  const m = significantEvent(s.history?.historicalEvents || []);
  out[seed] = { event: m ? { type: m.type, name: m.name, yearsAgo: m.yearsAgo, desc: String(m.description || '').slice(0, 160) } : null,
    lines: (p.history?.identity || []).map((r) => ({ key: r?.provenance?.poolKey, s: r?.sentence })).filter((x) => x.s) };
  n += out[seed].lines.length;
}
fs.writeFileSync(process.argv[4], JSON.stringify(out)); console.log('towns', rows.length, 'identity sentences', n);
