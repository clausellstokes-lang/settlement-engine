import { readFileSync } from 'node:fs';
const mod = await import('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-a/scripts/implementation-packets.mjs');
const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/consist';
const manifest = JSON.parse(readFileSync(root + '/docs/implementation/PACKET_MANIFEST.json', 'utf8'));
const res = mod.validatePacketManifest(manifest, { rootDir: root });
const errors = res.errors ?? res;
console.log('errors:', Array.isArray(errors) ? errors.length : JSON.stringify(res).slice(0, 300));
if (Array.isArray(errors)) for (const e of errors.slice(0, 12)) console.log(' -', String(e).slice(0, 260));
