/**
 * tests/domain/tension/troubleWeight.test.js — A CALM TOWN WITHOUT A TROUBLE OF WEIGHT KEEPS TODAY'S SHEET, BYTE FOR BYTE
 * (FRAME-2 · B2, the chair's CF1 as amended and CF11, final; the owner, 2026-11-20: "A calm town should be as it currently
 * is. Just a collection of people without a central issue if there is none. Don't invent drama capitalize on what's
 * already there if it's there.").
 *
 * THE PINS were taken at the working line's commit `7e0c77ae2` (no frame code), in an archive of that commit
 * (`git archive 7e0c77ae2 | tar -x`, this checkout's `node_modules` linked beside it), over the same births: the
 * generators did not change between that commit and the frame's line, so a seed births the same town at both. Each pin is
 * the first 16 hex of the sha256 of `JSON.stringify(composeTonightSheet(s))` as composed (no key dropped), or of the
 * Foundry journal's Tonight page text. Since FRAME-2 · B3's audience gate, only the owner's sheet can carry a frame, so
 * every sheet here is composed AS THE OWNER (`{ audience: 'owner' }`), and the stranger's sheet (no options) is held to
 * the same pin.
 *
 * The calm towns were chosen by measuring the 330-town calm pool (`frame-calm-<tier>-<i>`, FRAME-1's pool script): the
 * first four of each tier that hold NO trouble of weight. The towns in crisis are the first birth of each tier, in the
 * same seed series, that carries an active crisis.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, TONIGHT_COPY } from '../../../src/domain/summary/tonightSheet.js';
import { castTroubleFrame, troubleOfWeight, HALL_TAKEN, WEIGHT_GRADES } from '../../../src/domain/tension/troubleCast.js';
import { buildJournalPages } from '../../../src/foundry/journalPages.js';
import { CAPTURE_LADDER } from '../../../src/domain/corruption.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const OWNER = Object.freeze({ audience: 'owner' });
const digest = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
const born = (seed) => generateSettlementPipeline({ settType: seed.split('-')[2] }, null, { seed, customContent: {} });
const tonightPageOf = (s) => buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === TONIGHT_COPY.title)?.markdown ?? '';

/**
 * Calm towns of every tier with no trouble of weight: the sheet's digest AT THE LINE. Measured at `7e0c77ae2` (FRAME-2 ·
 * B2); RE-MEASURED at the line `e356c94f2` (FRAME-3, the merge of the line, by the chair's ruling of 2026-11-20): the
 * line's final names work (point 77) changes generated prose, so 11 of the 24 born towns are no longer the towns pinned at
 * `7e0c77ae2`; each was composed in an archive of `e356c94f2`, which carries no frame code, and each equals the digest
 * the merged tree composes. "A calm town keeps today's sheet byte for byte" still means today's line.
 */
const CALM_WITHOUT_WEIGHT = Object.freeze({
  'frame-calm-thorp-0': 'eb85297cfc5b5e59',
  'frame-calm-thorp-1': '38efdead570be137',
  'frame-calm-thorp-7': 'f8baaf1868bbcff7',
  'frame-calm-thorp-9': '0dbe4d9e56157118',
  'frame-calm-hamlet-0': '13940304a7c79786',
  'frame-calm-hamlet-3': 'f248c198e2a4fc6a',
  'frame-calm-hamlet-5': 'fc803552503673a9',
  'frame-calm-hamlet-6': '0f2ea86d413136d4',
  'frame-calm-village-3': '50884b19c5dec9a7',
  'frame-calm-village-6': '17fb4f6aa1288677',
  'frame-calm-village-8': '8f015fb66776dc1f',
  'frame-calm-village-9': '8af0c4ddd82d1c7a',
  'frame-calm-town-0': 'ea7a1e92e52d35da',
  'frame-calm-town-2': '5e81f5cd093e534b',
  'frame-calm-town-3': '60993785dfe8ca81',
  'frame-calm-town-4': 'b810400e8b4d4c44',
  'frame-calm-city-1': '3c7240562c56a3f3',
  'frame-calm-city-2': 'c74d5cfbcd0503d1',
  'frame-calm-city-5': '8bbf9be2052ad97b',
  'frame-calm-city-6': '40fce4db0fe6c6e2',
  'frame-calm-metropolis-3': '88fda46e2ca6c25c',
  'frame-calm-metropolis-4': 'b8f48be71e29eff3',
  'frame-calm-metropolis-6': 'fd4daaeaa82379ae',
  'frame-calm-metropolis-7': '13a0b282dc50e6e4',
  // FRAME-2 · B9 (W2 as written: both powers): calm towns that LOSE their frame keep today's sheet. Each was framed by a
  // high conflict with only one of its powers a side and holds no other trouble of weight: hamlet-45 and city-0 a
  // crime_wave, city-4 a corruption_scandal. Measured as the rows above, in an archive of the line `e356c94f2` (born there
  // and at the tip to the same record; the line's sheet is the pin, and the tip composes it for the owner and a stranger).
  'frame-calm-hamlet-45': 'eb21c108edea150b',
  'frame-calm-city-0': 'a9ca38f47427c312',
  'frame-calm-city-4': '4a1451e63d8106ca',
});

