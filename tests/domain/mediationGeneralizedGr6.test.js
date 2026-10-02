/**
 * tests/domain/mediationGeneralizedGr6.test.js — GR-6: MEDIATION GENERALIZED, the wave's
 * acceptance file (the FP kit's BUILD-FP-B2-gr6 brief; the compiled block #14;
 * docs/DESIGN_FP_ARCH_GR.md §5 GR-6; R-25).
 *
 * THE FOUR-FENCE DORMANCY SET for `mediationGeneralizedEnabled`, plus the lit-mutant control
 * that proves the fences can see (§3's flag law; TR-2's acceptance file is the precedent):
 *   FENCE 1 — OWN FOOTPRINT: dark, the treaty stage hands back its input world BY REFERENCE and
 *     the opener opens the ordered war, over a fixture the lit layer holds back and receipts.
 *   FENCE 2 — ABSENT vs EXPLICIT FALSE: the opener's and the treaty stage's outputs hash alike.
 *   FENCE 3 — CALL PATH: a pass-through spy on the ONE finder counts zero dark, more than zero lit.
 *   FENCE 4 — GATE POLARITY over the real tree: the one code read of the key is `=== true`, and
 *     every truthy non-true value reads dark.
 * Then the acceptance rows by title: ×1 byte identity in three arms, the TTL window, NEVER
 * FORCES, the single-finder scan, the reused trust writer, the direction through the resolver,
 * the predicate with its subjects, the receipt kind's five joins, the fraying read's
 * `worstObservedEver ?? 'honored'`, the phantom-partner pin, and the temple arm's measured
 * contradiction (the one occasion this wave leaves for a ruling).
 *
 * The leaf is read through a dynamic import AFTER the finder is wrapped, so the red-first
 * plant of the pre-change sources reds each arm by title.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';

/** FENCE 3's recorder. Hoisted, because vi.mock factories hoist above the imports. */
const calls = vi.hoisted(() => ({ finder: 0 }));

vi.mock('../../src/domain/worldPulse/peaceTermsGraph.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // STRICT pass-through: the one finder's own answer, counted.
    findCrossPressuredMediator: (...args) => {
      calls.finder += 1;
      return actual.findCrossPressuredMediator(...args);
    },
  };
});

