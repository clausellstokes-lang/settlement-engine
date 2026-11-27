/** @vitest-environment jsdom */
// PG (VEIL-56) M1: THE INTERVAL TEST (V31 (A)), a MEASURE. A Foundations row that reads a re-derived severity is printed only
// where what it prints is the same at both ends of the served band's severity interval (the engine's own cuts,
// activeConditions.js :: severityBand: low [0, .25), medium [.25, .5), high [.5, .75), critical [.75, 1], deriveActiveCondition
// clamping to [0, 1]); every corner of the re-derived conditions' intervals is rendered (the upper end of an open interval is
// its cut less 1e-9). THE ORACLE: the same page with each condition's severity set to the OWNER's STORED one (the swap test),
// never the rule respelled. Also: is each row monotone in each severity inside its band (7 points per interval)?
import React from 'react';
import { it } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { cleanup, render } from '@testing-library/react';
const SRC = process.env.SRC; const POOL = process.env.POOL; const OUT = process.env.OUT; const LIMIT = Number(process.env.LIMIT || 1e9);
const clone = (v) => JSON.parse(JSON.stringify(v));
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const EPS = 1e-9;
it('interval', async () => {
  const { veilPublicPayload } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const GV = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { presentCriminalGroupings, setCriminalVeil } = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const AC = await import(`${SRC}/src/domain/activeConditions.js`);
  const { loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const SubstrateTab = (await import(`${SRC}/src/components/new/tabs/SubstrateTab.jsx`)).default;
  await loadGenerationLawPayloads();
  // THE ENGINE'S OWN INTERVALS, read off severityBand itself (its cuts found by bisection, not typed): [lo, hi] per band
  const cut = (a, b) => { let lo = 0, hi = 1; for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (AC.severityBand(m) === a) lo = m; else hi = m; } return hi; };
  const BANDS = ['low', 'medium', 'high', 'critical'];
  const cuts = [cut('low'), cut('medium'), cut('high')];
  const IV = { low: [0, cuts[0] - EPS], medium: [cuts[0], cuts[1] - EPS], high: [cuts[1], cuts[2] - EPS], critical: [cuts[2], 1] };
  for (const b of BANDS) if (AC.severityBand(IV[b][0]) !== b || AC.severityBand(IV[b][1]) !== b) throw new Error(`no clean interval for ${b}`);
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
      return setCriminalVeil([...addrs].map((address) => ({ address, hidden: true })), model.defaults, true, presentCriminalGroupings(pub), model);
    },
  };
  function pageAt(rec, name) {
    const pub = GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: null });
    const model = GV.curateModelFor(pub, []);
    const ov = GV.writeShareVeil({}, markers[name](rec, pub, model), AT);
    const twin = GV.projectShareVeil(GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov }), ov);
    const marker = { [GV.VEIL_OVERRIDE_KEY]: { v: GV.VEIL_LIMITS.servedVersion, mode: 'live', at: AT.at, groupings: Array.isArray(twin?.galleryVeil?.hidden) ? twin.galleryVeil.hidden : [] } };
    const pre = clone(GV.projectServedVeil(twin, marker));
    return { pre, page: veilPublicPayload(rederiveForPage(clone(pre), { unveiled: false })) };
  }
  function rows(settlement) {
    const { container, unmount } = render(<SubstrateTab settlement={settlement} />);
    const out = Object.fromEntries([...container.querySelectorAll('[data-substrate-row]')].map((r) => {
      const spans = r.querySelectorAll('span');
      return [(spans[0]?.textContent || '').trim(), (spans[spans.length - 1]?.textContent || '').trim()];
    }));
    unmount(); cleanup();
    return out;
  }
  const withSev = (page, sev) => { const p = clone(page); for (const c of p.activeConditions || []) if (c && c.id in sev) c.severity = sev[c.id]; return p; };
  const files = readdirSync(POOL).filter((f) => /^r3m-.*\.json$/.test(f)).sort().slice(0, LIMIT);
  const out = { pool: POOL, cuts, towns: [], storedOutsideBand: 0 };
  for (const f of files) {
    const rec = JSON.parse(readFileSync(`${POOL}/${f}`, 'utf8'));
    for (const c of rec.activeConditions || []) if (c && typeof c.severity === 'number' && typeof c.severityBand === 'string' && AC.severityBand(c.severity) !== c.severityBand) out.storedOutsideBand += 1;
    const t = { seed: f.replace(/\.json$/, ''), markers: {} };
    for (const name of Object.keys(markers)) {
      const { pre, page } = pageAt(rec, name);
      const re = (page.activeConditions || []).filter((c) => c && Object.hasOwn(c, 'severity') && !Object.hasOwn((pre.activeConditions || []).find((x) => x?.id === c.id) || {}, 'severity') && IV[c.severityBand]).map((c) => ({ id: c.id, band: c.severityBand }));
      const base = rows(page);
      const ownerSev = Object.fromEntries(re.map((c) => [c.id, (rec.activeConditions || []).find((x) => x?.id === c.id)?.severity]).filter(([, v]) => typeof v === 'number'));
      const oracle = rows(withSev(page, ownerSev));
      // every corner
      const corners = [];
      for (let m = 0; m < 2 ** re.length; m += 1) corners.push(Object.fromEntries(re.map((c, i) => [c.id, IV[c.band][(m >> i) & 1]])));
      const cornerRows = corners.map((s) => rows(withSev(page, s)));
      const labels = new Set([...Object.keys(base), ...Object.keys(oracle)]);
      const verdict = {};
      for (const l of labels) {
        const words = new Set(cornerRows.map((r) => r[l]));
        const reads = words.size > 1 || base[l] !== oracle[l];
        if (!reads && re.length === 0) continue;
        verdict[l] = { page: base[l] ?? null, oracle: oracle[l] ?? null, corners: [...words], interval: words.size === 1 ? [...words][0] ?? null : null };
      }
      // monotone inside each band, one condition at a time (the others at the page's values)
      const nonMono = [];
      for (const c of re) {
        const [lo, hi] = IV[c.band];
        const seq = [0, 1, 2, 3, 4, 5, 6].map((i) => rows(withSev(page, { [c.id]: lo + ((hi - lo) * i) / 6 })));
        for (const l of labels) {
          const ws = seq.map((r) => r[l] ?? '∅'); const seen = []; let bad = false;
          for (const w of ws) { if (seen[seen.length - 1] !== w) { if (seen.includes(w)) bad = true; seen.push(w); } }
          if (bad) nonMono.push({ cond: c.id, band: c.band, row: l, seq: ws });
        }
      }
      t.markers[name] = { re, verdict, nonMono };
    }
    out.towns.push(t);
  }
  writeFileSync(OUT, JSON.stringify(out));
}, 0);
