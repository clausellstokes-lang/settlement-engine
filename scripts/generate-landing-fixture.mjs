/**
 * scripts/generate-landing-fixture.mjs — derive the landing page's FROZEN
 * fixture artifacts from the REAL engine (owner amendment W-L2/1: the Brief,
 * Voice, and why-trace artifacts are frozen real engine output, deliberately
 * incomplete — never hand-authored fiction).
 *
 * What it does (house pattern: scripts/audit/simulate-religion.mjs):
 *   1. Generates the fixture town with generateSettlementPipeline at an explicit
 *      seed + the store's DEFAULT_CONFIG (settType capped at village/town — the
 *      anon tier ceiling, owner adjustment: the artifact must be exactly what an
 *      anonymous visitor could forge, so the seed tag doubles as a promise).
 *   2. Generates neighbor settlements, wires a small regional graph, and
 *      advances K REAL one-week ticks through advanceCampaignWorld.
 *   3. Captures, all REAL:
 *      - the town's brief surface (name, population, resolved config, arrival
 *        prose, pressure sentence, conflict/NPC hooks + honest "+N more" count),
 *      - trace receipts from settlement.simulationTrace (the RAW voice card),
 *      - before→after causal band deltas via compareCausalState (the why-trace),
 *      - pulse headlines + wizard news (the chronicle, real generated names),
 *      - engine version markers (generatorVersion/simulationVersion).
 *   4. --emit writes the frozen module src/components/home/landingFixture.js
 *      (consumed ONLY by the lazy landing chunk).
 *
 * DETERMINISM / REGEN POLICY (owner addition W-L2/5): same seed + same config +
 * same engine = the same town — that is what makes the landing's "Forge this
 * exact town" button honest. The fixture must therefore be REGENERATED whenever
 * the engine's generation output changes (the goldens-regen policy is the
 * signal). The emitted module records the engine version markers; the landing
 * contract test asserts they exist so drift is at least visible.
 *
 * Usage (vite-node resolves the src/ imports exactly like the app build):
 *   npx vite-node scripts/generate-landing-fixture.mjs -- --survey 24            # score candidate seeds
 *   npx vite-node scripts/generate-landing-fixture.mjs -- --seed lf-007 --detail # full dump of one candidate
 *   npx vite-node scripts/generate-landing-fixture.mjs -- --seed lf-007 --emit   # write the frozen module
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld } from '../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../src/domain/region/index.js';
import { deriveCausalState, compareCausalState } from '../src/domain/causalState.js';
import { chronicleTimeline } from '../src/domain/display/chronicleTimeline.js';
import { DEFAULT_CONFIG } from '../src/store/configSlice.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const has = (n) => process.argv.includes(`--${n}`);

const WEEKS = parseInt(arg('weeks', '12'), 10);
// Owner cap: the fixture town is HAMLET/VILLAGE/TOWN only (anon ceiling).
const SETT_TYPE = arg('type', 'village');
if (!['hamlet', 'village', 'town'].includes(SETT_TYPE)) {
  console.error(`[landing-fixture] --type ${SETT_TYPE} violates the anon-ceiling cap (hamlet|village|town).`);
  process.exit(1);
}

// The EXACT generation inputs the "Forge this exact town" button replays. The
// full DEFAULT_CONFIG is recorded (not just settType) so the button's
// updateConfig() overwrite can never disagree with what this script ran.
//
// `_randomizePriorities: true` mirrors the STORE's default forge path: the
// config slice ships randomSliderMode = true, and generateSettlement() injects
// this key whenever it is set — the priority rolls are seeded, so the run is
// still fully deterministic per seed. Generating WITHOUT it produced a
// different PRNG stream than the live button (verified: the same seed forged a
// different town in-app before this was matched). The emitted fixture records
// randomSliderMode (the store input); the underscore key stays script-side.
const STORE_CONFIG = Object.freeze({ ...DEFAULT_CONFIG, settType: SETT_TYPE });
const FORGE_CONFIG = Object.freeze({ ...STORE_CONFIG, _randomizePriorities: true });

// Rival warlike major deities stamped on two neighbors (simulate-religion's
// pattern) so the region has live faith + conflict pressure to move bands.
const DEITIES = [
  { _deityRef: 'custom:lf_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lf_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
];

function buildRegion(seed) {
  const town = generateSettlementPipeline(FORGE_CONFIG, null, { seed, customContent: {} });
  // Neighbors may exceed the cap (the cap binds the FIXTURE town only).
  const nTiers = ['town', 'city', 'town', 'village'];
  const neighbors = nTiers.map((tier, i) => {
    const s = generateSettlementPipeline({ ...DEFAULT_CONFIG, settType: tier }, null, { seed: `${seed}-n${i}`, customContent: {} });
    if (i < 2) {
      s.config = { ...s.config, primaryDeityRef: DEITIES[i]._deityRef, primaryDeitySnapshot: DEITIES[i] };
      s.powerStructure = { ...s.powerStructure, publicLegitimacy: { score: 28, label: 'Contested' } };
    }
    return s;
  });
  const ids = ['t', 'n0', 'n1', 'n2', 'n3'];
  const all = [town, ...neighbors];
  const saves = all.map((s, i) => ({
    id: ids[i], name: s.name, phase: 'canon', settlement: s,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const edges = [
    { id: 'edge.t.n0', from: 't', to: 'n0', relationshipType: 'trade_partner' },
    { id: 'edge.t.n2', from: 't', to: 'n2', relationshipType: 'trade_partner' },
    { id: 'edge.t.n3', from: 't', to: 'n3', relationshipType: 'allied' },
    { id: 'edge.n0.n1', from: 'n0', to: 'n1', relationshipType: 'trade_partner' },
    { id: 'edge.n1.n2', from: 'n1', to: 'n2', relationshipType: 'trade_partner' },
  ];
  return { town, saves, edges, ids };
}

function advanceRegion(seed, saves, edges) {
  let campaign = {
    id: `landing-${seed}`, name: 'landing-fixture', settlementIds: saves.map(s => s.id),
    worldState: { rngSeed: `landing-${seed}`, tick: 0, simulationRules: { religionDynamicsEnabled: true } },
    regionalGraph: ensureRegionalGraph({ edges }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  let cur = saves;
  for (let t = 0; t < WEEKS; t++) {
    const result = advanceCampaignWorld({ campaign, saves: cur, interval: 'one_week', now: '2026-01-01T00:00:00.000Z' });
    if (!result) break;
    campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
    cur = cur.map(s => { const u = result.settlementUpdates?.find(x => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
  }
  return { campaign, saves: cur };
}

// Band → landing chip tone. Polarity-aware via the ENGINE's own judgment: the
// explanation string carries "Pressure increased" exactly when the shift is a
// worsening under that variable's polarity (explainCausalDelta), so we reuse it
// rather than re-deriving polarity here.
function toneFor(delta) {
  const worse = /Pressure increased/.test(delta.explanation || '');
  const severe = delta.bandAfter === 'critical' || delta.bandAfter === 'collapsed';
  if (!worse) return 'success';
  return severe ? 'danger' : 'warning';
}

function analyze(seed) {
  const { town, saves, edges } = buildRegion(seed);
  const before = deriveCausalState(town);
  const { campaign, saves: after } = advanceRegion(seed, saves, edges);
  const townAfter = after.find(s => s.id === 't').settlement;
  const afterState = deriveCausalState(townAfter);
  const deltas = compareCausalState(before, afterState) || [];
  const crossings = deltas.filter(d => d.bandBefore !== d.bandAfter);

  const hooks = (town.conflicts || []).flatMap(c => c.plotHooks || []);
  const npcWithGoal = (town.npcs || []).find(n => n?.goal?.short);
  const timeline = chronicleTimeline({ pulseHistory: campaign.worldState?.pulseHistory });
  const headlines = timeline.flatMap(tk => (tk.headlines || []).map(h => ({ tick: tk.tick, ...h })));
  const news = (campaign.wizardNews?.entries || []);

  return { town, townAfter, saves: after, campaign, deltas, crossings, hooks, npcWithGoal, headlines, news, edges };
}

// ── survey mode ──────────────────────────────────────────────────────────────
if (has('survey')) {
  const n = parseInt(arg('survey', '24'), 10);
  console.log(`seed        name                pop   route        conflicts hooks crossings headlines news pressure`);
  for (let i = 0; i < n; i++) {
    const seed = `lf-${String(i).padStart(3, '0')}`;
    try {
      const a = analyze(seed);
      const c = a.town.config || {};
      console.log([
        seed.padEnd(11),
        String(a.town.name || '').padEnd(19).slice(0, 19),
        String(a.town.population).padStart(5),
        String(c.tradeRouteAccess || '').padEnd(12),
        String((a.town.conflicts || []).length).padStart(9),
        String(a.hooks.length).padStart(5),
        String(a.crossings.length).padStart(9),
        String(a.headlines.length).padStart(9),
        String(a.news.length).padStart(4),
        a.town.pressureSentence ? 'y' : '-',
      ].join(' '));
    } catch (e) {
      console.log(`${seed.padEnd(11)} THREW: ${String(e).slice(0, 90)}`);
    }
  }
  process.exit(0);
}

// ── detail / emit modes ──────────────────────────────────────────────────────
const seed = arg('seed', null);
if (!seed) { console.error('need --seed (or --survey N)'); process.exit(1); }
const a = analyze(seed);

if (has('detail')) {
  const out = {
    seed, weeks: WEEKS,
    name: a.town.name, population: a.town.population,
    config: a.town.config,
    arrivalScene: a.town.arrivalScene,
    pressureSentence: a.town.pressureSentence,
    conflicts: a.town.conflicts,
    npcGoal: a.npcWithGoal && { name: a.npcWithGoal.name, role: a.npcWithGoal.role, goal: a.npcWithGoal.goal },
    hooksAll: a.hooks,
    crossings: a.crossings,
    deltasAll: a.deltas.filter(d => Math.abs(d.change) >= 2),
    headlines: a.headlines,
    news: a.news.slice(0, 20),
    neighborNames: a.saves.map(s => ({ id: s.id, name: s.name, tier: s.settlement.tier })),
    traceSample: (a.town.simulationTrace || []).slice(0, 40),
    versions: { generatorVersion: a.town.generatorVersion, simulationVersion: a.town.simulationVersion },
  };
  const p = arg('out', join(__dirname, '..', '..', 'landing-fixture-detail.json'));
  writeFileSync(p, JSON.stringify(out, null, 1));
  console.log(`[landing-fixture] detail → ${p}`);
  console.log(`name=${a.town.name} pop=${a.town.population} crossings=${a.crossings.length} hooks=${a.hooks.length} headlines=${a.headlines.length}`);
  process.exit(0);
}

if (!has('emit')) { console.error('pass --detail or --emit'); process.exit(1); }

// ── emit: compute the frozen fixture module from the run ─────────────────────
// Every selection below is COMPUTED from engine output (verbatim strings where
// possible); nothing narrative is invented here except the labels that name
// each receipt line. The NARRATED voice card is intentionally NOT emitted by
// this script — it is owner-sanctioned stock prose, written by hand in the
// fixture module and grounded ONLY in the receipts emitted here.

const town = a.town;
const cfg = town.config || {};

// Brief artifact — the town as forged (week 0).
const npc = a.npcWithGoal;
const conflict = (town.conflicts || [])[0];
const hooksTotal = a.hooks.length;
const npcGoals = (town.npcs || []).filter(n => n?.goal?.short).length;
const arrival = String(town.arrivalScene || '').split(/(?<=\.)\s+/).slice(0, 2).join(' ');

// Voice RAW receipts — real trace entries telling the tension line's story.
// Selection is generic across seeds: the conflict line, the trade-route roll,
// the most story-bearing resource receipt (a depleted one wins — scarcity is
// tension), and a trade-adjacent selected institution.
const trace = town.simulationTrace || [];
const route = trace.find(e => e.targetId === `tradeRoute.${cfg.tradeRouteAccess}`);
const resourceReceipt =
  trace.find(e => /^resource\./.test(e.targetId || '') && /depleted/.test(e.result || '')) ||
  trace.find(e => /^resource\./.test(e.targetId || ''));
const instReceipt =
  trace.find(e => /^institution\.(toll_bridge|weekly_market|travelers_inn|caravanserai|trading_post)/.test(e.targetId || '') && e.result === 'selected') ||
  trace.find(e => /^institution\./.test(e.targetId || '') && e.result === 'selected');
const lastCause = (e) => e.causes?.[e.causes.length - 1]?.reason || e.causes?.[0]?.reason || '';
const receipts = [
  conflict && { label: 'conflict', text: `${conflict.parties.join(' × ')} · ${conflict.issue.toLowerCase()} · stakes: ${conflict.stakes.toLowerCase()}` },
  route && { label: 'route', text: `${cfg.tradeRouteAccess} — ${route.causes?.[0]?.reason || route.result}` },
  resourceReceipt && { label: 'resource', text: `${String(resourceReceipt.targetId).replace('resource.', '')} — ${String(resourceReceipt.result).replace(/_/g, ' ')} (${lastCause(resourceReceipt)})` },
  instReceipt && { label: 'institution', text: `${String(instReceipt.targetId).replace('institution.', '')} — ${instReceipt.result} (${instReceipt.causes?.[0]?.reason || ''})` },
].filter(Boolean).slice(0, 4);

// Why-trace — three real band crossings. Preference order keeps the landing's
// storyline (trade / faith / crime first), then falls back to whatever else
// actually crossed so the card always carries three rows; picks aim for tone
// diversity (not three identical reds) where the run allows it.
const PREFERRED_VARS = [
  'trade_connectivity', 'religious_authority', 'criminal_opportunity',
  'faction_power', 'social_trust', 'food_security', 'public_legitimacy',
  'law_order', 'defense_readiness', 'labor_capacity', 'ruling_authority',
];
const afterState = deriveCausalState(a.townAfter);
// Prefer crossings whose after-state contributors carry a real cause line —
// "Wartime pressure disrupts trade flows" over the generic fell/rose sentence.
const hasCauseLine = (v) => (afterState.variables[v]?.contributors || [])
  .some(c => c.reason && Math.abs(c.delta || 0) >= 2);
const crossed = PREFERRED_VARS
  .map(v => a.deltas.find(x => x.variable === v && x.bandBefore !== x.bandAfter))
  .filter(Boolean)
  .sort((x, y) => Number(hasCauseLine(y.variable)) - Number(hasCauseLine(x.variable)));
const picked = [];
for (const d of crossed) {
  if (picked.length >= 3) break;
  const tone = toneFor(d);
  // Tone diversity: don't take a third row that repeats an already-doubled tone
  // while different-toned crossings remain available.
  const toneCount = picked.filter(p => p._tone === tone).length;
  const remainDiverse = crossed.some(x => !picked.includes(x) && x !== d && toneFor(x) !== tone);
  if (toneCount >= 2 && remainDiverse) continue;
  picked.push(Object.assign(d, { _tone: tone }));
}
const whyTrace = picked.slice(0, 3).map((d) => {
  const v = d.variable;
  const contributors = afterState.variables[v]?.contributors || [];
  const reasons = contributors
    .filter(c => c.reason && Math.abs(c.delta || 0) >= 2)
    .sort((x, y) => Math.abs(y.delta || 0) - Math.abs(x.delta || 0))
    .slice(0, 2)
    .map(c => c.reason);
  return {
    axis: v.replace(/_/g, ' ').replace(/^./, ch => ch.toUpperCase()),
    from: d.bandBefore, to: d.bandAfter, tone: toneFor(d),
    reason: (reasons.length ? reasons : [d.explanation]).slice(0, 2).join(' '),
  };
});

// Chronicle — real APPLIED pulse entries, diverse kinds, town-first. Where an
// id pattern matches multiple ticks (a stressor's emergence and later memory
// entries share the target), take the EARLIEST — the event itself, not its
// echo. Selection is generic across seeds: one faith beat, one conflict-shaped
// beat, one trade/economy beat — each preferring entries that target the
// fixture town before falling back to any settlement in the region.
const news = a.news.filter(e => e?.kind === 'applied');
const findNews = (re) => news.filter(e => re.test(e.id || '')).sort((x, y) => (x.tick || 0) - (y.tick || 0))[0];
const townFirst = (base) => findNews(new RegExp(`${base}[^]*\\.t\\b`)) || findNews(new RegExp(base));
const chronPicks = [
  { entry: townFirst('religious_conversion_fracture|conversion|deity|faith'), kind: 'faith', tone: 'faith' },
  { entry: townFirst('stressor\\.(monster_raider_pressure|betrayal|wartime|siege)|condition\\.conflict'), kind: 'stressor', tone: 'war' },
  { entry: townFirst('condition\\.trade|trade_route|blockade|condition\\.crime'), kind: 'trade', tone: 'economic' },
].filter(p => p.entry).map(p => ({
  kind: p.kind, tone: p.tone, week: `Week ${p.entry.tick}`, text: p.entry.summary || p.entry.headline,
}));

// Relationships — the region's REAL base edges touching the town (the minted
// religious_authority channels are a different artifact), plus the pulse's own
// border incident if one applied (a real "grudge" chip, red-tinted).
const nameOf = Object.fromEntries(a.saves.map(s => [s.id, s.name]));
const baseEdges = (a.campaign.regionalGraph?.edges || [])
  .filter(e => [e.from, e.to].includes('t') && ['trade_partner', 'allied'].includes(e.relationshipType));
const relChips = baseEdges.slice(0, 2).map(e => ({
  from: nameOf[e.from], to: nameOf[e.to],
  type: String(e.relationshipType).replace(/_/g, ' '), tone: 'neutral',
}));
const incident = findNews(/relationship\.neutral_border_incident\.edge\.(\w+)\.(\w+)\./);
const incidentPair = incident ? incident.id.match(/edge\.(\w+)\.(\w+)\./) : null;
if (incidentPair) {
  relChips.splice(1, relChips.length, {
    from: nameOf[incidentPair[1]] || incidentPair[1], to: nameOf[incidentPair[2]] || incidentPair[2],
    type: 'border incident', tone: 'danger', week: `Week ${incident.tick}`,
  });
}

// Map pins — the fixture town (gold, the subject) + two neighbors whose tags
// are REAL applied pulse states (the border-incident counterparty; a neighbor
// with an applied criminal-pressure condition). Derived, never authored.
const pins = [{ name: town.name, dotTone: 'gold' }];
if (incidentPair) {
  const other = incidentPair[1] === 't' ? incidentPair[2] : incidentPair[1];
  pins.push({ name: nameOf[other] || other, dotTone: 'danger', tag: 'Border incident', tagTone: 'danger' });
}
const crime = findNews(/condition\.crime\.(n\d)\./);
if (crime) {
  const who = crime.id.match(/condition\.crime\.(n\d)\./)[1];
  if (!pins.some(p => p.name === nameOf[who])) {
    pins.push({ name: nameOf[who] || who, dotTone: 'warning', tag: 'Criminal pressure', tagTone: 'warning' });
  }
}

// ── The NARRATED card's stock prose (owner-sanctioned authored content) ─────
// The owner declined to spend AI credits narrating a fixture, so this is
// hand-written STOCK prose in the narrative layer's register — grounded
// EXCLUSIVELY in the derived facts the receipts above carry for seed lf-033
// (the council-seat conflict, the road rolled 3-of-5 against isolation, the
// depleted mountain timber, the travelers' inn, the pressured neutral, the
// pressure sentence, the mayor's goal). It must be revisited whenever the
// fixture is regenerated: if the receipts change, this prose is stale until
// re-grounded.
const STOCK_NARRATION = 'The road made Cnocby by a coin’s width — three chances of it against two of nothing — and the mountain timber that raised the travelers’ inn is mostly cut out. What remains worth holding is the seat: the Free Alliance and the Establishment both want the council chair, and both are leaning on the same neutral name to declare before the session. Rónnat Sullivan is about to call something in, and half the inn seems to know what. The mayor wants the cracks mended while the weather holds; no one asks which cracks he means.';

const fixture = {
  seed, weeks: WEEKS,
  engine: { generatorVersion: town.generatorVersion || null, simulationVersion: town.simulationVersion || null },
  // The store inputs the button replays: wizard mode, the slider mode (the
  // store derives _randomizePriorities from it), a cleared neighbour import,
  // and the full config. Residual caveat: a heavily customized account
  // (persisted institution/goods toggles, eligible homebrew with
  // useCustomContent on) can still shift the stream — the landing's audience
  // is logged-out visitors, whose defaults these are.
  forge: { mode: 'basic', randomSliderMode: true, importedNeighbour: null, config: STORE_CONFIG },
  town: {
    name: town.name, population: town.population, tier: town.tier,
    eyebrow: `${cfg.tradeRouteAccess} ${town.tier} · ${cfg.terrainType}`,
    prose: arrival,
    pressure: town.pressureSentence || '',
    hooks: [
      npc && { kind: 'NPC', tone: 'success', tag: 'derived · npcs', lead: `${npc.name}, ${String(npc.role || '').toLowerCase()}`, rest: ` — goal: ${npc.goal.short.replace(/\.$/, '').toLowerCase()}.` },
      conflict?.plotHooks?.[0] && { kind: 'Hook', tone: 'warning', tag: 'derived · factions', text: conflict.plotHooks[0] },
    ].filter(Boolean),
    hooksMore: Math.max(0, hooksTotal - 1) + Math.max(0, npcGoals - 1),
  },
  voice: { receipts, narrated: STOCK_NARRATION },
  realm: { whyTrace, chronicle: chronPicks, relationships: relChips, pins,
    neighbors: a.saves.filter(s => s.id !== 't').map(s => ({ name: s.name, tier: s.settlement.tier })) },
};

const MODULE_PATH = join(__dirname, '..', 'src', 'components', 'home', 'landingFixture.js');
const banner = `/**
 * home/landingFixture.js — FROZEN real engine output for the landing artifacts.
 *
 * GENERATED by scripts/generate-landing-fixture.mjs — do not hand-edit. The
 * one authored field is voice.narrated: owner-sanctioned STOCK prose (no AI
 * credits spent on a fixture), written in the narrative layer's register and
 * grounded EXCLUSIVELY in the derived receipts in voice.receipts. It lives in
 * the generator script (STOCK_NARRATION) and must be re-grounded whenever the
 * fixture is regenerated. Regenerate with:
 *   npx vite-node scripts/generate-landing-fixture.mjs -- --seed ${seed} --emit
 *
 * Provenance: seed \`${seed}\`, ${WEEKS} one-week ticks of advanceCampaignWorld
 * over a 5-settlement region (fixture town + 4 neighbors), engine
 * generatorVersion ${fixture.engine.generatorVersion} / simulationVersion ${fixture.engine.simulationVersion}.
 * The town is a ${SETT_TYPE} — within the anon tier ceiling by design: the
 * "Forge this exact town" button replays { seed, config } through the SAME
 * store forge action as every other generation, so the artifact is a promise
 * an anonymous visitor can verify in one click. REGEN POLICY: regenerate this
 * fixture whenever engine generation output changes (goldens regen = signal),
 * or the frozen artifact and the button's live output will drift apart.
 *
 * Consumed ONLY by the lazy landing chunk (LandingBelowFold) — never imported
 * eagerly (first-paint budget).
 */

export const fixture = `;

writeFileSync(MODULE_PATH, banner + JSON.stringify(fixture, null, 2) + ';\n');
console.log(`[landing-fixture] emitted → ${MODULE_PATH}`);
console.log(`  town=${fixture.town.name} pop=${fixture.town.population} receipts=${receipts.length} whyTrace=${whyTrace.length} chronicle=${chronPicks.length} rels=${relChips.length}`);
