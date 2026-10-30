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
import { DefenseTab, THREAT_ROW_KEY } from '../../src/components/new/tabs/DefenseTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  defenseMagicDependencyProse, defenseSupportingProse, defenseThreatProse,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { deriveArmedForces, deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { buildThreatAssessment } from '../../src/domain/display/threatAssessment.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';

const e = React.createElement;
const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTER_SRC = join(HERE, '../../src/components/OutputContainer.jsx');

/**
 * The desk's own option bag, spelled exactly as both tabs spell it — `tierNoun` included
 * since §934.22's addendum, because that is the field that decides whether the sentence the
 * desk returns is the sentence the tab renders. A bag here that had fallen behind the tabs'
 * would make every arm below assert against a sentence no surface produces.
 */
const opts = (s) => ({
  seed: String(s?._seed ?? s?.id ?? ''), audience: 'dm', tierNoun: tierNounFor(s?.tier),
});

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
    expect(container.textContent).toContain('Legal Infrastructure');
    // UX consolidation (T2-23): Economic Backing left the rows; Economic Survival owns it.
    expect(container.textContent).not.toContain('Economic Backing'); // anchored: toContain('Legal Infrastructure') on this render
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
  // ⭐ UX CONSOLIDATION 2026-10-30 (RULINGS-T2 T2-15): the dependence block MOVED to the Magic
  // tab as the Roles section's framing. These arms follow it there; the registry row keeps its
  // id. The Outlook page is asserted to carry none of it.
  test('the magic tab renders the EXACT dependency sentence the desk produced; Outlook does not', () => {
    const expected = defenseMagicDependencyProse(port, opts(port)).arcaneReliance.sentence;
    expect(typeof expected, 'the desk drew nothing, so the DOM assertion would be vacuous').toBe('string');
    const { container } = render(e(MagicTab, { settlement: port }));
    expect(container.textContent).toContain(expected);
    // The tab's own envelope is untouched beside it.
    expect(container.querySelectorAll('[data-facet]')).toHaveLength(6);
    cleanup();
    const outlook = render(e(ViabilityTab, { settlement: port, narrativeNote: null })).container.textContent;
    expect(outlook).toContain('Judged at the first survey; not re-run since.');
    expect(outlook).not.toContain(expected); // anchored: the vintage label is asserted on this render
  });

  test('the `magicDependency false` reading DRAWS — it is a finding, not an absence', () => {
    // The tab's own magic-dependency warning box renders only when the flag is TRUE, which
    // is why the corpus line sits outside it. A line that could only appear inside the box
    // would leave a third of an authored block permanently unreachable.
    expect(port.defenseProfile.magicDependency).toBe(false);
    const drawn = defenseMagicDependencyProse(port, opts(port));
    expect(drawn.arcaneReliance.provenance.poolKey).toBe('magicDependency false');
    const { container } = render(e(MagicTab, { settlement: port }));
    const text = container.textContent;
    expect(text).toContain(drawn.arcaneReliance.sentence);
    // The frozen record's static explanation is correctly absent (the flag is false), and the
    // corpus line is present anyway — a finding, not an absence.
    // anchored: the assertion two lines above proves `text` carries the rendered sentence,
    expect(text).not.toContain('relies on active magical infrastructure'); // so the container is live
  });

  test('THE PUBLIC GATE: the magic tab stays silent for an anonymous viewer', () => {
    const expected = defenseMagicDependencyProse(port, opts(port)).arcaneReliance.sentence;
    const priv = render(e(MagicTab, { settlement: port, publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(MagicTab, { settlement: port, publicDossier: true }));
    const pubText = pub.container.textContent;
    expectPresentThenAbsent(privText, pubText, expected, 'public gate: the DS-DEF-9 dependency sentence');
    // Only the corpus sentence goes: the tab's own envelope survives.
    expect(pub.container.querySelectorAll('[data-facet]')).toHaveLength(6);
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

describe('DS-DEF-2 at defense.threatAssessment — each sentence under ITS OWN bar (owner finding 3, 2026-09-18)', () => {
  /**
   * ⛔ THE LABEL JOIN IS PROVED TOTAL IN BOTH DIRECTIONS, and this arm is the reason
   * `THREAT_ROW_KEY` may be a label map at all. `buildThreatAssessment` returns rows carrying
   * no machine key, so the tab pairs sentence to bar by label; a label the map does not know
   * draws nothing, and a map key no row emits is a dead pairing. Either drift would leave a
   * bar silent while every walker in the estate stayed green, so neither side may grow a
   * member the other does not have.
   */
  test('THE JOIN IS TOTAL: the map\'s keys are exactly the labels the builder emits', () => {
    const labels = buildThreatAssessment(port).map((row) => row.label);
    expect(labels.length, 'the builder stopped emitting five rows').toBe(5);
    expect([...labels].sort()).toEqual(Object.keys(THREAT_ROW_KEY).sort());
    // …and every value is a key the desk really answers on, so no row maps to a pool that
    // does not exist. `defenseThreatProse` returns exactly these five keys.
    expect([...Object.values(THREAT_ROW_KEY)].sort())
      .toEqual(Object.keys(defenseThreatProse(port, opts(port))).sort());
  });

  test('each drawn sentence renders INSIDE the card of the bar it is about', () => {
    const drawn = defenseThreatProse(port, opts(port));
    const { container } = render(e(DefenseTab, { settlement: port, narrativeNote: null }));
    let judged = 0;
    for (const { label } of buildThreatAssessment(port)) {
      const sentence = drawn[THREAT_ROW_KEY[label]]?.sentence;
      if (!sentence) continue; // R-DST-K: a row the corpus is silent about shows nothing.
      judged += 1;
      // The card is the element that carries this row's LABEL; the sentence must be inside it.
      const labelSpan = [...container.querySelectorAll('span')]
        .find((el) => el.textContent === label);
      expect(labelSpan, `no bar rendered for ${label}`).toBeTruthy();
      const card = labelSpan.closest('div[style*="border-left"], div[style*="borderLeft"]')
        || labelSpan.parentElement.parentElement;
      expect(card.textContent, `${label}: its sentence is not under its own bar`).toContain(sentence);
    }
    expect(judged, 'no threat row drew a sentence, so this arm judged nothing').toBeGreaterThan(0);
  });

  test('…and NO sentence stack survives above the bars', () => {
    const drawn = defenseThreatProse(port, opts(port));
    const { container } = render(e(DefenseTab, { settlement: port, narrativeNote: null }));
    const caption = [...container.querySelectorAll('div')]
      .find((el) => el.textContent.startsWith('Bars show the settlement'));
    expect(caption, 'the Threat Assessment caption is gone').toBeTruthy();
    // STRUCTURAL: the caption is followed IMMEDIATELY by the bar list. The retired stack was
    // the element in between, so its return moves this sibling and reds here.
    const next = caption.nextElementSibling;
    expect(next, 'nothing follows the Threat Assessment caption').toBeTruthy();
    for (const { label } of buildThreatAssessment(port)) {
      expect(next.textContent, `the caption's next sibling is not the bar list (${label} missing)`)
        .toContain(label);
    }
    // AND BY TEXT ORDER, which is what a reader experiences: every drawn sentence appears
    // AFTER the label of the bar it belongs to, never before the first bar.
    const text = container.textContent;
    let judged = 0;
    for (const { label } of buildThreatAssessment(port)) {
      const sentence = drawn[THREAT_ROW_KEY[label]]?.sentence;
      if (!sentence) continue;
      judged += 1;
      expect(text.indexOf(sentence), `${label}: its sentence does not follow its own bar`)
        .toBeGreaterThan(text.indexOf(label));
    }
    expect(judged, 'no threat row drew a sentence, so the ordering arm judged nothing').toBeGreaterThan(0);
  });

  test('THE PUBLIC GATE still silences all five rows together', () => {
    const drawn = defenseThreatProse(port, opts(port));
    const priv = render(e(DefenseTab, { settlement: port, narrativeNote: null, publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(DefenseTab, { settlement: port, narrativeNote: null, publicDossier: true }));
    const pubText = pub.container.textContent;
    let judged = 0;
    for (const key of Object.values(THREAT_ROW_KEY)) {
      const sentence = drawn[key]?.sentence;
      if (!sentence) continue;
      judged += 1;
      expectPresentThenAbsent(privText, pubText, sentence, `public gate: the DS-DEF-2 ${key} row`);
    }
    expect(judged, 'no threat row drew a sentence, so the gate arm judged nothing').toBeGreaterThan(0);
    // The DATUM survives: every bar, its band word and its label still render for the
    // anonymous viewer — this is a gate on the prose, not a blank.
    for (const { label } of buildThreatAssessment(port)) expect(pubText).toContain(label);
  });
});

/**
 * ⭐ UX CONSOLIDATION 2026-10-30 — THE DEFENSE PAGE SAYS EACH FACT ONCE (RULINGS-T2
 * T2-20..T2-23; RUBRIC R2, R6; RULINGS-CROSS X-8). Every absence is anchored on the same render.
 */
describe('UX consolidation — Defense (T2-20..T2-23)', () => {
  // Opens each fold only when it is shut (a Section's header shows ▼ shut, ▲ open), because the
  // criminal fold opens itself on an elevated town and a blind click would shut it.
  const openIfShut = (container, title) => {
    const button = [...container.querySelectorAll('button')].find((b) => (b.textContent || '').includes(title));
    expect(button, `no collapsible section titled ${title}`).toBeTruthy();
    if (button.textContent.includes('▼')) fireEvent.click(button);
  };
  const dmText = (s) => {
    const { container } = render(e(DefenseTab, { settlement: s, narrativeNote: null }));
    openIfShut(container, 'Criminal Architecture');
    openIfShut(container, 'Supporting Capabilities');
    return container.textContent;
  };

  test('T2-20: the Internal Security bar is the one order score; the order headline and badge are gone', () => {
    const text = dmText(port);
    expect(text).toMatch(/Internal Security(Strong|Adequate|Weak|Critical)/);
    expect(text).not.toMatch(/(Strong|Adequate|Weak) Public Order|Order Failing/); // anchored: the Internal Security band is asserted on this render
    expect(text).toContain(port.economicState.safetyProfile.safetyDesc);
  });

  test('T2-20: the criminal faction is one name-and-band line; the capture lens and its description are not here', () => {
    const crim = port.powerStructure.factions.find((f) => f.category === 'criminal');
    expect(crim, 'fixture premise: a criminal faction').toBeTruthy();
    const text = dmText(port);
    expect(text).toContain(`Criminal faction: ${crim.faction}`);
    if (crim.desc) expect(text).not.toContain(crim.desc); // anchored: the faction line is asserted on this render above
    expect(text).not.toMatch(/Criminal faction: power \d/); // anchored: same render
  });

  test('T2-21: no terrain or strategic-value chips in the posture header', () => {
    const { container } = render(e(DefenseTab, { settlement: port, narrativeNote: null, publicDossier: true }));
    const header = container.firstChild.firstChild;
    expect(header.textContent).toContain('Defensive posture');
    expect(header.textContent).not.toContain(port.resourceAnalysis.terrain); // anchored: the header's own label is asserted above
    expect(header.textContent).not.toContain(port.resourceAnalysis.strategicValue.split(' - ')[0]); // anchored: same header
  });

  test('T2-22/T2-23: "first survey" is said once on the page; Economic Backing and the empty-state line are gone', () => {
    const text = dmText(port);
    expect(text.match(/first survey/gi), 'the vintage label appears once').toHaveLength(1);
    expect(text).toContain('Legal Infrastructure');
    expect(text).not.toContain('Economic Backing'); // anchored: toContain('Legal Infrastructure') on this render
    expect(text).not.toContain('No critical defense vulnerabilities'); // anchored: same render
  });
});

/**
 * ⭐ T2-24 — IN A WORLD WHERE MAGIC DOES NOT FUNCTION, NO PAGE SAYS THE TOWN KEEPS ARCANE
 * PROVISION OR RESTS (OR DOES NOT REST) ON MAGIC. Red-first: on the unfixed tree the
 * Supporting Capabilities row read "Arcane Support: Present" on 84 of the 250 no-magic worlds
 * in ../gen1000v2 (an alchemist matches the arcane-roster regex), and DS-DEF-9 drew a magic
 * reading on 250 of 250 ("There is magic at X and the town does not rest on it"). Both are
 * display-time derivations, so both are cured where they are derived, through the estate's one
 * magic accessor (`magicWorksAt`). The generator is untouched.
 */
describe('T2-24 — magic does not function: no arcane provision, no magic-dependence reading', () => {
  const deadMagicTown = () => {
    for (const seed of ['nomagic-a', 'nomagic-b', 'nomagic-c', 'nomagic-d', 'nomagic-e', 'nomagic-f']) {
      const s = generateSettlementPipeline(
        { settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road', magicExists: false },
        null, { seed, customContent: {} },
      );
      if (s.compound?.inst?.hasMagicInst || s.economicState?.compound?.inst?.hasMagicInst) return s;
    }
    return null;
  };

  test('the Arcane Support row reads None in a dead-magic world, even with an alchemist on the roll', () => {
    const s = deadMagicTown();
    expect(s, 'fixture premise: a dead-magic city whose roster matches the arcane regex').toBeTruthy();
    const cap = deriveSupportingCapabilities(s).find((c) => c.label === 'Arcane Support');
    expect(cap.status).toBe('None');
    expect(cap.score).toBeNull();
    const { container } = render(e(DefenseTab, { settlement: s, narrativeNote: null }));
    openSection(container, 'Supporting Capabilities');
    expect(container.textContent).toContain('Arcane Support');
    expect(container.textContent).not.toContain('Detection, wards, counterspell'); // anchored: toContain('Arcane Support') on this render
  });

  test('DS-DEF-9 is silent in a dead-magic world, and the Magic page draws no dependence block', () => {
    const s = deadMagicTown();
    // The desk itself still builds a rung (its composer is census-stamped); the screen and
    // print callers gate it, so neither surface draws it.
    expect(defenseMagicDependencyProse(s, opts(s)).arcaneReliance?.sentence, 'fixture premise: the desk would speak').toBeTruthy();
    expect(buildPrintProse(s).viability?.['viability.magicDependency'] ?? null, 'print draws no magic reading').toBeFalsy();
    const { container } = render(e(MagicTab, { settlement: s }));
    expect(container.textContent).toMatch(/Magic does not function/);
    expect(container.querySelector('[data-testid="magic-dependence"]')).toBeNull();
  });

  test('STOP-2: no "Arcane defense" force group (screen or print) in a dead-magic world, alchemist or not', () => {
    const s = deadMagicTown();
    expect(s.defenseProfile.institutions.magicDef.length, 'fixture premise: the roster files an alchemist as arcane defense').toBeGreaterThan(0);
    expect(deriveArmedForces(s).arcane, 'the PDF Defense chapter reads this group').toEqual([]);
    const { container } = render(e(DefenseTab, { settlement: s, narrativeNote: null }));
    const toggle = [...container.querySelectorAll('button')].find((b) => /Armed Forces & Fortifications/.test(b.textContent));
    expect(toggle.textContent).toContain('Armed Forces & Fortifications');
    expect(toggle.textContent).not.toMatch(/\d+ arcane/); // anchored: the forces header is on this render
    expect(container.textContent, 'the forces body opens by default').toContain('Standing forces');
    expect(container.textContent).not.toContain('Arcane defense'); // anchored: the open forces body is on this render
  });

  test('a live-magic world still draws DS-DEF-9 (the gate is the dial, not a blanket silence)', () => {
    expect(defenseMagicDependencyProse(port, opts(port)).arcaneReliance?.sentence).toBeTruthy();
  });
});
