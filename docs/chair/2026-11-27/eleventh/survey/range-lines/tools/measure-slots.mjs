const T = process.env.BIRTHS_TREE;
export async function measure(town) {
  const ga = await import(`${T}/src/domain/display/governanceAccount.js`);
  const ps = await import(`${T}/src/domain/dossier/powerStrata.js`);
  const pat = await import(`${T}/src/domain/people/patronage.js`);
  const cr = await import(`${T}/src/domain/display/crisisStoppedRow.js`);
  const gsp = await import(`${T}/src/domain/display/stateProse/generalStateProse.js`);
  const fo = await import(`${T}/src/domain/facts/factsOf.js`);
  const o = { name: town.name, tier: town.tier };
  try { const chain = ps.rulingChainOf(town); o.ruler = chain.power?.name ?? null; o.rulerProse = o.ruler ? ga.powerNameInProse(o.ruler) : null; o.npc = chain.npc ? { name: chain.npc.name, role: chain.npc.role } : null; o.absence = chain.absence?.kind ?? null; } catch (e) { o.chainErr = String(e); }
  try { o.gov = ga.governanceAccountOf(town)?.text ?? null; } catch (e) { o.govErr = String(e); }
  try { const v = pat.dmPowerViewOf(town); o.hall = v ? { rung: v.hall.rung, line: v.hall.line } : null; o.lends = v ? v.rulingThree.flatMap((f) => f.lends.map((l) => ({ name: f.name, rank: f.rank, power: l.powerName, share: l.share, boost: l.boost, line: l.line }))) : []; o.boosts = v ? v.boosts.map((b) => b.line) : []; o.three = v ? v.rulingThree.map((f) => f.rank) : []; } catch (e) { o.patErr = String(e); }
  try { o.crises = cr.stoppingCrisesOf(town); } catch (e) { o.crErr = String(e); }
  try { const h = town.history || {}; const lk = gsp.legacyPoolKey(h.legacyAnnotations); o.legacy = lk ? { key: lk.key, event: lk.row.eventName, yearsAgo: lk.row.yearsAgo, calamity: gsp.calamityFill?.(lk.row.eventName) } : null; } catch (e) { o.legErr = String(e); }
  try { o.crime = fo.factsOf(town).crime; } catch (e) { o.foErr = String(e); }
  o.charter = !!town.economicState?.compound?.inst?.hasCharterHall || JSON.stringify(town.institutions || []).toLowerCase().includes('charter hall');
  o.stress = (Array.isArray(town.stress) ? town.stress : town.stress ? [town.stress] : []).map((x) => x?.type ?? x);
  return o;
}
