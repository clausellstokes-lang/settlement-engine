/**
 * domain/worldPulse/commonsVoiceKernel.js — V-23 THE COMMONS' VOICE (Vision lane V-K).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf (no store/React import, no clock, no rng).
 * Reached only inside the pulse tick, behind the VIRTUAL commonsVoiceEnabled flag.
 *
 * WHAT THIS SLICE OWNS: the `commonsVoice` spatial ledger — a persistent, per-settlement
 * crowd-action record that fills the gap the V-23 CHECK HALF verified (see the lane report:
 * the engine already carries the scalar `rebellion` stressor + its narrative variants, the
 * faction-initiated `faction_government_challenge`, the manual `STARTED_RIOT` DM event, and
 * the `coup_detat` revolution tier — but NOTHING that fires the UNNAMED COMMONS as a
 * discrete, organically-born, escalating, NAMED collective actor between grumbling and
 * revolution). This slice builds ONLY that verified gap: a three-rung escalation —
 * petition -> gathering -> riot-band — deterministic from the legitimacy / corruption /
 * unrest state that ALREADY exists.
 *
 * THE COHESION LAW (binding): this is a CONSUMER + REFRAMER. It invents no new effect
 * vocabulary and no new writer. Its consequences route EXCLUSIVELY through existing
 * writers — legitimacy through the publicLegitimacy.score applicator idiom (reimplemented
 * self-contained, the traditions/roads/upswing precedent), and unrest through the stressor
 * machinery's own `adjustStressorSeverityById`. Every arrow lands in a system that already
 * reads that state (coup window + government challenge read legitimacy; flight + realm
 * "Uprising" read the unrest stressor). NO-DEATH holds: the crowd raises its voice; it
 * never resolves a named soul's fate.
 *
 * THE DORMANCY GATE (constitutional): behind the VIRTUAL commonsVoiceEnabled flag, ABSENT
 * from DEFAULT_SIMULATION_RULES. Dark ⇒ a complete no-op (zero `commonsVoice` key, zero
 * legitimacy/stressor delta, zero news) — the commons-voice dormancy golden proves the
 * wired-but-dormant layer is byte-identical to pre-wire. NO rng (the escalation is a
 * deterministic threshold machine over existing reads; cadence is the pulse tick).
 */
import {
  num, asObject, compareCodepoint, round4,
} from './npcLadderState.js';
import { clamp01 } from './relationshipState.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { adjustStressorSeverityById } from './stressors.js';

// ── THE DORMANCY GATE (constitutional law) — a virtual, defensively-read flag ──────────
/**
 * Is THE COMMONS' VOICE lit? Reads simulationRules.commonsVoiceEnabled === true, defensively
 * — ABSENT ⇒ false ⇒ DORMANT ⇒ the mover is never entered (byte-identical; NO default in
 * DEFAULT_SIMULATION_RULES, so goldens do not move). Mirrors traditionsActive / roadsActive.
 * Pure, total.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState
 * @returns {boolean}
 */
export function commonsVoiceActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).commonsVoiceEnabled === true);
}

// ── Tuning (deterministic thresholds; no rng) ─────────────────────────────────────────
const CV = Object.freeze({
  LEGIT_FLOOR: 55,          // legitimacy at/above this contributes no grievance
  W_LEGIT: 0.55,            // grievance weight: the seat's lost standing
  W_CORRUPT: 0.35,          // grievance weight: an exposed / seated corruption
  W_UNREST: 0.55,           // grievance weight: a live unrest stressor
  RUNG_PETITION: 0.35,      // grievance ≥ ⇒ target rung 1
  RUNG_GATHERING: 0.55,     // grievance ≥ ⇒ target rung 2
  RUNG_RIOT: 0.75,          // grievance ≥ ⇒ target rung 3
  DWELL_TICKS: 3,           // sustained pressure ticks before a rung escalates by one step
  LEGIT_DIP: Object.freeze([0, 1, 2, 3]),  // step legitimacy cost on ENTERING rung [none,petition,gathering,riot]
  RIOT_UNREST_STEP: 0.10,   // one-time bounded unrest raise on entering the riot rung
});

/** Unrest stressor types the commons reads AND (at riot) nudges — the existing crowd-mood scalars. */
const UNREST_TYPES = new Set(['rebellion', 'political_fracture', 'coup_detat', 'slave_revolt']);

/**
 * Read a settlement's publicLegitimacy.score (integer [0,100]); NaN when absent/legacy-bare.
 * @param {Record<string, unknown>} settlement @returns {number}
 */
function legitimacyScoreOf(settlement) {
  const ps = asObject(asObject(settlement).powerStructure);
  const plRaw = ps.publicLegitimacy;
  const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw) ? asObject(plRaw) : null;
  if (!pl || !Number.isFinite(Number(pl.score))) return NaN;
  return Number(pl.score);
}

