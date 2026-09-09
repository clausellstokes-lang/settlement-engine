/** WR-5 ruler/realm books: authority, security, character, and exact compromise. */
import { describe, expect, it } from 'vitest';

import {
  authoritySignatureFor,
  readWarSeatBooks,
} from '../../src/domain/worldPulse/warSeatBooks.js';

const RULES = Object.freeze({
  settlementPoliticsEnabled: true,
  factionCompetitionEnabled: true,
});

function ruler(id = 'ruler', overrides = {}) {
  return {
    id,
    name: id === 'ruler' ? 'Lady Arin' : id,
    importance: 'pillar',
    factionAffiliation: 'Crown',
    personality: { dominant: 'principled', flaw: 'patient', modifier: 'diplomatic' },
    facets: { alignment: 'lawful_good', goal: 'protect_followers' },
    ...overrides,
  };
}

function item({
  id = 'a',
  name = 'Aster',
  legitimacy = 75,
  crownPower = 70,
  rivalPower = 30,
  npcs = [ruler()],
  previousGovernments = [],
  crownName = 'Crown',
} = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: 'city',
      npcs,
      powerStructure: {
        governingName: crownName,
        publicLegitimacy: { score: legitimacy },
        previousGovernments,
        factions: [
          { id: 'fac.crown', faction: crownName, power: crownPower, isGoverning: true },
          { id: 'fac.rival', faction: 'Rival House', power: rivalPower },
        ],
      },
    },
  };
}

function snap(items) {
  return {
    settlements: items,
    byId: new Map(items.map((entry) => [String(entry.id), entry])),
  };
}

function ladderEntry(top = 'a:ruler', stock = 7) {
  return {
    factions: { 'fac.crown': { rungs: [top] } },
    npcs: { [top]: { stock } },
  };
}

function world({ ladder = ladderEntry(), blocs = null } = {}) {
  return {
    simulationRules: { ...RULES },
    spatialLedgers: { npcLadder: { a: ladder } },
    ...(blocs ? { politicsLedgers: { a: { blocs } } } : {}),
  };
}

