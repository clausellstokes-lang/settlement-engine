/**
 * checkpointRestoreParity.test.js — SK-2B's proof surface (sk-a; ODQ §141.2, §143.5, §149.3).
 *
 * ⛔⛔ SK.U1 WAS THE FAMILY'S SINGLE LARGEST UNKNOWN, AND IT SETTLED AS A REAL DEFECT.
 * Executed at this base, a year-boundary realm carries `undefined`-valued keys — 146 of
 * them across twelve distinct paths — and `JSON.stringify` drops every one. The composite
 * hash cannot see it, because the hash is itself stringify-based. A restore proof that
 * compared hashes would have been green and meaningless.
 *
 * ⭐ THE COMPILE'S SIGNED FORK ASSUMED THE CURE NEEDED AN ENGINE-SIDE SEAM. It did not:
 * the census already knows the paths, so the writer records them and the reader re-plants
 * them. The thing is made true rather than the instrument made blind — which is the
 * distinction between this and the self-referential pin class (normalizing BOTH sides
 * through a lossy round trip so the comparison passes). The census still runs at full
 * strength AFTER the replant, and the arms below fail if the replant becomes a no-op.
 *
 * ⚠ THE EXECUTED TWO-YEAR PROBE ITSELF IS NOT HERE. §145.2 forbids a soak in a test
 * suite; the probe runs at the train's terminal and its output is quoted in the lane
 * receipt, per the chair's §149.3 ruling. What IS here is every rule the probe relies on.
 */

import { describe, expect, it } from 'vitest';

import {
  CHECKPOINT_CADENCE_BANDS,
  checkpointBudget,
  checkpointCadence,
  checkpointFileName,
  restoreInvocation,
} from '../../scripts/soak/checkpoint.mjs';
import { buildCapsule, capsuleId, replayVerdict, tickBandOf } from '../../scripts/soak/capsule.mjs';
import { REPLAY_VERDICTS, renderReplayScript } from '../../scripts/soak/replay.template.mjs';
import { collectUndefinedKeyPaths, deepKeyCensus, replantUndefinedKeys } from '../../scripts/audit/soakRules.mjs';

/** A realm-shaped payload carrying the four round-trip casualty classes. */
const realmish = () => ({
  campaign: {
    worldState: {
      rngSeed: 'te28', tick: 104,
      // Real realm keys carry dots and colons — the reason paths are segment arrays.
      relationshipStates: { 'edge.a.b': { memory: { note: undefined, strength: 0.55 } } },
    },
  },
  saves: [
    { id: 'a', settlement: { stress: { icon: undefined, level: 2 }, institutions: [{ removedBy: undefined }] } },
    { id: 'b', settlement: { stress: { icon: undefined, level: 0 }, institutions: [] } },
  ],
});

