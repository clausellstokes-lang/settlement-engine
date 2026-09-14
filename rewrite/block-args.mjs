#!/usr/bin/env node
// block-args.mjs <dock-path> <block> <dock-name> — prints the Workflow args for rewrite-block.workflow.js from the census in the dock.
import { readFileSync } from 'node:fs';
const [dock, block, dockName] = process.argv.slice(2);
if (!dock || !block || !dockName) { console.error('usage: block-args.mjs <dock-path> <block> <dock-name>'); process.exit(9); }
const census = JSON.parse(readFileSync(dock + '/docs/content/wiring-census.json', 'utf8'));
const rows = census.rows.filter((r) => r.block === block);
if (!rows.length) { console.error('no census rows for ' + block); process.exit(8); }
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const all = rows.map((r) => ({ pool: r.pool, dir: slug(block) + '--' + slug(r.pool), role: r.role || 'spine', status: r.status, variants: r.variants }));
// ARCH §8.2: an UNRESOLVED row is NO-LIST-ROW: wiring first — its card can license nothing, so it cannot be gated; it keeps its shipped rows and is listed as the block's wiring debt.
const pools = all.filter((p) => p.status === 'RESOLVED');
const wiringDebt = all.filter((p) => p.status !== 'RESOLVED').map((p) => p.pool + ' (' + p.status + ')');
process.stdout.write(JSON.stringify({ block, dock: dockName, pools, wiringDebt, maxRounds: 6 }, null, 1) + '\n');
