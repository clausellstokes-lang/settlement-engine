/**
 * lineageNews.js — WR-3's reader-facing reason transitions.
 *
 * The war and peace ledgers remain the behavioral authority. This leaf only
 * narrates a lineage reason when it first materializes, plus the exact moment
 * corroborated provisioning defeats a previously standing claim. No RNG, no
 * state writes, and no prose assembled from raw ids or numeric scores.
 */

import { lineageReceipt } from './eventProse.js';
import { stablePart } from './stablePart.js';

const HEADLINE = Object.freeze({
  casus_lineage_claim_parent: (actor, target) => `${actor} presses its founding claim on ${target}`,
  casus_lineage_claim_child: (actor) => `${actor} claims the elder seat`,
  mirror_kinship_bond: (parent, child) => `${parent} and ${child} invoke their shared founding`,
  lineage_claim_suppressed: (actor, target) => `The wagon books refuse ${actor}'s claim against ${target}`,
});

const REASON = Object.freeze({
  casus_lineage_claim_parent: 'The founding record and the settlement’s present condition now support the claim.',
  casus_lineage_claim_child: 'The child settlement has overtaken the elder seat in the same living lineage.',
  mirror_kinship_bond: 'The surviving founding edge weighs against war between the two settlements.',
  lineage_claim_suppressed: 'The provisioning record and the chronicle contradict the claim.',
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value).trim();
}

/** Resolve an authored member name without falling back to its engine id. */
function memberName(snapshot, id) {
  const row = asObject(snapshot?.byId?.get?.(String(id)));
  const save = asObject(row.save);
  const settlement = asObject(row.settlement || save.settlement);
  return text(row.name || settlement.name || save.name);
}

/** Resolve a governing house only when the acting settlement really names one. */
function governingHouse(snapshot, id) {
  const row = asObject(snapshot?.byId?.get?.(String(id)));
  const save = asObject(row.save);
  const settlement = asObject(row.settlement || save.settlement);
  const power = asObject(settlement.powerStructure);
  const named = text(power.governingName);
  if (named) return named;
  const factions = Array.isArray(power.factions) ? power.factions : [];
  const governing = factions.map(asObject).find((faction) => faction.isGoverning === true);
  return text(governing?.faction || governing?.name || governing?.label);
}

/** @param {string} kind @param {string} parentId @param {string} childId @param {number} sinceTick */
function transitionId(kind, parentId, childId, sinceTick) {
  return `lineage.${kind}.${stablePart(parentId)}.${stablePart(childId)}.${Math.max(0, Math.floor(Number(sinceTick) || 0))}`;
}

/**
 * @param {{ kind:string, parentId:string, childId:string, parentName:string,
 *   childName:string, actorId:string, actorName:string, targetId:string,
 *   targetName:string, sinceTick:number, line:string, familyId:string,
 *   significance:string, audience:string, section:string }} args
 */
function compose(args) {
  const sourceEventId = transitionId(args.kind, args.parentId, args.childId, args.sinceTick);
  const headline = HEADLINE[args.kind];
  if (typeof headline !== 'function') return null;
  return {
    id: `wizard_news.${Math.max(0, Math.floor(Number(args.sinceTick) || 0))}.${args.kind}.${stablePart(args.parentId)}.${stablePart(args.childId)}`,
    tick: Math.max(0, Math.floor(Number(args.sinceTick) || 0)),
    scope: 'regional',
    significance: args.significance,
    severity: args.significance === 'major' ? 0.76 : args.significance === 'routine' ? 0.34 : 0.56,
    score: args.significance === 'major' ? 78 : args.significance === 'routine' ? 36 : 58,
    headline: headline(args.actorName, args.targetName),
    summary: args.line,
    kind: args.kind,
    impactKind: args.kind,
    channelType: 'political_authority',
    settlementIds: [args.actorId, args.targetId],
    settlementNames: [args.actorName, args.targetName],
    impactIds: [],
    channelIds: [],
    sourceEventId,
    tags: ['world_pulse', 'lineage', args.section],
    reasons: [REASON[args.kind]],
    familyId: args.familyId,
    audience: args.audience,
    section: args.section,
    ...(args.audience === 'dm-only' ? { covert: true } : {}),
  };
}

