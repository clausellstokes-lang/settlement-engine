/** @vitest-environment jsdom */
/**
 * heraldForecast.test.jsx — THE FORECAST GRAMMAR pins (Phase 5, Divination door).
 *
 * A forecast is present-progressive and ALWAYS amendable — a prediction, never a
 * fact. The outcome it builds toward is the recorded label, byte-verbatim; the frame
 * is a frozen lead, and no separator is a literal em-dash character.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import { RealmEntityContext } from '../../src/components/map/RealmEntityContext.jsx';
import HeraldForecast from '../../src/components/map/HeraldForecast.jsx';

afterEach(cleanup);

const web = {
  resolveSubject: (d) => (d && d.settlementId != null
    ? [{ role: 'settlement', label: 'Ashford', settlementSaveId: d.settlementId, entityId: 'e1', linked: true }]
    : null),
  resolveSettlement: (id) => [{ role: 'settlement', label: id === 's1' ? 'Ashford' : String(id), settlementSaveId: id, entityId: `e-${id}`, linked: true }],
};
const ctx = { web, navigateToRealmEntity: () => {} };

const emerging = {
  id: 'f1', section: 'divination',
  headline: 'Famine takes hold', summary: '',
  severity: 0.6, major: false, tick: 8,
  reasons: ['failed_harvest'],
  subject: { settlementId: 's1' },
  affectedIds: ['s1'],
  kind: 'famine', rootId: null,
  provenance: 'canon', record: {},
};

function renderForecast(item) {
  return render(
    <RealmEntityContext.Provider value={ctx}>
      <HeraldForecast item={item} />
    </RealmEntityContext.Provider>,
  );
}

describe('HeraldForecast — the weather page', () => {
  test('reads present-progressive: the frozen "Pressure builds toward" lead', () => {
    renderForecast(emerging);
    expect(screen.getByText('Pressure builds toward')).toBeTruthy();
  });

  test('carries the amendable chip on EVERY entry, even a canon-provenance record', () => {
    renderForecast(emerging);
    expect(screen.getByText('amendable')).toBeTruthy();
  });

  test('the outcome it builds toward is the recorded label, byte-verbatim', () => {
    // GREEN-TIP (2026-11-10, re-keyed by cause a9bf31e9b, the regional news card, A1 rows): a recorded driver is
    // printed in the fiction register through newsBody.js :: newsReasonPhrases, and a BARE ENGINE TOKEN with no
    // reader phrase prints NO pill (A1·13: a de-underscored slug is the engine's word, not the world's). The
    // fixture's `failed_harvest` is such a token, so the driver this arm reads is one the vocabulary phrases: the
    // famine's own `food_pressure`. The pin is unchanged: the recorded driver is shown, in the reader's words.
    renderForecast({ ...emerging, reasons: ['food_pressure'] });
    expect(screen.getByText('Famine takes hold')).toBeTruthy();
    expect(screen.getByText('Drivers')).toBeTruthy();
    expect(screen.getByText('food stores under strain')).toBeTruthy(); // recorded driver, in the reader's words
    cleanup();
    // and the bare token prints no pill: no Drivers slot, no humanized slug
    const { container } = renderForecast(emerging);
    expect(screen.getByText('Famine takes hold')).toBeTruthy(); // anchored: the card rendered
    expect(container.textContent).not.toMatch(/Drivers|failed harvest/i);
  });

  test('is visually tagged as a forecast (its own testid) and holds no em-dash/exclamation', () => {
    const { container } = renderForecast(emerging);
    expect(screen.getByTestId('herald-forecast')).toBeTruthy();
    expect(container.textContent).not.toContain('—');
    expect(container.textContent).not.toContain('!');
  });
});
