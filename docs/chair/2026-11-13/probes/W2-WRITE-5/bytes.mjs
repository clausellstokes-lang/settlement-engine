// bytes.mjs <car> <why> : bank the prose leaves' growth as declared rows (node zlib level 9, the test's own measure)
import { readFileSync, writeFileSync } from 'node:fs'; import { gzipSync } from 'node:zlib';
const P = 'scripts/.prose-byte-baseline.json'; const b = JSON.parse(readFileSync(P, 'utf8'));
const [car, why] = process.argv.slice(2);
for (const [leaf, row] of Object.entries(b.leaves)) {
  const data = readFileSync(leaf); const raw = data.length; const gz = gzipSync(data, { level: 9 }).length;
  if (raw === row.raw) continue;
  if (raw > row.raw) {
    const prev = b.declared.filter((d) => d.leaf === leaf);
    const frm = prev.length ? prev[prev.length - 1].toRaw : b.genesis[leaf].raw;
    if (raw > frm) b.declared.push({ car, leaf, fromRaw: frm, toRaw: raw, gzipAfter: gz, reason: `+${raw - row.raw} B raw over the committed ${row.raw} (gzip level 9: ${row.gzip} -> ${gz}): ${why}` });
  }
  console.log(leaf, row.raw, '->', raw, 'gzip', row.gzip, '->', gz); row.raw = raw; row.gzip = gz;
}
writeFileSync(P, JSON.stringify(b, null, 2) + '\n');
