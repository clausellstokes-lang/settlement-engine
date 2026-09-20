// packet-merge.mjs — insert compiled manifest entries into PACKET_MANIFEST.json SURGICALLY
// (text insertion before the packets array's closing bracket; the rest of the file is never
// re-serialised), and copy each packet's Markdown into its family directory.
// usage: node packet-merge.mjs <consist> <family-dir-name> <scratch>/<ID>.manifest.json ...
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
const [root, family, ...manifests] = process.argv.slice(2);
const mp = join(root, 'docs/implementation/PACKET_MANIFEST.json');
let text = readFileSync(mp, 'utf8');
const existing = JSON.parse(text);
const ids = new Set(existing.packets.map((p) => p.id));
const indent = (s, n) => s.split('\n').map((l) => (l ? ' '.repeat(n) + l : l)).join('\n');
const inserts = [];
for (const mf of manifests) {
  const entry = JSON.parse(readFileSync(mf, 'utf8'));
  if (ids.has(entry.id)) { console.error(`SKIP ${entry.id}: already in the manifest`); continue; }
  entry.packetPath = `docs/implementation/packets/${family}/${entry.id}.md`;
  const md = join(dirname(mf), `${entry.id}.md`);
  if (!existsSync(md)) { console.error(`REFUSE ${entry.id}: no ${md}`); process.exit(1); }
  mkdirSync(join(root, 'docs/implementation/packets', family), { recursive: true });
  copyFileSync(md, join(root, entry.packetPath));
  inserts.push(indent(JSON.stringify(entry, null, 2), 4));
  console.log(`+ ${entry.id} (${entry.status}) → ${entry.packetPath}`);
}
if (!inserts.length) process.exit(0);
// find the end of the packets array: the last "\n  ]" that closes "packets"
const key = text.indexOf('"packets": [');
const close = text.indexOf('\n  ]', key);
if (key < 0 || close < 0) { console.error('REFUSE: packets array not found'); process.exit(1); }
const before = text.slice(0, close).replace(/\s*$/, '');
const sep = before.endsWith('[') ? '\n' : ',\n';
text = before + sep + inserts.join(',\n') + text.slice(close);
writeFileSync(mp, text);
JSON.parse(readFileSync(mp, 'utf8')); // must still parse
console.log(`manifest: +${inserts.length} entries; parses`);
