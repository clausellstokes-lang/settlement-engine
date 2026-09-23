/** @vitest-environment jsdom */
/**
 * decreeRegistryPage.test.jsx — EM-D3's TEN arms over the registry page,
 * `DecreeRegistryPage`.
 *
 * ⭐ WRITTEN AND RUN BEFORE THE LEAF EXISTED. With the leaf absent this file cannot even
 * collect, so no arm here was ever green before its subject was built; the build re-proves
 * it by PLANT-AND-RESTORE (the leaf moved aside, the suite red by its own collect error,
 * the file restored byte-identically by sha256) and quotes the count line.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S ANSWER. The registry under test is built by EM-C1's
 * OWN verbs (`stage`, `markApplied`, `withdraw`); the moves and the withdrawal are driven
 * through EM-C4b's OWN store actions over a live get/set pair, so the arms watch the real
 * registry move rather than a spy's argument; the guards come from EM-C4b's OWN
 * `selectGuards` over EM-C2's engine with a rule set supplied at the engine's declared seam;
 * the realm rung is read from the copy registry; and the rewind's number is PARSED from the
 * estate's own `PULSE_UNDO_CAP`. A fixture that mirrored a producer could agree with a
 * broken leaf by construction.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY, so no `// anchored:` marker
 * is owed anywhere in this file: each source scan is a set equality against the EMPTY set
 * whose scanner is driven, in the same arm, over a control source that DOES contain a
 * member; the dark-import arm is a set equality; the seam arms are call counts.
 *
 * ⛔ THE THREE WALKERS' LAWS ARE CARRIED HERE BY THEIR OWN INSTRUMENTS (A9). The page is
 * DARK, so the phone-floor census (whose tree is derived from the router) and the no-clamp
 * walker (whose tree is the dossier's two directories) do not reach this file by their own
 * scopes; rather than widen a walker's tree to a directory this member does not own, the
 * ESTATE'S OWN SCANNER is imported and run over this page's source, so the page is held to
 * the same rule the walker applies and arrives cured on the day the mount lands. The
 * keyboard-reachability walker (`tests/lint/uiA11yContract.walker.test.js`) sweeps all of
 * `src/components` already and governs this leaf by construction; its roster stays EMPTY,
 * which is what this page not needing an exception means.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { parse } from 'espree';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import DecreeRegistryPage, {
  AUTHOR_LABELS,
  GUARD_KIND_LABELS,
  GUARD_OFFER_LABELS,
  REGISTRY_ACTION_NAMES,
  STATUS_SECTIONS,
} from '../../src/components/edit/DecreeRegistryPage.jsx';
import {
  DECREE_AUTHORS, DECREE_STATUSES, markApplied, stage, withdraw,
} from '../../src/domain/edit/registry.js';
import { GUARD_KINDS, GUARD_OFFERS } from '../../src/domain/edit/guards.js';
import { DECREE_ACTIONS, reorderDecree, selectGuards, withdrawDecree } from '../../src/store/editSlice.js';
import { t } from '../../src/copy/index.js';
import { censusOfSource, proseFloorCensusOfSource } from './phoneFloorCensus.shared.mjs';
import { extractJsxProseStrings } from '../helpers/jsxLiteralWalk.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LEAF_REL = 'src/components/edit/DecreeRegistryPage.jsx';
const LEAF_SOURCE = readFileSync(join(ROOT, LEAF_REL), 'utf8');
const ADVANCE_REL = 'src/store/campaignAdvanceSession.js';

const SAVE = 'save_em_d3';
const T0 = '2026-09-23T10:00:00.000Z';
const T1 = '2026-09-23T11:00:00.000Z';

/** One op at the rigid shape `src/domain/edit/types.js` authors. */
const opOf = (type, kind, id, requires = []) => Object.freeze({
  type,
  target: Object.freeze({ kind, id }),
  payload: Object.freeze({}),
  stage: 'home',
  consequence: 'home',
  requires: Object.freeze([...requires]),
  enables: Object.freeze([]),
  relatedTo: Object.freeze([]),
  conflictsWith: Object.freeze([]),
  duration: null,
});

