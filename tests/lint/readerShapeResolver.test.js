import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, test } from 'vitest';

import { scanReaders } from '../../scripts/lib/reader-shape-scan.mjs';

const rows = 16;
const record = (origins) => ({ kind: 'record', origins });
const origin = (id, keys, fields = {}, dynamicValues = [], requiredKeys = keys) => ({
  id, path: id, label: id.split('/').at(-1), rows, keys, requiredKeys, fields, dynamicValues,
});

const GRAPH = {
  schema: 2,
  roots: {
    groups: [{ kind: 'array', elements: ['root/group'] }],
    worldState: [record(['root/worldState'])],
    save: [record(['root/save'])],
  },
  arrays: {
    'array/outer': { id: 'array/outer', elements: [{ kind: 'array', arrays: ['array/inner'] }] },
    'array/inner': { id: 'array/inner', elements: [record(['root/satellite'])] },
  },
  origins: {
    'root/worldState': origin('root/worldState', ['matrix', 'next', 'rows', 'spatialLedgers'], {
      matrix: [{ kind: 'array', arrays: ['array/outer'] }],
      next: [record(['root/worldState'])],
      rows: [{ kind: 'array', elements: ['root/satellite'] }],
      spatialLedgers: [record(['root/spatialLedgers'])],
    }),
    'root/save': origin('root/save', ['id', 'rows'], {
      rows: [{ kind: 'array', elements: ['root/saveItem'] }],
    }),
    'root/saveItem': origin('root/saveItem', ['id', 'name']),
    'root/group': origin('root/group', ['items'], {
      items: [{ kind: 'array', elements: ['root/satellite'] }],
    }),
    'root/spatialLedgers': origin('root/spatialLedgers', ['satellites'], {
      satellites: [record(['root/satelliteMap'])],
    }),
    'root/satelliteMap': origin(
      'root/satelliteMap',
      ['alpha', 'beta'],
      {
        alpha: [record(['root/parentSatellites'])],
        beta: [record(['root/parentSatellites'])],
      },
      [record(['root/parentSatellites'])],
    ),
    'root/parentSatellites': origin('root/parentSatellites', ['steadings'], {
      steadings: [record(['root/steadingMap'])],
    }),
    'root/steadingMap': origin(
      'root/steadingMap',
      ['s1', 's2'],
      {
        s1: [record(['root/satellite'])],
        s2: [record(['root/satellite'])],
      },
      [record(['root/satellite'])],
    ),
    'root/satellite': origin('root/satellite', ['id', 'parentId', 'tier']),
  },
};

function scan(body, graph = GRAPH) {
  const dir = mkdtempSync(join(tmpdir(), 'reader-shape-resolver-'));
  const file = join(dir, 'probe.js');
  writeFileSync(file, body);
  return scanReaders({ files: [file], graph, minRows: 8, root: dir });
}

