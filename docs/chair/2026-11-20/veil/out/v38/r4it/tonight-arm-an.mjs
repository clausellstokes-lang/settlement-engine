// R4I-TONIGHT item C arm: the counts of tonight-arm.probe.jsx's shards.  node tonight-arm-an.mjs <outdir>
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const births = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births);
const line = (...a) => console.log(a.join(' '));
const nh = births.filter((b) => !b.hidden);
line('places', births.length, '| hidden-house', births.length - nh.length, '| nothing hidden', nh.length, '| places with a cast-voiced person on the owner sheet', births.filter((b) => b.castVoiced).length);
for (const [k, set] of [['twin2', births], ['server2', births.filter((b) => 'server2' in b)], ['twinServer', births.filter((b) => 'twinServer' in b)], ['ownerTwin', nh], ['ownerServer', nh.filter((b) => 'ownerServer' in b)]]) {
  const bad = set.filter((b) => b[k] !== null);
  line(`${k}: EQUAL in`, set.length - bad.length, 'of', set.length);
  for (const b of bad.slice(0, 8)) line('  ', b.seed, JSON.stringify(b[k]).slice(0, 400));
}
for (const k of ['ownerRoleTwin', 'ownerRoleServer']) {
  const set = births.filter((b) => b[k]);
  const n = set.reduce((x, b) => x + b[k].n, 0); const m = set.flatMap((b) => b[k].moved.map((x) => ({ seed: b.seed, ...x })));
  line(`${k}: owner role-voiced cast persons compared`, n, '| line EQUAL', n - m.length, '| moved', m.length, 'in', new Set(m.map((x) => x.seed)).size, 'places', '| of them nothing-hidden places: compared', set.filter((b) => !b.hidden).reduce((x, b) => x + b[k].n, 0), 'moved', m.filter((x) => !births.find((b) => b.seed === x.seed).hidden).length);
  for (const x of m.slice(0, 6)) line('  ', JSON.stringify(x).slice(0, 300));
}
