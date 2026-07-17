/**
 * tests/domain/newsVoice.test.js — the crier's-voice sidecar (W-voice).
 *
 * Behavioural gate for the pure display read-model src/domain/display/newsVoice.js:
 * every war/faith/trade beat × lifecycle bucket resolves to a speakable line;
 * out-of-scope news resolves to null; selection is strictly deterministic and
 * loosely anti-repeating; and every authored line holds the herald register.
 *
 * BYTE-SAFETY (note for the manager): this suite asserts BEHAVIOUR only. The
 * three golden masters (generator / worldpulse / pdf) and the first-paint
 * closure-budget test (tests/build/vendorPdfLazy.test.js, CLOSURE_BUDGET_BYTES)
 * are the byte-inertness gate and must be run independently — this module is
 * imported ONLY by the lazy WizardNewsPanel, never by generation or the pulse
 * kernel, and never mutates a wizardNews entry.
 */

import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { newsVoiceLine, newsVoiceCategory, VOICE_LINES, VOICE_FLOOR } from '../../src/domain/display/newsVoice.js';

const CATEGORIES = ['war', 'faith', 'trade', 'pestilence', 'calamity', 'migration', 'authority', 'succor', 'prosperity', 'reframe'];
const BUCKETS = ['onset', 'impact', 'relief', 'fade'];

// CONTENT-VT variety floor: every (category × bucket) cell must carry at least this
// many distinct authored lines. Raised from the historical 3 because a busy simulated
// year surfaces many beats of one class and a 3-4 pool visibly cycles in the feed.
const CELL_FLOOR = 7;

// Representative entry fields that hit each category (via impactKind) and each
// bucket (via kind / the transition). Enumerating these two axes reaches every
// (category × bucket) cell.
const CATEGORY_IMPACT_KIND = {
  war: 'conflict_pressure', faith: 'religious_pressure', trade: 'import_shortage',
  pestilence: 'plague_arrival', calamity: 'calamity',
  migration: 'migration_pressure', authority: 'authority_instability',
  succor: 'generosity_relief', prosperity: 'boom',
  // reframe rides the RESERVED forward-looking 'reframe' impactKind (no wave mints a
  // reframe wizardNews entry yet — the reframe kernel returns newsEntries:[]); the
  // classifier in newsVoiceCategory routes this token so the dormant category is
  // exercised by the coverage / register / reachability guards below.
  reframe: 'reframe',
};
const BUCKET_KIND = { onset: 'queued', impact: 'applied', relief: 'resolved', fade: 'ignored' };

/** Build a synthetic wizardNews-shaped entry that resolves to (cat, bucket). */
function entryFor(cat, bucket, id = 'e1') {
  return { id, kind: BUCKET_KIND[bucket], impactKind: CATEGORY_IMPACT_KIND[cat], channelType: null };
}

