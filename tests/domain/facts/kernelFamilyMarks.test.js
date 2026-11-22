/**
 * CENSUS-1i unit 8 (wave 2, R-O): F12's five crisis-family marks and the `walls` mark onto the
 * vocabulary's dimensions. The kernel's eligibility still reads the caller's answered dimension
 * (law 5), so no draw moves; what changes is what the ledger notes, so the birth self-check
 * re-asserts a family mark against the final record through the vocabulary's crisis reader.
 */
import { describe, expect, it } from 'vitest';
import { STATE_MARK_DIMENSIONS, MARK_DIMENSION_ATOM, declarationOfMarks, declarationOfTags, declarationAdmits, atomsOf } from '../../../src/domain/facts/factVocabulary.js';
import { CRISIS_FAMILIES, crisisDimensionsOf } from '../../../src/domain/crisis/crisisFacts.js';
import { noteDrawnVariant } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../src/data/dossierStateProse/warFaith.generated.js';

const FAMILIES = Object.keys(CRISIS_FAMILIES);

describe('the kernel\'s fact marks onto the vocabulary (CENSUS-1i unit 8)', () => {
  it('every F12 family and walls is a mapped mark dimension, its words the kernel\'s', () => {
    expect(Object.keys(MARK_DIMENSION_ATOM).sort()).toEqual(['walls', ...FAMILIES].sort());
    for (const f of FAMILIES) expect(STATE_MARK_DIMENSIONS[f]).toEqual([CRISIS_FAMILIES[f].on, CRISIS_FAMILIES[f].off]);
  });

  it('a family mark admits exactly where the desks\' own answer (crisisDimensionsOf) speaks, on a record per family', () => {
    const records = [
      { stress: [] }, { stress: [{ type: 'under_siege' }] }, { stress: [{ type: 'succession_void' }] },
      { stress: [{ type: 'insurgency' }] }, { stress: [{ type: 'famine' }] }, { stress: [{ type: 'indebted' }] },
      { stress: [{ type: 'indebted' }], economicState: { foodSecurity: { foodRecord: { band: 'Famine' } } } },
    ];
    for (const r of records) {
      const answered = crisisDimensionsOf(r); const facts = factsOf(r);
      for (const f of FAMILIES) {
        for (const word of STATE_MARK_DIMENSIONS[f]) {
          const speaks = answered[f] === word;
          const decl = declarationOfTags(atomsOf(declarationOfMarks([word]))); // the self-check's own re-parse
          expect(declarationAdmits(decl, facts).admitted, `${JSON.stringify(r)} ${word}`).toBe(speaks);
        }
      }
    }
  });

  it('no shipped variant carries two positive family marks (the dimension\'s disjunction never widens law 5)', () => {
    const on = new Set(FAMILIES.map((f) => CRISIS_FAMILIES[f].on));
    let multi = 0; let marked = 0;
    const walk = (/** @type {any} */ x) => {
      if (Array.isArray(x)) x.forEach(walk);
      else if (x && typeof x === 'object') {
        if (Array.isArray(x.marks) && typeof x.text === 'string') { const n = x.marks.filter((/** @type {string} */ w) => on.has(w)).length; if (n > 1) multi += 1; if (n) marked += 1; }
        else Object.values(x).forEach(walk);
      }
    };
    walk([DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL, DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH]);
    expect(marked).toBeGreaterThan(0);
    expect(multi).toBe(0);
  });

  it('a drawn variant with a family mark is noted with its atom', () => {
    const { ledger } = withPresumptionLedger(() => noteDrawnVariant({ vid: 7, text: 'x', marks: ['no threat'] }, { blockId: 'B', poolKey: 'p' }));
    expect(ledger.map((e) => e.atoms)).toEqual([['no crisis: threat']]);
  });
});
