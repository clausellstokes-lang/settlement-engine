/** Replay-closed fixed-survey projection for the explicit first-slice massing bundle. */

import { stableSceneStringify } from '../../townScene/stableScene.js';
import { compileOrthogonalCrossFirstSliceMassingRosterBundle } from './massingRoster.js';
import { requireCanonicalRecord } from './foundation.js';
import { projectResolvedFirstSliceFixedSurvey } from './projection.js';

export const FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION =
  'mf-t1v-first-slice-massing-fixed-survey-v1';

const INPUT_KEYS = Object.freeze(['audience', 'massingBundle', 'massingCompileInput']);

/** @param {unknown} value @param {string} label @param {readonly string[]} keys */
function exactRecord(value, label, keys) {
  const record = requireCanonicalRecord(value, label);
  if (JSON.stringify(Object.keys(record).sort()) !== JSON.stringify([...keys].sort())) {
    throw new TypeError(`${label} must contain exactly ${keys.join(', ')}`);
  }
  return record;
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
  return projectResolvedFirstSliceFixedSurvey({
    audience,
    foundation: compileInput.foundation,
    frontageSubdivision: compileInput.frontageSubdivision,
    masses: replayedBundle.buildingMasses,
    unresolvedEntityIds: [],
    sourceDescriptor: {
      kind: 'MASSING',
      lawVersion: FIRST_SLICE_MASSING_PROJECTION_LAW_VERSION,
      massingRoster: replayedBundle.massingRoster,
    },
  });
}
