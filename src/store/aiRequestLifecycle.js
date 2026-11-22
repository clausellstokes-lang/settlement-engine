/**
 * Shared AI request lifecycle policy and presentation copy.
 *
 * Narrative, Daily Life, and Progression each have different payloads but share
 * the same stale-request law: only the current request for the current save may
 * commit. A request whose view moved may release the loading lock; a superseded
 * request touches nothing.
 */

export const NARRATIVE_FIELD_LABELS = Object.freeze({
  thesis: 'Writing the settlement\u2019s identity',
  institutions: 'Polishing institution descriptions',
  'powerStructure.factions': 'Reweaving faction blurbs',
  npcs: 'Voicing the NPCs',
  stress: 'Grounding the stressors',
  'powerStructure.conflicts': 'Sharpening the conflicts',
  history: 'Retelling the past',
  economicViability: 'Rethinking the economy',
  identityMarkers: 'Marking signature details',
  frictionPoints: 'Surfacing local grievances',
  connectionsMap: 'Mapping the political web',
  dmCompass: 'Drafting DM guidance',
});

export const DAILY_LIFE_FIELD_LABELS = Object.freeze({
  dawn: 'Lighting the dawn',
  morning: 'Opening the market',
  midday: 'Gathering for midday',
  evening: 'Filling the tavern',
  night: 'Walking the night watch',
});

export const ROTATING_AI_PROGRESS = Object.freeze([
  'Summoning the scribes\u2026',
  'Consulting the archives\u2026',
  'Weaving the threads\u2026',
  'Polishing the prose\u2026',
  'Almost there\u2026',
]);

export function aiRequestDisposition(get, requestId, saveId) {
  if ((get().aiRequestId || 0) !== requestId) return 'abandon';
  if (String(get().activeSaveId) !== String(saveId)) return 'release';
  return 'commit';
}

/**
 * A failed paid request may have been refunded server-side. Refresh the ledger
 * without blocking teardown, and re-check request identity before landing it.
 */
export function resyncCreditBalanceAfterFailure(get, requestId, saveId) {
  import('../lib/stripe.js')
    .then(({ fetchCreditBalance }) => fetchCreditBalance())
    .then((balance) => {
      if (
        typeof balance === 'number'
        && aiRequestDisposition(get, requestId, saveId) === 'commit'
      ) {
        get().setCreditBalance(balance);
      }
    })
    .catch(() => {
      // Best effort; ordinary account hydration repairs the balance later.
    });
}
