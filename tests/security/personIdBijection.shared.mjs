/**
 * personIdBijection.shared.mjs — VR46, THE GUARD RULING (the seat's ruling on the guards, VEIL-22, R4-CURE 3, made the
 * chair's VR46, no veto), the one instrument every re-stated guard uses.
 *
 * VR10 re-keys EVERY person id on EVERY non-owner read under one salt a read (212 :: _gallery_veil_rekey,
 * galleryVeilPeople.js :: rekeyPeople), so no non-owner read carries a person id byte-stable across reads. A guard that
 * pinned a served person id byte-for-byte (against another read, the owner's record, the 210 page or the twin) is
 * re-stated MODULO THE READ'S PERSON-ID BIJECTION AND NOTHING ELSE: each side's person ids (every value at a re-keyed
 * path, by its kind) are mapped to a canonical name by FIRST APPEARANCE in one fixed walk of the payload, and the two
 * sides are then compared byte-for-byte as before. Every other byte is compared exactly as it was.
 *
 * The re-keyed paths are exactly the re-key's (212 :: _gallery_veil_rekey, rule for rule), each value re-keyed only
 * where the re-key re-keys it (a person card's id, or a string spelled `npc_`): the fixed walk visits, in this order,
 *   1. the card ids: npcs[].id, powerStructure.factions[].members[].id, factions[].members[].id;
 *   2. the references: npcs[].goal.intent.short/long.target.id, npcs[].allegiance.handler, and the same three of each
 *      roster copy's member (powerStructure.factions[].members[], factions[].members[]: (G)); relationships[].from/.to/
 *      .npc1Id/.npc2Id; stress/stressors (one crisis or a list) .cast.roles[].id, .cast.levers[].holderId;
 *      simulationTrace[].targetId, simulationTrace[].downstreamEffects[].target;
 *   3. kind `tie`: relationships[].id (a tie's own id spells its ends' ids and is re-keyed whole).
 * The served marker's person keys (gallery_member_overrides) are mapped by `canonServed`, by the same names.
 *
 * THE TEETH (each re-stated guard executes them, `bijectionTeeth`): (i) a reference that does not follow its card (moved
 * to another person's key, or to a key no card holds) still reds; (ii) an ORIGINAL (stored) person id anywhere in a
 * served payload still reds (`unkeyPeople` throws: the re-key must have happened); (iii) a changed non-id byte still reds;
 * (iv) within one read the re-key is a BIJECTION: two stored people served under one id, or one person under two ids,
 * still reds (`unkeyPeople` throws on two cards under one id; the canonical comparison reds on either); (v) two reads of
 * one town DIFFER in their person ids (`readsDiffer`: no served person id of one read is served by the other).
 *
 * R4-IDS PART ONE (V34-R4I, VEIL-34's builder; brief R4-IDS-BRIEF.md, arm (2)): brought from a4b89bf9d
 * (`lane/veil-22-r4-2026-11-20`) to this path as a test helper, CHANGED in four places and no other:
 *   (A) tooth (ii) is a SUBSTRING search: a stored person id served inside ANY string (a tie id that spells its ends, a
 *       sentence) or as ANY object key reds, and `storedIdsServed` takes any value, so a guard passes the served marker
 *       (gallery_member_overrides) beside the document and the marker's keys are searched too (the brief: "as a substring
 *       of any string or as any key (the marker included)"); a NUMBER is searched by its text;
 *   (B) a person id may be a NUMBER (STOP 1, ruling 53's fold: a numeric id is caught as text): the walk takes a number at
 *       a person site as it takes a string, `rekeyed` asks `startsWith` of strings only, and the bijection's cards count
 *       a number id;
 *   (C) STOP 1: a card's OWN ties (`npcs[].relationships[]`: .from/.to/.npc1Id/.npc2Id/.targetId/.npcId, and the tie's own
 *       .id, kind `tie`) are re-keyed sites, walked after the top-level ties;
 *   (D) the walk's order is otherwise a4b89bf9d's, so a canonical name means what it meant there.
 * R4I-PAGE-3 (VEIL-38, G1), CHANGED in one place more:
 *   (E) tooth (ii)'s substring search masks the re-key's own fresh tokens first (`npc_`/`tie_` and 16 hex, not themselves a
 *       stored id): a stored id that is a PREFIX of a fresh token (a fixture's `npc_2`, `npc_11`; a number's text inside the
 *       hex) was read as served about one read in eight, a false red; every other occurrence still reds.
 * R4I-PAGE-4 (VEIL-38; the chair's ruling (e), 02:38 UTC, accepting (E) on two conditions), CHANGED in one place more:
 *   (F) (i) a STORED person id that itself has the fresh shape (`npc_`/`tie_` and 16 hex) is counted on every document
 *       judged (`freshShapedStoredIds`), is compared as a WHOLE TOKEN and never masked, and `storedIdsServed` REDS BY NAME
 *       wherever one exists (served or not: the mask could not tell it from the re-key's own); (ii) the mask takes WHOLE
 *       tokens only: no word character before the prefix, 16 hex, then no word character (letters of either case, digits,
 *       `_`), so a stored id served bare, or inside a longer string that is not a fresh token, still reds.
 * R4I-SQL-2 (VEIL-42; the chair's 40.8 (1); R4I-MEASURE's C, THE GAP), CHANGED in one place more, BY ITS CAUSE (212 ::
 * _gallery_veil_rekey and galleryVeilPeople.js :: rekeyPeople now re-key a roster copy's member at the card's paths):
 *   (G) a roster copy's member's goal.intent.short/long.target.id and allegiance.handler are re-keyed sites (phase 'ref'),
 *       walked right after the same three of npcs[] (powerStructure.factions[] first, then factions[], as the card ids are);
 *       every tooth stands as it was.
 */

