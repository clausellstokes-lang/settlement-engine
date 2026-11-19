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
 * (e) show all resolves to the same hidden set as opening every family eye by hand;
 * (f) the classification walk: every default class defaultVeilFor can produce, read live from
 *     its tables, is in the family or in NOT_CRIMINAL, never both.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import {
  CARD_KINDS, DEFAULT_VEIL_RULES, applyVeil, defaultVeilFor, galleryPayloadFor, isAddressHidden, resolveVeil, toggleVeilDelta,
} from '../../../src/domain/display/galleryVeil.js';
import {
  CRIMINAL_VEIL_CLASSES, NOT_CRIMINAL, criminalPartsOf, criminalSwitchStateOf, flipCriminalVeil, presentCriminalGroupings, setCriminalVeil,
} from '../../../src/domain/display/criminalVeilSwitch.js';

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
  const town = {
    name: 'Redwick', tier: 'town',
    institutions: [
      { id: 'inst-den', name: "Thieves' den", category: 'Criminal', desc: 'A den.' },
      { id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' },
    ],
    npcs: [{ id: 'n1', name: 'Ada', role: 'Fence', corrupt: true, corruptionVector: 'bribes', secret: 'Owes the den.' }],
    powerStructure: { factions: [{ faction: 'Red hand', category: 'criminal', goals: 'Docks.', members: [] }] },
  };
  const defaults = defaultVeilFor(town);

  it('a fresh share reads hidden; one criminal eye opened reads partly; hide and show set every part', () => {
    expect(criminalSwitchStateOf(defaults, [])).toBe('hidden');
    const opened = toggleVeilDelta([], 'block:services.criminal', defaults);
    expect(criminalSwitchStateOf(defaults, opened)).toBe('partly');
    const hidden = flipCriminalVeil(opened, defaults);
    expect(hidden).toEqual([]);
    const shown = flipCriminalVeil(hidden, defaults);
    expect(criminalSwitchStateOf(defaults, shown)).toBe('shown');
    const now = resolveVeil(defaults, shown);
    for (const a of criminalPartsOf(defaults, shown)) expect(isAddressHidden(now, a), a).toBe(false);
    expect(isAddressHidden(now, 'class:npc:secret'), 'a secret is not criminal: it stays hidden').toBe(true);
  });

  it('a person corruption exception and a house eye fall under the family; a whole-person hide is never touched', () => {
    const hand = [{ address: 'field:npc:n1:corruption', hidden: false }, { address: 'field:institution:inst-den:people', hidden: true },
      { address: 'card:npc:n1', hidden: true }, { address: 'class:npc:secret', hidden: false }];
    const parts = criminalPartsOf(defaults, hand);
    expect(parts).toContain('field:npc:n1:corruption');
    expect(parts).toContain('field:institution:inst-den:people');
    const hidden = setCriminalVeil(hand, defaults, true);
    expect(hidden).toEqual([{ address: 'card:npc:n1', hidden: true }, { address: 'class:npc:secret', hidden: false }]);
    expect(setCriminalVeil(setCriminalVeil(hidden, defaults, false), defaults, true)).toEqual(hidden);
  });

  it('a town with no criminal part reads none and a flip changes nothing (the static groupings count only over content)', () => {
    const plain = { name: 'Quietford', tier: 'hamlet', institutions: [{ id: 'inst-mill', name: 'Mill', category: 'Economy' }] };
    const d = defaultVeilFor(plain);
    const present = presentCriminalGroupings(plain);
    expect([...present]).toEqual([]);
    expect(criminalPartsOf(d, [], present)).toEqual([]);
    expect(criminalSwitchStateOf(d, [], present)).toBe('none');
    const hand = [{ address: 'tab:plot_hooks', hidden: false }];
    expect(flipCriminalVeil(hand, d, present)).toEqual(hand);
    // The same town with a criminal service row: the grouping now covers something and is a part.
    const served = { ...plain, availableServices: { criminal: [{ name: 'Fencing', institution: 'Mill' }] } };
    expect([...presentCriminalGroupings(served)]).toEqual(['block:services.criminal']);
    expect(criminalSwitchStateOf(defaultVeilFor(served), [], presentCriminalGroupings(served))).toBe('hidden');
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
    const tally = { copies: 0, criminal: 0, corruption: 0, groupings: 0, a: 0, b: 0, c: 0, d: 0, e: 0 };
    for (const { seed, born } of births) {
      for (const shareDm of [false, true]) {
        const label = `${seed}${shareDm ? ' dm' : ''}`;
        const pub = galleryPayloadFor(born, { shareDm });
        const defaults = defaultVeilFor(pub);
        const present = presentCriminalGroupings(pub);
        tally.copies += 1;
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
        const hide = setCriminalVeil(hand, defaults, true, present);
        const show = setCriminalVeil(hand, defaults, false, present);
        const H = view(hide); const S = view(show);
        const raw = familyContent(pub, defaults);

        // (a) nothing of the family reaches the visitor.
        const leaked = Object.keys(familyContent(H, defaults));
        if (leaked.length) failures.push(`${label} (a): ${leaked.slice(0, 5).join(', ')}`); else tally.a += 1;
        const parts = criminalPartsOf(defaults, hide, present);
        if (criminalSwitchStateOf(defaults, hide, present) !== (parts.length ? 'hidden' : 'none')) failures.push(`${label} (a): state ${criminalSwitchStateOf(defaults, hide, present)}`);
        if (parts.length && criminalSwitchStateOf(defaults, show, present) !== 'shown') failures.push(`${label} (b): state ${criminalSwitchStateOf(defaults, show, present)}`);

        // (b) everything of the family the unveiled projection carries reaches the visitor.
        const shownContent = familyContent(S, defaults);
        const missing = Object.keys(raw).filter(k => JSON.stringify(shownContent[k]) !== JSON.stringify(raw[k]));
        if (missing.length) failures.push(`${label} (b): ${missing.slice(0, 5).join(', ')}`); else tally.b += 1;

        // (c) every other part byte-equal to the copy before the click; the hand deltas survive.
        const mask = (copy) => JSON.stringify(applyVeil(copy, criminalPartsOf(defaults, hand)));
        const okC = mask(H) === mask(before) && mask(S) === mask(before)
          && ['tab:plot_hooks', 'block:rumors.dmTruth'].every(a => [hide, show].every(list => list.some(d => d.address === a && d.hidden === false)));
        if (!okC) failures.push(`${label} (c)`); else tally.c += 1;

        // (d) hide, show, hide is the first hide.
        const again = setCriminalVeil(setCriminalVeil(hide, defaults, false, present), defaults, true, present);
        const flips = parts.length ? flipCriminalVeil(flipCriminalVeil(hide, defaults, present), defaults, present) : hide;
        if (JSON.stringify(again) !== JSON.stringify(hide) || JSON.stringify(flips) !== JSON.stringify(hide)) failures.push(`${label} (d)`); else tally.d += 1;

        // (e) show all is every family eye opened by hand, from the default (each family default
        // that covers something here: a static grouping with nothing under it is not a part).
        const base = resolveVeil(defaults, []);
        const familyEyes = new Set(criminalPartsOf(defaults, [], present));
        let byHand = [];
        for (const d of defaults) if (familyEyes.has(d.address) && isAddressHidden(base, d.address)) byHand = toggleVeilDelta(byHand, d.address, defaults);
        const sw = [...resolveVeil(defaults, setCriminalVeil([], defaults, false, present))].sort();
        if (JSON.stringify(sw) !== JSON.stringify([...resolveVeil(defaults, byHand)].sort())) failures.push(`${label} (e)`); else tally.e += 1;
      }
    }
    expect(failures).toEqual([]);
    expect(tally.copies).toBe(24);
    expect(tally.criminal, 'at least half the births carry a criminal house or faction').toBeGreaterThanOrEqual(12);
    expect(tally.corruption, 'some DM-revealing copy carries people\'s corruption, or (a) on corruption proves nothing').toBeGreaterThan(0);
    expect(tally.groupings, 'some copy carries content under a criminal grouping').toBeGreaterThan(0);
    expect(tally).toMatchObject({ a: 24, b: 24, c: 24, d: 24, e: 24 });
    writeTally(tally);
  }, 600000);
});
