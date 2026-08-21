/**
 * domain/townMap/fabric/publication.js — ⭐⭐⭐ MF-D1 · §297.4b · **THE RAW-HANDLE PUBLICATION
 * GUARD, EXTENDED PAST THE WALL.**
 *
 * ODQ §297.4b: *"J-ARCH-6 RATIFIED on the measured aliasing; its coverage is ~1/5 of the measured
 * raw-handle exposure — the publication-guard sweep over water (58 reads), parcels (46) and
 * streets (19) is ORDERED into the D1 foundations."*
 *
 * ⭐⭐ THE PATTERN, AND WHY IT IS A PUBLICATION GUARD AND NOT A SCAN. `wallCircuit.js` states the
 * class: *"A SCAN OVER READ SITES MUST SOLVE ALIASING; A GUARD AT THE PUBLICATION POINT DOES NOT
 * HAVE TO."* The fabric travels under `fabric`, `f`, `dp`, `P`, `a`, `ctx`, `closing`, so a token
 * scan for `.water` convicts a palette and a model frame alongside the real thing — MF-ARCH
 * measured an alias-aware scan finding only 6 of the files that hold one. There is exactly ONE
 * place each surface is published and unboundedly many places it is read, so the guard belongs at
 * the one.
 *
 * ⛔⛔ AND THE ORDERED FIGURES ARE STALE — MEASURED, NOT ARGUED (`laneMFD1-rawscan.log`). Two
 * predicates, reported separately because they are TWO CENSUSES (LAW L4):
 *
 *      surface     ordered   token ceiling NOW   TRUE fabric reads
 *      water         58            65                  11
 *      parcels       46            41                  14
 *      streets       19            10                   3
 *
 * The ordered numbers are a per-line token count that convicts `P.water` (a palette),
 * `model.frame.water` and `closing.water` (a census result) alongside `fabric.water`. Sweeping to
 * them would be fitting the cure to a measurement nobody re-ran — the exact move §301.2 refused
 * when it declined to fit the offset kernel to §278's five-leaf forecast.
 *
 * ⚠ STREETS ARE DECLINED, WITH THE REASON AS A NUMBER. Of `channels`' three true reads, TWO are
 * `accessLaw.js:109,277` — and `accessLaw`'s `fabric` parameter is NOT the published fabric. It
 * is `leafCensus.js:63`'s synthetic `const accessFabric = { channels, web: fabricWeb, walls };`,
 * built from PRE-PUBLICATION values. **No publication guard can reach them.** Guarding a
 * 1,000-element array to cover the one remaining read is a worse trade than saying so.
 *
 * ⭐ THE GUARD RETURNS THE CALLER'S OWN OBJECT, BY IDENTITY. `guardSimpleRing` earned this rule
 * the hard way at MF-D0 and the same reasoning holds here: two landed counterfactuals
 * (`townMapFabricBuildOut.test.js`) PUSH onto `f.parcels` to prove the overlap and in-street
 * censuses are non-vacuous. A guard that returned a copy, or a frozen array, or re-verified on
 * every read would break both — and breaking a counterfactual is how a whole census goes vacuous
 * without anything reding.
 *
 * PURITY: pure. The hash is `wallCircuit.contentHash`, the fabric's own; the serializers use
 * `fabricGeometry`'s one topology quantum and never a private spelling.
 */

import { q6, topoText } from './fabricGeometry.js';
import { contentHash } from './wallCircuit.js';

/** Verified-once, per published value — the `wallCircuit` idiom, one surface out. */
const VERIFIED = new WeakSet();

/** The water relation's identity: its mode, kind, width, bank side, centreline and body. */
export function waterText(r) {
  if (!r) return '∅';
  return [r.mode, r.kind, q6(r.width || 0), String(r.bankSide),
    topoText(r.line || []), topoText(r.body || [])].join('#');
}

/**
 * A parcel's identity. ⚠ THE BACK HOUSE IS IN IT DELIBERATELY: MF-W2's fingerprint lesson is
 * that a fingerprint omitting a drawn family cannot see a change confined to that family, and
 * the back house is a drawn family.
 */
export function parcelsText(ps) {
  return (ps || []).map((p) => `${p.key}#${p.character}#${topoText(p.polygon || [])}`
    + `#${topoText(p.backHouse || [])}`).join('\n');
}

/**
 * ⭐⭐⭐ PUBLISH A GOVERNED SURFACE. Stamp its canonical text at publication; re-derive and
 * compare on FIRST read; memoize. A consumer that mutated the array between the two throws with
 * both hashes named, exactly as the circuit's accessor does.
 *
 * @param {any} value the surface itself — returned by IDENTITY, never copied
 * @param {(v:any)=>string} text its canonical serializer
 * @param {string} name for the message
 */
export function governSurface(value, text, name) {
  const stamp = contentHash(text(value));
  return {
    stamp,
    read() {
      if (!VERIFIED.has(this)) {
        const live = contentHash(text(value));
        if (live !== stamp) {
          throw new Error(`fabric.${name}: STALE OR MUTATED SURFACE — published ${stamp}, `
            + `recomputed ${live}`);
        }
        VERIFIED.add(this);
      }
      return value;
    },
  };
}

/**
 * The two surfaces this lane governs, stamped together so the assembly gains ONE binding rather
 * than three. `channels` is deliberately absent — see the module docstring's decline.
 */
export function governFabricSurfaces({ water, parcels }) {
  return {
    water: governSurface(water, waterText, 'water'),
    parcels: governSurface(parcels, parcelsText, 'parcels'),
  };
}
