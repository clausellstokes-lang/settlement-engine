/**
 * npcLadderFactionKey.test.js — THE FACTION-KEY REGRESSION PIN (DESIGN_THE_LADDER.md §1/§8).
 *
 * REAL powerStructure.factions records (rulingStructure.generatePowerStructure) carry the
 * faction's name in `.faction` — NO `.name`, NO `.id` (the generator itself keys
 * governingName off `.faction`; the domain accessor rulingPower.nameOf reads
 * `.faction || .name`). An earlier ladder cut read `.name`/`.id` only, so every real
 * faction slugified to `fac.unknown` and the kernel's first-wins loop merged them into
 * ONE ladder (and npcInFaction never recognized a real-affiliated NPC ⇒ empty ladders).
 *
 * These pins feed the ladder the REAL faction shape and assert distinct, correctly-slugged
 * keys — write side (ladderFactionKey / npcInFaction), read side (ladderEffectivePowerFactor
 * → factionKeyOf), and end-to-end (advanceNpcLadder). The `.name`/`.id` fixture path is
 * pinned too: the accessor must serve BOTH shapes. Every REAL-shape assertion FAILS on the
 * pre-fix `.name`-only code; the fixture-shape assertions stay green either way.
 */
import { describe, it, expect } from 'vitest';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { ladderFactionKey, npcInFaction } from '../../src/domain/worldPulse/npcLadderState.js';
import { ladderEffectivePowerFactor } from '../../src/domain/townMap/ladderRead.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { factionOwnerKey } from '../../src/domain/traditions/politics.js';
import { slugify } from '../../src/kernel/slugify.js';

// The ladder's own slug params (npcLadderState.normalizeToken / ladderRead.factionKeyOf).
// Imported rather than hand-rolled: src/kernel/slugify.js is the SINGLE slug primitive, and a
// test that re-implements it is a 9th variant that drifts silently from the code it pins.
const LADDER_SLUG = { sep: '_', max: 80, fallback: 'unknown', empty: 'unknown' };

const economicState = { tier: 'city', economyOutput: 70, wealthLevel: 'wealthy' };
const richCity = { priorities: { economy: 80, military: 70, religion: 65, criminal: 30 } };

describe('THE FACTION-KEY BUG: real .faction records key distinctly (write side)', () => {
  it('a genuine multi-faction powerStructure keys each faction to its OWN slug, not fac.unknown', () => {
    const { factions } = generatePowerStructure('city', economicState, null, richCity, []);
    expect(factions.length).toBeGreaterThan(1);
    // The real record shape: `.faction` present, `.name`/`.id` absent (guards the shape).
    for (const f of factions) {
      expect(typeof f.faction).toBe('string');
      expect(f.name).toBeUndefined();
      expect(f.id).toBeUndefined();
    }
    const keys = factions.map((f) => ladderFactionKey(f));
    // Every faction gets a DISTINCT key derived from its real name (pre-fix: all fac.unknown).
    expect(new Set(keys).size).toBe(factions.length);
    for (const k of keys) expect(k).not.toBe('fac.unknown');
    // And the slug is the real name normalized (spot-check the governing entry).
    const gov = factions.find((f) => f.isGoverning) || factions[0];
    expect(ladderFactionKey(gov)).toBe(`fac.${slugify(gov.faction, LADDER_SLUG)}`);
  });

  it('.faction WINS over .name — the precedence that binds the key to rulingPower.nameOf', () => {
    // nameOf reads `.faction || .name`; the ladder key MUST agree, or a record carrying both
    // (a fixture patched onto real data) would key one way for the ladder and another for
    // every other power consumer. This precedence is the whole contract — pin it explicitly.
    expect(ladderFactionKey({ faction: 'Alpha', name: 'Beta' })).toBe('fac.alpha');
    expect(npcInFaction({ factionAffiliation: 'Alpha' }, { faction: 'Alpha', name: 'Beta' }, 'fac.alpha')).toBe(true);
  });

  it('hand-shaped real records get distinct name-slug keys', () => {
    // "shaped exactly as rulingStructure produces": name in `.faction`.
    expect(ladderFactionKey({ faction: 'Merchant Guilds', power: 30 })).toBe('fac.merchant_guilds');
    expect(ladderFactionKey({ faction: 'Military/Guard', power: 20 })).toBe('fac.military_guard');
    expect(ladderFactionKey({ faction: 'City Council', isGoverning: true, power: 31 }))
      .not.toBe(ladderFactionKey({ faction: 'Merchant Guilds', power: 30 }));
  });

  it('npcInFaction recognizes an NPC affiliated to a real .faction record by name', () => {
    const real = { faction: 'Merchant Guilds', power: 30 };
    const fkey = ladderFactionKey(real);
    const affiliated = { factionAffiliation: 'Merchant Guilds' };
    const otherFaction = { factionAffiliation: 'Craft Guilds' };
    expect(npcInFaction(affiliated, real, fkey)).toBe(true); // pre-fix: false (name invisible)
    expect(npcInFaction(otherFaction, real, fkey)).toBe(false);
  });
});

