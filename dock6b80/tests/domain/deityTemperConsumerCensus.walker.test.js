/**
 * deityTemperConsumerCensus.walker.test.js — W-FAITH F2c: THE TEMPER CENSUS, WITH
 * A DENOMINATOR.
 *
 * F2c gave `deityTemper` an authored arm (D1: `authoredTemper` present ⇒ that word;
 * absent ⇒ the derivation exactly as before). `DESIGN_W_FAITH.md` §3 risk 1 names
 * the failure that arm can cause — DOUBLE-COUNT, "authored temper + derived axes
 * feeding the same site" — and §786.2 names the instrument: a census of every
 * consumer WITH A FULL DENOMINATOR, every site dispositioned.
 *
 * ⭐ THE FINDING THIS FILE EXISTS TO MAKE PERMANENT, and it is not the one the
 * volume expected. A census that only counted READERS would have reported eleven
 * consumers and declared the arm live. Tracing where each one's deity OBJECT comes
 * from said something else — and that provenance map is what turned out to matter:
 *
 *   - `deitySnapshotFrom` and the three commit-time embed writers copy a NAMED key
 *     list, and at F2c `authoredTemper` was not in it. So every consumer that read
 *     an EMBED — the ENTIRE ENGINE, ten of the eleven — still derived, and could not
 *     see an authored word even after a user set one.
 *   - Exactly ONE surface was handed a RAW authored definition: the compendium's
 *     deity draft preview (`deityDraftPreview.js` → `describeDeityEffects`). That was
 *     where, and only where, the authored word was legible.
 *   - The twelfth site, `CustomContent.jsx`'s `temperamentAxis` dual-write, is
 *     immune by construction: it builds a two-key literal, so the compat mirror goes
 *     on mirroring the DERIVATION rather than the effective read. That is correct —
 *     D1 retires that field forever — and it is pinned here so it stays that way.
 *
 * ⭐⭐ THE GAP IS NOW CLOSED, AND THIS FILE RECORDS THE CLOSING RATHER THAN GUARDING
 * IT. W-FAITH F3c carried the six authored-character keys into all four writers in
 * one act (ODQ §866), so the ten embed consumers now hear an authored word. F2c's
 * tripwire — `the embed writers do NOT carry authoredTemper` — was written to be a
 * GO-SIGNAL for exactly that act, and it was deleted BY that act rather than left to
 * red forever; a tripwire kept past the thing it was tripping on is just a false
 * claim with a passing status. What replaces it is the inverse assertion, executed:
 * the embed path and the raw-draft path now agree, and the tests below prove they
 * agree by running BOTH rather than by scanning either.
 *
 * ⛔ WHAT STILL MUST NOT DRIFT: the writers must route through ONE picker
 * (`authoredCharacterEmbedKeys`), not four hand copies, and exactly one src module
 * may make a SEMANTIC read of the authored word. Both are pinned below.
 *
 * WHY A SOURCE SCAN. The thing under guard is AUTHORSHIP — a second temper read
 * would be perfectly functional at runtime, which is exactly why nothing else would
 * catch it. Same reasoning as `allianceWebRiskConsumers.walker.test.js`, whose shape
 * this file follows deliberately.
 *
 * Every test here is STATICALLY registered — a `test.each` over non-literal data
 * PARKS the whole file in the lighting census, and a parked file's assertions are
 * evidence nowhere.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import { TEMPER_WORDS, deityTemper } from '../../src/domain/worldPulse/deityAxes.js';
import { DEITY_TEMPER_KEYS } from '../../src/domain/customContentSchema.js';
import { deitySnapshotFrom } from '../../src/domain/deitySnapshot.js';
import { describeDeityEffects } from '../../src/domain/display/deityEffects.js';
import { describeDeityDraft } from '../../src/components/compendium/deityDraftPreview.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The temper seam's own home — the one file allowed to decide what a temper IS. */
const OWNER = 'src/domain/worldPulse/deityAxes.js';

/**
 * THE DENOMINATOR. Every src module that calls `deityTemper`, with the PROVENANCE
 * of the deity object it reads — because provenance, not the call count, is what
 * decides whether an authored word can reach the site at all.
 *
 * `provenance` is one of:
 *   'embed'      — `settlement.config.primaryDeitySnapshot` (or the religion-state
 *                  `deities[ref].snapshot`, which is the same record by reference).
 *                  `authoredTemper` is STRIPPED by the embed writers ⇒ unreachable.
 *   'raw-draft'  — a raw authored definition, straight off the editor draft ⇒ the
 *                  authored word IS legible here.
 *   'literal'    — the site builds its own object literal ⇒ immune by construction.
 *
 * `probe` is a substring that must still be present in that file, so a relocation
 * or rename reds the census instead of silently re-classifying a site.
 */
