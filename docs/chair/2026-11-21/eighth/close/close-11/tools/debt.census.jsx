/** @vitest-environment jsdom */
// MEASURE (CLOSE-11, VIABILITY-TRUE-2 V1): which homes print a debt sentence on the rendered page. Changes nothing.
import React from 'react';
import { test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { readFileSync, writeFileSync } from 'node:fs';
const TREE = String(process.env.M_TREE); const PLAN = JSON.parse(readFileSync(String(process.env.M_PLAN), 'utf8')); const OUT = String(process.env.M_OUT);
const DEBT = /\b(debts?|owes?|owed|owing|repay|repaid|creditors?|lenders?|indebted|loans?)\b/i;
test('debt homes', async () => {
  const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
  const soak = await import(/* @vite-ignore */ `${TREE}/scripts/audit/soak-review/corpus.mjs`);
  const dvm = await import(/* @vite-ignore */ `${TREE}/src/domain/display/dossierViewModel.js`);
  const T = {
    Overview: (await import(/* @vite-ignore */ `${TREE}/src/components/new/tabs/OverviewTab.jsx`)).OverviewTab,
    History: (await import(/* @vite-ignore */ `${TREE}/src/components/new/tabs/HistoryTab.jsx`)).HistoryTab,
    Viability: (await import(/* @vite-ignore */ `${TREE}/src/components/new/tabs/ViabilityTab.jsx`)).ViabilityTab,
    DailyLife: (await import(/* @vite-ignore */ `${TREE}/src/components/new/tabs/DailyLifeTab.jsx`)).DailyLifeTab,
    Economics: (await import(/* @vite-ignore */ `${TREE}/src/components/new/tabs/EconomicsTab.jsx`)).EconomicsTab,
  };
  await dens.loadGenerationLawPayloads(); await soak.ensureLaws();
  const lines = [];
  for (const row of PLAN) {
    const s = row.soak != null ? soak.birth(row.soak).settlement : pipe.generateSettlementPipeline(dens.birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const out = { key: row.key, tier: s.tier, stress: (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type), tensions: (s.history?.currentTensions || []).map((t) => t.type), summary: String(dvm.deriveViability(s).summary || ''), debt: [] };
    for (const [tab, C] of Object.entries(T)) {
      if (!C) continue;
      let text = '';
      try { const r = render(<C settlement={s} />); text = r.container.textContent || ''; } catch (e) { text = `RENDER-ERROR ${String(e).slice(0, 80)}`; }
      cleanup();
      for (const sen of text.split(/(?<=[.!?])\s+|(?<=[a-z])(?=[A-Z])/)) if (DEBT.test(sen)) out.debt.push(`${tab}: ${sen.trim().slice(0, 160)}`);
    }
    lines.push(JSON.stringify(out));
  }
  writeFileSync(OUT, `${lines.join('\n')}\n`);
}, 7200000);
