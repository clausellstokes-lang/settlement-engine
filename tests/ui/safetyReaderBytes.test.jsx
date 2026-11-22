/**
 * @vitest-environment jsdom
 *
 * safetyReaderBytes.test.jsx — PAGE-1's SAFETY unit (BUILD.md §SAFETY (3), second half), re-made by PAGE-13's READER-DIFF
 * (the chair's ruling (b) of 2026-11-22, decision E11): EVERY READER, SHARED OR PUBLIC PATH IS BLIND TO THE OWNER'S LINE.
 * The owner's page gains a line beside the Safety label (`domain/display/safetyShown.js`); no other audience may gain a
 * byte from it.
 *
 * WHAT IT PROVES, AS A DIFFERENTIAL IN ONE TREE. Each town is generated ONCE and every surface is rendered from that one
 * record TWICE: with the owner's line as the module writes it (switch OFF), and with the owner's line replaced by a
 * SENTINEL (switch ON). The mock below replaces ONLY THE TEXT of the owner's line; the audience gate is the module's
 * own and is not restated here, not even its 'owner' compare: the ON switch watches the record handed to the REAL
 * `safetyShownOf` and writes the sentinel where the real function took its owner branch (the one branch that reads
 * `powerStructure`, the capture rung). So a reader path that the real gate let through to the capture read would print
 * the sentinel too. Three arms, each over every town:
 *   (a) every reader surface prints THE SAME BYTES with the sentinel ON as OFF (the strings compared, in the run);
 *   (b) no reader surface holds the sentinel, in either render;
 *   (c) THE ARM IS NOT EMPTY: each owner's surface holds the sentinel in exactly the towns with a Safety label, and
 *       that count is above zero.
 * The records are NOT veiled first: the unveiled record carries the capture rung and the tensions, so a reader path that
 * read them would show here.
 *
 * THE ELEVEN READER SURFACES (the old pin's, unchanged):
 *   overview.gallery      the Overview tab as the gallery reads it (`publicDossier` and `playerView`, PublicDossierView's default)
 *   overview.revealShare  the Overview tab as an owner's "reveal DM content" share reads it (`publicDossier` alone)
 *   overview.playerShare  the Overview tab as a player share reads it (`playerView` alone)
 *   defense.gallery       the Defense tab, the gallery's read
 *   defense.revealShare   the Defense tab, the reveal share's read
 *   defense.playerShare   the Defense tab, the player share's read
 *   pdf.vm                the print view model with no DM view (`buildViewModel({ settlement })`, what the Foundry export builds)
 *   pdf.cover             the Cover chapter's text over that view model
 *   pdf.overview          the Overview chapter's text over that view model
 *   pdf.defense           the Defense & Security chapter's text over that view model
 *   foundry               the Foundry journal's pages (name and markdown) over that view model
 * THE SIX OWNER'S SURFACES (arm (c)): overview.owner and defense.owner (`publicDossier={false} playerView={false}`),
 * pdf.vm.dm (`buildViewModel({ settlement, dmView: true })`) and its pdf.cover.dm, pdf.overview.dm, pdf.defense.dm text.
 *
 * WHY NO HASH IS STORED. The old file held sha256 hashes of whole pages, recorded once: a golden of every byte, so any
 * honest prose move anywhere on the eleven pages read as a leak (it went red at point 86 on stale pins: the cover's date
 * and point 85's arrival prose, for every audience alike). Nothing is pinned now; the two renders are their own
 * baseline, so the only difference this test can see is the one the owner's line makes.
 *
 * THE CLOCK IS PASSED IN: the Cover is called with a fixed `now` (its injectable seam, the export date being the one
 * non-reproducible byte on a cover), in both renders. No other reader surface reads the clock.
 *
 * THE TOWNS: 300, the old recipe (`hxd-<size>-0..49`, fifty of each of the six sizes), one generation per town, all
 * renders from it. The full pool is kept because the run stays inside a sane budget (277 s on the 4-core builder machine,
 * 2026-11-22, against the old file's 1,800,000 ms allowance, which is kept) and it is the population the old pin walked,
 * so the arm's coverage did not shrink when the hash left. Every one of the 300 carries a Safety label today, so arm (c)
 * counts 300 on each owner's surface.
 *
 * THE COUNT LINE ("READER DIFF: …") is logged from the walk; Vitest's agent reporter hides a passing file's logs, so read
 * it with `npx vitest run --reporter=default tests/ui/safetyReaderBytes.test.jsx`.
 */
