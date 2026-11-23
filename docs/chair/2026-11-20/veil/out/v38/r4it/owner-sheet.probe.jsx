// R4I-TONIGHT item C, THE COUNT ON THE OWNER'S PAGE: the owner's own Tonight sheet (composeTonightSheet over the stored
// record, no veil, no read) of every birth, dumped whole (its people: name, role, why, castLabel, castKind, line, says,
// sameAs) so the tree before the cure (b088fcfc5) and the cured tree can be compared by owner-moves.mjs. Births as
// tonight-names.probe.jsx takes them (RV9_SET=towns | pool, RV9_POOL_DIR, RV9_SHARD, RV9_LIMIT). No server, no render.
import { it } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';

const SRC = process.env.RV6_SRC;
it('item C: the owner\'s own Tonight sheet, per birth', async () => {
  const { loadEngine } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const { composeTonightSheet } = await import(`${SRC}/src/domain/summary/tonightSheet.js`);
  const E = await loadEngine(SRC);
  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  const LIMIT = Number(process.env.RV9_LIMIT || 0);
  let births;
  if ((process.env.RV9_SET || 'towns') === 'towns') births = E.pool(Number(process.env.RV9_N || 2), SHARD);
  else {
    const dir = process.env.RV9_POOL_DIR;
    const files = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort();
    const all = files.flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    births = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, cfg: cfgOf(b.size, b.crisis) }));
  }
  if (LIMIT) births = births.slice(0, LIMIT);
  const out = { births: [] };
  for (const b of births) {
    const rec = E.birth(b.cfg, b.seed, null);
    const sheet = composeTonightSheet(rec);
    out.births.push({ seed: b.seed, people: sheet.people.map((p) => ({ name: p.name, role: p.role, why: p.why, castLabel: p.castLabel, castKind: p.castKind, castId: p.castId, line: p.line, says: p.says, sameAs: p.sameAs })), crisis: sheet.crisis?.line || null });
    if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  }
  if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
}, 14_400_000);
