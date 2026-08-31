/**
 * livedExperienceSources.test.js — the adapter laws (W-LIVES car L4).
 *
 * Every fixture below is shaped from the REAL emitting code, not from the design
 * doc, and the difference is the whole value of this file. Five of L3's census
 * verdicts turned out to be wrong when the emitters were read rather than trusted,
 * and each correction is pinned here against the machinery that proves it:
 *
 *   THE PRESET CENSUS IS EXECUTED, NOT TRANSCRIBED. `SIMULATION_RULE_PRESETS` is
 *   imported and walked, so "dark" and "default-on" are measurements. That is what
 *   moved `festival_kept` out of the dark set and `coup_at_home` into the
 *   default-on one.
 *
 *   THE KEY MIRROR IS RECONCILED AGAINST THE REAL MINTER. `npcKeyOf` must equal
 *   `npcAgency.npcId` on all three of its fallback paths, including the positional
 *   one — because a drift here would silently stop every adapter matching anybody,
 *   and that failure looks like a quiet world rather than like a bug.
 *
 *   THE §856 NON-OVERLAP CENSUS BLOCKS SOMETHING. A pin that never fires is a pin
 *   nobody has tested; this one costs the table its strongest source, and the
 *   collisions are computed from the kernel's own frozen map.
 *
 *   THE F9 SOURCE LAW IS PROVED AT THE ADAPTER, not just at the funnel. The funnel
 *   REFUSES a sub-floor pull; this car's job is to never make it do so, and both
 *   halves are executed.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`: a loop-registered
 * suite is TEST_UNREGISTERED to the lighting census and its assertions are then
 * evidence nowhere, however green vitest reports it.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ADAPTED_EXPERIENCE_KINDS,
  GROWTH_SIGNAL_TOKENS,
  LIVED_EXPERIENCE_SOURCES,
  MILIEU_DWELL_STATE,
  NON_OVERLAP_BLOCKED_KINDS,
  SOURCE_ADAPTER_OF,
  SOURCE_PROVENANCE,
  SOURCE_SURFACES,
  SUBJECT_RESOLUTIONS,
  WHEREABOUTS_STATES_MIRROR,
  collectLivedExperience,
  nonOverlapCollisions,
  npcKeyOf,
  subjectByDisplayName,
  subjectByDurableId,
  subjectByNpcKey,
  subjectsByHome,
} from '../../../src/domain/npc/livedExperienceSources.js';
import {
  RECEIPTED_EXPERIENCE_KINDS,
  RECEIPT_DARK_KINDS,
  SILENT_EXPERIENCE_KIND,
  SOURCE_UNVERIFIED_KINDS,
  EXPERIENCE_TABLE,
} from '../../../src/domain/npc/livedExperienceCatalog.js';
import { AMBIENT_CADENCE_TICKS, foldLivedExperience } from '../../../src/domain/npc/livedExperienceFunnel.js';
import { characterDriftOf } from '../../../src/domain/npc/characterDrift.js';
import { npcId } from '../../../src/domain/worldPulse/npcAgency.js';
import { stablePart } from '../../../src/domain/worldPulse/stablePart.js';
import { WHEREABOUTS_STATES } from '../../../src/domain/roads/state.js';
import { GROWTH_DEPOSIT_MAP } from '../../../src/domain/worldPulse/npcGrowthKernel.js';
import { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } from '../../../src/domain/worldPulse/simulationRules.js';
import { graduateNpc } from '../../../src/domain/worldPulse/npcLedger.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const TOWN = 'save.town';
const SEED = 'seed.town';

const npc = (id, name, extra = {}) => ({ id, name, role: 'Reeve', character: { axes: {} }, ...extra });
const ALDA = npc('npc_1', 'Alda');
const BERO = npc('npc_2', 'Bero');

/**
 * One home AS THE CALLER RESOLVES IT — the documented contract, built here exactly
 * as `SourceHome` says the pulse seam must build it. The adapters read nothing
 * else about a settlement: the plumbing (and in particular the seed line, which the
 * durable-id mint hashes) lives at the pulse, where it already exists once.
 */
const town = (cast = [ALDA, BERO], patronRef = '') =>
  ({ placeId: TOWN, placeSeed: SEED, cast, patronRef });

const ctxOf = (extra = {}) => ({ tick: 11, worldState: {}, homes: [town()], ...extra });
const kindsOf = (entries) => entries.map((row) => row.kind).sort();

/** The presets that light a flag, MEASURED off the real preset table. */
function presetsLighting(flag) {
  return Object.keys(SIMULATION_RULE_PRESETS)
    .filter((id) => {
      const preset = SIMULATION_RULE_PRESETS[id];
      const rules = preset && preset.rules ? preset.rules : preset;
      return rules && rules[flag] === true;
    })
    .sort();
}

