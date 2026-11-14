// W2-B-DECLARE second seat — THE INSTRUMENT'S SCORE against the fixture (record 306: "scored for recall against the
// fixture at every tip"). Runs the page check (`vocabularyPageFindings`) over each fixture town's rendered dossier and
// its record, then matches each cold line to the findings of ITS town the way the reviewer matched them (REVIEW-W2B §2:
// either text contains the first 50 characters of the other, normalised). Prints RECALL by the cold list's mechanism
// class and severity, the findings by word with how many match a cold line (a floor on precision: an unmatched finding
// is read, not assumed false), and every total with and without pattern 20 (the food-endurance line, ruled a fault of
// wording, F8). Writes OUT/score.json (the full rows) and OUT/unmatched.json (the findings no cold line names: the
// precision read's population).
// TREE=<tree> node recall.mjs <cold-list.json> <out-dir>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [, , COLD, OUT] = process.argv; const TREE = process.env.TREE;
const { vocabularyPageFindings } = await import(TREE + '/src/domain/coherence/vocabularyPageFindings.js');
const cold = JSON.parse(fs.readFileSync(COLD, 'utf8')).lines;
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(`${OUT}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const views = (txt) => { const o = {}; let cur = '_'; for (const l of txt.split('\n')) { const m = l.match(/^== (.*) ==/); if (m) { cur = m[1]; o[cur] = []; continue; } if (l) (o[cur] ||= []).push(l); } return o; };
const norm = (s) => String(s).toLowerCase().replace(/[“”"‘’'`]/g, '').replace(/\s+/g, ' ').trim();
const same = (a, b) => { const x = norm(a); const y = norm(b); return x.includes(y.slice(0, 50)) || y.includes(x.slice(0, 50)); };
const P20 = /^food endurance:|outlying fields are lost|has taken the outlying fields/i;
/** @type {Array<any>} */ const findings = [];
for (const [seed, s] of corpus) {
  const txt = fs.readFileSync(`${OUT}/dumps/${seed}.txt`, 'utf8');
  for (const f of vocabularyPageFindings(s, views(txt))) findings.push({ seed, ...f });
}
const rows = cold.map((c) => {
  const hits = findings.filter((f) => f.seed === c.town.seed && same(f.quote, c.sentence));
  for (const f of hits) f.cold = c.n;
  return { n: c.n, seed: c.town.seed, sev: c.severity, mech: c.mechanism, p20: P20.test(c.sentence), found: hits.length > 0, words: [...new Set(hits.map((f) => f.word))] };
});
const pct = (a, b) => (b ? `${a}/${b} (${Math.round((100 * a) / b)}%)` : '0/0');
const table = (rs) => {
  const by = {}; for (const r of rs) { (by[r.mech] ||= [0, 0]); by[r.mech][1]++; if (r.found) by[r.mech][0]++; }
  return Object.entries(by).sort((a, b) => b[1][1] - a[1][1]).map(([m, [a, b]]) => `  ${pct(a, b).padEnd(14)} ${m}`).join('\n');
};
const sev = (rs) => ['HIGH', 'MED', 'LOW'].map((v) => `${v} ${pct(rs.filter((r) => r.sev === v && r.found).length, rs.filter((r) => r.sev === v).length)}`).join(' · ');
const noP20 = rows.filter((r) => !r.p20);
console.log(`RECALL ${pct(rows.filter((r) => r.found).length, rows.length)} · ${sev(rows)}`);
console.log(`RECALL without pattern 20 ${pct(noP20.filter((r) => r.found).length, noP20.length)} · ${sev(noP20)}`);
console.log('by mechanism:\n' + table(rows));
const fP20 = findings.filter((f) => P20.test(f.quote));
const matched = findings.filter((f) => f.cold);
console.log(`FINDINGS ${findings.length} in ${new Set(findings.map((f) => f.seed)).size} towns · matching a cold line ${matched.length} · unmatched ${findings.length - matched.length}`);
console.log(`FINDINGS without pattern 20 ${findings.length - fP20.length} · matching ${matched.filter((f) => !P20.test(f.quote)).length}`);
const byWord = {}; for (const f of findings) { (byWord[f.word] ||= [0, 0]); byWord[f.word][0]++; if (f.cold) byWord[f.word][1]++; }
console.log('by word (findings, matching a cold line): ' + Object.entries(byWord).sort((a, b) => b[1][0] - a[1][0]).map(([w, [a, b]]) => `${w} ${a}/${b}`).join(' · '));
fs.writeFileSync(`${OUT}/score.json`, JSON.stringify({ rows, findings }, null, 1));
fs.writeFileSync(`${OUT}/unmatched.json`, JSON.stringify(findings.filter((f) => !f.cold), null, 1));
