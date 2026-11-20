/**
 * NAMES-3, item 3 (the seventh chair's rulings CV1, CV2 and CV7 of 2026-11-20, vetoable by the owner): A VERB WHOSE SUBJECT
 * IS A POWER, AND AN "IT"/"ITS" SAID OF A PLURAL-NAMED ONE, TAKE THE POWER'S OWN NUMBER, from one reader
 * (`data/people/powerSentenceName.js :: powerVerb`, `pluralPowerName`; the agreement form `{slot|one|many}` through
 * `fillAgreement`). "They"/"their" after a singular-named power STAND (CV7 (1): a power is a body of people).
 * And item 3 (d): a qualified name's possessive opens its bracket ("Ada Vell the miller's hours"), in
 * `data/people/personMention.js :: qualifiedPossessives`.
 *
 * The faults at the line 0c906948 (NAMES-3's reader): "…, and the Religious Authorities is taking over the offices" (5 stored);
 * "The Elder Council in X backed … and now find"; "the people who lead it", "its errands", "run it" of a plural power; the
 * DM view's "The Merchant Guilds brings its requests", "has its own voice", "is stronger than it looks"; a qualified name's
 * "(the miller)'s" (54 stored strings in 33 towns). Every expected sentence below is COMPUTED (interpolated), never quoted:
 * the pools are drawn prose (`tests/lint/proseDrawnAnchors.walker.test.js`). THE CONTROLS plant each defect.
 */
import { describe, expect, it } from 'vitest';
import { fillAgreement, powerPossessive, powerVerb } from '../../src/data/people/powerSentenceName.js';
import { qualifiedPossessives, secondMentions } from '../../src/data/people/personMention.js';
import { CAPTURE_LINES, PATRONAGE_LINES, answerClause, criminalsOf, namedAnswerClause } from '../../src/data/people/dmPowerLines.js';
import { generateCrimeLevel } from '../../src/generators/npcGenerator.js';
import { GOAL_FAMILY_LINES } from '../../src/data/people/goalFamilies.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { fillLine } from '../../src/generators/people/goals.js';
import { fillSentenceSlots } from '../../src/generators/narrativeProse.js';
import { powerNameWithArticle } from '../../src/domain/display/powerSentenceName.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const MANY = 'Merchant Guilds';
const ONE = 'Elder Council';
const ADVERBS = /^(?:still|now|itself|themselves|usually|already|also|just|never)$/;
const PAIRS = [['is', 'are'], ['has', 'have'], ['was', 'were'], ['does', 'do'], ['wants', 'want'], ['brings', 'bring'], ['counts', 'count'],
  ['keeps', 'keep'], ['gives', 'give'], ['decides', 'decide'], ['rules', 'rule'], ['holds', 'hold'], ['goes', 'go'], ['knows', 'know'],
  ['lets', 'let'], ['works', 'work'], ['controls', 'control'], ['considers', 'consider'], ['meets', 'meet'], ['signs', 'sign'],
  ['presides', 'preside'], ['sends', 'send'], ['reports', 'report'], ['finds', 'find'], ['suspects', 'suspect'], ['believes', 'believe']];
const SING = new Set(PAIRS.map((p) => p[0]));
const PLUR = new Set(PAIRS.map((p) => p[1]));

/**
 * The verbs of the wrong number whose SUBJECT is `name` (the name opens the text, a sentence or a clause; a name behind a
 * preposition is an object, "the X and the Y" a compound). @param {string} text @param {string} name @param {boolean} plural
 */
