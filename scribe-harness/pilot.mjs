#!/usr/bin/env node
/**
 * pilot.mjs — THE PILOT (W1 deliverable 4; DESIGN_SCRIBE_GENERATION_TIME_PROSE §10).
 *
 *   node pilot.mjs --towns 20 --funnel rate|wizard --epochs 1|12 [--tabs a,b] [--dry]
 *
 * Drives `rateGrid()` towns (or the wizard-default funnel) through the six tabs the design names,
 * and with `--epochs 12` advances the world A SEASON AT A TIME THROUGH THE REAL ADVANCE PATH,
 * rendering each epoch from its own card and its own `epochRecord`. Never from prior prose:
 * §5b's rule is the whole reason the epoch record exists.
 *
 * ⛔ `--dry` IS THE ONLY PATH THAT RUNS TODAY and it calls no model. Without a key the run reports
 * what it built and measured and stops; the figures below are what W3 will price the real run from.
 *
 * ⛔ IT NEVER READS A PRODUCT SECRET. `ANTHROPIC_API_KEY` is the only credential this file looks
 * at; no `.env`, no Supabase config, no vault.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';

import { DOCK } from './lib/brief.mjs';
import {
  buildRender, callModel, countTokens, parseArgs, refuteAll,
} from './render-town.mjs';

const { rateGrid } = await import(`${DOCK}/scripts/prose-rate-corpus.mjs`);
const { generateSettlementPipeline } = await import(`${DOCK}/src/generators/generateSettlementPipeline.js`);
const { advanceCampaignWorld } = await import(`${DOCK}/src/domain/worldPulse/index.js`);
const { staticCard } = await import('./lib/brief.mjs');

/** The six tabs the design's §10 names, in the order the pilot reports them. */
export const PILOT_TABS = Object.freeze([
  'defense', 'overview', 'power', 'economics', 'war', 'daily_life',
]);

/**
 * THE WIZARD-DEFAULT FUNNEL — twenty towns at the settings the wizard ships with, varied only on
 * the two axes a new user actually touches. Named here rather than imported because no shipped
 * script holds this grid; it is the pilot's own second population (design §10).
 */
export function wizardFunnel(n) {
  const tiers = ['hamlet', 'village', 'town', 'city', 'metropolis'];
  const cultures = ['germanic', 'nordic', 'east_asian', 'mediterranean'];
  const out = [];
  for (let i = 0; i < n; i += 1) {
    out.push({
      seed: `wizard-${i}`,
      config: {
        settType: tiers[i % tiers.length],
        culture: cultures[Math.floor(i / tiers.length) % cultures.length],
      },
    });
  }
  return out;
}

