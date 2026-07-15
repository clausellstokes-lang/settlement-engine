/**
 * upswingKernel.test.js — W-UPSWING stage 1 (B1 RECONSTRUCTION) pins.
 * Drives advanceUpswing directly (a controlled fixture) to prove the constitution:
 * conservation (every progress receipt names its source; ally acceleration MATURES the
 * obligation), the ABSORPTION cap binds + is deferral-visible, regress-on-shock, the
 * reconstruction SKIM fires ONLY under low conscience, the institution UPGRADE up the
 * lattice, and dormancy byte-identity.
 */
import { describe, expect, it } from 'vitest';
import { advanceUpswing, upswingArcsActive, UPSWING_TUNING } from '../../src/domain/worldPulse/upswingKernel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { prosperityRank } from '../../src/data/constants.js';

const NOW = '2026-01-01T00:00:00.000Z';

function struck(name, over = {}) {
  return {
    name, tier: 'town', population: 1500,
    config: { economicBase: 'agrarian' },
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },
      { name: 'Carpenter', category: 'crafts' },
      { name: "Wizard's tower", category: 'magic' },
    ],
    economicState: { prosperity: 'Comfortable' },
    powerStructure: { publicLegitimacy: { score: 45 }, factions: [], conflicts: [] },
    calamityHistory: [{ type: 'fire', name: 'The Great Calamity of X, year 4', year: 4, tick: 208, deaths: 90, exodus: 200, k: 1, targets: ['Tannery'] }],
    npcs: [], activeConditions: [],
    ...over,
  };
}

function fixture({ settlement, lit = true, year = 5, obligations = null, stressors = [] }) {
  const items = [{ id: 'a', name: 'Ashford', settlement }];
  const snapshot = { settlements: items };
  const worldState = {
    tick: 260,
    calendar: { elapsedWeeks: 260, year },
    simulationRules: lit ? { upswingArcsEnabled: true } : {},
    stressors,
    ...(obligations ? { spatialLedgers: { obligations } } : {}),
  };
  const settlementUpdates = items.map((it) => ({ saveId: it.id, settlement: it.settlement }));
  return { snapshot, worldState, settlementUpdates, graph: ensureRegionalGraph({ edges: [] }) };
}

