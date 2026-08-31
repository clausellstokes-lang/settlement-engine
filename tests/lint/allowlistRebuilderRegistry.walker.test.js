/**
 * allowlistRebuilderRegistry.walker.test.js — SP-W1. THE ALLOWLIST-REBUILDER CLASS,
 * closed at the seam where it actually bites.
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────────
 * An ALLOWLIST REBUILDER reconstructs an object by naming an explicit key list read
 * off ONE source binding, without spreading that source:
 *
 *     return { id: entry.id, kind: entry.kind, … };     // no `...entry`
 *
 * When such a rebuilder sits on a persistence door, a key a PRODUCER sets and the
 * rebuilder does not name is dropped — silently, on the one path an author never
 * re-reads. `region/wizardNews.js`'s `normalizeEntry` is the worked example and the
 * sharpest case in the estate, because it runs on BOTH doors: at mint time through
 * `appendWizardNewsEntries`, and again over persisted save data on every read through
 * `ensureWizardNewsFeed`. A key it does not name therefore dies at the first append
 * AND again on every load, leaving any reader of that key dead against every feed.
 *
 * ── WHAT ACTUALLY HAPPENED, MEASURED RATHER THAN RECITED ─────────────────────────
 * The class is filed as "three bites". Measured against the history, the three have
 * DIFFERENT anatomies, and saying so is the point — a habitat is removed by the shape
 * of the hole, not by the count of falls:
 *
 *   • `covert` — a READER shipped without the key surviving. `generateWorldBook.js`'s
 *     player-face `isCovertEntry` filter landed 2026-07-20 reading `covert`;
 *     normalizeEntry stripped it, so the branch was dead against every persisted feed
 *     until SB2 opened the key the next day. Producers arrived twelve days later.
 *   • `npcIds`/`factionIds` — producer and rebuilder landed together (5f8dc7830). No
 *     rebuilder gap. The later defect was producer-side: `warRulingsNews.js` carried a
 *     `factionIds` spread whose `factionId` nothing ever resolved (cured 9ecec2a2b).
 *   • `region` — producer and rebuilder landed together, caught pre-ship by review.
 *
 * The invariant under all three is ONE fact, and it is the one asserted below:
 * A KEY THAT APPEARS ON A NEWS ROW ANYWHERE IN THE ESTATE BUT IS NOT NAMED BY THE
 * REBUILDER IS DEAD AGAINST EVERY PERSISTED FEED — whether the mismatch arrives from
 * the reader side, the producer side, or both at once.
 *
 * And the class is LIVE, not historical. Eight such keys are minted today across
 * TEN producer sites (the frozen ledger below). The plainest is `parties`:
 * `peaceTerms.js` mints it on the treaty signing beat under a comment reading
 * "`parties` is retained because the treaty ledger's own readers speak it" — and
 * normalizeEntry drops it on the way in, so it is retained nowhere at all. A comment
 * stating an intention the mechanism defeats is exactly what a walker is for.
 *
 * ── WHY A PRODUCER SCAN AND NOT A TYPEDEF ────────────────────────────────────────
 * The obvious cheaper basis — pin the rebuild's key list against the file's own
 * `RawWizardNewsEntry` typedef — was MEASURED AND REJECTED. Producer and rebuilder
 * live in different files; the typedef lives with the REBUILDER. An author adding
 * `region:` to a literal in `armyTransitKernel.js` touches neither, so a
 * typedef-vs-rebuild pin agrees with itself while the field dies. Only a basis that
 * reads the PRODUCER can see this class.
 *
 * ── THE PRODUCER RULE: TWO DOORS, BOTH LOAD-BEARING ──────────────────────────────
 * A producer site is an object literal satisfying EITHER door:
 *   A · HOUSE ID — it names `id` and that id's source text mentions `wizard_news.`,
 *       the house mint shape `assertAuthoredEntriesCarryIds` itself prescribes.
 *   B · REQUIRED SHAPE — it names all of id + kind + headline + severity +
 *       settlementIds (the estate's own authoring-census REQUIRED_FIELDS, plus the
 *       kind/headline pair that census keys on).
 *
 * NEITHER DOOR IS SUFFICIENT ALONE, and that was measured, not assumed: door A alone
 * misses six sites in five files whose id is computed into a variable
 * (`realmVerbExecution.js`, `pulseHelpers.js`, `narrativeTempo.js`, `tableEvents.js`
 * and `wizardNews.js` itself); door B alone misses one site door A catches. MEASURED at
 * acaaad63f: 88 sites in 55 files — 81 through both doors, 6 door B only, 1 door A only.
 * `id` is REQUIRED on door B for a measured reason: without it the rule swept in
 * `chronicleGraph.js`'s ChronicleNode literals — a foreign shape that would have
 * forced five fictional rows into the frozen ledger below. normalizeEntry refuses an
 * id-less row outright, so a literal with no `id` can never be a feed entry.
 *
 * SCOPE, AND ITS ONE MEASURED EXCLUSION: the scan is every `.js` under `src/`
 * (1,563 files, ZERO parse failures — asserted, so a file that stops parsing reds
 * instead of leaving the denominator quietly). `.jsx` is excluded because components
 * render news and do not mint it — and that exclusion is MEASURED below, not assumed:
 * no `.jsx` file in the tree contains the house id token at all.
 *
 * ── THE TWO FROZEN LEDGERS, BOTH SHRINK-ONLY ─────────────────────────────────────
 *   1. KNOWN_DROPPED_KEYS — keys a producer mints today that the rebuilder drops.
 *      Each carries a written reason. A NEW dropped key REDS (that is the class cure);
 *      a CURED key also REDS, demanding its now-stale row be deleted so the win is
 *      banked. The list may only shrink; nothing may buy itself a row.
 *   2. CLASS_ROSTER — the exact set of allowlist rebuilders in the three trees that
 *      hold persisted shape (`worldPulse/`, `region/`, `store/`) at >= 8 aligned keys.
 *      A NEW one REDS, so a rebuilder cannot join the estate unreviewed. Rows are
 *      keyed by module + function and NOT by line, so ordinary work above a site
 *      relocates nothing.
 *
 * Honesty about the roster's reach, stated rather than implied: one row is REGISTERED
 * (governed key-by-key by DIRECTION 1). The rest are recorded, classified, and NOT yet
 * paired to a producer rule — `lossy` rows would be actively wrong to govern by a
 * coverage law because dropping is their job, and `unpaired` rows simply have no
 * declared producer rule yet. They are exempt from DIRECTION 1 and they are exempt in
 * WRITING, with a reason each, which is the difference between a deferral and a hole.
 *
 * @enforced-module src/domain/region/wizardNews.js
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import { parse } from 'acorn';
import { ancestor, simple } from 'acorn-walk';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** Trees that hold shape which crosses a save boundary. */
const PERSISTED_TREES = Object.freeze([
  'src/domain/worldPulse/',
  'src/domain/region/',
  'src/store/',
]);

