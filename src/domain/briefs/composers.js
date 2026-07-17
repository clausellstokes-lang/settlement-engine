/**
 * domain/briefs/composers.js — the S2 BRIEF COMPOSERS (DESIGN_AI_CONTROL_SURFACE §2
 * stage 2): pure read-model bundles, fully testable WITHOUT AI.
 *
 * Each composer draws on the W-R2 read-model ingredients — hegemonyRead,
 * warCausalBrief, politicsRead, credibilityRead, settlementRumors — and the public
 * projection (toPublicSafe), and returns a sourced {@link Brief} bundle. The AI prose
 * layer (S1/S3) grounds on these bundles under the same citation law; the bundle
 * stands on its own with zero AI.
 *
 * THE AUDIENCE RULE IS STRUCTURAL. A `player` composer calls every ingredient with
 * includeGroundTruth:false / includeCovert:false and projects settlements through
 * toPublicSafe, so it can only ever emit player-safe sources. assembleBrief() fails
 * closed if a player bundle is handed a non-player-safe source.
 *
 * Every composer is PURE + INERT-NOT-CRASH: a dormant world yields empty sections
 * (dropped) so a quiet realm produces an empty bundle rather than throwing.
 */

import { hegemonyRead } from '../display/hegemonyRead.js';
import { settlementBlocs, realmPolitics } from '../display/politicsRead.js';
import { settlementCredibility, realmCredibility } from '../display/credibilityRead.js';
import { settlementRumors } from '../display/settlementRumors.js';
import { warCausalBrief } from '../worldPulse/peaceReasons.js';
import { toPublicSafe } from '../display/publicSafe.js';
import { tonightAtTheTable } from '../summary/tonightAtTheTable.js';
import { collectPlotHooks } from '../dossier/plotHooks.js';
import { SOURCE, section, assembleBrief } from './citations.js';

// ── shared helpers ───────────────────────────────────────────────────────────

/**
 * A `(id) => name` resolver built from a settlements list (full or {id,name}).
 * @param {Array<{id?: unknown, name?: unknown, settlement?: {id?: unknown, name?: unknown}}>|null|undefined} settlements
 * @returns {(id: unknown) => string}
 */
function nameResolver(settlements) {
  /** @type {Map<string, string>} */
  const byId = new Map();
  for (const s of Array.isArray(settlements) ? settlements : []) {
    if (!s) continue;
    const id = s.id ?? s.settlement?.id;
    const name = s.name ?? s.settlement?.name;
    if (id != null) byId.set(String(id), name != null ? String(name) : String(id));
  }
  return (/** @type {unknown} */ id) => byId.get(String(id)) || String(id);
}

/** @param {Record<string, unknown>|null|undefined} settlement @returns {string} */
function settlementIdOf(settlement) {
  return settlement && settlement.id != null ? String(settlement.id) : '';
}

/**
 * The active directed war pairs, derived from the one-army deployment ledger exactly
 * as advancePeaceReasons does (attacker→targetId, both directions). Dormant-safe:
 * no deployments ⇒ []. Ordered by codepoint for determinism.
 * @param {Record<string, unknown>|null|undefined} worldState
 * @returns {Array<{ partyId: string, foeId: string }>}
 */
export function activeWarPairs(worldState) {
  const deployments = worldState && typeof worldState.deployments === 'object' && worldState.deployments
    ? /** @type {Record<string, { targetId?: unknown }>} */ (worldState.deployments)
    : {};
  const seen = new Map();
  for (const attackerId of Object.keys(deployments).sort()) {
    const targetId = deployments[attackerId]?.targetId != null ? String(deployments[attackerId].targetId) : '';
    if (!targetId) continue;
    const a = String(attackerId);
    const k1 = `${a}␟${targetId}`;
    const k2 = `${targetId}␟${a}`;
    if (!seen.has(k1)) seen.set(k1, { partyId: a, foeId: targetId });
    if (!seen.has(k2)) seen.set(k2, { partyId: targetId, foeId: a });
  }
  return [...seen.values()];
}

// ── settlement brief (DM) ─────────────────────────────────────────────────────

