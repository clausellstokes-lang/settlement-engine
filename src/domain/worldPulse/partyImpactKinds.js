/**
 * domain/worldPulse/partyImpactKinds.js — the party-impact vocabulary,
 * isolated in a dependency-free leaf module (same pattern as
 * simulationRules.js / worldState.js: light leaves that eager code may
 * import statically without touching the simulation graph).
 *
 * Catalog of party impact kinds. `targets` documents the fields the DM must
 * supply; `defaultMagnitude` is the decisiveness (0..1) when unspecified. This
 * is exported so a UI can render the picker and validate input.
 *
 * Why a leaf: domain/events/partyEventLinkage.js (eager — reached from
 * settlementSlice on first paint) needs ONLY this const. Importing it from
 * partyImpact.js kept partyImpact's whole top-level import graph
 * (applyWorldPulse → relationshipEvolution / npcAgency / factionCompetition /
 * relationshipMemory / institutionLifecycle / tier+population dynamics) in
 * the entry chunk even after the store's world-pulse edges went dynamic —
 * extracting it cut 152 kB (minified) off the first-paint closure.
 * partyImpact.js re-exports this, so simulation-side importers and the
 * worldPulse barrel are unaffected.
 */
export const PARTY_IMPACT_KINDS = Object.freeze({
  resolve_stressor:    { targets: ['stressorId'],               defaultMagnitude: 1.0,  label: 'Resolve a crisis', note: 'The party ended an active stressor (broke the siege, cured the plague).' },
  ease_stressor:       { targets: ['stressorId'],               defaultMagnitude: 0.4,  label: 'Ease a crisis',    note: 'The party blunted but did not end a stressor.' },
  worsen_stressor:     { targets: ['stressorId'],               defaultMagnitude: 0.4,  label: 'Worsen a crisis',  note: 'The party (or their failure) deepened a stressor.' },
  name_attacker:       { targets: ['stressorId'],               defaultMagnitude: 0.3,  label: 'Name the attacker', note: 'The DM identifies the force behind a war-shaped stressor — another settlement, or a force with no settlement at all (a goblin warband, a mercenary company).' },
  broker_relationship: { targets: ['relationshipKey'],          defaultMagnitude: 0.6,  label: 'Broker peace',     note: 'The party de-escalated a relationship between two settlements.' },
  inflame_relationship:{ targets: ['relationshipKey'],          defaultMagnitude: 0.6,  label: 'Inflame a feud',   note: 'The party escalated a relationship between two settlements.' },
  clear_condition:     { targets: ['settlementId', 'condition'],defaultMagnitude: 1.0,  label: 'Resolve a condition', note: 'The party removed an active condition from a settlement.' },
  impose_condition:    { targets: ['settlementId', 'archetype'],defaultMagnitude: 0.6,  label: 'Cause a condition', note: 'The party caused a new active condition.' },
  bolster_faction:     { targets: ['settlementId', 'factionId'],defaultMagnitude: 0.5,  label: 'Empower a faction', note: 'The party strengthened a faction\'s standing.' },
  undermine_faction:   { targets: ['settlementId', 'factionId'],defaultMagnitude: 0.5,  label: 'Undermine a faction', note: 'The party weakened a faction\'s standing.' },
  empower_npc:         { targets: ['settlementId', 'npcId'],    defaultMagnitude: 0.5,  label: 'Aid an NPC',        note: 'The party advanced an NPC\'s position.' },
  remove_npc:          { targets: ['settlementId', 'npcId'],    defaultMagnitude: 1.0,  label: 'Remove an NPC',     note: 'The party removed a key NPC (killed, exiled, captured).' },
});