/** A rebuild must name at least this many aligned keys to enter the roster. */
const ROSTER_MIN_KEYS = 8;

// ── AST machinery ───────────────────────────────────────────────────────────────

function parseModule(source) {
  return parse(source, {
    ecmaVersion: 'latest', sourceType: 'module', locations: true, ranges: true,
  });
}

function walkJs(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walkJs(path, out);
    else if (/\.js$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
  }
  return out;
}

function walkJsx(dir, out = []) {
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walkJsx(path, out);
    else if (/\.jsx$/.test(entry)) out.push(path);
  }
  return out;
}

/** The static name a property declares, or null for a computed/spread one. */
function propertyName(property) {
  if (property.type !== 'Property') return null;
  if (!property.computed && property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal' && typeof property.key.value === 'string') {
    return property.key.value;
  }
  return null;
}

/** Static property names of one object literal, in source order. */
function objectKeys(node) {
  const keys = [];
  for (const property of node.properties) {
    const name = propertyName(property);
    if (name) keys.push(name);
  }
  return keys;
}

/** The root identifier of a member chain: `a.b.c` -> 'a'. */
function memberRoot(node) {
  let current = node;
  for (let depth = 0; current?.type === 'MemberExpression' && depth < 8; depth += 1) {
    current = current.object;
  }
  return current?.type === 'Identifier' ? current.name : null;
}

/** The first member-expression root inside an expression, unwrapping the wrappers a
 *  rebuild routinely puts around a read (`compactIds(entry.tags)`, `x || y`, `a ? b : c`). */
function sourceRootOf(node, depth = 0) {
  if (!node || depth > 8) return null;
  if (node.type === 'MemberExpression') return memberRoot(node);
  if (node.type === 'ChainExpression') return sourceRootOf(node.expression, depth + 1);
  if (node.type === 'UnaryExpression') return sourceRootOf(node.argument, depth + 1);
  if (node.type === 'LogicalExpression' || node.type === 'BinaryExpression') {
    return sourceRootOf(node.left, depth + 1) || sourceRootOf(node.right, depth + 1);
  }
  if (node.type === 'ConditionalExpression') {
    return sourceRootOf(node.test, depth + 1)
      || sourceRootOf(node.consequent, depth + 1)
      || sourceRootOf(node.alternate, depth + 1);
  }
  if (node.type === 'CallExpression' || node.type === 'ArrayExpression') {
    const parts = node.type === 'CallExpression' ? node.arguments : node.elements;
    for (const part of parts) {
      const root = sourceRootOf(part, depth + 1);
      if (root) return root;
    }
  }
  return null;
}

/** The property name an expression reads off its source: `entry.tags` -> 'tags'. */
function readKeyOf(node, depth = 0) {
  if (!node || depth > 8) return null;
  if (node.type === 'MemberExpression') {
    if (!node.computed && node.property.type === 'Identifier') return node.property.name;
    if (node.property.type === 'Literal' && typeof node.property.value === 'string') {
      return node.property.value;
    }
    return null;
  }
  if (node.type === 'ChainExpression') return readKeyOf(node.expression, depth + 1);
  if (node.type === 'LogicalExpression') {
    return readKeyOf(node.left, depth + 1) || readKeyOf(node.right, depth + 1);
  }
  if (node.type === 'ConditionalExpression') {
    return readKeyOf(node.test, depth + 1)
      || readKeyOf(node.consequent, depth + 1)
      || readKeyOf(node.alternate, depth + 1);
  }
  if (node.type === 'CallExpression') {
    for (const argument of node.arguments) {
      const key = readKeyOf(argument, depth + 1);
      if (key) return key;
    }
  }
  return null;
}

/** The nearest enclosing declared name, so a roster row reads like an address. */
function enclosingName(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const node = ancestors[i];
    if (node.type === 'FunctionDeclaration' && node.id) return node.id.name;
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier') return node.id.name;
    if (node.type === 'MethodDefinition' && node.key?.type === 'Identifier') return node.key.name;
    if (node.type === 'Property' && node.key?.type === 'Identifier') return node.key.name;
  }
  return '(anonymous)';
}

/**
 * The identifier a spread ultimately CARRIES, unwrapping a clone/wrapper call.
 * `...raw` -> 'raw'; `...cloneObject(raw)` -> 'raw'; `...base.calendar` -> 'base'.
 */
