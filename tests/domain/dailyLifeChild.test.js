/**
 * tests/domain/dailyLifeChild.test.js — DAILY-2 B2 D2, `child_warnings` BY LINES-1 / LINES-1b AS RULED (the chair's rulings
 * 8 and 11 of 2026-11-20; `lines/L1/LINES-1.md` § child_warnings, `LINES-1b.md`).
 *
 * THE RED (the B2 brief, D2): M1's `hxd-thorp-0` printed "the empty stalls in the trade quarter" (no market, no trade
 * quarter), and a calm place (`hxd-hamlet-0`, whose only unrest is the defence profile's rating) took the unrest warning
 * from the rating alone. THE GREEN: on born places of every size (M1's births `hxd-<size>-0..2`), the slot is either one
 * `none` sentence or "Children are warned about A[, and about B]." with at most two kinds, each part a line of its kind's
 * pool whose declared atoms the record holds, its houses live, non-hideable, non-access rows said `the <noun>`; a calm
 * thorp holds >= 7 eligible `none` lines; the pick is `pickVariantMixed` on `<name>::dailyLife.child_warnings::<kind>`.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLifeSlot } from '../../src/domain/dailyLife.js';
import { CHILD_WARNINGS } from '../../src/data/dailyLife/childWarnings.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { marketOf } from '../../src/domain/facts/market.js';
import { deriveAllThreatProfiles } from '../../src/domain/threatProfile.js';
import { pickVariantMixed } from '../../src/kernel/proseHash.js';
import { isLiveInstitution } from '../../src/domain/institutions/institutionRoster.js';
import { ACCESS_ONLY } from '../../src/domain/facts/liveInstitutionNames.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { institutionSentenceNoun } from '../../src/domain/display/institutionSentenceNoun.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Array<{ seed: string, size: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 3; i++) {
    const seed = `hxd-${size}-${i}`;
    births.push({ seed, size, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, 120_000);

const at = (/** @type {string} */ seed) => /** @type {{ seed: string, size: string, rec: any }} */ (births.find((b) => b.seed === seed));
const slotOf = (/** @type {any} */ rec) => /** @type {import('../../src/domain/dailyLife.js').DailyLifeSlot} */ (deriveDailyLifeSlot('child_warnings', rec));
const POOLS = /** @type {Record<string, ReadonlyArray<any>>} */ (/** @type {unknown} */ (CHILD_WARNINGS));
const patternOf = (/** @type {string} */ t) => new RegExp(`^${t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{\w+\\?\}/g, '.+')}$`);
/** the kind and line a printed part came from (`none` for a whole sentence) */
const ownLine = (/** @type {string} */ part, /** @type {boolean} */ whole) => {
  for (const [kind, pool] of Object.entries(POOLS)) {
    if ((kind === 'none') !== whole) continue;
    const line = pool.find((l) => patternOf(l.text).test(part)); if (line) return { kind, line };
  }
  return null;
};
const PREFIX = 'Children are warned about ';
/** a printed text → its parts: one whole `none` sentence, or the phrases after "about" */
const partsOf = (/** @type {string} */ text) => {
  if (ownLine(text, true)) return [{ part: text, whole: true }];
  if (!text.startsWith(PREFIX) || !text.endsWith('.')) return null;
  return text.slice(PREFIX.length, -1).split(', and about ').map((part) => ({ part, whole: false }));
};

