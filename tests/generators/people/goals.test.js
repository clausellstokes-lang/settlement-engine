/**
 * goals.test.js — THE GOALS REBUILT (the allegiance train, car 4, ALLEGIANCE-CAR4, 2026-11-09;
 * docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §4 I-8, I-9, I-11, I-13 and §6; the chair's rulings J-14, J-15, J-16).
 *
 * Over a slice of the soak corpus (every tier, magic on and off), born through `scripts/audit/soak-review/corpus.mjs`:
 *   - every card the seam deals holds a SHORT and a LONG goal, from two different families, each a filled line;
 *   - every `goal.intent.*.key` is an `NPC_GOAL_CATALOG` key, and every target resolves to a record fact (I-11);
 *   - every pursuit target is real at birth (I-9) and a corrupt enforcer never names its own guild's people, itself or
 *     a card of its own powers (I-8) — each checker RED-FIRST on a planted violation;
 *   - keyed determinism (I-13): removing a card leaves every card whose draw read nothing of it byte-identical;
 *   - the UNCANNY family is gated on magic (none where magic does not function) and capped per settlement;
 *   - the `lawEnforcement` mark (J-14) is on exactly the hunting families; no goal is keyed by title (J-16).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { createPRNG } from '../../../src/kernel/prng.js';
import {
  DRAWN_FAMILIES, GOAL_FAMILY_TUNING, GOAL_INTENT_KEYS, LAW_PURSUIT_TUNING, dealGoals, goalReceiptsOf, houseFill,
  intentKeyOf, isLawFace, goalContextOf, personName, resourceFill,
} from '../../../src/generators/people/goals.js';
import { NPC_GOALS } from '../../../src/domain/npc/npcFacetContract.js';
import { allegianceOf, criminalHousesOf } from '../../../src/domain/people/allegiance.js';
import { INSTITUTION_FAMILIES, isLawEnforcementInstitution } from '../../../src/data/institutionalCatalog.js';
import { GOAL_FAMILY_LINES } from '../../../src/data/people/goalFamilies.js';
import { TITLE_PRESENTATIONS, TITLE_SECRETS } from '../../../src/data/people/titleSecretsPresentations.js';
import { generateSingleNPC } from '../../../src/generators/npcGenerator.js';
import { onStream } from '../../../src/generators/people/representatives.js';
import { titleLinesFor } from '../../../src/generators/people/poolMap.js';

const SEEDS = Array.from({ length: 30 }, (_, k) => k); // five of each tier (TIER_ORDER[i mod 6])
/** @type {any[]} */
let towns = [];

beforeAll(async () => {
  await ensureLaws();
  towns = SEEDS.map((i) => { const s = birth(i); return s.settlement || s; });
}, 240_000);

const dealt = (s) => (s.npcs || []).filter((c) => !c.temporary);

/** I-9 and I-8 as one checker: every pursuit goal's violations, by card. @param {any} s */
function pursuitViolations(s) {
  const out = [];
  const crim = new Set(criminalHousesOf(s).map((h) => h.name));
  const byId = new Map((s.npcs || []).map((c) => [String(c.id), c]));
  for (const c of s.npcs || []) {
    for (const v of ['short', 'long']) {
      const it = c?.goal?.intent?.[v];
      if (!it || (it.kind !== 'warrant' && it.kind !== 'suspicion')) continue;
      const t = byId.get(String(it.target?.id));
      if (!t) { out.push(`${c.id}: ${it.kind} target unresolved`); continue; }
      if (t === c) out.push(`${c.id}: targets itself`);
      const tHouse = t.institution?.kind === 'house' ? t.institution.key : null;
      if (it.kind === 'warrant' && !(tHouse && crim.has(tHouse))) out.push(`${c.id}: warrant on no open criminal face`); // I-9
      if (it.kind === 'suspicion' && !allegianceOf(t)) out.push(`${c.id}: suspicion on no hidden allegiance`); // I-9
      const own = new Set((c.memberships || []).map((m) => m.power));
      if ((t.memberships || []).some((m) => own.has(m.power))) out.push(`${c.id}: targets its own power`); // I-8
      const mine = allegianceOf(c);
      if (mine) { // I-8: a corrupt enforcer never names its own guild's people
        const theirs = allegianceOf(t);
        if (tHouse === mine.house) out.push(`${c.id}: targets its own guild's house`);
        if (mine.power && (t.memberships || []).some((m) => m.power === mine.power)) out.push(`${c.id}: targets its own guild's power`);
        if (theirs && (theirs.house === mine.house || (mine.power && theirs.power === mine.power))) out.push(`${c.id}: targets a fellow agent of its guild`);
      }
    }
  }
  return out;
}

