/**
 * rosterChoiceCounterfactual.pglite.test.js — THE BORN COUNTERFACTUAL TEST (VR4 G2; SUB-BRIEF-VR7 design point 5, R6;
 * docs/chair/2026-11-20/veil/briefs/R6-BRIEF.md), THROUGH THE SERVER (VR15), the client twin beside it.
 *
 * THE CLAIM IT TESTS: the roster-choice registry (src/domain/veil/rosterChoiceRegistry.js) says, path by path, what the
 * veil does where a house the DM hid whole could have chosen a served value. For every row it marks BUILT:
 *   (a) a `recompose` row's served value EQUALS the served town's wording: what the engine writes for the town WITHOUT
 *       the hidden house (the counterfactual birth below, read through the same veil);
 *   (b) a `withhold` row's value is ABSENT: a `when: 'always'` row from every non-owner read whatever the veil (the
 *       town, its counterfactual, a share hiding nothing); a `when: 'house-hidden'` row carries, on the served town,
 *       nothing its counterfactual does not (the hidden house's part absent; an entry-wise row keeps what is left).
 * The rows are read from REGISTRY_ROWS (`built: true` only), never a hand list: the test grows as R2 to R5 build rows.
 * `diffuse` and `rng` rows are rulings, not builds: the diffuse rows are judged by THE INVERSION arm below (VR26, VR32,
 * split by VR28's tiers), the rng rows by VR13 (history drawn again by the rng alone tells nothing).
 *
 * THE COUNTERFACTUAL (the reader's differ, REVIEW-VEIL-9 differ.probe.jsx, its births and its path normalisation):
 * three births on ONE seed by the tree's own pipeline:
 *   A  the town as born;
 *   B  the same town with every hideable house (cardVeil.js :: isHideableHouse, the class the default veil hides whole)
 *      taken out of the roster after EVERY step, so nothing downstream sees one;
 *   C  the CONTROL birth: as many ordinary houses (not required, not hideable; a fixed order) taken out the same way.
 * Each is stored on a pglite chain of every migration on disk and read as anon (get_gallery_dossier; the party link
 * get_unlisted_dossier for A) under two veils, the DEFAULT and EVERY EYE SHUT (each town's own addresses), Reveal DM off
 * and on; the twin (galleryVeil.js :: galleryPayloadFor then projectShareVeil) reads the same rows. A path where A and
 * B differ is the counterfactual's evidence; where A and C differ at the same path WITH THE SAME A VALUE, removing ANY
 * house moves it (a re-roll, the gate's C rate per value): such a difference is EXCUSED and counted, never silent.
 *
 * THE ARMS:
 *   CONTROL  a share hiding nothing (every default eye opened): the hideable houses are SENT there and withheld under
 *            the default veil (the MAIN arm's premise), and NOTHING MOVES: every built house-hidden row's served value
 *            equals the town's unveiled projection (references read by kind, not by id: R4 re-keys ids per read),
 *            and every built withhold-always row is absent there too.
 *   RED      the judges have teeth: a value of a (b) row planted into the served town is caught (an always row and a
 *            house-hidden row), and an (a) row's value moved off its counterfactual is caught, each beside its clean
 *            twin that passes; where no row of the kind is built yet, a registered row of that kind stands in.
 *            The inversion judge catches a served figure moved by hand.
 *   MAIN     every built (a) and (b) row holds on every town, veil, Reveal setting, read (gallery, link) and engine.
 *            What MAIN cannot yet judge is NAMED in the report: every unbuilt withhold/recompose row (and what it would
 *            do if built today), and every built row no town reaches.
 *   INVERSION  VR26 as VR32 defines it: a diffuse row's served value against its re-derivation by the engine's own
 *            functions from the SERVED values AS SERVED, bands included (a figure that equals it passes); a row that
 *            differs only on the veiled read (never on the same town's read hiding nothing) INVERTS. VR28's tiers: a
 *            tier-1 row (a precise figure, a name, a crime-worded label) inverting is BLOCKING, exactly KNOWN_TIER1
 *            (shrink-only); a tier-2 band (and a sentence chosen by one) is RECORDED with its count.
 * NOT REACHED HERE (named): master's stored shape (RV9_GEN), the hand veil, the campaign map, the import send; the
 * reader's gate on the full differ is the seat's (SUB-BRIEF-VR7 R6).
 * The report (env R6_OUT, a directory): counterfactual.json.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { bootChain, storeShare, withhold, graft, BIRTH_DIALS } from './veilChain.shared.mjs';

const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const ARM_TIMEOUT_MS = 600_000;
const OUT = process.env.R6_OUT || null;
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
/** The births (size, crisis); a birth with no hideable house serves the inversion arm only. */
const BIRTHS = [['town', 'infiltrated'], ['city', null], ['metropolis', null], ['city', 'insurgency'], ['town', null], ['metropolis', 'indebted'], ['village', null], ['city', 'famine']];
const VEILS = ['default', 'shut'];

