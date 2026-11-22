// R4-IDS PART ONE, M: THE TABLE (ids.probe.jsx's shards).   node ids-an.mjs <dir>   exit 0 (a measure: it never reds), 3 on a
// server/twin disagreement on the hits (the brief's STOP: the page is printed).
// Pages are keyed '<off|dm>|<setting>|<new|master>'; reads 'gallery', 'link' (server) and 'twin'.
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const shards = readdirSync(dir).filter((f) => /^ids-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const towns = shards.flatMap((s) => s.towns);
const P = []; const say = (s = '') => P.push(s);
const J = (x) => JSON.stringify(x);
const all = towns.flatMap((t) => Object.entries(t.pages).map(([k, p]) => { const [dm, set, shape] = k.split('|'); return { t, k, dm, set, shape, p }; }));
const gated = (x) => x.t.hidden.length && x.set !== 'allShown' && x.set !== 'unmarked';
say(`R4-IDS M (ids.probe.jsx): ${towns.length} births (${towns.filter((t) => t.hidden.length).length} hidden-house), ${all.length} pages x 3 reads (gallery, link, twin); shards ${shards.map((s) => `${s.meta.shard.join('/')} ${s.meta.started}..${s.meta.ended}`).join('; ')}`);
say(`the link's top-level keys: ${J([...new Set(towns.map((t) => J(t.linkKeys)))])}`);
say(`stored card id forms (births): ${J(Object.fromEntries([...new Set(towns.flatMap((t) => t.storedForms))].map((f) => [f, towns.filter((t) => t.storedForms.includes(f)).length])))}`);
const table = (label, xs) => {
  const reads = ['gallery', 'link', 'twin'];
  const S = {};
  for (const x of xs) for (const r of reads) for (const [s, v] of Object.entries(x.p[r]?.surf || {})) {
    const row = (S[s] = S[s] || Object.fromEntries(reads.map((rr) => [rr, [0, 0, 0, 0]])));
    for (let i = 0; i < 4; i += 1) row[r][i] += v[i];
  }
  say(`\n${label}: ${xs.length} pages; pages with a withheld name: ${xs.filter((x) => x.p.gallery?.W).length}; closed searches ${xs.filter((x) => reads.some((r) => x.p[r]?.closed)).length}`);
  say(`  surface${' '.repeat(46)}served gallery/link/twin       spells (hits) gallery/link/twin   [lane search / words-fold, gallery]`);
  for (const [s, row] of Object.entries(S).sort((a, b) => b[1].gallery[0] - a[1].gallery[0])) {
    say(`  ${s.padEnd(52)} ${reads.map((r) => row[r][0]).join('/').padEnd(30)} ${reads.map((r) => row[r][1]).join('/').padEnd(22)} [${row.gallery[2]} / ${row.gallery[3]}]`);
  }
  const towns_ = [...new Set(xs.filter((x) => x.p.gallery?.hits.length || x.p.link?.hits.length).map((x) => x.t.seed))];
  say(`  places with a hit (server): ${towns_.length}${towns_.length ? `: ${towns_.slice(0, 12).join(', ')}` : ''}`);
  for (const x of xs.filter((y) => y.p.gallery?.hits.length).slice(0, 4)) say(`    e.g. ${x.t.seed} ${x.k}: ${x.p.gallery.hits.slice(0, 4).join('; ')}`);
};
table('ALL PAGES', all);
table('GATED PAGES, Reveal off (a hidden-house town at a setting that hides a house)', all.filter((x) => gated(x) && x.dm === 'off'));
table('GATED PAGES, DM', all.filter((x) => gated(x) && x.dm === 'dm'));
table("MASTER'S STORED SHAPE, gated, Reveal off", all.filter((x) => gated(x) && x.dm === 'off' && x.shape === 'master'));
// parity: the server's gallery hits against the twin's
const dis = all.filter((x) => J(x.p.gallery?.hits) !== J(x.p.twin?.hits));
say(`\nENGINE PARITY on the hits (server gallery against the twin): ${dis.length} disagreements${dis.length ? '' : ''}`);
for (const x of dis.slice(0, 6)) say(`  STOP ${x.t.seed} ${x.k}: server ${J(x.p.gallery?.hits).slice(0, 300)} | twin ${J(x.p.twin?.hits).slice(0, 300)}`);
const ldis = all.filter((x) => J(x.p.gallery?.hits) !== J(x.p.link?.hits));
say(`gallery against link on the hits: ${ldis.length} differ`);
const st = all.filter((x) => x.p.stable);
const [same, of] = st.reduce((a, x) => [a[0] + x.p.stable[0], a[1] + x.p.stable[1]], [0, 0]);
say(`THE RE-KEY'S BASELINE: served card ids stable across two gallery reads of one row: ${same} of ${of} (${st.length} pages)`);
const ss = all.reduce((a, x) => [a[0] + (x.p.gallery?.storedServed || 0), a[1] + (x.p.gallery?.npcs || 0)], [0, 0]);
say(`served card ids that ARE the stored id (gallery): ${ss[0]} of ${ss[1]}`);
const mk = all.filter((x) => x.p.gallery?.markerKeys);
say(`served marker person keys (gallery): ${mk.reduce((a, x) => a + x.p.gallery.markerKeys, 0)} on ${mk.length} pages`);
console.log(P.join('\n'));
process.exit(dis.length ? 3 : 0);
