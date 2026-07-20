/**
 * domain/worldPulse/assizeKernel.js — V-22 THE ASSIZE (Vision lane V-K).
 *
 * FIRST-PAINT LAW: a LAZY worldPulse leaf (no store/React import, no clock, no rng).
 * Reached only inside the pulse tick, behind the VIRTUAL assizeEnabled flag.
 *
 * WHAT THIS SLICE OWNS: a deterministic ASSIZE PASS that turns the EXISTING exposure
 * deposits — a fresh corruption exposure (the exposedCorruption ledger) and a fresh
 * lie/contradicted-bluff exposure (npcCredibility[nid].lieExposure; a contradicted bluff is
 * already routed through the lie machinery) — into a SEATED PUBLIC JUDGMENT. Pre-modern
 * justice was a public social event: the assize was theatre, legitimacy ritual, and crowd
 * politics at once. The DM gets a courtroom scene grounded in real causes.
 *
 * THE COHESION LAW (binding): this pass INVENTS NO WRITER. Every consequence routes through
 * an existing writer:
 *   • STIGMA — the ladder ALREADY mints stigma from these very exposures (npcLadderState
 *     maintainMarks, one tick later). The assize does NOT re-mint it (that would double-charge
 *     the ladder's own mark); the person's reputation hit IS the ladder's stigma, which the
 *     public verdict simply publicises (JUDGMENT, vetoable — see the lane report).
 *   • FINE — a JUST corruption verdict levies a reparation OBLIGATION (patron → the exposed
 *     settlement) through the generosity ledger's own writer, foldObligations.
 *   • RANK PRESSURE — a JUST verdict of an out-faction figure raises resentment on the
 *     (governing ↔ convict) faction pair through factionPairLedger's own mintFactionPairIncident,
 *     which the ladder's challenge engine already reads as an attempt-rate bias.
 *   • THE MASSES — a JUST judgment of a hated figure RELIEVES unrest (adjustStressorSeverityById,
 *     the stressor machinery's writer) and LIFTS legitimacy (the publicLegitimacy applicator
 *     idiom); a SHAM (a captured court judging its own) RAISES unrest, TAXES legitimacy, and
 *     writes the belief plane organically (the sham verdict beat enters the rumor net — the
 *     crowd SAW). Sustained injustice feeds the migration-push and coup-window inputs THAT
 *     ALREADY EXIST for free: coupSpawnGate + governmentChallenge read legitimacy; flight reads
 *     the unrest stressor. NO-DEATH holds absolutely: a judgment is a STANDING outcome, never a
 *     fate; the condemned remain citizens.
 *
 * CONSUME-ONCE: each exposure is judged at AGE ONE (tick === now − 1). A carried/decaying
 * exposedCorruption entry keeps its original exposure tick (corruptionWeb.js:928), and a
 * lieExposure deposit its deposit tick — so `=== now − 1` is true for EXACTLY the one tick
 * after the exposure event, and a re-exposure (tick re-stamped) earns a fresh trial. The reads
 * are NON-DESTRUCTIVE: the assize never drains those ledgers (war-reasons + the ladder's stigma
 * + the covert-diffusion beat all still read them); consume-once is the freshness gate, not a
 * drain — the correct shape for a shared decaying stock (the exposedCorruptionForPair / lieExposure
 * precedent). No new spatialLedgers key is written.
 *
 * THE DORMANCY GATE (constitutional): behind the VIRTUAL assizeEnabled flag, ABSENT from
 * DEFAULT_SIMULATION_RULES. Dark ⇒ a complete no-op (zero verdict, zero delta, zero news) —
 * the assize dormancy golden proves byte-identity to pre-wire. NO rng.
 */
import {
  num, asObject, compareCodepoint, round4, npcInFaction, ladderFactionKey,
} from './npcLadderState.js';
import { clamp01 } from './relationshipState.js';
import { getSpatialLedger, setSpatialLedger } from '../spatial/distanceRead.js';
import { adjustStressorSeverityById } from './stressors.js';
import { foldObligations } from '../spatial/generosityReactions.js';
import { mintFactionPairIncident } from './factionPairLedger.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { institutionIsLawOrder } from '../institutionClassify.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';
import { npcId } from './npcAgency.js';
import { advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads } from './roadsKernel.js';
import { advanceCommonsVoice } from './commonsVoiceKernel.js';

