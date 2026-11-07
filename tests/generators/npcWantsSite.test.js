/**
 * CENSUS-1i unit 6 (the brief's item 6; R-C): NPC_WANTS's site wired. CENSUS-4f declared three wants
 * in place (`docks`, `guild`, `sacredHouse`) and carried them through `textOf`; "a dockhand's
 * oilskins…" printed false in 58 of 96 prints on the 1,000. The draw (`npcGenerator.js ::
 * generateNPCAppearance`) now rolls once over the FULL pool, then resolves through `drawDeclared`
 * against the facts the goal draw already reads (R-V); a refused want resolves to an admitted one
 * by the settlement-keyed argmax, with no further roll.
 */
import { describe, expect, it } from 'vitest';
import { NPC_WANTS } from '../../src/data/npcData.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationOf, declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const DECLARED = new Map(Object.values(NPC_WANTS).flat().filter((r) => typeof r === 'object').map((r) => [r.text, r]));

describe('NPC_WANTS\'s site enforces its declarations (CENSUS-1i unit 6)', () => {
  it('no declared want prints where the final record refuses it (soak1k-0..59)', async () => {
    await ensureLaws();
    const false_ = []; let declaredPrints = 0;
    for (let i = 0; i < 60; i += 1) {
      const { settlement } = birth(i);
      const facts = factsOf(settlement);
      for (const npc of settlement.npcs || []) {
        const row = DECLARED.get(npc?.physical?.clothes);
        if (!row) continue;
        declaredPrints += 1;
        const v = declarationAdmits(declarationOf(row), /** @type {any} */ (facts));
        if (!v.admitted) false_.push(`soak1k-${i} ${npc.name}: ${row.text} (${v.refused.join(', ')})`);
      }
    }
    expect(false_).toEqual([]);
    expect(declaredPrints).toBeGreaterThan(0);
  }, 120000);
});
