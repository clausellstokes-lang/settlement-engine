#!/usr/bin/env node
/**
 * scripts/prose-mark-card.mjs — THE MARKER'S CARD, SECTIONS (1)–(7), PRINTED MECHANICALLY
 * (brief ADDENDUM 18 ruling 4 — "the marker writes what would be false"; ruling 11 — the
 * frozen-field census is the licence for the perfect and the durative; the workflow's MARK
 * prompt in rewrite-block-v3.workflow.js names the nine sections; this prints (1)–(6) whole,
 * the mechanical (2b), and the mechanical half of (7) so the marker COMPOSES the card rather
 * than re-deriving it). Sections (8) and (9) are the marker's own and are never printed here.
 *
 *   node scripts/prose-mark-card.mjs <BLOCK> '<pool key>' [--json]
 *   node scripts/prose-mark-card.mjs DS-DEF-2 'Invasion & War: militia only'
 *
 * (1) THE KEY: the key function and its census reads, normalised to engine fields through the
 *     desk's own local bindings, each with its CLOCK (SNAPSHOT / LIVE-ROSTER / PULSE / CONFIG)
 *     and the key's PREIMAGE by tier from the 768-town rate table; the parameters the key FIXES
 *     and the ones it leaves OPEN (the exported *PoolKey function enumerated over its domains).
 * (2) REQUIRED ROWS at every tier with towns > 0 in the preimage (institutionalCatalog).
 * (2b) WHAT A FACE MAY NOT DENY OF THOSE ROWS (REWRITE car 8b-W-18k): per required row, the
 *     services `institutionServices.js` gives it at p >= 0.8 (with `on` carried, never filtered
 *     on) and the derivation that FILES it — read from `deriveArmedForces`' own AST, so a row
 *     the engine folds into `standing` is under arms whatever the key fixes. Then PLACEMENTS A
 *     FACE MAY NOT ASSERT: where the catalog's or the menu's own prose states where a body
 *     STANDS at some preimage tiers and not others, or states it with a hedge. Numbered (2b)
 *     rather than (3) because it elaborates (2) and because the workflow's MARK prompt names
 *     NINE sections by number.
 * (3) THE SAME-PAGE READ SET: the union of the normalised reads of every corpus row mounted on
 *     the same tab PLUS the fields the non-corpus producers on that tab read (an espree
 *     member-expression walk), each with its clock.
 * (4) THE SIBLING SENTENCES: from the sibling string pack, every on-page string whose predicate
 *     can co-fire with this key — INCLUDED unless the predicate is definitely false under the
 *     key's fixed parameters (three-valued evaluation; unknown keeps the row).
 * (5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX: for fourteen buckets, fixed TRUE / fixed FALSE
 *     by the key, TRUE by a required row on every preimage tier, or OPEN.
 * (6) THE FROZEN FIELDS: the writer count under src/domain/worldPulse/ for every field of (1)
 *     and (3), FROZEN / LIVE.
 * (7) the required rows that seat the universal sources at each preimage tier and whether the
 *     key fixes the force buckets and the gates. Sections (8) and (9) are the marker's own.
 *
 * Deterministic; read-only. Under a minute (the pulse tree is parsed once).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { parse } from 'espree';

import {
  ROOT, parseFile, normaliseRead, producerReads, clockOf, parsePulseTree, frozenFieldCensus,
  preimageOfPoolKey, requiredRowsByTier, bucketsSeatedByRequired, ROSTER_BUCKETS, BUCKET_OF_PARAM,
  TIERS, SERVICE_P_BAR, armedForcesFiling, placementClaimsIn, servicesAtOrAboveBar,
} from './lib/prose-mark-fields.mjs';
import { buildSiblingPack } from './sibling-string-pack.mjs';
import { COMPROMISED_SYMPTOM_POOLS } from '../src/domain/display/stateProse/composeStateProse.js';
import { COMPROMISABLE_SOURCES, COMPROMISED_SPEAKS } from '../src/domain/display/stateProse/stateProseKernel.js';

/**
 * ⭐ THE COVERT FIELDS, ONE ROW EACH, with the source each compromises and the symptom a
 * compromised face of that source may conceal (ADDENDUM 18 ruling 26 (g)). The reader of this
 * table is the REFUTER: a compromised face is judged under the inverted test, and the test is
 * "does it conceal on THIS symptom and deny nothing else".
 *
 * Held to `faceSources.js` `compromisedSourcesOf` by name in the suite — the card describing a
 * covert field the engine no longer holds would be worse than printing nothing.
 */
