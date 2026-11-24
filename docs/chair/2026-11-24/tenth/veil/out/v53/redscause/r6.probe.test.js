// V53 REDS-CAUSE red (6): the VR26 harness's legitimacy re-derivation, with and without the born fortune law.
import { it, expect } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync } from 'node:fs';
const J = '/home/user/join53';
const clone = (v) => JSON.parse(JSON.stringify(v));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const BIRTHS = [['town', null], ['city', 'infiltrated'], ['metropolis', null], ['city', null], ['town', 'indebted'], ['metropolis', 'insurgency'], ['village', null], ['city', 'famine']];
it('r6', async () => {
  const { bootChain, storeShare, BIRTH_DIALS } = await import(`${J}/tests/security/veilChain.shared.mjs`);
  const db = new PGlite({ extensions: { pgcrypto } });
  expect(await bootChain(db)).toEqual([]);
  const { generateSettlementPipeline } = await import(`${J}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${J}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${J}/src/store/configSlice.js`);
  const { composePublicProse } = await import(`${J}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${J}/src/domain/display/publicProse.js`);
  const veil = await import(`${J}/src/domain/display/galleryVeil.js`);
  const { isHideableHouse } = await import(`${J}/src/domain/people/cardVeil.js`);
  const { REGISTRY_ROWS } = await import(`${J}/src/domain/veil/rosterChoiceRegistry.js`);
  const { servedProsperityOutcomes } = await import(`${J}/src/domain/veil/importRederive.js`);
  const { computeBaseProsperity, standingBaseProsperity, deriveProsperityLabels } = await import(`${J}/src/generators/economy/prosperity.js`);
  const { generateDefenseProfile } = await import(`${J}/src/generators/defenseGenerator.js`);
  const { keepOfRecord } = await import(`${J}/src/domain/facts/keep.js`);
  const { generateSafetyProfile } = await import(`${J}/src/generators/safetyProfile.js`);
  const { computePublicLegitimacy } = await import(`${J}/src/generators/factionDynamics.js`);
  const { resolveFortuneLawVersion } = await import(`${J}/src/domain/fortune/fortuneLaw.js`);
  await loadGenerationLawPayloads();
  const rows = REGISTRY_ROWS.filter((r) => r.rule === 'diffuse');
  const DERIVED = new Set(['defence.readiness.label', 'defence.readiness.colours', 'defence.scores.disaster', 'defence.scores.economic', 'defence.scores.internal', 'defence.scores.magical', 'defence.scores.military', 'defence.scores.monster', 'defence.economicGates', 'economy.prosperity', 'economy.prosperityStanding', 'safety.safetyLabel', 'legitimacy.label', 'legitimacy.score', 'legitimacy.colours']);
  const isProse = (r) => r.path.startsWith('^publicProse');
  const revisit = (doc, lawAware) => {
    const r = clone(doc); const cfg = r.config; const inst = r.institutions || []; const e = r.economicState;
    if (!isRec(cfg) || !isRec(e)) return null;
    const outcomes = servedProsperityOutcomes(r, cfg); if (outcomes.length !== 1) return null;
    const names = inst.map((i) => i?.name);
    const base = computeBaseProsperity(r.tier, cfg.tradeRouteAccess, inst, cfg, names, e.incomeSources || [], e.foodSecurity || null).label;
    const standing = standingBaseProsperity(r.tier, cfg.tradeRouteAccess, inst, cfg, names, e.incomeSources || []);
    e.prosperity = outcomes[0];
    e.prosperityStanding = deriveProsperityLabels(base, standing, cfg, inst).prosperityStanding;
    const months = e.foodSecurity?.foodRecord?.storageMonths;
    if (isRec(e.foodSecurity) && Number.isFinite(months)) e.foodSecurity.storageMonths = months;
    const dp = generateDefenseProfile(r, keepOfRecord(e));
    r.defenseProfile = { ...(r.defenseProfile || {}), scores: dp.scores, readiness: dp.readiness, economicGates: dp.economicGates };
    if (isRec(e.safetyProfile)) e.safetyProfile.safetyLabel = generateSafetyProfile(cfg, r.tier, inst).safetyLabel;
    if (isRec(r.powerStructure?.publicLegitimacy)) {
      const pl = lawAware ? computePublicLegitimacy(e, dp.readiness.label, r.tier, resolveFortuneLawVersion(cfg)) : computePublicLegitimacy(e, dp.readiness.label, r.tier);
      Object.assign(r.powerStructure.publicLegitimacy, { score: pl.score, label: pl.label, color: pl.color, bg: pl.bg, _bd: pl.breakdown });
    }
    r.publicProse = composePublicProse(r);
    return r;
  };
  const valuesAt = (doc, re) => { const out = new Map(); const walk = (v, norm, exact) => { if (norm && (re.test(norm) || re.test(`${norm} (only in A)`))) { out.set(exact, JSON.stringify(v)); return; } if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${norm}[]`, `${exact}[${i}]`)); else if (isRec(v)) for (const k of Object.keys(v)) walk(v[k], norm ? `${norm}.${k}` : k, exact ? `${exact}.${k}` : k); }; walk(doc, '', ''); return out; };
  const sameAt = (a, b, re) => { const x = valuesAt(a, re); const y = valuesAt(b, re); return x.size === y.size && [...x].every(([k, v]) => y.get(k) === v); };
  const plain = veil.writeShareVeil({}, []);
  const towns = [];
  for (const [i, [size, crisis]] of BIRTHS.entries()) {
    const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
    const born = generateSettlementPipeline(cfg, null, { seed: `vr26-${size}-${crisis || 'calm'}-${i}`, customContent: {} });
    const stored = clone(withPublicProse(born, composePublicProse(born)));
    for (const shareDm of [false, true]) {
      const slug = `vr26-${i}-${shareDm ? 'dm' : 'p'}`;
      await storeShare(db, { town: stored, slug, overrides: plain, shareDm });
      const served = (await db.query('select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
      towns.push({ seed: `${size}-${crisis || 'calm'}-${i}${shareDm ? ' +DM' : ''}`, stored, served, hidden: (stored.institutions || []).filter((h) => isHideableHouse(h)).length });
    }
  }
  const lines = [];
  for (const lawAware of [false, true]) {
    const unf = new Set(); const where = new Map();
    for (const t of towns) {
      const f = revisit(t.stored, lawAware);
      if (f) for (const r of rows.filter((x) => DERIVED.has(x.id) || isProse(x))) if (!sameAt(t.stored, f, new RegExp(r.path))) unf.add(r.id);
      const s = revisit(t.served, lawAware); if (!s) continue;
      for (const row of rows.filter((x) => DERIVED.has(x.id) || isProse(x))) {
        if (sameAt(t.served, s, new RegExp(row.path))) continue;
        const w = where.get(row.id) || { hidden: [], open: [] }; (t.hidden ? w.hidden : w.open).push(t.seed); where.set(row.id, w);
      }
      if (!lawAware || true) {
        const sp = t.stored.powerStructure?.publicLegitimacy; const fp = f?.powerStructure?.publicLegitimacy;
        lines.push(`${lawAware ? 'LAW-AWARE' : 'HARNESS  '} ${t.seed} hidden=${t.hidden} law=${resolveFortuneLawVersion(t.stored.config)} stored{score:${sp?.score},label:${sp?.label},color:${sp?.color},bd:${JSON.stringify(sp?.breakdown)}} rederived{score:${fp?.score},label:${fp?.label},color:${fp?.color},bd:${JSON.stringify(fp?._bd)}}`);
      }
    }
    const inverting = [...where].filter(([, w]) => w.hidden.length && !w.open.length).map(([id]) => id).sort();
    const notRed = [...where].filter(([, w]) => w.open.length).map(([id]) => id).sort();
    lines.push(`${lawAware ? 'LAW-AWARE' : 'HARNESS  '} FIDELITY unfaithful=${JSON.stringify([...unf].sort())}`);
    lines.push(`${lawAware ? 'LAW-AWARE' : 'HARNESS  '} MAIN inverting=${JSON.stringify(inverting)}`);
    lines.push(`${lawAware ? 'LAW-AWARE' : 'HARNESS  '} MAIN notRederivable=${JSON.stringify(notRed)}`);
    lines.push(`${lawAware ? 'LAW-AWARE' : 'HARNESS  '} MAIN where=${JSON.stringify(Object.fromEntries([...where].filter(([id]) => /legitimacy|safety|prosper/.test(id))))}`);
  }
  writeFileSync('/var/tmp/v53/redscause/r6.out', lines.join('\n') + '\n');
}, 900000);
