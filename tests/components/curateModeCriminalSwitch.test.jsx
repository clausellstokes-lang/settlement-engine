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
 *
 * VR34 (the seventh chair, 2026-11-20, from the security reader's V10-2; vetoable by the owner): A SWITCH SETS ONLY
 * WHAT A HAND CAN SEE AND UNDO ON THAT RECORD. Every address "Show all" and "Hide all" hand back is an eye the screen
 * draws for that record; a criminal house's People eye is drawn by identity (the people car's `institution` record and
 * master's string alike), so a hand can open and shut what the switch opens and shuts.
 *
 * THE NOTICE (CURATE-NOTICE, the seventh chair's ruling 38 (c); the words are the chair's to approve): R3's power rule
 * keeps a criminal power's row off every non-owner read wherever a house is hidden whole. Where the switch reads shown or
 * partly while a criminal house is hidden in the draft, the switch's group says so in one sentence (W.housesHidden); it
 * sets nothing. Not with every criminal house shown, not with the switch reading hidden, not on a town with no criminal
 * part. The house condition is the applier's own: a house the model shows hidden whole is one applyVeil removes.
 * THE CHAIR'S RULING ON THE NOTICE: two sentences, word for word; and only where the town HAS a criminal power (category
 * 'criminal' in powerStructure.factions or master's top-level factions, read from the screen's own copy).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const mobile = { value: false };
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => mobile.value }));

import CurateMode from '../../src/components/gallery/CurateMode.jsx';
import { applyVeil, curateModelFor, galleryPayloadFor, resolveVeil } from '../../src/domain/display/galleryVeil.js';
import { CRIMINAL_SWITCH_WORDS as W, criminalHouseHiddenWhileShown } from '../../src/domain/display/criminalVeilSwitch.js';

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

