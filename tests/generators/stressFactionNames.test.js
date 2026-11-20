/**
 * A STRESS FACTION CARRIES A REAL NAME, NEVER A PLACEHOLDER (lane RUNG1-TRUTH unit D, 2026-11-04;
 * docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 12, kind 7; the chair's ruling D).
 *
 * `stressFactions.js :: applyStressEventFactions` injected "Claimant Bloc A", "Claimant Bloc B"
 * (succession void) and "Rival Faction B" (political fracture) outside a Royal Authority. Each
 * now takes the FIRST UNUSED name from the roster's own role pool
 * (`src/data/powerData.js :: FACTION_DESCRIPTORS`, then `FACTION_DESCRIPTORS_EXTRA`), keyed by
 * the role's category, with no draw, and keeps the category its placeholder inferred (claimants
 * noble, the rival other) so the power-economy correlation reads it as before.
 *
 * The infiltration's "Unknown Faction (hidden)" takes the `other` pool's first unused name too
 * (unit E1, the chair's ruling 1): hidden in the fiction, carried as `hidden: true`, never from
 * the DM.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { FACTION_DESCRIPTORS } from '../../src/data/powerData.js';
import { applyStressEventFactions } from '../../src/generators/power/stressFactions.js';
import { applyFactionRenameToSettlement } from '../../src/domain/factionRename.js';

const PLACEHOLDER = /\b(?:Bloc|Faction) [A-Z]\b|Unknown Faction|^Unnamed power(?: \d+)?$/;
const names = (s) => (s.powerStructure?.factions || []).map((f) => f.faction);

function inject(stress, roster, governing = 'Council of Elders') {
  const factions = roster.map((faction) => ({ faction, power: 20 }));
  applyStressEventFactions(factions, (t) => t === stress, governing, false, {}, []);
  return factions;
}

describe('stress factions take the role pool\'s first unused name', () => {
  it('a succession void names two distinct noble claimants, category noble', () => {
    const added = inject('succession_void', ['Noble Families', 'Craft Guilds']).slice(2);
    expect(added.map((f) => f.faction)).toEqual([FACTION_DESCRIPTORS.noble[0], FACTION_DESCRIPTORS.noble[1]]);
    expect(added.every((f) => f.category === 'noble')).toBe(true);
  });

  it('a name already on the roster is skipped', () => {
    const added = inject('succession_void', [FACTION_DESCRIPTORS.noble[0]]).slice(1);
    expect(added.map((f) => f.faction)).toEqual([FACTION_DESCRIPTORS.noble[1], FACTION_DESCRIPTORS.noble[2]]);
  });

  it('a political fracture names its rival from the other pool, category other', () => {
    const rival = inject('politically_fractured', ['Craft Guilds']).find((f) => f.faction === FACTION_DESCRIPTORS.other[0]);
    expect(rival).toMatchObject({ category: 'other', power: 20 });
  });

  it('under a Royal Authority the authored names stay', () => {
    // SW-8 RENAME-POWERS (the owner's map, 2026-11-09): "Noble Claimant" stays; its bracket's
    // retired word moved to "Reform Line", the pair of its rival's "Senior Line". Re-keyed by identity.
    const added = inject('succession_void', [], 'Royal Authority').map((f) => f.faction);
    expect(added).toEqual(['Noble Claimant (Senior Line)', 'Noble Claimant (Reform Line)']);
  });

  it('the infiltrator takes the other pool\'s first unused name and keeps hidden: true', () => {
    const added = inject('infiltrated', ['Craft Guilds']).slice(1);
    expect(added).toEqual([expect.objectContaining({
      faction: FACTION_DESCRIPTORS.other[0], category: 'other', power: 15, hidden: true,
      // Re-keyed by identity 2026-11-09 (SW-8 RENAME-POWERS C9-6, the owner's map Appendix X): the same desc, "two powers".
      // Re-keyed by identity again (COHERENCE-POWERS-8, row #640): no birth gives the infiltrator assets in two powers;
      // the same row, its description claiming only the people it has.
      desc: 'An external interest with its own people placed inside the settlement. Its presence is not known to the settlement.',
    })]);
  });

  describe('on the corpus', () => {
    beforeAll(async () => { await ensureLaws(); });

    it('soak1k-508: the infiltrator reaches the record named, with hidden: true', () => {
      const { settlement } = birth(508);
      const hidden = (settlement.powerStructure?.factions || []).filter((f) => f.hidden === true);
      // The density law's seat split (applyDensityLaw.js) already cloned the infiltrator at this
      // base ("The Common Interest", with the same description); the clone carries its parent's
      // `hidden` too, so every hidden faction here is named and the first is the pool's.
      expect(hidden.length).toBeGreaterThanOrEqual(1);
      expect(hidden[0].faction).toBe(FACTION_DESCRIPTORS.other[0]);
      expect(hidden.filter((f) => PLACEHOLDER.test(f.faction))).toEqual([]);
    });

    it('soak1k-8 (Claimant Bloc A), soak1k-304 (Rival Faction B) and soak1k-508 (the infiltrator) print no placeholder', () => {
      for (const i of [8, 304, 508]) {
        const { settlement } = birth(i);
        expect(names(settlement).filter((n) => PLACEHOLDER.test(n))).toEqual([]);
        expect((settlement.factions || []).map((f) => f.name).filter((n) => PLACEHOLDER.test(String(n)))).toEqual([]);
      }
    });

    // ⚠ THE CRISIS CAST IS SET ASIDE, and that is a measured pre-existing gap rather than this
    // lane's: `stress[].cast.stakes[].factionId` holds a faction's display name and is on neither
    // FACTION_RENAME_SURFACES nor NON_CASCADED_SURFACES, so it stays stale for EVERY renamed
    // faction with a crisis stake (a placeholder-named claimant included). Reported for intake.
    it('the rename cascade carries a pool-named claimant to every declared surface', () => {
      const { settlement } = birth(8);
      const claimant = names(settlement).find((n) => FACTION_DESCRIPTORS.noble.includes(n));
      expect(claimant).toBeTruthy();
      const { changed, touched } = applyFactionRenameToSettlement(settlement, claimant, 'The Iron Pretenders');
      expect(changed).toBe(true);
      // PEOPLE-5B (M-7): a card names its power in `memberships`; the grouping left the record.
      expect(touched).toEqual(expect.arrayContaining(['npcs[].memberships[].power']));
      const { stress: _stress, stressors: _stressors, ...rest } = settlement;
      expect(JSON.stringify(rest)).not.toContain(claimant); // anchored: the next line pins the new name in this same record
      expect(JSON.stringify(rest)).toContain('The Iron Pretenders');
    });
  });
});
