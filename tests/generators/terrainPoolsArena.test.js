/**
 * GLADIATORIAL COMBAT WITH NO ARENA (soak 1000 row 13, battery class A-05). The supply chain
 * `gambling_arena` (src/data/supplyChainData.js) listed the arena's own spectacles among its
 * outputs whichever processor opened it, so a gambling den alone printed "Gladiatorial combat"
 * on the Economy tab of 188 towns and larger. The arena's rows now need the Arena processor.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const inst = (name) => ({ name, catalogId: catalogIdForName(name) });
const arenaChain = (insts, tier) => computeActiveChains(insts.map(inst), [], tier, 'road')
  .find((chain) => chain.chainId === 'gambling_arena');
const ARENA_ROWS = ['Gladiatorial combat', 'Monster exhibitions', 'Public games'];

describe('the arena chain (hand-built)', () => {
  it('a town with a gambling den and no arena offers games of chance and no gladiators', () => {
    const chain = arenaChain(['Gambling den'], 'town');
    expect(chain).toBeTruthy();
    expect(chain.outputs).toContain('Games of chance');
    for (const row of ARENA_ROWS) expect(chain.outputs).not.toContain(row); // anchored: the line above pins Games of chance in these outputs
  });
  it('a metropolis with a Colosseum keeps the arena rows', () => {
    const chain = arenaChain(['Colosseum/arena', 'Gambling district'], 'metropolis');
    expect(chain.outputs).toContain('Gladiatorial combat');
  });
});

describe('the soak seeds that printed gladiators with no arena', () => {
  beforeAll(async () => { await ensureLaws(); });
  it.each([4, 28, 40])('soak1k-%i prints no gladiatorial chain output', (i) => {
    const { settlement: s } = birth(i);
    const names = (s.institutions || []).map((x) => String(x?.name || '').toLowerCase()).join(' | ');
    expect((s.institutions || []).length).toBeGreaterThan(0);
    expect(names).not.toMatch(/arena|amphithea|colosse|fighting pit/); // anchored: the line above proves the roster is live
    const outputs = (s.economicState?.activeChains || []).flatMap((chain) => chain.outputs || []);
    expect((s.economicState?.activeChains || []).length).toBeGreaterThan(0);
    expect(outputs).not.toContain('Gladiatorial combat'); // anchored: the line above proves the active chains are live
  });
});
