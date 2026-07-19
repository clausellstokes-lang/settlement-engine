/**
 * data/roadsProse.js — THE ROADS chronicle prose pools (ENGINE LIFT #5; DESIGN_THE_ROADS.md
 * §12/§14). A LAZY data leaf (the CONTENT-GT max-lines ratchet rule): pure frozen variant
 * pools, imported only by eventProse.js (which flattens them into EVENT_PROSE_REGISTRY, so
 * the register / canonical-at-zero / reachability guards cover roads for free) and by the
 * lazy roads kernel (which selects via eventProse's pickLine/fnv1a32).
 *
 * THE LAWS (the eventProse constitution, tests/domain/eventProse.test.js +
 * tests/domain/roadsProse.test.js):
 *  1. CANONICAL-AT-ZERO: every pool's index-0 entry is the canonical phrasing; a falsy seed
 *     selects it.
 *  2. FRAMING-NOT-SEMANTICS: variants vary PHRASING only; the interpolated names/purpose are
 *     the world's own, threaded through unchanged.
 *  3. PORTABLE SPECIFICITY: catalog-anchored generics only, never a canon proper noun (the
 *     {npc}/{home}/{dest}/{captor} tokens ARE the world's names).
 *  4. NO CALAMITY SUBSTRINGS (the F24 scan, extended to roads.* in roadsProse.test.js): no
 *     flood/fire/quake/earthquake/storm — travel/capture prose speaks its own vocabulary.
 *
 * Pure leaf: imports nothing. Interpolation tokens: {npc} {home} {dest} {captor} {purpose}.
 */

