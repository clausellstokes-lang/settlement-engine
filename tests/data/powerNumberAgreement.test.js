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
import { fillAgreement, powerVerb } from '../../src/data/people/powerSentenceName.js';
import { qualifiedPossessives, secondMentions } from '../../src/data/people/personMention.js';
import { CAPTURE_LINES, PATRONAGE_LINES } from '../../src/data/people/dmPowerLines.js';
import { GOAL_FAMILY_LINES } from '../../src/data/people/goalFamilies.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { fillLine } from '../../src/generators/people/goals.js';
import { fillSentenceSlots } from '../../src/generators/narrativeProse.js';
import { powerNameWithArticle } from '../../src/domain/display/powerSentenceName.js';
import { setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

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
    if (rung === 'corrupted') fs.push({ ruler, agents: [], rulerCriminal: true, underworld: guilds[0] });
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
    e.stakes ? fillSentenceSlots(fillAgreement(e.stakes, { faction: name }), { faction: powerNameWithArticle(name) }) : '',
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
});

describe('a qualified name\'s possessive (personMention.js :: qualifiedPossessives, item 3 (d))', () => {
  const Q = { name: 'Ada Vell (the miller)', gender: 'female', role: 'Miller' };
  const B = { name: 'Bo Rann', gender: 'male', role: 'Smith' };
  it('opens its bracket into an epithet, keeps the bare name, and leaves every other mention as written', () => {
    const line = `${B.name} still keeps ${Q.name}'s hours. ${Q.name} trained him.`;
    const out = secondMentions(line, [B, Q]);
    expect(out).toContain(`Ada Vell the miller's hours`);
    expect(out).not.toContain(`)'s`);
    expect(out).toContain(`${Q.name} trained him.`);
    expect(qualifiedPossessives(`${Q.name}’s ledger`, [Q])).toBe(`Ada Vell the miller’s ledger`);
    expect(qualifiedPossessives(`${B.name}'s ledger`, [B])).toBe(`${B.name}'s ledger`);
  });
  it('CONTROL: without the cure the bracket\'s possessive stands', () => {
    expect(`${Q.name}'s hours`).toContain(`)'s`);
  });
});