const leaf = await import('../../src/domain/worldPulse/mediationPressure.js');
const { evaluateWarLayer } = await import('../../src/domain/worldPulse/warDeployment.js');
const { advanceTreaties } = await import('../../src/domain/worldPulse/peaceTerms.js');
const { stampWarIntent, WAR_INTENT_TTL_TICKS } = await import('../../src/domain/worldPulse/warIntent.js');
const { buildWorldSnapshot } = await import('../../src/domain/worldPulse/worldSnapshot.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { createPRNG } = await import('../../src/kernel/prng.js');
const { resolveDecree, stage } = await import('../../src/domain/edit/registry.js');
const { DECREE_CAUSE } = await import('../../src/domain/worldPulse/decreeHook.js');
const { reasonPairKey } = await import('../../src/domain/worldPulse/warReasonTaxonomy.js');
const { accrueStrainResentment } = await import('../../src/domain/worldPulse/peaceTermsOverlay.js');
const { crossPressureMediation, faithAlignmentQuadrant } = await import('../../src/domain/spatial/cohesionWeave.js');
const { GRAMMAR_KIND_REGISTRY, grammarReceipt } = await import('../../src/domain/worldPulse/grammarNews.js');
const { GRAMMAR_RECEIPTS } = await import('../../src/domain/worldPulse/grammarReceiptPools.js');
const { WHAT_PHRASES } = await import('../../src/domain/display/settlementRumors.js');
const { EXACT_SECTION, KIND_SECTION_DIVERGENCES } = await import('../../src/domain/realm/heraldRouting.js');
const { KIND_SECTION } = await import('../../src/domain/display/chroniclersLetter.js');
const { PHANTOM_KIND } = await import('../../src/domain/edit/phantoms.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NOW = '2026-09-24T00:00:00.000Z';
const STAMPED = 10;
const KEY = 'mediationGeneralizedEnabled';
const BASE_RULES = Object.freeze({ warLayerEnabled: true, settlementStrategyEnabled: true, peaceEngineEnabled: true });
const LIT = Object.freeze({ ...BASE_RULES, mediationGeneralizedEnabled: true });
/** Every dark spelling: absent, explicit false, and three truthy values that are not `true`. */
const DARK_RULES = Object.freeze([
  BASE_RULES, { ...BASE_RULES, [KEY]: false }, { ...BASE_RULES, [KEY]: 1 },
  { ...BASE_RULES, [KEY]: 'true' }, { ...BASE_RULES, [KEY]: {} },
]);
const MOBILIZED = Object.freeze({ state: 'mobilized', progress: 1, sinceTick: 0 });

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const deity = (ref, align = 'good') => ({ _deityRef: ref, name: ref, alignmentAxis: align, lawAxis: 'neutral', rankAxis: 'major' });
/** warIntentJoin's HAMLET profile, whose measured strength sits well below a city's. */
const HAMLET_FACTIONS = Object.freeze([
  { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
  { faction: 'Hedge Wardens', category: 'military', power: 22 },
]);

/** A court on the MEASURED strength ladder of tests/domain/warIntentJoin.test.js, with a patron. */
function court(id, name, { tier = 'town', population = 1800, patron, align = 'good', mil = 70, legitimacy = 70, factions = null } = {}) {
  return {
    id, name, phase: 'canon',
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
    settlement: {
      name, tier, population,
      config: { tradeRouteAccess: 'road', priorityEconomy: 15, priorityMilitary: mil, primaryDeitySnapshot: deity(patron, align) },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: legitimacy, label: 'Stable' },
        factions: factions || [{ faction: 'War Council', category: 'military', power: 90, isGoverning: true }],
        conflicts: [],
      },
      npcs: [{ id: `reeve_${id}`, name: `Reeve ${name}`, importance: 'key' }],
      activeConditions: [],
    },
  };
}

/**
 * THE FIXTURE: Ironhold (a city) holds a hostile edge to `target`; Crossford shares Ironhold's
 * patron (a faith-brother) and the target's good alignment under another patron (an
 * alignment-kin), with a trade edge to each — the cross-cut that makes it the one finder's
 * broker. `broker: false` leaves Crossford off the graph; `targetAlign: 'evil'` makes it an
 * INTERESTED neighbour instead — a faith-brother of Ironhold and a natural enemy of the target.
 */
function world({ rules = LIT, target = 'mid', intent = true, tick = STAMPED + 1, broker = true, targetAlign = 'good', stampedAt = STAMPED, extra = {} } = {}) {
  const courts = [
    court('strong', 'Ironhold', { tier: 'city', population: 45000, patron: 'Dawn' }),
    target === 'mid'
      ? court('mid', 'Midvale', { tier: 'town', population: 9000, patron: 'Dusk', align: targetAlign })
      : court('thin', 'Thinwater', { tier: 'village', population: 280, patron: 'Dusk', mil: 20, legitimacy: 24, factions: HAMLET_FACTIONS }),
    court('crossford', 'Crossford', { tier: 'town', population: 2200, patron: 'Dawn' }),
  ];
  const edges = [
    { id: `edge.strong.${target}`, from: 'strong', to: target, relationshipType: 'hostile' },
    ...(broker ? [
      { id: 'edge.crossford.strong', from: 'crossford', to: 'strong', relationshipType: 'trade_partner' },
      { id: `edge.crossford.${target}`, from: 'crossford', to: target, relationshipType: 'trade_partner' },
    ] : []),
  ];
  const relationshipStates = Object.fromEntries(edges.map((e) => [e.id, {
    relationshipType: e.relationshipType, trust: e.relationshipType === 'hostile' ? 0 : 0.3,
  }]));
  let worldState = {
    rngSeed: 'gr6-seed', tick, relationshipStates, simulationRules: { ...rules },
    warPosture: { strong: MOBILIZED }, calendar: { season: 'autumn' }, ...extra,
  };
  if (intent) worldState = stampWarIntent(worldState, 'strong', target, stampedAt);
  const campaign = {
    id: 'gr6', name: 'GR6', settlementIds: courts.map((c) => c.id), worldState,
    regionalGraph: ensureRegionalGraph({ edges, channels: [] }), wizardNews: { currentTick: tick, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves: courts, worldState });
  return { worldState, snapshot, campaign, courts, graph: campaign.regionalGraph, tick };
}

const openWars = (fx) => evaluateWarLayer({
  snapshot: fx.snapshot, worldState: fx.worldState, rng: createPRNG('gr6-war'), tick: fx.tick, now: NOW,
  rules: { warLayerEnabled: true, settlementStrategyEnabled: true },
});
const frontsOf = (war) => war.graphChannels.filter((c) => c.type === 'war_front').map((c) => `${c.from}->${c.to}`).sort();
const treatyStage = (fx) => advanceTreaties({
  snapshot: fx.snapshot, worldState: fx.worldState, settlementUpdates: [], graph: fx.graph, pIndex: null, tick: fx.tick, now: NOW,
});
const trustOf = (ws, key) => Number(ws.relationshipStates?.[key]?.trust) || 0;

describe('GR-6 — the four dormancy fences and the lit-mutant control', () => {
  test('fence 1 — dark, the treaty stage returns its input world by reference and the opener marches as before', () => {
    for (const rules of DARK_RULES) {
      const fx = world({ rules, tick: STAMPED + WAR_INTENT_TTL_TICKS });
      const out = treatyStage(fx);
      expect(out.worldState).toBe(fx.worldState);
      expect(out.newsEntries).toEqual([]);
      expect(frontsOf(openWars(world({ rules }))), 'dark, the order waives the soft gate as it always did').toEqual(['strong->mid']);
    }
  });

  test('THE LIT-MUTANT CONTROL — the same fixture lit holds the war back and tells it, so the fences can see', () => {
    expect(frontsOf(openWars(world()))).toEqual([]);
    const fx = world({ tick: STAMPED + WAR_INTENT_TTL_TICKS });
    const out = treatyStage(fx);
    expect(out.newsEntries.map((n) => n.kind)).toEqual(['brokered_back']);
    expect(out.worldState).not.toBe(fx.worldState);
  });

  test('fence 2 — absent and explicit false hash alike at the opener and at the treaty stage', () => {
    const absent = [openWars(world({ rules: DARK_RULES[0] })), treatyStage(world({ rules: DARK_RULES[0], tick: 12 }))];
    const explicit = [openWars(world({ rules: DARK_RULES[1] })), treatyStage(world({ rules: DARK_RULES[1], tick: 12 }))];
    expect(hash(explicit[0])).toBe(hash(absent[0]));
    expect(hash(explicit[1].newsEntries)).toBe(hash(absent[1].newsEntries));
    expect(hash(explicit[1].worldState.relationshipStates)).toBe(hash(absent[1].worldState.relationshipStates));
  });

  test('fence 3 — the call path: dark, the one finder is never reached from the leaf', () => {
    calls.finder = 0;
    for (const rules of DARK_RULES) {
      openWars(world({ rules }));
      treatyStage(world({ rules, tick: STAMPED + WAR_INTENT_TTL_TICKS }));
      leaf.mediatedStrainAccrual(frayArgs({ rules }));
    }
    expect(calls.finder).toBe(0);
    openWars(world());
    expect(calls.finder).toBeGreaterThan(0);
  });

  test('fence 4 — the gate polarity census: the one code read of the key is the strict === true form', () => {
    // ⭐ A PRESET DECLARATION IS NOT A READ (LIT-2, 2026-09-24; J-EM-16, the lit law, signed as ODQ
    // §934.84; LIT-1a's oath fence and LIT-1b's SP-B fence are the precedents). The lighting unit
    // declares the key in the preset table's FP_LIT_WARPEACE fragment, and the one lawful spelling
    // there is a strict `true` (dark is ABSENT, never a declared false), so exactly that shape in
    // exactly that file is set aside, counted neither as a read nor as loose. Every other site must
    // still be the strict read, the reads roster below still names the one real gate, and the
    // declaration is counted, so the fragment stays its one home.
    const PRESET_TABLE = 'src/domain/worldPulse/simulationRules.js';
    /** @param {string} rel @param {string} line */
    const isLitDeclaration = (rel, line) => rel === PRESET_TABLE
      && /^mediationGeneralizedEnabled\s*:\s*true\s*,?$/.test(line.trim());
    // GUARD THE GUARD: a declared false, a truthy read and the same line in another file are all
    // still convicted, so the exemption cannot widen into a pass for a loose read.
    expect(isLitDeclaration(PRESET_TABLE, '  mediationGeneralizedEnabled: true,')).toBe(true);
    expect(isLitDeclaration(PRESET_TABLE, '  mediationGeneralizedEnabled: false,')).toBe(false);
    expect(isLitDeclaration(PRESET_TABLE, '  if (rules.mediationGeneralizedEnabled) {')).toBe(false);
    expect(isLitDeclaration('src/domain/x.js', '  mediationGeneralizedEnabled: true,')).toBe(false);
    const reads = [];
    const loose = [];
    const declarations = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const code = codeOnly(readFileSync(abs, 'utf8'));
      for (const match of code.matchAll(/\bmediationGeneralizedEnabled\b/g)) {
        const lineStart = code.lastIndexOf('\n', match.index) + 1;
        const lineEnd = code.indexOf('\n', match.index);
        if (isLitDeclaration(rel, code.slice(lineStart, lineEnd < 0 ? code.length : lineEnd))) {
          declarations.push(rel);
          continue;
        }
        const tail = code.slice(match.index + match[0].length, match.index + match[0].length + 12);
        (/^\s*===\s*true/.test(tail) ? reads : loose).push(rel);
      }
    }
    expect(loose, 'a read of the key that is not the strict === true form').toEqual([]);
    expect(reads).toEqual(['src/domain/worldPulse/mediationPressure.js']);
    expect(declarations, 'the preset table declares the key once, in its fragment').toEqual([PRESET_TABLE]);
    for (const rules of DARK_RULES) expect(leaf.mediationGeneralizedActive({ simulationRules: rules })).toBe(false);
    expect(leaf.mediationGeneralizedActive({ simulationRules: LIT })).toBe(true);
    // The conjunction: a lit key over a dark peace engine stays dark.
    expect(leaf.mediationGeneralizedActive({ simulationRules: { ...LIT, peaceEngineEnabled: false } })).toBe(false);
  });
});

