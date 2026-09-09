#!/usr/bin/env node
// block-args.mjs <dock-path> <block> <dock-name> — prints the Workflow args for rewrite-block.workflow.js from the census in the dock.
import { readFileSync } from 'node:fs';
const [dock, block, dockName] = process.argv.slice(2);
if (!dock || !block || !dockName) { console.error('usage: block-args.mjs <dock-path> <block> <dock-name>'); process.exit(9); }
const census = JSON.parse(readFileSync(dock + '/docs/content/wiring-census.json', 'utf8'));
const rows = census.rows.filter((r) => r.block === block);
if (!rows.length) { console.error('no census rows for ' + block); process.exit(8); }
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const pools = rows.map((r) => ({ pool: r.pool, dir: slug(block) + '--' + slug(r.pool), role: r.role || 'spine', status: r.status, variants: r.variants }));
process.stdout.write(JSON.stringify({ block, dock: dockName, pools, maxRounds: 6 }, null, 1) + '\n');
