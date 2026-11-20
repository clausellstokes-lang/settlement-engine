// corpus-scan.mjs — BUILD-THEMES (DEPTH-3's builder, 2026-11-20): the chair's conditions (C2) and (C3) over the WHOLE
// corpus of texts `themeOfText` is ever asked about. Run from the repository root with plain node (vitest's environment
// for these suites is `node`, so the births are the suites' births):
//
//   node docs/chair/2026-11-20/content/depth/themes/corpus-scan.mjs --base    # AT THE BASE, before any edit: writes
//        answers.base.json (EVERY folded text's answer, as base-36 fnv1a32(fold) -> answer; no sentence quoted) and the
//        test fixture tests/fixtures/hookThemeAnswers.base.json (the cheap part: pools, hxd births, golden, legacy saves)
//   node docs/chair/2026-11-20/content/depth/themes/corpus-scan.mjs --check   # AFTER: recomputes and compares; exit 1 on
//        any moved answer, any hash shared by two distinct folds, or any text outside the pools hashing to a tagged line
//
// THE CORPUS (C2): the live pools (`NPC_FACTION_LOYALTY`, every line, the texts drawLoyalty / ownPoolHook / drawUnique
// classify at birth) and, for every stored town, every text a reader of `themeOfText` is handed at render:
//   npcs[].plotHooks[]                  — the stored person hooks;
//   collectPlotHooks(town)[].text       — src/domain/dossier/plotHooks.js (its retention seam's `themeOf: (hook) => themeOfText(hook.text)`);
//   deriveAllStructuredHooks(town)[].text — src/domain/hookEscalation.js (the same seam on the structured surface).
// over the golden master's 525 births (tests/property/generatorGoldenMaster.test.js: goldenCorpus() through
// generateSettlementPipeline(cfg, null, { seed, customContent: {} }), no law payloads, exactly as it births), the census's
// 720 (origin/lane/names-3-2026-11-20 docs/chair/2026-11-20/content/tools/confinement/born.census.js at 835fabd2d, its
// census arm verbatim: censusPlan('r2') through configOf(row, DEFAULT_CONFIG, birthConfig) after
// loadGenerationLawPayloads()), the hxd births hxd-<size>-0..4 (docs/chair/2026-11-20/content/depth/measure/born.mjs),
// and the stored saves under tests/fixtures/legacy-saves/ (normalizeSettlement first, as a load does).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const HERE = join(ROOT, 'docs/chair/2026-11-20/content/depth/themes');
const BASE_FILE = join(HERE, 'answers.base.json');
const TEST_FIXTURE = join(ROOT, 'tests/fixtures/hookThemeAnswers.base.json');
const mode = process.argv.includes('--base') ? 'base' : process.argv.includes('--check') ? 'check' : null;
if (!mode) { console.error('usage: corpus-scan.mjs --base | --check'); process.exit(2); }

const { themeOfText, hookThemeKey, UNTYPED } = await import(join(ROOT, 'src/domain/hookThemes.js'));
const { fnv1a32 } = await import(join(ROOT, 'src/kernel/proseHash.js'));
const { NPC_FACTION_LOYALTY } = await import(join(ROOT, 'src/data/npcData.js'));
const { lineText } = await import(join(ROOT, 'src/domain/facts/drawDeclared.js'));
const { collectPlotHooks } = await import(join(ROOT, 'src/domain/dossier/plotHooks.js'));
const { deriveAllStructuredHooks } = await import(join(ROOT, 'src/domain/hookEscalation.js'));
const { normalizeSettlement } = await import(join(ROOT, 'src/domain/normalizeSettlement.js'));
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { goldenCorpus } = await import(join(ROOT, 'tests/helpers/goldenMasterCorpus.js'));
const { birthConfig, loadGenerationLawPayloads } = await import(join(ROOT, 'src/domain/density/densityCreateBoundary.js'));
const { DEFAULT_CONFIG } = await import(join(ROOT, 'src/store/configSlice.js'));
const { censusPlan, configOf } = await import(join(ROOT, 'tests/components/pageCensusWalk.shared.mjs'));

const h36 = (/** @type {string} */ fold) => fnv1a32(fold).toString(36);

