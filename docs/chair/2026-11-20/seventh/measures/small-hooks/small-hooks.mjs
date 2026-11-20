// Small-place hooks measure. Usage: node small-hooks.mjs /home/user/wt/line > report.txt
// Births copied from owner-q3/born.mjs: generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG, settType}), null, {seed:`hxd-<size>-<i>`, customContent:{}}).
const L = process.argv[2] || '/home/user/wt/line';
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { composeTonightSheet } = await import(`${L}/src/domain/summary/tonightSheet.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village'];
const N = 50;
const out = [];
const p = (...a) => out.push(a.join(' '));

// ---- birth and record ----
const towns = [];
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const sheet = composeTonightSheet(t);
  towns.push({
    size, seed, population: t.population,
    institutions: (t.institutions || []).map((x) => x.name).filter(Boolean),
    powers: (t.powerStructure?.factions || []).map((f) => ({ name: f.faction, category: f.category })),
    tensions: (t.history?.currentTensions || []).map((x) => ({ type: x.type, description: x.description, plotHooks: x.plotHooks || [] })),
    opening: sheet.opening, sheetHooks: sheet.hooks,
  });
}

// ---- 1. tension kinds by size ----
p('SMALL-PLACE HOOKS MEASURE. Tree:', L, '| 50 towns each of thorp, hamlet, village, seeds hxd-<size>-0..49 | composeTonightSheet(town) alone.');
p('Lines: tension description = history.currentTensions[].description; tension hook = its plotHooks[]; sheet hook = composeTonightSheet(town).hooks[].text (sentence-cased by the composer, source = hooks[].source). All counts are towns (a town printing a line twice counts once).');
p('\n===== 1. TENSION KINDS BY SIZE =====');
for (const size of SIZES) {
  const g = towns.filter((t) => t.size === size);
  const pops = g.map((t) => t.population);
  const kinds = new Map();
  for (const t of g) for (const k of new Set(t.tensions.map((x) => x.type))) kinds.set(k, (kinds.get(k) || 0) + 1);
  const nTen = g.map((t) => t.tensions.length);
  p(`\n${size}: population min ${Math.min(...pops)} max ${Math.max(...pops)} mean ${(pops.reduce((a, b) => a + b, 0) / pops.length).toFixed(1)}; towns with no tension: ${g.filter((t) => !t.tensions.length).length}/50; tensions per town: ${[0, 1, 2, 3, 4].map((n) => `${n}:${nTen.filter((x) => x === n).length}`).join(' ')}${nTen.some((x) => x > 4) ? ' (some >4)' : ''}`);
  for (const [k, c] of [...kinds].sort((a, b) => b[1] - a[1])) p(`  ${String(c).padStart(3)}  ${k}`);
  const nSheet = g.map((t) => t.sheetHooks.length);
  p(`  sheet hooks per town: ${[0, 1, 2, 3].map((n) => `${n}:${nSheet.filter((x) => x === n).length}`).join(' ')}`);
}

// ---- line inventory ----
// each item: {town, where, source, text}
const items = [];
for (const t of towns) {
  for (const x of t.tensions) {
    if (x.description) items.push({ t, where: 'tension description', source: x.type, text: x.description, kind: x.type });
    for (const h of x.plotHooks) if (h) items.push({ t, where: 'tension hook', source: x.type, text: h, kind: x.type });
  }
  for (const h of t.sheetHooks) items.push({ t, where: 'sheet hook', source: h.source, text: h.text });
}
const bySizeCount = (list) => { const m = Object.fromEntries(SIZES.map((s) => [s, new Set()])); for (const it of list) m[it.t.size].add(it.t.seed); return SIZES.map((s) => m[s].size); };
const fmt = (c) => `thorp ${String(c[0]).padStart(2)} hamlet ${String(c[1]).padStart(2)} village ${String(c[2]).padStart(2)}`;

// ---- 2. per kind ----
p('\n===== 2. EACH TENSION KIND: DISTINCT DESCRIPTIONS AND HOOKS AS PRINTED (towns printing it, by size) =====');
const kindsSeen = [...new Set(items.filter((i) => i.kind).map((i) => i.kind))].sort();
for (const k of kindsSeen) {
  p(`\n--- ${k} ---`);
  for (const where of ['tension description', 'tension hook']) {
    const g = new Map();
    for (const it of items.filter((i) => i.kind === k && i.where === where)) { if (!g.has(it.text)) g.set(it.text, []); g.get(it.text).push(it); }
    p(`  ${where}s (${g.size} distinct):`);
    for (const [text, list] of [...g].sort((a, b) => bySizeCount(b[1]).reduce((x, y) => x + y) - bySizeCount(a[1]).reduce((x, y) => x + y))) p(`    [${fmt(bySizeCount(list))}] ${text}`);
  }
}

// ---- 3. presumption table ----
const lc = (s) => s.toLowerCase();
const has = (names, re) => names.some((n) => re.test(lc(n)));
const instN = (t) => t.institutions; const powN = (t) => t.powers.map((x) => x.name);
const CLASSES = [
  { id: 'a', label: 'street, streets, alley, quarter, district, ward', words: ['street', 'streets', 'alley', 'quarter', 'district', 'ward'] },
  { id: 'b', label: 'papers, records, ledger, letter, written, writing, signature, seal, document', words: ['papers', 'records', 'ledger', 'letter', 'written', 'writing', 'signature', 'seal', 'document'] },
  { id: 'c', label: 'market, stall, market day', words: ['market', 'stall', 'market day'], testLabel: 'institution name contains "market" (other than "black market")', test: (t) => instN(t).some((n) => /market/.test(lc(n).replace(/black market/g, ''))) },
  { id: 'd', label: 'guild', words: ['guild'], testLabel: 'institution or power name contains "guild"', test: (t) => has([...instN(t), ...powN(t)], /guild/) },
  { id: 'e', label: 'court, magistrate, judge, trial', words: ['court', 'magistrate', 'judge', 'trial'], testLabel: 'institution name contains court/magistrate/tribunal', test: (t) => has(instN(t), /court|magistrate|tribunal/) },
  { id: 'f', label: 'guard, watch, garrison, captain, militia', words: ['guard', 'watch', 'garrison', 'captain', 'militia'], testLabel: 'institution name contains guard/watch/garrison/militia/barracks', test: (t) => has(instN(t), /guard|watch|garrison|militia|barracks/) },
  { id: 'g', label: 'walls, gate, gates', words: ['walls', 'gate', 'gates'], testLabel: 'institution name contains wall/gate', test: (t) => has(instN(t), /wall|gate/) },
  { id: 'h', label: 'council, hall, chamber', words: ['council', 'hall', 'chamber'], testLabel: 'power or institution name contains council/hall', test: (t) => has([...instN(t), ...powN(t)], /council|hall/) },
  { id: 'i', label: 'temple, cathedral, church, shrine, priest', words: ['temple', 'cathedral', 'church', 'shrine', 'priest'], testLabel: 'institution or power name contains temple/cathedral/church/shrine/monastery/chapel/religious', test: (t) => has([...instN(t), ...powN(t)], /temple|cathedral|church|shrine|monastery|chapel|religious/) },
  { id: 'j', label: 'apprentice, buyers, shop, workshop', words: ['apprentice', 'buyers', 'shop', 'workshop'] },
  { id: 'k', label: 'noble, lord, heir, crown, throne', words: ['noble', 'lord', 'heir', 'crown', 'throne'] },
];
// Matching: whole word, case-insensitive, the listed word plus an optional plural "s"/"es" (e.g. "guards", "stalls", "lords"). Not counted: other derived forms (watchman, lordship, nobility, judged, guardian).
for (const c of CLASSES) c.re = new RegExp(`\\b(${c.words.map((w) => w.replace(/ /g, '\\s+')).join('|')})(s|es)?\\b`, 'i');
for (const it of items) { it.hits = CLASSES.filter((c) => c.re.test(it.text)).map((c) => c.id); it.fails = CLASSES.filter((c) => c.test && it.hits.includes(c.id) && !c.test(it.t)).map((c) => c.id); }

p('\n===== 3. PRESUMPTION TABLE =====');
p('Match rule: whole word, case-insensitive, listed word with optional plural s/es. Each row: [towns printing it by size] {where} {tension kind or sheet source}. For classes with a record test: "lacks" = of those towns, how many hold NO such thing in the record.');
const classSummary = {};
for (const c of CLASSES) {
  const hit = items.filter((i) => i.hits.includes(c.id));
  const g = new Map();
  for (const it of hit) { const key = `${it.where}\u0001${it.source}\u0001${it.text}`; if (!g.has(key)) g.set(key, []); g.get(key).push(it); }
  const all = bySizeCount(hit);
  const failing = bySizeCount(hit.filter((i) => i.fails.includes(c.id)));
  classSummary[c.id] = { all, failing };
  p(`\n--- (${c.id}) ${c.label} ${c.test ? `| test: ${c.testLabel}` : '| count only'} ---`);
  p(`  towns printing any line of this class: ${fmt(all)}${c.test ? `; of those, record lacks it: ${fmt(failing)}` : ''}; distinct lines: ${g.size}`);
  const rows = [...g].map(([key, list]) => { const [where, source, text] = key.split('\u0001'); return { where, source, text, n: bySizeCount(list), f: bySizeCount(list.filter((i) => i.fails.includes(c.id))) }; })
    .sort((a, b) => b.n.reduce((x, y) => x + y) - a.n.reduce((x, y) => x + y) || a.text.localeCompare(b.text));
  for (const r of rows) p(`  [${fmt(r.n)}]${c.test ? ` lacks [${fmt(r.f)}]` : ''} {${r.where}} {${r.source}} ${r.text}`);
}

// ---- 4. worst fifteen at thorp/hamlet ----
p('\n===== 4. FIFTEEN WORST EXAMPLES AT THORP AND HAMLET =====');
p('Ranking: number of failed record tests (c)-(i) in the line, then number of count-only classes (a)(b)(j)(k) hit, then thorp before hamlet, then smaller population. One example per distinct line (text compared without the composer added capital/final period); every place that town prints it is listed.');
const cand = items.filter((i) => (i.t.size === 'thorp' || i.t.size === 'hamlet') && (i.fails.length || i.hits.length));
const cOnly = (i) => i.hits.filter((h) => 'abjk'.includes(h)).length;
cand.sort((a, b) => b.fails.length - a.fails.length || cOnly(b) - cOnly(a) || (a.t.size === 'thorp' ? 0 : 1) - (b.t.size === 'thorp' ? 0 : 1) || a.t.population - b.t.population || a.t.seed.localeCompare(b.t.seed));
const seenText = new Set(); let n = 0;
for (const it of cand) {
  const norm = (s) => s.toLowerCase().replace(/[.!?]$/, '');
  if (seenText.has(norm(it.text))) continue; seenText.add(norm(it.text)); n++;
  const places = items.filter((j) => j.t === it.t && norm(j.text) === norm(it.text)).map((j) => `${j.where} (source: ${j.source})`);
  p(`\n${n}. "${it.text}"`);
  p(`   printed as: ${places.join(' + ')}; classes hit: ${it.hits.join(',')}; failed tests: ${it.fails.join(',') || 'none'}`);
  p(`   town: ${it.t.seed} (${it.t.size}), population ${it.t.population}`);
  p(`   institutions: ${it.t.institutions.join('; ')}`);
  p(`   powers: ${it.t.powers.map((x) => `${x.name} [${x.category}]`).join('; ')}`);
  if (n >= 15) break;
}

// ---- 5. shares ----
p('\n===== 5. SHARES =====');
for (const size of SIZES) {
  const g = towns.filter((t) => t.size === size);
  const its = (t) => items.filter((i) => i.t === t);
  const failT = g.filter((t) => its(t).some((i) => i.fails.length)).length;
  const abT = g.filter((t) => its(t).some((i) => i.hits.includes('a') || i.hits.includes('b'))).length;
  const failSheet = g.filter((t) => its(t).some((i) => i.fails.length && i.where === 'sheet hook')).length;
  const either = g.filter((t) => its(t).some((i) => i.fails.length || i.hits.includes('a') || i.hits.includes('b'))).length;
  p(`${size}: >=1 line failing a record test (c)-(i): ${failT}/50 (${failT * 2}%) [on the session sheet itself: ${failSheet}/50]; >=1 line in class (a) or (b): ${abT}/50 (${abT * 2}%); either: ${either}/50`);
}
p('\nRaw records per town (seed | pop | institutions | powers | tension types | opening):');
for (const t of towns) p(`${t.seed} | ${t.population} | ${t.institutions.join('; ')} | ${t.powers.map((x) => `${x.name}[${x.category}]`).join('; ')} | ${t.tensions.map((x) => x.type).join(',') || '-'} | ${t.opening}`);
console.log(out.join('\n'));