/**
 * Compose a newly-materialized lineage casus, or the transition where proven
 * provisioning defeats one. Repeated score refolds are silent.
 *
 * @param {{ snapshot?:{byId?:Map<string, unknown>}, standing?:Record<string, unknown>|null,
 *   claim?:Record<string, unknown>|null, previousReason?:unknown, currentReason?:unknown,
 *   previousSuppressionSinceTick?:unknown, currentSuppressionSinceTick?:unknown,
 *   tick:number }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function lineageWarTransitionNewsEntries(input) {
  const standing = asObject(input?.standing);
  const claim = asObject(input?.claim);
  if (standing.eligible !== true) return [];
  const direction = text(standing.direction);
  const parentId = text(standing.parentId);
  const childId = text(standing.childId);
  const parentName = memberName(input.snapshot, parentId);
  const childName = memberName(input.snapshot, childId);
  if (!parentId || !childId || !parentName || !childName) return [];

  const current = asObject(input.currentReason);
  const previous = asObject(input.previousReason);
  let kind = '';
  let sinceTick = Number(input.tick) || 0;
  if (Object.keys(current).length && !Object.keys(previous).length) {
    kind = direction === 'parent_to_child'
      ? 'casus_lineage_claim_parent'
      : direction === 'child_to_parent' ? 'casus_lineage_claim_child' : '';
    sinceTick = Number(current.sinceTick) || sinceTick;
  } else if (claim.suppressed === true && !Object.keys(current).length) {
    const priorSuppression = Number(input.previousSuppressionSinceTick);
    const currentSuppression = Number(input.currentSuppressionSinceTick);
    if (Number.isFinite(priorSuppression) || !Number.isFinite(currentSuppression)) return [];
    kind = 'lineage_claim_suppressed';
    sinceTick = currentSuppression;
  }
  if (!kind) return [];

  const actorIsParent = direction === 'parent_to_child';
  const actorId = actorIsParent ? parentId : childId;
  const targetId = actorIsParent ? childId : parentId;
  const actorName = actorIsParent ? parentName : childName;
  const targetName = actorIsParent ? childName : parentName;
  const receipt = lineageReceipt(kind, transitionId(kind, parentId, childId, sinceTick), {
    settlement: actorName,
    counterpart: targetName,
    band: 'well',
    house: governingHouse(input.snapshot, actorId),
  });
  if (!receipt) return [];
  const entry = compose({
    kind, parentId, childId, parentName, childName,
    actorId, actorName, targetId, targetName, sinceTick,
    line: receipt.line, familyId: receipt.familyId,
    significance: receipt.significance, audience: receipt.audience, section: receipt.section,
  });
  return entry ? [entry] : [];
}

/**
 * Compose one unordered-pair kinship beat when its typed peace reason first
 * materializes. Only the parent-to-child orientation speaks, so a deployment's
 * two directed peace entries cannot double-print the same family story.
 *
 * @param {{ snapshot?:{byId?:Map<string, unknown>}, standing?:Record<string, unknown>|null,
 *   previousReason?:unknown, currentReason?:unknown, tick:number }} input
 * @returns {Array<Record<string, unknown>>}
 */
export function lineagePeaceTransitionNewsEntries(input) {
  const standing = asObject(input?.standing);
  if (standing.eligible !== true || standing.direction !== 'parent_to_child') return [];
  const current = asObject(input.currentReason);
  const previous = asObject(input.previousReason);
  if (!Object.keys(current).length || Object.keys(previous).length) return [];

  const parentId = text(standing.parentId);
  const childId = text(standing.childId);
  const parentName = memberName(input.snapshot, parentId);
  const childName = memberName(input.snapshot, childId);
  if (!parentId || !childId || !parentName || !childName) return [];
  const sinceTick = Number(current.sinceTick) || Number(input.tick) || 0;
  const kind = 'mirror_kinship_bond';
  const receipt = lineageReceipt(kind, transitionId(kind, parentId, childId, sinceTick), {
    settlement: parentName,
    counterpart: childName,
  });
  if (!receipt) return [];
  const entry = compose({
    kind, parentId, childId, parentName, childName,
    actorId: parentId, actorName: parentName,
    targetId: childId, targetName: childName, sinceTick,
    line: receipt.line, familyId: receipt.familyId,
    significance: receipt.significance, audience: receipt.audience, section: receipt.section,
  });
  return entry ? [entry] : [];
}
