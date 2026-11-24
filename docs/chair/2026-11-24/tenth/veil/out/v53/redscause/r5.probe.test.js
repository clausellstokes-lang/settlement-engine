// V53 REDS-CAUSE red (5): transferTakerOf on a constructed two-transfer record, owner against the shared read; and the
// import re-deriver's legitimacy terms on a lit town (a side reading of red (6)'s class).
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const J = '/home/user/join53';
it('r5', async () => {
  const out = [];
  const { generateSettlementPipeline } = await import(`${J}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${J}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${J}/src/store/configSlice.js`);
  const { toPublicSafe } = await import(`${J}/src/domain/display/publicSafe.js`);
  const { applyVeil, resolveVeil, defaultVeilFor } = await import(`${J}/src/domain/display/galleryVeil.js`);
  const { rederiveForPage } = await import(`${J}/src/domain/veil/pageRederive.js`);
  const { rederiveServed } = await import(`${J}/src/domain/veil/importRederive.js`);
  const { holderOf, transferTakerOf } = await import(`${J}/src/domain/seat/holderOfSeat.js`);
  const { governingFactionOf, nameOf } = await import(`${J}/src/domain/rulingPower.js`);
  const { isVeiledPower } = await import(`${J}/src/domain/people/cardVeil.js`);
  const { BIRTH_DIALS } = await import(`${J}/tests/security/veilChain.shared.mjs`);
  await loadGenerationLawPayloads();
  const share = (r) => { const pub = toPublicSafe(r); return rederiveForPage(applyVeil(pub, resolveVeil(defaultVeilFor(pub), null))); };
  let done = 0;
  for (let i = 0; i < 40 && done < 2; i += 1) {
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: `r5-city-${i}`, customContent: {} });
    const gov = governingFactionOf(town); const form = nameOf(gov);
    const others = (town.powerStructure.factions || []).filter((f) => f !== gov && !isVeiledPower(f)).map(nameOf).filter(Boolean);
    if (others.length < 2) continue;
    const [A, B] = others;
    const rec = structuredClone(town);
    rec.powerStructure.factionRelationships = [...(rec.powerStructure.factionRelationships || []),
      { pair: [form, A], narrative: `${A} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`, type: 'competitive' },
      { pair: [form, B], narrative: `${B} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`, type: 'competitive' }];
    rec.powerStructure.recentConflict = `Power passed to ${A} by coup; the government now sits as a ${form.toLowerCase()}.`;
    const sh = share(rec);
    const ho = holderOf(rec, { audience: 'owner' }); const hr = holderOf(sh, { audience: 'reader' });
    out.push(`R5 r5-city-${i} form=${JSON.stringify(form)} A=${JSON.stringify(A)} B=${JSON.stringify(B)}`);
    out.push(`R5   owner recentConflict=${JSON.stringify(rec.powerStructure.recentConflict)} taker=${JSON.stringify(transferTakerOf(rec, form))} holder=${JSON.stringify(ho.holderName)} rule=${ho.rule} person=${JSON.stringify(ho.person?.name ?? null)}`);
    out.push(`R5   shared recentConflict(re-derived)=${JSON.stringify(sh.powerStructure?.recentConflict ?? null)} edgesServed=${(sh.powerStructure?.factionRelationships || []).filter((r) => Array.isArray(r?.pair) && r.pair.includes(form) && /power behind/.test(String(r.narrative))).length} taker=${JSON.stringify(transferTakerOf(sh, form))} holder=${JSON.stringify(hr.holderName)} rule=${hr.rule} person=${JSON.stringify(hr.person?.name ?? null)}`);
    done += 1;
  }
  // the import re-deriver on a lit town (VR26's city-calm-3): its legitimacy terms against the stored ones
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: 'city' });
  const t3 = generateSettlementPipeline(cfg, null, { seed: 'vr26-city-calm-3', customContent: {} });
  const pub = toPublicSafe(t3); const served = applyVeil(pub, resolveVeil(defaultVeilFor(pub), null));
  out.push(`IMPORT vr26-city-calm-3 law=${t3.config?._fortuneLawVersion} stored=${JSON.stringify(t3.powerStructure.publicLegitimacy.breakdown)} served=${JSON.stringify(served.powerStructure.publicLegitimacy.breakdown)} importRederived=${JSON.stringify(rederiveServed(served).powerStructure.publicLegitimacy.breakdown)}`);
  writeFileSync('/var/tmp/v53/redscause/r5.out', out.join('\n') + '\n');
}, 900000);
