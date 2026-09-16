/**
 * rollingCancellation.test.js — SK-7's proof surface (sk-b; ODQ §143.1, §145.2, §146.3).
 *
 * ⛔⛔ THE DECOY IS THE POINT OF THIS FILE. `pkill -f` has returned a SIBLING LANE'S
 * WORKERS as SKIPS in this estate — a recorded hazard that has already bitten. The pin
 * below spawns nothing and kills nothing; it drives the real decision path with a decoy
 * process whose command line matches any plausible pattern, and asserts the decoy SURVIVES
 * because it is not in the pool's own PID set.
 */

import { describe, expect, it } from 'vitest';

import { CANCEL_SIGNAL, cancel, cancellationPlan, refusePatternKill } from '../../scripts/soak/cancel.mjs';
import {
  ROLLING_PROFILE,
  dispatchRefusals,
  rollingReport,
  supersededContribution,
} from '../../scripts/soak/rolling.mjs';

/** The pool's own children, and a DECOY that looks exactly like one to a pattern. */
const POOL_PGID = 4242;
const OURS = [
  { pid: 101, key: 'w0-soak::30::4::preset' },
  { pid: 102, key: 'w0-soak-b::30::4::preset' },
];
const DECOY_PID = 999;
const DECOY_COMMAND = 'node scripts/audit/whole-world-soak.mjs --years 30 --seed sibling-lane';

describe('rolling soaks and their cancellation', () => {
  it('⛔ cancellation is PID-EXACT, and a matching DECOY survives', () => {
    // Every process alive; the decoy belongs to ANOTHER process group, exactly as a
    // sibling lane's worker would.
    const owner = (pid) => (pid === DECOY_PID ? 7777 : POOL_PGID);
    const signalled = [];
    const result = cancel({
      pids: OURS, pgid: POOL_PGID, owner, send: (pid) => signalled.push(pid),
    });
    expect(result.signalName).toBe(CANCEL_SIGNAL);
    expect(result.sent).toEqual([101, 102]);
    // ⛔ THE DECOY SURVIVES. Its command line matches any pattern that matches ours; only
    // the PID set distinguishes them, which is why the PID set is what we use.
    expect(signalled.filter((pid) => pid === DECOY_PID)).toEqual([]);
    expect(DECOY_COMMAND).toContain('whole-world-soak.mjs');
    // And if the decoy WERE in our ledger by mistake, the ownership check still spares it.
    const withDecoy = cancellationPlan({
      pids: [...OURS, { pid: DECOY_PID, key: 'not-ours' }], pgid: POOL_PGID, owner,
    });
    expect(withDecoy.signal).toEqual([101, 102]);
    expect(withDecoy.skipped.map((row) => row.pid)).toEqual([DECOY_PID]);
    expect(withDecoy.skipped[0].why).toContain('recycled');
  });

  it('a dead PID is skipped, not signalled on the strength of a stale ledger', () => {
    const owner = (pid) => (pid === 101 ? null : POOL_PGID);
    const plan = cancellationPlan({ pids: OURS, pgid: POOL_PGID, owner });
    expect(plan.signal).toEqual([102]);
    expect(plan.skipped).toEqual([{ pid: 101, why: 'process is gone — nothing to signal' }]);
    // An empty pool signals nothing rather than falling back to something broader.
    expect(cancellationPlan({ pids: [], pgid: POOL_PGID, owner })).toEqual({ signal: [], skipped: [] });
  });

  it('a pattern-matched kill is REFUSED BY NAME, in every spelling', () => {
    expect(refusePatternKill('kill -TERM 101')).toEqual([]);
    for (const spec of ['pkill -f whole-world-soak', 'killall node', 'pgrep -f soak', 'kill -f 1']) {
      const refusal = refusePatternKill(spec);
      expect(refusal.length, `${spec} was accepted`).toBe(1);
      expect(refusal[0]).toContain('PID-EXACT');
    }
  });

  it('⛔ the dispatch gate: nothing soaks before tm+sk lands, and not at its OWN exposure', () => {
    expect(dispatchRefusals({ tmSkLanded: true, exposureIsTmSkOwn: false, fableAuditPassed: true })).toEqual([]);
    expect(dispatchRefusals({ tmSkLanded: false, exposureIsTmSkOwn: false, fableAuditPassed: true })[0])
      .toContain('Nothing soaks before the harness itself exists');
    expect(dispatchRefusals({ tmSkLanded: true, exposureIsTmSkOwn: true, fableAuditPassed: true })[0])
      .toContain('this family IS tm+sk');
    expect(dispatchRefusals({ tmSkLanded: true, exposureIsTmSkOwn: false, fableAuditPassed: false })[0])
      .toContain('soak-process audit has not passed');
  });

  it('the report is findings-only, additive, sha-stamped, and control-guarded', () => {
    expect(ROLLING_PROFILE).toBe('cert-30');
    const findings = [{ cellKey: 'a', id: 'negative_stock' }, { cellKey: 'b', id: 'unbounded_growth' }];
    const report = rollingReport({
      archivedTipSha: 'abc123', cells: 12, findings, observability: [], controlsAttached: ['a', 'b'],
    });
    expect(report.findingsOnly).toBe(true);
    expect(report.additive).toBe(true);
    expect(report.additiveNote).toContain('never substitutes');
    // Archive drift is lawful ONLY when named: the header carries the sha it MEASURED.
    expect(report.archivedTipSha).toBe('abc123');
    expect(report.orphanFindings).toEqual([]);

    // ⛔ A FINDING WITH NO CONTROL ROW IS NOT A FINDING — and it is REPORTED as an orphan
    // rather than silently dropped, so a missing control is visible as a run defect.
    const orphaned = rollingReport({
      archivedTipSha: 'abc123', cells: 12, findings, observability: [], controlsAttached: ['a'],
    });
    expect(orphaned.orphanFindings).toEqual(['b']);

    // ⛔ A SUPERSEDED RUN CONTRIBUTES NOTHING, and the superseding sha is named.
    const superseded = rollingReport({
      archivedTipSha: 'abc123', supersededBy: 'def456', cells: 12,
      findings, observability: [{ id: 'memory_watermark' }], controlsAttached: ['a', 'b'],
    });
    expect(superseded.superseded).toBe(true);
    expect(superseded.supersededBy).toBe('def456');
    expect(superseded.findings).toEqual([]);
    expect(superseded.observability).toEqual([]);
    expect(superseded.partialResultsWithheld).toContain('never merge into findings or density');
    expect(supersededContribution()).toEqual({
      findings: [], density: null, credited: false, status: 'superseded',
    });
  });
});
