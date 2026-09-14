#!/usr/bin/env node
/**
 * render-town.mjs — THE PILOT HARNESS, ONE TOWN (W1 deliverable 4;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §10).
 *
 *   node render-town.mjs <settlement.json|--seed <seed>> --tab <tab> [--epoch k] [--model m] [--dry]
 *
 * IT LIVES IN THE KIT AND NEVER IN THE PRODUCT. It imports `townCard.js`, `refuteUnit.js` and
 * `epochRecord.js` from the dock BY ABSOLUTE PATH, so the thing it measures is the thing that
 * landed, and it writes nothing into the dock.
 *
 * ── ⛔ NO KEY IS IN THIS ENVIRONMENT TODAY ──────────────────────────────────────────
 * `--dry` builds the card, the brief and the volatile turn, counts the tokens and calls NO MODEL.
 * Without `--dry` and without `ANTHROPIC_API_KEY` the run stops with ONE PLAIN SENTENCE and a
 * non-zero exit. The owner supplies the key at W3. This file never reads a Supabase secret, never
 * reads `.env`, and never reads any credential but that one environment variable.
 *
 * ── THE CALL, EXACTLY AS THE claude-api SKILL SPECIFIES ─────────────────────────────
 * `client.beta.messages.parse` with `output_config.format: zodOutputFormat(schema)`, model
 * `claude-opus-5`, adaptive thinking, `output_config.effort: 'high'`, the block brief as a system
 * block with `cache_control: {type: 'ephemeral', ttl: '1h'}`, the card and the epoch record as the
 * volatile user turn, `max_tokens: 16000`, and the server-side refusal fallbacks opted in
 * (`betas: ['server-side-fallback-2026-07-01']` with `fallbacks: 'default'`, the routing form, so
 * no model list is maintained here).
 *
 * ⚠ THE LIVE PATH IS UNEXECUTED. Every line below the key check has never run, because there is no
 * key in this environment. It is written to the skill's current spec and it is W3's first job to
 * execute it; the `--dry` path IS executed and is what this deliverable's figures come from.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

import {
  DOCK, UnitSchema, blockBrief, staticCard, staticRowsFor, volatileTurn,
} from './lib/brief.mjs';

const { townCard } = await import(`${DOCK}/src/domain/prose/townCard.js`);
const { refuteUnit, refuteTab } = await import(`${DOCK}/src/domain/prose/refuteUnit.js`);
const { epochRecord } = await import(`${DOCK}/src/domain/prose/epochRecord.js`);
const { generateSettlementPipeline } = await import(`${DOCK}/src/generators/generateSettlementPipeline.js`);

export const MODEL = 'claude-opus-5';
export const MAX_TOKENS = 16000;

/** @param {ReadonlyArray<string>} argv @returns {Record<string, string|boolean>} */
export function parseArgs(argv) {
  /** @type {Record<string, string|boolean>} */
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { out[key] = true; continue; }
    out[key] = next;
    i += 1;
  }
  return out;
}

/**
 * ⭐ THE CARD, THE BRIEF AND THE TURN — everything the boundary carries, built with no model.
 * This is the whole of `--dry`, and it is the part of the harness that is actually executed today.
 * @param {{settlement: object, tab: string, audience?: string, world?: object|null,
 *   prevCard?: object|null, campaignState?: object|null}} input
 */
export function buildRender(input) {
  const LAW = staticCard();
  const card = townCard(input.settlement, {
    tab: input.tab,
    audience: input.audience === 'dm' ? 'dm' : 'player',
    staticCard: LAW,
    world: input.world || null,
  });
  // ⛔ ONE BRIEF PER BLOCK, and a tab can mount more than one. The brief is the CACHED half, so it
  // is keyed on the block and the town, never on the tab: six tabs of one settlement share it.
  const blocks = [...new Set(card.pools.map((p) => p.blockId))].sort();
  const brief = blockBrief({
    blockId: blocks.join(' + ') || '(no block fires on this tab)',
    town: card.town,
    poolKeys: card.pools.map((p) => p.poolKey),
    staticRows: blocks.flatMap((b) => staticRowsFor(LAW, b)),
  });
  const record = input.prevCard
    ? epochRecord(input.prevCard, card, input.campaignState || {})
    : null;
  return {
    card, brief, record, turn: volatileTurn({ card, record }), blocks,
  };
}

/** Token counts for the two halves, so the pilot can price a run before it spends. */
export async function countTokens(client, built) {
  const counted = await client.messages.countTokens({
    model: MODEL,
    system: [{ type: 'text', text: built.brief }],
    messages: [{ role: 'user', content: built.turn }],
  });
  return {
    total: counted.input_tokens,
    briefBytes: Buffer.byteLength(built.brief, 'utf8'),
    turnBytes: Buffer.byteLength(built.turn, 'utf8'),
    cardBytes: Buffer.byteLength(JSON.stringify(built.card), 'utf8'),
    pools: built.card.pools.length,
  };
}

/**
 * THE MODEL CALL. Written to the claude-api skill's current spec; UNEXECUTED until W3 supplies a key.
 */
