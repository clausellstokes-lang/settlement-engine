/** Eager pulse UI state plus stable delegates for the cold campaign runtime. */
import {
  campaignActionDelegate,
  readyCampaignAction,
} from './campaignEntryDelegates.js';

export const CAMPAIGN_PULSE_ACTIONS = Object.freeze([
  'previewCampaignWorldPulse',
  'canonizeCampaignWorld',
  'canonizeCampaignWorldSpatial',
  'updateCampaignSimulationRules',
  'advanceCampaignWorld',
  'catchUpCampaignWorld',
  'resolveIntervalMajors',
  'applyWorldPulseProposal',
  'stageRealmVerb',
  'recordPartyImpact',
  'recordCanonRelationshipRipple',
  'reverseCanonRelationshipRipple',
  'dismissWorldPulseProposal',
  'getCampaignWorldState',
  'canUndoLastPulse',
  'undoLastPulse',
  'undoLastProposalApply',
]);

function hasId(values, sought) {
  return (values || []).some(value => String(value) === String(sought));
}

export const createCampaignWorldPulseSlice = (set, get) => {
  const actions = Object.fromEntries(
    CAMPAIGN_PULSE_ACTIONS.map(name => [name, campaignActionDelegate(get, name)]),
  );
  return {
    pulseUndoStack: [],
    proposalUndoStack: [],
    advanceSeqByCampaign: {},
    advanceInFlight: [],
    advanceAutoResolve: false,
    livingCatchUp: null,
    isAdvanceInFlight: (campaignId) => {
      const ready = readyCampaignAction(get, 'isAdvanceInFlight');
      return ready
        ? ready(campaignId)
        : hasId(get().advanceInFlight, campaignId);
    },
    getPausedAdvance: (campaignId) => {
      const ready = readyCampaignAction(get, 'getPausedAdvance');
      if (ready) return ready(campaignId);
      const campaign = (get().campaigns || []).find(item => (
        item?.id != null && String(item.id) === String(campaignId)
      ));
      return campaign?.worldState?.pausedAdvance || null;
    },
    setAdvanceAutoResolve: value => set(state => {
      state.advanceAutoResolve = !!value;
    }),
    dismissLivingCatchUp: () => set(state => { state.livingCatchUp = null; }),
    ...actions,
  };
};
