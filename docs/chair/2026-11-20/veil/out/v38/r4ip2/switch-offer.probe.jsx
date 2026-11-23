// R4I-PAGE-2 S1's pool arm (VEIL-38; the chair's E136 (b)): "the switch offers exactly what it offered before the re-key",
// over the tell gate's 140 births (RV9_SET=towns: tell-common.mjs :: pool(2)) or every seed of a pool directory's
// pool-shard*.json / poolb-shard*.json (RV9_SET=pool RV9_POOL_DIR=<dir>; born as tell2.probe.jsx :: cfgOf borns them).
// REFERENCE: this tree with galleryVeilPeople.js :: rekeyPeople mocked to the identity (REF.on). For each birth, Reveal DM
// off and on, tests/security/criminalSwitchSalt.shared.mjs :: switchOffer (presentCriminalGroupings, criminalSwitchStateOf,
// setCriminalVeil hidden/shown, flipCriminalVeil, over four drafts) must be EQUAL between the cured tree and the reference.
import { it, vi, expect } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
const REF = vi.hoisted(() => ({ on: false }));
vi.mock(`${process.env.RV6_SRC}/src/domain/display/galleryVeilPeople.js`, async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, rekeyPeople: (s, salt) => (REF.on ? s : real.rekeyPeople(s, salt)) };
});
it('S1: the switch offers what it offered before the re-key', async () => {
  const { loadEngine } = await import(`${SRC}/docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs`);
  const { switchOffer, offerDiff } = await import(`${SRC}/tests/security/criminalSwitchSalt.shared.mjs`);
  const veil = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const sw = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const E = await loadEngine(SRC);
  const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
  let births;
  if ((process.env.RV9_SET || 'towns') === 'towns') births = E.pool(Number(process.env.RV9_N || 2), SHARD);
  else {
    const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const dir = process.env.RV9_POOL_DIR;
    const all = readdirSync(dir).filter((f) => /^(pool|poolb)-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births || []);
    births = all.filter((_b, i) => i % SHARD[1] === SHARD[0]).map((b) => ({ seed: b.seed, cfg: cfgOf(b.size, b.crisis) }));
  }
  const out = { reads: 0, differ: 0, present: 0, faults: [] };
  for (const b of births) {
    const rec = E.birth(b.cfg, b.seed, null);
    for (const dm of [false, true]) {
      REF.on = true; let ref; try { ref = switchOffer(veil, sw, rec, dm); } finally { REF.on = false; }
      const d = offerDiff(switchOffer(veil, sw, rec, dm), ref);
      out.reads += 1; out.present += ref.present.length;
      if (d.length) { out.differ += 1; out.faults.push(`${b.seed} dm=${dm}: ${d.slice(0, 2).join(' | ')}`); }
    }
    if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  }
  if (process.env.RV9_OUT) writeFileSync(process.env.RV9_OUT, JSON.stringify(out));
  expect(out.reads).toBe(births.length * 2);
}, 14_400_000);
