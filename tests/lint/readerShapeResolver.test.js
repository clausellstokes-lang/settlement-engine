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
    expect(result.stats.materializedLocalFields).toBe(1);
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
      { key: '__afterAnd', origins: ['root/worldState'] },
      { key: '__beforeDelete', origins: ['root/worldState'] },
      { key: 'deleted', origins: ['syntax/local-object'] },
      { key: 'assigned', origins: ['syntax/local-object'] },
      { key: '__afterAssign', origins: ['root/save'] },
      { key: 'before', origins: ['syntax/local-object'] },
      { key: '__afterNested', origins: ['root/worldState'] },
      { key: '__afterSignedMutation', origins: ['root/save'] },
    ]);
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
      { function duplicate(worldState) { return worldState.__duplicateOwner; } }
      { function duplicate(worldState) { return worldState.__duplicateOwner; } }
      export function probe(worldState) {
        left.read(worldState);
        right.read(worldState);
      }
    `);
    const owners = result.findings.map(({ site }) => decodeURIComponent(
      /(?:^|\|)owner=([^|]+)/.exec(site)[1],
    ));

    expect(new Set(result.findings.map(({ site }) => site)).size).toBe(4);
    expect(owners).toEqual(expect.arrayContaining([
      'object-binding:left#0/method:read#0',
      'object-binding:right#0/method:read#0',
      'function:duplicate#0',
      'function:duplicate#1',
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
    expect(result.stats.resolvedSccBackEdges).toBe(1);
    expect(result.stats.cycleCuts).toBe(0);
    expect(result.stats.depthTruncations).toBe(0);
    expect(result.stats.fixedPointIterations).toBeLessThan(8);
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
});
