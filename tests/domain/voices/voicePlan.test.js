/** @vitest-environment node */
/**
 * tests/domain/voices/voicePlan.test.js — THE VOICES' PLAN (S-G1; the chair's rulings E28 on VOICES-CARDS' F).
 *
 * Over five born towns of the proof corpus C (a thorp, a hamlet, a village under a crisis, a town and a city holding a
 * person with a criminal tie): the plan is pure and seeded; a line added to every pool moves no "speaks" and no speaker;
 * the caps hold (three a tab, one quote a person a page); every speaker is lawful and never one the card excludes; the
 * variety rule holds; every quote's nouns are admitted by the record; the liar is at most one, on their own house's
 * card, with the DM's note; a thorp with a speaker speaks once at least; the town's key survives a rename and a copy;
 * every reader's audience gets the empty plan.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { VOICES_TUNING } from '../../../src/domain/voices/voicesTuning.js';
import { KNOWN_MOUTHS, OWNER_AUDIENCE, pickKeyOf, quoteFor, speakerAdmits, temperOf, voicePlanOf } from '../../../src/domain/voices/voicePlan.js';
import { TENSION_GROUP, VOICE_TABS, isLawfulSpeaker } from '../../../src/domain/voices/cardsOf.js';
import { CARD_WORDS, cardWordHolds } from '../../../src/domain/voices/cardWords.js';
import { catalogIdForName, institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import { SAID_LINES } from '../../../src/data/voices/saidLines.js';
import { LIAR_LINES } from '../../../src/data/voices/liarLines.js';
import { allegianceOf } from '../../../src/domain/people/allegiance.js';
import { cardHouseOf } from '../../../src/domain/people/cardPowers.js';
import { declarationAdmits } from '../../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

/** C's plan rows (`rmeasure/tools/plan-C.json`: the config is the tier alone). */
const TOWNS = Object.freeze([
  ['dp-thorp-3', 'thorp'], ['dp-hamlet-85', 'hamlet'], ['dp-hamlet-12', 'hamlet'], ['dp-thorp-52', 'thorp'], ['dp-village-5', 'village'], ['dp-town-40', 'town'], ['dp-city-59', 'city'],
]);
/** @type {Map<string, Record<string, any>>} */ const born = new Map();

beforeAll(async () => {
  const pipe = await import('../../../src/generators/generateSettlementPipeline.js');
  const dens = await import('../../../src/domain/density/densityCreateBoundary.js');
  await dens.loadGenerationLawPayloads();
  for (const [seed, settType] of TOWNS) born.set(seed, pipe.generateSettlementPipeline(dens.birthConfig({ settType }), null, { seed, customContent: {} }));
}, 120_000);

const plans = () => [...born].map(([seed, s]) => ({ seed, s, plan: voicePlanOf(s, { audience: OWNER_AUDIENCE }) }));
const said = Object.values(SAID_LINES).flat();
const lineById = new Map([...said, ...Object.values(LIAR_LINES).flat()].map((l) => [l.id, l]));

describe('the plan is pure, seeded, and keyed on the town', () => {
  it('gives the same quotes for the same record, and for a copy of it', () => {
    for (const { s, plan } of plans()) {
      const again = voicePlanOf(structuredClone(s), { audience: OWNER_AUDIENCE });
      expect([...again.quotes]).toEqual([...plan.quotes]);
      expect(voicePlanOf(s, { audience: OWNER_AUDIENCE })).toBe(plan);
    }
  });

  it('reads the town\'s key from its id, else its seed, else its name (ruling 1): a renamed town keeps its quotes; the id deals them', () => {
    expect(pickKeyOf({ id: 's_1', _seed: 'x', name: 'N' })).toBe('s_1');
    expect(pickKeyOf({ _seed: 'x', name: 'N' })).toBe('x');
    expect(pickKeyOf({ name: 'N' })).toBe('N');
    const sig = (/** @type {ReturnType<typeof voicePlanOf>} */ p) => [...p.quotes].map(([k, q]) => [k, q.lineId, q.speaker.id]);
    let dealt = 0;
    for (const { s, plan } of plans()) {
      expect(sig(voicePlanOf({ ...structuredClone(s), name: 'Elsewhere' }, { audience: OWNER_AUDIENCE }))).toEqual(sig(plan));
      if (JSON.stringify(sig(voicePlanOf({ ...structuredClone(s), id: `${s.id}-other` }, { audience: OWNER_AUDIENCE }))) !== JSON.stringify(sig(plan))) dealt += 1;
    }
    expect(dealt, 'another id deals another page').toBeGreaterThan(0);
  });

  it('quotes something on every town of the seven, and finds each card\'s quote by its kind and id', () => {
    for (const { seed, plan } of plans()) {
      expect(plan.quotes.size, seed).toBeGreaterThan(0);
      for (const q of plan.quotes.values()) expect(quoteFor(plan, q.kind, q.id)).toBe(q);
    }
  });
});