/** I-11: every intent's target resolves to a record fact. @param {any} s */
function unresolvedTargets(s) {
  const ids = new Set((s.npcs || []).map((c) => String(c.id)));
  const powers = new Set((s.powerStructure?.factions || []).map((f) => f.faction || f.name));
  const houses = new Set((s.institutions || []).map((h) => h.name));
  const chains = new Set((s.economicState?.activeChains || []).flatMap((ch) => [ch.chainId, ch.label]));
  const out = [];
  for (const c of s.npcs || []) for (const v of ['short', 'long']) {
    const t = c?.goal?.intent?.[v]?.target;
    if (!t) continue;
    const ok = t.kind === 'npc' ? ids.has(String(t.id)) : t.kind === 'power' ? powers.has(t.id) : t.kind === 'house' ? houses.has(t.id) : t.kind === 'chain' ? chains.has(t.id) : false;
    if (!ok) out.push(`${c.id}.${v}: ${t.kind} ${t.id}`);
  }
  return out;
}

describe('A9: every dealt card holds two goals from two families', () => {
  it('a SHORT and a LONG goal, filled, from different families (the floor apart)', () => {
    let cards = 0; let sameFamily = 0;
    for (const s of towns) for (const c of dealt(s)) {
      cards += 1;
      expect(typeof c.goal?.short, `${s.name} ${c.id} short`).toBe('string');
      expect(typeof c.goal?.long, `${s.name} ${c.id} long`).toBe('string');
      for (const t of [c.goal.short, c.goal.long]) expect(t, `${c.id}: an unfilled slot`).not.toMatch(/\{\w+\}|\[object|undefined|null/);
      if (c.goal.intent.short.family === c.goal.intent.long.family) sameFamily += 1;
    }
    expect(cards, 'anti-vacuity').toBeGreaterThan(300);
    expect(sameFamily, 'the two vantages draw from two families').toBe(0);
  });

  it('every intent key is a catalog key (the FP\'s law: the agency reads goal.intent.key)', () => {
    for (const s of towns) for (const c of dealt(s)) for (const v of ['short', 'long']) {
      const it = c.goal.intent[v];
      expect(NPC_GOALS, `${c.id}.${v} ${it.family}/${it.kind}`).toContain(it.key);
      expect([...DRAWN_FAMILIES, 'UNCANNY']).toContain(it.family);
    }
    // every key the families can name is in the catalog (data, not a draw)
    for (const [family, cells] of Object.entries(GOAL_FAMILY_LINES)) for (const kind of Object.keys(cells)) expect(NPC_GOALS, `${family}/${kind}`).toContain(intentKeyOf(family, kind));
    for (const k of ['secure_supply', 'repay_debt', 'collect_debt', 'protect_ally', 'serve_patron', 'escape_patron', 'keep_agent', 'pursue_warrant', 'prove_allegiance', 'indulge_trait']) expect(NPC_GOALS, `design §6.3's ${k}`).toContain(k);
    expect(Object.keys(GOAL_INTENT_KEYS).sort()).toEqual([...DRAWN_FAMILIES, 'UNCANNY'].sort());
  });

  it('I-11: every target resolves to a record id or fact', () => {
    let targets = 0;
    for (const s of towns) { expect(unresolvedTargets(s), s.name).toEqual([]); targets += dealt(s).filter((c) => c.goal.intent.short.target).length; }
    expect(targets, 'anti-vacuity').toBeGreaterThan(100);
  });
});

describe('THE LAW\'S PURSUIT (§3.5, §6.4): I-8 and I-9', () => {
  it('every pursuit target is real and never the enforcer\'s own (red-first: a planted violation reds the checker)', () => {
    let pursuits = 0;
    for (const s of towns) {
      expect(pursuitViolations(s), s.name).toEqual([]);
      pursuits += dealt(s).filter((c) => ['warrant', 'suspicion'].includes(c.goal.intent.short.kind)).length;
    }
    expect(pursuits, 'anti-vacuity: the slice deals pursuits').toBeGreaterThan(0);
    // RED-FIRST: plant a corrupt enforcer's warrant on its own guild's house, and a suspicion on a clean card
    const s = JSON.parse(JSON.stringify(towns.find((t) => dealt(t).some((c) => c.goal.intent.short.kind === 'warrant'))));
    const law = s.npcs.find((c) => c.goal?.intent?.short?.kind === 'warrant');
    const target = s.npcs.find((c) => String(c.id) === String(law.goal.intent.short.target.id));
    law.allegiance = { power: null, house: target.institution.key, vector: 'greed', via: 'office', handler: target.id, share: 0.15, veiled: true, covert: true };
    expect(pursuitViolations(s).some((v) => v.includes("its own guild's house"))).toBe(true);
    const clean = s.npcs.find((c) => !c.allegiance && c !== law && c !== target);
    law.goal.intent.short = { family: 'ALLEGIANCE', kind: 'suspicion', key: 'prove_allegiance', target: { kind: 'npc', id: clean.id } };
    expect(pursuitViolations(s).some((v) => v.includes('no hidden allegiance'))).toBe(true);
    law.goal.intent.short.target.id = law.id;
    expect(pursuitViolations(s).some((v) => v.includes('targets itself'))).toBe(true);
  });

  it('the chances are DRAFT dials inside their clamps; 0 pursuits where neither an open criminal face nor an agent stands', () => {
    expect(Object.isFrozen(LAW_PURSUIT_TUNING) && Object.isFrozen(LAW_PURSUIT_TUNING.warrant)).toBe(true);
    for (const s of towns) {
      const crim = new Set(criminalHousesOf(s).map((h) => h.name));
      const open = s.npcs.some((c) => c.institution?.kind === 'house' && crim.has(c.institution.key));
      const agents = s.npcs.some((c) => allegianceOf(c));
      if (open || agents) continue;
      expect(dealt(s).filter((c) => ['warrant', 'suspicion'].includes(c.goal.intent.short.kind) || ['warrant', 'suspicion'].includes(c.goal.intent.long.kind)).map((c) => c.id), s.name).toEqual([]);
    }
  });

  it('J-14: the lawEnforcement mark is on the militia, watch, barracks, garrison, citadel, warden and prison families — not the courthouse', () => {
    const marked = INSTITUTION_FAMILIES.filter((f) => f.shared?.lawEnforcement === true).map((f) => f.shared?.name || Object.values(f.at)[0].name).sort();
    expect(marked).toEqual(['Barracks', 'Citadel', 'Citizen militia', 'Small prison/stocks', 'Village watch', "Warden's Lodge"].sort());
    for (const name of ['Town watch', 'Professional city watch', 'Garrison', 'Multiple garrisons', 'Large prison', 'Massive prison', 'Citadel']) expect(isLawEnforcementInstitution({ name }), name).toBe(true);
    for (const name of ['Courthouse', 'Multiple courthouses', 'Thieves\' guild (powerful)', 'Fish market']) expect(isLawEnforcementInstitution({ name }), name).toBe(false);
    expect(isLawEnforcementInstitution({ name: 'Town watch', isCustom: true }), 'a DM-authored house carries no mark').toBe(false);
  });
});

describe('THE UNCANNY FAMILY (the owner\'s word: magic ON only as the gate; rare, scaling with size)', () => {
  it('none where magic does not function; never more than the cap per settlement', () => {
    let off = 0;
    for (const s of towns) {
      const n = dealt(s).filter((c) => c.goal.intent.short.family === 'UNCANNY' || c.goal.intent.long.family === 'UNCANNY').length;
      expect(n, s.name).toBeLessThanOrEqual(GOAL_FAMILY_TUNING.uncanny.capPerSettlement);
      if (goalContextOf(s, s.npcs, s.relationships).magic) continue;
      off += 1;
      expect(n, `${s.name}: magic off`).toBe(0);
    }
    expect(off, 'anti-vacuity: the slice holds magic-off towns').toBeGreaterThan(0);
  });

  it('the chance per card grows with the tier (never a flat share), born DRAFT', () => {
    const p = GOAL_FAMILY_TUNING.uncanny.perCard;
    const order = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].map((t) => p[t]);
    for (let k = 1; k < order.length; k += 1) expect(order[k]).toBeGreaterThan(order[k - 1]);
    expect(Object.isFrozen(GOAL_FAMILY_TUNING.uncanny.perCard)).toBe(true);
  });

  it('a forced roll deals an UNCANNY goal only where magic functions (the gate, executed)', () => {
    const s = towns.find((t) => t.tier === 'metropolis' && goalContextOf(t, t.npcs, t.relationships).magic);
    const cards = s.npcs.filter((c) => !c.temporary).map((c) => ({ ...c, goal: null }));
    const always = { fork: (l) => { const r = createPRNG(`always::${l}`); return { ...r, fork: (m) => ({ ...createPRNG(`always::${l}::${m}`), chance: () => true }) }; } };
    const on = dealGoals(s, cards, s.relationships, always);
    expect(on.filter((c) => c.goal.intent.short.family === 'UNCANNY').length).toBe(GOAL_FAMILY_TUNING.uncanny.capPerSettlement);
    const muggle = { ...s, config: { ...s.config, magicExists: false } };
    const off = dealGoals(muggle, cards, s.relationships, always);
    expect(off.filter((c) => c.goal.intent.short.family === 'UNCANNY').length).toBe(0);
  });
});

