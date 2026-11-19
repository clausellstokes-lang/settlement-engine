/** @vitest-environment jsdom */
/**
 * R2-CODE-B-SIDE item 6 — A FORGE TRADITION PRINTS ONLY WHERE A FORGE STANDS (the increment's rww-hamlet-calm-1:
 * "The Long Forge Fair" in a hamlet with no smith; on the census's 720 and the readers' 80 at 0570b3441, 31 forge
 * traditions in towns with no smithy, forge or blacksmith). The first seat's market disqualifier (item 4d) extended:
 * the Forge element declares `institution: smith` (traditionCorpus.js), the vocabulary's own key, read by the tab's
 * filterDeclared through facts/institutions.js :: hasInstitution. Display only: genesis reads no declaration.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';

afterEach(cleanup);

const BASE = { name: 'Holmby', _seed: 'tab-forge-1', tier: 'hamlet', population: 60, config: { culture: 'germanic', terrainType: 'plains', tradeRouteAccess: 'road' } };
const recs = deriveFoundingTraditions(BASE);
const withElement = (rec, element, name) => ({ ...rec, name, coreMotif: { ...rec.coreMotif, element } });
const MIRROR = [withElement(recs[0], 'forge', 'The Long Forge Fair'), withElement(recs[1] || recs[0], 'hearth', 'The Hearth Night')];

describe('the Forge row and the smith', () => {
  it('no smith: the Forge tradition is not printed; the Hearth stands', () => {
    render(<TraditionsTab settlement={{ ...BASE, institutions: [{ name: 'Dwellings (1-8)' }], traditions: MIRROR }} />);
    const text = screen.getByTestId('traditions-tab').textContent;
    expect(text).toMatch(/The Hearth Night/);
    expect(text).not.toMatch(/The Long Forge Fair/); // anchored: The Hearth Night is matched in this same tab text above
  });
  it('the guard: a blacksmith on the roster, and the Forge tradition stands', () => {
    render(<TraditionsTab settlement={{ ...BASE, institutions: [{ name: 'Blacksmith' }], traditions: MIRROR }} />);
    expect(screen.getByTestId('traditions-tab').textContent).toMatch(/The Long Forge Fair/);
  });
});
