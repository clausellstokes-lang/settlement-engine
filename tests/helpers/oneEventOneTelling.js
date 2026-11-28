/**
 * tests/helpers/oneEventOneTelling.js — BAR4-HISTORY, KIND T1 (BRIEF-BAR4 amendment K1): ONE PAST EVENT, ONE TELLING.
 *
 * THE DETECTOR: a pure function over a town's RECORD and its PRINTED LINES that returns EVERY instance of the kind, by
 * three arms, each reading settled fields (never the words of one flagged sentence):
 *
 *   PLACE  — a past event of the timeline (`history.historicalEvents[]`, keyed by `templateType`) and the current
 *            tension of the same template type (`history.currentTensions[]`, keyed by `type`) each place the event; the
 *            place is read by aligning each rendered description against every authored form of that type's
 *            description (`HISTORICAL_EVENTS_DATA`, `HISTORY_DESC_VARIANTS`, the sized twins `HISTORY_DESC_SIBLINGS`,
 *            the memory forms `byMemory`), so any place word any pool can print is found. Two places for one event fire.
 *   DATE   — a legacy note (`history.legacyAnnotations[]`: "the <Event> (<n> years ago)") and the strand timeline
 *            (`history.eventsTimeline[]`) date an event the timeline holds by name: any age other than its own fires.
 *   SHAPE  — the lines that call one event THE event that made the town as it stands (the record's
 *            `history.historicalCharacter` and the page's history lines: "is why this place looks as it does", "what
 *            exists now was built after the <Event>", "keeps the shape the town took after the <Event>", "lives in the
 *            town that time made", …): two different events so named on one page fire.
 *
 * Returns `[{ arm, event, values, lines }]`: the event (its name or type), the values the lines give it, and the lines.
 */
import { HISTORICAL_EVENTS_DATA, HISTORY_DESC_SIBLINGS } from '../../src/data/historyData.js';
import { HISTORY_DESC_VARIANTS } from '../../src/data/historyDescVariants.js';
import { CHARACTER_SHAPING_CLAIMS } from '../../src/domain/facts/shapingEvent.js';

const PLACE_TOKENS = ['{quarter}', '{location}'];
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every authored form of a type's description that places it, as an anchored regex with one `place` group. */
const placeFormsOf = (() => {
  /** @type {Map<string, RegExp[]>} */
  const memo = new Map();
  return (/** @type {string} */ type) => {
    if (memo.has(type)) return /** @type {RegExp[]} */ (memo.get(type));
    const tmpl = HISTORICAL_EVENTS_DATA.find((e) => e.type === type);
    /** @type {string[]} */
    const forms = [tmpl?.description, ...(HISTORY_DESC_VARIANTS[type] || [])].filter((t) => typeof t === 'string');
    const mem = tmpl?.byMemory; if (mem) for (const w of Object.values(mem)) if (typeof w?.description === 'string') forms.push(w.description);
    for (const f of [...forms]) for (const sib of (HISTORY_DESC_SIBLINGS[f] || [])) if (typeof sib?.text === 'string') forms.push(sib.text);
    const res = [...new Set(forms)].filter((f) => PLACE_TOKENS.some((t) => f.includes(t))).map((f) => {
      let src = ''; let rest = f; let placed = false;
      while (rest.length) {
        const m = /\{[a-z_]+\}/.exec(rest);
        if (!m) { src += escape(rest); break; }
        src += escape(rest.slice(0, m.index));
        if (PLACE_TOKENS.includes(m[0]) && !placed) { src += '(?<place>.+?)'; placed = true; } else src += '.+?';
        rest = rest.slice(m.index + m[0].length);
      }
      return new RegExp(`^${src}$`);
    });
    memo.set(type, res);
    return res;
  };
})();

/** @param {string} type @param {unknown} text @returns {string|null} the place the description gives the event */
export const placeIn = (type, text) => {
  const t = String(text ?? '');
  for (const re of placeFormsOf(type)) { const m = re.exec(t); if (m?.groups?.place) return m.groups.place.trim(); }
  return null;
};

const bare = (/** @type {string} */ n) => String(n || '').replace(/^the\s+/i, '').trim().toLowerCase();