/**
 * The highest-severity live UNREST stressor on a settlement (id + severity), or null.
 * @param {Record<string, unknown>} settlement @returns {{ id: string, severity: number }|null}
 */
function topUnrestStressor(settlement) {
  const list = Array.isArray(asObject(settlement).stressors) ? /** @type {Record<string, unknown>[]} */ (asObject(settlement).stressors) : [];
  let best = null;
  for (const raw of list) {
    const s = asObject(raw);
    if (!UNREST_TYPES.has(String(s.type))) continue;
    const sev = clamp01(num(s.severity, 0));
    if (!best || sev > best.severity) best = { id: String(s.id), severity: sev };
  }
  return best;
}

/**
 * Does this settlement carry a SEATED corruption the crowd can see? An exposed, un-ousted
 * corrupt NPC on the roster, OR a fresh exposedCorruption ledger entry keyed to it. Returns
 * the accused NPC id (for the assize coupling) when a person is nameable, else '' when only
 * the settlement-level signal fires. @param {string} sid @param {Record<string, unknown>} settlement
 * @param {Record<string, unknown>} exposedLedger @returns {{ signal: boolean, accusedNid: string }}
 */
function corruptionSignalOf(sid, settlement, exposedLedger) {
  const npcs = Array.isArray(asObject(settlement).npcs) ? /** @type {Record<string, unknown>[]} */ (asObject(settlement).npcs) : [];
  let accusedNid = '';
  for (const npc of npcs) {
    if (npc && npc.corrupt === true && npc.ousted !== true && (num(npc.timesExposed, 0) > 0)) {
      const nid = typeof npc.id === 'string' ? npc.id : (npc.id != null ? String(npc.id) : '');
      if (nid && (!accusedNid || nid < accusedNid)) accusedNid = nid; // codepoint-stable pick
    }
  }
  if (accusedNid) return { signal: true, accusedNid };
  // Settlement-level: any live exposedCorruption entry where this settlement is the corrupted side.
  const prefix = `${sid}>`;
  for (const key of Object.keys(exposedLedger)) {
    if (key.startsWith(prefix)) return { signal: true, accusedNid: '' };
  }
  return { signal: false, accusedNid: '' };
}

/**
 * Apply signed publicLegitimacy.score deltas to snapshot updates (the applyLegitimacyHits
 * idiom, reimplemented self-contained so this lazy leaf imports no eager writer): integer,
 * clamped [0,100], skipping an absent/legacy-bare legitimacy. Pure.
 * @param {Record<string, unknown>[]} updates @param {Map<string, number>} index @param {Map<string, number>} hits
 * @returns {Record<string, unknown>[]}
 */
function applyLegitimacySteps(updates, index, hits) {
  if (!hits.size) return updates;
  let next = updates;
  let cloned = false;
  for (const [id, delta] of hits) {
    if (!delta) continue;
    const ui = index.get(String(id));
    if (ui === undefined) continue;
    const entry = asObject(next[ui]);
    const settlement = asObject(entry.settlement);
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw) ? asObject(plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(clampNum(Number(pl.score) + delta, 0, 100));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = { ...entry, settlement: { ...settlement, powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } } } };
  }
  return next;
}

/** @param {number} v @param {number} lo @param {number} hi @returns {number} */
function clampNum(v, lo, hi) { return Math.max(lo, Math.min(hi, Number(v) || 0)); }

const RUNG_KIND = Object.freeze(['', 'commons_petition', 'commons_gathering', 'commons_riot']);
const RUNG_WORD = Object.freeze(['', 'petition', 'gathering', 'riot']);