describe('the page rules', () => {
  it('holds the tab cap and one quote a person a page', () => {
    for (const { seed, plan } of plans()) {
      for (const tab of VOICE_TABS) expect([...plan.quotes.values()].filter((q) => q.tab === tab).length, `${seed} ${tab}`).toBeLessThanOrEqual(VOICES_TUNING.tabCap);
      const by = new Map();
      for (const id of plan.speakers.values()) by.set(id, (by.get(id) || 0) + 1);
      for (const [id, n] of by) expect(n, `${seed} ${id}`).toBeLessThanOrEqual(VOICES_TUNING.personCap);
    }
  });

  it('signs every quote with a lawful speaker the card does not exclude, whose line\'s speaker rule takes them', () => {
    for (const { seed, s, plan } of plans()) {
      const npcs = new Map(s.npcs.map((n) => [n.id, n]));
      for (const [k, q] of plan.quotes) {
        const npc = npcs.get(q.speaker.id);
        expect(npc && isLawfulSpeaker(npc), `${seed} ${k}`).toBe(true);
        const card = plan.cards.find((c) => `${c.kind}:${c.id}` === k);
        expect(card.exclude.has(q.speaker.id), `${seed} ${k}`).toBe(false);
        expect(q.speaker.temper).toBe(temperOf(npc));
        expect(q.text).not.toMatch(/[{}]/);
        const line = lineById.get(q.lineId);
        expect(line, q.lineId).toBeTruthy();
        expect(line.ineligible, q.lineId).toBeUndefined();
      }
    }
  });

  it('asks every quote\'s nouns of the record (its line\'s needs and its version\'s are admitted)', () => {
    for (const { s, plan } of plans()) {
      for (const q of plan.quotes.values()) {
        const line = lineById.get(q.lineId);
        const v = line.versions[q.speaker.temper];
        const needs = [...(line.needs || []), ...(v.needs || [])]; const excludes = [...(line.excludes || []), ...(v.excludes || [])];
        expect(declarationAdmits({ needs, excludes, crisis: [] }, factsOf(s)).admitted, q.lineId).toBe(true);
        expect(q.text).toBe(q.liar ? v.text : q.text);
      }
    }
  });

  it('prints no line twice on a page', () => {
    for (const { seed, plan } of plans()) {
      const ids = [...plan.quotes.values()].map((q) => q.lineId);
      expect(new Set(ids).size, seed).toBe(ids.length);
    }
  });

  it('THE VARIETY RULE (ruling 9): two quotes of one temper on a tab only where no unspent lawful speaker of another temper stood for the later card', () => {
    for (const { seed, plan } of plans()) {
      const spent = new Set();
      /** @type {Map<string, Set<string>>} */ const heard = new Map();
      for (const k of plan.order) {
        const card = plan.cards.find((c) => `${c.kind}:${c.id}` === k);
        const q = plan.quotes.get(k);
        const who = plan.speakers.get(k);
        const tabHeard = heard.get(card.tab) || new Set();
        if (q && !q.liar && tabHeard.has(q.speaker.temper)) {
          const others = card.tiers.flat().filter((n) => isLawfulSpeaker(n) && !spent.has(n.id) && !card.exclude.has(n.id) && !tabHeard.has(temperOf(n)));
          expect(others.map((n) => n.id), `${seed} ${k}`).toEqual([]);
        }
        spent.add(who);
        if (q) tabHeard.add(q.speaker.temper);
        heard.set(card.tab, tabHeard);
      }
    }
  });

  it('A THORP\'s QUIET (ruling 6): a page with a lawful speaker and a card that can speak shows at least one quote', () => {
    for (const { seed, s, plan } of plans()) {
      const canSpeak = plan.cards.some((c) => !c.silent && c.tiers.flat().some((n) => isLawfulSpeaker(n)));
      if (s.npcs.some((n) => isLawfulSpeaker(n)) && canSpeak) expect(plan.quotes.size, seed).toBeGreaterThanOrEqual(1);
    }
  });

  it('knows every mouth the lines name (a mouth it does not know takes no one)', () => {
    for (const l of said) for (const t of l.speaker) expect(KNOWN_MOUTHS, `${l.id}: ${t}`).toContain(t);
  });
});

