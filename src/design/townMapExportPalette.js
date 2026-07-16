/**
 * design/townMapExportPalette.js — the fixed, theme-INDEPENDENT color tokens for
 * the town-map EXPORT surfaces (the SM-4 PDF plate + library-card thumbnail).
 *
 * These are DEFINITION tokens, homed here (the design-token layer) for two reasons:
 *   • a canvas raster and a react-pdf render each need CONCRETE color — a CSS
 *     variable / theme token cannot cross into either, and a deterministic plate
 *     demands the SAME bytes on every machine, so the export palette must be fixed
 *     hex, decoupled from the live (light/dark) theme;
 *   • as literal color tokens they belong in src/design/ (the sanctioned token
 *     zone), NOT inline in the domain draw module — keeping the raw-color-literal
 *     budget honest (the escape hatch for definitions is exactly this layer).
 *
 * Print-tuned to hold on parchment and stay legible in a tiny thumbnail. Category
 * tints mirror the on-screen viewer's DISTRICT_COLOR intent (civic→blue,
 * military→red, criminal→ink, …) with concrete values (no VIOLET — AI-reserved).
 * Consumed only by the lazy export surfaces (domain/townMap/townMapDraw.js), so it
 * never reaches the first-paint closure.
 */

export const EXPORT_PALETTE = Object.freeze({
  parchment: '#fbf5e6',
  ink: '#2c2210',
  muted: '#6b5340',
  water: '#3d6b8a',
  road: '#6b5340',
  street: '#8a7250',
  wall: '#2c2210',
  gate: '#fbf5e6',
  anchor: '#c9a24c',
  buildingFill: '#fffbf5',
  hazardHigh: '#8b1a1a',
  hazardHighBg: '#fde8e8',
  hazardMid: '#a0762a',
  hazardMidBg: '#f5ede0',
  district: Object.freeze({
    civic: '#2a3a7a',
    noble: '#8c6f32',
    merchant: '#a0762a',
    religious: '#7a5a2a',
    arcane: '#3d2b1a',
    craft: '#b07a1a',
    residential: '#1a5a28',
    foreign: '#3d6b8a',
    military: '#8b1a1a',
    criminal: '#2c2210',
    industrial: '#a0672a',
    other: '#6b5340',
  }),
});
