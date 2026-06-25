/**
 * useAdvanceSession.js — Advance-scaling Stage 4: the multi-tick advance session
 * state + its advance / resume / undo handlers, lifted out of WorldMap.jsx to hold
 * the file's size ratchet (a focused hook, not a god-component decomposition).
 *
 * The session is an object {phase:'idle'|'running'|'paused', ticksDone, ticksTotal}
 * that REPLACES the old boolean `worldPulseBusy`. It drives:
 *   - the toolbar's determinate progress bar ("Advancing N of Y") while running
 *   - the resume chip + the busy guard (phase !== 'idle') against a double-advance
 *
 * FLAG BEHAVIOUR: with FLAGS.advanceMultiTick OFF the single-tick path never returns
 * status:'paused', so `phase` only ever toggles idle↔running — byte-equivalent to the
 * prior boolean. `multiTickOn` is exposed so callers can flag-gate the UI affordances.
 *
 * Returns the legacy `worldPulseBusy` alias (phase !== 'idle') so every existing read
 * is unchanged, plus `advancing` (phase === 'running') for the Pulse skeleton — which
 * must NOT show while paused (the paused banner takes over there).
 */

import { useCallback, useState } from 'react';
import { flag } from '../lib/flags.js';
import { useStore } from '../store/index.js';
import { ADVANCE_ERROR_TEXT } from './useRealmInspector.js';

// Interval → real one-week tick count, mirroring the domain's weeksPerInterval.
// Seeds the progress bar's "of Y" total at click time without importing the heavy
// (lazy-loaded) domain module. The legacy single-tick path collapses this to 1.
const ADVANCE_TICKS = { one_week: 1, one_month: 4, one_season: 12, one_year: 48 };

const IDLE = { phase: 'idle', ticksDone: 0, ticksTotal: 0 };

export function useAdvanceSession({ activeCampaignId, worldPulseInterval, openInspectorAt, showToast }) {
  const advanceCampaignWorld = useStore(s => s.advanceCampaignWorld);
  const resolveIntervalMajors = useStore(s => s.resolveIntervalMajors);
  const undoLastPulse = useStore(s => s.undoLastPulse);

  const [advanceSession, setAdvanceSession] = useState(IDLE);
  // Legacy alias: "not idle". Every prior worldPulseBusy read maps to this.
  const worldPulseBusy = advanceSession.phase !== 'idle';
  const multiTickOn = flag('advanceMultiTick');

  const performAdvanceRealm = useCallback(async () => {
    if (!activeCampaignId || advanceSession.phase !== 'idle') return;
    // ticksTotal is the interval's real week-count on the multi-tick path (1 on the
    // legacy single-tick path), so the progress bar reads N of Y.
    setAdvanceSession({ phase: 'running', ticksDone: 0, ticksTotal: ADVANCE_TICKS[worldPulseInterval] || 1 });
    openInspectorAt('pulse');
    // Set true on a paused result so the finally does NOT reset to idle — the
    // session must hold 'paused' until the DM resumes or undoes.
    let paused = false;
    try {
      const result = await advanceCampaignWorld(activeCampaignId, worldPulseInterval);
      // A multi-tick advance that PAUSED at a fork: hold the session in 'paused' so
      // the toolbar resume chip + progress reflect the partial run. The WorldPulse
      // panel renders the amber banner with the batched majors (it reads the cursor
      // off worldState). A completed/legacy advance falls through to idle below.
      if (result && result.status === 'paused') {
        paused = true;
        setAdvanceSession({ phase: 'paused', ticksDone: result.ticksDone || 0, ticksTotal: result.ticksTotal || 0 });
        return;
      }
      if (result && result.ok !== false) {
        // result.cloudPending means the advance is real locally but did not finish
        // reaching the cloud — show an honest cloud-pending notice rather than a
        // 'Realm advanced' success (which would contradict the sync banner) or a
        // bare 'could not advance' (which would invite a re-advance / double-tick).
        showToast(
          result.cloudPending ? 'error' : 'success',
          result.cloudPending
            ? 'The realm advanced here, but the change has not finished saving to the cloud. Reload to confirm once your connection recovers.'
            : `Realm advanced: ${result.autoApplied.length} drift, ${result.proposals.length} proposal(s)`,
        );
      } else {
        if (result?.reason) console.warn('[WorldMap] advance realm reason:', result.reason);
        showToast(
          'error',
          ADVANCE_ERROR_TEXT[result?.reason] || 'The realm could not advance. Try again in a moment.',
          result?.reason === 'world_not_canonized' ? { label: 'Canonize the world', onClick: () => openInspectorAt('pulse') } : null,
        );
      }
    } catch (err) {
      console.warn('[WorldMap] advance realm failed', err);
      showToast('error', 'The realm could not advance. Try again in a moment.');
    } finally {
      if (!paused) setAdvanceSession(IDLE);
    }
  }, [activeCampaignId, advanceSession.phase, advanceCampaignWorld, worldPulseInterval, openInspectorAt, showToast]);

  // RESUME — apply the DM's verdicts on the batched majors and continue the
  // remaining ticks. `decisions` is the per-major verdict keyed by outcome id ({}
  // resolves every major to recommended). Re-parks 'paused' if the resumed segment
  // hit another fork; otherwise finishes to idle.
  const handleResumeAdvance = useCallback(async (decisions = {}) => {
    if (!activeCampaignId) return;
    setAdvanceSession(s => ({ ...s, phase: 'running' }));
    openInspectorAt('pulse');
    let paused = false;
    try {
      const result = await resolveIntervalMajors(activeCampaignId, decisions || {});
      if (result && result.status === 'paused') {
        paused = true;
        setAdvanceSession({ phase: 'paused', ticksDone: result.ticksDone || 0, ticksTotal: result.ticksTotal || 0 });
        return;
      }
      if (result && result.ok === false) {
        showToast('error', 'The realm could not continue. Try again in a moment.');
      } else {
        showToast('success', 'The realm advanced through the interval.');
      }
    } catch (err) {
      console.warn('[WorldMap] resume advance failed', err);
      showToast('error', 'The realm could not continue. Try again in a moment.');
    } finally {
      if (!paused) setAdvanceSession(IDLE);
    }
  }, [activeCampaignId, resolveIntervalMajors, openInspectorAt, showToast]);

  // Reverse the most recent advance (also clears any paused-advance cursor — the
  // store reverts the whole interval). Multi-step while session snapshots remain.
  const handleUndoRealm = useCallback(async () => {
    if (!activeCampaignId || advanceSession.phase !== 'idle') return;
    setAdvanceSession({ phase: 'running', ticksDone: 0, ticksTotal: 0 });
    try {
      const ok = await undoLastPulse(activeCampaignId);
      showToast(ok ? 'success' : 'info', ok ? 'Reverted the last realm advance' : 'Nothing to undo');
    } catch (err) {
      console.warn('[WorldMap] undo advance failed', err);
      showToast('error', `Undo failed: ${err.message || err}`);
    } finally {
      setAdvanceSession(IDLE);
    }
  }, [activeCampaignId, advanceSession.phase, undoLastPulse, showToast]);

  return {
    advanceSession,
    worldPulseBusy,
    multiTickOn,
    advancing: advanceSession.phase === 'running',
    performAdvanceRealm,
    handleResumeAdvance,
    handleUndoRealm,
  };
}
