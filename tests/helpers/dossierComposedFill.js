/**
 * tests/helpers/dossierComposedFill.js — WHAT THE COMPOSER ACTUALLY OFFERS, per (block, pool).
 *
 * ── THE GAP THIS CLOSES ─────────────────────────────────────────────────────────────
 * A dossier block declares a slot palette (`block.slots`) and each variant declares the
 * slots its own sentence names (`variant.slots`). NEITHER is what the reader meets. The
 * third number — the one that decides whether a sentence can ever be drawn — is the
 * COMPOSER'S BAG: the object a desk passes as `options.slots` when it calls
 * `readStateProse`. `stateProseKernel.variantIsAnchored` drops every variant naming a slot
 * the bag does not fill, so a variant whose slot the bag never offers is authored prose no
 * seed can reach.
 *
 * The taste sample's refutations found this the hard way twice: a "GAP demonstration" that
 * was a probe artefact (a composer called with `{}` readings selects its ABSENCE pools for
 * every seed), and a licence claim keyed on the block when the bag is keyed on the (block,
 * pool) pair — `generalStateProse.js`'s `craftSlots` fills `{resource}` on `HOME-FED` and
 * `UNWORKED` and refuses it on `STALLED`, in the same block, by design and with the reason
 * written in the source. So the census is per (block, pool) or it is wrong.
 *
 * ── WHY STATIC, AND WHAT THAT COSTS ────────────────────────────────────────────────
 * The bag is resolved from SOURCE, not from a run, for one reason: a run measures the bags
 * of the towns it generated, and a slot offered only on a rare state would read as never
 * offered. The static read is the SUPERSET the composer can offer; a run is the subset one
 * corpus of towns actually saw. This module reports the superset and says so.
 *
 * The cost is that a value is not a fill: `craftSlots` lists `resource` as a key whose value
 * is `undefined` on `STALLED`, and `isFilled` rejects `undefined`. The resolver therefore
 * reads CONDITIONAL keys — `key: cond ? a : undefined` and `key: cond ? a : b` — and marks
 * them `conditional`, so a licence verdict can distinguish "never offered" from "offered on
 * some states". Anything it cannot resolve is reported as UNRESOLVED and never silently
 * dropped: an unresolved bag makes the licence arm NOT-EXECUTABLE for that pair, which is
 * the §908 law applied to an instrument's own reach.
 *
 * FAIL-CLOSED. Every extractor throws rather than returning empty (`sourceContract.js`'s
 * discipline). READ-ONLY: nothing here writes a byte of any composer.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { balancedSlice as balanced } from '../../src/domain/prose/wiringCensus.js';
import { ROOT } from './dossierCorpus.js';

/** The six desk composers — the only callers of the state-prose reader in the estate. */
export const COMPOSERS = Object.freeze([
  'src/domain/display/stateProse/generalStateProse.js',
  'src/domain/display/stateProse/powerStateProse.js',
  'src/domain/display/stateProse/economyStateProse.js',
  'src/domain/display/stateProse/defenseStateProse.js',
  'src/domain/display/stateProse/stressorsStateProse.js',
  'src/domain/display/stateProse/warFaithStateProse.js',
]);

/**
 * The bracket reader. ⚠ ONE SPELLING, and it lives in `src/domain/prose/wiringCensus.js`:
 * car 8 needed the same reader on the same composer sources, and a second copy here is the
 * fork the estate has a name for — two readers that disagree by one edge case make one
 * census count a key the other cannot see. Re-exported under its original name so every
 * caller of `balanced` in this file (and any future one) is unchanged.
 */
export { balancedSlice as balanced } from '../../src/domain/prose/wiringCensus.js';

/**
 * Split a bracket-inner at TOP-LEVEL commas.
 * @param {string} inner
 * @returns {string[]}
 */