describe('I-13: keyed determinism', () => {
  it('removing a card leaves every card whose draw read nothing of it byte-identical', () => {
    let compared = 0;
    for (const s of towns.filter((t) => t.npcs.length >= 20).slice(0, 3)) {
      const cards = s.npcs.filter((c) => !c.temporary).map((c) => ({ ...c, goal: null }));
      const X = cards[Math.floor(cards.length / 2)];
      const full = dealGoals(s, cards, s.relationships, createPRNG(`i13::${s.name}`));
      const rest = cards.filter((c) => c !== X);
      const ties = s.relationships.filter((t) => t.from !== X.id && t.to !== X.id);
      const less = dealGoals(s, rest, ties, createPRNG(`i13::${s.name}`));
      const rFull = new Map(goalReceiptsOf(full).map((r) => [r.id, r]));
      const rLess = new Map(goalReceiptsOf(less).map((r) => [r.id, r]));
      const byId = new Map(less.map((c) => [c.id, c]));
      const uncanny = [...rFull.values(), ...rLess.values()].some((r) => r.uncanny?.landed);
      for (const c of full) {
        if (c.id === X.id || uncanny) continue;
        const a = rFull.get(c.id); const b = rLess.get(c.id);
        if (a.refs.includes(X.id) || a.refused || b.refused) continue;
        expect(byId.get(c.id).goal, `${s.name} ${c.id}`).toEqual(c.goal);
        compared += 1;
      }
    }
    expect(compared, 'anti-vacuity').toBeGreaterThan(20);
  });
});

