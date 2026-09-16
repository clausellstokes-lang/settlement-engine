/**
 * Human-facing copy for the manual custom-content editor.
 *
 * Field truth comes from the canonical manifest. These strings explain that
 * truth in product language; they never grant a field additional authority.
 */

import { td } from '../../copy/deityAuthoring.js';

export const CUSTOM_CONTENT_FIELD_HINTS = Object.freeze({
  category: 'Which part of settlement life this belongs to and where it appears in the dossier. This classifies presentation; it does not add an unregistered simulation rule.',
  authority: 'Describes the kind of power associated with this content. It is currently presentation-only and does not silently change leadership power.',
  defenseRole: 'Describes a defensive role for presentation and future registered operations. It does not change defense totals unless a named consumer is added.',
  essential: 'Always eligible when its tier gate passes, rather than entering only through a probability roll.',
  foodImpact: 'Whether this raises local food supply or adds daily food demand. Once its activation gate is met, the canonical food-security writer applies it exactly once.',
  satisfies: 'The trade category this good can satisfy. Registered demand categories are mechanical; a custom category remains presentation until a consumer is registered.',
  criticality: 'For resources and services, critical content is guaranteed generation eligibility when its tier gate passes. It does not create a new crisis rule.',
  economicWeight: 'Where this category registers an economic consumer, the value weights its contribution. In categories without that consumer it remains presentation.',
  magical: 'Presentation tag: this content is arcane or enchanted. No additional magic mechanic is inferred.',
  criminal: 'Presentation tag: this content operates outside the law. No additional crime mechanic is inferred.',
  tierMin: 'Smallest settlement size where registered generation consumers allow it to appear. In presentation-only categories this remains descriptive.',
  tierMax: 'Largest settlement size where this can appear. Leave blank for no upper limit.',
  sceneProfileId: 'Registered 3D architectural grammar. TownScene still owns dimensions, geometry, LOD, collision, and condition.',
  landmarkLevel: 'Presentation prominence in the 3D portrait. It never changes institutional power or 2D placement.',
  materialFamily: 'A bounded material family interpreted by TownScene; arbitrary textures and shaders are not accepted.',
  glyph: 'A registered building silhouette. The scene compiler validates and budgets its geometry.',
  archetype: 'For example: merchant guild, thieves’ cabal, or knightly order.',
  agenda: 'What this faction is trying to achieve.',
  scale: 'How much reach and influence this faction has.',
  methods: 'How it pursues its agenda, such as bribery, force, or diplomacy.',
  alignmentAxis: td('form.alignmentHint'),
  lawAxis: td('form.lawHint'),
  rankAxis: td('form.rankHint'),
  portfolio: td('form.portfolioHint'),
  domain: td('form.domainHint'),
  motifElement: 'The founding image this holiday is built around: harvest, hearth, river, or the dead.',
  motifAct: 'How the settlement observes it: feast, procession, vigil, contest, fair, or offering.',
  epithet: 'An optional flavour line shown beneath the tradition in a dossier.',
});

export const CUSTOM_CONTENT_FIELD_LABELS = Object.freeze({
  alignmentAxis: td('form.alignmentLabel'),
  lawAxis: td('form.lawLabel'),
  rankAxis: td('form.rankLabel'),
  portfolio: td('form.portfolioLabel'),
  domain: td('form.domainLabel'),
});