/** The journal's Tonight page text of two of them at `7e0c77ae2`, unchanged at the line `e356c94f2` (re-measured): the rendered sheet is held, not only the object. */
const JOURNAL_TONIGHT = Object.freeze({
  'frame-calm-thorp-0': '5350507f9d517515',
  'frame-calm-thorp-1': '195c36f6e30841a1',
});

/**
 * A town in crisis of every tier: the sheet's digest at `7e0c77ae2` WITH THE NAMES RULE ALONE (FRAME-2 · B5c). The crisis
 * sheet carries the crisis hooks, and B5 (8594e509d) names their powers through `powerNameInProse` ("of the Household
 * Council", "the Guard loses most"). These pins were measured in an archive of `7e0c77ae2` with only that change applied
 * (`git diff 79db75eb2 8594e509d -- src/domain/crisis/crisisHooks.js`, applied to the archive), so a crisis sheet differs
 * from the base by the names rule and nothing else. The same archive unpatched gives the old pins (05546993e0ac6ff1,
 * b6150a0c2ee81edc, a5387ed63cd9cac4, 4243a02c390c9a6a, 385c00c79c91f40b, 4b26a1c208b3f083). RE-MEASURED at the merge of
 * the line (FRAME-3, the chair's ruling): in an archive of the line `e356c94f2` with only that crisisHooks diff applied;
 * city-24 and metropolis-0 moved (the line's names work in their generated prose), the other four are unchanged.
 * RE-MEASURED AGAIN at the merge of the line 0c9069489 (FRAME-5, the chair's ruling 12 as amended for that merge): in an
 * archive of the line `0c9069489` with B5's crisisHooks diff AND B11's crisisCast diff (`git diff 31922415e~1 31922415e --
 * src/domain/crisis/crisisCast.js`) applied, all six equal the merged tree; without B11's diff metropolis-0 stays at
 * 2d8e97beae5ef6d0. So metropolis-0's move is B11's (FRAME-3 ruling 9, a person is never "it": "In the migration, Liangjie
 * Tang of the Religious Authorities takes the worst of it: its people" -> "his people"), not the line's; it was red on the
 * lane from B11's merge (9c2be7882) and unnamed there. The other five are unchanged.
 * RE-RECORDED BY CAUSE at FRAME-7 · SR1 (the stakes' reason; SR1-RESULTS.md): town-6, city-24 and metropolis-0 differ from
 * SR1's base 334f9fb68 in ONE leaf each, the lever hook's "because …" (the first loser's stored reason, now said by its
 * matched system: "people look to it first for an answer", "it has to find the hands to keep watch", "they hold people
 * together, and that is what the crisis frays"); before: eae16131620269ec, 4545a9abe27449f1, e3bb76cf91977d0f.
 */
const IN_CRISIS = Object.freeze({
  'frame-calm-thorp-2': 'aa729268a7bb3546',
  'frame-calm-hamlet-1': 'd2becadf54b62251',
  'frame-calm-village-1': 'a4eed51cd6861887',
  'frame-calm-town-6': '7f8fea0ab7b08fa1',
  'frame-calm-city-24': 'edd1a8338c5ec9a9',
  'frame-calm-metropolis-0': '7e775f15f6b2628f',
});

/**
 * Towns WITH a trouble of weight, one for each strain that opens a sheet on the pool, and the tension the order picks
 * (its type and its place in `history.currentTensions`). No calm thorp of the 55 holds one.
 */
