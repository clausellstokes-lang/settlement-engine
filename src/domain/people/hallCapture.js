/**
 * people/hallCapture.js — THE HALL-CAPTURE STATE, DERIVED FROM ONE SOURCE (the allegiance train, car 2,
 * ALLEGIANCE-CAR2, 2026-11-08; the design docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §2 A6, §3.4;
 * the chair's J-13 in docs/allegiance/ALLEGIANCE_RULINGS_2026-11-08.md: "ONE function owns the state and
 * is its only writer").
 *
 * THE OWNER'S PRINCIPLE (verbatim): "it's not predictability we are going for its plausibility with
 * confidence and that makes sense." Before this module the town's `powerStructure.criminalCaptureState`
 * was a threshold classifier over the powers' STRENGTHS alone (generators/factionDynamics.js ::
 * computeCriminalCaptureState), blind to who actually sits in the ruling hall: 4 towns of the soak 1,000
 * read 'capture' with no agent in the ruling three, and 14 with one read 'none' (car 2's base probe).
 * Now the state is the AGENT RUNG — the hidden allegiances (domain/people/allegiance.js) among the
 * governing power's first, second and third — combined with the old classifier kept as the CLIMATE
 * RUNG, capped at 'equilibrium' so strengths alone describe only coexistence:
 *
 *   agentScore  = Σ over the ruling three's agents of weight[rank]           (HALL_CAPTURE_TUNING.weight)
 *   agentRung   = capture      the lord is an agent and agentScore ≥ captureScore, where a criminal power stands
 *                 corrupted    the lord is an agent, or agentScore ≥ corruptedScore, or the governing power
 *                              is itself criminal (a purchased council)
 *                 equilibrium  agentScore > 0
 *                 none         else
 *   climateRung = the classifier, capped at 'equilibrium'
 *   state       = max(agentRung, climateRung) on CAPTURE_LADDER
 *
 * What it guarantees (I-1): 'capture' always has an agent lord and a criminal power standing; 'corrupted' always has an agent in the
 * three or a criminal governing power. Neither is reachable from strengths alone.
 *
 * THE ONE WRITER (J-13). `writeHallCapture` is the only code that writes `criminalCaptureState` on a
 * power structure and the governing row's birth `captureState` seed (the play-time ladder's first rung,
 * which `ensureFactionStates` reads). It is called at ONE line, the coherence seam
 * (generators/narrativeGenerator.js :: enrichNpcCoherence, after the handlers and before the structural
 * pass that reads the state). The power step no longer writes the state at birth, and the economy
 * re-projection no longer re-writes it. The simulation's own ladder (domain/worldPulse) moves the rung
 * at play time on its own path; that is the simulator's, not birth's.
 *
 * Pure: no draw, no clock. This domain module imports nothing from src/generators
 * (tests/build/domainGeneratorsBoundary.test.js): the seam computes the climate rung with the classifier
 * and hands it in.
 */
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { allegianceOf, criminalPowersOf, isCriminalPower } from './allegiance.js';
import { CAPTURE_LINES } from '../../data/people/dmPowerLines.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {'none' | 'adversarial' | 'equilibrium' | 'corrupted' | 'capture'} CaptureRung */

/** The capture ladder, lowest first (the classifier's own vocabulary; the simulation's `LADDER`). */
export const CAPTURE_LADDER = Object.freeze(/** @type {CaptureRung[]} */ (['none', 'adversarial', 'equilibrium', 'corrupted', 'capture']));

/**
 * THE DIALS of the derived hall (§3.4; a DRAFT row in tests/lint/.tuning-register.json until the owner
 * signs the estate). Units: weight points · captureScore points · corruptedScore points · climateCap rank
 * (a rung of CAPTURE_LADDER, its index).
 */
