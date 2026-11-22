/**
 * tests/domain/institutionDestroyedByKind.test.js — EM-B1i: A STANDING INSTITUTION STOPS
 * READING AS DESTROYED.
 *
 * `institutionDestroyed` (src/domain/worldPulse/causeLifecycle.js) decided on the PRESENCE of
 * the `worldPulseFate` key, never on its value. EM-B1h then declared each of the eighteen
 * words a KIND, derived by execution from the sibling keys of its writer's own record literal:
 * `closure` sets `_worldPulseInactive` AND a non-active standing, `standing` changes neither,
 * `rise` raises or founds an ACTIVE institution. Three of the eighteen are not `closure`, so a
 * demoted-but-standing wizard's tower, a reconstructed guild and a flourishing academy all read
 * as destroyed — and the compromise they sustain is severed, its bearer's `corrupt` tag cleared,
 * with a notable chronicle row saying the paymaster was destroyed. This packet makes the reader
 * branch on the DECLARED KIND, and these arms drive that through its one real consequence.
 *
 * ⛔ THE CONSERVATIVE CONTRACT IS PART OF THE CURE, NOT AN OVERSIGHT (A2). A truthy fate the
 * vocabulary does not know keeps TODAY'S verdict, so no saved world changes meaning silently;
 * and the membership test is the leaf's `isWorldPulseFate` (a `Set`), never `in`, which would
 * read 'constructor', 'toString', 'valueOf' and '__proto__' as members and invert exactly that
 * contract for exactly the words it exists to protect.
 *
 * WHY THE VERDICT IS READ AT ITS CONSEQUENCE. `institutionDestroyed` is module-private and
 * stays so, so every arm drives the REAL exported `advanceCauseLifecycle` and reads TERMINAL 2
 * (paymaster death -> re-adjudicate), exactly as the LANDED tests/domain/ruinInstitution.test.js
 * A6 does — `terminalTwo` below is that file's `leashSevered`/`fixedRng` (:154-185) with the
 * reform count and the record's survival reported alongside the event.
 *
 * SEVEN STRAIGHT-LINE `it` UNDER ONE LITERAL `describe` (EM preamble §P3.4): no `.each`, no
 * `runIf`, no nesting, no conditional registration. Every negative is anchored by a positive
 * control asserted BEFORE it.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect } from 'vitest';

import { ruinInstitution } from '../../src/domain/worldPulse/calamityKernel.js';
import { advanceCauseLifecycle } from '../../src/domain/worldPulse/causeLifecycle.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import {
  WORLD_PULSE_FATES, WORLD_PULSE_FATE_KIND, WORLD_PULSE_FATE_KINDS,
} from '../../src/domain/worldPulse/worldPulseFates.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const READER = 'src/domain/worldPulse/causeLifecycle.js';
const LEAF = 'src/domain/worldPulse/worldPulseFates.js';
const REGISTER_REL = 'tests/fixtures/.golden-freeze-register.json';
const KIND_RE = /WORLD_PULSE_FATE_KIND\b/;

// ── A7's matcher — a COMMENT-ONLY strip that KEEPS string contents ────────────
// ⛔ Copied verbatim from tests/domain/ruinInstitution.test.js:192, NEVER the estate's shared
// `codeOnly`: that blanks comments AND string CONTENTS, so `'ruined'` becomes `'      '` and
// every offence scan below would read blanks and pass on nothing.
function commentsOnly(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') { let j = i + 2; while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++; blank(i, Math.min(j + 2, n)); i = j + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c) break;
        if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      i = j + 1;
      continue;
    }
    i++;
  }
  return out.join('');
}

/** The brace-balanced object literal that ENCLOSES `symbol`. '' when it does not resolve. */
function enclosingLiteral(src, symbol) {
  const at = src.indexOf(symbol);
  if (at < 0) return '';
  let depth = 0;
  let start = -1;
  for (let i = at; i >= 0; i -= 1) {
    if (src[i] === '}') depth += 1;
    else if (src[i] === '{') { if (depth === 0) { start = i; break; } depth -= 1; }
  }
  if (start < 0) return '';
  let open = 0;
  for (let i = start; i < src.length; i += 1) {
    if (src[i] === '{') open += 1;
    else if (src[i] === '}') { open -= 1; if (open === 0) return src.slice(start, i + 1); }
  }
  return '';
}

