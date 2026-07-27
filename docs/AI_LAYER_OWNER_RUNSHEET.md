# THE AI LAYER — OWNER RUNSHEET (what only you can do)

> Written 2026-07-27 at program close. Everything buildable is built, folded (minifold
> `ada1252d` + `869acbe3`) and gate-green. What follows is the short list of PHYSICAL acts,
> in order, each with its verification. Nothing here is blocked on more engineering.

## A. THE DEPLOY (owner console — I cannot perform these)

**A1. Migration train.** The AI layer adds two: `191_surveyor_probe_tier.sql` (probe tier +
verdict profile + the mig-159 health-reset REPAIR) and `192_tier_credit_multiplier.sql`
(spend_credits gains an optional tier arg; seedless, therefore inert).
- Rehearse on a clone first (the tooling refuses anything else) per
  `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`.
- ⚠ **Name the 191 repair in the rehearsal notes:** it restores the health reset that mig 159
  silently dropped, so a rotated BYOK key stops inheriting the previous key's `healthy` badge.
  That is a live behavior change on deploy, deliberately, with an executed pglite proof.
- Then `supabase db push`, then bump the applied head.

**A2. Edge functions.** Deploy the six walled surfaces + `surveyor-byok`. This is the act that
makes ALL of tonight's behavior live: forced output schemas, cached charters, the atlas prior,
coaching, and the now-open repair dial (journeyman 1 / master 2).

**A3. Verify at deploy (2 minutes, and worth every second):**
1. **Cache receipts** — two consecutive calls on the same surface with a live key; read
   `usage.cache_creation_input_tokens` on the first and `cache_read_input_tokens` on the
   second. This is the one economic claim the whole design rests on that no test can prove.
2. **Forced tool output** — one call; confirm the answer arrives as a `tool_use` block and the
   free-text fallback never fires.
3. **A repair round** — send a request that fails validation once; confirm exactly one repair
   round fires at journeyman and the rejected set SHRINKS.
4. **The probe** — register a BYOK key, run the capability probe, confirm a tier is seated and
   the Account panel shows the plain-sentence description.

## B. THE ACTIVATIONS STILL OWED (each is one act, in your hands)

| dial | state | what it needs |
|---|---|---|
| Repair rounds | **OPEN 0/1/2** (by your 2026-07-27 order) | nothing — rides the A2 deploy |
| Thinking budgets | **SHUT 0/0/0** | a request-shape change first: `claude-opus-4-8` rejects a fixed `thinking.budget_tokens` with a 400 (that class moved to adaptive thinking + effort). Clearing it is engineering, not a flip — say the word and it becomes a wave. |
| Tier price multiplier | **UNSEEDED** (inert by absence) | a `system_config` row `ai_tier_multipliers` — **owner console only**, I have no write path. Until it lands, master-tier repair rounds are unpriced (small COGS, named honestly). |
| Intent atlas Phase B | **PRIOR LIVE, real data pending** | deploy mig 134 + its cron; the soak prior self-retires cell by cell as real evidence clears the floor. No further ruling needed. |

## C. THE TASTE PICKS (no engineering waits on these)

- **Tier names** — `scout / journeyman / master` are working names, live in the DB check
  constraint and the Account copy. One word changes them (a migration for the constraint).
- **M44 dial list** — the physics-amendment surface is spec-ratified; the five proposed dials
  are in the queue awaiting your enumeration.

## D. WHAT I DELIBERATELY DID NOT DO

- **No push.** The fold is committed locally; pushing `claude/composite-r4` stays your act per
  the backup protocol, and you did not name it.
- **No production migration or deploy.** Owner-physical by rule and by credential.
- **No pricing seed.** Same reason.
- **No foreign-lane files touched.** Five other lanes were live in this tree all night; every
  red they own is attributed with executed evidence in DESIGN_AI_CAPABILITY_LADDER.md §4e.
