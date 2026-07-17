/**
 * ai-analyst/byok.ts — BYOK key resolution (DESIGN_AI_CONTROL_SURFACE §3).
 *
 * The user's provider key lives ENCRYPTED server-side (surveyor_byok_keys, migration
 * 139) and is decrypted PER REQUEST inside this edge function via the service-role-only
 * surveyor_byok_get() RPC. It is NEVER logged, never returned to the client, never put
 * in world state, never in any corpus.
 *
 * THE NEVER-LOGGED INVARIANT: this module MUST NOT pass the decrypted key (or the RPC
 * `data`) to console.*, logError, or any serializer that reaches a log/telemetry sink.
 * A log-line here would defeat the whole vault. Pinned by
 * tests/security/byokNeverLogged.test.js.
 */

/** The resolved key + whether it is the user's own (BYOK) or the shared server key. */
export interface ResolvedKey {
  key: string;
  byok: boolean;
}

/**
 * Resolve the provider API key for a request: the user's decrypted BYOK key if they
 * have one, else the shared server key. On ANY error, falls back to the server key —
 * and NEVER logs the key material (only a keyless, structured note that BYOK lookup
 * failed, if a logger is supplied).
 *
 * @param admin      service-role supabase client (the only role granted surveyor_byok_get)
 * @param userId     the authenticated caller
 * @param provider   e.g. 'anthropic'
 * @param serverKey  the shared server key (fallback)
 * @param onLookupError optional keyless error note — MUST NOT be passed the key
 */
export async function resolveProviderKey(
  admin: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> },
  userId: string,
  provider: string,
  serverKey: string,
  onLookupError?: (note: string) => void,
): Promise<ResolvedKey> {
  try {
    const { data, error } = await admin.rpc('surveyor_byok_get', { p_user: userId, p_provider: provider });
    if (error) {
      // Log the FACT of a failure — never the key, never the RPC data.
      if (onLookupError) onLookupError('surveyor_byok_get errored — using server key');
      return { key: serverKey, byok: false };
    }
    if (typeof data === 'string' && data.trim().length > 0) {
      // The user's own key. Returned to the caller for the provider request ONLY.
      return { key: data, byok: true };
    }
  } catch {
    if (onLookupError) onLookupError('surveyor_byok_get threw — using server key');
  }
  return { key: serverKey, byok: false };
}
