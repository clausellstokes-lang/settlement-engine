#!/usr/bin/env node
/**
 * render-town.mjs — THE PILOT HARNESS, ONE TOWN (W1 deliverable 4, re-pointed at W3a car 1;
 * DESIGN_SCRIBE_GENERATION_TIME_PROSE §10).
 *
 *   node render-town.mjs <settlement.json|--seed <seed>> --tab <tab> [--epoch k] [--model m] [--dry]
 *
 * IT LIVES IN THE KIT AND NEVER IN THE PRODUCT. It imports `townCard.js`, `refuteUnit.js`,
 * `epochRecord.js` and — since W3a — `scribeBrief.js` from the dock BY ABSOLUTE PATH, so the
 * thing it measures is the thing that landed, and it writes nothing into the dock.
 *
 * ── ⭐ ONE PROMPT (chair ruling 25) ─────────────────────────────────────────────────
 * The brief, the town block, the volatile turn, the output schema, the parser and the judge are
 * all the dock's own `src/domain/prose/scribeBrief.js`. The edge function imports the same code
 * out of `_shared/proseKernel.bundle.js`, which is byte-derived from that file and pinned equal
 * to it by `tests/lint/scribeBundle.walker.test.js`. Nothing about the prompt is spelled here.
 *
 * ── ⛔ NO KEY IS IN THIS ENVIRONMENT TODAY ──────────────────────────────────────────
 * `--dry` builds the card, the two cached blocks and the volatile turn, counts the tokens and
 * calls NO MODEL. Without `--dry` and without `ANTHROPIC_API_KEY` the run stops with ONE PLAIN
 * SENTENCE and a non-zero exit. This file never reads a Supabase secret, never reads `.env`, and
 * never reads any credential but that one environment variable.
 *
 * ── THE CALL, EXACTLY AS THE claude-api SKILL SPECIFIES ─────────────────────────────
 * `client.beta.messages.create` with `output_config.format: {type:'json_schema', schema}` — the
 * schema is the product's own `SCRIBE_OUTPUT_SCHEMA`, a plain closed JSON Schema, so no zod and
 * no `zodOutputFormat` stands between the pilot and the bytes the edge function sends. Model
 * `claude-opus-5`, adaptive thinking, `output_config.effort: 'high'`, TWO system blocks each
 * `cache_control: {type:'ephemeral', ttl:'1h'}`, the volatile turn as the user message,
 * `max_tokens: 16000`, and the server-side refusal fallbacks opted in
 * (`betas: ['server-side-fallback-2026-07-01']` with `fallbacks: 'default'`).
 *
 * ⚠ THE LIVE PATH IS UNEXECUTED. Every line below the key check has never run, because there is
 * no key in this environment. It is written to the skill's current spec; the `--dry` path IS
 * executed and is what this deliverable's figures come from.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';

import {
  DOCK, SCRIBE_OUTPUT_SCHEMA, TIER1_ANSWER_SCHEMA, applyTier1, buildScribeBrief,
  buildScribeUserTurn, buildTier1Checklist, buildTownBlock, exemplarPack, judgeUnits,
  parseScribeUnits, staticCard, voiceText,
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
 * ⭐ THE CARD AND THE THREE BLOCKS — everything the boundary carries, built with no model.
 * This is the whole of `--dry`, and it is the part of the harness that is actually executed.
 * @param {{settlement: object, tab: string, audience?: string, world?: object|null,
 *   prevCard?: object|null, campaignState?: object|null, guidance?: string}} input
 */
export function buildRender(input) {
  const LAW = staticCard();
  const card = townCard(input.settlement, {
    tab: input.tab,
    audience: input.audience === 'dm' ? 'dm' : 'player',
    staticCard: LAW,
    world: input.world || null,
  });
  const record = input.prevCard
    ? epochRecord(input.prevCard, card, input.campaignState || {})
    : null;
  return {
    card,
    record,
    // Cache breakpoint 1: byte-identical for every user, every world and every tab.
    brief: buildScribeBrief({ voice: voiceText(), exemplars: exemplarPack() }),
    // Cache breakpoint 2: identical across one settlement's tabs.
    townBlock: buildTownBlock(card),
    // The volatile half.
    turn: buildScribeUserTurn({ card, record, guidance: input.guidance || '' }),
    blocks: [...new Set(card.pools.map((p) => p.blockId))].sort(),
  };
}

/** Token counts for the three parts, so the pilot can price a run before it spends. */
export async function countTokens(client, built) {
  const counted = await client.messages.countTokens({
    model: MODEL,
    system: [
      { type: 'text', text: built.brief },
      { type: 'text', text: built.townBlock },
    ],
    messages: [{ role: 'user', content: built.turn }],
  });
  return {
    total: counted.input_tokens,
    briefBytes: Buffer.byteLength(built.brief, 'utf8'),
    townBytes: Buffer.byteLength(built.townBlock, 'utf8'),
    turnBytes: Buffer.byteLength(built.turn, 'utf8'),
    cardBytes: Buffer.byteLength(JSON.stringify(built.card), 'utf8'),
    pools: built.card.pools.length,
  };
}

