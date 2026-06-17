/**
 * Step: corruptionPass — corruption system, Phase 1a (generation-time onset).
 *
 * For each NPC carrying a corruptible personality flaw, when the settlement has
 * at least one criminal institution, roll a damped, climate-scaled chance to be
 * GENERATED already corrupted. A corrupted NPC gains: a corruption vector (from
 * its flaw), an RNG-matched criminal-institution secondary affiliation + a tie to
 * the local thieves-guild, and a rewritten short-term goal.
 *
 * No-op (zero rolls → byte-identical output) when the settlement has no criminal
 * institution, so existing generations without one stay unchanged. The step uses
 * its own forked rng and mutates ctx.npcs in place (like subsumptionPass), so it
 * never perturbs other steps' rng streams. assembleSettlement depends on this
 * step so the mutated NPCs are the ones bundled into the settlement.
 */
import { registerStep } from '../pipeline.js';
import {
  readCorruptionClimate, npcCorruptibleFlaw, corruptionVectorForFlaw, spawnCorruptionChance,
} from '../../domain/corruption.js';

// Corrupted short-term goal by corruption vector — replaces the NPC's normal
// short goal so their motivation reads as compromised at the table.
const CORRUPT_SHORT_GOAL = Object.freeze({
  greed: 'Skim what passes through their hands and call it a fee.',
  hunger_for_status: 'Trade quiet favours upward, buying a seat above their station.',
  fear: 'Stay useful to the wrong people so they stay breathing.',
  forbidden_patron: 'Answer, in secret, to a patron no one is meant to know.',
  fanaticism: 'Bend every rule for the cause and call the corruption devotion.',
});

function thievesGuildName(criminalInstitutions) {
  return criminalInstitutions.find((n) => /thieves/i.test(n)) || criminalInstitutions[0] || 'the local underworld';
}

registerStep('corruptionPass', {
  // economyReconcilePass (not generateEconomy): the corruption climate reads
  // economicState, which the reconcile step may replace after the faction pull.
  deps: ['generatePopulation', 'economyReconcilePass'],
  provides: [],
  mutates: ['factions', 'npcs'], // stamps corruption onto the rosters in place (A+ P1.7)
  phase: 'population',
}, (ctx, rng) => {
  const npcs = Array.isArray(ctx.npcs) ? ctx.npcs : [];
  if (!npcs.length) return;

  const climate = readCorruptionClimate({ institutions: ctx.institutions, economicState: ctx.economicState });
  if (!climate.hasCriminalInst) return; // no criminal institution → no corruption, no rolls

  const guild = thievesGuildName(climate.criminalInstitutions);
  const p = spawnCorruptionChance(climate);

  // In a criminal-institution settlement every NPC gets an explicit boolean so
  // the world-pulse layer knows generation already decided (vs. a legacy save).
  for (const npc of npcs) {
    const flaw = npcCorruptibleFlaw(npc);
    if (!flaw) { npc.corrupt = false; continue; }
    if (!rng.chance(p)) { npc.corrupt = false; continue; }

    const vector = corruptionVectorForFlaw(flaw);
    npc.corrupt = true;
    npc.corruptionVector = vector;

    // Second relation: an RNG-matched criminal institution + the thieves-guild.
    const crimInst = rng.pick(climate.criminalInstitutions) || guild;
    if (!npc.secondaryAffiliation) npc.secondaryAffiliation = crimInst;
    npc.corruptTies = { criminalInstitution: crimInst, thievesGuild: guild };

    // Compromised short-term motivation.
    if (npc.goal && typeof npc.goal === 'object') {
      npc.goal = { ...npc.goal, short: CORRUPT_SHORT_GOAL[vector] || CORRUPT_SHORT_GOAL.greed };
    }
  }
});
