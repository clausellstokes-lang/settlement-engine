/**
 * domain/events/registryProse.js — composer-facing prose for the event
 * registry: each event type's `description` (the composer's explainer line)
 * and `targetPrompt` (the target field's placeholder/hint).
 *
 * WHY ITS OWN MODULE (the registry-prose split, first-paint program FP-1):
 * EVENT_REGISTRY rides the EAGER entry chunk — the store's event pipeline
 * (validation, stateDeltas, narrate) is statically reachable from first
 * paint. But description/targetPrompt are read ONLY by the lazy DM composer
 * surfaces (EventComposer / BatchCart / EventComposerTargetField via the
 * spec prop). Keeping ~5 kB of composer prose inside the eager registry made
 * first paint pay for strings no first-paint view can render. The prose now
 * lives here and is folded back into the specs by registryFull.js, which the
 * composer surfaces import instead of registry.js — same spec objects, same
 * fields, zero eager bytes.
 *
 * FIRST-PAINT LAW: never import this module (or registryFull.js) from the
 * store / domain event pipeline / any eager module — that re-drags the prose
 * into the entry closure. Registry entries must keep their functional fields
 * (label, requiresTarget, stateDeltas, narrate, …) in registry.js; only
 * composer-facing prose belongs here.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

/**
 * @type {Record<string, { description?: string, targetPrompt?: string }>}
 */