const COVERT_FIELDS = Object.freeze([
  Object.freeze({
    field: 'powerStructure.criminalCaptureState at `corrupted` or `capture`',
    source: 'hall',
    symptom: 'THE PURSE AND THE ACCOUNTS — what the hall says the town\'s money does, and who '
      + 'decides it. DS-DEF-4 says the fact outright ("the hall\'s decisions are not the '
      + 'hall\'s"), so a hall face on a purse pool may reassure that the accounts are in order '
      + 'and may deny NOTHING ELSE.',
  }),
  Object.freeze({
    field: 'a bloc carrying `covert: true` (settlementPolitics)',
    source: 'watch',
    symptom: 'THE WATCH\'S OWN KEEPING — the circuit, the wage, who is on the walk after dark. '
      + 'A watch face on an internal-security pool may say the patrol is kept as it has always '
      + 'been kept, and may deny nothing about the court, the purse or the walls.',
  }),
  Object.freeze({
    field: 'a bloc carrying `covert: true` (settlementPolitics)',
    source: 'court',
    symptom: 'WHAT REACHES THE LAW AND WHAT IT DOES WITH IT — a court face on a legal-chain '
      + 'pool may hold that matters are heard as they should be, and may deny nothing else.',
  }),
]);

/** The desk file each block prefix is authored in. */
export const DESK_FILE_OF = Object.freeze({
  'DS-DEF': 'src/domain/display/stateProse/defenseStateProse.js',
  'DS-ECO': 'src/domain/display/stateProse/economyStateProse.js',
  'DS-SUP': 'src/domain/display/stateProse/economyStateProse.js',
  'DS-POW': 'src/domain/display/stateProse/powerStateProse.js',
  'DS-STR': 'src/domain/display/stateProse/stressorsStateProse.js',
  'DS-CND': 'src/domain/display/stateProse/stressorsStateProse.js',
  'DS-GEN': 'src/domain/display/stateProse/generalStateProse.js',
  'DS-REL': 'src/domain/display/stateProse/generalStateProse.js',
  'DS-POP': 'src/domain/display/stateProse/generalStateProse.js',
  'DS-HK': 'src/domain/display/stateProse/generalStateProse.js',
  'DS-WAR': 'src/domain/display/stateProse/warFaithStateProse.js',
  'DS-FTH': 'src/domain/display/stateProse/warFaithStateProse.js',
});

/**
 * THE NON-CORPUS PRODUCERS PER TAB — the machine sentences beside the composed lines. Only the
 * defense tab is registered here; another tab prints "none registered" rather than a guess.
 */
export const TAB_PRODUCERS = Object.freeze({
  defense: Object.freeze([
    Object.freeze({ rel: 'src/domain/display/threatAssessment.js', fn: 'buildThreatAssessment', roots: null }),
    Object.freeze({ rel: 'src/domain/display/defenseDisplay.js', fn: 'deriveDefenseReadiness', roots: null }),
    Object.freeze({ rel: 'src/domain/display/defenseDisplay.js', fn: 'deriveGuardAssessment', roots: null }),
    Object.freeze({ rel: 'src/domain/display/defenseDisplay.js', fn: 'deriveCriminalStructure', roots: null }),
    Object.freeze({ rel: 'src/domain/display/defenseDisplay.js', fn: 'deriveSupportingCapabilities', roots: null }),
    Object.freeze({ rel: 'src/domain/display/defenseDisplay.js', fn: 'deriveArmedForces', roots: null }),
    Object.freeze({ rel: 'src/generators/safetyProfile.js', fn: 'generateSafetyProfile', roots: { config: 'config', tier: 'tier@generation', institutions: 'institutions@generation' } }),
  ]),
});

/**
 * HOW A MACHINE PREDICATE'S NAMES MAP ONTO THE KEY'S PARAMETERS. The machine reads the
 * generation-time SNAPSHOT (`defenseProfile.institutions.*`, `getInstFlags.inst.has*`) while a
 * force key reads the LIVE roster — the same fact at generation, a seam after a ruin.
 */
const PARAM_OF_NAME = Object.freeze({
  hasWalls: 'walls', 'inst.hasWalls': 'walls', walls: 'walls',
  hasGarrison: 'garrison', 'inst.hasGarrison': 'garrison', garrison: 'garrison',
  hasMilitia: 'militia', 'inst.hasMilitia': 'militia', militia: 'militia',
  hasCharter: 'charter', 'inst.hasCharterHall': 'charter',
  'inst.hasWatch': 'watch', 'inst.hasMercenary': 'mercenary',
  'f.hasCourtSystem': 'court', 'inst.hasCourtSystem': 'court', court: 'court',
  'f.hasPrison': 'prison', 'inst.hasPrison': 'prison', prison: 'prison',
  'f.hasGranary': 'granary', granary: 'granary',
  'f.hasHospital': 'hospital', hospital: 'hospital',
  'f.hasChurch': 'church', church: 'church',
  threat: 'monsterThreat', monsterThreat: 'monsterThreat',
  econScore: 'economicScore', 'scores.economic': 'economicScore',
});

/** @param {string} block @returns {string} */
const deskFileOf = (block) => DESK_FILE_OF[block.split('-').slice(0, 2).join('-')] || '';

