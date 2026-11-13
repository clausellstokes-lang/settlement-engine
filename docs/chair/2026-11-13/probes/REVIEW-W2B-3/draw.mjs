// REVIEW-W2B-3 item 1: my own precision draw over the page member's findings at the tip.
//   TREE=<tip> OUT=<census out> node draw.mjs <pagemeasure result.json> <draw.json>
// Order: sha256(SALT | seed | quote), ascending. A whole-list draw of SIXTY distinct (town, sentence), then each family the
// lane changed since the second read topped up to TEN distinct (town, sentence) of its own. Each drawn line is written with
// a FACT PACKET read from the record (and its dump's neighbouring lines) for the read.
import fs from 'node:fs'; import zlib from 'node:zlib'; import crypto from 'node:crypto';
const SALT = 'review-w2b-3-precision-2026-11-13';
const TREE = process.env.TREE; const OUT = process.env.OUT;
const { factsOf } = await import(TREE + '/src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import(TREE + '/src/domain/facts/institutions.js');
const { magicPractitioners } = await import(TREE + '/src/domain/magicReliance.js');
const { dmPowerViewOf } = await import(TREE + '/src/domain/people/patronage.js');
const res = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const h = (s) => crypto.createHash('sha256').update(s).digest('hex');
const FAMILY = (f) => {
  if (f.word === 'streets') return 'streets';
  if (f.word === 'quarters') return 'quarters';
  if (f.word === 'market') return 'market phrase';
  if (f.word === 'house: alchemist') return 'alchemist phrase';
  if (f.word === 'housesCount') return 'counted houses';
  if (f.word === 'law' || f.word === 'lawEnforcement') return 'law';
  if (f.word === 'temple' || f.word === 'religiousHouses' || f.word === 'shrine') return 'church words';
  if (f.word === 'powersCount') return 'powers count';
  return 'other';
};
const FAMILIES = ['streets', 'quarters', 'market phrase', 'alchemist phrase', 'counted houses', 'law', 'church words', 'powers count'];
const byKey = new Map();
for (const f of res.findings) {
  const k = `${f.seed}\t${f.quote}`;
  if (!byKey.has(k)) byKey.set(k, { seed: f.seed, quote: f.quote, views: new Set(), words: new Set(), families: new Set(), source: f.source, file: f.file });
  const e = byKey.get(k); e.views.add(f.view); e.words.add(`${f.word}/${f.side}`); e.families.add(FAMILY(f));
}
const all = [...byKey.values()].map((e) => ({ ...e, order: h(`${SALT}|${e.seed}|${e.quote}`) })).sort((a, b) => (a.order < b.order ? -1 : 1));
const famCount = {}; for (const e of all) for (const fam of e.families) famCount[fam] = (famCount[fam] || 0) + 1;
const drawn = new Map();
for (const e of all.slice(0, 60)) drawn.set(`${e.seed}\t${e.quote}`, { ...e, why: ['whole list'] });
for (const fam of FAMILIES) {
  const have = [...drawn.values()].filter((e) => e.families.has(fam)).length;
  let need = 10 - have;
  for (const e of all) { if (need <= 0) break; if (!e.families.has(fam)) continue; const k = `${e.seed}\t${e.quote}`; if (drawn.has(k)) continue; drawn.set(k, { ...e, why: [`top-up ${fam}`] }); need--; }
}
// the fact packets
const want = new Set([...drawn.values()].map((e) => e.seed));
const recs = new Map();
for (const line of zlib.gunzipSync(fs.readFileSync(`${OUT}/corpus.ndjson.gz`)).toString().trim().split('\n')) {
  const { seed, s } = JSON.parse(line); if (want.has(seed)) recs.set(seed, s);
}
const out = [];
let n = 0;
for (const e of drawn.values()) {
  const s = recs.get(e.seed); const f = factsOf(s); const names = liveInstitutionNames(s);
  const dump = fs.readFileSync(`${OUT}/dumps/${e.seed}.txt`, 'utf8').split('\n');
  const at = dump.findIndex((l) => l.includes(e.quote.slice(0, 60)));
  const fr = s?.economicState?.foodSecurity?.foodRecord || {};
  let rt = null; try { rt = dmPowerViewOf(s)?.rulingThree?.map((x) => x?.name || x?.label || x?.faction || x) ?? null; } catch { rt = 'err'; }
  out.push({
    n: ++n, why: e.why, families: [...e.families], words: [...e.words], views: [...e.views], seed: e.seed, source: e.source, file: e.file, quote: e.quote,
    town: { name: s?.name, tier: s?.tier, population: s?.population, crisis: [...(f?.crisis ?? [])], market: f?.market, faith: f?.faith ? { hasChurch: f.faith.hasChurch, accessOnly: f.faith.accessOnly, seniorCleric: f.faith.seniorCleric ? 'yes' : null } : null,
      sacredHouse: f?.sacredHouse, guard: f?.guardPresence, defence: Object.fromEntries(Object.entries(f?.defence || {}).filter(([, v]) => v === true).map(([k]) => [k, true])),
      powers: (s?.powerStructure?.factions || []).map((x) => `${x.faction ?? x.name} ${x.power ?? ''}`), rulingThree: rt, practitioners: (() => { try { return magicPractitioners(s).length; } catch { return 'err'; } })(),
      food: { growsMoreThanEats: fr.growsMoreThanEats, normalImportPct: fr.normalImportPct }, roster: names },
    context: at < 0 ? [] : dump.slice(Math.max(0, at - 2), at + 3).map((l) => l.slice(0, 300)),
  });
}
fs.writeFileSync(process.argv[3], JSON.stringify({ salt: SALT, pageListLines: all.length, familyLines: famCount, drawn: out }, null, 1));
console.log('page-list (town, sentence) pairs', all.length, 'family sizes', JSON.stringify(famCount), 'drawn', out.length);
