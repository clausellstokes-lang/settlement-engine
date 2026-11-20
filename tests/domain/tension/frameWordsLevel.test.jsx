/** @vitest-environment jsdom */
/**
 * tests/domain/tension/frameWordsLevel.test.jsx — CF9, NO DRAMA ADDED: THE FRAME'S WORDS HELD LEVEL, ITS OPENING OFF THE
 * ALARM ACCENT (FRAME-2 · B4; the chair's ruling: "The frame's words are level (a closed set, held by a walker, red first
 * by a plant); the opening does not sit under the alarm accent; no sentence says more than the record holds." The owner,
 * 2026-11-20: "Don't invent drama capitalize on what's already there if it's there. Sometimes a calm place is precisely
 * what's needed.").
 *
 *   (a) THE CLOSED SET. Every word the frame writes OF ITS OWN lives in the frozen tables it already has: TONIGHT_COPY's
 *       frame keys and the two sheet labels a side's want prints under (`wants`, `wantsSame`), FRAME_REASONS and
 *       FRAME_TIE_GLOSS (troubleCast.js). The tables are pinned here entry by entry: a new entry, or a changed one, reds
 *       until this list is updated, so a new word is read by a person before it ships. `troubleNameOf` composes no word
 *       of its own (the type's own words, `_` read as a space). And the source of the cast (troubleCast.js) and the
 *       sheet's frame functions (tonightSheet.js) carry no prose literal outside those tables.
 *   (b) LEVEL. No word of the closed set is in the level-breaking lexicon below (the chair's list, and the additions
 *       marked there).
 *   (c) ON BORN TOWNS. On a pool of born calm towns whose OWNER's sheet carries a frame (measured: at least two a tier
 *       where the tier births one; no calm thorp holds a trouble of weight, so the thorp has none), every string the
 *       frame's code path composes for the page is a closed-set word with its record slots filled, or the record's own
 *       text, located in the settlement record.
 *   (d) THE ACCENT. The Table View (and the PDF chapter, walked as an element tree) draws a FRAMED opening under the
 *       sheet's neutral accent (the screen's `accent`, the print's `gold`: the keys the sheet's own eyebrows and rules
 *       already use); a town in crisis keeps the alarm accent, and a calm town with no frame keeps exactly the rendering
 *       it had (CF1: the alarm accent, as before).
 *
 * This file's basename carries none of the mutation manifest's tokens (tests/lint/mutationCoverage.shared.mjs ::
 * NAME_PATTERN), and tests/domain is not an enforcer directory, so it takes no manifest row; its red was proven by
 * planting (the commit body of FRAME-2 · B4 records the counts).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, seatLineOf, sideReadOf, TONIGHT_COPY } from '../../../src/domain/summary/tonightSheet.js';
import { FRAME_REASONS, FRAME_TIE_GLOSS } from '../../../src/domain/tension/troubleCast.js';
import { powerNameInProse } from '../../../src/domain/display/governanceAccount.js';
import { LAMP_ACCENTS } from '../../../src/design/organic/lampTones.js';
import { palette as PDF_PALETTE } from '../../../src/pdf/theme.js';
import TableView from '../../../src/components/TableView.jsx';
import { TonightAtTheTable } from '../../../src/pdf/sections/TonightAtTheTable.jsx';

afterEach(() => cleanup());

// ── (a) the closed set, pinned ─────────────────────────────────────────────────────────────────────────────────────

/** The sheet's own labels the frame prints: its three frame keys, and the two a side's want prints under. */
const FRAME_COPY = Object.freeze({
  trouble: 'The trouble',
  sides: 'Its three sides',
  nobody: 'No one here is named for it.',
  wants: 'Wants to',
  wantsSame: 'Wants the same as',
  // FRAME-7 · F5R: the label of the framed sheet's seat line (`seatLineOf`), the calm sheet's own seat label
  seat: 'Holds the seat',
});
const PINNED_REASONS = Object.freeze({
  seat: 'because {they} [holds|hold] the seat',
  head: 'because {they} [heads|head] {power}',
  // FRAME-6 · F1 (the chair, 2026-11-20 15:35): a power's own member, not its head, on that power's row (first met in
  // this pool at frame-cast-village-65, "Because he is one of the Religious Authorities.")
  member: 'because {they} [is|are] one of {power}',
  commander: 'because {they} [commands|command] {power}',
  debtor: 'because {they} [owes|owe] {other} a debt not yet paid',
  creditor: 'because {other} owes {them} a debt not yet paid',
  tie: 'because {they} and {other} {gloss}',
  hook: 'because {their} own trouble is part of it',
  trade: 'because the trouble touches {their} trade',
  criminal: 'because {they} [heads|head] {power}, which works outside the law',
  criminalHouse: 'it works outside the law, and no one in it is named here',
  outsider: 'not named here; {other} keeps the {house}, where strangers lodge, and would know of them',
});
const PINNED_TIE_GLOSS = Object.freeze({
  'Financial Dependence': 'are tied by money, one depending on the other',
  'Silent Partnership': 'are partners in something neither will name',
  'The Patron No One Names': 'are bound by a patronage no one names',
  'Corrupt Arrangement': 'are in a crooked arrangement together',
  'Held Over Them': 'are bound by something one holds over the other',
  'Active Suppression': 'are at open odds, one working to shut the other down',
  'Mentor and Successor': 'are teacher and pupil',
  'Family Complication': 'are family, and it is not simple',
  'Professional Rivalry': 'are rivals, and neither gives the other ground',
  'Unresolved History': 'share a past neither has put behind them',
  'Outstanding Debt': 'are tied by a debt not yet paid',
  tieDefault: 'are closely tied',
});
/** Every string of the closed set. */
const CLOSED_WORDS = Object.freeze([...Object.values(FRAME_COPY), ...Object.values(PINNED_REASONS), ...Object.values(PINNED_TIE_GLOSS)]);

