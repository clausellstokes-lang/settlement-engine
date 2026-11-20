// R3-TELL unit 1: THE CRIMINAL SURFACE of a served page, as FAMILIES of items (a multiset of strings each), built from
// the paths search.probe.jsx found (search/search-paths.txt: 288 normalized paths tagged switch / house / word / key).
// Each family keeps only CRIMINAL-ATTRIBUTED rows (a criminal house's or power's, a criminal-worded row), so the
// counterfactual's unrelated regeneration (a different cast, other chains) is not counted. A LIST'S PRESENCE is an item of
// its own ('#absent', '#empty', '#list'): AN EMPTY LIST AND AN ABSENT FIELD ARE DIFFERENT.
// KIND: 'C' content (a row a fail-closed rule can withhold; the withheld set W is read from these), 'D' derived (a label,
// a flag, a figure, a prose rung computed from the content). Every family is compared; W and the nearest setting read C.
import { isRec } from './tell-common.mjs';

export const CRIM_RE = /crim|thie|smuggl|black.?market|\bfenc(e|es|ing)\b|bandit|outlaw|\bgangs?\b|underworld|illicit|contraband|covert|corrupt|brib|racket|extort|syndicate|cartel|underground|launder|poach|red.?light|slave|heist|cutpurse|pickpocket|assassin|drug|narcot/i;
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
/** Key-order-blind (ruling 22, VR45: JSONB reorders keys). */
const stable = (v) => (Array.isArray(v) ? v.map(stable) : isRec(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable(v[k])])) : v);
const S = (v) => (v === undefined ? 'undefined' : JSON.stringify(stable(v)));
const presence = (v) => (v === undefined ? '#absent' : Array.isArray(v) ? (v.length ? '#list' : '#empty') : isRec(v) ? '#object' : `#${typeof v}`);
const cut = (s, n = 160) => (s.length > n ? `${s.slice(0, n)}…` : s);

/** Names a town's criminal surface is attributed by, from the STORED documents (A and B): H houses, P powers. */
export function namesOf(isHideableHouse, ...docs) {
  const H = new Set(); const P = new Set();
  for (const d of docs) {
    if (!isRec(d)) continue;
    for (const h of recs(d.institutions)) {
      const crim = isHideableHouse(h) || /criminal/i.test(String(h.category ?? '')) || /criminal/i.test(String(h.priorityCategory ?? ''));
      if (crim && typeof h.name === 'string') H.add(h.name);
    }
    for (const f of [...recs(d.powerStructure?.factions), ...recs(d.factions)]) {
      const nm = String(f.faction ?? f.name ?? '');
      if (String(f.category ?? '').toLowerCase() === 'criminal' || (typeof f.category !== 'string' && /thie/i.test(nm))) P.add(nm);
    }
  }
  return { H, P };
}

