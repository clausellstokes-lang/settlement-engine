/**
 * prose-licence-card.mjs — THE LICENCE CARD (ARCH-COMPOSED-PROSE-v2 §8.3), PRINTED FROM THE
 * CENSUS ROW.
 *
 * WHAT IT IS. A writer of a modifier pool is handed one page that says exactly what the pool
 * may claim and what it may not, and every line of it is a MEASUREMENT rather than an
 * instruction: `reads` is the wiring census's recovered reading, `predicate` is the census's
 * recovered predicate, `bag` is the block's own slot palette crossed with §0c's declared
 * shapes, `attach` is the projector's derived set, `source` is SEAM car 5b's holder column,
 * `echo` is the census's mounts-per-fact row. A card whose lines were prose would be one
 * author's opinion of a branch; a card projected from the register moves the day the register
 * moves, and the arm beside it proves that by editing a row and watching the line move.
 *
 * ⛔ WHY A LIB AND NOT THE SCRIPT. `scripts/prose-licence-card.mjs` reads the committed census
 * JSON, the six generated leaves and the annex at import time. A plant that has to re-read
 * 79,000 lines of JSON to watch ONE line of a card move is a plant nobody re-runs, so the card
 * BUILDER is pure and the script is the shell around it — the same split
 * `scripts/lib/dossier-annex-grammar.mjs` already makes for the grammar, and for the same
 * reason.
 *
 * ⛔ ONE LINE ARCH §8.3 DOES NOT CARRY, AND WHY IT IS HERE. `source:` is SITTING §Q's column
 * (the owner's 2026-09-08 "Do it"): a face may cite a record holder only where the census
 * licenses one, and §Q.4 step 2 says in terms that "a cited claim needs a source column". The
 * card is the writer's whole licence, so a claim class the writer may reach for and the card
 * does not mention is a claim nobody refused. It is an ADDITION to §8.3's list and never a
 * change to one of its lines; the receipt records it for veto.
 *
 * PURE. No I/O, no clock, no RNG. Every input is handed in.
 *
 * @enforced-by tests/lint/proseLicenceCard.walker.test.js
 */

/** The card's line labels, in ARCH §8.3's order, with `source` appended (see the header). */
export const CARD_LINES = Object.freeze([
  'reads', 'predicate', 'bag', 'relation', 'seat/form', 'attach', 'echo', 'covert', 'source',
  'may claim', 'may NOT', 'audience',
]);

/**
 * THE COLUMNS NO POOL MAY EVER CARRY (ARCH §8.3's last line, verbatim in substance). They are
 * printed on every card rather than only on the pools that might reach for them, because a
 * refusal a writer meets once is a refusal a writer remembers.
 */
export const REFUSED_COLUMNS = Object.freeze([
  'a totality over persons',
  'an exemption from a duty (whoIsExempt is null everywhere)',
  'a named character and that character\'s fate (product scope)',
  'a theological claim about a deity (the deity doctrine)',
]);

/**
 * THE CLAIM CLASSES A MODIFIER MAY NOT REACH FOR, whatever its field. ARCH §8.3's worked card
 * names five for `stores: short`; four of them are properties of the MOVE vocabulary rather
 * than of that pool (`ABSENCE` and `HISTORY` are struck outright, §2.5), so they are the
 * standing list and the pool's own additions are computed beside them.
 */
export const REFUSED_CLAIMS = Object.freeze([
  'a count', 'a cause', 'a season', 'a future', 'a standpoint', 'a second fact',
]);

/** @param {unknown} value @returns {string} */
const text = (value) => (value === null || value === undefined ? '' : String(value));

/**
 * The producer-token ROOT of a read path, spelled as `wiringCensus.rootOf` spells it. It is
 * re-spelled rather than imported because this lib is PURE and takes no estate dependency; the
 * walker asserts the two agree on every taste pool.
 * @param {string} field @returns {string}
 */
export function rootOfPath(field) {
  const parts = String(field).split('.');
  if ((parts[0] === 'readings' || parts[0] === 'settlement') && parts.length > 1) return `${parts[0]}.${parts[1]}`;
  return parts[0];
}

/**
 * WHY THE PREDICATE LINE IS EMPTY, WHEN IT IS. A SPINE's predicate is recovered from its key
 * function; a MODIFIER has none to recover, because its predicate is the candidate function in
 * its desk's leaf and the census records the READING rather than the test (the `annex` rung).
 * Saying "none recovered" on a modifier would read as a gap where it is a grain.
 * @param {string} role
 * @param {{reason?: string, rung?: string}|null|undefined} row
 * @param {string} [candidateLeaf]
 * @returns {string}
 */
