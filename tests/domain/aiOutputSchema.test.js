/**
 * tests/domain/aiOutputSchema.test.js - the SCHEMA SUBSTRATE (wave L-9a of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md §4c.1).
 *
 * The module's whole claim is that a schema-expressible failure class becomes impossible at
 * generation time. A test that merely asserted the schemas EXIST would prove none of that, so
 * this file proves five separate things, each of which is a distinct way the claim could be
 * false:
 *
 *   STRUCTURE - every node is a well-formed schema: typed, closed (additionalProperties false
 *     everywhere but one recorded exception), non-empty enums, and a `required` list that only
 *     ever names properties that exist. A malformed input_schema is rejected by the provider
 *     at call time, where nobody is watching.
 *   CONFORMANCE - each surface's schema ACCEPTS its charter exemplar, parsed out of the
 *     charter text itself. The exemplars are validated-correct instances of the real edge
 *     contracts, so a schema that rejected one would be rejecting the house's own model answer.
 *   CONSTRAINT - and each schema REJECTS an out-of-enum value and an alien key. Acceptance
 *     alone is satisfied by a schema that constrains nothing; this half is what proves the
 *     walls are load-bearing.
 *   VOCABULARY COUPLING - the enums are the LIVE builders, not a copy. Every registry member
 *     is recomputed here and demanded inside the schema, so a registry that grows, shrinks, or
 *     renames reds HERE rather than as a model permitted a word its own wall rejects.
 *   BYTE-STABILITY + PURITY - the schemas ride a cached prompt prefix, and a prefix that
 *     differs between two requests defeats caching with no error surfacing anywhere.
 *
 * The structural checker and the validator below are deliberately hand-written: adding a
 * schema-validation dependency to prove a domain module would put a third party inside the
 * gate, and the subset of JSON Schema this module emits is small enough to check honestly.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  SCHEMA_VERSION,
  SCHEMA_SURFACES,
  buildSurfaceOutputSchema,
  estimateSchemaTokens,
} from '../../src/domain/aiOutputSchema.js';
import { buildSurfaceCharter } from '../../src/domain/aiCharter.js';
import {
  AUTHORABLE_CONTENT_BUCKETS,
  getCustomContentCategory,
} from '../../src/domain/content/customContentManifest.js';
import { buildConstructVocabulary } from '../../src/domain/construct/configVocabulary.js';
import { buildOpVocabulary } from '../../src/domain/intent/opVocabulary.js';
import { PARTY_IMPACT_KINDS } from '../../src/domain/worldPulse/partyImpactKinds.js';
import { signalRegistryEntries } from '../../src/domain/autonomy/signalRegistry.js';
import { MAX_CONDITION_DEPTH } from '../../src/domain/autonomy/stopConditions.js';
import {
  NUDGE_TYPES, MIN_NUDGE_SEVERITY, MAX_NUDGE_SEVERITY,
} from '../../src/domain/autonomy/accelerationOps.js';
import { CATCH_UP_CAP_WEEKS } from '../../src/domain/worldPulse/simulationRules.js';
import { buildStyleVocabulary } from '../../src/design/townMapStyleWall.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MODULE_PATH = join(ROOT, 'src/domain/aiOutputSchema.js');
const SRC = readFileSync(MODULE_PATH, 'utf8');
const WALL_SRC = readFileSync(join(ROOT, 'src/design/townMapStyleWall.js'), 'utf8');

/** The one node in the whole substrate that is deliberately open, and where it must sit. */
const OPEN_NODE_PATH = '$.ops[].oneOf[0].params.payload';

const sortedText = (list) => [...new Set(list)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

// ── the structural checker ───────────────────────────────────────────────────

/**
 * Walk every node of a schema, recording structural faults and the paths of any object that
 * is left open. Shared sub-schemas are visited once per reference, which is what we want: a
 * fault in a shared node should be reported at every path that can reach it.
 */
function walkStructure(node, path, report) {
  report.nodes += 1;
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    report.problems.push(`${path}: not a schema object`);
    return;
  }
  const unionKey = Array.isArray(node.oneOf) ? 'oneOf' : Array.isArray(node.anyOf) ? 'anyOf' : '';
  if (unionKey) {
    if (node[unionKey].length === 0) report.problems.push(`${path}: empty ${unionKey}`);
    node[unionKey].forEach((branch, i) => walkStructure(branch, `${path}.${unionKey}[${i}]`, report));
    return;
  }
  if (typeof node.type !== 'string') {
    report.problems.push(`${path}: node carries no type and no union`);
    return;
  }
  if (node.enum !== undefined) {
    if (!Array.isArray(node.enum)) report.problems.push(`${path}: enum is not an array`);
    else if (node.enum.length === 0) report.problems.push(`${path}: enum is empty`);
  }
  if (node.type === 'object') {
    report.objects += 1;
    if (!node.properties || typeof node.properties !== 'object') {
      report.problems.push(`${path}: object node without a properties bag`);
      return;
    }
    if (!Array.isArray(node.required)) {
      report.problems.push(`${path}: object node without a required list`);
    }
    for (const key of node.required || []) {
      if (!Object.prototype.hasOwnProperty.call(node.properties, key)) {
        report.problems.push(`${path}: required names "${key}", which is not a property`);
      }
    }
    if (node.additionalProperties !== false) report.open.push(path);
    for (const [key, child] of Object.entries(node.properties)) {
      walkStructure(child, `${path}.${key}`, report);
    }
    return;
  }
  if (node.type === 'array') {
    if (!node.items) {
      report.problems.push(`${path}: array node without items`);
      return;
    }
    walkStructure(node.items, `${path}[]`, report);
  }
}

