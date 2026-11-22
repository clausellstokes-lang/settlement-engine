#!/usr/bin/env node
/**
 * cli.js — the SettlementForge Truth Server entry (Vision V-12).
 *
 * Loads a LOCAL world-export JSON and serves it read-only over MCP/stdio. The
 * world path comes from argv[2] or the SF_WORLD_EXPORT env var. All human-facing
 * logging goes to stderr — stdout is the JSON-RPC channel and must stay clean.
 *
 * Usage:  sf-truth-server ./my-world.player.json
 *         SF_WORLD_EXPORT=./my-world.json sf-truth-server
 */
import { readFileSync } from 'node:fs';
import { startStdio, SERVER_INFO } from '../src/server.js';
import { loadWorld } from '../src/tools.js';

const path = process.argv[2] || process.env.SF_WORLD_EXPORT;
if (!path) {
  console.error('Usage: sf-truth-server <world-export.json>  (or set SF_WORLD_EXPORT)');
  process.exit(2);
}

let world;
try {
  world = loadWorld(JSON.parse(readFileSync(path, 'utf8')));
} catch (err) {
  console.error(`Failed to load world export "${path}": ${err && err.message ? err.message : err}`);
  process.exit(2);
}

console.error(`SettlementForge Truth Server — serving "${world.realmName}" (${world.variant} variant, ${world.settlements.length} settlement${world.settlements.length === 1 ? '' : 's'}). Read-only.`);
startStdio({ world, serverInfo: SERVER_INFO });
