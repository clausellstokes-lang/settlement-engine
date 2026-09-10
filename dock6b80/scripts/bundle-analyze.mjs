// One-shot: read dist/stats.json (extracted from rollup-plugin-visualizer
// output) and print the biggest leaf modules per chunk, plus per-chunk
// totals. Used to inform Phase 5 code-splitting decisions.
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('dist/stats.json', 'utf8'));
const root = data.tree;
const nodeParts = data.nodeParts;

// Walk tree, gather leaves keyed by uid + path.
function* leaves(node, path = []) {
  if (!node) return;
  if (node.uid) {
    yield { uid: node.uid, name: node.name, path: [...path, node.name].join('/') };
  } else if (node.children) {
    for (const c of node.children) yield* leaves(c, [...path, node.name].filter(Boolean));
  }
}

function chunkSummary(chunk) {
  const ls = [...leaves(chunk)];
  const sized = ls.map(l => {
    const part = nodeParts?.[l.uid];
    const renderedLength = part?.renderedLength ?? 0;
    const gzipLength     = part?.gzipLength ?? 0;
    return { ...l, renderedLength, gzipLength };
  });
  sized.sort((a, b) => b.renderedLength - a.renderedLength);
  return sized;
}

const chunks = root.children || [];
for (const chunk of chunks) {
  const sized = chunkSummary(chunk);
  const total = sized.reduce((s, m) => s + m.renderedLength, 0);
  const gzTotal = sized.reduce((s, m) => s + m.gzipLength, 0);
  if (total < 100_000) continue; // skip small chunks
  console.log(`\n=== ${chunk.name}  (${Math.round(total/1024)} kB raw, ${Math.round(gzTotal/1024)} kB gz) ===`);
  let printed = 0;
  for (const m of sized) {
    if (printed >= 12) break;
    if (m.renderedLength < 1024) break;
    const tag = m.path.replace(/^.*node_modules\//, 'NM:').replace(/^.*\/src\//, 'src/').slice(0, 80);
    console.log(`  ${String(Math.round(m.renderedLength/1024)).padStart(4)}kB  ${tag}`);
    printed++;
  }
}
