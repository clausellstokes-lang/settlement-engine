/** @vitest-environment jsdom */
// PG (VEIL-56) V29 (2)(b) PLANT, a MEASURE: a served document the engine cannot read. The page is built as gallery.js builds it
// at ALL-SHOWN, except that rederiveForPage runs on a copy WITHOUT its config (servedDefence, getInstFlags, the crime list's and
// the recent conflict's writers then draw nothing), and the config is put back after: the served document with every
// re-derived key ABSENT. Each tab's printed lines are diffed against the normal page's: a line that is printed only on the
// plant, or changed, is a reader printing from nothing.
import React from 'react';
import { it } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { cleanup, render } from '@testing-library/react';
const SRC = process.env.SRC; const POOL = process.env.POOL; const OUT = process.env.OUT; const LIMIT = Number(process.env.LIMIT || 1e9);
const clone = (v) => JSON.parse(JSON.stringify(v));
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
it('plant', async () => {
  const { veilPublicPayload } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const GV = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { presentCriminalGroupings, setCriminalVeil } = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const { loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const SubstrateTab = (await import(`${SRC}/src/components/new/tabs/SubstrateTab.jsx`)).default;
  const { DefenseTab } = await import(`${SRC}/src/components/new/tabs/DefenseTab.jsx`);
  const SummaryTab = (await import(`${SRC}/src/components/new/SummaryTab.jsx`)).default;
  const { OverviewTab } = await import(`${SRC}/src/components/new/tabs/OverviewTab.jsx`);
  const { EconomicsTab } = await import(`${SRC}/src/components/new/tabs/EconomicsTab.jsx`);
  await loadGenerationLawPayloads();
  const TABS = {
    foundations: (s) => <SubstrateTab settlement={s} />,
    defense: (s) => <DefenseTab settlement={s} narrativeNote={null} publicDossier playerView />,
    summary: (s) => <SummaryTab settlement={s} />,
    overview: (s) => <OverviewTab settlement={s} narrativeNote={null} publicDossier playerView />,
    economics: (s) => <EconomicsTab economicState={s.economicState} settlement={s} narrativeNote={null} publicDossier playerView />,
  };
  const linesOf = (el) => {
    try {
      const { container, unmount } = render(el);
      const out = [...container.querySelectorAll('p, li, [data-substrate-row], span, div')].filter((n) => !n.children.length || n.matches('[data-substrate-row], p, li'))
        .map((n) => (n.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      unmount(); cleanup();
      return [...new Set(out)];
    } catch (e) { cleanup(); return [`THROWS: ${String(e?.message || e).slice(0, 200)}`]; }
  };
  const files = readdirSync(POOL).filter((f) => /^r3m-.*\.json$/.test(f)).sort().slice(0, LIMIT);
  const out = { pool: POOL, towns: [] };
  for (const f of files) {
    const rec = JSON.parse(readFileSync(`${POOL}/${f}`, 'utf8'));
    const pub = GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: null });
    const model = GV.curateModelFor(pub, []);
    const opened = OPEN.map((address) => ({ address, hidden: false }));
    const crim = setCriminalVeil(opened, model.defaults, false, presentCriminalGroupings(pub), model);
    const defs = model.defaults.map((d) => ({ address: typeof d === 'string' ? d : d.address, hidden: false }));
    const cards = (rec.institutions || []).filter((h) => isHideableHouse(h)).map((h) => ({ address: `card:institution:${GV.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
    const ov = GV.writeShareVeil({}, [...crim, ...defs, ...cards], AT);
    const twin = GV.projectShareVeil(GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov }), ov);
    const marker = { [GV.VEIL_OVERRIDE_KEY]: { v: GV.VEIL_LIMITS.servedVersion, mode: 'live', at: AT.at, groupings: Array.isArray(twin?.galleryVeil?.hidden) ? twin.galleryVeil.hidden : [] } };
    const pre = clone(GV.projectServedVeil(twin, marker));
    const page = veilPublicPayload(rederiveForPage(clone(pre), { unveiled: false }));
    const noCfg = clone(pre); const cfg = noCfg.config; delete noCfg.config;
    const planted = rederiveForPage(noCfg, { unveiled: false }); planted.config = cfg;
    const plant = veilPublicPayload(planted);
    const t = { seed: f.replace(/\.json$/, ''), tabs: {} };
    for (const [name, el] of Object.entries(TABS)) {
      const a = linesOf(el(page)); const b = linesOf(el(plant));
      const A = new Set(a); const B = new Set(b);
      t.tabs[name] = { onlyPlant: b.filter((l) => !A.has(l)), onlyPage: a.filter((l) => !B.has(l)) };
    }
    out.towns.push(t);
  }
  writeFileSync(OUT, JSON.stringify(out));
}, 0);
