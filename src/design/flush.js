/**
 * design/flush.js — THE FLUSH RULE (the owner, 2026-11-02 UTC, X-44): "There's that space that
 * now I think it's unnecessary … just have like a borderline boundary line from end to end of
 * the entire dossier replace it but making everything still flush."
 *
 * Stacked blocks on a dossier page sit edge to edge, parted by ONE hairline that runs the width
 * of the page. The mechanism is the blocks' own edges: a bordered block's top edge overlaps the
 * previous block's bottom edge by one pixel, so two edges paint as one line; a block with no
 * edge of its own takes the rule and the inner padding a card carries. The coloured left
 * accents stay (they carry the category), nothing is rounded and nothing floats. The rule is
 * the house hairline token, never a literal.
 *
 * A pure leaf: no imports but the token.
 */
import { legacy as L } from './tokens.js';

/** A stacked block: no gap below, its top edge over the previous block's bottom edge. */
export const FLUSH = Object.freeze({ marginBottom: 0, marginTop: -1 });

/** A stack of blocks: no gap between them (the blocks carry FLUSH). */
export const FLUSH_STACK = Object.freeze({ display: 'flex', flexDirection: 'column', gap: 0 });

/** A block with no edge of its own: the hairline above it and a card's inner padding. */
export const FLUSH_RULED = Object.freeze({
  marginBottom: 0, marginTop: -1, borderTop: `1px solid ${L.BORDER}`, padding: '10px 14px',
});

/** A page that stacks blocks: the panel's own edge is the blocks' edge, so the rule runs end to end. */
export const FLUSH_PAGE = Object.freeze({ padding: 0 });
