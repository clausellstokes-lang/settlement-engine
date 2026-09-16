/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumPowerExtras.test.jsx — Compendium-completion Wave M pin.
 *
 * The final power-family completions: what a power structure IS (the transfer causes the
 * chronicle stamps on a regime change) and how corruption moves (covert vs revealed, the
 * four vectors, exposure). Plus the archetype conditions re-worded off their phantom
 * tier/stress vocabulary.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { PowerTab_ } from '../../src/components/compendium/CatalogTabs.jsx';
import { RULING_POWER_CAUSES } from '../../src/domain/rulingPower.js';

afterEach(cleanup);

describe('compendium power extras — transfer causes, corruption, cond re-words', () => {
  test('the transfer causes are the real RULING_POWER_CAUSES', () => {
    expect(CD.powerStructure.transferCauses.map((c) => c.id)).toEqual([...RULING_POWER_CAUSES]);
    for (const c of CD.powerStructure.transferCauses) {
      expect(c.label && c.reading && c.reading.trim().length, `${c.id}`).toBeTruthy();
    }
    expect(CD.corruption.vectors.length).toBe(4);
  });

  test('the Power tab renders the transfer causes and corruption vectors', () => {
    const { container } = render(<PowerTab_ />);
    const text = container.textContent || '';
    for (const c of CD.powerStructure.transferCauses) expect(text.includes(c.label), `missing cause "${c.label}"`).toBe(true);
    for (const v of CD.corruption.vectors) expect(text.includes(v.label), `missing vector "${v.label}"`).toBe(true);
    expect(text.toLowerCase().includes('covertly')).toBe(true);
  });

  test('no archetype cond uses the phantom tier/stress vocabulary', () => {
    for (const a of CD.archetypes.entries) {
      const cond = a.cond || '';
      expect(cond.includes('tier: small'), `archetype "${a.name}" uses phantom "tier: small"`).toBe(false);
      expect(/Stress:\s*Siege\b/.test(cond), `archetype "${a.name}" uses phantom "Stress: Siege"`).toBe(false);
      expect(cond.includes('Stress: Monster Threat'), `archetype "${a.name}" uses phantom "Stress: Monster Threat"`).toBe(false);
    }
  });
});
