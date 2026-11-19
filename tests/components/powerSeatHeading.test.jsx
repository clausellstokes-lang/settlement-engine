/**
 * @vitest-environment jsdom
 *
 * A COUNT READS THE LIST IT HEADS (R2-CODE-B-SIDE item 4; round three's #562 #712 #806 #942 #1264 #1383 and the
 * increment's ww985 ww1049 ww1119 ww1192 pf92 pf262 pf334 pf406 pf782 pf812: "The Powers (4)" over the seat and its
 * contenders, and "The Powers (5)" a few lines below over every power the record holds). On the census's 720
 * births at 0570b3441, 282 towns printed the two headings with two counts. The first list is the seat and those
 * who contest it, so its heading says so; "The Powers (N)" heads the whole roster alone.
 */
import { describe, expect, test, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ThePowers } from '../../src/components/new/tabs/power/PowerStrata.jsx';

afterEach(cleanup);
const P = (name, role) => ({ name, archetype: 'government', power: 20, powerLabel: 'Strong', role, contenderCount: 3, gated: true });

describe('the seat\'s list is headed by what it lists', () => {
  test('the seat and three contenders: not "The Powers (4)"', () => {
    const powers = [P('Merchant Council', 'ruler'), P('Thieves\' Guild', 'contender'), P('Craft Guilds', 'contender'), P('Noble Families', 'contender')];
    const { container } = render(<ThePowers settlement={{}} powers={powers} factionSupport={new Map()} />);
    expect(container.textContent).toContain('The Seat and Its Contenders (4)');
    expect(container.textContent).not.toContain('The Powers ('); // anchored: toContain('The Seat and Its Contenders (4)') on this render
  });
  test('a seat no one contests is the seat alone', () => {
    const { container } = render(<ThePowers settlement={{}} powers={[{ ...P('Elder Council', 'ruler'), contenderCount: 0 }]} factionSupport={new Map()} />);
    expect(container.textContent).toContain('The Seat');
    expect(container.textContent).not.toContain('Contenders'); // anchored: toContain('The Seat') on this render
  });
  test('contenders with no one in the seat', () => {
    const { container } = render(<ThePowers settlement={{}} powers={[P('Craft Guilds', 'contender'), P('Noble Families', 'contender')]} factionSupport={new Map()} />);
    expect(container.textContent).toContain('Contenders for the Seat (2)');
  });
});
