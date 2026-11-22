// ── public/map/sf-origin.js ─────────────────────────────────────────────────
// The child half of SettlementForge's cross-origin trust contract.
//
// The parent stamps its ORIGIN (not its full URL) into the iframe query string.
// This script resolves that value once and closes over it for every outbound
// postMessage. A missing or malformed value fails closed on deployed hosts.
// Localhost alone retains the same-origin fallback used by Vite development and
// the browser harnesses.

(function initSettlementForgeOriginContract() {
  'use strict';

  function isLoopbackHostname(hostname) {
    const normalized = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
    return normalized === 'localhost'
      || normalized === '127.0.0.1'
      || normalized === '::1';
  }

  function normalizeParentOrigin(candidate) {
    let parsed;
    try {
      parsed = new URL(candidate);
    } catch (_) {
      return null;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (parsed.username || parsed.password) return null;
    if (parsed.pathname !== '/' || parsed.search || parsed.hash) return null;
    if (parsed.protocol === 'http:' && !isLoopbackHostname(parsed.hostname)) return null;
    return parsed.origin;
  }

  function resolveParentOrigin() {
    let configured = [];
    try {
      configured = new URLSearchParams(window.location.search).getAll('parentOrigin');
    } catch (_) {
      return null;
    }

    // Repeated values are ambiguous and therefore untrusted.
    if (configured.length > 1) return null;
    if (configured.length === 1) return normalizeParentOrigin(configured[0]);

    // Missing configuration is a development convenience only. A deployed map
    // host must receive the explicit origin handshake from mapRuntimeConfig.
    if (!isLoopbackHostname(window.location.hostname)) return null;
    return normalizeParentOrigin(window.location.origin);
  }

  const parentOrigin = resolveParentOrigin();

  function postToParent(message) {
    if (!parentOrigin || window.parent === window) return false;
    try {
      window.parent.postMessage(message, parentOrigin);
      return true;
    } catch (_) {
      return false;
    }
  }

  window.__sfBridgeOrigin = Object.freeze({
    parentOrigin,
    postToParent,
  });
})();
