/**
 * domain/inferSupplyChains.js — discover candidate supply chains from custom
 * content (§14 P3). Pure + deterministic.
 *
 * Each custom entity exposes OUTPUTS (what it provides) and INPUTS (what it
 * requires); this matches one entity's outputs against another's inputs across
 * institutions, services, resources, and trade goods, assembles
 * producer → processor → output paths, and folds in trade endpoints:
 *   - an input nothing local produces → an IMPORT candidate
 *   - a terminal output nothing local consumes → an EXPORT candidate
 *   - reconciled against a neighbour's exports/imports when one is supplied.
 *
 * The result is a SUPERSET of the dossier's activeChain shape, so
 * SupplyChainsPanel's ChainRow renders each discovered chain unmodified;
 * discovery + verification metadata live under namespaced `.discovered` /
 * `.verification` keys the renderer ignores. The user confirms/corrects/names
 * these in the Supply Chains tab; confirmed ones persist to
 * customContent.supplyChains and (P3b) feed generation.
 *
 * Determinism: all iteration is over lexicographically sorted ids; no Date,
 * no Math.random, no set-iteration-order reliance. Same inputs → same chains.
 */
import { buildRegistry, customRefIdFromItem } from '../lib/customRegistry.js';
import { compareCodepoint } from './deterministicSort.js';
import {
  customSupplyChainDefinitionEvidence,
} from './content/customSupplyChainReview.js';
import {
  reviewedSupplyChainIdForNodeUids,
} from './content/customSupplyChainIdentity.js';

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Custom-content entities as this module reads them. Ref-list fields
 * tolerate the comma-separated-string legacy encoding (see toList).
 * @typedef {{ name?: string, localUid?: string, id?: string, produces?: string[] | string, requires?: string[] | string }} CustomInstitution
 * @typedef {{ name?: string, localUid?: string, id?: string, requires?: string[] | string, providedBy?: string[] | string }} CustomService
 * @typedef {{ name?: string, localUid?: string, id?: string, commodities?: string[] | string, yields?: string[] | string, enables?: string[] | string }} CustomResource
 * @typedef {{ name?: string, localUid?: string, id?: string, requiredInstitution?: string[] | string, requiredResources?: string[] | string }} CustomTradeGood
 */

/**
 * The custom-content slice blob, as far as chain inference reads it.
 * @typedef {Object} CustomContentLike
 * @property {CustomInstitution[]} [institutions]
 * @property {CustomService[]} [services]
 * @property {CustomResource[]} [resources]
 * @property {CustomTradeGood[]} [tradeGoods]
 */

/**
 * A node in the inferred provides/requires graph.
 * @typedef {Object} ChainNode
 * @property {string}   uid
 * @property {string}   name
 * @property {string}   kind      'institution' | 'service' | 'resource' | 'good'
 * @property {string[]} provides  normalized commodity tokens
 * @property {string[]} requires  normalized commodity tokens
 * @property {string|null} refId  stable custom/prebuilt definition identity
 * @property {string} source      custom | prebuilt | reference
 * @property {string|null} tierMin reviewed lower tier bound
 * @property {string|null} tierMax reviewed upper tier bound
 * @property {string|null} definitionId reviewed durable definition identity
 * @property {string|null} revisionId reviewed immutable revision identity
 * @property {number|null} revisionNumber reviewed revision sequence
 * @property {string|null} contentHash canonical reviewed authored meaning
 */

/**
 * A directed provides→requires edge between two nodes.
 * @typedef {{ from: string, to: string, commodity: string }} ChainEdge
 */

