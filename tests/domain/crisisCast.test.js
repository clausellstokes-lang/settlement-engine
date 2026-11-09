/**
 * tests/domain/crisisCast.test.js — the crisis cast's derivation rules
 * (docs/DESIGN_CRISIS_TAB.md, the owner 2026-11-03 "Do it"), one title per rule over
 * hand-built settlements, the two-crisis towns, and a 120-seed totality run over generated
 * towns. `src/domain/crisis/crisisCast.js :: deriveCrisisCast` is the unit.
 */
import { describe, it, expect } from 'vitest';
import {
  deriveCrisisCast, deriveStakes, bruntCandidates, leverCandidates, instigatorCandidates,
  targetCandidates, exploiterCandidates, scapegoatCandidates, defenderCandidates,
  treaterCandidates, collaboratorCandidates, wavererCandidates, faceCandidates,
  CRISIS_CAST_TUNING, CRISIS_LINKS, CONTRADICTORY_ROLE_PAIRS, CAST_REASONS, CAST_ABSENCES,
  STAKE_REASONS, GRASPING_TRAITS, CRISIS_NATURE, catalogFor, castHash, requiredRolesOf,
  deriveLevers, CRISIS_LEVERS,
} from '../../src/domain/crisis/crisisCast.js';
import { isLiveInstitution } from '../../src/domain/institutions/institutionRoster.js';
import { NPC_PERSONALITY_TRAITS } from '../../src/data/npcData.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STRESS_SEVERITY_WEIGHT } from '../../src/generators/stressGenerator.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** A hand-built town: a council seat, a guard, a church, merchants, crafts, a granary. */
function town({ legitimacy = 'crisis', extraFactions = [], extraNpcs = [], institutions = null } = {}) {
  const pl = {
    endorsed: { isEndorsed: true, isApproved: true, isContested: false, isLegitimacyCrisis: false, crimMultiplier: 1 },
    tolerated: { isEndorsed: false, isTolerated: true, isContested: false, isLegitimacyCrisis: false, crimMultiplier: 1 },
    contested: { isEndorsed: false, isContested: true, isLegitimacyCrisis: false, crimMultiplier: 1 },
    crisis: { isEndorsed: false, isContested: false, isLegitimacyCrisis: true, crimMultiplier: 1.3 },
  }[legitimacy];
  return {
    tier: 'town',
    npcs: [
      { id: 'n1', name: 'Mara Vell', role: 'Mayor', power: 9, memberships: [{ power: 'Town Council', rank: 1 }], personality: { dominant: 'perceptive' } },
      { id: 'n2', name: 'Tobin Ash', role: 'Guard Captain', power: 8, memberships: [{ power: 'Military/Guard', rank: 1 }], personality: { dominant: 'brave' } },
      { id: 'n3', name: 'Ilse Brand', role: 'High Priest', power: 5, memberships: [{ power: 'Religious Authorities', rank: 1 }], personality: { flaw: 'vain' } },
      { id: 'n4', name: 'Oda Fenn', role: 'Healer', power: 1, memberships: [{ power: 'Religious Authorities', rank: 2 }], personality: {} },
      { id: 'n5', name: 'Cass Morrow', role: 'Merchant Prince', power: 7, memberships: [{ power: 'Merchant Guilds', rank: 1 }], personality: { flaw: 'greedy' } },
      { id: 'n6', name: 'Pell Rook', role: 'Grain Factor', power: 4, memberships: [{ power: 'Grain Holders', rank: 1 }], institution: { kind: 'house', key: 'Town granary', title: 'the granary reeve' }, allegiance: { power: null, house: 'Thieves den', vector: 'greed', via: 'office', handler: null, share: 0.15, veiled: true, covert: true }, personality: { flaw: 'greedy' } }, // ALLEGIANCE-CAR1 (2026-11-08): the retired mark is the card's hidden allegiance
      { id: 'n7', name: 'Wil Dunn', role: 'Blacksmith', power: 2, memberships: [{ power: 'Craft Guilds', rank: 1 }], personality: {} },
      { id: 'n8', name: 'Ren Hale', role: 'Baker', power: 1, memberships: [{ power: 'Craft Guilds', rank: 2 }], personality: {} },
      ...extraNpcs,
    ],
    institutions: institutions || [{ name: 'Town granary' }, { name: 'Weekly market' }, { name: 'Town council' }, { name: 'Town watch' }, { name: 'Parish churches (2-5)' }],
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: pl,
      factions: [
        { faction: 'Religious Authorities', category: 'religious', power: 22 },
        { faction: 'Grain Holders', category: 'economy', power: 14 },
        { faction: 'Military/Guard', category: 'military', power: 12 },
        { faction: 'Town Council', category: 'government', power: 10, isGoverning: true },
        { faction: 'Merchant Guilds', category: 'economy', power: 8 },
        { faction: 'Craft Guilds', category: 'craft', power: 6 },
        ...extraFactions,
      ],
    },
  };
}

