/**
 * @vitest-environment jsdom
 *
 * economicsTabFlow.test.js — M6d FLOW-DERIVED ECONOMICS, the EconomicsTab thread.
 *
 * The tab reads the owning campaign's worldState from the store (the RumorsTab
 * store-selector pattern) and projects the arrivals tally through the marker-gated
 * selector. Proves:
 *   - DORMANT (no campaign / no tally) ⇒ the tab renders WITHOUT the "Live Trade
 *     Flow" section (byte-identical to today);
 *   - FLOW PRESENT (a campaign carrying a tradeFlow ledger) ⇒ the additive live-flow
 *     section renders BESIDE the generation baseline (which still renders).
 */
import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { useStore } from '../../src/store/index.js';

const e = React.createElement;

const ECO = {
  prosperity: 'modest', economicComplexity: 'a market town', tradeAccess: 'road',
  primaryImports: ['Wrought iron'], primaryExports: ['Timber'],
  tradeDependencies: [{ resource: 'iron', severity: 'critical' }],
  activeChains: [], incomeSources: [],
};
const SETTLEMENT = { id: 'forge_town', name: 'Forge Town', economicState: ECO };

const initialCampaigns = useStore.getState().campaigns;
afterEach(() => {
  cleanup();
  useStore.setState({ campaigns: initialCampaigns });
});

describe('EconomicsTab M6d thread', () => {
  test('DORMANT: no campaign in the store ⇒ no Live Trade Flow section (baseline only)', () => {
    useStore.setState({ campaigns: [] });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).not.toContain('Live Trade Flow');
    // The generation baseline still renders (prosperity header).
    expect(container.textContent).toContain('modest');
  });

  test('FLOW PRESENT: a campaign carrying a tradeFlow tally ⇒ the additive live-flow section renders', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['forge_town'],
        worldState: { tick: 6, spatialLedgers: { tradeFlow: { forge_town: { in: 2, out: 1, lastTick: 6 } } } },
      }],
    });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).toContain('Live Trade Flow');
    // The generation baseline is UNTOUCHED beside it.
    expect(container.textContent).toContain('modest');
  });

  test('a CHOKED trade-dependent town surfaces the shortage reading', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['forge_town'],
        worldState: { tick: 6, spatialLedgers: { tradeFlow: { forge_town: { in: 0.1, out: 0.05, lastTick: 6 } } } },
      }],
    });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).toContain('Trade choked');
  });

  test('does not throw when saveId is absent (falls back to settlement.id, no store campaign)', () => {
    useStore.setState({ campaigns: [] });
    expect(() => render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT }))).not.toThrow();
  });
});

/**
 * ── THE PUBLIC GATE (O2GATE, §885.3) ────────────────────────────────────────────────
 * §885.2/§885.3 rule that the conservative PAID-SURFACE default is `publicDossier ⇒ no
 * state prose`. The economy desk did not implement it: `OutputContainer` computed
 * `publicDossier` and never handed it to the tab, so the anonymous gallery dossier
 * (`PublicDossierView` mounts `OutputContainer` readOnly with NO saveId) drew the corpus
 * sentences for free.
 *
 * TWO mounts carry a `sentence` rung, not one — `economics.prosperityHeader` (DS-ECO-1,
 * drawn in EconomicsGlance) and `economics.foodSecurity` (DS-ECO-9, drawn here) — so the
 * gate is placed at the single DRAW that feeds both, and both are asserted below.
 *
 * Each arm asserts BOTH DIRECTIONS on the SAME settlement, so it cannot pass vacuously:
 * a settlement that simply had nothing to say would fail the non-public half.
 */
const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTER_SRC = join(HERE, '../../src/components/OutputContainer.jsx');

