/**
 * @vitest-environment jsdom
 *
 * surveyorProposalCard.test.jsx — SC-1B: THE SHARED TYPED-OP PROPOSAL CARD.
 *
 * One proposed op's review row was nested inside InterpretApplyPanel, which made it
 * unreachable for any other typed-op surface and untestable apart from the compile →
 * apply lane. ProposalCard is that row extracted VERBATIM in behavior: a CONTROLLED
 * presentation that renders the op and emits the NEXT decision, and nothing else — it
 * never compiles, validates, applies, tracks, charges, persists, or calls a provider.
 *
 * Pins here:
 *   A6 — decisions. The authored label / raw opType / params / classification badge
 *        render; approve, edit, reject and the edited op-type emit the exact controlled
 *        next decision with NO index argument; an unknown action normalizes to pending;
 *        the source op is never mutated; the accessible-copy overrides work and
 *        "dismiss" still maps to the existing internal 'reject'.
 *   A7 — the PROTECTED-CONSENT BARRIER survives the move: the protected badge, the
 *        identity note, and the existing consent sentence all render, and ticking
 *        consent emits ONLY `consented` — it never approves. The other half of A7 (an
 *        unchecked op stays blocked, a checked+approved one applies through the REAL
 *        writer) is pinned by tests/components/surveyorInterpretApplyPanel.test.jsx,
 *        which must pass UNCHANGED against the wired panel.
 *   A8 — the prevention guards. Source scans over src/components that keep the router
 *        single-homed in SurveyorDoor.jsx, keep the three typed-op action labels
 *        single-homed in ProposalCard.jsx, and keep the text-intent shell free of
 *        transport / store / destination / registry imports.
 *        THE SHELL GUARD IS A TOTAL POSITIVE PREDICATE, not a forbidden-list: an
 *        enumeration on the credit side fails open on the first spelling nobody
 *        thought of, and a `from`-only regex never sees a bare or dynamic import at
 *        all. The router scan carries no `.js`, because an extensionless specifier is
 *        a legal spelling this tree already uses. Each census carries a SENSITIVITY
 *        CONTROL — the invariant struck from its own carrier must collapse the census
 *        — because "the thing I searched for exists somewhere" is entailed by the
 *        assertion above it and can never fail.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { operationLabel } from '../../src/store/operationRegistry.js';
import { identityConsentNote } from '../../src/domain/intent/opVocabulary.js';
import ProposalCard from '../../src/components/surveyor/ProposalCard.jsx';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

afterEach(() => { cleanup(); });

const INFERRED_OP = Object.freeze({
  opType: 'applyEvent',
  family: 'canon_event',
  params: { name: 'Keld', magnitude: 2 },
  label: 'inferred',
  protectedFlags: [],
});

const PROTECTED_OP = Object.freeze({
  opType: 'remove_npc',
  family: 'canon_event',
  params: { id: 'npc-7' },
  label: 'required',
  protectedFlags: ['consent_required'],
});

/** Render the card controlled; `calls` records the FULL argument list of every emit. */
function renderCard(props = {}) {
  const calls = [];
  render(
    <ProposalCard
      id="op-0"
      op={INFERRED_OP}
      decision={undefined}
      onDecide={(...args) => calls.push(args)}
      {...props}
    />,
  );
  return calls;
}

const actionButton = (name) => screen.getByRole('button', { name });

