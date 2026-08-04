/**
 * engineGatedRuleKeys.walker.test.js — habitat removal for the CENSUS-INVISIBLE
 * SUBSYSTEM class (chair ruling CR-WR10-C, 2026-08-04).
 *
 * THE CLASS. `simulationRuleKeys()` is the certification census, and until
 * CR-WR10-C it read exactly two surfaces: `DEFAULT_SIMULATION_RULES` and every
 * preset override spread. The estate's dormancy idiom (deep-couplings law 1) puts a
 * dark subsystem behind a VIRTUAL flag that appears in NEITHER — that is what makes
 * a dark layer cost a campaign zero persisted bytes. So a subsystem could be built,
 * gated, and shipped while the totality walker that exists to demand its
 * certification row could not see the key at all. The blindness was structural, it
 * was silent, and the cure had to be a census that reads the ENGINE rather than the
 * declarations.
 *
 * THE WALK. Source-scan `src/` for the strict gate idiom — a `rules` /
 * `simulationRules` receiver, `.<key>`, `=== true` — with comments AND string
 * literals blanked first, then prove the manifest
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` (worldPulse/simulationRules.js) against that
 * measurement BOTH WAYS:
 *   1. MANIFEST SUBSET OF READS  — every manifest member is really gated in src/.
 *      A manifest that drifted into fiction would grow the census and demand
 *      certification rows for keys the engine never reads.
 *   2. READS SUBSET OF ACCOUNTED — every gated key is in the census (declared or
 *      manifested), in the EXEMPT list, or in the measured BACKLOG. One-way
 *      coverage is the known failure mode of a hand-listed manifest: it would let a
 *      future engine-gated key hide again, which is the class this file closes.
 *
 * THE CAST IS A GATE. The dominant spelling in this estate is not the bare
 * `rules.<key> === true` but the JSDoc-cast form, a type-cast comment followed by
 * `(rules).<key> === true`. Fifteen of the seventeen backlog keys below are spelled
 * that way, and a scan that requires the receiver token to sit adjacent to the key
 * MISSES EVERY ONE OF THEM. That is not hypothetical: the chair's own pre-ruling
 * census measured 18 gate-read keys where this walker measures 51, and CR-WR10-C's
 * "blast radius is FIVE keys" was computed on the smaller number. The regex below
 * therefore tolerates an intervening `)` and an optional-chain `?.`, and the
 * non-vacuity test drives a POSITIVE CONTROL of each spelling so a future
 * simplification of the pattern reds here instead of silently re-blinding the census.
 *
 * WHY A WALKER AND NOT A RUNTIME SCAN. The census is a pure function on the eager
 * path's vocabulary module; source-scanning belongs in tests. CR-WR10-C item 2.
 *
 * GUARD THE GUARD. Both the scanner and the auditor are pure, so this file drives
 * each with synthetic inputs and asserts it REDS on every failure shape before
 * asserting the live tree is clean. Without that step a broken regex would pass
 * everything below on an empty measurement — which is exactly how the blindness
 * this walker cures came to be believed cured once already.
 *
 * TO COMPLY when this reds:
 *   - added a virtual gate for a NEW dark subsystem → add the key to
 *     ENGINE_GATED_VIRTUAL_RULE_KEYS (and author its certification row in the same
 *     commit — the totality walker demands it), or, if it is not a subsystem, add
 *     it to EXEMPT_RULE_KEYS with a written rationale. Never to the backlog: that
 *     list is a measured burn-down, not a parking space.
 *   - landed the first gate read for a PENDING_MANIFEST_KEYS member → move it into
 *     the manifest IN THE SAME COMMIT. That is CR-WR10-C item 4, and the assertion
 *     below is what makes the atomicity structural rather than a good intention.
 *   - gave a backlog key its certification row → delete its backlog entry (the list
 *     is SHRINK-ONLY and asserted EXACT; never add a row to it).
 *   - deleted a gated key → remove it from whichever list names it.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import { simulationRuleKeys } from '../../src/domain/certification/subsystemCertification.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Keys the engine gates on that are DELIBERATELY not census members, each with the
 * rationale that makes the exemption reviewable rather than a shrug. CR-WR10-C's
 * scope qualifier: the census covers engine-gated virtual SUBSYSTEM flags; an
 * opt-in campaign ROUTING POLICY is not a subsystem and has no aliveness to certify.
 */
