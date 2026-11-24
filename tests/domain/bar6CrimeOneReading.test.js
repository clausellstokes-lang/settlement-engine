/**
 * bar6CrimeOneReading.test.js — BAR6-CRIME (BRIEF-BAR6's BAR6-CRIME section and B2/L4; vetoable by the owner): CRIME AND THE
 * FORCE THAT KEEPS ORDER HAVE ONE READING, kept as a guard. The auditors' rules (`tests/helpers/pageLaws/law9.mjs`: 9a.wave,
 * 9a.structure, 9a.contested, 9a.watch, 9a.militia, 9a.lawless, 9a.pay; seat D's 8e.crime; seat F's 10b and 10e-pay; seat C's
 * 6d-paid), their claims spelled as those detectors spell them, read over births on the lines the page prints (the Defense
 * display's readers, the stored hooks and services), against the one fact each now reads:
 *   `facts/lawBand.js :: crimeWaveStands` and `crimeWaveCoordinated`; `facts/criminalStructureKey.js :: criminalStructureKeyOf`;
 *   `facts/orderForce.js :: orderForceOf`; `display/crisisStoppedRow.js :: rowMarkText`; `facts/defence.js :: defenceOf`.
 *   (a) ZERO over the wide read's 150 towns (seeds `bar0-<shape>-rand-<27..41>`, the population whose standing rows are the
 *       controls);
 *   (b) A POSITIVE CONTROL from each rule's real row: the STORED line (the draw is not moved) still fires the claim beside its
 *       fact; the printed line is the twin; a DM's own line prints as written;
 *   (c) KEEP: where the fact does not refuse the line, the drawn line prints as drawn.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { criminalOpMark, deriveCriminalStructure, deriveDefenseVulnerabilities, deriveGuardAssessment, deriveSafetyLine } from '../../src/domain/display/defenseDisplay.js';
import { DIFFUSE_NOTE_COORDINATED, FUNDED_EMBATTLED_SHOWN, MILITIA_TURNS_OUT, guardLineUnderTheForce, safetyLineAsPrinted } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { crimeWaveCoordinated, crimeWaveStands } from '../../src/domain/facts/lawBand.js';
import { crimeWaveStands as crimeWaveShown } from '../../src/domain/display/foundationBandShown.js';
import { criminalStructureKeyOf } from '../../src/domain/facts/criminalStructureKey.js';
import { orderForceOf } from '../../src/domain/facts/orderForce.js';
import { defenceOf } from '../../src/domain/facts/defence.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { FUNDED_EMBATTLED } from '../../src/generators/structuralValidator.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs, its bar0 arm verbatim (as `bar5SafetyLawBand.test.js` spells it). @param {string} seed */
const cfgFor = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};
const SHAPES = ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-calm', 'town-occupied', 'city-under_siege+famine', 'city-wartime', 'metropolis-calm'];
/** The wide read's 150 (BRIEF-BAR6-AUDIT "The populations"). */
const WIDE = SHAPES.flatMap((s) => Array.from({ length: 15 }, (_, i) => `bar0-${s}-rand-${27 + i}`));

// ── the auditors' claims, spelled as their detectors spell them (law9.mjs; D's 8e.crime; F's 10b, 10e-pay; C's 6d-paid) ──
const CRIME_KEPT_DOWN = /\b(enforcement keeps it down and keeps it from growing|keeps the streets quiet because trouble brings the law|Crime exists but is well-managed)\b/;
const NO_ORG = /\b(organized crime has found no foothold|comes from lone thieves, not a gang|there is no boss to threaten or to bribe|with no gang behind it|with nothing to threaten and nobody to buy)\b/;
const LIMITED_ORG = /\borganized crime has a limited foothold\b/;
const PAPER = /\bexists? on paper\b/;
const MILITIA_PRESENT = /\bThe militia is present and responsive\b/;
const WELL_PAID = /\b(are well paid, well equipped|watch are well paid|is well paid, well equipped)\b/;
const PRESENT_AND_PAID = /\bforces are present and paid\b/;
const HOOK_HIS_SEX = /\bthe same man\b|\bHe's authorizing\b/;
const OUTBID = /\bThe law here is slow and easily outbid\b/;

