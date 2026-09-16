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
    expect(screen.getByText('building:market')).toBeTruthy();
    expect(screen.getByText('institution: market')).toBeTruthy();
    expect(screen.getByText(/regional-grain: river terrace/)).toBeTruthy();
    expect(screen.getByText('Recorded reference: provenance:missing-detail')).toBeTruthy();
    expect(screen.getByText(/has not guessed a story identity/i)).toBeTruthy();

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