/** fold -> { answer, sources: Map<source, count>, example } */
const texts = new Map();
const errors = [];
/** the cheap-in-a-test subset's folds, by part */
const cheap = { pools: new Set(), hxd: new Set(), golden: new Set(), legacy: new Set() };
const poolFolds = new Set();

function see(text, source, part) {
  if (typeof text !== 'string') return;
  const fold = hookThemeKey(text);
  let row = texts.get(fold);
  if (!row) { row = { answer: themeOfText(text), sources: new Map(), example: text }; texts.set(fold, row); }
  else if (themeOfText(text) !== row.answer) errors.push(`one fold, two answers: ${JSON.stringify(fold)}`);
  row.sources.set(source, (row.sources.get(source) || 0) + 1);
  if (part) cheap[part].add(fold);
}

function seeTown(town, corpus, part) {
  for (const npc of town?.npcs || []) for (const h of npc?.plotHooks || []) see(typeof h === 'string' ? h : h?.text, `${corpus}:npcs.plotHooks`, part);
  try { for (const h of collectPlotHooks(town)) see(h?.text, `${corpus}:collectPlotHooks`, part); } catch (e) { errors.push(`${corpus} collectPlotHooks threw on ${town?.name}: ${e.message}`); }
  try { for (const h of deriveAllStructuredHooks(town)) see(h?.text, `${corpus}:deriveAllStructuredHooks`, part); } catch (e) { errors.push(`${corpus} deriveAllStructuredHooks threw on ${town?.name}: ${e.message}`); }
}

const t0 = Date.now();
// 1. the live pools
for (const [pool, lines] of Object.entries(NPC_FACTION_LOYALTY)) for (const l of lines) { const t = lineText(l); poolFolds.add(hookThemeKey(t)); see(t, `pools:${pool}`, 'pools'); }
// 2. the golden master's 525 births (no law payloads, as the golden births)
let golden = 0;
for (const config of goldenCorpus()) { const { _seed, ...cfg } = config; seeTown(generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }), 'golden', 'golden'); golden += 1; }
// 3. the census's 720 (born.census.js's census arm)
await loadGenerationLawPayloads();
let census = 0;
for (const row of censusPlan('r2')) { seeTown(generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }), 'census', null); census += 1; }
// 4. the hxd births hxd-<size>-0..4 (measure/born.mjs)
let hxd = 0;
for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (let i = 0; i < 5; i += 1) { seeTown(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }), 'hxd', 'hxd'); hxd += 1; }
// 5. the stored saves
let legacy = 0;
for (const file of ['april-2026-v1.json', 'people-car-v1-2026-11-07.json']) {
  for (const entry of JSON.parse(readFileSync(join(ROOT, 'tests/fixtures/legacy-saves', file), 'utf8'))) {
    seeTown(normalizeSettlement(entry.settlement), `legacy/${file}`, 'legacy'); legacy += 1;
  }
}

// ── the report ──
const out = [];
const say = (/** @type {string} */ s) => { out.push(s); console.log(s); };
say(`corpus-scan ${mode} at ${new Date().toISOString()} (${Math.round((Date.now() - t0) / 1000)} s)`);
say(`towns: golden ${golden}, census ${census}, hxd ${hxd}, legacy saves ${legacy}`);
say(`distinct folded texts: ${texts.size} (pool lines ${poolFolds.size}; typed ${[...texts.values()].filter((r) => r.answer !== UNTYPED).length})`);

// (C2) no two distinct folds share a hash; no text outside the pools hashes to a tagged (pool) line
const byHash = new Map();
for (const fold of texts.keys()) { const h = h36(fold); byHash.set(h, [...(byHash.get(h) || []), fold]); }
const shared = [...byHash.entries()].filter(([, fs]) => fs.length > 1);
say(`hashes shared by two distinct folds: ${shared.length}`);
for (const [h, fs] of shared) say(`  COLLISION ${h}: ${fs.map((f) => JSON.stringify(f.slice(0, 60))).join(' | ')}`);
const poolHashes = new Set([...poolFolds].map(h36));
const intruders = [...texts.keys()].filter((f) => !poolFolds.has(f) && poolHashes.has(h36(f)));
say(`texts outside the pools hashing to a tagged line: ${intruders.length}`);

