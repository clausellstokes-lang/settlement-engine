# GRANTS-1 — generated extras (from out/*.json; do not edit by hand)

Class SERVER+NOBODY: 247. In the revoke block: 245 (group 1: 21, group 2: 84, group 3: 140); already closed to both roles: 112.

## Kept out of the block: needed by a user path (2)

- `_gallery_sanitize_public_json(jsonb,text[])` (NOBODY, invoker): called by user-path invoker _gallery_apply_member_overrides
- `_gallery_world_snapshot_is_safe(jsonb)` (NOBODY, invoker): called by user-path invoker _saved_maps_world_snapshot_guard

## (3) Meant for users, taking a user or actor id (51 arguments; 15 never compared with auth.uid() in the text)

| function | intent | argument | compared with auth.uid() | staff gate on the caller | in an RLS policy | rpc( callers in src/ |
|---|---|---|---|---|---|---|
| `get_credit_balance(uuid)` | USER | target_user | yes | yes | no | src/lib/creditLedger.js |
| `publish_settlement(uuid)` | ANYONE | target_id | yes | no | no | src/lib/gallery.js |
| `unpublish_settlement(uuid)` | ANYONE | target_id | yes | no | no | src/lib/gallery.js |
| `_audit_action(uuid,uuid,text,jsonb,jsonb,text)` | UNSTATED | p_actor_id | **no** | no | no | — |
| `_audit_action(uuid,uuid,text,jsonb,jsonb,text)` | UNSTATED | p_target_id | **no** | no | no | — |
| `admin_grant_credits(uuid,integer,text)` | ANYONE | target_user | yes | yes | no | — |
| `admin_set_role(uuid,text)` | ANYONE | target_user | yes | yes | no | — |
| `set_curated(uuid,boolean,integer)` | ANYONE | target_id | **no** | yes | no | src/lib/gallery.js |
| `profile_has_premium_access(uuid)` | ANYONE | target_user | **no** | no | no | — |
| `welcome_credit_available(uuid)` | ANYONE | target_user | yes | yes | no | src/components/dossier/WelcomeCreditCard.jsx |
| `toggle_gallery_vote(uuid)` | USER | target_settlement_id | yes | no | no | src/lib/gallery.js |
| `get_gallery_vote_state(uuid)` | ANYONE | target_settlement_id | **no** | no | no | src/lib/gallery.js |
| `add_gallery_comment(uuid,text)` | USER | target_settlement_id | yes | no | no | src/lib/gallery.js |
| `delete_gallery_comment(uuid)` | USER | target_comment_id | yes | no | no | src/lib/gallery.js |
| `report_gallery_dossier(uuid,text,text)` | USER | target_settlement_id | yes | no | no | src/lib/gallery.js |
| `resolve_gallery_report(uuid,text,text)` | USER | target_report_id | yes | yes | no | src/lib/gallery.js |
| `reactivate_free_settlement(uuid)` | USER | target_settlement_id | yes | no | no | src/lib/saves.js |
| `unpublish_map(uuid)` | USER | target_id | yes | no | no | src/lib/gallery.js |
| `has_role(uuid,text[])` | USER | p_uid | **no** | no | no | — |
| `admin_user_summary(uuid)` | USER | target_user | **no** | yes | no | — |
| `admin_user_full(uuid,text)` | USER | target_user | yes | yes | no | — |
| `admin_list_warnings(uuid)` | USER | p_target | **no** | yes | no | — |
| `admin_list_internal_notes(uuid)` | USER | p_target | **no** | yes | no | — |
| `account_is_active(uuid)` | USER | p_uid | **no** | no | yes | — |
| `publish_map(uuid,text,text,text[],boolean,text,text,boolean,jsonb,jsonb,text,jsonb)` | USER | target_id | yes | no | no | src/lib/gallery.js |
| `free_narrative_available(uuid)` | USER | target_user | yes | yes | no | — |
| `toggle_gallery_reaction(uuid,text)` | USER | target_settlement_id | yes | no | no | src/lib/gallery.js |
| `get_gallery_reaction_state(uuid)` | ANYONE | target_settlement_id | **no** | no | no | src/lib/gallery.js |
| `set_featured(uuid,boolean,integer)` | ANYONE | target_id | **no** | yes | no | src/lib/gallery.js |
| `set_featured_map(uuid,boolean,integer)` | ANYONE | target_id | **no** | yes | no | src/lib/galleryUnlisted.js |
| `share_settlement_unlisted(uuid)` | ANYONE | target_id | yes | no | no | src/lib/galleryUnlisted.js |
| `rotate_settlement_unlisted_slug(uuid)` | ANYONE | target_id | yes | no | no | src/lib/galleryUnlisted.js |
| `revoke_settlement_unlisted(uuid)` | ANYONE | target_id | yes | no | no | src/lib/galleryUnlisted.js |
| `share_map_unlisted(uuid)` | ANYONE | target_id | yes | no | no | src/lib/galleryUnlisted.js |
| `rotate_map_unlisted_slug(uuid)` | ANYONE | target_id | yes | no | no | src/lib/galleryUnlisted.js |
| `revoke_map_unlisted(uuid)` | ANYONE | target_id | yes | no | no | — |
| `report_gallery_comment(uuid,text,text)` | USER | target_comment_id | yes | no | no | src/components/gallery/GalleryComments.jsx |
| `list_gallery_comments(uuid)` | ANYONE | target_settlement_id | **no** | no | no | src/lib/gallery.js |
| `report_gallery_map(uuid,text,text)` | USER | target_map_id | yes | no | no | — |
| `resolve_report_target(text,uuid,text,text)` | USER | p_target_id | yes | yes | no | src/components/gallery/GalleryModerationPanel.jsx |
| `mutate_settlement_batch(uuid,jsonb,uuid[],jsonb)` | USER | p_expected_user | yes | no | no | src/lib/saves.js |
| `apply_cut_trade_route_command(uuid,text,uuid,timestamp with time zone,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb)` | USER | p_expected_owner | yes | no | no | src/lib/canonEventCommandPersistence.js |
| `apply_import_reconciliation_command(uuid,text,text,uuid,uuid,text,text,jsonb,jsonb)` | USER | p_expected_owner | yes | no | no | src/lib/importReconciliationCommandPersistence.js |
| `compare_and_swap_campaign_content_binding(uuid,text,text,uuid,text,jsonb,jsonb)` | USER | p_expected_owner | yes | no | no | src/lib/campaigns.js |
| `import_custom_content_archive(uuid,text,text,jsonb)` | USER | p_expected_owner | yes | no | no | src/lib/customContentArchiveService.js |
| `export_custom_content_archive(uuid)` | USER | p_expected_owner | yes | no | no | src/lib/customContentArchiveService.js |
| `apply_reviewed_supply_chain_command(uuid,text,text,jsonb)` | USER | p_expected_owner | yes | no | no | src/lib/customContentReviewedSupplyChainService.js |
| `apply_custom_content_command(uuid,text,text,jsonb)` | USER | p_expected_owner | **no** | no | no | src/lib/customContentServiceRuntime.js |
| `apply_create_route_command(uuid,text,uuid,uuid,timestamp with time zone,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb,jsonb)` | USER | p_expected_owner | yes | no | no | src/lib/canonEventCommandPersistence.js |
| `set_my_email_preference(uuid,text,boolean)` | USER | p_expected_user | yes | no | no | src/lib/emailPreferences.js |
| `set_my_telemetry_consent(uuid,jsonb,text)` | USER | p_expected_user | yes | no | no | src/lib/consentSync.js |

## (4) Browser rpc( calls that rely on the hosted default grant (0)


## (4) Browser rpc( calls granted to authenticated by name, reachable by a LOGGED-OUT browser only through the hosted default (32)

- `set_founder_credit_listed(boolean)` (USER): src/components/account/FounderCreditToggle.jsx
- `has_surveyor_entitlement()` (USER): src/components/account/useAccountSurveyorGate.js, src/components/surveyor/useSurveyorEntitled.js
- `report_gallery_comment(uuid,text,text)` (USER): src/components/gallery/GalleryComments.jsx
- `list_open_report_targets()` (USER): src/components/gallery/GalleryModerationPanel.jsx
- `resolve_report_target(text,uuid,text,text)` (USER): src/components/gallery/GalleryModerationPanel.jsx
- `get_ai_pricing()` (USER): src/config/livePricing.js
- `set_my_security_answers(text,text,text,text)` (USER): src/lib/auth.js
- `get_my_security_question_ids()` (USER): src/lib/auth.js
- `claim_current_session(text)` (USER): src/lib/authSecurity.js
- `is_current_session()` (USER): src/lib/authSecurity.js
- `set_auto_reload_settings(boolean,integer,integer,integer)` (USER): src/lib/autoReloadClient.js
- `has_dossier_entitlement(uuid)` (USER): src/lib/dossierEntitlements.js
- `import_gallery_dossier(text)` (USER): src/lib/gallery.js
- `publish_map(uuid,text,text,text[],boolean,text,text,boolean,jsonb,jsonb,text,jsonb)` (USER): src/lib/gallery.js
- `unpublish_map(uuid)` (USER): src/lib/gallery.js
- `list_my_gallery_dossiers()` (USER): src/lib/gallery.js
- `toggle_gallery_vote(uuid)` (USER): src/lib/gallery.js
- `toggle_gallery_reaction(uuid,text)` (USER): src/lib/gallery.js
- `add_gallery_comment(uuid,text)` (USER): src/lib/gallery.js
- `delete_gallery_comment(uuid)` (USER): src/lib/gallery.js
- `report_gallery_dossier(uuid,text,text)` (USER): src/lib/gallery.js
- `list_gallery_reports(text,integer)` (USER): src/lib/gallery.js
- `resolve_gallery_report(uuid,text,text)` (USER): src/lib/gallery.js
- `validate_redeem_code(text)` (USER): src/lib/referralRedeem.js
- `record_referral_intent(text)` (USER): src/lib/referralRedeem.js
- `reactivate_free_settlement(uuid)` (USER): src/lib/saves.js
- `surveyor_byok_status(text)` (USER): src/lib/surveyorByok.js
- `surveyor_byok_set(text,text)` (USER): src/lib/surveyorByok.js
- `surveyor_byok_clear(text)` (USER): src/lib/surveyorByok.js
- `surveyor_settings_get()` (USER): src/lib/surveyorByok.js
- `surveyor_settings_set(jsonb)` (USER): src/lib/surveyorByok.js
- `surveyor_price_estimates()` (USER): src/lib/surveyorByok.js

## (4) Browser rpc( calls to functions never granted by name (they ride PUBLIC) (0)


src/ rpc( names seen: 82; of them not found in the catalog: set_founder_chair_bio, list_founder_chairs_public.
