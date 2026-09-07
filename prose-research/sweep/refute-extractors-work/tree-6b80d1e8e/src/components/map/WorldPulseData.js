// WorldPulseData.js — pure data helpers extracted verbatim from
// WorldPulsePanel.jsx. These translate the ids/shape the simulation records into
// the strings the World Pulse cards read. No JSX, no state — pure functions and
// the small constant Sets the panel filters stressors against.
import { formatCount } from '../../domain/formatNumber.js';
import {
  humanizeToken,
  settlementSizeLabel,
} from '../../domain/display/humanizeEngineTokens.js';

export function percent(value) {
  return `${Math.round((Number.isFinite(value) ? value : 0) * 100)}%`;
}

export function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

export function signedNumber(value) {
  const n = Math.round(Number(value) || 0);
  return `${n > 0 ? '+' : ''}${formatCount(n)}`;
}

export function unique(values = []) {
  return values.filter(Boolean).filter((value, index, arr) => arr.indexOf(value) === index);
}

// ── Entity resolution ───────────────────────────────────────────────────────
// Turn the ids the simulation records into the names a reader needs: which
// settlement, which faction, which institution.
export function nameMapFromSaves(saves = []) {
  const map = new Map();
  for (const save of saves || []) {
    const id = save?.id || save?.settlement?.id;
    const name = save?.name || save?.settlement?.name;
    if (id && name) map.set(String(id), name);
  }
  return map;
}

export function collectSettlementIds(item = {}) {
  const ids = [];
  for (const src of [item, item.outcome || {}, item.proposalPayload || item.outcome?.proposalPayload || {}]) {
    if (!src || typeof src !== 'object') continue;
    if (src.settlementId) ids.push(src.settlementId);
    if (src.targetSaveId) ids.push(src.targetSaveId);
    if (src.saveId) ids.push(src.saveId);
    for (const id of src.affectedSettlementIds || []) ids.push(id);
    for (const id of src.settlementIds || []) ids.push(id);
    for (const delta of src.populationDeltas || []) if (delta?.saveId) ids.push(delta.saveId);
  }
  return unique(ids.map(String));
}

// THE NEWS ADDRESS LAW subject descriptor for a pulse item: the TYPED ids the
// address-chain resolver joins on (never prose). The realm web resolves npcId
// (settlement-prefixed) to the deep settlement › power › faction › npc chain;
// falls to a faction (factionId, or factionName scoped to the containing
// settlement); falls to the settlement itself; resolves to nothing (subjectless,
// e.g. a plague) when the record names no addressable actor.
export function outcomeSubjectDescriptor(item = {}) {
  const o = item.outcome || item;
  const payload = o.proposalPayload || item.proposalPayload || {};
  const ids = collectSettlementIds(item);
  const settlementId = o.targetSaveId ?? o.settlementId ?? payload.settlementId ?? ids[0] ?? null;
  return {
    npcId: o.npcId || item.npcId || null,
    factionId: o.factionId || item.factionId || null,
    factionName: o.factionName || payload.factionName || item.factionName || null,
    settlementId,
  };
}

// The named entities involved in a pulse item, in reader-priority order.
export function involvedEntities(item = {}, nameById = new Map()) {
  const o = item.outcome || item;
  const payload = o.proposalPayload || item.proposalPayload || {};
  const out = [];

  const settlements = unique(collectSettlementIds(item).map(id => nameById.get(String(id))).filter(Boolean));
  if (settlements.length) {
    out.push({ label: settlements.length > 1 ? 'Settlements' : 'Settlement', value: settlements.slice(0, 4).join(', ') });
  }

  const faction = o.factionName || payload.factionName || item.factionName;
  if (faction) out.push({ label: 'Faction', value: human(faction) });

  const institution = o.metadata?.institutionName || payload.institutionName || o.institutionName || item.institutionName;
  if (institution) out.push({ label: 'Institution', value: institution });

  const npcRole = payload.roleArchetype || o.metadata?.roleArchetype;
  if ((o.npcId || item.npcId) && npcRole) out.push({ label: 'NPC role', value: human(npcRole) });

  return out;
}

