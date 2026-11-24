# GRANTS-1: APART, LISTED FOR THE READER, NOT BUILT (ruling G1 §8 and amendment G1c; 2026-11-24 15:53 UTC)

These come from the PGlite catalog of 001–210 (`measure/out/functions.json`, `bodies.json`) and from grep of the working line and `origin/master`. A CONFIRMED item was executed or matched in the catalog; a PLAUSIBLE item was read.

## 1. USER functions that a visitor (anon) can execute under the hosted default, and that act on an argument without refusing a null `auth.uid()`

59 USER functions (granted to `authenticated` by name) are executable by `anon` through the hosted default. 42 of them take an argument. Read by body, all but three refuse a null caller before they act: they raise "not authenticated", return early on `auth.uid() is null`, or gate on `current_user_is_*()` or on `account_is_active(auth.uid())`. For example, `bump_map_import` and `import_gallery_map` return early, `import_gallery_dossier` filters on `auth.uid() is not null`, and `has_dossier_entitlement` returns false. The three that do not refuse:

| function | what it tells a stranger | note |
|---|---|---|
| `has_role(uuid,text[])` (050) | whether any account id holds a given role ("is this id staff?") | It feeds the forged-`p_actor` admin RPCs, which part A closes to visitors. G1c. |
| `account_is_active(uuid)` (057) | whether any account is banned, disabled or deleted | It is used in RLS policies (the profiles self-update policy among them), so it cannot be revoked from `authenticated`. G1c. |
| `surveyor_stage_enabled(text)` | whether a Surveyor stage flag is on | Configuration only; no user data. |

G1c's third function, `profile_has_premium_access(uuid)` (ANYONE, granted to `anon` on purpose), tells a stranger whether any account is premium or staff. Not built in this fix.

## 2. The 16 admin functions that trust the `p_actor` they are handed

Part A closes all 16 to `anon` and `authenticated` (CONFIRMED in PGlite). Their bodies check `has_role(p_actor, …)`, the argument rather than the caller, so their remaining trust is in the edge function that calls them with the service-role client:

| functions | edge caller (both trees) | how the edge proves the caller is staff (PLAUSIBLE, read) |
|---|---|---|
| `add_internal_note`, `set_account_disabled`, `admin_soft_delete_settlement`, `admin_remove_gallery_item`, `admin_revoke_share_link`, `admin_billing_summary`, `admin_diagnostic_bundle`, `claim_ticket`, `set_ticket_status`, `link_ticket_faq`, `set_gallery_comment_hidden`, `admin_soft_delete_map`, `admin_remove_gallery_map`, `admin_set_content_banned`, `write_audit` | `admin-actions/index.ts` | It verifies the bearer JWT with `userClient.auth.getUser()` (401 otherwise), then reads the caller's `role` from `profiles` with the service client. It refuses with 403 unless the role is `support`, `admin` or `developer`, or the caller's email equals a configured `OWNER_EMAIL`. Writes and full-PII reads also require `admin` or `developer` (`isHighest`). The protected actions in `_shared/twoKey.ts :: PROTECTED_ACTION_SET` need a second key. Every call passes `p_actor: callingUser.id` (20 sites), never a body value. |
| `write_audit` | `pricing-resync-cron`, `retention-warning-cron` | A constant-time match of the `x-cron-secret` header against an env secret (503 if the secret is unset, 403 on a mismatch). The actor is null. |
| `_log_founder_transfer_event` (actor is text) | `founder-transfer/index.ts` | The actor is the literal `'system'` or the verified caller's own id, passed through the service client `admin = makeAdminClient()`. |

## 3. Columns kept out of part D (a page may write them)

`settlements`/`saved_maps`: `is_public`, `public_slug`, `published_at`, `unlisted_slug`, `visibility`, and every content and `gallery_*` column. Pages pass these keys (`src/components/ShareToGallery.jsx`, `src/hooks/useGalleryShareControls.js`, `src/lib/gallery.js` metadata patches, `src/lib/saves.js`), so whether each is a direct table write or a local store update was not proven column by column. They are left to a ruling. The 171 ban trigger still refuses publishing a banned row.
