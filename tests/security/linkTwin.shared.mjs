/**
 * linkTwin.shared.mjs — THE LINK TWIN (R4I-PAGE-4, VEIL-38; the chair's ruling (c), 02:38 UTC), a test helper: the client's
 * reference of the party link's read (`get_unlisted_dossier`), so a link read is judged against what the link serves, never
 * against itself, and never against the GALLERY's twin (R4I-PAGE-3 measured why, `out/v38/r4ip3/A-link-anchor-measured.patch`:
 * the gallery twin carries Reveal DM and each member's own revealDm, and serves an unmarked share as before).
 *
 * ITS LAW, read in the migrations' text (grep only):
 *   212_share_veil_later_cures.sql :: get_unlisted_dossier
 *     :3307        `'gallery_share_dm', false,`  the link is never a Reveal-DM read;
 *     :3328-3334   `public._gallery_apply_member_overrides(pub.j, <dm_full>, s.gallery_member_overrides, false,
 *                   s.gallery_importable, false)`  its 4th parameter, `settlement_share_dm`, is false on the link: the
 *                   share's own member overrides are applied as a non-Reveal-DM share applies them; and its `dm_full`
 *                   (:3329-3333) is `pub.j` itself, the PUBLIC projection with the live town's relationships[],
 *                   prominentRelationship and pressureSentence alone (the comment at :3058: "on the party link the projection
 *                   with the live town's relationships[], prominentRelationship and pressureSentence"). A member's
 *                   `revealDm: true` takes its card from `dm_full` (:3111-3116), so ON THE LINK IT REVEALS NOTHING beyond the
 *                   public card: the link's apply does not honour it (measured: the plant's `npc.bo`, `revealDm: true`, has
 *                   its goal's target and its own tie on the gallery twin's card and on no link read);
 *     :3338-3339   `-- 211: the share's veil; an unmarked share takes the default veil (the link's readers are players)`
 *                  `public._gallery_veil(proj.d, s.gallery_member_overrides, true)`  its 3rd parameter is `link`.
 *   211_server_side_share_veil.sql :: _gallery_veil_resolve
 *     :701         `if not marked and not link then return null; end if;`  the one thing `link` changes: an UNMARKED share
 *                  is resolved against the default veil on the link, where the gallery serves it as before;
 *     :739-742     each member key with `revealDm: false` is read as a card delta (`card:npc:<key>`, hidden), marked or
 *                  not, link or not (the client's readShareVeil reads the same keys, on a marked share).
 *
 * THE TWIN (the chair's definition): `applyVeil(pub, resolveVeil(defaultVeilFor(pub), deltas))`, with
 * `pub = galleryPayloadFor(stored, { shareDm: false, memberOverrides: <the share's overrides less each `revealDm: true`> })`
 * (`linkHonoured`: what the link's apply honours, by :3329-3333 above), and `deltas` the share's
 * own (readShareVeil) where it is marked; an UNMARKED share takes the default veil: `deltas = []`, NOT projectShareVeil's
 * unmarked "as before" path.
 */
import { applyVeil, defaultVeilFor, galleryPayloadFor, readShareVeil, resolveVeil } from '../../src/domain/display/galleryVeil.js';

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/** The member overrides the link's apply honours: the share's own, each member's `revealDm: true` dropped (the link's
 *  `dm_full` is the public projection, 212 :3329-3333, so a reveal there reveals nothing); `$veil`, `revealDm: false` and
 *  `allowImport` as they are. A new object. */
export function linkHonoured(overrides) {
  if (!isRec(overrides)) return null;
  const out = {};
  for (const [k, v] of Object.entries(overrides)) {
    if (k === '$veil' || !isRec(v) || v.revealDm !== true) { out[k] = clone(v); continue; }
    const { revealDm, ...rest } = v;
    out[k] = rest;
  }
  return out;
}

/**
 * The link read's twin of a stored record under the share's member overrides (its own salt: compare it modulo the bijection).
 * @param {any} stored  the record as stored @param {any} overrides  the share's gallery_member_overrides
 * @param {{ salt?: string }} [opts]  passed to applyVeil (a test may fix the salt; the link's own read never takes one)
 */
export function linkTwinOf(stored, overrides, opts) {
  const ov = isRec(overrides) ? overrides : null;
  const pub = galleryPayloadFor(clone(stored), { shareDm: false, memberOverrides: linkHonoured(ov) });
  const { marked, deltas } = readShareVeil(ov);
  return applyVeil(pub, resolveVeil(defaultVeilFor(pub), marked ? deltas : []), opts);
}
