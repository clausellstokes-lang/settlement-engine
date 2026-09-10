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
  ADAPTER_HOMED_ELSEWHERE,
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
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
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
    // ⭐ AMENDED AT THE SUBSTRATE COUPLING, AND THE AMENDMENT IS A SECOND COLUMN
    // RATHER THAN A LOOSER SUM. `faith_milieu` arrived receipted with its adapter
    // homed in `worldPulse/faithWitnessSource.js` (it needs `faithField.memberWeight`
    // and `piety`, neither of which belongs in an npc leaf). The claim is unchanged —
    // EVERY receipted kind has EXACTLY ONE adapter — but "exactly one" is now
    // partitioned across two rosters, and the partition is asserted DISJOINT and
    // TOTAL below, so a kind cannot hide by being counted in the other column.
    const owed = RECEIPTED_EXPERIENCE_KINDS.filter((kind) => kind !== SILENT_EXPERIENCE_KIND);
    const elsewhere = Object.keys(ADAPTER_HOMED_ELSEWHERE).sort();
    expect(ADAPTED_EXPERIENCE_KINDS.length + elsewhere.length).toBe(owed.length);
    expect([...ADAPTED_EXPERIENCE_KINDS, ...elsewhere].sort()).toEqual([...owed].sort());
    // DISJOINT: nothing may be claimed by both rosters.
    // anchored: the two lines directly above are a SUM and a SET EQUALITY over this same roster against a non-empty `owed`, so an emptied or re-keyed ADAPTED_EXPERIENCE_KINDS reds there before this exclusion is reached
    for (const kind of elsewhere) expect(ADAPTED_EXPERIENCE_KINDS, kind).not.toContain(kind);
    // …and the out-of-leaf column is SMALL and NAMED, so it cannot quietly become
    // the place adapters go to avoid being written.
    expect(elsewhere).toEqual(['faith_milieu', 'met_a_foreigner']);
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
      .filter((file) => dependsOnFunnelFamily(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    // L3's walker asserted NO importer and said a red here would be car L4's act.
    // This is that act, and the walker is TIGHTENED rather than loosened: the set is
    // pinned exactly, so a stray consumer still reds. The pulse call site is L5's.
    //
    // ⭐⭐ AND THE DETECTOR WAS CURED AT THE SUBSTRATE COUPLING — FOURTH SIGHTING OF
    // THIS FILE'S OWN LAW, AND THE CURE WAS ALREADY WRITTEN ELEVEN LINES BELOW. This
    // walker still used a RAW `/livedExperience/` substring over UNSTRIPPED source
    // while its sibling `consumesKnownRead` (same describe, same file) had already
    // been sharpened twice. When W-FAITH's stack arrived, `faithWitnessSource.js` was
    // convicted as an importer of this family on the strength of TWO COMMENT LINES
    // that say, in as many words, that the funnel is NOT in its tree. It imports
    // nothing from the family. The claim is unchanged; the detector now asks for an
    // import specifier or a dereference, exactly as its sibling does.
    //
    // AMENDED BY CAR L7 — the read model, which reads the funnel's order and band
    // words. It is a FAMILY MEMBER, not a production caller: nothing imports it, and
    // the drift family's own closure walker enrols it and asserts that. The set stays
    // exact, so the next namer still reds.
    // ⛔ ENC-3 WAS ADDED HERE AND THEN TAKEN BACK OUT, AND THE ROUND TRIP IS THE RECORD.
    // The encounters stage did briefly call `foldLivedExperience`, and this roster named
    // it as the funnel's first production caller. `characterDrift.test.js` STEP 2 (nothing
    // outside the family may name the funnel) convicts exactly that, and the conviction had
    // been INVISIBLE because STEP 1 was failing first — a red at an early assertion blinds
    // every later one in the same test. Ruled at §893: the stage DEFERS, producing the
    // funnel's intake shape and handing it to nobody, the way `faithWitnessSource.js` already
    // does. ⟦A20⟧/§882.1's reservation is therefore still UNCLAIMED and this roster is back
    // to one. The funnel still has NO production caller; the next namer still reds.
    expect(importers.sort()).toEqual([
      'src/domain/npc/characterReadModel.js',
    ]);
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

/**
 * ⚠⚠ AND THE SCAN IS SHARPENED A SECOND TIME AT THE SUBSTRATE COUPLING — THE THIRD
 * SIGHTING OF THIS FILE'S OWN LAW. L4 had to turn a substring ban on `simulationRules`
 * into a DEREFERENCE ban because the catalog cites its own proof; L5 had to strip
 * COMMENTS because three files were convicted for explaining themselves; and the
 * coupling convicted a FROZEN DATA ROSTER for naming the seam it is holding a place
 * for. `operationGrammar.js`'s acceptance roster records the module path and the
 * exported symbol of every seam the acceptance step reads — that is a CITATION in data,
 * exactly as the stripped comments were citations in prose, and it survived the strip
 * only because it is not a comment.
 *
 * ⭐ THE CLAIM IS UNCHANGED AND THE DETECTOR IS STRICTLY STRONGER. "Imports the known
 * read" now means an IMPORT SPECIFIER resolving to the module, or a DEREFERENCE of one
 * of its exported symbols — which catches an aliased import the substring scan would
 * also have caught AND a call the substring scan would have caught only by accident of
 * spelling. What it stops catching is a module PATH quoted as data, which was never a
 * dependency. Both halves are pinned by the control below, in both directions.
 *
 * ⛔⛔ AND SHARPENED A THIRD TIME AT THE W-OPS COUPLING — THIS ARM WAS THE ESTATE'S LAST
 * RAW CORNER, AND ITS OWN SIBLING HAD CARRIED THE CURE FOR A CAR ALREADY. `stripComments`
 * blanks comments and nothing else, so the symbol arm still read STRING LITERALS as code.
 * `envoyTaskCatalog.js` records, in the `structuralGuard` provenance string that justifies
 * its shape gate, that `characterAsSeenBy({viewer:'deity'})` returns a bare chart — and
 * this arm convicted it of CALLING the thing it was explaining it does not call. Fourth
 * time this file has paid the same tuition: L4's dereference ban, L5's comment strip, the
 * coupling's data-roster sighting, and now a receipt string.
 *
 * ⭐ THE CLAIM IS UNCHANGED AND THE SPLIT IS THE SIBLING'S, EXACTLY. The MODULE arm is
 * asked BEFORE strings are blanked — an import specifier IS a string literal, and blanking
 * it would blind that half — and the SYMBOL arm is asked AFTER, over
 * `codeWithoutCitations`. `dependsOnFunnelFamily` below has been built this way since the
 * sixth-sighting cure; this arm now matches it line for line.
 * @param {string} text
 */
const consumesKnownRead = (/** @type {string} */ text) => {
  const code = stripComments(text);
  return /from\s+'[^']*\/(livedExperienceSources|knownCharacter)\.js'/.test(code)
    || /\b(knownCharacterOf|characterAsSeenBy|LIVED_EXPERIENCE_SOURCES)\s*[(.]/
      .test(codeWithoutCitations(text));
};

/**
 * ⛔⛔ THE SYMBOLS THE DEREFERENCE ARM MAY NAME MUST BE UNIQUE IN `src/`, AND THAT IS
 * A TRAP THE SHARPENED DETECTOR INVENTED FOR ITSELF — IT ONLY BECOMES VISIBLE ONCE
 * TWO LINES SHARE A TREE.
 *
 * The estate's cure for a substring detector has been "ask for an import specifier or
 * a DEREFERENCE of an exported symbol". That is strictly stronger than a name scan —
 * but a dereference arm keyed on a symbol TWO modules export convicts whichever file
 * uses the other one's. Measured on this coupled tree: `AMBIENT_CADENCE_TICKS` is
 * exported by both `livedExperienceFunnel.js` and `faithWitnessSource.js`,
 * `AXIS_LEVELS` by both `characterDrift.js` and `paradigmAxisCatalog.js`, and
 * `PULL_BANDS` by three files. A detector naming any of those three would report the
 * wrong file with total confidence.
 *
 * So the roster below is deliberately narrow, and the control at the foot of this
 * describe PROVES each entry is exported by exactly ONE file under `src/`. A future
 * car that duplicates one of these names reds the control rather than silently
 * poisoning the closure.
 */
const FUNNEL_FAMILY_SYMBOLS = Object.freeze([
  'EXPERIENCE_TABLE', 'LIVED_EXPERIENCE_KINDS', 'AMBIENT_EXPERIENCE_KINDS',
  'experienceKindOf', 'experienceRowOf',
  'foldLivedExperience', 'effectiveChartOf', 'decayCharacterDrift', 'characterLegacyRecord',
  'collectLivedExperience', 'LIVED_EXPERIENCE_SOURCES', 'SOURCE_ADAPTER_OF',
]);

/**
 * Does this source really DEPEND on the funnel family, as opposed to talking about it?
 * Import specifier resolving to one of the three leaves, or a dereference of one of
 * their uniquely-owned exports, over comment-stripped code.
 * @param {string} text
 */

/**
 * ⛔⛔⛔ AND A SYMBOL INSIDE A STRING LITERAL IS A CITATION TOO — THE SIXTH SIGHTING
 * OF THIS ESTATE'S LAW, AND IT CONVICTED THE VERY CAR THAT WROTE THE CURE.
 *
 * The dereference arm above was added to catch an aliased import plus a call. On its
 * first run it convicted `livedExperienceCatalog.js` of depending on the witness
 * adapter — on the strength of the RECEIPT STRING that names it:
 * `'faithWitnessSource.js:faithWitnessEntries (religionState pantheon ...)'`. A quoted
 * name followed by a space and a paren is indistinguishable from a call to a scanner
 * that only strips comments.
 *
 * ⭐ THE GENERALISATION, and it is the one this whole family has been converging on:
 * COMMENTS AND STRING LITERALS ARE BOTH CITATIONS. Only two things are dependencies —
 * an import specifier, and a dereference in CODE. So the module arm is asked BEFORE
 * strings are blanked (an import specifier IS a string literal), and the symbol arm is
 * asked AFTER. Ban lists, seam-name constants, `home:` paths and receipt strings all
 * fall out of the detector at once, because they were always the same shape.
 * @param {string} text
 */
const codeWithoutCitations = (text) => stripComments(text)
  .replace(/'(?:[^'\\]|\\.)*'/g, "''")
  .replace(/"(?:[^"\\]|\\.)*"/g, '""')
  .replace(/`(?:[^`\\]|\\.)*`/g, '``');

const dependsOnFunnelFamily = (/** @type {string} */ text) => (
  /from\s+'[^']*\/livedExperience(Funnel|Catalog|Sources)\.js'/.test(stripComments(text))
    || new RegExp(`\\b(${FUNNEL_FAMILY_SYMBOLS.join('|')})\\s*[([.]`).test(codeWithoutCitations(text))
);

  test('⭐ NO PRODUCTION CALLER: the known read is reachable from NOTHING, over two steps', () => {
    // ⚠ AMENDED BY CAR L7, AND IT IS A NARROWING, SO IT IS PROVED IN TWO STEPS
    // INSTEAD OF ONE RATHER THAN QUIETLY WIDENED. "Nothing in src names the known
    // read" stopped being true the moment the read model routed the dossier through
    // `characterAsSeenBy` — which is the point of that seam, and pretending otherwise
    // would be the substring-ban mistake car L4 paid for and car L5 paid for again.
    //
    // The load-bearing claim was never "no file names it". It is that NO PRODUCTION
    // PATH REACHES IT. So:
    //   STEP 1 — exactly one non-family file may name it, and it is the read model;
    //   STEP 2 — and the read model is itself imported by NOBODY, so the path that
    //            step 1 admits terminates immediately and reaches no production code.
    const READ_MODEL = 'src/domain/npc/characterReadModel.js';
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const importers = files
      .filter((file) => !/(livedExperienceSources|knownCharacter)\.js$/.test(file))
      .filter((file) => consumesKnownRead(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    expect(importers.sort()).toEqual([READ_MODEL]);
    // STEP 2 — the closure. If a surface ever wires the dossier, this is what reds,
    // and it should: somebody has to mean it.
    const readModelImporters = files
      .filter((file) => !/characterReadModel\.js$/.test(file))
      .filter((file) => /characterReadModel/.test(stripComments(readFileSync(file, 'utf8'))))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    expect(readModelImporters).toEqual([]);
    // anchored: the read model really is present, so the closure is over a real file
    // rather than passing because the name matches nothing.
    expect(files.some((file) => file.endsWith('characterReadModel.js'))).toBe(true);
  });

  test('⭐ AND THE SHARPENED SCAN DOES NOT BLIND IT — every real reach is still caught', () => {
    // The anti-vacuity control the sharpening owes, in BOTH directions. A scan that
    // stopped seeing things would report the same empty list forever, and a scan that
    // still convicted citations would have bought the closure claim with legibility.
    expect(consumesKnownRead("import { x } from './knownCharacter.js';")).toBe(true);
    expect(consumesKnownRead("import { y } from '../npc/livedExperienceSources.js';")).toBe(true);
    // AN ALIASED IMPORT PLUS A CALL — the reach a path-only scan could miss.
    expect(consumesKnownRead('const r = knownCharacterOf({ npc });')).toBe(true);
    expect(consumesKnownRead('const c = characterAsSeenBy({ viewer });')).toBe(true);
    expect(consumesKnownRead('const s = LIVED_EXPERIENCE_SOURCES.length;')).toBe(true);
    // AND THE TWO CITATIONS THAT ARE NOT DEPENDENCIES.
    expect(consumesKnownRead('// a comment naming knownCharacterOf(x)\nconst a = 1;')).toBe(false);
    expect(consumesKnownRead("const row = { home: 'src/domain/npc/knownCharacter.js' };")).toBe(false);
    // ⛔ AND THE STRING-LITERAL CITATION WITH CALL SHAPE — the third sharpening's own
    // offender, in miniature. `envoyTaskCatalog.js` was convicted of CALLING
    // `characterAsSeenBy` by the provenance string that explains it does not. A quoted
    // symbol followed by a paren is indistinguishable from a call to a stripper that
    // only blanks comments, so this line reds if the symbol arm ever goes back to raw.
    expect(consumesKnownRead("const g = 'a chart from characterAsSeenBy({viewer}) carries neither';")).toBe(false);
    expect(consumesKnownRead("const r = 'knownCharacter.js:knownCharacterOf (the bare chart)';")).toBe(false);
    // anchored: the same predicate is pinned TRUE five lines above on real import syntax
    expect(stripComments("import { x } from './knownCharacter.js';")).toContain('knownCharacter');
    // anchored: the line above pins the SAME stripper returning a name out of real import syntax
    expect(stripComments('// a comment naming knownCharacter\nconst a = 1;')).not.toContain('knownCharacter');
    // anchored: same stripper, pinned live two lines above on a real import
    expect(stripComments('/** a block naming livedExperienceSources */\nconst a = 1;')).not.toContain('livedExperienceSources');
  });

  test('⭐⭐ THE FUNNEL-FAMILY DETECTOR IS ANTI-VACUOUS IN BOTH DIRECTIONS TOO', () => {
    // The same control the known-read scan owes, owed again by the arm the coupling
    // sharpened. Without it the closure could report an empty list forever.
    expect(dependsOnFunnelFamily("import { x } from './livedExperienceCatalog.js';")).toBe(true);
    expect(dependsOnFunnelFamily("import { y } from '../npc/livedExperienceFunnel.js';")).toBe(true);
    expect(dependsOnFunnelFamily("import { z } from '../npc/livedExperienceSources.js';")).toBe(true);
    // AN ALIASED IMPORT PLUS A USE — the reach a path-only scan misses.
    expect(dependsOnFunnelFamily('const r = foldLivedExperience({ entries });')).toBe(true);
    expect(dependsOnFunnelFamily('const n = LIVED_EXPERIENCE_KINDS.length;')).toBe(true);
    expect(dependsOnFunnelFamily('const row = EXPERIENCE_TABLE[kind];')).toBe(true);
    // AND THE CITATIONS THAT ARE NOT DEPENDENCIES — the two shapes that actually
    // reached this walker: a header comment naming the family, and a module path
    // quoted as data.
    expect(dependsOnFunnelFamily('// foldLivedExperience lives on the other stack\nconst a = 1;')).toBe(false);
    expect(dependsOnFunnelFamily('/** MIRRORED from livedExperienceCatalog PULL_BANDS */\nconst a = 1;')).toBe(false);
    expect(dependsOnFunnelFamily("const row = { home: 'src/domain/npc/livedExperienceFunnel.js' };")).toBe(false);
    // ⛔ AND THE STRING-LITERAL CITATION — the shape that convicted the catalog on
    // this car's first run, off its own `faith_milieu` receipt.
    expect(dependsOnFunnelFamily("const receipt = 'faithWitnessSource.js:faithWitnessEntries (pantheon x dwell)';")).toBe(false);
    expect(dependsOnFunnelFamily("const r = 'livedExperienceFunnel.js:foldLivedExperience (the door)';")).toBe(false);
  });

  test('⛔⛔ EVERY DEREFERENCE SYMBOL IS EXPORTED BY EXACTLY ONE src FILE — the trap the sharpening invented', () => {
    // A dereference arm keyed on a name TWO modules export convicts the wrong file
    // with total confidence, and this only becomes reachable once two lines share a
    // tree. Measured here rather than trusted.
    // ⚠ READ EACH FILE ONCE. The first cut re-read all of `src/` PER SYMBOL and
    // timed out at 20s — an O(files x symbols) walk dressed as a one-line helper.
    const texts = jsFilesUnder(join(REPO_ROOT, 'src'))
      .map((file) => [relative(REPO_ROOT, file).replace(/\\/g, '/'), readFileSync(file, 'utf8')]);
    /** @param {string} symbol */
    const exportersOf = (symbol) => texts
      .filter(([, text]) => new RegExp(`^export (const|function) ${symbol}\\b`, 'm').test(text))
      .map(([rel]) => rel);
    for (const symbol of FUNNEL_FAMILY_SYMBOLS) {
      expect(exportersOf(symbol), `${symbol} must be owned by exactly one module`).toHaveLength(1);
    }
    // ⭐ ANCHORED, AND THE ANCHOR IS THE FINDING: three names on this tree really do
    // have two or three owners, so the check above is discriminating rather than
    // trivially satisfiable. These are exactly the names the roster refuses.
    expect(exportersOf('AXIS_LEVELS').length).toBeGreaterThan(1);
    expect(exportersOf('PULL_BANDS').length).toBeGreaterThan(1);
    expect(exportersOf('AMBIENT_CADENCE_TICKS').length).toBeGreaterThan(1);
    // ⚠ THE EXPORTER COUNTS ABOVE ANCHOR THE TREE, NOT THE ROSTER — and the `for` loop over
    // FUNNEL_FAMILY_SYMBOLS would pass VACUOUSLY on an empty one. `foldLivedExperience` is
    // the roster's own anchor: the funnel's entry point must still be enrolled, or these
    // three refusals are refusals from nothing.
    for (const banned of ['AXIS_LEVELS', 'PULL_BANDS', 'AMBIENT_CADENCE_TICKS']) {
      expectAbsentWithAnchor(FUNNEL_FAMILY_SYMBOLS, banned, 'foldLivedExperience', 'the shared-name refusals');
    }
  });

  test('⛔ THE OUT-OF-LEAF ADAPTER MAP RESOLVES AGAINST THE LIVE TREE, symbol and all', () => {
    // `ADAPTER_HOMED_ELSEWHERE` is a CITATION held as data — this leaf imports
    // nothing new for it. A citation that nobody resolves is how a roster starts
    // naming things that do not exist (the coupling has now seen that twice), so it
    // is resolved here: the module must be on the tree and must really declare the
    // symbol. Matched with the declaration's own OPEN PAREN, because
    // `export function fooBar(` CONTAINS `export function foo` — the prefix hole car
    // 1 found inside its own cure.
    const entries = Object.entries(ADAPTER_HOMED_ELSEWHERE);
    expect(entries.length).toBeGreaterThan(0);
    for (const [kind, home] of entries) {
      const [modulePath, symbol] = home.split('#');
      expect(symbol, `${kind} must name a symbol, not just a module`).toBeTruthy();
      const source = readFileSync(join(REPO_ROOT, modulePath), 'utf8');
      expect(source.includes(`export function ${symbol}(`), `${modulePath} must export ${symbol}`).toBe(true);
      // …and the kind it claims is really the kind that module emits.
      expect(source).toContain(`'${kind}'`);
    }
    // ANTI-PREFIX CONTROL, pinned live against the real declaration.
    const witness = readFileSync(join(REPO_ROOT, 'src/domain/worldPulse/faithWitnessSource.js'), 'utf8');
    expect(witness.includes('export function faithWitnessEntries(')).toBe(true);
    expect(witness.includes('export function faithWitnessEntr(')).toBe(false);
    // AND THE MAP IS A DEBT, NOT A PARKING SPACE: every kind in it carries a receipt
    // (an unreceipted kind is refused by the funnel and needs no adapter at all).
    for (const kind of Object.keys(ADAPTER_HOMED_ELSEWHERE)) {
      expect(RECEIPTED_EXPERIENCE_KINDS, kind).toContain(kind);
      expect(SOURCE_ADAPTER_OF[kind], `${kind} may not be registered in both places`).toBeUndefined();
    }
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