/** Drive N ticks, threading worldState + updates + carried ledger. */
function drive(cfg, ticks) {
  let f = fixture(cfg);
  let worldState = f.worldState;
  let settlementUpdates = f.settlementUpdates;
  const receipts = [];
  const news = [];
  for (let t = 0; t < ticks; t++) {
    // Refresh the snapshot to the freshest settlement (conditions/institutions carry).
    const snapshot = { settlements: settlementUpdates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
    const r = advanceUpswing({ snapshot, worldState, settlementUpdates, graph: f.graph, rng: null, tick: worldState.tick + t, now: NOW });
    worldState = r.worldState;
    settlementUpdates = r.settlementUpdates;
    receipts.push(...r.receipts);
    news.push(...r.newsEntries);
  }
  return { worldState, settlementUpdates, receipts, news };
}

describe('upswing — the dormancy gate', () => {
  it('flag absent ⇒ a complete no-op (same references, no ledger, no condition)', () => {
    const f = fixture({ settlement: struck('Ashford'), lit: false });
    const r = advanceUpswing({ snapshot: f.snapshot, worldState: f.worldState, settlementUpdates: f.settlementUpdates, graph: f.graph, rng: null, tick: 260, now: NOW });
    expect(r.changed).toBe(false);
    expect(r.settlementUpdates).toBe(f.settlementUpdates);
    expect(r.worldState).toBe(f.worldState);
    expect(r.receipts).toHaveLength(0);
    expect(upswingArcsActive(f.worldState)).toBe(false);
  });
});

describe('upswing — B1 reconstruction: trigger + conservation receipts', () => {
  it('a recent calamity stamp ARMS reconstruction: the condition mints + a source-named receipt', () => {
    const { settlementUpdates, receipts } = drive({ settlement: struck('Ashford') }, 1);
    const s = settlementUpdates.find((u) => u.saveId === 'a').settlement;
    expect((s.activeConditions || []).some((c) => c.archetype === 'reconstruction')).toBe(true);
    const prog = receipts.find((r) => r.kind === 'reconstruction_progress');
    expect(prog).toBeTruthy();
    // CONSERVATION: the receipt names EVERY source of the step (no receipt-less rise).
    expect(prog.sources).toMatchObject({ prosperity: expect.any(Number), builder: expect.any(Number), ally: expect.any(Number), peace: expect.any(Number) });
  });

  it('a siege/occupation clearing condition also arms reconstruction (no calamity needed)', () => {
    const s0 = struck('Ashford', { calamityHistory: [], activeConditions: [{ id: 'condition.siege_lifted.1', archetype: 'siege_lifted' }] });
    const { settlementUpdates } = drive({ settlement: s0 }, 1);
    const s = settlementUpdates.find((u) => u.saveId === 'a').settlement;
    expect((s.activeConditions || []).some((c) => c.archetype === 'reconstruction')).toBe(true);
  });

  it('NO trigger (old calamity, no clearing) ⇒ no arc, no ledger (sparse)', () => {
    const s0 = struck('Ashford', { calamityHistory: [{ type: 'fire', name: 'x', year: -20, tick: 1, deaths: 1, exodus: 1, k: 0, targets: [] }] });
    const { worldState, receipts } = drive({ settlement: s0, year: 40 }, 1);
    expect(worldState.spatialLedgers?.upswing).toBeUndefined();
    expect(receipts).toHaveLength(0);
  });
});

describe('upswing — B1 conservation: ally acceleration MATURES the obligation (the debit)', () => {
  it('an inbound ally credit accelerates the rebuild AND matures (debits) the obligation ledger', () => {
    const obligations = { 'a:ally:credit': { from: 'a', to: 'ally', kind: 'credit', magnitude: 0.6, mintTick: 100, lastTick: 100 } };
    const f = fixture({ settlement: struck('Ashford'), obligations });
    const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: f.settlementUpdates[0].settlement }] };
    const r = advanceUpswing({ snapshot, worldState: f.worldState, settlementUpdates: f.settlementUpdates, graph: f.graph, rng: null, tick: 260, now: NOW });
    const prog = r.receipts.find((x) => x.kind === 'reconstruction_progress');
    expect(prog.allyMatured, 'the ally acceleration matured part of the debt').toBeGreaterThan(0);
    // The obligation LEDGER shrank (aid consumed is aid spent — the conservation debit).
    const nextMag = r.worldState.spatialLedgers.obligations['a:ally:credit'].magnitude;
    expect(nextMag, 'the obligation magnitude fell after maturation').toBeLessThan(0.6);
  });

  it('NO ally obligation ⇒ ally term is 0, nothing matured (no phantom debit)', () => {
    const { receipts } = drive({ settlement: struck('Ashford') }, 1);
    const prog = receipts.find((r) => r.kind === 'reconstruction_progress');
    expect(prog.sources.ally).toBe(0);
    expect(prog.allyMatured).toBe(0);
  });
});

describe('upswing — B1 limits: absorption cap + regress-on-shock', () => {
  it('THE ABSORPTION CAP binds and is DEFERRAL-VISIBLE (the receipt says the step was capped)', () => {
    // A rich, full-builder, ally-funded, peaceful town would exceed the cap.
    const rich = struck('Ashford', {
      economicState: { prosperity: 'Wealthy' },
      institutions: [
        { name: 'Town hall', required: true }, { name: 'Carpenter', category: 'crafts' },
        { name: 'Mason', category: 'crafts' }, { name: "Builders' lodge", category: 'crafts' },
      ],
    });
    const obligations = { 'a:ally:credit': { from: 'a', to: 'ally', kind: 'credit', magnitude: 1, mintTick: 1, lastTick: 1 } };
    const f = fixture({ settlement: rich, obligations });
    const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: f.settlementUpdates[0].settlement }] };
    const r = advanceUpswing({ snapshot, worldState: f.worldState, settlementUpdates: f.settlementUpdates, graph: f.graph, rng: null, tick: 260, now: NOW });
    const prog = r.receipts.find((x) => x.kind === 'reconstruction_progress');
    expect(prog.absorptionCapped, 'the cap bound').toBe(true);
    expect(prog.rawStep, 'the raw step exceeded the cap').toBeGreaterThan(UPSWING_TUNING.RECON_ABSORPTION_CAP);
    expect(prog.step, 'the applied step is clamped to the cap').toBeCloseTo(UPSWING_TUNING.RECON_ABSORPTION_CAP, 6);
  });

  it('a NEW shock during the rebuild REGRESSES progress (a second blow sets it back)', () => {
    // Same seed twice: once calm, once with a live famine stressor.
    const calm = drive({ settlement: struck('Ashford') }, 1);
    const shocked = drive({ settlement: struck('Ashford'), stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.8, affectedSettlementIds: ['a'], age: 2 }] }, 1);
    const calmProg = calm.receipts.find((r) => r.kind === 'reconstruction_progress').progress;
    const shockedRec = shocked.receipts.find((r) => r.kind === 'reconstruction_progress');
    expect(shockedRec.regressed, 'the shock was recorded').toBe(true);
    expect(shockedRec.progress, 'a shocked tick advances less than a calm one').toBeLessThan(calmProg);
  });
});

