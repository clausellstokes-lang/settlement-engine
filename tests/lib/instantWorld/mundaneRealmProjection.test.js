/**
 * tests/lib/instantWorld/mundaneRealmProjection.test.js — MG-2 pins
 * (docs/DESIGN_REALM_MAGIC_TOGGLE §4: THE PROJECTION).
 *
 * The design's claim is that a whole-realm magic answer needs no new authority:
 * stamp it into every member's own config at mint, and generation, persistence,
 * regeneration, and the realm's own record are correct by inheritance, because
 * they already read per-settlement truth. These pins hold that claim to its four
 * load-bearing consequences —
 *
 *   1. SAME SEED WITH THE KNOB — the knob joins the seed's input surface: the
 *      mundane arm is byte-stable for a fixed seed, and it is a DIFFERENT world
 *      from its magical twin rather than a mutated one (MG-LAW-5).
 *   2. THE PERSISTED CONFIG — the member's `_config` (the raw truth a full regen
 *      replays) carries the projection, and the save entry's `config` is the
 *      SAME spelling, so the two can never disagree.
 *   3. REGEN SURVIVAL — replaying that `_config` through the real pipeline
 *      reproduces a mundane settlement; neither projected field is stripped as
 *      derived.
 *   4. THE DEFAULT PATH IS UNTOUCHED — a realm built without answering (every
 *      caller that predates the knob) is byte-identical to today.
 *
 * Each pin that asserts an absence carries a positive control on the same
 * fixture, so none of them can pass by measuring an empty world.
 */
import { describe, test, expect } from 'vitest';
import { composeInstantWorld } from '../../../src/lib/instantWorld/composeInstantWorld.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { DERIVED_CONFIG_KEYS } from '../../../src/store/settlementSlice.js';
import { realmMagicIsMundane } from '../../../src/domain/worldPulse/simulationRules.js';

function fixedFactories() {
  let n = 0;
  return { idFactory: () => `id-${n++}`, clock: () => '2026-07-16T00:00:00.000Z' };
}

const SEED = 'mundane-realm-pin';
const KNOBS = { realmSize: 'small', tone: 'realistic_regional', mapKind: 'highIsland' };

const mundane = () => composeInstantWorld({ seed: SEED, basicConfig: { ...KNOBS, magic: 'no' }, ...fixedFactories() });
const magical = () => composeInstantWorld({ seed: SEED, basicConfig: { ...KNOBS, magic: 'yes' }, ...fixedFactories() });
const unasked = () => composeInstantWorld({ seed: SEED, basicConfig: { ...KNOBS }, ...fixedFactories() });

describe('MG-2 — same seed with the knob (MG-LAW-5)', () => {
  test('the mundane arm is byte-identical to itself', () => {
    const a = mundane();
    const b = mundane();
    expect(a.fingerprint).toEqual(b.fingerprint);
    expect(JSON.stringify(a.settlements)).toEqual(JSON.stringify(b.settlements));
    expect(JSON.stringify(a.campaign)).toEqual(JSON.stringify(b.campaign));
  });

  test('it is a DIFFERENT world from its magical twin, not a mutated one', () => {
    expect(mundane().fingerprint).not.toEqual(magical().fingerprint);
  });

  test('the unanswered path is the magical path, byte for byte', () => {
    // Every caller that predates the question — a stored basicConfig, the soak
    // harness, an older test — must land exactly where it landed before.
    const asked = magical();
    const never = unasked();
    expect(never.fingerprint).toEqual(asked.fingerprint);
    expect(JSON.stringify(never.campaign)).toEqual(JSON.stringify(asked.campaign));
    expect(JSON.stringify(never.settlements)).toEqual(JSON.stringify(asked.settlements));
  });
});

describe('MG-2 — the projection reaches every member', () => {
  test('every member is minted magic-off, both fields together', () => {
    const { settlements } = mundane();
    expect(settlements.length).toBeGreaterThan(1);
    for (const member of settlements) {
      expect(member.config.magicExists).toBe(false);
      expect(member.config.priorityMagic).toBe(0);
    }
    // Positive control: the same seed's magical twin carries the opposite, so
    // the loop above is reading the knob and not a constant.
    for (const member of magical().settlements) {
      expect(member.config.magicExists).toBe(true);
      expect(member.config.priorityMagic).not.toBe(0);
    }
  });

  test('the save entry config and the persisted _config are the SAME spelling', () => {
    // The class this pin exists for: two literals that merely agreed. A member
    // generated mundane whose stored config claimed magic would come back
    // magical on the very next regeneration.
    for (const member of mundane().settlements) {
      const persisted = member.settlement._config;
      expect(persisted.magicExists).toBe(false);
      expect(persisted.priorityMagic).toBe(0);
      expect(persisted.magicExists).toBe(member.config.magicExists);
      expect(persisted.priorityMagic).toBe(member.config.priorityMagic);
    }
  });

  test('neither projected field is stripped as a derived key (the regen fallback)', () => {
    expect(DERIVED_CONFIG_KEYS).not.toContain('magicExists');
    expect(DERIVED_CONFIG_KEYS).not.toContain('priorityMagic');
    // Anchor: the list is non-empty and does strip what it claims to, so the
    // two absences above are measured against a live list.
    expect(DERIVED_CONFIG_KEYS).toContain('magicLevel');
  });

  test('the generation world law saw a dead-magic world', () => {
    for (const member of mundane().settlements) {
      expect(member.settlement.config.magicExists).toBe(false);
      // The derived band follows the dial the projection zeroed.
      expect(member.settlement.config.magicLevel).toBe('none');
    }
    // Positive control on the same seed.
    expect(magical().settlements[0].settlement.config.magicLevel).not.toBe('none');
  });
});

describe('MG-2 — regen survival (the lifecycle path that eats projections)', () => {
  test('replaying the persisted _config regenerates a mundane settlement', () => {
    const member = mundane().settlements[0];
    const regenerated = generateSettlementPipeline(
      { ...member.settlement._config },
      null,
      { seed: member.seed, customContent: {} },
    );
    expect(regenerated.config.magicExists).toBe(false);
    expect(regenerated.config.priorityMagic).toBe(0);
    expect(regenerated.config.magicLevel).toBe('none');
  });
});

describe("MG-2 — the realm's own remainder", () => {
  test('a mundane realm records its default; a magical one records nothing', () => {
    const rules = mundane().campaign.worldState.simulationRules;
    expect(rules.realmMagicDefault).toBe('mundane');
    expect(realmMagicIsMundane(rules)).toBe(true);

    const magicalRules = magical().campaign.worldState.simulationRules;
    expect(magicalRules.realmMagicDefault).toBeUndefined();
    expect(realmMagicIsMundane(magicalRules)).toBe(false);
  });

  test('writing it does not disturb the tone preset the realm was built with', () => {
    // Preset IDENTITY is the property at risk: a new rules key that entered the
    // comparison surface would collapse every mundane realm to 'custom'.
    expect(mundane().campaign.worldState.simulationRules.presetId).toBe('realistic_regional');
    expect(magical().campaign.worldState.simulationRules.presetId).toBe('realistic_regional');
  });

  test('the provenance marker echoes a mundane stance only', () => {
    expect(mundane().campaign.instantWorld.magic).toBe('no');
    expect(Object.hasOwn(magical().campaign.instantWorld, 'magic')).toBe(false);
    // Anchor: the marker itself is alive in both arms.
    expect(magical().campaign.instantWorld.seed).toBe(SEED);
  });
});
