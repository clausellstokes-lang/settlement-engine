import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = process.argv[2]; const gdir = path.join(D, 'src/data/dossierStateProse');
const hist = {}; const angles = {}; let pools = 0, variants = 0, below = 0, need = 0, above = 0, extra = 0; const perBlockBelow = {};
for (const f of readdirSync(gdir).filter((f) => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) {
    pools++; const n = vs.length; variants += n; hist[n] = (hist[n] || 0) + 1;
    for (const v of vs) angles[v.angle || '?'] = (angles[v.angle || '?'] || 0) + 1;
    if (n < 4) { below++; need += 4 - n; perBlockBelow[block] = (perBlockBelow[block] || 0) + 1; }
    if (n > 4) { above++; extra += n - 4; }
  }
}
console.log('pools', pools, 'variants', variants, 'mean', (variants / pools).toFixed(2));
console.log('variants-per-pool histogram:', JSON.stringify(Object.fromEntries(Object.entries(hist).sort((a, b) => a[0] - b[0]))));
console.log('below four:', below, 'pools · variants needed to reach four:', need, '| exactly four:', hist[4] || 0, '| above four:', above, 'pools · variants beyond four:', extra);
console.log('angles:', JSON.stringify(angles));
console.log('blocks with pools below four:', Object.keys(perBlockBelow).length, 'of 68');