export function predicateAbsence(role, row, candidateLeaf) {
  if (role === 'modifier') {
    return `authored in ${candidateLeaf || 'the desk\'s *StateProseCandidates.js leaf'} and NOT`
      + ' recovered here: a modifier has no key-function branch, so the census records its'
      + ' READING (the `annex` rung) and the leaf holds the test';
  }
  return `(none recovered: ${row?.reason || 'the pool has no key-function branch'})`;
}

/**
 * HOW THE ATTACH SET WAS ARRIVED AT — derived, or narrowed by hand in the annex. A writer told
 * "derived" about a hand-narrowed set is being told the block's shape decided something an
 * author decided.
 * @param {string} role
 * @param {ReadonlyArray<string>|null|undefined} declaredAttach the annex's ATTACH tokens, or
 *   null where the line reads `derived`
 * @returns {string}
 */
export function attachDerivation(role, declaredAttach) {
  if (role !== 'modifier') return 'n/a';
  if (Array.isArray(declaredAttach)) {
    return `NARROWED BY HAND in the annex: the ATTACH line names ${declaredAttach.length} key(s)`
      + ' and the derivation is not consulted';
  }
  return 'DERIVED: every RESOLVED spine of this block whose selecting branch does NOT test this'
    + ' pool\'s field (ARCH §2.5, E-F1); no cap, because the echo bound is per fact';
}

/**
 * One predicate row as the census records it, rendered as the writer reads it.
 * @param {{field: string, op: string, value: unknown}} row
 * @returns {string}
 */
export function predicateText(row) {
  const value = text(row.value);
  return `${row.field} ${row.op} ${value === '' ? '(empty)' : value}`;
}

/**
 * The BAG line: every slot the block declares, with the SHAPE §0c gives it. A slot the shape
 * register does not declare prints `?` rather than a guess — the projector refuses to run in
 * that state, so the `?` can only be seen by a caller who handed in a partial register.
 * @param {ReadonlyArray<string>} slots
 * @param {(slot: string) => string|undefined} shapeOf
 * @returns {string}
 */
export function bagText(slots, shapeOf) {
  const rows = [...new Set(slots || [])].sort()
    .map((slot) => `${slot}: ${shapeOf(slot) || '?'}`);
  return rows.length ? `{${rows.join(', ')}}` : '{} (the block fills no slot)';
}

/**
 * THE `reads` LINE, with the census's own `absent` kind per path. `absent` is the column that
 * says whether a path was MEASURED on a real town, read as a DEFAULT, never produced at all,
 * or reached through a method call — the difference between "no candidate" and "a candidate
 * built on a value nobody writes".
 * @param {{reads?: ReadonlyArray<string>, absent?: Record<string, string>}} row
 * @returns {string[]}
 */
export function readsLines(row) {
  const reads = row?.reads || [];
  if (reads.length === 0) return ['(the census recovered no reading for this pool)'];
  return reads.map((path) => {
    const kind = row?.absent?.[path];
    return `${path}${kind ? `   (${kind})` : ''}`;
  });
}

/**
 * WHY THE RELATION IS WHAT IT IS. `addition` is the claim-free floor and needs no licence;
 * `consequence` and `tension` each need a relation-table row, so the card says which row (or
 * says that none exists, which is the shipped state at this tip — car 0's F1).
 * @param {object} input
 * @param {string} input.relation
 * @param {ReadonlyArray<string>} input.seatRows the relation row ids the seat licence used
 * @param {string} input.seatReason
 * @returns {string}
 */
export function relationWhy({ relation, seatRows, seatReason }) {
  if (!relation) {
    return 'a spine IS the seat and carries no relation; the relation is the MODIFIER\'s'
      + ' property, fixed at its freeze (ARCH §4.5)';
  }
  if (relation === 'addition') {
    return 'no relation-table row joins this field to the spine\'s primary field, and'
      + ' addition is the claim-free floor (ARCH §4.5)';
  }
  if (seatRows && seatRows.length) return `licensed by ${seatRows.join(' · ')}`;
  return `no licensing row (${seatReason || 'no-row'})`;
}

/**
 * THE ECHO LINE. The echo bound (ARCH §4.6, T-F10) is per FACT and per PAGE-SET: one producer
 * fact backs a modifier at at most one mount, and at NO mount on a tab where that fact spines.
 * The census's `mountsPerFact` row is exactly that reading, so the card prints the row rather
 * than a sentence about it.
 * @param {{field: string, mountsSpine: number, mountsModifier: number,
 *   spineTabs?: ReadonlyArray<string>, modifierMounts?: ReadonlyArray<string>}|null} factRow
 * @param {string} field
 * @returns {string}
 */
