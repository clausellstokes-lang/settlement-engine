import { describe, expect, it } from 'vitest';

import {
  createFantasyConstructionOperation,
  executeFantasyConstruction,
  registerFantasyConstructionMechanism,
  resolveFirstSliceContent,
  saveFirstSliceDocument,
} from '../../src/domain/townMap/fabric/index.js';
import { stableSceneStringify } from '../../src/domain/townScene/stableScene.js';
import {
  makeBuildingSpec,
  makeEmptyFirstSliceDocument,
  makeOrigin,
  makeRecipeSnapshot,
  refOf,
} from '../fixtures/townMapFirstSliceFixtures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

function operationFixture() {
  const document = makeEmptyFirstSliceDocument();
  const mechanism = registerFantasyConstructionMechanism({
    mechanismId: 'mechanism:necromantic-construction:v1',
    mechanismVersion: 1,
    allowedSemanticTypeIds: ['semantic:necromantic-observatory'],
  });
  const operation = createFantasyConstructionOperation({
    operationId: 'op:construct-observatory:001',
    beforeDocumentRef: refOf(document),
    mechanismRef: refOf(mechanism),
    spec: makeBuildingSpec(document.subdivision),
    recipeSnapshot: makeRecipeSnapshot('BUILT_IN'),
    origin: makeOrigin('AUTHORED'),
  });
  const loaded = {
    document,
    resolutionReport: resolveFirstSliceContent(document, []),
    readOnly: false,
  };
  return { document, mechanism, operation, loaded };
}

describe('MF-VS1 registered fantasy construction', () => {
  it('executes from explicit canon without fabricated historical evidence', () => {
    const fixture = operationFixture();
    const result = executeFantasyConstruction({
      loaded: fixture.loaded,
      operation: fixture.operation,
      mechanismRegistry: [fixture.mechanism],
    });
    expect(result.afterDocument.masses).toHaveLength(1);
    expect(result.receipt.effect).toMatchObject({
      kind: 'BUILDING_ADDED',
      buildingId: 'building:necromantic-observatory:001',
    });
    const bytes = stableSceneStringify({ mechanism: fixture.mechanism, operation: fixture.operation });
    expect(bytes).toContain('EXPLICIT_FANTASY_CANON');
    // anchored: the same serialized operation positively carries its explicit fantasy gate
    expect(bytes).not.toMatch(/historicalEvidence|probabilityProtocol|HEEP|AMP|RSLP/);
    expectAbsentWithAnchor(bytes, 'historicalEvidence', 'EXPLICIT_FANTASY_CANON', 'fantasy authority');
  });

  it('replays byte-identically and refuses wrong-before or unresolved mutation', () => {
    const fixture = operationFixture();
    const execute = () => executeFantasyConstruction({
      loaded: fixture.loaded,
      operation: fixture.operation,
      mechanismRegistry: [fixture.mechanism],
    });
    const first = execute();
    const second = execute();
    expect(stableSceneStringify(first)).toBe(stableSceneStringify(second));
    expect(saveFirstSliceDocument(first.afterDocument)).toBe(saveFirstSliceDocument(second.afterDocument));

    expect(() => executeFantasyConstruction({
      loaded: { ...fixture.loaded, document: first.afterDocument },
      operation: fixture.operation,
      mechanismRegistry: [fixture.mechanism],
    })).toThrow(/beforeDocumentRef/);

    expect(() => executeFantasyConstruction({
      loaded: { ...fixture.loaded, readOnly: true },
      operation: fixture.operation,
      mechanismRegistry: [fixture.mechanism],
    })).toThrow(/read-only/);
  });
});
