/**
 * deadOperationRatchet.test.js — WAVE R-4: the DEAD-OP RATCHET (atlas Part VI
 * gap 1 / Part VII owner queue #21).
 *
 * WHAT THIS HOLDS. The operation registry proves COMPLETENESS in both directions
 * (tests/store/operationRegistry.walker.test.js: every mutating action is
 * registered or exempt, and every registered name is a real mutating action).
 * What it has never been able to see is REACHABILITY: an op can be perfectly
 * registered, perfectly described, rendered in the public Compendium — and have
 * no caller anywhere in the product. The atlas measured 31 such ops and put
 * retire-vs-wire to the owner as queue #21. That question is OWNER-GATED and is
 * not answered here. This ratchet only holds the line while it is open:
 *
 *   THE RULE — the dead list may only SHRINK. An op leaves it by gaining a
 *   consumer or by being retired. No op may JOIN it: shipping a registered
 *   operation with no caller is how the 31 accumulated in the first place.
 *
 * WHY A FRESH MEASUREMENT, NOT THE ATLAS'S LIST. The atlas is a dated snapshot of
 * a moving tree, and waves R-0..R-3 changed reachability on purpose (R-1 minted
 * undoLastProposalApply and mounted it on UndoHistoryPanel; R-2 mounted
 * ChronicleScrollback and the Narrative Archive reader). The list below was
 * re-derived from the current tree by the scanner in this file. Measured: 36.
 * Atlas: 31. Delta explained — nothing LEFT the atlas's 31 (all 31 are still
 * dead), and five members joined that the atlas's slice never enumerated:
 *   • destroySavedSettlement, requestProgression, importNeighbour,
 *     handleImportDirect — the atlas's list was explicitly "31 registered
 *     MECHANICAL ops"; these four are canon/macro class and were outside it.
 *   • renameFaction — the atlas recorded it dead separately (its own gap, owner
 *     queue #14, "the registry row advertises an op no surface exposes") and
 *     never folded it into the 31.
 * So the delta is an enumeration-scope difference, not a regression: no op became
 * dead between the atlas snapshot and this measurement.
 *
 * WHAT COUNTS AS A CONSUMER (the scanner's rule, stated so a red is actionable).
 * Comments and string/template contents are stripped first — a name mentioned in
 * prose is not a caller (the atlas found four ops whose only "caller" was a
 * docstring). Then, in any src file outside the registry itself and the generated
 * compendium mirror, an op counts as CONSUMED when the file has either:
 *   (a) a direct invocation through the store handle — `.op(` , which covers
 *       `get().op(...)`, `useStore.getState().op(...)`, `s.op(...)`; or
 *   (b) a destructure off the store — `const { op } = useStore(...)`; or
 *   (c) a store-handle reference `.op` (the `useStore(s => s.op)` binding that
 *       React components pass on as a prop or handler, which is the dominant
 *       shape and is never a syntactic call) — MINUS the inert-binding evasion:
 *       a `const LOCAL = useStore(s => s.op)` whose LOCAL never appears again in
 *       the file. That evasion is real and load-bearing: `_replaceAllPlacements`
 *       at WorldMap.jsx is bound and never used, and a naive grep scores it as a
 *       caller. It is pinned as a positive control below.
 * Requiring a `.op` store-handle reference in the file is what keeps a same-named
 * DOMAIN function from masquerading as a store consumer — `setRegionalChannelStatus`
 * and `setRegionalChannelVisibility` each exist twice under one name, once in
 * src/domain/region/graph.js and once as a store action.
 *
 * CANNOT-CATCH (accepted, documented):
 *   1. A binding renamed at the selector (`const doIt = useStore(s => s.op)`
 *      then `doIt()`) reads as consumed via rule (c), which is right; but a
 *      binding renamed AND only passed onward from a file that references
 *      nothing else cannot be distinguished from an inert one. The rule errs
 *      toward "dead", which is the safe direction for a shrink-only ledger: a
 *      false dead enters the frozen list and is inert; a false LIVE would let an
 *      op escape the ratchet.
 *   2. Reachability from a file is not reachability by a USER. An op consumed
 *      only by another dead surface still counts live here. The atlas's
 *      user-facing analysis is the authority on that; this is the automatable
 *      floor beneath it.
 *   3. Dispatch by computed name (`get()[opType](...)`) would be invisible. No
 *      such site exists in src today — asserted below, so the day one appears the
 *      scanner's premise is re-examined rather than silently violated.
 *
 * @enforced-by this test
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { OPERATIONS, registeredActionNames } from '../../src/store/operationRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Drop comment and string/template contents (the census-walker idiom). */
function stripCode(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let state = 'code';
  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];
    if (state === 'code') {
      if (c === '/' && c2 === '/') { state = 'line'; i += 2; continue; }
      if (c === '/' && c2 === '*') { state = 'block'; i += 2; continue; }
      if (c === "'") { state = 'sq'; i++; continue; }
      if (c === '"') { state = 'dq'; i++; continue; }
      if (c === '`') { state = 'tpl'; i++; continue; }
      out += c; i++; continue;
    }
    if (state === 'line') { if (c === '\n') { state = 'code'; out += c; } i++; continue; }
    if (state === 'block') { if (c === '*' && c2 === '/') { state = 'code'; i += 2; } else { if (c === '\n') out += c; i++; } continue; }
    if (state === 'sq') { if (c === '\\') { i += 2; continue; } if (c === "'") state = 'code'; i++; continue; }
    if (state === 'dq') { if (c === '\\') { i += 2; continue; } if (c === '"') state = 'code'; i++; continue; }
    if (state === 'tpl') { if (c === '\\') { i += 2; continue; } if (c === '`') state = 'code'; i++; continue; }
  }
  return out;
}

