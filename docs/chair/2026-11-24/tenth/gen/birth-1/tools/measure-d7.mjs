// BIRTH-1, unit D7 (the crisis names only what the place holds; SCOPE-LINE decision 1): per birth, its active crises, its final
// roster, and every crisis sentence the record carries for a page (the power step's sentence, the pressure line, the stability
// label, each crisis entry's summary / hook / note, the governance paragraph). The per-kind analysis is done over the file
// (`analyse-d7.mjs`), so the corpus is born once. Read only.
let M = null;
export async function measure(town, { tree }) {
  M ||= { ga: await import(`${tree}/src/domain/display/governanceAccount.js`) };
  const stress = Array.isArray(town?.stress) ? town.stress : town?.stress ? [town.stress] : [];
  let account = null;
  try { account = M.ga.governanceAccountOf(town)?.text ?? null; } catch (e) { account = `THREW ${String(e?.message || e).slice(0, 80)}`; }
  return {
    crises: stress.map((e) => (typeof e === 'string' ? e : e?.type)).filter(Boolean),
    roster: (town?.powerStructure?.factions || []).map((f) => f?.faction),
    seat: town?.powerStructure?.governingName ?? null,
    recentConflict: town?.powerStructure?.recentConflict ?? null,
    pressure: town?.pressureSentence ?? null,
    stability: town?.powerStructure?.stability ?? null,
    entries: stress.filter((e) => e && typeof e === 'object').map((e) => ({ type: e.type, summary: e.summary ?? null, hook: e.crisisHook ?? null, note: e.viabilityNote ?? null })),
    account,
  };
}
