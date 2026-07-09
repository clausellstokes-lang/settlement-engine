/**
 * domain/factionRelationshipUpdate.js — Event → faction relationship deltas.
 *
 * Tier 4.2 of the roadmap. The first *active* derivation: it doesn't
 * just describe state, it describes how events would change state.
 *
 *   recalculateFactionRelationships(settlement, event) -> Update[]
 *
 * Returns an ARRAY OF DELTAS, never mutates. Each delta describes a
 * proposed change to a single faction's structural metric (power /
 * legitimacy / wealth / publicTrust / manpower) with a reason citing
 * the event that produced it.
 *
 * Consumers (the event-apply layer, the Tier 4.12 time-progression
 * narrator, the AI overlay's "what just changed" surface) decide
 * whether to commit, preview, or render the deltas. This module never
 * touches the settlement.
 *
 * Architectural fit:
 *   - Reads the structured profiles from Phase 9 (factionProfile.js) so
 *     archetype matches a single canonical vocabulary.
 *   - Reads the structured chain states from Phase 10 to know which
 *     faction controls the chain affected by a trade-route event.
 *   - The deltas it produces become the input to Tier 4.12 time
 *     progression and to Tier 4.10 escalation-clock advancement.
 *
 * Pure functions only. No imports from src/lib. No state, no I/O.
 */

import { deriveAllFactionProfiles } from './factionProfile.js';

// ── Event archetype → faction impact templates ───────────────────────────
//
// Each entry maps a high-level event archetype (which the caller passes
// directly OR which gets inferred from the legacy event registry below)
// to a per-archetype response profile. The profile lists structured
// deltas — power / legitimacy / publicTrust / wealth shifts — with the
// reason explaining the causal chain.
//
// Magnitudes are intentionally moderate (3–10 per delta). Multiple
// events compound; we don't want any single event to swing a faction
// from dominant to collapsed in one tick.