/** The registry itself and the generated Compendium mirror are METADATA, never
 *  consumers: every op appears in both by construction. */
const NOT_A_CONSUMER = ['src/store/operationRegistry.js', 'src/domain/compendium/generated/'];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const SOURCES = (() => {
  const map = new Map();
  for (const abs of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, abs).replace(/\\/g, '/');
    if (!/\.(js|jsx)$/.test(rel)) continue;
    if (NOT_A_CONSUMER.some((x) => rel === x || rel.startsWith(x))) continue;
    map.set(rel, stripCode(readFileSync(abs, 'utf8')));
  }
  return map;
})();

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const identCount = (code, id) =>
  (code.match(new RegExp(`(?<![\\w$.])${escapeRe(id)}(?![\\w$])`, 'g')) || []).length;

/**
 * Files that consume the named store operation, per the rule in the header.
 * @param {string} name
 * @returns {string[]} sorted repo-relative paths
 */
function consumerFiles(name) {
  const N = escapeRe(name);
  const handleCall = new RegExp(`\\.${N}\\s*\\(`);
  const handleRead = new RegExp(`\\.${N}(?![\\w$])`, 'g');
  const destructure = new RegExp(
    `\\{[^{}]*(?<![\\w$])${N}(?![\\w$])[^{}]*\\}\\s*=\\s*(?:useStore|[\\w$.]*getState\\(\\))`,
  );
  const inertBinding = new RegExp(
    `const\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*useStore\\s*\\(\\s*(?:\\([^)]*\\)|[\\w$]+)\\s*=>\\s*[\\w$]+\\??\\.${N}\\s*\\)`,
    'g',
  );
  const out = [];
  for (const [file, code] of SOURCES) {
    if (handleCall.test(code)) { out.push(file); continue; }
    if (destructure.test(code)) { out.push(file); continue; }
    const reads = (code.match(handleRead) || []).length;
    if (reads === 0) continue;
    let inert = 0;
    for (const m of code.matchAll(inertBinding)) if (identCount(code, m[1]) < 2) inert++;
    if (reads > inert) out.push(file);
  }
  return out.sort();
}

/**
 * THE FROZEN DEAD LIST — measured from this tree on 2026-07-27 by the scanner
 * above, member-by-member cross-checked against the atlas's enumeration.
 *
 * SHRINK-ONLY. Removing a member is always allowed (it gained a consumer, or the
 * op was retired). Adding one is not: that is the red this ratchet exists for.
 * The retire-vs-wire disposition of these ops is OWNER QUEUE #21 and is not
 * decided here.
 */
