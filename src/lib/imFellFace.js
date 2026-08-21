/**
 * lib/imFellFace.js — THE IM FELL DISPLAY FACE (V-27d), lazy + OFF by default.
 *
 * IM Fell English is a historical display serif (the 17th-century Fell Types,
 * digitized by Igino Marini, SIL Open Font License). This module is the toggle-
 * OFF scaffold for offering it as the DISPLAY face — hero + section titles — via
 * the runtime `--oc-display-face` CSS custom property (design/tokens.js). Prose
 * stays on the Crimson serif; only the display tokens read the swappable var.
 *
 * ZERO EAGER BYTES: nothing imports this module statically. It loads only when
 * the `imFellDisplayFace` flag is on, through the dynamic import in main.jsx, so
 * the flag-off path (the default) adds no static import to the first-paint
 * closure and injects no @font-face. The `.woff2` is a runtime asset in
 * public/fonts/, never bundled — so it never enters the JS closure ratchet.
 *
 * DEFERRED ASSET (documented, not dropped): the IM Fell OFL `.woff2` is NOT yet
 * vendored in public/fonts/. Lighting the face is a two-step OWNER action — flip
 * the flag AND drop `IMFellEnglish-Regular.woff2` (SIL OFL, from Google Fonts /
 * iginomarini.com) into public/fonts/ with the license note in this file's
 * provenance comment (the repo's font-provenance convention: a comment header,
 * not a separate LICENSE file — see src/index.css). Until then the flag-on path
 * degrades gracefully to the Crimson serif fallback (font-display: swap), never
 * a blank glyph.
 */

/** The IM Fell display family name (matches the injected @font-face). */
export const IM_FELL_FAMILY = 'IM Fell English';

/** The conventional public/ path for the (owner-vendored) IM Fell woff2. */
export const IM_FELL_WOFF2 = '/fonts/IMFellEnglish-Regular.woff2';

/** The CSS custom property the display tokens read (design/tokens.js). */
export const DISPLAY_FACE_VAR = '--oc-display-face';

/** The injected @font-face rule text (single source for module + test). */
export function imFellFaceRule() {
  return `@font-face{font-family:'${IM_FELL_FAMILY}';src:url('${IM_FELL_WOFF2}') format('woff2');font-weight:400 700;font-style:normal;font-display:swap;}`;
}

/**
 * Inject the IM Fell @font-face once (idempotent, DOM-guarded). The DOM is the
 * source of truth for "already injected" — robust against hot-reload and multiple
 * module instances, not just a module-scoped boolean. Safe to call repeatedly and
 * in non-DOM (SSR/test-node) environments — it no-ops.
 */
export function ensureImFellFace() {
  if (typeof document === 'undefined' || !document.head) return;
  if (document.querySelector('style[data-im-fell-face]')) return;
  const style = document.createElement('style');
  style.setAttribute('data-im-fell-face', '');
  style.textContent = imFellFaceRule();
  document.head.appendChild(style);
}

/**
 * Activate the IM Fell display face: inject the @font-face and point the
 * display-face var at it, swapping hero + section titles. No-op off-DOM.
 */
export function applyImFellDisplayFace(target = typeof document !== 'undefined' ? document.documentElement : null) {
  if (!target) return;
  ensureImFellFace();
  target.style.setProperty(DISPLAY_FACE_VAR, `'${IM_FELL_FAMILY}'`);
}

/** Revert to the Crimson serif fallback (the var falls back when unset). */
export function clearImFellDisplayFace(target = typeof document !== 'undefined' ? document.documentElement : null) {
  if (!target) return;
  target.style.removeProperty(DISPLAY_FACE_VAR);
}
