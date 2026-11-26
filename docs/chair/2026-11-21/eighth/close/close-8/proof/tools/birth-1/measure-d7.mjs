// BIRTH-1, unit D7 (the crisis names only what the place holds; SCOPE-LINE decision 1): per birth, its active crises, its final
// roster, and every crisis sentence the record carries for a page (the power step's sentence, the pressure line, the stability
// label, each crisis entry's summary / hook / note, the governance paragraph). The per-kind analysis is done over the file
// (`analyse-d7.mjs`), so the corpus is born once. Read only.
let M = null;
export async function measure(town, { tree }) {
  M ||= {
    ga: await import(`${tree}/src/domain/display/governanceAccount.js`),
    sp: await import(`${tree}/src/domain/people/stressPowerFaces.js`),
    pd: await import(`${tree}/src/data/powerData.js`),
  };
  const stress = Array.isArray(town?.stress) ? town.stress : town?.stress ? [town.stress] : [];
  let account = null;
  try { account = M.ga.governanceAccountOf(town)?.text ?? null; } catch (e) { account = `THREW ${String(e?.message || e).slice(0, 80)}`; }
  // Is a roster row one of the crisis's own powers? The tree's own reader (`stressPowerFaces.js :: stressPowerRowOf`, read with
  // the one crisis alone), the crisis powers with no face row (by name, as fortune-7's measure listed them), or the infiltrator
  // (an `other` pool name pushed hidden). The ruling power is never the crisis's own.
  const NO_FACE = { indebted: ["Creditor's Representative"], recently_betrayed: ['The Inquiry'], insurgency: ["Journeymen's League", 'Reform Movement'],
    mass_migration: ["Newcomers' Settlement", 'Departure Committee'], wartime: ['Peace Movement'], slave_revolt: ['Revolt Leadership', 'Abolitionist Network'] };
  const others = new Set([...(M.pd.FACTION_DESCRIPTORS?.other || []), ...(M.pd.FACTION_DESCRIPTORS_EXTRA?.other || [])]);
  const own = (kind, f) => !!f && f.isGoverning !== true && (!!M.sp.stressPowerRowOf({ stress: [{ type: kind }] }, f)
    || (NO_FACE[kind] || []).includes(f.faction) || (kind === 'infiltrated' && f.hidden === true && f.category === 'other' && others.has(f.faction)));
  const kinds = [...new Set(stress.map((e) => (typeof e === 'string' ? e : e?.type)).filter(Boolean))];
  const holds = Object.fromEntries(kinds.map((k) => [k, (town?.powerStructure?.factions || []).some((f) => own(k, f))]));
  return {
    holds,
    placeName: town?.name ?? null,
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