const CONSUMERS = Object.freeze([
  Object.freeze({
    file: 'src/domain/worldPulse/disposition.js',
    provenance: 'embed',
    probe: 'deityTemper(settlement?.config?.primaryDeitySnapshot)',
    note: 'the signed warlike drive into computeAggressiveness',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/relationshipRulesAdversarial.js',
    provenance: 'embed',
    probe: 'deityTemper(settlement?.config?.primaryDeitySnapshot)',
    note: 'the trade-leverage embargo sharpener',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/militaryStrength.js',
    provenance: 'embed',
    probe: 'const deity = s?.config?.primaryDeitySnapshot',
    note: 'the will-facet patron bonus',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/religiousContest.js',
    provenance: 'embed',
    probe: 'item?.settlement?.config?.primaryDeitySnapshot',
    note: 'warbound occupation pull + the incumbent counter-force temper gap',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/religionState.js',
    provenance: 'embed',
    probe: 'mandateAlignmentFit(settlement?.config?.primaryDeitySnapshot',
    note: 'the divine-mandate regime fit',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/religionLegitimacy.js',
    provenance: 'embed',
    probe: 'deityRulerFit(deity, lens)',
    note: 'ruler fit / endorsement — deity + a deitySnapshotFor injector, both embeds',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/cultImpositionApply.js',
    provenance: 'embed',
    probe: 'export function nicheOf(d)',
    note: 'THE NICHE KEY — every caller passes an embed (religionState.js :175/:189/:219)',
  }),
  Object.freeze({
    file: 'src/domain/worldPulse/martialReadiness.js',
    provenance: 'embed',
    probe: 'state.deities?.[patronRef]?.snapshot',
    note: 'patron temper sign; religion-state snapshot, falling back to the config embed',
  }),
  Object.freeze({
    file: 'src/domain/magicProfile.js',
    provenance: 'embed',
    probe: 'const deity = settlement?.config?.primaryDeitySnapshot',
    note: 'magic-legality regulation + its two prose reasons',
  }),
  Object.freeze({
    file: 'src/domain/display/deityEffects.js',
    provenance: 'embed',
    probe: 'export function describeDeityEffects(deitySnapshot)',
    note: 'THE ONE SPLIT SITE — four of its five callers pass an embed; the fifth does not',
  }),
  Object.freeze({
    file: 'src/components/compendium/CustomContent.jsx',
    provenance: 'literal',
    probe: 'temperamentAxis: deityTemper({',
    note: 'the retired-field dual-write; a two-key literal, so the mirror keeps deriving',
  }),
  // W-FAITH F7c (the §866 docket): the two former stored-field readers that
  // resolve a temper THEMSELVES now do it through the seam. The other two former
  // readers (FaithWar.jsx, journalPages.js) read the `temper` field off the
  // liveWorld slice and are therefore downstream of liveWorld's call, not
  // consumers of the seam.
  Object.freeze({
    file: 'src/domain/display/warResolve.js',
    provenance: 'embed',
    probe: 'const deity = settlement?.config?.primaryDeitySnapshot',
    note: 'the faith-opposition read + the AI narrative context temper (F7c re-point)',
  }),
  Object.freeze({
    file: 'src/pdf/lib/liveWorld.js',
    provenance: 'embed',
    probe: 'const snap = s?.config?.primaryDeitySnapshot || null',
    note: 'the printed patron temper for the PDF/foundry surfaces (F7c re-point)',
  }),
]);

/**
 * The five callers of `describeDeityEffects`, which is the ONLY consumer whose
 * provenance splits. Four hand it an embed; `deityDraftPreview` hands it the raw
 * editor draft, and is therefore the single surface where an authored temper is
 * legible today.
 */
const EFFECTS_CALLERS_EMBED = Object.freeze([
  'src/components/map/PantheonPanel.jsx',
  'src/components/new/tabs/MagicTab.jsx',
  'src/components/settlement/faithPanelModel.js',
  'src/pdf/lib/liveWorld.js',
]);
const EFFECTS_CALLER_RAW = 'src/components/compendium/deityDraftPreview.js';

/**
 * THE RETIRED-FIELD DIVERGENCE REGISTER — src modules that make a SEMANTIC read of
 * the stored `temperamentAxis` instead of routing through the derivation.
 *
 * ⭐ EMPTIED BY W-FAITH F7c (the §866 docket — the display act this register's own
 * note reserved for "the next lane"). The four former readers — warResolve.js,
 * journalPages.js, liveWorld.js, FaithWar.jsx — now hear the derivation:
 * warResolve and liveWorld call `deityTemper` themselves (they joined CONSUMERS
 * above, with probes), and FaithWar/journalPages read the `temper` field off the
 * liveWorld slice. DECLARED DISPLAY SHIFT: a deity whose stored mirror disagreed
 * with its axes (or its authored word) now displays — and hands the AI narrative
 * context — the engine's answer. The register stays, EMPTY and shrink-only, so a
 * new stored-field read anywhere in src/ lands here and reds.
 */
