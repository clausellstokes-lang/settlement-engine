// V53 REDS-CAUSE reds (1) and (2): what the shared read and the widest veil take from the merit's inputs; the server on one case.
import { it, expect } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync } from 'node:fs';
const J = '/home/user/join53';
it('r12', async () => {
  const { generateSettlementPipeline } = await import(`${J}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${J}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${J}/src/store/configSlice.js`);
  const { FORTUNE_LAW_CONFIG_KEY } = await import(`${J}/src/domain/fortune/fortuneLaw.js`);
  const { meritsOf, weatheredCatastrophe } = await import(`${J}/src/domain/fortune/fortuneMerits.js`);
  const { toPublicSafe } = await import(`${J}/src/domain/display/publicSafe.js`);
  const veil = await import(`${J}/src/domain/display/galleryVeil.js`);
  const { CARD_KINDS, GROUPING_REMOVERS, applyVeil, isHideable } = veil;
  const { governanceAccountOf, governanceStressTypesOf, legitimacyCausesOf } = await import(`${J}/src/domain/display/governanceAccount.js`);
  const { resolvePrimaryStress } = await import(`${J}/src/generators/stressPriority.js`);
  const { computePublicLegitimacy } = await import(`${J}/src/generators/factionDynamics.js`);
  const { resolveFortuneLawVersion } = await import(`${J}/src/domain/fortune/fortuneLaw.js`);
  const { withholdAlways } = await import(`${J}/src/domain/display/galleryWithholdAlways.js`).catch(() => ({}));
  await loadGenerationLawPayloads();
  const out = [];
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const VISITOR = { _randomizePriorities: true };
  const SEEDS = [['hxd-hamlet-39'], ['hxd-village-20'], ['hxd-thorp-30'], ['hxd-hamlet-27'], ['hxd-town-33'], ['hxd-metropolis-91'], ['hxd-metropolis-73'], ['hxd-city-15'], ['hxd-thorp-2'], ['hxd-town-0'], ['hxd-city-2'], ['hxr-metropolis-30', DIALS], ['hxr-town-42', DIALS], ['hxr-village-3', DIALS], ['hxr-hamlet-22', DIALS], ['hxr-town-30', DIALS], ['visitor-thorp-52', VISITOR], ['visitor-hamlet-139', VISITOR], ['visitor-village-8', VISITOR]];
  const WIDEST = [...Object.keys(GROUPING_REMOVERS), ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((f) => `class:${kind}:${f}`))].filter((a) => isHideable(a));
  const birth = (seed, dials) => generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1], ...(dials || {}) }), [FORTUNE_LAW_CONFIG_KEY]: 2 }, null, { seed, customContent: {} });
  const rederiveTerms = (doc) => { const e = doc.economicState; const pl = computePublicLegitimacy(e, doc.defenseProfile?.readiness?.label, doc.tier, resolveFortuneLawVersion(doc)); return pl.breakdown; };
  const towns = {};
  // ---- red (1): per case, which of the three equalities breaks on each read
  for (const [seed, dials] of SEEDS) {
    const town = birth(seed, dials); towns[seed] = town;
    const pl = town.powerStructure.publicLegitimacy;
    for (const [name, sh] of [['plain', toPublicSafe(town)], ['widest', applyVeil(toPublicSafe(town), WIDEST)]]) {
      const spl = sh.powerStructure.publicLegitimacy;
      const re = rederiveTerms(sh); const { merits: _m, ...stTerms } = pl.breakdown || {};
      out.push(`R1 ${seed} ${name} merits own=${JSON.stringify(meritsOf(town))} shared=${JSON.stringify(meritsOf(sh))} score own=${pl.score} shared=${spl.score} bd own=${JSON.stringify(pl.breakdown)} shared=${JSON.stringify(spl.breakdown)} legacyNotes own=${(town.history.legacyAnnotations || []).length} shared=${(sh.history?.legacyAnnotations || []).length} | termsRederivedFromServedLabels=${JSON.stringify(re)} equalStoredTerms=${JSON.stringify({ prosperity: re.prosperity, safety: re.safety, defense: re.defense, food: re.food }) === JSON.stringify({ prosperity: stTerms.prosperity, safety: stTerms.safety, defense: stTerms.defense, food: stTerms.food })}`);
    }
    // weathered with and without the legacy notes (the withheld row history.legacy)
    const noNotes = { ...town, history: { ...town.history, legacyAnnotations: undefined } };
    out.push(`R1N ${seed} weathered own=${!!weatheredCatastrophe(town)} withoutNotes=${!!weatheredCatastrophe(noNotes)} meritsWithoutNotes=${JSON.stringify(meritsOf(noNotes))}`);
  }
  // ---- red (2): the six places, the paragraph on the three reads
  const PLACES = [['visitor-thorp-52', 'thorp'], ['visitor-village-8', 'village'], ['visitor-hamlet-139', 'hamlet'], ['visitor-hamlet-31', 'hamlet'], ['visitor-hamlet-55', 'hamlet'], ['visitor-village-13', 'village']];
  const cardsOf = (s, kind) => { const listAt = (s2, path) => { let v = s2; for (const k of path) v = v && typeof v === 'object' && !Array.isArray(v) ? v[k] : undefined; return Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []; }; const o = []; for (const path of CARD_KINDS[kind].lists) { const star = path.indexOf('*'); if (star < 0) { o.push(...listAt(s, path)); continue; } for (const ow of listAt(s, path.slice(0, star))) o.push(...listAt(ow, path.slice(star + 1))); } return o; };
  const widestOf = (pub) => { const a = [...Object.keys(GROUPING_REMOVERS), ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((f) => `class:${kind}:${f}`))]; for (const [kind, k] of Object.entries(CARD_KINDS)) for (const card of cardsOf(pub, kind)) { const id = k.idOf(card); if (!id) continue; if (kind === 'institution') a.push(`card:institution:${id}`); for (const f of Object.keys(k.fields)) a.push(`field:${kind}:${id}:${f}`); } return a; };
  const para = (r) => governanceAccountOf(r, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(r)) })?.text ?? '';
  const places = {};
  for (const [seed, size] of PLACES) {
    const record = generateSettlementPipeline({ ...birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true }), [FORTUNE_LAW_CONFIG_KEY]: 2 }, null, { seed, customContent: {} });
    places[seed] = record;
    const shared = toPublicSafe(record); const veiled = applyVeil(toPublicSafe(record), widestOf(toPublicSafe(record)));
    // the widest veil with the breakdown's terms put back (isolates the withheld terms)
    const veiledTermsBack = structuredClone(veiled); veiledTermsBack.powerStructure.publicLegitimacy.breakdown = record.powerStructure.publicLegitimacy.breakdown;
    for (const [n, r] of [['own', record], ['shared', shared], ['widest', veiled], ['widest+terms', veiledTermsBack]]) {
      const leg = r.powerStructure?.publicLegitimacy;
      const causes = leg ? legitimacyCausesOf(leg.breakdown, /Contested|Crisis/.test(String(leg.label)), r.economicState?.safetyProfile?.safetyLabel) : null;
      out.push(`R2 ${seed} ${n} merits=${JSON.stringify(meritsOf(r))} label=${leg?.label} bd=${JSON.stringify(leg?.breakdown)} causes=${JSON.stringify(causes)} ruler=${JSON.stringify(r.powerStructure?.factions?.find((f) => f?.isGoverning)?.faction)} PARA=${JSON.stringify(para(r))}`);
    }
  }
  // ---- (c) THE SERVER: PGlite on every migration on disk, the default veil, one case each
  const { bootChain, storeShare } = await import(`${J}/tests/security/veilChain.shared.mjs`);
  const db = new PGlite({ extensions: { pgcrypto } });
  expect(await bootChain(db)).toEqual([]);
  const { composePublicProse } = await import(`${J}/src/components/new/publicProseCompose.js`);
  const { withPublicProse } = await import(`${J}/src/domain/display/publicProse.js`);
  for (const [slug, town] of [['c-hxd-hamlet-39', towns['hxd-hamlet-39']], ['c-visitor-thorp-52', places['visitor-thorp-52']], ['c-visitor-hamlet-139', places['visitor-hamlet-139']]]) {
    const stored = JSON.parse(JSON.stringify(withPublicProse(town, composePublicProse(town))));
    await storeShare(db, { town: stored, slug, overrides: veil.writeShareVeil({}, []), shareDm: false });
    const served = (await db.query('select to_jsonb(g.data) as d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d;
    const twinRead = applyVeil(toPublicSafe(stored), veil.resolveVeil(veil.defaultVeilFor(toPublicSafe(stored)), null));
    out.push(`C ${slug} server bd=${JSON.stringify(served?.powerStructure?.publicLegitimacy?.breakdown)} score=${served?.powerStructure?.publicLegitimacy?.score} legacy=${JSON.stringify(served?.history?.legacyAnnotations ?? null)} merits=${JSON.stringify(meritsOf(served))} | twin(default veil) bd=${JSON.stringify(twinRead.powerStructure.publicLegitimacy.breakdown)} merits=${JSON.stringify(meritsOf(twinRead))} | own merits=${JSON.stringify(meritsOf(stored))}`);
    out.push(`C ${slug} serverPARA=${JSON.stringify(para(served))}`);
    out.push(`C ${slug} twinPARA=${JSON.stringify(para(twinRead))}`);
    out.push(`C ${slug} ownPARA=${JSON.stringify(para(stored))}`);
  }
  writeFileSync('/var/tmp/v53/redscause/r12.out', out.join('\n') + '\n');
}, 900000);
