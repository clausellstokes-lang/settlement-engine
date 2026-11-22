/**
 * tests/domain/events/composerDocketRoundTrip.test.js — THE MUTABLE DOCKET's
 * reverse-map guard (W-R2-INTENT, findings components-dossier-library-2 & -7).
 *
 * The owner law (Composer V2 §10): "each queued commit is editable or
 * cancelable." Editing re-opens a QUEUED event in the composer via editSeed's
 * eventToComposerIntent (the reverse of buildEvent); re-staging rebuilds the
 * payload via buildEvent. If the two ever disagree, a DM's queued intention is
 * SILENTLY INVERTED or LOSSY on re-stage — the exact bug finding -2 caught
 * (an IMPOSE_CULT removal re-seeded as an imposition) and finding -7 caught (a
 * custom stressor stripped of its authored label + isCustom marker).
 *
 * This suite is the structural pin for the WHOLE reverse-map class: for every
 * field-bearing authorable verb, an event built by the composer, edited, and
 * re-staged reproduces its payload BYTE-FOR-BYTE. Because each event is minted
 * by buildEvent under a fixed settlement + customContent, re-derived values
 * (KILL_NPC importance, role influence, deity snapshots — deliberately NOT
 * seeded by editSeed) reproduce identically on the rebuild, so the round-trip
 * is a true idempotency assertion, not a hand-authored-payload comparison.
 */

import { describe, it, expect } from 'vitest';
import { buildEvent } from '../../../src/components/settlement/eventComposer/buildEvent.js';
import { eventToComposerIntent } from '../../../src/components/settlement/eventComposer/editSeed.js';
import { applyComposerIntent, resetComposerForVerb } from '../../../src/components/settlement/eventComposer/applyComposerIntent.js';
import { EVENT_REGISTRY } from '../../../src/domain/events/registry.js';
import { WAR_STRESSOR_TYPES, INFILTRATION_STRESSOR_TYPES } from '../../../src/domain/worldPulse/warStressorTypes.js';
import { clampTierDirection } from '../../../src/components/settlement/eventComposer/EventComposerTierField.jsx';
import { CUSTOM_RESOURCE_OPTION } from '../../../src/components/settlement/eventComposer/EventComposerConstants.js';

// ── The composer's form state, mirrored as a plain object ────────────────────
// Initial values match EventComposer.jsx's useState defaults for every field
// buildEvent reads; the setters bag writes into it exactly as the component's
// setters do, so resetComposerForVerb + applyComposerIntent drive it faithfully.
function makeComposerHarness() {
  const state = {
    type: '', target: '', description: '', addCategory: '', destroyConfirm: '',
    relationshipType: '', criminalOrg: '', corruptScope: 'individual', corruptBeneficiary: '',
    stressorPick: null, stressorSeverity: 'moderate', instigatorNeighbour: '', instigatorRelationship: 'rival',
    tradeTarget: '', powerCause: 'coup', reliefMagnitude: 'measured', tradeDirection: 'export', tradeEntrepot: false,
    customResourceName: '', swapWithNpcId: '', tierDirection: 'promotion',
    deityRef: '', deityMode: 'assign', cultRemoveRef: '',
    partnerSaveId: '', linkRelType: 'neutral', causeOverride: '', applyRefusal: null,
    editingQueue: null, sessionEventId: '',
    role: '', institutionId: '', quality: 'competent', importance: 'notable',
    npcFlaw: '', npcTemperament: '', npcGoals: '', npcConstraint: '', npcSecret: '',
    partyCaused: false,
  };
  const set = (k) => (v) => { state[k] = v; };
  const bag = {
    registryHas: (t) => !!EVENT_REGISTRY[t],
    switchType: (v) => resetComposerForVerb(v, bag),
    setType: set('type'), setTarget: set('target'), setDesc: set('description'),
    setAddCategory: set('addCategory'), setDestroyConfirm: set('destroyConfirm'),
    setRelationshipType: set('relationshipType'), setCriminalOrg: set('criminalOrg'),
    setCorruptScope: set('corruptScope'), setCorruptBeneficiary: set('corruptBeneficiary'),
    setStressorPick: set('stressorPick'), setStressorSeverity: set('stressorSeverity'),
    setInstigatorNeighbour: set('instigatorNeighbour'), setInstigatorRelationship: set('instigatorRelationship'),
    setTradeTarget: set('tradeTarget'), setPowerCause: set('powerCause'),
    setReliefMagnitude: set('reliefMagnitude'), setTradeDirection: set('tradeDirection'),
    setTradeEntrepot: set('tradeEntrepot'), setCustomResourceName: set('customResourceName'),
    setSwapWithNpcId: set('swapWithNpcId'), setTierDirection: set('tierDirection'),
    setDeityRef: set('deityRef'), setDeityMode: set('deityMode'), setCultRemoveRef: set('cultRemoveRef'),
    setPartnerSaveId: set('partnerSaveId'), setLinkRelType: set('linkRelType'),
    setCauseOverride: set('causeOverride'), setApplyRefusal: set('applyRefusal'),
    setEditingQueue: set('editingQueue'), setSessionEventId: set('sessionEventId'),
    setRole: set('role'), setInstitutionId: set('institutionId'), setQuality: set('quality'),
    setImportance: set('importance'), setNpcFlaw: set('npcFlaw'), setNpcTemperament: set('npcTemperament'),
    setNpcGoals: set('npcGoals'), setNpcConstraint: set('npcConstraint'), setNpcSecret: set('npcSecret'),
    setPartyCaused: set('partyCaused'),
  };
  return { state, bag };
}

