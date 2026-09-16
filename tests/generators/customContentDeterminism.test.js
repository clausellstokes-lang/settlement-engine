/**
 * customContentDeterminism.test.js — F13 end-to-end determinism pin.
 *
 * The custom-content injection points (assembleInstitutions, resolveResources,
 * economyReconcilePass custom services) sort the user's homebrew list IMMEDIATELY
 * before rng.chance() draws. Before F13 those sorts used localeCompare, so a
 * settlement seeded with NON-ASCII custom names could inject them in a different
 * order — and thus consume rng differently — across locales/devices, silently
 * diverging the whole settlement.
 *
 * This pins two things with non-ASCII homebrew content present:
 *   1. same seed → byte-identical settlement (reproducibility survives custom
 *      content), and
 *   2. the custom names actually land in the output (the sorted injection path is
 *      genuinely exercised, not skipped).
 *
 * The cross-LOCALE guarantee itself rides on compareCodepoint being a pure
 * code-unit order (see tests/domain/deterministicSort.test.js) — it cannot vary by
 * host collation the way localeCompare can.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Non-ASCII names chosen so codepoint order (Z=U+005A < Á=U+00C1 < Å=U+00C5 <
// Ø=U+00D8) diverges from typical locale collation — the exact case that used to
// break replay.
const customContent = {
  institutions: [
    { localUid: 'ci1', name: 'Zürich Mint',   category: 'economic',      essential: true },
    { localUid: 'ci2', name: 'Ålesund Forge', category: 'economic',      essential: true },
    { localUid: 'ci3', name: 'Ábra Hall',     category: 'government',    essential: true },
    { localUid: 'ci4', name: 'Øystein Works',  category: 'infrastructure', essential: true },
  ],
  resources: [
    { localUid: 'cr1', name: 'Ýttrium vein',  category: 'mineral', essential: true },
    { localUid: 'cr2', name: 'Æther salt',    category: 'mineral', essential: true },
  ],
  services: [
    { localUid: 'cs1', name: 'Ølbrewer',      category: 'economic', essential: true },
    { localUid: 'cs2', name: 'Ñañez Scribes', category: 'economic', essential: true },
  ],
};

const config = {
  settType: 'city', culture: 'germanic', terrain: 'river',
  tradeRouteAccess: 'road', monsterThreat: 'civilized',
};
const SEED = 'f13-custom-determinism';

const run = () =>
  generateSettlementPipeline({ ...config }, null, { seed: SEED, customContent });

describe('F13 — custom-content injection is seed-deterministic with non-ASCII names', () => {
  it('two runs with the same seed produce byte-identical output', () => {
    const a = JSON.stringify(run());
    const b = JSON.stringify(run());
    expect(a).toBe(b);
  });

  it('actually injects the non-ASCII custom institutions (the sorted path is exercised)', () => {
    const s = run();
    const blob = JSON.stringify(s);
    // Every essential custom institution must appear somewhere in the settlement.
    for (const inst of customContent.institutions) {
      expect(blob, `custom institution "${inst.name}" missing from output`).toContain(inst.name);
    }
  });
});