/**
 * The DM settlement brief: the table-night leverage read (NPCs / hooks / twists /
 * red flags), the local blocs + conspiracies, the credibility band, and the rumor
 * ledger WITH ground truth (so the DM sees the divergence).
 * @param {{ settlement?: Record<string, unknown>|null, worldState?: Record<string, unknown>|null, tick?: number }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function settlementBrief({ settlement, worldState = null, tick = 0 } = {}) {
  const sid = settlementIdOf(settlement);
  const table = tonightAtTheTable(settlement);
  const blocs = settlementBlocs({ worldState, settlementId: sid, includeCovert: true });
  const blocArr = (blocs && Array.isArray(blocs.blocs)) ? blocs.blocs : [];
  const cred = settlementCredibility({ worldState, settlementId: sid, tick, includeGroundTruth: false });
  const rumors = settlementRumors({ worldState, settlementId: sid, includeGroundTruth: true });

  return assembleBrief({
    kind: 'settlement',
    audience: 'dm',
    sections: [
      section('table', 'At the table', SOURCE.NPC_TABLE, table),
      blocArr.length
        ? section('blocs', 'Factions & conspiracies', SOURCE.POLITICS_COVERT, blocArr)
        : null,
      cred ? section('credibility', 'Standing', SOURCE.CREDIBILITY, [cred]) : null,
      section('rumors', 'What they say (vs. what is)', SOURCE.RUMORS_TRUTH, rumors),
    ],
  });
}

// ── player-safe brief (player) ─────────────────────────────────────────────────

/**
 * The PLAYER-SAFE brief: consumes ONLY the public projection. Every section derives
 * from a player-safe read; the settlement section IS exactly toPublicSafe(settlement),
 * asserted structurally by the pin. Audience 'player' — assembleBrief fails closed on
 * any non-player-safe source.
 * @param {{ settlement?: Record<string, unknown>|null, worldState?: Record<string, unknown>|null, tick?: number }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function playerSafeBrief({ settlement, worldState = null, tick = 0 } = {}) {
  const sid = settlementIdOf(settlement);
  const publicProjection = toPublicSafe(settlement, { full: false });
  const blocs = settlementBlocs({ worldState, settlementId: sid, includeCovert: false, includeGroundTruth: false });
  const blocArr = (blocs && Array.isArray(blocs.blocs)) ? blocs.blocs : [];
  const cred = settlementCredibility({ worldState, settlementId: sid, tick, includeGroundTruth: false });
  const rumors = settlementRumors({ worldState, settlementId: sid, includeGroundTruth: false });

  const hasPublic = publicProjection && Object.keys(publicProjection).length > 0;
  return assembleBrief({
    kind: 'playerSafe',
    audience: 'player',
    sections: [
      hasPublic
        ? section('settlement', 'The settlement', SOURCE.SETTLEMENT_PUBLIC, [{ public: publicProjection }])
        : null,
      blocArr.length
        ? section('blocs', 'Visible factions', SOURCE.POLITICS_PUBLIC, blocArr)
        : null,
      cred ? section('credibility', 'Reputation', SOURCE.CREDIBILITY, [cred]) : null,
      section('rumors', 'Word on the street', SOURCE.RUMORS_PUBLIC, rumors),
    ],
  });
}

// ── faction brief (DM or player) ───────────────────────────────────────────────

/**
 * The faction brief: hegemonic spheres (the unnamed empire) + the realm's visible
 * blocs. Hegemony is an observable read (spheres derive from public treaty terms), so
 * it is player-safe at includeGroundTruth:false; the player audience additionally
 * hides covert conspiracies.
 * @param {{ worldState?: Record<string, unknown>|null,settlements?: Array<Record<string, unknown>>, audience?: 'dm'|'player' }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function factionBrief({ worldState = null, settlements = [], audience = 'dm' } = {}) {
  const nameFor = nameResolver(settlements);
  const heg = hegemonyRead({ worldState, settlements, nameFor, includeGroundTruth: false });
  const dm = audience === 'dm';
  const politics = realmPolitics({ worldState, includeCovert: dm, nameFor });

  return assembleBrief({
    kind: 'faction',
    audience,
    sections: [
      heg.spheres.length ? section('spheres', 'Spheres of influence', SOURCE.HEGEMONY, heg.spheres) : null,
      politics.length
        ? section('blocs', 'Political blocs', dm ? SOURCE.POLITICS_COVERT : SOURCE.POLITICS_PUBLIC, politics)
        : null,
    ],
  });
}

// ── regional brief (DM) ────────────────────────────────────────────────────────

/**
 * The regional brief: spheres, the war-causal motive read for every active war pair
 * (why the war, whether the peace is fraying), and the realm credibility standings.
 * @param {{ worldState?: Record<string, unknown>|null,settlements?: Array<Record<string, unknown>>, tick?: number }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function regionalBrief({ worldState = null, settlements = [], tick = 0 } = {}) {
  const nameFor = nameResolver(settlements);
  const heg = hegemonyRead({ worldState, settlements, nameFor, includeGroundTruth: false });
  const cred = realmCredibility({ worldState, tick, nameFor });
  const wars = activeWarPairs(worldState).map(({ partyId, foeId }) => {
    const brief = warCausalBrief(worldState, partyId, foeId);
    return {
      party: nameFor(partyId),
      foe: nameFor(foeId),
      line: brief.line,
      treatyLine: brief.treatyLine,
      warPresent: brief.warPresent,
      peacePresent: brief.peacePresent,
    };
  });

  return assembleBrief({
    kind: 'regional',
    audience: 'dm',
    sections: [
      heg.spheres.length ? section('spheres', 'Spheres of influence', SOURCE.HEGEMONY, heg.spheres) : null,
      wars.length ? section('wars', 'Wars & fraying peace', SOURCE.WAR_CAUSAL, wars) : null,
      cred.length ? section('credibility', 'Standings', SOURCE.CREDIBILITY, cred) : null,
    ],
  });
}

// ── weekly digest (DM) ─────────────────────────────────────────────────────────

/**
 * The weekly digest: a realm-wide roundup folding the faction + regional reads into a
 * single at-a-glance bundle — spheres, blocs, wars, standings.
 * @param {{ worldState?: Record<string, unknown>|null,settlements?: Array<Record<string, unknown>>, tick?: number }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function weeklyDigest({ worldState = null, settlements = [], tick = 0 } = {}) {
  const nameFor = nameResolver(settlements);
  const heg = hegemonyRead({ worldState, settlements, nameFor, includeGroundTruth: false });
  const politics = realmPolitics({ worldState, includeCovert: true, nameFor });
  const cred = realmCredibility({ worldState, tick, nameFor });
  const wars = activeWarPairs(worldState).map(({ partyId, foeId }) => {
    const b = warCausalBrief(worldState, partyId, foeId);
    return { party: nameFor(partyId), foe: nameFor(foeId), line: b.line, treatyLine: b.treatyLine };
  });

  return assembleBrief({
    kind: 'weekly',
    audience: 'dm',
    sections: [
      heg.spheres.length ? section('spheres', 'Spheres this week', SOURCE.HEGEMONY, heg.spheres) : null,
      politics.length ? section('blocs', 'Blocs & conspiracies', SOURCE.POLITICS_COVERT, politics) : null,
      wars.length ? section('wars', 'The wars', SOURCE.WAR_CAUSAL, wars) : null,
      cred.length ? section('credibility', 'Standings', SOURCE.CREDIBILITY, cred) : null,
    ],
  });
}

// ── session prep (DM, settlement-scoped) ───────────────────────────────────────

/**
 * Session prep: the settlement's table leverage, its open plot-hook threads, and the
 * local rumor divergence — the "what to run tonight" bundle.
 * @param {{ settlement?: Record<string, unknown>|null, worldState?: Record<string, unknown>|null, tick?: number }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function sessionPrep({ settlement, worldState = null } = {}) {
  const sid = settlementIdOf(settlement);
  const table = tonightAtTheTable(settlement);
  const hooks = collectPlotHooks(/** @type {import('../dossier/plotHooks.js').PlotHookSettlement} */ (settlement || {}));
  const rumors = settlementRumors({ worldState, settlementId: sid, includeGroundTruth: true });

  return assembleBrief({
    kind: 'sessionPrep',
    audience: 'dm',
    sections: [
      section('table', 'Run this', SOURCE.NPC_TABLE, table),
      hooks.length ? section('threads', 'Open threads', SOURCE.PLOT_HOOKS, hooks) : null,
      section('rumors', 'The divergence', SOURCE.RUMORS_TRUTH, rumors),
    ],
  });
}

