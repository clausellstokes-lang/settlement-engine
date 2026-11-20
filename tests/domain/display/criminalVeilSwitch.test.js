/**
 * criminalVeilSwitch.test.js — "Hide everything criminal" (the chair's ruling VS1, 2026-11-19).
 *
 * Read on the PROJECTION a visitor gets, not on the delta list: twelve births (two per tier,
 * named seeds, seven of them carrying a criminal house or a criminal faction), each projected
 * twice (a plain share and a "Reveal DM content" share, the one that carries people's
 * corruption), through galleryPayloadFor and applyVeil, with a hand draft on other addresses
 * (plot hooks shown, rumors' truth shown) and one criminal eye opened.
 *
 * (a) hide all: none of the family's content reaches the visitor;
 * (b) show all: all of the family's content the unveiled projection carries reaches the visitor;
 * (c) both leave every other part of the copy byte-equal to the copy before the click, and the
 *     hand deltas survive;
 * (d) hide, show, hide returns the delta list to exactly what the first hide wrote;
 * (e) show all resolves to the same hidden set as opening, by hand, every family eye the Curate
 *     screen OFFERS for that copy (curateModelFor's model, iterated to a fixed point: an eye under
 *     a house hidden whole is drawn once the house is opened);
 * (f) the classification walk: every default class defaultVeilFor can produce, read live from
 *     its tables, is in the family or in NOT_CRIMINAL, never both;
 * (g) A SWITCH SETS ONLY WHAT A HAND CAN SEE AND UNDO ON THAT RECORD (the seventh chair's ruling
 *     VR34, 2026-11-20, from the security reader's V10-2; vetoable by the owner): every address hide
 *     and show write is one the screen offers for that copy.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import {
  CARD_KINDS, DEFAULT_VEIL_RULES, applyVeil, curateModelFor, defaultVeilFor, galleryPayloadFor, isAddressHidden, parseVeilAddress, resolveVeil,
  toggleVeilDelta,
} from '../../../src/domain/display/galleryVeil.js';
import {
  CRIMINAL_VEIL_CLASSES, NOT_CRIMINAL, criminalPartsOf, criminalSwitchStateOf, flipCriminalVeil, presentCriminalGroupings, setCriminalVeil,
} from '../../../src/domain/display/criminalVeilSwitch.js';
// VR46, THE GUARD RULING (VEIL-22, R4-CURE 3; the chair's, no veto): VR10 re-keys every person id on every projection (one salt a
// projection call), so (b) and (c), which compared served copies byte-for-byte, read them MODULO THE PROJECTION'S PERSON-ID
// BIJECTION and nothing else; a stored person id served anywhere still reds.
import { bijectionTeeth, canonPeople, storedIdsServed, unkeyPeople } from '../../security/personIdBijection.shared.mjs';

/** The births: two per tier. Seven carry a criminal house or faction (measured 2026-11-19 on 1f501779b). */
const SEEDS = Object.freeze([
  { seed: 'vs-thorp-0', tier: 'thorp' }, { seed: 'vs-thorp-3', tier: 'thorp' },
  { seed: 'vs-hamlet-0', tier: 'hamlet' }, { seed: 'vs-hamlet-1', tier: 'hamlet' },
  { seed: 'vs-village-0', tier: 'village' }, { seed: 'vs-village-2', tier: 'village' },
  { seed: 'vs-town-0', tier: 'town' }, { seed: 'vs-town-2', tier: 'town' },
  { seed: 'vs-city-0', tier: 'city' }, { seed: 'vs-city-1', tier: 'city' },
  { seed: 'vs-metropolis-0', tier: 'metropolis' }, { seed: 'vs-metropolis-1', tier: 'metropolis' },
]);
const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
const HOUSE_CLASSES = new Set(['covert-brokerage', 'clandestine-institution', 'criminal-institution']);
const FACTION_DEPTH_KEYS = ['desc', 'description', 'crisisNote', 'goals', 'goal', 'agenda', 'conflicts', 'members'];
const CORRUPTION_KEYS = CARD_KINDS.npc.fields.corruption;

