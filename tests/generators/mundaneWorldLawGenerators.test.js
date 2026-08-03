/**
 * mundaneWorldLawGenerators.test.js — MG-3c: LEAKS L4 + L5 CLOSED
 * (docs/DESIGN_REALM_MAGIC_TOGGLE.md §3 leak register, §4 MG-3 slice c).
 *
 * REPRODUCE-FIRST, both in the shape the register names:
 *
 *   L4 — neighbourGenerator minted 'Arcane Exchange Circle', '<N> Arcane Envoys',
 *        '<N> Arcane Observers' and 'Anti-<N> Arcane Resistance' with ZERO magicExists
 *        reads, so a settlement whose world has no functioning magic still grew arcane
 *        orders out of its neighbour's influence.
 *   L5 — legacyGenerator branched on `type === 'magical'` with no worldLaw import at
 *        all, explaining a mundane settlement's history with arcane practitioners and
 *        arcane civic status.
 *
 * Both cures are SUBSTITUTION, never deletion (MG-LAW-3 — a mundane world is not a
 * thinner world): the neighbour faction still lands and the historical event still
 * carries its legacy, each re-voiced as a world where knowledge is won rather than cast.
 * MG-LAW-4 holds too — an authored magical event is kept and re-voiced, never erased.
 */
import { describe, expect, test } from 'vitest';

import { getMirrorFactionLabel, getOpposeFactionLabel, getMundaneLoreFactionLabel } from '../../src/generators/neighbourGenerator.js';
import { deriveLegacyAnnotations } from '../../src/generators/legacyGenerator.js';
import { labelUnderWorldLaw } from '../../src/generators/steps/neighbourFactions.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';

// The world law's own magic-assertion vocabulary, as generationContext spells it. A
// mundane substitution that trips this would be the leak wearing a different name.
const ASSERTS_MAGIC = /\b(?:arcane|artificer|cantrips?|curses?|druid|enchant(?:ed|ing|ment)?|golems?|mage|magic|magical|necromanc(?:er|y|tic)|planar|runes?|scry(?:ing)?|sorcerer|spells?|teleport(?:ation)?|undead|warlock|witch|wizard)\b/i;

const MUNDANE_CONFIG = { magicExists: false, priorityMagic: 0 };
const MAGICAL_CONFIG = { magicExists: true, priorityMagic: 60 };

// ── L4: the neighbour-influence faction labels ──────────────────────────────────

const MIRROR_SLOTS = ['allied', 'patron', 'rival', 'cold_war'];
const OPPOSE_SLOTS = ['rival', 'cold_war', 'hostile'];

