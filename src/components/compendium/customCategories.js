/**
 * Data-only custom-content category view.
 *
 * `schema/custom-content.manifest.json` is the semantic authority. Its generated
 * client artifact supplies fields, dependencies, discovered status, and authoring
 * lanes; this adapter adds only UI color. Keeping icons out of this path preserves
 * the lazy boundary used by dependency and content-pack consumers.
 */

import { CUSTOM_CONTENT_MANIFEST } from '../../domain/content/customContentManifest.js';
import { CUSTOM_CATEGORY_COLORS } from './customCategoryDecorations.js';

function categoryView(category) {
  const scalarFields = category.fields
    .filter((field) => field.placement !== 'dependency' && field.ui !== false)
    .map((field) => field.key);
  const dependencies = category.dependencies.map((dependency) => {
    const field = category.fields.find((candidate) => candidate.key === dependency.field);
    return {
      key: dependency.field,
      label: field.label,
      ...(dependency.targetBuckets.length === 1
        ? { category: dependency.targetBuckets[0] }
        : { categories: [...dependency.targetBuckets] }),
      ...(dependency.cardinality === 'one' ? { single: true } : {}),
      ...(field.hint ? { hint: field.hint } : {}),
    };
  });

  return {
    key: category.key,
    label: category.label,
    singular: category.singular,
    color: CUSTOM_CATEGORY_COLORS[category.key],
    fields: scalarFields,
    ...(dependencies.length > 0 ? { dependencies } : {}),
    ...(category.discovered === true ? { discovered: true } : {}),
  };
}

export const CUSTOM_CATEGORIES = Object.freeze(
  CUSTOM_CONTENT_MANIFEST.categories.map(categoryView),
);

export const AUTHORING_LANES = Object.freeze(
  CUSTOM_CONTENT_MANIFEST.lanes.map((lane) => ({
    ...lane,
    buckets: [...lane.buckets],
  })),
);

export const CATEGORY_BY_KEY = Object.freeze(
  Object.fromEntries(CUSTOM_CATEGORIES.map((category) => [category.key, category])),
);
