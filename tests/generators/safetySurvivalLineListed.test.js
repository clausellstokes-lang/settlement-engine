/**
 * THE SURVIVAL LINE READS THE BLOCK'S OWN OPERATIONS LIST (RUNG-2 LANDING phase C unit 3,
 * 2026-11-06; rung 2E's `A-06:crime-absent-and-organised` in soak1k-6759, -6885, -7485, -7845).
 *
 * In those four towns the Defense tab's crime list printed "Theft driven by economic desperation
 * rather than organization. No criminal infrastructure: …" beside its own listed operation, a
 * Gambling Den ("Revenue funds broader criminal network."). The crime signal reads no network
 * there (no criminal seat; the one detector does not name the den), but the safety profile's own
 * `criminalInstitutions` lists it — the same list RUNG1B-F9 made the Defense structure read
 * (`defenseDisplay.js :: deriveCriminalStructure`, `listed`). `settleCrimeLinesToSignal` now reads
 * the survival line the same way: the crime signal, OR a listed criminal operation, OR a running
 * criminal supply chain. The debt-evasion line still reads the signal alone (a gambling den is
 * infrastructure, not a network).
 */
import { hungerIn } from '../../src/generators/safetyLineTruth.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { settleCrimeLinesToSignal } from '../../src/generators/safetyProfile.js';
/** UPKEEP-14 (ruling (h)): the estate holds a watch, so the enforcement sentence these lines end on is the roster's (the
 *  cut where no enforcer stands is guarded in safetyEnforcementReadsRoster.test.js); the survival-line choice is unchanged. */
const WATCHED = [{ name: 'Town watch', category: 'Defense' }];

const CLAUSE = /No criminal infrastructure/;
const DESPERATION = 'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.';
// UPKEEP-8 (#1173): beside a network the line is "Hunger-driven" only where the record holds hunger; else the same theft, not called hunger.
const THEFT_NETWORK = 'Theft of food, livestock, and stored goods by people with too little. Enforcement struggles to distinguish survival crime from organised theft.';
const networkLineOf = (s) => (hungerIn(s.economicState) ? DESPERATION : THEFT_NETWORK);
const NO_NETWORK = 'Theft driven by economic desperation rather than organization. No criminal infrastructure: just too many people with too little, doing what they must to survive.';
const DEBT_FULL = 'Residents fleeing creditor obligations, transferring assets fraudulently, or using criminal networks to avoid collection.';
const DEBT_PLAIN = 'Residents fleeing creditor obligations or transferring assets fraudulently to avoid collection.';

describe('the survival line reads the block\'s own operations list', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('soak1k-6759: beside a listed Gambling Den the survival line names no absence', () => {
    const { settlement } = birth(6759);
    const profile = settlement.economicState.safetyProfile;
    expect(profile.criminalInstitutions).toContain('Gambling Den');
    // RE-KEYED BY IDENTITY (UPKEEP-8, #1173): the network's line, read by the record's hunger.
    expect(profile.crimeTypes.find((c) => c.type === 'Survival crime')?.desc).toBe(networkLineOf(settlement));
    expect(profile.crimeTypes.map((c) => c.desc).join(' ')).not.toMatch(CLAUSE); // anchored: the survival row's desc is pinned on the line above
  });

  it('a listed operation turns the clause into the desperation-theft line, printed once', () => {
    const economicState = { safetyProfile: { criminalInstitutions: ['Gambling Den'], crimeTypes: [
      { type: 'Survival crime', desc: NO_NETWORK }, { type: 'desperation theft', desc: DESPERATION },
    ] } };
    const settled = settleCrimeLinesToSignal(economicState, { seats: [], estate: WATCHED });
    expect(settled.safetyProfile.crimeTypes).toEqual([{ type: 'Survival crime', desc: DESPERATION }]);
  });

  it('a running criminal supply chain reads the same way', () => {
    const economicState = {
      activeChains: [{ needKey: 'criminal_economy', status: 'operational' }],
      safetyProfile: { criminalInstitutions: [], crimeTypes: [{ type: 'Survival crime', desc: NO_NETWORK }] },
    };
    const settled = settleCrimeLinesToSignal(economicState, { seats: [], estate: WATCHED });
    expect(settled.safetyProfile.crimeTypes[0].desc).toBe(THEFT_NETWORK); // RE-KEYED BY IDENTITY (UPKEEP-8, #1173): no hunger on this record, so not "Hunger-driven"
  });

  it('a listed operation alone does not name a network on the debt-evasion line', () => {
    const economicState = { safetyProfile: { criminalInstitutions: ['Gambling Den'], crimeTypes: [{ type: 'debt evasion', desc: DEBT_FULL }] } };
    const settled = settleCrimeLinesToSignal(economicState, { seats: [], estate: WATCHED });
    expect(settled.safetyProfile.crimeTypes[0].desc).toBe(DEBT_PLAIN);
  });
});
