/**
 * theme.js — Backward-compat shim. Canonical tokens live in `src/design/tokens.js`.
 *
 * History: this file used to be the single source for flat constants
 * (GOLD, INK, MUTED, etc.) and was imported by ~80 components. It's now
 * a re-export shim so those imports keep working unchanged while the
 * actual values come from the new token system.
 *
 * Values intentionally shift to the UI Redesign palette (parchment-50,
 * ink-900, gold-500, etc.) — same NAMES, refreshed VALUES. That's the
 * whole point of the shim: re-skin the app without touching 80 files.
 *
 * New code should import from `src/design/tokens.js` directly:
 *   import { color, semantic, type, space, radius } from '@/design/tokens';
 *
 * Or read the CSS custom properties (emitted at app boot by
 * `emitCssTokens()`):
 *   color: var(--color-gold-500);
 *   color: var(--sem-text-body);
 *   padding: var(--space-4);
 */

import { legacy as L } from '../design/tokens.js';

// ── Colors ──────────────────────────────────────────────────────────────────
export const GOLD     = L.GOLD;
export const GOLD_B   = L.GOLD_B;
export const GOLD_BG  = L.GOLD_BG;
export const INK      = L.INK;
export const INK_DEEP = L.INK_DEEP;
export const MUTED    = L.MUTED;
// BODY — WCAG-passing body-copy color (ink-600). Use this for prose,
// description text, helper text, paragraph body. MUTED is too light
// for body and fails 4.5:1; keep MUTED only for chrome (eyebrows,
// subtitles, hint text in card headers).
export const BODY     = L.BODY;
export const SECOND   = L.SECOND;
export const BORDER   = L.BORDER;
export const BORDER2  = L.BORDER2;
export const CARD     = L.CARD;
export const PARCH    = L.PARCH;
export const CARD_ALT = L.CARD_ALT;
export const CARD_HDR = L.CARD_HDR;

// ── Typography ──────────────────────────────────────────────────────────────
export const sans   = L.sans;
export const serif_ = L.serif_;

// ── Spacing scale (px) ──────────────────────────────────────────────────────
export const SP = L.SP;

// ── Border-radius scale (px) ────────────────────────────────────────────────
export const R = L.R;

// ── Font-size scale (px) ────────────────────────────────────────────────────
export const FS = L.FS;
