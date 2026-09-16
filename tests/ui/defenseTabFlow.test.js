/**
 * @vitest-environment jsdom
 *
 * defenseTabFlow.test.js — DESK-DEF2: the two positions this car lit, proved in the DOM.
 *
 * ⛔ WHY A RENDER TEST AND NOT A WALKER GREEN. The mount registry's reachability arm can
 * only see that a mount id appears as a string literal at exactly ONE site under
 * `src/components`. It cannot tell a real draw from a decorative literal — a bare literal
 * PASSES THE GATE AND LIES. A mount is real only when the rendered DOM carries the corpus
 * sentence, so every arm below asserts the EXACT string the desk produced for that
 * settlement rather than a phrase this file made up.
 *
 * Both fixtures are GENERATED settlements, not hand-shaped bags: a desk that is green on a
 * fixture built from its own expectations and dark on every real world is the bitten case,
 * and DS-DEF-6 in particular reads six producer fields that a hand fixture would get to
 * choose.
 *
 * ⚠ THE SUPPORTING CAPABILITIES SECTION IS `collapsible defaultOpen={false}`, and
 * `Section` renders `{open && children}` — so its contents are NOT in the DOM until the
 * header is clicked. An arm that asserted against the closed tab would report a dark mount
 * for a wiring that works.
 */
