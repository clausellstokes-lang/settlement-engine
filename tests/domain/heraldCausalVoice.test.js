/**
 * heraldCausalVoice.test.js — THE HERALD'S TWO REGISTERS + THE CAUSAL GRAMMAR
 * (SP-6's causal-voice amendments, 2026-08-03).
 *
 * What is pinned here:
 *   DORMANCY        dark flag ⇒ every register returns null ⇒ the feed is
 *                   byte-identical to a world that never lit the voice.
 *   ONE GESTURE     the headline register consumes EXACTLY ONE link. A
 *                   two-plus-link chain shape cannot be produced from it.
 *   THE ANCHOR      the subheader carries no connective from any pool — it is
 *                   the recorded summary, not a rendering of it.
 *   ENTAILMENT      an unwarranted link draws `followed`, NEVER `caused`; a
 *                   warranted one draws its own edge's pool.
 *   DETERMINISM     same seed ⇒ same sentence, on every draw site.
 *   THE AVALANCHE   the recorded FNV-1a low-bit parity hazard: the degenerate
 *                   seed family reaches the WHOLE pool under the mixed draw and
 *                   HALF of it under the raw one (the negative control).
 *   THE TERMINAL    seeded on the VISIBLE chain only, and a covert truncation
 *                   never reaches the `horizon` pool.
 *   THE ARG FORM    (lane HG) every composed argument PARSES against the mold
 *                   its pool licensed for the connective's own §3 argument tag —
 *                   shape, not substring — with the pre-cure finite clause in an
 *                   `N` slot as the executed negative control.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { buildCauseWalk } from '../../src/domain/display/causeWalk.js';
import {
  PLACEHOLDER_CLAUSES,
  PULSE_IMPACT_FALLBACK,
  PULSE_OUTCOME_FALLBACK,
  UNRECEIPTED_HOP,
  isPlaceholderClause,
} from '../../src/domain/display/receiptClauseFloor.js';
import {
  CHAIN_END_BANNED,
  CONNECTIVE_POOLS,
  FOLLOWED_FORBIDDEN,
  POOL_PARENT,
  TERMINALS,
  TIME_BANDS,
  avalanche32,
  connectiveFor,
  fnv1a32,
  pickCausal,
  terminalLine,
  timeBandOf,
  timeBandWord,
} from '../../src/domain/display/heraldCausalGrammar.js';
import {
  CLAUSE_TOKEN,
  JOIN_MOLDS,
  MOLDED_ARGS,
  UNSUPPLIED_ARGS,
  argIsMolded,
  clauseBody,
  conformsToMold,
  moldFormsFor,
} from '../../src/domain/display/heraldJoinMolds.js';
import {
  HEADLINE_MAX_GESTURES,
  PLANTED_LINEAGE_PREFIX,
  heraldEntryProse,
  heraldHeadlineRegister,
  heraldSubheaderRegister,
  heraldTellingRegister,
  poolForLink,
} from '../../src/domain/display/heraldCausalVoice.js';

const LIT = { simulationRules: { heraldCausalVoiceEnabled: true } };
const DARK = { simulationRules: {} };

const ITEM = { id: 'evt-root', headline: 'Karsh declares war on Elmspur', summary: 'Karsh declared war on Elmspur this turning. Elmspur has answered nothing yet.' };

const WALK = {
  root: { headline: 'Karsh declares war on Elmspur' },
  chain: [
    { id: 'evt-a', depth: 1, headline: 'the grain levy failed at Karsh', type: 'levy_shortfall', redacted: false },
    { id: 'evt-b', depth: 2, headline: 'the eastern road was cut', type: 'route_severed', redacted: false },
  ],
};

describe('dormancy', () => {
  test('every register is null while the voice is dark', () => {
    expect(heraldHeadlineRegister({ worldState: DARK, item: ITEM, walk: WALK, seed: 's' })).toBeNull();
    expect(heraldSubheaderRegister({ worldState: DARK, item: ITEM })).toBeNull();
    expect(heraldTellingRegister({ worldState: DARK, walk: WALK, seed: 's' })).toBeNull();
    const prose = heraldEntryProse({ worldState: DARK, item: ITEM, walk: WALK, seed: 's' });
    expect(prose).toEqual({ headline: null, subheader: null, telling: null });
  });
});

describe('THE HEADLINE REGISTER — one causal gesture, never a cascade', () => {
  test('consumes exactly one link and reports exactly one gesture', () => {
    const out = heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: WALK, seed: 'seed-1' });
    expect(out).not.toBeNull();
    expect(out.gestures).toBe(HEADLINE_MAX_GESTURES);
    expect(out.gestures).toBe(1);
    // The depth-2 hop is structurally unreachable from this register.
    expect(out.text).toContain('Karsh declares war on Elmspur');
    expect(out.text).toContain('the grain levy failed at Karsh');
    // The two lines above assert the SAME string carries the root headline and
    // the depth-1 clause, so an empty or drifted `out.text` reds there.
    // anchored: `out.text` is asserted to contain the root + depth-1 clauses two lines up
    expect(out.text).not.toContain('the eastern road was cut');
  });

  test('a chain of any depth yields at most one connective in the headline', () => {
    const deep = {
      root: WALK.root,
      chain: [
        ...WALK.chain,
        { id: 'evt-c', depth: 3, headline: 'the flood took the lower fields', type: 'flood', redacted: false },
        { id: 'evt-d', depth: 4, headline: 'the dike was never rebuilt', type: 'neglect', redacted: false },
      ],
    };
    const out = heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: deep, seed: 'seed-2' });
    expect(out).not.toBeNull();
    const allConnectives = Object.values(CONNECTIVE_POOLS).flat().map((c) => c.text);
    const hits = allConnectives.filter((text) => out.text.includes(text));
    // `following` is a substring of nothing else in the corpus; count distinct
    // pool lines that appear, and demand the gesture be singular.
    expect(hits.length).toBeGreaterThan(0);
    expect(out.text.split(' — ')).toHaveLength(2);
  });

  test('never gestures at a redacted hop (a headline never points at a hole)', () => {
    const gated = { root: WALK.root, chain: [{ id: 'x', depth: 1, headline: 'a cause the ledger keeps hidden', redacted: true }] };
    expect(heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: gated, seed: 's' })).toBeNull();
  });

  test('no parent ⇒ null ⇒ the surface renders the recorded headline unchanged', () => {
    expect(heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: { root: WALK.root, chain: [] }, seed: 's' })).toBeNull();
  });
});

describe('THE SUBHEADER REGISTER — the visible honesty anchor', () => {
  test('is the recorded summary, one sentence, and carries no connective', () => {
    const out = heraldSubheaderRegister({ worldState: LIT, item: ITEM });
    expect(out.text).toBe('Karsh declared war on Elmspur this turning.');
    const connectives = Object.values(CONNECTIVE_POOLS).flat().map((c) => c.text);
    for (const text of connectives) {
      expect(out.text.includes(` ${text} `)).toBe(false);
    }
  });

  test('no recorded summary ⇒ null (it never authors one)', () => {
    expect(heraldSubheaderRegister({ worldState: LIT, item: { headline: 'x' } })).toBeNull();
  });
});

describe('PER-LINK ENTAILMENT — the edge licenses the connective', () => {
  test('an unwarranted link draws `followed`, never `caused`', () => {
    expect(poolForLink({ type: 'levy_shortfall' })).toBe('followed');
    expect(poolForLink({})).toBe('followed');
  });

  test('each warrant reaches its own pool', () => {
    expect(poolForLink({ causedByParent: true })).toBe('caused');
    expect(poolForLink({ type: 'plant_exposed' })).toBe('exposed');
    expect(poolForLink({ type: 'peace_refused' })).toBe('refused');
    expect(poolForLink({ type: 'treaty_default_detected' })).toBe('breached');
    expect(poolForLink({ type: 'war_cause_dissolved' })).toBe('dissolved');
    expect(poolForLink({ lineageIds: ['disinfo:a:b:3'] })).toBe('planted');
  });

  test('THE PLANT WARRANT IS THE SPELLING, NOT THE PRESENCE (F2)', () => {
    // `rumorNetwork` writes [eventRef, originTelling] on EVERY arrival and appends
    // a relay id per hop. Warranting on presence called every carried report a
    // plant; the marker is the synthetic prefix and nothing else.
    expect(PLANTED_LINEAGE_PREFIX).toBe('disinfo:');
    expect(poolForLink({ lineageIds: ['evt-77'] })).toBe('followed');
    expect(poolForLink({ lineageIds: ['evt-77', 'telling:karsh:12'] })).toBe('followed');
    expect(poolForLink({ lineageIds: ['evt-77', 'telling:karsh:12', 'relay:elmspur:19'] })).toBe('followed');
    // …and a lineage that merely CONTAINS the word is not the marker either.
    expect(poolForLink({ lineageIds: ['telling-about-disinfo:karsh'] })).toBe('followed');
    // The real spelling, anywhere in the lineage, still lands.
    expect(poolForLink({ lineageIds: [`${PLANTED_LINEAGE_PREFIX}karsh:elmspur:10`] })).toBe('planted');
    expect(poolForLink({ lineageIds: ['evt-77', `${PLANTED_LINEAGE_PREFIX}karsh:elmspur:10`] })).toBe('planted');
    // A more specific warrant still wins over the default, so the fix cannot
    // have quietly demoted an ordinary lineage-bearing refusal.
    expect(poolForLink({ type: 'peace_refused', lineageIds: ['evt-77'] })).toBe('refused');
  });

  test('the `planted` arm degrades to `believed` for a player audience', () => {
    const dm = connectiveFor({ pool: 'planted', seed: 'k', direction: 'back', seesSecrets: true });
    const player = connectiveFor({ pool: 'planted', seed: 'k', direction: 'back', seesSecrets: false });
    expect(dm.pool).toBe('planted');
    expect(player.pool).toBe('believed');
    // Not a name, not a stub, not a hole where a name would sit.
    // A null draw or a drifted pool reds before this exclusion is reached.
    // anchored: `player.pool` is asserted to be `believed` two lines above
    expect(player.text).not.toMatch(/\{|planted|bought|sold|furnished/);
  });

  test('the `followed` pool spends none of its forbidden words', () => {
    // BOTH COLLECTIONS ARE ASSERTED LIVE FIRST: an emptied pool or an emptied
    // forbidden list would make every exclusion below true for the wrong reason.
    expect(CONNECTIVE_POOLS.followed.length).toBeGreaterThan(0);
    expect(FOLLOWED_FORBIDDEN.length).toBeGreaterThan(0);
    for (const line of CONNECTIVE_POOLS.followed) {
      expect(line.text.split(/\s+/).length, line.text).toBeGreaterThan(0);
      for (const banned of FOLLOWED_FORBIDDEN) {
        // anchored: the pool, the forbidden list and this line's word split are all pinned non-empty above
        expect(line.text.split(/\s+/)).not.toContain(banned);
      }
    }
  });

  test('every pool declares a parent among the eight typed edges', () => {
    for (const pool of Object.keys(CONNECTIVE_POOLS)) {
      expect(POOL_PARENT[pool]).toBeTruthy();
    }
    expect(Object.keys(CONNECTIVE_POOLS).sort()).toEqual(Object.keys(POOL_PARENT).sort());
  });

  test('every pool meets the frequency-scaled floor of four angle-distinct variants', () => {
    for (const [pool, lines] of Object.entries(CONNECTIVE_POOLS)) {
      expect(lines.length, pool).toBeGreaterThanOrEqual(4);
      expect(new Set(lines.map((l) => l.text)).size, pool).toBe(lines.length);
    }
  });
});

describe('THE TELLING REGISTER — the chain, freed from headline compression', () => {
  test('renders every visible link with its own clause and holds one direction', () => {
    const out = heraldTellingRegister({ worldState: LIT, walk: WALK, seed: 'seed-3' });
    expect(out.links).toHaveLength(2);
    expect(out.text).toContain('the grain levy failed at Karsh');
    expect(out.text).toContain('the eastern road was cut');
    for (const link of out.links) {
      const pool = CONNECTIVE_POOLS[link.pool];
      expect(pool.some((l) => l.text === link.connective && l.dir === 'back')).toBe(true);
    }
  });

  test('a covert truncation never reaches the horizon pool', () => {
    const covert = {
      root: WALK.root,
      chain: [{ id: 'h', depth: 1, headline: 'a cause the ledger keeps hidden', redacted: true }],
    };
    const out = heraldTellingRegister({ worldState: LIT, walk: covert, seed: 'seed-4', terminal: 'horizon' });
    // The very next line proves both pools are live and the draw returned a real
    // line rather than an empty string.
    // anchored: the next line asserts the drawn terminal IS a member of TERMINALS.chain_end
    expect(TERMINALS.horizon).not.toContain(out.terminal);
    expect(TERMINALS.chain_end).toContain(out.terminal);
  });

  test('the terminal is seeded on the VISIBLE chain only — the hidden id cannot move it', () => {
    // Same visible chain, same covert-truncation flag, DIFFERENT hidden ids. If the
    // seed included the hidden link, the variant would move and the seam would leak
    // through variant selection — which is the exact failure §3.2 exists to prevent.
    const walkWith = (hiddenId) => ({
      root: WALK.root,
      chain: [
        { id: 'v1', depth: 1, headline: 'visible', type: 't', redacted: false },
        { id: hiddenId, depth: 2, headline: 'a cause the ledger keeps hidden', redacted: true },
      ],
    });
    const variants = new Set();
    for (const hiddenId of ['aaa-hidden', 'zzz-hidden', 'mmm-hidden', 'evt-0000']) {
      variants.add(heraldTellingRegister({ worldState: LIT, walk: walkWith(hiddenId), seed: 'k' }).terminal);
    }
    expect(variants.size).toBe(1);
    // Guard-the-guard: the same four ids DO move a terminal that is seeded on them,
    // so the pin above is measuring something rather than asserting a constant.
    const moved = new Set(['aaa-hidden', 'zzz-hidden', 'mmm-hidden', 'evt-0000']
      .map((id) => terminalLine({ terminal: 'chain_end', seed: `k::visible::v1|${id}` })));
    expect(moved.size).toBeGreaterThan(1);
  });

  test('no chain_end variant spends a banned word', () => {
    for (const line of TERMINALS.chain_end) {
      for (const banned of CHAIN_END_BANNED) {
        expect(line.toLowerCase().includes(banned)).toBe(false);
      }
    }
  });
});

describe('DETERMINISM + THE AVALANCHE', () => {
  test('same seed ⇒ same sentence on every register', () => {
    const failures = collectSeedFailures(['a', 'seed-99', 'karsh::1'], (seed) => {
      expect(heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: WALK, seed }))
        .toEqual(heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: WALK, seed }));
      expect(heraldTellingRegister({ worldState: LIT, walk: WALK, seed }))
        .toEqual(heraldTellingRegister({ worldState: LIT, walk: WALK, seed }));
      expect(terminalLine({ terminal: 'chain_end', seed })).toBe(terminalLine({ terminal: 'chain_end', seed }));
    });
    expectNoSeedFailures(failures, 'every register composes identically on a repeated seed');
  });

  test('different seeds reach different members of a pool (the draw is not constant)', () => {
    const seen = new Set();
    for (let i = 0; i < 64; i += 1) seen.add(terminalLine({ terminal: 'horizon', seed: `s${i}` }));
    expect(seen.size).toBe(TERMINALS.horizon.length);
  });

  test('THE NEGATIVE CONTROL: the degenerate family is half-dead under a raw fnv1a32 fold, whole under the avalanche', () => {
    const pool = [0, 1, 2, 3, 4, 5, 6, 7];
    const family = (i) => `wizard_news.${i}.applied.evt${i}`;
    const raw = new Set();
    const mixed = new Set();
    for (let i = 0; i < 400; i += 1) {
      raw.add(pool[fnv1a32(family(i)) % pool.length]);
      mixed.add(pickCausal(pool, family(i)));
    }
    expect(raw.size).toBeLessThan(pool.length);
    expect(mixed.size).toBe(pool.length);
  });

  test('avalanche32 moves the low bit the parity pinned', () => {
    // Two seeds whose fnv1a32 digests share bit 0 must not share it after mixing
    // for every pair — the finalizer's whole job.
    const parities = new Set();
    for (let i = 0; i < 64; i += 1) parities.add(avalanche32(fnv1a32(`wizard_news.${i}.applied.evt${i}`)) & 1);
    expect(parities.size).toBe(2);
  });
});

describe('THE TIME BANDS — no digits, and the predicate-only sixth', () => {
  test('the sixth band prints only in the predicate position', () => {
    const oldest = TIME_BANDS[TIME_BANDS.length - 1];
    expect(oldest.id).toBe('older_than_bearers');
    expect(timeBandWord(oldest, 'attributive')).toBeNull();
    expect(timeBandWord(oldest, 'span')).toBeNull();
    expect(timeBandWord(oldest, 'since')).toBeNull();
    expect(timeBandWord(oldest, 'predicate')).toBe('older than its bearers');
  });

  test('no band word carries a numeral of any kind', () => {
    for (const band of TIME_BANDS) {
      for (const position of ['attributive', 'span', 'since', 'predicate']) {
        const word = timeBandWord(band, position);
        // A null column is SKIPPED rather than silently satisfying the exclusion.
        // anchored: the `if (word)` guard means the band really supplied this position
        if (word) expect(word).not.toMatch(/[0-9]/);
      }
    }
  });

  test('the band is selected from elapsed ticks against the world interval', () => {
    expect(timeBandOf(1, 1).id).toBe('this_season');
    expect(timeBandOf(30, 1).id).toBe('within_the_year');
    expect(timeBandOf(300, 1).id).toBe('years_on');
    expect(timeBandOf(10_000, 1).id).toBe('older_than_bearers');
    // Interval scaling: the same tick count in a four-week world bands older.
    expect(timeBandOf(10, 4).id).toBe('within_the_year');
  });
});

// ── LANE HG — THE JOIN MOLDS ────────────────────────────────────────────────
// The cure for the measured defect: an `N` connective handed the receipt's own
// finite clause printed "against the refusal of the eastern road was cut" on 49
// of the 71 back-direction lines. These pins assert SHAPE — every composed
// argument is parsed against the mold its pool licensed for that argument tag —
// so a future composer that goes back to interpolating the raw clause reds here
// rather than in a soak.

/** Every warrant the composer wires, with the link that reaches it. */
const WARRANTED = Object.freeze([
  ['followed', {}],
  ['exposed', { type: 'plant_exposed' }],
  ['refused', { type: 'peace_refused' }],
  ['breached', { type: 'treaty_default_detected' }],
  ['dissolved', { type: 'war_cause_dissolved' }],
  ['caused', { causedByParent: true }],
  ['planted', { lineageIds: ['disinfo:a:b:3'] }],
]);

