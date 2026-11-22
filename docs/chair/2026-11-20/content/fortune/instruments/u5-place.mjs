// FORTUNE U5a instrument: THE PROTOTYPE'S LATE STEP AT THE RULED PLACE (the chair's census ruling (1), 2026-11-20
// 16:45 UTC: "its own pipeline step after `assembleSettlement` and before `resolveCrisisCast`"), measured against the
// prototype's own place (the end of birth, just before `onComplete`) on THE SAME TIP. It writes nothing in the
// checkout it copies. The tip already holds the fortune law (U1 to U3) and U5s's safety term, both under the law, so
// the copy carries NO rule patch (`tree.mjs proto` is the base no more): only the merits, gated on the law exactly as
// the build will be (`isSizeRelativeFortune(settlement.config)`), so a law-1 birth runs the step and moves nothing.
// The merits are `u5-rule.mjs`'s PART 2 verbatim (its knobs: U5_POINTS, U5_WINDOW, U5_MERITS, U5_GATE), stored with
// the prototype's `merits` and `reasons` keys so `u5-report.mjs` reads them (the build stores neither).
//
//   node u5-place.mjs tree  <checkout> <out-dir> <late|end>        a copy with the step at the ruled place, or at the end
//   node u5-place.mjs stale <tree> <out.json> [perSize] [prefix] [dialsJson]
//        law-2 births (the fixture arm of COMMON.md); for every town the step moved, each census word-writer's stored
//        output against the same writer at the STORED band (W1 the seat-criminal direction, W2 every standing
//        sentence, W3 the legitimacy tension twins, W4 the crisis stakes, W5 the law band), and the moves by band
//   node u5-place.mjs fs5   <checkout> <tree> <out.json> [perSize] [prefix]
//        FS5 and the step's confinement: law-1 births (no marker) of the copy against the checkout, byte for byte;
//        and law-2 births the step did NOT move, byte for byte
//
//   node u5-place.mjs compare <ruled.jsonl> <late.jsonl> <end.jsonl>
//        the two places town by town (`u5-measure.mjs` lines, the same seeds): score, band, capture rung, merits
//
// The tables (FS4, the contest, the capture rung) are `u5-measure.mjs` (with U5_LAW=2 for the law-2 arms) and
// `u5-report.mjs tables`, run by `u5-place-run.sh`.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const POINTS = Number(process.env.U5_POINTS ?? 10);
const WINDOW = Number(process.env.U5_WINDOW ?? 40);
const MERITS = (process.env.U5_MERITS ?? 'principled,weathered').split(',').filter(Boolean);
const GATE = Number(process.env.U5_GATE ?? 45);
// the chair's rulings of 19:33 and 19:38 UTC: a merit reads only what every shared read serves. U5_RUNG=off drops the
// capture-rung clause of the condition; U5_SEAT=off drops the tension-names-the-seat clause (it reads which power
// governs). With U5_MERITS=weathered the principled merit (a merit of probity, barred) is gone too.
const RUNG = (process.env.U5_RUNG ?? 'on') !== 'off';
const SEAT = (process.env.U5_SEAT ?? 'on') !== 'off';
const RULER_TROUBLE = ['succession_crisis', 'corruption_scandal', 'tyranny', 'popular_uprising', 'legitimacy_crisis', 'leadership_vacuum'];
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

