#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/uk/measure-uk.mjs — MEASURE-UK (builder BUK, SEAT-6, 2026-11-20; brief
 * `../briefs/MEASURE-UK.md`, hand-back items 36, 39, 42): the corrected keyword of `npcGenerator.js :: powerBandOfRole`
 * MEASURED before any build. A MEASURE ONLY: it changes nothing under src/ or tests/ of any checkout; the fold lives only
 * in scratch trees. Driven by `measure-uk.sh` (the one command) in five modes:
 *
 *   plant <tree>                          SKW's arm, in a scratch tree only: the MID_POWER list of `powerBandOfRole`
 *                                         gains the stem 'wealthiest merchant' beside 'wealthy_merchant' (the band of
 *                                         'wealthy_merchant', K.md's K2 recipe). Stops if the line is not there once.
 *   bands <tree>                          the tree's own `powerBandOfRole` on the four roles (the plant's receipt).
 *   calibrate <base.json> <fold.json> <arm.json> <kRoles.out> <out dir> <t0>
 *                                         THE CALIBRATION: the trial's own role counts on its own corpus (PAGE-2's 300
 *                                         towns, `k300.mjs` born on the trial's base 6b82c8e4a, on its fold f4a434660
 *                                         and on the fold + the arm; cards paired by id; `kRoles.mjs` on the fold for
 *                                         "no other pool role"). Exit 0 PASS, 1 FAIL (the table written to uk.md).
 *   birth <tree> <arm> <pool> <size> <out.jsonl>
 *                                         one arm, one pool, one size: every place born from <tree> as
 *                                         `{ ...birthConfig(config), _seatLawVersion: 2 }` (the law forced AFTER
 *                                         birthConfig, as `u4/measure-lit.mjs :: birth` forces it), read as born:
 *                                         the contest (`measure-lit.mjs`'s read, verbatim) and a compact projection of
 *                                         the record (cards, ties, goals, conflicts, the powers' relationships, the
 *                                         pressure sentence, a hash per top-level key).
 *   report <rows dir> <out dir> <seat sha> <fold sha> <t0 epoch s> [<cal json>]
 *                                         the tables, `uk.{md,json}`.
 *
 * THE POOLS (SEAT-6-HANDBACK.md items 61, 64; the owner's file never mixes them):
 *   visitor  = `u4/measure-lit.mjs :: visitorJob`, copied verbatim below (that module runs its own mode dispatch on
 *              import, so it cannot be imported): `{ ...DEFAULT_CONFIG, settType, the four toggle bags {},
 *              _randomizePriorities: true }`, the vanilla content runtime, seeds `visitor-<size>-0..99`. THE HEADLINE.
 *   chair600 = the chair's `hxd` family (pool B), `{ ...DEFAULT_CONFIG, settType }`, `hxd-<size>-0..99`. Beside it.
 * Pool A is in no table.
 *
 * THE CONFLICT READ is `page-3/kClasses.mjs :: leaves` (trial scripts b2f8fe25e) on `powerStructure.conflicts`:
 * arrays are diffed index by index, `${path}#length` when the lengths differ and `${path}[i].parties[j]` when a party
 * moved. Here: a town GAINS a conflict when `powerStructure.conflicts#length` rises, LOSES one when it falls, and its
 * PARTIES SWAP when, at an index both sides hold, a `parties[j]` leaf moved (the three are not exclusive).
 * THE FIRST CARD is `kClasses.mjs`'s: for each power, the first card in roster order holding a membership of rank 1.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [mode, ...rest] = process.argv.slice(2);
const fail = (msg) => { console.error(`measure-uk: ${msg}`); process.exit(2); };

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LADDER = ['Holding', 'Stable', 'Contested', 'Critical'];
const ladderKey = (label) => (String(label).startsWith('Critical') ? 'Critical' : String(label));
const KINDS = ['noble', 'craft', 'merchant', 'military', 'religious', 'arcane', 'labor', 'outsider', 'criminal', 'occupation', 'government', 'other'];
const ROLES = ['Guild Master', 'Thieves Guild Master', 'Council Member', 'Wealthiest Merchant'];
const pct = (n, d) => (d ? `${Math.round((1000 * n) / d) / 10}` : '-');
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const h16 = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 16);
const short = (v, n = 200) => { const s = typeof v === 'string' ? v : JSON.stringify(v); return s === undefined ? 'undefined' : s.length > n ? `${s.slice(0, n - 3)}...` : s; };

// ── plant (SKW: the Wealthiest Merchant arm) ────────────────────────────────────────────────────────────────────────
const MID_LINE = "  const MID_POWER = ['council_member', 'priest', 'wealthy_merchant', 'wizard', 'knight', 'magister', 'sergeant'];";
const MID_LINE_W = "  const MID_POWER = ['council_member', 'priest', 'wealthy_merchant', 'wealthiest merchant', 'wizard', 'knight', 'magister', 'sergeant'];";
function plant(tree) {
  const rel = 'src/generators/npcGenerator.js';
  const file = join(tree, rel);
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const at = lines.map((l, i) => (l === MID_LINE ? i : -1)).filter((i) => i >= 0);
  if (at.length !== 1) fail(`plant: the MID_POWER line is in ${rel} ${at.length} times, not once`);
  if (!lines.some((l) => l.includes("const fold = s => String(s || '').toLowerCase().replace(/_/g, ' ')"))) fail('plant: the tree does not carry the fold (SKW is SK plus the arm)');
  lines[at[0]] = MID_LINE_W;
  writeFileSync(file, lines.join('\n'));
  console.log(JSON.stringify({ file: rel, line: at[0] + 1, before: MID_LINE.trim(), after: MID_LINE_W.trim() }));
}

async function bands(tree) {
  const { powerBandOfRole } = await import(join(resolve(tree), 'src/generators/npcGenerator.js'));
  console.log(JSON.stringify(Object.fromEntries(ROLES.map((r) => [r, powerBandOfRole(r)]))));
}

// ── calibrate ───────────────────────────────────────────────────────────────────────────────────────────────────────
/** The trial's figures (K.md; SEAT-5-HANDBACK.md items 36, 42): at 9,012 cards in 300 towns. */
const TRIAL = { towns: 300, cards: 9012, moved: { 'Guild Master': ['low', 'high', 221], 'Thieves Guild Master': ['low', 'high', 34], 'Council Member': ['low', 'moderate', 18] }, movedCards: 273, movedTowns: 151, wealthiest: 100 };
/**
 * At the trial's base a card's `role` holds the PRINTED office word ("the senior guild master"), not the pool role the
 * band was read from ("Guild Master"), so the trial's role counts are reproduced CARD BY CARD: the same 300 towns born
 * on the base, on the fold and on the fold + the Wealthiest Merchant arm, each card paired by (seed, id), the band
 * moves counted by transition and printed word. A pool role is named from its transition and printed word: low -> high
 * printed with "guild" and not "thie" = Guild Master; low -> high with "thie" = Thieves Guild Master; low -> moderate =
 * Council Member (base -> fold); low -> moderate (fold -> fold + arm) = Wealthiest Merchant. kRoles.mjs (verbatim) on
 * the fold tree is the "no other pool role moves" check (its rows with a source other than 'printed').
 */
const pairCards = (a, b) => {
  const by = new Map(b.map((t) => [t.seed, t])); const words = {}; const towns = new Set(); let unmatched = 0;
  for (const t of a) {
    const m = new Map((by.get(t.seed)?.cards || []).map((c) => [c.id, c]));
    for (const c of t.cards) {
      const d = m.get(c.id);
      if (!d) { unmatched += 1; continue; }
      if (c.influence !== d.influence) { bump(words, `${c.influence} -> ${d.influence} | ${c.role}`); towns.add(t.seed); }
    }
  }
  return { words, towns: towns.size, cards: Object.values(words).reduce((s, x) => s + x, 0), unmatched };
};
function calibrate(baseJson, foldJson, armJson, kRolesOut, outDir, t0) {
  const base = JSON.parse(readFileSync(baseJson, 'utf8')); const fold = JSON.parse(readFileSync(foldJson, 'utf8')); const arm = JSON.parse(readFileSync(armJson, 'utf8'));
  const text = readFileSync(kRolesOut, 'utf8');
  const poolMoved = {};
  for (const [, role, from, to, src] of text.matchAll(/^ {2}(.+?): (\w+) -> (\w+) \(([^;]*);/gm)) if (src.split(', ').some((s) => s !== 'printed')) poolMoved[role] = `${from} -> ${to}`;
  const K = pairCards(base, fold); const W = pairCards(fold, arm);
  const sumWhere = (words, f) => Object.entries(words).filter(([k]) => f(k)).reduce((s, [, n]) => s + n, 0);
  const moved = {
    'Guild Master': ['low', 'high', sumWhere(K.words, (k) => k.startsWith('low -> high |') && /guild/i.test(k) && !/thie/i.test(k))],
    'Thieves Guild Master': ['low', 'high', sumWhere(K.words, (k) => k.startsWith('low -> high |') && /thie/i.test(k))],
    'Council Member': ['low', 'moderate', sumWhere(K.words, (k) => k.startsWith('low -> moderate |'))],
  };
  const named = Object.values(moved).reduce((s, v) => s + v[2], 0);
  const got = { towns: base.length, cards: base.reduce((s, t) => s + t.cards.length, 0), moved, movedCards: K.cards, movedTowns: K.towns, unnamed: K.cards - named, unmatched: K.unmatched + W.unmatched,
    wealthiest: sumWhere(W.words, (k) => k.startsWith('low -> moderate |')), wealthiestOther: W.cards - sumWhere(W.words, (k) => k.startsWith('low -> moderate |')), wealthiestTowns: W.towns,
    poolRolesMoved: poolMoved, printedWords: { fold: K.words, arm: W.words } };
  const pass = got.towns === TRIAL.towns && got.cards === TRIAL.cards && got.unmatched === 0 && got.unnamed === 0
    && Object.entries(TRIAL.moved).every(([r, v]) => JSON.stringify(moved[r]) === JSON.stringify(v))
    && got.movedCards === TRIAL.movedCards && got.movedTowns === TRIAL.movedTowns && got.wealthiest === TRIAL.wealthiest && got.wealthiestOther === 0
    && JSON.stringify(Object.keys(poolMoved).sort()) === JSON.stringify(Object.keys(TRIAL.moved).sort());
  const out = { trial: TRIAL, measured: got, pass, kRoles: text.trim().split('\n') };
  console.log(JSON.stringify(out));
  if (!pass) { // measure-lit's rule: on a FAIL the calibration's table is written, and the run stops
    writeFileSync(join(outDir, 'uk.json'), `${JSON.stringify({ meta: { stopped: 'calibration', runSeconds: Math.round(Date.now() / 1000 - Number(t0)) }, calibration: out }, null, 1)}\n`);
    writeFileSync(join(outDir, 'uk.md'), `# MEASURE-UK: STOPPED AT THE CALIBRATION\n\n${calibrationLines(out).join('\n')}\n`);
  }
  process.exit(pass ? 0 : 1);
}
function calibrationLines(cal) {
  const m = cal.measured; const t = cal.trial;
  return ['The trial\'s own corpus: `k300.mjs` (trial scripts `b2f8fe25e`, verbatim; PAGE-2\'s 300 towns, `hxd-<size>-0..49`, `{ ...DEFAULT_CONFIG, settType }`, no law) born on the trial\'s base `6b82c8e4a`, on its fold `f4a434660`, and on the fold + the Wealthiest Merchant arm; every card paired by (seed, id). At the base a card\'s `role` holds the printed office word, so a pool role is named by its transition and printed words (below).', '',
    '| figure | the trial (K.md; items 36, 42) | measured here |', '|---|---|---|',
    `| towns · cards | ${t.towns} · ${t.cards} | ${m.towns} · ${m.cards} (cards unmatched by id: ${m.unmatched}) |`,
    ...Object.entries(t.moved).map(([r, v]) => `| ${r} | ${v[0]} → ${v[1]}, ${v[2]} cards | ${m.moved[r][0]} → ${m.moved[r][1]}, ${m.moved[r][2]} cards |`),
    `| cards · towns, base → fold (cards not named above) | ${t.movedCards} · ${t.movedTowns} (0) | ${m.movedCards} · ${m.movedTowns} (${m.unnamed}) |`,
    `| Wealthiest Merchant, fold → fold + arm: low → moderate (any other move) | ${t.wealthiest} (0) | ${m.wealthiest} in ${m.wealthiestTowns} towns (${m.wealthiestOther}) |`,
    `| pool roles whose band moves (\`kRoles.mjs\` on the fold, rows with a pool source) | Guild Master, Thieves Guild Master, Council Member; "No other" | ${Object.entries(m.poolRolesMoved).map(([r, x]) => `${r} ${x}`).join(', ')} |`, '',
    `The printed words, base → fold: ${Object.entries(m.printedWords.fold).sort((x, y) => y[1] - x[1]).map(([k, n]) => `${k} ${n}`).join(' · ')}. Fold → fold + arm: ${Object.entries(m.printedWords.arm).sort((x, y) => y[1] - x[1]).map(([k, n]) => `${k} ${n}`).join(' · ') || 'none'}.`, '',
    `**CALIBRATION ${cal.pass ? 'PASSES' : 'FAILS: STOPPED'}.**`];
}

// ── birth ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function birth(treeArg, arm, pool, size, outPath) {
  const T = resolve(treeArg);
  const imp = (p) => import(join(T, p));
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
  const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
  const { contestKindOf } = await imp('src/domain/seat/seatTable.js');
  const { SEAT_CONTEST_LIT } = await imp('src/domain/seat/seatCircumstances.js');
  const { powerBandOfRole } = await imp('src/generators/npcGenerator.js');
  const FORCE = { _seatLawVersion: 2 };
  await loadGenerationLawPayloads();
  // ── u4/measure-lit.mjs :: visitorJob, verbatim (MEASURE-VISITOR, BMV 97ce109e2) ──
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
  const POOLS = {
    chair600: (s) => Array.from({ length: 100 }, (_, i) => ({ size: s, preset: null, seed: `hxd-${s}-${i}`, config: { ...DEFAULT_CONFIG, settType: s } })),
    visitor: (s) => Array.from({ length: 100 }, (_, i) => visitorJob(s, i)),
  };
  if (!POOLS[pool]) fail(`unknown pool ${pool}`);
  if (!SIZES.includes(size)) fail(`unknown size ${size}`);
  const lines = [JSON.stringify({ meta: { arm, tree: T, force: FORCE, pool, size, lit: SEAT_CONTEST_LIT, bands: Object.fromEntries(ROLES.map((r) => [r, powerBandOfRole(r)])) } })];
  const t0 = Date.now();
  for (const job of POOLS[pool](size)) {
    const rec = { pool, seed: job.seed, size: job.size };
    let t;
    try {
      t = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCE }, null, job.options ? { seed: job.seed, ...job.options } : { seed: job.seed, customContent: {} });
    } catch (e) { rec.error = `birth: ${String(e?.stack || e).split('\n').slice(0, 3).join(' | ')}`; lines.push(JSON.stringify(rec)); continue; }
    rec.hash = h16(t);
    rec.calm = !t.stress;
    rec.cfg = `seat=${t.config?._seatLawVersion ?? null}`;
    rec.rp = t.config?._randomizePriorities === true;
    // the record, by top-level key (and powerStructure's keys), hashed: what else moves
    rec.keys = Object.fromEntries(Object.keys(t).map((k) => [k, h16(t[k])]));
    for (const k of Object.keys(t.powerStructure || {})) rec.keys[`powerStructure.${k}`] = h16(t.powerStructure[k]);
    // the cards: id, role, band, power, position, the goal (its two lines and its intent), the rank-1 memberships
    rec.cards = (t.npcs || []).map((n) => ({ id: n?.id, name: n?.name, role: n?.role, influence: n?.influence, power: n?.power, sp: h16(n?.structuralPosition),
      goal: { short: n?.goal?.short ?? null, long: n?.goal?.long ?? null, intent: h16(n?.goal?.intent) }, rest: h16({ ...n, influence: 0, power: 0, structuralPosition: 0, goal: 0 }),
      rank1: (n?.memberships || []).filter((m) => m?.rank === 1).map((m) => m.power) }));
    rec.ties = (t.relationships || []).map((x) => ({ h: h16(x), from: x?.from, to: x?.to, type: x?.type, typeName: x?.typeName, strength: x?.strength, d: h16(x?.description) }));
    rec.conflicts = (t.powerStructure?.conflicts || []).map((c) => ({ parties: c?.parties ?? null, issue: c?.issue ?? null, stakes: c?.stakes ?? null, intensity: c?.intensity ?? null, desc: c?.desc ?? null }));
    rec.conflictsTwin = JSON.stringify(t.conflicts ?? null) === JSON.stringify(t.powerStructure?.conflicts ?? null);
    rec.rels = (t.powerStructure?.factionRelationships || []).map((x) => ({ pair: x?.pair ?? null, type: x?.type ?? null, direction: x?.direction ?? null, narrative: x?.narrative ?? null }));
    rec.pressure = t.pressureSentence ?? null;
    // the contest: u4/measure-lit.mjs :: birth's read, verbatim
    try {
      const gov = governingFactionOf(t);
      const rows = (t.powerStructure?.factions || []).filter((f) => f && f !== gov);
      rec.present = [...new Set(rows.map((f) => contestKindOf(f)))];
      const kindByName = new Map(rows.map((f) => [nameOf(f), contestKindOf(f)]));
      const c = coupContenders(t);
      rec.top = c.challengers.map((x) => kindByName.get(x.name) ?? null);
      rec.field = c.challengers.map((x) => `${x.name}=${x.weight}`).join(';');
      rec.risk = coupRiskLabel(c);
      rec.protected = !!c.incumbent?.gated;
    } catch (e) { rec.error = `reader: ${String(e?.stack || e).split('\n').slice(0, 3).join(' | ')}`; }
    lines.push(JSON.stringify(rec));
  }
  writeFileSync(outPath, `${lines.join('\n')}\n`);
  console.log(`${arm} ${pool} ${size}: ${lines.length - 1} places, ${Math.round((Date.now() - t0) / 1000)} s -> ${outPath}`);
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const ARMS = [
  { id: 'S', label: 'S (the lane tip; the band as today)' },
  { id: 'SK', label: 'SK (S + the fold f4a434660)' },
  { id: 'SKW', label: 'SKW (SK + the Wealthiest Merchant arm)' },
];
const POOL_ORDER = ['visitor', 'chair600'];
const POOL_LABEL = {
  visitor: 'THE VISITOR POOL (the owner\'s headline; `u4/measure-lit.mjs :: visitorJob`, `visitor-<size>-0..99`)',
  chair600: 'the chair\'s 600 (pool B, `hxd-<size>-0..99`, `{ ...DEFAULT_CONFIG, settType }`, no `_randomizePriorities`)',
};

