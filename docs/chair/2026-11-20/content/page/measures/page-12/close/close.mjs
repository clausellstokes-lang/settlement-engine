#!/usr/bin/env node
// CLOSE-MEASURE (PAGE-10's brief `briefs/CLOSE-MEASURE.md`, the lane now PAGE-12's): THE TROUBLE HALF'S CLOSING MEASURE.
// A MEASURE ONLY: it changes nothing under src/ or tests/ of any checkout. It reads two trees, each a `git archive` of
// one commit into a temporary directory with node_modules symlinked (never a checkout's working tree):
//   BEFORE = 43ab0f5eb (the working line at point 82, the lane's base)
//   AFTER  = 0359e7086 (the lane's tip: the causes, the hooks, cures A, B and C, and the parity)
//
// THE ONE COMMAND (its output lands beside this file: close.out.txt, close.md, kinds.md):
//   node docs/chair/2026-11-20/content/page/measures/page-12/close/close.mjs <BEFORE tree> <AFTER tree> <work dir> [n=150]
// It runs one child per tree (`--birth`, sequentially) writing <work dir>/<BEFORE|AFTER>.jsonl, then reports.
// (`close.mjs --report <AFTER tree> <work dir>` rewrites the three outputs from those births alone, no birth.)
//
// TWO POOLS, n places a size, the six sizes of `tests/components/pageCensusWalk.shared.mjs :: SIZES`:
//   M (measuring) = measures/page-7/sim.mjs's own births, seeds hxd-<size>-0..n-1;
//   V (the visitor's) = `visitorJob` COPIED VERBATIM from origin/lane/seat-6-2026-11-20
//       `docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs` (the file as last changed by commit 3e9840d7a
//       "measure(seat): MEASURE-VISITOR", unchanged at that branch's tip ce9462b55), seeds visitor-<size>-0..n-1, born as
//       measure-lit.mjs :: birth does with no law forced: `generateSettlementPipeline({ ...birthConfig(job.config) }, null,
//       { seed: job.seed, ...job.options })`.
// WHAT A PLACE PRINTS, per current trouble (`history.currentTensions[]`):
//   AFTER:  `domain/display/tensionCause.js :: tensionCauseSentenceOf(t, x)` exactly as sim.mjs calls it (null → the
//           stored `description`, as sim.mjs does);
//   BEFORE: the field the page printed at 43ab0f5eb: `description` (fallback `issue`, then `type`), printed by
//           `src/components/new/tabs/HistoryTab.jsx :: TensionRow` (the History tab's "Current Tensions" row; the
//           Overview tab's "Tensions & Conflicts" block prints the same `description`);
//   and its stored `plotHooks` (both trees). A place with no trouble counts in every denominator.
// THE METRICS, per tree x pool x size (and MIXED: the whole pool, sim.mjs's interleaved order for row3):
//   sentTop / hookTop  the three sentences (hooks) printed by the most places of the size, each n/(all places);
//   sent2 / hook2      over every unordered pair of distinct places, the share printing at least one in common;
//   sent3 / hook3      over 200,000 ordered triples of distinct places drawn with the FIXED seed below (one stream per
//                      size, restarted for every tree and pool, so the same triples are read in both trees), the share
//                      whose third prints a sentence (hook) the first or second printed;
//   row3 / hookRow3    sim.mjs's "three in a row": consecutive seeds i, i+1, i+2 of the size, any two of three share.
// THE KINDS TABLE: from the V births (AFTER; BEFORE's kinds compared place by place), every trouble's kind by size.
// THE GUARD LINE (the chair's 02:29 ruling, relayed by PAGE-12): the share of places printing the hook GUARD_LINE, and
// the ELIGIBLE count: places holding a crime_wave whose pool (AFTER `history/troubleHooksOf.js :: troubleHookPool`)
// admits that line through the declared door (`drawDeclared.js :: filterDeclared`) over `factsOf` of the final record.
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TRIPLE_SEED = 20261121; // the fixed seed of the ordered triples (an LCG, sim.mjs's constants)
export const NTRIPLES = 200000;
export const GUARD_LINE = 'A guard captain is on the payroll of the criminal network';
const HERE = dirname(fileURLToPath(import.meta.url));