const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const recs = (v) => (Array.isArray(v) ? v.filter(isRec) : []);
/** A key no card of any payload holds (re-keyed form, so only the bijection can tell it is foreign). */
export const FOREIGN_KEY = 'npc_ffffffffffffffff';

/** Every crisis object of a document (both copies, one crisis or a list). */
const crises = (d) => ['stress', 'stressors'].flatMap((k) => (Array.isArray(d?.[k]) ? d[k] : [d?.[k]])).filter((c) => isRec(c) && isRec(c.cast));

/** Each re-keyed site of `doc` in the fixed walk: [holder, key, kind, phase] (phase 'card' | 'ref' | 'tie'). */
function sites(doc) {
  const out = [];
  if (!isRec(doc)) return out;
  const at = (obj, path, kind, phase) => {
    let cur = obj;
    for (const k of path.slice(0, -1)) { if (!isRec(cur)) return; cur = cur[k]; }
    const v = isRec(cur) ? cur[path[path.length - 1]] : undefined;
    if (typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v))) out.push([cur, path[path.length - 1], kind, phase]); // (B)
  };
  for (const n of recs(doc.npcs)) at(n, ['id'], 'npc', 'card');
  for (const f of recs(doc.powerStructure?.factions)) for (const m of recs(f.members)) at(m, ['id'], 'npc', 'card');
  for (const f of recs(doc.factions)) for (const m of recs(f.members)) at(m, ['id'], 'npc', 'card');
  const cardRefs = (n) => {
    at(n, ['goal', 'intent', 'short', 'target', 'id'], 'npc', 'ref');
    at(n, ['goal', 'intent', 'long', 'target', 'id'], 'npc', 'ref');
    at(n, ['allegiance', 'handler'], 'npc', 'ref');
  };
  for (const n of recs(doc.npcs)) cardRefs(n);
  // (G) a roster copy's member at the card's paths
  for (const f of recs(doc.powerStructure?.factions)) for (const m of recs(f.members)) cardRefs(m);
  for (const f of recs(doc.factions)) for (const m of recs(f.members)) cardRefs(m);
  for (const t of recs(doc.relationships)) for (const k of ['from', 'to', 'npc1Id', 'npc2Id']) at(t, [k], 'npc', 'ref');
  // (C) STOP 1: a card's own ties
  for (const n of recs(doc.npcs)) for (const t of recs(n.relationships)) for (const k of ['from', 'to', 'npc1Id', 'npc2Id', 'targetId', 'npcId']) at(t, [k], 'npc', 'ref');
  for (const c of crises(doc)) {
    for (const r of recs(c.cast.roles)) at(r, ['id'], 'npc', 'ref');
    for (const l of recs(c.cast.levers)) at(l, ['holderId'], 'npc', 'ref');
  }
  for (const e of recs(doc.simulationTrace)) {
    at(e, ['targetId'], 'npc', 'ref');
    for (const x of recs(e.downstreamEffects)) at(x, ['target'], 'npc', 'ref');
  }
  for (const t of recs(doc.relationships)) at(t, ['id'], 'tie', 'tie');
  for (const n of recs(doc.npcs)) for (const t of recs(n.relationships)) at(t, ['id'], 'tie', 'tie'); // (C)
  return out;
}

