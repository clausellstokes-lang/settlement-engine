/**
 * tests/domain/npcAimFrames.test.js — THE BODY UNDER AN NPC DEED IS ABOUT THAT DEED.
 *
 * The pulse's npc agency lines printed a deed headline over "<name> is out to <aim>.", the two
 * chosen from different keys, so they were about different things ("Caoilfhinn Gallagher pushes
 * through reforms" / "… is out to come through the crisis"; VISIBLE-BUGS item 3b, 2026-11-12:
 * 1,983 lines over the landing region's seeds lf-001..040). The body now gives the aim as the
 * deed's reason, in one of five frames (heraldDeeds.js :: NPC_AIM_FRAMES), picked by a keyed
 * hash. Three arms: every frame reads with every deed and every aim; on a real run every deed
 * line's body names its own deed; and the frames are TEXT ONLY — swapping the whole pool moves
 * no leaf of the world but these body lines.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  NPC_AIM_FRAMES, NPC_AIMS, TARGETED_NPC_DEEDS, UNTARGETED_NPC_DEEDS,
} from '../../src/domain/worldPulse/heraldDeeds.js';
import { PHRASES } from '../../scripts/lib/style-law-scan.mjs';

const HERALD = '../../src/domain/worldPulse/heraldDeeds.js';
const FIXTURE = '../../scripts/generate-landing-fixture.mjs';
const NAME = 'Corvin Ash';
const deedNouns = () => [
  ...Object.values(UNTARGETED_NPC_DEEDS).map((d) => d.noun),
  ...Object.values(TARGETED_NPC_DEEDS).map((d) => d.noun('Maren Holt')),
];

afterEach(() => { vi.doUnmock(HERALD); vi.resetModules(); });

describe('NPC_AIM_FRAMES: five frames, each read with every deed and every aim', () => {
  it('there are five frames, and each says something different', () => {
    expect(NPC_AIM_FRAMES).toHaveLength(5);
    const one = NPC_AIM_FRAMES.map((f) => f({ name: NAME, aim: 'restore order', deed: 'rallying supporters' }));
    expect(new Set(one).size).toBe(5);
  });

  it('every frame × every deed noun × every aim is a clean sentence', () => {
    const bad = [];
    const struck = PHRASES.map((p) => ({ id: p.id, re: new RegExp(p.source, 'i') }));
    for (const frame of NPC_AIM_FRAMES) {
      for (const deed of deedNouns()) {
        for (const aim of Object.values(NPC_AIMS)) {
          const line = frame({ name: NAME, aim, deed });
          const why = [
            !/^[A-Z]/.test(line) && 'no capital',
            !/[a-z')]\.$/.test(line) && 'no full stop',
            /\s{2}|undefined|_|;|\.\./.test(line) && 'machinery',
            !line.includes(NAME) && 'no name',
            !line.includes(aim) && 'no aim',
            !line.toLowerCase().includes(deed.toLowerCase()) && 'no deed',
            ...struck.filter((s) => s.re.test(line)).map((s) => `style law: ${s.id}`),
          ].filter(Boolean);
          if (why.length) bad.push(`${why.join(', ')}: ${line}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('on a real run, every deed line\'s body names its own deed', () => {
  it('lf-033 and lf-003: no deed headline sits over a body about something else', async () => {
    const { analyze } = await import(FIXTURE);
    const apart = [];
    for (const seed of ['lf-033', 'lf-003']) {
      const lines = analyze(seed).news.filter((e) => e?.kind === 'applied'
        && /^npc_/.test(String(e.impactKind)) && UNTARGETED_NPC_DEEDS[String(e.impactKind).slice(4)]);
      expect(lines.length, `${seed}: anti-vacuity`).toBeGreaterThan(10);
      for (const e of lines) {
        const family = String(e.impactKind).slice(4);
        const own = [UNTARGETED_NPC_DEEDS[family].noun, TARGETED_NPC_DEEDS[family]?.noun('').trim()].filter(Boolean);
        if (!own.some((noun) => String(e.summary).toLowerCase().includes(noun.toLowerCase()))) apart.push(`${e.headline} / ${e.summary}`);
      }
    }
    expect(apart).toEqual([]);
  }, 240_000);
});

describe('the frames are text only', () => {
  it('swapping the whole frame pool moves no leaf but the body lines (lf-033, 12 weeks)', async () => {
    /** @param {unknown} v @param {string} [path] @returns {Generator<[string, unknown]>} */
    function* leaves(v, path = '') {
      if (v && typeof v === 'object') { for (const k of Object.keys(v)) yield* leaves(/** @type {any} */ (v)[k], path ? `${path}.${k}` : k); }
      else yield [path, v];
    }
    const run = async () => {
      const { analyze } = await import(FIXTURE);
      const a = analyze('lf-033');
      return new Map(leaves(JSON.parse(JSON.stringify({ worldState: a.campaign.worldState, news: a.news, saves: a.saves.map((s) => s.settlement) }))));
    };
    vi.useFakeTimers({ now: new Date('2026-01-01T00:00:00.000Z'), toFake: ['Date'] });
    try {
      const real = await run();
      vi.resetModules();
      vi.doMock(HERALD, async (orig) => ({ ...(await orig()), NPC_AIM_FRAMES: Object.freeze([() => 'A planted body.']) }));
      const planted = await run();
      const keys = new Set([...real.keys(), ...planted.keys()]);
      const moved = [...keys].filter((k) => real.get(k) !== planted.get(k));
      expect(moved.length, 'anti-vacuity: the plant reached the body lines').toBeGreaterThan(0);
      const notBody = moved.filter((k) => !(/(^|\.)summary$/.test(k) && planted.get(k) === 'A planted body.'));
      expect(notBody).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  }, 240_000);
});
