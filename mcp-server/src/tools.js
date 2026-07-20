/**
 * tools.js — the SettlementForge Truth Server's READ-ONLY tool registry
 * (Vision V-12 THE TRUTH SERVER). Pure: no stdio, no fs, no mutation. Every tool
 * reads a loaded world export and answers WITH RECEIPTS — the judo against LLM
 * erosion is that these answers cite the ledger rows they came from.
 *
 * READ-ONLY BY CONSTRUCTION: there is NO mutating tool here and no write path —
 * the server can only ever read the world it was given. Pinned by
 * tests/mcp/mcpTruthServer.test.js (the tool-manifest read-only pin).
 *
 * SECRETS SEAM: this module NEVER redacts. It serves the export variant it was
 * loaded with — a `player` export already carries zero covert content, a `dm`
 * export carries the owner's own. The redaction happened at export time
 * (src/lib/worldExport.js); the server honors the variant by passing it through.
 */

export const WORLD_EXPORT_FORMAT = 'settlementforge-world';

/**
 * The tool manifest (MCP `tools/list`). Read-only tools only — the names are all
 * `get_*` / `search_*` / `ask_*`; no create/update/delete/set/write tool exists.
 */
export const TOOLS = Object.freeze([
  Object.freeze({
    name: 'get_settlement',
    description: 'Look up one settlement dossier by name or id. Returns the settlement plus receipts citing the world export it came from.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Settlement name (case-insensitive).' },
        id: { type: 'string', description: 'Settlement id.' },
      },
    },
  }),
  Object.freeze({
    name: 'get_npc',
    description: 'Find an NPC by name across the world (or within one settlement). Returns the NPC record, its settlement, and receipts.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'NPC name (case-insensitive).' },
        settlement: { type: 'string', description: 'Optional settlement name to scope the search.' },
      },
      required: ['name'],
    },
  }),
  Object.freeze({
    name: 'search_events',
    description: 'Search the realm chronicle for headlines matching a query (or list recent events). Each match carries its tick + affected settlements as receipts.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Substring to match against headlines/summaries (omit for the most recent events).' },
        limit: { type: 'number', description: 'Max results (default 20).' },
      },
    },
  }),
  Object.freeze({
    name: 'ask_ledger',
    description: 'Ask a question about the realm answered FROM STATE (wars, faiths, trade, arcs) — never invented. The answer cites the ledger rows it is built from.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'A question about the realm.' },
      },
      required: ['question'],
    },
  }),
]);

/** The set of tool names — the read-only allowlist the dispatcher honors. */
export const TOOL_NAMES = Object.freeze(TOOLS.map((t) => t.name));

/**
 * Validate + index a parsed world export for fast lookup. Never mutates input.
 * @param {any} data a parsed `settlementforge-world` export
 * @returns {{ variant: string, realmName: string, settlements: any[], byId: Map<string,any>, byName: Map<string,any>, snapshot: any }}
 * @throws {Error} when the payload is not a recognized world export
 */
export function loadWorld(data) {
  if (!data || typeof data !== 'object' || data.format !== WORLD_EXPORT_FORMAT) {
    throw new Error('Not a SettlementForge world export (expected format "settlementforge-world").');
  }
  const settlements = Array.isArray(data.settlements) ? data.settlements : [];
  const byId = new Map();
  const byName = new Map();
  for (const s of settlements) {
    if (s && s.id != null) byId.set(String(s.id), s);
    if (s && s.name != null) byName.set(String(s.name).toLowerCase(), s);
  }
  return {
    variant: data.variant === 'dm' ? 'dm' : 'player',
    realmName: (data.realm && data.realm.name) || 'Realm',
    settlements,
    byId,
    byName,
    snapshot: (data.realm && data.realm.snapshot) || {},
  };
}

/** A receipt citing the source of a served fact. */
function receipt(world, extra) {
  return { source: WORLD_EXPORT_FORMAT, variant: world.variant, realm: world.realmName, ...extra };
}

function getSettlement(args, world) {
  const a = args && typeof args === 'object' ? args : {};
  let entry = null;
  if (a.id != null) entry = world.byId.get(String(a.id)) || null;
  if (!entry && a.name != null) entry = world.byName.get(String(a.name).toLowerCase()) || null;
  if (!entry) {
    return { ok: false, error: `No settlement matched ${JSON.stringify(a.name ?? a.id ?? '')}. Known: ${[...world.byName.keys()].join(', ') || '(none)'}.` };
  }
  return {
    ok: true,
    settlement: entry,
    receipts: [receipt(world, { settlementId: entry.id, settlementName: entry.name })],
  };
}