function structureReport(schema) {
  const report = { nodes: 0, objects: 0, problems: [], open: [] };
  walkStructure(schema, '$', report);
  return report;
}

// ── the validator (the subset of JSON Schema this module emits) ──────────────

function validate(schema, value, path = '$') {
  const problems = [];
  const unionKey = Array.isArray(schema.oneOf) ? 'oneOf' : Array.isArray(schema.anyOf) ? 'anyOf' : '';
  if (unionKey) {
    const matched = schema[unionKey].filter((branch) => validate(branch, value, path).length === 0);
    if (matched.length === 0) problems.push(`${path}: matches no branch of ${unionKey}`);
    if (unionKey === 'oneOf' && matched.length > 1) {
      problems.push(`${path}: matches ${matched.length} oneOf branches, which must be disjoint`);
    }
    return problems;
  }
  if (schema.type === 'null') {
    if (value !== null) problems.push(`${path}: expected null`);
    return problems;
  }
  if (schema.type === 'boolean') {
    if (typeof value !== 'boolean') problems.push(`${path}: expected a boolean`);
    return problems;
  }
  if (schema.type === 'number' || schema.type === 'integer') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      problems.push(`${path}: expected a number`);
      return problems;
    }
    if (schema.type === 'integer' && !Number.isInteger(value)) problems.push(`${path}: expected an integer`);
    if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
      problems.push(`${path}: enum rejects ${String(value)}`);
    }
    if (schema.minimum !== undefined && value < schema.minimum) problems.push(`${path}: below minimum`);
    if (schema.maximum !== undefined && value > schema.maximum) problems.push(`${path}: above maximum`);
    if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
      problems.push(`${path}: at or below exclusiveMinimum`);
    }
    return problems;
  }
  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      problems.push(`${path}: expected a string`);
      return problems;
    }
    if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
      problems.push(`${path}: enum rejects "${value}"`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      problems.push(`${path}: longer than maxLength`);
    }
    if (schema.minLength !== undefined && value.trim().length < schema.minLength) {
      problems.push(`${path}: shorter than minLength`);
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
      problems.push(`${path}: pattern rejects "${value}"`);
    }
    return problems;
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      problems.push(`${path}: expected an array`);
      return problems;
    }
    if (schema.minItems !== undefined && value.length < schema.minItems) problems.push(`${path}: below minItems`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) problems.push(`${path}: above maxItems`);
    value.forEach((item, i) => problems.push(...validate(schema.items, item, `${path}[${i}]`)));
    return problems;
  }
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      problems.push(`${path}: expected an object`);
      return problems;
    }
    for (const key of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        problems.push(`${path}: missing required "${key}"`);
      }
    }
    for (const [key, item] of Object.entries(value)) {
      const child = schema.properties && schema.properties[key];
      if (!child) {
        if (schema.additionalProperties === false) {
          problems.push(`${path}: additionalProperties rejects "${key}"`);
        }
        continue;
      }
      problems.push(...validate(child, item, `${path}.${key}`));
    }
    return problems;
  }
  problems.push(`${path}: unhandled schema node`);
  return problems;
}

// ── the charter exemplars, read out of the charter itself ────────────────────

/** Fail-closed: a moved marker throws rather than quietly proving nothing. */
function exemplarPayload(surface) {
  const charter = buildSurfaceCharter(surface);
  const marker = 'CORRECT ANSWER:\n';
  const at = charter.indexOf(marker);
  if (at < 0) throw new Error(`no CORRECT ANSWER marker in the ${surface} charter`);
  const line = charter.slice(at + marker.length).split('\n')[0];
  return JSON.parse(line);
}