describe('newsVoice — coverage', () => {
  it('every (category × bucket) cell resolves to a non-empty authored line', () => {
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        const line = newsVoiceLine(entryFor(cat, bucket));
        expect(typeof line, `${cat}/${bucket}`).toBe('string');
        expect(line.length, `${cat}/${bucket}`).toBeGreaterThan(0);
        // It is one of THIS cell's authored variants (not the floor, not another cell).
        expect(VOICE_LINES[cat][bucket], `${cat}/${bucket}`).toContain(line);
      }
    }
  });

  it("routes generosity's GIVE receipt to 'succor' by impactKind (ahead of its trade_route channel)", () => {
    // The F3a fix: a relief entry carries channelType 'trade_route' (∈ TRADE_CHANNEL_TYPES),
    // so impactKind MUST classify first or it gets a market-shortage crier line.
    expect(newsVoiceCategory({ impactKind: 'generosity_relief', channelType: 'trade_route' })).toBe('succor');
    // A relief beat (kind 'applied' ⇒ impact bucket) speaks a succor line.
    const line = newsVoiceLine({ id: 'relief.1', impactKind: 'generosity_relief', channelType: 'trade_route', kind: 'applied' });
    expect(VOICE_LINES.succor.impact).toContain(line);
    // A refusal is left unclassified on purpose (the grudge has its own surface).
    expect(newsVoiceCategory({ impactKind: 'generosity_refusal', channelType: null })).toBeNull();
  });

  it('categorization honours the faith → war → trade precedence and the channelType path', () => {
    // impactKind precedence
    expect(newsVoiceCategory({ impactKind: 'religious_pressure' })).toBe('faith');
    expect(newsVoiceCategory({ impactKind: 'conflict_pressure' })).toBe('war');
    expect(newsVoiceCategory({ impactKind: 'protection_gap' })).toBe('war');
    expect(newsVoiceCategory({ impactKind: 'export_market_loss' })).toBe('trade');
    expect(newsVoiceCategory({ impactKind: 'route_disruption' })).toBe('trade');
    expect(newsVoiceCategory({ impactKind: 'tax_revenue_disruption' })).toBe('trade');
    // channelType path (no impactKind)
    expect(newsVoiceCategory({ channelType: 'war_front' })).toBe('war');
    expect(newsVoiceCategory({ channelType: 'military_protection' })).toBe('war');
    expect(newsVoiceCategory({ channelType: 'trade_dependency' })).toBe('trade');
    expect(newsVoiceCategory({ channelType: 'trade_route' })).toBe('trade');
    // resource_competition is a WAR channel (engine mints it with conflict_pressure).
    expect(newsVoiceCategory({ channelType: 'resource_competition' })).toBe('war');
    // faith wins even if a war/trade channel is also present (precedence)
    expect(newsVoiceCategory({ impactKind: 'religious_pressure', channelType: 'war_front' })).toBe('faith');
  });

  it('the onset bucket also covers the ready transition; fade covers expired', () => {
    expect(VOICE_LINES.war.onset).toContain(newsVoiceLine({ id: 'r', impactKind: 'conflict_pressure', kind: 'ready' }));
    expect(VOICE_LINES.war.fade).toContain(newsVoiceLine({ id: 'x', impactKind: 'conflict_pressure', kind: 'expired' }));
    // Unknown / missing transition falls back to the onset bucket (total).
    expect(VOICE_LINES.trade.onset).toContain(newsVoiceLine({ id: 'u', impactKind: 'import_shortage', kind: 'weird' }));
    expect(VOICE_LINES.faith.onset).toContain(newsVoiceLine({ id: 'm', impactKind: 'religious_pressure' }));
  });
});

describe('newsVoice — totality / scope', () => {
  it('out-of-scope news returns null (no voice line rendered)', () => {
    // Genuinely uncovered beats (crime, information, seasonal) still get no crier.
    expect(newsVoiceLine({ id: 'a', impactKind: 'information_shock', channelType: null, kind: 'applied' })).toBeNull();
    expect(newsVoiceLine({ id: 'b', impactKind: 'criminal_pressure', channelType: 'criminal_corridor', kind: 'queued' })).toBeNull();
    expect(newsVoiceLine({ id: 'c', impactKind: null, channelType: null, kind: 'applied' })).toBeNull();
    expect(newsVoiceLine(null)).toBeNull();
    expect(newsVoiceLine(undefined)).toBeNull();
    expect(newsVoiceCategory({ impactKind: 'information_shock', channelType: null })).toBeNull();
    expect(newsVoiceCategory(null)).toBeNull();
  });
});

describe('newsVoice — determinism (strict) and anti-repetition (loose)', () => {
  it('same entry ⇒ identical line across repeated calls', () => {
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        const entry = entryFor(cat, bucket, `${cat}-${bucket}-42`);
        const first = newsVoiceLine(entry);
        for (let i = 0; i < 8; i++) {
          expect(newsVoiceLine(entry), `${cat}/${bucket}`).toBe(first);
        }
      }
    }
  });

  it('across a spread of ids, more than one variant appears per cell (real texture)', () => {
    const ids = Array.from({ length: 16 }, (_, i) => `npc-${i}`);
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        const rendered = new Set(ids.map(id => newsVoiceLine(entryFor(cat, bucket, id))));
        expect(rendered.size, `${cat}/${bucket} should spread across variants`).toBeGreaterThan(1);
      }
    }
  });

  it('a missing/empty id is stable (falls to the empty-seed variant, no throw)', () => {
    const line = newsVoiceLine({ impactKind: 'conflict_pressure', kind: 'applied' });
    expect(typeof line).toBe('string');
    expect(newsVoiceLine({ impactKind: 'conflict_pressure', kind: 'applied' })).toBe(line);
  });
});

