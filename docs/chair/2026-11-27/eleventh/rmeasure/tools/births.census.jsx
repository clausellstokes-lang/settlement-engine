/** @vitest-environment node */
/**
 * BIRTH-1's births harness (the tenth chair's seat; START-GEN-COMMON "THE FORM OF EVERY UNIT" (a), (d)). Births every row of a
 * PLAN on a TREE exactly as the close's page battery births it (`page-battery.render.census.jsx`: `birthConfig(row.config)`,
 * options `{ seed, customContent: {} }`) and writes ONE jsonl line per birth: seed, size, `recordHash` (sha256 of the born
 * record) and whatever the MEASURE module returns for it (`export function measure(town) -> object`).
 * Run by `births.mjs` beside it (it writes the vitest config with root = the tree). Changes nothing in any tree.
 * Env: BIRTHS_TREE, BIRTHS_PLAN, BIRTHS_OUT (a .jsonl file), BIRTHS_MEASURE (absolute path of an .mjs).
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TREE = String(process.env.BIRTHS_TREE);
const PLAN = JSON.parse(readFileSync(String(process.env.BIRTHS_PLAN), 'utf8'));
const OUT = String(process.env.BIRTHS_OUT);
const MEASURE = process.env.BIRTHS_MEASURE || '';

test('births of a plan', async () => {
  const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
  const meas = MEASURE ? await import(/* @vite-ignore */ MEASURE) : null;
  await dens.loadGenerationLawPayloads();
  const lines = [];
  for (const row of PLAN) {
    // a measure may watch the steps (`export function onStep(name, ctx, patch, cap)`): it reads, it never writes the ctx
    const cap = {};
    const onStep = meas?.onStep ? (/** @type {string} */ n, /** @type {any} */ c, /** @type {any} */ p) => meas.onStep(n, c, p, cap) : undefined;
    const town = pipe.generateSettlementPipeline(row.raw ? row.config : dens.birthConfig(row.config), null, { seed: row.seed, customContent: {}, ...(onStep ? { onStep } : {}) });
    const recordHash = createHash('sha256').update(JSON.stringify(town)).digest('hex');
    const m = meas ? await meas.measure(town, { tree: TREE, row, cap }) : {};
    lines.push(JSON.stringify({ seed: row.key ?? row.seed, size: row.size, recordHash, ...m }));
  }
  writeFileSync(OUT, `${lines.join('\n')}\n`);
}, 7200000);
