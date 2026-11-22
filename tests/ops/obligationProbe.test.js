import { describe, expect, it } from 'vitest';
import {
  combineOperationalHealth,
  parseOperationalHealth,
  probeExitCode,
  severityAllowed,
} from '../../scripts/ops/obligationProbeCore.mjs';

function health(severity = 'healthy') {
  return {
    schemaVersion: 1,
    severity,
    healthy: severity === 'healthy',
    accountDeletion: { open: 0 },
    paymentRefund: { open: 0 },
    stripeWebhook: { processing: 0 },
  };
}

describe('operational obligation probe policy', () => {
  it('admits only the versioned, internally consistent report shape', () => {
    expect(parseOperationalHealth(health())).toMatchObject({ ok: true });
    expect(parseOperationalHealth(null)).toEqual({
      ok: false,
      reason: 'response_not_object',
    });
    expect(parseOperationalHealth({ ...health(), schemaVersion: 2 })).toEqual({
      ok: false,
      reason: 'unsupported_schema_version',
    });
    expect(parseOperationalHealth({
      ...health('warning'),
      healthy: true,
    })).toEqual({
      ok: false,
      reason: 'severity_health_mismatch',
    });
  });

  it('uses an explicit severity ceiling and fails invalid observations closed', () => {
    expect(severityAllowed('healthy', 'healthy')).toBe(true);
    expect(severityAllowed('warning', 'healthy')).toBe(false);
    expect(severityAllowed('warning', 'warning')).toBe(true);
    expect(severityAllowed('critical', 'warning')).toBe(false);

    expect(probeExitCode(parseOperationalHealth(health()), 'healthy')).toBe(0);
    expect(probeExitCode(
      parseOperationalHealth(health('warning')),
      'healthy',
    )).toBe(1);
    expect(probeExitCode(
      parseOperationalHealth(health('warning')),
      'warning',
    )).toBe(0);
    expect(probeExitCode({ ok: false }, 'critical')).toBe(2);
  });

  it('reports the worse of obligation and command authority without hiding either', () => {
    const combined = combineOperationalHealth(
      health('healthy'),
      {
        ...health('critical'),
        reconcileRequired: 2,
        importReconcileRequired: 1,
      },
    );
    expect(combined).toMatchObject({
      ok: true,
      health: {
        healthy: false,
        severity: 'critical',
        obligations: { severity: 'healthy' },
        applicationCommands: {
          severity: 'critical',
          importReconcileRequired: 1,
        },
      },
    });
    expect(probeExitCode(combined, 'healthy')).toBe(1);
    expect(combineOperationalHealth(health(), null)).toEqual({
      ok: false,
      reason: 'application_commands_response_not_object',
    });
  });
});