function carriedRoot(node, depth = 0) {
  if (!node || depth > 8) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression') return memberRoot(node);
  if (node.type === 'ChainExpression') return carriedRoot(node.expression, depth + 1);
  if (node.type === 'LogicalExpression') {
    return carriedRoot(node.left, depth + 1) || carriedRoot(node.right, depth + 1);
  }
  if (node.type === 'ConditionalExpression') {
    return carriedRoot(node.consequent, depth + 1) || carriedRoot(node.alternate, depth + 1);
  }
  if (node.type === 'CallExpression') {
    for (const argument of node.arguments) {
      const root = carriedRoot(argument, depth + 1);
      if (root) return root;
    }
  }
  return null;
}

/**
 * ONE-HOP LOCAL ALIASES: `const shallowRaw = cloneObject(raw)` means a later
 * `...shallowRaw` really carries `raw`. Without this hop the detector convicts
 * worldState.js's hydrator, whose unnamed keys ride through exactly that alias —
 * a FALSE conviction, which in a frozen roster is a written lie rather than a gap.
 */
function aliasRoots(ast) {
  const aliases = new Map();
  simple(ast, {
    VariableDeclarator(node) {
      if (node.id?.type !== 'Identifier' || !node.init) return;
      const root = carriedRoot(node.init);
      if (root && root !== node.id.name) aliases.set(node.id.name, root);
    },
  });
  return aliases;
}

/**
 * THE CLASS DETECTOR. Every object literal in one module that rebuilds >= minKeys keys
 * off ONE source binding under the SAME names, and does not spread that source (which
 * would carry the unnamed keys through and take it out of the class).
 */
export function allowlistRebuilds(source, minKeys = ROSTER_MIN_KEYS) {
  const found = [];
  const ast = parseModule(source);
  const aliases = aliasRoots(ast);
  const visit = (node, ancestors) => {
    const bySource = new Map();
    const spreadWhole = new Set();
    for (const property of node.properties) {
      if (property.type === 'SpreadElement') {
        const argument = property.argument;
        // `...{ k: v }` and the house `...(cond ? { k: v } : {})` NAME their keys — they
        // are part of the allowlist, not a carry. Everything else that resolves to the
        // source is a WHOLE-SOURCE CARRY and takes the literal out of the class.
        // ⚠ `...cloneObject(raw)` is such a carry and a bare-identifier check MISSES it:
        // measured on worldState.js's hydrator, which a first spelling of this detector
        // convicted while the source's unnamed keys were riding through the clone.
        const namesItsKeys = argument.type === 'ObjectExpression'
          || (argument.type === 'ConditionalExpression'
            && argument.consequent.type === 'ObjectExpression'
            && argument.alternate.type === 'ObjectExpression');
        if (!namesItsKeys) {
          const root = carriedRoot(argument);
          if (root) spreadWhole.add(aliases.get(root) || root);
        }
        continue;
      }
      const name = propertyName(property);
      if (!name) continue;
      const from = sourceRootOf(property.value);
      if (!from || readKeyOf(property.value) !== name) continue;
      if (!bySource.has(from)) bySource.set(from, []);
      bySource.get(from).push(name);
    }
    for (const [from, keys] of bySource) {
      if (keys.length < minKeys || spreadWhole.has(from)) continue;
      found.push({
        fn: enclosingName(ancestors),
        line: node.loc.start.line,
        from,
        keys: [...keys],
      });
    }
  };
  ancestor(ast, {
    ObjectExpression(node, _state, ancestors) { visit(node, ancestors.slice(0, -1)); },
  });
  return found;
}

/**
 * The key list one named rebuilder EMITS, read from its own returned literal — never
 * hand-copied, so the rebuild and the assertion cannot drift. Reads the top-level
 * properties plus the house byte-neutral idiom `...(cond ? { key: value } : {})`,
 * and deliberately does NOT descend into a nested sub-record.
 */
export function emittedKeys(source, fnName) {
  const ast = parseModule(source);
  let body = null;
  simple(ast, {
    FunctionDeclaration(node) { if (node.id?.name === fnName) body = node.body; },
    VariableDeclarator(node) {
      if (node.id?.type !== 'Identifier' || node.id.name !== fnName) return;
      if (node.init?.body?.type === 'BlockStatement') body = node.init.body;
    },
  });
  if (!body) return { found: false, keys: new Set(), spreadsSource: false };

  let literal = null;
  simple(body, {
    ReturnStatement(node) {
      if (!literal && node.argument?.type === 'ObjectExpression') literal = node.argument;
    },
  });
  if (!literal) return { found: true, keys: new Set(), spreadsSource: false };

  const keys = new Set();
  let spreadsSource = false;
  for (const property of literal.properties) {
    if (property.type === 'SpreadElement') {
      const argument = property.argument;
      if (argument.type === 'ConditionalExpression') {
        for (const branch of [argument.consequent, argument.alternate]) {
          if (branch.type === 'ObjectExpression') for (const key of objectKeys(branch)) keys.add(key);
        }
      } else if (argument.type === 'ObjectExpression') {
        for (const key of objectKeys(argument)) keys.add(key);
      } else {
        // `...entry` — a whole-source carry. The rebuild is no longer an allowlist.
        spreadsSource = true;
      }
      continue;
    }
    const name = propertyName(property);
    if (name) keys.add(name);
  }
  return { found: true, keys, spreadsSource };
}

// ── The producer rule: two doors over one composed predicate ─────────────────────

/** Door A — the house mint shape the authoring guard itself prescribes. */
export function isHouseIdSite(source, node) {
  for (const property of node.properties) {
    if (propertyName(property) !== 'id') continue;
    return source.slice(property.value.start, property.value.end).includes('wizard_news.');
  }
  return false;
}

