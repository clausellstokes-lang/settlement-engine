// UNIT D's STOP probe: REDSCAUSE (5)'s two-transfer construction (r5.probe.test.js), and its TWIN that differs only in the
// withheld key (recentConflict naming B, not A). Are the two served documents identical while the owner's holders differ?
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
const J = '/home/user/cures53';
it('d5', async () => {
  const out = [];
  const { generateSettlementPipeline } = await import(`${J}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${J}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${J}/src/store/configSlice.js`);
  const { toPublicSafe } = await import(`${J}/src/domain/display/publicSafe.js`);
  const { applyVeil, resolveVeil, defaultVeilFor } = await import(`${J}/src/domain/display/galleryVeil.js`);
  const { rederiveForPage } = await import(`${J}/src/domain/veil/pageRederive.js`);
  const { holderOf, transferTakerOf } = await import(`${J}/src/domain/seat/holderOfSeat.js`);
  const { governingFactionOf, nameOf } = await import(`${J}/src/domain/rulingPower.js`);
  const { isVeiledPower } = await import(`${J}/src/domain/people/cardVeil.js`);
  await loadGenerationLawPayloads();
  const served = (r) => { const pub = toPublicSafe(r); return applyVeil(pub, resolveVeil(defaultVeilFor(pub), null)); };
  let done = 0;
  for (let i = 0; i < 40 && done < 2; i += 1) {
    const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: `r5-city-${i}`, customContent: {} });
    const gov = governingFactionOf(town); const form = nameOf(gov);
    const others = (town.powerStructure.factions || []).filter((f) => f !== gov && !isVeiledPower(f)).map(nameOf).filter(Boolean);
    if (others.length < 2) continue;
    const [A, B] = others;
    const plant = (taker) => {
      const rec = structuredClone(town);
      rec.powerStructure.factionRelationships = [...(rec.powerStructure.factionRelationships || []),
        { pair: [form, A], narrative: `${A} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`, type: 'competitive' },
        { pair: [form, B], narrative: `${B} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`, type: 'competitive' }];
      rec.powerStructure.recentConflict = `Power passed to ${taker} by coup; the government now sits as a ${form.toLowerCase()}.`;
      return rec;
    };
    const recA = plant(A); const recB = plant(B);
    const sA = served(recA); const sB = served(recB);
    const pA = rederiveForPage(structuredClone(sA)); const pB = rederiveForPage(structuredClone(sB));
    const json = (o) => JSON.stringify(o);
    out.push(`D5 r5-city-${i} form=${json(form)} A=${json(A)} B=${json(B)}`);
    out.push(`D5   owner(names A) holder=${json(holderOf(recA, { audience: 'owner' }).holderName)} taker=${json(transferTakerOf(recA, form))}`);
    out.push(`D5   owner(names B) holder=${json(holderOf(recB, { audience: 'owner' }).holderName)} taker=${json(transferTakerOf(recB, form))}`);
    out.push(`D5   served documents deep-equal=${isDeepStrictEqual(sA, sB)} servedHasRecentConflict=${sA.powerStructure && 'recentConflict' in sA.powerStructure} pages deep-equal=${isDeepStrictEqual(pA, pB)}`);
    out.push(`D5   served text names A=${json(sA).includes(A)} names B=${json(sA).includes(B)}; page reader holder=${json(holderOf(pA, { audience: 'reader' }).holderName)} (both)`);
    done += 1;
  }
  writeFileSync('/var/tmp/v53/cures/D/d5.out', out.join('\n') + '\n');
}, 900000);