/** Every address the screen draws an eye or a row for (curateModelFor's model, as the component draws it). */
const drawnAddresses = (settlement, shareDm = false) => new Set(curateModelFor(galleryPayloadFor(settlement, { shareDm }), []).sections
  .flatMap(sec => [...sec.groupings, ...sec.switches, ...sec.cards.flatMap(c => [...(c.whole ? [c.whole] : []), ...c.eyes])]).map(e => e.address));

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

  it("VR34: Show all hands back only eyes the screen draws; a house's People eye is drawn by identity and the hand can shut it", () => {
    // Ada is the den's fence in the people car's shape; the share reveals DM content, so the visitor's copy carries her house.
    const fence = { ...town, npcs: [{ id: 'n1', name: 'Ada', role: 'Fence', institution: { kind: 'house', key: "Thieves' den", title: 'the fence', veiled: true } }] };
    const onDone = vi.fn();
    render(<CurateMode payload={galleryPayloadFor(fence, { shareDm: true })} deltas={[]} onDone={onDone} onCancel={() => {}} />);
    const button = screen.getByRole('switch', { name: W.label });
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    const shown = onDone.mock.calls.at(-1)[0];
    const drawn = drawnAddresses(fence, true);
    expect(shown.filter(d => !drawn.has(d.address)), 'Show all wrote an eye the screen does not draw').toEqual([]);
    expect(shown).toContainEqual({ address: 'field:institution:inst-den:people', hidden: false });
    // the hand finds that eye in the den's box and shuts it again
    for (const b of screen.getAllByRole('button', { name: /^Open the \d+ boxes$/ })) fireEvent.click(b);
    fireEvent.click(screen.getByRole('button', { name: 'Hide People' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone.mock.calls.at(-1)[0]).not.toContainEqual({ address: 'field:institution:inst-den:people', hidden: false });
  });

  it('VR34: where nobody is the house\'s person, no People eye is drawn and Show all writes none', () => {
    const { onDone, button } = mount(town);
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    const shown = onDone.mock.calls.at(-1)[0];
    const drawn = drawnAddresses(town);
    expect(drawn.has('field:institution:inst-den:people')).toBe(false);
    expect(shown.filter(d => !drawn.has(d.address)), 'Show all wrote an eye the screen does not draw').toEqual([]);
  });

  describe('the notice: a criminal house hidden while the switch reads shown or partly', () => {
    // two criminal houses, so one can stay hidden while the other is shown; the town HAS a criminal power (the notice's third
    // condition, the chair's ruling), beside a governing council
    const council = { faction: 'Town council', category: 'government', isGoverning: true, power: 70 };
    const twoDens = {
      ...town,
      institutions: [...town.institutions, { id: 'inst-yard', name: "Smugglers' yard", category: 'Criminal', desc: 'Boats by night.' }],
      powerStructure: { factions: [{ faction: "Thieves' Guild", category: 'criminal', power: 30 }, council] },
    };
    // the same town with NO criminal power: the council alone
    const noPower = { ...twoDens, powerStructure: { factions: [{ ...council, power: 100 }] } };
    const has = (group) => typeof W.housesHidden === 'string' && W.housesHidden.length > 0 && group.textContent.includes(W.housesHidden);

    it('shows with the switch reading partly while a criminal house stays hidden (the owner opened the rest)', () => {
      const { group, button } = mount(twoDens);
      fireEvent.click(button); // Show all
      expect(group.textContent).toContain(W.shown);
      expect(has(group)).toBe(false);
      for (const b of screen.getAllByRole('button', { name: /^Open the \d+ boxes$/ })) fireEvent.click(b);
      fireEvent.click(screen.getByRole('button', { name: "Hide Smugglers' yard" }));
      expect(group.textContent).toContain(W.partly);
      expect(has(group), 'the notice is missing').toBe(true);
    });

    it('shows on a fresh share once one criminal eye is opened (partly, both houses hidden by default)', () => {
      const { group } = mount(twoDens);
      expect(has(group)).toBe(false); // (ii) the switch reads hidden
      fireEvent.click(screen.getByRole('button', { name: 'Show Criminal services' }));
      expect(group.textContent).toContain(W.partly);
      expect(has(group), 'the notice is missing').toBe(true);
    });

    it('its words are the chair\'s, two sentences, word for word', () => {
      expect(W.housesHidden).toBe("While a criminal house is hidden, the town's criminal powers stay off the shared page too, so they cannot give the house away. Show the house to show them, or leave it hidden and they stay off.");
    });

    it('does not show where the town has NO criminal power, though a criminal house is hidden and the switch reads partly', () => {
      const { group, button } = mount(noPower);
      fireEvent.click(screen.getByRole('button', { name: 'Show Criminal services' }));
      expect(group.textContent).toContain(W.partly);
      expect(has(group), 'the notice shows on a town with no criminal power').toBe(false);
      fireEvent.click(button); // Hide all
      fireEvent.click(button); // Show all
      for (const b of screen.getAllByRole('button', { name: /^Open the \d+ boxes$/ })) fireEvent.click(b);
      fireEvent.click(screen.getByRole('button', { name: "Hide Smugglers' yard" }));
      expect(group.textContent).toContain(W.partly);
      expect(has(group), 'the notice shows on a town with no criminal power').toBe(false);
    });

    it('does not show (i) with every criminal house shown, though the switch reads partly', () => {
      const { group } = mount({ ...town, powerStructure: twoDens.powerStructure });
      for (const b of screen.getAllByRole('button', { name: /^Open the \d+ boxes$/ })) fireEvent.click(b);
      fireEvent.click(screen.getByRole('button', { name: "Show Thieves' den" }));
      expect(group.textContent).toContain(W.partly);
      expect(has(group)).toBe(false);
    });

    it('does not show (i) with the switch reading shown and every house shown', () => {
      const { group, button } = mount(twoDens);
      fireEvent.click(button);
      expect(group.textContent).toContain(W.shown);
      expect(has(group)).toBe(false);
    });

    it('does not show (ii) with the switch reading hidden', () => {
      const { group, button } = mount(twoDens);
      expect(group.textContent).toContain(W.hidden);
      expect(has(group)).toBe(false);
      fireEvent.click(button);
      fireEvent.click(button); // Show all, then Hide all
      expect(group.textContent).toContain(W.hidden);
      expect(has(group)).toBe(false);
    });

    it('does not show (iii) on a town with no criminal parts', () => {
      const { group } = mount(plain);
      expect(group.textContent).toContain(W.none);
      expect(has(group)).toBe(false);
    });

    it("the predicate: true only for shown or partly with a house the applier removes whole and a criminal power; its house reading is applyVeil's", () => {
      const payload = galleryPayloadFor(twoDens);
      const yardHidden = [{ address: 'card:institution:inst-den', hidden: false }];
      const model = curateModelFor(payload, yardHidden);
      const drops = applyVeil(payload, resolveVeil(model.defaults, yardHidden)).institutions.length < payload.institutions.length;
      expect(drops).toBe(true);
      expect(criminalHouseHiddenWhileShown('partly', model, payload)).toBe(true);
      expect(criminalHouseHiddenWhileShown('shown', model, payload)).toBe(true);
      expect(criminalHouseHiddenWhileShown('hidden', model, payload)).toBe(false);
      expect(criminalHouseHiddenWhileShown('none', model, payload)).toBe(false);
      // the third condition: a criminal power in the screen's own copy, in either list, by category (any case)
      const bare = galleryPayloadFor(noPower);
      expect(criminalHouseHiddenWhileShown('partly', curateModelFor(bare, yardHidden), bare)).toBe(false);
      expect(criminalHouseHiddenWhileShown('partly', model, null)).toBe(false);
      expect(criminalHouseHiddenWhileShown('partly', model, { factions: [{ name: 'Rival gangs', category: 'Criminal' }] })).toBe(true);
      expect(criminalHouseHiddenWhileShown('partly', model, { powerStructure: { factions: [{ faction: 'Merchants', category: 'economic' }] }, factions: [{ name: 'Guard', category: 'military' }] })).toBe(false);
      const open = [...yardHidden, { address: 'card:institution:inst-yard', hidden: false }];
      const openModel = curateModelFor(payload, open);
      expect(applyVeil(payload, resolveVeil(openModel.defaults, open)).institutions.length).toBe(payload.institutions.length);
      expect(criminalHouseHiddenWhileShown('partly', openModel, payload)).toBe(false);
      expect(criminalHouseHiddenWhileShown('shown', openModel, payload)).toBe(false);
      expect(criminalHouseHiddenWhileShown('partly', null, payload)).toBe(false);
    });
  });
});
