/**
 * actorLinks.ts — first-contact actor claiming for the analytics identity model
 * (docs/simulation-intelligence-layer.md §2; schema in migration 036).
 *
 * ONE writer for both mapping tables. Lifted out of index.ts so the race the
 * unchecked inserts used to hide is EXECUTABLE from vitest: index.ts carries remote
 * deno.land / esm.sh imports and cannot be loaded there, this module imports nothing.
 *
 * THE RULE: the STORED row is the authority, never the actor this request happened to
 * mint. Discarding the insert result hid two distinct failures:
 *
 *   1. CONCURRENT FIRST CONTACT. Two requests for the same device_key / user_id both
 *      miss the select, both mint, and the loser's 23505 is swallowed — so its batch
 *      is written under an actor no mapping row names. analytics_events.actor_id has
 *      no FK (036:53, "null => purged/orphaned"), so the orphan persists.
 *
 *   2. CROSS-USER DEVICE ADOPTION — the permanent one. A signed-in first contact
 *      adopts the device's existing actor so the anon funnel stitches to signup, but
 *      analytics_identity_links.actor_id is UNIQUE (036:31-35). On a shared browser
 *      profile the device token is never rotated at sign-out (src/lib/deviceToken.js),
 *      so user B adopts user A's actor, the upsert's ON CONFLICT (user_id) does not
 *      arbitrate the actor_id index, the write raises — and unchecked, B gets NO
 *      mapping row at all and re-adopts A's actor on every later request. B's whole
 *      telemetry history is filed under A's identity, and purge_analytics_for_user(B)
 *      returns 'no actor mapping' and erases nothing.
 *
 * Both collapse to one recovery: re-read, and if the key is STILL unmapped then it
 * was the candidate ACTOR that collided, so claim a fresh one instead.
 *
 * FAIL-SOFT: telemetry must never fail a request. An unwritable mapping returns an
 * unlinked actor — the batch is attributed to an actor with no row and ages out on
 * the 400-day prune (039), which is the pre-existing documented posture, not a throw.
 */

/** The subset of a supabase-js client this module needs (keeps it stub-friendly). */
export type LinkAdmin = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => PromiseLike<{ data: { actor_id?: unknown } | null; error?: unknown }>;
      };
    };
    insert: (row: Record<string, unknown>) => PromiseLike<{ error: unknown }>;
  };
};

/** A minted actor id. Injectable so the pins can assert WHICH actor was claimed. */
export type ActorMinter = () => string;

const defaultMint: ActorMinter = () => crypto.randomUUID();

export const IDENTITY_TABLE = 'analytics_identity_links';
export const DEVICE_TABLE = 'analytics_device_links';

/** The stored actor for one mapping key, or null when unmapped OR unreadable. */
export async function readActorId(
  admin: LinkAdmin,
  table: string,
  keyColumn: string,
  key: string,
): Promise<string | null> {
  const { data } = await admin.from(table).select('actor_id').eq(keyColumn, key).maybeSingle();
  return typeof data?.actor_id === 'string' ? data.actor_id : null;
}

/**
 * Claim `candidate` for `key`, yielding to whatever is already stored. Returns the
 * actor this request must use. Never throws.
 */
export async function claimActorLink(
  admin: LinkAdmin,
  table: string,
  keyColumn: string,
  key: string,
  candidate: string,
  mint: ActorMinter = defaultMint,
): Promise<string> {
  const { error } = await admin.from(table).insert({ [keyColumn]: key, actor_id: candidate });
  // A clean insert on a unique key IS the stored row — no other row for `key` can exist.
  if (!error) return candidate;
  // Something else holds it. Either another request won the same key…
  const stored = await readActorId(admin, table, keyColumn, key);
  if (stored) return stored;
  // …or the key is still unmapped, which means the collision was on the ACTOR (the
  // adopted device actor already belongs to a different identity). Claim a fresh one.
  const fresh = mint();
  const { error: retryError } = await admin.from(table).insert({ [keyColumn]: key, actor_id: fresh });
  if (!retryError) return fresh;
  return (await readActorId(admin, table, keyColumn, key)) || fresh;
}

/** The device's actor, minting and claiming one on first contact. */
export async function resolveDeviceActor(
  admin: LinkAdmin,
  deviceKey: string,
  mint: ActorMinter = defaultMint,
): Promise<string> {
  const stored = await readActorId(admin, DEVICE_TABLE, 'device_key', deviceKey);
  if (stored) return stored;
  return claimActorLink(admin, DEVICE_TABLE, 'device_key', deviceKey, mint(), mint);
}

/**
 * The signed-in user's actor. On first contact the device's actor is offered as a
 * CANDIDATE (so the anonymous funnel stitches to signup), never as a decision: the
 * unique actor_id index rejects a device actor another identity already owns, and
 * claimActorLink mints this user their own instead.
 */
export async function resolveUserActor(
  admin: LinkAdmin,
  userId: string,
  deviceKey: string | null,
  mint: ActorMinter = defaultMint,
): Promise<string> {
  const stored = await readActorId(admin, IDENTITY_TABLE, 'user_id', userId);
  if (stored) return stored;
  const adopted = deviceKey ? await readActorId(admin, DEVICE_TABLE, 'device_key', deviceKey) : null;
  return claimActorLink(admin, IDENTITY_TABLE, 'user_id', userId, adopted || mint(), mint);
}
