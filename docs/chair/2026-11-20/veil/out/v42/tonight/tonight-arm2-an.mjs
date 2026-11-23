// R4I-TONIGHT-2 item C.4: the three halves of tonight-arm2.probe.jsx's shards.  node tonight-arm2-an.mjs <outdir>
// Exit 1 when any of (a) twin2 / server2, (b) twinServer or (c)'s roleMoved (nothing-hidden places) is not all equal.
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const births = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births);
const line = (...a) => console.log(a.join(' '));
const tags = [...new Set(births.flatMap((b) => Object.keys(b.reads)))];
const nh = births.filter((b) => !b.hidden);
let red = 0;
line('places', births.length, '| hidden-house', births.length - nh.length, '| nothing hidden', nh.length, '| places with a cast-voiced person on the owner sheet', births.filter((b) => b.castVoiced).length, '| reads', tags.join(' '));
const missing = births.flatMap((b) => tags.filter((t) => b.reads[t]?.twinMissing || b.reads[t]?.serverMissing).map((t) => `${b.seed} ${t}`));
line('reads that served no dossier', missing.length, missing.slice(0, 5).join('; '));
if (missing.length) red += 1;
for (const k of ['twin2', 'server2', 'twinServer']) {
  const half = k === 'twinServer' ? '(b)' : '(a)';
  for (const t of tags) {
    const set = births.filter((b) => b.reads[t] && k in b.reads[t]);
    if (!set.length) continue;
    const bad = set.filter((b) => b.reads[t][k] !== null);
    if (bad.length) red += 1;
    line(`${half} ${k} ${t}: EQUAL in`, set.length - bad.length, 'of', set.length, '| differ', bad.length);
    for (const b of bad.slice(0, 3)) line('    ', b.seed, JSON.stringify(b.reads[t][k]).slice(0, 360));
  }
  const any = births.filter((b) => tags.some((t) => b.reads[t] && k in b.reads[t] && b.reads[t][k] !== null));
  line(`${half} ${k} any read: places differing`, any.length, 'of', births.length);
}
for (const k of ['ownerTwin', 'ownerServer']) {
  for (const t of tags) {
    for (const [label, set] of [['nothing-hidden', nh], ['every place', births]]) {
      const xs = set.filter((b) => b.reads[t] && b.reads[t][k]).map((b) => ({ seed: b.seed, ...b.reads[t][k] }));
      if (!xs.length) continue;
      const sum = (f) => xs.reduce((n, x) => n + f(x), 0);
      const moved = xs.flatMap((x) => x.roleMoved.map((m) => ({ seed: x.seed, ...m })));
      const gw = xs.flatMap((x) => x.goalWithheld.map((m) => ({ seed: x.seed, ...m })));
      const om = xs.flatMap((x) => x.otherMoved.map((m) => ({ seed: x.seed, ...m })));
      if (label === 'nothing-hidden' && moved.length) red += 1;
      line(`(c) ${k} ${t} [${label}]: role line on both`, sum((x) => x.roleBoth), '| of them moved (RED)', moved.length, 'in', new Set(moved.map((m) => m.seed)).size, 'places',
        '| goal withheld by the read (named, not red)', gw.length, `(line differs ${gw.filter((m) => !m.same).length})`, '| other same', sum((x) => x.sameOther), '| other moved', om.length, '| not served', sum((x) => x.notServed));
      if (label === 'nothing-hidden') {
        for (const m of moved.slice(0, 4)) line('     RED', JSON.stringify(m).slice(0, 300));
        for (const m of om.slice(0, 4)) line('     OTHER', JSON.stringify(m).slice(0, 300));
      }
    }
  }
}
process.exit(red ? 1 : 0);
