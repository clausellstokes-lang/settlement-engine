/**
 * @vitest-environment jsdom
 *
 * tests/pdf/restoredSubsections.test.js — behavioral pins for RESTORATION SWEEP 1
 * (THE PDF CLUSTER, census §1 #18–21). Each restored PDF subsection is proven to
 * render (with its real gate) AND to self-gate to nothing in its off-state, by
 * walking the section's element tree to its text leaves (react-pdf components are
 * plain hook-free functions — executed directly; no PDF bytes, which are
 * non-deterministic under renderToBuffer).
 *
 *   #18 PowerStructure — RULE & SUCCESSION (regime lineage + OCCUPIED banner)
 *   #19 ViabilityAssessment — MAGIC LEGALITY (live-world + magic-profile gated)
 *   #20 SettlementPDF — campaign_state promotes Current State to causal-substrate
 *   #21 viewModel — the entity-anchor ids + lineage + magicProfile + collectPlotHooks
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { SystemStateSnapshot } from '../../src/pdf/sections/SystemStateSnapshot.jsx';
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import { governingModifierWordsOf } from '../../src/domain/display/governingModifierWords.js';
import { ViabilityAssessment } from '../../src/pdf/sections/ViabilityAssessment.jsx';
import { Relationships } from '../../src/pdf/sections/Relationships.jsx';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { PlotHooks } from '../../src/pdf/sections/PlotHooks.jsx';
import { HistoryFounding } from '../../src/pdf/sections/HistoryFounding.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { plotHookPlace } from '../../src/pdf/lib/plotHookIndex.js';
import { stakeLines, unprintedFacts } from '../../src/pdf/lib/crisisPrint.js';
import { STAKE_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { institutionBackers } from '../../src/domain/dossier/powerSupport.js';
import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';

// Recursively flatten an element tree to its text leaves. Function components are
// executed (plain functions in src/pdf — no hooks); hosts walked via children.
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}
const joined = (node) => collectText(node).join('  ');

const CFG = { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
const SEED = 'restored-subsections-2026';

let settlement, vm, vmState;
beforeAll(() => {
  settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
  vm = buildViewModel({ settlement });
  // A state-bearing vm so the Current State chapter renders its real body (not the
  // "unavailable" shell) — the precondition for the causal-substrate subsection.
  vmState = buildViewModel({ settlement, systemState: { snapshotAtTick: 0 } });
});

// The substrate grid's own sub-line (UX consolidation 2026-10-30, T2-25/X-12: the header is
// now "FOUNDATIONS", a word other chapters may carry; the sub-line is unique to the grid).
// THE TRIM (the owner, 2026-11-01, ODQ §934.103): the conditions sentence that used to be
// this marker now prints only when the reading folds a condition in (see the parity case).
const SUBSTRATE_MARK = 'What is holding, what is strained';

describe('#20 SettlementPDF — Current-State causal-detail restoration', () => {
  it('the conditions sentence prints only when a condition is active, naming it (screen parity, THE TRIM 2026-11-01)', () => {
    const plain = joined(SystemStateSnapshot({ settlement, vm: vmState, causalDetail: true }));
    expect(plain).toContain(SUBSTRATE_MARK);
    expect(plain).not.toContain('This reading includes'); // anchored: the grid's sub-line is on this render
    const besieged = { ...settlement, activeConditions: [{ archetype: 'siege' }] };
    const vmBesieged = buildViewModel({ settlement: besieged, systemState: { snapshotAtTick: 0 } });
    const printed = joined(SystemStateSnapshot({ settlement: besieged, vm: vmBesieged, causalDetail: true }));
    expect(printed).toContain('This reading includes the current condition: siege.');
  });

  it('the renderer prints the causal substrate ONLY when causalDetail is passed', () => {
    const on  = joined(SystemStateSnapshot({ settlement, vm: vmState, causalDetail: true }));
    const off = joined(SystemStateSnapshot({ settlement, vm: vmState, causalDetail: false }));
    expect(on, 'causalDetail=true must render the 16-variable substrate grid')
      .toContain(SUBSTRATE_MARK);
    expect(off, 'causalDetail=false stays the byte-identical 4-dim snapshot')
      .not.toContain(SUBSTRATE_MARK);
  });

  it('the campaign_state variant threads causalDetail=true into the State chapter', () => {
    const doc = SettlementPDF({
      settlement, systemState: { snapshotAtTick: 0 }, phase: 'canon', variant: 'campaign_state',
    });
    expect(joined(doc), 'campaign_state promotes Current State to state + substrate')
      .toContain(SUBSTRATE_MARK);
  });

  it('the default canon_dossier variant does NOT promote the State chapter to substrate', () => {
    const doc = SettlementPDF({
      settlement, systemState: { snapshotAtTick: 0 }, phase: 'canon', variant: 'canon_dossier',
    });
    expect(joined(doc), 'a non-campaign_state export keeps the substrate off')
      .not.toContain(SUBSTRATE_MARK);
  });
});

describe('#21 viewModel — entity-anchor ids + lineage + magicProfile + collectPlotHooks', () => {
  it('every faction / institution / npc carries a stable anchor id', () => {
    expect(vm.power.factions.length, 'city fixture has factions').toBeGreaterThan(0);
    expect(vm.power.factions.every(f => typeof f.id === 'string' && f.id.startsWith('faction.')),
      'each faction card sets its own faction.<snake> anchor id').toBe(true);
    expect(vm.services.detailed.length, 'city fixture has institutions').toBeGreaterThan(0);
    expect(vm.services.detailed.every(i => typeof i.id === 'string' && i.id.length > 0),
      'each institution carries an anchor id').toBe(true);
    expect(vm.npcs.all.length, 'city fixture has npcs').toBeGreaterThan(0);
    expect(vm.npcs.all.every(n => typeof n.id === 'string' && n.id.length > 0),
      'each npc carries an anchor id').toBe(true);
    // factionLink is the canonical faction id (or null) — never garbage.
    expect(vm.npcs.all.every(n => n.factionLink === null || String(n.factionLink).startsWith('faction.')),
      'an npc affiliation resolves to a faction id (or null), no name-matching').toBe(true);
  });

  it('lineage maps previousGovernments and self-gates to [] with no regime history', () => {
    const withHistory = buildViewModel({ settlement: { powerStructure: { previousGovernments: [
      { government: 'The Old Council', cause: 'conquest', tick: 12, by: 'Iron Legion' },
    ] } } });
    expect(withHistory.power.lineage).toEqual([
      { government: 'The Old Council', cause: 'conquest', tick: 12, by: 'Iron Legion' },
    ]);
    // Absent / empty previousGovernments ⇒ [] ⇒ the RULE & SUCCESSION subsection
    // renders nothing (byte-identical for a settlement with no regime history).
    expect(buildViewModel({ settlement: { powerStructure: {} } }).power.lineage).toEqual([]);
  });

  it('magicProfile is live for a magical fixture and self-gates for a dead-magic world', () => {
    expect(vm.viability.magicProfile.exists, 'default fixture has functioning magic').toBe(true);
    expect(vm.viability.magicProfile.lines.length, 'a magical world summarizes its legality facets')
      .toBeGreaterThan(0);
    const dead = buildViewModel({ settlement: { config: { magicExists: false } } });
    expect(dead.viability.magicProfile.exists, 'dead-magic world reports no magic').toBe(false);
    expect(dead.viability.magicProfile.lines, 'and prints no legality lines (byte-identical off-state)')
      .toEqual([]);
  });

  it('neighbour carries an anchor id + a directional label for asymmetric links', () => {
    const nv = buildViewModel({ settlement: { neighbourNetwork: [
      { neighbourName: 'Thornmere', localRelationshipRole: 'overlord', relationshipType: 'overlord' },
      { name: 'Ashford', relationshipType: 'trade_partners' },
    ] } });
    const [a, b] = nv.relationships.neighbours;
    expect(a.id).toBe('neighbour.thornmere');
    expect(a.directionalLabel).toBe('Overlord of Thornmere');
    expect(b.id).toBe('neighbour.ashford');
    expect(b.directionalLabel, 'symmetric / legacy link keeps its plain label (null)').toBeNull();
  });

  it('hooks derive from the shared collectPlotHooks aggregator (banded priority, mapped source)', () => {
    const hv = buildViewModel({ settlement: { npcs: [
      { name: 'Seer', plotHooks: ['A rumor stirs the ward.'], influence: 'high' },
    ] } });
    expect(hv.hooks.all, 'the PDF hooks chapter now reads the same aggregator as the screen').toEqual([
      { source: 'npc', sourceName: 'Seer', hook: 'A rumor stirs the ward.', priority: 'high', category: 'npc' },
    ]);
    // Every emitted hook on the real fixture carries a BAND priority (never the old
    // null) and a mapped section source group.
    const bands = new Set(['high', 'medium', 'low']);
    const sources = new Set(['npc', 'conflict', 'tension', 'crisis', 'crime', 'history', 'relationship', 'other']);
    for (const h of vm.hooks.all) {
      expect(bands.has(h.priority), `hook priority is a band string, got ${h.priority}`).toBe(true);
      expect(sources.has(h.source), `hook source is a mapped group key, got ${h.source}`).toBe(true);
    }
  });
});

describe('#18 PowerStructure — RULE & SUCCESSION subsection (regime lineage / occupation)', () => {
  it('renders the lineage subsection with cause tags when power.lineage is present', () => {
    const lineageVm = {
      ...vm,
      power: { ...vm.power, lineage: [
        { government: 'The Old Council', cause: 'conquest', tick: 12, by: 'Iron Legion' },
      ] },
    };
    const on = joined(PowerStructure({ settlement, vm: lineageVm }));
    expect(on, 'a settlement with regime history prints RULE & SUCCESSION').toContain('RULE & SUCCESSION');
    expect(on, 'the prior government is named').toContain('The Old Council');
    expect(on, 'the conquest cause is humanized into a tag').toContain('Conquest');
  });

  it('renders the OCCUPIED banner off the live-world occupation flag', () => {
    const occVm = {
      ...vm,
      power: { ...vm.power, lineage: [] },
      liveWorld: { occupied: { occupier: 'The Iron Legion', sinceTick: 7 } },
    };
    const on = joined(PowerStructure({ settlement, vm: occVm }));
    expect(on, 'a live occupation lights the OCCUPIED banner').toContain('OCCUPIED');
    expect(on, 'naming the occupier').toContain('The Iron Legion');
  });

  it('STOP-1 (R7): the GOVERNING box prints the governing faction modifier, the screen power line twin', () => {
    const modded = structuredClone(settlement);
    const g = modded.powerStructure.factions.find((f) => f.isGoverning);
    g.modifier = 'military-dominated';
    const on = joined(PowerStructure({ settlement: modded, vm: buildViewModel({ settlement: modded }) }));
    expect(on).toContain('GOVERNING');
    // RE-KEYED BY IDENTITY (POWERS-15, REVIEW-POWERS-5 A7; one reader for one fact on every surface): the modifier prints
    // beside the governing name in the Power tab's own words (display/governingModifierWords.js), never the stored key
    expect(governingModifierWordsOf(modded), 'anchored: the fixture bears the force family out').toBe('armed sway');
    expect(on, 'the modifier prints beside the governing name').toContain('armed sway');
    expect(on, 'the stored key is never printed').not.toContain('military-dominated');
    delete g.modifier;
    const off = joined(PowerStructure({ settlement: modded, vm: buildViewModel({ settlement: modded }) }));
    expect(off).toContain('GOVERNING');
    expect(off).not.toContain('armed sway'); // anchored: the GOVERNING box is on this render
  });

  it('self-gates to nothing with no lineage and no occupation (byte-identical off-state)', () => {
    const offVm = { ...vm, power: { ...vm.power, lineage: [] }, liveWorld: null };
    expect(joined(PowerStructure({ settlement, vm: offVm })), 'no regime history ⇒ no subsection')
      .not.toContain('RULE & SUCCESSION');
  });
});

describe('F13 / X-2 — the PDF Relationships chapter prints each tie with its tension (a fact of the tie)', () => {
  it('every internal tie prints its pair and its tension line; no "Link" fallback label', () => {
    const ties = settlement.relationships || [];
    expect(ties.filter((t) => t.tension).length, 'fixture premise: the city has ties with tensions').toBeGreaterThan(12);
    const on = joined(Relationships({ settlement, vm }));
    expect(on).toContain('Internal relationships');
    for (const t of ties) {
      expect(on, `${t.npc1Name} / ${t.npc2Name}`).toContain(t.npc1Name);
      if (t.tension) expect(on, 'the tension prints beside its tie').toContain(t.tension);
    }
    expect(on).not.toMatch(/\bLink\b/); // anchored: 'Internal relationships' is on this render
  });
});

// RS-19, kept in the RECORD since lane REVIEW-INTAKE unit 2 (2026-11-06): the former proxy
// houses own their menus, so a row naming one prints under that house like any other.
const FORMER_PROXY_HOSTS = new Set(['dwellings (1-8)', 'dwellings (5-25)', 'dwellings (15-100)', 'housing (75-650 households)', 'housing (500-4000 households)', 'water source', 'multiple water sources', 'sewage system', 'farmland', 'common grazing land', 'access to external mill', 'massive prison']);
describe('F14 / RS-19 — the PDF Institutions chapter prints a former proxy house\'s own menu', () => {
  it('a row naming a former proxy house prints under it', () => {
    const rows = Object.values(settlement.availableServices || {}).flat();
    const hosted = rows.filter((r) => r && r.desc && FORMER_PROXY_HOSTS.has(String(r.institution || '').toLowerCase()));
    expect(hosted.length, 'fixture premise: the city has a row naming a former proxy house').toBeGreaterThan(0);
    const on = joined(Institutions({ settlement, vm }));
    for (const r of hosted) expect(on, `${r.institution}: ${r.name}`).toContain(r.desc);
  });
});

describe('X-40 / X-45 — the PDF Institutions chapter prints the Backs line under each house', () => {
  it('every backed house prints its powers, keyed by the display name the chapter prints', () => {
    const backers = institutionBackers(settlement);
    expect(backers.size, 'fixture premise: the city has backed houses').toBeGreaterThan(0);
    const on = joined(Institutions({ settlement, vm }));
    expect(on).toContain('Backs');
    for (const [raw, powers] of backers) {
      // RE-KEYED (R2-CODE-B round 3, ruling (a)): the chapter prints each house by its label, the one
      // display leaf (the display name less the catalogue's count range, gate or condition).
      expect(on, `${raw} prints`).toContain(institutionHouseLabel(raw));
      for (const p of powers) expect(on, `${raw} backs ${p}`).toContain(p);
    }
  });
});

describe('N6 / X-2 — the PDF Notable NPCs chapter prints no hook text (the Plot Hooks chapter is its one home)', () => {
  it('no NPC sheet, major or compact, prints a plot hook; the sheets themselves still print', () => {
    const hooks = (settlement.npcs || []).flatMap((n) => (n.plotHooks || []).map((h) => (typeof h === 'string' ? h : h?.hook || h?.text || '')))
      .filter(Boolean);
    expect(hooks.length, 'fixture premise: the city NPCs carry plot hooks').toBeGreaterThan(0);
    const on = joined(NotableNPCs({ settlement, vm }));
    expect(on, 'the top NPC sheet prints').toContain(settlement.npcs[0].name);
    for (const h of hooks) expect(on).not.toContain(h); // anchored: the sheets are on this render
    expect(on).not.toContain('PLOT HOOKS'); // anchored: same render
  });

  it('the PDF Overview prints no tension or conflict hook (the screen Overview prints none); the crisis hook stays (X-3)', () => {
    const vmHooked = { ...vm, overview: { ...vm.overview,
      tensions: [{ label: 'guild_conflict', severity: 'high', description: 'The guilds quarrel over the wharf.', parties: [], hooks: ['A guild clerk wants the old charter burned.'] }],
      conflicts: [{ parties: ['The Wharf', 'The Hall'], issue: 'Tolls', intensity: 'high', hooks: ['Someone pays the toll-takers twice.'] }],
      stress: [{ label: 'Under siege', summary: 'The walls are ringed.', hook: 'The besiegers want the abbot.' }] } };
    const on = joined(Overview({ settlement, vm: vmHooked }));
    // The tension row prints by its label (STYLE-RULINGS-2 B4, 2026-11-09: its description's one home
    // is History › Live tensions, so the Overview keeps the label and the parties).
    expect(on).toContain('Guild Conflict');
    expect(on).not.toContain('The guilds quarrel over the wharf.'); // anchored: the tension row is on this render, one line above
    expect(on).toContain('Tolls');
    expect(on, 'the crisis card owns its hook (X-3)').toContain('The besiegers want the abbot.');
    expect(on).not.toContain('A guild clerk wants the old charter burned.'); // anchored: the tension row is on this render
    expect(on).not.toContain('Someone pays the toll-takers twice.'); // anchored: the conflict row is on this render
  });
});

describe('F18 / X-3 — the PDF Viability chapter does not restate the active stress', () => {
  it('prints the stress consequences but neither the stress label pills nor the crisis hook (the Overview crisis owns them)', () => {
    const stressVm = { ...vm, viability: { ...vm.viability,
      stress: [{ label: 'Under siege', hook: 'The besiegers want the abbot handed over by the new moon.' }],
      stressConsequences: [{ title: 'Grain ration halved', text: 'Grain ration halved' }] } };
    const on = joined(ViabilityAssessment({ settlement, vm: stressVm }));
    expect(on, 'the consequences still print').toContain('Grain ration halved');
    expect(on).not.toContain('The besiegers want the abbot'); // anchored: the consequences block is on this render
    expect(on).not.toContain('ACTIVE STRESS  '); // anchored: same render; the header names the effects
    expect(on).not.toMatch(/Under siege/i); // anchored: same render
  });
});

describe('#19 ViabilityAssessment — MAGIC LEGALITY subsection (liveWorld && magicProfile-gated)', () => {
  it('renders the legality facets for a live campaign export with functioning magic', () => {
    const liveVm = {
      ...vm,
      liveWorld: { occupied: null },
      viability: { ...vm.viability, magicProfile: {
        exists: true, legality: 'restricted', availability: 'common', institutionalControl: 'guild',
        lines: ['Availability: common.', 'Legality: restricted.'],
      } },
    };
    const on = joined(ViabilityAssessment({ settlement, vm: liveVm }));
    expect(on, 'a live magical export surfaces MAGIC LEGALITY').toContain('MAGIC LEGALITY');
    expect(on, 'and prints the summarized legality lines').toContain('Legality: restricted.');
  });

  it('self-gates off a non-campaign export even with a magic profile present', () => {
    const noLive = { ...vm, liveWorld: null, viability: { ...vm.viability, magicProfile: {
      exists: true, legality: 'restricted', availability: 'common', institutionalControl: 'guild', lines: ['x'],
    } } };
    expect(joined(ViabilityAssessment({ settlement, vm: noLive })), 'no liveWorld ⇒ no MAGIC LEGALITY block')
      .not.toContain('MAGIC LEGALITY');
  });

  it('self-gates off a dead-magic world even on a live campaign export', () => {
    const deadMagic = { ...vm, liveWorld: { occupied: null }, viability: { ...vm.viability, magicProfile: {
      exists: false, legality: null, availability: null, institutionalControl: null, lines: [],
    } } };
    expect(joined(ViabilityAssessment({ settlement, vm: deadMagic })), 'dead magic ⇒ no MAGIC LEGALITY block')
      .not.toContain('MAGIC LEGALITY');
  });
});

// ⛔ STYLE-RULINGS-2 B4 (2026-11-09): STYLE-0 §3's keep-on rules, applied. One surface keeps a
// sentence's full text; every other prints the label, or the label and where to read it. Each case
// asserts the home still prints the text (so the absence elsewhere is not vacuous).
describe('B4 — one home per sentence inside one export (the keep-on rules)', () => {
  // RE-KEYED BY IDENTITY at SW-B4's merge point (STYLE-2-MERGE, 2026-11-09): THE OWNER'S VETO 3 struck the pointer line
  // ("In full in Plot Hooks (04):") and the prior state returned — the Tonight sheet prints each hook's own text.
  it('Tonight prints each hook\'s own text (the owner\'s veto 3: no pointer into chapter 04); Plot Hooks prints it too', () => {
    const sheet = composeTonightSheet(settlement);
    const placed = sheet.hooks.filter((h) => h.source && plotHookPlace(vm.hooks.all, h.text));
    expect(placed.length, 'fixture premise: the sheet carries a titled hook chapter 04 lists').toBeGreaterThan(0);
    const tonight = joined(TonightAtTheTable({ settlement, vm }));
    const hooks = joined(PlotHooks({ settlement, vm }));
    for (const h of placed) {
      expect(tonight).toContain(h.text.replace(/\.$/, ''));
      expect(tonight).not.toContain('In full in Plot Hooks'); // anchored: the hook's own text is asserted on the line above
      expect(hooks).toContain(h.text.replace(/\.$/, ''));
    }
  });

  it('the Overview keeps a tension\'s label and parties, not its description; History keeps the description', () => {
    const t = { label: 'guild_conflict', severity: 'high', description: 'The guilds quarrel over the wharf.', parties: ['The Wharf', 'The Hall'], hooks: [] };
    const over = joined(Overview({ settlement, vm: { ...vm, overview: { ...vm.overview, tensions: [t], conflicts: [] } } }));
    expect(over).toContain('Guild Conflict');
    expect(over).toContain('The Wharf / The Hall');
    expect(over).not.toContain('The guilds quarrel over the wharf.'); // anchored: the row's label and parties are asserted above
    const plot = joined(PlotHooks({ settlement, vm: { ...vm, hooks: { ...vm.hooks, tensions: [t] } } }));
    expect(plot).toContain('UNDERLYING TENSIONS');
    expect(plot).not.toContain('The guilds quarrel over the wharf.'); // anchored: the list's heading is asserted one line above
    const hist = joined(HistoryFounding({ settlement, vm: { ...vm, history: { ...vm.history, tensions: [t] } } }));
    expect(hist).toContain('The guilds quarrel over the wharf.');
  });

  it('the Overview keeps the origin line, not the historical character; the notable connection prints its names and tie only', () => {
    const over = joined(Overview({ settlement, vm: { ...vm, overview: { ...vm.overview,
      character: 'The flood is the one event people here still date things by.',
      settlementReason: 'A ford where the river runs shallow.',
      prominentRelationship: { npc1: 'Anna Weber', npc2: 'Karl Brandt', type: 'mutual leverage', phrasing: 'Each holds a letter the other wants burned.' },
    } } }));
    expect(over).toContain('A ford where the river runs shallow.');
    expect(over).toContain('Anna Weber & Karl Brandt');
    expect(over).not.toContain('The flood is the one event'); // anchored: the origin line is asserted above
    expect(over).not.toContain('Each holds a letter'); // anchored: the pair's names are asserted above
  });

  it('the Relationships banner opens empty when the tie\'s own row prints the line', () => {
    const line = 'Each holds a letter the other wants burned.';
    const rel = joined(Relationships({ settlement, vm: { ...vm, relationships: { ...vm.relationships,
      prominentRelationship: { npc1: 'Anna Weber', npc2: 'Karl Brandt', type: 'mutual leverage', tension: line },
      internal: [{ npc1Name: 'Anna Weber', npc2Name: 'Karl Brandt', typeName: 'Mutual Leverage', description: 'They work together.', tension: line }],
    } } }));
    expect(rel).toContain('PROMINENT RELATIONSHIP');
    expect(rel.split(line).length - 1, 'the line prints once, on its row').toBe(1);
  });

  it('the untouched houses keep their own rows (the owner\'s veto 3); the two facts print once on the Tonight chapter', () => {
    const u = STAKE_REASONS.untouched;
    const out = stakeLines([
      { factionId: 'The Abbey', stake: 'gains', reason: STAKE_REASONS.gainsChurch },
      { factionId: 'Noble Families', stake: 'split', reason: u },
      { factionId: 'The Garrison', stake: 'split', reason: u },
      { factionId: 'Merchant Guild', stake: 'split', reason: u },
    ]);
    // RE-KEYED BY IDENTITY at SW-B4's merge point (STYLE-2-MERGE, 2026-11-09): THE OWNER'S VETO 3 struck the joined
    // sentence for the untouched houses; the prior state returned — every house keeps its own row.
    expect(out.rows.map((k) => k.factionId)).toEqual(['The Abbey', 'Noble Families', 'The Garrison', 'Merchant Guild']);
    expect(out.untouched).toBeNull();
    expect(stakeLines([{ factionId: 'Elder Council', stake: 'split', reason: u }]).rows.map((k) => k.factionId)).toEqual(['Elder Council']);
    const facts = [{ id: 'food', label: 'Food', text: 'Pressured.' }, { id: 'defence', label: 'Defence', text: 'Palisade.' }];
    expect(unprintedFacts(facts, [{ id: 'food', text: 'Pressured.' }]).map((f) => f.id)).toEqual(['defence']);
  });

  it('the machinery leaves the reader\'s page: the assessment\'s counts, the anchor\'s units and score, the coherence box', () => {
    const via = joined(ViabilityAssessment({ settlement, vm: { ...vm, viability: { ...vm.viability,
      metrics: { criticalIssueCount: 1, dependencyCount: 2, warningCount: 0, tradeAccess: 'mountain_pass' } } } }));
    expect(via).toContain('KEY METRICS');
    expect(via).toContain('Mountain Pass');
    expect(via).not.toMatch(/issue count|dependency count|warning count/i); // anchored: the metrics block is asserted above
    expect(via).not.toContain('mountain_pass'); // anchored: same block
  });

  // ONE HOME PER EXPORT (the chair's B4 ruling (2), 2026-11-09): the home is History where the variant
  // prints it; a variant without History (campaign_state) carries the full text on the Overview.
  it('each tension description and the historical character print exactly once per export, in every variant', () => {
    const descs = (settlement.history?.currentTensions || []).map((t) => t?.description).filter(Boolean);
    const character = settlement.history?.historicalCharacter;
    expect(descs.length, 'fixture premise: the city carries live tensions with descriptions').toBeGreaterThan(0);
    expect(character, 'fixture premise: the city carries a historical character').toBeTruthy();
    const count = (text, needle) => text.split(needle).length - 1;
    for (const variant of ['canon_dossier', 'draft_brief', 'campaign_state']) {
      const text = joined(SettlementPDF({ settlement, variant, phase: 'canon' }));
      for (const d of descs) expect(count(text, d), `${variant}: ${d}`).toBe(1);
      expect(count(text, character), `${variant}: the historical character`).toBe(1);
    }
    const lean = joined(Overview({ settlement, vm, historyPrinted: false }));
    for (const d of descs) expect(lean, 'campaign_state: the Overview is the home').toContain(d);
    const full = joined(Overview({ settlement, vm, historyPrinted: true }));
    expect(full).toContain('Each tension in full: History & Founding (17).');
    for (const d of descs) expect(full).not.toContain(d); // anchored: the pointer to History is asserted one line above
  });

  it('the cover prints one tier word: the free preview\'s where the export is anonymous', () => {
    const both = joined(Cover({ settlement, vm, isFounder: true, isAnonymous: true }));
    expect(both).toContain('Free preview');
    expect(both).not.toContain('FOUNDER EDITION'); // anchored: the preview's word is asserted one line above
    expect(joined(Cover({ settlement, vm, isFounder: true, isAnonymous: false }))).toContain('FOUNDER EDITION');
  });

  it('the Foundry journal keeps the same homes: hooks on Plot Hooks, no coherence figures, no NPC hook text', () => {
    const pages = buildJournalPages(vm, { settlement });
    const page = (name) => pages.find((p) => p.name === name)?.markdown || '';
    const all = pages.map((p) => p.markdown).join('\n');
    expect(page('Plot Hooks').length).toBeGreaterThan(0);
    expect(pages.some((x) => x.name.startsWith('NPC — ')), 'fixture premise: an NPC page prints').toBe(true);
    // anchored: each NPC page is non-empty (its Role row), and the premise above proves one prints
    for (const p of pages.filter((x) => x.name.startsWith('NPC — '))) expect(p.markdown).not.toContain('## Hooks');
    expect(all).not.toContain('checks passed'); // anchored: the Plot Hooks page is asserted present above
    expect(all).not.toMatch(/aggression ×/); // anchored: same journal
  });
});