// ── THE DORMANCY GATE (constitutional law) — a virtual, defensively-read flag ──────────
/**
 * Is THE ASSIZE lit? Reads simulationRules.assizeEnabled === true, defensively — ABSENT ⇒
 * false ⇒ DORMANT ⇒ the mover is never entered (byte-identical; NO default in
 * DEFAULT_SIMULATION_RULES). Mirrors traditionsActive / roadsActive. Pure, total.
 * @param {{ simulationRules?: unknown }|null|undefined} worldState @returns {boolean}
 */
export function assizeActive(worldState) {
  const rules = worldState && typeof worldState === 'object' ? asObject(worldState).simulationRules : null;
  return !!(rules && typeof rules === 'object' && /** @type {Record<string, unknown>} */ (rules).assizeEnabled === true);
}

// ── Tuning (deterministic; no rng) ────────────────────────────────────────────────────
const AZ = Object.freeze({
  LEGIT_JUST: 2,             // legitimacy lift from a just verdict of a hated figure
  LEGIT_SHAM: 2,             // legitimacy tax from a sham
  RELIEF_JUST: 0.12,         // unrest relief (severity down) from a just verdict
  UNREST_SHAM: 0.12,         // unrest raise (severity up) from a sham
  FINE_MAGNITUDE: 0.20,      // reparation obligation magnitude on a just corruption verdict
  RANK_RESENTMENT: 0.15,     // faction-pair resentment on a just out-faction conviction
  COUPLE_LEGIT: 1,           // extra legitimacy swing when a live commons grievance is answered
  COUPLE_UNREST: 0.06,       // extra unrest swing (relief/raise) when the commons is answered
});

/** @param {number} v @param {number} lo @param {number} hi @returns {number} */
function clampNum(v, lo, hi) { return Math.max(lo, Math.min(hi, Number(v) || 0)); }

/**
 * Apply signed publicLegitimacy.score deltas to updates (the applyLegitimacyHits idiom,
 * self-contained). Integer, clamped [0,100], skipping absent/legacy-bare legitimacy. Pure.
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

/** The highest-severity live UNREST stressor on a settlement (id), or null. */
const UNREST_TYPES = new Set(['rebellion', 'political_fracture', 'coup_detat', 'slave_revolt']);
/** @param {Record<string, unknown>} settlement @returns {string} */
function topUnrestStressorId(settlement) {
  const list = Array.isArray(asObject(settlement).stressors) ? /** @type {Record<string, unknown>[]} */ (asObject(settlement).stressors) : [];
  let best = null;
  for (const raw of list) {
    const s = asObject(raw);
    if (!UNREST_TYPES.has(String(s.type))) continue;
    const sev = clamp01(num(s.severity, 0));
    if (!best || sev > best.sev) best = { id: String(s.id), sev };
  }
  return best ? best.id : '';
}

/**
 * A captured court judges in bad faith. SHAM when the accused sits in the governing faction
 * (the court judges its own kin) OR the governing faction itself harbours a corrupt, un-ousted
 * member (a captured seat protecting its own). JUST otherwise. @param {Record<string, unknown>} settlement
 * @param {Record<string, unknown>|null} accusedNpc @returns {{ sham: boolean, governing: Record<string, unknown>|null }}
 */
function judgeCourt(settlement, accusedNpc) {
  const governing = governingFactionOf(/** @type {any} */ (settlement)) || null;
  if (!governing) return { sham: true, governing: null }; // no seat presides ⇒ no legitimate court
  // Canonical faction key (never hand-rolled — the faction-key defect-class cure): the
  // same builder npcInFaction is designed to match, shared with the ladder + religion reads.
  const fkey = ladderFactionKey(/** @type {any} */ (governing));
  if (accusedNpc && npcInFaction(accusedNpc, /** @type {any} */ (governing), fkey)) return { sham: true, governing };
  // Captured seat: a corrupt un-ousted NPC sitting in the governing faction.
  const npcs = Array.isArray(asObject(settlement).npcs) ? /** @type {Record<string, unknown>[]} */ (asObject(settlement).npcs) : [];
  for (const npc of npcs) {
    if (npc && npc.corrupt === true && npc.ousted !== true && npcInFaction(npc, /** @type {any} */ (governing), fkey)) {
      return { sham: true, governing };
    }
  }
  return { sham: false, governing };
}