/**
 * THE MODEL CALL. Written to the claude-api skill's current spec; UNEXECUTED until a key exists.
 */
export async function callModel(client, built) {
  const started = Date.now();
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema: SCRIBE_OUTPUT_SCHEMA },
    },
    system: [
      { type: 'text', text: built.brief, cache_control: { type: 'ephemeral', ttl: '1h' } },
      { type: 'text', text: built.townBlock, cache_control: { type: 'ephemeral', ttl: '1h' } },
    ],
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
  const text = (response.content || []).find((b) => b?.type === 'text')?.text ?? '';
  const parsed = parseScribeUnits(text);
  return {
    refused: false,
    parsed,
    units: parsed.units,
    answerText: text,
    usage: response.usage,
    model: response.model,
    wallMs: Date.now() - started,
  };
}

/**
 * THE TIER-1 CALL. The SAME two cached system blocks as the writer, the checklist as the turn,
 * the answer schema as the format. UNEXECUTED until a key exists, like `callModel`.
 */
export async function callTier1(client, built, units) {
  const started = Date.now();
  const checklist = buildTier1Checklist(units, built.card);
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema: TIER1_ANSWER_SCHEMA },
    },
    system: [
      { type: 'text', text: built.brief, cache_control: { type: 'ephemeral', ttl: '1h' } },
      { type: 'text', text: built.townBlock, cache_control: { type: 'ephemeral', ttl: '1h' } },
    ],
    messages: [{ role: 'user', content: checklist }],
  });
  if (response.stop_reason === 'refusal') {
    return { refused: true, answers: [], usage: response.usage, wallMs: Date.now() - started };
  }
  const text = (response.content || []).find((b) => b?.type === 'text')?.text ?? '';
  let answers = [];
  try { answers = JSON.parse(text).answers ?? []; } catch { answers = []; }
  return { refused: false, answers, usage: response.usage, wallMs: Date.now() - started };
}

/**
 * ⭐ ONE JUDGE. `judgeUnits` is the edge function's own gate, from the dock's own leaf, with the
 * dock's own `refuteUnit` injected — so the pilot's refusal rate and the product's are one number
 * and not two. `refuteTab` runs beside it for the page-level arms, which are not a unit property.
 *
 * `tier1Answers` is the second reader's sheet where one was taken; without it the function is
 * tier 0 alone, which is exactly what the product does when the second reader is unavailable.
 */
