/**
 * domain/briefs/index.js — the brief-composer registry (S2).
 *
 * The seven pure read-model bundles + the citation law they share with the analyst
 * (S1). Consumers (the lazy brief display modules, the analyst retrieval layer) import
 * from here. Every composer is pure, AI-free, and testable without a provider.
 */

export {
  SOURCE,
  PLAYER_SAFE_SOURCES,
  ALL_SOURCES,
  ENGINE_DOES_NOT_RECORD,
  isPlayerSafeSource,
  isKnownSource,
  section,
  assembleBrief,
  bundleCitationCoverage,
  bundleSources,
} from './citations.js';

import {
  settlementBrief,
  playerSafeBrief,
  factionBrief,
  regionalBrief,
  weeklyDigest,
  sessionPrep,
  dramaticIronyBrief,
} from './composers.js';

export {
  settlementBrief,
  playerSafeBrief,
  factionBrief,
  regionalBrief,
  weeklyDigest,
  sessionPrep,
  dramaticIronyBrief,
  activeWarPairs,
} from './composers.js';

/**
 * The composer registry, keyed by brief kind. Each entry records its DEFAULT audience
 * so a caller (or the analyst) can route a request without re-deriving the rule.
 */
export const BRIEF_COMPOSERS = Object.freeze({
  settlement: { compose: settlementBrief, audience: 'dm', scope: 'settlement' },
  playerSafe: { compose: playerSafeBrief, audience: 'player', scope: 'settlement' },
  faction: { compose: factionBrief, audience: 'dm', scope: 'realm' },
  regional: { compose: regionalBrief, audience: 'dm', scope: 'realm' },
  weekly: { compose: weeklyDigest, audience: 'dm', scope: 'realm' },
  sessionPrep: { compose: sessionPrep, audience: 'dm', scope: 'settlement' },
  dramaticIrony: { compose: dramaticIronyBrief, audience: 'dm', scope: 'settlement' },
});

/** The registered brief kinds. */
export const BRIEF_KINDS = Object.freeze(Object.keys(BRIEF_COMPOSERS));