/** The person card ids of `doc` (the re-key's `ids`). */
function cardIds(doc) {
  return new Set(sites(doc).filter((s) => s[3] === 'card').map(([h, k]) => h[k]));
}

/** Is `v` at a person site re-keyed by the re-key (a card's id, or spelled `npc_`)? A tie's own id always is. */
const rekeyed = (v, kind, ids) => kind === 'tie' || ids.has(v) || (typeof v === 'string' && v.startsWith('npc_')); // (B)

/**
 * A copy of `doc` with every person id (and every tie id) at a re-keyed path replaced by its canonical name
 * (`npc#k` / `tie#k`, k by first appearance in the fixed walk); `names` maps each original value to its name.
 * @returns {{ doc: any, names: Map<string, string> }}
 */
export function canonPeople(doc) {
  const c = clone(doc);
  const ids = cardIds(c);
  const names = new Map();
  const count = { npc: 0, tie: 0 };
  for (const [h, k, kind] of sites(c)) {
    const v = h[k];
    if (!rekeyed(v, kind, ids)) continue;
    const key = `${kind}|${v}`;
    if (!names.has(key)) names.set(key, `${kind}#${count[kind]++}`);
    h[k] = names.get(key);
  }
  return { doc: c, names: new Map([...names].map(([k, v]) => [k.slice(k.indexOf('|') + 1), v])) };
}

