// CENSUS-4: the declaration ledger (docs/census/declarations/) speaks only the closed vocabulary
// (src/domain/facts/factVocabulary.js). Every atom parses; an atom whose dimension has no reader
// yet is NAMED here (it cannot be applied — §3.3), so the list only shrinks as homes land.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAtom, FACT_DIMENSIONS, CRISIS_VALUES } from '../../src/domain/facts/factVocabulary.js';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '../../docs/census/declarations');
// CENSUS-4's ledger files only: CENSUS-3b's ledger shares the directory in its own shapes.
const OWN = /^(?:npcData|npcGenerator|npcStructure|stressInstitutionEffects|crisisCast|institutionDescVariants|institutionServices|tonightSheet|corruptionPass|factionLeaderSecret)\./;
const files = readdirSync(DIR).filter((f) => f.endsWith('.json') && OWN.test(f));

/** The atoms that have no factsOf reader on this tree, by the lines that declare them. Shrink-only. */
const NO_READER = {}; // CENSUS-4b: `guild` homed (facts/guild.js), its 21 lines re-spelled; `organised crime` homed by CENSUS-3b (merged)

describe('the CENSUS-4 declaration ledger', () => {
  it('every row atom is an atom of the vocabulary', () => {
    const bad = [];
    for (const f of files) {
      const j = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
      for (const r of j.rows) {
        for (const a of [...r.needs, ...r.excludes]) if (!parseAtom(a) && !(a in NO_READER)) bad.push(`${f}:${r.id} '${a}'`);
        if (!Array.isArray(r.crisis) && r.crisis !== 'any') bad.push(`${f}:${r.id} crisis ${JSON.stringify(r.crisis)}`);
        for (const c of Array.isArray(r.crisis) ? r.crisis : []) if (!CRISIS_VALUES.includes(c)) bad.push(`${f}:${r.id} crisis '${c}'`);
      }
    }
    expect(bad).toEqual([]);
  });
  it('names, line by line, the atoms that have no reader yet (and no other)', () => {
    const seen = {};
    for (const f of files) {
      const j = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
      for (const r of j.rows) for (const a of [...r.needs, ...r.excludes]) {
        const atom = parseAtom(a);
        if (!atom || FACT_DIMENSIONS[atom.dimension].reader === null) seen[a] = (seen[a] || 0) + 1;
      }
    }
    expect(seen).toEqual(NO_READER);
  });
});