describe('THE REGISTRY — one row per receipted kind, and the law is a load-time refusal', () => {
  test('every receipted kind except the silent one has exactly one adapter', () => {
    const owed = RECEIPTED_EXPERIENCE_KINDS.filter((kind) => kind !== SILENT_EXPERIENCE_KIND);
    expect(ADAPTED_EXPERIENCE_KINDS.length).toBe(owed.length);
    expect([...ADAPTED_EXPERIENCE_KINDS]).toEqual([...owed].sort());
    expect(LIVED_EXPERIENCE_SOURCES.length).toBe(18);
    // One row per kind: a duplicate would make SOURCE_ADAPTER_OF silently drop one.
    expect(Object.keys(SOURCE_ADAPTER_OF).length).toBe(LIVED_EXPERIENCE_SOURCES.length);
  });

  test('NO adapter exists for a kind the census could not verify — the §3 source law', () => {
    // The collection is asserted live and non-trivial FIRST, so the exclusion below
    // cannot pass because the unverified list drifted away to nothing.
    expect(SOURCE_UNVERIFIED_KINDS.length).toBe(12);
    for (const kind of SOURCE_UNVERIFIED_KINDS) {
      // anchored: SOURCE_UNVERIFIED_KINDS is pinned at 12 members one line above
      expect(ADAPTED_EXPERIENCE_KINDS, `${kind} is a phantom source`).not.toContain(kind);
    }
  });

  test('every row declares a real surface, a real resolution and a real address', () => {
    for (const row of LIVED_EXPERIENCE_SOURCES) {
      expect(SOURCE_SURFACES, row.kind).toContain(row.surface);
      expect(SUBJECT_RESOLUTIONS, row.kind).toContain(row.resolution);
      expect(row.address.length, `${row.kind} names an empty address`).toBeGreaterThan(8);
      expect(row.signals.length, `${row.kind} declares no signal`).toBeGreaterThan(0);
      expect(typeof row.read, row.kind).toBe('function');
    }
  });

  test('a receipt-DARK kind carries its own system\'s flag, named', () => {
    for (const kind of RECEIPT_DARK_KINDS) {
      const row = SOURCE_ADAPTER_OF[kind];
      expect(row, `${kind} is dark and unadapted`).toBeTruthy();
      // "Wired and silent" must be a legible state, not a bug hunt: the flag whose
      // darkness explains the silence is named on the row.
      expect(row.flagKey, `${kind} is dark but names no flag`).toBeTruthy();
    }
  });
});

describe('⭐ THE PRESET CENSUS — EXECUTED, and it corrected five of L3\'s verdicts', () => {
  test('festival_kept is NOT dark: traditionsEnabled is lit in the same three presets as roads', () => {
    const lit = presetsLighting('traditionsEnabled');
    expect(lit).toEqual(['dramatic_campaign', 'full_simulation', 'living_realm']);
    expect(lit).toEqual(presetsLighting('roadsEnabled'));
    expect(lit).toEqual(presetsLighting('npcLadderEnabled'));
    expect(EXPERIENCE_TABLE.festival_kept.receiptDark).toBe(false);
    // anchored: the lit list is pinned to three named presets two lines above
    expect(RECEIPT_DARK_KINDS).not.toContain('festival_kept');
  });

  test('the three genuinely dark kinds are lit in ZERO presets — measured, not assumed', () => {
    for (const flag of ['npcCredibilityEnabled', 'npcConsequencesEnabled', 'infoStatecraftEnabled']) {
      expect(presetsLighting(flag), flag).toEqual([]);
      expect(DEFAULT_SIMULATION_RULES[flag], flag).toBeUndefined();
    }
    expect([...RECEIPT_DARK_KINDS]).toEqual(['caught_lying_exposed', 'pardoned_released', 'turned_by_crime']);
  });

  test('coup_at_home is the FIFTH default-on kind — stressorsEnabled is true in the defaults', () => {
    expect(DEFAULT_SIMULATION_RULES.stressorsEnabled).toBe(true);
    expect(DEFAULT_SIMULATION_RULES.npcAgencyEnabled).toBe(true);
    // Its adapter therefore names no flag at all, exactly like corruption_exposed's.
    expect(SOURCE_ADAPTER_OF.coup_at_home.flagKey).toBeNull();
    expect(SOURCE_ADAPTER_OF.goal_culminated.flagKey).toBeNull();
    expect(SOURCE_ADAPTER_OF.corruption_exposed.flagKey).toBeNull();
  });

  test('the war kinds are lit in TWO presets, not three — living_realm inherits warLayer false', () => {
    expect(DEFAULT_SIMULATION_RULES.warLayerEnabled).toBe(false);
    expect(presetsLighting('warLayerEnabled')).toEqual(['dramatic_campaign', 'full_simulation']);
    expect(SOURCE_ADAPTER_OF.home_occupied.flagKey).toBe('warLayerEnabled');
    expect(SOURCE_ADAPTER_OF.home_liberated.flagKey).toBe('warLayerEnabled');
  });

  test('the corrections are carried IN THE MODULE, where the next car will read them', () => {
    expect(SOURCE_PROVENANCE.signedBy).toBeNull();
    expect(SOURCE_PROVENANCE.censusCorrections.length).toBeGreaterThanOrEqual(7);
    expect(SOURCE_PROVENANCE.censusCorrections.join(' ')).toContain('festival_kept');
    expect(SOURCE_PROVENANCE.censusCorrections.join(' ')).toContain('coup_at_home');
  });
});

