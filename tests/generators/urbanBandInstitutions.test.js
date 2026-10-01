/**
 * THE URBAN BAND AT GENERATION (owner-approved 2026-09-30) — what the registry rebuild
 * changed about the settlements the engine actually produces, pinned over fixed seeds.
 *
 *   G1  THE WEIGHTED EXCLUSIVE GROUP: a group's seat goes to a member in proportion to its
 *       chance, not to whichever member the catalog lists first. Before: 'City
 *       administration' (0.92) governed 1 city in 100, and 'Royal seat', 'Democratic
 *       assembly' and 'City-state government' governed none of 200.
 *   G2  THE ROW GUARDS: a stated population floor and a named prerequisite hold at
 *       generation. Before: 'Cathedral (10,000+ only)' stood in 14 of 58 cathedral cities
 *       under 10,000; 'Gates (if walled)' stood without walls in 46 of 123 towns.
 *   G3  THE CUMULATIVE LAWS AT GENERATION: a town function exists in cities and
 *       metropolises; a metropolis carries its own scale rows and never a city's beside them.
 *       Before: Beast trainers appeared in no metropolis; 191 of 200 metropolises listed
 *       'Parish churches (10-30)' beside '(50-100+)'; 'Massive walls and fortifications' could
 *       never generate (0 of 200).
 *   G4  NO ROLLED ROW IS DELETED AS UNSUPPORTED: the dependency table agrees with the tiers
 *       the registry rolls at. Before: town Citadel and town Printing house were deleted by
 *       the coherence pass every time they were rolled.
 *   G5  A MAGIC-FREE WORLD CERTIFIES ITS OWN LAW: once the gates read the declared licence
 *       (MF-CH2B), the faith rows licensed `none` (Druid Circle, Elder Grove Council, Warden's
 *       Lodge) enter magic-free worlds, and the world law's own receipt must not convict them.
 *       Measured on the combined tip before J20/J21: 25 of 40 magic-free cities failed
 *       `world_law_magic` on those rows' descriptions, and 19 of 40 villages on the name
 *       'Druid Circle' alone (0 of 40 at base, where the Magic shelf struck them).
 *   G6  A DRUID IS A PRIEST WHERE MAGIC DOES NOT WORK (J30, the owner, 2026-10-01: "druid is
 *       magic ... You can keep druid, only if you exclude magical services in non magic
 *       settings"; "druid, in this case should then be paired as religious authorities in non
 *       magic settings"; "their effect of food or defense does not exist in non magic
 *       settings"). In both magic-free readings of the world law (`magicExists: false`, and a
 *       magic dial at 0), Druid Circle and Elder Grove Council carry the faction role
 *       'religion' and are backed by the religious faction; no druid or faith service asserts
 *       working magic while mundane healing stays; and removing a druid row moves no food,
 *       food-balance, food-chain or defence reading. Magic worlds keep the authored role and
 *       every druid effect. Warden's Lodge is defence, not druid (the owner, 2026-10-01:
 *       "Warden's Lodge stays defense, not druid"): the rule never catches it, it keeps its own
 *       authored role, and it still works the hunting chain where magic does not work.
 *       Measured at base f41266775: the roles read 'magic' and 'military',
 *       Elder Grove Council alone kept the forage chain running in 36 of 39 magic-free towns and
 *       cities holding it, and a Druid Circle opened an 11-point magical defence in every
 *       dead-dial village holding one (14 of 14).
 *
 * Seeds are fixed, so every arm is deterministic: it passes or fails the same way on
 * every run.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { deriveFoodBalanceAnalysis } from '../../src/generators/economy/foodBalance.js';
import { generateDefenseProfile } from '../../src/generators/defenseGenerator.js';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { institutionBackingFactionName } from '../../src/domain/display/institutionProfile.js';
import { druidicFaithRole } from '../../src/domain/arcaneInstitutionIdentity.js';
import { computeEffectiveMagicPresence } from '../../src/generators/priorityHelpers.js';
import { POWER_ROLES_BY_CATEGORY } from '../../src/data/historyData.js';
import { classifyMagicForm } from '../../src/domain/worldPulse/magicForms.js';

const ROUTES = ['road', 'port', 'river', 'crossroads', 'isolated'];
const cache = new Map();
function settlements(tier, count) {
  const key = `${tier}:${count}`;
  if (!cache.has(key)) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push(generateSettlementPipeline(
        { settType: tier, tradeRouteAccess: ROUTES[i % ROUTES.length] },
        null,
        { seed: `urban-band-${tier}-${i}`, customContent: {} },
      ));
    }
    cache.set(key, out);
  }
  return cache.get(key);
}
const names = (s) => new Set((s.institutions || []).map(i => i.name));

describe('G1 — the weighted exclusive group', () => {
  it('every city government form governs some city, and none governs most of them', () => {
    const forms = ['Mayor and council', 'Guild consortium', 'Noble governor', 'Merchant oligarchy',
      'City-state government', 'Democratic assembly', 'Royal seat', 'City administration'];
    const tally = Object.fromEntries(forms.map(f => [f, 0]));
    const cities = settlements('city', 120);
    for (const s of cities) for (const f of forms) if (names(s).has(f)) tally[f]++;
    for (const f of forms) expect(tally[f], `${f} governs at least one of 120 cities`).toBeGreaterThan(0);
    const top = Math.max(...Object.values(tally));
    expect(top, `no single form governs half of 120 cities (${JSON.stringify(tally)})`).toBeLessThan(60);
  });

  it('a group still seats at most one member', () => {
    for (const s of settlements('city', 120)) {
      const govs = (s.institutions || []).filter(i => i.exclusiveGroup === 'government');
      expect(govs.length, `${s.name}: government seats`).toBeLessThanOrEqual(1);
    }
  });
});

describe('G2 — the row guards hold at generation', () => {
  it('no cathedral stands in a city under 10,000, and cathedral cities exist', () => {
    const cities = settlements('city', 120);
    const withCathedral = cities.filter(s => names(s).has('Cathedral (10,000+ only)'));
    expect(withCathedral.length, 'anti-vacuity').toBeGreaterThan(0);
    for (const s of withCathedral) expect(s.population, s.name).toBeGreaterThanOrEqual(10000);
  });

  it('no town has gates without walls, and gated towns exist', () => {
    const towns = settlements('town', 80);
    const gated = towns.filter(s => names(s).has('Gates (if walled)'));
    expect(gated.length, 'anti-vacuity').toBeGreaterThan(0);
    for (const s of gated) expect(names(s).has('Town walls'), s.name).toBe(true);
  });

  it('no post relay station stands without a coaching inn, and relay stations exist', () => {
    const all = [...settlements('town', 80), ...settlements('city', 120)];
    const relays = all.filter(s => names(s).has('Post relay station'));
    expect(relays.length, 'anti-vacuity').toBeGreaterThan(0);
    for (const s of relays) expect(names(s).has('Coaching inn'), s.name).toBe(true);
  });
});

describe('G3 — the cumulative laws at generation', () => {
  it('Beast trainers is rolled natively in towns, cities and metropolises', () => {
    for (const [tier, count] of [['town', 80], ['city', 120], ['metropolis', 60]]) {
      const native = settlements(tier, count)
        .filter(s => (s.institutions || []).some(i => i.name === 'Beast trainers' && i.source === 'generated'));
      expect(native.length, `${tier}: native Beast trainers`).toBeGreaterThan(0);
    }
  });

  it('a metropolis carries its own scale rows and never a city\'s beside them', () => {
    const metros = settlements('metropolis', 60);
    for (const s of metros) {
      const n = names(s);
      expect(n.has('Parish churches (10-30)') && n.has('Parish churches (50-100+)'), `${s.name}: both parish scales`).toBe(false);
      expect(n.has('Housing (1000-5000 structures)'), `${s.name}: city housing`).toBe(false);
      expect(n.has('Housing (5000+ structures)'), `${s.name}: metropolis housing`).toBe(true);
      expect(n.has('Massive walls and fortifications'), `${s.name}: metropolis walls`).toBe(true);
    }
  });

  it('a city is larger than a town, and a metropolis larger than a city, in institutions', () => {
    const mean = (xs) => xs.reduce((a, s) => a + (s.institutions || []).length, 0) / xs.length;
    const town = mean(settlements('town', 80));
    const city = mean(settlements('city', 120));
    const metro = mean(settlements('metropolis', 60));
    expect(city, `city ${city} > town ${town}`).toBeGreaterThan(town);
    expect(metro, `metropolis ${metro} > city ${city}`).toBeGreaterThan(city);
  });
});

describe('G4 — no rolled row is deleted as unsupported', () => {
  it('the coherence pass removes no catalog row for a missing dependency at any urban tier', () => {
    const removed = [];
    for (const [tier, count] of [['town', 80], ['city', 120], ['metropolis', 60]]) {
      for (const s of settlements(tier, count)) {
        for (const t of s.simulationTrace || []) {
          if (t.step === 'coherenceRepairPass' && t.result === 'removed'
            && (t.causes || []).some(c => c.source === 'coherence.unsupported_institution')) {
            removed.push(`${tier}/${s.name}: ${t.targetId}`);
          }
        }
      }
    }
    expect(removed).toEqual([]);
  });
});

describe('G5 — a magic-free world certifies its own world-law magic check', () => {
  it('no magic-free settlement fails world_law_magic, at any tier, and the druid rows do appear', () => {
    const failed = [];
    let druidRows = 0;
    for (const tier of ['hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 12; i++) {
        const s = generateSettlementPipeline(
          { settType: tier, culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated',
            magicExists: false, priorityMagic: 100, priorityReligion: 90 },
          null,
          { seed: `urban-band-nomagic-${tier}-${i}`, customContent: {} },
        );
        const check = (s.generationCoherenceReceipt?.checks || []).find(k => k.id === 'world_law_magic');
        if (!check) failed.push(`${tier}-${i}: no world_law_magic check ran`);
        else if (check.status !== 'pass') failed.push(`${tier}-${i}: ${check.status} ${JSON.stringify((check.findings || [])[0] || {}).slice(0, 140)}`);
        druidRows += (s.institutions || []).filter(r => /^(Druid Circle|Elder Grove Council|Warden's Lodge)$/.test(r.name)).length;
      }
    }
    expect(druidRows, 'no faith row entered a magic-free world, so the certification proves nothing about them').toBeGreaterThan(5);
    expect(failed).toEqual([]);
  });
});

// The two magic-free readings the world law admits (generationContext `magicEnabled`: the
// switch off, or the dial at 0), and one magic world.
const G6_WORLDS = {
  noMagic: { magicExists: false, priorityMagic: 100 },
  deadDial: { magicExists: true, priorityMagic: 0 },
  magic: { magicExists: true, priorityMagic: 90 },
};
const DRUIDIC = /^(Druid Circle|Elder Grove Council)$/;
const g6Cache = new Map();
function g6World(kind) {
  if (!g6Cache.has(kind)) {
    const out = [];
    for (const settType of ['village', 'town', 'city', 'metropolis']) {
      for (const culture of ['celtic', 'germanic', 'norse']) {
        for (let i = 0; i < 5; i++) {
          out.push(generateSettlementPipeline(
            { settType, culture, terrainOverride: 'forest', tradeRouteAccess: i % 2 ? 'isolated' : 'road',
              priorityReligion: 90, ...G6_WORLDS[kind] },
            null,
            { seed: `urban-band-druid-${kind}-${settType}-${culture}-${i}`, customContent: {} },
          ));
        }
      }
    }
    g6Cache.set(kind, out);
  }
  return g6Cache.get(kind);
}
const druidRows = (s) => (s.institutions || []).filter(r => DRUIDIC.test(r.name));
// Every food and defence reading a druid row could move, read off the settlement's own roster.
function foodAndDefence(s, roster) {
  const cfg = s.config || {};
  const dial = cfg.magicExists === false ? 0 : (cfg.priorityMagic ?? 50);
  return JSON.stringify({
    food: generateFoodSecurity(s.tier, roster, cfg),
    balance: deriveFoodBalanceAnalysis(s.population, null, roster, { ...cfg, tier: s.tier }, s.economicState?.foodSecurity || null),
    chains: computeActiveChains(roster, cfg.nearbyResources || [], s.tier, cfg.tradeRouteAccess, [], [], dial)
      .filter(c => c.needKey === 'food_security' || c.needKey === 'defense_security'),
    defence: generateDefenseProfile({ ...s, institutions: roster }),
  });
}
const druidMoves = (s, row) => foodAndDefence(s, s.institutions) !== foodAndDefence(s, s.institutions.filter(r => r !== row));

describe('G6 — a druid is a priest where magic does not work (J30)', () => {
  it('in a magic-free world every druid institution is paired with the religious authorities', () => {
    const wrong = [];
    let rows = 0;
    let backed = 0;
    for (const kind of ['noMagic', 'deadDial']) {
      for (const s of g6World(kind)) {
        const factions = s.powerStructure?.factions || [];
        const hasFaith = factions.some(f => f.category === 'religious');
        for (const r of druidRows(s)) {
          rows++;
          if (r.priorityCategory !== 'religion') wrong.push(`${kind}/${s.name}: ${r.name} role ${r.priorityCategory}`);
          if (!hasFaith) continue;
          backed++;
          const backer = institutionBackingFactionName(r, s);
          const faction = factions.find(f => (f.faction || f.name) === backer);
          if (faction?.category !== 'religious') wrong.push(`${kind}/${s.name}: ${r.name} backed by ${backer}`);
        }
      }
    }
    expect(rows, 'druid rows in magic-free worlds').toBeGreaterThan(40);
    expect(backed, 'druid rows in a settlement with a religious faction').toBeGreaterThan(20);
    expect(wrong).toEqual([]);
  });

  it('in a magic world every druid institution keeps its authored pairing', () => {
    const wrong = [];
    let rows = 0;
    for (const s of g6World('magic')) {
      for (const r of druidRows(s)) {
        rows++;
        const authored = institutionalCatalog[s.tier]?.Religious?.[r.name]?.priorityCategory;
        if (!authored || r.priorityCategory !== authored) wrong.push(`${s.name}: ${r.name} role ${r.priorityCategory}, authored ${authored}`);
      }
    }
    expect(rows, 'druid rows in magic worlds').toBeGreaterThan(20);
    expect(wrong).toEqual([]);
  });

  it('no druid or faith service in a magic-free world asserts working magic, and mundane healing stays', () => {
    const asserting = [];
    let faithServices = 0;
    let healing = 0;
    for (const kind of ['noMagic', 'deadDial']) {
      for (const s of g6World(kind)) {
        const law = createGenerationWorldLaw(s.config || {});
        if (law.magicEnabled) asserting.push(`${kind}/${s.name}: the world law reads magic as working`);
        const byName = new Map((s.institutions || []).map(i => [i.name, i]));
        for (const list of Object.values(s.availableServices || {})) {
          for (const sv of list || []) {
            const provider = byName.get(sv.institution);
            if (!provider || !(provider.category === 'Religious' || (provider.tags || []).includes('religious'))) continue;
            faithServices++;
            if (/heal|hospital|sick|infirm/i.test(`${sv.name} ${sv.desc || ''}`)) healing++;
            if (!law.allowsMagicClaim(`${sv.name} ${sv.desc || sv.description || ''}`)) {
              asserting.push(`${kind}/${s.name}: ${sv.institution} :: ${sv.name}`);
            }
          }
        }
      }
    }
    expect(faithServices, 'faith services in magic-free worlds').toBeGreaterThan(100);
    expect(healing, 'mundane faith healing stays in magic-free worlds').toBeGreaterThan(5);
    expect(asserting).toEqual([]);
  });

  it('in a magic-free world a druid institution adds no food and no defence', () => {
    const moved = [];
    let rows = 0;
    for (const kind of ['noMagic', 'deadDial']) {
      for (const s of g6World(kind)) {
        for (const r of druidRows(s)) {
          rows++;
          if (druidMoves(s, r)) moved.push(`${kind}/${s.tier}/${s.name}: ${r.name}`);
        }
      }
    }
    expect(rows, 'druid rows in magic-free worlds').toBeGreaterThan(40);
    expect(moved).toEqual([]);
  });

  it('in a magic world the druids still feed and guard, so the instrument above can see them', () => {
    let rows = 0;
    let moving = 0;
    for (const s of g6World('magic')) {
      for (const r of druidRows(s)) {
        rows++;
        if (druidMoves(s, r)) moving++;
      }
    }
    expect(rows, 'druid rows in magic worlds').toBeGreaterThan(20);
    expect(moving, `druid rows whose removal moves food or defence in a magic world (of ${rows})`).toBeGreaterThan(rows / 2);
  });

  it("Warden's Lodge stays defence, not druid: the rule never catches it in a magic-free world", () => {
    const druidSet = new Set();
    for (const shelves of Object.values(institutionalCatalog)) {
      for (const shelfRows of Object.values(shelves)) {
        for (const name of Object.keys(shelfRows)) if (druidicFaithRole(name, false)) druidSet.add(name);
      }
    }
    expect([...druidSet].sort(), 'the druid set is derived from the registry').toEqual(['Druid Circle', 'Elder Grove Council']);
    const wrong = [];
    let lodges = 0;
    for (const kind of ['noMagic', 'deadDial']) {
      for (const s of g6World(kind)) {
        for (const r of (s.institutions || []).filter(x => x.name === "Warden's Lodge")) {
          lodges++;
          const authored = institutionalCatalog[s.tier]?.Defense?.[r.name]?.priorityCategory;
          if (r.priorityCategory === 'religion' || r.priorityCategory !== authored) wrong.push(`${kind}/${s.name}: role ${r.priorityCategory}, authored ${authored}`);
          const hunting = computeActiveChains(s.institutions, ['hunting_grounds'], s.tier, s.config?.tradeRouteAccess, [], [], 0)
            .find(c => c.chainId === 'hunting');
          if (!(hunting?.processingInstitutions || []).includes("Warden's Lodge")) wrong.push(`${kind}/${s.name}: the lodge works no hunting chain`);
        }
      }
    }
    expect(lodges, "Warden's Lodges seated in magic-free towns").toBeGreaterThan(5);
    expect(wrong).toEqual([]);
  });
});

describe("G7 — Warden's Lodge defends in every world, and divine defence needs working magic (J31, J32)", () => {
  // The owner, 2026-10-01: "Warden's Lodge stays defense, not druid" and "faith is not magic only applies to the
  // institutions, but not divine magic substitute services". Red on d04a2f63e: no magic-free lodge raised monster
  // defence (0 of 18), and divine magical defence opened in 60 of 60 dial-0 towns, cities and metropolises.
  it("a seated Warden's Lodge raises monster defence in magic-free worlds", () => {
    let lodges = 0;
    const flat = [];
    for (const kind of ['noMagic', 'deadDial']) {
      for (let i = 0; i < 20; i++) {
        const s = generateSettlementPipeline(
          { settType: 'town', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'road', priorityReligion: 90, ...G6_WORLDS[kind] },
          null, { seed: `urban-band-wardens-${kind}-${i}`, customContent: {} },
        );
        const lodge = (s.institutions || []).find(r => r.name === "Warden's Lodge");
        if (!lodge) continue;
        lodges += 1;
        const withLodge = generateDefenseProfile(s).scores.monster;
        const without = generateDefenseProfile({ ...s, institutions: s.institutions.filter(r => r !== lodge) }).scores.monster;
        if (!(withLodge > without)) flat.push(`${kind}-${i}: ${withLodge} vs ${without}`);
      }
    }
    expect(lodges, 'no magic-free town seated a lodge, so the arm proves nothing').toBeGreaterThan(5);
    expect(flat).toEqual([]);
  });

  it('no divine magical defence opens where the world law reads no magic, and it still opens where magic works', () => {
    const divine = {};
    for (const kind of ['noMagic', 'deadDial', 'magic']) {
      let n = 0;
      for (const settType of ['town', 'city', 'metropolis']) {
        for (let i = 0; i < 6; i++) {
          const s = generateSettlementPipeline(
            { settType, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', priorityReligion: 90, ...G6_WORLDS[kind] },
            null, { seed: `urban-band-divine-${kind}-${settType}-${i}`, customContent: {} },
          );
          if (generateDefenseProfile(s).traditions?.hasDivine === true) n += 1;
        }
      }
      divine[kind] = n;
    }
    expect({ noMagic: divine.noMagic, deadDial: divine.deadDial }).toEqual({ noMagic: 0, deadDial: 0 });
    expect(divine.magic, 'the magic world is the control: divine defence still opens there').toBeGreaterThan(9);
  });
});

describe("G8 — Warden's Lodge is no druid in a magic world either (J33)", () => {
  // The owner, 2026-10-01: "Warden's Lodge stays defense, not druid". J31 cleared the lodge's text, pairing and
  // defence reading, but five more readers still counted it a druid or a caster in a magic world: the chains' druid
  // tradition, druidic cultivation in both food readers, folk magic presence and the Druid Elder's seat. Red on 731e19597.
  const lodge = { name: "Warden's Lodge", category: 'Defense', ...institutionalCatalog.town.Defense["Warden's Lodge"] };
  it("seating a Warden's Lodge in a magic town moves no druid or magic reading", () => {
    const moved = [];
    let towns = 0;
    for (const s of g6World('magic')) {
      if (s.tier !== 'town') continue;
      towns++;
      const cfg = s.config || {};
      const without = (s.institutions || []).filter(r => r.name !== lodge.name);
      // Every resource DEPLETED, so a druid tradition has chains to sustain; the chains the lodge works as a hunting
      // processor (a mundane trade) are set aside, and the rest must not move.
      const res = cfg.nearbyResources || [];
      const chainsOf = (roster) => computeActiveChains(roster, res, s.tier, cfg.tradeRouteAccess, [], res, cfg.priorityMagic ?? 50);
      const worked = new Set(chainsOf([...without, lodge]).filter(c => JSON.stringify(c).includes(lodge.name)).map(c => c.chainId));
      const read = (roster) => ({
        food: JSON.stringify(generateFoodSecurity(s.tier, roster, cfg)),
        balance: JSON.stringify(deriveFoodBalanceAnalysis(s.population, null, roster, { ...cfg, tier: s.tier }, s.economicState?.foodSecurity || null)),
        chains: JSON.stringify(chainsOf(roster).filter(c => !worked.has(c.chainId))),
        presence: computeEffectiveMagicPresence(roster, cfg).score,
      });
      const before = read(without);
      const after = read([...without, lodge]);
      for (const k of Object.keys(before)) if (before[k] !== after[k]) moved.push(`${s.name}: ${k}`);
    }
    expect(towns, 'magic-world towns').toBeGreaterThan(10);
    expect(moved).toEqual([]);
  });

  it('the lodge opens no druid office and no magic form', () => {
    const druidKeys = Object.values(POWER_ROLES_BY_CATEGORY).flat()
      .filter(r => /druid/i.test(`${r.role} ${r.title}`)).flatMap(r => r.requiresInstKeyword || []);
    expect(druidKeys.length, 'a druid office gated on an institution keyword').toBeGreaterThan(0);
    expect(druidKeys.filter(k => "warden's lodge".includes(k))).toEqual([]);
    expect(classifyMagicForm(lodge)).toBeNull();
  });
});
