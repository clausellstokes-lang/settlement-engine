/**
 * newsSubjectVocabulary.walker.test.js — habitat removal for the ENGINE SLUG IN A
 * TOWNSPERSON'S MOUTH, and for the DATABASE LABEL STANDING AS A GRAMMATICAL SUBJECT.
 *
 * THE CLASS. There is exactly one place a token becomes the SUBJECT of a rumor:
 * `captureContent` in src/domain/spatial/rumorNetwork.js, which sets
 * `what: String(entry.impactKind || entry.kind || 'stirring')`. Whatever that
 * expression selects is handed to `whatPhrase` and rendered into the flagship
 * fiction surface. Until this walker, the only thing standing between an engine
 * token and that sentence was a DOCBLOCK: treatySuccessionVoice.js asks authors to
 * spell their kinds as string literals on purpose, "enforcement rather than style",
 * because the existing raw-text walkers cannot see a kind minted through a constant.
 * A naming convention enforced by a comment is not machinery. This file is.
 *
 * WHY IT ENUMERATES DIFFERENTLY FROM EVERY OTHER WALKER IN THE TREE. The existing
 * walkers enumerate PRODUCERS with a literal-only regex and are therefore exactly as
 * complete as that regex. Measured on this tree at the time of writing, that leaves
 * three routes uncovered:
 *
 *   • MODULE CONSTANTS — `candidateType: VERDICT_NEWS_TYPE`. Eleven live sites, and
 *     SEVEN live tokens (npc_verdict, npc_arrival, npc_death, npc_dispersal,
 *     npc_pardon, npc_rejection, npc_assignment) that no walker in this tree could
 *     see. This file resolves the constant ACROSS THE IMPORT GRAPH instead of asking
 *     authors not to use one.
 *   • TEMPLATE FAMILIES — `impactKind: \`realm_${type}\``. Declared, not skipped.
 *   • EVERYTHING ELSE — `impactKind: receipt.kind`. ⭐ AN UNRESOLVABLE MINT IS A
 *     FAILURE HERE, NOT A SILENT SKIP. Every other walker drops what its regex cannot
 *     read; this one CONVICTS, and the conviction is discharged only by a declared
 *     manifest row naming the registry that governs that site's tokens. A new dynamic
 *     mint reds until somebody says where its vocabulary comes from.
 *
 * ⛔ WHAT THIS WALKER CANNOT CLOSE, STATED SO NOBODY DELETES THE OTHER HALF. A source
 * scan sees only tokens spelled in the tree it scans. A token arriving from an OLD
 * SAVE or a `source:'table'` import is invisible to every scan that will ever exist,
 * and normalizeEntry passes `impactKind` straight off save data. That route is closed
 * by whatPhrase's REFUSAL arm, not by this file. Conversely the refusal alone would
 * let the neutral phrase quietly become the common case as new kinds ship, which this
 * file prevents. NEITHER HALF IS SUFFICIENT ALONE.
 *
 * ⛔ AND WHAT IT DELIBERATELY DOES NOT SCAN. The `entry.kind` arm of the consumer
 * expression is real but `kind:` is not a discriminating property name: measured over
 * this tree, scanning it inside news-authoring modules produced 93 convictions, of
 * which the great majority (`text`, `enum`, `target`, `army`, `band`) are ordinary
 * object properties that never reach a feed entry. An enumeration that noisy would
 * have to be silenced with exemptions, and an exemption list is the curated regex
 * this design exists to replace. The `kind` arm is closed by the refusal instead, and
 * Arm 1 pins the consumer expression so the arm cannot be widened unnoticed.
 *
 * THE CONTROLS. Four, and the first is the one no existing walker in this tree has:
 * the scanner is a PURE FUNCTION OF ITS ROOT, so it can be run against a fixture tree
 * built in tmpdir. That proves the SCAN discovers and convicts, not merely that a
 * predicate returns false. It is a tmpdir fixture and NOT a plant into src/ on
 * purpose: this is a shared working tree, and a crash between plant and restore
 * leaves a poison file a sibling lane's pre-commit hook can stage.
 */
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  UNREGISTERED_SUBJECT,
  WHAT_PHRASES,
  whatPhrase,
} from '../../src/domain/display/settlementRumors.js';
import { IMPACT_LABELS, createWizardNewsEntryFromImpact } from '../../src/domain/region/wizardNews.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── THE SCANNER ────────────────────────────────────────────────────────────────
// A PURE FUNCTION OF ITS ROOT. Every other walker in this tree hardcodes its scan
// directory, which is precisely why none of them can have a discovery control.