describe('WR-5 war seat books', () => {
  it('falls back to realm books when no ladder-backed ruler exists, without fabricating an NPC', () => {
    const actor = item();
    const snapshot = snap([actor]);
    const read = readWarSeatBooks({
      worldState: { simulationRules: { ...RULES }, spatialLedgers: { npcLadder: {} } },
      snapshot,
      actorId: 'a',
      opponentId: 'b',
    });

    expect(read).toMatchObject({
      actorId: 'a',
      opponentId: 'b',
      interestKind: 'realm',
      settlementWeight01: 1,
      seatWeight01: 0,
      patronWeight01: 0,
      securityBand: 'unseated',
      continueBias01: 0.5,
      peaceBias01: 0.5,
      factionId: 'fac.crown',
      factionName: 'Crown',
    });
    // anchored: the actor has a real governing faction above, but the ladder is explicitly empty.
    expect('rulerId' in read).toBe(false);
    expect(read.authoritySignature).toBe(authoritySignatureFor({
      worldState: { simulationRules: { ...RULES }, spatialLedgers: { npcLadder: {} } },
      snapshot,
      actorId: 'a',
    }));
  });

  it('never lets a dead roster holder keep deciding through a stale top rung', () => {
    const actor = item({ npcs: [ruler('ruler', { status: 'dead' })] });
    const state = world();
    const read = readWarSeatBooks({
      worldState: state,
      snapshot: snap([actor]),
      actorId: 'a',
      opponentId: 'b',
    });
    expect(read).toMatchObject({
      interestKind: 'realm',
      settlementWeight01: 1,
      seatWeight01: 0,
      securityBand: 'unseated',
    });
    expect(read.rulerId).toBeUndefined();
    // KILL is not itself succession: the old id may remain in the semantic
    // signature until the ladder installs a live successor, but its character
    // no longer influences the decision in the meantime.
    expect(read.authoritySignature).toContain('a:ruler');
  });

  it('lets a secure ruler govern for the realm while an insecure ruler weights private books more heavily', () => {
    const secureItem = item({ legitimacy: 100, crownPower: 90, rivalPower: 10 });
    const secureBlocs = [{
      id: 'crown+rival_house',
      members: ['Crown', 'Rival House'],
      glue: [],
      end: 'survival',
      strain: 0,
      sinceTick: 1,
    }];
    const secure = readWarSeatBooks({
      worldState: world({ ladder: ladderEntry('a:ruler', 10), blocs: secureBlocs }),
      snapshot: snap([secureItem]),
      actorId: 'a',
      opponentId: 'b',
    });

    const insecureItem = item({ legitimacy: 0, crownPower: 10, rivalPower: 90 });
    const insecure = readWarSeatBooks({
      worldState: world({ ladder: ladderEntry('a:ruler', 0) }),
      snapshot: snap([insecureItem]),
      actorId: 'a',
      opponentId: 'b',
    });

    expect(secure.securityBand).toBe('secure');
    expect(insecure.securityBand).toBe('precarious');
    expect(secure.settlementWeight01).toBeGreaterThan(secure.seatWeight01);
    expect(insecure.seatWeight01).toBeGreaterThan(secure.seatWeight01);
    expect(insecure.settlementWeight01 + insecure.seatWeight01 + insecure.patronWeight01).toBe(1);
  });

  it('makes ruler facets and alignment directional while keeping both biases bounded and complementary', () => {
    const warmonger = ruler('ruler', {
      personality: { dominant: 'ruthless', flaw: 'vengeful', modifier: 'proud' },
      facets: { alignment: 'chaotic_evil', goal: 'punish_rivals' },
    });
    const peacemaker = ruler('ruler', {
      personality: { dominant: 'merciful', flaw: 'patient', modifier: 'diplomatic' },
      facets: { alignment: 'lawful_good', goal: 'survive_crisis' },
    });
    const state = world();
    const war = readWarSeatBooks({ worldState: state, snapshot: snap([item({ npcs: [warmonger] })]), actorId: 'a', opponentId: 'b' });
    const peace = readWarSeatBooks({ worldState: state, snapshot: snap([item({ npcs: [peacemaker] })]), actorId: 'a', opponentId: 'b' });

    // CR-ES-3 (chair 2026-08-05): the seat vocabulary is now the CONSUMER's, so the
    // bottom rung of each ladder is `lawless`/`merciful` rather than
    // `chaotic`/`benevolent`. The EDGES did not move — `lawWordFor` carries the estate
    // pair (0.67/0.33) exactly as the retired private band did, so the same rulers land
    // on the same rungs and only the words changed.
    expect(war.lawfulnessBand).toBe('lawless');
    expect(war.moralityBand).toBe('malicious');
    expect(peace.lawfulnessBand).toBe('lawful');
    expect(peace.moralityBand).toBe('merciful');
    expect(war.continueBias01).toBeGreaterThan(peace.continueBias01);
    expect(war.continueBias01 + war.peaceBias01).toBe(1);
    expect(peace.continueBias01 + peace.peaceBias01).toBe(1);
    expect(war.continueBias01).toBeGreaterThanOrEqual(0);
    expect(war.continueBias01).toBeLessThanOrEqual(1);
  });

  it('names rival-triumph risk only from an explicit competitive military/noble edge', () => {
    const actor = item({ crownPower: 45, rivalPower: 55 });
    actor.settlement.powerStructure.factions[1].category = 'military';
    actor.settlement.powerStructure.factionRelationships = [{
      pair: ['Crown', 'Rival House'], type: 'competitive', direction: 'escalating',
    }];
    const named = readWarSeatBooks({
      worldState: world(), snapshot: snap([actor]), actorId: 'a', opponentId: 'b',
    });
    expect(named.rivalTriumphBand).toBe('pressing');
    expect(named.rivalTriumph01).toBeGreaterThan(0);

    const unopposed = item({ crownPower: 45, rivalPower: 55 });
    unopposed.settlement.powerStructure.factions[1].category = 'military';
    const silent = readWarSeatBooks({
      worldState: world(), snapshot: snap([unopposed]), actorId: 'a', opponentId: 'b',
    });
    expect(silent.rivalTriumphBand).toBe('absent');
    expect(silent.rivalTriumph01).toBe(0);
  });

  it('redirects only an exactly matched ruling-seat private book to its foreign patron', () => {
    const compromised = ruler('ruler', {
      corrupt: true,
      corruptTies: { foreignPatron: 'p', conspiracy: 'foreign_sponsored' },
    });
    const otherAsset = ruler('other', {
      name: 'A Bought Clerk',
      importance: 'key',
      corrupt: true,
      corruptTies: { foreignPatron: 'x', conspiracy: 'foreign_sponsored' },
    });
    const patronRuler = ruler('patron_ruler', {
      name: 'The Red Regent',
      personality: { dominant: 'ruthless', flaw: 'vengeful', modifier: 'proud' },
      facets: { alignment: 'chaotic_evil', goal: 'punish_rivals' },
      factionAffiliation: 'Patron Crown',
    });
    const patron = item({ id: 'p', name: 'Patron Court', npcs: [patronRuler], crownName: 'Patron Crown' });
    const outsider = item({ id: 'x', name: 'Other Court', npcs: [], crownName: 'Other Crown' });
    const state = world();
    state.spatialLedgers.npcLadder.p = ladderEntry('p:patron_ruler', 8);
    const read = readWarSeatBooks({
      worldState: state,
      snapshot: snap([item({ npcs: [compromised, otherAsset] }), patron, outsider]),
      actorId: 'a',
      opponentId: 'b',
    });

    expect(read).toMatchObject({
      interestKind: 'patron',
      rulerId: 'a:ruler',
      patronId: 'p',
      patronName: 'Patron Court',
      patronRulerId: 'p:patron_ruler',
      patronLawfulnessBand: 'lawless',
      patronMoralityBand: 'malicious',
      seatWeight01: 0,
    });
    expect(read.patronWeight01).toBeGreaterThan(0);
    expect(read.continueBias01).toBeGreaterThan(0.5);
    expect(read.settlementWeight01 + read.seatWeight01 + read.patronWeight01).toBe(1);

    const nonSeatOnly = readWarSeatBooks({
      worldState: world(),
      snapshot: snap([item({ npcs: [ruler(), otherAsset] }), outsider]),
      actorId: 'a',
      opponentId: 'b',
    });
    expect(nonSeatOnly.interestKind).toBe('seat');
    expect(nonSeatOnly.patronWeight01).toBe(0);
    // anchored: A Bought Clerk remains a live foreign asset, but Lady Arin is the exact top rung.
    expect('patronId' in nonSeatOnly).toBe(false);
  });

  it('keeps pure renames out of the authority signature but changes it for succession or transfer', () => {
    const baseItem = item();
    const baseSnapshot = snap([baseItem]);
    const baseWorld = world();
    const base = authoritySignatureFor({ worldState: baseWorld, snapshot: baseSnapshot, actorId: 'a' });

    const renamed = item({ crownName: 'The Golden Crown' });
    const renameSignature = authoritySignatureFor({ worldState: baseWorld, snapshot: snap([renamed]), actorId: 'a' });
    expect(renameSignature).toBe(base);

    // Generated factions may be name-keyed. The persisted ladder retains the old
    // key during a cosmetic rename, while the roster affiliation has moved.
    const nameKeyedBase = item();
    delete nameKeyedBase.settlement.powerStructure.factions[0].id;
    delete nameKeyedBase.settlement.powerStructure.factions[1].id;
    const nameKeyedRenamed = item({
      crownName: 'The Golden Crown',
      npcs: [ruler('ruler', { factionAffiliation: 'The Golden Crown' })],
    });
    delete nameKeyedRenamed.settlement.powerStructure.factions[0].id;
    delete nameKeyedRenamed.settlement.powerStructure.factions[1].id;
    const nameKeyedBefore = authoritySignatureFor({ worldState: baseWorld, snapshot: snap([nameKeyedBase]), actorId: 'a' });
    const nameKeyedAfter = authoritySignatureFor({ worldState: baseWorld, snapshot: snap([nameKeyedRenamed]), actorId: 'a' });
    expect(nameKeyedAfter).toBe(nameKeyedBefore);

    const successor = authoritySignatureFor({
      worldState: world({ ladder: ladderEntry('a:heir', 7) }),
      snapshot: snap([item({ npcs: [ruler('heir')] })]),
      actorId: 'a',
    });
    expect(successor).not.toBe(base); // anchored: the authoritative top rung changed from a:ruler to a:heir.

    const transferred = authoritySignatureFor({
      worldState: baseWorld,
      snapshot: snap([item({ previousGovernments: [{ label: 'Old Name', cause: 'coup', tick: 9 }] })]),
      actorId: 'a',
    });
    expect(transferred).not.toBe(base); // anchored: a label-free coup/tick transfer epoch was added.
  });
});