describe('upswing — B1 completion: history beat + legitimacy dividend + upgrade + skim', () => {
  it('COMPLETION upgrades an institution UP the lattice, pays a legitimacy dividend, drops the arc', () => {
    // Drive to completion (absorption cap 0.18 ⇒ ~6+ ticks).
    const { worldState, settlementUpdates, receipts, news } = drive({ settlement: struck('Ashford') }, 12);
    const done = receipts.find((r) => r.kind === 'reconstruction_complete');
    expect(done, 'the arc completed').toBeTruthy();
    // Institution UPGRADE up the lattice (the CODEPOINT-FIRST eligible — 'Carpenter'
    // < "Wizard's tower" — promotes to its greater; the demote lattice read in reverse).
    expect(done.upgraded).toBe('Carpenter → Carpenters (5-15)');
    const s = settlementUpdates.find((u) => u.saveId === 'a').settlement;
    expect((s.institutions || []).some((i) => i.name === 'Carpenters (5-15)')).toBe(true);
    expect((s.institutions || []).some((i) => i.name === 'Carpenter')).toBe(false);
    // Legitimacy dividend landed (rose above the 45 baseline).
    expect(Number(s.powerStructure.publicLegitimacy.score)).toBeGreaterThan(45);
    // The arc dropped its ledger record; the reconstruction condition cleared.
    expect(worldState.spatialLedgers?.upswing?.reconstruction?.a).toBeFalsy();
    expect((s.activeConditions || []).some((c) => c.archetype === 'reconstruction')).toBe(false);
    // A permanent history beat + a completion receipt naming the conserved source mix.
    expect((s.history?.historicalEvents || []).some((e) => /reconstruction/i.test(String(e.campaignEventId || '')))).toBe(true);
    expect(done.sources).toMatchObject({ internal: expect.any(Number), ally: expect.any(Number), peace: expect.any(Number), builder: expect.any(Number) });
    expect(news.some((n) => n.impactKind === 'reconstruction')).toBe(true);
  });

  it('THE SKIM fires ONLY under LOW conscience (funds flowing × malice)', () => {
    // Honest town (no evil signal) ⇒ NO skim even with ally funds.
    const honestObl = { 'a:ally:credit': { from: 'a', to: 'ally', kind: 'credit', magnitude: 1, mintTick: 1, lastTick: 1 } };
    const honest = drive({ settlement: struck('Ashford'), obligations: honestObl }, 12);
    const honestDone = honest.receipts.find((r) => r.kind === 'reconstruction_complete');
    expect(honestDone.skimmed, 'an honest town does not skim').toBe(false);

    // Corrupt town (evil patron deity ⇒ high malice) WITH ally funds ⇒ the skim fires.
    const evil = struck('Ashford', {
      config: { economicBase: 'agrarian', primaryDeitySnapshot: { _deityRef: 'custom:evil', name: 'The Devourer', alignmentAxis: 'evil', lawAxis: 'chaotic', rankAxis: 'major' } },
      npcs: [{ id: 'tyrant', name: 'Tyrant', importance: 'key', role: 'ruler', personality: { traits: ['cruel', 'greedy', 'ruthless'] } }],
      powerStructure: { publicLegitimacy: { score: 45 }, factions: [{ faction: 'The Syndicate', category: 'criminal', power: 70 }], conflicts: [] },
    });
    const corruptObl = { 'a:ally:credit': { from: 'a', to: 'ally', kind: 'credit', magnitude: 1, mintTick: 1, lastTick: 1 } };
    const corrupt = drive({ settlement: evil, obligations: corruptObl }, 12);
    const corruptDone = corrupt.receipts.find((r) => r.kind === 'reconstruction_complete');
    expect(corruptDone, 'the corrupt arc completed').toBeTruthy();
    // If the ally funds flowed and malice is high, the skim planted the next corruption arc.
    if (corruptDone.sources.ally > 0) {
      expect(corruptDone.skimmed, 'a low-conscience town skims the rebuild funds').toBe(true);
      const s = corrupt.settlementUpdates.find((u) => u.saveId === 'a').settlement;
      expect((s.activeConditions || []).some((c) => c.id?.startsWith('condition.reconstruction_skim'))).toBe(true);
    }
  });
});