import React from 'react';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { safetyShownOf } from '../../src/domain/display/safetyShown.js';
import { SIZES } from '../components/pageCensusWalk.shared.mjs';

/** The module-level switch, and the sentinel's text (hoisted with the mock). */
const SWITCH = vi.hoisted(() => ({ on: false, SENTINEL: '⁣SAFETY-SENTINEL⁣' }));
/** What any surface is searched for: the sentinel's word, so an escaped or re-cased print of it is still found. */
const MARK = 'SAFETY-SENTINEL';

vi.mock('../../src/domain/display/safetyShown.js', async (importOriginal) => {
  /** @type {any} */
  const real = await importOriginal();
  return {
    ...real,
    /** OFF: the real reader. ON: the real reader, its owner's line's TEXT swapped for the sentinel where it took the owner's branch. */
    safetyShownOf(record, audience) {
      if (!SWITCH.on || record == null || typeof record !== 'object') return real.safetyShownOf(record, audience);
      let ownerBranch = false;
      const watched = new Proxy(record, {
        get(target, key, receiver) {
          if (key === 'powerStructure') ownerBranch = true;
          return Reflect.get(target, key, receiver);
        },
      });
      const shown = real.safetyShownOf(watched, audience);
      return ownerBranch ? { ...shown, qualifier: SWITCH.SENTINEL } : shown;
    },
    /** OFF: the real line. ON: the sentinel. */
    safetyQualifierOf(read) {
      return SWITCH.on ? SWITCH.SENTINEL : real.safetyQualifierOf(read);
    },
  };
});

/** The Cover's export date, passed in (the clock). */
const NOW = 'January 1, 2026';
const PER_SIZE = 50;

/** The PDF's text leaves (the goldenViewModel idiom: the sections are plain hook-free functions). */
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}

/** The reader audiences of the screen, as OutputContainer passes them; and the owner's. */
const READERS = {
  gallery: { publicDossier: true, playerView: true },
  revealShare: { publicDossier: true, playerView: false },
  playerShare: { publicDossier: false, playerView: true },
};
const OWNER = { publicDossier: false, playerView: false };
const TABS = { overview: OverviewTab, defense: DefenseTab };
const READER_SURFACES = Object.freeze([
  ...Object.keys(TABS).flatMap((t) => Object.keys(READERS).map((w) => `${t}.${w}`)),
  'pdf.vm', 'pdf.cover', 'pdf.overview', 'pdf.defense', 'foundry',
]);
const OWNER_SURFACES = Object.freeze(['overview.owner', 'defense.owner', 'pdf.vm.dm', 'pdf.cover.dm', 'pdf.overview.dm', 'pdf.defense.dm']);

/** @param {any} Tab @param {any} s @param {object} props @returns {string} */
function tabHtml(Tab, s, props) {
  const { container } = render(<Tab settlement={s} narrativeNote={null} {...props} />);
  const html = container.innerHTML;
  cleanup();
  return html;
}

/** @param {any} s @param {any} vm @param {string} suffix @param {Record<string, string>} out */
function pdfText(s, vm, suffix, out) {
  out[`pdf.vm${suffix}`] = JSON.stringify(vm);
  out[`pdf.cover${suffix}`] = collectText(Cover({ settlement: s, vm, now: NOW })).join('\n');
  out[`pdf.overview${suffix}`] = collectText(Overview({ settlement: s, vm })).join('\n');
  out[`pdf.defense${suffix}`] = collectText(DefenseSecurity({ settlement: s, vm })).join('\n');
}