/**
 * A7's PREDICATE, stated once (version 4, judgment 101). A non-`closure` writer's record may
 * carry NO non-active `status` — an absent key and `status: 'active'` both pass, because a
 * `rise` record is raised or founded ACTIVE and the `standing` record changes standing alone —
 * and neither inactive flag. A `closure`-shaped write beside a non-`closure` fate is the thing
 * this convicts, and the kinds the reader now branches on are what it protects.
 */
const STATUS_RE = /(?:^|[^\w.$])status\s*:\s*([^,}]+)/;
function offencesIn(literal) {
  const bad = [];
  const found = STATUS_RE.exec(literal);
  if (found && found[1].trim() !== "'active'") bad.push(`a NON-ACTIVE status: ${found[1].trim()}`);
  if (literal.includes('_worldPulseInactive')) bad.push('_worldPulseInactive');
  if (literal.includes('_worldPulseMorallyAbolished')) bad.push('_worldPulseMorallyAbolished');
  return bad;
}

/** Every non-test `.js`/`.jsx` under `src/`, repo-relative and sorted. */
function srcFiles(dir = join(ROOT, 'src'), out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) srcFiles(p, out);
    else if (/\.(js|jsx)$/.test(entry) && !/\.test\./.test(entry)) out.push(relative(ROOT, p).replace(/\\/g, '/'));
  }
  return out.sort();
}

/**
 * The sha the freeze register pins for one surface IDENTITY. FAIL-CLOSED: an unknown surface or
 * a missing `sha256` yields a sentence that cannot equal a 64-hex digest, so a reader that
 * stopped resolving REDS instead of passing vacuously.
 */
const pinFor = (rows, surface) => {
  const row = (Array.isArray(rows) ? rows : []).find((r) => r?.surface === surface);
  return typeof row?.sha256 === 'string' ? row.sha256 : `NO REGISTER PIN FOR SURFACE: ${surface}`;
};

// ── The driver: the REAL cause-lifecycle terminal, never a re-implementation ──
const fixedRng = (v) => { const f = { random: () => v, fork: () => f }; return f; };

function terminalTwo(sustainer) {
  const npc = {
    id: 'cap', name: 'cap', corrupt: true,
    personality: { dominant: 'principled', flaw: 'honest' },
    corruptTies: { criminalInstitution: 'Smuggling ring' },
  };
  const key = npcId('a', npc, 0);
  const item = {
    id: 'a',
    settlement: { name: 'a', npcs: [npc], institutions: [sustainer], config: {}, powerStructure: {}, activeConditions: [] },
    causal: { scores: {} },
    activeConditions: [],
  };
  const prior = {
    a: {
      [key]: {
        causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'criminal',
        situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [],
      },
    },
  };
  const out = advanceCauseLifecycle({
    snapshot: { settlements: [item] },
    worldState: { npcStates: { [key]: { roleArchetype: 'criminal' } } },
    priorLedger: prior,
    rng: fixedRng(0),
    tick: 12,
  });
  return {
    severed: Boolean(out.events.find((e) => e.stage === 're-adjudicated')),
    reforms: out.reforms.length,
    recordKept: Boolean(out.causeLifecycleByCid?.a?.[key]),
    headline: out.events[0]?.headline ?? null,
    reason: out.events[0]?.reasons?.[0] ?? null,
  };
}

const RING = Object.freeze({ name: 'Smuggling ring', category: 'crime', status: 'active' });
const withFate = (fate) => ({ ...RING, worldPulseFate: fate });
const row = (label, o) => `${label} severed=${o.severed} reforms=${o.reforms} kept=${o.recordKept}`;