// Reproduce EventComposer.assembleEvent()'s form derivation (the pieces computed
// in the component around the raw state) so buildEvent sees exactly what the live
// composer feeds it.
function assembleForm(state, { settlement, customContent, phase }) {
  const effectiveTarget = state.type === 'ADD_RESOURCE' && state.target === CUSTOM_RESOURCE_OPTION
    ? state.customResourceName : state.target;
  const stressorKey = String(state.stressorPick?.key || state.target || '').toLowerCase();
  return {
    ...state,
    settlement, customContent, phase,
    effectiveTarget,
    severity: 0.7, dimension: 'legitimacy',
    criminalOrgs: [],
    isWarStressor: WAR_STRESSOR_TYPES.includes(stressorKey),
    isInfiltrationStressor: INFILTRATION_STRESSOR_TYPES.includes(stressorKey),
    tierDirection: clampTierDirection(settlement, state.tierDirection),
  };
}

// A rich-enough context: NPCs for KILL/PROMOTE, an institution for role
// assignment, a custom deity (with a localUid so its minted ref resolves back)
// for the deity verbs.
const CTX = {
  phase: 'canon',
  customContent: {
    deities: [
      { localUid: 'warfather1', name: 'The War Father', alignmentAxis: 'chaotic', temperamentAxis: 'wrathful', rankAxis: 'major', lawAxis: 'chaotic', domain: 'war' },
      { localUid: 'ashmother1', name: 'Ashmother', alignmentAxis: 'neutral', temperamentAxis: 'stern', rankAxis: 'minor', lawAxis: 'neutral' },
    ],
  },
  settlement: {
    name: 'Duskvale', population: 1200, tier: 'town',
    institutions: [{ id: 'i1', name: 'Temple of Dawn', category: 'religious' }, { id: 'i2', name: "Thieves' Guild", category: 'criminal' }],
    powerStructure: { factions: [{ id: 'f1', name: 'Council', faction: 'Council' }] },
    npcs: [
      { id: 'n1', name: 'Mira', importance: 'notable', factionAffiliation: 'Council' },
      { id: 'n2', name: 'Bran', importance: 'prominent', factionAffiliation: 'Council' },
    ],
    config: {
      nearbyResources: ['timber'],
      primaryDeitySnapshot: { name: 'The War Father', _deityRef: 'deity:warfather1:the-war-father', rankAxis: 'major', lawAxis: 'chaotic', alignmentAxis: 'chaotic' },
      cultDeitySnapshots: [{ name: 'Ashmother', _deityRef: 'deity:ashmother1:ashmother', rankAxis: 'minor' }],
    },
  },
};