describe('THE KEY MIRRORS — reconciled against the real minters, all three paths', () => {
  test('npcKeyOf equals npcAgency.npcId, including the POSITIONAL fallback', () => {
    // The three branches of the real minter, each proved separately. The third is
    // the one that matters: an NPC with no id, name or label keys POSITIONALLY, so
    // a roster reorder repoints its records — L2's rebind class, still reachable.
    expect(npcKeyOf(TOWN, { id: 'npc_6', name: 'Alda' }, 6)).toBe(npcId(TOWN, { id: 'npc_6', name: 'Alda' }, 6));
    expect(npcKeyOf(TOWN, { name: 'Alda the Bold' }, 3)).toBe(npcId(TOWN, { name: 'Alda the Bold' }, 3));
    expect(npcKeyOf(TOWN, {}, 3)).toBe(npcId(TOWN, {}, 3));
    expect(npcKeyOf(TOWN, {}, 3)).toBe(`${TOWN}:npc_3`);
    // ⭐ AND THE ROSTER ID IS ITSELF A SLOT NAME. `npc_6` is not an opaque handle;
    // it is position 6. That is why the composite key may never be persisted, and
    // why every adapter here re-derives it forward instead of parsing one back.
    expect(npcKeyOf(TOWN, { id: 'npc_6' }, 0)).toContain('npc_6');
  });

  test('the stablePart mirror matches the real slugifier on its edge cases', () => {
    for (const value of ['Alda the Bold', 'X!!', '', 'Ünïcode Name', 'a'.repeat(120)]) {
      expect(npcKeyOf(TOWN, { name: value }, 0)).toBe(npcId(TOWN, { name: value }, 0));
    }
    expect(stablePart('')).toBe('unknown');
  });

  test('the whereabouts state mirror equals the roads authority', () => {
    expect([...WHEREABOUTS_STATES_MIRROR]).toEqual([...WHEREABOUTS_STATES]);
    expect(WHEREABOUTS_STATES).toContain(MILIEU_DWELL_STATE);
  });
});

describe('SUBJECT RESOLUTION — forward only, and ambiguity refuses', () => {
  test('a composite key resolves to the roster RECORD, with its settlement beside it', () => {
    const hit = subjectByNpcKey(ctxOf(), `${TOWN}:npc_2`);
    expect(hit.npc.name).toBe('Bero');
    expect(hit.home.placeSeed).toBe(SEED);
    expect(subjectByNpcKey(ctxOf(), `${TOWN}:npc_9`)).toBeNull();
    expect(subjectByNpcKey(ctxOf(), '')).toBeNull();
  });

  test('⭐ A HOME THAT WILL NOT SAY WHERE IT IS ADDRESSES NOBODY', () => {
    // The mutation pass found this guard unpinned. An anonymous home is not a
    // harmless no-op: its entries would carry `settlementId: ''`, and the funnel
    // resolves a durable identity by (settlementId, rosterId, name) — so two
    // nameless places would collide into ONE key and merge two people's charts.
    const nowhere = { placeId: '', placeSeed: SEED, cast: [ALDA, BERO] };
    const ctx = ctxOf({
      homes: [nowhere],
      news: [{ id: 'w.1', impactKind: 'coup_succeeded', settlementIds: [TOWN], tick: 11 }],
    });
    expect(subjectByNpcKey(ctx, `${TOWN}:npc_1`)).toBeNull();
    expect(subjectsByHome(ctx, '')).toEqual([]);
    expect(collectLivedExperience(ctx)).toEqual([]);
    // And the SAME roster under a named home does teach, so the emptiness above is
    // the id guard rather than a fixture that could never have produced anything.
    expect(collectLivedExperience(ctxOf({
      news: [{ id: 'w.1', impactKind: 'coup_succeeded', settlementIds: [TOWN], tick: 11 }],
    })).length).toBe(2);
  });

  test('a settlement-addressed event reaches everybody who lives there', () => {
    expect(subjectsByHome(ctxOf(), TOWN).map((row) => row.npc.id)).toEqual(['npc_1', 'npc_2']);
    expect(subjectsByHome(ctxOf(), 'save.elsewhere')).toEqual([]);
  });

  test('⭐ A SHARED NAME REFUSES — corruptionEvents leaves a name and nothing else', () => {
    const twins = [npc('npc_1', 'Alda'), npc('npc_2', 'Alda')];
    const ctx = ctxOf({ homes: [town(twins)] });
    // Picking the first match would teach one soul about another's disgrace, and it
    // would be unfindable afterwards. A name is not an identity.
    expect(subjectByDisplayName(ctx, TOWN, 'Alda')).toBeNull();
    expect(subjectByDisplayName(ctxOf(), TOWN, 'Alda').npc.id).toBe('npc_1');
  });

  test('a DURABLE id resolves through the ledger\'s originRef, in reverse', () => {
    const lit = { tick: 4, simulationRules: { npcConsequencesEnabled: true } };
    const out = graduateNpc({
      worldState: lit, settlementSeed: SEED, settlementId: TOWN,
      rosterIdentity: { rosterId: ALDA.id, name: ALDA.name, role: ALDA.role }, tick: 4,
    });
    expect(out.wnpcId).toBeTruthy();
    const hit = subjectByDurableId(ctxOf({ worldState: out.worldState }), out.wnpcId);
    expect(hit.npc.id).toBe('npc_1');
    // A durable id nobody graduated resolves to nobody, rather than to slot zero.
    expect(subjectByDurableId(ctxOf({ worldState: out.worldState }), 'wnpc_deadbeef')).toBeNull();
  });

  test('⭐⭐ A STRANGER AT THE OLD SLOT RESOLVES TO NOBODY — L2\'s rebind class', () => {
    // The mutation pass found this pin blind, and the hazard it guards is the one
    // car L2's whole recon was about: on a section reroll a slot does not orphan,
    // it REBINDS — `npc_1` comes to name a different human being. Matching a
    // durable identity on the slot id ALONE would hand a stranger a pardon that was
    // somebody else's, and no prune could ever catch it because the key stays live.
    const seeded = graduateNpc({
      worldState: { tick: 4, simulationRules: { npcConsequencesEnabled: true } },
      settlementSeed: SEED, settlementId: TOWN,
      rosterIdentity: { rosterId: ALDA.id, name: ALDA.name, role: ALDA.role }, tick: 4,
    });
    // Alda still resolves in her own roster, which is what makes the refusal below
    // a discrimination rather than a resolver that never works.
    expect(subjectByDurableId(ctxOf({ worldState: seeded.worldState }), seeded.wnpcId).npc.name).toBe('Alda');
    const stranger = npc('npc_1', 'Wolfhard');
    const rerolled = ctxOf({ worldState: seeded.worldState, homes: [town([stranger, BERO])] });
    expect(subjectByDurableId(rerolled, seeded.wnpcId)).toBeNull();
  });

  test('⭐ AND A NAMESAKE AT ANOTHER SLOT IS NOT THE SAME PERSON EITHER', () => {
    // The mirror of the pin above, and the mutation pass owed it too: matching on
    // the NAME alone refuses the stranger correctly and then hands the lesson to a
    // namesake. Both halves of the ledger's identity key have to agree, which is
    // exactly what `durableIdForRoster` itself requires.
    const seeded = graduateNpc({
      worldState: { tick: 4, simulationRules: { npcConsequencesEnabled: true } },
      settlementSeed: SEED, settlementId: TOWN,
      rosterIdentity: { rosterId: 'npc_2', name: 'Alda', role: 'Reeve' }, tick: 4,
    });
    const twins = [npc('npc_1', 'Alda'), npc('npc_2', 'Alda')];
    const hit = subjectByDurableId(ctxOf({ worldState: seeded.worldState, homes: [town(twins)] }), seeded.wnpcId);
    // The SECOND Alda is the graduated one. A name-only resolver returns the first.
    expect(hit.npc.id).toBe('npc_2');
  });
});

