/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumMonsterThreat.test.jsx — Compendium-completion Wave F pin.
 *
 * THE LIE: the compendium listed four Monster Threat rows (Safe / Frontier / Dangerous
 * / Plagued), but the engine's canonical vocabulary is THREE arms heartland / frontier
 * / plagued (config display names Safe Heartland / Active Frontier / Embattled Region).
 * 'Safe' and 'Dangerous' were phantom rungs (the same class as the phantom 'Affluent'
 * prosperity rung). This pins the compendium to the PRODUCER surface so the lie cannot
 * return, and stays true after the queued T4 deriveSystemState fixes:
 *   1. The config panel (the producer) offers exactly heartland/frontier/plagued.
 *   2. The Tiers tab renders the three display names and NO phantom 'Dangerous' rung.
 *   3. No archetype condition string references a phantom threat arm.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { TiersTab } from '../../src/components/compendium/CatalogTabs.jsx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CANONICAL_ARMS = ['heartland', 'frontier', 'plagued'];
const DISPLAY_NAMES = ['Safe Heartland', 'Active Frontier', 'Embattled Region'];

afterEach(cleanup);

describe('compendium monster threat — bound to the producer, no phantom rungs', () => {
  test('the config panel (producer) offers exactly the three canonical arms', () => {
    const cfg = readFileSync(join(ROOT, 'src/components/ConfigurationPanel.jsx'), 'utf8');
    for (const arm of CANONICAL_ARMS) {
      expect(cfg.includes(`value="${arm}"`), `config panel missing monsterThreat value "${arm}"`).toBe(true);
    }
    // The phantom arms are not options the producer emits.
    expect(cfg.includes('value="dangerous"')).toBe(false);
    expect(cfg.includes('value="safe"')).toBe(false);
  });

  test('the Tiers tab renders the three display names and no phantom Dangerous rung', () => {
    const { container } = render(<TiersTab />);
    const text = container.textContent || '';
    for (const name of DISPLAY_NAMES) {
      expect(text.includes(name), `Tiers tab missing threat display name "${name}"`).toBe(true);
    }
    // The threat section names all three canonical arms in its intro.
    for (const arm of CANONICAL_ARMS) expect(text.toLowerCase().includes(arm), `intro missing "${arm}"`).toBe(true);
  });

  test('no archetype condition references a phantom threat arm', () => {
    for (const a of CD.archetypes.entries) {
      const m = /threat:\s*([a-z]+)/.exec(a.cond || '');
      if (m) {
        expect(CANONICAL_ARMS.includes(m[1]), `archetype "${a.name}" cond uses phantom threat "${m[1]}"`).toBe(true);
      }
    }
  });
});