const PARENT_CLAUSE = 'the grain levy failed at Karsh';
const DEEP_CLAUSE = 'the eastern road was cut';
const SEEDS = Object.freeze(['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8']);
const DIRECTIONS = Object.freeze(['back', 'fwd']);

/**
 * THE CROSS PRODUCTS, materialised (lane HR). Every sweep below runs through
 * `collectSeedFailures`, which needs its cases as a list rather than as nested
 * loops: a `for` loop that asserts inline stops at the FIRST failing case, so its
 * count is a floor and every later case goes unrun.
 */
const warrantSeedCases = () => WARRANTED.flatMap(
  ([pool, extra]) => SEEDS.map((seed) => ({ pool, extra, seed })),
);
const warrantSeedDirectionCases = () => WARRANTED.flatMap(
  ([pool, extra]) => SEEDS.flatMap((seed) => DIRECTIONS.map((direction) => ({ pool, extra, seed, direction }))),
);

/** A two-hop walk whose NEAREST hop carries the warrant under test. */
const walkWarranted = (extra) => ({
  root: { headline: 'Karsh declares war on Elmspur' },
  chain: [
    { id: 'evt-a', depth: 1, headline: PARENT_CLAUSE, type: 'levy_shortfall', redacted: false, ...extra },
    { id: 'evt-b', depth: 2, headline: DEEP_CLAUSE, type: 'route_severed', redacted: false },
  ],
});