// ── reaching into a built schema ─────────────────────────────────────────────

const contentBranches = (schema) => schema.properties.entries.items.oneOf;
const contentBranchFor = (schema, bucket) => contentBranches(schema)
  .find((branch) => branch.properties.bucket.enum[0] === bucket);
const opBranchFor = (schema, family) => schema.properties.ops.items.oneOf
  .find((branch) => branch.properties.family.enum[0] === family);
const conditionTestBranches = (schema) => schema.properties.stopCondition.anyOf[0]
  .properties.root.oneOf.filter((branch) => branch.properties.kind.enum[0] === 'test');

// ── mirrors that must not drift ──────────────────────────────────────────────

/** Pull `LABEL: a | b | c` out of a rendered charter. Throws when the line is gone. */
function charterVocabularyLine(surface, label) {
  const charter = buildSurfaceCharter(surface);
  const at = charter.indexOf(`${label}: `);
  if (at < 0) throw new Error(`the ${surface} charter no longer renders a "${label}" line`);
  const line = charter.slice(at + label.length + 2).split('\n')[0];
  return line.split('|').map((part) => part.trim()).filter(Boolean);
}

/** Pull a numeric `const NAME = <n>;` out of the wall's source. Throws when it is gone. */
function wallConstant(name) {
  const match = WALL_SRC.match(new RegExp(`const ${name} = (\\d+);`));
  if (!match) throw new Error(`src/design/townMapStyleWall.js no longer declares ${name}`);
  return Number(match[1]);
}