const EXEMPT_RULE_KEYS = Object.freeze({
  routineMajorApproval: 'NOT A SUBSYSTEM — an opt-in campaign ROUTING POLICY. Its own'
    + ' module states the reason verbatim: "The flag is a TOLERANT READ, DELIBERATELY'
    + ' absent from DEFAULT_SIMULATION_RULES: it costs ZERO first-paint bytes (no eager'
    + ' key, no accessor branch) and off-by-absence is the dormancy law, executed."'
    + ' (src/domain/worldPulse/actorMajorApproval.js). It routes actor-initiated majors'
    + ' to the approval queue under routine autonomy; it moves no world state of its own'
    + ' and owns no vocabulary, so a certification row could only ever grade the'
    + ' proposal queue, which baseline rows already cover. Exempt BY RECORDED RATIONALE,'
    + ' never by silence.',
});

/**
 * THE MEASURED BACKLOG. Every key here is a REAL engine gate on a REAL dark
 * subsystem layer, measured by this walker at HEAD, and every one of them is owed a
 * manifest entry and a certification row on exactly CR-WR10-C's reasoning. They are
 * NOT in the manifest because CR-WR10-C authorised four keys and four rows; landing
 * seventeen more rows under a ruling that measured five keys would be a lane
 * inventing its own scope. Recorded here so the hole is VISIBLE and SHRINK-ONLY
 * instead of green and blind, and reported to the chair as the reopened §5
 * stragglers branch (CERT-ROW-ARMS.md: "If the census finds stragglers … THE FORK
 * RE-OPENS with data instead of a hunch").
 *
 * SHRINK-ONLY and asserted EXACT: a key leaves only by joining the manifest (with
 * its row) or the exempt list (with its rationale), and a NEW dark gate cannot join
 * — it reds as unaccounted until somebody decides which it is.
 */
const BACKLOG_RULE_KEYS = Object.freeze({
  assizeEnabled: 'THE ASSIZE — a pulse-tick kernel behind its own virtual flag (worldPulse/assizeKernel.js).',
  commonsVoiceEnabled: "THE COMMONS' VOICE — a pulse-tick kernel behind its own virtual flag (worldPulse/commonsVoiceKernel.js).",
  contestedGoalsEnabled: 'D-4 CONTESTED GOALS — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  corruptionWebEnabled: 'THE CORRUPTION WEB — beliefs-conjoined, behind its own virtual flag (worldPulse/corruptionWeb.js).',
  discourseProseEnabled: 'DISCOURSE PROSE — a display kernel consumed only behind its own virtual flag (display/discourseKernel.js).',
  economicCoupReadEnabled: 'THE ECONOMIC COUP READ — a coup-verdict term behind its own virtual flag (worldPulse/coup.js).',
  heirsEnabled: 'V-7 HEIRS-LITE — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  heraldCausalVoiceEnabled: 'THE HERALD CAUSAL VOICE — a display layer dark behind its own virtual flag (display/heraldCausalVoice.js).',
  intelTradeEnabled: 'D-3 THE INTEL LANE — the bounded event-driven belief trade (spatial/intelActs.js).',
  ladderPoliticalWindowsEnabled: 'LADDER POLITICAL WINDOWS — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  memoryWeaveEnabled: 'THE MEMORY WEAVE — a relationship-evolution layer behind its own virtual flag (worldPulse/relationshipEvolution.js).',
  migrationCorruptionPushEnabled: 'THE MIGRATION CORRUPTION PUSH — a migration multiplier dark at x1 (worldPulse/migrationKernel.js).',
  neutralNeighborsEnabled: 'NEUTRAL NEIGHBOUR EDGES — a region-layer edge class behind its own virtual flag (region/neutralNeighbourEdges.js).',
  npcCredibilityEnabled: 'THE PER-NPC CREDIBILITY LAYER — behind its own virtual flag (worldPulse/npcCredibility.js).',
  seaRoadsEnabled: 'D-6 SEA ROADS — a roads layer dark behind its own virtual flag (roads/seaRoads.js).',
  thirdPartyRansomEnabled: 'D-5 THIRD-PARTY RANSOM — a roads layer dark behind its own virtual flag (roads/thirdPartyRansom.js).',
  upswingHazardReadEnabled: 'THE UPSWING HAZARD READ — a piety multiplier dark at x1 (worldPulse/piety.js).',
});