describe('the red: the falsest child warnings M1 found', () => {
  it('hxd-thorp-0 is not warned about a trade quarter and stalls it lacks', () => {
    const { rec } = at('hxd-thorp-0');
    expect(marketOf(rec)).toBe(false);
    const text = slotOf(rec).text;
    expect(partsOf(text), `"${text}"`).toBeTruthy();
    // anchored: the same text is pinned live on the line above (a whole `none` sentence or "Children are warned about …")
    expect(text).not.toMatch(/trade quarter|empty stalls/);
  });
  it('a calm place (hxd-hamlet-0, unrest from the defence rating alone) is not given the unrest warnings', () => {
    const { rec } = at('hxd-hamlet-0');
    const unrest = deriveAllThreatProfiles(rec).filter((t) => t.type === 'unrest');
    expect(unrest.length).toBeGreaterThan(0);
    expect(unrest.every((t) => t.originSurface === 'defenseProfile')).toBe(true);
    expect(Array.isArray(rec.conflicts) ? rec.conflicts.length : 0).toBe(0);
    const text = slotOf(rec).text;
    expect(partsOf(text), `"${text}"`).toBeTruthy();
    expect(CHILD_WARNINGS.unrest.length).toBeGreaterThan(0);
    // anchored: the text is pinned live and the unrest pool non-empty on the two lines above, so each exclusion is a real one
    for (const l of CHILD_WARNINGS.unrest) expect(text, l.id).not.toMatch(new RegExp(patternOf(l.text).source.slice(1, -1)));
  });
});

describe('the route on born places (ruling 11): eligible by declared atoms, then the keyed pick', () => {
  it('every place prints one none sentence or at most two kinds joined "A, and about B", each eligible, its houses said with "the"', () => {
    for (const { seed, rec } of births) {
      const s = slotOf(rec);
      const parts = partsOf(s.text);
      expect(parts, `${seed}: "${s.text}"`).toBeTruthy();
      // anchored: the same text is pinned live on the line above (a whole `none` sentence or "Children are warned about …")
      expect(s.text, seed).not.toMatch(/; /);
      const own = /** @type {Array<{ part: string, whole: boolean }>} */ (parts).map(({ part, whole }) => ownLine(part, whole));
      expect(own.length, seed).toBeLessThanOrEqual(2);
      const kinds = own.map((o) => o?.kind);
      expect(new Set(kinds).size, `${seed}: one kind said once`).toBe(kinds.length);
      for (const o of own) {
        expect(o, `${seed}: "${s.text}"`).toBeTruthy();
        const { kind, line } = /** @type {{ kind: string, line: any }} */ (o);
        expect(filterDeclared(POOLS[kind], { facts: factsOf(rec) }), `${seed}: ${kind}:${line.id} is eligible`).toContain(line);
      }
      for (const ref of s.references.filter((r) => r.type === 'institution')) {
        const row = (rec.institutions || []).find((/** @type {any} */ i) => i?.id === ref.id || i?.name === ref.label);
        expect(row && isLiveInstitution(row) && !isHideableHouse(row) && !ACCESS_ONLY.test(String(row.name)), `${seed}: ${ref.label}`).toBe(true);
        expect(s.text, `${seed}: ${ref.label}`).toContain(`the ${institutionSentenceNoun(ref.label)}`);
      }
      // anchored: the same text is pinned live above (its parts each a line of its kind's pool, `own` checked truthy)
      expect(s.text, seed).not.toMatch(/[()]|\btowns?\b/i);
    }
  });
  it('a calm thorp holds at least seven eligible `none` lines (ruling 8)', () => {
    for (const { seed, size, rec } of births) {
      if (size === 'thorp') expect(filterDeclared(CHILD_WARNINGS.none, { facts: factsOf(rec) }).length, seed).toBeGreaterThanOrEqual(7);
    }
  });
  it('a calm place takes the `none` pool by pickVariantMixed on `<name>::dailyLife.child_warnings::none`; a nameless record takes index 0', () => {
    const calm = { name: 'Ashby', tier: 'thorp', institutions: [{ name: 'Water source' }, { name: 'Dwellings (1-8)' }, { name: 'Subsistence farming' }], config: { monsterThreat: 'safe' } };
    const eligible = filterDeclared(CHILD_WARNINGS.none, { facts: factsOf(calm) });
    expect(slotOf(calm).text).toBe(/** @type {any} */ (pickVariantMixed(eligible, 'Ashby::dailyLife.child_warnings::none')).text);
    expect(slotOf({ ...calm, name: undefined }).text).toBe(eligible[0].text);
  });
});
