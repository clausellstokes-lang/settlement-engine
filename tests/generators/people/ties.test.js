/**
 * ties.test.js — ONE OUTGOING TIE PER CARD (the people car, PEOPLE-4 TIES; the chair's ruling R-P7
 * in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §1; the brief
 * docs/chair/2026-11-07/BRIEF-PEOPLE-4-TIES-2026-11-07.md §1 step 2).
 *
 * The owner (ODQ §934.105): "in a single NPC card they can only have one relationship with
 * another. But an NPC, if called by two or more (including itself) unique NPCs could have multiple
 * relationships." The claims: out-degree EXACTLY 1 for every card with a peer and 0 for a lone
 * face, on the golden 525 and the soak 1,000's first 300; no self-tie; `from` and `to` on the
 * roster; every kind drawn exists in the archetype table; the undirected pair is not written; the
 * same seed gives the same ties; the card reads its own tie first, then the ties naming it.
 *
 * A CARD is a member of the cast the coherence seam ties: every NPC but the crisis cast's
 * temporary person (`temporary: true`, appended by resolveCrisisCast after assembly and removed
 * when its crisis resolves — lane PEOPLE-2's, never a face).
 *
 * BUDGETS: the two corpus arms birth 525 and 300 full settlements; each carries an explicit
 * per-test budget at its measured cost (the 525 ~75 s, the 300 ~70 s on the lane's machine),
 * never the suite-wide timeout.
 */
import { describe, expect, it } from 'vitest';
import { goldenCorpus } from '../../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { STRESS_ECONOMIC_EFFECTS } from '../../../src/data/npcData.js';
import { createPRNG } from '../../../src/kernel/prng.js';
import { SHARED_POWER_FACTOR, drawTies, sharesPower, targetWeightOf } from '../../../src/generators/people/ties.js';
import { cardTieLines, tiesOfCard } from '../../../src/domain/relationships/cardTies.js';

const KINDS = new Set(Object.values(STRESS_ECONOMIC_EFFECTS).map((a) => a.type));

/** The claims every settlement of both corpora must hold. @param {any} s @param {string} label */
function assertTies(s, label) {
  const cast = (s.npcs || []).filter((n) => n && !n.temporary);
  const ids = new Set(cast.map((n) => n.id));
  const ties = s.relationships || [];
  const out = new Map(cast.map((n) => [n.id, 0]));
  for (const t of ties) {
    expect(t.from, `${label}: a tie has its source`).toBeDefined();
    expect(ids.has(t.from), `${label}: ${t.from} is on the roster`).toBe(true);
    expect(ids.has(t.to), `${label}: ${t.to} is on the roster`).toBe(true);
    expect(t.from, `${label}: no self-tie`).not.toBe(t.to); // anchored: the two ends asserted live on the roster above
    expect(KINDS.has(t.type), `${label}: kind ${t.type} is in the archetype table`).toBe(true);
    expect(Object.hasOwn(t, 'npc1Id') || Object.hasOwn(t, 'npc2Id'), `${label}: the undirected pair is not written`).toBe(false); // anchored: `from` asserted defined on the same record above
    expect(t.id, `${label}: the tie's id is its source's`).toBe(`tie_${t.from}`);
    out.set(t.from, out.get(t.from) + 1);
  }
  const want = cast.length >= 2 ? 1 : 0;
  const wrong = [...out].filter(([, n]) => n !== want);
  expect(wrong, `${label}: out-degree ${want} for every card (cast ${cast.length})`).toEqual([]);
  return { cards: cast.length, ties: ties.length };
}

