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
 *      - the TOWN'S OWN applied pulse events across the run (the advance-time
 *        card — events, not deltas; owner order ODQ §934.30 item 4),
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
 * ⛔ AND "AT LEAST VISIBLE" WAS NOT ENOUGH (ODQ §934.30 car 1). Between the last
 * emit and 2026-09-19 the engine moved under this fixture in eight places at once
 * — a new arrival scene, a new pressure sentence, a renamed faction, a different
 * conflict, a re-worded route roll, a re-worded depletion cause, a different
 * institution multiplier, two new config keys — and the landing went on showing
 * the OLD town's facts with the shipped engine's name on them. Nothing reddened,
 * because nothing re-ran the derivation. `--check` is that instrument now, and
 * tests/build/landingFixtureFreshness.test.js runs it.
 *
 * Usage (plain node — the src import chain is node-ESM runnable as-is):
 *   node scripts/generate-landing-fixture.mjs --survey 24            # score candidate seeds
 *   node scripts/generate-landing-fixture.mjs --seed lf-007 --detail # full dump of one candidate
 *   node scripts/generate-landing-fixture.mjs --seed lf-007 --emit   # write the frozen module
 *   node scripts/generate-landing-fixture.mjs --check                # verify only (exit 1 if stale)
 *
 * The exported seams (buildRegion / advanceRegion / analyze / buildFixture /
 * renderFixtureModule) exist so that ONE derivation serves every consumer: the
 * emit path here, the freshness walker, and scripts/capture-landing-realm.mjs,
 * which boots the SAME region in the real app to photograph its realm map. A
 * second spelling of buildRegion anywhere would be a parallel emitter.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld } from '../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../src/domain/region/index.js';
import { deriveCausalState, compareCausalState } from '../src/domain/causalState.js';
import { chronicleTimeline } from '../src/domain/display/chronicleTimeline.js';
import { tickCalendarLabel } from '../src/domain/display/humanizeEngineTokens.js';
import { DEFAULT_CONFIG } from '../src/store/configSlice.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const MODULE_PATH = join(__dirname, '..', 'src', 'components', 'home', 'landingFixture.js');

/** The run's defaults. Owner cap: the fixture town is HAMLET/VILLAGE/TOWN only (anon ceiling). */
export const DEFAULT_WEEKS = 12;
export const DEFAULT_SETT_TYPE = 'village';
export const ANON_CEILING_TIERS = Object.freeze(['hamlet', 'village', 'town']);

/** How many of the town's own events the advance-time card carries (see advanceTimelineFor). */
const ADVANCE_ENTRIES = 6;

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const has = (n) => process.argv.includes(`--${n}`);

/**
 * The EXACT generation inputs the "Forge this exact town" button replays. The
 * full DEFAULT_CONFIG is recorded (not just settType) so the button's
 * updateConfig() overwrite can never disagree with what this script ran.
 * @param {string} settType
 */
export const storeConfigFor = (settType) => Object.freeze({ ...DEFAULT_CONFIG, settType });

/**
 * `_randomizePriorities: true` mirrors the STORE's default forge path: the
 * config slice ships randomSliderMode = true, and generateSettlement() injects
 * this key whenever it is set — the priority rolls are seeded, so the run is
 * still fully deterministic per seed. Generating WITHOUT it produced a
 * different PRNG stream than the live button (verified: the same seed forged a
 * different town in-app before this was matched). The emitted fixture records
 * randomSliderMode (the store input); the underscore key stays script-side.
 * @param {string} settType
 */
export const forgeConfigFor = (settType) => Object.freeze({ ...storeConfigFor(settType), _randomizePriorities: true });

