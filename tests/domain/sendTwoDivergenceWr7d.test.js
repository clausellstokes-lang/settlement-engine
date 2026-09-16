/**
 * sendTwoDivergenceWr7d.test.js — WR-7d's counter-intelligence and the vetting.
 *
 * Amendment Q: a compromised envoy is the only leak in the model that carries
 * REAL facts, because K.2 hands him truth and K3 forbids everyone else from
 * holding any. SEND-TWO is the answer, and the detector is not new machinery —
 * it is WR-7c's corroboration ladder asked one extra question: were these two
 * accounts of the SAME parlay?
 *
 * THE TESTIMONY IS REAL. Every divergence read in this file runs against output
 * that `readEnvoyTestimony` actually produced, so the rungs the reader reports
 * are rungs the ladder really assigned.
 *
 * J-INF-15 is discharged by this file existing: the shared reader has ONE home,
 * and IN-3's SEND-TWO verb consumes it rather than forking a second one.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';

import {
  SEND_TWO_VERDICTS,
  VETTING_QUALITIES,
  readSendTwoDivergence,
  vetVolunteerEnvoy,
} from '../../src/domain/worldPulse/sendTwoDivergence.js';
import { readEnvoyTestimony } from '../../src/domain/worldPulse/envoyTestimony.js';

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

/** A REAL graded read — the same producer the ruler's own choice consumes. */
function testimonyOf(accounts) {
  const read = readEnvoyTestimony({ accounts });
  expect(read.reason, 'the testimony fixture must really grade').toBe('graded');
  return read;
}

const bothSent = ['npc.a', 'npc.b'];

describe('WR-7d — SEND-TWO: two men, one tent, two stories', () => {
  it('reports agreement when both accounts of one parlay say the same thing', () => {
    const read = readSendTwoDivergence({
      testimony: testimonyOf([account('a'), account('b')]),
      encounterId: 'encounter.field.iron.reed.12',
      attendedBy: bothSent,
    });
    expect(read).toMatchObject({ verdict: 'agreed', reason: 'compared', signature: false });
    expect(read.digests).toEqual(['sheet.alpha']);
    // Two agreeing firsthand voices: the ladder really did grade them, and the
    // reader reports the rung it found rather than one of its own invention.
    expect(read.topRung).toBe('corroborated');
    expect(read.accounts.map((row) => row.rung)).toEqual(['corroborated', 'corroborated']);
  });

  it('THE SIGNATURE: divergent accounts of ONE parlay, and it names nobody', () => {
    const read = readSendTwoDivergence({
      testimony: testimonyOf([account('a'), account('b', { sheetDigest: 'none' })]),
      encounterId: 'encounter.field.iron.reed.12',
      attendedBy: bothSent,
    });
    expect(read).toMatchObject({ verdict: 'diverged', signature: true });
    expect(read.digests).toEqual(['none', 'sheet.alpha']);
    // The reader says a man in that tent is lying and stops. WHICH man is the
    // ruler's act, through selectBelievedAccount, and it is character.
    expect(Object.keys(read)).not.toContain('traitorNpcId');
    expect(read.accounts.map((row) => row.npcId).sort()).toEqual(['npc.a', 'npc.b']);
    expect(SEND_TWO_VERDICTS).toContain(read.verdict);
  });

  it('will not convict the unlucky: one returning envoy is not a send-two', () => {
    // The second man may be dead, held, or still on the road. A court that read
    // that silence as treachery would hang the man who simply came home.
    const read = readSendTwoDivergence({
      testimony: testimonyOf([account('a')]),
      encounterId: 'encounter.field.iron.reed.12',
      attendedBy: bothSent,
    });
    expect(read).toMatchObject({
      verdict: 'not_a_send_two', reason: 'only_one_account_returned', signature: false,
    });
    // And a court that only ever sent one man has no comparison to make at all.
    expect(readSendTwoDivergence({
      testimony: testimonyOf([account('a')]),
      encounterId: 'encounter.field.iron.reed.12',
      attendedBy: ['npc.a'],
    }).reason).toBe('not_a_send_two');
  });

  it('EXCLUDES an account of another parlay, and says that it did', () => {
    // Two envoys who sat in different tents may disagree about the world without
    // either lying, so a third account is not counter-evidence — and dropping it
    // in silence would leave a reader unable to tell absence from exclusion.
    const read = readSendTwoDivergence({
      testimony: testimonyOf([
        account('a'), account('b'), account('c', { sheetDigest: 'sheet.beta' }),
      ]),
      encounterId: 'encounter.field.iron.reed.12',
      attendedBy: bothSent,
    });
    expect(read.verdict).toBe('agreed');
    expect(read.excludedAccountIds).toEqual(['c']);
    expect(read.accounts.map((row) => row.id)).toEqual(['a', 'b']);
  });

  it('refuses an ungraded read, a nameless encounter, or a one-man roster', () => {
    expect(readSendTwoDivergence({ testimony: {}, encounterId: 'e', attendedBy: bothSent }).reason)
      .toBe('invalid_testimony');
    expect(readSendTwoDivergence({
      testimony: testimonyOf([account('a'), account('b')]), encounterId: '', attendedBy: bothSent,
    }).reason).toBe('invalid_encounter');
    // A "send-two" naming one man twice is one man.
    expect(readSendTwoDivergence({
      testimony: testimonyOf([account('a'), account('b')]),
      encounterId: 'encounter.field.iron.reed.12',
      attendedBy: ['npc.a', 'npc.a'],
    }).reason).toBe('not_a_send_two');
  });
});