describe('THE ADAPTERS — each mapping proved against its REAL receipt shape', () => {
  test('goal_culminated reads the outcome that KEEPS its npcId through compaction', () => {
    const news = [{
      id: 'wizard_news.11.world_pulse.applied.candidate.npc.goal_culmination.save_town_npc_1.11',
      impactKind: 'npc_goal_culmination', npcId: `${TOWN}:npc_1`, settlementIds: [TOWN], tick: 11,
    }];
    const out = SOURCE_ADAPTER_OF.goal_culminated.read(ctxOf({ news }));
    expect(out.length).toBe(1);
    expect(out[0]).toMatchObject({ kind: 'goal_culminated', settlementId: TOWN, settlementSeed: SEED });
    expect(out[0].npc.id).toBe('npc_1');
    expect(out[0].eventId).toBe(news[0].id);
    // No plane is ever declared: the kind owns its plane, so an adapter cannot
    // smuggle a witness lesson onto the personal plane.
    expect(out[0].plane).toBeUndefined();
  });

  test('the ladder: rise and failed ride ONE impactKind and split on TAGS', () => {
    const beat = (kind) => ({
      id: `wizard_news.11.npc_ladder.${TOWN}.${kind}.f.a.b`,
      impactKind: 'npc_ladder', settlementIds: [TOWN], tick: 11,
      npcIds: [`${TOWN}:npc_1`, `${TOWN}:npc_2`],
      tags: ['world_pulse', 'npc_ladder', kind],
    });
    const ctx = ctxOf({ news: [beat('rise'), beat('failed')] });
    const rise = SOURCE_ADAPTER_OF.promotion_won.read(ctx);
    const fell = SOURCE_ADAPTER_OF.rung_lost.read(ctx);
    // THE ARRAY IS POSITIONAL: challenger first, defender second. Only the
    // challenger's own outcome is theirs to learn from.
    expect(rise.map((r) => r.npc.id)).toEqual(['npc_1']);
    expect(fell.map((r) => r.npc.id)).toEqual(['npc_1']);
  });

  test('⭐ the THIRD npc_ladder emitter is excluded EXPLICITLY, not by hoping', () => {
    // `investitureBeat` shares `impactKind: 'npc_ladder'` and is a succession, not a
    // rise. An adapter that matched the impactKind alone would teach an heir that
    // they won a challenge they never fought.
    const investiture = {
      id: 'wizard_news.11.npc_ladder.save.town.investiture.f.h.p',
      impactKind: 'npc_ladder', settlementIds: [TOWN], tick: 11,
      npcIds: [`${TOWN}:npc_1`, `${TOWN}:npc_2`],
      tags: ['world_pulse', 'npc_ladder', 'investiture', 'rise'],
    };
    const ctx = ctxOf({ news: [investiture] });
    expect(SOURCE_ADAPTER_OF.promotion_won.read(ctx)).toEqual([]);
    expect(SOURCE_ADAPTER_OF.rung_lost.read(ctx)).toEqual([]);
  });

  test('⭐ caught_lying_exposed matches on `kind`, because its author mints NO impactKind', () => {
    const row = {
      id: 'wizard_news.11.infowar_lie_exposed.a.b', kind: 'infowar_lie_exposed',
      settlementIds: [TOWN, 'save.other'], npcIds: [`${TOWN}:npc_2`], tick: 11,
    };
    // The trap this pin closes: reaching for `impactKind` here matches nothing,
    // forever, and looks exactly like a dark flag rather than like a wrong field.
    expect(SOURCE_ADAPTER_OF.caught_lying_exposed.read(ctxOf({ news: [row] })).map((r) => r.npc.id)).toEqual(['npc_2']);
    expect(SOURCE_ADAPTER_OF.caught_lying_exposed.read(ctxOf({
      news: [{ ...row, kind: 'applied', impactKind: 'infowar_lie_exposed' }],
    }))).toEqual([]);
  });

  test('⭐ faction_cleansed is read from the RECORD, because the news entry loses `from`', () => {
    const captureTransitions = [
        { settlementId: TOWN, name: 'The Ring', from: 'corrupted', to: 'capture' },
        { settlementId: TOWN, name: 'The Ring', from: 'capture', to: 'corrupted' },
      { settlementId: TOWN, name: 'The Ring', from: 'equilibrium', to: 'corrupted' },
    ];
    const ctx = ctxOf({ captureTransitions });
    // Two people live in the town, so each transition teaches two souls.
    expect(SOURCE_ADAPTER_OF.faction_captured.read(ctx).length).toBe(2);
    expect(SOURCE_ADAPTER_OF.faction_cleansed.read(ctx).length).toBe(2);
    // The third row is an ESCALATION into `corrupted` and must teach neither. On
    // the news entry it is indistinguishable from the cleansing above it, because
    // the tags carry `to` and never `from` — which is why this reads the record.
    const cleansedEvents = SOURCE_ADAPTER_OF.faction_cleansed.read(ctx).map((r) => r.eventId);
    expect(cleansedEvents.every((id) => id.includes('.capture.corrupted.'))).toBe(true);
  });

  test('the settlement-addressed war and coup kinds join on targetSaveId -> home', () => {
    const news = [
      { id: 'w.1', impactKind: 'conquest', settlementIds: [TOWN], tick: 11 },
      { id: 'w.2', impactKind: 'coup_succeeded', settlementIds: [TOWN], tick: 11 },
      { id: 'w.3', impactKind: 'coup_suppressed', settlementIds: ['save.other'], tick: 11 },
    ];
    const ctx = ctxOf({ news });
    expect(SOURCE_ADAPTER_OF.home_occupied.read(ctx).map((r) => r.npc.id)).toEqual(['npc_1', 'npc_2']);
    expect(SOURCE_ADAPTER_OF.coup_at_home.read(ctx).map((r) => r.npc.id)).toEqual(['npc_1', 'npc_2']);
  });

  test('⭐ the pantheon kinds reach souls ONLY through the patron-deity join', () => {
    const news = [{
      id: 'wizard_news.11.pantheon.ascendancy.the_lady', impactKind: 'pantheon_ascendancy',
      // The real emitter carries settlementIds: [] and names nobody. Without §14's
      // patron rule these two kinds have a receipt and no reachable subject at all.
      settlementIds: [], tick: 11, tags: ['world_pulse', 'pantheon', 'ascendancy', 'deity:the_lady'],
    }];
    const faithful = ctxOf({ news, homes: [town([ALDA, BERO], 'deity:the_lady')] });
    expect(SOURCE_ADAPTER_OF.god_fortunes_rose.read(faithful).length).toBe(2);
    // A town under another patron learns nothing, and a town under none learns nothing.
    expect(SOURCE_ADAPTER_OF.god_fortunes_rose.read(ctxOf({ news })).length).toBe(0);
  });

  test('captured_held teaches on the tick of capture, never every tick of the term', () => {
    const roads = { ransoms: { 'ransom.m1': { id: 'ransom.m1', npcKey: `${TOWN}:npc_1`, startedTick: 11, termWeeks: 20 } } };
    const worldState = { spatialLedgers: { roads } };
    expect(SOURCE_ADAPTER_OF.captured_held.read(ctxOf({ worldState })).length).toBe(1);
    // A ransom record lives for its whole term. Teaching from its PRESENCE would
    // teach the capture once a week for up to thirty-nine weeks.
    expect(SOURCE_ADAPTER_OF.captured_held.read({ ...ctxOf({ worldState }), tick: 12 })).toEqual([]);
  });

  test('ransomed_home reads the marker roads uses to keep the homecoming SILENT', () => {
    const roads = {
      missions: {
        back: { id: 'road.back', npcKey: `${TOWN}:npc_1`, releasedFromRansom: true, departTick: 11 },
        plain: { id: 'road.plain', npcKey: `${TOWN}:npc_2`, departTick: 11 },
      },
    };
    const out = SOURCE_ADAPTER_OF.ransomed_home.read(ctxOf({ worldState: { spatialLedgers: { roads } } }));
    expect(out.map((r) => r.npc.id)).toEqual(['npc_1']);
  });

  test('⭐ pardoned_released runs the ledger in REVERSE — it is the one wnpc_-only source', () => {
    const seeded = graduateNpc({
      worldState: { tick: 4, simulationRules: { npcConsequencesEnabled: true } },
      settlementSeed: SEED, settlementId: TOWN,
      rosterIdentity: { rosterId: ALDA.id, name: ALDA.name, role: ALDA.role }, tick: 4,
    });
    const worldState = {
      ...seeded.worldState,
      spatialLedgers: {
        ...seeded.worldState.spatialLedgers,
        npcRulings: { entries: [{ id: 'npcpardon:save.town:x:11', candidateType: 'npc_pardon', wnpcId: seeded.wnpcId, tick: 11 }] },
      },
    };
    const out = SOURCE_ADAPTER_OF.pardoned_released.read(ctxOf({ worldState }));
    expect(out.map((r) => r.npc.id)).toEqual(['npc_1']);
  });

  test('festival_kept crosses the AGGREGATE beat with a NAMED observance journey', () => {
    const roads = {
      missions: {
        obs: { id: 'road.obs', npcKey: `${TOWN}:npc_1`, destId: 'save.host', purpose: { kind: 'observance', ref: 't1' } },
        trade: { id: 'road.trade', npcKey: `${TOWN}:npc_2`, destId: 'save.host', purpose: { kind: 'trade', ref: '' } },
      },
    };
    const news = [{ id: 'wizard_news.11.tradition.save.host.t1.4', impactKind: 'tradition', settlementIds: ['save.host'], tick: 11 }];
    const out = SOURCE_ADAPTER_OF.festival_kept.read(ctxOf({ news, worldState: { spatialLedgers: { roads } } }));
    // The beat alone names no soul ("the town's festival, never a named soul's
    // fate"). Only the traveller who went FOR the observance learns from it.
    expect(out.map((r) => r.npc.id)).toEqual(['npc_1']);
  });
});

