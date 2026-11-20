import { it, vi } from 'vitest';
import { appendFileSync } from 'node:fs';
import { loadEngine } from '/home/user/wt/r3tell3/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const log = (...a) => appendFileSync(process.env.OUTF, a.join(' ') + '\n');
it('husk census', async () => {
  const E = await loadEngine(process.env.RV6_SRC);
  let n = 0, rows = 0, cand = 0; const lens = {};
  for (const b of E.pool(2, [0, 1])) {
    const A = E.birth(b.cfg, b.seed, null); n += 1;
    const hid = (A.institutions || []).filter((h) => E.isHideableHouse(h)).map((h) => String(h.name).toLowerCase());
    for (const [f, list] of Object.entries(A.availableServices || {})) {
      if (f === 'criminal' || !Array.isArray(list)) continue;
      (lens[`${b.size}|${f}`] ||= []).push(list.length);
      for (const x of list) { if (!x || typeof x.institution !== 'string') continue; rows += 1; const i = x.institution.toLowerCase();
        if (hid.some((h) => i !== h && i.includes(h))) { cand += 1; log('CANDIDATE', b.seed, f, JSON.stringify(x)); } }
    }
  }
  log(`births ${n}; non-criminal rows with a string institution ${rows}; rows whose institution holds a hideable house's name in another spelling ${cand}`);
}, 600000);
