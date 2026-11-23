// R4I-MEASURE: the table of one run (meas.sh's outdir): every comparison's reads and differing reads, by instrument,
// EVERY differing path with its count of reads, of leaves, and one example pair; the stored-id hits by door, engine and
// path (publicProse apart). `node meas-an.mjs <outdir> [--json]`. Exit 0 always (a measure, not a gate).
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const shards = readdirSync(O).filter((f) => /^meas-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const M = { docs: 0, done: shards.every((s) => s.done), faults: [], linkTwinSame: { same: 0, differ: 0 }, cmp: {}, c: { hits: {}, prose: {}, reads: {}, freshShaped: 0, docsWithStoredIds: 0, census: {} }, storedCmp: { same: 0, differ: 0, missing: 0 }, marker: {}, perDoc: [] };
for (const s of shards) {
  M.docs += s.docs; M.faults.push(...s.faults); M.perDoc.push(...s.perDoc);
  M.linkTwinSame.same += s.linkTwinSame.same; M.linkTwinSame.differ += s.linkTwinSame.differ;
  for (const [k, t] of Object.entries(s.cmp)) {
    const m = (M.cmp[k] ||= { reads: 0, differ: 0, paths: {}, byTag: {} });
    m.reads += t.reads; m.differ += t.differ;
    for (const [g, n] of Object.entries(t.byTag)) m.byTag[g] = (m.byTag[g] || 0) + n;
    for (const [p, e] of Object.entries(t.paths)) {
      const x = (m.paths[p] ||= { reads: 0, leaves: 0, example: null, docs: [] });
      x.reads += e.reads; x.leaves += e.leaves; x.example ||= e.example; for (const d of e.docs) if (x.docs.length < 12 && !x.docs.includes(d)) x.docs.push(d);
    }
  }
  for (const b of ['hits', 'prose']) for (const [k, byPath] of Object.entries(s.c[b])) for (const [p, e] of Object.entries(byPath)) {
    const x = ((M.c[b][k] ||= {})[p] ||= { count: 0, reads: 0, example: null });
    x.count += e.count; x.reads += e.reads.n; x.example ||= e.example;
  }
  for (const [k, n] of Object.entries(s.c.reads)) M.c.reads[k] = (M.c.reads[k] || 0) + n;
  for (const [p, e] of Object.entries(s.c.census || {})) { const x = (M.c.census[p] ||= { count: 0, docs: 0, example: null }); x.count += e.count; x.docs += e.docs; x.example ||= e.example; }
  if (s.storedCmp) for (const k of ['same', 'differ', 'missing']) M.storedCmp[k] += s.storedCmp[k];
  for (const [k, n] of Object.entries(s.marker || {})) M.marker[k] = (M.marker[k] || 0) + n;
  M.c.freshShaped += s.c.freshShaped; M.c.docsWithStoredIds += s.c.docsWithStoredIds;
}
if (process.argv[3] === '--json') { process.stdout.write(JSON.stringify(M)); process.exit(0); }
const L = (...a) => console.log(a.join(' '));
L(`documents ${M.docs}; all shards done: ${M.done}; faults ${M.faults.length}; link twin copy = linkTwin.shared.mjs: ${M.linkTwinSame.same} same, ${M.linkTwinSame.differ} differ`);
for (const f of M.faults.slice(0, 20)) L('  FAULT', f);
L('');
L('COMPARISONS (reads compared / reads differing):');
for (const [k, t] of Object.entries(M.cmp).sort()) L(`  ${k}: ${t.reads} / ${t.differ}`);
const split = M.perDoc.flatMap((r) => r.instrumentSplit.map((x) => `${r.seed}: ${x}`));
L(`instrument split (canon and aligned disagree on a read): ${split.length}`); for (const x of split.slice(0, 10)) L('  ', x);
const sn = M.perDoc.filter((r) => r.sameNamed.length);
L(`documents with two or more persons of one name (npcs[]): ${sn.length} of ${M.perDoc.length}`);
L('');
for (const [k, t] of Object.entries(M.cmp).sort()) {
  if (!t.differ) continue;
  L(`== ${k}: ${t.differ} of ${t.reads} reads differ`);
  L('   by setting:', Object.entries(t.byTag).sort().map(([g, n]) => `${g}=${n}`).join(' '));
  const docs = [...new Set(M.perDoc.filter((r) => r.differ.some((x) => x.startsWith(k.split(' | ')[0] + ' '))).map((r) => r.seed))];
  L(`   documents (${docs.length}):`, docs.slice(0, 20).join(', '));
  for (const [p, e] of Object.entries(t.paths).sort((a, b) => b[1].reads - a[1].reads)) {
    L(`   ${p}: reads ${e.reads}, leaves ${e.leaves}`);
    L(`      e.g. ${e.example.doc} ${e.example.tag.split('|').slice(1).join('|')} at ${e.example.path}`);
    L(`        server: ${e.example.server}`);
    L(`        twin:   ${e.example.twin}`);
  }
}
L('');
L('STORED IDS SERVED (C), reads searched by door | engine:', Object.entries(M.c.reads).sort().map(([k, n]) => `${k}=${n}`).join('; '));
L(`fresh-shaped stored ids (F)(i): ${M.c.freshShaped}; documents whose own walk finds stored ids: ${M.c.docsWithStoredIds}`);
L('SERVED MARKER BY DOOR | setting kind | state (reads):', Object.keys(M.marker).length ? '' : 'not recorded in this run');
for (const [k, n] of Object.entries(M.marker).sort()) L(`  ${k}: ${n}`);
L(`stored document = the dump's (MEAS_STORED_CMP): ${M.storedCmp.same} same, ${M.storedCmp.differ} differ, ${M.storedCmp.missing} missing`);
L('STORED-SIDE CENSUS (paths of the stored documents holding a stored person id, the re-key\'s own sites apart):');
const cs = Object.entries(M.c.census).sort((a, c) => c[1].docs - a[1].docs);
if (!cs.length) L('  none');
for (const [p, e] of cs) L(`  ${p}: ${e.count} in ${e.docs} documents; e.g. ${e.example.doc} ${e.example.at}`);
for (const b of ['hits', 'prose']) {
  L(b === 'hits' ? 'HITS (outside publicProse):' : 'HITS INSIDE publicProse (apart, ruling (a\')):');
  const ks = Object.keys(M.c[b]).sort();
  if (!ks.length) L('  none');
  for (const k of ks) for (const [p, e] of Object.entries(M.c[b][k]).sort((a, c) => c[1].count - a[1].count)) L(`  ${k} :: ${p}: ${e.count} hits on ${e.reads} reads; e.g. ${e.example.doc} ${e.example.tag.split('|').slice(1).join('|')} ${e.example.path} = ${e.example.value}`);
}