/** Does the settlement hold a court/tribunal/magistrate (a law-order institution = the venue)? */
/** @param {Record<string, unknown>} settlement @returns {boolean} */
function hasJusticeVenue(settlement) {
  const insts = Array.isArray(asObject(settlement).institutions) ? /** @type {Record<string, unknown>[]} */ (asObject(settlement).institutions) : [];
  // Route through the canonical ruin-filter (institutionRoster): a calamity-ruined or
  // abandoned courthouse is no venue — only a STANDING law-order institution can seat a
  // judgment. Keeps the assize out of the ruin-filter defect class.
  return insts.some((inst) => isLiveInstitution(/** @type {any} */ (inst)) && institutionIsLawOrder(/** @type {any} */ (inst)));
}

/** @param {Record<string, unknown>} settlement @param {Record<string, unknown>} accused @param {Record<string, unknown>|null} governing @returns {string} */
function accusedFactionKeyDistinctFromGoverning(settlement, accused, governing) {
  const factions = Array.isArray(asObject(asObject(settlement).powerStructure).factions) ? /** @type {Record<string, unknown>[]} */ (asObject(asObject(settlement).powerStructure).factions) : [];
  const gname = governing ? nameOf(/** @type {any} */ (governing)) : '';
  for (const f of factions) {
    const fname = nameOf(/** @type {any} */ (f));
    const fkey = ladderFactionKey(/** @type {any} */ (f));
    if (npcInFaction(accused, /** @type {any} */ (f), fkey)) {
      if (fname && fname !== gname) return fname;
      return ''; // accused is in the governing faction (or unresolved) ⇒ no cross-faction pair
    }
  }
  return '';
}

/**
 * Build the seated-judgment beat (own in-register prose; deliberately unvoiced at the crier —
 * the ladder/roads/traditions precedent — newsVoiceCategory returns null via the
 * set-but-unclassified guard).
 * @param {{ sid: string, townName: string, accusedName: string, charge: string, sham: boolean, coupled: boolean, tick: number, now: string|null }} a
 * @returns {Record<string, unknown>}
 */
function assizeBeat({ sid, townName, accusedName, charge, sham, coupled, tick, now }) {
  const chargeWord = charge === 'corruption' ? 'corruption' : charge === 'perjury' ? 'a proven lie' : 'a false boast unmasked';
  const headline = sham
    ? `${townName}: the assize acquits its own over ${chargeWord}`
    : `${townName}: the assize passes judgement over ${chargeWord}`;
  const summary = sham
    ? `The seat convened its court over ${chargeWord} and cleared ${accusedName} — a captured bench judging its own. The square saw it plainly${coupled ? ', and the petition it was meant to answer curdles into fury' : ''}: the seat's word is worth less by nightfall.`
    : `The seat convened its court over ${chargeWord} and found against ${accusedName} in the open, before the crowd. Justice done in daylight${coupled ? ', answering the commons that demanded it,' : ''} steadies the town — the mark on ${accusedName} is now a public one.`;
  return {
    id: `wizard_news.${tick}.assize_verdict.${sid}.${sham ? 'sham' : 'just'}`,
    createdAt: now || null,
    tick,
    scope: 'local',
    significance: sham ? 'major' : 'notable',
    severity: sham ? 0.6 : 0.4,
    headline,
    summary,
    kind: 'applied',
    impactKind: 'assize_verdict',
    channelType: 'political_authority',
    settlementIds: [sid],
    tags: ['assize', sham ? 'assize_sham' : 'assize_just', charge],
  };
}

/**
 * THE ASSIZE mover. Dark ⇒ no-op. Lit ⇒ a deterministic public judgment of this tick's
 * age-one exposures, with all consequences through existing writers.
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>, settlementUpdates?: unknown, tick?: unknown, now?: unknown }} args
 * @returns {{ changed: boolean, worldState: Record<string, unknown>, settlementUpdates: Record<string, unknown>[], newsEntries: Record<string, unknown>[] }}
 */
export function advanceAssize(args) {
  const worldState = args.worldState;
  const updates = Array.isArray(args.settlementUpdates) ? /** @type {Record<string, unknown>[]} */ (args.settlementUpdates) : [];
  if (!assizeActive(worldState)) return { changed: false, worldState, settlementUpdates: updates, newsEntries: [] };
  return advanceLitAssize({ ...args, worldState, settlementUpdates: updates });
}

