/**
 * hooks/useScribeOpenTrigger.js — THE MOUNT THAT MAKES "THE OPEN" A REAL EVENT.
 *
 * The owner's rule 14 is that a render starts when a settlement's DOSSIER IS OPENED, not on a save
 * and not on an advance. The dossier being open is a React fact, so exactly one hook observes it
 * and everything else about the decision lives in `store/scribeOpenTrigger.js`, which is pure and
 * testable without a renderer.
 *
 * ⛔ THIS FILE IS A STATIC IMPORT OF `OutputContainer.jsx` AND THEREFORE OF THE DOSSIER'S CHUNK.
 * It may import React, the store and the flag reader, and NOTHING ELSE. The trigger, the artefact
 * and the transport are all reached through `await import(...)` inside the effect, so a build with
 * the flag dark pulls not one byte of the Scribe into the page. The first-paint closure budget is
 * an exact ratchet (`tests/build/vendorPdfLazy.test.js`) and this is the file that would break it.
 *
 * ⛔ IT FIRES ON IDENTITY, NOT ON RENDER. The effect's dependencies are the four facts that can
 * make a render owed — the save, the seed, the epoch and whether the flag is lit — so scrolling,
 * tab changes and unrelated store writes do not re-ask. The trigger module keeps a session ledger
 * as well, so even a remount storm sends one render per town per epoch.
 */

import { useEffect } from 'react';
import { useStore } from '../store/index.js';
import { flag } from '../lib/flags.js';
import { setScribeDraw } from '../domain/display/stateProse/stateProseKernel.js';

/**
 * @param {{enabled?: boolean, saveId?: string|null}} options
 *   `enabled` is FALSE on every surface that is not the owner's own editable dossier — a gallery
 *   view, a player view, a read-only share. Those readers see prose if the world's owner rendered
 *   it, and never cause a render or a charge themselves.
 */
export function useScribeOpenTrigger({ enabled = true, saveId = null } = {}) {
  // ⛔ THE DRAW SWITCH IS PUSHED IN, SYNCHRONOUSLY, BEFORE THE TABS COMPOSE. Nothing under
  // `src/domain/` reads a feature flag anywhere in this estate, and the composer's switch keeps
  // that true by taking the answer instead of asking for it. It is set here rather than in the
  // effect because an effect runs AFTER the first paint: the tabs would compose the hand corpus
  // once, the switch would flip, and nothing would re-render. The kernel imports NOTHING (pinned
  // by the composer's fence), so this static import adds one dependency-free file and no closure.
  setScribeDraw(flag('scribe'));
  const settlementSeed = useStore(s => String(s.settlement?._seed ?? s.settlement?.id ?? ''));
  const campaignId = useStore(s => {
    if (saveId == null || typeof s.getCampaignForSettlement !== 'function') return '';
    return String(s.getCampaignForSettlement(saveId)?.id || '');
  });
  const advanceSeq = useStore(s => Number(s.advanceSeqByCampaign?.[campaignId]) || 0);
  const guidance = useStore(s => {
    if (saveId == null) return '';
    const notes = s.savedSettlements?.find(x => x.id === saveId)?.aiData?.dossierNotes;
    return typeof notes?.aiGuidance === 'string' ? notes.aiGuidance.trim() : '';
  });

  useEffect(() => {
    if (!enabled || !saveId || !settlementSeed) return undefined;
    if (!flag('scribe')) return undefined;
    let live = true;
    (async () => {
      const { runScribeOpenTrigger } = await import('../store/scribeOpenTrigger.js');
      if (!live) return;
      await runScribeOpenTrigger({
        state: useStore.getState(),
        saveId,
        campaignId,
        flagOn: true,
        guidance,
      });
    })().catch((error) => {
      // The hand corpus is always there, so a trigger that cannot even load is a silent
      // non-event on the page rather than an error the reader has to understand.
      console.warn('[scribe] open trigger did not run', error);
    });
    return () => { live = false; };
    // `guidance` is deliberately NOT a dependency: editing the instructions box makes the epoch
    // REDO-ELIGIBLE (a badge), never an automatic re-render (§5c rule 3). It is read at fire time
    // so a render that DOES start carries the instructions as they stand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, saveId, settlementSeed, campaignId, advanceSeq]);
}

export default useScribeOpenTrigger;
