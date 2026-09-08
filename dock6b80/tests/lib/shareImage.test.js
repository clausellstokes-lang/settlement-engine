/**
 * shareImage.test.js — the client share-card lane.
 *
 * Pins the pure pieces (the rasterize step needs a real browser canvas, so it is
 * exercised only for its graceful non-DOM rejection here):
 *   - settlementToShareSummary reads only coarse display fields via the same
 *     fallback chain the gallery uses;
 *   - buildShareCardSvg draws only those coarse fields, XML-escapes them, and —
 *     the load-bearing guarantee — never renders a seed / DM note / raw blob;
 *   - the filename + non-DOM rejection behave.
 */
import { describe, it, expect } from 'vitest';
import {
  settlementToShareSummary,
  buildShareCardSvg,
  shareCardFilename,
  renderShareCardPng,
} from '../../src/lib/shareImage.js';

describe('settlementToShareSummary', () => {
  it('reads coarse fields through the gallery fallback chain', () => {
    const s = settlementToShareSummary({
      name: 'Ashford-on-Vell',
      tier: 'town',
      config: { terrain: 'river_valley', magicLevel: 'ambient' },
      population: 2400,
      powerStructure: { governmentType: 'merchant council' },
      viability: { stability: 'tense' },
    });
    expect(s).toEqual({
      name: 'Ashford-on-Vell',
      tier: 'town',
      terrain: 'river_valley',
      population: 2400,
      governmentType: 'merchant council',
      magicLevel: 'ambient',
      stability: 'tense',
    });
  });

  it('tolerates a sparse settlement without throwing', () => {
    const s = settlementToShareSummary({ name: 'Bleak Hollow' });
    expect(s.name).toBe('Bleak Hollow');
    expect(s.population).toBeNull();
  });
});

describe('buildShareCardSvg', () => {
  it('renders a 1200x630 card with the coarse facts and attribution', () => {
    const svg = buildShareCardSvg({
      name: 'Ashford-on-Vell', tier: 'town', terrain: 'river_valley',
      population: 2400, governmentType: 'merchant council', magicLevel: 'ambient', stability: 'tense',
    });
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
    expect(svg).toContain('Ashford-on-Vell');
    expect(svg).toContain('Town');
    expect(svg).toContain('River Valley');
    expect(svg).toContain('2,400');
    expect(svg).toContain('Merchant Council');
    expect(svg).toContain('Forged with SettlementForge');
  });

  it('XML-escapes hostile names (no markup injection)', () => {
    const svg = buildShareCardSvg({ name: 'A & B <script>alert(1)</script>' });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;script&gt;');
  });

  it('never renders a seed, DM note, or raw blob field', () => {
    // Even if a caller hands the raw settlement instead of a summary, the card
    // draws ONLY the keys it reads — a smuggled seed/secret cannot appear.
    const svg = buildShareCardSvg({
      name: 'Ashford', tier: 'town', terrain: 'coast',
      seed: 'DEADBEEF-SEED-1234',
      prngSeed: 'sekret-seed',
      dmNotes: 'the vault code is 8471',
      data: { seed: 'blob-seed' },
    });
    expect(svg).not.toContain('DEADBEEF-SEED-1234');
    expect(svg).not.toContain('sekret-seed');
    expect(svg).not.toContain('vault code');
    expect(svg).not.toContain('blob-seed');
    expect(/seed/i.test(svg)).toBe(false);
  });

  it('falls back gracefully for an empty summary', () => {
    const svg = buildShareCardSvg({});
    expect(svg).toContain('A Settlement');
    expect(svg).toContain('Living settlement');
  });
});

describe('shareCardFilename', () => {
  it('slugifies the name and appends the brand suffix', () => {
    expect(shareCardFilename('Ashford-on-Vell!')).toBe('ashford-on-vell-settlementforge.png');
    expect(shareCardFilename('')).toBe('settlement-settlementforge.png');
  });
});

describe('renderShareCardPng', () => {
  it('rejects cleanly when there is no browser canvas (node env)', async () => {
    await expect(renderShareCardPng({ name: 'x' })).rejects.toThrow(/browser canvas/);
  });
});