/** The counts, for the hand-back (the runner's console is muted): only when VS_TALLY names a file. */
const writeTally = (t) => { if (process.env.VS_TALLY) writeFileSync(process.env.VS_TALLY, JSON.stringify(t)); };
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
const dropHooks = (v) => (Array.isArray(v) ? v.map(dropHooks)
  : isRec(v) ? Object.fromEntries(Object.entries(v).filter(([k]) => !/hook/i.test(k)).map(([k, c]) => [k, dropHooks(c)])) : v);
const npcsOf = (s) => [...recs(s.npcs), ...recs(s.powerStructure?.factions).flatMap(f => recs(f.members)), ...recs(s.factions).flatMap(f => recs(f.members))];
const factionsOf = (s) => [...recs(s.powerStructure?.factions), ...recs(s.factions)];

/** Every address the Curate screen draws an eye or a row for, read off the model as CurateMode draws it (this test's own reading). */
const screenOffers = (model) => new Set(model.sections.flatMap(sec => [...sec.groupings, ...sec.switches,
  ...sec.cards.flatMap(c => [...(c.whole ? [c.whole] : []), ...c.eyes])]).map(e => e.address));
/**
 * Is an address in the criminal family? Read from the defaults' classes, independently of the switch: a family default,
 * an eye of a criminal house or of a criminal faction (capture aside: the capture reading owns it), a person's corruption.
 */
function familyPredicate(defaults) {
  const FAMILY = new Set(CRIMINAL_VEIL_CLASSES);
  const fam = defaults.filter(d => FAMILY.has(d.cls));
  const own = new Set(fam.map(d => d.address));
  const houses = new Set(fam.filter(d => d.address.startsWith('card:institution:')).map(d => d.address.slice('card:institution:'.length)));
  const factions = new Set(fam.map(d => parseVeilAddress(d.address)).filter(p => p?.type === 'field' && p.kind === 'faction').map(p => p.id));
  return (a) => {
    if (own.has(a)) return true;
    const p = parseVeilAddress(a);
    if (p?.type !== 'field') return false;
    return (p.kind === 'institution' && houses.has(p.id)) || (p.kind === 'faction' && factions.has(p.id) && p.field !== 'capture')
      || (p.kind === 'npc' && p.field === 'corruption');
  };
}
/** Toggle, by hand, every offered eye the predicate keeps that is not yet in the wanted state, to a fixed point. */
function byHand(payload, defaults, start, keep, hidden) {
  let d = [...start];
  for (let i = 0; i < 6; i += 1) {
    let moved = false;
    for (const sec of curateModelFor(payload, d).sections) {
      for (const e of [...sec.groupings, ...sec.switches, ...sec.cards.flatMap(c => [...(c.whole ? [c.whole] : []), ...c.eyes])]) {
        if (!keep(e.address) || e.hidden === hidden) continue;
        d = toggleVeilDelta(d, e.address, defaults); moved = true;
      }
    }
    if (!moved) break;
  }
  return d;
}

