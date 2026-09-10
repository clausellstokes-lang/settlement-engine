import { describe, it, expect } from 'vitest';
import { powerHeadline } from '../../src/pdf/lib/headlines.js';

// powerHeadline weaves a ', with …' continuation clause onto a LEAD clause. When the
// governing faction has no name AND no governmentType is set, no lead is pushed — the
// continuation must not become the first element and open the headline on a comma.
describe('powerHeadline — no leading comma when there is no lead clause', () => {
  it('returns no comma-leading headline for a nameless governing faction with no governmentType', () => {
    const power = {
      governmentType: null,
      factions: [
        { isGoverning: true, name: '', power: 50 },   // truthy object, empty name → no lead
        { name: 'Reformers', power: 45 },             // challenger ≥ 0.7×top → would weave a clause
        { name: 'Traditionalists', power: 30 },
      ],
    };
    const h = powerHeadline(power);
    // Either null (no lead → no headline) or a string that does NOT start with a comma.
    expect(h == null || !String(h).trimStart().startsWith(',')).toBe(true);
  });

  it('still names the governing body and weaves the continuation when a lead exists', () => {
    const power = {
      governmentType: 'council',
      factions: [
        { isGoverning: true, name: 'The Assembly', power: 50 },
        { name: 'Reformers', power: 45 },
      ],
    };
    const h = powerHeadline(power);
    expect(h).toMatch(/The Assembly/);
    expect(String(h).startsWith(',')).toBe(false);
    expect(h).toMatch(/Reformers/);   // the continuation still weaves on
  });
});