// Build the composer's own event for a verb (verb-specific state overrides),
// then round-trip it: edit-seed → apply-into-form → rebuild.
function build(overrides) {
  const { state } = makeComposerHarness();
  Object.assign(state, overrides, { sessionEventId: 'ev_fixed_0001' });
  return buildEvent(assembleForm(state, CTX));
}
function roundTrip(e0) {
  const intent = eventToComposerIntent(e0, { campaignId: 'camp1', queueId: 'q1' });
  const { state, bag } = makeComposerHarness();
  applyComposerIntent(intent, bag);
  return buildEvent(assembleForm(state, CTX));
}

// The field-bearing authorable verbs (every verb whose editSeed writes a form
// twin). Cause/description/party provenance are folded into a couple of cases.
const CASES = [
  ['ADD_INSTITUTION', { type: 'ADD_INSTITUTION', target: 'Granary', addCategory: 'economic' }],
  ['ADD_NPC + descriptive traits', {
    type: 'ADD_NPC', target: '', importance: 'prominent', role: 'priest', institutionId: 'i1',
    npcFlaw: 'vain', npcTemperament: 'brooding', npcGoals: 'ascend the pantheon', npcConstraint: 'a vow of silence', npcSecret: 'a hidden heresy',
    description: 'A newcomer of note.',
  }],
  ['ASSIGN_NPC_TO_ROLE (importance/influence re-derived)', { type: 'ASSIGN_NPC_TO_ROLE', target: 'n1', role: 'high priest', institutionId: 'i1', quality: 'exceptional' }],
  ['KILL_NPC (importance re-derived from the dossier)', { type: 'KILL_NPC', target: 'n2' }],
  ['IMPOSE_CORRUPTION — local underworld', { type: 'IMPOSE_CORRUPTION', target: 'n1', criminalOrg: "Thieves' Guild", corruptScope: 'individual_institution' }],
  ['IMPOSE_CORRUPTION — foreign beneficiary', { type: 'IMPOSE_CORRUPTION', target: 'n1', corruptBeneficiary: 'foreign:save_9', corruptScope: 'individual' }],
  ['APPLY_STRESSOR — CUSTOM (finding -7: label + isCustom survive)', {
    type: 'APPLY_STRESSOR', target: 'whispering_rot',
    stressorPick: { key: 'whispering_rot', name: 'The Whispering Rot', isCustom: true }, stressorSeverity: 'severe',
  }],
  ['APPLY_STRESSOR — catalog war type w/ instigator', {
    type: 'APPLY_STRESSOR', target: 'siege',
    stressorPick: { key: 'siege', name: 'Siege', isCustom: false }, stressorSeverity: 'moderate', instigatorNeighbour: 'save_rival',
  }],
  ['APPLY_STRESSOR — infiltration type w/ souring relationship', {
    type: 'APPLY_STRESSOR', target: 'infiltrated',
    stressorPick: { key: 'infiltrated', name: 'Infiltrated', isCustom: false }, stressorSeverity: 'minor',
    instigatorNeighbour: 'save_spy', instigatorRelationship: 'cold_war',
  }],
  ['CHANGE_RULING_POWER', { type: 'CHANGE_RULING_POWER', target: 'Council', powerCause: 'conquest' }],
  ['ADD_TRADE_GOOD — export entrepot', { type: 'ADD_TRADE_GOOD', target: 'Silk', tradeDirection: 'export', tradeEntrepot: true }],
  ['ADD_TRADE_GOOD — import', { type: 'ADD_TRADE_GOOD', target: 'Grain', tradeDirection: 'import' }],
  ['PROMOTE_NPC (swap)', { type: 'PROMOTE_NPC', target: 'n1', swapWithNpcId: 'n2' }],
  ['FORCE_RELIEF (word-banded magnitude)', { type: 'FORCE_RELIEF', target: 'Duskvale', reliefMagnitude: 'generous' }],
  ['SHIFT_TIER', { type: 'SHIFT_TIER', target: '', tierDirection: 'promotion' }],
  ['SETTLEMENT_DISPUTE (relationship)', { type: 'SETTLEMENT_DISPUTE', target: 'save_rival', relationshipType: 'hostile', partyCaused: true }],
  ['SET_PRIMARY_DEITY — assign', { type: 'SET_PRIMARY_DEITY', deityRef: 'deity:warfather1:the-war-father', deityMode: 'assign' }],
  ['SET_PRIMARY_DEITY — remove', { type: 'SET_PRIMARY_DEITY', deityRef: '', deityMode: 'remove' }],
  ['IMPOSE_CULT — assign', { type: 'IMPOSE_CULT', deityRef: 'deity:ashmother1:ashmother', deityMode: 'assign' }],
  ['IMPOSE_CULT — REMOVE (finding -2: the silent inversion)', { type: 'IMPOSE_CULT', deityMode: 'remove', cultRemoveRef: 'deity:ashmother1:ashmother' }],
];

