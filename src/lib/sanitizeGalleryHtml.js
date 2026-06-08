/**
 * sanitizeGalleryHtml — safe rich text for gallery descriptions (§4c).
 *
 * Gallery descriptions support a small formatting set (bold/italic/underline,
 * headings, lists, links). We store + render HTML, so every value is run
 * through DOMPurify with a tight allowlist — no script/style/iframe/event
 * handlers, links restricted to http(s)/mailto and forced to open safely.
 * Called on store (the editor's onChange) AND on render (defense-in-depth).
 *
 * Requires a DOM: runs in the browser at runtime; tests opt into jsdom.
 */
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'p', 'br', 'ul', 'ol', 'li', 'a', 'h3', 'h4', 'span'];
const ALLOWED_ATTR = ['href', 'target', 'rel'];
// Only safe link schemes (no javascript:, data:, etc.).
const SAFE_URI = /^(?:https?:|mailto:)/i;

let hooked = false;
function ensureLinkHook() {
  if (hooked || typeof DOMPurify.addHook !== 'function') return;
  hooked = true;
  // Force every surviving anchor to open safely (public content).
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });
}

export function sanitizeGalleryHtml(html) {
  if (!html || typeof html !== 'string') return '';
  ensureLinkHook();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SAFE_URI,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['style', 'class', 'id'],
  });
}
