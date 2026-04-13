/**
 * theme.js — Shared design constants for all components.
 * Output tabs (new/) use design.js (C.ink, etc.).
 * Configuration/panel components (this file) use uppercase constants.
 *
 * Canonical source of truth — design.js references these values.
 */

// ── Colors ──────────────────────────────────────────────────────────────────
export const GOLD     = '#a0762a';     // primary accent (warm gold)
export const GOLD_B   = '#c49a3c';     // bright gold (hover/highlight)
export const GOLD_BG  = 'rgba(160,118,42,0.12)';  // gold background tint
export const INK      = '#1c1409';     // primary text
export const INK_DEEP = '#2d1f0e';     // header/footer gradient dark
export const MUTED    = '#9c8068';     // muted text
export const SECOND   = '#6b5340';     // secondary text
export const BORDER   = '#c8b89a';     // primary borders
export const BORDER2  = '#e0d0b0';     // light borders
export const CARD     = '#fffbf5';     // card background
export const PARCH    = '#f7f0e4';     // page background
export const CARD_ALT = '#faf6ef';     // alternate card
export const CARD_HDR = '#faf4e8';     // card header

// ── Typography ──────────────────────────────────────────────────────────────
export const sans   = 'Nunito, sans-serif';
export const serif_ = 'Crimson Text, Georgia, serif';

// ── Spacing scale (px) ──────────────────────────────────────────────────────
export const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };

// ── Border-radius scale (px) ────────────────────────────────────────────────
export const R = { sm: 4, md: 6, lg: 8, xl: 12 };

// ── Font-size scale (px) ────────────────────────────────────────────────────
export const FS = { xxs: 10, xs: 11, sm: 12, md: 13, lg: 15, xl: 17, xxl: 20, h1: 24 };