export function topLevelSplit(inner) {
  /** @type {string[]} */
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '/' && inner[i + 1] === '/') { i = inner.indexOf('\n', i); if (i < 0) break; continue; }
    if (c === '/' && inner[i + 1] === '*') { i = inner.indexOf('*/', i) + 1; if (i < 1) break; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      const quote = c;
      i++;
      while (i < inner.length && inner[i] !== quote) { if (inner[i] === '\\') i++; i++; }
      continue;
    }
    if ('({['.includes(c)) depth++;
    else if (')}]'.includes(c)) depth--;
    else if (c === ',' && depth === 0) { parts.push(inner.slice(start, i)); start = i + 1; }
  }
  parts.push(inner.slice(start));
  return parts.map((p) => p.trim()).filter((p) => p !== '');
}

/**
 * The KEYS of an object-literal source, with each key's disposition.
 * @param {string} objectInner the text inside `{ … }`
 * @returns {{keys: Array<{name: string, conditional: boolean}>, spreads: string[],
 *   unresolved: string[]}}
 */
export function objectKeys(objectInner) {
  /** @type {Array<{name: string, conditional: boolean}>} */
  const keys = [];
  /** @type {string[]} */
  const spreads = [];
  /** @type {string[]} */
  const unresolved = [];
  for (const rawPart of topLevelSplit(objectInner)) {
    // ⚠ COMMENTS LEAD ENTRIES IN THIS ESTATE, at length. `generalStateProse.js`'s
    // `craftSlots` carries a twenty-line ⛔ note between two keys, and a first cut that
    // matched the key regex against the comment reported `resource` UNRESOLVED — losing
    // the one slot the whole note exists to explain. Comments are stripped per entry.
    const part = rawPart
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .split('\n')
      .filter((l) => !/^\s*\/\//.test(l))
      .join('\n')
      .trim();
    if (part === '') continue;
    const spread = part.match(/^\.\.\.\s*([A-Za-z_$][\w$]*)/);
    if (spread) { spreads.push(spread[1]); continue; }
    const named = part.match(/^([A-Za-z_$][\w$]*)\s*:/);
    if (named) {
      const value = part.slice(named[0].length).trim();
      keys.push({ name: named[1], conditional: value.includes('?') || /\bundefined\b/.test(value) });
      continue;
    }
    const shorthand = part.match(/^([A-Za-z_$][\w$]*)\s*$/);
    if (shorthand) { keys.push({ name: shorthand[1], conditional: false }); continue; }
    unresolved.push(part.slice(0, 60));
  }
  return { keys, spreads, unresolved };
}

/**
 * Resolve a NAMED bag — `const <name> = { … }` or `const <name> = cond ? { … } : null` —
 * to its keys, following `...spread` names one level at a time. Recursion is bounded and a
 * name that cannot be found is reported rather than assumed empty.
 * @param {string} src
 * @param {string} name
 * @param {Set<string>} [seen]
 * @returns {{keys: Array<{name: string, conditional: boolean}>, unresolved: string[]}}
 */
export function resolveBag(src, name, seen = new Set()) {
  if (seen.has(name)) return { keys: [], unresolved: [] };
  seen.add(name);
  const decl = new RegExp(`\\bconst\\s+${name}\\s*=`).exec(src);
  if (!decl) return { keys: [], unresolved: [`no declaration of \`${name}\``] };
  const from = decl.index + decl[0].length;
  const brace = src.indexOf('{', from);
  const semi = src.indexOf(';', from);
  if (brace < 0 || (semi >= 0 && brace > semi && !src.slice(from, semi).includes('?'))) {
    return { keys: [], unresolved: [`\`${name}\` is not an object literal`] };
  }
  // A conditional bag (`cond ? { … } : null`) contributes every key of its object arm; the
  // whole bag being null on the other arm is the composer's own not-offered case, which the
  // pool key already encodes.
  /** @type {Array<{name: string, conditional: boolean}>} */
  const keys = [];
  /** @type {string[]} */
  const unresolved = [];
  const conditionalBag = src.slice(from, brace).includes('?');
  let cursor = brace;
  const limit = semi >= 0 ? semi : src.length;
  while (cursor >= 0 && cursor < src.length) {
    let block;
    try { block = balanced(src, cursor); } catch { break; }
    const parsed = objectKeys(block.inner);
    for (const k of parsed.keys) keys.push({ name: k.name, conditional: k.conditional || conditionalBag });
    unresolved.push(...parsed.unresolved);
    for (const s of parsed.spreads) {
      const nested = resolveBag(src, s, seen);
      keys.push(...nested.keys);
      unresolved.push(...nested.unresolved);
    }
    const next = src.indexOf('{', block.end + 1);
    if (next < 0 || next > Math.max(limit, block.end)) break;
    if (!conditionalBag) break;
    cursor = next;
  }
  return { keys, unresolved };
}

/**
 * The nearest enclosing arrow-const helper of a source index — `const line = (blockId,
 * poolKey, extra = null) => …`. The composers wrap `readStateProse` in exactly this shape
 * four times, and the wrapper's PARAMETERS are how a per-lens bag reaches the kernel
 * (`economyStateProse.js`'s `extra`, `generalStateProse.js`'s `slotBag`). A resolver that
 * stopped at the parameter name would report the two most interesting bags in the estate as
 * unresolved — including `exploitSlots`, whose whole existence is a finding (R-DST-ROLE:
 * one bag serving two roles put a chain's output into an export sentence).
 * @param {string} src
 * @param {number} index
 * @returns {{name: string, params: string[], defAt: number}|null}
 */
export function enclosingHelper(src, index) {
  const decl = /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*\(/g;
  /** @type {{name: string, params: string[], defAt: number}|null} */
  let best = null;
  for (const m of src.matchAll(decl)) {
    if (m.index >= index) break;
    const open = m.index + m[0].length - 1;
    let args;
    try { args = balanced(src, open); } catch { continue; }
    if (!/^\s*=>/.test(src.slice(args.end + 1, args.end + 8))) continue;
    best = {
      name: m[1],
      params: topLevelSplit(args.inner).map((p) => (p.match(/^([A-Za-z_$][\w$]*)/) || ['', ''])[1]),
      defAt: m.index,
    };
  }
  return best;
}

/**
 * @typedef {object} FillSite
 * @property {string} file
 * @property {number} line
 * @property {string} block the block id, or `(parameterised)` when the call site takes one
 * @property {string} poolExpr the pool-key expression as written
 * @property {string[]} slots every slot name the bag can offer
 * @property {string[]} conditional the subset offered only on some states
 * @property {string[]} unresolved what the resolver could not read
 * @property {string} [via] the helper this site was reached through
 */

/**
 * ⭐ THE SPINE-KEY EXPRESSION OF A COMPOSED CALL — `composeStateProse`'s third argument
 * carries the pool key that `readStateProse` took positionally (SEAM cars 3b–3g).
 *
 * ⛔ WHY THE SCANNER LEARNED A SECOND SHAPE RATHER THAN THE DESKS KEEPING THE OLD ONE. The
 * census's fill column, the licence arm and `UNMOUNTED_BLOCKS`' second witness are all
 * derived from THIS reader. A desk routed through the composer stops spelling
 * `readStateProse(CORPUS, block, pool, {…})` and starts spelling
 * `composeStateProse(CORPUS, block, {…, spineKey: pool})` — the same three facts, one of
 * them moved into the options object. A reader that knew only the old spelling would report
 * the routed desk's blocks as served by NO bag, and the census would record a wiring loss
 * that never happened. So the anchor takes both call shapes and answers the same triple.
 * @param {string} optionsArg the options argument as written
 * @returns {string|null} the spine-key expression, or null when there is none to read
 */
export function spineKeyExpr(optionsArg) {
  const braceAt = optionsArg.indexOf('{');
  if (braceAt < 0) return null;
  let obj;
  try { obj = balanced(optionsArg, braceAt); } catch { return null; }
  const part = topLevelSplit(obj.inner).find((p) => /^spineKey\b/.test(p.trim()));
  if (!part) return null;
  const named = part.trim().match(/^spineKey\s*:\s*([\s\S]+)$/);
  // A shorthand `spineKey` names a const of that name; the pool expression IS the identifier.
  return named ? named[1].trim() : 'spineKey';
}

/**
 * Every `readStateProse` / `composeStateProse` call site in the composers, with its
 * resolved bag.
 * @returns {FillSite[]}
 */
export function fillSites() {
  /** @type {FillSite[]} */
  const sites = [];
  for (const rel of COMPOSERS) {
    const abs = join(ROOT, rel);
    const src = readFileSync(abs, 'utf8');
    const anchor = /\b(readStateProse|composeStateProse)\s*\(/g;
    for (const m of src.matchAll(anchor)) {
      const composed = m[1] === 'composeStateProse';
      const open = m.index + m[0].length - 1;
      const { inner } = balanced(src, open);
      const args = topLevelSplit(inner);
      if (args.length < 3) continue;
      const blockLiteral = args[1].match(/^'([^']+)'$/);
      // The pool key: positional on a kernel read, `spineKey` inside the options on a
      // composed one. A composed call with no readable `spineKey` is REPORTED, never guessed.
      const poolRaw = composed ? spineKeyExpr(args[2]) : args[2];
      const optsIdx = composed ? 2 : args.length - 1;
      const opts = args[optsIdx];
      /** @type {Array<{name: string, conditional: boolean}>} */
      let keys = [];
      /** @type {string[]} */
      let unresolved = [];
      if (poolRaw === null) unresolved.push('no readable `spineKey` in the composed options object');
      const poolText = poolRaw === null ? '(unreadable spineKey)' : poolRaw;
      const braceAt = opts.indexOf('{');
      if (braceAt < 0) {
        unresolved.push(`options is not an object literal: ${opts.slice(0, 50)}`);
      } else {
        const optionsObj = balanced(opts, braceAt);
        const parsed = objectKeys(optionsObj.inner);
        const slotEntry = parsed.keys.find((k) => k.name === 'slots');
        if (!slotEntry) {
          unresolved.push('no `slots` key in the options object');
        } else {
          // `slots` shorthand or `slots: <name>` — both resolve through the file's consts;
          // `slots: { … }` resolves inline.
          const slotPart = topLevelSplit(optionsObj.inner)
            .find((p) => /^slots\b/.test(p.trim())) || '';
          const inlineAt = slotPart.indexOf('{');
          if (inlineAt >= 0) {
            const obj = balanced(slotPart, inlineAt);
            const io = objectKeys(obj.inner);
            keys = io.keys;
            unresolved.push(...io.unresolved);
            for (const s of io.spreads) {
              const nested = resolveBag(src, s);
              keys.push(...nested.keys);
              unresolved.push(...nested.unresolved);
            }
          } else {
            const named = slotPart.match(/^slots\s*:\s*([A-Za-z_$][\w$]*)/);
            const bagName = named ? named[1] : 'slots';
            const bag = resolveBag(src, bagName);
            keys = bag.keys;
            unresolved = unresolved.concat(bag.unresolved);
          }
        }
      }
      const line = src.slice(0, m.index).split('\n').length;
      const helper = enclosingHelper(src, m.index);
      const blockArg = args[1].trim();
      const paramised = !blockLiteral && !!helper && helper.params.includes(blockArg);
      // A spread name that is a PARAMETER of the enclosing helper, not a const in the file:
      // the per-lens override. Its value is decided at each call site.
      const paramBags = (unresolved
        .map((u) => (u.match(/^no declaration of `([A-Za-z_$][\w$]*)`$/) || [])[1])
        .filter((n) => n && helper && helper.params.includes(n)));
      const base = {
        file: rel,
        line,
        poolExpr: poolText.trim().slice(0, 40),
        slots: [...new Set(keys.map((k) => k.name))].sort(),
        conditional: [...new Set(keys.filter((k) => k.conditional).map((k) => k.name))].sort(),
        unresolved: unresolved.filter((u) => !paramBags.some((p) => u.includes(`\`${p}\``))),
      };
      if ((!paramised && paramBags.length === 0) || !helper) {
        sites.push({ ...base, block: blockLiteral ? blockLiteral[1] : '(parameterised)' });
        continue;
      }
      // FOLLOW THE HELPER. Every call of `helper.name(…)` outside its own declaration is a
      // concrete (block, pool, bag) triple; a call whose block argument is not a literal is
      // reported, never guessed.
      const callRe = new RegExp(`\\b${helper.name}\\s*\\(`, 'g');
      let found = 0;
      for (const c of src.matchAll(callRe)) {
        if (Math.abs(c.index - helper.defAt) < 4) continue;
        let callArgs;
        try { callArgs = topLevelSplit(balanced(src, c.index + c[0].length - 1).inner); } catch { continue; }
        const blockIdx = paramised ? helper.params.indexOf(blockArg) : -1;
        const literal = blockIdx >= 0 ? (callArgs[blockIdx] || '').trim().match(/^'([^']+)'$/) : null;
        const block = paramised ? (literal ? literal[1] : '(unresolved call)') : (blockLiteral ? blockLiteral[1] : '(parameterised)');
        if (paramised && !literal) { base.unresolved.push(`call at line ${src.slice(0, c.index).split('\n').length} passes a non-literal block`); }
        const extraKeys = [...keys];
        const extraUnresolved = [];
        for (const p of paramBags) {
          const argExpr = (callArgs[helper.params.indexOf(p)] || '').trim();
          if (!argExpr || argExpr === 'null' || argExpr === 'undefined') continue;
          const named = argExpr.match(/^([A-Za-z_$][\w$]*)$/);
          if (named) {
            const bag = resolveBag(src, named[1]);
            extraKeys.push(...bag.keys.map((k) => ({ name: k.name, conditional: true })));
            extraUnresolved.push(...bag.unresolved);
          } else if (argExpr.startsWith('{')) {
            const io = objectKeys(balanced(argExpr, 0).inner);
            extraKeys.push(...io.keys.map((k) => ({ name: k.name, conditional: true })));
          } else {
            extraUnresolved.push(`override argument not resolvable: ${argExpr.slice(0, 40)}`);
          }
        }
        found += 1;
        sites.push({
          ...base,
          block,
          poolExpr: (callArgs[helper.params.indexOf(poolText.trim())] || base.poolExpr).trim().slice(0, 40),
          slots: [...new Set(extraKeys.map((k) => k.name))].sort(),
          conditional: [...new Set(extraKeys.filter((k) => k.conditional).map((k) => k.name))].sort(),
          unresolved: [...base.unresolved, ...extraUnresolved],
          via: `${helper.name}()`,
        });
      }
      if (found === 0) sites.push({ ...base, block: blockLiteral ? blockLiteral[1] : '(parameterised)' });
    }
  }
  if (sites.length === 0) {
    throw new Error('dossierComposedFill: ZERO readStateProse/composeStateProse call sites found — the composers moved or the scanner went dark');
  }
  return sites;
}

/**
 * The composed fill per BLOCK — the union of every bag that can serve it. A block reached
 * only through a helper carries the union of every call site's bag, which is the SUPERSET
 * the licence arm is entitled to read: a slot no bag anywhere offers can never be filled,
 * and that is a fact about the corpus, not about one town.
 * @param {FillSite[]} sites
 * @returns {Map<string, {slots: string[], conditional: string[], sites: FillSite[]}>}
 */
export function composedFillByBlock(sites) {
  /** @type {Map<string, {slots: string[], conditional: string[], sites: FillSite[]}>} */
  const byBlock = new Map();
  for (const site of sites) {
    if (!byBlock.has(site.block)) byBlock.set(site.block, { slots: [], conditional: [], sites: [] });
    const row = byBlock.get(site.block);
    if (!row) continue;
    row.slots = [...new Set([...row.slots, ...site.slots])].sort();
    row.conditional = [...new Set([...row.conditional, ...site.conditional])].sort();
    row.sites.push(site);
  }
  return byBlock;
}

// ═══════════════════════════════════════════════════════════════════════════════════
// THE UNRENDERED-FACTS CENSUS (§912.1's condition one) — the number the AUTHORING WAVE
// is sized from.
//
// THE QUESTION: per composer, which typed facts does it HOLD — the readings its caller
// builds for it and the settlement fields it reads — that no sentence RENDERS? A fact the
// composer touches only to choose a POOL KEY is rendered as a CHOICE and never as a word; a
// fact it puts in a slot bag is rendered as a word. The gap between the two is what a new
// pool key would be written FOR.
//
// ⚠ WHAT THIS MEASURES AND WHAT IT DOES NOT. It measures REACH, from source: every
// `readings.x` and `settlement?.x` the composer names. It does NOT measure whether the fact
// is interesting, whether a sentence could be licensed by it, or whether the engine holds a
// value for it on any given town. Those are the authoring wave's judgments and the owner's.
// A fact counted here is a CANDIDATE, and the census says so on every row.
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Every typed fact a composer names, split into RENDERED (it reaches a slot bag) and
 * KEY-ONLY (it only chooses a pool).
 * @returns {Array<{file: string, held: string[], rendered: string[], keyOnly: string[]}>}
 */
export function unrenderedFacts() {
  const sites = fillSites();
  return COMPOSERS.map((rel) => {
    const src = readFileSync(join(ROOT, rel), 'utf8');
    // Comments name fields constantly and explain why they are NOT read; a census that
    // counted them would report the composer's own reasoning as its reach.
    const code = src
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l))
      .join('\n');
    /** @type {Set<string>} */
    const held = new Set();
    for (const m of code.matchAll(/\breadings(?:\?)?\.([a-zA-Z_$][\w$]*)/g)) held.add(`readings.${m[1]}`);
    for (const m of code.matchAll(/\bsettlement(?:\?)?\.([a-zA-Z_$][\w$]*)/g)) held.add(`settlement.${m[1]}`);
    // A fact is RENDERED when its name appears inside a resolved slot bag's value — the bag
    // is the only path from a field to a word.
    const bagText = sites.filter((s) => s.file === rel).map((s) => s.slots.join(' ')).join(' ');
    const slotNames = new Set(bagText.split(/\s+/).filter(Boolean));
    /** @type {string[]} */
    const rendered = [];
    /** @type {string[]} */
    const keyOnly = [];
    for (const fact of [...held].sort()) {
      const leaf = fact.split('.')[1];
      // A field is counted as rendered when a slot of the same name is offered, or when the
      // field's own name appears in a slot bag's value expression in the source.
      const inBag = slotNames.has(leaf)
        || new RegExp(`(slots|Slots)\\s*[:=][^;]{0,400}\\b${leaf}\\b`).test(code);
      (inBag ? rendered : keyOnly).push(fact);
    }
    return {
      file: rel, held: [...held].sort(), rendered, keyOnly,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════════
// CAR 8 — THE WIRING CENSUS's two inputs. The census module is PURE (it reads no file);
// the I/O is here, where every other composer read in this estate already lives.
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * The six composers' source text, keyed by repo-relative path.
 * @returns {Map<string, string>}
 */
export function composerSources() {
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const rel of COMPOSERS) out.set(rel, readFileSync(join(ROOT, rel), 'utf8'));
  if (out.size === 0) throw new Error('dossierComposedFill: zero composer sources read');
  return out;
}

/**
 * The bag per CALL SITE, keyed `block :: <the pool-key function the site calls>`. The
 * block-wide union (`composedFillByBlock`) is the superset; this is the refinement the
 * module's own header says the licence arm needs, because `craftSlots` fills {resource} on
 * one pool of a block and refuses it on another BY DESIGN.
 *
 * A site whose pool expression names no `…PoolKey` function contributes nothing here and
 * falls back to the block-wide bag — never to an empty one, which would report every slot
 * of that pool as unprovided.
 * @param {FillSite[]} sites
 * @returns {Map<string, string[]>}
 */
export function composedFillByKeyFunction(sites) {
  /** @type {Map<string, Set<string>>} */
  const byKey = new Map();
  for (const site of sites) {
    const named = site.poolExpr.match(/([A-Za-z_$][\w$]*[Pp]oolKey)\s*\(/);
    if (!named) continue;
    const id = `${site.block} :: ${named[1]}`;
    if (!byKey.has(id)) byKey.set(id, new Set());
    const seat = byKey.get(id);
    if (!seat) continue;
    for (const slot of site.slots) seat.add(slot);
  }
  return new Map([...byKey].map(([id, set]) => [id, [...set].sort()]));
}
