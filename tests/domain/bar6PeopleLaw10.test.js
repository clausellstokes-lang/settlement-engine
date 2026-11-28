// THE GUARD OF BAR6-PEOPLE (BRIEF-BAR6, amendment L4 of BRIEF-BAR5 as BRIEF-BAR6 keeps it, 2026-11-16): A PERSON'S LINES READ THE
// HOUSE AND THE ROSTER. Six rules of the two auditors' laws (BAR6-AUDIT-F, LAW 10; BAR6-AUDIT-D, LAW 8):
//   10a        nobody answers to a power whose seat (rank 1) he holds (C179090, C179117, C179288);
//   10c        a face's honorific is never another person's roster title (the owner's pin M-1b; C196525 "Wharfinger");
//   10d-seat   a tie never asks for a seat its asker holds (C66115); 10d-purse no yearly borrowing beside a yearly surplus
//              (C66113: no tie line of the estate says the treasury borrows every year);
//   10e-temper a secret never denies its holder's temperament: incorruptible against a bribe, honest and plain-dealing
//              against a lie of one's own (C31450); 10e-house a secret of drawn pay needs a paid watch (C200774);
//   8b.person  a person's own trade line reads the person's house's mark (C88140, C93688).
//   LEFT-MARKS item 2 (L15; the sixth chair's BRIEF-LEFT, 2026-11-17; ruling CM1): THE PAGE FORM (`law8.mjs :: 8b.person`)
//              learns the card's mark line: a card that prints its house's mark as a line of its own under the house line
//              covers its person lines (it fired on such a card at the base, e0242a12a); `law8H.mjs :: readPersons`' title
//              is the line after the mark line. The pair below on a constructed page.
// THE DETECTORS are the auditors' own where they read the record (`tests/helpers/pageLaws/law10.mjs :: law10a, law10d, law10e`,
// record-only: no tab handed, so every instance is the record's), and for the three the record cannot show alone, a reading
// of the roster and the house by its own words here, never by the fact the cure made (so a fact gone wrong cannot certify
// itself): the honorific the card prints (`seatKeeperDisplay.js :: shownHonorificOf`) against the other cards' titles; the
// village's own rota by its catalogue name; the house's mark as the Institutions tab prints it (`rowMarkText`) against the
// card's "How they deal". Over the census's 720 (CENSUS-3 seeds.txt's rule, born in seedcfg.mjs's shape) they find NOTHING;
// on records made from the read's own rows they MUST fire: they cannot go blind.
// The counts before and after over the 150, the 720 and the fresh 300 (the auditors' runners over the census's dumps) are in
// docs/chair/2026-11-16/bar6/BAR6-PEOPLE-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law10a, law10d, law10e } from '../helpers/pageLaws/law10.mjs';
import { shownHonorificOf } from '../../src/domain/people/seatKeeperDisplay.js';
import { rowMarkText } from '../../src/domain/display/crisisStoppedRow.js';
import { dealingShown, houseMarkShown } from '../../src/components/new/npcComponents.jsx';
import { assignHandlers } from '../../src/domain/people/allegiance.js';
import { temperamentYieldsToSecret } from '../../src/data/npcData.js';
import { honorificOfTitle, ownOfficeForms, FACE_HONORIFICS, FACE_HONORIFICS_INLAND, FACE_HONORIFICS_BY_CULTURE } from '../../src/data/faceHonorifics.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { readTown } from '../helpers/pageLaws/pageB.mjs';
import { law8 } from '../helpers/pageLaws/law8.mjs';
import { readPersons } from '../helpers/pageLaws/law8H.mjs';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CRISES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset',
  'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720, by its own rule. */
const SEEDS = [
  ...SIZES.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...CRISES.flatMap((crisis) => SIZES.flatMap((size) => Array.from({ length: 4 }, (_, i) => `r2s-${crisis}-${size}-${i}`))),
];

/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

// ── THE THREE READINGS OF THIS GUARD'S OWN (the roster and the house by their own words) ──
/** A title folded: no article, lower case, letters only. @param {unknown} t */
const squash = (t) => String(t ?? '').toLowerCase().replace(/^(the|a|an) /, '').replace(/[^a-z]/g, '');

/** 10c: the card's printed honorific that is ANOTHER person's roster title, and no looser name for the card's own. @param {any} town */
export function honorificFindings(town) {
  const npcs = Array.isArray(town?.npcs) ? town.npcs : [];
  /** @type {string[]} */ const out = [];
  for (const n of npcs) {
    const h = shownHonorificOf(n, town);
    if (!h) continue;
    const own = squash(n.title); const t = squash(h);
    if (!t || t === own || own.includes(t) || t.includes(own)) continue;
    const others = npcs.filter((o) => o !== n && squash(o.title) === t);
    if (others.length) out.push(`${n.name} (${n.title}) printed "${h}", the title of ${others.map((o) => o.name).join(', ')}`);
  }
  return out;
}