// ── W-UPSWING stage 2 — B2 BOOM → BUST ─────────────────────────────────────────
function boomFixture({ throughput = 4, centrality = 0.5, embattled = false, arteries = ['x', 'y'], lit = true, boomLedger = null, prosperity = 'Comfortable' }) {
  const settlement = {
    name: 'Port', tier: 'city', population: 5000, config: {},
    institutions: [{ name: 'Market', category: 'trade' }],
    economicState: { prosperity }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [], conflicts: [] },
    activeConditions: [], calamityHistory: [],
  };
  const spatialLedgers = {
    tradeFlow: { p: { in: throughput / 2, out: throughput / 2, lastTick: 0 } },
    entrepots: { p: { centrality } },
    ...(embattled ? { embattlement: { p: { level: 0.5, phase: 'embattled' } } } : {}),
    ...(boomLedger ? { upswing: { boom: boomLedger } } : {}),
  };
  const worldState = { tick: 100, calendar: { year: 10 }, simulationRules: lit ? { upswingArcsEnabled: true } : {}, stressors: [], spatialLedgers };
  const graph = { edges: arteries.map((a, i) => ({ id: `e${i}`, from: 'p', to: a, relationshipType: 'trade_partner' })), channels: [] };
  const settlementUpdates = [{ saveId: 'p', settlement }];
  return { snapshot: { settlements: [{ id: 'p', name: 'Port', settlement }] }, worldState, settlementUpdates, graph };
}