describe('newsVoice — herald register guard', () => {
  /** Every authored line, cell-labelled, across every category×bucket cell + floors. */
  function eachLine(fn) {
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        VOICE_LINES[cat][bucket].forEach((line, i) => fn(line, `${cat}.${bucket}[${i}]`));
      }
      VOICE_FLOOR[cat].forEach((line, i) => fn(line, `floor.${cat}[${i}]`));
    }
  }

  it(`every cell carries >=${CELL_FLOOR} variants; every floor carries >=2`, () => {
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        expect(VOICE_LINES[cat][bucket].length, `${cat}.${bucket}`).toBeGreaterThanOrEqual(CELL_FLOOR);
      }
      expect(VOICE_FLOOR[cat].length, `floor.${cat}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('all category×bucket cells and every floor are present and frozen', () => {
    expect(Object.isFrozen(VOICE_LINES)).toBe(true);
    expect(Object.isFrozen(VOICE_FLOOR)).toBe(true);
    for (const cat of CATEGORIES) {
      expect(Object.keys(VOICE_LINES[cat]).sort()).toEqual([...BUCKETS].sort());
      for (const bucket of BUCKETS) {
        expect(Object.isFrozen(VOICE_LINES[cat][bucket]), `${cat}.${bucket}`).toBe(true);
      }
      expect(Object.isFrozen(VOICE_FLOOR[cat]), `floor.${cat}`).toBe(true);
    }
  });

  it('each line is non-empty, terminally punctuated, token-free, and reasonably sized', () => {
    eachLine((line, where) => {
      expect(line.trim(), where).toBe(line);
      expect(line.length, `${where} length`).toBeGreaterThanOrEqual(4);
      expect(line.length, `${where} length`).toBeLessThanOrEqual(240);
      // Terminal punctuation: . ! ? ” (U+201D) or a straight double-quote.
      expect(/[.!?”"]$/.test(line), `${where} terminal punct: ${line}`).toBe(true);
      // No template tokens.
      for (const token of ['{', '}', '%s', 'TODO']) {
        expect(line.includes(token), `${where} token ${token}: ${line}`).toBe(false);
      }
    });
  });

  it('lines are unique within each cell (no template-with-synonyms padding)', () => {
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        const cell = VOICE_LINES[cat][bucket];
        expect(new Set(cell).size, `${cat}.${bucket} distinct`).toBe(cell.length);
      }
      expect(new Set(VOICE_FLOOR[cat]).size, `floor.${cat} distinct`).toBe(VOICE_FLOOR[cat].length);
    }
  });

  it('lines are globally unique across all cells (no line lives in two cells)', () => {
    const all = [];
    for (const cat of CATEGORIES) for (const bucket of BUCKETS) all.push(...VOICE_LINES[cat][bucket]);
    expect(new Set(all).size, 'a line appears in more than one cell').toBe(all.length);
  });

  it('every bucket array is a distinct object reference (no array aliasing)', () => {
    const arrays = [];
    for (const cat of CATEGORIES) for (const bucket of BUCKETS) arrays.push(VOICE_LINES[cat][bucket]);
    const expected = CATEGORIES.length * BUCKETS.length;
    expect(arrays.length).toBe(expected);
    expect(new Set(arrays).size, 'two cells share the same array reference').toBe(expected);
  });

  it('no authored line references a digit, a URL, or a party-facing / settlement-named token', () => {
    // Guards the product boundary: world-only, settlement-AGNOSTIC, never party-facing.
    const DENY_WORDS = ['you', 'your', 'yours', 'party', 'adventurer', 'adventurers', 'hero', 'heroes', 'click', 'tap', 'settlement'];
    eachLine((line, where) => {
      expect(/\d/.test(line), `${where} contains a digit: ${line}`).toBe(false);
      expect(/http/i.test(line), `${where} contains a URL: ${line}`).toBe(false);
      for (const word of DENY_WORDS) {
        const re = new RegExp(`\\b${word}\\b`, 'i');
        expect(re.test(line), `${where} contains banned token "${word}": ${line}`).toBe(false);
      }
    });
  });
});

describe('newsVoice — impactKind-primary precedence + channel fallback pins', () => {
  it('impactKind classifies first and beats a conflicting channelType', () => {
    expect(newsVoiceCategory({ impactKind: 'route_disruption', channelType: 'war_front' })).toBe('trade');
    expect(newsVoiceCategory({ impactKind: 'conflict_pressure', channelType: 'trade_route' })).toBe('war');
    expect(newsVoiceCategory({ impactKind: 'religious_pressure', channelType: 'war_front' })).toBe('faith');
  });

  it('channelType decides only as the fallback (no impactKind)', () => {
    expect(newsVoiceCategory({ channelType: 'resource_competition' })).toBe('war');
    expect(newsVoiceCategory({ channelType: 'military_protection' })).toBe('war');
    expect(newsVoiceCategory({ channelType: 'war_front' })).toBe('war');
    expect(newsVoiceCategory({ channelType: 'trade_route' })).toBe('trade');
    expect(newsVoiceCategory({ channelType: 'trade_dependency' })).toBe('trade');
    expect(newsVoiceCategory({ channelType: 'political_authority' })).toBe('authority');
    expect(newsVoiceCategory({ channelType: 'disaster' })).toBe('calamity');
    expect(newsVoiceCategory({ channelType: 'migration_pressure' })).toBe('migration');
  });
});

describe('newsVoice — the newest movers get their own voice (content-immersion-2)', () => {
  it('a plague arrival is PESTILENCE, not trade — even though it rides a trade_route channel', () => {
    // pestilenceKernel mints impactKind 'plague_arrival' with channelType 'trade_route';
    // the impactKind MUST win so the crier speaks sickness, not market-shortage.
    expect(newsVoiceCategory({ impactKind: 'plague_arrival', channelType: 'trade_route' })).toBe('pestilence');
    const line = newsVoiceLine({ id: 'p', impactKind: 'plague_arrival', channelType: 'trade_route', kind: 'applied' });
    expect(VOICE_LINES.pestilence.impact).toContain(line);
  });

  it('a calamity strike is CALAMITY, not trade — its disaster channel never falls through', () => {
    expect(newsVoiceCategory({ impactKind: 'calamity', channelType: 'disaster' })).toBe('calamity');
    const line = newsVoiceLine({ id: 'c', impactKind: 'calamity', channelType: 'disaster', kind: 'applied' });
    expect(VOICE_LINES.calamity.impact).toContain(line);
  });

  it('authority and migration impact-kinds classify ahead of any channel fallback', () => {
    expect(newsVoiceCategory({ impactKind: 'authority_instability', channelType: 'political_authority' })).toBe('authority');
    expect(newsVoiceCategory({ impactKind: 'migration_pressure', channelType: 'trade_route' })).toBe('migration');
    expect(VOICE_LINES.authority.impact).toContain(
      newsVoiceLine({ id: 'a', impactKind: 'authority_instability', kind: 'applied' }));
    expect(VOICE_LINES.migration.impact).toContain(
      newsVoiceLine({ id: 'm', impactKind: 'migration_pressure', kind: 'applied' }));
  });
});

describe('newsVoice — the upswing abundance voice + the set-but-unclassified guard (content-immersion-r2-1)', () => {
  it('boom / flourishing / reconstruction speak PROSPERITY, not the trade_route market-shortage line', () => {
    // The upswing mints carry channelType 'trade_route' (boom) / 'settlement'; impactKind
    // MUST classify first, or a boom borrows the trade crier's "shortage has bitten" line.
    expect(newsVoiceCategory({ impactKind: 'boom', channelType: 'trade_route' })).toBe('prosperity');
    expect(newsVoiceCategory({ impactKind: 'flourishing', channelType: 'settlement' })).toBe('prosperity');
    expect(newsVoiceCategory({ impactKind: 'reconstruction', channelType: 'settlement' })).toBe('prosperity');
    const line = newsVoiceLine({ id: 'b', impactKind: 'boom', channelType: 'trade_route', kind: 'applied' });
    expect(VOICE_LINES.prosperity.impact).toContain(line);
  });

  it('bust (a market COLLAPSE) classifies explicitly to trade — a defensible hardship voice, not the channel fallback', () => {
    expect(newsVoiceCategory({ impactKind: 'bust', channelType: 'trade_route' })).toBe('trade');
  });

  it('a set-but-UNCLASSIFIED impactKind gets NO voice, even with a war/trade channel (never the fallback)', () => {
    // The core content-immersion-r2-1 fix: a non-empty impactKind that matches no
    // classifier returns null rather than borrowing its channel's crier line.
    expect(newsVoiceCategory({ impactKind: 'some_future_kind', channelType: 'trade_route' })).toBeNull();
    expect(newsVoiceCategory({ impactKind: 'intervention_clash', channelType: 'war_front' })).toBeNull();
    expect(newsVoiceLine({ id: 'z', impactKind: 'some_future_kind', channelType: 'trade_route', kind: 'applied' })).toBeNull();
  });

  it('a BARE entry (no impactKind) still uses the channelType fallback (unchanged)', () => {
    // The guard must not break the legacy/persisted path: an empty impactKind still
    // falls through to channelType.
    expect(newsVoiceCategory({ impactKind: '', channelType: 'trade_route' })).toBe('trade');
    expect(newsVoiceCategory({ channelType: 'war_front' })).toBe('war');
  });
});

describe('newsVoice — CONTENT-VT: the reframe voice + pool-growth safety', () => {
  it('routes the reserved reframe impactKind to the reframe category (the 8th drama class)', () => {
    // reframeKernel mints NO wizardNews entry today (advanceReframes → newsEntries:[]);
    // this classifier RESERVES impactKind 'reframe' so a future reframe beat inherits a
    // crier, closing the survey's named "reframe routes nowhere" gap. Dormant/forward-looking.
    expect(newsVoiceCategory({ impactKind: 'reframe' })).toBe('reframe');
    for (const bucket of BUCKETS) {
      const line = newsVoiceLine({ id: `rf.${bucket}`, impactKind: 'reframe', kind: BUCKET_KIND[bucket] });
      expect(VOICE_LINES.reframe[bucket], `reframe/${bucket}`).toContain(line);
    }
  });

  it('the reframe voice does NOT hijack the epistemics/moral-drift near-neighbours', () => {
    // belief_misjudgment is the facts/epistemics layer, moral_reckoning is moral drift —
    // neither is the D7 reframe layer; both stay explicitly UNVOICED (the set-but-unclassified
    // guard), so the reframe crier never speaks beneath one of their headlines.
    expect(newsVoiceCategory({ impactKind: 'belief_misjudgment' })).toBeNull();
    expect(newsVoiceCategory({ impactKind: 'moral_reckoning' })).toBeNull();
  });

  it('pool growth is byte-inert: newsVoiceLine is a pure read (never mutates the entry)', () => {
    // Growing the pools is safe precisely because selection is VIEW-TIME: same entry ⇒ same
    // line, and the read-model writes NOTHING back. A frozen entry proves it (a stray write
    // would throw), and the line is stable across repeated calls at the new pool sizes.
    const entry = Object.freeze({ id: 'vt.1', impactKind: 'conflict_pressure', channelType: 'war_front', kind: 'applied' });
    const first = newsVoiceLine(entry);
    expect(typeof first).toBe('string');
    for (let i = 0; i < 8; i++) expect(newsVoiceLine(entry)).toBe(first);
  });

  it('the module is a pure byte-inert leaf: no imports, no wall-clock, no rng (source scan)', () => {
    // The zero-eager / same-seed guarantee rests on this module reaching NO store, persistence,
    // Date, or rng — so pool growth here can never move a golden or a first-paint byte.
    const src = readFileSync(new URL('../../src/domain/display/newsVoice.js', import.meta.url), 'utf8');
    expect(/^import[ {]/m.test(src), 'newsVoice must import nothing (pure leaf)').toBe(false);
    expect(/new Date|Date\.now\(|Math\.random/.test(src), 'newsVoice must use no wall-clock / rng').toBe(false);
  });
});

describe('newsVoice — full-variant reachability (no dead content)', () => {
  it('every authored variant in every cell is reachable by the FNV hash over a spread of ids', () => {
    const ids = Array.from({ length: 200 }, (_, i) => String(i));
    for (const cat of CATEGORIES) {
      for (const bucket of BUCKETS) {
        const cell = VOICE_LINES[cat][bucket];
        const reached = new Set(ids.map(id => newsVoiceLine(entryFor(cat, bucket, id))));
        const missing = cell.filter(line => !reached.has(line));
        // STOP-AND-REPORT signal: a non-empty `missing` names dead lines the hash never lands on.
        expect(missing, `${cat}.${bucket} has unreachable variant(s): ${JSON.stringify(missing)}`).toEqual([]);
        expect(reached.size, `${cat}.${bucket} reached count`).toBe(cell.length);
      }
    }
  });
});