/** The village's own unpaid rota is the whole watch: every watch house is a "Village watch", no garrison. @param {any} town */
const unpaidRotaOnly = (town) => {
  const names = (Array.isArray(town?.institutions) ? town.institutions : []).map((/** @type {any} */ i) => String(i?.name || '').trim());
  const watches = names.filter((n) => /\bwatch\b/i.test(n));
  return watches.length > 0 && watches.every((n) => /^village watch$/i.test(n)) && !names.some((n) => /garrison|barracks|citadel|castle/i.test(n));
};
/** 10e-house: a secret of pay drawn for a watch where the unpaid rota is the whole watch. @param {any} town */
export function drawnPayFindings(town) {
  if (!unpaidRotaOnly(town)) return [];
  return (Array.isArray(town?.npcs) ? town.npcs : []).filter((/** @type {any} */ n) => /\bdraws pay\b|\bnames that never\b/i.test(String(n?.secret?.what || '')))
    .map((/** @type {any} */ n) => `${n.name}: "${n.secret.what}" beside a watch nobody is paid for`);
}

/** A line that offers a trade (the audit's detector's verbs: `law8.mjs :: 8b.person`). */
const SELLS = /\b(sells?|will sell|will grind|will mix|deals in|rents)\b/i;
/**
 * 8b.person: a card's trade line, as the card prints it, bare beside its house's mark.
 * RE-KEYED BY IDENTITY (BAR7-CARDS, 2026-11-17; the chair's ruling CM1): the same people (a keeper of a marked house whose
 * line offers the trade), the same claim (the card carries the house's mark), the form kept. The mark is no longer set in
 * front of "How they deal" (every reader of the sixth read read that form as broken); it is the card's own line under the
 * house line (`npcComponents.jsx :: houseMarkShown`), so the finding is a card whose mark line is not the leaf's mark.
 * @param {any} town
 */
export function dealingFindings(town) {
  const roster = Array.isArray(town?.institutions) ? town.institutions : [];
  /** @type {string[]} */ const out = [];
  for (const n of Array.isArray(town?.npcs) ? town.npcs : []) {
    const raw = String(n?.presentation?.behaviour || '');
    if (!SELLS.test(raw) || n?.institution?.kind !== 'house') continue;
    const house = roster.find((/** @type {any} */ r) => r?.name === n.institution.key);
    const mark = house ? rowMarkText(town, 'house', house) : null;
    if (!mark) continue;
    const shown = houseMarkShown(n, town);
    if (shown !== mark) out.push(`${n.name} (${house.name}, marked "${mark}"): card's mark line "${shown}" beside "${dealingShown(n, town)}"`);
  }
  return out;
}

/** @param {any} town */
const recordFindings = (town) => [
  ...law10a({ record: town, tabs: {}, town: '' }),
  ...law10d({ record: town, tabs: {}, town: '' }).filter((x) => x.rule === '10d-seat'),
  ...law10e({ record: town, tabs: {}, town: '' }).filter((x) => x.rule === '10e-temper' || x.rule === '10e-temper-honest'),
].map((x) => `${x.rule}: ${x.line.slice(0, 160)} (${x.why})`);
/** 10d-purse, in the estate: no tie says the treasury borrows every year. @param {any} town */
const yearlyBorrowing = (town) => (Array.isArray(town?.relationships) ? town.relationships : [])
  .flatMap((/** @type {any} */ t) => [t?.description, t?.tension]).filter((s) => /\btreasury borrowed\b.*\bevery year since\b/i.test(String(s || '')));

/** @type {Map<string, any>} */
const BORN = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 1800000);

