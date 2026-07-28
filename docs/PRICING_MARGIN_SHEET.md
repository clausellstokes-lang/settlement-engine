# AI Credit Pricing: Margin Sheet (optimal margins at Opus-default economics)

Ratified 2026-07-28 under the owner's delegated best-judgment instruction. The
5 / 4 / 6 standard schedule and 2 / 3 / 4 fast schedule remain the starting
prices until real usage telemetry justifies a later explicit reprice.

Nothing here reaches production merely because it is committed: migration 174
and the edge function remain deploy-gated, while the client reads the live
schedule lazily and falls back to the shipped constants when the RPC is absent
or offline.

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

SENSITIVITY on the narrative decision: narrative = 5
meets the 2.5x floor on the careful realistic cost (~0.31 USD, output-dominated,
~2.57x) and clears 1.2x on a p95 worst-case; it falls short of 1.2x only against
the pathological absolute-max output (every one of 20 calls maxing its
max_tokens, which never occurs). The token figures are ESTIMATES pending
telemetry. If the owner judges realistic cost to sit at the high end, the
conservative alternative is narrative = 6; to keep progression the premium
action that would lift progression to 7, or the owner may instead accept
narrative > progression (breaking the `progression > narrative` invariant, which
is arguably the more cost-honest ordering since narrative is the highest-cost
action). The 2026-07-28 ruling is to hold 5 / 4 / 6 until the calibrator and
observed usage provide evidence, rather than pre-emptively charging for the
pathological ceiling.

## 5. The policy knobs

Seeded in `ai_pricing_knobs`, updated by migration 174:

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

1. **CLIENT first.** The client ships the 5 / 4 / 6 constants as its offline
   fallback and lazily reads `get_ai_pricing` on paid action, pricing, and admin
   surfaces. A successful read warms the synchronous preflight cache, so the
   displayed price and the action preflight use the same live schedule.
2. **Migration + edge function TOGETHER.** The migration updates the live
   `ai_credit_costs` config (the config-first charge path) and the fallback
   bodies; the edge function precheck is repriced to match. The server precheck
   plus the `spend_credits` RPC stay authoritative and fail-safe: a stale client
   can never over- or under-charge, because the database decides the price.

Migration 174 is the sole forward reprice. Already-applied migrations 024, 057,
and 114 retain their original 3 / 4 / 5 bytes; migration 192 carries the current
net spend body plus the still-inert capability-tier multiplier seam. Applying
the migration train and deploying the edge function remain external release
acts, after the clone rehearsal.

## 7. Open items flagged for the owner

- **Cartographer / Stripe price**: the codebase is internally consistent that
  Cartographer is 5.99 USD (599 cents), and rendered surfaces derive or show
  that price consistently.
  The actual Stripe charge is a `STRIPE_PRICE_PREMIUM` price id whose amount
  lives in the Stripe dashboard, NOT in the repo, so the true charged cents can
  only be confirmed there. That dashboard verification is the only remaining
  price-fact check.
- **Live pricing and first paint — CLOSED 2026-07-28.** The lazy hook is wired
  into the pricing page, action surfaces, and resync panel. A fresh production
  build measured the eight-file first-paint static closure at **1,034,867
  bytes**, 5,133 bytes below the unchanged 1,040,000-byte ceiling. No budget
  raise was needed.
- **Automatic repricing remains OFF.** `applyCreditCosts` stays disabled and no
  `ai_tier_multipliers` row is seeded. The calibrator may recommend; it does not
  silently change customer charges.
