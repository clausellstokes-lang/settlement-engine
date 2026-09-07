import { describe, expect, test } from 'vitest';

import {
  foldCorpus,
  scalarObservationsOf,
} from '../../scripts/lib/observed-shape-corpus.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

function rootRecord(corpus, name) {
  const descriptor = corpus.graph.roots[name].find((entry) => entry.kind === 'record');
  return corpus.graph.origins[descriptor.origins[0]];
}

function recordTarget(corpus, descriptors) {
  const descriptor = descriptors.find((entry) => entry.kind === 'record');
  return corpus.graph.origins[descriptor.origins[0]];
}

function assertClosedAndReachable(graph) {
  const seenRecords = new Set();
  const seenArrays = new Set();
  let transitions = 0;

  const visit = (descriptors, countTransition = true) => {
    for (const descriptor of descriptors || []) {
      if (descriptor.kind === 'record') {
        if (countTransition) transitions += descriptor.origins.length;
        for (const id of descriptor.origins) {
          const origin = graph.origins[id];
          expect(origin, `record descriptor target ${id} does not exist`).toBeTruthy();
          if (seenRecords.has(id)) continue;
          seenRecords.add(id);
          for (const fields of Object.values(origin.fields)) visit(fields);
          visit(origin.dynamicValues);
        }
      } else if (descriptor.kind === 'array') {
        if (countTransition) transitions += descriptor.arrays.length;
        for (const id of descriptor.arrays) {
          const array = graph.arrays[id];
          expect(array, `array descriptor target ${id} does not exist`).toBeTruthy();
          if (seenArrays.has(id)) continue;
          seenArrays.add(id);
          visit(array.elements);
        }
      }
    }
  };

  for (const descriptors of Object.values(graph.roots)) visit(descriptors, false);
  expect([...seenRecords].sort()).toEqual(Object.keys(graph.origins).sort());
  expect([...seenArrays].sort()).toEqual(Object.keys(graph.arrays).sort());
  expect(transitions).toBe(graph.meta.transitions);
}

