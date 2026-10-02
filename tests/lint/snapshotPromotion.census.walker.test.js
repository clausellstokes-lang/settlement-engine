/**
 * snapshotPromotion.census.walker.test.js — TOOL-30. EVERY WRITER THAT PUTS A SNAPSHOT'S
 * SETTLEMENT ONTO A LIVE SAVED RECORD IS ENUMERATED BY NAME, SO AN UNADVERTISED SECOND
 * PROMOTION PATH REDS THE DAY IT APPEARS.
 *
 * ⛔ THE LAW, IN ONE SENTENCE. This walker parses every file under `src/` that mentions
 * `savedSettlements`, derives every site that writes a settlement onto an element of that
 * array (the store's projection of the account's library rows), attributes each site to the
 * innermost NAMED function containing it, traces each site's source back to the declarations
 * it reads, and REDS unless the derived `file · function · sites · shapes` roster is SET-EQUAL
 * both directions to the census declared below — and unless every row's declared class
 * (PROMOTER, a settlement read from a snapshot / version-history element / undo stack / draft
 * history; or FORWARD, a settlement computed from the live record) agrees with that trace.
 *
 * ── WHY IT EXISTS ────────────────────────────────────────────────────────────────────
 * EM-B3d's refuter found FIX-1: a restored `versionHistory[].settlement` bypasses the account
 * door's strip, and `revertToSnapshotAction` PROMOTES that snapshot onto the live record.
 * EM-B3e's chair ruling (Q4) then rested "no recursion" on the premise that nothing else
 * promotes a snapshot, and PINNED the premise with two arms — `townMapEdits`'s
 * `snapshotSettlement` strip (no product writer can MAKE a nested timeline) and
 * `advertisedUndoArming`'s versionHistory record kind (both writers of THAT timeline). Its
 * pre-proof §4 then named, in as many words, the one shape neither arm convicts:
 *
 *     "an *unadvertised* promotion added inside an already-registered action. Closing it
 *      needs a `tests/lint` source census over `savedSettlements[i].settlement =` — a packet
 *      of its own."
 *
 * This is that census, widened by measurement: the estate's promoters do NOT all wear the
 * `savedSettlements[i].settlement =` spelling, and keying on it alone would have seen one of
 * the three and missed two.
 *
 * ── WHAT THE PREDICATE KEYS ON (the WRITE, which is mechanical) ──────────────────────
 *   W1  `<savedRow>.settlement = <rhs>` — a non-computed `.settlement` assignment whose
 *       object is `…savedSettlements[i]`, or an identifier bound in the same file from that
 *       array, INCLUDING one hop through a same-file helper whose body reads it. That hop is
 *       not decoration: it is the only thing that reaches `npcVerbsBody.js`'s `savedEntryFor`.
 *   W2  `…savedSettlements[i] = <rhs>` where the right-hand side is an object literal
 *       carrying a `settlement` property, or any non-literal value (a whole-row replacement
 *       such as `nextSave`, whose settlement this file cannot see and therefore assumes).
 *
 * The SOURCE — the fuzzy half — is traced separately and can only ever make the guard
 * STRICTER, because the write census above is UNFILTERED: a promoter cannot escape the roster
 * by being misclassified, only by being written in a shape W1/W2 do not name.
 *
 * ── WHAT IT CANNOT SEE (accepted costs, declared here rather than discovered) ────────
 *   1. A write outside W1/W2 — `Object.assign(row, { settlement })`, a computed key
 *      (`row['settl' + 'ement']`), or a mutation of `row.settlement`'s INTERIOR rather than a
 *      replacement of it. A new promoter must wear one of the two shapes or extend this
 *      scanner in the same commit.
 *   2. A write inside a helper that receives the saved row as a PARAMETER from ANOTHER file.
 *      Binding resolution is same-file and one hop deep, deliberately: two hops across files
 *      is a call graph, and a call graph in a lint walker rots faster than the thing it guards.
 *   3. A persistence-only promotion that never touches the store cache — a bare
 *      `persistSaveUpdate(id, { settlement: <snapshot> })` with no `savedSettlements` write.
 *      All three promoters do BOTH today (asserted in A4), so the write census reaches every
 *      one of them; a future cache-free writer would need its own arm.
 *   4. The source trace is textual, so a snapshot arriving under a name outside
 *      SNAPSHOT_VOCABULARY classifies FORWARD. It is still enumerated as a SITE — only its
 *      class would be wrong, and A3 is what would have to be re-argued, not A2.
 *
 * ── THE VEIL, AND ITS MEASURED STATE AT THIS TIP ─────────────────────────────────────
 * "The veil" is the promise that a settlement a DM edits stays the account's own: EM-B3d
 * strips `dmLayer`/`decrees` from a live settlement at the account door, and EM-B3e extends
 * that to the entry's restored `versionHistory[i].settlement` on both halves. Each PROMOTER
 * row below carries ONE sentence saying why the veil holds through it.
 *
 * Promoters 2 and 3 hold for a reason the DOOR supplies rather than a strip: a settlement can
 * only be promoted from a substrate this account's own session built. Promoter 2's ring is
 * store-only state a reload clears and nothing persists (A5). Promoter 3's snapshot can be
 * parked durably on a campaign record — so the reason is not "it never persists" but that the
 * account import MINTS a fresh campaign world and reads the incoming one NOWHERE, which is
 * PINNED in A6 rather than assumed. Promoter 1's is EM-B3e's strip, which is not landed here.
 *
 * ⛔ THE FIRST CUT OF THIS FILE GOT PROMOTER 3 WRONG, and the correction is the reason A6
 * exists. It followed `campaigns` as far as the LIB ENVELOPE — `accountImport.js` admits the
 * array — and concluded from that admission that a parked snapshot crosses the door inward.
 * It does not: EM-B3f's compile lane executed the real import, and the value never reaches a
 * store WRITE that lands it. THE LESSON, recorded because it is cheap to repeat: an envelope
 * that ADMITS a field proves nothing about what is DONE with it — follow the value to the
 * write, which is what A6 now asserts. The way OUT is a separate, real question and is
 * EM-B3f's, not this walker's.
 *
 * ⚠ NOTHING HERE IS A CLAIM THAT THE VEIL IS CLOSED TODAY. EM-B3e is not landed at this tip,
 * and until EM-C4a lands nothing in `src/` writes either key at all, so every gap named below
 * is INERT rather than absent. This walker enumerates the paths; the packets close them.
 *
 * @enforced-by itself (a source census with planted controls on the same functions the live
 *   arms call)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { parse } from 'espree';
import { describe, expect, test } from 'vitest';

/**
 * The repo root, resolved DEFENSIVELY — `fileURLToPath` throws under some vitest modes and a
 * collection-time throw would report as a census red that has nothing to do with promotion.
 * A1's non-empty walk is what proves the root actually resolved.
 */
