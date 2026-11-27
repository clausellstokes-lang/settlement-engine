/** @vitest-environment jsdom */
// PG (VEIL-56) MEASURE, RULING V29 (1)(2)(c), on a stored pool (POOL=<dir of <seed>.json>), the tree at SRC.
// THE ORACLE IS THE RAW STORED TOWN (the record as the owner stores it): never a re-derivation, never the rule respelled.
// Markers: default (writeShareVeil with no deltas), allShown (the probe's "everything shown"), widest (every grouping and
// every hideable house hidden). The page = gallery.js :: sanitizeDossier's served path, as failClosedSharedPage.test.jsx.
import React from 'react';
import { it } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { cleanup, render } from '@testing-library/react';

const SRC = process.env.SRC; const POOL = process.env.POOL; const OUT = process.env.OUT;
const clone = (v) => JSON.parse(JSON.stringify(v));
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];

it('measure', async () => {
  const { toPublicSafe, veilPublicPayload } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const GV = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { presentCriminalGroupings, setCriminalVeil } = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { rederiveForPage, PAGE_DRAWN_SCORES } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const { deriveAllActiveConditions } = await import(`${SRC}/src/domain/activeConditions.js`);
  const { loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const SubstrateTab = (await import(`${SRC}/src/components/new/tabs/SubstrateTab.jsx`)).default;
  await loadGenerationLawPayloads();
  const LABEL = Object.fromEntries([...readFileSync(`${SRC}/src/components/new/tabs/SubstrateTab.jsx`, 'utf8')
    .split('const VAR_LABEL = {')[1].split('};')[0].matchAll(/^\s*(\w+): '([^']+)'/gm)].map((m) => [m[1], m[2]]));

  const cardsOf = (rec) => (rec.institutions || []).filter((h) => isHideableHouse(h)).map((h) => `card:institution:${GV.CARD_KINDS.institution.idOf(h)}`);
  const markers = {
    default: () => [],
    allShown: (rec, pub, model) => {
      const opened = OPEN.map((address) => ({ address, hidden: false }));
      const crim = setCriminalVeil(opened, model.defaults, false, presentCriminalGroupings(pub), model);
      const defs = model.defaults.map((d) => ({ address: typeof d === 'string' ? d : d.address, hidden: false }));
      return [...crim, ...defs, ...cardsOf(rec).map((address) => ({ address, hidden: false }))];
    },
    widest: (rec, pub, model) => {
      const addrs = new Set([...OPEN, ...model.defaults.map((d) => (typeof d === 'string' ? d : d.address))]);
      for (const sec of model.sections || []) for (const g of sec.groupings || []) addrs.add(g.address);
      for (const a of cardsOf(rec)) addrs.add(a);
      const all = [...addrs].map((address) => ({ address, hidden: true }));
      return setCriminalVeil(all, model.defaults, true, presentCriminalGroupings(pub), model);
    },
  };
  /** { pre (served, before the put-back), page } at a marker */
  function pageAt(rec, name) {
    const pub = GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: null });
    const model = GV.curateModelFor(pub, []);
    const ov = GV.writeShareVeil({}, markers[name](rec, pub, model), AT);
    const twin = GV.projectShareVeil(GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov }), ov);
    const marker = { [GV.VEIL_OVERRIDE_KEY]: { v: GV.VEIL_LIMITS.servedVersion, mode: 'live', at: AT.at, groupings: Array.isArray(twin?.galleryVeil?.hidden) ? twin.galleryVeil.hidden : [] } };
    const pre = clone(GV.projectServedVeil(twin, marker));
    const page = veilPublicPayload(rederiveForPage(clone(pre), { unveiled: false }));
    return { pre, page };
  }
  function foundations(settlement) {
    const { container, unmount } = render(<SubstrateTab settlement={settlement} />);
    const rows = Object.fromEntries([...container.querySelectorAll('[data-substrate-row]')].map((r) => {
      const spans = r.querySelectorAll('span');
      return [(spans[0]?.textContent || '').trim(), (spans[spans.length - 1]?.textContent || '').trim()];
    }));
    unmount(); cleanup();
    return rows;
  }
  const get = (o, path) => path.reduce((v, k) => (v && typeof v === 'object' ? v[k] : undefined), o);
  const has = (o, path) => { const p = get(o, path.slice(0, -1)); return !!p && typeof p === 'object' && Object.hasOwn(p, path[path.length - 1]); };
  /** THE KEYS rederiveForPage puts back (its own header's list), as paths; conditions by index. */
  const keysOf = (rec) => [
    ...PAGE_DRAWN_SCORES.map((k) => ['defenseProfile', 'scores', k]),
    ['defenseProfile', 'readiness', 'score'], ['defenseProfile', 'economicGates'], ['economicState', 'compound', 'economyOutput'],
    ['economicState', 'safetyProfile', 'blackMarketCapture'], ['economicState', 'safetyProfile', 'crimeTypes'], ['powerStructure', 'recentConflict'],
    ...(Array.isArray(rec.activeConditions) ? rec.activeConditions.map((_, i) => ['activeConditions', i, 'severity']) : []),
  ];
  const keyName = (p) => p.map((x) => (typeof x === 'number' ? '[]' : x)).join('.');
  const condById = (doc, id) => (Array.isArray(doc.activeConditions) ? doc.activeConditions.find((c) => c && c.id === id) : null);

  const files = readdirSync(POOL).filter((f) => /^r3m-.*\.json$/.test(f)).sort();
  const out = { pool: POOL, src: SRC, n: files.length, towns: [] };
  for (const f of files) {
    const rec = JSON.parse(readFileSync(`${POOL}/${f}`, 'utf8'));
    const seed = f.replace(/\.json$/, '');
    const P0 = toPublicSafe(clone(rec));
    const ownerRows = foundations(P0);
    const ownRec = foundations(rec);
    const town = { seed, ownerRows, ownRecRows: ownRec, markers: {} };
    for (const name of ['allShown']) {
      const { pre, page } = pageAt(rec, name);
      const rows = foundations(page);
      const swapped = clone(page);
      for (const c of swapped.activeConditions || []) { const o = (rec.activeConditions || []).find((x) => x?.id === c?.id); if (o && typeof o.severity === 'number') c.severity = o.severity; }
      const rowsOwnerSev = foundations(swapped);
      // the conditions whose severity the page put back (absent served, present on the page), matched by id
      const rederivedSev = (Array.isArray(page.activeConditions) ? page.activeConditions : [])
        .filter((c) => c && Object.hasOwn(c, 'severity') && !Object.hasOwn(condById(pre, c.id) || {}, 'severity')).map((c) => c.id);
      const derived = deriveAllActiveConditions(page);
      const sysOfRederived = [...new Set(derived.filter((c) => rederivedSev.includes(c.id)).flatMap((c) => [...(c.affectedSystems || []), ...(c.archetype === 'war_spoils' ? ['economic_capacity'] : [])]))];
      const keys = keysOf(rec).map((p) => {
        // index paths: match the page's condition by the stored condition's id (the page may reorder)
        let pp = p;
        if (p[0] === 'activeConditions') { const id = rec.activeConditions[p[1]]?.id; const j = (page.activeConditions || []).findIndex((c) => c?.id === id); pp = j >= 0 ? ['activeConditions', j, 'severity'] : null; }
        const ownerHas = has(rec, p);
        const parentServed = pp ? (() => { const par = get(page, pp.slice(0, -1)); return !!par && typeof par === 'object'; })() : false;
        const present = pp ? has(page, pp) : false;
        const servedPre = pp ? has(pre, pp) : false;
        const ov = get(rec, p); const pv = pp ? get(page, pp) : undefined;
        return { key: keyName(p), ownerHas, parentServed, present, servedPre, equal: JSON.stringify(ov) === JSON.stringify(pv), owner: ov, page: pv };
      });
      town.markers[name] = { rows, rowsOwnerSev, rederivedSev, sysOfRederived: sysOfRederived.map((k) => LABEL[k] || k), keys,
        crimeGroupingShut: (GV.veilGroupingsOf ? GV.veilGroupingsOf(page) : []).includes('block:defense.criminalStructure'),
        readinessLabel: get(pre, ['defenseProfile', 'readiness', 'label']) ?? null };
    }
    out.towns.push(town);
  }
  writeFileSync(OUT, JSON.stringify(out));
}, 0);