const roleOf = (cast, role) => cast.roles.find((r) => r.role === role) || null;
const stakeOf = (stakes, f) => stakes.find((k) => k.factionId === f)?.stake;

describe('the eleven rules, each over a hand-built town', () => {
  it('rule 1: the one who bears the brunt is the least powerful whose role touches the base the crisis hits', () => {
    // CENSUS-2d: the record holds the famine it casts (the brunt reason "the hunger falls first"
    // declares `crisis: hunger`, so a record with no hunger on reads its twin)
    const s = { ...town(), stress: [{ type: 'famine' }] };
    const c = bruntCandidates(s, 'famine', deriveStakes(s, 'famine'));
    expect(c.candidates[0]).toMatchObject({ role: 'brunt', kind: 'npc', name: 'Ren Hale', reason: CAST_REASONS.bruntBase.food_security });
  });

  it('rule 2: the lever is held by the lever house\'s face, else the house itself, and no one is invented', () => {
    const s = town();
    expect(leverCandidates(s, 'famine').candidates[0]).toMatchObject({ kind: 'npc', name: 'Pell Rook', reason: CAST_REASONS.leverRuns });
    const bare = town({ extraNpcs: [] });
    bare.npcs = bare.npcs.filter((n) => n.id !== 'n6' && n.id !== 'n5' && n.id !== 'n8');
    expect(leverCandidates(bare, 'famine').candidates[0]).toMatchObject({ kind: 'institution', name: 'Town granary', reason: CAST_REASONS.leverInstitution });
  });

  it('rule 3: a social instigator is the outranking rival\'s leading member; an engineered one needs a faction that gains, else an outside hand', () => {
    const s = town();
    const social = instigatorCandidates(s, 'insurgency', deriveStakes(s, 'insurgency'));
    expect(social.candidates[0]).toMatchObject({ name: 'Ilse Brand', reason: CAST_REASONS.instigatorRival });
    const calm = town({ legitimacy: 'endorsed' });
    calm.powerStructure.factions = calm.powerStructure.factions.filter((f) => f.isGoverning || f.faction === 'Craft Guilds');
    const eng = instigatorCandidates(calm, 'infiltrated', deriveStakes(calm, 'infiltrated'));
    expect(eng.candidates).toEqual([]); // anchored: the absence reason is asserted on the next line
    expect(eng.absent).toBe(CAST_ABSENCES.outsideHand);
  });

  it('rule 4: the target is the seat\'s named holder, then the governing house', () => {
    const s = town({ legitimacy: 'contested' });
    const c = targetCandidates(s);
    expect(c.candidates[0]).toMatchObject({ kind: 'npc', name: 'Mara Vell', reason: CAST_REASONS.targetSeatContested });
    expect(c.candidates[1]).toMatchObject({ kind: 'faction', name: 'Town Council' });
  });

  it('rule 5: the exploiter comes from a faction that gains, the corrupt first', () => {
    const s = town();
    const c = exploiterCandidates(s, deriveStakes(s, 'famine'), 'exploiter');
    expect(c.candidates[0]).toMatchObject({ name: 'Pell Rook', reason: CAST_REASONS.exploiterCorrupt });
  });

  it('rule 6: the scapegoat exists only under contested legitimacy, and is the seat when its house loses', () => {
    const calm = town({ legitimacy: 'endorsed' });
    expect(scapegoatCandidates(calm, deriveStakes(calm, 'famine'), null).absent).toBe(CAST_ABSENCES.notContested);
    const s = town({ legitimacy: 'contested' });
    expect(scapegoatCandidates(s, deriveStakes(s, 'famine'), null).candidates[0]).toMatchObject({ name: 'Mara Vell', reason: CAST_REASONS.scapegoatSeat });
  });

  it('rule 7: the defender leads the military, else holds the garrison office, else is the house', () => {
    const s = town();
    expect(defenderCandidates(s).candidates[0]).toMatchObject({ name: 'Tobin Ash', reason: CAST_REASONS.defenderMilitary });
    const noArmy = town();
    noArmy.npcs = noArmy.npcs.filter((n) => n.id !== 'n2');
    noArmy.powerStructure.factions = noArmy.powerStructure.factions.filter((f) => f.faction !== 'Military/Guard');
    expect(defenderCandidates(noArmy).candidates[0]).toMatchObject({ kind: 'institution', name: 'Town watch' });
  });

  it('rule 8: the one who would treat is the merchants\' leader when the seat is contested, else the seat', () => {
    // the strongest merchant-archetype house leads: the Grain Holders (economy) outrank the guilds
    expect(treaterCandidates(town({ legitimacy: 'contested' })).candidates[0]).toMatchObject({ name: 'Pell Rook', reason: CAST_REASONS.treaterMerchant });
    expect(treaterCandidates(town({ legitimacy: 'endorsed' })).candidates[0]).toMatchObject({ name: 'Mara Vell', reason: CAST_REASONS.treaterSeat });
  });

  it('rule 9: the collaborator is a corrupt person with ties, else the most ambitious of a faction that gains', () => {
    const s = town();
    expect(collaboratorCandidates(s, deriveStakes(s, 'occupied')).candidates[0]).toMatchObject({ name: 'Pell Rook', reason: CAST_REASONS.collaboratorCorrupt });
  });

  it('rule 10: the waverer is a member of a faction whose stake is split', () => {
    const s = town({ legitimacy: 'endorsed' });
    const stakes = deriveStakes(s, 'religious_conversion');
    const c = wavererCandidates(s, stakes);
    const split = new Set(stakes.filter((k) => k.stake === 'split').map((k) => k.factionId));
    expect(c.candidates.length).toBeGreaterThan(0);
    for (const row of c.candidates) expect(s.npcs.find((n) => n.id === row.id).memberships.some((m) => split.has(m.power))).toBe(true);
  });

  it('rule 11: every faction gets exactly one stake and one reason', () => {
    const s = town();
    for (const kind of Object.keys(CRISIS_NATURE)) {
      const stakes = deriveStakes(s, kind);
      expect(stakes.map((k) => k.factionId).sort()).toEqual(s.powerStructure.factions.map((f) => f.faction).sort());
      for (const k of stakes) expect(Object.values(STAKE_REASONS)).toContain(k.reason);
    }
    const famine = deriveStakes(s, 'famine');
    expect(stakeOf(famine, 'Grain Holders')).toBe('gains');
    expect(stakeOf(famine, 'Craft Guilds')).toBe('loses');
  });

  it('the occupier\'s local face leads the occupying house', () => {
    const s = town({ extraFactions: [{ faction: 'Imperial Occupation', category: 'occupation', power: 30 }], extraNpcs: [{ id: 'n9', name: 'Varo Quill', role: 'Prefect', power: 9, memberships: [{ power: 'Imperial Occupation', rank: 1 }] }] });
    expect(faceCandidates(s).candidates[0]).toMatchObject({ name: 'Varo Quill', reason: CAST_REASONS.face });
  });

  it('the generator\'s own "Occupation Authority", filed under the military category, is read as the occupier', () => {
    const s = town({ extraFactions: [{ faction: 'Occupation Authority', category: 'military', power: 30 }], extraNpcs: [{ id: 'n9', name: 'Varo Quill', role: 'Guard Captain', power: 9, memberships: [{ power: 'Occupation Authority', rank: 1 }] }] });
    expect(faceCandidates(s).candidates[0]).toMatchObject({ name: 'Varo Quill', reason: CAST_REASONS.face });
    expect(stakeOf(deriveStakes(s, 'occupied'), 'Occupation Authority')).toBe('gains');
  });

  it('an office stand-in names an office, not a person, and is never cast', () => {
    const s = town();
    s.npcs = s.npcs.map((n) => (n.id === 'n2' ? { ...n, name: 'The Guard Captain' } : n));
    expect(defenderCandidates(s).candidates.map((r) => r.name)).not.toContain('The Guard Captain'); // anchored: the candidates are non-empty (the watch house stands)
    expect(defenderCandidates(s).candidates.length).toBeGreaterThan(0);
  });

  it('a temporary person is minted only for a natural kind\'s lever with neither a house nor a face, and only once per town', () => {
    const s = town({ institutions: [{ name: 'Town council' }] });
    s.npcs = s.npcs.filter((n) => !/healer|priest/i.test(n.role));
    const minted = [];
    const mint = (kind, crisisId) => { minted.push([kind, crisisId]); return { id: `temp_${kind}`, name: 'Hesk Marrow' }; };
    const casts = deriveCrisisCast(s, [{ type: 'plague_onset' }, { type: 'mass_migration' }], 'seed-x', { mintTemporary: mint });
    expect(minted).toEqual([['healer', 'plague_onset']]);
    expect(roleOf(casts.get('plague_onset'), 'lever')).toMatchObject({ temporary: true, name: 'Hesk Marrow', reason: CAST_REASONS.leverTemporary });
    expect(roleOf(casts.get('mass_migration'), 'lever')).toMatchObject({ temporary: true, id: 'temp_healer' });
  });
});

