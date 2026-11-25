/** @vitest-environment node */
/**
 * BATCH item 3 (C1; the chair's RULING-R24 R24m): the proof's record halves on a tree.
 *   mode `steps`  (R24m (2)): for each of the 39 V carriers, every pipeline step's patch hashed (`onStep`), the birth names mapped
 *                 back to the old forms, so two trees compare step by step.
 *   mode `public` (R24m (4)): for each carrier, the player's projection (`toPublicSafe(withPublicProse(record))`) searched for the
 *                 three old strings, and the record's description of the governing form (`powerStructure.governingDesc`
 *                 / the governing faction's `desc`) written out.
 *   mode `golden` (the golden rows): every row of the golden corpus (`tests/helpers/goldenMasterCorpus.js`), its key and its
 *                 governing name, for the rows governed by one of the six names.
 *   mode `kinds`  (R24m (3)): over a whole plan, per birth: the conflicts' issues, the capture state, and the faction
 *                 relationships' types, so the 39's kinds can be looked for among the other 861.
 * Env: CP_TREE, CP_MODE, CP_PLAN, CP_OUT.
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const T = String(process.env.CP_TREE); const MODE = String(process.env.CP_MODE); const PLAN = String(process.env.CP_PLAN || ''); const OUT = String(process.env.CP_OUT);
const OLD = ['Corrupt Council', 'Corrupt City Council', 'Shadow Senate'];
const SIX = new Set([...OLD, 'Council of Aldermen', 'Council of Syndics', 'Senate']);
const BACK = [[/Council of Aldermen/g, 'Corrupt Council'], [/Council of Syndics/g, 'Corrupt City Council'], [/(?<!Arcane |Merchant |Shadow |Grand )\bSenate\b/g, 'Shadow Senate']];
const back = (t) => BACK.reduce((s, [re, to]) => s.replace(re, to), t);

test(`C1 proof (${MODE})`, async () => {
  const pipe = await import(/* @vite-ignore */ `${T}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${T}/src/domain/density/densityCreateBoundary.js`);
  await dens.loadGenerationLawPayloads();
  const out = [];
  if (MODE === 'golden') {
    const { goldenCorpus, keyOf } = await import(/* @vite-ignore */ `${T}/tests/helpers/goldenMasterCorpus.js`);
    for (const c of goldenCorpus()) {
      const { _seed, ...cfg } = c;
      const s = pipe.generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
      const gov = String(s?.powerStructure?.governingName ?? '');
      if (SIX.has(gov)) out.push(JSON.stringify({ key: keyOf(c), gov }));
    }
  } else {
    const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
    const { toPublicSafe } = await import(/* @vite-ignore */ `${T}/src/domain/display/publicSafe.js`);
    const { withPublicProse } = await import(/* @vite-ignore */ `${T}/src/domain/display/publicProse.js`);
    for (const row of plan) {
      const steps = [];
      const s = pipe.generateSettlementPipeline(row.config, null, { seed: row.seed, customContent: {},
        ...(MODE === 'steps' ? { onStep: (name, _ctx, patch) => {
          let t; try { t = JSON.stringify(patch); } catch { t = 'unserialisable'; }
          steps.push([name, createHash('sha256').update(back(String(t))).digest('hex').slice(0, 12)]);
        } } : {}) });
      const gov = String(s?.powerStructure?.governingName ?? '');
      if (MODE === 'steps') out.push(JSON.stringify({ seed: row.seed, gov, steps }));
      else if (MODE === 'public') {
        const pub = JSON.stringify(toPublicSafe(withPublicProse(s)));
        const g = (s.powerStructure?.factions || []).find((f) => f?.isGoverning);
        out.push(JSON.stringify({ seed: row.seed, gov, oldOnPlayerPage: OLD.filter((o) => pub.includes(o)), desc: g?.desc ?? null, governingDesc: s.powerStructure?.governingDesc ?? null }));
      } else if (MODE === 'kinds') {
        out.push(JSON.stringify({ seed: row.seed, size: row.size, gov, carrier: SIX.has(gov),
          issues: (s.powerStructure?.conflicts || []).map((c) => c?.issue), capture: s.powerStructure?.criminalCaptureState ?? null,
          relTypes: (s.powerStructure?.factionRelationships || []).map((r) => r?.type) }));
      }
    }
  }
  writeFileSync(OUT, `${out.join('\n')}\n`);
}, 1200000);
