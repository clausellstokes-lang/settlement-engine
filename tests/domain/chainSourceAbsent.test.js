/**
 * R2-CODE-B round 3, ruling (d) — A CHAIN NAMES NO GROUND THE RECORD SAYS IS ABSENT (the first seat's #804:
 * "Hunting grounds" as an entrepôt fur chain's "From" in a metropolis with no hunting grounds). One home:
 * src/domain/display/chainHouses.js :: chainSourceOf, read by the page's chain card
 * (SupplyChainsPanel.jsx :: chainFlowFacts, on Economics) and the PDF's chain rows (SupplyChainFlow.jsx,
 * Services.jsx :: ChainCard). Display only.
 */
import { describe, expect, test } from 'vitest';
import { chainSourceOf } from '../../src/domain/display/chainHouses.js';
import { chainFlowFacts } from '../../src/components/new/SupplyChainsPanel.jsx';

const FURS = { chainId: 'furs_north', resource: 'Hunting grounds', resourceCondition: 'absent', resourceInputAvailable: false, entrepot: true, processingInstitutions: [] };
const DEPLETED = { chainId: 'fishing', resource: 'Fishing grounds', resourceCondition: 'depleted', resourceInputAvailable: false, resourceDepleted: true, processingInstitutions: [] };
const WORKED = { chainId: 'timber', resource: 'Managed woodland', resourceCondition: 'normal', resourceInputAvailable: true, processingInstitutions: [] };

describe('ruling (d): the chain card\'s "From" names only a ground the town has', () => {
  test('an absent ground is not named; a depleted or worked ground is', () => {
    expect(chainSourceOf(FURS)).toBeNull();
    expect(chainSourceOf(DEPLETED)).toBe('Fishing grounds');
    expect(chainSourceOf(WORKED)).toBe('Managed woodland');
  });

  test('a record older than the condition field reads the input flag the same way', () => {
    expect(chainSourceOf({ resource: 'Salt flats', resourceInputAvailable: false })).toBeNull();
    expect(chainSourceOf({ resource: 'Grazing land', resourceInputAvailable: false, resourceDepleted: true })).toBe('Grazing land');
    expect(chainSourceOf({ resource: 'Grazing land' })).toBe('Grazing land');
    expect(chainSourceOf(null)).toBeNull();
  });

  test('the page\'s chain card reads it', () => {
    expect(chainFlowFacts(FURS, []).resource).toBeNull();
    expect(chainFlowFacts(DEPLETED, []).resource).toBe('Fishing grounds');
    expect(chainFlowFacts(DEPLETED, []).resourceDepleted).toBe(true);
  });
});
