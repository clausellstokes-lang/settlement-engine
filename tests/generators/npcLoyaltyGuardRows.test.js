/**
 * CENSUS-3e (the chair's answer 4 to CENSUS-3d): `npcData.js :: NPC_FACTION_LOYALTY` declares the
 * fourteen rows of the ledger (`docs/census/declarations/hooks.NPC_FACTION_LOYALTY.json`) at the
 * row: the guard rows `guardPresence`, the shrine row `institution: temple`, the price-fixing row
 * `market`, the three magic rows `magic`. The loyalty draw (`npcGenerator.js :: drawLoyalty`,
 * CENSUS-1c's wiring) resolves a refused row; it stores TEXT, never the declaration column.
 *
 * Measured under R-V before declaring: on soak1k-0..999 the four atoms read at the draw
 * (`birthFactsOf`) equal the final record's on 14,340 of 14,340 loyalty draws.
 */
import { describe, expect, it } from 'vitest';
import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { generateNPCs } from '../../src/generators/npcGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { declarationOf, atomsOf } from '../../src/domain/facts/factVocabulary.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';

const GUARD = /\b(?:guard captain|guards?|soldiers?|armoury|patrol|prisoner|weapons cache)\b/i;

const DECLARED = {
  // R2-CODE-A-2 (the cold list REVIEW-W2A-3, MEDIUM #6; re-keyed by identity with its cause): the government lines that
  // presume an office with staff, an advisor and an official story need a village or larger; the district line needs
  // the middling population band (the chair's ruling (f)).
  'government#1': ['population: ≥ middling'], 'government#2': ['tier: ≥ village'], 'government#4': ['tier: ≥ village'],
  'government#6': ['tier: ≥ village'], 'government#11': ['tier: ≥ village'], 'government#15': ['tier: ≥ village'],
  'government#22': ['tier: ≥ village'],
  'government#5': ['guardPresence'],
  'military#0': ['guardPresence'], 'military#1': ['guardPresence'], 'military#3': ['guardPresence'],
  'military#5': ['guardPresence'], 'military#7': ['guardPresence'], 'military#10': ['guardPresence'],
  'religious#2': ['institution: temple'],
  'economy#3': ['market'],
  'criminal#0': ['guardPresence'], 'criminal#6': ['guardPresence'],
  'magic#2': ['magic'], 'magic#5': ['magic'], 'magic#6': ['magic'],
};

describe('NPC_FACTION_LOYALTY declarations (CENSUS-3e)', () => {
  it('declares exactly the ledger\'s fourteen rows and R2-CODE-A-2\'s seven size rows, each by its atom', () => {
    /** @type {Record<string, string[]>} */ const got = {};
    for (const [cat, rows] of Object.entries(NPC_FACTION_LOYALTY)) {
      rows.forEach((row, i) => { const a = atomsOf(declarationOf(row)); if (a.length) got[`${cat}#${i}`] = a; });
    }
    expect(got).toEqual(DECLARED);
  });

  it('every row that names the armed body declares guardPresence', () => {
    for (const rows of Object.values(NPC_FACTION_LOYALTY)) {
      for (const row of rows) {
        if (GUARD.test(lineText(row))) expect(atomsOf(declarationOf(row)), lineText(row)).toContain('guardPresence');
      }
    }
  });

  it('a town with no watch, garrison or militia prints no guard row, and stores text only', () => {
    const settlement = { tier: 'town', institutions: [{ name: 'Market square', category: 'Economy' }, { name: 'Parish church', category: 'Religious' }] };
    const militaryRows = new Set(NPC_FACTION_LOYALTY.military.map(lineText));
    let military = 0;
    for (let s = 0; s < 40; s++) {
      setActiveRng(createPRNG(`census3e-loyalty-${s}`));
      let npcs;
      try { npcs = generateNPCs(settlement, 'germanic', { tier: 'town', stressTypes: ['under_siege'] }); } finally { clearActiveRng(); }
      for (const npc of npcs) {
        for (const hook of npc.plotHooks || []) {
          expect(typeof hook, 'a hook is stored as text').toBe('string');
          expect(hook).not.toMatch(GUARD); // anchored: military > 0 after the loop proves the hooks are drawn and read
        }
        military += (npc.plotHooks || []).filter((h) => militaryRows.has(h)).length;
      }
    }
    expect(military, 'the siege bias reaches the military pool').toBeGreaterThan(0);
  });
});