describe('two or more crises: the town is cast, not the crisis', () => {
  const hasContradiction = (casts) => {
    const by = new Map();
    for (const c of casts.values()) for (const r of c.roles) by.set(`${r.kind}:${r.id}`, [...(by.get(`${r.kind}:${r.id}`) || []), r.role]);
    for (const roles of by.values()) {
      for (const [a, b] of CONTRADICTORY_ROLE_PAIRS) if (roles.includes(a) && roles.includes(b)) return true;
    }
    return false;
  };
  const seedWhere = (pred) => { for (let i = 0; i < 5000; i += 1) if (pred(`s${i}`)) return `s${i}`; throw new Error('no seed'); };

  it('famine + siege: the siege is cast first, and its profiteer is the famine\'s first exploiter candidate', () => {
    const s = town({ legitimacy: 'contested' });
    const seed = seedWhere((sd) => castHash(sd, 'under_siege', 'profiteer') < CRISIS_CAST_TUNING.rates.profiteer
      && castHash(sd, 'famine', 'exploiter') < CRISIS_CAST_TUNING.rates.exploiter);
    const casts = deriveCrisisCast(s, [{ type: 'under_siege' }, { type: 'famine' }], seed);
    expect(casts.get('under_siege').rank).toBe(1);
    expect(casts.get('famine').rank).toBe(2);
    expect(roleOf(casts.get('under_siege'), 'defender')).toMatchObject({ name: 'Tobin Ash' });
    const profiteer = roleOf(casts.get('under_siege'), 'profiteer');
    expect(profiteer).toMatchObject({ kind: 'npc' });
    expect(roleOf(casts.get('famine'), 'exploiter')).toMatchObject({ id: profiteer.id, reason: CAST_REASONS.exploiterLinked });
    expect(casts.get('famine').links).toEqual(['under_siege']);
    expect(hasContradiction(casts)).toBe(false);
  });

  it('famine + insurgency: the insurgency\'s instigator is drawn from the house that bore the famine', () => {
    const s = town();
    s.npcs.push({ id: 'n10', name: 'Jory Kemp', role: 'Weaver', power: 3, memberships: [{ power: 'Craft Guilds', rank: null }] });
    const casts = deriveCrisisCast(s, [{ type: 'famine' }, { type: 'insurgency' }], 'any-seed');
    const brunt = roleOf(casts.get('famine'), 'brunt');
    const inst = roleOf(casts.get('insurgency'), 'instigator');
    expect(brunt).toMatchObject({ name: 'Ren Hale' });
    expect(inst).toMatchObject({ reason: CAST_REASONS.instigatorLinked });
    expect(s.npcs.find((n) => n.id === inst.id).memberships.map((m) => m.power)).toContain('Craft Guilds');
    expect(casts.get('insurgency').links).toEqual(['famine']);
    expect(hasContradiction(casts)).toBe(false);
  });

  it('occupation + insurgency: the insurgency turns on the occupation\'s local face', () => {
    const s = town({ extraFactions: [{ faction: 'Imperial Occupation', category: 'occupation', power: 30 }], extraNpcs: [{ id: 'n9', name: 'Varo Quill', role: 'Prefect', power: 9, memberships: [{ power: 'Imperial Occupation', rank: 1 }] }] });
    const casts = deriveCrisisCast(s, [{ type: 'occupied' }, { type: 'insurgency' }], 'any-seed');
    expect(roleOf(casts.get('occupied'), 'face')).toMatchObject({ name: 'Varo Quill' });
    expect(roleOf(casts.get('insurgency'), 'target')).toMatchObject({ name: 'Varo Quill', reason: CAST_REASONS.targetLinked });
    expect(hasContradiction(casts)).toBe(false);
  });

  it('a person who would hold a contradictory pair is passed over and the reason says so', () => {
    // Under a legitimacy crisis the church gains while the seat struggles, so the siege's
    // profiteer is the high priest; the plague that follows would have her bear the brunt
    // (profiteer / bears the brunt is a contradictory pair), so it takes the next candidate.
    const s = town({ legitimacy: 'crisis' });
    s.npcs = s.npcs.filter((n) => n.id !== 'n4');
    const seed = seedWhere((sd) => castHash(sd, 'under_siege', 'profiteer') < CRISIS_CAST_TUNING.rates.profiteer);
    const casts = deriveCrisisCast(s, [{ type: 'under_siege' }, { type: 'plague_onset' }], seed);
    expect(roleOf(casts.get('under_siege'), 'profiteer')).toMatchObject({ name: 'Ilse Brand' });
    const brunt = roleOf(casts.get('plague_onset'), 'brunt');
    expect(brunt.name).not.toBe('Ilse Brand'); // anchored: the next line pins who it is instead
    expect(brunt).toMatchObject({ kind: 'faction', name: 'Religious Authorities' });
    expect(brunt.reason.endsWith(CAST_REASONS.nextInLine)).toBe(true);
    expect(hasContradiction(casts)).toBe(false);
  });

  it('the occasional roles are capped per town, applied in casting order', () => {
    const s = town({ legitimacy: 'contested' });
    const seed = seedWhere((sd) => castHash(sd, 'famine', 'exploiter') < CRISIS_CAST_TUNING.rates.exploiter
      && castHash(sd, 'plague_onset', 'exploiter') < CRISIS_CAST_TUNING.rates.exploiter);
    const casts = deriveCrisisCast(s, [{ type: 'famine' }, { type: 'plague_onset' }], seed);
    const exploiters = [...casts.values()].flatMap((c) => c.roles.filter((r) => r.role === 'exploiter'));
    expect(exploiters.length).toBeLessThanOrEqual(CRISIS_CAST_TUNING.townCaps.exploiter);
    if (exploiters.length === 1) expect(casts.get('plague_onset').absent).toContainEqual({ role: 'exploiter', reason: CAST_ABSENCES.townCap });
  });
});

