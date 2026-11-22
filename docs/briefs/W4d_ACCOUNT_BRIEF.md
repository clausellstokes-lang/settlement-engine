# W4d Implementer Brief — Account (Security / Data & Privacy / Support / Preferences)

Opus implementer, Phase 5 Reunification W4d, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; manager reviews + commits. BINDING:
docs/PHASE5_REUNIFICATION.md + memory/feature-parity-ledger.md §7 (Account) + §8 (Admin,
SupportQueue only). REFERENCE (read-only):
/Users/cstokes/Desktop/settlement-generator/settlement-engine.

FENCE: src/components/account/**, src/components/admin/SupportQueuePanel* only, src/lib/auth.js,
src/lib/accountData.js, src/lib/accountImport.js, src/store/accountImportSlice.js,
src/lib/referralRedeem.js, and the account-page IA. NOT yours: the rest of admin/**, auth
PANEL/OAuth (RQ owns, committed), settlements/**, map/**, gallery/**. NO git add/commit/stash.

KEY THEME: much of this is WIRING ORPHANED BACK-ENDS that already ship in OURS (the ledger:
"accountData.js, accountImport.js, accountImportSlice.js, referralRedeem.js ship in OURS but
no UI imports them"). Those are safe, high-value wire-ups. A few items need NEW backend
(new Supabase auth calls, or a tickets table) — wire the ones whose API exists; STOP+report
the ones that need a migration/edge that's absent.

## Items

1. SECURITY SECTION (ledger §7, ranked #4 — biggest account gap). Adopt AccountSecuritySection:
   change-password, email-reset, linked Google/Discord identities, sign-out-everywhere.
   The methods `changePassword`/`getIdentities`/`linkIdentity`/`unlinkIdentity`/global-signout
   are standard SUPABASE AUTH API (supabase.auth.updateUser / getUserIdentities /
   linkIdentity / signOut({scope:'global'})) — add them to lib/auth.js and wire the UI. 2FA is a
   stub in THEIRS — render the stub or omit (your call; report). This pairs with RQ's OAuth
   (linked-identities shows the Google/Discord links).

2. DATA & PRIVACY (ledger §7, ranked #7). Wire the ORPHANED back-ends: data EXPORT
   (lib/accountData.downloadAccountExport — exists, no caller) + data IMPORT
   (accountImportSlice.importAccountData + lib/accountImport.js — exist, never invoked). Add
   bulk-delete settlements/campaigns + delete-account request (typed-phrase confirm). If
   `requestAccountDeletion` is ABSENT (no edge/RPC), render the UI wired to a report + STOP on
   the server call — report it. Visibility/sharing defaults if the store supports them.

3. SUPPORT TICKETS (ledger §7 #5 / §8). OURS = a single fire-and-forget contact form writing
   `support_messages`. THEIRS = AccountTickets (submit/view/thread/reply) + operator
   SupportQueuePanel (claim/assign/transition/reply/notes). This needs a tickets table + RPCs.
   VERIFY OUR schema: grep supabase/migrations for a tickets table (055_support_tickets.sql
   exists per earlier work — check what it provides). If the table + RPCs exist → wire
   AccountTickets + SupportQueuePanel to them. If only `support_messages` exists → build the
   AccountTickets UI against what exists and STOP+report the thread/reply backend gap. Do not
   invent RPCs.

4. REFERRAL + REDEEM ON ACCOUNT (ledger §7). Adopt ReferralRedeemBlocks (referral card =
   account id + copy; redeem-code block) onto the account surface. Backend `referralRedeem.js`
   ships in OURS. Redeem already works on Pricing/PurchaseModal — reuse that action.

5. PREFERENCES SECTION (ledger §7). AI-polish default / PDF style / autosave defaults — if the
   store has these prefs, wire the section; else report which are absent.

6. LEFT-RAIL ACCOUNT IA (ledger §7, structural). Adopt AccountNav (left-rail panels + mobile
   tab strip + focus mgmt) as the frame the sections slot into. OURS is one long scroll. This
   is the structural container; keep every OUR section working inside it.

## DO-NOT-REGRESS (OURS-ahead): the per-category email opt-out
(`AccountEmailPreferencesSection`, migration 126) — THEIRS has only a single toggle. Preserve
it as-is inside the new IA. Also keep OUR working profile/subscription/recovery-questions
sections.

## Laws + gates
Wire orphaned back-ends confidently; STOP+report on absent server deps (never stub an RPC).
Security methods route through supabase-js (real API). eslint clean; targeted account tests +
a new test pinning: export/import wired, security section renders + calls the auth methods,
per-category email opt-out preserved; typecheck + strict; build + verify:dist (budget — account
is lazy). Report per-item status, which back-ends were orphaned-and-wired vs absent-and-reported,
the tickets-schema finding, files + line counts, gate results, OURS-ahead preserved.