describe('GR-6 — occasion 1: the pressure, the window and the receipt', () => {
  test('×1 byte identity when dark, with no broker, and with no order — three arms, hashed', () => {
    const intent = { targetId: 'mid', tick: STAMPED };
    const darkHash = hash(openWars(world({ rules: DARK_RULES[0] })));
    // Arm 1 — dark: the multiplier is 1 exactly and the opener's whole output hashes as the base.
    expect(leaf.mediationPressureFor(world({ rules: DARK_RULES[0] }).worldState, null, null, 'strong', 'mid', intent)).toBe(1);
    // Arm 2 — no broker: lit, with Crossford off the graph, the opener hashes as the dark world does.
    const bare = world({ broker: false });
    expect(leaf.mediationPressureFor(bare.worldState, bare.snapshot, bare.graph, 'strong', 'mid', intent)).toBe(1);
    expect(hash(openWars(bare))).toBe(hash(openWars(world({ rules: DARK_RULES[0], broker: false }))));
    // …and the INTERESTED neighbour, whose ties run to one side only, is no broker either.
    const kin = world({ targetAlign: 'evil' });
    expect(leaf.mediationPressureFor(kin.worldState, kin.snapshot, kin.graph, 'strong', 'mid', intent)).toBe(1);
    expect(hash(openWars(kin))).toBe(hash(openWars(world({ rules: DARK_RULES[0], targetAlign: 'evil' }))));
    // Arm 3 — no order: lit, broker standing, no march order, the opener hashes as dark.
    const unordered = world({ intent: false });
    expect(leaf.mediationPressureFor(unordered.worldState, unordered.snapshot, unordered.graph, 'strong', 'mid', null)).toBe(1);
    expect(hash(openWars(unordered))).toBe(hash(openWars(world({ rules: DARK_RULES[0], intent: false }))));
    // The control: the SAME lit fixture with its order and its broker is below one and moves the hash.
    const pressed = world();
    expect(leaf.mediationPressureFor(pressed.worldState, pressed.snapshot, pressed.graph, 'strong', 'mid', intent))
      .toBe(1 - leaf.MEDIATION_TUNING.intentPressureW);
    expect(hash(openWars(pressed))).not.toBe(darkHash);
  });

  test('the TTL is declared and honoured: an order that reaches the end of its window unopened mints the receipt', () => {
    expect(WAR_INTENT_TTL_TICKS).toBe(2);
    const source = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/mediationPressure.js'), 'utf8'));
    expect(source).toMatch(/WAR_INTENT_TTL_TICKS/);
    // Age one: the window is still open, so nothing is told.
    expect(treatyStage(world({ tick: STAMPED + 1 })).newsEntries).toEqual([]);
    // Age two, still standing: the order can no longer open, and the broker is named.
    const fx = world({ tick: STAMPED + WAR_INTENT_TTL_TICKS });
    const out = treatyStage(fx);
    expect(out.newsEntries).toHaveLength(1);
    const [beat] = out.newsEntries;
    expect({ kind: beat.kind, impactKind: beat.impactKind, parties: beat.parties, section: beat.section, settlementIds: beat.settlementIds })
      .toEqual({ kind: 'brokered_back', impactKind: 'brokered_back', parties: ['strong', 'mid'], section: 'trade', settlementIds: ['crossford', 'strong', 'mid'] });
    // The broker is the address chain's head and is NAMED in the headline's reason.
    expect(beat.reasons[0]).toMatch(/^Crossford stood between the two courts/);
    expect(beat.id).toBe(`wizard_news.${STAMPED + 2}.brokered_back.crossford.strong.mid`);
    // BOTH EDGES: the broker earns trust at both tables (the war-exit invariant, reused).
    for (const key of ['edge.crossford.strong', 'edge.crossford.mid']) {
      expect(trustOf(out.worldState, key), key).toBeGreaterThan(trustOf(fx.worldState, key));
    }
    // An order RENEWED this tick is a new deliberation: nothing is told.
    expect(treatyStage(world({ tick: STAMPED + 2, stampedAt: STAMPED + 2 })).newsEntries).toEqual([]);
    // An army already marching on the target is a war that is happening, not one that did not.
    const marching = world({ tick: STAMPED + 2, extra: { deployments: { strong: { targetId: 'mid' } } } });
    expect(treatyStage(marching).newsEntries).toEqual([]);
  });

  test('NEVER FORCES: a mediated pair with no order never opens a war, and a pressured order can still open', () => {
    // No order: the broker standing between them opens nothing and tells nothing.
    const unordered = world({ intent: false, tick: STAMPED + 2 });
    expect(frontsOf(openWars(unordered))).toEqual([]);
    const told = treatyStage(unordered);
    expect([told.newsEntries, told.worldState === unordered.worldState]).toEqual([[], true]);
    // A pressured order held back where the margin is thin (a city on a large town)…
    expect(frontsOf(openWars(world()))).toEqual([]);
    // …still MARCHES where its court is strong enough (a city on a hamlet): the multiplier scales.
    expect(frontsOf(openWars(world({ target: 'thin' })))).toEqual(['strong->thin']);
    const pressed = world({ target: 'thin' });
    expect(leaf.mediationPressureFor(pressed.worldState, pressed.snapshot, pressed.graph, 'strong', 'thin', { targetId: 'thin', tick: STAMPED }))
      .toBeLessThan(1);
    // The direction's one field picks WHICH pair is pressed and can name no outcome.
    const decl = leaf.MEDIATION_DIRECTION_OP_TYPES[leaf.GOOD_OFFICES_OP_TYPE];
    expect(Object.keys(decl.payload)).toEqual(['pair']);
    expect(decl.payload.pair).toEqual({ kind: 'pool', pool: leaf.MEDIATION_PAIR_POOL, required: true });
  });
});