/**
 * CR-WR10-C item 4: `sovereigntyTradeEnabled` joins the manifest IN THE SAME COMMIT
 * as its first real gate read (the WR-10 wiring wave's stage gate), so certification
 * tracks reality instead of preceding it. Until then it is read NOWHERE in src/, and
 * that is the recorded next step rather than a red — asserted below as ZERO reads,
 * which is what makes the atomicity structural: the wiring lane's first gate read
 * REDS this walker until the same commit moves the key into the manifest.
 */
const PENDING_MANIFEST_KEYS = Object.freeze(['sovereigntyTradeEnabled']);

/**
 * Blank out comments AND string/template contents while preserving every offset, so
 * a `rules.fooEnabled === true` written in PROSE (a row's `other` text, a header
 * paragraph, an invariant description) is not measured as a gate. Template
 * `${...}` expressions are kept: they are code.
 * @param {string} src @returns {string}
 */
export function codeOnly(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = src[i]; const d = src[i + 1];
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') {
      let j = i + 2;
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++;
      blank(i, Math.min(j + 2, n)); i = j + 2; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c || src[j] === '\n') break;
        j++;
      }
      blank(i + 1, j); i = j + 1; continue;
    }
    if (c === '`') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { blank(j, j + 2); j += 2; continue; }
        if (src[j] === '`') break;
        if (src[j] === '$' && src[j + 1] === '{') {
          let depth = 1; j += 2;
          while (j < n && depth > 0) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
          continue;
        }
        if (src[j] !== '\n') out[j] = ' ';
        j++;
      }
      i = j + 1; continue;
    }
    i++;
  }
  return out.join('');
}

/**
 * The strict gate idiom. The receiver is `rules` or `simulationRules`; an
 * intervening `)` admits the JSDoc-cast spelling (the dominant one in this estate),
 * and `?.` admits the optional-chain spelling.
 */
const GATE_RE = /\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g;

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Scan the given sources for the gate idiom.
 * @param {Array<{ rel: string, src: string }>} files
 * @returns {Map<string, string[]>} key -> the files that gate on it
 */
export function scanGateReads(files) {
  /** @type {Map<string, Set<string>>} */
  const hits = new Map();
  for (const { rel, src } of files) {
    const code = codeOnly(src);
    for (const match of code.matchAll(GATE_RE)) {
      const key = match[1];
      if (!hits.has(key)) hits.set(key, new Set());
      hits.get(key).add(rel);
    }
  }
  return new Map([...hits.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, set]) => [key, [...set].sort()]));
}

/**
 * The two-way audit. Pure set arithmetic so the tests below can drive it with
 * synthetic inputs and prove it reds (guard the guard).
 *
 * @param {{
 *   reads: ReadonlyArray<string>,
 *   manifest: ReadonlyArray<string>,
 *   census: ReadonlyArray<string>,
 *   exempt: ReadonlyArray<string>,
 *   backlog: ReadonlyArray<string>,
 *   pending: ReadonlyArray<string>,
 * }} input
 */