/**
 * Build a rung-escalation beat (its own in-register prose; deliberately unvoiced at the crier
 * — the ladder/roads/traditions precedent — so newsVoiceCategory returns null via the
 * set-but-unclassified guard). The impactKind is a LITERAL per rung so the walker's mint scan
 * (impactKindWalkers.test.js) sees each one — the house norm (traditions/roads mint literals).
 * @param {{ sid: string, rung: number, headline: string, summary: string, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
function commonsBeat({ sid, rung, headline, summary, tick, now }) {
  const base = {
    id: `wizard_news.${tick}.${RUNG_KIND[rung]}.${sid}`,
    createdAt: now || null,
    tick,
    scope: rung >= 3 ? 'regional' : 'local',
    significance: rung >= 3 ? 'major' : 'notable',
    severity: rung === 3 ? 0.7 : rung === 2 ? 0.45 : 0.25,
    headline,
    summary,
    kind: 'applied',
    channelType: 'political_authority',
    settlementIds: [sid],
    tags: ['commons_voice', RUNG_WORD[rung]],
  };
  if (rung === 1) return { ...base, impactKind: 'commons_petition' };
  if (rung === 2) return { ...base, impactKind: 'commons_gathering' };
  return { ...base, impactKind: 'commons_riot' };
}

/** @param {string} townName @param {number} rung @param {string} grievanceWord @returns {string} */
function headlineFor(townName, rung, grievanceWord) {
  if (rung === 1) return `${townName}: a petition is raised against ${grievanceWord}`;
  if (rung === 2) return `${townName}: the commons gather over ${grievanceWord}`;
  return `${townName}: the streets rise over ${grievanceWord}`;
}
/** @param {number} rung @param {string} grievanceWord @returns {string} */
function summaryFor(rung, grievanceWord) {
  if (rung === 1) return `The common folk have set their names to a petition, and their grievance — ${grievanceWord} — is carried to the seat in the open. No faction owns it; the crowd speaks for itself.`;
  if (rung === 2) return `The petition has become a gathering. The market square will not empty, and the talk of ${grievanceWord} hardens into a demand the seat can no longer pretend it has not heard.`;
  return `The gathering has become a riot-band — an organised crowd, short of rebellion but past all petitioning, that holds the square and presses the seat over ${grievanceWord}. The watch is stretched, and the seat's standing bleeds by the hour.`;
}

/**
 * THE COMMONS' VOICE mover. Dark ⇒ no-op. Lit ⇒ a deterministic per-settlement escalation
 * over existing legitimacy/corruption/unrest reads, with consequences through existing writers.
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>, settlementUpdates?: unknown, tick?: unknown, now?: unknown }} args
 * @returns {{ changed: boolean, worldState: Record<string, unknown>, settlementUpdates: Record<string, unknown>[], newsEntries: Record<string, unknown>[] }}
 */
export function advanceCommonsVoice(args) {
  const worldState = args.worldState;
  const updates = Array.isArray(args.settlementUpdates) ? /** @type {Record<string, unknown>[]} */ (args.settlementUpdates) : [];
  if (!commonsVoiceActive(worldState)) return { changed: false, worldState, settlementUpdates: updates, newsEntries: [] };
  return advanceLitCommonsVoice({ ...args, worldState, settlementUpdates: updates });
}

/**
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>, settlementUpdates: Record<string, unknown>[], tick?: unknown, now?: unknown }} args
 */