export const EVENT_PROSE = {
  ADD_INSTITUTION: {
    description: 'A new institution is established. New civic capacity, new factional weight.',
    targetPrompt: 'Institution name (e.g. "Granary", "Temple of Mercy")',
  },
  REMOVE_INSTITUTION: {
    description: 'An institution closes or is dissolved. Its services and authority disappear.',
    targetPrompt: 'Institution name to remove',
  },
  DAMAGE_INSTITUTION: {
    description: 'An institution is damaged but not destroyed. Reduced capacity, recoverable.',
    targetPrompt: 'Institution name to damage',
  },
  DEPLETE_RESOURCE: {
    description: 'A resource node is exhausted, contaminated, or otherwise lost.',
    targetPrompt: 'Resource name (e.g. "iron vein", "river fish")',
  },
  CUT_TRADE_ROUTE: {
    description: 'A trade route is closed, blockaded, or rendered unsafe. Imports/exports stall.',
    targetPrompt: 'Optional: which route (e.g. "river road", "south bridge")',
  },
  SETTLEMENT_DISPUTE: {
    description: 'A dispute sours relations with a neighbouring settlement, downgrading the relationship.',
    targetPrompt: 'Neighbouring settlement',
  },
  DESTROY_SETTLEMENT: {
    description: 'The settlement is destroyed, abandoned, or rendered uninhabitable. Kept as campaign history rather than deleted.',
    targetPrompt: 'Optional cause (e.g. "dragon fire", "flood", "siege")',
  },
  ADD_NPC: {
    description: 'A new NPC arrives, is appointed, inherits office, or is recruited.',
    targetPrompt: 'NPC name (or "role @ institution" — e.g. "High Priestess @ Temple")',
  },
  KILL_NPC: {
    description: 'An NPC dies, is exiled, or otherwise leaves play. Linked institutions and factions are affected.',
    targetPrompt: 'NPC name to remove',
  },
  ASSIGN_NPC_TO_ROLE: {
    description: 'Place an NPC into an institution role, partially or fully restoring vacated capacity.',
    targetPrompt: 'NPC name to assign',
  },
  IMPAIR_INSTITUTION: {
    description: 'Mark an institution as impaired along a chosen dimension (legitimacy, influence, capacity, etc.).',
    targetPrompt: 'Institution name',
  },
  RESTORE_INSTITUTION: {
    description: 'Recovery from a prior impairment. Removes impairments tagged with the chosen cause event.',
    targetPrompt: 'Institution name',
  },
  IMPAIR_FACTION: {
    description: 'A faction loses leadership, legitimacy, wealth, or another dimension.',
    targetPrompt: 'Faction name',
  },
  RESTORE_FACTION: {
    description: 'A faction recovers from a prior impairment.',
    targetPrompt: 'Faction name',
  },
  ADD_FACTION: {
    description: 'A new faction forms or arrives: a guild, cult, syndicate, or noble bloc. A fresh contender for power and influence.',
    targetPrompt: 'Faction name (e.g. "Dockworkers Guild", "Ashen Hand")',
  },
  KILL_LEADER: {
    description: 'The settlement\'s ruling figure dies, is exiled, or is removed. Major consequences for legitimacy and faction balance.',
    targetPrompt: 'Leader\'s name (NPC)',
  },
  EXPOSE_CORRUPTION: {
    description: 'A corrupt NPC is publicly revealed (or a faction/institution). The NPC is cleaned + scarred, and both the criminal institution they answered to and their home institution are tarnished; legitimacy collapses and rivals exploit the vacuum.',
    targetPrompt: 'Corrupt NPC, faction, or institution name',
  },
  IMPOSE_CORRUPTION: {
    description: 'A criminal organization in the settlement gets its hooks into a clean NPC. The NPC becomes COVERTLY corrupt and tied to that organization — so the dossier flags them, faction capture advances from the new corrupt seat, and a future Expose Corruption brings the reckoning. Quieter than exposure: the rot is hidden, not yet public.',
    targetPrompt: 'Clean NPC to turn (pick the organization below)',
  },
  REFUGEE_WAVE: {
    description: 'A surge of refugees arrives. Population spikes; food security and infrastructure strain. Faction politics shift.',
    targetPrompt: 'Optional: source region (e.g. "the eastern border")',
  },
  PLAGUE: {
    description: 'A disease outbreak. Population pressure on healing institutions; quarantine erodes order; faction responses diverge sharply.',
    targetPrompt: 'Optional: disease name (e.g. "Red Cough")',
  },
  RAID_OR_MONSTER_ATTACK: {
    description: 'External force strikes — bandits, monsters, an enemy patrol. Defenders mobilize; civilians take losses.',
    targetPrompt: 'Optional: source (e.g. "frost trolls", "Iron Crow bandits")',
  },
  REMOVED_THREAT: {
    description: 'Players neutralized an active threat. External pressure eases, defenders recover footing.',
    targetPrompt: 'Optional: threat name (e.g. "bandit captain", "blight fey")',
  },
  BROKERED_ALLIANCE: {
    description: 'Formalize an alliance with a neighbouring settlement. Relations become Allied; volatility settles and mutual defense improves.',
    targetPrompt: 'Neighbouring settlement',
  },
  STARTED_RIOT: {
    description: 'Players triggered or fanned a public disturbance. Legitimacy slips; criminal opportunity rises.',
    targetPrompt: 'Optional: district or trigger (e.g. "Lower Quarter")',
  },
  OPENED_TRADE_ROUTE: {
    description: 'Open a trade relationship with a neighbouring settlement. Imports flow, merchant wealth rises, smuggling premiums collapse.',
    targetPrompt: 'Neighbouring settlement',
  },
  RECOVERED_RESOURCE: {
    description: 'A previously depleted or lost resource is recovered or replenished. Resource pressure eases.',
    targetPrompt: 'Resource name (e.g. "iron vein", "river fish")',
  },
  APPLY_STRESSOR: {
    description: 'An active crisis grips the settlement — pick any stressor from the full catalog, including your custom ones. Logged as an in-world onset; the matching condition feeds the causal substrate, and in a canon campaign it also becomes a roaming world-pulse stressor.',
    targetPrompt: 'Stressor (from the catalog)',
  },
  CHANGE_RULING_POWER: {
    description: "Hand the government to a different authoritative power — coup, election, succession, conquest, or appointment. The governing body persists; who commands it changes, and the government type reshapes to the new power's preference.",
    targetPrompt: 'Faction that takes power',
  },
  RESOLVE_STRESSOR: {
    description: 'An active crisis ends — pick one of the settlement\'s current stressors. The stress entry is removed, its promoted condition winds down, and in a canon campaign the roaming world-pulse twin resolves with its residual aftermath.',
    targetPrompt: 'Stressor currently gripping the settlement',
  },
  ADD_TRADE_GOOD: {
    description: 'A new good enters the settlement\'s trade profile — exported, imported, or (for an entrepôt) re-exported in transit through its warehouses.',
    targetPrompt: 'Good label (e.g. "Salted fish", "Rare spices")',
  },
  REMOVE_TRADE_GOOD: {
    description: 'A good drops out of the settlement\'s trade profile — the market moved on, the supplier dried up, or the route no longer carries it.',
    targetPrompt: 'Trade good to remove',
  },
  ADD_RESOURCE: {
    description: 'A new resource node is discovered or opened nearby — a vein struck, fields cleared, grounds claimed. Supply chains can activate on the next rederivation.',
    targetPrompt: 'Resource (from the catalog, or a custom name)',
  },
  SET_PRIMARY_DEITY: {
    description: 'A settlement adopts (or sheds) its patron deity — the leading creed of the pantheon. The resolved deity snapshot is embedded on the settlement record so the religion substrate reads it without ever touching the custom-content store. No deity ⇒ the religion layer stays dormant.',
  },
  IMPOSE_CULT: {
    description: "A cult-level deity is seeded into the settlement BENEATH the patron — a secondary faith taking root in its own niche (temperament × alignment). Large settlements sustain more cults across the niche grid; small ones reconcile by displacing the weakest cult, or refuse when only the patron's slot remains. The resolved snapshot is embedded on the settlement so the religion substrate reads it without touching the custom-content store.",
  },
  SHIFT_TIER: {
    description: "Force the settlement up or down one size tier (thorp through metropolis), a DM override of the organic growth-and-decline drift. Population resettles into the new tier's band, and the institution roster reconciles exactly as an organic shift would: a promotion raises the institutions the larger tier sustains, while a demotion leaves the ones it can no longer support behind as ruined remnants (a watch-post where a garrison stood, a privatized market, a hollowed-out hall) rather than erasing them.",
  },
  REMOVE_RESOURCE: {
    description: 'A resource node is lost outright — claimed by another power, rendered unreachable, or struck from the map. Harsher than depletion: nothing is left to recover.',
    targetPrompt: 'Nearby resource to remove',
  },
  PROMOTE_NPC: {
    description: 'An NPC rises within their faction, swapping standing (importance, influence, structural rank) with a chosen peer of the same faction. The peer is displaced downward.',
    targetPrompt: 'NPC who rises',
  },
  DEMOTE_NPC: {
    description: 'An NPC is pushed down the ranks of their faction, swapping standing (importance, influence, structural rank) with a chosen peer of the same faction who steps over them.',
    targetPrompt: 'NPC who falls',
  },
  FORCE_RELIEF: {
    description: 'Decree a gift of grain to a qualifying neighbour — an ally, trade partner, or vassal/patron. Only grain above the hard reserve floor can go (the DM overrides the willingness, never the law); shipping it out is charity with a political price at home.',
    targetPrompt: 'Qualifying neighbour to relieve',
  },
  CREATE_ROUTE: {
    description: 'Charter a road between this settlement and another of your realm. The path follows the map: mountains, forest, and open country each price it differently, and two settlements the sea already links charter a water route instead. A route you charter is yours, and every later rebuild of the world keeps it.',
    targetPrompt: 'Settlement to charter a road to',
  },
  OFFER_CREDIT: {
    description: 'Extend grain to a qualifying neighbour as a LOAN — the same wagons, a ledger behind them. Only grain above the hard reserve floor can go; a loan is not charity, so it spends no legitimacy. Maturity, repayment, and default play out with the living world.',
    targetPrompt: 'Qualifying neighbour to lend to',
  },
};