export function auditEngineGatedKeys({ reads, manifest, census, exempt, backlog, pending }) {
  const sorted = (list) => [...list].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const readSet = new Set(reads);
  const censusSet = new Set(census);
  const exemptSet = new Set(exempt);
  const backlogSet = new Set(backlog);
  // Direction 1: a manifest member the engine does not actually gate on.
  const manifestWithoutRead = sorted(manifest.filter((key) => !readSet.has(key)));
  // Direction 2: a gated key accounted for by nothing.
  const unaccountedReads = sorted(reads.filter((key) => !censusSet.has(key)
    && !exemptSet.has(key) && !backlogSet.has(key)));
  // A list naming a key nothing gates on has gone stale.
  const staleExempt = sorted(exempt.filter((key) => !readSet.has(key)));
  const staleBacklog = sorted(backlog.filter((key) => !readSet.has(key)));
  // A backlog key that reached the census is a burn-down win the list did not bank.
  const backlogInCensus = sorted(backlog.filter((key) => censusSet.has(key)));
  // CR-WR10-C item 4: a pending key that is now gated must join the manifest in the
  // SAME commit as its first gate read.
  const pendingAlreadyRead = sorted(pending.filter((key) => readSet.has(key)));
  return {
    ok: manifestWithoutRead.length === 0 && unaccountedReads.length === 0
      && staleExempt.length === 0 && staleBacklog.length === 0
      && backlogInCensus.length === 0 && pendingAlreadyRead.length === 0,
    manifestWithoutRead,
    unaccountedReads,
    staleExempt,
    staleBacklog,
    backlogInCensus,
    pendingAlreadyRead,
  };
}

const sourceFiles = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));
const gateReads = scanGateReads(sourceFiles);
const readKeys = [...gateReads.keys()];

const liveAudit = () => auditEngineGatedKeys({
  reads: readKeys,
  manifest: ENGINE_GATED_VIRTUAL_RULE_KEYS,
  census: simulationRuleKeys(),
  exempt: Object.keys(EXEMPT_RULE_KEYS),
  backlog: Object.keys(BACKLOG_RULE_KEYS),
  pending: PENDING_MANIFEST_KEYS,
});