describe('the schema surface roster', () => {
  test('the declared surfaces are exactly the five compile surfaces, frozen', () => {
    expect(Object.isFrozen(SCHEMA_SURFACES)).toBe(true);
    expect([...SCHEMA_SURFACES].sort()).toEqual(
      ['autonomy', 'construct', 'customContent', 'interpret', 'styleOverhaul'],
    );
  });

  test('the version is a literal semver-shaped string', () => {
    expect(SCHEMA_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('an unknown surface THROWS rather than degrading to an unconstrained object', () => {
    for (const bad of ['analyst', 'CustomContent', '', 'construct-realm']) {
      expect(() => buildSurfaceOutputSchema(bad)).toThrow(/unknown schema surface/);
    }
    expect(() => buildSurfaceOutputSchema(null)).toThrow(/unknown schema surface/);
    expect(() => estimateSchemaTokens('analyst')).toThrow(/unknown schema surface/);
  });
});

describe('structure (a schema a provider will actually accept)', () => {
  for (const surface of SCHEMA_SURFACES) {
    test(`${surface}: every node is typed, closed, and internally consistent`, () => {
      const report = structureReport(buildSurfaceOutputSchema(surface));
      expect(report.problems, `${surface} structural faults`).toEqual([]);
      expect(report.nodes).toBeGreaterThan(10);
      expect(report.objects).toBeGreaterThan(1);
    });
  }

  test('exactly one object in the whole substrate is left open, and it is the event payload', () => {
    const open = [];
    for (const surface of SCHEMA_SURFACES) {
      for (const path of structureReport(buildSurfaceOutputSchema(surface)).open) {
        open.push(`${surface} ${path}`);
      }
    }
    expect(
      open,
      'the event payload bag is the ONE recorded exception (domain/types.js declares it open);'
      + ' a second open object means a wall stopped being a wall',
    ).toEqual([`interpret ${OPEN_NODE_PATH}`]);
  });

  test('the root of every surface is an object schema carrying a description', () => {
    for (const surface of SCHEMA_SURFACES) {
      const schema = buildSurfaceOutputSchema(surface);
      expect(schema.type).toBe('object');
      expect(schema.additionalProperties).toBe(false);
      expect(typeof schema.description).toBe('string');
      expect(schema.description.length).toBeGreaterThan(20);
      expect(schema.required.length).toBeGreaterThan(0);
    }
  });

  test('no two surfaces share a schema', () => {
    const built = SCHEMA_SURFACES.map((surface) => JSON.stringify(buildSurfaceOutputSchema(surface)));
    expect(new Set(built).size).toBe(SCHEMA_SURFACES.length);
  });
});

describe('conformance (the charter exemplars are accepted)', () => {
  for (const surface of SCHEMA_SURFACES) {
    test(`${surface}: the charter exemplar validates clean`, () => {
      const schema = buildSurfaceOutputSchema(surface);
      const payload = exemplarPayload(surface);
      expect(Object.keys(payload).length).toBeGreaterThan(0);
      expect(
        validate(schema, payload),
        `${surface}: the schema rejects the house's own worked exemplar`,
      ).toEqual([]);
    });
  }

  test('the interpret exemplar carries the F-B params shape the schema now teaches', () => {
    const payload = exemplarPayload('interpret');
    const params = payload.ops[0].params;
    expect(Object.keys(params).sort()).toEqual(['payload', 'targetId']);
    expect(typeof params.payload.severity).toBe('number');
  });

  test('the autonomy exemplar nests inside the unrolled depth cap', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const payload = exemplarPayload('autonomy');
    expect(payload.stopCondition.root.children.length).toBeGreaterThan(1);
    expect(validate(schema.properties.stopCondition, payload.stopCondition)).toEqual([]);
    expect(validate(schema.properties.stopCondition, null)).toEqual([]);
  });
});

describe('constraint (the schemas actually reject)', () => {
  /** One out-of-enum value and one alien key per surface, on the real answer shape. */
  const OUT_OF_ENUM = {
    customContent: (payload) => ({
      ...payload,
      unsupported: [{ requested: 'a mood', reason: 'vibes_mismatch' }],
    }),
    styleOverhaul: (payload) => ({
      ...payload,
      style: { ...payload.style, contrast: 'luminous' },
    }),
    construct: (payload) => ({
      ...payload,
      constraints: { ...payload.constraints, resilience: 'catastrophic' },
    }),
    interpret: (payload) => ({
      ...payload,
      ops: [{ ...payload.ops[0], type: 'BANKRUPT_THE_MOON' }],
    }),
    autonomy: (payload) => ({
      ...payload,
      nudges: [{ ...payload.nudges[0], type: 'moon_bankruptcy' }],
    }),
  };

  const ALIEN_KEY = {
    customContent: (payload) => ({
      ...payload,
      entries: [{ ...payload.entries[0], fields: { ...payload.entries[0].fields, moodTone: 'wistful' } }],
    }),
    styleOverhaul: (payload) => ({
      ...payload,
      style: { ...payload.style, rawSvg: '<circle r="9"/>' },
    }),
    construct: (payload) => ({
      ...payload,
      config: { ...payload.config, hauntedness: 7 },
    }),
    interpret: (payload) => ({
      ...payload,
      ops: [{ ...payload.ops[0], sideEffects: ['rain'] }],
    }),
    autonomy: (payload) => ({
      ...payload,
      nudges: [{ ...payload.nudges[0], guaranteedOutcome: 'the duke dies' }],
    }),
  };

  for (const surface of SCHEMA_SURFACES) {
    test(`${surface}: an out-of-enum value is rejected`, () => {
      const schema = buildSurfaceOutputSchema(surface);
      const payload = OUT_OF_ENUM[surface](exemplarPayload(surface));
      expect(validate(schema, payload).length).toBeGreaterThan(0);
    });

    test(`${surface}: an unregistered key is rejected`, () => {
      const schema = buildSurfaceOutputSchema(surface);
      const payload = ALIEN_KEY[surface](exemplarPayload(surface));
      expect(validate(schema, payload).length).toBeGreaterThan(0);
    });

    test(`${surface}: an alien key at the answer envelope names the mechanism`, () => {
      const schema = buildSurfaceOutputSchema(surface);
      const payload = { ...exemplarPayload(surface), smuggledDirective: 'apply this now' };
      expect(validate(schema, payload)).toContain('$: additionalProperties rejects "smuggledDirective"');
    });
  }

  test('the enum mechanism itself rejects, at a node no union can mask', () => {
    const content = buildSurfaceOutputSchema('customContent');
    const reasonNode = content.properties.unsupported.items.properties.reason;
    expect(validate(reasonNode, 'invalid_value')).toEqual([]);
    expect(validate(reasonNode, 'vibes_mismatch')).toEqual(['$: enum rejects "vibes_mismatch"']);

    const style = buildSurfaceOutputSchema('styleOverhaul');
    expect(validate(style.properties.style.properties.background, '#dfe6ea')).toEqual([]);
    expect(validate(style.properties.style.properties.background, 'rebeccapurple'))
      .toEqual(['$: pattern rejects "rebeccapurple"']);
  });

  test('a required content field cannot be omitted, and a borrowed field cannot be smuggled', () => {
    const schema = buildSurfaceOutputSchema('customContent');
    const deities = contentBranchFor(schema, 'deities');
    expect(validate(deities.properties.fields, { name: 'The Tide' }).sort()).toEqual([
      '$: missing required "alignmentAxis"',
      '$: missing required "rankAxis"',
      '$: missing required "temperamentAxis"',
    ]);
    const institutions = contentBranchFor(schema, 'institutions');
    const borrowed = validate(institutions.properties.fields, { name: 'Mill', rankAxis: 'greater' });
    expect(borrowed).toContain('$: additionalProperties rejects "rankAxis"');
  });

  test('an op tagged to the wrong family matches no branch, so wrong_family is unreachable', () => {
    const schema = buildSurfaceOutputSchema('interpret');
    const legal = { family: 'party_impact', type: 'remove_npc', params: { settlementId: 's1', npcId: 'n1' } };
    expect(validate(schema.properties.ops.items, legal)).toEqual([]);
    const misfiled = { ...legal, family: 'canon_event' };
    expect(validate(schema.properties.ops.items, misfiled))
      .toEqual(['$: matches no branch of oneOf']);
  });

  test('a stop condition nested past the depth cap is unbuildable', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const leaf = {
      kind: 'test', signalId: 'settlement.atWar', settlementId: 'ashford', test: { is: true },
    };
    let node = leaf;
    for (let depth = MAX_CONDITION_DEPTH; depth > 1; depth -= 1) {
      node = { kind: 'all', children: [node] };
    }
    const atCap = { version: 1, root: node };
    expect(validate(schema.properties.stopCondition, atCap)).toEqual([]);
    const pastCap = { version: 1, root: { kind: 'all', children: [node] } };
    expect(validate(schema.properties.stopCondition, pastCap).length).toBeGreaterThan(0);
  });

  test('a signal cannot be tested with another type test shape', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const root = schema.properties.stopCondition.anyOf[0].properties.root;
    const numeric = {
      kind: 'test', signalId: 'pressure.food', settlementId: 'ashford', test: { op: 'gte', value: 0.7 },
    };
    expect(validate(root, numeric)).toEqual([]);
    const mismatched = { ...numeric, test: { is: true } };
    expect(validate(root, mismatched)).toEqual(['$: matches no branch of oneOf']);
  });

  test('a settlement-scoped signal cannot omit its target', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const root = schema.properties.stopCondition.anyOf[0].properties.root;
    const untargeted = { kind: 'test', signalId: 'pressure.food', test: { op: 'gte', value: 0.7 } };
    expect(validate(root, untargeted)).toEqual(['$: matches no branch of oneOf']);
  });

  test('a nudge severity outside the live bounds is rejected on both sides', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const nudge = schema.properties.nudges.items;
    const base = { type: NUDGE_TYPES[0], originSettlementId: 'ashford' };
    expect(validate(nudge, { ...base, severity: MIN_NUDGE_SEVERITY })).toEqual([]);
    expect(validate(nudge, { ...base, severity: MAX_NUDGE_SEVERITY })).toEqual([]);
    expect(validate(nudge, { ...base, severity: 0 })).toEqual(['$.severity: below minimum']);
    expect(validate(nudge, { ...base, severity: 1 })).toEqual(['$.severity: above maximum']);
  });
});