describe('MG-3c — L4: the arcane neighbour slot has a mundane twin at the content floor', () => {
  test('the authored arcane labels DO assert magic — the leak has a real subject', () => {
    // Anti-vacuity: if these ever stopped asserting magic the world law would pass them
    // and the substitution below would prove nothing.
    for (const relType of MIRROR_SLOTS) {
      expect(ASSERTS_MAGIC.test(String(getMirrorFactionLabel('magic', relType, 'Kelmarch')))).toBe(true);
    }
    for (const relType of OPPOSE_SLOTS) {
      expect(ASSERTS_MAGIC.test(String(getOpposeFactionLabel('magic', relType, 'Kelmarch')))).toBe(true);
    }
  });

  test('a mundane world REFUSES every one of them (the world law is the arbiter)', () => {
    const mundaneLaw = createGenerationWorldLaw(MUNDANE_CONFIG);
    const magicalLaw = createGenerationWorldLaw(MAGICAL_CONFIG);
    for (const relType of MIRROR_SLOTS) {
      const label = getMirrorFactionLabel('magic', relType, 'Kelmarch');
      expect(mundaneLaw.allowsGeneratedContent({ name: label })).toBe(false);
      expect(magicalLaw.allowsGeneratedContent({ name: label })).toBe(true);
    }
  });

  test('every refused slot has FOUR distinct mundane variants, and every one passes the law', () => {
    const mundaneLaw = createGenerationWorldLaw(MUNDANE_CONFIG);
    for (const [kind, slots] of [['mirror', MIRROR_SLOTS], ['oppose', OPPOSE_SLOTS]]) {
      for (const relType of slots) {
        const variants = [0, 1, 2, 3].map(i => getMundaneLoreFactionLabel(kind, relType, 'Kelmarch', i));
        expect(new Set(variants).size).toBe(4); // the content-depth floor, per slot
        for (const label of variants) {
          expect(typeof label).toBe('string');
          expect(ASSERTS_MAGIC.test(label)).toBe(false);
          expect(mundaneLaw.allowsGeneratedContent({ name: label })).toBe(true);
        }
      }
    }
  });

  test('the pick wraps defensively and an unauthored slot returns null rather than inventing one', () => {
    expect(getMundaneLoreFactionLabel('mirror', 'rival', 'Kelmarch', 4))
      .toBe(getMundaneLoreFactionLabel('mirror', 'rival', 'Kelmarch', 0));
    expect(getMundaneLoreFactionLabel('mirror', 'rival', 'Kelmarch', -1))
      .toBe(getMundaneLoreFactionLabel('mirror', 'rival', 'Kelmarch', 3));
    expect(getMundaneLoreFactionLabel('mirror', 'client', 'Kelmarch', 0)).toBe(null);
    expect(getMundaneLoreFactionLabel('nonsense', 'rival', 'Kelmarch', 0)).toBe(null);
  });
});

// ── L4: the STEP's own substitution decision (the site that actually fires) ─────

// A stub rng standing in for the pipeline's seeded stream: it records whether the
// substitution path drew at all, which is how the byte-identity claim is proven rather
// than asserted.
function countingRng(value = 2) {
  const calls = { randInt: 0 };
  return { calls, randInt: (lo, hi) => { calls.randInt += 1; return Math.min(hi, Math.max(lo, value)); } };
}

describe('MG-3c — L4: the step substitutes under the law and never touches a magical stream', () => {
  const mundaneLaw = createGenerationWorldLaw(MUNDANE_CONFIG);
  const magicalLaw = createGenerationWorldLaw(MAGICAL_CONFIG);

  test('a MAGICAL world keeps the arcane label AND draws no rng (byte-identical)', () => {
    const rng = countingRng();
    const label = getMirrorFactionLabel('magic', 'allied', 'Kelmarch');
    expect(labelUnderWorldLaw('mirror', label, magicalLaw, 'allied', 'Kelmarch', rng)).toBe(label);
    expect(rng.calls.randInt).toBe(0);
  });

  test('a MUNDANE world substitutes the seeded mundane twin (the leak, closed at the site)', () => {
    const rng = countingRng(2);
    const arcane = getMirrorFactionLabel('magic', 'allied', 'Kelmarch');
    const swapped = labelUnderWorldLaw('mirror', arcane, mundaneLaw, 'allied', 'Kelmarch', rng);
    expect(swapped).toBe(getMundaneLoreFactionLabel('mirror', 'allied', 'Kelmarch', 2));
    expect(ASSERTS_MAGIC.test(String(swapped))).toBe(false);
    expect(rng.calls.randInt).toBe(1);
  });

  test('a NON-magic label is untouched in both worlds, and an empty slot stays empty', () => {
    const mundane = countingRng();
    const trade = getMirrorFactionLabel('economy', 'trade_partner', 'Kelmarch');
    expect(labelUnderWorldLaw('mirror', trade, mundaneLaw, 'trade_partner', 'Kelmarch', mundane)).toBe(trade);
    expect(mundane.calls.randInt).toBe(0);
    expect(labelUnderWorldLaw('mirror', null, mundaneLaw, 'allied', 'Kelmarch', mundane)).toBe(null);
    // No world law at all (a caller outside the pipeline) leaves the label alone.
    expect(labelUnderWorldLaw('mirror', trade, null, 'trade_partner', 'Kelmarch', mundane)).toBe(trade);
  });

  test('a refused label with NO authored mundane twin is SKIPPED, never invented', () => {
    const rng = countingRng();
    // 'client' has no arcane slot and so no mundane twin; a refused label there yields
    // null and the step simply does not add the faction.
    expect(labelUnderWorldLaw('mirror', 'Arcane Somethings', mundaneLaw, 'client', 'Kelmarch', rng)).toBe(null);
  });
});