/** The family's content in a copy, item by item, read against the town's own criminal houses and factions. */
function familyContent(copy, defaults) {
  const houseIds = new Set(defaults.filter(d => HOUSE_CLASSES.has(d.cls) && d.address.startsWith('card:institution:')).map(d => d.address.slice('card:institution:'.length)));
  const factionIds = new Set(defaults.filter(d => d.cls === 'criminal-faction').map(d => d.address.split(':')[2]));
  const houses = recs(copy.institutions).filter(i => houseIds.has(CARD_KINDS.institution.idOf(i)));
  const names = new Set(houses.map(h => h.name).filter(Boolean));
  const av = isRec(copy.availableServices) ? copy.availableServices : {};
  const sp = copy.economicState?.safetyProfile || {};
  const ps = isRec(copy.powerStructure) ? copy.powerStructure : {};
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const h of houses) out[`house ${CARD_KINDS.institution.idOf(h)}`] = dropHooks(h);
  if (av.criminal !== undefined) out['criminal services'] = av.criminal;
  Object.entries(av).forEach(([cat, rows]) => recs(rows).forEach((r, i) => { if (names.has(r.institution)) out[`service ${cat}.${i}`] = r; }));
  for (const k of ['criminalInstitutions', 'crimeTypes', 'blackMarketCapture']) if (sp[k] !== undefined) out[`safety ${k}`] = sp[k];
  recs(copy.economicState?.incomeSources).forEach((r, i) => { if (r.isCriminal === true) out[`income ${i}`] = r; });
  if (ps.criminalCaptureState !== undefined) out['capture state'] = ps.criminalCaptureState;
  recs(ps.factions).forEach((f, i) => { if (f.captureState !== undefined) out[`faction capture ${i}`] = f.captureState; });
  recs(ps.factionRelationships).forEach((p, i) => { if (p.captureState !== undefined) out[`pair capture ${i}`] = p.captureState; });
  factionsOf(copy).forEach((f, i) => {
    if (!factionIds.has(CARD_KINDS.faction.idOf(f))) return;
    for (const k of FACTION_DEPTH_KEYS) {
      if (f[k] === undefined) continue;
      out[`faction ${i} ${k}`] = k === 'members' ? recs(f[k]).map(m => m.name) : dropHooks(f[k]);
    }
  });
  npcsOf(copy).forEach((n, i) => {
    for (const k of CORRUPTION_KEYS) if (n[k] !== undefined) out[`person ${i} ${k}`] = n[k];
    if (names.has(typeof n.institution === 'string' ? n.institution : n.institution?.key)) out[`person ${i} house`] = n.institution;
  });
  return out;
}

describe('(f) the classification walk: every default class is classified on purpose', () => {
  it('every class defaultVeilFor can produce is in exactly one list, and no list names a class that does not exist', () => {
    // Read live: the static groupings are every entry of an empty town's default; the rules are exported.
    const staticClasses = defaultVeilFor({}).map(d => d.cls);
    const ruleClasses = DEFAULT_VEIL_RULES.map(r => r.cls);
    expect(staticClasses.length, 'the static groupings must be read, or the walk proves nothing').toBeGreaterThan(0);
    expect(ruleClasses.length).toBeGreaterThan(0);
    const live = new Set([...staticClasses, ...ruleClasses]);
    const unclassified = [...live].filter(c => !CRIMINAL_VEIL_CLASSES.includes(c) && !NOT_CRIMINAL.includes(c));
    expect(unclassified, 'a new default class: put it in CRIMINAL_VEIL_CLASSES or NOT_CRIMINAL').toEqual([]);
    expect(CRIMINAL_VEIL_CLASSES.filter(c => NOT_CRIMINAL.includes(c))).toEqual([]);
    expect([...CRIMINAL_VEIL_CLASSES, ...NOT_CRIMINAL].filter(c => !live.has(c)), 'a listed class no default produces').toEqual([]);
    expect(Object.isFrozen(CRIMINAL_VEIL_CLASSES) && Object.isFrozen(NOT_CRIMINAL)).toBe(true);
  });
});

