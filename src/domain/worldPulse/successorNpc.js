/**
 * successorNpc — §corruption Phase 1b-ii-c. When a corrupt NPC is OUSTED (organic
 * out-&-replace at the bottom rung, or the DM expose-corruption event), a fresh
 * NPC is installed in their place — inheriting their seat (role, faction,
 * institution, importance) but a clean identity, a non-corruptible disposition
 * (so the seat gets a genuine respite), and a "newly installed after a scandal"
 * goal. Records replacedNpc for the dossier narrative.
 *
 * Pure + deterministic: identity/personality are drawn from the passed rng, so
 * the same seed yields the same successor. No Date, no store.
 */

const FIRST_NAMES = Object.freeze([
  'Aldric', 'Bryn', 'Cora', 'Doran', 'Elsa', 'Fenn', 'Gita', 'Halden', 'Isolde',
  'Joren', 'Kara', 'Lasse', 'Mira', 'Norit', 'Osric', 'Petra', 'Rolf', 'Sable',
  'Tova', 'Ulric', 'Vesna', 'Wendel', 'Yara', 'Corvin', 'Maela', 'Theron', 'Liesel',
]);
// Dispositions that are NOT in CORRUPTIBLE_FLAWS — a successor won't instantly relapse.
const HONEST_DOMINANT = Object.freeze(['diligent', 'earnest', 'principled', 'vigilant', 'dutiful', 'steadfast', 'plain-spoken']);
const HONEST_FLAW = Object.freeze(['stubborn', 'proud', 'aloof', 'blunt', 'rigid', 'severe']);
const SUCCESSOR_GOAL = 'Newly installed after a corruption scandal. Determined to stay above suspicion.';

/** Build a fresh successor for an ousted NPC, inheriting their seat. */
export function successorNpc(ousted = {}, rng) {
  const pick = (arr) => (rng && rng.pick ? rng.pick(arr) : arr[0]);
  const num = rng && rng.randInt ? rng.randInt(100000, 999999) : 100000;
  return {
    id: `npc.successor_${num}`,
    name: pick(FIRST_NAMES),
    role: ousted.role || ousted.category || '',
    category: ousted.category,
    factionAffiliation: ousted.factionAffiliation,
    factionLink: ousted.factionLink,
    institutionId: ousted.institutionId,
    importance: ousted.importance,
    personality: {
      dominant: pick(HONEST_DOMINANT),
      flaw: pick(HONEST_FLAW),
      modifier: ousted.personality?.modifier,
      tell: ousted.personality?.tell,
      speech: ousted.personality?.speech,
    },
    goal: { short: SUCCESSOR_GOAL, long: ousted.goal?.long || '' },
    corrupt: false,
    timesExposed: 0,
    replacedNpc: ousted.name || null,
    power: ousted.power,
    influence: ousted.influence,
  };
}

/**
 * Replace any NPC named in `oustedNames` with a fresh successor (same seat).
 * Pure; returns the same settlement reference when there's nothing to replace.
 */
export function replaceOustedNpcs(settlement, oustedNames, rng) {
  const names = new Set((oustedNames || []).map((n) => String(n).toLowerCase()).filter(Boolean));
  if (!names.size || !Array.isArray(settlement?.npcs)) return settlement;
  let changed = false;
  let i = 0;
  const npcs = settlement.npcs.map((npc) => {
    if (names.has(String(npc.name).toLowerCase())) {
      changed = true;
      const child = rng && rng.fork ? rng.fork(`succ:${i++}`) : rng;
      return successorNpc(npc, child);
    }
    return npc;
  });
  return changed ? { ...settlement, npcs } : settlement;
}