describe('the vocabulary is held to its sources', () => {
  it('every kind in the generator\'s stress map has a nature, and every nature has its required roles', () => {
    for (const kind of Object.keys(STRESS_TYPE_MAP)) expect(CRISIS_NATURE[kind], kind).toBeTruthy();
    expect(requiredRolesOf('famine')).toEqual(['brunt', 'lever']);
    expect(requiredRolesOf('under_siege')).toEqual(['defender', 'treater']);
  });
  it('every link names a token the earlier kind\'s catalog entry carries', () => {
    for (const link of CRISIS_LINKS) {
      const cat = catalogFor(link.from);
      expect([...cat.spreadChannels, ...cat.residualEffects], `${link.from} → ${link.to}`).toContain(link.via);
    }
  });
  it('the grasping traits are all in the personality register', () => {
    const all = [...NPC_PERSONALITY_TRAITS.positive, ...NPC_PERSONALITY_TRAITS.negative, ...NPC_PERSONALITY_TRAITS.neutral];
    for (const t of GRASPING_TRAITS) expect(all).toContain(t);
  });
});

describe('120 generated towns: every active crisis is cast, totally', () => {
  const SEEDS = Array.from({ length: 120 }, (_, i) => `crisis-cast-${i}`);
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const KINDS = Object.keys(STRESS_TYPE_MAP);

  it('every crisis gets a cast; no contradictory pair; no cap exceeded; no placeholder name', () => {
    const failures = collectSeedFailures(SEEDS, (seed, i) => {
      const kinds = [KINDS[i % KINDS.length], KINDS[(i * 7 + 3) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j);
      const s = generateSettlementPipeline({ settType: TIERS[i % TIERS.length], stressTypes: kinds }, null, { seed, customContent: {} });
      const entries = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean)
        .sort((a, b) => (STRESS_SEVERITY_WEIGHT[b.type] || 0) - (STRESS_SEVERITY_WEIGHT[a.type] || 0));
      const casts = deriveCrisisCast(s, entries, seed);
      const by = new Map();
      const count = {};
      for (const e of entries) {
        const c = casts.get(e.type);
        if (!c) throw new Error(`${e.type}: no cast`);
        for (const role of requiredRolesOf(e.type)) {
          const filled = c.roles.some((r) => r.role === role) || c.absent.some((a) => a.role === role);
          if (!filled) throw new Error(`${e.type}: required ${role} neither filled nor explained`);
        }
        for (const r of c.roles) {
          if (!r.name || /unnamed/i.test(r.name)) throw new Error(`${e.type}: ${r.role} has no real name`);
          by.set(`${r.kind}:${r.id}`, [...(by.get(`${r.kind}:${r.id}`) || []), r.role]);
          count[r.role] = (count[r.role] || 0) + 1;
        }
      }
      for (const [who, roles] of by) {
        for (const [a, b] of CONTRADICTORY_ROLE_PAIRS) if (roles.includes(a) && roles.includes(b)) throw new Error(`${who} holds ${a} and ${b}`);
      }
      for (const [role, cap] of Object.entries(CRISIS_CAST_TUNING.townCaps)) {
        if ((count[role] || 0) > cap) throw new Error(`${role}: ${count[role]} over the cap of ${cap}`);
      }
    });
    expectNoSeedFailures(failures, 'every crisis of 120 generated towns is cast totally');
  }, 240000);
});

