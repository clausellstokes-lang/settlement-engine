/**
 * WR-5's narrow H2 -> war-termination provenance seam.
 *
 * A raw npcAgency exposure is evidence that somebody was organically ousted;
 * it is not evidence that H2 sentenced and stripped that exact officeholder.
 * This leaf owns the fail-closed receipt schema and its two-flag persistence home.
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {string} a @param {string} b @returns {number} */
function codepointCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

const AUTHORITY_VERDICTS = Object.freeze(new Set([
  'jailed',
  'banished',
  'turncoat',
  'criminal_founding',
]));

/** @type {ReadonlyArray<Readonly<Record<string, unknown>>>} */
const EMPTY_WAR_AUTHORITY_VERDICTS = Object.freeze([]);

/**
 * Fail-closed projection of the one receipt WR-5 is allowed to consume.
 *
 * @param {unknown} raw
 * @returns {Readonly<Record<string, unknown>>|null}
 */
function normalizedWarAuthorityVerdict(raw) {
  const event = asObject(raw);
  const id = typeof event.id === 'string' ? event.id : '';
  const settlementId = typeof event.settlementId === 'string' ? event.settlementId : '';
  const npcId = typeof event.npcId === 'string' ? event.npcId : '';
  const rosterId = typeof event.rosterId === 'string' ? event.rosterId : '';
  const verdict = typeof event.verdict === 'string' ? event.verdict : '';
  const tick = event.tick;
  if (event.kind !== 'npc_verdict'
    || event.source !== 'applyNpcVerdict'
    || event.exposureKind !== 'ousted'
    || !id
    || !settlementId
    || !npcId
    || !rosterId
    || npcId !== `${settlementId}:${rosterId}`
    || !AUTHORITY_VERDICTS.has(verdict)
    || typeof tick !== 'number'
    || !Number.isFinite(tick)
    || !Number.isInteger(tick)
    || tick < 0) return null;
  return Object.freeze({
    id,
    kind: 'npc_verdict',
    source: 'applyNpcVerdict',
    settlementId,
    npcId,
    rosterId,
    verdict,
    exposureKind: 'ousted',
    tick,
  });
}

/**
 * Persistence projection for H2 authority provenance. The extra identity bytes
 * exist only inside WR-5's own two-flag receipt home; either dark flag returns
 * the shared empty list and pulseKernel omits the field entirely.
 *
 * @param {unknown} rawRules
 * @param {unknown} rawVerdicts
 * @returns {ReadonlyArray<Readonly<Record<string, unknown>>>}
 */
export function warAuthorityVerdictsForPulse(rawRules, rawVerdicts) {
  const rules = asObject(rawRules);
  if (rules.warLayerEnabled !== true || rules.warTerminationEnabled !== true) {
    return EMPTY_WAR_AUTHORITY_VERDICTS;
  }
  const byId = new Map();
  for (const raw of Array.isArray(rawVerdicts) ? rawVerdicts : []) {
    const event = normalizedWarAuthorityVerdict(raw);
    if (event && !byId.has(event.id)) byId.set(event.id, event);
  }
  if (byId.size === 0) return EMPTY_WAR_AUTHORITY_VERDICTS;
  return Object.freeze([...byId.values()].sort((a, b) => (
    Number(a.tick) - Number(b.tick)
    || codepointCompare(String(a.id), String(b.id))
  )));
}

/**
 * Newest persisted H2 verdict for the exact prior ruler during this deployment.
 * A semantic authority change or raw organic ouster alone never qualifies.
 *
 * @param {Record<string,unknown>} state
 * @param {string} settlementId
 * @param {string} rulerId
 * @param {number} beforeTick
 * @param {number} sinceTick
 * @param {unknown[]} [currentVerdicts]
 * @returns {string|null}
 */
export function corruptionVerdictIdFor(
  state,
  settlementId,
  rulerId,
  beforeTick,
  sinceTick,
  currentVerdicts = [],
) {
  if (!settlementId || !rulerId) return null;
  /** @type {Array<Readonly<Record<string, unknown>>>} */
  const candidates = [];
  for (const rawEvent of Array.isArray(currentVerdicts) ? currentVerdicts : []) {
    const event = normalizedWarAuthorityVerdict(rawEvent);
    if (event
      && event.tick === beforeTick
      && event.tick >= sinceTick
      && event.settlementId === settlementId
      && event.npcId === rulerId) candidates.push(event);
  }
  const history = Array.isArray(state.pulseHistory) ? state.pulseHistory : [];
  for (const rawPulse of history) {
    const pulse = asObject(rawPulse);
    const pulseTick = pulse.tick;
    if (typeof pulseTick !== 'number'
      || !Number.isFinite(pulseTick)
      || !Number.isInteger(pulseTick)
      || pulseTick < sinceTick
      || pulseTick >= beforeTick) continue;
    const events = Array.isArray(pulse.warAuthorityVerdicts) ? pulse.warAuthorityVerdicts : [];
    for (const rawEvent of events) {
      const event = normalizedWarAuthorityVerdict(rawEvent);
      if (!event
        || event.tick !== pulseTick
        || event.settlementId !== settlementId
        || event.npcId !== rulerId) continue;
      candidates.push(event);
    }
  }
  candidates.sort((a, b) => (
    Number(b.tick) - Number(a.tick)
    || codepointCompare(String(a.id), String(b.id))
  ));
  return candidates.length ? String(candidates[0].id) : null;
}
