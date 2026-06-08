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
import { buildRegistry } from '../lib/customRegistry.js';

const norm = (s) => String(s || '').trim().toLowerCase();
const stem = (s) => norm(s).split(/[\s(]/)[0];

/** Bidirectional stem-overlap match — the same rule the chain renderer + the
 *  generator's dependency matcher use, so inference and rendering never disagree. */
function tokenMatch(a, b) {
  const as = stem(a), bs = stem(b);
  if (!as || !bs) return false;
  return norm(a).includes(bs) || norm(b).includes(as);
}

function toList(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string' && v.trim()) return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * @param {Object} customContent  the slice blob {institutions, services, resources, tradeGoods, ...}
 * @param {Object} [opts]
 * @param {(refId:string)=>(string|null)} [opts.resolve]  dependency-refId → entity name (defaults to a registry built from customContent)
 * @param {{primaryExports?:string[], primaryImports?:string[], name?:string}} [opts.neighbour]
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
  const resolveNames = (refs) => toList(refs).map((r) => resolve(r)).filter(Boolean);

  const cc = customContent || {};
  const nodes = [];
  const byName = new Map();
  const addNode = (item, kind, provides, requires) => {
    const name = item && item.name && String(item.name).trim();
    if (!name) return;
    const node = {
      uid: String(item.localUid || item.id || `${kind}-${slug(name)}`),
      name, kind,
      provides: [...new Set(provides.filter(Boolean).map(norm))],
      requires: [...new Set(requires.filter(Boolean).map(norm))],
    };
    nodes.push(node);
    if (!byName.has(norm(name))) byName.set(norm(name), node);
  };
  for (const inst of toList(cc.institutions)) addNode(inst, 'institution', [...resolveNames(inst.produces), inst.name], resolveNames(inst.requires));
  for (const svc of toList(cc.services)) addNode(svc, 'service', [svc.name], resolveNames(svc.requires));
  for (const res of toList(cc.resources)) addNode(res, 'resource', [...toList(res.commodities), res.name], []);
  // A trade good requires its processing institution when it names one (so the
  // chain flows resource → institution → good); otherwise its resources directly.
  for (const good of toList(cc.tradeGoods)) {
    const instNames = resolveNames(good.requiredInstitution);
    const requires = instNames.length ? instNames : resolveNames(good.requiredResources);
    addNode(good, 'good', [good.name], requires);
  }

  // §14 — seed prebuilt nodes for any BUILT-IN item a custom item references, so
  // a mixed chain assembles end-to-end: a custom good processed by a built-in
  // mill from a built-in resource renders as one connected resource → mill →
  // good path instead of the built-in step collapsing to a trade endpoint. The
  // seeded node provides its own name; the processor pass below gives a built-in
  // processing institution its inputs.
  const PREBUILT_KIND = { institutions: 'institution', services: 'service', resources: 'resource', tradeGoods: 'good' };
  const ensureNode = (name, kind) => {
    const key = norm(name);
    if (!name || byName.has(key)) return byName.get(key) || null;
    const node = { uid: `seed-${kind}-${slug(name)}`, name, kind, provides: [key], requires: [] };
    nodes.push(node);
    byName.set(key, node);
    return node;
  };
  const seedRef = (refId) => {
    if (typeof refId !== 'string' || !refId.startsWith('prebuilt:') || !registry?.resolve) return;
    const e = registry.resolve(refId);
    if (e && e.name) ensureNode(e.name, PREBUILT_KIND[e.category] || 'good');
  };
  for (const inst of toList(cc.institutions)) { toList(inst.produces).forEach(seedRef); toList(inst.requires).forEach(seedRef); }
  for (const svc of toList(cc.services)) { toList(svc.requires).forEach(seedRef); toList(svc.providedBy).forEach(seedRef); }
  for (const good of toList(cc.tradeGoods)) { toList(good.requiredResources).forEach(seedRef); toList(good.requiredInstitution).forEach(seedRef); }

  // Thread each good's processing institution as the consumer of its required
  // resources: the institution (custom or seeded built-in) gains those resources
  // as inputs, so the resource → institution → good flow connects.
  for (const good of toList(cc.tradeGoods)) {
    const instNames = resolveNames(good.requiredInstitution);
    if (!instNames.length) continue;
    const resNames = resolveNames(good.requiredResources).map(norm);
    for (const r of resNames) ensureNode(r, 'resource');
    for (const instName of instNames) {
      const inst = byName.get(norm(instName)) || ensureNode(instName, 'institution');
      if (inst) inst.requires = [...new Set([...inst.requires, ...resNames])];
    }
  }

  // Edges: A.provides token matches B.requires token.
  const seenEdge = new Set();
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

  const byUid = new Map(nodes.map((n) => [n.uid, n]));
  const out = new Map(nodes.map((n) => [n.uid, []]));
  const inbound = new Map(nodes.map((n) => [n.uid, 0]));
  for (const e of edges) { out.get(e.from).push(e); inbound.set(e.to, inbound.get(e.to) + 1); }
  for (const arr of out.values()) arr.sort((x, y) => `${x.commodity}${x.to}`.localeCompare(`${y.commodity}${y.to}`));

  // Sources: no inbound edge but at least one outbound. Walk to maximal paths.
  const sources = nodes.filter((n) => inbound.get(n.uid) === 0 && out.get(n.uid).length > 0)
    .sort((a, b) => a.uid.localeCompare(b.uid));
  const paths = [];
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

  const seenChain = new Set();
  const discovered = [];
  for (const path of paths) {
    const uids = [path[0].from, ...path.map((e) => e.to)];
    const chainNodes = uids.map((u) => byUid.get(u)).filter(Boolean);
    if (chainNodes.length < 2) continue;
    const chainId = `discovered.${slug(uids.join('-'))}`;
    if (seenChain.has(chainId)) continue;
    seenChain.add(chainId);

    const source = chainNodes[0];
    const sink = chainNodes[chainNodes.length - 1];
    // Every institution/service in the chain processes it — including a source
    // institution whose own inputs are imported (no local raw resource feeds it).
    const processors = chainNodes.filter((n) => n.kind === 'institution' || n.kind === 'service');

    const reqTokens = [...new Set(chainNodes.flatMap((n) => n.requires))];
    const imports = reqTokens.filter((t) => !allProvided.some((p) => tokenMatch(p, t)));
    const exports = sink.provides.filter((p) => !chainNodes.some((n) => n.requires.some((r) => tokenMatch(p, r))));

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
      resourceIcon: '', resourceDepleted: false,
      processingInstitutions: processors.map((p) => p.name),
      outputs: exports.length ? exports.slice(0, 4) : [sink.name],
      services: [],
      exportable: exportObjs.length > 0,
      entrepot: false,
      upstreamMissing: importObjs.map((i) => i.label),
      upstreamNote: importObjs.length ? `Imported inputs: ${importObjs.map((i) => i.label).join(', ')}` : '',
      needLabel: 'Custom', needIcon: '⚙', needColor: '#a0762a',
      // ── discovery / verification metadata (renderer ignores) ──
      discovered: {
        nodes: chainNodes.map((n) => ({
          uid: n.uid, name: n.name, kind: n.kind,
          role: n.uid === source.uid ? 'source' : n.uid === sink.uid ? 'sink' : 'processor',
        })),
        edges: path.map((e) => ({ from: e.from, to: e.to, commodity: e.commodity })),
        tradeEndpoints: { imports: importObjs, exports: exportObjs },
      },
      verification: { state: 'discovered', userName: null, corrections: {} },
    });
  }
  return discovered.sort((a, b) => a.chainId.localeCompare(b.chainId));
}
