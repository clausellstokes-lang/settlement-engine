export function savePhase(save) {
  return save?.phase
    || save?.campaignState?.phase
    || save?.settlement?.phase
    || save?.settlement?.campaignState?.phase
    || 'draft';
}

export function saveCanonizedAt(save) {
  return save?.canonizedAt
    || save?.campaignState?.canonizedAt
    || save?.settlement?.canonizedAt
    || save?.settlement?.campaignState?.canonizedAt
    || null;
}

export function isCanonSave(save) {
  return savePhase(save) === 'canon' || Boolean(saveCanonizedAt(save));
}
