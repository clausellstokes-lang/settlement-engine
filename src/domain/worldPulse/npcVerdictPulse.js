/**
 * Production composition for organic ousters: H2 sentences the exact roster
 * identity, then the established successor pass inherits the pre-strip seat.
 */

import { npcId } from './npcAgency.js';
import { applyNpcVerdict, VERDICT_NEWS_TYPE } from './npcVerdictApply.js';
import { stablePart } from './stablePart.js';
import { replaceOustedNpcs } from './successorNpc.js';

/** @param {string} a @param {string} b @returns {number} */
function codepointCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Adapt H2's pulse-row receipt to the Wizard News record contract. The source row
 * keeps its Chronicle address fields for the audit sink; the plural actor ids and
 * typed impact are the fields Wizard News actually preserves through normalization.
 * Unknown audiences fail closed to DM-only, so a future covert verdict cannot become
 * public merely because its source spelling drifted.
 *
 * @param {unknown} raw
 * @returns {Record<string, unknown>|null}
 */
export function npcVerdictWizardNewsEntry(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const row = /** @type {Record<string, unknown>} */ (raw);
  const id = String(row.id || '');
  const settlementId = String(row.targetSaveId || '');
  const localNpcId = String(row.npcId || '');
  if (!id || row.candidateType !== VERDICT_NEWS_TYPE || !settlementId || !localNpcId) return null;

  const npcPulseId = localNpcId.startsWith(`${settlementId}:`)
    ? localNpcId
    : `${settlementId}:${localNpcId}`;
  const localFactionId = String(row.factionId || '');
  const factionPulseId = !localFactionId
    ? ''
    : localFactionId.startsWith(`${settlementId}:`)
      ? localFactionId
      : `${settlementId}:${stablePart(localFactionId)}`;
  const publicEntry = row.audience === 'public';
  const { covert: _sourceCovert, ...source } = row;
  const tags = ['world_pulse', VERDICT_NEWS_TYPE, String(row.verdict || '')].filter(Boolean);

  return Object.freeze({
    ...source,
    scope: 'local',
    kind: 'applied',
    impactKind: VERDICT_NEWS_TYPE,
    channelType: 'political_authority',
    sourceEventId: id,
    tags: Object.freeze(tags),
    npcIds: Object.freeze([npcPulseId]),
    ...(factionPulseId ? { factionIds: Object.freeze([factionPulseId]) } : {}),
    audience: publicEntry ? 'public' : 'dm-only',
    ...(!publicEntry ? { covert: true } : {}),
  });
}

/**
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {Record<string, unknown>} args.settlement
 * @param {unknown[]} args.exposures
 * @param {string} args.settlementSeed
 * @param {string} args.settlementId
 * @param {string} args.settlementName
 * @param {number} args.tick
 * @param {unknown} args.successorRng
 * @returns {{
 *   worldState: Record<string, unknown>,
 *   settlement: Record<string, unknown>,
 *   authorityVerdicts: Array<Record<string, unknown>>,
 *   newsEntries: Array<Record<string, unknown>>,
 * }}
 */
export function applyOrganicNpcVerdicts({
  worldState,
  settlement,
  exposures = [],
  settlementSeed,
  settlementId,
  settlementName,
  tick,
  successorRng,
}) {
  const ousters = (Array.isArray(exposures) ? exposures : [])
    .filter((raw) => raw && typeof raw === 'object' && raw.kind === 'ousted')
    .sort((left, right) => codepointCompare(
      String(left?.npcId || ''),
      String(right?.npcId || ''),
    ));
  if (ousters.length === 0) {
    return { worldState, settlement, authorityVerdicts: [], newsEntries: [] };
  }

  const replacementSource = settlement;
  let nextWorld = worldState;
  let verdictSettlement = settlement;
  const handledNpcIds = new Set();
  const authorityVerdicts = [];
  const newsEntries = [];

  for (const exposure of ousters) {
    const exposedNpcId = String(exposure?.npcId || '');
    if (!exposedNpcId || handledNpcIds.has(exposedNpcId)) continue;
    const roster = Array.isArray(verdictSettlement?.npcs) ? verdictSettlement.npcs : [];
    const npc = roster.find((candidate, index) => (
      npcId(settlementId, candidate, index) === exposedNpcId
    ));
    if (!npc) continue;
    handledNpcIds.add(exposedNpcId);
    const verdict = applyNpcVerdict({
      worldState: nextWorld,
      settlement: verdictSettlement,
      npc,
      exposure,
      settlementSeed,
      settlementId,
      settlementName,
      tick,
    });
    if (!verdict.changed) continue;
    nextWorld = verdict.worldState;
    verdictSettlement = verdict.settlement;
    if (verdict.authorityVerdict) authorityVerdicts.push(verdict.authorityVerdict);
    const newsEntry = npcVerdictWizardNewsEntry(verdict.news);
    if (newsEntry) newsEntries.push(newsEntry);
  }

  const replaced = replaceOustedNpcs(
    replacementSource,
    ousters.map((exposure) => exposure.name),
    successorRng,
  );
  const nextSettlement = verdictSettlement === replacementSource
    ? replaced
    : replaced === replacementSource
      ? verdictSettlement
      : { ...verdictSettlement, npcs: replaced.npcs };
  return {
    worldState: nextWorld,
    settlement: nextSettlement,
    authorityVerdicts,
    newsEntries,
  };
}