const WITH_WEIGHT = Object.freeze([
  { seed: 'frame-calm-hamlet-17', type: 'succession_crisis', at: 0, why: 'legitimacy below 45, a tension about the seat by its matter' },
  { seed: 'frame-calm-hamlet-19', type: 'corruption_scandal', at: 0, why: 'legitimacy below 45; the scandal names the ruling power as its first side' },
  { seed: 'frame-calm-village-76', type: 'legitimacy_crisis', at: 0, why: 'the incumbent ungated (graded with legitimacy below 30)' },
  { seed: 'frame-calm-village-49', type: 'succession_crisis', at: 1, why: 'legitimacy below 45 outranks the impaired chain the market crash at #0 is about' },
  // re-seated at B9: city-4's corruption_scandal names one power of its high row only, so it casts no frame now (pinned above)
  { seed: 'frame-calm-city-8', type: 'crime_wave', at: 0, why: 'a high conflict whose two powers are both sides' },
  { seed: 'frame-calm-village-20', type: 'resource_scarcity', at: 1, why: 'an impaired chain, a material tension' },
]);

describe('a calm town without a trouble of weight keeps today\'s sheet, byte for byte (CF11)', () => {
  it(`${Object.keys(CALM_WITHOUT_WEIGHT).length} calm towns of every tier: the sheet digests as at 7e0c77ae2, and no frame is cast`, () => {
    const failures = collectSeedFailures(Object.keys(CALM_WITHOUT_WEIGHT), (seed) => {
      const s = born(seed);
      expect(castTroubleFrame(s), `${seed} casts no frame`).toBe(null);
      expect(digest(JSON.stringify(composeTonightSheet(s, OWNER))), `${seed} (the owner)`).toBe(CALM_WITHOUT_WEIGHT[seed]);
      expect(digest(JSON.stringify(composeTonightSheet(s))), `${seed} (a stranger)`).toBe(CALM_WITHOUT_WEIGHT[seed]);
    });
    expectNoSeedFailures(failures, 'a calm town without a trouble of weight keeps the sheet of 7e0c77ae2');
  }, 300000);

  it('the journal\'s Tonight page text of two of them digests as at 7e0c77ae2 (the rendered sheet, not only the object)', () => {
    const failures = collectSeedFailures(Object.keys(JOURNAL_TONIGHT), (seed) => {
      const text = tonightPageOf(born(seed));
      expect(text.length, seed).toBeGreaterThan(0);
      expect(digest(text), seed).toBe(JOURNAL_TONIGHT[seed]);
    });
    expectNoSeedFailures(failures, 'the journal Tonight page of a calm town without weight is the page of 7e0c77ae2');
  }, 300000);
});

describe('a town in crisis keeps its crisis sheet, byte for byte', () => {
  it(`${Object.keys(IN_CRISIS).length} towns in crisis, one a tier: the sheet digests as at 7e0c77ae2 with the names rule alone`, () => {
    const failures = collectSeedFailures(Object.keys(IN_CRISIS), (seed) => {
      const s = born(seed);
      const sheet = composeTonightSheet(s, OWNER);
      expect(sheet.crisis, `${seed} is in crisis`).toBeTruthy();
      expect(digest(JSON.stringify(sheet)), `${seed} (the owner)`).toBe(IN_CRISIS[seed]);
      expect(digest(JSON.stringify(composeTonightSheet(s))), `${seed} (a stranger)`).toBe(IN_CRISIS[seed]);
    });
    expectNoSeedFailures(failures, 'a town in crisis keeps the sheet of 7e0c77ae2 with the names rule alone');
  }, 300000);
});

/**
 * W2 AS WRITTEN (FRAME-2 · B9, the chair's ruling of 2026-11-20: "a high conflict gives a trouble weight only where BOTH
 * of the row's powers are sides of the tension"). Measured on the 330-town calm pool: `frame-calm-hamlet-45` holds one
 * high row (Free Elder Council vs Military Party) and no other strain (legitimacy 48, the incumbent gated, food Secure,
 * no creditor power, no impaired chain); its one tension, a crime_wave, names the Military Party and not the Elder
 * Council, so it holds no trouble of weight and casts no frame. `frame-calm-city-8` holds the row Military/Guard vs
 * Thieves' Guild and no other strain; its crime_wave at #0 names both, so it opens there.
 */
const ONE_POWER_A_SIDE = Object.freeze({ seed: 'frame-calm-hamlet-45', row: ['Free Elder Council', 'Military Party'] });
const BOTH_POWERS_SIDES = Object.freeze({ seed: 'frame-calm-city-8', row: ['Military/Guard', "Thieves' Guild"] });

