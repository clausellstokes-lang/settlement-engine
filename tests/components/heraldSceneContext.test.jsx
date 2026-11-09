/** @vitest-environment jsdom */

import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import HeraldSceneContext from '../../src/components/map/HeraldSceneContext.jsx';

afterEach(cleanup);

describe('Herald settlement-portrait context', () => {
  it('presents the exact selected identity and recorded causes without a fake story match', () => {
    const onDismiss = vi.fn();
    render(
      <HeraldSceneContext
        context={{
          action: 'inspect-scene-provenance',
          sceneId: 'building:market',
          entityKind: 'building',
          label: 'The Covered Market',
          canonicalRef: { kind: 'institution', id: 'market' },
          provenanceRefs: ['provenance:region', 'provenance:missing-detail'],
          provenance: [{
            id: 'provenance:region',
            effect: 'regional-grain',
            family: 'region',
            sourceRef: 'river terrace',
            displayText: 'regional-grain: river terrace',
          }],
        }}
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByRole('heading', { name: 'The Covered Market' })).toBeTruthy();
    expect(screen.getByText('Review recorded causes')).toBeTruthy();
    // D2·12 + D·89 (STYLE-2-PULSE-FOLLOWUP; re-keyed by cause): plain words on the face — the
    // kind and the family humanized, a cause without a description said so — and the ids
    // (scene, canonical record, provenance reference) kept as data, never printed.
    expect(screen.getByText('Building')).toBeTruthy();
    expect(screen.getByText(/regional-grain: river terrace/)).toBeTruthy();
    expect(screen.getByText(/· Region/)).toBeTruthy();
    expect(screen.getByText('A cause the portrait noted, without a description.')).toBeTruthy();
    expect(screen.getByText(/has not guessed which story this place belongs to/i)).toBeTruthy();
    const card = screen.getByTestId('herald-scene-context');
    expect(card.getAttribute('data-scene-id')).toBe('building:market');
    expect(card.getAttribute('data-canonical-ref')).toBe('institution:market');
    // anchored: the card's own data attributes above prove it rendered with the ids in hand.
    expect(card.textContent).not.toMatch(/building:market|institution: ?market|provenance:/);

    fireEvent.click(screen.getByRole('button', {
      name: 'Dismiss settlement portrait context',
    }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('fails closed on an unsupported action', () => {
    const { container } = render(
      <HeraldSceneContext
        context={{
          action: 'guess-a-story',
          sceneId: 'building:market',
        }}
      />,
    );
    expect(container.childElementCount).toBe(0);
  });
});