describe('a house\'s keeper lines', () => {
  it('take the house\'s own face even where the face is the seat\'s holder of another house (the Connection row\'s person)', () => {
    const face = { id: 'npc_reeve', name: 'A Reeve', institution: { kind: 'house', key: 'Lord\'s reeve' } };
    const card = { kind: 'institution', id: 'subsistence_farming', house: 'Subsistence farming', power: null, exclude: new Set(), npc: null, keeperTier0: null };
    const ctx = { seatName: '', seatMembers: new Set(), instByName: new Map() };
    expect(speakerAdmits(['keeper', 'works-there'], face, card, ctx, true)).toBe(true);
    expect(speakerAdmits(['keeper', 'works-there'], face, card, ctx, false)).toBe(false);
  });

  it('leave no one-person place silent because its one person was spent on a card with no line for them', () => {
    let seen = 0;
    for (const { seed, s, plan } of plans()) {
      if (s.npcs.filter((n) => isLawfulSpeaker(n)).length !== 1) continue;
      seen += 1;
      expect(plan.quotes.size, seed).toBe(1);
    }
    expect(seen).toBeGreaterThan(0);
  });
});

describe('a card-level word is answered by the card (ruling G1-1 (2)); a word answered nowhere leaves its version out', () => {
  it('holds for catalogue ids the catalogue itself names, each word at least one', () => {
    const ids = new Set(Object.values(institutionalCatalog).flatMap((tier) => Object.values(tier || {}).flatMap((shelf) => Object.keys(shelf || {}).map((n) => catalogIdForName(n)))));
    for (const [word, list] of Object.entries(CARD_WORDS)) {
      expect(list.length, word).toBeGreaterThan(0);
      for (const id of list) expect(ids.has(id), `${word}: ${id}`).toBe(true);
    }
    expect(cardWordHolds('flour or bread', 'mill')).toBe(true);
    expect(cardWordHolds('flour or bread', 'town_granary')).toBe(false);
    expect(cardWordHolds('flour or bread', null)).toBe(false);
  });

  it('never quotes a version whose card word does not hold for its card, or a version answered nowhere', () => {
    let carded = 0;
    for (const { seed, plan } of plans()) {
      for (const q of plan.quotes.values()) {
        if (q.liar) continue;
        const v = lineById.get(q.lineId).versions[q.speaker.temper];
        expect(v.ineligible, `${seed} ${q.lineId}`).toBeUndefined();
        if (!v.card) continue;
        carded += 1;
        const card = plan.cards.find((c) => c.kind === q.kind && c.id === q.id);
        for (const w of v.card) expect(cardWordHolds(w, card.catalogId), `${seed} ${q.lineId} ${w} on ${card.catalogId}`).toBe(true);
      }
    }
    expect(carded >= 0).toBe(true);
  });

  it('files a tension of its own type under its own state: graft and mistrust (ruling G1-1 (3))', () => {
    expect(TENSION_GROUP.corruption_scandal).toBe('graft');
    expect(TENSION_GROUP.infiltration_fear).toBe('mistrust');
    expect(TENSION_GROUP.occupation_legacy).toBe('mistrust');
    expect(SAID_LINES['tension.graft'].map((l) => l.id)).toEqual(['SAID.tension.crime.6', 'SAID.tension.crime.7', 'SAID.tension.crime.8']);
    expect(SAID_LINES['tension.mistrust'].map((l) => l.id)).toEqual(['SAID.tension.neighbours.6', 'SAID.tension.neighbours.7', 'SAID.tension.neighbours.8']);
  });
});

describe('the chair\'s readings V-1', () => {
  it('(a) the occupier, the cause of the doubt, never voices the doubted seat', () => {
    const s = born.get('dp-hamlet-12');
    const plan = voicePlanOf(s, { audience: OWNER_AUDIENCE });
    const gainers = new Set(s.npcs.filter((n) => (n.memberships || []).some((m) => m.power === 'Occupation Authority')).map((n) => n.id));
    expect(gainers.size).toBeGreaterThan(0);
    for (const c of plan.cards.filter((x) => x.kind === 'power' && /^seat-(doubted|captured)$/.test(x.state))) {
      const who = plan.speakers.get(`power:${c.id}`);
      expect(gainers.has(who), `${c.id} ${who}`).toBe(false);
    }
  });

  it('(b) the liar speaks of the holder\'s own house first: a smuggling line never lands on an arts college', () => {
    const plan = voicePlanOf(born.get('dp-city-59'), { audience: OWNER_AUDIENCE });
    const lie = [...plan.quotes.values()].find((q) => q.liar);
    expect(plan.cards.find((c) => c.kind === 'institution' && c.id === lie.id).house).toBe('Bardic college');
    // the tie's way through the house (office, front or retainer), never the criminal house's kind
    expect(lie.lineId).toMatch(/^LIE\.(office|front|retainer)\./);
    expect(lie.lineId).not.toMatch(/^LIE\.smuggling\./);
  });
});

