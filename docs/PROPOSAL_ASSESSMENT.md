# Proposal Assessment — multi-workstream update (war/trade/occupation/religion + admin/auth/support/account)

> Objective technical/product reconciliation of the proposed changes against the **current** codebase
> (post-commit `77bd27a`: the geopolitical war layer, religion subsystem, and UI/UX overhaul are already built,
> verified, 5359 tests green). Every "exists" claim below was verified against the source this session.
> **This is analysis, not implementation.**

---

## 0. Executive verdict

**This is two products, not one, and most of it is *refinement of things that already exist* — not greenfield.**

- **§2–10 (the simulation)** is almost entirely a *deepening* of the engine just committed. The substrate the proposal asks for — a shared contest primitive, disposition/pantheon ledgers, dormant-until-enabled gating, `war_drain`/`war_exhaustion`, occupation-via-power-transfer, the 3-axis deity, channel-visibility, the determinism harness — **already exists**. The proposal adds *resolution and state* on top of it. None of it is launch-blocking; it is post-beta deepening.
- **§11–15 (SaaS-ops)** is **substantially more built than the proposal assumes.** Password+magic-link+reset auth, a Stripe checkout/portal/webhook/credits stack, a transactional-email lifecycle, a `support_messages` table with RLS, an `admin-actions` edge function with reason-audited actions, a full analytics capture/rollup/cron/trends pipeline, and an account page with Profile/Billing/Support/FAQ/Privacy sections all exist. The genuine gaps are narrower than the prose implies.
- **The single biggest *conceptual* gap is the relationship/trade model** (§4–6), not the war model: an edge today carries **one exclusive `relationshipType`** while the 13 channels layer underneath it, and "trade" is the trade-*war* contest — there is no compatibility ruleset and no trade→reduced-hostility coupling.
- **The single highest *risk* item is the admin user-management surface** (§14) — and it has a **pre-existing architecture conflict**: the current RLS grants every developer/admin a flat "read all profiles / read all support messages," which directly contradicts the proposal's least-privilege / redacted-by-default / higher-role-for-full-access principle. That conflict must be reconciled *before* the surface grows.

**Recommendation in one line:** ship the tiny high-ROI SaaS gaps + a *safe* admin-access reconciliation for beta; stage the entire simulation deepening behind `warLayerEnabled`/dormancy as post-beta; design the relationship-compatibility model on paper before touching code.

---

## 1. Reconciliation vs the integration plan — drift

The committed code **matches** `docs/SUBSYSTEM_INTEGRATION_PLAN.md` and `GEOPOLITICAL_WAR_LAYER.md`: one `contestOverThirdParty` primitive (war/trade/religion are thin callers), one disposition ledger shape (instantiated for `dispositionStats` + `pantheon`), dormant-until-enabled gates, deep-cloned conditional ledgers, read-last/write-next timing, byte-identical-when-off (golden master + dormancy oracle + order-independence). **Known, documented residual drift** (from the build, all non-blocking): the gallery realm-arc summary is wired client-side only (server-side `get_gallery_dossier` column projection deferred); the `faction_stability` affectedSystem is a shared bogus tag across ~6 stressors (left, flagged); custom factions are relabeled add-via-event rather than generation-wired. None conflict with this proposal.

---

## 2. Per-area: exists / missing / conflicts

### Simulation half (§1–10)

| § | Proposal | Exists today | Maturity | Net-new vs refinement |
|---|---|---|---|---|
| 2 | military strength derived from context; 7-way strength split (theoretical/mobilized/deployed-start/current/returning/home/garrison); **hard feasibility gates** | `settlementStrength()` — ONE 0–1 number from tier/pop/conflict/trade/legitimacy/economy (NOT institutions/supply-chains/weapons). Siege = `logistic(coalition−defender)` + `CONQUEST_MARGIN` + `HOSTILE_CONFIDENCE` deploy gate | partial | **Refinement** (decompose the one number; inputs exist as data). **Hard gates = net-new** (today RNG *can* resolve absurd mismatches at low odds) |
| 3 | war-economy + mobilization posture (peace→…→demobilizing); ramp-up; visible to neighbors; can fail/cool | none (settlement-level); `mobilize` is only an NPC action + a faction momentum band | absent | **Net-new** (per-tick state machine — determinism-gate it) |
| 4–6 | strategic/specific trade; trade→reduced hostility; relationship **compatibility**/layered channels; trade-as-diplomacy | per-commodity trade-*war* contest (`tradeWar.js`); 13 layered channels minted from ONE `relationshipType`; **no** trade→hostility coupling; no compatibility ruleset | partial | **The big gap.** Channels are layered but the single label is exclusive; trade-as-peace = net-new |
| 7 | coalition strength with coordination/trust/fracture, not naive sum | `coalitionStrength` sums member strengths (order-independent) | partial | **Refinement** (add coordination/fracture penalties to the existing path) |
| 8 | occupation states; capped/delayed occupier **benefit** loop + burden | `installOccupationAuthority` (power-transfer) + `vassal_extraction` condition + military disarm (Z1). No states, no benefit loop | partial | **Net-new** occupation states + benefit (highest balance risk — snowball) |
| 9 | stateful armies; per-engagement attrition; reinforcement draining origin; **strength-scaled return** | `worldState.deployments[id]` = light record (target/sinceTick/role); strength recomputed each tick (full-strength token); return is **binary** (occupied→liberation / sieged→relief / vassal→coup) | partial | **Net-new** (per-army effective-strength ledger; scaled return) |
| 10 | **4-axis** deity (adds lawful/chaotic); civic-influence object incl. law/order pressure | 3 axes (alignment/temperament/rank); `049` CHECK pins them; deityEffects single-source; **no `law_order` causal var** | partial | **Net-new** 4th axis + it has nothing to couple to yet |