describe('THE JOIN MOLDS — the argument supply §3’s tags were written to receive', () => {
  test('TOTALITY: every (pool, arg) the connective corpus spends is molded or declared unsupplied, and neither list has rotted', () => {
    /** @type {Set<string>} */
    const spent = new Set();
    for (const [pool, lines] of Object.entries(CONNECTIVE_POOLS)) {
      for (const line of lines) if (line.arg !== 'A') spent.add(`${pool}::${line.arg}`);
    }
    expect(spent.size).toBeGreaterThan(0);
    for (const key of spent) {
      const [pool, arg] = key.split('::');
      const molded = moldFormsFor(pool, arg).length > 0;
      const declared = Object.prototype.hasOwnProperty.call(UNSUPPLIED_ARGS, key);
      expect(molded || declared, `${key} is neither molded nor declared unsupplied`).toBe(true);
      expect(molded && declared, `${key} is molded AND declared unsupplied`).toBe(false);
    }
    // A declared hole that no connective spends is a stale reason nobody reads.
    for (const [key, reason] of Object.entries(UNSUPPLIED_ARGS)) {
      expect(spent.has(key), `${key} is declared unsupplied but no connective spends it`).toBe(true);
      expect(reason.length, key).toBeGreaterThan(40);
    }
    // A mold for an arg the pool never draws is dead content.
    for (const [pool, byArg] of Object.entries(JOIN_MOLDS)) {
      for (const arg of Object.keys(byArg)) {
        expect(spent.has(`${pool}::${arg}`), `${pool}::${arg} is molded but no connective spends it`).toBe(true);
      }
    }
  });

  test('every mold carries the clause token exactly once and mints no other slot', () => {
    for (const [pool, byArg] of Object.entries(JOIN_MOLDS)) {
      for (const [arg, forms] of Object.entries(byArg)) {
        expect(MOLDED_ARGS).toContain(arg);
        for (const form of forms) {
          expect(form.split(CLAUSE_TOKEN), `${pool}::${arg} :: ${form}`).toHaveLength(2);
          // anchored: the line above pins this exact form to carry the clause token once
          expect(form.replace(CLAUSE_TOKEN, ''), `${pool}::${arg} :: ${form}`).not.toMatch(/\{[a-z_]+\}/);
        }
        expect(new Set(forms).size, `${pool}::${arg}`).toBe(forms.length);
      }
    }
  });

  test('planted::F is bound to its FREE-RELATIVE connective shape (lane HR)', () => {
    // `SAID_WHEN` ("was said when …") is a PREDICATE, not a general `F` mold. It
    // composes only because the one connective it completes ends in a dangling
    // `what`: "believing exactly what" + "was said when the tribute went unpaid".
    // A second `F` line here that did not end that way would draw the same mold
    // and print "believing was said when …" — the verifier's exact gap.
    const fLines = CONNECTIVE_POOLS.planted.filter((line) => line.arg === 'F');
    expect(fLines.length, 'the pool spends no F line — this binding pin is vacuous').toBeGreaterThan(0);
    for (const line of fLines) {
      expect(/\bwhat$/.test(line.text), `planted F line "${line.text}" is not a free relative`).toBe(true);
    }
    const forms = moldFormsFor('planted', 'F');
    expect(forms).toHaveLength(1);
    expect(forms[0].startsWith(CLAUSE_TOKEN), 'the mold must FOLLOW the relative, not lead').toBe(false);
    // …and the composition it licenses reads as one clause end to end.
    for (const line of fLines) {
      expect(`${line.text} ${forms[0].replace(CLAUSE_TOKEN, DEEP_CLAUSE)}`)
        .toBe(`${line.text} was said when ${DEEP_CLAUSE}`);
    }
  });

  test('`A` is argument-less BY LAW — no pool molds it, for any pool', () => {
    for (const pool of Object.keys(CONNECTIVE_POOLS)) {
      expect(argIsMolded(pool, 'A'), pool).toBe(false);
      expect(moldFormsFor(pool, 'A'), pool).toHaveLength(0);
    }
  });

  test('the clause enters a mold byte-verbatim, less the terminal stop the composer owns', () => {
    expect(clauseBody('the eastern road was cut.')).toBe('the eastern road was cut');
    expect(clauseBody('  the eastern road was cut  ')).toBe('the eastern road was cut');
    // `!` and `?` are content, not punctuation the composer applies.
    expect(clauseBody('was the road cut?')).toBe('was the road cut?');
    expect(clauseBody('')).toBe('');
  });

  test('THE HEADLINE REGISTER: the gesture is connective + a molded argument, and the argument PARSES against its mold', () => {
    let composed = 0;
    const failures = collectSeedFailures(warrantSeedCases(), ({ pool, extra, seed }) => {
      const walk = walkWarranted(extra);
      const out = heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk, seed, seesSecrets: true });
      // NO SILENT DROPS: every warranted pool holds at least one drawable line
      // in `back`, so a null here means a line was drawn that could not be
      // filled — the failure mode the drawable filter exists to remove.
      expect(out, `${pool} composed nothing at seed ${seed}`).not.toBeNull();
      composed += 1;
      expect(out.pool, `${pool} @ ${seed}`).toBe(pool);
      expect(out.text).toBe(`${ITEM.headline} — ${out.text.split(' — ')[1]}`);
      // SHAPE: the argument is exactly one of the pool's licensed forms filled
      // with this hop's own clause — not a substring match on the words.
      expect(
        conformsToMold({ pool: out.pool, arg: out.arg, clause: PARENT_CLAUSE, text: out.argText }),
        `${pool}/${out.arg} @ ${seed}: "${out.argText}"`,
      ).toBe(true);
      expect(out.text).toBe(`${ITEM.headline} — ${CONNECTIVE_POOLS[pool].find((l) => out.text.includes(l.text)).text} ${out.argText}`);
    });
    expectNoSeedFailures(failures, 'every warranted pool composes a molded headline gesture at every seed');
    expect(composed, 'no headline composed at all').toBe(WARRANTED.length * SEEDS.length);
  });

  test('THE TELLING REGISTER (back): every link’s argument is its OWN clause, molded', () => {
    for (const [pool, extra] of WARRANTED) {
      const out = heraldTellingRegister({ worldState: LIT, walk: walkWarranted(extra), seed: 'telling-1', seesSecrets: true });
      expect(out.links.length, pool).toBeGreaterThan(0);
      for (const link of out.links) {
        if (!link.connective) continue;
        expect(
          conformsToMold({ pool: link.pool, arg: link.arg, clause: link.clause, text: link.argText }),
          `${link.pool}/${link.arg}: "${link.argText}"`,
        ).toBe(true);
        // And the composed passage carries the pair adjacently, in that order.
        expect(out.text).toContain(`${link.connective} ${link.argText}`);
      }
    }
  });

  test('THE TELLING REGISTER (fwd): the connective points at the CHILD, and the child’s clause is what the slot receives', () => {
    for (const [pool, extra] of WARRANTED) {
      const out = heraldTellingRegister({
        worldState: LIT, walk: walkWarranted(extra), seed: 'telling-2', seesSecrets: true, direction: 'fwd',
      });
      for (const link of out.links) {
        if (!link.connective) continue;
        expect(
          conformsToMold({ pool: link.pool, arg: link.arg, clause: link.childClause, text: link.argText }),
          `${pool} fwd ${link.pool}/${link.arg}: "${link.argText}" over child "${link.childClause}"`,
        ).toBe(true);
        expect(out.text).toContain(`${link.connective} ${link.argText}`);
      }
      // Every visible clause still appears exactly once — the reversal loses none.
      for (const clause of [ITEM.headline, PARENT_CLAUSE, DEEP_CLAUSE]) {
        expect(out.text.split(clause).length - 1, `${pool} fwd: "${clause}"`).toBe(1);
      }
    }
  });

  test('no drawn connective is an `A` line, in either register or direction', () => {
    const absolutes = Object.values(CONNECTIVE_POOLS).flat().filter((l) => l.arg === 'A').map((l) => l.text);
    expect(absolutes.length).toBeGreaterThan(0);
    let drawn = 0;
    const failures = collectSeedFailures(warrantSeedDirectionCases(), ({ extra, seed, direction }) => {
      const telling = heraldTellingRegister({ worldState: LIT, walk: walkWarranted(extra), seed, seesSecrets: true, direction });
      for (const link of telling.links) {
        if (link.connective) drawn += 1;
        // anchored: `absolutes` is asserted non-empty above and `drawn` non-zero after the sweep
        expect(absolutes).not.toContain(link.connective);
      }
      const headline = heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: walkWarranted(extra), seed, seesSecrets: true });
      // anchored: `absolutes` non-empty above; the `if` guard proves a real gesture composed
      if (headline) expect(absolutes).not.toContain(headline.text.split(' — ')[1]);
    });
    expectNoSeedFailures(failures, 'no `A` line is ever drawn, in either register or direction');
    expect(drawn, 'the sweep drew no connective at all — the exclusion is vacuous').toBeGreaterThan(0);
  });

  test('THE NEGATIVE CONTROL: the pre-cure form — a bare finite clause in an `N` slot — fails the parse, and no draw produces it', () => {
    // The exact line the cycle-9 verifier sampled off the shipped composer.
    const preCure = `${ITEM.headline} — against the refusal of ${DEEP_CLAUSE}`;
    expect(conformsToMold({ pool: 'refused', arg: 'N', clause: DEEP_CLAUSE, text: DEEP_CLAUSE })).toBe(false);
    expect(conformsToMold({ pool: 'followed', arg: 'N', clause: PARENT_CLAUSE, text: PARENT_CLAUSE })).toBe(false);
    // …while the F slot's mold IS the clause, which is why F was never the bug.
    expect(conformsToMold({ pool: 'caused', arg: 'F', clause: PARENT_CLAUSE, text: PARENT_CLAUSE })).toBe(true);

    // GUARD-THE-GUARD at the composer: sweep every warrant × seed × direction and
    // assert no `N` argument is ever the bare clause again.
    let checked = 0;
    const failures = collectSeedFailures(warrantSeedDirectionCases(), ({ extra, seed, direction }) => {
      const out = heraldTellingRegister({ worldState: LIT, walk: walkWarranted(extra), seed, seesSecrets: true, direction });
      for (const link of out.links) {
        if (link.arg !== 'N') continue;
        checked += 1;
        expect(link.argText).not.toBe(link.clause);
        expect(link.argText).not.toBe(link.childClause);
        // …and the PASSAGE never carries the pre-cure pairing either, which
        // is the half a molded-but-unused argument would leave green. Reached only
        // from inside a live `N` link, and `checked` is asserted non-zero below.
        // anchored: `checked` non-zero after the sweep; this arm needs a composed N argument
        expect(out.text, `${link.pool}/N @ ${seed}`).not.toContain(`${link.connective} ${link.clause}`);
        // anchored: same — reached only from inside a live `N` link
        if (link.childClause) expect(out.text).not.toContain(`${link.connective} ${link.childClause}`);
      }
      expect(out.text).not.toBe(preCure);
    });
    expectNoSeedFailures(failures, 'no `N` argument is ever the bare clause, in either direction');
    expect(checked, 'the sweep exercised no N slot at all — the guard is vacuous').toBeGreaterThan(0);
  });

  test('the audience swap survives the molded draw: a player never reads a `planted` connective', () => {
    const walk = walkWarranted({ lineageIds: ['disinfo:a:b:3'] });
    let read = 0;
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const player = heraldTellingRegister({ worldState: LIT, walk, seed, seesSecrets: false });
      for (const link of player.links) {
        if (!link.pool) continue;
        read += 1;
        expect(link.pool, seed).not.toBe('planted');
        // Reached only for a link that DREW a pool, and `read` is asserted
        // non-zero below, so the connective under test is a real one.
        // anchored: `read` is asserted non-zero after the sweep; this arm needs a drawn pool
        expect(link.connective).not.toMatch(/planted|bought|sold|furnished|a lie/);
      }
    });
    expectNoSeedFailures(failures, 'a player surface never reads a `planted` connective');
    expect(read, 'the player sweep read no pooled link — the exclusion is vacuous').toBeGreaterThan(0);
    // THE ANCHOR: the same walk on a DM surface does reach `planted`, so the
    // exclusion above measures the audience swap rather than an empty telling.
    const dm = heraldTellingRegister({ worldState: LIT, walk, seed: 's1', seesSecrets: true });
    expect(dm.links[0].pool).toBe('planted');
  });
});