export function proposalDetails(outcome = {}) {
  const payload = outcome.proposalPayload || {};
  if (payload.kind === 'tier_change') {
    return [
      `Size ${settlementSizeLabel(payload.fromTier, 'unknown')} → ${settlementSizeLabel(payload.toTier, 'unknown')}`,
      humanizeToken(payload.direction),
    ].filter(Boolean);
  }
  if (payload.kind === 'relationship_label_change') {
    return [`${humanizeToken(payload.fromType)} → ${humanizeToken(payload.toType)}`];
  }
  if (payload.kind === 'npc_action') {
    return [
      humanizeToken(payload.actionFamily),
      payload.dotRankBefore && payload.dotRankAfter
        ? `${payload.dotRankBefore} dot → ${payload.dotRankAfter} dot`
        : humanizeToken(payload.roleArchetype),
    ].filter(Boolean);
  }
  if (payload.kind === 'government_change') {
    return [
      humanizeToken(payload.governmentPreference),
      humanizeToken(payload.legitimacyBand),
      'preserve institutions',
    ];
  }
  if (payload.kind === 'institution_suppression' || payload.kind === 'institution_capture') {
    return [humanizeToken(payload.kind), payload.institutionName].filter(Boolean);
  }
  if (payload.kind === 'faction_power_shift') {
    return [humanizeToken(payload.kind), humanizeToken(payload.cause)].filter(Boolean);
  }
  // ruleFamily/ruleId are implementation addresses, not reader facts. When a
  // proposal carries no typed display payload, the card's authored headline and
  // summary remain the honest detail rather than laundering an internal id.
  return [];
}

export function outcomeDetails(outcome = {}, nameById = new Map()) {
  const details = [...proposalDetails(outcome)];
  if (outcome.tierChange) {
    details.push(
      `Size ${settlementSizeLabel(outcome.tierChange.fromTier, 'unknown')} → ${settlementSizeLabel(outcome.tierChange.toTier, 'unknown')}`,
    );
  }
  if (outcome.populationDeltas?.length) {
    details.push(...outcome.populationDeltas.slice(0, 3).map(delta => `${nameById.get(String(delta.saveId)) || 'Settlement'}: ${signedNumber(delta.delta)}`));
  }
  if (outcome.resourcePatch) {
    details.push(`${human(outcome.resourcePatch.resource)} ${human(outcome.resourcePatch.state)}`);
  }
  if (outcome.npcPatch?.shortGoal) details.push(`short: ${human(outcome.npcPatch.shortGoal)}`);
  if (outcome.npcPatch?.longGoal) details.push(`long: ${human(outcome.npcPatch.longGoal)}`);
  if (outcome.stressor?.type) details.push(human(outcome.stressor.type));
  if (outcome.metadata?.economicRole) details.push(human(outcome.metadata.economicRole));
  if (outcome.metadata?.transferMode) details.push(`migration ${human(outcome.metadata.transferMode)}`);
  if (outcome.metadata?.rebellionOutcome) details.push(`rebellion ${human(outcome.metadata.rebellionOutcome)}`);
  return unique(details).slice(0, 5);
}

export function digestDetails(entry = {}, nameById = new Map()) {
  const names = unique((entry.settlementIds || []).map(id => nameById.get(String(id))).filter(Boolean));
  const settlementDetail = names.length
    ? `${names.slice(0, 3).join(', ')}${names.length > 3 ? ` +${names.length - 3}` : ''}`
    : (entry.settlementIds?.length ? `${entry.settlementIds.length} settlement${entry.settlementIds.length === 1 ? '' : 's'}` : null);
  return unique([
    human(entry.scope),
    human(entry.kind),
    human(entry.impactKind),
    human(entry.channelType),
    settlementDetail,
  ]).slice(0, 5);
}

