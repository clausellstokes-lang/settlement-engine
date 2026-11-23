/**
 * criminalSwitchSalt.shared.mjs — R4I-PAGE-2 S1 (VEIL-38; the chair's E136 (b), ruled; vetoable by the owner): the one
 * reading of "what the criminal switch offers" that the in-tree arm (criminalSwitchSalt.test.js) and the pool probe
 * (docs/chair/2026-11-20/veil/out/v38/r4ip2/switch-offer.probe.jsx) both compare between the cured tree and the REFERENCE
 * (the tree with galleryVeilPeople.js :: rekeyPeople mocked to the identity: the twin before the re-key).
 *
 * For one record and one Reveal setting it reads the curate screen's own copy (galleryPayloadFor, no veil yet), as
 * CurateMode.jsx does, and returns, as sorted lists: presentCriminalGroupings; and for each DRAFT (none; the gate's own
 * setting, the three criminal groupings and the hooks tab opened by hand; then the switch's own writes from it, hidden and
 * shown) criminalSwitchStateOf, setCriminalVeil(..., true, ...), setCriminalVeil(..., false, ...) and flipCriminalVeil, each
 * under curateModelFor(payload, draft), the model the screen draws for that draft.
 */
const clone = (v) => JSON.parse(JSON.stringify(v));
export const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const opened = (addrs) => addrs.map((address) => ({ address, hidden: false }));
const deltas = (list) => list.map((d) => `${d.address}=${d.hidden ? 'hidden' : 'shown'}`).sort();

/**
 * @param {{ galleryPayloadFor: Function, curateModelFor: Function }} veil  galleryVeil.js
 * @param {{ presentCriminalGroupings: Function, criminalSwitchStateOf: Function, setCriminalVeil: Function, flipCriminalVeil: Function }} sw
 * @param {unknown} record  the stored record
 * @param {boolean} dm  Reveal DM
 * @returns {Record<string, unknown>}
 */
export function switchOffer(veil, sw, record, dm) {
  const pub = veil.galleryPayloadFor(clone(record), { shareDm: dm, memberOverrides: null });
  const present = sw.presentCriminalGroupings(pub);
  const out = { present: [...present].sort() };
  const base = veil.curateModelFor(pub, []);
  const own = opened(OPEN);
  const drafts = {
    none: [],
    own,
    ownHidden: sw.setCriminalVeil(own, base.defaults, true, present, veil.curateModelFor(pub, own)),
    ownShown: sw.setCriminalVeil(own, base.defaults, false, present, veil.curateModelFor(pub, own)),
  };
  for (const [name, draft] of Object.entries(drafts)) {
    const model = veil.curateModelFor(pub, draft);
    const defaults = model.defaults;
    out[name] = {
      draft: deltas(draft),
      state: sw.criminalSwitchStateOf(defaults, draft, present, model),
      hide: deltas(sw.setCriminalVeil(draft, defaults, true, present, model)),
      show: deltas(sw.setCriminalVeil(draft, defaults, false, present, model)),
      flip: deltas(sw.flipCriminalVeil(draft, defaults, present, model)),
    };
  }
  return out;
}

/** The first differing leaf paths of two offers (empty: equal, set for set). */
export function offerDiff(a, b, p = '', out = []) {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) offerDiff(a[k], b[k], p ? `${p}.${k}` : k, out);
  } else out.push(`${p}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`.slice(0, 400));
  return out;
}