### SaaS-ops half (§11–15)

| § | Proposal | Exists today | Gap |
|---|---|---|---|
| 11 | sim-tuning dashboards (war/siege/attrition/occupation/trade/deity, RNG trace, soaks, balance warnings, drift) | full analytics pipeline: `analyticsEvents.js`, migrations `036/038/039/040` (core/rollups/cron/trends), `AdminAnalyticsPanel`/`AdminTrendsPanel` | **Additive** sim-specific dashboards on a solid base; sim already emits chronicle/`rollExplanations`/`pulseHistory`/`*_TUNING`/convergence tests to feed them |
| 12 | password-first + magic-link + Google + Discord; sign-out button; "Google" not "Gmail" | `auth.js`: `signUp`/`signInWithPassword`/`resetPasswordForEmail`/`signInWithOtp` — password **already** primary | **OAuth (Google/Discord) missing; sign-out button missing from `AccountMenu`; copy nit.** Small |
| 13 | full ticket system (numbers/statuses/pool/assignment/notes/replies/audit/email/FAQ-link) | `support_messages` table (002) + RLS (users own / devs read-all+update-status) + `AccountSupportSection`/`AccountFAQ`; email lifecycle (`emailLifecycle.js` + `send-email` fn) | **Extend** the existing table+RLS into a ticket workflow; reuse email. Not greenfield |
| 14 | admin user-mgmt (search/inspect/actions) + RBAC + least-privilege + redaction + **audit log** | role model (`ELEVATED_ROLES`), `admin-actions` edge fn (reason-audited actions), `003` admin RLS | **CONFLICT**: `003` grants devs flat read-all-profiles/support (not least-privilege). No queryable audit-log table. The action set + redaction tiers are the gap |
| 15 | complete account page (Profile/Login&Security/Billing/Data&Privacy/Prefs/Support) | `AccountPage` mounts Profile, Subscription (Stripe `create-customer-portal`), FAQ, Support, `PrivacySettings` | **No Login & Security section** (change-pw UI, OAuth links, sessions, MFA-ready). Data/Prefs partial. Fill-gaps |

### §16 Surfacing — exists, must be extended
Channel `visibility` (public/gm/hidden) + the gallery sanitizer + the screen↔PDF parity discipline already exist. Every new surface (mobilization, trade-status, occupation, secret war-prep) must run through that same pattern. Heuristic-language DM views are the established convention (the UX overhaul did this for the causal model). Net-new = applying the existing pattern to new fields, not new infrastructure.

---

## 3. Determinism call-outs (could destabilize the deterministic world pulse)

1. **Mobilization posture (§3) and trade→hostility coupling (§4–6) run every tick and feed candidate generation** → MUST sit behind `warLayerEnabled`/dormancy or they break byte-identity for every legacy campaign. **#1 trap.**
2. **Occupation-benefit (§8) and reinforcement (§9) are cross-settlement feedback loops** → require read-last/write-next + deep-cloned ledgers + a containment cap (the pantheon pattern). Otherwise intra-tick read-after-write or unbounded snowball.
3. **Per-army attrition state (§9)** is a new nested ledger → deep-clone discipline + dormancy byte-neutrality (absent-when-off).
4. **The 4th deity axis (§10)** → the embedded-snapshot + `049`-style CHECK migration + deityEffects-single-source + dormancy byte-identity discipline (as R1 did).
5. **Hard feasibility gates (§2)** must be a *deterministic classifier in front of the contest* (not an RNG step) so "RNG only resolves plausible conflicts" is itself reproducible.

## 4. Data-safety / privacy call-outs (could leak private/player-hidden data)