describe('BAR6-PEOPLE: a person\'s lines read the house and the roster', () => {
  it('the census\'s 720 are 720', () => {
    expect(SEEDS.length).toBe(720);
    expect(new Set(SEEDS).size).toBe(720);
  });

  it('the six rules find no instance in any of the 720 (a finding names the rule, the line and the state)', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const town = BORN.get(seed);
      if (!town) throw new Error(`${seed}: not born`);
      const found = [...recordFindings(town), ...honorificFindings(town), ...drawnPayFindings(town), ...dealingFindings(town),
        ...yearlyBorrowing(town).map((s) => `10d-purse: ${s}`)];
      if (found.length) throw new Error(found.join(' | '));
    });
    expectNoSeedFailures(failures, 'BAR6-PEOPLE (LAW 8 8b.person; LAW 10 10a 10c 10d 10e) over the census 720');
  });

  it('POSITIVE CONTROL 10a (C179090): a head whose allegiance names the power he heads fires; the handlers\' pass withdraws it', () => {
    const sabir = { id: 'n1', name: 'Sabir al-Ghazali', memberships: [{ power: 'Corrupt Council', rank: 1, share: 1, veiled: true }],
      allegiance: { power: 'Corrupt Council', house: 'Thieves guild', vector: 'greed', via: 'office', handler: null, share: 0.2, veiled: true, covert: true } };
    const rania = { id: 'n2', name: 'Rania al-Basri', memberships: [{ power: 'Corrupt Council', rank: 3, share: 1, veiled: true }] };
    const record = { npcs: [sabir, rania] };
    expect(law10a({ record, tabs: {}, town: 'C179090' }).map((x) => x.rule)).toEqual(['10a']);
    assignHandlers(record.npcs, { institutions: [], powerStructure: { factions: [{ faction: 'Corrupt Council', category: 'criminal' }] } });
    expect(law10a({ record, tabs: {}, town: 'C179090' })).toHaveLength(0);
    expect('allegiance' in sabir).toBe(false);
    expect(rania.memberships[0].rank).toBe(3); // the ranks stand: only the allegiance goes
  });

  it('POSITIVE CONTROL 10c (C196525): the inland harbour master styled "Wharfinger" beside the wharfinger fires; the pool now refuses it', () => {
    const base = BORN.get('r2r-town-0');
    const madhuri = { id: 'h1', name: 'Madhuri Rao', gender: 'female', title: 'the harbour master', institution: { kind: 'house', key: "Harbour master's office", name: "Harbour master's office", title: 'the harbour master' } };
    const varun = { id: 'w1', name: 'Varun Mukherjee', gender: 'male', title: 'the wharfinger', institution: { kind: 'house', key: 'Docks/port facilities', name: 'Docks/port facilities', title: 'the wharfinger' } };
    const forced = { ...base, npcs: [{ ...madhuri, title: 'the harbour master' }, varun] };
    // the detector on a card that prints another's title: fed the line as the base printed it
    const found = (/** @type {string} */ h) => forced.npcs.filter((o) => o !== forced.npcs[0] && squash(o.title) === squash(h)).length;
    expect(found('Wharfinger')).toBe(1);
    // the cure: no seed of an inland harbour master draws the wharfinger's name; the dock's own stands
    const shown = new Set(Array.from({ length: 200 }, (_, i) => honorificOfTitle('the harbour master', 'female', `c${i}::Harbour master's office`, { coastal: false })));
    expect([...shown]).toEqual(['Dockmaster']);
    expect(honorificOfTitle('the wharfinger', 'male', 'w1::Docks/port facilities', { coastal: false })).toMatch(/^Wharf/);
  });

  it('the honorific pools: a form that names another office is refused, a looser name for the own office stands; no pool is left empty', () => {
    expect(ownOfficeForms('the harbour master', FACE_HONORIFICS_INLAND['the harbour master'])).toEqual(['Dockmaster']);
    expect(ownOfficeForms('the garrison commander', FACE_HONORIFICS['the garrison commander'])).toEqual(FACE_HONORIFICS['the garrison commander']);
    for (const table of [FACE_HONORIFICS, FACE_HONORIFICS_INLAND, ...Object.values(FACE_HONORIFICS_BY_CULTURE)]) {
      for (const [title, pool] of Object.entries(table)) expect(ownOfficeForms(title, pool).length, title).toBeGreaterThan(0);
    }
  });

  it('POSITIVE CONTROL 10d-seat (C66115): a lender who sits on the governing council asking for a seat fires; the line declares it', () => {
    const gov = { id: 'g', name: "Clíodhna O'Dwyer", category: 'government', memberships: [{ power: 'Merchant City Council', rank: 1, veiled: false }] };
    const lender = { id: 'e', name: "Tlachtga O'Meara", category: 'economy', memberships: [{ power: 'Merchant City Council', rank: null, veiled: false }] };
    const record = { npcs: [gov, lender], powerStructure: { factions: [{ faction: 'Merchant City Council', isGoverning: true }] },
      relationships: [{ from: 'g', to: 'e', npc1Name: gov.name, npc2Name: lender.name, description: '',
        tension: "Tlachtga O'Meara has asked for a seat on the council as a condition of the next loan. Clíodhna O'Dwyer has three weeks to answer." }] };
    expect(law10d({ record, tabs: {}, town: 'C66115' }).map((x) => x.rule)).toEqual(['10d-seat']);
    const facts = factsOf(record);
    expect(declarationAdmits(declarationOf({ needs: [], excludes: ['seat held'] }), facts, { ctx: { pair: [gov, lender] } }).admitted).toBe(false);
    const outsider = { ...lender, memberships: [] };
    expect(declarationAdmits(declarationOf({ needs: [], excludes: ['seat held'] }), factsOf({ ...record, npcs: [gov, outsider] }), { ctx: { pair: [gov, outsider] } }).admitted).toBe(true);
  });

  it('POSITIVE CONTROL 10e-temper (C31450): an incorruptible card paid to lose evidence fires; the temperament yields to its secret', () => {
    const uinal = { id: 'u', name: 'Uinal Pech', personality: { dominant: 'incorruptible', flaw: null },
      secret: { what: 'Has documentation proving the famine was made worse by decisions taken by Religious Authorities, and has been paid to lose it' } };
    const record = { npcs: [uinal] };
    expect(law10e({ record, tabs: {}, town: 'C31450' }).map((x) => x.rule)).toEqual(['10e-temper']);
    temperamentYieldsToSecret(uinal);
    expect(uinal.personality.dominant).not.toBe('incorruptible');
    expect(typeof uinal.personality.dominant).toBe('string');
    expect(law10e({ record, tabs: {}, town: 'C31450' })).toHaveLength(0);
    // a secret the holder only knows of is no lie of theirs: an honest card keeps its word
    const knower = { personality: { dominant: 'honest', flaw: null }, secret: { what: 'Knows the deed of the mill was forged' } };
    expect(temperamentYieldsToSecret(knower).personality.dominant).toBe('honest');
  });

  it('POSITIVE CONTROL 10e-house (C200774): pay drawn for padded names beside the unpaid rota fires; the secret declares a paid watch', () => {
    const town = { institutions: [{ name: 'Village watch' }, { name: 'Dwellings (1-8)' }],
      npcs: [{ name: 'Valdis Andersson', secret: { what: 'Keeps the night roster short and draws pay for names that never walk it' } }] };
    expect(drawnPayFindings(town)).toHaveLength(1);
    expect(declarationAdmits(declarationOf({ needs: ['paid watch'], excludes: [] }), factsOf(town)).admitted).toBe(false);
    expect(declarationAdmits(declarationOf({ needs: ['paid watch'], excludes: [] }), factsOf({ ...town, institutions: [{ name: 'Town watch' }] })).admitted).toBe(true);
  });

  it('8b.person, THE PAGE FORM (LEFT-MARKS item 2, ruling CM1): a keeper\'s card with the house\'s mark line is covered; the same card without it fires', () => {
    const dump = (/** @type {boolean} */ mark) => ['== Systems/Institutions ==', 'Tanners · Crafts', 'Short of hides.', 'Works hides into leather.',
      '== World/NPCs ==', 'Ada Brennan●', '▲', 'Tanners · member of the Merchant Guild', ...(mark ? ['Short of hides.'] : []), 'Master Tanner',
      'How they deal Sells good leather at a fair price; no credit.', ''].join('\n');
    const person = (/** @type {boolean} */ mark) => { const T = readTown(dump(mark), { institutions: [{ name: 'Tanners' }], config: {} });
      return { found: law8(T, 'constructed').filter((/** @type {any} */ i) => i.rule === '8b.person').length, title: readPersons(T)[0]?.title }; };
    expect(person(false), 'the card without its house\'s mark line').toEqual({ found: 1, title: 'Master Tanner' });
    expect(person(true), 'the card with its house\'s mark line under the house line').toEqual({ found: 0, title: 'Master Tanner' });
  });

  it('POSITIVE CONTROL 8b.person (C88140): a dairy short of livestock whose farmer sells milk bare fires; the card leads with the mark', () => {
    const town = [...BORN.values()].find((t) => (t?.npcs || []).some((/** @type {any} */ n) => SELLS.test(String(n?.presentation?.behaviour || ''))
      && n?.institution?.kind === 'house' && (t.institutions || []).some((/** @type {any} */ r) => r?.name === n.institution.key && rowMarkText(t, 'house', r))));
    expect(town).toBeTruthy();
    const npc = town.npcs.find((/** @type {any} */ n) => SELLS.test(String(n?.presentation?.behaviour || '')) && n?.institution?.kind === 'house'
      && (town.institutions || []).some((/** @type {any} */ r) => r?.name === n.institution.key && rowMarkText(town, 'house', r)));
    const house = town.institutions.find((/** @type {any} */ r) => r?.name === npc.institution.key);
    const mark = rowMarkText(town, 'house', house);
    // RE-KEYED BY IDENTITY (BAR7-CARDS, 2026-11-17; ruling CM1): the card leads with the mark as its own line under the
    // house line, and the person's sentence prints as written (before: the mark set in front of the sentence).
    expect(houseMarkShown(npc, town)).toBe(mark);
    expect(dealingShown(npc, town)).toBe(npc.presentation.behaviour.trim());
    // the line as the base printed it (bare) is what the detector finds
    expect(npc.presentation.behaviour.trim().startsWith(String(mark))).toBe(false);
  });
});
