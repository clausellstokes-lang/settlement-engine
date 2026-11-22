/**
 * mcpTruthServer.test.js — Vision V-12 THE TRUTH SERVER.
 *
 * Pins: the tool manifest is READ-ONLY (no mutating tool exists) · the JSON-RPC/
 * MCP handshake + tool dispatch work · every response carries receipts · the
 * secrets seam is honored (a player export served through the server leaks nothing
 * covert; a DM export surfaces the DM content) · and the validate script is wired
 * into `npm run check`.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TOOLS, TOOL_NAMES, loadWorld, runTool } from '../../mcp-server/src/tools.js';
import { handleMessage, PROTOCOL_VERSION, SERVER_INFO } from '../../mcp-server/src/server.js';
import { buildWorldExport } from '../../src/lib/worldExport.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

const rawWorld = () => ({
  name: 'Saltmoor Reach',
  seed: 'realm-seed-xyz',
  settlements: [
    {
      id: 'save-1', name: 'Saltmoor',
      settlement: {
        id: 's_ab12cd34ef567890', name: 'Saltmoor', tier: 'town', population: 1200,
        thesis: 'A toll town on the ford.',
        npcs: [{
          id: 'npc.varn', name: 'Lord Varn', role: 'ruler',
          secret: { what: 'took a bribe from the guild' }, goal: { short: 'hold the toll bridge' },
          whereabouts: { state: 'traveling', missionId: 'road.saltmoor.varn.12', purposeKind: 'diplomacy' },
        }],
      },
    },
  ],
  worldState: {
    tick: 15, calendar: { year: 2, season: 'spring', month: 4, elapsedMonths: 3 },
    rngSeed: 'REPLAY-ME', spatialLedgers: { armyTransit: {} },
    pulseHistory: [{ tick: 12, selectedOutcomes: [{ applyMode: 'auto', headline: 'The mill burned', summary: 'Smoke over the river ward.', targetSaveId: 'save-1' }] }],
  },
  regionalGraph: { channels: [] },
});

const playerExport = () => buildWorldExport(rawWorld(), { variant: 'player', generatedAt: 'x' });
const dmExport = () => buildWorldExport(rawWorld(), { variant: 'dm', generatedAt: 'x' });

describe('mcp-server — READ-ONLY tool manifest (the pin)', () => {
  const READ_VERBS = new Set(['get', 'list', 'search', 'find', 'read', 'ask', 'query', 'lookup', 'fetch', 'show', 'describe']);

  it('exposes exactly the four read tools', () => {
    expect(new Set(TOOL_NAMES)).toEqual(new Set(['get_settlement', 'get_npc', 'search_events', 'ask_ledger']));
  });

  it('every tool leads with a read verb and declares an inputSchema (no mutating tool exists)', () => {
    for (const tool of TOOLS) {
      expect(READ_VERBS.has(tool.name.split('_')[0]), `${tool.name} must be a read verb`).toBe(true);
      expect(tool.inputSchema).toBeTruthy();
    }
  });

  it('runTool rejects an unknown tool name (no hidden mutator)', () => {
    const world = loadWorld(playerExport());
    const r = runTool('delete_settlement', {}, world);
    expect(r.ok).toBe(false);
  });
});

describe('mcp-server — JSON-RPC / MCP protocol', () => {
  const ctx = { world: loadWorld(playerExport()), serverInfo: SERVER_INFO };

  it('initialize returns the protocol version, tools capability, and server info', () => {
    const res = handleMessage({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }, ctx);
    expect(res.result.protocolVersion).toBe(PROTOCOL_VERSION);
    expect(res.result.capabilities.tools).toBeTruthy();
    expect(res.result.serverInfo.name).toBe('settlementforge-truth-server');
  });

  it('the initialized notification (no id) gets no reply', () => {
    expect(handleMessage({ jsonrpc: '2.0', method: 'notifications/initialized' }, ctx)).toBeNull();
  });

  it('tools/list returns the manifest', () => {
    const res = handleMessage({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, ctx);
    expect(res.result.tools.map((t) => t.name)).toEqual(TOOL_NAMES);
  });

  it('tools/call get_settlement returns text content with receipts', () => {
    const res = handleMessage({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_settlement', arguments: { name: 'Saltmoor' } } }, ctx);
    expect(res.result.isError).toBeFalsy();
    const payload = JSON.parse(res.result.content[0].text);
    expect(payload.settlement.name).toBe('Saltmoor');
    expect(payload.receipts[0].source).toBe('settlementforge-world');
    expect(payload.receipts[0].variant).toBe('player');
  });

  it('an unknown tool → JSON-RPC error; an unknown method → -32601', () => {
    const bad = handleMessage({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'nope' } }, ctx);
    expect(bad.error).toBeTruthy();
    const noMethod = handleMessage({ jsonrpc: '2.0', id: 5, method: 'world/mutate' }, ctx);
    expect(noMethod.error.code).toBe(-32601);
  });
});

describe('mcp-server — the four tools answer with receipts', () => {
  const world = loadWorld(dmExport());

  it('get_npc finds an NPC and cites its settlement', () => {
    const r = runTool('get_npc', { name: 'Lord Varn' }, world);
    expect(r.ok).toBe(true);
    expect(r.settlementName).toBe('Saltmoor');
    expect(r.receipts[0].npc).toBe('Lord Varn');
  });

  it('search_events matches a chronicle headline with its tick', () => {
    const r = runTool('search_events', { query: 'mill' }, world);
    expect(r.matchCount).toBeGreaterThan(0);
    expect(r.matches[0].receipts[0].tick).toBe(12);
  });

  it('ask_ledger answers from state with grounding receipts', () => {
    const r = runTool('ask_ledger', { question: 'what is happening in the realm?' }, world);
    expect(r.ok).toBe(true);
    expect(typeof r.answer).toBe('string');
    expect(r.receipts[0].grounding).toBe('realm-snapshot');
  });
});

describe('mcp-server — the secrets seam is honored (serves the variant it is given)', () => {
  const SECRET_TOKENS = ['took a bribe', 'hold the toll bridge', 'whereabouts', 'missionId', 'purposeKind', 'rngSeed', 'REPLAY-ME', 'spatialLedgers'];

  it('a PLAYER export served through every tool leaks ZERO secret tokens', () => {
    const world = loadWorld(playerExport());
    const outputs = [
      runTool('get_settlement', { name: 'Saltmoor' }, world),
      runTool('get_npc', { name: 'Lord Varn' }, world),
      runTool('search_events', {}, world),
      runTool('ask_ledger', { question: 'who rules?' }, world),
    ];
    const serialized = JSON.stringify(outputs);
    for (const token of SECRET_TOKENS) {
      expect(serialized.includes(token), `player-variant server leaked "${token}"`).toBe(false);
    }
    // non-vacuous: the public NPC + settlement still resolve
    expect(outputs[0].settlement.name).toBe('Saltmoor');
    expect(outputs[1].ok).toBe(true);
    expect(outputs[1].npc.name).toBe('Lord Varn');
  });

  it('a DM export served through get_npc DOES surface the DM secret (variant preserved)', () => {
    const world = loadWorld(dmExport());
    const r = runTool('get_npc', { name: 'Lord Varn' }, world);
    expect(JSON.stringify(r)).toContain('took a bribe');
  });

  it('loadWorld rejects a payload that is not a world export', () => {
    expect(() => loadWorld({ format: 'nope' })).toThrow(/world export/i);
  });
});

describe('mcp-server — wiring', () => {
  it('validate:mcp-server is wired into `npm run check`', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.scripts['validate:mcp-server']).toBeTruthy();
    expect(pkg.scripts.check).toContain('validate:mcp-server');
  });
});