describe('THE FACTION-KEY BUG: the read side resolves the real slug (mirror lookup)', () => {
  it('ladderEffectivePowerFactor keys a real .faction record to its slug, not fac.unknown', () => {
    const real = { faction: 'Merchant Guilds', power: 30 };
    // The write side keys the mirror at fac.merchant_guilds; the read (factionKeyOf) must match.
    const mirror = { npcLadder: { factions: { 'fac.merchant_guilds': {
      rungs: [{ npcId: 'a:x', name: 'X', standing: 0.9 }], powerModifier: 1.1,
    } } } };
    expect(ladderFactionKey(real)).toBe('fac.merchant_guilds');
    // Pre-fix factionKeyOf(real) → fac.unknown ⇒ miss ⇒ factor 1.0; post-fix finds 1.1.
    expect(ladderEffectivePowerFactor(mirror, real)).toBeCloseTo(1.1, 6);
  });
});

describe('THE FACTION-KEY BUG: end-to-end — the kernel grows ONE ladder per real faction', () => {
  it('genuine records + affiliated NPCs yield DISTINCT ladders (pre-fix: all merge / vanish)', () => {
    const { factions } = generatePowerStructure('city', economicState, null, richCity, []);
    const [f0, f1, f2] = factions;
    // A senior office-holder in each of three distinct real factions (importance 'pillar'
    // clears the rung-eligible floor — the ladder derivation fixture idiom).
    const officer = (id, affiliation) => ({
      id, name: `Head of ${affiliation}`, role: 'leader', importance: 'pillar', dots: 3,
      structuralRank: 'dominant', factionAffiliation: affiliation,
    });
    const npcs = [officer('h0', f0.faction), officer('h1', f1.faction), officer('h2', f2.faction)];
    const settlement = {
      name: 'Ashford', tier: 'city', population: 12000,
      powerStructure: { factions, publicLegitimacy: { score: 55 } },
      npcs, institutions: [], activeConditions: [],
    };
    const worldState = { simulationRules: { npcLadderEnabled: true }, calendar: { elapsedWeeks: 260 } };
    const item = { id: 'a', name: 'Ashford', settlement };
    const snapshot = { settlements: [item], byId: new Map([['a', item]]) };
    const r = advanceNpcLadder({ snapshot, worldState, settlementUpdates: [{ saveId: 'a', settlement }], tick: 260, now: null });
    const rec = r.worldState?.spatialLedgers?.npcLadder?.a || null;
    const ladderKeys = rec ? Object.keys(rec.factions) : [];
    // THREE affiliated officers ⇒ THREE distinct faction ladders (pre-fix: 0 — no NPC matched).
    expect(ladderKeys.length).toBe(3);
    expect(new Set(ladderKeys).size).toBe(3);
    for (const k of ladderKeys) expect(k).not.toBe('fac.unknown');
    // Each faction's ladder holds its OWN head (not merged into one bucket).
    const allRungNids = Object.values(rec.factions).flatMap((fr) => fr.rungs);
    expect(allRungNids.sort()).toEqual(['a:h0', 'a:h1', 'a:h2']);

    // CLOSE THE WRITE→READ LOOP ON REAL DATA. Everything above pins the WRITE key; the read
    // side (ladderRead.factionKeyOf) is a SEPARATE function that must agree byte-for-byte, and
    // asserting a hand-typed literal on both sides only pins that two humans typed the same
    // string. Feed the mirror the kernel actually projected back through the real read path:
    // a miss coalesces to exactly 1.0 (the dark-safe value), so "not 1" is the drift detector.
    const written = r.settlementUpdates[0].settlement;
    for (const f of [f0, f1, f2]) {
      expect(ladderEffectivePowerFactor(written, f)).not.toBe(1);
    }
  });
});