// the stored hooks in NO pool, counted and named by source
const unpooled = [...texts.entries()].filter(([f]) => !poolFolds.has(f));
const bySource = new Map();
for (const [, r] of unpooled) for (const [s, n] of r.sources) { const b = bySource.get(s) || { distinct: 0, uses: 0, examples: [], answers: new Map() }; b.distinct += 1; b.uses += n; if (b.examples.length < 3) b.examples.push(r.example); b.answers.set(r.answer, (b.answers.get(r.answer) || 0) + 1); bySource.set(s, b); }
say(`texts in NO pool: ${unpooled.length} distinct; their answers at this tree: ${JSON.stringify(Object.fromEntries([...unpooled.reduce((m, [, r]) => m.set(r.answer, (m.get(r.answer) || 0) + 1), new Map())]))}`);
for (const [s, b] of [...bySource.entries()].sort()) {
  say(`  ${s}: ${b.distinct} distinct, ${b.uses} uses, answers ${JSON.stringify(Object.fromEntries(b.answers))}`);
  for (const ex of b.examples) say(`      e.g. ${JSON.stringify(ex.slice(0, 110))}`);
}
say(`errors: ${errors.length}`);
for (const e of errors.slice(0, 20)) say(`  ${e}`);

/** answer -> sorted base-36 hashes, for a set of folds */
const answersOf = (/** @type {Iterable<string>} */ folds) => {
  /** @type {Record<string, string[]>} */ const m = {};
  for (const f of folds) { const a = texts.get(f).answer; (m[a] ||= []).push(h36(f)); }
  for (const a of Object.keys(m)) m[a] = [...new Set(m[a])].sort();
  return Object.fromEntries(Object.keys(m).sort().map((a) => [a, m[a]]));
};

let bad = errors.length + shared.length + intruders.length;
if (mode === 'base') {
  writeFileSync(BASE_FILE, `${JSON.stringify({ about: 'BUILD-THEMES (C3): every folded text of the corpus-scan corpus at the base 2582075ed, as answer -> sorted base-36 fnv1a32(hookThemeKey(text)); quotes no sentence. Written by corpus-scan.mjs --base.', answers: answersOf(texts.keys()) })}\n`);
  const parts = Object.fromEntries(Object.entries(cheap).map(([p, s]) => [p, answersOf(s)]));
  writeFileSync(TEST_FIXTURE, `${JSON.stringify({
    about: 'BUILD-THEMES (iii)/(C3): themeOfText\'s answers AT THE BASE 2582075ed, written before any edit by docs/chair/2026-11-20/content/depth/themes/corpus-scan.mjs --base; never hand-edited. Per part, answer -> sorted base-36 fnv1a32(hookThemeKey(text)) (no sentence quoted). pools: every NPC_FACTION_LOYALTY line; hxd: every stored hook text of births hxd-<size>-0..4 (npcs[].plotHooks, collectPlotHooks, deriveAllStructuredHooks); golden: the same over the golden master\'s 525 births; legacy: the same over tests/fixtures/legacy-saves/.',
    base: '2582075ed',
    parts,
  }, null, 1)}\n`);
  say(`wrote ${relative(ROOT, BASE_FILE)} and ${relative(ROOT, TEST_FIXTURE)}`);
} else {
  const base = JSON.parse(readFileSync(BASE_FILE, 'utf8')).answers;
  const was = new Map(); for (const [a, hs] of Object.entries(base)) for (const h of hs) was.set(h, a);
  const now = new Map(); for (const [f, r] of texts) now.set(h36(f), r.answer);
  const moved = [...now].filter(([h, a]) => was.has(h) && was.get(h) !== a);
  const missing = [...was.keys()].filter((h) => !now.has(h));
  const added = [...now.keys()].filter((h) => !was.has(h));
  say(`against the base: ${was.size} base hashes, ${now.size} now; moved answers ${moved.length}; base hashes not seen now ${missing.length}; new hashes ${added.length}`);
  for (const [h, a] of moved.slice(0, 20)) say(`  MOVED ${h}: ${was.get(h)} -> ${a}`);
  bad += moved.length + missing.length + added.length;
}
say(bad ? `RED (${bad})` : 'GREEN');
writeFileSync(join(HERE, `corpus-scan.${mode}.out.txt`), `${out.join('\n')}\n`);
process.exit(bad ? 1 : 0);
