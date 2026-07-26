/**
 * AI overlay verification and content-free request telemetry.
 *
 * The slice coordinates requests; this module owns the policy for classifying
 * their outcomes. Keeping the verifier and its analytics projection together
 * prevents the three request actions from drifting into different definitions
 * of a hard violation, duration band, or failure kind.
 */

import { verifyAiOverlay } from '../domain/aiOverlayVerifier.js';
import { isCanonSave } from '../domain/campaign/canon.js';
import { EVENTS, track } from '../lib/analytics.js';

const HARD_VIOLATION_KINDS = new Set([
  'invented_entity',
  'renamed_entity',
  'changed_fact',
  'changed_canon',
]);

export function runOverlayVerifier(original, refined) {
  try {
    return verifyAiOverlay(original, refined);
  } catch (error) {
    console.error('[ai-overlay-verifier] unexpected error', error);
    return {
      ok: true,
      violations: [],
      summary: {
        invented: 0,
        removed: 0,
        renamed: 0,
        contradicted: 0,
        canonChanged: 0,
        historyDropped: 0,
      },
    };
  }
}

export function logHardViolations(verification, where) {
  if (verification?.ok) return;
  const hard = (verification?.violations || [])
    .filter((violation) => HARD_VIOLATION_KINDS.has(violation.kind));
  if (hard.length === 0) return;
  console.warn(
    `[ai-overlay] ${where}: ${hard.length} hard violation(s) detected`,
    hard.slice(0, 5),
  );
}

/** Map request names onto the closed analytics vocabulary. */
export const aiTypeEnum = (type) => (
  type === 'dailyLife' ? 'daily_life' : type
);

export function durationBand(milliseconds) {
  const value = Number(milliseconds);
  if (!Number.isFinite(value) || value < 0) return 'unknown';
  if (value < 5_000) return 'lt_5s';
  if (value < 15_000) return '5_15s';
  if (value < 60_000) return '15_60s';
  if (value < 300_000) return '1_5m';
  if (value < 1_800_000) return '5_30m';
  return 'gt_30m';
}

export function errorKindFromError(error) {
  const message = (
    error && typeof error.message === 'string'
      ? error.message
      : String(error || '')
  ).toLowerCase();
  const name = (
    error && typeof error.name === 'string' ? error.name : ''
  ).toLowerCase();
  if (name === 'aborterror' || message.includes('abort')) return 'aborted';
  if (message.includes('insufficient credit') || message.includes('credits')) {
    return 'credits';
  }
  if (
    /http 5\d\d/.test(message)
    || message.includes('truncated')
    || message.includes('completion marker')
  ) {
    return 'server';
  }
  if (
    message.includes('failed to fetch')
    || message.includes('network')
    || message.includes('networkerror')
    || message.includes('load failed')
    || message.includes('timeout')
  ) {
    return 'network';
  }
  return 'server';
}

export const canonPhaseOf = (entry) => (
  isCanonSave(entry) ? 'canon' : 'draft'
);

/**
 * Emit only aggregate verifier counters. Entity names and generated prose never
 * cross the analytics boundary.
 */
export function reportVerifier(type, verification) {
  const summary = verification?.summary || {};
  const hardCount = (summary.invented || 0)
    + (summary.renamed || 0)
    + (summary.contradicted || 0)
    + (summary.canonChanged || 0);
  track(EVENTS.AI_VERIFIER_REPORT, {
    type: aiTypeEnum(type),
    ok: !!verification?.ok,
    invented: summary.invented || 0,
    removed: summary.removed || 0,
    renamed: summary.renamed || 0,
    contradicted: summary.contradicted || 0,
    canon_changed: summary.canonChanged || 0,
    history_dropped: summary.historyDropped || 0,
    hard_violation_count: hardCount,
  });
}
