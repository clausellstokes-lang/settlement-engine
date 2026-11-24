/**
 * patternLiteralsCodePoints.test.js — VEIL-53 J1 CURE (the chair's RULING V2 on J1): the pattern characters the voice walker
 * (tests/copy/voiceMechanics.test.js) read as prose are now written by code point, and every value is the one it was.
 *
 * gallerySecondHomes.js :: BANG, HOUSE_FLAGS, LEFT_BOUND, RIGHT_BOUND, NAME_SEPQ and galleryRosterChoices.js :: DASH, each
 * STRICTLY EQUAL AS A STRING to its former value, the former values spelled here as they stood at ba7460c33 (the walker reads
 * src/ only). Each is reached through an export: HOUSE_FLAGS directly; LEFT_BOUND, RIGHT_BOUND (and BANG inside them) through
 * buildNameSearch(...).pattern; DASH through applyRosterChoices' economy label; NAME_SEPQ by its one added export (no other
 * export carries its text). NAME_SEPQ is held a second way, by its compiled pattern over every code point 0 to 0xFFFF.
 */
import { describe, it, expect } from 'vitest';
import { HOUSE_FLAGS, NAME_BOUND, NAME_SEPQ, buildNameSearch } from '../../../src/domain/display/gallerySecondHomes.js';
import { applyRosterChoices } from '../../../src/domain/display/galleryRosterChoices.js';

// ── THE FORMER VALUES, as spelled at ba7460c33 ──────────────────────────────────────────────────────────────────────────
const FORMER_DASH = '—';
const FORMER_BANG = '!';
const FORMER_HOUSE_FLAGS_JSON = `{
  "hasMilitaryInst": {"kw": ["garrison", "barracks", "guard", "watch", "citadel", "walls", "militia", "mercenary", "navy", "charter hall"]},
  "hasGarrison": {"kw": ["garrison", "barracks", "professional guard", "multiple garrison"]},
  "hasMilitia": {"kw": ["citizen militia", "militia", "household levy"]},
  "hasWatch": {"kw": ["town watch", "city watch", "professional city watch", "village watch"]},
  "hasMercenary": {"live": true, "kw": ["mercenary company", "mercenary quarter", "hired muscle"], "re": "(?<![a-z0-9_])free company(?![a-z0-9_])"},
  "hasFreeCompany": {"kw": ["free company hall"]},
  "hasCharterHall": {"kw": ["adventurers' charter hall", "adventurers' guild hall", "multiple adventurers'", "adventurers' guild", "hireling hall"]},
  "hasWalls": {"kw": ["walls", "citadel", "gates (if walled)", "inner citadel", "massive walls", "palisade", "earthwork"]},
  "hasGates": {"live": true, "kw": ["wall", "citadel", "palisade", "earthwork", "inner citadel", "massive walls"], "not": "palisade|earthwork", "re": "(?<![a-z0-9_])gates?(?![a-z0-9_])"},
  "hasPrison": {"live": true, "re": "prison|stocks|(?<![a-z0-9_])gaol|(?<![a-z0-9_])jail"},
  "hasCourtSystem": {"live": true, "re": "courthouse|court buildings|democratic assembly|city hall|town hall"},
  "hasMarket": {"live": true, "names": ["annual fair", "auction house", "caravaneer's post", "carriers' guild", "cobbler's guild", "daily markets", "district markets (5-10)", "fish market", "furrier's district", "international trade center", "major annual fairs", "market square", "merchant guilds (15-40)", "merchant guilds (3-8)", "merchant guilds (50-100+)", "multiple market squares", "periodic market", "tailor's guild", "weekly market"]},
  "hasGuild": {"kw": ["guild", "guild consortium", "guild governance"]},
  "hasMerchantGuild": {"kw": ["merchant guild", "merchant oligarchy"]},
  "hasBank": {"kw": ["bank", "money changer", "counting", "stock exchange"]},
  "hasWarehouse": {"kw": ["warehouse"]},
  "hasPort": {"re": "(?<![a-z0-9_])(?:port|docks?|harbou?r|shipyard|navy)(?![a-z0-9_])"},
  "hasNavy": {"kw": ["navy", "major port"]},
  "hasGranary": {"kw": ["granar"]},
  "hasHospital": {"live": true, "re": "(?<![a-z0-9_])hospital|(?<![a-z0-9_])healer(?![a-z0-9_])|(?<![a-z0-9_])infirmar|(?<![a-z0-9_])monaster|(?<![a-z0-9_])friary(?![a-z0-9_])"},
  "hasChurch": {"kw": ["church", "cathedral", "temple", "monastery", "friary", "shrine", "priest", "abbey"]},
  "hasCathedral": {"kw": ["cathedral", "great cathedral"]},
  "hasMonastery": {"kw": ["monastery", "friary", "major monasteries"]},
  "hasMagicInst": {"kw": ["wizard", "mage", "alchemist", "enchant", "arcane", "academy of magic", "scroll scribe", "spellcasting", "hedge wizard"]},
  "hasMagesGuild": {"kw": ["mages' guild", "mages district", "enchanting quarter"]},
  "hasWizardTower": {"kw": ["wizard's tower", "multiple wizard towers"]},
  "hasAlchemist": {"kw": ["alchemist shop", "alchemist quarter"]},
  "hasCriminalInst": {"kw": ["thieves' guild", "black market", "smuggling", "assassins", "street gang", "front business", "gambling den", "underground city", "multiple criminal"]},
  "hasThievesGuild": {"kw": ["thieves' guild chapter", "thieves' guild (powerful)"]},
  "hasBlackMarket": {"kw": ["black market", "black market bazaar"]},
  "hasSmuggling": {"kw": ["smuggling network", "smuggling operation"]},
  "hasGangInfra": {"kw": ["multiple criminal", "street gang"]}
}`;
const FORMER_SEP_REST = String.raw`\x3a-\x40\x5b-\x60\x7b-\xbf\xd7\xf7\u2000-\u206f\u2e00-\u2e7f\u3000-\u303f\ufe30-\ufe6f\ufeff\uff00-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65`;
const FORMER_NAME_SEPQ = String.raw`\x01-\x21\x23-\x2f` + FORMER_SEP_REST;
const FORMER_LEFT_BOUND = `(?<![${NAME_BOUND}])`;
const FORMER_RIGHT_BOUND = `(?![${NAME_BOUND}])`;