export async function callModel(client, built) {
  const started = Date.now();
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: zodOutputFormat(UnitSchema, 'units'),
    },
    system: [{
      type: 'text',
      text: built.brief,
      cache_control: { type: 'ephemeral', ttl: '1h' },
    }],
    messages: [{ role: 'user', content: built.turn }],
  });
  // ⛔ CHECK THE STOP REASON BEFORE READING THE CONTENT. A policy decline arrives as HTTP 200 with
  // `stop_reason: 'refusal'`, and reading `content` first would treat a refusal as an empty render.
  if (response.stop_reason === 'refusal') {
    return {
      refused: true,
      category: response.stop_details?.category ?? null,
      units: [],
      usage: response.usage,
      wallMs: Date.now() - started,
    };
  }
  return {
    refused: false,
    units: response.parsed_output?.units ?? [],
    usage: response.usage,
    model: response.model,
    wallMs: Date.now() - started,
  };
}

/** Every returned unit through the tier-0 refuter, on the card it was written for. */
export function refuteAll(units, card) {
  const judged = units.map((unit) => {
    const pool = card.pools.find(
      (p) => p.blockId === unit.blockId && p.poolKey === unit.poolKey,
    ) || null;
    const verdict = refuteUnit(
      {
        text: unit.text,
        stance: unit.stance,
        source: unit.source,
        pair: unit.pair,
        blockId: unit.blockId,
        poolKey: unit.poolKey,
        slots: pool ? pool.slots.declared : [],
      },
      card,
      { corpusUnit: pool ? { text: pool.unit.spine } : null },
    );
    return { unit, pool: pool ? pool.poolKey : null, ...verdict };
  });
  return { judged, page: refuteTab(units, card) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const tab = typeof args.tab === 'string' ? args.tab : 'defense';
  const dry = args.dry === true;
  const file = args._[0];
  const settlement = file
    ? JSON.parse(readFileSync(resolve(String(file)), 'utf8'))
    : generateSettlementPipeline(
      {
        settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
      },
      null,
      { seed: typeof args.seed === 'string' ? args.seed : 'render-town', customContent: {} },
    );

  const built = buildRender({
    settlement, tab, audience: typeof args.audience === 'string' ? args.audience : 'dm',
  });
  const seed = built.card.seed;
  const epoch = typeof args.epoch === 'string' ? Number(args.epoch) : 0;

  // ⛔ THE KEY CHECK IS BEFORE THE CLIENT IS BUILT AND BEFORE ANY COUNT. `countTokens` is a network
  // call and needs the key too, so a dry run without one must not reach it either.
  const hasKey = typeof process.env.ANTHROPIC_API_KEY === 'string' && process.env.ANTHROPIC_API_KEY !== '';
  if (!hasKey) {
    const local = {
      seed,
      tab,
      epoch,
      dry: true,
      counted: false,
      blocks: built.blocks,
      pools: built.card.pools.length,
      briefBytes: Buffer.byteLength(built.brief, 'utf8'),
      turnBytes: Buffer.byteLength(built.turn, 'utf8'),
      cardBytes: Buffer.byteLength(JSON.stringify(built.card), 'utf8'),
      // The 4-chars-per-token rule the design and W0's report both price with. It is an ESTIMATE
      // and is named as one; `--dry` with a key replaces it with the API's own count.
      approxTokens: Math.round(
        (Buffer.byteLength(built.brief, 'utf8') + Buffer.byteLength(built.turn, 'utf8')) / 4,
      ),
    };
    writeOut(seed, tab, epoch, local);
    console.log(`ANTHROPIC_API_KEY is not set, so nothing was sent and no token count was taken; the card and the brief were built and measured and the figures are in out/${seed}/${tab}-e${epoch}.json.`);
    process.exit(dry ? 0 : 1);
  }

  const client = new Anthropic();
  const counted = await countTokens(client, built);
  if (dry) {
    writeOut(seed, tab, epoch, {
      seed, tab, epoch, dry: true, counted: true, blocks: built.blocks, ...counted,
    });
    console.log(`[dry] ${seed} :: ${tab} :: ${counted.total} input tokens over ${counted.pools} pools (brief ${counted.briefBytes} B, turn ${counted.turnBytes} B)`);
    return;
  }

  const result = await callModel(client, built);
  if (result.refused) {
    console.log(`the whole chain declined this render (${result.category ?? 'no category'}); nothing was written.`);
    writeOut(seed, tab, epoch, {
      seed, tab, epoch, refused: true, category: result.category, usage: result.usage,
    });
    process.exit(2);
  }
  const { judged, page } = refuteAll(result.units, built.card);
  for (const row of judged) {
    const arm = row.findings.find((f) => f.channel === 'FAIL')
      || row.findings.find((f) => f.channel === 'WITHHELD');
    console.log(`${row.verdict.padEnd(8)} ${(arm ? arm.arm : '(clean)').padEnd(18)} ${row.unit.text}`);
  }
  writeOut(seed, tab, epoch, {
    seed,
    tab,
    epoch,
    model: result.model,
    counted,
    units: judged.map((r) => ({
      pool: r.pool, unit: r.unit, verdict: r.verdict, findings: r.findings, report: r.report,
    })),
    page,
    usage: result.usage,
    cacheReadInputTokens: result.usage?.cache_read_input_tokens ?? null,
    wallMs: result.wallMs,
  });
}

/** @param {string} seed @param {string} tab @param {number} epoch @param {object} body */
export function writeOut(seed, tab, epoch, body) {
  const path = resolve(`out/${seed}/${tab}-e${epoch}.json`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(body, null, 2)}\n`);
  return path;
}

if (process.argv[1] && process.argv[1].endsWith('render-town.mjs')) {
  await main();
}
