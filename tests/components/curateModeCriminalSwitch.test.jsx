/** @vitest-environment jsdom */
/**
 * curateModeCriminalSwitch.test.jsx — "Hide everything criminal" on "Curate for visitors"
 * (the chair's ruling VS1, 2026-11-19).
 *
 * The switch renders above the sections with its label and its one line of what it covers; it
 * reads "Hidden from visitors" on a fresh share and "Partly shown, by you" after one criminal eye
 * is opened; a click flips the DRAFT (Done hands the list back, the switch saves nothing by
 * itself); it is disabled with its words on a town with no criminal part; and at phone width
 * its row wraps (jsdom does no layout, so the reflow is proven by the style contract, as
 * tableCompanion375 does).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mobile = { value: false };
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => mobile.value }));

import CurateMode from '../../src/components/gallery/CurateMode.jsx';
import { galleryPayloadFor } from '../../src/domain/display/galleryVeil.js';
import { CRIMINAL_SWITCH_WORDS as W } from '../../src/domain/display/criminalVeilSwitch.js';

afterEach(() => { cleanup(); mobile.value = false; });

const town = {
  name: 'Redwick', tier: 'town', population: 1800, config: {},
  institutions: [
    { id: 'inst-den', name: "Thieves' den", category: 'Criminal', desc: 'A den under the docks.' },
    { id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' },
  ],
  availableServices: { criminal: [{ name: 'Fencing', institution: "Thieves' den" }], economy: [{ name: 'Milling', institution: 'Mill' }] },
  npcs: [{ id: 'n1', name: 'Ada', role: 'Miller' }],
};
const plain = {
  name: 'Quietford', tier: 'hamlet', population: 90, config: {},
  institutions: [{ id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' }],
  npcs: [{ id: 'n1', name: 'Ada', role: 'Miller' }],
};

function mount(settlement, deltas = []) {
  const onDone = vi.fn();
  render(<CurateMode payload={galleryPayloadFor(settlement)} deltas={deltas} onDone={onDone} onCancel={() => {}} />);
  const group = screen.getByRole('group', { name: W.label });
  const button = screen.getByRole('switch', { name: W.label });
  return { onDone, group, button };
}

describe('Curate for visitors: the criminal switch', () => {
  it('renders above the sections with its label and what it covers, and reads hidden on a fresh share', () => {
    const { group, button } = mount(town);
    expect(group.textContent).toContain(W.label);
    expect(group.textContent).toContain(W.covers);
    expect(group.textContent).toContain(W.hidden);
    expect(button.getAttribute('aria-checked')).toBe('true');
    expect(button.disabled).toBe(false);
    const firstSection = document.querySelector('section');
    expect(firstSection).toBeTruthy();
    expect(group.compareDocumentPosition(/** @type {Node} */ (firstSection))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('reads partly after one criminal eye is opened, and flips the draft on a click', () => {
    const { onDone, group, button } = mount(town);
    fireEvent.click(screen.getByRole('button', { name: 'Show Criminal services' }));
    expect(group.textContent).toContain(W.partly);
    fireEvent.click(button);
    expect(group.textContent).toContain(W.hidden);
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone).toHaveBeenLastCalledWith([]);
    fireEvent.click(button);
    expect(group.textContent).toContain(W.shown);
    expect(button.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    const shown = onDone.mock.calls.at(-1)[0];
    expect(shown).toContainEqual({ address: 'block:services.criminal', hidden: false });
    expect(shown).toContainEqual({ address: 'card:institution:inst-den', hidden: false });
    expect(shown.every(d => d.hidden === false)).toBe(true);
  });

  it('keeps a hand delta on another address through both clicks', () => {
    const { onDone, button } = mount(town, [{ address: 'tab:plot_hooks', hidden: false }]);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone.mock.calls.at(-1)[0]).toEqual([{ address: 'tab:plot_hooks', hidden: false }]);
  });

  it('is disabled with its words on a town with no criminal part', () => {
    const { group, button } = mount(plain);
    expect(group.textContent).toContain(W.none);
    expect(button.disabled).toBe(true);
  });

  it('keeps its layout at phone width: the row wraps and the words may shrink', () => {
    mobile.value = true;
    const { group, button } = mount(town);
    expect(group.style.flexWrap).toBe('wrap');
    expect(group.style.minWidth).toBe('0px');
    const words = /** @type {HTMLElement} */ (group.firstElementChild);
    expect(words.style.minWidth).toBe('0px');
    expect(words.style.flex).toMatch(/^1 1/);
    expect(button.style.flexShrink).toBe('0');
    expect(parseFloat(button.style.minHeight)).toBeGreaterThanOrEqual(44);
  });
});