/** VR28 TIER 2, the closed list (a coarse band from a closed ordered vocabulary, sent as stored), by registry id. A
 * composed row whose every input is tier 2 is "a sentence chosen by one of them" (derived from its `inputs`). */
const TIER2_BANDS = Object.freeze(new Set(['economy.prosperity', 'economy.prosperityStanding', 'safety.safetyLabel', 'defence.readiness.label',
  'defence.readiness.colours', 'power.stability', 'tile.stability', 'conditions.severityBand', 'tile.prosperity']));
/** The diffuse rows THE INVERSION re-derives by an engine function (the prose rows by their path, composePublicProse). */
const DERIVED = new Set(['defence.readiness.label', 'defence.readiness.colours', 'defence.scores.disaster', 'defence.scores.economic',
  'defence.scores.internal', 'defence.scores.magical', 'defence.scores.military', 'defence.scores.monster', 'defence.economicGates',
  'economy.prosperity', 'economy.prosperityStanding', 'safety.safetyLabel', 'legitimacy.label', 'legitimacy.score', 'legitimacy.colours']);
/** MEASURED at the R6 base (0d28ccf19, 2026-11-20; 8 births x Reveal DM off and on, the default veil against the same
 * town's share hiding nothing): the TIER-1 diffuse rows whose re-derivation from the served values as served differs
 * ONLY on the veiled read. BLOCKING, shrink-only: each is withheld (R2, VR33) or re-classed under VR19 by its stage. */
const KNOWN_TIER1 = Object.freeze(new Set(['defence.scores.internal']));

// ── the reader's differ (REVIEW-VEIL-9 differ.probe.jsx :: diff, its normalised paths): arrays of records keyed by
//    their first identifying key, arrays of scalars as sets, everything else by position. ONE CHANGE, toward catching:
//    where one side lacks a record or an array the other holds, the parent's difference is kept AND the walk descends
//    against an empty one, so a leaf (or an entry, `x[] (only in A)`) a row names is seen under its own path too.
const KEYS = ['id', 'name', 'faction', 'chainId', 'source', 'type', 'label', 'title'];
const keyOf = (o) => { for (const k of KEYS) if (typeof o[k] === 'string' && o[k]) return `${k}=${o[k]}`; return null; };
const strip = (s) => (typeof s === 'string' ? s.replace(/\s*vq6n[0-9]+z/gi, '') : s);
function diff(a, b, p = '', out = []) {
  if ((Array.isArray(a) || isRec(a)) && b == null) { out.push([p, a, b]); return diff(a, Array.isArray(a) ? [] : {}, p, out); }
  if ((Array.isArray(b) || isRec(b)) && a == null) { out.push([p, a, b]); return diff(Array.isArray(b) ? [] : {}, b, p, out); }
  if (Array.isArray(a) && Array.isArray(b)) {
    const recs = [...a, ...b].every(isRec) && [...a, ...b].every((o) => keyOf(o));
    if (recs) {
      const ma = new Map(a.map((o) => [keyOf(o), o])); const mb = new Map(b.map((o) => [keyOf(o), o]));
      for (const [k, o] of ma) if (mb.has(k)) diff(o, mb.get(k), `${p}[]`, out); else out.push([`${p}[] (only in A)`, k, '']);
      for (const [k] of mb) if (!ma.has(k)) out.push([`${p}[] (only in B)`, '', k]);
      return out;
    }
    if ([...a, ...b].every((x) => typeof x !== 'object' || x === null)) {
      const sa = new Set(a.map(strip)); const sb = new Set(b.map(strip));
      for (const x of sa) if (!sb.has(x)) out.push([`${p}[] (only in A)`, x, '']);
      for (const x of sb) if (!sa.has(x)) out.push([`${p}[] (only in B)`, '', x]);
      return out;
    }
    const n = Math.max(a.length, b.length); for (let i = 0; i < n; i += 1) diff(a[i], b[i], `${p}[]`, out);
    return out;
  }
  if (isRec(a) && isRec(b)) { for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[k], b[k], p ? `${p}.${k}` : k, out); return out; }
  if (strip(a) !== strip(b) && !(a === undefined && b === undefined)) out.push([p, a, b]);
  return out;
}

