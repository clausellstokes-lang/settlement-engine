/**
 * dialogExit.walker.test.js — EVERY POP-UP HAS A DOOR (owner order, ODQ §934.31: "when
 * clicking feedback and support, there should be an exit button to the pop up").
 *
 * ── THE CLASS ──────────────────────────────────────────────────────────────────
 * The owner opened Feedback & support and could not find the way out. There WAS a
 * control — a 24px ghost icon-only button — but the panel had no Escape, no focus
 * restore, and the × read as decoration. Curing that one panel would have left the class
 * alive, because the exit was never a rule: thirty surfaces in this tree render
 * `role="dialog"` and each had invented its own door. Five had no Escape at all. Seven
 * had no control a reader could name: the command palette had none whatsoever, the
 * dossier ladder's only exit was a ghost button below the fold of a scrolling purchase
 * list, and the gathered-docket dialog's button RENAMED ITSELF with the row count
 * ("Close" / "Set the rest aside"). A door drawn differently in every room cannot be
 * learned.
 *
 * ── THE LAW, AND IT HAS NO EXEMPTION LIST ──────────────────────────────────────
 * Every file that renders a `role="dialog"` must have BOTH:
 *
 *   1. A LABELLED CLOSE CONTROL whose accessible name contains the word "Close". The
 *      name may say what is being closed ("Close the import"); it may not rename the
 *      verb, because that word is what a reader and a screen-reader user both look for.
 *      Resolved through `aria-label`, through the estate's `label=` prop (IconButton /
 *      DialogClose), and THROUGH COPY KEYS — `label={t('common.close')}` is a close
 *      control, and a walker that could not read it would have convicted four compliant
 *      dialogs and taught the next author to inline the string.
 *
 *   2. AN ESCAPE-AND-FOCUS LIFECYCLE, from one of the two shared hooks:
 *        `useDialogFocusTrap` — a MODAL dialog: focus-in, Tab trapped, Escape, restore.
 *        `useDialogDismiss`   — a NON-MODAL popover: Escape and restore, no trap.
 *      ⛔ THE SECOND IS A TYPE, NOT AN EXEMPTION. Both give Escape and focus restoration;
 *      what differs is whether the surface claims the page is inert. The feedback panel
 *      and the post-generate coach do not claim that and must not trap, or a reader who
 *      opened a hint about a dossier could no longer reach the dossier.
 *      A presentation-only shell that receives its `dialogRef` FROM its mount satisfies
 *      this through that mount, and the walker follows the join to prove the supplier
 *      really calls a hook — it does not take the prop's word for it.
 *
 * ── WHAT IS NOT A DIALOG ───────────────────────────────────────────────────────
 * `[role="dialog"]` inside brackets is a CSS SELECTOR, not a rendered attribute —
 * WorldMap.jsx queries for open dialogs to keep its map keymap quiet while one owns
 * focus. Convicting it would have been a false positive that the next author silenced
 * with an exemption, which is how an exemption list starts.
 *
 * @enforced-by itself (the executed controls below prove the detector both ways)
 */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { en } from '../../src/copy/en.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** A rendered JSX role="dialog" — never the bracketed CSS-selector form. */
