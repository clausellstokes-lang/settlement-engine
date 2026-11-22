/**
 * Loosely-shaped save/settlement record from which canon state is read.
 * @typedef {Object} CanonSaveLike
 * @property {string} [phase]
 * @property {number|string|null} [canonizedAt]
 * @property {{phase?: string, canonizedAt?: number|string|null}} [campaignState]
 * @property {CanonSaveLike} [settlement]
 */

/**
 * @param {CanonSaveLike|null|undefined} save
 * @returns {string}
 */
export function savePhase(save) {
  return save?.phase
    || save?.campaignState?.phase
    || save?.settlement?.phase
    || save?.settlement?.campaignState?.phase
    || 'draft';
}

/**
 * @param {CanonSaveLike|null|undefined} save
 * @returns {number|string|null}
 */
export function saveCanonizedAt(save) {
  return save?.canonizedAt
    || save?.campaignState?.canonizedAt
    || save?.settlement?.canonizedAt
    || save?.settlement?.campaignState?.canonizedAt
    || null;
}

/**
 * @param {CanonSaveLike|null|undefined} save
 * @returns {boolean}
 */
export function isCanonSave(save) {
  return savePhase(save) === 'canon' || Boolean(saveCanonizedAt(save));
}
