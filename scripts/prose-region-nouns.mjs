#!/usr/bin/env node
/**
 * scripts/prose-region-nouns.mjs — THE REGION ARM (brief ADDENDUM 18 ruling 6: "a REGION ARM
 * counts each face's most distinctive content noun across a batch of neighbouring towns and
 * reports recurrence").
 *
 *   node scripts/prose-region-nouns.mjs <BLOCK> [--batch reader|grid] [--cell N] [--region rr-fresh-full]
 *       [--pool '<pool key>'] [--top 20]
 *
 * For each face of the block as it stands in the working tree's annex
 * (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md: the numbered spine lines and their `[face]`
 * sub-rows), its most distinctive content token by TF-IDF against the block's own corpus (a
 * simple tokeniser: lower-cased words of four letters or more, stop-words and slot tokens
 * dropped); then, across a batch of neighbouring towns — the 4-save reader region by default
 * (`scripts/review/readerCorpus.mjs` composeReaderRegion), or a rate-grid cell's four seeds with
 * `--batch grid --cell N` — how many towns' rendered Defense pages carry that token (exact word
 * or its plural), and the top recurrences. A token every neighbour's page carries is a token
 * the region has stopped noticing.
 *
 * Deterministic; read-only. The reader region is four generations (~10 s); a grid cell is four.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { ROOT } from './lib/prose-mark-fields.mjs';
import { renderDefensePage, pageText } from './lib/prose-render-defense-page.mjs';

/**
 * Function words, modals, common verbs and bare adjectives/adverbs: none of them is a CONTENT
 * NOUN, and TF-IDF alone will happily crown `less`, `cannot` or `full` (measured on the first
 * whole-block run). The list is deliberately plain; a face whose every token is on it prints an
 * empty noun rather than a guess.
 */
const STOP = new Set((('that this with from into what when where which there their they them then than have been were being also only over under about after before again against between while into onto upon toward towards without within very much more most some such each every other another same both either neither because though although whether would could should shall will does done doing made make makes making take takes taken took come comes came goes going gone went here just like well still even ever never once back down away along around across through until since till these those whom whose ones thing things something nothing anything everything nobody somebody anybody everybody people town place settlement keeps kept keep held hold holds says said stands stand standing stood does do has had'
  + ' cannot less full active paid serious knows know known gets puts means needs tells told asked asks seen sees given gives always often rarely sometimes somewhere anywhere nowhere everywhere enough rather quite almost entirely mostly exactly already matter kind sort part ways whatever whoever wherever whenever itself themselves himself herself yourself myself might must maybe perhaps really quite little large small long short good better best worse worst many much fewer least'
  + ' against beside behind inside outside above below near next last first second third half whole rest else somebody anyone everyone noone').split(/\s+/)));

/** @param {string} text @returns {string[]} */
export function tokens(text) {
  return String(text).toLowerCase().replace(/\{[a-z_]+\}/g, ' ').replace(/[^a-z' ]+/g, ' ').split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, '').replace(/'s$/, '')).filter((w) => w.length >= 4 && !STOP.has(w));
}

/**
 * The block's faces from the annex: every spine line and `[face]` sub-row under `### <BLOCK>`.
 * @param {string} block
 * @returns {Array<{pool: string, variant: number, face: number, tag: string, text: string, line: number}>}
 */
export function annexFaces(block) {
  const lines = readFileSync(path.join(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8').split('\n');
  const out = [];
  let inBlock = false; let pool = ''; let variant = 0; let face = 0;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const head = /^###\s+(DS-[A-Z]+-\d+)\b/.exec(raw);
    if (head) { inBlock = head[1] === block; pool = ''; continue; }
    if (!inBlock) continue;
    const poolHead = /^\*\*`([^`]+)`:\s*(.+?)\*\*\s*$/.exec(raw) || /^\*\*([^*`]+?)\*\*\s*$/.exec(raw);
    if (poolHead) { pool = poolHead[2] !== undefined ? `${poolHead[1]}: ${poolHead[2]}` : poolHead[1]; variant = 0; continue; }
    const spine = /^(\d+)\.\s+`\[([^\]]*)\]`\s+(.*)$/.exec(raw);
    if (spine && pool) { variant = Number(spine[1]); face = 0; out.push({ pool, variant, face, tag: spine[2], text: spine[3].trim(), line: i + 1 }); continue; }
    const sub = /^\s+-\s+`\[face\]`\s+(.*)$/.exec(raw);
    if (sub && pool && variant) { face += 1; out.push({ pool, variant, face, tag: 'face', text: sub[1].replace(/<!--.*?-->/g, '').trim(), line: i + 1 }); }
  }
  return out;
}

