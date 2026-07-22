# AI Credit Pricing: Margin Sheet (optimal margins at Opus-default economics)

Owner decision surface for the 2026-07-21 reprice. The owner's deploy of the
migration plus the edge function IS the sign-off act (see Deploy order). Nothing
here is live until that deploy: the migration sits in the 180 band and is not
applied, the edge function is deploy-gated, and the client ships at the next
release with a graceful fallback to the shipped constants.

## 1. Summary of the change

Under the margin policy (standard schedule priced at least 2.5x expected
post-engineering cost-of-goods AND at least 1.2x worst-case, at the blended
0.157 USD per credit), the only AI action below the floor was the standard
narrative. It moves from 3 to 5 credits. To preserve the product's
`progression > narrative` cost-weighting (a pinned invariant), progression moves
from 5 to 6. Everything else already clears its floor and is unchanged.

| Action (standard, Opus-default) | Before | After | Reason |
|---|---:|---:|---|
| Narrative | 3 | **5** | Below the 2.5x floor at Opus economics; the margin hole this reprice closes |
| Daily Life | 4 | 4 | Already ~9x; unchanged |
| Progression | 5 | **6** | Raised one step to keep progression the premium action (coupled to the narrative bump) |
| Chronicle | 2 | 2 | Haiku, tiny cost; ~78x; unchanged |

| Action (fast / routing subsidy, Haiku) | Before | After |
|---|---:|---:|
| Narrative (fast) | 2 | 2 |
| Daily Life (fast) | 3 | 3 |
| Progression (fast) | 4 | 4 |

The fast schedule is preserved as the routing subsidy: a steep discount (fast
narrative 2 vs standard 5) that nudges cost-conscious users onto the ~5x cheaper
Haiku path, and every fast cell still clears a 60% margin (see section 4).

Packs (25 / 60 / 150 credits), subscription tiers, and the 2.99 USD single
dossier are UNCHANGED; they are Stripe surfaces and positioning anchors, not
margin-broken.

## 2. How the costs were measured

Provider prices are the `ai_price_book` seed, which matches current published
rates (USD per million tokens, input / output): Opus 4.8 5 / 25, Sonnet 4.6
3 / 15, Haiku 4.5 1 / 5, GPT-5.2 2 / 8, GPT-5-mini and GPT-4.1-mini 0.4 / 1.6,
GPT-5-nano and GPT-4.1 2 / 8.

Call structure (verified in generate-narrative/index.ts and prompts.ts):

- **Narrative** run = 20 model calls: 1 thesis (max 600 out) + 14 refinement
  passes (max_tokens summing to 18,700 out) + 5 daily-life beats (600 out each)
  folded into the same spend. The stable prefix (role + thesis + settlement
  summary) is re-sent on every call.
- **Daily Life** run (standalone) = 5 beats (600 out each).
- **Progression** run = 1 thesis + up to 5 refinement passes (the largest
  `PROGRESSION_AFFECTED_FIELDS` set) = up to 6 calls.
- **Chronicle** = 1 Haiku call, max 700 out.

Token assumptions (labeled ESTIMATES; the exact figures come from real
`ai_usage_events` telemetry, which is exactly what the nightly calibrator now
reads, see section 5):

- **Realistic output**: most of the 14 refinement passes emit short structured
  JSON, not maxed prose, so realistic total narrative output is ~7,000 tokens
  (far below the 22,300-token sum of the max_tokens caps).
- **Realistic input, post-engineering**: the per-field prose caps in
  `summarizeSettlement` bound the re-sent summary, and prompt caching (now
  activated, see section 3) turns ~19 of the 20 calls' stable prefix into
  0.1x cached reads. Effective narrative input drops to ~24,000 token-equivalents
  from ~55,000 uncached.
- **Worst case** uses the reservation budget the code already reserves per run
  (narrative 72,000 in / 28,000 out) as a deliberately conservative ceiling.

## 3. The cost engineering (what makes the same price optimal)

Two changes cut the cost of goods so the standard price sits comfortably at
2.5x, done in prompts.ts:

1. **Per-field prose caps** (`capStr` in `summarizeSettlement`): individual
   user-editable strings (faction descriptions, NPC secrets, arrival scene, and
   so on) are ellipsis-truncated to generous ceilings (160 to 900 chars). The
   array count caps already existed; the string caps close the hole where one
   oversized field inflated INPUT on every one of the run's 20 calls. Quality is
   unaffected: the ceilings sit well above any normal authored field.

