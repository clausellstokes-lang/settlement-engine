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

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import {
  SEND_TWO_VERDICTS,
  VETTING_BASES,
  VETTING_QUALITIES,
  VETTING_TEMPER_BANDS,
  readSendTwoDivergence,
  vetVolunteerEnvoy,
} from '../../src/domain/worldPulse/sendTwoDivergence.js';
import { readEnvoyTestimony } from '../../src/domain/worldPulse/envoyTestimony.js';
import { VETTING_TEMPER_BANDS as L5_TEMPER_BANDS, vettingTemperBand }
  from '../../src/domain/npc/characterConsumers.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

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


describe('⭐ THE ⟨F8⟩ CHARACTER TERM (W-LIVES L5) — an input, never the reader', () => {
  const volunteer = (patch = {}) => ({
    npcId: 'npc.town.4', loyaltyBand: 'proven', foreignTieBand: 'none', ...patch,
  });

  it('an ABSENT temper band cannot fire the arm — byte-identical to the pre-car reader', () => {
    // The whole dark-safety claim: no caller supplies the band today, and a
    // volunteer record without it is accepted exactly as it was before L5.
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer() }))
      .toEqual({ accepted: true, quality: 'careful', basis: 'nothing_found', reason: 'vetted' });
    for (const junk of [undefined, null, '', 'ordinary_ish', 7, {}]) {
      expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: junk }) }).accepted,
        String(junk)).toBe(true);
    }
  });

  it('THE COMPARATOR CAN SEE: a self-serving man the records clear is still refused', () => {
    const seen = vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: 'self_serving' }) });
    expect(seen).toEqual({ accepted: false, quality: 'careful', basis: 'temper', reason: 'vetted' });
    // ...and the two bands that are not a conviction change nothing.
    for (const band of ['ordinary', 'dutiful']) {
      expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: band }) }).accepted).toBe(true);
    }
  });

  it('THE RECORDS STILL DECIDE FIRST — character speaks only about a man the paperwork clears', () => {
    // A dutiful man with a close foreign tie is refused on the TIE, not cleared by
    // his character; and a suspect man is refused on LOYALTY. The term is an input.
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: 'dutiful', foreignTieBand: 'close' }) }).basis)
      .toBe('foreign_tie');
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: 'dutiful', loyaltyBand: 'suspect' }) }).basis)
      .toBe('loyalty');
    // ⛔ THE DISCRIMINATING ROWS, AND THEY WERE MISSING. The two rows above both use
    // `dutiful` — a band that NEVER fires the temper arm — so hoisting that arm above
    // the records changes nothing either of them can see, and a mutation that did
    // exactly that SURVIVED. Order is only observable on a man whose CHARACTER would
    // refuse him and whose RECORDS refuse him too: correct is the record's basis,
    // hoisted is `temper`.
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: 'self_serving', foreignTieBand: 'close' }) }).basis)
      .toBe('foreign_tie');
    expect(vetVolunteerEnvoy({ quality: 'careful', volunteer: volunteer({ temperBand: 'self_serving', loyaltyBand: 'suspect' }) }).basis)
      .toBe('loyalty');
    // And a HURRIED court never looks at any of it — Q's betrayal arm survives.
    expect(vetVolunteerEnvoy({ quality: 'hurried', volunteer: volunteer({ temperBand: 'self_serving' }) }).accepted)
      .toBe(true);
  });

  it('`temper` is APPENDED to the bases roster, never inserted (the §864 ordinal seat-theft)', () => {
    expect(VETTING_BASES).toEqual(['loyalty', 'foreign_tie', 'no_time_to_look', 'nothing_found', 'temper']);
    expect(VETTING_BASES[VETTING_BASES.length - 1]).toBe('temper');
  });

  it('RECONCILE PIN — the mirrored band vocabulary equals car L5\'s own', () => {
    // The mirror exists because this leaf's import reach is pinned to
    // ['./envoyTestimony.js'] by the K3 purity walker; the equality is asserted
    // here rather than bought with an import that would break that guarantee.
    expect(VETTING_TEMPER_BANDS).toEqual([...L5_TEMPER_BANDS]);
    // ...and the deriving function really produces members of it.
    expect(VETTING_TEMPER_BANDS).toContain(vettingTemperBand({ axes: { FIDELITY: { pole: 'vice', level: 'defining' } } }));
  });
});

