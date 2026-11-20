/**
 * traditionDescriptionFrames.walker.test.js — TRAD-1 (the seventh chair, 2026-11-20; rulings CTR2 and CTR6).
 *
 * THE CLOSED SET. A tradition's description (`domain/traditions/traditionDescription.js`) is composed ONLY from the
 * frames and fit rows of `data/traditionDescriptionTable.js`. This walker holds that set four ways:
 *   1. THE COUNT: every authored template string is enumerated and the count is pinned; a new frame moves the pin
 *      on purpose or reds.
 *   2. THE CAUSE LAW (CTR2): a word that asserts a cause ("since", "because", "in memory of", "founded", "after",
 *      "to mark") stands only in a CAUSE frame; every other authored string is scanned for it.
 *   3. THE LEVEL LAW (CTR6, the owner's calm rule): no authored string dramatises; a closed lexicon of drama words is
 *      scanned over every frame, gloss, lead and prose form.
 *   4. THE BORN POOL: every sentence the leaf composes for 24 born towns (four a tier, six cultures) matches one of
 *      the frames, and no composed sentence carries a drama word once the record's own names are masked.
 * Plus: THE TABLE HOLDS NO HIDEABLE HOUSE (no rite is ever given to a house the gallery veil may hide whole).
 *
 * RED FIRST, IN MEMORY: each law's predicate is driven over a PLANTED string and must name it (a drama word in a
 * lead; a cause word in a keeper frame; a sentence no frame produces), so no arm can pass by refusing nothing.
 */
import { describe, it, expect } from 'vitest';
import {
  ACT_LEADS, ELEMENT_GLOSS, HOUSE_FRAMES, POWER_FRAMES, OWNER_FRAMES, CAUSE_FRAMES, ECONOMY_FRAMES, KEEPER_HOUSES, ECONOMY_FIT,
  POWER_FRAME_VERBS,
} from '../../src/data/traditionDescriptionTable.js';
import { describeTradition } from '../../src/domain/traditions/traditionDescription.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

const CAUSE_WORDS = /\b(since|because|in memory of|founded|founding by|after|to mark|owing to|thanks to)\b/i;
const DRAMA_WORDS = /\b(blood\w*|grim\w*|dread\w*|fear\w*|feud\w*|war\b|wars|curse\w*|doom\w*|troubl\w*|strife|terror\w*|haunt\w*|vengeance|bitter\w*|dark\w*|sinister|violen\w*|massacre\w*|slaughter\w*|tragic\w*|tragedy|sorrow\w*|grief|griev\w*|desperat\w*|ruin\w*|menac\w*|ominous|uneasy|tension\w*|secret\w*|rival\w*)\b/i;

/** Every authored template string, by its home. */
function templates() {
  /** @type {Array<{ home: string, text: string, cause: boolean }>} */
  const out = [];
  const add = (home, text, cause = false) => out.push({ home, text, cause });
  for (const [act, pool] of Object.entries(ACT_LEADS)) pool.forEach((l, i) => add(`lead.${act}.${i}`, l.text));
  for (const [el, pool] of Object.entries(ELEMENT_GLOSS)) pool.forEach((l, i) => add(`gloss.${el}.${i}`, l.text));
  for (const [k, list] of Object.entries(HOUSE_FRAMES)) list.forEach((t, i) => add(`house.${k}.${i}`, t));
  for (const [k, list] of Object.entries(POWER_FRAMES)) list.forEach((t, i) => add(`power.${k}.${i}`, t));
  OWNER_FRAMES.forEach((t, i) => add(`owner.${i}`, t));
  for (const [k, list] of Object.entries(CAUSE_FRAMES)) list.forEach((t, i) => add(`cause.${k}.${i}`, t, true));
  for (const [k, list] of Object.entries(ECONOMY_FRAMES)) list.forEach((t, i) => add(`economy.${k}.${i}`, t));
  return out;
}

/** Every authored prose FORM a frame's slot may take from the table itself (the income prose). */
function proseForms() {
  return Object.values(ECONOMY_FIT).flatMap((rows) => rows.map((r) => r.prose));
}

