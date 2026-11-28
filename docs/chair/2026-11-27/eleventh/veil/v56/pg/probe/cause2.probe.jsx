/** @vitest-environment jsdom */
// PG (VEIL-56) M2 (V31 (B)): THE CAUSE BY KEY, a MEASURE, at ALL-SHOWN (a share that hides nothing). Oracle: the stored town.
//  A  the page as gallery.js builds it (the baseline differences)
//  B  LAWS: the same, with the page's config replaced by the RECORD's own config whole before the re-derive (cure E's way:
//     every config-taking engine call handed the record's config, which carries each GENERATION_LAWS marker it was born under)
//  C  TODAY'S ENGINE OVER THE OWNER'S FULL RECORD: rederiveForPage on the raw stored record with only the re-derived keys
//     removed (nothing veiled): a difference here is the ENGINE's, no served input is missing
//  D  MASTER'S ENGINE (MSRC) over the same full record: master's own writers (sanity: they should give the stored value)
//  E  THE OWNER'S PAGE: the Defense, Overview and Summary tabs rendered on the raw record and on the raw record carrying C's
//     values: if they differ, the owner's page prints the STORED value (it re-derives nothing)
//  F  served fields that could tell a master-born record: the page's config law markers, publicProse
import React from 'react';
import { it } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { cleanup, render } from '@testing-library/react';
const SRC = process.env.SRC; const MSRC = process.env.MSRC; const POOL = process.env.POOL; const OUT = process.env.OUT; const LIMIT = Number(process.env.LIMIT || 1e9);
const clone = (v) => JSON.parse(JSON.stringify(v));
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const KEYS = [['defenseProfile', 'scores', 'disaster'], ['defenseProfile', 'scores', 'economic'], ['defenseProfile', 'scores', 'internal'], ['defenseProfile', 'scores', 'magical'], ['defenseProfile', 'scores', 'military'], ['defenseProfile', 'scores', 'monster'],
  ['defenseProfile', 'readiness', 'score'], ['defenseProfile', 'economicGates'], ['economicState', 'compound', 'economyOutput'], ['economicState', 'safetyProfile', 'crimeTypes'], ['powerStructure', 'recentConflict']];