describe('GR-6 — the one finder, the reused trust, and the editor rows', () => {
  test('the single-finder scan: no second mediation finder anywhere in src', () => {
    const callers = [];
    const definers = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, abs).replace(/\\/g, '/');
      const code = codeOnly(readFileSync(abs, 'utf8'));
      if (/\bcrossPressureMediation\s*\(/.test(code) && !/export function crossPressureMediation/.test(code)) callers.push(rel);
      if (/function\s+\w*Mediator\w*\s*\(/.test(code)) definers.push(rel);
    }
    expect(callers).toEqual(['src/domain/worldPulse/peaceTermsGraph.js']);
    expect(definers).toEqual(['src/domain/worldPulse/peaceTermsGraph.js']);
    const source = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/mediationPressure.js'), 'utf8'));
    expect(source.match(/findCrossPressuredMediator\(/g)?.length).toBeGreaterThanOrEqual(3);
    // anchored: the leaf is pinned calling the finder three times above, so its source is really read here.
    expect(source).not.toMatch(/cohesionWeave|faithAlignmentQuadrant|faithProximityOf/);
  });

  test('accrueMediationTrust is called, never re-spelled', () => {
    const raw = readFileSync(join(ROOT, 'src/domain/worldPulse/mediationPressure.js'), 'utf8');
    const source = codeOnly(raw);
    expect(raw).toMatch(/import \{ accrueMediationTrust, accrueStrainResentment \} from '\.\/peaceTermsOverlay\.js';/);
    expect(source.match(/accrueMediationTrust\(/g)?.length).toBe(2);
    // anchored: the two live calls are counted above, so the absence below is of a SECOND writer.
    expect(source).not.toMatch(/applyRelationshipPatch|MEDIATION_TRUST_W|relationshipStates\s*[[.]/);
  });

  test('the direction resolves through resolveDecree, and refuses a pair with no live order', () => {
    const fx = world({ tick: STAMPED + 1 });
    const decl = leaf.MEDIATION_DIRECTION_OP_TYPES[leaf.GOOD_OFFICES_OP_TYPE];
    expect({ type: leaf.GOOD_OFFICES_OP_TYPE, target: decl.target, stage: decl.stage, world: decl.requires.world })
      .toEqual({ type: 'offer-good-offices', target: 'settlement', stage: 'home', world: ['warIntentLive'] });
    const live = leaf.mediationLivePairs(fx.worldState, fx.snapshot, fx.graph);
    expect(live).toEqual([reasonPairKey('strong', 'mid')]);
    const resolve = (pair, pools) => resolveDecree(stage([], {
      type: leaf.GOOD_OFFICES_OP_TYPE, target: { kind: 'settlement', id: 'crossford' }, payload: { pair },
    }, { id: `d-${pair}`, orderedAt: NOW })[0], { opTypes: leaf.MEDIATION_DIRECTION_OP_TYPES, pools });
    expect(resolve('strong>mid', { [leaf.MEDIATION_PAIR_POOL]: live })).toEqual({ ok: true });
    expect(resolve('mid>strong', { [leaf.MEDIATION_PAIR_POOL]: live })).toEqual({ ok: false, missing: 'pool-value', was: 'mid>strong' });
    const dark = world({ rules: DARK_RULES[0], tick: STAMPED + 1 });
    const darkPool = leaf.mediationLivePairs(dark.worldState, dark.snapshot, dark.graph);
    expect(resolve('strong>mid', { [leaf.MEDIATION_PAIR_POOL]: darkPool })).toEqual({ ok: false, missing: 'pool-value', was: 'strong>mid' });
  });

  test('warIntentLive holds with its subjects on the broker, and fails elsewhere and dark', () => {
    const row = leaf.MEDIATION_WORLD_CONDITIONS[leaf.WAR_INTENT_LIVE];
    const campaignOf = (fx) => ({ worldState: fx.worldState, regionalGraph: fx.graph, settlements: fx.courts });
    const lit = campaignOf(world({ tick: STAMPED + 1 }));
    expect([row.predicate({ id: 'crossford' }, lit), row.subjects({ id: 'crossford' }, lit)]).toEqual([true, ['mid', 'strong']]);
    expect([row.predicate({ id: 'strong' }, lit), row.subjects({ id: 'strong' }, lit)]).toEqual([false, []]);
    const dark = campaignOf(world({ rules: DARK_RULES[0], tick: STAMPED + 1 }));
    expect([row.predicate({ id: 'crossford' }, dark), row.subjects({ id: 'crossford' }, dark)]).toEqual([false, []]);
    const expired = campaignOf(world({ tick: STAMPED + WAR_INTENT_TTL_TICKS + 1 }));
    expect(row.predicate({ id: 'crossford' }, expired)).toBe(false);
    expect([row.source, row.readers.map((r) => r.symbol)]).toEqual(['live', ['warIntentFor']]);
  });

  test('a phantom is never a broker or a party: excluded by construction, and a phantom row reads without throwing', () => {
    const fx = world({ tick: STAMPED + 1 });
    const phantom = { id: 'ph', name: 'Nowhere', settlement: { id: 'ph', kind: PHANTOM_KIND, name: 'Nowhere', seed: 's', traits: {} } };
    const members = new Set(fx.campaign.settlementIds);
    const settlements = [...fx.courts, phantom].filter((row) => members.has(row.id));
    expect(settlements.map((row) => row.id), 'the campaign court list is phantom-free by symbol').toEqual(['strong', 'mid', 'crossford']);
    const campaign = { worldState: fx.worldState, regionalGraph: fx.graph, settlements };
    // anchored: the broker's subjects are pinned to the two real courts in the arm above.
    expect(leaf.MEDIATION_WORLD_CONDITIONS.warIntentLive.subjects({ id: 'crossford' }, campaign)).not.toContain('ph');
    const stray = { ...world({ tick: STAMPED + 2 }) };
    stray.worldState = stampWarIntent(stray.worldState, 'ph', 'mid', STAMPED);
    expect(() => treatyStage(stray)).not.toThrow();
    expect(treatyStage(stray).newsEntries.map((n) => n.parties)).toEqual([['strong', 'mid']]);
  });
});

describe('GR-6 — the receipt kind and the fraying pact', () => {
  test('the receipt kind\'s five joins, the party order, and the cause row', () => {
    const row = GRAMMAR_KIND_REGISTRY.find((r) => r.kind === 'brokered_back');
    expect(row && { significance: row.significance, audience: row.audience, section: row.section, depth: row.pool.length })
      .toEqual({ significance: 'major', audience: 'public', section: 'trade', depth: 4 });
    expect(GRAMMAR_RECEIPTS.brokered_back).toHaveLength(4);
    expect(WHAT_PHRASES.brokered_back).toBe('a war talked down before the first march');
    expect([EXACT_SECTION.brokered_back, KIND_SECTION.brokered_back, KIND_SECTION_DIVERGENCES.brokered_back]).toEqual(['trade', 'courts', 'trade']);
    expect(readFileSync(join(ROOT, 'src/domain/worldPulse/mediationPressure.js'), 'utf8')).toMatch(/impactKind: 'brokered_back'/);
    // The two {counterpart} fills bind IN ORDER: the would-be besieger, then the court it meant to march on.
    const interp = { settlement: 'Crossford', counterpart: 'Ironhold', counterpartSecond: 'Midvale' };
    const seeds = Array.from({ length: 400 }, (_, i) => `s${i}`);
    const third = seeds.map((seed) => grammarReceipt('brokered_back', seed, interp, 'musters_stood_down'))
      .find((line) => line?.familyId === 'brokered_back.3');
    expect(third?.line).toBe('Ironhold and Midvale stood their musters down in the same week, and the carters got their roads back.');
    // …and the BUILDER binds them that way too: driven under the one context family 3 is honest
    // in, some tick of the same receipt draws it, and it names the besieger first.
    const built = Array.from({ length: 200 }, (_, i) => leaf.brokeredBackBeat({
      tick: i, brokerId: 'crossford', brokerName: 'Crossford', besiegerId: 'strong', besiegerName: 'Ironhold',
      targetId: 'mid', targetName: 'Midvale', season: 'musters_stood_down',
    })).find((beat) => beat?.familyId === 'brokered_back.3');
    expect(built?.summary).toBe(third?.line);
    // Headline honesty: outside spring the seasonal family is never drawn.
    const autumn = new Set(seeds.map((seed) => grammarReceipt('brokered_back', seed, interp, 'autumn')?.familyId));
    expect([...autumn]).toEqual(['brokered_back.4']);
    // The cause row: absent on the engine's own brokerage, carried verbatim when a decree caused it.
    const args = { tick: 12, brokerId: 'crossford', brokerName: 'Crossford', besiegerId: 'strong', besiegerName: 'Ironhold', targetId: 'mid', targetName: 'Midvale' };
    // anchored: the same builder carries the cause on the next line, so the key's absence here is the default's.
    expect(leaf.brokeredBackBeat(args)).not.toHaveProperty('cause');
    expect(leaf.brokeredBackBeat({ ...args, cause: DECREE_CAUSE })?.cause).toBe('table');
  });

  test('the fraying read honours worstObservedEver ?? \'honored\': a slipped record softens less, dark softens nothing', () => {
    const resentment = (ws) => Number(ws.relationshipStates?.['edge.mid.strong']?.resentment) || 0;
    const base = frayArgs({ rules: DARK_RULES[0] });
    const darkOut = leaf.mediatedStrainAccrual(base);
    // Dark is the writer itself, byte for byte.
    expect(hash(darkOut)).toBe(hash(accrueStrainResentment(base.worldState, base.edges, base.loserId, base.victorId, base.burden01, base.now, base.treaty)));
    const clean = leaf.mediatedStrainAccrual(frayArgs({ previous: { complianceState: 'honored' } }));
    const slipped = leaf.mediatedStrainAccrual(frayArgs({ previous: { complianceState: 'strained', worstObservedEver: 'strained' } }));
    const before = resentment(base.worldState);
    const [full, slippedDelta, cleanDelta] = [resentment(darkOut) - before, resentment(slipped) - before, resentment(clean) - before];
    expect(cleanDelta).toBeCloseTo(full * (1 - leaf.MEDIATION_TUNING.fraySoften), 10);
    expect(slippedDelta).toBeCloseTo(full * (1 - leaf.MEDIATION_TUNING.fraySoftenSlipped), 10);
    expect(full > slippedDelta && slippedDelta > cleanDelta && cleanDelta > 0).toBe(true);
    // A record with NO memory at all reads 'honored' (treatyRenewalEnabled never lit): the full notch,
    // and no first-fray trust, because there is no earlier tick on record to fray from.
    const unrecorded = leaf.mediatedStrainAccrual(frayArgs({ previous: null }));
    expect([resentment(unrecorded), trustOf(unrecorded, 'edge.crossford.strong')]).toEqual([resentment(clean), trustOf(base.worldState, 'edge.crossford.strong')]);
    // The two-edge trust lands once, on the tick the pact first frays, and not on a slipped one.
    expect(trustOf(clean, 'edge.crossford.strong')).toBeGreaterThan(trustOf(base.worldState, 'edge.crossford.strong'));
    expect(trustOf(slipped, 'edge.crossford.strong')).toBe(trustOf(base.worldState, 'edge.crossford.strong'));
  });

  test('the temple arm is measured, not built: the one finder never answers a broker faith-led on both sides', () => {
    const reads = [];
    for (const samePatron of [true, false]) for (const alignmentKinship01 of [0.9, 0.1]) reads.push(faithAlignmentQuadrant({ samePatron, alignmentKinship01 }));
    let pressured = 0;
    for (const toA of reads) {
      for (const toB of reads) {
        if (!crossPressureMediation({ toA, toB }).crossPressured) continue;
        pressured += 1;
        expect(toA.samePatron && toB.samePatron, `${toA.quadrant} × ${toB.quadrant}`).toBe(false);
      }
    }
    expect(pressured).toBeGreaterThan(0);
  });
});

/** A fraying pact between Ironhold (owed) and Midvale (owing), Crossford between them. */
function frayArgs({ rules = LIT, previous = { complianceState: 'honored' } } = {}) {
  // (`previous: null` is the record with no earlier tick at all; an omitted key is a clean one.)
  const edges = [
    { id: 'edge.mid.strong', from: 'mid', to: 'strong', relationshipType: 'cold_war' },
    { id: 'edge.crossford.strong', from: 'crossford', to: 'strong', relationshipType: 'trade_partner' },
    { id: 'edge.crossford.mid', from: 'crossford', to: 'mid', relationshipType: 'trade_partner' },
  ];
  const courts = [
    court('strong', 'Ironhold', { tier: 'city', population: 45000, patron: 'Dawn' }),
    court('mid', 'Midvale', { tier: 'town', population: 9000, patron: 'Dusk' }),
    court('crossford', 'Crossford', { tier: 'town', population: 2200, patron: 'Dawn' }),
  ];
  const treaty = {
    parties: ['strong', 'mid'], victorId: 'strong', loserId: 'mid', mintedTick: 1, treatyTicksPerYear: 52,
    complianceState: 'strained',
    terms: [{ type: 'tribute', family: 'tribute', magnitude: 0.2, mintedTick: 1, expiresTick: 400, complianceState: 'strained', trueState: 'strained', burden01: 0.6 }],
  };
  return {
    worldState: {
      tick: 20, simulationRules: { ...rules },
      relationshipStates: Object.fromEntries(edges.map((e) => [e.id, { relationshipType: e.relationshipType, trust: 0.3, resentment: 0.1 }])),
    },
    edges, snapshot: { byId: new Map(courts.map((c) => [c.id, c])) }, treaty, previous,
    loserId: 'mid', victorId: 'strong', burden01: 0.6, tick: 20, now: NOW,
  };
}

/** @param {string} dir @param {string[]} [out] @returns {string[]} */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(entry)) out.push(p);
  }
  return out;
}