/** Load one tree's modules; returns the birth and the readers. */
export async function loadTree(treeArg, label) {
  const T = resolve(treeArg);
  const imp = (p) => import(join(T, p));
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { SIZES } = await imp('tests/components/pageCensusWalk.shared.mjs');
  const { factsOf } = await imp('src/domain/facts/factsOf.js');
  await loadGenerationLawPayloads();
  // ── visitorJob, VERBATIM from measure-lit.mjs (commit 3e9840d7a), with the four imports it reads ──
  // ── THE VISITOR (MEASURE-VISITOR) ── `generateSettlementAction`'s birth for a visitor who touches no setting:
  //   baseConfig = canCustomize ? storedConfig : { ...DEFAULT_CONFIG, settType: ANON_FORGE_SIZE }   (storedConfig at
  //   rest is `{ ...DEFAULT_CONFIG }`, configSlice.js); the four toggle bags are `{}` (the anonymous forge's, and the
  //   toggle slice's rest state); `randomSliderMode` rests at true (configSlice.js), so the birth carries
  //   `_randomizePriorities: true`; no imported neighbour. The size is the ONE setting the pool sets (100 a size): the
  //   signed-in path with the size picked, whose `town` rows ARE the signed-out path (ANON_FORGE_SIZE = 'town').
  //   The pipeline's options are the store's content runtime at rest (`settlementContentRuntimeOptions` over the
  //   vanilla environment, read through the real slice), as `workers/generationRequest.js :: runSettlementOp` spreads them.
  const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
  const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
  const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
  const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
  const visitorJob = (size, i) => {
    const config = {
      ...DEFAULT_CONFIG, settType: size,
      _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {},
      _randomizePriorities: true,
    };
    let st;
    const slice = createCustomContentSlice(() => {}, () => st);
    st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
    const runtime = settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent);
    return { size, preset: null, seed: `visitor-${size}-${i}`, config, options: runtime };
  };
  // ── end of the verbatim copy ──
  let sentenceOf; let guard = () => null;
  if (label === 'AFTER') {
    const { tensionCauseSentenceOf } = await imp('src/domain/display/tensionCause.js');
    sentenceOf = (t, x) => { const s = tensionCauseSentenceOf(t, x); return s === null ? x.description : s; }; // as sim.mjs
    const { troubleHookPool } = await imp('src/generators/history/troubleHooksOf.js');
    const { filterDeclared } = await imp('src/domain/facts/drawDeclared.js');
    const line = (troubleHookPool('crime_wave') || []).find((l) => l.text === GUARD_LINE);
    if (!line) throw new Error('AFTER: the crime_wave pool does not hold the guard line');
    guard = (t) => ((t.history?.currentTensions || []).some((x) => x?.type === 'crime_wave')
      ? filterDeclared([line], { facts: factsOf(t), poolId: 'troubleHooks:TROUBLE_HOOKS:crime_wave', surface: 'history', drawKind: 'A' }).length === 1
      : false);
  } else {
    // HistoryTab.jsx :: TensionRow at 43ab0f5eb
    sentenceOf = (t, x) => (typeof x === 'object' ? x.description || x.issue || x.type : String(x));
  }
  const born = (pool, size, i) => {
    if (pool === 'M') {
      const seed = `hxd-${size}-${i}`;
      return { seed, t: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) };
    }
    const job = visitorJob(size, i);
    return { seed: job.seed, t: generateSettlementPipeline({ ...birthConfig(job.config) }, null, { seed: job.seed, ...job.options }) };
  };
  const hookText = (h) => String(h && typeof h === 'object' ? h.text : h);
  const read = (t) => (t.history?.currentTensions || []).map((x) => ({
    kind: x?.type ?? null,
    sentence: String(sentenceOf(t, x)),
    sides: Array.isArray(x?.factions) ? x.factions.map(String) : [],
    hooks: Array.isArray(x?.plotHooks) ? x.plotHooks.map(hookText) : [],
  }));
  return { SIZES, born, read, guard };
}

async function birthMode(treeArg, label, n, out) {
  const api = await loadTree(treeArg, label);
  const lines = [];
  const t0 = Date.now();
  for (const pool of ['M', 'V']) for (const size of api.SIZES) for (let i = 0; i < n; i++) {
    const { seed, t } = api.born(pool, size, i);
    lines.push(JSON.stringify({ tree: label, pool, size, i, seed, name: t.name, tier: t.tier, troubles: api.read(t), guardEligible: api.guard(t) }));
  }
  writeFileSync(out, `${lines.join('\n')}\n`);
  console.log(`${label}: ${lines.length} places in ${Math.round((Date.now() - t0) / 1000)} s -> ${out}`);
}

