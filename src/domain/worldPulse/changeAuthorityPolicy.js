/**
 * domain/worldPulse/changeAuthorityPolicy.js — the canonical change-authority
 * contract for the World Pulse simulation.
 *
 * PHILOSOPHY: the DM approves the premise; bounded logical consequences then
 * auto-apply. A change-type is PROPOSAL-GATED when it introduces a new premise a
 * DM might want to veto or reshape (a settlement's tier collapsing, an
 * institution dissolving, a wave of refugees redrawing two populations). It is
 * AUTO-APPLIED when it is the bounded, already-implied consequence of a premise
 * the DM already accepted upstream (a won siege resolves into conquest; a
 * culminating long goal resolves into the NPC's ascendance; an occupation that
 * has run its course resolves into vassalization).
 *
 * This module does NOT route anything. It is the written-down mapping of how the
 * live subsystems already behave, plus a contract test
 * (changeAuthorityPolicy.contract.test.js) that fails if a subsystem's authority
 * silently flips. The DM-authority contract was previously implicit and
 * distributed across a dozen generators; this makes drift visible.
 *
 * AUTHORITY VALUES:
 *  • 'proposal-gated' — emits applyMode 'proposal' (queued for DM approval) when
 *    BOTH simulationRules.majorChangesRequireProposal is on AND a per-family
 *    magnitude threshold is crossed. Rules-off (e.g. the dramatic_campaign
 *    preset) downgrades these to auto, preserving the legacy always-auto path.
 *  • 'severity-gated' — emits 'proposal' purely on a severity/pressure threshold,
 *    INDEPENDENT of majorChangesRequireProposal. These predate the flag and have
 *    not been migrated onto it; that is recorded, not "fixed," here.
 *  • 'auto' — always emits applyMode 'auto'. The bounded logical consequence of a
 *    premise gated upstream.
 *  • 'auto-with-lock-escalation' — auto by default, but escalates to 'proposal'
 *    on a SEPARATE authority axis (a player-locked governing faction), not on
 *    majorChangesRequireProposal.
 *
 * @typedef {'proposal-gated'|'severity-gated'|'auto'|'auto-with-lock-escalation'} ChangeAuthority
 *
 * @typedef {object} ChangeAuthorityEntry
 * @property {ChangeAuthority} authority   The authority class (see above).
 * @property {string} module               Source module under src/domain/worldPulse/.
 * @property {boolean} consultsProposalFlag Whether the gate reads majorChangesRequireProposal.
 * @property {string} rationale            Why this authority is correct under the philosophy.
 * @property {boolean} [flagged]           True if this entry is a FLAGGED inconsistency for human review.
 */

/**
 * The canonical mapping: change-type → authority. Keys are the candidate
 * `candidateType` (or candidate family) the generator emits. This reflects REAL
 * current behavior as of 2026-06; the contract test asserts the live code still
 * matches each `authority` + `consultsProposalFlag` claim.
 *
 * @type {Readonly<Record<string, ChangeAuthorityEntry>>}
 */