export function makeSurface(labelsOf) {
  return function surface(d, { H, P }) {
    /** @type {Record<string, { kind: 'C'|'D', items: string[] }>} */
    const F = {};
    const add = (fam, kind, item) => { (F[fam] ||= { kind, items: [] }).items.push(cut(String(item))); };
    const fam = (name, kind) => { F[name] ||= { kind, items: [] }; };
    const inP = (v) => P.has(String(v ?? ''));
    const inH = (v) => H.has(String(v ?? ''));
    const crimW = (v) => typeof v === 'string' && CRIM_RE.test(v);
    const econ = isRec(d?.economicState) ? d.economicState : {};
    const sp = isRec(econ.safetyProfile) ? econ.safetyProfile : undefined;
    // ── services
    fam('svc.criminal', 'C'); add('svc.criminal', 'C', presence(d?.availableServices?.criminal));
    for (const x of recs(d?.availableServices?.criminal)) { add('svc.criminal', 'C', `${x.name ?? x.service}|${x.institution}`); add('svc.criminalRows', 'D', S(x)); }
    fam('svc.otherCriminal', 'C');
    for (const [cat, list] of Object.entries(isRec(d?.availableServices) ? d.availableServices : {})) {
      if (cat === 'criminal') continue;
      for (const x of recs(list)) if (inH(x.institution) || x.institution === '(covert)' || crimW(x.name) || crimW(x.institution) || crimW(x.desc)) add('svc.otherCriminal', 'C', `${cat}:${x.name}|${x.institution}|${x.desc}`);
    }
    // ── the roster's criminal houses
    fam('inst.criminal', 'C');
    for (const h of recs(d?.institutions)) if (inH(h.name) || /criminal/i.test(String(h.category ?? '')) || /criminal/i.test(String(h.priorityCategory ?? ''))) add('inst.criminal', 'C', `${h.name}|${h.category}|${h.catalogId}`);
    // ── Defense's criminal architecture
    fam('sp.ops', 'C'); add('sp.ops', 'C', presence(sp?.criminalInstitutions)); for (const x of (Array.isArray(sp?.criminalInstitutions) ? sp.criminalInstitutions : [])) add('sp.ops', 'C', S(x));
    fam('sp.crimeTypes', 'C'); add('sp.crimeTypes', 'C', presence(sp?.crimeTypes)); for (const x of recs(sp?.crimeTypes)) { add('sp.crimeTypes', 'C', String(x.type)); add('sp.crimeTypeRows', 'D', S(x)); }
    fam('sp.blackMarketCapture', 'C'); add('sp.blackMarketCapture', 'C', `${presence(sp?.blackMarketCapture)}:${S(sp?.blackMarketCapture)}`);
    fam('sp.plotHooks', 'C'); add('sp.plotHooks', 'C', presence(sp?.plotHooks)); for (const x of (Array.isArray(sp?.plotHooks) ? sp.plotHooks : [])) if (crimW(S(x))) add('sp.plotHooks', 'C', S(x));
    fam('sp.flags', 'D'); add('sp.flags', 'D', S(sp?.flags));
    fam('sp.prose', 'D'); for (const k of ['safetyDesc', 'guardEffectivenessDesc', 'economicDragDesc']) add('sp.prose', 'D', `${k}=${S(sp?.[k])}`);
    for (const [where, c] of [['econ', econ.compound], ['sp', sp?.compound]]) {
      fam(`compound.${where}`, 'D');
      if (!isRec(c)) { add(`compound.${where}`, 'D', '#absent'); continue; }
      const i = isRec(c.inst) ? c.inst : {};
      for (const k of ['hasBlackMarket', 'hasCriminalInst', 'hasGangInfra', 'hasSmuggling', 'hasThievesGuild']) add(`compound.${where}`, 'D', `${k}=${S(i[k])}`);
      for (const n of (Array.isArray(i.names) ? i.names : [])) if (H.has(n) || [...H].some((h) => h.toLowerCase() === String(n).toLowerCase()) || crimW(n)) add(`compound.${where}`, 'D', `name:${n}`);
      add(`compound.${where}`, 'D', `raw.criminal=${S(c.raw?.criminal)}`);
    }
    fam('dial', 'D'); add('dial', 'D', `config=${S(d?.config?.priorityCriminal)}`); add('dial', 'D', `priorities=${S(econ.priorities?.criminal)}`);
    fam('econ.complexity', 'D'); add('econ.complexity', 'D', S(econ.economicComplexity));
    // ── income
    fam('income.criminal', 'C'); add('income.criminal', 'C', presence(econ.incomeSources));
    for (const r of recs(econ.incomeSources)) if (r.isCriminal === true) { add('income.criminal', 'C', String(r.source)); add('income.criminalRows', 'D', S(r)); }
    fam('income.shares', 'D'); for (const r of recs(econ.incomeSources)) if (r.isCriminal !== true) add('income.shares', 'D', `${r.source}|${r.percentage}`);
    fam('chains.criminal', 'C'); for (const c of recs(econ.activeChains)) if (c.needKey === 'criminal_economy' || (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).some(inH)) { add('chains.criminal', 'C', String(c.chainId)); add('chains.criminalRows', 'D', S(c)); }
    fam('imports.criminal', 'C'); for (const x of (Array.isArray(econ.primaryImports) ? econ.primaryImports : [])) if (crimW(S(x))) add('imports.criminal', 'C', S(x));
    // ── powers
    const powers = [...recs(d?.powerStructure?.factions), ...recs(d?.factions)];
    fam('powers.criminal', 'C'); for (const f of powers) if (inP(f.faction ?? f.name) || String(f.category ?? '').toLowerCase() === 'criminal') { add('powers.criminal', 'C', String(f.faction ?? f.name)); add('powers.criminalRows', 'D', S(f)); }
    fam('powers.capture', 'C'); add('powers.capture', 'C', `criminalCaptureState:${presence(d?.powerStructure?.criminalCaptureState)}:${S(d?.powerStructure?.criminalCaptureState)}`);
    fam('powers.captureValues', 'D');
    for (const f of powers) if ('captureState' in f) { add('powers.capture', 'C', `${f.faction ?? f.name}`); add('powers.captureValues', 'D', `${f.faction ?? f.name}:${S(f.captureState)}`); }
    for (const r of recs(d?.powerStructure?.factionRelationships)) if ('captureState' in r) { add('powers.capture', 'C', S(r.pair)); add('powers.captureValues', 'D', `${S(r.pair)}:${S(r.captureState)}`); }
    fam('powers.relations', 'C'); for (const r of recs(d?.powerStructure?.factionRelationships)) if ((r.pair || []).some(inP) || crimW(r.type)) { add('powers.relations', 'C', S(r.pair)); add('powers.relationRows', 'D', S(r)); }
    fam('powers.conflicts', 'C'); for (const c of [...recs(d?.conflicts), ...recs(d?.powerStructure?.conflicts)]) if ((c.parties || []).some(inP)) add('powers.conflicts', 'C', `${S(c.parties)}|${c.issue}|${c.intensity}`);
    fam('powers.governing', 'D'); for (const k of ['governingName', 'government']) if (inP(d?.powerStructure?.[k]) || crimW(d?.powerStructure?.[k])) add('powers.governing', 'D', `${k}=${d.powerStructure[k]}`);
    fam('tensions.crime', 'C'); for (const t of recs(d?.history?.currentTensions)) if (t.type === 'crime_wave' || (t.factions || []).some((x) => inP(x) || crimW(x))) add('tensions.crime', 'C', `${t.type}|${S(t.factions)}`);
    fam('cast.criminal', 'C');
    for (const key of ['stress', 'stressors']) {
      const c = d?.[key]?.cast;
      for (const s of recs(c?.stakes)) if (inP(s.factionId) || crimW(s.reason)) add('cast.criminal', 'C', `${key}:stake:${s.factionId}|${s.reason}|${s.stake}`);
      for (const l of recs(c?.levers)) if (inH(l.institution) || crimW(l.institution)) add('cast.criminal', 'C', `${key}:lever:${l.institution}`);
    }
    fam('trace.criminal', 'C'); for (const t of recs(d?.simulationTrace)) if (/criminal|black|smuggl|thie/i.test(String(t.targetId ?? '')) || recs(t.causes).some((c) => [...H].some((h) => String(c.source ?? '').includes(h)))) { add('trace.criminal', 'C', String(t.targetId)); add('trace.criminalRows', 'D', S({ ...t, ts: undefined })); }
    // ── people (by what they point at, never by who they are)
    fam('people.goals', 'C'); fam('people.memberships', 'C'); fam('people.allegiance', 'C'); fam('people.houseTies', 'C'); fam('people.roles', 'C'); fam('people.corruptKeys', 'C');
    for (const n of recs(d?.npcs)) {
      const g = isRec(n.goal) ? n.goal : null;
      for (const k of ['short', 'long']) { const t = g?.intent?.[k]?.target?.id; if (inP(t)) add('people.goals', 'C', `${k}:${t}`); else if (g && typeof g[k] === 'string' && [...P].some((p) => p && g[k].includes(p))) add('people.goals', 'C', `${k}:text-names:${[...P].find((p) => p && g[k].includes(p))}`); }
      for (const m of recs(n.memberships)) if (inP(m.power ?? m.faction ?? m.name)) add('people.memberships', 'C', `${m.power ?? m.faction ?? m.name}`);
      if (isRec(n.allegiance)) add('people.allegiance', 'C', `${n.allegiance.power}|${n.allegiance.house}|${n.allegiance.covert}`);
      const inst = isRec(n.institution) ? n.institution : null;
      if (inst && (inH(inst.key) || inH(inst.family))) add('people.houseTies', 'C', `${inst.key}|${inst.title}`);
      if (crimW(n.role) || crimW(n.title)) add('people.roles', 'C', `${n.role}|${n.title}`);
      for (const k of ['corrupt', 'corruptionVector', 'corruptTies']) if (k in n) add('people.corruptKeys', 'C', k);
    }
    fam('ties.criminal', 'C'); for (const r of recs(d?.relationships)) if (r.covert === true || /crim|corrupt/i.test(String(r.archetypeKey ?? '')) || /corrupt/i.test(String(r.typeName ?? '')) || crimW(r.npc1Role) || crimW(r.npc2Role)) add('ties.criminal', 'C', `${r.typeName}|${r.archetypeKey}|${r.covert}`);
    fam('conditions.criminal', 'C'); for (const c of recs(d?.activeConditions)) if (crimW(c.archetype) || crimW(c.label)) add('conditions.criminal', 'C', `${c.archetype}|${c.label}`);
    // ── prose rungs (R5's copies, compared here as the page draws them): the criminal rungs, and any rung with a criminal word
    fam('prose.criminal', 'D');
    const blocks = isRec(d?.publicProse?.blocks) ? d.publicProse.blocks : {};
    const RUNG = /^(criminal|criminalLine|incomeMix|captureReading|gmAdvisory|legitimacyReading|operationReading)$/;
    for (const site of Object.keys(blocks).sort()) {
      const b = blocks[site]; if (!isRec(b)) continue;
      for (const rung of Object.keys(b).sort()) { const v = S(b[rung]); if (RUNG.test(rung) || CRIM_RE.test(v)) add('prose.criminal', 'D', `${site}.${rung}=${v}`); }
    }
    // ── the derived labels the page computes from the served document (pageRederive first, as the page does)
    for (const [k, v] of Object.entries(labelsOf(d))) add(`label.${k}`, 'D', v);
    for (const f of Object.values(F)) f.items.sort();
    return F;
  };
}

/** Multiset difference a - b. */
export function minus(a, b) {
  const m = new Map(); for (const x of b) m.set(x, (m.get(x) || 0) + 1);
  const out = []; for (const x of a) { const k = m.get(x) || 0; if (k) m.set(x, k - 1); else out.push(x); }
  return out;
}
/** Per family: the items `a` has that `b` lacks (aExtra) and the reverse (bExtra); only families that differ. */
export function compare(a, b) {
  const out = {};
  for (const f of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[f]?.items || []; const y = b[f]?.items || [];
    const aExtra = minus(x, y); const bExtra = minus(y, x);
    if (aExtra.length || bExtra.length) out[f] = { kind: (a[f] || b[f]).kind, aExtra, bExtra };
  }
  return out;
}