// '中' is no separator, not in the blocking table, not padded, of no case class: its needle is itself, and a name ending in
// it takes no bound on that side. '1' blocks, and its needle is itself. So each pattern below is known whole.
const HAN = '\u4e2d';

/** The text a name search's pattern holds for one name. @param {string} name @returns {string} */
const patternOf = (name) => {
  const s = buildNameSearch([name], []);
  if (!s || typeof s.pattern !== 'string') throw new Error(`no pattern for ${JSON.stringify(name)}`);
  return s.pattern;
};

/** The present LEFT_BOUND, read out of the pattern whole: the name '1中' takes the left bound and no right. */
const leftBound = () => {
  const p = patternOf(`1${HAN}`);
  const tail = `(?:1${HAN})`;
  expect(p.endsWith(tail)).toBe(true);
  return p.slice(0, p.length - tail.length);
};
/** The present RIGHT_BOUND, read out of the pattern whole: the name '中1' takes the right bound and no left. */
const rightBound = () => {
  const p = patternOf(`${HAN}1`);
  const head = `(?:${HAN}1)(?:e?s)?`;
  expect(p.startsWith(head)).toBe(true);
  return p.slice(head.length);
};

/**
 * Two bracket bodies compared by membership over every code point 0 to 0xFFFF, compiled as `new RegExp('[' + body + ']')`.
 * @param {string} a @param {string} b @returns {{ agree: number, differ: number, members: [number, number], first: string|null }}
 */