const ROOT = (() => {
  try { return join(dirname(fileURLToPath(import.meta.url)), '../..'); } catch { return process.cwd(); }
})();

// ── SCANNER (probe-extractable: the bytes between these markers are the whole detector) ──

/** The array that IS the live saved-record cache in the store. */
const SAVED_ARRAY = 'savedSettlements';

/**
 * The vocabulary of a snapshot-borne source, DERIVED from the eleven measured sites rather
 * than authored: `versionHistory`/`draftVersionHistory` (promoter 1), the four `*UndoStack`
 * rings and `priorSettlement` (promoter 2), `snapshot`/`preIntervalUndo`/`parkedUndo`
 * (promoter 3). A future substrate either speaks one of these words or joins this list in the
 * same commit as its promoter.
 */
const SNAPSHOT_VOCABULARY =
  /versionHistory|UndoStack|undoStack|UndoRing|snapshot|Snapshot|priorSettlement|preIntervalUndo|parkedUndo/;

/** espree, because it is eslint's parser: a file the lint gate reads is a file this reads. */
const PARSE_OPTIONS = Object.freeze({
  ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true }, range: true,
});

const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);

/** Depth-first walk carrying the ancestor chain (espree adds no parent links). */
function walkAst(node, visit, ancestors = []) {
  if (!node || typeof node.type !== 'string') return;
  visit(node, ancestors);
  const next = [...ancestors, node];
  for (const key of Object.keys(node)) {
    if (key === 'range' || key === 'loc') continue;
    const value = node[key];
    if (Array.isArray(value)) { for (const child of value) walkAst(child, visit, next); }
    else if (value && typeof value.type === 'string') walkAst(value, visit, next);
  }
}

/** The name a function is KNOWN BY: its own id, or the declarator/property/member it lands on. */
function nameOfFunction(fn, parent) {
  if (fn.id && fn.id.type === 'Identifier') return fn.id.name;
  if (!parent) return null;
  if (parent.type === 'VariableDeclarator' && parent.id && parent.id.type === 'Identifier') return parent.id.name;
  if (parent.type === 'Property' && parent.key && parent.key.type === 'Identifier') return parent.key.name;
  if (parent.type === 'AssignmentExpression' && parent.left && parent.left.type === 'MemberExpression'
    && parent.left.property && parent.left.property.type === 'Identifier') return parent.left.property.name;
  return null;
}

/**
 * The INNERMOST named function around a site — the action a reader would cite. Anonymous
 * producers (`set(s => …)`) are climbed through, which is what turns a write buried in a
 * zustand producer into `destroySavedSettlement` rather than `createSettlementSlice`.
 */
function innermostNamed(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const node = ancestors[i];
    if (!FUNCTION_TYPES.has(node.type)) continue;
    const name = nameOfFunction(node, ancestors[i - 1]);
    if (name) return { name, node };
  }
  return null;
}

