#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs — MEASURE-LIT (builder BML, SEAT-5's last unit, 2026-11-20;
 * brief `../briefs/MEASURE-LIT.md`): the contest measured LIT for the first time. A MEASURE ONLY: it changes nothing
 * under src/ or tests/ of any checkout. Driven by `measure-lit.sh` (the one command) in four modes:
 *
 *   resolve <scratch worktree>           the scratch merge's two source conflicts resolved exactly as the chair's joint
 *                                        reading section (a) says: KEEP BOTH, the seat's side first, the fortune's
 *                                        second, the seat's registry row closed by `}),` before the fortune's row. The
 *                                        four measured registers are left with their markers (the chair's: no src/
 *                                        module reads them).
 *   plant <tree> L1|LP                   in a scratch tree only: L1 = `SEAT_CONTEST_LIT = false` -> `true`; LP = L1 plus
 *                                        every factor of `SEAT_CIRCUMSTANCE_TUNING` (and `productCeiling`) set to the
 *                                        PROPOSED figure its own declaration carries in the comment beside it, read
 *                                        from the module text and checked against the DRAFT note of the register row
 *                                        (`tests/lint/.tuning-register.json`); never retyped. Stops if a text is absent.
 *   birth <tree> <arm> <force-json> <pools> <out.jsonl>
 *                                        one arm: every place of the named pools born from <tree> as
 *                                        `{ ...birthConfig(config), ...force }` (the laws forced AFTER birthConfig,
 *                                        as the chair's joint-measure.mjs and measure-u4.mjs --force-law do), read as
 *                                        born. Pools: `default` and `presets` are measure-holder.mjs's (900, 960);
 *                                        `chair600` is the chair's (`{ ...DEFAULT_CONFIG, settType }`, hxd-<size>-0..99).
 *                                        MEASURE-VISITOR (builder BMV, SEAT-6, brief `../briefs/MEASURE-VISITOR.md`)
 *                                        adds two: `visitor`, born EXACTLY as `store/settlementGenerateAction.js ::
 *                                        generateSettlementAction` births a visitor who touches no setting (see
 *                                        `visitorJob`), 100 a size, seeds visitor-<size>-0..99; and `cause`, the
 *                                        `default` pool (same seeds) with `tradeRouteAccess: 'random_trade'` and
 *                                        `monsterThreat: 'random_threat'` added and nothing else changed.
 *   report <rows dir> <out dir> <seat sha> <fortune sha> <cal seat sha> <cal fortune sha> [--calibration]
 *                                        the tables, `measure-lit.{md,json}`. With --calibration: the calibration only
 *                                        (exit 0 PASS, 1 FAIL; on FAIL the two tables are written to the md and json).
 *                                        The calibration reads MEASURE-LIT's own commits (arm `arm0-cal` on the cal
 *                                        seat, `both-D-cal` on the cal seat merged with the cal fortune).
 *
 * The readings are the chair's (joint-measure.mjs, joint-report.mjs): calm = `!t.stress`; contest =
 * `rulingPowerCoup.js :: coupContenders` + `coupRiskLabel`; contested = risk Contested or Critical; protected =
 * `incumbent.gated`. The contender table is measure-u4.mjs's (every column by `seatTable.js :: contestKindOf`).
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [mode, ...rest] = process.argv.slice(2);
const fail = (msg) => { console.error(`measure-lit: ${msg}`); process.exit(2); };

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LADDER = ['Holding', 'Stable', 'Contested', 'Critical'];
const ladderKey = (label) => (String(label).startsWith('Critical') ? 'Critical' : String(label));
const isContested = (risk) => risk === 'Contested' || String(risk).startsWith('Critical');
const pct = (n, d) => (d ? `${Math.round((1000 * n) / d) / 10}` : '-');
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };

