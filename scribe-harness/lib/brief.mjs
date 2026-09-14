/**
 * lib/brief.mjs — THE HARNESS'S FILE READERS, AND NOTHING ELSE (W3a car 1; chair ruling 25).
 *
 * ⛔⛔ THIS FILE USED TO BUILD A SECOND PROMPT, AND THAT WAS THE DEFECT. It carried its own
 * `blockBrief`, its own `volatileTurn` and its own zod `UnitSchema` with a FLAT output shape
 * (`{stance, source, pair, text}`), while the product asked for the design's §3.2 shape
 * (`{blockId, poolKey, vid, spine, faces[], notebook[]}`). The 2026-09-14 simulation ran THIS
 * fork, so every figure the chair read — the refusal rate, the Q blanket, the four order losses —
 * was measured on a prompt the product would never send. A pilot that measures a different
 * prompt from the one that ships measures nothing.
 *
 * So the builders are gone from here. They live in `src/domain/prose/scribeBrief.js` in the dock,
 * the edge function imports them from the Deno bundle built out of that same file, and this
 * module re-exports them so the harness's own call sites do not change. What is left here is the
 * one thing a pure domain leaf may not do: READ FILES.
 *
 * ⛔ THE VOICE IS LIFTED VERBATIM FROM THE WORKFLOW, NEVER RETYPED. `rewrite-block-v3.workflow.js`
 * holds the law the whole corpus was cut under; a paraphrase here would be a SECOND law. It is
 * read out of that file's source at load time, and `lib/pin.mjs` asserts it is byte-equal to the
 * product's own transcription in `voice.ts`, so the two transcriptions cannot drift.
 *
 * ⛔ THE EXEMPLAR PACK IS READ FROM THE DOCK AND NEVER FROM THE KIT. `docs/content/scribe-
 * exemplar-pack.md` is the committed product copy and the one `exemplars.ts` is generated from;
 * reading the kit's own `rewrite/recut/EXEMPLAR-PACK.md` here would be a third copy of the pack
 * and would put a passage back in the prompt that the product copy deliberately paraphrases.
 */
import { readFileSync } from 'node:fs';

/** The kit, as an absolute path, so this runs from any cwd. */
export const KIT = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit';
export const DOCK = `${KIT}/lane-scribe`;

const WORKFLOW = `${KIT}/rewrite/rewrite-block-v3.workflow.js`;
const EXEMPLARS = `${DOCK}/docs/content/scribe-exemplar-pack.md`;
const LAW = `${DOCK}/docs/content/scribe-static-card.json`;
const VOICE_TS = `${DOCK}/supabase/functions/scribe-render/voice.ts`;

/** ⭐ THE ONE PROMPT, from the dock's own leaf. The bundle the edge function runs is built from
 * this exact file, and `tests/lint/scribeBundle.walker.test.js` pins the two byte-for-byte. */
const kernel = await import(`${DOCK}/src/domain/prose/scribeBrief.js`);

export const SCRIBE_OUTPUT_SCHEMA = kernel.SCRIBE_OUTPUT_SCHEMA;
export const buildScribeBrief = kernel.buildScribeBrief;
export const buildTownBlock = kernel.buildTownBlock;
export const buildScribeUserTurn = kernel.buildScribeUserTurn;
export const buildTier1Checklist = kernel.buildTier1Checklist;
export const parseScribeUnits = kernel.parseScribeUnits;
export const judgeUnits = kernel.judgeUnits;
export const TIER1_ANSWER_SCHEMA = kernel.TIER1_ANSWER_SCHEMA;
export const TIER1_QUESTIONS = kernel.TIER1_QUESTIONS;
export const applyTier1 = kernel.applyTier1;
export const tier1Lines = kernel.tier1Lines;

/** The path the pin and the readers agree on, exported so nothing spells it twice. */
export const PATHS = { WORKFLOW, EXEMPLARS, LAW, VOICE_TS };

/**
 * ⭐ THE VOICE, LIFTED VERBATIM. The constant is a single double-quoted JS string literal on one
 * line of the workflow, so it is read by locating `const VOICE = "` and taking the literal up to
 * its unescaped closing quote, then unescaping. A parse failure THROWS rather than falling back to
 * a paraphrase: a harness that silently invents the law is the one failure this file exists to
 * prevent.
 * @returns {string}
 */
export function voiceText() {
  const source = readFileSync(WORKFLOW, 'utf8');
  const at = source.indexOf('const VOICE = "');
  if (at < 0) throw new Error(`the VOICE constant is not in ${WORKFLOW}; the harness will not paraphrase it`);
  let i = at + 'const VOICE = "'.length;
  let out = '';
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') { out += source[i] + source[i + 1]; i += 2; continue; }
    if (ch === '"') break;
    out += ch;
    i += 1;
  }
  if (out.length < 500) throw new Error(`the VOICE read out of ${WORKFLOW} is ${out.length} chars, which is a truncation`);
  return JSON.parse(`"${out}"`);
}

/** The PRODUCT's own transcription of the VOICE, read the same way out of `voice.ts`. */
export function productVoiceText() {
  const source = readFileSync(VOICE_TS, 'utf8');
  const at = source.indexOf('export const SCRIBE_VOICE = "');
  if (at < 0) throw new Error(`SCRIBE_VOICE is not in ${VOICE_TS}`);
  let i = at + 'export const SCRIBE_VOICE = "'.length;
  let out = '';
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') { out += source[i] + source[i + 1]; i += 2; continue; }
    if (ch === '"') break;
    out += ch;
    i += 1;
  }
  return JSON.parse(`"${out}"`);
}

/** The exemplar pack, whole, from the DOCK's committed copy — the one the product ships. */
export function exemplarPack() {
  return readFileSync(EXEMPLARS, 'utf8');
}

/** The static card, which the card builder joins for the wiring, the reads and the fields. */
export function staticCard() {
  return JSON.parse(readFileSync(LAW, 'utf8'));
}
