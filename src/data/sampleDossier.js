/**
 * sampleDossier.js - JS re-export of sampleDossier.json so consumers can
 * import a plain object without needing the host's JSON loader.
 *
 * Pillar G. Used by:
 *   - HomeSampleDossier.jsx (P128 - landing proof card)
 *   - FirstDossierCallouts.jsx (P130 - anchor targets for callouts)
 *   - WorkshopLockedPreview.jsx (P143 - locked-state sample)
 *
 * Frozen so consumers can't accidentally mutate the shared fixture.
 */

import data from './sampleDossier.json';

/** The teaching-optimal Hightower's Reach dossier. Read-only. */
export const SAMPLE_DOSSIER = Object.freeze(data);

/** Stable id of the NPC the new-DM corruption callout points at. */
export const SAMPLE_CALLOUT_NPC_ID = 'npc.velda';

/** Stable id of the supply-chain failure the worldbuilder callout
 *  points at. */
export const SAMPLE_CALLOUT_SUPPLY_GOOD = 'grain';

/** Stable id of the plot hook the Friday's-session callout points at. */
export const SAMPLE_CALLOUT_HOOK_ID = 'hook.ledger';
