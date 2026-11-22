/**
 * server.js — a dependency-free MCP server over stdio (Vision V-12 THE TRUTH
 * SERVER). Implements the Model Context Protocol handshake + tool calls as
 * newline-delimited JSON-RPC 2.0 on stdin/stdout, with NO external SDK: the
 * protocol surface here is small (initialize / tools/list / tools/call / ping),
 * and a dependency-free implementation keeps the supply chain empty (a vendored
 * SDK would need the public/map manifest treatment).
 *
 * `handleMessage` is pure (message + context → reply|null) so the protocol is
 * unit-testable without real pipes. `startStdio` wires it to the process streams;
 * stdout carries ONLY JSON-RPC frames (logs go to stderr) so the channel stays
 * clean.
 *
 * READ-ONLY: the only methods are the handshake + read tools. There is no method
 * that writes anything.
 */

import { TOOLS, TOOL_NAMES, runTool } from './tools.js';

/** MCP protocol revision this server speaks. */
export const PROTOCOL_VERSION = '2024-11-05';
export const SERVER_INFO = Object.freeze({ name: 'settlementforge-truth-server', version: '1.0.0' });

/**
 * Handle one JSON-RPC message. Returns the reply object, or null for a
 * notification (no id → no reply). Pure over `ctx` — never mutates it.
 * @param {any} msg a parsed JSON-RPC 2.0 message
 * @param {{ world: any, serverInfo?: any }} ctx
 * @returns {any|null}
 */
export function handleMessage(msg, ctx) {
  const serverInfo = (ctx && ctx.serverInfo) || SERVER_INFO;
  const hasId = msg && msg.id !== undefined && msg.id !== null;
  const id = hasId ? msg.id : null;
  const reply = (result) => ({ jsonrpc: '2.0', id, result });
  const fail = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

  if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    return hasId ? fail(-32600, 'Invalid Request') : null;
  }

  switch (msg.method) {
    case 'initialize':
      return reply({ protocolVersion: PROTOCOL_VERSION, capabilities: { tools: {} }, serverInfo });
    case 'notifications/initialized':
    case 'initialized':
      return null; // a notification — acknowledged by doing nothing
    case 'ping':
      return reply({});
    case 'tools/list':
      return reply({ tools: TOOLS });
    case 'tools/call': {
      const params = msg.params && typeof msg.params === 'object' ? msg.params : {};
      const name = params.name;
      const args = params.arguments && typeof params.arguments === 'object' ? params.arguments : {};
      if (!TOOL_NAMES.includes(name)) return fail(-32602, `Unknown tool "${name}". Read-only tools: ${TOOL_NAMES.join(', ')}.`);
      let result;
      try {
        result = runTool(name, args, ctx && ctx.world);
      } catch (err) {
        result = { ok: false, error: String((err && err.message) || err) };
      }
      // MCP tool result envelope: text content + isError flag (never a protocol error).
      return reply({
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: result && result.ok === false,
      });
    }
    default:
      return hasId ? fail(-32601, `Method not found: ${msg.method}`) : null;
  }
}

/** Serialize + write one JSON-RPC frame (newline-delimited). */
function writeFrame(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

/**
 * Wire the stdio transport: read newline-delimited JSON-RPC from stdin, answer on
 * stdout. Blocking-free; exits 0 on stdin end.
 * @param {{ world: any, serverInfo?: any }} ctx
 */
export function startStdio(ctx) {
  let buffer = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let nl;
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        writeFrame({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
        continue;
      }
      const res = handleMessage(msg, ctx);
      if (res) writeFrame(res);
    }
  });
  process.stdin.on('end', () => process.exit(0));
}