const read = (rel) => readFileSync(join(process.cwd(), rel), 'utf8');
/** The source with its comments struck (block, then line comments that do not sit inside a string). */
const uncommented = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^(\s*)\/\/.*$/gm, '$1').replace(/([;,{}()\]])\s*\/\/.*$/gm, '$1');
/** The prose literals of a source: every string or template literal that holds a word and a space (`${…}` struck). */
const proseLiterals = (src) => (uncommented(src).match(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g) || [])
  .map((lit) => lit.slice(1, -1).replace(/\$\{[^}]*\}/g, ''))
  .filter((body) => /[A-Za-z]{2,}/.test(body) && /\s/.test(body));
/** A function's whole source, by its name (brace-matched from its first `{` after the parameter list). */
const functionSource = (src, name) => {
  const at = src.indexOf(`function ${name}(`);
  if (at < 0) throw new Error(`no function ${name}`);
  const open = src.indexOf('{', src.indexOf(')', at));
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}' && (depth -= 1) === 0) return src.slice(at, i + 1);
  }
  throw new Error(`unclosed function ${name}`);
};

// ── (b) the level-breaking lexicon ─────────────────────────────────────────────────────────────────────────────────

/**
 * Alarm and drama words, frozen. A trailing `*` reads the word as a stem. The chair's list first; then this seat's
 * additions (FRAME-2 · B4): enemy, feud, riot, revolt, murder, kill, peril, menace, fury, rage, hatred, ruin, erupt,
 * flashpoint, tinderbox, crises.
 */
const LEVEL_BREAKING = Object.freeze([
  'urgen*', 'crisis', 'crises', 'danger*', 'dire', 'desperat*', 'deadly', 'doom*', 'threat*', 'war', 'wars', 'blood*',
  'explosi*', 'boil*', 'simmer*', 'powder keg', 'brink', 'collaps*', 'catastroph*', 'terror*', 'panic*', 'chao*',
  'violen*', 'seeth*', 'explod*',
  // this seat's additions
  'enem*', 'feud*', 'riot*', 'revolt*', 'murder*', 'kill*', 'peril*', 'menac*', 'fury', 'rage', 'hatred', 'ruin*',
  'erupt*', 'flashpoint*', 'tinderbox*',
]);
const LEVEL_RE = new RegExp(`\\b(?:${LEVEL_BREAKING.map((w) => (w.endsWith('*') ? `${w.slice(0, -1)}\\w*` : `${w}\\b`)).join('|')})`, 'i');