/**
 * A town whose state genuinely DRAWS both sentence mounts. `Comfortable` is on the
 * prosperity ladder (an OFF-ladder spelling ranks -1 and draws nothing, which is why the
 * M6d fixture above — `prosperity: 'modest'` — never caught the leak), and the food
 * balance carries a real DEFICIT so the Food Security section is `defaultOpen` and its
 * mount is actually in the DOM rather than behind a collapsed header.
 */
const SPEAKING = {
  id: 'forge_town', name: 'Forge Town', _seed: 'forge_town', tier: 'town',
  economicState: {
    prosperity: 'Comfortable', economicComplexity: 'a market town', tradeAccess: 'road',
    situationDesc: 'The market square keeps its hours.',
    activeChains: [], incomeSources: [], institutionalServices: [],
    foodSecurity: { label: 'Deficit', stockpile: {} },
  },
  economicViability: {
    metrics: {
      foodBalance: {
        dailyProduction: 600, dailyNeed: 1000, deficit: 400, surplus: 0,
        importCoverage: 0, rawDeficit: 400, agricultureModifier: 1,
      },
    },
  },
};

/** The DS-ECO-1 header sentence and the DS-ECO-9 food-security sentence this town draws. */
const HEADER_SENTENCE = 'There is nothing striking about Forge Town';
const FOOD_SENTENCE = 'Forge Town cannot feed itself';

describe('THE PUBLIC GATE — the economy desk stays silent on a public dossier', () => {
  test('a PUBLIC dossier draws ZERO state-prose sentences, and the SAME town drawn non-public draws BOTH', () => {
    useStore.setState({ campaigns: [] });
    // Direction 1 — the private dossier SPEAKS. Captured BEFORE cleanup: the container's
    // textContent empties when the tree unmounts, so reading it later would make the
    // liveness anchor below assert against an empty string.
    const priv = render(e(EconomicsTab, { settlement: SPEAKING, saveId: 'forge_town', publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    // Direction 2 — the SAME town on a public dossier says NOTHING from the corpus.
    const pub = render(e(EconomicsTab, { settlement: SPEAKING, saveId: null, publicDossier: true }));
    const pubText = pub.container.textContent;
    // Each sentence is proved PRESENT privately and ABSENT publicly in ONE anchored act. A
    // public render that silently produced nothing now reds on the liveness anchor instead
    // of passing a bare exclusion (tests/helpers/anchoredNegatives.js).
    expectPresentThenAbsent(privText, pubText, HEADER_SENTENCE, 'public dossier gate: the DS-ECO-1 header sentence');
    expectPresentThenAbsent(privText, pubText, FOOD_SENTENCE, 'public dossier gate: the DS-ECO-9 food-security sentence');
  });

  test('the gate removes ONLY the corpus sentences — the header prose and every datum tile survive', () => {
    useStore.setState({ campaigns: [] });
    const { container } = render(e(EconomicsTab, { settlement: SPEAKING, saveId: null, publicDossier: true }));
    // The generator's own header prose is a DATUM, not corpus state prose: it stays.
    expect(container.textContent).toContain('The market square keeps its hours.');
    // The glance tiles and their sub-lines are untouched.
    expect(container.textContent).toContain('Comfortable');
    expect(container.textContent).toContain('a market town');
    expect(container.textContent).toContain('Food');
    expect(container.textContent).toContain('lbs/day');
    // And the tab's OWN arithmetic readout below the balance bar is untouched.
    expect(container.textContent).toContain('Production deficit of');
  });

  test('the ROUTER threads the public condition — OutputContainer hands publicDossier to the tab', () => {
    const router = readFileSync(ROUTER_SRC, 'utf8');
    // The condition is still computed where it always was...
    expect(router).toContain('const publicDossier = readOnly && !saveId;');
    // ...and the economics route now actually PASSES it. Without this line the render
    // arms above would pass while the live gallery dossier still leaked.
    const economicsCase = router.split('\n').find((l) => l.includes("case 'economics':"));
    expect(economicsCase).toBeTruthy();
    expect(economicsCase).toContain('publicDossier={publicDossier}');
  });
});
