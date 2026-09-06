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
 *
 * ── FAIL CLOSED ON A VAULT ERROR (owner ruling, 2026-07-30) ──────────────────────────
 * This module used to answer EVERY failure with the shared house key. That silently moved
 * a BYOK user's request onto the platform account: their prompt reached the provider under
 * our key, on our bill, outside the boundary they chose. The ruling is that the chosen key
 * boundary is never crossed silently, so a vault failure is now a TYPED, RETRYABLE refusal
 * for anyone who has a key of their own.
 *
 * The distinction that keeps it from locking out the managed majority: a vault error is not
 * the same fact as "no key on file". surveyor_byok_get answers NULL, WITHOUT an error, when
 * the user has no row (139's contract, carried forward by 191) - that answer is a successful
 * lookup and still takes the house path. Only the error/throw branches are ambiguous, and
 * they are resolved by a SECOND, independent witness: surveyor_byok_status, the user's own
 * read of their own key row (granted to `authenticated`, no plaintext, no new grant). It
 * runs ONLY on the already-failed branch, so the happy path costs nothing extra.
 *   - witness says NO row  => the user is a managed-key user, house path, unchanged.
 *   - witness says a row   => fail closed.
 *   - witness unavailable  => cannot determine => fail closed (the ruling's "or the lookup
 *     cannot determine that"). A caller that passes no witness therefore fails closed too.
 * A row that the vault DID answer for but whose plaintext came back blank is also closed:
 * the row exists, so the boundary exists, and an empty key is a broken read, not an absence.
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

/**
 * THE TYPED VAULT FAILURE. Returned instead of a key when the vault could not be read for
 * a user who has (or may have) a key of their own. `retryable` is the honest word for it:
 * the request was not sent, nothing was charged, and the same request can simply be made
 * again once the vault answers. It carries no key material and no request data, so it is
 * a frozen module constant rather than something built per request.
 */
export interface VaultUnavailable {
  vaultUnavailable: true;
  code: 'byok_vault_unavailable';
  status: 503;
  retryable: true;
  message: string;
}

/** What resolveProviderKey answers: a usable key, or the typed refusal. */
export type ProviderKeyOutcome = ResolvedKey | VaultUnavailable;

/** House copy for the refusal. Names the boundary, the non-charge, and the retry. */
export const BYOK_VAULT_UNAVAILABLE_MESSAGE =
  'Your own provider key could not be read just now, so this request was not sent and nothing was charged. Your key is never swapped for ours. Try again in a moment.';

const VAULT_UNAVAILABLE: VaultUnavailable = Object.freeze({
  vaultUnavailable: true,
  code: 'byok_vault_unavailable',
  status: 503,
  retryable: true,
  message: BYOK_VAULT_UNAVAILABLE_MESSAGE,
} as const);

/** The one narrowing gate. Every shell calls this before touching `.key` or `.byok`, and
 *  the union makes forgetting it a type error rather than a silent house-key request. */
export function isVaultUnavailable(outcome: ProviderKeyOutcome): outcome is VaultUnavailable {
  return (outcome as VaultUnavailable).vaultUnavailable === true;
}

type RpcClient = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: unknown }>;
};

/**
 * Resolve the provider API key for a request: the user's decrypted BYOK key if they have
 * one, else the shared server key. A vault failure is a TYPED REFUSAL for a user who has
 * (or may have) their own key, and the unchanged house path for a user who has none - see
 * the FAIL CLOSED note at the top of this file. NEVER logs the key material (only a
 * keyless, structured note that the BYOK lookup failed, if a logger is supplied).
 *
 * @param admin      service-role supabase client (the only role granted surveyor_byok_get)
 * @param userId     the authenticated caller
 * @param provider   e.g. 'anthropic'
 * @param serverKey  the shared server key (used only when the user has no key of their own)
 * @param onLookupError optional keyless error note — MUST NOT be passed the key
 * @param owner      the caller's OWN user-scoped client, the has-a-key witness consulted
 *                   only when the vault read failed. Omitting it means the ambiguity can
 *                   never be resolved, so a vault failure fails closed.
 */
export async function resolveProviderKey(
  admin: RpcClient,
  userId: string,
  provider: string,
  serverKey: string,
  onLookupError?: (note: string) => void,
  owner?: RpcClient,
): Promise<ProviderKeyOutcome> {
  try {
    const { data, error } = await admin.rpc('surveyor_byok_get', { p_user: userId, p_provider: provider });
    if (error) {
      // Log the FACT of a failure — never the key, never the RPC data.
      if (onLookupError) onLookupError('surveyor_byok_get errored — vault unreadable');
      return await settleVaultFailure(owner, provider, serverKey);
    }
    // ── the LEGACY shape: the plaintext key as a bare string ────────────────────
    // Migration 191 part 2 widened this RPC to an object carrying the key PLUS the exam
    // receipt. Both shapes are accepted here, deliberately and permanently: edge functions
    // and migrations deploy separately, so between the two deploys this code runs against
    // 139's `returns text` body, and a rollback puts it back. A shape assumption here
    // would present as every user silently losing BYOK for the length of that window.
    if (typeof data === 'string') {
      // The user's own key. Returned to the caller for the provider request ONLY.
      if (data.trim().length > 0) {
        return { key: data, byok: true, probeProfile: null, probeModel: null, probeVersion: null, probeTier: null };
      }
      // A STRING at all means a row: 139's body returns NULL, not '', when there is no
      // key on file. So a blank plaintext is a broken read of an existing key, and the
      // boundary it belongs to is real. Closed, without asking the witness.
      return VAULT_UNAVAILABLE;
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
      // 191's body only BUILDS this object when the ciphertext row exists, so an object
      // with a blank key is the carry-all twin of the blank string above: a real boundary
      // whose plaintext did not survive the read. Closed.
      return VAULT_UNAVAILABLE;
    }
  } catch {
    if (onLookupError) onLookupError('surveyor_byok_get threw — vault unreadable');
    return await settleVaultFailure(owner, provider, serverKey);
  }
  // The lookup SUCCEEDED and answered "no key on file" (null / an unrecognized shape).
  // That is not a vault failure, so the managed house path is untouched.
  return serverKeyResult(serverKey);
}

/**
 * Resolve the ambiguity a failed vault read leaves behind: does this user have a key of
 * their own? Asks the witness the user themselves reads (surveyor_byok_status — provider,
 * has_key, health; never plaintext). Anything short of a confident "no row" fails closed.
 */
async function settleVaultFailure(
  owner: RpcClient | undefined,
  provider: string,
  serverKey: string,
): Promise<ProviderKeyOutcome> {
  if (!owner) return VAULT_UNAVAILABLE;
  try {
    const { data, error } = await owner.rpc('surveyor_byok_status', { p_provider: provider });
    if (error || !Array.isArray(data)) return VAULT_UNAVAILABLE;
    // A set-returning function answers one row per stored key and none at all for a user
    // with no key. Empty is therefore the ONLY answer that reopens the house path.
    return data.length === 0 ? serverKeyResult(serverKey) : VAULT_UNAVAILABLE;
  } catch {
    return VAULT_UNAVAILABLE;
  }
}

/** The shared server key carries no exam receipt: a probe measures a USER's key, and the
 *  server key is not one. Stated as a function so every house path agrees. */
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