function compareByCodePoints(a, b) {
  const ra = new RegExp(`[${a}]`);
  const rb = new RegExp(`[${b}]`);
  let agree = 0; let differ = 0; let ma = 0; let mb = 0;
  /** @type {string|null} */
  let first = null;
  for (let cp = 0; cp <= 0xffff; cp += 1) {
    const ch = String.fromCharCode(cp);
    const x = ra.test(ch); const y = rb.test(ch);
    if (x) ma += 1;
    if (y) mb += 1;
    if (x === y) agree += 1;
    else {
      differ += 1;
      if (first === null) first = `U+${cp.toString(16).toUpperCase().padStart(4, '0')}: former ${x}, present ${y}`;
    }
  }
  return { agree, differ, members: [ma, mb], first };
}

describe('VEIL-53 J1 cure: the pattern characters by code point, every value equal to its former spelling', () => {
  it('DASH (galleryRosterChoices.js) is the former em dash, as a string, read through applyRosterChoices', () => {
    const s = { institutions: [], economicState: { tier: 'hamlet', economicComplexity: '', incomeSources: [], primaryExports: [] } };
    applyRosterChoices(s, { institutions: [{ id: 'h1', name: 'Mill' }] }, (h) => String(h.id));
    const label = s.economicState.economicComplexity;
    expect(label).toBe(`Subsistence ${FORMER_DASH} survival economy`);
    const dash = label.slice('Subsistence '.length, label.length - ' survival economy'.length);
    expect(dash).toBe(FORMER_DASH);
  });

  it('LEFT_BOUND and RIGHT_BOUND are their former strings, read whole out of the name search pattern', () => {
    expect(leftBound()).toBe(FORMER_LEFT_BOUND);
    expect(rightBound()).toBe(FORMER_RIGHT_BOUND);
    expect(patternOf('1')).toBe(`${FORMER_LEFT_BOUND}(?:1)(?:e?s)?${FORMER_RIGHT_BOUND}`);
    expect(patternOf(HAN)).toBe(`(?:${HAN})`);
  });

  it('BANG is the former mark, as a string, read out of both bounds', () => {
    const l = leftBound(); const r = rightBound(); const body = `[${NAME_BOUND}])`;
    expect(l.startsWith('(?<') && l.endsWith(body)).toBe(true);
    expect(r.startsWith('(?') && r.endsWith(body)).toBe(true);
    expect(l.slice('(?<'.length, l.length - body.length)).toBe(FORMER_BANG);
    expect(r.slice('(?'.length, r.length - body.length)).toBe(FORMER_BANG);
  });

  it('HOUSE_FLAGS is its former table: the whole JSON and each re / not string', () => {
    const former = JSON.parse(FORMER_HOUSE_FLAGS_JSON);
    expect(JSON.stringify(HOUSE_FLAGS)).toBe(JSON.stringify(former));
    expect(Object.keys(HOUSE_FLAGS)).toEqual(Object.keys(former));
    let patterns = 0;
    for (const k of Object.keys(former)) {
      for (const a of ['re', 'not']) {
        expect(Object.prototype.hasOwnProperty.call(HOUSE_FLAGS[k], a)).toBe(Object.prototype.hasOwnProperty.call(former[k], a));
        if (a in former[k]) { expect(HOUSE_FLAGS[k][a]).toBe(former[k][a]); patterns += 1; }
      }
    }
    expect(patterns).toBe(7);
  });

  it('NAME_SEPQ is its former string', () => {
    expect(NAME_SEPQ).toBe(FORMER_NAME_SEPQ);
  });

  it('NAME_SEPQ compiles to the former pattern: the same membership over every code point 0 to 0xFFFF', () => {
    const r = compareByCodePoints(FORMER_NAME_SEPQ, NAME_SEPQ);
    expect(r.first).toBe(null);
    expect(r.differ).toBe(0);
    expect(r.agree).toBe(0x10000);
    expect(r.members[0]).toBe(r.members[1]);
  });

  it('the code point arm sees an off-by-one in a range (a negative control: the former head with \\x23 written \\x24)', () => {
    const planted = String.raw`\x01-\x21\x24-\x2f` + FORMER_SEP_REST;
    const r = compareByCodePoints(FORMER_NAME_SEPQ, planted);
    expect(r.differ).toBe(1);
    expect(r.agree).toBe(0xffff);
    expect(r.first).toBe('U+0023: former true, present false');
  });
});