/** Door B — the estate's own authoring REQUIRED_FIELDS, plus the routing pair. */
const REQUIRED_SHAPE = Object.freeze(['id', 'kind', 'headline', 'severity', 'settlementIds']);

export function isRequiredShapeSite(_source, node) {
  const keys = new Set(objectKeys(node));
  return REQUIRED_SHAPE.every((field) => keys.has(field));
}

/** The composed predicate. Every caller goes through this, never through one door. */
export function isProducerSite(source, node) {
  return isHouseIdSite(source, node) || isRequiredShapeSite(source, node);
}

/** Every producer site in one module, with the door(s) that admitted it. */
export function producerSites(source, rel) {
  const sites = [];
  simple(parseModule(source), {
    ObjectExpression(node) {
      if (!isProducerSite(source, node)) return;
      sites.push({
        path: rel,
        line: node.loc.start.line,
        keys: objectKeys(node),
        houseId: isHouseIdSite(source, node),
        requiredShape: isRequiredShapeSite(source, node),
      });
    },
  });
  return sites;
}

// ── The scan ────────────────────────────────────────────────────────────────────

const srcFiles = [];
const parseFailures = [];
for (const absolute of walkJs(SRC)) {
  const rel = relative(ROOT, absolute).replace(/\\/g, '/');
  const source = readFileSync(absolute, 'utf8');
  try {
    parseModule(source);
    srcFiles.push({ rel, source });
  } catch (error) {
    parseFailures.push(`${rel}: ${error.message}`);
  }
}

const allProducerSites = srcFiles.flatMap(({ rel, source }) => producerSites(source, rel));

const liveRoster = srcFiles
  .filter(({ rel }) => PERSISTED_TREES.some((tree) => rel.startsWith(tree)))
  .flatMap(({ rel, source }) => allowlistRebuilds(source).map((site) => ({ ...site, module: rel })))
  .map((site) => ({ module: site.module, fn: site.fn, keys: site.keys.length }))
  .filter((row, index, rows) => (
    rows.findIndex((other) => other.module === row.module && other.fn === row.fn) === index
  ))
  .sort((a, b) => a.module.localeCompare(b.module) || a.fn.localeCompare(b.fn));

// ── THE REGISTRY ────────────────────────────────────────────────────────────────

const REBUILDERS = Object.freeze([
  Object.freeze({
    shape: 'wizard_news_entry',
    module: 'src/domain/region/wizardNews.js',
    rebuilder: 'normalizeEntry',
    doors: 'append (appendWizardNewsEntries) and load (ensureWizardNewsFeed) — both',
  }),
]);

/**
 * LEDGER 1 — keys a producer mints today that `normalizeEntry` does not name.
 * SHRINK-ONLY. A new key here is the class biting again and must be FIXED, never
 * added. A cured key must have its row DELETED so the win is banked.
 * Frozen 2026-08-31 at acaaad63f by lane SP-W1. MEASURED: 8 keys across 10 distinct
 * producer sites (17 key-occurrences in all — `parties` alone appears at 8 of them).
 */
const KNOWN_DROPPED_KEYS = Object.freeze([
  Object.freeze({
    key: 'parties',
    reason: 'peaceTerms + three treaty voices mint the ordered treaty pair; the address the feed'
      + ' actually reads is settlementIds, which every one of those sites also sets. ⚠ The mint'
      + ' comment claims `parties` is "retained" — it is not, and that claim is the ledger row.',
  }),
  Object.freeze({
    key: 'ending',
    reason: 'the treaty-ending token on the three treaty lifecycle voices; no feed consumer reads'
      + ' it off an entry, and the ending is already spoken in the row\'s own reasons prose.',
  }),
  Object.freeze({
    key: 'ageYears',
    reason: 'treatyLifecycleVoice stamps the lapsed pact\'s age; read only off a treaty document'
      + ' (display/treatyDocument.js), never off a news row.',
  }),
  Object.freeze({
    key: 'observedState',
    reason: 'treatyLifecycleVoice carries the compliance observation; peaceTerms reads it off the'
      + ' compliance record, never off an entry.',
  }),
  Object.freeze({
    key: 'causeClass',
    reason: 'demographicsHerald carries the typed cause beside the tags array, which already'
      + ' contains the same token and DOES survive normalization.',
  }),
  Object.freeze({
    key: 'assetId',
    reason: 'peaceTermsSale names the traded asset; read off the sale row, never off an entry.',
  }),
  Object.freeze({
    key: 'fromId',
    reason: 'peaceTermsSale names the ceding party; read off the sale row, never off an entry.',
  }),
  Object.freeze({
    key: 'toId',
    reason: 'peaceTermsSale names the receiving party; read off the sale row, never off an entry.',
  }),
]);

/**
 * LEDGER 2 — the exact set of allowlist rebuilders in the persisted trees at
 * >= ROSTER_MIN_KEYS aligned keys. Keyed by module + function, never by line, so
 * ordinary work above a site relocates nothing. A NEW row REDS: classify it, and
 * either register it (if faithful and pairable) or record it here with a reason.
 * `status` is one of:
 *   registered — governed key-by-key by DIRECTION 1 above.
 *   lossy      — dropping is its JOB. A coverage law would be actively WRONG here.
 *   unpaired   — faithful, but no declared producer rule exists for its shape yet.
 *   not-a-rebuilder — the syntactic detector misfired; it assembles a new record.
 */
