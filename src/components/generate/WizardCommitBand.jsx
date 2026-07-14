/**
 * WizardCommitBand.jsx — the advanced wizard's pre-generate commit band.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx (the max-lines ratchet):
 * the full-width gold "Generate Draft" button, the expectation-setting
 * subline, and the inline generation error. Renders only in the advanced
 * close-out state (the parent gates on !settlement && wizardStep >=
 * STEPS.length) — post-generation re-rolls live in the sticky toolbar's
 * quiet Regenerate instead. Presentational; state stays in the parent.
 */

import { GOLD, SECOND, sans, serif_, SP, R, FS, swatch } from '../theme.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';

export function WizardCommitBand({ isMobile, handleGenerate, generateError }) {
  return (
    <div>
      <Button
        variant="primary"
        fullWidth
        onClick={handleGenerate}
        style={{
          padding: isMobile ? `${SP.lg}px 0` : `${SP.lg - 2}px 0`,
          background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
          color: swatch.white, border: 'none', borderRadius: R.lg + 2,
          fontFamily: serif_,
          fontSize: isMobile ? FS.xxl : FS.xxl - 1, fontWeight: 600, letterSpacing: '0.02em',
          boxShadow: '0 3px 14px rgba(160,118,42,0.45)',
          transition: 'opacity 0.15s, transform 0.1s',
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '0.92'}
        onFocus={e => e.currentTarget.style.opacity = '0.92'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
        onBlur={e => e.currentTarget.style.opacity = '1'}
      >
        Generate Draft
      </Button>
      <p className="sf-readable-strip" style={{
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: SP.sm, marginBottom: 0, textAlign: 'center',
        fontSize: FS.sm, color: SECOND, fontFamily: serif_, fontStyle: 'italic',
        lineHeight: 1.5,
      }}>
        {t('generate.subline')}
      </p>
      {generateError && (
        <div style={{
          marginTop: SP.sm,
          padding: `${SP.sm}px ${SP.md}px`,
          background: swatch.dangerBg,
          border: '1px solid #e8b0b0',
          borderRadius: R.md,
          color: swatch.danger,
          fontFamily: sans,
          fontSize: FS.sm,
        }}>
          {generateError}
        </div>
      )}
    </div>
  );
}
