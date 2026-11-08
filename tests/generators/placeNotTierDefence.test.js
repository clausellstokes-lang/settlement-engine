/**
 * R6 UNIT 1 — THE PLACE'S DEFENCE, NOT THE TIER'S (soak 1000 rung 1, kind 4 `coh:defense-words`;
 * the dry run's row 3: the military government line 129, "Guard Captain" 145, "The garrison"
 * as a power 72). Three writers spoke of soldiers, a captain of the guard and a garrison that
 * the place's own record (`src/domain/defense/defenseFacts.js :: defenseFactsOf`) does not hold:
 *
 *   - `factionDynamics.js :: computeFactionRelationships`, the Governing ↔ Military subordinate
 *     line "Command authority is unambiguous: soldiers enforce rather than govern.";
 *   - `npcGenerator.js :: generateNPCs`, the tier's mandated "Guard Captain" (and the pool's);
 *   - `historyGenerator.js :: buildHistoricalEvent`, "Official guards" → "The garrison".
 *
 * Each now reads the place's standing forces. The seeds are the rung's own corpus
 * (`scripts/audit/soak-review/corpus.mjs :: birth`): soak1k-110 is a village with no garrison,
 * watch or militia that printed both the line and a Guard Captain; soak1k-13 a hamlet with no
 * force whose tension listed "The garrison" as a party.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { computeFactionRelationships } from '../../src/generators/factionDynamics.js';

const LINE = 'Command authority is unambiguous: soldiers enforce rather than govern.';
const NO_FORCE = Object.freeze({ hasGarrison: false, hasWatch: false, hasMilitia: false, hasMercenary: false });

/** @param {any} s */
const forceTerms = (s, texts) => defenseWordsFindings(s, texts)
  .filter((f) => ['garrison', 'soldiers', 'Guard Captain'].includes(f.term));

describe('the military government line reads the standing forces', () => {
  const factions = [
    { faction: 'Town Council', power: 60, isGoverning: true },
    { faction: 'Military/Guard', power: 20 },
  ];
  const relOf = (facts) => computeFactionRelationships(factions, 'town', {}, {}, [], facts)
    .find((r) => r.pair.includes('Military/Guard'));

  it('keeps the line where soldiers stand (a garrison or a hired company)', () => {
    expect(relOf({ ...NO_FORCE, hasGarrison: true }).narrative).toContain(LINE);
    expect(relOf({ ...NO_FORCE, hasMercenary: true }).narrative).toContain(LINE);
  });

  it('drops the soldiers sentence, and only it, where none stand', () => {
    const rel = relOf({ ...NO_FORCE, hasMilitia: true });
    expect(rel.type).toBe('subordinate');
    expect(rel.narrative).not.toContain('soldiers'); // anchored: the next line pins the relationship's whole narrative
    expect(rel.narrative).toBe('Military/Guard operates as the executive arm of Town Council.');
  });
});

describe('a village with no garrison, watch or militia (soak1k-110)', () => {
  /** @type {any} */ let s;
  beforeAll(async () => { await ensureLaws(); s = birth(110).settlement; });

  it('is the case: a village whose record holds no standing force', () => {
    expect(s.tier).toBe('village');
    const f = defenseFactsOf(s);
    expect([f.hasGarrison, f.hasWatch, f.hasMilitia, f.hasMercenary]).toEqual([false, false, false, false]);
  });

  it('prints no soldiers line on its Power tab', () => {
    const narratives = (s.powerStructure.factionRelationships || []).map((r) => r.narrative);
    expect(narratives.length).toBeGreaterThan(0);
    expect(narratives.join('\n')).not.toContain('soldiers enforce rather than govern'); // anchored: the line above proves the relationship narratives are live
    expect(forceTerms(s, narratives)).toEqual([]);
  });

  it('seats no Guard Captain', () => {
    const roles = s.npcs.map((n) => n.role);
    expect(roles.length).toBeGreaterThan(0);
    expect(roles).not.toContain('the militia captain'); // anchored: the line above proves the roster is live (2026-11-07 PEOPLE-1 CAST, M-1b: the role is the title)
    expect(forceTerms(s, roles)).toEqual([]);
  });
});

describe('a village with a militia keeps its Guard Captain (soak1k-20)', () => {
  /** @type {any} */ let s;
  beforeAll(async () => { await ensureLaws(); s = birth(20).settlement; });

  it('has a militia on the record and a Guard Captain on the roster', () => {
    expect(s.tier).toBe('village');
    expect(defenseFactsOf(s).hasMilitia).toBe(true);
    expect(s.npcs.map((n) => n.role)).toContain('the militia captain'); // 2026-11-07 PEOPLE-1 CAST (M-1b): the militia's face
  });
});

describe('a hamlet with no force names no garrison as a party (soak1k-13)', () => {
  /** @type {any} */ let s;
  beforeAll(async () => { await ensureLaws(); s = birth(13).settlement; });

  it('is the case: a hamlet with no standing force', () => {
    expect(s.tier).toBe('hamlet');
    expect(defenseFactsOf(s).forceName).toBe(null);
  });

  it('lists no "The garrison" among the parties of its tensions', () => {
    const parties = (s.history?.currentTensions || []).flatMap((t) => t.factions || []);
    expect((s.history?.currentTensions || []).length).toBeGreaterThan(0);
    expect(parties).not.toContain('The garrison'); // anchored: the line above proves the tensions are live
    expect(forceTerms(s, parties)).toEqual([]);
  });
});
