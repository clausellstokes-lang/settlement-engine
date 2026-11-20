import { readFileSync } from 'node:fs'; import { join } from 'node:path';
const ROOT = process.cwd();
const sh = await import(ROOT + '/tests/lint/presumedThings.shared.mjs');
const reg = JSON.parse(readFileSync(join(ROOT, 'tests/lint/presumedThings.register.json'), 'utf8'));
const wid = JSON.parse(readFileSync(join(ROOT, sh.WIDENED_REGISTER_REL || 'tests/lint/presumedThings.widened.register.json'), 'utf8'));
const hits = sh.scanTree(ROOT); const found = new Set(hits.map((h) => sh.hitKey(h.file, h.thing, h.text)));
for (const k of [...sh.bankedKeys(reg), ...sh.bankedKeys(wid)]) if (!found.has(k)) console.log('STALE', k.slice(0, 200));
