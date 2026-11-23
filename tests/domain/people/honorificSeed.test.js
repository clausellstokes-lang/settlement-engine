/**
 * honorificSeed.test.js — VR47, THE HONORIFIC'S SEED (VEIL-23's brief; the chair's ruling of 2026-11-20 08:01 UTC,
 * vetoable by the owner): THE PICK IS A FUNCTION OF WHAT EVERY READ SERVES, the person's NAME and the TITLE (gender
 * choosing only the gendered form), on every page, the owner's included; never the card's id (a shared page re-keys every
 * person's id per read, VR10) and never the institution key (a function of a field the DM hid is a leak, however small).
 * ONE helper builds the seed (data/faceHonorifics.js :: honorificSeedOf) and every caller of honorificOfTitle in src/
 * passes it. Display only: no generator path reads the pick.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { FACE_HONORIFICS, honorificOfTitle, honorificSeedOf } from '../../../src/data/faceHonorifics.js';
import { cardHonorificOf } from '../../../src/domain/people/cardDoor.js';
import { keeperHonorificOf, seatKeeperOf, seatKeeperLineOf } from '../../../src/domain/people/seatKeeper.js';
import { shownHonorificOf } from '../../../src/domain/people/seatKeeperDisplay.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';

const ROOT = join(__dirname, '..', '..', '..');
const clone = (v) => JSON.parse(JSON.stringify(v));
const DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });

/** VR10 emulated: every person's id re-keyed by `tag` (every string equal to an id, and every key). */
function rekey(doc, tag) {
  const ids = new Set((doc.npcs || []).map((c) => c?.id).filter((x) => typeof x === 'string' && x));
  const map = new Map([...ids].map((id, i) => [id, `${tag}_${(i * 7919 + tag.length * 31).toString(36)}`]));
  const walk = (v) => {
    if (typeof v === 'string') return map.get(v) ?? v;
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [map.get(k) ?? k, walk(x)]));
    return v;
  };
  return walk(doc);
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('VR47: the honorific is picked by the name and the title, never the id or the institution key', () => {
  it('the seed is the name and the title alone', () => {
    expect(honorificSeedOf('Robert Thomas', 'the priest')).toBe('Robert Thomas::the priest');
    expect(honorificSeedOf(' Robert Thomas ', ' the priest ')).toBe(honorificSeedOf('Robert Thomas', 'the priest'));
    expect(honorificSeedOf(undefined, 'the priest')).toBe('::the priest');
  });

  it("a card's honorific holds when its id and its institution key move (every multi-form title, 40 names)", () => {
    const moved = [];
    for (const title of Object.keys(FACE_HONORIFICS).filter((t) => FACE_HONORIFICS[t].length > 1)) {
      for (let i = 0; i < 40; i++) for (const gender of ['male', 'female']) {
        const card = { id: `npc_${i}`, name: `Person ${i}`, gender, institution: { kind: 'house', key: `House ${i}`, title, veiled: false } };
        const want = cardHonorificOf(card);
        expect(want).toBe(honorificOfTitle(title, gender, honorificSeedOf(card.name, title)));
        for (const other of [{ ...card, id: `p_${i}_x` }, { ...card, institution: { ...card.institution, key: `House ${i}#1` } }, { ...card, institution: { ...card.institution, key: 'Another house' } }]) {
          if (cardHonorificOf(other) !== want) moved.push(`${title} / ${card.name} / ${gender}`);
        }
      }
    }
    expect(moved).toEqual([]);
  });

  it("an empty seat's keeper prints the same caretaker's form when the ids are re-keyed or its institution key moves", () => {
    let seen = 0;
    for (const settType of ['town', 'city']) for (let i = 0; i < 6; i++) {
      const s = generateSettlementPipeline(birthConfig({ ...DIALS, settType, selectedStresses: ['succession_void'], selectedStressesRandom: false }), null, { seed: `f7g-${settType}-${i}`, customContent: {} });
      const keeper = seatKeeperOf(s);
      if (!keeper?.institution?.key) continue;
      seen += 1;
      const want = { k: keeperHonorificOf(keeper, s), shown: shownHonorificOf(keeper, s), line: seatKeeperLineOf(s) };
      for (const tag of ['A', 'B']) {
        const r = rekey(s, tag);
        const k = seatKeeperOf(r);
        expect({ k: keeperHonorificOf(k, r), shown: shownHonorificOf(k, r), line: seatKeeperLineOf(r) }, `${settType}-${i} ${tag}`).toEqual(want);
      }
      const m = clone(s);
      const mk = seatKeeperOf(m);
      mk.institution.key = `${mk.institution.key}#1`;
      expect(keeperHonorificOf(mk, m), `${settType}-${i} key`).toBe(want.k);
    }
    expect(seen).toBeGreaterThan(3);
  }, 120_000);

  it('every call of honorificOfTitle in src/ passes the one seed (honorificSeedOf)', () => {
    const files = [];
    const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(js|jsx|mjs)$/.test(n)) files.push(p); } };
    walk(join(ROOT, 'src'));
    const calls = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/\bhonorificOfTitle\(([^;\n]*)/g)) {
        if (/export function honorificOfTitle\(/.test(src.slice(Math.max(0, m.index - 16), m.index + 18))) continue;
        calls.push({ at: relative(ROOT, f), seeded: /honorificSeedOf\(/.test(m[1]), call: m[0].slice(0, 160) });
      }
    }
    expect(calls.length).toBeGreaterThanOrEqual(2); // cardDoor.js and seatKeeper.js
    expect(calls.filter((c) => !c.seeded)).toEqual([]);
  });

  it('no generator path calls honorificOfTitle (display only)', () => {
    const files = [];
    const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(js|jsx|mjs)$/.test(n)) files.push(p); } };
    walk(join(ROOT, 'src', 'generators'));
    expect(files.filter((f) => /\bhonorificOfTitle\b|\bhonorificSeedOf\b/.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f))).toEqual([]);
  });
});