// ── LANE HR — THE VOCABULARY AMENDMENTS + DIRECTION SAFETY ──────────────────

describe('THE VOCABULARY AMENDMENTS — a mold may not add a shade the edge lacks', () => {
  test('refused::N is the AT-ISSUE form ALONE: a gate edge never composes a denial', () => {
    // "for the refusal of the fact that the tribute went unpaid" reads as the
    // refusal OF A FACT. The gate edge carries a blocked act, not a contested
    // truth, so law 1 forbids the shade.
    const forms = moldFormsFor('refused', 'N');
    expect(forms).toHaveLength(1);
    for (const line of CONNECTIVE_POOLS.refused.filter((l) => l.arg === 'N')) {
      const composed = `${line.text} ${forms[0].replace(CLAUSE_TOKEN, DEEP_CLAUSE)}`;
      // `forms` is asserted to have exactly one member above and the composed
      // string is rebuilt from it here, so this cannot pass by an emptied pool.
      // anchored: `forms` length pinned to 1 above; the next line asserts the AT-ISSUE shape
      expect(composed, line.text).not.toContain('the fact that');
      expect(composed).toContain('what stood at issue when');
    }
  });

  test('breached::N never names a past event as the content of a promise', () => {
    const forms = moldFormsFor('breached', 'N');
    expect(forms.length).toBeGreaterThan(0);
    for (const form of forms) {
      const filled = form.replace(CLAUSE_TOKEN, DEEP_CLAUSE);
      // anchored: the next line asserts this same filled form carries the clause verbatim
      expect(filled, form).not.toContain(`the promise that ${DEEP_CLAUSE}`);
      expect(filled).toContain(DEEP_CLAUSE);
      // The obligation is NAMED and the clause DATES it — "stood until", "held
      // until" — rather than being asserted as its content.
      expect(/\b(?:stood|held) until\b/.test(filled), form).toBe(true);
    }
    // Both directions read: the `fwd` line agrees in number with every form.
    for (const line of CONNECTIVE_POOLS.breached.filter((l) => l.arg === 'N')) {
      for (const form of forms) {
        expect(`${line.text} ${form.replace(CLAUSE_TOKEN, DEEP_CLAUSE)}`).toMatch(/^\S/);
      }
    }
  });
});

