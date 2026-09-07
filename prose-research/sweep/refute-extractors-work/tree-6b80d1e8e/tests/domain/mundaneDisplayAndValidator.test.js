/**
 * mundaneDisplayAndValidator.test.js — MG-3d + MG-3e: LEAKS L7 + L6 CLOSED
 * (docs/DESIGN_REALM_MAGIC_TOGGLE.md §3 leak register, §4 MG-3 slices d + e).
 *
 * REPRODUCE-FIRST. These two are a matched pair, which is why they share a file: one
 * stops the page LYING about magic that is not there, the other starts it SPEAKING UP
 * about magic that should not be there.
 *
 *   L7 — a settlement whose world has magic but whose own dial is zero (magicExists
 *        true, priorityMagic 0 ⇒ band 'none') fell past magicProfile's dead-magic
 *        short-circuit into the band ladder, where band 'none' reads availability
 *        'rare' and legality 'restricted'. The dossier claimed a rare, restricted
 *        magic trade in a town where generation produced no magic at all — and
 *        restricted-ness implies an authority bothering to restrict something.
 *   L6 — structuralValidator's high-magic-institution warning fired at band 'low' and
 *        stopped there, and never read magicExists at all, so the strangest case of
 *        all — a teleportation circle in a world where magic does not function —
 *        passed in total silence.
 *
 * MG-LAW-4 governs both closures: an authored premise SURVIVES. The profile keeps
 * running its ladder when an arcane institution actually stands in the roster, and the
 * validator WARNS rather than erases. One strange glowing tower in a mundane realm is a
 * deliberate act the DM is entitled to; the engine's job is to say so out loud.
 */
import { describe, expect, test } from 'vitest';

import { deriveMagicProfile } from '../../src/domain/magicProfile.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

// ── L7: the display asymmetry ───────────────────────────────────────────────────

/** A town with a real magic axis reading zero, in a world where magic works. */
function zeroDialTown(extraInstitutions = []) {
  return {
    tier: 'town',
    population: 2400,
    config: { magicExists: true, priorityMagic: 0, tradeRouteAccess: 'road' },
    institutions: [{ name: 'Market square' }, { name: 'Granary' }, ...extraInstitutions],
    economicState: { prosperity: 'Modest', primaryExports: [], primaryImports: [] },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Stable' }, factions: [], conflicts: [] },
  };
}

describe('MG-3d — L7: nothing is not rare, it is nothing', () => {
  test('a zero dial in a magical world profiles ABSENT, not rare-and-restricted (the leak, closed)', () => {
    const profile = deriveMagicProfile(zeroDialTown());
    expect(profile.availability).toBe('absent');
    expect(profile.legality).toBe('absent');
    expect(profile.cost).toBe('absent');
    expect(profile.risk).toBe('absent');
    // The world still HAS magic — this town simply has none of it. That distinction is
    // the whole reason this is a separate arm from the dead-magic short-circuit.
    expect(profile.magicExists).toBe(true);
    expect(profile.contributors[0].effect).toBe('no_practice');
  });

  test('the dead-magic short-circuit is untouched and still says magic does not function', () => {
    const dead = deriveMagicProfile({ ...zeroDialTown(), config: { magicExists: false, priorityMagic: 0 } });
    expect(dead.magicExists).toBe(false);
    expect(dead.availability).toBe('absent');
    expect(dead.contributors[0].effect).toBe('no_magic');
  });

  test('MG-LAW-4 — an AUTHORED arcane institution keeps the ladder running (never erased)', () => {
    // World law refuses to MINT an arcane institution at a zero dial, so one standing in
    // the roster is the DM's deliberate act. Magic plainly IS available there; the
    // validator's warning below is what carries the strangeness, not a blanked profile.
    const authored = deriveMagicProfile(zeroDialTown([{ name: "Wizard's tower" }]));
    expect(authored.availability !== 'absent').toBe(true);
    expect(authored.magicExists).toBe(true);
  });

  test('a settlement with NO magic axis is unmoved (the present-guard)', () => {
    const axisless = deriveMagicProfile({ ...zeroDialTown(), config: { tradeRouteAccess: 'road' } });
    expect(axisless.availability !== 'absent').toBe(true);
    expect(axisless.legality !== 'absent').toBe(true);
  });

  test('a real magical town is completely unmoved', () => {
    const magical = deriveMagicProfile({ ...zeroDialTown(), config: { magicExists: true, priorityMagic: 70, tradeRouteAccess: 'road' } });
    expect(magical.availability !== 'absent').toBe(true);
    expect(magical.magicExists).toBe(true);
  });
});

// ── L6: the validator's silence ─────────────────────────────────────────────────

const CIRCLE = 'Teleportation circle';

function warningsFor(config) {
  const { violations } = checkStructuralValidity(
    [{ name: CIRCLE }, { name: 'Market square' }],
    { tier: 'city', tradeRouteAccess: 'road', monsterThreat: 'frontier', ...config },
  );
  return violations.filter(v => v.type === 'context_warning' && v.institution === CIRCLE);
}

describe('MG-3e — L6: the validator names the strangeness instead of swallowing it', () => {
  test('a DEAD-MAGIC world with a legacy circle now warns (the leak, closed)', () => {
    const warnings = warningsFor({ magicExists: false, priorityMagic: 0 });
    expect(warnings.length).toBe(1);
    expect(warnings[0].severity).toBe('warning'); // a WARNING — MG-LAW-4, never an erasure
    expect(/does not function/i.test(warnings[0].reason)).toBe(true);
  });

  test('a zero dial in a MAGICAL world warns in its own words', () => {
    const warnings = warningsFor({ magicExists: true, priorityMagic: 0 });
    expect(warnings.length).toBe(1);
    expect(/no magic is practised here/i.test(warnings[0].reason)).toBe(true);
  });

  test('the LOW arm keeps its original wording exactly (no existing warning moved)', () => {
    const warnings = warningsFor({ magicExists: true, priorityMagic: 20 });
    expect(warnings.length).toBe(1);
    expect(warnings[0].reason).toContain('Magic level is set to Low');
  });

  test('a genuinely high-magic city is silent, and so is a medium one', () => {
    expect(warningsFor({ magicExists: true, priorityMagic: 80 }).length).toBe(0);
    expect(warningsFor({ magicExists: true, priorityMagic: 40 }).length).toBe(0);
  });

  test('the canonical ladder agrees with the old local one at every boundary but zero', () => {
    // The only band this slice moved is the zero dial (was 'low', now 'none'); 25/26/65/66
    // must land exactly where the replaced `<=25 low : >=66 high : medium` ladder put them.
    expect(warningsFor({ magicExists: true, priorityMagic: 25 })[0].reason).toContain('set to Low');
    expect(warningsFor({ magicExists: true, priorityMagic: 26 }).length).toBe(0); // medium
    expect(warningsFor({ magicExists: true, priorityMagic: 65 }).length).toBe(0); // medium
    expect(warningsFor({ magicExists: true, priorityMagic: 66 }).length).toBe(0); // high
  });
});
