// TREE OUT node sample.mjs <findings.json> <perFamily> <salt> — a fixed-seed sample, distinct words first, with each town's leaf evidence
import fs from 'node:fs'; import zlib from 'node:zlib';
const { factsOf } = await import(process.env.TREE + '/src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import(process.env.TREE + '/src/domain/facts/institutions.js');
const F = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const per = Number(process.argv[3] || 6); const salt = process.argv[4] || 'p';
const corpus = new Map(zlib.gunzipSync(fs.readFileSync(`${process.env.OUT}/corpus.ndjson.gz`)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const h = (s) => { let x = 2166136261; for (const c of salt + s) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0; } return x; };
const uniq = new Map(); for (const f of F) { const k = `${f.seed}|${f.word}|${f.side}|${f.quote}`; if (!uniq.has(k)) uniq.set(k, f); }
const byFam = {}; for (const f of uniq.values()) (byFam[f.fam] ||= []).push(f);
const out = [];
for (const [fam, list] of Object.entries(byFam).sort()) {
  list.sort((a, b) => h(a.seed + a.word + a.quote) - h(b.seed + b.word + b.quote));
  const words = new Set(); const pick = [];
  for (const f of list) { if (pick.length >= per) break; if (!words.has(f.word)) { words.add(f.word); pick.push(f); } }
  for (const f of list) { if (pick.length >= per) break; if (!pick.includes(f)) pick.push(f); }
  out.push(...pick);
}
let i = 0;
for (const f of out) {
  const s = corpus.get(f.seed); const fa = factsOf(s); const names = liveInstitutionNames(s);
  const crisis = (fa.crisis?.kinds ? [...fa.crisis.kinds] : (s.stress || []).map((x) => x?.type)).join(',') || 'calm';
  console.log(`\n${++i}. [${f.fam}] ${f.word} ${f.side} · ${f.seed} · ${f.view}\n   "${f.quote.slice(0, 230)}"`);
  const ev = { tier: s.tier, pop: s.population, crisis, war: fa.warState, church: fa.faith?.hasChurch, shrine: fa.faith?.shrine, sacred: fa.sacredHouse,
    famine: fa.famine?.famine, defence: Object.entries(fa.defence || {}).filter(([, v]) => v === true).map(([k]) => k).join(','),
    res: (s.config?.nearbyResources || []).join(','), powers: (s.powerStructure?.factions || []).map((x) => x.faction).join(' / ') };
  if (/^(house|role|thing|handthing)$/.test(f.fam)) ev.roster = names.join(' · ').slice(0, 420);
  console.log('   ' + JSON.stringify(ev));
}
