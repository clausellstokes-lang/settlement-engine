/**
 * components/organic/index.js — the Organic Craft primitive component barrel.
 * One import surface for the manuscript-grammar + seeded-ornament primitives.
 * Lazy-only — nothing here is reachable from the first-paint static closure.
 */
export { default as Rule } from './Rule.jsx';
export { Register, Marginalia } from './Register.jsx';
export { Surface, Display, Eyebrow, Rubric, Prose, Ink } from './Manuscript.jsx';
export { Emblem, CompassRose, SeededCartouche } from './Ornament.jsx';
