# THE DOWNGRADE-TRANSITION AUDIT — FINDINGS REGISTER (2026-07-19)
## Commission: ledger 2092f4f8. Tree: the composite @ aad6265e (read-only). Method: 5-lens adversarial
## (server walls · client offers · artifact disposition · Stripe lifecycle · round-trip), executed evidence:
## 3 pglite wall probes · a 22/22 retention→restore→purge pipeline probe · the 56/56 webhook execution suite.
## Lens 5's agent never reported; its slice was independently closed (lens-3 restore probe + integrator code reads), so labeled.

## §1 CAPABILITY LEAKS
1.1 ✅ NO CONFIRMED SERVER-WALL LEAK. Every paid service re-checks entitlement per request against the DB
    (ai-analyst 186-189 fail-closed · byok :115 gate-before-key · spend/save-cap/RLS re-read per request;
    probe: revocation stops service on the NEXT request). Server-side staleness = ZERO.
1.2 P1 CONFIRMED bounded-by-design: client-rendered premium exports (PDF/JSON/Foundry) have no server wall —
    a just-downgraded live session can export for ≤ the JWT TTL (~1h). Accepted design fact; the TTL is the dial.
1.3 P2 CONFIRMED: surveyor_byok_set is auth.uid()-only (139:129-149) — ANY signed-in user can store a key;
    no service follows, but = over-offer + unnecessary secret custody. FIX ORDERED (entitlement-gate the RPC).

## §2 DESTRUCTION PATHS
2.1 P0 CONFIRMED (probe ×2): the retention purge CASCADE-DESTROYS PAID durable dossier rights
    (dossier_entitlements.save_id ON DELETE CASCADE 108:74 + blind purge 024:420-423). "Deletion forfeits"
    contemplated USER deletion, not system purge. FIX ORDERED (manager rec, vetoable): the purge SPARES any
    settlement carrying an active entitlement (the user paid; storage is trivial).
2.2 P1 CONFIRMED: expiry warned in-UI only (no retention email template exists); inactive cards offer
    Reactivate not Export — the only export ramp spends a free slot. FIX ORDERED: retention-warning template
    (the Wave-E mail seam's consumer) + a direct read-only Export affordance on inactive cards.
2.3 Notable CONFIRMED: founder refund clawback's −30 is provenance-blind (spent bonus ⇒ consumes purchased
    credits). Zero-clamped, commercially defensible → OWNER QUEUE to ratify.
Everything else SURVIVES: credits (probe: untouched through downgrade AND purge) · custom content/traditions
frozen-not-deleted · sidecars cascade only with parents · published dossiers stay public · vault rows retained.

## §3 SAFE-VERIFIED (executed proof)
Webhook machinery 56/56 (founder-guard · idempotency · stale-sub guard · out-of-order guard ·
restore-on-resubscribe · clawback claim-once/redelivery) · downgrade/restore RPC bodies proven (freeze-all +
3-month stamp; restore reverses EVERY field incl. pending_delete — probe) · free save-cap = server trigger
per insert · auth pipeline server-fresh per auth event (tier always profiles-sourced, never JWT-decoded) ·
~30 client offer surfaces reactive, no stale-true caches · monthly allowance per-invoice (no farming) ·
Cartographer↔Surveyor fully independent.

## §4 GRANDFATHER AMBIGUITIES → OWNER QUEUE
4.1 Beyond-cap saves/maps/campaigns: frozen-viewable 3mo → purged; free tier has NO map entitlement (all-or-
    nothing for a downgraded Cartographer's realms). DECIDE: view-vs-lock + longer/indefinite read-only
    reprieve for large canonized campaigns.
4.2 Worn minted skins: de-facto grandfather (defs in the save; minting stays gated). REC: leave as-is.
4.3 Founder voluntary downgrade: CONFIRMED nonexistent (refund clawback only). CONFIRM intentional.
4.4 BYOK keys after revocation: vault survives until user-cleared. DECIDE: revocation-clears vs retain-for-regrant.
4.5 Founder re-purchase after clawback: bonus is once-per-account; a re-buying clawed-back founder gets no
    bonus. DECIDE re-grant semantics.

## §5 CENSUS / REPRESENTATION
Tier truth: profiles.tier {free,premium} + is_founder + surveyor_entitlements (139). Surveyor = NOT a tier,
NOT a Stripe product; provisioning/revocation = MANUAL SERVICE-ROLE SQL ONLY (no purchase path, no admin
verb) → FIX ORDERED: Wave B #16, the Surveyor purchase→grant limb through the webhook fortress + an admin
grant verb. Founder seat table (137) DRAFT/unapplied; is_founder is today's truth. The only automated
downgrade = subscription.deleted; payment_failed never downgrades (dunning rides); subscription.updated
UNHANDLED → FIX ORDERED: defensive pause handling. ⚠ THE DISCRIMINATOR (P1-adjacent CONFIRMED): the client
has NO surveyor bit; SurveyorDoor keys on tier==='premium' — Cartographers see a refused door; a revoked
Surveyor's door NEVER closes (permanent, not TTL-bounded). FIX = Wave B #15's spec confirmed: surface
has_surveyor_entitlement through fetchProfileAuth into auth; consume at SurveyorDoor + AccountAiKeysSection.

## OPERATIONAL LIVE-CONFIG CHECKS (⛔ owner dashboard, minutes each)
(a) pg_cron purge install is exception-swallowed (024:440,:455) — verify the job exists in prod (if absent,
    no auto-purge runs and 2.1/2.2 cannot fire — safer for users, retention unenforced).
(b) Stripe portal: confirm subscription PAUSE is disabled (else a paused subscriber keeps premium indefinitely).
