# SIM-MEASURE — a measuring seat's brief (SEAT-1, the seventh chair, 2026-11-20)

You MEASURE. You change nothing under `src/` or `tests/` in this checkout, you commit nothing and push nothing. Your one deliverable is an instrument and its output, written under `docs/chair/2026-11-20/content/seat/sim/` in this checkout, and a report of at most 250 words.

## The question

The seventh chair's ruling CS3 says: the power that HOLDS a town's seat never contests that seat. It leaves the challengers of `src/domain/rulingPowerCoup.js :: coupContenders` and the next heaviest power takes its place; the incumbent's weight is unchanged. Today the holder is not excluded (a merchant-held council has Merchant Guilds as its leading challenger in most towns).

**What does CS3 do, in a simulated campaign, to the RATE of coups and to WHO WINS them?** Measured on born towns of today's law, the same towns, the same seeds, run twice: once on the shipped tree (A) and once with CS3 applied (B).

## What you have

- The holder read is drafted at `docs/chair/2026-11-20/content/seat/seat-draft.mjs :: holderOf` (owner audience). Read it; use it as written; do not improve it. Report anything in it that is wrong.
- Born towns: `generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} })` after `await loadGenerationLawPayloads()` (`src/domain/density/densityCreateBoundary.js`). `docs/chair/2026-11-20/content/seat/measure-holder.mjs` shows the pattern.
- The campaign harnesses that drive the real pulse: `scripts/audit/simulate-world.mjs` (born towns in a region, `advanceCampaignWorld`, everything-on rules, notes on the hostility seeding and the one-week tick) and `scripts/audit/religion-coup-soak.mjs` (`simulateCampaignWorldPulse`, the coup cluster on fixtures). Read both; build yours from them. The coup path is `worldPulse/stressorGates.js` (the spawn gate reads the challengers), `worldPulse/stressorDynamics.js`, `worldPulse/coup.js` → `resolveCoupVerdict` → `rulingPower.js :: transferRulingPower` (via `applyWorldPulse.js`).

## How to apply CS3 for arm B without touching this checkout

Make a throwaway worktree of the SAME commit in the session scratchpad (`git worktree add --detach <scratchpad>/simB HEAD`, `node_modules` symlinked in), and in THAT tree only, patch `coupContenders` so its challenger filter also drops the row `holderOf(settlement)` names (import the draft by absolute path, or inline a copy of its logic and say so). Nothing else changes. Run the same instrument from both trees. Remove the worktree when done (`git worktree remove --force`). Never stage, commit or push anything.

## What to report (counted, per arm, A beside B)

Use rules with `stressorsEnabled: true` and `factionCompetitionEnabled: true` at least; say exactly which rules you enabled and why. Pick a pool that gives coups a chance without inventing them (no hand-lowered legitimacy unless you report an arm without it too): e.g. 3 regions × 14 born towns of mixed tiers × 2 seeds, 52 one-week ticks; scale to what runs in under ~15 minutes per arm.

1. coup_detat stressors born; verdicts reached; seats that fell; seats that held; plots that collapsed for want of challengers;
2. the winners by kind (`contestKindOf` in the draft, and `factionArchetype`), and how often the winner was the seat's own holder (A only, by construction);
3. towns where the coup gate never opens in B but did in A (and the reverse);
4. anything that threw, and any determinism break (run A twice and diff).

Name the instrument file, its exact command, the commit it ran at, and every output file. CONFIRMED (executed) vs PLAUSIBLE (read) on every sentence of the report. If the harnesses cannot drive born towns to a coup at all in that budget, say so with the counts and stop: that is a finding.
