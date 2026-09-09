/**
 * tests/generators/chainMagicSubstitution.test.js — magic-as-supplement
 * producer + the gen→sim seam (Cohesion Wave 5 #1).
 *
 * applyMagicSubstitution is the only producer of 'magically_sustained' (and
 * its magicNote receipt). Until Wave 5 the domain adapter flattened that
 * status to 'stable' via the unknown-status fallthrough — a druid-propped
 * depleted chain scored fully healthy to sim, display, AI, and receipts.
 * This suite pins the producer's own contract AND the end-to-end derivation:
 * magically_sustained → canonical 'substituted', carrying its note.
 */

import { describe, it, expect } from 'vitest';
import { applyMagicSubstitution } from '../../src/generators/chainMagicSubstitution.js';
import { deriveSupplyChainState } from '../../src/domain/supplyChainState.js';

function grainChain(over = {}) {
  return {
    needKey: 'food_security',
    needLabel: 'Food security',
    chainId: 'grain',
    label: 'Grain → flour',
    upstreamChains: [],
    processingInstitutions: ['Watermill'],
    outputs: ['flour'],
    services: [],
    resource: 'grain_fields',
    exportable: true,
    entrepot: false,
    status: 'impaired',
    resourceDepleted: true,
    ...over,
  };
}

describe('applyMagicSubstitution (producer)', () => {
  it('a druid tradition sustains a depleted grain chain (recovery >= 0.55)', () => {
    const chains = [grainChain()];
    applyMagicSubstitution(chains, { druid: true }, 50, 'village');
    expect(chains[0].status).toBe('magically_sustained');
    expect(chains[0].magicNote).toBe('Druidic cultivation supplements depleted farmland');
    expect(chains[0].magicRecovery).toBeCloseTo(0.65, 5);
    expect(chains[0].exportable).toBe(false); // supplement feeds the town, not the export ledger
  });

  it('a divine-only tradition props the chain to vulnerable, not sustained (0.40 < 0.55)', () => {
    const chains = [grainChain()];
    applyMagicSubstitution(chains, { divine: true }, 50, 'village');
    expect(chains[0].status).toBe('vulnerable');
    expect(chains[0].magicNote).toBe('Temple granaries blessed; divine provision fills the gap');
  });

  it('no tradition leaves the impaired chain untouched', () => {
    const chains = [grainChain()];
    applyMagicSubstitution(chains, {}, 50, 'village');
    expect(chains[0].status).toBe('impaired');
    expect(chains[0].magicNote).toBeUndefined();
  });

  it('thorps are below the substitution tier gate', () => {
    const chains = [grainChain()];
    applyMagicSubstitution(chains, { druid: true }, 50, 'thorp');
    expect(chains[0].status).toBe('impaired');
  });

  it('druidic forest management sustains a depleted timber chain', () => {
    const chains = [grainChain({
      needKey: 'raw_extraction', chainId: 'timber', label: 'Timber', resource: 'old_forest',
    })];
    applyMagicSubstitution(chains, { druid: true }, 50, 'town');
    expect(chains[0].status).toBe('magically_sustained');
    expect(chains[0].magicNote).toMatch(/forest management/);
  });
});

describe('the gen→sim seam (producer output through deriveSupplyChainState)', () => {
  it('a druid-propped depleted chain derives as substituted WITH its receipt — not fully healthy', () => {
    const chains = [grainChain()];
    applyMagicSubstitution(chains, { druid: true }, 50, 'village');
    const state = deriveSupplyChainState(chains[0]);
    expect(state.status).toBe('substituted');
    expect(state.legacyStatus).toBe('magically_sustained'); // raw-string UI/PDF readers keep working
    expect(state.magicNote).toBe('Druidic cultivation supplements depleted farmland');
    expect(state.resourceDepleted).toBe(true);
  });

  it('the divine-propped vulnerable chain derives as strained, note intact', () => {
    const chains = [grainChain()];
    applyMagicSubstitution(chains, { divine: true }, 50, 'village');
    const state = deriveSupplyChainState(chains[0]);
    expect(state.status).toBe('strained');
    expect(state.magicNote).toMatch(/divine provision/);
  });
});
