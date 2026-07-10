/**
 * domain/display/regionWakeReplay.js — the canned "Watch a region wake up" replay.
 *
 * A READ-ONLY, deterministic, PRE-BAKED four-step sequence that lets a no-account
 * visitor SEE the premium living simulation without running it. The sequence is
 * hand-authored as a small fixture of per-step ledgers (worldState + regionalGraph
 * + settlement snapshots) and rendered through the EXISTING pure projections the
 * Realm/dossier already use:
 *
 *   - liveSieges            (warStatus.js)       — the siege coalitions
 *   - realmArcLines         (realmArcSummary.js) — the named arcs ("The War of …")
 *   - pantheonStandings     (pantheonDepth.js)   — deity seats / tier
 *   - chronicleTimeline     (chronicleTimeline.js) — the per-tick headlines
 *
 * THE GUARANTEE. Nothing here runs the world pulse, forks rng, mutates worldState,
 * or reads a wall clock. The "advance" is not a computation — it is an INDEX into a
 * frozen array of fixtures. Scrubbing to step N renders fixture N through the same
 * selectors; the projection is therefore a pure, deterministic function of the step
 * index. (Tested in tests/domain/display/regionWakeReplay.test.js.)
 *
 * The scripted beat (one new thing per month):
 *   0 — At peace. The region is quiet; the dossier-style read-out is empty.
 *   1 — A siege forms. Stoneholt marches on Greymarch; a war_front is confirmed.
 *   2 — A trade prize flips. Stoneholt seizes Greymarch's iron market.
 *   3 — A deity gains seats. Vael rises to major across three settlements.
 *   4 — The war ends. War-exhaustion drives Stoneholt home; peace returns.
 */

import { liveSieges } from './warStatus.js';
import { realmArcLines } from './realmArcSummary.js';
import { pantheonStandings } from './pantheonDepth.js';
import { chronicleTimeline } from './chronicleTimeline.js';

// ── The cast ────────────────────────────────────────────────────────────────
// Three settlements + one deity. Snapshots carry only the fields the selectors
// read (id/name for naming; config.primaryDeitySnapshot for deity resolution).
const VAEL = Object.freeze({
  _deityRef: 'deity:Vael', name: 'Vael',
  rankAxis: 'major', alignmentAxis: 'good', temperamentAxis: 'warlike',
});

/**
 * @param {string[]} vaelFaithful  ids whose settlement carries the Vael snapshot.
 * @returns {Array<{ id: string, name: string, settlement: any }>}
 */
function castFor(vaelFaithful) {
  // `vaelFaithful` settlements carry the embedded Vael snapshot (so realmArcLines
  // resolves the deity display name from the SAME public source the engine uses).
  /** @param {string} id @param {string} name */
  const mk = (id, name) => ({
    id, name,
    settlement: vaelFaithful.includes(id)
      ? { config: { primaryDeitySnapshot: VAEL } }
      : {},
  });
  return [mk('stoneholt', 'Stoneholt'), mk('greymarch', 'Greymarch'), mk('larkfen', 'Larkfen')];
}

// A confirmed public war_front channel (Stoneholt → Greymarch).
const SIEGE_FRONT = Object.freeze({
  id: 'wf-stoneholt-greymarch', type: 'war_front', status: 'confirmed',
  from: 'stoneholt', to: 'greymarch', strength: 0.7, visibility: 'public',
});

// The realigned trade_dependency channel that carries the contested commodity
// label (so liveTradeWars/realmArcLines can name "Iron").
const IRON_DEP = Object.freeze({
  type: 'trade_dependency', from: 'stoneholt', to: 'greymarch',
  goods: [{ id: 'iron', label: 'Iron' }],
});

/**
 * The frozen step fixtures. Each is a complete, self-contained snapshot of the
 * world at that month — NOT a diff. Index = month. Authored so the projections
 * surface exactly one new thing per step.
 *
 * @type {ReadonlyArray<{ worldState: any, regionalGraph: any, settlements: any[], chronicles: any[] }>}
 */
