import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import React from 'react';
const SRC = process.env.RV6_SRC || '/home/user/pages53';
it('b', async () => {
  const { render, cleanup } = await import(`${SRC}/node_modules/@testing-library/react/dist/index.js`);
  const { birth, ensureLaws } = await import(`${SRC}/scripts/audit/soak-review/corpus.mjs`);
  await ensureLaws();
  const { toPublicSafe } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const { projectShareVeil } = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { criminalStructureOf } = await import(`${SRC}/src/components/new/deskHostArgs.js`);
  const { DefenseTab } = await import(`${SRC}/src/components/new/tabs/DefenseTab.jsx`);
  const paras = (el) => { const { container, unmount } = render(el); const o = [...container.querySelectorAll('p')].map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim()); unmount(); cleanup(); return o; };
  const out = [];
  for (const i of [10, 11, 41]) {
    const owner = birth(i).settlement;
    const csd = criminalStructureOf(owner);
    const unst = projectShareVeil(toPublicSafe(owner), null);
    const loc = criminalStructureOf(unst);
    const p = paras(React.createElement(DefenseTab, { settlement: unst, narrativeNote: null, publicDossier: true, playerView: true }));
    out.push({ i, seed: owner._seed, key: csd?.key, owner: csd?.note, localKey: loc?.key, local: loc?.note, printedLocal: p.includes(loc?.note), quietInPage: p.filter((x) => /streets quiet/.test(x)) });
  }
  writeFileSync(`${process.env.FC_OUT}/b.json`, JSON.stringify(out, null, 1));
});