const DEAD_OPERATIONS = Object.freeze([
  // canon / macro class (outside the atlas's mechanical-only slice)
  'destroySavedSettlement',
  'handleImportDirect',
  'requestProgression',
  // the atlas's separately-recorded dead op (owner queue #14)
  'renameFaction',
  // the atlas's registered mechanical ops with zero callers
  'addCredits',
  'bulkSetGoods',
  'bulkSetServices',
  'clearCampaignWizardNews',
  'completeOnboarding',
  'markFeatureUsed',
  'mergeInstitutionToggles',
  'refreshSystemState',
  'replaceAllPlacements',
  'resetAllToggles',
  'resetConfig',
  'resetGoodsServices',
  'resetOnboarding',
  'resetToggles',
  'revertSingleEdit',
  'setNeighbourRelType',
  'setRegionalChannelVisibility',
  'spendCredits',
]);

/**
 * The UNREACHABLE-INVERSE ledger — advertising rows whose recovery verb is itself
 * on the dead list. The promise is true in code and false in practice: the
 * inverse exists, nothing exposes it. Frozen and shrink-only for the same reason
 * as the list above; every member must still be dead (the honesty half), so a row
 * whose inverse gets wired up must be deleted from here.
 */
const UNREACHABLE_INVERSE = Object.freeze([
  'completeOnboarding', // → resetOnboarding (dead)
  'markFeatureUsed',    // → resetOnboarding (dead)
  'queueEdit',          // → revertSingleEdit (dead)
  // addNeighbourLink / removeNeighbourLink pointed at each other and BOTH left
  // the registry in the R-5b retirement below, so their rows go with them — the
  // no-ghost-rows rule applied to this ledger.
]);

/** The recovery verb a row points at: its undoToken, or a verb-shaped ref. */
function recoveryVerbOf(op) {
  if (op.undoToken != null) return op.undoToken;
  const m = /^(?:external|partial):(.+)$/.exec(String(op.undoState));
  return m && !m[1].includes('-') ? m[1] : null;
}

const registered = registeredActionNames();
const measuredDead = registered.filter((name) => consumerFiles(name).length === 0).sort();

