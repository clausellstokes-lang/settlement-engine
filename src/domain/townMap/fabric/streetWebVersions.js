/**
 * domain/townMap/fabric/streetWebVersions.js — ⭐⭐⭐ ⟦SW-1b⟧ **THE STREET WEB'S VERSION
 * DECLARATION** (ODQ §303.4, §293.7; the SW-1 law written at `laneMFD1-receipt.md` §8.4).
 *
 * ⭐⭐⭐ SW-1's SECOND SENTENCE IS THE ONE THIS FILE EXISTS FOR: *"Every registered dependent fact
 * names the version it reads, and any fact published as a GRADE must derive from the FINAL
 * version."* Naming is only enforceable if the versions have names, so here they are — and
 * `tests/lint/streetWebVersion.walker.test.js` re-derives every consumer from PARSED SOURCE and
 * refuses a spelling this file does not know.
 *
 * ⛔⛔ WHAT IT COST NOT TO HAVE THIS, MEASURED AT MF-D1 AND RE-MEASURED HERE. The connectivity
 * grade was computed over `channels.channels` — the set that existed BEFORE there was a circuit
 * — and published beside `streetsWalled`, the set that includes the circuit's wall lanes and the
 * demotion's ring streets. **11 of 17 leaves published a component count, dead-end count and
 * connected share that were true of a set the reader never sees.** Nothing could red: both
 * bindings are arrays of channels, both are non-empty, both are plausible.
 *
 * ⚠⚠ AND THE DEFECT IS INVISIBLE TO A TYPE SYSTEM BY CONSTRUCTION. Two versions of one artifact
 * have the SAME SHAPE — that is what makes them versions — so no signature, no `@typedef` and no
 * `tsc` run can tell a consumer it was handed the wrong one. The only thing that can is a
 * declared roster plus a walker over the call sites, which is what this pair is.
 *
 * ⭐ THE VERSIONS ARE ORDERED, AND THE ORDER IS THE DERIVATION'S. A consumer may always read an
 * EARLIER version than the last — a stage cannot read a version that does not exist yet — but
 * the roster below records WHICH, so a reader can see it and a later wave cannot quietly widen
 * it. `NON_FINAL_CONSUMERS` is an inventory ratchet in the §270 shape: totality over the
 * derivation's own vocabulary, frozen with a written reason apiece.
 *
 * PURITY: a declaration. No imports, no behaviour, and nothing in the generation path reads it —
 * it is assigned to the `FOUNDATIONS` manifest node for exactly that reason.
 */

/**
 * ⭐⭐ THE CHANNEL SET'S VERSIONS, in derivation order. `rank` is the order; `binding` is the
 * literal spelling the walker matches in `buildFabric.js`.
 */
export const CHANNEL_VERSIONS = Object.freeze([
  Object.freeze({
    rank: 1,
    binding: 'channels.channels',
    name: 'PRE-CIRCUIT',
    what: 'the channel set as `buildStreetChannels` cut and contained it, before any circuit '
      + 'exists — the version named in `buildFabric`\'s own comment as "the set that existed '
      + 'BEFORE there was a circuit"',
  }),
  Object.freeze({
    rank: 2,
    binding: 'streetsWalled',
    name: 'FINAL',
    what: 'the published set: the pre-circuit channels plus §239.2\'s wall lanes plus §250.5\'s '
      + 'demoted ring streets. This is `fabric.channels`, and every GRADE must derive from it',
  }),
]);

/**
 * ⭐⭐ THE STREET WEB'S VERSIONS. The web carries the squares, so a square consumer names a web
 * version by naming the object it reads them off.
 */
export const WEB_VERSIONS = Object.freeze([
  Object.freeze({
    rank: 1,
    binding: 'web',
    name: 'ESTIMATED',
    what: 'the web as `buildStreetWeb` laid it out, on the packer\'s ESTIMATED widths. '
      + '`buildFabric`\'s own line says it: "FROM HERE DOWN THE WEB IS THE CALIBRATED ONE. '
      + 'Nothing below may read the estimate."',
  }),
  Object.freeze({
    rank: 2,
    binding: 'fabricWeb',
    name: 'PACKED',
    what: 'the web as the packer calibrated it (`packed.web`) — squares at their MINT polygon '
      + 'and mint radius, before any facade has been marched to',
  }),
  Object.freeze({
    rank: 3,
    binding: 'facedWeb',
    name: 'FINAL',
    what: 'the web after `faceTheVoids` grew each square out to the facades that front it and '
      + 're-derived its reach. This is `fabric.web`',
  }),
]);

/**
 * ⭐ THE CLAIM SET IS A DERIVED READING OF THE FINAL CHANNELS, NOT A FOURTH VERSION. `lawClaims`
 * is `streetsWalled` plus the water's banks plus the circuit's band — the set the ground law
 * reserves. It is FINAL by construction (it can only be built from the final channels), and it
 * has its own binding so the two-construction class cannot reappear: it is composed ONCE, at
 * stage 5a2, and every later pass reads the binding.
 */
export const CLAIM_SET_BINDING = 'lawClaims';