/**
 * THE REGISTRY UNDER TEST, BUILT BY EM-C1's OWN VERBS: three staged, then one marked
 * applied at a tick with a chronicle line and one withdrawn by the vocabulary rule. The
 * order indices are the ones `stage` assigned, never numbers typed here.
 */
const REGISTRY = (() => {
  let rows = [];
  rows = stage(rows, opOf('set-field', 'npc', 'npc_1', ['mill-rebuilt']), { id: 'd_alpha', orderedAt: T0 });
  rows = stage(rows, opOf('add-institution', 'institution', 'inst_2'), { id: 'd_beta', orderedAt: T0, addedBy: 'guard' });
  rows = stage(rows, opOf('set-field', 'faction', 'fac_3'), { id: 'd_gamma', orderedAt: T0, addedBy: 'surveyor' });
  rows = stage(rows, opOf('set-field', 'npc', 'npc_4'), { id: 'd_delta', orderedAt: T0 });
  rows = markApplied(rows, 'd_gamma', { appliedAt: T1, tickRef: 'tick_7', chronicleRef: 'chron_7' });
  rows = withdraw(rows, 'd_delta', { kind: 'vocabulary-moved', missing: 'pool-value', was: 'Reeve' });
  return rows;
})();

/** A live get/set pair the landed store actions write through, as the slice expects. */
const makeStore = (decrees) => {
  const state = { activeSaveId: SAVE, settlement: { decrees } };
  return { state, get: () => state, set: (fn) => { fn(state); } };
};

/** EM-C4b's landed actions, bound as a caller binds them. Requests are captured verbatim. */
const bind = (store, seen) => ({
  reorder: (request) => { seen.push(['reorder', request]); return reorderDecree(store.get, store.set, request); },
  withdraw: (request) => { seen.push(['withdraw', request]); return withdrawDecree(store.get, store.set, request); },
});

const pageOf = (props) => (
  <DecreeRegistryPage saveId={SAVE} decrees={REGISTRY} {...props} />
);

const idsIn = (container, testId) => [...container.querySelectorAll(`[data-testid="${testId}"] [data-testid="decree-entry"]`)]
  .map((node) => node.getAttribute('data-entry-id'));
const nodes = (container, testId) => [...container.querySelectorAll(`[data-testid="${testId}"]`)];
const rowFor = (container, entryId) => container.querySelector(`[data-entry-id="${entryId}"]`);

/** Every import specifier in one source, in source order. */
const importsOf = (src) => parse(src, { ecmaVersion: 2024, sourceType: 'module', ecmaFeatures: { jsx: true } })
  .body.filter((node) => node.type === 'ImportDeclaration').map((node) => node.source.value);

/** The clamp tells the no-clamp walker refuses, in one source. */
const CLAMPS = /textOverflow|WebkitLineClamp|lineClamp|whiteSpace:\s*'nowrap'/g;
const clampsIn = (src) => [...src.matchAll(CLAMPS)].map((m) => m[0]);
const CLAMP_CONTROL = "const s = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', WebkitLineClamp: 2 };";

/** Every random draw and every clock reading in one source. */
const drawsIn = (src) => [...src.matchAll(/new Date|Math\.[A-Za-z]+|Date\.[A-Za-z]+|performance\.[A-Za-z]+|crypto\./g)].map((m) => m[0]);
const DRAW_CONTROL = 'const a = new Date(); const b = Math.random(); const c = Date.now();';

/** Every mouse-only activation and every raw stacking literal in one source. */
const reachTellsIn = (src) => [...src.matchAll(/onMouseDown|tabIndex=\{-1\}|zIndex/g)].map((m) => m[0]);
const REACH_CONTROL = '<div onMouseDown={go} tabIndex={-1} style={{ zIndex: 9 }} />';

/** The two spellings of ONE seam predicate, which only a source read can see. */
const beltsIn = (src, name) => [...src.matchAll(new RegExp(`typeof actions\\?\\.${name} [=!]== 'function'`, 'g'))].map((m) => m[0]);
const REOPEN_BELT = /typeof onReopen [=!]== 'function'/g;

