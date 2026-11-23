// VEIL-16 (V8-3): THE CLIENT'S TWIN TIMED ON THE READER'S V8-3 ROW (REVIEW-VEIL-8/hand/cost8.sql: `houses` criminal houses
// hidden whole by hand, "Aa guild <i>" with `namelen` words, one open house; economicState.rows of `hitrows` records each
// holding one distinct string that names a hidden house and `coldrows` that name none). The twin's own read of the
// stored row, as the hand rows run it: galleryPayloadFor, then projectShareVeil (Reveal DM off). Median of R8_ROUNDS.
//   RV6_SRC=<tree> RV6_PROBE=twin8.probe.jsx R8_OUT=<file> [R8_HOUSES=5 R8_HIT=10000 R8_COLD=0 R8_NAMELEN=1 R8_ROUNDS=5] \
//     npx vitest run --config <this folder>/vitest.config.mjs
import { it, vi } from 'vitest';
import { appendFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
it('twin8', async () => {
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const H = Number(process.env.R8_HOUSES || 5); const HIT = Number(process.env.R8_HIT || 10000); const COLD = Number(process.env.R8_COLD || 0);
  const NL = Number(process.env.R8_NAMELEN || 1); const ROUNDS = Number(process.env.R8_ROUNDS || 5);
  const tail = ' of the long name'.repeat(NL);
  const houses = Array.from({ length: H }, (_, k) => ({ id: `h${k + 1}`, name: `Aa guild ${k + 1}${tail}`, category: 'Criminal' }));
  const town = { name: 'Costwell', tier: 'town', institutions: [...houses, { name: 'Fish market', category: 'Economy' }],
    economicState: { rows: [...Array.from({ length: HIT }, (_, j) => ({ d: `note ${j + 1} on aa guild ${1 + ((j + 1) % H)}${tail}` })),
      ...Array.from({ length: COLD }, (_, j) => ({ d: `plain cargo line ${j + 1}` }))] } };
  const text = JSON.stringify(town);
  const ov = { [veil.VEIL_OVERRIDE_KEY]: { v: 1, mode: 'live', deltas: houses.map((h) => ({ address: `card:institution:${h.id}`, hidden: true })) } };
  const ms = []; let out = null;
  for (let r = 0; r < ROUNDS; r += 1) {
    const t0 = process.hrtime.bigint();
    out = veil.projectShareVeil(veil.galleryPayloadFor(JSON.parse(text), { shareDm: false, memberOverrides: ov }), ov);
    ms.push(Number(process.hrtime.bigint() - t0) / 1e6);
  }
  const sorted = [...ms].sort((a, b) => a - b);
  const rows = out?.economicState?.rows || [];
  const msg = (`twin8 h=${H} hit=${HIT} cold=${COLD} nl=${NL} :: twin | houses listed ${(out?.institutions || []).length} | rows back ${rows.length} | rows with d ${rows.filter((x) => x && typeof x === 'object' && 'd' in x).length} | bytes ${JSON.stringify(out).length} | median ${sorted[Math.floor(sorted.length / 2)].toFixed(1)} ms of ${ms.map((x) => x.toFixed(0)).join(' ')}`);
  console.log(msg);
  if (process.env.R8_OUT) appendFileSync(process.env.R8_OUT, `${msg}\n`);
}, 3_600_000);
