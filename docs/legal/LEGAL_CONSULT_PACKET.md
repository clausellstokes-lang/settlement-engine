# T10 — assembled 2026-07-26 by the manager session (read-only inventory; no legal advice)
# Deliver alongside docs/legal/TERMS_OF_USE_DRAFT.md, PRIVACY_POLICY_DRAFT.md,
# TOS_AUTOMATION_CLAUSES_DRAFT.md, and docs/PERIMETER_RUNBOOK.md per the drafts' own instruction.

# T10 LEGAL CONSULT PACKET — SettlementForge

**Two lanes exist and they differ materially.** The Desktop checkout `/Users/cstokes/Desktop/settlement-engine` (the "ledger", branch `review-fixes-2026-07-08`, 136 migrations, 17 edge functions) is **behind**. Everything legally material — the founder-transfer machine, the deletion worker, migration 179, and all three legal drafts — lives only in the **minifold worktree**: `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold` (branch `claude/composite-r4`, HEAD `2e037f62`, 188 migrations, 31 edge functions). **Bring minifold to the consult.** Paths below are minifold unless marked LEDGER.

---

## 1. Live ToS and Privacy Policy (the user-facing texts)

| What | Path | State |
|---|---|---|
| Live Terms of Service (`/terms`) | `.../minifold/src/components/legal/TermsPage.jsx` (207 lines) | Last substantive commit `8c8619a4` 2026-07-17 (founder section added); touched `5b246bd7` 2026-07-21 (voice pass only). Clean in git. |
| Live Privacy Policy (`/privacy`) | `.../minifold/src/components/legal/PrivacyPage.jsx` (110 lines) | Same commits. |
| Shared frame + under-review banner | `.../minifold/src/components/legal/LegalPage.jsx` | Renders `POLICY_STATUS` on every page. |
| Version stamp | `.../minifold/src/lib/policyVersion.js` | `POLICY_VERSION = 1`, `POLICY_EFFECTIVE = '2026-07-10'`, `POLICY_STATUS = "v1 · under review"`. |
| LEDGER Terms (older) | `/Users/cstokes/Desktop/settlement-engine/src/components/legal/TermsPage.jsx` (169 lines) | **Missing the entire Founder Lifetime / transfers section.** |
| LEDGER Privacy (older) | `.../settlement-engine/src/components/legal/PrivacyPage.jsx` (96 lines) | Says **three** consent settings and "We do not sell your data"; minifold says **four** and adds the market-licensing paragraph. |

The live pages carry a visible disclaimer: *"This page is a working draft written from how the product actually behaves. It is not yet reviewed legal text."*

**There is no click-through acceptance gate.** `policyVersion.js` states it explicitly: "there is no click-through acceptance gate today — the pages are informational." `POLICY_VERSION` exists to be stamped onto an acceptance record that does not yet exist.

**Counsel's drafts (input documents, never shipped):**
- `.../minifold/docs/legal/TERMS_OF_USE_DRAFT.md` (426 lines) — full redraft with §15 source-of-truth table and §16 placeholder list. Commit `8c8619a4`, 2026-07-17.
- `.../minifold/docs/legal/PRIVACY_POLICY_DRAFT.md` (225 lines) — same shape, §15 placeholder list.
- `.../minifold/docs/legal/TOS_AUTOMATION_CLAUSES_DRAFT.md` (235 lines) — Clauses A–G on scraping, TDM/AI-training reservation, bot-waves, bulk generation, security-research boundary, enforcement, authorized user-agents. Commit `88ec915b`, 2026-07-19. Its §9 already carries six questions for counsel.

Related non-legal-but-binding pages in minifold only: `CovenantPage.jsx` (`/covenant`, "The Portability Covenant" — public promises pinned to real capabilities by `tests/components/covenantClaimsParity.test.js`) and `BountyPage.jsx` (`/bounty`, "The Contradiction Bounty" — a standing public invitation to report coherence failures). Both are public promises with no consideration/liability framing.

