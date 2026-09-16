/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumLivingCompletions.test.jsx — Compendium-completion Wave L pin.
 *
 * Three completions: the settlement lifecycle phases (relic ruin / abandoned site +
 * satellite fates), the 10 NPC goal kinds the world pulse pursues, and the operations
 * klass + scope legend (previously the klass meanings rendered only under an active
 * filter, so the default All view stamped three undefined tags).
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { SystemsHub, OperationsHub } from '../../src/components/compendium/RegistryHubs.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(cleanup);

describe('compendium living-world completions', () => {
  test('the lifecycle remnants + satellites render on the Living World tab', () => {
    expect(CD.lifecycle.remnants.length).toBe(2);
    const { container } = render(<SystemsHub />);
    const text = container.textContent || '';
    for (const r of CD.lifecycle.remnants) expect(text.includes(r.label), `missing remnant "${r.label}"`).toBe(true);
    expect(text.includes(CD.lifecycle.satellites)).toBe(true);
  });

  test('all 10 NPC goal kinds are the real npcAgency GOALS + render', () => {
    expect(CD.npcGoals.entries.length).toBe(10);
    const src = readFileSync(join(ROOT, 'src/domain/worldPulse/npcAgency.js'), 'utf8');
    for (const g of CD.npcGoals.entries) {
      expect(src.includes(`'${g.id}'`), `npcAgency no longer has goal "${g.id}"`).toBe(true);
    }
    const { container } = render(<SystemsHub />);
    const text = container.textContent || '';
    for (const g of CD.npcGoals.entries) expect(text.includes(g.label), `Living tab missing goal "${g.label}"`).toBe(true);
  });

  test('the operations klass + scope legend is always visible (no filter needed)', () => {
    const { container } = render(<OperationsHub />);
    const text = container.textContent || '';
    // All three klass meanings render on the default All view.
    expect(text.includes('orchestrates a batch')).toBe(true);
    expect(text.includes('moves store or view state')).toBe(true);
    // The three scopes are defined.
    expect(text.includes('account-wide state')).toBe(true);
    expect(text.includes('a linked campaign world')).toBe(true);
  });
});