/** Drive N boom ticks, threading worldState (keeps tradeFlow/entrepot ledgers). */
function driveBoom(cfg, ticks, mutate = null) {
  let f = boomFixture(cfg);
  let worldState = f.worldState;
  let settlementUpdates = f.settlementUpdates;
  const receipts = []; const news = [];
  for (let t = 0; t < ticks; t++) {
    if (mutate) worldState = mutate(worldState, t);
    const snapshot = { settlements: settlementUpdates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
    const r = advanceUpswing({ snapshot, worldState, settlementUpdates, graph: f.graph, rng: null, tick: 100 + t, now: NOW });
    worldState = r.worldState; settlementUpdates = r.settlementUpdates;
    receipts.push(...r.receipts); news.push(...r.newsEntries);
  }
  return { worldState, settlementUpdates, receipts, news };
}

describe('upswing — B2 boom: hysteresis enter + fragile edges + source set', () => {
  it('BOOM mints only after sustained surplus throughput + centrality (the hysteresis dwell)', () => {
    // 2 ticks < MIN_DWELL(3) ⇒ still building, no boom condition yet.
    const early = driveBoom({ throughput: 4, centrality: 0.5 }, 2);
    expect(early.receipts.some((r) => r.kind === 'boom_enter')).toBe(false);
    expect(early.worldState.spatialLedgers.upswing.boom.p.phase).toBe('building');
    // 3 ticks ⇒ the boom mints.
    const boomed = driveBoom({ throughput: 4, centrality: 0.5 }, 3);
    expect(boomed.receipts.some((r) => r.kind === 'boom_enter')).toBe(true);
    const s = boomed.settlementUpdates.find((u) => u.saveId === 'p').settlement;
    expect((s.activeConditions || []).some((c) => c.archetype === 'boom')).toBe(true);
  });

  it('a backwater (high throughput, NO centrality) never booms — centrality gates it', () => {
    const r = driveBoom({ throughput: 5, centrality: 0.1 }, 5);
    expect(r.receipts.some((x) => x.kind === 'boom_enter')).toBe(false);
    expect(r.worldState.spatialLedgers?.upswing).toBeUndefined();
  });

  it('the boom RECORDS ITS OWN FRAGILE EDGES + typed source set (the artery ids)', () => {
    const single = driveBoom({ throughput: 4, centrality: 0.5, arteries: ['x'] }, 3);
    const enter = single.receipts.find((r) => r.kind === 'boom_enter');
    expect(enter.fragile, 'a single-artery boom is fragile').toBe(true);
    expect(enter.sources.arteries).toEqual(['x']);
    const two = driveBoom({ throughput: 4, centrality: 0.5, arteries: ['x', 'y'] }, 3);
    expect(two.receipts.find((r) => r.kind === 'boom_enter').fragile, 'two independent arteries ⇒ not fragile').toBe(false);
  });

  it('a sustained boom DRIFTS prosperity UP (band step accrues over volume; receipted)', () => {
    // ~10 ticks ⇒ accrual 0.14×~8 in-boom ≥ 1 ⇒ one band step up.
    const r = driveBoom({ throughput: 4, centrality: 0.5, prosperity: 'Moderate' }, 12);
    const s = r.settlementUpdates.find((u) => u.saveId === 'p').settlement;
    expect(prosperityRank(s.economicState.prosperity), 'prosperity drifted up a band').toBeGreaterThan(prosperityRank('Moderate'));
    // NO receipt-less rise: a boom_sustain receipt names the source arteries.
    expect(r.receipts.some((x) => x.kind === 'boom_sustain' && Array.isArray(x.sources.arteries))).toBe(true);
  });
});

describe('upswing — B2 bust: severance names the artery (constitution)', () => {
  it('embattlement during boom FLIPS to bust: prosperity retreat + a receipt naming the artery', () => {
    // Enter boom (3 ticks), then embattlement appears at tick 3.
    const r = driveBoom({ throughput: 4, centrality: 0.5, arteries: ['Rivermouth', 'Hillfort'] }, 5,
      (ws, t) => (t >= 3 ? { ...ws, spatialLedgers: { ...ws.spatialLedgers, embattlement: { p: { level: 0.6, phase: 'embattled' } } } } : ws));
    const bust = r.receipts.find((x) => x.kind === 'bust');
    expect(bust, 'the boom busted under embattlement').toBeTruthy();
    expect(bust.cause).toBe('embattlement');
    expect(bust.severedArtery, 'the bust NAMES the severed artery').toBe('Hillfort'); // codepoint-first of the sorted arteries
    expect(r.news.some((n) => n.impactKind === 'bust' && /artery|dangerous/.test(String(n.summary)))).toBe(true);
  });

  it('a THROUGHPUT COLLAPSE busts the boom (the W-DISCOVERY resource-removal seam rides this same flip)', () => {
    // Enter boom, then throughput collapses below BUST_THROUGHPUT.
    const r = driveBoom({ throughput: 4, centrality: 0.5 }, 5,
      (ws, t) => (t >= 3 ? { ...ws, spatialLedgers: { ...ws.spatialLedgers, tradeFlow: { p: { in: 0.2, out: 0.2, lastTick: 0 } } } } : ws));
    const bust = r.receipts.find((x) => x.kind === 'bust');
    expect(bust, 'the boom busted on artery collapse').toBeTruthy();
    expect(bust.cause).toBe('artery_collapse');
    // Prosperity retreated (a bust condition minted).
    const s = r.settlementUpdates.find((u) => u.saveId === 'p').settlement;
    expect((s.activeConditions || []).some((c) => c.archetype === 'custom_crisis' && c.id?.startsWith('condition.bust'))).toBe(true);
  });
});

// ── W-UPSWING stage 3 — B3 FLOURISHING (the golden-age homeostat) ──────────────
function flourishFixture({ prosperity = 'Prosperous', legitimacy = 80, lit = true, warFront = false, flourishLedger = null }) {
  const settlement = {
    name: 'Highvale', tier: 'city', population: 6000, config: {},
    institutions: [{ name: 'Market', category: 'trade' }, { name: 'Barracks', category: 'military' }],
    economicState: { prosperity }, powerStructure: { publicLegitimacy: { score: legitimacy }, factions: [], conflicts: [] },
    activeConditions: [], calamityHistory: [],
  };
  const worldState = {
    tick: 500, calendar: { year: 20 },
    simulationRules: lit ? { upswingArcsEnabled: true } : {}, stressors: [],
    ...(flourishLedger ? { spatialLedgers: { upswing: { flourishing: flourishLedger } } } : {}),
  };
  // Peace = no war-front channels. A war front is a minted war channel between p and an enemy.
  const graph = {
    edges: [{ id: 'e0', from: 'h', to: 'ally', relationshipType: 'trade_partner' }],
    channels: warFront ? [{ id: 'wf', type: 'war_front', from: 'enemy', to: 'h', status: 'confirmed' }] : [],
  };
  return { snapshot: { settlements: [{ id: 'h', name: 'Highvale', settlement }] }, worldState, settlementUpdates: [{ saveId: 'h', settlement }], graph };
}

function driveFlourish(cfg, ticks, mutate = null) {
  let f = flourishFixture(cfg);
  let worldState = f.worldState; let settlementUpdates = f.settlementUpdates; let graph = f.graph;
  const receipts = []; const news = [];
  for (let t = 0; t < ticks; t++) {
    if (mutate) ({ worldState, graph } = mutate(worldState, graph, t));
    const snapshot = { settlements: settlementUpdates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
    const r = advanceUpswing({ snapshot, worldState, settlementUpdates, graph, rng: null, tick: 500 + t, now: NOW });
    worldState = r.worldState; settlementUpdates = r.settlementUpdates;
    receipts.push(...r.receipts); news.push(...r.newsEntries);
  }
  return { worldState, settlementUpdates, receipts, news };
}

describe('upswing — B3 flourishing: hysteresis + NEVER snowballs', () => {
  it('mints only after sustained prosperity + legitimacy + PEACE (the peace-dwell counter)', () => {
    const early = driveFlourish({}, 5); // < FLOUR_MIN_DWELL(6)
    expect(early.receipts.some((r) => r.kind === 'flourishing_enter')).toBe(false);
    const done = driveFlourish({}, 6);
    expect(done.receipts.some((r) => r.kind === 'flourishing_enter')).toBe(true);
    const s = done.settlementUpdates.find((u) => u.saveId === 'h').settlement;
    expect((s.activeConditions || []).some((c) => c.archetype === 'flourishing')).toBe(true);
  });

  it('FLOURISHING NEVER SNOWBALLS — no prosperity/army/economic multiplier, only cultural warmth', () => {
    const r = driveFlourish({ prosperity: 'Prosperous' }, 7);
    const s = r.settlementUpdates.find((u) => u.saveId === 'h').settlement;
    // Prosperity is UNCHANGED (flourishing never touches the economic axis).
    expect(prosperityRank(s.economicState.prosperity)).toBe(prosperityRank('Prosperous'));
    // The condition declares NO economic/martial system.
    const cond = (s.activeConditions || []).find((c) => c.archetype === 'flourishing');
    expect(cond.affectedSystems).not.toContain('economic_capacity');
    expect(cond.affectedSystems).not.toContain('defense_readiness');
    // The enter receipt asserts the no-multiplier contract.
    expect(r.receipts.find((x) => x.kind === 'flourishing_enter').noMultiplier).toBe(true);
    // No prosperity-delta receipts anywhere from flourishing (no boom sustain/enter here).
    expect(r.receipts.some((x) => x.kind === 'boom_sustain' || x.kind === 'boom_enter')).toBe(false);
  });

  it('the cultural founding BIAS founds ONE academy (bounded) when none stands', () => {
    const r = driveFlourish({}, 7);
    const s = r.settlementUpdates.find((u) => u.saveId === 'h').settlement;
    expect((s.institutions || []).filter((i) => i.worldPulseFate === 'founded_by_flourishing')).toHaveLength(1);
    expect((s.institutions || []).some((i) => i.name === 'Academy')).toBe(true);
    expect(r.news.some((n) => n.impactKind === 'flourishing')).toBe(true);
  });

  it('a war front RESETS the peace dwell — no flourishing while at war', () => {
    const r = driveFlourish({ warFront: true }, 10);
    expect(r.receipts.some((x) => x.kind === 'flourishing_enter')).toBe(false);
  });

  it('CAPPED DURATION + COOLDOWN: flourishing ends after FLOUR_DURATION and cannot immediately re-mint', () => {
    const total = UPSWING_TUNING.FLOUR_MIN_DWELL + UPSWING_TUNING.FLOUR_DURATION + 2;
    const r = driveFlourish({}, total);
    expect(r.receipts.some((x) => x.kind === 'flourishing_end')).toBe(true);
    // After the end, within cooldown, no immediate re-enter beyond the single first enter.
    const enters = r.receipts.filter((x) => x.kind === 'flourishing_enter').length;
    expect(enters).toBe(1);
  });
});