// ── resolve ─────────────────────────────────────────────────────────────────────────────────────────────────────────
function resolveMerge(wt) {
  const EXPECT = { 'src/domain/density/densityCreateBoundary.js': 5, 'tests/lint/densityCreateBoundary.walker.test.js': 2 };
  let closers = 0;
  for (const [file, hunks] of Object.entries(EXPECT)) {
    const path = join(wt, file);
    const lines = readFileSync(path, 'utf8').split('\n');
    const out = []; let state = null; let ours = []; let theirs = []; let n = 0;
    for (const line of lines) {
      if (line.startsWith('<<<<<<< ')) { if (state) fail(`${file}: nested marker`); state = 'ours'; ours = []; theirs = []; continue; }
      if (line.startsWith('||||||| ')) fail(`${file}: a diff3 base section (merge.conflictStyle=merge was asked)`);
      if (line === '=======' && state === 'ours') { state = 'theirs'; continue; }
      if (line.startsWith('>>>>>>> ') && state === 'theirs') {
        n += 1;
        out.push(...ours);
        // the registry hunk: the seat row lacks its closing `}),` (it sits after the markers, for the fortune row)
        if (/^\s*seat: Object\.freeze\(\{$/.test(ours[0] ?? '') && /^\s*fortune: Object\.freeze\(\{$/.test(theirs[0] ?? '')) { out.push('  }),'); closers += 1; }
        out.push(...theirs);
        state = null;
        continue;
      }
      if (state === 'ours') ours.push(line); else if (state === 'theirs') theirs.push(line); else out.push(line);
    }
    if (state) fail(`${file}: an unclosed conflict`);
    if (n !== hunks) fail(`${file}: ${n} conflict hunks, the chair's report says ${hunks}`);
    writeFileSync(path, out.join('\n'));
    console.log(`resolved ${file}: ${n} hunks, kept both (seat first, fortune second)`);
  }
  if (closers !== 1) fail(`the registry row's closing '}),' was placed ${closers} times, expected 1`);
  console.log("the seat registry row closed by '  }),' before the fortune row: 1");
}

// ── plant ───────────────────────────────────────────────────────────────────────────────────────────────────────────
function plant(tree, variant) {
  if (!['L1', 'LP'].includes(variant)) fail(`plant variant ${variant}`);
  const rel = 'src/domain/seat/seatCircumstances.js';
  const file = join(tree, rel);
  let src = readFileSync(file, 'utf8');
  const DIAL = 'export const SEAT_CONTEST_LIT = false;';
  if (src.split(DIAL).length !== 2) fail(`plant: "${DIAL}" is not in ${rel} exactly once`);
  src = src.replace(DIAL, 'export const SEAT_CONTEST_LIT = true;');
  const receipt = { variant, file: rel, dial: 'SEAT_CONTEST_LIT false -> true', factors: null, productCeiling: null };
  if (variant === 'LP') {
    const lines = src.split('\n');
    const start = lines.findIndex((l) => /^\s*factors: Object\.freeze\(\{$/.test(l));
    if (start < 0) fail('plant: the factors block is not in the module');
    const factors = {};
    let i = start + 1;
    for (; i < lines.length && !/^\s*\}\),$/.test(lines[i]); i += 1) {
      const m = /^(\s*)(\w+): Object\.freeze\(\{ ([^}]*) \}\), \/\/ PROPOSED (\d+(?:\.\d+)?(?:, \d+(?:\.\d+)?)*)(.*)$/.exec(lines[i]);
      if (!m) fail(`plant: a factor line without its PROPOSED figure: ${lines[i].trim()}`);
      const [, indent, name, inner, proposed, tail] = m;
      const kinds = inner.split(', ').map((kv) => {
        const [k, v] = kv.split(': ');
        if (v !== '1') fail(`plant: ${name}.${k} reads ${v}, not the landed 1`);
        return k;
      });
      const figs = proposed.split(', ');
      if (figs.length !== kinds.length) fail(`plant: ${name} has ${kinds.length} kinds and ${figs.length} PROPOSED figures`);
      factors[name] = Object.fromEntries(kinds.map((k, j) => [k, Number(figs[j])]));
      lines[i] = `${indent}${name}: Object.freeze({ ${kinds.map((k, j) => `${k}: ${figs[j]}`).join(', ')} }), // PROPOSED ${proposed}${tail}`;
    }
    if (i >= lines.length || !Object.keys(factors).length) fail('plant: the factors block did not close');
    const ci = lines.findIndex((l) => /^\s*productCeiling: \d+(?:\.\d+)?, \/\/ PROPOSED \d+(?:\.\d+)?$/.test(l));
    if (ci < 0) fail('plant: productCeiling without its PROPOSED figure');
    const [, , ceil] = /productCeiling: (\d+(?:\.\d+)?), \/\/ PROPOSED (\d+(?:\.\d+)?)$/.exec(lines[ci]);
    lines[ci] = lines[ci].replace(/productCeiling: \d+(?:\.\d+)?,/, `productCeiling: ${ceil},`);
    src = lines.join('\n');
    receipt.factors = factors;
    receipt.productCeiling = Number(ceil);
    // the cross-check: the register row's DRAFT note names the same figures, leaf for leaf
    const reg = readFileSync(join(tree, 'tests/lint/.tuning-register.json'), 'utf8');
    const at = reg.indexOf('"src/domain/seat/seatCircumstances.js#SEAT_CIRCUMSTANCE_TUNING"');
    if (at < 0) fail('plant: the register row is not in tests/lint/.tuning-register.json');
    const noteAt = reg.indexOf('"note": "', at);
    const note = reg.slice(noteAt, reg.indexOf('\n', noteAt));
    const fromNote = {};
    for (const [, c, k, v] of note.matchAll(/factors\.(\w+)\.(\w+) (\d+(?:\.\d+)?)/g)) (fromNote[c] ||= {})[k] = Number(v);
    const noteCeil = /productCeiling (\d+(?:\.\d+)?)/.exec(note)?.[1];
    if (JSON.stringify(fromNote) !== JSON.stringify(factors) || Number(noteCeil) !== receipt.productCeiling) {
      fail(`plant: the module's PROPOSED figures ${JSON.stringify(factors)} ceiling ${ceil} differ from the register note's ${JSON.stringify(fromNote)} ceiling ${noteCeil}`);
    }
    receipt.registerNoteAgrees = true;
  }
  writeFileSync(file, src);
  console.log(JSON.stringify(receipt));
}

// ── birth ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function birth(treeArg, arm, forceJson, poolsCsv, outPath) {
  const T = resolve(treeArg);
  const imp = (p) => import(join(T, p));
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
  const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
  const { contestKindOf } = await imp('src/domain/seat/seatTable.js');
  const { seatCircumstancesOf, SEAT_CONTEST_LIT, SEAT_CIRCUMSTANCE_TUNING } = await imp('src/domain/seat/seatCircumstances.js');
  const { ARCHETYPES, archetypePatch } = await imp('src/components/generate/characterPresets.js');
  const FORCE = JSON.parse(forceJson);
  await loadGenerationLawPayloads();
  const PRESETS = ARCHETYPES.map((a) => a.key).filter((k) => k !== 'balanced');
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
  const POOLS = {
    default: () => SIZES.flatMap((tier) => Array.from({ length: 150 }, (_, i) => ({ size: tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier } }))),
    presets: () => SIZES.flatMap((tier) => PRESETS.flatMap((preset) => Array.from({ length: 10 }, (_, i) => ({ size: tier, preset, seed: `seat-measure-${tier}-${preset}-${i}`, config: { settType: tier, ...archetypePatch(preset) } })))),
    chair600: () => SIZES.flatMap((size) => Array.from({ length: 100 }, (_, i) => ({ size, preset: null, seed: `hxd-${size}-${i}`, config: { ...DEFAULT_CONFIG, settType: size } }))),
    visitor: () => SIZES.flatMap((size) => Array.from({ length: 100 }, (_, i) => visitorJob(size, i))),
    cause: () => SIZES.flatMap((tier) => Array.from({ length: 150 }, (_, i) => ({ size: tier, preset: null, seed: `seat-measure-${tier}-${i}`, config: { settType: tier, tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat' } }))),
  };
  const lines = [JSON.stringify({ meta: { arm, tree: T, force: FORCE, pools: poolsCsv, lit: SEAT_CONTEST_LIT, factors: SEAT_CIRCUMSTANCE_TUNING.factors, productCeiling: SEAT_CIRCUMSTANCE_TUNING.productCeiling } })];
  const t0 = Date.now();
  for (const pool of poolsCsv.split(',')) {
    if (!POOLS[pool]) fail(`unknown pool ${pool}`);
    for (const job of POOLS[pool]()) {
      const rec = { pool, seed: job.seed, size: job.size, preset: job.preset };
      let t;
      try {
        t = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCE }, null, job.options ? { seed: job.seed, ...job.options } : { seed: job.seed, customContent: {} });
      } catch (e) { rec.error = `birth: ${String(e?.stack || e).split('\n').slice(0, 3).join(' | ')}`; lines.push(JSON.stringify(rec)); continue; }
      rec.hash = createHash('sha256').update(JSON.stringify(t)).digest('hex').slice(0, 16);
      rec.calm = !t.stress;
      rec.cfg = `seat=${t.config?._seatLawVersion ?? null} fortune=${t.config?._fortuneLawVersion ?? null}`;
      // MEASURE-VISITOR receipts: the road and threat the place was born on (as resolved), and the rolled-priorities flag
      rec.route = t.config?.tradeRouteAccess ?? null;
      rec.threat = t.config?.monsterThreat ?? null;
      rec.rp = t.config?._randomizePriorities === true;
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
        rec.held = seatCircumstancesOf(t);
      } catch (e) { rec.error = `reader: ${String(e?.stack || e).split('\n').slice(0, 3).join(' | ')}`; }
      lines.push(JSON.stringify(rec));
    }
  }
  writeFileSync(outPath, `${lines.join('\n')}\n`);
  console.log(`${arm} [${poolsCsv}]: ${lines.length - 1} places, lit ${SEAT_CONTEST_LIT}, ${Math.round((Date.now() - t0) / 1000)} s -> ${outPath}`);
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// Fortune OFF = the arms on tree S (no fortune law forced); fortune ON = the arms on tree SF (S merged with the fortune
// commit, `_fortuneLawVersion: 2` forced). Every fortune-off rate is under today's standing.
const ARMS = [
  { id: 'arm0', label: 'Arm 0, today (S, no law forced; fortune off)', set: 'today', variant: 'D', force: {} },
  { id: 'seat-D', label: 'seat law, D (dark); fortune off', set: 'seat', variant: 'D', force: { _seatLawVersion: 2 } },
  { id: 'seat-L1', label: 'seat law, L1 (lit at 1); fortune off', set: 'seat', variant: 'L1', force: { _seatLawVersion: 2 } },
  { id: 'seat-LP', label: 'seat law, LP (lit, proposed); fortune off', set: 'seat', variant: 'LP', force: { _seatLawVersion: 2 } },
  { id: 'both-D', label: 'seat + fortune, D (dark); fortune on', set: 'both', variant: 'D', force: { _seatLawVersion: 2, _fortuneLawVersion: 2 } },
  { id: 'both-L1', label: 'seat + fortune, L1 (lit at 1); fortune on', set: 'both', variant: 'L1', force: { _seatLawVersion: 2, _fortuneLawVersion: 2 } },
  { id: 'both-LP', label: 'seat + fortune, LP (lit, proposed); fortune on', set: 'both', variant: 'LP', force: { _seatLawVersion: 2, _fortuneLawVersion: 2 } },
];
const STANDING = (a) => (a.set !== 'both' ? ' *(under today\'s standing)*' : '');
const POOL_ORDER = ['visitor', 'chair600', 'default', 'cause'];
const POOL_LABEL = {
  visitor: 'THE VISITOR (the headline): born as `settlementGenerateAction.js` births a visitor who touches no setting, the size picked; `visitor-<size>-0..99`',
  chair600: 'the chair\'s 600 (pool B): `{ ...birthConfig({ ...DEFAULT_CONFIG, settType }), ...force }`, `hxd-<size>-0..99`; no `_randomizePriorities`',
  default: 'pool A (measure-holder.mjs\'s default, `birthConfig({ settType })`): NOT A VISITOR\'S WORLD (road and threat unset)',
  cause: 'pool A\' (the cause arm: pool A with `tradeRouteAccess: \'random_trade\'`, `monsterThreat: \'random_threat\'` added, same seeds): NOT A VISITOR\'S WORLD',
};
const KINDS = ['noble', 'craft', 'merchant', 'military', 'religious', 'arcane', 'labor', 'outsider', 'criminal', 'occupation', 'government', 'other'];
/** The chair's joint reading (report.txt (b)), calm places contested, % by size. */
const CHAIR = {
  arm0: ['0', '7.6', '70', '8.6', '0', '0'],
  'both-D': ['0', '1.5', '17.1', '8.6', '16.4', '10.4'],
  'seat-D': ['0', '7.6', '67.1', '5.7', '0', '0'],
  calmN: [70, 66, 70, 70, 73, 67],
  bothCrisisProtected: ['100', '100', '100', '83.3', '66.7', '48.5'],
};

function loadRows(dir) {
  const byArm = {}; const metas = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.jsonl')).sort()) {
    const arm = f.split('.')[0];
    const lines = readFileSync(join(dir, f), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    const [head, ...rows] = lines;
    if (!head.meta) fail(`${f}: no meta line`);
    (metas[arm] ||= []).push(head.meta);
    (byArm[arm] ||= []).push(...rows);
  }
  return { byArm, metas };
}

function calmContested(rows, pool) {
  return SIZES.map((size) => {
    const calm = rows.filter((r) => r.pool === pool && r.size === size && !r.error && r.calm);
    const n = calm.filter((r) => isContested(r.risk)).length;
    return { size, n, d: calm.length, pct: pct(n, calm.length) };
  });
}

function aggregate(rows) {
  const ok = rows.filter((r) => !r.error);
  const kinds = { present: {}, contends: {}, none: 0 };
  const ladder = {}; const crisisProtected = {}; const markers = {}; const circumstances = {};
  const routes = {}; const threats = {}; let rolledPriorities = 0;
  for (const r of ok) {
    for (const k of r.present) bump(kinds.present, k);
    for (const k of new Set(r.top)) bump(kinds.contends, String(k));
    if (!r.top.length) kinds.none += 1;
    const state = r.calm ? 'calm' : 'crisis';
    bump(((ladder[r.size] ||= {})[state] ||= {}), ladderKey(r.risk));
    bump(markers, r.cfg);
    bump(routes, String(r.route));
    bump(threats, String(r.threat));
    if (r.rp) rolledPriorities += 1;
    for (const c of r.held) bump(circumstances, c);
    if (!r.held.length) bump(circumstances, '(none)');
  }
  for (const size of SIZES) {
    const crisis = ok.filter((r) => r.size === size && !r.calm);
    const n = crisis.filter((r) => r.protected).length;
    crisisProtected[size] = { n, d: crisis.length, pct: pct(n, crisis.length) };
  }
  return { places: rows.length, errors: rows.filter((r) => r.error).map((r) => ({ seed: r.seed, error: r.error })), kinds, ladder, crisisProtected, markers, circumstances, routes, threats, rolledPriorities };
}

/** Pair two arms place by place: the places whose field or risk moved, and the kinds that enter or leave the top three. */
function pairArms(a, b) {
  const byKey = new Map(a.filter((r) => !r.error).map((r) => [`${r.pool}|${r.seed}`, r]));
  const out = { paired: 0, fieldOrRiskMoved: 0, topKindsMoved: 0, enter: {}, leave: {}, calmContestedOn: [], calmContestedOff: [] };
  for (const r of b) {
    const o = byKey.get(`${r.pool}|${r.seed}`);
    if (!o || r.error) continue;
    out.paired += 1;
    if (o.field !== r.field || o.risk !== r.risk) out.fieldOrRiskMoved += 1;
    const A = new Set(o.top.map(String)); const B = new Set(r.top.map(String));
    let moved = false;
    for (const k of B) if (!A.has(k)) { bump(out.enter, k); moved = true; }
    for (const k of A) if (!B.has(k)) { bump(out.leave, k); moved = true; }
    if (moved) out.topKindsMoved += 1;
    if (r.calm && o.calm) {
      if (isContested(r.risk) && !isContested(o.risk)) out.calmContestedOn.push(`${r.seed}`);
      if (!isContested(r.risk) && isContested(o.risk)) out.calmContestedOff.push(`${r.seed}`);
    }
  }
  return out;
}

/** Two arms' records of one pool, whole born record hashed: how many are byte-identical; the others' contest reading. */
function sameRecords(a, b) {
  const r0 = new Map(a.map((r) => [r.seed, r]));
  const differ = b.filter((r) => !r.hash || r0.get(r.seed)?.hash !== r.hash).map((r) => {
    const o = r0.get(r.seed) || {};
    return { seed: r.seed, calm: r.calm, contestReadingSame: o.risk === r.risk && o.field === r.field && o.calm === r.calm && o.protected === r.protected };
  });
  return { same: b.length - differ.length, of: b.length, differ };
}
const sameLine = (s) => `${s.same} of ${s.of} places byte-identical${s.differ.length
  ? `; the others: ${s.differ.length} (${s.differ.filter((d) => d.contestReadingSame).length} with the contest reading identical, ${s.differ.filter((d) => !d.contestReadingSame).length} MOVED${s.differ.filter((d) => !d.contestReadingSame).length ? `: ${s.differ.filter((d) => !d.contestReadingSame).slice(0, 12).map((d) => `${d.seed} ${d.calm ? 'calm' : 'crisis-born'}`).join(', ')}` : ''})`
  : ''}`;

/**
 * The gap between two pools' calm-contested figures, size by size: the difference in points and twice its standard
 * error (pooled proportion, the two pools' calm n), and whether the difference stands beyond that noise.
 */
function gapOf(x, y) {
  const sizes = SIZES.map((size, i) => {
    const a = x[i]; const b = y[i];
    if (!a.d || !b.d) return { size, diff: 0, twoSE: 0, beyond: false, empty: true }; // no calm place on a side: no gap read
    const p1 = a.n / a.d; const p2 = b.n / b.d;
    const pp = (a.n + b.n) / ((a.d + b.d) || 1);
    const se = Math.sqrt(pp * (1 - pp) * (1 / (a.d || 1) + 1 / (b.d || 1)));
    return { size, diff: Math.round(1000 * (p1 - p2)) / 10, twoSE: Math.round(2000 * se) / 10, beyond: Math.abs(p1 - p2) > 2 * se && p1 !== p2 };
  });
  return { sizes, sum: Math.round(10 * sizes.reduce((s, z) => s + Math.abs(z.diff), 0)) / 10, beyond: sizes.filter((z) => z.beyond).map((z) => z.size) };
}

function report(dir, outDir, seatSha, fortuneSha, calSeatSha, calFortuneSha, calibrationOnly) {
  const { byArm, metas } = loadRows(dir);
  const rowsOf = (id) => byArm[id] || [];
  const writtenAt = new Date().toISOString();
  // the calibration (it can refute the instrument), at MEASURE-LIT's own commits
  const measured = {
    arm0: calmContested(rowsOf('arm0-cal'), 'chair600'),
    'both-D': calmContested(rowsOf('both-D-cal'), 'chair600'),
  };
  const calibration = {
    at: { seat: calSeatSha, fortune: calFortuneSha },
    arm0: { chair: CHAIR.arm0, measured: measured.arm0.map((x) => x.pct), calmN: measured.arm0.map((x) => x.d) },
    'both-D': { chair: CHAIR['both-D'], measured: measured['both-D'].map((x) => x.pct), calmN: measured['both-D'].map((x) => x.d) },
  };
  calibration.pass = ['arm0', 'both-D'].every((k) => JSON.stringify(calibration[k].chair) === JSON.stringify(calibration[k].measured));
  if (rowsOf('sfoff-cal').length) calibration.sfOffEqualsArm0 = sameRecords(rowsOf('arm0-cal'), rowsOf('sfoff-cal'));
  const calLines = [
    '## THE CALIBRATION (done first; it can refute the instrument)', '',
    `At MEASURE-LIT's own commits: tree S = \`${calSeatSha}\`, tree SF = S merged with \`${calFortuneSha}\` (the same recipe). The chair's 600 places (\`{ ...DEFAULT_CONFIG, settType }\`, \`hxd-<size>-0..99\`), calm places whose seat reads contested (risk Contested or Critical), % by size (thorp · hamlet · village · town · city · metropolis):`, '',
    '| arm | the chair\'s joint reading | measured here | calm n | |', '|---|---|---|---|---|',
    `| Arm 0, today (S, no law) | ${CHAIR.arm0.join(' · ')} | ${calibration.arm0.measured.join(' · ')} | ${calibration.arm0.calmN.join(' · ')} | ${JSON.stringify(CHAIR.arm0) === JSON.stringify(calibration.arm0.measured) ? 'EQUAL' : 'DIFFERS'} |`,
    `| seat + fortune, D (SF) | ${CHAIR['both-D'].join(' · ')} | ${calibration['both-D'].measured.join(' · ')} | ${calibration['both-D'].calmN.join(' · ')} | ${JSON.stringify(CHAIR['both-D']) === JSON.stringify(calibration['both-D'].measured) ? 'EQUAL' : 'DIFFERS'} |`,
    '', `The chair's calm n: ${CHAIR.calmN.join(' · ')}. **CALIBRATION ${calibration.pass ? 'PASSES' : 'FAILS: STOPPED'}.**`,
  ];
  if (calibration.sfOffEqualsArm0) calLines.push('', `Sanity (the chair's (e), widened), at those commits: SF with no law forced, the whole born record hashed, against Arm 0 on S: ${sameLine(calibration.sfOffEqualsArm0)}.`);
  const head = [
    '# MEASURE-VISITOR: the contest measured on a VISITOR\'s world (the MEASURE-LIT instrument, extended; a measure only; every fortune-off rate is under today\'s standing)', '',
    `One command: \`sh docs/chair/2026-11-20/content/seat/u4/measure-lit.sh [<seat tip>] [--fortune <fortune commit>] [--cal-seat <c>] [--cal-fortune <c>]\`. Seat tip (tree S) \`${seatSha}\`; fortune \`${fortuneSha}\` (tree SF = S merged with it in a detached scratch worktree, the six conflicts per the chair's joint reading (a), MEASURE-LIT's recipe). The calibration at MEASURE-LIT's commits \`${calSeatSha}\` + \`${calFortuneSha}\`. Written ${writtenAt}. Briefs: \`../briefs/MEASURE-VISITOR.md\`, \`../briefs/MEASURE-LIT.md\`.`, '',
  ];
  if (calibrationOnly || !calibration.pass) {
    if (!calibration.pass) {
      const json = { meta: { seatSha, fortuneSha, calSeatSha, calFortuneSha, writtenAt, stopped: 'calibration' }, calibration, measuredCalibration: measured };
      writeFileSync(join(outDir, 'measure-lit.json'), `${JSON.stringify(json, null, 1)}\n`);
      writeFileSync(join(outDir, 'measure-lit.md'), `${[...head, ...calLines].join('\n')}\n`);
    }
    console.log(calLines.join('\n'));
    process.exit(calibration.pass ? 0 : 1);
  }

  // every arm's dial, factors and markers, checked against what it claims
  const plants = {};
  for (const f of readdirSync(dir).filter((x) => /^plant-.*\.json$/.test(x))) plants[f.replace(/^plant-|\.json$/g, '')] = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const allOnes = (factors) => Object.values(factors).every((row) => Object.values(row).every((v) => v === 1));
  const checks = [];
  for (const a of ARMS) {
    for (const m of metas[a.id] || []) {
      const lit = a.variant !== 'D';
      if (m.lit !== lit) fail(`${a.id}: the tree's SEAT_CONTEST_LIT reads ${m.lit}`);
      if (JSON.stringify(m.force) !== JSON.stringify(a.force)) fail(`${a.id}: forced ${JSON.stringify(m.force)}`);
      if (a.variant === 'LP') {
        const p = plants[`${a.set === 'seat' ? 'S' : 'SF'}-LP`];
        if (!p || JSON.stringify(m.factors) !== JSON.stringify(p.factors) || m.productCeiling !== p.productCeiling) fail(`${a.id}: the tree's table is not the planted proposal`);
      } else if (!allOnes(m.factors)) fail(`${a.id}: a factor is not 1`);
    }
    const want = `seat=${a.force._seatLawVersion ?? null} fortune=${a.force._fortuneLawVersion ?? null}`;
    const bad = rowsOf(a.id).filter((r) => !r.error && r.cfg !== want).length;
    if (bad) fail(`${a.id}: ${bad} places do not carry ${want}`);
    for (const pool of POOL_ORDER) if (!rowsOf(a.id).some((r) => r.pool === pool)) fail(`${a.id}: no ${pool} rows`);
    // the visitor's priorities roll; no other pool's do
    const rpBad = rowsOf(a.id).filter((r) => !r.error && r.rp !== (r.pool === 'visitor')).length;
    if (rpBad) fail(`${a.id}: ${rpBad} places whose _randomizePriorities is not (pool === 'visitor')`);
    checks.push(`${a.id}: lit ${a.variant !== 'D'}, ${a.variant === 'LP' ? 'factors = the planted proposal' : 'every factor 1'}, every place's config ${want}; \`_randomizePriorities: true\` on every visitor place and on no other`);
  }

  const R = {};
  for (const pool of POOL_ORDER) {
    R[pool] = {};
    for (const a of ARMS) {
      const rows = rowsOf(a.id).filter((r) => r.pool === pool);
      R[pool][a.id] = { ...aggregate(rows), calmContested: calmContested(rows, pool) };
    }
    for (const set of ['seat', 'both']) {
      R[pool][`${set}:D->L1`] = pairArms(rowsOf(`${set}-D`).filter((r) => r.pool === pool), rowsOf(`${set}-L1`).filter((r) => r.pool === pool));
      R[pool][`${set}:L1->LP`] = pairArms(rowsOf(`${set}-L1`).filter((r) => r.pool === pool), rowsOf(`${set}-LP`).filter((r) => r.pool === pool));
    }
  }
  const totalErrors = POOL_ORDER.reduce((s, pool) => s + ARMS.reduce((t, a) => t + R[pool][a.id].errors.length, 0), 0);
  const totalPlaces = POOL_ORDER.reduce((s, pool) => s + ARMS.reduce((t, a) => t + R[pool][a.id].places, 0), 0);
  // the same-source and fortune-off sanities at THIS run's commits
  const sanity = {
    arm0EqualsArm0Cal: sameRecords(rowsOf('arm0-cal'), rowsOf('arm0').filter((r) => r.pool === 'chair600')),
    sfOffEqualsArm0: Object.fromEntries(['chair600', 'visitor'].map((pool) => [pool, sameRecords(rowsOf('arm0').filter((r) => r.pool === pool), rowsOf('sfoff').filter((r) => r.pool === pool))])),
  };
  // the cause arm: pool A, pool A' (random road and threat) and pool B, per arm
  const cause = {};
  for (const a of ARMS) {
    const A = R.default[a.id].calmContested; const A2 = R.cause[a.id].calmContested; const B = R.chair600[a.id].calmContested; const V = R.visitor[a.id].calmContested;
    const gA = gapOf(A, B); const gA2 = gapOf(A2, B); const gV = gapOf(V, B);
    const reading = !gA.beyond.length ? 'no gap beyond noise to close'
      : !gA2.beyond.length ? 'CLOSES (no size beyond noise)'
        : gA2.sum <= gA.sum / 2 ? 'NARROWS (the summed gap at least halved; sizes beyond noise remain)' : 'DOES NOT CLOSE';
    cause[a.id] = { A: gA, Aprime: gA2, visitor: gV, reading };
  }
  const cell = (x) => `${x.pct} (${x.n}/${x.d})`;

  const L = [...head, ...calLines, ''];
  L.push('## Same source, and fortune off (the sanities at this run\'s commits)', '',
    `- Arm 0 on this run's S against Arm 0 at the calibration's S (the chair's 600, whole record hashed): ${sameLine(sanity.arm0EqualsArm0Cal)}.`,
    ...Object.entries(sanity.sfOffEqualsArm0).map(([pool, s]) => `- Tree SF (fortune \`${fortuneSha.slice(0, 9)}\`) with NO law forced against Arm 0 on S, the ${pool} pool, whole record hashed: ${sameLine(s)}.`), '');

  L.push('## THE HEADLINE: the visitor\'s world, calm places whose seat reads contested (risk Contested or Critical), by size', '',
    'Fortune OFF (tree S) → fortune ON (tree SF, `_fortuneLawVersion: 2`) in each cell, % (contested / calm). D = dark as committed; L1 = `SEAT_CONTEST_LIT` lit, every factor 1; LP = lit with the proposed figures. Fortune-off rates are under today\'s standing.', '',
    `| pool · arm | ${SIZES.join(' | ')} |`, `|---|${SIZES.map(() => '---').join('|')}|`);
  for (const pool of ['visitor', 'chair600']) {
    L.push(`| **${pool === 'visitor' ? 'VISITOR' : 'chair\'s 600'}** · Arm 0 (today, no law) | ${R[pool].arm0.calmContested.map(cell).join(' | ')} |`);
    for (const v of ['D', 'L1', 'LP']) {
      const off = R[pool][`seat-${v}`].calmContested; const on = R[pool][`both-${v}`].calmContested;
      L.push(`| **${pool === 'visitor' ? 'VISITOR' : 'chair\'s 600'}** · seat law ${v}: off → on | ${SIZES.map((_, i) => `${off[i].pct} → ${on[i].pct} (${on[i].n}/${on[i].d})`).join(' | ')} |`);
    }
  }
  L.push('');

  L.push('## THE CAUSE ARM: pool A (road and frontier) against pool B, and pool A\' (random road and threat added, nothing else)', '',
    'Pool A and pool A\' are NOT A VISITOR\'S WORLD; they are reported here only to test the cause. Calm places contested, % (n/calm), per arm; the gap is A − B (or A\' − B) in points, size by size, with twice its standard error; "beyond" = the difference stands beyond twice its standard error.', '');
  L.push(`| arm | pool | ${SIZES.join(' | ')} | Σ abs. gap to B (points) | sizes beyond noise |`, `|---|---|${SIZES.map(() => '---').join('|')}|---|---|`);
  for (const a of ARMS) {
    const c = cause[a.id];
    L.push(`| ${a.id} | A | ${R.default[a.id].calmContested.map(cell).join(' | ')} | ${c.A.sum} | ${c.A.beyond.join(', ') || 'none'} |`);
    L.push(`| ${a.id} | A' | ${R.cause[a.id].calmContested.map(cell).join(' | ')} | ${c.Aprime.sum} | ${c.Aprime.beyond.join(', ') || 'none'} |`);
    L.push(`| ${a.id} | B | ${R.chair600[a.id].calmContested.map(cell).join(' | ')} | | |`);
    L.push(`| ${a.id} | visitor | ${R.visitor[a.id].calmContested.map(cell).join(' | ')} | ${c.visitor.sum} | ${c.visitor.beyond.join(', ') || 'none'} |`);
  }
  L.push('', 'The gap size by size (A − B · A\' − B, points; ±2 SE of the A\' gap):', '', `| arm | ${SIZES.join(' | ')} | reading |`, `|---|${SIZES.map(() => '---').join('|')}|---|`);
  for (const a of ARMS) {
    const c = cause[a.id];
    L.push(`| ${a.id} | ${SIZES.map((_, i) => `${c.A.sizes[i].diff}${c.A.sizes[i].beyond ? '*' : ''} · ${c.Aprime.sizes[i].diff}${c.Aprime.sizes[i].beyond ? '*' : ''} (±${c.Aprime.sizes[i].twoSE})`).join(' | ')} | ${c.reading} |`);
  }
  L.push('', '`*` = beyond twice the standard error.', '', 'The road and threat each pool was born on (as the born config holds them; `null` = unset, which the generators read as `road` / `frontier` at their fallbacks), Arm 0:', '');
  for (const pool of POOL_ORDER) {
    const g = R[pool].arm0;
    L.push(`- ${pool}: road ${Object.entries(g.routes).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}; threat ${Object.entries(g.threats).sort().map(([k, v]) => `${k} ${v}`).join(' · ')}; priorities rolled in ${g.rolledPriorities} of ${g.places}.`);
  }
  L.push('');

  L.push('## Calm places whose seat reads contested (risk Contested or Critical), by size, every arm × pool', '',
    'Each cell: % (contested / calm places). S = the seat tip; SF = S merged with fortune. D = dark as committed; L1 = `SEAT_CONTEST_LIT` lit, every factor 1; LP = lit with the proposed figures.', '');
  for (const pool of POOL_ORDER) {
    L.push(`### ${POOL_LABEL[pool]}`, '', `| arm | ${SIZES.join(' | ')} |`, `|---|${SIZES.map(() => '---').join('|')}|`);
    for (const a of ARMS) L.push(`| ${a.label}${STANDING(a)} | ${R[pool][a.id].calmContested.map(cell).join(' | ')} |`);
    L.push('');
  }
  L.push('## Crisis-born incumbents protected (`incumbent.gated`), % by size', '');
  for (const pool of POOL_ORDER) {
    L.push(`### ${POOL_LABEL[pool]}`, '', `| arm | ${SIZES.join(' | ')} |`, `|---|${SIZES.map(() => '---').join('|')}|`);
    for (const a of ARMS) L.push(`| ${a.label}${STANDING(a)} | ${SIZES.map((s) => cell(R[pool][a.id].crisisProtected[s])).join(' | ')} |`);
    L.push('');
  }
  L.push('## The contender table per kind (present · contending; columns by `contestKindOf`, as measure-u4.mjs prints it)', '',
    'seat-* = fortune off (under today\'s standing); both-* = fortune on.', '');
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
  }
  L.push(`## The risk label by size, calm and crisis-born apart (${LADDER.join(' · ')})`, '');
  for (const pool of POOL_ORDER) {
    L.push(`### ${POOL_LABEL[pool]}`, '', `| size | ${ARMS.map((a) => a.id).join(' | ')} |`, `|---|${ARMS.map(() => '---').join('|')}|`);
    for (const size of SIZES) for (const state of ['calm', 'crisis']) {
      L.push(`| ${size} ${state} | ${ARMS.map((a) => LADDER.map((k) => R[pool][a.id].ladder[size]?.[state]?.[k] || 0).join(' · ')).join(' | ')} |`);
    }
    L.push('');
  }
  L.push('## LP: the circumstances held, and the kinds that enter or leave the top three against L1', '');
  const CIRC = ['craft_led', 'trade_wealth', 'strong_faith', 'martial_pressure', 'hunger', 'mandate', 'outside_debt', 'occupation', '(none)'];
  for (const pool of POOL_ORDER) {
    L.push(`### ${POOL_LABEL[pool]}`, '');
    for (const set of ['seat', 'both']) {
      const lp = R[pool][`${set}-LP`]; const pr = R[pool][`${set}:L1->LP`]; const dl = R[pool][`${set}:D->L1`];
      const kinds = [...new Set([...Object.keys(pr.enter), ...Object.keys(pr.leave)])].sort();
      L.push(`- **${set === 'seat' ? 'seat law, fortune off (under today\'s standing)' : 'seat + fortune'}**: circumstances held (places): ${CIRC.map((c) => `${c} ${lp.circumstances[c] || 0}`).join(' · ')}.`,
        `  L1 → LP: ${pr.topKindsMoved} of ${pr.paired} places change the kinds in their top three; ${kinds.length ? kinds.map((k) => `${k} +${pr.enter[k] || 0}/−${pr.leave[k] || 0}`).join(' · ') : 'no kind enters or leaves'}; field or risk moved in ${pr.fieldOrRiskMoved}; calm places that turn contested ${pr.calmContestedOn.length}, that stop ${pr.calmContestedOff.length}.`,
        `  (D → L1, for the record: field or risk moved in ${dl.fieldOrRiskMoved} of ${dl.paired}; top-three kinds moved in ${dl.topKindsMoved}: ${Object.keys({ ...dl.enter, ...dl.leave }).sort().map((k) => `${k} +${dl.enter[k] || 0}/−${dl.leave[k] || 0}`).join(' · ') || 'none'}; calm turning contested ${dl.calmContestedOn.length}, stopping ${dl.calmContestedOff.length}.)`);
    }
    L.push('');
  }
  L.push('## Errors', '', `**${totalErrors} errors in ${totalPlaces} births** (thrown at birth or in a reader), all arms, all pools (the calibration's and the sanities' births beside them).`);
  for (const pool of POOL_ORDER) for (const a of ARMS) for (const e of R[pool][a.id].errors) L.push(`- ${pool} ${a.id} ${e.seed}: ${e.error}`);
  for (const id of ['arm0-cal', 'both-D-cal', 'sfoff-cal', 'sfoff']) for (const r of rowsOf(id).filter((x) => x.error)) L.push(`- ${r.pool} ${id} ${r.seed}: ${r.error}`);
  L.push('', '## Receipts', '', ...checks.map((c) => `- ${c}`));
  for (const [k, p] of Object.entries(plants).sort()) L.push(`- plant ${k}: ${p.dial}${p.factors ? `; factors ${JSON.stringify(p.factors)}, productCeiling ${p.productCeiling} (read from the module's PROPOSED comments; the register note agrees: ${p.registerNoteAgrees})` : ''}`);
  L.push('- Laws forced AFTER `birthConfig` (`{ ...birthConfig(config), ...force }`), the contest read on the place as born; the plants live only in scratch copies, removed at the end.', '');

  const json = { meta: { script: 'docs/chair/2026-11-20/content/seat/u4/measure-lit.sh', seatSha, fortuneSha, calSeatSha, calFortuneSha, writtenAt, totalPlaces, totalErrors, standing: "fortune-off arms are under today's standing" },
    calibration, sanity, cause, arms: ARMS, plants, checks, pools: R };
  writeFileSync(join(outDir, 'measure-lit.json'), `${JSON.stringify(json, null, 1)}\n`);
  writeFileSync(join(outDir, 'measure-lit.md'), `${L.join('\n')}\n`);
  console.log(`measure-lit: calibration ${calibration.pass ? 'PASS' : 'FAIL'}; ${totalPlaces} births, ${totalErrors} errors; wrote measure-lit.{md,json}`);
}

if (mode === 'resolve') resolveMerge(rest[0]);
else if (mode === 'plant') plant(rest[0], rest[1]);
else if (mode === 'birth') await birth(...rest);
else if (mode === 'report') report(rest[0], rest[1], rest[2], rest[3], rest[4], rest[5], rest.includes('--calibration'));
else fail(`unknown mode ${mode}`);
