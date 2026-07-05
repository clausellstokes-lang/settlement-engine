import { describe, expect, it } from 'vitest';

import { RESOURCE_CHAINS } from '../../src/data/resourceData.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { instMatchesProcessor } from '../../src/generators/resourceGenerator.js';

// resourceGenerator classifies each resource chain by whether a settlement has the
// institutions that process it — RESOURCE_CHAINS.processingInstitutions matched against
// the real institution names. Those chain-side names are idealized DISPLAY strings
// ("Weavers' guild", "Winery"); the catalog names drift ("Weavers/Textile workers",
// "Vintner"). The old strict-`===` join meant almost every chain was reported as
// unexploited in the dossier/PDF even when its processors were present. This pins the
// join through the REAL matcher (imported, not copied) so a catalog rename, a new chain,
// or a drifted processor name reds the gate instead of silently breaking resource
// analysis — the same silent-string-join class tests/joins/goods.test.js closes.

function catalogNamesLower() {
  const names = [];
  for (const tier of Object.values(institutionalCatalog)) {
    for (const group of Object.values(tier)) {
      for (const name of Object.keys(group)) names.push(name.toLowerCase());
    }
  }
  return names;
}

describe('joins: RESOURCE_CHAINS processing institutions resolve to the catalog', () => {
  const cat = catalogNamesLower();
  const resolves = (procName) => cat.some((n) => instMatchesProcessor(n, procName));

  it('the harness sees data (not vacuous)', () => {
    expect(Object.keys(RESOURCE_CHAINS).length).toBeGreaterThan(15);
    expect(cat.length).toBeGreaterThan(100);
  });

  it('every chain has at least one processor that resolves to a real catalog institution', () => {
    const dead = Object.entries(RESOURCE_CHAINS)
      .filter(([, c]) => !(c.processingInstitutions || []).some(resolves))
      .map(([k]) => k);
    expect(dead, `chains whose processors match NO catalog institution (permanently unexploited): ${dead.join(', ')}`).toEqual([]);
  });

  it('documents the only processors with no catalog equivalent (their chain still exploits via others)', () => {
    const unresolved = [];
    for (const [k, c] of Object.entries(RESOURCE_CHAINS)) {
      for (const p of c.processingInstitutions || []) if (!resolves(p)) unresolved.push(`${k}:${p}`);
    }
    // Cheesemaker and Artisan workshop are genuinely absent from the catalog; livestock
    // still exploits via Butcher/Tannery and desertGlass via Glassblower. If this set
    // changes, reconcile the chain or add the institution to the catalog — don't just
    // update this expectation.
    expect(unresolved.sort()).toEqual(['desertGlass:Artisan workshop', 'livestock:Cheesemaker']);
  });

  it('the matcher does not over-match "blacksmith" onto the criminal "Black market"', () => {
    // The keyword table maps blacksmiths→'blacksmith' (a whole word), never a bare
    // 'black' prefix, so an ironOre chain is not "processed" by a black market.
    expect(instMatchesProcessor('Black market', "Blacksmiths' guild")).toBe(false);
    expect(instMatchesProcessor('Blacksmith', "Blacksmiths' guild")).toBe(true);
  });
});