/**
 * TF-IDF over the block's faces; the most distinctive token per face.
 * @param {ReturnType<typeof annexFaces>} faces
 * @returns {Array<{face: object, noun: string, score: number}>}
 */
export function distinctiveNouns(faces) {
  const docs = faces.map((f) => tokens(f.text));
  const df = new Map();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) || 0) + 1);
  const N = docs.length;
  return faces.map((face, i) => {
    const tf = new Map();
    for (const t of docs[i]) tf.set(t, (tf.get(t) || 0) + 1);
    let best = ''; let score = -1;
    for (const [t, n] of tf) {
      const s = (n / Math.max(1, docs[i].length)) * Math.log((N + 1) / ((df.get(t) || 0) + 1));
      if (s > score || (s === score && t < best)) { best = t; score = s; }
    }
    return { face, noun: best, score: Number(score.toFixed(4)) };
  });
}

/** @param {string} noun @param {string} text */
const carries = (noun, text) => new RegExp(`\\b${noun.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es)?\\b`, 'i').test(text);

async function main() {
  const argv = process.argv.slice(2);
  const opt = (flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : dflt; };
  const block = argv.find((a, i) => !a.startsWith('--') && !/^--(batch|cell|region|pool|top)$/.test(argv[i - 1] || ''));
  if (!block) { console.error("usage: node scripts/prose-region-nouns.mjs <BLOCK> [--batch reader|grid] [--cell N] [--region rr-fresh-full] [--pool '<pool key>'] [--top 20]"); process.exit(2); }
  const batch = opt('--batch', 'reader');
  const onlyPool = opt('--pool', null);
  const top = Number(opt('--top', '20'));

  let faces = annexFaces(block);
  if (onlyPool) faces = faces.filter((f) => f.pool === onlyPool);
  if (faces.length === 0) throw new Error(`no faces for ${block}${onlyPool ? ` :: ${onlyPool}` : ''} in the annex`);
  const nouns = distinctiveNouns(annexFaces(block)).filter((n) => !onlyPool || n.face.pool === onlyPool);

  /** @type {Array<{id: string, tier: string, page: string}>} */
  const towns = [];
  if (batch === 'grid') {
    const cell = Number(opt('--cell', '1'));
    const { rateGrid } = await import('./prose-rate-corpus.mjs');
    const { generateSettlementPipeline } = await import('../src/generators/generateSettlementPipeline.js');
    for (const spec of rateGrid().filter((t) => t.cell === cell)) {
      const s = generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} });
      towns.push({ id: spec.seed, tier: String(s.tier), page: pageText(renderDefensePage(s)) });
    }
  } else {
    const reader = await import('./review/readerCorpus.mjs');
    const rowId = opt('--region', 'rr-fresh-full');
    const row = reader.READER_CORPUS_ROSTER.find((r) => r.campaignId === rowId);
    if (!row) throw new Error(`no reader roster row ${rowId}`);
    const { saves } = reader.composeReaderRegion(row);
    for (const s of saves) towns.push({ id: s.id, tier: String(s.settlement.tier), page: pageText(renderDefensePage(s.settlement)) });
  }

  console.log(`REGION NOUNS — ${block}${onlyPool ? ` · ${onlyPool}` : ''} · ${faces.length} faces · batch ${batch} (${towns.map((t) => `${t.id}=${t.tier}`).join(', ')})`);
  const rows = nouns.map((n) => {
    const hits = towns.filter((t) => carries(n.noun, t.page)).map((t) => t.id);
    return { ...n, hits };
  });
  rows.sort((a, b) => b.hits.length - a.hits.length || a.noun.localeCompare(b.noun));
  console.log(`\nTOP RECURRENCES (a face's distinctive token carried by N of ${towns.length} neighbouring pages):`);
  for (const r of rows.slice(0, top)) {
    console.log(`  ${String(r.hits.length).padStart(2)}/${towns.length}  ${r.noun.padEnd(16)} ${r.face.pool} v${r.face.variant} f${r.face.face} [${r.face.tag}] annex:${r.face.line}${r.hits.length ? `  <- ${r.hits.join(', ')}` : ''}`);
  }
  const zero = rows.filter((r) => r.hits.length === 0).length;
  console.log(`\nfaces whose distinctive token no neighbouring page carries: ${zero}/${rows.length}`);
  console.log('\nPER FACE:');
  for (const r of nouns) {
    const row = rows.find((x) => x.face === r.face);
    console.log(`  ${r.face.pool} v${r.face.variant} f${r.face.face}: ${r.noun} (tf-idf ${r.score}) · ${row.hits.length}/${towns.length}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('prose-region-nouns.mjs')) await main();
