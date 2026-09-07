/**
 * tests/domain/blockadeTransport.test.js — pins for applyBlockadeTransportImpairment
 * (siege vs magical transport: severity-scaled airship 'access' impairment).
 *
 * Contracts pinned:
 *  - /airship/i institutions get an access impairment scaled 0.3 + severity*0.4
 *    (0.46 at the 0.4 stressor gate, capped at 0.7 at full grip), stamped with
 *    causeEventId prefix 'stressor-blockade:' and the threaded `now`;
 *  - re-stamping at the same grip returns the SAME settlement object — the
 *    soak loop depends on identity stability;
 *  - a severity change restamps in place (still one impairment, new number);
 *  - blockade end lifts ONLY this module's stamps, leaving impairments from
 *    other causes untouched;
 *  - teleportation circles / non-airship institutions are never touched;
 *  - settlements without airships (or institutions) pass through by identity.
 */
import { describe, it, expect } from 'vitest';
import { applyBlockadeTransportImpairment } from '../../src/domain/worldPulse/blockadeTransport.js';

const NOW = '0451-03-12T00:00:00.000Z';

const airship = (extra = {}) => ({ id: 'air1', name: 'Airship docking (high magic)', status: 'active', ...extra });
const circle = () => ({ id: 'tc1', name: 'Teleportation circle', status: 'active' });
const mkSettlement = (institutions) => ({ id: 's1', name: 'Port Veil', institutions });
const blockade = (severity, id = 'blk-1') => ({ id, severity });

const airshipOf = (s) => s.institutions.find((i) => /airship/i.test(i.name));
const accessStamps = (inst) => (inst.impairments || []).filter((im) => im.type === 'access');

describe('applyBlockadeTransportImpairment', () => {
  it('stamps a severity-scaled access impairment on airship institutions', () => {
    const out = applyBlockadeTransportImpairment(mkSettlement([airship()]), blockade(0.4), { now: NOW });
    const stamps = accessStamps(airshipOf(out));
    expect(stamps).toHaveLength(1);
    expect(stamps[0].severity).toBeCloseTo(0.46, 10); // 0.3 + 0.4*0.4 at the stressor gate
    expect(stamps[0].causeEventId).toBe('stressor-blockade:blk-1');
    expect(stamps[0].appliedAt).toBe(NOW); // threaded, never wall clock
    expect(airshipOf(out).status).toBe('impaired');
  });

  it('caps at 0.7 (impaired, never inoperable) at full grip', () => {
    const out = applyBlockadeTransportImpairment(mkSettlement([airship()]), blockade(1.0), { now: NOW });
    expect(accessStamps(airshipOf(out))[0].severity).toBeCloseTo(0.7, 10);
  });

  it('re-stamping at the same severity returns the SAME settlement object', () => {
    const first = applyBlockadeTransportImpairment(mkSettlement([airship()]), blockade(0.4), { now: NOW });
    const second = applyBlockadeTransportImpairment(first, blockade(0.4), { now: NOW });
    expect(second).toBe(first); // identity — the soak loop depends on this
  });

  it('a severity change restamps in place: one impairment, new number', () => {
    const first = applyBlockadeTransportImpairment(mkSettlement([airship()]), blockade(0.4), { now: NOW });
    const tightened = applyBlockadeTransportImpairment(first, blockade(0.9), { now: NOW });
    expect(tightened).not.toBe(first);
    const stamps = accessStamps(airshipOf(tightened));
    expect(stamps).toHaveLength(1); // replaced, not stacked (same type + cause)
    expect(stamps[0].severity).toBeCloseTo(0.66, 10); // 0.3 + 0.9*0.4
  });

  it("blockade end lifts ONLY this module's stamps, sparing foreign impairments", () => {
    const dock = airship({
      status: 'impaired',
      impairments: [
        { type: 'access', severity: 0.46, causeEventId: 'stressor-blockade:blk-1' },
        { type: 'access', severity: 0.2, causeEventId: 'evt-fire-7' },
      ],
    });
    const out = applyBlockadeTransportImpairment(mkSettlement([dock]), null, { now: NOW });
    const stamps = accessStamps(airshipOf(out));
    expect(stamps).toHaveLength(1);
    expect(stamps[0].causeEventId).toBe('evt-fire-7'); // the fire is not the blockade's to undo
    expect(airshipOf(out).status).toBe('impaired'); // still impaired by the fire
  });

  it('blockade end with only module stamps restores active status', () => {
    const dock = airship({
      status: 'impaired',
      impairments: [{ type: 'access', severity: 0.7, causeEventId: 'stressor-blockade:blk-1' }],
    });
    const out = applyBlockadeTransportImpairment(mkSettlement([dock]), null, { now: NOW });
    expect(accessStamps(airshipOf(out))).toHaveLength(0);
    expect(airshipOf(out).status).toBe('active');
  });

  it('non-airship institutions pass through untouched (same object), circles ignore the siege', () => {
    const tc = circle();
    const out = applyBlockadeTransportImpairment(mkSettlement([tc, airship()]), blockade(1.0), { now: NOW });
    expect(out.institutions[0]).toBe(tc); // teleportation cannot be interdicted from outside
    expect(out.institutions[0].impairments).toBeUndefined();
  });

  it('settlements without airships return the same object identity', () => {
    const noDock = mkSettlement([circle()]);
    expect(applyBlockadeTransportImpairment(noDock, blockade(1.0), { now: NOW })).toBe(noDock);
    const empty = mkSettlement([]);
    expect(applyBlockadeTransportImpairment(empty, blockade(1.0), { now: NOW })).toBe(empty);
    const bare = { id: 's2', name: 'No Roster' };
    expect(applyBlockadeTransportImpairment(bare, blockade(1.0), { now: NOW })).toBe(bare);
  });

  it('no blockade + no stamps is a pure identity pass', () => {
    const clean = mkSettlement([airship(), circle()]);
    expect(applyBlockadeTransportImpairment(clean, null, { now: NOW })).toBe(clean);
  });
});