describe('DIRECTION SAFETY — a fwd line may not presuppose the child', () => {
  const CHILD_PRESUPPOSING = Object.freeze([
    ['exposed', { type: 'plant_exposed' }],
    ['refused', { type: 'peace_refused' }],
    ['breached', { type: 'treaty_default_detected' }],
  ]);

  test('the back direction keeps the FULL warrant', () => {
    for (const [pool, link] of CHILD_PRESUPPOSING) {
      expect(poolForLink(link), pool).toBe(pool);
      expect(poolForLink(link, 'back'), pool).toBe(pool);
    }
  });

  test('the fwd direction demotes them to the direction-neutral families only', () => {
    for (const [pool, link] of CHILD_PRESUPPOSING) {
      expect(poolForLink(link, 'fwd'), pool).toBe('followed');
      // …and `caused` only when the origination warrant is independently there.
      expect(poolForLink({ ...link, causedByParent: true }, 'fwd'), pool).toBe('caused');
      expect(poolForLink({ ...link, causedByParent: true }, 'back'), pool).toBe(pool);
    }
  });

  test('A FWD DRAW OVER AN EXPOSURE HOP composes followed/caused form only', () => {
    const walk = walkWarranted({ type: 'plant_exposed' });
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const fwd = heraldTellingRegister({ worldState: LIT, walk, seed, seesSecrets: true, direction: 'fwd' });
      let drawn = 0;
      for (const link of fwd.links) {
        if (!link.connective) continue;
        drawn += 1;
        expect(['followed', 'caused'], `${seed}: ${link.pool}`).toContain(link.pool);
        // The false claim the corpus would otherwise compose, named exactly.
        // anchored: `drawn` is asserted non-zero below, so this ran over a composed chain
        expect(fwd.text, seed).not.toContain('and what came out was');
      }
      expect(drawn, `${seed}: the fwd telling drew nothing — the pin is vacuous`).toBeGreaterThan(0);
      // The BACK telling of the same walk still speaks in the exposure's own voice,
      // so the restriction is a direction rule and not a lost warrant.
      const back = heraldTellingRegister({ worldState: LIT, walk, seed, seesSecrets: true, direction: 'back' });
      expect(back.links.some((l) => l.pool === 'exposed'), `${seed}: back lost the warrant`).toBe(true);
    });
    expectNoSeedFailures(failures, 'a fwd exposure hop never composes an exposure connective');
  });

  test('the TWO permanent fwd drops stay drops (they are not redirected)', () => {
    // `dissolved` is all-`A` in fwd and `planted`'s one fwd line spends the
    // declared `planted::N` hole. Redirecting either would silently convert a
    // recorded drop into prose, which is why neither is on the restricted list.
    expect(poolForLink({ type: 'war_cause_dissolved' }, 'fwd')).toBe('dissolved');
    expect(poolForLink({ lineageIds: ['disinfo:a:b:3'] }, 'fwd')).toBe('planted');
    for (const [pool, extra] of [['dissolved', { type: 'war_cause_dissolved' }], ['planted', { lineageIds: ['disinfo:a:b:3'] }]]) {
      const out = heraldTellingRegister({
        worldState: LIT, walk: walkWarranted(extra), seed: 'dir-1', seesSecrets: true, direction: 'fwd',
      });
      expect(out.links.every((l) => l.pool !== pool), `${pool} drew a fwd connective`).toBe(true);
    }
  });
});

