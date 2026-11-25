// VEIL-53, judging FAIL-CLOSED commit 1: does the OWNER's record always carry the keys whose absence now silences a line?
// Over the banked 720 born on the trial join (lit): births lacking history.legacyAnnotations AND history.siegeNarrative (the
// legacy default's gate), economicState.safetyProfile.blackMarketCapture (the two band rows and the siege sentence), and
// defenseProfile.readiness.score (the readiness row). A count above 0 is an owner's page that the cure also silences.
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const J = '/home/user/join53/';
it('owner keys on the banked 720', async () => {
  const { censusPlan, configOf } = await import(J + 'tests/components/pageCensusWalk.shared.mjs');
  const { generateSettlementPipeline } = await import(J + 'src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(J + 'src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(J + 'src/store/configSlice.js');
  await loadGenerationLawPayloads();
  const has = (o, k) => !!o && typeof o === 'object' && Object.hasOwn(o, k);
  const t = { births: 0, noLegacyBoth: 0, noCapture: 0, noScore: 0, ex: [] };
  for (const row of censusPlan('r2', 1)) {
    const s = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    t.births++;
    const nl = !has(s.history, 'legacyAnnotations') && !has(s.history, 'siegeNarrative');
    const nc = !has(s.economicState?.safetyProfile, 'blackMarketCapture');
    const ns = !has(s.defenseProfile?.readiness, 'score');
    if (nl) t.noLegacyBoth++; if (nc) t.noCapture++; if (ns) t.noScore++;
    if ((nl || nc || ns) && t.ex.length < 8) t.ex.push({ seed: row.seed, nl, nc, ns });
  }
  writeFileSync('/var/tmp/v53/probes-keys/keys.json', JSON.stringify(t, null, 1));
});
