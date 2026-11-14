// TREE=<tree> node recallFam.mjs <cold.json> <fixture-out> — recall overall and by class; per family: cold lines it catches, and those ONLY it catches
import fs from 'node:fs'; import zlib from 'node:zlib';
const [, , COLD, OUT] = process.argv; const TREE = process.env.TREE;
const { vocabularyPageFindings } = await import(TREE + '/src/domain/coherence/vocabularyPageFindings.js');
const RW = await import(TREE + '/src/domain/facts/registeredWords.js');
const fam = (w) => (w.startsWith('house: ') ? 'house' : w.startsWith('resource: ') ? 'resource' : RW.THINGS[w] ? 'thing'
  : ['clergy', 'armedForce', 'guardCaptain', 'notary', 'smith', 'mason', 'physician', 'armoury', 'prisoner'].includes(w) ? 'role'
  : ['openTrade', 'famineToCome'].includes(w) ? 'normal' : RW.NEW_WORDS[w]?.kind === 'thing' ? 'handthing' : RW.NEW_WORDS[w]?.kind);
const cold = JSON.parse(fs.readFileSync(COLD, 'utf8')).lines;
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(`${OUT}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const views = (txt) => { const o = {}; let cur = '_'; for (const l of txt.split('\n')) { const m = l.match(/^== (.*) ==/); if (m) { cur = m[1]; o[cur] = []; continue; } if (l) (o[cur] ||= []).push(l); } return o; };
const norm = (s) => String(s).toLowerCase().replace(/[“”"‘’'`]/g, '').replace(/\s+/g, ' ').trim();
const same = (a, b) => { const x = norm(a); const y = norm(b); return x.includes(y.slice(0, 50)) || y.includes(x.slice(0, 50)); };
const P20 = /^food endurance:|outlying fields are lost|has taken the outlying fields/i;
const findings = [];
for (const [seed, s] of corpus) for (const f of vocabularyPageFindings(s, views(fs.readFileSync(`${OUT}/dumps/${seed}.txt`, 'utf8')))) findings.push({ seed, fam: fam(f.word), ...f });
const rows = cold.map((c) => { const hits = findings.filter((f) => f.seed === c.town.seed && same(f.quote, c.sentence)); for (const f of hits) f.cold = true; return { sev: c.severity, mech: c.mechanism, p20: P20.test(c.sentence), fams: new Set(hits.map((f) => f.fam)) }; });
const found = rows.filter((r) => r.fams.size); const n20 = rows.filter((r) => !r.p20);
console.log(`RECALL ${found.length}/${rows.length} · HIGH ${found.filter((r) => r.sev === 'HIGH').length}/${rows.filter((r) => r.sev === 'HIGH').length} · without p20 ${n20.filter((r) => r.fams.size).length}/${n20.length}`);
const byM = {}; for (const r of rows) { (byM[r.mech] ||= [0, 0]); byM[r.mech][1]++; if (r.fams.size) byM[r.mech][0]++; }
console.log('by class: ' + Object.entries(byM).sort((a, b) => b[1][1] - a[1][1]).map(([m, [a, b]]) => `${m.slice(0, 40)} ${a}/${b}`).join(' · '));
const fams = [...new Set(findings.map((f) => f.fam))].sort();
console.log('by family (findings · matching · cold lines caught · caught ONLY by it):');
for (const x of fams) { const fs2 = findings.filter((f) => f.fam === x); console.log(`  ${x.padEnd(9)} ${fs2.length} · ${fs2.filter((f) => f.cold).length} · ${rows.filter((r) => r.fams.has(x)).length} · ${rows.filter((r) => r.fams.has(x) && r.fams.size === 1).length}`); }
console.log(`FINDINGS ${findings.length} · matching ${findings.filter((f) => f.cold).length} · without p20 ${findings.filter((f) => !P20.test(f.quote)).length}`);