describe('the levers stand: a closed house is never a lever (the ruin filter, CRISIS-3 unit 1)', () => {
  // The three shapes every inactivating path stamps (src/domain/institutions/institutionRoster.js):
  // a calamity's ruin, an economic or magic close / moral abolition (`remnant`), an abandonment
  // or a demotion (`removed`). Before the fix the lever read the raw roster through a status
  // regex that knew only the first, so a closed granary was still offered as the famine's lever.
  const SHAPES = [
    (i) => ({ ...i, status: 'ruined', _worldPulseInactive: true }),
    (i) => ({ ...i, status: 'remnant', _worldPulseInactive: true }),
    (i) => ({ ...i, status: 'removed', _worldPulseInactive: true }),
  ];

  it('one closed granary and one standing: the lever names the standing one only', () => {
    const s = town({ institutions: [
      SHAPES[0]({ name: 'Burnt granary' }),
      SHAPES[1]({ name: 'Old granary' }),
      SHAPES[2]({ name: 'Abandoned granary' }),
      { name: 'Town granary' },
    ] });
    expect(deriveLevers(s, 'famine').map((l) => l.institution)).toEqual(['Town granary']);
    s.npcs = s.npcs.filter((n) => !/grain|baker|merchant|mayor/i.test(n.role));
    const houses = leverCandidates(s, 'famine').candidates.filter((r) => r.kind === 'institution').map((r) => r.name);
    expect(houses).toEqual(['Town granary']);
  });

  it('120 generated towns with every second lever house closed: no lever names a closed house', () => {
    const KINDS = Object.keys(STRESS_TYPE_MAP);
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    let levers = 0;
    const failures = collectSeedFailures(Array.from({ length: 120 }, (_, i) => `crisis-cast-${i}`), (seed, i) => {
      const kinds = [KINDS[i % KINDS.length], KINDS[(i * 7 + 3) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j);
      const s = generateSettlementPipeline({ settType: TIERS[i % TIERS.length], stressTypes: kinds }, null, { seed, customContent: {} });
      const entries = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean);
      let k = 0;
      const t = { ...s, institutions: (s.institutions || []).map((inst) => {
        if (!entries.some((e) => CRISIS_LEVERS[e.type]?.house.test(String(inst?.name || '')))) return inst;
        k += 1;
        return k % 2 ? SHAPES[k % 3](inst) : inst;
      }) };
      const live = new Set(t.institutions.filter(isLiveInstitution).map((x) => x.name));
      for (const e of entries) {
        for (const l of deriveLevers(t, e.type)) {
          levers += 1;
          if (!live.has(l.institution)) throw new Error(`${e.type}: lever ${l.institution} is closed`);
        }
        for (const r of leverCandidates(t, e.type).candidates) {
          if (r.kind === 'institution' && !live.has(r.name)) throw new Error(`${e.type}: lever candidate ${r.name} is closed`);
        }
      }
    });
    expectNoSeedFailures(failures, 'no lever of 120 stamped towns names a closed house');
    expect(levers).toBeGreaterThan(100);
  }, 240000);
});