export const CHANGE_AUTHORITY_POLICY = Object.freeze({
  // ── PROPOSAL-GATED: new premises a DM may veto. Consult the flag + a
  //    magnitude threshold; rules-off downgrades to auto. ───────────────────
  flow_migration: Object.freeze({
    authority: 'proposal-gated',
    module: 'flows.js',
    consultsProposalFlag: true,
    rationale:
      'A refugee wave that moves >=8% of a source population redraws two settlements; that is a new premise, not an implied consequence.',
  }),
  flow_trade_scarcity: Object.freeze({
    authority: 'proposal-gated',
    module: 'flows.js',
    consultsProposalFlag: true,
    rationale:
      'A hard trade-dependency (strength ~0.73+) failing is a structural shock to the dependent settlement; a DM may want to reshape it.',
  }),
  population_dynamics: Object.freeze({
    authority: 'proposal-gated',
    module: 'populationDynamics.js',
    consultsProposalFlag: true,
    rationale:
      'A major population swing is a premise about the settlement’s scale; gated when the flag is on.',
  }),
  tier_drift_collapse: Object.freeze({
    authority: 'proposal-gated',
    module: 'tierResourceDynamics.js',
    consultsProposalFlag: true,
    rationale:
      'A settlement crossing a tier boundary under severe pressure restructures its whole profile; gated above the magnitude threshold.',
  }),
  institution_lifecycle: Object.freeze({
    authority: 'proposal-gated',
    module: 'institutionLifecycle.js',
    consultsProposalFlag: true,
    rationale:
      'An institution being founded or dissolved is a standing-order change to the settlement; gated above the magnitude threshold.',
  }),

  // ── SEVERITY-GATED: proposal on severity alone, NOT on the flag. Predate the
  //    flag; recorded as-is, not migrated. ──────────────────────────────────
  pressure_event: Object.freeze({
    authority: 'severity-gated',
    module: 'candidateEvents.js',
    consultsProposalFlag: false,
    rationale:
      'High-pressure emergent events escalate to proposal on pressure score alone; this gate predates majorChangesRequireProposal.',
  }),
  faction_competition: Object.freeze({
    authority: 'severity-gated',
    module: 'factionCompetition.js',
    consultsProposalFlag: false,
    rationale:
      'Faction power shifts escalate to proposal on severity thresholds, independent of the flag.',
  }),
  stressor_escalation: Object.freeze({
    authority: 'severity-gated',
    module: 'stressors.js',
    consultsProposalFlag: false,
    rationale:
      'Severe stressors escalate to proposal on severity alone; this gate predates the flag.',
  }),
  relationship_evolution: Object.freeze({
    authority: 'severity-gated',
    module: 'relationshipEvolution.js',
    consultsProposalFlag: false,
    rationale:
      'Major relationship transitions escalate to proposal on severity alone, independent of the flag.',
  }),

  // ── AUTO: bounded logical consequences of premises gated upstream. ─────────
  conquest: Object.freeze({
    authority: 'auto',
    module: 'warDeployment.js',
    consultsProposalFlag: false,
    rationale:
      'Conquest is the resolution of a siege that already broke. The siege is the gated premise; the occupation that follows is its bounded consequence.',
  }),
  occupation_transition: Object.freeze({
    authority: 'auto',
    module: 'occupation.js',
    consultsProposalFlag: false,
    rationale:
      'Resistance/stabilization/burden transitions of an existing occupation are the mechanical unwinding of a conquest the DM already saw.',
  }),
  occupation_vassalized: Object.freeze({
    authority: 'auto',
    module: 'occupation.js',
    consultsProposalFlag: false,
    rationale:
      'Vassalization is the terminal state of an occupation that has run its course; it is implied by the conquest, not a new premise.',
  }),
  npc_goal_culmination: Object.freeze({
    authority: 'auto',
    module: 'npcAgency.js',
    consultsProposalFlag: false,
    rationale:
      'A long goal crossing its culmination threshold is the payoff of progress the DM watched accrue tick by tick; the ascendance is its bounded consequence.',
  }),
  trade_war: Object.freeze({
    authority: 'auto',
    module: 'tradeWar.js',
    consultsProposalFlag: false,
    rationale:
      'Trade-war conditions are the bounded propagation of an opt-in war-layer premise the DM enabled.',
  }),

  // ── AUTO WITH A SEPARATE LOCK AXIS: auto unless a player-locked seat. ──────
  coup_succeeded: Object.freeze({
    authority: 'auto-with-lock-escalation',
    module: 'coup.js',
    consultsProposalFlag: false,
    rationale:
      'A successful coup is the resolution of a coup stressor the DM already saw building; it auto-applies UNLESS the player has locked the governing faction, on which separate axis it escalates to proposal.',
  }),
});

/**
 * FLAGGED FOR HUMAN REVIEW — genuine philosophy/implementation tensions noticed
 * while mapping. These are NOT bugs to silently fix; they need a product
 * decision. The contract test asserts current behavior, so today's code passes
 * regardless of how these are resolved.
 *
 * @type {ReadonlyArray<{ id: string, summary: string }>}
 */
export const CHANGE_AUTHORITY_FLAGGED = Object.freeze([
  Object.freeze({
    id: 'severity-gated-families-bypass-flag',
    summary:
      'pressure_event, faction_competition, stressor_escalation, and relationship_evolution escalate to proposal on severity alone and never consult majorChangesRequireProposal. Setting the flag OFF (e.g. dramatic_campaign) does NOT make these auto, unlike the proposal-gated families. Either these are intentionally "always offer the DM a say at high severity" (in which case the flag’s name overpromises), or they should be migrated onto the flag for a uniform contract. Product decision needed; behavior left unchanged.',
  }),
]);
