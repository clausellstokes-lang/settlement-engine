/**
 * tests/domain/factionNamePrecedence.test.js — THE FACTION-KEY PRECEDENCE PINS.
 *
 * A `powerStructure.factions[]` record's canonical display name lives in `.faction`.
 * Some records ALSO carry a `.name` alias: addFaction (events/mutateEntities.js) mints
 * BOTH keys, and rulingPower.transferRulingPower can mirror one onto the other. The
 * canonical accessor is rulingPower.nameOf, whose precedence is `.faction || .name`
 * — pinned by commit dc0b6e2b.
 *
 * Twelve-plus consumers read that name with the precedence REVERSED (`.name || .faction`).
 * They agreed with the canon on today's data only by luck: generator records carry no
 * `.name` (so the reversed chain falls through) and addFaction sets `name === faction`
 * (so both arms agree). The moment any record carries both keys with DIFFERENT values —
 * exactly what the dc0b6e2b pin exists to govern — those consumers silently key, join,
 * dedup, and slug on the stale alias.
 *
 * These are BEHAVIORAL pins: each feeds a record carrying both keys divergently and
 * asserts the consumer resolves to the canonical `.faction`. The companion SOURCE-SCAN
 * guard that stops the class from regrowing is tests/lint/factionNamePrecedenceScan.test.js.
 *
 * NOT-A-FACTION-RECORD, deliberately out of scope: top-level `settlement.factions[]` is a
 * DIFFERENT type (the NPC grouping list carrying `.name`/`.dominantCategory`/
 * `.powerFactionName`). Reading `.name` first is CORRECT there. Do not "fix" those.
 */
import { describe, it, expect } from 'vitest';
import { nameOf } from '../../src/domain/rulingPower.js';
import { generateFactionStructuralNpcs } from '../../src/generators/factionRoles.js';
import { computeGuildStrengthBy, applyGuildToSettlement } from '../../src/domain/worldPulse/thievesGuild.js';
import { presentFactionNames } from '../../src/domain/factions/factionCatalog.js';
import { buildPersonaSlice } from '../../src/domain/ai/personaSlicer.js';
import { verifyAiOverlay } from '../../src/domain/aiOverlayVerifier.js';
import { rulerLens } from '../../src/domain/worldPulse/religionLegitimacy.js';

/** A record carrying BOTH keys, divergently. `.faction` is canonical per nameOf. */
const CANON = 'Merchant Guild';
const divergent = (over = {}) => ({ id: 'faction.stable', faction: CANON, name: 'STALE ALIAS', power: 70, ...over });

describe('the canonical accessor (the contract every pin below is measured against)', () => {
  it('nameOf reads .faction ahead of .name', () => {
    expect(nameOf(divergent())).toBe(CANON);
  });
});

describe('PIN 1 — factionRoles: the structural-NPC write/read join', () => {
  // generateFactionStructuralNpcs stamps BOTH an identity-bearing slug (`npc.<slug>_...`)
  // and `factionAffiliation`. ensureFactionStructuralNpcs then resolves that affiliation
  // through a seat index keyed `seat.faction || seat.name`. If the stamp reads the alias
  // while the index reads the canon, the affiliation can never resolve to its own seat.
  it('the minted NPC id slugs the CANONICAL name, not the alias', () => {
    const npcs = generateFactionStructuralNpcs(divergent(), []);
    expect(npcs.length).toBeGreaterThan(0);
    for (const npc of npcs) {
      expect(npc.id).toMatch(/^npc\.merchant_guild_/);
      expect(npc.id).not.toContain('stale_alias');
      expect(npc.linkedFactionIds).toEqual(['faction.stable']);
    }
  });

  it('the stamped affiliation RESOLVES against the .faction-keyed seat index', () => {
    const seat = divergent();
    // The index exactly as ensureFactionStructuralNpcs builds it.
    const seatByName = new Map([[String(seat.faction || seat.name || '').toLowerCase(), seat]]);
    const [npc] = generateFactionStructuralNpcs(seat, []);
    expect(seatByName.has(String(npc.factionAffiliation).toLowerCase())).toBe(true);
  });
});

describe('PIN 2 — thievesGuild: the cross-module join key', () => {
  // computeGuildStrengthBy builds `${sid}:${stablePart(name)}` from the snapshot, then
  // looks it up with factionState.name — which factionCompetition.js:147 seeds with the
  // CORRECT precedence. A reversed build side makes the join miss and silently substitute
  // the `?? 40` default for the faction's real power.
  const worldState = {
    factionStates: { f1: { settlementId: 's1', name: "Thieves' Guild", captureState: 'capture', archetype: 'criminal' } },
  };
  const snap = (faction) => ({ settlements: [{ id: 's1', settlement: { powerStructure: { factions: [faction] } } }] });

  it('a stale .name alias does not change the joined guild strength', () => {
    const withAlias = computeGuildStrengthBy(worldState, snap({ faction: "Thieves' Guild", name: 'STALE ALIAS', power: 88 }));
    const control  = computeGuildStrengthBy(worldState, snap({ faction: "Thieves' Guild", power: 88 }));
    expect([...withAlias.entries()]).toEqual([...control.entries()]);
    // Non-vacuity: the join must actually have HIT (the ?? 40 fallback would differ).
    expect(control.size).toBe(1);
    expect([...control.values()][0]).toBeGreaterThan(0);
  });

  it('applyGuildToSettlement matches the criminal faction by its CANONICAL name', () => {
    // `.faction` is criminal; the alias is not. The mutation must still fire.
    const settlement = { powerStructure: { factions: [{ faction: "Thieves' Guild", name: 'Bakers Circle', power: 10, legitimacy: 90 }] } };
    const out = applyGuildToSettlement(settlement, 0.9);
    expect(out.powerStructure.factions[0].power).toBeGreaterThan(10);
  });
});

