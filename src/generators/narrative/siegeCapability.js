/**
 * narrative/siegeCapability.js — turns a recent military or political event
 * into the history-informed tension sentence used by the coherence pass.
 */

/**
 * Return a string describing the current state of tensions when recent history
 * supports one. Historical pass-through behavior is preserved for callers
 * that provide no qualifying event; generateCoherence deliberately filters
 * those non-string returns before storing `history.siegeNarrative`.
 */
export const generateSiegeCapability = (
  historicalEvents,
  currentTensions,
  age,
) => {
  if (!historicalEvents || historicalEvents.length === 0) {
    return currentTensions;
  }

  const recentEvents = historicalEvents
    .slice(0, 3)
    .filter(event => event.yearsAgo < Math.max(30, age * 0.3));
  if (!recentEvents.length) return currentTensions;

  const hasMilitaryHistory = recentEvents.some(
    event => event.type === 'political' || event.type === 'disaster',
  );
  if (!hasMilitaryHistory) return currentTensions;

  const recentEvent = recentEvents[0];
  if (!recentEvent?.name) return currentTensions;

  // currentTensions is normally an array of history tension records. Rendering
  // that array directly produced "[object Object]"; choose the first usable
  // piece of authored prose and retain the legacy fallback when none exists.
  const tensionList = Array.isArray(currentTensions)
    ? currentTensions
    : [currentTensions];
  const primaryTension = tensionList
    .map(tension =>
      typeof tension === 'string'
        ? tension
        : tension?.title || tension?.description || tension?.type
    )
    .find(Boolean);
  const eventName = String(recentEvent.name).replace(
    /^(?:the|a|an)\s+/i,
    '',
  );
  const tensionClause = String(
    primaryTension || 'its effects shape current decisions',
  ).trim();
  const punctuatedTension = /[.!?]$/.test(tensionClause)
    ? tensionClause
    : `${tensionClause}.`;

  return (
    `The ${eventName} is still present in living memory — ` +
    punctuatedTension
  );
};
