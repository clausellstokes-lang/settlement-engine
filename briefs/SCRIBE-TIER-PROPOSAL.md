# THE SCRIBE TIER — A PROPOSAL FOR THE OWNER'S SIGNATURE

*Chair Fable 5.1, 2026-09-14 ~23:3x. Drafted from a read-only recon of the entitlement and billing code at the Scribe dock (`lane-scribe` `9a8ff7280`, sealed `refs/preserve/scribe-w4-2026-09-14`) and of the design ledger, the rulings and the owner's directives; the recon and the draft are in the kit (`briefs/SCRIBE-TIER-PROPOSAL.recon.json`, `.draft.md`). This is design §12 item 16, which §11c pointed at and which had never been written. Nothing in it is decided; every default is the owner's to strike.*

**Three things the chair adds before the document.**

1. **The per-tab charge is a defect found by this recon and it is being fixed dark now (Scribe wave W5b, dispatched the same hour).** One render is one edge invocation per firing tab, and each invocation runs its own `spend_credits('dossierProse')`; migration 202's header and the Redraw button both say five credits a render, and no test pins the whole-render total. Until W5b lands, no live render may be billed. It stays decision 2 below because the owner should see it.

2. **The daily render cap.** The drafting seat says no daily cap ever existed. That is true of the design, the rulings and the code; it is not true of the record. The OWNER proposed it in chat at ~08:5x on 2026-09-14 ("they can only generate and/or regenerate a settlement once per day. Because of the new increased costs.") as a question, never signed and never built. Decision 6 below is where it is decided, with the chair's default of five a day rather than one.

3. **The cost figures are arithmetic, not receipts.** They rest on measured prompt sizes and the model table's list prices, and on an unmeasured tab count and unmeasured thinking tokens. The live pilot (wave 5a) is the only source of the real number, and the proposal's order puts it before the price is signed.

---

For the owner's signature. Written by the chair, 2026-09-14, on the owner's word of ~13:2x: "Because I'm thinking that this could actually be a new paid subscription tier in and of itself." Nothing here is decided. Everything here is a default the owner can strike.

## 1. What the Scribe is, as a product

The Scribe is an AI writer that writes a settlement's dossier in prose, using only what the settlement actually is. It writes once per epoch, when a game master opens that settlement's dossier, and the writing then freezes until the next time the world advances, so a realm of thirty towns only ever writes the towns somebody looks at. Every line it writes is checked by the same instruments that audit the hand-written corpus, and any line that contradicts the settlement is thrown away and replaced by the corpus line, which means the product never gets worse than it is today. Measured without a live key over five simulated runs, 84 to 89 percent of the writing survives that check and about half of one percent of surviving lines still contradict something (SCRIBE-SIM-2026-09-14, RUN 5). It is built and dark: no render has ever run against a real model, no bill has ever been charged, and the flag that turns it on has never been lit.

## 2. What exists today for gating and billing

**There is no tier gate on the Scribe.** The render function's whole admission chain is bot guard, sign-in, session check, per-address rate limit, then `account_is_active`, then credits (`supabase/functions/scribe-render/index.ts:171-192`). `account_is_active` answers "is this person banned or deleted", not "has this person paid" (`supabase/migrations/057_enforce_account_status_writes.sql:40-60`). Eight other paid AI surfaces check a paid entitlement; the Scribe checks none.

**The database knows only two tiers.** `profiles.tier` is constrained to `free` or `premium` (`001_initial_schema.sql:7`). Migration 139 deliberately refused to widen that constraint and invented a separate entitlement table instead (`139_surveyor_entitlement_and_byok.sql:6-16`). The Surveyor plan follows that pattern: $14.99 a month, sold as a subscription, granting an entitlement and zero credits, kept outside the visible tier ladder on purpose (`src/config/pricing.js:337-361`).

**The price the code charges is not the price the code claims.** Migration 202 and the redraw button both say a render costs five credits (`202_scribe_claim.sql:28-30`; `ScribeRedrawButton.jsx:59`). But the client sends one separate paid call per dossier tab (`src/store/scribeTransport.js:56-64`), and each call runs its own credit spend (`scribe-render/index.ts:300-309`). The built code fires roughly seven to ten tabs on a real town, so one render actually charges thirty-five to fifty credits, which is $4.55 to $10.00 of retail credit. **This is a defect, not a design, and it is the first thing that has to be settled.** The same defect makes the advertised "free first render" a free first *tab*: the claim is once per account (`202_scribe_claim.sql:43-61`), so a new user's first render still charges for the other tabs.

**There is no daily render cap anywhere.** Not in the design, not in the rulings, not in the code. A sentence in one chair memory called a daily cap "temporary economics"; that cap was never built and appears to have been misread out of the free tier's three-save limit. I am correcting that on the record here.

**What does exist and is proven:** a monthly subscription that mints an expiring credit allowance through the Stripe webhook, wired only to the Cartographer price (`stripe-webhook/index.ts:350-412`); a credit ledger that always spends the monthly allowance before purchased packs (`202_scribe_claim.sql:266-267`); a per-account usage governor with daily and weekly caps that eight surfaces call and the Scribe does not (`144_surveyor_usage_governors.sql`); and a redraw button with no limit on how many times one epoch may be redrawn.

