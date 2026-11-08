/**
 * promptsNpcFaction.test.js — FIX-PUBLIC-VEIL step 3 (2026-11-07): the edge function
 * generate-narrative's three NPC extracts (frictionPoints, connectionsMap, tabNotes) read the
 * card's BEST-ranked membership as the NPC's `faction`, never the people car's retired
 * `factionAffiliation` (PEOPLE-RULINGS M-2). Executed on the real REFINEMENT_PASSES, and a source
 * scan pins that no read of any of the five retired card fields remains in the edge tree's source.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { REFINEMENT_PASSES, npcFactionOf } from '../../supabase/functions/generate-narrative/prompts.ts';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CARD = { name: 'Robert Thomas', role: 'the priest', institution: { kind: 'house', key: 'Parish church', veiled: false },
  memberships: [{ power: 'The Guilds', rank: 2, share: 0.3 }, { power: 'The Parish', rank: 1, share: 0.7 }, { power: 'The Moot', rank: null }] };
const RECORD = {
  npcs: [CARD, { name: 'Wynn Tallow', role: 'traveller', institution: null, factionAffiliation: 'RETIRED-FIELD' }],
  powerStructure: { factions: [{ faction: 'The Parish', isGoverning: true }, { faction: 'The Guilds' }] },
  institutions: [{ name: 'Parish church', category: 'Religious' }],
  stress: [{ label: 'Famine', summary: 'The granary is low.' }],
};

describe('generate-narrative: the NPC extracts read memberships, not the retired factionAffiliation', () => {
  it('npcFactionOf is the best-ranked power, undefined for a card in no power', () => {
    expect(npcFactionOf(CARD)).toBe('The Parish');
    expect(npcFactionOf({ memberships: [{ power: 'A', rank: null }, { power: 'B', rank: null }] })).toBe('A');
    expect(npcFactionOf({ memberships: [] })).toBeUndefined();
    expect(npcFactionOf({ factionAffiliation: 'RETIRED-FIELD' })).toBeUndefined();
  });

  it('each of the three passes carries the card\'s power and never the retired field', () => {
    // the three extracts whose NPC rows carry a `faction` (found by their output, not assumed)
    const extracts = Object.entries(REFINEMENT_PASSES)
      .map(([id, pass]) => [id, pass.extract(RECORD)])
      .filter(([, out]) => Array.isArray(out?.npcs) && out.npcs.some((n) => 'faction' in n));
    expect(extracts.map(([id]) => id).sort()).toEqual(['connectionsMap', 'frictionPoints', 'tabNotes']);
    for (const [id, out] of extracts) {
      expect(out.npcs.find((n) => n.name === 'Robert Thomas')?.faction, id).toBe('The Parish');
      expectAbsentWithAnchor(JSON.stringify(out).split('"'), 'RETIRED-FIELD', 'Robert Thomas', `${id} reads no retired field`);
    }
  });

  it('the edge tree\'s source reads none of the five retired card fields', () => {
    const RETIRED = /\b(factionAffiliation|secondaryAffiliation|linkedFactionIds|factionGoal|densityRungRole)\b/;
    const dir = resolve(process.cwd(), 'supabase', 'functions');
    const files = readdirSync(dir, { recursive: true }).map(String)
      .filter((f) => /\.ts$/.test(f) && !f.includes('node_modules'));
    expect(files.some((f) => f.endsWith('generate-narrative/prompts.ts'))).toBe(true);
    const hits = files.filter((f) => RETIRED.test(readFileSync(resolve(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')));
    expect(hits).toEqual([]);
  });
});