describe('R-4 dead-op ratchet — the measurement is real', () => {
  test('the scanner sees the whole source tree and most ops as live (not vacuous)', () => {
    // If the scan silently collapsed (a bad path, a broken regex), every op would
    // read dead and the subset assertion would still pass. Floor-guard both ends.
    expect(SOURCES.size).toBeGreaterThan(400);
    expect(registered.length).toBeGreaterThan(150);
    expect(measuredDead.length).toBeLessThan(registered.length / 3);
    expect(registered.length - measuredDead.length).toBeGreaterThan(100);
  });

  test('no dispatch-by-computed-name exists (the scanner premise holds)', () => {
    // A `get()[name](...)` dispatcher would make every op nominally reachable and
    // invalidate call-site counting. None exists today; if one lands, this reds
    // and the reachability rule must be reconsidered before the ratchet is trusted.
    const dynamic = [...SOURCES]
      .filter(([, code]) => /(?:get|getState)\(\)\s*\[/.test(code))
      .map(([f]) => f);
    expect(dynamic).toEqual([]);
  });

  test('positive control — a comment-only mention is NOT a consumer', () => {
    // markFeatureUsed's only appearance outside its slice is a JSDoc reference in
    // guidanceRegistry.js. Prove the strip step is what makes it dead, by showing
    // the raw file mentions it while the scanner does not count it.
    const raw = readFileSync(join(ROOT, 'src/domain/display/guidanceRegistry.js'), 'utf8');
    expect(raw.includes('markFeatureUsed')).toBe(true);
    expect(consumerFiles('markFeatureUsed')).toEqual([]);
  });

  test('positive control — an inert store binding is NOT a consumer', () => {
    // WorldMap.jsx binds replaceAllPlacements to a name it never uses. A naive
    // grep scores that as a caller; the inert-binding discount is what keeps the
    // op honestly dead. Prove both halves so the discount cannot rot into a no-op.
    const worldMap = stripCode(readFileSync(join(ROOT, 'src/components/WorldMap.jsx'), 'utf8'));
    expect(/\.replaceAllPlacements(?![\w$])/.test(worldMap)).toBe(true);
    expect(consumerFiles('replaceAllPlacements')).toEqual([]);
  });

  test('positive control — the scanner finds real consumers for wired ops', () => {
    // Including the ops R-1/R-2 wired, which is why this list was re-measured
    // rather than copied from the atlas.
    expect(consumerFiles('undoLastProposalApply').length).toBeGreaterThan(0);
    expect(consumerFiles('undoLastPulse').length).toBeGreaterThan(0);
    expect(consumerFiles('applyEvent').length).toBeGreaterThan(0);
    expect(consumerFiles('updateConfig').length).toBeGreaterThan(0);
  });
});

describe('R-4 dead-op ratchet — the list only shrinks (owner queue #21)', () => {
  test('no registered operation JOINS the dead list', () => {
    const joined = measuredDead.filter((name) => !DEAD_OPERATIONS.includes(name));
    // A registered operation with no caller anywhere in src just shipped. Wire it
    // to a surface, or retire it (remove the action AND its registry row). Do NOT
    // add it to DEAD_OPERATIONS: that list is the frozen inventory answering to
    // OWNER QUEUE #21 (the 31 dead ops: retire vs wire), it is shrink-only, and
    // growing it would launder a new orphan into an old question.
    expect(
      joined,
      `\nNEW dead operations (no consumer in src) — wire or retire; the frozen list answers to OWNER QUEUE #21 and never grows:\n  ${joined.join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('every frozen member is still a registered operation (no ghost rows)', () => {
    const ghosts = DEAD_OPERATIONS.filter((name) => !OPERATIONS[name]).sort();
    // A member retired out of the registry must be deleted from the list too —
    // otherwise the ledger keeps counting an op that no longer exists.
    expect(ghosts, `\nFrozen dead members that are no longer registered:\n  ${ghosts.join('\n  ')}\n`).toEqual([]);
  });

  test('the frozen list is sorted and free of duplicates (a reviewable ledger)', () => {
    expect(DEAD_OPERATIONS.length).toBe(new Set(DEAD_OPERATIONS).size);
    // 36 at freezing (2026-07-27) → 22 after R-5b Batch 2 answered owner queue
    // #21 for sixteen of them: TWO were WIRED (setLock + clearLocks — the locks
    // engine got its read side and its controls, so they gained real consumers)
    // and TWELVE were RETIRED out of the registry entirely (importNeighbour,
    // addNeighbourLink, removeNeighbourLink, setNeighbourNetwork,
    // ensureCampaignRegionalGraph, queueCampaignRegionalImpacts,
    // reorderCampaignSettlements, setAiDailyLife, setDossierEntitlement,
    // syncActiveNeighbourFields, recordCanonFlavorEntry's store surface, and
    // setSettlementType — the last only after its tier clamp was PROVEN redundant
    // against the live generation gate). The remaining twenty-two are still open:
    // some await a wiring lane (revertSingleEdit, destroySavedSettlement,
    // resetAllToggles), some belong to another program (renameFaction #14,
    // requestProgression), and some are entangled with an unadjudicated finding
    // (the onboarding coach's missing exit path). Shrink-only, as ever.
    expect(DEAD_OPERATIONS.length).toBe(22);
  });
});

describe('R-4 dead-op ratchet — advertised recovery that nothing exposes', () => {
  const deadSet = new Set(measuredDead);
  const withDeadInverse = Object.values(OPERATIONS)
    .filter((op) => {
      const verb = recoveryVerbOf(op);
      return verb != null && deadSet.has(verb);
    })
    .map((op) => op.opType)
    .sort();

  test('no NEW row promises recovery through an unreachable verb', () => {
    const joined = withDeadInverse.filter((name) => !UNREACHABLE_INVERSE.includes(name));
    // The row's undo promise resolves to a registered verb with no caller: true in
    // code, unreachable to a player. Either wire the inverse to a surface, or say
    // 'none' in the registry. The frozen members are the standing five, part of
    // the same owner queue #21 family.
    expect(
      joined,
      `\nRows advertising recovery through a verb no surface exposes:\n  ${joined.map((n) => `${n} → ${recoveryVerbOf(OPERATIONS[n])}`).join('\n  ')}\n`,
    ).toEqual([]);
  });

  test('every ledger member still has a dead inverse (no stale rows)', () => {
    const stale = UNREACHABLE_INVERSE.filter((name) => !withDeadInverse.includes(name)).sort();
    // Once an inverse gets a consumer, its row must leave this ledger — the
    // honesty half that stops the list describing a fixed world.
    expect(stale, `\nLedger rows whose inverse is now reachable (delete them):\n  ${stale.join('\n  ')}\n`).toEqual([]);
  });
});
