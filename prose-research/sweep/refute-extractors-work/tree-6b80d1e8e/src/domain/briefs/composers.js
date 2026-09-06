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
import { plantIsExposed, projectPlants } from '../worldPulse/brokerageServicesPlant.js';
import { seatBeliefRecord } from '../worldPulse/disinformationPlant.js';
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
 * IN-0a — STORIES STANDING AGAINST THIS TOWN. The COMMISSIONED lies (the `plant:*` half of
 * the disinfo ledger, disjoint from a court's own `lie:*` bluffs) that either name this
 * town as their subject or were placed in its court, projected for ONE named audience.
 *
 * A DM asking "what lies are standing about my town?" should find the answer on the town
 * page, which is where they would look — and the same read, asked as a player, must come
 * back EMPTY while the lies are live, because a row saying "this belief was bought" hands
 * the table the answer to the mystery the plant IS.
 *
 * THE AUDIENCE IS PASSED EXPLICITLY, ALWAYS. `projectPlants` defaults `audience` to 'dm'
 * and returns records unchanged on that path — fail-OPEN (J-INF-17, a recorded and
 * deliberately un-flipped default on a built export). Every call site therefore names its
 * audience, and a source scan pins that it does.
 *
 * Exposure is read through the plant's OWN predicate against the mark's ACTUAL belief:
 * `plantIsExposed` compares the asserted band to the audience's current reckoning, and
 * handing it no belief would make it fall back to the record's true band — which is two
 * bands from the asserted one by construction, i.e. it would call EVERY live plant exposed
 * and leak all of them to players. The belief is not optional here; it is the guard.
 *
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string} settlementId
 * @param {'dm'|'player'} audience
 * @param {number} tick
 * @returns {ReadonlyArray<Record<string, unknown>>}
 */
export function standingPlantsAgainst(worldState, settlementId, audience, tick) {
  const ledgers = worldState && typeof worldState === 'object'
    ? /** @type {Record<string, unknown>} */ (worldState).spatialLedgers : null;
  const disinfo = ledgers && typeof ledgers === 'object'
    ? /** @type {Record<string, unknown>} */ (ledgers).disinfo : null;
  const maps = ledgers && typeof ledgers === 'object'
    ? /** @type {Record<string, unknown>} */ (ledgers).beliefMaps : null;
  if (!disinfo || typeof disinfo !== 'object' || !settlementId) return [];
  const rows = Object.keys(/** @type {Record<string, unknown>} */ (disinfo)).sort()
    .filter((key) => key.startsWith('plant:'))
    .map((key) => /** @type {Record<string, unknown>} */ (disinfo)[key])
    .filter((r) => r && typeof r === 'object'
      && (String(/** @type {Record<string, unknown>} */ (r).subjectId) === settlementId
        || String(/** @type {Record<string, unknown>} */ (r).audienceId) === settlementId));
  return projectPlants(/** @type {Record<string, unknown>[]} */ (rows), {
    audience,
    isExposed: (record) => plantIsExposed(
      record,
      seatBeliefRecord(
        maps && typeof maps === 'object' ? /** @type {Record<string, unknown>} */ (maps) : {},
        String(record.audienceId), String(record.subjectId),
      ),
      tick,
    ),
  });
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
  // IN-0a — projectPlants' FIRST non-test consumer, audience named explicitly.
  const plants = standingPlantsAgainst(worldState, sid, 'dm', tick);

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
      plants.length
        ? section('plants', 'Stories standing against this town', SOURCE.PLANTS_TRUTH, [...plants])
        : null,
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

  // Rumors whose ground truth diverges from what the town believes. H14: the old
  // read looked for sibling scalars `r.belief` / `r.truth` and compared them, but
  // settlementRumors returns the belief AS the projection itself (headline/detail/
  // whereId/…) with a nested `truth` OBJECT and NO `belief` key — so `r.belief`
  // was always undefined and the ENTIRE rumor-irony branch was dead. Read the real
  // shape: the projection's rendered `headline` is what the town believes; the
  // `truth` block carries the true headline (when the DM feed joins) plus the
  // `divergence` reasons. An irony exists wherever the telling diverges from truth.
  const rumorsTruth = settlementRumors({ worldState, settlementId: sid, includeGroundTruth: true });
  for (const raw of rumorsTruth) {
    const r = /** @type {{ headline?: unknown, whereId?: unknown, truth?: { divergence?: unknown, trueHeadline?: unknown } | null }} */ (raw);
    const truth = r.truth && typeof r.truth === 'object' ? r.truth : null;
    const divergence = truth && Array.isArray(truth.divergence) ? truth.divergence : [];
    if (divergence.length === 0) continue;
    ironies.push({
      kind: 'rumor',
      believed: typeof r.headline === 'string' ? r.headline : null,
      truth: truth && typeof truth.trueHeadline === 'string' ? truth.trueHeadline : null,
      divergence,
      whereId: r.whereId ?? null,
    });
  }

  return assembleBrief({
    kind: 'dramaticIrony',
    audience: 'dm',
    sections: [
      ironies.length ? section('irony', 'What they don\'t know', SOURCE.DRAMATIC_IRONY, ironies) : null,
    ],
  });
}