/** One town, all its tabs, one epoch. @returns {Promise<Array<object>>} */
async function renderEpoch(client, settlement, world, prevCards, campaignState, tabs, dry) {
  const rows = [];
  for (const tab of tabs) {
    const built = buildRender({
      settlement,
      tab,
      audience: 'dm',
      world,
      prevCard: prevCards[tab] || null,
      campaignState,
    });
    const row = {
      tab,
      pools: built.card.pools.length,
      blocks: built.blocks,
      briefBytes: Buffer.byteLength(built.brief, 'utf8'),
      turnBytes: Buffer.byteLength(built.turn, 'utf8'),
      cardBytes: Buffer.byteLength(JSON.stringify(built.card), 'utf8'),
      // ⭐ THE HOIST, MEASURED. `town` is in the CACHED brief and not in the volatile turn, so the
      // saving is real bytes off every per-tab request after the first.
      townBytes: Buffer.byteLength(JSON.stringify(built.card.town), 'utf8'),
      approxTokens: Math.round(
        (Buffer.byteLength(built.brief, 'utf8') + Buffer.byteLength(built.turn, 'utf8')) / 4,
      ),
      deltaFields: built.record ? built.record.delta.counts.moved : null,
    };
    if (client) {
      const counted = await countTokens(client, built);
      row.tokens = counted.total;
    }
    if (client && !dry) {
      const result = await callModel(client, built);
      if (result.refused) {
        row.refused = true;
        row.category = result.category;
      } else {
        const { judged, page } = refuteAll(result.units, built.card);
        row.verdicts = judged.reduce((acc, r) => {
          acc[r.verdict] = (acc[r.verdict] || 0) + 1;
          return acc;
        }, {});
        row.units = judged.map((r) => ({
          pool: r.pool, text: r.unit.text, verdict: r.verdict, findings: r.findings,
        }));
        row.page = page;
        row.usage = result.usage;
        row.cacheReadInputTokens = result.usage?.cache_read_input_tokens ?? null;
        row.wallMs = result.wallMs;
      }
    }
    prevCards[tab] = built.card;
    rows.push(row);
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const towns = Number(args.towns ?? 20);
  const funnel = typeof args.funnel === 'string' ? args.funnel : 'rate';
  const epochs = Number(args.epochs ?? 1);
  const dry = args.dry === true;
  const tabs = typeof args.tabs === 'string' ? args.tabs.split(',') : PILOT_TABS;

  const hasKey = typeof process.env.ANTHROPIC_API_KEY === 'string' && process.env.ANTHROPIC_API_KEY !== '';
  if (!hasKey && !dry) {
    console.log('ANTHROPIC_API_KEY is not set, so no render can be made; re-run with --dry to build and measure everything the boundary would carry without calling the model.');
    process.exit(1);
  }
  const client = hasKey ? new Anthropic() : null;
  if (!hasKey) {
    console.log('ANTHROPIC_API_KEY is not set, so the token counts below are the 4-chars-per-token estimate and not the API\'s own; nothing was sent.');
  }
  // Loading the static card once here is not an optimisation, it is a pin: every town in a pilot
  // run must be carded against ONE table or the run measures two tables.
  staticCard();

  const population = funnel === 'wizard'
    ? wizardFunnel(towns)
    : rateGrid().slice(0, towns).map((row) => ({ seed: row.seed, config: row.config }));

  const out = [];
  for (const town of population) {
    let settlement;
    try {
      settlement = generateSettlementPipeline(town.config, null, { seed: town.seed, customContent: {} });
    } catch (err) {
      out.push({ seed: town.seed, failed: String(err && err.message) });
      continue;
    }
    let saves = [{
      id: 'a',
      name: settlement.name,
      phase: 'canon',
      settlement,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }];
    let campaign = {
      id: `pilot-${town.seed}`,
      name: 'Pilot',
      settlementIds: ['a'],
      worldState: { rngSeed: `pilot-${town.seed}`, tick: 0, stressors: [] },
      wizardNews: { currentTick: 0, entries: [] },
    };
    /** @type {Record<string, object>} */
    const prevCards = {};
    const epochRows = [];
    for (let k = 0; k < epochs; k += 1) {
      if (k > 0) {
        // ⛔ THE REAL ADVANCE PATH, A SEASON AT A TIME. Not a hand-mutated settlement: the epoch
        // record is only worth measuring if the two cards it spans came from the engine.
        const advanced = advanceCampaignWorld({
          campaign,
          saves,
          interval: 'one_season',
          now: `2026-06-01T00:00:${String(k).padStart(2, '0')}.000Z`,
        });
        const update = (advanced.settlementUpdates || []).find((u) => String(u.saveId) === 'a');
        if (update) saves = [{ ...saves[0], settlement: update.settlement }];
        campaign = { ...campaign, worldState: advanced.worldState, wizardNews: advanced.wizardNews };
      }
      epochRows.push({
        epoch: k,
        tick: campaign.worldState.tick,
        tabs: await renderEpoch(
          client, saves[0].settlement, campaign.worldState, prevCards,
          saves[0].campaignState, tabs, dry,
        ),
      });
    }
    out.push({ seed: town.seed, name: settlement.name, tier: settlement.tier, epochs: epochRows });
    // ⛔ THE TWO HALVES ARE PRINTED APART, AND SUMMING THEM WOULD BE A LIE ABOUT THE BILL. The
    // brief is one CACHED prefix shared by every tab of one settlement; the turn is volatile and
    // paid in full per tab. A single total counts the brief six times and would have told the
    // chair a settlement costs six times what it costs.
    const first = epochRows[0].tabs;
    const briefTok = Math.round(first[0].briefBytes / 4);
    const turnTok = first.reduce((a, r) => a + Math.round(r.turnBytes / 4), 0);
    console.log(`${town.seed.padEnd(14)} ${String(settlement.name).padEnd(22)} ${String(settlement.tier).padEnd(11)} ${first.length} tabs, ${first.reduce((a, r) => a + r.pools, 0)} pools, brief ~${briefTok} tok CACHED ONCE + turns ~${turnTok} tok over the tabs (epoch 0)`);
  }

  const path = resolve(`out/pilot-${funnel}-${towns}x${epochs}.json`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`\nwrote ${path}`);
}

if (process.argv[1] && process.argv[1].endsWith('pilot.mjs')) {
  await main();
}
