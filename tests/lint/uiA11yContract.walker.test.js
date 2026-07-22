/**
 * tests/lint/uiA11yContract.walker.test.js — Cycle-3 Wave 5 structural guard.
 *
 * Extends enforcer E-I (tests/ui/keyboardPlacement.test.jsx) at its recorded
 * blind spot: E-I proves ONE keyboard flow (map placement) round-trips, but
 * nothing stopped a NEW mouse-only control, a NEW hand-rolled focus trap, or a
 * NEW ad-hoc zIndex from landing. This walker sweeps src/components and holds
 * three born-empty registries (scripts/.ui-a11y-contract.json) that legislate
 * the stacking + keyboard-reachability + focus-trap classes so the Wave-5 fixes
 * cannot silently regress:
 *
 *   1. Z_LAYERS stacking manifest — every `zIndex: <n>` literal must resolve to
 *      a NAMED layer (or the local in-component band <= localCeil). Removes the
 *      habitat for the M10 collision (two persistent widgets sharing a z value).
 *   2. Keyboard-reachable — no TABBABLE interactive control (<button>/<Button>/
 *      <IconButton>) may be activated by onMouseDown alone (no onClick). This is
 *      the H12 (EntityPicker) / M9 (GalleryDescriptionEditor toolbar) class.
 *      Combobox options carry tabIndex={-1} (operated via their owning input),
 *      so they are not tab stops and are exempt.
 *   3. Single-writer focus trap — the modal focus-trap selector lives ONLY in
 *      the useDialogFocusTrap primitive. No component may hand-roll a trap
 *      (the M12/M13 class: TableView had none; GlossaryCard/InstitutionCard
 *      keyed theirs on the onClose identity and yanked focus on re-render).
 *
 * Each registry's allowlist is BORN EMPTY (the Wave-5 fixes cleared every
 * current violation); a future exception must be added deliberately, in review.
 *
 * GUARD-THE-GUARD (self-proving-meta, E-A): the three detectors are pure helpers
 * exercised below on synthetic broken/clean fixtures, so the mutation proof runs
 * on every suite — a silently-broken detector reds here, not in production.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const COMPONENTS = join(ROOT, 'src', 'components');
const contract = JSON.parse(readFileSync(join(ROOT, 'scripts/.ui-a11y-contract.json'), 'utf8'));

function walk(dir, exts, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some((x) => e.endsWith(x))) out.push(p);
  }
  return out;
}
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');
const componentFiles = walk(COMPONENTS, ['.jsx', '.js']).map((p) => ({ rel: rel(p), code: readFileSync(p, 'utf8') }));

// ── Detectors (pure; exercised on synthetic fixtures in guard-the-guard) ──────

const LAYER_VALUES = new Set(Object.values(contract.zLayers));
const zIndexResolves = (v) => v <= contract.zLayersLocalCeil || LAYER_VALUES.has(v);

// Extract the opening tag of each interactive control, tracking JSX-expression
// brace depth so a `>` inside a handler body doesn't end the tag early.
function interactiveOpeningTags(code) {
  const tags = [];
  const startRe = /<(button|Button|IconButton)(?=[\s/>])/g;
  let m;
  while ((m = startRe.exec(code)) !== null) {
    let depth = 0;
    let j = m.index + 1;
    for (; j < code.length; j++) {
      const ch = code[j];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (ch === '>' && depth === 0) break;
    }
    tags.push({ name: m[1], text: code.slice(m.index, j + 1) });
  }
  return tags;
}
const isTabbable = (tag) => !/tabIndex\s*=\s*\{?\s*['"]?-1/.test(tag);
const isMouseOnlyActivation = (tag) => /onMouseDown/.test(tag) && !/onClick/.test(tag) && isTabbable(tag);

// The distinctive middle of the shared FOCUSABLE trap selector. A component that
// embeds this is hand-rolling its own Tab-cycling trap.
const TRAP_SIGNATURE = 'button:not([disabled]),textarea:not([disabled])';
const TRAP_OWNER = 'src/components/primitives/useDialogFocusTrap.js';

// ── guard-the-guard: the detectors actually fire on broken fixtures ──────────
describe('guard-the-guard: the detectors are not vacuous', () => {
  test('zIndex resolver: local band + named layers resolve, an ad-hoc value does not', () => {
    expect(zIndexResolves(10)).toBe(true);                       // local band
    expect(zIndexResolves(contract.zLayers.modal)).toBe(true);   // a named layer
    expect(zIndexResolves(777)).toBe(false);                     // ad-hoc → flagged
  });

  test('mouse-only detector: flags mousedown-without-onClick, spares click + non-tabstops', () => {
    expect(isMouseOnlyActivation('<button onMouseDown={go}>')).toBe(true);
    expect(isMouseOnlyActivation('<button onMouseDown={go} onClick={go}>')).toBe(false);
    expect(isMouseOnlyActivation('<button role="option" tabIndex={-1} onMouseDown={go}>')).toBe(false);
    expect(isMouseOnlyActivation('<button onClick={go}>')).toBe(false);
  });

  test('tag extractor: a `>` inside a handler body does not end the tag early', () => {
    const tags = interactiveOpeningTags('<button onMouseDown={() => a > b} type="button">x</button>');
    expect(tags).toHaveLength(1);
    expect(tags[0].text.endsWith('type="button">')).toBe(true);
    expect(isMouseOnlyActivation(tags[0].text)).toBe(true);
  });

  test('trap-signature detector: fires on the selector, not on ordinary code', () => {
    expect(`x ${TRAP_SIGNATURE} y`.includes(TRAP_SIGNATURE)).toBe(true);
    expect("const x = 'a[href]';".includes(TRAP_SIGNATURE)).toBe(false);
  });
});

// ── 1. Z_LAYERS stacking manifest ────────────────────────────────────────────
describe('Z_LAYERS stacking manifest (M10 class)', () => {
  const layers = contract.zLayers;
  const values = Object.values(layers);
  const allow = new Set(contract.zLayersUnregisteredAllow);

  test('every layer maps to a DISTINCT value (a value->name lookup)', () => {
    expect(new Set(values).size).toBe(values.length);
  });

  test('every zIndex literal in src/components resolves to a manifest layer', () => {
    const unresolved = [];
    for (const { rel: file, code } of componentFiles) {
      const re = /zIndex:\s*(\d+)/g;
      let m;
      while ((m = re.exec(code)) !== null) {
        const v = Number(m[1]);
        if (zIndexResolves(v)) continue;
        if (allow.has(`${file}:${v}`)) continue;   // deliberately grandfathered
        unresolved.push(`${file}: zIndex ${v}`);
      }
    }
    expect(
      unresolved,
      `zIndex literal(s) resolve to no Z_LAYERS layer. Register the value in ` +
        `scripts/.ui-a11y-contract.json (zLayers) or, deliberately, in ` +
        `zLayersUnregisteredAllow:\n  ${unresolved.join('\n  ')}`,
    ).toEqual([]);
  });

  test('the unregistered-zIndex allowlist is born empty', () => {
    expect(contract.zLayersUnregisteredAllow).toEqual([]);
  });

  test('M10 is locked: the two bottom-right widgets sit on DISTINCT layers', () => {
    const zOf = (file) => Number(componentFiles.find((f) => f.rel === file).code.match(/zIndex:\s*(\d+)/)[1]);
    const coach = zOf('src/components/PostGenCoach.jsx');
    const feedback = zOf('src/components/FeedbackWidget.jsx');
    expect(coach).toBe(layers.coach);
    expect(feedback).toBe(layers.feedback);
    expect(coach).not.toBe(feedback);
  });
});

// ── 2. Keyboard-reachable: no mouse-only ACTIVATION ──────────────────────────
describe('keyboard-reachable: no tabbable control is activated by onMouseDown alone (H12/M9 class)', () => {
  const allow = new Set(contract.mousedownActivationAllow);
  const offenders = [];
  for (const { rel: file, code } of componentFiles) {
    if (allow.has(file)) continue;
    for (const { name, text } of interactiveOpeningTags(code)) {
      if (isMouseOnlyActivation(text)) offenders.push(`${file}: <${name}> has onMouseDown but no onClick`);
    }
  }

  test('no tabbable interactive control is mouse-only', () => {
    expect(
      offenders,
      `keyboard-inert control(s): a tabbable <button>/<Button>/<IconButton> is ` +
        `activated only by onMouseDown. Add an onClick (keyboard) path, or make ` +
        `it a non-tab-stop combobox option (tabIndex={-1}):\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  test('the mousedown-activation allowlist is born empty', () => {
    expect(contract.mousedownActivationAllow).toEqual([]);
  });
});

// ── 3. Single-writer focus trap ──────────────────────────────────────────────
describe('single-writer focus trap: only useDialogFocusTrap hand-rolls a trap (M12/M13 class)', () => {
  const allow = new Set(contract.handRolledTrapAllow);
  const carriers = walk(join(ROOT, 'src'), ['.js', '.jsx'])
    .map((p) => ({ rel: rel(p), code: readFileSync(p, 'utf8') }))
    .filter(({ code }) => code.includes(TRAP_SIGNATURE))
    .map(({ rel: r }) => r)
    .sort();

  test('the focus-trap selector lives only in the primitive', () => {
    const rogue = carriers.filter((f) => f !== TRAP_OWNER && !allow.has(f));
    expect(
      rogue,
      `hand-rolled focus trap(s) outside useDialogFocusTrap — route the modal ` +
        `through the primitive (keyed on \`open\`, onClose via a ref):\n  ${rogue.join('\n  ')}`,
    ).toEqual([]);
    expect(carriers).toContain(TRAP_OWNER); // the single writer must still exist
  });

  test('the hand-rolled-trap allowlist is born empty', () => {
    expect(contract.handRolledTrapAllow).toEqual([]);
  });
});
