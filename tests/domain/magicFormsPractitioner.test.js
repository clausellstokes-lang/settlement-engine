/**
 * magicFormsPractitioner.test.js — W-K slice K2, THE PRACTITIONER AS A PERSON
 * (docs/DESIGN_MAGIC_ECONOMY.md §3b).
 *
 * §3b's claim is that "the thorp's whole magic is someone you can lose", and the
 * suite is built to make each half of that sentence falsifiable:
 *
 *   IT IS SOMEONE      a thorp with NO magic institution still holds the practitioner
 *       rung, through a roster character. Anchored against the measured fact that the
 *       catalog authors no Magic category at thorp at all, so a building could never
 *       satisfy the design sentence.
 *   YOU CAN LOSE THEM  killing the person un-holds the rung, and the loss read tells a
 *       settlement that never had a practitioner apart from one whose practitioner
 *       was killed. Those are different worlds and a surface must narrate them
 *       differently.
 *   THE TIE IS ORDINARY  the row is a plain structural NPC, which is what gives the
 *       consequence economy reach over it for free.
 */
import { describe, it, expect } from 'vitest';
import {
  PRACTITIONER_PROVENANCE,
  PRACTITIONER_ROLE,
  defaultPractitionerName,
  ensureTiedPractitioner,
  isMagicPractitioner,
  mintTiedPractitioner,
  practitionerLoss,
  practitionerName,
  tiedPractitionerOf,
} from '../../src/domain/worldPulse/magicFormsPractitioner.js';
import { availableMagicForms, heldMagicForms, magicFormInstitutions } from '../../src/domain/worldPulse/magicForms.js';
import { inferImportance } from '../../src/domain/entities/npcs.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const thorp = (npcs = [], institutions = []) => ({
  tier: 'thorp', config: { magicLevel: 'high' }, institutions, npcs,
});

describe('recognizing a practitioner', () => {
  it('by ROLE, which is the only way a thorp wizard can be found (no institution to tie to)', () => {
    expect(isMagicPractitioner({ npc: { role: PRACTITIONER_ROLE }, settlement: thorp() })).toBe(true);
    expect(isMagicPractitioner({ npc: { role: 'Reeve' }, settlement: thorp() })).toBe(false);
  });

  it('by PROVENANCE, so a row this lane minted is recognized even if its role is edited', () => {
    expect(isMagicPractitioner({
      npc: { role: 'The Wise Woman', generatedAs: PRACTITIONER_PROVENANCE }, settlement: thorp(),
    })).toBe(true);
  });

  it('by TIE to a practitioner- or circle-class institution, which survives a rename', () => {
    const settlement = {
      tier: 'village',
      config: { magicLevel: 'high' },
      institutions: [{ id: 'i1', name: 'Druid Circle', tags: ['arcane', 'religious'], status: 'active' }],
      npcs: [],
    };
    expect(isMagicPractitioner({ npc: { role: 'Elder', linkedInstitutionIds: ['i1'] }, settlement })).toBe(true);
    // A tie to a GUILD is not the practitioner rung: that person is an officer of an
    // institution, not the settlement's whole magic.
    const guildSettlement = {
      ...settlement,
      institutions: [{ id: 'i1', name: "Mages' guild", tags: ['arcane', 'guild'], status: 'active' }],
    };
    expect(isMagicPractitioner({ npc: { role: 'Elder', linkedInstitutionIds: ['i1'] }, settlement: guildSettlement })).toBe(false);
  });
});

describe('holding and losing the rung (§3b)', () => {
  it('a LIVING practitioner is held; a dead, exiled or missing one is not', () => {
    for (const status of ['dead', 'exiled', 'missing', 'retired', 'removed']) {
      expect(
        tiedPractitionerOf(thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status }])),
        `a ${status} practitioner must not read as held`,
      ).toBeNull();
    }
    // ANCHOR: the identical row ALIVE is held, so the five nulls measure the status
    // filter rather than a reader that finds nobody.
    expect(tiedPractitionerOf(thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'active' }])))
      .toMatchObject({ name: 'Aelfric' });
  });

  it('THE THORP CASE: no institution, and the rung is held anyway, by a person', () => {
    const settlement = thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'active' }]);
    // The band says a practitioner belongs here...
    expect(availableMagicForms({ settlement, regime: 'subsistence' }).top).toBe('practitioner');
    // ...the roster holds no magic BUILDING at all...
    expect(magicFormInstitutions(settlement)).toEqual([]);
    // ...and yet the rung is held, which is the whole of §3b.
    expect([...heldMagicForms({ settlement, tiedPractitioner: Boolean(tiedPractitionerOf(settlement)) })])
      .toEqual(['practitioner']);
  });

  it('KILLING THEM un-holds the rung: the thorp\'s whole magic is gone', () => {
    const alive = thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'active' }]);
    const dead = thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'dead' }]);
    expectPresentThenAbsent(
      [...heldMagicForms({ settlement: alive, tiedPractitioner: Boolean(tiedPractitionerOf(alive)) })],
      [...heldMagicForms({ settlement: dead, tiedPractitioner: Boolean(tiedPractitionerOf(dead)) })],
      'practitioner',
    );
  });

  it('the loss read tells "never had one" apart from "had one and lost them"', () => {
    const never = practitionerLoss(thorp([{ id: 'n1', name: 'Osric', role: 'Reeve', status: 'active' }]));
    expect(never).toMatchObject({ lost: false, person: null });
    const lost = practitionerLoss(thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'dead' }]));
    expect(lost.lost).toBe(true);
    expect(lost.status).toBe('dead');
    expect(practitionerName(lost.person)).toBe('Aelfric');
    // A settlement whose practitioner still lives has lost nobody.
    expect(practitionerLoss(thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'active' }])).lost)
      .toBe(false);
  });
});