/** The identifiers at the root of an expression, calls and member access stripped. */
function rootIdents(text) {
  const out = new Set();
  const bare = /(?:^|[^.\w$])([A-Za-z_$][\w$]*)\s*(?![\w$(])/g;
  const head = /(?:^|[^.\w$])([A-Za-z_$][\w$]*)\s*\./g;
  const arg = /[A-Za-z_$][\w$]*\s*\(\s*([A-Za-z_$][\w$]*)/g;
  for (const re of [bare, head, arg]) {
    let m;
    while ((m = re.exec(text))) out.add(m[1]);
  }
  for (const noise of ['cloneJson', 'true', 'false', 'null', 'undefined', 'String', 'Number', 'Boolean']) {
    out.delete(noise);
  }
  return [...out];
}

/**
 * Does the value this site assigns come from a snapshot, a version-history element, an undo
 * stack or a draft history? Chases the right-hand side's root identifiers through their
 * declarations WITHIN the enclosing named function — `const`/`let`/`var`, `for…of` bindings,
 * bare reassignment, and a parameter whose NAME is itself vocabulary (`snapshot`). Bounded at
 * six hops: the deepest live chain is five (promoter 1's `target ← history ← versionHistory`).
 */
function traceSource(rhsText, fnText) {
  const hits = new Set();
  if (SNAPSHOT_VOCABULARY.test(rhsText)) {
    for (const h of rhsText.match(new RegExp(SNAPSHOT_VOCABULARY, 'g')) || []) hits.add(h);
  }
  let frontier = rootIdents(rhsText);
  const seen = new Set(frontier);
  for (let depth = 0; depth < 6 && frontier.length; depth += 1) {
    const next = [];
    for (const id of frontier) {
      // ⛔ `=(?![=>])` AND THE LOOKBEHIND ARE BOTH LOAD-BEARING, and a counterforce is what
      // found it: without them the bare-reassignment pattern matched the `s =` of an arrow
      // head (`history.find(s => s.id === snapshotId)`) and captured the predicate's body as
      // if it were an initialiser, so a FORWARD site inherited `snapshotId` and classified
      // PROMOTER. A comparison (`a === b`) and a property write (`foo.entry = x`) are refused
      // for the same reason.
      const patterns = [
        new RegExp(`(?:const|let|var)\\s+${id}\\s*=\\s*([\\s\\S]{0,240}?);`),
        new RegExp(`for\\s*\\(\\s*(?:const|let|var)\\s+${id}\\s+of\\s+([^)]{0,160})\\)`),
        new RegExp(`(?<![\\w$.])${id}\\s*=(?![=>])\\s*([\\s\\S]{0,160}?);`),
      ];
      for (const pattern of patterns) {
        const found = pattern.exec(fnText);
        if (!found) continue;
        const init = found[1];
        if (SNAPSHOT_VOCABULARY.test(init)) {
          for (const h of init.match(new RegExp(SNAPSHOT_VOCABULARY, 'g')) || []) hits.add(h);
        }
        for (const root of rootIdents(init)) if (!seen.has(root)) { seen.add(root); next.push(root); }
        break;
      }
      if (SNAPSHOT_VOCABULARY.test(id) && new RegExp(`\\(([^)]*\\b${id}\\b[^)]*)\\)`).test(fnText.slice(0, 400))) {
        hits.add(id);
      }
    }
    frontier = next;
  }
  return { snapshot: hits.size > 0, hits: [...hits].sort() };
}

/** Is this expression an element of the live saved-record array? @returns {string|null} how */
function savedRowVia(objectText, fileText) {
  if (new RegExp(`\\.${SAVED_ARRAY}\\s*\\[`).test(objectText)) return 'indexed';
  if (!/^[A-Za-z_$][\w$]*$/.test(objectText)) return null;
  const decl = new RegExp(`(?:const|let|var)\\s+${objectText}\\s*=\\s*([^;\\n]*(?:\\n[^;]*)?);`).exec(fileText);
  if (!decl) return null;
  const init = decl[1];
  if (new RegExp(`\\.${SAVED_ARRAY}\\b`).test(init)) return 'bound-direct';
  const call = /([A-Za-z_$][\w$]*)\s*\(/.exec(init);
  if (!call) return null;
  const body = new RegExp(`function\\s+${call[1]}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\}`).exec(fileText);
  return body && new RegExp(`\\.${SAVED_ARRAY}\\b`).test(body[1]) ? `bound-via-${call[1]}` : null;
}

/**
 * Every saved-record settlement write in one source, with its shape, its function and its
 * traced class. The ONE function every live arm and every planted control below drives.
 * @param {string} src @returns {{shape:string,fn:string,via:string,snapshot:boolean,hits:string[]}[]}
 */
function sitesIn(src) {
  if (!src.includes(SAVED_ARRAY)) return [];
  let ast;
  try { ast = parse(src, PARSE_OPTIONS); } catch { return [{ shape: 'PARSE-FAILED', fn: '<unparsed>', via: 'none', snapshot: false, hits: [] }]; }
  const out = [];
  const text = (node) => src.slice(node.range[0], node.range[1]);
  const record = (shape, node, ancestors, rhsText, via) => {
    const owner = innermostNamed(ancestors);
    const trace = traceSource(rhsText, owner ? text(owner.node) : src);
    out.push({ shape, fn: owner ? owner.name : '<top-level>', via, snapshot: trace.snapshot, hits: trace.hits });
  };
  walkAst(ast, (node, ancestors) => {
    if (node.type !== 'AssignmentExpression' || node.operator !== '=') return;
    const { left, right } = node;
    if (left.type !== 'MemberExpression') return;
    // W1 — a `.settlement` assignment onto something that IS a saved row.
    if (!left.computed && left.property.type === 'Identifier' && left.property.name === 'settlement') {
      const via = savedRowVia(text(left.object), src);
      if (via) record('W1', node, ancestors, text(right), via);
      return;
    }
    // W2 — a whole-element replacement that carries a settlement.
    if (left.computed && left.object.type === 'MemberExpression' && !left.object.computed
      && left.object.property.type === 'Identifier' && left.object.property.name === SAVED_ARRAY) {
      if (right.type !== 'ObjectExpression') { record('W2', node, ancestors, text(right), 'indexed'); return; }
      for (const prop of right.properties) {
        const key = prop.key;
        if (prop.type !== 'Property' || !key || key.type !== 'Identifier' || key.name !== 'settlement') continue;
        record('W2', node, ancestors, text(prop.value), 'indexed');
        return;
      }
    }
  });
  return out;
}

/** Collapse a corpus of sources into the roster rows this census declares. */
function censusRows(corpus) {
  const byKey = new Map();
  for (const { rel, src } of corpus) {
    for (const site of sitesIn(src)) {
      const key = `${rel}::${site.fn}`;
      if (!byKey.has(key)) byKey.set(key, { file: rel, fn: site.fn, sites: 0, shapes: new Set(), snapshot: false, hits: new Set() });
      const row = byKey.get(key);
      row.sites += 1;
      row.shapes.add(site.shape);
      if (site.snapshot) { row.snapshot = true; for (const h of site.hits) row.hits.add(h); }
    }
  }
  return [...byKey.values()]
    .map((row) => ({ ...row, shapes: [...row.shapes].sort().join('+'), hits: [...row.hits].sort() }))
    .sort((a, b) => `${a.file}::${a.fn}`.localeCompare(`${b.file}::${b.fn}`));
}

/**
 * The top-level keys of the object literal handed to `createImportedCampaign(…)`, derived from
 * the AST. `null` when no such call resolves — A6 refuses that rather than passing on it.
 * A spread is reported as `…<expr>` and a computed key as `<computed>`, so neither can smuggle
 * a field past an exact-set assertion.
 */
function importedCampaignArgKeys(src) {
  let ast;
  try { ast = parse(src, PARSE_OPTIONS); } catch { return null; }
  let keys = null;
  walkAst(ast, (node) => {
    if (node.type !== 'CallExpression') return;
    const callee = node.callee;
    const name = callee.type === 'Identifier' ? callee.name
      : (callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier'
        ? callee.property.name : null);
    if (name !== 'createImportedCampaign') return;
    const arg = node.arguments[1];
    if (!arg || arg.type !== 'ObjectExpression') return;
    keys = arg.properties.map((prop) => {
      if (prop.type === 'SpreadElement') return `…${src.slice(prop.argument.range[0], prop.argument.range[1])}`;
      if (prop.key && prop.key.type === 'Identifier' && !prop.computed) return prop.key.name;
      return '<computed>';
    }).sort();
  });
  return keys;
}

/**
 * Every `worldState` property READ or object KEY in a source, named by the function that holds
 * it. AST-based on purpose: a text probe would red on the word appearing in a comment, and the
 * claim A6 makes is about CODE. Returns `['<unparsed>']` rather than `[]` on a parse failure,
 * so a broken parse can never read as "no reads".
 */
function worldStateTouchesIn(src) {
  let ast;
  try { ast = parse(src, PARSE_OPTIONS); } catch { return ['<unparsed>']; }
  const out = new Set();
  walkAst(ast, (node, ancestors) => {
    const isRead = node.type === 'MemberExpression' && !node.computed
      && node.property.type === 'Identifier' && node.property.name === 'worldState';
    const isKey = node.type === 'Property' && !node.computed
      && node.key && node.key.type === 'Identifier' && node.key.name === 'worldState';
    if (!isRead && !isKey) return;
    const owner = innermostNamed(ancestors);
    out.add(`${owner ? owner.name : '<top-level>'}:${isRead ? 'read' : 'key'}`);
  });
  return [...out].sort();
}

// ── END SCANNER ──────────────────────────────────────────────────────────────────────

const PROMOTER = 'PROMOTER';
const FORWARD = 'FORWARD';

/**
 * ⭐ THE DECLARED CENSUS — eleven rows, measured at `7f0621fdb`, and DELIBERATELY WIDER than
 * the promoter set. Declaring every saved-record settlement writer (not only the three that
 * read a snapshot) is what makes the totality arm purely syntactic: a promoter cannot hide by
 * looking like a forward writer, because BOTH are declared and a class flip reds in A3.
 *
 * ⛔ APPENDED, NEVER REORDERED: A3's planted controls index this array by name, and A4 pins
 * the promoter subset as an exact sorted list.
 *
 * `why` for a PROMOTER is the veil sentence. `why` for a FORWARD row is what makes it not a
 * promotion — a claim A3 re-derives from source every run rather than believing.
 */
const CENSUS = Object.freeze([
  {
    file: 'src/store/campaignPulseHelpers.js', fn: 'applyWorldPulseResultToState', sites: 1, shapes: 'W2', kind: FORWARD,
    why: 'the row is replaced by `nextSave`, whose settlement is the pulse\'s FORWARD result for this tick; nothing on this path reads a timeline, a ring or a draft history.',
  },
  {
    file: 'src/store/campaignPulseHelpers.js', fn: 'drainCampaignQueueIntoState', sites: 1, shapes: 'W2', kind: FORWARD,
    why: 'the settlement is `u.settlement` off a `drainQueuedEvents` update — the queued player intentions resolved forward at this tick, never a restore.',
  },
  {
    file: 'src/store/campaignRegionalSlice.js', fn: 'applyQueuedRegionalImpact', sites: 1, shapes: 'W2', kind: FORWARD,
    why: '`applyRegionalImpact(save.settlement, …)` derives the next settlement from the LIVE row it is about to replace; the impact is a campaign directive, not a stored settlement.',
  },
  {
    file: 'src/store/campaignRegionalSlice.js', fn: 'resolveRegionalImpact', sites: 1, shapes: 'W2', kind: FORWARD,
    why: '`withoutActiveCondition(save.settlement, …)` subtracts one condition from the LIVE row; the value written is the live settlement minus a condition, not a restored one.',
  },
  {
    file: 'src/store/campaignWorldPulseDeferred.js', fn: 'restorePulseSnapshotOnDraft', sites: 1, shapes: 'W2', kind: PROMOTER,
    reads: 'snapshot.saves[i].settlement — a `capturePulseSnapshot` pre-act clone, reached from the session `pulseUndoStack`, the session `proposalUndoStack`, or the PARKED `worldState.pausedAdvance.preIntervalUndo`',
    persists: 'persistUpdates.push({ saveId, settlement, campaignState }), flushed by flushWorldPulsePersist in both callers',
    why: 'THE VEIL HOLDS AT THE DOOR, NOT BY A STRIP: the account import MINTS a fresh campaign world and reads the incoming one NOWHERE — `accountImportBody.js` hands `createImportedCampaign` exactly `{settlementIds, contentBinding, contentBindingHistory}`, `campaignImportedCreation.js:57` answers `worldState: createNewCampaignWorldState(...)`, and `importReconciliationAdmission.js:396` DECLARES the refusal as `world_state_not_imported`. So although a paused advance can park this snapshot durably on a campaign record, no foreign snapshot can ever arrive on one. PINNED in A6, because that premise is the whole sentence. (The way OUT is CLOSED TOO: `preflightAccountExport` now passes every campaign through `withoutParkedSnapshotEditState`, so the parked snapshot\'s member settlements leave the account STRIPPED and the veil holds through the export door — EM-B3f, export-only.)',
  },
  {
    file: 'src/store/canonEventCommandTransaction.js', fn: 'runCanonEventCommandTransaction', sites: 1, shapes: 'W2', kind: FORWARD,
    why: '`remote.settlement` is the reconciliation session\'s SERVER-AUTHORITATIVE row for this command, projected back into the cache; it is a fetch result, not a local timeline element.',
  },
  {
    file: 'src/store/npcVerbsBody.js', fn: 'commitVerbResult', sites: 1, shapes: 'W1', kind: FORWARD,
    why: '`result.settlement` is the verb\'s forward outcome. This function is the RECORDER of the undo ring, not a reader of it: its `priorSettlement` parameter is only written INTO the ring, never back onto the row.',
  },
  {
    file: 'src/store/npcVerbsBody.js', fn: 'runUndoLastNpcVerb', sites: 1, shapes: 'W1', kind: PROMOTER,
    reads: 'entry.priorSettlement, popped from the session ring state.npcVerbUndoStack',
    persists: 'writes = [{ saveId, partial: { settlement: cloneJson(entry.priorSettlement) } }], flushed by flushSaveWrites',
    why: 'THE VEIL HOLDS BY CONSTRUCTION: `npcVerbUndoStack` is SESSION-ONLY — declared as an empty array in the slice\'s initial state (A5), persisted NOWHERE, and riding NEITHER door in nor out. Every settlement it can promote was captured in this session from a row this account already held, so nothing it restores can have arrived from outside.',
  },
  {
    file: 'src/store/settlementRenameHelpers.js', fn: 'renameSettlementImpl', sites: 1, shapes: 'W2', kind: FORWARD,
    why: 'the settlement written is `{ ...(save.settlement || {}), name: trimmed }` — the LIVE row with one field changed.',
  },
  {
    file: 'src/store/settlementSlice.js', fn: 'destroySavedSettlement', sites: 1, shapes: 'W2', kind: FORWARD,
    why: '`domainDestroySettlement(save.settlement || {}, destroyEvent)` transforms the LIVE row forward into its destroyed shape; a destroy reads no prior state but the one it destroys.',
  },
  {
    file: 'src/store/settlementVersionHistoryActions.js', fn: 'revertToSnapshotAction', sites: 1, shapes: 'W1', kind: PROMOTER,
    reads: 'target.settlement, found in the SAVED ENTRY\'s versionHistory (or state.draftVersionHistory for an unsaved session)',
    persists: 'persistSaveUpdate(targetSaveId, { settlement, versionHistory, campaignState? })',
    why: 'THE VEIL IS EM-B3e\'s, AND IT IS NOT LANDED AT THIS TIP. The entry\'s `versionHistory` rides the account door with `restoreLifecycle: true` and rides the export whole, so until EM-B3e strips `entry.versionHistory[i].settlement` on both halves a promoted snapshot is NOT provably the account\'s own (EM-B3d VERIFY FIX-1). Inert today — nothing in src/ writes either key — and EM-B3e must land before EM-C4a, which is the first writer.',
  },
  {
    file: 'src/store/settlementGenerateAction.js', fn: 'generateSettlementAction', sites: 1, shapes: 'W1', kind: FORWARD,
    why: 'EM-F2\'s PHANTOM PROMOTION, and the word collides with this census\'s class rather than joining it. A PROMOTER here is "a settlement read from a snapshot / version-history element / undo stack / draft history"; what this site writes is the settlement the PIPELINE HAS JUST FORGED on this call, from the seed the phantom record carries — a world minted a few statements above the write, not one restored from anywhere. No timeline, ring or draft history is read on the path (the trace finds no substrate word, which is A3\'s own re-derivation of this sentence), and the only value taken off the saved record is the LIVE blob beside it: `carriedHistoryOf` folds the keys the row itself already held — the back-link\'s reciprocal edge, the decree rows — over the forge, and never over a key the forge wrote. So this is a FORWARD write in this census\'s sense, computed from the live row and a fresh generation; nothing a snapshot substrate could hold can reach a saved record through it. The row it lands on is the phantom\'s own, replaced in place on the same primary key so every back-link already pointing at it still resolves.',
  },
  {
    file: 'src/store/editSlice.js', fn: 'applyRosterDecreesAtTick', sites: 1, shapes: 'W2', kind: FORWARD,
    why: 'EM-E8\'s tick half (C): the settlement written is the ACTIVE row\'s live settlement with the roster decrees that fell due at this tick applied forward — a newcomer minted, a departure struck — computed from the live record and the decree rows the row itself already held; no timeline, ring, snapshot or draft history is read on the path (A3 re-derives this from source every run). Re-recorded at the train tip by the chair, 2026-09-23 (judgment 271\'s idiom: a register moved by a landed member is re-recorded once, at the tip, with its cause named).',
  },
  {
    file: 'src/store/editSlice.js', fn: 'scrubDeletedCounterparty', sites: 1, shapes: 'W2', kind: FORWARD,
    why: 'EM-F3d\'s DELETE SCRUB (the verifier\'s STOP-2; the chair\'s judgments 291 and 308): the settlement written is the member row\'s OWN live settlement with its OWN registry moved one status forward — every PENDING entry whose off-stage op named the row the DM has just deleted is withdrawn through EM-C1\'s typed verb, with design §20.3\'s `target_deleted` reason. Both halves are read off the LIVE row an instant earlier in the same function (`get().savedSettlements`, finalized state, never a draft), the registry is rebuilt by a pure verb that copies each entry it does not amend, and no key outside `decrees` is touched — so nothing a timeline, undo ring, version history or draft history could hold can reach a saved record through it. An APPLIED entry is never selected, which is what keeps THE PROMISE here: the scrub can move what has not happened yet and nothing that has.',
  },
]);

const DECLARED = CENSUS.map((row) => `${row.file}::${row.fn}\t${row.sites}\t${row.shapes}`).sort();

function walkSrc(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.jsx?$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walkSrc(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();
const CORPUS = SRC_FILES.map((rel) => ({ rel, src: readFileSync(join(ROOT, rel), 'utf8') }));
const DERIVED = censusRows(CORPUS);
const SOURCE = new Map(CORPUS.map(({ rel, src }) => [rel, src]));

/** Synthetic sources — every planted control below drives `sitesIn`, never a re-implementation. */
const PLANT = Object.freeze({
  w1Indexed: 'function act(set) { set(s => { s.savedSettlements[idx].settlement = cloneJson(target.settlement); }); }',
  w1Bound: 'function savedEntryFor(state, id) {\n  return state.savedSettlements.find(e => e.id === id);\n}\nfunction act(state) { const row = savedEntryFor(state, id); row.settlement = entry.priorSettlement; }',
  w2Literal: 'function act(state) { state.savedSettlements[i] = { ...state.savedSettlements[i], settlement: restored, timestamp: now }; }',
  w2Whole: 'function act(state) { const nextSave = { ...save, settlement: next }; state.savedSettlements[i] = nextSave; }',
  liveViewOnly: 'function act(state) { state.savedSettlements.length; state.settlement = nextSettlement; }',
  noSettlement: 'function act(state) { state.savedSettlements[i] = { ...save, campaignState, timestamp: now }; }',
  proseOnly: '// state.savedSettlements[i].settlement = cloneJson(target.settlement)\nconst savedSettlements = 1;',
  fromHistory: 'function act(state) { const history = state.savedSettlements.find(e => e.id === id).versionHistory; const target = history.find(s => s.id === snapId); state.savedSettlements[i].settlement = cloneJson(target.settlement); }',
  fromRing: 'function act(state) { const ring = state.npcVerbUndoStack; const entry = ring[at]; state.savedSettlements[i].settlement = entry.priorSettlement; }',
  fromLive: 'function act(state) { const save = state.savedSettlements[i]; const next = { ...save.settlement, name: trimmed }; state.savedSettlements[i] = { ...save, settlement: next }; }',
  // A6's counterforce, in miniature: an import envelope that carries the INCOMING world.
  importsWorldState: 'async function body(get) { await get().createImportedCampaign(name, { settlementIds: ids, contentBinding: b, worldState: rawCampaign.worldState }); }',
  importsMintedOnly: 'async function body(get) { await get().createImportedCampaign(name, { settlementIds: ids, contentBinding: b, contentBindingHistory: h }); }',
});

/** The three files A6's premise rests on, named once so a message and an assertion agree. */
const IMPORT_BODY_REL = 'src/store/accountImportBody.js';
const IMPORT_CREATION_REL = 'src/store/campaignImportedCreation.js';
const ADMISSION_REL = 'src/lib/importReconciliationAdmission.js';

describe('TOOL-30 — the snapshot-promotion census', () => {
  test('A1 — the scan is live and the predicate discriminates, in both directions', () => {
    expect(SRC_FILES.length, 'the src walk found nothing — every equality below would be vacuous').toBeGreaterThan(1500);
    expect(DERIVED.filter((r) => r.shapes.includes('PARSE-FAILED')).map((r) => r.file), 'espree could not parse a src file — a file the lint gate reads, this must read').toEqual([]);
    // The matcher FIRES before any absence is read, on each shape the estate really wears.
    expect(sitesIn(PLANT.w1Indexed).map((s) => s.shape), 'W1 through an indexed row stopped matching').toEqual(['W1']);
    expect(sitesIn(PLANT.w1Bound).map((s) => s.via), 'the one-hop helper binding stopped resolving — npcVerbsBody would drop out silently').toEqual(['bound-via-savedEntryFor']);
    expect(sitesIn(PLANT.w2Literal).map((s) => s.shape), 'W2 through an object literal stopped matching').toEqual(['W2']);
    expect(sitesIn(PLANT.w2Whole).map((s) => s.shape), 'W2 through a whole-row value stopped matching').toEqual(['W2']);
    // …and it REFUSES the three near-misses, or the roster would be noise.
    expect(sitesIn(PLANT.liveViewOnly), 'a write to the LIVE view is not a write to a saved record').toEqual([]);
    expect(sitesIn(PLANT.noSettlement), 'a row replacement carrying no settlement is not a settlement write').toEqual([]);
    expect(sitesIn(PLANT.proseOnly), 'the scanner matched a COMMENT — espree excludes comments by construction, so this means the parse was skipped').toEqual([]);
    // ANTI-VACUITY, both ends: an empty corpus yields nothing, and the live one is in regime.
    expect(censusRows([]), 'the row builder must yield nothing on an empty corpus').toEqual([]);
    const totalSites = DERIVED.reduce((sum, row) => sum + row.sites, 0);
    expect(totalSites, 'the saved-record write census collapsed — STOP and re-measure before trusting any arm below').toBeGreaterThanOrEqual(8);
    expect(DERIVED.filter((r) => r.snapshot).length, 'the PROMOTER set is empty — every veil sentence below would be vacuous').toBeGreaterThanOrEqual(1);
  });

  test('A2 — TOTALITY: the derived roster is SET-EQUAL to the declared census, both directions, sites included', () => {
    const derived = DERIVED.map((row) => `${row.file}::${row.fn}\t${row.sites}\t${row.shapes}`).sort();
    const undeclared = derived.filter((row) => !DECLARED.includes(row));
    const vanished = DECLARED.filter((row) => !derived.includes(row));
    // Direction 1 — a NEW writer, or a SECOND write inside an already-declared action (the
    // exact shape EM-B3e's pre-proof §4 said neither of its arms convicts), lands here by
    // file, function and count.
    expect(
      undeclared,
      '\nA site writes a settlement onto a LIVE saved record and is not in the declared census'
      + ' (a new row, or an extra write inside a declared one — the count is part of the key).'
      + ' If it reads a snapshot, an undo ring or a draft history, it is a PROMOTER: declare it'
      + ' WITH the sentence saying why the veil holds through it. If it computes the settlement'
      + ' forward from the live row, declare it FORWARD with what makes that true.'
      + ' Never delete a row to green this walker.\n  ' + undeclared.join('\n  ') + '\n',
    ).toEqual([]);
    // Direction 2 — a renamed, relocated or retired writer must lose its row in the same
    // commit, or the census starts describing a tree that no longer exists.
    expect(
      vanished,
      '\nA declared census row no longer resolves. Re-aim it at the moved function — a rename'
      + ' is exactly how a promoter leaves an enumeration while still promoting.\n  '
      + vanished.join('\n  ') + '\n',
    ).toEqual([]);
    expect(derived).toEqual(DECLARED);
  });

  test('A3 — the declared CLASS agrees with the traced source, both directions', () => {
    const byKey = new Map(DERIVED.map((row) => [`${row.file}::${row.fn}`, row]));
    const disagreements = [];
    for (const row of CENSUS) {
      const derived = byKey.get(`${row.file}::${row.fn}`);
      if (!derived) continue; // A2 owns absence; this arm owns class.
      const traced = derived.snapshot ? PROMOTER : FORWARD;
      if (traced !== row.kind) {
        disagreements.push(`${row.file}::${row.fn}: declared ${row.kind}, source traces ${traced}`
          + (derived.hits.length ? ` (${derived.hits.join(', ')})` : ''));
      }
    }
    // A FORWARD row that starts reading a timeline is a promotion nobody announced; a
    // PROMOTER row that stops reading one is a stale veil sentence. Both red here.
    expect(
      disagreements,
      '\nA census row\'s declared class no longer matches what its source reads:\n  '
      + disagreements.join('\n  ') + '\n',
    ).toEqual([]);
    // PLANTED CONTROLS on the same trace the live arm uses, so the agreement above is not a
    // snapshot of itself: a version-history source and an undo-ring source must classify
    // PROMOTER, and a live-row source must classify FORWARD.
    expect(sitesIn(PLANT.fromHistory)[0].snapshot, 'a settlement taken from a versionHistory element must classify PROMOTER').toBe(true);
    expect(sitesIn(PLANT.fromRing)[0].snapshot, 'a settlement taken from an undo ring must classify PROMOTER').toBe(true);
    expect(sitesIn(PLANT.fromLive)[0].snapshot, 'a settlement derived from the LIVE row must classify FORWARD').toBe(false);
    expect(sitesIn(PLANT.fromHistory)[0].hits, 'the trace must name the substrate it followed').toContain('versionHistory');
  });

  test('A4 — every declared PROMOTER is an EXECUTED promotion: it reads a substrate, it writes the row, and it persists', () => {
    const promoters = CENSUS.filter((row) => row.kind === PROMOTER);
    // ⛔ AN EXACT SORTED LIST, never a length: a rename plus an addition keeps a count honest.
    expect(
      promoters.map((row) => `${row.file}::${row.fn}`).sort(),
      'the promoter roster moved. A NEW promoter is a veil decision, not a lane\'s: declare it'
      + ' with its sentence and tell the chair. A promoter that LEFT must lose its row here.',
    ).toEqual([
      'src/store/campaignWorldPulseDeferred.js::restorePulseSnapshotOnDraft',
      'src/store/npcVerbsBody.js::runUndoLastNpcVerb',
      'src/store/settlementVersionHistoryActions.js::revertToSnapshotAction',
    ]);
    const thin = CENSUS.filter((row) => String(row.why || '').trim().length < 60).map((row) => `${row.file}::${row.fn}`);
    expect(thin, 'a census row carries no written reason — the sentence IS the contract').toEqual([]);
    const unproven = [];
    for (const row of promoters) {
      const src = SOURCE.get(row.file) || '';
      if (!src) { unproven.push(`${row.file}: the file vanished`); continue; }
      if (!String(row.reads || '').trim()) unproven.push(`${row.file}::${row.fn}: declares no substrate it reads`);
      if (!String(row.persists || '').trim()) unproven.push(`${row.file}::${row.fn}: declares no persistence`);
      // The promotion is DURABLE, not merely in-memory: each promoter's file must still reach
      // the persistence layer. A promoter that stopped persisting is a different defect class
      // (a view that lies) and must be re-declared rather than quietly kept here.
      if (!/persistSaveUpdate|persistUpdates|flushSaveWrites/.test(src)) {
        unproven.push(`${row.file}::${row.fn}: no persistence writer left in the file — the declared \`persists\` is stale`);
      }
    }
    expect(unproven, `\nA declared promoter no longer proves itself:\n  ${unproven.join('\n  ')}\n`).toEqual([]);
  });

  test('A5 — THE SUBSTRATES: two of the three are session-only BY CONSTRUCTION, and the third is not', () => {
    // The veil sentences on the two ring-backed promoters rest on these declarations. If a
    // ring ever became persisted state, the sentence "it cannot have arrived through an import
    // door" stops being true and must be re-argued — which is why this is a measurement.
    const pulseSlice = SOURCE.get('src/store/campaignWorldPulseSlice.js') || '';
    const npcSlice = SOURCE.get('src/store/npcVerbsSlice.js') || '';
    expect(pulseSlice, 'campaignWorldPulseSlice.js must still declare the two session rings').toContain('pulseUndoStack: []');
    expect(pulseSlice).toContain('proposalUndoStack: []');
    expect(npcSlice, 'npcVerbsSlice.js must still declare the npc-verb session ring').toContain('npcVerbUndoStack: []');
    // …and the THIRD source is a settlement-bearing tree parked on a PERSISTED record. Both
    // halves are asserted from source rather than remembered: the capture embeds member
    // settlements, and the parked reader reaches inside the campaign's own worldState.
    const pulseHelpers = SOURCE.get('src/store/campaignPulseHelpers.js') || '';
    const captureAt = pulseHelpers.indexOf('export function capturePulseSnapshot');
    expect(captureAt, 'capturePulseSnapshot moved — promoter 3\'s declared source is unresolved').toBeGreaterThan(-1);
    expect(
      /settlement:\s*cloneJson\(s\.settlement\)/.test(pulseHelpers.slice(captureAt)),
      'capturePulseSnapshot stopped embedding member settlements — promoter 3\'s veil sentence,'
      + ' and the export exposure it records, must be re-measured before this row is trusted',
    ).toBe(true);
    expect(
      SOURCE.get('src/store/campaignSliceShared.js') || '',
      'the parked pre-interval snapshot must still be read off the campaign record — that path'
      + ' is why promoter 3\'s source is NOT session-only, and why A6 has to pin the door',
    ).toContain('worldState?.pausedAdvance?.preIntervalUndo');
  });

  test('A6 — THE IMPORT MINTS A CAMPAIGN WORLD AND READS THE INCOMING ONE NOWHERE (promoter 3\'s veil)', () => {
    // ⛔ THIS ARM IS THE WHOLE OF PROMOTER 3's SENTENCE. Because that snapshot CAN be parked
    // durably on a campaign record (A5), the only thing that makes it the account's own is
    // that no foreign campaign world ever lands. The day someone imports one, this reds — and
    // promoter 3 becomes foreign-reachable in the same moment.
    const importBody = SOURCE.get(IMPORT_BODY_REL) || '';
    const creation = SOURCE.get(IMPORT_CREATION_REL) || '';
    const admission = SOURCE.get(ADMISSION_REL) || '';
    expect(importBody, `${IMPORT_BODY_REL} did not load — every absence below would be vacuous`).toBeTruthy();
    expect(creation, `${IMPORT_CREATION_REL} did not load`).toBeTruthy();
    expect(admission, `${ADMISSION_REL} did not load`).toBeTruthy();
    // (i) THE ENVELOPE, BY EXACT SET. Follow the value to the WRITE, never stop at the lib
    // envelope that merely ADMITS `campaigns` — stopping there is precisely the error this
    // arm was added to prevent.
    expect(
      importedCampaignArgKeys(importBody),
      'the createImportedCampaign envelope moved. If it gained `worldState`, promoter 3 is now'
      + ' FOREIGN-REACHABLE: a parked pre-interval pulse snapshot would arrive from another'
      + ' account\'s export and `restorePulseSnapshotOnDraft` would promote it onto live saved'
      + ' records. That is a veil decision for the chair, not a roster edit.',
    ).toEqual(['contentBinding', 'contentBindingHistory', 'settlementIds']);
    // (ii) …and not one READ of it anywhere on that path, in code (comments are not code).
    expect(
      worldStateTouchesIn(importBody),
      `${IMPORT_BODY_REL} now touches \`worldState\` in code — the import path is supposed to`
      + ' read the incoming campaign world NOWHERE',
    ).toEqual([]);
    // (iii) the minted world comes from the ONE named birth door, not from the envelope.
    expect(
      /worldState:\s*createNewCampaignWorldState\(/.test(creation),
      `${IMPORT_CREATION_REL} no longer MINTS the imported campaign's world through`
      + ' createNewCampaignWorldState — promoter 3\'s veil sentence is now unproven',
    ).toBe(true);
    // (iv) the refusal is DECLARED rather than merely true by omission.
    expect(
      admission,
      'the reconciliation admission no longer declares `world_state_not_imported` — the refusal'
      + ' this arm rests on has stopped being a stated contract',
    ).toContain('world_state_not_imported');
    // PLANTED CONTROLS, driving the SAME two functions the live arms above call.
    expect(importedCampaignArgKeys(PLANT.importsMintedOnly), 'the honest envelope shape must itself pass, or the conviction below proves nothing')
      .toEqual(['contentBinding', 'contentBindingHistory', 'settlementIds']);
    expect(importedCampaignArgKeys(PLANT.importsWorldState), 'an envelope carrying the INCOMING world must be convicted by name')
      .toEqual(['contentBinding', 'settlementIds', 'worldState']);
    expect(worldStateTouchesIn(PLANT.importsWorldState), 'the read probe must name the function that touches it').toEqual(['body:key', 'body:read']);
    expect(worldStateTouchesIn(PLANT.importsMintedOnly), 'the read probe must stay silent on the honest shape').toEqual([]);
    expect(importedCampaignArgKeys('const x = 1;'), 'the extractor must answer null where the call does not resolve, never an empty set').toBeNull();
  });
});