const get = (o, p) => p.reduce((v, k) => (v && typeof v === 'object' ? v[k] : undefined), o);
const del = (o, p) => { const par = get(o, p.slice(0, -1)); if (par && typeof par === 'object') delete par[p[p.length - 1]]; };
const set = (o, p, v) => { const par = get(o, p.slice(0, -1)); if (par && typeof par === 'object' && v !== undefined) par[p[p.length - 1]] = clone(v); };
const name = (p) => p.join('.');
const LAWS = ['_densityLawVersion', '_livingContentLawVersion', '_seatLawVersion', '_fortuneLawVersion'];
it('cause2', async () => {
  const { veilPublicPayload } = await import(`${SRC}/src/domain/display/publicSafe.js`);
  const GV = await import(`${SRC}/src/domain/display/galleryVeil.js`);
  const { presentCriminalGroupings, setCriminalVeil } = await import(`${SRC}/src/domain/display/criminalVeilSwitch.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { rederiveForPage } = await import(`${SRC}/src/domain/veil/pageRederive.js`);
  const { loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DefenseTab } = await import(`${SRC}/src/components/new/tabs/DefenseTab.jsx`);
  const { OverviewTab } = await import(`${SRC}/src/components/new/tabs/OverviewTab.jsx`);
  const SummaryTab = (await import(`${SRC}/src/components/new/SummaryTab.jsx`)).default;
  await loadGenerationLawPayloads();
  const M = {};
  try { M.def = (await import(`${MSRC}/src/generators/defenseGenerator.js`)).generateDefenseProfile; } catch (e) { M.err = String(e); }
  try { M.ps = (await import(`${MSRC}/src/generators/power/rulingStructure.js`)).generatePowerStructure; } catch {}
  try { const sp = await import(`${MSRC}/src/generators/safetyProfile.js`); M.safe = sp.generateSafetyProfile; M.settle = sp.settleCrimeLinesToSignal; } catch {}
  try { M.flags = (await import(`${MSRC}/src/generators/priorityHelpers.js`)).getInstFlags; } catch {}
  try { M.adv = (await import(`${MSRC}/src/domain/relationships/canonicalRelationship.js`)).isAdversarialRelationship; } catch {}
  try { await (await import(`${MSRC}/src/domain/density/densityCreateBoundary.js`)).loadGenerationLawPayloads?.(); } catch {}
  const texts = (el) => { try { const { container, unmount } = render(el); const t = (container.textContent || '').replace(/\s+/g, ' '); unmount(); cleanup(); return t; } catch (e) { cleanup(); return `THROWS ${e?.message}`; } };
  const ownerPage = (r) => [texts(<DefenseTab settlement={r} narrativeNote={null} playerView />), texts(<OverviewTab settlement={r} narrativeNote={null} playerView />), texts(<SummaryTab settlement={r} />)];
  const files = readdirSync(POOL).filter((f) => /^r3m-.*\.json$/.test(f)).sort().slice(0, LIMIT);
  const out = { pool: POOL, msrc: MSRC, masterLoaded: Object.keys(M), towns: [] };
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
    const A = veilPublicPayload(rederiveForPage(clone(pre), { unveiled: false }));
    const preB = clone(pre); const lawsServed = Object.fromEntries(LAWS.map((k) => [k, preB.config?.[k] ?? null])); preB.config = clone(rec.config);
    const B = rederiveForPage(preB, { unveiled: false });
    const full = clone(rec); for (const p of KEYS) del(full, p);
    const C = rederiveForPage(full, { unveiled: false });
    // D: master's writers over the full record, as rederiveForPage calls them (where master has them)
    const D = {};
    try { const d = M.def(clone(rec)); for (const k of ['disaster', 'economic', 'internal', 'magical', 'military', 'monster']) D[`defenseProfile.scores.${k}`] = d?.scores?.[k]; D['defenseProfile.readiness.score'] = d?.readiness?.score; D['defenseProfile.economicGates'] = d?.economicGates; } catch (e) { D.defErr = String(e?.message || e); }
    try { D['economicState.compound.economyOutput'] = M.flags(rec.config, rec.institutions || []).economyOutput; } catch (e) { D.flagsErr = String(e?.message || e); }
    try {
      const entries = (rec.stressors || []).length ? rec.stressors : rec.stress && typeof rec.stress === 'object' && !Array.isArray(rec.stress) ? [rec.stress] : rec.stress || [];
      const nb = rec.neighborRelationship ?? rec.config.neighborRelationship;
      const neighbour = nb && typeof nb.relationshipType === 'string' && M.adv?.(nb.relationshipType) ? nb : null;
      D['powerStructure.recentConflict'] = M.ps(rec.tier, clone(rec.economicState), clone(neighbour), clone(rec.config), clone(rec.institutions || []), { stressEntries: clone(entries) })?.recentConflict;
    } catch (e) { D.psErr = String(e?.message || e); }
    try {
      const fresh = M.safe(rec.config, rec.tier, rec.institutions || []);
      const lists = { seats: rec.powerStructure?.factions, estate: rec.institutions, tensions: rec.history?.currentTensions, services: rec.availableServices };
      D['economicState.safetyProfile.crimeTypes'] = M.settle({ ...rec.economicState, safetyProfile: fresh }, lists)?.safetyProfile?.crimeTypes;
    } catch (e) { D.safeErr = String(e?.message || e); }
    const keys = {};
    for (const p of KEYS) {
      const st = JSON.stringify(get(rec, p)); const k = name(p);
      keys[k] = { A: JSON.stringify(get(A, p)) === st, B: JSON.stringify(get(B, p)) === st, C: JSON.stringify(get(C, p)) === st, D: k in D ? JSON.stringify(D[k]) === st : null,
        ex: { stored: st?.slice(0, 120), C: JSON.stringify(get(C, p))?.slice(0, 120) } };
    }
    // E: the owner's page on the raw record vs the raw record carrying today's re-derived values (C's), key group by key group
    const E = {};
    const own = ownerPage(rec);
    for (const [g, ps] of Object.entries({ defence: KEYS.slice(0, 8), economyOutput: [KEYS[8]], crimeTypes: [KEYS[9]], recentConflict: [KEYS[10]] })) {
      if (ps.every((p) => JSON.stringify(get(C, p)) === JSON.stringify(get(rec, p)))) { E[g] = 'same values'; continue; }
      const alt = clone(rec); for (const p of ps) set(alt, p, get(C, p));
      const o2 = ownerPage(alt);
      E[g] = own.map((t, i) => (t === o2[i] ? 'same' : 'differs'));
    }
    out.towns.push({ seed: f.replace(/\.json$/, ''), keys, E, lawsServed, lawsStored: Object.fromEntries(LAWS.map((k) => [k, rec.config?.[k] ?? null])), proseServed: 'publicProse' in A, errs: Object.fromEntries(Object.entries(D).filter(([k]) => k.endsWith('Err'))) });
  }
  writeFileSync(OUT, JSON.stringify(out));
}, 0);
