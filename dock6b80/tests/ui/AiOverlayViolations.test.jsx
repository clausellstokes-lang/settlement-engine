/**
 * @vitest-environment jsdom
 *
 * tests/ui/AiOverlayViolations.test.jsx — Tier 6.7 surface coverage.
 *
 * The AiOverlayViolations component renders the runtime verifier's
 * findings (state.aiViolations) so DMs see drift before shipping the
 * AI overlay. These tests verify:
 *   - returns null when violations is missing / clean
 *   - groups hard vs. soft violations
 *   - shows the count summary
 *   - dismiss button fires onDismiss
 *   - collapse toggle hides the body
 *   - each violation row shows kind label + label + detail
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { AiOverlayViolations } from '../../src/components/primitives/AiOverlayViolations.jsx';

afterEach(cleanup);

function makeReport({ violations = [], ok = false } = {}) {
  return {
    ok,
    violations,
    summary: {
      invented:        violations.filter(v => v.kind === 'invented_entity').length,
      removed:         violations.filter(v => v.kind === 'removed_entity').length,
      renamed:         violations.filter(v => v.kind === 'renamed_entity').length,
      contradicted:    violations.filter(v => v.kind === 'changed_fact').length,
      canonChanged:    violations.filter(v => v.kind === 'changed_canon').length,
      historyDropped:  violations.filter(v => v.kind === 'removed_history_beat').length,
      userFieldChanged: violations.filter(v => v.kind === 'changed_user_field').length,
    },
  };
}

describe('AiOverlayViolations — render gates', () => {
  test('returns null when violations is null', () => {
    const { container } = render(<AiOverlayViolations violations={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when violations is undefined', () => {
    const { container } = render(<AiOverlayViolations />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when ok=true (no drift)', () => {
    const report = makeReport({ ok: true, violations: [] });
    const { container } = render(<AiOverlayViolations violations={report} />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when violations array is empty', () => {
    const report = makeReport({ violations: [] });
    const { container } = render(<AiOverlayViolations violations={report} />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when violations is not an array', () => {
    const broken = { ok: false, violations: 'oops', summary: {} };
    const { container } = render(<AiOverlayViolations violations={broken} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('AiOverlayViolations — hard violations', () => {
  test('renders the drift header when hard violations exist', () => {
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'npcs', key: 'k1', label: 'Phantom', detail: 'AI added an NPC.' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/AI overlay drift detected/i)).toBeTruthy();
    expect(screen.getByText(/1 issue/)).toBeTruthy();
  });

  test('shows the hard count separately from the soft count', () => {
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'npcs', key: 'k1', label: 'Phantom', detail: 'X' },
        { kind: 'removed_history_beat', field: 'history.flood', key: 'k2', label: 'flood', detail: 'Y' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/1 hard/)).toBeTruthy();
    expect(screen.getByText(/1 soft/)).toBeTruthy();
  });

  test('renders the kind label for each violation', () => {
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'npcs', key: 'k1', label: 'Phantom', detail: 'X' },
        { kind: 'renamed_entity', field: 'factions', key: 'k2', label: 'Guild', detail: 'Y' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/Invented entity/)).toBeTruthy();
    expect(screen.getByText(/Renamed entity/)).toBeTruthy();
  });

  test('renders the violation label + detail', () => {
    const report = makeReport({
      violations: [
        { kind: 'changed_user_field', field: 'npc[0].secret.what', key: 'k1', label: 'Aldis', detail: 'AI overrode the secret.' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText('Aldis')).toBeTruthy();
    expect(screen.getByText('AI overrode the secret.')).toBeTruthy();
  });

  test('every hard kind has a human-readable label', () => {
    const HARD_KINDS = [
      'invented_entity',
      'renamed_entity',
      'changed_fact',
      'changed_canon',
      'changed_user_field',
    ];
    const violations = HARD_KINDS.map(kind => ({
      kind, field: 'f', key: `k.${kind}`, label: 'L', detail: 'D',
    }));
    render(<AiOverlayViolations violations={makeReport({ violations })} />);
    expect(screen.getByText(/Invented entity/)).toBeTruthy();
    expect(screen.getByText(/Renamed entity/)).toBeTruthy();
    expect(screen.getByText(/Contradicted fact/)).toBeTruthy();
    expect(screen.getByText(/Changed canon status/)).toBeTruthy();
    expect(screen.getByText(/Overwrote user edit/)).toBeTruthy();
  });
});

describe('AiOverlayViolations — soft violations', () => {
  test('renders soft violations with the muted tone', () => {
    const report = makeReport({
      violations: [
        { kind: 'removed_history_beat', field: 'history.flood', key: 'k1', label: 'flood', detail: 'Beat dropped.' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/Dropped history beat/)).toBeTruthy();
    expect(screen.getByText(/informational only/i)).toBeTruthy();
  });

  test('soft-only report still surfaces (no hard mix required)', () => {
    const report = makeReport({
      violations: [
        { kind: 'removed_entity', field: 'npcs', key: 'k1', label: 'Old NPC', detail: 'X' },
        { kind: 'removed_history_beat', field: 'history.x', key: 'k2', label: 'beat', detail: 'Y' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/AI overlay drift detected/i)).toBeTruthy();
    expect(screen.getByText(/Removed entity/)).toBeTruthy();
  });
});

describe('AiOverlayViolations — actions', () => {
  test('dismiss button fires onDismiss', () => {
    const onDismiss = vi.fn();
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'f', key: 'k', label: 'L', detail: 'D' },
      ],
    });
    render(<AiOverlayViolations violations={report} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalled();
  });

  test('dismiss button is not rendered when onDismiss is not provided', () => {
    const report = makeReport({
      violations: [{ kind: 'invented_entity', field: 'f', key: 'k', label: 'L', detail: 'D' }],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.queryByLabelText('Dismiss')).toBeNull();
  });

  test('collapse toggle hides the body', () => {
    const report = makeReport({
      violations: [{ kind: 'invented_entity', field: 'f', key: 'k', label: 'Phantom NPC', detail: 'X' }],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText('Phantom NPC')).toBeTruthy();
    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByText('Phantom NPC')).toBeNull();
    expect(screen.getByText('Show')).toBeTruthy();
  });

  test('collapse toggle restores the body on second click', () => {
    const report = makeReport({
      violations: [{ kind: 'invented_entity', field: 'f', key: 'k', label: 'X', detail: 'Y' }],
    });
    render(<AiOverlayViolations violations={report} />);
    fireEvent.click(screen.getByText('Hide'));
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByText('X')).toBeTruthy();
    expect(screen.getByText('Hide')).toBeTruthy();
  });
});

describe('AiOverlayViolations — accessibility', () => {
  test('outer wrapper has role="region" with an aria-label', () => {
    const report = makeReport({
      violations: [{ kind: 'invented_entity', field: 'f', key: 'k', label: 'X', detail: 'Y' }],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByLabelText('AI overlay violations')).toBeTruthy();
  });

  test('collapse toggle exposes aria-expanded', () => {
    const report = makeReport({
      violations: [{ kind: 'invented_entity', field: 'f', key: 'k', label: 'X', detail: 'Y' }],
    });
    render(<AiOverlayViolations violations={report} />);
    const toggle = screen.getByText('Hide');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(toggle);
    expect(screen.getByText('Show').getAttribute('aria-expanded')).toBe('false');
  });
});

describe('AiOverlayViolations — real-world scenarios', () => {
  test('mixed hard + soft report renders both sections', () => {
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'npcs', key: 'k1', label: 'Phantom', detail: 'AI added an NPC.' },
        { kind: 'renamed_entity',  field: 'factions', key: 'k2', label: 'Guild', detail: 'Renamed.' },
        { kind: 'removed_history_beat', field: 'history.flood', key: 'k3', label: 'flood', detail: 'Dropped.' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/Hard violations/i)).toBeTruthy();
    expect(screen.getByText(/Soft violations/i)).toBeTruthy();
    expect(screen.getByText('Phantom')).toBeTruthy();
    expect(screen.getByText('Guild')).toBeTruthy();
    expect(screen.getByText('flood')).toBeTruthy();
  });

  test('handles a single overridden-user-edit violation gracefully', () => {
    const report = makeReport({
      violations: [
        {
          kind: 'changed_user_field',
          field: 'npc[0].secret.what',
          key: 'npc:0:secret.what',
          label: 'Aldis',
          before: 'Hand-written by DM.',
          after: 'AI thinks it knows better.',
          detail: 'User-edited field "secret.what" on npc "Aldis" was overwritten by the AI.',
        },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText('Aldis')).toBeTruthy();
    expect(screen.getByText(/overwritten by the AI/)).toBeTruthy();
  });

  test('singular issue count uses "1 issue" (no plural)', () => {
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'f', key: 'k', label: 'X', detail: 'Y' },
      ],
    });
    const { container } = render(<AiOverlayViolations violations={report} />);
    // Text breaks across nodes ("1 issue", " · ", "<strong>1 hard</strong>"),
    // so test against the wrapping span's textContent rather than a
    // single text node. Singular: no plural "s".
    expect(container.textContent).toMatch(/1 issue\b/);
    expect(container.textContent).not.toMatch(/1 issues/);
  });

  test('plural issue count uses "N issues"', () => {
    const report = makeReport({
      violations: [
        { kind: 'invented_entity', field: 'f', key: 'k1', label: 'A', detail: 'X' },
        { kind: 'renamed_entity',  field: 'f', key: 'k2', label: 'B', detail: 'Y' },
        { kind: 'removed_history_beat', field: 'f', key: 'k3', label: 'C', detail: 'Z' },
      ],
    });
    render(<AiOverlayViolations violations={report} />);
    expect(screen.getByText(/3 issues/)).toBeTruthy();
  });
});