const STORED_FIELD_READERS = Object.freeze([]);

/**
 * Modules that COPY embed fields without reading their meaning — the two commit-time
 * writer files, the intent builder, and the commit leaf that holds the shared builder
 * itself. They are passthrough, not consumers, and the uniformity pin below quantifies
 * over exactly this set. (Four files, four writers: `mutateEntities.js` holds both
 * `setPrimaryDeity` and `imposeCult`.)
 *
 * ⚠ THE FOURTH ENTRY ARRIVED BY A SPLIT, NOT BY A NEW WRITER (SUBSTRATE coupling wave 6,
 * REC-2). `deityCommitEmbed.js` is the roster, the picker and `commitDeityEmbed` lifted
 * out of `deitySnapshot.js` verbatim so the EAGER mutation router can persist an embed
 * without loading the authoring and restore halves. It MUST be in this set: the retired
 * `temperamentAxis` register below excludes writers by name, and a builder that copies
 * the retired field would otherwise be read as a new SEMANTIC consumer of it.
 */
const EMBED_WRITERS = Object.freeze([
  'src/domain/deityCommitEmbed.js',
  'src/domain/deitySnapshot.js',
  'src/domain/events/mutateEntities.js',
  'src/domain/worldPulse/applyWorldPulse.js',
]);

/**
 * The ONE module that names the six authored-character keys. Every other writer
 * spreads its picker, which is why the key names appear in one place rather than
 * four — the drift habitat F3c removed rather than policed.
 *
 * ⚠ THE ADDRESS MOVED WITH THE SYMBOL at SUBSTRATE wave 6 and the roster is still ONE
 * file. It is deliberately NOT re-exported from `deitySnapshot.js`: a re-export line
 * would be a second module naming the keys, which is precisely what the pin below
 * refuses — so the consumers follow the symbol to its home instead.
 */
const EMBED_ROSTER = 'src/domain/deityCommitEmbed.js';

/**
 * Writer 4, the INTENT builder — the one persisting writer that is not commit-time and
 * that spreads the shared picker directly rather than through `commitDeityEmbed`. It is
 * named separately from the roster because the two stopped being the same file when the
 * commit side moved to its own leaf.
 */
const INTENT_BUILDER = 'src/domain/deitySnapshot.js';

/**
 * The two shared builders, and the files that may name them. `commitDeityEmbed` is
 * what the three PERSISTING writers call; `authoredCharacterEmbedKeys` is the key
 * picker inside it, which the intent builder also spreads directly. Between them
 * there is exactly one copy of the embed's field list in the tree.
 */
const COMMIT_BUILDER = 'commitDeityEmbed(';
const KEY_PICKER = 'authoredCharacterEmbedKeys(';
/** The two files holding the three commit-time writers. */
const COMMIT_WRITER_FILES = Object.freeze([
  'src/domain/events/mutateEntities.js',
  'src/domain/worldPulse/applyWorldPulse.js',
]);

/**
 * The one module that writes an embed-SHAPED literal without being a writer: a
 * hardcoded demo deity for the region-wake replay, whose snapshot deliberately
 * carries only the fields its selectors read. It is a display FIXTURE, so it neither
 * persists anything nor can drift from the writers in a way any world would feel —
 * but it matches the structural scan below, so it is named here with its reason
 * rather than dodged by weakening the scan.
 */
const EMBED_LITERAL_FIXTURES = Object.freeze([
  'src/domain/display/regionWakeReplay.js',
]);

/** The write-time wall: it validates the key, it does not read it for meaning. */
const WRITE_TIME_WALL = 'src/domain/customContentSchema.js';