export function rollIsDeterministic(roll = {}) {
  return !!roll.conflictResolution?.deterministic || (roll.probability >= 1 && roll.roll === 0);
}

// ── Live stressors & echoes ─────────────────────────────────────────────────
// worldState.stressors carries both ACTIVE crises and residual ECHOES
// (resolved-but-remembered). The cards surface the new dynamics: why a crisis
// is resolving fast or slow (counterforce), what it's entangled with
// (synergies), and who is behind it (origin variant / attacker — nullable by
// design until the DM names the force).

export const ACTIVE_UI_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

export function stressorDetails(stressor = {}) {
  const details = [human(stressor.lifecycleStage || 'active'), human(stressor.durationPolicy)];
  const cf = stressor.counterforce;
  if (cf && Number.isFinite(cf.score)) {
    const trend = cf.score > 0.55 ? 'recovering fast' : cf.score < 0.45 ? 'wallowing' : 'holding';
    details.push(`resilience ${percent(cf.score)}: ${trend}${cf.floorsMet === false ? ' (a pillar is missing)' : ''}`);
  }
  if (stressor.synergy?.companions?.length) {
    details.push(`entangled with ${stressor.synergy.companions.slice(0, 2).map(human).join(', ')}`);
  }
  if (stressor.synergy?.blocksResolution) details.push('cannot lift while blocked');
  if (stressor.originContext?.variant) details.push(human(stressor.originContext.variant));
  return unique(details).slice(0, 5);
}

export const WAR_SHAPED_TYPES = new Set([
  'siege', 'wartime', 'occupation', 'monster_raider_pressure',
  // §S3 — the pulse-born war-layer stressors also read as war-shaped so their
  // attacker/coalition context surfaces in the same cards.
  'war_drain', 'army_deployed', 'religious_conversion_fracture',
]);

export function stressorSummary(stressor = {}) {
  const parts = [];
  if (stressor.originContext?.reason) parts.push(stressor.originContext.reason);
  const hooks = stressor.originContext?.hooks || [];
  if (hooks.length) parts.push(`Hooks: ${hooks.slice(0, 2).join(' • ')}`);
  return parts.join('. ');
}

export function attackerEntity(stressor = {}, nameById = new Map()) {
  const ctx = stressor.originContext;
  if (!ctx) return null;
  // §S3 — a coalition siege names its instigator + supporters. When the resolver
  // attached a coalition (primaryInstigatorId + supporterIds, codepoint-stable),
  // surface the whole coalition; a single named force still reads "Attacker".
  const coalition = unique([ctx.primaryInstigatorId, ...(ctx.supporterIds || [])].filter(Boolean).map(String))
    .map(id => nameById.get(id) || id);
  if (coalition.length > 1) {
    return { label: 'Coalition', value: coalition.slice(0, 4).join(', ') };
  }
  if (ctx.attackerLabel) return { label: 'Attacker', value: ctx.attackerLabel };
  if (ctx.primaryInstigatorId) {
    return { label: 'Attacker', value: nameById.get(String(ctx.primaryInstigatorId)) || String(ctx.primaryInstigatorId) };
  }
  if (ctx.attackerSettlementId) {
    return { label: 'Attacker', value: nameById.get(String(ctx.attackerSettlementId)) || String(ctx.attackerSettlementId) };
  }
  if (ctx.sponsorSettlementId) {
    return { label: 'Sponsor', value: nameById.get(String(ctx.sponsorSettlementId)) || String(ctx.sponsorSettlementId) };
  }
  if (ctx.formerSponsorSettlementId) {
    return { label: 'Former sponsor', value: nameById.get(String(ctx.formerSponsorSettlementId)) || String(ctx.formerSponsorSettlementId) };
  }
  // A war-shaped stressor with no named force: the DM can name it later.
  if (['declared_war', 'unattributed'].includes(ctx.variant)) return { label: 'Attacker', value: 'unnamed' };
  return null;
}