function advanceLitCommonsVoice({ snapshot, worldState, settlementUpdates, tick, now }) {
  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const nowIso = typeof now === 'string' ? now : null;
  const snap = asObject(snapshot);
  const items = Array.isArray(snap.settlements) ? /** @type {Record<string, unknown>[]} */ (snap.settlements) : [];
  const orderedIds = items.map((it) => String(asObject(it).id)).sort(compareCodepoint);
  const itemById = new Map(items.map((it) => [String(asObject(it).id), asObject(it)]));

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  settlementUpdates.forEach((u, i) => updateIndex.set(String(asObject(u).saveId), i));
  /** @param {string} id @returns {Record<string, unknown>|undefined} */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) return asObject(settlementUpdates[ui]).settlement ? asObject(asObject(settlementUpdates[ui]).settlement) : undefined;
    const it = itemById.get(String(id));
    return it && it.settlement ? asObject(it.settlement) : undefined;
  };

  const priorLedger = asObject(getSpatialLedger(worldState, 'commonsVoice'));
  const exposedLedger = asObject(getSpatialLedger(worldState, 'exposedCorruption'));

  /** @type {Record<string, Record<string, unknown>>} */
  const nextLedger = {};
  /** @type {Map<string, number>} */
  const legitimacyHits = new Map();
  /** @type {Array<{ sid: string, id: string, delta: number }>} */
  const unrestBumps = [];
  /** @type {Record<string, unknown>[]} */
  const newsEntries = [];

  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s) { // preserve any prior entry we cannot re-evaluate (defensive; no live settlement)
      const carried = asObject(priorLedger[sid]);
      if (carried && Number.isFinite(Number(carried.rung))) nextLedger[sid] = carried;
      continue;
    }
    const legit = legitimacyScoreOf(s);
    const legitDeficit = Number.isFinite(legit) ? clamp01((CV.LEGIT_FLOOR - legit) / CV.LEGIT_FLOOR) : 0;
    const unrest = topUnrestStressor(s);
    const corr = corruptionSignalOf(sid, s, exposedLedger);
    const grievance = clamp01(
      CV.W_LEGIT * legitDeficit + CV.W_CORRUPT * (corr.signal ? 1 : 0) + CV.W_UNREST * (unrest ? unrest.severity : 0),
    );

    const target = grievance >= CV.RUNG_RIOT ? 3 : grievance >= CV.RUNG_GATHERING ? 2 : grievance >= CV.RUNG_PETITION ? 1 : 0;
    const prior = asObject(priorLedger[sid]);
    const curRung = Number.isFinite(Number(prior.rung)) ? Math.max(0, Math.min(3, Math.floor(Number(prior.rung)))) : 0;
    const since = Number.isFinite(Number(prior.since)) ? Math.floor(Number(prior.since)) : now2;

    // Escalate by at most one step once DWELL_TICKS of sustained higher pressure elapse;
    // de-escalate by one step immediately when the grievance eases (relief quiets faster
    // than it inflames). A rung that reaches 0 is dropped (drop-when-empty ⇒ dormant).
    let nextRung = curRung;
    if (target > curRung) {
      if (now2 - since >= CV.DWELL_TICKS || curRung === 0) nextRung = curRung + 1;
    } else if (target < curRung) {
      nextRung = curRung - 1;
    }
    nextRung = Math.max(0, Math.min(3, nextRung));

    const grievanceWord = corr.signal ? 'the corruption in the seat' : 'the seat\'s misrule';
    if (nextRung > 0) {
      /** @type {Record<string, unknown>} */
      const rec = { rung: nextRung, since: nextRung !== curRung ? now2 : since, grievance: round4(grievance), kind: corr.signal ? 'corruption' : 'misrule' };
      if (corr.accusedNid) rec.accusedNid = corr.accusedNid;
      nextLedger[sid] = rec;
    }

    if (nextRung > curRung) {
      // ESCALATION step: one-time legitimacy cost via the applicator, + a bounded unrest raise
      // on entering the riot rung (through the stressor writer). Beat announces the new rung.
      const dip = CV.LEGIT_DIP[nextRung] || 0;
      if (dip) legitimacyHits.set(sid, (legitimacyHits.get(sid) || 0) - dip);
      if (nextRung === 3 && unrest) unrestBumps.push({ sid, id: unrest.id, delta: CV.RIOT_UNREST_STEP });
      const townName = typeof asObject(s).name === 'string' ? String(asObject(s).name) : String(sid);
      newsEntries.push(commonsBeat({
        sid, rung: nextRung,
        headline: headlineFor(townName, nextRung, grievanceWord),
        summary: summaryFor(nextRung, grievanceWord), tick: now2, now: nowIso,
      }));
    }
    // De-escalation / dissolution is SILENT (the crowd quietly disperses as the grievance eases);
    // the ledger drop and the recovered legitimacy are the record, not a news beat.
  }

  // Apply the accumulated consequences through the existing writers.
  let nextUpdates = applyLegitimacySteps(settlementUpdates, updateIndex, legitimacyHits);
  if (unrestBumps.length) {
    if (nextUpdates === settlementUpdates) nextUpdates = settlementUpdates.slice();
    for (const b of unrestBumps) {
      const ui = updateIndex.get(String(b.sid));
      if (ui === undefined) continue;
      const entry = asObject(nextUpdates[ui]);
      const settlement = asObject(entry.settlement);
      const { stressors, changed } = adjustStressorSeverityById(
        Array.isArray(settlement.stressors) ? settlement.stressors : [], b.id, b.delta, { now: nowIso || undefined },
      );
      if (changed) nextUpdates[ui] = { ...entry, settlement: { ...settlement, stressors } };
    }
  }

  const ledgerKeys = Object.keys(nextLedger).sort(compareCodepoint);
  /** @type {Record<string, Record<string, unknown>>} */
  const sortedLedger = {};
  for (const k of ledgerKeys) sortedLedger[k] = nextLedger[k];
  // NO-OP GUARD (the npcLadder serialize-compare idiom): a settlement parked at a stable rung
  // (a standing grievance that re-evaluates identically) yields a byte-IDENTICAL ledger every
  // tick. Only rewrite worldState (a fresh reference) — and only report `changed` — when the
  // serialized ledger actually differs from the prior. Without this a quiet-but-aggrieved layer
  // churns worldState and forces a spurious pulse `changed` on every tick a grievance stands,
  // defeating no-op detection (it never reaches a fixed point, unlike its drop-when-empty path).
  const prevSerialized = JSON.stringify(Object.keys(priorLedger).length ? priorLedger : null);
  const nextSerialized = JSON.stringify(ledgerKeys.length ? sortedLedger : null);
  let nextWorldState = worldState;
  let ledgerChanged = false;
  if (prevSerialized !== nextSerialized) {
    nextWorldState = ledgerKeys.length
      ? setSpatialLedger(worldState, 'commonsVoice', sortedLedger)
      : dropSpatialLedger(worldState, 'commonsVoice');
    ledgerChanged = true;
  }
  const changed = newsEntries.length > 0 || nextUpdates !== settlementUpdates || ledgerChanged;
  return { changed, worldState: nextWorldState, settlementUpdates: nextUpdates, newsEntries };
}
