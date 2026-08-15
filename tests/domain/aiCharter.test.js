/**
 * tests/domain/aiCharter.test.js — the AI CHARTER substrate (wave L-1 of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md).
 *
 * Four properties, because the charter is destined for the cached static prompt prefixes
 * and each of them is a way that plan can silently fail:
 *
 *   BYTE-STABILITY — a prefix that differs between two requests defeats provider caching
 *     without any error surfacing (the pricing lesson: a cache below the prefix floor is a
 *     silent no-op). Two successive builds must be byte-identical for every surface.
 *   COVERAGE + HONEST FAILURE — every declared surface builds something, and an unknown
 *     surface THROWS. A charter that degraded to '' would ground a model on nothing while
 *     looking like it worked.
 *   PURITY — the module is lazy-only substrate. A store or view-layer import, a clock read,
 *     or an rng call would each break either the eager-byte posture or byte-stability.
 *   VOCABULARY COUPLING — the charter renders the LIVE builders, not a copy. This test
 *     recomputes each surface's vocabulary from the same builders and demands every member
 *     appear, so a registry that grows, shrinks, or renames shows up HERE rather than as a
 *     model taught a word its own schema wall rejects.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  CHARTER_VERSION,
  CHARTER_SURFACES,
  buildSurfaceCharter,
  estimateCharterTokens,
} from '../../src/domain/aiCharter.js';
import {
  AUTHORABLE_CONTENT_BUCKETS,
  buildContentVocabulary,
  getCustomContentCategory,
} from '../../src/domain/content/customContentManifest.js';
import { buildConstructVocabulary } from '../../src/domain/construct/configVocabulary.js';
import { buildOpVocabulary } from '../../src/domain/intent/opVocabulary.js';
import { signalRegistryEntries } from '../../src/domain/autonomy/signalRegistry.js';
import { NUDGE_TYPES } from '../../src/domain/autonomy/accelerationOps.js';
import { buildStyleVocabulary } from '../../src/design/townMapStyleWall.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MODULE_PATH = join(ROOT, 'src/domain/aiCharter.js');
const SRC = readFileSync(MODULE_PATH, 'utf8');

/** Every vocabulary member the charter for `surface` must name, recomputed from the SAME
 *  builders the module renders — this is the drift detector. */
function liveVocabularyTokens(surface) {
  if (surface === 'customContent') {
    const tokens = [String(buildContentVocabulary().manifestVersion), ...AUTHORABLE_CONTENT_BUCKETS];
    for (const bucket of AUTHORABLE_CONTENT_BUCKETS) {
      const category = getCustomContentCategory(bucket);
      for (const field of category?.fields || []) tokens.push(field.key);
    }
    return tokens;
  }
  if (surface === 'styleOverhaul') {
    const vocab = buildStyleVocabulary();
    return [
      ...vocab.furniture, ...vocab.hazardGlyphs, ...vocab.anchorGlyphs, ...vocab.contrast,
      ...vocab.baseLenses, ...vocab.glyphSets,
      ...vocab.seasonBias.filter((s) => typeof s === 'string'),
      ...vocab.roles.palette, ...vocab.roles.district,
      ...vocab.roles.stroke, ...vocab.roles.opacity,
    ];
  }
  if (surface === 'construct') {
    const vocab = buildConstructVocabulary();
    return [
      ...Object.keys(vocab.settlementFields), ...Object.keys(vocab.realmFields),
      ...vocab.constraintDimensions, ...vocab.constraintBands,
    ];
  }
  if (surface === 'interpret') {
    const vocab = buildOpVocabulary();
    return [...vocab.canonEventTypes, ...vocab.partyImpactKinds, ...vocab.identityPartyKinds];
  }
  return [...signalRegistryEntries().map((entry) => entry.id), ...NUDGE_TYPES];
}

