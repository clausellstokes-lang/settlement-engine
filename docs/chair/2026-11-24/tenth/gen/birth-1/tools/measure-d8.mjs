// BIRTH-1, unit D8 (intake 6): a Feudal Stewardship whose seat is held by "the reeve". Read from the record and the page's own
// writer (`governanceAccount.js :: governanceAccountOf`, the governance paragraph; `powerStrata.js :: rulingChainOf`, its holder).
let M = null;
export async function measure(town, { tree }) {
  M ||= {
    ga: await import(`${tree}/src/domain/display/governanceAccount.js`),
    ps: await import(`${tree}/src/domain/dossier/powerStrata.js`),
  };
  const gov = town?.powerStructure?.governingName ?? null;
  const houses = (town?.institutions || []).map((i) => i?.name);
  let chain = null; let text = null;
  try { chain = M.ps.rulingChainOf(town); } catch (e) { chain = { err: String(e?.message || e).slice(0, 80) }; }
  try { text = M.ga.governanceAccountOf(town)?.text ?? null; } catch (e) { text = `THREW ${String(e?.message || e).slice(0, 80)}`; }
  const holderRole = chain?.npc?.role ?? null;
  return {
    gov, holderRole, holderName: chain?.npc?.name ?? null,
    reeveHouse: houses.includes("Lord's reeve"), stewardHouse: houses.some((h) => /steward/i.test(String(h))),
    seatLine: text && /holds|seat/.test(text) ? text.split(/(?<=\.)\s+/).find((s) => /seat/.test(s)) ?? null : null,
    stewardWordOnPage: !!text && /steward/i.test(text), reeveWordOnPage: !!text && /\breeve\b/i.test(text),
  };
}
