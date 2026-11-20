/** @vitest-environment jsdom */
/**
 * FRAME-6 · C2 (FRAME-5's brief C2-STAKES-PROSE; the chair's ruling 23 of 2026-11-20, vetoable by the owner): A STAKES ROW
 * IS A SENTENCE. The power stands with its article (`governanceAccount.js :: powerNameInProse(name, true)`) and its verb
 * takes its number (`powerSentenceName.js :: powerVerb`): "The Religious Authorities gain", "The Elder Council gains".
 * Before C2 the row opened on the bare roster leaf and its verb was always singular: "Religious Authorities gains".
 * The opening is composed once (`crisisPage.js :: stakeOpening`) and read by the Crisis tab and by the PDF (through
 * `crisisPrint.js :: stakeLines`); the tab's door still opens the power, only its visible text changes.
 *
 * THIS FILE REDS WHEN the tab or the PDF prints a stake row without the power's article, or with a verb that does not
 * take the power's number, or when the tab's stake door stops opening the power.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STAKE_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { CrisisSections } from '../../src/pdf/sections/CrisisSections.jsx';
import CrisisTab from '../../src/components/new/tabs/CrisisTab.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import { useStore } from '../../src/store/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

beforeAll(() => {
  window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
});
afterEach(() => cleanup());

/** Every string child of a React element tree (the PDF section renders no DOM). @param {any} node @returns {string[]} */
const strings = (node) => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(strings);
  if (typeof node.type === 'function' && node.type.name !== 'Line' && node.type.name !== 'Label') return strings(node.type(node.props));
  return strings(node.props?.children);
};
/** The tab's stake rows, as the reader sees them. @param {HTMLElement} container */
const tabRows = (container) => [...container.querySelectorAll('[data-testid="crisis-stake"]')].map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim());

/** A crafted town: one crisis, five stakes, plural and singular powers, a slashed label among them. */
const TOWN = {
  tier: 'town', name: 'Testholm',
  stress: [{
    type: 'succession_void', label: 'Succession Void',
    cast: {
      nature: 'social', roles: [], absent: [], levers: [],
      stakes: [
        { factionId: 'Religious Authorities', stake: 'gains', reason: STAKE_REASONS.gainsChurch },
        { factionId: 'Elder Council', stake: 'gains', reason: STAKE_REASONS.gainsRival },
        { factionId: 'Merchant Guilds', stake: 'loses', reason: STAKE_REASONS.losesSeat },
        { factionId: 'Military/Guard', stake: 'loses', reason: STAKE_REASONS.loses },
        { factionId: 'Monster Hunters / Adventurers', stake: 'split', reason: STAKE_REASONS.split },
      ],
    },
  }],
};
/** The five rows as a sentence prints them. */
const SAID = [
  `The Religious Authorities gain · ${STAKE_REASONS.gainsChurch}`,
  `The Elder Council gains · ${STAKE_REASONS.gainsRival}`,
  `The Merchant Guilds lose · ${STAKE_REASONS.losesSeat}`,
  `The Guard loses · ${STAKE_REASONS.loses}`,
  `The Monster Hunters split · ${STAKE_REASONS.split}`,
];

describe('C2: a stake row names its power with its article, and its verb takes the power\'s number', () => {
  it('the Crisis tab: "The Religious Authorities gain", "The Elder Council gains", never "Religious Authorities gains"', () => {
    const { container } = render(<CrisisTab settlement={TOWN} />);
    const rows = tabRows(container);
    expectAbsentWithAnchor(rows, `Religious Authorities gains · ${STAKE_REASONS.gainsChurch}`, SAID[0], 'tab: the plural power');
    expect(rows).toEqual(SAID);
  });

  it('the PDF: one Line per row, the same sentence', () => {
    const lines = strings(CrisisSections({ settlement: TOWN }));
    expectAbsentWithAnchor(lines, `Merchant Guilds loses · ${STAKE_REASONS.losesSeat}`, SAID[2], 'pdf: the plural power');
    for (const said of SAID) expect(lines, said).toContain(said);
  });
});

/** A born town of B7's crisis pool (gen.mjs's birth) whose stakes hold "Religious Authorities gains" at the base (measured). */
const BORN_SEED = 'b7-famine-town-0';
const TABS = [{ id: 'overview' }, { id: 'institutions' }, { id: 'npcs' }, { id: 'power' }, { id: 'crisis' }];

describe('C2 on a born town: the door still opens the power', () => {
  it(`${BORN_SEED}: the plural power's row reads with its article and its plural verb, and its link opens the power`, () => {
    const s = generateSettlementPipeline({ settType: 'town', stressType: 'famine' }, null, { seed: BORN_SEED, customContent: {} });
    act(() => { useStore.setState({ settlement: s }); });
    const setActiveTab = vi.fn();
    function Dossier({ children }) {
      const value = useDossierEntityNav(s, setActiveTab, TABS, {});
      return <DossierEntityContext.Provider value={value}>{children}</DossierEntityContext.Provider>;
    }
    const { container } = render(<Dossier><CrisisTab settlement={s} /></Dossier>);
    const said = `The Religious Authorities gain · ${STAKE_REASONS.gainsChurch}`;
    expectAbsentWithAnchor(tabRows(container), `Religious Authorities gains · ${STAKE_REASONS.gainsChurch}`, said, `${BORN_SEED} tab`);
    const plural = [...container.querySelectorAll('[data-testid="crisis-stake"]')].find((p) => (p.textContent || '').replace(/\s+/g, ' ').trim() === said);
    const door = plural?.querySelector('button');
    expect(door, 'the power\'s name is a door').toBeTruthy();
    expect(door.textContent).toBe('The Religious Authorities');
    fireEvent.click(door);
    expect(setActiveTab.mock.calls.map((c) => c[0])).toEqual(['power']);
  });
});