// Rival warlike major deities stamped on two neighbors (simulate-religion's
// pattern) so the region has live faith + conflict pressure to move bands.
export const DEITIES = Object.freeze([
  { _deityRef: 'custom:lf_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lf_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
]);

/** The region's save ids. `t` is the fixture town; `n0..n3` its neighbours. */
export const REGION_IDS = Object.freeze(['t', 'n0', 'n1', 'n2', 'n3']);

/** The region's base relationship edges (the fixture town is `t`). */
export const REGION_EDGES = Object.freeze([
  { id: 'edge.t.n0', from: 't', to: 'n0', relationshipType: 'trade_partner' },
  { id: 'edge.t.n2', from: 't', to: 'n2', relationshipType: 'trade_partner' },
  { id: 'edge.t.n3', from: 't', to: 'n3', relationshipType: 'allied' },
  { id: 'edge.n0.n1', from: 'n0', to: 'n1', relationshipType: 'trade_partner' },
  { id: 'edge.n1.n2', from: 'n1', to: 'n2', relationshipType: 'trade_partner' },
]);

/**
 * The fixture town + its four neighbours, wired as canon saves. THE ONE
 * SPELLING — the emit path and the realm-capture script both call this, so the
 * photographed realm is the same five settlements the landing quotes.
 * @param {string} seed
 * @param {{ settType?: string }} [opts]
 */
export function buildRegion(seed, { settType = DEFAULT_SETT_TYPE } = {}) {
  const town = generateSettlementPipeline(forgeConfigFor(settType), null, { seed, customContent: {} });
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
  const ids = [...REGION_IDS];
  const all = [town, ...neighbors];
  const saves = all.map((s, i) => ({
    id: ids[i], name: s.name, phase: 'canon', settlement: s,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  const edges = REGION_EDGES.map(e => ({ ...e }));
  return { town, saves, edges, ids };
}

/**
 * K real one-week ticks of advanceCampaignWorld over the region.
 * @param {string} seed
 * @param {any[]} saves
 * @param {any[]} edges
 * @param {{ weeks?: number }} [opts]
 */
export function advanceRegion(seed, saves, edges, { weeks = DEFAULT_WEEKS } = {}) {
  let campaign = {
    id: `landing-${seed}`, name: 'landing-fixture', settlementIds: saves.map(s => s.id),
    worldState: { rngSeed: `landing-${seed}`, tick: 0, simulationRules: { religionDynamicsEnabled: true } },
    regionalGraph: ensureRegionalGraph({ edges }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  let cur = saves;
  for (let t = 0; t < weeks; t++) {
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

/**
 * Build the region, advance it, and collect everything the emit path reads.
 * @param {string} seed
 * @param {{ weeks?: number, settType?: string }} [opts]
 */
export function analyze(seed, { weeks = DEFAULT_WEEKS, settType = DEFAULT_SETT_TYPE } = {}) {
  const { town, saves, edges } = buildRegion(seed, { settType });
  const before = deriveCausalState(town);
  const { campaign, saves: after } = advanceRegion(seed, saves, edges, { weeks });
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

/**
 * ── THE ADVANCE TIMELINE — what the weeks did to THE TOWN ────────────────────
 *
 * ⛔ EVENTS, NOT DELTAS (owner order ODQ §934.30 item 4). The landing's "Advance
 * time" card used to render the why-trace's causal band deltas — "Pressure
 * increased", "Pressure decreased" — which is a readout of an internal variable,
 * not a thing that happened. These are the pulse's own APPLIED news entries: the
 * same durable records the in-app Chronicle and AdvanceReport read, filtered to
 * the ones the ENGINE scoped to the fixture town (`settlementIds` carries save
 * ids, so the filter is the engine's own judgment and not a string match on an
 * id — the town-first id patterns elsewhere in this file are alternation-fragile
 * and must not be copied here).
 *
 * ⛔ THE HONESTY LINE. Nothing here is authored, and nothing is topped up: a run
 * that produced three events renders three. The landing's whole claim is that
 * every fact on it came out of the engine, so a hand-written "event" would cost
 * more than an empty card.
 *
 * Selection is generic across seeds: ONE entry per impactKind (a twelve-week run
 * emits seven near-identical `npc_goal_rebranch` lines inside a single week — a
 * storm, not seven beats), keeping the highest-scoring instance of each; then the
 * N highest-scoring kinds overall; then back into the order they happened, which
 * is the order a reader lives them in. The season label comes from the SAME
 * helper the in-app advance report uses (tickCalendarLabel), never a local copy.
 *
 * @param {any[]} news  the campaign's wizardNews entries
 * @param {string} [townId]
 * @param {number} [limit]
 */
export function advanceTimelineFor(news, townId = 't', limit = ADVANCE_ENTRIES) {
  const mine = (news || []).filter(e => e?.kind === 'applied' && (e.settlementIds || []).includes(townId));
  /** @type {Map<string, any>} */
  const bestByKind = new Map();
  for (const e of mine) {
    const key = String(e.impactKind || e.id);
    const held = bestByKind.get(key);
    const better = !held
      || (e.score || 0) > (held.score || 0)
      || ((e.score || 0) === (held.score || 0) && (e.tick || 0) < (held.tick || 0));
    if (better) bestByKind.set(key, e);
  }
  return [...bestByKind.values()]
    .sort((x, y) => (y.score || 0) - (x.score || 0) || (x.tick || 0) - (y.tick || 0))
    .slice(0, limit)
    .sort((x, y) => (x.tick || 0) - (y.tick || 0))
    .map(e => ({
      week: `Week ${e.tick}`,
      season: tickCalendarLabel(e.tick),
      headline: e.headline,
      text: e.summary || e.headline,
    }));
}

/**
 * ── The NARRATED card's stock prose (owner-sanctioned authored content) ──────
 * The owner declined to spend AI credits narrating a fixture, so this is
 * hand-written STOCK prose in the narrative layer's register — grounded
 * EXCLUSIVELY in the derived facts the receipts carry for seed lf-033 (the
 * market-licensing conflict, the road rolled 3-of-5 against isolation, the
 * cleared mountain stands, the travelers' inn, the pressured neutral, the
 * pressure sentence, the mayor's goal). It must be revisited whenever the
 * fixture is regenerated: if the receipts change, this prose is stale until
 * re-grounded.
 *
 * ⚠ RE-GROUNDED 2026-09-19 (ODQ §934.30 car 1). The previous narration named a
 * council-seat succession between "the Free Alliance" and the Establishment and
 * put Rónnat Sullivan about to call something in. The engine no longer derives
 * any of that for this seed: the conflict is market licensing, the faction is
 * the Grey Council, and the pressure sentence is the mayor's own man drifting
 * out from under him. Every clause below is traceable to a field emitted in the
 * same run.
 */
const STOCK_NARRATION = 'The road made Cnocby by a coin’s width, three chances of it against two of nothing, and the mountain stands that raised the travelers’ inn are being cleared faster than they grow back. What is left worth holding is the licence book: the Grey Council and the Establishment both want the market licensing, and both are leaning on the same neutral name to declare before the session. The mayor still means to mend the structure while the weather holds. His own man no longer does what he would approve of, and neither of them says so.';

/**
 * The frozen fixture object for one seed — every selection COMPUTED from engine
 * output (verbatim strings where possible); nothing narrative is invented here
 * except the labels that name each receipt line and the stock narration above.
 * @param {string} seed
 * @param {{ weeks?: number, settType?: string }} [opts]
 */
export function buildFixture(seed, { weeks = DEFAULT_WEEKS, settType = DEFAULT_SETT_TYPE } = {}) {
  const a = analyze(seed, { weeks, settType });
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
    route && { label: 'route', text: `${cfg.tradeRouteAccess} · ${route.causes?.[0]?.reason || route.result}` },
    resourceReceipt && { label: 'resource', text: `${String(resourceReceipt.targetId).replace('resource.', '')} · ${String(resourceReceipt.result).replace(/_/g, ' ')} (${lastCause(resourceReceipt)})` },
    instReceipt && { label: 'institution', text: `${String(instReceipt.targetId).replace('institution.', '')} · ${instReceipt.result} (${instReceipt.causes?.[0]?.reason || ''})` },
  ].filter(Boolean).slice(0, 4);

  // Why-trace — three real band crossings. Preference order keeps the landing's
  // storyline (trade / faith / crime first), then falls back to whatever else
  // actually crossed so the card always carries three rows; picks aim for tone
  // diversity (not three identical reds) where the run allows it.
  //
  // ⚠ STILL EMITTED, NO LONGER THE ADVANCE-TIME CARD. The why-trace is the
  // proof that a change carries its cause; it is NOT a report of what happened
  // (realm.advance is). It rides the fixture because a later surface may want it
  // and because dropping a derived artifact to suit one card is how a fixture
  // becomes a page's scratch space.
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
  //
  // ⚠ THE `townFirst` PREFERENCE IS WEAKER THAN IT READS, and it is recorded
  // rather than quietly re-cut here: the alternation in each `base` is
  // UNGROUPED, so `[^]*\.t\b` binds only to the LAST alternative and the other
  // three match anywhere in the region. The chronicle beside the realm map is a
  // REGIONAL band (what happened around the town) and reads correctly as one,
  // which is why this is a note and not a fix in this car — changing it changes
  // which three beats ship, and that is the chair's call, not a lane's.
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

  return {
    seed, weeks,
    engine: { generatorVersion: town.generatorVersion || null, simulationVersion: town.simulationVersion || null },
    // The store inputs the button replays: wizard mode, the slider mode (the
    // store derives _randomizePriorities from it), a cleared neighbour import,
    // and the full config. Residual caveat: a heavily customized account
    // (persisted institution/goods toggles, eligible homebrew with
    // useCustomContent on) can still shift the stream — the landing's audience
    // is logged-out visitors, whose defaults these are.
    forge: { mode: 'basic', randomSliderMode: true, importedNeighbour: null, config: storeConfigFor(settType) },
    town: {
      name: town.name, population: town.population, tier: town.tier,
      eyebrow: `${cfg.tradeRouteAccess} ${town.tier} · ${cfg.terrainType}`,
      prose: arrival,
      pressure: town.pressureSentence || '',
      hooks: [
        npc && { kind: 'NPC', tone: 'success', tag: 'derived · npcs', lead: `${npc.name}, ${String(npc.role || '').toLowerCase()}`, rest: ` · goal: ${npc.goal.short.replace(/\.$/, '').toLowerCase()}.` },
        conflict?.plotHooks?.[0] && { kind: 'Hook', tone: 'warning', tag: 'derived · factions', text: conflict.plotHooks[0] },
      ].filter(Boolean),
      hooksMore: Math.max(0, hooksTotal - 1) + Math.max(0, npcGoals - 1),
    },
    voice: { receipts, narrated: STOCK_NARRATION },
    realm: {
      whyTrace,
      advance: advanceTimelineFor(a.news),
      chronicle: chronPicks,
      relationships: relChips,
      pins,
      neighbors: a.saves.filter(s => s.id !== 't').map(s => ({ name: s.name, tier: s.settlement.tier })),
    },
  };
}

/**
 * The frozen module's TEXT for a fixture (banner + literal). Pure, so `--check`
 * and `--emit` can never disagree about what "fresh" means.
 * @param {any} fixture
 */
export function renderFixtureModule(fixture) {
  const { seed, weeks } = fixture;
  const settType = fixture.forge?.config?.settType;
  const banner = `/**
 * home/landingFixture.js — FROZEN real engine output for the landing artifacts.
 *
 * GENERATED by scripts/generate-landing-fixture.mjs — do not hand-edit. The
 * one authored field is voice.narrated: owner-sanctioned STOCK prose (no AI
 * credits spent on a fixture), written in the narrative layer's register and
 * grounded EXCLUSIVELY in the derived receipts in voice.receipts. It lives in
 * the generator script (STOCK_NARRATION) and must be re-grounded whenever the
 * fixture is regenerated. Regenerate with:
 *   node scripts/generate-landing-fixture.mjs --seed ${seed} --emit
 * and verify with:
 *   node scripts/generate-landing-fixture.mjs --check
 *
 * Provenance: seed \`${seed}\`, ${weeks} one-week ticks of advanceCampaignWorld
 * over a 5-settlement region (fixture town + 4 neighbors), engine
 * generatorVersion ${fixture.engine.generatorVersion} / simulationVersion ${fixture.engine.simulationVersion}.
 * The town is a ${settType} — within the anon tier ceiling by design: the
 * "Forge this exact town" button replays { seed, config } through the SAME
 * store forge action as every other generation, so the artifact is a promise
 * an anonymous visitor can verify in one click. REGEN POLICY: regenerate this
 * fixture whenever engine generation output changes (goldens regen = signal),
 * or the frozen artifact and the button's live output will drift apart —
 * tests/build/landingFixtureFreshness.test.js is what makes that drift RED.
 *
 * realm.advance is the TOWN'S OWN applied pulse events across those weeks (the
 * landing's advance-time card shows what happened, not which band moved); the
 * why-trace is kept beside it as the proof that a change carries its cause.
 *
 * Consumed ONLY by the lazy landing chunk (LandingBelowFold) — never imported
 * eagerly (first-paint budget).
 */

export const fixture = `;

  // Belt-and-suspenders (owner directive: no em dashes on the landing page). The
  // templates above already emit ' · '; this strips any em dash an engine-derived
  // prose field (why-trace reason, chronicle line, arrival scene) might carry
  // through a future regen, replacing it with a comma so the fixture stays clean.
  const body = JSON.stringify(fixture, null, 2).replace(/ — /g, ', ').replace(/—/g, ', ');
  return banner + body + ';\n';
}

/**
 * The seed/weeks/settType the COMMITTED module was emitted from, read off the
 * module itself so `--check` needs no arguments and cannot be pointed at the
 * wrong run. Returns null when the module is absent or unparseable.
 */
export function committedProvenance(modulePath = MODULE_PATH) {
  if (!existsSync(modulePath)) return null;
  const text = readFileSync(modulePath, 'utf8');
  const seed = text.match(/"seed":\s*"([^"]+)"/)?.[1];
  const weeks = Number(text.match(/"weeks":\s*(\d+)/)?.[1]);
  const settType = text.match(/"settType":\s*"([^"]+)"/)?.[1];
  if (!seed || !Number.isFinite(weeks) || !settType) return null;
  return { seed, weeks, settType, text };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function main() {
  // ── check mode ─────────────────────────────────────────────────────────────
  if (has('check')) {
    const committed = committedProvenance();
    if (!committed) {
      console.error(`[landing-fixture] STALE: ${MODULE_PATH} is missing or carries no readable provenance.`);
      process.exit(1);
    }
    const fresh = renderFixtureModule(buildFixture(committed.seed, { weeks: committed.weeks, settType: committed.settType }));
    if (fresh !== committed.text) {
      console.error(`[landing-fixture] STALE: ${MODULE_PATH} does not match a fresh derivation at seed ${committed.seed}.`);
      console.error('[landing-fixture] The engine moved under the landing page. Re-emit and re-ground the stock narration:');
      console.error(`[landing-fixture]   node scripts/generate-landing-fixture.mjs --seed ${committed.seed} --emit`);
      process.exit(1);
    }
    console.log(`[landing-fixture] check OK — the frozen fixture matches the engine at seed ${committed.seed}.`);
    return;
  }

  const weeks = parseInt(arg('weeks', String(DEFAULT_WEEKS)), 10);
  const settType = arg('type', DEFAULT_SETT_TYPE);
  if (!ANON_CEILING_TIERS.includes(settType)) {
    console.error(`[landing-fixture] --type ${settType} violates the anon-ceiling cap (${ANON_CEILING_TIERS.join('|')}).`);
    process.exit(1);
  }

  // ── survey mode ──────────────────────────────────────────────────────────
  if (has('survey')) {
    const n = parseInt(arg('survey', '24'), 10);
    console.log(`seed        name                pop   route        conflicts hooks crossings headlines news pressure`);
    for (let i = 0; i < n; i++) {
      const s = `lf-${String(i).padStart(3, '0')}`;
      try {
        const a = analyze(s, { weeks, settType });
        const c = a.town.config || {};
        console.log([
          s.padEnd(11),
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
        console.log(`${s.padEnd(11)} THREW: ${String(e).slice(0, 90)}`);
      }
    }
    return;
  }

  // ── detail / emit modes ──────────────────────────────────────────────────
  const seed = arg('seed', null);
  if (!seed) { console.error('need --seed (or --survey N, or --check)'); process.exit(1); }

  if (has('detail')) {
    const a = analyze(seed, { weeks, settType });
    const out = {
      seed, weeks,
      name: a.town.name, population: a.town.population,
      config: a.town.config,
      arrivalScene: a.town.arrivalScene,
      pressureSentence: a.town.pressureSentence,
      conflicts: a.town.conflicts,
      npcGoal: a.npcWithGoal && { name: a.npcWithGoal.name, role: a.npcWithGoal.role, goal: a.npcWithGoal.goal },
      hooksAll: a.hooks,
      crossings: a.crossings,
      deltasAll: a.deltas.filter(d => Math.abs(d.change) >= 2),
      advance: advanceTimelineFor(a.news),
      headlines: a.headlines,
      news: a.news.slice(0, 20),
      neighborNames: a.saves.map(s => ({ id: s.id, name: s.name, tier: s.settlement.tier })),
      traceSample: (a.town.simulationTrace || []).slice(0, 40),
      versions: { generatorVersion: a.town.generatorVersion, simulationVersion: a.town.simulationVersion },
    };
    const p = arg('out', join(__dirname, '..', 'landing-fixture-detail.json'));
    writeFileSync(p, JSON.stringify(out, null, 1));
    console.log(`[landing-fixture] detail → ${p}`);
    console.log(`name=${a.town.name} pop=${a.town.population} crossings=${a.crossings.length} hooks=${a.hooks.length} headlines=${a.headlines.length}`);
    return;
  }

  if (!has('emit')) { console.error('pass --detail, --emit or --check'); process.exit(1); }

  const fixture = buildFixture(seed, { weeks, settType });
  // `--out` writes the module somewhere else entirely (the freshness walker's
  // out-of-tree run): a derivation test must never write into src/.
  const target = arg('out', MODULE_PATH);
  writeFileSync(target, renderFixtureModule(fixture));
  console.log(`[landing-fixture] emitted → ${target}`);
  console.log(`  town=${fixture.town.name} pop=${fixture.town.population} receipts=${fixture.voice.receipts.length} whyTrace=${fixture.realm.whyTrace.length} advance=${fixture.realm.advance.length} chronicle=${fixture.realm.chronicle.length} rels=${fixture.realm.relationships.length}`);
}

// Importable as a module (the capture script + the freshness walker read the
// seams above); the CLI runs only on a direct invocation.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
