/**
 * tests/domain/constructCompile.test.js — S5 SETTLEMENT CONSTRUCTION pins
 * (DESIGN_AI_CONTROL_SURFACE §2 stage 5).
 *
 *   PIN 1 (CONFIG IS THE OP / SCHEMA WALL): the compiler may emit ONLY registered config keys
 *     with bounded values; a hallucinated key or a bad value is dropped-and-listed.
 *   PIN 2 (CONFIG-SEAM INTEGRITY, walker-style): every key the vocabulary can emit is READ by
 *     the generator pipeline — the compiler can never write config the pipeline ignores.
 *   PIN 3 (DETERMINISTIC COMPARATOR): the intent-vs-result comparator lists deviations honestly
 *     from a real read-model (deriveSystemState) — zero AI in the judgment.
 *   PIN 4 (DELTA-ONLY REVISE): a revise pass carries the deviations + config ONLY — never the
 *     original grounding slices re-sent.
 *   PIN 5 (STATIC-FIRST): the config vocabulary (schema wall) is a byte-stable prompt prefix.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import {
  SETTLEMENT_CONFIG_FIELDS, validateSettlementConfig, validateConstraints,
  buildConstructVocabulary, coarseBand, CONSTRAINT_DIMENSIONS,
} from '../../src/domain/construct/configVocabulary.js';
import {
  compareResultToConstraints, shouldRevise, buildRevisePayload,
} from '../../src/domain/construct/intentComparator.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import {
  validateConstructConfig, compileConstruct, constructStaticPrefix, buildConstructPrompt, constructLogRecord,
} from '../../supabase/functions/_shared/constructCore.ts';
import {
  CACHE_MARKER, CACHE_MIN_PREFIX_TOKENS, estimateTokens,
} from '../../supabase/functions/_shared/anthropicCache.ts';
import { buildSurfaceCharter } from '../../supabase/functions/_shared/aiCharterBundle.js';
import { buildRetrievalBundle } from '../../supabase/functions/ai-analyst/analystCore.ts';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const ROOT = resolve(__dirname, '../..');

describe('construct — config is the op / the schema wall (PIN 1)', () => {
  it('keeps registered keys with valid values; drops hallucinated keys + bad values', () => {
    const { config, unsupported } = validateSettlementConfig({
      settType: 'city',                  // valid enum → kept
      priorityMilitary: 90,              // valid number → kept
      priorityMagic: 500,                // out of range → dropped
      teleportDensity: 'high',           // unregistered key → dropped
      magicExists: 'yes',                // wrong type → dropped
    });
    expect(config).toEqual({ settType: 'city', priorityMilitary: 90 });
    const keys = unsupported.map((u) => `${u.key}:${u.reason}`);
    expect(keys).toContain('priorityMagic:invalid_value');
    expect(keys).toContain('teleportDensity:unregistered_key');
    expect(keys).toContain('magicExists:invalid_value');
  });

  it('the edge wall (validateConstructConfig) agrees with the client wall', () => {
    const fields = buildConstructVocabulary().settlementFields;
    const edge = validateConstructConfig({ settType: 'town', bogus: 1 }, fields);
    expect(edge.config).toEqual({ settType: 'town' });
    expect(edge.unsupported).toContainEqual({ key: 'bogus', reason: 'unregistered_key' });
  });
});

describe('construct — config-seam integrity (PIN 2, walker-style)', () => {
  it('every emittable config key is read by the generator pipeline (no ignored config)', () => {
    // Mirror tests/generators/configSeamContract.test.js reader-extraction.
    const CFG_ALIASES = 'config|effectiveConfig|cfg|resolvedConfig|resolved|baseConfig|fullConfig';
    const dotRe = new RegExp(`(?:${CFG_ALIASES})\\.([a-zA-Z_][a-zA-Z0-9_]*)`, 'g');
    const destructRe = new RegExp(`\\{([^{}]+)\\}\\s*=\\s*(?:${CFG_ALIASES})\\b`, 'g');
    const read = new Set();
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (name.endsWith('.js')) {
          const src = readFileSync(full, 'utf8');
          let m;
          while ((m = dotRe.exec(src))) read.add(m[1]);
          while ((m = destructRe.exec(src))) for (const p of m[1].split(',')) {
            const n = p.split(':')[0].split('=')[0].trim().replace(/\.\.\./, '');
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(n)) read.add(n);
          }
        }
      }
    };
    walk(resolve(ROOT, 'src/generators'));
    const emittable = Object.keys(SETTLEMENT_CONFIG_FIELDS);
    const orphans = emittable.filter((k) => !read.has(k));
    expect(orphans, `config keys the compiler can emit but the pipeline never reads: ${orphans.join(', ')}`).toEqual([]);
  });
});

describe('construct — deterministic comparator (PIN 3)', () => {
  const settlement = GOLDEN_CONFIGS[10].settlement;

  it('lists a deviation when the actual band misses the target; none when it matches', () => {
    const state = deriveSystemState(settlement);
    const dim = CONSTRAINT_DIMENSIONS.find((d) => typeof state[d]?.value === 'number') || 'resilience';
    const actualBand = coarseBand(state[dim].value);
    const otherBand = actualBand === 'high' ? 'low' : 'high';
    // a matching constraint ⇒ no deviation
    expect(compareResultToConstraints(settlement, { [dim]: actualBand })).toEqual([]);
    // an opposite constraint ⇒ a listed deviation with an honest direction
    const dev = compareResultToConstraints(settlement, { [dim]: otherBand });
    expect(dev).toHaveLength(1);
    expect(dev[0]).toMatchObject({ dimension: dim, target: otherBand, actual: actualBand });
    expect(['raise', 'lower']).toContain(dev[0].direction);
  });

  it('validateConstraints keeps only real dimensions + bands', () => {
    const { constraints, unsupported } = validateConstraints({ resourcePressure: 'high', bogus: 'x', resilience: 'medium' });
    expect(constraints).toEqual({ resourcePressure: 'high' });
    expect(unsupported.map((u) => u.key).sort()).toEqual(['bogus', 'resilience']); // resilience:'medium' is not a valid band
  });
});

describe('construct — delta-only revise (PIN 4)', () => {
  it('shouldRevise is bounded (deviations remain AND rounds left)', () => {
    const dev = [{ dimension: 'resilience', target: 'high', actual: 'low', gap: 2, direction: 'raise' }];
    expect(shouldRevise(dev, { round: 0, maxRounds: 2 })).toBe(true);
    expect(shouldRevise(dev, { round: 2, maxRounds: 2 })).toBe(false); // budget spent
    expect(shouldRevise([], { round: 0, maxRounds: 2 })).toBe(false);  // satisfied
  });

  it('the revise payload carries deviations + config ONLY — no grounding slices', () => {
    const dev = [{ dimension: 'resilience', target: 'high', actual: 'low', gap: 2, direction: 'raise' }];
    const payload = buildRevisePayload(dev, { settType: 'town', priorityMilitary: 40 });
    expect(payload.deviations).toBe(dev);
    expect(payload.config).toEqual({ settType: 'town', priorityMilitary: 40 });
    expect(payload._noSlices).toBe(true);
    // the payload never carries a `slices` / `bundle` / `dossier` key (delta-only)
    for (const k of ['slices', 'bundle', 'dossier', 'grounding']) expect(k in payload).toBe(false);
  });
});

describe('construct — compile + static-first (PIN 5)', () => {
  const VOCAB = { kind: 'settlement', ...buildConstructVocabulary(), configFields: SETTLEMENT_CONFIG_FIELDS };
  const bundle = buildRetrievalBundle([{ id: 'world:neighbours', source: 'read:region', data: [{ id: 'n1' }] }]);

  it('compileConstruct validates config + constraints through the wall', () => {
    const answer = JSON.stringify({
      config: { settType: 'city', priorityCriminal: 80, madeUp: 'x' },
      constraints: { resourcePressure: 'high', bogus: 'mid' },
    });
    const { result } = compileConstruct(answer, VOCAB);
    expect(result.config).toEqual({ settType: 'city', priorityCriminal: 80 });
    expect(result.constraints).toEqual({ resourcePressure: 'high' });
    expect(result.unsupported).toContainEqual({ key: 'madeUp', reason: 'unregistered_key' });
  });

  it('the STATIC PREFIX (config vocabulary) is byte-identical across two different requests', () => {
    const b2 = buildRetrievalBundle([{ id: 'x', source: 'y', data: [] }]);
    const p1 = buildConstructPrompt('a grim border fort', VOCAB, bundle, 'Realm: A', 'canary-A', { maxSlices: 4, maxChars: 500 });
    const p2 = buildConstructPrompt('a prosperous river city', VOCAB, b2, 'Realm: B', 'canary-B', { maxSlices: 4, maxChars: 500 });
    const prefix = constructStaticPrefix(VOCAB);
    expect(p1.startsWith(prefix)).toBe(true);
    expect(p2.startsWith(prefix)).toBe(true);
    expect(p1.slice(prefix.length)).not.toBe(p2.slice(prefix.length));
    expect(prefix).toContain('CONFIG VOCABULARY');
    expect(prefix).toContain('settType:');
  });

  // WAVE L-4 (docs/DESIGN_AI_CAPABILITY_LADDER.md): the prefix TEACHES and CACHES. ONE
  // charter serves BOTH construct surfaces, so this pin also proves the settlement shell
  // is taught the realm keys under their own heading rather than as its own.
  it('leads with the construct charter and clears the provider cache floor', () => {
    const prefix = constructStaticPrefix(VOCAB);
    const charter = buildSurfaceCharter('construct');
    expect(prefix.startsWith(charter.split('\n')[0])).toBe(true);
    expect(prefix).toContain(charter);
    expect(prefix.split(CACHE_MARKER).length - 1).toBe(1);
    expect(prefix.endsWith(CACHE_MARKER)).toBe(true);
    const cached = prefix.slice(0, -CACHE_MARKER.length);
    expect(estimateTokens(cached)).toBeGreaterThanOrEqual(CACHE_MIN_PREFIX_TOKENS);
    expect(cached).toContain('SETTLEMENT config keys (construct-settlement)');
    expect(cached).toContain('REALM config keys (construct-realm)');
    expect(constructStaticPrefix(VOCAB)).toBe(prefix);
  });

  it('the aiOperationLog record carries counts, not config values / prompt', () => {
    const { result } = compileConstruct(JSON.stringify({ config: { settType: 'city', customName: 'SECRETPLACE' }, constraints: {} }), VOCAB);
    const rec = constructLogRecord({ prompt: 'private prompt', bundle, model: 'claude-sonnet-4-5', modelVersion: 'v', answerText: 'x', result });
    expect(rec.config_key_count).toBe(2);
    expect(JSON.stringify(rec)).not.toContain('SECRETPLACE');
    expect(JSON.stringify(rec)).not.toContain('private prompt');
  });
});
