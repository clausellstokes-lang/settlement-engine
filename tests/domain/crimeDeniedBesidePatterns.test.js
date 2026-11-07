/**
 * RUNG-2 LANDING phase D, R-D2 (the chair's ruling; F9's law extended): the denial sentence reads
 * the block's own operations. On `soak1k-1801` (Tarkhanbulag, hamlet, religious conversion) the
 * Defense tab printed DS-DEF-4's "No criminal infrastructure has been identified at Tarkhanbulag."
 * directly under the block's own "Active crime patterns" — religious fraud and informant networks
 * among them. F9 made the structure read the operations list and the running criminal chains; the
 * denial (DS-DEF-4's `structure null` pool and the tab's static no-organised-crime line) now also
 * reads the block's crime patterns and prints only where the block lists nothing criminal.
 */
import { describe, expect, it } from 'vitest';

import { blockListsCrime, deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { bootHarness, renderSurfaces } from '../../scripts/audit/soak-review/renderHarness.mjs';

/** @param {Record<string, unknown>} safetyProfile */
const place = (safetyProfile) => ({ name: 'Tarkhanbulag', tier: 'hamlet', institutions: [], powerStructure: { factions: [] }, economicState: { safetyProfile } });
const PATTERNS = [
  { type: 'religious fraud', desc: 'False conversion declarations sold or arranged for a fee.' },
  { type: 'informant networks', desc: 'Enforcement authorities paying for information about non-compliant households.' },
];
const DENIAL = /No criminal infrastructure has been identified|goes wrong one thing at a time and belongs to whoever did it|met with genuine incomprehension|No organized criminal infrastructure detected/;

describe('R-D2: the criminal-structure denial reads the block\'s own crime patterns', () => {
  it('the predicate: crime patterns, a listed operation or a running criminal chain each list crime', () => {
    expect(blockListsCrime(place({ crimeTypes: [] }))).toBe(false);
    expect(blockListsCrime(place({ crimeTypes: PATTERNS }))).toBe(true);
    expect(blockListsCrime(place({ criminalInstitutions: ['Gambling Den'] }))).toBe(true);
    expect(blockListsCrime({ economicState: { activeChains: [{ needKey: 'criminal_economy', status: 'operational' }] } })).toBe(true);
    expect(blockListsCrime(null)).toBe(false);
  });

  it('fixture premise: the structure reads null beside the patterns (they are no house and no chain)', () => {
    expect(deriveCriminalStructure(place({ crimeTypes: PATTERNS }))).toBeNull();
  });

  it('soak1k-1801: neither the Defense tab nor the print chapter prints a denial under the conversion\'s patterns', async () => {
    await ensureLaws();
    const s = birth(1801).settlement;
    expect((s.economicState.safetyProfile.crimeTypes || []).map((c) => c.type)).toEqual(expect.arrayContaining(['religious fraud', 'informant networks']));
    expect(deriveCriminalStructure(s)).toBeNull();
    const r = renderSurfaces(await bootHarness(), s);
    expect(r.tabs.defense).toMatch(/Active crime patterns\s*\n\s*underground worship/);
    expect(r.tabs.defense).not.toMatch(DENIAL); // anchored: the patterns line is matched in this same tab on the line above
    expect(Object.keys(buildPrintProse(s).defense || {}).length, 'the print chapter\'s defence prose was built').toBeGreaterThan(0);
    expect(buildPrintProse(s).defense?.['defense.criminalStructure'] ?? '').not.toMatch(DENIAL); // anchored: the line above proves the defence prose is built for this record
  }, 120_000);
});