describe('the mint is ordinary, deterministic and RNG-free', () => {
  it('produces a plain structural NPC the consequence economy already knows how to reach', () => {
    const person = mintTiedPractitioner({ cid: 's1', institutionId: 'i1' });
    expect(person).toMatchObject({
      role: PRACTITIONER_ROLE,
      importance: 'key',
      status: 'active',
      linkedInstitutionIds: ['i1'],
      generatedAs: PRACTITIONER_PROVENANCE,
    });
    // `key` is entities/npcs.js's own rule for a solo role-holder, and its removal is
    // what impairs the linked entity. Pinned against that module rather than asserted.
    expect(inferImportance(person)).toBe('key');
  });

  it('is DETERMINISTIC: the same settlement mints the same id every time, with no draw', () => {
    const a = mintTiedPractitioner({ cid: 's1' });
    const b = mintTiedPractitioner({ cid: 's1' });
    expect(a.id).toBe(b.id);
    // ...and two different settlements do not collide.
    expect(mintTiedPractitioner({ cid: 's2' }).id).not.toBe(a.id);
  });

  it('names deterministically per settlement when the caller supplies no name', () => {
    expect(defaultPractitionerName('riverbend')).toContain(PRACTITIONER_ROLE);
    expect(defaultPractitionerName('riverbend')).not.toBe(defaultPractitionerName('stonehollow'));
    // A caller with a seeded draw supplies one, and it wins.
    expect(mintTiedPractitioner({ cid: 's1', name: 'Aelfric of the Ford' }).name).toBe('Aelfric of the Ford');
  });
});

describe('the fold is idempotent and never resurrects', () => {
  it('returns the SAME REFERENCE when a living practitioner is already held', () => {
    const settlement = thorp([{ id: 'n1', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'active' }]);
    expect(ensureTiedPractitioner({ settlement, cid: 's1' })).toBe(settlement);
  });

  it('running it every advance writes exactly once', () => {
    const first = ensureTiedPractitioner({ settlement: thorp(), cid: 's1' });
    expect(first.npcs.length).toBe(1);
    const second = ensureTiedPractitioner({ settlement: first, cid: 's1' });
    expect(second).toBe(first);
    expect(second.npcs.length).toBe(1);
  });

  it('does NOT resurrect a dead practitioner: the new person is a NEW person', () => {
    const settlement = thorp([{ id: 'npc.old', name: 'Aelfric', role: PRACTITIONER_ROLE, status: 'dead' }]);
    const after = ensureTiedPractitioner({ settlement, cid: 's1' });
    expect(after.npcs.length).toBe(2);
    expect(after.npcs[0]).toMatchObject({ id: 'npc.old', status: 'dead' });
    expect(after.npcs[1].id).not.toBe('npc.old');
    expect(after.npcs[1].status).toBe('active');
  });

  it('ties to a standing practitioner-class institution when one exists, and to nothing when none does', () => {
    const village = {
      tier: 'village',
      config: { magicLevel: 'high' },
      institutions: [{ id: 'i1', name: 'Hedge wizard', tags: ['arcane'], status: 'active' }],
      npcs: [],
    };
    expect(ensureTiedPractitioner({ settlement: village, cid: 's1' }).npcs[0].linkedInstitutionIds)
      .toEqual(['i1']);
    expect(ensureTiedPractitioner({ settlement: thorp(), cid: 's1' }).npcs[0].linkedInstitutionIds)
      .toEqual([]);
  });

  it('does not mutate the input settlement, and survives a JSON round trip', () => {
    const settlement = thorp();
    const before = JSON.stringify(settlement);
    const after = ensureTiedPractitioner({ settlement, cid: 's1' });
    expect(JSON.stringify(settlement)).toBe(before);
    const revived = JSON.parse(JSON.stringify(after));
    expect(tiedPractitionerOf(revived)).toBeTruthy();
    expect(ensureTiedPractitioner({ settlement: revived, cid: 's1' })).toBe(revived);
  });
});
