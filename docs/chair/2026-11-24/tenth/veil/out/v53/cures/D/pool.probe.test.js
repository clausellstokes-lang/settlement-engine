// UNIT D (RULING V16): how many places of the banked 720 (censusPlan('r2', 1)) REACH two or more takers on the current form,
// on the owner's record and on the shared page; and how many answer R1 at all.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const J = '/home/user/cures53/';
it('pool', async () => {
  const { censusPlan, configOf } = await import(J + 'tests/components/pageCensusWalk.shared.mjs');
  const { generateSettlementPipeline } = await import(J + 'src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(J + 'src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(J + 'src/store/configSlice.js');
  const { toPublicSafe } = await import(J + 'src/domain/display/publicSafe.js');
  const { applyVeil, resolveVeil, defaultVeilFor } = await import(J + 'src/domain/display/galleryVeil.js');
  const { rederiveForPage } = await import(J + 'src/domain/veil/pageRederive.js');
  const { transferTakersOf, holderOf } = await import(J + 'src/domain/seat/holderOfSeat.js');
  const { governingFactionOf, nameOf } = await import(J + 'src/domain/rulingPower.js');
  const { seatsByHolder } = await import(J + 'src/domain/seat/seatLaw.js');
  await loadGenerationLawPayloads();
  const t = { births: 0, seatLaw: 0, ownerTwoPlus: 0, pageTwoPlus: 0, ownerAnyTaker: 0, ownerR1: 0, pageR1Nobody: 0, errors: 0 };
  const hits = [];
  for (const row of censusPlan('r2', 1)) {
    try {
      const town = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
      t.births += 1;
      if (seatsByHolder(town)) t.seatLaw += 1;
      const form = nameOf(governingFactionOf(town));
      const o = transferTakersOf(town, form).length;
      if (o >= 1) t.ownerAnyTaker += 1;
      if (o >= 2) { t.ownerTwoPlus += 1; hits.push(`owner ${row.seed}`); }
      if (holderOf(town, { audience: 'owner' }).rule === 'R1') t.ownerR1 += 1;
      const pub = toPublicSafe(town);
      const page = rederiveForPage(applyVeil(pub, resolveVeil(defaultVeilFor(pub), null)));
      const pf = nameOf(governingFactionOf(page));
      if (transferTakersOf(page, pf).length >= 2) { t.pageTwoPlus += 1; hits.push(`page ${row.seed}`); }
      const h = holderOf(page, { audience: 'reader' });
      if (h.rule === 'R1' && !h.holderName) t.pageR1Nobody += 1;
    } catch (e) { t.errors += 1; hits.push(`error ${row.seed}: ${String(e?.message || e).slice(0, 120)}`); }
  }
  writeFileSync('/var/tmp/v53/cures/D/pool.out', JSON.stringify({ tally: t, hits }, null, 1) + '\n');
}, 3600000);
