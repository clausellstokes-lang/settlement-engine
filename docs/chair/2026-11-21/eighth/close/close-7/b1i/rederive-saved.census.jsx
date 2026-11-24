/** @vitest-environment node */
import { test } from 'vitest';
import { writeFileSync } from 'node:fs';
// R24e (1)(c)(ii): a saved desert place born on the BEFORE tree (lit) holding a withheld house, re-derived on the cure's tree
// (b1i) through dmLayer.rederive exactly as settlementRederiveAction.js wires it (run = generateSettlementPipeline after the
// law payloads load), first with an empty layer, then with a layer holding one plain DM edit.
test('rederive a saved desert place', async () => {
  const L = '/home/user/wt/lit/src/'; const B = '/home/user/wt/b1i/src/';
  const lit = await import(/* @vite-ignore */ L + 'generators/generateSettlementPipeline.js');
  const litB = await import(/* @vite-ignore */ L + 'domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(/* @vite-ignore */ L + 'store/configSlice.js');
  await litB.loadGenerationLawPayloads();
  const bPipe = await import(/* @vite-ignore */ B + 'generators/generateSettlementPipeline.js');
  const bB = await import(/* @vite-ignore */ B + 'domain/density/densityCreateBoundary.js');
  const bRunner = await import(/* @vite-ignore */ B + 'generators/pipeline.js');
  const { rederive } = await import(/* @vite-ignore */ B + 'domain/edit/dmLayer.js');
  await bB.loadGenerationLawPayloads();
  const engine = { run: (c, n, o) => bPipe.generateSettlementPipeline(c, n, o), getStepMeta: bRunner.getStepMeta };
  const out = [];
  for (const seed of ['dp-town-39', 'dp-city-20']) {
    const config = litB.birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1], _randomizePriorities: true });
    const saved = lit.generateSettlementPipeline(config, null, { seed, customContent: {} });
    const names = (r) => (r?.institutions || []).map((i) => i.name);
    let res; let err = null;
    try { res = rederive(saved, saved.config || config, { roots: {} }, engine, undefined); } catch (e) { err = String(e?.message || e).slice(0, 300); }
    out.push({ seed, savedSeed: saved._seed ?? null, terrain: saved.config?.terrainType, err,
      savedWithheld: names(saved).filter((n) => ['Fish market', 'Sawmill (commercial)', "Hunter's lodge", 'Charcoal burner'].includes(n)),
      rederivedWithheld: res ? names(res.record).filter((n) => ['Fish market', 'Sawmill (commercial)', "Hunter's lodge", 'Charcoal burner'].includes(n)) : null,
      lost: res ? names(saved).filter((n) => !names(res.record).includes(n)) : null, gained: res ? names(res.record).filter((n) => !names(saved).includes(n)) : null });
  }
  writeFileSync(process.env.RD_OUT, JSON.stringify(out, null, 1));
}, 3600000);