// the prototype's PART 2 (u5-rule.mjs `meritStep`), gated on the law, recording the pre-merit object for `stale`
const RULE_MODULE = `// U5a instrument (u5-place.mjs): the prototype's merits, gated on the fortune law. NOT the build.
import { legitimacyBandFor as __u5Band } from './factionDynamics.js';
import { DEALING_TRAIT_FAMILY as __U5_FAMILY } from '../data/npcData.js';
import { isSizeRelativeFortune } from '../domain/fortune/fortuneLaw.js';
export function __u5Merits(settlement) {
  if (!settlement || !isSizeRelativeFortune(settlement.config)) return;
  const ps = settlement?.powerStructure; const pl = ps?.publicLegitimacy;
  if (!pl || typeof pl !== 'object' || typeof pl.score !== 'number') return;
  const seat = ps.governingName;
  const h = settlement.history || {}; const tensions = Array.isArray(h.currentTensions) ? h.currentTensions : [];
  const trouble = tensions.some((t) => ${JSON.stringify(RULER_TROUBLE)}.includes(t?.type)${SEAT ? ' || (t?.factions || []).includes(seat)' : ''})${RUNG ? " || ['corrupted', 'capture'].includes(ps.criminalCaptureState)" : ''};
  if (trouble || pl.score < ${GATE}) return;
  const ruler = (settlement.npcs || []).find((n) => (n?.memberships || []).some((m) => m?.power === seat && m?.rank === 1));
  const fam = (w) => (w ? __U5_FAMILY[w] ?? null : null);
  const vice = ['price', 'slippery', 'hard'].includes(fam(ruler?.personality?.flaw));
  const names = [];
  if (${JSON.stringify(MERITS)}.includes('principled') && ruler && fam(ruler.personality?.dominant) === 'straight' && !vice) names.push('principled');
  if (${JSON.stringify(MERITS)}.includes('weathered')) {
    const notes = Array.isArray(h.legacyAnnotations) ? h.legacyAnnotations : [];
    const w = (h.historicalEvents || []).find((e) => e?.severity === 'catastrophic' && (e.yearsAgo ?? Infinity) <= ${WINDOW}
      && !tensions.some((t) => t?.type === e.templateType)
      && !notes.some((n) => n?.eventName === e.name && /never been put right/.test(String(n?.annotation ?? ''))));
    if (w) names.push('weathered');
  }
  if (!names.length) return;
  let score = Math.max(0, Math.min(100, pl.score + ${POINTS} * names.length));
  const reasons = names.length + Object.values(pl.breakdown || {}).filter((v) => typeof v === 'number' && v > 0).length;
  if (score >= 75 && reasons < 2) score = Math.max(pl.score, 74);
  const band = __u5Band(score);
  ps.publicLegitimacy = {
    score, label: band.label, color: band.color, bg: band.bg,
    breakdown: { ...pl.breakdown, merits: score - pl.score },
    govMultiplier: band.govMultiplier, crimMultiplier: band.crimMultiplier,
    isEndorsed: band.isEndorsed, isApproved: band.isApproved, isTolerated: band.isTolerated, isContested: band.isContested,
    isLegitimacyCrisis: band.isLegitimacyCrisis, governanceFractured: band.governanceFractured,
    merits: names, reasons,
  };
  (globalThis.__u5Moved ||= new WeakMap()).set(settlement, { pre: pl, names });
}
`;

// the ruled place: its own step, registered as resolveCrisisCast is, imported just before it in steps/index.js
const STEP_MODULE = `// U5a instrument (u5-place.mjs): the late step at the ruled place. NOT the build.
import { registerStep } from '../pipeline.js';
import { __u5Merits } from '../u5PlaceRule.js';
registerStep('u5PlaceMerits', {
  deps: ['assembleSettlement'],
  reads: ['settlement'],
  provides: [],
  mutates: ['settlement'],
  phase: 'assembly',
}, (ctx) => { __u5Merits(ctx.settlement); });
`;

const PATCHES = {
  late: [
    { file: 'src/generators/steps/index.js', find: "import './resolveCrisisCast.js';\n", replace: "import './u5PlaceMerits.js'; // U5a instrument: the ruled place\nimport './resolveCrisisCast.js';\n" },
  ],
  end: [
    { file: 'src/generators/generateSettlementPipeline.js', find: "import { runPipeline } from './pipeline.js';\n", replace: "import { runPipeline } from './pipeline.js';\nimport { __u5Merits } from './u5PlaceRule.js'; // U5a instrument: the prototype's place\n" },
    { file: 'src/generators/generateSettlementPipeline.js', find: "  if (typeof options.onComplete === 'function') {\n", replace: "  __u5Merits(finalCtx.settlement); // U5a instrument: the prototype's place\n  if (typeof options.onComplete === 'function') {\n" },
  ],
};