// ── (c) the born pool ──────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Born calm towns whose owner's sheet carries a frame, measured over troubleCast.test.js's `frame-cast-<tier>-<i>`
 * pool (every one of its fifty frames, none in crisis), chosen so that between them every reason of FRAME_REASONS
 * fires and a side stands absent: hamlet-46 (the seat, a rivalry, an absent side), village-43 (the hook, a creditor),
 * town-36 (an outsider reached through a keeper, a debtor), town-40 (trade), city-6 and city-38 (the criminal power,
 * a commander), city-20 (the criminal house, a silent partnership), metropolis-18 (a power's head). RE-SEATED at
 * FRAME-2 · B9 (W2 as written: both powers), measured over troubleCast.test.js's re-seated pool: city-19 and
 * metropolis-2 cast no frame now; city-38 (crime_wave: a commander, a hook, the criminal power) stands where city-19
 * stood (crime_wave: the same three), and metropolis-3 (trade_dispute: two trades, a tie) keeps the tier at three.
 */
const POOL = Object.freeze({
  hamlet: [23, 46, 52],
  village: [43, 65],
  town: [36, 40, 59],
  city: [6, 38, 20],
  metropolis: [1, 3, 18],
});
const TOWNS = Object.entries(POOL).flatMap(([tier, at]) => at.map((i) => {
  const seed = `frame-cast-${tier}-${i}`;
  return { seed, tier, s: generateSettlementPipeline({ settType: tier }, null, { seed, customContent: {} }) };
}));

/** @param {string} t @returns {string} */
const norm = (t) => t.replace(/\s+/g, ' ').trim().toLowerCase();
/** Every string leaf of a record, normalized and joined on a character no text holds. @param {unknown} root */
const recordText = (root) => {
  const out = [];
  const seen = new WeakSet();
  const visit = (v) => {
    if (typeof v === 'string') { out.push(norm(v)); return; }
    if (!v || typeof v !== 'object' || seen.has(v)) return;
    seen.add(v);
    for (const k of Object.keys(v)) visit(v[k]);
  };
  visit(root);
  return `\u0000${out.join('\u0000')}\u0000`;
};
/** Is this page string the record's own text (case and a closing full stop aside)? */
const locatedIn = (hay, text) => {
  const needle = norm(text).replace(/\.$/, '');
  return needle.length > 0 && hay.includes(needle);
};

/** sentence(): the closed-set template as the page prints it, capital first and closed. */
const asSentence = (t) => `${t[0].toUpperCase()}${t.slice(1)}${/[.!?]$/.test(t) ? '' : '.'}`;
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Each reason as the page prints it, its record slots captured by name. */
const SLOT = Object.freeze({
  '{they}': '(?:she|he|they)', '{their}': '(?:her|his|their)', '{them}': '(?:her|him|them)',
  '{gloss}': `(?:${Object.values(PINNED_TIE_GLOSS).map(esc).join('|')})`,
  '{other}': '(?<other>.+?)', '{power}': '(?<power>.+?)', '{house}': '(?<house>.+?)',
});
const REASON_SHAPES = Object.entries(PINNED_REASONS).map(([key, text]) => {
  const pattern = asSentence(text).split(/(\[[^\]]+\]|\{\w+\})/).map((tok) => {
    if (/^\[.+\]$/.test(tok)) return `(?:${tok.slice(1, -1).split('|').map(esc).join('|')})`;
    if (/^\{\w+\}$/.test(tok)) { if (!SLOT[tok]) throw new Error(`no slot ${tok}`); return SLOT[tok]; }
    return esc(tok);
  }).join('');
  return { key, re: new RegExp(`^${pattern}$`) };
});