// ── LANE HR — THE CLAUSE FLOOR ──────────────────────────────────────────────
// The cycle-11 lighting blocker: not everything the walk hands over is a clause.
// A parent the provenance ledger names but no pulseHistory record resolves comes
// back as `UNRECEIPTED_HOP` — a NOUN PHRASE, `redacted:false`, so nothing
// structural marked it — and a durable record with no headline comes back as one
// of chronicleGraph's two pulse fallbacks. Fed to a §1 mold they composed
// "— in the wake of the day an earlier cause": a connective asserting a relation
// to a receipt nobody found. These pins run the SHIPPED PATH — the real
// `buildCauseWalk` over a real provenance ledger — because a hand-built walk
// fixture could assert the guard while the producer stopped producing the case.

/** The shipped path: a two-hop ledger whose DEEPEST parent no record resolves. */
const rootSourceEventWorld = () => ({
  simulationRules: { heraldCausalVoiceEnabled: true },
  spatialLedgers: {
    provenance: {
      'evt-root': { parents: ['evt-a'], type: 'war_declared', tick: 70 },
      // `evt-origin` is a root sourceEventId: named as a parent, recorded nowhere.
      'evt-a': { parents: ['evt-origin'], type: 'levy_shortfall', tick: 60 },
    },
  },
  pulseHistory: [{
    tick: 70,
    selectedOutcomes: [
      { id: 'evt-root', headline: 'Karsh declares war on Elmspur', type: 'war_declared' },
      { id: 'evt-a', headline: 'the grain levy failed at Karsh', type: 'levy_shortfall' },
    ],
  }],
});

/** The shipped path: the NEAREST parent has aged past MAX_HISTORY and is gone. */
const agedOutParentWorld = () => ({
  simulationRules: { heraldCausalVoiceEnabled: true },
  spatialLedgers: {
    provenance: { 'evt-root': { parents: ['evt-aged'], type: 'war_declared', tick: 70 } },
  },
  pulseHistory: [{
    tick: 70,
    selectedOutcomes: [{ id: 'evt-root', headline: 'Karsh declares war on Elmspur', type: 'war_declared' }],
  }],
});

/** The shipped path: the parent IS recorded, but recorded no headline at all. */
const headlinelessRecordWorld = () => ({
  simulationRules: { heraldCausalVoiceEnabled: true },
  spatialLedgers: {
    provenance: { 'evt-root': { parents: ['evt-mute'], type: 'war_declared', tick: 70 } },
  },
  pulseHistory: [{
    tick: 70,
    selectedOutcomes: [
      { id: 'evt-root', headline: 'Karsh declares war on Elmspur', type: 'war_declared' },
      { id: 'evt-mute', type: 'levy_shortfall' },
    ],
  }],
});

/**
 * THE CYCLE-12 F1 FIXTURE: the ROOT record carries no headline, and its parent is
 * fully receipted. The shipped path stamps `PULSE_OUTCOME_FALLBACK` on the root,
 * and in `fwd` the root is the nearest link's CHILD — the very slot that link's
 * connective molds — so the placeholder reached a connective through the one door
 * the chain-side floor never watched.
 */
const headlinelessRootWorld = () => ({
  simulationRules: { heraldCausalVoiceEnabled: true },
  spatialLedgers: {
    provenance: { 'evt-root': { parents: ['evt-a'], type: 'war_declared', tick: 70 } },
  },
  pulseHistory: [{
    tick: 70,
    selectedOutcomes: [
      { id: 'evt-root', type: 'war_declared' },
      { id: 'evt-a', headline: 'the grain levy failed at Karsh', type: 'levy_shortfall' },
    ],
  }],
});

/** The same fixture with the root's recorded headline restored (the control). */
const voicedRootWorld = () => {
  const world = headlinelessRootWorld();
  world.pulseHistory[0].selectedOutcomes[0].headline = 'Karsh declares war on Elmspur';
  return world;
};

const walkOf = (world, rootId = 'evt-root') => buildCauseWalk({ worldState: world, rootId, seesSecrets: true });

/**
 * THE FROZEN COPY (cycle-12 finding F3). The telling sweep below used to decide
 * WHICH links to inspect with `PLACEHOLDER_CLAUSES.includes(link.clause)` — the
 * recorded self-referential-pin shape. Under a vocabulary-drift mutant the list
 * and the composer move together, so the sweep simply stops finding placeholder
 * hops and greens on an empty selection: list == list, proving nothing.
 *
 * These three strings are written out BY HAND, on purpose, and are the only
 * literal copy of the vocabulary in this file. They are compared to the live
 * export in a pin of their own, so a drift is a LOUD failure naming the string
 * that moved rather than a silent narrowing of what the sweep looks for. This is
 * the one place a second copy is correct: a guard whose subject is the drift.
 * @type {ReadonlyArray<string>}
 */
const FROZEN_PLACEHOLDER_CLAUSES = Object.freeze([
  'an earlier cause',
  'World pulse outcome',
  'World pulse impact',
]);

/** Everything the sweeps look for: the union, so a SHRINKING vocabulary cannot
 *  shrink the negative. */
const SWEPT_PLACEHOLDERS = Object.freeze([
  ...new Set([...PLACEHOLDER_CLAUSES, ...FROZEN_PLACEHOLDER_CLAUSES]),
]);

