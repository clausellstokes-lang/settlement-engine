// V33-C1 (STORED-UNIVERSE) TABLES. node c1-an.mjs <dump outdir> [<prose outdir>] [<registry module>]
//   (1) THE STORED-ONLY PATHS: every generalized key path the stored document carries that the birth does not (against `bare`,
//       the pipeline's own result, and `lane`, tell-common.mjs :: birth), the documents carrying it, its writer (the table WRITER
//       below, each entry found by grep in saves.js and what it calls or what calls it), and its registry row (the probes' rowOf:
//       the longest prefix a registry path matches), else UNREGISTERED. The reverse (birth-only) and the value differences.
//   (2) THE PROSE: per registry row, the documents and reads where a served publicProse block holds a withheld value
//       (prose.probe.jsx), whole or cut, by site, one example.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const [dir, pdir, regMod = '/home/user/wt/lp/src/domain/veil/rosterChoiceRegistry.js'] = process.argv.slice(2);
const REG = await import(regMod);
const ROWS = REG.REGISTRY_ROWS.filter((x) => typeof x.path === 'string' && x.path).map((x) => ({ id: x.id, rule: x.rule, when: x.when, re: new RegExp(x.path) }));
const byId = new Map(REG.REGISTRY_ROWS.map((r) => [r.id, r]));
const rowOf = (np) => { const segs = np.split(/(?=\.)|(?=\[\])/); for (let n = segs.length; n > 0; n -= 1) { const p = segs.slice(0, n).join(''); const hit = ROWS.find((x) => x.re.test(p)); if (hit) return hit.id; } return null; };
const exactRow = (np) => ROWS.find((x) => x.re.test(np))?.id || null;
const WRITER = [
  [/^publicProse(\.|$)/, 'src/lib/saves.js :: supabaseSave -> publicProseForRow -> src/components/new/publicProseCompose.js :: composePublicProse; written by saves.js :: withPublicProse'],
  [/^mapEdits(\.|$)/, 'src/components/generate/SaveToLibraryButton.jsx :: handleSave -> src/domain/townMap/mapEdits.js :: newSettlementMapEdits (the create chokepoint that calls saves.save)'],
  [/^config\.(primaryDeityRef|primaryDeitySnapshot|cultDeitySnapshots)(\.|\[|$)/, 'src/store/settlementLifecycleHelpers.js :: activateFaithIfEntitled -> src/domain/worldPulse/latentPantheon.js :: activateLatentPantheon (the store, before the save)'],
  [/^neighbourNetwork(\.|\[|$)/, 'src/lib/saves.js :: withNeighbourNetworkFromRelationship'],
];
const writerOf = (p) => WRITER.find(([re]) => re.test(p))?.[1] || '(no writer found)';
const diffs = readdirSync(dir).filter((f) => /^diff-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).diffs);
console.log(`DOCUMENTS ${diffs.length} (${dir}); by role ${JSON.stringify(diffs.reduce((m, d) => ({ ...m, [d.role]: (m[d.role] || 0) + 1 }), {}))}`);
console.log(`  the store's carry was identity in ${diffs.filter((d) => d.identity).length}; activateFaithIfEntitled changed the record in ${diffs.filter((d) => d.faithChanged).length}`);
for (const base of ['bare', 'lane']) {
  const P = {}; const B = {}; const VD = {};
  for (const d of diffs) {
    for (const p of d[base].storedOnly) (P[p] ||= []).push(d.seed);
    for (const p of d[base].birthOnly) (B[p] ||= []).push(d.seed);
    for (const [p, ex] of Object.entries(d[base].valueDiff)) (VD[p] ||= { n: 0, ex }).n += 1;
  }
  const paths = Object.keys(P).sort();
  const unreg = paths.filter((p) => !rowOf(p));
  console.log(`\n(1) [${base}] STORED-ONLY PATHS: ${paths.length} generalized paths, UNREGISTERED ${unreg.length} (no registry row matches the path or a prefix of it); documents carrying any: ${diffs.filter((d) => d[base].storedOnly.length).length}/${diffs.length}`);
  const roots = {};
  for (const p of paths) { const r = p.startsWith('publicProse.blocks.') ? p.split('.').slice(0, 3).join('.') : p.split(/[.[]/)[0]; (roots[r] ||= []).push(p); }
  for (const [r, list] of Object.entries(roots).sort()) {
    const u = list.filter((p) => !rowOf(p)); const docs = new Set(list.flatMap((p) => P[p])).size;
    console.log(`  ${r}: ${list.length} paths in ${docs} documents, unregistered ${u.length}; writer ${writerOf(list[0])}`);
  }
  console.log(`  EVERY PATH (documents | registry row or UNREGISTERED | exact-path row):`);
  for (const p of paths) console.log(`    ${p} | ${P[p].length} | ${rowOf(p) || 'UNREGISTERED'}${exactRow(p) ? ` | exact ${exactRow(p)}` : ''}`);
  console.log(`  [${base}] BIRTH-ONLY PATHS: ${Object.keys(B).length}${Object.keys(B).length ? ` ${JSON.stringify(Object.fromEntries(Object.entries(B).map(([p, s]) => [p, s.length])))}` : ''}`);
  console.log(`  [${base}] VALUE DIFFERS (same exact path, other value): ${Object.keys(VD).length} generalized paths`);
  for (const [p, o] of Object.entries(VD).sort((x, y) => y[1].n - x[1].n)) console.log(`    ${p} | ${o.n} documents | e.g. ${o.ex.slice(0, 220)}`);
}
if (pdir && existsSync(pdir)) {
  const P = readdirSync(pdir).filter((f) => /^prose-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${pdir}/${f}`, 'utf8')).births);
  const T = {};
  for (const b of P) for (const [row, o] of Object.entries(b.held)) {
    const e = (T[row] ||= { docs: 0, reads: 0, whole: 0, cut: 0, sites: {}, paths: {}, roles: {}, ex: null });
    e.docs += 1; e.reads += o.reads; e.whole += o.whole; e.cut += o.cut; e.roles[b.role] = (e.roles[b.role] || 0) + 1;
    for (const [s, n] of Object.entries(o.sites)) e.sites[s] = (e.sites[s] || 0) + n; for (const [s, n] of Object.entries(o.paths)) e.paths[s] = (e.paths[s] || 0) + n;
    e.ex ||= `${b.seed} ${o.ex}`;
  }
  const reads = P.reduce((a, b) => a + b.reads, 0);
  const rows = Object.keys(T).sort((x, y) => T[y].docs - T[x].docs);
  console.log(`\n(2) PROSE HOLDING A WITHHELD FIELD (twin, every gated setting, both Reveals): ${P.length} documents, ${reads} reads; ${rows.length} rows (${rows.filter((r) => !r.startsWith('(unregistered)')).length} registered, ${rows.filter((r) => r.startsWith('(unregistered)')).length} unregistered prefixes)`);
  console.log('  row [rule/when] | documents (by role) | reads | whole / cut hits | sites (reads) | paths | e.g.');
  for (const r of rows) {
    const e = T[r]; const reg = byId.get(r);
    console.log(`  ${r} [${reg ? `${reg.rule}/${reg.when}` : '-'}] | ${e.docs} ${JSON.stringify(e.roles)} | ${e.reads} | ${e.whole}/${e.cut} | ${JSON.stringify(e.sites)} | ${JSON.stringify(e.paths).slice(0, 200)} | e.g. ${e.ex.slice(0, 330)}`);
  }
  console.log(`PROSE ROWS: ${rows.length} (registered ${rows.filter((r) => !r.startsWith('(unregistered)')).length})`);
}
