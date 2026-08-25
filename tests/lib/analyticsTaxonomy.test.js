/**
 * analyticsTaxonomy.test.js — event-registry contract.
 *
 * Pins the invariants the rest of the analytics layer relies on:
 *   - EVENT_CLASS is 1:1 with EVENTS (no event without a class; no orphan class).
 *   - every class is valid ('essential' | 'research').
 *   - every event NAME matches the wire contract regex.
 *   - the four research-class events are exactly the documented set.
 */

import { describe, it, expect } from 'vitest';
import {
  EVENTS, EVENT_CLASS, EVENTS_REV, RESEARCH_EVENT_KEYS, EVENT_NAME_RE, classForEvent,
} from '../../src/lib/analyticsEvents.js';

describe('analytics event taxonomy', () => {
  it('EVENT_CLASS keys are 1:1 with EVENTS keys', () => {
    expect(Object.keys(EVENT_CLASS).sort()).toEqual(Object.keys(EVENTS).sort());
  });

  it('every class is valid', () => {
    const bad = Object.entries(EVENT_CLASS).filter(([, c]) => c !== 'essential' && c !== 'research');
    expect(bad).toEqual([]);
  });

  it('every event name matches the wire contract', () => {
    const bad = Object.values(EVENTS).filter(name => !EVENT_NAME_RE.test(name));
    expect(bad).toEqual([]);
  });

  it('event names are unique', () => {
    const names = Object.values(EVENTS);
    expect(new Set(names).size).toBe(names.length);
  });

  it('the research-class set is exactly the documented four', () => {
    const research = Object.keys(EVENT_CLASS).filter(k => EVENT_CLASS[k] === 'research').sort();
    expect(research).toEqual([...RESEARCH_EVENT_KEYS].sort());
    expect(research.length).toBe(4);
  });

  it('classForEvent resolves by event name and by constant', () => {
    expect(classForEvent(EVENTS.HOMEPAGE_VIEW)).toBe('essential');
    expect(classForEvent(EVENTS.SETTLEMENT_FINGERPRINT_CAPTURED)).toBe('research');
    expect(classForEvent('GENERATION_STEP_TIMINGS')).toBe('research'); // constant form
  });

  it('exposes a numeric contract revision', () => {
    expect(typeof EVENTS_REV).toBe('number');
    expect(EVENTS_REV).toBeGreaterThanOrEqual(1);
  });
});
