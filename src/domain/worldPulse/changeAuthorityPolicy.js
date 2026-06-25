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
 *  • 'always-proposal' — UNCONDITIONALLY emits applyMode 'proposal'. No flag, no
 *    severity, no lock axis can downgrade it. These are moves a DM should always
 *    get to vet (an adversarial NPC defecting, a government being challenged, a
 *    diplomatic relabel, a tier boundary crossing). Distinct from severity-gated:
 *    there is no threshold below which they go auto.
 *  • 'structural-proposal' — the candidate is auto by default; a SINGLE structural
 *    branch routes one variant to 'proposal' because that variant carries a
 *    proposal-only lever (e.g. a sue-for-peace move that pulls a relationship
 *    label-change). The split is decided by the move/branch, not by the flag or a
 *    severity threshold.
 *
 * @typedef {'proposal-gated'|'severity-gated'|'auto'|'auto-with-lock-escalation'|'always-proposal'|'structural-proposal'} ChangeAuthority
 *
 * @typedef {object} ChangeAuthorityEntry
 * @property {ChangeAuthority} authority   The authority class (see above).
 * @property {string} module               Source module under src/domain/worldPulse/.
 * @property {boolean} consultsProposalFlag Whether the gate reads majorChangesRequireProposal.
 * @property {string} rationale            Why this authority is correct under the philosophy.
 * @property {boolean} [flagged]           True if this entry is a FLAGGED inconsistency for human review.
 * @property {boolean} [campaignAltering]  True if an outcome of this change-type is a
 *   STRUCTURAL major (war start, conquest, coup/succession, government change,
 *   vassalage) — a campaign-altering move the DM should get a say on once pausing
 *   lands (Advance-scaling Stage 2+). Classified on the outcome's shape, NOT its
 *   severity or applyMode (a conquest is applyMode:'auto' today; a famine can be
 *   higher-severity than a conquest). deriveDecisionTier in decisionTier.js keys
 *   off the same structural markers this flag records. Defaults to false/absent.
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
  tier_change: Object.freeze({
    authority: 'proposal-gated',
    module: 'tierResourceDynamics.js',
    consultsProposalFlag: true,
    rationale:
      'A tier boundary crossing (tierCandidate, candidateType tier_promotion / tier_demotion) honors majorChangesRequireProposal, consistent with resource_depletion in the same module: it stays a DM proposal under the conservative default (flag on) and auto-applies only when a campaign opts out of proposal gating (flag off, e.g. dramatic_campaign).',
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
  faction_institution_capture: Object.freeze({
    authority: 'severity-gated',
    module: 'factionCompetition.js',
    consultsProposalFlag: false,
    rationale:
      'A faction capturing/suppressing an institution escalates to proposal at severity >= 0.68 (or whenever the move is a criminal suppression), independent of the flag. (institutionCandidate)',
  }),
  faction_rival_power_contest: Object.freeze({
    authority: 'severity-gated',
    module: 'factionCompetition.js',
    consultsProposalFlag: false,
    rationale:
      'A faction contesting a rival’s power basis escalates to proposal at severity >= 0.7, independent of the flag. (rivalryOrExhaustionCandidate)',
  }),
  stressor_birth: Object.freeze({
    authority: 'severity-gated',
    module: 'stressors.js',
    consultsProposalFlag: false,
    rationale:
      'A SECOND, distinct stressor gate (stressorCandidate, the pressure-born birth path) escalates to proposal when pressure.score >= 0.78 OR the type is occupation/magic_deadzone/siege/coup_detat, independent of the flag. Distinct from stressor_escalation, which is the severity-driven escalation of an EXISTING stressor.',
  }),

  // ── ALWAYS-PROPOSAL: unconditionally proposal. No flag/severity/lock can
  //    downgrade. Moves a DM should always get to vet. ───────────────────────
  npc_adversarial_action: Object.freeze({
    authority: 'always-proposal',
    module: 'npcAgency.js',
    consultsProposalFlag: false,
    rationale:
      'The defect / sabotage / seek_promotion / undermine_rival NPC action families are FORCED to proposal regardless of computed severity (the `|| [...].includes(actionFamily)` short-circuit in candidateForAction). These are adversarial moves a DM should always be offered a veto on; they never auto-apply.',
  }),
  faction_government_challenge: Object.freeze({
    authority: 'always-proposal',
    module: 'factionCompetition.js',
    consultsProposalFlag: false,
    campaignAltering: true,
    rationale:
      'A government challenge (governmentChallenge) emits a bare applyMode: \'proposal\'. Changing a settlement’s government is a new premise; it is unconditionally offered to the DM.',
  }),
  relationship_label_change: Object.freeze({
    authority: 'always-proposal',
    module: 'relationshipEvolution.js',
    consultsProposalFlag: false,
    rationale:
      'Every diplomatic relabel built through labelProposal emits a bare applyMode: "proposal". A visible relationship label flip (neutral->rival, allied, vassal rebellion, etc.) is a new premise and is unconditionally offered to the DM. Distinct from relationship_evolution, which is the severity-gated internal-drift path.',
  }),
  // ── STRUCTURAL-PROPOSAL: auto by default; one branch routes to proposal via a
  //    proposal-only lever. ───────────────────────────────────────────────────
  strategy_move: Object.freeze({
    authority: 'structural-proposal',
    module: 'settlementStrategy.js',
    consultsProposalFlag: false,
    rationale:
      'strategyCandidate emits applyMode: proposal ? \'proposal\' : \'auto\'. Only the sue_for_peace move passes a `proposal` (it pulls a relationship label-change lever, which is itself always-proposal); every other move (deploy / defend / hold / return_home) passes no proposal and stays auto. The split is structural to the move, not flag- or severity-driven.',
  }),

  // ── AUTO: bounded logical consequences of premises gated upstream. ─────────
  conquest: Object.freeze({
    authority: 'auto',
    module: 'warDeployment.js',
    consultsProposalFlag: false,
    campaignAltering: true,
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
    campaignAltering: true,
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
    campaignAltering: true,
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