function loadRows(dir) {
  const byArm = {}; const metas = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.jsonl')).sort()) {
    const arm = f.split('.')[0];
    const [head, ...rows] = readFileSync(join(dir, f), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    if (!head.meta) fail(`${f}: no meta line`);
    (metas[arm] ||= []).push(head.meta);
    (byArm[arm] ||= []).push(...rows);
  }
  return { byArm, metas };
}

/** kClasses.mjs's conflict read on `powerStructure.conflicts`: #length, and parties[j] at an index both sides hold. */
function conflictMove(b, a) {
  const out = { gain: a.length > b.length, lose: a.length < b.length, swap: false, other: false };
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    const pb = b[i].parties || []; const pa = a[i].parties || [];
    for (let j = 0; j < Math.max(pb.length, pa.length); j += 1) if (pb[j] !== pa[j]) out.swap = true;
    if (['issue', 'stakes', 'intensity', 'desc'].some((k) => b[i][k] !== a[i][k])) out.other = true;
  }
  out.any = out.gain || out.lose || out.swap || out.other;
  return out;
}

/** the first card of each power (kClasses.mjs :: firstOf): power -> card */
const firstOf = (cards) => { const m = new Map(); for (const c of cards) for (const p of c.rank1) if (!m.has(p)) m.set(p, c); return m; };