**Questions for counsel:** (a) Does an informational page with an "under review" banner bind anyone? (b) Is a clickwrap needed at sign-up, at checkout, or both? (c) Do the Covenant and Bounty pages create enforceable promises or a warranty?

---

## 2. Refund / cancellation language, and the CRIT-1 mismatch

**What users see:**
- `TermsPage.jsx` §`terms-refunds` (lines 135–177) is the canonical policy. The standalone `/refunds` page was retired; that URL now renders `TermsPage` scrolled to `#terms-refunds` (`scrollToId` prop + AppViews).
- Point-of-purchase links: `.../minifold/src/components/PurchaseModal.jsx:318-327` renders Terms · Refunds · Privacy under the checkout button, plus "Payments processed securely by Stripe. Credits never expire."
- Footer labels: `.../minifold/src/copy/footer.js` (`privacy` / `terms` / `refunds`; copyright reads `© {year} SettlementForge` — **no entity name**).

**Terms text says:** failed narrations auto-refund their credit; first narration free; single dossier PDF re-downloadable while the settlement is saved, download right forfeited on deletion; Cartographer cancels at period end with "We do not generally refund partial months, except where consumer law in your jurisdiction requires it"; Founder Lifetime charged-in-error reviewed on request.

**CONTRADICTING COPY — flag this.** `.../minifold/src/copy/en.js:1528-1531`, the Account-page FAQ (`refundWindow`, rendered by `src/components/account/AccountFAQ.jsx`), tells users:

> "Single-dossier purchases are refundable within 7 days if you have not exported or downloaded the PDF. Subscription refunds are handled case-by-case via Customer Support below."

No 7-day window appears in the Terms. Two further mismatches in the same FAQ block: credit costs are stated as Narrative 5 / Daily Life 4 / Progression 6 (`en.js:1521`) while `TERMS_OF_USE_DRAFT.md:88` states 3 / 4 / 5; and `founderLifetime` (`en.js:1533`) promises "every current and future tier for the life of the product," broader than the Terms' "lifetime access to the paid tier."

**THE CRIT-1 POLICY REALITY the copy must match.** `.../minifold/supabase/functions/stripe-webhook/index.ts:3015-3021`:

> "Any reversal of the qualifying payment reverses the reward. **A PARTIAL refund also claws back** (charge.refunded fires for both): a payment the customer walked back in any amount no longer anchors a reward."

A single `charge.refunded` event — of **any amount** — runs four clawbacks over every resolved key (`index.ts:3022-3053`): referral reward (`clawback_referral`, mig 107), single-dossier entitlement (`clawback_dossier_entitlement`, mig 108, which flips the voucher to `refunded` *unconditionally*), **founder seat** (`clawbackFounderForSession` → `release_founder_seat_on_clawback`, mig 137:428 — reverses `is_founder`, frees the seat, reverses the 30-credit bonus, drops the account to free tier + retention window), and any live transfer case (`clawbackTransferForSession`). Money-ledger rows flip to `refunded`/`disputed`.

Operationally: **a $5 goodwill refund on a $99 Founder purchase destroys the seat and the lifetime license.** The safe goodwill instrument is a credit grant (`service_adjust_credits` / `admin_grant_credits`, mig 009/103), which touches no entitlement. There is also a dedicated goodwill path: `stripe-webhook/index.ts:808-846` — a goodwill refund of the original $99 while a transfer case is live aborts the case and refunds the nominee's $99, keyed `abort-refund-<case>`.

**Questions for counsel:** (a) Must the FAQ's 7-day PDF window be honored as a published offer, or can it be corrected to match the Terms? (b) Can the Terms disclose that any partial refund voids the entitlement, and is that enforceable against a consumer? (c) Does UK/EU 14-day distance-selling withdrawal apply to the PDF and the Founder license, and does the "delivered on the success page" moment kill it? (d) Is "we do not generally refund partial months" safe in the target markets?

---

## 3. Data-handling surfaces