describe('negative controls (the checker and the validator are not green on nothing)', () => {
  /** A mutable deep copy, since the real schemas are frozen by design. */
  const clone = (surface) => JSON.parse(JSON.stringify(buildSurfaceOutputSchema(surface)));

  test('the structural checker catches an object that stops being closed', () => {
    const schema = clone('customContent');
    expect(structureReport(schema).open).toEqual([]);
    schema.properties.entries.items.oneOf[0].properties.fields.additionalProperties = true;
    expect(structureReport(schema).open.length).toBeGreaterThan(0);
  });

  test('the structural checker catches an untyped node, an empty enum, and a phantom required', () => {
    const untyped = clone('construct');
    delete untyped.properties.constraints.type;
    expect(structureReport(untyped).problems.join(' ')).toMatch(/carries no type/);

    const emptyEnum = clone('interpret');
    emptyEnum.properties.ops.items.oneOf[0].properties.type.enum = [];
    expect(structureReport(emptyEnum).problems.join(' ')).toMatch(/enum is empty/);

    const phantom = clone('styleOverhaul');
    phantom.properties.style.required = ['thereIsNoSuchField'];
    expect(structureReport(phantom).problems.join(' ')).toMatch(/is not a property/);
  });

  test('the alien-key rejection is caused by the closure, and vanishes without it', () => {
    const schema = clone('styleOverhaul');
    const payload = { ...exemplarPayload('styleOverhaul'), smuggledDirective: 'apply this now' };
    expect(validate(schema, payload)).toContain('$: additionalProperties rejects "smuggledDirective"');
    schema.additionalProperties = true;
    expect(validate(schema, payload)).toEqual([]);
  });

  test('the enum rejection is caused by the enum, and vanishes without it', () => {
    const schema = clone('autonomy');
    const nudge = schema.properties.nudges.items;
    expect(validate(nudge, { type: 'moon_bankruptcy', originSettlementId: 'a', severity: 0.3 }).length)
      .toBeGreaterThan(0);
    delete nudge.properties.type.enum;
    expect(validate(nudge, { type: 'moon_bankruptcy', originSettlementId: 'a', severity: 0.3 })).toEqual([]);
  });

  test('every extracted exemplar is the real answer shape, not an empty object', () => {
    const expected = {
      customContent: ['entries', 'musings', 'unsupported'],
      styleOverhaul: ['style'],
      construct: ['config', 'constraints', 'musings'],
      interpret: ['musings', 'ops', 'unsupported'],
      autonomy: ['maxWeeks', 'musings', 'nudges', 'stopCondition', 'unsupported'],
    };
    for (const surface of SCHEMA_SURFACES) {
      expect(Object.keys(exemplarPayload(surface)).sort(), `${surface} exemplar shape`)
        .toEqual(expected[surface]);
    }
  });

  test('the charter and wall extractors fail closed rather than proving nothing', () => {
    expect(() => charterVocabularyLine('construct', 'THERE IS NO SUCH LINE')).toThrow(/no longer renders/);
    expect(() => wallConstant('THERE_IS_NO_SUCH_CONSTANT')).toThrow(/no longer declares/);
  });
});