const STEPS = Object.freeze([
  // 0 — At peace. No deployments, no fronts, no flipped prizes, no pantheon.
  {
    worldState: { tick: 0, calendar: { month: 1, year: 1, season: 'spring' } },
    regionalGraph: { channels: [] },
    settlements: castFor([]),
    chronicles: [],
  },
  // 1 — A siege forms. Stoneholt deploys against Greymarch; the front confirms.
  {
    worldState: {
      tick: 1, calendar: { month: 2, year: 1, season: 'spring' },
      deployments: { stoneholt: { targetId: 'greymarch', sinceTick: 1, role: 'siege' } },
      pulseHistory: [{
        tick: 1,
        selectedOutcomes: [{
          id: 'o1', headline: 'Stoneholt marches on Greymarch',
          summary: 'A siege ring closes around the iron town.',
          targetSaveId: 'greymarch', severity: 7,
        }],
      }],
    },
    regionalGraph: { channels: [SIEGE_FRONT] },
    settlements: castFor([]),
    chronicles: [{ tick: 1, prose: 'The drums of Stoneholt sound. Greymarch bars its gates.' }],
  },
  // 2 — A trade prize flips. Stoneholt seizes Greymarch's iron market (lastFlipTick set).
  {
    worldState: {
      tick: 2, calendar: { month: 3, year: 1, season: 'summer' },
      deployments: { stoneholt: { targetId: 'greymarch', sinceTick: 1, role: 'siege' } },
      tradeWarState: {
        'greymarch:iron': { winnerId: 'stoneholt', incumbentId: 'larkfen', lastFlipTick: 2 },
      },
      pulseHistory: [{
        tick: 2,
        selectedOutcomes: [{
          id: 'o2', headline: "Stoneholt seizes Greymarch's iron",
          summary: 'The blockade reroutes the iron trade to Stoneholt.',
          targetSaveId: 'greymarch', severity: 6,
        }],
      }],
    },
    regionalGraph: { channels: [SIEGE_FRONT, IRON_DEP] },
    settlements: castFor([]),
    chronicles: [{ tick: 2, prose: 'With the road closed, the iron flows to Stoneholt instead.' }],
  },
  // 3 — A deity gains seats. Vael rises to MAJOR across three settlements.
  {
    worldState: {
      tick: 3, calendar: { month: 4, year: 1, season: 'summer' },
      deployments: { stoneholt: { targetId: 'greymarch', sinceTick: 1, role: 'siege' } },
      tradeWarState: {
        'greymarch:iron': { winnerId: 'stoneholt', incumbentId: 'larkfen', lastFlipTick: 2 },
      },
      pantheon: { 'deity:Vael': { seats: 3, wins: 2, losses: 0, tier: 'major' } },
      warExhaustion: { stoneholt: 0.34 },
      pulseHistory: [{
        tick: 3,
        selectedOutcomes: [{
          id: 'o3', headline: 'Vael ascends to a major faith',
          summary: 'Three settlements take up the warlike god.',
          targetSaveId: 'stoneholt', severity: 5,
        }],
      }],
    },
    regionalGraph: { channels: [SIEGE_FRONT, IRON_DEP] },
    settlements: castFor(['stoneholt', 'greymarch', 'larkfen']),
    chronicles: [{ tick: 3, prose: 'In the war-camps and the ruins alike, the altars of Vael fill.' }],
  },
  // 4 — The war ends. War-exhaustion drives Stoneholt home; the front clears.
  {
    worldState: {
      tick: 4, calendar: { month: 5, year: 1, season: 'autumn' },
      tradeWarState: {
        'greymarch:iron': { winnerId: 'stoneholt', incumbentId: 'larkfen', lastFlipTick: 2 },
      },
      pantheon: { 'deity:Vael': { seats: 3, wins: 2, losses: 0, tier: 'major' } },
      warExhaustion: { stoneholt: 0.41 },
      dispositionStats: { stoneholt: { wins: 1, losses: 0 }, greymarch: { wins: 0, losses: 1 } },
      pulseHistory: [{
        tick: 4,
        selectedOutcomes: [{
          id: 'o4', headline: 'Stoneholt sues for peace',
          summary: 'War-weary, the army marches home; the siege lifts.',
          targetSaveId: 'greymarch', severity: 4,
        }],
      }],
    },
    // The war_front is gone (siege lifted); the iron dependency persists.
    regionalGraph: { channels: [IRON_DEP] },
    settlements: castFor(['stoneholt', 'greymarch', 'larkfen']),
    chronicles: [{ tick: 4, prose: 'The army of Stoneholt turns home. Greymarch counts its dead and reopens the road.' }],
  },
]);

/** The number of steps in the replay (months, 0..STEP_COUNT-1). */
export const REPLAY_STEP_COUNT = STEPS.length;

/**
 * Project the canned replay at one step through the EXISTING selectors. Pure and
 * deterministic: a function only of `step` (clamped into range). No rng, no
 * engine, no mutation — the same step always returns the same view-model.
 *
 * @param {number} step  0-based month index; clamped to [0, REPLAY_STEP_COUNT-1].
 * @returns {{
 *   step: number,
 *   monthLabel: string,
 *   sieges: ReturnType<typeof liveSieges>,
 *   arcs: string[],
 *   pantheon: ReturnType<typeof pantheonStandings>,
 *   headlines: Array<{ headline: string, summary: string }>,
 *   atPeace: boolean,
 * }}
 */
export function projectReplayStep(step) {
  const idx = Number.isFinite(step) ? Math.max(0, Math.min(REPLAY_STEP_COUNT - 1, Math.trunc(step))) : 0;
  const f = STEPS[idx];
  const { worldState, regionalGraph, settlements } = f;

  const sieges = liveSieges({ worldState, regionalGraph });
  const arcs = realmArcLines({ worldState, regionalGraph, settlements });
  const pantheon = pantheonStandings(worldState);
  const timeline = chronicleTimeline({
    chronicles: f.chronicles,
    pulseHistory: worldState.pulseHistory,
  });
  // The current tick's headlines (the timeline is newest-first; tick === idx).
  const tickEntry = timeline.find(e => e.tick === idx) || null;
  const headlines = tickEntry
    ? tickEntry.headlines.map(h => ({ headline: h.headline, summary: h.summary }))
    : [];

  const cal = worldState.calendar || {};
  const season = String(cal.season || 'spring');
  const monthLabel = `${season.charAt(0).toUpperCase()}${season.slice(1)}, Yr ${cal.year || 1}`;

  return {
    step: idx,
    monthLabel,
    sieges,
    arcs,
    pantheon,
    headlines,
    atPeace: sieges.length === 0 && arcs.length === 0,
  };
}

/**
 * The full projected sequence (every step), for tests + any consumer that wants
 * to pre-render all frames. Pure; stable across calls.
 * @returns {Array<ReturnType<typeof projectReplayStep>>}
 */
export function projectReplaySequence() {
  return STEPS.map((_, i) => projectReplayStep(i));
}
