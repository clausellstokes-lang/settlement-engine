/**
 * pendingSaveDraft.js — a crash/stall safety net for the one place a refresh
 * destroys real work: a generated dossier that is mid-save.
 *
 * The generated settlement is deliberately NOT persisted in the store (it is a
 * large object; the store's partialize skips it on purpose). So if the Save
 * button stalls — historically a hung Supabase write with no timeout wedged it
 * forever — and the user refreshes to recover, the dossier and every edit go
 * with it.
 *
 * The net: write the save payload to localStorage the instant before the network
 * call, and clear it the instant the save lands. If the page is reloaded while a
 * save is in flight (or after one failed), the draft survives and GenerateWizard
 * offers to restore it. Cleared on success, so a completed save never resurrects.
 *
 * Best-effort by construction: every operation is wrapped so a disabled/quota-
 * full localStorage degrades to "no net" rather than throwing into the save path.
 */

const KEY = 'sf_pending_save_draft';
// Skip pathologically large blobs rather than risk a QuotaExceededError mid-save.
// A normal dossier serializes well under this; a metropolis with full AI prose
// and history is the upper bound we still want to protect.
const MAX_BYTES = 4 * 1024 * 1024;
// A draft older than a day is stale (the user moved on); never resurrect it.
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Stash a save payload before attempting the network save.
 * @param {{ name?: string, tier?: string, settlement: any, config?: any }} payload
 */
export function writeDraft(payload) {
  try {
    if (!payload?.settlement) return;
    const json = JSON.stringify({ ...payload, savedAt: Date.now() });
    if (json.length > MAX_BYTES) return; // too big to stash safely
    localStorage.setItem(KEY, json);
  } catch { /* storage unavailable / quota — a best-effort net never throws */ }
}

/**
 * Read a recoverable draft, or null if none / stale / malformed. Self-healing:
 * a malformed or expired record is cleared on read so it can't linger.
 * @returns {{ name?: string, tier?: string, settlement: any, config?: any, savedAt?: number } | null}
 */
export function readDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    if (!record?.settlement) { clearDraft(); return null; }
    if (typeof record.savedAt === 'number' && Date.now() - record.savedAt > MAX_AGE_MS) {
      clearDraft();
      return null;
    }
    return record;
  } catch {
    return null;
  }
}

/** Drop the stashed draft (on successful save, or when the user dismisses it). */
export function clearDraft() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
