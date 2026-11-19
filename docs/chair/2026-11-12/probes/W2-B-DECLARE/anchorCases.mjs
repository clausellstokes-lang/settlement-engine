// W2-B-DECLARE second seat — the chair's added item (DS-GEN-9, the event types): over the census's 720 births, the towns
// whose marker event (`generalStateProse.js :: significantEvent`) carries no `anchored` flag, and whether the event's
// pool speaks there: the kernel's law 5 silences a pool that partitions by `anchor` when the desk answers nothing.
// TREE=<tree> node anchorCases.mjs <corpus.ndjson.gz>   (corpus from births.mjs)
import fs from 'node:fs'; import zlib from 'node:zlib';
const R = process.env.TREE + '/src';
const { significantEvent, eventAnchorDimension, eventTypePoolKey } = await import(R + '/domain/display/stateProse/generalStateProse.js');
const { generalDeskLines } = await import(R + '/components/new/generalDeskRead.js');
const rows = zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n').map((l) => JSON.parse(l));
const out = { towns: 0, absent: 0, silentBefore: 0, silent: 0, bySize: {}, byArm: {} };
for (const { seed, s } of rows) {
  out.towns++;
  const marker = significantEvent(s?.history?.historicalEvents || []);
  if (!marker || marker.anchored !== undefined) continue;
  out.absent++;
  // the desk's own entry, as the page reads it: the history chapter's identity lines, before them the event's own
  void eventTypePoolKey; void eventAnchorDimension;
  const identity = generalDeskLines(s, {}).history?.identity || [];
  out.lines = (out.lines || 0) + identity.length;
  const speaks = identity.length > 0;
  if (!speaks) out.silent++;
  const size = seed.match(/(thorp|hamlet|village|town|city|metropolis)/)[1]; const arm = seed.startsWith('r2s-') ? 'crisis' : 'calm';
  out.bySize[size] = (out.bySize[size] || 0) + (speaks ? 0 : 1); out.byArm[arm] = (out.byArm[arm] || 0) + (speaks ? 0 : 1);
}
console.log(JSON.stringify(out));