describe('W2 as written: a high conflict weighs only where both its powers are the tension\'s sides (B9)', () => {
  const sideKey = (v) => String(v).toLowerCase().replace(/^the\s+/, '');
  const highRows = (s) => s.powerStructure.conflicts.filter((r) => r.intensity === 'high').map((r) => r.parties);
  const sidesOf = (t) => t.factions.map(sideKey);

  it(`${ONE_POWER_A_SIDE.seed}: only one of its high row's powers is a side of its tension, so it casts no frame and keeps today's sheet`, () => {
    const s = born(ONE_POWER_A_SIDE.seed);
    // the measure's premises, anchored on the record: the one high row, one of its powers a side, the other not
    expect(highRows(s)).toEqual([ONE_POWER_A_SIDE.row]);
    const tensions = s.history.currentTensions;
    expect(tensions.some((t) => ONE_POWER_A_SIDE.row.some((p) => sidesOf(t).includes(sideKey(p)))), 'a side names one of the powers').toBe(true);
    expect(tensions.some((t) => ONE_POWER_A_SIDE.row.every((p) => sidesOf(t).includes(sideKey(p)))), 'no tension names both').toBe(false);
    expect(troubleOfWeight(s)).toBe(null);
    expect(castTroubleFrame(s)).toBe(null);
    expect(composeTonightSheet(s, OWNER).frame).toBeUndefined();
  });

  it(`${BOTH_POWERS_SIDES.seed}: both of its high row's powers are sides of its crime_wave, so it opens there on W2`, () => {
    const s = born(BOTH_POWERS_SIDES.seed);
    expect(highRows(s)).toContainEqual(BOTH_POWERS_SIDES.row);
    expect(troubleOfWeight(s)).toMatchObject({ at: 0, tension: { type: 'crime_wave' }, strain: { strain: 'W2', grade: 'high-conflict', powers: BOTH_POWERS_SIDES.row } });
    expect(castTroubleFrame(s)).toMatchObject({ type: 'crime_wave', at: 0 });
    expect(composeTonightSheet(s, OWNER).frame?.type).toBe('crime_wave');
  });
});

describe('a calm town with a trouble of weight opens on the trouble the order picks (liveness)', () => {
  it(`${WITH_WEIGHT.length} towns, one for each strain that opens a sheet: the frame opens on the tension the order picks`, () => {
    const failures = collectSeedFailures(WITH_WEIGHT, ({ seed, type, at, why }) => {
      const s = born(seed);
      expect(castTroubleFrame(s), `${seed}: ${why}`).toMatchObject({ type, at });
      const sheet = composeTonightSheet(s, OWNER);
      expect(sheet.frame?.type, seed).toBe(type);
      expect(sheet.frame?.line, seed).toBe(s.history.currentTensions[at].description.replace(/\s+/g, ' ').trim());
    });
    expectNoSeedFailures(failures, 'a town with a trouble of weight opens on the trouble the order picks');
  }, 300000);
});

/**
 * W4, A HALL IN CRIMINAL HANDS WITH A LIVE CRIME WAVE (FRAME-5 · CF12, the chair's CF11 amended; the owner, relayed
 * 2026-11-20 11:15 UTC: "Do all of these, every last one predeploy"). Measured on the 330-town calm pool
 * (docs/chair/2026-11-20/content/frame5/CF12-CAPTURED-HALL-RESULTS.md): six calm towns hold BOTH a power at
 * `captureState` corrupted or capture AND a `crime_wave` among their tensions. Five held no trouble of weight before
 * and now open on that crime wave (W4, the weakest row); city-14 is already framed by that same crime wave on W2, which
 * outranks W4, so it keeps its sheet byte for byte (its pin, measured at the base 8991b83b2). Every other pin of this
 * file stays as it was.
 */
const HALL_AND_CRIME_WAVE = Object.freeze({
  'frame-calm-town-20': 'Town Mayor',
  'frame-calm-town-80': 'Town Mayor',
  'frame-calm-city-12': 'Merchant Guild Council',
  'frame-calm-city-49': 'Merchant oligarchy',
  'frame-calm-metropolis-51': 'Ducal Governorship',
});
const ALREADY_FRAMED_W2 = Object.freeze({ seed: 'frame-calm-city-14', hall: 'Merchant oligarchy', pin: 'd9c0870f07fe7c2a' });

