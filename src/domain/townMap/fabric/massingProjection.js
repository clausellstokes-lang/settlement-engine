/** Replay-closed fixed-survey projection for the explicit first-slice massing bundle. */

import { stableSceneStringify } from '../../townScene/stableScene.js';
import { compileOrthogonalCrossFirstSliceMassingRosterBundle } from './massingRoster.js';
import { requireCanonicalRecord } from './foundation.js';
import { loadFirstSliceMassingDocument } from './content.js';
import { projectResolvedFirstSliceFixedSurvey } from './projection.js';

export const FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION =
  'mf-t1v-first-slice-massing-fixed-survey-v1';
export const FIRST_SLICE_MASSING_DOCUMENT_PROJECTION_LAW_VERSION =
  'mf-t1s-first-slice-massing-document-fixed-survey-v1';

const INPUT_KEYS = Object.freeze(['audience', 'massingBundle', 'massingCompileInput']);
const SAVED_INPUT_KEYS = Object.freeze(['audience', 'bytes', 'installedRecipeSnapshots']);

/** @param {unknown} value @param {string} label @param {readonly string[]} keys */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  if (JSON.stringify(Object.keys(record).sort()) !== JSON.stringify([...keys].sort())) {
    throw new TypeError(`${label} must contain exactly ${keys.join(', ')}`);
  }
  return record;
}

/**
 * @param {{audience:unknown,compileInput:Record<string,unknown>,bundle:Record<string,unknown>,
 *   unresolvedEntityIds:string[],sourceDescriptor:Record<string,unknown>}} input
 */
function projectPreparedMassing(input) {
  return projectResolvedFirstSliceFixedSurvey({
    audience: input.audience,
    foundation: input.compileInput.foundation,
    frontageSubdivision: input.compileInput.frontageSubdivision,
    masses: input.bundle.buildingMasses,
    unresolvedEntityIds: input.unresolvedEntityIds,
    sourceDescriptor: input.sourceDescriptor,
  });
}

/** @param {unknown} input */
export function projectOrthogonalCrossFirstSliceMassingFixedSurvey(input) {
  const request = exactRecord(input, 'massing projection input', INPUT_KEYS);
  const audience = request.audience;
  const compileInput = requireCanonicalRecord(
    JSON.parse(stableSceneStringify(request.massingCompileInput)), 'massingCompileInput',
  );
  const suppliedBytes = stableSceneStringify(request.massingBundle);
  const replayedBundle = compileOrthogonalCrossFirstSliceMassingRosterBundle(compileInput);
  if (suppliedBytes !== stableSceneStringify(replayedBundle)) {
    throw new TypeError('massingBundle does not replay through its sole compiler');
  }
  return projectPreparedMassing({
    audience, compileInput, bundle: replayedBundle,
    unresolvedEntityIds: [],
    sourceDescriptor: {
      kind: 'MASSING',
      lawVersion: FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION,
      massingRoster: replayedBundle.massingRoster,
    },
  });
}

/** @param {unknown} input */
export function projectSavedOrthogonalCrossFirstSliceMassingFixedSurvey(input) {
  const request = exactRecord(
    JSON.parse(stableSceneStringify(input)), 'saved massing projection input', SAVED_INPUT_KEYS,
  );
  if (!Array.isArray(request.installedRecipeSnapshots)) {
    throw new TypeError('installedRecipeSnapshots must be an array');
  }
  const loaded = loadFirstSliceMassingDocument(
    /** @type {string} */ (request.bytes),
    /** @type {Array<Record<string,unknown>>} */ (request.installedRecipeSnapshots),
  );
  const massingDocument = requireCanonicalRecord(loaded.document, 'loaded massing document');
  const compileInput = requireCanonicalRecord(massingDocument.massingCompileInput, 'massingCompileInput');
  const bundle = requireCanonicalRecord(massingDocument.massingBundle, 'massingBundle');
  const report = requireCanonicalRecord(loaded.resolutionReport, 'resolutionReport');
  const unresolved = Array.isArray(report.unresolved) ? report.unresolved : [];
  const unresolvedEntityIds = unresolved.map((value) => {
    const row = requireCanonicalRecord(value, 'unresolved row');
    const subject = requireCanonicalRecord(row.subject, 'unresolved subject');
    return String(subject.entityId);
  });
  return projectPreparedMassing({
    audience: request.audience,
    compileInput,
    bundle,
    unresolvedEntityIds,
    sourceDescriptor: {
      kind: 'MASSING_DOCUMENT',
      lawVersion: FIRST_SLICE_MASSING_DOCUMENT_PROJECTION_LAW_VERSION,
      document: massingDocument,
      resolutionReport: report,
    },
  });
}
