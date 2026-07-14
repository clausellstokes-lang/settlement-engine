/**
 * domain/worldPulse/decisionTier.js — Advance-scaling Stage 2.
 *
 * Two pure helpers the multi-tick orchestrator (advanceCampaignWorld.js) leans on
 * once pausing arrives (Stage 3), surfaced ADDITIVELY here without changing any
 * existing apply behavior:
 *
 *  1. deriveDecisionTier(outcome) -> 'major' | 'minor' — classifies a selected
 *     outcome on STRUCTURAL markers, never severity or applyMode. A conquest sits
 *     around severity 0.6-0.8 while a high-pressure famine can hit 0.78, so a
 *     severity cut would miscall both. And conquest/coup/vassalization are
 *     applyMode:'auto' TODAY (see changeAuthorityPolicy.js), so an applyMode cut
 *     would miss every campaign-altering move. The signal is the shape of the
 *     outcome: a war footing, a power transfer, a vassalage, a government change.
 *
 *  2. resolveProposalToOutcome(outcome) — the deterministic resolver. It mirrors
 *     EXACTLY what applyWorldPulseProposal does to a stored proposal outcome
 *     before routing it through applyWorldPulseOutcomes: spread the outcome and
 *     stamp applyMode:'auto'. No fresh RNG draw, so auto-resolving a major is
 *     byte-identical to a DM clicking Apply.
 *
 * Stage 2 is ADDITIVE + BEHAVIOR-PRESERVING: autoresolve-ON still resolves
 * everything, majors[] is only SURFACED, and the flag-OFF path is untouched.
 */

/**
 * The candidateTypes whose outcomes are campaign-altering by their very shape.
 * Mirrors the `campaignAltering: true` entries in changeAuthorityPolicy.js (the
 * contract-tested canonical map). Kept as a Set for an O(1) structural check.
 *
 * @type {ReadonlySet<string>}
 */
const CAMPAIGN_ALTERING_CANDIDATE_TYPES = new Set([
  // War start: a settlement shifts its whole economy onto a war footing.
  'war_mobilization',
  // A settlement strategy that commits to opening a siege (deploy).
  'strategy_deploy',
  // Occupation/conquest: a fallen siege hands a settlement to an occupier.
  'conquest',
  // The terminal vassalage of an occupation that has run its course.
  'occupation_vassalized',
  // Succession/coup: the seat changes hands.
  'coup_succeeded',
  // A faction moving to change a settlement's government.
  'faction_government_challenge',
]);

/**
 * A power transfer is campaign-altering when its cause is a conquest or a coup —
 * the seat or the sovereignty of a settlement actually moves. (A power_transfer
 * carrying neither cause is not a structural authority flip.)
 *
 * @param {any} outcome
 * @returns {boolean}
 */
function isAuthorityTransfer(outcome) {
  if (outcome?.type !== 'power_transfer') return false;
  const cause = String(outcome?.powerTransfer?.cause || '');
  return cause === 'conquest' || cause === 'coup';
}

/**
 * A government_change proposal payload is campaign-altering: it relabels how the
 * settlement is governed. (factionCompetition emits this kind on the
 * faction_government_challenge candidate; checking the payload kind catches it
 * regardless of how the candidateType is spelled downstream.)
 *
 * @param {any} outcome
 * @returns {boolean}
 */
function isGovernmentChange(outcome) {
  return String(outcome?.proposalPayload?.kind || '') === 'government_change';
}

/**
 * Classify a selected outcome on STRUCTURAL markers alone.
 *
 * MAJOR (the DM should get a say once pausing lands): war start, occupation /
 * conquest, succession / coup, faction collapse / government change, terminal
 * vassalage. MINOR: everything else, however severe — a famine, an economic
 * shock, a relationship drift. Severity and applyMode are deliberately ignored.
 *
 * @param {any} outcome  a world-pulse outcome (the selectedForApply shape).
 * @returns {'major'|'minor'}
 */
export function deriveDecisionTier(outcome) {
  if (!outcome) return 'minor';
  if (CAMPAIGN_ALTERING_CANDIDATE_TYPES.has(String(outcome.candidateType || ''))) return 'major';
  if (isAuthorityTransfer(outcome)) return 'major';
  if (isGovernmentChange(outcome)) return 'major';
  return 'minor';
}

/**
 * Is this outcome a MAJOR? Convenience predicate over deriveDecisionTier.
 *
 * @param {any} outcome
 * @returns {boolean}
 */
export function isMajorOutcome(outcome) {
  return deriveDecisionTier(outcome) === 'major';
}