/** The lines that call one event the one that made the town as it stands, each with its event's name group. */
/** The lines that call one event the one that made the town as it stands, each with its event's name group: the record's
 * character (`facts/shapingEvent.js`, the one home the desk reads too) and the page's history lines (DS-GEN-16's). */
export const SHAPING_CLAIMS = Object.freeze([
  ...CHARACTER_SHAPING_CLAIMS.map((re) => new RegExp(re.source.replace(/^\^/, ''))),
  /Much of what stands in .+? now was built after the (?<ev>[A-Za-z][\w' -]+?), and that legacy/,
  /In the wake of the (?<ev>[A-Za-z][\w' -]+?), .+? settled into a shape that still holds/,
  /still keeps the shape the \w+ took after the (?<ev>[A-Za-z][\w' -]+?), and that shape/,
  /Nobody now in .+? saw the (?<ev>[A-Za-z][\w' -]+?), and everybody here lives in the town that time made/,
]);

/**
 * @param {any} record the town's record (the census's `s`)
 * @param {ReadonlyArray<string>} [lines] the page's printed lines (the census's dump), when read
 * @returns {Array<{arm: 'PLACE'|'DATE'|'SHAPE', event: string, values: string[], lines: string[]}>}
 */
export function oneEventOneTellingInstances(record, lines = []) {
  const h = record?.history || {};
  const events = Array.isArray(h.historicalEvents) ? h.historicalEvents : [];
  const tensions = Array.isArray(h.currentTensions) ? h.currentTensions : [];
  /** @type {Array<{arm: 'PLACE'|'DATE'|'SHAPE', event: string, values: string[], lines: string[]}>} */
  const out = [];
  // PLACE
  for (const t of tensions) {
    const own = events.find((e) => e?.templateType === t?.type);
    if (!own) continue;
    const a = placeIn(t.type, own.description); const b = placeIn(t.type, t.description);
    if (a && b && a.toLowerCase() !== b.toLowerCase()) out.push({ arm: 'PLACE', event: String(t.type), values: [a, b], lines: [own.description, t.description] });
  }
  // DATE
  const ageOf = new Map(events.map((e) => [bare(e?.name), Number(e?.yearsAgo)]));
  for (const a of (Array.isArray(h.legacyAnnotations) ? h.legacyAnnotations : [])) {
    const m = /the (?<ev>[A-Z][\w' -]+?) \((?<n>\d+) years? ago\)/.exec(String(a?.annotation ?? ''));
    if (!m?.groups) continue;
    const own = ageOf.get(bare(m.groups.ev));
    if (own != null && Number.isFinite(own) && own !== Number(m.groups.n)) out.push({ arm: 'DATE', event: m.groups.ev, values: [String(own), m.groups.n], lines: [String(a.annotation)] });
  }
  for (const s of (Array.isArray(h.eventsTimeline) ? h.eventsTimeline : [])) {
    const own = ageOf.get(bare(s?.name));
    if (own != null && Number.isFinite(own) && s?.yearsAgo != null && own !== Number(s.yearsAgo)) {
      // the strand timeline holds the strands' own events by name; one name with an age the timeline holds elsewhere
      if (!events.some((e) => bare(e?.name) === bare(s.name) && Number(e.yearsAgo) === Number(s.yearsAgo))) out.push({ arm: 'DATE', event: String(s.name), values: [String(own), String(s.yearsAgo)], lines: [`eventsTimeline: ${s.name} ${s.yearsAgo}`] });
    }
  }
  // SHAPE
  /** @type {Map<string, string[]>} */
  const named = new Map();
  for (const line of [String(h.historicalCharacter ?? ''), ...lines]) {
    for (const re of SHAPING_CLAIMS) {
      const m = re.exec(line);
      if (m?.groups?.ev) { const k = bare(m.groups.ev); named.set(k, [...(named.get(k) || []), line.trim()]); }
    }
  }
  if (named.size > 1) out.push({ arm: 'SHAPE', event: [...named.keys()].join(' / '), values: [...named.keys()], lines: [...new Set([...named.values()].flat())] });
  return out;
}
