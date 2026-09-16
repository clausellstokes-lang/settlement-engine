/**
 * UI-only decoration for custom-content categories.
 *
 * Semantic category data belongs to the icon-free manifest. Colors remain here so
 * domain, compiler, pack, and edge consumers never import presentation dependencies.
 */

import { swatch } from '../../design/tokens.js';

export const CUSTOM_CATEGORY_COLORS = Object.freeze({
  institutions: '#1a3a7a',
  services: '#0e7c86',
  resources: '#1a5a28',
  stressors: '#8b1a1a',
  tradeGoods: '#a0762a',
  deities: '#7c3aed',
  traditions: swatch['#8A5A1A'],
  factions: '#6a1a4a',
  supplyChains: '#a0762a',
});

