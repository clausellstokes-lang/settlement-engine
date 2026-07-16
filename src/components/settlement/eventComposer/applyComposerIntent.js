/**
 * eventComposer/applyComposerIntent.js — the intent-consumption body (§4 +
 * the §10 edit seeding) and the verb-change reset, extracted from
 * EventComposer so the host component stays under the max-lines wall. Pure
 * over the setters bag: the component threads its useState setters in; the
 * mapping stays 1:1 with editSeed.js's field twins (the reverse of buildEvent).
 */

import { RELATIONSHIP_OPTIONS } from './EventComposerConstants.js';
import { mintComposeEventId } from './buildEvent.js';

/**
 * The ONE verb-change reset (extracted from EventComposer.switchType): clears
 * every per-type field, re-mints the compose-session id (a different verb IS
 * a different composition — §5 identity), and ends §10 edit mode.
 * @param {string} v @param {Record<string, Function>} s the setters bag
 */
export function resetComposerForVerb(v, s) {
  s.setType(v); s.setTarget(''); s.setAddCategory(''); s.setDestroyConfirm('');
  s.setRelationshipType((RELATIONSHIP_OPTIONS[v] || [])[0] || '');
  s.setCriminalOrg(''); s.setCorruptScope('individual'); s.setStressorPick(null);
  s.setStressorSeverity('moderate'); s.setInstigatorNeighbour(''); s.setInstigatorRelationship('rival');
  s.setTradeTarget(''); s.setPowerCause('coup'); s.setTradeDirection('export'); s.setTradeEntrepot(false);
  s.setCustomResourceName(''); s.setSwapWithNpcId(''); s.setTierDirection('promotion');
  s.setDeityRef(''); s.setDeityMode('assign'); s.setCultRemoveRef('');
  s.setNpcFlaw(''); s.setNpcTemperament(''); s.setNpcGoals(''); s.setNpcConstraint(''); s.setNpcSecret('');
  s.setPartnerSaveId(''); s.setLinkRelType('neutral');
  s.setCauseOverride(''); s.setApplyRefusal(null);
  s.setEditingQueue(null);
  s.setSessionEventId(mintComposeEventId());
}

/**
 * Consume a staged composer intent into the form (the one source of truth).
 * @param {Record<string, any>} intent  the staged composer intent
 * @param {Record<string, Function>} s  the setters bag (+ switchType, registryHas)
 */
export function applyComposerIntent(intent, s) {
  const { type: iType, target: iTarget, fields } = intent;
  if (iType && s.registryHas(iType)) s.switchType(iType);
  if (iTarget != null && iTarget !== '') s.setTarget(String(iTarget));
  const f = fields || {};
  // String-valued form twins (loop-driven; null ⇒ leave the reset default).
  const stringSetters = {
    role: s.setRole, institutionId: s.setInstitutionId, quality: s.setQuality,
    importance: s.setImportance, description: s.setDesc, causeOverride: s.setCauseOverride,
    addCategory: s.setAddCategory, relationshipType: s.setRelationshipType,
    criminalOrg: s.setCriminalOrg, corruptScope: s.setCorruptScope,
    corruptBeneficiary: s.setCorruptBeneficiary, stressorSeverity: s.setStressorSeverity,
    instigatorNeighbour: s.setInstigatorNeighbour, instigatorRelationship: s.setInstigatorRelationship,
    powerCause: s.setPowerCause, tradeDirection: s.setTradeDirection,
    swapWithNpcId: s.setSwapWithNpcId, reliefMagnitude: s.setReliefMagnitude,
    tierDirection: s.setTierDirection, deityRef: s.setDeityRef, deityMode: s.setDeityMode,
    cultRemoveRef: s.setCultRemoveRef,
    npcFlaw: s.setNpcFlaw, npcTemperament: s.setNpcTemperament, npcGoals: s.setNpcGoals,
    npcConstraint: s.setNpcConstraint, npcSecret: s.setNpcSecret,
  };
  for (const [key, set] of Object.entries(stringSetters)) {
    if (f[key] != null && typeof set === 'function') set(String(f[key]));
  }
  if (f.tradeEntrepot != null) s.setTradeEntrepot(!!f.tradeEntrepot);
  if (f.partyCaused != null) s.setPartyCaused(!!f.partyCaused);
  // The stressorPick twin (components-dossier-library-7) is an OBJECT, not a
  // string — seeded whole so the re-staged event keeps its authored label + key.
  if (f.stressorPick != null) s.setStressorPick(f.stressorPick);
  // §10 IDENTITY: editing a queued intention keeps its compose-session id;
  // re-staging replaces the queue entry in place (never re-queues at the end).
  if (intent.editQueue?.queueId) {
    s.setEditingQueue({ ...intent.editQueue });
    if (intent.editQueue.eventId) s.setSessionEventId(String(intent.editQueue.eventId));
  }
}
