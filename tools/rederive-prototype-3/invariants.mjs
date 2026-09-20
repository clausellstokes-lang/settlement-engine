/**
 * invariants.mjs — Q5's instrument. Every check must hold on 63/63 PLAIN records before it is
 * allowed to convict a merged one. Two families:
 *   EXACT   — arithmetic / count / prose-count / referential relations inside one record
 *   BAND    — a label beside a score, judged by a SANDWICH test against observations
 *             (s1 < x < s2 with l1 === l2 !== label ⇒ contradiction; sound under monotonicity)
 */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const arr = (v) => (Array.isArray(v) ? v : null);

export const EXACT = [
  ['V-DEPCOUNT  metrics.dependencyCount = dependencies.length', (s) => {
    const m = s.economicViability?.metrics; const d = arr(s.economicViability?.dependencies);
    if (!m || !d || num(m.dependencyCount) === null) return null;
    return m.dependencyCount === d.length ? true : `dependencyCount=${m.dependencyCount} but dependencies.length=${d.length}`;
  }],
  ['V-WARNCOUNT metrics.warningCount = warnings.length', (s) => {
    const m = s.economicViability?.metrics; const w = arr(s.economicViability?.warnings);
    if (!m || !w || num(m.warningCount) === null) return null;
    return m.warningCount === w.length ? true : `warningCount=${m.warningCount} but warnings.length=${w.length}`;
  }],
  // V-ISSUECOUNT was REJECTED by its own control: `criticalIssueCount` != issues.length on 6/63
  // plain records (it counts only the CRITICAL ones), so it is not an invariant and cannot convict.
  ['V-SUMMARY-DEPS summary prose "N operational dependencies" = dependencies.length', (s) => {
    const t = s.economicViability?.summary; const d = arr(s.economicViability?.dependencies);
    if (typeof t !== 'string' || !d) return null;
    const m = t.match(/(\d+)\s+operational dependenc/); if (!m) return null;
    return Number(m[1]) === d.length ? true : `summary says ${m[1]} operational dependencies but dependencies.length=${d.length}`;
  }],
  ['V-SUMMARY-HOOKS summary prose "N plot hooks" = plotHooks.length', (s) => {
    const t = s.economicViability?.summary; const p = arr(s.economicViability?.plotHooks);
    if (typeof t !== 'string' || !p) return null;
    const m = t.match(/(\d+)\s+plot hooks?\s+available/); if (!m) return null;
    return Number(m[1]) === p.length ? true : `summary says ${m[1]} plot hooks but plotHooks.length=${p.length}`;
  }],
  ['V-FOOD-RAW foodBalance.rawDeficit = dailyNeed - dailyProduction', (s) => {
    const f = s.economicViability?.metrics?.foodBalance; if (!f) return null;
    if ([f.rawDeficit, f.dailyNeed, f.dailyProduction].some(v => num(v) === null)) return null;
    const want = Math.max(0, f.dailyNeed - f.dailyProduction);
    return Math.abs(want - f.rawDeficit) <= 1 ? true : `rawDeficit=${f.rawDeficit} but dailyNeed-dailyProduction=${f.dailyNeed - f.dailyProduction}`;
  }],
  ['V-FOOD-DEF foodBalance.deficit = rawDeficit - importCoverage - magicFoodOffset', (s) => {
    const f = s.economicViability?.metrics?.foodBalance; if (!f) return null;
    if ([f.deficit, f.rawDeficit, f.importCoverage, f.magicFoodOffset].some(v => num(v) === null)) return null;
    const want = Math.max(0, f.rawDeficit - f.importCoverage - f.magicFoodOffset);
    return Math.abs(want - f.deficit) <= 1 ? true : `deficit=${f.deficit} but rawDeficit-import-magic=${want}`;
  }],
  ['V-FOOD-PCT foodBalance.deficitPercent = round(deficit/dailyNeed*100)', (s) => {
    const f = s.economicViability?.metrics?.foodBalance; if (!f) return null;
    if ([f.deficitPercent, f.deficit, f.dailyNeed].some(v => num(v) === null) || !f.dailyNeed) return null;
    const want = Math.round((f.deficit / f.dailyNeed) * 100);
    return Math.abs(want - f.deficitPercent) <= 1 ? true : `deficitPercent=${f.deficitPercent} but round(deficit/need*100)=${want}`;
  }],
  ['V-INCOME-100 sum(incomeSources[].percentage) = 100', (s) => {
    const a = arr(s.economicState?.incomeSources); if (!a || !a.length) return null;
    const sum = a.reduce((x, y) => x + (num(y?.percentage) ?? 0), 0);
    return Math.abs(sum - 100) <= 1 ? true : `income percentages sum to ${sum}, not 100`;
  }],
  ['V-POWER-100 sum(powerStructure.factions[].power) = 100', (s) => {
    const a = arr(s.powerStructure?.factions); if (!a || !a.length) return null;
    const sum = a.reduce((x, y) => x + (num(y?.power) ?? 0), 0);
    return Math.abs(sum - 100) <= 1 ? true : `faction power shares sum to ${sum}, not 100`;
  }],
  ['V-LEGIT-SUM publicLegitimacy.score = 50 + sum(breakdown)', (s) => {
    const l = s.powerStructure?.publicLegitimacy; if (!l || num(l.score) === null || !l.breakdown) return null;
    const sum = Object.values(l.breakdown).reduce((x, y) => x + (num(y) ?? 0), 0);
    return Math.abs(50 + sum - l.score) <= 1 ? true : `legitimacy score=${l.score} but 50+breakdown=${50 + sum}`;
  }],
  ['V-LEGIT-FLAGS the is<Band> flag agrees with the label', (s) => {
    const l = s.powerStructure?.publicLegitimacy; if (!l || typeof l.label !== 'string') return null;
    const key = `is${l.label.replace(/[^A-Za-z]/g, '')}`;
    if (l[key] === undefined) return null;
    return l[key] === true ? true : `label="${l.label}" but ${key}=${l[key]}`;
  }],
  ['V-EVIDENCE-ROSTER judgment evidence "N NPCs / M relationships"', (s) => {
    const js = arr(s.generationCoherenceReceipt?.judgments); if (!js) return null;
    for (const j of js) for (const e of (j.evidence || [])) {
      const m = String(e?.evidence || '').match(/^(\d+) NPCs \/ (\d+) relationships$/);
      if (!m) continue;
      const n = arr(s.npcs)?.length ?? -1; const r = arr(s.relationships)?.length ?? -1;
      if (Number(m[1]) !== n || Number(m[2]) !== r) return `receipt says "${m[0]}" but the record holds ${n} NPCs / ${r} relationships`;
    }
    return true;
  }],
  ['V-EVIDENCE-EVENTS judgment evidence "N historical events"', (s) => {
    const js = arr(s.generationCoherenceReceipt?.judgments); if (!js) return null;
    for (const j of js) for (const e of (j.evidence || [])) {
      const m = String(e?.evidence || '').match(/^(\d+) historical events$/);
      if (!m) continue;
      const n = arr(s.history?.historicalEvents)?.length ?? -1;
      if (Number(m[1]) !== n) return `receipt says "${m[0]}" but history.historicalEvents.length=${n}`;
    }
    return true;
  }],
  ['V-EVIDENCE-TENSION judgment evidence history.currentTensions[i] names that tension', (s) => {
    const js = arr(s.generationCoherenceReceipt?.judgments); if (!js) return null;
    for (const j of js) for (const e of (j.evidence || [])) {
      const m = String(e?.path || '').match(/^history\.currentTensions\[(\d+)\]$/);
      if (!m) continue;
      const t = arr(s.history?.currentTensions)?.[Number(m[1])];
      if (!t) return `receipt cites history.currentTensions[${m[1]}] but the record has ${arr(s.history?.currentTensions)?.length ?? 0}`;
      if (t.type !== e.evidence) return `receipt cites currentTensions[${m[1]}]="${e.evidence}" but the record's is "${t.type}"`;
    }
    return true;
  }],
  ['V-EVIDENCE-STRESS judgment evidence stress[0] names the record stress', (s) => {
    const js = arr(s.generationCoherenceReceipt?.judgments); if (!js) return null;
    for (const j of js) for (const e of (j.evidence || [])) {
      if (e?.path !== 'stress[0]') continue;
      if (e.evidence !== s.stress?.label) return `receipt cites stress[0]="${e.evidence}" but the record's stress is "${s.stress?.label}"`;
    }
    return true;
  }],
  ['V-EVIDENCE-CONFLICT judgment evidence conflicts[i] exists', (s) => {
    const js = arr(s.generationCoherenceReceipt?.judgments); if (!js) return null;
    for (const j of js) for (const e of (j.evidence || [])) {
      const m = String(e?.path || '').match(/^conflicts\[(\d+)\]$/); if (!m) continue;
      if (!arr(s.conflicts)?.[Number(m[1])]) return `receipt cites conflicts[${m[1]}] but the record holds ${arr(s.conflicts)?.length ?? 0}`;
    }
    return true;
  }],
  ['V-FOODSEC-FLAGS the is<Band>/has<Band> flag vector agrees with foodSecurity.label', (s) => {
    const f = s.economicState?.foodSecurity; if (!f || typeof f.label !== 'string') return null;
    const FV = { Secure: 'isSecure', Pressured: 'isPressured', Deficit: 'isDeficit', Surplus: 'isSurplus' };
    const want = FV[f.label]; if (!want || f[want] === undefined) return null;
    if (f[want] !== true) return `foodSecurity.label="${f.label}" but ${want}=${f[want]}`;
    for (const [lbl, k] of Object.entries(FV)) if (lbl !== f.label && f[k] === true) return `foodSecurity.label="${f.label}" but ${k}=true as well`;
    return true;
  }],
  ['V-FOODSEC-CHAINS activeChainsCount = activeChains.length = the true entries of chains', (s) => {
    const f = s.economicState?.foodSecurity; if (!f || !Array.isArray(f.activeChains) || !f.chains) return null;
    if (f.activeChainsCount !== f.activeChains.length) return `activeChainsCount=${f.activeChainsCount} but activeChains.length=${f.activeChains.length}`;
    const t = Object.entries(f.chains).filter(([, v]) => v === true).map(([k]) => k);
    if (JSON.stringify(t.slice().sort()) !== JSON.stringify(f.activeChains.slice().sort())) return `chains true=${JSON.stringify(t)} but activeChains=${JSON.stringify(f.activeChains)}`;
    return true;
  }],
  ['V-FOODSEC-RAW foodSecurity.rawDeficit = dailyNeed - dailyProduction', (s) => {
    const f = s.economicState?.foodSecurity; if (!f) return null;
    if ([f.rawDeficit, f.dailyNeed, f.dailyProduction].some(v => num(v) === null)) return null;
    const want = Math.max(0, f.dailyNeed - f.dailyProduction);
    return Math.abs(want - f.rawDeficit) <= 1 ? true : `foodSecurity.rawDeficit=${f.rawDeficit} but need-production=${want}`;
  }],
  ['V-FOODSEC-DEF foodSecurity.deficit = rawDeficit - importCoverage - magicOffset', (s) => {
    const f = s.economicState?.foodSecurity; if (!f) return null;
    if ([f.deficit, f.rawDeficit, f.importCoverage, f.magicOffset].some(v => num(v) === null)) return null;
    const want = Math.max(0, f.rawDeficit - f.importCoverage - f.magicOffset);
    return Math.abs(want - f.deficit) <= 1 ? true : `foodSecurity.deficit=${f.deficit} but rawDeficit-import-magic=${want}`;
  }],
  ['V-FOODSEC-PCT foodSecurity.deficitPct = round(deficit/dailyNeed*100)', (s) => {
    const f = s.economicState?.foodSecurity; if (!f) return null;
    if ([f.deficitPct, f.deficit, f.dailyNeed].some(v => num(v) === null) || !f.dailyNeed) return null;
    const want = Math.round((f.deficit / f.dailyNeed) * 100);
    return Math.abs(want - f.deficitPct) <= 1 ? true : `foodSecurity.deficitPct=${f.deficitPct} but round(deficit/need*100)=${want}`;
  }],
  // V-FOODSEC-RATIO REJECTED by its own control (foodRatio counts imports and magic, not just
  // local production): it fails on plain thorps and hamlets, so it may not convict.
  ['V-ISOLATION deficit = max(0, requiredCapacity - capacity)', (s) => {
    const i = s.isolationSupport; if (!i || [i.deficit, i.requiredCapacity, i.capacity].some(v => num(v) === null)) return null;
    const want = Math.max(0, i.requiredCapacity - i.capacity);
    return want === i.deficit ? true : `isolation deficit=${i.deficit} but required-capacity=${want}`;
  }],
  ['V-GOVERNING exactly one isGoverning, and governingName names it', (s) => {
    const a = arr(s.powerStructure?.factions); if (!a || !a.length) return null;
    const g = a.filter(f => f?.isGoverning);
    if (g.length !== 1) return `${g.length} factions carry isGoverning`;
    const nm = s.powerStructure?.governingName;
    if (nm && g[0].faction !== nm && g[0].name !== nm) return `governingName="${nm}" but the isGoverning faction is "${g[0].faction}"`;
    return true;
  }],
  ['V-STRESS-NAME stress.summary speaks the settlement\'s name', (s) => {
    if (typeof s.stress?.summary !== 'string' || typeof s.name !== 'string') return null;
    if (!s.stress.summary.includes(s.name)) return null; // not every stressor names the town
    return true;
  }],
  ['V-DEFENSE-INST defenseProfile.institutions[].name ⊆ institutions[].name', (s) => {
    const names = new Set((arr(s.institutions) || []).map(i => i?.name));
    const groups = s.defenseProfile?.institutions; if (!groups) return null;
    for (const [g, list] of Object.entries(groups)) for (const e of (arr(list) || [])) {
      if (e?.name && !names.has(e.name)) return `defenseProfile.institutions.${g}[] names "${e.name}", absent from the roster`;
    }
    return true;
  }],
];