/** @param {any} s @returns {Record<string, string>} each reader surface's bytes */
function readerSurfaces(s) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [tab, Tab] of Object.entries(TABS)) for (const [who, props] of Object.entries(READERS)) out[`${tab}.${who}`] = tabHtml(Tab, s, props);
  const vm = buildViewModel({ settlement: s });
  pdfText(s, vm, '', out);
  out.foundry = JSON.stringify(buildJournalPages(vm, { settlement: s }).map((p) => [p.name, p.markdown]));
  return out;
}

/** @param {any} s @returns {Record<string, string>} each owner's surface's bytes */
function ownerSurfaces(s) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [tab, Tab] of Object.entries(TABS)) out[`${tab}.owner`] = tabHtml(Tab, s, OWNER);
  pdfText(s, buildViewModel({ settlement: s, dmView: true }), '.dm', out);
  return out;
}

/** Where two strings first part, with a little of each side, for the red's message. */
function firstDifference(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return `@${i}: OFF «${a.slice(Math.max(0, i - 40), i + 80)}» ON «${b.slice(Math.max(0, i - 40), i + 80)}»`;
}

const towns = /** @type {string[]} */ ([]);
const labelled = /** @type {string[]} */ ([]);
const moved = /** @type {string[]} */ ([]);
const sentinelOnReader = /** @type {string[]} */ ([]);
/** @type {Record<string, string[]>} the towns whose owner's surface holds the sentinel */
const ownerHolds = Object.fromEntries(OWNER_SURFACES.map((k) => [k, []]));
let elapsedMs = 0;

beforeAll(async () => {
  const t0 = Date.now();
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < PER_SIZE; i++) {
    const seed = `hxd-${size}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    towns.push(seed);
    if (safetyShownOf(s).label) labelled.push(seed);
    // ON first, so the sentinel render is never served from anything the OFF render left behind.
    SWITCH.on = true;
    let on, owner;
    try { on = readerSurfaces(s); owner = ownerSurfaces(s); } finally { SWITCH.on = false; }
    const off = readerSurfaces(s);
    for (const where of READER_SURFACES) {
      if (on[where] !== off[where]) moved.push(`${seed} ${where} ${firstDifference(off[where], on[where])}`);
      if (on[where].includes(MARK) || off[where].includes(MARK)) sentinelOnReader.push(`${seed} ${where}`);
    }
    for (const where of OWNER_SURFACES) if (owner[where].includes(MARK)) ownerHolds[where].push(seed);
  }
  elapsedMs = Date.now() - t0;
  const arm = OWNER_SURFACES.map((k) => `${k} ${ownerHolds[k].length}/${labelled.length}`).join(', ');
  console.log(`READER DIFF: ${towns.length} towns (${labelled.length} with a Safety label), ${READER_SURFACES.length} reader surfaces x 2 renders compared, ${moved.length} moved, ${sentinelOnReader.length} holding the sentinel; owner arm: ${arm}; ${Math.round(elapsedMs / 1000)} s`);
}, 1800000);

describe('every reader, shared and public path is blind to the owner\'s line (one tree, two renders, no stored hash)', () => {
  test('the walk covers every size, and the eleven reader surfaces and six owner\'s surfaces', () => {
    expect(towns.length).toBe(SIZES.length * PER_SIZE);
    expect(SIZES.every((size) => towns.some((seed) => seed.startsWith(`hxd-${size}-`)))).toBe(true);
    expect(READER_SURFACES.length).toBe(11);
    expect(OWNER_SURFACES.length).toBe(6);
  });
  test('(a) every reader surface prints the same bytes with the owner\'s line swapped for the sentinel', () => {
    expect(moved).toEqual([]);
  });
  test('(b) no reader surface ever holds the sentinel', () => {
    expect(sentinelOnReader).toEqual([]);
  });
  test('(c) the arm is not empty: each owner\'s surface holds the sentinel in exactly the towns with a Safety label', () => {
    expect(labelled.length).toBeGreaterThan(0);
    expect(ownerHolds).toEqual(Object.fromEntries(OWNER_SURFACES.map((k) => [k, labelled])));
  });
});