describe('the defence stands: a closed house is never the defender (the ruin filter, CRISIS-3 unit 1b)', () => {
  const SHAPES = [
    (i) => ({ ...i, status: 'ruined', _worldPulseInactive: true }),
    (i) => ({ ...i, status: 'remnant', _worldPulseInactive: true }),
    (i) => ({ ...i, status: 'removed', _worldPulseInactive: true }),
  ];
  const DEF = /garrison|barracks|watch|militia|wall|guard/i;

  it('a closed garrison and a standing watch: the defender house is the watch only', () => {
    const s = town({ institutions: [
      SHAPES[0]({ name: 'Burnt garrison' }),
      SHAPES[1]({ name: 'Old barracks' }),
      SHAPES[2]({ name: 'Abandoned militia hall' }),
      { name: 'Town watch' },
    ] });
    s.npcs = s.npcs.filter((n) => n.id !== 'n2');
    s.powerStructure.factions = s.powerStructure.factions.filter((f) => f.faction !== 'Military/Guard');
    const houses = defenderCandidates(s).candidates.filter((r) => r.kind === 'institution').map((r) => r.name);
    expect(houses).toEqual(['Town watch']);
    const cast = deriveCrisisCast(s, [{ type: 'under_siege' }], 'unit-1b').get('under_siege');
    expect(roleOf(cast, 'defender')).toMatchObject({ kind: 'institution', name: 'Town watch' });
  });

  it('120 generated towns with every second defence house closed: no defender names a closed house', () => {
    const KINDS = Object.keys(STRESS_TYPE_MAP);
    const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    let houses = 0;
    const failures = collectSeedFailures(Array.from({ length: 120 }, (_, i) => `crisis-cast-${i}`), (seed, i) => {
      const kinds = [KINDS[i % KINDS.length], KINDS[(i * 7 + 3) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j);
      const s = generateSettlementPipeline({ settType: TIERS[i % TIERS.length], stressTypes: kinds }, null, { seed, customContent: {} });
      let k = 0;
      const t = { ...s, institutions: (s.institutions || []).map((inst) => {
        if (!DEF.test(String(inst?.name || ''))) return inst;
        k += 1;
        return k % 2 ? SHAPES[k % 3](inst) : inst;
      }) };
      const live = new Set(t.institutions.filter(isLiveInstitution).map((x) => x.name));
      for (const r of defenderCandidates(t).candidates) {
        if (r.kind !== 'institution') continue;
        houses += 1;
        if (!live.has(r.name)) throw new Error(`defender candidate ${r.name} is closed`);
      }
    });
    expectNoSeedFailures(failures, 'no defender of 120 stamped towns names a closed house');
    expect(houses).toBeGreaterThan(40);
  }, 240000);
});