**Account deletion (new, minifold-only).**
- `.../minifold/supabase/migrations/175_account_deletion_cleanup_queue.sql` — replaces the old SQL-only cron. Prior design marked a request `done` inside Postgres *before* revoking the GoTrue account and cancelling Stripe subscriptions; unattended runs could never do either. Now: `requested → processing + queue row → done ONLY after GoTrue revocation, complete paginated Stripe cancellation, and transactional Stripe-linkage clearing.` Leased claims, SKIP LOCKED, checkpointed auth progress, stale-lease recovery. Old `account-deletions-daily` cron unscheduled; new hourly pg_net dispatcher seeded **inert** (url/secret null).
- `.../minifold/supabase/functions/account-deletion-worker/index.ts` — four fail-closed gates (secret configured → constant-time header match → `system_config.account_deletion_cron.enabled === true` → stored secret matches env). Default **grace window = 7 days** (`WORKER_LIMITS.graceDays.fallback: 7`, settable 0–365).
- Shared implementation: `.../minifold/supabase/functions/_shared/accountDeletionCleanup.ts`; manual admin path `account-actions/process_deletions`; user-facing filing `account-actions` `request_deletion` (`index.ts:383-387`).
- Client: `.../minifold/src/lib/accountData.js` `requestAccountDeletion` — soft-delete **request** only; RLS forbids client hard-delete.

**Migration 179 (owner-confirmed privacy deletes)** — `.../minifold/supabase/migrations/179_owner_confirmed_privacy_deletes.sql`. The bug it fixes is a data-rights bug: retention policies keep downgraded assets readable, but the DELETE policies required `access_state='active'`, so *PostgREST returned a successful zero-row DELETE* when a downgraded owner tried to erase retained data. Header: "Deletion is a one-way privacy operation; an active account must be allowed to remove every row it owns regardless of plan state." Also hardens `mutate_settlement_batch` to bind to the preflight-authenticated owner and lock the profile row.

**Deletion copy vs. product.** `PrivacyPage.jsx#privacy-deletion` says "To request deletion of your account, **contact us from the address on your account**." The product has a self-serve typed-phrase confirmation button — `AccountDataPrivacySection.jsx:590-606`, "Request account deletion," with the copy "There is a short grace period." The policy text understates the mechanism.

**Data export.** `.../minifold/src/lib/accountData.js` — `buildAccountExport(state)` (profile basics, settlements, campaigns, private custom content) / `downloadAccountExport` (Blob download). Import round-trip via `lib/accountImport.js` + `importAccountData`. UI: `.../minifold/src/components/account/AccountDataPrivacySection.jsx`. Custom-content archive folded in via `exportCustomContentArchive({ purpose: 'account-export' })`. Separate admin/analytics surface: `.../minifold/supabase/functions/analytics-export/index.ts`.

**Analytics / consent posture.** `.../minifold/src/lib/consent.js` — four planes, `CONSENT_MODEL_VERSION = 2`:
- `essential` — ON unless DNT or opt-out.
- `research` — **flipped to opt-OUT (ON by default)** in model v2; owner-ratified. `CONSENT_KEY` deliberately **not** bumped, so prior explicit opt-outs survive; the honoring mechanism is `updatedAt > 0` ⇒ stored flags honored verbatim, `updatedAt === 0` ⇒ new defaults apply.
- `market` — the **opt-IN item**: `MARKET_INSIGHTS_DEFAULT = false` (lines 45-49). Comment records the open owner decision: "The design leaves the default to an owner decision (RECOMMEND on ... but the trust-first posture argues off). We ship the trust-first default; the flip is this ONE constant (JUDGMENT, vetoable)." This plane governs aggregate k-anonymous data that **may be shared or licensed to the worldbuilding market**.
- `ai_prose` — reserved, off, collects nothing.

DNT is honored as a hard opt-out of **all** telemetry including essential. Server clamps to `min(client, profiles.telemetry_consent)`. UI: `.../minifold/src/components/PrivacySettings.jsx`. Every research capture is stamped with the consent-model version.

