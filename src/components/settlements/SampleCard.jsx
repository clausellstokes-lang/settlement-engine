import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_, FS, swatch, BODY } from '../theme.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';

// ── Sample dashboard ────────────────────────────────────────────────────────
// Rendered in the saves empty state. Three teaser cards seed expectations
// so new accounts never see "you have nothing — go figure it out." Forking
// loads the sample's config into the wizard with a user-suffixed seed.

export function SampleCard({ sample, onFork, forking }) {
  return (
    <article style={{
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${GOLD}`,
      borderRadius: 8,
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      fontFamily: sans,
      boxShadow: '0 2px 8px rgba(27,20,8,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <h4 style={{
          margin: 0, fontFamily: serif_, fontSize: FS['16'], fontWeight: 600,
          color: INK, lineHeight: 1.2,
        }}>
          {sample.name}
        </h4>
        <span style={{
          fontSize: FS.micro, fontWeight: 800, color: swatch['#7A5A1A'],
          background: 'rgba(201,162,76,0.14)',
          border: '1px solid rgba(201,162,76,0.45)',
          padding: '1px 6px', borderRadius: 999,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          Sample
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: FS.xs, color: MUTED,
          textTransform: 'capitalize',
        }}>
          {sample.tier} · {sample.terrain}
        </span>
      </div>
      <p style={{
        margin: 0, fontSize: FS['12.5'], color: BODY,
        fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.5,
      }}>
        {sample.teaser}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {sample.tags.map(tag => (
          <span key={tag} style={{
            fontSize: FS['9.5'], fontWeight: 700, color: SECOND,
            background: swatch['#FAF6EE'],
            border: `1px solid ${BORDER}`,
            padding: '1px 6px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {tag}
          </span>
        ))}
      </div>
      <Button
        variant="gold"
        size="sm"
        onClick={() => onFork(sample)}
        busy={forking}
        style={{ alignSelf: 'flex-start', marginTop: 4 }}
      >
        {forking ? 'Generating…' : t('generate.button')}
      </Button>
    </article>
  );
}