describe('engine-gated rule keys (the census-invisible subsystem class)', () => {
  test('guard the guard: the scanner sees code and only code', () => {
    const planted = [
      '/** rules.docCommentEnabled === true is prose about a gate. */',
      "const help = 'rules.stringLiteralEnabled === true';",
      'const t = `rules.templateEnabled === true`;',
      '// rules.lineCommentEnabled === true',
      'if (rules.bareReceiverEnabled === true) run();',
      'if (/** @type {Record<string, unknown>} */ (rules).castReceiverEnabled === true) run();',
      'if (worldState?.simulationRules?.optionalChainEnabled === true) run();',
      'if (rules.notAGate !== true) skip();',
    ].join('\n');
    const found = [...scanGateReads([{ rel: 'planted.js', src: planted }]).keys()];
    // The three code spellings, and nothing from the four prose/negative decoys.
    expect(found).toEqual(['bareReceiverEnabled', 'castReceiverEnabled', 'optionalChainEnabled']);
  });

  test('guard the guard: the auditor reds on every failure shape', () => {
    const base = {
      reads: ['aEnabled', 'bEnabled', 'cEnabled'],
      manifest: ['aEnabled'],
      census: ['aEnabled', 'bEnabled'],
      exempt: ['cEnabled'],
      backlog: [],
      pending: ['dEnabled'],
    };
    expect(auditEngineGatedKeys(base).ok, 'a clean audit must pass, or every red below is meaningless').toBe(true);

    // 1. DIRECTION ONE — a manifest member nothing gates on (the fiction direction).
    const fiction = auditEngineGatedKeys({ ...base, manifest: ['aEnabled', 'inventedEnabled'] });
    expect(fiction.ok).toBe(false);
    expect(fiction.manifestWithoutRead).toEqual(['inventedEnabled']);

    // 2. DIRECTION TWO — a NEW dark gate accounted for by nothing (the blindness
    //    direction, and the one this walker exists for).
    const hidden = auditEngineGatedKeys({ ...base, reads: [...base.reads, 'freshDarkLayerEnabled'] });
    expect(hidden.ok).toBe(false);
    expect(hidden.unaccountedReads).toEqual(['freshDarkLayerEnabled']);

    // 3. A stale exemption: a rationale for a gate that no longer exists.
    const staleExempt = auditEngineGatedKeys({ ...base, exempt: ['cEnabled', 'retiredEnabled'] });
    expect(staleExempt.ok).toBe(false);
    expect(staleExempt.staleExempt).toEqual(['retiredEnabled']);

    // 4. A stale backlog row.
    const staleBacklog = auditEngineGatedKeys({ ...base, backlog: ['goneEnabled'] });
    expect(staleBacklog.ok).toBe(false);
    expect(staleBacklog.staleBacklog).toEqual(['goneEnabled']);

    // 5. A backlog key that reached the census: the burn-down win must be banked.
    const banked = auditEngineGatedKeys({ ...base, exempt: [], backlog: ['bEnabled', 'cEnabled'] });
    expect(banked.ok).toBe(false);
    expect(banked.backlogInCensus).toEqual(['bEnabled']);

    // 6. CR-WR10-C item 4 — the pending key gained its first gate read, so the
    //    manifest move is owed IN THIS COMMIT.
    const wired = auditEngineGatedKeys({ ...base, reads: [...base.reads, 'dEnabled'] });
    expect(wired.ok).toBe(false);
    expect(wired.pendingAlreadyRead).toEqual(['dEnabled']);
  });

  test('the live scan is non-vacuous and reaches BOTH gate spellings', () => {
    // A scan that silently emptied would make every assertion below trivially true.
    // The floors sit under today's measurement (51 keys across the tree) so ordinary
    // retirement does not red the walker while a collapsed scan still does.
    expect(sourceFiles.length).toBeGreaterThan(200);
    expect(readKeys.length).toBeGreaterThanOrEqual(40);
    // POSITIVE CONTROL, bare receiver: `rules.warLayerEnabled === true`.
    expect(readKeys).toContain('warLayerEnabled');
    // POSITIVE CONTROL, JSDoc-cast receiver: `(rules).seaRoadsEnabled === true`. This
    // is the spelling a narrower regex misses, and missing it is what under-measured
    // the blast radius before this walker existed. Fifteen of the seventeen backlog
    // keys are only visible through it.
    expect(readKeys).toContain('seaRoadsEnabled');
    // POSITIVE CONTROL, optional chain: `rules?.economicCoupReadEnabled === true`.
    expect(readKeys).toContain('economicCoupReadEnabled');
  });

  test('the manifest holds against the tree in BOTH directions', () => {
    const audit = liveAudit();
    expect(
      audit,
      'engine-gated rule-key manifest broken.\n'
      + `  manifest members the engine does not gate on: ${audit.manifestWithoutRead.join(', ') || 'none'}\n`
      + `  gated keys accounted for by nothing (manifest them, exempt them with a reason, or — never — hide them): ${audit.unaccountedReads.join(', ') || 'none'}\n`
      + `  exemptions for gates that no longer exist: ${audit.staleExempt.join(', ') || 'none'}\n`
      + `  backlog rows for gates that no longer exist: ${audit.staleBacklog.join(', ') || 'none'}\n`
      + `  backlog rows whose key reached the census (bank the win, delete the row): ${audit.backlogInCensus.join(', ') || 'none'}\n`
      + `  pending keys that gained a gate read (CR-WR10-C item 4 — move into ENGINE_GATED_VIRTUAL_RULE_KEYS in THIS commit): ${audit.pendingAlreadyRead.join(', ') || 'none'}`,
    ).toMatchObject({
      ok: true,
      manifestWithoutRead: [],
      unaccountedReads: [],
      staleExempt: [],
      staleBacklog: [],
      backlogInCensus: [],
      pendingAlreadyRead: [],
    });
  });

  test('the manifest is VIRTUAL keys only, and every member reached the census', () => {
    const declared = new Set(
      Object.entries(DEFAULT_SIMULATION_RULES)
        .filter(([, value]) => typeof value === 'boolean')
        .map(([key]) => key),
    );
    for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
      for (const [key, value] of Object.entries(preset?.rules || {})) {
        if (typeof value === 'boolean') declared.add(key);
      }
    }
    const census = simulationRuleKeys();
    for (const key of ENGINE_GATED_VIRTUAL_RULE_KEYS) {
      // A key that earned a preset declaration must LEAVE the manifest: carrying it
      // in both places would make the census's two sources disagree about which
      // surface owns it, and the +32-byte arm the ruling rejected would be paid
      // silently alongside the arm it chose.
      expect(
        declared.has(key),
        `${key} is declared in DEFAULT_SIMULATION_RULES or a preset spread, so it is no longer VIRTUAL — delete it from ENGINE_GATED_VIRTUAL_RULE_KEYS and move its row to the subject lane`,
      ).toBe(false);
      expect(census, `${key} is manifested but did not reach the census`).toContain(key);
    }
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.length).toBeGreaterThan(0);
    expect(new Set(ENGINE_GATED_VIRTUAL_RULE_KEYS).size).toBe(ENGINE_GATED_VIRTUAL_RULE_KEYS.length);
  });

  test('every exemption carries a rationale, and the backlog is exact and shrink-only', () => {
    for (const [key, rationale] of Object.entries(EXEMPT_RULE_KEYS)) {
      // An exemption without a written reason is a shrug, and a shrug is how a real
      // subsystem escapes certification wearing a policy's clothes (R19).
      expect(typeof rationale, `${key}: exemption rationale must be prose`).toBe('string');
      expect(rationale.length, `${key}: exemption rationale is too thin to review`).toBeGreaterThan(120);
      expect(gateReads.get(key), `${key} is exempted but nothing gates on it`).toBeTruthy();
    }
    for (const [key, note] of Object.entries(BACKLOG_RULE_KEYS)) {
      expect(note.length, `${key}: backlog rows name the layer they defer`).toBeGreaterThan(20);
      expect(gateReads.get(key), `${key} is backlogged but nothing gates on it`).toBeTruthy();
    }
    // EXACT, not a ceiling: the backlog equals the measured set of gated-but-uncensused
    // keys minus the exemptions. A new dark gate cannot join it silently (it reds as
    // unaccounted above), and a key that earned its manifest entry must be deleted from
    // it rather than left to rot.
    const censusSet = new Set(simulationRuleKeys());
    const measuredGap = readKeys
      .filter((key) => !censusSet.has(key) && !(key in EXEMPT_RULE_KEYS))
      .sort();
    expect(
      Object.keys(BACKLOG_RULE_KEYS).sort(),
      'the backlog must equal the measured gated-but-uncensused set exactly — bank wins by deleting rows, never by widening the list',
    ).toEqual(measuredGap);
    // The ceiling is the burn-down marker, never the guard. Lower it whenever a key
    // earns its manifest entry and its certification row; never raise it.
    expect(Object.keys(BACKLOG_RULE_KEYS).length).toBeLessThanOrEqual(17);
  });

  test('the pending manifest key is the recorded next step, not a red', () => {
    // Both absences below are anchored by the non-vacuity test above: it proves the
    // scan is populated and reaches all three gate spellings, and the manifest test
    // proves ENGINE_GATED_VIRTUAL_RULE_KEYS is non-empty. Neither can go vacuous by
    // the collection emptying, so they are stated as booleans rather than as bare
    // collection negatives.
    for (const key of PENDING_MANIFEST_KEYS) {
      expect(
        readKeys.includes(key),
        `${key} now has a gate read. CR-WR10-C item 4: it joins ENGINE_GATED_VIRTUAL_RULE_KEYS in the SAME commit as that read, with its certification row — certification tracks reality instead of preceding it.`,
      ).toBe(false);
      expect(
        ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(key),
        `${key} is in the manifest but nothing gates on it yet — the manifest entry rides the gate read, not the other way round`,
      ).toBe(false);
    }
    expect(PENDING_MANIFEST_KEYS).toEqual(['sovereigntyTradeEnabled']);
  });
});