/**
 * @param {{ snapshot?: unknown, worldState: Record<string, unknown>, settlementUpdates: Record<string, unknown>[], tick?: unknown, now?: unknown }} args
 */
function advanceLitAssize({ snapshot, worldState, settlementUpdates, tick, now }) {
  const now2 = Math.max(0, Math.floor(num(tick, 0)));
  const age1 = now2 - 1;
  const nowIso = typeof now === 'string' ? now : null;
  const weeks = num(asObject(asObject(worldState).calendar).elapsedWeeks, now2);
  const snap = asObject(snapshot);
  const items = Array.isArray(snap.settlements) ? /** @type {Record<string, unknown>[]} */ (snap.settlements) : [];
  const orderedIds = items.map((it) => String(asObject(it).id)).sort(compareCodepoint);
  const itemById = new Map(items.map((it) => [String(asObject(it).id), asObject(it)]));
  const settlementIdSet = new Set(orderedIds);

  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  settlementUpdates.forEach((u, i) => updateIndex.set(String(asObject(u).saveId), i));
  /** @param {string} id @returns {Record<string, unknown>|undefined} */
  const freshSettlement = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui !== undefined) { const st = asObject(settlementUpdates[ui]).settlement; return st ? asObject(st) : undefined; }
    const it = itemById.get(String(id));
    return it && it.settlement ? asObject(it.settlement) : undefined;
  };

  const exposedLedger = asObject(getSpatialLedger(worldState, 'exposedCorruption'));
  const credLedger = asObject(getSpatialLedger(worldState, 'npcCredibility'));
  const commonsLedger = asObject(getSpatialLedger(worldState, 'commonsVoice'));

  /** @type {Map<string, number>} */
  const legitimacyHits = new Map();
  /** @type {Array<{ sid: string, id: string, delta: number }>} */
  const unrestBumps = [];
  /** @type {Array<{ from: string, to: string, kind: string, magnitude: number }>} */
  const obligationMints = [];
  /** @type {Array<{ a: string, b: string, resentmentDelta: number }>} */
  const rankIncidents = [];
  /** @type {Record<string, unknown>[]} */
  const newsEntries = [];

  const bump = (/** @type {Map<string, number>} */ m, /** @type {string} */ k, /** @type {number} */ d) => m.set(k, (m.get(k) || 0) + d);

  for (const sid of orderedIds) {
    const s = freshSettlement(sid);
    if (!s || !hasJusticeVenue(s)) continue; // no venue ⇒ no assize (the interiors' judges⇒chamber gate)
    const townName = typeof asObject(s).name === 'string' ? String(asObject(s).name) : String(sid);
    const npcs = Array.isArray(asObject(s).npcs) ? /** @type {Record<string, unknown>[]} */ (asObject(s).npcs) : [];

    // ── Assemble this tick's age-one CHARGES for this settlement (deduped by accused). ──
    /** @type {Map<string, { accused: Record<string, unknown>|null, accusedName: string, charge: string, patron: string }>} */
    const charges = new Map();

    // (1) CORRUPTION — a fresh exposedCorruption entry (corrupted === sid), age one.
    const corrPrefix = `${sid}>`;
    let corruptionFresh = false; let corruptionPatron = '';
    for (const key of Object.keys(exposedLedger).sort(compareCodepoint)) {
      if (!key.startsWith(corrPrefix)) continue;
      const rec = asObject(exposedLedger[key]);
      if (Math.floor(num(rec.tick, -1)) !== age1) continue;
      corruptionFresh = true;
      corruptionPatron = key.slice(corrPrefix.length);
      break;
    }
    if (corruptionFresh) {
      // Accused = the codepoint-lowest corrupt, un-ousted, exposed roster member.
      let accused = null; let accusedNid = '';
      for (const npc of npcs) {
        if (npc && npc.corrupt === true && npc.ousted !== true && num(npc.timesExposed, 0) > 0) {
          const nid = typeof npc.id === 'string' ? npc.id : (npc.id != null ? String(npc.id) : '');
          if (nid && (!accusedNid || nid < accusedNid)) { accusedNid = nid; accused = npc; }
        }
      }
      const accusedName = accused ? String(asObject(accused).name || accusedNid) : `${townName}'s exposed patronage`;
      charges.set(`corruption:${accusedNid || sid}`, { accused, accusedName, charge: 'corruption', patron: corruptionPatron });
    }

    // (2) PERJURY / FALSE BOAST — a fresh lieExposure deposit on a roster NPC, age one.
    npcs.forEach((npc, index) => {
      const nid = npcId(sid, npc, index);
      const dep = asObject(asObject(credLedger[nid]).lieExposure);
      if (!('tick' in dep)) return;
      if (Math.floor(num(dep.tick, -1)) !== age1) return;
      const accusedName = String(asObject(npc).name || nid);
      // A contradicted bluff and a proven lie both arrive through lieExposure; distinguish only
      // in the charge word by whether the NPC ever fronted a bluff is not tracked here — call it
      // perjury (a proven lie) uniformly; the beat's own prose carries the register.
      charges.set(`perjury:${nid}`, { accused: npc, accusedName, charge: 'perjury', patron: '' });
    });

    if (!charges.size) continue;

    // ── Adjudicate each charge (codepoint-ordered for determinism). ──
    const liveCommons = asObject(commonsLedger[sid]);
    const commonsActive = Number.isFinite(Number(liveCommons.rung)) && Number(liveCommons.rung) >= 1;
    const unrestId = topUnrestStressorId(s);

    for (const ckey of [...charges.keys()].sort(compareCodepoint)) {
      const c = /** @type {{ accused: Record<string, unknown>|null, accusedName: string, charge: string, patron: string }} */ (charges.get(ckey));
      const { sham, governing } = judgeCourt(s, c.accused);
      // The coupling: a live commons grievance NAMING this accused (or a corruption grievance
      // against any corrupt figure) is ANSWERED by this verdict.
      const namedAccused = typeof liveCommons.accusedNid === 'string' ? String(liveCommons.accusedNid) : '';
      const accusedNid = c.accused ? (typeof asObject(c.accused).id === 'string' ? String(asObject(c.accused).id) : '') : '';
      const coupled = commonsActive && (
        (!!namedAccused && !!accusedNid && namedAccused === accusedNid) ||
        (String(liveCommons.kind) === 'corruption' && c.charge === 'corruption')
      );

      newsEntries.push(assizeBeat({ sid, townName, accusedName: c.accusedName, charge: c.charge, sham, coupled, tick: now2, now: nowIso }));

      // ── THE MASSES ──
      const coupleLegit = coupled ? AZ.COUPLE_LEGIT : 0;
      const coupleUnrest = coupled ? AZ.COUPLE_UNREST : 0;
      if (sham) {
        bump(legitimacyHits, sid, -(AZ.LEGIT_SHAM + coupleLegit));
        if (unrestId) unrestBumps.push({ sid, id: unrestId, delta: AZ.UNREST_SHAM + coupleUnrest });
      } else {
        bump(legitimacyHits, sid, AZ.LEGIT_JUST + coupleLegit);
        if (unrestId) unrestBumps.push({ sid, id: unrestId, delta: -(AZ.RELIEF_JUST + coupleUnrest) });
      }

      if (!sham) {
        // ── PERSON: fine (corruption reparation) + rank pressure (out-faction conviction). ──
        if (c.charge === 'corruption' && c.patron && settlementIdSet.has(c.patron)) {
          obligationMints.push({ from: c.patron, to: sid, kind: 'assize_reparation', magnitude: AZ.FINE_MAGNITUDE });
        }
        if (c.accused && governing) {
          const convictFaction = accusedFactionKeyDistinctFromGoverning(s, c.accused, governing);
          const gname = nameOf(/** @type {any} */ (governing));
          if (convictFaction && gname) rankIncidents.push({ a: gname, b: convictFaction, resentmentDelta: AZ.RANK_RESENTMENT });
        }
      }
    }
  }

  // ── Apply accumulated consequences through the existing writers. ──
  let nextWorldState = worldState;
  let nextUpdates = applyLegitimacySteps(settlementUpdates, updateIndex, legitimacyHits);

  if (unrestBumps.length) {
    if (nextUpdates === settlementUpdates) nextUpdates = settlementUpdates.slice();
    for (const b of unrestBumps) {
      const ui = updateIndex.get(String(b.sid));
      if (ui === undefined) continue;
      const entry = asObject(nextUpdates[ui]);
      const settlement = asObject(entry.settlement);
      const { stressors, changed } = adjustStressorSeverityById(
        /** @type {any[]} */ (Array.isArray(settlement.stressors) ? settlement.stressors : []), b.id, b.delta, { now: nowIso || undefined },
      );
      if (changed) nextUpdates[ui] = { ...entry, settlement: { ...settlement, stressors } };
    }
  }

  if (obligationMints.length) {
    // Fold reparation obligations through the generosity ledger's OWN writer. decayPerTick:0 —
    // the generosity mover already decayed the ledger THIS tick; the assize only upserts.
    const prev = getSpatialLedger(nextWorldState, 'obligations');
    const mints = obligationMints.map((m) => ({ from: m.from, to: m.to, kind: m.kind, magnitude: round4(clamp01(m.magnitude)), mintTick: now2, lastTick: now2 }));
    const nextObl = foldObligations(/** @type {any} */ (prev), { mints, repayments: [], now: now2, decayPerTick: 0 });
    if (nextObl) nextWorldState = setSpatialLedger(nextWorldState, 'obligations', nextObl);
  }

  if (rankIncidents.length) {
    for (const r of rankIncidents) {
      nextWorldState = mintFactionPairIncident(nextWorldState, { a: r.a, b: r.b, type: 'assize_conviction', resentmentDelta: r.resentmentDelta, sev: 0.3, tick: now2, weeks });
    }
  }

  const changed = newsEntries.length > 0 || nextUpdates !== settlementUpdates || nextWorldState !== worldState;
  return { changed, worldState: nextWorldState, settlementUpdates: nextUpdates, newsEntries };
}

