// V33-JOINPROBE PASS 2 (LIT), step 3's preface: WHAT THE LIT LAWS MOVE IN THE POOL'S BIRTHS, by size, before anything is attributed.
// Each seed of the lit pool (parts A and B, pool.sh's seeds and tell2.probe.jsx's config, births whole: no abort) is born twice on
// THIS tree: LIT (birthConfig, as the pool) and DARK (birthConfig with `_seatLawVersion` and `_fortuneLawVersion` deleted, which is the
// dark tree's birth: every lit branch reads `seatsByHolder` / `isSizeRelativeFortune` off the config, SEAT_CONTEST_LIT only under
// the seat law). Per birth: the powers (name, power, category, governing), the seat's holder (`holderOf`, owner) and the contest
// (`coupContenders` challengers), fortune's standing (score, label, `breakdown`, `breakdown.merits`), the capture rung, and the
// hideable houses held. Also born under EACH LAW ALONE (seatOnly, fortuneOnly), to say which law moves what.
//   RV6_SRC=<worktree> RV9_PROBE=<this file> RV9_POOL=<pooldir> RV9_SHARD=<s>/<n> RV9_OUT=<json> npx vitest run --config /var/tmp/v18/rv9/vitest.config.mjs
import { it, vi } from 'vitest';
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const SRC = process.env.RV6_SRC; const SHARD = (process.env.RV9_SHARD || '0/1').split('/').map(Number);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const powerName = (f) => String(f?.faction ?? f?.name ?? '');

it('V33-JOINPROBE birth diff', async () => {
  const { generateSettlementPipeline } = await import(`${SRC}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${SRC}/src/store/configSlice.js`);
  const { isHideableHouse } = await import(`${SRC}/src/domain/people/cardVeil.js`);
  const { holderOf } = await import(`${SRC}/src/domain/seat/holderOfSeat.js`);
  const { coupContenders } = await import(`${SRC}/src/domain/rulingPowerCoup.js`);
  await loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const cfgOf = (size, crisis) => ({ ...DEFAULT_CONFIG, ...dials, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
  const D = process.env.RV9_POOL;
  const seeds = readdirSync(D).filter((f) => /^pool(b)?-shard\d\.json$/.test(f)).sort()
    .flatMap((f) => JSON.parse(readFileSync(`${D}/${f}`, 'utf8')).births.map((b) => ({ seed: b.seed, size: b.size, crisis: b.crisis, part: f.startsWith('poolb') ? 'B' : 'A' })));
  const read = (t) => {
    const ps = t.powerStructure ?? {}; const leg = ps.publicLegitimacy ?? {};
    const h = holderOf(t, { audience: 'owner' }); let ch = [];
    try { ch = coupContenders(t).challengers.map((c) => c.name); } catch (e) { ch = [`ERR ${e.message}`]; }
    return {
      law: [t.config?._seatLawVersion ?? null, t.config?._fortuneLawVersion ?? null],
      powers: (ps.factions || []).filter(isRec).map((f) => `${powerName(f)}|${f.power}|${f.category ?? ''}|${f.isGoverning ? 'G' : ''}`),
      holder: `${h.rule}|${h.holderName ?? ''}|${h.person ? String(h.person.name ?? '') : ''}`,
      contest: ch,
      standing: { score: leg.score ?? null, label: leg.label ?? null, breakdown: leg.breakdown ?? null },
      merits: leg.breakdown?.merits ?? null,
      rung: ps.criminalCaptureState ?? null,
      prosperity: t.economicState?.prosperity ?? null,
      held: (t.institutions || []).filter((x) => isRec(x) && isHideableHouse(x)).map((x) => String(x.name)).sort(),
    };
  };
  const rows = [];
  seeds.forEach((s, i) => {
    if (i % SHARD[1] !== SHARD[0]) return;
    const lit = generateSettlementPipeline(birthConfig(cfgOf(s.size, s.crisis)), null, { seed: s.seed, customContent: {} });
    const dc = { ...birthConfig(cfgOf(s.size, s.crisis)) }; delete dc._seatLawVersion; delete dc._fortuneLawVersion; // the dark tree's birthConfig stamps neither key
    const dark = generateSettlementPipeline(dc, null, { seed: s.seed, customContent: {} });
    // each law ALONE (the other's key deleted): which law moves what
    const sc = { ...birthConfig(cfgOf(s.size, s.crisis)) }; delete sc._fortuneLawVersion;
    const fc = { ...birthConfig(cfgOf(s.size, s.crisis)) }; delete fc._seatLawVersion;
    const seatOnly = generateSettlementPipeline(sc, null, { seed: s.seed, customContent: {} });
    const fortuneOnly = generateSettlementPipeline(fc, null, { seed: s.seed, customContent: {} });
    rows.push({ ...s, lit: read(lit), dark: read(dark), seatOnly: read(seatOnly), fortuneOnly: read(fortuneOnly) });
  });
  writeFileSync(process.env.RV9_OUT, JSON.stringify({ shard: SHARD, n: rows.length, rows }));
});