describe('the fills (WRITE-GOALS §6, bound exactly) and J-16', () => {
  it('the {house} noun table, the {resource} goods and the person slot', () => {
    expect(houseFill('Mills (2-5)')).toBe('the mills');
    expect(houseFill('Inns and taverns (district)')).toBe('the inns and taverns');
    expect(houseFill('Multiple adventurers\' guilds')).toBe("the adventurers' guilds");
    expect(houseFill('Massive prison')).toBe('the prison');
    expect(houseFill('Weavers/Textile workers')).toBe('the weavers');
    expect(houseFill('Cooper')).toBe("the cooper's yard");
    expect(houseFill('Contract killer')).toBe("the contract killer's people");
    expect(houseFill('Dairy farmer')).toBe('the dairy');
    expect(houseFill('Fish market')).toBe('the fish market');
    expect(resourceFill('Iron + fuel')).toBe('iron and fuel');
    expect(resourceFill('Trade access + commodities')).toBe('');
    expect(resourceFill('Magical ley lines')).toBe('');
    expect(personName({ name: 'Milko Solovyov (the lanista)' })).toBe('Milko Solovyov');
  });

  it('J-16: no goal by title — the module never reads a card\'s title and never imports the title pools', () => {
    const src = readFileSync(new URL('../../../src/generators/people/goals.js', import.meta.url), 'utf8');
    expect(src).not.toMatch(/\.title\b/);
    expect(src).not.toMatch(/titleSecretsPresentations|POOL_BY_TITLE|NPC_FACTION_GOALS/);
  });

  it('the law face is read through the mark, not the title', () => {
    for (const s of towns) {
      const ctx = goalContextOf(s, s.npcs, s.relationships);
      for (const c of s.npcs) if (isLawFace(c, ctx)) expect(c.institution.kind).toBe('house');
    }
  });
});