/** (scorePath, labelPath) pairs judged by the sandwich test. */
export const BANDS = [
  ['defenseProfile.readiness.score', 'defenseProfile.readiness.label'],
  ['powerStructure.publicLegitimacy.score', 'powerStructure.publicLegitimacy.label'],
  ['economicState.foodSecurity.deficitPct', 'economicState.foodSecurity.label'],
  ['economicViability.metrics.foodBalance.deficitPercent', 'economicState.foodSecurity.label'],
  ['activeConditions[0].severity', 'activeConditions[0].severityBand'],
];

export const at = (root, p) => {
  let cur = root;
  for (const seg of String(p).split('.')) {
    if (cur === undefined || cur === null) return undefined;
    const m = seg.match(/^([^[]*)((\[\d+\])*)$/); if (!m) return undefined;
    if (m[1]) cur = cur[m[1]];
    for (const idx of (m[2] || '').matchAll(/\[(\d+)\]/g)) { if (cur === undefined || cur === null) return undefined; cur = cur[Number(idx[1])]; }
  }
  return cur;
};

export function observeBands(records, obs = new Map()) {
  for (const [sp, lp] of BANDS) {
    const key = `${sp}|${lp}`;
    if (!obs.has(key)) obs.set(key, []);
    for (const r of records) {
      const s = at(r, sp); const l = at(r, lp);
      if (typeof s === 'number' && typeof l === 'string') obs.get(key).push([s, l]);
    }
  }
  return obs;
}

export function checkBands(rec, obs) {
  const bad = [];
  for (const [sp, lp] of BANDS) {
    const key = `${sp}|${lp}`;
    const s = at(rec, sp); const l = at(rec, lp);
    if (typeof s !== 'number' || typeof l !== 'string') continue;
    const o = obs.get(key) || [];
    const below = o.filter(([x]) => x < s); const above = o.filter(([x]) => x > s);
    for (const [x1, l1] of below) for (const [x2, l2] of above) {
      if (l1 === l2 && l1 !== l) { bad.push(`${lp}="${l}" at ${sp}=${s}, but ${x1}→"${l1}" and ${x2}→"${l2}" bracket it`); break; }
    }
  }
  return bad;
}

export function checkExact(rec) {
  const bad = [];
  for (const [name, fn] of EXACT) {
    let v; try { v = fn(rec); } catch (e) { v = `threw ${e.message}`; }
    if (v !== true && v !== null) bad.push(`${name.split(' ')[0]}: ${v}`);
  }
  return bad;
}

/** LEARNED: (object, labelField, flagFields) — label ⇒ flag vector must be a FUNCTION over the
 *  corpus; a merged record whose flag vector is not the one its label carries is convicted. */
export const FLAGSETS = [
  ['economicState.foodSecurity', 'label', ['isDeficit', 'isPressured', 'isSecure', 'isSurplus']],
  ['powerStructure.publicLegitimacy', 'label', ['isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis']],
];
export function observeFlags(records, obs = new Map()) {
  for (const [op, lf, ff] of FLAGSETS) {
    const key = op; if (!obs.has(key)) obs.set(key, new Map());
    for (const r of records) {
      const o = at(r, op); if (!o || typeof o[lf] !== 'string') continue;
      const vec = JSON.stringify(ff.map(f => o[f]));
      const m = obs.get(key); if (!m.has(o[lf])) m.set(o[lf], new Set());
      m.get(o[lf]).add(vec);
    }
  }
  return obs;
}
export function checkFlags(rec, obs) {
  // Sound per-FLAG form: a flag that is NEVER true beside a label anywhere in the corpus may not
  // be true beside it in a merged record. (The whole-vector form is refused where the corpus shows
  // more than one vector for a label — `Import-Dependent` carries two, 22 and 1.)
  const bad = [];
  for (const [op, lf, ff] of FLAGSETS) {
    const o = at(rec, op); if (!o || typeof o[lf] !== 'string') continue;
    const seen = obs.get(op)?.get(o[lf]); if (!seen || !seen.size) continue;
    const vecs = [...seen].map(v => JSON.parse(v));
    ff.forEach((f, i) => {
      if (o[f] !== true) return;
      if (vecs.some(v => v[i] === true)) return;
      bad.push(`FLAGVEC ${op}.${lf}="${o[lf]}" but ${f}=true, which no record with that label carries (${seen.size} observed vector(s))`);
    });
  }
  return bad;
}
