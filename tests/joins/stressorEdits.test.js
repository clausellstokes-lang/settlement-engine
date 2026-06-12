/**
 * Join harness — config.stressorEdits: the editor's stressor events survive
 * regeneration.
 *
 * The seam: APPLY_STRESSOR writes the stress ENTRY into the live container
 * (stress/stressors) — but the container is a derivation OUTPUT. A full
 * regeneration (applyChange) rebuilds the pipeline input from the raw
 * _config and re-rolls the stress container wholesale (probabilistic mode
 * re-rolls, forced modes re-mint from selectedStresses/stressType) — so the
 * authored stressor vanished on the first applyChange while its promoted
 * condition survived via config.eventConditions: the dossier showed a crisis
 * with no stressor behind it. The inverse hole was worse: RESOLVE_STRESSOR
 * removed the entry and eased the condition, but a CONFIG-FORCED stressor
 * re-rolled on every regeneration — once the eased record expired, the next
 * regeneration re-minted a fresh GENERATION condition and the crisis the DM
 * resolved came back from the dead. config.stressorEdits is the authored
 * delta record that closes both halves (resourceEdits' architecture):
 *
 *   { added }    full stress entries authored by APPLY_STRESSOR — re-applied
 *                verbatim by resolveStress's post-roll overlay (upsert by
 *                type: authored beats generation);
 *   { resolved } stressor types RESOLVE_STRESSOR ended — a suppression list,
 *                so the resolved crisis stays resolved against the same-seed
 *                re-roll.
 *
 * The events dual-write stressorEdits to config + _config (the
 * customTradeGoods discipline) and the overlay consumes NO rng, so a config
 * without edits generates byte-identically and the key must NOT be in
 * DERIVED_CONFIG_KEYS. Custom authored types ride the container only —
 * config.stressTypes stays catalog vocabulary (and stressConfirmPass's
 * re-weighting, which indexes STRESS_TYPE_MAP directly, treats authored
 * types as forced so it neither drops nor throws on them).
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { withOrganicStressorResolution } from '../../src/domain/worldPulse/stressorAftermath.js';
import { canonStressors } from '../../src/domain/canonicalAccessors.js';
import {
  withTickedConditionDurations,
  withExpiredConditionsRemoved,
} from '../../src/domain/activeConditions.js';
import {
  stripDerivedConfigKeys,
  DERIVED_CONFIG_KEYS,
} from '../../src/store/settlementSlice.js';

const NOW = '2026-06-11T00:00:00.000Z';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Probed shape for this seed: BASE_CFG rolls NO stressors and NO
// activeConditions — every stressor in these round trips is event-authored.
const SEED = 'ec-rt-1';

const FAMINE_CFG = {
  ...BASE_CFG,
  selectedStressesRandom: false,
  selectedStresses: ['famine'],
};
// Probed: this seed + forced famine generates the single famine stressor as
// a bare OBJECT dual-written under stress + stressors (same reference), with
// ONE GENERATION-stamped famine condition (severity 0.65, expires at 10).
const FAMINE_SEED = 'ec-famine-1';

// Probed: BASE_CFG + this seed ORGANICALLY rolls monster_pressure (bare
// object container) and promotes the war_pressure condition — the hardest
// resolution case: the same seed re-rolls that exact stressor back.
const ORG_SEED = 'org-7';

const SIEGE_CFG = {
  ...BASE_CFG,
  selectedStressesRandom: false,
  selectedStresses: ['under_siege'],
};
// Probed: this seed + forced siege generates the single under_siege stressor
// (bare object dual-write) with ONE GENERATION-stamped war_pressure condition.
const SIEGE_SEED = 'ec-siege-1';

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

const ev = (type, overrides = {}) => ({
  id: `ev_${type.toLowerCase()}`,
  type,
  targetId: '',
  payload: {},
  cause: 'player_action',
  ...overrides,
});

function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

const mutate = (settlement, event) =>
  mutateSettlement({ settlement: deepFreeze(settlement), event, now: NOW });

const condOf = (s, archetype) =>
  (s.activeConditions || []).filter(c => c.archetype === archetype);

const stressorOf = (s, type) =>
  canonStressors(s).filter(st => String(st?.type || '').toLowerCase() === type);

const onsetEv = (type, overrides = {}) => ev('APPLY_STRESSOR', {
  id: `ev-onset-${type}`, targetId: type,
  payload: { stressorType: type, label: type, severity: 0.9 },
  ...overrides,
});

describe('join: APPLY_STRESSOR survives a full regeneration (the reported bug)', () => {
  test('authored famine → regenerate → the stressor entry is back behind the condition', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(canonStressors(s1)).toEqual([]);

    const authored = mutate(s1, ev('APPLY_STRESSOR', {
      id: 'ev-onset', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.9 },
    }));
    expect(stressorOf(authored, 'famine')).toHaveLength(1);
    // The authored record lands in BOTH config formats (the dual-write
    // discipline — applyChange regenerates from the raw _config first).
    expect(authored.config.stressorEdits.added).toHaveLength(1);
    expect(authored.config.stressorEdits.added[0].type).toBe('famine');
    expect(authored._config.stressorEdits).toEqual(authored.config.stressorEdits);

    // Full regeneration, exactly as applyChange rebuilds its input. Before
    // the seam, the entry vanished here while the condition survived via
    // config.eventConditions — the dossier showed a crisis with no stressor.
    const s2 = gen(buildNextConfig(authored), SEED);
    const carried = stressorOf(s2, 'famine');
    expect(carried).toHaveLength(1);
    expect(carried[0].severity).toBe(0.9);
    expect(carried[0].source).toBe('event');
    expect(carried[0].addedByEventId).toBe('ev-onset');
    // …and the condition still sits beside it, event-stamped.
    const famines = condOf(s2, 'famine');
    expect(famines).toHaveLength(1);
    expect(famines[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
    // A CATALOG type threads into the stressType/stressTypes channel so the
    // regenerated economy/institutions/narratives react to the crisis.
    expect(s2.config.stressTypes).toContain('famine');

    // The record survives into the next generation's raw config — chained
    // what-ifs keep working.
    expect(s2._config.stressorEdits.added).toHaveLength(1);
    const s3 = gen(buildNextConfig(s2), SEED);
    expect(stressorOf(s3, 'famine')).toHaveLength(1);
  });

  test('a CUSTOM stressor rides the container but stays out of the stressTypes channel', () => {
    const s1 = gen(BASE_CFG, SEED);
    const authored = mutate(s1, ev('APPLY_STRESSOR', {
      id: 'ev-dragon', targetId: 'dragon_tax',
      payload: { stressorType: 'dragon_tax', label: 'Dragon Tax', severity: 0.6, isCustom: true },
    }));

    // This regeneration also pins stressConfirmPass's forced-set guard: the
    // re-applied custom entry reaches the confirm pass, which indexes
    // STRESS_TYPE_MAP — without the authored types in its forced set this
    // line THREW (no catalog row for dragon_tax).
    const s2 = gen(buildNextConfig(authored), SEED);
    const carried = stressorOf(s2, 'dragon_tax');
    expect(carried).toHaveLength(1);
    expect(carried[0].isCustom).toBe(true);
    // Catalog vocabulary only — every stressTypes consumer compares against
    // STRESS_TYPE_MAP keys, exactly as on the live settlement.
    expect(s2.config.stressTypes || []).not.toContain('dragon_tax');
    expect(condOf(s2, 'custom_crisis')).toHaveLength(1);
  });
});

describe('join: resolving a CONFIG-FORCED stressor sticks across regenerations (the resurrection bug)', () => {
  test('resolve → regenerate → the forced stressor stays suppressed; the eased condition carries', () => {
    const f1 = gen(FAMINE_CFG, FAMINE_SEED);
    expect(stressorOf(f1, 'famine')).toHaveLength(1);

    const resolved = mutate(f1, ev('RESOLVE_STRESSOR', { id: 'ev-end', targetId: 'famine' }));
    expect(resolved.stress).toBeNull();
    expect(resolved.config.stressorEdits.resolved).toEqual(['famine']);
    expect(resolved._config.stressorEdits.resolved).toEqual(['famine']);

    // The regeneration re-mints the forced famine from selectedStresses —
    // the suppression list is what keeps it gone.
    const s2 = gen(buildNextConfig(resolved), FAMINE_SEED);
    expect(stressorOf(s2, 'famine')).toEqual([]);
    expect(s2.config.stressTypes).toEqual([]);
    const famines = condOf(s2, 'famine');
    expect(famines).toHaveLength(1);
    expect(famines[0].status).toBe('easing');
  });

  test('the eased record expires → the NEXT regeneration does NOT re-mint a fresh GENERATION famine', () => {
    const f1 = gen(FAMINE_CFG, FAMINE_SEED);
    const resolved = mutate(f1, ev('RESOLVE_STRESSOR', { id: 'ev-end', targetId: 'famine' }));
    const s2 = gen(buildNextConfig(resolved), FAMINE_SEED);

    // Age past the wind-down's ~2-tick trail-off; the expiry clears the
    // eventConditions record (pinned in eventConditions.test.js). Before the
    // suppression list, THIS was the resurrection: with the record gone, the
    // re-rolled forced famine re-promoted a fresh GENERATION condition on
    // the next what-if.
    const aged = withTickedConditionDurations(s2, 'one_year');
    const { settlement: cleared, expired } = withExpiredConditionsRemoved(aged);
    expect(expired.some(c => c.archetype === 'famine')).toBe(true);
    expect(cleared.config.eventConditions).toEqual([]);

    const s3 = gen(buildNextConfig(cleared), FAMINE_SEED);
    expect(condOf(s3, 'famine')).toEqual([]);
    expect(stressorOf(s3, 'famine')).toEqual([]);
  });

  test('an ORGANICALLY-rolled stressor stays resolved against the same-seed re-roll', () => {
    const o1 = gen(BASE_CFG, ORG_SEED);
    expect(stressorOf(o1, 'monster_pressure')).toHaveLength(1);
    expect(condOf(o1, 'war_pressure')).toHaveLength(1);

    const resolved = mutate(o1, ev('RESOLVE_STRESSOR', { id: 'ev-org-end', targetId: 'monster_pressure' }));
    expect(resolved.config.stressorEdits.resolved).toEqual(['monster_pressure']);

    const s2 = gen(buildNextConfig(resolved), ORG_SEED);
    expect(stressorOf(s2, 'monster_pressure')).toEqual([]);
    const carried = condOf(s2, 'war_pressure');
    expect(carried).toHaveLength(1);
    expect(carried[0].status).toBe('easing');
    expect(carried[0].causes.some(c => c.eventId === 'ev-org-end')).toBe(true);
  });

  test('re-authoring after a resolve revives the crisis — the lists keep agreeing', () => {
    const f1 = gen(FAMINE_CFG, FAMINE_SEED);
    const resolved = mutate(f1, ev('RESOLVE_STRESSOR', { id: 'ev-end', targetId: 'famine' }));

    const reauthored = mutate(resolved, ev('APPLY_STRESSOR', {
      id: 'ev-again', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.8 },
    }));
    // The APPLY cleared the suppression and recorded the new onset.
    expect(reauthored.config.stressorEdits.resolved).toEqual([]);
    expect(reauthored.config.stressorEdits.added).toHaveLength(1);

    const s2 = gen(buildNextConfig(reauthored), FAMINE_SEED);
    const carried = stressorOf(s2, 'famine');
    expect(carried).toHaveLength(1);
    expect(carried[0].severity).toBe(0.8);
    const famines = condOf(s2, 'famine');
    expect(famines).toHaveLength(1);
    expect(famines[0].triggeredAt.sourceEventType).toBe('APPLY_STRESSOR');
  });

  test('resolve AFTER the regeneration — the re-applied authored entry is still resolvable', () => {
    const s1 = gen(BASE_CFG, SEED);
    const s2 = gen(buildNextConfig(mutate(s1, onsetEv('famine', { id: 'ev-onset' }))), SEED);
    expect(stressorOf(s2, 'famine')).toHaveLength(1);

    const resolved = mutate(s2, ev('RESOLVE_STRESSOR', { id: 'ev-late-end', targetId: 'famine' }));
    // The resolve struck the added record AND suppressed the type, so the
    // NEXT regeneration carries neither entry nor a fresh crisis.
    expect(resolved.config.stressorEdits.added).toEqual([]);
    expect(resolved.config.stressorEdits.resolved).toEqual(['famine']);

    const s3 = gen(buildNextConfig(resolved), SEED);
    expect(stressorOf(s3, 'famine')).toEqual([]);
    expect(condOf(s3, 'famine')[0].status).toBe('easing');
  });

  test('an ENTRY-LESS organic wind-down suppresses the gen-vocabulary re-mint (a siege twin ends under_siege)', () => {
    // The vocabulary seam: the twin roams as 'siege' (pulse vocabulary) while
    // the config-forced re-roll mints 'under_siege' (generation vocabulary).
    // With a live entry, removed.type carries the gen key into the record —
    // but on a legacy save whose entry was re-rolled away before
    // config.stressorEdits existed, the wind-down used to record only
    // candidates[0] ('siege'), and the forced crisis re-minted on the next
    // regeneration despite the world ending it. The record now spans every
    // candidate alias.
    const s1 = gen(SIEGE_CFG, SIEGE_SEED);
    expect(stressorOf(s1, 'under_siege')).toHaveLength(1);
    expect(condOf(s1, 'war_pressure')).toHaveLength(1);

    // The legacy entry-less shape: containers re-rolled away, condition live.
    const entryless = { ...s1, stress: null, stressors: null };
    const resolved = withOrganicStressorResolution(entryless, [{
      id: 'world_stressor.siege.a', type: 'siege', label: 'Under Siege',
      status: 'resolved', severity: 0.05,
      originSettlementId: 'a', affectedSettlementIds: ['a'],
    }], 'a');
    expect(resolved).not.toBe(entryless);
    expect(condOf(resolved, 'war_pressure')[0].status).toBe('easing');
    // BOTH vocabularies land in the suppression list — the pulse type the
    // twin roamed under AND the gen key the re-roll would mint.
    expect(resolved.config.stressorEdits.resolved).toEqual(['siege', 'under_siege']);
    expect(resolved._config.stressorEdits).toEqual(resolved.config.stressorEdits);

    const s2 = gen(buildNextConfig(resolved), SIEGE_SEED);
    expect(stressorOf(s2, 'under_siege')).toEqual([]);
    expect(condOf(s2, 'war_pressure')).toEqual([]);
    expect(s2.config.stressTypes).toEqual([]);
  });
});

describe('join: the authored upsert beats the generated twin entry', () => {
  test('authoring the type generation also rolled keeps ONE entry at the authored severity', () => {
    const f1 = gen(FAMINE_CFG, FAMINE_SEED);
    const generated = stressorOf(f1, 'famine')[0];
    expect(generated.colour).toBeTruthy(); // catalog cosmetics on the rolled entry

    const authored = mutate(f1, ev('APPLY_STRESSOR', {
      id: 'ev-up', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.9 },
    }));
    // Live upsert: one entry, authored severity, rolled cosmetics preserved.
    expect(stressorOf(authored, 'famine')).toHaveLength(1);
    expect(stressorOf(authored, 'famine')[0].severity).toBe(0.9);
    expect(stressorOf(authored, 'famine')[0].colour).toBe(generated.colour);

    // The regeneration re-rolls the forced famine; the overlay upserts the
    // authored record over it — never a duplicate pair.
    const s2 = gen(buildNextConfig(authored), FAMINE_SEED);
    const carried = stressorOf(s2, 'famine');
    expect(carried).toHaveLength(1);
    expect(carried[0].severity).toBe(0.9);
    expect(carried[0].source).toBe('event');
    expect(carried[0].colour).toBe(generated.colour);
  });
});

describe('join: the bare-object container clobber is fixed', () => {
  test('authoring a SECOND stressor beside a generated bare-object single keeps both, in both keys', () => {
    const f1 = gen(FAMINE_CFG, FAMINE_SEED);
    // The pipeline's single-stressor shape: one bare object, dual-written.
    expect(Array.isArray(f1.stress)).toBe(false);
    expect(f1.stress).toBe(f1.stressors);

    const next = mutate(f1, ev('APPLY_STRESSOR', {
      id: 'ev-siege', targetId: 'under_siege',
      payload: { stressorType: 'under_siege', label: 'Under siege', severity: 0.6 },
    }));
    // The old `|| 'stress'` fallback wrote a fresh one-entry array over the
    // bare object (losing the famine) and left the stale twin in stressors.
    expect(Array.isArray(next.stress)).toBe(true);
    expect(next.stress.map(st => st.type).sort()).toEqual(['famine', 'under_siege']);
    expect(next.stressors).toEqual(next.stress);
  });

  test('a JSON round-trip breaks the dual-write aliasing — APPLY still upserts ONE entry per key', () => {
    // Save/load: the same bare object becomes two content-identical twins.
    const f1 = JSON.parse(JSON.stringify(gen(FAMINE_CFG, FAMINE_SEED)));
    expect(f1.stress).not.toBe(f1.stressors);
    expect(f1.stress).toEqual(f1.stressors);

    // A NEW type beside the round-tripped single: reference dedupe lifted
    // BOTH famine twins into the working list, writing a duplicate famine
    // to both keys. Content-identity dedupe keeps exactly one per type.
    const next = mutate(f1, ev('APPLY_STRESSOR', {
      id: 'ev-siege', targetId: 'under_siege',
      payload: { stressorType: 'under_siege', label: 'Under siege', severity: 0.6 },
    }));
    for (const key of ['stress', 'stressors']) {
      expect(next[key].map(st => st.type).sort()).toEqual(['famine', 'under_siege']);
    }

    // Re-authoring the SAME type upserts the first twin and must not keep
    // the stale second one beside it.
    const reauthored = mutate(f1, ev('APPLY_STRESSOR', {
      id: 'ev-up', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.9 },
    }));
    for (const key of ['stress', 'stressors']) {
      expect(reauthored[key].map(st => st.type)).toEqual(['famine']);
      expect(reauthored[key][0].severity).toBe(0.9);
    }
  });

  test('…and RESOLVE clears the entry from EVERY container key, not just the first', () => {
    const f1 = JSON.parse(JSON.stringify(gen(FAMINE_CFG, FAMINE_SEED)));
    const next = mutate(f1, ev('APPLY_STRESSOR', {
      id: 'ev-siege', targetId: 'under_siege',
      payload: { stressorType: 'under_siege', label: 'Under siege', severity: 0.6 },
    }));
    // Round-trip AGAIN so stress and stressors are separate arrays — the old
    // resolve filtered only the first array key and left the other stale.
    const saved = JSON.parse(JSON.stringify(next));
    expect(saved.stress).not.toBe(saved.stressors);

    const resolved = mutate(saved, ev('RESOLVE_STRESSOR', { id: 'ev-lift', targetId: 'under_siege' }));
    for (const key of ['stress', 'stressors']) {
      expect(resolved[key].map(st => st.type)).toEqual(['famine']);
    }

    // The round-tripped bare-object shape resolves everywhere too (the
    // matchesEntry object path already cleared every key by content).
    const objResolved = mutate(f1, ev('RESOLVE_STRESSOR', { id: 'ev-end', targetId: 'famine' }));
    expect(objResolved.stress).toBeNull();
    expect(objResolved.stressors).toBeNull();
  });
});

describe('join: the overlay consumes no rng and the slice strip never eats the key', () => {
  test('a config with EMPTY stressorEdits generates byte-identically to one without', () => {
    const plain = gen(BASE_CFG, SEED);
    const withEmpty = gen({
      ...BASE_CFG,
      stressorEdits: { added: [], resolved: [] },
    }, SEED);

    // The only permitted difference is the stressorEdits key itself riding
    // through config/_config — everything derived must be byte-identical.
    const scrub = (s) => {
      const clone = JSON.parse(JSON.stringify(s));
      delete clone.config.stressorEdits;
      delete clone._config.stressorEdits;
      return clone;
    };
    expect(scrub(withEmpty)).toEqual(scrub(plain));
  });

  test('stripDerivedConfigKeys preserves stressorEdits (it is user input, not derived)', () => {
    expect(DERIVED_CONFIG_KEYS).not.toContain('stressorEdits');
    const stripped = stripDerivedConfigKeys({
      stressType: 'plague',
      stressorEdits: { added: [], resolved: ['famine'] },
    });
    expect(stripped.stressType).toBeUndefined();
    expect(stripped.stressorEdits).toEqual({ added: [], resolved: ['famine'] });
  });
});
