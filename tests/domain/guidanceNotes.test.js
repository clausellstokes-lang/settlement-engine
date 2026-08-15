/**
 * tests/domain/guidanceNotes.test.js — THE SURVEYOR'S-NOTES REGISTER WALKER
 * (W-GUIDE-2 §4). The structural-prevention machinery for the in-world voice:
 * it makes a note that resolves to nothing, a note in the wrong register (no
 * second person, or a leaked UI-verb), an unreachable variant, or copy/key
 * drift a RED test — not a shipped dissociation.
 *
 * Cut from the newsVoice.test.js walker (the F3a sidecar's own test), with the
 * register guard INVERTED: the crier BANS 'you/your' (diegetic third person);
 * the Surveyor's notes REQUIRE second person and instead BAN the plain
 * register's UI-verbs (click/tap/button/menu).
 */

import { describe, it, expect } from 'vitest';
import {
  NOTE_TOPICS,
  NOTE_MOMENTS,
  NOTE_LINES,
  NOTE_FLOOR,
  GUIDANCE_NOTES,
  GUIDANCE_NOTES_LAZY_SENTINEL,
  noteTopicForSurface,
  noteMomentFor,
  noteKeyFor,
  noteKeyForSurface,
  allNoteKeys,
} from '../../src/domain/display/guidanceNotes.js';
import { en } from '../../src/copy/en.js';

