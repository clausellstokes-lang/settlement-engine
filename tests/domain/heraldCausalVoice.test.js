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
    expect(player.text).not.toMatch(/\{|planted|bought|sold|furnished/);
  });

  test('the `followed` pool spends none of its forbidden words', () => {
    for (const line of CONNECTIVE_POOLS.followed) {
      for (const banned of FOLLOWED_FORBIDDEN) {
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
    for (const seed of ['a', 'seed-99', 'karsh::1']) {
      expect(heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: WALK, seed }))
        .toEqual(heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: WALK, seed }));
      expect(heraldTellingRegister({ worldState: LIT, walk: WALK, seed }))
        .toEqual(heraldTellingRegister({ worldState: LIT, walk: WALK, seed }));
      expect(terminalLine({ terminal: 'chain_end', seed })).toBe(terminalLine({ terminal: 'chain_end', seed }));
    }
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
          expect(form.replace(CLAUSE_TOKEN, ''), `${pool}::${arg} :: ${form}`).not.toMatch(/\{[a-z_]+\}/);
        }
        expect(new Set(forms).size, `${pool}::${arg}`).toBe(forms.length);
      }
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
    for (const [pool, extra] of WARRANTED) {
      const walk = walkWarranted(extra);
      let composed = 0;
      for (const seed of SEEDS) {
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
      }
      expect(composed, `${pool} composed no headline at any seed`).toBe(SEEDS.length);
    }
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
    for (const [, extra] of WARRANTED) {
      for (const seed of SEEDS) {
        for (const direction of /** @type {const} */ (['back', 'fwd'])) {
          const telling = heraldTellingRegister({ worldState: LIT, walk: walkWarranted(extra), seed, seesSecrets: true, direction });
          for (const link of telling.links) expect(absolutes).not.toContain(link.connective);
        }
        const headline = heraldHeadlineRegister({ worldState: LIT, item: ITEM, walk: walkWarranted(extra), seed, seesSecrets: true });
        if (headline) expect(absolutes).not.toContain(headline.text.split(' — ')[1]);
      }
    }
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
    for (const [, extra] of WARRANTED) {
      for (const seed of SEEDS) {
        for (const direction of /** @type {const} */ (['back', 'fwd'])) {
          const out = heraldTellingRegister({ worldState: LIT, walk: walkWarranted(extra), seed, seesSecrets: true, direction });
          for (const link of out.links) {
            if (link.arg !== 'N') continue;
            checked += 1;
            expect(link.argText).not.toBe(link.clause);
            expect(link.argText).not.toBe(link.childClause);
            // …and the PASSAGE never carries the pre-cure pairing either, which
            // is the half a molded-but-unused argument would leave green.
            expect(out.text, `${link.pool}/N @ ${seed}`).not.toContain(`${link.connective} ${link.clause}`);
            if (link.childClause) expect(out.text).not.toContain(`${link.connective} ${link.childClause}`);
          }
          expect(out.text).not.toBe(preCure);
        }
      }
    }
    expect(checked, 'the sweep exercised no N slot at all — the guard is vacuous').toBeGreaterThan(0);
  });

  test('the audience swap survives the molded draw: a player never reads a `planted` connective', () => {
    const walk = walkWarranted({ lineageIds: ['disinfo:a:b:3'] });
    for (const seed of SEEDS) {
      const player = heraldTellingRegister({ worldState: LIT, walk, seed, seesSecrets: false });
      for (const link of player.links) {
        if (!link.pool) continue;
        expect(link.pool, seed).not.toBe('planted');
        expect(link.connective).not.toMatch(/planted|bought|sold|furnished|a lie/);
      }
    }
    const dm = heraldTellingRegister({ worldState: LIT, walk, seed: 's1', seesSecrets: true });
    expect(dm.links[0].pool).toBe('planted');
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

const walkOf = (world, rootId = 'evt-root') => buildCauseWalk({ worldState: world, rootId, seesSecrets: true });

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
        if (PLACEHOLDER_CLAUSES.includes(link.clause)) {
          clauselessSeen += 1;
          expect(link.clauseless, `${link.clause} was not marked clauseless`).toBe(true);
          expect(link.connective).toBeNull();
          expect(link.argText).toBeNull();
          expect(link.pool).toBeNull();
        }
        if (link.argText) composedArguments += 1;
        for (const placeholder of PLACEHOLDER_CLAUSES) {
          // anchored: `composedArguments` and `clauselessSeen` are asserted non-zero
          // below, so this sweep provably ran over live molded arguments AND over
          // live placeholder hops rather than an empty link list.
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
