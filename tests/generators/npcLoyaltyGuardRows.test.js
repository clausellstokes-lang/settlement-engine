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
  // R2-CODE-A-6 (re-keyed by identity with its cause): the chair's row of 2026-11-14 00:20 (a merchant only where a market
  // stands; no master craftsman below a village) and the stage read's low 8 (the three office twins carry their siblings' tier).
  'government#3': ['market'], 'government#14': ['tier: ≥ village'], 'government#17': ['tier: ≥ village'], 'government#18': ['tier: ≥ village'],
  'economy#7': ['tier: ≥ village'],
  'government#5': ['guardPresence'],
  'military#0': ['guardPresence', 'population: ≥ middling'], 'military#1': ['guardPresence', 'garrison'], 'military#3': ['guardPresence'],
  'military#5': ['guardPresence'], 'military#7': ['guardPresence'], 'military#10': ['guardPresence'],
  'religious#2': ['institution: temple'],
  'economy#3': ['market'],
  'criminal#0': ['guardPresence'], 'criminal#6': ['guardPresence', 'watch'],
  'magic#2': ['magic'], 'magic#5': ['magic'], 'magic#6': ['magic'],
  // TAIL-TIES, the chair's ruling (T3) of 2026-11-14 (re-keyed by identity with its cause): a traveller or a cousin comes
  // only by open roads (no siege, no quarantine); goods arrive only by an open route; drinks are paid for at a tavern;
  // a street is a village's or larger; the dead dispute-settler's seat stands open only under a succession crisis; the
  // district (military#0) is the middling band's; the guard captain a watch's (criminal#6), the armoury a garrison's (military#1).
  'economy#0': ['no crisis: under_siege', 'no route: isolated'], 'economy#2': ['no crisis: under_siege', 'no route: isolated'],
  'economy#10': ['no crisis: under_siege', 'no route: isolated'], 'government#13': ['tier: ≥ village'], 'other#24': ['tier: ≥ village'],
  'other#5': ['no crisis: under_siege', 'no crisis: plague_onset'], 'other#35': ['no crisis: under_siege', 'no crisis: plague_onset'],
  'other#8': ['institution: tavern'], 'small_settlement#12': ['crisis: succession'],
  // TAIL-TIES-2 (X9 row 28943; the chair's ruling (T3); re-keyed by identity with its cause): someone from outside the
  // settlement is met only where the roads are open (the traveller's form).
  'government#7': ['no crisis: under_siege', 'no crisis: plague_onset'],
  // TAIL-TIES-2, the inheritors of (T7)'s walk (the same form): a visitor or an outsider at the gate of a besieged town
  'small_settlement#0': ['no crisis: under_siege', 'no crisis: plague_onset'], 'small_settlement#15': ['no crisis: under_siege', 'no crisis: plague_onset'],
  // TAIL-TIES-4, the chair's ruling (T18) of 2026-11-15 (re-keyed by identity with its cause): the cargo comes only by an open
  // route (economy#6, with its inland twin in NPC_HOOK_SIBLINGS); the shop's note and its scales stand where a market does.
  'economy#6': ['no crisis: under_siege', 'no route: isolated'], 'economy#17': ['market'], 'economy#18': ['market'],
  // CLOSE-DOORS-1A (2026-11-18, the close of 2026-11-18; re-keyed by identity with its cause): BAR5-THINGS (c74829e25, LAW 4:
  // the page names no thing the town lacks; JOIN-16 point 9) made three rows declare: the patron's post is an appointed one
  // (government#23), and the traveller's parcel and the buried 'traveller' are crisis-scoped lines that say `any` (other#31,
  // small_settlement#7). Measured against ee2bcd375: no other row moved.
  'government#23': ['appointed post'], 'other#31': ['crisis: any'], 'small_settlement#7': ['crisis: any'],
};

describe('NPC_FACTION_LOYALTY declarations (CENSUS-3e)', () => {
  it('declares exactly the ledger\'s fourteen rows, R2-CODE-A-2\'s seven size rows and R2-CODE-A-6\'s five, each by its atom', () => {
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