## 3. The options

**Prices assumed throughout:** Claude Opus 5 at $5.00 per million input tokens and $25.00 per million output tokens, cache reads at $0.50 per million, cache writes at the one-hour rate of $10.00 per million, batch processing at half price. These are the rates the design itself cites (claude-api model table, cached 2026-06-24).

**Cost of one render, measured prompt, ten tab calls, town-sized settlement.** The shared instruction brief is 96,795 characters (about 24.2 thousand tokens) and is read on every call; the town's own block adds about 4 thousand; the per-tab volatile material totals about 24 thousand across the render; visible output is about 6 thousand. Writer, first settlement of the hour: about $0.92. Writer, warm hour: about $0.45. The second checking call on each tab adds $0.28 to $0.40. **One render therefore costs about $0.73 warm to $1.32 cold.** Thinking tokens are pinned at high effort, bill at the output rate, and have never been measured; a two to five times multiple on visible output would add $0.15 to $0.60. Every figure here is arithmetic over measured character counts, not a receipt. The design's own cost paragraph ("cents per settlement, not dollars") was written before the prompt that now ships and is wrong by roughly an order of magnitude.

For reference, five credits retails at $1.00, $0.85 or $0.65 depending on which pack the user bought (`pricing.js:48-52`).

### Option A. A standalone monthly subscription

**How a user gets it:** a new Stripe subscription product, added to `SUBSCRIPTION_PRODUCTS` and `PRICE_MAP` in `create-checkout`.

**How the product knows:** a new `scribe_entitlements` table and a `has_scribe_entitlement()` check, copied from migrations 139 and 159. `scribe-render` calls it right after `account_is_active` and refuses politely if absent, in the house style already used by the analyst. The client reads the bit lazily through the same RPC pattern as `useSurveyorEntitled.js`, never from the tier field.

**Cost to the owner:** $0.73 to $1.32 a render, so a subscriber who renders twenty times a month costs $15 to $26 before Stripe's cut.

**What it charges:** chair default $19.99 a month, unlimited renders under a fair-use daily cap of five, with a bring-your-own-key arm at $9.99 that costs the owner nothing per render.

**Cap and free render:** the daily cap becomes real machinery for the first time. The free first render becomes one complete free render per account, used as the shop window.

**Code:** new migration (table, grant and revoke functions, the entitlement check), the gate in `scribe-render`, a render-scoped charge so one render is one event, a new daily counter (nothing existing counts renders), a webhook branch for start and cancel, and the client's lazy read.

**Risks:** unlimited is uncapped cost at a fixed price, and the daily cap is the only brake. A heavy user with three campaigns can lose money every month. The redraw button is uncapped and is exactly the button a frustrated game master presses.

### Option B. An add-on billed per render through the existing credit machine

**How a user gets it:** they do not buy anything new; they spend credits, as today's design intends.

**How the product knows:** no entitlement at all, or at most a check that the account is a paying Cartographer. This is what the code does now.

**Cost to the owner:** the same $0.73 to $1.32.

**What it charges:** five credits a render, which is $0.65 to $1.00. **That is at or below cost.** To clear cost with any margin the SKU has to move to roughly ten credits, which is $1.30 to $2.00. Note that the Scribe has no runtime price lever at all: `get_ai_pricing()` does not list it, so every price change is a migration plus a client deploy (`174_pricing_optimal_margins.sql`; `pricing.js:104-108`).

**Cap and free render:** the credit balance is the only cap; there is no daily cap. The free first render stays as ruling 2 built it, once it is corrected to be a render rather than a tab.

**Code:** the least of the three. Fix the charge so it is once per render, reprice the SKU by migration, mirror it in the client. No webhook change, no new table.

**Risks:** no recurring revenue, and it retires two existing SKUs (narrative at five credits, daily life at four) without replacing their income. The price is not legible: the user cannot be told what a render will cost until the tab count is known. It also answers the owner's question with "no tier", which is not what was asked.

### Option C. A subscription with a render allowance, overage in credits

**How a user gets it:** as Option A, a new subscription product.

**How the product knows:** as Option A, an entitlement check at `scribe-render` and a lazy client read. The difference is what happens after the check: the function reads a monthly render counter, and if the allowance is spent it falls through to the existing credit spend, which already works.

**Cost to the owner:** bounded by the allowance. Twenty renders is $15 to $26 of cost; anything past that is paid for at the overage price.

**What it charges:** chair default $19.99 a month including twenty renders that do not roll over, then ten credits a render beyond that, with a bring-your-own-key arm at $9.99 for unlimited renders on the subscriber's own key.

**Cap and free render:** a fair-use daily cap of five renders, tunable by the operator without a deploy. One complete free render per account, kept.

**Code:** all of Option A, plus a render counter reset each billing period, plus the fall-through to the credit spend. The allowance could instead be minted as credits through the proven webhook path, but credits are fungible and would leak into other AI features, so a counted allowance is the better shape.