describe('checkpoint restore parity', () => {
  it('the round trip IS lossy, and the composite-hash idiom cannot see it', () => {
    const live = realmish();
    const naive = JSON.parse(JSON.stringify(live));
    // The hash both runs would compute is IDENTICAL across the loss. This is the arm
    // that justifies the whole deep-key-census design.
    expect(JSON.stringify(live)).toBe(JSON.stringify(naive));
    const lost = deepKeyCensus(live).filter((key) => !deepKeyCensus(naive).includes(key));
    expect(lost.filter((key) => key.endsWith('=undefined')).sort()).toEqual([
      '$.campaign.worldState.relationshipStates.edge.a.b.memory.note=undefined',
      '$.saves[].settlement.institutions[].removedBy=undefined',
      '$.saves[].settlement.stress.icon=undefined',
    ]);
  });

  it('the cure re-plants the exact paths, and its absence still reds', () => {
    const live = realmish();
    const paths = collectUndefinedKeyPaths(live);
    // Segment arrays, one per ALIASED SITE — two settlements each own their own stress
    // icon, so two paths, not one shape.
    expect(paths).toEqual([
      ['campaign', 'worldState', 'relationshipStates', 'edge.a.b', 'memory', 'note'],
      ['saves', 0, 'settlement', 'stress', 'icon'],
      ['saves', 0, 'settlement', 'institutions', 0, 'removedBy'],
      ['saves', 1, 'settlement', 'stress', 'icon'],
    ]);
    const cured = JSON.parse(JSON.stringify(live));
    expect(replantUndefinedKeys(cured, paths)).toEqual({ planted: 4, unreachable: [] });
    expect(deepKeyCensus(cured)).toEqual(deepKeyCensus(live));
    // COUNTERFACTUAL — the replant made a no-op. The proof must red, or it is decoration.
    const notCured = JSON.parse(JSON.stringify(live));
    expect(replantUndefinedKeys(notCured, [])).toEqual({ planted: 0, unreachable: [] });
    expect(deepKeyCensus(notCured)).not.toEqual(deepKeyCensus(live));
    // A path that no longer resolves is REPORTED. A silently skipped replant would let
    // the census pass on a realm that quietly lost a key.
    expect(replantUndefinedKeys(cured, [['saves', 9, 'settlement', 'stress', 'icon']]).unreachable.length).toBe(1);
  });

  it('the cadence is a BAND with a home, and a restored run cannot ask for a verdict', () => {
    expect(Object.keys(CHECKPOINT_CADENCE_BANDS)).toEqual(['cert-30', 'century', 'century-300']);
    expect(checkpointCadence('century')).toEqual({ cadence: 5, refusals: [] });
    expect(checkpointCadence('century-300')).toEqual({ cadence: 10, refusals: [] });
    expect(checkpointCadence('century', 3)).toEqual({ cadence: 3, refusals: [] });
    const tooWide = checkpointCadence('century', 40);
    expect(tooWide.cadence).toBe(null);
    expect(tooWide.refusals[0]).toContain('outside the century band [1, 10]');
    expect(checkpointCadence('no-such-rung').refusals[0]).toContain('no checkpoint cadence band');
    expect(checkpointFileName(12)).toBe('checkpoint-year-12.json');
    expect(checkpointBudget({ years: 30, cadence: 5, finalRealmBytes: 1_000_000 }))
      .toEqual({ count: 6, approxBytes: 6_000_000 });

    // ⛔ `--case-id` is ABSENT BY CONSTRUCTION from a restore invocation. Stated as a
    // collection so the arm cannot go vacuous if the argv shape changes.
    const argv = restoreInvocation({
      checkpointPath: '/state/checkpoint-year-10.json',
      seed: 'w0-soak', years: 30, settlements: 4, sourceSha: 'abc123', receipt: '/r.json',
    });
    expect(argv.filter((token) => token === '--case-id')).toEqual([]);
    expect(argv.slice(0, 2)).toEqual(['--restore-from', '/state/checkpoint-year-10.json']);
    expect(argv).toContain('--source-sha');
  });

  it('a capsule refuses an invented home and a non-deterministic firing', () => {
    const cell = { key: 'w0-soak::30::4::preset', seed: 'w0-soak', years: 30, settlements: 4 };
    const host = { nodeVersion: 'v20.11.0', platform: 'darwin', arch: 'arm64' };
    const firing = { id: 'unbounded_growth', class: 'deterministic', detail: 'over the envelope' };

    const noHome = buildCapsule({ stateHome: '', firing, cell, checkpoint: {}, sourceSha: 'abc', tick: 520, soakArgv: [], host });
    expect(noHome.refusals.length).toBe(1);
    expect(noHome.refusals[0]).toContain('no durable capsule home supplied');
    expect(noHome.files).toEqual([]);

    const observability = buildCapsule({
      stateHome: '/state', firing: { id: 'memory_watermark', class: 'host-observability', detail: 'x' },
      cell, checkpoint: {}, sourceSha: 'abc', tick: 520, soakArgv: [], host,
    });
    expect(observability.refusals[0]).toContain('Only the DETERMINISTIC class mints capsules');

    const capsule = buildCapsule({
      stateHome: '/state/settlementforge/soak', firing, cell,
      checkpoint: { identity: { year: 10 } }, sourceSha: 'abc123', tick: 520,
      soakArgv: ['--years', '30', '--seed', 'w0-soak'], host,
    });
    expect(capsule.refusals).toEqual([]);
    expect(capsule.id).toBe('unbounded_growth__w0-soak::30::4::preset__tick-520-571');
    expect(capsule.directory).toBe('/state/settlementforge/soak/capsules/' + capsule.id);
    expect(capsule.files.map((file) => file.path.split('/').pop()))
      .toEqual(['capsule.json', 'checkpoint.json', 'replay.mjs']);
    // The capsule id IS the census key: full cell identity + tripwire + tick band, never
    // the bare seed. Two firings of the same wire in different cells stay countable.
    expect(capsuleId({ tripwireId: 't', cellKey: 'a::1::2::r', tickBand: '0-51' })).toBe('t__a::1::2::r__tick-0-51');
    expect(tickBandOf(0)).toBe('0-51');
    expect(tickBandOf(52)).toBe('52-103');
    expect(tickBandOf('nonsense')).toBe('unknown');
  });

  it('the replay refuses a node-major mismatch, and mismatch is ENGINE_VARIANCE not a finding', () => {
    const source = renderReplayScript({
      capsuleId: 'c1', sourceSha: 'abc123', nodeVersion: 'v20.11.0', platform: 'darwin',
      arch: 'arm64', tripwireId: 'unbounded_growth', seed: 'w0-soak', years: 30,
      settlements: 4, tick: 520, soakArgv: ['--years', '30'],
    });
    // A fresh archive of the RECORDED sha, installed from its OWN lockfile — a dependency
    // bump is a mint trigger, so a replay against ambient node_modules would be
    // reproducing a different substrate under the same name.
    expect(source).toContain('git archive --format=tar');
    expect(source).toContain("execFileSync('npm', ['ci', '--ignore-scripts']");
    expect(source).toContain('"sourceSha": "abc123"');
    expect(source).toContain('--allow-engine-mismatch');
    expect(source).toContain('ENGINE_VARIANCE, never a finding');
    // The generated file must not carry a stale tip: the ONLY sha-shaped token anywhere
    // in it is the recorded one. It appears twice — the header comment and the RECORDED
    // block — and no third sha may leak in from a template default.
    expect([...new Set([...source.matchAll(/\b[0-9a-f]{6,40}\b/g)].map((m) => m[0]))]).toEqual(['abc123']);

    expect([...REPLAY_VERDICTS]).toEqual(['REPRODUCED', 'NOT_REPRODUCED', 'ENGINE_VARIANCE']);
    expect(replayVerdict({ hashMatched: true, engineMatched: true })).toBe('REPRODUCED');
    expect(replayVerdict({ hashMatched: false, engineMatched: true })).toBe('NOT_REPRODUCED');
    // ⛔ The one that matters: a hash mismatch on a DIFFERENT engine is variance, because
    // implementation-approximated Math can fork same-seed worlds across engines while
    // every same-engine golden stays green.
    expect(replayVerdict({ hashMatched: false, engineMatched: false })).toBe('ENGINE_VARIANCE');
    expect(replayVerdict({ hashMatched: true, engineMatched: false })).toBe('REPRODUCED');
  });
});