/** @typedef {import('../domain/worldPulse/eventProse.js').ProseVariant} ProseVariant */

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const ROADS_NEWS = Object.freeze({
  // ── DEPARTURE (quiet; NOTABLE for a pillar or a tradition-critical journey) ──
  departure: {
    headline: [
      (x) => `${x.npc} sets out from ${x.home} for ${x.dest}`, // canonical
      (x) => `${x.npc} takes the road from ${x.home} to ${x.dest}`,
      (x) => `${x.npc} rides out of ${x.home}, bound for ${x.dest}`,
      (x) => `${x.npc} departs ${x.home} on the ${x.dest} road`,
    ],
    summary: [
      (x) => `${x.npc} has left ${x.home} for ${x.dest} on ${x.purpose} business — a journey of the middle ranks.`, // canonical
      (x) => `${x.npc} has taken the ${x.dest} road out of ${x.home}, sent on ${x.purpose} business.`,
      (x) => `An envoy of ${x.home}, ${x.npc}, is abroad toward ${x.dest} on ${x.purpose} business.`,
      (x) => `${x.npc} of ${x.home} is on the road to ${x.dest}, carrying ${x.purpose} business.`,
    ],
  },
  // ── RETURN (NOTABLE — the traveller comes home) ──
  return: {
    headline: [
      (x) => `${x.npc} returns to ${x.home}`, // canonical
      (x) => `${x.npc} comes home to ${x.home}`,
      (x) => `${x.npc} is back within the walls of ${x.home}`,
      (x) => `${x.npc} rides home to ${x.home}`,
    ],
    summary: [
      (x) => `${x.npc} has come home to ${x.home}, the ${x.dest} journey behind them.`, // canonical
      (x) => `${x.npc} is returned to ${x.home} from ${x.dest}, the errand done.`,
      (x) => `The road from ${x.dest} is behind ${x.npc}, who is safely back in ${x.home}.`,
      (x) => `${x.npc} has ridden back into ${x.home} from ${x.dest}.`,
    ],
  },
  // ── CAPTURE (MAJOR — names the road and the captor, §9) ──
  capture: {
    headline: [
      (x) => `${x.npc} of ${x.home} is taken on the ${x.dest} road`, // canonical
      (x) => `${x.npc} is seized by ${x.captor} on the road`,
      (x) => `${x.captor} holds ${x.npc} of ${x.home}`,
      (x) => `${x.npc} is captured making for ${x.dest}`,
    ],
    summary: [
      (x) => `${x.npc}, an envoy of ${x.home} bound for ${x.dest}, has fallen into the hands of ${x.captor} — a ransom will be raised.`, // canonical
      (x) => `On the road to ${x.dest}, ${x.npc} of ${x.home} was taken by ${x.captor}; ${x.home} must ransom them home.`,
      (x) => `${x.captor} has seized ${x.npc} of ${x.home} en route to ${x.dest}; the price of return is being reckoned.`,
      (x) => `${x.npc} of ${x.home} is a captive of ${x.captor}, taken on the ${x.dest} road.`,
    ],
  },
  // ── EXPULSION (NOTABLE — turned back at the gates) ──
  expulsion: {
    headline: [
      (x) => `${x.captor} turns ${x.npc} away at the gates`, // canonical
      (x) => `${x.npc} of ${x.home} is refused entry to ${x.dest}`,
      (x) => `${x.captor} sends ${x.npc} back to ${x.home}`,
      (x) => `${x.npc} is barred from ${x.dest}`,
    ],
    summary: [
      (x) => `${x.captor} would not receive ${x.npc} of ${x.home}; the envoy is turned back on the ${x.dest} road, the errand failed.`, // canonical
      (x) => `Denied at the gates of ${x.dest}, ${x.npc} of ${x.home} rides home with nothing to show.`,
      (x) => `${x.captor} refused ${x.npc} of ${x.home} entry; the mission to ${x.dest} is broken off.`,
      (x) => `${x.npc} of ${x.home} was turned away from ${x.dest} and sent back the way they came.`,
    ],
  },
  // ── ROBBED (texture — journey continues) ──
  robbed: {
    headline: [
      (x) => `${x.npc} is set upon on the ${x.dest} road`, // canonical
      (x) => `Brigands waylay ${x.npc} near ${x.dest}`,
      (x) => `${x.npc} loses baggage on the road to ${x.dest}`,
      (x) => `${x.npc} is harried on the ${x.dest} road`,
    ],
    summary: [
      (x) => `${x.npc} of ${x.home} was set upon on the embattled road to ${x.dest} but pressed on, lighter of purse.`, // canonical
      (x) => `The road to ${x.dest} used ${x.npc} of ${x.home} roughly, though the journey goes on.`,
      (x) => `${x.npc} of ${x.home} came through the ${x.dest} road robbed but unbowed.`,
      (x) => `Waylaid short of ${x.dest}, ${x.npc} of ${x.home} lost baggage but not the road.`,
    ],
  },
  // ── DELAYED (texture — an army on the road holds them a week) ──
  delayed: {
    headline: [
      (x) => `${x.npc} is held up on the ${x.dest} road`, // canonical
      (x) => `${x.npc} loses a week making for ${x.dest}`,
      (x) => `An army on the road delays ${x.npc}`,
      (x) => `${x.npc} is slowed on the ${x.dest} road`,
    ],
    summary: [
      (x) => `A column on the ${x.dest} road forced ${x.npc} of ${x.home} to wait it out — a week lost, no more.`, // canonical
      (x) => `${x.npc} of ${x.home} lost a week to a marching army on the ${x.dest} road.`,
      (x) => `Held off the ${x.dest} road by soldiers, ${x.npc} of ${x.home} was delayed a week.`,
      (x) => `${x.npc} of ${x.home} waited out a passing army and lost a week to ${x.dest}.`,
    ],
  },
  // ── RANSOM PAID / RELEASE (NOTABLE — the captive is bought home) ──
  ransom: {
    headline: [
      (x) => `${x.home} ransoms ${x.npc} home from ${x.captor}`, // canonical
      (x) => `${x.npc} is freed from ${x.captor}`,
      (x) => `${x.captor} releases ${x.npc} to ${x.home}`,
      (x) => `${x.npc} is bought back from ${x.captor}`,
    ],
    summary: [
      (x) => `The price is paid: ${x.captor} has released ${x.npc}, who now rides home to ${x.home}.`, // canonical
      (x) => `${x.home} has ransomed ${x.npc} out of ${x.captor}'s hands; the road home lies open.`,
      (x) => `${x.npc} is free of ${x.captor} at last, and turns for ${x.home}.`,
      (x) => `With the ransom settled, ${x.captor} lets ${x.npc} go home to ${x.home}.`,
    ],
  },
  // ── TRAPPED / WAIT (texture — the siege or the hostile roads keep them abroad) ──
  trapped: {
    headline: [
      (x) => `${x.npc} is caught in ${x.dest} under siege`, // canonical
      (x) => `${x.npc} cannot leave ${x.dest}`,
      (x) => `${x.npc} waits out the ${x.dest} siege`,
      (x) => `${x.npc} is shut inside ${x.dest}`,
    ],
    summary: [
      (x) => `With ${x.dest} beset, ${x.npc} of ${x.home} cannot take the road home until the lines lift.`, // canonical
      (x) => `${x.npc} of ${x.home} is trapped in ${x.dest} for as long as the siege holds.`,
      (x) => `The siege of ${x.dest} keeps ${x.npc} of ${x.home} abroad, waiting for the road to open.`,
      (x) => `${x.npc} of ${x.home} must wait in ${x.dest} while the siege lasts.`,
    ],
  },
});