/** Resolve a dotted copy key against `en` directly (no t() DEV warnings). */
function resolveCopy(dottedKey) {
  let cur = /** @type {any} */ (en);
  for (const p of dottedKey.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Walk a `{topic:{moment:key[]}}` + floor structure, calling fn(key, where). */
function eachKey(fn) {
  for (const topic of NOTE_TOPICS) {
    for (const moment of NOTE_MOMENTS) {
      NOTE_LINES[topic][moment].forEach((key, i) => fn(key, `${topic}.${moment}[${i}]`));
    }
    NOTE_FLOOR[topic].forEach((key, i) => fn(key, `floor.${topic}[${i}]`));
  }
}

// ── (a) every key resolves to prose ─────────────────────────────────────────

describe('guidance notes — every key resolves to a non-empty copy string', () => {
  it('every NOTE_LINES / NOTE_FLOOR key resolves', () => {
    eachKey((key, where) => {
      const copy = resolveCopy(key);
      expect(typeof copy, `${where}: key ${key} must resolve to a string`).toBe('string');
      expect(String(copy).length, `${where}: key ${key} resolves to empty`).toBeGreaterThan(0);
    });
  });
});

// ── (b) both directions — no orphan prose, no dangling key ───────────────────

describe('guidance notes census — keys and prose bind both directions', () => {
  /** Collect every leaf string path under en.guidance.notes as a dotted key. */
  function enNoteLeafKeys() {
    const out = [];
    (function walk(node, prefix) {
      for (const [k, v] of Object.entries(node)) {
        const path = `${prefix}.${k}`;
        if (typeof v === 'string') out.push(path);
        else if (v && typeof v === 'object') walk(v, path);
      }
    })(en.guidance.notes, 'guidance.notes');
    return out.sort();
  }

  it('every note key is referenced by exactly one authored prose leaf (no dangling key)', () => {
    const prose = new Set(enNoteLeafKeys());
    for (const key of allNoteKeys()) {
      expect(prose.has(key), `key ${key} has no prose in en.guidance.notes`).toBe(true);
    }
  });

  it('every authored prose leaf is referenced by a note key (no orphan copy)', () => {
    const referenced = new Set(allNoteKeys());
    for (const key of enNoteLeafKeys()) {
      expect(referenced.has(key), `prose ${key} is orphaned — no NOTE_LINES/NOTE_FLOOR key points at it`).toBe(true);
    }
  });
});

// ── (c) the REGISTER GUARD — second person required, UI-verbs banned ─────────

describe('guidance notes register guard — the Surveyor speaks TO the keeper, never in UI-verbs', () => {
  // The plain register owns click/tap/button/menu; the note register owns the
  // second person. (The inverse of the crier's DENY_WORDS, which bans you/your.)
  const UI_VERBS = ['click', 'tap', 'button', 'menu'];
  const SECOND_PERSON = /\byou(r|rs|rself)?\b/i;

  it('every resolved note line addresses the keeper in the second person', () => {
    eachKey((key, where) => {
      const line = String(resolveCopy(key) || '');
      expect(SECOND_PERSON.test(line), `${where} is not in the note register (no second person): ${line}`).toBe(true);
    });
  });

  it('no resolved note line borrows a plain-register UI-verb', () => {
    eachKey((key, where) => {
      const line = String(resolveCopy(key) || '');
      for (const verb of UI_VERBS) {
        const re = new RegExp(`\\b${verb}\\b`, 'i');
        expect(re.test(line), `${where} leaks the UI-verb "${verb}" into the note register: ${line}`).toBe(false);
      }
    });
  });

  it('no resolved note line carries a digit, a URL, or a template token', () => {
    eachKey((key, where) => {
      const line = String(resolveCopy(key) || '');
      expect(/\d/.test(line), `${where} contains a digit: ${line}`).toBe(false);
      expect(/https?:/i.test(line), `${where} contains a URL: ${line}`).toBe(false);
      expect(/[{}]|%s|TODO/.test(line), `${where} contains a template token: ${line}`).toBe(false);
    });
  });

  it('every resolved note line is trimmed, bounded, and terminally punctuated', () => {
    eachKey((key, where) => {
      const line = String(resolveCopy(key) || '');
      expect(line.trim(), `${where} is not trimmed`).toBe(line);
      expect(line.length, `${where} too short`).toBeGreaterThanOrEqual(4);
      expect(line.length, `${where} too long`).toBeLessThanOrEqual(240);
      expect(/[.!?]$/.test(line), `${where} lacks terminal punctuation: ${line}`).toBe(true);
    });
  });

  it('never assumes the keeper is ignorant of the hobby (§9): no "tabletop"/"D&D"/"RPG" lecturing', () => {
    eachKey((key, where) => {
      const line = String(resolveCopy(key) || '').toLowerCase();
      for (const term of ['tabletop', 'dungeons', 'roleplay', 'rpg']) {
        expect(line.includes(term), `${where} lectures about the hobby ("${term}"): ${line}`).toBe(false);
      }
    });
  });
});

// ── (d) uniqueness — within a cell and globally ──────────────────────────────

describe('guidance notes uniqueness', () => {
  it('keys are unique within every cell', () => {
    for (const topic of NOTE_TOPICS) {
      for (const moment of NOTE_MOMENTS) {
        const cell = NOTE_LINES[topic][moment];
        expect(new Set(cell).size, `${topic}.${moment} has a duplicate key`).toBe(cell.length);
      }
      expect(new Set(NOTE_FLOOR[topic]).size, `floor.${topic} has a duplicate key`).toBe(NOTE_FLOOR[topic].length);
    }
  });

  it('resolved prose is globally unique across every cell (no line lives twice)', () => {
    const lines = allNoteKeys().map((k) => String(resolveCopy(k) || ''));
    expect(new Set(lines).size, 'a note line is authored in two cells').toBe(lines.length);
  });
});

// ── (e) determinism + full-variant reachability ──────────────────────────────

describe('guidance notes selection — deterministic and no dead variant', () => {
  it('same (topic, moment, id) resolves to the same key across repeats', () => {
    for (const topic of NOTE_TOPICS) {
      for (const moment of NOTE_MOMENTS) {
        const first = noteKeyFor(topic, moment, 'stable-id-42');
        for (let i = 0; i < 8; i++) {
          expect(noteKeyFor(topic, moment, 'stable-id-42')).toBe(first);
        }
      }
    }
  });

  it('sweeping synthetic ids reaches EVERY authored variant in every cell (no dead content)', () => {
    for (const topic of NOTE_TOPICS) {
      for (const moment of NOTE_MOMENTS) {
        const cell = NOTE_LINES[topic][moment];
        const reached = new Set();
        for (let i = 0; i < 200; i++) reached.add(noteKeyFor(topic, moment, `synthetic-${i}`));
        expect(reached.size, `${topic}.${moment}: not every variant is reachable`).toBe(cell.length);
        for (const key of cell) expect(reached.has(key), `${topic}.${moment}: ${key} is never selected`).toBe(true);
      }
    }
  });
});

// ── (f) totality — floor + out-of-scope + moment fallback ────────────────────

describe('guidance notes totality', () => {
  it('every topic has a floor of >=2 keys', () => {
    for (const topic of NOTE_TOPICS) {
      expect(NOTE_FLOOR[topic].length, `floor.${topic}`).toBeGreaterThanOrEqual(2);
    }
  });

  it('every cell has >=2 variants', () => {
    for (const topic of NOTE_TOPICS) {
      for (const moment of NOTE_MOMENTS) {
        expect(NOTE_LINES[topic][moment].length, `${topic}.${moment}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('noteKeyFor returns null for an out-of-scope topic and null/undefined inputs', () => {
    expect(noteKeyFor('nonsense', 'first', 'x')).toBeNull();
    expect(noteKeyFor(null, 'first', 'x')).toBeNull();
    expect(noteKeyFor(undefined, 'first', 'x')).toBeNull();
  });

  it('an unknown moment falls back to a valid key (total)', () => {
    const key = noteKeyFor('library', 'no-such-moment', 'x');
    expect(typeof key).toBe('string');
    expect(resolveCopy(key)).toBeTypeOf('string');
  });

  it('an empty cell would fall through to the floor (the variants[NaN] guard)', () => {
    // Guard the resolver's cell-or-floor branch: a topic whose cell is empty
    // must still resolve (to a floor key). We cannot mutate the frozen map, so
    // assert the branch's invariant directly: the floor is non-empty for each.
    for (const topic of NOTE_TOPICS) {
      expect(GUIDANCE_NOTES.floor[topic].length).toBeGreaterThan(0);
    }
  });
});

// ── (g) categorization — precedence + surface path ───────────────────────────

describe('guidance notes categorization', () => {
  it('maps known surfaces to topics with precedence', () => {
    expect(noteTopicForSurface('library')).toBe('library');
    expect(noteTopicForSurface('home')).toBe('library');
    expect(noteTopicForSurface('world-map')).toBe('realm');
    expect(noteTopicForSurface('wizard-postgen')).toBe('dossier');
    expect(noteTopicForSurface('living-world')).toBe('simulation');
  });

  it('returns null for an out-of-scope or missing surface', () => {
    expect(noteTopicForSurface('billing')).toBeNull();
    expect(noteTopicForSurface(null)).toBeNull();
    expect(noteTopicForSurface(undefined)).toBeNull();
  });

  it('noteMomentFor is total: empty ⇒ empty, first ⇒ first, else onward', () => {
    expect(noteMomentFor({ hasAny: false })).toBe('empty');
    expect(noteMomentFor(null)).toBe('empty');
    expect(noteMomentFor({ hasAny: true, isFirst: true })).toBe('first');
    expect(noteMomentFor({ hasAny: true })).toBe('onward');
  });

  it('noteKeyForSurface composes surface→topic + signal→moment', () => {
    const key = noteKeyForSurface('library', { hasAny: false }, 'seed');
    expect(NOTE_LINES.library.empty).toContain(key);
    expect(noteKeyForSurface('billing', { hasAny: false }, 'seed')).toBeNull();
  });
});

// ── (h) frozen structural pins ───────────────────────────────────────────────

describe('guidance notes are deeply frozen with no aliasing', () => {
  it('NOTE_LINES / NOTE_FLOOR / GUIDANCE_NOTES are frozen at every level', () => {
    expect(Object.isFrozen(NOTE_LINES)).toBe(true);
    expect(Object.isFrozen(NOTE_FLOOR)).toBe(true);
    expect(Object.isFrozen(GUIDANCE_NOTES)).toBe(true);
    for (const topic of NOTE_TOPICS) {
      expect(Object.isFrozen(NOTE_LINES[topic]), `${topic}`).toBe(true);
      expect(Object.isFrozen(NOTE_FLOOR[topic]), `floor.${topic}`).toBe(true);
      for (const moment of NOTE_MOMENTS) {
        expect(Object.isFrozen(NOTE_LINES[topic][moment]), `${topic}.${moment}`).toBe(true);
      }
    }
  });

  it('every cell array is a distinct object reference (no aliasing bug)', () => {
    const seen = new Set();
    for (const topic of NOTE_TOPICS) {
      for (const moment of NOTE_MOMENTS) {
        const arr = NOTE_LINES[topic][moment];
        expect(seen.has(arr), `${topic}.${moment} aliases another cell`).toBe(false);
        seen.add(arr);
      }
      expect(seen.has(NOTE_FLOOR[topic]), `floor.${topic} aliases another cell`).toBe(false);
      seen.add(NOTE_FLOOR[topic]);
    }
  });

  it('the lazy-leaf sentinel rides the retained object (non-vacuity)', () => {
    expect(GUIDANCE_NOTES.sentinel).toBe(GUIDANCE_NOTES_LAZY_SENTINEL);
    expect(GUIDANCE_NOTES.lines).toBe(NOTE_LINES);
    expect(GUIDANCE_NOTES.floor).toBe(NOTE_FLOOR);
  });
});
