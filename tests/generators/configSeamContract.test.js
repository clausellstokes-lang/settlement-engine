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
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = process.cwd();
const read = (rel) => (existsSync(resolve(ROOT, rel)) ? readFileSync(resolve(ROOT, rel), 'utf-8') : '');

// ── The UI writers: config keys stamped via updateConfig({ … }) ──────────────
const UI_WRITERS = ['src/components/GenerateWizard.jsx', 'src/components/ConfigurationPanel.jsx'];
function writtenConfigKeys() {
  const keys = new Set();
  for (const f of UI_WRITERS) {
    const src = read(f);
    // Each updateConfig({ … }) object literal (allowing a leading `isRandom ? …` and
    // ONE level of nested braces for values like { ...state, [k]: v }).
    const callRe = /updateConfig\(\s*(?:[^)?]*\?\s*)?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let m;
    while ((m = callRe.exec(src))) {
      // Top-level object keys: `ident:` (skip computed `[expr]:` — those are dynamic
      // priority-slider writes whose literal names appear in the arc-preset write).
      const keyRe = /(?:^|[,{]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
      let k;
      while ((k = keyRe.exec(m[1]))) keys.add(k[1]);
    }
  }
  return keys;
}

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
function readConfigKeys() {
  const keys = new Set();
  const dotRe = new RegExp(`(?:${CFG_ALIASES})\\.([a-zA-Z_][a-zA-Z0-9_]*)`, 'g');
  const destructRe = new RegExp(`\\{([^{}]+)\\}\\s*=\\s*(?:${CFG_ALIASES})\\b`, 'g');
  for (const file of walkJs(resolve(ROOT, 'src/generators'))) {
    const src = readFileSync(file, 'utf-8');
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
    const dropped = [...written].filter((k) => !read_.has(k) && !(k in NON_PIPELINE_KEYS));
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
});