describe('⭐⭐ THE F9 SOURCE LAW (§853) AT THE ADAPTER — it never makes the funnel refuse', () => {
  const hostage = (sinceTick) => npc('npc_1', 'Alda', {
    whereabouts: { state: 'hostage', placeId: 'save.captor', sinceTick, missionId: 'm1' },
  });
  const vector = () => [{ axisId: 'MERCY', pole: 'vice', band: 'faint' }];
  const milieuCtx = (subject, tick) => ({
    tick, worldState: {}, homes: [town([subject])], milieuVectorOf: vector,
  });

  test('a dwell shorter than the cadence emits NOTHING — not a pull that would be refused', () => {
    const out = SOURCE_ADAPTER_OF.dwell_milieu.read(milieuCtx(hostage(10), 11));
    // One tick of dwelling integrates to 1/13 of a floor quantum. The funnel would
    // refuse it as `sub_floor_pull`; this adapter never asks.
    expect(out).toEqual([]);
    expect(SOURCE_ADAPTER_OF.dwell_milieu.read(milieuCtx(hostage(0), AMBIENT_CADENCE_TICKS - 1))).toEqual([]);
  });

  test('a completed cadence emits exactly ONE span of exactly one cadence', () => {
    const out = SOURCE_ADAPTER_OF.dwell_milieu.read(milieuCtx(hostage(0), AMBIENT_CADENCE_TICKS));
    expect(out.length).toBe(1);
    expect(out[0].spanTicks).toBe(AMBIENT_CADENCE_TICKS);
    expect(out[0].pulls).toEqual(vector());
  });

  test('a longer dwell declares WHOLE cadences, never the ragged remainder', () => {
    const out = SOURCE_ADAPTER_OF.dwell_milieu.read(milieuCtx(hostage(0), 3 * AMBIENT_CADENCE_TICKS + 7));
    expect(out[0].spanTicks).toBe(3 * AMBIENT_CADENCE_TICKS);
  });

  test('⭐ AND THE FUNNEL AGREES — every adapter emission is accepted, none refused', () => {
    const worldState = { tick: 40, simulationRules: { characterDriftEnabled: true, npcConsequencesEnabled: true } };
    const entries = SOURCE_ADAPTER_OF.dwell_milieu.read(milieuCtx(hostage(0), AMBIENT_CADENCE_TICKS));
    const out = foldLivedExperience({ worldState, entries, tick: AMBIENT_CADENCE_TICKS });
    // This is the half that makes the claim real: the adapter's own output is fed
    // to the real funnel and NOTHING is refused. A source that met the law only in
    // its own arithmetic would be a source nobody had tested against the door.
    expect(out.refusals).toEqual([]);
    expect(out.applied).toBe(1);
  });

  test('⭐ ONLY CAPTIVITY DWELLS LONG ENOUGH — the other three states emit nothing', () => {
    for (const state of WHEREABOUTS_STATES.filter((s) => s !== MILIEU_DWELL_STATE)) {
      const visitor = npc('npc_1', 'Alda', { whereabouts: { state, placeId: 'save.host', sinceTick: 0, missionId: 'm1' } });
      // An ordinary visit is one or two weeks against a thirteen-week cadence, and
      // for those three states `sinceTick` is the DEPARTURE tick, not the arrival —
      // so a reader that treated it uniformly would over-count every dwell by the
      // whole outbound journey. The adapter reads the one state where it is honest.
      expect(SOURCE_ADAPTER_OF.dwell_milieu.read(milieuCtx(visitor, 4 * AMBIENT_CADENCE_TICKS)), state).toEqual([]);
    }
  });

  test('no host vector ⇒ no lesson: the adapter never invents a city it has not read', () => {
    const ctx = { tick: AMBIENT_CADENCE_TICKS, worldState: {}, homes: [town([hostage(0)])] };
    expect(SOURCE_ADAPTER_OF.dwell_milieu.read(ctx)).toEqual([]);
    expect(SOURCE_ADAPTER_OF.dwell_milieu.read({ ...ctx, milieuVectorOf: () => [] })).toEqual([]);
  });
});