export function echoText(factRow, field) {
  if (!factRow) {
    return `\`${field || '(no field)'}\` is not in the census's fact index: the echo bound is`
      + ' NOT-EXECUTABLE on it, and the attach set is the only guard';
  }
  const spineTabs = (factRow.spineTabs || []).join(', ') || 'none';
  const mods = (factRow.modifierMounts || []).join(', ') || 'none';
  return `spine mounts ${factRow.mountsSpine} (tabs: ${spineTabs}) · modifier mounts`
    + ` ${factRow.mountsModifier} (${mods})`;
}

/**
 * WHAT THIS POOL MAY CLAIM, built from its own reading and predicate and from nothing else.
 * @param {object} input
 * @param {ReadonlyArray<string>} input.reads
 * @param {ReadonlyArray<{field: string, op: string, value: unknown}>} input.predicate
 * @returns {string}
 */
export function mayClaimText({ reads, predicate }) {
  // THE PREDICATE'S OWN FIELD FIRST. A pool's `reads` is the whole selecting branch and its
  // FIRST entry is only the primary field; the claim a variant is licensed to make is about
  // the field the predicate discriminates on, which on a multi-field spine is a different
  // one (DS-DEF-11 WALLED-STRAINED reads the wall first and discriminates on the pay gate).
  const field = (predicate || [])[0]?.field || (reads || [])[0] || '';
  if (!field) return 'nothing: the census recovered no reading, so no claim is licensed';
  const leaf = field.split('.').slice(-1)[0];
  const values = (predicate || []).map((p) => `${p.op} ${text(p.value)}`).filter((v) => v.trim());
  const said = values.length ? ` (${values.join(' AND ')})` : '';
  return `that \`${leaf}\`${said} holds, as a STANDING fact of the record`;
}

/**
 * WHAT THIS POOL MAY NOT CLAIM: the standing list, plus every field its own attach spines
 * evaluate — the fields the SPINE owns, which a modifier restating them would echo (§4.6).
 * @param {object} input
 * @param {ReadonlyArray<string>} input.spineFields
 * @param {string|null} input.objectClass
 * @returns {string}
 */
export function mayNotText({ spineFields, objectClass }) {
  const rows = [...REFUSED_CLAIMS];
  if (objectClass) rows.push(`another civic object of the class \`${objectClass}\``);
  const fields = [...new Set(spineFields || [])].sort();
  if (fields.length) rows.push(`any field the attached spine tests (${fields.join(' · ')})`);
  return rows.join(', ');
}

/**
 * THE SOURCE LINE (SITTING §Q; SEAM car 5b's holder column, 5c's state-organ flag).
 * @param {{kind?: string, standing?: string, twoSource?: boolean, stateOrgan?: boolean,
 *   fields?: Record<string, string>}|null|undefined} source
 * @returns {string}
 */
export function sourceText(source) {
  if (!source) return 'SOURCE-UNRESOLVED (the census row carries no source column)';
  const kind = source.kind || '(none)';
  const standing = source.standing || 'SOURCE-UNRESOLVED';
  const organ = source.stateOrgan ? ' · a STATE ORGAN (interested where the town is captured)' : '';
  const two = source.twoSource ? ' · two-source row' : '';
  const cite = standing === 'LICENSED'
    ? 'a citation of this holder is licensed where the provenance budget allows'
    : 'NO citation is licensed: a face naming a record holder here is refused by arm A13';
  return `${kind} · standing ${standing}${two}${organ}\n              ${cite}`;
}

/**
 * ⭐ THE CARD, as lines. Every line is computed from the inputs; nothing is remembered between
 * calls and nothing is read from disk.
 *
 * @param {object} input
 * @param {string} input.blockId
 * @param {string} input.poolKey
 * @param {object|null} input.row the census row for this (block, pool), or null
 * @param {object} input.poolMeta the projected `poolMeta` entry, or `{}`
 * @param {ReadonlyArray<string>} input.blockSlots the block's declared slot palette
 * @param {(slot: string) => string|undefined} input.shapeOf §0c's shape register
 * @param {ReadonlyArray<{angle: string, marks?: ReadonlyArray<string>}>} input.variants
 * @param {object|null} input.factRow the census's `mountsPerFact` row for this pool's field
 * @param {ReadonlyArray<object>} input.spineRows the census rows of this pool's attach spines
 * @param {boolean} [input.covertPath] whether the pool's own field is on the covert list
 * @param {ReadonlyArray<string>|null} [input.declaredAttach] the annex's ATTACH tokens, or null
 *   where the line reads `derived`
 * @param {string} [input.candidateLeaf] the desk leaf a modifier's predicate is authored in
 * @returns {string[]}
 */