2. **Cache activation** (`cachePadding`): Anthropic caches a prefix only when it
   meets the model minimum, which is 4,096 tokens on both Opus 4.8 (the default)
   and Haiku 4.5 (the fast tier), 2,048 on Sonnet. A typical few-KB summary plus
   thesis prefix falls BELOW 4,096, so the existing `cache_control` block was
   silently a no-op on the default and fast paths. A deterministic,
   content-neutral, clearly-labeled filler block pads the stable prefix past the
   floor. The filler is byte-identical across a run's calls (thesis and summary
   are fixed within a run), so it produces a real cache prefix match.

   Cache arithmetic (per narrative run, refinement plus daily-life prefix):
   without caching, 19 calls re-send a ~2,200-token prefix at full input =
   ~41,800 token-equivalents. With padding to ~4,400 tokens and caching, the
   refinement prefix costs one 1.25x write (5,500) plus 13 reads at 0.1x (5,720),
   and the daily-life prefix one write (5,500) plus 4 reads (1,760): ~18,480
   total. That is a ~23,000 token-equivalent saving per run, roughly 0.12 USD of
   Opus input. The padding's own filler tokens are cheap precisely because reads
   are 0.1x; the one-time 1.25x write is dwarfed by the ~18 cached reads.

Both are pinned by deterministic unit tests in prompts.test.ts (no live AI
calls). QUALITY NOTE: the padding adds a labeled filler block to every
refinement and daily-life prompt. Opus 4.8 ignores clearly-labeled filler, but
the output-quality effect cannot be measured in a unit test (no live provider
calls); this is flagged for a live spot-check before or shortly after deploy.

## 4. The chosen schedule with margins

Revenue per credit is the blended 0.157 USD (the `creditValueUsd` knob).

Standard path (Opus 4.8, the default), post-engineering:

| Action | Credits | Revenue (USD) | Realistic COGS (USD) | Margin (rev / COGS) | Worst-case COGS (USD) | vs worst |
|---|---:|---:|---:|---:|---:|---:|
| Narrative | 5 | 0.785 | ~0.31 | **~2.5x** | ~0.71 realistic-max (1.06 reservation) | ~1.1x |
| Daily Life | 4 | 0.628 | ~0.07 | ~9x | ~0.20 | ~3x |
| Progression | 6 | 0.942 | ~0.14 | ~6.7x | ~0.35 | ~2.7x |
| Chronicle | 2 | 0.314 | ~0.004 | ~78x | ~0.01 | ~30x |

Fast path (Haiku 4.5, ~5x cheaper per token), post-engineering:

| Action | Credits | Revenue (USD) | Realistic COGS (USD) | Margin % |
|---|---:|---:|---:|---:|
| Narrative (fast) | 2 | 0.314 | ~0.06 | ~81% |
| Daily Life (fast) | 3 | 0.471 | ~0.014 | ~97% |
| Progression (fast) | 4 | 0.628 | ~0.028 | ~96% |

Other standard-tier models are cheaper than Opus per token (Sonnet ~0.6x,
GPT-5.2 ~0.4x on input), so they clear the floor by a wider margin than the Opus
figures above; the Opus column is the binding case because Opus is the default.

SENSITIVITY on the narrative decision (the one judgment call): narrative = 5
meets the 2.5x floor on the careful realistic cost (~0.31 USD, output-dominated,
~2.57x) and clears 1.2x on a p95 worst-case; it falls short of 1.2x only against
the pathological absolute-max output (every one of 20 calls maxing its
max_tokens, which never occurs). The token figures are ESTIMATES pending
telemetry. If the owner judges realistic cost to sit at the high end, the
conservative alternative is narrative = 6; to keep progression the premium
action that would lift progression to 7, or the owner may instead accept
narrative > progression (breaking the `progression > narrative` invariant, which
is arguably the more cost-honest ordering since narrative is the highest-cost
action). This is left for the owner at deploy; the calibrator (below) will also
surface a recommendation from real cost data.

## 5. The policy knobs

Seeded in `ai_pricing_knobs`, updated by migration 180:

