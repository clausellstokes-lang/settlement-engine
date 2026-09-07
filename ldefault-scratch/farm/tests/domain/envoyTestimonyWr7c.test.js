/**
 * envoyTestimonyWr7c.test.js — WR-7c's credibility ladder and the ruler's choice.
 *
 * Amendment K4: two agreeing envoys are corroborated, a lone account is
 * reported, every envoy is a source with their own credibility — AND THE RULER
 * CHOOSES WHOM TO BELIEVE, which is character, receipted as a political act.
 *
 * The load-bearing pin in this file is the last one: every returned digest is
 * byte-equal to exactly one input account's digest. That is what makes K4's
 * "no merged estimate anywhere" structural rather than a promise.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  TESTIMONY_LADDER,
  normalizeEnvoyAccount,
  normalizeTestimonySeat,
  readEnvoyTestimony,
  selectBelievedAccount,
  testimonyRungOf,
} from '../../src/domain/worldPulse/envoyTestimony.js';
import { RELIABILITY_LADDER } from '../../src/domain/worldPulse/brokerageStamps.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function account(id, patch = {}) {
  return {
    id,
    errandId: `errand.${id}`,
    npcId: `npc.${id}`,
    partyId: 'reed',
    counterpartId: 'iron',
    episodeKey: 'war.iron.reed.4',
    pictureId: `picture.${id}`,
    sheetDigest: 'sheet.alpha',
    firsthand: true,
    credibilityBand: 'ordinary',
    returnedTick: 20,
    ...patch,
  };
}

function seat(patch = {}) {
  return {
    settlementId: 'reed',
    rulerPresent: true,
    lawfulnessBand: 'balanced',
    moralityBand: 'balanced',
    securityBand: 'holding',
    desiredOutcome: 'peace',
    ...patch,
  };
}

const digestsIn = (read) => read.accounts.map((row) => String(row.sheetDigest));

describe('WR-7c — the account DTO', () => {
  it('accepts only an exact, closed, whole account record', () => {
    expect(normalizeEnvoyAccount(account('a'))).toMatchObject({ id: 'a', firsthand: true });
    // Every field is load-bearing, so every omission and every stray field is a
    // rejection rather than a silently-defaulted account.
    expect(normalizeEnvoyAccount({ ...account('a'), extra: 1 })).toBeNull();
    const withoutDigest = account('a');
    delete withoutDigest.sheetDigest;
    expect(normalizeEnvoyAccount(withoutDigest)).toBeNull();
    expect(normalizeEnvoyAccount(account('a', { firsthand: 'yes' }))).toBeNull();
    expect(normalizeEnvoyAccount(account('a', { credibilityBand: 'sterling' }))).toBeNull();
    expect(normalizeEnvoyAccount(account('a', { returnedTick: -1 }))).toBeNull();
    expect(normalizeEnvoyAccount(account('a', { counterpartId: 'reed' }))).toBeNull();
  });

  it('rejects a seat whose character bands are not the closed vocabulary', () => {
    expect(normalizeTestimonySeat(seat())).toMatchObject({ settlementId: 'reed' });
    expect(normalizeTestimonySeat(seat({ securityBand: 'nervous' }))).toBeNull();
    expect(normalizeTestimonySeat(seat({ desiredOutcome: 'glory' }))).toBeNull();
    expect(normalizeTestimonySeat(seat({ rulerPresent: 'yes' }))).toBeNull();
  });
});

describe('WR-7c — the credibility ladder', () => {
  it('uses the estate\'s existing reliability vocabulary, not a second spelling of it', () => {
    // The module deliberately does NOT import brokerageStamps (the K3 pin keeps
    // the negotiation set's reach closed). This test imports both and asserts
    // they agree, so the two spellings cannot drift apart in silence.
    expect(TESTIMONY_LADDER).toEqual(RELIABILITY_LADDER);
    expect(testimonyRungOf('confirmed')).toBe(0);
    expect(testimonyRungOf('not_a_rung')).toBe(TESTIMONY_LADDER.length - 1);
  });

  it('grades a lone firsthand account reported and two agreeing accounts corroborated', () => {
    const lone = readEnvoyTestimony({ accounts: [account('a')] });
    expect(lone.reason).toBe('graded');
    expect(lone.accounts.map((row) => row.rung)).toEqual(['reported']);
    expect(lone.split).toBe(false);
    expect(lone.corroboratedDigest).toBeNull();

    const pair = readEnvoyTestimony({ accounts: [account('a'), account('b')] });
    expect(pair.accounts.map((row) => row.rung)).toEqual(['corroborated', 'corroborated']);
    expect(pair.corroboratedDigest).toBe('sheet.alpha');
    expect(pair.accounts[0].agreeingWith).toEqual(['b']);
  });

  it('reserves the top rung for an uncontradicted, wholly trusted corroboration', () => {
    const trusted = [
      account('a', { credibilityBand: 'trusted' }),
      account('b', { credibilityBand: 'trusted' }),
    ];
    expect(readEnvoyTestimony({ accounts: trusted }).accounts.map((row) => row.rung))
      .toEqual(['confirmed', 'confirmed']);
    // ONE contradicting voice is enough to pull the whole thing down a rung:
    // corroboration is a claim about the world, and the world is disputed.
    const contradicted = readEnvoyTestimony({
      accounts: [...trusted, account('c', { sheetDigest: 'sheet.beta' })],
    });
    expect(contradicted.split).toBe(true);
    expect(contradicted.accounts.map((row) => `${row.id}:${row.rung}`))
      .toEqual(['a:corroborated', 'b:corroborated', 'c:reported']);
  });

  it('grades a second-hand telling as talk, and demotes a discredited source without ever promoting one', () => {
    const read = readEnvoyTestimony({
      accounts: [
        account('a', { firsthand: false }),
        account('b', { credibilityBand: 'discredited' }),
        account('c', { credibilityBand: 'discredited' }),
      ],
    });
    // b and c agree and are both firsthand, so the group is corroborated — and
    // both are demoted one rung for being discredited. A liar's corroboration
    // cannot lift the pair above an honest lone witness.
    expect(read.accounts.map((row) => `${row.id}:${row.rung}`))
      .toEqual(['a:tavern_talk', 'b:reported', 'c:reported']);
  });

  it('refuses malformed or overlapping testimony instead of grading it', () => {
    expect(readEnvoyTestimony({ accounts: [] }).reason).toBe('no_accounts');
    expect(readEnvoyTestimony({ accounts: [account('a'), { id: 'b' }] }).reason).toBe('invalid_account');
    expect(readEnvoyTestimony({
      accounts: [account('a'), account('b', { episodeKey: 'war.other.1' })],
    }).reason).toBe('episode_mismatch');
    expect(readEnvoyTestimony({ accounts: [account('a'), account('a')] }).reason)
      .toBe('duplicate_account');
    // Two envoys sharing one picture is the merged estimate wearing a disguise:
    // it would let one observation vote twice.
    expect(readEnvoyTestimony({
      accounts: [account('a'), account('b', { pictureId: 'picture.a' })],
    }).reason).toBe('shared_picture');
  });
});

describe('WR-7c — the ruler chooses whom to believe', () => {
  const contested = () => readEnvoyTestimony({
    accounts: [
      // The better-graded account: two firsthand voices saying terms were agreed.
      account('a', { sheetDigest: 'sheet.alpha' }),
      account('b', { sheetDigest: 'sheet.alpha' }),
      // The lone voice saying the envoy came home with nothing.
      account('c', { sheetDigest: 'none' }),
    ],
  });

  it('reads the ladder for an ordinary secure seat, and that is not a political act', () => {
    const chosen = selectBelievedAccount({ testimony: contested(), seat: seat() });
    expect(chosen.reason).toBe('selected');
    expect(chosen.basis).toBe('ladder');
    expect(chosen.chosenDigest).toBe('sheet.alpha');
    expect(chosen.politicalAct).toBe(false);
    expect(chosen.passedOverAccountId).toBeNull();
    expect(chosen.rejectedAccountIds).toHaveLength(2);
  });

  it('lets a precarious seat believe the worse-graded man when it serves the chair — and says so', () => {
    // Same testimony, same world, different ruler: the seat that wants the war
    // continued believes the one envoy who says no terms were reached.
    const chosen = selectBelievedAccount({
      testimony: contested(),
      seat: seat({ securityBand: 'precarious', desiredOutcome: 'war' }),
    });
    expect(chosen.basis).toBe('seat_interest');
    expect(chosen.chosenDigest).toBe('none');
    expect(chosen.chosenId ?? chosen.chosen.id).toBe('c');
    // THE RECEIPT IS THE POINT: the court did not merely decide, it passed
    // something over, and the record names what.
    expect(chosen.politicalAct).toBe(true);
    expect(chosen.passedOverAccountId).toBe('a');
  });

  it('does not let a lawful ruler read its interest first, however exposed the chair is', () => {
    const chosen = selectBelievedAccount({
      testimony: contested(),
      seat: seat({ securityBand: 'unseated', desiredOutcome: 'war', lawfulnessBand: 'lawful' }),
    });
    expect(chosen.basis).toBe('ladder');
    expect(chosen.chosenDigest).toBe('sheet.alpha');
    expect(chosen.politicalAct).toBe(false);
  });

  it('gives a realm with no seated ruler the ladder, because character needs a person', () => {
    const chosen = selectBelievedAccount({
      testimony: contested(),
      seat: seat({ rulerPresent: false, securityBand: 'unseated', desiredOutcome: 'war' }),
    });
    expect(chosen.basis).toBe('ladder');
    expect(chosen.chosenDigest).toBe('sheet.alpha');
  });

  it('SELECTS, never blends: every chosen digest is byte-equal to exactly one account\'s own', () => {
    const seats = [
      seat(),
      seat({ securityBand: 'precarious', desiredOutcome: 'war' }),
      seat({ moralityBand: 'malicious', desiredOutcome: 'peace' }),
      seat({ lawfulnessBand: 'lawless', desiredOutcome: 'undecided' }),
      seat({ rulerPresent: false }),
    ];
    const read = contested();
    const offered = new Set(digestsIn(read));
    expect(offered.size).toBeGreaterThan(1); // anchored: the accounts really do disagree
    for (const court of seats) {
      const chosen = selectBelievedAccount({ testimony: read, seat: court });
      expect(chosen.chosenDigest, JSON.stringify(court)).not.toBeNull();
      // The chosen digest is one of the offered strings, and the chosen record is
      // one of the input rows — no third, reconciled account exists anywhere.
      expect(offered.has(String(chosen.chosenDigest))).toBe(true);
      expect(read.accounts).toContain(chosen.chosen);
      expect([...chosen.rejectedAccountIds, String(chosen.chosen.id)].sort())
        .toEqual(read.accounts.map((row) => String(row.id)).sort());
    }
  });

  it('has no averaging arithmetic anywhere in its source', () => {
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/envoyTestimony.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(source.length).toBeGreaterThan(1000);
    // A merged estimate would have to be computed. These are the spellings by
    // which it could be, and the file is proven non-empty immediately above.
    for (const token of ['reduce(', '/ 2', 'average', 'mean(', 'blend', 'merge']) {
      expect(source, `envoyTestimony must not ${token}`).not.toContain(token); // anchored: see above
    }
  });

  it('refuses a foreign account rather than letting one court vote in another\'s hall', () => {
    const chosen = selectBelievedAccount({
      testimony: contested(),
      seat: seat({ settlementId: 'thorn' }),
    });
    expect(chosen.reason).toBe('foreign_account');
    expect(chosen.chosen).toBeNull();
  });
});