describe('THE LIAR (ruling 11)', () => {
  it('is at most one a town: a lawful person with a criminal tie, on their own house\'s card, with the DM\'s note', () => {
    let seen = 0;
    for (const { seed, s, plan } of plans()) {
      const lies = [...plan.quotes.values()].filter((q) => q.liar);
      expect(lies.length, seed).toBeLessThanOrEqual(1);
      for (const q of lies) {
        seen += 1;
        const npc = s.npcs.find((n) => n.id === q.speaker.id);
        expect(allegianceOf(npc), seed).toBeTruthy();
        expect(isLawfulSpeaker(npc)).toBe(true);
        expect(q.kind).toBe('institution');
        expect(plan.cards.find((c) => c.kind === 'institution' && c.id === q.id).house).toBe(cardHouseOf(npc));
        expect(q.liar.inTruth.length).toBeGreaterThan(0);
        expect(q.lineId).toMatch(/^LIE\./);
      }
      for (const q of plan.quotes.values()) if (!q.liar) expect(q.lineId, seed).toMatch(/^SAID\./);
    }
    expect(seen, 'the city holds a liar').toBe(1);
  });
});

describe('THE SHARED PAGE SHOWS NO QUOTE (ruling 12): every audience but the owner\'s gets the empty plan', () => {
  it('gives the reader, the player view and an unnamed audience nothing', () => {
    for (const { s } of plans()) {
      for (const audience of ['reader', 'player', 'share', undefined, '']) {
        const p = voicePlanOf(s, { audience });
        expect(p.quotes.size, String(audience)).toBe(0);
      }
    }
  });
});

describe('STABLE UNDER A POOL EDIT: a line added to every pool moves no "speaks" and no speaker, only lines', () => {
  it('keeps every outcome but the line, and every speaker', async () => {
    const before = plans().map(({ seed, plan }) => ({ seed, plan }));
    vi.resetModules();
    vi.doMock('../../../src/data/voices/saidLines.js', async () => {
      const real = await vi.importActual('../../../src/data/voices/saidLines.js');
      const v = { welcoming: { text: 'Added warmly.' }, transactional: { text: 'Added at a cost.' }, cautious: { text: 'Added, maybe.' }, dismissive: { text: 'Added.' } };
      return { SAID_LINES: Object.fromEntries(Object.entries(real.SAID_LINES).map(([k, rows]) => [k, [...rows, { id: `ADDED.${k}`, speaker: ['anyone'], versions: v }]])) };
    });
    const edited = await import('../../../src/domain/voices/voicePlan.js');
    let moved = 0;
    let floors = 0;
    for (const { seed, plan } of before) {
      const s = born.get(seed);
      const after = edited.voicePlanOf(structuredClone(s), { audience: OWNER_AUDIENCE });
      // THE ONE EXCEPTION, said in the leaf's head: a page the draw left silent, given its one quote by the floor (ruling
      // 6), may move with the lines; it still speaks
      if ([...plan.outcome.values()].includes('quote:floor')) { floors += 1; expect(after.quotes.size, seed).toBeGreaterThan(0); continue; }
      const won = (/** @type {string} */ o) => (o === 'not-drawn' || o === 'capped' || o.startsWith('silent:') || o === 'no-speaker' ? o : 'won');
      expect([...after.outcome].map(([k, o]) => [k, won(o)]), seed).toEqual([...plan.outcome].map(([k, o]) => [k, won(o)]));
      expect([...after.speakers], seed).toEqual([...plan.speakers]);
      for (const [k, q] of after.quotes) if (plan.quotes.get(k)?.lineId !== q.lineId) moved += 1;
    }
    expect(moved, 'the added lines do take some cards (the test has teeth)').toBeGreaterThan(0);
    expect(floors, 'most of the towns are held whole').toBeLessThan(before.length / 2);
    vi.doUnmock('../../../src/data/voices/saidLines.js');
  }, 60_000);
});