function getNpc(args, world) {
  const a = args && typeof args === 'object' ? args : {};
  const wanted = String(a.name || '').toLowerCase();
  if (!wanted) return { ok: false, error: 'get_npc requires a "name".' };
  const scope = a.settlement
    ? [world.byName.get(String(a.settlement).toLowerCase())].filter(Boolean)
    : world.settlements;
  for (const s of scope) {
    const npcs = Array.isArray(s?.dossier?.npcs) ? s.dossier.npcs : [];
    const npc = npcs.find((n) => String(n?.name || '').toLowerCase() === wanted)
      || npcs.find((n) => String(n?.name || '').toLowerCase().includes(wanted));
    if (npc) {
      return {
        ok: true,
        npc,
        settlementId: s.id,
        settlementName: s.name,
        receipts: [receipt(world, { settlementId: s.id, settlementName: s.name, npc: npc.name })],
      };
    }
  }
  return { ok: false, error: `No NPC named "${a.name}" found${a.settlement ? ` in ${a.settlement}` : ''}.` };
}

function searchEvents(args, world) {
  const a = args && typeof args === 'object' ? args : {};
  const query = String(a.query || '').toLowerCase();
  const limit = Number.isFinite(a.limit) ? Math.max(1, Math.floor(a.limit)) : 20;
  const chronicle = Array.isArray(world.snapshot.chronicle) ? world.snapshot.chronicle : [];
  const matches = [];
  for (const tickRow of chronicle) {
    for (const h of (Array.isArray(tickRow.headlines) ? tickRow.headlines : [])) {
      const hay = `${h.headline || ''} ${h.summary || ''}`.toLowerCase();
      if (query && !hay.includes(query)) continue;
      matches.push({
        tick: tickRow.tick,
        headline: h.headline,
        summary: h.summary,
        affectedSettlementNames: tickRow.affectedSettlementNames || [],
        receipts: [receipt(world, { tick: tickRow.tick, affectedSettlementIds: tickRow.affectedSettlementIds || [] })],
      });
      if (matches.length >= limit) break;
    }
    if (matches.length >= limit) break;
  }
  return { ok: true, query: a.query || null, matchCount: matches.length, matches };
}

function askLedger(args, world) {
  const a = args && typeof args === 'object' ? args : {};
  const q = String(a.question || '');
  if (!q) return { ok: false, error: 'ask_ledger requires a "question".' };
  const ql = q.toLowerCase();
  const snap = world.snapshot;
  const war = (snap.warNetwork && snap.warNetwork.sieges) || [];
  const trade = (snap.warNetwork && snap.warNetwork.tradeWars) || [];
  const pantheon = Array.isArray(snap.pantheon) ? snap.pantheon : [];
  const arcs = (snap.dashboard && snap.dashboard.realmArcLines) || [];

  /** @type {{answer:string, basis:any}} */
  let out;
  if (/\b(war|siege|besieg|battle|army|conflict)\b/.test(ql)) {
    out = war.length
      ? { answer: `${war.length} settlement${war.length === 1 ? ' is' : 's are'} under siege: ${war.map((s) => `${s.targetName} (by ${(s.coalitionNames || []).join(', ') || 'an army'})`).join('; ')}.`, basis: war }
      : { answer: 'The realm is at peace — no public siege is recorded in the ledger.', basis: [] };
  } else if (/\b(trade|market|commodit|goods|merchant)\b/.test(ql)) {
    out = trade.length
      ? { answer: `Trade wars in the ledger: ${trade.map((t) => `${t.winnerName} took ${t.buyerName}'s ${t.commodityLabel}`).join('; ')}.`, basis: trade }
      : { answer: 'No trade war is recorded in the ledger.', basis: [] };
  } else if (/\b(faith|deity|deities|god|gods|pantheon|temple|religion|worship)\b/.test(ql)) {
    const majors = pantheon.filter((d) => d.tier === 'major');
    out = pantheon.length
      ? { answer: `The pantheon holds ${pantheon.length} faith${pantheon.length === 1 ? '' : 's'}${majors.length ? `; ascendant: ${majors.map((d) => `${d.name} (${d.seats} seats)`).join(', ')}` : ''}.`, basis: pantheon }
      : { answer: 'The realm records no deities in the ledger.', basis: [] };
  } else {
    out = {
      answer: `${world.realmName}: ${world.settlements.length} settlement${world.settlements.length === 1 ? '' : 's'}.${arcs.length ? ` Its arcs: ${arcs.join(' ')}` : ''}`,
      basis: { settlementCount: world.settlements.length, realmArcLines: arcs },
    };
  }
  return {
    ok: true,
    question: q,
    answer: out.answer,
    basis: out.basis,
    receipts: [receipt(world, { grounding: 'realm-snapshot' })],
  };
}

const HANDLERS = {
  get_settlement: getSettlement,
  get_npc: getNpc,
  search_events: searchEvents,
  ask_ledger: askLedger,
};

/**
 * Dispatch a tool call over a loaded world. Read-only; never mutates `world`.
 * @param {string} name a tool name from TOOL_NAMES
 * @param {any} args the tool arguments
 * @param {ReturnType<typeof loadWorld>} world
 * @returns {{ ok: boolean, error?: string, [k: string]: any }}
 */
export function runTool(name, args, world) {
  const handler = HANDLERS[name];
  if (!handler) return { ok: false, error: `Unknown tool "${name}". Read-only tools: ${TOOL_NAMES.join(', ')}.` };
  return handler(args, world);
}