describe('⭐⭐ THE ⟨F8⟩ ONE-HOME SCAN — the walker the charter said existed and did not', () => {
  /** @param {string} dir @param {string[]} out */
  function jsFilesUnder(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) jsFilesUnder(full, out);
      else if (/\.(js|jsx)$/.test(entry)) out.push(full);
    }
    return out;
  }

  it('exactly ONE file in src/ DEFINES a vetting reader, and it is the declared home', () => {
    // ⚠ docs/DESIGN_FP_ARCH_ES.md's seam table names this scan in its own tripwire
    // column — "the vetting one-home scan (no second `vetVolunteer` spelling in src)"
    // — and NO SUCH TEST EXISTED. The one-home property was true and unguarded, held
    // by three module headers and review. That is a CHARTER-CONFIRMED ROW THAT WAS A
    // HYPOTHESIS (the §441 J7 class), found while wiring the character term into the
    // very reader it protects. Built here rather than re-noted.
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const definers = files
      .filter((file) => /(export\s+)?function\s+vetVolunteer/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file));
    expect(definers).toEqual(['src/domain/worldPulse/sendTwoDivergence.js']);
  });

  it('every vetting-named function in src/ is enumerated, and only ONE of them decides', () => {
    // ⚠ THE SCAN CAUGHT THIS CAR'S OWN LEAF FIRST, and the distinction it forced is
    // worth more than the convenience of widening the pattern: `vettingTemperBand`
    // derives an INPUT — a word from a closed vocabulary — and can never return an
    // acceptance. The one-home law is about the DECISION ("vetting is a real refusal,
    // not a score"), so the roster is enumerated with the decider named, and a THIRD
    // spelling still reds. Loosening the regex to exclude the file that tripped it
    // would have been the easy edit and would have retired the guard.
    // ⭐ AND THE SUBSTRATE COUPLING ADDED THE SECOND DERIVER, WHICH IS WHY THE GUARD WAS
    // BUILT. `acceptanceCharacterReads.vettingInputFor` composes the volunteer ROW this
    // reader takes — it fills the `temperBand` field the ⟨F8⟩ arm has been waiting for
    // and hands the row straight back — so W-OPS acceptance consumes the one vetting
    // home instead of growing the second spelling this scan exists to forbid. The row
    // is enrolled, not excluded, and it pays the same non-decider price.
    const DECIDER = 'src/domain/worldPulse/sendTwoDivergence.js';
    // ⭐ AND W-OPS CAR O3 ADDED THE THIRD DERIVER, ON THE SAME TERMS. `infiltrationDepth`'s
    // `placementVettingRamp(intervalIdx)` returns a NUMBER out of
    // `INFILTRATION_DEPTH_TUNING.PLACEMENT_RAMP` — a ramp multiplier for the placement
    // interval, not a verdict — so it is an input the decider may read and never a second
    // place a refusal can be minted. Enrolled rather than excluded, exactly as the two rows
    // above were, and it pays the same non-decider price in the loop below (measured: the
    // leaf holds zero `accepted:` and zero `basis:`). Loosening the regex to let a ramp
    // through would have retired the guard for every future speller.
    const INPUT_DERIVERS = [
      'src/domain/npc/acceptanceCharacterReads.js',
      'src/domain/npc/characterConsumers.js',
      'src/domain/worldPulse/espionage/infiltrationDepth.js',
    ];
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    const spellings = files
      .filter((file) => /function\s+\w*[vV]et(Volunteer|Candidate|Envoy|ting)\w*\s*\(/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file))
      .sort();
    expect(spellings).toEqual([...INPUT_DERIVERS, DECIDER].sort());
    // ...and the enumerated input derivers really cannot decide. The ban is on BOTH
    // halves of the decider's verdict shape, not just one: `vetVolunteerEnvoy` answers
    // `{accepted, quality, basis, reason}`, so a forked decider would have to emit an
    // acceptance AND the basis it refused on. Banning `accepted:` alone would let a
    // second reader that returned only a basis word pass as a deriver.
    for (const rel of INPUT_DERIVERS) {
      // anchored: `spellings` is asserted equal to the enumerated roster above, so each path is live
      expect(readFileSync(join(REPO_ROOT, rel), 'utf8'), rel).not.toContain('accepted:');
      // anchored: same live path, pinned by the same roster equality one line above
      expect(readFileSync(join(REPO_ROOT, rel), 'utf8'), rel).not.toContain('basis:');
    }
  });
});
