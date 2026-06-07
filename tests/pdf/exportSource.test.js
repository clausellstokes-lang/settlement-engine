import { describe, it, expect } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

// §2a — PDF export source selection. The export sheet's Raw/AI-Enhanced toggle
// drives narrativeMode; buildViewModel resolves it to false unless an overlay
// actually exists, and swaps the dossier body accordingly.
describe('PDF export source selection (§2a)', () => {
  const raw = { name: 'Raw Town', tier: 'town' };
  const ai  = { name: 'Raw Town', tier: 'town' };

  it('keeps narrativeMode false when the user picks raw', () => {
    const vm = buildViewModel({ settlement: raw, aiSettlement: ai, narrativeMode: false });
    expect(vm.narrativeMode).toBe(false);
  });

  it('enables narrativeMode when the user picks AI-enhanced and an overlay exists', () => {
    const vm = buildViewModel({ settlement: raw, aiSettlement: ai, narrativeMode: true });
    expect(vm.narrativeMode).toBe(true);
  });

  it('falls back to raw when AI-enhanced is requested but no overlay exists', () => {
    const vm = buildViewModel({ settlement: raw, aiSettlement: null, narrativeMode: true });
    expect(vm.narrativeMode).toBe(false);
  });
});