/** Every binding spelling the walker will accept as naming a version of either artifact. */
export const VERSION_BINDINGS = Object.freeze(
  CHANNEL_VERSIONS.map((v) => v.binding)
    .concat(WEB_VERSIONS.map((v) => v.binding))
    .concat([CLAIM_SET_BINDING]),
);

/**
 * ⭐⭐ THE BINDINGS WHOSE NAME IS SPECIFIC TO ONE VERSION — and therefore may not appear as a
 * property name carrying a DIFFERENT version.
 *
 * ⛔ THE DEFECT THIS CLOSES, FOUND BY THE WALKER ITSELF: `censusLeaf` took a parameter named
 * `fabricWeb` and every caller passed it `facedWeb`. Every reader of that function was told, by
 * the only name available to them, that they held the PACKED web while holding the FINAL one.
 *
 * ⚠ `web`, `channels` and `squares` are DELIBERATELY ABSENT. They are the artifact's ordinary
 * generic names as well as (in `web`'s case) a version binding, so requiring `web: web` would
 * forbid the correct spelling everywhere. A name is only a claim about a version when it could
 * not mean anything else.
 */
export const VERSION_NAMED_PROPERTIES = Object.freeze(['fabricWeb', 'facedWeb', 'streetsWalled', 'lawClaims']);

/** The FINAL version of each artifact — what a published grade must be derived from. */
export const FINAL_CHANNELS = 'streetsWalled';
export const FINAL_WEB = 'facedWeb';

/**
 * ⭐⭐⭐ **THE FROZEN ROSTER OF CONSUMERS HANDED A NON-FINAL VERSION, EACH WITH ITS REASON.**
 *
 * ⚠⚠ THIS IS AN INVENTORY RATCHET, NOT A LIST OF EXCEPTIONS. Every row is a stage that runs
 * BEFORE the version it would otherwise want exists — a fact about the derivation order, which
 * is why the reason is a stage name and never a preference. A NEW row means a new consumer is
 * reading a stale version and someone has to say why in writing; the walker refuses one that
 * appears without a row, and refuses a row whose consumer has gone.
 *
 * ⭐ AND THE ONE THAT MATTERED IS NOT HERE ANY MORE. `webConnectivity` was on this list in all
 * but name until this wave: it is a GRADE, so SW-1 forbids it a non-final version outright, and
 * it moved rather than earning a row (⟦SW-1c⟧).
 */
export const NON_FINAL_CONSUMERS = Object.freeze([
  Object.freeze({
    consumer: 'seatInstitutions', property: 'web', binding: 'web',
    reason: 'STAGE 3b — the COMPOUND pass seats the monumental institutions before the packer '
      + 'runs, so the calibrated web does not exist; its own reservation is what the packer '
      + 'then packs around',
  }),
  Object.freeze({
    consumer: 'packFabric', property: 'web', binding: 'web',
    reason: 'STAGE 3b — this call is what CALIBRATES the estimated web into the packed one; it '
      + 'cannot read its own output',
  }),
  Object.freeze({
    consumer: 'deriveBuiltUmbrella', property: 'squares', binding: 'fabricWeb.squares',
    reason: 'STAGE 3b3 — the inversion runs before the ground law, and the facing pass needs the '
      + 'LAWFUL parcels to march to, so the faced squares cannot exist yet',
  }),
  Object.freeze({
    consumer: 'buildShantyFringe', property: 'web', binding: 'fabricWeb',
    reason: 'STAGE 3b2 — the fringe is pitched outside the gates against the packed web; facing '
      + 'only moves square boundaries INTO ground the packer already refused, which no shanty '
      + 'is standing on',
  }),
  Object.freeze({
    consumer: 'buildStreetChannels', property: 'web', binding: 'fabricWeb',
    reason: 'STAGE 3c — this call is what PRODUCES the pre-circuit channel version; it cannot '
      + 'read a web derived from its own output',
  }),
  Object.freeze({
    consumer: 'seatInstitutions', property: 'web', binding: 'fabricWeb',
    reason: 'STAGE 4 — seating moved ABOVE the ground law (§195.0) so an institution has a drawn '
      + 'body before the law sweeps it; the faced web is downstream of that law',
  }),
  Object.freeze({
    consumer: 'frontInstitutions', property: 'channels', binding: 'channels.channels',
    reason: 'STAGE 4b — fronting runs before the circuit, so the wall lanes and ring streets it '
      + 'would face do not exist. ⚠ THE KNOWN CONSEQUENCE, RECORDED: an institution is never '
      + 'fronted onto a ring street. That is a W3+ content question, not a version defect',
  }),
  Object.freeze({
    consumer: 'frontInstitutions', property: 'squares', binding: 'fabricWeb.squares',
    reason: 'STAGE 4b — same stage, same reason; and a square\'s CENTRE is carried unchanged '
      + 'across the facing, so the fronting target is version-independent',
  }),
  Object.freeze({
    consumer: 'wallHandles', property: 'web', binding: 'fabricWeb',
    reason: 'STAGE 5 — the circuit is traced from the packed fabric; the faced web is downstream '
      + 'of the ground law which is downstream of the circuit',
  }),
]);
