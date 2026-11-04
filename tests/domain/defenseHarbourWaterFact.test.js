/**
 * THE HARBOUR LINE READS THE WATER FACT (chair ruling, round 4 final, 2, 2026-11-04). The Defense
 * desk's naval rung (`defenseStateProse.js :: defenseSupportingProse`, DS-DEF-6: "… has a harbour
 * and nothing to hold it with …") read the docks' presence (`compound.hasPort`), which the airship
 * override seats in a dry city; the port flag now also needs `waterAccessKind` not 'none'.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { defenseSupportingProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('the harbour line in an airship city with no water', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('soak1k-869: an airship city with no water claims no harbour on the Defense desk', () => {
    const s = birth(869).settlement;
    expect(s.institutions.some((x) => /Airship/.test(x.name))).toBe(true);
    expect(JSON.stringify(defenseSupportingProse(s, { seed: s._seed }))).not.toMatch(/harbou?r/i);
  });

  it('a coastal port still has its harbour line', () => {
    const s = { name: 'Saltmere', config: { terrainType: 'coastal', tradeRouteAccess: 'port' }, economicState: { compound: { inst: { hasPort: true } } } };
    expect(defenseSupportingProse(s, { seed: 'harbour-coast' }).naval).not.toBeNull();
  });
});