/** Every leaf (or whole value at an array path) whose differ-normalised path the regex matches, keyed by its indexed path. */
function valuesAt(doc, re) {
  const out = new Map();
  const walk = (v, norm, exact) => {
    if (norm && (re.test(norm) || re.test(`${norm} (only in A)`))) { out.set(exact, JSON.stringify(v)); return; }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${norm}[]`, `${exact}[${i}]`));
    else if (isRec(v)) for (const k of Object.keys(v)) walk(v[k], norm ? `${norm}.${k}` : k, exact ? `${exact}.${k}` : k);
  };
  walk(doc, '', '');
  return out;
}
const sameAt = (a, b, re) => { const x = valuesAt(a, re); const y = valuesAt(b, re); return x.size === y.size && [...x].every(([k, v]) => y.get(k) === v); };
/** A person reference read by kind, not by value (R4, VR10: every id is re-keyed per read). */
const REF_KEYS = new Set(['id', 'from', 'to', 'npc1Id', 'npc2Id', 'holderId', 'targetId', 'handler']);
const unkeyed = (v) => JSON.parse(JSON.stringify(v, (k, x) => (REF_KEYS.has(k) && typeof x === 'string' ? '<ref>' : x)));
const short = (v) => (v === undefined ? 'undefined' : JSON.stringify(v)?.slice(0, 140));

/**
 * THE JUDGE: the failures of one built row on one read. `view` holds the served town `a`, its counterfactual `b`, the
 * A/B differ `dAB`, the A/C differ's (path, A value) pairs `excuse`. Returns { fails, excused }.
 */
function judge(row, view) {
  const re = new RegExp(row.path);
  const fails = []; let excused = 0;
  if (row.rule === 'withhold' && row.when === 'always') {
    for (const [doc, which] of [[view.a, 'A'], [view.b, 'B']]) for (const [p, v] of valuesAt(doc, re)) fails.push(`${which} carries ${p} = ${v.slice(0, 140)}`);
    return { fails, excused };
  }
  for (const [p, av, bv] of view.dAB) {
    if (!re.test(p)) continue;
    // (b) house-hidden: the served town carries nothing its counterfactual does not; (a): no difference at all
    if (row.rule === 'withhold' && (av === undefined || av === '')) continue;
    if (view.excuse.has(`${p}\u0000${JSON.stringify(strip(av))}`)) { excused += 1; continue; }
    fails.push(`${p}: A=${short(av)} | counterfactual=${short(bv)}`);
  }
  return { fails, excused };
}
/** A view with no re-roll excuse (the RED arm judges the judge itself). */
const strictView = (a, b) => ({ a, b, dAB: diff(a, b), excuse: new Set() });
const viewOf = (a, b, c) => ({
  a, b,
  dAB: diff(a, b),
  excuse: new Set(diff(a, c).map(([p, av]) => `${p}\u0000${JSON.stringify(strip(av))}`)),
});

describe('VR4 G2: every built registry row holds on born towns against their counterfactual (through the server, the twin beside it)', () => {
  let rows;
  let towns;
  let revisit;
  let lib;

  beforeAll(async () => {
    const db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { REGISTRY_ROWS } = await import('../../src/domain/veil/rosterChoiceRegistry.js');
    const { servedProsperityOutcomes } = await import('../../src/domain/veil/importRederive.js');
    const { computeBaseProsperity, standingBaseProsperity, deriveProsperityLabels } = await import('../../src/generators/economy/prosperity.js');
    const { generateDefenseProfile } = await import('../../src/generators/defenseGenerator.js');
    const { keepOfRecord } = await import('../../src/domain/facts/keep.js');
    const { generateSafetyProfile } = await import('../../src/generators/safetyProfile.js');
    const { computePublicLegitimacy } = await import('../../src/generators/factionDynamics.js');
    await loadGenerationLawPayloads();
    rows = REGISTRY_ROWS;
    lib = { isHideableHouse };

    /** VR32: each diffuse value re-derived from the SERVED document AS SERVED (bands included), one deriver at a time,
     * none fed another's re-derivation. Null where the served prosperity took a birth draw (Subsistence). */
    revisit = (doc) => {
      const s = clone(doc); const r = clone(doc);
      const cfg = s.config; const inst = s.institutions || []; const e = s.economicState;
      if (!isRec(cfg) || !isRec(e)) return null;
      const outcomes = servedProsperityOutcomes(s, cfg);
      if (outcomes.length !== 1) return null;
      const names = inst.map((i) => i?.name);
      const base = computeBaseProsperity(s.tier, cfg.tradeRouteAccess, inst, cfg, names, e.incomeSources || [], e.foodSecurity || null).label;
      const standing = standingBaseProsperity(s.tier, cfg.tradeRouteAccess, inst, cfg, names, e.incomeSources || []);
      r.economicState.prosperity = outcomes[0];
      r.economicState.prosperityStanding = deriveProsperityLabels(base, standing, cfg, inst).prosperityStanding;
      const dp = generateDefenseProfile(clone(s), keepOfRecord(clone(e)));
      r.defenseProfile = { ...(r.defenseProfile || {}), scores: dp.scores, readiness: dp.readiness, economicGates: dp.economicGates };
      if (isRec(r.economicState.safetyProfile)) r.economicState.safetyProfile.safetyLabel = generateSafetyProfile(cfg, s.tier, inst).safetyLabel;
      if (isRec(r.powerStructure?.publicLegitimacy)) {
        const pl = computePublicLegitimacy(clone(e), s.defenseProfile?.readiness?.label, s.tier);
        Object.assign(r.powerStructure.publicLegitimacy, { score: pl.score, label: pl.label, color: pl.color, bg: pl.bg });
      }
      r.publicProse = composePublicProse(clone(s));
      return r;
    };

    const shutEyes = (pub) => {
      const m = veil.curateModelFor(pub, []);
      return m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
        ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address), ...(c.kind === 'npc' ? [`card:npc:${c.id}`] : [])])]);
    };
    const overridesFor = (doc, kind, dm) => {
      if (kind === 'default') return veil.writeShareVeil({}, []);
      const pub = veil.galleryPayloadFor(doc, { shareDm: dm, memberOverrides: {} });
      if (kind === 'shut') return veil.writeShareVeil({}, shutEyes(pub).map((address) => ({ address, hidden: true })));
      // 'open': a share hiding nothing (every default eye opened)
      return veil.writeShareVeil({}, veil.defaultVeilFor(pub).map((d) => ({ address: d.address, hidden: false })));
    };
    let n = 0;
    /** Store one document under one veil and read it back through the server (gallery and link) and the twin. */
    const read = async (doc, kind, dm) => {
      n += 1; const slug = `r6c${n}`;
      const ov = overridesFor(doc, kind, dm);
      await storeShare(db, { town: doc, slug, overrides: ov, shareDm: dm });
      const row = (await db.query('select to_jsonb(g) as r from public.get_gallery_dossier($1) g', [slug])).rows[0]?.r;
      const server = row?.data ?? null;
      // the columns beside data (VEIL-DOORS's tile.* and chronicle rows), read where the server sends them
      if (isRec(server)) {
        const tile = Object.fromEntries(['stability', 'threat_level', 'government_type'].filter((k) => row[k] != null).map((k) => [k, row[k]]));
        if (Object.keys(tile).length) server.tile = tile;
        if (row.chronicle != null) server.chronicle = row.chronicle;
      }
      const link = dm ? null : (await db.query('select public.get_unlisted_dossier($1) as r', [`${slug}-link`])).rows[0]?.r?.dossier ?? null;
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(doc, { shareDm: dm, memberOverrides: ov }), ov);
      return { server, link, twin };
    };

    const birth = (cfg, seed, drop) => {
      const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
      let t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {}, onStep: drop ? (_name, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
      if (drop) cut(t.institutions);
      t = { ...t }; delete t.publicProse; t = withPublicProse(t, composePublicProse(t));
      return clone(t); // the STORED shape: a row is JSON
    };

    towns = [];
    for (const [i, [size, crisis]] of BIRTHS.entries()) {
      const seed = `r6-counterfactual-${size}-${crisis || 'calm'}-${i}`;
      const cfg = { ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
      const A = birth(cfg, seed, null);
      const H = (A.institutions || []).filter((h) => isHideableHouse(h));
      const t = { seed: `${size}-${crisis || 'calm'}-${i}`, stored: A, hideable: H.map((h) => h.name), reads: [] };
      if (H.length) {
        const ordinary = (A.institutions || []).filter((h) => isRec(h) && !isHideableHouse(h) && !h.required).map((h) => h.name)
          .sort((x, y) => (x.length * 7919 + x.charCodeAt(0)) % 101 - (y.length * 7919 + y.charCodeAt(0)) % 101);
        const cNames = new Set(ordinary.slice(0, H.length));
        t.B = birth(cfg, seed, (h) => isHideableHouse(h));
        t.C = birth(cfg, seed, (h) => isRec(h) && cNames.has(h.name));
        t.control = [...cNames];
        for (const dm of [false, true]) for (const kind of VEILS) {
          t.reads.push({ veil: `${kind}${dm ? ' +DM' : ''}`, dm, kind, A: await read(A, kind, dm), B: await read(t.B, kind, dm), C: await read(t.C, kind, dm) });
        }
      }
      t.open = {};
      t.veiled = {};
      for (const dm of [false, true]) {
        t.open[String(dm)] = await read(A, 'open', dm);
        t.veiled[String(dm)] = t.reads.find((r) => r.kind === 'default' && r.dm === dm)?.A ?? await read(A, 'default', dm);
        t[`unveiled${dm ? 'Dm' : ''}`] = veil.galleryPayloadFor(A, { shareDm: dm, memberOverrides: {} });
      }
      towns.push(t);
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  const built = () => rows.filter((r) => r.built && (r.rule === 'withhold' || r.rule === 'recompose'));
  /** A row can be judged on a town only where the born town (or its counterfactual) holds the field at all. */
  const bornCarries = (t, row) => valuesAt(t.stored, new RegExp(row.path)).size > 0 || valuesAt(t.B, new RegExp(row.path)).size > 0;
  const counterfactualTowns = () => towns.filter((t) => t.reads.length);
  /** Every (town, read, engine) view of the counterfactual: the gallery read of both engines, the link of the server. */
  const views = (t) => t.reads.flatMap((r) => [
    { where: `${t.seed} ${r.veil} server/gallery`, ...viewOf(r.A.server, r.B.server, r.C.server) },
    { where: `${t.seed} ${r.veil} twin/gallery`, ...viewOf(r.A.twin, r.B.twin, r.C.twin) },
    ...(r.A.link ? [{ where: `${t.seed} ${r.veil} server/link`, ...viewOf(r.A.link, r.B.link, r.C.link) }] : []),
  ]);

  it('CONTROL: a share hiding nothing sends the hideable houses (the default veil withholds them), and nothing moves there', () => {
    const cf = counterfactualTowns();
    expect(cf.length, 'births with a hideable house').toBeGreaterThan(2);
    const hh = (doc) => (doc?.institutions || []).filter((h) => lib.isHideableHouse(h)).length;
    const bad = [];
    for (const t of cf) for (const dm of [false, true]) {
      const open = t.open[String(dm)]; const veiled = t.veiled[String(dm)];
      for (const eng of ['server', 'twin']) {
        if (!isRec(open[eng]) || !hh(open[eng])) bad.push(`${t.seed} dm=${dm} ${eng}: the share hiding nothing did not send a hideable house`);
        if (!isRec(veiled[eng]) || hh(veiled[eng])) bad.push(`${t.seed} dm=${dm} ${eng}: the default veil sent a hideable house`);
      }
      for (const r of t.reads) for (const eng of ['server', 'twin']) if (hh(r.B[eng])) bad.push(`${t.seed} ${r.veil} ${eng}: the counterfactual holds a hideable house`);
      // nothing moves: a built house-hidden row's served value is the unveiled projection's, references read by kind
      const ref = unkeyed(dm ? t.unveiledDm : t.unveiled);
      for (const row of built().filter((x) => x.when === 'house-hidden')) {
        const re = new RegExp(row.path);
        for (const eng of ['server', 'twin']) if (!sameAt(unkeyed(open[eng]), ref, re)) bad.push(`${t.seed} dm=${dm} ${eng}: ${row.id} moved on a share hiding nothing`);
      }
      // and a withhold-always row is withheld there too (whatever the veil: VR16)
      for (const row of built().filter((x) => x.rule === 'withhold' && x.when === 'always')) {
        for (const eng of ['server', 'twin']) for (const [p] of valuesAt(open[eng], new RegExp(row.path))) bad.push(`${t.seed} dm=${dm} ${eng}: ${row.id} sent on a share hiding nothing at ${p}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('RED: each judge catches a planted value, beside its clean twin that passes; the inversion judge catches a moved figure', () => {
    const t = counterfactualTowns()[0];
    const r = t.reads.find((x) => x.kind === 'default' && !x.dm);
    const pick = (pred) => built().find(pred) ?? rows.find((x) => pred(x) && valuesAt(t.stored, new RegExp(x.path)).size > 0);
    const caught = {};
    // (b) always: withheld from A and B it passes; the stored value planted back into A is caught
    const always = pick((x) => x.rule === 'withhold' && x.when === 'always' && !x.path.includes('(only in'));
    expect(always, 'a withhold-always row').toBeTruthy();
    {
      const re = [new RegExp(always.path)];
      const a = withhold(clone(r.A.server), re); const b = withhold(clone(r.B.server), re);
      expect(judge(always, strictView(a, b)).fails, `${always.id}: clean`).toEqual([]);
      const tally = graft(a, t.stored, re);
      expect(tally.grafted).toBeGreaterThan(0);
      caught[always.id] = judge(always, strictView(a, b)).fails.length;
    }
    // (b) house-hidden: A made to carry what its counterfactual carries passes; a value the counterfactual lacks is caught
    const hidden = pick((x) => x.rule === 'withhold' && x.when === 'house-hidden' && !x.path.includes('(only in'));
    expect(hidden, 'a withhold house-hidden row').toBeTruthy();
    {
      const re = [new RegExp(hidden.path)];
      const a = withhold(clone(r.A.server), re); graft(a, r.B.server, re);
      expect(judge(hidden, strictView(a, r.B.server)).fails, `${hidden.id}: clean`).toEqual([]);
      const b = withhold(clone(r.B.server), re);
      graft(a, t.stored, re);
      caught[hidden.id] = judge(hidden, strictView(a, b)).fails.length;
    }
    // (a) recompose: A given its counterfactual's wording passes; the stored wording moved off it is caught
    const recompose = pick((x) => x.rule === 'recompose' && !x.path.includes('(only in')
      && !sameAt(t.stored, r.B.server, new RegExp(x.path)));
    expect(recompose, 'a recompose row').toBeTruthy();
    {
      const re = [new RegExp(recompose.path)];
      const a = withhold(clone(r.A.server), re); graft(a, r.B.server, re);
      expect(judge(recompose, strictView(a, r.B.server)).fails, `${recompose.id}: clean`).toEqual([]);
      graft(a, t.stored, re);
      caught[recompose.id] = judge(recompose, strictView(a, r.B.server)).fails.length;
    }
    expect(Object.values(caught).every((k) => k > 0), JSON.stringify(caught)).toBe(true);
    // the inversion judge: a served figure moved by hand differs from its re-derivation
    const doc = t.open.false.server;
    expect(revisit(doc)).toBeTruthy();
    const moved = clone(doc); moved.defenseProfile.scores.internal += 7;
    const re = new RegExp(rows.find((x) => x.id === 'defence.scores.internal').path);
    expect(sameAt(doc, revisit(doc), re), 'the open read re-derives its own figure').toBe(true);
    expect(sameAt(moved, revisit(moved), re)).toBe(false);
  });

  it('MAIN: every built (a) row equals its counterfactual and every built (b) row is absent, on every town, veil, Reveal setting, read and engine; what cannot yet be judged is named', () => {
    const live = built();
    const fails = []; const per = {};
    for (const t of counterfactualTowns()) for (const v of views(t)) {
      for (const row of live) {
        const j = judge(row, v);
        const p = per[row.id] = per[row.id] || { reads: 0, failing: 0, excused: 0, reached: 0 };
        p.reads += 1; p.excused += j.excused; if (j.fails.length) p.failing += 1;
        if (bornCarries(t, row)) p.reached += 1;
        fails.push(...j.fails.slice(0, 3).map((f) => `${row.id} @ ${v.where}: ${f}`));
      }
    }
    // the twin beside the server: on a built row, the two engines serve the same values (references read by kind)
    for (const t of counterfactualTowns()) for (const r of t.reads) for (const row of live) {
      const re = new RegExp(row.path);
      if (!sameAt(unkeyed(r.A.server), unkeyed(r.A.twin), re)) fails.push(`${row.id} @ ${t.seed} ${r.veil}: the twin serves otherwise than the server`);
    }
    // NAMED: what MAIN cannot judge yet, and what each unbuilt row would do were it marked built today
    const unbuilt = rows.filter((r) => !r.built && (r.rule === 'withhold' || r.rule === 'recompose'));
    const preview = {};
    for (const row of unbuilt) {
      let failing = 0; let reads = 0; let reached = 0;
      for (const t of counterfactualTowns()) for (const v of views(t).filter((x) => x.where.includes('server/gallery'))) {
        reads += 1; if (judge(row, v).fails.length) failing += 1;
        if (bornCarries(t, row)) reached += 1;
      }
      preview[row.id] = { rule: row.rule, when: row.when, host: row.server, reads, reached, wouldFail: failing };
    }
    const unreached = live.filter((r) => !per[r.id]?.reached).map((r) => r.id);
    const report = {
      towns: towns.map((t) => ({ seed: t.seed, hideable: t.hideable, control: t.control ?? null, reads: t.reads.length })),
      built: { a: live.filter((r) => r.rule === 'recompose').map((r) => r.id), b: live.filter((r) => r.rule === 'withhold').map((r) => r.id) },
      perRow: per, unreached, cannotYetJudge: { unbuilt: unbuilt.length, rows: preview }, fails,
    };
    if (OUT) { mkdirSync(OUT, { recursive: true }); writeFileSync(join(OUT, 'counterfactual.json'), JSON.stringify(report, null, 1)); }
    console.log(`R6 MAIN: built (a) ${report.built.a.length}, built (b) ${report.built.b.length}, judged on ${counterfactualTowns().length} towns x ${views(counterfactualTowns()[0]).length} views; `
      + `failing ${fails.length}; NOT JUDGEABLE: built but held by no born town ${unreached.length} [${unreached.join(', ')}], `
      + `unbuilt ${unbuilt.length} [${unbuilt.map((r) => r.id).join(', ')}]; held by no born town at all: `
      + `${unbuilt.filter((r) => !preview[r.id].reached).map((r) => r.id).join(', ')}`);
    expect(counterfactualTowns().length).toBeGreaterThan(2);
    expect(fails).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('INVERSION (VR26 as VR32, VR28\'s tiers): no tier-1 diffuse row inverts beyond the known; the tier-2 bands are recorded with their count', () => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    const tierOf = (r, seen = new Set()) => {
      if (TIER2_BANDS.has(r.id)) return 2;
      if (!r.inputs.length || seen.has(r.id)) return 1;
      seen.add(r.id);
      return r.inputs.every((id) => byId.has(id) && tierOf(byId.get(id), seen) === 2) ? 2 : 1;
    };
    const diffuse = rows.filter((r) => r.rule === 'diffuse');
    const isProse = (r) => r.path.startsWith('^publicProse');
    const judged = diffuse.filter((r) => DERIVED.has(r.id) || isProse(r));
    const where = new Map();
    let compared = 0; let subsistence = 0;
    for (const t of towns) for (const dm of ['false', 'true']) {
      for (const [doc, side] of [[t.veiled[dm].server, 'veiled'], [t.open[dm].server, 'open']]) {
        if (side === 'veiled' && !t.hideable.length) continue;
        const r = revisit(doc);
        if (!r) { subsistence += 1; continue; }
        compared += 1;
        for (const row of judged) {
          if (sameAt(doc, r, new RegExp(row.path))) continue;
          const w = where.get(row.id) || { veiled: [], open: [] };
          w[side].push(`${t.seed}${dm === 'true' ? ' +DM' : ''}`);
          where.set(row.id, w);
        }
      }
    }
    const inverting = [...where].filter(([, w]) => w.veiled.length && !w.open.length).map(([id]) => id).sort();
    const tier1 = inverting.filter((id) => tierOf(byId.get(id)) === 1);
    const tier2 = inverting.filter((id) => tierOf(byId.get(id)) === 2);
    const notRederivable = [...where].filter(([, w]) => w.open.length).map(([id]) => id).sort();
    const notJudged = diffuse.filter((r) => !judged.includes(r)).map((r) => r.id);
    const report = { compared, subsistence, tier1, tier2: { count: tier2.length, rows: tier2 }, notRederivable, notJudged, where: Object.fromEntries(where) };
    if (OUT) { mkdirSync(OUT, { recursive: true }); writeFileSync(join(OUT, 'inversion.json'), JSON.stringify(report, null, 1)); }
    console.log(`R6 INVERSION: ${compared} reads compared (${subsistence} Subsistence aside); TIER 1 inverting ${tier1.length} [${tier1.join(', ')}]; `
      + `TIER 2 recorded ${tier2.length} [${tier2.join(', ')}]; not re-derivable on the open read ${notRederivable.length} [${notRederivable.join(', ')}]; not judged here ${notJudged.length}`);
    expect(compared).toBeGreaterThan(8);
    expect(tier1).toEqual([...KNOWN_TIER1].sort());
  }, ARM_TIMEOUT_MS);
});