describe('WR-7d — the vetting is a seat decision, and both arms are real', () => {
  const volunteer = (patch = {}) => ({
    npcId: 'npc.volunteer', loyaltyBand: 'proven', foreignTieBand: 'none', ...patch,
  });

  it('a careful seat refuses the man its own records already doubt', () => {
    expect(vetVolunteerEnvoy({
      quality: 'careful', volunteer: volunteer({ foreignTieBand: 'close' }),
    })).toMatchObject({ accepted: false, basis: 'foreign_tie' });
    expect(vetVolunteerEnvoy({
      quality: 'careful', volunteer: volunteer({ loyaltyBand: 'suspect' }),
    })).toMatchObject({ accepted: false, basis: 'loyalty' });
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer() }))
      .toMatchObject({ accepted: true, basis: 'nothing_found' });
  });

  it('a hurried seat takes the volunteer, and Q depends on that arm existing', () => {
    // THE SAME MAN, the same records, a court in a hurry: accepted, unread, and
    // handed the realm's true picture. Without this arm there is no betrayal
    // to catch and SEND-TWO is a ceremony.
    for (const bad of [
      volunteer({ foreignTieBand: 'close' }),
      volunteer({ loyaltyBand: 'suspect' }),
      volunteer({ loyaltyBand: 'suspect', foreignTieBand: 'close' }),
    ]) {
      const taken = vetVolunteerEnvoy({ quality: 'hurried', volunteer: bad });
      expect(taken, JSON.stringify(bad)).toMatchObject({
        accepted: true, quality: 'hurried', basis: 'no_time_to_look',
      });
      // And the careful court, on the identical man, says no.
      expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: bad }).accepted).toBe(false);
    }
    expect(VETTING_QUALITIES).toEqual(['hurried', 'careful']);
  });

  it('refuses an unreadable volunteer or an unnamed care level', () => {
    expect(vetVolunteerEnvoy({ quality: 'thorough', volunteer: volunteer() }).reason)
      .toBe('invalid_quality');
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: { npcId: 'npc.x' } }).reason)
      .toBe('invalid_volunteer');
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ loyaltyBand: 'loyal' }) })
      .accepted).toBe(false);
  });
});