/**
 * The deterministic recommended-outcome resolver. Produces the EXACT outcome
 * applyWorldPulseProposal feeds to applyWorldPulseOutcomes: the stored outcome
 * with applyMode forced to 'auto'. No fresh RNG draw — auto-resolving a major is
 * byte-identical to a DM clicking Apply on the queued proposal.
 *
 * Stages 3+ use this to auto-resolve the majors a paused Advance chose to skip;
 * Stage 2 surfaces it without changing any call site.
 *
 * @param {any} outcome  a selected outcome (or a proposal's stored outcome).
 * @returns {any} the same outcome, applyMode:'auto'.
 */
export function resolveProposalToOutcome(outcome) {
  return { ...(outcome || {}), applyMode: 'auto' };
}

// ── E0 NARRATIVE TEMPO GOVERNOR — the drama-class registry (design §6) ─────────
//
// The composed drama engines each birth arcs of a DRAMA CLASS. The tempo governor
// paces the DENSITY of SPONTANEOUS births per class (never consequences). For that
// it needs a canonical class taxonomy AND a structural guarantee that every future
// spontaneous-birth producer NAMES its class (design §6: "a registration
// requirement, not a hope"). This registry is that manifest; the walker contract
// test (tests/domain/dramaClassRegistry.contract.test.js) enforces it.
//
// LAZY + any-cast free: this sits in the same lazy chunk as the pulse engine and is
// consumed only by narrativeTempo.js / candidateEvents.js / pulseKernel.js — never
// by an eager module — so it costs ZERO first-paint bytes.

/**
 * The seven drama classes (design §2). Priority order is codepoint-deterministic
 * for the simultaneity tiebreak (defer the LOWEST-priority class first) — never rng.
 * @typedef {'war'|'succession_coup'|'plague'|'calamity'|'schism_contest'|'economic_shock'|'boom_flourishing'} DramaClass
 */

/**
 * One producer's registration. Mirrors the contract-tested CHANGE_AUTHORITY_POLICY
 * shape (per-entry, source-anchored, vetoable).
 * @typedef {Object} DramaClassEntry
 * @property {DramaClass} class            the class this producer's births belong to
 * @property {'spontaneous'|'consequence'} birthKind  spontaneous births are governed; consequences are exempt by law
 * @property {boolean} wired               true ⇒ governed at the rollCandidates seam this wave; false ⇒ registered, wiring deferred (§2)
 * @property {string} module               the producing module (documentation only)
 * @property {string} rationale            why this class — the vetoable judgment record (§5.1)
 * @property {string} [ruleFamily]         when set, dramaClassOf additionally requires the candidate's ruleFamily to match (the strategy/war disambiguation)
 */

/**
 * Simultaneity priority (design §5.3): when live realm arcs saturate ARC_MAX, the
 * LOWEST-priority pending class defers first. Codepoint-stable, zero rng. Covers all
 * seven classes exactly once (walker-enforced). boom_flourishing is DECLARED here but
 * has no producer yet (a future rung) — it appears in the priority list, not the
 * registry.
 * @type {ReadonlyArray<DramaClass>}
 */
export const DRAMA_CLASS_PRIORITY = Object.freeze([
  'war', 'succession_coup', 'plague', 'calamity', 'schism_contest', 'economic_shock', 'boom_flourishing',
]);

/**
 * The drama-class registry (design §6). Keyed by the producer's stable candidateType
 * (for the wired seam producers) or a descriptive id (for the deferred bypass
 * producers, which never reach the seam). Every mapping is a vetoable JUDGMENT CALL
 * (§5.1). FROZEN.
 * @type {Readonly<Record<string, DramaClassEntry>>}
 */
