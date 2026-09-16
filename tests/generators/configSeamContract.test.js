/**
 * configSeamContract.test.js — the UI-writer ⇒ pipeline-reader config seam
 * (survey structural-walker prescription; the class G2 fixed instance-by-instance).
 *
 * The generation wizard writes a `config` object; the deterministic pipeline reads
 * it. When a UI writer stamps a config key that NO pipeline reader consumes, the
 * user's intent is SILENTLY DROPPED — the exact class G2 chased down one key at a
 * time (categoryToggles vocabulary, terrain roll gating, …). This walker turns that
 * class into a structural invariant: every config key the wizard writes must be read
 * by the generator pipeline, OR be listed in the documented allowlist below (a key
 * consumed OUTSIDE the deterministic pipeline — the store/finalization). A new
 * wizard key with no reader reds here, forcing a reader or a documented exception.
 *
 * This is a source WALKER, not a runtime test: it scans the writer + reader source
 * so the seam is pinned even when no fixture happens to exercise the key.
 *
 * NO LONGER a blind spot (2026-09-01, the COUPLED consist's landing): both
 * detectors scanned RAW source, and in THIS direction that defect is SILENT --
 * a config key merely NAMED in a comment or a string counted as a pipeline
 * READ, so a prose mention could clear a key that no code consumes and HIDE the
 * very G2 silent drop this walker exists to convict. (Its twin,
 * tests/generators/configPatchAllowlistWalker.test.js, shares this alias
 * vocabulary and these regexes verbatim, and the same defect convicted THERE on
 * a docblock citing `vite.config.js` -- a censused config key named `js`.) Both
 * detectors now run the estate's ONE shared strip, tests/helpers/codeOnlySource.js
 * (`codeOnly`), over each source text before any regex, and the strip is applied
 * INSIDE these functions so the STANDING CONTROL below drives the stripped path
 * too. MEASURED at the cure: the reader census falls 75 -> 72 at the landing tip
 * and 73 -> 72 at the landing base 60255ca8e with the two stripped sets
 * IDENTICAL; UI writers hold at 17; `dropped` and `stale` stay []. The class: a
 * detector making a USE claim must read CODE.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = process.cwd();
const read = (rel) => (existsSync(resolve(ROOT, rel)) ? readFileSync(resolve(ROOT, rel), 'utf-8') : '');

// ── The UI writers: config keys stamped via updateConfig({ … }) ──────────────
const UI_WRITERS = ['src/components/GenerateWizard.jsx', 'src/components/ConfigurationPanel.jsx'];

/**
 * The writer-side detector, over SOURCE TEXTS rather than paths — so the standing
 * control at the bottom can drive THIS function over a doctored copy instead of
 * re-implementing it. (ODQ 764.2, lane T9: this file was one of the five
 * `kind:"uncovered"` seam contracts, green with nothing proving it could red.)
 */
function writtenConfigKeysIn(sources) {
  const keys = new Set();
  for (const raw of sources) {
    // Comments and string CONTENTS blanked before the scan; template
    // interpolations survive, so the standing control's plants are still code.
    const src = codeOnly(raw);
    // Each updateConfig({ … }) object literal (allowing a leading `isRandom ? …` and
    // ONE level of nested braces for values like { ...state, [k]: v }).
    const callRe = /updateConfig\(\s*(?:[^)?]*\?\s*)?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let m;
    while ((m = callRe.exec(src))) {
      // Top-level object keys: `ident:` (skip computed `[expr]:` — those are dynamic
      // priority-slider writes whose literal names appear in the arc-preset write).
      // ⚠ THE LEADING `^\s*` IS LOAD-BEARING AND WAS MISSING (lane T9, found by the
      // standing control below on its first run). The outer callRe consumes the
      // opening brace, so m[1] begins with the whitespace before the FIRST key; a
      // bare `^` could never match it, and only keys preceded by a comma were ever
      // seen. Measured at the cure: the live key set is IDENTICAL either way (17 and
      // 17), because every first key today also appears after a comma in some other
      // literal — so the hole had cost nothing YET. A new wizard key written as the
      // sole or first key of its own updateConfig call would have been invisible to
      // the exact walker built to catch it.
      const keyRe = /(?:^\s*|[,{]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
      let k;
      while ((k = keyRe.exec(m[1]))) keys.add(k[1]);
    }
  }
  return keys;
}
const writerSources = () => UI_WRITERS.map(read);
const writtenConfigKeys = () => writtenConfigKeysIn(writerSources());

// ── The pipeline readers: config-like accessors across src/generators/** ─────
// Readers destructure/alias config under several names (config / effectiveConfig /
// cfg / resolvedConfig / …); the seam is the KEY vocabulary, not the variable name.
const CFG_ALIASES = 'config|effectiveConfig|cfg|resolvedConfig|resolved|baseConfig|fullConfig';
function walkJs(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkJs(full, acc);
    else if (name.endsWith('.js')) acc.push(full);
  }
  return acc;
}
/** The reader-side detector, over SOURCE TEXTS — same reason as its writer twin. */
function readConfigKeysIn(sources) {
  const keys = new Set();
  const dotRe = new RegExp(`(?:${CFG_ALIASES})\\.([a-zA-Z_][a-zA-Z0-9_]*)`, 'g');
  const destructRe = new RegExp(`\\{([^{}]+)\\}\\s*=\\s*(?:${CFG_ALIASES})\\b`, 'g');
  for (const raw of sources) {
    // The same strip as the writer twin: a key cited in prose is not a reader.
    const src = codeOnly(raw);
    let m;
    while ((m = dotRe.exec(src))) keys.add(m[1]);
    while ((m = destructRe.exec(src))) {
      for (const part of m[1].split(',')) {
        const name = part.split(':')[0].split('=')[0].trim().replace(/\.\.\./, '');
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) keys.add(name);
      }
    }
  }
  return keys;
}
const readerSources = () => walkJs(resolve(ROOT, 'src/generators')).map((f) => readFileSync(f, 'utf-8'));
const readConfigKeys = () => readConfigKeysIn(readerSources());