/** The cause law's predicate: the homes of non-cause strings carrying a cause word. */
const causeViolations = (list) => list.filter((t) => !t.cause && CAUSE_WORDS.test(t.text)).map((t) => t.home);
/** The level law's predicate. */
const dramaViolations = (strings) => strings.filter((s) => DRAMA_WORDS.test(s));

/** A frame as a whole-sentence matcher: each {slot} matches any run of text. */
const frameRe = (t) => new RegExp(`^${t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+?')}$`);

/** Every sentence shape the leaf may produce: S1 (lead × gloss, or the lead alone) and every S2/S3 frame. */
function sentenceMatchers() {
  const res = [];
  const leads = Object.values(ACT_LEADS).flat().map((l) => l.text);
  const glosses = Object.values(ELEMENT_GLOSS).flat().map((l) => l.text);
  for (const lead of leads) {
    res.push(frameRe(`${lead}.`));
    for (const gloss of glosses) res.push(frameRe(`${lead} that ${gloss}.`));
  }
  for (const t of templates()) if (!t.home.startsWith('gloss.') && !t.home.startsWith('lead.')) res.push(frameRe(t.text));
  return res;
}
/** The sentences of a composed text no frame produces. */
const strayIn = (text, matchers) => text.split(/(?<=\.)\s+(?=[A-Z])/).filter((s) => s && !matchers.some((re) => re.test(s)));

describe('traditionDescriptionFrames — the closed set', () => {
  it('THE COUNT: the authored template strings number exactly the pin (a new frame moves it on purpose)', () => {
    expect(templates().length).toBe(92);
  });

  it('every frame slot is one of the slots the leaf fills', () => {
    const SLOTS = new Set(['house', 'House', 'person', 'title', 'power', 'Power', 'owner', 'Owner', 'town', 'Town', 'age', 'foundedBy', 'event', 'when', 'income', 'Income', 'is', 'brings', ...Object.keys(POWER_FRAME_VERBS)]);
    for (const t of templates()) for (const m of t.text.matchAll(/\{(\w+)\}/g)) expect(SLOTS.has(m[1]), `${t.home}: {${m[1]}}`).toBe(true);
  });
});

/** A frame whose subject is the power: its verb must be a POWER_FRAME_VERBS slot (the power's number chooses it). */
const POWER_SUBJECT = /\{Power\}\s+(\S+)/;
const bareVerbAfterPower = (list) => list.filter((t) => {
  const m = POWER_SUBJECT.exec(t.text);
  return m && !(/^\{(\w+)\}$/.test(m[1]) && Object.hasOwn(POWER_FRAME_VERBS, m[1].slice(1, -1)));
}).map((t) => t.home);

describe('traditionDescriptionFrames — a power\'s verb takes its number (the chair\'s ruling of 2026-11-20)', () => {
  it('every frame whose subject is {Power} hands its verb as a POWER_FRAME_VERBS slot (powerSentenceName.js :: powerVerb)', () => {
    expect(templates().filter((t) => POWER_SUBJECT.test(t.text)).length).toBeGreaterThan(0);
    expect(bareVerbAfterPower(templates())).toEqual([]);
  });

  it('RED FIRST: a bare verb planted after {Power} is named', () => {
    expect(bareVerbAfterPower([{ home: 'power.seat.planted', text: '{Power} keeps it.' }, { home: 'power.seat.ok', text: '{Power} {keeps} it.' }]))
      .toEqual(['power.seat.planted']);
  });
});

describe('traditionDescriptionFrames — the cause law (CTR2)', () => {
  it('a cause word stands only in a CAUSE frame', () => {
    expect(causeViolations(templates())).toEqual([]);
  });

  it('every CAUSE frame does assert its cause (the law cannot pass on an empty cause set)', () => {
    const causes = templates().filter((t) => t.cause);
    expect(causes.length).toBeGreaterThan(0);
    for (const t of causes) expect(CAUSE_WORDS.test(t.text), t.home).toBe(true);
  });

  it('RED FIRST: a cause word planted in a keeper frame is named', () => {
    const planted = [...templates(), { home: 'house.body.planted', text: 'It is kept by {house} because of {event}.', cause: false }];
    expect(causeViolations(planted)).toEqual(['house.body.planted']);
  });
});

