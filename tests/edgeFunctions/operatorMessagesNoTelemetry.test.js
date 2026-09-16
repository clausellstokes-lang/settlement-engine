/**
 * Operator Messages receipts are the dataset. Composition, delivery, and
 * reading must not mint a parallel product-analytics trail or cross the
 * fiction/reality register boundary.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = process.cwd();
const SURFACES = [
  ['src/components/admin/AdminBroadcastPanel.jsx', /export default function AdminBroadcastPanel/],
  ['src/components/admin/AdminDirectMessageDialog.jsx', /export default function AdminDirectMessageDialog/],
  ['src/components/account/AccountMessagesSection.jsx', /export default function AccountMessagesSection/],
  ['src/components/account/OperatorMessagesProvider.jsx', /export default function OperatorMessagesProvider/],
  ['src/lib/operatorMessages.js', /export async function listMyOperatorMessages/],
  ['supabase/functions/operator-message-worker/index.ts', /export async function handleOperatorMessageWorker/],
  ['supabase/functions/unsubscribe/index.ts', /export async function handleUnsubscribe/],
];

const ANALYTICS_EMISSION = /analyticsEvents|trackEvent|ingest-events|recordAnalytics/i;
const FICTION_REGISTER = /(?:from\s+['"][^'"]*(?:Herald|WizardNews)|<(?:Herald|WizardNews))/;

function boundaryViolations(source) {
  const violations = [];
  if (ANALYTICS_EMISSION.test(source)) violations.push('analytics emission');
  if (FICTION_REGISTER.test(source)) violations.push('fiction register');
  return violations;
}

describe('Operator Messages observability and register walls', () => {
  test('the detector catches both prohibited boundary crossings', () => {
    const planted = "import { trackEvent } from './analyticsEvents.js';\nconst view = <Herald />;";
    expect(boundaryViolations(planted)).toEqual(['analytics emission', 'fiction register']);
  });

  test('message surfaces import no analytics emitter and render no Herald component', () => {
    for (const [relative, liveExport] of SURFACES) {
      const source = fs.readFileSync(path.join(ROOT, relative), 'utf8');
      expect(source, `${relative} must still expose its live Operator Messages entry point`)
        .toMatch(liveExport);
      expect(boundaryViolations(source), `${relative} crossed the telemetry or fiction wall`)
        .toEqual([]);
    }
  });
});
