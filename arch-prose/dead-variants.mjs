// READ-ONLY. Variants whose declared slots the composer's UNION bag can never fill.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fillSites, composedFillByBlock } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/tests/helpers/dossierComposedFill.js';
const DIR = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/data/dossierStateProse';
const byBlock = composedFillByBlock(fillSites());
let dead = 0, live = 0, noSite = 0;
const rows = [];
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.generated.js')).sort()) {
  const mod = await import(`file://${join(DIR, f)}`);
  for (const [block, b] of Object.entries(Object.values(mod)[0])) {
    const bag = byBlock.get(block);
    let d = 0, l = 0; const missing = new Set(); let n = 0;
    for (const list of Object.values(b.pools || {})) for (const v of list) {
      n++;
      if (!bag) { noSite++; continue; }
      const bad = (v.slots || []).filter((s) => !bag.slots.includes(s));
      if (bad.length) { d++; bad.forEach((s) => missing.add(s)); } else l++;
    }
    if (!bag) { rows.push([block, n, 'NO CALL SITE', '']); continue; }
    dead += d; live += l;
    if (d) rows.push([block, n, `${d} unreachable`, [...missing].sort().join(',')]);
  }
}
console.log('block · variants · verdict · slots the bag never offers');
for (const r of rows.sort()) console.log(r.join(' · '));
console.log(`\nTOTAL over the 53 wired blocks: reachable ${live} · UNREACHABLE ${dead}`);
console.log(`variants in the 15 blocks with no call site: ${noSite}`);
console.log(`grand total: ${live + dead + noSite}`);