export const HALL_CAPTURE_TUNING = Object.freeze({
  /** an agent's weight by its rank in the ruling three */
  weight: Object.freeze({ 1: 3, 2: 2, 3: 1 }),
  /** the agent score at which an agent lord's hall is captured: the lord and the second */
  captureScore: 5,
  /** the agent score at which the hall is corrupted: the second and the third, or the lord alone */
  corruptedScore: 3,
  /** the highest rung the climate (strengths alone) can reach: 'equilibrium' */
  climateCap: 2,
});

/** @param {unknown} v @returns {Rec} */
const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');
/** @param {unknown} rung @returns {number} its index on the ladder, 0 for an unknown value */
const indexOf = (rung) => Math.max(0, CAPTURE_LADDER.indexOf(/** @type {CaptureRung} */ (str(rung))));

/**
 * @typedef {{ id: string, name: string, rank: 1 | 2 | 3, guild: string }} HallAgent
 * @typedef {{ state: CaptureRung, agentRung: CaptureRung, climateRung: CaptureRung, agentScore: number,
 *   agents: HallAgent[], ruler: string | null, rulerCriminal: boolean, underworld: string | null,
 *   receipt: string }} HallCapture
 */

/**
 * THE DERIVATION (§3.4). Reads the cast's ranks in the governing power and their hidden allegiances, the
 * governing power's category, and the climate rung the caller hands in (the classifier's verdict; absent,
 * the record's own stored state stands in, capped — a re-read of a born record returns its state).
 *
 * @param {unknown} settlement a settlement (or the seam's settlement-shaped view) — `npcs`, `powerStructure`
 * @param {{ climate?: unknown, npcs?: unknown[], tuning?: typeof HALL_CAPTURE_TUNING }} [opts]
 *   `climate` the classifier's rung; `npcs` the cast to read (the seam's ranked cast), else `settlement.npcs`
 * @returns {HallCapture}
 */
export function hallCaptureOf(settlement, opts = {}) {
  const T = opts.tuning || HALL_CAPTURE_TUNING;
  const s = rec(settlement);
  const cast = (Array.isArray(opts.npcs) ? opts.npcs : Array.isArray(s.npcs) ? s.npcs : []).map(rec);
  const governing = governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (s)));
  const ruler = nameOf(governing) || null;
  const rulerCriminal = !!governing && isCriminalPower(governing);
  /** @type {HallAgent[]} */
  const agents = [];
  if (ruler) {
    for (const card of cast) {
      const m = (Array.isArray(card.memberships) ? card.memberships : []).map(rec)
        .find((x) => x.power === ruler && (x.rank === 1 || x.rank === 2 || x.rank === 3));
      if (!m) continue;
      const a = allegianceOf(card);
      if (!a) continue;
      agents.push({ id: String(card.id), name: str(card.name), rank: /** @type {1 | 2 | 3} */ (m.rank), guild: a.power || a.house });
    }
    agents.sort((x, y) => x.rank - y.rank);
  }
  const agentScore = agents.reduce((sum, a) => sum + (Number(T.weight[a.rank]) || 0), 0);
  const lordAgent = agents.some((a) => a.rank === 1);
  const underworld = nameOf(criminalPowersOf(s).find((p) => nameOf(p) !== ruler)) || null;
  // COHERENCE-POWERS (the chair's ruling of 2026-11-12, cure (a)): capture is allowed WHERE A CRIMINAL POWER STANDS (the
  // design §3.4); an agent lord with no organisation in the town to hold the hall is at most corrupted (a lord who is bought)
  /** @type {CaptureRung} */
  const agentRung = lordAgent && agentScore >= T.captureScore && underworld ? 'capture'
    : (lordAgent || agentScore >= T.corruptedScore || rulerCriminal) ? 'corrupted'
      : agentScore > 0 ? 'equilibrium'
        : 'none';
  const climateIn = opts.climate !== undefined ? opts.climate : rec(s.powerStructure).criminalCaptureState;
  const climateRung = CAPTURE_LADDER[Math.min(indexOf(climateIn), T.climateCap)];
  const state = CAPTURE_LADDER[Math.max(indexOf(agentRung), indexOf(climateRung))];
  const facts = { ruler: ruler || 'the ruling power', agents, rulerCriminal, underworld };
  return { state, agentRung, climateRung, agentScore, agents, ruler, rulerCriminal, underworld, receipt: hallReceipt(state, facts) };
}