describe('the switch over a hand-made town', () => {
  // Ada is the den's fence, in the people car's shape (`institution: { kind: 'house', key }`): the screen offers the den's
  // People eye BY IDENTITY (the house the applier reads, galleryVeil.js :: npcHouseOf), so the switch covers it.
  const den = { kind: 'house', key: "Thieves' den", title: 'the fence', veiled: true };
  const town = {
    name: 'Redwick', tier: 'town',
    institutions: [
      { id: 'inst-den', name: "Thieves' den", category: 'Criminal', desc: 'A den.' },
      { id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' },
    ],
    npcs: [{ id: 'n1', name: 'Ada', role: 'Fence', corrupt: true, corruptionVector: 'bribes', secret: 'Owes the den.', institution: den }],
    powerStructure: { factions: [{ faction: 'Red hand', category: 'criminal', goals: 'Docks.', members: [] }] },
  };
  const defaults = defaultVeilFor(town);
  const model = curateModelFor(town, []);

  it('a fresh share reads hidden; one criminal eye opened reads partly; hide and show set every part', () => {
    expect(criminalSwitchStateOf(defaults, [], undefined, model)).toBe('hidden');
    const opened = toggleVeilDelta([], 'block:services.criminal', defaults);
    expect(criminalSwitchStateOf(defaults, opened, undefined, model)).toBe('partly');
    const hidden = flipCriminalVeil(opened, defaults, undefined, model);
    expect(hidden).toEqual([]);
    const shown = flipCriminalVeil(hidden, defaults, undefined, model);
    expect(criminalSwitchStateOf(defaults, shown, undefined, model)).toBe('shown');
    const now = resolveVeil(defaults, shown);
    for (const a of criminalPartsOf(defaults, shown, undefined, model)) expect(isAddressHidden(now, a), a).toBe(false);
    expect(isAddressHidden(now, 'class:npc:secret'), 'a secret is not criminal: it stays hidden').toBe(true);
  });

  it('a person corruption exception and a house eye fall under the family; a whole-person hide is never touched', () => {
    const hand = [{ address: 'field:npc:n1:corruption', hidden: false }, { address: 'field:institution:inst-den:people', hidden: true },
      { address: 'card:npc:n1', hidden: true }, { address: 'class:npc:secret', hidden: false }];
    const parts = criminalPartsOf(defaults, hand, undefined, model);
    expect(parts).toContain('field:npc:n1:corruption');
    expect(parts).toContain('field:institution:inst-den:people');
    const hidden = setCriminalVeil(hand, defaults, true, undefined, model);
    expect(hidden).toEqual([{ address: 'card:npc:n1', hidden: true }, { address: 'class:npc:secret', hidden: false }]);
    expect(setCriminalVeil(setCriminalVeil(hidden, defaults, false, undefined, model), defaults, true, undefined, model)).toEqual(hidden);
  });

  it('VR34 (b): the screen offers a house\'s People eye by identity in BOTH stored shapes, and only where someone is its person', () => {
    const peopleEye = (t) => curateModelFor(t, []).sections.flatMap(sec => sec.cards).find(c => c.id === 'inst-den')?.eyes.find(e => e.field === 'people');
    expect(peopleEye(town), 'the people car\'s shape: institution { kind: house, key }').toBeTruthy();
    const master = { ...town, npcs: town.npcs.map(n => ({ ...n, institution: "Thieves' den" })) };
    expect(peopleEye(master), "master's stored shape: institution as the house's name").toBeTruthy();
    const nobody = { ...town, npcs: town.npcs.map(({ institution, ...n }) => n) };
    expect(peopleEye(nobody), 'no person of the house: no eye (the eye governs nothing)').toBeUndefined();
  });

  it('VR34 (a)(c): the switch writes only what the screen offers; a stale family delta no hand can reach is dropped by a flip', () => {
    // Nobody is the den's person and the Red hand carries no members, conflicts or description: those eyes are not drawn.
    const nobody = { ...town, npcs: town.npcs.map(({ institution, ...n }) => n) };
    const d = defaultVeilFor(nobody);
    const m = curateModelFor(nobody, []);
    const offers = screenOffers(m);
    const hand = CARD_KINDS.faction.idOf(nobody.powerStructure.factions[0]);
    const shown = setCriminalVeil([], d, false, undefined, m);
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.filter(x => !offers.has(x.address)), 'show all wrote an address no hand can reach').toEqual([]);
    expect(shown.map(x => x.address)).not.toContain('field:institution:inst-den:people');
    expect(shown.map(x => x.address)).not.toContain(`field:faction:${hand}:members`);
    // An earlier Show-all's stale writes on unreachable addresses: a flip drops them (both directions), and the state reads
    // only what the screen offers.
    const stale = [{ address: 'field:institution:inst-den:people', hidden: false }, { address: `field:faction:${hand}:conflicts`, hidden: false }];
    expect(criminalSwitchStateOf(d, [...stale, ...shown], undefined, m)).toBe('shown');
    const hidden = flipCriminalVeil([...stale, ...shown], d, undefined, m);
    expect(hidden).toEqual([]);
    expect(setCriminalVeil(stale, d, false, undefined, m)).toEqual(shown);
  });

  it("VR34 (b): a power's members carried only on master's top-level list are offered and covered", () => {
    // master's stored shape: `factions[]` at the top level carries the roster that `powerStructure.factions` lacks.
    const master = { ...town, powerStructure: { factions: [{ faction: 'Red hand', name: 'Red hand', category: 'criminal', goals: 'Docks.' }] },
      factions: [{ name: 'Red hand', dominantCategory: 'criminal', members: [{ id: 'n1', name: 'Ada', role: 'Fence' }] }] };
    const m = curateModelFor(master, []);
    const offers = screenOffers(m);
    const id = CARD_KINDS.faction.idOf(master.powerStructure.factions[0]);
    expect(offers.has(`field:faction:${id}:members`), 'the members eye on the power whose roster sits on the other list').toBe(true);
    expect(offers.has('class:faction:members'), "the Powers' members switch, usable").toBe(true);
    const d = defaultVeilFor(master);
    expect(setCriminalVeil([], d, false, undefined, m)).toContainEqual({ address: `field:faction:${id}:members`, hidden: false });
    const shut = applyVeil(master, resolveVeil(d, []));
    expect(shut.factions[0].members, 'the default shuts it on every copy').toBeUndefined();
  });

  it('a town with no criminal part reads none and a flip changes nothing (the static groupings count only over content)', () => {
    const plain = { name: 'Quietford', tier: 'hamlet', institutions: [{ id: 'inst-mill', name: 'Mill', category: 'Economy' }] };
    const d = defaultVeilFor(plain);
    const m = curateModelFor(plain, []);
    const present = presentCriminalGroupings(plain);
    expect([...present]).toEqual([]);
    expect(criminalPartsOf(d, [], present, m)).toEqual([]);
    expect(criminalSwitchStateOf(d, [], present, m)).toBe('none');
    const hand = [{ address: 'tab:plot_hooks', hidden: false }];
    expect(flipCriminalVeil(hand, d, present, m)).toEqual(hand);
    // The same town with a criminal service row: the grouping now covers something and is a part.
    const served = { ...plain, availableServices: { criminal: [{ name: 'Fencing', institution: 'Mill' }] } };
    expect([...presentCriminalGroupings(served)]).toEqual(['block:services.criminal']);
    expect(criminalSwitchStateOf(defaultVeilFor(served), [], presentCriminalGroupings(served), curateModelFor(served, []))).toBe('hidden');
  });

  it('without the screen\'s model the switch covers nothing: it never writes an address it cannot show (withholding)', () => {
    expect(criminalPartsOf(defaults, [])).toEqual([]);
    expect(criminalSwitchStateOf(defaults, [])).toBe('none');
    expect(flipCriminalVeil([], defaults)).toEqual([]);
  });
});