describe('W4: a hall in criminal hands with a live crime wave opens the owner\'s sheet on that crime wave (CF12)', () => {
  const crimeWaveAt = (s) => s.history.currentTensions.findIndex((t) => t.type === 'crime_wave');
  // the premise reads the ladder's two rungs as the record writes them (pinned to HALL_TAKEN below), not through the code under test
  const takenHalls = (s) => s.powerStructure.factions.filter((f) => ['corrupted', 'capture'].includes(f.captureState)).map((f) => f.faction);

  it('the grade is its own last row, the weakest; the rows above it are as they were; the rungs are corrupted and capture', () => {
    expect(WEIGHT_GRADES.map((row) => [...row])).toEqual([
      ['legitimacy-below-30', 'seat-ungated'], ['legitimacy-below-45'], ['high-conflict'],
      ['food-below-secure', 'creditor-power', 'impaired-chain'], ['hall-captured'],
    ]);
    expect([...HALL_TAKEN]).toEqual(['corrupted', 'capture']);
    // the ladder's own rungs at or above corrupted (corruption.js :: CAPTURE_LADDER), held as words in troubleCast.js
    expect([...HALL_TAKEN]).toEqual(CAPTURE_LADDER.slice(CAPTURE_LADDER.indexOf('corrupted')));
  });

  it(`${Object.keys(HALL_AND_CRIME_WAVE).length} calm towns with both facts and no other trouble of weight open on their crime wave, its sides the people to voice`, () => {
    const failures = collectSeedFailures(Object.keys(HALL_AND_CRIME_WAVE), (seed) => {
      const s = born(seed);
      const at = crimeWaveAt(s);
      // the measure's premises, anchored on the record: the taken hall and the crime wave
      expect(takenHalls(s), `${seed}: the hall at corrupted or capture`).toEqual([HALL_AND_CRIME_WAVE[seed]]);
      expect(at, `${seed}: a crime wave among its tensions`).toBeGreaterThanOrEqual(0);
      expect(troubleOfWeight(s), seed).toMatchObject({ at, tension: { type: 'crime_wave' }, strain: { strain: 'W4', grade: 'hall-captured' } });
      const sheet = composeTonightSheet(s, OWNER);
      expect(sheet.frame?.type, seed).toBe('crime_wave');
      expect(sheet.frame?.line, seed).toBe(s.history.currentTensions[at].description.replace(/\s+/g, ' ').trim());
      // the people to voice are the crime wave's own sides' faces, each on a side the record holds
      const sides = sheet.frame.sides.map((d) => d.words);
      expect(sheet.people.length, `${seed}: a side's face is voiced`).toBeGreaterThan(0);
      for (const p of sheet.people) expect(sides, `${seed}: ${p.name} stands on a side of the crime wave`).toContain(p.side);
      // the stranger keeps today's sheet (the audience gate, the first lock)
      expect(composeTonightSheet(s).frame, `${seed} (a stranger)`).toBeUndefined();
    });
    expectNoSeedFailures(failures, 'a calm town with a taken hall and a crime wave opens on the crime wave for the owner');
  }, 300000);

  it(`${ALREADY_FRAMED_W2.seed}: framed by the same crime wave on W2, which outranks W4: it keeps its sheet byte for byte`, () => {
    const s = born(ALREADY_FRAMED_W2.seed);
    expect(takenHalls(s)).toEqual([ALREADY_FRAMED_W2.hall]);
    expect(troubleOfWeight(s)).toMatchObject({ at: crimeWaveAt(s), tension: { type: 'crime_wave' }, strain: { strain: 'W2', grade: 'high-conflict' } });
    const sheet = composeTonightSheet(s, OWNER);
    expect(digest(JSON.stringify(sheet))).toBe(ALREADY_FRAMED_W2.pin);
    // the chair's condition for keeping it (2026-11-20, 11:21 UTC): no side of the crime wave is missing from its people to voice
    expect(sheet.people.map((p) => p.side)).toEqual(sheet.frame.sides.map((d) => d.words));
  });

  it('both facts, each needed: no taken hall, a hall below corrupted, or no crime wave, and there is no W4', () => {
    const s = born('frame-calm-city-49');
    const at = crimeWaveAt(s);
    const withHall = (state) => ({ ...s, powerStructure: { ...s.powerStructure, factions: s.powerStructure.factions.map((f) => (f.captureState ? { ...f, captureState: state } : f)) } });
    const noField = { ...s, powerStructure: { ...s.powerStructure, factions: s.powerStructure.factions.map(({ captureState: _drop, ...f }) => f) } };
    for (const [label, town] of [['no captureState (the veil deletes it)', noField], ['none', withHall('none')], ['adversarial', withHall('adversarial')], ['equilibrium', withHall('equilibrium')]]) {
      expect(troubleOfWeight(town), label).toBe(null);
      expect(castTroubleFrame(town), label).toBe(null);
    }
    expect(troubleOfWeight(withHall('capture')), 'capture').toMatchObject({ at, strain: { strain: 'W4' } });
    const tensions = s.history.currentTensions.map((t, i) => (i === at ? { ...t, type: 'guild_conflict' } : t));
    expect(troubleOfWeight({ ...s, history: { ...s.history, currentTensions: tensions } }), 'the hall, but no crime wave').toBe(null);
  });
});