/** The seam verdict itself, so the live arm and the control share one comparator. */
const droppedKeys = (written, read_, exceptions) =>
  [...written].filter((k) => !read_.has(k) && !(k in exceptions));

// Config keys the wizard writes that are DELIBERATELY consumed OUTSIDE the
// deterministic generator pipeline (the store / finalization), not by a generator
// step. Each must be justified — this list is the documented seam exception.
const NON_PIPELINE_KEYS = {
  // A boolean content-mode flag read by the STORE (settlementSlice gates AI/custom
  // content on state.config.useCustomContent), never by a deterministic generator
  // step — so it is legitimately absent from the generator config-key vocabulary.
  useCustomContent: 'store content-mode gate (settlementSlice), not a generator config key',
};

describe('config seam — every wizard-written config key has a pipeline reader (G2 class walker)', () => {
  it('self-check: the walker actually found writers and readers (not vacuous)', () => {
    expect(writtenConfigKeys().size).toBeGreaterThan(8);
    expect(readConfigKeys().size).toBeGreaterThan(8);
  });

  it('no wizard config key is silently dropped by the pipeline', () => {
    const written = writtenConfigKeys();
    const read_ = readConfigKeys();
    const dropped = droppedKeys(written, read_, NON_PIPELINE_KEYS);
    expect(
      dropped,
      `Wizard writes config ${dropped.join(', ')} but NO src/generators reader consumes it — `
        + 'the G2 silent-drop class. Add a pipeline reader, or add the key to NON_PIPELINE_KEYS '
        + 'with a one-line rationale if it is consumed outside the deterministic pipeline.',
    ).toEqual([]);
  });

  it('every NON_PIPELINE_KEYS exception is still actually written by the wizard (no stale entries)', () => {
    const written = writtenConfigKeys();
    const stale = Object.keys(NON_PIPELINE_KEYS).filter((k) => !written.has(k));
    expect(stale, `stale seam exceptions (no longer written by the wizard): ${stale.join(', ')}`).toEqual([]);
  });

  // ── THE STANDING CONTROL (ODQ 764.2) ───────────────────────────────────────
  // The non-vacuity self-check above proves the two detectors found SOMETHING; it
  // does not prove the seam verdict can convict. Both halves of this walker are
  // regexes over source text, and a regex that has rotted to matching a smaller
  // vocabulary makes the drop list shorter, never longer — so the walker's failure
  // mode is silence. The control drives the SAME three functions the live arms
  // drive, over a DOCTORED IN-MEMORY COPY of the real writer and reader sources
  // (never a file on disk), and asserts the conviction lands by name.
  it('THE PLANTED CONTROL: a wizard key with no reader is convicted, and a reader clears it', () => {
    const PLANTED = 'aKeyNoPipelineReaderConsumes';
    const writers = writerSources();
    const readers = readerSources();
    expect(writers.some((s) => s.includes('updateConfig(')), 'the writer corpus lost its subject').toBe(true);

    // The plant is a real writer idiom appended to a real writer source.
    const doctoredWriters = [...writers, `updateConfig({ ${PLANTED}: 1 });`];
    const writtenWithPlant = writtenConfigKeysIn(doctoredWriters);
    expect(writtenWithPlant.has(PLANTED), 'the writer detector did not even see the plant').toBe(true);

    const read_ = readConfigKeysIn(readers);
    expect(droppedKeys(writtenWithPlant, read_, NON_PIPELINE_KEYS)).toEqual([PLANTED]);

    // …and the cure clears it: give the planted key a pipeline reader.
    const doctoredReaders = [...readers, `const x = config.${PLANTED};`];
    expect(
      droppedKeys(writtenWithPlant, readConfigKeysIn(doctoredReaders), NON_PIPELINE_KEYS),
    ).toEqual([]);

    // …and so does the documented exception, the walker's other legitimate exit.
    // (Merged, not substituted: replacing the register outright resurfaces the real
    // `useCustomContent` exception — which this control's first draft did, and the
    // walker was right to say so.)
    expect(
      droppedKeys(writtenWithPlant, read_, { ...NON_PIPELINE_KEYS, [PLANTED]: 'planted' }),
    ).toEqual([]);

    // DISCRIMINATION: undoctored, the verdict is silent — so the conviction above
    // is the plant's doing and not a walker that convicts everything.
    expect(droppedKeys(writtenConfigKeysIn(writers), read_, NON_PIPELINE_KEYS)).toEqual([]);
  });
});
