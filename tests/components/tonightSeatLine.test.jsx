/** @vitest-environment jsdom */
/**
 * tests/components/tonightSeatLine.test.jsx — THE SEAT'S HOLDER IS A PRINTED LINE ON THE FRAMED SHEET, ON EVERY SURFACE
 * (FRAME-7 · F5R; the chair's ruling (a) of 2026-11-20 17:45 UTC, vetoable by the owner; brief
 * docs/chair/2026-11-20/content/frame6/F5R-SEAT-LINE.md).
 *
 * The owner's framed sheet prints its three sides; where the seat's holder (the person the calm sheet voices as "Holds the
 * seat") stands on none of them, he was printed nowhere: 32 of the calm pool's 63 framed owner sheets at the base
 * 90874e392. The composition carries him in the sheet's own field `seat` (tests/domain/tension/frameSheetRulings.test.js
 * holds the count); here, on each of the 32 born fresh, every surface that renders the sheet prints his ONE line, the same
 * words (`tonightSheet.js :: seatLineOf`), once:
 *   - the Table View and Session Mode (both mount components/TonightSheet.jsx);
 *   - the PDF chapter (pdf/sections/TonightAtTheTable.jsx, walked as an element tree);
 *   - the Foundry journal's Tonight page (foundry/journalPages.js).
 * And SESSION MODE's panel ("The people at the table's elbow", which skips every name in `sheet.people`) keeps the holder
 * visible: he is in no framed sheet's `people` (measured: the people-riding shape of F5's patch hid him from the panel on
 * 32 of 32). A sheet whose holder is a face prints no seat line (his side names him), and a calm sheet is as it was.
 *
 * The oracle for the words is written here from the calm sheet's own seat row and the sheet's own label, not read through
 * `seatLineOf`: "Holds the seat: {name}, {office}."
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {
    auth: { tier: 'premium' }, isElevated: () => false, phase: 'draft', systemState: null,
    eventLog: [], campaigns: [], savedSettlements: [],
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  return { useStore };
});

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import TableView from '../../src/components/TableView.jsx';
import SessionMode from '../../src/components/session/SessionMode.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { composeTonightSheet, seatLineOf, TONIGHT_COPY } from '../../src/domain/summary/tonightSheet.js';

afterEach(cleanup);

/** The 32 framed owner sheets of the calm pool whose holder stood on no side at the base 90874e392. */
const UNPRINTED = Object.freeze([
  'hamlet-35', 'hamlet-49', 'village-20', 'village-58', 'town-1', 'town-20', 'town-33', 'town-56', 'town-68', 'town-74',
  'town-80', 'city-8', 'city-14', 'city-22', 'city-25', 'city-27', 'city-33', 'city-35', 'city-45', 'city-52', 'city-57',
  'metropolis-8', 'metropolis-19', 'metropolis-21', 'metropolis-22', 'metropolis-48', 'metropolis-51', 'metropolis-56',
  'metropolis-57', 'metropolis-59', 'metropolis-64', 'metropolis-68',
]);
/** A framed sheet whose holder IS a face (city-30, the governor on a side), and a calm thorp with no frame. */
const FACE = 'city-30';
const CALM = 'thorp-0';

/** Every leaf string of an element tree, executing the hook-free PDF components. */
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { deepText(node.type(node.props || {}), out); return out; }
  return deepText(node.props?.children, out);
}

/** The journal page as the DM reads it (its markdown escapes undone). @param {string} md */
const unescape = (md) => md.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1');

/** How often `needle` stands in `hay`. */
const count = (hay, needle) => hay.split(needle).length - 1;

/**
 * One town on every surface: the seat lines each prints, the text it prints, and Session Mode's panel.
 * @param {string} key
 */
function surfacesOf(key) {
  const seed = `frame-calm-${key}`;
  const settlement = generateSettlementPipeline({ settType: key.split('-')[0] }, null, { seed, customContent: {} });
  const row = composeTonightSheet(settlement).people.find((p) => p.why === 'seat');
  const sheet = composeTonightSheet(settlement, { audience: 'owner' });
  const out = { seed, settlement, row, sheet, oracle: row ? `${TONIGHT_COPY.seat}: ${[row.name, row.role].filter(Boolean).join(', ')}.` : '' };
  {
    const { container } = render(<TableView settlement={settlement} audience="owner" onClose={() => {}} />);
    out.table = { seat: [...container.querySelectorAll('[data-tonight-seat]')].map((n) => n.textContent), all: container.textContent };
    cleanup();
  }
  {
    const { container } = render(<SessionMode settlement={settlement} saveId={null} onClose={() => {}} />);
    out.session = {
      seat: [...container.querySelectorAll('[data-tonight-seat]')].map((n) => n.textContent),
      all: container.textContent,
      panel: container.querySelector('#sf-session-npcs')?.textContent || '',
    };
    cleanup();
  }
  const vm = buildViewModel({ settlement });
  out.pdf = deepText(TonightAtTheTable({ settlement, narrativeMode: false, vm })).join('\n');
  out.journal = unescape(String(buildJournalPages(vm).find((p) => p.name === TONIGHT_COPY.title)?.markdown || ''));
  return out;
}

