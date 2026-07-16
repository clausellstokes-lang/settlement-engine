/**
 * @vitest-environment jsdom
 *
 * SuccessorPrompt does NOT fire a pricing moment on "Appoint someone new"
 * (finding components-dossier-library-5, W-R2-TRUST).
 *
 * THE BUG THIS CATCHES: pickNew() fired triggerPricingMoment('first_canon_export')
 * — export-themed copy at a succession moment, a purchase modal thrown on top of
 * the composer the DM was just scrolled to, AND it burned the 24h cooldown for
 * the REAL first-canon-export moment. pricingMoments' own doctrine is "don't ask
 * before they understand the value"; the composer flow IS the value moment.
 *
 * THE PIN: clicking "Appoint someone new" stages the ADD_NPC composer intent and
 * dismisses the prompt, but never opens the purchase modal.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});

import SuccessorPrompt from '../../src/components/settlement/SuccessorPrompt.jsx';

describe('SuccessorPrompt — no borrowed pricing moment', () => {
  test('"Appoint someone new" stages ADD_NPC and dismisses without opening the purchase modal', () => {
    const stageComposerIntent = vi.fn();
    const dismiss = vi.fn();
    const setPurchaseModalOpen = vi.fn();
    storeRef.current = {
      pendingSuccession: {
        outgoingNpcName: 'Aldric',
        outgoingRole: 'Guildmaster',
        suggestedSuccessorIds: [],
        linkedInstitutionIds: ['inst-1'],
      },
      settlement: { name: 'Testburg', npcs: [], institutions: [{ id: 'inst-1', name: 'The Guild' }] },
      stageComposerIntent,
      dismissPendingSuccession: dismiss,
      auth: { tier: 'wanderer' },
      setPurchaseModalOpen,
    };

    render(<SuccessorPrompt />);
    fireEvent.click(screen.getByRole('button', { name: /appoint someone new/i }));

    expect(stageComposerIntent).toHaveBeenCalledTimes(1);
    expect(stageComposerIntent.mock.calls[0][0]).toMatchObject({ type: 'ADD_NPC' });
    expect(dismiss).toHaveBeenCalledTimes(1);
    // The load-bearing assertion: no purchase modal interrupts the composer flow.
    expect(setPurchaseModalOpen).not.toHaveBeenCalled();
  });
});
