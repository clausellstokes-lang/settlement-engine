// V33-JOINPROBE step 5: the hook gap's table from hookgap.probe.jsx's shards.   node hookgap-an.mjs <outdir>   (exit 2 on a missing shard)
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const files = readdirSync(O).filter((f) => /^hookgap-shard\d+\.json$/.test(f)).sort();
if (files.length !== 4) { console.log(`MISSING SHARDS: ${files.length} of 4`); process.exit(2); }
const shards = files.map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const rows = shards.flatMap((s) => s.rows);
const eleven = shards[0].eleven;
console.log(`THE ELEVEN (composed pools, a need of class crime or hideable): ${eleven.length}`);
for (const e of eleven) console.log(`  ${e.kind} ${e.line} [${e.hideable.join(', ')}]: ${e.text}`);
const sizes = shards[0].sizes;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let mismatch = 0;
console.log('\nsize        births troubled+hideable(places) serving-any  served-hooks  gap(needing-a-hidden-house)  naming-hidden   [server = twin per place]');
const tot = { b: 0, p: 0, s: 0, h: 0, g: 0, n: 0 };
for (const size of sizes) {
  const r = rows.filter((x) => x.size === size); const p = r.filter((x) => x.twin);
  const s = p.filter((x) => x.twin.served.length).length; const h = p.reduce((a, x) => a + x.twin.served.length, 0);
  const g = p.reduce((a, x) => a + x.twin.gap.length, 0); const n = p.reduce((a, x) => a + x.twin.naming.length, 0);
  const mm = p.filter((x) => !eq(x.twin.served, x.server.served) || !eq(x.twin.gap, x.server.gap) || !eq(x.twin.naming, x.server.naming) || !eq(x.twin.hiddenHouses, x.server.hiddenHouses)).length;
  const sv = { s: p.filter((x) => x.server.served.length).length, h: p.reduce((a, x) => a + x.server.served.length, 0), g: p.reduce((a, x) => a + x.server.gap.length, 0), n: p.reduce((a, x) => a + x.server.naming.length, 0) };
  mismatch += mm;
  console.log(`${size.padEnd(11)} ${String(r.length).padStart(6)} ${String(p.length).padStart(26)} ${String(s).padStart(12)} ${String(h).padStart(13)} ${String(g).padStart(28)} ${String(n).padStart(14)}   server: ${sv.s}/${sv.h}/${sv.g}/${sv.n}; places differing ${mm}`);
  Object.assign(tot, { b: tot.b + r.length, p: tot.p + p.length, s: tot.s + s, h: tot.h + h, g: tot.g + g, n: tot.n + n });
}
console.log(`ALL         ${String(tot.b).padStart(6)} ${String(tot.p).padStart(26)} ${String(tot.s).padStart(12)} ${String(tot.h).padStart(13)} ${String(tot.g).padStart(28)} ${String(tot.n).padStart(14)}   places where server != twin: ${mismatch}`);
console.log('\nTHE GAP, each hook by place (twin; server identical unless marked):');
for (const x of rows.filter((y) => y.twin?.gap.length)) for (const g of x.twin.gap) {
  const onServer = x.server.gap.some((s) => s.hook === g.hook);
  console.log(`  ${x.seed}: ${g.kind} ${g.line} [${g.hideable.join(', ')}] hidden houses {${x.twin.hiddenHouses.join(' | ')}} withheld powers {${x.twin.withheldPowers.join(' | ')}}${onServer ? '' : ' [NOT ON SERVER]'}: "${g.hook}"`);
}
console.log('\nSERVED HOOKS NAMING A HIDDEN HOUSE OR A WITHHELD POWER (the lane\'s fold, buildNameSearch):');
for (const x of rows.filter((y) => y.twin?.naming.length || y.server?.naming.length)) console.log(`  ${x.seed}: twin ${JSON.stringify(x.twin.naming)} server ${JSON.stringify(x.server.naming)}`);
console.log(`\nHOOKGAP ${tot.g}/${tot.h} (served hooks needing a hidden house / served hooks); naming ${tot.n}; server=twin ${mismatch === 0 ? 'YES' : `NO (${mismatch} places)`}`);