/** @param {string} s */
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * THREE-VALUED EVALUATION of a predicate text under an assignment. `null` is unknown.
 * @param {string} text @param {(name: string) => (boolean|string|number|null)} lookup
 * @returns {boolean|null}
 */
export function evalPredicate(text, lookup) {
  let ast;
  try { ast = parse(`(${text})`, { ecmaVersion: 2024 }); } catch { return null; }
  const expr = ast.body[0]?.expression;
  const chainText = (n) => {
    if (n.type === 'Identifier') return n.name;
    if (n.type === 'ChainExpression') return chainText(n.expression);
    if (n.type === 'MemberExpression' && !n.computed) { const o = chainText(n.object); return o === null ? null : `${o}.${n.property.name}`; }
    return null;
  };
  const ev = (n) => {
    if (!n) return null;
    switch (n.type) {
      case 'Literal': return n.value;
      case 'Identifier': case 'MemberExpression': case 'ChainExpression': {
        const name = chainText(n);
        return name === null ? null : lookup(name);
      }
      case 'UnaryExpression': {
        if (n.operator !== '!') return null;
        const v = ev(n.argument);
        return v === null ? null : !v;
      }
      case 'LogicalExpression': {
        const a = ev(n.left); const b = ev(n.right);
        const ta = a === null ? null : Boolean(a); const tb = b === null ? null : Boolean(b);
        if (n.operator === '&&') return ta === false || tb === false ? false : ta === true && tb === true ? true : null;
        if (n.operator === '||') return ta === true || tb === true ? true : ta === false && tb === false ? false : null;
        return null;
      }
      case 'BinaryExpression': {
        const a = ev(n.left); const b = ev(n.right);
        if (a === null || b === null) return null;
        if (n.operator === '===' || n.operator === '==') return a === b;
        if (n.operator === '!==' || n.operator === '!=') return a !== b;
        if (typeof a === 'number' && typeof b === 'number') {
          if (n.operator === '>=') return a >= b; if (n.operator === '>') return a > b;
          if (n.operator === '<=') return a <= b; if (n.operator === '<') return a < b;
        }
        return null;
      }
      default: return null;
    }
  };
  const v = ev(expr);
  return v === null ? null : Boolean(v);
}

/**
 * ⭐ THE CARD's mechanical sections, as data.
 * @param {string} block @param {string} pool
 */