describe('⭐⭐ THE §856 NON-OVERLAP PIN — computed, and it BLOCKS the strongest source', () => {
  test('the kernel\'s eight signals each carry a token row, and two of them are DEAD', () => {
    expect(GROWTH_DEPOSIT_MAP.length).toBe(8);
    expect(Object.keys(GROWTH_SIGNAL_TOKENS).sort()).toEqual(GROWTH_DEPOSIT_MAP.map((r) => r.signal).sort());
    // Measured, not assumed: nothing in this tree writes `archetype: 'bust'` (the
    // one bust minter writes `custom_crisis`) and nothing writes
    // `relationshipType: 'war'` (the war vocabulary is hostile/cold_war). A
    // non-overlap claim that assumed all eight were live would overstate the
    // kernel's footprint in both directions.
    expect(GROWTH_SIGNAL_TOKENS.bust).toEqual(['archetype:bust']);
    expect(GROWTH_SIGNAL_TOKENS.besieged).toEqual(['relationshipType:war']);
  });

  test('the census finds EXACTLY two collisions, and names both ends of each', () => {
    expect(nonOverlapCollisions().map((c) => `${c.kind}<-${c.signal}`)).toEqual([
      'corruption_exposed<-betrayal',
      'home_liberated<-siege_survived',
    ]);
  });

  test('every colliding kind is BLOCKED, and every blocked kind collides', () => {
    // Both directions, so the block set can neither grow a row the census did not
    // find nor lose one it did.
    expect([...NON_OVERLAP_BLOCKED_KINDS]).toEqual(['corruption_exposed', 'home_liberated']);
    expect([...NON_OVERLAP_BLOCKED_KINDS]).toEqual([...new Set(nonOverlapCollisions().map((c) => c.kind))].sort());
    for (const kind of NON_OVERLAP_BLOCKED_KINDS) {
      expect(SOURCE_ADAPTER_OF[kind].blocked, kind).toContain('§856');
      expect(SOURCE_ADAPTER_OF[kind].blocked, kind).toContain('TE-GROWTH-MIG');
    }
  });

  test('⭐ A BLOCKED ADAPTER IS NOT CALLED AT ALL — the block is structural', () => {
    const corruptionEvents = [{ settlementId: TOWN, name: 'Alda', kind: 'ousted' }];
    const news = [{ id: 'w.1', impactKind: 'occupation_lifted', settlementIds: [TOWN], tick: 11 }];
    // Each blocked adapter WOULD produce entries if it were called — asserted here
    // so the emptiness below is a block, not an adapter that never worked.
    expect(SOURCE_ADAPTER_OF.corruption_exposed.read(ctxOf({ corruptionEvents })).length).toBe(1);
    expect(SOURCE_ADAPTER_OF.home_liberated.read(ctxOf({ news })).length).toBe(2);
    // And the collector emits neither.
    const collected = collectLivedExperience(ctxOf({ corruptionEvents, news }));
    expect(kindsOf(collected)).toEqual([]);
  });

  test('the grain the block was taken at is named as an OWNER row, not decided here', () => {
    const rows = SOURCE_PROVENANCE.ownerRows.join(' ');
    expect(rows).toContain('§856');
    expect(rows).toContain('signal x soul');
  });
});

