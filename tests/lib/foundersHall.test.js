/**
 * foundersHall.test.js — THE HALL LIES NEVER (DESIGN_FOUNDERS_HALL §7).
 *
 * Every pin the design names, against the pure law module. The component pins
 * live in tests/components/foundersHallPage.test.jsx; these are the rules the
 * components are only allowed to render.
 *
 * The negative cases pin hardest, per house discipline: NEVER-SOLD (no purchase
 * vocabulary anywhere in the Hall's source), PERMANENCE (no writer reassigns a
 * chair), and DISPLAY LAW (zero unfilled chairs, ever).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  HALL_CHAIR_COUNT, romanNumeral, chairNumeral, seatedLabel,
  chairRingRole, CHAIR_RING_ROLES, normalizeChairRow,
  buildHallRoll, hallCount, showsRequestControl, foldName,
  validateChairBio, validateChairLetterAnswer, validateAuthoredHallText,
  composeChairLetter, HALL_LETTER_PROMPTS, HALL_BIO_MIN, HALL_BIO_MAX,
  HALL_CIVILITY_GUARD, HALL_REQUEST_SUBJECT,
} from '../../src/lib/foundersHall.js';
import { FOUNDER_SEAT_CAP } from '../../src/lib/founderSeats.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const held = (chair, displayName, extra = {}) => ({ chair, ...(displayName ? { displayName } : {}), ...extra });

describe('numerals', () => {
  test('thirty chairs run I..XXX and the cap is the ONE seat cap, not a second constant', () => {
    expect(HALL_CHAIR_COUNT).toBe(30);
    expect(HALL_CHAIR_COUNT).toBe(FOUNDER_SEAT_CAP);
    expect(chairNumeral(1)).toBe('I');
    expect(chairNumeral(4)).toBe('IV');
    expect(chairNumeral(9)).toBe('IX');
    expect(chairNumeral(17)).toBe('XVII');
    expect(chairNumeral(30)).toBe('XXX');
  });

  test('a chair number outside 1..thirty cannot mint a plate', () => {
    expect(chairNumeral(0)).toBeNull();
    expect(chairNumeral(31)).toBeNull();
    expect(chairNumeral(2.5)).toBeNull();
    expect(chairNumeral('7')).toBeNull();
  });

  test('the seating line is the year in the covenant’s own tense', () => {
    expect(seatedLabel('2026-03-14T00:00:00.000Z')).toBe('Seated MMXXVI');
    expect(romanNumeral(1999)).toBe('MCMXCIX');
    expect(seatedLabel(null)).toBeNull();
    expect(seatedLabel('not a date')).toBeNull();
  });
});

describe('role rings (§7 — three arms, one fixture)', () => {
  test('a staff founder wears their ring; a non-staff founder wears none', () => {
    expect(chairRingRole('developer')).toBe('developer');
    expect(chairRingRole('admin')).toBe('admin');
    expect(chairRingRole('user')).toBeNull();
    expect(chairRingRole(undefined)).toBeNull();
    expect(CHAIR_RING_ROLES).toEqual(['developer', 'admin']);
  });

  test('an unknown role never invents a ring', () => {
    expect(chairRingRole('support')).toBeNull();
    expect(chairRingRole('owner')).toBeNull();
  });
});

describe('the projection (fail-closed, consent-honest)', () => {
  test('a row is HELD by its presence, never by having a name — numeral-only chairs survive', () => {
    const row = normalizeChairRow({ chair_number: 17, display_name: null, seated_at: '2026-01-02' });
    expect(row).toEqual({ chair: 17, seatedAt: '2026-01-02' });
    expect(row.displayName).toBeUndefined();
    // The consent-punishing bug this guards: deriving held-ness from displayName
    // would erase this chair from both the roll and the counter.
    expect(hallCount(buildHallRoll([row])).held).toBe(1);
  });

  test('a malformed chair number is dropped rather than rendered', () => {
    expect(normalizeChairRow({ chair_number: 31 })).toBeNull();
    expect(normalizeChairRow({ chair_number: 0 })).toBeNull();
    expect(normalizeChairRow({ chair_number: 'IX' })).toBeNull();
    expect(normalizeChairRow(null)).toBeNull();
    expect(normalizeChairRow('a chair')).toBeNull();
  });

  test('an unknown role on a row does not become a ring', () => {
    expect(normalizeChairRow({ chair_number: 3, role: 'moderator' }).ringRole).toBeUndefined();
    expect(normalizeChairRow({ chair_number: 3, role: 'admin' }).ringRole).toBe('admin');
  });

  test('blank strings are absences, not empty plates', () => {
    const row = normalizeChairRow({ chair_number: 5, display_name: '   ', bio: '', seated_at: '  ' });
    expect(row).toEqual({ chair: 5 });
  });
});

describe('THE DISPLAY LAW (§2)', () => {
  const roll = buildHallRoll([
    held(12, 'delphine'),
    held(3),                       // numeral-only
    held(21, 'Bram'),
    held(7),                       // numeral-only
    held(9, 'Élodie'),        // Élodie
    held(2, 'Aurel'),
  ]);

  test('named chairs come first, alphabetically, case- and accent-blind', () => {
    expect(roll.slice(0, 4).map((c) => c.displayName)).toEqual(['Aurel', 'Bram', 'delphine', 'Élodie']);
  });

  test('numeral-only chairs follow the named, in numeral order', () => {
    expect(roll.slice(4).map((c) => c.chair)).toEqual([3, 7]);
    expect(roll.slice(4).every((c) => !c.displayName)).toBe(true);
  });

  test('the fold is the reason, and it is provable on its own', () => {
    expect(foldName('Élodie')).toBe('elodie');
    expect(foldName('DELPHINE')).toBe('delphine');
    // Deterministic across devices: a plain codepoint comparison of the folds,
    // never ICU collation (which orders non-ASCII differently per host).
    expect(foldName('Élodie') > foldName('delphine')).toBe(true);
  });

  test('the order is TOTAL — the same ledger renders identically every time', () => {
    const shuffled = buildHallRoll([held(2, 'Aurel'), held(9, 'Élodie'), held(7), held(21, 'Bram'), held(3), held(12, 'delphine')]);
    expect(shuffled.map((c) => c.chair)).toEqual(roll.map((c) => c.chair));
  });

  test('two founders with the same name tie-break on the chair, not on input order', () => {
    const a = buildHallRoll([held(20, 'Wren'), held(4, 'Wren')]);
    const b = buildHallRoll([held(4, 'Wren'), held(20, 'Wren')]);
    expect(a.map((c) => c.chair)).toEqual([4, 20]);
    expect(b.map((c) => c.chair)).toEqual([4, 20]);
  });

  test('ZERO UNFILLED CHAIRS: the roll is exactly the held chairs, never padded to thirty', () => {
    expect(roll).toHaveLength(6);
    expect(buildHallRoll([])).toHaveLength(0);
    expect(buildHallRoll(null)).toHaveLength(0);
  });

  test('a duplicated chair number renders once — one holder per chair, ever', () => {
    const dupe = buildHallRoll([held(9, 'First'), held(9, 'Second')]);
    expect(dupe).toHaveLength(1);
    expect(dupe[0].displayName).toBe('First');
  });

  test('buildHallRoll does not mutate its input', () => {
    const input = [held(12, 'delphine'), held(2, 'Aurel')];
    const snapshot = JSON.stringify(input);
    buildHallRoll(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});

describe('COUNTER TRUTH + THE PRESENCE LAW (§7 / §5b — both arms, one fixture)', () => {
  const fill = (n) => buildHallRoll(Array.from({ length: n }, (_, i) => held(i + 1, `F${i + 1}`)));

  test('held + open = thirty, exactly, always', () => {
    for (const n of [0, 1, 7, 29, 30]) {
      const c = hallCount(fill(n));
      expect(c.held + c.open).toBe(HALL_CHAIR_COUNT);
      expect(c.total).toBe(HALL_CHAIR_COUNT);
    }
  });

  test('held < thirty ⇒ the Request control EXISTS', () => {
    const c = hallCount(fill(29));
    expect(c.full).toBe(false);
    expect(showsRequestControl(c)).toBe(true);
  });

  test('held == thirty ⇒ the Request control is ABSENT (not disabled)', () => {
    const c = hallCount(fill(30));
    expect(c.full).toBe(true);
    expect(c.open).toBe(0);
    expect(showsRequestControl(c)).toBe(false);
  });

  test('a freed chair reopens the letterbox with no code change', () => {
    expect(showsRequestControl(hallCount(fill(30)))).toBe(false);
    expect(showsRequestControl(hallCount(fill(29)))).toBe(true);
  });
});

describe('authored public text — the bands and the civility SEAM', () => {
  const ok = 'A patron of small towns and long winters, and of the people who keep them.';

  test('the bio is OPTIONAL — an unwritten bio is not a failure', () => {
    expect(validateChairBio('').ok).toBe(true);
    expect(validateChairBio('   ').ok).toBe(true);
    expect(validateChairBio(null).ok).toBe(true);
  });

  test('the bio band holds at both ends', () => {
    expect(validateChairBio('too short').ok).toBe(false);
    expect(validateChairBio('too short').reason).toBe('short');
    expect(validateChairBio('x'.repeat(HALL_BIO_MAX + 1)).reason).toBe('long');
    expect(validateChairBio('x'.repeat(HALL_BIO_MIN)).ok).toBe(true);
    expect(validateChairBio(ok).ok).toBe(true);
  });

  test('BOTH letter prompts are required — a letter with a blank half is not a letter', () => {
    expect(validateChairLetterAnswer('').ok).toBe(false);
    expect(validateChairLetterAnswer('').reason).toBe('empty');
    expect(HALL_LETTER_PROMPTS.map((p) => p.key)).toEqual(['why', 'meaning']);
  });

  test('THE SEAM IS HONEST: with no guard injected, nothing claims a civility check ran', () => {
    expect(HALL_CIVILITY_GUARD).toBeNull();
    const r = validateChairBio(ok);
    expect(r.ok).toBe(true);
    expect(r.civilityChecked).toBe(false);
  });

  test('with a guard injected, BLOCK mode refuses and the result says a guard ran', () => {
    const guard = (text) => ({ blocked: /forbidden/i.test(text) });
    const clean = validateChairBio(ok, { civility: guard });
    expect(clean.ok).toBe(true);
    expect(clean.civilityChecked).toBe(true);
    const dirty = validateChairBio(`${ok} forbidden`, { civility: guard });
    expect(dirty.ok).toBe(false);
    expect(dirty.reason).toBe('blocked');
    expect(dirty.civilityChecked).toBe(true);
  });

  test('the band is checked BEFORE the guard, so an over-long string is not handed to a matcher', () => {
    let seen = 0;
    const guard = () => { seen += 1; return { blocked: false }; };
    validateAuthoredHallText('x'.repeat(9000), { min: 1, max: 10, civility: guard });
    expect(seen).toBe(0);
  });

  test('the composed letter carries the prompts, so an operator reads a letter', () => {
    const body = composeChairLetter({ why: 'Because.', meaning: 'Everything.' });
    expect(body).toContain(HALL_LETTER_PROMPTS[0].label);
    expect(body).toContain(HALL_LETTER_PROMPTS[1].label);
    expect(body).toContain('Because.');
    expect(body).toContain('Everything.');
  });
});

describe('THE NEGATIVE PINS — the ones that pin hardest', () => {
  const hallSources = [
    'src/lib/foundersHall.js',
    'src/lib/founderChairRequest.js',
    'src/components/founders/FoundersHallPage.jsx',
    'src/components/founders/ChairPlate.jsx',
    'src/components/founders/ChairDrawer.jsx',
    'src/components/founders/HallCovenant.jsx',
    'src/components/founders/RequestChairLetter.jsx',
    'src/components/founders/hallRegister.js',
  ];

  /** Source with block/line comments stripped — the doc comments legitimately
   *  DISCUSS the abolished vocabulary ("none ever sold"), and pinning against
   *  the prose would make the rule unwritable. The rule is about what the Hall
   *  RENDERS and DOES, so it is checked against code only. */
  function codeOf(rel) {
    return readFileSync(join(ROOT, rel), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/^\s*\/\/.*$/gm, ' ');
  }

  test('NEVER-SOLD: no Hall surface speaks purchase vocabulary in rendered code', () => {
    // "buy", "purchase", "price", "checkout", "$", "seats remaining" — the whole
    // family of the sentence that was abolished before it ever sold (§1).
    const forbidden = /\b(buy|purchase|checkout|price|pricing|payment|\$\d)\b/i;
    const offenders = hallSources.filter((rel) => forbidden.test(codeOf(rel)));
    expect(offenders, `purchase vocabulary reached a Hall surface:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('NEVER-SOLD: no Hall surface implies seats remaining FOR SALE', () => {
    const forbidden = /remaining|sold out|claim (a|your) (\w+ )?(seat|chair)|seats left/i;
    const offenders = hallSources.filter((rel) => forbidden.test(codeOf(rel)));
    expect(offenders).toEqual([]);
  });

  test('PERMANENCE: no Hall module exports a writer that could reassign a chair', () => {
    // The Hall's whole read+display surface is pinned to be read-only. Its ONE
    // writer is the letter, and a letter grants nothing — it inserts a support
    // ticket. Walk the exports and assert the absence of any chair mutator.
    const reassign = /export\s+(async\s+)?function\s+\w*(assign|reassign|transfer|grant|revoke|setChair|moveChair)\w*/i;
    const offenders = hallSources.filter((rel) => reassign.test(codeOf(rel)));
    expect(offenders, `a chair mutator appeared in the Hall:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('NO TRANSFER VOCABULARY: transfers are abolished, so the Hall cannot name them as a mechanic', () => {
    const forbidden = /\b(transferable|resale|succession|priorNames|prior_names|lineage)\b/i;
    const offenders = hallSources.filter((rel) => forbidden.test(codeOf(rel)));
    expect(offenders).toEqual([]);
  });

  test('the request subject carries the tag the admin panel filters on', () => {
    expect(HALL_REQUEST_SUBJECT).toBe("Founders' Hall — a request for a chair");
  });

  // ── NON-VACUITY CONTROLS ──────────────────────────────────────────────────
  // An `expect(offenders).toEqual([])` is true for two reasons: nothing offends,
  // or the detector cannot see. Each pin above is re-run here against a SPECIMEN
  // of the abolished design — the literal sentences the retired seat-lineage page
  // shipped — so a detector that stopped detecting reds instead of passing.
  const SPECIMEN_PURCHASE = 'Claim a Founder seat — one payment of $99 at checkout.';
  const SPECIMEN_SCARCITY = '7 of 30 seats remaining. When the seats are gone, the charter closes.';
  const SPECIMEN_TRANSFER = 'Founder seats are transferable: a transfer is a succession. Lineage: prior_names.';
  const SPECIMEN_WRITER = 'export function transferChairHolder(chair, toUser) { return null; }';

  test('CONTROL: the purchase detector fires on the abolished purchase sentence', () => {
    expect(/\b(buy|purchase|checkout|price|pricing|payment|\$\d)\b/i.test(SPECIMEN_PURCHASE)).toBe(true);
  });

  test('CONTROL: the scarcity detector fires on the abolished counter sentence', () => {
    expect(/remaining|sold out|claim (a|your) (\w+ )?(seat|chair)|seats left/i.test(SPECIMEN_SCARCITY)).toBe(true);
    expect(/remaining|sold out|claim (a|your) (\w+ )?(seat|chair)|seats left/i.test(SPECIMEN_PURCHASE)).toBe(true);
  });

  test('CONTROL: the transfer detector fires on the abolished lineage vocabulary', () => {
    expect(/\b(transferable|resale|succession|priorNames|prior_names|lineage)\b/i.test(SPECIMEN_TRANSFER)).toBe(true);
  });

  test('CONTROL: the writer detector fires on a chair mutator', () => {
    const reassign = /export\s+(async\s+)?function\s+\w*(assign|reassign|transfer|grant|revoke|setChair|moveChair)\w*/i;
    expect(reassign.test(SPECIMEN_WRITER)).toBe(true);
  });

  test('CONTROL: the sources the pins walk actually exist and carry code', () => {
    // The other way a source-scan pin goes vacuous: the file list drifts to paths
    // that no longer exist, and every scan reads an empty string.
    for (const rel of hallSources) {
      expect(codeOf(rel).length, `${rel} read as empty — the pin above scanned nothing`).toBeGreaterThan(400);
    }
    expect(hallSources).toHaveLength(8);
  });

  test('CONTROL: the list COVERS the Hall — a new Hall surface cannot slip past the pins', () => {
    // The third way a source-scan goes vacuous, and the quietest: the detectors
    // stay sharp and the files stay real, but a NEW Hall component lands and is
    // simply never added to the list. Nothing reds; the pin just stops covering
    // the surface it was written for. So the list is checked against the DIRECTORY
    // rather than against itself.
    //
    // ONE NAMED EXCLUSION, with its reason: FirstHundredPage.jsx shares the folder
    // but is a different surface entirely (/first-hundred — an open, unpriced
    // acknowledgment of early members, explicitly NOT the thirty chairs; the
    // relationship is stated in src/config/firstHundred.js per §8).
    const NOT_THE_HALL = new Set(['FirstHundredPage.jsx']);
    const onDisk = readdirSync(join(ROOT, 'src/components/founders'))
      .filter((f) => /\.(jsx?|mjs)$/.test(f) && !NOT_THE_HALL.has(f));
    const scanned = new Set(
      hallSources
        .filter((rel) => rel.startsWith('src/components/founders/'))
        .map((rel) => rel.split('/').pop()),
    );
    const unscanned = onDisk.filter((f) => !scanned.has(f));
    expect(
      unscanned,
      `a Hall surface exists that no negative pin walks — add it to hallSources (or to NOT_THE_HALL with a reason):\n${unscanned.join('\n')}`,
    ).toEqual([]);
    // Non-vacuity: the directory read actually found the Hall's components.
    expect(onDisk.length).toBeGreaterThan(4);
  });
});