**The enrichment rider (non-togglable).** `PRIVACY_POLICY_DRAFT.md:107-113`: id-free, category-grade AI telemetry (theme, intent, tier, refusal reason-class) is "a **condition of using the AI features** (managed and BYOK) and is not togglable." The draft flags its own legal-review note: the condition-of-service framing needs a strict-jurisdiction / GDPR check.

**BYOK key handling.** `.../minifold/supabase/migrations/139_surveyor_entitlement_and_byok.sql` — vault table stores `ciphertext bytea` via `pgp_sym_encrypt` under a server passphrase; RLS ON with **zero policies**, so ciphertext is never selectable; decrypted only inside `surveyor_byok_get()` (service-role, per request). Health class stored separately (mig 143) without touching ciphertext. `.../minifold/supabase/functions/surveyor-byok/index.ts` — verify-by-test-call ("never store as healthy unverified"); the browser never holds the key; `tests/security/byokNeverLogged.test.js` scans the file to prove no logging.

**Questions for counsel:** (a) Is research-on-by-default lawful in the EU/UK without a consent banner, given DNT is honored and opt-out is silent? (b) Does the `market` plane's external licensing need affirmative opt-in everywhere, and what k-anonymity floor satisfies "anonymous"? (c) Is the non-togglable enrichment rider a lawful condition of service under GDPR? (d) Is a 7-day grace window plus irreversible anonymisation an adequate Art. 17 erasure response, and what receipt-retention period applies? (e) Does the self-serve delete need to be named in the Privacy Policy? (f) As a BYOK key custodian, what breach-notification and processor obligations attach?

---

## 4. The house seal / trademark question

**There is no trademark, clearance, or USPTO discussion anywhere in either repo.** A word-bounded grep of `docs/`, `src/`, and `marketing/` in both lanes returns zero hits for `trademark`, `USPTO`, `™`, or `clearance` in a mark sense. What exists is the **asset plus the naming rules**; the clearance work is entirely undone.

**The mark:**
- `.../minifold/src/components/brand/HouseDevice.jsx` — "THE HOUSE DEVICE, the eager brand mark (owner-approved final, **2026-07-18**)." Four inlined hand-inked paths: a ring broken by a settlement roofline, the station triangle, one oxblood seal-point at the triangle's centroid. `viewBox 0 0 64 64`.
- Canonical builder: `.../minifold/src/design/organic/logo.js` — `deviceMarkup`, `appleTouchIconSvg`, `ogImageSvg`. `tests/design/organicLogo.test.js` pins the inlined paths **byte-equal** to the canonical source.
- Raster/vector artifacts: `.../minifold/public/favicon.svg`, `favicon.ico`, `favicon-dark.png`, `apple-touch-icon.png`, `og-default.svg`, `og-default.png`, `og-craft.png`.

**The fixed rule (appears in three places):** `HouseDevice.jsx:8` — "The mark **NEVER** carries text — the name is always adjacent type." `logo.js:130` — "the mark never carries text — the name is adjacent type." `marketing/copy/brand-kit.md:56` — "**no text inside the mark, ever**."

**The naming:** `marketing/copy/brand-kit.md` §1 — "**SettlementForge.** One word... Never abbreviated in public copy; 'SF' lives only in internal registers." §2 slogans: **"A world that holds together"** (primary), **"State, never fate."** (ceremonial motto, caption under the seal only — never inside the mark), **"Simulated, not AI-generated."** (footer oath, also live in `src/copy/footer.js` as `antiAi`). §8 — "**The Station Seal** (approved, built, live)... Registers: the device alone (favicon/stamps) and the wordmark lockup (device + 'SettlementForge' in Lora)." OG image sets the wordmark in Georgia serif beside the device with the strapline "Living settlements for game masters."

**What plausibly needs clearance, per what the files actually contain:** the word mark **SettlementForge**; the design mark (the Station Seal device, standalone); the composite lockup (device + wordmark); the taglines "A world that holds together," "State, never fate.," "Simulated, not AI-generated."; and the domain/brand `settlementforge.com` (appears as the CLIENT_URL fallback in `founder-transfer/index.ts:31`).