const RENDERS_DIALOG = /(?<!\[)role\s*=\s*(?:"dialog"|\{\s*['"]dialog['"]\s*\})/;
/** The two shared lifecycle hooks. Either satisfies Escape + focus restoration. */
const LIFECYCLE = /useDialogFocusTrap|useDialogDismiss/;
/** A component that is handed its dialog node by whatever mounts it. */
const TAKES_REF = /\bdialogRef\b/;

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(name) && !/\.test\./.test(name)) out.push(p);
  }
  return out;
}

/** Resolve a dotted copy key against `en`; undefined when it names nothing. */
function resolveCopy(dotted) {
  let cur = /** @type {any} */ (en);
  for (const part of dotted.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return typeof cur === 'string' ? cur : undefined;
}

/**
 * Every accessible name this source gives a control, with copy keys RESOLVED.
 * Reads `aria-label=` and the estate's `label=` prop (IconButton / DialogClose),
 * in string, template and `t('…')` form.
 * @param {string} code comment-stripped source
 */
export function accessibleNames(code) {
  const names = [];
  const attr = /(?:aria-label|label)\s*=\s*(?:"([^"]*)"|\{\s*`([^`]*)`\s*\}|\{\s*t\(\s*['"]([^'"]+)['"]\s*\)\s*\})/g;
  let m;
  while ((m = attr.exec(code)) !== null) {
    if (m[1] != null) names.push(m[1]);
    else if (m[2] != null) names.push(m[2]);
    else if (m[3] != null) {
      const copy = resolveCopy(m[3]);
      if (copy) names.push(copy);
    }
  }
  // DialogClose IS the house close control; its name is fixed inside the primitive, so
  // a call site that renders it never has to spell the word.
  if (/<DialogClose\b/.test(code)) names.push('Close');
  return names;
}

const hasCloseName = (code) => accessibleNames(code).some((n) => /\bclose\b/i.test(n));

/** Every source file, repo-relative. */
const FILES = walk(SRC).map((p) => relative(ROOT, p).replace(/\\/g, '/')).sort();
const CODE = new Map(FILES.map((rel) => [rel, stripComments(readFileSync(join(ROOT, rel), 'utf8'))]));

/** The files that actually RENDER a dialog. */
const DIALOGS = FILES.filter((rel) => RENDERS_DIALOG.test(CODE.get(rel)));

/** Who passes `dialogRef=` to a component, and does that file own a lifecycle hook? */
function refSuppliedByALiveHook(rel) {
  const base = rel.split('/').pop().replace(/\.jsx?$/, '');
  const mount = new RegExp(`<${base}\\b[\\s\\S]{0,600}?dialogRef\\s*=`);
  for (const other of FILES) {
    if (other === rel) continue;
    const code = CODE.get(other);
    if (mount.test(code) && LIFECYCLE.test(code)) return other;
  }
  return null;
}

describe('every pop-up has a door (ODQ §934.31)', () => {
  it('the walk is live: the tree parsed and dialogs were found', () => {
    // Both arms below are satisfied by a scanner that found nothing, which is what a
    // moved tree or a broken regex produces. Measured at landing: 2,231 files, 29 rendered
    // dialogs. Floors tighten toward reality and are never relaxed to admit a budget.
    expect(FILES.length, 'the src tree is empty — has it moved?').toBeGreaterThanOrEqual(2200);
    expect(DIALOGS.length, 'no rendered dialog was found — the role attribute shape changed')
      .toBeGreaterThanOrEqual(25);
  });

  it('every rendered dialog has a close control whose name says "Close"', () => {
    const doorless = DIALOGS.filter((rel) => !hasCloseName(CODE.get(rel)));
    expect(
      doorless,
      '\nDialog(s) with no labelled exit. A reader must be able to SEE the way out, and a'
      + ' screen-reader user must hear the same word every other dialog uses. Render'
      + ' <DialogClose onClose={…} /> (src/components/primitives/DialogClose.jsx) in the'
      + " header — it fixes the label, the × text twin and the 44×44 phone target:\n"
      + `  ${doorless.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('every rendered dialog closes on Escape and hands focus back', () => {
    const unwired = [];
    for (const rel of DIALOGS) {
      const code = CODE.get(rel);
      if (LIFECYCLE.test(code)) continue;
      if (TAKES_REF.test(code) && refSuppliedByALiveHook(rel)) continue;
      unwired.push(rel);
    }
    expect(
      unwired,
      '\nDialog(s) with no Escape / focus-restore lifecycle. Call useDialogFocusTrap when'
      + ' the surface is MODAL (it also traps Tab) or useDialogDismiss when it is a'
      + ' non-modal popover that must leave the page reachable. A close button that works'
      + " while Escape does not is half a door:\n"
      + `  ${unwired.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('a shell that borrows its ref really is supplied by a live hook (the join is checked)', () => {
    const borrowers = DIALOGS.filter((rel) => !LIFECYCLE.test(CODE.get(rel)) && TAKES_REF.test(CODE.get(rel)));
    for (const rel of borrowers) {
      const supplier = refSuppliedByALiveHook(rel);
      expect(supplier, `${rel} takes a dialogRef but nothing that mounts it calls a lifecycle hook`).toBeTruthy();
    }
    // anchored: the borrower class is real on this tree (the Surveyor's door shell), so
    // the loop above is not walking an empty list and calling that agreement.
    expect(borrowers.length).toBeGreaterThanOrEqual(1);
  });

  it('the house close control is ONE primitive, not twenty', () => {
    const primitive = CODE.get('src/components/primitives/DialogClose.jsx');
    expect(primitive, 'the house close control is gone').toBeTruthy();
    expect(primitive, 'DialogClose must fix the verb itself').toMatch(/['"`]Close['"`]|`Close \$\{/);
    expect(primitive, 'DialogClose must render the × text twin so icons-off keeps the door')
      .toMatch(/glyph="×"/);
  });
});

describe('guard-the-guard: the detector convicts and acquits on planted sources', () => {
  it('a rendered role="dialog" is found; the CSS-SELECTOR form is NOT', () => {
    expect(RENDERS_DIALOG.test('<div role="dialog" aria-modal="true">')).toBe(true);
    expect(RENDERS_DIALOG.test("document.querySelector('[role=\"dialog\"][aria-modal=\"true\"]')")).toBe(false);
  });

  it('an accessible name is read from aria-label, label=, a template and a copy key', () => {
    expect(accessibleNames('<b aria-label="Close" />')).toEqual(['Close']);
    expect(accessibleNames('<IconButton label="Close import" />')).toEqual(['Close import']);
    expect(accessibleNames('<IconButton label={`Close ${title}`} />')).toEqual(['Close ${title}']);
    // The copy key really is resolved against en, not pattern-matched on its spelling.
    expect(accessibleNames("<IconButton label={t('common.close')} />")).toEqual(['Close']);
    expect(accessibleNames("<IconButton label={t('no.such.key')} />")).toEqual([]);
  });

  it('a close-less dialog is convicted and a cured one is acquitted', () => {
    const doorless = '<section role="dialog"><h2>Hi</h2></section>';
    const cured = '<section role="dialog"><DialogClose onClose={x} /></section>';
    expect(hasCloseName(doorless)).toBe(false);
    expect(hasCloseName(cured)).toBe(true);
    // A control named with a DIFFERENT verb is not a door this law recognises — that is
    // the "Dismiss" / "Set the rest aside" class the order was raised about.
    expect(hasCloseName('<IconButton label="Dismiss" />')).toBe(false);
  });

  it('a comment mentioning a dialog is not a dialog', () => {
    const code = stripComments('// every house dialog renders role="dialog"\nexport const A = 1;');
    expect(RENDERS_DIALOG.test(code)).toBe(false);
  });
});
