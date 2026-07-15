/**
 * useFounderTileEligible.js — the NON-async slice of FounderTile's gating,
 * lifted into its own light module so a parent region can read it WITHOUT
 * eagerly pulling FounderTile's heavy deps (stripe, analytics) — the tile
 * itself stays lazy-loaded.
 *
 * Returns true when the recognition flag is on, the reader is a worldbuilder,
 * and the user is not already premium. FounderTile narrows further on the live
 * seats-remaining RPC, but that async check only ever REMOVES eligibility — so
 * a parent that uses this to pick its single primary CTA (P8 one-primary) is
 * correct in the common case. In the rare sold-out window the tile renders null
 * and the parent's (now-secondary) CTA still provides the upgrade path.
 *
 * Kept in sync with FounderTile's own `eligible` computation: both consult
 * flag('founderRecognition') + audience==='worldbuilder' + tier!=='premium'.
 */

import { useStore } from '../store/index.js';
import { useReaderAudience } from './useReaderAudience.js';
import { flag } from '../lib/flags.js';

export function useFounderTileEligible() {
  const audience = useReaderAudience();
  const tier = useStore(s => s.auth.tier);
  return flag('founderRecognition') && audience === 'worldbuilder' && tier !== 'premium';
}
