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
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (airship docking and no water): was soak1k-869.
  it('soak1k-11: an airship city with no water claims no harbour on the Defense desk', () => {
    const s = birth(11).settlement;
    expect(s.institutions.some((x) => /Airship/.test(x.name))).toBe(true);
    expect(JSON.stringify(defenseSupportingProse(s, { seed: s._seed })).length).toBeGreaterThan(2);
    expect(JSON.stringify(defenseSupportingProse(s, { seed: s._seed }))).not.toMatch(/harbou?r/i); // anchored: the line above proves the desk is a non-empty record, and the next test pins the harbour line live on a port
  });

  it('a coastal port still has its harbour line', () => {
    const s = { name: 'Saltmere', config: { terrainType: 'coastal', tradeRouteAccess: 'port' }, economicState: { compound: { inst: { hasPort: true } } } };
    expect(defenseSupportingProse(s, { seed: 'harbour-coast' }).naval).not.toBeNull();
  });
});
