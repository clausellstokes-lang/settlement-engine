/**
 * rumorHeraldLink.test.js — THE RUMOR MILL LINKS UPWARD (SP-6's SCOPE + SURFACE
 * CONTRACT and PAIRING LAW amendments, 2026-08-03).
 *
 * What is pinned here:
 *   THE LINK          a rumor whose event reached the Herald carries a link to
 *                     that headline, by the recorded id join.
 *   TRUTHFULLY UNLINKED a rumor whose event stayed below the pacing floor
 *                     carries NO link, and no key at all — never a dead one.
 *   THE AUDIENCE GATE a covert headline is not in the index, so no rumor can
 *                     reach it. Fail closed by default.
 *   THE PLAYER ARM    a player projection carries no join key, so it produces no
 *                     links, and `joinable: false` says WHY rather than looking
 *                     like "nothing matched".
 *   NO MUTATION       the input rows are untouched.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  heraldEntriesByEventRef,
  heraldLinkForRumor,
  linkRumorsToHerald,
  rumorEventRef,
} from '../../src/domain/display/rumorHeraldLink.js';

const heraldEntry = (over = {}) => ({
  id: 'evt-war',
  section: 'war',
  headline: 'Karsh declares war on Elmspur',
  severity: 0.9,
  tick: 60,
  provenance: 'canon',
  record: {},
  ...over,
});

const ENTRIES = [
  heraldEntry(),
  heraldEntry({ id: 'evt-covert', section: 'faith', headline: 'A covert rite was kept', provenance: 'covert' }),
  heraldEntry({ id: 'evt-minted', headline: 'The salt road closed', section: 'trade', record: { sourceEventId: 'src-salt' } }),
];

/** A DM projection carries the `truth` block; a player projection does not. */
const dmRumor = (eventRef, over = {}) => ({
  id: `r-${eventRef}`,
  headline: 'Travellers speak of war in the east',
  truth: { eventRef },
  ...over,
});
const playerRumor = (id) => ({ id, headline: 'Travellers speak of war in the east' });

describe('THE LINK', () => {
  test('a rumor whose event reached the Herald links to that headline', () => {
    const index = heraldEntriesByEventRef(ENTRIES);
    const link = heraldLinkForRumor({ rumor: dmRumor('evt-war'), index });
    expect(link).toEqual({ headlineId: 'evt-war', headline: 'Karsh declares war on Elmspur', section: 'war', tick: 60 });
  });

  test('the join also resolves through the source event a headline was minted from', () => {
    const index = heraldEntriesByEventRef(ENTRIES);
    expect(heraldLinkForRumor({ rumor: dmRumor('src-salt'), index }).headlineId).toBe('evt-minted');
  });

  test('the index is first-wins and codepoint-stable', () => {
    const twins = [heraldEntry({ id: 'b', record: { sourceEventId: 'shared' } }), heraldEntry({ id: 'a', record: { sourceEventId: 'shared' } })];
    expect(heraldEntriesByEventRef(twins).get('shared').id).toBe('a');
    expect(heraldEntriesByEventRef([...twins].reverse()).get('shared').id).toBe('a');
  });
});

describe('TRUTHFULLY UNLINKED — never dead-linked', () => {
  test('an event that stayed below the pacing floor yields no link', () => {
    const index = heraldEntriesByEventRef(ENTRIES);
    expect(heraldLinkForRumor({ rumor: dmRumor('evt-never-printed'), index })).toBeNull();
  });

  test('an unlinked rumor gains NO key, so a renderer cannot paint a dead affordance', () => {
    const out = linkRumorsToHerald({ rumors: [dmRumor('evt-never-printed')], entries: ENTRIES });
    expect('heraldLink' in out.rumors[0]).toBe(false);
    expect(out.linked).toBe(0);
    expect(out.unlinked).toBe(1);
    // It WAS joinable — the rumor carried a key and the paper simply never
    // carried the event. That is a different answer from the player arm below.
    expect(out.joinable).toBe(true);
  });
});

describe('THE AUDIENCE GATE — a link is a view, never a leak', () => {
  test('a covert headline is unreachable by default', () => {
    expect(heraldEntriesByEventRef(ENTRIES).has('evt-covert')).toBe(false);
    const out = linkRumorsToHerald({ rumors: [dmRumor('evt-covert')], entries: ENTRIES });
    expect(out.linked).toBe(0);
    expect('heraldLink' in out.rumors[0]).toBe(false);
  });

  test('a proven DM session reaches it', () => {
    const out = linkRumorsToHerald({ rumors: [dmRumor('evt-covert')], entries: ENTRIES, includeCovert: true });
    expect(out.linked).toBe(1);
    expect(out.rumors[0].heraldLink.headlineId).toBe('evt-covert');
  });
});

describe('THE PLAYER ARM — the instrument is the DM\'s', () => {
  test('a player projection carries no join key at all', () => {
    expect(rumorEventRef(playerRumor('r1'))).toBe('');
  });

  test('a player list comes back with joinable:false, not a bare empty answer', () => {
    const out = linkRumorsToHerald({ rumors: [playerRumor('r1'), playerRumor('r2')], entries: ENTRIES });
    expect(out.joinable).toBe(false);
    expect(out.linked).toBe(0);
    for (const rumor of out.rumors) expect('heraldLink' in rumor).toBe(false);
  });

  test('the two linkless cases are distinguishable — which is the whole point of the flag', () => {
    const player = linkRumorsToHerald({ rumors: [playerRumor('r1')], entries: ENTRIES });
    const belowFloor = linkRumorsToHerald({ rumors: [dmRumor('evt-never-printed')], entries: ENTRIES });
    expect(player.linked).toBe(belowFloor.linked);
    expect(player.joinable).not.toBe(belowFloor.joinable);
  });
});

describe('NO MUTATION', () => {
  test('input rows are untouched and results are fresh objects', () => {
    const rumor = dmRumor('evt-war');
    const out = linkRumorsToHerald({ rumors: [rumor], entries: ENTRIES });
    expect('heraldLink' in rumor).toBe(false);
    expect(out.rumors[0]).not.toBe(rumor);
    expect(out.rumors[0].heraldLink.headlineId).toBe('evt-war');
  });

  test('total on garbage', () => {
    expect(linkRumorsToHerald({})).toEqual({ rumors: [], joinable: false, linked: 0, unlinked: 0 });
    expect(heraldLinkForRumor({ rumor: null, index: null })).toBeNull();
    expect(rumorEventRef(null)).toBe('');
  });
});