export function licenceCardLines(input) {
  const {
    blockId, poolKey, row, poolMeta, blockSlots, shapeOf, variants, factRow, spineRows,
  } = input;
  const meta = poolMeta || {};
  const role = meta.role || 'spine';
  const relation = meta.relation || (role === 'modifier' ? 'addition' : '');
  const seat = meta.seat || (role === 'modifier' ? 'sentence' : '(not a seat-taker)');
  const form = meta.form || (relation === 'consequence' ? 'fragment' : 'sentence');
  const move = meta.move || '(none declared)';
  const angles = [...new Set((variants || []).map((v) => v.angle).filter(Boolean))].sort();
  const marks = [...new Set((variants || []).flatMap((v) => v.marks || []))].sort();
  const covert = Boolean(row?.covert) || Boolean(input.covertPath);
  const attach = meta.attach || [];
  const field = (row?.reads || [])[0] || '';
  const spineFields = (spineRows || []).flatMap((r) => r?.reads || []);
  const unmarked = (variants || []).filter((v) => !(v.marks || []).includes('dm-only')).length;

  /** @type {string[]} */
  const lines = [];
  lines.push(`LICENCE (block ${blockId} · role ${role} · key \`${poolKey}\`)`);
  const reads = readsLines(row || {});
  lines.push(`  reads:      ${reads[0]}`);
  for (const extra of reads.slice(1)) lines.push(`              ${extra}`);
  lines.push(`              (absent ⇒ no candidate; a modifier is silent, never "false")`);
  const predicate = (row?.predicate || []).map(predicateText);
  lines.push(`  predicate:  ${predicate.length ? predicate.join('  AND  ') : predicateAbsence(role, row, input.candidateLeaf)}`);
  lines.push(`  bag:        ${bagText(blockSlots, shapeOf)}`);
  // ⛔ THE DECLARED PALETTE IS NOT THE OFFERED ONE, and a face naming a slot the call site
  // never fills renders a literal `{route}` on a page. The census's `slotsFilled` is what the
  // composer's bag actually offers at this block's call sites; arm D gates it, and the writer
  // is told before the gate rather than by it.
  lines.push(`              FILLED at this block's call sites: ${(row?.slotsFilled || []).length
    ? (row.slotsFilled).map((s) => `{${s}}`).join(' ')
    : '(none: the composer offers this block no bag)'}`
    + `${(row?.slotsWithoutProvider || []).length
      ? ` · NAMED BUT NEVER FILLED: ${row.slotsWithoutProvider.map((s) => `{${s}}`).join(' ')}` : ''}`);
  lines.push(`  relation:   ${relation || '(a spine takes no relation)'}   ← ${relationWhy({
    relation, seatRows: meta.seatRow || [], seatReason: meta.seatReason || '',
  })}`);
  lines.push(`  seat/form:  ${seat} / ${form}      move: ${move}     angle: ${angles.join(' ') || '(none)'}`);
  lines.push(`  attach:     ${attach.length ? attach.map((k) => `\`${k}\``).join(' ') : '(empty: a spine takes no attach set)'}`);
  lines.push(`              ${attachDerivation(role, input.declaredAttach)}`);
  lines.push(`  echo:       ${echoText(factRow, field)}`);
  lines.push(`              the echo table is keyed on the PRODUCER-TOKEN ROOT`
    + `${field ? ` \`${rootOfPath(field)}\`` : ''}, which is coarser than this pool's own read`
    + `${field ? ` \`${field}\`` : ''}: a mount counted there may be reading a sibling field of the same root`);
  lines.push(`  covert:     ${covert ? `YES — every variant carries \`dm-only\` (T-F5); unmarked variants: ${unmarked}` : 'no'}`);
  lines.push(`  source:     ${sourceText(row?.source)}`);
  lines.push(`  may claim:  ${mayClaimText({ reads: row?.reads || [], predicate: row?.predicate || [] })}`);
  lines.push(`  may NOT:    ${mayNotText({ spineFields, objectClass: row?.objectClass || null })}`);
  lines.push(`  audience:   ${covert ? 'DM only (`dm-only` on every variant)' : `player (no mark)${marks.length ? ` · marks in this pool: ${marks.join(' ')}` : ''}`}`);
  lines.push(`  REFUSED COLUMNS, always: ${REFUSED_COLUMNS.join('; ')}`);
  return lines;
}