import React from 'react';
import { describe, test, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  defenseMagicDependencyProse, defenseSupportingProse,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const e = React.createElement;
const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTER_SRC = join(HERE, '../../src/components/OutputContainer.jsx');

/** The desk's own option bag, spelled exactly as both tabs spell it. */
const opts = (s) => ({ seed: String(s?._seed ?? s?.id ?? ''), audience: 'dm' });

/** Open a collapsed `Section` by its title, so its children reach the DOM. */
function openSection(container, title) {
  const button = [...container.querySelectorAll('button')]
    .find((b) => (b.textContent || '').includes(title));
  expect(button, `no collapsible section titled ${title}`).toBeTruthy();
  fireEvent.click(button);
}

let port;
let inland;

beforeAll(() => {
  // A coastal metropolis: reaches the `Granary + port` logistics branch AND the naval lens.
  port = generateSettlementPipeline(
    { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
    null, { seed: 'seed-B', customContent: {} },
  );
  // An isolated mountain city: a different logistics branch and NO naval row at all, so
  // the two arms below are not one branch asserted twice.
  inland = generateSettlementPipeline(
    { settType: 'city', culture: 'norse', terrain: 'mountain', tradeRouteAccess: 'isolated' },
    null, { seed: 'seed-C', customContent: {} },
  );
});

afterEach(() => { cleanup(); });

describe('DS-DEF-6 at defense.supportingCapabilities — a real draw, not a literal', () => {
  test('the tab renders the EXACT logistics sentence the desk produced for this town', () => {
    const expected = defenseSupportingProse(port, opts(port)).logistics.sentence;
    expect(typeof expected, 'the desk drew nothing, so the DOM assertion would be vacuous').toBe('string');
    const { container } = render(e(DefenseTab, { settlement: port, narrativeNote: null }));
    openSection(container, 'Supporting Capabilities');
    expect(container.textContent).toContain(expected);
    // The producer's own capability rows are UNTOUCHED beside it — the sentence is
    // additive, and a car that had replaced the rows would be caught here.
    const caps = deriveSupportingCapabilities(port);
    expect(container.textContent).toContain(caps.find((c) => c.label === 'Logistics & Supply').note);
    expect(container.textContent).toContain('Economic Backing');
  });

  test('the naval lens draws where there is water, and is SILENT where there is none', () => {
    const navalLine = defenseSupportingProse(port, opts(port)).naval.sentence;
    expect(typeof navalLine).toBe('string');
    const wet = render(e(DefenseTab, { settlement: port, narrativeNote: null }));
    openSection(wet.container, 'Supporting Capabilities');
    const wetText = wet.container.textContent;
    cleanup();
    // The inland city has neither navy nor port: the producer pushes no Naval Defense row
    // and the desk emits no key, so the tab says nothing about the sea.
    expect(defenseSupportingProse(inland, opts(inland)).naval).toBeNull();
    const dry = render(e(DefenseTab, { settlement: inland, narrativeNote: null }));
    openSection(dry.container, 'Supporting Capabilities');
    const dryText = dry.container.textContent;
    // ONE anchored act: present on the coastal town, absent on the inland one. A bare
    // exclusion would pass against a tab that had stopped rendering the block entirely.
    expectPresentThenAbsent(wetText, dryText, navalLine, 'the naval lens on a landlocked city');
    // …and the inland town still draws its OWN logistics sentence, so the absence above is
    // the lens discriminating rather than the whole position having gone dark.
    expect(dryText).toContain(defenseSupportingProse(inland, opts(inland)).logistics.sentence);
  });

  test('THE PUBLIC GATE: the same town on a public dossier draws NEITHER sentence', () => {
    const drawn = defenseSupportingProse(port, opts(port));
    const priv = render(e(DefenseTab, { settlement: port, narrativeNote: null, publicDossier: false }));
    openSection(priv.container, 'Supporting Capabilities');
    // Captured BEFORE cleanup: the container's textContent empties when the tree unmounts.
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(DefenseTab, { settlement: port, narrativeNote: null, publicDossier: true }));
    openSection(pub.container, 'Supporting Capabilities');
    const pubText = pub.container.textContent;
    expectPresentThenAbsent(privText, pubText, drawn.logistics.sentence, 'public gate: the DS-DEF-6 logistics sentence');
    expectPresentThenAbsent(privText, pubText, drawn.naval.sentence, 'public gate: the DS-DEF-6 naval sentence');
    // The gate removes ONLY the corpus prose — the producer's rows and notes still render
    // for the anonymous viewer, which is what makes it a gate and not a blank.
    const caps = deriveSupportingCapabilities(port);
    expect(pubText).toContain(caps.find((c) => c.label === 'Logistics & Supply').note);
    expect(pubText).toContain('Naval Defense');
  });
});

describe('DS-DEF-9 at viability.magicDependency — the registry\'s first cross-tab row', () => {
  test('the viability tab renders the EXACT dependency sentence the desk produced', () => {
    const expected = defenseMagicDependencyProse(port, opts(port)).arcaneReliance.sentence;
    expect(typeof expected, 'the desk drew nothing, so the DOM assertion would be vacuous').toBe('string');
    const { container } = render(e(ViabilityTab, { settlement: port, narrativeNote: null }));
    expect(container.textContent).toContain(expected);
    // The tab's own coherence content is untouched beside it.
    expect(container.textContent).toContain('This tab checks whether your settlement makes logical sense');
  });

  test('the `magicDependency false` reading DRAWS — it is a finding, not an absence', () => {
    // The tab's own magic-dependency warning box renders only when the flag is TRUE, which
    // is why the corpus line sits outside it. A line that could only appear inside the box
    // would leave a third of an authored block permanently unreachable.
    expect(port.defenseProfile.magicDependency).toBe(false);
    const drawn = defenseMagicDependencyProse(port, opts(port));
    expect(drawn.arcaneReliance.provenance.poolKey).toBe('magicDependency false');
    const { container } = render(e(ViabilityTab, { settlement: port, narrativeNote: null }));
    const text = container.textContent;
    expect(text).toContain(drawn.arcaneReliance.sentence);
    // The box itself is correctly absent, and the corpus line is present anyway — which is
    // the whole point of rendering it outside.
    // anchored: the assertion two lines above proves `text` carries the rendered sentence,
    expect(text).not.toContain('Magic Dependency · First Survey'); // so the container is live
  });

  test('THE PUBLIC GATE: the viability tab stays silent for an anonymous viewer', () => {
    const expected = defenseMagicDependencyProse(port, opts(port)).arcaneReliance.sentence;
    const priv = render(e(ViabilityTab, { settlement: port, narrativeNote: null, publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(ViabilityTab, { settlement: port, narrativeNote: null, publicDossier: true }));
    const pubText = pub.container.textContent;
    expectPresentThenAbsent(privText, pubText, expected, 'public gate: the DS-DEF-9 dependency sentence');
    // Only the corpus sentence goes: the tab's own viability readout survives.
    expect(pubText).toContain('This tab checks whether your settlement makes logical sense');
  });

  test('THE ROUTER threads the public condition to a tab that never received it before', () => {
    // This car is what made the omission measurable: `ViabilityTab` was passed only
    // `settlement` and `narrativeNote` until it carried a mount row.
    const router = readFileSync(ROUTER_SRC, 'utf8');
    expect(router).toContain('const publicDossier = readOnly && !saveId;');
    const viabilityCase = router.split('\n').find((l) => l.includes("case 'viability':"));
    expect(viabilityCase, 'the router has no viability route').toBeTruthy();
    expect(viabilityCase).toContain('publicDossier={publicDossier}');
    expect(viabilityCase).toContain('playerView={playerView}');
    // ANCHOR: a route that legitimately takes NEITHER flag proves the reader above is
    // discriminating rather than matching every line of the switch.
    const substrateCase = router.split('\n').find((l) => l.includes("case 'substrate':"));
    expect(substrateCase, 'the anchor route left the router').toBeTruthy();
    // anchored: the viability assertions above prove the same reader finds the flag
    expect(substrateCase).not.toContain('publicDossier={publicDossier}');
  });
});