const ROWS = [];
let face;
let calm;
beforeAll(() => {
  for (const key of UNPRINTED) ROWS.push(surfacesOf(key));
  face = surfacesOf(FACE);
  calm = surfacesOf(CALM);
}, 600000);

describe('F5R: the seat line on every surface of the framed sheet', () => {
  it('the towns are what they are said to be: 32 framed with the holder on no side, one framed with him a face, one calm', () => {
    expect(ROWS.length).toBe(32);
    for (const r of ROWS) {
      expect(!!r.sheet.frame && !r.sheet.crisis, r.seed).toBe(true);
      expect(r.sheet.frame.sides.some((x) => x.name === r.row.name), r.seed).toBe(false);
    }
    expect(face.sheet.frame.sides.some((x) => x.name === face.row.name)).toBe(true);
    expect(!calm.sheet.frame && !calm.sheet.crisis && !!calm.row).toBe(true);
  });

  it('frame-calm-city-14: "Holds the seat: Saoirse O\'Meara, First Magnate." on the Table View, Session Mode, the PDF and the journal', () => {
    const r = /** @type {any} */ (ROWS.find((x) => x.seed === 'frame-calm-city-14'));
    const line = 'Holds the seat: Saoirse O\'Meara, First Magnate.';
    expect(r.oracle).toBe(line);
    expect(r.table.seat).toEqual([line]);
    expect(r.session.seat).toEqual([line]);
    expect(count(r.pdf, line)).toBe(1);
    expect(count(r.journal, line)).toBe(1);
  });

  it('over the 32: each surface prints the holder\'s one line once, the same words, read from seatLineOf', () => {
    const offenders = [];
    for (const r of ROWS) {
      const line = r.oracle;
      if (!r.sheet.seat || seatLineOf(r.sheet.seat) !== line) offenders.push(`${r.seed}: the sheet's line is not "${line}"`);
      if (r.table.seat.length !== 1 || r.table.seat[0] !== line) offenders.push(`${r.seed} / table: ${JSON.stringify(r.table.seat)}`);
      if (r.session.seat.length !== 1 || r.session.seat[0] !== line) offenders.push(`${r.seed} / session: ${JSON.stringify(r.session.seat)}`);
      if (count(r.pdf, line) !== 1) offenders.push(`${r.seed} / pdf: the line prints ${count(r.pdf, line)} times`);
      if (count(r.journal, line) !== 1) offenders.push(`${r.seed} / journal: the line prints ${count(r.journal, line)} times`);
    }
    expect(offenders, offenders.slice(0, 20).join('\n')).toEqual([]);
  });

  it('over the 32: Session Mode\'s panel keeps the holder visible (he is in no framed sheet\'s people to voice)', () => {
    const hidden = ROWS.filter((r) => !r.session.panel.includes(r.row.name) || r.sheet.people.some((p) => p.name === r.row.name)).map((r) => r.seed);
    expect(ROWS.every((r) => r.session.panel.length > 0)).toBe(true);
    expect(hidden).toEqual([]);
  });

  it('a framed sheet whose holder is a face prints no seat line; his side names him on every surface', () => {
    expect('seat' in face.sheet).toBe(false);
    expect([face.table.seat, face.session.seat]).toEqual([[], []]);
    for (const text of [face.table.all, face.session.all, face.pdf, face.journal]) {
      expect(text.includes(face.row.name)).toBe(true);
      expect(text.includes(face.oracle)).toBe(false);
    }
  });

  it('a calm sheet is as it was: no seat line, the holder among its people to voice as before', () => {
    expect('seat' in calm.sheet).toBe(false);
    expect([calm.table.seat, calm.session.seat]).toEqual([[], []]);
    expect(calm.sheet.people[0]).toMatchObject({ name: calm.row.name, why: 'seat' });
    for (const text of [calm.table.all, calm.pdf, calm.journal]) {
      expect(text.includes(calm.row.name)).toBe(true);
      expect(text.includes(`${TONIGHT_COPY.seat}:`)).toBe(false);
    }
  });
});
