/**
 * src/kernel/slugify.js — the ONE slugify primitive (code-quality-5).
 *
 * slugify existed in 8 hand-rolled variants, several of them IDENTITY-BEARING —
 * they mint or match PERSISTED ids (institution id-joins, npc ids inside the
 * seeded event pipeline, custom-content prebuilt refIds, dossier anchors, goods
 * refIds). The variants differ deliberately by namespace convention (dash for
 * foundry/dossier ids, underscore for engine ids) and by cap / empty-fallback, and
 * two copies (events/batch.js + events/mutateHelpers.js) were byte-identical
 * accidents. Cross-module id join-compatibility was maintained ONLY by copy-
 * discipline: nothing but convention stopped a future edit to one copy from
 * silently changing a join key — the exact aliasing class institutionalCatalog's
 * own collision-check warns about.
 *
 * This primitive is PARAMETRIZED so each call site keeps its intentional
 * separator / cap / fallback while sharing one implementation. It is a pure
 * function of (value, opts) — same host-free determinism contract as the rest of
 * the kernel — so a migrated site produces BYTE-IDENTICAL ids (proven per site in
 * tests/kernel/slugify.parity.test.js). Do NOT "unify" the separators or caps:
 * changing a site's params changes its persisted ids.
 *
 * @param {unknown} value
 * @param {{
 *   sep?: string,
 *   max?: number,
 *   fallback?: string,
 *   empty?: string,
 *   raw?: boolean,
 *   asciiLower?: boolean,
 * }} [opts]
 *   - sep:      the separator that replaces runs of non-alphanumerics (default '-')
 *   - max:      cap the slug to this many chars (0 = no cap; applied AFTER edge-trim)
 *   - fallback: returned when the slug is empty after processing (default '')
 *   - empty:    what a FALSY `value` coerces to before slugifying, i.e.
 *               String(value || empty) (default '' — matches the String(x||'') sites)
 *   - raw:      when true, coerce with String(value) directly (no `|| empty`) —
 *               matches slugifyInstitutionName's String(name)
 *   - asciiLower: lower only ASCII A-Z before stripping. Use for identities
 *                 that must match PostgreSQL byte-for-byte without depending
 *                 on JavaScript/Unicode case-table behavior.
 * @returns {string}
 */
export function slugify(
  value,
  {
    sep = '-',
    max = 0,
    fallback = '',
    empty = '',
    raw = false,
    asciiLower = false,
  } = {},
) {
  const base = raw ? String(value) : String(value || empty);
  const escSep = sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const normalizedCase = asciiLower
    ? base.replace(/[A-Z]/g, character => (
        String.fromCharCode(character.charCodeAt(0) + 32)
      ))
    : base.toLowerCase();
  let out = normalizedCase
    .replace(/[^a-z0-9]+/g, sep)
    .replace(new RegExp(`^${escSep}+|${escSep}+$`, 'g'), '');
  if (max > 0) out = out.slice(0, max);
  return out || fallback;
}
