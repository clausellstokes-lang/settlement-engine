/**
 * StepIndicator.jsx — Advanced-wizard step dots.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. Renders a row of dots
 * marking progress through the advanced wizard's steps.
 */

import { GOLD, BORDER2, SP, R } from '../theme.js';

export function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{ display: 'flex', gap: R.md, justifyContent: 'center', padding: `${SP.sm}px 0` }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === currentStep ? 28 : 10,
            height: 10,
            borderRadius: R.sm + 1,
            background: i === currentStep ? GOLD : i < currentStep ? 'rgba(160,118,42,0.5)' : BORDER2,
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}