/**
 * Every string the frame's code path composes for one town's page, classed: `closed` (a word of the closed set,
 * slots filled from the record), `record` (the record's own text, located), or a failure.
 */
function classify(seed, s) {
  const sheet = composeTonightSheet(s, { audience: 'owner' });
  const hay = recordText(s);
  const powers = (s.powerStructure?.factions || []).map((f) => f?.faction).filter((n) => typeof n === 'string' && n);
  const failures = [];
  const reasonsSeen = new Set();
  const record = (label, text) => { if (!locatedIn(hay, text)) failures.push(`${seed}: ${label} "${text}" is not the record's text`); };
  if (!sheet.frame) return { failures: [`${seed}: the owner's sheet carries no frame`], reasonsSeen };
  if (sheet.crisis) failures.push(`${seed}: in crisis`);
  const frame = sheet.frame;
  // the opening: the record's own sentence for the trouble
  record('the opening', sheet.opening);
  record('the trouble\'s sentence', frame.line);
  // the trouble by name: its type in words (troubleNameOf adds no word: `_` reads as a space)
  record('the trouble\'s name', frame.name.replace(/ /g, '_'));
  for (const h of frame.hooks) record('a trouble hook', h);
  // the sheet's hooks: the record's own text, in the frame's order (their source labels are the hook collector's,
  // dossier/plotHooks.js, as on every sheet; the frame composes none)
  for (const h of sheet.hooks) record('a hook', h.text);
  for (const side of frame.sides) {
    const r = sideReadOf(side);
    if (!locatedIn(hay, r.words) && !powers.some((p) => powerNameInProse(p, true) === r.words)) failures.push(`${seed}: side words "${r.words}" are not the record's`);
    if (r.who) for (const part of r.who.split(' · ')) record('a face', part);
    if (r.why === FRAME_COPY.nobody) {
      if (side.kind) failures.push(`${seed}: a filled side reads nobody`);
    } else {
      // the most specific shape that reads it: the one whose record slots hold the fewest characters
      const slotChars = (m) => Object.values(m.groups || {}).reduce((n, v) => n + (v || '').length, 0);
      const hit = REASON_SHAPES.map(({ key, re }) => ({ key, m: re.exec(r.why) })).filter(({ m }) => m)
        .sort((a, b) => slotChars(a.m) - slotChars(b.m))[0];
      if (!hit) failures.push(`${seed}: reason "${r.why}" is no closed-set reason`);
      else {
        reasonsSeen.add(hit.key);
        const g = hit.m.groups || {};
        if (g.other !== undefined) record('a reason\'s person', g.other);
        if (g.house !== undefined) record('a reason\'s house', g.house);
        if (g.power !== undefined && !powers.some((p) => powerNameInProse(p) === g.power)) failures.push(`${seed}: power "${g.power}" is no power on the record`);
      }
    }
    if (r.wants) {
      if (r.wants.startsWith(`${FRAME_COPY.wantsSame} `)) record('a same-as', r.wants.slice(FRAME_COPY.wantsSame.length + 1));
      else if (r.wants.startsWith(`${FRAME_COPY.wants} `)) record('a want', r.wants.slice(FRAME_COPY.wants.length + 1));
      else record('a secret or temperament', r.wants);
    }
  }
  // FRAME-7 · F5R: the seat line, where the sheet carries one: the label, then the record's own name and office
  if (sheet.seat) {
    const line = seatLineOf(sheet.seat);
    if (!line.startsWith(`${FRAME_COPY.seat}: `)) failures.push(`${seed}: the seat line "${line}" opens on no closed-set label`);
    record('the seat\'s holder', sheet.seat.name);
    if (sheet.seat.role) record('the seat\'s office', sheet.seat.role);
  }
  return { failures, reasonsSeen, sideKinds: frame.sides.map((d) => d.kind) };
}

