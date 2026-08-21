export const ACTIVE_SAVE_STATE = 'active';
export const INACTIVE_PLAN_SAVE_STATE = 'inactive_plan';
export const PENDING_DELETE_SAVE_STATE = 'pending_delete';

export function saveAccessState(save) {
  return save?.accessState || save?.access_state || ACTIVE_SAVE_STATE;
}

export function isSaveActive(save) {
  return saveAccessState(save) === ACTIVE_SAVE_STATE;
}

export function isPlanInactiveSave(save) {
  return saveAccessState(save) === INACTIVE_PLAN_SAVE_STATE;
}

export function activeSaveCount(saves) {
  return (saves || []).filter(isSaveActive).length;
}

export function inactiveRetentionCount(saves) {
  return (saves || []).filter(save => !isSaveActive(save)).length;
}
