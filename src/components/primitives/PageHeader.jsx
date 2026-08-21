import { FS, SP, INK, BODY, GOLD_DEEP, sans, serif_ } from '../theme.js';

/**
 * primitives/PageHeader — the canonical top-of-page header.
 *
 * One header idiom across every standalone surface (Library, Compendium,
 * Gallery, Pricing, Account, About, Admin): an optional uppercase-gold
 * eyebrow, a serif title, an optional italic serif subtitle, and a
 * right-aligned actions slot. Replaces the bespoke per-page headers each
 * surface used to roll, so the section title reads the same everywhere
 * and the squint test finds one focal title per page (P4 / P6 / P11).
 *
 * The title stays below the settlement-name display size on the dossier
 * so a page label never out-shouts a settlement's identity (P4).
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.eyebrow]   small uppercase gold kicker
 * @param {React.ReactNode} props.title       the serif page title
 * @param {React.ReactNode} [props.subtitle]  italic serif supporting line
 * @param {React.ReactNode} [props.actions]   right-aligned controls
 * @param {'lg'|'sm'} [props.size='lg']
 * @param {keyof JSX.IntrinsicElements} [props.as='h1']  heading element
 * @param {string} [props.id]                 id for the heading (aria-labelledby targets)
 */
export default function PageHeader({
  eyebrow, title, subtitle, actions,
  size = 'lg', as: Title = 'h1', id,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: SP.lg, flexWrap: 'wrap', marginBottom: SP.xl,
    }}>
      <div style={{ maxWidth: 660, minWidth: 0 }}>
        {eyebrow && (
          <div style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: GOLD_DEEP, marginBottom: SP.xs,
          }}>
            {eyebrow}
          </div>
        )}
        <Title id={id} style={{
          margin: 0, fontFamily: serif_,
          fontSize: size === 'lg' ? FS['28'] : FS['22'],
          fontWeight: 700, color: INK, lineHeight: 1.14,
        }}>
          {title}
        </Title>
        {subtitle && (
          <p style={{
            margin: `${SP.xs}px 0 0`, fontFamily: serif_,
            fontSize: FS.lg, fontStyle: 'italic',
            color: BODY, lineHeight: 1.5,
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