describe('ITEM 15 (the design §6.5, J-16): the secret and the presentation by title, through the pool map', () => {
  const face = (title, held = new Set()) => onStream(createPRNG(`item15::${title}`), () => generateSingleNPC(
    'Master Craftsman', 'master', 'other', 'germanic', 'town', {}, [], { titles: new Set(), themes: new Set(), tells: new Set(), speech: new Set(), goals: new Set(), secrets: held }, null, { hook: false, title },
  ));
  it('a title the table writes draws its own secret and presentation; any other title keeps the category pool', () => {
    expect(Object.keys(TITLE_SECRETS)).toHaveLength(147);
    for (const title of ['the miller', 'the cooper', 'the scribe']) {
      const card = face(title);
      expect(TITLE_SECRETS[title].map((r) => r.secret), title).toContain(card.secret.what);
      expect(TITLE_PRESENTATIONS[title].map((r) => r.impression), title).toContain(card.presentation.impression);
      expect(card.goal, 'no goal by title (J-16): the goal is A9\'s').toBeNull();
    }
    expect(titleLinesFor('the head of Elder Council'), 'a mint\'s title keeps its category').toBeNull();
    const other = face('the head of Elder Council');
    const all = Object.values(TITLE_SECRETS).flat().map((r) => r.secret);
    expect(all, 'anchored: a title outside the table draws no title line').not.toContain(other.secret?.what);
  });
  it('REVIEW-INTAKE-4: a title whose three secrets the roster already holds falls back to its category, never repeats one', () => {
    const held = new Set(TITLE_SECRETS['the miller'].map((r) => r.secret));
    const card = face('the miller', held);
    expect(TITLE_SECRETS['the miller'].map((r) => r.secret)).not.toContain(card.secret?.what);
  });
  it('on the slice, every titled face born with its own presentation keeps a title line (the secret-driven modes apart)', () => {
    let titled = 0; let own = 0;
    for (const s of towns) for (const c of s.npcs) {
      if (!TITLE_PRESENTATIONS[c.title]) continue;
      titled += 1;
      if (TITLE_PRESENTATIONS[c.title].some((r) => r.impression === c.presentation?.impression)) own += 1;
    }
    expect(titled, 'anti-vacuity').toBeGreaterThan(300);
    expect(own / titled, 'the title\'s own first impression reaches nine in ten titled faces').toBeGreaterThan(0.9);
  });
});