describe('vocabulary coupling (the schemas render the live builders)', () => {
  test('customContent: every authorable bucket is a branch, with its own field contract', () => {
    const schema = buildSurfaceOutputSchema('customContent');
    const branches = contentBranches(schema);
    expect(branches.map((branch) => branch.properties.bucket.enum[0]).sort())
      .toEqual(sortedText(AUTHORABLE_CONTENT_BUCKETS));
    for (const bucket of AUTHORABLE_CONTENT_BUCKETS) {
      const category = getCustomContentCategory(bucket);
      const fields = contentBranchFor(schema, bucket).properties.fields;
      expect(Object.keys(fields.properties).sort(), `${bucket} field set`)
        .toEqual(sortedText(category.fields.map((field) => field.key)));
      expect([...fields.required].sort(), `${bucket} required fields`)
        .toEqual(sortedText(category.fields.filter((field) => field.required === true).map((f) => f.key)));
      for (const field of category.fields) {
        if (field.type !== 'enum') continue;
        expect(fields.properties[field.key].enum, `${bucket}.${field.key} enum`)
          .toEqual(sortedText(field.values));
      }
    }
  });

  test('styleOverhaul: every vocabulary and every renderer role is rendered', () => {
    const vocab = buildStyleVocabulary();
    const style = buildSurfaceOutputSchema('styleOverhaul').properties.style;
    expect(style.properties.anchorGlyph.enum).toEqual(sortedText(vocab.anchorGlyphs));
    expect(style.properties.hazardGlyph.enum).toEqual(sortedText(vocab.hazardGlyphs));
    expect(style.properties.contrast.enum).toEqual(sortedText(vocab.contrast));
    expect(style.properties.baseLens.enum).toEqual(sortedText(vocab.baseLenses));
    expect(style.properties.furniture.items.enum).toEqual(sortedText(vocab.furniture));
    for (const [role, keys] of Object.entries(vocab.roles)) {
      expect(Object.keys(style.properties[role].properties).sort(), `${role} roles`)
        .toEqual(sortedText(keys));
    }
  });

  test('styleOverhaul: the top-level field set is the wall KNOWN set minus the edge-dropped fields', () => {
    const known = WALL_SRC.match(/const KNOWN = new Set\(\[([\s\S]*?)\]\);/);
    if (!known) throw new Error('src/design/townMapStyleWall.js no longer declares a KNOWN set');
    const wallFields = [...known[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    const schemaFields = Object.keys(buildSurfaceOutputSchema('styleOverhaul').properties.style.properties);
    expect(schemaFields.filter((field) => !wallFields.includes(field)), 'schema field the wall would drop')
      .toEqual([]);
    // The recorded exclusion, now a set of one. `id` is caller-assigned through the wall's
    // `meta` argument and is never composed by the model. glyphSet and seasonBias LEFT this
    // list in wave L-WIRE, which closed finding F-C by adding both to the edge contract they
    // were missing from; a regression that dropped either from STYLE_FIELDS would reappear
    // here as a re-excluded field.
    expect(wallFields.filter((field) => !schemaFields.includes(field)).sort())
      .toEqual(['id']);
  });

  test('styleOverhaul: THE GENRE DOOR is open - glyphSet and seasonBias are offered, bounded (F-C)', () => {
    // The positive half of the pin above. F-C was not that the fields were excluded but that
    // the exclusion was DERIVED from a narrower edge list than the vocabulary and the wall
    // both carried, so the charter taught a field the compile path then stripped. Both halves
    // are asserted against the live vocabulary, so a genre pack adding a glyph set id appears
    // here without anyone remembering to widen a literal.
    const vocab = buildStyleVocabulary();
    const style = buildSurfaceOutputSchema('styleOverhaul').properties.style;
    expect(style.properties.glyphSet.enum).toEqual(sortedText(vocab.glyphSets));
    expect(style.properties.glyphSet.enum.length).toBeGreaterThan(0);
    // The four bounded quarters only. The vocabulary's leading null means "follow the live
    // world clock", which absence already says, so it is not a member of the enum.
    expect(style.properties.seasonBias.enum)
      .toEqual(sortedText(vocab.seasonBias.filter((v) => typeof v === 'string')));
    expect(style.properties.seasonBias.enum).toEqual(['autumn', 'spring', 'summer', 'winter']);
    expect(style.properties.seasonBias.enum).not.toContain(null);
  });

  test('construct: one branch per config surface, plus the constraint vocabulary', () => {
    const vocab = buildConstructVocabulary();
    const schema = buildSurfaceOutputSchema('construct');
    const [settlement, realm] = schema.properties.config.anyOf;
    expect(Object.keys(settlement.properties).sort()).toEqual(sortedText(Object.keys(vocab.settlementFields)));
    expect(Object.keys(realm.properties).sort()).toEqual(sortedText(Object.keys(vocab.realmFields)));
    expect(realm.properties.realmSize.enum).toEqual(sortedText(vocab.realmFields.realmSize.values));
    expect(settlement.properties.population.minimum).toBe(vocab.settlementFields.population.min);
    expect(settlement.properties.population.maximum).toBe(vocab.settlementFields.population.max);
    const constraints = schema.properties.constraints;
    expect(Object.keys(constraints.properties).sort()).toEqual(sortedText(vocab.constraintDimensions));
    for (const dimension of vocab.constraintDimensions) {
      expect(constraints.properties[dimension].enum).toEqual(sortedText(vocab.constraintBands));
    }
  });

  test('interpret: both op families carry their whole registered vocabulary', () => {
    const vocab = buildOpVocabulary();
    const schema = buildSurfaceOutputSchema('interpret');
    expect(opBranchFor(schema, 'canon_event').properties.type.enum).toEqual(sortedText(vocab.canonEventTypes));
    expect(opBranchFor(schema, 'party_impact').properties.type.enum).toEqual(sortedText(vocab.partyImpactKinds));
    const partyParams = opBranchFor(schema, 'party_impact').properties.params.properties;
    for (const spec of Object.values(PARTY_IMPACT_KINDS)) {
      for (const target of spec.targets) {
        expect(Object.keys(partyParams), `party target ${target}`).toContain(target);
      }
    }
  });

  test('autonomy: every registered signal id is reachable, grouped by its own test shape', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const branches = conditionTestBranches(schema);
    const reachable = branches.flatMap((branch) => branch.properties.signalId.enum);
    const entries = signalRegistryEntries();
    expect(sortedText(reachable)).toEqual(sortedText(entries.map((entry) => entry.id)));
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    for (const branch of branches) {
      const kinds = new Set(branch.properties.signalId.enum.map((id) => byId.get(id).type));
      expect(kinds.size, 'a branch mixes signal types, so a shape mismatch is possible again').toBe(1);
      const scopes = new Set(branch.properties.signalId.enum.map((id) => byId.get(id).scope));
      expect(scopes.size, 'a branch mixes signal scopes, so a target could be omitted').toBe(1);
    }
  });

  test('autonomy: the nudge vocabulary and every bound come from the live registries', () => {
    const schema = buildSurfaceOutputSchema('autonomy');
    const nudge = schema.properties.nudges.items;
    expect(nudge.properties.type.enum).toEqual(sortedText(NUDGE_TYPES));
    expect(nudge.properties.severity.minimum).toBe(MIN_NUDGE_SEVERITY);
    expect(nudge.properties.severity.maximum).toBe(MAX_NUDGE_SEVERITY);
    expect(schema.properties.maxWeeks.maximum).toBe(CATCH_UP_CAP_WEEKS);
  });
});

describe('the mirrored vocabularies do not drift', () => {
  const REASON_SURFACES = ['customContent', 'interpret', 'autonomy'];

  for (const surface of REASON_SURFACES) {
    test(`${surface}: the unsupported reason enum equals the charter's rendered list`, () => {
      const schema = buildSurfaceOutputSchema(surface);
      const fromSchema = schema.properties.unsupported.items.properties.reason.enum;
      expect([...fromSchema].sort()).toEqual(charterVocabularyLine(surface, 'UNSUPPORTED reasons').sort());
    });
  }

  test('the confidence labels equal the charter\'s rendered list on both labelled surfaces', () => {
    const expected = charterVocabularyLine('customContent', 'CONFIDENCE labels').sort();
    expect(expected.length).toBe(4);
    const content = contentBranchFor(buildSurfaceOutputSchema('customContent'), 'institutions');
    expect([...content.properties.label.enum].sort()).toEqual(expected);
    const op = opBranchFor(buildSurfaceOutputSchema('interpret'), 'canon_event');
    expect([...op.properties.label.enum].sort()).toEqual(expected);
    expect(charterVocabularyLine('interpret', 'CONFIDENCE labels').sort()).toEqual(expected);
  });

  test('the style numeric ceilings and hex shape equal the wall\'s own source', () => {
    const style = buildSurfaceOutputSchema('styleOverhaul').properties.style;
    expect(style.properties.rasterScale.maximum).toBe(wallConstant('RASTER_MAX'));
    expect(style.properties.functional.properties.gridStep.maximum).toBe(wallConstant('GRID_STEP_MAX'));
    expect(style.properties.functional.properties.tokenPx.maximum).toBe(wallConstant('TOKEN_PX_MAX'));
    const strokeRole = Object.keys(style.properties.stroke.properties)[0];
    expect(style.properties.stroke.properties[strokeRole].maximum).toBe(wallConstant('STROKE_MAX'));
    const hex = WALL_SRC.match(/const HEX_RE = \/([^/]+)\/;/);
    if (!hex) throw new Error('src/design/townMapStyleWall.js no longer declares HEX_RE');
    expect(style.properties.background.pattern).toBe(hex[1]);
  });
});

describe('byte-stability and purity (the cached-prefix contract)', () => {
  for (const surface of SCHEMA_SURFACES) {
    test(`${surface}: two successive builds serialize byte-identically`, () => {
      const first = JSON.stringify(buildSurfaceOutputSchema(surface));
      const second = JSON.stringify(buildSurfaceOutputSchema(surface));
      expect(second).toBe(first);
      expect(second.length).toBe(first.length);
    });

    test(`${surface}: the built schema is deeply frozen`, () => {
      const schema = buildSurfaceOutputSchema(surface);
      expect(Object.isFrozen(schema)).toBe(true);
      expect(Object.isFrozen(schema.properties)).toBe(true);
      expect(Object.isFrozen(schema.required)).toBe(true);
      const first = Object.keys(schema.properties)[0];
      expect(Object.isFrozen(schema.properties[first])).toBe(true);
    });
  }

  const specifiers = [...SRC.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);

  test('the module imports at least the vocabulary builders it renders', () => {
    expect(specifiers.length).toBeGreaterThanOrEqual(8);
  });

  test('nothing from the store or the view layer is imported', () => {
    expect(SRC).not.toContain('src/store');
    expect(SRC).not.toMatch(/from\s+['"]react/);
    for (const specifier of specifiers) {
      expect(specifier, `store import in aiOutputSchema.js: ${specifier}`).not.toMatch(/(^|\/)store(\/|$)/);
      expect(specifier, `view-layer import in aiOutputSchema.js: ${specifier}`)
        .not.toMatch(/^react($|[/-])|^zustand($|\/)/);
    }
  });

  test('no clock read and no rng anywhere in the source', () => {
    expect(SRC).not.toContain('Date.now');
    expect(SRC).not.toContain('Math.random');
    expect(SRC).not.toContain('new Date');
    expect(SRC).not.toContain('performance.now');
  });

  test('the header records the lazy-only rule and the wiring wave for future maintainers', () => {
    expect(SRC).toMatch(/LAZY-imported/);
    expect(SRC).toMatch(/NEVER be statically imported/);
    expect(SRC).toMatch(/aiOutputSchemaBundle/);
    expect(SRC).toMatch(/tool_choice/);
  });
});

describe('token estimate', () => {
  for (const surface of SCHEMA_SURFACES) {
    test(`${surface}: estimates a number well past 100 tokens`, () => {
      const estimate = estimateSchemaTokens(surface);
      expect(typeof estimate).toBe('number');
      expect(Number.isInteger(estimate)).toBe(true);
      expect(estimate).toBeGreaterThan(100);
    });
  }

  test('the estimate is the chars/4 heuristic over the serialized schema, rounded up', () => {
    for (const surface of SCHEMA_SURFACES) {
      expect(estimateSchemaTokens(surface))
        .toBe(Math.ceil(JSON.stringify(buildSurfaceOutputSchema(surface)).length / 4));
    }
  });
});