// ── dramatic-irony brief (DM) ──────────────────────────────────────────────────

/**
 * The dramatic-irony brief: the gap between what players believe and the truth. For
 * the settlement it contrasts the public rumor/politics/credibility reads against the
 * ground-truth reads and surfaces every divergence. DM-only by nature (it names the
 * truth players do not have).
 * @param {{ settlement?: Record<string, unknown>|null, worldState?: Record<string, unknown>|null, tick?: number }} ctx
 * @returns {import('./citations.js').Brief}
 */
export function dramaticIronyBrief({ settlement, worldState = null } = {}) {
  const sid = settlementIdOf(settlement);
  const covert = settlementBlocs({ worldState, settlementId: sid, includeCovert: true });
  const publicBlocs = settlementBlocs({ worldState, settlementId: sid, includeCovert: false });
  const ironies = [];

  // Hidden conspiracies the players cannot see.
  const publicCount = Number(publicBlocs?.blocCount) || 0;
  const conspiracyCount = Number(covert?.conspiracyCount) || 0;
  if (conspiracyCount > 0) {
    ironies.push({
      kind: 'conspiracy',
      detail: `${conspiracyCount} conspirac${conspiracyCount === 1 ? 'y' : 'ies'} move behind ${publicCount} visible bloc${publicCount === 1 ? '' : 's'}.`,
    });
  }

  // Rumors the town believes that the ground truth contradicts.
  const rumorsTruth = settlementRumors({ worldState, settlementId: sid, includeGroundTruth: true });
  for (const r of rumorsTruth) {
    if (r && r.truth != null && r.belief != null && r.truth !== r.belief) {
      ironies.push({ kind: 'rumor', believed: r.belief, truth: r.truth, subject: r.subject ?? null });
    }
  }

  return assembleBrief({
    kind: 'dramaticIrony',
    audience: 'dm',
    sections: [
      ironies.length ? section('irony', 'What they don\'t know', SOURCE.DRAMATIC_IRONY, ironies) : null,
    ],
  });
}