describe('the people car — one outgoing tie per card (R-P7)', () => {
  it('out-degree exactly 1 for every card with a peer, 0 for a lone face: the golden 525', () => {
    let ties = 0;
    for (const row of goldenCorpus()) {
      const { _seed, ...cfg } = row;
      const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
      ties += assertTies(s, `${row.settType}/${_seed}`).ties;
    }
    expect(ties, 'the corpus draws ties').toBeGreaterThan(525);
  }, 240_000);

  it("out-degree exactly 1 for every card with a peer, 0 for a lone face: the soak 1,000's first 300", async () => {
    await ensureLaws();
    let lone = 0; let hubs = 0;
    for (let i = 0; i < 300; i += 1) {
      const s = birth(i).settlement;
      const { cards } = assertTies(s, `soak1k-${i}`);
      if (cards < 2) lone += 1;
      const inDeg = new Map();
      for (const t of s.relationships) inDeg.set(t.to, (inDeg.get(t.to) || 0) + 1);
      hubs += [...inDeg.values()].filter((n) => n >= 2).length;
    }
    // the owner's "called by two or more": the graph holds them (R-P7, in-degree free)
    expect(hubs, 'some card is named by two or more').toBeGreaterThan(0);
    expect(lone, 'a lone face is measured somewhere in the first 300 (a thorp of one face)').toBeGreaterThan(0);
  }, 240_000);

  it('the same seed gives the same ties; the NPC regen draws one tie per card on its own stream', async () => {
    await ensureLaws();
    for (const i of [1, 3, 5]) {
      const a = birth(i).settlement;
      const b = birth(i).settlement;
      expect(JSON.stringify(b.relationships)).toBe(JSON.stringify(a.relationships));
      const r1 = regenNPCsPipeline(a, a.config || {}, { seed: 'people-4-regen' });
      const r2 = regenNPCsPipeline(a, a.config || {}, { seed: 'people-4-regen' });
      expect(JSON.stringify(r2.relationships)).toBe(JSON.stringify(r1.relationships));
      assertTies({ npcs: r1.npcs, relationships: r1.relationships }, `regen-${i}`);
    }
  }, 120_000);
});

/**
 * I-12's added arm (ALLEGIANCE-CAR1, 2026-11-08; the allegiance design §1.5, §4): an agent's ONE
 * outgoing tie is its handler tie — `to` its handler, `covert: true, handler: true` — so the handler tie
 * REPLACES the drawn tie and one-out still holds; no other tie is a handler tie. Red-first at the split's
 * tip (no allegiance dealt there): the anti-vacuity count.
 * @param {any} s @returns {{ findings: string[], handlerTies: number }}
 */
function handlerTieFindings(s) {
  const findings = [];
  const byFrom = new Map((s.relationships || []).map((t) => [t.from, t]));
  const ids = new Set((s.npcs || []).map((n) => n?.id));
  let handlerTies = 0;
  for (const n of s.npcs || []) {
    const h = n?.allegiance?.handler;
    if (!h || !ids.has(h)) continue;
    const t = byFrom.get(n.id);
    if (!t) { findings.push(`${n.id}: an agent with no outgoing tie`); continue; }
    if (t.to !== h) findings.push(`${n.id}: its tie names ${t.to}, not its handler ${h}`);
    if (t.covert !== true || t.handler !== true) findings.push(`${n.id}: its handler tie is not covert + handler`);
    handlerTies += 1;
  }
  for (const t of s.relationships || []) {
    const agent = (s.npcs || []).find((n) => n?.id === t.from);
    if (t.handler === true && !agent?.allegiance) findings.push(`${t.from}: a handler tie from a card with no allegiance`);
  }
  return { findings, handlerTies };
}

describe('I-12 — the handler tie is the agent\'s one outgoing tie (ALLEGIANCE-CAR1)', () => {
  it('over the soak 1,000\'s first 240 cities and metropolises: every agent ties to its handler, covert', async () => {
    await ensureLaws();
    const findings = []; let handlerTies = 0;
    for (let i = 0; i < 240; i += 1) {
      if (i % 6 !== 4 && i % 6 !== 5) continue;
      const s = birth(i).settlement;
      assertTies(s, `soak1k-${i}`);
      const r = handlerTieFindings(s);
      findings.push(...r.findings.map((f) => `soak1k-${i} ${f}`));
      handlerTies += r.handlerTies;
    }
    expect(findings).toEqual([]);
    expect(handlerTies, 'the slice draws handler ties').toBeGreaterThanOrEqual(40);
  }, 300_000);

  it('the check is live: a planted drawn tie on an agent, and a planted handler tie on a clean card, red', () => {
    const s = {
      npcs: [{ id: 'a', allegiance: { handler: 'h' } }, { id: 'h' }, { id: 'c' }],
      relationships: [{ id: 'tie_a', from: 'a', to: 'c' }, { id: 'tie_h', from: 'h', to: 'a' }, { id: 'tie_c', from: 'c', to: 'h', handler: true, covert: true }],
    };
    const { findings } = handlerTieFindings(s);
    expect(findings).toEqual([
      'a: its tie names c, not its handler h',
      'a: its handler tie is not covert + handler',
      'c: a handler tie from a card with no allegiance',
    ]);
  });
});

