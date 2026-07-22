/** @vitest-environment jsdom */
/**
 * heraldHeadline.test.jsx — THE HERALD HEADLINE GRAMMAR pins (Phase 3).
 *
 * The shared line renders from TYPED SLOTS, never freeform: the recorded headline is
 * carried byte-verbatim (the truth surface), the subject-address resolves through the
 * realm web, the reason is the recorded cause behind a STYLED separator (never a
 * literal em-dash character), the provenance chip shows only when non-canonical, and
 * the nested form hoists the settlement level to a group header. Deterministic.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

import { RealmEntityContext } from '../../src/components/map/RealmEntityContext.jsx';
import HeraldHeadline from '../../src/components/map/HeraldHeadline.jsx';
import { headlineSlotsOf, groupBySettlement, reasonOf } from '../../src/components/map/heraldGrammar.js';

afterEach(cleanup);

// A minimal realm web: resolves a faction subject to settlement › power, a bare
// settlement to a single linked level, and each affected id to its name.
const NAMES = { s1: 'Ashford', s2: 'Bram' };
const web = {
  resolveSubject: (d) => {
    if (!d) return null;
    if (d.factionName) return [
      { role: 'settlement', label: 'Ashford', settlementSaveId: 's1', entityId: 'e-set', linked: true },
      { role: 'power', label: 'House Vale', settlementSaveId: 's1', entityId: 'e-pow', linked: true },
    ];
    if (d.settlementId != null) return [{ role: 'settlement', label: NAMES[d.settlementId] || String(d.settlementId), settlementSaveId: d.settlementId, entityId: 'e-set', linked: true }];
    return null;
  },
  resolveSettlement: (id) => [{ role: 'settlement', label: NAMES[id] || String(id), settlementSaveId: id, entityId: `e-${id}`, linked: true }],
};
const ctx = { web, navigateToRealmEntity: () => {} };

function renderHeadline(item, props = {}) {
  return render(
    <RealmEntityContext.Provider value={ctx}>
      <HeraldHeadline item={item} nameById={new Map(Object.entries(NAMES))} {...props} />
    </RealmEntityContext.Provider>,
  );
}

const warItem = {
  id: 'o1', section: 'war',
  headline: 'Bram besieges Ashford', summary: '',
  severity: 0.8, major: true, tick: 7,
  reasons: ['border_raid'],
  subject: { npcId: null, factionId: null, factionName: 'House Vale', settlementId: 's1' },
  affectedIds: ['s1', 's2'],
  kind: 'siege', rootId: 'wizard_news.7.war.applied.candidate.siege_1',
  provenance: 'canon', record: {},
};

describe('HeraldHeadline — the shared grammar line', () => {
  test('renders the byte-verbatim recorded headline as the action+object glance', () => {
    renderHeadline(warItem);
    expect(screen.getByText('Bram besieges Ashford')).toBeTruthy();
  });

  test('renders the SUBJECT-ADDRESS chain resolved through the realm web (linked)', () => {
    renderHeadline(warItem);
    // settlement › power, both linked by the web.
    expect(screen.getByRole('button', { name: /House Vale/ })).toBeTruthy();
  });

  test('renders the recorded REASON behind its typed section label (Casus for war), humanized', () => {
    renderHeadline(warItem);
    expect(screen.getByText('Casus')).toBeTruthy();
    expect(screen.getByText('border raid')).toBeTruthy();
  });

  test('the separator is a STYLED layout element — no literal em-dash in the rendered text', () => {
    const { container } = renderHeadline(warItem);
    expect(container.textContent).not.toContain('—'); // em dash
    expect(container.textContent).not.toContain('!');
  });

  test('provenance: canon is silent; amendable shows a chip', () => {
    const { rerender } = renderHeadline(warItem);
    expect(screen.queryByText('amendable')).toBeNull();
    cleanup();
    renderHeadline({ ...warItem, provenance: 'amendable' });
    expect(screen.getByText('amendable')).toBeTruthy();
  });

  test('nested form hoists the settlement — the subject chain drops the settlement level', () => {
    // A settlement-free glance so the assertion isolates the ADDRESS CHAIN level,
    // not the recorded headline (which may name the settlement in its own prose).
    const isolated = { ...warItem, affectedIds: [], headline: 'A siege tightens' };
    const flat = renderHeadline(isolated).container;
    expect(flat.textContent).toContain('Ashford'); // settlement present in the flat chain
    cleanup();
    const nested = renderHeadline(isolated, { nested: true }).container;
    expect(nested.textContent).toContain('House Vale'); // the power level stays
    expect(nested.textContent).not.toContain('Ashford'); // the settlement level is hoisted away
  });

  test('the ARTICLE toggle traces the recorded cause chain off rootId', () => {
    renderHeadline(warItem, { worldState: { pulseHistory: [] } });
    const trace = screen.getByRole('button', { name: /Trace the causes/ });
    fireEvent.click(trace);
    expect(screen.getByTestId('cause-walk')).toBeTruthy();
  });

  test('deterministic: two renders of the same item produce identical markup', () => {
    const a = renderHeadline(warItem).container.innerHTML;
    cleanup();
    const b = renderHeadline(warItem).container.innerHTML;
    expect(a).toBe(b);
  });
});

describe('heraldGrammar — typed slots + grouping (pure)', () => {
  test('headlineSlotsOf reads the record, never composes', () => {
    const slots = headlineSlotsOf(warItem);
    expect(slots.glance).toBe('Bram besieges Ashford');
    expect(slots.reason).toBe('border raid');
    expect(slots.reasonLabel).toBe('Casus');
    expect(slots.provenance).toBe('canon');
  });

  test('reasonOf degrades to null when the record holds no reason (never faked)', () => {
    expect(reasonOf({ reasons: [] })).toBeNull();
    expect(reasonOf({})).toBeNull();
  });

  test('groupBySettlement clusters by primary settlement, realm-wide group last', () => {
    const items = [
      { id: 'a', subject: { settlementId: 's1' }, affectedIds: ['s1'] },
      { id: 'b', subject: { settlementId: 's2' }, affectedIds: ['s2'] },
      { id: 'c', subject: {}, affectedIds: [] }, // subjectless / settlementless
    ];
    const groups = groupBySettlement(items, new Map(Object.entries(NAMES)));
    expect(groups.map(g => g.name)).toEqual(['Ashford', 'Bram', 'Across the realm']);
    expect(groups[2].settlementId).toBeNull();
  });
});