describe('CF9 (a): the frame\'s own words are exactly the closed set', () => {
  it('the tables are pinned entry by entry (a new or changed entry reds until this list is updated)', () => {
    expect(Object.entries(FRAME_REASONS)).toEqual(Object.entries(PINNED_REASONS));
    expect(Object.entries(FRAME_TIE_GLOSS)).toEqual(Object.entries(PINNED_TIE_GLOSS));
    expect(Object.fromEntries(Object.keys(FRAME_COPY).map((k) => [k, TONIGHT_COPY[k]]))).toEqual(FRAME_COPY);
    expect(Object.isFrozen(FRAME_REASONS) && Object.isFrozen(FRAME_TIE_GLOSS) && Object.isFrozen(TONIGHT_COPY)).toBe(true);
  });

  it('the cast and the sheet\'s frame functions carry no prose literal outside the tables', () => {
    // the live tables' words, and their keys (a tie's archetype label, as the record writes it)
    const tables = new Set([FRAME_REASONS, FRAME_TIE_GLOSS].flatMap((t) => [...Object.keys(t), ...Object.values(t)]));
    const cast = proseLiterals(read('src/domain/tension/troubleCast.js')).filter((lit) => !tables.has(lit));
    expect(cast, 'troubleCast.js: a prose literal outside FRAME_REASONS / FRAME_TIE_GLOSS').toEqual([]);
    const sheetSrc = read('src/domain/summary/tonightSheet.js');
    const frameFns = ['frameOf', 'troubleNameOf', 'sideReadOf', 'framePeopleOf', 'frameHooksOf', 'frameSeatOf', 'seatLineOf'];
    const sheet = frameFns.flatMap((name) => proseLiterals(functionSource(sheetSrc, name)));
    expect(sheet, 'tonightSheet.js: a prose literal in the frame\'s code path').toEqual([]);
    // the scan is live: it finds every word of the two tables where it is written
    const found = new Set(proseLiterals(read('src/domain/tension/troubleCast.js')));
    expect([...Object.values(FRAME_REASONS), ...Object.values(FRAME_TIE_GLOSS)].filter((w) => !found.has(w))).toEqual([]);
  });
});

describe('CF9 (b): the closed set is level', () => {
  it('no word of the closed set is in the level-breaking lexicon', () => {
    // the lexicon is live: it catches its own words
    for (const w of ['an urgent matter', 'the crisis', 'a powder keg', 'catastrophic', 'at war', 'simmering']) expect(LEVEL_RE.test(w), w).toBe(true);
    for (const w of ['toward the warden', 'direct']) expect(LEVEL_RE.test(w), w).toBe(false);
    const broken = CLOSED_WORDS.filter((w) => LEVEL_RE.test(w));
    const live = [...Object.values(FRAME_REASONS), ...Object.values(FRAME_TIE_GLOSS), ...Object.keys(FRAME_COPY).map((k) => TONIGHT_COPY[k])].filter((w) => LEVEL_RE.test(w));
    expect(broken, 'the pinned closed set').toEqual([]);
    expect(live, 'the live tables').toEqual([]);
  });
});

describe('CF9 (c): on born framed towns, every string the frame composes is a closed-set word or the record\'s own', () => {
  it(`${TOWNS.length} born towns, at least two a tier that frames: classed, and the pool exercises every reason`, () => {
    const all = [];
    const reasons = new Set();
    const kinds = new Set();
    const tiers = {};
    for (const { seed, tier, s } of TOWNS) {
      const { failures, reasonsSeen, sideKinds = [] } = classify(seed, s);
      all.push(...failures);
      for (const k of reasonsSeen) reasons.add(k);
      for (const k of sideKinds) kinds.add(k || 'absent');
      tiers[tier] = (tiers[tier] || 0) + 1;
    }
    expect(all).toEqual([]);
    // not vacuous: every reason of the closed set fires somewhere in the pool, and a side stands absent
    expect([...reasons].sort()).toEqual(Object.keys(PINNED_REASONS).sort());
    expect(kinds.has('absent')).toBe(true);
    for (const t of ['hamlet', 'village', 'town', 'city', 'metropolis']) expect(tiers[t], t).toBeGreaterThanOrEqual(2);
  }, 300000);
});