describe('ProposalCard — A6: the controlled decision row', () => {
  it('renders the authored label, the raw opType, the params, and the classification badge', () => {
    renderCard();
    // Anti-vacuity: the authored label must DIFFER from the raw opType, or asserting
    // both would be one assertion wearing two hats.
    expect(operationLabel('applyEvent')).toBe('Apply an event');
    const card = screen.getByTestId('op-0');
    expect(card.textContent).toContain('Apply an event');
    expect(card.textContent).toContain('applyEvent');
    expect(card.textContent).toContain('name');
    expect(card.textContent).toContain('Keld');
    expect(card.textContent).toContain('magnitude');
    expect(card.textContent).toMatch(/inferred/i);
    // An unprotected op shows no barrier. The annotation must sit on the line
    // IMMEDIATELY above the assertion for the anchor walker to read it.
    // anchored: the five toContain assertions above read this SAME card.textContent, so a card that rendered nothing could not have reached this line.
    expect(card.textContent).not.toMatch(/protected/i);
    expect(screen.queryByLabelText(/consent to the protected op/i)).toBeNull();
  });

  it('approve / edit / reject each emit ONE next decision — shallow-copied, index-free', () => {
    const calls = renderCard({ decision: { consented: true } });
    fireEvent.click(actionButton('Approve this op'));
    expect(calls.at(-1)).toEqual([{ consented: true, action: 'approve' }]);
    fireEvent.click(actionButton('Edit this op'));
    expect(calls.at(-1)).toEqual([{ consented: true, action: 'edit' }]);
    fireEvent.click(actionButton('Reject this op'));
    expect(calls.at(-1)).toEqual([{ consented: true, action: 'reject' }]);
    expect(calls).toHaveLength(3);
    // Every emit carries exactly one argument: the caller closes over the index.
    for (const args of calls) expect(args).toHaveLength(1);
  });

  it('the edit action surfaces the op-type input, seeded from the op, and emits editedType', () => {
    const calls = renderCard({ decision: { action: 'edit' } });
    const input = screen.getByLabelText('Edit op type');
    expect(input.value).toBe('applyEvent');
    fireEvent.change(input, { target: { value: 'applyEventBatch' } });
    expect(calls.at(-1)).toEqual([{ action: 'edit', editedType: 'applyEventBatch' }]);
  });

  it('an unrecognized action normalizes to pending — nothing pressed, no edit field', () => {
    renderCard({ decision: { action: 'banish' } });
    // The normalized value itself, not just its side effects: an unrecognized action
    // renders identically to pending everywhere else, so asserting only the buttons
    // would pass against a card that never normalized at all.
    expect(screen.getByTestId('op-0').getAttribute('data-action')).toBe('pending');
    for (const name of ['Approve this op', 'Edit this op', 'Reject this op']) {
      expect(actionButton(name).getAttribute('aria-pressed')).toBe('false');
    }
    expect(screen.queryByLabelText('Edit op type')).toBeNull();
    // Anti-vacuity: a RECOGNIZED action passes through unchanged, so the assertion
    // above is not just reading a hard-coded constant.
    cleanup();
    renderCard({ decision: { action: 'approve' } });
    expect(screen.getByTestId('op-0').getAttribute('data-action')).toBe('approve');
  });

  it('never mutates the source op', () => {
    const snapshot = JSON.parse(JSON.stringify(INFERRED_OP));
    const calls = renderCard({ decision: { action: 'edit' } });
    fireEvent.click(actionButton('Approve this op'));
    fireEvent.change(screen.getByLabelText('Edit op type'), { target: { value: 'somethingElse' } });
    fireEvent.click(actionButton('Reject this op'));
    expect(calls.length).toBeGreaterThan(0);
    expect(INFERRED_OP).toEqual(snapshot);
  });

  it('accessible-copy overrides rename the controls; "dismiss" still maps to reject', () => {
    const calls = renderCard({ labels: { approve: 'Stamp it', edit: 'Amend it', dismiss: 'File it away' } });
    expect(actionButton('Stamp it')).toBeTruthy();
    expect(actionButton('Amend it')).toBeTruthy();
    fireEvent.click(actionButton('File it away'));
    // The DOMAIN enum is untouched — only the accessible copy moved.
    expect(calls.at(-1)).toEqual([{ action: 'reject' }]);
  });
});

describe('ProposalCard — A7: the protected-consent barrier survives the extraction', () => {
  it('renders the protected badge, the identity note, and the existing consent sentence', () => {
    renderCard({ op: PROTECTED_OP, id: 'op-3' });
    const card = screen.getByTestId('op-3');
    expect(card.textContent).toMatch(/protected/i);
    const note = identityConsentNote(PROTECTED_OP);
    // Anti-vacuity: this op MUST have an identity note, or the assertion below proves nothing.
    expect(note).toBeTruthy();
    expect(card.textContent).toContain(note);
    expect(card.textContent).toContain('This op touches a protected constraint. Tick to consent, or it will not apply.');
    expect(screen.getByLabelText(`Consent to the protected op ${operationLabel('remove_npc')}`)).toBeTruthy();
  });

  it('ticking consent emits ONLY consented — it never approves', () => {
    const calls = renderCard({ op: PROTECTED_OP, id: 'op-3', decision: { action: 'reject' } });
    fireEvent.click(screen.getByLabelText(/consent to the protected op/i));
    expect(calls.at(-1)).toEqual([{ action: 'reject', consented: true }]);
  });

  it('an explicit protectedFlags prop overrides the op field (absent ⇒ the op decides)', () => {
    // A prop-carried flag protects an op whose OWN field is empty …
    renderCard({ protectedFlags: ['consent_required'] });
    const withFlags = screen.getByTestId('op-0').textContent;
    cleanup();
    // … and an EMPTY prop unprotects an op whose own field is not. The two halves are one
    // TRANSITION, so the absence is anchored by the presence that precedes it: a card that
    // stopped rendering the badge at all reds on the first half instead of passing the second.
    renderCard({ op: PROTECTED_OP, protectedFlags: [] });
    expectPresentThenAbsent(
      withFlags,
      screen.getByTestId('op-0').textContent,
      'protected',
      'protectedFlags prop override',
    );
  });
});

// ── A8: the prevention guards ────────────────────────────────────────────────
const ROOT = resolve(process.cwd());
const COMPONENTS = join(ROOT, 'src', 'components');

function walkComponents(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkComponents(p, out);
    else if (/\.jsx?$/.test(entry)) out.push(p);
  }
  return out;
}
const componentSources = walkComponents(COMPONENTS).map((p) => ({
  rel: relative(ROOT, p).replace(/\\/g, '/'),
  code: readFileSync(p, 'utf8'),
}));

