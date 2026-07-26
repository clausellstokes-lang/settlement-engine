/**
 * UI-facing custom-content category definitions.
 *
 * The semantic schema comes from customCategories.js, which derives it from the
 * canonical icon-free manifest. This leaf performs the one UI-only join: category
 * key to Lucide icon. There is no second field/dependency copy to drift.
 */

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Coins,
  Flag,
  HeartHandshake,
  Link2,
  Package,
  Sparkles,
} from 'lucide-react';
import { CUSTOM_CATEGORIES as DATA_CATEGORIES } from './customCategories.js';

const ICON_BY_CATEGORY = Object.freeze({
  institutions: Building2,
  services: HeartHandshake,
  resources: Package,
  stressors: AlertTriangle,
  tradeGoods: Coins,
  deities: Sparkles,
  traditions: CalendarDays,
  factions: Flag,
  supplyChains: Link2,
});

export const CUSTOM_CATEGORIES = Object.freeze(
  DATA_CATEGORIES.map((category) => ({
    ...category,
    Icon: ICON_BY_CATEGORY[category.key],
  })),
);

export const CATEGORY_BY_KEY = Object.freeze(
  Object.fromEntries(CUSTOM_CATEGORIES.map((category) => [category.key, category])),
);
