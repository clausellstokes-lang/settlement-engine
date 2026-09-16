/**
 * publicSafeVeil.test.js — THE VEIL AT THE PUBLIC PROJECTION SEAM
 * (DESIGN_PROFILE_IMAGE.md §9, the VEIL mode and its STORAGE LAW).
 *
 * The owner's ruling, in their words: "those are originally private... people may
 * forget". A DM writes a settlement's secrets and plot hooks in their own world,
 * for themselves. If they later opt into revealing DM content on a share, a
 * flagged word in that private writing must NOT block the share, must NOT earn
 * them any penalty, and must NOT be edited in their world. It is simply veiled on
 * the way out.
 *
 * Those three requirements are exactly the three pins below, and the third —
 * "the author's stored note is untouched after a full share round-trip" — is the
 * one that would be easy to get wrong and impossible to notice: a projection that
 * masked in place would corrupt a DM's private campaign silently, and they would
 * only find out by reading their own notes months later.
 */
import { describe, expect, test } from 'vitest';

import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { VEIL_MARK, checkCivility } from '../../../src/lib/civility.js';

/** A settlement whose PRIVATE-ORIGIN DM writing carries a flagged word. */
const settlementWithFlaggedPrivateText = () => ({
  name: 'Ashfen',
  population: 400,
  thesis: 'A quiet fen town.',
  npcs: [{
    id: 'npc.borin',
    name: 'Borin',
    role: 'Reeve',
    personality: 'Gruff',
    goal: 'To ruin that shit of a magistrate',
    secret: 'He is a nazi sympathiser in the old war',
    plotHooks: ['The reeve wants the magistrate, that shit, gone'],
  }],
  history: { founding: 'Settled by fen-cutters.' },
});

describe('VEIL mode — private-origin text riding an opted-in share', () => {
  test('the shared artifact carries NO flagged term', () => {
    const shared = toPublicSafe(settlementWithFlaggedPrivateText(), { full: true });
    const npc = shared.npcs[0];

    expect(npc.goal).toBe(`To ruin that ${VEIL_MARK} of a magistrate`);
    expect(npc.secret).toBe(`He is a ${VEIL_MARK} sympathiser in the old war`);
    expect(npc.plotHooks[0]).toBe(`The reeve wants the magistrate, that ${VEIL_MARK}, gone`);

    // The whole serialized artifact, checked as one string — no flagged term
    // survives anywhere in it, including in a field this test forgot to name.
    expect(checkCivility(JSON.stringify(shared)).blocked).toBe(false);
  });

  test('the share is NEVER blocked — the DM keeps their content, minus the marks', () => {
    const shared = toPublicSafe(settlementWithFlaggedPrivateText(), { full: true });
    // Nothing was dropped, refused, or emptied: the reveal still reveals.
    expect(shared.npcs).toHaveLength(1);
    expect(shared.npcs[0].name).toBe('Borin');
    expect(shared.npcs[0].secret).toContain('sympathiser in the old war');
    expect(shared.npcs[0].goal).toContain('of a magistrate');
  });

  test('⚠️ THE STORAGE LAW — the author\'s own settlement is byte-identical afterwards', () => {
    const authors = settlementWithFlaggedPrivateText();
    const before = JSON.stringify(authors);

    // A full round trip: project it public in both modes, as a share and an
    // unshare and a re-share would.
    toPublicSafe(authors, { full: true });
    toPublicSafe(authors, { full: false });
    toPublicSafe(authors, { full: true });

    expect(JSON.stringify(authors)).toBe(before);
    // Their world is theirs, including its language.
    expect(authors.npcs[0].secret).toBe('He is a nazi sympathiser in the old war');
  });

  test('the DEFAULT (non-reveal) projection is veiled too', () => {
    // Default mode strips DM blocks, but user-authored strings still ride it.
    // A veil is harmless on clean text and total on flagged text, so applying it
    // to both modes means no projection is the one somebody forgot.
    const shared = toPublicSafe({
      name: 'Shitholm',
      population: 20,
      thesis: 'A hamlet whose name a player will read aloud.',
    }, { full: false });
    expect(checkCivility(JSON.stringify(shared)).blocked).toBe(false);
  });
});

describe('the veil does not disturb a clean projection', () => {
  const clean = {
    name: 'Greenhollow',
    population: 900,
    thesis: 'A prosperous vale.',
    npcs: [{ id: 'npc.mira', name: 'Mira', role: 'Cartographer', personality: 'Wry' }],
    history: { founding: 'Chartered in the Amber year.' },
  };

  test('every public field survives unchanged', () => {
    const shared = toPublicSafe(clean, { full: false });
    expect(shared.name).toBe('Greenhollow');
    expect(shared.thesis).toBe('A prosperous vale.');
    expect(shared.npcs[0].name).toBe('Mira');
    expect(shared.npcs[0].personality).toBe('Wry');
    expect(shared.history.founding).toBe('Chartered in the Amber year.');
  });

  test('a name that merely CONTAINS a flagged substring is left alone', () => {
    // The Scunthorpe defense reaching all the way through the projection: a
    // settlement or NPC named this way is ordinary fantasy naming, and veiling it
    // would be the product mangling a DM's world for no reason.
    const shared = toPublicSafe({
      name: 'Scunthorpe Reach',
      npcs: [{ id: 'n1', name: 'Cockburn', role: 'Assassin', personality: 'Classical' }],
    }, { full: true });
    expect(shared.name).toBe('Scunthorpe Reach');
    expect(shared.npcs[0].name).toBe('Cockburn');
    expect(shared.npcs[0].role).toBe('Assassin');
  });
});