describe('EM-D3: the registry page at the dossier foot', () => {
  afterEach(() => { cleanup(); });

  it('A1 renders the waiting entries in the DM own order, with applied and withdrawn below', () => {
    // Handed SHUFFLED: the page orders by `orderIndex` then `id`, which is the list
    // `reorder` itself addresses, so the rendered sequence is the page's own reading.
    const { container } = render(pageOf({ decrees: [...REGISTRY].reverse() }));
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_alpha', 'd_beta']);
    expect(idsIn(container, 'decree-registry-applied')).toEqual(['d_gamma']);
    expect(idsIn(container, 'decree-registry-withdrawn')).toEqual(['d_delta']);
    // What it does and what it requires, out of the entry and out of no catalogue.
    const first = rowFor(container, 'd_alpha');
    expect(first.querySelector('[data-testid="decree-entry-summary"]').textContent).toBe('set-field · npc npc_1');
    expect(first.querySelector('[data-testid="decree-entry-requires"]').textContent).toBe('Requires: mill-rebuilt');
    expect(rowFor(container, 'd_beta').querySelector('[data-testid="decree-entry-author"]').textContent)
      .toBe(AUTHOR_LABELS.guard);
    expect(rowFor(container, 'd_gamma').querySelector('[data-testid="decree-entry-author"]').textContent)
      .toBe(AUTHOR_LABELS.surveyor);
    expect(rowFor(container, 'd_delta').querySelector('[data-testid="decree-entry-reason"]').textContent)
      .toBe('Withdrawn: Reeve is no longer in the catalogue');
  });

  it('A2 move up and move down reach EM-C4b reorder with the store own request, and the registry permutes', () => {
    const seen = [];
    const store = makeStore(REGISTRY);
    const { container, rerender } = render(pageOf({ decrees: store.state.settlement.decrees, actions: bind(store, seen) }));
    // The ends are closed: the first row cannot move up and the last cannot move down.
    expect(nodes(container, 'decree-move-up')[0].disabled).toBe(true);
    expect(nodes(container, 'decree-move-down')[1].disabled).toBe(true);

    fireEvent.click(nodes(container, 'decree-move-up')[1]);
    expect(seen).toEqual([['reorder', { saveId: SAVE, entryId: 'd_beta', toIndex: 0 }]]);
    // The LANDED verb moved the real registry: the pending pair swapped their slots and
    // the applied and withdrawn entries kept theirs.
    const after = store.state.settlement.decrees;
    const indexOf = (id) => after.find((row) => row.id === id).orderIndex;
    expect([indexOf('d_beta'), indexOf('d_alpha')]).toEqual([0, 1]);
    expect([indexOf('d_gamma'), indexOf('d_delta')]).toEqual([2, 3]);
    rerender(pageOf({ decrees: after, actions: bind(store, seen) }));
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_beta', 'd_alpha']);

    fireEvent.click(nodes(container, 'decree-move-down')[0]);
    expect(seen[1]).toEqual(['reorder', { saveId: SAVE, entryId: 'd_beta', toIndex: 1 }]);
    rerender(pageOf({ decrees: store.state.settlement.decrees, actions: bind(store, seen) }));
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_alpha', 'd_beta']);
  });

  it('A3 withdraw reaches EM-C4b withdraw, and the entry is kept for the record', () => {
    const seen = [];
    const store = makeStore(REGISTRY);
    const { container, rerender } = render(pageOf({ decrees: store.state.settlement.decrees, actions: bind(store, seen) }));
    fireEvent.click(nodes(container, 'decree-withdraw')[0]);
    expect(seen).toEqual([['withdraw', { saveId: SAVE, entryId: 'd_alpha' }]]);
    const after = store.state.settlement.decrees;
    expect(after.length).toBe(REGISTRY.length);
    expect(after.find((row) => row.id === 'd_alpha').status).toBe('withdrawn');
    expect(Object.hasOwn(after.find((row) => row.id === 'd_alpha'), 'withdrawnReason')).toBe(false);
    rerender(pageOf({ decrees: after, actions: bind(store, seen) }));
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_beta']);
    expect(idsIn(container, 'decree-registry-withdrawn')).toEqual(['d_alpha', 'd_delta']);
  });

  it('A4 reopen is offered on pending entries only and reaches the seam, applied entries are read-only with chronicle links', () => {
    const seen = [];
    const href = (entry) => (typeof entry.chronicleRef === 'string' ? `#chronicle-${entry.chronicleRef}` : null);
    const { container } = render(pageOf({ onReopen: (entry) => seen.push(entry), chronicleHref: href }));
    expect(nodes(container, 'decree-reopen').length).toBe(2);
    expect(rowFor(container, 'd_gamma').querySelector('[data-testid="decree-reopen"]')).toBe(null);
    expect(rowFor(container, 'd_delta').querySelector('[data-testid="decree-reopen"]')).toBe(null);

    fireEvent.click(nodes(container, 'decree-reopen')[1]);
    expect(seen.map((entry) => entry.id)).toEqual(['d_beta']);

    const link = rowFor(container, 'd_gamma').querySelector('[data-testid="decree-chronicle-link"]');
    expect(link.getAttribute('href')).toBe('#chronicle-chron_7');
    // A pending entry has no chronicle line yet, so it carries no link at all.
    expect(rowFor(container, 'd_alpha').querySelector('[data-testid="decree-chronicle-link"]')).toBe(null);

    // NO SEAM, NO CALL PATH: the control is disabled, nothing is dispatched, and the
    // predicate is spelled twice in the leaf (the belt only a source read can see).
    cleanup();
    const bare = render(pageOf({})).container;
    expect(nodes(bare, 'decree-reopen').every((node) => node.disabled)).toBe(true);
    expect(nodes(bare, 'decree-move-up').every((node) => node.disabled)).toBe(true);
    expect(nodes(bare, 'decree-withdraw').every((node) => node.disabled)).toBe(true);
    expect(beltsIn(LEAF_SOURCE, 'reorder').length).toBe(2);
    expect(beltsIn(LEAF_SOURCE, 'withdraw').length).toBe(2);
    expect([...LEAF_SOURCE.matchAll(REOPEN_BELT)].length).toBe(2);
  });

  it('A5 the guard badges show each guard kind and its offers, from the store own selectGuards', () => {
    const rules = {
      rules: [
        {
          id: 'a-prerequisite',
          appliesTo: null,
          needs: [],
          evaluate: () => ({ kind: 'prerequisite', message: 'A cathedral wants a city.', offers: ['fulfil', 'self'] }),
        },
        {
          id: 'b-totality',
          appliesTo: null,
          needs: ['renormalizeFactionPower'],
          evaluate: () => ({ kind: 'totality', message: 'The shares no longer sum.' }),
        },
      ],
      project: null,
      deps: {},
    };
    const verdict = selectGuards({ settlement: { decrees: REGISTRY } }, rules);
    // The engine judged the PENDING entries only, and it left the under-supplied rule out.
    expect(verdict.guards.map((guard) => guard.entryId)).toEqual(['d_alpha', 'd_beta']);
    expect(verdict.unevaluated).toEqual(['b-totality']);

    const { container } = render(pageOf({ verdict }));
    const badges = nodes(container, 'decree-guard');
    expect(badges.length).toBe(verdict.guards.length);
    expect(badges.map((node) => node.getAttribute('data-guard-kind'))).toEqual(verdict.guards.map((guard) => guard.kind));
    const badge = rowFor(container, 'd_alpha').querySelector('[data-testid="decree-guard"]');
    expect(badge.textContent).toContain(GUARD_KIND_LABELS.prerequisite);
    expect(badge.textContent).toContain('A cathedral wants a city.');
    // `proceed` is the engine's own appended offer, so the badge shows three.
    const offers = [...badge.querySelectorAll('[data-testid="decree-guard-offer"]')];
    expect(offers.map((node) => node.getAttribute('data-offer'))).toEqual([...verdict.guards[0].offers]);
    expect(offers.map((node) => node.textContent)).toEqual(verdict.guards[0].offers.map((name) => GUARD_OFFER_LABELS[name]));
    // AN OFFER WITH NO WRITER IS WORDS: no seam, no control.
    expect(offers.map((node) => node.tagName)).toEqual(['SPAN', 'SPAN', 'SPAN']);
    expect(container.querySelector('[data-testid="decree-registry-unevaluated"]').textContent)
      .toContain('b-totality');

    cleanup();
    const taken = [];
    const wired = render(pageOf({ verdict, onGuardOffer: (guard, name) => taken.push([guard.id, name]) })).container;
    const controls = [...wired.querySelector('[data-testid="decree-guard"]').querySelectorAll('[data-testid="decree-guard-offer"]')];
    expect(controls.map((node) => node.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON']);
    fireEvent.click(controls[0]);
    expect(taken).toEqual([[verdict.guards[0].id, 'fulfil']]);
  });

  it('A6 outside a campaign the page shows the estate own rung and no advance control', () => {
    const { container } = render(pageOf({ inCampaign: false }));
    const rung = container.querySelector('[data-testid="decree-registry-realm-rung"]');
    expect(rung.textContent).toBe(`${t('detail.sendToRealmCta')}${t('detail.sendToRealmHint')}`);
    expect(container.querySelector('[data-testid="decree-registry-advance"]')).toBe(null);

    cleanup();
    const inside = render(pageOf({
      inCampaign: true,
      advanceControl: <button type="button" data-testid="the-realm-own-advance">Advance Realm</button>,
    })).container;
    expect(inside.querySelector('[data-testid="decree-registry-realm-rung"]')).toBe(null);
    expect(inside.querySelector('[data-testid="decree-registry-advance"] [data-testid="the-realm-own-advance"]')).not.toBe(null);

    // THE PAGE MINTS NO SECOND ADVANCE: no string in the leaf spells the realm's own control.
    expect(extractJsxProseStrings(LEAF_SOURCE).filter((line) => /advance realm/i.test(line))).toEqual([]);
    expect(extractJsxProseStrings('const x = <b>Advance Realm</b>;').filter((line) => /advance realm/i.test(line)).length)
      .toBe(1);
  });

  it('A7 the rewind session limit is stated from the estate own constant', () => {
    const declared = /const PULSE_UNDO_CAP = (\d+);/.exec(readFileSync(join(ROOT, ADVANCE_REL), 'utf8'));
    expect(declared).not.toBe(null);
    const cap = Number(declared[1]);
    expect(Number.isFinite(cap)).toBe(true);

    const { container } = render(pageOf({ rewindLimit: cap }));
    expect(container.querySelector('[data-testid="decree-registry-rewind"]').textContent)
      .toBe(`A rewind returns the decrees of a tick to the waiting list in their own order. It reaches the last ${cap} advances of this session, and a reload clears it.`);

    // TOLD NOTHING, IT INVENTS NO NUMBER: the session fact is still stated.
    cleanup();
    const untold = render(pageOf({})).container.querySelector('[data-testid="decree-registry-rewind"]').textContent;
    expect(/\d/.test(untold)).toBe(false);
    expect(untold).toContain('this session only');
  });

  it('A8 every vocabulary is the producer own, in both directions', () => {
    const set = (rows) => [...rows].sort();
    expect(set(STATUS_SECTIONS.map((row) => row.status))).toEqual(set(DECREE_STATUSES));
    expect(set(Object.keys(AUTHOR_LABELS))).toEqual(set(DECREE_AUTHORS));
    expect(set(Object.keys(GUARD_KIND_LABELS))).toEqual(set(GUARD_KINDS));
    expect(set(Object.keys(GUARD_OFFER_LABELS))).toEqual(set(GUARD_OFFERS));
    // The page writes with two of the store's six declared verbs, and with no other word.
    expect(REGISTRY_ACTION_NAMES.filter((name) => !Object.hasOwn(DECREE_ACTIONS, name))).toEqual([]);
    expect(set(REGISTRY_ACTION_NAMES)).toEqual(['reorder', 'withdraw']);
  });

  it('A9 the phone floor, no clamp and reachability laws hold over this page source', () => {
    // THE ESTATE'S OWN PHONE-FLOOR SCANNER, over this leaf.
    const chrome = censusOfSource(LEAF_SOURCE, LEAF_REL);
    expect(chrome.bare).toEqual([]);
    expect(chrome.misclassified).toEqual([]);
    expect(chrome.outOfScope).toEqual([]);
    expect(proseFloorCensusOfSource(LEAF_SOURCE, LEAF_REL).bare).toEqual([]);
    // The scanners are LIVE: a planted sub-floor site is found by each.
    const planted = "const s = { fontSize: FS.xs, lineHeight: 1.55 };\nconst c = { fontSize: FS.sm, lineHeight: 1.55 };\n";
    expect(censusOfSource(planted, 'planted.jsx').bare.length).toBe(1);
    expect(proseFloorCensusOfSource(planted, 'planted.jsx').bare.length).toBe(2);

    // AUTHORED TEXT IS NEVER CLAMPED (the owner's rule, the no-clamp walker's class).
    expect(clampsIn(LEAF_SOURCE)).toEqual([]);
    expect(clampsIn(CLAMP_CONTROL).length).toBe(3);

    // THE VOICE TIER THIS NEW `.jsx` OPTS INTO: the Tier-3 baseline is empty, so every
    // reader-facing string in this leaf carries no em dash and no exclamation point.
    const tells = extractJsxProseStrings(LEAF_SOURCE).flatMap((line) => [...line.matchAll(/[—!]/g)].map((m) => m[0]));
    expect(tells).toEqual([]);
    expect(extractJsxProseStrings('const x = <b>It thrives—truly!</b>;').flatMap((line) => [...line.matchAll(/[—!]/g)].map((m) => m[0])).length)
      .toBe(2);

    // KEYBOARD REACHABLE: no mouse-only activation, no removed tab stop, no raw stacking.
    expect(reachTellsIn(LEAF_SOURCE)).toEqual([]);
    expect(reachTellsIn(REACH_CONTROL).length).toBe(3);
    // Every control the page renders is a real button the keyboard reaches.
    const { container } = render(pageOf({
      actions: { reorder: () => {}, withdraw: () => {} },
      onReopen: () => {},
      onGuardOffer: () => {},
    }));
    const controls = [...container.querySelectorAll('[data-testid^="decree-"]')]
      .filter((node) => node.tagName === 'BUTTON');
    expect(controls.length).toBe(8);
    expect(controls.filter((node) => node.getAttribute('type') !== 'button')).toEqual([]);
    expect(controls.filter((node) => node.getAttribute('tabindex') === '-1')).toEqual([]);
  });

  it('A10 it draws nothing, its static imports are the declared four, and its ONE importer under src is the shell', () => {
    expect(importsOf(LEAF_SOURCE).slice().sort()).toEqual([
      '../../copy/index.js',
      '../../domain/deterministicSort.js',
      '../primitives/Button.jsx',
      '../theme.js',
    ]);
    expect(drawsIn(LEAF_SOURCE)).toEqual([]);
    expect(drawsIn(DRAW_CONTROL).length).toBe(3);
    // ⭐ FLIPPED BY EM-D3c, AND THE SHAPE OF THE ARM IS UNCHANGED. At EM-D3's landing this
    // equality read `[]` — no importer anywhere under `src/`, which is what "it lands dark"
    // meant and why the mount could be nobody's accident. The mount this page's own header
    // reserved has now landed, so the SET EQUALITY names it: exactly ONE importer, and it is
    // the edit-mode shell, which `src/App.jsx` reaches through a single `lazy(() =>
    // import(...))` edge. The first-paint claim therefore still holds by construction — the
    // eager graph walks STATIC edges only — and it is priced where the eager set can be read,
    // in tests/build/vendorPdfLazy.test.js's editor-train arm, on the shell's own row.
    //
    // ⛔ THE PREDICATE IS STILL A BARE NAME SCAN. A second file that so much as NAMES this
    // leaf in prose reds here exactly as an import would, which is what keeps the mount a
    // measurement rather than a promise.
    expect(importersIn(join(ROOT, 'src'))).toEqual(['src/components/edit/EditModeShell.jsx']);
    expect(importersOfSource("import X from './DecreeRegistryPage.jsx';")).toBe(true);
  });
});

/** Does one source name this leaf at all? */
function importersOfSource(src) {
  return /DecreeRegistryPage/.test(src);
}

/** Every file under `dir` that names this leaf. */
function importersIn(dir) {
  const found = [];
  const walk = (at) => {
    for (const entry of readdirSync(at)) {
      const full = join(at, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.jsx?$/.test(entry) && full !== join(ROOT, LEAF_REL)) {
        if (importersOfSource(readFileSync(full, 'utf8'))) found.push(full.slice(ROOT.length + 1));
      }
    }
  };
  walk(dir);
  return found;
}