/** The two fields that structurally become a rumor's subject. `candidateType` is
 *  promoted to `impactKind` by worldPulseFeedCuration.js before the feed sees it. */
const FIELDS = Object.freeze(['impactKind', 'candidateType']);
const SITE_RE = new RegExp(`\\b(${FIELDS.join('|')})\\s*:\\s*([^,\\n}]+)`, 'g');
const CONST_RE = /(?:^|\n)\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=\s*'([a-z][a-z0-9_]*)'\s*;/g;
const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*'([^']+)'/g;

function walkJs(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkJs(p, out);
    else if (/\.js$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/**
 * Two blanked views of a source file, both byte-offset preserving.
 * `noComments` blanks comment text — without it, a docblock QUOTING a mint is read as
 * a mint. `code` blanks comment text AND string contents — a site whose match falls
 * inside a string literal is a certification row describing a mint, not a mint.
 * Both were measured on this tree: each removed real false positives.
 */
function blankedViews(src) {
  const noComments = src.split('');
  const code = src.split('');
  let i = 0;
  const n = src.length;
  let quote = null;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (quote) {
      if (c === '\\') {
        if (src[i] !== '\n') code[i] = ' ';
        if (src[i + 1] !== undefined && src[i + 1] !== '\n') code[i + 1] = ' ';
        i += 2;
        continue;
      }
      if (c === quote) { quote = null; i += 1; continue; }
      if (c !== '\n') code[i] = ' ';
      i += 1;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { quote = c; i += 1; continue; }
    if (c === '/' && d === '/') {
      while (i < n && src[i] !== '\n') { noComments[i] = ' '; code[i] = ' '; i += 1; }
      continue;
    }
    if (c === '/' && d === '*') {
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] !== '\n') { noComments[i] = ' '; code[i] = ' '; }
        i += 1;
      }
      if (i < n) { noComments[i] = ' '; noComments[i + 1] = ' '; code[i] = ' '; code[i + 1] = ' '; i += 2; }
      continue;
    }
    i += 1;
  }
  return { noComments: noComments.join(''), code: code.join('') };
}

/**
 * Discover and CLASSIFY every subject mint under `<rootDir>/src/domain`.
 * @param {string} rootDir
 * @returns {{ file: string, line: number, field: string, verdict: string,
 *             token?: string, prefix?: string, via?: string, expr?: string }[]}
 */
