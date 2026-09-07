/**
 * proseFieldLabels.js — the one display-label vocabulary for the queue-wired
 * prose paths.
 *
 * WHY THIS IS A LEAF. The map was born inside WorkbenchProseEditor.jsx, which
 * is correct while it has one consumer and wrong the moment it has two: the
 * Versions-tab diff view (VersionDiffView.jsx) needs the same path-to-label
 * vocabulary to name a changed field in plain words, and a lazy leaf importing
 * the editor component would drag the whole authoring panel into the diff
 * chunk. Extracted here as pure frozen data with zero imports, so both
 * surfaces share ONE spelling and neither pulls the other's UI.
 *
 * WorkbenchProseEditor re-exports PROSE_FIELD_LABELS so its existing importers
 * and its lockstep pin (tests/components/workbenchProseEditor.test.jsx, which
 * holds the map in exact agreement with QUEUE_WIRED_PROSE_PATHS) are untouched.
 *
 * One string each, vetoable.
 */

/**
 * Display labels for every queue-wired prose path, per entity kind. Kept in
 * exact lockstep with QUEUE_WIRED_PROSE_PATHS by
 * tests/components/workbenchProseEditor.test.jsx.
 */
export const PROSE_FIELD_LABELS = Object.freeze({
  faction: Object.freeze([
    { path: 'desc', label: 'Description' },
  ]),
  institution: Object.freeze([
    { path: 'desc', label: 'Description' },
  ]),
  settlement: Object.freeze([
    { path: 'arrivalScene', label: 'Arrival scene' },
    { path: 'pressureSentence', label: 'Pressure summary' },
    { path: 'settlementReason', label: 'Origin note' },
    { path: 'prominentRelationship.phrasing', label: 'Prominent relationship' },
    { path: 'history.historicalCharacter', label: 'Historical character' },
    { path: 'history.founding.reason', label: 'Founding reason' },
    { path: 'history.founding.initialChallenge', label: 'Founding challenge' },
    { path: 'history.founding.overcoming', label: 'How the challenge was overcome' },
    { path: 'history.founding.stressNote', label: 'Founding stress note' },
    { path: 'history.founding.foundedBy', label: 'Founded by' },
    { path: 'economicViability.summary', label: 'Outlook summary' },
    { path: 'economicState.safetyProfile.safetyDesc', label: 'Safety, as first surveyed' },
    { path: 'economicState.safetyProfile.guardEffectivenessDesc', label: 'Guard effectiveness, as first surveyed' },
    { path: 'economicState.safetyProfile.economicDragDesc', label: 'Economic drag, as first surveyed' },
  ]),
});