export function judgeAll(units, card, tier1Answers) {
  const judged = judgeUnits(units, card, refuteUnit);
  judged.tier1Dropped = 0;
  judged.tier1Patched = 0;
  if (Array.isArray(tier1Answers) && tier1Answers.length) {
    // ⛔ THE CARD IS PASSED: without it a refused FACE has no corpus twin to fall to and the whole
    // unit drops, which is the OLD rule and would silently un-do W3b car 3 in the pilot alone.
    const second = applyTier1(judged.kept, tier1Answers, card);
    judged.kept = second.kept;
    judged.verdicts = [...judged.verdicts, ...second.verdicts];
    judged.dropped += second.dropped;
    judged.patched += second.patched;
    judged.tier1Dropped = second.dropped;
    judged.tier1Patched = second.patched;
  }
  // ⛔ A UNIT CAN NOW CARRY TWO VERDICT ROWS, one per reader, so the printer takes the WORST and
  // keeps both sets of findings. Reading only the first would hide every tier-1 refusal behind
  // tier 0's PASS on the same pool. PATCHED ranks above WITHHELD and below FAIL: it is a unit that
  // shipped, with a row replaced by the hand corpus.
  const rank = { PASS: 0, WITHHELD: 1, PATCHED: 2, FAIL: 3 };
  const shipped = new Map(judged.kept.map((u) => [`${u.blockId}::${u.poolKey}::${u.vid}`, u]));
  const rows = units.map((unit) => {
    const mine = judged.verdicts.filter(
      (v) => v.blockId === unit.blockId && v.poolKey === unit.poolKey && v.vid === unit.vid,
    );
    const ships = shipped.get(`${unit.blockId}::${unit.poolKey}::${unit.vid}`) ?? null;
    if (!mine.length) return { unit, shipped: ships, verdict: null, verdicts: [] };
    const worst = mine.reduce((a, b) => ((rank[b.verdict] ?? 0) > (rank[a.verdict] ?? 0) ? b : a));
    return {
      unit,
      // ⭐ WHAT ACTUALLY REACHES THE PAGE, which is not the model's own answer on a patched unit.
      shipped: ships,
      verdicts: mine,
      verdict: {
        ...worst,
        arms: [...new Set(mine.flatMap((v) => v.arms))].sort(),
        patched: [...new Set(mine.flatMap((v) => v.patched || []))],
        findings: mine.flatMap((v) => v.findings || []),
      },
    };
  });
  return {
    ...judged,
    rows,
    page: refuteTab(
      units.map((u) => ({ text: u.spine, blockId: u.blockId, poolKey: u.poolKey })),
      card,
    ),
  };
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
      townBytes: Buffer.byteLength(built.townBlock, 'utf8'),
      turnBytes: Buffer.byteLength(built.turn, 'utf8'),
      cardBytes: Buffer.byteLength(JSON.stringify(built.card), 'utf8'),
      // The 4-chars-per-token rule the design and W0's report both price with. It is an ESTIMATE
      // and is named as one; `--dry` with a key replaces it with the API's own count.
      approxTokens: Math.round(
        (Buffer.byteLength(built.brief, 'utf8')
          + Buffer.byteLength(built.townBlock, 'utf8')
          + Buffer.byteLength(built.turn, 'utf8')) / 4,
      ),
    };
    writeOut(seed, tab, epoch, local);
    console.log(`ANTHROPIC_API_KEY is not set, so nothing was sent and no token count was taken; the card and the prompt were built and measured and the figures are in out/${seed}/${tab}-e${epoch}.json.`);
    process.exit(dry ? 0 : 1);
  }

  const client = new Anthropic();
  const counted = await countTokens(client, built);
  if (dry) {
    writeOut(seed, tab, epoch, {
      seed, tab, epoch, dry: true, counted: true, blocks: built.blocks, ...counted,
    });
    console.log(`[dry] ${seed} :: ${tab} :: ${counted.total} input tokens over ${counted.pools} pools (brief ${counted.briefBytes} B, town ${counted.townBytes} B, turn ${counted.turnBytes} B)`);
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
  if (!result.parsed.ok) {
    console.log(`the answer did not parse under the output schema (${result.parsed.reason}); nothing was judged.`);
    writeOut(seed, tab, epoch, {
      seed, tab, epoch, parseFailure: result.parsed.reason, usage: result.usage,
    });
    process.exit(3);
  }
  // ⭐ TIER 1 RUNS LIVE, on tier 0's survivors, exactly as the edge function runs it — and a
  // failure of it is NOT a failure of the render: tier 0 is the floor and the units it kept ship.
  const tier0 = judgeAll(result.units, built.card);
  let tier1 = { state: tier0.kept.length ? 'ok' : 'none', answers: [], usage: null, wallMs: 0 };
  if (tier0.kept.length) {
    try {
      const second = await callTier1(client, built, tier0.kept);
      if (second.refused) tier1 = { ...tier1, state: 'skipped' };
      else tier1 = { state: 'ok', answers: second.answers, usage: second.usage, wallMs: second.wallMs };
    } catch (e) {
      console.log(`the second reader was unavailable (${e instanceof Error ? e.message : String(e)}); tier 0's units stand.`);
      tier1 = { ...tier1, state: 'skipped' };
    }
  }
  const judged = judgeAll(result.units, built.card, tier1.answers);
  for (const row of judged.rows) {
    // ⭐ EVERY ARM, NOT THE FIRST. RUN 2 finding 4: the judge printed one finding a unit, so every
    // tier-1 drop read as `T1-CERTAINTY` whatever the reader had actually answered.
    console.log(`${String(row.verdict?.verdict ?? '?').padEnd(8)} ${(row.verdict?.arms?.join(' ') || '(clean)').padEnd(24)} ${row.unit.spine}`);
    for (const seat of (row.verdict?.patched || [])) console.log(`         PATCHED at ${seat}: the hand corpus stands there and the rest of the unit ships`);
  }
  writeOut(seed, tab, epoch, {
    seed,
    tab,
    epoch,
    model: result.model,
    counted,
    units: judged.rows.map((r) => ({
      unit: r.unit, shipped: r.shipped, verdict: r.verdict, verdicts: r.verdicts,
    })),
    dropped: judged.dropped,
    patched: judged.patched,
    kept: judged.kept.length,
    tier1: tier1.state,
    tier1Dropped: judged.tier1Dropped ?? 0,
    tier1Patched: judged.tier1Patched ?? 0,
    tier1Answers: tier1.answers,
    page: judged.page,
    usage: result.usage,
    tier1Usage: tier1.usage,
    cacheReadInputTokens: result.usage?.cache_read_input_tokens ?? null,
    tier1CacheReadInputTokens: tier1.usage?.cache_read_input_tokens ?? null,
    wallMs: result.wallMs + tier1.wallMs,
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
