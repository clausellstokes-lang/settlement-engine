// ────────────────────────────────────────────────────────────────────────────
// _shared/sessionGate.ts — the SINGLE-SESSION request-layer gate (161, §7.2).
//
// One active session per account (last-login-wins). After a function has resolved
// the caller via getUser() (which verifies the JWT signature), it reads the JWT's
// session_id claim and compares it to the current_account_session row. A superseded
// device's refresh token still mints valid JWTs until Supabase Pro's toggle exists —
// but those JWTs carry the OLD session_id, so every gated surface rejects them. The
// GATE, not the token, is the enforcement.
//
// THE ROLLOUT-SAFETY LAW (§7.2, mirrors 161's is_current_session):
//   - MISMATCH (a different session id is recorded) → SUPERSEDED → the caller
//     returns 401 {error:'session_superseded'} (fail CLOSED where money flows).
//   - MISSING ROW → allow + lazily ADOPT this session (never overwrite an existing
//     row — that would let a superseded device re-claim).
//   - missing session_id claim → allow (never brick an unexpected token shape).
//   - a read error on the gate → allow (availability; the spend_credits DB belt is
//     the authoritative money guard). Only a genuine mismatch rejects.
// ────────────────────────────────────────────────────────────────────────────

// deno-lint-ignore no-explicit-any
type AdminClient = any;

/** Decode the `session_id` claim from a Supabase access token WITHOUT re-verifying
 *  it (the caller already verified the user via getUser()). Returns null on any
 *  shape we don't recognise — a null session id ALLOWS (never brick an odd token). */
export function decodeSessionId(authHeaderOrToken: string | null): string | null {
  if (!authHeaderOrToken) return null;
  const token = authHeaderOrToken.startsWith('Bearer ') ? authHeaderOrToken.slice(7) : authHeaderOrToken;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4);
    const json = JSON.parse(atob(payload));
    const sid = json?.session_id;
    return typeof sid === 'string' && sid.length > 0 ? sid : null;
  } catch {
    return null;
  }
}

/** A coarse, server-derived device label from the User-Agent — browser + OS family
 *  only, never PII. Used for the account "Active session" panel. */
export function deviceLabelFromRequest(req: Request): string | null {
  const ua = req.headers.get('user-agent') || '';
  if (!ua) return null;
  const os = /Windows/i.test(ua) ? 'Windows'
    : /Mac OS X|Macintosh/i.test(ua) ? 'macOS'
    : /iPhone|iPad|iOS/i.test(ua) ? 'iOS'
    : /Android/i.test(ua) ? 'Android'
    : /Linux/i.test(ua) ? 'Linux' : 'Unknown OS';
  const browser = /Edg\//i.test(ua) ? 'Edge'
    : /OPR\/|Opera/i.test(ua) ? 'Opera'
    : /Chrome\//i.test(ua) ? 'Chrome'
    : /Firefox\//i.test(ua) ? 'Firefox'
    : /Safari\//i.test(ua) ? 'Safari' : 'Browser';
  return `${browser} / ${os}`.slice(0, 120);
}

/** The request-layer single-session gate. Returns true iff the caller's JWT carries a
 *  session id that has been SUPERSEDED — the caller then returns 401. A MISSING row is
 *  lazily adopted (allow); a missing claim / read error ALLOWS. Fail-CLOSED only on a
 *  genuine mismatch. `authHeaderOrToken` is the raw Authorization header (or bare JWT). */
export async function isSessionSuperseded(
  admin: AdminClient,
  userId: string,
  authHeaderOrToken: string | null,
  deviceLabel?: string | null,
): Promise<boolean> {
  const sid = decodeSessionId(authHeaderOrToken);
  if (!sid) return false; // no session_id claim → allow (caller may log)

  const { data, error } = await admin
    .from('current_account_session')
    .select('session_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    // A gate read error is neither a mismatch nor a missing row — allow for
    // availability. The spend_credits belt (assert_current_session) is the money guard.
    console.warn('[sessionGate] read failed; allowing:', error.message);
    return false;
  }

  if (!data) {
    // MISSING ROW → allow + lazily adopt (insert-if-absent; a concurrent adopt wins
    // and this ignores). NEVER overwrite an existing row (that would let a superseded
    // device re-claim). A write failure is non-fatal — the next SIGNED_IN claim adopts.
    const now = new Date().toISOString();
    try {
      await admin
        .from('current_account_session')
        .upsert(
          [{ user_id: userId, session_id: sid, device_label: deviceLabel ?? null, signed_in_at: now, updated_at: now }],
          { onConflict: 'user_id', ignoreDuplicates: true },
        );
    } catch (e) {
      console.warn('[sessionGate] lazy adopt failed (non-fatal):', (e as Error)?.message ?? 'unknown');
    }
    return false;
  }

  return String(data.session_id) !== sid;
}