describe('VS1 acceptance on the projection, over twelve births', () => {
  /** @type {Array<{ seed: string, tier: string, born: unknown }>} */
  const births = [];
  beforeAll(async () => {
    const { generateSettlementPipeline: gen } = await import('../../../src/generators/generateSettlementPipeline.js');
    const density = await import('../../../src/domain/density/densityCreateBoundary.js');
    await density.loadGenerationLawPayloads();
    const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
    for (const t of SEEDS) {
      births.push({ ...t, born: gen(density.birthConfig({ ...DEFAULT_CONFIG, ...BROWSER, settType: t.tier }), null, { seed: t.seed, customContent: {} }) });
    }
  }, 600000);

  it('(a)-(e) hold on every birth, plain and DM-revealing', () => {
    const failures = [];
    const tally = { copies: 0, criminal: 0, corruption: 0, groupings: 0, people: 0, a: 0, b: 0, c: 0, d: 0, e: 0, g: 0, teeth: 0 };
    for (const { seed, born } of births) {
      for (const shareDm of [false, true]) {
        const label = `${seed}${shareDm ? ' dm' : ''}`;
        const pub = galleryPayloadFor(born, { shareDm });
        const defaults = defaultVeilFor(pub);
        const present = presentCriminalGroupings(pub);
        const model = curateModelFor(pub, []);
        const offers = screenOffers(model);
        tally.copies += 1;
        if ([...offers].some(a => /^field:institution:.*:people$/.test(a))) tally.people += 1;
        if (present.size) tally.groupings += 1;
        if (defaults.some(d => HOUSE_CLASSES.has(d.cls) || d.cls === 'criminal-faction')) tally.criminal += 1;
        if (defaults.some(d => d.cls === 'npc-corruption')) tally.corruption += 1;
        // The owner's hand draft: plot hooks and rumors' truth shown (not criminal), and criminal eyes opened (the
        // criminal services; people's corruption where the copy carries it).
        let hand = toggleVeilDelta([], 'tab:plot_hooks', defaults);
        hand = toggleVeilDelta(hand, 'block:rumors.dmTruth', defaults);
        hand = toggleVeilDelta(hand, 'block:services.criminal', defaults);
        if (defaults.some(d => d.address === 'class:npc:corruption')) hand = toggleVeilDelta(hand, 'class:npc:corruption', defaults);
        const view = (deltas) => applyVeil(pub, resolveVeil(defaults, deltas));
        const before = view(hand);
        const hide = setCriminalVeil(hand, defaults, true, present, model);
        const show = setCriminalVeil(hand, defaults, false, present, model);
        const H = view(hide); const S = view(show);
        const raw = familyContent(pub, defaults);

        // (a) nothing of the family reaches the visitor.
        const leaked = Object.keys(familyContent(H, defaults));
        if (leaked.length) failures.push(`${label} (a): ${leaked.slice(0, 5).join(', ')}`); else tally.a += 1;
        const parts = criminalPartsOf(defaults, hide, present, model);
        if (criminalSwitchStateOf(defaults, hide, present, model) !== (parts.length ? 'hidden' : 'none')) failures.push(`${label} (a): state ${criminalSwitchStateOf(defaults, hide, present, model)}`);
        if (parts.length && criminalSwitchStateOf(defaults, show, present, model) !== 'shown') failures.push(`${label} (b): state ${criminalSwitchStateOf(defaults, show, present, model)}`);

        // (b) everything of the family the unveiled projection carries reaches the visitor. An income row is served as the
        // projection's row WITHOUT its `weight`: the veil withholds `weight` on every non-owner read (VEIL-19 item D, ruling
        // VR19: a share is re-derived or withheld, never raw), so the served row is asserted as exactly that.
        const shownContent = familyContent(unkeyPeople(S, pub), defaults);
        const servedAs = (k, v) => (k.startsWith('income ') && isRec(v) ? Object.fromEntries(Object.entries(v).filter(([key]) => key !== 'weight')) : v);
        const missing = Object.keys(raw).filter(k => JSON.stringify(shownContent[k]) !== JSON.stringify(servedAs(k, raw[k]))
          || (k.startsWith('income ') && isRec(shownContent[k]) && 'weight' in shownContent[k]));
        if (missing.length) failures.push(`${label} (b): ${missing.slice(0, 5).join(', ')}`); else tally.b += 1;

        // (c) every other part byte-equal to the copy before the click; the hand deltas survive. The test's own second veil
        // (the family's parts) is applied to each served copy: on the hide copy and the copy before the click it withholds
        // nothing more (the veil is idempotent there, measured at 4b33d1617 on 72 of 72 copies:
        // docs/chair/2026-11-20/veil/v102/out/item0-idempotence.json); on the SHOW copy it withholds the criminal income row
        // the click showed, so it re-derives the other rows' shares, and from the stored percentages, since the served copy
        // already lost `weight` (VR19). So the income shares are compared apart: the show copy carries the projection's own
        // shares, every row present; the rest of every copy is byte-equal.
        const mask = (copy) => JSON.stringify(canonPeople(applyVeil(copy, criminalPartsOf(defaults, hand, undefined, model))).doc);
        const noShares = (copy) => {
          const c = JSON.parse(mask(copy));
          if (Array.isArray(c.economicState?.incomeSources)) c.economicState.incomeSources = c.economicState.incomeSources.map(r => (isRec(r) ? { ...r, percentage: null } : r));
          return JSON.stringify(c);
        };
        const sharesOf = (copy) => JSON.stringify(recs(copy.economicState?.incomeSources).map(r => r.percentage));
        const okC = [H, S, before].every(copy => storedIdsServed(copy, pub).length === 0)
          && mask(H) === mask(before) && noShares(S) === noShares(before)
          && sharesOf(S) === sharesOf(pub)
          && ['tab:plot_hooks', 'block:rumors.dmTruth'].every(a => [hide, show].every(list => list.some(d => d.address === a && d.hidden === false)));
        if (!okC) failures.push(`${label} (c)`); else tally.c += 1;
        // THE TEETH of the re-stated (c) on this copy (VR46; VEIL-22, R4-CURE 3): a reference moved off its card, a stored
        // person id served, a changed non-id byte, two people under one id or one under two, each reds the comparison; a
        // second projection of the same hide differs in every person id and still holds.
        if (shareDm && !tally.teeth) {
          const teeth = bijectionTeeth(H, (c) => storedIdsServed(c, pub).length === 0 && mask(c) === mask(H),
            { storedId: recs(pub.npcs).map(n => n.id).find(id => typeof id === 'string'), again: view(hide) });
          // (a copy with no reference cannot carry tooth (i): the next DM copy is tried; the tally asks for one copy with all)
          if (teeth.missed.length) failures.push(`${label} teeth: missed ${teeth.missed.join('; ')}`);
          else if (!teeth.absent.length) tally.teeth = 1;
        }

        // (d) hide, show, hide is the first hide.
        const again = setCriminalVeil(setCriminalVeil(hide, defaults, false, present, model), defaults, true, present, model);
        const flips = parts.length ? flipCriminalVeil(flipCriminalVeil(hide, defaults, present, model), defaults, present, model) : hide;
        if (JSON.stringify(again) !== JSON.stringify(hide) || JSON.stringify(flips) !== JSON.stringify(hide)) failures.push(`${label} (d)`); else tally.d += 1;

        // (e) show all is every family eye THE SCREEN OFFERS opened by hand, from the default (VR34: a static grouping
        // with nothing under it is not a part; an eye the screen does not draw is no hand's to open).
        const family = familyPredicate(defaults);
        const keep = (a) => family(a) && (!/^(tab|block):/.test(a) || present.has(a));
        const opened = byHand(pub, defaults, [], keep, false);
        const sw = [...resolveVeil(defaults, setCriminalVeil([], defaults, false, present, model))].sort();
        if (JSON.stringify(sw) !== JSON.stringify([...resolveVeil(defaults, opened)].sort())) failures.push(`${label} (e)`); else tally.e += 1;

        // (g) VR34: every address either click writes is one the screen offers for this copy.
        const unreachable = [...hide, ...show, ...setCriminalVeil([], defaults, false, present, model)].filter(x => !offers.has(x.address)).map(x => x.address);
        if (unreachable.length) failures.push(`${label} (g): ${[...new Set(unreachable)].slice(0, 5).join(', ')}`); else tally.g += 1;
      }
    }
    expect(tally.teeth, 'the re-stated (c) kept its five teeth on one DM copy (VR46; VEIL-22, R4-CURE 3)').toBe(1);
    expect(failures).toEqual([]);
    expect(tally.copies).toBe(24);
    expect(tally.criminal, 'at least half the births carry a criminal house or faction').toBeGreaterThanOrEqual(12);
    expect(tally.corruption, 'some DM-revealing copy carries people\'s corruption, or (a) on corruption proves nothing').toBeGreaterThan(0);
    expect(tally.groupings, 'some copy carries content under a criminal grouping').toBeGreaterThan(0);
    expect(tally.people, 'some DM-revealing copy offers a criminal house\'s People eye, or (g) on people proves nothing').toBeGreaterThan(0);
    expect(tally).toMatchObject({ a: 24, b: 24, c: 24, d: 24, e: 24, g: 24, teeth: 1 });
    writeTally(tally);
  }, 600000);
});