const SHELL = 'src/components/surveyor/SurveyorTextIntentShell.jsx';
const CARD = 'src/components/surveyor/ProposalCard.jsx';
const shellSource = componentSources.find((f) => f.rel === SHELL);

/**
 * Every module specifier a source file can reach: `from '…'`, a BARE side-effect
 * `import '…'`, a dynamic `import('…')`, and `require('…')`. A `from`-only scan is
 * blind to the last three — the shell's own CSS import is a live example of the
 * shape it misses — which is how an import guard silently fails open.
 */
const SPECIFIER_RE = /(?:from|import|require)\s*\(?\s*['"]([^'"]+)['"]/g;
const specifiersOf = (code) => [...code.matchAll(SPECIFIER_RE)].map((m) => m[1]);

/**
 * The shell's COMPLETE import set. This is a TOTAL POSITIVE predicate, not a
 * forbidden-list: an enumeration on the credit side fails open on the one spelling
 * nobody thought of (`'../../store'` without a trailing slash is this repo's own
 * idiom, and it slips a blacklist that keys on `/store/`). Adding any module here is
 * a deliberate review act; the shell may not grow a transport, store, destination
 * panel, or registry reach without this line changing first.
 */
const SHELL_IMPORTS = Object.freeze([
  'react',
  '../../copy/index.js',
  '../theme.js',
  '../primitives/Button.jsx',
  '../primitives/IconButton.jsx',
  './surveyorPanelKit.jsx',
  '../../hooks/useIsMobile.js',
  '../../styles/surveyorChat.css',
]);

describe('ProposalCard — A8: the prevention guards', () => {
  it('the census is not empty (a source scan over nothing is a vacuous guard)', () => {
    expect(componentSources.length).toBeGreaterThan(100);
    expect(shellSource, `${SHELL} must exist for the shell guard to mean anything`).toBeTruthy();
  });

  it('ONE ROUTER SURFACE: only SurveyorDoor.jsx reaches routeDoorPrompt / the doorRouter module', () => {
    // The module token carries NO extension: `import * as door from '…/doorRouter'` is a
    // legal spelling this tree already uses elsewhere for relative specifiers, and a
    // `doorRouter\.js` pattern lets it through while the invariant it names is violated.
    const reachers = componentSources
      .filter((f) => /routeDoorPrompt|doorRouter/.test(f.code))
      .map((f) => f.rel)
      .sort();
    expect(reachers).toEqual(['src/components/surveyor/SurveyorDoor.jsx']);
    // SENSITIVITY CONTROL: strike the router reach from the one legitimate carrier and the
    // census must collapse — proving this predicate measures the code rather than matching
    // everything (and that it would name a SECOND carrier if one appeared).
    const struck = componentSources.map((f) => (f.rel === 'src/components/surveyor/SurveyorDoor.jsx'
      ? { ...f, code: f.code.split('routeDoorPrompt').join('«x»').split('doorRouter').join('«x»') }
      : f));
    expect(struck.filter((f) => /routeDoorPrompt|doorRouter/.test(f.code))).toEqual([]);
  });

  it('ONE TYPED-OP ACTION TRIO: only ProposalCard.jsx carries all three action labels', () => {
    const LABELS = ['Approve this op', 'Edit this op', 'Reject this op'];
    const carriers = componentSources
      .filter((f) => LABELS.every((l) => f.code.includes(l)))
      .map((f) => f.rel)
      .sort();
    expect(carriers).toEqual([CARD]);
    // SENSITIVITY CONTROL: "each label exists somewhere" is entailed by the assertion
    // above and can never fail — a tautology wearing a negative control's clothes.
    // Strike ONE label from the card instead: the carrier set must collapse to empty,
    // which proves the trio predicate discriminates.
    const struck = componentSources.map((f) => (f.rel === CARD
      ? { ...f, code: f.code.split(LABELS[0]).join('«x»') }
      : f));
    expect(struck.filter((f) => LABELS.every((l) => f.code.includes(l)))).toEqual([]);
  });

  it('THE SHELL IS PRESENTATION: its import set is an EXACT allowlist, not a blacklist', () => {
    const specs = specifiersOf(shellSource.code);
    // TOTAL POSITIVE PREDICATE. A forbidden-list guard fails open twice over: it never
    // sees a bare or dynamic import at all, and it misses any spelling not enumerated.
    // An exact set closes both — no transport, store, destination panel, or registry can
    // enter the shell without this allowlist changing in the same review.
    expect([...new Set(specs)].sort()).toEqual([...SHELL_IMPORTS].sort());
    // Negative controls: the scan really sees the BARE side-effect import (the shape a
    // `from`-only regex is blind to), and the shell reads the ONE shared viewport
    // authority rather than standing up a second width listener.
    expect(specs).toContain('../../styles/surveyorChat.css');
    expect(specs).toContain('../../hooks/useIsMobile.js');
    expectAbsentWithAnchor(shellSource.code, 'routeDoorPrompt', 'useIsMobile', 'shell router reach');
  });
});
