/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ContentSampleReceipt from '../../src/components/contentStudio/ContentSampleReceipt.jsx';

afterEach(cleanup);

describe('ContentSampleReceipt category fixtures', () => {
  it('renders activation paths and the limits disclosed by their receipts', () => {
    render(<ContentSampleReceipt sample={{
      seed: 'receipt-fixtures',
      diff: {
        scalarChanges: [],
        materialized: {},
        addedExports: [],
      },
      forced: [],
      dormant: [{ name: 'Whispering Rot' }],
      fixtures: [
        {
          id: 'institutions:village',
          kind: 'generation-boundary',
          bucket: 'institutions',
          tier: 'village',
          boundaries: ['minimum'],
          receipt: {
            definitions: [{
              localUid: 'glassworks',
              name: 'Glassworks',
              materialized: true,
              fieldTruth: {
                presentationOnly: ['description'],
                unsupported: [],
              },
            }],
          },
        },
        {
          id: 'stressors:rot',
          kind: 'stressor-event',
          bucket: 'stressors',
          name: 'Whispering Rot',
          result: { active: true, fixtureSeverity: 0.6 },
          event: { veto: null },
          receipt: {
            fieldTruth: {
              presentationOnly: ['severity', 'affects'],
              unsupported: [],
            },
            assumption: 'The authored severity label is not converted into simulation rules.',
          },
        },
        {
          id: 'traditions:vigil',
          kind: 'tradition-observance',
          bucket: 'traditions',
          name: 'Lantern Vigil',
          result: {
            observance: {
              name: 'Lantern Vigil',
              window: { startWeekOfYear: 9 },
            },
          },
          receipt: {
            fieldTruth: {
              presentationOnly: ['motifElement', 'motifAct'],
              unsupported: [],
            },
            note: 'This does not claim tick-time effects.',
          },
        },
      ],
    }} />);

    expect(screen.getByTestId('content-sample-category-fixtures')).toBeTruthy();
    expect(screen.getByText(/minimum tier village/)).toBeTruthy();
    expect(screen.getByText(/unsaved APPLY_STRESSOR/)).toBeTruthy();
    expect(screen.getByText(/fixture severity 0.6/)).toBeTruthy();
    expect(screen.getByText(/severity, affects/)).toBeTruthy();
    expect(screen.getByText(/dossier observance/)).toBeTruthy();
    expect(screen.getByText(/does not claim tick-time effects/)).toBeTruthy();
  });

  it('distinguishes a materialized override from one rejected by canonical gates', () => {
    render(<ContentSampleReceipt sample={{
      seed: 'receipt-override-truth',
      diff: {
        scalarChanges: [],
        materialized: {},
        addedExports: [],
      },
      forced: [
        { name: 'Town Glassworks', materialized: true },
        { name: 'Metropolitan Exchange', materialized: false },
        {
          name: 'Twin Ore',
          materialized: false,
          materializationState: 'ambiguous',
        },
      ],
      dormant: [],
      fixtures: [],
    }} />);

    expect(screen.getByText(
      /Town Glassworks was marked mandatory and materialized only/i,
    )).toBeTruthy();
    expect(screen.getByText(
      /Metropolitan Exchange did not materialize in the default summary tier/i,
    )).toBeTruthy();
    expect(screen.getByText(
      /Same-name entity present, exact definition unknown: Twin Ore/i,
    )).toBeTruthy();
    expect(screen.queryByText(/forced present/i)).toBeNull();
  });
});
