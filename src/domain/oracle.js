/**
 * domain/oracle.js — THE ORACLE (V-14, VISION WAVE): the solo player's GM.
 *
 * A DETERMINISTIC oracle — NO AI in the core. Seeded draws are ANSWERED FROM STATE: a
 * yes/no weighted by the relevant ledgers (asking "is the road safe?" reads the
 * embattlement truth), a scene prompt composed from the live world, and a complication
 * drawn from what is actually happening — every answer carrying its WORLD-TRUTH BASIS
 * note (receipts culture, without a provider). The sim already computes what other
 * oracles fake; this one just reads it.
 *
 * STREAM ISOLATION: the oracle forks its OWN named rng stream off the world seed
 * (`<seed>::oracle:<q>:<tick>`), so a draw never collides with — or perturbs — the
 * generation pipeline's per-step streams. READS-ONLY: askOracle never mutates worldState
 * or the settlement (a pin proves reference-equality). AI dressing, if ever wanted, rides
 * the existing metered surfaces — the core needs none.
 */

import { createPRNG } from '../kernel/prng.js';
import { pickVariant } from '../kernel/proseHash.js';
import { clamp01 } from '../kernel/math.js';
import { embattlementLevel } from './spatial/embattlement.js';
import { deriveAllActiveConditions } from './activeConditions.js';
import {
  ORACLE_SCENE_TEXTURE, ORACLE_QUIET_SCENE, ORACLE_COMPLICATION_FRAMES, ORACLE_LIKELIHOODS,
} from '../data/oracleCorpus.js';

/** The most a live world may bend the player's prior (bounded — the dice still matter). */
const PRESSURE_CAP = 0.35;

/** @typedef {{ label: string, detail: string, source: string }} OracleBasis */
/** @typedef {{ seed?: string|number, tick?: number, spatialLedgers?: Record<string, unknown> }|null|undefined} OracleWorld */
/** @typedef {{ id?: string|number, name?: string, seed?: string|number, activeConditions?: unknown[] }|null|undefined} OracleSettlement */
/** @typedef {{ archetype?: string, label?: string, description?: string, severity?: number, id?: string }} OracleCondition */
/** @typedef {{ random: () => number, fork: (label: string) => OracleRng }} OracleRng */

/** The odds ladder as a lookup (id → base p(yes)). */
const LIKELIHOOD_BASE = Object.freeze(
  Object.fromEntries(ORACLE_LIKELIHOODS.map((l) => [l.id, l.base])),
);

/** A coarse band label for a 0..1 pressure reading (for basis prose).
 *  @param {number} v @returns {string} */
function band01(v) {
  if (v >= 0.66) return 'high';
  if (v >= 0.33) return 'moderate';
  if (v > 0) return 'low';
  return 'none';
}

/**
 * Infer whether the question's framing means a dangerous/turbulent world makes YES more
 * likely (a threat question) or LESS likely (a safety question). Deterministic keyword
 * match; an unrecognised framing returns dir 0 (the ledgers do not bear — the prior stands).
 * @param {string} question
 * @returns {{ topic: 'safety'|'threat'|'none', dir: -1|0|1 }}
 */
export function inferTopic(question) {
  const q = String(question || '').toLowerCase();
  const SAFETY = /\b(safe|secure|protected|peace|peaceful|calm|quiet|stable|settled|fine|well|alright|recover|hold)\b/;
  const THREAT = /\b(danger|dangerous|attack|attacked|raid|ambush|threat|threaten|war|fight|trouble|crisis|worse|wrong|unrest|riot|collapse|fall|betray|siege)\b/;
  const threat = THREAT.test(q);
  const safety = SAFETY.test(q);
  // A threat cue wins ties (the sharper signal); pure-safety lowers p under pressure.
  if (threat) return { topic: 'threat', dir: 1 };
  if (safety) return { topic: 'safety', dir: -1 };
  return { topic: 'none', dir: 0 };
}

/** Read the live world pressure bearing on the anchored settlement: danger (embattlement)
 *  + turmoil (worst active-condition severity). Reads-only.
 *  @param {OracleWorld} worldState @param {OracleSettlement} settlement
 *  @returns {{ danger: number, turmoil: number, conditions: OracleCondition[] }} */
export function worldPressure(worldState, settlement) {
  const id = settlement?.id;
  const danger = id != null ? clamp01(embattlementLevel(worldState, id)) : 0;
  const conditions = /** @type {OracleCondition[]} */ (deriveAllActiveConditions(settlement));
  const turmoil = conditions.reduce((m, c) => Math.max(m, clamp01(Number(c?.severity) || 0)), 0);
  return { danger, turmoil, conditions };
}

/**
 * Weigh the yes/no odds: the player's prior, bent by the live world (each bend a basis
 * note). Pure + deterministic.
 * @param {{ worldState?: OracleWorld, settlement?: OracleSettlement, question?: string, likelihood?: string }} args
 * @returns {{ p: number, base: number, danger: number, turmoil: number, topic: string,
 *   dir: number, basis: OracleBasis[] }}
 */
export function weighOdds({ worldState, settlement, question, likelihood }) {
  const base = LIKELIHOOD_BASE[likelihood ?? 'even'] ?? 0.5;
  const { topic, dir } = inferTopic(question ?? '');
  const { danger, turmoil } = worldPressure(worldState, settlement);
  const pressure = clamp01(Math.max(danger, turmoil * 0.9)); // danger leads; turmoil supports
  const shift = dir * pressure * PRESSURE_CAP;
  const p = clamp01(base + shift);

  /** @type {OracleBasis[]} */
  const basis = [];
  if (dir === 0) {
    basis.push({ label: 'No ledger bears on this', detail: 'the odds stand at your estimate', source: 'oracle:prior' });
  } else {
    if (danger > 0) basis.push({ label: `Danger reads ${band01(danger)}`, detail: `embattlement ${danger.toFixed(2)} at this settlement`, source: 'read:embattlement' });
    if (turmoil > 0) basis.push({ label: `Turmoil reads ${band01(turmoil)}`, detail: `a live condition at severity ${turmoil.toFixed(2)}`, source: 'read:conditions' });
    if (danger === 0 && turmoil === 0) basis.push({ label: 'The world here is quiet', detail: 'no danger or turmoil bears — the prior stands', source: 'oracle:prior' });
  }
  return { p, base, danger, turmoil, topic, dir, basis };
}

