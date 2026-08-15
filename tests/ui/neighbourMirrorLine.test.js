/**
 * @vitest-environment jsdom
 *
 * neighbourMirrorLine.test.js — FP IN-1b: the standing line ON THE RENDERED SURFACE.
 *
 * IN-1a deferred this pin deliberately, and recorded why: a rendered-surface NEGATIVE
 * passes when the surface never rendered at all. So every absence here stands on a
 * PRESENCE measured in the same breath, on the same rendered output, and the scanner that
 * proves the absence is itself shown to convict.
 *
 *   C4 — THE DARK GOLDEN, DRIVEN. The tab renders three times over one settlement and one
 *     campaign — key ABSENT, key explicitly FALSE, and key LIT over a world carrying no
 *     outbound record — and all three must equal the surface as it stood BEFORE this wave
 *     existed. That baseline was captured from the unmodified component at
 *     6ad9f8dd, against this file's own fixture, and is pinned here by exact byte length
 *     and digest. It replaces the dormancy fence's retired both-flag-states claim: the
 *     world never moved and still does not, but from IN-1b onward the claim that matters
 *     is about the SURFACE, and it is driven rather than asserted.
 *
 *   C5 — THE PHRASE SCAN, with its presence pin and its mutant control.
 *
 *   C6 (rendered half) — the public-dossier boundary, driven in both directions.
 *
 * createElement (not JSX) in a .js file: test files get no JSX transform here. The NAMED
 * export is the unmemoized component, so each render really re-runs the derivation.
 *
 * @enforced-by this file
 */
import { createHash } from 'node:crypto';

import React from 'react';
import { afterEach, describe, expect, test } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import { NEIGHBOUR_MIRROR_HEADING, MIRROR_BAND_WORDS } from '../../src/domain/display/neighbourMirror.js';
import { MIRROR_PERCEPTION_BANNED } from '../../src/domain/worldPulse/secondOrderBelief.js';
import { useStore } from '../../src/store/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const e = React.createElement;

/**
 * THE PRE-WAVE SURFACE, captured from the unmodified component before the first edit of
 * this packet, against the very fixture below. Length and digest together: a digest alone
 * cannot say how far a drift went, and a length alone cannot say a byte changed.
 */
const DARK_GOLDEN_BYTES = 2323;
const DARK_GOLDEN_SHA256 = '7887e8db43028e683f4bd2141d21198ee12dc6b48b919337c8241eeb4190e216';

const SETTLEMENT = {
  _seed: 'seed-in1b',
  id: 's',
  name: 'Ashford',
  npcs: [],
  factions: [],
  neighbourNetwork: [{
    id: 'nb_o',
    name: 'Bramwell',
    neighbourName: 'Bramwell',
    neighbourTier: 'town',
    relationshipType: 'ally',
    description: 'A steady road runs between them.',
  }],
};

const SAVED = [
  { id: 's', settlement: { id: 's', name: 'Ashford' } },
  { id: 'o', settlement: { id: 'o', name: 'Bramwell' } },
  { id: 'p', settlement: { id: 'p', name: 'Corvale' } },
];

const PLANT = { liarId: 's', subjectId: 's', audienceId: 'o', assertedBand: 3, seededTick: 10 };

/** A flag that is genuinely ABSENT, distinguishable from one left to a default. */
const UNSET = Symbol('rules absent');

/**
 * @param {{ flag?: unknown, disinfo?: unknown[] }} args
 */
function seedStore({ flag = true, disinfo = [PLANT] } = {}) {
  useStore.setState({
    campaigns: [{
      id: 'c1',
      settlementIds: ['s', 'o', 'p'],
      worldState: {
        tick: 12,
        ...(flag === UNSET ? {} : { simulationRules: { secondOrderBeliefEnabled: flag } }),
        spatialLedgers: { disinfo },
      },
    }],
    savedSettlements: SAVED,
  });
}

/** The DM viewer, which is the strongest case: it is the one that renders the most. */
function renderTab(props = {}) {
  const { container } = render(e(RelationshipsTab, {
    settlement: SETTLEMENT, saveId: 's', viewerIsPremium: true, playerView: false, publicDossier: false, ...props,
  }));
  return container;
}

const initialCampaigns = useStore.getState().campaigns;
const initialSaved = useStore.getState().savedSettlements;
afterEach(() => {
  cleanup();
  useStore.setState({ campaigns: initialCampaigns, savedSettlements: initialSaved });
});

/**
 * The scanner C5 stands on: the four single words matched on word boundaries, and the one
 * phrase matched as a lowercase substring.
 * @param {string} text @returns {string[]}
 */
function perceptionHits(text) {
  const lower = text.toLowerCase();
  const words = new Set(lower.split(/[^a-z]+/).filter(Boolean));
  return MIRROR_PERCEPTION_BANNED.filter((banned) => (banned.includes(' ')
    ? lower.includes(banned)
    : words.has(banned)));
}

