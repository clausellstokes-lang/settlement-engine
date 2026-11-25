// BIRTH-1, unit D3 (intake 2): the power step's sentence `powerStructure.recentConflict` written before the coherence repair.
// THE ORACLE IS THE WRITER'S OWN OUTPUT over the settled record: `generatePowerStructure` re-run exactly as the assembly's late
// replay runs it (the power intent's seed, tier, neighbour, config and stress entries; the FINAL economic state; the defence
// profile's readiness label, military gate and the settled roster's defence atoms), once over the intent's roster (what the
// late replay computes and does not keep) and once over the SETTLED roster (`town.institutions`). Read only; no tree is changed.
export function onStep(name, ctx, _patch, cap) {
  if (name === 'generatePower') {
    cap.intent = JSON.parse(JSON.stringify(ctx.powerIntent ?? null));
    cap.atPower = ctx.powerStructure?.recentConflict ?? null;
    cap.powerNames = (ctx.institutions || []).map((i) => i?.name);
  }
}
let M = null;
export async function measure(town, { tree, cap }) {
  M ||= {
    rs: await import(`${tree}/src/generators/power/rulingStructure.js`),
    prng: await import(`${tree}/src/kernel/prng.js`),
    ctx: await import(`${tree}/src/kernel/rngContext.js`),
    facts: await import(`${tree}/src/domain/facts/factsOf.js`),
  };
  const intent = cap.intent;
  const stored = town?.powerStructure?.recentConflict ?? null;
  const out = { stored, atPower: cap.atPower ?? null };
  if (!intent) return { ...out, err: 'no intent' };
  const write = (institutions) => {
    const prev = M.ctx.setActiveRng(M.prng.createPRNG(intent.rngSeed));
    try {
      const dp = town.defenseProfile || {};
      const ps = M.rs.generatePowerStructure(intent.tier, town.economicState, intent.neighbourRelationship, intent.config, institutions, {
        ...(dp.readiness?.label ? { defenseLabel: dp.readiness.label } : {}),
        ...(dp.economicGates?.military != null ? { militaryGate: dp.economicGates.military } : {}),
        forces: M.facts.factsOf(town).defence,
        ...(Array.isArray(intent.stressEntries) ? { stressEntries: intent.stressEntries } : {}),
      });
      return ps?.recentConflict ?? null;
    } catch (e) { return `THREW ${String(e?.message || e).slice(0, 120)}`; } finally { M.ctx.clearActiveRng(prev); }
  };
  const overIntent = write(intent.institutions);
  const overSettled = write(town.institutions);
  const settledNames = new Set((town.institutions || []).map((i) => i?.name));
  const powerNames = new Set(cap.powerNames || []);
  return {
    ...out, overIntent, overSettled,
    stale: stored !== overSettled, replayDiffers: stored !== overIntent,
    added: [...settledNames].filter((n) => !powerNames.has(n)), removed: [...powerNames].filter((n) => !settledNames.has(n)),
    inHistory: !!stored && JSON.stringify(town.history || {}).includes(stored),
  };
}