/** Draw the yes/no (with Mythic-style exceptional bands) from a stream. Pure given the rng.
 *  @param {OracleRng} rng @param {number} p
 *  @returns {{ answer: string, roll: number }} */
export function drawAnswer(rng, p) {
  const d = rng.random();
  const yes = d < p;
  let answer;
  if (yes) answer = d < p * 0.15 ? 'yes-and' : 'yes';
  else answer = d > p + (1 - p) * 0.85 ? 'no-and' : 'no';
  return { answer, roll: d };
}

/** Human label for an answer enum. @param {string} answer @returns {string} */
export function answerLabel(answer) {
  switch (answer) {
    case 'yes-and': return 'Yes, and…';
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'no-and': return 'No, and…';
    default: return 'No';
  }
}

/**
 * Compose the scene prompt: a texture line (corpus, seeded) plus WORLD-TRUTH lines read
 * from the live pressure — each world line a basis note. Pure given the rng.
 * @param {{ rng: OracleRng, settlement?: OracleSettlement, danger: number, turmoil: number, conditions?: OracleCondition[] }} args
 * @returns {{ title: string, texture: string|undefined, worldLines: string[], basis: OracleBasis[] }}
 */
export function composeScene({ rng, settlement, danger, turmoil, conditions }) {
  const pressured = danger > 0 || turmoil > 0;
  const pool = pressured ? ORACLE_SCENE_TEXTURE : ORACLE_QUIET_SCENE;
  const texture = pickVariant(pool, `scene:${rng.random()}`);
  const name = settlement?.name || 'here';

  const worldLines = [];
  /** @type {OracleBasis[]} */
  const basis = [];
  if (danger > 0) {
    worldLines.push(`The way to ${name} carries ${band01(danger)} danger.`);
    basis.push({ label: 'Scene reads the road', detail: `embattlement ${danger.toFixed(2)}`, source: 'read:embattlement' });
  }
  const top = [...(conditions || [])].sort((a, b) => (Number(b?.severity) || 0) - (Number(a?.severity) || 0))[0];
  if (top) {
    worldLines.push(`${top.label} still grips ${name}.`);
    basis.push({ label: 'Scene reads a live condition', detail: top.label ?? '', source: 'read:conditions' });
  }
  return { title: `The oracle looks toward ${name}`, texture, worldLines, basis };
}

/**
 * Draw a complication from a LIVE ledger fact (the worst active condition), framed by the
 * corpus. Returns null when the world is quiet (honest — no invented trouble). Pure given rng.
 * @param {{ rng: OracleRng, conditions?: OracleCondition[] }} args
 * @returns {{ text: string, condition: string|undefined, basis: OracleBasis } | null}
 */
export function drawComplication({ rng, conditions }) {
  const live = [...(conditions || [])]
    .filter((c) => (Number(c?.severity) || 0) > 0)
    .sort((a, b) => (Number(b?.severity) || 0) - (Number(a?.severity) || 0));
  if (live.length === 0) return null;
  const cond = live[0];
  const frame = pickVariant(ORACLE_COMPLICATION_FRAMES, `comp:${rng.random()}`) || 'but {detail} is already in motion here';
  const detail = String(cond.label || 'trouble').toLowerCase();
  return {
    text: frame.replace('{detail}', detail),
    condition: cond.archetype,
    basis: { label: 'Complication drawn from the record', detail: cond.description || cond.label || '', source: 'read:conditions' },
  };
}

/** Normalize a question for the seed (so trivial spacing/case changes don't reseed).
 *  @param {string} question @returns {string} */
function seedQuestion(question) {
  return String(question || '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 200);
}

/**
 * Ask the oracle. Deterministic and READS-ONLY: same (seed, question, world, likelihood)
 * always yields the same answer; worldState + settlement are never mutated.
 * @param {{ worldState?: OracleWorld, settlement?: OracleSettlement, question?: string,
 *   seed?: string|number|null, likelihood?: string, tick?: number }} [args]
 */
export function askOracle({ worldState = null, settlement = null, question = '', seed = null, likelihood = 'even', tick = 0 } = {}) {
  const baseSeed = String(seed ?? worldState?.seed ?? settlement?.seed ?? 'oracle');
  const rng = createPRNG(baseSeed).fork(`oracle:${seedQuestion(question)}:${tick || 0}`);
  const odds = weighOdds({ worldState, settlement, question, likelihood });
  const ans = drawAnswer(rng.fork('answer'), odds.p);
  const { danger, turmoil, conditions } = worldPressure(worldState, settlement);
  const scene = composeScene({ rng: rng.fork('scene'), settlement, danger, turmoil, conditions });
  const complication = drawComplication({ rng: rng.fork('complication'), conditions });

  const basis = [...odds.basis, ...scene.basis, ...(complication ? [complication.basis] : [])];
  return {
    question,
    likelihood,
    answer: ans.answer,
    answerLabel: answerLabel(ans.answer),
    roll: ans.roll,
    odds: { p: odds.p, base: odds.base, danger: odds.danger, turmoil: odds.turmoil, topic: odds.topic },
    scene,
    complication,
    basis,
  };
}