describe('drawTies — the target rule', () => {
  const card = (id, extra = {}) => ({ id, name: `N ${id}`, role: 'the x', category: 'other', power: 3, memberships: [], ...extra });

  it('a lone face draws none; two faces name each other', () => {
    expect(drawTies([card('a')], {}, createPRNG('t'))).toEqual([]);
    const two = drawTies([card('a'), card('b')], {}, createPRNG('t'));
    expect(two.map((t) => `${t.from}>${t.to}`)).toEqual(['a>b', 'b>a']);
  });

  it('an `other` mint ties to the governing power\'s first — the dual-hat leader where a house leads, not the office (COHERENCE-POWERS)', () => {
    const cast = [
      card('npc_mayor_and_council', { institution: { kind: 'house', key: 'Mayor and council', title: 'the mayor' }, memberships: [{ power: 'Town Council', rank: 2, share: 1 }] }),
      card('npc_mills', { institution: { kind: 'house', key: 'Mills (2-5)', title: 'the miller' }, memberships: [{ power: 'Town Council', rank: 1, share: 0 }] }),
      card('npc_power_revolt_leadership', { institution: { kind: 'power', key: 'Revolt Leadership' }, memberships: [{ power: 'Revolt Leadership', rank: 1, share: 1 }] }),
    ];
    const place = { institutions: [{ name: 'Mayor and council' }, { name: 'Mills (2-5)' }], tier: 'town', government: 'Town Council' };
    const mintTie = drawTies(cast, place, createPRNG('t')).find((t) => t.from === 'npc_power_revolt_leadership');
    expect(mintTie?.to).toBe('npc_mills');
    // a cast with no ranks (a save from before the car) still ties the mint to the seat house's face
    const old = cast.map((c) => ({ ...c, memberships: [] }));
    expect(drawTies(old, place, createPRNG('t')).find((t) => t.from === 'npc_power_revolt_leadership')?.to).toBe('npc_mayor_and_council');
  });

  it('the weights: a minted face or no house is 1; a shared power multiplies by 3', () => {
    expect(targetWeightOf(card('m', { institution: { kind: 'power', key: 'Elder Council' } }))).toBe(1);
    expect(targetWeightOf(card('d', { institution: null }))).toBe(1);
    const p = { memberships: [{ power: 'P', rank: 1, share: 1 }] };
    const q = { memberships: [{ power: 'Q', rank: 1, share: 1 }] };
    expect(sharesPower(p, { memberships: [{ power: 'P', rank: 2, share: 0.5 }] })).toBe(true);
    expect(sharesPower(p, q)).toBe(false);
    expect(SHARED_POWER_FACTOR).toBe(3);
  });

  it('a shared power pulls the target: over many streams the sharer is named ~3x as often', () => {
    const cast = [card('a', { memberships: [{ power: 'P', rank: 1, share: 1 }] }),
      card('b', { memberships: [{ power: 'P', rank: 2, share: 1 }] }), card('c')];
    let toB = 0; let toC = 0;
    for (let i = 0; i < 2000; i += 1) {
      const [own] = drawTies(cast, {}, createPRNG(`w${i}`));
      if (own.to === 'b') toB += 1; else toC += 1;
    }
    // expectation 3:1 (1500 / 500); a ±5σ band on the binomial (σ ≈ 19.4)
    expect(toB).toBeGreaterThan(1500 - 97);
    expect(toB).toBeLessThan(1500 + 97);
    expect(toB + toC).toBe(2000);
  });
});

describe('tiesOfCard — the card reads its own tie first, then the ties naming it', () => {
  const ties = [
    { from: 'a', to: 'b', type: 'ally', typeName: 'Ally', npc1Name: 'A', npc2Name: 'B' },
    { from: 'b', to: 'c', type: 'rival', typeName: 'Rival', npc1Name: 'B', npc2Name: 'C' },
    { from: 'c', to: 'b', type: 'enemy', typeName: 'Enemy', npc1Name: 'C', npc2Name: 'B' },
  ];
  it('own, then called by', () => {
    const { own, calledBy } = tiesOfCard(ties, 'b');
    expect(own.map((t) => t.to)).toEqual(['c']);
    expect(calledBy.map((t) => t.from)).toEqual(['a', 'c']);
    expect(cardTieLines(ties, 'b').map((l) => `${l.direction}:${l.withName}:${l.kind}`))
      .toEqual(['own:C:Rival', 'calledBy:A:Ally', 'calledBy:C:Enemy']);
    expect(tiesOfCard(ties, null)).toEqual({ own: [], calledBy: [] });
  });
});