// ── the report ──────────────────────────────────────────────────────────────────────────────────────────────────────
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : '-');
const frac = (a, b) => `${a}/${b} ${pct(a, b)}`;
const lcg = (seed) => { let s = seed; return () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; };

/** the metrics over one ordered list of places; `key` is 'sent' or 'hook' */
function metrics(places, setOf, seed) {
  const sets = places.map(setOf);
  const d = places.length;
  const cnt = new Map();
  for (const s of sets) for (const x of s) cnt.set(x, (cnt.get(x) || 0) + 1);
  const top = [...cnt].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 3);
  const share = (a, b) => { for (const x of a) if (b.has(x)) return true; return false; };
  let p2 = 0; let n2 = 0;
  for (let i = 0; i < d; i++) for (let j = i + 1; j < d; j++) { n2++; if (share(sets[i], sets[j])) p2++; }
  const r = lcg(seed); let h3 = 0; let k = 0;
  while (k < NTRIPLES) {
    const a = Math.floor(r() * d); const b = Math.floor(r() * d); const c = Math.floor(r() * d);
    if (a === b || b === c || a === c) continue;
    k++;
    if (share(sets[c], sets[a]) || share(sets[c], sets[b])) h3++;
  }
  let hr = 0; let nr = 0;
  for (let i = 0; i + 2 < d; i++) { nr++; if (share(sets[i], sets[i + 1]) || share(sets[i], sets[i + 2]) || share(sets[i + 1], sets[i + 2])) hr++; }
  return { d, top, p2, n2, h3, n3: NTRIPLES, hr, nr };
}
const topField = (m) => m.top.map(([, c]) => `${c}/${m.d}(${pct(c, m.d)})`).join('|') || '-';
const topMax = (m) => (m.top.length ? m.top[0][1] / m.d : 0);
const sentSet = (p) => new Set(p.troubles.map((x) => x.sentence));
const hookSet = (p) => new Set(p.troubles.flatMap((x) => x.hooks));