| Knob | Before | After | Meaning |
|---|---:|---:|---|
| targetMultiplier | 1.2 | **2.5** | The margin policy the nightly calibrator maintains against real `ai_usage_events` cost data |
| creditValueUsd | 0.157 | 0.157 | Blended revenue per credit (unchanged) |
| maxStepPerResync | 1 | 1 | Calibrator clamp, at most 1 credit per night (unchanged) |
| floorCredits / capCredits | 1 / 12 | 1 / 12 | Per-feature bounds (unchanged) |
| applyCreditCosts (kill switch) | OFF | OFF | The calibrator RECOMMENDS only; live auto-apply is the owner's call |

The kill switch stays OFF, so this seed is authoritative until the owner acts on
a calibrator recommendation. The targetMultiplier bump means the calibrator now
maintains the 2.5x policy rather than the old 1.2x, so the seed does not erode as
provider prices move.

## 6. Deploy order (client first, then server together)

Everything commits inert. The deploy sequence:

1. **CLIENT first.** The client ships the new constants (the displayed AI costs
   are now correct: 5 / 4 / 6). NOTE: the display strings ship as correct STATIC
   literals, not live-config-driven — the reusable live-read leaf
   (`src/config/livePricing.js`, get_ai_pricing plus graceful fallback) is built
   but UNWIRED because wiring it, or config-driving any display, rebalances the
   eager first-paint closure past its owner-gated byte ceiling (see section 7).
   So a shipped client shows the correct static numbers; it does not yet
   auto-follow a future server-side reprice.
2. **Migration + edge function TOGETHER.** The migration updates the live
   `ai_credit_costs` config (the config-first charge path) and the fallback
   bodies; the edge function precheck is repriced to match. The server precheck
   plus the `spend_credits` RPC stay authoritative and fail-safe: a stale client
   can never over- or under-charge, because the database decides the price.

The migration in the 180 band is NOT applied (the applied-migrations head is
untouched at 117). Applying it, together with deploying the edge function, is the
owner's sign-off act.

MIGRATION NUMBER (180, not 170): the parallel admin/moderation lane (vision-i)
has already committed migrations 170-173, so the pricing migration sits in its
reserved 180 band to avoid an unfoldable duplicate. On this isolated branch the
contiguity gate reports a 170-179 gap, and the merged tree will still have a
174-179 gap; the fold renumbers this file to 174 (the next contiguous slot after
the admin lane's head). The gap is a known fold-time item, deliberately NOT
filled with dummy migrations.

## 7. Open items flagged for the owner

- **Cartographer / Stripe price**: the codebase is internally consistent that
  Cartographer is 5.99 USD (599 cents), and every rendered surface shows 5.99.
  The actual Stripe charge is a `STRIPE_PRICE_PREMIUM` price id whose amount
  lives in the Stripe dashboard, NOT in the repo, so the true charged cents can
  only be confirmed there. Residual dead 6.00 / 600 literals remain in
  src/lib/stripe.js, a workshop copy key, and a LockedDestination default (none
  currently rendered); a small cleanup, out of this lane's scope.
- **AiPricingResyncPanel dead read**: the admin panel reads a store slice that no
  slice writes, so "Schedule last updated" always shows "never". The fix is to
  read `get_ai_pricing().updatedAt` via the new `config/livePricing.js` leaf, but
  the panel lives in the admin lane owned by a parallel workstream, so the fix is
  deferred with an exact patch rather than applied across a lane boundary.
- **Live-config-driven display (the byte-budget decision)**: `config/livePricing.js`
  (the reusable get_ai_pricing live-read plus graceful-fallback leaf) is BUILT but
  UNWIRED. Neither it nor a plain `config/pricing.js` import can be added to a
  display surface without rebalancing vite shared chunks and pushing the eager
  first-paint static closure past its owner-gated ceiling (measured +9 bytes over
  the 1,040,000 budget; the closure sits at 1,039,995 today, a 5-byte margin).
  This is an owner decision:
    - Option A (RECOMMENDED): raise the eager first-paint byte budget ~10 bytes
      (an owner-signed bump), then wire `livePricing.js` into the display surfaces
      so the client display follows whatever the server actually charges after any
      reprice or nightly-calibrator change. This retires the drift bug class for
      good and also unblocks the AiPricingResyncPanel "last updated" fix.
    - Option B: keep the correct static literals (what shipped) and accept that the
      displayed AI costs will silently drift from the server again after any future
      reprice or applied calibrator recommendation, until someone hand-syncs them.
  Recommendation: Option A. The displays already drifted once (the bug this lane
  fixed); a roughly 10-byte budget bump is cheap next to recurring silent
  price-display drift on a paid surface.