// ── L5: the legacy annotation voice ─────────────────────────────────────────────

const MAGICAL_EVENT = {
  name: 'The Ninefold Convocation',
  type: 'magical',
  yearsAgo: 40,
  severity: 'major',
  lastingEffects: ['a standing assembly'],
};

function settlementWith(config, arcaneFactionPower) {
  return {
    config,
    powerStructure: {
      publicLegitimacy: { score: 60, label: 'Stable' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 40, powerLabel: 'Dominant' },
        { faction: 'The Ninefold Circle', category: 'magic', power: arcaneFactionPower, powerLabel: 'Strong' },
      ],
    },
    economicState: { prosperity: 'Prosperous', foodSecurity: 'Secure' },
  };
}

const history = { historicalEvents: [MAGICAL_EVENT] };

describe('MG-3c — L5: a mundane settlement gets its history back in mundane words', () => {
  test('a MAGICAL world still speaks of arcane practitioners (the pre-MG voice, unmoved)', () => {
    const notes = deriveLegacyAnnotations(history, settlementWith(MAGICAL_CONFIG, 30));
    expect(notes.length).toBeGreaterThan(0);
    expect(ASSERTS_MAGIC.test(notes.map(n => n.annotation).join(' '))).toBe(true);
  });

  test('a MUNDANE world keeps the event but drops every arcane claim (the leak, closed)', () => {
    const notes = deriveLegacyAnnotations(history, settlementWith(MUNDANE_CONFIG, 30));
    // MG-LAW-4: the authored event SURVIVES — the annotation is still produced.
    expect(notes.length).toBeGreaterThan(0);
    // MG-LAW-3: and it still says something; it is re-voiced, not blanked.
    expect(ASSERTS_MAGIC.test(notes.map(n => n.annotation).join(' '))).toBe(false);
    for (const note of notes) expect(String(note.annotation).length).toBeGreaterThan(20);
    // The event's own structural type token SURVIVES untouched — MG-LAW-4 keeps the
    // authored premise; only the arcane CLAIM in the prose is retired.
    expect(notes.map(n => n.eventType)).toEqual(['magical']);
  });

  test('an AXIS-LESS settlement reads exactly as the magical one (no accidental gating)', () => {
    const axisless = deriveLegacyAnnotations(history, settlementWith({ priorityEconomy: 30 }, 30));
    const magical = deriveLegacyAnnotations(history, settlementWith(MAGICAL_CONFIG, 30));
    expect(JSON.stringify(axisless)).toBe(JSON.stringify(magical));
  });

  test('the mundane voice is STABLE per event and VARIES across events (the content floor)', () => {
    const once = deriveLegacyAnnotations(history, settlementWith(MUNDANE_CONFIG, 30));
    const twice = deriveLegacyAnnotations(history, settlementWith(MUNDANE_CONFIG, 30));
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once)); // same world, same story, forever
    const voices = new Set();
    for (const name of ['The Ninefold Convocation', 'The Quiet Year', 'The Drowned Assize', 'The Long Reckoning', 'The Stone Compact', 'The Salt Accord']) {
      const notes = deriveLegacyAnnotations(
        { historicalEvents: [{ ...MAGICAL_EVENT, name }] },
        settlementWith(MUNDANE_CONFIG, 30),
      );
      for (const note of notes) voices.add(String(note.annotation));
    }
    expect(voices.size).toBeGreaterThan(1); // not one stock phrase for every town
  });
});