**Questions for counsel:** (a) Is `SettlementForge` registrable in the relevant Nice classes (9/42), or descriptive? (b) Should the device be filed separately from the wordmark, and does the "no text in the mark" rule help or hurt? (c) Are the three taglines protectable or merely advertising? (d) What clearance search is needed against existing TTRPG-tool marks (World Anvil, Inkarnate, Wonderdraft, donjon — all named as competitors in the brand kit §3)? (e) Does the product's use of published TTRPG terminology anywhere create third-party IP exposure?

---

## 5. Founder-seat transfer — the largest legal surface

**Code surfaces:**

| Surface | Path |
|---|---|
| Case machine (state, audit log, hashed 2FA challenges, transition RPCs) | `.../minifold/supabase/migrations/160_founder_transfer_cases.sql` |
| Seat table + clawback release | `.../minifold/supabase/migrations/137_founder_seats.sql` |
| Payout release primitives (Connect claim, credits election, re-election) | `.../minifold/supabase/migrations/163_seat_payout_release.sql` |
| Stewardship: standing buyback + abandonment/escheat sweeps | `.../minifold/supabase/migrations/164_seat_stewardship.sql` |
| Due-runner cron | `.../minifold/supabase/migrations/162_founder_transfer_due_cron.sql` |
| Public lineage page | `.../minifold/supabase/migrations/170_founders_roll.sql` |
| Choreography edge function | `.../minifold/supabase/functions/founder-transfer/index.ts` |
| Refund/dispute interplay | `.../minifold/supabase/functions/stripe-webhook/index.ts:716-900`, `:1613-1680` |
| User-facing UI | `.../minifold/src/components/account/AccountSeatTransferPanel.jsx` |
| Live contract terms | `.../minifold/src/components/legal/TermsPage.jsx:101-129` |
| Design + drafted terms bundle | **LEDGER** `docs/DESIGN_MONEY_WAVE.md` §11–§13 (not present in minifold) |
| Product brief | `.../minifold/docs/briefs/FOUNDER_LANE_BRIEF.md` |

**The economics, as coded.** 30 seats, cap never grows, `$99` one-time. Transfer: incoming holder pays a fixed **$99**; **$49.50** to the outgoing holder, **$49.50** to the company. `payout_amount_cents = price_cents / 2` (mig 160:87, 164:15). 12-month hold before a seat is transferable; 72-hour cooling period; payout delay 14–30 days (default 14, system_config dial). Payout form elected at initiate: `connect_cash` (Stripe Connect Express) or `account_credits` ($49.50 as service credits). If Connect is absent at due time the payout parks at `held` and the holder can re-elect credits — UI: *"Take $49.50 as account credits instead"* (`AccountSeatTransferPanel.jsx:364`).

**The $49.50 residual acceptance in the webhook.** `stripe-webhook/index.ts:861` and `:886` — a transfer dispute arriving **after** payout release cannot be recovered; the seat is flagged and the company is "out $49.50 (accepted residual)". The 12-month hold is the chargeback defense on the original $99 (`mig 160:31-33`); the only surviving reversal race is the goodwill refund, serialized deliberately.

**The standing buyback and escheat.** Mig 164, owner ruling 2026-07-19: the buyback repurchase price **and** the abandonment claimable credit are one shared config dial, **default $25**, read at claim time. Abandonment: an account inactive and unreachable for **five years**, then unresponsive to notices over a further **90 days**, is deemed abandoned; the seat escheats to the company and $25 is held as a claimable credit. Escheat seats are never auto-resold.

**A live inconsistency to resolve before the consult:** LEDGER `docs/DESIGN_MONEY_WAVE.md` §12 says the abandonment credit is **$25**; §13 Q1 (line 958) says **$49.50**. Migration 164 implements **$25**. The $25/$49.50 figures do not appear on any user-facing surface — neither the buyback nor abandonment terms are published anywhere in `TermsPage.jsx`.

