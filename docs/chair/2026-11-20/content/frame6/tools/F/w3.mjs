import fs from 'node:fs';
const [POOL, R] = process.argv.slice(2);
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { chainPrintName } = await import(R + 'domain/display/chainPrintName.js');
const { chainSourceOf } = await import(R + 'domain/display/chainHouses.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const STOP = new Set(['and', 'the', 'of', 'goods', 'grounds', 'areas', 'area', 'fields', 'wild', 'managed', 'deposits', 'land', 'veins', 'node', 'line', 'magical', 'luxury', 'finishing', 'processing', 'mining', 'petty', 'north', 'social', 'life', 'trade', 'manufacturing', 'crafts', 'advanced', 'armor', 'armour', 'weapons', 'animal', 'husbandry', 'fortification', 'food', 'precious', 'reed']);
const wordsOf = (c) => [...new Set([str(c.chainId).replace(/_/g, ' '), c.label, c.resource].flatMap((x) => str(x).toLowerCase().split(/[^a-z]+/)).filter((w) => w.length >= 3 && !STOP.has(w)))];
let w3 = 0, noFacts = 0, withFacts = 0; const causes = {};
for (const { seed, s } of towns) {
  const top = troubleOfWeight(s); if (!top || top.strain.strain !== 'W3') continue;
  const sh = composeTonightSheet(s, { audience: 'owner' }); if (!sh.frame) continue; w3++;
  const imp = (s.economicState?.activeChains || []).filter((c) => c?.status === 'impaired');
  const kw = [...new Set(imp.flatMap(wordsOf))];
  const base = [sh.opening, sh.frame.line, ...sh.frame.hooks, ...sh.frame.sides.flatMap((x) => [x.words, x.name, x.role, x.reason, x.line]), ...sh.people.flatMap((p) => [p.name, p.role, p.reason, p.line, p.side]), ...sh.hooks.map((h) => h.text)].filter(Boolean).join('\n');
  const all = base + '\n' + sh.facts.map((f) => f.text).join('\n');
  const hit = (t) => kw.some((w) => new RegExp(`\\b${w}(s|es)?\\b`, 'i').test(t));
  if (hit(base)) noFacts++; if (hit(all)) withFacts++;
  for (const c of imp) { const k = `depleted=${!!c.resourceDepleted} cond=${c.resourceCondition}`; causes[k] = (causes[k] || 0) + 1; }
  if (seed === 'frame-calm-village-20') for (const c of imp) { const p = chainPrintName(c, s); console.log(seed, JSON.stringify(p), chainSourceOf(c, p), c.resourceDepleted); }
}
console.log({ w3, namesShortWithoutFacts: noFacts, namesShortWithFacts: withFacts, impairedChainCauses: causes });