/** The lines one town prints that these rules read. @param {any} t */
const printed = (t) => {
  const structure = deriveCriminalStructure(t);
  return {
    safety: String(deriveSafetyLine(t) ?? ''),
    guard: String(deriveGuardAssessment(t) ?? ''),
    structureKey: structure?.key ?? null,
    note: String(structure?.note ?? ''),
    reasons: deriveDefenseVulnerabilities(t).map((v) => String(v.reason ?? '')),
    hooks: (t.economicState?.safetyProfile?.plotHooks || []).map((h) => String(typeof h === 'string' ? h : h?.text ?? '')),
    services: Object.values(t.availableServices || {}).flat().filter((s) => s && typeof s === 'object'),
  };
};
/** Every instance of the rules on one town (empty is the law). @param {any} t */
const instances = (t) => {
  const p = printed(t);
  /** @type {string[]} */ const out = [];
  const key = criminalStructureKeyOf(t) ?? 'none';
  const f = orderForceOf(t);
  if (crimeWaveStands(t) && CRIME_KEPT_DOWN.test(`${p.safety} ${p.note}`) && /keeps the streets quiet/.test(p.note)) out.push(`9a.wave: ${p.note}`);
  if ((key === 'organized' || key === 'semi-organized') && NO_ORG.test(p.safety)) out.push(`9a.structure: ${p.safety}`);
  if (key === 'organized' && LIMITED_ORG.test(p.safety)) out.push(`9a.structure: ${p.safety}`);
  if (crimeWaveCoordinated(t) && (NO_ORG.test(p.safety) || NO_ORG.test(p.note))) out.push(`9a.contested: ${p.safety} | ${p.note}`);
  if (PAPER.test(p.guard) && f.kept && f.houses.some((h) => !rowMarkText(t, 'house', /** @type {never} */ (h)))) out.push(`9a.watch: ${p.guard}`);
  if (MILITIA_PRESENT.test(p.safety) && f.count.militia > 0 && f.count.garrison + f.count.watch === 0) out.push(`9a.militia: ${p.safety}`);
  if (f.payCut && WELL_PAID.test(p.guard)) out.push(`9a.pay: ${p.guard}`);
  for (const r of p.reasons) if (PRESENT_AND_PAID.test(r) && !f.paid) out.push(`6d-paid: ${r}`);
  for (const h of p.hooks) if (HOOK_HIS_SEX.test(h)) out.push(`10b: ${h}`);
  const d = defenceOf(t);
  for (const s of p.services) if (d.court && d.prison && OUTBID.test(String(/** @type {any} */ (s).desc ?? ''))) out.push(`9a.lawless: ${/** @type {any} */ (s).desc}`);
  for (const name of t.economicState?.safetyProfile?.criminalInstitutions || []) {
    const house = liveInstitutions(t).find((h) => String(h?.name ?? '').toLowerCase() === String(name).toLowerCase());
    const mark = house ? rowMarkText(t, 'house', /** @type {never} */ (house)) : null;
    if (mark && criminalOpMark(t, name) !== mark) out.push(`8e.crime: ${name}`);
  }
  return out;
};

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR6-CRIME: crime and the force that keeps order have one reading', () => {
  test('(a) zero instances over the wide read\'s 150, rule by rule', () => {
    const failures = collectSeedFailures(WIDE, (seed) => {
      expect(instances(town(seed)), seed).toEqual([]);
    });
    expectNoSeedFailures(failures);
  }, 900_000);

  test('(b) the crime wave has ONE exported reading, and the vocabulary reads it', () => {
    const wave = { history: { currentTensions: [{ type: 'crime_wave', plotHooks: ['The crime wave is coordinated. Someone is directing it to create a pretext'] }] } };
    const calm = { history: { currentTensions: [{ type: 'famine' }] } };
    expect(crimeWaveShown, 'the display re-exports the fact').toBe(crimeWaveStands);
    expect([crimeWaveStands(wave), crimeWaveCoordinated(wave), crimeWaveStands(calm), crimeWaveCoordinated(calm)]).toEqual([true, true, false, false]);
    expect([atomHolds('crime wave', factsOf(/** @type {never} */ (wave))), atomHolds('crime wave', factsOf(/** @type {never} */ (calm)))]).toEqual([true, false]);
  });

  test('(c) the positive controls: each real row\'s stored line fires; the printed line is its twin', () => {
    // C131929 / C143085 (9a.structure): the stored Safe line's "limited foothold" beside an organised syndicate
    const m36 = town('bar0-metropolis-calm-rand-36');
    expect(criminalStructureKeyOf(m36)).toBe('organized');
    expect(m36.economicState.safetyProfile.safetyDesc, 'C131929: the draw is not moved').toMatch(LIMITED_ORG);
    expect(deriveSafetyLine(m36)).toContain('organized crime answers to one ring.');
    // a DM's own line is printed as written
    const edited = structuredClone(m36);
    applyUserEdit(edited, 'economicState.safetyProfile.safetyDesc', m36.economicState.safetyProfile.safetyDesc);
    expect(deriveSafetyLine(edited), 'a DM\'s own line').toBe(m36.economicState.safetyProfile.safetyDesc);
    // C154050 (9a.contested, HK1): the diffuse note beside the coordinated hook speaks of appearances
    // HOOKS-CURES-C2 step 6 (PAGE-12's ruling 13): reseated from bar0-thorp-calm-rand-34, whose stored hooks no longer hold
    // the coordinated line (the pool draws it by key, mixed since cure C); rand-8 is the first of thorp-calm 0..599 born
    // diffuse AND coordinated (14 of 600: 8, 28, 54, 115, 154, 182, 247, 310, 315, 347, 551, 552, 587, 594).
    const t8 = town('bar0-thorp-calm-rand-8');
    expect([criminalStructureKeyOf(t8), crimeWaveCoordinated(t8)]).toEqual(['diffuse', true]);
    expect(deriveCriminalStructure(t8)?.note).toBe(DIFFUSE_NOTE_COORDINATED);
    // C200637 (9a.watch): the stored guard line "exists on paper" beside a working rota watch
    const v28 = town('bar0-village-calm-rand-28');
    expect(v28.economicState.safetyProfile.guardEffectivenessDesc, 'C200637: the draw is not moved').toMatch(PAPER);
    expect(deriveGuardAssessment(v28)).toMatch(/^The local watch is thinly kept\b/);
    // C199950 (9a.militia): the Safe line beside a militia alone
    const v27 = town('bar0-village-calm-rand-27');
    expect(v27.economicState.safetyProfile.safetyDesc).toMatch(MILITIA_PRESENT);
    expect(deriveSafetyLine(v27)).toContain(MILITIA_TURNS_OUT);
    // C51048 (9a.pay, 10e-pay): "well paid" beside the commander's own pay cut
    // BORN UNDER LAW 1 (THE FLIP, CLOSE-6 F-JOIN-2, 2026-11-23; the chair's ruling on the STOP, the bar4 (e2) form): this control's
    // case, a person under arms saying the pay is cut beside a stored "well paid" guard line, is extinct lit: it holds on none of
    // 2,700 lit births searched (bar0-city-wartime-rand 0..899, and 0..199 of each other shape of the wide read: thorp-calm,
    // hamlet-calm, hamlet-under_siege, village-famine, village-calm, town-calm, town-occupied, city-under_siege+famine,
    // metropolis-calm). PLAUSIBLE, by reading: the fortune law's purse lifts the pay where it was cut, so the pay-cut card and the
    // well-paid line no longer meet. Under both laws at 1 the city is the one the row was read on. The other controls stay lit.
    const w31 = generateSettlementPipeline({ ...cfgFor('bar0-city-wartime-rand-31'), _seatLawVersion: 1, _fortuneLawVersion: 1 }, null, { seed: 'bar0-city-wartime-rand-31', customContent: {} });
    expect(orderForceOf(w31).payCut, 'C51048: a person under arms says the pay is cut').toBe(true);
    expect(w31.economicState.safetyProfile.guardEffectivenessDesc).toMatch(WELL_PAID);
    expect(deriveGuardAssessment(w31)).toContain('though the pay for keeping order is being cut');
    // C203044 (6d-paid): "present and paid" where only volunteers stand
    const v31 = town('bar0-village-calm-rand-31');
    expect(FUNDED_EMBATTLED_SHOWN).toBe(FUNDED_EMBATTLED);
    expect((v31.structuralViolations || []).some((v) => String(v?.reason).startsWith(FUNDED_EMBATTLED)), 'C203044: the stored reason').toBe(true);
    expect(orderForceOf(v31).volunteers).toBe(true);
    expect(deriveDefenseVulnerabilities(v31).map((v) => String(v.reason)).find((r) => r.startsWith('Embattled region.'))).toMatch(/^Embattled region\. Fortification is kept and volunteers turn out\b/);
    // C8633 (8e.crime): the smuggling network listed under a siege takes its card's mark
    const s30 = town('bar0-city-under_siege+famine-rand-30');
    expect(criminalOpMark(s30, 'Smuggling Network')).toBe('Stopped by the siege.');
    // C43177 (9a.wave): the ring's "keeps the streets quiet" is refused beside a crime wave; the table's note prints
    const w28 = town('bar0-city-wartime-rand-28');
    expect([crimeWaveStands(w28), criminalStructureKeyOf(w28)]).toEqual([true, 'organized']);
    expect(deriveCriminalStructure(w28)?.note).toMatch(/^One criminal ring decides what crime is allowed here\./);
  }, 600_000);

  test('(d) KEEP: where the fact does not refuse the line, the drawn line prints as drawn', () => {
    const quiet = { history: { currentTensions: [] }, institutions: [{ name: 'Garrison' }], npcs: [] };
    for (const line of ['Crime exists but is well-managed. The garrison is present and responsive. Petty theft is the primary risk; organized crime has found no foothold.',
      'The garrison is well paid, well equipped and patrols properly. They come when called, and though some take bribes, it is not the custom.']) {
      expect(guardLineUnderTheForce(line, quiet), line).toBe(line);
    }
    expect(safetyLineAsPrinted('Petty theft is the primary risk; organized crime has found no foothold.', quiet)).toBe('Petty theft is the primary risk; organized crime has found no foothold.');
  });
});
