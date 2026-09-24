/**
 * @vitest-environment jsdom
 *
 * tests/components/counterIntelSurfacesIn3.test.jsx — FP IN-3's two dossier surfaces.
 *
 * THE WATCH PANEL (`sightPostures`' first UI consumer) and THE HOUSES BLOCK
 * (`projectPatronBindings`' first non-test consumer, with the exposure producer supplying its
 * `exposed` list). Pins: the DM reading sees the truth; every other reading (a non-premium
 * viewer, the player view, a public dossier) renders NOTHING and throws nothing; a world where
 * the counter-game is dark renders nothing; and the Houses block tells the town's knowledge apart
 * from the DM's truth exactly where the producer says a patron stands exposed.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import WatchPanel from '../../src/components/new/tabs/WatchPanel.jsx';
import HousesBlock from '../../src/components/new/tabs/HousesBlock.jsx';
import { exposedPatronInstitutions } from '../../src/domain/worldPulse/patronExposure.js';

afterEach(cleanup);

const posture = (covert) => ({ fidelity01: 0.6, enteredTick: 3, upkeep: 0.5, covert });
const MARKET = Object.freeze({ name: 'Whisper market', tags: ['criminal', 'information', 'brokerage'], serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] });
const FACTIONS = Object.freeze([
  { name: 'The Grey Council', category: 'government', power: 60, isGoverning: true },
  { name: 'Ashwater Syndicate', category: 'criminal', power: 40 },
]);

/** A world around the home `h` and its neighbour `v`: optional receipts, and the key's value. */
function world({ lit = true, scarred = false } = {}) {
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', infoStatecraftEnabled: true, informationBrokeragesEnabled: true, counterIntelEnabled: lit },
    spatialLedgers: {
      sightPostures: { h: { v: posture(false) }, w: { h: posture(true) } },
      secrecyPostures: { h: { level01: 0.4, enteredTick: 2 } },
    },
    relationshipStates: scarred ? { 'e-h-v': { resentment: 0.7, recentIncidents: [{ tick: 3, type: 'spy_exposed' }] } } : {},
  };
  const settlement = {
    id: 'h', name: 'Harrowmere', npcs: [], institutions: [MARKET], powerStructure: { factions: FACTIONS.map((f) => ({ ...f })) },
    ...(scarred ? { activeConditions: [{ archetype: 'corruption_exposed' }] } : {}),
  };
  return { worldState, settlement, regionalGraph: { edges: [{ id: 'e-h-v', from: 'h', to: 'v' }] } };
}
const names = { h: 'Harrowmere', v: 'Velden', w: 'Westmark' };
const nameFor = (id) => names[id] || id;

describe('IN-3 — the Watch panel: DM truth, fail-closed', () => {
  test('the DM reading sees whom the town watches, who watches it, its suspicion band and its gates', () => {
    const { getByTestId, getAllByTestId } = render(<WatchPanel {...world({ scarred: true })} nameFor={nameFor} viewerIsPremium />);
    const rows = getAllByTestId('watch-row').map((row) => row.textContent);
    expect(rows).toEqual(['Velden (open watch)', 'Westmark (covert eyes)']);
    expect(getByTestId('watch-suspicion').textContent).toBe('The court\'s suspicion reads decisive; its gates stand closed.');
  });

  test('FAIL-CLOSED: a non-premium viewer, the player view, a public dossier and a dark world render nothing and throw nothing', () => {
    for (const props of [
      { ...world(), viewerIsPremium: false },
      { ...world(), viewerIsPremium: true, playerView: true },
      { ...world(), viewerIsPremium: true, publicDossier: true },
      { ...world({ lit: false }), viewerIsPremium: true },
      { viewerIsPremium: true },
    ]) {
      const { container } = render(<WatchPanel {...props} nameFor={nameFor} />);
      expect(container.innerHTML).toBe('');
      cleanup();
    }
  });
});

describe('IN-3 — the Houses block: the truth beside what the town knows', () => {
  test('a covert patron reads not known until the exposure producer turns it up, and named once it has', () => {
    const quiet = render(<HousesBlock {...world()} viewerIsPremium />);
    expect(quiet.getAllByTestId('house-row')).toHaveLength(1);
    expect(quiet.getByTestId('houses-block').textContent).toContain('Serves Ashwater Syndicate.');
    expect(quiet.getByTestId('house-known').textContent).toBe('The town does not know whom it serves.');
    cleanup();
    // The scarred town's suspicion reads decisive, and the market's keyed reading falls under the
    // band's odds: the producer names it, and only then does the block say the town knows.
    const hot = world({ scarred: true });
    const exposed = exposedPatronInstitutions({ worldState: hot.worldState, snapshot: { byId: new Map([['h', { id: 'h', settlement: hot.settlement }]]), regionalGraph: hot.regionalGraph }, item: { id: 'h', settlement: hot.settlement } });
    expect(exposed).toEqual(['whisper_market']);
    const loud = render(<HousesBlock {...hot} viewerIsPremium />);
    expect(loud.getByTestId('house-known').textContent).toBe('The town now knows it serves Ashwater Syndicate.');
  });

  test('FAIL-CLOSED: every reading but the DM\'s, and a dark world, renders nothing and throws nothing', () => {
    for (const props of [
      { ...world(), viewerIsPremium: false },
      { ...world(), viewerIsPremium: true, playerView: true },
      { ...world(), viewerIsPremium: true, publicDossier: true },
      { ...world({ lit: false }), viewerIsPremium: true },
      { viewerIsPremium: true },
    ]) {
      const { container } = render(<HousesBlock {...props} />);
      expect(container.innerHTML).toBe('');
      cleanup();
    }
  });
});