describe('THE COLLECTOR — deterministic, total, and it feeds the real funnel', () => {
  test('collection is codepoint-ordered, so a tick is a property of its receipts', () => {
    const news = [
      { id: 'w.2', impactKind: 'coup_succeeded', settlementIds: [TOWN], tick: 11 },
      { id: 'w.1', impactKind: 'npc_goal_culmination', npcId: `${TOWN}:npc_2`, settlementIds: [TOWN], tick: 11 },
    ];
    const forward = collectLivedExperience(ctxOf({ news }));
    const reversed = collectLivedExperience(ctxOf({ news: [...news].reverse() }));
    expect(forward.map((r) => `${r.kind}:${r.eventId}:${r.npc.id}`))
      .toEqual(reversed.map((r) => `${r.kind}:${r.eventId}:${r.npc.id}`));
    expect(kindsOf(forward)).toEqual(['coup_at_home', 'coup_at_home', 'goal_culminated']);
  });

  test('an empty or malformed context collects nothing and throws nothing', () => {
    expect(collectLivedExperience({})).toEqual([]);
    expect(collectLivedExperience({ tick: 'x', worldState: null, homes: 'nope', news: 7 })).toEqual([]);
  });

  test('⭐ END TO END: collected entries move a real soul through the real funnel', () => {
    const news = [{ id: 'w.1', impactKind: 'npc_goal_culmination', npcId: `${TOWN}:npc_1`, settlementIds: [TOWN], tick: 11 }];
    const worldState = { tick: 11, simulationRules: { characterDriftEnabled: true, npcConsequencesEnabled: true } };
    const entries = collectLivedExperience(ctxOf({ news }));
    const out = foldLivedExperience({ worldState, entries, tick: 11 });
    expect(out.refusals).toEqual([]);
    // TWO, not one: `goal_culminated` pulls CONTENT and TEMPERANCE, and `applied`
    // counts axis writes rather than lessons. One soul, one event, two axes.
    expect(out.applied).toBe(2);
    expect(Object.keys(characterDriftOf(out.worldState)).length).toBe(1);
  });

  test('and the world is UNTOUCHED when the drift door is shut', () => {
    const news = [{ id: 'w.1', impactKind: 'npc_goal_culmination', npcId: `${TOWN}:npc_1`, settlementIds: [TOWN], tick: 11 }];
    const worldState = { tick: 11, simulationRules: { npcConsequencesEnabled: true } };
    const out = foldLivedExperience({ worldState, entries: collectLivedExperience(ctxOf({ news })), tick: 11 });
    // The adapters read regardless — they are pure. The DOOR is L2's, and it is the
    // only thing that decides whether a lesson lands.
    expect(out.worldState).toBe(worldState);
    expect(out.refusals.map((r) => r.reason)).toEqual(['dormant']);
  });
});