export async function buildCard(block, pool) {
  const census = JSON.parse(readFileSync(path.join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
  const row = census.rows.find((r) => r.block === block && r.pool === pool) || null;
  if (!row) {
    const pools = census.rows.filter((r) => r.block === block).map((r) => r.pool);
    throw new Error(`no census row for ${block} :: ${pool}. Pools of ${block}: ${pools.join(' · ')}`);
  }
  const rateRow = (census.rate?.rows || []).find((r) => r.block === block && r.pool === pool) || null;
  const deskRel = deskFileOf(block);
  const desk = parseFile(deskRel);
  const deskModule = await import(url.pathToFileURL(path.join(ROOT, deskRel)).href);
  const mounts = await import(url.pathToFileURL(path.join(ROOT, 'src/domain/display/stateProse/dossierMounts.js')).href);
  const pulse = parsePulseTree();
  /** @type {Map<string, ReturnType<typeof frozenFieldCensus>>} */
  const censusCache = new Map();
  const writersOf = (field) => {
    const key = String(field).replace(/\[.*$/, '').replace(/@generation.*$/, '').replace(/ \|\| .*$/, '');
    if (/^(tier|derived|local)/.test(key) || key === '') return { count: 0, status: 'FROZEN', target: key, writes: [] };
    if (!censusCache.has(key)) censusCache.set(key, frozenFieldCensus(key, undefined, pulse));
    return censusCache.get(key);
  };
  const clockFor = (field) => {
    if (/@generation/.test(field)) return 'SNAPSHOT (generation-time input of a stored string)';
    const c = writersOf(field);
    return clockOf(field, c.count);
  };

  // (1) THE KEY
  const reads = (row.reads || []).flatMap((read) => normaliseRead(read, desk, row.keyFunction).map((n) => ({ read, ...n })));
  const keyFields = [];
  for (const n of reads) {
    for (const field of String(n.field).split(' || ')) {
      keyFields.push({ arg: n.arg, field, clock: clockFor(field), writers: writersOf(field).count, how: n.how });
    }
  }
  const preimage = preimageOfPoolKey(deskModule, pool);
  const byTier = rateRow?.byTier || {};
  const preimageTiers = TIERS.filter((t) => (byTier[t]?.towns || 0) > 0);

  // (2) REQUIRED ROWS
  const required = await requiredRowsByTier();

  // ⭐⭐ (2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS (REWRITE car 8b-W-18k).
  //
  // THE MEASURED CAUSE. On the first pool of the re-cut BOTH writer seats denied arms of the
  // persons on gate duty ("Nobody who asked him was under arms") on a preimage whose every tier
  // requires a `Town watch` — a row whose service menu turns `Gate duty` on at p 0.8 and which
  // `deriveArmedForces` files under `standing`. And both placed the burial ground outside the
  // wall on tiers whose catalog row says nothing about a wall. Section (2) named the rows; it
  // never said what the rows MEAN, so a writer inferred the rest, which is floor 1 by inference.
  //
  // ⛔ MECHANICAL ONLY. Every figure here is read from the engine's own data — the catalog, the
  // service menu, the derivation's AST — and nothing is judged. Sections (8) and (9) stay the
  // marker's own. It is numbered (2b) and not (3) ON PURPOSE: it elaborates (2)'s rows, and the
  // workflow's MARK prompt names NINE sections by number, so a new (3) would renumber six of
  // them and desync a prompt this car does not own.
  const filing = armedForcesFiling();
  const requiredNames = [...new Set(preimageTiers.flatMap((t) => required[t].map((r) => r.name)))].sort();
  const mayNotDeny = [];
  for (const name of requiredNames) {
    const at = preimageTiers.filter((t) => required[t].some((r) => r.name === name));
    const services = await servicesAtOrAboveBar(name);
    const buckets = Object.entries(bucketsSeatedByRequired([{ section: '', name }]))
      .map(([bucket]) => ({ bucket, filed: filing[bucket] || null }));
    // The placement the DATA states about this row, per tier, out of the catalog's own prose.
    const placements = [];
    for (const tier of at) {
      const row = required[tier].find((r) => r.name === name);
      for (const claim of placementClaimsIn(row?.desc || '')) placements.push({ tier, ...claim, from: 'the catalog row' });
    }
    for (const s of services) {
      for (const claim of placementClaimsIn(s.desc)) placements.push({ tier: at.join('+'), ...claim, from: `the \`${s.service}\` service` });
    }
    mayNotDeny.push({ name, at, services, buckets, placements });
  }
  // ⛔ A PLACEMENT IS ASSERTABLE ONLY WHERE THE DATA STATES IT UNHEDGED ON EVERY PREIMAGE TIER.
  // Stated at one tier and silent at another is exactly the burial-ground error: the face draws
  // on every town of the preimage, so a placement true of the city is an invention on the thorp.
  const placementBars = [];
  for (const row of mayNotDeny) {
    const byPhrase = new Map();
    for (const p of row.placements) {
      const held = byPhrase.get(p.phrase.toLowerCase()) || { phrase: p.phrase, tiers: new Set(), hedged: false, from: new Set(), sentence: p.sentence };
      held.tiers.add(p.tier);
      held.hedged = held.hedged || p.hedged;
      held.from.add(p.from);
      byPhrase.set(p.phrase.toLowerCase(), held);
    }
    for (const held of byPhrase.values()) {
      const tiers = [...held.tiers].flatMap((t) => t.split('+'));
      const everywhere = preimageTiers.every((t) => tiers.includes(t));
      if (everywhere && !held.hedged) continue;
      placementBars.push({
        row: row.name,
        phrase: held.phrase,
        why: held.hedged
          ? 'the data HEDGES it, so it is a tendency and not a fact of this town'
          : `stated only at ${[...new Set(tiers)].join(', ')} — silent at ${preimageTiers.filter((t) => !tiers.includes(t)).join(', ')}`,
        from: [...held.from].join(' · '),
        sentence: held.sentence,
      });
    }
  }

  // (3) SAME-PAGE READ SET
  const site = (row.sites || [])[0] || '';
  const mount = mounts.DOSSIER_MOUNTS.find((m) => m.blockId === block && m.rung === 'sentence') || null;
  const tab = mount?.tab || site.split('.')[0] || '';
  const tabBlocks = [...new Set(mounts.DOSSIER_MOUNTS.filter((m) => m.tab === tab).map((m) => m.blockId))];
  /** @type {Map<string, {clock: string, writers: number, from: Set<string>}>} */
  const samePage = new Map();
  const addField = (field, from) => {
    for (const f of String(field).split(' || ')) {
      if (!f || /^(UNRESOLVED|\(|')/.test(f)) continue;
      if (!samePage.has(f)) samePage.set(f, { clock: clockFor(f), writers: writersOf(f).count, from: new Set() });
      samePage.get(f).from.add(from);
    }
  };
  /** @type {Map<string, {source: string, ast: object}>} */
  const deskCache = new Map([[deskRel, desk]]);
  const corpusRows = census.rows.filter((r) => tabBlocks.includes(r.block));
  const unresolvedReads = [];
  for (const r of corpusRows) {
    const rel = deskFileOf(r.block);
    if (!deskCache.has(rel)) deskCache.set(rel, parseFile(rel));
    for (const read of r.reads || []) {
      for (const n of normaliseRead(read, deskCache.get(rel), r.keyFunction)) {
        if (/UNRESOLVED/.test(n.how)) unresolvedReads.push(`${r.block} :: ${r.pool} :: ${read}`);
        else addField(n.field, `${r.block}`);
      }
    }
  }
  const producers = TAB_PRODUCERS[tab] || [];
  const producerFields = [];
  for (const p of producers) {
    const { fields, unresolved } = producerReads(p.rel, p.fn, p.roots);
    for (const f of fields) { addField(f, `${p.fn}`); producerFields.push({ producer: p.fn, field: f }); }
    for (const u of unresolved) producerFields.push({ producer: p.fn, field: `UNRESOLVED ${u}` });
  }

  // (4) SIBLING SENTENCES
  const fixed = preimage?.fixed || {};
  const lookup = (name) => {
    const param = PARAM_OF_NAME[name];
    if (param && Object.prototype.hasOwnProperty.call(fixed, param)) return fixed[param];
    return null;
  };
  const pack = buildSiblingPack();
  const siblings = pack.rows.filter((r) => r.onPage && /^(assess|mon|mil|intA|econA|disA|fundingNote|safetyLabel|safetyDesc|guardEffectivenessDesc|safetyDescs\[\]|note|status)$/.test(r.sink))
    .map((r) => {
      const verdicts = r.predicate.map((p) => evalPredicate(p, lookup));
      const definitelyFalse = verdicts.some((v) => v === false);
      const definitelyTrue = verdicts.length > 0 && verdicts.every((v) => v === true);
      return { ...r, verdict: definitelyFalse ? 'EXCLUDED (contradicts the key)' : definitelyTrue ? 'FIRES ON EVERY PREIMAGE TOWN' : r.predicate.length ? 'CAN CO-FIRE (predicate open)' : 'UNCONDITIONAL' };
    });

  // (5) CLOSED ROSTERS
  const rosters = {};
  for (const bucket of Object.keys(ROSTER_BUCKETS)) {
    const param = Object.entries(BUCKET_OF_PARAM).find(([, b]) => b === bucket)?.[0];
    const fixedByKey = param && Object.prototype.hasOwnProperty.call(fixed, param) ? fixed[param] : null;
    const seatedAt = preimageTiers.filter((t) => bucketsSeatedByRequired(required[t])[bucket]);
    const rowsAt = Object.fromEntries(seatedAt.map((t) => [t, bucketsSeatedByRequired(required[t])[bucket]]));
    let verdict;
    if (fixedByKey === true) verdict = 'FIXED TRUE by the key';
    else if (fixedByKey === false) verdict = 'FIXED FALSE by the key';
    else if (preimageTiers.length && seatedAt.length === preimageTiers.length) verdict = 'TRUE on every preimage town (a required row seats it at every preimage tier)';
    else if (seatedAt.length) verdict = `OPEN — required only at ${seatedAt.join(', ')}; open at ${preimageTiers.filter((t) => !seatedAt.includes(t)).join(', ')}`;
    else verdict = 'OPEN — the key does not fix it and no required row seats it';
    rosters[bucket] = { verdict, requiredRows: rowsAt, keywords: ROSTER_BUCKETS[bucket] };
  }

  // (6) FROZEN FIELDS
  const frozenFields = [...new Set([...keyFields.map((k) => k.field), ...samePage.keys()])]
    .filter((f) => !/@generation|^tier|^derived|^local/.test(f))
    .map((f) => { const c = writersOf(f); return { field: f, target: c.target, writers: c.count, status: c.status, clock: clockOf(f, c.count), grain: c.grain || 'field', sites: (c.writes || []).map((w) => `${w.file}:${w.line}`) }; });

  // (7) UNIVERSAL SOURCES
  const SOURCE_ROWS = [
    ['the hall', /town hall|city hall/i], ['the tavern', /tavern/i], ['the guilds', /craft guild/i],
    ['the register (parish)', /parish|church|priest|burial|grave|cemetery|charnel/i], ['the elders', /record of custom|elder/i],
  ];
  const sources = Object.fromEntries(preimageTiers.map((t) => [t, Object.fromEntries(SOURCE_ROWS.map(([name, re]) => [name, required[t].filter((r) => re.test(r.name)).map((r) => r.name)]))]));

  // ⭐⭐ (2c) THE COVERT FIELDS AND THEIR SYMPTOMS (ADDENDUM 18 ruling 26 (g); car 8b-W-18m).
  // The refuter judges a compromised face under the INVERTED test — it must reassure or
  // conceal ON THE SYMPTOM OF ITS OWN FIELD and deny nothing else — and that test is
  // unreadable without knowing which field, which source and which symptom. So the card
  // prints them per block, from the SAME table the composer draws on, never a second copy:
  // a symptom pool added to the composer and not to the card is impossible by construction.
  const covert = COVERT_FIELDS.map((f) => ({
    ...f,
    marks: COMPROMISED_SYMPTOM_POOLS
      .filter((r) => r.block === block && r.source === f.source)
      .flatMap((r) => [...r.pools]),
    hereNow: COMPROMISED_SYMPTOM_POOLS
      .some((r) => r.block === block && r.source === f.source && r.pools.includes(pool)),
  }));

  return {
    covert,
    block, pool, dir: slug(`${block}-${pool}`), censusRow: { keyFunction: row.keyFunction, rung: row.rung, predicate: row.predicate, sites: row.sites, source: row.source },
    key: { fields: keyFields, preimage: preimage ? { fn: preimage.fn, params: preimage.params, fixed: preimage.fixed, open: preimage.open, combos: preimage.combos.length } : null, byTier, preimageTiers, rateBp: rateRow?.rateBp ?? null, towns: rateRow?.towns ?? null },
    required: Object.fromEntries(preimageTiers.map((t) => [t, required[t]])),
    mayNotDeny, placementBars, serviceBar: SERVICE_P_BAR, armedForcesFiling: filing,
    samePage: { tab, blocks: tabBlocks, fields: [...samePage.entries()].map(([f, v]) => ({ field: f, clock: v.clock, writers: v.writers, from: [...v.from] })), producerFields, unresolvedReads },
    siblings, rosters, frozenFields, sources,
  };
}

/** @param {Awaited<ReturnType<typeof buildCard>>} c @returns {string[]} */
export function cardLines(c) {
  const L = [];
  const fixedText = c.key.preimage ? Object.entries(c.key.preimage.fixed).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' · ') : '(no *PoolKey function enumerates to this key)';
  L.push(`THE CARD (mechanical sections) — block ${c.block} · pool \`${c.pool}\` · dir ${c.dir}`);
  L.push('');
  L.push('(1) THE KEY AND ITS PREIMAGE');
  L.push(`  key function: ${c.censusRow.keyFunction} (rung ${c.censusRow.rung}) · site ${c.censusRow.sites.join(', ')}`);
  L.push(`  census predicate: ${c.censusRow.predicate.map((p) => `${p.field} ${p.op} ${p.value}`).join(' AND ')}`);
  for (const k of c.key.fields) L.push(`  read ${k.arg.padEnd(14)} -> ${k.field.padEnd(40)} [${k.clock}] writers ${k.writers}   (${k.how})`);
  if (c.key.preimage) {
    L.push(`  the key FIXES: ${fixedText}${c.key.preimage.open.length ? ` · leaves OPEN: ${c.key.preimage.open.join(', ')}` : ''}   (${c.key.preimage.fn}, ${c.key.preimage.combos} combination(s))`);
  } else L.push(`  the key FIXES: ${fixedText}`);
  L.push(`  preimage on the 768-town rate grid: ${c.key.towns} towns (${c.key.rateBp} bp) — ${c.key.preimageTiers.map((t) => `${t} ${c.key.byTier[t].towns}/${c.key.byTier[t].n}`).join(' · ') || 'NO TOWN (the key never fired on the grid)'}`);
  L.push(`  silent tiers: ${['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].filter((t) => !c.key.preimageTiers.includes(t)).join(', ') || 'none'}`);
  L.push('');
  L.push('(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away');
  for (const [tier, rows] of Object.entries(c.required)) L.push(`  ${tier} (${rows.length}): ${rows.map((r) => `${r.name} [${r.section}]`).join(' · ')}`);
  L.push('');
  L.push(`(2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS — the services the engine's own menu turns on at p ≥ ${c.serviceBar}, and the derivation that files the row`);
  for (const r of c.mayNotDeny) {
    const services = r.services.length
      ? r.services.map((s) => `${s.service} (p ${s.p}${s.on ? '' : ', OFF by default'})`).join(' · ')
      : '(no service menu at or above the bar)';
    const filed = r.buckets.length
      ? r.buckets.map((b) => `filed under ${b.filed ? `${b.filed} (deriveArmedForces)` : `the \`${b.bucket}\` roster`}`).join(' · ')
      : 'filed under no closed roster';
    L.push(`  ${r.name} (required at ${r.at.join(', ')}) — a face may not deny: ${services} · ${filed}`);
  }
  L.push('  ⛔ A SERVICE AT OR ABOVE THE BAR IS A THING THE TOWN\'S OWN MODEL SAYS THIS BODY DOES: denying it is floor 1, whatever the face is otherwise about. A row filed under `standing` is UNDER ARMS in the engine\'s reading even where the key fixes no garrison and no militia.');
  L.push('');
  // ⭐⭐ (2b′) THE OBSERVER'S AND THE PUBLIC'S LIST (ADDENDUM 18 rulings 27 (a) and 28 (a); car
  // 8b-W-18n). Both new forms are FACTS SOMEBODY CLAIMS TO HAVE SEEN — the archiver as witness,
  // and the town's people as a whole — so floor 1 binds them in full and HARDEST, and both
  // rulings name THE SAME LIST as the instrument: *"the card's section (2b) is the observer's
  // list of what it may not have seen"*. So the rows are (2b)'s rows verbatim under a heading
  // that says what they are FOR here. MECHANICAL, and deliberately not a second derivation: a
  // service added to (2b) and not to this list would let a witness un-see what a source may not
  // deny, which is floor 1 by inference wearing the one coat that sounds like evidence.
  L.push('(2b\u2032) THE OBSERVER\'S AND THE PUBLIC\'S LIST: what neither may claim to have seen');
  for (const r of c.mayNotDeny) {
    const services = r.services.length
      ? r.services.map((s) => s.service).join(' · ')
      : '(no service menu at or above the bar)';
    L.push(`  ${r.name} (required at ${r.at.join(', ')}) — NOT SEEN is a claim about: ${services}`);
  }
  L.push('  \u26d4 AN OBSERVATION AND A PUBLIC FACE ARE FACTS THEIR SPEAKER CLAIMS (rulings 27 (a), 28 (a)), so neither may INFER INTO A SILENCE a required row denies. On a preimage carrying a `Town watch`, "no member of the watch has walked the wall" is floor 1 in a witness\'s coat; "no soldier has been seen on the wall" is true on every town that draws a key fixing no garrison and no militia. The PUBLIC\'s second half — what everyone MAKES of what it saw — is a perception and may be mistaken; the seeing may not.');
  L.push('  \u26d4 AND THE FAIR COPY DOES NOT CITE ITSELF (ADDENDUM 18 ruling 40, the owner\'s): an observation is a BARE PASSIVE with no observer named — never "in the survey\'s time here", "on the nights the survey kept", "it is observed that", "this office".');
  L.push('');
  L.push(`(2c) COVERT FIELDS AND THEIR SYMPTOMS ON THIS BLOCK (ADDENDUM 18 ruling 26) — the INVERTED test the refuter judges a \`compromised\` face under`);
  if (!c.covert || c.covert.every((f) => f.marks.length === 0)) {
    L.push('    (none: no covert field of the engine marks a symptom pool on this block, so no face of this block may carry the `compromised` tag)');
  }
  for (const f of (c.covert || [])) {
    if (f.marks.length === 0) continue;
    L.push(`    ${f.source} ← ${f.field}`);
    L.push(`        SYMPTOM: ${f.symptom}`);
    L.push(`        marks the pools: ${f.marks.join(' · ')}`);
    L.push(`        ${f.hereNow ? '⭐ THIS POOL IS ONE OF THEM' : 'this pool is NOT one of them — here the source draws as any source'}`);
  }
  L.push(`  ⛔ THE INVERTED TEST. A face tagged \`compromised\` is the ONE place the reassurance tell is the point (ruling 26 (a)), and FLOOR 1 IS RE-POINTED FOR IT ALONE (26 (b)): it may deny the VISIBLE SYMPTOM of the very field it is compromised by, in the direction of CONCEALMENT ONLY. It never denies an unrelated field, never a required row, and never names the covert fact. The archiver reports it as flatly as any account: no wink.`);
  L.push(`  ⛔ THE CONCEALMENT MUST NOT IDENTIFY (26 (f)): offer more than one shape — dismiss · reassure · minimise · change the subject · blame the source of the talk · say nothing beyond the form. An HONEST source may also reassure truthfully on a small share of honest towns, so a reassurance on the page is a question and never an answer.`);
  L.push(`  ⛔ AND THE SOURCE IS SILENT SOME OF THE TIME (26 (h)): where a compromised source is present on a marked pool, a roll seeded on the world seed, the pool key, the settlement and the CURRENT YEAR decides whether it speaks (${COMPROMISED_SPEAKS}) or says nothing. Its silence is a behaviour, and the roll decides WHO SPEAKS and never WHAT IS TRUE.`);
  L.push(`  ⛔ THE TAG IS REFUSED on any source no covert field can compromise; the table is CLOSED: ${COMPROMISABLE_SOURCES.join(' · ')}.`);
  L.push('');
  L.push('  PLACEMENTS A FACE MAY NOT ASSERT — where a body STANDS, stated by the data at some preimage tiers and not others, or stated with a hedge');
  if (c.placementBars.length === 0) L.push('    (none: no required row of this preimage states a placement at all, so a face states none)');
  for (const p of c.placementBars) {
    L.push(`    ${p.row}: "${p.phrase}" — ${p.why}   [${p.from}]`);
    L.push(`        the data says: "${p.sentence}"`);
  }
  L.push('  ⛔ A FACE DRAWS ON EVERY TOWN OF THE PREIMAGE, so a placement the data states only at the city is an INVENTION on the thorp (floor 2), and a hedged one is a tendency rather than this town\'s fact.');
  L.push('');
  L.push(`(3) THE SAME-PAGE READ SET — tab \`${c.samePage.tab}\`: corpus blocks ${c.samePage.blocks.join(', ')} + machine producers`);
  for (const f of c.samePage.fields) L.push(`  ${f.field.padEnd(52)} [${f.clock}] writers ${String(f.writers).padStart(2)}   <- ${f.from.join(', ')}`);
  if (c.samePage.unresolvedReads.length) L.push(`  UNRESOLVED census reads (printed, not normalised): ${c.samePage.unresolvedReads.join(' ; ')}`);
  const unresolvedProducers = c.samePage.producerFields.filter((p) => /^UNRESOLVED/.test(p.field))
    .map((p) => p.field.replace(/^UNRESOLVED /, '').replace(/\s+/g, ' '))
    .filter((t) => !/^[[{(]/.test(t) && !/\.(push|map|some|includes|join|length|slice)$/.test(t) && !/\[\*\]$/.test(t))
    .map((t) => (t.length > 70 ? `${t.slice(0, 67)}…` : t));
  if (unresolvedProducers.length) L.push(`  producer reads through helpers (generation-time flag builders, tables): ${[...new Set(unresolvedProducers)].join(' · ')}`);
  L.push('  ⚠ SEAM: the machine rows read defenseProfile.institutions.* (SNAPSHOT) and safetyProfile reads the generation roster; a force key reads the LIVE roster — equal at generation, divergent after a ruin.');
  L.push('');
  L.push('(4) THE SIBLING SENTENCES — on-page machine strings that can fire beside this key (excluded only where the predicate is definitely false under the key)');
  for (const s of c.siblings) {
    if (/^EXCLUDED/.test(s.verdict)) continue;
    L.push(`  • [${s.producer} -> ${s.sink}] ${s.file}:${s.line}  ${s.verdict}`);
    L.push(`      "${s.text}"`);
    if (s.predicate.length) L.push(`      when: ${s.predicate.join('  AND  ')}`);
    for (const t of s.tables) for (const r of t.table) L.push(`      \${${t.slot}} when ${r.when}: "${r.text}"`);
    for (const [slot, table] of Object.entries(s.slots)) for (const r of table) L.push(`      \${${slot}} when ${r.when}: "${r.text}"`);
  }
  L.push(`  (excluded as contradicting the key: ${c.siblings.filter((s) => /^EXCLUDED/.test(s.verdict)).length} strings)`);
  L.push('');
  L.push('(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX');
  for (const [bucket, r] of Object.entries(c.rosters)) {
    const rows = Object.entries(r.requiredRows).map(([t, names]) => `${t}: ${names.join(', ')}`).join(' ; ');
    L.push(`  ${bucket.padEnd(10)} ${r.verdict}${rows ? `   [${rows}]` : ''}`);
  }
  L.push("  ⚠ `court` is hasCourtSystem and its keyword list includes 'town hall' and 'city hall': a required Town hall seats a court in the engine's model.");
  L.push('');
  L.push('(6) THE FROZEN FIELDS (writers under src/domain/worldPulse/, field grain)');
  for (const f of c.frozenFields) L.push(`  ${f.field.padEnd(52)} writers ${String(f.writers).padStart(2)}  ${f.status.padEnd(6)} [${f.clock}]${String(f.grain).startsWith('root') ? '  ⚠ root-grain (one segment)' : ''}${f.sites.length ? `  ${f.sites.slice(0, 4).join(', ')}${f.sites.length > 4 ? ` … +${f.sites.length - 4}` : ''}` : ''}`);
  L.push('  FROZEN => the perfect and the durative are licensed over it (ruling 11b); LIVE => refused unless the key\'s own read (11a).');
  L.push('');
  L.push('(7) THE UNIVERSAL SOURCES the required rows seat at each preimage tier (the marker adds the interests and the named offices)');
  for (const [tier, src] of Object.entries(c.sources)) L.push(`  ${tier}: ${Object.entries(src).map(([name, rows]) => `${name}: ${rows.length ? rows.join(', ') : '—'}`).join(' · ')}`);
  const force = ['watch', 'garrison', 'militia', 'mercenary', 'charter', 'gates'].map((b) => `${b}: ${c.rosters[b].verdict.replace(/ —.*$/, '')}`).join(' · ');
  L.push(`  the key on the force buckets and the gates: ${force}`);
  return L;
}

async function main() {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  const [block, pool] = argv.filter((a) => !a.startsWith('--'));
  if (!block || !pool) {
    console.error("usage: node scripts/prose-mark-card.mjs <BLOCK> '<pool key>' [--json]");
    process.exit(2);
  }
  const card = await buildCard(block, pool);
  if (json) { console.log(JSON.stringify(card, null, 1)); return; }
  console.log(cardLines(card).join('\n'));
}

if (process.argv[1] && process.argv[1].endsWith('prose-mark-card.mjs')) await main();