describe('C4 — the dark golden, driven over the rendered surface', () => {
  test('the pre-wave baseline is pinned by two independent measures', () => {
    // A control on the pin itself: a truncated or empty digest would let every
    // comparison below pass against nothing.
    expect(DARK_GOLDEN_SHA256).toHaveLength(64);
    expect(DARK_GOLDEN_BYTES).toBeGreaterThan(500);
  });

  test('ABSENT, FALSE, and LIT-WITH-NO-RECORD all render the pre-wave surface exactly', () => {
    const states = [
      ['key absent', { flag: UNSET, disinfo: [PLANT] }],
      ['key explicitly false', { flag: false, disinfo: [PLANT] }],
      ['key lit, nothing ever shown', { flag: true, disinfo: [] }],
    ];
    const rendered = [];
    for (const [label, world] of states) {
      seedStore(world);
      const html = renderTab().innerHTML;
      cleanup();
      expect(Buffer.byteLength(html), `${label}: byte length moved`).toBe(DARK_GOLDEN_BYTES);
      expect(createHash('sha256').update(html).digest('hex'), `${label}: the surface moved`)
        .toBe(DARK_GOLDEN_SHA256);
      rendered.push([label, html]);
    }
    // …and identical to EACH OTHER as whole strings, so a failure reads as a diff rather
    // than as two digests that disagree.
    expect(rendered[1][1]).toBe(rendered[0][1]);
    expect(rendered[2][1]).toBe(rendered[0][1]);
  });

  test('the golden is a DARK claim only — the same fixture LIT does move the surface', () => {
    // Without this, a component that rendered nothing under every condition would satisfy
    // every assertion above and prove nothing at all.
    seedStore();
    const litHtml = renderTab().innerHTML;
    expect(createHash('sha256').update(litHtml).digest('hex')).not.toBe(DARK_GOLDEN_SHA256);
    expect(Buffer.byteLength(litHtml)).toBeGreaterThan(DARK_GOLDEN_BYTES);
  });
});

describe('C5 — the rendered-surface phrase scan, standing on a presence pin', () => {
  test('THE PRESENCE PIN: the lit surface really carries the heading and a band phrase', () => {
    seedStore({ disinfo: [] });
    const darkText = renderTab().textContent;
    cleanup();
    seedStore();
    const text = renderTab().textContent;
    // The floor is MEASURED against the same surface with nothing to say, not guessed:
    // the block must add real prose, and every absence in this describe stands on it.
    expect(text.length).toBeGreaterThan(darkText.length + 100);
    expect(text).toContain(NEIGHBOUR_MIRROR_HEADING);
    expect(text).toContain(MIRROR_BAND_WORDS.strong);
    expect(text).toContain('Bramwell has been shown');
  });

  test('the scanner itself CONVICTS — a mutant string carrying each banned form is flagged', () => {
    // A scanner that cannot convict is decoration, and every absence below would be too.
    expect(MIRROR_PERCEPTION_BANNED.length).toBeGreaterThan(0);
    expect(perceptionHits('the court believes we are strong')).toContain('believes');
    expect(perceptionHits('a mighty realm, in their eyes')).toContain('in their eyes');
    for (const banned of MIRROR_PERCEPTION_BANNED) {
      expect(perceptionHits(`prose that says ${banned} plainly`), banned).toContain(banned);
    }
  });

  test('the lit surface speaks the record and never a mind', () => {
    seedStore();
    const text = renderTab().textContent;
    // The presence pin above governs this subject; the scan runs over the same rendered
    // output, so an empty result here is a measurement and not a vacuum.
    expect(text).toContain(NEIGHBOUR_MIRROR_HEADING);
    expect(perceptionHits(text)).toEqual([]);
  });
});

describe('C6 (rendered half) — the DM expansion and the public-dossier boundary', () => {
  test('a DM viewer gets the deriving record; a player viewer gets the line alone', () => {
    seedStore();
    const dmText = renderTab().textContent;
    expect(dmText).toContain('DM truth');
    expect(dmText).toContain('a story we seeded in their court');
    cleanup();
    seedStore();
    const playerText = renderTab({ playerView: true }).textContent;
    // The LINE is a court's own bookkeeping and renders on both views…
    expect(playerText).toContain('Bramwell has been shown');
    // …while the expansion is the only DM-gated half. The line above is the anchor.
    expectAbsentWithAnchor(playerText, 'DM truth', NEIGHBOUR_MIRROR_HEADING, 'player view keeps the line, drops the expansion');
  });

  test('a PUBLIC dossier renders none of the block — not the line, not the heading', () => {
    seedStore();
    const publicText = renderTab({ publicDossier: true }).textContent;
    // The anchor is the sibling section on the very same render: it proves the tab is
    // alive and populated, so the heading's absence is a suppression and not an
    // empty component.
    expectAbsentWithAnchor(publicText, NEIGHBOUR_MIRROR_HEADING, 'Neighbour Network', 'public dossier suppresses the whole block');
    expectAbsentWithAnchor(publicText, 'Bramwell has been shown', 'Neighbour Network', 'public dossier carries no standing line');
  });
});
