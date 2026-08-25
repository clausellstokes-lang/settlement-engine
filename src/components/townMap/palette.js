/**
 * components/townMap/palette.js — the town-map district-category tint map, shared
 * by the viewer pane and its edit controls so a category's legend swatch is the
 * SAME tint its district polygon draws. Theme tokens only (the no-raw-color lint
 * bans raw hex); no VIOLET (AI-reserved).
 */
import { AMBER, BLUE, BODY, GOLD, GOLD_DEEP, GREEN, INK, MUTED, RED, SECOND } from '../theme.js';

/** District category → base tint token (fill at low opacity; stroke on hover). */
export const DISTRICT_COLOR = {
  civic: BLUE, noble: GOLD_DEEP, merchant: GOLD, religious: SECOND,
  arcane: BODY, craft: AMBER, residential: GREEN, foreign: BLUE,
  military: RED, criminal: INK, industrial: AMBER, other: MUTED,
};

/** @param {string} [category] */
export const districtColor = (category) => DISTRICT_COLOR[category] || MUTED;
