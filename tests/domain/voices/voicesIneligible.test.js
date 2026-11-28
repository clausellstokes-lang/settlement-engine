/** @vitest-environment node */
/**
 * tests/domain/voices/voicesIneligible.test.js — THE ENGINE NEVER PRINTS A VERSION MARKED INELIGIBLE (S-G1; the chair's
 * ruling G1-4 (f) of 2026-11-28, the condition on the presumption-classes walker's `ineligible` status: a version so
 * marked is no hit there BECAUSE it is never spoken, so this file holds that it is never spoken).
 *
 * THE PLANT: on two born towns of C (dp-city-59, which holds the liar, and dp-village-5), the version that WINS a card is
 * marked ineligible in a copy of the lines; the plan over the copy prints it nowhere. Its card takes another line, or the
 * next speaker, or stays silent. The same holds for the liar's own version, and for a line marked ineligible as a whole
 * (a line whose DM note is answered nowhere).
 *
 * THE COUNT: the ineligible versions of the lines as they stand are PINNED here, and so is their list. The list must match
 * the one in the seat's `INELIGIBLE.md`, so it cannot grow unseen.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { SAID_LINES } from '../../../src/data/voices/saidLines.js';
import { LIAR_LINES } from '../../../src/data/voices/liarLines.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const INELIGIBLE_MD = 'docs/chair/2026-11-27/eleventh/survey/voices-engine/INELIGIBLE.md';
const TEMPERS = /** @type {const} */ (['welcoming', 'transactional', 'cautious', 'dismissive']);
/** THE PINNED COUNT (the chair's G1-4 (f)): after the four candle rewordings of G1-4 (d), no version is ineligible. */
const INELIGIBLE_COUNT = 0;

/** @type {Map<string, Record<string, any>>} */ const born = new Map();
beforeAll(async () => {
  const pipe = await import('../../../src/generators/generateSettlementPipeline.js');
  const dens = await import('../../../src/domain/density/densityCreateBoundary.js');
  await dens.loadGenerationLawPayloads();
  for (const [seed, settType] of [['dp-city-59', 'city'], ['dp-village-5', 'village']]) born.set(seed, pipe.generateSettlementPipeline(dens.birthConfig({ settType }), null, { seed, customContent: {} }));
}, 120_000);
afterEach(() => { vi.doUnmock('../../../src/data/voices/saidLines.js'); vi.doUnmock('../../../src/data/voices/liarLines.js'); vi.resetModules(); });

/** The plan of a town over (optionally) patched lines, from a fresh module graph. @param {Record<string, any>} town @param {{ said?: any, liar?: any }} patch */
async function planOver(town, patch = {}) {
  vi.resetModules();
  if (patch.said) vi.doMock('../../../src/data/voices/saidLines.js', () => ({ SAID_LINES: patch.said }));
  if (patch.liar) vi.doMock('../../../src/data/voices/liarLines.js', () => ({ LIAR_LINES: patch.liar }));
  const vp = await import('../../../src/domain/voices/voicePlan.js');
  return vp.voicePlanOf(structuredClone(town), { audience: vp.OWNER_AUDIENCE });
}
/** The temper whose text printed a quote (slots filled). @param {Record<string, any>} line @param {string} text */
const versionPrinted = (line, text) => TEMPERS.find((t) => new RegExp(`^${String(line.versions[t].text).replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+')}$`).test(text));
const lineIn = (/** @type {Record<string, any[]>} */ pools, /** @type {string} */ id) => Object.values(pools).flat().find((l) => l.id === id);

describe('a version marked ineligible is never spoken (the plant)', () => {
  for (const seed of ['dp-city-59', 'dp-village-5']) {
    it(`${seed}: the winning said version, marked, prints nowhere; its card takes another line, another speaker, or silence`, async () => {
      const town = /** @type {Record<string, any>} */ (born.get(seed));
      const plan = await planOver(town);
      const q = [...plan.quotes.values()].find((x) => !x.liar);
      expect(q, `${seed} has a said quote to plant on`).toBeTruthy();
      const line = lineIn(SAID_LINES, q.lineId); const t = versionPrinted(line, q.text);
      expect(t, 'the printed version is found').toBeTruthy();
      const said = structuredClone(SAID_LINES); lineIn(said, q.lineId).versions[t].ineligible = ['planted'];
      const after = await planOver(town, { said });
      const printed = [...after.quotes.values()].filter((x) => x.lineId === q.lineId && versionPrinted(line, x.text) === t);
      expect(printed, 'the marked version prints on no card').toEqual([]);
      const there = after.quotes.get(`${q.kind}:${q.id}`);
      expect(!there || there.lineId !== q.lineId || there.speaker.id !== q.speaker.id, 'the card moved on').toBe(true);
    }, 120_000);
  }

  it('a LINE marked ineligible as a whole prints no version', async () => {
    const town = /** @type {Record<string, any>} */ (born.get('dp-village-5'));
    const plan = await planOver(town);
    const q = [...plan.quotes.values()].find((x) => !x.liar);
    const said = structuredClone(SAID_LINES); lineIn(said, q.lineId).ineligible = ['planted'];
    const after = await planOver(town, { said });
    expect([...after.quotes.values()].filter((x) => x.lineId === q.lineId)).toEqual([]);
  }, 120_000);

  it('the liar\'s own version, marked, prints nowhere: the liar takes another line or none', async () => {
    const town = /** @type {Record<string, any>} */ (born.get('dp-city-59'));
    const plan = await planOver(town);
    const q = [...plan.quotes.values()].find((x) => x.liar);
    expect(q, 'dp-city-59 quotes its liar').toBeTruthy();
    const line = lineIn(LIAR_LINES, q.lineId); const t = versionPrinted(line, q.text);
    const liar = structuredClone(LIAR_LINES); lineIn(liar, q.lineId).versions[t].ineligible = ['planted'];
    const after = await planOver(town, { liar });
    expect([...after.quotes.values()].filter((x) => x.lineId === q.lineId && versionPrinted(line, x.text) === t)).toEqual([]);
  }, 120_000);
});

describe('the ineligible versions, counted and listed', () => {
  const marked = [
    ...Object.values(SAID_LINES).flat().flatMap((l) => (l.ineligible ? [`${l.id} (the line)`] : TEMPERS.filter((t) => l.versions[t].ineligible).map((t) => `${l.id} ${t}`))),
    ...Object.values(LIAR_LINES).flat().flatMap((l) => (l.ineligible ? [`${l.id} (the line)`] : TEMPERS.filter((t) => l.versions[t].ineligible).map((t) => `${l.id} ${t}`))),
  ];
  it(`holds ${INELIGIBLE_COUNT} (the pinned count), each listed in INELIGIBLE.md`, () => {
    expect(marked.length).toBe(INELIGIBLE_COUNT);
    const md = readFileSync(join(ROOT, INELIGIBLE_MD), 'utf8');
    const section = md.split(/^## /m).find((s) => s.startsWith('The ineligible versions'));
    expect(section, 'INELIGIBLE.md holds the section "The ineligible versions"').toBeTruthy();
    const listed = [...String(section).matchAll(/^- `([^`]+)`/gm)].map((m) => m[1]);
    expect(listed).toEqual(marked);
  });
});