const CLASS_ROSTER = Object.freeze([
  Object.freeze({
    module: 'src/domain/region/graph.js', fn: 'normalizeEdge', status: 'unpaired',
    reason: 'default-fills the canonical RegionEdge off `edge`; a graph edge field a producer sets'
      + ' and this list omits never reaches the saved regionalGraph. No producer rule declared yet.',
  }),
  Object.freeze({
    module: 'src/domain/region/graph.js', fn: 'normalized', status: 'unpaired',
    reason: 'the RegionChannel normalizer (17 keys off `channel`). Its own sibling normalizeImpact'
      + ' DOES spread its source, so the omission is an asymmetry rather than a stated policy.',
  }),
  Object.freeze({
    module: 'src/domain/region/wizardNews.js', fn: 'normalizeEntry', status: 'registered',
    reason: 'the worked example: the feed entry rebuild, run at every append AND over persisted'
      + ' save data on every read. Governed key-by-key by DIRECTION 1 against both producer doors.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/brokerageServicesPlant.js', fn: 'target', status: 'unpaired',
    reason: 'the envoy-picture address canonicalizer. It is gated by an exact-key check, so an extra'
      + ' producer key FAILS CLOSED (returns null) rather than dropping — the class cannot bite here.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/candidateEvents.js', fn: 'explanation', status: 'lossy',
    reason: 'a per-candidate roll-explanation diagnostic row; a digest by design, and'
      + ' capPersistedRollExplanations prunes it further. A coverage law would be wrong here.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/causeLifecycle.js', fn: 'stamp', status: 'lossy',
    reason: 'a display-only compromiseLifecycle read-model over the ledger record; the ledger stays'
      + ' authoritative and the stamp is re-derived each tick, so a stale field self-heals.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/demographicsHerald.js', fn: 'demographicNews', status: 'not-a-rebuilder',
    reason: 'assembles a FRESH news envelope from a caller field bag plus constants and a computed'
      + ' id; nothing is being reconstructed. ⚠ It is a PRODUCER, and its `causeClass` is dropped'
      + ' by normalizeEntry — that live drop is carried in KNOWN_DROPPED_KEYS, where it belongs.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/disinformationPlant.js', fn: 'exactTarget', status: 'unpaired',
    reason: 'the same envoy-picture canonicalizer as brokerageServicesPlant, behind the same exact-key'
      + ' gate, so shape drift FAILS CLOSED instead of dropping silently.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/espionage/espionageGauntlet.js', fn: 'dwellRisk01', status: 'not-a-rebuilder',
    reason: 'the named keys are the ARGUMENT BAG for catchChance01, which returns a number; no object'
      + ' is reconstructed and nothing is persisted from this literal.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/npcLadderState.js', fn: 'goal', status: 'unpaired',
    reason: 'the ladder record\'s read and write halves (normalizeGoal, and the byte-stable standing'
      + ' writer); both name 8 keys off the persisted shape. No producer rule declared yet.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/peaceTermsDocument.js', fn: 'treatyDocument', status: 'lossy',
    reason: 'a display read-model that flattens, renames and role-resolves a treaty ledger record;'
      + ' derived on demand and never written back, so nothing can be lost by it.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/pulseHelpers.js', fn: 'compactImpactDigest', status: 'lossy',
    reason: 'a bounded 14-field digest of impact entries, score-sorted and sliced to 18 for the'
      + ' pulse record. Compaction is the stated job; a coverage law would forbid its purpose.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/pulseHelpers.js', fn: 'compactOutcomeForHistory', status: 'lossy',
    reason: 'durable receipt compaction for pulseHistory. ⚠ THE CLASS BIT HERE TOO: its own comment'
      + ' records that dropping `covert` let a covert cause leak its headline through the receipt'
      + ' (cured 525e0979c). A lossy rebuild still needs per-field judgement — coverage is the'
      + ' wrong instrument for it, which is exactly why it is recorded here and not registered.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/pulseKernel.js', fn: 'causeLifecycleEvents', status: 'lossy',
    reason: 'a 9-id rollup of lifecycle events sliced to 24 for the pulse record, sibling to the'
      + ' corruptionEvents and factionCaptureEvents rollups. Bounded by design.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/pulseOutcomePartition.js', fn: 'deterministicExplanations', status: 'lossy',
    reason: 'the deterministic twin of candidateEvents.explanation (probability 1, roll 0, passed'
      + ' true) — the same explanation-row projection, and lossy for the same reason.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/relationshipState.js', fn: 'ensureRelationshipState', status: 'unpaired',
    reason: 'the per-edge relationship record\'s ensure/default pass over the existing row, re-run'
      + ' every tick over worldState.relationshipStates: a dropped key here is straight save-loss.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/resourceDynamicsKernel.js', fn: 'resourceProjection', status: 'lossy',
    reason: 'builds a JSON comparison KEY over the 11 chain facts a transition owns; its docstring'
      + ' states that persisted chains carry extra fields which survive the merge separately.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/routeNetworkCharter.js', fn: 'verdictOf', status: 'unpaired',
    reason: 'a total constructor filling all declared CharterVerdict properties from a partial field'
      + ' bag; verdicts are transient, so a dropped key costs a derived proposal rather than a save.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/routeNetworkCharterEvents.js', fn: 'proposalPayload', status: 'lossy',
    reason: 'projects verdict fields into the docket\'s route_charter payload contract; score, cost,'
      + ' danger, weeks and receipts are deliberately not carried across that seam.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/routeNetworkConsumersInterdiction.js', fn: 'severanceOf', status: 'unpaired',
    reason: 'a total constructor for the SeveranceReading typedef from a partial field bag; its'
      + ' output has no in-tree consumer yet, so no producer rule can be declared for it.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/routeNetworkDecay.js', fn: 'decayVerdictOf', status: 'unpaired',
    reason: 'a total constructor for the DecayVerdict typedef from a partial field bag; the sweep'
      + ' returns frozen verdicts and only edges plus news reach worldState.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/stressorsCore.js', fn: 'normalized', status: 'unpaired',
    reason: 'the persisted stressor normalizer over worldState.stressors; its tail spreads only'
      + ' ITSELF, never the source, so every stressor field must be named here to survive a save.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/successorNpc.js', fn: 'successorNpc', status: 'not-a-rebuilder',
    reason: 'mints a NEW npc with rng-drawn identity and clean flags, inheriting only the ousted'
      + ' npc\'s seat fields. ⚠ It does replace an entry in settlement.npcs, so a new SimNpc field'
      + ' would not reach a successor — that is a producer-completeness question, not this class.',
  }),
  Object.freeze({
    module: 'src/domain/worldPulse/warCoalitionDecision.js', fn: 'coalitionCallArchiveRow', status: 'lossy',
    reason: 'the "closed, id-rich" archive row shared by the join and refusal paths; carrying only'
      + ' ids and ticks is its declared contract rather than an oversight.',
  }),
  Object.freeze({
    module: 'src/store/authSlice.js', fn: 'authSignIn', status: 'unpaired',
    reason: 'replaces the whole auth slice from the sign-in result; the key list must cover the'
      + ' slice\'s declared shape, and today it does. Auth is excluded from persistence by design.',
  }),
  Object.freeze({
    module: 'src/store/authSlice.js', fn: 'authSignUp', status: 'unpaired',
    reason: 'the same whole-slice auth replacement, second of three near-identical copies —'
      + ' DRIFT BETWEEN THE THREE is the real hazard here, not a producer-side addition.',
  }),
  Object.freeze({
    module: 'src/store/authSlice.js', fn: 'initAuth', status: 'unpaired',
    reason: 'carries TWO copies of the same auth-slice literal (one off the result, one off the'
      + ' auth-change callback args), which is the third and fourth spelling of one shape.',
  }),
  Object.freeze({
    module: 'src/store/campaignSlice.js', fn: 'saveCampaignMap', status: 'unpaired',
    reason: 'writes campaign mapState as an explicit key list before persistCampaignState, so an'
      + ' unnamed mapState key is lost AT SAVE. A real door; no producer rule declared yet.',
  }),
  Object.freeze({
    module: 'src/store/persistProjection.js', fn: 'partializeStoreState', status: 'lossy',
    reason: 'the device-local zustand partialize — it IS the persistence door, and excluding auth,'
      + ' capabilities, reporter leases and generated worlds by construction is its documented point.',
  }),
]);

