function decodeJwtSessionId(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2 || typeof globalThis.atob !== 'function') return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4);
    const claims = JSON.parse(globalThis.atob(payload));
    const sessionId = claims?.session_id;
    return typeof sessionId === 'string' && sessionId.trim() ? sessionId.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Stable identity for one logical Supabase login. Access tokens rotate during
 * TOKEN_REFRESHED, but their `session_id` claim does not. A same-owner re-login
 * receives a new claim and therefore invalidates continuations from the prior
 * credential boundary. The object fallback only serves local/test shapes that
 * do not carry a real Supabase JWT.
 */
export function authSessionIdentity(auth) {
  const session = auth?.session || null;
  const explicit = session?.session_id;
  const sessionId = (typeof explicit === 'string' && explicit.trim())
    ? explicit.trim()
    : decodeJwtSessionId(session?.access_token);
  return sessionId ? `session:${sessionId}` : session;
}

/** Capture the owner and logical login that authorized a delayed write. */
export function captureAuthSessionFence(auth) {
  const ownerId = auth?.user?.id == null ? null : String(auth.user.id);
  const sessionIdentity = authSessionIdentity(auth);
  return Object.freeze({ ownerId, sessionIdentity });
}

/** Same owner is insufficient: a sign-out/sign-in starts a new write session. */
export function isAuthSessionFenceCurrent(fence, auth) {
  if (!fence) return false;
  const current = captureAuthSessionFence(auth);
  return current.ownerId === fence.ownerId
    && current.sessionIdentity === fence.sessionIdentity;
}
