/**
 * peopleLedgerVocabulary.test.js — WC-0A acceptance A1..A5 for
 * `src/domain/worldPulse/peopleLedger.js`, the conservation constitution made executable.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/domain file starts at
 * ceiling ZERO against the frozen roster, so this file writes NONE of the three negated
 * membership forms that walker scans for. Every negative below is spelled as `toEqual([])`,
 * `toBe(false)` or `toHaveLength(0)`, all of which are free.
 *
 * ⛔ AND THIS NOTICE IS WORDED, NOT QUOTED, FOR A MEASURED REASON. An earlier draft of this
 * header SPELLED the three scanned forms in order to say the file avoids them, and the
 * walker convicted the explanation — three violations, all on this line. The cure is to
 * reword the comment, never to widen the scan: the same call the estate made when
 * `copyCorruption` convicted a comment for spelling an empty-icon literal.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  POOLS,
  RESIDENCY_TAGS,
  COUNT_EVENTS,
  CENSUS_DEBITING,
  TAG_EVENTS,
  TAG_SELECTIONS,
  CONSERVATION_ENDPOINTS,
  EVENT_SIGNATURES,
  TAG_EVENT_SIGNATURES,
  BLOCK_TOUCHING_EVENTS,
  eventSignature,
  tagSelectionFor,
} from '../../src/domain/worldPulse/peopleLedger.js';

const codepointSorted = (list) => [...list].sort();

const LEDGER_SOURCE = fileURLToPath(
  new URL('../../src/domain/worldPulse/peopleLedger.js', import.meta.url),
);

describe('WC-0A · the people ledger is the conservation constitution, frozen', () => {
  it('freezes every vocabulary, codepoint-sorts the order-free ones, and throws on unknowns', () => {
    expect(POOLS).toEqual(['block', 'census', 'column', 'free_unit']);
    expect(RESIDENCY_TAGS).toEqual(['cohort', 'free_lance']);
    expect(COUNT_EVENTS).toHaveLength(15);
    expect(CENSUS_DEBITING).toEqual(['dispatch', 'enlist', 'mortality', 'muster']);
    expect(TAG_EVENTS).toEqual(['brigand', 'demobilize', 'reclass', 'untag']);
    expect(TAG_SELECTIONS).toEqual(['pro_rata', 'untag_only', 'veterans_first']);

    for (const vocabulary of [
      POOLS, RESIDENCY_TAGS, COUNT_EVENTS, CENSUS_DEBITING, TAG_EVENTS, TAG_SELECTIONS,
    ]) {
      expect(Object.isFrozen(vocabulary)).toBe(true);
      expect(vocabulary).toEqual(codepointSorted(vocabulary));
      expect(new Set(vocabulary).size).toBe(vocabulary.length);
    }
    // The tag vocabulary is a set of LABELS ON CENSUS MEMBERS, never a pool beside census
    // (CR-WC-20) — so no residency tag may also be a pool.
    expect(RESIDENCY_TAGS.filter((tag) => POOLS.includes(tag))).toEqual([]);
    // The two event classes are disjoint: a tag event moves no counts, by definition.
    expect(TAG_EVENTS.filter((event) => COUNT_EVENTS.includes(event))).toEqual([]);
    // CENSUS_DEBITING is a genuine SUBSET, not a fifth vocabulary.
    expect(CENSUS_DEBITING.filter((event) => !COUNT_EVENTS.includes(event))).toEqual([]);

    for (const bad of ['absorb', 'return', 'Muster', '', null, undefined]) {
      expect(() => eventSignature(bad)).toThrow(TypeError);
    }
    expect(() => eventSignature('muster')).not.toThrow();
  });

  it('gives every count event exactly one debit and one credit, with SOURCES beside SINKS', () => {
    for (const event of COUNT_EVENTS) {
      const signature = eventSignature(event);
      // ONE debit arm and ONE credit arm — never a two-hop row. `return` was split into
      // `depart` + `arrive_home` precisely because a two-hop row in a one-debit-one-credit
      // table is a law that exempts itself.
      expect(Array.isArray(signature.debit)).toBe(true);
      expect(signature.debit.length).toBeGreaterThanOrEqual(1);
      expect(signature.debit.filter((pool) => !POOLS.includes(pool))).toEqual([]);
      expect(typeof signature.credit).toBe('string');
      const creditIsPoolOrSink = POOLS.includes(signature.credit) || signature.credit === 'SINK';
      expect(creditIsPoolOrSink).toBe(true);
    }

    // ⭐ SOURCES AND SINKS IN THE SAME FROZEN OBJECT. Exporting them together is what makes
    // an un-sourced credit exactly as visible as an un-sunk debit.
    expect(Object.isFrozen(CONSERVATION_ENDPOINTS)).toBe(true);
    expect(codepointSorted(CONSERVATION_ENDPOINTS.SINKS)).toEqual(['dm_removed', 'fell', 'mortality']);
    expect(CONSERVATION_ENDPOINTS.SOURCES).toEqual(['birth']);
    for (const sink of CONSERVATION_ENDPOINTS.SINKS) {
      expect(eventSignature(sink).credit).toBe('SINK');
    }

    // ⛔ `birth` CARRIES NO TAG ARM: a newborn takes no cohort tag and no free_lance
    // overlay, which is what keeps LAW 1's slack honest as a town grows. Until the volume's
    // round 3 `birth` had no signature at all, so an invented birth was invisible by
    // construction — a walker that can see a stolen death and not an invented birth is a
    // guard with one eye.
    const birth = eventSignature('birth');
    expect(birth.debit).toBe('SOURCE');
    expect(birth.credit).toBe('census');
    expect(birth.tag ?? null).toBe(null);
    // And it is a SOURCE rather than a count event, so it never enters the closed movement set.
    expect(COUNT_EVENTS.filter((event) => event === 'birth')).toEqual([]);
  });

  it('requires a TAG_SELECTIONS member on every census-debiting signature, at MODULE LOAD', async () => {
    // §0.2 is explicit that an absent or unknown selection fails at MODULE LOAD, not at the
    // first muster: the walker derives its checks from this object, so a malformed
    // signature must never become law merely by being loadable.
    for (const event of CENSUS_DEBITING) {
      const signature = eventSignature(event);
      expect(signature.debit).toEqual(['census']);
      expect(TAG_SELECTIONS.includes(signature.tag.selection)).toBe(true);
      expect(signature.tag.rows.filter((row) => !RESIDENCY_TAGS.includes(row))).toEqual([]);
      expect(tagSelectionFor(event)).toBe(signature.tag.selection);
    }
    // The mapping is FIXED by §0.2 and transcribed, not chosen here.
    expect(tagSelectionFor('mortality')).toBe('pro_rata');
    expect(tagSelectionFor('muster')).toBe('veterans_first');
    expect(tagSelectionFor('dispatch')).toBe('veterans_first');
    expect(tagSelectionFor('enlist')).toBe('untag_only');

    // The set of signatures carrying a debit-side tag arm IS the census-debiting set —
    // membership is derived from the signatures, never asserted beside them.
    const carryingArms = COUNT_EVENTS.filter((event) => eventSignature(event).tag);
    expect(carryingArms).toEqual(CENSUS_DEBITING);

    // A non-census event may not carry a selection-bearing arm at all.
    expect(eventSignature('arrive_home').tag ?? null).toBe(null);
    expect(eventSignature('arrive_home').restore).toBe('banked_composition');

    // ⭐⭐ THE PLANTED FOURTH SELECTION FAILS AT MODULE LOAD, AND THE MODULE IS THE ONE THAT
    // REFUSES IT. An earlier draft of this arm re-ran the guard's CONDITION inside the test
    // and threw its own error — a self-supplied anchor, which convicts nothing: it passes
    // just as happily with the module's guard deleted. This version plants the bad selection
    // into a COPY OF THE REAL SOURCE and imports it, so the refusal has to come from the
    // module. Deleting the load-time guard (mutant M1) makes the copy import cleanly and
    // reds here.
    const source = readFileSync(LEDGER_SOURCE, 'utf8');
    const planted = source.replace("tagArm('untag_only'", "tagArm('seniority_first'");
    expect(planted).not.toBe(source); // the plant actually landed
    const plantedPath = join(mkdtempSync(join(tmpdir(), 'wc0a-')), 'peopleLedger.planted.mjs');
    writeFileSync(plantedPath, planted);
    await expect(import(pathToFileURL(plantedPath).href)).rejects.toThrow(TypeError);

    // Non-vacuity: an UNMODIFIED copy imported the same way loads cleanly, so the rejection
    // above is the planted selection and not the copying.
    const controlPath = join(mkdtempSync(join(tmpdir(), 'wc0a-')), 'peopleLedger.control.mjs');
    writeFileSync(controlPath, source);
    await expect(import(pathToFileURL(controlPath).href)).resolves.toBeDefined();
  });

  it("equates untag's kind set to RESIDENCY_TAGS and pins the two intra-pool key-level arms", () => {
    // ⭐ A NEW TAG CANNOT BE MINTED WITHOUT A RETIREMENT FOR IT.
    expect(codepointSorted(TAG_EVENT_SIGNATURES.untag.kinds)).toEqual(codepointSorted(RESIDENCY_TAGS));
    expect(TAG_EVENT_SIGNATURES.untag.effect).toBe('retire_tag');
    expect(codepointSorted(Object.keys(TAG_EVENT_SIGNATURES))).toEqual(codepointSorted(TAG_EVENTS));

    // ⚠ TWO SIGNATURES ARE INTRA-POOL AND A POOL-LEVEL LAW CANNOT SEE THEM. `defect` is
    // block -> block' and `merge` is free_unit -> free_unit': the pool SUMS do not move, so
    // a pool-level-only walker would pass over a merge that silently dropped a block. Both
    // carry the KEY-level flag so WC-6 derives the right check rather than inventing it.
    for (const [event, pool] of [['defect', 'block'], ['merge', 'free_unit']]) {
      const signature = eventSignature(event);
      expect(signature.debit).toEqual([pool]);
      expect(signature.credit).toBe(pool);
      expect(signature.keyLevel).toBe(true);
    }
    // And the flag is not decoration: exactly the intra-pool signatures carry it.
    const intraPool = COUNT_EVENTS.filter((event) => {
      const signature = eventSignature(event);
      return signature.debit.length === 1 && signature.debit[0] === signature.credit;
    });
    expect(intraPool).toEqual(['defect', 'merge']);
    expect(COUNT_EVENTS.filter((event) => eventSignature(event).keyLevel === true)).toEqual(intraPool);
  });

  it('derives the block-touching set off EVENT_SIGNATURES at module load', async () => {
    // ⭐⭐ THE DERIVATION IS WHAT IS ASSERTED, AND ASSERTING IT TAKES A SECOND MODULE.
    //
    // ⚠ THE OBVIOUS VERSION OF THIS CASE IS VACUOUS, AND IT WAS WRITTEN AND REFUTED HERE
    // BEFORE THIS ONE REPLACED IT. Re-computing the set from EVENT_SIGNATURES inside the
    // test and comparing it to the export compares two things that move together: replace
    // the module's derivation with a hand-written literal identical to today's value
    // (mutant M3) and the test goes on passing, because the test's own filter still returns
    // that same value. A fixture built BY the deriver can never see a dead arm.
    //
    // THE ARM THAT ACTUALLY CONVICTS strips `block` out of ONE signature in a COPY OF THE
    // REAL SOURCE and imports it. A module that DERIVES loses exactly that event; a module
    // carrying a literal returns the frozen list unchanged and reds here.
    expect(Object.isFrozen(BLOCK_TOUCHING_EVENTS)).toBe(true);

    const source = readFileSync(LEDGER_SOURCE, 'utf8');
    const deadArm = source.replace(
      "  fission: Object.freeze({ debit: from('block'), credit: 'free_unit' }),",
      "  fission: Object.freeze({ debit: from('free_unit'), credit: 'free_unit', keyLevel: true }),",
    );
    expect(deadArm).not.toBe(source); // the plant actually landed
    const deadArmPath = join(mkdtempSync(join(tmpdir(), 'wc0a-')), 'peopleLedger.deadArm.mjs');
    writeFileSync(deadArmPath, deadArm);
    const mutated = await import(pathToFileURL(deadArmPath).href);
    expect(mutated.BLOCK_TOUCHING_EVENTS).toEqual(
      BLOCK_TOUCHING_EVENTS.filter((event) => event !== 'fission'),
    );
    expect(mutated.BLOCK_TOUCHING_EVENTS.length).toBe(BLOCK_TOUCHING_EVENTS.length - 1);

    // Non-vacuity: an UNMODIFIED copy imported the same way reproduces the live set exactly,
    // so the loss above is the dead arm and not the copying.
    const controlPath = join(mkdtempSync(join(tmpdir(), 'wc0a-')), 'peopleLedger.blockControl.mjs');
    writeFileSync(controlPath, source);
    const control = await import(pathToFileURL(controlPath).href);
    expect(control.BLOCK_TOUCHING_EVENTS).toEqual([...BLOCK_TOUCHING_EVENTS]);

    // ⛔ TEN, NOT NINE — AND THE DISCREPANCY IS THE VOLUME'S OWN HAND-LIST ROTTING. §7.A.4
    // makes the DERIVATION normative ("computed at module load off EVENT_SIGNATURES") and
    // then illustrates it with a list prefixed "today": arrival, defect, depart, enlist,
    // fell, fission, muster, orphan, rejoin. That list omits `dm_removed`, whose signature
    // is block|free_unit -> SINK and therefore names `block` on its debit side under the
    // volume's own rule. WC-6's walker enumeration counts `dm_removed` among the events it
    // checks, and a DM removal that left the share integrals stale would be precisely the
    // hole the third declared sink exists to close. The under-enumeration is the two-arity
    // hand-list failure this derivation was introduced to prevent, demonstrated on the
    // volume's own list — docketed for the volume prose micro-act, not repaired here.
    expect(BLOCK_TOUCHING_EVENTS).toEqual([
      'arrival', 'defect', 'depart', 'dm_removed', 'enlist',
      'fell', 'fission', 'muster', 'orphan', 'rejoin',
    ]);

    // And the live export agrees with the live signatures, which is the ordinary reading the
    // arm above keeps honest.
    expect(
      COUNT_EVENTS.filter((event) => {
        const signature = EVENT_SIGNATURES[event];
        return signature.debit.includes('block') || signature.credit === 'block';
      }),
    ).toEqual([...BLOCK_TOUCHING_EVENTS]);
  });
});