function tree(line, outArg, place) {
  if (!PATCHES[place]) throw new Error('usage: node u5-place.mjs tree <checkout> <out> <late|end>');
  const out = resolve(outArg);
  if (existsSync(out)) rmSync(out, { recursive: true, force: true });
  execFileSync('mkdir', ['-p', out]);
  for (const d of ['src', 'package.json', 'schema', 'vendor']) if (existsSync(join(line, d))) execFileSync('cp', ['-r', join(line, d), out]);
  symlinkSync(resolve(line, 'node_modules'), join(out, 'node_modules'));
  writeFileSync(join(out, 'src/generators/u5PlaceRule.js'), RULE_MODULE);
  if (place === 'late') writeFileSync(join(out, 'src/generators/steps/u5PlaceMerits.js'), STEP_MODULE);
  for (const p of PATCHES[place]) {
    const f = join(out, p.file);
    const src = readFileSync(f, 'utf8');
    const n = src.split(p.find).length - 1;
    if (n !== 1) throw new Error(`patch ${p.file}: ${n} matches`);
    writeFileSync(f, src.replace(p.find, () => p.replace));
  }
  console.log(`u5-place tree ${out} (${place}; U5_POINTS=${POINTS} U5_WINDOW=${WINDOW} U5_MERITS=${MERITS.join(',')} U5_GATE=${GATE} U5_RUNG=${RUNG ? 'on' : 'off'} U5_SEAT=${SEAT ? 'on' : 'off'})`);
}

async function engine(L) {
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { getStepOrder } = await import(`${L}/src/generators/pipeline.js`);
  await loadGenerationLawPayloads();
  const birth = (size, seed, law, extra = {}) => {
    const base = birthConfig({ ...DEFAULT_CONFIG, settType: size, ...extra });
    return generateSettlementPipeline(law ? { ...base, _fortuneLawVersion: law } : base, null, { seed, customContent: {} });
  };
  return { birth, getStepOrder };
}