describe('traditionDescriptionFrames — the level law (CTR6, the owner\'s calm rule)', () => {
  it('no authored frame, gloss, lead or prose form dramatises', () => {
    expect(dramaViolations([...templates().map((t) => t.text), ...proseForms()])).toEqual([]);
  });

  it('RED FIRST: a drama word planted in a lead is named', () => {
    expect(dramaViolations(['A common feast', 'A grim feast', 'A vigil'])).toEqual(['A grim feast']);
    expect(dramaViolations(['A common feast'])).toEqual([]); // the anchor: the same predicate passes a calm lead
  });
});

describe('traditionDescriptionFrames — the table holds no hideable house', () => {
  it('no keeper row matches any catalogue house the gallery veil may hide whole (criminal, clandestine, illegal brokerage)', () => {
    const hideable = [];
    for (const [tier, cats] of Object.entries(institutionalCatalog)) {
      for (const [category, rows] of Object.entries(cats)) {
        for (const [name, row] of Object.entries(rows)) {
          if (isHideableHouse({ name, category, ...row })) hideable.push(`${tier}:${name}`);
        }
      }
    }
    expect(hideable.length).toBeGreaterThan(0); // the scan reads a real catalogue
    const ids = new Set([...Object.values(KEEPER_HOUSES.element), ...Object.values(KEEPER_HOUSES.act)].flat().flatMap((r) => r.ids));
    const hits = hideable.filter((h) => ids.has(catalogIdForName(h.split(':').slice(1).join(':'))));
    expect(hits).toEqual([]);
  });
});

describe('traditionDescriptionFrames — the born pool: every composed sentence is a frame', () => {
  const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const CULTURES = ['germanic', 'norse', 'latin', 'arabic', 'east_asian', 'south_asian'];
  const towns = TIERS.flatMap((settType, i) => [0, 1, 2, 3].map((j) => generateSettlementPipeline(
    { settType, culture: CULTURES[(i + j) % CULTURES.length], terrainOverride: 'auto', tradeRouteAccess: 'random_trade', monsterThreat: 'civilized' },
    null, { seed: `trad-walker-${settType}-${j}`, customContent: {} },
  )));
  const matchers = sentenceMatchers();

  it('24 born towns: every sentence of every description, for the owner and for the reader, is one of the frames', () => {
    let described = 0;
    const stray = [];
    for (const t of towns) {
      for (const rec of deriveFoundingTraditions(t)) {
        for (const audience of ['owner', 'reader']) {
          const d = describeTradition(rec, t, { audience });
          if (!d) continue;
          described += 1;
          stray.push(...strayIn(d.text, matchers).map((s) => `${t.name} (${audience}): ${s}`));
        }
      }
    }
    expect(described).toBeGreaterThan(100);
    expect(stray).toEqual([]);
  }, 60000);

  it('no composed description dramatises, once the record\'s own names are masked', () => {
    const loud = [];
    for (const t of towns) {
      for (const rec of deriveFoundingTraditions(t)) {
        const d = describeTradition(rec, t, { audience: 'owner' });
        if (!d) continue;
        let text = d.text.split(String(t.name)).join('');
        for (const n of [...d.named.houses, ...d.named.persons, ...d.named.powers, ...d.named.events]) text = text.split(n).join('');
        const fd = t.history?.founding?.foundedBy;
        if (typeof fd === 'string') text = text.split(fd).join('');
        if (DRAMA_WORDS.test(text)) loud.push(`${t.name}: ${d.text}`);
      }
    }
    expect(loud).toEqual([]);
  }, 60000);

  it('RED FIRST: a sentence no frame produces is named stray', () => {
    expect(strayIn('A common feast that honours the river. The river runs red with old grudges.', matchers))
      .toEqual(['The river runs red with old grudges.']);
  });
});