function aggregate(rows) {
  const ok = rows.filter((r) => !r.error);
  const kinds = { present: {}, contends: {}, none: 0 };
  const ladder = {}; const contendsBySize = {}; const noneBySize = {};
  const first = { powers: 0, low: 0, bySize: {} };
  for (const r of ok) {
    for (const k of r.present) bump(kinds.present, k);
    for (const k of new Set(r.top)) { bump(kinds.contends, String(k)); bump((contendsBySize[r.size] ||= {}), String(k)); }
    if (!r.top.length) { kinds.none += 1; bump(noneBySize, r.size); }
    bump(((ladder[r.size] ||= {})[r.calm ? 'calm' : 'crisis'] ||= {}), ladderKey(r.risk));
    const fs = (first.bySize[r.size] ||= { powers: 0, low: 0 });
    for (const [, c] of firstOf(r.cards)) { first.powers += 1; fs.powers += 1; if (c.influence === 'low') { first.low += 1; fs.low += 1; } }
  }
  return { places: rows.length, errors: rows.filter((r) => r.error).map((r) => ({ seed: r.seed, error: r.error })), kinds, ladder, contendsBySize, noneBySize, first };
}

/** S against an arm, place by place */
function pair(a, b) {
  const byKey = new Map(a.filter((r) => !r.error).map((r) => [r.seed, r]));
  const P = { paired: 0, identical: 0, bySize: {}, conflictEx: {}, contest: { fieldOrRisk: 0, topKinds: 0, enter: {}, leave: {}, riskMoves: {}, ex: null },
    roles: {}, cardsMoved: 0, cardsUnmatched: 0, firstFlip: { lowToHigher: 0, higherToLow: 0, ex: null }, keys: {}, other: {} };
  const noteOther = (field, town, leafN, ex) => { const o = (P.other[field] ||= { leaves: 0, towns: new Set(), ex: null }); o.leaves += leafN; o.towns.add(town); if (!o.ex) o.ex = ex; };
  for (const r of b) {
    const o = byKey.get(r.seed);
    if (!o || r.error) continue;
    P.paired += 1;
    const s = (P.bySize[r.size] ||= { n: 0, identical: 0, gain: 0, lose: 0, swap: 0, other: 0, any: 0, contestMoved: 0, cardTowns: 0 });
    s.n += 1;
    if (o.hash === r.hash) { P.identical += 1; s.identical += 1; continue; }
    // 1. the conflicts
    const cm = conflictMove(o.conflicts, r.conflicts);
    for (const k of ['gain', 'lose', 'swap', 'other', 'any']) if (cm[k]) { s[k] += 1; if (k !== 'any' && !P.conflictEx[k]) P.conflictEx[k] = { seed: r.seed, before: o.conflicts.map((c) => c.parties?.join(' / ')), after: r.conflicts.map((c) => c.parties?.join(' / ')), desc: [o.conflicts.map((c) => c.desc), r.conflicts.map((c) => c.desc)] }; }
    if (!r.conflictsTwin || !o.conflictsTwin) noteOther('conflicts twin differs from powerStructure.conflicts', r.seed, 1, r.seed);
    // 2. the contest
    if (o.field !== r.field || o.risk !== r.risk) {
      P.contest.fieldOrRisk += 1; s.contestMoved += 1;
      if (!P.contest.ex) P.contest.ex = { seed: r.seed, before: `${o.field || '(none)'} [${o.risk}]`, after: `${r.field || '(none)'} [${r.risk}]` };
      if (o.risk !== r.risk) bump(P.contest.riskMoves, `${ladderKey(o.risk)} -> ${ladderKey(r.risk)}`);
    }
    const A = new Set(o.top.map(String)); const B = new Set(r.top.map(String)); let moved = false;
    for (const k of B) if (!A.has(k)) { bump(P.contest.enter, k); moved = true; }
    for (const k of A) if (!B.has(k)) { bump(P.contest.leave, k); moved = true; }
    if (moved) P.contest.topKinds += 1;
    // 4. the cards whose band moves, by role; and what else moves
    const cb = new Map(o.cards.map((c) => [c.id, c]));
    let townCards = 0;
    for (const c of r.cards) {
      const x = cb.get(c.id);
      if (!x) { P.cardsUnmatched += 1; continue; }
      if (x.influence !== c.influence) {
        townCards += 1; P.cardsMoved += 1;
        const k = `${c.role}: ${x.influence} -> ${c.influence}`;
        const e = (P.roles[k] ||= { cards: 0, towns: new Set(), power: {} });
        e.cards += 1; e.towns.add(r.seed); bump(e.power, `${x.power} -> ${c.power}`);
      } else if (x.role !== c.role) noteOther('a card\'s role (same id)', r.seed, 1, `${r.seed} ${c.id}: ${x.role} -> ${c.role}`);
      if (x.goal.short !== c.goal.short || x.goal.long !== c.goal.long || x.goal.intent !== c.goal.intent) {
        const which = [x.goal.short !== c.goal.short && 'short', x.goal.long !== c.goal.long && 'long', x.goal.intent !== c.goal.intent && 'intent'].filter(Boolean).join('+');
        noteOther('goals (npcs[].goal: short, long or intent)', r.seed, 1, `${r.seed} ${c.name} (${c.role}) goal ${which}: "${x.goal.short} / ${x.goal.long}" -> "${c.goal.short} / ${c.goal.long}"`);
      }
      if (x.rest !== c.rest) noteOther('a card\'s other fields (beyond influence, power, structuralPosition, goal)', r.seed, 1, `${r.seed} ${c.name} (${c.role})`);
      if (x.sp !== c.sp && x.influence === c.influence) noteOther('structuralPosition of a card whose band did not move', r.seed, 1, `${r.seed} ${c.name} (${c.role})`);
    }
    if (o.cards.length !== r.cards.length) noteOther('the roster length', r.seed, 1, `${r.seed}: ${o.cards.length} -> ${r.cards.length}`);
    if (townCards) s.cardTowns += 1;
    // the first card of each power: low before / not after, and back
    const fb = firstOf(o.cards); const fa = firstOf(r.cards);
    for (const [p, c] of fb) {
      const y = fa.get(p);
      if (!y) continue;
      if (c.influence === 'low' && y.influence !== 'low') { P.firstFlip.lowToHigher += 1; if (!P.firstFlip.ex) P.firstFlip.ex = `${r.seed}: ${p}'s first card ${c.name} (${c.role}) low -> ${y.influence}`; }
      if (c.influence !== 'low' && y.influence === 'low') P.firstFlip.higherToLow += 1;
    }
    // ties
    const tn = Math.max(o.ties.length, r.ties.length); let tieMoved = 0; let tieEx = null; let tieTypeMoved = 0; let tieTypeEx = null;
    for (let i = 0; i < tn; i += 1) {
      const x = o.ties[i]; const y = r.ties[i];
      if (x?.h !== y?.h) { tieMoved += 1; tieEx ||= `${r.seed} relationships[${i}] ${x?.from}~${x?.to}: ${x?.typeName}/${x?.strength} -> ${y?.typeName}/${y?.strength}${x?.d !== y?.d ? ' (description moved)' : ''}`; }
      if (x?.type !== y?.type || x?.strength !== y?.strength || x?.from !== y?.from || x?.to !== y?.to) { tieTypeMoved += 1; tieTypeEx ||= `${r.seed} relationships[${i}] ${x?.from}~${x?.to}: ${x?.typeName}/${x?.strength} -> ${y?.from}~${y?.to} ${y?.typeName}/${y?.strength}`; }
    }
    if (tieMoved) noteOther('ties (relationships[], any field: prose included)', r.seed, tieMoved, tieEx);
    if (tieTypeMoved) noteOther('ties whose ends, kind or strength moved', r.seed, tieTypeMoved, tieTypeEx);
    // the powers' relationships
    const rn = Math.max(o.rels.length, r.rels.length);
    for (let i = 0; i < rn; i += 1) {
      const x = o.rels[i] || {}; const y = r.rels[i] || {};
      if (x.narrative !== y.narrative) noteOther('the powers\' relationship narratives (powerStructure.factionRelationships[].narrative)', r.seed, 1, `${r.seed} [${(y.pair || x.pair || []).join(' / ')}]: "${x.narrative}" -> "${y.narrative}"`);
      if (x.direction !== y.direction) noteOther('the powers\' relationship directions', r.seed, 1, `${r.seed} [${(y.pair || x.pair || []).join(' / ')}]: ${x.direction} -> ${y.direction}`);
      if (x.type !== y.type) noteOther('the powers\' relationship types', r.seed, 1, `${r.seed} [${(y.pair || x.pair || []).join(' / ')}]: ${x.type} -> ${y.type}`);
    }
    if (o.pressure !== r.pressure) noteOther('the pressure sentence (pressureSentence)', r.seed, 1, `${r.seed}: "${o.pressure}" -> "${r.pressure}"`);
    for (const k of new Set([...Object.keys(o.keys), ...Object.keys(r.keys)])) if (o.keys[k] !== r.keys[k]) bump(P.keys, k);
  }
  for (const v of Object.values(P.roles)) v.towns = v.towns.size;
  for (const v of Object.values(P.other)) v.towns = v.towns.size;
  return P;
}