async function stale(treeArg, outArg, n = 100, prefix = 'hxd', dials = '') {
  const L = resolve(treeArg);
  const extra = dials ? JSON.parse(dials) : {};
  const { birth, getStepOrder } = await engine(L);
  const { annotateFactionStanding } = await import(`${L}/src/generators/power/factionStanding.js`);
  const { standingRosterOf, standingForceOf } = await import(`${L}/src/generators/power/rosterText.js`);
  const { govCriminalRelation } = await import(`${L}/src/generators/factionDynamics.js`);
  const { deriveCrisisCast } = await import(`${L}/src/domain/crisis/crisisCast.js`);
  const { STRESS_SEVERITY_WEIGHT } = await import(`${L}/src/generators/stressGenerator.js`);
  const { lawBandOf } = await import(`${L}/src/domain/facts/lawBand.js`);
  const { legitimacyHeldTensions } = await import(`${L}/src/data/historyData.js`);
  const standings = (factions, force, pl) => { const seats = standingRosterOf(factions).map((f) => ({ ...f, desc: '' })); annotateFactionStanding(seats, force, { publicLegitimacy: pl }); return new Map(seats.map((f) => [f.faction, f.desc])); };
  const entriesOf = (s) => (Array.isArray(s) ? s.filter((e) => e && typeof e === 'object') : s && typeof s === 'object' ? [s] : []);
  const ranked = (st) => entriesOf(st).map((e, at) => ({ e, at })).sort((a, b) => (STRESS_SEVERITY_WEIGHT[String(b.e.type)] || 0) - (STRESS_SEVERITY_WEIGHT[String(a.e.type)] || 0) || a.at - b.at).map(({ e }) => e);
  // the stakes a cast derives at a given legitimacy, by crisis (the cast's own stakes only: the minting callback is off)
  const stakesAt = (s, pl) => { const rec = { ...s, powerStructure: { ...s.powerStructure, publicLegitimacy: pl } }; const casts = deriveCrisisCast(rec, ranked(s.stress), String(s._seed), {}); return JSON.stringify([...casts].map(([k, v]) => [k, (v.stakes || []).map((x) => [x.factionId, x.stake, x.reason])])); };
  const storedStakes = (s) => JSON.stringify(ranked(s.stress).filter((e) => e.cast).map((e) => [String(e.type), (e.cast.stakes || []).map((x) => [x.factionId, x.stake, x.reason])]));
  const c = { tree: L, order: getStepOrder().slice(-3), prefix, births: 0, moved: 0, moves: {}, W1: 0, W2: 0, W3: 0, W4towns: 0, W4: 0, W5: 0, W4control: { towns: 0, differ: 0 }, examples: [] };
  for (const size of SIZES) for (let i = 0; i < n; i++) {
    const seed = `${prefix}-${size}-${i}`;
    const s = birth(size, seed, 2, extra);
    c.births++;
    const m = globalThis.__u5Moved?.get(s);
    // the W4 comparison's control: on a stressed town the step did NOT move, the stored stakes equal the cast re-derived
    // at its own band (proves the comparison reads the stored cast faithfully, minted stand-ins included)
    if (!m && entriesOf(s.stress).length) { c.W4control.towns++; if (storedStakes(s) !== stakesAt(s, s.powerStructure.publicLegitimacy)) c.W4control.differ++; }
    if (!m) continue;
    const ps = s.powerStructure; const now = ps.publicLegitimacy;
    if (m.pre.score === now.score) continue;
    c.moved++; const k = `${m.pre.label} -> ${now.label}`; c.moves[k] = (c.moves[k] || 0) + 1;
    // W1: the seat-criminal row's stored direction against the same writer at the stored band
    const byName = (nm) => ps.factions.find((f) => f.faction === nm);
    let w1 = false;
    for (const r of ps.factionRelationships || []) {
      if (r?.captureState === undefined || !Array.isArray(r.pair)) continue;
      const [g, cr] = r.pair.map(byName); if (!g || !cr || !g.isGoverning) continue;
      if (govCriminalRelation(g, cr, r.captureState, now).direction !== r.direction) { w1 = true; if (c.examples.length < 8) c.examples.push(`W1 ${seed} ${r.captureState} ${m.pre.label}->${now.label}: stored ${r.direction}`); }
    }
    if (w1) c.W1++;
    // W2: every standing sentence at the pre band against the stored band
    const force = standingForceOf(s.institutions);
    const a = standings(ps.factions, force, m.pre), b = standings(ps.factions, force, now);
    if ([...a].some(([name, t]) => b.get(name) !== t)) { c.W2++; if (c.examples.length < 8) c.examples.push(`W2 ${seed} ${m.pre.label}->${now.label}`); }
    // W3: the legitimacy tension twins at both bands (identity on a moved town: a legitimacy_crisis tension is the ruler's trouble)
    const ts = s.history?.currentTensions || [];
    if (legitimacyHeldTensions(ts, { publicLegitimacy: m.pre }) !== legitimacyHeldTensions(ts, { publicLegitimacy: now })) c.W3++;
    // W4: the STORED stakes against the cast derived at the stored band (at the ruled place the cast is derived after the step)
    if (entriesOf(s.stress).length) { c.W4towns++; if (storedStakes(s) !== stakesAt(s, now)) { c.W4++; if (c.examples.length < 8) c.examples.push(`W4 ${seed} ${m.pre.label}->${now.label}`); } }
    // W5: the law band at the pre band against the stored band (monotone; "never contradicted", the chair's ruling (2))
    const l0 = lawBandOf({ ...s, powerStructure: { ...ps, publicLegitimacy: m.pre } }), l1 = lawBandOf(s);
    if (l0 !== l1) c.W5++;
  }
  writeFileSync(outArg, JSON.stringify(c, null, 1) + '\n');
  console.log(`stale ${prefix}: ${c.births} births, ${c.moved} moved -> ${outArg}`);
}

