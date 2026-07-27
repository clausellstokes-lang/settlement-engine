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
 *
 * WAVE L-WIRE widened what this module returns, NOT what it may log. The RPC now hands back
 * the key together with the key's exam receipt (migration 191 §5), and the receipt is
 * VERDICTS rather than prose by database construction. The logging discipline is unchanged
 * and unconditional: neither the key nor the RPC `data` may reach console.*, logError, or
 * any serializer, whatever else the envelope grows.
 */
import type { CoachingProfile } from '../_shared/modelCoaching.ts';

/** The resolved key + whether it is the user's own (BYOK) or the shared server key. */
export interface ResolvedKey {
  key: string;
  byok: boolean;
  /**
   * THE MODEL'S EXAM RECEIPT (wave L-WIRE), carried out of the SAME RPC round-trip that
   * decrypts the key. VERDICTS, NEVER PROSE: migration 191's setter refuses to store
   * anything but a closed-vocabulary verdict list, so this is a bag of booleans, small
   * integers and enum tokens by the time it reaches this process. `_shared/modelCoaching.ts`
   * turns it into frozen house sentences; nothing else reads it.
   *
   * NULL ON THE MANAGED PATH, STRUCTURALLY: a probe profile lives on a BYOK key row, so a
   * request served by the shared server key has no profile and renders no coaching. That is
   * what keeps the server key's cached prefix identical for every user.
   */
  probeProfile: CoachingProfile | null;
  /**
   * THE MODEL THAT EARNED THE PROFILE. A probe measures ONE model; the profile is a record
   * of what THAT model did on the exam. A user can probe on one model and then change their
   * stored preference to another, so the model about to answer is not always the model that
   * sat the exam - and showing model B a list of model A's failures is an assertion about B
   * that nothing measured. The six shells therefore render coaching only when this equals
   * the model they resolved for the request, and silently render nothing otherwise.
   *
   * NULL when the row has never been probed, and null on the managed path with the rest.
   */
  probeModel: string | null;
  /** The exam version and measured rung behind that profile. Read-only exposure, for the
   *  same reason `tierClass` is exposed on the resolver: audit surfaces later. */
  probeVersion: string | null;
  probeTier: string | null;
}

type ProviderKeyAdmin = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: unknown }>;
};

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
  admin: ProviderKeyAdmin,
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
      return serverKeyResult(serverKey);
    }
    // ── the LEGACY shape: the plaintext key as a bare string ────────────────────
    // Migration 191 part 2 widened this RPC to an object carrying the key PLUS the exam
    // receipt. Both shapes are accepted here, deliberately and permanently: edge functions
    // and migrations deploy separately, so between the two deploys this code runs against
    // 139's `returns text` body, and a rollback puts it back. A shape assumption here
    // would present as every user silently losing BYOK for the length of that window.
    if (typeof data === 'string' && data.trim().length > 0) {
      // The user's own key. Returned to the caller for the provider request ONLY.
      return { key: data, byok: true, probeProfile: null, probeModel: null, probeVersion: null, probeTier: null };
    }
    // ── the CARRY-ALL shape (migration 191 part 2) ──────────────────────────────
    // Read field by field rather than spread, so nothing the row grows later reaches a
    // caller by accident. The key is still never logged and still never leaves this return.
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const row = data as Record<string, unknown>;
      const key = typeof row.key === 'string' ? row.key : '';
      if (key.trim().length > 0) {
        return {
          key,
          byok: true,
          probeProfile: asCoachingProfile(row.probe_profile),
          probeModel: typeof row.probe_model === 'string' ? row.probe_model : null,
          probeVersion: typeof row.probe_version === 'string' ? row.probe_version : null,
          probeTier: typeof row.probe_tier === 'string' ? row.probe_tier : null,
        };
      }
    }
  } catch {
    if (onLookupError) onLookupError('surveyor_byok_get threw — using server key');
  }
  return serverKeyResult(serverKey);
}

/** The shared server key carries no exam receipt: a probe measures a USER's key, and the
 *  server key is not one. Stated as a function so all four fall-through paths agree. */
function serverKeyResult(serverKey: string): ResolvedKey {
  return { key: serverKey, byok: false, probeProfile: null, probeModel: null, probeVersion: null, probeTier: null };
}

/** Shape-check the jsonb blob on the way out of the database. The renderer validates again
 *  and is total on hostile input, so this is the cheap outer gate rather than the wall: a
 *  scalar or an array is not a profile and becomes null here instead of travelling. */
function asCoachingProfile(value: unknown): CoachingProfile | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as CoachingProfile;
}