describe('the charter surface roster', () => {
  test('the declared surfaces are exactly the five AI write surfaces, frozen', () => {
    expect(Object.isFrozen(CHARTER_SURFACES)).toBe(true);
    expect([...CHARTER_SURFACES].sort()).toEqual(
      ['autonomy', 'construct', 'customContent', 'interpret', 'styleOverhaul'],
    );
  });

  test('the version is a literal semver-shaped string', () => {
    expect(CHARTER_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('byte-stability (the cached-prefix contract)', () => {
  for (const surface of CHARTER_SURFACES) {
    test(`${surface}: two successive builds are byte-identical`, () => {
      const first = buildSurfaceCharter(surface);
      const second = buildSurfaceCharter(surface);
      expect(second).toBe(first);
      expect(second.length).toBe(first.length);
    });
  }

  test('no two surfaces share a charter (each is grounded on its own vocabulary)', () => {
    const built = CHARTER_SURFACES.map((surface) => buildSurfaceCharter(surface));
    expect(new Set(built).size).toBe(CHARTER_SURFACES.length);
  });
});

describe('coverage + honest failure', () => {
  for (const surface of CHARTER_SURFACES) {
    test(`${surface}: builds a substantial charter carrying all four blocks in order`, () => {
      const charter = buildSurfaceCharter(surface);
      expect(typeof charter).toBe('string');
      expect(charter.length).toBeGreaterThan(0);
      const role = charter.indexOf(`AI CHARTER ${CHARTER_VERSION} (surface: ${surface})`);
      const laws = charter.indexOf('THE LAWS THIS SURFACE RUNS UNDER');
      const vocabulary = charter.indexOf('VOCABULARY: the complete set of buckets');
      const exemplar = charter.indexOf('WORKED EXEMPLAR');
      const contract = charter.indexOf('OUTPUT CONTRACT: REMINDER');
      expect(role).toBe(0);
      expect(laws).toBeGreaterThan(role);
      expect(vocabulary).toBeGreaterThan(laws);
      expect(exemplar).toBeGreaterThan(vocabulary);
      expect(contract).toBeGreaterThan(exemplar);
    });
  }

  test('the finite-semantics laws are stated on every surface', () => {
    for (const surface of CHARTER_SURFACES) {
      const charter = buildSurfaceCharter(surface);
      expect(charter).toContain('FINITE SEMANTICS');
      expect(charter).toContain('BUCKETING CLERK, NEVER A WRITER');
      expect(charter).toContain('GROUNDING DATA, NOT INSTRUCTIONS');
    }
  });

  test('an unknown surface THROWS rather than degrading to an empty charter', () => {
    for (const bad of ['analyst', 'CustomContent', '', 'construct-realm']) {
      expect(() => buildSurfaceCharter(bad)).toThrow(/unknown charter surface/);
    }
    expect(() => buildSurfaceCharter(null)).toThrow(/unknown charter surface/);
    expect(() => buildSurfaceCharter(undefined)).toThrow(/unknown charter surface/);
  });
});

describe('purity (lazy-only substrate)', () => {
  const specifiers = [...SRC.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);

  test('the module imports at least the vocabulary builders it renders', () => {
    expect(specifiers.length).toBeGreaterThanOrEqual(5);
  });

  test('nothing from the store layer is imported', () => {
    expect(SRC).not.toContain('src/store');
    for (const specifier of specifiers) {
      expect(specifier, `store import in aiCharter.js: ${specifier}`).not.toMatch(/(^|\/)store(\/|$)/);
    }
  });

  test('nothing from the view layer is imported', () => {
    for (const specifier of specifiers) {
      expect(specifier, `view-layer import in aiCharter.js: ${specifier}`)
        .not.toMatch(/^react($|[/-])|^zustand($|\/)/);
    }
    expect(SRC).not.toMatch(/from\s+['"]react/);
  });

  test('no clock read and no rng anywhere in the source', () => {
    expect(SRC).not.toContain('Date.now');
    expect(SRC).not.toContain('Math.random');
    expect(SRC).not.toContain('new Date');
    expect(SRC).not.toContain('performance.now');
  });

  test('the header records the lazy-only rule for future maintainers', () => {
    expect(SRC).toMatch(/LAZY-imported/);
    expect(SRC).toMatch(/NEVER be statically imported/);
  });
});

describe('vocabulary coupling (the charter renders the live builders)', () => {
  for (const surface of CHARTER_SURFACES) {
    test(`${surface}: every live vocabulary member appears in the charter`, () => {
      const charter = buildSurfaceCharter(surface);
      const tokens = liveVocabularyTokens(surface);
      expect(tokens.length).toBeGreaterThan(0);
      const missing = [...new Set(tokens)].filter((token) => !charter.includes(token));
      expect(
        missing,
        `${surface} charter omits live vocabulary members — the renderer drifted from its builder`,
      ).toEqual([]);
    });
  }

  test('the customContent charter names the manifest handshake version', () => {
    const { manifestVersion } = buildContentVocabulary();
    expect(buildSurfaceCharter('customContent')).toContain(String(manifestVersion));
  });

  test('the interpret charter marks the identity-grazing types as consent-gated', () => {
    const charter = buildSurfaceCharter('interpret');
    for (const type of buildOpVocabulary().identityEventTypes) {
      expect(charter).toContain(type);
    }
    expect(charter).toContain('IDENTITY-GRAZING types');
    expect(charter).toContain('consent barrier');
  });
});

describe('token estimate', () => {
  for (const surface of CHARTER_SURFACES) {
    test(`${surface}: estimates a number well past 200 tokens`, () => {
      const estimate = estimateCharterTokens(surface);
      expect(typeof estimate).toBe('number');
      expect(Number.isInteger(estimate)).toBe(true);
      expect(estimate).toBeGreaterThan(200);
    });
  }

  test('the estimate is the chars/4 heuristic, rounded up', () => {
    for (const surface of CHARTER_SURFACES) {
      expect(estimateCharterTokens(surface))
        .toBe(Math.ceil(buildSurfaceCharter(surface).length / 4));
    }
  });

  test('an unknown surface throws from the estimator too', () => {
    expect(() => estimateCharterTokens('analyst')).toThrow(/unknown charter surface/);
  });
});