**Risks:** the most machinery of the three, and two meters to explain to a user. The counter is new and untested. The webhook must grant and revoke correctly or a cancelled subscriber keeps rendering.

## 4. The chair's recommendation

**Option C, at $19.99 a month with twenty renders included, a five-a-day fair-use cap, credit overage, and a $9.99 bring-your-own-key arm.** The reasons, in order of weight.

The per-render SKU alone is insolvent at the price the record already set. Five credits is worth less than one render costs at every pack rate but the smallest, and the promise in ruling 1 that the pilot would reprice it has never been kept because the pilot has never run. A subscription is the only shape that survives that arithmetic without making the user do mental math before every click.

A subscription also matches what the feature actually is. The billable act is opening a town after an advance, which is bursty: a game master prepares a session and opens six towns in an hour, then opens nothing for three weeks. Metering that by the click punishes exactly the behaviour the product wants.

Unlimited, Option A's shape, is the wrong first bet while the true cost of a render has never been observed once. An allowance with overage gives the same feel to almost every user while keeping the worst month bounded.

The owner's standing law is to name the highest-ceiling route first. That route is this one with the quality dials untouched: Opus 5, high effort, both checking passes, no trimming of the tab set to save money. If the pilot's receipts say the render costs more than this estimate, the honest response is to raise the price, not to quietly cheapen the writing.

**What it would take, in order.**

*Owner acts first, and nothing moves without them:* an Anthropic API key; applying migrations 201 and 202; the price and shape signed from the list in section 5; a decision on how long past epochs are kept; and last of all, lighting the flag.

*Wave 5a, the pilot.* Light the Scribe for the owner's account alone and render real settlements end to end. This produces the four numbers no simulation can produce: tokens by the model's own count, how much of the prompt is actually served from cache, dollars, and how long a render takes. It also settles whether the second checking call rides the cache or pays full price, which is worth roughly a doubling of the bill.

*Wave 5b, the correctness fix, before any money moves.* Make one render one charge, keyed to the settlement and the epoch, so the free render is a real free render and the price on the button is the price on the bill. Cap the redraw. Close the race in the free-claim release.

*Wave 5c, the blind read.* The design's own ship gate requires the owner to read forty units of Scribe prose against forty of corpus prose, shuffled and unlabelled, and prefer the Scribe or tie. That has never happened. It should happen before the price is set, because it is the only test of whether the tier is worth buying.

*Wave 5d, the tier.* Entitlement table, gate, counter, webhook, client read, checkout SKU, refusal copy.

*Wave 5e, the flag.* Last.

## 5. Decisions only the owner can make

Each carries the chair's default. Strike, change, or initial.

1. **Does the Scribe become a paid tier at all?** Default: yes, build it; it is additive and does not touch what free and paid subscribers get today. ______
2. **One render, one charge.** Default: yes, corrected before any money moves. ______
3. **Tier shape.** Default: its own entitlement table, outside the visible tier ladder, following Surveyor's precedent, not shared with Surveyor. ______
4. **Price.** Default: $19.99 a month, set after the pilot's receipts, not before. ______
5. **Included renders.** Default: twenty a month, no rollover. ______
6. **Daily fair-use cap.** Default: five renders a day, operator-tunable. ______
7. **Overage.** Default: ten credits a render past the allowance. ______
8. **Free sample.** Default: one complete free render per account, once. ______
9. **Bring-your-own-key arm.** Default: $9.99 a month, unlimited under the same daily cap, no house credits. ______
10. **Gallery visibility.** Default: a subscriber's Scribe prose is visible to gallery viewers and marked as machine-written, because a tier with no shop window cannot be sold. ______
11. **Past epochs kept.** Default: compact rotation, not every epoch forever, to keep save files from growing without bound. ______
12. **When it ships.** Default: it ships whether or not the hand-written corpus is finished; the corpus stays every subscriber's prose either way. ______
13. **Quality gate.** Default: the owner sits the forty-unit blind read before the price is signed. ______
14. **The two retiring SKUs.** Default: narrative and daily life retire at the flag flip, by a new migration, never by editing a shipped one. ______
15. **Model and effort.** Default: Opus 5 at high effort, unchanged, until the pilot prices the thinking tokens. ______

## 6. What is assumed and unmeasured

Every dollar in this document is arithmetic over measured character counts and published list prices. No API call has ever been made. The pilot, and only the pilot, can produce: the model's own token counts, the real cache hit rate, real dollars, and wall-clock time per render. Also unmeasured: what thinking at high effort actually costs; whether the second checking call rides the cache or pays full price; whether a real month of play is six renders or sixty, which is the number every allowance in section 5 rests on; whether the owner prefers the Scribe's prose to the corpus, never tested; and whether the daily-life tab's slightly different brief is writing a second expensive cache entry every hour for no reason. The quality figures (84 to 89 percent surviving, about half a percent of lines still contradicting) come from five simulated runs with a Claude seat standing in for the model, not from the live product.

---