const ARCHETYPE_IMPACTS = Object.freeze({
  // ─────────────────────────────────────────────────────────────────────
  // PLAGUE — illness with collective response. Plays to whichever
  // faction tends the sick best (religious) and against whoever is
  // perceived as profiteering (merchant) or absent (governing).

  plague: {
    religious: [
      { field: 'legitimacy',  delta: +8,  reason: 'Plague relief organized by the temple lifts public trust.' },
      { field: 'publicTrust', delta: +6,  reason: 'Front-line care visible to the public.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -5,  reason: 'Civic authority blamed for slow or inadequate response.' },
    ],
    merchant: [
      { field: 'publicTrust', delta: -5,  reason: 'Suspicion of price gouging on grain and medicine.' },
      { field: 'wealth',      delta: +3,  reason: 'Higher demand for scarce goods raises margins.' },
    ],
    criminal: [
      { field: 'power',       delta: +4,  reason: 'Black-market medicine becomes a steady earner.' },
      { field: 'legitimacy',  delta: -2,  reason: 'Profit-from-suffering compounds existing fear.' },
    ],
    arcane: [
      { field: 'publicTrust', delta: +3,  reason: 'Healing magic, where present, draws cautious gratitude.' },
    ],
    military: [
      { field: 'manpower',    delta: -4,  reason: 'Quarantine duty + illness reduce available watch strength.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // TRADE_ROUTE_CUT — primary signal: merchant wealth falls; criminal
  // smuggling rises; council tax base shrinks.

  trade_route_cut: {
    merchant: [
      { field: 'wealth',     delta: -8, reason: 'Imports / exports interrupted; revenue contracts.' },
      { field: 'power',      delta: -4, reason: 'Reduced cash means reduced patronage and leverage.' },
    ],
    government: [
      { field: 'wealth',     delta: -4, reason: 'Tax base shrinks as trade volume falls.' },
      { field: 'legitimacy', delta: -3, reason: 'Civic authority blamed for failing to keep routes open.' },
    ],
    military: [
      { field: 'manpower',   delta: -2, reason: 'Watch wages slow as the tax base shrinks.' },
    ],
    criminal: [
      { field: 'power',      delta: +6, reason: 'Smuggling networks fill the gap; rates and volume rise.' },
      { field: 'wealth',     delta: +4, reason: 'Premium prices on illicit access.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CORRUPTION_EXPOSED — player or rumor surfaces a major scandal.
  // Hits the implicated faction; lifts the exposer's natural rival.

  corruption_exposed: {
    government: [
      { field: 'legitimacy',  delta: -10, reason: 'Public exposure erodes the moral authority to govern.' },
      { field: 'publicTrust', delta: -8,  reason: 'Trust collapses when the magistrate is the criminal.' },
    ],
    merchant: [
      { field: 'wealth',     delta: -5,  reason: 'Implicated merchants face boycotts or seizures.' },
      { field: 'legitimacy', delta: -4,  reason: 'Hoarding rumors become hoarding evidence.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +4, reason: 'Temple seen as moral counterweight; relief rolls grow.' },
    ],
    criminal: [
      { field: 'power',      delta: -3,  reason: 'Some corruption clients fall with their patrons.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // GRANARY_DESTROYED / FOOD_INSTITUTION_REMOVED — a food chain anchor
  // disappears. Compounding stress.

  food_anchor_lost: {
    government: [
      { field: 'legitimacy', delta: -6, reason: 'Civic authority blamed for failing to safeguard food stores.' },
    ],
    religious: [
      { field: 'legitimacy', delta: +5, reason: 'Temple relief becomes the only working food distribution.' },
      { field: 'publicTrust', delta: +4, reason: 'Visible charity in a moment of need.' },
    ],
    merchant: [
      { field: 'wealth',     delta: +4, reason: 'Scarce grain commands premium prices.' },
      { field: 'publicTrust', delta: -5, reason: 'Speculation suspicions sharpen.' },
    ],
    criminal: [
      { field: 'power',      delta: +5, reason: 'Black-market grain becomes a profitable specialty.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // DOMINANT_NPC_REMOVED — leader killed, exiled, or assigned away.
  // Hits the leader's own faction; opens space for rivals.

  dominant_npc_removed: {
    // Note: the *removed NPC's* faction takes the biggest hit. We
    // express this generically here (it applies to any archetype the
    // NPC happened to lead). The caller passes the NPC's archetype so
    // we can route the hit correctly.
    sameAsTarget: [
      { field: 'power',      delta: -6, reason: 'Loss of dominant leadership; the faction\'s ability to act in coordinated ways drops sharply.' },
      { field: 'legitimacy', delta: -4, reason: 'Succession crisis weakens public confidence in continuity.' },
    ],
    rival: [
      { field: 'power',      delta: +3, reason: 'A rival faction sees opportunity and consolidates.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // SIEGE_LIFTED — external pressure ends. Strong gains for everyone
  // but especially defenders + governing.

  siege_lifted: {
    military: [
      { field: 'legitimacy', delta: +6, reason: 'Defenders credited with the city\'s survival.' },
      { field: 'manpower',   delta: +3, reason: 'Recruitment surges in the relief.' },
    ],
    government: [
      { field: 'legitimacy', delta: +5, reason: 'Surviving the siege is the strongest legitimacy claim there is.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'Prayers vindicated.' },
    ],
    merchant: [
      { field: 'wealth',     delta: +4, reason: 'Reopened trade restores revenue.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // COVERAGE COMPLETION (E4-1): the 24 archetypes below close the gap to the
  // documented 1:1 claim in activeConditions.js — every condition archetype in
  // CONDITION_ARCHETYPE_TEMPLATES now routes a faction response on time-advance
  // instead of ticking silently. Same register as the six above: specific,
  // gameable, causal reasons; magnitudes 3–10; keyed by the factionProfile
  // archetype vocabulary (government / military / merchant / religious /
  // criminal / arcane / craft / occupation). The closed-set pin in
  // factionRelationshipUpdate.test.js guards the 1:1 against future drift.

  // ─────────────────────────────────────────────────────────────────────
  // FAMINE — food scarcity that has become a public crisis. The temple's
  // relief becomes the visible authority; the council wears the empty
  // granary; grain speculation reads as profiteering.
  famine: {
    government: [
      { field: 'legitimacy',  delta: -6, reason: 'Empty granaries are blamed on the authority that was meant to keep them full.' },
    ],
    religious: [
      { field: 'legitimacy',  delta: +5, reason: 'Temple relief rolls become the working food distribution.' },
      { field: 'publicTrust', delta: +5, reason: 'Soup lines and grain doles are visible charity.' },
    ],
    merchant: [
      { field: 'wealth',      delta: +4, reason: 'Scarce grain commands crisis prices.' },
      { field: 'publicTrust', delta: -6, reason: 'Hoarding suspicion hardens against anyone holding stores.' },
    ],
    criminal: [
      { field: 'power',       delta: +5, reason: 'Black-market grain becomes the season\'s reliable earner.' },
      { field: 'wealth',      delta: +4, reason: 'Desperation sets the price of a smuggled sack.' },
    ],
    military: [
      { field: 'manpower',    delta: -3, reason: 'Hungry watchmen desert or slow; ration duty thins the rolls.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // WAR_PRESSURE — conflict reshapes defense, trade, and expectations.
  // The garrison is suddenly indispensable; merchants lose their roads;
  // smugglers run contraband to both sides.
  war_pressure: {
    military: [
      { field: 'power',       delta: +6, reason: 'War makes the garrison the faction that matters; budgets and deference follow.' },
      { field: 'legitimacy',  delta: +4, reason: 'Standing between the settlement and the enemy is a strong claim to authority.' },
      { field: 'manpower',    delta: +3, reason: 'Mobilization and levies swell the ranks.' },
    ],
    government: [
      { field: 'wealth',      delta: -4, reason: 'War levies and requisitions drain the treasury.' },
      { field: 'legitimacy',  delta: -3, reason: 'The cost of war is charged to whoever declared it necessary.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -6, reason: 'Fighting closes roads and markets; caravans stop.' },
      { field: 'power',       delta: -3, reason: 'Coin buys less leverage when the sword sets the agenda.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'War economy — contraband arms, forged passes, deserters for hire.' },
      { field: 'wealth',      delta: +3, reason: 'Blockade-running commands a premium.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'The temple becomes the place people go with their fear.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // ALLIANCE_BURDEN — aid to an ally strains local capacity. Someone pays
  // for the ally's war, and it is felt as a levy at home.
  alliance_burden: {
    government: [
      { field: 'wealth',      delta: -5, reason: 'Subsidizing the ally is a standing charge on the treasury.' },
      { field: 'legitimacy',  delta: -3, reason: 'A war fought for someone else\'s cause is a resented burden.' },
    ],
    military: [
      { field: 'manpower',    delta: -4, reason: 'Troops sent to honor the alliance thin the home garrison.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -3, reason: 'Requisitioned supplies and diverted trade cut margins.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +2, reason: 'The temple frames sacrifice for an ally as shared duty.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // VASSAL_EXTRACTION — a superior settlement draws wealth, troops, or
  // legal authority upward. Local authority is visibly a subordinate one.
  vassal_extraction: {
    government: [
      { field: 'legitimacy',  delta: -6, reason: 'Authority ceded upward reads as a puppet council to the governed.' },
      { field: 'wealth',      delta: -5, reason: 'Tribute leaves before it can be spent locally.' },
    ],
    military: [
      { field: 'manpower',    delta: -4, reason: 'Levies raised for the overlord strip the local watch.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -4, reason: 'Tribute duties and forced trade terms bleed the counting-houses.' },
      { field: 'power',       delta: -3, reason: 'The guilds answer to a distant master, not the local council.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'Tribute evasion needs smugglers; the trade grows with the levy.' },
      { field: 'wealth',      delta: +3, reason: 'Every extra toll is a margin on getting around it.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REBELLION — local resistance organizes against an overlord or coercive
  // patron. Authority is openly defied; the streets are contested ground.
  rebellion: {
    government: [
      { field: 'legitimacy',  delta: -8, reason: 'Open defiance is the loudest possible statement that the mandate is gone.' },
      { field: 'power',       delta: -5, reason: 'A council that cannot hold its own streets cannot act.' },
    ],
    military: [
      { field: 'power',       delta: +3, reason: 'Suppression puts the sword at the center of every decision.' },
      { field: 'manpower',    delta: -4, reason: 'Street fighting bleeds the ranks and splits loyalties.' },
    ],
    criminal: [
      { field: 'power',       delta: +5, reason: 'Chaos is cover; the underworld arms and runs for whoever pays.' },
      { field: 'wealth',      delta: +3, reason: 'Barricades and curfews make every smuggled crate worth more.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'Sanctuary and mediation raise the temple\'s standing above the fray.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // FACTION_CHALLENGE — a major faction maneuvers to alter the power
  // balance. The incumbent is openly tested; backers pick sides.
  faction_challenge: {
    government: [
      { field: 'power',       delta: -5, reason: 'Being openly challenged is itself a loss of standing.' },
      { field: 'legitimacy',  delta: -4, reason: 'A contested seat looks like a weak one.' },
    ],
    merchant: [
      { field: 'power',       delta: +4, reason: 'The guilds bankroll the challenge and expect a return in influence.' },
    ],
    military: [
      { field: 'power',       delta: +3, reason: 'Whoever the swords back becomes the kingmaker.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Muscle and votes for sale to both sides of a contest.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // GOVERNMENT_OVERTHROWN — the ruling power has just changed hands.
  // Authority is being rebuilt under new masters; scores are settled.
  government_overthrown: {
    government: [
      { field: 'legitimacy',  delta: -8, reason: 'A regime that just fell has no accumulated legitimacy to spend.' },
      { field: 'power',       delta: -6, reason: 'Continuity of authority is broken; every rule is provisional.' },
    ],
    military: [
      { field: 'power',       delta: +5, reason: 'Whoever holds the barracks decided which way this went, and everyone knows it.' },
      { field: 'legitimacy',  delta: +3, reason: 'The force that installed the new order carries its early authority.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'A change of masters is a chance to settle old scores and seize the spoils.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -4, reason: 'Confiscations and uncertainty freeze the counting-houses.' },
      { field: 'publicTrust', delta: -3, reason: 'Whoever profited under the old order is suspect under the new.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'The temple outlasts regimes; continuity is its quiet claim.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // COUP_SUPPRESSED — an attempted seizure failed. Purges, loyalty tests,
  // and settling of scores follow. The survivor reasserts, harshly.
  coup_suppressed: {
    government: [
      { field: 'power',       delta: +5, reason: 'Surviving a coup and purging the plotters is a hard reassertion of control.' },
      { field: 'legitimacy',  delta: +3, reason: 'Holding the seat through an attempt is its own vindication.' },
      { field: 'publicTrust', delta: -4, reason: 'Purges and loyalty tests are watched with unease, not gratitude.' },
    ],
    military: [
      { field: 'manpower',    delta: -4, reason: 'Implicated ranks are purged; the officer corps is thinned by suspicion.' },
      { field: 'power',       delta: -3, reason: 'A garrison caught plotting loses its standing at the table.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'An informant economy pays well when everyone is proving loyalty.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +2, reason: 'Calls for reconciliation position the temple above the reprisals.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // STRESSOR_RESIDUAL — a resolved crisis still leaves social, economic,
  // or institutional scars. Muted magnitudes: the recovery is real but slow.
  stressor_residual: {
    government: [
      { field: 'legitimacy',  delta: -3, reason: 'The blame for a passed crisis lingers longer than the crisis did.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -3, reason: 'Trade recovers slowly; confidence returns before the ledgers do.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'Rebuilding and remembrance keep the temple visible after the worst.' },
    ],
    criminal: [
      { field: 'power',       delta: +2, reason: 'Footholds seized during the crisis do not vacate when it ends.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // CUSTOM_CRISIS — an authored crisis with no richer archetype. Broad,
  // moderate response so an unmapped crisis still moves the faction board.
  custom_crisis: {
    government: [
      { field: 'legitimacy',  delta: -4, reason: 'A crisis on the authority\'s watch is charged to the authority.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'The temple steps into the relief role a crisis opens.' },
    ],
    merchant: [
      { field: 'publicTrust', delta: -3, reason: 'Anyone seen profiting from the disruption draws suspicion.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Disorder is opportunity; the underworld reads a crisis as an opening.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // MAGICAL_INSTABILITY — magic surging, failing, or fallen silent. The
  // arcane faction is blamed and feared; the temple gains as its foil.
  magical_instability: {
    arcane: [
      { field: 'publicTrust', delta: -6, reason: 'Misbehaving magic reads as the arcane faction\'s failure, whoever\'s fault it was.' },
      { field: 'power',       delta: -4, reason: 'Patrons and apprentices drift away from an unreliable craft.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +5, reason: 'The temple offers a safer authority when the arcane turns dangerous.' },
      { field: 'legitimacy',  delta: +4, reason: 'Fear of wild magic drives the faithful toward the older order.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -3, reason: 'Failure to regulate the arcane is charged to the council.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Unstable reagents and ley-tapping become a lucrative contraband line.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_IMPORT_SHORTAGE — a regional supplier can no longer meet an
  // important import need. Merchants scramble; smugglers fill the gap.
  regional_import_shortage: {
    merchant: [
      { field: 'wealth',      delta: -5, reason: 'A severed supplier leaves shelves and warehouses short.' },
      { field: 'power',       delta: -3, reason: 'A guild that cannot deliver loses its leverage.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -4, reason: 'Shortages on the shelves are blamed on the authority above them.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'Smuggled substitutes for a missing import are a ready market.' },
      { field: 'wealth',      delta: +3, reason: 'Scarcity sets the smuggler\'s price.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'Rationing relief keeps the temple on the right side of the shortage.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_EXPORT_MARKET_LOSS — a connected market stops buying at
  // normal volume. The exporters and their craftsmen sit on unsold stock.
  regional_export_market_loss: {
    merchant: [
      { field: 'wealth',      delta: -6, reason: 'A lost buyer leaves warehouses full and revenue empty.' },
      { field: 'power',       delta: -3, reason: 'Export leverage evaporates when there is no one to sell to.' },
    ],
    government: [
      { field: 'wealth',      delta: -4, reason: 'Export duties fall with the shipments they were charged on.' },
    ],
    craft: [
      { field: 'wealth',      delta: -4, reason: 'Guild workshops make goods no market will take.' },
      { field: 'power',       delta: -2, reason: 'Idle looms and cold forges weaken the guild\'s hand.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Distress goods and grey-market fencing move the surplus quietly.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_ROUTE_DISRUPTION — a connected trade route transmits regional
  // disruption. Trade stumbles; alternative routes belong to smugglers.
  regional_route_disruption: {
    merchant: [
      { field: 'wealth',      delta: -5, reason: 'A route in trouble interrupts the caravans that pay the bills.' },
    ],
    criminal: [
      { field: 'power',       delta: +5, reason: 'When the honest road closes, the smuggler\'s road is the only one open.' },
      { field: 'wealth',      delta: +4, reason: 'Premium prices on any goods that still arrive.' },
    ],
    government: [
      { field: 'wealth',      delta: -3, reason: 'Transit tolls fall with the traffic they taxed.' },
      { field: 'legitimacy',  delta: -2, reason: 'A council is expected to keep its roads working.' },
    ],
    military: [
      { field: 'manpower',    delta: -2, reason: 'Escort and patrol duty on a troubled route stretches the watch.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_AUTHORITY_INSTABILITY — a governing or patron settlement
  // transmits political instability down the channel.
  regional_authority_instability: {
    government: [
      { field: 'legitimacy',  delta: -5, reason: 'A patron\'s instability infects the authority that leans on it.' },
      { field: 'power',       delta: -3, reason: 'Orders from an unsteady superior carry less weight locally.' },
    ],
    military: [
      { field: 'power',       delta: +3, reason: 'When civil authority wavers, the faction with the swords gains say.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'Political uncertainty is cover; enforcement looks the other way.' },
      { field: 'wealth',      delta: +3, reason: 'A distracted watch is a cheap watch to work around.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +3, reason: 'A steady institution gains when the political ground shifts.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_TAX_REVENUE_DISRUPTION — a tributary or client can no longer
  // meet obligations. The treasury feels it; wages and enforcement slip.
  regional_tax_revenue_disruption: {
    government: [
      { field: 'wealth',      delta: -5, reason: 'A client\'s missed obligations open a hole in the ledger.' },
      { field: 'legitimacy',  delta: -3, reason: 'A treasury that cannot pay its bills loses face.' },
    ],
    military: [
      { field: 'manpower',    delta: -3, reason: 'Watch wages slow when the revenue does; some walk.' },
    ],
    merchant: [
      { field: 'power',       delta: +3, reason: 'Creditors to a strapped treasury gain quiet leverage over it.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Protection rackets fill the space a thinning watch leaves.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_PROTECTION_GAP — a protector or ally is less able to project
  // military support. The settlement is suddenly exposed.
  regional_protection_gap: {
    military: [
      { field: 'manpower',    delta: -4, reason: 'The protector\'s withdrawn strength was counted in the local order of battle.' },
      { field: 'legitimacy',  delta: -3, reason: 'A garrison that cannot promise safety loses standing.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -4, reason: 'The authority that relied on a distant shield is caught exposed.' },
    ],
    criminal: [
      { field: 'power',       delta: +5, reason: 'A thinner watch is an open door for the underworld.' },
      { field: 'wealth',      delta: +3, reason: 'Extortion and theft flourish where enforcement retreats.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -3, reason: 'Roads and warehouses are less safe without the protector\'s reach.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_SERVICE_DISRUPTION — a settlement that provides regional
  // services (healing, records, schooling) is under strain.
  regional_service_disruption: {
    religious: [
      { field: 'publicTrust', delta: -3, reason: 'Overwhelmed charity and healing cannot meet the demand they usually do.' },
      { field: 'legitimacy',  delta: -2, reason: 'A pastoral role that falters is a claim to authority that weakens.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -3, reason: 'Services faltering on the council\'s watch are the council\'s problem.' },
    ],
    merchant: [
      { field: 'wealth',      delta: +3, reason: 'Private substitutes for a failing service command a premium.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Unlicensed practitioners and quacks fill the gap a strained service leaves.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // COLD_WAR_SANCTIONS — inspections, sanctions, or informal embargoes
  // tighten daily trade. The honest merchant loses; the smuggler wins.
  cold_war_sanctions: {
    merchant: [
      { field: 'wealth',      delta: -5, reason: 'Sanctioned goods and inspected cargo cut deep into legitimate trade.' },
      { field: 'publicTrust', delta: -3, reason: 'Empty shelves are laid at the guilds\' door whatever the cause.' },
    ],
    criminal: [
      { field: 'power',       delta: +5, reason: 'Sanctions-busting is the underworld\'s ideal business — banned goods, ready buyers.' },
      { field: 'wealth',      delta: +5, reason: 'The embargo sets the smuggler\'s margin.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -3, reason: 'An economic squeeze is felt as a failure of the authority under it.' },
    ],
    military: [
      { field: 'manpower',    delta: -2, reason: 'Inspection and interdiction duty ties down the watch.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_CONFLICT_PRESSURE — conflict pressure spills across a
  // confirmed regional channel. The garrison mobilizes; trade hunkers down.
  regional_conflict_pressure: {
    military: [
      { field: 'power',       delta: +5, reason: 'Spillover conflict makes the garrison the faction that sets the agenda.' },
      { field: 'manpower',    delta: +3, reason: 'Mobilization against the regional threat swells the ranks.' },
      { field: 'legitimacy',  delta: +3, reason: 'Guarding against a nearing war is a strong claim to deference.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -5, reason: 'Trade shrinks back from a route that could become a front.' },
    ],
    government: [
      { field: 'wealth',      delta: -4, reason: 'A war footing is paid for out of the treasury.' },
      { field: 'legitimacy',  delta: -2, reason: 'The cost and fear of nearing conflict wear on the council.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'Contraband arms and war profiteering follow the pressure.' },
      { field: 'wealth',      delta: +3, reason: 'Every crisis on the border is a premium on getting goods across it.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_MIGRATION_PRESSURE — a nearby shock pushes people across the
  // network. Relief work, cheap labor, housing strain, and recruitment.
  regional_migration_pressure: {
    government: [
      { field: 'legitimacy',  delta: -5, reason: 'Housing, food, and order strain under an influx the council did not plan for.' },
    ],
    religious: [
      { field: 'legitimacy',  delta: +5, reason: 'Refugee relief becomes the temple\'s most visible work.' },
      { field: 'publicTrust', delta: +5, reason: 'Feeding and sheltering the displaced is charity anyone can see.' },
    ],
    merchant: [
      { field: 'wealth',      delta: +3, reason: 'A wave of cheap labor and new demand widens margins.' },
      { field: 'publicTrust', delta: -3, reason: 'Gouging on rents and bread against the newcomers draws anger.' },
    ],
    criminal: [
      { field: 'power',       delta: +4, reason: 'The desperate and undocumented are the underworld\'s easiest recruits.' },
      { field: 'wealth',      delta: +3, reason: 'Smuggled papers, passage, and off-books work all pay.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_INFORMATION_SHOCK — news, rumor, or panic from a connected
  // settlement shapes local politics. Confidence, not goods, is the stake.
  regional_information_shock: {
    government: [
      { field: 'legitimacy',  delta: -4, reason: 'Rumor and panic undermine an authority faster than any army.' },
    ],
    religious: [
      { field: 'publicTrust', delta: +4, reason: 'A trusted voice amid the panic gathers the frightened.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -3, reason: 'Panic markets and rumor-driven runs eat into the ledgers.' },
      { field: 'publicTrust', delta: -2, reason: 'Whoever seems to profit from the panic is blamed for it.' },
    ],
    criminal: [
      { field: 'power',       delta: +3, reason: 'Rumor is a tool; fraud and manufactured panic move coin.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_CRIMINAL_PRESSURE — a criminal corridor transmits opportunism
  // or instability. The underworld is the headline gainer.
  regional_criminal_pressure: {
    criminal: [
      { field: 'power',       delta: +6, reason: 'A live criminal corridor pushes muscle, contraband, and contacts inward.' },
      { field: 'wealth',      delta: +4, reason: 'Corridor spillover is a standing revenue stream for the local underworld.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -4, reason: 'Rising crime is charged to the authority that failed to stop it.' },
      { field: 'publicTrust', delta: -3, reason: 'People who feel unsafe trust the council less.' },
    ],
    military: [
      { field: 'manpower',    delta: -3, reason: 'A watch stretched thin across new crime cannot be everywhere.' },
    ],
    merchant: [
      { field: 'wealth',      delta: -4, reason: 'Extortion and theft along the corridor are a tax on honest trade.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // REGIONAL_RELIGIOUS_PRESSURE — religious authority or crisis echoes
  // through connected institutions. Faith is stirred; a schism divides.
  regional_religious_pressure: {
    religious: [
      { field: 'power',       delta: +4, reason: 'A regional religious surge draws the faithful and the funds toward the temple.' },
      { field: 'publicTrust', delta: -4, reason: 'Schism and controversy split a congregation against itself.' },
    ],
    government: [
      { field: 'legitimacy',  delta: -3, reason: 'A council caught between religious factions satisfies neither.' },
    ],
    merchant: [
      { field: 'publicTrust', delta: -2, reason: 'Boycotts and preference along sect lines fracture the market.' },
    ],
    criminal: [
      { field: 'power',       delta: +2, reason: 'A divided settlement is an easier one to work the seams of.' },
    ],
  },
});

// ── Legacy event-type → archetype mapping ───────────────────────────────
//
// Bridges the existing event registry's vocabulary (ADD_INSTITUTION,
// REMOVE_INSTITUTION, etc.) onto the higher-level archetypes used in
// ARCHETYPE_IMPACTS. Some events map cleanly; some need contextual
// inference (e.g. REMOVE_INSTITUTION → 'food_anchor_lost' iff the
// target was a granary). The caller can also pass an archetype
// directly via `event.factionImpactArchetype` to bypass inference.

const FOOD_INSTITUTION_PATTERNS = /granary|mill|bakery|farm|orchard|fishery/i;

/**
 * @typedef {{ type?: string, targetId?: string, factionImpactArchetype?: string }} EventLike
 */

/**
 * @typedef {{ field: string, delta: number, reason: string }} DeltaSpec
 */

/**
 * @typedef {{ factionId: string, factionName?: string, archetype?: string, field: string, delta: number | string, eventType?: string, eventTargetId?: (string | null) }} FactionUpdate
 */

/**
 * @param {EventLike | null | undefined} event
 * @returns {string | null}
 */
function inferEventArchetype(event) {
  if (!event) return null;

  // Explicit override — callers can pass `event.factionImpactArchetype`
  // to use a specific archetype regardless of the event type.
  if (typeof event.factionImpactArchetype === 'string') {
    return event.factionImpactArchetype;
  }

  switch (event.type) {
    case 'CUT_TRADE_ROUTE':
      return 'trade_route_cut';
    case 'REMOVE_INSTITUTION':
    case 'DAMAGE_INSTITUTION':
    case 'IMPAIR_INSTITUTION':
      if (typeof event.targetId === 'string' && FOOD_INSTITUTION_PATTERNS.test(event.targetId)) {
        return 'food_anchor_lost';
      }
      return null;
    case 'KILL_NPC':
      // The dominant-NPC-removed archetype requires knowing the
      // removed NPC's rank, which the registry doesn't pass through.
      // Callers wanting this archetype should pass it explicitly via
      // factionImpactArchetype or a wrapper that inspects the NPC.
      return null;
    default:
      return null;
  }
}

// ── Faction match helpers ────────────────────────────────────────────────

/**
 * @param {unknown} s
 * @returns {string}
 */
function snakeCase(s) {
  return String(s).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

/**
 * @param {unknown} name
 * @returns {string | null}
 */
function factionIdFromName(name) {
  if (!name) return null;
  return `faction.${snakeCase(name)}`;
}

// ── Composer ────────────────────────────────────────────────────────────

/**
 * Compute structured faction-relationship deltas for an event.
 *
 * Pure; idempotent; does not mutate the settlement. Returns an empty
 * array when the event archetype can't be inferred or the settlement
 * has no factions.
 *
 * The caller can pass `archetype` directly to skip inference:
 *
 *   recalculateFactionRelationships(settlement, { type: 'PLAGUE' }, { archetype: 'plague' })
 *
 * @param {Object} settlement
 * @param {EventLike} event              { type, targetId?, factionImpactArchetype?, … }
 * @param {{ archetype?: string, targetNpc?: { archetype?: string, factionLink?: string, id?: string } }} [options]
 * @returns {FactionUpdate[]} Updates.
 */
export function recalculateFactionRelationships(settlement, event, options = {}) {
  if (!settlement || !event) return [];

  const archetype = options.archetype || inferEventArchetype(event);
  if (!archetype) return [];

  const impacts = /** @type {Record<string, Record<string, DeltaSpec[]>>} */ (ARCHETYPE_IMPACTS)[archetype];
  if (!impacts) return [];

  const profiles = deriveAllFactionProfiles(settlement);
  if (profiles.length === 0) return [];

  const out = [];

  // ── dominant_npc_removed gets its own routing logic ────────────────
  // The removed NPC's faction takes the sameAsTarget hits; one rival
  // faction (top non-same-archetype faction) gets the 'rival' bump.
  if (archetype === 'dominant_npc_removed') {
    const targetNpc = options.targetNpc;
    if (!targetNpc || !targetNpc.archetype) return [];

    const targetFactionId = targetNpc.factionLink;

    // Find the affected faction (same as target) and a rival.
    let affected = null;
    let rival = null;
    let rivalPower = -Infinity;
    for (const p of profiles) {
      const sameByLink = targetFactionId && p.id === targetFactionId;
      const sameByArchetype = !targetFactionId && p.archetype === targetNpc.archetype;
      if (sameByLink || sameByArchetype) {
        if (!affected) affected = p;
        continue;
      }
      // Track strongest non-matching faction as rival.
      if ((p.power ?? 0) > rivalPower) {
        rivalPower = p.power ?? 0;
        rival = p;
      }
    }

    if (affected) {
      for (const delta of impacts.sameAsTarget) {
        out.push({
          factionId: affected.id,
          factionName: affected.name,
          archetype: affected.archetype,
          field: delta.field,
          delta: delta.delta,
          reason: delta.reason,
          eventType: event.type || 'KILL_NPC',
          eventTargetId: event.targetId || targetNpc.id || null,
        });
      }
    }
    if (rival) {
      for (const delta of impacts.rival) {
        out.push({
          factionId: rival.id,
          factionName: rival.name,
          archetype: rival.archetype,
          field: delta.field,
          delta: delta.delta,
          reason: delta.reason,
          eventType: event.type || 'KILL_NPC',
          eventTargetId: event.targetId || targetNpc.id || null,
        });
      }
    }
    return out;
  }

  // ── Standard archetype-keyed impact ────────────────────────────────
  for (const profile of profiles) {
    const deltas = impacts[profile.archetype];
    if (!deltas) continue;
    for (const d of deltas) {
      out.push({
        factionId: profile.id,
        factionName: profile.name,
        archetype: profile.archetype,
        field: d.field,
        delta: d.delta,
        reason: d.reason,
        eventType: event.type || archetype.toUpperCase(),
        eventTargetId: event.targetId || null,
      });
    }
  }

  return out;
}

// ── Diagnostic helpers ──────────────────────────────────────────────────

/**
 * Aggregate updates by faction. Returns
 *   { 'faction.<id>': { name, archetype, deltas: { power, legitimacy, … } } }
 * with summed numeric deltas per field. Useful for the "net change per
 * faction" surface and for Tier 4.12 forecast tooling.
 */
/**
 * @param {FactionUpdate[]} updates
 * @returns {Record<string, { factionId: string, factionName?: string, archetype?: string, deltas: Record<string, number> }>}
 */
export function summarizeByFaction(updates) {
  /** @type {Record<string, { factionId: string, factionName?: string, archetype?: string, deltas: Record<string, number> }>} */
  const out = {};
  for (const u of updates || []) {
    if (typeof u.delta !== 'number') continue; // skip band changes for now
    if (!out[u.factionId]) {
      out[u.factionId] = {
        factionId: u.factionId,
        factionName: u.factionName,
        archetype: u.archetype,
        deltas: {},
      };
    }
    out[u.factionId].deltas[u.field] = (out[u.factionId].deltas[u.field] || 0) + u.delta;
  }
  return out;
}

/**
 * Convenience: which event archetypes does this module support?
 * Used by drift-detection tests + the dev simulation debugger.
 */
export function supportedArchetypes() {
  return Object.keys(ARCHETYPE_IMPACTS);
}

// Re-export factionIdFromName so callers can construct stable ids when
// needed (e.g. wrapping a legacy event with a target-faction hint).
export { factionIdFromName };
