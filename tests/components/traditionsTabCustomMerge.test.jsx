/** @vitest-environment jsdom */
/**
 * traditionsTabCustomMerge.test.jsx — WB-j genesis consumption at the view
 * consumer. In PREVIEW mode the dossier's Traditions tab merges a DM's authored
 * custom traditions (customContent.traditions) into the derived founding set, so
 * the homebrew a DM wrote surfaces in the dossier. The pure leaf + the golden are
 * untouched (proven in customFoundingTraditions.test.js); this pins the wiring.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Store mock — TraditionsTab reads only customContent.traditions.
const state = {
  customContent: {
    traditions: [
      { id: 't1', name: 'The Salt Vigil', motifElement: 'tide', motifAct: 'vigil', epithet: 'kept since the first tide turned' },
    ],
  },
};
vi.mock('../../src/store/index.js', () => {
  const useStore = (sel) => sel(state);
  useStore.getState = () => state;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';

afterEach(cleanup);

const DRAFT = { name: 'Saltmarch', _seed: 'wbj-tab-1', tier: 'town', config: {} };

describe('TraditionsTab — WB-j custom-tradition genesis consumption (preview)', () => {
  it('surfaces an authored custom tradition in the founding preview', () => {
    render(<TraditionsTab settlement={DRAFT} />);
    expect(screen.getByText('The Salt Vigil')).toBeTruthy();
    // its epithet renders as the provenance line (no mutationLog yet)
    expect(screen.getByText(/kept since the first tide turned/)).toBeTruthy();
  });
});
