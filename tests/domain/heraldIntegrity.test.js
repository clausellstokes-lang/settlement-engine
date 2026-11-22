/**
 * heraldIntegrity.test.js — THE MANIPULATION DISCLOSURE + THE MUTATED PLANT
 * (SP-6's disclosure laws, 2026-08-03; content RECEIPT_POOLS_CAUSAL.md §4).
 *
 * What is pinned here:
 *   THE FIVE STATES   clean · worn · planted · planted-then-worn · unknown, all
 *                     reachable on ONE fixture, each from the records the engine
 *                     already holds.
 *   BOTH HALVES       the compound state renders the ORIGINAL INTENT — the
 *                     commissioner, the purpose, and the assertion AS SEEDED —
 *                     beside the wear.
 *   SEED NOT GROWTH   the organic case NEVER names an author, INCLUDING the wear
 *                     atop a plant. This is the hardest negative in the corpus:
 *                     neither pure wear nor post-plant drift may confabulate or
 *                     inherit a culprit.
 *   NEVER GUESSED     a link the records cannot classify is UNKNOWN, and no
 *                     line ever prints an unfilled slot.
 *   FAIL CLOSED       a player audience gets NOTHING — not a redacted stub, not
 *                     a hole where a name would sit.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  DISCLOSURE_LINES,
  INTEGRITY_STATES,
  classifyLinkIntegrity,
  disclosureFor,
  disinfoByLineage,
  plantAttribution,
} from '../../src/domain/display/heraldIntegrity.js';

const LINEAGE = 'disinfo:karsh:elmspur:10';

const WORLD = {
  tick: 70,
  spatialLedgers: {
    disinfo: {
      'plant:karsh:elmspur:karsh': {
        liarId: 'karsh',
        subjectId: 'karsh',
        audienceId: 'elmspur',
        assertedBand: 4,
        trueBand: 2,
        seededTick: 10,
        lineageId: LINEAGE,
        spokespersonNpcId: 'npc-mouth',
        commission: {
          receipt: {
            hostId: 'karsh',
            patronId: 'house-vell',
            intent: 'inflate',
            marketId: 'm1',
            marketName: 'the Vell counting house',
            priceBand: 'steep',
            assertedBand: 4,
            trueBand: 2,
            commissionedAtTick: 10,
          },
        },
      },
    },
  },
};

const NAMES = { 'house-vell': 'House Vell', 'npc-mouth': 'Serin the Factor', karsh: 'Karsh' };
const nameOf = (id) => NAMES[id] || String(id);

const classify = (link) => classifyLinkIntegrity({ worldState: WORLD, link, nowTick: 70 });
const disclose = (link, seed = 'k') => disclosureFor({
  integrity: classify(link), seed, seesSecrets: true, nameOf, settlementName: 'Elmspur',
});

describe('THE FIVE STATES, all reachable on one fixture', () => {
  test('clean — a resolved receipt carrying no manipulation marker', () => {
    const out = classify({ resolved: true, accuracy01: 1 });
    expect(out.state).toBe('clean');
    expect(DISCLOSURE_LINES.clean).toContain(disclose({ resolved: true, accuracy01: 1 }).line);
  });

  test('worn — organic drift, and it is authorless', () => {
    const out = classify({ resolved: true, accuracy01: 0.6, hopCount: 3 });
    expect(out.state).toBe('worn');
    expect(out.commissionerId).toBe('');
    expect(out.mouthpieceId).toBe('');
  });

  test('planted — the commissioner and the purpose, from the record', () => {
    const out = classify({ resolved: true, accuracy01: 1, lineageIds: [LINEAGE] });
    expect(out.state).toBe('planted');
    expect(out.commissionerId).toBe('house-vell');
    expect(out.purpose).toBeTruthy();
    expect(out.seededAssertion).toBeTruthy();
  });

  test('planted, then worn — the compound state', () => {
    const out = classify({ resolved: true, accuracy01: 0.4, lineageIds: [LINEAGE] });
    expect(out.state).toBe('planted_worn');
    expect(out.commissionerId).toBe('house-vell');
  });

  test('unknown — the honest terminal, never guessed', () => {
    const out = classify({ resolved: false });
    expect(out.state).toBe('unknown');
    expect(out.commissionerId).toBe('');
    expect(DISCLOSURE_LINES.unknown).toContain(disclose({ resolved: false }).line);
  });

  test('the five states are the whole closed vocabulary', () => {
    expect(INTEGRITY_STATES).toEqual(['clean', 'worn', 'planted', 'planted_worn', 'unknown']);
    expect(Object.keys(DISCLOSURE_LINES).sort()).toEqual([...INTEGRITY_STATES].sort());
  });
});

describe('BOTH HALVES — the seeded intent survives the mutation', () => {
  test('a planted-then-worn disclosure names commissioner + purpose and still carries the seeded assertion', () => {
    const out = disclose({ resolved: true, accuracy01: 0.4, lineageIds: [LINEAGE] });
    expect(out.state).toBe('planted_worn');
    expect(out.line).toContain('House Vell');
    expect(out.seededAssertion).toBe('a picture of strength the place did not have');
  });

  test('a deflating plant seeds the other assertion', () => {
    const world = JSON.parse(JSON.stringify(WORLD));
    world.spatialLedgers.disinfo['plant:karsh:elmspur:karsh'].commission.receipt.intent = 'deflate';
    const out = classifyLinkIntegrity({ worldState: world, link: { resolved: true, lineageIds: [LINEAGE] }, nowTick: 70 });
    expect(out.seededAssertion).toBe('a whisper of weak walls');
  });

  test('an ordinary court lie charges the seat that seeded it, not a house that never paid', () => {
    const world = JSON.parse(JSON.stringify(WORLD));
    delete world.spatialLedgers.disinfo['plant:karsh:elmspur:karsh'].commission;
    const out = classifyLinkIntegrity({ worldState: world, link: { resolved: true, lineageIds: [LINEAGE] }, nowTick: 70 });
    expect(out.state).toBe('planted');
    expect(out.commissionerId).toBe('karsh');
  });
});

describe('THE SEED-NOT-GROWTH LAW — the hardest negative', () => {
  test('no WORN variant can name an author: the pool carries no author slot at all', () => {
    for (const line of DISCLOSURE_LINES.worn) {
      expect(line).not.toContain('{house}');
      expect(line).not.toContain('{npc}');
    }
  });

  test('every PLANTED-THEN-WORN variant attributes the GROWTH to no one', () => {
    const authorless = [
      'its planter never wrote',
      "nobody's design",
      'finished by accident',
      'wear has no author',
    ];
    for (const line of DISCLOSURE_LINES.planted_worn) {
      expect(authorless.some((phrase) => line.includes(phrase)), line).toBe(true);
    }
  });

  test('a worn link renders a worn line even when a plant exists elsewhere in the ledger', () => {
    // The plant is real and in the same world; this link simply does not carry its
    // lineage. Nothing may reach across and lend it a culprit.
    const out = disclose({ resolved: true, accuracy01: 0.5 });
    expect(DISCLOSURE_LINES.worn).toContain(out.line);
    expect(out.line).not.toContain('House Vell');
    expect(out.line).not.toContain('Serin');
  });
});

describe('NEVER GUESSED, NEVER A HOLE', () => {
  test('no rendered line ever leaves an unfilled slot', () => {
    const links = [
      { resolved: true, accuracy01: 1 },
      { resolved: true, accuracy01: 0.5 },
      { resolved: true, accuracy01: 1, lineageIds: [LINEAGE] },
      { resolved: true, accuracy01: 0.5, lineageIds: [LINEAGE] },
      { resolved: false },
    ];
    for (const link of links) {
      for (let i = 0; i < 40; i += 1) {
        const out = disclose(link, `seed-${i}`);
        expect(out.line, out.line).not.toMatch(/\{[a-z_]+\}/);
      }
    }
  });

  test('a plant whose record names no purpose degrades to UNKNOWN rather than printing a blank', () => {
    const world = JSON.parse(JSON.stringify(WORLD));
    world.spatialLedgers.disinfo['plant:karsh:elmspur:karsh'].commission.receipt.intent = 'sideways';
    const integrity = classifyLinkIntegrity({ worldState: world, link: { resolved: true, lineageIds: [LINEAGE] }, nowTick: 70 });
    expect(integrity.state).toBe('planted');
    expect(integrity.purpose).toBe('');
    const out = disclosureFor({ integrity, seed: 'q', seesSecrets: true, nameOf, settlementName: 'Elmspur' });
    // Every PLANTED variant spends {purpose}; with none recorded, the register
    // tells the truth about its own ignorance instead of inventing a motive.
    expect(out.state).toBe('unknown');
    expect(DISCLOSURE_LINES.unknown).toContain(out.line);
  });

  test('determinism: same seed ⇒ same line, forever', () => {
    const link = { resolved: true, accuracy01: 0.4, lineageIds: [LINEAGE] };
    for (const seed of ['a', 'b', 'evt-91']) {
      expect(disclose(link, seed)).toEqual(disclose(link, seed));
    }
    const seen = new Set();
    for (let i = 0; i < 64; i += 1) seen.add(disclose(link, `s${i}`).line);
    expect(seen.size).toBe(DISCLOSURE_LINES.planted_worn.length);
  });
});

describe('FAIL CLOSED — the disclosure is the DM\'s', () => {
  test('a player audience gets nothing at all', () => {
    const integrity = classify({ resolved: true, accuracy01: 0.4, lineageIds: [LINEAGE] });
    expect(disclosureFor({ integrity, seed: 'k', seesSecrets: false, nameOf })).toBeNull();
  });
});

describe('the ledger read is plain and total on garbage', () => {
  test('an absent ledger yields an empty index and an unknown classification', () => {
    expect(disinfoByLineage(undefined).size).toBe(0);
    expect(disinfoByLineage({ spatialLedgers: { disinfo: [] } }).size).toBe(0);
    expect(classifyLinkIntegrity({ worldState: null, link: { lineageIds: [LINEAGE] } }).state).toBe('unknown');
  });

  test('plantAttribution is total on a malformed record', () => {
    expect(plantAttribution(null)).toEqual({
      commissionerId: '', mouthpieceId: '', purpose: '', seededAssertion: '', seededTick: null,
    });
  });
});