describe('THE ACCESSOR SERVES BOTH SHAPES: the .name/.id fixture path stays green', () => {
  it('a .name-only fixture keys by its name (unchanged pre/post fix)', () => {
    expect(ladderFactionKey({ name: "Merchants' Guild" })).toBe('fac.merchants_guild');
  });
  it('an explicit .id wins over any name (unchanged)', () => {
    expect(ladderFactionKey({ id: 'fac.custom', name: 'Ignored', faction: 'AlsoIgnored' })).toBe('fac.custom');
  });
  it('an empty/degenerate faction still keys to fac.unknown (unchanged)', () => {
    expect(ladderFactionKey({})).toBe('fac.unknown');
    expect(ladderFactionKey({ faction: '' })).toBe('fac.unknown');
  });
  it('npcInFaction still matches a .name-shaped fixture faction', () => {
    const fixture = { name: "Merchants' Guild" };
    const fkey = ladderFactionKey(fixture);
    expect(npcInFaction({ factionAffiliation: "Merchants' Guild" }, fixture, fkey)).toBe(true);
  });
});

describe('THE CROSS-LAYER JOIN: traditions ownerKey must equal the ladder key', () => {
  // traditionsKernel.js reads ladderInstabilityOf(settlement, rec.ownerKey) — the TRADITIONS
  // owner key (politics.factionOwnerKey) indexed straight into the LADDER's mirror. That is a
  // THIRD key-minter joining this keyspace, and it was previously DEAD: pre-fix the ladder
  // keyed every real faction fac.unknown while factionOwnerKey keyed the true slug, so the
  // lookup could never hit. Fixing the ladder key ACTIVATES this coupling — festival outcomes
  // become ladder-churn-sensitive once both flags are lit. Pin the parity so it cannot drift.
  it('factionOwnerKey and ladderFactionKey agree on every real generated faction', () => {
    const { factions } = generatePowerStructure('city', economicState, null, richCity, []);
    expect(factions.length).toBeGreaterThan(1);
    for (const f of factions) {
      expect(factionOwnerKey(f)).toBe(ladderFactionKey(f));
    }
  });

  it('DOCUMENTED DIVERGENCE: an .id-bearing record keys differently on the two sides', () => {
    // NOT cured by the faction-key fix and NOT cured here — pinned as the CURRENT behavior so
    // the gap is visible rather than latent. ladderFactionKey short-circuits on `.id` and
    // returns it verbatim; factionOwnerKey ignores `.id` entirely and always slugs the name.
    // Real generator records carry no `.id`, so the join is sound on generated data; hand-
    // authored/fixture records that DO carry one (e.g. sampleDossier.json's fac.garrison) miss.
    // Reconciling the two minters is an owner-gated keyspace decision, deliberately deferred.
    const idBearing = { id: 'fac.garrison', faction: 'The Garrison' };
    expect(ladderFactionKey(idBearing)).toBe('fac.garrison');
    expect(factionOwnerKey(idBearing)).toBe('fac.the_garrison');
    expect(factionOwnerKey(idBearing)).not.toBe(ladderFactionKey(idBearing));
  });
});
