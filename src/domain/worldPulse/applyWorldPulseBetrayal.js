// applyWorldPulseBetrayal — the traitor seed: the importance ranking and the roster write
// that names who turned. Split verbatim out of applyWorldPulse.js by THE DECOMPOSITION
// WAVE (war tranche, file 4); every body here is byte-identical to its pre-split
// declaration.
import { npcId } from './npcAgency.js';
import { npcCorruptibleFlaw, corruptionVectorForFlaw } from '../corruption.js';

const IMPORTANCE_RANK = Object.freeze({ pillar: 3, key: 2, notable: 1 });

/**
 * A betrayal stressor's birth seeds the traitor its variant implies — ONE
 * corrupted NPC, dependent on already-existing factors: there must be an
 * NPC with a corruptible flaw to turn (no flaw, no traitor). Unlike the
 * organic corruption loop this does NOT require a criminal institution —
 * the patron is the foreign sponsor (or the conspiracy itself), recorded on
 * corruptTies.foreignPatron. Deterministic pick: most notable eligible NPC,
 * name as tiebreak. Covert by design: no news entry — the DM finds the
 * corrupt flag in the dossier, the table finds it the hard way.
 */
export function seedBetrayalTraitor(/** @type {any} */ { state, settlementUpdates, saveId, originContext }) {
  const sid = String(saveId || '');
  const entry = settlementUpdates.get(sid);
  const npcs = entry?.settlement?.npcs;
  if (!Array.isArray(npcs) || !npcs.length) return state;
  const eligible = npcs
    .map((npc, index) => ({ npc, index, flaw: npcCorruptibleFlaw(npc) }))
    .filter(c => c.flaw && c.npc.corrupt !== true && !c.npc.ousted);
  if (!eligible.length) return state;
  // Codepoint tiebreak, NOT localeCompare: this sort decides WHICH NPC turns
  // traitor, and default-locale collation can reorder accented names across
  // machines, breaking replay determinism.
  eligible.sort((a, b) => {
    const rank = ((/** @type {any} */ (IMPORTANCE_RANK))[b.npc.importance] || 0) - ((/** @type {any} */ (IMPORTANCE_RANK))[a.npc.importance] || 0);
    if (rank) return rank;
    const an = String(a.npc.name || '');
    const bn = String(b.npc.name || '');
    return an < bn ? -1 : an > bn ? 1 : 0;
  });
  const chosen = eligible[0];
  const foreign = ['foreign_sponsored', 'abandoned_agent'].includes(originContext.variant);
  const vector = foreign ? 'forbidden_patron' : corruptionVectorForFlaw(chosen.flaw);
  const corruptTies = {
    criminalInstitution: null,
    thievesGuild: null,
    foreignPatron: originContext.sponsorSettlementId || originContext.formerSponsorSettlementId || null,
    conspiracy: originContext.variant,
  };
  const nextNpcs = npcs.map((npc, index) => (index === chosen.index
    ? { ...npc, corrupt: true, corruptionVector: vector, corruptTies }
    : npc));
  settlementUpdates.set(sid, { ...entry, settlement: { ...entry.settlement, npcs: nextNpcs } });
  // Mirror into npcStates immediately so the same-tick world view agrees
  // (ensureNpcStates treats the settlement boolean as authoritative anyway).
  const id = npcId(sid, chosen.npc, chosen.index);
  const st = state.npcStates?.[id];
  if (!st) return state;
  return {
    ...state,
    npcStates: {
      ...state.npcStates,
      [id]: {
        ...st,
        corruption: true,
        corruptionProfile: { corrupted: true, vector },
        corruptionHeat: Math.max(st.corruptionHeat || 0, 0.3),
      },
    },
  };
}
