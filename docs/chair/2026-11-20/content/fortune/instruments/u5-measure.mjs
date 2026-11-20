// FORTUNE U5 instrument: born towns of a tree as one JSON line each, with the facts of the born record the "merits of
// rule" read (the ruler's traits, the remembered hardships and today's troubles, the seat's relations), beside the
// standing and the contest's figures. It changes no file; it reads a checkout or a `tree.mjs` / `u5-tree.mjs` copy.
//   node u5-measure.mjs <tree> <out.jsonl> [perSize=100] [prefix=hxd] [extraConfigJson]
// Knob U5_LAW (U5a, `u5-place.mjs`): when set, `_fortuneLawVersion: <U5_LAW>` is forced AFTER `birthConfig` (the fixture
// arm of COMMON.md: `birthConfig` clamps an incoming marker away), for a tip that holds the rule under the fortune law.
// The chair's recipe (measure.mjs): untouched settings `{ ...DEFAULT_CONFIG, settType }`, seeds `<prefix>-<size>-<i>`,
// `birthConfig` then `generateSettlementPipeline`.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , treeArg, outArg, nArg = '100', prefix = 'hxd', extra = ''] = process.argv;
const L = resolve(treeArg);
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { coupContenders } = await import(`${L}/src/domain/rulingPowerCoup.js`);
const { DEALING_TRAIT_FAMILY } = await import(`${L}/src/data/npcData.js`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const extraCfg = extra ? JSON.parse(extra) : {};
await loadGenerationLawPayloads();
const typesOf = (s) => (!s ? [] : (Array.isArray(s) ? s : [s]).map((x) => x?.type ?? x?.id ?? String(x)));
// the legacy annotation's relationship, read off its own words (legacyGenerator.js :: annotationBody); the record keeps no field
const relOf = (text) => (/never been put right/.test(text) ? 'unresolved' : /has since recovered/.test(text) ? 'recovery' : /have since changed/.test(text) ? 'drift' : 'plain');
const lines = [];
for (const size of SIZES) for (let i = 0; i < +nArg; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const born = birthConfig({ ...DEFAULT_CONFIG, settType: size, ...extraCfg });
  const t = generateSettlementPipeline(process.env.U5_LAW ? { ...born, _fortuneLawVersion: Number(process.env.U5_LAW) } : born, null, { seed, customContent: {} });
  const ps = t.powerStructure || {}; const pl = ps.publicLegitimacy || {};
  let gated = null; try { gated = coupContenders(t).incumbent.gated; } catch { gated = 'err'; }
  const gov = (ps.factions || []).find((f) => f.isGoverning) || null;
  const govName = gov?.faction ?? ps.governingName ?? null;
  // THE RULER: rank 1 of the governing power (the card's own membership record)
  const ruler = (t.npcs || []).find((n) => (n.memberships || []).some((m) => m.power === govName && m.rank === 1)) || null;
  const pers = ruler?.personality || {};
  const h = t.history || {};
  const tensions = (h.currentTensions || []).map((x) => ({ type: x.type, sev: x.severity, namesSeat: (x.factions || []).includes(govName) }));
  const events = (h.historicalEvents || []).map((e) => ({ type: e.type, tpl: e.templateType ?? null, sev: e.severity, yearsAgo: e.yearsAgo, name: e.name }));
  const notes = (h.legacyAnnotations || []).map((a) => ({ name: a.eventName, type: a.eventType, sev: a.severity, rel: relOf(String(a.annotation || '')) }));
  const conflicts = (ps.conflicts || t.conflicts || []).map((c) => ({ parties: c.parties, seat: (c.parties || []).includes(govName), intensity: c.intensity }));
  const rels = (ps.factionRelationships || []).filter((r) => (r.pair || []).includes(govName)).map((r) => {
    const other = (r.pair || []).find((p) => p !== govName); const of = (ps.factions || []).find((f) => f.faction === other);
    return { other, cat: of?.category ?? null, type: r.type, direction: r.direction };
  });
  // WHAT A SHARED PAGE CARRIES of each fact a merit reads (`publicSafe.js :: toPublicSafe`, read only)
  const pub = toPublicSafe(t) || {};
  const pubRuler = (pub.npcs || []).find((n) => (n.memberships || []).some((m) => m.power === govName && m.rank === 1)) || null;
  const shared = {
    ruler: !!pubRuler, rulerTraits: !!pubRuler && pubRuler.personality?.dominant === ruler?.personality?.dominant && pubRuler.personality?.flaw === ruler?.personality?.flaw,
    events: (h.historicalEvents || []).every((e) => (pub.history?.historicalEvents || []).some((p) => p.name === e.name && p.severity === e.severity && p.yearsAgo === e.yearsAgo && p.templateType === e.templateType)),
    tensions: (pub.history?.currentTensions || []).length === (h.currentTensions || []).length,
    notes: (pub.history?.legacyAnnotations || []).length === (h.legacyAnnotations || []).length,
    capture: pub.powerStructure?.criminalCaptureState !== undefined,
    breakdown: !!pub.powerStructure?.publicLegitimacy?.breakdown,
  };
  lines.push(JSON.stringify({
    seed, size, name: t.name, population: t.population, age: h.age ?? null,
    stress: typesOf(t.stress), calm: !t.stress,
    prosperity: t.economicState?.prosperity, food: t.economicState?.foodSecurity?.label, safety: t.economicState?.safetyProfile?.safetyLabel,
    legit: { score: pl.score, label: pl.label, breakdown: pl.breakdown, gov: pl.govMultiplier, reasons: pl.reasons ?? null, merits: pl.merits ?? null },
    defense: { label: t.defenseProfile?.readiness?.label },
    stability: String(ps.stability ?? ''), government: ps.government, govName, govCategory: gov?.category ?? null, capture: ps.criminalCaptureState ?? null, gated,
    ruler: ruler ? { role: ruler.role, dominant: pers.dominant ?? null, flaw: pers.flaw ?? null, modifier: pers.modifier ?? null, famDominant: DEALING_TRAIT_FAMILY[pers.dominant] ?? null, famFlaw: DEALING_TRAIT_FAMILY[pers.flaw] ?? null, famModifier: DEALING_TRAIT_FAMILY[pers.modifier] ?? null } : null,
    events, tensions, notes, conflicts, rels,
    founding: { overcoming: h.founding?.overcoming ?? null, challenge: h.founding?.initialChallenge ?? null },
    siege: !!h.siegeNarrative,
    previousGovernments: Array.isArray(ps.previousGovernments) ? ps.previousGovernments.length : (ps.previousGovernments === undefined ? 'absent' : typeof ps.previousGovernments),
    shared,
    neighbour: t.neighborRelationship ? { type: t.neighborRelationship.type ?? t.neighborRelationship.relationship ?? null } : null,
  }));
}
writeFileSync(outArg, lines.join('\n') + '\n');
console.log(`${lines.length} towns -> ${outArg}`);