/** @param {unknown} s */
const norm = (s) => String(s || '').trim().toLowerCase();
/** @param {unknown} s */
const stem = (s) => norm(s).split(/[\s(]/)[0];
const EXACT_REF_TOKEN_PREFIX = '@sf-ref:';
const AMBIGUOUS_NAME_TOKEN_PREFIX = '@sf-ambiguous:';

/** @param {unknown} value */
function isStableRef(value) {
  return (
    typeof value === 'string'
    && (
      value.startsWith('custom:')
      || value.startsWith('prebuilt:')
    )
  );
}

/** @param {unknown} value */
const exactRefToken = value => `${EXACT_REF_TOKEN_PREFIX}${String(value)}`;

/** @param {unknown} value */
const isIdentityToken = value => (
  typeof value === 'string'
  && (
    value.startsWith(EXACT_REF_TOKEN_PREFIX)
    || value.startsWith(AMBIGUOUS_NAME_TOKEN_PREFIX)
  )
);

/** @param {unknown} value */
const canonicalGraphToken = value => (
  isIdentityToken(value) ? String(value) : norm(value)
);

/** Bidirectional stem-overlap match — the same rule the chain renderer + the
 *  generator's dependency matcher use, so inference and rendering never disagree.
 *  @param {unknown} a
 *  @param {unknown} b
 *  @returns {boolean}
 */
function tokenMatch(a, b) {
  if (isIdentityToken(a) || isIdentityToken(b)) {
    return String(a) === String(b);
  }
  const as = stem(a), bs = stem(b);
  if (!as || !bs) return false;
  return norm(a).includes(bs) || norm(b).includes(as);
}

/**
 * Coerce a list-ish value (array, or legacy comma-separated string) to an array.
 * @overload
 * @param {string | ReadonlyArray<string> | null | undefined} v
 * @returns {string[]}
 */
/**
 * @template T
 * @overload
 * @param {ReadonlyArray<T> | null | undefined} v
 * @returns {T[]}
 */
/**
 * @param {unknown} v
 * @returns {unknown[]}
 */
function toList(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string' && v.trim()) return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

/** @param {unknown} s */
const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORY_BY_KIND = /** @type {Readonly<Record<string, string>>} */ (Object.freeze({
  institution: 'institutions',
  service: 'services',
  resource: 'resources',
  good: 'tradeGoods',
}));

/**
 * @param {CustomContentLike} customContent  the slice blob {institutions, services, resources, tradeGoods, ...}
 * @param {{ resolve?: (refId: string) => (string | null), neighbour?: { primaryExports?: string[], primaryImports?: string[], name?: string } }} [opts]
 *   opts.resolve — dependency-refId → entity name (defaults to a registry built from customContent);
 *   opts.neighbour — a neighbour's trade surface to reconcile import/export endpoints against.
 * @returns {Array<Object>}  discovered chains (activeChain superset), sorted by chainId
 */
export function inferSupplyChains(customContent = {}, opts = {}) {
  let registry = null;
  try { registry = buildRegistry(customContent || {}); } catch { registry = null; }
  let resolve = opts.resolve;
  if (!resolve) {
    resolve = (refId) => {
      const e = registry && registry.resolve ? registry.resolve(refId) : null;
      if (e && e.name) return e.name;
      return (typeof refId === 'string' && !refId.includes(':')) ? refId : null;
    };
  }
  /**
   * Preserve stable references as exact graph tokens. Bare-name compatibility
   * remains available only when that name is not ambiguous inside the declared
   * target categories.
   *
   * @param {string | ReadonlyArray<string> | null | undefined} refs
   * @param {readonly string[]} categories
   * @returns {string[]}
   */
  const resolveTokens = (refs, categories) => toList(refs).flatMap(raw => {
    if (typeof raw !== 'string') return [];
    if (isStableRef(raw)) return [exactRefToken(raw)];
    const resolved = resolve(raw);
    if (!resolved) return [];
    const key = norm(resolved);
    const matches = new Set();
    if (typeof registry?.listAll === 'function') {
      for (const category of categories) {
        for (const entry of registry.listAll(category)) {
          if (
            norm(entry?.name) === key
            || norm(entry?.key) === key
          ) {
            matches.add(entry.refId);
          }
        }
      }
    }
    return matches.size > 1
      ? [`${AMBIGUOUS_NAME_TOKEN_PREFIX}${key}`]
      : [resolved];
  });

  const cc = customContent || {};
  /** @type {ChainNode[]} */
  const nodes = [];
  /** @type {Map<string, ChainNode[]>} */
  const byName = new Map();
  /** @type {Map<string, ChainNode>} */
  const byRef = new Map();
  /** @param {ChainNode} node */
  const indexNode = node => {
    const key = norm(node.name);
    byName.set(key, [...(byName.get(key) || []), node]);
    if (node.refId) byRef.set(node.refId, node);
  };
  /** @param {unknown} name */
  const uniqueNodeNamed = name => {
    const matches = byName.get(norm(name)) || [];
    return matches.length === 1 ? matches[0] : null;
  };
  /**
   * @param {{ name?: string, localUid?: string, id?: string, tierMin?: string, tierMax?: string }} item
   * @param {string} kind
   * @param {Array<string | null | undefined>} provides
   * @param {Array<string | null | undefined>} requires
   * @returns {void}
   */
  const addNode = (item, kind, provides, requires) => {
    const name = item && item.name && String(item.name).trim();
    if (!name) return;
    const revision = (() => {
      try {
        return customSupplyChainDefinitionEvidence(
          CATEGORY_BY_KIND[kind],
          item,
        );
      } catch {
        // Malformed legacy content may still be inspectable, but a missing hash
        // makes the resulting projection impossible to confirm safely.
        return null;
      }
    })();
    const refId = item.localUid || item.id ? customRefIdFromItem(item) : null;
    const node = {
      uid: String(item.localUid || item.id || `${kind}-${slug(name)}`),
      name, kind,
      provides: [...new Set([
        ...provides.filter(Boolean).map(canonicalGraphToken),
        ...(refId ? [exactRefToken(refId)] : []),
      ])],
      requires: [...new Set(
        requires.filter(Boolean).map(canonicalGraphToken),
      )],
      refId,
      source: 'custom',
      tierMin: item.tierMin || null,
      tierMax: item.tierMax || null,
      definitionId: revision?.definitionId || null,
      revisionId: revision?.revisionId || null,
      revisionNumber: revision?.revisionNumber || null,
      contentHash: revision?.contentHash || null,
    };
    nodes.push(node);
    indexNode(node);
  };
  for (const inst of toList(cc.institutions)) {
    addNode(
      inst,
      'institution',
      [
        ...resolveTokens(inst.produces, ['tradeGoods', 'services']),
        inst.name,
      ],
      resolveTokens(inst.requires, ['resources', 'tradeGoods', 'services']),
    );
  }
  // A service requires its providing institution (providedBy), so the chain flows
  // institution → service even when only the service named the link.
  for (const svc of toList(cc.services)) {
    addNode(
      svc,
      'service',
      [svc.name],
      [
        ...resolveTokens(svc.requires, ['resources', 'tradeGoods', 'services']),
        ...resolveTokens(svc.providedBy, ['institutions']),
      ],
    );
  }
  // A resource also "provides" the goods/services it yields (its declared output).
  for (const res of toList(cc.resources)) {
    addNode(
      res,
      'resource',
      [
        ...toList(res.commodities),
        res.name,
        ...resolveTokens(res.yields, ['tradeGoods', 'services']),
      ],
      [],
    );
  }
  // A trade good requires its processing institution when it names one (so the
  // chain flows resource → institution → good); otherwise its resources directly.
  for (const good of toList(cc.tradeGoods)) {
    const institutionTokens = resolveTokens(
      good.requiredInstitution,
      ['institutions'],
    );
    const requires = institutionTokens.length
      ? institutionTokens
      : resolveTokens(
        good.requiredResources,
        ['resources', 'tradeGoods', 'services'],
      );
    addNode(good, 'good', [good.name], requires);
  }

  // §14 — seed prebuilt nodes for any BUILT-IN item a custom item references, so
  // a mixed chain assembles end-to-end: a custom good processed by a built-in
  // mill from a built-in resource renders as one connected resource → mill →
  // good path instead of the built-in step collapsing to a trade endpoint. The
  // seeded node provides its own name; the processor pass below gives a built-in
  // processing institution its inputs.
  /** @type {Record<string, string>} */
  const PREBUILT_KIND = { institutions: 'institution', services: 'service', resources: 'resource', tradeGoods: 'good' };
  /**
   * @param {string} name
   * @param {string} kind
   * @param {{
   *   refId?: string,
   *   source?: string,
   *   tierMin?: string,
   *   tierMax?: string,
   *   raw?: {tierMin?: string, tierMax?: string},
   * }|null} [entry]
   * @returns {ChainNode | null}
   */
  const ensureNode = (name, kind, entry = null) => {
    const key = norm(name);
    if (!name) return null;
    if (entry?.refId && byRef.has(entry.refId)) {
      return byRef.get(entry.refId) || null;
    }
    if (!entry?.refId) {
      const existing = uniqueNodeNamed(name);
      if (existing) return existing;
      if ((byName.get(key) || []).length > 1) return null;
    }
    const refId = entry?.refId || null;
    const node = {
      uid: refId
        ? `seed-${kind}-${slug(refId)}`
        : `seed-${kind}-${slug(name)}`,
      name,
      kind,
      provides: [
        key,
        ...(refId ? [exactRefToken(refId)] : []),
      ],
      requires: [],
      refId,
      source: entry?.source || 'reference',
      tierMin: entry?.raw?.tierMin || entry?.tierMin || null,
      tierMax: entry?.raw?.tierMax || entry?.tierMax || null,
      definitionId: null,
      revisionId: null,
      revisionNumber: null,
      contentHash: null,
    };
    nodes.push(node);
    indexNode(node);
    return node;
  };
  /** @param {unknown} refId */
  const seedRef = (refId) => {
    if (typeof refId !== 'string' || !refId.startsWith('prebuilt:') || !registry?.resolve) return;
    const e = registry.resolve(refId);
    if (e && e.name) ensureNode(e.name, PREBUILT_KIND[e.category] || 'good', e);
  };
  for (const inst of toList(cc.institutions)) { toList(inst.produces).forEach(seedRef); toList(inst.requires).forEach(seedRef); }
  for (const svc of toList(cc.services)) { toList(svc.requires).forEach(seedRef); toList(svc.providedBy).forEach(seedRef); }
  for (const res of toList(cc.resources)) { toList(res.yields).forEach(seedRef); toList(res.enables).forEach(seedRef); }
  for (const good of toList(cc.tradeGoods)) { toList(good.requiredResources).forEach(seedRef); toList(good.requiredInstitution).forEach(seedRef); }

  /**
   * Resolve one relationship endpoint without discarding stable identity.
   * Identity-free legacy labels may reuse an existing node only when that
   * visible name has one meaning in the current graph.
   *
   * @param {string} ref
   * @param {string} fallbackKind
   * @returns {ChainNode|null}
   */
  const ensureReferencedNode = (ref, fallbackKind) => {
    if (isStableRef(ref)) {
      const entry = registry?.resolve?.(ref);
      return byRef.get(ref)
        || (entry?.name
          ? ensureNode(
            entry.name,
            PREBUILT_KIND[entry.category] || fallbackKind,
            entry,
          )
          : null);
    }
    const name = resolve(ref);
    return uniqueNodeNamed(name)
      || (name ? ensureNode(name, fallbackKind) : null);
  };

  // Thread each good's processing institution as the consumer of its required
  // resources: the institution (custom or seeded built-in) gains those resources
  // as inputs, so the resource → institution → good flow connects.
  for (const good of toList(cc.tradeGoods)) {
    const institutionRefs = toList(good.requiredInstitution)
      .filter(ref => typeof ref === 'string');
    if (!institutionRefs.length) continue;
    const resourceTokens = resolveTokens(
      good.requiredResources,
      ['resources', 'tradeGoods', 'services'],
    ).map(canonicalGraphToken);
    for (const raw of toList(good.requiredResources)) {
      if (typeof raw !== 'string') continue;
      if (isStableRef(raw)) {
        const entry = registry?.resolve?.(raw);
        if (entry?.name) {
          ensureNode(
            entry.name,
            PREBUILT_KIND[entry.category] || 'resource',
            entry,
          );
        }
      } else {
        const name = resolve(raw);
        if (name) ensureNode(name, 'resource');
      }
    }
    for (const ref of institutionRefs) {
      const institution = ensureReferencedNode(ref, 'institution');
      if (institution) {
        institution.requires = [
          ...new Set([...institution.requires, ...resourceTokens]),
        ];
      }
    }
  }

  // A resource's declared output (`yields`) is the inverse of a good's
  // requiredResources: treat "resource yields X" as "X requires this resource"
  // so the resource → X flow connects regardless of which side declared the link.
  for (const res of toList(cc.resources)) {
    const resourceRef = res.localUid || res.id
      ? customRefIdFromItem(res)
      : null;
    const resourceToken = resourceRef
      ? exactRefToken(resourceRef)
      : norm(res.name);
    for (const ref of toList(res.yields)) {
      if (typeof ref !== 'string') continue;
      const output = ensureReferencedNode(ref, 'good');
      if (output && output.uid !== String(res.localUid || res.id || '')) {
        output.requires = [
          ...new Set([...output.requires, resourceToken]),
        ];
      }
    }
  }

  // Edges: A.provides token matches B.requires token.
  const seenEdge = new Set();
  /** @type {ChainEdge[]} */
  const edges = [];
  for (const a of nodes) {
    for (const b of nodes) {
      if (a.uid === b.uid) continue;
      for (const p of a.provides) {
        for (const r of b.requires) {
          if (tokenMatch(p, r)) {
            const key = `${a.uid}|${b.uid}|${r}`;
            if (!seenEdge.has(key)) { seenEdge.add(key); edges.push({ from: a.uid, to: b.uid, commodity: r }); }
          }
        }
      }
    }
  }

  /** @type {Map<string, ChainNode>} */
  const byUid = new Map(nodes.map((n) => [n.uid, n]));
  /** @type {Map<string, ChainEdge[]>} */
  const out = new Map(nodes.map((n) => [n.uid, []]));
  /** @type {Map<string, number>} */
  const inbound = new Map(nodes.map((n) => [n.uid, 0]));
  // @ts-ignore -- both maps are seeded with every node uid above, so .get() never misses here.
  for (const e of edges) { out.get(e.from).push(e); inbound.set(e.to, inbound.get(e.to) + 1); }
  for (const arr of out.values()) arr.sort((x, y) => compareCodepoint(`${x.commodity}${x.to}`, `${y.commodity}${y.to}`));

  // Sources: no inbound edge but at least one outbound. Walk to maximal paths.
  // @ts-ignore -- `out` is seeded with every node uid above, so .get() never misses here.
  const sources = nodes.filter((n) => inbound.get(n.uid) === 0 && out.get(n.uid).length > 0)
    .sort((a, b) => compareCodepoint(a.uid, b.uid));
  /** @type {ChainEdge[][]} */
  const paths = [];
  /**
   * @param {string} uid
   * @param {ChainEdge[]} path
   * @param {Set<string>} visited
   * @returns {void}
   */
  const walk = (uid, path, visited) => {
    const outs = out.get(uid) || [];
    const next = outs.filter((e) => !visited.has(e.to));
    if (!next.length || path.length >= 6) { if (path.length) paths.push(path); return; }
    for (const e of next) walk(e.to, [...path, e], new Set([...visited, e.to]));
  };
  for (const s of sources) walk(s.uid, [], new Set([s.uid]));

  const allProvided = [...new Set(nodes.flatMap((n) => n.provides))];
  const neigh = opts.neighbour || {};
  const nExports = toList(neigh.primaryExports).map(norm);
  const nImports = toList(neigh.primaryImports).map(norm);
  /** @param {string} token */
  const displayToken = token => {
    if (token.startsWith(EXACT_REF_TOKEN_PREFIX)) {
      const refId = token.slice(EXACT_REF_TOKEN_PREFIX.length);
      return byRef.get(refId)?.name
        || registry?.resolve?.(refId)?.name
        || 'Referenced input';
    }
    if (token.startsWith(AMBIGUOUS_NAME_TOKEN_PREFIX)) {
      return token.slice(AMBIGUOUS_NAME_TOKEN_PREFIX.length);
    }
    return token;
  };
  /** @param {string[]} tokens */
  const displayTokens = tokens => {
    const seen = new Set();
    return tokens.map(displayToken).filter(label => {
      const key = norm(label);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const seenChain = new Set();
  const discovered = [];
  for (const path of paths) {
    const uids = [path[0].from, ...path.map((e) => e.to)];
    /** @type {ChainNode[]} */
    // @ts-ignore -- filter(Boolean) removes the undefineds at runtime; TS does not narrow through BooleanConstructor here.
    const chainNodes = uids.map((u) => byUid.get(u)).filter(Boolean);
    if (chainNodes.length < 2) continue;
    // One constructor also serves archive remap, so imported exact references
    // produce the same current chain identity as destination inference.
    const chainId = reviewedSupplyChainIdForNodeUids(uids);
    if (seenChain.has(chainId)) continue;
    seenChain.add(chainId);

    const source = chainNodes[0];
    const sink = chainNodes[chainNodes.length - 1];
    // Every institution/service in the chain processes it — including a source
    // institution whose own inputs are imported (no local raw resource feeds it).
    const processors = chainNodes.filter((n) => n.kind === 'institution' || n.kind === 'service');

    const reqTokens = [...new Set(chainNodes.flatMap((n) => n.requires))];
    const imports = displayTokens(
      reqTokens.filter(t => !allProvided.some(p => tokenMatch(p, t))),
    );
    const exports = displayTokens(
      sink.provides.filter(p => !chainNodes.some(
        n => n.requires.some(r => tokenMatch(p, r)),
      )),
    );

    const importObjs = imports.map((l) => {
      const c = nExports.find((x) => tokenMatch(x, l)) || null;
      return { label: l, source: c ? 'neighbour' : 'trade', counterpart: c };
    });
    const exportObjs = exports.map((l) => {
      const c = nImports.find((x) => tokenMatch(x, l)) || null;
      return { label: l, source: c ? 'neighbour' : 'trade', counterpart: c };
    });

    const label = chainNodes.map((n) => n.name).join(' → ');
    discovered.push({
      // ── legacy activeChain render props (ChainRow reads these verbatim) ──
      chainId,
      status: 'vulnerable',                       // discovered-but-unconfirmed → amber ◐
      label,
      resource: source.kind === 'resource' ? source.name : null,
      // ⚠️ THESE TWO EMPTY ICON SLOTS ARE NOT DEAD — DO NOT SWEEP THEM (lane RR).
      // `resourceIcon` and `needIcon` (below) are REQUIRED KEYS of the reviewed
      // supply-chain persistence shape: content/reviewedSupplyChainPersistence.js
      // runs an exactKeys check over CHAIN_KEYS and then demands
      // `typeof resourceIcon === 'string'`, so a discovered chain missing either
      // key is rejected with "unsupported shape. Missing: resourceIcon." the
      // moment an author confirms it (SupplyChainsManager → confirmCustomSupply-
      // ChainReview spreads this object through unchanged). The icon sweep's
      // directive was to remove dead icon slots; these two are load-bearing
      // schema, and the schema shape is owner-gated. The empty string is the
      // honest value: a discovered chain has no author-supplied icon yet.
      // Pinned by tests/lint/copyCorruption.test.js (the SIG-1 allowlist and its
      // "the boundary really does require them" proof).
      resourceIcon: '', resourceDepleted: false,
      processingInstitutions: processors.map((p) => p.name),
      outputs: exports.length ? exports.slice(0, 4) : [sink.name],
      services: [],
      exportable: exportObjs.length > 0,
      entrepot: false,
      upstreamMissing: importObjs.map((i) => i.label),
      upstreamNote: importObjs.length ? `Imported inputs: ${importObjs.map((i) => i.label).join(', ')}` : '',
      // needIcon: see the resourceIcon note above — a required persistence key,
      // not emoji-strip residue.
      needLabel: 'Custom', needIcon: '', needColor: '#a0762a',
      // ── discovery / verification metadata (renderer ignores) ──
      discovered: {
        nodes: chainNodes.map((n) => ({
          uid: n.uid, name: n.name, kind: n.kind,
          role: n.uid === source.uid ? 'source' : n.uid === sink.uid ? 'sink' : 'processor',
          refId: n.refId,
          source: n.source,
          tierMin: n.tierMin,
          tierMax: n.tierMax,
          definitionId: n.definitionId,
          revisionId: n.revisionId,
          revisionNumber: n.revisionNumber,
          contentHash: n.contentHash,
        })),
        edges: path.map((e) => ({ from: e.from, to: e.to, commodity: e.commodity })),
        tradeEndpoints: { imports: importObjs, exports: exportObjs },
      },
      verification: { state: 'discovered', userName: null, corrections: {} },
    });
  }
  return discovered.sort((a, b) => compareCodepoint(a.chainId, b.chainId));
}