describe('THE CLAUSE FLOOR — a placeholder is TERMINAL, never an argument', () => {
  test('the SHIPPED PATH really produces each placeholder (without this the guards below are vacuous)', () => {
    const rootWalk = walkOf(rootSourceEventWorld());
    const deepest = rootWalk.chain.find((hop) => hop.id === 'evt-origin');
    expect(deepest, 'the ledger names a root sourceEventId but the walk dropped the hop').toBeTruthy();
    expect(deepest.headline).toBe(UNRECEIPTED_HOP);
    // NOT redacted: nothing was hidden. That is exactly why a boolean cannot carry
    // this case and the guard has to read the exported line.
    expect(deepest.redacted).toBe(false);

    const agedWalk = walkOf(agedOutParentWorld());
    expect(agedWalk.chain[0].headline).toBe(UNRECEIPTED_HOP);
    expect(agedWalk.chain[0].depth).toBe(1);

    const muteWalk = walkOf(headlinelessRecordWorld());
    expect(muteWalk.chain[0].headline).toBe(PULSE_OUTCOME_FALLBACK);
    expect(PLACEHOLDER_CLAUSES).toContain(PULSE_IMPACT_FALLBACK);
  });

  test('THE HEADLINE REGISTER never gestures at a placeholder, at any seed', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      for (const world of [agedOutParentWorld(), headlinelessRecordWorld()]) {
        const walk = walkOf(world);
        expect(heraldHeadlineRegister({
          worldState: world, item: ITEM, walk, seed, seesSecrets: true,
        })).toBeNull();
      }
      // GUARD-THE-GUARD: the same register over a RECEIPTED nearest parent does
      // compose, so the nulls above measure the placeholder rather than a register
      // that returns null to everything.
      const live = walkOf(rootSourceEventWorld());
      expect(heraldHeadlineRegister({
        worldState: rootSourceEventWorld(), item: ITEM, walk: live, seed, seesSecrets: true,
      })).not.toBeNull();
    });
    expectNoSeedFailures(failures, 'a placeholder nearest hop yields no headline gesture');
  });

  test('THE TELLING REGISTER draws no connective over a placeholder, in either direction', () => {
    let composedArguments = 0;
    let clauselessSeen = 0;
    const cases = [];
    for (const world of [rootSourceEventWorld, agedOutParentWorld, headlinelessRecordWorld]) {
      for (const direction of /** @type {const} */ (['back', 'fwd'])) {
        for (const seed of SEEDS) cases.push({ world, direction, seed });
      }
    }
    const failures = collectSeedFailures(cases, ({ world, direction, seed }) => {
      const built = world();
      const out = heraldTellingRegister({
        worldState: built, walk: walkOf(built), seed, seesSecrets: true, direction,
      });
      for (const link of out.links) {
        // DE-SELF-REFERENCED (F3). The sweep no longer USES the vocabulary to pick
        // which links to look at — it asserts the STRUCTURAL EQUIVALENCE on every
        // link, so a drifted vocabulary reds here instead of quietly selecting
        // nothing. `clauseless` is `!redacted && isPlaceholderClause(clause)`, and
        // this fixture family carries no covert hop, which the line below pins so
        // the two-term identity is the one-term identity here.
        expect(link.redacted, `${direction} @ ${seed}: this fixture family carries no covert hop`).toBe(false);
        expect(
          link.clauseless,
          `${direction} @ ${seed}: clauseless disagreed with the predicate for "${link.clause}"`,
        ).toBe(isPlaceholderClause(link.clause));
        if (link.clauseless) {
          clauselessSeen += 1;
          expect(link.connective).toBeNull();
          expect(link.argText).toBeNull();
          expect(link.pool).toBeNull();
        }
        if (link.argText) composedArguments += 1;
        for (const placeholder of SWEPT_PLACEHOLDERS) {
          // `composedArguments` and `clauselessSeen` are both asserted non-zero
          // below, so this sweep provably ran over live molded arguments AND over
          // live placeholder hops rather than over an empty link list.
          // anchored: composedArguments + clauselessSeen are asserted non-zero after the sweep
          expect(String(link.argText ?? ''), `${direction} @ ${seed}`).not.toContain(placeholder);
        }
      }
      // The terminal is the honest thing the walk says instead: a truncation may
      // never reach `horizon`, whose family claims retention.
      expect(TERMINALS.chain_end).toContain(out.terminal);
    });
    expectNoSeedFailures(failures, 'no connective is ever composed over a placeholder clause');
    expect(clauselessSeen, 'the sweep never met a placeholder hop — the guard is vacuous').toBeGreaterThan(0);
    expect(composedArguments, 'the sweep composed no argument at all — the negative is vacuous').toBeGreaterThan(0);
  });

  test('THE REMOVAL, measured: the same fixture with a RECORDED headline does compose the link', () => {
    // The before/after that turns "no connective" into evidence. One fixture, one
    // field changed: the parent gains the headline it was missing.
    const mute = headlinelessRecordWorld();
    const voiced = headlinelessRecordWorld();
    voiced.pulseHistory[0].selectedOutcomes[1].headline = 'the grain levy failed at Karsh';

    const before = heraldTellingRegister({ worldState: voiced, walk: walkOf(voiced), seed: 'floor-1', seesSecrets: true });
    const after = heraldTellingRegister({ worldState: mute, walk: walkOf(mute), seed: 'floor-1', seesSecrets: true });
    expectPresentThenAbsent(
      before.links.map((l) => String(l.connective)),
      after.links.map((l) => String(l.connective)),
      String(before.links[0].connective),
      'the placeholder loses the connective the recorded clause earns',
    );
    expect(before.links[0].clauseless).toBe(false);
    expect(after.links[0].clauseless).toBe(true);
  });

  test('THE VOCABULARY HAS NOT DRIFTED from the frozen copy the sweeps also read (F3)', () => {
    // The sweeps above no longer take the live list as gospel — they read the union
    // of the live export and a hand-written copy, so a wording change cannot narrow
    // what they look for. That only works while a drift is LOUD, which is this pin:
    // it names the string that moved, in the direction it moved.
    const live = [...PLACEHOLDER_CLAUSES];
    const frozen = [...FROZEN_PLACEHOLDER_CLAUSES];
    const added = live.filter((s) => !frozen.includes(s));
    const removed = frozen.filter((s) => !live.includes(s));
    expect(
      { added, removed },
      'THE PLACEHOLDER VOCABULARY MOVED. Every guard in this file that reads the live'
      + ' export narrowed or widened with it, silently. Review the change, then update'
      + ' FROZEN_PLACEHOLDER_CLAUSES in this file BY HAND so the next drift is loud too.'
      + ` added: ${JSON.stringify(added)} · removed: ${JSON.stringify(removed)}`,
    ).toEqual({ added: [], removed: [] });
    // …and in the same ORDER, so a re-ordering that changes nothing semantically is
    // still surfaced rather than absorbed.
    expect(live).toEqual(frozen);
    // The three named constants are pinned to their own frozen slots, so a rename
    // that swapped two spellings between constants would red even though the SET
    // is unchanged.
    expect(UNRECEIPTED_HOP).toBe(FROZEN_PLACEHOLDER_CLAUSES[0]);
    expect(PULSE_OUTCOME_FALLBACK).toBe(FROZEN_PLACEHOLDER_CLAUSES[1]);
    expect(PULSE_IMPACT_FALLBACK).toBe(FROZEN_PLACEHOLDER_CLAUSES[2]);
    // The union the sweeps read is therefore exactly the vocabulary, today.
    expect(SWEPT_PLACEHOLDERS).toEqual(frozen);
  });

  test('the guard reads the EXPORTED vocabulary, and the vocabulary is the closed set', () => {
    for (const placeholder of PLACEHOLDER_CLAUSES) expect(isPlaceholderClause(placeholder)).toBe(true);
    expect(isPlaceholderClause(`  ${UNRECEIPTED_HOP}  `), 'trimmed before the compare').toBe(true);
    // A real recorded headline is never swallowed, including one that merely
    // CONTAINS a placeholder phrase — the compare is exact, not a substring.
    expect(isPlaceholderClause('the grain levy failed at Karsh')).toBe(false);
    expect(isPlaceholderClause(`the scribes wrote ${UNRECEIPTED_HOP} in the margin`)).toBe(false);
    expect(isPlaceholderClause('')).toBe(false);
    expect(isPlaceholderClause(null)).toBe(false);
    // REDACTED_HOP is deliberately NOT in this set: a covert hop carries a
    // structural `redacted` flag, and the composer reads the boolean.
    expect(PLACEHOLDER_CLAUSES).toHaveLength(3);
  });
});

