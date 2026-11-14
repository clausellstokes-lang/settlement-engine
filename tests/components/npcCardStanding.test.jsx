/** @vitest-environment jsdom */
/**
 * npcCardStanding.test.jsx — A WORD IS PRINTED UNDER THE NAME OF WHAT IT MEASURES (NOLANE-2, R2B-979).
 *
 * "established", "marginal" and "commanding" measure a person's STANDING in the town. The card used to print them in
 * the "Disposition" list beside temperament, loyalty and fear (461 of the 720 births). The standing now prints on a
 * row of its own, under its own label; the Disposition row holds only temperament, loyalty and fear. Display only:
 * the record's `influence` does not move.
 *
 * A collected arm over census births (SECOND-WAVE-CENSUS dials): every named person of a thorp, a village and a city
 * whose record carries an influence prints "Standing <word>", and no Disposition row carries a standing word.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NPCCategoryGroup } from '../../src/components/new/npcComponents.jsx';

afterEach(cleanup);

const STANDING_WORD = { high: 'commanding', moderate: 'established', low: 'marginal' };

/** The expanded card's rows, by label: { Standing: 'x', Disposition: 'a, b' } (a missing row is absent). */
function cardRows(npc) {
  render(<NPCCategoryGroup category="civic" label="Civic" group={[npc]} />);
  const toggles = screen.getAllByRole('button', { expanded: false });
  fireEvent.click(toggles[toggles.length - 1]);
  const rows = {};
  for (const label of ['Standing', 'Disposition']) {
    const el = screen.queryByText(label);
    if (el) rows[label] = (el.parentElement?.textContent || '').slice(label.length).trim();
  }
  cleanup();
  return rows;
}

describe('NPC card — the standing prints under its own label', () => {
  it('a person of high influence prints "Standing commanding", and the Disposition row holds the rest', () => {
    const rows = cardRows({
      id: 'n1', name: 'Aldis', role: 'Guildmaster', influence: 'high',
      personality: { dominant: 'stern' }, loyalty: 'the crown', fear: 'the mob',
    });
    expect(rows.Standing).toBe('commanding');
    expect(rows.Disposition).toBe('stern, the crown, the mob');
  });

  it('a person with a standing and no temperament, loyalty or fear prints the standing and no Disposition row', () => {
    const rows = cardRows({ id: 'n2', name: 'Bern', role: 'Warden', influence: 'low' });
    expect(rows.Standing).toBe('marginal');
    expect(Object.keys(rows)).toEqual(['Standing']);
  });

  it('births: every person with an influence prints its standing word under "Standing", and no Disposition row carries one', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    await loadGenerationLawPayloads();
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
      selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    let read = 0;
    for (const [seed, settType] of [['r2r-thorp-0', 'thorp'], ['r2r-village-31', 'village'], ['r2r-city-0', 'city']]) {
      const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType }), null, { seed, customContent: {} });
      for (const npc of (town.npcs || []).slice(0, 12)) {
        const word = STANDING_WORD[String(npc.influence)];
        if (!word) continue;
        const rows = cardRows(npc);
        read++;
        expect(rows.Standing, `${seed} ${npc.name}: the standing prints under its own label`).toBe(word);
        const leaked = Object.values(STANDING_WORD).filter((w) => (rows.Disposition || '').includes(w));
        expect(leaked, `${seed} ${npc.name}: no standing word in Disposition`).toEqual([]);
      }
    }
    expect(read, 'anchored: the births carry people with an influence').toBeGreaterThan(5);
  }, 180000);
});