describe('EM-B1i — institutionDestroyed reads the fate KIND, not the key', () => {
  it('A1 a closure paymaster still severs the leash and the three non-closure ones stop severing', () => {
    // ⛔ POSITIVE CONTROL FIRST: a genuinely destroyed paymaster must still cut the leash, or
    // every "no longer severs" verdict below is a dead driver rather than the cure.
    const control = terminalTwo(withFate('destroyed_by_disaster'));
    expect(row('closure', control), 'a destroyed paymaster stopped severing: the cure went too far').toBe('closure severed=true reforms=1 kept=false');
    // The DM-visible receipt the packet exists to stop telling about a STANDING institution.
    expect(control.headline).toBe('cap is cut loose');
    expect(control.reason).toBe('Sustaining institution "Smuggling ring" destroyed; the compromise resolved (no live patron remained).');
    // ⛔ NEGATIVE CONTROL: no fate and no non-standing status never severs in either direction,
    // so the driver cannot pass the three arms below by simply never severing anything.
    expect(row('bare', terminalTwo({ ...RING })), 'a STANDING paymaster severed, so this driver cannot measure the cure').toBe('bare severed=false reforms=0 kept=true');
    // THE CURE: collected, then asserted once (a bare per-member expect is the seed-loop shape).
    const cured = ['demoted_by_disaster', 'upgraded_by_reconstruction', 'founded_by_flourishing']
      .map((fate) => row(fate, terminalTwo(withFate(fate))));
    expect(cured, 'a standing or risen institution still reads as destroyed').toEqual([
      'demoted_by_disaster severed=false reforms=0 kept=true',
      'upgraded_by_reconstruction severed=false reforms=0 kept=true',
      'founded_by_flourishing severed=false reforms=0 kept=true',
    ]);
  });

  it('A2 an unknown word keeps today\'s reading, and the four prototype words prove the test is a Set', () => {
    // ⛔ BOTH CONTROLS FIRST: a closure word still severs and a standing word no longer does, so
    // a "still severs" verdict below is neither a dead driver nor an uncured reader.
    expect(terminalTwo(withFate('destroyed_by_disaster')).severed, 'the driver stopped severing at all').toBe(true);
    expect(terminalTwo(withFate('demoted_by_disaster')).severed, 'the cure is not live, so the arms below prove nothing').toBe(false);
    const verdicts = ['razed_by_the_gods', 'constructor', 'toString', 'valueOf', '__proto__']
      .map((word) => `${word}=${terminalTwo(withFate(word)).severed}`);
    // An `in` membership test answers TRUE for the four prototype words, so each would be read as
    // a KNOWN member with no kind and fall through to "not destroyed" — the exact inversion of the
    // conservative contract, for exactly the words that contract exists to protect.
    expect(verdicts, 'an unknown or prototype fate stopped severing: the membership test became `in`').toEqual([
      'razed_by_the_gods=true', 'constructor=true', 'toString=true', 'valueOf=true', '__proto__=true',
    ]);
    expect(terminalTwo({ ...RING, worldPulseFate: { forged: 1 } }).severed, 'a non-string truthy fate stopped severing').toBe(true);
    // The hazard itself, executed rather than described: if this ever reads false, §6.1's ban on
    // `in` may be re-measured — until then it is the reason the reader calls isWorldPulseFate.
    expect('constructor' in WORLD_PULSE_FATE_KIND, 'the `in` prototype hazard vanished — re-measure before relaxing the contract').toBe(true);
  });

  it('A3 the two flags decide FIRST, the status decides LAST, and EM-B1e\'s landed verdicts are unmoved', () => {
    // ⛔ POSITIVE CONTROL FIRST: the cure is live, so a `true` below comes from the flag or the
    // status arm rather than from an uncured truthiness reader.
    expect(terminalTwo(withFate('demoted_by_disaster')).severed, 'the cure is not live, so the ordering arms prove nothing').toBe(false);
    const ordering = [
      `inactive=${terminalTwo({ ...RING, worldPulseFate: 'demoted_by_disaster', _worldPulseInactive: true }).severed}`,
      `abolished=${terminalTwo({ ...RING, worldPulseFate: 'demoted_by_disaster', _worldPulseMorallyAbolished: true }).severed}`,
      `status=${terminalTwo({ name: 'Smuggling ring', category: 'crime', status: 'ruined' }).severed}`,
    ];
    expect(ordering, 'the flags no longer decide BEFORE the fate, or the status no longer decides LAST').toEqual(['inactive=true', 'abolished=true', 'status=true']);
    // ⭐ EM-B1e's LANDED A6 verdicts, RE-EXECUTED through the real writer rather than reasoned
    // about: both fated records are `closure`-kinded AND carry the inactive flag and a 'ruined'
    // standing, so they are decided before the fate is ever read.
    const decreed = ruinInstitution({ name: 'Smuggling ring', category: 'crime' }, { reason: "Razed by the table's hand.", fate: 'ruined_by_decree' });
    const disastered = ruinInstitution({ name: 'Smuggling ring', category: 'crime' }, { reason: 'Destroyed outright by the disaster.', fate: 'destroyed_by_disaster' });
    const noFate = { ...decreed };
    delete noFate.worldPulseFate;
    expect(decreed.worldPulseFate, 'the key must exist before deleting it, or the last verdict proves nothing').toBe('ruined_by_decree');
    const landed = [{ name: 'Smuggling ring', category: 'crime' }, decreed, disastered, noFate].map((inst) => terminalTwo(inst).severed);
    expect(landed, 'EM-B1e\'s four landed A6 verdicts moved under this cure').toEqual([false, true, true, true]);
  });

  it('A4 nothing moves: the three goldens still hash to the pin each carries in the freeze register', () => {
    // ⛔ NO DIGEST LITERAL LIVES HERE (CURE-L 85cd9f4a8): the estate has ONE register of frozen
    // bytes, and a second copy goes stale the day a SIGNED re-record moves the first.
    const surfaces = [
      ['generator-golden-master', 'tests/fixtures/generator-golden-master.json'],
      ['dossier-prose-manifest', 'tests/fixtures/dossier-prose-manifest-golden.json'],
      ['preset-lighting-witness', 'tests/fixtures/preset-lighting-witness-golden.json'],
    ];
    const rows = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8')).surfaces;
    expect(Array.isArray(rows) && rows.length, 'the freeze register produced no rows, so the equality below would be vacuous').toBeTruthy();
    const live = surfaces.map(([surface, rel]) => `${surface} ${createHash('sha256').update(readFileSync(join(ROOT, rel))).digest('hex')}`);
    const pinned = surfaces.map(([surface]) => `${surface} ${pinFor(rows, surface)}`);
    expect(live, 'the pulse history moved against the golden freeze register. A SIGNED re-record moves the row with the file and never reaches this arm; an unsigned movement is the finding.').toEqual(pinned);
  });

  it('A5 the kind law is TOTAL, and the eighteen members partition 15 destroyed / 3 standing', () => {
    const src = readFileSync(join(ROOT, READER), 'utf8');
    const literal = (/DESTROYED_BY_FATE_KIND\s*=\s*Object\.freeze\(\{([^}]*)\}/.exec(src) || ['', ''])[1];
    const pairs = [...literal.matchAll(/(\w+)\s*:\s*(\w+)/g)].map((m) => [m[1], m[2]]);
    expect(pairs.length, 'the verdict literal could not be read, so the totality arms below would be vacuous').toBe(WORLD_PULSE_FATE_KINDS.length);
    // Both ways: no verdict for a kind the producer does not declare, and no declared kind
    // without a verdict — a fourth kind must red here rather than default to "not destroyed".
    expect(pairs.map(([k]) => k).sort(), 'the verdict map and the declared KINDS have drifted apart').toEqual([...WORLD_PULSE_FATE_KINDS].sort());
    expect(pairs.filter(([, v]) => v !== 'true' && v !== 'false'), 'a verdict stopped being a boolean literal').toEqual([]);
    const judged = WORLD_PULSE_FATES.map((fate) => [fate, terminalTwo(withFate(fate)).severed]);
    const standing = judged.filter(([, severed]) => !severed).map(([fate]) => fate);
    expect([judged.length - standing.length, standing.length], 'the 15 / 3 partition moved: a member was re-kinded upstream').toEqual([15, 3]);
    expect(standing.map((fate) => `${fate}=${WORLD_PULSE_FATE_KIND[fate]}`).sort(), 'the three survivors are not the three non-closure members').toEqual([
      'demoted_by_disaster=standing', 'founded_by_flourishing=rise', 'upgraded_by_reconstruction=rise',
    ]);
    const populations = {};
    for (const fate of WORLD_PULSE_FATES) populations[WORLD_PULSE_FATE_KIND[fate]] = (populations[WORLD_PULSE_FATE_KIND[fate]] || 0) + 1;
    expect(populations, 'the kind populations moved').toEqual({ closure: 15, rise: 2, standing: 1 });
  });

  it('A6 exactly ONE src/ file reads the kind, and the roster equality refuses both failure shapes', () => {
    const files = srcFiles();
    expect(files.length, 'the src/ scan found no files at all').toBeGreaterThan(2000);
    const readers = files.filter((rel) => rel !== LEAF && KIND_RE.test(commentsOnly(readFileSync(join(ROOT, rel), 'utf8'))));
    // GUARD-THE-GUARD: an empty hit list means the cure went missing, and it must red HERE
    // rather than quietly satisfy a "nobody reads it" claim.
    expect(readers.length, 'no src/ file reads WORLD_PULSE_FATE_KIND: the cure went missing').toBeGreaterThan(0);
    expect(readers, 'a SECOND src/ reader of WORLD_PULSE_FATE_KIND appeared; it needs its own packet and its own golden measurement').toEqual([READER]);
    // BOTH FAILURE DIRECTIONS, through the SAME equality the arm above uses.
    const roster = (hits) => JSON.stringify(hits) === JSON.stringify([READER]);
    expect([roster(readers), roster([]), roster([READER, 'src/planted/second.js'])], 'the roster equality admits an emptied or a two-file hit list').toEqual([true, false, false]);
    // And the matcher itself: it fires on a planted importer and ignores a commented one.
    expect(KIND_RE.test(commentsOnly("import { WORLD_PULSE_FATE_KIND } from './worldPulseFates.js';")), 'the matcher does not FIRE on a planted importer').toBe(true);
    expect(KIND_RE.test(commentsOnly("// import { WORLD_PULSE_FATE_KIND } from './worldPulseFates.js';")), 'the matcher fires on a COMMENTED importer, so every hit above is noise').toBe(false);
  });

  it('A7 the kinds are RE-DERIVED from the writers\' own record literals, with both matcher controls', () => {
    const sites = [
      ['src/domain/worldPulse/calamityKernel.js', "worldPulseFate: 'demoted_by_disaster',"],
      ['src/domain/worldPulse/upswingKernel.js', "worldPulseFate: 'upgraded_by_reconstruction' }"],
      ['src/domain/worldPulse/upswingKernel.js', "worldPulseFate: 'founded_by_flourishing' }"],
    ];
    const literals = sites.map(([rel, symbol]) => enclosingLiteral(commentsOnly(readFileSync(join(ROOT, rel), 'utf8')), symbol));
    expect(literals.filter((text) => text.includes('worldPulseFate')).length, 'a write-site literal did not resolve, so the offence scan below would be vacuous').toBe(3);
    expect(literals.flatMap(offencesIn), 'a non-closure writer now stamps a NON-ACTIVE status or an inactive flag, so the kind this reader branches on has gone stale').toEqual([]);
    // ⛔ BOTH CONTROLS ARE REQUIRED, or the three clean results above are an accident: the
    // matcher must FIRE on a planted flag and must IGNORE a commented one.
    expect(offencesIn(commentsOnly("{ name: 'Academy', status: 'active', _worldPulseInactive: true }")), 'the matcher does not fire on a planted inactive flag').toEqual(['_worldPulseInactive']);
    expect(offencesIn(commentsOnly("{ name: 'Academy', /* _worldPulseInactive: true, */ status: 'active' }")), 'the matcher fires on a COMMENTED flag, so every clean result is noise').toEqual([]);
    // The half judgment 101 kept: a closure-shaped write beside a rise fate is still convicted,
    // while the founding site's own `status: 'active'` passes.
    expect(offencesIn(commentsOnly("{ name: 'Academy', status: 'ruined' }")), 'a NON-ACTIVE status stopped being an offence').toEqual(["a NON-ACTIVE status: 'ruined'"]);
  });
});
