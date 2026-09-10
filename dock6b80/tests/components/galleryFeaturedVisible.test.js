/**
 * galleryFeaturedVisible.test.js — Vision V-13 FEATURED, HIDDEN-UNTIL-OCCUPIED.
 * An empty Featured set never renders a section (the no-fake-names honesty).
 */
import { describe, it, expect } from 'vitest';
import { featuredSectionVisible } from '../../src/components/gallery/galleryUtils.js';

describe('featuredSectionVisible — hidden until occupied', () => {
  it('is hidden for an empty / absent / non-array featured set', () => {
    expect(featuredSectionVisible([])).toBe(false);
    expect(featuredSectionVisible(null)).toBe(false);
    expect(featuredSectionVisible(undefined)).toBe(false);
    expect(featuredSectionVisible('nope')).toBe(false);
  });

  it('is visible only once at least one item is featured', () => {
    expect(featuredSectionVisible([{ id: 'a' }])).toBe(true);
    expect(featuredSectionVisible([{ id: 'a' }, { id: 'b' }])).toBe(true);
  });
});
