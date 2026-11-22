#!/usr/bin/env node
/**
 * RUN (from the repository root; renders first with run-render.b.mjs):
 *   node docs/chair/2026-11-20/content/page/measures/B/f6.b.mjs > docs/chair/2026-11-20/content/page/measures/B/f6.out.txt 2>&1
 *
 * PAGE-1's measure brief, section B.2 (F6, thin pages: Daily Life, Outlook, Magic). Helper B, 2026-11-20.
 * RENDERED: ./views (the page census walker, hxd-<size>-0..9, 60 towns): per page and size, line count, the distinct short
 *   labels, and the full text of one thorp, one village and one city.
 * RECORD: the chair's 300 (hxd-<size>-0..49, DEFAULT_CONFIG untouched): every record field on the page's subject, its fill
 *   rate over the 300, and, over the 60 rendered, whether its text is printed on the page itself or on any other page
 *   (a normalised substring match of the field's first 48 characters, names left in: a field reworded at print reads as
 *   NOT printed, so "printed" is a FLOOR).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const L = resolve(HERE, '../../../../../../..');
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { deriveDailyLife } = await import(`${L}/src/domain/dailyLife.js`);
const { deriveMagicProfile } = await import(`${L}/src/domain/magicProfile.js`);
const { deriveMagicReliance } = await import(`${L}/src/domain/magicReliance.js`);
await loadGenerationLawPayloads();

const PAGES = { 'Daily Life': 'World/Daily Life', Outlook: 'Systems/Outlook', Magic: 'Systems/Magic' };
const views = Object.fromEntries(readdirSync(join(HERE, 'views')).filter((f) => f.endsWith('.json')).map((f) => { const j = JSON.parse(readFileSync(join(HERE, 'views', f), 'utf8')); return [j.seed, j]; }));
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(0)}%` : 'n/a');

console.log(`F6 RENDERED (${Object.keys(views).length} towns, 10 a size)`);
for (const [page, key] of Object.entries(PAGES)) {
  console.log(`\n════ ${page} (${key})`);
  for (const size of SIZES) {
    const vs = Object.values(views).filter((v) => v.size === size).map((v) => v.views[key] || []);
    const n = vs.map((l) => l.length); const words = vs.map((l) => l.join(' ').split(/\s+/).filter(Boolean).length);
    const labels = tally(vs.flatMap((l) => l.filter((x) => x.length <= 40 && !/[.!?]$/.test(x)).map((x) => x.replace(/[:·].*$/, '').replace(/^(Availability|Legality|Institutional control|Service cost|Risk|Religious acceptance).*/, '$1'))));
    console.log(`  ${size.padEnd(10)} lines mean ${(n.reduce((a, b) => a + b, 0) / n.length).toFixed(1)} (min ${Math.min(...n)}, max ${Math.max(...n)}); words mean ${(words.reduce((a, b) => a + b, 0) / words.length).toFixed(0)}; distinct short labels ${labels.length}: ${labels.slice(0, 22).map(([k, c]) => `${k}(${c})`).join(' ')}`);
  }
  for (const seed of ['hxd-thorp-0', 'hxd-village-0', 'hxd-city-0']) console.log(`  SAMPLE ${seed}: ${(views[seed]?.views[key] || []).join(' ¶ ')}`);
}

// ── RECORD ──
const towns = [];
for (const size of SIZES) for (let i = 0; i < 50; i++) towns.push({ seed: `hxd-${size}-${i}`, size, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }) });
// NOTE: the rendered towns were stamped with their public prose before render (render.b.jsx :: withPublicProse); that stamp
// (src/components/new/publicProseCompose.js) imports .jsx and cannot load in plain node, so the record here is the unstamped
// birth. The fields read below are generator fields the stamp does not write (INFERRED from publicProse.js's purpose).

const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const printedWhere = (seed, text) => { const v = views[seed]; if (!v) return null; const probe = norm(text).slice(0, 48); if (probe.length < 12) return null;
  return Object.entries(v.views).filter(([, lines]) => lines.some((l) => norm(l).includes(probe))).map(([k]) => k); };
const str = (v) => (typeof v === 'string' && v.trim() && v.trim() !== '—' ? v.trim() : null);
const texts = (v) => (Array.isArray(v) ? v : v ? [v] : []).map((x) => (typeof x === 'string' ? x : x?.title || x?.description || x?.desc || x?.text || x?.hook || x?.name || null)).filter(Boolean);