async function fs5(lineArg, treeArg, outArg, n = 100, prefix = 'hxd') {
  const A = await engine(resolve(lineArg)); const B = await engine(resolve(treeArg));
  const c = { checkout: resolve(lineArg), tree: resolve(treeArg), prefix, orderCheckout: A.getStepOrder().length, orderTree: B.getStepOrder().length, law1: { births: 0, differ: 0, seeds: [] }, law2: { births: 0, unmoved: 0, unmovedDiffer: 0, moved: 0, seeds: [] } };
  for (const size of SIZES) for (let i = 0; i < n; i++) {
    const seed = `${prefix}-${size}-${i}`;
    c.law1.births++;
    if (JSON.stringify(A.birth(size, seed, null)) !== JSON.stringify(B.birth(size, seed, null))) { c.law1.differ++; c.law1.seeds.push(seed); }
    c.law2.births++;
    const tb = B.birth(size, seed, 2);
    if (globalThis.__u5Moved?.get(tb)) { c.law2.moved++; continue; }
    c.law2.unmoved++;
    if (JSON.stringify(A.birth(size, seed, 2)) !== JSON.stringify(tb)) { c.law2.unmovedDiffer++; c.law2.seeds.push(seed); }
  }
  writeFileSync(outArg, JSON.stringify(c, null, 1) + '\n');
  console.log(`fs5 ${prefix}: law 1 ${c.law1.differ} of ${c.law1.births} differ; law 2 unmoved ${c.law2.unmovedDiffer} of ${c.law2.unmoved} differ -> ${outArg}`);
}

function compare(ruledArg, lateArg, endArg) {
  const load = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const [R, A, B] = [ruledArg, lateArg, endArg].map(load);
  if (![A, B].every((X) => X.length === R.length && X.every((r, i) => r.seed === R[i].seed))) throw new Error('the runs are not the same seeds');
  const differ = (f) => A.filter((r, i) => f(r) !== f(B[i])).map((r) => r.seed);
  const moved = (X) => X.filter((r, i) => r.legit.score !== R[i].legit.score).length;
  const lines = [`${lateArg.replace(/.*\//, '')} vs ${endArg.replace(/.*\//, '')} (ruled: ${ruledArg.replace(/.*\//, '')}), ${R.length} towns`];
  lines.push(`  towns the step moved (score differs from the ruled birth): late ${moved(A)}, end ${moved(B)}`);
  for (const [k, f] of [['score', (r) => r.legit.score], ['band', (r) => r.legit.label], ['merits', (r) => JSON.stringify(r.legit.merits)], ['capture rung', (r) => r.capture], ['incumbent protected', (r) => r.gated], ['crisis-born', (r) => r.calm], ['ruler', (r) => JSON.stringify(r.ruler)], ['history', (r) => JSON.stringify([r.events, r.tensions, r.notes])]]) {
    const d = differ(f);
    lines.push(`  ${k.padEnd(20)} differs late vs end in ${d.length} towns${d.length ? `: ${d.slice(0, 8).join(' ')}${d.length > 8 ? ' ...' : ''}` : ''}`);
  }
  console.log(lines.join('\n'));
}

const [, , mode, ...args] = process.argv;
if (mode === 'tree') tree(args[0], args[1], args[2]);
else if (mode === 'stale') await stale(args[0], args[1], +(args[2] ?? 100), args[3] ?? 'hxd', args[4] ?? '');
else if (mode === 'fs5') await fs5(args[0], args[1], args[2], +(args[3] ?? 100), args[4] ?? 'hxd');
else if (mode === 'compare') compare(args[0], args[1], args[2]);
else throw new Error('usage: node u5-place.mjs <tree|stale|fs5|compare> ...');