function wrongVerb(text, name, plural) {
  const out = [];
  for (const m of String(text).matchAll(new RegExp(`\\b[Tt]he ${name}(?![\\w'])((?:\\s+[A-Za-z']+){1,3})`, 'g'))) {
    const before = String(text).slice(0, m.index).trimEnd();
    const prev = (before.match(/([A-Za-z']+)$/) || ['', ''])[1].toLowerCase();
    if (before && !/[.!?;:,]$/.test(before) && !/^(?:what|that|while|but|so|when|until|if|because|though|whatever|and)$/.test(prev)) continue;
    if (prev === 'and' && /\b[Tt]he [A-Z][\w' ]*\s+and$/.test(before)) continue;
    const words = m[1].trim().split(/\s+/);
    let i = 0; while (i < words.length && ADVERBS.test(words[i])) i++;
    const w = (words[i] || '').replace(/[^A-Za-z']/g, '');
    if (plural ? SING.has(w) : PLUR.has(w)) out.push(`${name} ${w} :: ${text}`);
  }
  return out;
}

/**
 * NAMES-4 (the mutation pass's survivors: a swapped agreeing pair, `agree(x, "are", "is")`, passed every list of sentences):
 * THE SAME LINE IN BOTH NUMBERS, BY CAUSE. A composer renders every line twice, once with a power named in the singular and
 * once with the same power in the plural (`SOLO`/`MANY`, one head word apart); every word that differs between the two is
 * the same word in its other number, and it points the right way: the singular render holds the singular form. A swapped
 * site anywhere is a reversed pair, and reds. The names (and any phrase that changes with the number, a criminals' list)
 * are holes, struck from both renders before the words are compared.
 */
const SOLO = MANY.replace(/s$/, '');
const RIVAL = 'Royal Authority';
/** a pronoun's plural forms, and the verbs whose plural is not their singular less -s / -es */
const PRONOUN_FORMS = /** @type {Record<string, string[]>} */ ({ it: ['they', 'them'], its: ['their'], itself: ['themselves'] });
const IRREGULAR_FORMS = /** @type {Record<string, string>} */ ({ is: 'are', has: 'have', was: 'were' });
/** `one` is `many` said of one power, in the same case. The direction is the claim: the reversed pair is not one. */
function numberPair(one, many) {
  if (!one || !many || (one[0] === one[0].toUpperCase()) !== (many[0] === many[0].toUpperCase())) return false;
  const a = one.toLowerCase(); const b = many.toLowerCase();
  if (Object.hasOwn(PRONOUN_FORMS, a)) return PRONOUN_FORMS[a].includes(b);
  if (Object.hasOwn(IRREGULAR_FORMS, a)) return IRREGULAR_FORMS[a] === b;
  if ([...Object.values(PRONOUN_FORMS).flat(), ...Object.values(IRREGULAR_FORMS)].includes(b)) return false;
  return /^[a-z]+$/.test(b) && (a === `${b}s` || a === `${b}es`);
}
const cap1 = (/** @type {string} */ s) => s.charAt(0).toUpperCase() + s.slice(1);
/** A phrase's holes, its singular and plural renders: its possessive (the one leaf's own ending) first, then itself, each as it opens a sentence too. @param {string} one @param {string} many */
const holesOf = (one, many) => [[powerPossessive(one), powerPossessive(many)], [one, many]].flatMap(([o, m]) => [[o, m], [cap1(o), cap1(m)]]);
const WORDS = /[A-Za-z'’]+|\S/g;
/**
 * Every word that differs between the singular renders and the plural renders, line by line, that is NOT the singular
 * form against its plural: `bad` (each with both renders), `seen` (the agreeing pairs found), `differing` (the lines that held one).
 * @param {string[]} ones @param {string[]} manys @param {string[][]} holes @param {string[]} [keys] the line's own name in a report
 */
function numberDiffs(ones, manys, holes, keys = []) {
  /** @type {string[]} */ const bad = []; /** @type {Set<string>} */ const differing = new Set(); let seen = 0;
  if (ones.length !== manys.length) return { bad: [`${ones.length} singular renders against ${manys.length} plural`], seen, differing };
  const plug = (/** @type {string} */ t, /** @type {0 | 1} */ side) => holes.reduce((s, h, k) => s.split(h[side]).join(`⟦${k}⟧`), String(t));
  ones.forEach((one, i) => {
    const a = plug(one, 0).match(WORDS) || []; const b = plug(manys[i], 1).match(WORDS) || [];
    if (a.length !== b.length) { bad.push(`unequal :: ${one} :: ${manys[i]}`); return; }
    a.forEach((w, j) => {
      if (w === b[j]) return;
      if (numberPair(w, b[j])) { seen++; differing.add(keys[i] ?? String(i)); } else bad.push(`${w} / ${b[j]} :: ${one} :: ${manys[i]}`);
    });
  });
  return { bad, seen, differing };
}

describe('the comparison by number (NAMES-4)', () => {
  it('CONTROL: a reversed pair reds, an agreeing pair counts, and a word that is not the other number reds', () => {
    const probe = (/** @type {string} */ n, /** @type {string} */ v) => `[${n}] ${v} / ${powerPossessive(n)} / x`; // not a sentence: a probe
    const holes = holesOf(SOLO, MANY);
    expect(numberDiffs([probe(SOLO, PAIRS[0][0])], [probe(MANY, PAIRS[0][1])], holes)).toMatchObject({ bad: [], seen: 1 });
    expect(numberDiffs([probe(SOLO, PAIRS[0][1])], [probe(MANY, PAIRS[0][0])], holes).bad).toHaveLength(1);
    const [one, many] = [probe(SOLO, PAIRS[0][0]), probe(MANY, PAIRS[0][1])];
    for (const [s, p] of PAIRS) { expect(numberPair(s, p), s).toBe(true); expect(numberPair(p, s), p).toBe(false); }
    for (const [s, ps] of Object.entries(PRONOUN_FORMS)) for (const p of ps) { expect(numberPair(s, p)).toBe(true); expect(numberPair(p, s)).toBe(false); }
    expect(numberPair(cap1(PAIRS[0][0]), PAIRS[0][1])).toBe(false);
    expect(numberPair(SOLO.split(' ')[1], MANY.split(' ')[1])).toBe(false); // a name is a hole, never a pair
    expect(numberDiffs([one], [`${many} too`], holes).bad).toHaveLength(1);
  });
});

describe('the agreement form and the one reader (CV1)', () => {
  it('fillAgreement fills each form by its slot\'s power, and a slot it does not hold takes the singular', () => {
    const t = `Leave {power} as {power|it is|they are}, and {rival} as {rival|it is|they are}; {house} stays.`;
    expect(fillAgreement(t, { power: MANY, rival: ONE })).toBe(`Leave {power} as ${powerVerb(MANY, 'it is', 'they are')}, and {rival} as ${powerVerb(ONE, 'it is', 'they are')}; {house} stays.`);
    expect(powerVerb(MANY, 'one', 'many')).toBe('many');
    expect(powerVerb(`the ${MANY}`, 'one', 'many')).toBe('many');
    expect(fillAgreement(`{other|${'it'}|${'them'}}`, {})).toBe(powerVerb('', 'it', 'them'));
  });
  it('CONTROL: the detector reds a planted plural power with a singular verb, and a singular one with a plural verb', () => {
    expect(wrongVerb(`so what the ${MANY} ${'wants'} from the hall`, MANY, true)).toHaveLength(1);
    expect(wrongVerb(`the ${ONE} still ${'have'} a voice`, ONE, false)).toHaveLength(1);
    expect(wrongVerb(`the ${MANY} ${'want'} and the ${ONE} ${'wants'}`, MANY, true)).toEqual([]);
  });
});

/** the one DM line whose agreeing words stand inside a literal both presumption walkers bank (named in the hand-back) */
const DM_BANKED = new RegExp(` still ${'rules'}, and .* still ${'works'} the streets`);

/** Every DM power line, filled with `power` lending and `ruler` ruling. */
function dmLines(power, ruler, guilds) {
  const out = [];
  for (const rank of [1, 2, 3, 'steward']) for (const kind of ['open', 'hidden']) for (const line of PATRONAGE_LINES[kind]) {
    out.push(line({ name: 'Ada Vell', rank: /** @type {any} */ (rank), ruler, power, share: 0.5, boost: 2 }));
  }
  const agents = (n) => guilds.slice(0, n).map((g, i) => ({ name: `Agent ${i}`, rank: /** @type {any} */ (i + 1), guild: g }));
  for (const [rung, lines] of Object.entries(CAPTURE_LINES)) for (const line of lines) {
    const fs = [{ ruler, agents: rung === 'none' || rung === 'adversarial' ? [] : agents(1), rulerCriminal: false, underworld: guilds[0] }];
    if (rung === 'corrupted') fs.push({ ruler, agents: [], rulerCriminal: true, underworld: guilds[0] }, { ruler, agents: agents(1), rulerCriminal: true, underworld: guilds[0] }); // NAMES-4: and an agent under a criminal ruler
    if (rung === 'equilibrium') fs.push({ ruler, agents: [], rulerCriminal: false, underworld: guilds[0] });
    for (const f of fs) out.push(line(f));
  }
  return out.filter((t) => !DM_BANKED.test(t));
}

describe('the DM view\'s power lines (dmPowerLines.js)', () => {
  it('a plural power, ruler and guild take a plural verb and "their"/"them" in every line', () => {
    const P = 'Noble Houses'; const G = 'Night Markets';
    const lines = dmLines(MANY, P, [G]);
    expect(lines.flatMap((t) => [...wrongVerb(t, MANY, true), ...wrongVerb(t, P, true), ...wrongVerb(t, G, true)])).toEqual([]);
    const f = { name: 'Ada Vell', rank: /** @type {const} */ (2), ruler: ONE, power: MANY, share: 0.5, boost: 2 };
    expect(PATRONAGE_LINES.open[1](f)).toMatch(new RegExp(`^The ${MANY} bring their requests to`));
    expect(PATRONAGE_LINES.hidden[1](f)).toMatch(new RegExp(`^The ${MANY} have their own voice in`));
    expect(PATRONAGE_LINES.hidden[2](f)).toContain(`by their known members leaves out Ada Vell`);
    expect(PATRONAGE_LINES.hidden[2](f)).toContain(`who serves them in secret`);
    const cap = CAPTURE_LINES.capture[0]({ ruler: P, agents: [{ name: 'A', rank: 1, guild: G }, { name: 'B', rank: 2, guild: G }], rulerCriminal: false, underworld: null });
    expect(cap).toContain(`The ${P} keep their name and their seal, and the ${G} give the orders.`);
  });
  it('a singular power keeps the singular in every line', () => {
    const R = 'Royal Authority'; const G = "Thieves' Guild";
    const lines = dmLines(ONE, R, [G]);
    expect(lines.flatMap((t) => [...wrongVerb(t, ONE, false), ...wrongVerb(t, R, false), ...wrongVerb(t, G, false)])).toEqual([]);
    expect(PATRONAGE_LINES.open[1]({ name: 'Ada Vell', rank: 2, ruler: R, power: ONE, share: 0.5, boost: 2 })).toMatch(new RegExp(`^The ${ONE} brings its requests`));
  });
  it('NAMES-4: every line, its power, its ruler and its guild each in both numbers, differs only by number, the right way round', () => {
    const G = "Thieves' Guild"; const U = 'Night Market';
    const roles = [
      ['power', (/** @type {string} */ n) => dmLines(n, RIVAL, [G])],
      ['ruler', (/** @type {string} */ n) => dmLines(ONE, n, [G])],
      ['guild', (/** @type {string} */ n) => dmLines(ONE, RIVAL, [n])],
    ];
    for (const [role, render] of /** @type {Array<[string, (n: string) => string[]]>} */ (roles)) {
      const d = numberDiffs(render(SOLO), render(MANY), holesOf(SOLO, MANY));
      expect(d.bad, role).toEqual([]);
      expect(d.seen, role).toBeGreaterThan(0);
    }
    // the criminals' number through crimAgree: one guild against two guilds, and one underworld against none
    const one = { ruler: RIVAL, agents: [{ name: 'Ada Vell', rank: /** @type {const} */ (2), guild: U }], rulerCriminal: false, underworld: null };
    const two = { ...one, agents: [...one.agents, { name: 'Bo Rann', rank: /** @type {const} */ (3), guild: G }] };
    const alone = { ruler: RIVAL, agents: [], rulerCriminal: false, underworld: U };
    const none = { ...alone, underworld: null };
    // every rung's lines; the captured rung's only where an agent stands (its lines read the agents)
    const capture = (/** @type {any} */ f) => [f, { ...f, rulerCriminal: true }].flatMap((x) => Object.entries(CAPTURE_LINES)
      .filter(([rung]) => x.agents.length || rung !== 'capture').flatMap(([, lines]) => lines.map((line) => line(x)))).filter((t) => !DM_BANKED.test(t));
    const clauses = (/** @type {any} */ f) => [answerClause(f), namedAnswerClause(f)];
    const guilds = numberDiffs(capture(one), capture(two), [...clauses(one).map((c, i) => [c, clauses(two)[i]]), ...holesOf(criminalsOf(one), criminalsOf(two))]);
    expect(guilds.bad).toEqual([]);
    expect(guilds.seen).toBeGreaterThan(0);
    const under = numberDiffs(capture(alone), capture(none), holesOf(criminalsOf(alone), criminalsOf(none)));
    expect(under.bad).toEqual([]);
    expect(under.seen).toBeGreaterThan(0);
  });
});

/** Every goal line that prints a power slot, filled as `cellCandidates` fills it, keyed by its template. */
function goalTexts(power, rival) {
  const slots = { power, rival, guild: power, issue: 'the tolls', above: 'Ada Vell', below: 'Bo Rann', front: 'the mill', handler: 'Cy Orr', agent: 'Di Ness', target: 'Ed Mott', targetHouse: 'the mill' };
  const said = { ...slots, power: powerNameWithArticle(power), rival: powerNameWithArticle(rival), guild: powerNameWithArticle(power) };
  /** @type {Map<string, string>} */ const out = new Map();
  for (const subs of Object.values(GOAL_FAMILY_LINES)) for (const v of Object.values(subs)) for (const lines of Object.values(v)) for (const l of lines) {
    const t = typeof l === 'string' ? l : l.line;
    if (!/\{(?:power|rival|guild)[}|]/.test(t)) continue;
    const filled = fillLine(fillAgreement(t, slots), said);
    if (filled) out.set(t, filled);
  }
  return out;
}

describe('the goal lines (goalFamilies.js through goals.js :: cellCandidates)', () => {
  it('an "it"/"its" said of a plural power is "them"/"their"/"they"; no form is left unfilled', () => {
    const many = goalTexts(MANY, 'Craft Guilds');
    const one = goalTexts(ONE, 'Royal Authority');
    const formed = [...many.keys()].filter((t) => /\{power\|/.test(t));
    expect(formed.length).toBeGreaterThanOrEqual(8);
    for (const t of formed) {
      // each form, filled for the plural power, reads its plural; for the singular, its singular
      const forms = [...t.matchAll(/\{power\|([^|}]*)\|([^}]*)\}/g)];
      for (const [, sing, plur] of forms) {
        expect(many.get(t), t).toContain(` ${plur}`);
        expect(one.get(t), t).toContain(` ${sing}`);
      }
    }
    expect([...many.values(), ...one.values()].some((x) => /[{|}]/.test(x))).toBe(false);
  });
  it('NAMES-4: every goal line, its power in both numbers, differs only by number, the right way round, and every form differs', () => {
    const one = goalTexts(SOLO, RIVAL); const many = goalTexts(MANY, RIVAL);
    const keys = [...one.keys()];
    expect([...many.keys()]).toEqual(keys);
    const d = numberDiffs(keys.map((k) => String(one.get(k))), keys.map((k) => String(many.get(k))), holesOf(SOLO, MANY), keys);
    expect(d.bad).toEqual([]);
    const formed = keys.filter((t) => /\{power\|/.test(t));
    expect(formed.length).toBeGreaterThan(0);
    expect(formed.filter((t) => !d.differing.has(t))).toEqual([]);
  });
  it('CV7: the rival\'s "they" after a singular power stands, unchanged by the cure', () => {
    const one = goalTexts(ONE, 'Royal Authority');
    const theyLines = [...one.entries()].filter(([t]) => /\{rival\}[^.]*\bthey\b/.test(t.replace(/\{[^}]*\|[^}]*\}/g, '')));
    expect(theyLines.length).toBeGreaterThan(0);
    for (const [t, filled] of theyLines) {
      expect(t.includes('{rival|'), t).toBe(false);
      expect(filled).toMatch(/\bthey\b/);
    }
  });
});

describe('the crisis secrets (stressInstitutionEffects.js, filled as npcGenerator.js fills them)', () => {
  const fills = (name) => Object.values(STRESS_INSTITUTION_EFFECTS).flat().flatMap((e) => [
    fillSentenceSlots(e.secret, { faction: powerNameWithArticle(name), has: powerVerb(name, 'has', 'have') }),
    e.stakes ? fillSentenceSlots(fillAgreement(e.stakes, { power: name }), { faction: powerNameWithArticle(name) }) : '', // NAMES-4: the stakes' agreement slot is `power`
  ]);
  it('a plural power takes the plural verb, wherever it stands', () => {
    const t = fills(MANY);
    expect(t.flatMap((x) => wrongVerb(x, MANY, true)).filter((x) => !/considers/.test(x))).toEqual([]); // "considers" right after the name: NAMES-2's withPowerVerb, after the fill
    expect(t.join('\n')).toContain(`that the ${MANY} helped cause and ${powerVerb(MANY, 'has', 'have')} been concealing`);
    expect(t.join('\n')).toContain(`The ${MANY} ${powerVerb(MANY, 'is', 'are')} about to do their own independent count`);
  });
  it('a singular power takes the singular verb, and its "they"/"their" stand (CV7)', () => {
    const t = fills(ONE);
    expect(t.flatMap((x) => wrongVerb(x, ONE, false))).toEqual([]);
    expect(t.join('\n')).toContain(`The ${ONE} is about to do their own independent count`);
    expect(t.join('\n')).toMatch(new RegExp(`The ${ONE} suspects it\\. They've been watching`));
  });
  it('NAMES-4: every secret and stake, its power in both numbers, differs only by number, the right way round, and every form differs', () => {
    const templates = Object.values(STRESS_INSTITUTION_EFFECTS).flat().flatMap((e) => [e.secret, e.stakes ?? '']);
    const d = numberDiffs(fills(SOLO), fills(MANY), holesOf(SOLO, MANY), templates);
    expect(d.bad).toEqual([]);
    const formed = templates.filter((t) => /\{power\||\{has\}/.test(t));
    expect(formed.length).toBeGreaterThan(0);
    expect(formed.filter((t) => !d.differing.has(t))).toEqual([]);
  });
  it('NAMES-4: the secrets as generateCrimeLevel deals them (its own `{has}`), in both numbers, differ only by number, the right way round', () => {
    const npc = { name: 'Ada Vell', role: 'Reeve', category: 'government' };
    /** every secret a stress deals one figure, each refused once dealt (the held set), on a stream that always rolls the secret */
    const dealt = (/** @type {string} */ name) => Object.keys(STRESS_INSTITUTION_EFFECTS).flatMap((type) => {
      const held = new Set(); /** @type {string[]} */ const out = [];
      for (let k = 0; k < 64; k++) {
        setActiveRng({ random: () => 0.1, seed: 'names-4' });
        const s = generateCrimeLevel(npc, 0, { stressTypes: [type], topFaction: name, govFaction: name, commodity: 'grain' }, [npc], held);
        clearActiveRng();
        if (!s || held.has(String(s.what).trim())) break;
        held.add(String(s.what).trim()); out.push(String(s.what), String(s.stakes));
      }
      return out;
    });
    const one = dealt(SOLO); const many = dealt(MANY);
    const d = numberDiffs(one, many, holesOf(SOLO, MANY));
    expect(d.bad).toEqual([]);
    // the `{has}` slot, filled by npcGenerator.js's own reader, was dealt and differed
    const hasHeads = Object.values(STRESS_INSTITUTION_EFFECTS).flat().map((e) => e.secret).filter((t) => /\{has\}/.test(t)).map((t) => t.slice(0, t.indexOf('{')));
    expect(hasHeads.length).toBeGreaterThan(0);
    for (const head of hasHeads) {
      const at = one.findIndex((t) => t.startsWith(head));
      expect(at, head).toBeGreaterThanOrEqual(0);
      expect(d.differing.has(String(at)), head).toBe(true);
    }
    // NAMES-4 (CV4): each stake whose verb agrees prints, as generateCrimeLevel deals it, what the old agreement form printed, in either number
    const rows = Object.entries(STRESS_INSTITUTION_EFFECTS).flatMap(([type, pool]) => pool.filter((e) => /\{power\|/.test(e.stakes ?? '')).map((e) => ({ type, e })));
    /** a town that keeps a gate (a row may need one), in the crisis */
    const town = (/** @type {string} */ type) => factsOf({ npcs: [npc], institutions: [{ name: 'Town gate' }], stress: [{ type }] });
    expect(rows.length).toBeGreaterThan(0);
    for (const name of [SOLO, MANY]) {
      for (const { type, e } of rows) {
        // the old form, computed from the new: the agreement slot as NAMES-3 named it, filled as NAMES-3's npcGenerator.js filled it
        const oldForm = e.stakes.replace(/\{power\|/g, '{faction|');
        expect(oldForm).not.toBe(e.stakes);
        const was = fillSentenceSlots(fillAgreement(oldForm, { faction: name }), { faction: powerNameWithArticle(name) });
        expect(was).not.toMatch(/[{|}]/); // anchored: `was` is the fill of a non-empty stake; the toContain below reads it whole
        const held = new Set(); /** @type {string[]} */ const stakes = [];
        for (let k = 0; k < 64; k++) {
          setActiveRng({ random: () => 0.1, seed: 'names-4' });
          const s = generateCrimeLevel(npc, 0, { stressTypes: [type], topFaction: name, govFaction: name, commodity: 'grain', facts: town(type) }, [npc], held);
          clearActiveRng();
          if (!s || held.has(String(s.what).trim())) break;
          held.add(String(s.what).trim()); stakes.push(String(s.stakes));
        }
        expect(stakes, `${name} :: ${e.stakes}`).toContain(was);
      }
    }
    // and the number moves the verb: the singular and plural fills of each old form differ
    for (const { e } of rows) {
      const oldForm = e.stakes.replace(/\{power\|/g, '{faction|');
      expect(fillAgreement(oldForm, { faction: SOLO })).not.toBe(fillAgreement(oldForm, { faction: MANY }));
    }
  });
});

describe('the pressure sentences (narrativeText.js)', () => {
  /** the two rows whose agreeing word stands inside a literal the presumed-things walker banks (named in the hand-back) */
  const BANKED = [new RegExp(` ${'controls'} one district and the institutions inside it`), new RegExp(`still ${'meets'}, but nothing it decides stands`)];
  const rows = (top, gov) => (setActiveRng(createPRNG('names-3')), Object.values(PRESSURE_SENTENCES))
    .flatMap((f) => f({ name: 'Easford', topFaction: top, govFaction: gov, powerCount: 3, topNPCName: 'Ada Vell', topNPCRole: 'elder' }))
    .map((r) => (typeof r === 'string' ? r : r.text)).filter((t) => !BANKED.some((b) => b.test(t)));
  it('a plural power takes the plural verb ("…, and the Merchant Guilds are taking over the offices")', () => {
    const t = rows(MANY, MANY);
    expect(t.flatMap((x) => wrongVerb(x, MANY, true))).toEqual([]);
    expect(t.join('\n')).toContain(`and the ${MANY} ${powerVerb(MANY, 'is', 'are')} taking over the offices`);
  });
  it('a singular power takes the singular verb ("… now finds"), and its "they" stands (CV7)', () => {
    const t = rows(ONE, ONE).join('\n');
    expect(rows(ONE, ONE).flatMap((x) => wrongVerb(x, ONE, false))).toEqual([]);
    expect(t).toContain(`and now ${powerVerb(ONE, 'finds', 'find')} that`);
    expect(t).toContain(`which either means ${"they're"} incompetent`);
  });
  it('NAMES-4: every row on every branch, its leading and its governing power each in both numbers, differs only by number, the right way round', () => {
    // every branch a row takes on the record: the insurgency's two arms (a force or none; a thorp or larger), the migration's
    // three (departures, a strong economy, a weak one), the losing war's two purses
    const records = [{}, { tier: 'thorp' }, { tier: 'city' }, { migrationDirection: 'departures' }, { compound: { economyOutput: 60 } },
      { compound: { economyOutput: 20 } }, { warGoesWell: false, prosperity: 'Wealthy' }, { warGoesWell: false, prosperity: 'Poor' },
      ...[true, false].map((hasForce) => ({ hasForce, compound: { criminalEffective: 90, militaryEffective: 10, economyOutput: 20 } }))];
    const render = (/** @type {string} */ top, /** @type {string} */ gov) => records.flatMap((rec) => (setActiveRng(createPRNG('names-4')), Object.values(PRESSURE_SENTENCES))
      .flatMap((f) => f({ name: 'Easford', powerCount: 3, topNPCName: 'Ada Vell', topNPCRole: 'elder', ...rec, topFaction: top, govFaction: gov })))
      .map((r) => (typeof r === 'string' ? r : r.text)).filter((t) => !BANKED.some((b) => b.test(t)));
    const cases = [['both', (/** @type {string} */ n) => render(n, n)], ['leading', (/** @type {string} */ n) => render(n, RIVAL)], ['governing', (/** @type {string} */ n) => render(RIVAL, n)]];
    for (const [who, rendered] of /** @type {Array<[string, (n: string) => string[]]>} */ (cases)) {
      const d = numberDiffs(rendered(SOLO), rendered(MANY), holesOf(SOLO, MANY));
      expect(d.bad, who).toEqual([]);
      expect(d.seen, who).toBeGreaterThan(0);
    }
    clearActiveRng();
  });
});

describe('a qualified name\'s possessive (personMention.js :: qualifiedPossessives, item 3 (d))', () => {
  const Q = { name: 'Ada Vell (the miller)', gender: 'female', role: 'Miller' };
  const B = { name: 'Bo Rann', gender: 'male', role: 'Smith' };
  it('opens its bracket into an epithet, keeps the bare name, and leaves every other mention as written', () => {
    const line = `${B.name} still keeps ${Q.name}'s hours. ${Q.name} trained him.`;
    const out = secondMentions(line, [B, Q]);
    expect(out).toContain(`Ada Vell the miller's hours`);
    expectPresentThenAbsent(line, out, `)'s`, 'qualifiedPossessives opens the bracket after the possessive');
    expect(out).toContain(`${Q.name} trained him.`);
    expect(qualifiedPossessives(`${Q.name}’s ledger`, [Q])).toBe(`Ada Vell the miller’s ledger`);
    expect(qualifiedPossessives(`${B.name}'s ledger`, [B])).toBe(`${B.name}'s ledger`);
  });
  it('CONTROL: without the cure the bracket\'s possessive stands', () => {
    expect(`${Q.name}'s hours`).toContain(`)'s`);
  });
});