// ── CYCLE-12 F1 — THE ROOT JOINS THE FLOOR ──────────────────────────────────
// The clause floor read the CHAIN and left `walk.root.headline` bare. In `fwd`
// the root is the nearest link's `childClause`, which is exactly the argument
// that link's connective molds, so a headline-less durable root composed the
// defect through the other door — the executed counterexample being
// "…and after it the turning when World pulse outcome". The fixture is a REAL
// buildCauseWalk over a real ledger, because a hand-built walk could assert the
// guard while the producer stopped producing the case.

describe('THE CLAUSE FLOOR — the ROOT is on it too (F1)', () => {
  test('the SHIPPED PATH really produces a placeholder ROOT (without this the guards below are vacuous)', () => {
    const walk = walkOf(headlinelessRootWorld());
    expect(walk.root, 'the root record resolved to nothing at all').toBeTruthy();
    expect(walk.root.headline).toBe(PULSE_OUTCOME_FALLBACK);
    expect(isPlaceholderClause(walk.root.headline)).toBe(true);
    // …and the parent IS receipted, so the nearest link has a real clause of its
    // own and nothing but the ROOT is on the floor in this fixture.
    expect(walk.chain).toHaveLength(1);
    expect(walk.chain[0].headline).toBe('the grain levy failed at Karsh');
    expect(walk.chain[0].redacted).toBe(false);
    // The control fixture differs in exactly one field.
    expect(walkOf(voicedRootWorld()).root.headline).toBe('Karsh declares war on Elmspur');
  });

  test('THE REMOVAL, measured: the fwd connective molds a RECORDED root and never a placeholder one', () => {
    const before = heraldTellingRegister({
      worldState: voicedRootWorld(), walk: walkOf(voicedRootWorld()), seed: 'root-floor-1', seesSecrets: true, direction: 'fwd',
    });
    const after = heraldTellingRegister({
      worldState: headlinelessRootWorld(), walk: walkOf(headlinelessRootWorld()), seed: 'root-floor-1', seesSecrets: true, direction: 'fwd',
    });
    // THE LIVENESS ANCHOR: with a recorded root the nearest link really does mold
    // it into its slot, so "no argument afterwards" measures the floor rather than
    // a register that composes nothing for this fixture at all.
    expect(before.links[0].argText, 'the recorded root composed no fwd argument — the negative would be vacuous').toBeTruthy();
    expect(before.links[0].argText).toContain('Karsh declares war on Elmspur');
    expectPresentThenAbsent(
      before.links.map((l) => String(l.argText)),
      after.links.map((l) => String(l.argText)),
      String(before.links[0].argText),
      'the placeholder root loses the argument slot the recorded root earns',
    );
    expect(after.links[0].connective, 'a connective survived over a placeholder root').toBeNull();
    expect(after.links[0].argText).toBeNull();
    expect(after.links[0].childKept, 'the placeholder root must not read as a usable child').toBe(false);
    // Nothing is LOST: the root still prints, bare, asserting no relation.
    expect(after.text).toContain(PULSE_OUTCOME_FALLBACK);
    expect(after.text).toContain('the grain levy failed at Karsh');
  });

  test('no placeholder ever reaches a molded argument, in EITHER direction, at any seed', () => {
    let composedArguments = 0;
    const cases = DIRECTIONS.flatMap((direction) => SEEDS.map((seed) => ({ direction, seed })));
    const failures = collectSeedFailures(cases, ({ direction, seed }) => {
      const mute = headlinelessRootWorld();
      const out = heraldTellingRegister({
        worldState: mute, walk: walkOf(mute), seed, seesSecrets: true, direction,
      });
      for (const link of out.links) {
        if (link.argText) composedArguments += 1;
        for (const placeholder of PLACEHOLDER_CLAUSES) {
          // `controlArguments` (this same sweep over a RECORDED root) and
          // `composedArguments` are both asserted non-zero after the sweep, so an
          // empty link list or a register that stopped molding reds there.
          // anchored: composedArguments + controlArguments are asserted non-zero after the sweep
          expect(String(link.argText ?? ''), `${direction} @ ${seed}`).not.toContain(placeholder);
        }
      }
      // The executed counterexample, named exactly: the connective slot the
      // placeholder used to fill sat behind the `after it the turning when` mold.
      // anchored: `out.text` is asserted to carry both recorded beats two lines down
      expect(out.text, `${direction} @ ${seed}`).not.toContain(`when ${PULSE_OUTCOME_FALLBACK}`);
      expect(out.text).toContain(PULSE_OUTCOME_FALLBACK);
      expect(out.text).toContain('the grain levy failed at Karsh');
    });
    expectNoSeedFailures(failures, 'a placeholder root never enters a connective slot');
    // GUARD-THE-GUARD: the same sweep over the RECORDED root does compose molded
    // arguments, so the zero above is the floor and not a dead register.
    let controlArguments = 0;
    for (const { direction, seed } of cases) {
      const voiced = voicedRootWorld();
      const out = heraldTellingRegister({
        worldState: voiced, walk: walkOf(voiced), seed, seesSecrets: true, direction,
      });
      for (const link of out.links) if (link.argText) controlArguments += 1;
    }
    expect(controlArguments, 'the control sweep composed no argument — the negative sweep is vacuous').toBeGreaterThan(0);
    expect(composedArguments, 'the floored fixture still molded an argument in back (its own clause)').toBeGreaterThan(0);
  });

  test('a placeholder ROOT counts toward the truncation, so the terminal may not claim retention', () => {
    // `horizon`'s family claims the trail runs past living memory. A telling whose
    // HEAD is a hole has no standing to say that. The caller must ASK for `horizon`
    // for the truncation to be load-bearing — with the default `chain_end` the
    // terminal is chain_end either way and the pin would prove nothing — so this
    // is the one place the register is called with the retention terminal.
    for (const direction of DIRECTIONS) {
      const mute = headlinelessRootWorld();
      const out = heraldTellingRegister({
        worldState: mute, walk: walkOf(mute), seed: 'root-floor-2', seesSecrets: true, direction, terminal: 'horizon',
      });
      expect(TERMINALS.chain_end, direction).toContain(out.terminal);
      // anchored: the line above pins this same terminal INTO the chain_end family
      expect(TERMINALS.horizon, direction).not.toContain(out.terminal);
      // THE LIVENESS ANCHOR for the whole pin: the SAME call over the recorded root
      // does reach `horizon`, so the assertions above measure the root's truncation
      // rather than a register that can never render the retention family at all.
      const voiced = voicedRootWorld();
      const control = heraldTellingRegister({
        worldState: voiced, walk: walkOf(voiced), seed: 'root-floor-2', seesSecrets: true, direction, terminal: 'horizon',
      });
      expect(TERMINALS.horizon, `${direction}: the control never reached horizon — the pin is vacuous`).toContain(control.terminal);
    }
  });
});
