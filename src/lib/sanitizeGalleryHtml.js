/**
 * sanitizeGalleryHtml — safe rich text for gallery descriptions (§4c).
 *
 * Gallery descriptions support a small formatting set (bold/italic/underline,
 * headings, lists, links). We store + render HTML, so every value is run
 * through DOMPurify with a tight allowlist — no script/style/iframe/event
 * handlers, links restricted to http(s)/mailto and forced to open safely.
 * Called on store (the editor's onChange) AND on render (defense-in-depth).
 *
 * Requires a DOM for full rich-text sanitization: runs in the browser at
 * runtime; tests opt into jsdom. In a DOM-less context (no functional DOMPurify)
 * it FAILS SAFE — stripping to inert text rather than throwing or, worse,
 * returning unsanitized HTML — so a caller that sanitizes-on-write can never
 * persist live markup just because it ran without a DOM.
 *
 * Isolation: we sanitize through a PRIVATE DOMPurify instance bound to this
 * module, NOT the process-wide singleton. The link-rewriting hook (target/rel)
 * is gallery-specific; mutating the global singleton would silently leak that
 * rewriting into any future DOMPurify caller in a different context.
 *
 * Unconditional noopener: the rel/target guarantee must NOT depend on addHook
 * existing. We attach the hook when available AND run an explicit post-pass on
 * the returned fragment so every surviving anchor is forced safe even if the
 * hook never registered (shimmed/unusual build).
 */
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a', 'h3', 'h4', 'span'];
// `target`/`rel` are NOT author-controlled — we set them ourselves below — so they
// stay OUT of the author allowlist; only `href` survives from author input.
const ALLOWED_ATTR = ['href'];
// Only safe link schemes (no javascript:, data:, etc.).
const SAFE_URI = /^(?:https?:|mailto:)/i;
const SAFE_REL = 'noopener noreferrer nofollow';

// Private instance bound to this module's window. Created lazily so import on a
// DOM-less worker/SSR boot doesn't throw; falls back to the package default if the
// factory isn't callable (older shim). The hook lives ONLY on this instance.
let _purify = null;
let _hooked = false;
function getPurify() {
  if (_purify) return _purify;
  try {
    _purify = (typeof window !== 'undefined' && typeof DOMPurify === 'function')
      ? DOMPurify(window)
      : DOMPurify;
  } catch {
    _purify = DOMPurify;
  }
  if (!_hooked && typeof _purify.addHook === 'function') {
    _hooked = true;
    _purify.addHook('afterSanitizeAttributes', (node) => {
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', SAFE_REL);
      }
    });
  }
  return _purify;
}

// Belt-and-suspenders: force target/rel on every anchor in the returned fragment,
// independent of the hook. Operates on the RETURN_DOM fragment so it's pure DOM
// work (no re-parsing of attacker input), then serializes back to a string.
function forceSafeLinks(fragment) {
  try {
    const anchors = fragment.querySelectorAll ? fragment.querySelectorAll('a') : [];
    for (const a of anchors) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', SAFE_REL);
    }
  } catch { /* fragment without querySelectorAll — hook path already covered it */ }
}

// Fail-safe fallback when no functional DOMPurify is available (DOM-less env).
// Drop tag bodies AND any stray angle brackets so nothing can survive as an HTML
// element — the result is inert text, safe even through dangerouslySetInnerHTML.
function stripToInertText(html) {
  return String(html).replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
}

export function sanitizeGalleryHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const purify = getPurify();
  if (!purify || typeof purify.sanitize !== 'function') {
    return stripToInertText(html);
  }
  const opts = {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SAFE_URI,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['style', 'class', 'id'],
  };
  // Sanitize to a DOM fragment so we can unconditionally enforce link safety, then
  // serialize. If RETURN_DOM_FRAGMENT isn't supported (degraded shim), fall back to
  // the string path — the hook (if present) is the only line of defense there.
  try {
    const frag = purify.sanitize(html, { ...opts, RETURN_DOM_FRAGMENT: true });
    if (frag && typeof frag.querySelectorAll === 'function') {
      forceSafeLinks(frag);
      const box = (frag.ownerDocument || document).createElement('div');
      box.appendChild(frag);
      return box.innerHTML;
    }
  } catch { /* fall through to string sanitize */ }
  return purify.sanitize(html, opts);
}

/** Test seam: reset the private instance + hook flag between cases. */
export function __resetSanitizerForTests() {
  _purify = null;
  _hooked = false;
}
