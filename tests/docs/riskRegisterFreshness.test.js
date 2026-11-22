/**
 * Freshness walker for docs/RISK_REGISTER.md (docs-knowledge-5).
 *
 * The register carried a "Living document … source of truth going forward" banner
 * two eras stale (predating the spatial engine + the review program), and
 * CONTRIBUTING.md routed contributors to it "for current risks" — so the
 * designated pointer chain landed a reader two eras behind under a "living" label.
 * These pins keep the demotion (historical + pointers) from silently reverting and
 * keep CONTRIBUTING from re-routing to it as the live risk surface.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(resolve(here, rel), 'utf8');
const riskRegister = read('../../docs/RISK_REGISTER.md');
const contributing = read('../../CONTRIBUTING.md');

describe('RISK_REGISTER.md is demoted to historical, not the live risk surface (docs-knowledge-5)', () => {
  it('no longer claims to be the source of truth going forward', () => {
    expect(
      /source of truth going forward/i.test(riskRegister),
      'RISK_REGISTER.md must not re-claim "source of truth going forward" — it is historical.',
    ).toBe(false);
    expect(
      /^>\s*\*\*Living document/im.test(riskRegister),
      'RISK_REGISTER.md must not re-claim a "Living document" banner.',
    ).toBe(false);
  });

  it('points readers to the live risk surfaces', () => {
    expect(riskRegister, 'must point to the playbook for current risks').toMatch(
      /PHASE55_EXECUTION_PLAYBOOK\.md/,
    );
    expect(riskRegister, 'must point to a comprehensive review doc for current risks').toMatch(
      /COMPREHENSIVE_REVIEW_/,
    );
  });

  it('CONTRIBUTING.md does not route to the register as the current-risk surface', () => {
    expect(
      /RISK_REGISTER[^\n]*current risk/i.test(contributing),
      'CONTRIBUTING.md must not send contributors to RISK_REGISTER.md "for current risks".',
    ).toBe(false);
  });
});