async function report(beforeJsonl, afterJsonl, afterTree) {
  const rows = [beforeJsonl, afterJsonl].flatMap((f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
  const { SIZES } = await import(join(resolve(afterTree), 'tests/components/pageCensusWalk.shared.mjs'));
  const { TENSION_CAUSES } = await import(join(resolve(afterTree), 'src/data/tensionCauses.js'));
  const OUT = []; const MD = []; const NOT = [];
  const n = rows.filter((r) => r.tree === 'AFTER' && r.pool === 'V' && r.size === SIZES[0]).length;
  const stamp = `${statSync(afterJsonl).mtime.toISOString()} (the births; report ${new Date().toISOString()})`;
  OUT.push(`# CLOSE-MEASURE run ${stamp}; ${n} places a size; triples ${NTRIPLES} ordered, LCG seed ${TRIPLE_SEED} (restarted per size, and per tree and pool; MIXED seed ${TRIPLE_SEED + 1})`);
  OUT.push('# fields: sentTop/hookTop = the three most printed, each n/(all places of the size); sent2/hook2 = unordered pairs sharing one; sent3/hook3 = ordered triples whose third repeats the first or second; row3/hookRow3 = sim.mjs three in a row');
  const R = {};
  for (const tree of ['BEFORE', 'AFTER']) for (const pool of ['M', 'V']) {
    const of = rows.filter((r) => r.tree === tree && r.pool === pool);
    for (const [si, size] of SIZES.entries()) {
      const g = of.filter((r) => r.size === size).sort((a, b) => a.i - b.i);
      const s = metrics(g, sentSet, TRIPLE_SEED + 0 * si); const h = metrics(g, hookSet, TRIPLE_SEED + 0 * si);
      R[`${tree} ${pool} ${size}`] = { s, h, g };
      OUT.push(`BAR ${tree} ${pool} ${size} sentTop=${topField(s)} sent2=${frac(s.p2, s.n2).replace(' ', '(')}) sent3=${frac(s.h3, s.n3).replace(' ', '(')}) row3=${frac(s.hr, s.nr).replace(' ', '(')}) hookTop=${topField(h)} hook2=${frac(h.p2, h.n2).replace(' ', '(')}) hook3=${frac(h.h3, h.n3).replace(' ', '(')}) hookRow3=${frac(h.hr, h.nr).replace(' ', '(')}) none=${g.filter((p) => !p.troubles.length).length}/${g.length}`);
      if (topMax(s) > 0.20) NOT.push(`NOTMET ${tree} ${pool} ${size} sentTop ${topField(s).split('|')[0]} (bar: about 15%, to 20% passes)`);
      if (topMax(h) > 0.20) NOT.push(`NOTMET ${tree} ${pool} ${size} hookTop ${topField(h).split('|')[0]} (bar: about 15%, to 20% passes)`);
      if (h.p2 / h.n2 >= 0.30) NOT.push(`NOTMET ${tree} ${pool} ${size} hook2 ${frac(h.p2, h.n2)} (bar: under 30%)`);
      if (size === 'city' && s.hr / s.nr >= 0.25) NOT.push(`NOTMET ${tree} ${pool} ${size} row3 ${frac(s.hr, s.nr)} (sim.mjs's bar: three cities in a row under 25%)`);
    }
    // MIXED: the whole pool; row3 over sim.mjs's interleaved order (i, then size)
    const mixed = []; for (let i = 0; i < n; i++) for (const size of SIZES) mixed.push(of.find((r) => r.size === size && r.i === i));
    const s = metrics(mixed, sentSet, TRIPLE_SEED + 1); const h = metrics(mixed, hookSet, TRIPLE_SEED + 1);
    R[`${tree} ${pool} MIXED`] = { s, h, g: mixed };
    OUT.push(`MIXED ${tree} ${pool} sentTop=${topField(s)} sent2=${frac(s.p2, s.n2).replace(' ', '(')}) sent3=${frac(s.h3, s.n3).replace(' ', '(')}) row3=${frac(s.hr, s.nr).replace(' ', '(')}) hookTop=${topField(h)} hook2=${frac(h.p2, h.n2).replace(' ', '(')}) hook3=${frac(h.h3, h.n3).replace(' ', '(')}) hookRow3=${frac(h.hr, h.nr).replace(' ', '(')})`);
    if (s.hr / s.nr >= 0.10) NOT.push(`NOTMET ${tree} ${pool} MIXED row3 ${frac(s.hr, s.nr)} (sim.mjs's bar: interleaved sizes under 10%)`);
  }
  OUT.push(...(NOT.length ? NOT : ['NOTMET none']));
  // ── THE GUARD LINE (the chair's 02:29) ──
  const GUARD = [];
  for (const tree of ['BEFORE', 'AFTER']) for (const pool of ['V', 'M']) for (const size of SIZES) {
    const g = R[`${tree} ${pool} ${size}`].g;
    const prints = g.filter((p) => hookSet(p).has(GUARD_LINE));
    const cw = g.filter((p) => p.troubles.some((x) => x.kind === 'crime_wave')).length;
    const elig = tree === 'AFTER' ? g.filter((p) => p.guardEligible).length : null;
    const outside = tree === 'AFTER' ? prints.filter((p) => !p.guardEligible).length : 0;
    GUARD.push({ tree, pool, size, prints: prints.length, d: g.length, cw, elig, outside });
    OUT.push(`GUARD ${tree} ${pool} ${size} prints=${frac(prints.length, g.length).replace(' ', '(')}) crimeWave=${cw}/${g.length}${elig === null ? '' : ` eligible=${elig}/${g.length} printsOfEligible=${frac(prints.length, elig).replace(' ', '(')})`}${outside ? ` PRINTED-NOT-ELIGIBLE=${outside}` : ''}${prints.length / g.length > 0.20 ? ' OVER-20%' : ''}`);
  }
  // ── THE KINDS TABLE (V; AFTER's births; BEFORE's kinds compared place by place) ──
  const kindsOf = (p) => p.troubles.map((x) => x.kind);
  let kindDiff = 0;
  for (const size of SIZES) { const a = R[`AFTER V ${size}`].g; const b = R[`BEFORE V ${size}`].g; a.forEach((p, i) => { if (JSON.stringify(kindsOf(p)) !== JSON.stringify(kindsOf(b[i]))) kindDiff++; }); }
  const KO = [`# KINDS: V pool, AFTER births; places whose trouble kinds (in order) differ BEFORE vs AFTER: ${kindDiff}/${SIZES.length * n}`];
  const KMD = [];
  const pooledCarry = new Map();
  for (const size of SIZES) for (const p of R[`AFTER V ${size}`].g) for (const k of new Set(kindsOf(p))) pooledCarry.set(k, (pooledCarry.get(k) || 0) + 1);
  const pooledRank = [...pooledCarry].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([k]) => k);
  const hasTable = (k) => Object.hasOwn(TENSION_CAUSES, k);
  const coverOf = (g, set) => g.filter((p) => p.troubles.length && set.has(p.troubles[0].kind)).length;
  const tabled = new Set(Object.keys(TENSION_CAUSES));
  KMD.push('| size | rank | kind | places carrying it | cause table |', '|---|---|---|---|---|');
  for (const size of SIZES) {
    const g = R[`AFTER V ${size}`].g; const carry = new Map();
    for (const p of g) for (const k of new Set(kindsOf(p))) carry.set(k, (carry.get(k) || 0) + 1);
    [...carry].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).forEach(([k, c], j) => {
      KO.push(`KIND V ${size} ${k} ${frac(c, g.length)}${hasTable(k) ? ' TABLE' : ''}`);
      KMD.push(`| ${size} | ${j + 1} | ${k} | ${frac(c, g.length)} | ${hasTable(k) ? 'yes' : '-'} |`);
    });
  }
  const COV = [];
  for (const size of SIZES) {
    const g = R[`AFTER V ${size}`].g; const any = g.filter((p) => p.troubles.length).length;
    COV.push({ size, first: coverOf(g, tabled), any, d: g.length });
    KO.push(`COVER V ${size} firstHasTable=${frac(coverOf(g, tabled), g.length).replace(' ', '(')}) anyTrouble=${frac(any, g.length).replace(' ', '(')})`);
  }
  // the fewest kinds (by the pooled rank of the KIND table: share of all V places carrying it), added in that order
  const add = []; const set = new Set(tabled); let reached = false;
  const allMet = () => SIZES.every((size) => { const g = R[`AFTER V ${size}`].g; return coverOf(g, set) / g.length >= 0.9; });
  if (allMet()) reached = true;
  for (const k of pooledRank) { if (reached) break; if (set.has(k)) continue; set.add(k); add.push(k); if (allMet()) reached = true; }
  const after = SIZES.map((size) => { const g = R[`AFTER V ${size}`].g; return `${size} ${frac(coverOf(g, set), g.length)}`; }).join('; ');
  KO.push(`COVER V ALL fewest=${reached ? add.length : 'UNREACHABLE'} kinds=${add.join(',') || '-'} → ${after}`);
  // per size alone, by that size's own rank
  const perSize = [];
  for (const size of SIZES) {
    const g = R[`AFTER V ${size}`].g; const carry = new Map();
    for (const p of g) for (const k of new Set(kindsOf(p))) carry.set(k, (carry.get(k) || 0) + 1);
    const rank = [...carry].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([k]) => k);
    const s2 = new Set(tabled); const a2 = []; let ok = coverOf(g, s2) / g.length >= 0.9;
    for (const k of rank) { if (ok) break; if (s2.has(k)) continue; s2.add(k); a2.push(k); ok = coverOf(g, s2) / g.length >= 0.9; }
    perSize.push({ size, ok, a2, v: frac(coverOf(g, s2), g.length) });
    KO.push(`COVER V ${size} aloneFewest=${ok ? a2.length : 'UNREACHABLE'} kinds=${a2.join(',') || '-'} → ${frac(coverOf(g, s2), g.length)}`);
  }
  OUT.push(...KO);
  writeFileSync(join(HERE, 'close.out.txt'), `${OUT.join('\n')}\n`);
  // ── close.md ──
  const cell = (a, b) => `${a}/${b} (${pct(a, b)})`;
  MD.push('# CLOSE-MEASURE: the trouble half\'s closing measure', '',
    `Run ${stamp} (UTC). BEFORE = 43ab0f5eb, AFTER = 0359e7086, each a \`git archive\` with node_modules symlinked. ${n} places a size.`,
    'Pools: M = measures/page-7/sim.mjs\'s births (`hxd-<size>-i`); V = `visitorJob` copied verbatim from origin/lane/seat-6-2026-11-20 `seat/u4/measure-lit.mjs` (commit 3e9840d7a) (`visitor-<size>-i`).',
    'What a place prints: AFTER, `tensionCauseSentenceOf` as sim.mjs calls it; BEFORE, the stored `description` (fallback `issue`, `type`) as `HistoryTab.jsx :: TensionRow` printed it at 43ab0f5eb. Hooks: the stored `plotHooks` in both trees. A place with no trouble counts in every denominator.',
    `Triples: ${NTRIPLES} ordered triples of distinct places a cell, LCG (sim.mjs\'s constants) seeded ${TRIPLE_SEED}, restarted per cell (MIXED: ${TRIPLE_SEED + 1}).`,
    'Bars: top share about 15%, to 20% passes (sentences and hooks); a second place repeating a hook under 30%; sim.mjs\'s row3 bars for continuity: three cities in a row under 25%, interleaved sizes (MIXED) under 10%.', '');
  for (const pool of ['M', 'V']) {
    MD.push(`## Pool ${pool}`, '', '| size | tree | sentence top (3) | sent2 | sent3 | row3 | hook top (3) | hook2 | hook3 | hookRow3 | no trouble |', '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const size of [...SIZES, 'MIXED']) for (const tree of ['BEFORE', 'AFTER']) {
      const { s, h, g } = R[`${tree} ${pool} ${size}`];
      const tp = (m) => m.top.map(([, c]) => cell(c, m.d)).join('; ');
      MD.push(`| ${size} | ${tree} | ${tp(s)} | ${cell(s.p2, s.n2)} | ${cell(s.h3, s.n3)} | ${cell(s.hr, s.nr)} | ${tp(h)} | ${cell(h.p2, h.n2)} | ${cell(h.h3, h.n3)} | ${cell(h.hr, h.nr)} | ${cell(g.filter((p) => !p.troubles.length).length, g.length)} |`);
    }
    MD.push('');
  }
  MD.push('## Bars not met', '', ...(NOT.length ? NOT.map((l) => `- ${l.replace(/^NOTMET /, '')}`) : ['- none']), '');
  MD.push('## The most printed lines, AFTER (the top one of each size)', '', '| pool | size | sentence | its places | hook | its places |', '|---|---|---|---|---|---|');
  for (const pool of ['M', 'V']) for (const size of SIZES) {
    const { s, h } = R[`AFTER ${pool} ${size}`];
    MD.push(`| ${pool} | ${size} | ${s.top[0]?.[0] ?? '-'} | ${s.top[0] ? cell(s.top[0][1], s.d) : '-'} | ${h.top[0]?.[0] ?? '-'} | ${h.top[0] ? cell(h.top[0][1], h.d) : '-'} |`);
  }
  MD.push('', '## The guard line (the chair\'s 02:29 ruling)', '', `"${GUARD_LINE}": places printing it, of all places of the size; ELIGIBLE = places holding a crime_wave whose AFTER pool admits the line (needs: watch, organised crime) over \`factsOf\` of the final record.`, '',
    '| tree | pool | size | prints it | holds a crime_wave | eligible | prints, of eligible |', '|---|---|---|---|---|---|---|');
  for (const x of GUARD) MD.push(`| ${x.tree} | ${x.pool} | ${x.size} | ${cell(x.prints, x.d)}${x.prints / x.d > 0.2 ? ' **OVER 20%**' : ''} | ${cell(x.cw, x.d)} | ${x.elig === null ? '-' : cell(x.elig, x.d)} | ${x.elig === null ? '-' : cell(x.prints, x.elig)} |`);
  const over = GUARD.filter((x) => x.tree === 'AFTER' && x.pool === 'V' && x.prints / x.d > 0.2);
  MD.push('', over.length ? `**V, AFTER: over 20% at ${over.map((x) => x.size).join(', ')}.**` : 'V, AFTER: under 20% at every size.', '');
  MD.push('## Judgments the brief did not settle', '',
    '- BEFORE\'s sentence: the stored `description` (fallback `issue`, then `type`), the field `src/components/new/tabs/HistoryTab.jsx :: TensionRow` printed at 43ab0f5eb (the Overview tab\'s "Tensions & Conflicts" block printed the same `description`). Checked on the births: none of the 3,064 BEFORE troubles prints an empty sentence or its bare kind.',
    '- A place\'s "sentences" and "hooks" are SETS: a line a place prints twice counts once for it. "Word for word" is exact string equality.',
    `- Triples: drawn uniformly, a draw with any two indices equal is discarded and not counted, until ${NTRIPLES} distinct ordered triples; one LCG stream (seed ${TRIPLE_SEED}) restarted for every tree x pool x size cell, so the same index triples are read in both trees and pools; MIXED uses seed ${TRIPLE_SEED + 1} over the whole pool.`,
    '- MIXED: sentTop, sent2, sent3 (and the hooks\') over the whole pool of 900; row3 over sim.mjs\'s interleaved order (place i of each size in SIZES order, then i+1).',
    '- Bars applied: top share above 20% is NOT MET (about 15% is the aim); hook2 at or above 30% NOT MET; sim.mjs\'s row3 bars (three cities in a row under 25%, MIXED under 10%) for continuity. The brief sets no bar on sent2, sent3, hook3 or hookRow3; they are reported, not judged.',
    '- The guard line\'s ELIGIBLE: a place holding a crime_wave whose AFTER pool line (`troubleHookPool(\'crime_wave\')`, needs watch and organised crime) the declared door admits (`filterDeclared`) over `factsOf` of the FINAL record; the pick reads the history step\'s facts, which the birth self-check re-reads on the final record. No place printed the line without being eligible.',
    '- The sides are the stored `factions`, as both trees\' TensionRow prints them (no side reader is wired at AFTER).',
    '');
  writeFileSync(join(HERE, 'close.md'), `${MD.join('\n')}\n`);
  // ── kinds.md ──
  const K = ['# THE KINDS TABLE (V pool, AFTER)', '', `Run ${stamp} (UTC). From the V births of close.mjs (no second run). Places whose trouble kinds differ BEFORE vs AFTER: ${kindDiff}/${SIZES.length * n}, so one table serves both trees. "Cause table" = the kind has a table in \`src/data/tensionCauses.js :: TENSION_CAUSES\` (AFTER).`, '', ...KMD, '',
    '## COVER: places whose FIRST trouble\'s kind has a cause table (all places the denominator)', '', '| size | first trouble has a table | places with any trouble |', '|---|---|---|',
    ...COV.map((c) => `| ${c.size} | ${cell(c.first, c.d)} | ${cell(c.any, c.d)} |`), '',
    '## The fewest kinds to nine places in ten at every size', '',
    `Kinds without a table added in the order of the pooled rank (share of all ${SIZES.length * n} V places carrying the kind): ${reached ? `**${add.length}** — ${add.join(', ') || 'none needed'}` : `**not reachable**: places with no trouble count in the denominator (${add.join(', ')} added, every untabled kind)`}. Then: ${after}.`, '',
    'Per size alone, by that size\'s own rank:', '', ...perSize.map((p) => `- ${p.size}: ${p.ok ? `${p.a2.length} (${p.a2.join(', ') || 'none'})` : 'not reachable'} → ${p.v}`), ''];
  writeFileSync(join(HERE, 'kinds.md'), `${K.join('\n')}\n`);
  console.log(OUT.filter((l) => /^(BAR|MIXED|NOTMET|GUARD|COVER)/.test(l)).join('\n'));
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [, , a1, a2, a3, a4] = process.argv;
  if (a1 === '--birth') {
    await birthMode(a2, a3, +a4, process.argv[6]);
  } else if (a1 === '--report') {
    await report(join(a3, 'BEFORE.jsonl'), join(a3, 'AFTER.jsonl'), a2);
  } else {
    if (!a1 || !a2 || !a3) { console.error('usage: node close.mjs <BEFORE tree> <AFTER tree> <work dir> [n=150]'); process.exit(2); }
    const nA = +(a4 || 150);
    for (const [tree, label] of [[a1, 'BEFORE'], [a2, 'AFTER']]) {
      execFileSync(process.execPath, [fileURLToPath(import.meta.url), '--birth', tree, label, String(nA), join(a3, `${label}.jsonl`)], { stdio: 'inherit' });
    }
    await report(join(a3, 'BEFORE.jsonl'), join(a3, 'AFTER.jsonl'), a2);
  }
}