// ── (d) the accent ─────────────────────────────────────────────────────────────────────────────────────────────────

/** A colour as the DOM reads it back. @param {string} c */
const domColour = (c) => { const p = document.createElement('div'); p.style.color = c; return p.style.color; };
/** The Table View's opening: its left rule's colour and its eyebrow's colour and words. */
const tableOpening = (s) => {
  const { container } = render(<TableView settlement={s} audience="owner" onClose={() => {}} />);
  const box = /** @type {HTMLElement} */ (container.querySelector('[data-tonight-sheet] > div'));
  const eyebrow = /** @type {HTMLElement} */ (box.firstElementChild);
  const out = { rule: box.style.borderLeftColor, eyebrow: eyebrow.style.color, words: eyebrow.textContent };
  cleanup();
  return out;
};
/** The PDF chapter's opening box, walked as an element tree (no render): its rule, ground and eyebrow colour. */
const pdfOpening = (s) => {
  const find = (el) => {
    if (!el || typeof el !== 'object') return null;
    if (Array.isArray(el)) { for (const c of el) { const f = find(c); if (f) return f; } return null; }
    if (el.props?.style?.borderLeft && /^2pt solid /.test(el.props.style.borderLeft)) return el;
    return find(el.props?.children);
  };
  const box = find(TonightAtTheTable({ settlement: s, narrativeMode: false }));
  const eyebrow = [box.props.children].flat().find((c) => c && c.props && c.props.color);
  return { rule: box.props.style.borderLeft.replace(/^2pt solid /, ''), ground: box.props.style.backgroundColor, eyebrow: eyebrow.props.color };
};

describe('CF9 (d): the framed opening sits under the neutral accent; a crisis keeps the alarm; a calm unframed town is as it was', () => {
  const framed = generateSettlementPipeline({ settType: 'hamlet' }, null, { seed: 'frame-cast-hamlet-46', customContent: {} });
  const crisis = generateSettlementPipeline({ settType: 'town', stressTypes: ['famine'] }, null, { seed: 'frame2-b4-crisis-town-0', customContent: {} });
  const calm = generateSettlementPipeline({ settType: 'thorp' }, null, { seed: 'frame-calm-thorp-0', customContent: {} });

  it('the three towns are what they are said to be', () => {
    const owner = (s) => composeTonightSheet(s, { audience: 'owner' });
    expect(!!owner(framed).frame && !owner(framed).crisis).toBe(true);
    expect(!!owner(crisis).crisis && !owner(crisis).frame).toBe(true);
    expect(!owner(calm).crisis && !owner(calm).frame && !!owner(calm).opening).toBe(true);
  });

  it('the Table View', () => {
    const accent = domColour(LAMP_ACCENTS.HOOK);
    const alarm = domColour(LAMP_ACCENTS.RED);
    expect(tableOpening(framed)).toEqual({ rule: accent, eyebrow: accent, words: TONIGHT_COPY.trouble });
    expect(tableOpening(crisis)).toEqual({ rule: alarm, eyebrow: alarm, words: TONIGHT_COPY.crisis });
    expect(tableOpening(calm)).toEqual({ rule: alarm, eyebrow: alarm, words: TONIGHT_COPY.urgent });
  });

  it('the PDF chapter', () => {
    expect(pdfOpening(framed)).toEqual({ rule: PDF_PALETTE.gold, ground: PDF_PALETTE.goldBg, eyebrow: PDF_PALETTE.gold });
    expect(pdfOpening(crisis)).toEqual({ rule: PDF_PALETTE.bad, ground: PDF_PALETTE.badBg, eyebrow: PDF_PALETTE.bad });
    expect(pdfOpening(calm)).toEqual({ rule: PDF_PALETTE.bad, ground: PDF_PALETTE.badBg, eyebrow: PDF_PALETTE.bad });
  });
});