describe('reader shape resolver provenance', () => {
  test('propagates computed key parameters through nested helpers into dynamic-value facets', () => {
    const result = scan(`
      function namespace(worldState) { return worldState.spatialLedgers; }
      function get(worldState, key) {
        const ns = namespace(worldState);
        return ns ? ns[key] : undefined;
      }
      function wrapper(worldState, key) { return get(worldState, key); }
      export function probe(worldState, parentId, satelliteId) {
        const parents = wrapper(worldState, 'satellites') || {};
        const parent = parents[parentId] || {};
        const steadings = parent.steadings || {};
        return steadings[satelliteId]?.foundingTier;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'steadings', origins: ['syntax/local-object'] },
      { key: 'foundingTier', origins: ['root/satellite'] },
    ]);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('resolves const key aliases and limits unknown records to traversable field values', () => {
    const result = scan(`
      const LEDGER = 'satellites';
      function get(worldState, key) { return worldState.spatialLedgers[key]; }
      export function probe(worldState, unknownKey) {
        const parents = get(worldState, LEDGER);
        const dynamicRecord = worldState[unknownKey];
        return [parents.alpha.steadings.s1.tier, dynamicRecord?.invented];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'invented', origins: ['root/spatialLedgers'] },
      { key: 'invented', origins: ['root/worldState'] },
    ]);
    expect(result.stats.computedRecordUnknown).toBe(0);
  });

  test('preserves explicit nested-array depth from the executed graph', () => {
    const result = scan(`
      export function probe(worldState) {
        return worldState.matrix[0][0].foundingTier;
      }
    `);
    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'foundingTier', origins: ['root/satellite'] },
    ]);
  });

  test('preserves nested depth while reducing symbolic array-element pairs', () => {
    const result = scan(`
      function keepOneLayer(value) { return [[value]][0]; }
      function unwrapBothLayers(value) { return [[value]][0][0]; }
      export function probe(worldState) {
        return [
          keepOneLayer(worldState).__arraySurfaceOnly,
          unwrapBothLayers(worldState).__afterTwoElements,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterTwoElements', origins: ['root/worldState'] },
    ]);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('keeps destructured and defaulted return parameters symbolic until each caller', () => {
    const result = scan(`
      function unwrap({ value }) { return value; }
      export function probe(worldState, save) {
        function defaulted(value = worldState) { return value; }
        return [
          unwrap({ value: worldState }).__worldMissing,
          unwrap({ value: save }).__saveMissing,
          defaulted().__defaultMissing,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__worldMissing', origins: ['root/worldState'] },
      { key: '__saveMissing', origins: ['root/save'] },
      { key: '__defaultMissing', origins: ['root/worldState'] },
    ]);
  });

  test('does not materialize sibling initializer DAGs for a written-key presence read', () => {
    const result = scan(`
      function options(value) {
        return {
          enabled: true,
          sibling: value.rows.map(row => ({ ...row, nested: value.rows })),
        };
      }
      export function probe(worldState) {
        const opts = options(worldState);
        return opts.enabled;
      }
    `);

    expect(result.findings).toEqual([]);
    expect(result.stats.materializedLocalFields).toBe(0);
    expect(result.stats.fixedPointIterations).toBeLessThan(10);
  });

  test('materializes a demanded symbolic field separately at two call sites', () => {
    const result = scan(`
      function box(wanted, sibling) { return { wanted, sibling }; }
      export function probe(worldState, save) {
        return [
          box(worldState, save.rows).wanted.__worldField,
          box(save, worldState.rows).wanted.__saveField,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__worldField', origins: ['root/worldState'] },
      { key: '__saveField', origins: ['root/save'] },
    ]);
    expect(result.stats.materializedLocalFields).toBe(2);
  });

  test('consults a spread base only when the demanded key is not locally written', () => {
    const result = scan(`
      function overlay(base, owned) { return { ...base, owned }; }
      export function probe(worldState, save) {
        return [
          overlay(worldState, save).owned.__ownedField,
          overlay(worldState, save).__baseField,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__ownedField', origins: ['root/save'] },
      { key: '__baseField', origins: ['root/worldState'] },
    ]);
  });

  test('folds object spreads left-to-right with exact last-writer provenance', () => {
    const overlayGraph = {
      schema: 2,
      roots: {
        a: [record(['overlay/a'])],
        b: [record(['overlay/b'])],
        cPresent: [record(['overlay/cPresent'])],
        cAbsent: [record(['overlay/cAbsent'])],
        cOptional: [record(['overlay/cOptional'])],
        explicitGood: [record(['overlay/explicitGood'])],
        explicitBad: [record(['overlay/explicitBad'])],
      },
      origins: {
        'overlay/a': origin('overlay/a', ['owned', 'k'], {
          owned: [record(['overlay/aOwned'])],
          k: [record(['overlay/aK'])],
        }),
        'overlay/b': origin('overlay/b', ['owned'], {
          owned: [record(['overlay/bOwned'])],
        }),
        'overlay/cPresent': origin('overlay/cPresent', ['owned', 'k'], {
          owned: [record(['overlay/cOwned'])],
          k: [record(['overlay/cK'])],
        }),
        'overlay/cAbsent': origin('overlay/cAbsent', ['other']),
        'overlay/cOptional': origin(
          'overlay/cOptional',
          ['owned'],
          { owned: [record(['overlay/optionalOwned'])] },
          [],
          [],
        ),
        'overlay/explicitGood': origin('overlay/explicitGood', ['x']),
        'overlay/explicitBad': origin('overlay/explicitBad', ['other']),
        'overlay/aOwned': origin('overlay/aOwned', ['x']),
        'overlay/aK': origin('overlay/aK', ['x']),
        'overlay/bOwned': origin('overlay/bOwned', ['other']),
        'overlay/cOwned': origin('overlay/cOwned', ['other']),
        'overlay/cK': origin('overlay/cK', ['other']),
        'overlay/optionalOwned': origin('overlay/optionalOwned', ['x']),
      },
    };
    const result = scan(`
      export function probe(
        a, b, cPresent, cAbsent, cOptional, explicitGood, explicitBad,
      ) {
        function identity(value) { return value; }
        function ownedOf({ owned }) { return owned; }
        return [
          ({ owned: explicitGood, ...b }).owned.x,
          identity({ owned: explicitGood, ...b }).owned.x,
          ownedOf({ owned: explicitGood, ...b }).x,
          ({ ...a, owned: explicitGood, ...cPresent }).owned.x,
          ({ ...a, owned: explicitGood, ...cAbsent }).owned.x,
          ({ owned: explicitBad, ...cOptional }).owned.x,
          Object.assign({}, a, { k: explicitGood }, cPresent).k.x,
          Object.assign({}, a, { k: explicitGood }, cAbsent).k.x,
        ];
      }
    `, overlayGraph);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'x', origins: ['overlay/bOwned'] },
      { key: 'x', origins: ['overlay/bOwned'] },
      { key: 'x', origins: ['overlay/bOwned'] },
      { key: 'x', origins: ['overlay/cOwned'] },
      { key: 'x', origins: ['overlay/explicitBad'] },
      { key: 'x', origins: ['overlay/cK'] },
    ]);
  });

  test('keeps fixed traversable fields in unknown lookup and Object.values ledgers', () => {
    const ledgerGraph = {
      schema: 2,
      roots: { ledger: [record(['ledger/root'])] },
      origins: {
        'ledger/root': origin(
          'ledger/root',
          ['entry-1', 'summary'],
          { summary: [record(['ledger/summary'])] },
          [record(['ledger/entry'])],
        ),
        'ledger/entry': origin('ledger/entry', [
          '__unknownFixedField', '__valuesFixedField',
        ]),
        'ledger/summary': origin('ledger/summary', ['count']),
      },
    };
    const result = scan(`
      export function probe(ledger, key) {
        const unknown = ledger[key];
        const values = Object.values(ledger);
        return [
          unknown.__unknownFixedField,
          values.find(Boolean).__valuesFixedField,
        ];
      }
    `, ledgerGraph);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__unknownFixedField', origins: ['ledger/summary'] },
      { key: '__valuesFixedField', origins: ['ledger/summary'] },
    ]);
  });

  test('propagates every traversable value from Object.values of a local record', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const local = { worldState, save, scalar: 1 };
        return Object.values(local).map(value => value.__fromLocalValues);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__fromLocalValues', origins: ['root/save'] },
      { key: '__fromLocalValues', origins: ['root/worldState'] },
    ]);
    expect(result.stats.objectValuesRecordUnknown).toBe(0);
  });

  test('judges a sufficiently observed empty origin instead of suppressing every read', () => {
    const result = scan(`
      export function probe(empty) { return empty.impossible; }
    `, {
      schema: 2,
      roots: { empty: [record(['root/empty'])] },
      origins: { 'root/empty': origin('root/empty', []) },
    });

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'impossible', origins: ['root/empty'] },
    ]);
  });

  test('judges missing fields on exact syntax-owned locals without requiring a mutation', () => {
    const result = scan(`
      export function probe() {
        ({ known: 1 }).known;
        return ({ known: 1 }).missing;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'missing', origins: ['syntax/local-object'] },
    ]);
  });

  test('treats a safely-read uninitialized local as a non-producer', () => {
    const result = scan(`
      export function probe() {
        let uninitialized;
        return uninitialized?.__neverProduced;
      }
    `);

    expect(result.findings).toEqual([]);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
  });

  test('tracks exact, dynamic, aliased, and Object.assign mutations on local objects', () => {
    const result = scan(`
      export function probe(worldState, save, unknownKey, unknownObject) {
        const box = {};
        const alias = box;
        alias['foo'] = worldState;
        box.foo = save;
        box.bar = worldState;
        Object.assign(alias, { assigned: save });

        const dynamicBox = {};
        dynamicBox[unknownKey] = worldState;
        const uncertain = { ...unknownObject };
        uncertain.foo = save;
        return [
          box.foo.__lastExactWriter,
          alias.bar.__aliasedPropertyWriter,
          box.assigned.__assignedMutationWriter,
          box.missing,
          dynamicBox.possible.__dynamicWriter,
          uncertain.maybe,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__lastExactWriter', origins: ['root/save'] },
      { key: '__aliasedPropertyWriter', origins: ['root/worldState'] },
      { key: '__assignedMutationWriter', origins: ['root/save'] },
      { key: 'missing', origins: ['syntax/local-object'] },
      { key: '__dynamicWriter', origins: ['root/worldState'] },
    ]);
  });

  test('instantiates heap effects through parameters and runtime alias versions', () => {
    const parameter = scan(`
      function set(target, value) {
        target.x = value;
        return target.x;
      }
      export function probe(worldState, save) {
        const box = { x: worldState };
        return [
          set(box, save).__insideParameterMutator,
          box.x.__afterParameterMutation,
        ];
      }
    `);
    expect(parameter.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__insideParameterMutator', origins: ['root/save'] },
      { key: '__afterParameterMutation', origins: ['root/save'] },
    ]);

    const returnedAlias = scan(`
      function id(value) { return value; }
      export function probe(worldState, save) {
        const box = { x: worldState };
        const alias = id(box);
        alias.x = save;
        return box.x.__returnedAliasMutation;
      }
    `);
    expect(returnedAlias.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__returnedAliasMutation', origins: ['root/save'] },
    ]);

    const reassignedAway = scan(`
      export function probe(worldState, save) {
        const box = { x: worldState };
        let alias = box;
        alias = { x: worldState };
        alias.x = save;
        return box.x.__aliasReassignedAway;
      }
    `);
    expect(reassignedAway.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__aliasReassignedAway', origins: ['root/worldState'] },
    ]);

    const reassignedTo = scan(`
      export function probe(worldState, save) {
        let alias = { x: worldState };
        const box = { x: worldState };
        alias = box;
        alias.x = save;
        return box.x.__aliasReassignedTo;
      }
    `);
    expect(reassignedTo.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__aliasReassignedTo', origins: ['root/save'] },
    ]);

    const incoming = scan(`
      export function probe(worldState, save) {
        worldState.x = save;
        return worldState.x.__directIncomingMutation;
      }
    `);
    expect(incoming.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__directIncomingMutation', origins: ['root/save'] },
    ]);
  });

  test('applies local mutations only after their execution point, including through helpers', () => {
    const result = scan(`
      function inspect(value) { return value.future.__helperBorrowedFuture; }
      export function probe(worldState) {
        const box = {};
        box.direct;
        box.direct = worldState;
        box.direct.__afterDirectWrite;
        inspect(box);
        box.future = worldState;
        box.future.__afterHelperCall;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'future', origins: ['syntax/local-object'] },
      { key: 'direct', origins: ['syntax/local-object'] },
      { key: '__afterDirectWrite', origins: ['root/worldState'] },
      { key: '__afterHelperCall', origins: ['root/worldState'] },
    ]);
    expect(result.findings.some(({ key }) => key === '__helperBorrowedFuture')).toBe(false);
    expect(result.stats.indexedCallSites).toBe(1);
    expect(result.stats.materializedLocalFields).toBeLessThanOrEqual(2);
    expect(result.stats.fixedPointIterations).toBeLessThan(8);
    expect(result.stats.cycleCuts).toBe(0);
  });

  test('models logical, compound, delete, nested, computed, and assign mutations in order', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const box = {};
        box.coalesced ??= worldState;
        box.coalesced.__afterCoalesce;
        box.orValue ||= save;
        box.orValue.__afterOr;
        box.andValue = worldState;
        box.andValue &&= save;
        box.andValue.__afterAnd;
        box.count += 1;
        box.count;
        box.deleted = worldState;
        box.deleted.__beforeDelete;
        delete box.deleted;
        box.deleted;
        box.assigned;
        Object.assign(box, { assigned: save });
        box.assigned.__afterAssign;

        const nested = { inner: {} };
        nested.inner.before;
        nested.inner['fixed'] = worldState;
        nested.inner.fixed.__afterNested;
        nested.inner[-1] = save;
        nested.inner[-1].__afterSignedMutation;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterCoalesce', origins: ['root/worldState'] },
      { key: '__afterOr', origins: ['root/save'] },
      { key: '__afterAnd', origins: ['root/save'] },
      { key: '__beforeDelete', origins: ['root/worldState'] },
      { key: 'deleted', origins: ['syntax/local-object'] },
      { key: 'assigned', origins: ['syntax/local-object'] },
      { key: '__afterAssign', origins: ['root/save'] },
      { key: 'before', origins: ['syntax/local-object'] },
      { key: '__afterNested', origins: ['root/worldState'] },
      { key: '__afterSignedMutation', origins: ['root/save'] },
    ]);
  });

  test('treats property update expressions as primitive cell writes', () => {
    const result = scan(`
      export function probe(worldState) {
        const direct = { selected: worldState };
        direct.selected++;
        const computed = { selected: worldState };
        const key = 'selected';
        --computed[key];
        return [
          direct.selected?.__afterDirectIncrement,
          computed.selected?.__afterComputedDecrement,
        ];
      }
    `);

    expect(result.findings).toEqual([]);
  });

  test('scans canonical static numeric and signed-numeric element keys', () => {
    const result = scan(`
      export function probe(worldState) {
        return [worldState[0], worldState[-1], worldState[+2]];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '0', origins: ['root/worldState'] },
      { key: '-1', origins: ['root/worldState'] },
      { key: '2', origins: ['root/worldState'] },
    ]);
    expect(result.findings.every(({ site }) => site.includes('|kind=element|'))).toBe(true);
  });

  test('applies defaults to omission and runtime undefined without shadowing names', () => {
    const result = scan(`
      export function probe(worldState, save) {
        function use(value = worldState) { return value; }
        function recurse(value = worldState) {
          return value.next ? recurse(value.next) : value;
        }
        function keyed(value = worldState, key = 'next') { return value[key]; }
        function shadow(undefined) { return use(undefined); }
        return [
          use().__omittedDefault,
          use(undefined).__explicitUndefinedDefault,
          use(void save).__voidDefault,
          recurse(undefined).__recursiveDefault,
          keyed(undefined, undefined).__keyDefault,
          shadow(save).__shadowedUndefined,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__omittedDefault', origins: ['root/worldState'] },
      { key: '__explicitUndefinedDefault', origins: ['root/worldState'] },
      { key: '__voidDefault', origins: ['root/worldState'] },
      { key: '__recursiveDefault', origins: ['root/worldState'] },
      { key: '__keyDefault', origins: ['root/worldState'] },
      { key: '__shadowedUndefined', origins: ['root/save'] },
    ]);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('emits trivia-stable and structurally distinct semantic finding sites', () => {
    const compact = scan(`
      export function probe(worldState) {
        return worldState.__siteMissing;
      }
    `);
    const spaced = scan(`
      // unrelated trivia above

      export function probe(worldState) {
        const unrelated = 1;
        /* trivia */ return worldState.__siteMissing;
      }
    `);
    const distinct = scan(`
      export function first(worldState) { return worldState.__siteMissing; }
      export function second(worldState) { return worldState.__siteMissing; }
    `);
    const identical = scan(`
      export function probe(worldState) {
        worldState.__siteMissing;
        worldState.__siteMissing;
      }
    `);

    expect(compact.findings[0].site).toBe(spaced.findings[0].site);
    expect(compact.findings[0].site).toMatch(
      /^v2\|owner=.+\|context=[a-f0-9]{64}\|expr=[a-f0-9]{64}\|ordinal=0\|kind=dot\|key=__siteMissing$/,
    );
    expect(new Set(distinct.findings.map(({ site }) => site)).size).toBe(2);
    expect(identical.findings.map(({ site }) => site)).toEqual([
      expect.stringContaining('|ordinal=0|'),
      expect.stringContaining('|ordinal=1|'),
    ]);
  });

  test('addresses identical reads by semantic control ancestry without deletion churn', () => {
    const both = scan(`
      export function probe(worldState, authorized, fallback) {
        if (authorized) return worldState.__branchMissing;
        if (fallback) return worldState.__branchMissing;
        return null;
      }
    `);
    const fallbackOnly = scan(`
      export function probe(worldState, authorized, fallback) {
        if (fallback) return worldState.__branchMissing;
        return null;
      }
    `);

    expect(both.findings).toHaveLength(2);
    expect(new Set(both.findings.map(({ site }) => site)).size).toBe(2);
    expect(both.findings[1].site).toBe(fallbackOnly.findings[0].site);
  });

  test('qualifies object owners and ordinals duplicate same-name owners', () => {
    const result = scan(`
      const left = {
        read(worldState) { return worldState.__ownerCollision; },
      };
      const right = {
        read(worldState) { return worldState.__ownerCollision; },
      };
      export function probe(worldState) {
        left.read(worldState);
        right.read(worldState);
        {
          function duplicate() { return worldState.__duplicateOwner; }
          duplicate();
        }
        {
          function duplicate() { return worldState.__duplicateOwner; }
          duplicate();
        }
      }
    `);
    const owners = result.findings.map(({ site }) => decodeURIComponent(
      /(?:^|\|)owner=([^|]+)/.exec(site)[1],
    ));

    expect(new Set(result.findings.map(({ site }) => site)).size).toBe(4);
    expect(owners).toEqual(expect.arrayContaining([
      'object-binding:left#0/method:read#0',
      'object-binding:right#0/method:read#0',
      'function:probe#0/function:duplicate#0',
      'function:probe#0/function:duplicate#1',
    ]));
  });

  test('meters cyclic array descriptors instead of silently cutting them', () => {
    const result = scan(`
      export function probe(loop) { return loop[0]; }
    `, {
      schema: 2,
      roots: { loop: [{ kind: 'array', arrays: ['array/loop'] }] },
      arrays: {
        'array/loop': {
          id: 'array/loop',
          elements: [{ kind: 'array', arrays: ['array/loop'] }],
        },
      },
      origins: {},
    });

    expect(result.stats.cycleCuts).toBeGreaterThan(0);
  });

  test('unions every concat input and supplies elements to named callbacks', () => {
    const result = scan(`
      function inspect(row) { return row.__missingFromEitherArray; }
      export function probe(worldState, save) {
        return worldState.rows.concat(save.rows).map(inspect);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__missingFromEitherArray', origins: ['root/satellite'] },
      { key: '__missingFromEitherArray', origins: ['root/saveItem'] },
    ]);
  });

  test('keeps map arrays nested while flatMap exposes their elements', () => {
    const result = scan(`
      export function probe(groups) {
        groups.map((group) => group.items).find((items) => items.__arraySurfaceOnly);
        return groups.flatMap((group) => group.items)
          .find((item) => item.foundingTier);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'foundingTier', origins: ['root/satellite'] },
    ]);
  });

  test('treats local object-literal and Object.assign fields as real writers', () => {
    const result = scan(`
      function overlay(row, value) {
        return Object.assign({}, row, { localOnly: value });
      }
      export function probe(worldState, save) {
        return [
          overlay(worldState, save).localOnly.__assignedField,
          { ...worldState, otherLocal: 1 }.otherLocal,
          overlay(worldState, save).__stillMissingOnWorld,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__assignedField', origins: ['root/save'] },
      { key: '__stillMissingOnWorld', origins: ['root/worldState'] },
    ]);
  });

  test('solves recursive return provenance over finite executed origins', () => {
    const result = scan(`
      function last(row) {
        return row.next ? last(row.next) : row;
      }
      export function probe(worldState) {
        return last(worldState).__afterRecursion;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterRecursion', origins: ['root/worldState'] },
    ]);
    expect(result.stats.depthTruncations).toBe(0);
    expect(result.stats.cycleCuts).toBe(0);
  });

  test('canonicalizes a local overlay fed back through the same call site', () => {
    const result = scan(`
      function detachedRecord(value) { return { ...value }; }
      function preview(current) {
        return detachedRecord({ ...current, phase: 'preview' });
      }
      export function probe(worldState) {
        let next = worldState;
        next = preview(next);
        return next.__afterOverlayFeedback;
      }
    `);
    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterOverlayFeedback', origins: ['root/worldState'] },
    ]);
    expect(result.stats.fixedPointIterations).toBeLessThan(10);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('solves a loop-carried local property SCC without reporting provenance loss', () => {
    const result = scan(`
      function mutateChecked({ settlement }) {
        inspect(settlement);
        return { settlement };
      }
      function inspect(settlement) {
        return settlement.__afterPropertyFeedback;
      }
      function applyBatch(settlement, events) {
        let working = settlement;
        for (const event of events) {
          const mutated = mutateChecked({ settlement: working, event });
          working = mutated.settlement;
        }
        return working;
      }
      export function probe(worldState) {
        return applyBatch(worldState, [{}]);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterPropertyFeedback', origins: ['root/worldState'] },
    ]);
    // Invocation-qualified flow closes this through the mutable binding SCC;
    // no separate local-property recursion edge remains to count.
    expect(result.stats.resolvedSccBackEdges).toBe(0);
    expect(result.stats.mutableBindingSccBackEdges).toBeGreaterThan(0);
    expect(result.stats.cycleCuts).toBe(0);
    expect(result.stats.depthTruncations).toBe(0);
    expect(result.stats.fixedPointIterations).toBeLessThan(8);
  });

  test('versions a pulse-like mutable pipeline at each write instead of inventing a global cycle', () => {
    const result = scan(`
      function advance({ settlementUpdates }) {
        return { changed: true, settlementUpdates };
      }
      function applyPulseMover(result, settlementUpdates) {
        return {
          settlementUpdates: result.settlementUpdates ?? settlementUpdates,
        };
      }
      function inspect(row) { return row.__afterPulsePipeline; }
      export function probe(worldState, save, chooseSave) {
        let settlementUpdates = worldState.rows;
        if (chooseSave) settlementUpdates = save.rows;
        const first = applyPulseMover(advance({ settlementUpdates }), settlementUpdates);
        settlementUpdates = first.settlementUpdates;
        const second = applyPulseMover(advance({ settlementUpdates }), settlementUpdates);
        settlementUpdates = second.settlementUpdates;
        return inspect(settlementUpdates[0]);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterPulsePipeline', origins: ['root/satellite'] },
      { key: '__afterPulsePipeline', origins: ['root/saveItem'] },
    ]);
    expect(result.stats.mutableBindingSccBackEdges).toBe(0);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
    expect(result.stats.maxReadAbstractTokens).toBeLessThanOrEqual(16);
    expect(result.stats.maxReadTokenLength).toBeLessThanOrEqual(256);
    expect(result.stats.maxReadStateGrowth).toBeLessThanOrEqual(48);
    expect(result.stats.fixedPointIterations).toBeLessThanOrEqual(3);
  });

  test('replays straight-line mutable versions through a deferred local field', () => {
    const result = scan(`
      function applyFactionDeltas(settlement) {
        return { ...settlement, factionsApplied: true };
      }
      function tickDurations(settlement) {
        return { ...settlement, durationsTicked: true };
      }
      function removeExpired(settlement) {
        return {
          settlement: { ...settlement, expiredRemoved: true },
          expired: [],
        };
      }
      function inspect(settlement) { return settlement.__afterTimeProgression; }
      export function probe(worldState) {
        let newSettlement = applyFactionDeltas(worldState);
        newSettlement = tickDurations(newSettlement);
        const expiryResult = removeExpired(newSettlement);
        newSettlement = expiryResult.settlement;
        return inspect(newSettlement);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterTimeProgression', origins: ['root/worldState'] },
    ]);
    expect(result.stats.resolvedBindingVersionBackEdges).toBe(0);
    expect(result.stats.mutableBindingSccBackEdges).toBe(0);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
    expect(result.stats.cycleCuts).toBe(0);
    expect(result.stats.depthTruncations).toBe(0);
    expect(result.stats.fixedPointIterations).toBeLessThan(8);
  });

  test('cuts off a closed-over mutable binding at each exact helper call', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        function grab() { return current; }
        const before = grab();
        current = save;
        const after = grab();
        return [before.__capturedBefore, after.__capturedAfter];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__capturedBefore', origins: ['root/worldState'] },
      { key: '__capturedAfter', origins: ['root/save'] },
    ]);
    expect(result.stats.depthTruncations).toBe(0);
    expect(result.stats.cycleCuts).toBe(0);
  });

  test('evaluates a closure-owned property read at every invocation cutoff', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        function grab() { return current.__insideHelper; }
        grab();
        current = save;
        grab();
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__insideHelper', origins: ['root/save'] },
      { key: '__insideHelper', origins: ['root/worldState'] },
    ]);
  });

  test('keeps implicit getter invocations conservative across outer writes', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        const holder = {
          get selected() { return current.__insideImplicitGetter; },
        };
        Object.values(holder);
        current = save;
        Object.values(holder);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__insideImplicitGetter', origins: ['root/save'] },
      { key: '__insideImplicitGetter', origins: ['root/worldState'] },
    ]);
  });

  test('retains prior-frame writes at a recursive invocation backedge', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        function recurse(next, depth) {
          current.__insideRecursiveInvocation;
          if (depth <= 0) return;
          current = next;
          recurse(save, depth - 1);
        }
        recurse(save, 1);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__insideRecursiveInvocation', origins: ['root/save'] },
      { key: '__insideRecursiveInvocation', origins: ['root/worldState'] },
    ]);
  });

  test('does not move an unawaited post-suspension effect before a synchronous read', () => {
    const result = scan(`
      export async function probe(worldState, save) {
        let current = worldState;
        async function setLater() {
          await Promise.resolve();
          current = save;
        }
        setLater();
        return current.__afterUnawaitedAsyncEffect;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterUnawaitedAsyncEffect', origins: ['root/worldState'] },
    ]);
  });

  test('classifies ternary suspension branches without assuming an if-statement shape', () => {
    const result = scan(`
      export async function probe(worldState, flag) {
        flag ? await Promise.resolve() : null;
        return worldState.__afterTernaryAwait;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterTernaryAwait', origins: ['root/worldState'] },
    ]);
  });

  test('keeps deferred closure fields isolated between helper call sites', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        function grab() { return { value: current }; }
        const before = grab();
        current = save;
        const after = grab();
        return [before.value.__fieldBefore, after.value.__fieldAfter];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__fieldBefore', origins: ['root/worldState'] },
      { key: '__fieldAfter', origins: ['root/save'] },
    ]);
  });

  test('orders closed-over binding writes by direct and transitive invocation sites', () => {
    const direct = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        function setSave() { current = save; }
        current.__beforeSet;
        setSave();
        return current.__afterSet;
      }
    `);
    expect(direct.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__beforeSet', origins: ['root/worldState'] },
      { key: '__afterSet', origins: ['root/save'] },
    ]);

    const declarationOrder = scan(`
      export function probe(worldState, save) {
        let current = save;
        function setSave() { current = save; }
        function setWorld() { current = worldState; }
        setWorld();
        current.__afterWorld;
        setSave();
        return current.__afterSave;
      }
    `);
    expect(declarationOrder.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterWorld', origins: ['root/worldState'] },
      { key: '__afterSave', origins: ['root/save'] },
    ]);

    const transitive = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        function setSave() { current = save; }
        function outer() { setSave(); }
        current.__beforeOuter;
        outer();
        return current.__afterOuter;
      }
    `);
    expect(transitive.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__beforeOuter', origins: ['root/worldState'] },
      { key: '__afterOuter', origins: ['root/save'] },
    ]);
  });

  test('evaluates repeated parameterized effects in their exact invocation frames', () => {
    const bindingResult = scan(`
      export function probe(worldState, save) {
        let current = save;
        function set(value) { current = value; }
        set(worldState);
        current.__parameterizedBefore;
        set(save);
        return current.__parameterizedAfter;
      }
    `);
    expect(bindingResult.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__parameterizedBefore', origins: ['root/worldState'] },
      { key: '__parameterizedAfter', origins: ['root/save'] },
    ]);

    const fieldResult = scan(`
      export function probe(worldState, save) {
        const box = { value: save };
        function set(value) { box.value = value; }
        set(worldState);
        box.value.__fieldParameterizedBefore;
        set(save);
        return box.value.__fieldParameterizedAfter;
      }
    `);
    expect(fieldResult.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__fieldParameterizedBefore', origins: ['root/worldState'] },
      { key: '__fieldParameterizedAfter', origins: ['root/save'] },
    ]);
  });

  test('models uninitialized, logical-assignment, and primitive-kill transfers', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let assignedLater;
        assignedLater = save;
        let nullish = null;
        nullish ??= save;
        let orValue = null;
        orValue ||= save;
        let andValue = worldState;
        andValue &&= save;
        let incremented = worldState;
        incremented++;
        let compounded = worldState;
        compounded += save;
        return [
          assignedLater.__uninitialized,
          nullish.__nullish,
          orValue.__orValue,
          andValue.__andValue,
          incremented.__primitiveAfterIncrement,
          compounded.__primitiveAfterCompound,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__uninitialized', origins: ['root/save'] },
      { key: '__nullish', origins: ['root/save'] },
      { key: '__orValue', origins: ['root/save'] },
      { key: '__andValue', origins: ['root/save'] },
      { key: '__andValue', origins: ['root/worldState'] },
    ]);
  });

  test('tracks destructuring, for-of targets, and caught thrown values', () => {
    const graph = {
      ...GRAPH,
      origins: {
        ...GRAPH.origins,
        'root/saveItem': origin('root/saveItem', ['child'], {
          child: [record(['root/save'])],
        }),
      },
    };
    const result = scan(`
      export function probe(worldState, save) {
        let objectValue = worldState;
        ({ picked: objectValue } = { picked: save });
        let shorthand = worldState;
        ({ shorthand } = { shorthand: save });
        let arrayValue = worldState;
        [arrayValue] = [save];
        let loopValue = worldState;
        for (loopValue of save.rows) {
          loopValue.__forOfAssigned;
        }
        for (const { child } of save.rows) {
          child.__forOfDestructured;
        }
        try {
          throw save;
        } catch (caught) {
          caught.__caughtValue;
        }
        return [
          objectValue.__objectDestructured,
          shorthand.__shorthandDestructured,
          arrayValue.__arrayDestructured,
        ];
      }
    `, graph);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__forOfAssigned', origins: ['root/saveItem'] },
      { key: '__forOfAssigned', origins: ['root/worldState'] },
      { key: '__forOfDestructured', origins: ['root/save'] },
      { key: '__caughtValue', origins: ['root/save'] },
      { key: '__objectDestructured', origins: ['root/save'] },
      { key: '__shorthandDestructured', origins: ['root/save'] },
      { key: '__arrayDestructured', origins: ['root/save'] },
    ]);
  });

  test('does not lend a var initializer to a helper call that precedes it', () => {
    const result = scan(`
      export function probe(save) {
        function grab() { return current; }
        grab()?.__beforeInitializer;
        var current = save;
        return grab().__afterInitializer;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterInitializer', origins: ['root/save'] },
    ]);
  });

  test('orders a closed-over local mutation by its helper call site', () => {
    const result = scan(`
      export function probe(save) {
        const box = {};
        function mutate() { box.future = save; }
        box.future?.__borrowedFuture;
        mutate();
        return box.future.__afterMutation;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'future', origins: ['syntax/local-object'] },
      { key: '__afterMutation', origins: ['root/save'] },
    ]);
  });

  test('orders competing closed-over local mutations by invocation sites', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const box = { value: save };
        function setSave() { box.value = save; }
        function setWorld() { box.value = worldState; }
        setWorld();
        box.value.__afterWorldMutation;
        setSave();
        return box.value.__afterSaveMutation;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterWorldMutation', origins: ['root/worldState'] },
      { key: '__afterSaveMutation', origins: ['root/save'] },
    ]);
  });

  test('keeps effects after a possible early exit optional', () => {
    const graph = {
      ...GRAPH,
      origins: {
        ...GRAPH.origins,
        'root/save': origin(
          'root/save',
          ['__afterSkipped', '__borrowedAfterSkip', 'rows'],
          { rows: [{ kind: 'array', elements: ['root/saveItem'] }] },
        ),
      },
    };
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        const box = {};
        function setBinding(skip) {
          if (skip) return;
          current = save;
        }
        function setField(skip) {
          if (skip) return;
          box.future = save;
        }
        setBinding(true);
        setField(true);
        return [current.__afterSkipped, box.future?.__borrowedAfterSkip];
      }
    `, graph);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterSkipped', origins: ['root/worldState'] },
      { key: 'future', origins: ['syntax/local-object'] },
    ]);
  });

  test('fails closed when one reader exceeds the abstract-token budget', () => {
    const longKey = `field${'x'.repeat(75)}`;
    const path = Array.from({ length: 60 }, () => `.${longKey}`).join('');
    expect(() => scan(`
      function project(value) { return value${path}; }
      export function probe(worldState) {
        return project(worldState).__afterPathExplosion;
      }
    `)).toThrow(/abstract-state budget exceeded .*token length .*refusing partial provenance/);
  });

  test('terminates map-element feedback in the reduced symbolic path domain', () => {
    const result = scan(`
      function identity(value) { return value; }
      function normalize(value) {
        return { ...value, rows: value.rows.map(identity) };
      }
      function firstMapped(value) {
        return value.rows.map(identity).find(Boolean);
      }
      export function probe(worldState) {
        let next = worldState;
        next = normalize(next);
        return firstMapped(next).__afterMapElementFeedback;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterMapElementFeedback', origins: ['root/satellite'] },
    ]);
    expect(result.stats.fixedPointIterations).toBeLessThan(10);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('solves a named structure-preserving recursive map as a finite symbolic identity', () => {
    const result = scan(`
      function deep(value) {
        return Array.isArray(value) ? value.map(deep) : value;
      }
      function veil(value) { return deep(value); }
      export function probe(worldState) {
        return veil(worldState).__afterStructurePreservingRecursion;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterStructurePreservingRecursion', origins: ['root/worldState'] },
    ]);
    expect(result.stats.fixedPointIterations).toBeLessThan(10);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('keeps a recursive dynamic-key clone finite without discarding proven values', () => {
    const result = scan(`
      function veilDeep(value) {
        if (Array.isArray(value)) {
          return value.map(child => veilDeep(child));
        }
        if (value && typeof value === 'object') {
          const out = {};
          for (const [key, child] of Object.entries(value)) {
            out[key] = veilDeep(child);
          }
          return out;
        }
        return value;
      }
      function dynamicEntry(value, key) {
        const out = {};
        out[key] = value;
        return out;
      }
      export function probe(worldState, unknownKey) {
        return [
          veilDeep(worldState).__afterDynamicClone,
          [dynamicEntry(worldState, unknownKey)]
            .map(entry => entry)
            .find(Boolean).possible.__mappedDynamicValue,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterDynamicClone', origins: ['root/worldState'] },
      { key: '__mappedDynamicValue', origins: ['root/worldState'] },
    ]);
    expect(result.stats.indexedCallSites).toBe(4);
    expect(result.stats.materializedLocalFields).toBeLessThanOrEqual(3);
    expect(result.stats.fixedPointIterations).toBeLessThan(8);
    expect(result.stats.depthTruncations).toBe(0);
    expect(result.stats.cycleCuts).toBe(0);
  });

  test('closes a detachJson array recurrence without losing its first element', () => {
    const result = scan(`
      function detachJson(value) {
        if (value === null || typeof value !== 'object') return value;
        let detached;
        if (Array.isArray(value)) {
          detached = value.map(entry => detachJson(entry));
        } else {
          detached = {};
          for (const key of Object.keys(value)) {
            detached[key] = detachJson(value[key]);
          }
        }
        return detached;
      }
      function wrapper(value) { return detachJson(value); }
      export function probe(worldState) {
        const rows = wrapper(worldState.rows);
        return [
          wrapper(worldState).__afterRecursiveDetach,
          rows.find(Boolean).__afterRecursiveDetachElement,
        ];
      }
    `);

    // Concrete recursive closure may conservatively retain every reachable
    // executed element origin; the contract here is that neither the root nor
    // the first array element disappears while the recurrence is closed.
    // Captured recursive invocation frames can close this relation directly,
    // without requiring the older Product-to-Plus widening path.
    expect(result.findings
      .filter(({ origins }) => origins[0] !== 'syntax/local-object')
      .map(({ key, origins }) => ({ key, origins }))).toEqual(expect.arrayContaining([
      { key: '__afterRecursiveDetach', origins: ['root/worldState'] },
      { key: '__afterRecursiveDetachElement', origins: ['root/satellite'] },
    ]));
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
    expect(result.stats.maxReadTokenLength).toBeLessThanOrEqual(512);
  });

  test('rejects fresh recursive clone effects without losing source-defined map aliases', () => {
    const result = scan(`
      function detachJson(value) {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') {
          return value;
        }
        if (typeof value === 'number') return value;
        if (typeof value !== 'object') throw new TypeError('JSON only');
        let detached;
        if (Array.isArray(value)) {
          detached = value.map(entry => detachJson(entry));
        } else {
          detached = {};
          for (const key of Object.keys(value)) detached[key] = detachJson(value[key]);
        }
        return detached;
      }
      function normalize(value) {
        const detached = detachJson(value);
        detached.__freshCloneOnly = null;
        return detached;
      }
      function sourceMap(value) { return value; }
      const facade = { map: sourceMap };
      function mutateAlias(value) {
        const alias = facade.map(value);
        alias.__sourceMapAlias = null;
      }
      export function probe(worldState) {
        normalize(worldState);
        mutateAlias(worldState);
        return [
          worldState.__freshCloneOnly,
          worldState.__sourceMapAlias,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__freshCloneOnly', origins: ['root/worldState'] },
    ]);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
    expect(result.stats.maxReadStateGrowth).toBeLessThan(128);
  });

  test('closes direct and mutually recursive array-literal producers', () => {
    const direct = scan(`
      function nest(value) {
        if (value) return value;
        return [nest(value)];
      }
      function wrapper(value) { return nest(value); }
      export function probe(worldState) {
        return wrapper(worldState.rows)
          .find(Boolean).find(Boolean).__afterRecursiveArrayLiteral;
      }
    `);
    expect(direct.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterRecursiveArrayLiteral', origins: ['root/satellite'] },
    ]);
    expect(direct.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);

    const mutual = scan(`
      function left(value) {
        if (value) return value;
        return [right(value)];
      }
      function right(value) {
        if (value) return value;
        return [left(value)];
      }
      function wrapper(value) { return left(value); }
      export function probe(worldState) {
        return wrapper(worldState.rows)
          .find(Boolean).find(Boolean).find(Boolean).__afterMutualArrayLiterals;
      }
    `);
    expect(mutual.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterMutualArrayLiterals', origins: ['root/satellite'] },
    ]);
    expect(mutual.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);
    expect(mutual.stats.abstractStateBudgetFailures).toBe(0);
  });

  test('detects recursive map feedback through a transitive helper', () => {
    const result = scan(`
      function deep(value, terminal) {
        if (Array.isArray(value)) {
          return value.map(child => again(child, terminal));
        }
        return terminal;
      }
      function again(value, terminal) {
        return deep(value, terminal);
      }
      function wrapper(value, terminal) { return deep(value, terminal); }
      export function probe(worldState) {
        const terminal = worldState.rows.find(Boolean);
        const rows = wrapper(worldState.rows, terminal).filter(Boolean);
        return [
          rows.__transitiveMapArraySurface,
          rows.find(Boolean).find(Boolean).__afterTransitiveRecursiveMap,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterTransitiveRecursiveMap', origins: ['root/satellite'] },
    ]);
    expect(result.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);
  });

  test('closes an array literal owned by an inline recursive-map callback', () => {
    const result = scan(`
      function deepen(value) {
        if (Array.isArray(value)) {
          return value.map(child => [deepen(child)]);
        }
        return value;
      }
      function wrapper(value) { return deepen(value); }
      export function probe(worldState) {
        return wrapper(worldState.rows)
          .find(Boolean).find(Boolean).find(Boolean).find(Boolean)
          .__afterInlineArrayProducer;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterInlineArrayProducer', origins: ['root/satellite'] },
    ]);
    expect(result.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
  });

  test('closes recursive Object.values array production', () => {
    const result = scan(`
      function valuesDeep(value) {
        if (value) return value;
        return Object.values({ nested: valuesDeep(value) });
      }
      function wrapper(value) { return valuesDeep(value); }
      export function probe(worldState) {
        return wrapper(worldState.rows)
          .find(Boolean).find(Boolean).__afterRecursiveObjectValues;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterRecursiveObjectValues', origins: ['root/satellite'] },
    ]);
    expect(result.stats.recursiveArrayProducts).toBeGreaterThan(0);
    expect(result.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);
  });

  test('keeps distinct helper call sites exact and closes reuse at one recursive call site', () => {
    const finite = scan(`
      function wrap(value) { return [value]; }
      export function probe(worldState) {
        const twice = wrap(wrap(worldState));
        return [
          twice.find(Boolean).__stillArraySurface,
          twice.find(Boolean).find(Boolean).__afterTwoDistinctCalls,
        ];
      }
    `);

    expect(finite.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterTwoDistinctCalls', origins: ['root/worldState'] },
    ]);
    expect(finite.stats.recursiveArrayPlusClosures).toBe(0);

    const transitive = scan(`
      function wrap(value) { return [value]; }
      function pass(value) { return wrap(value); }
      export function probe(worldState) {
        const twice = pass(pass(worldState));
        return [
          twice.find(Boolean).__transitiveArraySurface,
          twice.find(Boolean).find(Boolean).__afterTransitiveCalls,
        ];
      }
    `);

    expect(transitive.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterTransitiveCalls', origins: ['root/worldState'] },
    ]);
    expect(transitive.stats.recursiveArrayPlusClosures).toBe(0);

    const recursive = scan(`
      function wrap(value) { return [value]; }
      function nest(value) {
        if (value) return value;
        return wrap(nest(value));
      }
      function wrapper(value) { return nest(value); }
      export function probe(worldState) {
        return wrapper(worldState.rows)
          .find(Boolean).find(Boolean).__afterSameSiteRecursion;
      }
    `);

    expect(recursive.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterSameSiteRecursion', origins: ['root/satellite'] },
    ]);
    expect(recursive.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);
    expect(recursive.stats.abstractStateBudgetFailures).toBe(0);
  });

  test('qualifies invocation-owned allocations without splitting captured singletons', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const singleton = { selected: worldState };
        function getSingleton() { return singleton; }
        const firstSingleton = getSingleton();
        const secondSingleton = getSingleton();
        firstSingleton.selected = save;

        const captured = { child: { selected: worldState } };
        function getCapturedChild() { return captured.child; }
        const firstChild = getCapturedChild();
        const secondChild = getCapturedChild();
        firstChild.selected = save;

        function factory() { return { selected: worldState }; }
        const firstFactory = factory();
        const secondFactory = factory();
        firstFactory.selected = save;

        return [
          secondSingleton.selected.__capturedSingleton,
          secondChild.selected.__capturedChild,
          secondFactory.selected.__distinctFactory,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__capturedSingleton', origins: ['root/save'] },
      { key: '__capturedChild', origins: ['root/save'] },
      { key: '__distinctFactory', origins: ['root/worldState'] },
    ]);
  });

  test('lets later invocations mutate prior allocations and keeps singleton writes strong', () => {
    const crossInvocation = scan(`
      function act(previous, create, worldState, save) {
        if (previous) previous.selected = save;
        return create ? { selected: worldState } : previous;
      }
      export function probe(worldState, save) {
        const first = act(null, true, worldState, save);
        act(first, false, worldState, save);
        return first.selected.__crossInvocation;
      }
    `);

    expect(crossInvocation.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__crossInvocation', origins: ['root/save'] },
      { key: '__crossInvocation', origins: ['root/worldState'] },
    ]);

    const mixedLocal = scan(`
      function act(previous, create, worldState, save) {
        let receiver;
        if (create) receiver = { selected: worldState };
        else receiver = previous;
        receiver.selected = create ? worldState : save;
        return receiver;
      }
      export function probe(worldState, save) {
        const first = act(null, true, worldState, save);
        act(first, false, worldState, save);
        return first.selected.__localCrossInvocation;
      }
    `);

    expect(mixedLocal.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__localCrossInvocation', origins: ['root/save'] },
      { key: '__localCrossInvocation', origins: ['root/worldState'] },
    ]);

    const returnedSingleton = scan(`
      export function probe(worldState, save) {
        const singleton = { selected: worldState };
        function getSingleton() { return singleton; }
        Object.assign(getSingleton(), { selected: save });
        return singleton.selected.__strongSingletonWrite;
      }
    `);

    expect(returnedSingleton.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__strongSingletonWrite', origins: ['root/save'] },
    ]);
  });

  test('composes wrapper call sites into invocation-owned heap identities', () => {
    const result = scan(`
      function make(value) { return { selected: value }; }
      function wrap(value) { return make(value); }
      export function probe(worldState, save) {
        const first = wrap(save);
        const second = wrap(worldState);
        first.selected = save;
        return second.selected.__nestedFactoryIdentity;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__nestedFactoryIdentity', origins: ['root/worldState'] },
    ]);
  });

  test('does not split an allocation memoized across wrapper invocations', () => {
    const result = scan(`
      let cached;
      function make(value) { return { selected: value }; }
      function wrap(value) {
        if (cached) return cached;
        cached = make(value);
        return cached;
      }
      export function probe(worldState, save) {
        const first = wrap(worldState);
        const second = wrap(worldState);
        first.selected = save;
        return second.selected.__memoizedWrapperIdentity;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__memoizedWrapperIdentity', origins: ['root/save'] },
    ]);
  });

  test('keeps memoized receiver effects cross-invocation', () => {
    const memoized = scan(`
      let cached;
      function make(value) { return { selected: value }; }
      function wrap(value, selected) {
        if (!cached) cached = make(value);
        cached.selected = selected;
        return cached;
      }
      export function probe(worldState, save) {
        const first = wrap(worldState, worldState);
        wrap(worldState, save);
        return first.selected.__memoOwnerMutation;
      }
    `);

    expect(memoized.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__memoOwnerMutation', origins: ['root/save'] },
    ]);
  });

  test('isolates effects on invocation-owned fresh receivers', () => {
    const invocationOwned = scan(`
      function make(value, selected) {
        const owned = { selected: value };
        owned.selected = selected;
        return owned;
      }
      function wrap(value, selected) { return make(value, selected); }
      export function probe(worldState, save) {
        wrap(worldState, save);
        const second = wrap(worldState, worldState);
        return second.selected.__ownedIsolation;
      }
    `);

    expect(invocationOwned.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__ownedIsolation', origins: ['root/worldState'] },
    ]);
  });

  test('refines Object.keys clone writes to the property currently demanded', () => {
    const result = scan(`
      function detachJson(value) {
        if (value === null || typeof value !== 'object') return value;
        let detached;
        detached = {};
        for (const key of Object.keys(value)) {
          detached[key] = detachJson(value[key]);
        }
        return detached;
      }
      export function probe(worldState, save) {
        const detached = detachJson({
          owner: { selected: worldState },
          decoy: { selected: save },
        });
        return detached.owner.selected.__demandScopedClone;
      }
    `);

    expect(result.findings
      .filter(({ key }) => key === '__demandScopedClone')
      .map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__demandScopedClone', origins: ['root/worldState'] },
    ]);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
    expect(result.stats.maxReadStateGrowth).toBeLessThan(128);
  });

  test('keeps raw recursive-clone effects in the active allocation invocation', () => {
    const result = scan(`
      function detachJson(value) {
        if (value === null || typeof value !== 'object') return value;
        let detached;
        if (Array.isArray(value)) detached = value.map(entry => detachJson(entry));
        else {
          detached = {};
          for (const key of Object.keys(value)) detached[key] = detachJson(value[key]);
        }
        return detached;
      }
      function build(value) {
        return detachJson({ owner: { selected: value } });
      }
      export function probe(worldState, save) {
        build(save);
        const current = build(worldState);
        return current.owner.selected.__activeCloneInvocation;
      }
    `);

    expect(result.findings
      .filter(({ key }) => key === '__activeCloneInvocation')
      .map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__activeCloneInvocation', origins: ['root/worldState'] },
    ]);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
    expect(result.stats.maxReadStateGrowth).toBeLessThan(256);
  });

  test('persists recursive clone frames without splitting stored products', () => {
    const nested = scan(`
      function detachJson(value, path = '$', seen = new Set(), depth = 0) {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') {
          return value;
        }
        if (typeof value === 'number') return value;
        if (typeof value !== 'object') throw new TypeError('JSON only');
        if (seen.has(value)) throw new TypeError('cycle');
        seen.add(value);
        let detached;
        if (Array.isArray(value)) {
          detached = value.map((entry, index) => (
            detachJson(entry, path + '[' + index + ']', seen, depth + 1)
          ));
        } else {
          detached = {};
          for (const key of Object.keys(value)) {
            detached[key] = detachJson(value[key], path + '.' + key, seen, depth + 1);
          }
        }
        seen.delete(value);
        return detached;
      }
      function wrap(value) {
        return detachJson({ nested: { selected: value } });
      }
      export function probe(worldState, save) {
        const first = wrap(worldState);
        wrap(save);
        return first.nested.selected.__nestedCloneInvocation;
      }
    `);

    expect(nested.findings
      .filter(({ key }) => key === '__nestedCloneInvocation')
      .map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__nestedCloneInvocation', origins: ['root/worldState'] },
    ]);
    const stored = scan(`
      let cached;
      function recursiveMemo(value, selected) {
        if (!cached) {
          const product = {};
          product.selected = value;
          cached = product;
        }
        cached.selected = selected;
        if (value.next) recursiveMemo(value.next, selected);
        return cached;
      }
      export function probe(worldState, save) {
        const first = recursiveMemo(worldState, worldState);
        recursiveMemo(worldState, save);
        return first.selected.__storedRecursiveIdentity;
      }
    `);

    expect(stored.findings
      .filter(({ key }) => key === '__storedRecursiveIdentity')
      .map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__storedRecursiveIdentity', origins: ['root/save'] },
    ]);
  });

  test('does not leak element provenance through nonnumeric array properties', () => {
    const result = scan(`
      export function probe(worldState) {
        const product = worldState.rows.map(row => ({ ...row }));
        return [
          worldState.rows['notAnIndex']?.__ordinaryArrayLeak,
          product['alsoNotAnIndex']?.__productArrayLeak,
        ];
      }
    `);

    expect(result.findings).toEqual([]);
    expect(result.stats.recursiveArrayProducts).toBeGreaterThan(0);
  });

  test('preserves symbolic Object.values, array spreads, and literal getter returns', () => {
    const valuesGraph = {
      schema: 2,
      roots: { worldState: [record(['root/worldState'])] },
      origins: {
        'root/worldState': origin('root/worldState', ['child', 'rows'], {
          child: [record(['root/satellite'])],
          rows: [{ kind: 'array', elements: ['root/satellite'] }],
        }),
        'root/satellite': origin('root/satellite', ['id']),
      },
    };
    const result = scan(`
      function values(value) { return Object.values(value); }
      export function probe(worldState) {
        const spread = [...worldState.rows];
        return [
          values(worldState).find(Boolean).__fromObjectValue,
          spread.find(Boolean).__afterSpread,
          Object.values({
            get nested() { return worldState; },
          }).find(Boolean).__afterGetter,
        ];
      }
    `, valuesGraph);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__fromObjectValue', origins: ['root/satellite'] },
      { key: '__afterSpread', origins: ['root/satellite'] },
      { key: '__afterGetter', origins: ['root/worldState'] },
    ]);
  });

  test('instantiates symbolic concat and flat transfers at the caller', () => {
    const result = scan(`
      function append(rows, value) { return rows.concat(value); }
      function flatten(rows) { return rows.flat(); }
      function flattenAt(rows, depth) { return rows.flat(depth); }
      export function probe(worldState, save) {
        return [
          append(worldState.rows, save).find(Boolean).__afterScalarConcat,
          flatten(worldState.matrix).find(Boolean).__afterSymbolicFlat,
          worldState.matrix.flat(-1).find(Boolean)?.__negativeFlatMustNotLeak,
          worldState.matrix.flat(+2).find(Boolean).__afterSignedPositiveFlat,
          flattenAt(worldState.matrix, 0).find(Boolean)?.__paramFlatZeroMustNotLeak,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterScalarConcat', origins: ['root/satellite'] },
      { key: '__afterScalarConcat', origins: ['root/save'] },
      { key: '__afterSymbolicFlat', origins: ['root/satellite'] },
      { key: '__afterSignedPositiveFlat', origins: ['root/satellite'] },
    ]);
  });

  test('applies ordered Object.values fields, call-time getters, and unary arity', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const box = { selected: worldState };
        const holder = {
          get selected() { return box.selected; },
        };
        const captured = Object.values(holder);
        box.selected = save;
        return [
          Object.values({
            get x() { return worldState; },
            x: 0,
          }).find(Boolean)?.__overwrittenGetter,
          Object.values({ ...{ x: worldState }, x: 0 })
            .find(Boolean)?.__overwrittenSpread,
          Object.values({}, worldState).find(Boolean)?.__ignoredExtraArgument,
          captured.find(Boolean).__getterAtValuesCall,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__getterAtValuesCall', origins: ['root/worldState'] },
    ]);
  });

  test('preserves accessors on assignment and snapshots getters when copying', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const accessor = {
          get selected() { return worldState; },
          set selected(value) {},
        };
        accessor.selected = save;

        let current = worldState;
        const holder = {
          get selected() { return current; },
        };
        const spread = { ...holder };
        const assigned = Object.assign({}, holder);
        current = save;
        return [
          accessor.selected.__afterSetterInvocation,
          spread.selected.__spreadGetterSnapshot,
          assigned.selected.__assignGetterSnapshot,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterSetterInvocation', origins: ['root/worldState'] },
      { key: '__spreadGetterSnapshot', origins: ['root/worldState'] },
      { key: '__assignGetterSnapshot', origins: ['root/worldState'] },
    ]);
  });

  test('binds accessor this receivers and preserves Object.assign setter micro-order', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const getter = {
          other: worldState,
          get selected() { return this.other; },
        };
        getter.other = save;

        const setter = {
          other: worldState,
          set selected(value) { this.other = value; },
        };
        setter.selected = save;

        const assigned = {
          other: worldState,
          set selected(value) { this.other = value; },
        };
        Object.assign(assigned, { selected: worldState }, { selected: save });

        return [
          getter.selected.__getterThis,
          setter.other.__setterThis,
          assigned.other.__lastAssignSourceWins,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__getterThis', origins: ['root/save'] },
      { key: '__setterThis', origins: ['root/save'] },
      { key: '__lastAssignSourceWins', origins: ['root/save'] },
    ]);
  });

  test('folds accessor descriptors and setter effects in execution order', () => {
    const result = scan(`
      export function probe(worldState, save) {
        let current = worldState;
        const effect = {
          get selected() { return current; },
          set selected(value) { current = value; },
        };
        effect.selected = save;
        const effected = effect.selected;

        const assignNoop = {
          get selected() { return worldState; },
          set selected(value) {},
        };
        Object.assign(assignNoop, { selected: save });

        const deleted = {
          get selected() { return worldState; },
          set selected(value) {},
        };
        delete deleted.selected;
        deleted.selected = save;

        let skipped = worldState;
        const logical = {
          get selected() { return worldState; },
          set selected(value) { skipped = value; },
        };
        logical.selected ||= save;

        const frozen = { selected: worldState };
        const data = { selected: current };
        current = worldState;
        return [
          effected.__setterEffect,
          assignNoop.selected.__assignSetterNoop,
          deleted.selected.__afterDeleteThenData,
          skipped.__afterSkippedLogicalSetter,
          frozen.selected.__ordinaryDataSnapshot,
          data.selected.__dataInitializerProgramPoint,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__setterEffect', origins: ['root/save'] },
      { key: '__assignSetterNoop', origins: ['root/worldState'] },
      { key: '__afterDeleteThenData', origins: ['root/save'] },
      { key: '__afterSkippedLogicalSetter', origins: ['root/worldState'] },
      { key: '__ordinaryDataSnapshot', origins: ['root/worldState'] },
      { key: '__dataInitializerProgramPoint', origins: ['root/save'] },
    ]);
  });

  test('retains getter values when another field makes the literal mutable', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const holder = {
          get selected() { return worldState; },
          other: worldState,
        };
        holder.other = save;
        return Object.values(holder).map(value => value.__mutatedGetterHolder);
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__mutatedGetterHolder', origins: ['root/save'] },
      { key: '__mutatedGetterHolder', origins: ['root/worldState'] },
    ]);
  });

  test('folds computed mutation cells in execution order', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const replaced = {};
        replaced[key] = worldState;
        replaced[key] = save;

        const deleted = {};
        deleted[key] = worldState;
        delete deleted[key];

        const compound = {};
        compound[key] += worldState;

        const maybe = { x: worldState };
        maybe[key] = save;

        const disjoint = { x: worldState };
        const disjointKey = 'y';
        disjoint[disjointKey] = save;

        const exact = {};
        const exactKey = 'x';
        exact[exactKey] = worldState;
        exact.x = save;

        return [
          Object.values(replaced).find(Boolean).__afterDynamicReplace,
          Object.values(deleted).find(Boolean)?.__afterDynamicDelete,
          Object.values(compound).find(Boolean)?.__afterDynamicCompound,
          compound.selected?.__afterNamedDynamicCompound,
          maybe.x.__afterMaybeAlias,
          disjoint.x.__afterDisjointDynamicWrite,
          Object.values(exact).find(Boolean).__afterExactFieldReplace,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterDynamicReplace', origins: ['root/save'] },
      { key: '__afterMaybeAlias', origins: ['root/save'] },
      { key: '__afterMaybeAlias', origins: ['root/worldState'] },
      { key: '__afterDisjointDynamicWrite', origins: ['root/worldState'] },
      { key: '__afterExactFieldReplace', origins: ['root/save'] },
    ]);
  });

  test('keeps stable computed-key correlation in named facets', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const deleted = { x: save };
        deleted[key] = worldState;
        delete deleted[key];

        const replaced = { x: save };
        replaced[key] = worldState;
        replaced[key] = save;

        return [
          deleted.x.__afterStableDynamicDelete,
          replaced.x.__afterStableDynamicReplace,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: 'x', origins: ['syntax/local-object'] },
      { key: '__afterStableDynamicDelete', origins: ['root/save'] },
      { key: '__afterStableDynamicReplace', origins: ['root/save'] },
    ]);
  });

  test('canonicalizes immutable aliases of one unknown computed key cell', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const alias = key;
        const second = alias;
        const box = {};
        box[key] = worldState;
        box[second] = save;
        return Object.values(box).find(Boolean).__afterUnknownKeyAlias;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterUnknownKeyAlias', origins: ['root/save'] },
    ]);
  });

  test('lets a definite computed write replace spread absence provenance', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const box = { ...worldState };
        const key = 'localOnly';
        box[key] = save;
        return box.localOnly.__afterExactDynamicWrite;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterExactDynamicWrite', origins: ['root/save'] },
    ]);
  });

  test('uses object truthiness and nullishness for logical dynamic cells', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const coalesced = {};
        coalesced[key] = worldState;
        coalesced[key] ??= save;

        const orValue = {};
        orValue[key] = worldState;
        orValue[key] ||= save;

        const andValue = {};
        andValue[key] = worldState;
        andValue[key] &&= save;

        return [
          Object.values(coalesced).find(Boolean).__logicalCoalesceCell,
          Object.values(orValue).find(Boolean).__logicalOrCell,
          Object.values(andValue).find(Boolean).__logicalAndCell,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__logicalCoalesceCell', origins: ['root/worldState'] },
      { key: '__logicalOrCell', origins: ['root/worldState'] },
      { key: '__logicalAndCell', origins: ['root/save'] },
    ]);
  });

  test('preserves stable dynamic cells across spread and Object.assign order', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const first = {};
        first[key] = worldState;
        const second = {};
        second[key] = save;

        const spread = { ...first, ...second };
        const assigned = {};
        assigned[key] = worldState;
        Object.assign(assigned, second);

        return [
          Object.values(spread).find(Boolean).__afterDynamicSpread,
          spread.x?.__afterDynamicSpreadNamed,
          Object.values(assigned).find(Boolean).__afterDynamicAssign,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterDynamicSpread', origins: ['root/save'] },
      { key: 'x', origins: ['syntax/local-object'] },
      { key: '__afterDynamicSpreadNamed', origins: ['root/save'] },
      { key: '__afterDynamicAssign', origins: ['root/save'] },
    ]);
  });

  test('does not let an absent source cell delete a spread destination cell', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const first = {};
        first[key] = worldState;
        const second = {};
        second[key] = save;
        delete second[key];

        const spread = { ...first, ...second };
        const assigned = {};
        assigned[key] = worldState;
        Object.assign(assigned, second);
        return [
          Object.values(spread).find(Boolean).__spreadAbsentMustNotKill,
          Object.values(assigned).find(Boolean).__assignAbsentMustNotKill,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__spreadAbsentMustNotKill', origins: ['root/worldState'] },
      { key: '__assignAbsentMustNotKill', origins: ['root/worldState'] },
    ]);
  });

  test('preserves paired getter descriptors and computed literal cells', () => {
    const result = scan(`
      export function probe(worldState, save, key) {
        const paired = {
          get selected() { return worldState; },
          set selected(value) {},
        };
        const setterOnly = {
          selected: worldState,
          set selected(value) {},
        };
        const computed = {
          [key]: worldState,
          [key]: save,
        };
        const computedPair = {
          get [key]() { return worldState; },
          set [key](value) {},
        };

        return [
          Object.values(paired).find(Boolean).__pairedAccessor,
          Object.values(setterOnly).find(Boolean)?.__setterOnlyKillsData,
          Object.values(computed).find(Boolean).__computedLastWriter,
          Object.values(computedPair).find(Boolean).__computedAccessorPair,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__pairedAccessor', origins: ['root/worldState'] },
      { key: '__computedLastWriter', origins: ['root/save'] },
      { key: '__computedAccessorPair', origins: ['root/worldState'] },
    ]);
  });

  test('does not attribute elements through a plain-record array spread', () => {
    const result = scan(`
      export function probe(worldState) {
        const invalidAtRuntime = [...worldState];
        return invalidAtRuntime.find(Boolean)?.__plainRecordSpread;
      }
    `);

    expect(result.findings).toEqual([]);
  });

  test('closes Object.values through an immutable alias chain', () => {
    const result = scan(`
      function valuesDeep(value) {
        if (value) return value;
        const holder = { nested: valuesDeep(value) };
        const alias = holder;
        const secondAlias = alias;
        return Object.values(secondAlias);
      }
      function wrapper(value) { return valuesDeep(value); }
      export function probe(worldState) {
        return wrapper(worldState.rows)
          .find(Boolean).find(Boolean).__afterAliasedObjectValues;
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterAliasedObjectValues', origins: ['root/satellite'] },
    ]);
    expect(result.stats.recursiveArrayPlusClosures).toBeGreaterThan(0);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
  });

  test('falls back to flow-sensitive locals for mutated Object.values aliases', () => {
    const result = scan(`
      export function probe(worldState, save) {
        const holder = { selected: worldState };
        const alias = holder;
        alias.selected = save;
        let rebound = { selected: worldState };
        rebound = { selected: save };
        return [
          Object.values(alias).find(Boolean).__afterAliasMutation,
          Object.values(rebound).find(Boolean).__afterAliasRebind,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterAliasMutation', origins: ['root/save'] },
      { key: '__afterAliasRebind', origins: ['root/save'] },
    ]);
  });

  test('keeps inline recursive-map callers in separate symbolic contexts', () => {
    const result = scan(`
      function deepInline(value) {
        if (Array.isArray(value)) {
          const out = value.map(child => deepInline(child));
          return out;
        }
        return value;
      }
      function whole(value) { return deepInline(value); }
      function rows(value) { return deepInline(value.rows); }
      export function probe(worldState) {
        return [
          whole(worldState).__afterWholeContext,
          rows(worldState).find(Boolean).__afterRowsContext,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterWholeContext', origins: ['root/worldState'] },
      { key: '__afterRowsContext', origins: ['root/satellite'] },
    ]);
    expect(result.stats.fixedPointIterations).toBeLessThan(10);
    expect(result.stats.depthTruncations).toBe(0);
  });

  test('retains the net array layer from a map that nests each element', () => {
    const result = scan(`
      export function probe(worldState) {
        const nested = worldState.rows.map(child => [child]);
        return [
          nested.find(Boolean).__arraySurfaceOnly,
          nested.find(Boolean)[0].__afterNestedMap,
        ];
      }
    `);

    expect(result.findings.map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__afterNestedMap', origins: ['root/satellite'] },
    ]);
  });

  test('has no call-site or return-alternative truncation caps', () => {
    const rootCount = 42;
    const roots = {};
    const origins = {};
    for (let i = 0; i < rootCount; i += 1) {
      const name = `root${i}`;
      const id = `cap/${name}`;
      roots[name] = [record([id])];
      origins[id] = origin(id, ['written']);
    }
    const params = Array.from({ length: rootCount }, (_, i) => `root${i}`).join(', ');
    const calls = Array.from({ length: rootCount }, (_, i) => `inspect(root${i});`).join('\n');
    const returns = Array.from({ length: 7 }, (_, i) => `if (which === ${i}) return root${i};`).join('\n');
    const result = scan(`
      function inspect(value) { return value.__insideHelper; }
      function choose(which, ${params}) {
        ${returns}
        return root6;
      }
      export function probe(${params}) {
        ${calls}
        return choose(0, ${params}).__afterSevenReturns;
      }
    `, { schema: 2, roots, origins });

    expect(result.findings.filter((finding) => finding.key === '__insideHelper')).toHaveLength(42);
    expect(result.findings.filter((finding) => finding.key === '__afterSevenReturns')).toHaveLength(7);
    expect(result.stats.indexedCallSites).toBeGreaterThanOrEqual(43);
  });

  // ── NEGATIVE CONTROLS FOR THE ONE CANONICAL DEPENDENCY-STATE IDENTITY ──────
  // Both fail if the frame-cell coordinate ever collapses — if two invocations
  // of one function share a cache entry, each of these unions a second origin
  // in. They are the counterweight to the identity's whole purpose (memoizing
  // ACROSS repeat visits at the SAME dependency state), and they are the two
  // controls the S12-OSR-FP resume order names at step 5.

  test('exact-origin non-crossing: a later invocation never reaches an earlier product', () => {
    // Mirror of "isolates effects on invocation-owned fresh receivers", read
    // through the FIRST invocation instead of the second. The allocation is an
    // empty shell, so both invocations share one base local token and ONLY the
    // frame cell distinguishes them; a collapsed cell leaks `root/save`
    // backwards into the earlier product.
    const result = scan(`
      function make(value) {
        const owned = {};
        owned.holder = value;
        return owned;
      }
      function wrap(value) { return make(value); }
      export function probe(worldState, save) {
        const first = wrap(worldState);
        wrap(save);
        return first.holder.__exactOriginNonCrossing;
      }
    `);

    expect(result.findings
      .filter(({ key }) => key === '__exactOriginNonCrossing')
      .map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__exactOriginNonCrossing', origins: ['root/worldState'] },
    ]);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
  });

  test('captured-mutable: a closed-over binding keeps each call site its own version', () => {
    // The captured `latest` is written through a helper, so its writes are
    // ordered by INVOCATION SITE rather than by lexical position — the version
    // the second reader sees is a different binding version from the first's.
    // `read` takes its receiver as a PARAMETER, so the answer also depends on
    // `resolveParam`, whose approximation is keyed on the raw binding and whose
    // ONLY execution-context discriminator is the dependency state.
    const result = scan(`
      let latest;
      function stash(value) { latest = value; }
      function held() { return { carried: latest }; }
      function read(box) { return box.carried; }
      export function probe(worldState, save) {
        stash(worldState);
        const early = held();
        stash(save);
        const late = held();
        read(early);
        return read(late).__capturedMutable;
      }
    `);

    expect(result.findings
      .filter(({ key }) => key === '__capturedMutable')
      .map(({ key, origins }) => ({ key, origins }))).toEqual([
      { key: '__capturedMutable', origins: ['root/save'] },
    ]);
    expect(result.stats.abstractStateBudgetFailures).toBe(0);
  });
});