describe('PIN 3 — factionCatalog: the dedup key', () => {
  it('presentFactionNames dedups under the canonical name', () => {
    const present = presentFactionNames({ powerStructure: { factions: [divergent()] } });
    expect(present.has(CANON.toLowerCase())).toBe(true);
    expect(present.has('stale alias')).toBe(false);
  });
});

describe('PIN 6 — religionLegitimacy.rulerLens: resolving the governing seat', () => {
  // Another NO-FALLBACK read (`f?.name` alone, no `.faction` arm). Generator records
  // carry ONLY `.faction`, so BOTH match arms missed on every generated settlement and
  // the lens silently fell through to the highest-power faction — the wrong archetype
  // whenever the governing seat is not the strongest power.
  it('resolves the GOVERNING faction, not merely the strongest one', () => {
    const settlement = {
      powerStructure: {
        governingName: 'Temple of the Dawn',
        factions: [
          { faction: 'Iron Syndicate', power: 90, archetype: 'criminal' },   // strongest
          { faction: 'Temple of the Dawn', power: 20, archetype: 'religious' }, // governing
        ],
      },
      npcs: [],
    };
    const lens = rulerLens(settlement);
    const strongestLens = rulerLens({
      powerStructure: { governingName: 'Iron Syndicate', factions: settlement.powerStructure.factions },
      npcs: [],
    });
    // Non-vacuity: the two governing seats must produce DIFFERENT lenses, which they can
    // only do if the governing name actually resolved instead of defaulting to the top power.
    expect(lens).not.toEqual(strongestLens);
  });
});

describe('PIN 5 — aiOverlayVerifier: the entity identity key', () => {
  // entityKey is written as a MULTI-STATEMENT chain (`if (e.name) return ...;
  // if (e.faction) return ...`), which the source-scan guard structurally CANNOT see,
  // and the file's own fixtures carry no `.faction` key — so before this pin, reverting
  // the fix passed every existing test. This is the pin that holds it.
  //
  // The key aligns original-vs-refined entities. If it reads the stale alias, a faction
  // whose canonical `.faction` the AI rewrote still keys under the unchanged `.name`,
  // and a genuine rename is reported as a matched pair instead of a rename.
  const withFactions = (factions) => ({ powerStructure: { factions } });

  it('a faction renamed on .faction is DETECTED, not masked by a stable .name alias', () => {
    const original = withFactions([{ faction: 'Merchant Guild', name: 'SHARED ALIAS' }]);
    const refined  = withFactions([{ faction: 'Iron Syndicate', name: 'SHARED ALIAS' }]);
    const kinds = verifyAiOverlay(original, refined).violations.map((v) => v.kind);
    // Keyed on the canonical field, the two are DIFFERENT entities: the original is gone
    // and a new one appeared. Keyed on the stale alias they would look identical and the
    // overlay verifier would wave the rewrite through with no violation at all.
    expect(kinds.length).toBeGreaterThan(0);
  });

  it('an untouched faction carrying both keys reports NO violation (no false alarm)', () => {
    const same = () => withFactions([{ faction: 'Merchant Guild', name: 'STALE ALIAS' }]);
    expect(verifyAiOverlay(same(), same()).violations).toEqual([]);
  });
});

describe('PIN 4 — personaSlicer: the AI grounding roster', () => {
  // This one was NOT a precedence reversal but a NO-FALLBACK read (`f?.name` alone).
  // Generator-minted records carry ONLY `.faction`, so every one of them mapped to
  // undefined and filter(Boolean) emptied the roster — the AI persona was grounded on
  // an EMPTY faction list for every generated settlement.
  const home = {
    id: 's1', name: 'Ashford',
    powerStructure: { factions: [{ faction: CANON, power: 70 }, { faction: "Thieves' Guild", power: 40 }] },
  };

  it('the roster is populated from generator-shaped (.faction-only) records', () => {
    const slice = buildPersonaSlice({ entity: home, entityClass: 'settlement', settlement: home, worldState: null });
    const facet = slice.facets.find((f) => f.manifestKey === 'faction');
    expect(facet).toBeTruthy();                       // non-vacuity: the facet must exist
    const roster = facet.data.roster;
    expect(roster).toContain(CANON);
    expect(roster).toContain("Thieves' Guild");
  });
});
