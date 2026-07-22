/**
 * domain/townMap/arch/rulesets/evilChapel.js -- K-3 ORNAMENT: THE TONE-GATE building (owner veto).
 *
 * A small evil-drift chapel tower dressed with the macabre end of the statuary kit -- corner
 * GROTESQUES, projecting GARGOYLES, and a SKULL FRIEZE -- authored as a frozen ruleset so the exhibit
 * can render ONE plate of grotesque/skull iconography for the OWNER TONE GATE (kernel doc K-3
 * checkpoint): a taste veto on the dark-drift vocabulary BEFORE anything freezes. Everything is an
 * ABSTRACT architectural form (kit.js statuary) -- never a named character, never a portrait (product
 * scope). If the owner vetoes the tone, the fix is a kit swap + a re-render, not a rebuild.
 *
 * The SHELL (wide plinth + tower + spire) is present at EVERY tier and BOUNDS all statuary, so the
 * projecting gargoyles never extend the footprint -- silhouette agrees across tiers. LOD gates the
 * iconography (bare tower at glyph; corner grotesques at commons; full frieze + gargoyles at signature).
 *
 * PURITY: {+,-,*,/} + Math.sqrt; 0 transcendental sites; deterministic.
 *
 * @typedef {import('../grammarIR.js').Scope} Scope
 */

/** an axis-aligned world box as an identity-frame scope. @param {number} x0 @param {number} x1 @param {number} y0 @param {number} y1 @param {number} z0 @param {number} z1 @returns {Scope} */
function boxScope(x0, x1, y0, y1, z0, z1) {
  return { origin: [x0, y0, z0], frameRef: { frameIndex: 0, reflect: 0 }, size: [x1 - x0, y1 - y0, z1 - z0] };
}

// ── LAYOUT ─────────────────────────────────────────────────────────────────────────────────────
const TW = 120, TD = 120;                 // tower footprint
const PLINTH = 34;                        // plinth overhang (bounds the projecting gargoyles)
const PX0 = -PLINTH, PX1 = TW + PLINTH, PZ0 = -PLINTH, PZ1 = TD + PLINTH;
const PLINTH_TOP = 26, TOWER_TOP = 280, SPIRE_TOP = 380;
const FRIEZE_Y = 236, FRIEZE_H = 24;
const GARG_Y = 250;

/** build the evil-chapel ruleset. @returns {object} */
export function buildEvilChapelRuleset() {
  // corner grotesque placement boxes (within the plinth footprint)
  const gcorners = [
    boxScope(2, 34, TOWER_TOP - 40, TOWER_TOP + 6, 2, 34),
    boxScope(TW - 34, TW - 2, TOWER_TOP - 40, TOWER_TOP + 6, 2, 34),
    boxScope(TW - 34, TW - 2, TOWER_TOP - 40, TOWER_TOP + 6, TD - 34, TD - 2),
    boxScope(2, 34, TOWER_TOP - 40, TOWER_TOP + 6, TD - 34, TD - 2),
  ];
  // gargoyles projecting from the four faces (kept within the plinth overhang)
  const gargs = [
    boxScope(TW / 2 - 12, PX1, GARG_Y - 10, GARG_Y + 14, TD / 2 - 12, TD / 2 + 12), // +x face
    boxScope(PX0, TW / 2 + 12, GARG_Y - 10, GARG_Y + 14, TD / 2 - 12, TD / 2 + 12), // -x face (mirrored via reach)
  ];

  return Object.freeze({
    name: 'evil-chapel',
    symbols: [
      'chapel', 'shell', 'ornament', 'coarse',
      'plinth', 'tower', 'spire', 'door',
      'grotesqueSlot', 'gargoyleSlot', 'friezeHost', 'friezeBlock', 'skullSlot', 'skip',
    ],
    axiom: { sym: 'chapel', scope: boxScope(PX0, PX1, 0, SPIRE_TOP, PZ0, PZ1), attrs: { materialRole: 'ashlar', params: {} } },
    rules: {
      chapel: [
        { op: 'defer', byTier: { default: [{ sym: 'shell' }] } },
        { op: 'defer', byTier: { 2: [{ sym: 'ornament' }], 1: [{ sym: 'coarse' }], 0: [] } },
      ],
      // SHELL -- plinth (bounds statuary) + tower + spire, at EVERY tier
      shell: [{ op: 'defer', byTier: { default: [
        { sym: 'plinth', scope: boxScope(PX0, PX1, 0, PLINTH_TOP, PZ0, PZ1) },
        { sym: 'tower', scope: boxScope(0, TW, PLINTH_TOP, TOWER_TOP, 0, TD) },
        { sym: 'spire' },
      ] } }],
      plinth: [{ op: 'emit', kind: 'box', role: 'groundStone' }],
      tower: [{ op: 'emit', kind: 'box', role: 'ashlar' }],
      spire: [{ op: 'emit', kind: 'spire', role: 'roofLead', spire: [TW / 2, TD / 2, TW / 2, TOWER_TOP, SPIRE_TOP] }],
      door: [{ op: 'emit', kind: 'box', role: 'dressedStone' }],
      skip: [],

      // COARSE (commons) -- corner grotesques only
      coarse: [{ op: 'defer', byTier: { default: [
        { sym: 'grotesqueSlot', tag: '0', scope: gcorners[0] },
        { sym: 'grotesqueSlot', tag: '1', scope: gcorners[1] },
      ] } }],

      // ORNAMENT (signature) -- grotesques + gargoyles + the skull frieze + a door
      ornament: [{ op: 'defer', byTier: { default: [
        { sym: 'grotesqueSlot', tag: '0', scope: gcorners[0] },
        { sym: 'grotesqueSlot', tag: '1', scope: gcorners[1] },
        { sym: 'grotesqueSlot', tag: '2', scope: gcorners[2] },
        { sym: 'grotesqueSlot', tag: '3', scope: gcorners[3] },
        { sym: 'gargoyleSlot', tag: 'e', scope: gargs[0] },
        { sym: 'gargoyleSlot', tag: 'w', scope: gargs[1] },
        { sym: 'friezeHost', scope: boxScope(6, TW - 6, FRIEZE_Y, FRIEZE_Y + FRIEZE_H, TD + 1, TD + 14) },
        { sym: 'door', scope: boxScope(TW / 2 - 22, TW / 2 + 22, PLINTH_TOP, PLINTH_TOP + 80, TD, TD + 6) },
      ] } }],
      grotesqueSlot: [{ op: 'instance', asset: 'grotesque', role: 'relief' }],
      gargoyleSlot: [{ op: 'instance', asset: 'gargoyle', role: 'corbel' }],
      // the skull frieze: a tiled band of instanced skulls (split + repeat -> per-block instance)
      friezeHost: [{ op: 'split', axis: 'x', parts: [{ size: 20, sym: 'friezeBlock', repeat: 5 }, { size: '~', sym: 'skip' }] }],
      friezeBlock: [{ op: 'inset', sym: 'skullSlot', role: 'relief', margins: { x: 2, y: 2 } }],
      skullSlot: [{ op: 'instance', asset: 'skull', role: 'relief' }],
    },
  });
}

/** the frozen evil-chapel (deterministic; the tone-gate exemplar). @returns {object} */
export function evilChapelRuleset() { return buildEvilChapelRuleset(); }
