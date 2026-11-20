/**
 * hookThemeAnswersHeld.test.js — THE ANSWERS DO NOT MOVE (BUILD-THEMES (iii) and the chair's condition (C3), 2026-11-20).
 *
 * `themeOfText` moved from a table of full hook texts to a digest of their hashes (src/domain/hookThemes.js ::
 * THEME_DIGEST, generated from src/data/npcData.js :: NPC_FACTION_LOYALTY_THEMES). Same signature, same fold, SAME
 * ANSWERS: this file holds the answers to the ones taken at the base 2582075ed BEFORE ANY EDIT, by
 * docs/chair/2026-11-20/content/depth/themes/corpus-scan.mjs --base, in tests/fixtures/hookThemeAnswers.base.json
 * (answer -> base-36 fnv1a32(hookThemeKey(text)); it quotes no sentence). The texts are recomputed here:
 *   pools  — every NPC_FACTION_LOYALTY line: EXACT set equality with the fixture, every answer equal;
 *   legacy — every hook text of the stored saves under tests/fixtures/legacy-saves/ (npcs[].plotHooks, collectPlotHooks,
 *            deriveAllStructuredHooks, after normalizeSettlement): EXACT set equality, every answer equal (a stored file
 *            does not move, so neither may its texts' answers);
 *   hxd    — every stored hook text of the births hxd-<size>-0..4 (the measure's births, the same three readers): every
 *            text the fixture holds answers what it answered, and at least 50 of them do, typed and untyped both (a
 *            later tranche's appended line may move a birth's draws, so the births are matched, not frozen).
 * The whole corpus (golden 525, census 720, hxd, legacy) is held by the scan's --check, beside the script.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { UNTYPED, hookThemeKey, themeOfText } from '../../src/domain/hookThemes.js';
import { fnv1a32 } from '../../src/kernel/proseHash.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { deriveAllStructuredHooks } from '../../src/domain/hookEscalation.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const FIXTURE = JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/hookThemeAnswers.base.json'), 'utf8'));
/** @param {string} part @returns {Map<string, string>} hash -> answer at the base */
const baseOf = (part) => new Map(Object.entries(FIXTURE.parts[part]).flatMap(([answer, hashes]) => hashes.map((h) => [h, answer])));
/** @param {string} text */
const hashOf = (text) => fnv1a32(hookThemeKey(text)).toString(36);

/** Every text the render readers of `themeOfText` are handed for one stored town. @param {any} town @returns {string[]} */
function hookTextsOf(town) {
  const out = [];
  for (const npc of town?.npcs || []) for (const h of npc?.plotHooks || []) out.push(typeof h === 'string' ? h : h?.text);
  for (const h of collectPlotHooks(town)) out.push(h?.text);
  for (const h of deriveAllStructuredHooks(town)) out.push(h?.text);
  return out.filter((t) => typeof t === 'string');
}

/** hash -> answer now, for texts; a hash two texts answer differently is reported. @param {string[]} texts */
function answersNow(texts) {
  const now = new Map();
  const split = [];
  for (const t of texts) {
    const h = hashOf(t);
    const a = themeOfText(t);
    if (now.has(h) && now.get(h) !== a) split.push(h);
    now.set(h, a);
  }
  return { now, split };
}

describe('themeOfText answers what it answered at the base 2582075ed', () => {
  it('pools: every NPC_FACTION_LOYALTY line, exact set, every answer equal', () => {
    const base = baseOf('pools');
    const { now, split } = answersNow(Object.values(NPC_FACTION_LOYALTY).flat().map(lineText));
    expect(base.size, 'the fixture\'s pool part').toBe(270);
    expect(split).toEqual([]);
    expect([...now.keys()].filter((h) => !base.has(h)), 'live line(s) the base did not hold').toEqual([]);
    expect([...base.keys()].filter((h) => !now.has(h)), 'base line(s) no longer live').toEqual([]);
    expect([...now].filter(([h, a]) => base.get(h) !== a), 'moved answers').toEqual([]);
    expect([...now.values()].filter((a) => a === UNTYPED), 'an untyped pool line').toEqual([]);
  });

  it('legacy saves: every stored hook text, exact set, every answer equal', () => {
    const base = baseOf('legacy');
    const texts = [];
    for (const file of ['april-2026-v1.json', 'people-car-v1-2026-11-07.json']) {
      for (const entry of JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/legacy-saves', file), 'utf8'))) {
        texts.push(...hookTextsOf(normalizeSettlement(entry.settlement)));
      }
    }
    const { now, split } = answersNow(texts);
    // anchored: the saves hold hooks, typed and untyped both
    expect(base.size).toBeGreaterThanOrEqual(50);
    expect([...now.values()].some((a) => a === UNTYPED)).toBe(true);
    expect([...now.values()].some((a) => a !== UNTYPED)).toBe(true);
    expect(split).toEqual([]);
    expect([...now.keys()].filter((h) => !base.has(h)), 'stored text(s) the base did not hold').toEqual([]);
    expect([...base.keys()].filter((h) => !now.has(h)), 'base text(s) the saves no longer yield').toEqual([]);
    expect([...now].filter(([h, a]) => base.get(h) !== a), 'moved answers').toEqual([]);
  });

  describe('hxd births', () => {
    beforeAll(async () => { await loadGenerationLawPayloads(); });

    it('every stored hook text of hxd-<size>-0..4 the base held answers the same; at least 50, typed and untyped', () => {
      const base = baseOf('hxd');
      const texts = [];
      for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
        for (let i = 0; i < 5; i += 1) {
          texts.push(...hookTextsOf(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} })));
        }
      }
      const { now, split } = answersNow(texts);
      const held = [...now].filter(([h]) => base.has(h));
      expect(split).toEqual([]);
      // anchored: the matched texts are many and of both kinds, so "equal" is not read over nothing
      expect(held.length).toBeGreaterThanOrEqual(50);
      expect(held.filter(([, a]) => a === UNTYPED).length).toBeGreaterThanOrEqual(25);
      expect(held.filter(([, a]) => a !== UNTYPED).length).toBeGreaterThanOrEqual(25);
      expect(held.filter(([h, a]) => base.get(h) !== a), 'moved answers').toEqual([]);
    }, 240_000);
  });
});