/** fields: [page, name, (t) => string[] (texts; empty = unfilled), note] */
const FIELDS = [
  ...['food_culture', 'dawn_work', 'gathering_places', 'child_warnings', 'commoner_resentments', 'outsider_impressions', 'unspoken_topics', 'recent_changes'].map((k) => ['Daily Life', `deriveDailyLife().slots.${k} (src/domain/dailyLife.js :109 slots, :570)`, (t, dl) => [str(dl.slots[k]?.text)].filter(Boolean)]),
  ['Daily Life', 'culturalIdentity.foodways', (t) => [str(t.culturalIdentity?.foodways)].filter(Boolean)],
  ['Daily Life', 'culturalIdentity.sacredLife', (t) => [str(t.culturalIdentity?.sacredLife)].filter(Boolean)],
  ['Daily Life', 'culturalIdentity.builtForm', (t) => [str(t.culturalIdentity?.builtForm)].filter(Boolean)],
  ['Daily Life', 'culturalIdentity.civicPattern', (t) => [str(t.culturalIdentity?.civicPattern)].filter(Boolean)],
  ['Daily Life', 'culturalIdentity.exchangePattern', (t) => [str(t.culturalIdentity?.exchangePattern)].filter(Boolean)],
  ['Daily Life', 'culturalNotes', (t) => [str(t.culturalNotes)].filter(Boolean)],
  ['Daily Life', 'economicState.safetyProfile.safetyDesc', (t) => [str(t.economicState?.safetyProfile?.safetyDesc)].filter(Boolean)],
  ['Daily Life', 'economicState.safetyProfile.crimeTypes[].desc', (t) => (t.economicState?.safetyProfile?.crimeTypes || []).map((c) => str(c?.desc)).filter(Boolean)],
  ['Daily Life', 'economicState.situationDesc', (t) => [str(t.economicState?.situationDesc)].filter(Boolean)],
  ['Daily Life', 'spatialLayout.quarters[].desc', (t) => (t.spatialLayout?.quarters || []).map((q) => str(q?.desc)).filter(Boolean)],
  ['Daily Life', 'arrivalScene (text)', (t) => [str(typeof t.arrivalScene === 'string' ? t.arrivalScene : t.arrivalScene?.text ?? t.arrivalScene?.paragraph)].filter(Boolean)],
  ['Outlook', 'economicViability.summary', (t) => [str(t.economicViability?.summary)].filter(Boolean)],
  ['Outlook', 'economicViability.issues[]', (t) => texts(t.economicViability?.issues)],
  ['Outlook', 'economicViability.warnings[]', (t) => texts(t.economicViability?.warnings)],
  ['Outlook', 'economicViability.dependencies[]', (t) => texts(t.economicViability?.dependencies)],
  ['Outlook', 'economicViability.suggestions[]', (t) => texts(t.economicViability?.suggestions)],
  ['Outlook', 'economicViability.plotHooks[]', (t) => texts(t.economicViability?.plotHooks)],
  ['Outlook', 'structuralViolations[]', (t) => texts(t.structuralViolations)],
  ['Outlook', 'structuralSuggestions[]', (t) => texts(t.structuralSuggestions)],
  ['Outlook', 'coherenceNotes[]', (t) => texts(t.coherenceNotes)],
  ['Outlook', 'pressureSentence', (t) => [str(typeof t.pressureSentence === 'string' ? t.pressureSentence : t.pressureSentence?.text)].filter(Boolean)],
  ['Outlook', 'isolationSupport (applicable)', (t) => (t.isolationSupport?.applicable ? [`${t.isolationSupport.status}`] : [])],
  ['Magic', 'magicProfile.contributors[].reason (src/domain/magicProfile.js :404)', (t, dl, mp) => (mp?.contributors || []).map((c) => str(c?.reason)).filter(Boolean)],
  ['Magic', 'magicReliance.practitioners (src/domain/magicReliance.js)', (t, dl, mp, mr) => mr.practitioners || []],
  ['Magic', 'magicReliance.dependents', (t, dl, mp, mr) => mr.dependents || []],
  ['Magic', 'defenseProfile.traditions (any true)', (t) => Object.entries(t.defenseProfile?.traditions || {}).filter(([, v]) => v === true).map(([k]) => k)],
  ['Magic', 'NPCs who practise (role/title says mage, witch, priest-healer...)', (t, dl, mp, mr) => (mr.practitioners || []).filter((p) => (t.npcs || []).some((n) => n?.name === p))],
  ['Magic', 'arcane institutions on the roster (category Magic/Arcane)', (t) => (t.institutions || []).filter((i) => /magic|arcane/i.test(String(i?.category ?? ''))).map((i) => i.name)],
];

console.log(`\n\nF6 RECORD (300 towns): field | filled (of 300) by size | over the 60 rendered: items printed on THIS page / on ANOTHER page (where) / nowhere`);
const rows = towns.map((x) => { const dl = deriveDailyLife(x.t); let mp = null; try { mp = deriveMagicProfile(x.t); } catch { /* none */ } return { ...x, dl, mp, mr: deriveMagicReliance(x.t) }; });
for (const [page, name, get] of FIELDS) {
  const filled = rows.map((r) => ({ r, items: get(r.t, r.dl, r.mp, r.mr) }));
  const bySize = SIZES.map((s) => `${s.slice(0, 4)} ${filled.filter((f) => f.r.size === s && f.items.length).length}`).join(' ');
  let own = 0, other = 0, none = 0; const where = [];
  for (const f of filled) { if (!views[f.r.seed]) continue; for (const it of f.items) { const w = printedWhere(f.r.seed, it); if (w == null) continue; if (w.includes(PAGES[page])) own++; else if (w.length) { other++; where.push(...w); } else none++; } }
  const sample = filled.find((f) => f.items.length)?.items[0];
  console.log(`\n[${page}] ${name}\n   filled ${filled.filter((f) => f.items.length).length}/300 (${bySize}); items in the 60: own page ${own}, other page ${other} ${JSON.stringify(tally(where).slice(0, 4))}, nowhere ${none}\n   e.g. "${String(sample ?? '').slice(0, 170)}"`);
}
console.log(`\n  dailyLife slot texts that are the module's generic fallback (contain "any town"/"the small grievances"): ${rows.filter((r) => /small grievances of any|any town/i.test(r.dl.slots.commoner_resentments?.text || '')).length}/300 commoner_resentments; distinct texts per slot over 300: ${['food_culture', 'dawn_work', 'gathering_places', 'child_warnings', 'commoner_resentments', 'outsider_impressions', 'unspoken_topics', 'recent_changes'].map((k) => `${k} ${new Set(rows.map((r) => r.dl.slots[k]?.text)).size}`).join(' · ')}`);
