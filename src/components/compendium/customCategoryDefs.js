/**
 * UI-facing custom-content category definitions.
 *
 * The semantic schema comes from customCategories.js, which derives it from the
 * canonical icon-free manifest.
 *
 * THIS LEAF USED TO CARRY A LUCIDE JOIN (lane LU-2). Its one UI-only job was
 * mapping each category key to a Lucide icon, which both consumers then rendered
 * as `<c.Icon size={11}/> {c.label}` — ungated, on the compendium, i.e. outside
 * the Realm map and straight through the icons-off redesign. The join is gone
 * and the categories keep the channel that survives: their text label. What is
 * left is the derived key lookup, which is the only thing the join was wrapping.
 */

import { CUSTOM_CATEGORIES as DATA_CATEGORIES } from './customCategories.js';

export const CUSTOM_CATEGORIES = Object.freeze(DATA_CATEGORIES.map((category) => ({ ...category })));

export const CATEGORY_BY_KEY = Object.freeze(
  Object.fromEntries(CUSTOM_CATEGORIES.map((category) => [category.key, category])),
);