function report(dir, outDir, seatSha, foldSha, t0, calJson) {
  const { byArm, metas } = loadRows(dir);
  const cal = calJson ? JSON.parse(readFileSync(calJson, 'utf8')) : null;
  const writtenAt = new Date().toISOString();
  const runSeconds = Math.round(Date.now() / 1000 - Number(t0));
  // receipts: every arm's meta (the law, the dial, the tree's bands) and every place's config
  const WANT_BANDS = {
    S: { 'Guild Master': 'low', 'Thieves Guild Master': 'low', 'Council Member': 'low', 'Wealthiest Merchant': 'low' },
    SK: { 'Guild Master': 'high', 'Thieves Guild Master': 'high', 'Council Member': 'moderate', 'Wealthiest Merchant': 'low' },
    SKW: { 'Guild Master': 'high', 'Thieves Guild Master': 'high', 'Council Member': 'moderate', 'Wealthiest Merchant': 'moderate' },
  };
  const checks = [];
  for (const a of ARMS) {
    for (const m of metas[a.id] || []) {
      if (JSON.stringify(m.force) !== JSON.stringify({ _seatLawVersion: 2 })) fail(`${a.id}: forced ${JSON.stringify(m.force)}`);
      if (m.lit !== false) fail(`${a.id}: SEAT_CONTEST_LIT reads ${m.lit}`);
      if (JSON.stringify(m.bands) !== JSON.stringify(WANT_BANDS[a.id])) fail(`${a.id}: the tree's bands ${JSON.stringify(m.bands)}`);
    }
    const rows = byArm[a.id] || [];
    for (const pool of POOL_ORDER) for (const size of SIZES) if (rows.filter((r) => r.pool === pool && r.size === size).length !== 100) fail(`${a.id}: ${pool} ${size} has not 100 places`);
    const bad = rows.filter((r) => !r.error && r.cfg !== 'seat=2').length;
    if (bad) fail(`${a.id}: ${bad} places do not carry _seatLawVersion 2`);
    const rpBad = rows.filter((r) => !r.error && r.rp !== (r.pool === 'visitor')).length;
    if (rpBad) fail(`${a.id}: ${rpBad} places whose _randomizePriorities is not (pool === 'visitor')`);
    checks.push(`${a.id}: 1,200 places (100 a size a pool); every place's config \`_seatLawVersion: 2\`; the dial (\`SEAT_CONTEST_LIT\`) dark; \`_randomizePriorities: true\` on every visitor place and on no chair's-600 place; the tree's \`powerBandOfRole\`: ${Object.entries(WANT_BANDS[a.id]).map(([r, b]) => `${r} ${b}`).join(', ')}`);
  }
  const R = {}; const PAIR = {};
  for (const pool of POOL_ORDER) {
    R[pool] = {}; PAIR[pool] = {};
    for (const a of ARMS) R[pool][a.id] = aggregate((byArm[a.id] || []).filter((r) => r.pool === pool));
    for (const to of ['SK', 'SKW']) PAIR[pool][`S->${to}`] = pair((byArm.S || []).filter((r) => r.pool === pool), (byArm[to] || []).filter((r) => r.pool === pool));
    PAIR[pool]['SK->SKW'] = pair((byArm.SK || []).filter((r) => r.pool === pool), (byArm.SKW || []).filter((r) => r.pool === pool));
  }
  const totalErrors = ARMS.reduce((s, a) => s + (byArm[a.id] || []).filter((r) => r.error).length, 0);
  const totalPlaces = ARMS.reduce((s, a) => s + (byArm[a.id] || []).length, 0);

  const L = [
    '# MEASURE-UK: the corrected keyword of `powerBandOfRole`, measured before any build (a measure only; every rate is under today\'s standing)', '',
    `One command: \`sh docs/chair/2026-11-20/content/seat/uk/measure-uk.sh [<seat tip>] [--fold <commit>]\`, run time **${runSeconds} s**. Tree S = \`git archive ${seatSha}\`; SK = S with the fold \`${foldSha}\` applied (its diff of \`src/generators/npcGenerator.js\`, verbatim: \`_\` and space fold alike, both sides); SKW = SK with the Wealthiest Merchant arm (a SEPARATE proposal): **\`powerBandOfRole\`'s \`MID_POWER\` list gains the stem \`'wealthiest merchant'\` beside \`'wealthy_merchant'\` (K.md's K2 recipe), so the role "Wealthiest Merchant" reads \`wealthy_merchant\`'s band, moderate.** Every birth \`{ ...birthConfig(config), _seatLawVersion: 2 }\` (the law forced after \`birthConfig\`, as \`u4/measure-lit.mjs\` forces it; the fold is to land under the law), the dial dark, the contest read on the place as born. Written ${writtenAt}. Brief: \`../briefs/MEASURE-UK.md\`.`, '',
    `**The conflict read** (\`page-3/kClasses.mjs :: leaves\`, trial scripts \`b2f8fe25e\`, quoted): ${'`` if (x.length !== y.length) out.push({ path: `${path}#length`, before: x.length, after: y.length }); `` … `` else leaves(x[i], y[i], `${path}[${i}]`, out); ``'} — on \`powerStructure.conflicts\` a town GAINS a conflict when \`conflicts#length\` rises, LOSES one when it falls, and its PARTIES SWAP when a \`conflicts[i].parties[j]\` leaf moves at an index both sides hold (not exclusive). "Other" = only \`issue\`, \`stakes\`, \`intensity\` or \`desc\` moved. **The first card** is kClasses.mjs's \`firstOf\`: per power, the first card in roster order holding a rank-1 membership.`, '',
  ];
  // calibration
  L.push('## 0. THE CALIBRATION (done first; it can refute the instrument)', '');
  if (cal) L.push(...calibrationLines(cal), '',
    '*The instrument\'s first calibration (BUK, the same run\'s first attempt) read the trial\'s role counts from `kRoles.mjs`\'s "printed cards", by role NAME: it FAILED (0 cards under each of the three names, and two printed words moving, "the senior craft-guild master" 146 and "the senior guild master" 75), because at the trial\'s base a card\'s `role` prints the office word. That was the instrument\'s read, not the figures: the card-by-card pairing above replaced it before any S, SK or SKW birth.*', '');
  // the trees' role enumerations
  for (const id of ['SK', 'SKW']) {
    const f = join(dir, `kroles-${id}.txt`);
    try { L.push(`- \`kRoles.mjs\` on tree ${id} (every pool role and every role the 300 print): ${readFileSync(f, 'utf8').trim().split('\n').join(' · ')}`); } catch { /* absent */ }
  }
  L.push('');

  // 1. conflicts
  L.push('## 1. Towns whose powers\' CONFLICT changes, by size', '', 'Each cell: towns that GAIN · LOSE · SWAP a conflict\'s parties, of the 100 places (not exclusive); in brackets, the towns where a conflict\'s `issue`, `stakes`, `intensity` or `desc` moved (a swap moves its `desc` too, so the bracket overlaps the swap). "identical" = the whole born record byte-identical.', '');
  for (const pool of POOL_ORDER) {
    L.push(`### ${POOL_LABEL[pool]}`, '', `| arms | ${SIZES.join(' | ')} | Σ |`, `|---|${SIZES.map(() => '---').join('|')}|---|`);
    for (const k of ['S->SK', 'S->SKW', 'SK->SKW']) {
      const P = PAIR[pool][k]; const sum = (f) => SIZES.reduce((s, z) => s + (P.bySize[z]?.[f] || 0), 0);
      L.push(`| ${k} | ${SIZES.map((z) => { const s = P.bySize[z] || {}; return `${s.gain || 0} · ${s.lose || 0} · ${s.swap || 0} (${s.other || 0})`; }).join(' | ')} | ${sum('gain')} · ${sum('lose')} · ${sum('swap')} (${sum('other')}) |`);
      L.push(`| ${k}: identical · towns with a moved card | ${SIZES.map((z) => `${P.bySize[z]?.identical || 0} · ${P.bySize[z]?.cardTowns || 0}`).join(' | ')} | ${sum('identical')} · ${sum('cardTowns')} |`);
    }
    L.push('');
    for (const k of ['S->SK', 'S->SKW']) for (const [kind, e] of Object.entries(PAIR[pool][k].conflictEx)) L.push(`- e.g. ${k} ${kind}: ${e.seed}: [${e.before.join(' | ')}] → [${e.after.join(' | ')}]`);
    L.push('');
  }
  // 2. the contender table
  L.push('## 2. THE CONTENDER TABLE (`coupContenders` under the law, columns by `seatTable.js :: contestKindOf`, as `u4/measure-u4.mjs` tables it): present · contending, per kind', '');
  for (const pool of POOL_ORDER) {
    const seen = new Set(KINDS);
    for (const a of ARMS) for (const k of [...Object.keys(R[pool][a.id].kinds.present), ...Object.keys(R[pool][a.id].kinds.contends)]) seen.add(k);
    L.push(`### ${POOL_LABEL[pool]}`, '', `| kind | ${ARMS.map((a) => a.id).join(' | ')} |`, `|---|${ARMS.map(() => '---').join('|')}|`);
    for (const k of seen) {
      const cells = ARMS.map((a) => [R[pool][a.id].kinds.present[k] || 0, R[pool][a.id].kinds.contends[k] || 0]);
      if (cells.every(([p, c]) => !p && !c)) continue;
      L.push(`| ${k} | ${cells.map(([p, c]) => `${p} · ${c}`).join(' | ')} |`);
    }
    L.push(`| **no contender** | ${ARMS.map((a) => R[pool][a.id].kinds.none).join(' | ')} |`, '');
    L.push('Contending, per kind, by size (S → SK → SKW; only the kinds that contend anywhere):', '', `| kind | ${SIZES.join(' | ')} |`, `|---|${SIZES.map(() => '---').join('|')}|`);
    const contKinds = [...seen].filter((k) => ARMS.some((a) => R[pool][a.id].kinds.contends[k]));
    for (const k of contKinds) L.push(`| ${k} | ${SIZES.map((z) => ARMS.map((a) => R[pool][a.id].contendsBySize[z]?.[k] || 0).join(' → ')).join(' | ')} |`);
    L.push(`| no contender | ${SIZES.map((z) => ARMS.map((a) => R[pool][a.id].noneBySize[z] || 0).join(' → ')).join(' | ')} |`, '');
    L.push(`The risk ladder (${LADDER.join(' · ')}), calm and crisis-born apart:`, '', `| size | ${ARMS.map((a) => a.id).join(' | ')} |`, `|---|${ARMS.map(() => '---').join('|')}|`);
    for (const size of SIZES) for (const state of ['calm', 'crisis']) L.push(`| ${size} ${state} | ${ARMS.map((a) => LADDER.map((k) => R[pool][a.id].ladder[size]?.[state]?.[k] || 0).join(' · ')).join(' | ')} |`);
    L.push('');
    for (const k of ['S->SK', 'S->SKW']) {
      const c = PAIR[pool][k].contest;
      L.push(`- ${k}: the field or the risk moved in ${c.fieldOrRisk} of ${PAIR[pool][k].paired} places; the kinds in the field moved in ${c.topKinds} (${Object.keys({ ...c.enter, ...c.leave }).sort().map((x) => `${x} +${c.enter[x] || 0}/−${c.leave[x] || 0}`).join(' · ') || 'none'}); risk moves: ${Object.entries(c.riskMoves).map(([x, n]) => `${x} ${n}`).join(' · ') || 'none'}${c.ex ? `; e.g. ${c.ex.seed}: ${c.ex.before} → ${c.ex.after}` : ''}.`);
    }
    L.push('');
  }
  // 3. the first card
  L.push('## 3. The powers whose FIRST card reads low (the trial: 2,631 → 1,572 of 5,710 on its corpora)', '', `| pool | ${ARMS.map((a) => a.id).join(' | ')} | by size, S → SK → SKW (% low) |`, `|---|${ARMS.map(() => '---').join('|')}|---|`);
  for (const pool of POOL_ORDER) {
    L.push(`| ${pool} | ${ARMS.map((a) => { const f = R[pool][a.id].first; return `${f.low} of ${f.powers} (${pct(f.low, f.powers)}%)`; }).join(' | ')} | ${SIZES.map((z) => `${z} ${ARMS.map((a) => { const f = R[pool][a.id].first.bySize[z] || {}; return pct(f.low, f.powers); }).join('→')}`).join(' · ')} |`);
  }
  L.push('');
  for (const pool of POOL_ORDER) for (const k of ['S->SK', 'S->SKW']) { const f = PAIR[pool][k].firstFlip; L.push(`- ${pool} ${k}: first cards low → higher ${f.lowToHigher}, higher → low ${f.higherToLow}${f.ex ? `; e.g. ${f.ex}` : ''}.`); }
  L.push('');
  // 4. the cards by role, and what else moves
  L.push('## 4. Cards whose band moves, by role (the trial: Guild Master 221 and Thieves Guild Master 34 low → high, Council Member 18 low → moderate), and what else in the born record moves', '');
  for (const pool of POOL_ORDER) {
    L.push(`### ${POOL_LABEL[pool]}`, '');
    for (const k of ['S->SK', 'S->SKW']) {
      const P = PAIR[pool][k];
      L.push(`**${k}** (${P.paired} places paired, ${P.identical} byte-identical; cards whose band moved ${P.cardsMoved}; cards unmatched by id ${P.cardsUnmatched}):`, '', '| role: band | cards | towns | power before → after (cards) |', '|---|---|---|---|');
      for (const [role, e] of Object.entries(P.roles).sort((x, y) => y[1].cards - x[1].cards)) L.push(`| ${role} | ${e.cards} | ${e.towns} | ${Object.entries(e.power).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([p, n]) => `${p} (${n})`).join(', ')} |`);
      // by pool role, named as the calibration names them (a card prints its office word, not its pool role)
      const sumR = (Q, f) => Object.entries(Q.roles).filter(([x]) => f(x)).reduce((s, [, e]) => s + e.cards, 0);
      const W = PAIR[pool]['SK->SKW'];
      const wm = k === 'S->SKW' ? sumR(W, (x) => x.endsWith('low -> moderate')) : 0;
      const pr = { 'Guild Master (low → high)': sumR(P, (x) => x.endsWith('low -> high') && !/thie/i.test(x)), 'Thieves Guild Master (low → high)': sumR(P, (x) => x.endsWith('low -> high') && /thie/i.test(x)),
        'Council Member (low → moderate)': sumR(P, (x) => x.endsWith('low -> moderate')) - wm, ...(k === 'S->SKW' ? { 'Wealthiest Merchant (low → moderate; SK → SKW\'s moved cards)': wm } : {}) };
      const unnamed = P.cardsMoved - Object.values(pr).reduce((s, n) => s + n, 0);
      L.push('', `By pool role (named as the calibration names them: low → high with "thie" = Thieves Guild Master, other low → high = Guild Master, low → moderate = Council Member${k === 'S->SKW' ? ', less SK → SKW\'s moved cards = Wealthiest Merchant' : ''}): ${Object.entries(pr).map(([r, n]) => `${r} ${n}`).join(' · ')}; cards not so named ${unnamed}${k === 'S->SKW' ? `; SK → SKW moved ${W.cardsMoved} cards, all low → moderate: ${W.cardsMoved === wm}` : ''}.`);
      L.push('', '| what else moves | leaves | towns | one example |', '|---|---|---|---|');
      for (const [field, o] of Object.entries(P.other).sort((x, y) => y[1].towns - x[1].towns)) L.push(`| ${field} | ${o.leaves} | ${o.towns} | ${short(o.ex, 360).replace(/\|/g, '\\|')} |`);
      L.push('', `Top-level keys of the born record that moved (towns): ${Object.entries(P.keys).sort((x, y) => y[1] - x[1]).map(([x, n]) => `${x} ${n}`).join(' · ') || 'none'}.`, '');
    }
  }
  L.push('## Errors', '', `**${totalErrors} errors in ${totalPlaces} births.**`);
  for (const a of ARMS) for (const r of (byArm[a.id] || []).filter((x) => x.error)) L.push(`- ${a.id} ${r.pool} ${r.seed}: ${r.error}`);
  L.push('', '## Receipts', '', ...checks.map((c) => `- ${c}`));
  try { L.push(`- the plant (SKW): ${readFileSync(join(dir, 'plant-SKW.json'), 'utf8').trim()}`); } catch { /* absent */ }
  try { L.push(`- the fold (SK): ${readFileSync(join(dir, 'fold-SK.txt'), 'utf8').trim().split('\n').join(' · ')}`); } catch { /* absent */ }
  L.push('- The fold and the plant live only in scratch trees under the temporary directory, removed at the end. Nothing under src/ or tests/ of any checkout changes.', '');

  const json = { meta: { script: 'docs/chair/2026-11-20/content/seat/uk/measure-uk.sh', seatSha, foldSha, writtenAt, runSeconds, totalPlaces, totalErrors, force: { _seatLawVersion: 2 }, standing: "every rate is under today's standing" },
    calibration: cal, checks, aggregate: R, pairs: PAIR };
  writeFileSync(join(outDir, 'uk.json'), `${JSON.stringify(json, null, 1)}\n`);
  writeFileSync(join(outDir, 'uk.md'), `${L.join('\n')}\n`);
  console.log(`measure-uk: ${totalPlaces} births, ${totalErrors} errors; wrote uk.{md,json} (${runSeconds} s)`);
}

if (mode === 'plant') plant(rest[0]);
else if (mode === 'bands') await bands(rest[0]);
else if (mode === 'calibrate') calibrate(...rest);
else if (mode === 'birth') await birth(...rest);
else if (mode === 'report') report(rest[0], rest[1], rest[2], rest[3], rest[4], rest[5]);
else fail(`unknown mode ${mode}`);