/**
 * Keys minted at a producer site that the registered rebuilder does not emit — the
 * whole measurement DIRECTION 1 and DIRECTION 2 read in opposite directions.
 *
 * Computed at module scope deliberately: a `describe` body must be a STRAIGHT-LINE
 * block (declarations and calls only). A bare hoisting block inside one parks the
 * whole file out of the lighting census on `SUITE_NOT_STRAIGHT_LINE`, and a parked
 * file contributes ZERO titles as evidence — measured on this very file, which
 * parked on its first refreeze for exactly that reason.
 */
function measureDroppedKeys() {
  const dropped = new Map();
  const home = srcFiles.find(({ rel }) => rel === REBUILDERS[0].module);
  if (!home) return dropped;
  const allow = emittedKeys(home.source, REBUILDERS[0].rebuilder).keys;
  for (const site of allProducerSites) {
    for (const key of site.keys) {
      if (allow.has(key)) continue;
      if (!dropped.has(key)) dropped.set(key, []);
      dropped.get(key).push(`${site.path}:${site.line}`);
    }
  }
  return dropped;
}

const droppedToday = measureDroppedKeys();

// ── Tests ───────────────────────────────────────────────────────────────────────

describe('SP-W1 allowlist-rebuilder registry — guard the guard', () => {
  test('the scan is total: every src/ .js file parsed, and none was skipped', () => {
    // A scan that silently drops files makes every absence below trivially true, and
    // "the enumeration failed open" is this estate's recorded way of losing a walker.
    expect(parseFailures, `src/ files that failed to parse:\n${parseFailures.join('\n')}`)
      .toEqual([]);
    expect(srcFiles.length, 'the src scan emptied').toBeGreaterThanOrEqual(1500);
  });

  test('the .jsx exclusion is MEASURED, not assumed', () => {
    // Components render news; they do not mint it. That is only an argument until it is
    // a measurement, so: no .jsx file in the tree carries the house mint token at all.
    const offenders = walkJsx(SRC)
      .filter((absolute) => readFileSync(absolute, 'utf8').includes('wizard_news.'))
      .map((absolute) => relative(ROOT, absolute).replace(/\\/g, '/'));
    expect(
      offenders,
      'a .jsx file mints a wizard-news row, so the .js-only scan now fails open.'
      + ' Widen the scan to a JSX-capable parser (tests/helpers/jsxLiteralWalk.js).',
    ).toEqual([]);
  });

  test('the emitted-key reader really reads the AST, including the conditional spread', () => {
    const probe = `
      export function rebuild(entry) {
        return {
          id: entry.id,
          kind: entry.kind,
          ...(entry.covert === true ? { covert: true } : {}),
          nested: { buried: entry.buried },
        };
      }
    `;
    const read = emittedKeys(probe, 'rebuild');
    expect(read.found).toBe(true);
    // The conditional spread's key is EMITTED and must be seen; the nested record's key
    // is a sub-record's business and must NOT be, or every rebuild looks complete.
    expect([...read.keys].sort()).toEqual(['covert', 'id', 'kind', 'nested']);
    expect(read.spreadsSource).toBe(false);
    // A whole-source spread takes a function OUT of the class: unnamed keys ride through.
    const carried = emittedKeys(
      'export function rebuild(entry) { return { ...entry, id: entry.id }; }', 'rebuild',
    );
    expect(carried.spreadsSource).toBe(true);
    // An unknown name must report absence rather than a confident empty answer.
    expect(emittedKeys(probe, 'noSuchFunction').found).toBe(false);
  });

  test('the class detector fires on a rebuild and clears the forms that are not one', () => {
    const rebuild = `const row = {
      a: src.a, b: src.b, c: src.c, d: src.d,
      e: src.e, f: src.f, g: src.g, h: src.h,
    };`;
    expect(allowlistRebuilds(rebuild).length, 'a plain 8-key rebuild').toBe(1);
    // A whole-source spread carries the unnamed keys: not the class.
    expect(allowlistRebuilds(`const row = { ...src, ${'a: src.a, b: src.b, c: src.c, d: src.d, e: src.e, f: src.f, g: src.g, h: src.h,'} };`).length)
      .toBe(0);
    // RENAMED keys are not an allowlist rebuild of the same shape — the detector
    // requires the emitted name to EQUAL the name read, or a projection to another
    // vocabulary would be convicted as a lossy copy of the first.
    expect(allowlistRebuilds(`const row = {
      a: src.z, b: src.y, c: src.x, d: src.w,
      e: src.v, f: src.u, g: src.t, h: src.s,
    };`).length).toBe(0);
    // Below the threshold is below the threshold.
    expect(allowlistRebuilds('const row = { a: src.a, b: src.b, c: src.c };').length).toBe(0);
    // ⚠ THE SPELLING THAT ESCAPED THE FIRST DETECTOR, and it is live in the tree:
    // `...cloneObject(raw)` carries every unnamed key through, so the literal is NOT an
    // allowlist — but a bare-identifier spread check convicts it anyway. worldState.js's
    // hydrator is exactly this shape; a wrongly-convicted row would have entered the
    // roster claiming a coverage law over a rebuild that has no coverage problem.
    expect(allowlistRebuilds(`const row = { ...clone(src),
      a: src.a, b: src.b, c: src.c, d: src.d, e: src.e, f: src.f, g: src.g, h: src.h,
    };`).length, 'a wrapped whole-source spread is still a carry').toBe(0);
    // ...while the house conditional spread NAMES its key and must stay in the class.
    expect(allowlistRebuilds(`const row = { ...(src.covert === true ? { covert: true } : {}),
      a: src.a, b: src.b, c: src.c, d: src.d, e: src.e, f: src.f, g: src.g, h: src.h,
    };`).length, 'the byte-neutral conditional spread is not a carry').toBe(1);
    // AND THE ONE-HOP ALIAS, which is how the live carry is actually spelled: the spread
    // names a local that a clone call bound to the source. Without the hop this is a
    // false conviction, and a false row in a frozen roster is a written lie.
    expect(allowlistRebuilds(`const shallow = clone(src);
    const row = { ...shallow,
      a: src.a, b: src.b, c: src.c, d: src.d, e: src.e, f: src.f, g: src.g, h: src.h,
    };`).length, 'a one-hop aliased whole-source spread is still a carry').toBe(0);
  });

  test('both producer doors discriminate, and each is driven THROUGH the composed predicate', () => {
    // Pinning the two doors individually is NOT enough: a predicate assembled from two
    // halves can lose one half without any red, because no site in the tree needs it
    // today. Each door is therefore driven through isProducerSite as well as alone.
    // The probe must carry the SAME string the node's offsets index into, or door A —
    // which reads the id's own source text — is asked about the wrong bytes.
    const probeOf = (literal) => {
      const source = `const row = ${literal};`;
      let node = null;
      simple(parseModule(source), {
        ObjectExpression(found) { if (!node) node = found; },
      });
      return { source, node };
    };
    const houseId = probeOf('{ id: `wizard_news.${tick}.treaty_signed.a.b`, headline: \'h\' }');
    const required = probeOf('{ id: rowId, kind: \'k\', headline: \'h\', severity: 0.5, settlementIds: [] }');
    const foreign = probeOf('{ nodeId: \'n\', kind: \'outcome\', headline: \'h\' }');

    expect(isHouseIdSite(houseId.source, houseId.node), 'door A alone').toBe(true);
    expect(isRequiredShapeSite(houseId.source, houseId.node), 'a door A site is not a door B site').toBe(false);
    expect(isRequiredShapeSite(required.source, required.node), 'door B alone').toBe(true);
    expect(isHouseIdSite(required.source, required.node), 'a door B site is not a door A site').toBe(false);

    expect(isProducerSite(houseId.source, houseId.node), 'door A through the predicate').toBe(true);
    expect(isProducerSite(required.source, required.node), 'door B through the predicate').toBe(true);
    // The ChronicleNode shape that forced `id` onto door B: kind + headline, no id.
    expect(isProducerSite(foreign.source, foreign.node), 'an id-less foreign shape').toBe(false);
  });

  test('both doors are load-bearing against the live tree, and the scan is populated', () => {
    const doorAOnly = allProducerSites.filter((site) => site.houseId && !site.requiredShape);
    const doorBOnly = allProducerSites.filter((site) => site.requiredShape && !site.houseId);
    expect(allProducerSites.length, 'the producer scan emptied').toBeGreaterThanOrEqual(80);
    expect(new Set(allProducerSites.map((site) => site.path)).size).toBeGreaterThanOrEqual(50);
    // If either of these hits zero the union has collapsed to one door and the other
    // could be deleted without a red — the exact way defense-in-depth hides its own loss.
    expect(doorAOnly.length, 'door A stopped contributing sites of its own').toBeGreaterThan(0);
    expect(doorBOnly.length, 'door B stopped contributing sites of its own').toBeGreaterThan(0);
  });

  test('the registered rebuilder exists, is an allowlist, and its allowlist is substantial', () => {
    const problems = [];
    for (const row of REBUILDERS) {
      const file = srcFiles.find(({ rel }) => rel === row.module);
      if (!file) {
        problems.push(`${row.shape}: ${row.module} is not in the scan`);
        continue;
      }
      const read = emittedKeys(file.source, row.rebuilder);
      if (!read.found) problems.push(`${row.shape}: ${row.rebuilder} not found in ${row.module}`);
      else if (read.spreadsSource) {
        problems.push(`${row.shape}: ${row.rebuilder} now spreads its source — it has LEFT the`
          + ' class, which is a WIN. Retire this row and its ledger instead of maintaining it.');
      } else if (read.keys.size < 10) {
        problems.push(`${row.shape}: ${row.rebuilder} emits only ${read.keys.size} keys`);
      }
    }
    expect(problems, 'the rebuilder registry drifted from the tree').toEqual([]);
  });
});