describe('observed shape corpus: path-qualified container graph', () => {
  test('typed path segments keep separator/bracket spellings distinct from structure', () => {
    const corpus = foldCorpus([{ name: 'r', value: {
      'a|>b': { flatOnly: 1, common: 1 },
      a: { b: { nestedOnly: 1, common: 1 } },
      items: [{ arrayOnly: 1, common: 1 }],
      'items[]': { literalOnly: 1, common: 1 },
    } }]);
    const root = rootRecord(corpus, 'r');
    const flat = recordTarget(corpus, root.fields['a|>b']);
    const nested = recordTarget(corpus, recordTarget(corpus, root.fields.a).fields.b);
    const arrayElement = recordTarget(
      corpus,
      corpus.graph.arrays[root.fields.items[0].arrays[0]].elements,
    );
    const bracketLiteral = recordTarget(corpus, root.fields['items[]']);

    expect(flat.id).not.toBe(nested.id);
    expect(arrayElement.id).not.toBe(bracketLiteral.id);
    expectAbsentWithAnchor(flat.keys, 'nestedOnly', 'flatOnly', 'flat separator path');
    expectAbsentWithAnchor(bracketLiteral.keys, 'arrayOnly', 'literalOnly', 'bracket literal path');
    expect(corpus.graph.pathEncoding).toBe('typed-uri-v1');

    const observations = scalarObservationsOf([
      { name: 'repeated', value: {
        zIgnored: 'ordinary scalar outside the selected field set',
        a: { headline: 'same' },
        reasons: ['duplicate', 'duplicate'],
      } },
      { name: 'repeated', value: { headline: 'same' } },
    ], { fields: ['headline', 'reasons'] });
    expect(observations).toEqual([
      {
        root: 'repeated', rootOrdinal: 0,
        path: [
          { kind: 'field', value: 'a' },
          { kind: 'field', value: 'headline' },
        ],
        value: 'same',
      },
      {
        root: 'repeated', rootOrdinal: 0,
        path: [
          { kind: 'field', value: 'reasons' },
          { kind: 'index', value: 0 },
        ],
        value: 'duplicate',
      },
      {
        root: 'repeated', rootOrdinal: 0,
        path: [
          { kind: 'field', value: 'reasons' },
          { kind: 'index', value: 1 },
        ],
        value: 'duplicate',
      },
      {
        root: 'repeated', rootOrdinal: 1,
        path: [{ kind: 'field', value: 'headline' }],
        value: 'same',
      },
    ]);
    expect(scalarObservationsOf([
      { name: 'order', value: { headline: 'first', nested: { headline: 'second' } } },
    ], { fields: ['headline'] })).toEqual(scalarObservationsOf([
      { name: 'order', value: { nested: { headline: 'second' }, headline: 'first' } },
    ], { fields: ['headline'] }));
  });

  test('a dynamic-value facet never erases the parent or contaminates exact-id values with fixed fields', () => {
    const corpus = foldCorpus([{ name: 'r', value: {
      a: { id: 'a', v: 1, entityOnly: true, leftOnly: true },
      b: { id: 'b', v: 2, entityOnly: true, rightOnly: true },
      summary: { id: 'not-summary', v: 0, summaryOnly: true },
    } }]);
    const root = rootRecord(corpus, 'r');
    const dynamic = recordTarget(corpus, root.dynamicValues);
    const left = recordTarget(corpus, root.fields.a);
    const right = recordTarget(corpus, root.fields.b);
    const summary = recordTarget(corpus, root.fields.summary);

    expect(root.keys).toEqual(['a', 'b', 'summary']);
    expect(left.id).not.toBe(right.id);
    expectAbsentWithAnchor(left.keys, 'rightOnly', 'leftOnly', 'exact-id left record');
    expectAbsentWithAnchor(right.keys, 'leftOnly', 'rightOnly', 'exact-id right record');
    expect(dynamic.keys).toEqual(expect.arrayContaining(['leftOnly', 'rightOnly']));
    expectAbsentWithAnchor(dynamic.keys, 'summaryOnly', 'entityOnly', 'dynamic-value facet');
    expect(summary.keys).toContain('summaryOnly');
    expect(summary.id).not.toBe(dynamic.id);
  });

  test('heterogeneous, thin, single-entry, and array-valued id maps remain navigable', () => {
    const corpus = foldCorpus([{ name: 'r', value: {
      heterogeneous: { a: { id: 'a', foo: 1 }, b: { id: 'b', bar: 1 } },
      thin: { a: { id: 'a' }, b: { id: 'b' } },
      single: { a: { id: 'a', x: 1 } },
      arrays: { a: [{ x: 1 }], b: [{ x: 2 }] },
    } }]);
    const root = rootRecord(corpus, 'r');

    expect(recordTarget(corpus, root.fields.heterogeneous).dynamicValues).toHaveLength(1);
    expect(recordTarget(corpus, root.fields.thin).dynamicValues).toHaveLength(1);
    expect(recordTarget(corpus, root.fields.single).dynamicValues).toHaveLength(1);
    const arrayMap = recordTarget(corpus, root.fields.arrays);
    expect(arrayMap.dynamicValues[0].kind).toBe('array');
    const values = corpus.graph.arrays[arrayMap.dynamicValues[0].arrays[0]];
    expect(recordTarget(corpus, values.elements).keys).toContain('x');
  });

  test('nested arrays and mixed root kinds are explicit, closed, and reachable', () => {
    const corpus = foldCorpus([
      { name: 'r', value: {
        matrix: [[{ deepOnly: 1, anchor: 1 }]],
        mapOfMaps: {
          A: { x: { id: 'x', v: 1 }, y: { id: 'y', v: 2 } },
          B: { x: { id: 'x', v: 3 }, y: { id: 'y', v: 4 } },
        },
      } },
      { name: 'r', value: [{ alternateRoot: true }] },
    ]);
    const rootDescriptors = corpus.graph.roots.r;
    expect(rootDescriptors.map((entry) => entry.kind).sort()).toEqual(['array', 'record']);

    const root = rootRecord(corpus, 'r');
    const outer = corpus.graph.arrays[root.fields.matrix[0].arrays[0]];
    const inner = corpus.graph.arrays[outer.elements[0].arrays[0]];
    expect(recordTarget(corpus, inner.elements).keys).toContain('deepOnly');
    const outerMap = recordTarget(corpus, root.fields.mapOfMaps);
    expect(outerMap.keys).toEqual(['A', 'B']);
    expect(outerMap.dynamicValues[0].origins).toHaveLength(2);
    for (const id of outerMap.dynamicValues[0].origins) {
      expect(corpus.graph.origins[id].dynamicValues).toHaveLength(1);
    }
    assertClosedAndReachable(corpus.graph);
  });

  test('rows count independent root observations, while instances retain volume', () => {
    const oneObservation = foldCorpus([{ name: 'r', value: Array.from(
      { length: 8 }, (_, i) => ({ id: i, value: i }),
    ) }]);
    const oneArray = oneObservation.graph.arrays[oneObservation.graph.roots.r[0].arrays[0]];
    const oneElement = recordTarget(oneObservation, oneArray.elements);
    expect(oneElement.rows).toBe(1);
    expect(oneElement.instances).toBe(8);

    const eightObservations = foldCorpus(Array.from(
      { length: 8 }, (_, i) => ({ name: 'r', value: [{ id: i, value: i }] }),
    ));
    const manyArray = eightObservations.graph.arrays[eightObservations.graph.roots.r[0].arrays[0]];
    const manyElement = recordTarget(eightObservations, manyArray.elements);
    expect(manyElement.rows).toBe(8);
    expect(manyElement.instances).toBe(8);
  });

  test('requiredKeys distinguish definite spread overwrites from optional observed keys', () => {
    const corpus = foldCorpus([
      { name: 'r', value: { always: { value: 1 }, sometimes: { value: 2 } } },
      { name: 'r', value: { always: { value: 3 } } },
    ]);
    const root = rootRecord(corpus, 'r');

    expect(root.keys).toEqual(['always', 'sometimes']);
    expect(root.requiredKeys).toEqual(['always']);
  });

  test('deep records are preserved and exceeding the safety bound fails loudly', () => {
    let value = { deepest: true };
    for (let i = 0; i < 17; i += 1) value = { next: value };
    const corpus = foldCorpus([{ name: 'r', value }]);
    let origin = rootRecord(corpus, 'r');
    for (let i = 0; i < 17; i += 1) origin = recordTarget(corpus, origin.fields.next);
    expect(origin.keys).toContain('deepest');
    expect(corpus.graph.meta.depthTruncations).toBe(0);

    let tooDeep = { deepest: true };
    for (let i = 0; i < 70; i += 1) tooDeep = { next: tooDeep };
    expect(() => foldCorpus([{ name: 'r', value: tooDeep }])).toThrow(/refusing a truncated graph/);
    expect(() => scalarObservationsOf([{ name: 'r', value: tooDeep }], {
      fields: ['deepest'], maxDepth: 64,
    })).toThrow(/refusing a truncated projection/);
  });

  test('ancestor cycles fail loudly instead of returning a provenance graph with a cut edge', () => {
    const objectCycle = { id: 'object-cycle' };
    objectCycle.self = objectCycle;
    expect(() => foldCorpus([{ name: 'r', value: objectCycle }]))
      .toThrow(/ancestor cycle.*refusing a cycle-truncated provenance graph/);

    const arrayCycle = [];
    arrayCycle.push(arrayCycle);
    expect(() => foldCorpus([{ name: 'r', value: arrayCycle }]))
      .toThrow(/ancestor cycle.*refusing a cycle-truncated provenance graph/);
    expect(() => scalarObservationsOf([{ name: 'r', value: objectCycle }], { fields: ['id'] }))
      .toThrow(/ancestor cycle/);

    for (const value of [undefined, Number.NaN, Number.POSITIVE_INFINITY, 1n, () => {}, Symbol('x')]) {
      expect(() => scalarObservationsOf([
        { name: 'r', value: { headline: value } },
      ], { fields: ['headline'] })).toThrow(/non-JSON value/);
    }
    expect(scalarObservationsOf([{
      name: 'r', value: { unselected: undefined, headline: 'selected' },
    }], { fields: ['headline'] })).toEqual([{
      root: 'r', rootOrdinal: 0,
      path: [{ kind: 'field', value: 'headline' }],
      value: 'selected',
    }]);
    expect(scalarObservationsOf([{
      name: 'r',
      value: { reasons: [{ id: 'volatile', createdAt: 'volatile', summary: 'kept' }] },
    }], { fields: ['reasons'] })).toEqual([{
      root: 'r', rootOrdinal: 0,
      path: [
        { kind: 'field', value: 'reasons' },
        { kind: 'index', value: 0 },
        { kind: 'field', value: 'summary' },
      ],
      value: 'kept',
    }]);
    expect(() => scalarObservationsOf([], { fields: ['headline', 'headline'] }))
      .toThrow(/must not repeat/);
    expect(() => scalarObservationsOf([], { fields: /** @type {never} */ ({}) }))
      .toThrow(/array of nonempty strings/);
    expect(scalarObservationsOf([{ name: 'r', value: objectCycle }], { fields: [] }))
      .toEqual([]);
  });
});