describe('docket edit round-trip — buildEvent∘applyComposerIntent∘eventToComposerIntent is payload-identity', () => {
  for (const [name, overrides] of CASES) {
    it(`${name} re-stages byte-for-byte`, () => {
      const e0 = build(overrides);
      const e1 = roundTrip(e0);
      expect(e1.payload).toEqual(e0.payload);
      expect(e1.targetId).toBe(e0.targetId);
      expect(e1.type).toBe(e0.type);
      expect(e1.cause).toBe(e0.cause);
      // §10 identity: the edited event keeps its compose-session id.
      expect(e1.id).toBe(e0.id);
    });
  }

  it('IMPOSE_CULT removal is NOT re-seeded as an imposition (finding -2, explicit)', () => {
    // The bug: editSeed keyed cult removal on `deityRef == null` like the patron
    // verb, but an IMPOSE_CULT removal carries { deityRef: <cultRef>, snapshot: null },
    // so it was mis-seeded deityMode:'assign' → buildEvent resolved a snapshot →
    // the queued REMOVAL became an IMPOSITION on re-stage.
    const e0 = build({ type: 'IMPOSE_CULT', deityMode: 'remove', cultRemoveRef: 'deity:ashmother1:ashmother' });
    expect(e0.payload.snapshot).toBeNull();
    expect(e0.payload.deityRef).toBe('deity:ashmother1:ashmother');
    const intent = eventToComposerIntent(e0, { campaignId: 'c', queueId: 'q' });
    expect(intent.fields.deityMode).toBe('remove');
    expect(intent.fields.cultRemoveRef).toBe('deity:ashmother1:ashmother');
    const e1 = roundTrip(e0);
    expect(e1.payload.snapshot).toBeNull();          // still a removal, not an imposition
    expect(e1.payload.deityRef).toBe('deity:ashmother1:ashmother');
  });

  it('custom APPLY_STRESSOR keeps its authored label + isCustom (finding -7, explicit)', () => {
    const e0 = build({
      type: 'APPLY_STRESSOR', target: 'whispering_rot',
      stressorPick: { key: 'whispering_rot', name: 'The Whispering Rot', isCustom: true }, stressorSeverity: 'severe',
    });
    expect(e0.payload.label).toBe('The Whispering Rot');
    expect(e0.payload.isCustom).toBe(true);
    const intent = eventToComposerIntent(e0, { campaignId: 'c', queueId: 'q' });
    expect(intent.fields.stressorPick).toEqual({ key: 'whispering_rot', name: 'The Whispering Rot', isCustom: true });
    const e1 = roundTrip(e0);
    expect(e1.payload.label).toBe('The Whispering Rot');  // not the de-slugged 'Whispering Rot'
    expect(e1.payload.isCustom).toBe(true);
  });
});