describe('SP-W1 allowlist-rebuilder registry — BOTH WAYS against the tree', () => {
  test('DIRECTION 1 — no producer mints a key the rebuilder silently drops', () => {
    const known = new Set(KNOWN_DROPPED_KEYS.map((row) => row.key));
    const unknown = [...droppedToday.entries()]
      .filter(([key]) => !known.has(key))
      .map(([key, at]) => `${key} — minted at ${at.join(', ')}`)
      .sort();
    expect(
      unknown,
      '\nA wizard-news producer mints a key that normalizeEntry does NOT name, so the field is'
      + ' DROPPED at the first append and again on every load — any reader of it is dead against'
      + ' every persisted feed. Name the key in normalizeEntry (src/domain/region/wizardNews.js)'
      + ' in the SAME commit, using the byte-neutral conditional-spread idiom the file already'
      + ' uses so existing saves serialize unchanged. Do NOT add it to KNOWN_DROPPED_KEYS.\n',
    ).toEqual([]);
  });

  test('DIRECTION 2 — every frozen dropped key is still really dropped (shrink-only)', () => {
    const stale = KNOWN_DROPPED_KEYS
      .filter((row) => !droppedToday.has(row.key))
      .map((row) => row.key)
      .sort();
    expect(
      stale,
      '\nA frozen dropped key is no longer dropped — either normalizeEntry now names it, or its'
      + ' producer is gone. That is a WIN: DELETE the stale row from KNOWN_DROPPED_KEYS so the'
      + ' ledger only ever shrinks. A ledger that keeps rows it no longer needs reports debt it'
      + ' does not have, and stops being read.\n',
    ).toEqual([]);
    // Every row carries a WRITTEN reason. A row without one is a silent exemption.
    for (const row of KNOWN_DROPPED_KEYS) {
      expect(typeof row.reason, `${row.key}: a ledger row states its reason`).toBe('string');
      expect(row.reason.length, `${row.key}: the reason is too thin to be one`).toBeGreaterThan(40);
    }
    expect(new Set(KNOWN_DROPPED_KEYS.map((row) => row.key)).size).toBe(KNOWN_DROPPED_KEYS.length);
    // NON-VACUITY: the class really is live, so DIRECTION 1 is measuring something.
    expect(droppedToday.size, 'nothing is dropped — DIRECTION 1 proves nothing').toBeGreaterThan(0);
  });

  test('DIRECTION 3 — the class roster is exact, so no rebuilder joins unreviewed', () => {
    const declared = CLASS_ROSTER.map((row) => `${row.module}::${row.fn}`).sort();
    const live = liveRoster.map((row) => `${row.module}::${row.fn}`).sort();
    expect(
      live,
      '\nThe set of allowlist rebuilders in the persisted trees changed. A NEW one must be'
      + ' CLASSIFIED and added to CLASS_ROSTER with a written reason — registered if it is'
      + ' faithful and its producers are enumerable, `lossy` if dropping is its job, `unpaired`'
      + ' if it is faithful but has no producer rule yet. A REMOVED one is a win: delete its row.'
      + ' Rows are keyed by module + function, so this cannot red on a line move alone.\n',
    ).toEqual(declared);
  });

  test('every roster row is well-formed, and the registered row is the one DIRECTION 1 governs', () => {
    const problems = [];
    const statuses = new Set(['registered', 'lossy', 'unpaired', 'not-a-rebuilder']);
    for (const row of CLASS_ROSTER) {
      if (!statuses.has(row.status)) problems.push(`${row.module}::${row.fn}: bad status "${row.status}"`);
      if (typeof row.reason !== 'string' || row.reason.length < 40) {
        problems.push(`${row.module}::${row.fn}: a roster row states a real reason, or it is a`
          + ' silent exemption wearing a row');
      }
    }
    const registered = CLASS_ROSTER.filter((row) => row.status === 'registered')
      .map((row) => `${row.module}::${row.fn}`).sort();
    expect(problems, 'the class roster drifted').toEqual([]);
    expect(registered, 'the registered rows and the rebuilder registry must be the same set')
      .toEqual(REBUILDERS.map((row) => `${row.module}::${row.rebuilder}`).sort());
    // The roster is a MEASUREMENT only if it is not all one status: an all-`unpaired`
    // roster would mean the registry governs nothing, and an all-`registered` one would
    // mean the deferral ledger has expired — a real event that wants a look.
    const byStatus = new Set(CLASS_ROSTER.map((row) => row.status));
    expect(byStatus.size, 'every roster row shares one status — say so deliberately')
      .toBeGreaterThan(1);
  });
});