export const DRAMA_CLASS_REGISTRY = Object.freeze({
  // ── WIRED spontaneous seam producers (governed this wave) ──
  // war: pressure-born war stressors + the strategy chooser's deploy move.
  stressor_birth_siege: { class: 'war', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A besieging force is an independent war-arc birth.' },
  stressor_birth_wartime: { class: 'war', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'Wartime pressure spawns a spontaneous war arc.' },
  stressor_birth_occupation: { class: 'war', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A pressure-born occupation stressor is a war arc (a conquest-CAUSED occupation is a consequence, caught by isChainedConsequence).' },
  strategy_deploy: { class: 'war', birthKind: 'spontaneous', wired: true, module: 'settlementStrategy.js', ruleFamily: 'strategy', rationale: 'A settlement committing to open a siege starts a war arc; disambiguated from other strategy moves by ruleFamily.' },
  // plague.
  stressor_birth_disease_outbreak: { class: 'plague', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A disease outbreak is the plague class.' },
  // calamity: magical/monster stressors give the calamity class a SEAM producer (the calamityKernel annual strike is the bypass producer, deferred below).
  stressor_birth_magic_deadzone: { class: 'calamity', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A magic deadzone is an environmental calamity.' },
  stressor_birth_magical_instability: { class: 'calamity', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'Magical instability is an environmental calamity.' },
  stressor_birth_monster_raider_pressure: { class: 'calamity', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'Monster/raider pressure is a calamity-shaped external threat.' },
  // succession_coup.
  stressor_birth_coup_detat: { class: 'succession_coup', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A coup d\'état is a succession/coup arc.' },
  stressor_birth_succession_void: { class: 'succession_coup', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A succession void is a succession/coup arc.' },
  stressor_birth_political_fracture: { class: 'succession_coup', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'political_fracture → succession_coup (architect ruling, vetoable): REALM_LABELS already groups it with succession_void as "The Succession Crisis".' },
  faction_government_challenge: { class: 'succession_coup', birthKind: 'spontaneous', wired: true, module: 'factionCompetition.js', rationale: 'A faction moving to change the government is a succession/coup contest.' },
  // schism_contest.
  stressor_birth_religious_conversion_fracture: { class: 'schism_contest', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A conversion fracture is a doctrinal contest.' },
  stressor_birth_insurgency: { class: 'schism_contest', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'An insurgency is an internal contest.' },
  stressor_birth_rebellion: { class: 'schism_contest', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A rebellion is an internal contest.' },
  stressor_birth_slave_revolt: { class: 'schism_contest', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'slave_revolt → schism_contest (architect ruling, vetoable): REALM_LABELS groups it with insurgency as "The Uprising".' },
  // economic_shock (FAMINE lives here — §5.1: a food-scarcity crisis is fundamentally economic).
  stressor_birth_market_shock: { class: 'economic_shock', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'A market shock is the economic-shock class.' },
  stressor_birth_indebtedness: { class: 'economic_shock', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'Indebtedness is an economic-shock arc.' },
  stressor_birth_famine: { class: 'economic_shock', birthKind: 'spontaneous', wired: true, module: 'stressors.js', rationale: 'FAMINE → economic_shock (§5.1 ruling, vetoable): the most common arc has no home among the seven; a food-scarcity crisis is fundamentally economic.' },

  // ── DEFERRED bypass producers (registered, wiring deferred — §2) ──
  // These birth outside rollCandidates (the annual idempotent draw / siege-hysteresis
  // accumulator / out-of-band deployment seed), each with a distinct persistence
  // nuance — better wired in its own focused change. They are opt-in/dormant today,
  // so deferral costs nothing while dormant. Keyed by a descriptive id (they never
  // reach the seam, so dramaClassOf never returns them).
  calamity_annual_strike: { class: 'calamity', birthKind: 'spontaneous', wired: false, module: 'calamityKernel.js', rationale: 'The annual calamity strike is a bypass producer (idempotent annual draw); governor wiring deferred.' },
  religious_contest_flip: { class: 'schism_contest', birthKind: 'spontaneous', wired: false, module: 'religiousContest.js', rationale: 'The religious conversion/betrayal flip births at probability 1 outside the seam; governor wiring deferred.' },
  war_mobilization_open: { class: 'war', birthKind: 'spontaneous', wired: false, module: 'warDeployment.js', rationale: 'Mobilization / siege-open is an out-of-band deployment seed (siege-hysteresis accumulator); governor wiring deferred.' },
});

/**
 * Stressor TYPES whose spontaneous births are DELIBERATELY un-governed (§5.1:
 * "safer un-governed than mis-governed"). The walker requires every STRESSOR_CATALOG
 * key to be either registered (as stressor_birth_<type>) or listed here with a reason.
 * Un-governed ⇒ dramaClassOf returns null ⇒ the governor never touches these (fail-open).
 * @type {Readonly<Record<string, string>>}
 */
export const EXEMPT_STRESSOR_TYPES = Object.freeze({
  // Plan §5.1 explicit exemptions (consequence-adjacent or genuinely ambiguous).
  mass_migration: 'A migration is consequence-adjacent (it is usually the OUTCOME of a famine/war arc, not an independent birth).',
  infiltration: 'Infiltration is a covert, ambiguous seed — safer un-governed than mis-paced.',
  criminal_corridor: 'A criminal corridor is a slow structural condition, not a spontaneous major-arc birth.',
  betrayal: 'A betrayal is a chain link inside another arc far more often than an independent birth.',
  // NOTE (architect ruling, 2026-07-14): political_fracture and slave_revolt were plan-gap
  // types the implementer conservatively exempted. Ruled GOVERNED instead — REALM_LABELS
  // already groups them ("The Succession Crisis" / "The Uprising"), so they are now
  // registered (succession_coup / schism_contest), not exempt.
});