// ── THE PULSE SEAM — the roads chain composed with the commons + assize movers ─────────
/**
 * The growth+fabric+consequence+ladder+traditions+roads chain composed with V-23 THE COMMONS'
 * VOICE and then V-22 THE ASSIZE (both LAST, over the fully-settled tick). pulseKernel calls
 * THIS in place of advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads (a
 * name swap — the frozen pulseKernel changes by name only, the roads-onto-traditions idiom).
 * Commons runs first so a fresh petition is on the ledger for the assize to answer THIS tick;
 * both dark ⇒ exact no-ops inside the composition. No cycle: this leaf imports the roads +
 * commons kernels; neither imports back.
 * @param {Parameters<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads>[0]} args
 * @returns {ReturnType<typeof advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads>}
 */
export function advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize(args) {
  const prior = advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads(args);
  const a = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (args));
  const snapshot = a.snapshot;
  const tick = a.tick;
  const now = a.now;
  // V-23 THE COMMONS' VOICE — first, so the petition it deposits is answerable THIS tick.
  const commons = advanceCommonsVoice({
    snapshot, worldState: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (prior.worldState)),
    settlementUpdates: /** @type {Record<string, unknown>[]} */ (/** @type {unknown} */ (prior.settlementUpdates)), tick, now,
  });
  const afterCommons = commons.changed
    ? {
      worldState: /** @type {typeof prior.worldState} */ (/** @type {unknown} */ (commons.worldState)),
      settlementUpdates: /** @type {typeof prior.settlementUpdates} */ (/** @type {unknown} */ (commons.settlementUpdates)),
      changed: prior.changed || commons.changed,
      newsEntries: [...prior.newsEntries, ...(/** @type {typeof prior.newsEntries} */ (/** @type {unknown} */ (commons.newsEntries)))],
    }
    : prior;
  // V-22 THE ASSIZE — second, consuming this tick's age-one exposures and answering a live petition.
  const assize = advanceAssize({
    snapshot, worldState: /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (afterCommons.worldState)),
    settlementUpdates: /** @type {Record<string, unknown>[]} */ (/** @type {unknown} */ (afterCommons.settlementUpdates)), tick, now,
  });
  if (!assize.changed) return afterCommons;
  return {
    worldState: /** @type {typeof prior.worldState} */ (/** @type {unknown} */ (assize.worldState)),
    settlementUpdates: /** @type {typeof prior.settlementUpdates} */ (/** @type {unknown} */ (assize.settlementUpdates)),
    changed: afterCommons.changed || assize.changed,
    newsEntries: [...afterCommons.newsEntries, ...(/** @type {typeof prior.newsEntries} */ (/** @type {unknown} */ (assize.newsEntries)))],
  };
}