**LEGAL SIGN-OFF is already coded as a hard launch gate.** `DESIGN_MONEY_WAVE.md` §11 step 4: "LEGAL SIGN-OFF (HARD GATE for transfers): the §12 terms bundle + the Stripe Connect platform agreement + the refund/cancellation interplay reviewed. **Nothing in code can substitute for this step.**" The fallback posture (§11 4b/5b) permits launching transfers credits-only if Connect is not approved, but explicitly states "LEGAL SIGN-OFF (step 4) remains the hard gate regardless — no fallback for it." The master switch `system_config.founder_transfers` ships seeded `{enabled:false}`; nothing lights from a deploy alone.

**The §12 terms bundle drafted for counsel** (LEDGER `docs/DESIGN_MONEY_WAVE.md:911-955) encodes four ratified amendments: (a) death/incapacity handled case-by-case through an official estate process; (b) the incoming holder does **not** receive the one-time founder credit bonus; (c) SettlementForge is never a party to any private arrangement concerning a seat, and any payment or promise outside the official process is "unrecognized and unprotected"; (d) the fixed price is "a deliberate anti-speculation feature." Plus: "A seat is not an investment, a security, or a claim on any revenue or asset"; "'Lifetime' means the commercial lifetime of the SettlementForge service"; one concurrent session per account.

The Founder brief's binding style rule: **no investment framing anywhere** — never "appreciating," "resale value," "ownership," or "governance."

**Specific questions counsel must answer:**

1. **Money transmission.** By paying $49.50 from an incoming buyer's $99 to an outgoing holder via Stripe Connect Express, is SettlementForge a marketplace, a payment facilitator, or a money transmitter? Does the credits-only fallback (no cash ever leaves) avoid the question entirely, and should launch be credits-only for that reason?
2. **Payout classification** — already flagged as open in `TERMS_OF_USE_DRAFT.md:415`: refund, rebate, or marketplace payout? Tax consequence for the outgoing holder; 1099-K / information-reporting obligations at 30 seats × one transfer per 12 months; who issues.
3. **Securities.** Does a capped, transferable, fixed-price, half-the-proceeds-back instrument with a public lineage page implicate securities law under Howey or any state analog? Is the anti-speculation fixed price sufficient? Does the standing $25 buyback offer change the analysis?
4. **Consumer rights on lifetime seats.** What does "lifetime" bind if the service shuts down? Is "the commercial lifetime of the service" an enforceable limitation or an illusory promise? Refund exposure on sunset.
5. **Escheat / unclaimed property.** Does the 5-year + 90-day abandonment forfeiture survive state unclaimed-property statutes? Is a $25 service credit a lawful substitute for the property's value? Which state's law governs?
6. **Resale terms.** Is "transfers only through SettlementForge" enforceable against a first-sale/exhaustion argument, in the US and the EU (post-*UsedSoft*)? Is the 12-month hold and one-per-12-months limit lawful?
7. **Estate succession.** Amendment (a) says "case-by-case through an official estate process." What process satisfies probate; what documentation may be required?
8. **The orphan-seat sliver** (`DESIGN_MONEY_WAVE.md` §13 Q1): deleted-account seats park at escheat with `holder_user_id` NULL and no resale path — is the company free to reclaim and resell them?
9. **The $49.50 accepted residual:** is knowingly accepting an unrecoverable loss on a post-payout dispute a problem for Stripe's platform agreement?
10. **Publishing gap:** the buyback ($25), abandonment/escheat, and one-concurrent-session terms are all implemented in code but appear on **no user-facing page**. Which must be published before the mechanism activates?
11. **Stripe Connect platform agreement** — required review per §11 step 4, alongside the KYC burden Express onboarding places on each outgoing holder.

---

## 6. Jurisdiction and entity facts (verbatim, in-repo only)

**There is no legal entity name anywhere in the repo, and no governing-law clause.** Both facts are recorded as blockers in the drafts.

- `TERMS_OF_USE_DRAFT.md:411` — "**`[[Operating entity / legal name]]`** — **no legal entity name appears anywhere in the terms**; §12–§13 need it."
- `TERMS_OF_USE_DRAFT.md:358-360` (§13, Governing law and disputes, in full) — "`[[PLACEHOLDER — governing law, jurisdiction/venue, and any dispute-resolution or arbitration terms to be set at legal review, tied to the operating entity in §16.]]`"
- `PRIVACY_POLICY_DRAFT.md:211` — "**`[[Operating entity / legal name]]`** — required for the data-controller identity."
- `PRIVACY_POLICY_DRAFT.md:169-171` (§11) — "`[[Cross-border transfer and legal-basis clause (e.g. GDPR lawful bases, standard contractual clauses) to be supplied at legal review, tied to the operating entity and the data processors — Stripe, hosting/Supabase, and AI providers.]]`"

What the live pages actually say about themselves:
- `TermsPage.jsx:38` — "The agreement between you and **SettlementForge** when you use the service."
- `TermsPage.jsx:181-182` — "SettlementForge is an **independently run project** provided on a best-effort basis."
- `TermsPage.jsx:191-196` — "The service is provided as is, without warranties of any kind. To the extent permitted by law, SettlementForge is not liable for indirect or consequential losses arising from your use of the service. **Nothing here limits rights you have under mandatory consumer law in your jurisdiction.**"
- `src/copy/footer.js` — `copyright: '© {year} SettlementForge'`.

Contact, unresolved: `TERMS_OF_USE_DRAFT.md:365` — "`[[CONTACT EMAIL — currently settlementforge@gmail.com; support@settlementforge.com is proposed but unconfirmed pending owner sign-off before launch]]`." Source of truth `src/copy/support.js` (`SUPPORT_EMAIL` default `settlementforge@gmail.com`, overridable via `VITE_SUPPORT_EMAIL`). Domain: `settlementforge.com` appears as the CLIENT_URL fallback in `founder-transfer/index.ts:31`.

**Named third-party processors** (from `PRIVACY_POLICY_DRAFT.md:170` and the code): **Stripe** (payments + Connect), **Supabase** (hosting/DB/auth/edge), **Anthropic** (AI provider — `surveyor-byok/index.ts`, `ai-analyst`), **Resend** (transactional email — `RESEND_API_KEY`, currently inert).

**Questions for counsel:** entity formation and domicile before the terms can name a controller; governing law and venue; arbitration and class-waiver posture; whether the "independently run project / best-effort" framing survives a consumer-law challenge; whether the missing liability cap (`TERMS_OF_USE_DRAFT.md` §11–§12 are both `[[STANDARD-FORM PLACEHOLDER — counsel to supply/replace]]`) leaves the operator personally exposed pre-incorporation.

---

## Consolidated blocker list already written by the repo

`TERMS_OF_USE_DRAFT.md` §16 (nine items) and `PRIVACY_POLICY_DRAFT.md` §15 (six items) are the owner's own pre-drafted agenda. Both end with the same rule: the live page updates **only** after owner + counsel sign off through the consolidated pre-launch legal consult; the drafts are input, not replacement. `TOS_AUTOMATION_CLAUSES_DRAFT.md` §9 adds six more (TDM/AI-reservation jurisdiction, browsewrap vs clickwrap, consumer-protection fit, security-research safe harbor, "abusive volume" definition, BYOK/enrichment-rider conflict) and instructs: "Deliver to counsel alongside `TERMS_OF_USE_DRAFT.md`, `PRIVACY_POLICY_DRAFT.md`, and `docs/PERIMETER_RUNBOOK.md`."

One item on that list is a genuine repo defect worth resolving before the meeting: `TERMS_OF_USE_DRAFT.md:405-408` records that the Pricing page (`copy/en.js`) displays **$5.99/month** for Cartographer while `config/pricing.js` sets **$6/month (600 cents)** — "a real discrepancy in the repo, not a drafting choice."