describe('DARK BY CONSTRUCTION — the closure, amended for this car', () => {
  /** @param {string} dir @returns {string[]} */
  function jsFilesUnder(dir) {
    /** @type {string[]} */
    const out = [];
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, item.name);
      if (item.isDirectory()) out.push(...jsFilesUnder(full));
      else if (/\.(js|jsx|ts|tsx|mjs)$/.test(item.name)) out.push(full);
    }
    return out;
  }

  test('the ONLY src importers of the funnel family are this car\'s own leaves', () => {
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const importers = files
      .filter((file) => !/livedExperience(Funnel|Catalog|Sources)\.js$/.test(file))
      .filter((file) => /livedExperience/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    // L3's walker asserted NO importer and said a red here would be car L4's act.
    // This is that act, and the walker is TIGHTENED rather than loosened: the set is
    // pinned exactly, so a stray consumer still reds. The pulse call site is L5's.
    expect(importers).toEqual([]);
  });

/**
 * ⚠⚠ COMMENTS ARE STRIPPED BEFORE ANY CLOSURE SCAN, AMENDED BY CAR L5, AND IT IS A
 * SHARPENING RATHER THAN A LOOSENING. An IMPORT is a dependency; a CITATION is not.
 * L5's consumer seam is documented by name in the files that consume it — and in
 * `corruption.js`, whose comment says in as many words that it must NOT import it —
 * so a raw substring scan convicted three files for explaining themselves, and would
 * have paid for the closure claim by making the code less legible. Exactly L4's own
 * lesson one car earlier, when a substring ban on `simulationRules` had to become a
 * DEREFERENCE ban because the catalog cites its own proof.
 *
 * The claim is unchanged and is asserted on the CODE.
 * @param {string} text
 */
const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  test('⭐ NO PRODUCTION CALLER: nothing in src imports the sources or the known read', () => {
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    const importers = files
      .filter((file) => !/(livedExperienceSources|knownCharacter)\.js$/.test(file))
      .filter((file) => /livedExperienceSources|knownCharacter/.test(stripComments(readFileSync(file, 'utf8'))))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    expect(importers).toEqual([]);
  });

  test('⭐ AND THE STRIP DOES NOT BLIND IT — a planted import is still caught', () => {
    // The anti-vacuity control the strip owes: a scan that stopped seeing things
    // would report the same empty list forever.
    expect(stripComments("import { x } from './knownCharacter.js';")).toContain('knownCharacter');
    // anchored: the line above pins the SAME stripper returning a name out of real import syntax
    expect(stripComments('// a comment naming knownCharacter\nconst a = 1;')).not.toContain('knownCharacter');
    // anchored: same stripper, pinned live two lines above on a real import
    expect(stripComments('/** a block naming livedExperienceSources */\nconst a = 1;')).not.toContain('livedExperienceSources');
  });

  test('the sources leaf mints NO flag of its own and writes NO world state', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/domain/npc/livedExperienceSources.js'), 'utf8');
    // Asserted LIVE first, so the three exclusions below cannot pass on a path that
    // read back empty.
    expect(source).toContain('LIVED_EXPERIENCE_SOURCES');
    // The exclusion is on a DEREFERENCE, not on the word: this file cites
    // `simulationRules.js:499` in a comment as the evidence for a census
    // correction, and a plain substring ban would forbid citing one's own proof.
    // What it may never do is READ the rules — the one door is L2's, reached
    // through the funnel, so a second spelling of the gate is unrepresentable.
    // anchored: `source` is pinned above to carry the registry, so it is live
    expect(source).not.toMatch(/\.simulationRules|simulationRules\s*\[|simulationRules\s*\)/);
    // anchored: `source` is pinned above to carry the registry, so it is live
    expect(source).not.toContain('writeAxisDrift');
    // anchored: `source` is pinned above to carry the registry, so it is live
    expect(source).not.toContain('setCharacterDrift');
    // anchored: `source` is pinned above to carry the registry, so it is live
    expect(source).not.toContain('characterDriftActive');
  });
});