/**
 * The hall's receipt, one plain line (the DM view's "The hall", design §9): the rung's label and its
 * variant-0 line from WRITE-PEOPLE's data (src/data/people/dmPowerLines.js :: CAPTURE_LINES), e.g.
 * "Corrupted: The second and the third of the Elder Council answer to the Thieves' Guild."
 * @param {CaptureRung} state
 * @param {{ ruler: string, agents: HallAgent[], rulerCriminal: boolean, underworld: string | null }} facts
 * @returns {string}
 */
export function hallReceipt(state, facts) {
  const line = CAPTURE_LINES[state][0](facts);
  return `${state.charAt(0).toUpperCase()}${state.slice(1)}: ${line}`;
}

/**
 * THE ONE WRITER (J-13): a copy of `powerStructure` carrying the derived state. `criminalCaptureState` keeps
 * its place in the record (after `factionRelationships`), and the governing row's birth seed `captureState`
 * is stamped when the state is equilibrium or above and the row carries none (the play-time ladder's first
 * rung, the rule the power step applied before; after `powerLabel`, its place). Never mutates its input.
 *
 * THE RE-DERIVATION (FIX-SECTION-REGEN, 2026-11-09): with `opts.rederive` the writer re-reads a BORN record — a
 * section regeneration re-derives the hall over its new cast (generators/generateSettlementPipeline.js ::
 * regenNPCsPipeline). The governing row's seed this writer stamped at birth equals the record's prior
 * `criminalCaptureState`; that seed is the writer's own and is re-derived as birth derives it (stamped at
 * equilibrium and above, absent below), so the record ends exactly as a full generation of the same cast. A seed
 * that differs from the prior state was moved by another hand (the play-time ladder) and is kept.
 *
 * @param {unknown} powerStructure @param {{ state: CaptureRung }} hall
 * @param {{ rederive?: boolean }} [opts]
 * @returns {Rec | unknown} the new power structure (the input itself when it is not an object)
 */
export function writeHallCapture(powerStructure, hall, opts = {}) {
  if (!powerStructure || typeof powerStructure !== 'object' || Array.isArray(powerStructure)) return powerStructure;
  const ps = /** @type {Rec} */ (powerStructure);
  const state = hall.state;
  const seed = ['equilibrium', 'corrupted', 'capture'].includes(state);
  const prior = opts.rederive === true ? str(ps.criminalCaptureState) : '';
  const factions = Array.isArray(ps.factions)
    ? ps.factions.map((f) => {
      const born = rec(f);
      // the writer's own birth seed, on a re-derivation: lifted, so the rule below stamps it afresh (or leaves none)
      const { captureState: own, ...unseeded } = born;
      const row = prior && born.isGoverning === true && own === prior ? unseeded : born;
      if (!seed || row.isGoverning !== true || row.captureState) return row === born ? f : row;
      return insertAfter(row, 'powerLabel', { captureState: state });
    })
    : ps.factions;
  return insertAfter({ ...ps, factions }, 'factionRelationships', { criminalCaptureState: state });
}

/**
 * A copy of `obj` with the one entry of `entry` set, placed right after `anchor` when `anchor` is present and the
 * key is not (the record's key order is part of its bytes); else set in place.
 * @param {Rec} obj @param {string} anchor @param {Rec} entry one key and its value @returns {Rec}
 */
function insertAfter(obj, anchor, entry) {
  const [key] = Object.keys(entry);
  if (Object.hasOwn(obj, key) || !Object.hasOwn(obj, anchor)) return { ...obj, ...entry };
  /** @type {Rec} */
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v;
    if (k === anchor) Object.assign(out, entry);
  }
  return out;
}