/** Generated manifest mirrors — the key appears as DATA, never as a read. */
const GENERATED_MIRRORS = Object.freeze([
  'src/domain/content/customContentAdmission.generated.js',
  'src/domain/content/customContentManifest.generated.js',
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

/** Every src module, repo-relative with forward slashes. */
const SRC_MODULES = walk(join(ROOT, 'src'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

const sourceOf = (rel) => readFileSync(join(ROOT, rel), 'utf8');
/** Source with comments stripped — a census must read code, not prose about it. */
const codeOf = (rel) => sourceOf(rel)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const CONSUMER_FILES = CONSUMERS.map((c) => c.file).sort();

describe('W-FAITH F2c · THE DENOMINATOR (every deityTemper reader, none unaccounted)', () => {
  test('the scanned module set is live and contains the seam\'s own home', () => {
    // THE ANTI-VACUITY ANCHOR. A relocation that emptied this walk would make every
    // census and every absence below pass while guarding nothing at all.
    expect(SRC_MODULES.length).toBeGreaterThan(500);
    expect(SRC_MODULES).toContain(OWNER);
    expect(codeOf(OWNER)).toContain('export function deityTemper');
  });

  test('the consumer census is EXACTLY the thirteen named modules', () => {
    // Eleven at F2c/F3c; W-FAITH F7c re-pointed the two self-resolving display
    // surfaces (warResolve, liveWorld) through the seam, so they joined.
    const found = SRC_MODULES.filter((rel) => {
      if (rel === OWNER) return false;
      return /\bdeityTemper\s*\(/.test(codeOf(rel));
    });
    expect(found).toEqual(CONSUMER_FILES);
    expect(found).toHaveLength(13);
  });

  test('every named consumer still carries its declared provenance probe', () => {
    // A census satisfied by a filename is the vacuity class this estate has already
    // been bitten by. Each row must still be able to point at the SOURCE LINE that
    // makes its provenance claim true.
    const missing = [];
    for (const row of CONSUMERS) {
      if (!codeOf(row.file).includes(row.probe)) missing.push(`${row.file}: ${row.probe}`);
    }
    expect(missing).toEqual([]);
  });

  test('every consumer routes through the seam — nobody re-implements the derivation', () => {
    // `deriveTemper` is exported for the seam's own use and for evidence harnesses.
    // A second caller in src would be a private temper with its own weights, free to
    // drift from the niche grid at the first re-tune and to skip the authored arm
    // entirely. That is the double-count risk in its structural form.
    const rivals = SRC_MODULES.filter((rel) => rel !== OWNER && /\bderiveTemper\b/.test(codeOf(rel)));
    expect(rivals).toEqual([]);
    // ANCHORED: the owner itself DOES define and call it, so the detector is proved
    // live rather than merely matching nothing anywhere.
    expect(/\bderiveTemper\s*\(/.test(codeOf(OWNER))).toBe(true);
  });
});

describe('W-FAITH F2c · THE NO-DOUBLE-COUNT LAW (D1: no site reads both words for one term)', () => {
  test('exactly ONE src module makes a semantic read of authoredTemper', () => {
    // D1's own words: "the authored word overrides only the temper-word consumers —
    // no double-count by construction, asserted by a test that no site reads both
    // for the same term". This is that test, and the construction is what makes it
    // provable: because the arm lives INSIDE the seam, a consumer physically cannot
    // hold both words unless it reaches around the seam for the raw key.
    //
    // F3c added ONE name to this set — the module that holds the embed roster. That it
    // is one file rather than four is the shared picker's doing: the three commit-time
    // writers spread `authoredCharacterEmbedKeys(...)` and never spell any of the six
    // keys, so the carry widened the COPY surface by a single module while leaving the
    // READ surface at exactly one.
    // ⚠ SUBSTRATE wave 6 MOVED that module (`deitySnapshot.js` → `deityCommitEmbed.js`)
    // without widening the set — the roster is a symbol at a new address, not a new
    // copy, and the count on both sides of this assertion is unchanged.
    const readers = SRC_MODULES.filter((rel) => /\bauthoredTemper\b/.test(codeOf(rel)));
    expect(readers).toEqual([
      ...GENERATED_MIRRORS,
      EMBED_ROSTER,
      WRITE_TIME_WALL,
      OWNER,
    ].sort());
  });

  test('the three non-seam mentions are a validator, generated data, and an embed roster — never a read', () => {
    // The write-time wall REFUSES a bad word; it never returns one as a temper.
    const wall = codeOf(WRITE_TIME_WALL);
    expect(wall).toContain('authoredTemper must be one of');
    expectAbsentWithAnchor(
      wall, 'deityTemper', 'authoredTemper',
      'the write-time wall does not also compute a derived temper',
    );
    // The generated mirrors carry the key as manifest DATA (a field spec), which is
    // why they match the scan at all. Neither imports the seam.
    for (const rel of GENERATED_MIRRORS) {
      expectAbsentWithAnchor(
        codeOf(rel), 'deityAxes.js', 'authoredTemper',
        `${rel} carries the key as data, not as a read`,
      );
    }
    // ⭐ THE THIRD, ADDED BY F3c. The embed roster names the key in a COPY list. It
    // must never grow an opinion about what the word MEANS — a writer that branched
    // on the temper would be a second derivation, which is the double-count D1 exists
    // to forbid, hiding inside a builder no consumer census would think to read.
    const roster = codeOf(EMBED_ROSTER);
    expect(roster).toContain('DEITY_AUTHORED_CHARACTER_KEYS');
    expectAbsentWithAnchor(
      roster, 'deityTemper', 'authoredTemper',
      'the embed roster copies the word, it never interprets it',
    );
    expectAbsentWithAnchor(
      roster, 'warlike', 'authoredTemper',
      'no temper VOCABULARY appears in the roster — it copies keys, not values',
    );
  });

  test('the seam answers with exactly one word — authored or derived, never blended', () => {
    // The runtime half of the same law. For a deity carrying BOTH an authored word
    // and axes that derive the opposite, there is one answer and it is the authored
    // one; nothing averages, sums, or returns a pair.
    const contradictory = { alignmentAxis: 'evil', lawAxis: 'chaotic', authoredTemper: 'peacelike' };
    expect(deityTemper(contradictory)).toBe('peacelike');
    expect(deityTemper({ alignmentAxis: 'evil', lawAxis: 'chaotic' })).toBe('warlike');
    expect(TEMPER_WORDS).toContain(deityTemper(contradictory));
  });
});

describe('W-FAITH F3c · PROVENANCE (how the authored word reaches each consumer — now, it does)', () => {
  test('every embed writer routes through a SHARED builder — the field list has one copy', () => {
    // ⭐ THE REPLACEMENT FOR F2c'S TRIPWIRE, and it guards the opposite property.
    // The carry is only safe while it is TOTAL: if one writer carried the keys and
    // another did not, an authored deity would read one temper after a DM assign and
    // another after an organic conversion — the divergence class this estate keeps a
    // writer-parity test for, and the exact bug the pre-T4 `lawAxis` gap WAS.
    //
    // F3c removed that bug's HABITAT rather than policing it: the three commit-time
    // writers no longer keep hand copies of the embed literal at all, so a writer
    // cannot half-carry the field list. It can only fail to call the builder, which
    // is a far louder mistake and is what this test sees.
    for (const rel of COMMIT_WRITER_FILES) {
      expect(codeOf(rel), `${rel} no longer routes through the shared commit builder`)
        .toContain(COMMIT_BUILDER);
    }
    // The intent builder spreads the key picker directly — it is not a commit-time
    // writer and carries its own (deliberately different) absent-field defaults.
    // ⚠ Since SUBSTRATE wave 6 the picker's HOME and the intent builder are different
    // files, so both are asserted: the leaf must still define it, and writer 4 must
    // still spread it. Asserting only one of the two would let the other quietly stop.
    expect(codeOf(INTENT_BUILDER)).toContain(KEY_PICKER);
    expect(codeOf(EMBED_ROSTER)).toContain(KEY_PICKER);
    // ⛔ THE LOAD-BEARING HALF: exactly one module BUILDS a deity embed. An embed
    // literal is recognisable by carrying its own identity beside the axes, so that
    // co-occurrence is the scan — a writer that grew its own copy back is the only
    // way the drift this file guards can return, and it would show up here.
    const buildsAnEmbed = SRC_MODULES.filter((rel) => {
      const code = codeOf(rel);
      return /_deityRef:/.test(code) && /temperamentAxis:\s/.test(code);
    });
    expect(buildsAnEmbed).toEqual([EMBED_ROSTER, ...EMBED_LITERAL_FIXTURES].sort());
    const naming = EMBED_WRITERS.filter((rel) => /\bDEITY_AUTHORED_CHARACTER_KEYS\b/.test(codeOf(rel)));
    expect(naming).toEqual([EMBED_ROSTER]);
  });

  test('twelve of the thirteen consumers read an embed — and the embed now carries the word', () => {
    const byEmbed = CONSUMERS.filter((c) => c.provenance === 'embed').map((c) => c.file);
    expect(byEmbed).toHaveLength(12);
    // The consequence, stated as arithmetic rather than as prose: the ten consumers
    // F2c measured as unreachable are exactly the ten the carry reached. Nothing was
    // re-pointed at a different source — the SOURCE started carrying the field.
    expect(CONSUMERS.filter((c) => c.provenance === 'raw-draft')).toEqual([]);
    expect(deityTemper(deitySnapshotFrom({
      alignmentAxis: 'evil', lawAxis: 'chaotic', authoredTemper: 'peacelike',
    }))).toBe('peacelike');
  });

  test('the ONE surface handed a raw authored definition is the deity draft preview', () => {
    // `describeDeityEffects` is the only consumer whose provenance splits, and this
    // is the split. Four callers pass an embed; this one passes the editor draft, so
    // an author who sets a temper sees its couplings in the preview immediately.
    const preview = codeOf(EFFECTS_CALLER_RAW);
    expect(preview).toContain('describeDeityEffects(draft');
    for (const rel of EFFECTS_CALLERS_EMBED) {
      expect(codeOf(rel)).toContain('describeDeityEffects(');
    }
    // …and the draft really is raw: the editor hands the component its whole draft
    // rather than the manifest-filtered authored subset.
    expect(codeOf('src/components/compendium/CustomContentEditor.jsx'))
      .toContain('<DeityEffectPreview draft={draft} />');
  });

  test('the temperamentAxis dual-write stays pointed at the DERIVATION', () => {
    // ⭐ THE SUBTLE ONE. `CustomContent.jsx` mints the retired compat mirror by
    // calling the seam — and it passes a TWO-KEY LITERAL, so the arm cannot reach
    // it. That is correct and must stay: D1 retires `temperamentAxis` forever, so
    // the mirror must go on recording what the AXES say, never what the author
    // chose. Spreading the draft into that call instead would quietly make the
    // retired field authored again — the exact shift D1 refused.
    const editor = codeOf('src/components/compendium/CustomContent.jsx');
    expect(editor).toContain('temperamentAxis: deityTemper({');
    expectAbsentWithAnchor(
      editor, 'authoredTemper', 'temperamentAxis',
      'the dual-write mirrors the derivation, never the authored word',
    );
  });
});

describe('W-FAITH F2c · THE PROVENANCE SPLIT, EXECUTED (not merely source-scanned)', () => {
  // ⭐ THE WHOLE CENSUS IN FOUR ASSERTIONS. Everything above reads source; this runs
  // the two paths side by side on ONE deity and shows them disagree — which is the
  // claim, and the kind of claim a source scan can only ever suggest.
  const EVIL_CHAOTIC = Object.freeze({
    name: 'Vharr', alignmentAxis: 'evil', lawAxis: 'chaotic',
    rankAxis: 'minor', temperamentAxis: 'warlike',
  });
  const WARLIKE_LINE = 'A warlike creed raises the realm\'s aggression';
  const PEACELIKE_LINE = 'A peacelike creed tempers the realm\'s aggression';

  test('the RAW-DRAFT path hears the authored word', () => {
    // The compendium preview is handed the editor draft, so an author who sets a
    // temper sees the coupling change under their hands.
    expect(describeDeityDraft(EVIL_CHAOTIC).couplings).toContain(WARLIKE_LINE);
    const authored = describeDeityDraft({ ...EVIL_CHAOTIC, authoredTemper: 'peacelike' }).couplings;
    expect(authored).toContain(PEACELIKE_LINE);
    expect(authored).not.toContain(WARLIKE_LINE);   // anchored: the line above proves the pipeline emits it
  });

  test('an authored NEUTRAL removes the tilt entirely, rather than losing to the axes', () => {
    // The sharpest case for §797.4. A truthiness-shaped arm returns 'neutral' too, so
    // what this really fixes is that neutral BEATS a derivation which says warlike —
    // and the observable is the temperament coupling disappearing from the preview.
    const neutral = describeDeityDraft({ ...EVIL_CHAOTIC, authoredTemper: 'neutral' }).couplings;
    // The alignment coupling below is the LIVENESS ANCHOR for both negatives: it
    // travels the same producer on the same call, so an emptied or re-shaped
    // coupling list reds on it instead of passing these two vacuously.
    expect(neutral).toContain('Evil-aligned worship lets corruption take root even without organized crime');
    // anchored: the alignment coupling immediately above proves the list is live and correctly shaped
    expect(neutral).not.toContain(WARLIKE_LINE);
    // anchored: same list, same call — the alignment coupling above is the liveness anchor
    expect(neutral).not.toContain(PEACELIKE_LINE);
  });

  test('⭐ the EMBED path NOW AGREES — the same authored deity reads peacelike through the writer', () => {
    // F2c'S FINDING, INVERTED BY F3c AND STILL EXECUTED. The identical assertion
    // that once proved the gap now proves the closing: one deity, one authored word,
    // two paths, ONE answer. Keeping the shape of the old test rather than deleting
    // it is deliberate — the two receipts are directly comparable, and the day the
    // builder drops the key again this reds in the same place it used to pass.
    const embedded = deitySnapshotFrom({ ...EVIL_CHAOTIC, authoredTemper: 'peacelike' });
    expect('authoredTemper' in embedded).toBe(true);
    expect(deityTemper(embedded)).toBe('peacelike');
    expect(describeDeityEffects(embedded)).toContain(PEACELIKE_LINE);
    // The control, on the SAME builder: a deity that authors nothing still derives,
    // so the arm is answering the author rather than answering everything.
    const bare = deitySnapshotFrom(EVIL_CHAOTIC);
    expect('authoredTemper' in bare).toBe(false);
    expect(deityTemper(bare)).toBe('warlike');
  });
});

describe('W-FAITH F2c · THE RETIRED FIELD (inert to the seam, still legible on four surfaces)', () => {
  test('the stored-field reader register is EMPTY — no src module reads the mirror for meaning', () => {
    // SHRINK-ONLY, and it shrank to nothing (W-FAITH F7c, the §866 docket). A new
    // file reading `.temperamentAxis` for meaning is the regression D1's inertness
    // promise exists to prevent, and it would land here.
    const semantic = SRC_MODULES.filter((rel) => {
      if (rel === WRITE_TIME_WALL || EMBED_WRITERS.includes(rel)) return false;
      return /[.[]['"]?temperamentAxis/.test(codeOf(rel));
    });
    expect(semantic).toEqual([...STORED_FIELD_READERS].sort());
    expect(STORED_FIELD_READERS).toHaveLength(0);
    // ANCHORED: the scan itself is proven able to see — an embed writer DOES
    // still carry the token, so an emptied SRC_MODULES walk cannot pass this.
    expect(EMBED_WRITERS.some((rel) => /temperamentAxis/.test(codeOf(rel)))).toBe(true);
  });

  test('no worldPulse engine module makes a semantic read of the retired field', () => {
    // The narrower, sharper claim: whatever the display surfaces do, the ENGINE is
    // clean. `applyWorldPulse.js` is excluded as a passthrough writer and is the
    // anchor that proves the filter is looking at the right directory.
    const engine = SRC_MODULES.filter((rel) => rel.startsWith('src/domain/worldPulse/'));
    expect(engine.length).toBeGreaterThan(50);
    const offenders = engine.filter(
      (rel) => !EMBED_WRITERS.includes(rel) && /[.[]['"]?temperamentAxis/.test(codeOf(rel)),
    );
    expect(offenders).toEqual([]);
    expect(engine).toContain('src/domain/worldPulse/applyWorldPulse.js');
  });

  test('the authored word is now AUDIBLE on the former stored-field surfaces (F7c, executed)', () => {
    // F2c recorded the opposite as "recorded, not fixed"; F7c fixed it, and the
    // claim is executed rather than source-scanned: one deity whose stored
    // mirror, axes and authored word all disagree, read through the same seam
    // call the two self-resolving surfaces now make. The display answer is the
    // authored word — the F3c provenance-split receipt, extended to display.
    const embedded = deitySnapshotFrom({
      name: 'Vharr', alignmentAxis: 'evil', lawAxis: 'chaotic',
      temperamentAxis: 'warlike', authoredTemper: 'peacelike',
    });
    expect(deityTemper(embedded)).toBe('peacelike');
    // …and the four former reader files no longer carry a semantic stored read
    // at all (the emptied register arm above is the census; this is the anchor
    // that the FILES still exist and still speak of temper at all).
    for (const rel of [
      'src/domain/display/warResolve.js',
      'src/foundry/journalPages.js',
      'src/pdf/lib/liveWorld.js',
      'src/pdf/sections/FaithWar.jsx',
    ]) {
      expect(/\btemper\b/i.test(codeOf(rel)), `${rel} no longer mentions temper at all`).toBe(true);
    }
  });
});

describe('W-FAITH F2c · NO SPURIOUS NEWS (the arm changes READS, never history)', () => {
  test('no news or receipt module is in the temper census at all', () => {
    // THE FIRST HALF OF THE PROOF, and it is structural rather than empirical: the
    // arm cannot mint a receipt it has no path to. Not one of the eleven consumers
    // is a news/herald/receipt module, so nothing that voices a transition reads a
    // temper word in the first place.
    const voicing = CONSUMER_FILES.filter((rel) => /News|Herald|herald|ReceiptPools/.test(rel));
    expect(voicing).toEqual([]);
    // ANCHORED: the estate really does have such modules, and plenty of them — so
    // this filter returning empty is a fact about the census, not about the regex.
    const newsModules = SRC_MODULES.filter((rel) => /News\.js$/.test(rel));
    expect(newsModules.length).toBeGreaterThan(10);
    expect(newsModules).toContain('src/domain/worldPulse/dispositionNews.js');
  });

  test('the "martial temper changes" family is a LEARNED-STOCK crossing, not a deity read', () => {
    // ⭐ THE HEADLINE NAME-COLLISION, disarmed. `disposition_martial_crossed` reads
    // as though a patron's temper moving would fire it. It cannot: the transition is
    // minted by the disposition LEDGER from banded war outcomes, and that module
    // imports exactly one thing — the banded-stock leaf. It has no deity, no
    // snapshot, and no route to the seam.
    const ledger = codeOf('src/domain/worldPulse/dispositionLedger.js');
    expect(ledger).toContain("from './bandedStock.js'");
    expect(ledger).toContain('band_crossing');
    expectAbsentWithAnchor(
      ledger, 'deityTemper', 'band_crossing',
      'the ledger that mints the crossing never reads a deity temper',
    );
    // The news leaf that voices it reads the deity only through the DOMAIN pressure
    // table (`deity_war_pressure`), which is a different authored field entirely.
    const news = codeOf('src/domain/worldPulse/dispositionNews.js');
    expect(news).toContain('disposition_martial_crossed');
    expect(news).toContain('deityPressureOf');
    expectAbsentWithAnchor(
      news, 'deityTemper', 'deityPressureOf',
      'the disposition news leaf reads the domain pressure, never the temper',
    );
  });

  test('nothing anywhere compares a PREVIOUS temper word to a current one', () => {
    // THE SECOND HALF. A change-receipt needs a delta, and no module keeps a prior
    // temper to difference against. So even a deity whose authored word contradicts
    // its derivation — reachable today only on the draft-preview surface — has no
    // machinery that could notice the disagreement and voice it.
    const deltas = SRC_MODULES.filter(
      (rel) => /\b(prev|prior|previous|last|old)Temper\b|\btemperChanged\b/i.test(codeOf(rel)),
    );
    expect(deltas).toEqual([]);
    // ANCHORED: the estate DOES keep prior-state comparisons of this exact shape for
    // other quantities, so an empty result is a fact about temper, not about the
    // pattern. `martialReadiness` differences a prior record every tick.
    expect(codeOf('src/domain/worldPulse/martialReadiness.js')).toContain('priorRec');
  });
});

describe('W-FAITH F2c · THE TWELFTH CONSUMER (it is not in src, and it is a COPY)', () => {
  test('the AI grounding bundle inlines deityTemper, and its copy carries the authored arm', () => {
    // ⭐ THE CONSUMER A src-ONLY CENSUS CANNOT SEE. `aiGroundingBundle.js` is an
    // esbuild BUNDLE of the domain layer, so it does not import the seam — it
    // contains a COPY of it, and three copied call sites. A denominator that
    // stopped at `src/` would have reported eleven consumers and missed the one
    // that speaks to the AI layer.
    //
    // The freshness tests catch a stale HASH. This catches a stale MEANING: if the
    // bundle is ever regenerated from a leaf without the arm, or hand-patched, the
    // AI layer starts reading a different temper from the engine and nothing else
    // would say so.
    const bundle = readFileSync(
      join(ROOT, 'supabase/functions/_shared/aiGroundingBundle.js'), 'utf8',
    );
    expect(bundle).toContain('function deityTemper(deity)');
    expect(bundle).toContain('deity.authoredTemper');
    // …and the copy agrees with the original on the guard, not just on the key.
    for (const word of TEMPER_WORDS) expect(bundle).toContain(`"${word}"`);
  });

  test('no OTHER edge bundle carries a temper read of its own', () => {
    // A second bundled copy would be a second temper, free to drift. The charter and
    // output-schema bundles carry the manifest as DATA (hence the key appears), which
    // is why the discriminator is the function definition rather than the word.
    const shared = readdirSync(join(ROOT, 'supabase/functions/_shared'))
      .filter((f) => f.endsWith('Bundle.js'))
      .sort();
    expect(shared.length).toBeGreaterThan(2);
    const withCopy = shared.filter(
      (f) => /function deityTemper\s*\(/.test(
        readFileSync(join(ROOT, 'supabase/functions/_shared', f), 'utf8'),
      ),
    );
    expect(withCopy).toEqual(['aiGroundingBundle.js']);
  });
});

describe('W-FAITH F2c · THE VOCABULARY MIRROR (the leaf restates it, so it must be pinned)', () => {
  test('TEMPER_WORDS equals the authoring vocabulary it mirrors', () => {
    // The leaf imports NOTHING by design, so it cannot import DEITY_TEMPER_KEYS and
    // must restate the three words. F1c pinned its three mirrors the same way; this
    // is the fourth, and without it the arm could start accepting a word the
    // authoring wall rejects, or rejecting one it accepts.
    expect([...TEMPER_WORDS].sort()).toEqual([...DEITY_TEMPER_KEYS].sort());
  });

  test('the mirror is exactly the derivation\'s own output range', () => {
    // Which is what makes the arm's guard non-vacuous: a word outside this set is
    // not merely unauthorised, it is a word the derivation could never produce.
    const produced = new Set([
      deityTemper({ alignmentAxis: 'evil', lawAxis: 'chaotic' }),
      deityTemper({ alignmentAxis: 'good', lawAxis: 'lawful' }),
      deityTemper({ alignmentAxis: 'neutral', lawAxis: 'neutral' }),
    ]);
    expect([...produced].sort()).toEqual([...TEMPER_WORDS].sort());
  });
});
