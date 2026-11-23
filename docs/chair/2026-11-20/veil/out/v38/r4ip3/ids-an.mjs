// R4I-PAGE-3 ST: the table of stored-ids.probe.jsx's shards. node ids-an.mjs <outdir>. Exit 1 where (1), (2), (3) or a control reds.
import { readdirSync, readFileSync } from 'node:fs';
const O = process.argv[2];
const rows = readdirSync(O).filter((f) => /^ids-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')).rows);
const sum = (f) => rows.reduce((a, r) => a + f(r), 0);
const by = {}; for (const r of rows) for (const [s, c] of Object.entries(r.f1)) by[s] = (by[s] || 0) + c;
const ctl = (k) => { const o = {}; for (const r of rows) o[r.controls[k]] = (o[r.controls[k]] || 0) + 1; return o; };
const t = {
  documents: rows.length, reads: sum((r) => r.reads), cards: sum((r) => r.cards),
  '(1) withheld names spelled in ids, keys, slugs, by surface': by,
  '(2) stored person ids served un-re-keyed': sum((r) => r.f2), '(2) of them in stored-only fields': sum((r) => r.f2StoredOnly),
  'stored-only keys seen': [...new Set(rows.flatMap((r) => r.storedOnlyKeys))],
  '(3) person ids shared by two reads of one surface': sum((r) => r.f3Shared),
  '(3) references unresolved within a read (all)': sum((r) => r.f3Unresolved), '(3) of them beyond the stored document\'s own dangling': sum((r) => r.f3UnresolvedOverStored),
  'stored documents\' own dangling references': sum((r) => r.storedUnresolved),
  '(4) re-keyed on the twin (off, unmarked, first read)': { ids: sum((r) => r.f4.ids), refs: sum((r) => r.f4.refs), ties: sum((r) => r.f4.ties) },
  '(4) control: a planted bad reference': ctl('badRef'), '(4) control: bad references planted, caught': [sum((r) => r.controls.badRefPlants?.[0] || 0), sum((r) => r.controls.badRefPlants?.[1] || 0)], '(4) control: a stored id served': ctl('storedId'),
  'documents with no read on a surface': rows.filter((r) => r.faults.some((x) => x.endsWith('no read'))).length,
};
console.log(JSON.stringify(t, null, 1));
const faults = rows.flatMap((r) => r.faults.map((x) => `${r.seed}: ${x}`));
console.log(`FAULTS (first 30 of ${faults.length}):\n${faults.slice(0, 30).join('\n')}`);
const red = Object.values(by).some((c) => c > 0) || t['(2) stored person ids served un-re-keyed'] > 0 || t['(3) person ids shared by two reads of one surface'] > 0
  || t['(3) of them beyond the stored document\'s own dangling'] > 0 || (ctl('storedId').MISSED || 0) > 0;
console.log(red ? 'GATE RED' : 'GATE GREEN'); process.exit(red ? 1 : 0);