1. **§14 admin tooling is the headline risk** — PII, billing identifiers, "full debug copies." Plus the **existing** flat developer-read-all RLS must be tightened to least-privilege/redacted-by-default *before* the surface grows. Append-only audit log, reason-required for full access, soft-delete-first.
2. **§13 tickets** carry user data + optional links to settlements/payments → keep the owner-scoped RLS; the agent-pool needs a *scoped* grant, not blanket read; separate internal-notes from user-visible replies at the row/column level.
3. **§16 / new sim surfaces** — mobilization, covert trade, secret war-prep, hidden religious authority must inherit channel visibility so they never reach player-facing map overlays / PDFs / shared dossiers.

## 5. Schema / Supabase-Auth / Stripe / email / migration impact

- **Migrations (new):** war-posture + occupation-state + per-army-attrition active-condition archetypes (additive, byte-neutral); the deity 4th-axis CHECK (a `049`-style migration); a **support tickets** extension of `support_messages` (numbers/status/priority/assignment/notes/replies); an **audit-log** table; an admin-RLS *tightening* migration.
- **Supabase Auth:** enable Google + Discord providers + OAuth callback + account-linking; everything else (password/magic/reset/session) exists.
- **Stripe:** no new billing work — checkout/portal/webhook/credits exist; the account Billing section just links the existing `create-customer-portal`.
- **Email:** reuse `emailLifecycle.js`/`send-email`; add ticket-lifecycle + admin-action templates.
- **Tests:** determinism/dormancy/byte-identity for every new sim ledger (the harness exists); RLS/least-privilege pglite tests for tickets + admin actions + the audit log (the `customContentDeities.pglite` pattern); visibility-audit tests for new surfaces.

## 6. Recommended implementation order (reconciling the proposed Stage 1–8)

**Track A — SaaS-ops (independent of the sim; mostly finishing):**
- **Beta must-have:** sign-out button + Gmail→Google copy (trivial); account **Login & Security** section; a **safe admin-access reconciliation** (tighten `003` to least-privilege + add the audit-log table + redacted-by-default) — this is a *fix*, not a feature, and it gates everything else in §14.
- **Strongly consider for beta:** Google/Discord OAuth (signup conversion).
- **Post-beta:** the support *ticket workflow* (extend `support_messages`); the broader admin action set; the sim-tuning analytics dashboards.

**Track B — Simulation (all post-beta, all behind `warLayerEnabled`/dormancy):**
1. **Military-strength decomposition + hard feasibility gates** — highest value, lowest risk, inputs already exist.
2. **Mobilization posture** (war-economy ramp; determinism-gated).
3. **Stateful armies + attrition + strength-scaled return** (new deep-cloned ledger).
4. **Occupation states + capped/delayed benefit loop** (most balance-sensitive; soak-test the snowball).
5. **Relationship-compatibility + trade-as-diplomacy** (most architecturally careful; design first).
6. **The 4th deity axis** (after deciding its coupling target).

The proposal's own Stage 1–8 is reasonable; my adjustments: Stage-7 SaaS runs in **parallel** (it's not downstream of the sim), the admin-access **fix** is pulled forward (security), and §2's "relationship compatibility / military strength model" belong in their respective sim stages, not all in Stage 1.

## 7. UX-complexity guardrails

The internals deepen; the DM surface must not. Reuse the just-built **altitude axis** (Overview/Detail/Engine) and the heuristic-language convention: a DM sees "mobilizing — war economy, ~3 ticks to deploy," "siege implausible: defender far stronger, needs a coalition," "army war-weary (40% strength)," "occupation: extractive, resistance rising" — never `dispositionStats`, `war_drain` gearing, contest internals, or RNG forks (the proposal §16 is right and the pattern already exists). Every new field self-gates to nothing when dormant.

## 8. Open decisions for the user

1. **Launch scope:** beta-soon (then Track A only — sign-out + account-security + admin-access-fix + OAuth, defer *all* of Track B) vs deeper release (stage Track B too)?
2. **OAuth at beta** — in or out?
3. **Admin access model** — reconcile the existing flat developer-read-all RLS to least-privilege now (recommended, it's a latent privacy issue) vs defer?
4. **Relationship model** — primary-label + secondary-trade-channel overlay (recommended; lower blast radius) vs full multi-label compatibility matrix (richer, more invasive)?
5. **4th deity axis** — couple lawful/chaotic to existing vars (legitimacy/corruption/social_trust; cheaper) vs add a new law/order civic dimension (cleaner, bigger)?
6. **Support** — extend `support_messages` into the ticket workflow now, or keep the simple message + FAQ for beta and build tickets post-beta?

---

*No code was changed in producing this assessment.*
