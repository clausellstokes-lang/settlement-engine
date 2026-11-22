/**
 * "Not relied on" and "absent" are two states (lane RUNG1B-F9 unit 2, 2026-11-04). Red on the
 * base: soak1k-13 (Amarthal, hamlet; magicExists true, priorityMagic 0) printed "There is magic
 * at Amarthal and the hamlet does not rest on it" under an envelope reading "Availability
 * absent", and "Magical Capability Critical" on the Overview; the soak's coh:magic-absent-prose
 * counted 20 of 60 at 64aeda874 (every absent page draws one of DS-DEF-9's false variants, all
 * three of which presume magic).
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveMagicProfile } from '../../src/domain/magicProfile.js';
import { deriveMagicReliance, magicDialAbsent } from '../../src/domain/magicReliance.js';
import { magicRelianceDeskSettlement, magicRowsGated } from '../../src/domain/display/dossierViewModel.js';
import {
  defenseMagicDependencyProse, magicDependencyPoolKey,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';

const ABSENT_KEY = 'magicDependency false, availability absent';
/** @type {any} */
let absent;
/** @type {any} */
let present;

beforeAll(async () => {
  await loadGenerationLawPayloads();
  const born = (priorityMagic, seed) => generateSettlementPipeline(
    birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet', magicExists: true, priorityMagic }), null, { seed },
  );
  absent = born(0, 'f9-magic-absent-hamlet');
  present = born(60, 'f9-magic-present-hamlet');
}, 120_000);

describe('the absent state is its own state', () => {
  it('fixture premise: the zero dial reads availability absent, and nobody practises', () => {
    expect(magicDialAbsent(absent)).toBe(true);
    expect(deriveMagicProfile(absent)?.availability).toBe('absent');
    expect(deriveMagicReliance(absent).reading).toBe('none');
    expect(magicDialAbsent(present)).toBe(false);
  });

  it('the pool key splits the false reading by availability', () => {
    expect(magicDependencyPoolKey(false, false, true)).toBe(ABSENT_KEY);
    expect(magicDependencyPoolKey(false, false, false)).toBe('magicDependency false');
    expect(magicDependencyPoolKey(false, false)).toBe('magicDependency false');
    expect(magicDependencyPoolKey(true, false, true)).toBe('magicDependency true');
  });

  it('under availability absent the desk says no one works magic, and never that magic is here', () => {
    const opts = { seed: 'f9', audience: 'dm', tierNoun: 'hamlet' };
    const sentence = defenseMagicDependencyProse(magicRelianceDeskSettlement(absent), opts).arcaneReliance?.sentence || '';
    const pool = DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-9'].pools[ABSENT_KEY].map((v) => v.text.split('{settlement}')[0]);
    expect(pool.some((head) => sentence.startsWith(head))).toBe(true);
    expect(sentence).not.toMatch(/There is magic at|\bpractitioners?\b|the arcane went away/); // anchored: the line above proves the sentence opens with a live head of the absent pool
  });

  it('the absent pool itself asserts no practitioner and no magic present', () => {
    expect(DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-9'].pools[ABSENT_KEY].length).toBeGreaterThan(0);
    for (const v of DOSSIER_STATE_PROSE_DEFENSE['DS-DEF-9'].pools[ABSENT_KEY]) {
      expect(v.text).not.toMatch(/There is magic at|\bpractitioners?\b|the arcane went away|\d/); // anchored: the line before the loop proves the absent pool is non-empty
    }
  });
});

describe('the magic grade rows go where the dial reads absent; the reliance row stays (2b)', () => {
  const ROWS = [{ key: 'monster' }, { key: 'magical' }, { key: 'magical_stability' }, { key: 'magicReliance' }];
  it('drops Magical Capability and Magical stability, keeps Reliance on magic', () => {
    expect(magicRowsGated(absent, ROWS).map((r) => r.key)).toEqual(['monster', 'magicReliance']);
  });
  it('changes nothing where the dial reads present', () => {
    expect(magicRowsGated(present, ROWS).map((r) => r.key)).toEqual(ROWS.map((r) => r.key));
  });
});