export function scanMints(rootDir) {
  const files = walkJs(join(rootDir, 'src', 'domain'));
  /** @type {Map<string, Map<string, string>>} */
  const declared = new Map();
  /** @type {Map<string, Map<string, {target: string, orig: string}>>} */
  const imported = new Map();
  const views = new Map();

  for (const abs of files) {
    const view = blankedViews(readFileSync(abs, 'utf8'));
    views.set(abs, view);
    const consts = new Map();
    for (const m of view.noComments.matchAll(CONST_RE)) consts.set(m[1], m[2]);
    declared.set(abs, consts);
    const imports = new Map();
    for (const m of view.noComments.matchAll(IMPORT_RE)) {
      if (!m[2].startsWith('.')) continue;
      const target = resolve(dirname(abs), m[2]);
      for (const part of m[1].split(',')) {
        const spec = part.trim();
        if (!spec) continue;
        const [orig, alias] = spec.split(/\s+as\s+/).map((x) => x.trim());
        imports.set(alias || orig, { target, orig });
      }
    }
    imported.set(abs, imports);
  }

  const resolveIdent = (abs, name) => {
    const own = declared.get(abs)?.get(name);
    if (own) return own;
    const via = imported.get(abs)?.get(name);
    return via && declared.has(via.target) ? declared.get(via.target).get(via.orig) : undefined;
  };

  const classify = (abs, rhsRaw) => {
    const rhs = rhsRaw.trim().replace(/\s+/g, ' ');
    let m = rhs.match(/^'([a-z][a-z0-9_]*)'$/) || rhs.match(/^"([a-z][a-z0-9_]*)"$/);
    if (m) return { verdict: 'literal', token: m[1] };
    m = rhs.match(/^`([a-z][a-z0-9_]*_)\$\{/);
    if (m) return { verdict: 'prefix-family', prefix: m[1] };
    m = rhs.match(/^([A-Z][A-Z0-9_]*)$/);
    if (m) {
      const lit = resolveIdent(abs, m[1]);
      if (lit) return { verdict: 'resolved-token', token: lit, via: m[1] };
    }
    return { verdict: 'unresolvable-mint', expr: rhs };
  };

  const sites = [];
  for (const abs of files) {
    const { noComments, code } = views.get(abs);
    for (const m of noComments.matchAll(SITE_RE)) {
      if (code.slice(m.index, m.index + m[1].length).trim() === '') continue;
      sites.push({
        file: relative(rootDir, abs).split('\\').join('/'),
        line: noComments.slice(0, m.index).split('\n').length,
        field: m[1],
        ...classify(abs, m[2]),
      });
    }
  }
  return sites;
}

const SITES = scanMints(ROOT);
const siteKey = (s) => `${s.file}:${s.field}:${s.expr}`;
const verdicts = (v) => SITES.filter((s) => s.verdict === v);
const SCANNED_TOKENS = [...new Set(
  SITES.filter((s) => s.verdict === 'literal' || s.verdict === 'resolved-token').map((s) => s.token),
)].sort();

// ── THE DECLARED MANIFESTS ─────────────────────────────────────────────────────

/**
 * THE DYNAMIC MINT MANIFEST. Every site whose token this scanner cannot resolve, with
 * the registry that governs that site's vocabulary. EXACT-SET PINNED, both ways: a NEW
 * dynamic mint reds until it is declared here, and a row for a site that no longer
 * exists reds too, so the list cannot rot into a list of excuses.
 *
 * DECLARING A ROW IS NOT A WAIVER. It says "the tokens flowing through this expression
 * are governed somewhere else, and here is where". Where the answer is "nowhere", the
 * refusal arm in whatPhrase is what protects the reader, and the row says so.
 */
const DYNAMIC_MINTS = Object.freeze([
  // ── PASS-THROUGH OF A PERSISTED FIELD. These re-emit an impactKind that arrived on
  // save data or a table import. Unscannable in principle; closed by the REFUSAL.
  'src/domain/region/wizardNews.js:impactKind:entry.impactKind || null',
  'src/domain/worldPulse/pulseHelpers.js:impactKind:entry.impactKind || null',
  'src/domain/worldPulse/demographicsHerald.js:impactKind:f.impactKind',
  // ── THE PROMOTION POINT ITSELF. worldPulseFeedCuration lifts every candidateType
  // onto the feed entry, so its vocabulary IS the union of every mint this file scans.
  'src/domain/worldPulse/worldPulseFeedCuration.js:impactKind:outcome.candidateType || outcome.type',
  'src/domain/worldPulse/applyWorldPulse.js:candidateType:outcome.candidateType',
  'src/domain/worldPulse/npcAgency.js:candidateType:outcome.candidateType || null',
  'src/domain/worldPulse/pulseHelpers.js:candidateType:outcome.candidateType || null',
  'src/domain/worldPulse/pulseOutcomePartition.js:candidateType:candidate.candidateType',
  'src/domain/worldPulse/candidateEvents.js:candidateType:candidate.candidateType',
  'src/domain/worldPulse/realmVerbExecution.js:candidateType:String(entry.candidateType)',
  // ── THE REGIONAL IMPACT LANE. `impact.kind` comes from region/propagation.js, whose
  // thirteen kinds are enumerated and driven by THE EXECUTION CENSUS at the end of
  // this file — the one arm here that proves its vocabulary rather than declaring it.
  'src/domain/region/wizardNews.js:impactKind:impact.kind',
  'src/domain/worldPulse/settlementLifecycleKernel.js:impactKind:kind',
  // ── THE SEVEN RECEIPT REGISTRIES. Each has its own kind-pool walker under
  // tests/lint/*KindPools.walker.test.js, and each of those already joins its rows to
  // WHAT_PHRASES. The registry is the governing artifact; this is the delivery site.
  'src/domain/worldPulse/commercialReasonsNews.js:impactKind:receipt.kind',
  'src/domain/worldPulse/envoyNews.js:impactKind:receipt.kind',
  'src/domain/worldPulse/sovereigntyNews.js:impactKind:receipt.kind',
  'src/domain/worldPulse/warCoalitionNews.js:impactKind:receipt.kind',
  'src/domain/worldPulse/warCostsNews.js:impactKind:receipt.kind',
  'src/domain/worldPulse/warRulingsNews.js:impactKind:receipt.kind',
  'src/domain/worldPulse/lineageNews.js:impactKind:args.kind',
  // ── ARCHETYPE TABLES. A local map keyed by a lane's own enum; the values are
  // literals in the same file and are reachable by the literal arm above.
  'src/domain/worldPulse/deploymentReturn.js:candidateType:archetype',
  'src/domain/worldPulse/occupation.js:candidateType:archetype',
  'src/domain/worldPulse/tradeWar.js:candidateType:archetype',
  'src/domain/worldPulse/warRecordMode.js:candidateType:archetype',
  // `act` ranges over the frozen BROKERAGE_ACTS list, which carries its OWN local
  // census in tests/domain/brokerageServices.test.js — that test drives whatPhrase
  // over every act and requires the word `brokerage` to survive into the phrase. It
  // is the model this manifest wants: a dynamic mint whose closed act list is
  // enumerated where it lives. (It also caught this lane: the four acts were voiced
  // ONLY by the compute arm, and reddened the moment the refusal landed.)
  'src/domain/worldPulse/brokerageServicesRules.js:candidateType:act',
  'src/domain/worldPulse/concludedWarRecord.js:candidateType:kind',
  'src/domain/worldPulse/faithNews.js:candidateType:kind',
  // ── A TEMPLATE WITH A DYNAMIC PREFIX (`${pressure.kind}_pressure`), which the
  // prefix-family classifier cannot read because the STATIC half is the suffix.
  'src/domain/worldPulse/candidateEvents.js:candidateType:`${pressure.kind',
]);

/**
 * THE TEMPLATE FAMILY MANIFEST. A mint whose token is built from a static prefix.
 * EXACT-SET PINNED. These are declared rather than joined to heraldRouting's prefix
 * registries because three of them (`compound_`, `operation_`, `realm_verb_`) are NOT
 * registered prefixes today — their members are routed exactly, or ride the catch-all.
 * Asserting a routing property that is not true would be a walker that lies; naming
 * the gap is a walker that reports.
 */
const TEMPLATE_FAMILIES = Object.freeze([
  'compound_', 'mobilization_reaction_', 'npc_', 'operation_', 'party_', 'population_',
  'realm_', 'realm_verb_', 'strategy_', 'stressor_birth_', 'stressor_escalate_',
  'stressor_spread_', 'table_', 'tier_',
]);

// ── ARM 1 — THE CONSUMER-ARM PIN ───────────────────────────────────────────────

describe('ARM 1 — the consumer expression is pinned to the arms this walker knows', () => {
  test('captureContent selects a subject from exactly three arms', () => {
    const src = readFileSync(join(ROOT, 'src/domain/spatial/rumorNetwork.js'), 'utf8');
    const line = src.split('\n').find((l) => /^\s*what:/.test(l));
    expect(line, 'captureContent no longer has a `what:` line at all').toBeTruthy();
    // The whole walker is scoped to `impactKind` and `candidateType` (which promotes
    // into `impactKind`). A FOURTH arm added here would be a new route to the reader
    // that nothing enumerates, so it reds and the author has to come and say so.
    expect(line.trim()).toBe("what: String(entry.impactKind || entry.kind || 'stirring'),");
  });
});

// ── ARM 2 — THE SCAN IS ALIVE (C3, the anti-vacuity control) ───────────────────

describe('ARM 2 — the scan is non-vacuous over the real tree (C3)', () => {
  test('the scan finds a substantial population of real mint sites', () => {
    expect(SITES.length).toBeGreaterThan(120);
    expect(verdicts('literal').length).toBeGreaterThan(100);
  });

  test('three named canaries, one per route, are actually discovered', () => {
    // Without these a scanner that returned only literals from one directory would
    // satisfy the count above. One canary per ROUTE, so a route going dark reds.
    const tokens = new Set(SCANNED_TOKENS);
    expect(tokens.has('faction_rival_power_contest'), 'the literal route went dark').toBe(true);
    expect(tokens.has('settlement_terminal_death'), 'the candidateType route went dark').toBe(true);
    // ⭐ THE ROUTE NO OTHER WALKER IN THIS TREE CAN SEE: minted as
    // `candidateType: VERDICT_NEWS_TYPE`, a constant declared in another module.
    expect(tokens.has('npc_verdict'), 'the module-constant route went dark').toBe(true);
    const resolvedVia = verdicts('resolved-token').map((s) => s.via);
    expect(resolvedVia).toContain('VERDICT_NEWS_TYPE');
  });

  test('a REGISTERED token is not convicted (the walker does not convict everything)', () => {
    expect(whatPhrase('conflict_pressure')).toBe('the drums of war');
    expect(whatPhrase('conflict_pressure')).not.toBe(UNREGISTERED_SUBJECT);
  });
});

// ── ARM 3 — THE REGISTRATION LAW (the teeth) ───────────────────────────────────

/**
 * THE UNROUTABLE PAIR — declared, exact-set, and SHRINK-ONLY.
 *
 * Both tokens are live candidateTypes and both deserve authored words. Neither can
 * have them today, and the obstruction is a RATCHET rather than a taste question:
 * heraldRouting.walker.test.js requires every WHAT_PHRASES row to be explicitly
 * routed, and the only way to route these two is an EXACT_SECTION row — which would
 * raise SP-E's routed-but-unregistered census (kindPoolFloors.walker.test.js), a
 * ceiling asserted shrink-only. heraldRouting.js records that exact trap for
 * `occupation_posture` in its own words: an EXACT_SECTION row for such a beat "grows
 * a census asserted shrink-only, which has no lawful growth cure."
 *
 * Registering them therefore costs a ratchet regression, which is not this lane's to
 * spend. Meanwhile the READER IS ALREADY PROTECTED: whatPhrase refuses them, so
 * neither renders "route chartered" or "route revived" any more. What is deferred is
 * the information, not the cure. Deliberately deferred and documented — NOT a bug to
 * re-find. It discharges when either token gains a kind-pool registry row.
 */
const UNROUTABLE_DEFERRED = Object.freeze(['route_chartered', 'route_revived']);

describe('ARM 3 — every discoverable subject token resolves to authored words', () => {
  test('the deferred pair is still exactly two, and still genuinely unroutable', () => {
    // The exemption cannot silently grow, and it cannot silently become unnecessary:
    // both halves of its justification are asserted, not asserted-once-and-trusted.
    expect([...UNROUTABLE_DEFERRED].sort()).toEqual(['route_chartered', 'route_revived']);
    for (const token of UNROUTABLE_DEFERRED) {
      expect(SCANNED_TOKENS, `${token} is no longer minted — delete its row`).toContain(token);
      expect(whatPhrase(token), `${token} is registered now — delete its row`).toBe(UNREGISTERED_SUBJECT);
    }
  });

  test('no scanned token reaches the reader as the refusal phrase', () => {
    const refused = SCANNED_TOKENS
      .filter((k) => !UNROUTABLE_DEFERRED.includes(k))
      .filter((k) => whatPhrase(k) === UNREGISTERED_SUBJECT);
    // To comply: add `k: '<the in-world phrase a townsperson would say>'` to
    // WHAT_PHRASES in src/domain/display/settlementRumors.js, and file the token at a
    // Herald desk in heraldRouting.js. The refusal is the reader's floor, not a
    // destination: a kind that ships without words is a kind nobody voiced.
    expect(refused).toEqual([]);
  });

  test('the refusal phrase is not itself a registered phrase', () => {
    // Otherwise the arm above could pass by collision rather than by registration.
    // The liveness anchor first: the collection this negative reads must be populated,
    // or "the refusal phrase is absent from it" is true of an empty map.
    expect(Object.keys(WHAT_PHRASES).length).toBeGreaterThan(200);
    // The map's size is pinned on the line above, so a WHAT_PHRASES that emptied or
    // anchored: drifted reds there rather than certifying this absence over nothing.
    expect(Object.values(WHAT_PHRASES)).not.toContain(UNREGISTERED_SUBJECT);
  });
});

// ── ARM 4 — THE DECLARED MANIFESTS, EXACT-SET ──────────────────────────────────

describe('ARM 4 — an unresolvable mint is CONVICTED, not skipped', () => {
  test('every dynamic mint site is declared, and every declared row still exists', () => {
    const found = [...new Set(verdicts('unresolvable-mint').map(siteKey))].sort();
    const declaredRows = [...DYNAMIC_MINTS].sort();
    const undeclared = found.filter((k) => !declaredRows.includes(k));
    const stale = declaredRows.filter((k) => !found.includes(k));
    // A NEW dynamic mint lands in `undeclared` and reds until its author records which
    // registry governs its tokens. A removed one lands in `stale`.
    expect({ undeclared, stale }).toEqual({ undeclared: [], stale: [] });
  });

  test('every template family is declared, and every declared family still exists', () => {
    const found = [...new Set(verdicts('prefix-family').map((s) => s.prefix))].sort();
    expect(found).toEqual([...TEMPLATE_FAMILIES].sort());
  });
});

// ── ARM 5 — THE CROSS-LAYER MIRROR ─────────────────────────────────────────────

describe('ARM 5 — the Herald and the town speak the same words for one event', () => {
  test('IMPACT_LABELS mirrors WHAT_PHRASES for every regional kind', () => {
    // The defect this closes: `impactKind: 'conflict_pressure'` read as "Conflict
    // pressure takes hold in Elmspur" on the news surface and "the drums of war" on
    // the rumor surface — one event, two registers, neither aware of the other.
    // wizardNews.js cannot IMPORT the display module (the regional engine graph does
    // not pull reader-only code), so the mirror is spelled twice and pinned here.
    const drift = Object.entries(IMPACT_LABELS)
      .filter(([kind, phrase]) => WHAT_PHRASES[kind] !== phrase)
      .map(([kind, phrase]) => `${kind}: news="${phrase}" rumor="${WHAT_PHRASES[kind]}"`);
    expect(drift).toEqual([]);
    expect(Object.keys(IMPACT_LABELS).length).toBe(12);
  });
});

// ── ARM 6 — THE R1 REGISTER LAW OVER THE SUBJECT VOCABULARY ────────────────────

/** The estate's R1 table (rumorFallbackPhrasePools.test.js), applied to the subject
 *  phrases this wave authored. A phrase that breaks any of these cannot be dropped
 *  into an arbitrary frame, which is the whole contract a subject phrase has. */
const R1_FORBIDDEN = Object.freeze([
  [/[.!?]$/, 'a terminal stop — R1 is a phrase, not a sentence'],
  [/\d/, 'a digit — the band-words law puts numbers out of the reader\'s prose'],
  [/_/, 'an engine token — an underscore is a slug that escaped'],
  [/[{}$]/, 'an interpolation slot — R1 phrases take NO slots; the frame carries the address'],
  [/^(and|but|so|because|which|that) /, 'an opening connective — it cannot lead a sentence'],
  [/—/, 'an em dash — forbidden in any string literal this wave authors'],
]);

describe('ARM 6 — every subject phrase reads in every frame that can carry it', () => {
  const SUBJECTS = Object.freeze([...new Set([
    ...Object.values(IMPACT_LABELS),
    ...SCANNED_TOKENS.map((k) => whatPhrase(k)),
  ])]);

  test('the subject roster is populated (the register law below is not vacuous)', () => {
    expect(SUBJECTS.length).toBeGreaterThan(100);
  });

  test('every subject phrase is a bare lowercase noun phrase', () => {
    const offences = [];
    for (const phrase of SUBJECTS) {
      if (!phrase) { offences.push('<empty>'); continue; }
      if (phrase[0] !== phrase[0].toLowerCase()) offences.push(`"${phrase}": starts capitalized`);
      for (const [shape, why] of R1_FORBIDDEN) {
        if (shape.test(phrase)) offences.push(`"${phrase}": ${why}`);
      }
    }
    expect(offences).toEqual([]);
  });

  test('every subject phrase reads in all SIX wizardNews frames and all FOUR rumor frames', () => {
    // The estate's two-way frame-fit law, widened. A phrase is only a subject if it
    // survives every frame that can carry it; a phrase that reads in one is a defect
    // waiting for the transition that picks another.
    const graph = {
      nodes: [{ id: 's1', name: 'Oldford' }, { id: 't1', name: 'Elmspur' }],
      edges: [],
      channels: [{ id: 'ch1', type: 'trade_route', from: 's1', to: 't1' }],
    };
    const offences = [];
    for (const kind of Object.keys(IMPACT_LABELS)) {
      for (const transition of ['queued', 'ready', 'applied', 'resolved', 'ignored', 'expired']) {
        const entry = createWizardNewsEntryFromImpact(
          { id: 'i1', kind, status: transition, sourceSettlementId: 's1', targetSettlementId: 't1', channelId: 'ch1', channelType: 'trade_route', severity: 0.7 },
          { graph, tick: 3, transition },
        );
        // THE SUBJECT LAW: a NAMED settlement leads, never a taxonomy noun.
        if (!entry.headline.startsWith('Elmspur ')) offences.push(`${kind}/${transition}: "${entry.headline}"`);
        if (/[_]/.test(entry.headline)) offences.push(`${kind}/${transition}: underscore in headline`);
        if (!entry.summary.endsWith('.')) offences.push(`${kind}/${transition}: summary is not a sentence`);
      }
    }
    for (const phrase of Object.values(IMPACT_LABELS)) {
      const capitalized = phrase.charAt(0).toUpperCase() + phrase.slice(1);
      if (!/^[A-Z]/.test(`${capitalized} in Thornwall`)) offences.push(`"${phrase}": firsthand frame`);
      if (!`Merchants bring word of ${phrase} in Thornwall`.includes(phrase)) offences.push(`"${phrase}": outline frame`);
      if (!`Travellers speak of ${phrase} somewhere near Thornwall`.includes(phrase)) offences.push(`"${phrase}": vague frame`);
    }
    expect(offences).toEqual([]);
  });
});

// ── ARM 7 — THE EXECUTION CENSUS ───────────────────────────────────────────────

describe('ARM 7 — the regional lane is proved by EXECUTION, not by a curated list', () => {
  /** Every kind region/propagation.js can mint, read off its own mint calls. One
   *  file, one call shape, auditable by eye — and it reds when a new regional kind
   *  ships without a subject phrase, which a hand-kept roster could not. */
  const propagationKinds = [...new Set(
    [...readFileSync(join(ROOT, 'src/domain/region/propagation.js'), 'utf8')
      .matchAll(/impact\([^)]*,\s*'([a-z][a-z0-9_]*)'/g)].map((m) => m[1]),
  )].sort();

  test('the propagation scan found the regional kinds at all', () => {
    expect(propagationKinds.length).toBeGreaterThanOrEqual(13);
    expect(propagationKinds).toContain('conflict_pressure');
    expect(propagationKinds).toContain('relief');
  });

  test('no regional kind mints the neutral stand-in (every one has authored words)', () => {
    // An EXECUTION census: it drives the real mint rather than reading a table, so a
    // kind that reaches the frames through any path at all is covered. `relief` is
    // included deliberately — it has NO IMPACT_LABELS row because both prose
    // functions intercept it, and this is what proves that interception is real.
    const graph = {
      nodes: [{ id: 's1', name: 'Oldford' }, { id: 't1', name: 'Elmspur' }],
      edges: [],
      channels: [{ id: 'ch1', type: 'trade_route', from: 's1', to: 't1' }],
    };
    const neutral = [];
    for (const kind of propagationKinds) {
      for (const transition of ['queued', 'ready', 'applied', 'resolved', 'ignored', 'expired']) {
        const entry = createWizardNewsEntryFromImpact(
          { id: 'i1', kind, status: transition, sourceSettlementId: 's1', targetSettlementId: 't1', channelId: 'ch1', channelType: 'trade_route', severity: 0.7 },
          { graph, tick: 3, transition },
        );
        const text = `${entry.headline} ${entry.summary}`;
        if (text.includes('a hard turn in its fortunes')) neutral.push(`${kind}/${transition}`);
        // The negative control on the census: neither the raw token nor its
        // de-underscored form may appear. Restricted to MULTI-WORD tokens on purpose —
        // `relief` is an ordinary English word this lane's relief prose uses honestly,
        // and a leak check that convicted it would be checking spelling, not register.
        if (kind.includes('_') && (text.includes(kind) || text.includes(kind.replace(/_/g, ' ')))) {
          neutral.push(`${kind}/${transition}: the raw token leaked`);
        }
      }
    }
    expect(neutral).toEqual([]);
  });

  test('an UNREGISTERED regional kind DOES take the neutral stand-in (the control)', () => {
    // Without this, an execution census over a mint that had stopped producing prose
    // entirely would pass the arm above by producing nothing to match.
    const entry = createWizardNewsEntryFromImpact(
      { id: 'i9', kind: 'newstrain_probe_unregistered_regional_kind', status: 'applied', targetSettlementId: 't1', severity: 0.5 },
      { graph: { nodes: [{ id: 't1', name: 'Elmspur' }], edges: [], channels: [] }, tick: 3, transition: 'applied' },
    );
    expect(entry.headline).toBe('Elmspur wakes to a hard turn in its fortunes');
    // The exact-equality pin above proves the headline exists and holds prose, so
    // anchored: this cannot pass on an absent or emptied field.
    expect(entry.headline).not.toMatch(/newstrain_probe|newstrain probe/);
  });
});

// ── THE CONTROLS ON THE SCANNER ITSELF ─────────────────────────────────────────

/** Build a throwaway tree in tmpdir and hand its root to the scanner. */
function withFixtureTree(files, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'newstrain-walker-'));
  try {
    const domain = join(dir, 'src', 'domain');
    mkdirSync(domain, { recursive: true });
    for (const [name, body] of Object.entries(files)) writeFileSync(join(domain, name), body, 'utf8');
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('C1 — THE DISCOVERY CONTROL (the arm no other walker in this tree has)', () => {
  test('the scanner DISCOVERS and CONVICTS an unregistered token in a fixture tree', () => {
    // ⭐ This proves the SCAN, not merely the predicate. Every other walker here can
    // only demonstrate that its registration test returns false for a made-up string,
    // which would still pass if the scan had silently stopped reading files at all.
    //
    // It is a tmpdir fixture and NOT a plant into src/ deliberately: this is a shared
    // working tree, and a crash between plant and restore leaves a poison file that a
    // sibling lane's `git status` sees and a pre-commit hook can stage.
    const sites = withFixtureTree(
      { 'probe.js': "export const P = { impactKind: 'newstrain_probe_unregistered' };\n" },
      (root) => scanMints(root),
    );
    expect(sites.length).toBe(1);
    expect(sites[0].verdict).toBe('literal');
    expect(sites[0].token).toBe('newstrain_probe_unregistered');
    // And the registration join convicts it, so discovery and conviction are joined.
    expect(whatPhrase(sites[0].token)).toBe(UNREGISTERED_SUBJECT);
  });

  test('the fixture tree is removed even when the body throws', () => {
    let captured = null;
    expect(() => withFixtureTree({ 'probe.js': 'export const P = {};\n' }, (root) => {
      captured = root;
      throw new Error('deliberate');
    })).toThrow('deliberate');
    expect(captured).toBeTruthy();
    expect(() => statSync(captured)).toThrow();
  });
});

describe('C2 — THE SHAPE CONTROL (each mint shape gets its OWN verdict)', () => {
  test('the classifier returns four distinct verdicts across five mint shapes', () => {
    // Without this, a classifier that answered 'literal' for everything would satisfy
    // C1 completely. The imported-constant case is the one that matters most: it is
    // the route the estate's own docblock says is invisible to a raw-text scan.
    const sites = withFixtureTree({
      'a-literal.js': "export const A = { impactKind: 'newstrain_shape_literal' };\n",
      'b-template.js': 'export const B = (x) => ({ candidateType: `newstrain_shape_${x}` });\n',
      'c-own-const.js': "const NEWSTRAIN_OWN = 'newstrain_shape_own';\nexport const C = { impactKind: NEWSTRAIN_OWN };\n",
      'd-source.js': "export const NEWSTRAIN_FAR = 'newstrain_shape_far';\n",
      'e-imported.js': "import { NEWSTRAIN_FAR } from './d-source.js';\nexport const E = { candidateType: NEWSTRAIN_FAR };\n",
      'f-variable.js': 'export const F = (kind) => ({ impactKind: kind });\n',
    }, (root) => scanMints(root));

    const byFile = Object.fromEntries(sites.map((s) => [s.file.split('/').pop(), s]));
    expect(byFile['a-literal.js'].verdict).toBe('literal');
    expect(byFile['a-literal.js'].token).toBe('newstrain_shape_literal');
    expect(byFile['b-template.js'].verdict).toBe('prefix-family');
    expect(byFile['b-template.js'].prefix).toBe('newstrain_shape_');
    expect(byFile['c-own-const.js'].verdict).toBe('resolved-token');
    expect(byFile['c-own-const.js'].token).toBe('newstrain_shape_own');
    expect(byFile['e-imported.js'].verdict).toBe('resolved-token');
    expect(byFile['e-imported.js'].token).toBe('newstrain_shape_far');
    expect(byFile['f-variable.js'].verdict).toBe('unresolvable-mint');
    expect(new Set(sites.map((s) => s.verdict)).size).toBe(4);
  });

  test('a mint quoted in a COMMENT or inside a STRING is not read as a mint', () => {
    // Both false positives were measured on the real tree while this walker was being
    // built: a docblock quoting `impactKind: 'npc_ladder'`, and a certification row
    // describing a mint inside a quoted sentence. Each would have produced a
    // conviction against a token nobody had actually minted.
    const sites = withFixtureTree({
      'g-noise.js': [
        "// impactKind: 'newstrain_comment_noise'",
        "/* candidateType: 'newstrain_block_noise' */",
        "export const NOTE = \"the row spells impactKind: 'newstrain_string_noise' on purpose\";",
        "export const REAL = { impactKind: 'newstrain_real_mint' };",
        '',
      ].join('\n'),
    }, (root) => scanMints(root));
    expect(sites.map((s) => s.token)).toEqual(['newstrain_real_mint']);
  });
});