/** Every string of a value with its path, object keys included (`{key}`), a number by its text (B). */
function strings(v, p = '', out = []) {
  if (typeof v === 'string') out.push([p, v]);
  else if (typeof v === 'number' && Number.isFinite(v)) out.push([p, String(v)]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${p}[${i}]`, out));
  else if (isRec(v)) for (const k of Object.keys(v)) { out.push([`${p}{key}`, k]); strings(v[k], `${p}.${k}`, out); }
  return out;
}

/** (F) The fresh shape of a re-keyed id, as a whole value; and as a whole token inside a string (no word character either side). */
export const FRESH_SHAPE = /^(?:npc|tie)_[0-9a-f]{16}$/;
const FRESH_TOKEN = /(?<![0-9A-Za-z_])(?:npc|tie)_[0-9a-f]{16}(?![0-9A-Za-z_])/g;
/** (F)(i) The stored person ids of `reference` that themselves have the fresh shape: counted on every document judged. 0 wanted. */
export function freshShapedStoredIds(reference) {
  const ids = cardIds(reference);
  return [...new Set(sites(reference).filter(([h, k, kind]) => kind === 'npc' && rekeyed(h[k], kind, ids)).map(([h, k]) => String(h[k])))].filter((x) => FRESH_SHAPE.test(x));
}

/**
 * TOOTH (ii): the original (stored) person ids of `reference` (its cards' and every person reference's), found anywhere
 * in `served` (a value or a key), AS A SUBSTRING (A): `served` may be any value, e.g. `[document, servedMarker]`, so the
 * marker's keys are searched beside the document. Empty wanted.
 */
export function storedIdsServed(served, reference) {
  const ids = cardIds(reference);
  const stored = [...new Set(sites(reference).filter(([h, k, kind]) => kind === 'npc' && rekeyed(h[k], kind, ids)).map(([h, k]) => String(h[k])))].filter((x) => x !== '');
  const out = [];
  const storedSet = new Set(stored);
  // (F)(i) a stored id of the fresh shape reds by name, wherever it is (the mask below never takes it: a whole token)
  for (const x of stored) if (FRESH_SHAPE.test(x)) out.push(`(F) a stored person id has the re-key's fresh shape: ${x}`);
  // (E) the re-key's own fresh tokens are masked before the search, so a short stored id that happens to begin a fresh
  // token (stored `npc_2` and served `npc_2f…`) is not read as served: a stored id served verbatim, or inside any other text,
  // still reds; a token that IS a stored id is never masked. (F)(ii) whole tokens only
  const fresh = (s) => s.replace(FRESH_TOKEN, (t) => (storedSet.has(t) ? t : '\u0000'));
  for (const [p, s] of strings(served)) { const m = fresh(s); const id = stored.find((x) => m.includes(x)); if (id !== undefined) out.push(`${p} = ${s}${s === id ? '' : ` (holds ${id})`}`); }
  return out;
}

/**
 * `served` with each person id (and tie id) replaced by the `reference`'s id OF THE SAME CANONICAL NAME, so a guard keeps
 * its own byte comparison and its own lookups by stored id. A served id whose name the reference does not have stays its
 * canonical name (it matches nothing). THROWS where a stored person id of `reference` is served anywhere (tooth (ii)).
 */
export function unkeyPeople(served, reference) {
  const leaked = storedIdsServed(served, reference);
  if (leaked.length) throw new Error(`a stored person id is served (the re-key did not happen): ${leaked.slice(0, 5).join('; ')}`);
  const twice = notBijective(served);
  if (twice.length) throw new Error(`the re-key is not a bijection within the read: ${twice.slice(0, 5).join('; ')}`);
  const s = canonPeople(served);
  const back = new Map([...canonPeople(reference).names].map(([orig, name]) => [name, orig]));
  for (const [h, k] of sites(s.doc)) if (back.has(h[k])) h[k] = back.get(h[k]);
  return s.doc;
}

/**
 * TOOTH (iv): two cards of the person list (`npcs`) served under one id. Empty wanted. (One person under two ids shows as
 * a canonical name the reference does not have, so the comparison reds on it.)
 */
export function notBijective(served) {
  const seen = new Map();
  const out = [];
  recs(served?.npcs).forEach((n, i) => {
    if (typeof n.id !== 'string' && typeof n.id !== 'number') return; // (B)
    const id = String(n.id);
    if (seen.has(id)) out.push(`npcs[${seen.get(id)}] and npcs[${i}] under ${id}`); else seen.set(id, i);
  });
  return out;
}

/**
 * TOOTH (v): two reads of one town DIFFER in their person ids: the served person ids (cards and references) of `a` that
 * `b` also serves. Empty wanted.
 */
export function readsDiffer(a, b) {
  const idsOf = (d) => { const ids = cardIds(d); return new Set(sites(d).filter(([h, k, kind]) => kind === 'npc' && rekeyed(h[k], kind, ids)).map(([h, k]) => h[k])); };
  const B = idsOf(b);
  const shared = [...idsOf(a)].filter((x) => B.has(x));
  return idsOf(a).size ? shared : ['(the first read serves no person id)'];
}

/**
 * The served marker's person keys (gallery_member_overrides: `$veil`, a name key `npc.<name>` and every other key a
 * person's id) by the canonical names of `doc`'s walk; a key the walk does not name becomes `npc#?<n>` in key order.
 */
export function canonServed(served, doc) {
  if (!isRec(served)) return served;
  const { names } = canonPeople(doc);
  let n = 0;
  const out = {};
  for (const k of Object.keys(served).sort()) {
    const name = k === '$veil' || k.startsWith('npc.') ? k : (names.get(k) ?? `npc#?${n++}`);
    out[name] = served[k];
  }
  return out;
}

/**
 * THE TEETH, executed over a served payload: each mutation of `served` must make `holds(candidate)` false or throw.
 * Returns the teeth that did NOT bite (empty wanted) and the teeth that could not be built on this payload (`absent`,
 * e.g. tooth (i) on a payload with no reference).
 * @param {any} served  a served payload the guard's equality holds on
 * @param {(candidate: any) => boolean} holds  the guard's own equality, re-stated (true where it holds)
 * @param {{ storedId?: string, again?: any }} [opt]  a stored person id of the reference side (tooth (ii)); a second read
 *   of the same town (tooth (v): `holds(again)` must hold and `readsDiffer(served, again)` be empty)
 */
export function bijectionTeeth(served, holds, opt = {}) {
  const missed = [];
  const absent = [];
  const bites = (label, mutate) => {
    const c = clone(served);
    if (mutate(c) === false) { absent.push(label); return; }
    let ok;
    try { ok = holds(c); } catch { ok = false; }
    if (ok) missed.push(label);
  };
  const cardsOf = (c) => sites(c).filter((s) => s[3] === 'card').map(([h, k]) => h[k]);
  const firstRef = (c) => {
    const ids = cardIds(c);
    return sites(c).find(([h, k, kind, phase]) => phase === 'ref' && kind === 'npc' && ids.has(h[k]));
  };
  if (!holds(clone(served))) missed.push('(the equality does not hold on the served payload itself)');
  // (i) a reference moved to another person's key
  bites('(i) a reference moved to another person\'s key', (c) => {
    const r = firstRef(c);
    const other = r && cardsOf(c).find((x) => x !== r[0][r[1]]);
    if (!r || !other) return false;
    r[0][r[1]] = other;
    return true;
  });
  // (i) a reference moved to a key no card holds
  bites('(i) a reference moved to a key no card holds', (c) => {
    const r = firstRef(c);
    if (!r) return false;
    r[0][r[1]] = FOREIGN_KEY;
    return true;
  });
  // (ii) an original (stored) person id served
  bites('(ii) a stored person id served', (c) => {
    const s = sites(c).find((x) => x[3] === 'card');
    if (!s || !opt.storedId) return false;
    s[0][s[1]] = opt.storedId;
    return true;
  });
  // (iv) two stored people served under one id: the second card (and every reference to it) under the first card's id
  bites('(iv) two people served under one id', (c) => {
    const cards = recs(c.npcs).filter((n) => typeof n.id === 'string' || typeof n.id === 'number'); // (B)
    if (cards.length < 2) return false;
    const [a, b] = [cards[0].id, cards[1].id];
    for (const [h, k] of sites(c)) if (h[k] === b) h[k] = a;
    return true;
  });
  // (iv) one person served under two ids: the first referenced card re-spelled, its references left on the old id
  bites('(iv) one person served under two ids', (c) => {
    const r = firstRef(c);
    if (!r) return false;
    const old = r[0][r[1]];
    const card = sites(c).find(([h, k, , phase]) => phase === 'card' && h[k] === old);
    card[0][card[1]] = FOREIGN_KEY;
    return true;
  });
  // (iii) a changed non-id byte: the first card's name (or role), else any other string of the payload
  bites('(iii) a changed non-id byte', (c) => {
    const card = recs(c.npcs).find((n) => typeof n.name === 'string' || typeof n.role === 'string');
    if (card) { const k = typeof card.name === 'string' ? 'name' : 'role'; card[k] = `${card[k]}~`; return true; }
    const ids = new Set(sites(c).map(([h, k]) => h[k]));
    const walk = (v) => {
      if (Array.isArray(v)) { for (let i = 0; i < v.length; i++) { if (typeof v[i] === 'string' && !ids.has(v[i])) { v[i] += '~'; return true; } if (walk(v[i])) return true; } return false; }
      if (isRec(v)) { for (const k of Object.keys(v)) { if (typeof v[k] === 'string' && !ids.has(v[k])) { v[k] += '~'; return true; } if (walk(v[k])) return true; } }
      return false;
    };
    return walk(c);
  });
  // (v) a second read of the same town: its equality holds, and no person id of one read is served by the other
  if (opt.again === undefined) absent.push('(v) two reads of one town differ');
  else {
    let ok;
    try { ok = holds(clone(opt.again)); } catch { ok = false; }
    if (!ok) missed.push('(v) the second read does not hold modulo the bijection');
    const shared = readsDiffer(served, opt.again);
    if (shared.length) missed.push(`(v) two reads share person ids: ${shared.slice(0, 3).join(', ')}`);
  }
  return { missed, absent };
}
